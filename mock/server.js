/**
 * json-server 커스텀 서버
 *
 * json-server CLI는 rewriter → middleware 순서로 실행하여
 * /partner/campaign/create 등의 경로가 /:id 패턴에 먼저 매칭됨.
 * 이 파일에서 middleware → rewriter 순서로 실행하여 문제 해결.
 */
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const defaults = jsonServer.defaults();
const routes = JSON.parse(
  require("fs").readFileSync(path.join(__dirname, "routes.json"), "utf-8")
);
const createMiddleware = require("./middleware.js");

// JSON body parser — 이미지 Data URL을 포함하므로 크기 제한 50MB로 확장
const bodyParser = require("body-parser");
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// multipart/form-data 파싱 (캠페인 등록/수정/임시저장 API)
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
server.use((req, res, next) => {
  const isMultipartRoute =
    req.path === "/partner/campaign/create" ||
    req.path === "/partner/campaign/draft" ||
    /^\/partner\/campaign\/edit\/\d+$/.test(req.path);
  const isMultipart =
    req.headers["content-type"] &&
    req.headers["content-type"].includes("multipart/form-data");
  if (isMultipartRoute && isMultipart) {
    return upload.any()(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  }
  next();
});

// CORS 허용 (defaults보다 먼저)
// withCredentials: true 사용 시 Access-Control-Allow-Origin에 * 대신 실제 Origin 필요
server.use((req, res, next) => {
  const origin = req.headers.origin || "http://localhost:3002";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 순서: CORS → body parser → 커스텀 미들웨어(router.db 주입) → 기본 설정 → 라우트 리라이터 → 라우터
server.use(createMiddleware(router.db));
server.use(defaults);
server.use(jsonServer.rewriter(routes));
// campaigns 응답 후처리: 모집 시작 전 캠페인은 appliedCount=0
router.render = (req, res) => {
  const data = res.locals.data;
  const isReviewerCampaign = req.originalUrl && req.originalUrl.startsWith("/reviewer/campaign");
  if (isReviewerCampaign && data) {
    const now = new Date();
    const sanitize = (c) => {
      if (!c || typeof c !== "object") return c;
      const recruitStartAt = (c.recruit && c.recruit.recruitStartAt) || c.recruitStartAt || "";
      if (recruitStartAt && new Date(recruitStartAt) > now) {
        c.appliedCount = 0;
        c.selectedCount = 0;
        if (c.metrics) {
          c.metrics = { ...c.metrics, appliedCount: 0, selectedCount: 0 };
        }
      }
      return c;
    };
    if (Array.isArray(data)) {
      res.jsonp(data.map(sanitize));
    } else {
      res.jsonp(sanitize(data));
    }
  } else {
    res.jsonp(data);
  }
};

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`json-server is running on port ${PORT}`);
});
