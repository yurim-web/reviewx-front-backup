# ReviewX 백엔드 API 개발 가이드

## 📋 **프로젝트 개요**

ReviewX는 리뷰 캠페인 플랫폼으로, 사용자들이 다양한 캠페인에 참여하여 제품을 체험하고 리뷰를 작성하는 서비스입니다.

### **주요 기능**

- 5가지 캠페인 타입 (배송형, 방문형, 구매평, 체험단, 기자단)
- 캠페인 신청/관리 시스템
- 포인트 적립/출금 시스템
- 사용자 프로필 관리

---

## 🏗️ **전체 시스템 아키텍처**

```
Frontend (Next.js) ←→ Backend (Spring Boot) ←→ Database
     ↓                        ↓                    ↓
- React Components      - REST API           - MySQL/PostgreSQL
- TypeScript           - JWT Authentication  - Redis (캐시)
- CSS Modules          - Spring Security     - File Storage
```

---

## 📁 **프로젝트 구조 및 페이지별 API 요구사항**

### **1. 메인 홈페이지** (`/`)

**경로**: `src/app/page.tsx`
**사용 컴포넌트**: MainMenu, CampaignBox, Titletext
**필요한 API**:

```
GET /api/campaigns/main
- 선정 확률 높은 캠페인 목록
- 지금 인기 많은 캠페인 목록
```

### **2. 캠페인 목록 페이지들**

#### **배송형 페이지** (`/user/delivery`)

**경로**: `src/app/user/delivery/page.tsx`
**사용 컴포넌트**: MainMenu, FilterBar, CampaignBox, Titletext
**필요한 API**:

```
GET /api/campaigns/delivery
- 배송형 캠페인 목록 (16개)
- 필터링 옵션 (카테고리, 채널, 정렬)

GET /api/campaigns/delivery/filters
- 카테고리 옵션: ["전체", "식품", "뷰티", "가전", "유아동", "여가", "서비스", "생활", "패션", "가구", "디지털", "문화", "반려동물", "기타"]
- 채널 옵션: ["네이버 블로그", "네이버 클립", "인스타그램", "릴스", "유튜브", "쇼츠"]
- 정렬 옵션: ["최신순", "인기순", "마감임박순", "캐시순"]
```

#### **방문형 페이지** (`/user/visit`)

**경로**: `src/app/user/visit/page.tsx`
**필요한 API**:

```
GET /api/campaigns/visit
GET /api/campaigns/visit/filters
```

#### **구매평 페이지** (`/user/review`)

**경로**: `src/app/user/review/page.tsx`
**필요한 API**:

```
GET /api/campaigns/review
GET /api/campaigns/review/filters
```

#### **체험단 페이지** (`/user/experience`)

**경로**: `src/app/user/experience/page.tsx`
**필요한 API**:

```
GET /api/campaigns/experience
GET /api/campaigns/experience/filters
```

#### **기자단 페이지** (`/user/reporter`)

**경로**: `src/app/user/reporter/page.tsx`
**필요한 API**:

```
GET /api/campaigns/reporter
GET /api/campaigns/reporter/filters
```

### **3. 캠페인 상세 페이지들**

#### **배송형 상세** (`/user/delivery/[id]`)

**경로**: `src/app/user/delivery/[id]/page.tsx`
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

### **4. 캠페인 관리 페이지** (`/user/campaign_management`)

**경로**: `src/app/user/campaign_management/page.tsx`
**사용 컴포넌트**: TabNavigation, StatisticsTab, CampaignList, CampaignCard, PenaltyContent, CampaignTag
**필요한 API**:

```
GET /api/user/campaigns
- 사용자 신청/선정/완료/취소반려 캠페인 목록
- 통계 정보 (신청/선정/완료/취소반려/패널티 개수)

GET /api/user/campaigns/statistics
- 캠페인별 통계 데이터
```

### **5. 포인트 페이지** (`/user/point`)

**경로**: `src/app/user/point/page.tsx`
**사용 컴포넌트**: TabNavigation
**필요한 API**:

```
GET /api/user/points
- 포인트 요약 정보 (총 보유, 출금 가능, 대기 중)
- 포인트 내역 (적립/출금)

POST /api/user/points/withdrawal
- 출금 신청
```

### **6. 마이페이지** (`/user/mypage`)

**경로**: `src/app/user/mypage/page.tsx`
**필요한 API**:

```
GET /api/user/profile
- 사용자 프로필 정보

PUT /api/user/profile
- 프로필 수정
```

---

