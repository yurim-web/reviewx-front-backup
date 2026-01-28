# 모바일 반응형 테스트 가이드

## 테스트 환경 설정

### 1. 로컬 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

### 2. 모바일 기기에서 접근
```bash
# 로컬 IP 확인 (Windows)
ipconfig

# 로컬 IP 확인 (Mac/Linux)
ifconfig

# 모바일 브라우저에서 접근
http://[YOUR_LOCAL_IP]:3000
```

## 브라우저 개발자 도구 테스트

### Chrome DevTools
1. `F12` 또는 `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac) - Device Toolbar 토글
3. 상단 기기 선택 드롭다운에서 다양한 기기 선택

### 추천 테스트 기기 (Chrome DevTools)
```
1. iPhone SE (375 × 667)
2. iPhone 12 Pro (390 × 844)
3. iPhone 14 Pro Max (430 × 932)
4. Samsung Galaxy S21 (360 × 800)
5. Samsung Galaxy Fold (280 × 653 - 접힌 상태)
6. iPad (768 × 1024)
7. iPad Pro 11" (834 × 1194)
8. Responsive (사용자 정의 크기)
```

### Firefox Responsive Design Mode
1. `Ctrl+Shift+M` (Windows) / `Cmd+Option+M` (Mac)
2. 상단에서 기기 선택 또는 사용자 정의 크기 입력

## 테스트 시나리오

### 📱 시나리오 1: 헤더 인터랙션

#### 테스트 단계
1. **검색 기능**
   - [ ] 검색 아이콘 클릭 시 검색창이 열리는가?
   - [ ] 검색창에 텍스트 입력이 가능한가?
   - [ ] Enter 키로 검색이 실행되는가?
   - [ ] 검색 버튼 클릭으로 검색이 실행되는가?
   - [ ] 검색창 외부 클릭 시 검색창이 닫히는가?

2. **알림 아이콘**
   - [ ] 알림 아이콘이 터치하기 쉬운가? (44x44px 이상)
   - [ ] 알림 페이지로 이동하는가?

3. **마이페이지 아이콘**
   - [ ] 마이페이지 아이콘이 터치하기 쉬운가?
   - [ ] 마이페이지로 이동하는가?

#### 예상 결과
- 모든 아이콘의 터치 영역이 충분히 큼
- 인터랙션이 즉각적으로 반응함
- 시각적 피드백이 명확함

---

### 🏠 시나리오 2: 메인 메뉴 네비게이션

#### 테스트 단계
1. **메뉴 스크롤**
   - [ ] 메뉴가 가로로 스크롤 되는가?
   - [ ] 스크롤이 부드러운가?
   - [ ] 스크롤바가 보이지 않는가?
   - [ ] 메뉴 항목이 명확하게 보이는가?

2. **메뉴 선택**
   - [ ] 각 메뉴 항목이 터치하기 쉬운가?
   - [ ] 활성 메뉴가 시각적으로 구분되는가?
   - [ ] 메뉴 클릭 시 해당 페이지로 이동하는가?

3. **반응형 동작**
   - [ ] 320px 너비에서도 메뉴가 작동하는가?
   - [ ] 가로 모드에서도 정상 작동하는가?

#### 예상 결과
- 메뉴가 한 줄에 표시되고 스크롤 가능
- 활성 메뉴가 분홍색(#ff5694)으로 강조
- 모든 화면 크기에서 정상 작동

---

### 🎠 시나리오 3: 배너 슬라이더

#### 테스트 단계
1. **자동 슬라이드**
   - [ ] 5초마다 자동으로 슬라이드가 전환되는가?
   - [ ] 슬라이드 전환이 부드러운가?
   - [ ] 마지막 슬라이드 후 첫 슬라이드로 돌아가는가?

2. **수동 조작**
   - [ ] 페이지네이션 도트를 클릭하면 해당 슬라이드로 이동하는가?
   - [ ] 스와이프 제스처가 작동하는가? (모바일)
   - [ ] 활성 도트가 명확하게 표시되는가?

3. **반응형 이미지**
   - [ ] 이미지가 화면에 맞게 조정되는가?
   - [ ] 이미지 비율이 유지되는가?
   - [ ] 이미지가 흐릿하지 않은가?

#### 예상 결과
- 배너가 화면 너비에 맞게 표시
- 모바일: 180px 높이, 16:9 비율
- 초소형: 160px 높이

---

### 🎯 시나리오 4: 캠페인 카드 그리드

#### 테스트 단계
1. **그리드 레이아웃**
   - [ ] 데스크톱: 4열로 표시되는가?
   - [ ] 태블릿: 3열(세로) 또는 4열(가로)로 표시되는가?
   - [ ] 모바일: 2열로 표시되는가?
   - [ ] 카드 간격이 적절한가?

2. **카드 내용**
   - [ ] 이미지가 정사각형 비율을 유지하는가?
   - [ ] 제목이 2줄로 제한되고 말줄임표가 표시되는가?
   - [ ] 카테고리 아이콘이 명확하게 보이는가?
   - [ ] 모집 상태가 읽기 쉬운가?

3. **인터랙션**
   - [ ] 카드 클릭 시 상세 페이지로 이동하는가?
   - [ ] 데스크톱: 호버 시 카드가 위로 올라가는가?
   - [ ] 모바일: 터치 시 시각적 피드백이 있는가?

4. **특수 상태**
   - [ ] "긴급" 라벨이 표시되는가?
   - [ ] "마감임박" 라벨이 표시되는가?
   - [ ] "오픈 예정" 오버레이가 표시되는가?
   - [ ] 오버레이 텍스트가 읽기 쉬운가?

#### 예상 결과
- 모든 화면 크기에서 그리드가 올바르게 표시
- 카드 내용이 가독성 있게 표시
- 인터랙션이 직관적이고 반응적

---

### 📏 시나리오 5: 타이포그래피 및 가독성

#### 테스트 단계
1. **섹션 제목**
   - [ ] 제목이 명확하게 읽히는가?
   - [ ] 폰트 크기가 적절한가?
   - [ ] 줄 간격이 충분한가?

2. **캠페인 정보**
   - [ ] 캠페인 제목이 읽기 쉬운가?
   - [ ] 카테고리 텍스트가 명확한가?
   - [ ] 모집 인원 정보가 구분되는가?

3. **최소 폰트 크기**
   - [ ] 모든 텍스트가 최소 10px 이상인가?
   - [ ] 초소형 기기에서도 읽을 수 있는가?

#### 예상 결과
- 모든 텍스트가 WCAG AA 기준 충족
- 최소 폰트 크기: 10px (초소형), 11px (모바일)

---

### 🚀 시나리오 6: 성능 테스트

#### 테스트 단계
1. **페이지 로드**
   - [ ] 초기 로드 시간이 3초 이내인가?
   - [ ] 이미지가 점진적으로 로드되는가?
   - [ ] Layout Shift가 최소화되는가?

2. **스크롤 성능**
   - [ ] 스크롤이 부드러운가? (60fps)
   - [ ] 스크롤 시 버벅거림이 없는가?
   - [ ] 긴 목록에서도 성능이 유지되는가?

3. **애니메이션**
   - [ ] 카드 호버/터치 효과가 부드러운가?
   - [ ] 배너 슬라이드 전환이 자연스러운가?
   - [ ] 메뉴 전환이 즉각적인가?

#### 측정 도구
```javascript
// Chrome DevTools Performance 탭
1. Performance 탭 열기
2. 녹화 시작 (Ctrl+E)
3. 페이지 스크롤 및 인터랙션
4. 녹화 중지
5. FPS 그래프 확인 (60fps 목표)
```

#### 예상 결과
- First Contentful Paint (FCP) < 1.8초
- Largest Contentful Paint (LCP) < 2.5초
- Time to Interactive (TTI) < 3.8초
- Cumulative Layout Shift (CLS) < 0.1

---

### ♿ 시나리오 7: 접근성 테스트

#### 테스트 단계
1. **터치 타겟**
   - [ ] 모든 버튼/링크가 최소 44x44px (모바일)인가?
   - [ ] 터치 영역 간 충분한 간격이 있는가?

2. **색상 대비**
   - [ ] 텍스트와 배경의 대비가 충분한가? (4.5:1 이상)
   - [ ] 비활성 요소도 구분 가능한가?

3. **ARIA 레이블**
   - [ ] 아이콘 버튼에 aria-label이 있는가?
   - [ ] 이미지에 alt 텍스트가 있는가?

#### 측정 도구
```bash
# Chrome Lighthouse
1. F12 → Lighthouse 탭
2. Categories: Accessibility 체크
3. "Generate report" 클릭
4. 점수 90+ 목표
```

#### 예상 결과
- Lighthouse Accessibility 점수 > 90
- 모든 WCAG 2.1 Level AA 기준 충족

---

## 테스트 체크리스트

### 화면 크기별 테스트
- [ ] 320px (초소형 모바일)
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 12/13/14)
- [ ] 414px (iPhone 11 Pro Max)
- [ ] 430px (iPhone 14 Pro Max)
- [ ] 768px (iPad)
- [ ] 834px (iPad Pro 11")
- [ ] 1024px (iPad Pro 12.9")
- [ ] 1366px+ (데스크톱)

### 방향 테스트
- [ ] 세로 모드 (Portrait)
- [ ] 가로 모드 (Landscape)

### 브라우저 테스트
- [ ] Chrome (최신)
- [ ] Safari (iOS)
- [ ] Firefox (최신)
- [ ] Samsung Internet (Android)
- [ ] Edge (최신)

### 네트워크 테스트
- [ ] Fast 3G
- [ ] Slow 3G
- [ ] Offline (Service Worker)

## 버그 리포팅 템플릿

```markdown
### 버그 제목
[간단한 버그 설명]

