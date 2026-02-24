# 프론트엔드 API 기능명세서 작성 계획

## 📊 전체 일정 요약

| 구분 | 일정 |
|------|------|
| 공통 | 1d |
| 리뷰어 | 3.5d |
| 파트너 | 5d |
| 버퍼 | 0.5d |

---

## [공통] 캠페인 관련 - 1d

### 캠페인 목록 페이지들 - 0.5d
- `/campaigns?type=delivery` - 배송형 캠페인 목록
- `/campaigns?type=visit` - 방문형 캠페인 목록
- `/campaigns?type=reporter` - 기자단 캠페인 목록
- `/campaigns?type=mission` - 미션형 캠페인 목록
- `/campaigns?type=review` - 구매평 캠페인 목록

### 캠페인 상세 페이지들 - 0.5d
- `/campaign/delivery/[id]` - 배송형 캠페인 상세
- `/campaign/visit/[id]` - 방문형 캠페인 상세
- `/campaign/reporter/[id]` - 기자단 캠페인 상세
- `/campaign/mission/[id]` - 미션형 캠페인 상세
- `/campaign/review/[id]` - 구매평 캠페인 상세

---

## [리뷰어] - 3.5d

### 인증 - 0.5d
- `/user/login` - 로그인
- `/user/signup` - 회원가입
- `/user/signup/complete` - 회원가입 완료
- `/user/find-account` - 계정 찾기

### 대시보드(메인) - 0.25d
- `/user` - 대시보드

### 캠페인 관리 - 0.5d
**전체/신청/선정/완료/취소·반려 탭들 (3h)**
- `/user/campaign_management` - 전체
- `/user/campaign_management/all` - 전체
- `/user/campaign_management/applied` - 신청
- `/user/campaign_management/selected` - 선정
- `/user/campaign_management/completed` - 완료
- `/user/campaign_management/cancelled` - 취소/반려

**패널티 페이지 (1h)**
- `/user/campaign_management/penalty` - 패널티

### 포인트 - 0.5d
**전체/적립/출금/적립예정 탭들 (3h)**
- `/user/point` - 포인트 메인
- `/user/point/all` - 전체
- `/user/point/earned` - 적립
- `/user/point/withdrawn` - 출금
- `/user/point/pending` - 적립 예정

**포인트 출금 신청 페이지 (1h)**
- `/user/point/withdrawal_request` - 출금 신청

### 마이페이지 - 0.5d
- `/user/mypage` - 마이페이지 메인
- `/user/mypage/profile` - 프로필 (30min)
- `/user/mypage/edit` - 내 정보 수정 (1h)
- `/user/mypage/channel` - 채널 (30min)
- `/user/mypage/address` - 배송지 관리 (1h)
- `/user/mypage/channel/connect` - 채널 연결 (1h)

### 커뮤니티(기타) - 0.5d
- `/user/notification` - 알림 내역 (2h)
- `/user/notice` - 공지사항 목록 (30min)
- `/user/notice/[id]` - 공지사항 상세 (30min)
- `/user/faq` - 자주 묻는 질문 (1h)

---

## [파트너] - 5d

### 인증 - 0.75d
- `/partner/login` - 로그인
- `/partner/signup` - 회원가입
- `/partner/signup/complete` - 회원가입 완료
- `/partner/find-account` - 아이디/비번 찾기
- `/partner/reset-password` - 비밀번호 재설정 (30min)
- `/partner/blocked` - 차단된 계정 페이지 (1h)
- `/partner/search` - 검색 페이지 (2h)

### 대시보드 - 0.25d
- `/partner` - 대시보드

### 캠페인 등록 - 0.75d
- `/partner/campaign/create` - 캠페인 등록 메인 (30min)
- `/partner/campaign/create/delivery` - 배송형 등록 (각 0.1d)
- `/partner/campaign/create/visit` - 방문형 등록
- `/partner/campaign/create/review` - 구매평 등록
- `/partner/campaign/create/reporter` - 기자단 등록
- `/partner/campaign/create/mission` - 미션형 등록

