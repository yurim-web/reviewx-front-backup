# ReviewX 프로젝트 가이드

## 📁 **프로젝트 폴더 구조**

```
reviewx-web/
├── src/
│   ├── app/                          # 📄 페이지 (Next.js App Router)
│   │   ├── page.tsx                  # 🏠 메인 홈페이지
│   │   ├── campaign/                 # 🎯 캠페인 관련 페이지
│   │   │   ├── delivery/              # 📦 배송형 캠페인
│   │   │   │   ├── page.tsx           # 배송형 목록 페이지
│   │   │   │   ├── layout.tsx        # 배송형 레이아웃
│   │   │   │   └── [id]/              # 배송형 상세 페이지
│   │   │   ├── visit/                 # 📍 방문형 캠페인
│   │   │   ├── review/                # 🛒 구매평 캠페인
│   │   │   ├── mission/               # 🎯 미션형 캠페인
│   │   │   └── reporter/              # 📰 기자단 캠페인
│   │   ├── user/                      # 👤 사용자 관련 페이지
│   │   │   ├── login/                 # 🔐 로그인
│   │   │   │   ├── page.tsx           # 로그인 페이지
│   │   │   │   └── layout.tsx         # 로그인 레이아웃
│   │   │   ├── signup/                # 📝 회원가입
│   │   │   │   ├── page.tsx           # 회원가입 페이지
│   │   │   │   ├── layout.tsx         # 회원가입 레이아웃
│   │   │   │   └── complete/          # ✅ 회원가입 완료
│   │   │   ├── sns_login/             # 🔗 SNS 로그인
│   │   │   ├── campaign_management/   # 📊 캠페인 관리 (사용자)
│   │   │   │   ├── page.tsx           # 메인 페이지 (신청 탭으로 리다이렉트)
│   │   │   │   ├── applied/           # 신청 탭 페이지
│   │   │   │   ├── selected/          # 선정 탭 페이지
│   │   │   │   ├── completed/         # 완료 탭 페이지
│   │   │   │   ├── cancelled/         # 취소/반려 탭 페이지
│   │   │   │   └── penalty/           # 패널티 탭 페이지
│   │   │   ├── mypage/                # 👤 마이페이지
│   │   │   │   ├── page.tsx           # 메인 페이지
│   │   │   │   ├── profile/           # 프로필 탭
│   │   │   │   ├── channel/           # 채널 탭
│   │   │   │   └── edit/              # 프로필 편집
│   │   │   ├── point/                 # 💰 포인트 관리
│   │   │   │   ├── page.tsx           # 메인 페이지
│   │   │   │   ├── all/               # 전체 탭
│   │   │   │   ├── earned/            # 적립 탭
│   │   │   │   ├── withdrawn/         # 출금 탭
│   │   │   │   └── withdrawal_request/ # 출금 신청
│   │   │   ├── notice/                # 📢 공지사항
│   │   │   └── faq/                   # ❓ FAQ
│   │   └── partner/                   # 🤝 파트너 관련 페이지
│   │       ├── login/                 # 🔐 파트너 로그인
│   │       │   ├── page.tsx           # 로그인 페이지
│   │       │   └── layout.tsx         # 로그인 레이아웃
│   │       ├── signup/                # 📝 파트너 회원가입
│   │       │   ├── page.tsx           # 회원가입 페이지
│   │       │   ├── layout.tsx         # 회원가입 레이아웃
│   │       │   └── complete/          # ✅ 회원가입 완료
│   │       ├── campaign_management/   # 📊 캠페인 관리 (파트너)
│   │       │   ├── page.tsx           # 전체 탭
│   │       │   ├── scheduled/         # 예정 탭
│   │       │   ├── applied/           # 신청 탭
│   │       │   ├── progress/          # 진행 탭
│   │       │   ├── completed/         # 종료 탭
│   │       │   ├── cancelled/         # 취소 탭
│   │       │   └── penalty/           # 패널티 탭
│   │       ├── campaign_application/  # 📋 신청내역 관리
│   │       │   └── [type]/            # 타입별 신청내역
│   │       │       └── [id]/          # 특정 캠페인 신청내역
│   │       ├── campaign_contents/     # 📝 콘텐츠 검수
│   │       │   └── [type]/            # 타입별 콘텐츠
│   │       │       └── [id]/          # 특정 캠페인 콘텐츠
│   │       ├── campaign/              # 🎯 캠페인 생성/수정
│   │       │   ├── create/           # ➕ 캠페인 생성
│   │       │   │   ├── delivery/      # 배송형 생성
│   │       │   │   ├── visit/         # 방문형 생성
│   │       │   │   ├── review/        # 구매평 생성
│   │       │   │   ├── mission/       # 미션형 생성
│   │       │   │   └── reporter/      # 기자단 생성
│   │       │   └── edit/              # ✏️ 캠페인 수정
│   │       │       └── [type]/        # 타입별 수정 폼
│   │       │           └── [id]/      # 특정 캠페인 수정
│   │       ├── point/                 # 💰 파트너 포인트 관리
│   │       │   ├── page.tsx           # 메인 페이지
│   │       │   ├── all/               # 전체 탭
│   │       │   ├── earned/            # 적립 탭
│   │       │   ├── withdrawn/         # 출금 탭
│   │       │   └── charge/            # 충전 탭
│   │       └── mypage/                # 👤 파트너 마이페이지
│   │           ├── page.tsx           # 메인 페이지
│   │           ├── profile/           # 프로필 탭
│   │           └── edit/              # 프로필 편집
│   ├── components/                   # 🧩 컴포넌트
│   │   ├── main/                     # 메인 페이지용 컴포넌트
│   │   │   ├── MainMenu.tsx          # 상단 네비게이션 메뉴
│   │   │   ├── CampaignBox.tsx       # 캠페인 카드
│   │   │   └── Titletext.tsx         # 페이지 제목
│   │   ├── user/                     # 사용자 관련 컴포넌트
│   │   │   ├── signup/               # 회원가입 컴포넌트
│   │   │   │   ├── PhoneVerification.tsx      # 휴대폰 인증
│   │   │   │   ├── TermsAgreement.tsx         # 약관 동의
│   │   │   │   ├── PasswordInput.tsx          # 비밀번호 입력
│   │   │   │   ├── PasswordConfirmInput.tsx   # 비밀번호 확인
│   │   │   │   ├── ExistingAccountModal.tsx  # 기존 계정 모달
│   │   │   │   └── hooks/                    # 회원가입 훅
│   │   │   │       ├── usePhoneVerification.ts
│   │   │   │       ├── useTermsAgreement.ts
│   │   │   │       └── useTimer.ts
│   │   │   ├── campaign_detail/      # 캠페인 상세용 컴포넌트
│   │   │   ├── campaign_management/  # 캠페인 관리용 컴포넌트
│   │   │   │   └── modals/           # 모달 컴포넌트들
│   │   │   ├── filter/               # 필터링 컴포넌트
│   │   │   ├── mypage/               # 마이페이지 컴포넌트
│   │   │   └── point/                 # 포인트 관련 컴포넌트
│   │   ├── partner/                  # 파트너 관련 컴포넌트
│   │   │   ├── signup/               # 파트너 회원가입 컴포넌트
│   │   │   │   ├── AddressInput.tsx           # 주소 입력
│   │   │   │   ├── BusinessRegistrationUpload.tsx  # 사업자등록증 업로드
│   │   │   │   ├── PartnerTermsAgreement.tsx   # 약관 동의
│   │   │   │   ├── FileUploadAlert.tsx        # 파일 업로드 알림
│   │   │   │   └── hooks/
│   │   │   │       └── usePartnerTermsAgreement.ts
│   │   │   ├── campaign_management/  # 캠페인 관리 컴포넌트
│   │   │   │   └── modals/           # 모달 컴포넌트들
│   │   │   ├── campaign_application/ # 신청내역 컴포넌트
│   │   │   ├── campaign_contents/    # 콘텐츠 관리 컴포넌트
│   │   │   └── campaign_create_form/  # 캠페인 생성 폼
│   │   ├── fragments/                # 공통 조각 컴포넌트
│   │   │   ├── Header.tsx            # 공통 헤더
│   │   │   ├── PartnerHeader.tsx    # 파트너 헤더
│   │   │   └── SubHeader.tsx         # 서브 헤더
│   │   └── mypage/                   # 공통 마이페이지 컴포넌트
│   │       ├── AddressInput.tsx      # 주소 입력
│   │       ├── PhoneVerificationInput.tsx  # 휴대폰 인증 입력
│   │       └── ProfilePhotoUpload.tsx      # 프로필 사진 업로드
│   ├── data/                         # 📊 데이터 파일
│   │   ├── user/                     # 사용자 관련 데이터
│   │   │   ├── delivery/             # 배송형 캠페인 데이터
│   │   │   ├── visit/                # 방문형 캠페인 데이터
│   │   │   ├── review/               # 구매평 캠페인 데이터
│   │   │   ├── mission/              # 미션형 캠페인 데이터
│   │   │   ├── reporter/             # 기자단 캠페인 데이터
│   │   │   ├── campaign_management/  # 캠페인 관리 데이터
│   │   │   └── point/                # 포인트 데이터
│   │   ├── partner/                  # 파트너 관련 데이터
│   │   │   ├── delivery.ts           # 배송형 캠페인 데이터
│   │   │   ├── visit.ts              # 방문형 캠페인 데이터
│   │   │   ├── review.ts             # 구매평 캠페인 데이터
│   │   │   ├── mission.ts            # 미션형 캠페인 데이터
│   │   │   ├── reporter.ts           # 기자단 캠페인 데이터
│   │   │   ├── sharedCampaigns.ts    # 공용 캠페인 데이터
│   │   │   ├── campaign_application/ # 신청내역 데이터
│   │   │   └── point/                 # 포인트 데이터
│   │   ├── login/                    # 로그인 테스트 데이터
│   │   │   └── testLoginData.ts      # 테스트용 로그인 데이터
│   │   └── faq/                      # FAQ 데이터
│   │       └── faqData.ts
│   ├── styles/                       # 🎨 CSS 파일
│   │   ├── user/                     # 사용자 스타일
│   │   │   ├── login/                # 로그인 스타일
│   │   │   ├── signup/               # 회원가입 스타일
│   │   │   ├── campaign/             # 캠페인 스타일
│   │   │   ├── campaign_management/  # 캠페인 관리 스타일
│   │   │   ├── mypage/               # 마이페이지 스타일
│   │   │   └── point/                # 포인트 스타일
│   │   ├── partner/                  # 파트너 스타일
│   │   │   ├── login/                # 로그인 스타일
│   │   │   ├── signup/               # 회원가입 스타일
│   │   │   ├── campaign_management/  # 캠페인 관리 스타일
│   │   │   ├── campaign_application/ # 신청내역 스타일
│   │   │   ├── campaign_contents/    # 콘텐츠 관리 스타일
│   │   │   ├── campaign_create/      # 캠페인 생성 스타일
│   │   │   └── point/                # 포인트 스타일
│   │   ├── login/                    # 공통 로그인 스타일
│   │   └── fragments/                # 공통 조각 스타일
│   ├── utils/                        # 🛠️ 유틸리티 함수
│   │   ├── user/                     # 사용자 유틸리티
│   │   │   └── signup/               # 회원가입 유틸리티
│   │   │       ├── formValidation.ts  # 폼 검증
│   │   │       ├── phoneUtils.ts      # 휴대폰 번호 유틸리티
│   │   │       ├── timerUtils.ts      # 타이머 유틸리티
│   │   │       └── validation.ts      # 검증 함수
│   │   ├── partner/                  # 파트너 유틸리티
│   │   │   └── signup/               # 회원가입 유틸리티
│   │   │       ├── businessNumberUtils.ts  # 사업자번호 유틸리티
│   │   │       ├── formValidation.ts       # 폼 검증
│   │   │       └── validation.ts           # 검증 함수
│   │   ├── cardTypeMapper.ts         # 카드 타입 매퍼
│   │   └── channelLogoMap.ts         # 채널 로고 맵
│   └── types/                        # 📝 TypeScript 타입 정의
│       ├── user/                     # 사용자 타입
│       └── partner/                  # 파트너 타입
└── public/                           # 🖼️ 이미지 등 정적 파일
    └── images/                       # 이미지 파일들
```

