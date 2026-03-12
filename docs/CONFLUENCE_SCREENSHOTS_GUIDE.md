# Claude Code가 Confluence에 스크린샷 올리는 방법 총정리

---

## Claude Code만 가능한 방식 (MCP 직접 도구 호출)

Claude Code에는 Playwright MCP 도구가 내장되어 있어서 스크립트 없이 브라우저를 직접 조작할 수 있음.

1. **mcp__playwright__browser_navigate** → localhost 페이지 접속
2. **mcp__playwright__browser_evaluate** → localStorage에 Mock 토큰 주입 (로그인 우회)
3. **mcp__playwright__browser_take_screenshot** → PNG 캡처 → 로컬 파일 저장
4. **Bash로 Node.js 스크립트 실행** → Confluence REST API 호출 → 업로드

---

## Cursor / 다른 AI가 하는 방식 (스크립트 실행)

Claude Code의 MCP 도구가 없는 환경에서는 AI가 Playwright 스크립트를 작성하고, 사람이 실행하거나 AI가 Bash로 실행.

1. **Playwright 스크립트 작성** (capture.mjs)
   - `chromium.launch({ headless: true })`
   - localStorage에 Mock 토큰 주입
   - `page.screenshot({ path: 'output.png', fullPage: true })`

2. **node capture.mjs 실행** → PNG 파일 생성

3. **업로드 스크립트 실행** (add_screenshots_xxx.js)
   - Confluence REST API: `POST /rest/api/content/{pageId}/child/attachment`
   - multipart/form-data, **X-Atlassian-Token: no-check** 헤더 필수
   - 응답에서 **extensions.fileId** 추출

4. **ADF 수정 후 페이지 업데이트**
   - `GET /api/v2/pages/{pageId}?body-format=atlas_doc_format`
   - content 배열에서 "화면 캡처" heading 찾기 → **mediaSingle** 노드 splice 삽입
   - `PUT /api/v2/pages/{pageId}` (version.number + 1)

---

## mediaSingle 노드 (필수 — width 없으면 이미지 화면 가득 차게 커짐)

```json
{
  "type": "mediaSingle",
  "attrs": { "layout": "center", "width": 760, "widthType": "pixel" },
  "content": [{
    "type": "media",
    "attrs": {
      "id": "{fileId}",
      "type": "file",
      "collection": "contentId-{pageId}",
      "width": 1920,
      "height": 1080
    }
  }]
}
```

- **id**: `extensions.fileId` 사용 (최상위 id 아님)
- **collection**: `contentId-{pageId}`

---

## 핵심 주의사항

1. **이미지 있는 페이지** → 반드시 **ADF 형식**으로 PUT (markdown 사용 시 이미지 전부 삭제됨)
2. 업로드 응답의 **extensions.fileId** 사용 (최상위 id와 다름)
3. **widthType: "pixel"** + **width: 760** 없으면 이미지 무한정 커짐
4. **X-Atlassian-Token: no-check** 헤더 없으면 업로드 403 에러
5. 환경변수: **ATLASSIAN_EMAIL**, **ATLASSIAN_TOKEN** 필요

---

## 정리: 누가 실제로 "업로드"하는가

| 환경        | 방식 |
|------------|------|
| **Claude Code** | MCP 도구로 브라우저 직접 조작 + Bash로 스크립트 실행 |
| **Cursor**      | 스크립트 작성 → 사람이 실행 (또는 Bash로 직접 실행) |
| **공통**        | Confluence API는 항상 사람의 토큰(ATLASSIAN_TOKEN)으로 호출됨 |

---

## 이 프로젝트에서 실행하는 방법

- **한 번에 실행**: `npm run confluence:screenshots`  
  - `scripts/playwright_confluence_screenshots.mjs` 가 캡처 + 업로드 + ADF 삽입을 모두 수행
- 자세한 사용법: `scripts/README_confluence_screenshots.md`