## 🗄️ **데이터베이스 설계**

### **1. 캠페인 테이블 (campaigns)**

```sql
CREATE TABLE campaigns (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- '배송형', '방문형', '구매평', '체험단', '기자단'
    category_icon VARCHAR(200),
    image VARCHAR(200),
    subcategory VARCHAR(50), -- '뷰티', '생활', '식품' 등
    points INT NOT NULL,
    description TEXT,
    current_recruitment INT DEFAULT 0,
    total_recruitment INT NOT NULL,
    application_start DATETIME,
    application_end DATETIME,
    announcement_date DATETIME,
    purchase_period VARCHAR(100),
    registration_period VARCHAR(100),
    campaign_detail_image VARCHAR(200),
    channel VARCHAR(50), -- '네이버 블로그', '인스타그램' 등
    keyword TEXT,
    promotion_link VARCHAR(500),
    requirements JSON, -- ["text_2000", "photo_15", "video_1_180", "product_link", "keyword"]
    guideline_texts JSON, -- 가이드라인 텍스트 배열
    day_count VARCHAR(20), -- 'D-6', '마감임박', '긴급' 등
    schedule VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **2. 사용자 테이블 (users)**

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(200),
    total_points INT DEFAULT 0,
    available_points INT DEFAULT 0,
    pending_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **3. 캠페인 신청 테이블 (campaign_applications)**

```sql
CREATE TABLE campaign_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    campaign_id VARCHAR(50) NOT NULL,
    status ENUM('신청', '선정', '완료', '취소/반려') DEFAULT '신청',
    sub_status ENUM('content_not_registered', 'content_registered', 'content_rejected', 'penalty'),
    remaining_days INT,
    is_urgent BOOLEAN DEFAULT FALSE,
    has_content BOOLEAN DEFAULT FALSE,
    is_penalty BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    selected_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    UNIQUE KEY unique_user_campaign (user_id, campaign_id)
);
```

### **4. 포인트 내역 테이블 (point_history)**

```sql
CREATE TABLE point_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('earned', 'withdrawn') NOT NULL,
    amount INT NOT NULL, -- 양수: 적립, 음수: 출금
    description TEXT NOT NULL,
    campaign_id VARCHAR(50),
    date DATE NOT NULL,
    status ENUM('earned', 'completed', 'pending', 'failed') NOT NULL,
    balance INT NOT NULL, -- 거래 후 잔액
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
```

### **5. 출금 신청 테이블 (withdrawal_requests)**

```sql
CREATE TABLE withdrawal_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount INT NOT NULL,
    bank VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_holder VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reason TEXT, -- 반려 사유
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔌 **API 엔드포인트 상세 설계**

### **1. 캠페인 관련 API**

#### **메인 페이지 캠페인 목록**

```http
GET /api/campaigns/main
```

**Response**:

```json
{
  "highProbabilityCampaigns": [
    {
      "id": "delivery_1",
      "title": "세르프 (박신혜리프팅)",
      "category": "배송형",
      "categoryIcon": "/images/brand_logo/navershop.svg",
      "image": "/images/main/campaign_img/eximg_9.png",
      "subcategory": "뷰티",
      "points": 30000,
      "description": "박신혜 리프팅 세르프 제품 체험단 모집",
      "recruitment": {
        "current": 607,
        "total": 2
      },
      "dayCount": "마감임박"
    }
  ],
  "popularCampaigns": [...]
}
```

#### **캠페인 목록 (타입별)**

```http
GET /api/campaigns/{type}?category=뷰티&channel=네이버블로그&sort=latest&closingSoon=false
```

**Parameters**:

- `type`: delivery, visit, review, experience, reporter
- `category`: 필터링할 카테고리
- `channel`: 필터링할 채널
- `sort`: latest, points_high, points_low, recruitment_high, recruitment_low
- `closingSoon`: true/false (마감임박 필터)

#### **캠페인 상세 정보**

```http
GET /api/campaigns/{type}/{id}
```

**Response**:

