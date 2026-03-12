# 가상 서버 목업 연동 검증 체크리스트

가상 서버에 올린 목업(json-server)과 앱이 **완벽하게** 연동되는지 확인하기 위한 체크리스트입니다.

---

## 1. 환경 변수 (필수)

| 항목 | 설명 | 가상 서버 연동 시 |
|------|------|-------------------|
| `NEXT_PUBLIC_API_URL` | API 베이스 URL | **가상 서버 주소로 설정** (예: `http://192.168.x.x:3001` 또는 `https://mock.example.com`) |

- **위치**: `.env.local` (또는 배포 시 빌드 환경 변수)
- **주의**: Next.js는 `NEXT_PUBLIC_*` 값을 **빌드 시점에 인라인**합니다.  
  가상 서버로 붙이려면 **빌드 전에** `.env.local`에 가상 서버 URL을 넣고 `npm run build` 해야 합니다.
- 코드 상 `localhost:3001`은 **env 미설정 시 fallback**으로만 사용됩니다.  
  `NEXT_PUBLIC_API_URL`을 설정하면 가상 서버로만 요청이 나갑니다.

---

## 2. API 호출 경로 일관성

### 2.1 apiClient 사용 (baseURL = NEXT_PUBLIC_API_URL)

다음 모듈은 모두 `apiClient`를 쓰므로 **NEXT_PUBLIC_API_URL 한 곳만 맞추면** 가상 서버로 요청이 나갑니다.

| 파일 | 호출 예시 |
|------|-----------|
| `src/lib/api/client.ts` | `baseURL: process.env.NEXT_PUBLIC_API_URL` |
| `src/lib/api/partner.ts` | GET/POST `/campaigns`, `/campaigns/:id`, `/partners`, `/draft_campaigns` |
| `src/lib/api/admin.ts` | `/admin/campaign`, `/admin/campaign/:id`, `/partner/campaign/:id/applications` 등 |
| `src/lib/api/campaignContents.ts` | `/partner/campaign/:id/contents`, `/campaign_contents` |
| `src/lib/api/campaign.ts` | `/reviewer/campaign/delivery`, `/reviewer/campaign/visit` 등 |
| `src/lib/api/dashboard.ts` | `/reviewer/dashboard` |
| `src/lib/api/notification.ts` | `/notifications` |
| `src/lib/api/community.ts` | `/community/faq`, `/community/categories`, `/admin/community` |
| `src/lib/api/point.ts` | `/reviewer/mypage/withdrawal`, `/admin/withdrawal/:id`, `/partner/payment` |
| `src/lib/api/penalty.ts` | `/reviewer/penalty`, `/partner/penalty` 등 |
| `src/lib/api/reviewer.ts` | `/reviewer/mypage/profile/:id` 등 |

→ **검증**: `.env.local`에 가상 서버 URL 넣고 빌드 후, 위 API를 쓰는 화면에서 네트워크 탭으로 요청이 **가상 서버로** 나가는지 확인하면 됩니다.

### 2.2 fetch + process.env.NEXT_PUBLIC_API_URL (서버 컴포넌트)

다음은 **apiClient가 아닌 fetch**를 쓰지만, URL에 `process.env.NEXT_PUBLIC_API_URL`을 쓰므로 동일하게 가상 서버로 갑니다.

| 파일 | 용도 |
|------|------|
| `src/app/search/page.tsx` | `fetchSearchResults` → `${apiUrl}/reviewer/search` |
| `src/app/partner/search/page.tsx` | 동일 패턴 |
| `src/app/campaign/delivery/[id]/layout.tsx` | `fetchCampaignMeta` → `${apiUrl}/admin/campaign/${id}` |
| `src/app/campaign/visit/[id]/layout.tsx` | 동일 |
| `src/app/campaign/review/[id]/layout.tsx` | 동일 |
| `src/app/campaign/reporter/[id]/layout.tsx` | 동일 |
| `src/app/campaign/mission/[id]/layout.tsx` | 동일 |

- 공통: `const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";`  
→ **검증**: 가상 서버 URL이 빌드에 들어갔다면 이 fetch들도 가상 서버로 나갑니다.

---

## 3. 목업 서버 측 요구사항 (가상 서버에 넣은 파일)

가상 서버에서 **json-server**를 띄울 때 아래와 동일한 구성을 쓰면 됩니다.

| 항목 | 경로 | 비고 |
|------|------|------|
| DB 파일 | `mock/db.json` | 프로젝트의 `mock/db.json` 그대로 사용 |
| 라우트 | `mock/routes.json` | 프로젝트의 `mock/routes.json` 그대로 사용 |
| 실행 예시 | `json-server mock/db.json --port 3001 --routes mock/routes.json` | 포트는 가상 서버에 맞게 변경 가능 |