---

## 🧩 **컴포넌트 구조 및 사용처**

### **📂 main/** - 메인 페이지용 컴포넌트

| 컴포넌트    | 파일              | 사용 페이지 | 용도                           |
| ----------- | ----------------- | ----------- | ------------------------------ |
| MainMenu    | `MainMenu.tsx`    | 15개 페이지 | 상단 네비게이션 메뉴           |
| CampaignBox | `CampaignBox.tsx` | 6개 페이지  | 캠페인 카드 (가장 많이 사용됨) |
| Titletext   | `Titletext.tsx`   | 6개 페이지  | 페이지 제목                    |

### **📂 user/signup/** - 사용자 회원가입 컴포넌트 ⭐ **신규**

| 컴포넌트             | 파일                       | 사용 페이지 | 용도                |
| -------------------- | -------------------------- | ----------- | ------------------- |
| PhoneVerification    | `PhoneVerification.tsx`    | 1개 페이지  | 휴대폰 번호 인증    |
| TermsAgreement       | `TermsAgreement.tsx`       | 1개 페이지  | 약관 동의 체크박스  |
| PasswordInput        | `PasswordInput.tsx`        | 1개 페이지  | 비밀번호 입력       |
| PasswordConfirmInput | `PasswordConfirmInput.tsx` | 1개 페이지  | 비밀번호 확인 입력  |
| ExistingAccountModal | `ExistingAccountModal.tsx` | 1개 페이지  | 기존 계정 존재 모달 |

