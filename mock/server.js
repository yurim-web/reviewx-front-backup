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
    /^\/partner\/campaign\/edit\//.test(req.path);
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

// ── ApiResponse wrapper ──
// 실제 백엔드는 모든 응답을 { result, generatedAt, data } 로 감싸므로
// mock 서버도 동일하게 감싸서 프론트엔드 API 함수와 호환시킴
function wrapApiResponse(body) {
  if (body == null) {
    return { result: "OK", generatedAt: new Date().toISOString(), data: null };
  }
  // 이미 { result, data } 구조 → generatedAt만 보충
  if (typeof body === "object" && !Array.isArray(body) && body.result && "data" in body) {
    if (!body.generatedAt) body.generatedAt = new Date().toISOString();
    return body;
  }
  // result는 있지만 data wrapper 없음 (flat 응답) → 나머지를 data로 이동
  if (typeof body === "object" && !Array.isArray(body) && body.result) {
    const { result, generatedAt, ...rest } = body;
    return {
      result,
      generatedAt: generatedAt || new Date().toISOString(),
      data: Object.keys(rest).length > 0 ? rest : null,
    };
  }
  // result 없음 (json-server 원본 데이터) → 전체를 data로 감싸기
  return { result: "OK", generatedAt: new Date().toISOString(), data: body };
}

// 리뷰어 인증 경로는 백엔드에서 ApiResponse를 사용하지 않으므로 제외
const NO_WRAP_PREFIXES = [
  "/api/v1/auth/",
  "/api/v1/reviewer/sign-up",
  "/api/admin/login",
  "/admin/login",
];

function shouldWrap(req) {
  return !NO_WRAP_PREFIXES.some((p) => req.path.startsWith(p));
}

// res.json()을 가로채서 ApiResponse wrapper 적용
server.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (shouldWrap(req)) {
      return originalJson(wrapApiResponse(body));
    }
    return originalJson(body);
  };
  next();
});

// 순서: CORS → body parser → ApiResponse wrapper → 커스텀 미들웨어(router.db 주입) → 기본 설정 → 라우트 리라이터 → 라우터
server.use(createMiddleware(router.db));
server.use(defaults);
server.use(jsonServer.rewriter(routes));
// campaigns 응답 후처리: 모집 시작 전 캠페인은 appliedCount=0
router.render = (req, res) => {
  let data = res.locals.data;
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
      data = data.map(sanitize);
    } else {
      data = sanitize(data);
    }
  }
  // router.render는 res.jsonp를 사용하므로 별도로 wrapping
  if (shouldWrap(req)) {
    res.jsonp(wrapApiResponse(data));
  } else {
    res.jsonp(data);
  }
};

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`json-server is running on port ${PORT}`);
});
