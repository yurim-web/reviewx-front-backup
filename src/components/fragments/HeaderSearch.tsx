"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactElement,
} from "react";

import styles from "@/styles/fragments/header.module.css";

interface HeaderSearchProps {
  /**
   * 검색 실행 시 호출되는 콜백
   * - 값을 넘기지 않으면 기본으로 `/search?keyword=` 로 이동합니다.
   */
  on_submit_search?: (keyword: string) => void;
  /**
   * 검색 결과 페이지 경로
   * - on_submit_search가 없을 때만 사용됩니다.
   * @default "/search"
   */
  search_path?: string;
  /**
   * 인풋 placeholder
   * @default "검색"
   */
  placeholder?: string;
}

export default function HeaderSearch({
  on_submit_search,
  search_path = "/search",
  placeholder = "검색",
}: HeaderSearchProps): ReactElement {
  const router = useRouter();

  const [is_search_open, set_is_search_open] = useState(false);
  const [search_text, set_search_text] = useState("");

  const handle_click_search_toggle = () => {
    set_is_search_open((prev) => !prev);
  };

  const handle_change_search = (e: ChangeEvent<HTMLInputElement>) => {
    set_search_text(e.target.value);
  };

  const handle_submit_search = () => {
    const trimmed = search_text.trim();

    if (!trimmed) {
      return;
    }

    if (on_submit_search) {
      on_submit_search(trimmed);
    } else {
      router.push(`${search_path}?keyword=${encodeURIComponent(trimmed)}`);
    }

    set_search_text("");
    set_is_search_open(false);
  };

  const handle_keydown_search = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handle_submit_search();
    }
  };

  return (
    <>
      {is_search_open ? (
        <div className={styles.search_box}>
          <input
            type="text"
            className={styles.search_input}
            placeholder={placeholder}
            value={search_text}
            onChange={handle_change_search}
            onKeyDown={handle_keydown_search}
          />
          <button
            type="button"
            className={styles.search_icon_button}
            onClick={handle_submit_search}
            aria-label="검색"
          >
            {/* 검색창이 열렸을 때 사용하는 내부 검색 아이콘 */}
            <img src="/images/header/header_search_inner.svg" alt="검색" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.search_toggle_button}
          onClick={handle_click_search_toggle}
          aria-label="검색 열기"
        >
          <img src="/images/header/header_search.svg" alt="검색" />
        </button>
      )}
    </>
  );
}