- **routes.json**  
  - 앱은 **두 가지 스타일**을 혼용합니다.  
    - **라우트 경로**: `/admin/campaign`, `/partner/campaign/:id/contents`, `/partner/campaign/:id/applications` 등 → routes.json으로 db 컬렉션과 매핑.  
    - **직접 경로**: `/campaigns`, `/campaigns/:id` (partner.ts) → db의 `campaigns` 컬렉션에 직접 접근.  
  - 따라서 가상 서버에도 **동일한 mock/db.json + mock/routes.json**을 두고, json-server를 **routes 옵션으로** 띄워야 합니다.

---

## 4. API를 쓰지 않고 정적/로컬만 쓰는 부분

다음은 **서버 API를 타지 않고** 정적 데이터 또는 localStorage만 씁니다.  
가상 서버가 있어도 이 부분은 “목업 서버 연동”과는 무관하게 동작합니다.

| 구분 | 위치 예시 | 비고 |
|------|-----------|------|
| 알림 배지/목록 | `mockPartnerNotifications`, `mockReviewerNotifications` (data/notification), SubHeader, PartnerHeader, Header | API 없이 정적 데이터 |
| 파트너 캠페인 콘텐츠 일부 | `getCampaignById`, `getClosedContentsById` (sharedCampaigns) | in-memory + localStorage, API와 병행 |
| 유저 캠페인 관리 일부 | `campaignManagementData.ts`, `useAppliedCampaigns` 등 | mock 서버 + localStorage 혼용 |
| 커뮤니티 게시글 | `postsData.ts` | localStorage와 mock 데이터 병합 |
| 결제/출금 일부 | `paymentHistoryData.ts`, `useWithdrawalApprove` 등 | mock API + localStorage |

→ **검증**: “가상 서버 연동”만 보면 위 목록은 제외하고, **2.1, 2.2**에서 실제로 요청이 가상 서버로 나가는지 확인하면 됩니다.

---

## 5. 확인 시 주의사항

1. **baseURL이 비어 있으면**  
   `NEXT_PUBLIC_API_URL`이 빌드 시 설정되지 않으면 `apiClient`의 `baseURL`이 `undefined`가 됩니다.  
   → 상대 경로 요청이 되어 **Next 서버 쪽**으로 갈 수 있으므로, 반드시 빌드 시점에 `NEXT_PUBLIC_API_URL`을 넣어야 합니다.

2. **CORS**  
   가상 서버(다른 origin)로 요청하므로, json-server/가상 서버에서 **CORS 허용**이 되어 있어야 합니다.  
   (로컬 3001과 동일하게 허용 정책 적용)

3. **빌드 한 번 더**  
   `.env.local`을 가상 서버 URL로 바꾼 뒤에는 `npm run build` (또는 `npm run dev` 재시작)을 해야 클라이언트/서버 컴포넌트 모두 새 URL을 사용합니다.

---

## 6. 요약 체크리스트

- [ ] 가상 서버에 `mock/db.json`, `mock/routes.json` 배치 후 json-server 실행
- [ ] `.env.local`에 `NEXT_PUBLIC_API_URL=<가상 서버 URL>` 설정
- [ ] `npm run build` 또는 dev 서버 재시작
- [ ] 브라우저 네트워크 탭에서 API 요청이 가상 서버로 나가는지 확인
- [ ] 파트너 캠페인 목록/상세, 캠페인 콘텐츠, 검색, 관리자/리뷰어 관련 API 등 주요 플로우 동작 확인

위가 모두 만족되면 **가상 서버 목업 연동은 의도대로 완료된 것**으로 보면 됩니다.

---

## 7. 꼼꼼 검증 요약 (코드베이스 기준)

| 검증 항목 | 결과 |
|-----------|------|
| axios 인스턴스 | **단일** `apiClient`만 사용, `baseURL: process.env.NEXT_PUBLIC_API_URL` |
| API 모듈 전부 | `admin.ts`, `partner.ts`, `campaign.ts`, `campaignContents.ts`, `dashboard.ts`, `notification.ts`, `community.ts`, `point.ts`, `penalty.ts`, `reviewer.ts`, `partnerPoint.ts` 등 **모두 apiClient만 사용** |
| fetch 사용처(서버) | `search/page.tsx`, `partner/search/page.tsx`, 캠페인 5종 `layout.tsx` → 모두 `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"` 사용 |
| localhost 하드코딩 | **없음**. 3001은 env 미설정 시 fallback으로만 사용. 3002는 Playwright/테스트 스크립트용(Next 앱 주소, API 아님) |
| mock db.json | routes.json에서 참조하는 리소스명(`campaigns`, `campaign_contents`, `dashboard`, `notifications` 등)이 db.json 최상위 키와 **일치** |
| 쓰기(PATCH/POST/PUT/DELETE) | 전부 apiClient 경유 → 가상 서버로 전달됨 |

---

## 8. 직접 확인하는 방법 (반응이 오는지 보는 법)

### 1) 브라우저에서 확인 (가장 쉬움)

