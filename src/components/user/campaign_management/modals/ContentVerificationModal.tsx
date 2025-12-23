/* ========================================
   ✅ 콘텐츠 확인 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 콘텐츠 확인 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 등록한 콘텐츠가 기본 미션 기준을 충족하는지 확인할 수 있는 모달입니다.
 *
 * 사용 위치:
 * - 완료 탭 > 모든 캠페인 타입
 *   - "콘텐츠 확인하기" 버튼 클릭 시
 *   - CompletedTabCard 컴포넌트에서 사용
 *
 * 모달 구성:
 * 1. 모달 제목: "콘텐츠 확인"
 * 2. 서브타이틀: "기본 미션"
 * 3. 미션 항목 목록:
 *    - 각 항목은 박스 형태로 표시
 *    - 충족: 초록색 테두리
 *    - 미충족: 빨간색 테두리
 * 4. 안내 메시지 (미충족 항목이 있을 때만 표시):
 *    - "기본 미션 기준을 충족하지 못했습니다. 기준을 달성하신 후 다시 신청해 주세요."
 * 5. 제출 버튼:
 *    - 모든 기준 충족 시: 활성화
 *    - 미충족 항목이 있을 시: 비활성화
 *
 * 경우의 수:
 * 1. 모든 기준 충족: 모든 항목 초록색, 메시지 없음, 제출 버튼 활성화
 * 2. 일부만 충족: 일부 초록색/일부 빨간색, 메시지 표시, 제출 버튼 비활성화
 * 3. 아예 다 충족하지 못함: 모든 항목 빨간색, 메시지 표시, 제출 버튼 비활성화
 *
 * 학습 포인트:
 * - 조건부 렌더링: 미션 항목의 충족 여부에 따라 다른 스타일 적용
 * - 배열 메서드: some(), every() 등을 사용하여 조건 확인
 * - 상태 관리: 미션 항목의 충족 여부를 배열로 관리
 */

"use client";

import Image from "next/image";
import styles from "../../../../styles/user/campaign_management/modals/content_verification.module.css";

/**
 * 미션 항목 인터페이스
 *
 * 설명:
 * - 각 미션 항목의 정보를 담는 타입입니다.
 * - id: 고유 식별자
 * - text: 미션 항목 텍스트
 * - isCompleted: 충족 여부 (true: 충족, false: 미충족)
 */
interface MissionItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface ContentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  /** 미션 항목 목록 (기본값: 일반적인 미션 항목들) */
  missionItems?: MissionItem[];
}

export default function ContentVerificationModal({
  isOpen,
  onClose,
  campaignTitle,
  missionItems,
}: ContentVerificationModalProps) {
  // 기본 미션 항목 목록 (missionItems가 제공되지 않을 때 사용)
  const defaultMissionItems: MissionItem[] = [
    {
      id: "1",
      text: "글자 수 1,500자 이상",
      isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 가져오기
    },
    {
      id: "2",
      text: "사진 10장 이상",
      isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 가져오기
    },
    {
      id: "3",
      text: "동영상 1개 이상, 120초 이상",
      isCompleted: false, // TODO: 실제 콘텐츠 데이터에서 가져오기
    },
    {
      id: "4",
      text: "본문 내 링크 첨부",
      isCompleted: false, // TODO: 실제 콘텐츠 데이터에서 가져오기
    },
    {
      id: "5",
      text: "본문 내 키워드/태그 첨부",
      isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 가져오기
    },
  ];

  // 미션 항목 목록 (prop이 제공되면 사용, 없으면 기본값 사용)
  const items = missionItems || defaultMissionItems;

  // 모든 미션 항목이 충족되었는지 확인
  const allCompleted = items.every((item) => item.isCompleted);

  // 미충족 항목이 있는지 확인
  const hasIncompleteItems = items.some((item) => !item.isCompleted);

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  /**
   * 오버레이 클릭 핸들러
   *
   * 설명:
   * - 모달 배경(오버레이)을 클릭하면 모달을 닫습니다.
   * - e.target === e.currentTarget: 클릭한 요소가 오버레이 자체일 때만 닫기
   *   (모달 내부를 클릭했을 때는 닫히지 않음)
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 제출 버튼 클릭 핸들러
   *
   * 설명:
   * - 모든 미션 항목이 충족되었을 때만 제출이 가능합니다.
   * - 제출 시 콘텐츠 확인 완료 처리를 합니다.
   */
  const handleSubmit = () => {
    if (allCompleted) {
      console.log("콘텐츠 확인 제출");
      // TODO: 실제 API 호출로 콘텐츠 확인 제출
      onClose();
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>콘텐츠 확인</h2>

        {/* 닫기 버튼 */}
        <button className={styles.close_button} onClick={onClose}>
          <Image
            src="/images/filter/x_icon.svg"
            alt="닫기"
            width={20}
            height={20}
          />
        </button>

        {/* 미션 항목 목록 */}
        <div className={styles.mission_list}>
          {/* 서브타이틀: "기본 미션" */}
          <p className={styles.subtitle}>기본 미션</p>

          {items.map((item) => (
            <div
              key={item.id}
              className={`${styles.mission_item} ${
                item.isCompleted ? styles.completed : styles.incomplete
              }`}
            >
              <span className={styles.mission_text}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* 안내 메시지 */}
        {allCompleted ? (
          <p className={styles.warning_message}>
            기본 미션 기준을 충족하셨습니다.
          </p>
        ) : (
          <p className={styles.warning_message}>
            기본 미션 기준을 충족하지 못했습니다. 기준을 달성하신 후 다시 신청해
            주세요.
          </p>
        )}

        {/* 제출 버튼 */}
        <button
          className={`${styles.submit_button} ${
            allCompleted ? styles.active : styles.disabled
          }`}
          onClick={handleSubmit}
          disabled={!allCompleted}
        >
          제출
        </button>
      </div>
    </div>
  );
}