```json
{
  "id": "delivery_1",
  "title": "세르프 (박신혜리프팅)",
  "category": "배송형",
  "categoryIcon": "/images/brand_logo/navershop.svg",
  "image": "/images/main/campaign_img/eximg_9.png",
  "subcategory": "뷰티",
  "points": 30000,
  "description": "박신혜 리프팅 세르프 제품 체험단 모집",
  "recruitment": {
    "current": 607,
    "total": 2
  },
  "detailedSchedule": {
    "applicationStart": "2025-01-18",
    "applicationEnd": "2025-02-08",
    "announcement": "2025-02-10",
    "purchasePeriod": "2025-02-10 ~ 2025-02-13",
    "registrationPeriod": "2025-02-13 ~ 2025-02-20"
  },
  "campaign_detail_image": "/images/campaign_detail/exdetail_1.png",
  "channel": "네이버 블로그",
  "keyword": "#세르프 #박신혜리프팅 #뷰티 #스킨케어 #리프팅크림",
  "promotionLink": "https://smartstore.naver.com/example-store/products/123456",
  "requirements": [
    "text_2000",
    "photo_15",
    "video_1_180",
    "product_link",
    "keyword"
  ],
  "guidelineTexts": ["배송형 캠페인 작성시...", "★★안내된 가격과..."]
}
```

#### **캠페인 신청**

```http
POST /api/campaigns/{type}/{id}/apply
Authorization: Bearer {jwt_token}
```

**Request Body**:

```json
{
  "additionalInfo": "추가 정보 (선택사항)"
}
```

### **2. 사용자 관련 API**

#### **사용자 캠페인 목록**

```http
GET /api/user/campaigns?status=신청
Authorization: Bearer {jwt_token}
```

**Parameters**:

- `status`: 신청, 선정, 완료, 취소/반려, 패널티

**Response**:

```json
{
  "campaigns": [
    {
      "id": "1",
      "title": "데일리포근 누빔 침대패드 Q 퀸",
      "category": "네이버블로그",
      "categoryIcon": "/images/brand_logo/naverblog.svg",
      "image": "/images/campaign_detail/exdetail_1.png",
      "status": "신청",
      "remainingDays": 1,
      "type": "배송형",
      "isUrgent": true,
      "subStatus": "content_not_registered",
      "hasContent": false,
      "isPenalty": false
    }
  ],
  "statistics": {
    "신청": 2,
    "선정": 2,
    "완료": 1,
    "취소/반려": 2,
    "패널티": 0
  }
}
```

### **3. 포인트 관련 API**

#### **포인트 요약 정보**

```http
GET /api/user/points
Authorization: Bearer {jwt_token}
```

**Response**:

```json
{
  "summary": {
    "total_points": 511200,
    "available_points": 511200,
    "pending_points": 0
  },
  "history": [
    {
      "id": "1",
      "type": "earned",
      "amount": 150000,
      "description": "[풋필터] 트롯바비 홍지윤 pick! 아치까지 받쳐주는 발 편한 자세 교정 키높이 깔창 2set(1.5cm 1켤레 + 2.5cm 1켤레) 구매평",
      "campaign_id": "camp_001",
      "date": "2025-09-12",
      "status": "earned",
      "balance": 4311885
    }
  ]
}
```

#### **출금 신청**

```http
POST /api/user/points/withdrawal
Authorization: Bearer {jwt_token}
```

**Request Body**:

```json
{
  "amount": 100000,
  "account_info": {
    "bank": "국민은행",
    "account_number": "1234567890",
    "account_holder": "홍길동"
  }
}
```

### **4. 인증 관련 API**

#### **회원가입**

```http
POST /api/auth/register
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

#### **로그인**

```http
POST /api/auth/login
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

---

## 🔐 **보안 및 인증**

### **JWT 토큰 구조**

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "홍길동",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### **권한 관리**

- **ROLE_USER**: 일반 사용자 (캠페인 신청, 포인트 관리)
- **ROLE_ADMIN**: 관리자 (캠페인 관리, 사용자 관리)

### **API 보안 규칙**

1. 모든 사용자 관련 API는 JWT 토큰 필요
2. 캠페인 신청은 로그인된 사용자만 가능
3. 포인트 출금은 본인만 가능
4. Rate Limiting 적용 (분당 100회)

---

## 📊 **데이터 검증 및 비즈니스 로직**

### **캠페인 신청 검증**

1. 사용자가 이미 신청한 캠페인인지 확인
2. 신청 기간 내인지 확인
3. 모집 인원이 남아있는지 확인
4. 사용자 자격 요건 확인

### **포인트 출금 검증**

1. 출금 가능 포인트가 충분한지 확인
2. 최소 출금 금액 (10,000원) 확인
3. 계좌 정보 유효성 검증
4. 출금 신청 중인 건이 있는지 확인

### **캠페인 상태 관리**

1. **신청** → **선정**: 관리자가 선정 처리
2. **선정** → **완료**: 콘텐츠 등록 완료 시
3. **선정** → **취소/반려**: 가이드라인 미준수 시
4. **취소/반려** → **패널티**: 반복적인 미준수 시

