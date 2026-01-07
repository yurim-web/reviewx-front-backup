/* ========================================
   📄 메인 푸터 컴포넌트
   ======================================== */

/**
 * 메인 푸터 컴포넌트
 *
 * 목적: 메인 홈, 캠페인 목록, 검색 결과 페이지 하단에 표시되는 푸터입니다.
 *
 * 사용 위치:
 * - / (메인 홈 페이지)
 * - /user (유저 메인 홈 페이지)
 * - /partner (파트너 메인 홈 페이지)
 * - /campaign/delivery (배송형 캠페인 목록)
 * - /campaign/visit (방문형 캠페인 목록)
 * - /campaign/review (구매평 캠페인 목록)
 * - /campaign/mission (미션형 캠페인 목록)
 * - /campaign/reporter (기자단 캠페인 목록)
 * - /search (검색 결과 페이지)
 *
 * 주요 기능:
 * - 회사 정보 표시
 * - 개인정보처리방침, 이용약관, 사업자 정보 링크
 * - 저작권 정보 표시
 */

"use client";

import styles from "@/styles/main/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_content}>
        {/* 상단 섹션: 로고, 링크, 저작권 */}
        <div className={styles.top_section}>
          {/* 로고와 링크 섹션을 묶은 그룹 */}
          <div className={styles.left_group}>
            {/* 로고 */}
            <div className={styles.logo_container}>
              <img
                src="/images/footer/footer_logo.svg"
                alt="Mark-X"
                className={styles.logo}
              />
            </div>

            {/* 링크 섹션 */}
            <div className={styles.links_section}>
              <span className={styles.link}>개인정보처리방침</span>
              <span className={styles.link_separator}>|</span>
              <span className={styles.link}>이용약관</span>
              <span className={styles.link_separator}>|</span>
              <span className={styles.link}>
                사업자 정보
                <img
                  src="/images/footer/footer_arrow.svg"
                  alt=""
                  className={styles.arrow_icon}
                />
              </span>
            </div>
          </div>

          {/* 저작권 정보 */}
          <p className={styles.copyright}>
            © 2025 Mark-X Co., Ltd. All rights reserved.
          </p>
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* 회사 상세 정보 */}
        <div className={styles.company_info}>
          <div className={styles.info_row}>
            <span className={styles.info_value}>주식회사 마크엑스</span>
            <span className={styles.info_separator}>|</span>
            <span className={styles.info_label}>대표자</span>
            <span className={styles.info_value}>유기수</span>
            <span className={styles.info_separator}>|</span>
            <span className={styles.info_label}>사업자등록번호</span>
            <span className={styles.info_value}>246-87-04020</span>
            <span className={styles.info_separator}>|</span>
            <span className={styles.info_label}>통신판매업신고번호</span>
            <span className={styles.info_value}>제2025-인천남동-00000호</span>
          </div>
          <div className={styles.info_row}>
            <span className={styles.info_label}>주소</span>
            <span className={styles.info_value}>
              인천 남동구 장자로 14, 2층 201호 (장수동)
            </span>
            <span className={styles.info_separator}>|</span>
            <span className={styles.info_label}>메일</span>
            <span className={styles.info_value}>contact@markx.dev</span>
            <span className={styles.info_separator}>|</span>
            <span className={styles.info_label}>전화</span>
            <span className={styles.info_value}>1500-0000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