**훅 (Hooks):**

- `hooks/usePhoneVerification.ts` - 휴대폰 인증 로직
- `hooks/useTermsAgreement.ts` - 약관 동의 로직
- `hooks/useTimer.ts` - 인증 타이머 로직

### **📂 partner/signup/** - 파트너 회원가입 컴포넌트 ⭐ **신규**

| 컴포넌트                   | 파일                             | 사용 페이지 | 용도                |
| -------------------------- | -------------------------------- | ----------- | ------------------- |
| AddressInput               | `AddressInput.tsx`               | 1개 페이지  | 주소 입력           |
| BusinessRegistrationUpload | `BusinessRegistrationUpload.tsx` | 1개 페이지  | 사업자등록증 업로드 |
| PartnerTermsAgreement      | `PartnerTermsAgreement.tsx`      | 1개 페이지  | 약관 동의 체크박스  |
| FileUploadAlert            | `FileUploadAlert.tsx`            | 1개 페이지  | 파일 업로드 알림    |

**훅 (Hooks):**

- `hooks/usePartnerTermsAgreement.ts` - 파트너 약관 동의 로직

### **📂 user/campaign_management/** - 캠페인 관리용 컴포넌트 (사용자)

| 컴포넌트       | 파일                 | 사용 페이지 | 용도                                     |
| -------------- | -------------------- | ----------- | ---------------------------------------- |
| TabNavigation  | `TabNavigation.tsx`  | 8개 페이지  | 메인 탭 (캠페인/포인트/계정)             |
| StatisticsTab  | `StatisticsTab.tsx`  | 5개 페이지  | 통계 탭 (신청/선정/완료/취소반려/패널티) |
| CampaignList   | `CampaignList.tsx`   | 4개 페이지  | 캠페인 목록 컨테이너                     |
| CampaignCard   | `CampaignCard.tsx`   | 4개 페이지  | 개별 캠페인 카드                         |
| PenaltyContent | `PenaltyContent.tsx` | 1개 페이지  | 패널티 내역 화면                         |
| CampaignTag    | `CampaignTag.tsx`    | 4개 페이지  | 태그들 (마감임박, 타입 등)               |

