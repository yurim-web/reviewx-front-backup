# 모바일 반응형 빠른 참조

## 브레이크포인트

| 범위 | 설명 | 주요 기기 |
|------|------|----------|
| `0~374px` | 초소형 모바일 | iPhone SE, 갤럭시 폴드 |
| `375~739px` | 모바일 공통 | 대부분의 스마트폰 |
| `740~1100px (portrait)` | 태블릿 세로 | iPad, iPad Air |
| `740~1366px (landscape)` | 태블릿 가로 | iPad Pro |
| `1367px+` | 데스크톱 | PC, 노트북 |

## 주요 치수

### 헤더 높이
- 데스크톱: `80px`
- 모바일: `60px`
- 초소형: `56px`

### 터치 영역
- 모바일: `44x44px` (WCAG AAA)
- 초소형: `40x40px`

### 그리드 간격
- 데스크톱: `24px`
- 모바일: `12px`
- 초소형: `10px`

### 그리드 열
- 데스크톱: `4열`
- 태블릿: `3열` (세로) / `4열` (가로)
- 모바일: `2열`

## 폰트 크기 매트릭스

### 캠페인 카드 제목
- 데스크톱: `16px / 22px`
- 모바일: `13px / 18px`
- 초소형: `12px / 16px`

### 섹션 제목
- 데스크톱: `24px / 24px`
- 모바일: `18px / 18px`
- 초소형: `16px / 16px`

### 메뉴 항목
- 데스크톱: `20px / 20px`
- 모바일: `15px / 15px`
- 초소형: `14px / 14px`

## CSS 클래스명

### 주요 컨테이너
```css
.container              /* 메인 컨테이너 */
.main_menu_container    /* 메인 메뉴 */
.campaign_grid          /* 캠페인 그리드 */
.campaign_box           /* 캠페인 카드 */
.header_spacer          /* 헤더 공간 확보 */
```

### 반응형 패턴
```css
/* 모바일 우선 */
.element { /* 기본 스타일 */ }

@media (min-width: 740px) {
  .element { /* 태블릿+ */ }
}

@media (min-width: 1367px) {
  .element { /* 데스크톱 */ }
}
```

## 성능 최적화

### 필수 CSS 속성
```css
/* 스크롤 성능 */
-webkit-overflow-scrolling: touch;
touch-action: pan-y;

/* 애니메이션 성능 */
will-change: transform;
transition: transform 0.3s ease;

/* 터치 하이라이트 제거 */
-webkit-tap-highlight-color: transparent;

/* 이미지 렌더링 */
image-rendering: -webkit-optimize-contrast;
```

## 인터랙션 패턴

### 호버 vs 터치
```css
/* 데스크톱만 (마우스) */
@media (hover: hover) and (pointer: fine) {
  .element:hover { /* 호버 효과 */ }
}

/* 모바일만 (터치) */
@media (hover: none) and (pointer: coarse) {
  .element:active { /* 터치 효과 */ }
}
```

## 디버깅 팁

### Chrome DevTools
1. `F12` → Device Toolbar 활성화 (`Ctrl+Shift+M`)
2. 반응형 모드에서 다양한 기기 테스트
3. Network 탭에서 3G/4G 시뮬레이션

### 실제 기기 테스트
```bash
# 로컬 네트워크에서 접근
npm run dev
# http://[YOUR_LOCAL_IP]:3000
```

### 모바일 시뮬레이터
- iOS: Xcode Simulator
- Android: Android Studio Emulator
- 브라우저: Chrome DevTools, Firefox Responsive Design Mode

## 빠른 수정

### 텍스트가 너무 작음
```css
@media (max-width: 739px) {
  .your-element {
    font-size: 14px; /* 최소 11px 이상 권장 */
    line-height: 1.4; /* 가독성 개선 */
  }
}
```

### 터치 영역이 너무 작음
```css
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 10px;
}
```

### 이미지가 늘어남
```css
.image {
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 1; /* 정사각형 유지 */
}
```

### 가로 스크롤 발생
```css
.container {
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}
```

## 체크리스트

### 배포 전 확인사항
- [ ] 모든 브레이크포인트에서 레이아웃 확인
- [ ] 터치 영역이 최소 44x44px
- [ ] 텍스트가 가독성 있게 표시
- [ ] 이미지가 올바르게 로드
- [ ] 스크롤이 부드럽게 동작
- [ ] 애니메이션이 60fps
- [ ] 페이지 로드 시간 < 3초
- [ ] Lighthouse 모바일 점수 > 90

## 문제 해결

### 흔한 문제

**Q: 모바일에서 레이아웃이 깨짐**
```css
/* viewport meta 태그 확인 */
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Q: 터치 스크롤이 안 됨**
```css
.element {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

**Q: 애니메이션이 끊김**
```css
.element {
  will-change: transform;
  transform: translateZ(0); /* GPU 가속 */
}
```

## 관련 파일

### 스타일
- `src/styles/fragments/header.module.css`
- `src/styles/home/home.module.css`
- `src/styles/user/campaign/campaign_box.module.css`
- `src/styles/main/main_banner_slider.module.css`

### 컴포넌트
- `src/components/main/HomePageClient.tsx`
- `src/components/fragments/Header.tsx`
- `src/components/main/MainMenu.tsx`
- `src/components/main/CampaignBox.tsx`
