# 📁 ReviewX 프로젝트 전체 구조

## 🎯 프로젝트 개요

**ReviewX**는 리뷰 캠페인 플랫폼으로, 사용자(리뷰어), 파트너(광고주), 관리자(GA/SA) 세 가지 역할을 지원하는 Next.js 기반 웹 애플리케이션입니다.

### 기술 스택

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: CSS Modules, Tailwind CSS 4
- **Charts**: Recharts 3.5.0
- **Date Handling**: date-fns 4.1.0, react-day-picker 9.11.2

---

## 📂 전체 디렉토리 구조

```
reviewx-web/
├── .editorconfig              # 에디터 설정 (UTF-8 인코딩 강제)
├── .gitattributes              # Git 속성 설정 (UTF-8, LF 줄바꿈)
├── eslint.config.mjs           # ESLint 설정
├── next.config.ts              # Next.js 설정
├── package.json                # 프로젝트 의존성 및 스크립트
├── postcss.config.mjs         # PostCSS 설정
├── tsconfig.json               # TypeScript 설정
│
├── public/                     # 정적 파일
│   └── images/                 # 이미지 파일들
│       ├── brand_logo/        # 브랜드 로고 (네이버, 인스타, 유튜브 등)
│       ├── campaign_detail/   # 캠페인 상세 페이지 이미지
│       ├── filter/            # 필터 아이콘
│       ├── header/            # 헤더 아이콘
│       ├── icons/             # 공통 아이콘
│       ├── main/              # 메인 페이지 이미지
│       └── ...
│
└── src/                        # 소스 코드
    ├── app/                    # Next.js App Router 페이지
    ├── components/             # React 컴포넌트
    ├── data/                   # 테스트/목업 데이터
    ├── hooks/                  # 커스텀 훅
    ├── styles/                 # CSS 모듈 스타일
    ├── types/                  # TypeScript 타입 정의
    └── utils/                  # 유틸리티 함수
```

---

## 📁 src/app/ - 페이지 구조

Next.js App Router를 사용한 페이지 라우팅 구조입니다.

### 🏠 공통 페이지

```
app/
├── page.tsx                    # 메인 페이지 (/)
├── layout.tsx                  # 루트 레이아웃
├── loading.tsx                 # 로딩 UI
├── error.tsx                   # 에러 페이지
├── not-found.tsx              # 404 페이지
├── blocked/                    # 차단된 사용자 페이지
│   └── page.tsx
├── faq/                        # FAQ 페이지
│   ├── layout.tsx
│   └── page.tsx
├── notice/                     # 공지사항 페이지
│   ├── layout.tsx
│   └── page.tsx
└── find-account/               # 아이디/비밀번호 찾기
    ├── page.tsx
    └── reset-password/
        └── page.tsx
```

### 🎯 캠페인 페이지 (공통)

```
app/campaign/
├── delivery/                   # 배송형 캠페인
│   ├── page.tsx               # 목록 페이지
│   ├── layout.tsx
│   └── [id]/
│       ├── page.tsx           # 상세 페이지
│       └── layout.tsx
├── visit/                      # 방문형 캠페인
├── review/                     # 구매평 캠페인
├── reporter/                   # 기자단 캠페인
└── mission/                    # 미션형 캠페인
```

### 👤 사용자(User) 페이지

```
app/user/
├── page.tsx                    # 사용자 메인 페이지
├── login/                      # 로그인
│   ├── layout.tsx
│   └── page.tsx
├── signup/                     # 회원가입
│   ├── layout.tsx
│   ├── page.tsx
│   └── complete/
│       └── page.tsx
├── sns_login/                  # SNS 로그인
│   ├── layout.tsx
│   └── page.tsx
├── campaign_management/        # 캠페인 관리
│   ├── layout.tsx
│   ├── page.tsx               # 전체 탭
│   ├── applied/               # 신청 탭
│   ├── selected/              # 선정 탭
│   ├── completed/             # 완료 탭
│   ├── cancelled/             # 취소/반려 탭
│   └── penalty/               # 패널티 탭
├── mypage/                     # 마이페이지
│   ├── layout.tsx
│   ├── page.tsx               # 메인 (리다이렉트)
│   ├── profile/               # 프로필 탭
│   ├── channel/               # 채널 탭
│   └── edit/                  # 프로필 편집
│       ├── layout.tsx
│       └── page.tsx
└── point/                      # 포인트 관리
    ├── layout.tsx
    ├── page.tsx               # 메인 (리다이렉트)
    ├── all/                   # 전체 탭
    ├── earned/                # 적립 탭
    ├── withdrawn/             # 출금 탭
    └── withdrawal_request/   # 출금 신청
        ├── layout.tsx
        └── page.tsx
```

