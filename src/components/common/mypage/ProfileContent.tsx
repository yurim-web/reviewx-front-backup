/* ========================================
   👤 프로필 콘텐츠 공통 컴포넌트
   ======================================== */

/**
 * 프로필 콘텐츠 공통 컴포넌트
 *
 * 목적: 유저와 파트너 마이페이지에서 공통으로 사용하는 프로필 섹션과 메뉴를 제공합니다.
 *
 * 사용 페이지:
 * - /user/mypage/profile (유저 마이페이지 프로필)
 * - /partner/mypage (파트너 마이페이지)
 *
 * 주요 기능:
 * - 프로필 정보 표시 (역할, 닉네임)
 * - 내 정보 수정 버튼
 * - 이용 가이드, 공지사항, FAQ, 카카오톡 상담 메뉴
 * - 로그아웃 버튼
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/common/modal/BaseModal";
import MemberTypeToggle from "@/components/common/mypage/MemberTypeToggle";
import profileStyles from "@/styles/user/mypage/profile.module.css";

/**
 * ProfileContent 컴포넌트의 Props 타입 정의
 *
 * TypeScript 인터페이스: 컴포넌트가 받을 수 있는 데이터의 구조를 정의합니다.
 * 이렇게 타입을 정의하면 IDE에서 자동완성과 타입 체크를 받을 수 있습니다.
 */
interface ProfileContentProps {
  /** 사용자 역할 (예: "리뷰어", "광고주") */
  role: string;
  /** 사용자 닉네임 또는 회사명 */
  nickname: string;
  /** 내 정보 수정 페이지 경로 (예: "/user/mypage/edit", "/partner/mypage/edit") */
  editPath: string;
  /** 로그아웃 버튼 클릭 시 실행할 함수 (선택적) */
  onLogout?: () => void;
  /** 프로필 이미지 URL (선택적) */
  profileImage?: string;
  /** 회원 유형 토글 버튼 표시 여부 (선택적) */
  showMemberTypeToggle?: boolean;
  /** 현재 활성화된 회원 유형 (선택적) */
  activeMemberType?: "reviewer" | "partner";
  /** 회원 유형 변경 시 실행할 함수 (선택적) */
  onMemberTypeChange?: (type: "reviewer" | "partner") => void;
}

/**
 * 프로필 콘텐츠 컴포넌트
 *
 * @param props - ProfileContentProps 타입의 props 객체
 * @returns JSX.Element - 프로필 섹션과 메뉴 리스트를 포함한 JSX 요소
 */
