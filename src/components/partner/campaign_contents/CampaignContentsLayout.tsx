/* ========================================
   🎨 캠페인 콘텐츠 내역 페이지 공통 레이아웃 컴포넌트
   ======================================== */

/**
 * 캠페인 콘텐츠 내역 페이지의 공통 UI 레이아웃 컴포넌트
 *
 * 📌 컴포넌트 재사용성:
 * - 여러 페이지에서 동일한 UI 구조를 사용할 때 중복을 제거합니다
 * - 레이아웃 변경 시 한 곳만 수정하면 모든 페이지에 반영됩니다
 *
 * 주요 기능:
 * - 캠페인 정보 박스 표시
 * - 다운로드 버튼 및 정렬 컨트롤
 * - 일괄 기한 연장 버튼
 * - 탭 네비게이션 (대기/확인/완료)
 * - 콘텐츠 카드 그리드
 *
 * 📌 Props 패턴:
 * - 컴포넌트에 데이터와 함수를 props로 전달하여 재사용성을 높입니다
 * - renderCard 함수를 props로 받아 각 캠페인 유형별로 다른 카드를 렌더링합니다
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageHeader from "@/components/partner/campaign_application/PageHeader";
import Campaignbanner from "@/components/partner/campaign_application/CampaignInfoBox";
import ExcelDownloadBtn from "@/components/partner/campaign_application/ExcelDownloadBtn";
import SortFilterControl from "@/components/partner/campaign_application/SortFilterControl";
import BaseModal from "@/components/common/modal/BaseModal";
import { getCampaignDetailPath } from "@/utils/helpers/url";
import { getCampaignById } from "@/data/partner/sharedCampaigns";
import appStyles from "@/styles/partner/campaign_application/campaign_application.module.css";
import type { ContentByTab } from "@/data/partner/sharedCampaigns";
import type {
  TabKey,
  SortOption,
} from "@/hooks/partner/campaign_contents/useCampaignContents";

/**
 * 카드 렌더링 함수 타입 정의
 *
 * 📌 함수 타입:
 * - (item: ContentItem, index: number) => React.ReactNode
 * - 콘텐츠 아이템과 인덱스를 받아서 React 컴포넌트를 반환하는 함수
 */
type CardRenderer = (
  item:
    | ContentByTab["waiting"][number]
    | ContentByTab["reviewing"][number]
    | ContentByTab["completed"][number],
  index: number
) => React.ReactNode;

/**
 * CampaignContentsLayout 컴포넌트의 Props 타입 정의
 *
 * 📌 TypeScript 인터페이스:
 * - 컴포넌트가 받을 props의 타입을 명시적으로 정의합니다
 * - 타입 안정성을 확보하고 IDE 자동완성을 지원합니다
 */
interface CampaignContentsLayoutProps {
  // 캠페인 정보
  campaignInfo:
    | NonNullable<
        ReturnType<
          typeof import("@/data/partner/sharedCampaigns").getCampaignById
        >
      >["campaignInfo"]
    | undefined;

  // 탭 관련
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  waitingCount: number;
  reviewCount: number;
  completedCount: number;

  // 정렬 관련
  sortOrder: SortOption;
  setSortOrder: (order: SortOption) => void;
  sortOptions: Array<{ value: SortOption; label: string }>;

  // 콘텐츠 데이터
  contents: ContentByTab;

  // 카드 렌더링 함수
  renderCard: CardRenderer;

  // 추가 기능 (선택적)
  onBatchExtension?: () => void;
}

/**
 * 캠페인 콘텐츠 내역 페이지 공통 레이아웃 컴포넌트
 *
 * @param props - CampaignContentsLayoutProps 타입의 props
 * @returns JSX 요소
 *
 * 📌 사용 예시:
 * ```tsx
 * <CampaignContentsLayout
 *   campaignInfo={campaignInfo}
 *   activeTab={activeTab}
 *   contents={contents}
 *   renderCard={renderCardComponent}
 *   // ... 기타 props
 * />
 * ```
 */