### 🏢 파트너(Partner) 페이지

```
app/partner/
├── page.tsx                    # 파트너 메인 페이지
├── layout.tsx                  # 파트너 레이아웃
├── login/                      # 파트너 로그인
├── signup/                     # 파트너 회원가입
├── find-account/               # 아이디/비밀번호 찾기
├── campaign/                   # 캠페인 관리
│   ├── create/                # 캠페인 생성
│   │   ├── delivery/          # 배송형 생성
│   │   ├── visit/             # 방문형 생성
│   │   ├── review/            # 구매평 생성
│   │   ├── reporter/          # 기자단 생성
│   │   └── mission/           # 미션형 생성
│   └── edit/                  # 캠페인 수정
│       ├── delivery/[id]/
│       ├── visit/[id]/
│       ├── review/[id]/
│       ├── reporter/[id]/
│       └── mission/[id]/
├── campaign_application/       # 캠페인 신청내역
│   ├── delivery/[id]/         # 배송형 신청내역
│   ├── visit/[id]/
│   ├── review/[id]/
│   ├── reporter/[id]/
│   └── mission/[id]/
├── campaign_contents/          # 캠페인 콘텐츠 관리
│   ├── delivery/[id]/
│   ├── visit/[id]/
│   ├── review/[id]/
│   ├── reporter/[id]/
│   └── mission/[id]/
├── campaign_management/        # 캠페인 관리
│   ├── layout.tsx
│   ├── page.tsx               # 전체 탭
│   ├── scheduled/             # 예정 탭
│   ├── applied/               # 신청 탭
│   ├── progress/              # 진행 탭
│   ├── completed/             # 종료 탭
│   ├── cancelled/             # 취소 탭
│   └── penalty/                # 패널티 탭
├── mypage/                     # 파트너 마이페이지
│   ├── layout.tsx
│   ├── page.tsx
│   ├── profile/
│   └── edit/
└── point/                      # 포인트 관리
    ├── layout.tsx
    ├── page.tsx
    ├── all/
    ├── earned/
    ├── withdrawn/
    └── charge/                 # 포인트 충전
```

### 👨‍💼 관리자 페이지

#### GA 관리자 (General Admin)

```
app/manager_ga/
├── layout.tsx                  # GA 관리자 레이아웃
├── page.tsx                    # GA 대시보드
├── campaign/                   # 캠페인 관리
│   ├── progress/              # 진행 중 캠페인
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── delivery/[id]/     # 배송형 상세
│   │   ├── visit/[id]/
│   │   ├── review/[id]/
│   │   ├── reporter/[id]/
│   │   └── mission/[id]/
│   ├── rejected/              # 반려된 캠페인
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── reported/              # 신고된 캠페인
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── templates/             # 캠페인 템플릿
│       ├── layout.tsx
│       └── page.tsx
├── member/                     # 회원 관리
│   ├── partners/              # 파트너 관리
│   │   ├── layout.tsx
│   │   ├── page.tsx           # 파트너 목록
│   │   └── [id]/              # 파트너 상세
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── reviewers/             # 리뷰어 관리
│   │   ├── layout.tsx
│   │   ├── page.tsx           # 리뷰어 목록
│   │   └── [id]/              # 리뷰어 상세
│   │       ├── layout.tsx
│   │       └── page.tsx
│   └── blacklist/             # 블랙리스트 관리
│       ├── layout.tsx
│       └── page.tsx
└── community/                  # 커뮤니티 관리
    └── posts/                 # 게시글 관리
        ├── layout.tsx
        └── page.tsx
```

