/* ========================================
   HTML 새니타이제이션 유틸리티
   ======================================== */

/**
 * sanitize
 *
 * 목적: dangerouslySetInnerHTML 사용 시 XSS 공격을 방어하기 위한
 *       DOMPurify 기반 HTML 새니타이제이션 유틸리티
 *
 * 사용 페이지:
 * - 모든 dangerouslySetInnerHTML 사용 컴포넌트
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * 단순 HTML 새니타이즈 설정
 * 허용 태그: br, span (줄바꿈 + 색상 텍스트 용도)
 * 허용 속성: style (span 색상용)
 */
const SIMPLE_HTML_CONFIG = {
  ALLOWED_TAGS: ["br", "span"],
  ALLOWED_ATTR: ["style"],
};

/**
 * 리치 HTML 새니타이즈 설정
 * 허용 태그: 서식 관련 HTML 태그 전체
 * 허용 속성: href, src, alt, style, class, target, rel 등
 */
const RICH_HTML_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "span",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "del",
    "sub",
    "sup",
    "mark",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "video",
    "source",
    "iframe",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "div",
    "blockquote",
    "pre",
    "code",
    "hr",
    "figure",
    "figcaption",
  ],
  ALLOWED_ATTR: [
    "href",
    "src",
    "alt",
    "title",
    "style",
    "class",
    "target",
    "rel",
    "width",
    "height",
    "colspan",
    "rowspan",
    "controls",
    "autoplay",
    "loop",
    "muted",
    "type",
  ],
  ADD_ATTR: ["target"],
};

/** 단순 HTML 새니타이즈 (br, span+style만 허용) — 가이드라인/모달용 */
export const sanitizeSimpleHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, SIMPLE_HTML_CONFIG);
};

/** 리치 HTML 새니타이즈 (서식 태그 허용) — 게시글/FAQ용 */
export const sanitizeRichHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, RICH_HTML_CONFIG);
};
