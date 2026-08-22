# 배포 기록 (포트폴리오용)

> 채용담당자/면접관이 실제 화면을 바로 확인할 수 있도록, 2026-08-22에 포트폴리오용 배포를 진행한 기록입니다.

## 배포 아키텍처

이 프로젝트는 프론트(Next.js)와 mock API 서버(json-server + Express 미들웨어)가 분리된 구조라, **서로 다른 두 플랫폼에 나눠 배포**했습니다.

```
사용자 브라우저
      │
      ▼
Vercel (Next.js 프론트)
https://reviewx-front-backup.vercel.app
      │  NEXT_PUBLIC_API_URL 로 호출
      ▼
Render (mock API 서버)
https://reviewx-mock-api.onrender.com
      │
      ▼
mock/db.json (json-server)
```

## 배포 정보

| 항목 | 값 |
|:---|:---|
| 배포일 | 2026-08-22 |
| 배포 커밋 | `b9494de7` (`main` / `deploy/portfolio` 동일) |
| 프론트엔드 | [Vercel](https://vercel.com) — GitHub `main` 브랜치 연동, push 시 자동 재배포 |
| 프론트엔드 URL | https://reviewx-front-backup.vercel.app |
| mock API 서버 | [Render](https://render.com) Free 플랜 — `render.yaml` Blueprint로 배포 |
| mock API URL | https://reviewx-mock-api.onrender.com |

## 진행 과정

### 1. mock 서버 배포 준비 (repo 수정)

Render 등 프로덕션 환경은 기본적으로 `devDependencies`를 설치하지 않을 수 있는데, `mock/server.js`가 런타임에 필요로 하는 `json-server` / `multer` / `body-parser`가 `devDependencies`에 있었음 → `dependencies`로 이동. ([`package.json`](../package.json) 커밋 `b9494de7`)

`render.yaml`을 repo 루트에 추가해 Render Blueprint로 한 번에 배포되도록 구성:
- Build Command: `npm install --legacy-peer-deps`
- Start Command: `npm run mock` (`node mock/server.js`, `process.env.PORT` 사용)
- Health Check Path: `/api/v1/reviewer/dashboard` (인증 불필요한 GET 엔드포인트)

### 2. Render — mock API 서버 배포

1. Render 대시보드 → New → **Blueprint** → GitHub repo(`yurim-web/reviewx-front-backup`, `main` 브랜치) 연결
2. `render.yaml` 자동 인식 → `reviewx-mock-api` 웹 서비스(Node, Free 플랜) 생성
3. 빌드 성공, `Deploy live` 확인 → URL 발급: `https://reviewx-mock-api.onrender.com`
4. `/api/v1/reviewer/dashboard` 호출해 실제 캠페인 JSON 응답 확인 완료

### 3. Vercel — 프론트엔드 배포

1. Vercel 대시보드 → Add New → Project → GitHub repo 연결
2. Framework Preset: Next.js (자동 감지)
3. Environment Variables 추가:
   - `NEXT_PUBLIC_API_URL` = `https://reviewx-mock-api.onrender.com`
4. Build and Output Settings → Install Command override:
   - `npm install --legacy-peer-deps`
   - (React 19와 `@toast-ui/react-editor@3.2.3`의 peer dependency 충돌 때문에 필요)
5. Deploy → 성공, URL 발급: `https://reviewx-front-backup.vercel.app`

### 4. 배포 후 검증 (Playwright로 실제 브라우저 테스트)

| 시나리오 | 결과 |
|:---|:---|
| `/user/login` → 네이버 로그인 버튼 클릭 | ✅ `/user/campaign_management/all`로 정상 이동, 콘솔 에러 0건 |
| `/partner/login` → `test@test.com` 로그인 | ✅ 로그인 성공, mock API(`/partner/session`, `/partner/dashboard`, `/partner/notifications`) 200 응답 |
| `/manager/login` → `manager_sa@test.com` 로그인 | ✅ `/manager_sa`로 정상 이동, API 200, 에러 0건 |

## 알려진 제약사항

- **Render 무료 플랜 콜드스타트**: 15분간 요청이 없으면 mock API 서버가 슬립 상태가 되고, 다음 요청 시 깨어나는 데 30~50초가 걸릴 수 있습니다. UptimeRobot 등으로 주기적 핑을 걸어 완화하는 걸 권장합니다 (README 배포 가이드 참고).
- **데이터 영속성 없음**: json-server가 `mock/db.json` 파일에 직접 쓰기 때문에, Render 재배포(redeploy) 시 데이터가 초기 상태로 리셋됩니다. 포트폴리오 데모 목적상 문제 없음.
- **모든 테스트 계정은 프론트엔드 mock 데이터**(`src/data/login/unifiedAccountData.ts`) 기반이며 실제 백엔드 인증이 아닙니다.

## 관련 커밋

- `b9494de7` — chore(deploy): 포트폴리오 배포 설정 추가 (Render blueprint, mock 서버 런타임 의존성 정리)
- `f888af03` — docs(readme): 테스트 계정 표에 리뷰어·최고관리자(SA) 계정 추가