1. Next 앱 실행 후 **F12** → **Network(네트워크)** 탭 연다.
2. **Fetch/XHR**만 보이게 필터 걸어두면 API 요청만 보인다.
3. 화면에서 **캠페인 목록 조회**, **검색**, **수정/저장** 등을 한다.
4. 네트워크 탭에서 요청을 클릭해 보면:
   - **Request URL**: `http://<가상서버주소>:3001/...` 처럼 **가상 서버 주소**로 나가야 한다. (localhost가 아니어야 함)
   - **Status**: `200` (성공)이면 서버가 정상 반응한 것이다.
   - **Response** 탭: 목업 데이터(JSON)가 보이면 가상 서버에서 온 응답이다.

**정리**: 요청 URL이 가상 서버이고, 상태 코드 200 + JSON 응답이 보이면 **반응 제대로 오는 것**이다.

### 2) 가상 서버 터미널에서 확인

가상 서버에서 json-server를 실행한 터미널을 보면, 요청이 올 때마다 로그가 찍힌다.

```text
GET /campaigns?partner_id=1 200
GET /campaigns/961 200
PATCH /campaign_contents/123 200
```

화면에서 조회/수정할 때마다 **이런 로그가 새로 뜨면** 가상 서버까지 요청이 도달한 것이다.

### 3) 수정/저장 시 어떤 반응이 오는지

| 동작 | 기대되는 반응 |
|------|----------------|
| 목록/상세 조회 | Network에 GET 요청 → Status 200, Response에 JSON 데이터 |
| 저장/수정 버튼 클릭 | PATCH 또는 PUT 요청 → 200, 화면이 갱신되거나 성공 처리 |
| 삭제 | DELETE 요청 → 200 |

### 3-1) 성공일 때 (가상 서버 정상 반응)

| 보이는 곳 | 무엇이 뜨는지 |
|-----------|----------------|
| **Network 탭** | Status **200** (또는 201). 요청 줄이 빨갛지 않음. |
| **Response 탭** | JSON 데이터(목록, 상세, 수정된 객체 등)가 보임. |
| **화면** | 목록/상세가 로딩되거나, 저장 후 "저장되었습니다" 같은 토스트/메시지, 또는 목록 갱신. |

### 3-2) 실패일 때 (무엇이 뜨는지)

| 상황 | Network 탭 | 화면/Console |
|------|------------|--------------|
| **가상 서버 꺼짐 / 주소 잘못** | Status **(failed)** 또는 빨간 줄. Request URL은 가상 서버로 나감. | Console에 `ERR_CONNECTION_REFUSED`, `Failed to fetch`, `Network Error` 등. 화면은 로딩 실패·에러 메시지. |
| **CORS 에러** | Status **(failed)**. Console에 `CORS policy`, `Access-Control-Allow-Origin` 관련 메시지. | 요청은 서버까지 갔지만 브라우저가 응답을 막음. |
| **서버 4xx/5xx** | Status **400**, **404**, **500** 등. Response 탭에 서버가 준 에러 메시지(JSON 또는 HTML). | 앱이 에러 메시지를 보여주거나 토스트로 "오류가 발생했습니다" 등. |
| **env 미적용** | Request URL이 **localhost:3002**(Next 앱) 쪽으로 나감. 가상 서버 주소가 아님. | 서버 라우트가 없으면 404. |

**요약**: 성공 = Network에서 **200** + Response에 데이터. 실패 = **(failed)** 또는 **4xx/5xx** + Console/화면에 에러.

### 4) `npm run mock` 하고 localhost:3001에서 보이는 것

`npm run mock` = **json-server**가 3001 포트에서 돌아감. 브라우저로 **localhost:3001** 열면:

| 보이는 것 | 설명 |
|-----------|------|
| **json-server 기본 화면** | 리소스 링크들(`/campaigns`, `/partners`, `/campaign_contents` 등)이 나옴. |
| **링크 클릭 시** | 해당 URL로 GET 요청이 가고, **응답 JSON**이 그대로 화면에 찍힘. → 이건 “3001 서버 반응”을 **직접** 보는 것. |

**한계**:  
- 3001 화면은 “지금 들어온 요청 목록”을 보여주지 않음.  
- **Next 앱(3002)에서 버튼 눌렀을 때 3001으로 어떤 요청이 갔는지**는 **3001 브라우저 탭에서는 못 봄**.  
- 그걸 보려면 **(1) mock 돌리는 터미널**에 찍히는 로그(`GET /campaigns 200` 등) 또는 **(2) Next 앱 탭(localhost:3002)** 에서 F12 → Network 탭으로 3001으로 나가는 요청을 봐야 함.

**정리**: 3001에서 “반응”을 **데이터로** 보려면 → 리소스 링크 눌러서 JSON 보기.  
**요청/성공·실패**를 보려면 → mock 터미널 로그 또는 Next 앱(3002) Network 탭.

### 5) env 적용 여부 확인

`.env.local`을 바꾼 뒤 **반드시** `npm run dev`를 다시 켜거나, `npm run build` 후 실행해야 한다.  
그 다음 Network 탭에서 **첫 API 요청 URL**이 가상 서버인지 확인하면 된다.
