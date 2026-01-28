# 모바일 반응형 최적화 가이드

## 개요
ReviewX 메인 홈 페이지의 모바일 반응형 디자인을 최적화했습니다. 모바일 우선(Mobile-First) 접근 방식을 통해 다양한 화면 크기에서 최적의 사용자 경험을 제공합니다.

## 주요 개선사항

### 1. 반응형 브레이크포인트
```css
/* 초소형 모바일 */
@media (max-width: 374px) { /* iPhone SE, 갤럭시 폴드 등 */ }

/* 모바일 공통 */
@media (max-width: 739px) { /* 대부분의 스마트폰 */ }

/* 태블릿 세로 */
@media (min-width: 740px) and (max-width: 1100px) and (orientation: portrait) { }

/* 태블릿 가로 */
@media (min-width: 740px) and (max-width: 1366px) and (orientation: landscape) { }

/* 데스크톱 */
기본 스타일 (1000px 이상)
```

### 2. 헤더 최적화

#### 데스크톱
- 높이: 80px
- 로고: 24px
- 아이콘: 32x32px
- 패딩: 28px 40px

#### 모바일 (0~739px)
- 높이: 60px
- 로고: 20px
- 아이콘 터치 영역: 44x44px (WCAG 권장)
- 실제 아이콘: 24x24px
- 패딩: 20px 24px

#### 초소형 모바일 (320~374px)
- 높이: 56px
- 로고: 18px
- 아이콘 터치 영역: 40x40px
- 실제 아이콘: 20x20px
- 패딩: 16px

### 3. 메인 메뉴 최적화

#### 모바일 개선사항
- **수평 스크롤 가능**: 모든 메뉴를 한 줄에 표시하고 좌우 스크롤 지원
- **터치 영역**: 최소 44px 높이로 터치하기 쉽게
- **스크롤바 숨김**: 깔끔한 UI를 위해 스크롤바 숨김
- **Smooth Scrolling**: 부드러운 스크롤 경험

```css
/* 모바일 메뉴 */
overflow-x: auto;
-webkit-overflow-scrolling: touch;
scrollbar-width: none;
```

### 4. 캠페인 그리드

#### 데스크톱
- 4열 그리드 (grid-template-columns: repeat(4, 1fr))
- Gap: 24px

#### 모바일 (0~739px)
- 2열 그리드
- Gap: 12px
- 더 타이트한 레이아웃

#### 초소형 모바일 (320~374px)
- 2열 유지
- Gap: 10px

### 5. 캠페인 카드 최적화

#### 타이포그래피
```css
/* 데스크톱 */
제목: 16px / line-height: 22px
카테고리: 16px / line-height: 16px
모집 상태: 14px / line-height: 14px

/* 모바일 (0~739px) */
제목: 13px / line-height: 18px
카테고리: 13px / line-height: 13px
모집 상태: 11px / line-height: 11px

/* 초소형 모바일 (320~374px) */
제목: 12px / line-height: 16px
카테고리: 12px / line-height: 12px
모집 상태: 10px / line-height: 10px
```

#### 인터랙션 개선
- **데스크톱**: 호버 시 카드가 위로 올라가는 효과
- **모바일**: 터치 시 살짝 축소되는 피드백
- **터치 하이라이트 제거**: `-webkit-tap-highlight-color: transparent`

### 6. 배너 슬라이더

#### 높이 조정
```css
/* 데스크톱 */
height: 418px

/* 모바일 (0~739px) */
min-height: 180px
aspect-ratio: 16/9

/* 초소형 모바일 (320~374px) */
min-height: 160px
```

### 7. 검색창 최적화

#### 모바일
- 높이: 44px (터치하기 쉬운 크기)
- 폰트: 14px
- 최대 너비: 200px

#### 초소형 모바일
- 높이: 40px
- 폰트: 13px
- 최대 너비: 160px

### 8. 성능 최적화

#### CSS 최적화
```css
/* 애니메이션 성능 */
will-change: transform;
transition: transform 0.3s ease;

/* 이미지 렌더링 */
image-rendering: -webkit-optimize-contrast;
image-rendering: crisp-edges;
```

#### 스크롤 성능
```css
-webkit-overflow-scrolling: touch;
touch-action: pan-y;
```

## 접근성 (Accessibility)

### 1. 터치 타겟 크기
- 모바일: 최소 44x44px (WCAG 2.1 Level AAA)
- 초소형: 최소 40x40px

### 2. 텍스트 가독성
- 최소 폰트 크기: 10px (초소형), 11px (모바일), 14px (데스크톱)
- 충분한 line-height로 가독성 확보
- 적절한 letter-spacing

### 3. 색상 대비
- 모든 텍스트가 WCAG AA 기준 충족
- 배경과 전경 색상의 대비율 유지

## 테스트 체크리스트

### 모바일 기기
- [ ] iPhone SE (375x667)
- [ ] iPhone 12/13/14 (390x844)
- [ ] iPhone 14 Pro Max (430x932)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] Samsung Galaxy Fold (280x653 folded)

### 태블릿
- [ ] iPad (768x1024)
- [ ] iPad Pro 11" (834x1194)
- [ ] iPad Pro 12.9" (1024x1366)

### 테스트 시나리오
1. **헤더 인터랙션**
   - [ ] 검색 아이콘 클릭 시 검색창 열림
   - [ ] 검색창 외부 클릭 시 닫힘
   - [ ] 모든 아이콘이 터치하기 쉬운가?

2. **메인 메뉴**
   - [ ] 좌우 스크롤이 부드러운가?
   - [ ] 활성 메뉴가 명확하게 표시되는가?
   - [ ] 메뉴 항목이 터치하기 쉬운가?

3. **캠페인 카드**
   - [ ] 이미지가 제대로 로드되는가?
   - [ ] 텍스트가 가독성 있게 표시되는가?
   - [ ] 2열 그리드가 올바르게 작동하는가?
   - [ ] 터치 피드백이 작동하는가?

4. **배너 슬라이더**
   - [ ] 자동 슬라이드가 작동하는가?
   - [ ] 스와이프 제스처가 작동하는가?
   - [ ] 페이지네이션 도트가 보이는가?

5. **성능**
   - [ ] 페이지 로드 시간이 3초 이내인가?
   - [ ] 스크롤이 부드러운가?
   - [ ] 애니메이션이 60fps로 동작하는가?

## 주요 변경 파일

### 스타일 파일
```
src/styles/fragments/header.module.css
src/styles/home/home.module.css
src/styles/home/text.module.css
src/styles/main/main_banner_slider.module.css
src/styles/user/campaign/campaign_box.module.css
```

### 컴포넌트 파일
```
src/components/main/HomePageClient.tsx
```

## 향후 개선사항

1. **다크 모드 지원**
   - 시스템 설정에 따른 다크 모드 자동 전환
   - 다크 모드에 최적화된 색상 팔레트

2. **Progressive Web App (PWA)**
   - 오프라인 지원
   - 홈 화면 추가 기능
   - 푸시 알림

3. **성능 개선**
   - 이미지 lazy loading
   - Critical CSS 인라인화
   - 코드 스플리팅 최적화

4. **애니메이션 개선**
   - 페이지 전환 애니메이션
   - 스켈레톤 로딩 UI
   - 인터랙티브한 마이크로 인터랙션

## 참고 자료

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
