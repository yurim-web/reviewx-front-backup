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

## Confluence 깨진 문자(◆◆◆) 방지 규칙

**원인:** ADF 업데이트 시 이모지·특수문자가 UTF-8 바이트 단위로 깨짐

**방지:**
- ADF 텍스트 노드에 이모지를 직접 쓸 때는 `updateConfluencePage` MCP 도구만 사용 (스크립트 JSON.stringify 금지)
- 이모지가 포함된 페이지는 반드시 ADF 형식으로만 수정

**업데이트 후 반드시 검증 (MCP·스크립트 모든 방법 동일):**
```
getConfluencePage(pageId, contentFormat: "markdown") 로 다시 읽어서
◆ / ◆◆◆ / ??? / □□□ / \uFFFD 패턴 없는지 전체 확인
→ 한 글자라도 발견되면 즉시 수정 (넘어가지 말 것)
```

**깨진 문자 발견 시:** 해당 텍스트를 정확한 한글로 대체하는 수정 스크립트 작성 후 실행
(이전 버전 복구: `node scripts/restore_confluence_images.js [페이지ID]`)

## Confluence 절대 금지
- 이미지 있는 페이지에 markdown 형식 업데이트
- `mediaSingle`에서 `width`, `widthType` 제거
- 기능명세서·백엔드 API·실제 코드 3가지 미확인 상태에서 임의 추가
- ADF 업데이트를 스크립트(JSON.stringify)로 직접 처리 — MCP 도구 사용할 것

## Confluence 수정 후 보고
수정 완료 후 반드시: **① 페이지 URL + ② 수정 내용 요약** 제공

## Confluence 스크린샷 업로드 (Claude Code vs Cursor)
- **Claude Code**: Playwright MCP로 브라우저 조작 + Bash로 업로드 스크립트 실행
- **Cursor 등**: 스크립트 작성 후 사람이 `npm run confluence:screenshots` 실행
- 상세: `docs/CONFLUENCE_SCREENSHOTS_GUIDE.md`, 실행 방법: `scripts/README_confluence_screenshots.md`