**모달 컴포넌트:**

- `modals/ContentRegistrationModal.tsx` - 콘텐츠 등록 모달
- `modals/ImageUploadModal.tsx` - 이미지 업로드 모달
- `modals/CombinedContentModal.tsx` - 통합 콘텐츠 모달

### **📂 partner/campaign_management/** - 캠페인 관리용 컴포넌트 (파트너)

| 컴포넌트                        | 파일                                  | 사용 페이지 | 용도                                    |
| ------------------------------- | ------------------------------------- | ----------- | --------------------------------------- |
| PartnerCampaignManagementHeader | `PartnerCampaignManagementHeader.tsx` | 6개 페이지  | 파트너 캠페인 관리 공통 헤더            |
| TabNavigation                   | `TabNavigation.tsx`                   | 6개 페이지  | 메인 탭 (캠페인/포인트/계정)            |
| StatisticsTab                   | `StatisticsTab.tsx`                   | 6개 페이지  | 통계 탭 (전체/예정/신청/진행/종료/취소) |
| CampaignList                    | `CampaignList.tsx`                    | 6개 페이지  | 캠페인 목록 컨테이너                    |
| CampaignCard                    | `CampaignCard.tsx`                    | 6개 페이지  | 개별 캠페인 카드                        |
| CampaignManagementModal         | `modals/CampaignManagementModal.tsx`  | 6개 페이지  | 캠페인 관리 모달 (수정/삭제)            |

**주요 기능:**

- "캠페인 관리하기" 버튼 클릭 시 모달 표시
- 모달에서 캠페인 수정/삭제 옵션 제공
- 캠페인 타입에 따른 수정 페이지 자동 라우팅

---

## 📄 **페이지별 API 요구사항 및 데이터 구조**

### **🏠 메인 홈페이지** - `/` (`app/page.tsx`)

**사용 컴포넌트**: MainMenu, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/main
- 선정 확률 높은 캠페인 목록 (8개)
- 지금 인기 많은 캠페인 목록 (8개)
```

### **📦 배송형 페이지** - `/campaign/delivery` (`app/campaign/delivery/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/delivery
- 배송형 캠페인 목록 (16개)
- 필터링 옵션 (카테고리, 채널, 정렬)

GET /api/campaigns/delivery/filters
- 카테고리: ["전체", "식품", "뷰티", "가전", "유아동", "여가", "서비스", "생활", "패션", "가구", "디지털", "문화", "반려동물", "기타"]
- 채널: ["네이버 블로그", "네이버 클립", "인스타그램", "릴스", "유튜브", "쇼츠"]
- 정렬: ["최신순", "인기순", "마감임박순", "포인트순"]
```

### **📍 방문형 페이지** - `/campaign/visit` (`app/campaign/visit/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/visit
GET /api/campaigns/visit/filters
```

### **🛒 구매평 페이지** - `/campaign/review` (`app/campaign/review/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/review
GET /api/campaigns/review/filters
```

### **🎯 미션형 페이지** - `/campaign/mission` (`app/campaign/mission/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/mission
GET /api/campaigns/mission/filters
```

### **📰 기자단 페이지** - `/campaign/reporter` (`app/campaign/reporter/page.tsx`)

**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext  
**필요한 API**:

```
GET /api/campaigns/reporter
GET /api/campaigns/reporter/filters
```

### **🔍 캠페인 상세 페이지** - `/campaign/delivery/[id]` (`app/campaign/delivery/[id]/page.tsx`)

**사용 컴포넌트**: SubHeader, DetailHeader, DetailProductInfo, DetailScheduleInfo, DetailImage, DetailGuidelinesSectionDelivery, ApplicationModal  
**필요한 API**:

```
GET /api/campaigns/delivery/{id}
- 캠페인 상세 정보
- 가이드라인 텍스트
- 요구사항 목록

POST /api/campaigns/delivery/{id}/apply
- 캠페인 신청
```

### **🔐 로그인/회원가입 페이지** ⭐ **신규**

#### **사용자 로그인** - `/user/login` (`app/user/login/page.tsx`)

**필요한 API**:

```
POST /api/user/login
- 아이디(이메일), 비밀번호로 로그인
- 자동 로그인 옵션 지원
- 응답: JWT 토큰 또는 세션 정보
```

#### **사용자 회원가입** - `/user/signup` (`app/user/signup/page.tsx`)

**사용 컴포넌트**: PhoneVerification, TermsAgreement, PasswordInput, PasswordConfirmInput  
**필요한 API**:

```
POST /api/user/signup
- 아이디(이메일), 비밀번호, 이름, 휴대폰 번호, 약관 동의 정보

POST /api/user/phone/verify
- 휴대폰 번호 인증번호 발송

POST /api/user/phone/confirm
- 인증번호 확인