#### SA 관리자 (Super Admin)

```
app/manager_sa/
├── layout.tsx                  # SA 관리자 레이아웃
├── page.tsx                    # SA 대시보드
├── campaign/                   # 캠페인 관리
│   └── progress/              # 진행 중 캠페인
│       ├── layout.tsx
│       ├── page.tsx
│       └── [타입]/[id]/       # 캠페인 상세
├── member/                     # 회원 관리
│   ├── admins/                # 관리자 관리
│   │   └── page.tsx
│   ├── partners/              # 파트너 관리
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── reviewers/             # 리뷰어 관리
│   │   ├── page.tsx
│   │   └── [id]/
│   └── blacklist/             # 블랙리스트
│       └── page.tsx
├── settlement/                 # 정산 관리
│   ├── payment_history/       # 결제 내역
│   ├── withdrawal/            # 출금 관리
│   └── withdrawal_request/   # 출금 신청
└── community/                  # 커뮤니티 관리
    └── posts/                 # 게시글 관리
        └── page.tsx
```

---

## 🧩 src/components/ - 컴포넌트 구조

### 📦 common/ - 공통 컴포넌트

모든 역할에서 공통으로 사용하는 컴포넌트입니다.

```
components/common/
├── BlockedUserPage.tsx         # 차단된 사용자 페이지 컴포넌트
├── FindAccountPage.tsx         # 아이디/비밀번호 찾기 페이지
├── campaign/                   # 캠페인 공통 컴포넌트
├── campaign_management/       # 캠페인 관리 공통 컴포넌트
│   ├── CampaignFilterBar.tsx  # 캠페인 필터 바
│   ├── types.ts
│   └── utils/
├── date_range_picker/          # 날짜 범위 선택기
│   ├── DateRangePickerExample.tsx
│   └── date_range_picker_example.module.css
├── find_account/               # 아이디/비밀번호 찾기
│   ├── modal/                 # 모달 컴포넌트들
│   │   ├── AccountFoundModal.tsx
│   │   ├── AccountNotFoundModal.tsx
│   │   ├── BlockedAccountModal.tsx
│   │   └── SNSLoginModal.tsx
│   └── types.ts
├── mypage/                     # 마이페이지 공통 컴포넌트
│   ├── AddressInput.tsx       # 주소 입력
│   ├── PhoneVerificationInput.tsx  # 휴대폰 인증 입력
│   ├── ProfilePhotoUpload.tsx     # 프로필 사진 업로드
│   └── SubTabNavigation.tsx       # 서브 탭 네비게이션
├── point/                       # 포인트 공통 컴포넌트
│   └── PointTabNavigation.tsx  # 포인트 탭 네비게이션
└── signup/                      # 회원가입 공통 컴포넌트
    ├── PasswordInput.tsx       # 비밀번호 입력
    ├── PasswordConfirmInput.tsx # 비밀번호 확인 입력
    └── PhoneVerification.tsx   # 휴대폰 인증
```

### 👤 user/ - 사용자 전용 컴포넌트