### 캠페인 수정 - 0.5d
- `/partner/campaign/edit/delivery/[id]` - 배송형 수정 (각 0.1d)
- `/partner/campaign/edit/visit/[id]` - 방문형 수정
- `/partner/campaign/edit/review/[id]` - 구매평 수정
- `/partner/campaign/edit/reporter/[id]` - 기자단 수정
- `/partner/campaign/edit/mission/[id]` - 미션형 수정

### 캠페인 관리 - 0.5d
**전체/예정/신청/진행/종료/취소/연장요청 탭들 (3h)**
- `/partner/campaign_management` - 전체
- `/partner/campaign_management/scheduled` - 예정
- `/partner/campaign_management/applied` - 신청
- `/partner/campaign_management/progress` - 진행
- `/partner/campaign_management/completed` - 종료
- `/partner/campaign_management/cancelled` - 취소
- `/partner/campaign_management/extension-request` - 연장요청

**패널티 페이지 (1h)**
- `/partner/campaign_management/penalty` - 패널티

### 캠페인 신청 내역 - 0.25d
**신청/선정 탭 (각 캠페인 타입별)**
- `/partner/campaign_application/delivery/[id]` - 배송형 신청 내역
- `/partner/campaign_application/visit/[id]` - 방문형 신청 내역
- `/partner/campaign_application/review/[id]` - 구매평 신청 내역
- `/partner/campaign_application/reporter/[id]` - 기자단 신청 내역
- `/partner/campaign_application/mission/[id]` - 미션형 신청 내역

### 캠페인 콘텐츠 내역 - 0.25d
**대기/확인/완료 탭 (각 캠페인 타입별)**
- `/partner/campaign_contents/delivery/[id]` - 배송형 콘텐츠 내역
- `/partner/campaign_contents/visit/[id]` - 방문형 콘텐츠 내역
- `/partner/campaign_contents/review/[id]` - 구매평 콘텐츠 내역
- `/partner/campaign_contents/reporter/[id]` - 기자단 콘텐츠 내역
- `/partner/campaign_contents/mission/[id]` - 미션형 콘텐츠 내역

### 포인트 - 0.25d
**전체/충전/사용 탭들 + 결제정보 모달 (2h)**
- `/partner/point` - 포인트 메인
- `/partner/point/all` - 전체
- `/partner/point/charge` - 충전 내역
- `/partner/point/earned` - 사용 내역
- `/partner/point/withdrawn` - 출금 내역

**포인트 충전하기 페이지 (무통장/신용카드) (2h)**
- `/partner/point/charge` - 포인트 충전 (무통장입금/신용카드)

### 마이페이지 - 0.25d
- `/partner/mypage` - 마이페이지 메인
- `/partner/mypage/profile` - 프로필 (30min)
- `/partner/mypage/edit` - 내 정보 수정 (1h)
- `/partner/mypage/edit?tab=password` - 비밀번호 변경 (30min)

### 커뮤니티(기타) - 0.5d
- `/partner/notification` - 알림 페이지 (2h)
- `/partner/notice` - 공지사항 목록 (30min)
- `/partner/notice/[id]` - 공지사항 상세 (30min)
- `/partner/faq` - 자주 묻는 질문 (1h)

---

## 💡 작성 원칙

1. **API 엔드포인트 명확히 정의**
   - Request: Method, URL, Headers, Body
   - Response: Status Code, Body Schema

2. **에러 처리 시나리오 포함**
   - 필수 입력값 누락
   - 권한 없음
   - 데이터 없음

3. **실제 사용 예시 포함**
   - Request/Response 샘플
   - cURL 예시

4. **페이지별 필요 API 목록화**
   - 초기 데이터 로드
   - 사용자 액션별 API
   - 실시간 업데이트 필요 여부

5. **화면 캡처 첨부**
   - 페이지별 실제 화면 캡처 이미지
   - 주요 사용자 플로우 스크린샷
   - API 호출 시점별 UI 상태

---

## 📝 작성 순서 제안

1. **공통 API** (인증, 공통 코드 등)
2. **리뷰어 핵심 플로우** (로그인 → 캠페인 신청 → 포인트)
3. **파트너 핵심 플로우** (로그인 → 캠페인 등록 → 신청자 관리)
4. **부가 기능** (알림, 공지사항, FAQ 등)
5. **전체 검토 및 누락 확인**