GET /api/user/check-email
- 이메일 중복 확인
```

#### **파트너 로그인** - `/partner/login` (`app/partner/login/page.tsx`)

**필요한 API**:

```
POST /api/partner/login
- 아이디(이메일), 비밀번호로 로그인
- 자동 로그인 옵션 지원
- 응답: JWT 토큰 또는 세션 정보
```

#### **파트너 회원가입** - `/partner/signup` (`app/partner/signup/page.tsx`)

**사용 컴포넌트**: AddressInput, BusinessRegistrationUpload, PartnerTermsAgreement  
**필요한 API**:

```
POST /api/partner/signup
- 아이디(이메일), 비밀번호, 회사명, 사업자등록번호, 주소, 약관 동의 정보
- 사업자등록증 파일 업로드

POST /api/partner/business-number/verify
- 사업자등록번호 검증
```

### **📊 캠페인 관리 페이지들 (사용자)**

#### **신청 탭** - `/user/campaign_management/applied`

**사용 컴포넌트**: TabNavigation, StatisticsTab, CampaignList, CampaignCard  
**필요한 API**:

```
GET /api/user/campaigns?status=신청
- 사용자 신청 상태 캠페인 목록
- 통계 정보 (신청/선정/완료/취소반려/패널티 개수)
```

#### **선정 탭** - `/user/campaign_management/selected`

**필요한 API**:

```
GET /api/user/campaigns?status=선정
- 사용자 선정 상태 캠페인 목록
```

#### **완료 탭** - `/user/campaign_management/completed`

**필요한 API**:

```
GET /api/user/campaigns?status=완료
- 사용자 완료 상태 캠페인 목록
```

#### **취소/반려 탭** - `/user/campaign_management/cancelled`

**필요한 API**:

```
GET /api/user/campaigns?status=취소/반려
- 사용자 취소/반려 상태 캠페인 목록
```

#### **패널티 탭** - `/user/campaign_management/penalty`

**필요한 API**:

```
GET /api/user/penalty
- 사용자 현재 패널티 상태
- 패널티 내역 목록
```

### **🤝 파트너 캠페인 관리 페이지들**

#### **전체 탭** - `/partner/campaign_management`

**사용 컴포넌트**: PartnerCampaignManagementHeader, CampaignList, CampaignCard, CampaignManagementModal  
**필요한 API**:

```
GET /api/partner/campaigns
- 파트너의 모든 캠페인 목록
- 통계 정보 (전체/예정/신청/진행/종료/취소 개수)

GET /api/partner/campaigns/{id}
- 캠페인 상세 정보

PUT /api/partner/campaigns/{id}
- 캠페인 수정

DELETE /api/partner/campaigns/{id}
- 캠페인 삭제
```

#### **예정 탭** - `/partner/campaign_management/scheduled`

**필요한 API**:

```
GET /api/partner/campaigns?status=예정
- 예정 상태 캠페인 목록
```

#### **신청 탭** - `/partner/campaign_management/applied`

**필요한 API**:

```
GET /api/partner/campaigns?status=신청
- 신청 상태 캠페인 목록
```

#### **진행 탭** - `/partner/campaign_management/progress\*\*

**필요한 API**:

```
GET /api/partner/campaigns?status=진행
- 진행 상태 캠페인 목록
```

#### **종료 탭** - `/partner/campaign_management/completed`

**필요한 API**:

```
GET /api/partner/campaigns?status=종료
- 종료 상태 캠페인 목록
```

#### **취소 탭** - `/partner/campaign_management/cancelled`

**필요한 API**:

```
GET /api/partner/campaigns?status=취소
- 취소 상태 캠페인 목록
```

### **👤 마이페이지들 (사용자)**

#### **프로필 탭** - `/user/mypage/profile`

**필요한 API**:

```
GET /api/user/profile
- 사용자 프로필 정보

PUT /api/user/profile
- 프로필 수정
```

#### **채널 탭** - `/user/mypage/channel`

**필요한 API**:

```
GET /api/user/channels
- 사용자 연결된 채널 목록

POST /api/user/channels
- 채널 연결

DELETE /api/user/channels/{channelId}
- 채널 연결 해제
```

### **💰 포인트 페이지들 (사용자)**

#### **전체 탭** - `/user/point/all`

**필요한 API**:

```
GET /api/user/points
- 포인트 요약 정보 (총 보유, 출금 가능, 대기 중)
- 모든 포인트 내역 (적립/출금)

POST /api/user/points/withdrawal
- 출금 신청
```

#### **적립 탭** - `/user/point/earned`

**필요한 API**:

```
GET /api/user/points?type=earned
- 적립 포인트 내역만 필터링
```

#### **출금 탭** - `/user/point/withdrawn`

**필요한 API**:

```
GET /api/user/points?type=withdrawn
- 출금 관련 포인트 내역만 필터링
```

---

## 📊 **데이터 구조 및 ID 값 설명**

### **📂 data/** 구조

