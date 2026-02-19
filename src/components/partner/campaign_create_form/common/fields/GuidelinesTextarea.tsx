/* ========================================
   📄 안내 사항 전용 Textarea (스크롤 유무에 따라 padding-right 조절)
   ======================================== */

/**
 * 안내 사항 Textarea 컴포넌트
 *
 * 목적: 스크롤이 있을 때만 padding-right 0, 없을 때는 20px 적용
 *
 * - ref로 scrollHeight vs clientHeight 비교 후 has_scroll 클래스 적용
 * - value 변경 시·리사이즈 시 재측정
 */

"use client";

import { useRef, useLayoutEffect, useState } from "react";
import textareaStyles from "@/styles/partner/campaign_create/campaign_guide/textareas.module.css";

interface GuidelinesTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}

function checkHasScroll(el: HTMLTextAreaElement | null): boolean {
  if (!el) return false;
  return el.scrollHeight > el.clientHeight;
}

export function GuidelinesTextarea({
  value,
  onChange,
  placeholder,
  readOnly,
}: GuidelinesTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    setHasScroll(checkHasScroll(el));
  }, [value]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setHasScroll(checkHasScroll(el));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <textarea
      ref={ref}
      className={`${textareaStyles.fixed_height_textarea} ${hasScroll ? textareaStyles.has_scroll : ""}`}
      value={value}
      onChange={onChange}
      onWheel={(e) => e.stopPropagation()}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
}