```
components/user/
├── campaign_detail/            # 캠페인 상세 페이지 컴포넌트
│   ├── DetailHeader.tsx       # 상세 헤더
│   ├── DetailImage.tsx        # 상세 이미지
│   ├── DetailProductInfo.tsx  # 상품 정보
│   ├── DetailScheduleInfo.tsx # 일정 정보
│   ├── AdditionalGuidelines.tsx
│   ├── RequirementIcons.tsx
│   ├── guidelines/            # 가이드라인 섹션들
│   │   ├── DetailGuidelinesSection.tsx
│   │   ├── DetailGuidelinesSectionDelivery.tsx
│   │   ├── DetailGuidelinesSectionVisit.tsx
│   │   ├── DetailGuidelinesSectionReview.tsx
│   │   ├── DetailGuidelinesSectionReporter.tsx
│   │   └── DetailGuidelinesSectionMission.tsx
│   └── modal/                 # 신청 모달들
│       ├── ApplicationModal.tsx
│       ├── ApplicationModalType2.tsx
│       └── ApplicationModalType3.tsx
├── campaign_management/        # 캠페인 관리 컴포넌트
│   ├── CampaignCard.tsx       # 캠페인 카드
│   ├── CampaignList.tsx       # 캠페인 목록
│   ├── CampaignManagementHeader.tsx
│   ├── CampaignTag.tsx         # 캠페인 태그
│   ├── StatisticsTab.tsx      # 통계 탭
│   ├── TabNavigation.tsx      # 탭 네비게이션
│   ├── PenaltyContent.tsx     # 패널티 내용
│   ├── ReceiptRegistrationModal.tsx
│   └── modals/                # 모달 컴포넌트들
│       ├── ContentRegistrationModal.tsx
│       ├── ImageUploadModal.tsx
│       └── CombinedContentModal.tsx
├── filter/                     # 필터 컴포넌트
│   ├── FilterBar.tsx
│   ├── ModalFilter.tsx
│   ├── RegionFilter.tsx
│   └── SortModalFilter.tsx
├── mypage/                     # 마이페이지 컴포넌트
│   ├── AccountInfoInput.tsx   # 계좌 정보 입력
│   ├── ChannelConnectModal.tsx # 채널 연결 모달
│   ├── ChannelSection.tsx     # 채널 섹션
│   └── SocialSecurityNumberInput.tsx # 주민등록번호 입력
├── point/                      # 포인트 컴포넌트
└── signup/                     # 회원가입 컴포넌트
    ├── ExistingAccountModal.tsx
    ├── TermsAgreement.tsx      # 약관 동의
    └── utils/
        └── formValidation.ts
```

### 🏢 partner/ - 파트너 전용 컴포넌트

```
components/partner/
├── campaign_application/       # 캠페인 신청내역 컴포넌트
│   ├── ApplicantCard.tsx      # 신청자 카드
│   ├── CampaignInfoBox.tsx    # 캠페인 정보 박스
│   ├── CampaignSchedule.tsx    # 캠페인 일정
│   ├── PageHeader.tsx         # 페이지 헤더
│   ├── SortFilterControl.tsx  # 정렬/필터 컨트롤
│   ├── ExcelDownloadBtn.tsx   # 엑셀 다운로드 버튼
│   ├── ContentExcelDownloadBtn.tsx
│   ├── EmptyApplicantsList.tsx
│   ├── card_type/             # 채널별 신청자 카드 타입
│   │   ├── basic/             # 기본 타입
│   │   ├── naverblog/         # 네이버 블로그
│   │   ├── naverclip/         # 네이버 클립
│   │   ├── instagram/         # 인스타그램
│   │   ├── youtube/           # 유튜브
│   │   ├── reels/             # 릴스
│   │   └── shorts/            # 쇼츠
│   └── utils/
├── campaign_contents/          # 캠페인 콘텐츠 관리
│   ├── ReceiptRegistrationModal.tsx
│   ├── ReceiptPreviewModal.tsx
│   └── card_type/             # 콘텐츠 카드 타입
│       ├── experience_card/   # 체험형 카드
│       ├── mission_card/      # 미션형 카드
│       └── purchase_review_card/ # 구매평 카드
├── campaign_create_form/       # 캠페인 생성 폼
│   ├── DeliveryCampaignForm.tsx
│   ├── VisitCampaignForm.tsx
│   ├── ReviewCampaignForm.tsx
│   ├── ReporterCampaignForm.tsx
│   ├── MissionCampaignForm.tsx
│   └── common/                # 공통 폼 컴포넌트
├── campaign_management/        # 캠페인 관리
│   ├── CampaignCard.tsx       # 캠페인 카드
│   ├── CampaignList.tsx       # 캠페인 목록
│   ├── PartnerCampaignManagementHeader.tsx
│   ├── StatisticsTab.tsx      # 통계 탭
│   ├── TabNavigation.tsx      # 탭 네비게이션
│   ├── PenaltyContent.tsx     # 패널티 내용
│   ├── modals/                # 모달 컴포넌트들
│   │   ├── CampaignManagementModal.tsx
│   │   └── CampaignDeleteConfirmModal.tsx
│   └── utils/
│       └── campaign_card_helpers.ts
├── mypage/                     # 파트너 마이페이지
│   └── BusinessDocumentUpload.tsx # 사업자등록증 업로드
├── point/                      # 포인트 컴포넌트
└── signup/                     # 파트너 회원가입
    ├── AddressInput.tsx
    ├── BusinessRegistrationUpload.tsx
    ├── FileUploadAlert.tsx
    ├── PartnerTermsAgreement.tsx
    └── utils/
```