```
data/
├── user/
│   ├── delivery/              # 배송형 캠페인 데이터
│   ├── visit/                 # 방문형 캠페인 데이터
│   ├── review/                # 구매평 캠페인 데이터
│   ├── mission/               # 미션형 캠페인 데이터
│   ├── reporter/              # 기자단 캠페인 데이터
│   ├── campaign_management/   # 캠페인 관리 데이터
│   └── point/                 # 포인트 데이터
├── partner/
│   ├── delivery.ts            # 배송형 캠페인 데이터
│   ├── visit.ts               # 방문형 캠페인 데이터
│   ├── review.ts              # 구매평 캠페인 데이터
│   ├── mission.ts             # 미션형 캠페인 데이터
│   ├── reporter.ts            # 기자단 캠페인 데이터
│   ├── sharedCampaigns.ts     # 공용 캠페인 데이터
│   ├── campaign_application/  # 신청내역 데이터
│   └── point/                 # 포인트 데이터
├── login/                     # 로그인 테스트 데이터
│   └── testLoginData.ts       # 테스트용 로그인 데이터
└── faq/                       # FAQ 데이터
    └── faqData.ts
```

### **🔑 ID 값 설명**

#### **캠페인 ID 형식**

- **배송형**: `delivery_1`, `delivery_2`, ..., `delivery_16`
- **방문형**: `visit_1`, `visit_2`, ..., `visit_16`
- **구매평**: `review_1`, `review_2`, ..., `review_16`
- **미션형**: `mission_1`, `mission_2`, ..., `mission_16`
- **기자단**: `reporter_1`, `reporter_2`, ..., `reporter_16`

#### **사용자 ID**

- **형식**: 숫자형 자동증가 (1, 2, 3, ...)
- **용도**: 사용자 고유 식별자

#### **파트너 ID**

- **형식**: 숫자형 자동증가 (1, 2, 3, ...)
- **용도**: 파트너 고유 식별자

#### **포인트 내역 ID**

- **형식**: 숫자형 자동증가 (1, 2, 3, ...)
- **용도**: 포인트 거래 내역 고유 식별자

### **📋 주요 데이터 구조**

#### **파트너 캠페인 데이터 구조**

```typescript
interface PartnerCampaign {
  id: string; // 캠페인 고유 ID
  title: string; // 캠페인 제목
  image: string; // 캠페인 대표 이미지
  status: '대기 중' | '모집 중' | '진행 중' | '종료' | '취소';
  campaignType: '배송형' | '방문형' | '구매평' | '기자단' | '미션형';
  category: string; // 카테고리
  brandName: string; // 브랜드명
  recruitmentPeriod: string; // 모집 기간
  announcementDate: string; // 선정 날짜
  registrationPeriod: string; // 등록 기간
  purchasedPeriod?: string; // 구매 기간 (구매평용)
  recruitedCount: number; // 현재 모집된 인원
  totalCount: number; // 전체 모집 인원
  daysLeft: number; // 선정까지 남은 일수
  subStatus?: string; // 서브 상태 (버튼 종류 결정)
}
```

#### **패널티 데이터 구조**

```typescript
interface PenaltyHistory {
  id: string; // 패널티 내역 ID
  type: '경고' | '주의' | '정지' | '제재'; // 패널티 분류
  title: string; // 패널티 제목/사유
  date: string; // 발생 날짜 (YYYY-MM-DD 형식)
  campaign_id?: string; // 관련 캠페인 ID
}

interface UserPenaltyStatus {
  currentStatus:
    | '활동 가능'
    | '경고 조치'
    | '이용 정지 7일'
    | '이용 정지 15일'
    | '이용 정지 30일'
    | '영구 정지';
  penaltyCount: number; // 총 패널티 횟수
}
```

#### **포인트 데이터 구조**

```typescript
interface PointHistory {
  id: string; // 포인트 내역 ID
  type: 'earned' | 'withdrawn'; // 적립/출금 타입
  amount: number; // 포인트 금액
  description: string; // 내역 설명
  campaign_id?: string; // 관련 캠페인 ID
  date: string; // 날짜
  status: 'earned' | 'completed' | 'pending' | 'failed';
  balance: number; // 거래 후 잔액
}
```

#### **회원가입 데이터 구조** ⭐ **신규**

```typescript
// 사용자 회원가입
interface UserSignupForm {
  email: string; // 이메일 (아이디)
  password: string; // 비밀번호
  passwordConfirm: string; // 비밀번호 확인
  name: string; // 이름
  phone: string; // 휴대폰 번호
  phoneVerified: boolean; // 휴대폰 인증 완료 여부
  termsAgreed: {
    service: boolean; // 서비스 이용약관
    privacy: boolean; // 개인정보 처리방침
    marketing: boolean; // 마케팅 정보 수신 동의 (선택)
  };
}

// 파트너 회원가입
interface PartnerSignupForm {
  email: string; // 이메일 (아이디)
  password: string; // 비밀번호
  passwordConfirm: string; // 비밀번호 확인
  companyName: string; // 회사명
  businessNumber: string; // 사업자등록번호
  businessRegistrationFile: File | null; // 사업자등록증 파일
  address: {
    postcode: string; // 우편번호
    address: string; // 주소
    detailAddress: string; // 상세주소
  };
  termsAgreed: {
    service: boolean; // 서비스 이용약관
    privacy: boolean; // 개인정보 처리방침
    marketing: boolean; // 마케팅 정보 수신 동의 (선택)
  };
}
```

---

## 🔄 **컴포넌트 재사용성 및 중요도**

### **가장 많이 재사용되는 컴포넌트 (백엔드 개발 시 우선순위)**

