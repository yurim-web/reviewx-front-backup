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
 *
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../../../../styles/user/campaign_management/modals/content_verification.module.css";
import type { CampaignType } from "@/types/domain/user";
import Toast from "@/components/common/toast/Toast";

// 실제 캠페인 데이터 import
import { deliveryCampaigns } from "@/data/campaign/delivery/deliveryCampaigns";
import { visitCampaigns } from "@/data/campaign/visit/visitCampaigns";
import { reviewCampaigns } from "@/data/campaign/review/reviewCampaigns";
import { reporterCampaigns } from "@/data/campaign/reporter/reporterCampaigns";
import { missionCampaigns } from "@/data/campaign/mission/missionCampaigns";

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
  /** 캠페인 ID (실제 캠페인 데이터에서 requirements를 가져오기 위해 필요) */
  campaignId?: string;
  /** 캠페인 타입 (실제 캠페인 데이터에서 requirements를 가져오기 위해 필요) */
  campaignType?: CampaignType;
  /** 미션 항목 목록 (기본값: 일반적인 미션 항목들, campaignId와 campaignType이 제공되면 무시됨) */
  missionItems?: MissionItem[];
  /** 제출 버튼을 눌렀을 때 실행될 콜백 함수 (모든 기준이 충족되었을 때만 호출됨) */
  onConfirm?: () => void;
}

/**
 * requirements 코드를 한국어 텍스트로 변환하는 함수
 *
 * 설명:
 * - 캠페인 데이터의 requirements 배열에 있는 코드를 읽기 쉬운 한국어로 변환합니다.
 * - 예: "text_800" → "800자 이상"
 * - 예: "photo_8" → "8장 이상"
 * - 예: "video_1_60" → "1개 이상, 60초 이상"
 * - 예: "product_link" → "본문 내 링크 첨부"
 * - 예: "keyword" → "본문 내 키워드/태그 첨부"
 *
 * @param requirement - requirements 코드 (예: "text_800", "photo_8", "video_1_60", "product_link", "keyword")
 * @returns 한국어로 변환된 미션 항목 텍스트
 */
const parseRequirement = (requirement: string): string => {
  // 텍스트 요구사항: "text_800" → "800자 이상"
  if (requirement.startsWith("text_")) {
    const charCount = requirement.replace("text_", "");
    return `${charCount}자 이상`;
  }

  // 사진 요구사항: "photo_8" → "사진 8장 이상"
  if (requirement.startsWith("photo_")) {
    const photoCount = requirement.replace("photo_", "");
    return `사진 ${photoCount}장 이상`;
  }

  // 동영상 요구사항: "video_1_60" → "동영상 1개 이상, 60초 이상"
  // 또는 "video_120" → "동영상 1개 이상, 120초 이상" (개수는 기본값 1개)
  // 또는 "video_report" → "동영상 필수"
  if (requirement.startsWith("video_")) {
    if (requirement === "video_report") {
      return "동영상 필수";
    }
    const parts = requirement.replace("video_", "").split("_");
    if (parts.length === 2) {
      // "video_1_60" 형식: 개수와 초가 모두 명시됨
      const [count, seconds] = parts;
      return `동영상 ${count}개 이상, ${seconds}초 이상`;
    } else if (parts.length === 1) {
      // "video_120" 형식: 초만 명시됨, 개수는 기본값 1개
      const seconds = parts[0];
      return `동영상 1개 이상, ${seconds}초 이상`;
    }
    // "video_visit" 같은 경우
    return "동영상 필수";
  }

  // 제품 링크 요구사항: "product_link" → "본문 내 링크 첨부"
  if (requirement === "product_link") {
    return "본문 내 링크 첨부";
  }

  // 키워드 요구사항: "keyword" → "본문 내 키워드/태그 첨부"
  if (requirement === "keyword") {
    return "본문 내 키워드/태그 첨부";
  }

  // 알 수 없는 요구사항은 그대로 반환
  return requirement;
};