### 👨‍💼 manager/ - 관리자 전용 컴포넌트

#### common/ - 관리자 공통 컴포넌트

```
components/manager/common/
├── campaign/                   # 캠페인 공통 컴포넌트
│   └── progress/              # 진행 중 캠페인 공통
│       ├── cards/             # 통계 카드
│       ├── filter/            # 필터 모달들
│       ├── icons/             # 아이콘
│       ├── layout/            # 레이아웃
│       ├── modal/             # 모달
│       ├── section/           # 섹션
│       ├── table/             # 테이블
│       └── tags/              # 태그
├── community/                  # 커뮤니티 공통
│   └── posts/                 # 게시글 관리
│       └── section/
│           ├── PostFilterSection.tsx
│           └── PostTable.tsx
└── member/                     # 회원 관리 공통
    ├── filter/                # 필터
    │   └── MemberFilterSection.tsx
    ├── modal/                 # 모달
    │   ├── CampaignHistoryModal.tsx
    │   └── PenaltyHistoryModal.tsx
    ├── stats/                 # 통계
    │   └── MemberStatsSection.tsx
    └── table/                 # 테이블
        ├── PartnerTable.tsx
        └── ReviewerTable.tsx
```

#### ga/ - GA 관리자 전용 컴포넌트

```
components/manager/ga/
├── common/                     # GA 공통 컴포넌트
│   ├── ManagerGAHeader.tsx   # GA 헤더
│   ├── SidebarMenu.tsx       # 사이드바 메뉴
│   └── filter/               # 필터 공통
│       ├── BaseFilterModal.tsx
│       ├── BaseFilterSection.tsx
│       └── SortDropdown.tsx
├── campaign/                   # 캠페인 관리
│   ├── progress/              # 진행 중 캠페인
│   ├── rejected/              # 반려된 캠페인
│   │   ├── filter/
│   │   ├── modal/
│   │   └── section/
│   └── reported/              # 신고된 캠페인
│       ├── filter/
│       ├── modal/
│       └── section/
├── dashboard/                  # 대시보드
│   ├── ChartsSection.tsx
│   ├── MemberStatsSection.tsx
│   ├── StatCard.tsx
│   ├── chart/                 # 차트 컴포넌트들
│   │   ├── CampaignRecruitmentChart.tsx
│   │   ├── ChannelMemberPieChart.tsx
│   │   ├── DeviceStatsChart.tsx
│   │   ├── MemberActivationDonutChart.tsx
│   │   ├── MemberTypeBarChart.tsx
│   │   ├── RejectionReportChart.tsx
│   │   └── chart_event_handlers.ts
│   └── section/               # 대시보드 섹션들
│       ├── AccessStatsSection.tsx
│       ├── CampaignRecruitmentSection.tsx
│       ├── CampaignSummarySection.tsx
│       ├── ChannelMemberSection.tsx
│       ├── DateFilterSection.tsx
│       ├── DateRangePickerModal.tsx
│       ├── MemberActivationSection.tsx
│       ├── MemberTypeSection.tsx
│       └── RejectionReportSection.tsx
└── member/                     # 회원 관리
    ├── blacklist/              # 블랙리스트
    │   ├── filter/
    │   └── section/
    ├── member_detail/          # 회원 상세
    │   ├── ActivityInfoSection.tsx
    │   ├── InfoCard.tsx
    │   ├── MemberDetailLayout.tsx
    │   ├── ProfileSection.tsx
    │   └── Section.tsx
    ├── partners/               # 파트너 관리
    │   ├── filter/
    │   ├── modal/
    │   └── section/
    └── reviewers/              # 리뷰어 관리
        ├── filter/
        ├── modal/
        └── section/
```

