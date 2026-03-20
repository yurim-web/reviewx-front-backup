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
const customMiddleware = require("./middleware.js");

// JSON body parser (커스텀 미들웨어가 req.body를 읽을 수 있도록)
server.use(jsonServer.bodyParser);

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

// 순서: CORS → body parser → 커스텀 미들웨어 → 기본 설정 → 라우트 리라이터 → 라우터
server.use(customMiddleware);
server.use(defaults);
server.use(jsonServer.rewriter(routes));
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`json-server is running on port ${PORT}`);
});