export default function ProfileContent({
  role,
  nickname,
  editPath,
  onLogout,
  profileImage,
  showMemberTypeToggle = false,
  activeMemberType = "reviewer",
  onMemberTypeChange,
}: ProfileContentProps) {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  // 훅(Hook): React의 특별한 함수로, 컴포넌트 내부에서만 사용 가능합니다.
  // useRouter는 Next.js에서 제공하는 훅으로, 클라이언트 컴포넌트에서만 사용 가능합니다.
  const router = useRouter();
  const [is_logout_modal_open, set_is_logout_modal_open] = useState(false);

  // 로그아웃 버튼 클릭 시: 실제 로그아웃은 아직 하지 않고, 모달만 열어줍니다.
  const handle_logout_click = () => {
    set_is_logout_modal_open(true);
  };

  // 로그아웃 모달 확인 버튼 클릭 시: 실제 로그아웃을 실행하고, 로그인 페이지로 이동합니다.
  const handle_logout_confirm = () => {
    if (onLogout) {
      onLogout();
    }

    if (editPath.startsWith("/partner")) {
      router.push("/partner/login");
    } else {
      router.push("/user/login");
    }
  };

  return (
    <>
      {/* ========================================
          프로필 섹션
          ======================================== */}
      {/* 
        JSX 주석은 중괄호와 슬래시로 시작하고 끝납니다.
        className: CSS 모듈의 클래스를 적용합니다.
        profileStyles는 CSS 모듈 파일에서 import한 객체입니다.
      */}
      <div className={profileStyles.profile_section}>
        <div className={profileStyles.profile_info}>
          {/* 프로필 이미지 영역 - 기본 프로필 이미지 사용 */}
          <div className={profileStyles.profile_image}>
            <img
              src={profileImage || "/images/mypage/profile.svg"}
              alt={profileImage ? "프로필 이미지" : "기본 프로필 이미지"}
              className={profileStyles.profile_image_icon}
            />
          </div>

          {/* 프로필 상세 정보 */}
          <div className={profileStyles.profile_details}>
            {/* 사용자 역할 표시 */}
            <div className={profileStyles.profile_role}>{role}</div>

            {/* 닉네임 컨테이너 */}
            <div className={profileStyles.profile_nickname_container}>
              <div className={profileStyles.profile_nickname}>{nickname}</div>
            </div>
          </div>
        </div>

        {/* 회원 유형 토글 버튼 */}
        {showMemberTypeToggle && onMemberTypeChange && (
          <div className={profileStyles.toggle_wrapper}>
            <MemberTypeToggle
              activeType={activeMemberType}
              onToggle={onMemberTypeChange}
            />
          </div>
        )}
      </div>

      {/* ========================================
          내 정보 수정 메뉴
          ======================================== */}
      <div className={profileStyles.menu_list}>
        {/* 
          button 요소: 클릭 가능한 버튼
          onClick: 버튼 클릭 시 실행할 함수
          화살표 함수: () => {} 형식으로 간단한 함수를 정의합니다.
          router.push(): Next.js에서 페이지 이동을 위한 메서드입니다.
        */}
        <button
          className={profileStyles.menu_item}
          onClick={() => router.push(editPath)}
        >
          <img
            src="/images/mypage/menu_icon/correction_icon.svg"
            alt="내 정보 수정 아이콘"
            className={profileStyles.menu_icon}
          />
          <div className={profileStyles.menu_text}>내 정보 수정</div>
        </button>

        {/* 
          조건부 렌더링: 파트너일 때만 비밀번호 변경 버튼 표시
          editPath가 "/partner"로 시작하면 파트너 사용자로 판단합니다.
          startsWith(): 문자열이 특정 문자열로 시작하는지 확인하는 메서드입니다.
        */}
        {editPath.startsWith("/partner") && (
          <button
            className={profileStyles.menu_item}
            onClick={() => router.push("/partner/reset-password")}
          >
            <img
              src="/images/mypage/menu_icon/password_icon.svg"
              alt="비밀번호 변경 아이콘"
              className={profileStyles.menu_icon}
            />
            <div className={profileStyles.menu_text}>비밀번호 변경</div>
          </button>
        )}
      </div>

      {/* ========================================
          공통 메뉴 리스트
          ======================================== */}
      <div className={profileStyles.menu_list}>
        {/* 이용 가이드 버튼 */}
        {/* 
          window.open(): 새 창에서 URL을 엽니다.
          "_blank": 새 탭에서 열기
        */}
        <button
          className={profileStyles.menu_item}
          onClick={() => window.open("https://markx.dev/guide_book", "_blank")}
        >
          <img
            src="/images/mypage/menu_icon/guide_icon.svg"
            alt="이용 가이드 아이콘"
            className={profileStyles.menu_icon}
          />
          <div className={profileStyles.menu_text}>이용 가이드</div>
        </button>

        {/* 공지사항 버튼 */}
        {/* 
          조건부 경로: 파트너일 때는 /partner/notice, 유저일 때는 /user/notice로 이동
          editPath가 "/partner"로 시작하면 파트너 사용자로 판단합니다.
          삼항 연산자: 조건 ? 참일때값 : 거짓일때값
        */}
        <button
          className={profileStyles.menu_item}
          onClick={() =>
            router.push(
              editPath.startsWith("/partner")
                ? "/partner/notice"
                : "/user/notice"
            )
          }
        >
          <img
            src="/images/mypage/menu_icon/announcement_icon.svg"
            alt="공지사항 아이콘"
            className={profileStyles.menu_icon}
          />
          <div className={profileStyles.menu_text}>공지사항</div>
        </button>

        {/* 자주 묻는 질문 버튼 */}
        {/* 
          조건부 경로: 파트너일 때는 /partner/faq, 유저일 때는 /user/faq로 이동
          editPath가 "/partner"로 시작하면 파트너 사용자로 판단합니다.
          삼항 연산자: 조건 ? 참일때값 : 거짓일때값
        */}
        <button
          className={profileStyles.menu_item}
          onClick={() =>
            router.push(
              editPath.startsWith("/partner") ? "/partner/faq" : "/user/faq"
            )
          }
        >
          <img
            src="/images/mypage/menu_icon/faq_icon.svg"
            alt="자주 묻는 질문 아이콘"
            className={profileStyles.menu_icon}
          />
          <div className={profileStyles.menu_text}>자주 묻는 질문</div>
        </button>

        {/* 카카오톡 상담 버튼 */}
        <button
          className={profileStyles.menu_item}
          onClick={() =>
            window.open("https://pf.kakao.com/_xjxdxoxG/chat", "_blank")
          }
        >
          <img
            src="/images/mypage/menu_icon/kakao_icon.svg"
            alt="카카오톡 상담 아이콘"
            className={profileStyles.menu_icon}
          />
          <div className={profileStyles.menu_text}>카카오톡 상담</div>
        </button>
      </div>

      {/* ========================================
          로그아웃 버튼
          ======================================== */}
      {/* 
        조건부 렌더링: onLogout이 있을 때만 로그아웃 버튼을 표시합니다.
        && 연산자: 왼쪽이 true일 때만 오른쪽을 렌더링합니다.
        onLogout?: 선택적 속성으로, 없어도 컴포넌트가 정상 작동합니다.
      */}
      {onLogout && (
        <div className={profileStyles.menu_list}>
          {/* 모바일 전용: 리뷰어로 변경 버튼 (파트너일 때만) */}
          {editPath.startsWith("/partner") && (
            <button
              className={`${profileStyles.menu_item} ${profileStyles.menu_item_mobile_only}`}
              onClick={() => router.push("/user/mypage/profile")}
            >
              <img
                src="/images/mypage/menu_icon/logout_icon.svg"
                alt="리뷰어로 변경 아이콘"
                className={profileStyles.menu_icon}
              />
              <div className={profileStyles.menu_text}>리뷰어로 변경</div>
            </button>
          )}
          
          <button
            className={profileStyles.menu_item}
            onClick={handle_logout_click}
          >
            <img
              src="/images/mypage/menu_icon/logout_icon.svg"
              alt="로그아웃 아이콘"
              className={profileStyles.menu_icon}
            />
            <div className={profileStyles.menu_text}>로그아웃</div>
          </button>
        </div>
      )}

      <BaseModal
        is_open={is_logout_modal_open}
        on_close={() => set_is_logout_modal_open(false)}
        message="로그아웃되었습니다"
        on_confirm={handle_logout_confirm}
        buttons={["확인"]}
      />
    </>
  );
}