#### sa/ - SA 관리자 전용 컴포넌트

```
components/manager/sa/
├── common/                     # SA 공통
│   └── SidebarMenu.tsx        # SA 사이드바 메뉴
├── campaign/                   # 캠페인 관리
│   └── progress/              # 진행 중 캠페인
│       ├── modal/
│       ├── section/
│       ├── CampaignStatusTag.tsx
│       ├── CampaignTypeTag.tsx
│       ├── ChannelIcon.tsx
│       └── StatCard.tsx
├── dashboard/                  # 대시보드
│   ├── StatCard.tsx
│   ├── chart/                 # 차트 컴포넌트들
│   │   ├── AmountChart.tsx
│   │   ├── ChannelMemberPieChart.tsx
│   │   ├── MemberActivationDonutChart.tsx
│   │   └── MemberTypeBarChart.tsx
│   └── section/               # 대시보드 섹션들
│       ├── ChannelMemberSection.tsx
│       ├── MemberActivationSection.tsx
│       ├── MemberTypeSection.tsx
│       ├── PaymentChartSection.tsx
│       ├── PaymentSummarySection.tsx
│       ├── SettlementChartSection.tsx
│       └── SettlementSummarySection.tsx
├── member/                     # 회원 관리
│   ├── admins/                # 관리자 관리
│   │   └── section/
│   ├── partners/               # 파트너 관리
│   │   ├── modal/
│   │   └── section/
│   └── reviewers/              # 리뷰어 관리
│       ├── modal/
│       └── section/
└── settlement/                 # 정산 관리
    ├── payment_history/        # 결제 내역
    │   └── section/
    ├── withdrawal/             # 출금 관리
    │   └── section/
    └── withdrawal_request/    # 출금 신청
        └── section/
```

### 🧩 기타 컴포넌트

```
components/
├── dev/                        # 개발용 컴포넌트
│   └── ConsoleFilter.tsx      # 콘솔 로그 필터
├── fragments/                  # 레이아웃 컴포넌트
│   ├── Header.tsx             # 공통 헤더
│   ├── PartnerHeader.tsx      # 파트너 헤더
│   └── SubHeader.tsx         # 서브 헤더
└── main/                       # 메인 페이지 컴포넌트
    ├── CampaignBox.tsx       # 캠페인 카드
    ├── MainMenu.tsx          # 메인 메뉴
    └── Titletext.tsx         # 페이지 제목
```

---

## 🎣 src/hooks/ - 커스텀 훅 구조

```
hooks/
├── common/                     # 공통 훅
│   ├── campaign_management/
│   │   └── useCampaignFilterBar.ts
│   ├── signup/
│   │   └── usePhoneVerification.ts
│   └── useTimer.ts            # 타이머 훅
├── user/                       # 사용자 전용 훅
│   └── signup/
│       └── useTermsAgreement.ts
├── partner/                     # 파트너 전용 훅
│   ├── campaign_management/
│   │   └── useCampaignCard.ts
│   └── signup/
│       └── usePartnerTermsAgreement.ts
└── manager/                     # 관리자 전용 훅
    └── common/
        └── campaign/
            └── useCampaignProgressDetail.ts
```

---

## 📊 src/data/ - 데이터 구조

테스트 및 목업 데이터를 저장하는 폴더입니다.