### 환경
- 기기: [예: iPhone 12]
- OS: [예: iOS 16.0]
- 브라우저: [예: Safari 16.0]
- 화면 크기: [예: 390 × 844]
- 네트워크: [예: 4G]

### 재현 단계
1. [첫 번째 단계]
2. [두 번째 단계]
3. [세 번째 단계]

### 예상 동작
[무엇이 일어나야 하는가]

### 실제 동작
[무엇이 실제로 일어났는가]

### 스크린샷
[스크린샷 첨부]

### 추가 정보
[기타 관련 정보]
```

## 자동화 테스트 (추후 구현)

### Playwright 예시
```javascript
// tests/mobile-responsive.spec.ts
import { test, expect } from '@playwright/test';

test.describe('모바일 반응형 테스트', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('헤더가 모바일에서 올바르게 표시됨', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toHaveCSS('height', '60px');
  });

  test('캠페인 그리드가 2열로 표시됨', async ({ page }) => {
    await page.goto('/');
    const grid = page.locator('.campaign_grid');
    await expect(grid).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');
  });
});
```

## 유용한 도구

### Chrome Extensions
- [Responsive Viewer](https://chrome.google.com/webstore/detail/responsive-viewer) - 여러 화면 크기 동시 확인
- [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse) - 성능 및 접근성 측정
- [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool) - 접근성 평가

### 온라인 도구
- [BrowserStack](https://www.browserstack.com/) - 실제 기기 테스트
- [LambdaTest](https://www.lambdatest.com/) - 크로스 브라우저 테스트
- [PageSpeed Insights](https://pagespeed.web.dev/) - 성능 측정

### 로컬 도구
```bash
# 모바일 시뮬레이터
xcode-select --install  # iOS Simulator (Mac)
android-studio          # Android Emulator
```

## 문제 해결

### 일반적인 문제

**Q: 모바일에서 텍스트가 너무 작음**
- 최소 폰트 크기 확인 (11px 이상)
- 미디어 쿼리가 올바르게 적용되었는지 확인

**Q: 터치 영역이 작음**
- 최소 44x44px 확인
- padding을 추가하여 터치 영역 확대

**Q: 가로 스크롤 발생**
- `overflow-x: hidden` 추가
- 요소의 max-width 확인

**Q: 이미지가 늘어남**
- `object-fit: cover` 사용
- `aspect-ratio` 속성 설정

## 성공 기준

### 필수 기준
- [ ] 모든 화면 크기에서 레이아웃이 깨지지 않음
- [ ] 터치 영역이 최소 44x44px
- [ ] 페이지 로드 시간 < 3초
- [ ] Lighthouse 모바일 점수 > 90

### 권장 기준
- [ ] 스크롤 성능 60fps 유지
- [ ] 이미지 최적화 (WebP, lazy loading)
- [ ] Critical CSS 인라인화
- [ ] Service Worker로 오프라인 지원

## 참고 자료

- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Can I Use](https://caniuse.com/) - 브라우저 호환성 확인
