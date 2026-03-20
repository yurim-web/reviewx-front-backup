# 바이브코딩 진행 가이드

## 핵심 목표
Mock 데이터(json-server, localhost:3001) → 실제 백엔드 API로 전환

## 섹션별 진행 순서
**1단계: 파트너** → **2단계: 리뷰어** → **3단계: GA** → **4단계: SA**

## 파트너 기준 페이지별 순서
1. 로그인/회원가입
2. 대시보드 메인
3. 캠페인 등록/수정/삭제
4. 캠페인 관리 (상태별 조회)
5. 신청내역/콘텐츠 관리
6. 포인트 (충전/사용)
7. 마이페이지/알림

## 페이지마다 하는 작업
1. Confluence 백엔드 API 명세 확인
2. `src/lib/api/*.ts` → 실제 엔드포인트로 수정
3. `src/types/api/*.ts` → 실제 응답 타입으로 수정
4. `src/hooks/` → React Query 훅에서 API 연결
5. 컴포넌트에서 mock/localStorage 제거 → API 데이터 사용
6. 브라우저에서 확인

## 참고 자료
| 자료 | 용도 |
|------|------|
| Confluence 백엔드 API 명세 | 엔드포인트, 요청/응답 필드, 타입 |
| FUNCTIONAL_SPEC.md | UI 동작 규칙, 에러 메시지 |
| src/lib/api/client.ts | apiClient 설정 (Bearer, 401 처리) |
| 현재 코드 | 기존 mock 구조 파악 후 교체 |

## 백엔드 코드 필요 여부
필요 없음 — Confluence API 명세서에 엔드포인트, 요청/응답 형식이 모두 있음

## 바이브코딩 중 함께 처리할 항목 (코드 리뷰에서 deferred)
- SA localStorage → API 전환 (출금 훅, 대시보드 섹션 등 10건)
- progress.ts 50+ `as any` → 캠페인 타입 재설계
- localStorage/API 데이터 혼용 정리 (리뷰어 알림, 프로필, 출금 3건)
- `useCampaignContents.ts` window.location → usePathname
- GA 미사용 변수 (`_previous_active_*`)