```
data/
├── docs/
│   └── DATA_GUIDE.md          # 데이터 가이드 문서
├── faq/
│   └── faqData.ts            # FAQ 데이터
├── login/
│   └── testLoginData.ts     # 테스트 로그인 데이터
├── manager_ga/               # GA 관리자 데이터
│   ├── community/
│   │   └── postsData.ts
│   ├── dashboard/
│   │   └── dashboardData.ts
│   ├── member/
│   │   ├── blacklist.ts
│   │   ├── partners.ts
│   │   └── reviewers.ts
│   ├── progress.ts
│   ├── rejected.ts
│   └── reported.ts
├── manager_sa/               # SA 관리자 데이터
│   ├── dashboard/
│   │   └── dashboardData.ts
│   ├── member/
│   │   └── admins.ts
│   ├── progress.ts
│   └── settlement/
│       ├── paymentHistoryData.ts
│       ├── withdrawalData.ts
│       └── withdrawalRequestData.ts
├── partner/                  # 파트너 데이터
│   ├── campaign_application/
│   │   ├── delivery_applicants.ts
│   │   └── delivery_review_completed.ts
│   ├── delivery.ts
│   ├── mission.ts
│   ├── reporter.ts
│   ├── review.ts
│   ├── visit.ts
│   ├── sharedCampaigns.ts
│   ├── point/
│   │   └── pointData.ts
│   └── utils/
│       └── campaignHelpers.ts
└── user/                      # 사용자 데이터
    ├── campaign_management/
    │   └── campaignManagementData.ts
    ├── delivery/
    │   ├── deliveryCampaigns.ts
    │   └── deliveryFilterOptions.ts
    ├── mission/
    │   ├── missionCampaigns.ts
    │   └── missionFilterOptions.ts
    ├── reporter/
    │   ├── reporterCampaigns.ts
    │   └── reporterFilterOptions.ts
    ├── review/
    │   ├── reviewCampaigns.ts
    │   └── reviewFilterOptions.ts
    ├── visit/
    │   ├── visitCampaigns.ts
    │   └── visitFilterOptions.ts
    └── point/
        └── pointData.ts
```

---

## 🎨 src/styles/ - 스타일 구조

CSS Modules를 사용한 스타일 파일 구조입니다.

```
styles/
├── globals.css                # 전역 스타일
├── common/                     # 공통 스타일
│   ├── blocked_user.module.css
│   ├── find_account.module.css
│   └── reset_password.module.css
├── error_page/                 # 에러 페이지 스타일
│   ├── error.module.css
│   ├── loading.module.css
│   └── not_found.module.css
├── filter/                     # 필터 스타일
│   └── filter_bar.module.css
├── fragments/                  # 레이아웃 스타일
│   ├── header.module.css
│   └── sub_header.module.css
├── home/                       # 홈 스타일
│   ├── home.module.css
│   └── text.module.css
├── login/                      # 로그인 스타일
│   ├── login.module.css
│   └── partner_login.module.css
├── manager_ga/                 # GA 관리자 스타일
│   ├── layout.css             # 전역 레이아웃
│   ├── campaign_detail.module.css
│   ├── campaign/              # 캠페인 관련
│   ├── community/             # 커뮤니티 관련
│   ├── dashboard/             # 대시보드 관련
│   ├── layout/                # 레이아웃
│   └── member/                # 회원 관리
├── manager_sa/                 # SA 관리자 스타일
│   ├── campaign/
│   ├── dashboard/
│   ├── layout/
│   ├── member/
│   └── settlement/            # 정산 관련
├── partner/                    # 파트너 스타일
│   ├── buttons.module.css
│   ├── campaign_card.module.css
│   ├── campaign_application/
│   ├── campaign_contents/
│   ├── campaign_create/
│   ├── campaign_management/
│   ├── dashboard.module.css
│   ├── layout.module.css
│   ├── penalty.module.css
│   ├── point/
│   ├── receipt_registration.module.css
│   ├── signup/
│   ├── statistics.module.css
│   └── tab_navigation.module.css
└── user/                       # 사용자 스타일
    ├── campaign/
    ├── campaign_management/
    ├── delivery/
    ├── faq/
    ├── login/
    ├── mypage/
    ├── notice/
    ├── point/
    └── signup/
```

---

## 📝 src/types/ - 타입 정의 구조

