"use client";

import { useEffect } from "react";

const BUILD_ID_STORAGE_KEY = "reviewx_build_id";

/**
 * 새 빌드 배포 시 localStorage를 비웁니다.
 *
 * - 빌드할 때마다 next.config의 NEXT_PUBLIC_BUILD_ID가 바뀝니다.
 * - 앱 로드 시 저장된 빌드 ID와 비교해 다르면 localStorage.clear() 후 현재 빌드 ID를 저장합니다.
 * - 개발 시에는 next dev 재실행 시, 프로덕션에서는 next build 후 배포 시마다 한 번 비워집니다.
 */
export default function BuildIdLocalStorageClear() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored_build_id = localStorage.getItem(BUILD_ID_STORAGE_KEY);
    const current_build_id = process.env.NEXT_PUBLIC_BUILD_ID ?? "";

    if (stored_build_id !== current_build_id) {
      localStorage.clear();
      if (current_build_id) {
        localStorage.setItem(BUILD_ID_STORAGE_KEY, current_build_id);
      }
    }
  }, []);

  return null;
}