/**
 * 실제 캠페인 데이터에서 requirements를 가져와서 MissionItem[]로 변환하는 함수
 *
 * 설명:
 * - campaignId와 campaignType을 사용하여 실제 캠페인 데이터를 찾습니다.
 * - 해당 캠페인의 requirements 배열을 가져와서 MissionItem[] 형식으로 변환합니다.
 * - isCompleted는 현재 임시로 false로 설정 (나중에 실제 콘텐츠 데이터에서 확인)
 *
 * @param campaignId - 캠페인 ID (예: "delivery_1", "visit_2")
 * @param campaignType - 캠페인 타입 (예: "배송형", "방문형")
 * @returns MissionItem[] 형식의 미션 항목 목록
 */
const getMissionItemsFromCampaign = (
  campaignId: string,
  campaignType: CampaignType
): MissionItem[] => {
  // 모든 캠페인 데이터를 하나의 배열로 합치기
  const allCampaigns = [
    ...deliveryCampaigns,
    ...visitCampaigns,
    ...reviewCampaigns,
    ...reporterCampaigns,
    ...missionCampaigns,
  ];

  // 캠페인 ID로 실제 캠페인 데이터 찾기
  const actualCampaign = allCampaigns.find((c) => c.id === campaignId);

  if (!actualCampaign || !actualCampaign.requirements) {
    // 캠페인을 찾을 수 없거나 requirements가 없으면 빈 배열 반환
    return [];
  }

  // requirements를 MissionItem[]로 변환
  // ⚠️ 임시: 개발 중이므로 모든 항목을 충족 상태로 설정 (나중에 실제 콘텐츠 데이터로 교체 예정)
  return actualCampaign.requirements.map((requirement, index) => ({
    id: `${index + 1}`,
    text: parseRequirement(requirement),
    isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 충족 여부 확인
  }));
};

export default function ContentVerificationModal({
  isOpen,
  onClose,
  campaignTitle,
  campaignId,
  campaignType,
  missionItems,
  onConfirm,
}: ContentVerificationModalProps) {
  // 미션 항목 목록 상태
  const [items, setItems] = useState<MissionItem[]>([]);
  // 토스트 메시지 표시 여부 상태
  const [showToast, setShowToast] = useState(false);

  /**
   * 미션 항목 목록 초기화
   *
   * 설명:
   * - campaignId와 campaignType이 제공되면 실제 캠페인 데이터에서 requirements를 가져옵니다.
   * - missionItems가 제공되면 그것을 사용합니다.
   * - 둘 다 없으면 기본값을 사용합니다.
   */
  useEffect(() => {
    if (campaignId && campaignType) {
      // 실제 캠페인 데이터에서 requirements를 가져와서 변환
      const missionItemsFromCampaign = getMissionItemsFromCampaign(
        campaignId,
        campaignType
      );
      setItems(missionItemsFromCampaign);
    } else if (missionItems) {
      // missionItems prop이 제공되면 사용
      setItems(missionItems);
    } else {
      // 기본값 사용
      // ⚠️ 임시: 개발 중이므로 모든 항목을 충족 상태로 설정 (나중에 실제 콘텐츠 데이터로 교체 예정)
      setItems([
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
          isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 가져오기
        },
        {
          id: "4",
          text: "본문 내 링크 첨부",
          isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 가져오기
        },
        {
          id: "5",
          text: "본문 내 키워드/태그 첨부",
          isCompleted: true, // TODO: 실제 콘텐츠 데이터에서 가져오기
        },
      ]);
    }
  }, [campaignId, campaignType, missionItems]);

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
   * - 제출 시 Toast 메시지를 표시하고, onConfirm 콜백이 있으면 실행합니다.
   * - Toast는 2초 후 자동으로 사라집니다.
   */
  const handleSubmit = () => {
    if (allCompleted) {
      console.log("콘텐츠 확인 제출");

      // Toast 메시지 표시
      setShowToast(true);

      // onConfirm 콜백이 있으면 실행 (실제 등록/수정 처리)
      if (onConfirm) {
        onConfirm();
      } else {
        // 기본 동작: 콘텐츠 확인 완료 처리
        // TODO: 실제 API 호출로 콘텐츠 확인 제출
      }

      // 모달 닫기 (Toast는 자동으로 사라짐)
      onClose();
    }
  };

  return (
    <>
      {/* Toast 메시지 컴포넌트 */}
      <Toast
        message="등록되었습니다."
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        duration={2000}
      />

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
              기본 미션 기준을 충족하지 못했습니다. 기준을 달성하신 후 다시
              신청해 주세요.
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
    </>
  );
}