1. **MainMenu** - 15개 페이지에서 사용 ⭐⭐⭐
2. **CampaignBox** - 6개 페이지에서 사용 ⭐⭐⭐
3. **TabNavigation** - 14개 페이지에서 사용 (유저 8개 + 파트너 6개) ⭐⭐⭐
4. **CampaignCard** - 10개 페이지에서 사용 (유저 4개 + 파트너 6개) ⭐⭐⭐
5. **FilterBar** - 5개 페이지에서 사용 ⭐⭐
6. **StatisticsTab** - 11개 페이지에서 사용 (유저 5개 + 파트너 6개) ⭐⭐⭐

### **페이지별 전용 컴포넌트**

- **캠페인 상세**: DetailHeader, DetailImage, DetailProductInfo 등
- **파트너 캠페인 관리**: CampaignManagementModal
- **필터링**: ModalFilter, RegionFilter
- **회원가입**: PhoneVerification, TermsAgreement, BusinessRegistrationUpload 등 ⭐ **신규**

---

## 🛠️ **백엔드 개발 시 참고사항**

### **API 개발 우선순위**

1. **1순위**: 인증/인가 API ⭐ **신규**
   - 사용자/파트너 로그인
   - 사용자/파트너 회원가입
   - 휴대폰 인증
   - 사업자등록번호 검증
2. **2순위**: 캠페인 목록 API (5개 타입별) - 사용자/파트너 공통
3. **3순위**: 캠페인 상세 API (5개 타입별)
4. **4순위**: 파트너 캠페인 관리 API
   - 캠페인 목록 조회
   - 캠페인 수정 (PUT)
   - 캠페인 삭제 (DELETE)
5. **5순위**: 사용자 관련 API (캠페인 신청, 포인트)

### **데이터베이스 설계 시 주의사항**

- **캠페인 ID**: 문자열 형식 (`delivery_1`, `visit_2` 등)
- **사용자 ID**: 숫자형 자동증가
- **파트너 ID**: 숫자형 자동증가
- **포인트**: 정수형 (원 단위)
- **날짜**: ISO 8601 형식 (`2025-01-20`)
- **캠페인 상태**:
  - 사용자: `"신청" | "선정" | "완료" | "취소/반려"`
  - 파트너: `"대기 중" | "모집 중" | "진행 중" | "종료" | "취소"`
- **패널티 상태**: enum 타입 (활동 가능, 경고 조치, 이용 정지 7일/15일/30일, 영구 정지)
- **인증 정보**:
  - 이메일: 유니크 제약조건
  - 비밀번호: 해시화하여 저장
  - 휴대폰 번호: 인증 완료 여부 필드 필요

### **API 응답 형식**

```json
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "message": "성공",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

---

## 📝 **주요 타입 정의 (백엔드 개발 참고)**

### **캠페인 관련 타입**

```typescript
// 캠페인 타입
type CampaignType = '배송형' | '방문형' | '구매평' | '미션형' | '기자단';

// 사용자 캠페인 상태
type UserCampaignStatus = '신청' | '선정' | '완료' | '취소/반려';

// 파트너 캠페인 상태
type PartnerCampaignStatus =
  | '대기 중'
  | '모집 중'
  | '진행 중'
  | '종료'
  | '취소';

// 필터 옵션
type FilterCategory =
  | '전체'
  | '식품'
  | '뷰티'
  | '가전'
  | '유아동'
  | '여가'
  | '서비스'
  | '생활'
  | '패션'
  | '가구'
  | '디지털'
  | '문화'
  | '반려동물'
  | '기타';
type FilterChannel =
  | '네이버 블로그'
  | '네이버 클립'
  | '인스타그램'
  | '릴스'
  | '유튜브'
  | '쇼츠';
type SortOption = '최신순' | '인기순' | '마감임박순' | '포인트순';
```

### **사용자 관련 타입**

```typescript
// 캠페인 관리 탭
type MainTab = 'campaign' | 'point' | 'account' | 'community';
type StatTab = '신청' | '선정' | '완료' | '취소/반려' | '패널티';

// 패널티 관련
type PenaltyStatus =
  | '활동 가능'
  | '경고 조치'
  | '이용 정지 7일'
  | '이용 정지 15일'
  | '이용 정지 30일'
  | '영구 정지';

type PenaltyType = '경고' | '주의' | '정지' | '제재';

// 포인트 관련
type PointType = 'earned' | 'withdrawn';
type PointStatus = 'earned' | 'completed' | 'pending' | 'failed';
```

### **파트너 관련 타입**

```typescript
// 파트너 메인 탭
type PartnerMainTab = 'campaign' | 'point' | 'account';

// 파트너 통계 탭
type PartnerStatTab = '전체' | '예정' | '신청' | '진행' | '종료' | '취소';
```

### **인증 관련 타입** ⭐ **신규**

```typescript
// 사용자 타입
type UserType = 'user' | 'partner';

// 로그인 응답
interface LoginResponse {
  success: boolean;
  token?: string; // JWT 토큰
  user?: {
    id: number;
    email: string;
    name: string;
    type: UserType;
  };
  message?: string;
}

// 휴대폰 인증
interface PhoneVerificationRequest {
  phone: string;
}

interface PhoneVerificationConfirm {
  phone: string;
  code: string;
}