```
types/
├── partner/
│   └── partner.ts             # 파트너 관련 타입
│       - PartnerCampaign
│       - PartnerCampaignStats
│       - PartnerStatTab
│       - PartnerPointHistory
│       - CampaignInfo
│       - ContentItem
│       - AllApplicant 등
└── user/
    └── user.ts                # 사용자 관련 타입
        - CampaignApplication
        - CampaignStats
        - StatTab
        - PointHistory
        - CampaignType
        - PlatformType 등
```

---

## 🛠️ src/utils/ - 유틸리티 함수 구조

```
utils/
├── cardTypeMapper.ts          # 카드 타입 매핑
├── channelLogoMap.ts         # 채널 로고 매핑
├── manager_ga/               # GA 관리자 유틸리티
├── partner/                  # 파트너 유틸리티
├── signup/                   # 회원가입 유틸리티
│   ├── phoneUtils.ts        # 휴대폰 번호 유틸리티
│   ├── timerUtils.ts        # 타이머 유틸리티
│   └── validation.ts        # 검증 유틸리티
└── user/                     # 사용자 유틸리티
```

---

## 📋 주요 설정 파일

### 루트 디렉토리

- `package.json` - 프로젝트 의존성 및 스크립트
- `tsconfig.json` - TypeScript 설정
- `next.config.ts` - Next.js 설정
- `eslint.config.mjs` - ESLint 설정
- `postcss.config.mjs` - PostCSS 설정
- `.editorconfig` - 에디터 설정 (UTF-8 인코딩 강제)
- `.gitattributes` - Git 속성 설정 (UTF-8, LF 줄바꿈)

---

## 🎯 역할별 주요 기능

### 👤 User (사용자/리뷰어)

- 캠페인 조회 및 신청
- 캠페인 관리 (신청, 선정, 완료, 취소/반려, 패널티)
- 포인트 관리 (적립, 출금)
- 마이페이지 (프로필, 채널 연결)
- 회원가입/로그인

### 🏢 Partner (파트너/광고주)

- 캠페인 생성 및 수정
- 캠페인 신청내역 관리
- 캠페인 콘텐츠 관리
- 캠페인 관리 (예정, 신청, 진행, 종료, 취소, 패널티)
- 포인트 관리 (충전, 사용)
- 마이페이지 (프로필, 사업자 정보)
- 회원가입/로그인

### 👨‍💼 Manager GA (일반 관리자)

- 캠페인 관리 (진행, 반려, 신고)
- 회원 관리 (파트너, 리뷰어, 블랙리스트)
- 커뮤니티 관리 (게시글)
- 대시보드 (통계, 차트)

### 👨‍💼 Manager SA (최고 관리자)

- 캠페인 관리 (진행)
- 회원 관리 (관리자, 파트너, 리뷰어, 블랙리스트)
- 정산 관리 (결제 내역, 출금 관리, 출금 신청)
- 커뮤니티 관리 (게시글)
- 대시보드 (통계, 차트)

---

## 📌 주요 특징

1. **역할 기반 구조**: user, partner, manager_ga, manager_sa로 명확히 구분
2. **공통 컴포넌트**: common 폴더에 재사용 가능한 컴포넌트 집중 관리
3. **타입 안정성**: TypeScript로 모든 타입 정의
4. **모듈화된 스타일**: CSS Modules로 스타일 격리
5. **커스텀 훅**: 비즈니스 로직을 hooks로 분리
6. **데이터 분리**: 역할별 데이터 파일 분리

---

## 🔗 관련 문서

- `PROJECT_STRUCTURE_REFACTORING.md` - 프로젝트 구조 정리 계획 및 진행 상황
- `REFACTORING_SUMMARY.md` - 중복 코드 제거 리팩토링 요약
- `PAGE_COMPONENTS.md` - 페이지별 사용 컴포넌트 정리
- `src/data/docs/DATA_GUIDE.md` - 데이터 파일 가이드
- `src/docs/README.md` - 프로젝트 문서

---

**마지막 업데이트**: 2025년 1월