---

## 🚀 **성능 최적화**

### **캐싱 전략**

1. **Redis 캐싱**:

   - 캠페인 목록 (5분)
   - 사용자 포인트 정보 (1분)
   - 필터 옵션 (1시간)

2. **데이터베이스 인덱스**:
   ```sql
   CREATE INDEX idx_campaigns_category ON campaigns(category);
   CREATE INDEX idx_campaigns_subcategory ON campaigns(subcategory);
   CREATE INDEX idx_campaigns_channel ON campaigns(channel);
   CREATE INDEX idx_applications_user_status ON campaign_applications(user_id, status);
   CREATE INDEX idx_point_history_user_date ON point_history(user_id, date);
   ```

### **페이징 처리**

```http
GET /api/campaigns/delivery?page=1&size=20
```

**Response**:

```json
{
  "content": [...],
  "pageable": {
    "pageNumber": 1,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

---

## 📝 **에러 처리**

### **표준 에러 응답**

```json
{
  "error": {
    "code": "CAMPAIGN_NOT_FOUND",
    "message": "캠페인을 찾을 수 없습니다.",
    "details": "ID: delivery_999"
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### **주요 에러 코드**

- `CAMPAIGN_NOT_FOUND`: 캠페인을 찾을 수 없음
- `CAMPAIGN_ALREADY_APPLIED`: 이미 신청한 캠페인
- `CAMPAIGN_APPLICATION_CLOSED`: 신청 기간 마감
- `INSUFFICIENT_POINTS`: 포인트 부족
- `INVALID_ACCOUNT_INFO`: 계좌 정보 오류
- `UNAUTHORIZED`: 인증 실패
- `FORBIDDEN`: 권한 없음

---

## 🔄 **실시간 기능**

### **WebSocket 연결**

```javascript
// 캠페인 신청 현황 실시간 업데이트
ws://localhost:8080/ws/campaigns/{campaignId}/recruitment
```

### **푸시 알림**

- 캠페인 선정 알림
- 포인트 적립 알림
- 출금 완료 알림
- 마감 임박 알림

---

## 📱 **모바일 대응**

### **반응형 API**

- 모바일에서는 이미지 크기 조정
- 필터 옵션 간소화
- 터치 친화적 UI 데이터 제공

### **PWA 지원**

- 오프라인 캠페인 목록 캐싱
- 백그라운드 동기화
- 푸시 알림 지원

---

## 🧪 **테스트 전략**

### **단위 테스트**

- Service Layer 테스트
- Repository Layer 테스트
- 비즈니스 로직 검증

### **통합 테스트**

- API 엔드포인트 테스트
- 데이터베이스 연동 테스트
- 인증/인가 테스트

### **성능 테스트**

- 부하 테스트 (1000 동시 사용자)
- 응답 시간 측정
- 메모리 사용량 모니터링

---

## 📈 **모니터링 및 로깅**

### **애플리케이션 로그**

```yaml
logging:
  level:
    com.reviewx: INFO
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

### **메트릭 수집**

- API 응답 시간
- 에러율
- 사용자 활동 통계
- 캠페인 참여율

### **알림 설정**

- 에러율 5% 초과 시 알림
- 응답 시간 3초 초과 시 알림
- 데이터베이스 연결 실패 시 알림

---

## 🚀 **배포 및 운영**

### **환경 구성**

- **개발**: localhost:8080
- **스테이징**: staging.reviewx.com
- **프로덕션**: api.reviewx.com

### **CI/CD 파이프라인**

1. 코드 커밋 → GitHub
2. 자동 테스트 실행
3. Docker 이미지 빌드
4. 스테이징 배포
5. 수동 승인 후 프로덕션 배포

### **백업 전략**

- 데이터베이스 일일 백업
- 파일 스토리지 백업
- 설정 파일 버전 관리

---

## 📞 **개발팀 연락처**

- **백엔드 개발자**: backend@reviewx.com
- **프론트엔드 개발자**: frontend@reviewx.com
- **DevOps 엔지니어**: devops@reviewx.com

---

## 📚 **추가 참고 자료**

- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [JWT 인증 가이드](https://jwt.io/introduction)
- [MySQL 성능 최적화](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Redis 캐싱 전략](https://redis.io/docs/manual/patterns/)

---

_이 문서는 ReviewX 프로젝트의 백엔드 개발을 위한 종합 가이드입니다. 추가 질문이나 수정사항이 있으면 개발팀에 문의해주세요._
