# ReviewX Web — Claude Code 공통 규칙

## Confluence 이미지 페이지 수정 규칙

- **이미지 없는 페이지** → `contentFormat: "markdown"`
- **이미지 있는 페이지** → **반드시 ADF만** (markdown 사용 시 이미지 소실·거대화)

**이미지 있는 페이지 수정 순서:**
1. `getConfluencePage(pageId, contentFormat: "adf")` 로 읽기
2. 텍스트만 수정 (이미지 노드 건드리지 말 것)
3. `updateConfluencePage(contentFormat: "adf")` 로 업데이트

**mediaSingle 필수 속성 — 없으면 이미지 거대해짐:**
```json
{ "type": "mediaSingle", "attrs": { "layout": "center", "width": 760, "widthType": "pixel" } }
```

**이미지 커진 경우 복구:**
```bash
ATLASSIAN_EMAIL=이메일 ATLASSIAN_TOKEN=API토큰 node scripts/fix_confluence_image.js [페이지ID]
```

## Confluence 절대 금지
- 이미지 있는 페이지에 markdown 형식 업데이트
- `mediaSingle`에서 `width`, `widthType` 제거
- 기능명세서·백엔드 API·실제 코드 3가지 미확인 상태에서 임의 추가

## Confluence 수정 후 보고
수정 완료 후 반드시: **① 페이지 URL + ② 수정 내용 요약** 제공