export default function CampaignContentsLayout({
  campaignInfo,
  activeTab,
  setActiveTab,
  waitingCount,
  reviewCount,
  completedCount,
  sortOrder,
  setSortOrder,
  sortOptions,
  contents,
  renderCard,
  onBatchExtension,
}: CampaignContentsLayoutProps) {
  /**
   * useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
   * - router.push(): 프로그래밍 방식으로 페이지를 이동시킵니다
   */
  const router = useRouter();

  // 📌 모달 상태 관리:
  // - 파일 생성 오류 시 표시할 모달의 열림/닫힘 상태를 관리합니다
  // - useState 훅을 사용하여 컴포넌트 내부 상태를 관리합니다
  const [is_download_error_modal_open, setIs_download_error_modal_open] =
    useState(false);

  // 📌 일괄 기한 연장 상태 관리:
  // - 일괄 기한 연장 확인/완료/제한 모달의 열림/닫힘 상태와 연장 횟수를 관리합니다
  // - registrationPeriod는 UI 상에서만 일시적으로 +3일, +6일로 늘려서 보여줍니다
  const [is_batch_extension_modal_open, setIs_batch_extension_modal_open] =
    useState(false);
  const [
    is_batch_extension_complete_modal_open,
    setIs_batch_extension_complete_modal_open,
  ] = useState(false);
  const [
    is_batch_extension_limit_modal_open,
    setIs_batch_extension_limit_modal_open,
  ] = useState(false);
  const [batch_extension_count, setBatch_extension_count] = useState(0);

  // 📌 UI용 등록 기간 상태:
  // - 실제 데이터는 변경하지 않고, 화면에 보여줄 등록 기간만 +3일 단위로 늘립니다
  const [extendedRegistrationPeriod, setExtendedRegistrationPeriod] = useState<
    string | undefined
  >(campaignInfo?.registrationPeriod);

  // 등록 기간 문자열의 종료일을 기준으로 N일 연장하는 헬퍼
  const extendRegistrationPeriodByDays = (
    period: string | undefined,
    days: number
  ): string | undefined => {
    if (!period) return period;
    const parts = period.split("~");
    if (parts.length !== 2) return period;

    const startStr = parts[0].trim();
    const endStr = parts[1].trim();
    const endDate = new Date(endStr);
    if (Number.isNaN(endDate.getTime())) return period;

    endDate.setDate(endDate.getDate() + days);
    const yyyy = endDate.getFullYear();
    const mm = String(endDate.getMonth() + 1).padStart(2, "0");
    const dd = String(endDate.getDate()).padStart(2, "0");
    const newEnd = `${yyyy}-${mm}-${dd}`;

    return `${startStr} ~ ${newEnd}`;
  };

  // 현재 탭에 따라 표시할 콘텐츠 목록 결정
  // 📌 조건부 데이터 선택:
  // - activeTab에 따라 다른 배열을 반환합니다
  // - 삼항 연산자를 중첩하여 사용
  const currentContents =
    activeTab === "대기"
      ? contents.waiting || []
      : activeTab === "확인"
      ? contents.reviewing || []
      : contents.completed || [];

  // 📌 캠페인 마감 여부 확인:
  // - 캠페인이 마감되었을 때만 결과보고서 다운로드 버튼을 표시합니다
  // - status가 "마감"이거나 statusText에 "마감"이 포함되어 있을 때 마감된 것으로 간주합니다
  // - 등록 기간이 종료되었는지도 확인합니다 (등록 기간 종료일이 오늘보다 이전이면 마감)
  // - 결과보고서는 캠페인 마감 후에만 다운로드 가능합니다 (마감 전까지는 생성되지 않음)
  const checkRegistrationPeriodEnded = (
    registrationPeriod?: string
  ): boolean => {
    if (!registrationPeriod) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const period = registrationPeriod.split(" ~ ");
    if (period.length === 2) {
      const endDate = new Date(period[1].trim());
      endDate.setHours(0, 0, 0, 0);
      return today > endDate;
    }
    return false;
  };

  const effectiveRegistrationPeriod =
    extendedRegistrationPeriod ?? campaignInfo?.registrationPeriod;

  const is_campaign_closed =
    campaignInfo?.status === "마감" ||
    campaignInfo?.statusText?.includes("마감") === true ||
    checkRegistrationPeriodEnded(effectiveRegistrationPeriod);

  // 캠페인 상세 페이지 경로 생성
  // 📌 getCampaignDetailPath: 캠페인 타입과 ID를 사용하여 상세 페이지 경로를 생성합니다
  const campaignDetailPath = campaignInfo
    ? getCampaignDetailPath(campaignInfo.campaignType, campaignInfo.id)
    : "";

  // 실제 신청자 수 계산
  // 📌 useState + useEffect: Hydration 오류 방지를 위해 클라이언트에서만 계산합니다
  // - 초기값은 campaignInfo.recruitedCount를 사용하여 서버와 클라이언트가 동일한 값으로 시작합니다
  // - useEffect에서 클라이언트에서만 실제 신청자 수를 계산하여 업데이트합니다
  const [applicantsCount, setApplicantsCount] = useState<number | undefined>(
    campaignInfo?.recruitedCount
  );

  useEffect(() => {
    if (!campaignInfo?.id) {
      setApplicantsCount(undefined);
      return;
    }
    const fullCampaignData = getCampaignById(campaignInfo.id);
    if (fullCampaignData && "applicantData" in fullCampaignData) {
      const count = fullCampaignData.applicantData?.applicants?.length ?? 0;
      setApplicantsCount(count);
    } else {
      setApplicantsCount(campaignInfo?.recruitedCount);
    }
  }, [campaignInfo?.id, campaignInfo?.recruitedCount]);

  return (
    <>
      {/* 페이지 제목 - 공용 컴포넌트 */}
      {/* 📌 컴포넌트 재사용:
          - PageHeader 컴포넌트를 사용하여 일관된 페이지 제목 스타일을 유지합니다
          - right prop으로 "캠페인 보기" 버튼을 전달합니다
      */}
      <PageHeader
        title="캠페인 콘텐츠 내역"
        right={
          campaignInfo ? (
            <button
              className={appStyles.view_campaign_button}
              onClick={() => {
                router.push(campaignDetailPath);
              }}
              aria-label="캠페인 보기"
            >
              <span>캠페인 보기</span>
              <span className={appStyles.view_campaign_button_icon}>
                <Image
                  src="/images/icons/chevron_right.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
            </button>
          ) : null
        }
      />

      {/* 메인 콘텐츠 */}
      {/* 📌 시맨틱 HTML:
          - section: 관련된 콘텐츠를 그룹화하는 HTML5 시맨틱 태그
          - article: 독립적인 콘텐츠를 나타내는 HTML5 시맨틱 태그
      */}
      <section className={appStyles.campaign_application_section}>
        {/* 캠페인 정보 박스 */}
        {/* 📌 조건부 렌더링:
            - campaignInfo가 있을 때만 Campaignbanner를 렌더링합니다
            - && 연산자를 사용한 단축 평가 패턴
        */}
        {campaignInfo ? (
          <Campaignbanner
            campaignInfo={{
              ...campaignInfo,
              registrationPeriod:
                effectiveRegistrationPeriod ?? campaignInfo.registrationPeriod,
            }}
            reviewingCount={reviewCount}
            completedCount={completedCount}
            applicantsCount={applicantsCount}
          />
        ) : null}

        {/* 다운로드 및 정렬 섹션 */}
        <article className={appStyles.download_section}>
          {/* 선정자 목록 다운로드 버튼 */}
          {/* 📌 ExcelDownloadBtn 컴포넌트:
              - 선정자 목록 다운로드 버튼만 표시
              - 완료된 콘텐츠가 없으면 모달 표시 (ExcelDownloadBtn 내부에서 처리)
              - 완료된 콘텐츠가 있으면 다운로드 시도, 파일 생성 오류 시 모달 표시
          */}
          <ExcelDownloadBtn
            onDownloadApplicants={() => {}}
            onDownloadSelected={() => {
              // 📌 선정자 목록 다운로드 핸들러:
              // - 데이터가 있을 때 다운로드 시도
              // - 파일 생성 오류 시 모달 표시
              if (completedCount > 0) {
                try {
                  // TODO: 실제 다운로드 API 호출 구현
                  // 현재는 개발 중이므로 파일 생성 오류 시뮬레이션
                  throw new Error("파일 생성 실패");
                } catch (error) {
                  // 파일 생성 오류 시 모달 표시ㄷㄷ
                  setIs_download_error_modal_open(true);
                }
              }
            }}
            onDownloadReport={
              // 📌 결과보고서 다운로드 핸들러:
              // - 캠페인이 마감되었을 때만 버튼이 표시됩니다
              // - 결과보고서는 캠페인 마감 후에만 다운로드 가능합니다
              is_campaign_closed
                ? () => {
                    try {
                      // TODO: 실제 결과보고서 다운로드 API 호출 구현
                      // 현재는 개발 중이므로 파일 생성 오류 시뮬레이션
                      throw new Error("파일 생성 실패");
                    } catch (error) {
                      // 파일 생성 오류 시 모달 표시
                      setIs_download_error_modal_open(true);
                    }
                  }
                : undefined
            }
            hasSelected={completedCount > 0}
            hasReport={is_campaign_closed}
            showApplicantsButton={false}
          />
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* 일괄 기한 연장 버튼 */}
            {/* 📌 조건부 렌더링:
                - onBatchExtension prop이 제공된 경우에만 버튼을 표시합니다
            */}
            {onBatchExtension && (
              <button
                className={appStyles.batch_extension_button}
                onClick={() => {
                  // 연장 요청 2회 초과 시에는 제한 모달만 표시
                  if (batch_extension_count >= 2) {
                    setIs_batch_extension_limit_modal_open(true);
                    return;
                  }
                  setIs_batch_extension_modal_open(true);
                }}
              >
                <Image
                  src="/images/management_page/clock_icon.svg"
                  alt="시계 아이콘"
                  width={16}
                  height={16}
                />
                <span>일괄 기한 연장</span>
              </button>
            )}

            {/* 정렬 트리거 + 모달 통합 */}
            {/* 📌 제어 컴포넌트 패턴:
                - value와 onChange를 모두 props로 받아서 부모 컴포넌트가 상태를 제어합니다
                - 이렇게 하면 상태 관리가 부모 컴포넌트에 집중되어 예측 가능한 동작을 보장합니다
            */}
            <SortFilterControl
              options={sortOptions}
              value={sortOrder}
              onChange={(opt) => setSortOrder(opt.value as SortOption)}
              defaultSort="latest"
            />
          </div>
        </article>

        {/* 콘텐츠 내역 탭 네비게이션 - 대기/확인/완료 표시 */}
        {/* 📌 동적 클래스명:
            - 템플릿 리터럴과 삼항 연산자를 사용하여 조건부로 클래스를 적용합니다
            - activeTab === "대기"일 때 styles.active 클래스가 추가됩니다
        */}
        <article className={appStyles.tab_navigation}>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "대기" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("대기")}
          >
            대기 <span className={appStyles.tab_count}>{waitingCount}</span>
          </button>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "확인" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("확인")}
          >
            확인 <span className={appStyles.tab_count}>{reviewCount}</span>
          </button>
          <button
            className={`${appStyles.tab_button} ${
              activeTab === "완료" ? appStyles.active : ""
            }`}
            onClick={() => setActiveTab("완료")}
          >
            완료 <span className={appStyles.tab_count}>{completedCount}</span>
          </button>
        </article>

        {/* 콘텐츠 카드 그리드 */}
        {/* 📌 조건부 렌더링과 리스트 렌더링:
            - currentContents.length === 0이면 빈 그리드 표시
            - 그렇지 않으면 map()을 사용하여 각 콘텐츠에 대해 카드를 렌더링
        */}
        <article className={appStyles.applicants_grid}>
          {currentContents.map((item, index) => {
            // 동적 카드 컴포넌트 렌더링
            // 📌 key prop:
            // - React에서 리스트를 렌더링할 때 각 요소에 고유한 key를 제공해야 합니다
            // - item.id와 index를 조합하여 고유한 키를 생성합니다 (중복 방지)
            // - renderCard 함수를 호출하여 각 캠페인 유형에 맞는 카드를 렌더링합니다
            return (
              <React.Fragment key={`${item.id}-${index}`}>
                {renderCard(item, index)}
              </React.Fragment>
            );
          })}
        </article>
      </section>

      {/* 파일 생성 오류 모달 */}
      {/* 📌 조건부 렌더링:
          - BaseModal 컴포넌트는 is_open prop이 true일 때만 렌더링됩니다
          - 모달이 닫혀있으면 (is_download_error_modal_open === false) null을 반환하여 아무것도 렌더링하지 않습니다
      */}
      <BaseModal
        is_open={is_download_error_modal_open}
        on_close={() => setIs_download_error_modal_open(false)}
        message="다운로드에 실패하였습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 일괄 기한 연장 확인 모달 */}
      {/* 📌 일괄 기한 연장 확인 모달 */}
      <BaseModal
        is_open={is_batch_extension_modal_open}
        on_close={() => setIs_batch_extension_modal_open(false)}
        message={
          batch_extension_count === 0
            ? '캠페인의 콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : '이미 연장한 내역이 있습니다.<br><span style="color: #FF2626;">3일 더 연장</span>하시겠습니까?'
        }
        buttons={["취소", "연장"]}
        button_variant="red"
        on_confirm={() => {
          // 📌 연장 확인 핸들러:
          // - 사용자가 "연장" 버튼을 클릭했을 때 실행됩니다
          // - 등록 기간의 종료일을 기준으로 3일 연장하여 UI에 반영합니다
          // - 연장 요청은 최대 2회까지만 허용됩니다
          if (batch_extension_count >= 2) {
            setIs_batch_extension_modal_open(false);
            setIs_batch_extension_limit_modal_open(true);
            return;
          }

          const basePeriod =
            extendedRegistrationPeriod ?? campaignInfo?.registrationPeriod;
          const updated = extendRegistrationPeriodByDays(basePeriod, 3);
          if (updated) {
            setExtendedRegistrationPeriod(updated);
          }

          setBatch_extension_count((prev) => prev + 1);

          if (onBatchExtension) {
            onBatchExtension();
          }

          setIs_batch_extension_modal_open(false);
          setIs_batch_extension_complete_modal_open(true);
        }}
        type="center"
      />

      {/* 📌 일괄 기한 연장 완료 모달 */}
      <BaseModal
        is_open={is_batch_extension_complete_modal_open}
        on_close={() => setIs_batch_extension_complete_modal_open(false)}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 📌 일괄 기한 연장 제한 초과 모달 */}
      <BaseModal
        is_open={is_batch_extension_limit_modal_open}
        on_close={() => setIs_batch_extension_limit_modal_open(false)}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />
    </>
  );
}