// 사업자등록번호 검증
interface BusinessNumberVerification {
  businessNumber: string;
  companyName?: string;
}
```

---

## 🔗 **URL 구조 (탭 페이지 분리)**

### **캠페인 페이지들**

- `/campaign/delivery` - 배송형 목록
- `/campaign/delivery/[id]` - 배송형 상세
- `/campaign/visit` - 방문형 목록
- `/campaign/visit/[id]` - 방문형 상세
- `/campaign/review` - 구매평 목록
- `/campaign/review/[id]` - 구매평 상세
- `/campaign/mission` - 미션형 목록
- `/campaign/mission/[id]` - 미션형 상세
- `/campaign/reporter` - 기자단 목록
- `/campaign/reporter/[id]` - 기자단 상세

### **인증 페이지들** ⭐ **신규**

#### **사용자**

- `/user/login` - 로그인
- `/user/signup` - 회원가입
- `/user/signup/complete` - 회원가입 완료
- `/user/sns_login` - SNS 로그인

#### **파트너**

- `/partner/login` - 로그인
- `/partner/signup` - 회원가입
- `/partner/signup/complete` - 회원가입 완료

### **사용자 캠페인 관리 페이지들**

- `/user/campaign_management` → `/user/campaign_management/applied` (리다이렉트)
- `/user/campaign_management/applied` - 신청 탭
- `/user/campaign_management/selected` - 선정 탭
- `/user/campaign_management/completed` - 완료 탭
- `/user/campaign_management/cancelled` - 취소/반려 탭
- `/user/campaign_management/penalty` - 패널티 탭

### **파트너 캠페인 관리 페이지들**

- `/partner/campaign_management` - 전체 탭
- `/partner/campaign_management/scheduled` - 예정 탭
- `/partner/campaign_management/applied` - 신청 탭
- `/partner/campaign_management/progress` - 진행 탭
- `/partner/campaign_management/completed` - 종료 탭
- `/partner/campaign_management/cancelled` - 취소 탭
- `/partner/campaign_management/penalty` - 패널티 탭

**캠페인 관리 기능:**

- "캠페인 관리하기" 버튼 클릭 시 모달 표시
- 모달에서 수정/삭제 옵션 제공
- 수정: `/partner/campaign/edit/{type}/{id}` 로 이동
- 삭제: API 호출 필요

### **파트너 캠페인 생성/수정 페이지들**

- `/partner/campaign/create` - 캠페인 생성 메인
- `/partner/campaign/create/delivery` - 배송형 생성
- `/partner/campaign/create/visit` - 방문형 생성
- `/partner/campaign/create/review` - 구매평 생성
- `/partner/campaign/create/mission` - 미션형 생성
- `/partner/campaign/create/reporter` - 기자단 생성
- `/partner/campaign/edit/{type}/[id]` - 캠페인 수정

### **마이페이지들 (사용자)**

- `/user/mypage` → `/user/mypage/profile` (리다이렉트)
- `/user/mypage/profile` - 프로필 탭
- `/user/mypage/channel` - 채널 탭
- `/user/mypage/edit` - 프로필 편집

### **파트너 마이페이지들**

- `/partner/mypage` → `/partner/mypage/profile` (리다이렉트)
- `/partner/mypage/profile` - 프로필 탭
- `/partner/mypage/edit` - 프로필 편집

### **포인트 페이지들 (사용자)**

- `/user/point` → `/user/point/all` (리다이렉트)
- `/user/point/all` - 전체 탭
- `/user/point/earned` - 적립 탭
- `/user/point/withdrawn` - 출금 탭
- `/user/point/withdrawal_request` - 출금 신청

### **포인트 페이지들 (파트너)**

- `/partner/point` → `/partner/point/all` (리다이렉트)
- `/partner/point/all` - 전체 탭
- `/partner/point/earned` - 적립 탭
- `/partner/point/withdrawn` - 출금 탭
- `/partner/point/charge` - 충전 탭

### **기타 페이지들**

- `/notice` - 공지사항
- `/faq` - FAQ

---

## 🎯 **최근 업데이트 내역** ⭐

### **2025년 1월 업데이트**

1. **로그인/회원가입 기능 추가**

   - 사용자 로그인/회원가입 페이지 구현
   - 파트너 로그인/회원가입 페이지 구현
   - 휴대폰 인증 기능
   - 사업자등록번호 검증 기능
   - 약관 동의 컴포넌트

2. **캠페인 경로 변경**

   - `/user/delivery` → `/campaign/delivery`로 통합
   - 모든 캠페인 타입이 `/campaign/` 하위로 이동

3. **컴포넌트 추가**

   - 회원가입 관련 컴포넌트 (PhoneVerification, TermsAgreement 등)
   - 파트너 회원가입 컴포넌트 (BusinessRegistrationUpload 등)
   - 커스텀 훅 추가 (usePhoneVerification, useTermsAgreement 등)

4. **유틸리티 함수 추가**

   - 폼 검증 유틸리티
   - 휴대폰 번호 유틸리티
   - 사업자등록번호 유틸리티
   - 타이머 유틸리티

5. **스타일 파일 추가**
   - 로그인/회원가입 관련 CSS 모듈
   - 반응형 디자인 지원

---

## 📚 **추가 참고 자료**

- `PAGE_COMPONENTS.md` - 페이지별 사용 컴포넌트 상세 정리
- `src/data/docs/DATA_GUIDE.md` - 데이터 구조 가이드
