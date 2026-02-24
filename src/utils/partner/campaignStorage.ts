/* ========================================
   캠페인 저장 유틸리티
   ======================================== */

/**
 * 캠페인 저장 유틸리티
 *
 * 목적: 파트너 캠페인을 localStorage에 안전하게 저장/관리
 *
 * 저장 규칙:
 * - 동일 ID의 캠페인이 이미 존재하면 덮어씁니다 (중복 방지)
 * - 최대 50개까지 유지하며, 초과 시 오래된 것부터 제거합니다
 * - 데이터 크기가 4MB를 초과하면 가장 오래된 항목부터 제거합니다
 * - QuotaExceededError 발생 시 절반을 제거한 뒤 재시도합니다
 *
 * 사용처:
 * - /partner/campaign/create/* (캠페인 등록 페이지)
 * - /partner/campaign/edit/* (캠페인 수정 페이지)
 */

/** localStorage 캠페인 항목의 최소 공통 타입 */
type StoredCampaign = Record<string, unknown>;

/** 저장 설정 상수 */
const MAX_CAMPAIGNS = 50;
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB

/**
 * 캠페인을 localStorage에 안전하게 저장합니다.
 *
 * 동작 순서:
 * 1. 기존 목록을 불러옵니다
 * 2. 동일 ID가 있으면 교체, 없으면 추가합니다
 * 3. 50개 초과 시 오래된 것부터 제거합니다
 * 4. 직렬화 크기가 4MB 초과 시 shift로 추가 제거합니다
 * 5. 저장 시 QuotaExceededError 발생 시 절반 제거 후 재시도합니다
 *
 * @param campaign - 저장할 캠페인 객체 (id 필드 필수)
 * @param storageKey - localStorage 키 (예: "deliveryCampaigns")
 * @returns 저장 성공 여부 (true: 성공, false: 실패)
 */
export const saveCampaignToStorage = (campaign: StoredCampaign, storageKey: string): boolean => {
  try {
    // 1. 기존 목록 불러오기
    const storedRaw = localStorage.getItem(storageKey);
    const campaigns: StoredCampaign[] = storedRaw ? JSON.parse(storedRaw) : [];

    // 2. 중복 ID 처리: 같은 ID가 있으면 교체, 없으면 추가
    const existingIndex = campaigns.findIndex((c) => c.id === campaign.id);
    if (existingIndex >= 0) {
      campaigns[existingIndex] = campaign;
    } else {
      campaigns.push(campaign);
    }

    // 3. 최대 개수 초과 시 오래된 것부터 제거
    if (campaigns.length > MAX_CAMPAIGNS) {
      campaigns.splice(0, campaigns.length - MAX_CAMPAIGNS);
    }

    // 4. 직렬화 크기 초과 시 오래된 것부터 shift로 추가 제거
    const serialized = JSON.stringify(campaigns);
    if (serialized.length > MAX_STORAGE_SIZE) {
      const trimmed = [...campaigns];
      while (JSON.stringify(trimmed).length > MAX_STORAGE_SIZE && trimmed.length > 1) {
        trimmed.shift();
      }
      localStorage.setItem(storageKey, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(storageKey, serialized);
    }

    return true;
  } catch (error) {
    // 5. QuotaExceededError: 기존 목록 절반 제거 후 재시도
    if (error instanceof Error && error.name === "QuotaExceededError") {
      return _retryAfterTrim(campaign, storageKey);
    }

    return false;
  }
};

/**
 * QuotaExceededError 발생 시 기존 데이터 절반을 제거하고 재시도합니다.
 *
 * @param campaign - 저장할 캠페인 객체
 * @param storageKey - localStorage 키
 * @returns 재시도 성공 여부
 */
const _retryAfterTrim = (campaign: StoredCampaign, storageKey: string): boolean => {
  try {
    const storedRaw = localStorage.getItem(storageKey);
    const existing: StoredCampaign[] = storedRaw ? JSON.parse(storedRaw) : [];

    // 절반만 남기고 나머지 제거 (최소 1개 보장)
    const keepCount = Math.max(1, Math.floor(existing.length / 2));
    const trimmed = existing.slice(-keepCount);
    trimmed.push(campaign);

    localStorage.setItem(storageKey, JSON.stringify(trimmed));
    return true;
  } catch (_retryError) {
    return false;
  }
};
