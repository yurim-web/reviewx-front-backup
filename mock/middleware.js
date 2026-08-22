/**
 * json-server 커스텀 미들웨어
 * 파트너 로그인/세션 등 단순 REST로 처리 불가능한 엔드포인트 처리
 */

// 메모리 상태: 알림 전체 삭제 여부
let notificationsDeleted = false;
let adminNotificationsDeleted = false;
let saAdminNotificationsDeleted = false;

// 메모리 상태: 로그인된 관리자 정보 (세션 대용)
let adminSession = {
  id: "admin_ga_001",
  email: "manager_ga@test.com",
  name: "김관리",
  role: "manager_ga",
};

// 메모리 상태: 임시저장 캠페인 데이터 (API 11/12용)
const draftStore = {};

// 메모리 상태: 로그인된 파트너 정보 (세션 대용)
let currentSession = {
  userId: 1001,
  partnerId: 501,
  email: "test@test.com",
  name: "홍길동",
  businessName: "마크엑스컴퍼니",
};

module.exports = function createMiddleware(db) {
  // db: lowdb 인스턴스 (router.db) — 인메모리 데이터 읽기/쓰기

  /** campaigns 컬렉션에서 데이터 읽기 (인메모리 DB 우선) */
  function getCampaigns() {
    if (db) {
      try { return db.get("campaigns").value() || []; } catch (_e) { /* fallback */ }
    }
    return require("./db.json").campaigns || [];
  }

  /** campaigns 컬렉션에 데이터 추가 (인메모리 DB) */
  function pushCampaign(record) {
    if (db) {
      try { db.get("campaigns").push(record).write(); return true; } catch (_e) { /* fallback */ }
    }
    return false;
  }

  // 관리자 인증번호 상태 (메모리)
  let adminVerificationCode = null;
  let adminVerifiedPhone = null;

  return (req, res, next) => {

  // 디버그: 미들웨어 진입 확인 (일시)
  // console.log("[MW]", req.method, req.path);

  // ============ POST /api/v1/auth/phone/verify/request ============
  // 사용자/파트너 휴대폰 인증번호 발송
  if (req.method === "POST" && req.path === "/api/v1/auth/phone/verify/request") {
    const { phoneNum } = req.body || {};
    // 01099999999 → 이미 가입된 번호 (A_M1 모달 테스트용)
    if (phoneNum === "01099999999" || phoneNum === "010-9999-9999") {
      return res.status(409).json({
        result: "ERROR",
        errorCode: "ALREADY_REGISTERED",
        provider: "NAVER",
        message: "이미 가입된 번호입니다.",
      });
    }
    const verificationId = "vrf_" + Date.now();
    adminVerificationCode = "123456";
    return res.status(200).json({
      result: "OK",
      verificationId,
      expireAt: new Date(Date.now() + 240 * 1000).toISOString(),
    });
  }

  // ============ POST /api/v1/auth/phone/verify/confirm ============
  // 사용자/파트너 인증번호 확인
  if (req.method === "POST" && req.path === "/api/v1/auth/phone/verify/confirm") {
    const { verificationId, code } = req.body || {};
    if (code === "123456" || code === adminVerificationCode) {
      return res.status(200).json({
        result: "VERIFIED",
        verifiedPhoneToken: "tok_" + Date.now(),
      });
    }
    return res.status(400).json({
      result: "ERROR",
      error: { code: "INVALID_CODE", message: "인증번호가 일치하지 않습니다." },
    });
  }

  // ============ POST /api/admin/auth/phone/request ============
  // 관리자 휴대폰 인증번호 발송
  if (req.method === "POST" && (req.path === "/api/admin/auth/phone/request" || req.path === "/admin/auth/phone/request")) {
    const { phone } = req.body || {};
    adminVerificationCode = "123456";
    return res.status(200).json({
      result: "OK",
      message: "인증번호가 발송되었습니다.",
      expiresIn: 180,
    });
  }

  // ============ POST /api/admin/auth/phone/verify ============
  // 관리자 인증번호 확인
  if (req.method === "POST" && (req.path === "/api/admin/auth/phone/verify" || req.path === "/admin/auth/phone/verify")) {
    const { phone, code } = req.body || {};
    if (code === "123456" || code === adminVerificationCode) {
      adminVerifiedPhone = phone;
      return res.status(200).json({ result: "OK", message: "인증이 완료되었습니다." });
    }
    return res.status(400).json({
      result: "ERROR",
      error: { code: "INVALID_CODE", message: "인증번호가 일치하지 않습니다." },
    });
  }

  // ============ GET /admin/accounts ============
  // 전화번호로 관리자 계정 조회 (아이디/비밀번호 찾기용)
  if (req.method === "GET" && (req.path === "/admin/accounts" || req.path === "/api/admin/accounts")) {
    return res.status(200).json([
      { id: "admin_ga_001", email: "manager_ga@test.com", phone: "01012345678", name: "김관리", userType: "admin_ga", role: "manager_ga", password: "1234", isBanned: false, isBlocked: false, signupDate: "2025-01-15" },
      { id: "admin_sa_001", email: "manager_sa@test.com", phone: "01098765432", name: "박최고", userType: "admin_sa", role: "manager_sa", password: "1234", isBanned: false, isBlocked: false, signupDate: "2025-01-10" },
      { id: "admin_ga_002", email: "blocked_ga@test.com", phone: "01011112222", name: "차단관리자", userType: "admin_ga", role: "manager_ga", password: "1234", isBanned: false, isBlocked: true, signupDate: "2025-02-01" },
      { id: "admin_ga_003", email: "banned_ga@test.com", phone: "01033334444", name: "정지관리자", userType: "admin_ga", role: "manager_ga", password: "1234", isBanned: true, isBlocked: false, signupDate: "2025-03-01" },
    ]);
  }

  // ============ POST /api/admin/auth/reset-password ============
  // 관리자 비밀번호 재설정
  if (req.method === "POST" && (req.path === "/api/admin/auth/reset-password" || req.path === "/admin/auth/reset-password")) {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword) {
      return res.status(400).json({
        result: "ERROR",
        error: { code: "INVALID_INPUT", message: "이메일과 새 비밀번호를 입력해주세요." },
      });
    }
    return res.status(200).json({
      result: "OK",
      message: "비밀번호가 변경되었습니다.",
    });
  }

  // ============ GET /api/admin/dashboard ============
  // GA-01: 대시보드 통계 데이터 조회 (period별 데이터 변화)
  if (req.method === "GET" && (req.path === "/api/admin/dashboard" || req.path === "/admin/dashboard")) {
    const period = req.query.period || "month";

    // period별 배수 (데이터 변화 시뮬레이션)
    const multipliers = { today: 0.3, week: 0.7, month: 1.0, custom: 0.85 };
    const m = multipliers[period] || 1.0;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaignSummary: {
        recruitRate: +(85.3 * m).toFixed(1),
        recruitRateChange: +(2.1 * m).toFixed(1),
        achieveRate: +(72.1 * m).toFixed(1),
        achieveRateChange: +(-1.3 * m).toFixed(1),
        rejectRate: +(4.2 * m).toFixed(1),
        rejectRateChange: +(0.5 * m).toFixed(1),
        reportRate: +(1.1 * m).toFixed(1),
        reportRateChange: +(-0.2 * m).toFixed(1),
      },
      campaignStats: {
        total: Math.round(150 * m),
        registering: Math.round(12 * m),
        recruiting: Math.round(35 * m),
        selecting: Math.round(18 * m),
        purchasing: Math.round(25 * m),
        emergency: Math.round(3 * m),
        closed: Math.round(50 * m),
        cancelled: Math.round(7 * m),
        byType: [
          { type: "DELIVERY", label: "배송형", count: Math.round(60 * m) },
          { type: "VISIT", label: "방문형", count: Math.round(45 * m) },
          { type: "BUY", label: "구매형", count: Math.round(30 * m) },
          { type: "REPORTERS", label: "기자단", count: Math.round(15 * m) },
        ],
        byCategory: [
          { category: "생활", recruitmentRate: +(82.5 * m).toFixed(1), achievementRate: +(78.0 * m).toFixed(1), averageDuration: 21 },
          { category: "식품", recruitmentRate: +(91.3 * m).toFixed(1), achievementRate: +(85.2 * m).toFixed(1), averageDuration: 18 },
          { category: "패션", recruitmentRate: +(76.8 * m).toFixed(1), achievementRate: +(71.5 * m).toFixed(1), averageDuration: 24 },
          { category: "뷰티", recruitmentRate: +(88.0 * m).toFixed(1), achievementRate: +(80.3 * m).toFixed(1), averageDuration: 20 },
          { category: "가구", recruitmentRate: +(65.2 * m).toFixed(1), achievementRate: +(60.1 * m).toFixed(1), averageDuration: 28 },
          { category: "가전", recruitmentRate: +(70.5 * m).toFixed(1), achievementRate: +(68.9 * m).toFixed(1), averageDuration: 25 },
          { category: "디지털", recruitmentRate: +(85.1 * m).toFixed(1), achievementRate: +(79.4 * m).toFixed(1), averageDuration: 22 },
          { category: "유아동", recruitmentRate: +(90.2 * m).toFixed(1), achievementRate: +(83.7 * m).toFixed(1), averageDuration: 19 },
          { category: "문화", recruitmentRate: +(73.6 * m).toFixed(1), achievementRate: +(65.8 * m).toFixed(1), averageDuration: 26 },
          { category: "여가", recruitmentRate: +(79.3 * m).toFixed(1), achievementRate: +(74.2 * m).toFixed(1), averageDuration: 23 },
          { category: "반려동물", recruitmentRate: +(92.8 * m).toFixed(1), achievementRate: +(88.1 * m).toFixed(1), averageDuration: 17 },
          { category: "서비스", recruitmentRate: +(68.4 * m).toFixed(1), achievementRate: +(62.5 * m).toFixed(1), averageDuration: 27 },
          { category: "기타", recruitmentRate: +(55.0 * m).toFixed(1), achievementRate: +(50.3 * m).toFixed(1), averageDuration: 30 },
        ],
      },
      rejectReportStats: {
        totalRejects: Math.round(42 * m),
        totalReports: Math.round(11 * m),
        rejectTrend: +(-3.2 * m).toFixed(1),
        reportTrend: +(1.5 * m).toFixed(1),
      },
      accessStats: {
        totalAccess: Math.round(12500 * m),
        totalAccessChange: +(8.3 * m).toFixed(1),
        inflowCount: Math.round(3200 * m),
        inflowChange: +(-2.1 * m).toFixed(1),
        pcRate: 40.5,
        mobileRate: 35.2,
        tabletRate: 6.5,
        appRate: 17.8,
      },
      memberStats: {
        total: 20,     // 리뷰어 10 + 파트너 10
        totalChange: 5,
        newMembers: 2,
        newMembersChange: 1,
        active: 14,    // 리뷰어 ACTIVE 8 + 파트너 ACTIVE 6
        activeChange: 2,
        dormant: 6,    // 나머지 (탈퇴/정지/제한 등)
        dormantChange: -1,
      },
      memberTypeStats: {
        reviewer: {
          total: 10,
          newMembers: 1,
          active: 8,    // 탈퇴 1 + 이용제한 1 제외
          dormant: 2,
        },
        partner: {
          total: 10,
          newMembers: 1,
          active: 6,    // PAUSED 1 + BLOCKED 1 + WITHDRAW 1 + 기타 1 제외
          dormant: 4,
        },
      },
      channelStats: {
        channels: [
          { channelName: "blog", memberCount: 7, percentage: 35 },
          { channelName: "instagram", memberCount: 6, percentage: 30 },
          { channelName: "youtube", memberCount: 4, percentage: 20 },
          { channelName: "clip", memberCount: 3, percentage: 15 },
        ],
      },
    });
  }

  // ============ GET /api/admin-sa/campaign/progress/stats ============
  // SA-02: SA 캠페인 상태별 통계 카드 조회 (GA 캠페인 데이터 공유)
  if (req.method === "GET" && req.path === "/api/admin-sa/campaign/progress/stats") {
    var saCampaignsForStats = getCampaigns();
    var SA_STATUS_MAP = { REGISTERING: "OPEN_SCHEDULED", RECRUITING: "APPLYING", SELECTING: "IN_PROGRESS", PURCHASING: "IN_PROGRESS", EMERGENCY: "URGENT", CLOSED: "ENDED", CANCELLED: "CANCELLED" };
    var statsCount = { total: 0, openScheduled: 0, applying: 0, inProgress: 0, ended: 0, cancelled: 0, urgent: 0 };
    saCampaignsForStats.forEach(function(c) {
      var saStatusVal = SA_STATUS_MAP[c.status] || "IN_PROGRESS";
      statsCount.total++;
      if (saStatusVal === "OPEN_SCHEDULED") statsCount.openScheduled++;
      else if (saStatusVal === "APPLYING") statsCount.applying++;
      else if (saStatusVal === "IN_PROGRESS") statsCount.inProgress++;
      else if (saStatusVal === "ENDED") statsCount.ended++;
      else if (saStatusVal === "CANCELLED") statsCount.cancelled++;
      else if (saStatusVal === "URGENT") statsCount.urgent++;
    });
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      stats: statsCount,
    });
  }

  // ============ GET /api/admin-sa/campaign/progress ============
  // SA-02: SA 캠페인 목록 조회 (GA 캠페인 데이터 공유)
  if (req.method === "GET" && req.path === "/api/admin-sa/campaign/progress") {
    var saCampaigns = getCampaigns();
    var SA_STATUS_FROM_GA = { REGISTERING: "OPEN_SCHEDULED", RECRUITING: "APPLYING", SELECTING: "IN_PROGRESS", PURCHASING: "IN_PROGRESS", EMERGENCY: "URGENT", CLOSED: "ENDED", CANCELLED: "CANCELLED" };
    var SA_CHANNEL_FROM_GA = { NAVER_BLOG: "BLOG", BLOG: "BLOG", NAVER_CLIP: "CLIP", CLIP: "CLIP", INSTAGRAM: "INSTAGRAM", INSTAGRAM_REELS: "REELS", REELS: "REELS", YOUTUBE: "YOUTUBE", YOUTUBE_SHORTS: "SHORTS", SHORTS: "SHORTS", STORE: "REVIEW", COUPANG: "REVIEW", REVIEW: "REVIEW", MISSION: "MISSION" };
    var SA_TYPE_FROM_GA = { DELIVERY: "DELIVERY", VISIT: "VISIT", PURCHASE_REVIEW: "REVIEW", PURCHASE: "REVIEW", REPORTER: "REPORTER", MISSION: "MISSION" };
    var SA_PARTNER_NAMES = { 501: "마크엑스컴퍼니", 502: "청불 천막집 방이점", 503: "명륜진사갈비 수원광교점", 504: "(주) 레인보우8", 505: "(주)플레티어", 506: "꽃초롱", 507: "주식회사 와이디컴퍼니그룹", 508: "(주)아이엠에스커뮤니케이션" };

    var saMapped = saCampaigns.map(function(c) {
      var cid = c.campaignId || c.id;
      var channelName = (c.requiredPlatform && c.requiredPlatform.channelName) || "";
      var saStatus = SA_STATUS_FROM_GA[c.status] || "IN_PROGRESS";
      var saChannel = SA_CHANNEL_FROM_GA[channelName] || SA_CHANNEL_FROM_GA[c.type] || "BLOG";
      var saType = SA_TYPE_FROM_GA[c.type] || "DELIVERY";
      var campaignNum = cid > 100000 ? String(50000 + (cid % 10000)).padStart(6, "0") : String(4000 + cid).padStart(6, "0");
      var partnerName = c.partnerName || SA_PARTNER_NAMES[c.partner_id || c.partnerId] || "테스트 파트너";
      return {
        campaignId: cid,
        campaignNumber: campaignNum,
        partnerName: partnerName,
        campaignName: c.title || "",
        status: saStatus,
        type: saType,
        channel: saChannel,
        applyCount: c.appliedCount || (c.metrics && c.metrics.appliedCount) || 0,
        recruitCount: parseInt(c.recruitLimit) || (c.recruit && c.recruit.recruitLimit) || 0,
        point: (c.reward && c.reward.extraRewardPoint) || c.rewardPoint || 0,
      };
    });

    var { status: saStatus, type: saType, channel: saChannel, keyword: saKeyword } = req.query;
    var saFiltered = saMapped;
    if (saStatus) {
      var saStatusList = saStatus.split(",").map(function(s) { return s.trim(); });
      saFiltered = saFiltered.filter(function(c) { return saStatusList.includes(c.status); });
    }
    if (saType) {
      var saTypeList = saType.split(",").map(function(s) { return s.trim(); });
      saFiltered = saFiltered.filter(function(c) { return saTypeList.includes(c.type); });
    }
    if (saChannel) {
      var saChannelList = saChannel.split(",").map(function(s) { return s.trim(); });
      saFiltered = saFiltered.filter(function(c) { return saChannelList.includes(c.channel); });
    }
    if (saKeyword) {
      var saKw = saKeyword.toLowerCase();
      saFiltered = saFiltered.filter(function(c) {
        return (c.campaignNumber || "").toLowerCase().includes(saKw) ||
          (c.campaignName || "").toLowerCase().includes(saKw) ||
          (c.partnerName || "").toLowerCase().includes(saKw);
      });
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: saFiltered.length,
      campaigns: saFiltered,
    });
  }

  // ============ POST /api/admin-sa/campaigns/:id/report ============
  // SA-02: SA 캠페인 신고 처리
  if (req.method === "POST" && /^\/api\/admin-sa\/campaigns\/\d+\/report$/.test(req.path)) {
    var saReportCode = (req.body || {}).reportCode;
    if (!saReportCode) {
      return res.status(400).json({
        result: "ERROR",
        error: { code: "INVALID_REPORT_CODE", message: "올바르지 않은 신고 코드입니다." },
      });
    }
    return res.status(200).json({ result: "OK", message: "신고가 접수되었습니다." });
  }

  // ============ GET /api/admin-sa/settlement/withdrawal/stats ============
  // SA-04: SA 출금 현황 통계 카드 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/settlement/withdrawal/stats") {
    var wsStats = db.get("sa_withdrawal_status_stats").value();
    if (!wsStats) {
      wsStats = { urgentAmount: 0, urgentCount: 0, weekScheduledAmount: 0, weekScheduledCount: 0, monthTotalAmount: 0, monthTotalCount: 0, totalDepositAmount: 0 };
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      stats: wsStats,
    });
  }

  // ============ GET /api/admin-sa/settlement/withdrawal ============
  // SA-04: SA 출금 현황 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/settlement/withdrawal") {
    var wsItems = db.get("sa_withdrawal_status").value() || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: wsItems.length,
      withdrawals: wsItems,
    });
  }

  // ============ GET /api/admin-sa/settlement/withdrawal/requests ============
  // SA-05: SA 출금 요청 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/settlement/withdrawal/requests") {
    var wTab = (req.query.tab || "URGENT").toUpperCase();
    var wSource = wTab === "ROUND" ? "sa_withdrawal_requests_round" : "sa_withdrawal_requests_urgent";
    var wItems = db.get(wSource).value() || [];
    var wTotalAmount = wItems.reduce(function (sum, item) { return sum + (item.withdrawalPoints || 0); }, 0);
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: wItems.length,
      totalAmount: wTotalAmount,
      withdrawalRequests: wItems,
    });
  }

  // ============ POST /api/admin-sa/withdrawal/requests/approve ============
  // SA-05: SA 출금 승인 (일괄)
  if (req.method === "POST" && req.path === "/api/admin-sa/withdrawal/requests/approve") {
    var approveIds = (req.body || {}).withdrawalRequestIds || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      approvedCount: approveIds.length,
      approvedIds: approveIds,
    });
  }

  // ============ POST /api/admin-sa/withdrawal/requests/reject ============
  // SA-05: SA 출금 반려 (일괄)
  if (req.method === "POST" && req.path === "/api/admin-sa/withdrawal/requests/reject") {
    var rejectIds = (req.body || {}).withdrawalRequestIds || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      rejectedCount: rejectIds.length,
      rejectedIds: rejectIds,
    });
  }

  // ============ GET /api/admin-sa/settlement/payment/stats ============
  // SA-06: SA 결제 내역 통계 카드 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/settlement/payment/stats") {
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      weekBankCount: 5,
      weekBankAmount: 1500000,
      weekCardCount: 12,
      weekCardAmount: 3600000,
      monthTotalCount: 45,
      monthTotalAmount: 13500000,
    });
  }

  // ============ GET /api/admin-sa/settlement/payment ============
  // SA-06: SA 결제 내역 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/settlement/payment") {
    var payItems = db.get("sa_payment_history").value() || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: payItems.length,
      payments: payItems,
    });
  }

  // ============ GET /api/admin-sa/reviewer/stats ============
  // SA-07: SA 리뷰어 통계 카드 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/reviewer/stats") {
    var rvStats = db.get("sa_reviewer_stats").value();
    if (!rvStats) {
      rvStats = { monthlyNewCount: 0, totalCount: 0, monthlyActiveCount: 0, dormantCount: 0 };
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      ...rvStats,
    });
  }

  // ============ GET /api/admin-sa/reviewer ============
  // SA-07: SA 리뷰어 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/reviewer") {
    var rvItems = db.get("sa_reviewers").value() || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: rvItems.length,
      reviewers: rvItems,
    });
  }

  // ============ POST /api/admin-sa/reviewer/restrict ============
  // SA-07: SA 리뷰어 이용 제한 처리
  if (req.method === "POST" && req.path === "/api/admin-sa/reviewer/restrict") {
    var rvRestrictIds = (req.body || {}).reviewerIds || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      processedCount: rvRestrictIds.length,
    });
  }

  // ============ GET /api/admin-sa/partners/stats ============
  // SA-08: SA 파트너 통계 카드 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/partners/stats") {
    var ptStats = db.get("sa_partner_stats").value();
    if (!ptStats) {
      ptStats = { monthlyNewCount: 0, totalCount: 0, monthlyActiveCount: 0, dormantCount: 0 };
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      partnerStats: ptStats,
    });
  }

  // ============ GET /api/admin-sa/partners ============
  // SA-08: SA 파트너 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/partners") {
    var ptItems = db.get("sa_partners").value() || [];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: ptItems.length,
      partners: ptItems,
    });
  }

  // ============ GET /admin/partner/:id ============
  // SA-09 / GA-09: 파트너 상세 조회 (db.json partners 컬렉션에서 조회)
  if (req.method === "GET" && (req.path.match(/^\/api\/admin\/partners\/\d+$/) || req.path.match(/^\/admin\/partner\/\d+$/))) {
    var ptId = Number(req.path.split("/").pop());
    var ptItem = db.get("partners").find({ id: ptId }).value();
    // 실제 캠페인 수 동적 계산 (admin partnerId → userId 매핑)
    var PT_USER_MAP = { 1: 502, 2: 501, 3: 1001, 4: 1005, 5: 505, 6: 506, 7: 507, 8: 508 };
    var ptUserId = PT_USER_MAP[ptId] || ptId;
    var ptCampaigns = getCampaigns().filter(function(c) { return c.partner_id == ptUserId || c.partner_id == ptId; });
    var ptInProgress = ptCampaigns.filter(function(c) { return ["RECRUITING","SELECTING","PURCHASING","REGISTERING"].indexOf(c.status) >= 0; }).length;
    var ptCompleted = ptCampaigns.filter(function(c) { return c.status === "CLOSED"; }).length;
    if (ptItem) {
      ptItem.campaign_in_progress = ptInProgress;
      ptItem.campaign_completed = ptCompleted;
      ptItem.campaign_participated = ptInProgress + ptCompleted;
      return res.status(200).json(ptItem);
    }
    return res.status(200).json({
      id: ptId, number: String(ptId).padStart(6, "0"),
      business_name: "테스트파트너" + ptId, business_number: "000-00-00000",
      representative_name: "대표" + ptId, division: "개인",
      email: "partner" + ptId + "@test.com", phone: "010-0000-0000",
      address: "서울시 강남구", contact_name: "담당자" + ptId, contact_phone: "010-0000-0000",
      campaign_in_progress: ptInProgress, campaign_completed: ptCompleted,
      campaign_participated: ptInProgress + ptCompleted,
      current_points: 0, used_points: 0, payment_points: 0,
      status_type: "일반 회원", status: "정상", penalty_count: 0,
      last_access_date: "2026-03-20 14:30", join_date: "2025-06-01 09:00"
    });
  }

  // ============ GET /api/admin-sa/admins ============
  // SA-10: SA 관리자 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/admins") {
    var adminItems = db.get("sa_admins").value() || [];
    // 필터링
    var statusFilter = req.query.status;
    var keywordFilter = req.query.keyword;
    if (statusFilter) {
      adminItems = adminItems.filter(function(a) { return a.status === statusFilter; });
    }
    if (keywordFilter) {
      var kw = keywordFilter.toLowerCase();
      adminItems = adminItems.filter(function(a) { return a.name.toLowerCase().includes(kw) || a.email.toLowerCase().includes(kw); });
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: adminItems.length,
      admins: adminItems,
    });
  }

  // ============ POST /api/admin-sa/admins ============
  // SA-11: SA 관리자 등록
  if (req.method === "POST" && req.path === "/api/admin-sa/admins") {
    var saAdmins = db.get("sa_admins").value() || [];
    var maxId = saAdmins.reduce(function(max, a) { return Math.max(max, a.id); }, 0);
    var newAdmin = {
      id: maxId + 1,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || "",
      adminLevel: "GENERAL_ADMIN",
      reportCount: 0,
      suspendCount: 0,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: "ACTIVE",
    };
    db.get("sa_admins").push(newAdmin).write();
    return res.status(201).json({ result: "OK", admin: newAdmin });
  }

  // ============ PATCH /api/admin-sa/admins/:id ============
  // SA-12: SA 관리자 수정
  if (req.method === "PATCH" && /^\/api\/admin-sa\/admins\/\d+$/.test(req.path)) {
    var adminId = Number(req.path.split("/").pop());
    var target = db.get("sa_admins").find({ id: adminId }).value();
    if (!target) {
      return res.status(404).json({ result: "FAIL", message: "관리자를 찾을 수 없습니다." });
    }
    var updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.phone) updateData.phone = req.body.phone;
    db.get("sa_admins").find({ id: adminId }).assign(updateData).write();
    return res.status(200).json({ result: "OK" });
  }

  // ============ DELETE /api/admin-sa/admins/:id ============
  // SA-10: SA 관리자 삭제
  if (req.method === "DELETE" && /^\/api\/admin-sa\/admins\/\d+$/.test(req.path)) {
    var delAdminId = Number(req.path.split("/").pop());
    db.get("sa_admins").remove({ id: delAdminId }).write();
    return res.status(200).json({ result: "OK" });
  }

  // ============ GET /api/admin-sa/member/blacklist ============
  // SA-13: SA 이용 제한 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/member/blacklist") {
    var blItems = db.get("sa_blacklist").value() || [];
    // 필터링
    var blDivision = req.query.division;
    var blBlockCode = req.query.blockCode;
    var blKeyword = req.query.keyword;
    var blStartDate = req.query.startDate;
    var blEndDate = req.query.endDate;
    if (blDivision) {
      var divs = blDivision.split(",");
      blItems = blItems.filter(function(b) { return divs.includes(b.division); });
    }
    if (blBlockCode) {
      var codes = blBlockCode.split(",");
      blItems = blItems.filter(function(b) { return codes.includes(b.blockCode); });
    }
    if (blKeyword) {
      var kw = blKeyword.toLowerCase();
      blItems = blItems.filter(function(b) {
        return b.name.toLowerCase().includes(kw) || b.userId.toLowerCase().includes(kw) || (b.ipAddress || "").toLowerCase().includes(kw);
      });
    }
    if (blStartDate) {
      blItems = blItems.filter(function(b) { return b.registeredDate >= blStartDate; });
    }
    if (blEndDate) {
      blItems = blItems.filter(function(b) { return b.registeredDate <= blEndDate + "T23:59:59"; });
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: blItems.length,
      blacklist: blItems,
    });
  }

  // ============ DELETE /api/admin-sa/member/blacklist/:id ============
  // SA-13: SA 이용 제한 해제
  if (req.method === "DELETE" && /^\/api\/admin-sa\/member\/blacklist\//.test(req.path)) {
    var blId = req.path.split("/").pop();
    db.get("sa_blacklist").remove({ id: blId }).write();
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // ============ GET /api/admin/campaigns/summary ============
  // 캠페인 통계 요약 조회 (상단 카드 6종)
  if (req.method === "GET" && req.path === "/api/admin/campaigns/summary") {
    const campaigns = getCampaigns();
    const STATUS_MAP = {
      REGISTERING: "scheduled",
      RECRUITING: "recruiting",
      SELECTING: "inProgress",
      PURCHASING: "inProgress",
      EMERGENCY: "inProgress",
      CLOSED: "completed",
      CANCELLED: "cancelled",
    };
    const summary = { total: 0, scheduled: 0, recruiting: 0, inProgress: 0, completed: 0, cancelled: 0 };
    for (const c of campaigns) {
      summary.total++;
      const key = STATUS_MAP[c.status];
      if (key) summary[key]++;
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { campaignSummary: summary },
    });
  }

  // ============ GET /api/admin/campaigns ============
  // 캠페인 목록 조회 (백엔드 응답 구조로 변환)
  if (req.method === "GET" && req.path === "/api/admin/campaigns") {
    const campaigns = getCampaigns();
    const TYPE_LABEL = { DELIVERY: "배송형", VISIT: "방문형", PURCHASE: "구매평", PURCHASE_REVIEW: "구매평", REPORTER: "기자단", MISSION: "미션형" };
    const STATUS_LABEL = { REGISTERING: "예정", RECRUITING: "신청", SELECTING: "진행", PURCHASING: "진행", EMERGENCY: "긴급", CLOSED: "종료", CANCELLED: "취소" };
    const PARTNER_NAMES = {
      501: "마크엑스컴퍼니", 502: "청불 천막집 방이점", 503: "명륜진사갈비 수원광교점",
      504: "(주) 레인보우8", 505: "(주)플레티어", 506: "꽃초롱",
      507: "주식회사 와이디컴퍼니그룹", 508: "(주)아이엠에스커뮤니케이션",
    };
    // channelName → platformIconUrl 매핑 (백엔드 channel.icon_url 모사)
    const CHANNEL_ICON_MAP = {
      NAVER_BLOG: "/icons/platform/blog.png",
      BLOG: "/icons/platform/blog.png",
      NAVER_CLIP: "/icons/platform/clip.png",
      CLIP: "/icons/platform/clip.png",
      INSTAGRAM: "/icons/platform/instagram.png",
      INSTAGRAM_REELS: "/icons/platform/reels.png",
      REELS: "/icons/platform/reels.png",
      YOUTUBE: "/icons/platform/youtube.png",
      YOUTUBE_SHORTS: "/icons/platform/shorts.png",
      SHORTS: "/icons/platform/shorts.png",
      STORE: "/icons/platform/store.png",
      COUPANG: "/icons/platform/store.png",
      REVIEW: "/icons/platform/review.png",
      MISSION: "/icons/platform/mission.png",
    };
    const { status, type, channel, keyword } = req.query;

    let filtered = campaigns;
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (type) filtered = filtered.filter((c) => c.type === type);
    if (channel) filtered = filtered.filter((c) => (c.requiredPlatform?.channelName || "").toUpperCase().includes(channel.toUpperCase()));
    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter((c) =>
        String(c.id).includes(kw) ||
        (c.title || "").toLowerCase().includes(kw) ||
        (c.partnerName || "").toLowerCase().includes(kw)
      );
    }

    // recruitStartAt 기준 내림차순 정렬 (최신 모집 시작일 먼저)
    filtered.sort((a, b) => {
      const da = a.recruitStartAt || a.recruit?.recruitStartAt || "";
      const db = b.recruitStartAt || b.recruit?.recruitStartAt || "";
      return db.localeCompare(da);
    });

    const mapped = filtered.map((c, idx) => {
      const cid = c.campaignId || c.id;
      const channelName = c.requiredPlatform?.channelName || "";
      // 캠페인번호: 작은 ID는 4000+id, timestamp형 ID는 뒤 4자리+50000
      const campaignNum = cid > 100000 ? String(50000 + (cid % 10000)).padStart(6, "0") : String(4000 + cid).padStart(6, "0");
      return {
      campaignId: cid,
      campaignNumber: campaignNum,
      partnerId: c.partner_id || c.partnerId || 0,
      partnerName: c.partnerName || PARTNER_NAMES[c.partner_id || c.partnerId] || "테스트 파트너",
      title: c.title || "",
      type: c.type || "DELIVERY",
      typeLabel: TYPE_LABEL[c.type] || c.type,
      platformIconUrl: c.platformIconUrl || CHANNEL_ICON_MAP[channelName] || CHANNEL_ICON_MAP[c.type] || "/icons/platform/blog.png",
      status: c.status || "RECRUITING",
      statusLabel: STATUS_LABEL[c.status] || c.status,
      appliedCount: c.appliedCount ?? c.metrics?.appliedCount ?? 0,
      recruitLimit: parseInt(c.recruitLimit) || c.recruit?.recruitLimit || 0,
      rewardPoint: c.reward?.extraRewardPoint || c.rewardPoint || 0,
      recruitStartAt: c.recruitStartAt || c.recruit?.recruitStartAt || "",
      recruitEndAt: c.recruitEndAt || c.recruit?.recruitEndAt || "",
    };});

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { campaigns: mapped },
    });
  }

  // ============ POST /api/admin/campaigns/:id/report ============
  // 캠페인 신고 처리
  if (req.method === "POST" && /^\/api\/admin\/campaigns\/\d+\/report$/.test(req.path)) {
    const { reportCode, reportReason } = req.body || {};
    if (!reportCode) {
      return res.status(400).json({
        result: "ERROR",
        error: { code: "INVALID_REPORT_CODE", message: "올바르지 않은 신고 코드입니다." },
      });
    }
    return res.status(200).json({ result: "OK", message: "신고가 접수되었습니다." });
  }

  // ============ GET /api/admin/campaigns/rejected ============
  // GA-03: 캠페인 반려내역 조회
  if (req.method === "GET" && (req.path === "/api/admin/campaigns/rejected" || req.path === "/admin/campaigns/rejected")) {
    const rejectedList = [
      { rejectId: 1, campaignTitle: "[배송형] 건강식품 체험단", partnerName: "마크엑스컴퍼니", reviewerName: "김리뷰", rejectCode: "R001", rejectCodeLabel: "구매 정보 불일치", rejectReason: "영수증 미첨부로 인한 구매 확인 불가", aiRecommendedCodes: ["R001", "R003"], processedAt: "2026-03-20T10:30:00+09:00", processedBy: "AI 자동 탐지" },
      { rejectId: 2, campaignTitle: "[방문형] 카페 방문 리뷰", partnerName: "카페베네", reviewerName: "박블로거", rejectCode: "R002", rejectCodeLabel: "가이드 불이행", rejectReason: "이미지 수량 부족 (3장 중 1장만 제출)", aiRecommendedCodes: ["R002"], processedAt: "2026-03-19T14:00:00+09:00", processedBy: "김관리" },
      { rejectId: 3, campaignTitle: "[구매평] 스킨케어 구매 리뷰", partnerName: "뷰티랩", reviewerName: "이인스타", rejectCode: "R003", rejectCodeLabel: "콘텐츠 오류", rejectReason: "게시물 링크 접속 불가 (삭제된 게시물)", aiRecommendedCodes: ["R003", "R004"], processedAt: "2026-03-18T09:00:00+09:00", processedBy: "AI 자동 탐지" },
      { rejectId: 4, campaignTitle: "[기자단] IT 신제품 리뷰", partnerName: "테크코리아", reviewerName: "최유튜버", rejectCode: "R004", rejectCodeLabel: "이미지 도용 의심", rejectReason: "타 사이트 이미지와 동일한 이미지 사용 의심", aiRecommendedCodes: ["R004"], processedAt: "2026-03-17T16:30:00+09:00", processedBy: "박최고" },
      { rejectId: 5, campaignTitle: "[미션형] SNS 팔로우 이벤트", partnerName: "소셜플러스", reviewerName: "정소영", rejectCode: "R005", rejectCodeLabel: "반복 반려 의심", rejectReason: "동일 사유로 3회 이상 반복 반려", aiRecommendedCodes: ["R005", "R008"], processedAt: "2026-03-16T11:00:00+09:00", processedBy: "AI 자동 탐지" },
      { rejectId: 6, campaignTitle: "[배송형] 프리미엄 커피 원두", partnerName: "커피빈즈", reviewerName: "한커피", rejectCode: "R002", rejectCodeLabel: "가이드 불이행", rejectReason: "무성의한 내용 (50자 미만 작성)", aiRecommendedCodes: ["R002", "R008"], processedAt: "2026-03-15T13:00:00+09:00", processedBy: "김관리" },
      { rejectId: 7, campaignTitle: "[방문형] 레스토랑 방문", partnerName: "맛있는식당", reviewerName: "오맛집", rejectCode: "R006", rejectCodeLabel: "부적절한 콘텐츠 요청", rejectReason: "캠페인 가이드와 무관한 홍보 콘텐츠 요청", aiRecommendedCodes: ["R006"], processedAt: "2026-03-14T10:00:00+09:00", processedBy: "AI 자동 탐지" },
    ];
    // 반려 코드별 라벨 맵
    var rejectCodeLabels = { R001: "구매 정보 불일치", R002: "가이드 불이행", R003: "콘텐츠 오류", R004: "이미지 도용 의심", R005: "반복 반려 의심", R006: "부적절한 콘텐츠 요청", R007: "출금 정보 불일치", R008: "그외 비매너 행위" };
    var rejectStats = [];
    ["R001","R002","R003","R004","R005","R006","R007","R008"].forEach(function(c) {
      var cnt = rejectedList.filter(function(r) { return r.rejectCode === c; }).length;
      rejectStats.push({ code: c, label: rejectCodeLabels[c], count: cnt });
    });

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        rejectStats: rejectStats,
        rejectList: rejectedList.map(function(r) { return Object.assign({}, r, { campaignId: r.rejectId * 100 + 1000, reviewerId: r.rejectId * 10 + 2000 }); }),
        pagination: { totalCount: rejectedList.length, currentPage: 1, totalPages: 1, limit: 15 },
      },
    });
  }

  // ============ PUT /api/admin/campaigns/rejected/:id/code ============
  if (req.method === "PUT" && req.path.match(/^\/api\/admin\/campaigns\/rejected\/\d+\/code$/)) {
    return res.status(200).json({ result: "OK", message: "반려 코드가 업데이트되었습니다." });
  }

  // ============ POST /api/admin/campaigns/rejected/:id/report ============
  if (req.method === "POST" && req.path.match(/^\/api\/admin\/campaigns\/rejected\/\d+\/report$/)) {
    return res.status(200).json({ result: "OK", message: "신고가 접수되었습니다." });
  }

  // ============ GET /api/admin/users/blocked ============
  // GA-05: 이용 제한 목록 조회
  if (req.method === "GET" && (req.path === "/api/admin/users/blocked" || req.path === "/admin/users/blocked")) {
    var blockedList = [
      { blockId: 1, userId: 1, name: "관리자 테스트", businessName: null, division: "admin", id: "admin_1", ip: "192.168.1.1", point: 0, blockCode: "B004", blockReason: "커뮤니티 가이드 위반", createdAt: "2026-02-09T15:30:00+09:00", createdBy: "시스템" },
      { blockId: 2, userId: 17, name: "탈퇴회원테스트", businessName: null, division: "reviewer", id: "17", ip: "567.567.56.7", point: 0, blockCode: "B001", blockReason: "반복 반려 누적", createdAt: "2026-02-08T14:20:00+09:00", createdBy: "시스템" },
      { blockId: 3, userId: 6, name: "일이삼사오육칠팔구십", businessName: null, division: "reviewer", id: "6", ip: "192.168.1.1", point: 1500000, blockCode: "B001", blockReason: "반복 반려 누적", createdAt: "2026-03-01T18:56:00+09:00", createdBy: "시스템" },
      { blockId: 4, userId: 5, name: "김파트너", businessName: "마크엑스컴퍼니", division: "partner", id: "5", ip: "10.0.0.5", point: 350000, blockCode: "B005", blockReason: "비정상 운영 행위", createdAt: "2026-02-28T10:15:00+09:00", createdBy: "김관리" },
      { blockId: 5, userId: 16, name: "박파트너", businessName: "테스트컴퍼니", division: "partner", id: "16", ip: "172.16.0.1", point: 0, blockCode: "B007", blockReason: "부적절 캠페인 게시", createdAt: "2026-02-25T09:00:00+09:00", createdBy: "시스템" },
      { blockId: 6, userId: 3, name: "이리뷰어", businessName: null, division: "reviewer", id: "3", ip: "192.168.2.50", point: 25000, blockCode: "B002", blockReason: "무단 이탈·노쇼 누적", createdAt: "2026-03-05T14:30:00+09:00", createdBy: "김관리" },
      { blockId: 7, userId: 4, name: "최리뷰어", businessName: null, division: "reviewer", id: "4", ip: "192.168.3.100", point: 8000, blockCode: "B003", blockReason: "반복 취소 누적", createdAt: "2026-03-10T11:20:00+09:00", createdBy: "시스템" },
      { blockId: 8, userId: 2, name: "정파트너", businessName: "뷰티랩", division: "partner", id: "2", ip: "10.0.0.10", point: 120000, blockCode: "B006", blockReason: "콘텐츠 도용/중복", createdAt: "2026-03-15T16:45:00+09:00", createdBy: "AI 자동 탐지" },
      { blockId: 9, userId: 7, name: "강리뷰어", businessName: null, division: "reviewer", id: "7", ip: "192.168.4.200", point: 45000, blockCode: "B008", blockReason: "비정상 요청/접근", createdAt: "2026-03-18T08:30:00+09:00", createdBy: "시스템" },
    ];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { totalCount: blockedList.length, blockedList: blockedList },
    });
  }

  // ============ POST /api/admin/users/:id/block ============
  // GA-04/05: 이용 제한 등록 (차단)
  if (req.method === "POST" && req.path.match(/^\/api\/admin\/users\/\d+\/block$/)) {
    return res.status(200).json({ result: "OK", message: "이용 제한이 등록되었습니다." });
  }

  // ============ DELETE /api/admin/users/:id/block ============
  // GA-04/05: 이용 제한 해제
  if (req.method === "DELETE" && req.path.match(/^\/api\/admin\/users\/\d+\/block$/)) {
    return res.status(200).json({ result: "OK", message: "이용 제한이 해제되었습니다." });
  }

  // ============ GET /api/admin/reviewers/stats ============
  // GA-06: 리뷰어 통계 (stats가 /reviewers/:id보다 먼저 매칭되어야 함)
  if (req.method === "GET" && req.path === "/api/admin/reviewers/stats") {
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: { monthlyNew: 1, total: 10, monthlyActive: 8, dormant: 2 },
    });
  }

  // ============ GET /api/admin/reviewers/:id/campaigns ============
  // GA-07: 리뷰어 캠페인 진행 내역
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/reviewers\/\d+\/campaigns$/)) {
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        totalCount: 3,
        campaigns: [
          { campaignId: 501, campaignTitle: "신제품 블로그 리뷰", status: "COMPLETED", type: "DELIVERY", channel: "Blog", rewardPoint: 30000 },
          { campaignId: 502, campaignTitle: "카페 방문 리뷰 캠페인", status: "IN_PROGRESS", type: "VISIT", channel: "Instagram", rewardPoint: 15000 },
          { campaignId: 503, campaignTitle: "스킨케어 구매 리뷰", status: "COMPLETED", type: "PURCHASE", channel: "Blog", rewardPoint: 20000 },
        ],
      },
    });
  }

  // ============ GET /api/admin/reviewers/:id/penalties ============
  // GA-07: 리뷰어 패널티 내역
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/reviewers\/\d+\/penalties$/)) {
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        totalCount: 2,
        penalties: [
          { penaltyHistoryId: 10, penaltyCode: "W001", penaltyReason: "선정 후 취소", penaltyScore: 30, imposeType: "SYSTEM", createdAt: "2026-01-15T11:00:00+09:00", currentStatus: "경고" },
          { penaltyHistoryId: 11, penaltyCode: "W003", penaltyReason: "콘텐츠 미제출", penaltyScore: 50, imposeType: "PARTNER", createdAt: "2026-02-20T14:30:00+09:00", currentStatus: "주의" },
        ],
      },
    });
  }

  // ============ GET /api/admin/reviewers/:id OR /admin/reviewer/:id ============
  // GA-07 / SA-07: 리뷰어 상세 조회 (db.json reviewers 컬렉션에서 조회)
  if (req.method === "GET" && (req.path.match(/^\/api\/admin\/reviewers\/\d+$/) || req.path.match(/^\/admin\/reviewer\/\d+$/))) {
    var rvId = Number(req.path.split("/").pop());
    var rvItem = db.get("reviewers").find({ id: rvId }).value();
    // 실제 캠페인 참여 수 동적 계산
    var rvApps = db.get("campaign_applications").value() || [];
    var rvCampaignApps = rvApps.filter(function(a) { return a.reviewer_id === rvId; });
    var rvParticipated = rvCampaignApps.length;
    var rvCompleted = rvCampaignApps.filter(function(a) { return a.status === "COMPLETED" || a.status === "COMPLETE"; }).length;
    if (rvItem) {
      rvItem.campaign_participated = rvParticipated;
      rvItem.campaign_completed = rvCompleted;
      return res.status(200).json(rvItem);
    }
    // db.json에 없으면 기본 더미 데이터 반환
    return res.status(200).json({
      id: rvId, number: String(rvId).padStart(6, "0"),
      name: "테스트" + rvId, nickname: "리뷰어" + rvId,
      gender: "남성", age: 28,
      email: "reviewer" + rvId + "@test.com",
      phone: "010-1234-" + String(rvId).padStart(4, "0"),
      address: "서울시 강남구 테헤란로 " + rvId,
      channels: ["Blog", "Instagram"],
      type: "일반",
      campaign_participated: rvParticipated, campaign_completed: rvCompleted,
      current_points: 50000, withdrawn_points: 30000,
      status_type: "일반 회원", status: "정상",
      penalty_count: 0, bank: "국민은행",
      account_holder: "테스트" + rvId,
      last_access_date: "2026-03-20 14:30",
      join_date: "2025-06-01 09:00"
    });
  }

  // ============ GET /api/admin/reviewers ============
  // GA-06: 리뷰어 목록 조회
  if (req.method === "GET" && (req.path === "/api/admin/reviewers" || req.path === "/admin/reviewers")) {
    var reviewersList = [
      { userId: 1, nickname: "오은영", channels: ["blog", "clip", "instagram"], division: "NORMAL", lastLoginAt: "2026-03-10T09:00:00+09:00", createdAt: "2025-06-01T10:00:00+09:00", campaignParticipated: 5, campaignCompleted: 4, holdingPoint: 50000, withdrawalPoint: 30000, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 2, nickname: "은지블로그", channels: ["blog", "clip"], division: "NORMAL", lastLoginAt: "2026-01-20T16:45:00+09:00", createdAt: "2025-12-12T14:30:00+09:00", campaignParticipated: 12, campaignCompleted: 10, holdingPoint: 1500000, withdrawalPoint: 132500000, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 3, nickname: "박철수", channels: ["instagram", "youtube"], division: "INFLUENCER", lastLoginAt: "2026-03-18T16:30:00+09:00", createdAt: "2025-05-20T11:00:00+09:00", campaignParticipated: 25, campaignCompleted: 22, holdingPoint: 350000, withdrawalPoint: 500000, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 4, nickname: "이수진", channels: ["blog", "instagram"], division: "NORMAL", lastLoginAt: "2026-02-01T10:00:00+09:00", createdAt: "2025-08-10T09:00:00+09:00", campaignParticipated: 3, campaignCompleted: 2, holdingPoint: 15000, withdrawalPoint: 10000, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 5, nickname: "정민호", channels: ["youtube"], division: "SUPPORTERS", lastLoginAt: "2026-03-20T11:00:00+09:00", createdAt: "2025-09-01T09:00:00+09:00", campaignParticipated: 8, campaignCompleted: 7, holdingPoint: 95000, withdrawalPoint: 60000, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 6, nickname: "한지은", channels: ["blog", "clip"], division: "NORMAL", lastLoginAt: "2026-03-19T09:30:00+09:00", createdAt: "2025-10-15T09:00:00+09:00", campaignParticipated: 6, campaignCompleted: 5, holdingPoint: 45000, withdrawalPoint: 25000, memberType: "RESTRICTED", status: "ACTIVE" },
      { userId: 7, nickname: "최동욱", channels: ["instagram"], division: "NORMAL", lastLoginAt: "2026-01-05T10:00:00+09:00", createdAt: "2025-04-01T09:00:00+09:00", campaignParticipated: 2, campaignCompleted: 1, holdingPoint: 5000, withdrawalPoint: 0, memberType: "NORMAL", status: "WITHDRAW" },
      { userId: 8, nickname: "송미래", channels: ["blog", "instagram", "youtube"], division: "INFLUENCER", lastLoginAt: "2026-03-22T15:00:00+09:00", createdAt: "2025-03-15T09:00:00+09:00", campaignParticipated: 30, campaignCompleted: 28, holdingPoint: 500000, withdrawalPoint: 1200000, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 9, nickname: "임태영", channels: ["clip"], division: "NORMAL", lastLoginAt: "2026-03-21T12:00:00+09:00", createdAt: "2026-01-05T09:00:00+09:00", campaignParticipated: 1, campaignCompleted: 0, holdingPoint: 0, withdrawalPoint: 0, memberType: "NORMAL", status: "ACTIVE" },
      { userId: 10, nickname: "강서연", channels: ["blog", "instagram"], division: "SUPPORTERS", lastLoginAt: "2026-03-17T10:00:00+09:00", createdAt: "2025-11-01T09:00:00+09:00", campaignParticipated: 10, campaignCompleted: 9, holdingPoint: 75000, withdrawalPoint: 45000, memberType: "NORMAL", status: "ACTIVE" },
    ];
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: { totalCount: reviewersList.length, reviewers: reviewersList },
    });
  }

  // ============ GET /api/admin/reviewers/download ============
  // GA-06: 리뷰어 목록 다운로드
  if (req.method === "GET" && req.path === "/api/admin/reviewers/download") {
    return res.status(200).json({ result: "OK", message: "다운로드 준비 완료" });
  }

  // ============ GET /api/admin/partners/stats ============
  // GA-08: 파트너 통계
  if (req.method === "GET" && req.path === "/api/admin/partners/stats") {
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: { monthlyNew: 1, total: 10, monthlyActive: 6, dormant: 4 },
    });
  }

  // ============ GET /api/admin/partners/download ============
  if (req.method === "GET" && req.path === "/api/admin/partners/download") {
    return res.status(200).json({ result: "OK", message: "다운로드 준비 완료" });
  }

  // ============ GET /campaigns?partner_id=X ============
  // 파트너 캠페인 조회: admin partnerId → 실제 campaign partner_id(userId) 매핑
  // GA/SA 파트너 상세페이지에서 캠페인 진행 내역 모달용
  if (req.method === "GET" && req.path === "/campaigns" && req.query.partner_id) {
    var queryPartnerId = Number(req.query.partner_id);
    // admin partnerId → 실제 campaign partner_id 매핑
    // GA 목록: partnerId 1 = 청명종합(userId 501), partnerId 2 = 마크엑스(test@test.com, 세션 501)
    // 캠페인 partner_id: 501(test@test.com), 502(14건), 1001(8건), 1005(6건)
    var PARTNER_USER_MAP = { 1: 502, 2: 501, 3: 1001, 4: 1005, 5: 505, 6: 506, 7: 507, 8: 508 };
    var mappedPartnerId = PARTNER_USER_MAP[queryPartnerId] || queryPartnerId;
    var allCampaigns = getCampaigns();
    var partnerCampaigns = allCampaigns.filter(function(c) {
      return c.partner_id == mappedPartnerId || c.partner_id == queryPartnerId;
    });
    return res.status(200).json(partnerCampaigns);
  }

  // ============ GET /api/admin/partners/:id/campaigns ============
  // GA-09: 파트너 캠페인 진행 내역 (API 경로)
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/partners\/\d+\/campaigns$/)) {
    var adminPartnerId = Number(req.path.split("/")[4]);
    var PARTNER_USER_MAP2 = { 1: 502, 2: 501, 3: 1001, 4: 1005, 5: 505, 6: 506, 7: 507, 8: 508 };
    var mappedId2 = PARTNER_USER_MAP2[adminPartnerId] || adminPartnerId;
    var allCampaigns2 = getCampaigns();
    var partnerCampaigns2 = allCampaigns2.filter(function(c) {
      return c.partner_id == mappedId2 || c.partner_id == adminPartnerId;
    });
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        totalCount: partnerCampaigns2.length,
        campaigns: partnerCampaigns2.map(function(c) {
          var channelName = (c.requiredPlatform && c.requiredPlatform.channelName) || "NAVER_BLOG";
          return {
            campaignId: c.id,
            campaignTitle: c.title,
            status: c.status,
            type: c.type || "DELIVERY",
            channel: channelName,
            rewardPoint: (c.reward && c.reward.extraRewardPoint) || 0,
          };
        }),
      },
    });
  }

  // ============ GET /api/admin/partners/:id/penalties ============
  // GA-09: 파트너 패널티 내역
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/partners\/\d+\/penalties$/)) {
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        totalCount: 1,
        penalties: [
          { penaltyHistoryId: 20, penaltyCode: "W006", penaltyReason: "게시 후 삭제", penaltyScore: 20, imposeType: "ADMIN", createdAt: "2026-01-20T14:00:00+09:00", currentStatus: "경고" },
        ],
      },
    });
  }

  // ============ GET /api/admin/partners/:id/business-license ============
  // GA-09: 사업자등록증 다운로드
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/partners\/\d+\/business-license$/)) {
    return res.status(200).json({ result: "OK", message: "사업자등록증 다운로드" });
  }

  // ============ GET /api/admin/partners/:id ============
  // GA-09: 파트너 상세 조회
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/partners\/\d+$/)) {
    var ptId = Number(req.path.split("/").pop());
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        basicInfo: {
          userId: ptId + 400, partnerId: ptId, status: "ACTIVE",
          profileImageUrl: null, businessName: "테스트파트너" + ptId,
          businessType: "CORPORATE", email: "partner" + ptId + "@test.com",
          phoneNum: "010-9876-" + String(ptId).padStart(4, "0"),
          address: "서울시 서초구 서초대로 " + ptId,
        },
        activityInfo: {
          campaignInProgress: 2, campaignCompleted: 10, penaltyCount: 1,
          lastLoginAt: "2026-03-20T09:00:00+09:00", createdAt: "2025-09-15T10:00:00+09:00",
          pointBalance: 500000, pointPaid: 1500000,
        },
        businessInfo: {
          businessName: "테스트파트너" + ptId, ceoName: "김대표" + ptId,
          businessNumber: "123-45-6789" + ptId,
          businessLicenseUrl: null,
        },
        contactInfo: { csNumber: "010-1111-" + String(ptId).padStart(4, "0") },
      },
    });
  }

  // ============ GET /api/admin/partners ============
  // GA-08: 파트너 목록 조회
  if (req.method === "GET" && (req.path === "/api/admin/partners" || req.path === "/admin/partners")) {
    var partnersList = [
      { partnerId: 1, userId: 501, businessName: "주식회사 청명종합광고기획", ceoName: "김민회", businessType: "CORPORATE", businessNumber: "122-86-45790", email: "contact@cmcm.co.kr", phoneNum: "02-1234-5678", grade: "NORMAL", status: "ACTIVE", campaignCount: 15, penaltyCount: 3, createdAt: "2025-12-07T10:20:00+09:00", lastLoginAt: "2026-01-18T14:30:00+09:00" },
      { partnerId: 2, userId: 502, businessName: "마크엑스컴퍼니", ceoName: "이사장", businessType: "CORPORATE", businessNumber: "123-45-67890", email: "test@test.com", phoneNum: "010-1234-5678", grade: "EXCELLENT", status: "ACTIVE", campaignCount: 25, penaltyCount: 0, createdAt: "2025-06-01T09:00:00+09:00", lastLoginAt: "2026-03-20T10:00:00+09:00" },
      { partnerId: 3, userId: 503, businessName: "테스트컴퍼니", ceoName: "김테스트", businessType: "INDIVIDUAL", businessNumber: "234-56-78901", email: "aaaa@test.com", phoneNum: "010-5555-5555", grade: "NORMAL", status: "ACTIVE", campaignCount: 3, penaltyCount: 0, createdAt: "2026-01-15T09:00:00+09:00", lastLoginAt: "2026-03-22T15:00:00+09:00" },
      { partnerId: 4, userId: 504, businessName: "카페베네", ceoName: "박카페", businessType: "CORPORATE", businessNumber: "345-67-89012", email: "cafe@bene.com", phoneNum: "02-9876-5432", grade: "CAUTION", status: "ACTIVE", campaignCount: 8, penaltyCount: 1, createdAt: "2025-08-20T09:00:00+09:00", lastLoginAt: "2026-03-15T11:00:00+09:00" },
      { partnerId: 5, userId: 505, businessName: "뷰티랩", ceoName: "정뷰티", businessType: "INDIVIDUAL", businessNumber: "456-78-90123", email: "beauty@lab.com", phoneNum: "010-3333-4444", grade: "NORMAL", status: "ACTIVE", campaignCount: 12, penaltyCount: 0, createdAt: "2025-10-01T09:00:00+09:00", lastLoginAt: "2026-03-18T09:30:00+09:00" },
      { partnerId: 6, userId: 506, businessName: "테크코리아", ceoName: "최테크", businessType: "CORPORATE", businessNumber: "567-89-01234", email: "tech@korea.com", phoneNum: "02-5555-6666", grade: "WARNING", status: "PAUSED", campaignCount: 5, penaltyCount: 2, createdAt: "2025-07-15T09:00:00+09:00", lastLoginAt: "2026-02-28T10:00:00+09:00" },
      { partnerId: 7, userId: 507, businessName: "소셜플러스", ceoName: "한소셜", businessType: "CORPORATE", businessNumber: "678-90-12345", email: "social@plus.com", phoneNum: "02-7777-8888", grade: "RESTRICTED", status: "BLOCKED", campaignCount: 2, penaltyCount: 5, createdAt: "2025-09-01T09:00:00+09:00", lastLoginAt: "2026-01-05T10:00:00+09:00" },
      { partnerId: 8, userId: 508, businessName: "맛있는식당", ceoName: "오맛집", businessType: "INDIVIDUAL", businessNumber: "789-01-23456", email: "food@yummy.com", phoneNum: "010-8888-9999", grade: "NORMAL", status: "WITHDRAW", campaignCount: 1, penaltyCount: 0, createdAt: "2025-11-20T09:00:00+09:00", lastLoginAt: "2026-01-10T10:00:00+09:00" },
      { partnerId: 9, userId: 509, businessName: "커피빈즈", ceoName: "강커피", businessType: "INDIVIDUAL", businessNumber: "890-12-34567", email: "coffee@beans.com", phoneNum: "010-2222-3333", grade: "EXCELLENT", status: "ACTIVE", campaignCount: 18, penaltyCount: 0, createdAt: "2025-05-10T09:00:00+09:00", lastLoginAt: "2026-03-21T14:00:00+09:00" },
      { partnerId: 10, userId: 510, businessName: "프리미엄마케팅", ceoName: "류마케팅", businessType: "CORPORATE", businessNumber: "901-23-45678", email: "premium@marketing.com", phoneNum: "02-1111-2222", grade: "NORMAL", status: "ACTIVE", campaignCount: 7, penaltyCount: 1, createdAt: "2025-04-01T09:00:00+09:00", lastLoginAt: "2026-03-19T16:00:00+09:00" },
    ];
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: { totalCount: partnersList.length, partners: partnersList },
    });
  }

  // ============ GET /api/admin/reports/codes ============
  if (req.method === "GET" && req.path === "/api/admin/reports/codes") {
    const codes = [
      { code: "W001", targetType: "리뷰어", label: "선정 후 취소" },
      { code: "W002", targetType: "리뷰어", label: "지각 제출" },
      { code: "W003", targetType: "리뷰어", label: "무단 이탈 · 노쇼" },
      { code: "W004", targetType: "리뷰어", label: "노출 기간 불이행" },
      { code: "W005", targetType: "리뷰어", label: "수정 요청 불이행" },
      { code: "W006", targetType: "파트너", label: "게시 후 취소" },
      { code: "W007", targetType: "파트너", label: "부적절한 캠페인 게시" },
      { code: "W008", targetType: "파트너", label: "공정위 위반 요청" },
      { code: "W009", targetType: "시스템", label: "비정상 요청 반복" },
      { code: "W010", targetType: "시스템", label: "중복 계정 탐지" },
      { code: "W011", targetType: "시스템", label: "콘텐츠 중복 탐지" },
      { code: "W012", targetType: "시스템", label: "비정상 접근 기록" },
      { code: "W013", targetType: "기타", label: "그외 비매너 행위" },
    ];
    return res.status(200).json({ result: "OK", data: { codes } });
  }

  // ============ GET /api/admin/reports/stats ============
  if (req.method === "GET" && req.path === "/api/admin/reports/stats") {
    // report_history에서 코드별 집계
    let reports = [];
    if (db) {
      try { reports = db.get("report_history").value() || []; } catch (_e) { /* fallback */ }
    }
    if (!reports.length) {
      try { reports = require("./db.json").report_history || []; } catch (_e) { /* fallback */ }
    }

    // 날짜 필터 적용
    const { startDate, endDate } = req.query;
    let filtered = reports;
    if (startDate || endDate) {
      filtered = reports.filter(r => {
        const d = (r.processed_date || r.processedAt || "").split(" ")[0];
        if (startDate && d < startDate) return false;
        if (endDate && d > endDate) return false;
        return true;
      });
    }

    const statsMap = {};
    for (const r of filtered) {
      const code = r.report_code || r.reportCode;
      if (code) statsMap[code] = (statsMap[code] || 0) + 1;
    }
    const stats = Object.entries(statsMap).map(([code, count]) => ({ code, count }));

    return res.status(200).json({ result: "OK", data: { stats } });
  }

  // ============ GET /api/admin/reports ============
  if (req.method === "GET" && req.path === "/api/admin/reports") {
    let reports = [];
    if (db) {
      try { reports = db.get("report_history").value() || []; } catch (_e) { /* fallback */ }
    }
    if (!reports.length) {
      try { reports = require("./db.json").report_history || []; } catch (_e) { /* fallback */ }
    }

    const { startDate, endDate, reportCode, keyword, sort, order } = req.query;

    // 필터링
    let filtered = reports.filter(r => {
      const d = (r.processed_date || r.processedAt || "").split(" ")[0];
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      const code = r.report_code || r.reportCode;
      if (reportCode && code !== reportCode) return false;
      if (keyword) {
        const kw = keyword.toLowerCase();
        const name = (r.campaign_name || r.campaignTitle || "").toLowerCase();
        const target = (r.target || r.targetName || "").toLowerCase();
        const number = (r.campaign_number || r.reportNumber || "").toLowerCase();
        if (!name.includes(kw) && !target.includes(kw) && !number.includes(kw)) return false;
      }
      return true;
    });

    // 정렬
    const sortField = sort || "processedAt";
    const sortOrder = order || "desc";
    filtered.sort((a, b) => {
      let va, vb;
      if (sortField === "reportCount") {
        va = a.report_count ?? a.reportCount ?? 0;
        vb = b.report_count ?? b.reportCount ?? 0;
      } else {
        va = a.processed_date || a.processedAt || "";
        vb = b.processed_date || b.processedAt || "";
      }
      if (va < vb) return sortOrder === "asc" ? -1 : 1;
      if (va > vb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // mock 데이터 → 백엔드 응답 형식으로 변환
    const mapped = filtered.map((r, idx) => ({
      reportNumber: r.campaign_number || r.reportNumber || String(r.id),
      campaignTitle: r.campaign_name || r.campaignTitle || "",
      targetName: r.target || r.targetName || "",
      targetType: r.targetType || "REVIEWER",
      targetUserId: r.target_user_id || r.targetUserId || (2000 + (r.id || idx)),
      inspector: r.inspector || "",
      inspectorType: r.inspectorType || "ADMIN",
      reportCode: r.report_code || r.reportCode || "",
      reportCodeLabel: r.report_reason || r.reportCodeLabel || "",
      reportCount: r.report_count ?? r.reportCount ?? 1,
      processedAt: (r.processed_date || r.processedAt || "").includes("T")
        ? r.processed_date || r.processedAt
        : (r.processed_date || r.processedAt || "").replace(" ", "T") + ":00",
    }));

    return res.status(200).json({ result: "OK", data: { reports: mapped } });
  }

  // ============ POST /api/admin/login ============
  // GA/SA 관리자 로그인
  if (req.method === "POST" && (req.path === "/api/admin/login" || req.path === "/admin/login")) {
    const { email, password } = req.body || {};

    const adminAccounts = {
      "manager_ga@test.com": {
        password: "1234",
        id: "admin_ga_001",
        name: "김관리",
        role: "manager_ga",
        admin_level: "GA",
        status: "ACTIVE",
      },
      "manager_sa@test.com": {
        password: "1234",
        id: "admin_sa_001",
        name: "박최고",
        role: "manager_sa",
        admin_level: "SA",
        status: "ACTIVE",
      },
      "blocked_ga@test.com": {
        password: "1234",
        id: "admin_ga_002",
        name: "차단관리자",
        role: "manager_ga",
        admin_level: "GA",
        status: "BLOCKED",
      },
      "banned_ga@test.com": {
        password: "1234",
        id: "admin_ga_003",
        name: "정지관리자",
        role: "manager_ga",
        admin_level: "GA",
        status: "BANNED",
      },
    };

    const account = adminAccounts[email];

    if (!account) {
      return res.status(401).json({
        result: "ERROR",
        error: { code: "INVALID_CREDENTIALS", message: "아이디 또는 비밀번호가 일치하지 않습니다." },
      });
    }

    if (account.password !== password) {
      return res.status(401).json({
        result: "ERROR",
        error: { code: "INVALID_CREDENTIALS", message: "아이디 또는 비밀번호가 일치하지 않습니다." },
      });
    }

    if (account.status === "BANNED") {
      return res.status(403).json({
        result: "ERROR",
        error: { code: "ACCOUNT_BANNED", message: "정지되었거나 탈퇴된 계정입니다." },
      });
    }

    if (account.status === "BLOCKED") {
      return res.status(200).json({
        result: "OK",
        user: {
          id: account.id,
          email,
          name: account.name,
          role: account.role,
          admin_level: account.admin_level,
          status: "BLOCKED",
        },
        token: "mock_admin_token_" + account.id + "_" + Date.now(),
      });
    }

    // 관리자 세션 업데이트
    adminSession = { id: account.id, email, name: account.name, role: account.role };
    adminNotificationsDeleted = false; // 세션 변경 시 삭제 상태 초기화
    saAdminNotificationsDeleted = false;

    return res.status(200).json({
      result: "OK",
      user: {
        id: account.id,
        email,
        name: account.name,
        role: account.role,
        admin_level: account.admin_level,
        status: "ACTIVE",
      },
      token: "mock_admin_token_" + account.id + "_" + Date.now(),
    });
  }

  // ============ POST /partner/login ============
  if (req.method === "POST" && req.path === "/partner/login") {
    const { email, password } = req.body;

    // 특수 테스트 계정 (BLOCKED/BANNED 시나리오용)
    const specialAccounts = {
      "blocked@test.com": {
        password: "1234",
        status: "BLOCKED",
        userId: 1003,
        name: "차단유저",
        phoneNum: "010-0000-0000",
        partnerId: 503,
        businessName: "차단업체",
        ceoName: "차단유저",
        businessNumber: "000-00-00000",
        grade: "NORMAL",
      },
      "banned@test.com": {
        password: "1234",
        status: "BANNED",
        userId: 1004,
        name: "정지유저",
        phoneNum: "010-0000-0000",
        partnerId: 504,
        businessName: "정지업체",
        ceoName: "정지유저",
        businessNumber: "000-00-00000",
        grade: "NORMAL",
      },
    };

    // GA 파트너 목록 계정 (전부 로그인 가능)
    var gaPartnerAccounts = {
      "contact@cmcm.co.kr": { password: "1234", status: "ACTIVE", userId: 501, name: "김민회", phoneNum: "02-1234-5678", partnerId: 1, businessName: "주식회사 청명종합광고기획", ceoName: "김민회", businessNumber: "122-86-45790", grade: "NORMAL" },
      "test@test.com": { password: "1234", status: "ACTIVE", userId: 502, name: "이사장", phoneNum: "010-1234-5678", partnerId: 2, businessName: "마크엑스컴퍼니", ceoName: "이사장", businessNumber: "123-45-67890", grade: "EXCELLENT" },
      "aaaa@test.com": { password: "akzmdprtm1!", status: "ACTIVE", userId: 503, name: "김테스트", phoneNum: "010-5555-5555", partnerId: 3, businessName: "테스트컴퍼니", ceoName: "김테스트", businessNumber: "234-56-78901", grade: "NORMAL" },
      "cafe@bene.com": { password: "1234", status: "ACTIVE", userId: 504, name: "박카페", phoneNum: "02-9876-5432", partnerId: 4, businessName: "카페베네", ceoName: "박카페", businessNumber: "345-67-89012", grade: "CAUTION" },
      "beauty@lab.com": { password: "1234", status: "ACTIVE", userId: 505, name: "정뷰티", phoneNum: "010-3333-4444", partnerId: 5, businessName: "뷰티랩", ceoName: "정뷰티", businessNumber: "456-78-90123", grade: "NORMAL" },
      "tech@korea.com": { password: "1234", status: "PAUSED", userId: 506, name: "최테크", phoneNum: "02-5555-6666", partnerId: 6, businessName: "테크코리아", ceoName: "최테크", businessNumber: "567-89-01234", grade: "WARNING" },
      "social@plus.com": { password: "1234", status: "BLOCKED", userId: 507, name: "한소셜", phoneNum: "02-7777-8888", partnerId: 7, businessName: "소셜플러스", ceoName: "한소셜", businessNumber: "678-90-12345", grade: "RESTRICTED" },
      "food@yummy.com": { password: "1234", status: "WITHDRAW", userId: 508, name: "오맛집", phoneNum: "010-8888-9999", partnerId: 8, businessName: "맛있는식당", ceoName: "오맛집", businessNumber: "789-01-23456", grade: "NORMAL" },
      "coffee@beans.com": { password: "1234", status: "ACTIVE", userId: 509, name: "강커피", phoneNum: "010-2222-3333", partnerId: 9, businessName: "커피빈즈", ceoName: "강커피", businessNumber: "890-12-34567", grade: "EXCELLENT" },
      "premium@marketing.com": { password: "1234", status: "ACTIVE", userId: 510, name: "류마케팅", phoneNum: "02-1111-2222", partnerId: 10, businessName: "프리미엄마케팅", ceoName: "류마케팅", businessNumber: "901-23-45678", grade: "NORMAL" },
    };

    // 1) 특수 계정 체크
    let account = specialAccounts[email];

    // 2) GA 파트너 목록 계정 체크
    if (!account && gaPartnerAccounts[email]) {
      account = gaPartnerAccounts[email];
    }

    // 3) db.json partner_mypage에서 계정 조회
    if (!account && db) {
      const profiles = db.get("partner_mypage").value() || [];
      const profile = profiles.find((p) => p.email === email);
      if (profile) {
        account = {
          password: profile.password || "1234",
          status: "ACTIVE",
          userId: profile.id === "partner_test_001" ? 1001 : profile.id === "partner_test_002" ? 1002 : profile.id === "partner_test_003" ? 1005 : 1001,
          name: profile.name,
          phoneNum: profile.phone,
          partnerId: profile.id === "partner_test_001" ? 501 : profile.id === "partner_test_002" ? 502 : profile.id === "partner_test_003" ? 505 : 501,
          businessName: profile.businessName,
          ceoName: profile.representativeName || profile.name,
          businessNumber: profile.businessNumber,
          grade: "NORMAL",
        };
      }
    }

    // 계정 없음 (404)
    if (!account) {
      return res.status(404).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "USER_NOT_FOUND", message: "가입 정보가 없습니다." },
      });
    }

    // 비밀번호 불일치 (401)
    if (account.password !== password) {
      return res.status(401).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "INVALID_CREDENTIALS", message: "이메일 또는 비밀번호가 올바르지 않습니다." },
      });
    }

    // 정지/탈퇴 계정 (403)
    if (account.status === "BANNED") {
      return res.status(403).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "ACCOUNT_RESTRICTED", message: "이용이 제한된 계정입니다." },
      });
    }

    // 로그인 성공 시 세션 메모리 업데이트
    currentSession = {
      userId: account.userId,
      partnerId: account.partnerId,
      email: email,
      name: account.name,
      businessName: account.businessName,
      status: account.status || "ACTIVE",
    };

    // 성공 (200) — BLOCKED도 200 반환 (프론트에서 status로 분기)
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        user: {
          userId: account.userId,
          role: "PARTNER",
          email: email,
          name: account.name,
          phoneNum: account.phoneNum,
          status: account.status,
        },
        partner: {
          partnerId: account.partnerId,
          businessName: account.businessName,
          ceoName: account.ceoName,
          businessNumber: account.businessNumber,
          grade: account.grade,
        },
        next: {
          action: "REDIRECT",
          redirectPath: "/partner/campaign_management",
        },
      },
    });
  }

  // ============ GET /partner/session ============
  if (req.method === "GET" && req.path === "/partner/session") {
    // 로그아웃 후 세션 없음 → UNAUTHENTICATED
    if (!currentSession) {
      return res.status(200).json({
        result: "UNAUTHENTICATED",
        generatedAt: new Date().toISOString(),
      });
    }
    // 로그인된 계정 정보로 세션 반환 (currentSession 기반)
    const sessionAccounts = {
      501: {
        phoneNum: "010-1234-5678",
        address: "인천광역시 남동구 장제로 14",
        addressDetail: "2층 201호",
        postNumber: 15011,
        ceoName: "홍길동",
        businessNumber: "123-45-67890",
        csNumber: "010-1212-1541",
      },
      502: {
        phoneNum: "010-9876-5432",
        address: "서울특별시 강남구 테헤란로 123",
        addressDetail: "5층",
        postNumber: 06142,
        ceoName: "유가수",
        businessNumber: "246-87-04020",
        csNumber: "02-1234-5678",
      },
    };
    const acct = sessionAccounts[currentSession.partnerId] || sessionAccounts[501];

    return res.status(200).json({
      result: "AUTHENTICATED",
      generatedAt: new Date().toISOString(),
      user: {
        userId: currentSession.userId,
        role: "PARTNER",
        email: currentSession.email,
        name: currentSession.name,
        phoneNum: acct.phoneNum,
        address: acct.address,
        addressDetail: acct.addressDetail,
        postNumber: acct.postNumber,
        status: currentSession.status || "ACTIVE",
      },
      partner: {
        partnerId: currentSession.partnerId,
        businessName: currentSession.businessName,
        ceoName: acct.ceoName,
        businessNumber: acct.businessNumber,
        csNumber: acct.csNumber,
        grade: "NORMAL",
      },
    });
  }

  // ============ POST /partner/logout ============
  if (req.method === "POST" && req.path === "/partner/logout") {
    currentSession = null;
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
    });
  }

  // ============ POST /partner/auth/find-id ============
  if (req.method === "POST" && req.path === "/partner/auth/find-id") {
    const phone = (req.body.phone || "").replace(/-/g, "");
    // 정지 계정 체크
    if (phone === "01099999999") {
      return res.status(403).json({
        result: "ERROR",
        error: { code: "BLOCKED_ACCOUNT", message: "정지되었거나 탈퇴된 계정입니다." },
      });
    }
    // db.json partner_mypage에서 전화번호로 계정 검색
    const profiles = db ? db.get("partner_mypage").value() : [];
    const found = profiles.find((p) => (p.phone || "").replace(/-/g, "") === phone);
    if (found) {
      return res.status(200).json({
        result: "OK",
        email: found.email,
        signupDate: found.joinDate || "2025-01-15",
      });
    }
    return res.status(404).json({
      result: "ERROR",
      error: { code: "NOT_FOUND", message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다." },
    });
  }

  // ============ POST /partner/auth/find-password ============
  if (req.method === "POST" && req.path === "/partner/auth/find-password") {
    const email = req.body.email || "";
    const phone = (req.body.phone || "").replace(/-/g, "");
    // 정지 계정 체크
    if (phone === "01099999999") {
      return res.status(403).json({
        result: "ERROR",
        error: { code: "BLOCKED_ACCOUNT", message: "정지되었거나 탈퇴된 계정입니다." },
      });
    }
    // db.json partner_mypage에서 이메일 + 전화번호 조합으로 검색
    const profiles = db ? db.get("partner_mypage").value() : [];
    const found = profiles.find(
      (p) => p.email === email && (p.phone || "").replace(/-/g, "") === phone
    );
    if (found) {
      return res.status(200).json({ result: "OK" });
    }
    return res.status(404).json({
      result: "ERROR",
      error: { code: "NOT_FOUND", message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다." },
    });
  }

  // ============ POST /partner/auth/reset-password ============
  // 비밀번호 찾기 후 새 비밀번호 설정 (현재 비밀번호 불필요)
  if (req.method === "POST" && req.path === "/partner/auth/reset-password") {
    const { email, newPassword } = req.body || {};
    const profiles = db ? db.get("partner_mypage").value() : [];
    const found = profiles.find((p) => p.email === email);
    if (!found) {
      return res.status(404).json({
        result: "ERROR",
        error: { code: "NOT_FOUND", message: "계정을 찾을 수 없습니다." },
      });
    }
    return res.status(200).json({ result: "OK" });
  }

  // ============ GET /partner/signup ============
  if (req.method === "GET" && req.path === "/partner/signup") {
    const db = require("./db.json");
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        terms: db.partner_signup_terms || [],
        banks: db.partner_signup_banks || [],
      },
    });
  }

  // ============ POST /partner/signup ============
  if (req.method === "POST" && req.path === "/partner/signup") {
    const email = req.body.email || (req.fields && req.fields.email);
    const name = req.body.name || (req.fields && req.fields.name);
    const phoneNum = req.body.phoneNum || (req.fields && req.fields.phoneNum);
    const businessName = req.body.businessName || (req.fields && req.fields.businessName);
    const ceoName = req.body.ceoName || (req.fields && req.fields.ceoName);
    const businessNumber = req.body.businessNumber || (req.fields && req.fields.businessNumber);
    const postNumber = req.body.postNumber || (req.fields && req.fields.postNumber);
    const address = req.body.address || (req.fields && req.fields.address);
    const addressDetail = req.body.addressDetail || (req.fields && req.fields.addressDetail);
    const csNumber = req.body.csNumber || (req.fields && req.fields.csNumber);

    // 이메일 중복 체크 (db.json partner_mypage에서 조회)
    const existingProfiles = db ? db.get("partner_mypage").value() || [] : [];
    const specialEmails = ["blocked@test.com", "banned@test.com"];
    const isDuplicate = existingProfiles.some((p) => p.email === email) || specialEmails.includes(email);
    if (isDuplicate) {
      return res.status(409).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "DUPLICATE_EMAIL", message: "이미 사용 중인 이메일입니다." },
      });
    }

    // 성공 응답
    const userId = 2000 + Math.floor(Math.random() * 1000);
    const partnerId = 600 + Math.floor(Math.random() * 100);
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        user: {
          userId,
          email: email || "new@partner.com",
          name: name || "신규파트너",
          phoneNum: phoneNum || "01012345678",
          address: address || "",
          addressDetail: addressDetail || "",
          postNumber: Number(postNumber) || 0,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        },
        partner: {
          partnerId,
          businessName: businessName || "",
          ceoName: ceoName || "",
          businessNumber: businessNumber || "",
          csNumber: csNumber || "",
          grade: "NORMAL",
          businessLicenseFile: {
            fileId: 100 + Math.floor(Math.random() * 100),
            fileUrl: "https://cdn.example.com/files/mock_license.jpg",
          },
        },
        next: {
          action: "REDIRECT",
          redirectPath: "/partner/signup/complete",
        },
      },
    });
  }

  // ============ GET /partner/search ============
  if (req.method === "GET" && (req.path === "/partner/search" || req.url.startsWith("/partner/search"))) {
    const allCampaigns = getCampaigns();
    const keyword = (req.query.keyword || "").toLowerCase();

    const filtered = keyword
      ? allCampaigns.filter((c) => (c.title || "").toLowerCase().includes(keyword))
      : allCampaigns;

    const campaigns = filtered.map((c) => ({
      campaignId: c.campaignId || c.id,
      type: c.type,
      status: c.status,
      title: c.title,
      thumbnail: c.thumbnail || { url: c.thumbnailUrl || "" },
      category: c.category || { categoryId: 1, categoryName: "기타" },
      requiredPlatform: c.requiredPlatform || { channelId: 1, channelName: "BLOG" },
      recruit: c.recruit || { recruitLimit: c.recruitLimit || 10, recruitStartAt: c.recruitStartAt, recruitEndAt: c.recruitEndAt },
      metrics: c.metrics || { appliedCount: c.appliedCount || 0, selectedCount: 0, applicationRate: 0 },
      reward: c.reward || { extraRewardPoint: 0, paymentRewardPoint: 0 },
    }));

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      keyword: req.query.keyword || "",
      totalCount: campaigns.length,
      campaigns,
    });
  }

  // ============ GET /partner/boards/faqs ============
  if (req.method === "GET" && req.path === "/partner/boards/faqs") {
    const db = require("./db.json");
    const allFaqs = db.partner_faqs || [];
    const boardCategory = req.query.board_category;

    const filtered = boardCategory && boardCategory !== "ALL"
      ? allFaqs.filter((f) => f.boardCategory === boardCategory)
      : allFaqs;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: filtered.length,
      items: filtered,
    });
  }

  // ============ GET /partner/boards/notices ============
  if (req.method === "GET" && req.path === "/partner/boards/notices") {
    const db = require("./db.json");
    const allNotices = db.partner_notices || [];
    const boardCategory = req.query.board_category;

    const filtered = boardCategory && boardCategory !== "ALL"
      ? allNotices.filter((n) => n.boardCategory === boardCategory)
      : allNotices;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: filtered.length,
      items: filtered,
    });
  }

  // ============ GET /partner/boards/notices/:id ============
  if (req.method === "GET" && req.path.match(/^\/partner\/boards\/notices\/\d+$/)) {
    const db = require("./db.json");
    const allNotices = db.partner_notices || [];
    const boardId = Number(req.path.split("/").pop());
    const notice = allNotices.find((n) => n.boardId === boardId);

    if (!notice) {
      return res.status(404).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "NOT_FOUND", message: "존재하지 않는 공지사항입니다." },
      });
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      item: notice,
    });
  }

  // ============ 세션 체크 가드 (이하 인증 필요 엔드포인트) ============
  // 로그아웃 후 currentSession이 null이면 401 반환
  if (!currentSession && req.path.startsWith("/partner/") &&
      !["/partner/login", "/partner/session", "/partner/logout",
        "/partner/auth/find-id", "/partner/auth/find-password",
        "/partner/signup", "/partner/search", "/partner/dashboard",
      ].includes(req.path) && !req.path.startsWith("/partner/boards/")) {
    return res.status(401).json({
      result: "ERROR",
      generatedAt: new Date().toISOString(),
      error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." },
    });
  }

  // ============ GET /partner/{TYPE} (유형별 캠페인 조회 — API 08) ============
  const typeFilterMatch = req.method === "GET" && req.path.match(/^\/partner\/(DELIVERY|VISIT|PURCHASE|REPORTER|MISSION)$/);
  if (typeFilterMatch) {
    const type = typeFilterMatch[1];
    const campaigns = getCampaigns();
    let filtered = campaigns.filter((c) => {
      const cType = (c.type || "").toUpperCase();
      return cType === type || (type === "PURCHASE" && cType === "PURCHASE_REVIEW");
    });

    const { categoryId, channelId, status } = req.query;
    if (categoryId) filtered = filtered.filter((c) => String(c.category?.categoryId) === categoryId);
    if (channelId) filtered = filtered.filter((c) => String(c.requiredPlatform?.channelId) === channelId);
    if (status) filtered = filtered.filter((c) => c.status === status);

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      type,
      totalCount: filtered.length,
      campaigns: filtered,
    });
  }

  // ============ GET /partner/account/penalty ============
  // 23번 API: 파트너 패널티 내역 조회
  if (req.method === "GET" && req.path === "/partner/account/penalty") {
    const tab = req.query.tab || "warning";

    const penaltiesByTab = {
      warning: [
        { penaltyHistoryId: 1, penaltyCode: "W006", penaltyReason: "게시 후 삭제", penaltyDetail: "캠페인 오픈 후 일방적 취소", penaltyScore: 20, relatedCampaignId: 101, relatedCampaignTitle: "[배송형] 건강식품 체험단", imposedAt: "2026-02-15T10:30:00+09:00", imposerType: "SYSTEM" },
        { penaltyHistoryId: 2, penaltyCode: "W008", penaltyReason: "공정위 위반 요청", penaltyDetail: "공정위 필수 문구 삭제 요구", penaltyScore: 10, relatedCampaignId: 102, relatedCampaignTitle: "[방문형] 카페 방문 리뷰", imposedAt: "2026-03-01T14:00:00+09:00", imposerType: "ADMIN" },
        { penaltyHistoryId: 3, penaltyCode: "W006", penaltyReason: "게시 후 삭제", penaltyDetail: "리뷰어 선정 후 캠페인 삭제", penaltyScore: 20, relatedCampaignId: 103, relatedCampaignTitle: "[구매평] 스킨케어 구매 리뷰", imposedAt: "2026-03-10T09:00:00+09:00", imposerType: "SYSTEM" },
      ],
      caution: [
        { penaltyHistoryId: 4, penaltyCode: "W007", penaltyReason: "부적절한 캠페인 게시", penaltyDetail: "허위 광고성 문구 포함", penaltyScore: 50, relatedCampaignId: 104, relatedCampaignTitle: "[배송형] 다이어트 보조제 체험단", imposedAt: "2026-01-20T11:00:00+09:00", imposerType: "ADMIN" },
      ],
      blocked: [],
    };

    const penalties = penaltiesByTab[tab] || [];

    // 계정별 점수 분기
    const scores = {
      1001: { totalPenaltyScore: 50, warningCount: 3, cautionCount: 1, blockedCount: 0, currentGrade: "NORMAL" },
      1005: { totalPenaltyScore: 0, warningCount: 0, cautionCount: 0, blockedCount: 0, currentGrade: "EXCELLENT" },
    };
    const summary = scores[currentSession.userId] || scores[1001];

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      summary,
      penalties: currentSession.userId === 1005 ? [] : penalties,
    });
  }

  // ============ GET /partner/notifications ============
  if (req.method === "GET" && req.path === "/partner/notifications") {
    // 전체 삭제된 상태면 빈 배열 반환
    if (notificationsDeleted) {
      return res.status(200).json({
        result: "OK",
        items: [],
        nextCursor: null,
      });
    }

    const db = require("./db.json");
    // 현재 로그인 계정의 알림만 필터링
    const allItems = (db.partner_notifications || []).filter(
      (n) => n.userId === currentSession.userId
    );
    const cursor = req.query.cursor;
    const size = Number(req.query.size) || 20;

    // 커서 기반 페이지네이션
    let startIdx = 0;
    if (cursor) {
      const cursorId = Number(cursor);
      startIdx = allItems.findIndex((n) => n.notificationHistoryId === cursorId);
      if (startIdx === -1) startIdx = allItems.length;
      else startIdx += 1; // 커서 다음부터
    }

    const sliced = allItems.slice(startIdx, startIdx + size).map((item) => ({
      ...item,
      sentAt: item.sentAt || item.createdAt,
    }));
    const nextItem = allItems[startIdx + size];
    const nextCursor = nextItem ? String(nextItem.notificationHistoryId) : null;

    return res.status(200).json({
      result: "OK",
      items: sliced,
      nextCursor,
    });
  }

  // ============ DELETE /partner/notifications ============
  if (req.method === "DELETE" && req.path === "/partner/notifications") {
    notificationsDeleted = true;
    return res.status(200).json({
      result: "OK",
    });
  }

  // ============ 관리자(GA/SA) 알림 API ============

  // GET /api/admin/notifications — 알림 목록 조회
  if (req.method === "GET" && req.path === "/api/admin/notifications") {
    if (adminNotificationsDeleted) {
      return res.status(200).json({
        result: "OK",
        generatedAt: new Date().toISOString(),
        data: { totalCount: 0, unreadCount: 0, totalPages: 0, currentPage: 1, size: 20, notifications: [] },
      });
    }

    const dbData = require("./db.json");
    let items = (dbData.admin_notifications || []).filter(
      (n) => n.userId === adminSession.id
    );

    // 필터: category
    if (req.query.category) {
      items = items.filter((n) => n.category === req.query.category);
    }
    // 필터: isRead
    if (req.query.isRead !== undefined) {
      const isRead = req.query.isRead === "true";
      items = items.filter((n) => n.isRead === isRead);
    }

    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;
    const totalCount = items.length;
    const unreadCount = items.filter((n) => !n.isRead).length;
    const totalPages = Math.ceil(totalCount / size);
    const start = (page - 1) * size;
    const sliced = items.slice(start, start + size);

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { totalCount, unreadCount, totalPages, currentPage: page, size, notifications: sliced.map(({ userId, ...rest }) => rest) },
    });
  }

  // PATCH /api/admin/notifications/:id/read — 알림 읽음 처리
  if (req.method === "PATCH" && /^\/api\/admin\/notifications\/\d+\/read$/.test(req.path)) {
    return res.status(200).json({ result: "OK" });
  }

  // PATCH /api/admin/notifications/read-all — 전체 읽음 처리
  if (req.method === "PATCH" && req.path === "/api/admin/notifications/read-all") {
    return res.status(200).json({ result: "OK" });
  }

  // DELETE /api/admin/notifications/all — 전체 삭제
  if (req.method === "DELETE" && req.path === "/api/admin/notifications/all") {
    adminNotificationsDeleted = true;
    return res.status(200).json({ result: "OK" });
  }

  // DELETE /api/admin/notifications/:id — 개별 삭제
  if (req.method === "DELETE" && /^\/api\/admin\/notifications\/\d+$/.test(req.path)) {
    return res.status(200).json({ result: "OK" });
  }

  // ============ 카테고리 API ============

  /** community_categories 컬렉션에서 데이터 읽기 */
  function getCategories() {
    if (db) {
      try { return db.get("community_categories").value() || []; } catch (_e) { /* fallback */ }
    }
    return [];
  }

  // GET /api/admin/board-categories — 카테고리 목록 조회
  if (req.method === "GET" && req.path === "/api/admin/board-categories") {
    let categories = getCategories();
    const { division, keyword } = req.query;
    if (division) categories = categories.filter((c) => c.division === division);
    if (keyword) categories = categories.filter((c) => c.categoryName && c.categoryName.includes(keyword));
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { categories: categories.map(({ id, ...rest }) => ({ categoryId: rest.categoryId || id, ...rest })) },
    });
  }

  // GET /api/admin/board-categories/form — 카테고리 등록 폼 옵션 조회
  if (req.method === "GET" && req.path === "/api/admin/board-categories/form") {
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        divisions: [
          { value: "NOTICE", label: "공지사항" },
          { value: "QUESTIONS", label: "자주 묻는 질문" },
        ],
      },
    });
  }

  // GET /api/admin/board-categories/:id — 카테고리 상세 조회
  if (req.method === "GET" && /^\/api\/admin\/board-categories\/\d+$/.test(req.path)) {
    const catId = parseInt(req.path.split("/").pop(), 10);
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === catId);
    if (!cat) return res.status(404).json({ result: "ERROR", error: { code: "CATEGORY_NOT_FOUND", message: "카테고리를 찾을 수 없습니다" } });
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { categoryId: cat.categoryId || cat.id, division: cat.division, categoryName: cat.categoryName, boardCount: cat.boardCount || 0, createdAt: cat.createdAt, updatedAt: cat.updatedAt },
    });
  }

  // POST /api/admin/board-categories — 카테고리 등록
  if (req.method === "POST" && req.path === "/api/admin/board-categories") {
    const { division, categoryName } = req.body || {};
    if (!categoryName || categoryName.length < 2 || categoryName.length > 10) {
      return res.status(400).json({ result: "ERROR", error: { code: "INVALID_CATEGORY_NAME_LENGTH", message: "카테고리명은 2~10자 이내로 입력해주세요" } });
    }
    const categories = getCategories();
    const dup = categories.find((c) => c.division === division && c.categoryName === categoryName);
    if (dup) return res.status(409).json({ result: "ERROR", error: { code: "DUPLICATE_CATEGORY_NAME", message: "이미 존재하는 카테고리명입니다" } });
    const maxId = categories.reduce((m, c) => Math.max(m, c.categoryId || c.id || 0), 0);
    const now = new Date().toISOString();
    const newCat = { id: maxId + 1, categoryId: maxId + 1, division, categoryName, boardCount: 0, createdAt: now, updatedAt: now };
    if (db) { try { db.get("community_categories").push(newCat).write(); } catch (_e) { /* */ } }
    return res.status(200).json({ result: "OK", generatedAt: now, data: { categoryId: newCat.categoryId, division, categoryName, createdAt: now, updatedAt: now } });
  }

  // PUT /api/admin/board-categories/:id — 카테고리 수정
  if (req.method === "PUT" && /^\/api\/admin\/board-categories\/\d+$/.test(req.path)) {
    const catId = parseInt(req.path.split("/").pop(), 10);
    const { categoryName } = req.body || {};
    if (!categoryName || categoryName.length < 2 || categoryName.length > 10) {
      return res.status(400).json({ result: "ERROR", error: { code: "INVALID_CATEGORY_NAME_LENGTH", message: "카테고리명은 2~10자 이내로 입력해주세요" } });
    }
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === catId);
    if (!cat) return res.status(404).json({ result: "ERROR", error: { code: "CATEGORY_NOT_FOUND", message: "카테고리를 찾을 수 없습니다" } });
    const dup = categories.find((c) => c.division === cat.division && c.categoryName === categoryName && (c.categoryId || c.id) !== catId);
    if (dup) return res.status(409).json({ result: "ERROR", error: { code: "DUPLICATE_CATEGORY_NAME", message: "이미 존재하는 카테고리명입니다" } });
    const now = new Date().toISOString();
    cat.categoryName = categoryName;
    cat.updatedAt = now;
    if (db) { try { db.write(); } catch (_e) { /* */ } }
    return res.status(200).json({ result: "OK", generatedAt: now, data: { categoryId: catId, division: cat.division, categoryName, boardCount: cat.boardCount || 0, createdAt: cat.createdAt, updatedAt: now } });
  }

  // DELETE /api/admin/board-categories/:id — 카테고리 삭제
  if (req.method === "DELETE" && /^\/api\/admin\/board-categories\/\d+$/.test(req.path)) {
    const catId = parseInt(req.path.split("/").pop(), 10);
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === catId);
    if (!cat) return res.status(404).json({ result: "ERROR", error: { code: "CATEGORY_NOT_FOUND", message: "카테고리를 찾을 수 없습니다" } });
    if (cat.boardCount > 0) return res.status(409).json({ result: "ERROR", error: { code: "CATEGORY_HAS_BOARDS", message: "게시글이 등록된 상태에서는 삭제할 수 없습니다. 게시글을 삭제한 후 진행해 주세요." } });
    if (db) { try { db.get("community_categories").remove((c) => (c.categoryId || c.id) === catId).write(); } catch (_e) { /* */ } }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), data: null });
  }

  // ============================================================
  // 게시글 (Boards) CRUD — /api/admin/boards
  // ============================================================

  const getBoards = () => {
    if (db) try { return db.get("community_posts").value() || []; } catch (_e) { /* */ }
    return [];
  };

  // GET /api/admin/boards — 게시글 목록 조회
  if (req.method === "GET" && req.path === "/api/admin/boards") {
    const boards = getBoards();
    const { division, target, keyword, startDate, endDate, page = "1", size = "20" } = req.query;
    let filtered = [...boards];
    if (division) filtered = filtered.filter((b) => b.division === division);
    if (target) filtered = filtered.filter((b) => b.target === target);
    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter((b) => b.title.toLowerCase().includes(kw));
    }
    if (startDate) filtered = filtered.filter((b) => b.createdAt >= startDate);
    if (endDate) filtered = filtered.filter((b) => b.createdAt <= endDate + " 23:59");
    filtered.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    const p = parseInt(page, 10);
    const s = parseInt(size, 10);
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / s) || 1;
    const paged = filtered.slice((p - 1) * s, p * s);
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: { boards: paged, totalCount, totalPages, currentPage: p, size: s }
    });
  }

  // GET /api/admin/boards/form — 폼 옵션 조회
  if (req.method === "GET" && req.path === "/api/admin/boards/form") {
    const categories = getCategories();
    const boardCategories = categories.map((c) => ({
      boardCategoryId: c.categoryId || c.id,
      categoryName: c.categoryName || c.category_name,
      division: c.division
    }));
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        divisions: [{ value: "NOTICE", label: "공지사항" }, { value: "QUESTIONS", label: "자주 묻는 질문" }],
        targets: [{ value: "ALL", label: "전체" }, { value: "REVIEWER", label: "리뷰어" }, { value: "PARTNER", label: "파트너" }, { value: "ADMIN", label: "관리자" }],
        boardCategories
      }
    });
  }

  // GET /api/admin/boards/:id — 게시글 상세 조회
  if (req.method === "GET" && /^\/api\/admin\/boards\/\d+$/.test(req.path)) {
    const boardId = parseInt(req.path.split("/").pop(), 10);
    const boards = getBoards();
    const board = boards.find((b) => (b.boardId || b.id) === boardId);
    if (!board) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), data: board });
  }

  // POST /api/admin/boards — 게시글 등록
  if (req.method === "POST" && req.path === "/api/admin/boards") {
    const { division, boardCategoryId, target, title, content } = req.body;
    const boards = getBoards();
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === boardCategoryId);
    const maxId = boards.reduce((m, b) => Math.max(m, b.boardId || b.id || 0), 0);
    const now = new Date();
    const dateStr = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0") + " " + String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
    const newBoard = {
      id: maxId + 1, boardId: maxId + 1,
      division, boardCategory: cat ? (cat.categoryName || cat.category_name) : "전체",
      target, title, content: content || "",
      viewCount: 0, isFixed: false, createdAt: dateStr, createdBy: "관리자"
    };
    if (db) try { db.get("community_posts").push(newBoard).write(); } catch (_e) { /* */ }
    return res.status(201).json({ result: "OK", generatedAt: new Date().toISOString(), data: { boardId: newBoard.boardId } });
  }

  // PUT /api/admin/boards/:id — 게시글 수정
  if (req.method === "PUT" && /^\/api\/admin\/boards\/\d+$/.test(req.path)) {
    const boardId = parseInt(req.path.split("/").pop(), 10);
    const boards = getBoards();
    const board = boards.find((b) => (b.boardId || b.id) === boardId);
    if (!board) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    const { division, boardCategoryId, target, title, content } = req.body;
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === boardCategoryId);
    const now = new Date();
    const dateStr = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0") + " " + String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
    if (db) try {
      db.get("community_posts").find((b) => (b.boardId || b.id) === boardId)
        .assign({ division, boardCategory: cat ? (cat.categoryName || cat.category_name) : board.boardCategory, target, title, content, updatedAt: dateStr }).write();
    } catch (_e) { /* */ }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), data: { boardId } });
  }

  // PATCH /api/admin/boards/:id/fix — 게시글 고정/해제
  if (req.method === "PATCH" && /^\/api\/admin\/boards\/\d+\/fix$/.test(req.path)) {
    const parts = req.path.split("/");
    const boardId = parseInt(parts[parts.length - 2], 10);
    const boards = getBoards();
    const board = boards.find((b) => (b.boardId || b.id) === boardId);
    if (!board) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    const { isFixed } = req.body;
    if (db) try {
      db.get("community_posts").find((b) => (b.boardId || b.id) === boardId).assign({ isFixed }).write();
    } catch (_e) { /* */ }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), data: { boardId, isFixed } });
  }

  // DELETE /api/admin/boards/:id — 게시글 삭제
  if (req.method === "DELETE" && /^\/api\/admin\/boards\/\d+$/.test(req.path)) {
    const boardId = parseInt(req.path.split("/").pop(), 10);
    const boards = getBoards();
    const board = boards.find((b) => (b.boardId || b.id) === boardId);
    if (!board) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    if (db) try { db.get("community_posts").remove((b) => (b.boardId || b.id) === boardId).write(); } catch (_e) { /* */ }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), data: null });
  }

  // ============================================================
  // SA 게시글 (Boards) CRUD — /api/admin-sa/board
  // ============================================================

  // SA도 GA와 동일한 community_posts 데이터를 공유합니다

  // category enum → label 매핑
  var DIVISION_LABELS = { NOTICE: "공지사항", QUESTIONS: "자주 묻는 질문" };
  var TARGET_LABELS = { ALL: "전체", REVIEWER: "리뷰어", PARTNER: "파트너", ADMIN: "관리자" };

  // GET /api/admin-sa/board — SA 게시글 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/board") {
    var saBoards = getBoards();
    var saDivision = req.query.division;
    var saTarget = req.query.target;
    var saKeyword = req.query.keyword;
    var saStartDate = req.query.startDate;
    var saEndDate = req.query.endDate;
    var saFiltered = saBoards.slice();
    if (saDivision) saFiltered = saFiltered.filter(function(b) { return b.division === saDivision; });
    if (saTarget) saFiltered = saFiltered.filter(function(b) { return b.target === saTarget; });
    if (saKeyword) {
      var skw = saKeyword.toLowerCase();
      saFiltered = saFiltered.filter(function(b) { return b.title.toLowerCase().includes(skw); });
    }
    if (saStartDate) saFiltered = saFiltered.filter(function(b) { return b.createdAt >= saStartDate; });
    if (saEndDate) saFiltered = saFiltered.filter(function(b) { return b.createdAt <= saEndDate + " 23:59"; });
    saFiltered.sort(function(a, b) { return (b.createdAt || "").localeCompare(a.createdAt || ""); });
    // SA 응답 형식 (data wrapper 없음, isPinned/registrantName 사용)
    var saBoardItems = saFiltered.map(function(b) {
      return {
        boardId: b.boardId || b.id,
        boardNumber: String(b.boardId || b.id).padStart(7, "0"),
        division: b.division,
        category: b.boardCategory,
        target: b.target,
        title: b.title,
        viewCount: b.viewCount || 0,
        isPinned: b.isFixed || b.isPinned || false,
        registrantName: b.createdBy || "관리자",
        createdAt: b.createdAt
      };
    });
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: saBoardItems.length,
      boards: saBoardItems
    });
  }

  // GET /api/admin-sa/board/write — SA 폼 옵션 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/board/write") {
    var saCategories = [];
    if (db) try { saCategories = db.get("community_categories").value() || []; } catch (_e) { /* */ }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      divisions: [
        { code: "NOTICE", label: "공지사항" },
        { code: "QUESTIONS", label: "자주 묻는 질문" }
      ],
      categories: saCategories.map(function(c) {
        return { code: c.categoryName, label: c.categoryName, division: c.division };
      }),
      targets: [
        { code: "ALL", label: "전체" },
        { code: "REVIEWER", label: "리뷰어" },
        { code: "PARTNER", label: "파트너" },
        { code: "ADMIN", label: "관리자" }
      ]
    });
  }

  // GET /api/admin-sa/board/:id — SA 게시글 상세 조회
  if (req.method === "GET" && /^\/api\/admin-sa\/board\/\d+$/.test(req.path)) {
    var saBoardId = parseInt(req.path.split("/").pop(), 10);
    var saBoardsList = getBoards();
    var saBoard = saBoardsList.find(function(b) { return (b.boardId || b.id) === saBoardId; });
    if (!saBoard) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      board: {
        boardId: saBoard.boardId || saBoard.id,
        boardNumber: String(saBoard.boardId || saBoard.id).padStart(7, "0"),
        division: saBoard.division,
        category: saBoard.boardCategory,
        target: saBoard.target,
        title: saBoard.title,
        content: saBoard.content || "<p>내용이 없습니다.</p>",
        viewCount: saBoard.viewCount || 0,
        isPinned: saBoard.isFixed || saBoard.isPinned || false,
        registrantName: saBoard.createdBy || "관리자",
        createdAt: saBoard.createdAt,
        updatedAt: saBoard.updatedAt || null
      }
    });
  }

  // POST /api/admin-sa/board — SA 게시글 등록
  if (req.method === "POST" && req.path === "/api/admin-sa/board") {
    var saPostBody = req.body;
    var saPostBoards = getBoards();
    var saPostMaxId = saPostBoards.reduce(function(m, b) { return Math.max(m, b.boardId || b.id || 0); }, 0);
    var saPostNow = new Date().toISOString().slice(0, 16).replace("T", " ");
    var saNewBoard = {
      id: saPostMaxId + 1,
      boardId: saPostMaxId + 1,
      division: saPostBody.division,
      boardCategory: saPostBody.category,
      target: saPostBody.target,
      title: saPostBody.title,
      content: saPostBody.content,
      viewCount: 0,
      isFixed: false,
      isPinned: false,
      createdAt: saPostNow,
      createdBy: "관리자 SA"
    };
    if (db) try { db.get("community_posts").push(saNewBoard).write(); } catch (_e) { /* */ }
    return res.status(201).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      boardId: saNewBoard.boardId,
      boardNumber: String(saNewBoard.boardId).padStart(7, "0"),
      createdAt: saPostNow
    });
  }

  // PUT /api/admin-sa/board/:id — SA 게시글 수정
  if (req.method === "PUT" && /^\/api\/admin-sa\/board\/\d+$/.test(req.path)) {
    var saPutBoardId = parseInt(req.path.split("/").pop(), 10);
    var saPutBoards = getBoards();
    var saPutBoard = saPutBoards.find(function(b) { return (b.boardId || b.id) === saPutBoardId; });
    if (!saPutBoard) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    var saPutBody = req.body;
    var saPutNow = new Date().toISOString().slice(0, 16).replace("T", " ");
    if (db) try {
      db.get("community_posts").find(function(b) { return (b.boardId || b.id) === saPutBoardId; })
        .assign({
          division: saPutBody.division,
          boardCategory: saPutBody.boardCategory,
          target: saPutBody.target,
          title: saPutBody.title,
          content: saPutBody.content,
          updatedAt: saPutNow
        }).write();
    } catch (_e) { /* */ }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // DELETE /api/admin-sa/board — SA 게시글 삭제 (복수)
  if (req.method === "DELETE" && req.path === "/api/admin-sa/board") {
    var saDeleteIds = (req.body && req.body.boardIds) || [];
    var saDeleteCount = 0;
    if (db && saDeleteIds.length > 0) {
      try {
        saDeleteIds.forEach(function(delId) {
          var found = db.get("community_posts").find(function(b) { return (b.boardId || b.id) === delId; }).value();
          if (found) {
            db.get("community_posts").remove(function(b) { return (b.boardId || b.id) === delId; }).write();
            saDeleteCount++;
          }
        });
      } catch (_e) { /* */ }
    }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), deletedCount: saDeleteCount });
  }

  // PATCH /api/admin-sa/board/:id/pin — SA 게시글 고정
  if (req.method === "PATCH" && /^\/api\/admin-sa\/board\/\d+\/pin$/.test(req.path)) {
    var saPinParts = req.path.split("/");
    var saPinBoardId = parseInt(saPinParts[saPinParts.length - 2], 10);
    var saPinBoards = getBoards();
    var saPinBoard = saPinBoards.find(function(b) { return (b.boardId || b.id) === saPinBoardId; });
    if (!saPinBoard) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    if (db) try {
      db.get("community_posts").find(function(b) { return (b.boardId || b.id) === saPinBoardId; }).assign({ isFixed: true, isPinned: true }).write();
    } catch (_e) { /* */ }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // PATCH /api/admin-sa/board/:id/unpin — SA 게시글 고정 해제
  if (req.method === "PATCH" && /^\/api\/admin-sa\/board\/\d+\/unpin$/.test(req.path)) {
    var saUnpinParts = req.path.split("/");
    var saUnpinBoardId = parseInt(saUnpinParts[saUnpinParts.length - 2], 10);
    var saUnpinBoards = getBoards();
    var saUnpinBoard = saUnpinBoards.find(function(b) { return (b.boardId || b.id) === saUnpinBoardId; });
    if (!saUnpinBoard) return res.status(404).json({ result: "ERROR", error: { code: "BOARD_NOT_FOUND", message: "게시글을 찾을 수 없습니다." } });
    if (db) try {
      db.get("community_posts").find(function(b) { return (b.boardId || b.id) === saUnpinBoardId; }).assign({ isFixed: false, isPinned: false }).write();
    } catch (_e) { /* */ }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // ============================================================
  // SA 카테고리 (Categories) CRUD — /api/admin-sa/categories
  // ============================================================

  // GET /api/admin-sa/categories/register — SA 카테고리 등록 폼 옵션 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/categories/register") {
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      divisions: [
        { code: "NOTICE", label: "공지사항" },
        { code: "FAQ", label: "자주 묻는 질문" },
        { code: "EVENT", label: "이벤트" },
      ],
    });
  }

  // GET /api/admin-sa/categories/:id — SA 카테고리 상세 조회
  if (req.method === "GET" && /^\/api\/admin-sa\/categories\/\d+$/.test(req.path)) {
    const catId = parseInt(req.path.split("/").pop(), 10);
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === catId);
    if (!cat) return res.status(404).json({ result: "ERROR", error: { code: "CATEGORY_NOT_FOUND", message: "카테고리를 찾을 수 없습니다" } });
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      category: { categoryId: cat.categoryId || cat.id, division: cat.division, categoryName: cat.categoryName },
    });
  }

  // GET /api/admin-sa/categories — SA 카테고리 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/categories") {
    let categories = getCategories();
    const { division, keyword } = req.query;
    if (division) categories = categories.filter((c) => c.division === division);
    if (keyword) categories = categories.filter((c) => c.categoryName && c.categoryName.includes(keyword));
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      totalCount: categories.length,
      categories: categories.map((c) => ({ categoryId: c.categoryId || c.id, division: c.division, categoryName: c.categoryName })),
    });
  }

  // POST /api/admin-sa/categories — SA 카테고리 등록
  if (req.method === "POST" && req.path === "/api/admin-sa/categories") {
    const { division, categoryName } = req.body || {};
    if (!categoryName || categoryName.length < 2 || categoryName.length > 10) {
      return res.status(400).json({ result: "ERROR", error: { code: "INVALID_INPUT", message: "카테고리명은 2~10자 이내로 입력해 주세요." } });
    }
    const categories = getCategories();
    const dup = categories.find((c) => c.division === division && c.categoryName === categoryName);
    if (dup) return res.status(400).json({ result: "ERROR", error: { code: "CATEGORY_DUPLICATE", message: "이미 존재하는 카테고리명입니다." } });
    const maxId = categories.reduce((m, c) => Math.max(m, c.categoryId || c.id || 0), 0);
    const now = new Date().toISOString();
    const newCat = { id: maxId + 1, categoryId: maxId + 1, division, categoryName, boardCount: 0, createdAt: now, updatedAt: now };
    if (db) { try { db.get("community_categories").push(newCat).write(); } catch (_e) { /* */ } }
    return res.status(200).json({ result: "OK", generatedAt: now, category: { categoryId: newCat.categoryId, division, categoryName } });
  }

  // PATCH /api/admin-sa/categories/:id — SA 카테고리 수정
  if (req.method === "PATCH" && /^\/api\/admin-sa\/categories\/\d+$/.test(req.path)) {
    const catId = parseInt(req.path.split("/").pop(), 10);
    const { division, categoryName } = req.body || {};
    if (!categoryName || categoryName.length < 2 || categoryName.length > 10) {
      return res.status(400).json({ result: "ERROR", error: { code: "INVALID_INPUT", message: "카테고리명은 2~10자 이내로 입력해 주세요." } });
    }
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === catId);
    if (!cat) return res.status(404).json({ result: "ERROR", error: { code: "CATEGORY_NOT_FOUND", message: "카테고리를 찾을 수 없습니다." } });
    const checkDiv = division || cat.division;
    const dup = categories.find((c) => c.division === checkDiv && c.categoryName === categoryName && (c.categoryId || c.id) !== catId);
    if (dup) return res.status(400).json({ result: "ERROR", error: { code: "CATEGORY_DUPLICATE", message: "이미 존재하는 카테고리명입니다." } });
    if (division) cat.division = division;
    cat.categoryName = categoryName;
    cat.updatedAt = new Date().toISOString();
    if (db) { try { db.write(); } catch (_e) { /* */ } }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString(), category: { categoryId: catId, division: cat.division, categoryName } });
  }

  // DELETE /api/admin-sa/categories/:id — SA 카테고리 삭제
  if (req.method === "DELETE" && /^\/api\/admin-sa\/categories\/\d+$/.test(req.path)) {
    const catId = parseInt(req.path.split("/").pop(), 10);
    const categories = getCategories();
    const cat = categories.find((c) => (c.categoryId || c.id) === catId);
    if (!cat) return res.status(404).json({ result: "ERROR", error: { code: "CATEGORY_NOT_FOUND", message: "존재하지 않는 카테고리입니다." } });
    if (cat.boardCount > 0) return res.status(400).json({ result: "ERROR", error: { code: "CATEGORY_HAS_BOARDS", message: "게시글이 등록된 상태에서는 삭제할 수 없습니다. 게시글을 삭제한 후 진행해 주세요." } });
    if (db) { try { db.get("community_categories").remove((c) => (c.categoryId || c.id) === catId).write(); } catch (_e) { /* */ } }
    return res.status(200).json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // SA 알림 (Notifications) — /api/admin-sa/notifications
  // ──────────────────────────────────────────────────────

  // GET /api/admin-sa/notifications — SA 알림 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/notifications") {
    if (saAdminNotificationsDeleted) {
      return res.status(200).json({
        result: "OK",
        generatedAt: new Date().toISOString(),
        data: { totalCount: 0, unreadCount: 0, totalPages: 0, currentPage: 1, size: 20, notifications: [] },
      });
    }

    const dbData = require("./db.json");
    let items = (dbData.admin_notifications || []).filter(
      (n) => n.userId === adminSession.id
    );

    if (req.query.category) {
      items = items.filter((n) => n.category === req.query.category);
    }
    if (req.query.isRead !== undefined) {
      const isRead = req.query.isRead === "true";
      items = items.filter((n) => n.isRead === isRead);
    }

    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 20;
    const totalCount = items.length;
    const unreadCount = items.filter((n) => !n.isRead).length;
    const totalPages = Math.ceil(totalCount / size);
    const start = (page - 1) * size;
    const sliced = items.slice(start, start + size);

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { totalCount, unreadCount, totalPages, currentPage: page, size, notifications: sliced.map(({ userId, ...rest }) => rest) },
    });
  }

  // DELETE /api/admin-sa/notifications/all — SA 전체 알림 삭제
  if (req.method === "DELETE" && req.path === "/api/admin-sa/notifications/all") {
    saAdminNotificationsDeleted = true;
    return res.status(200).json({ result: "OK" });
  }

  // DELETE /api/admin-sa/notifications/:id — SA 개별 알림 삭제
  if (req.method === "DELETE" && /^\/api\/admin-sa\/notifications\/\d+$/.test(req.path)) {
    return res.status(200).json({ result: "OK" });
  }

  // PATCH /api/admin-sa/notifications/:id/read — SA 알림 읽음 처리
  if (req.method === "PATCH" && /^\/api\/admin-sa\/notifications\/\d+\/read$/.test(req.path)) {
    return res.status(200).json({ result: "OK" });
  }

  // PATCH /api/admin-sa/notifications/read-all — SA 전체 읽음 처리
  if (req.method === "PATCH" && req.path === "/api/admin-sa/notifications/read-all") {
    return res.status(200).json({ result: "OK" });
  }

  // ============ GET /partner/point/history (기존 mock API — 하위 호환) ============
  if (req.method === "GET" && (req.path === "/partner/point/history" || req.path === "/partner_point_history")) {
    const pid = currentSession.userId;
    const pointData = {
      1001: [
        { id: "pph001", partner_id: 1001, type: "earned", amount: 300000, description: "포인트 충전", date: "2026-01-05", status: "earned", balance: 300000, payment_method: "card" },
        { id: "pph002", partner_id: 1001, type: "earned", amount: 200000, description: "포인트 충전", date: "2026-02-10", status: "earned", balance: 500000, payment_method: "bank" },
        { id: "pph003", partner_id: 1001, type: "withdrawn", amount: -50000, description: "리뷰어 포인트 지급", campaign_id: "camp001", date: "2026-02-15", status: "completed", balance: 450000 },
        { id: "pph004", partner_id: 1001, type: "returned", amount: 30000, description: "캠페인 포인트 반환", campaign_id: "camp001", date: "2026-02-20", status: "completed", balance: 480000, return_reason: "캠페인 취소" },
        { id: "pph005", partner_id: 1001, type: "withdrawn", amount: -80000, description: "리뷰어 포인트 지급", campaign_id: "camp002", date: "2026-03-01", status: "completed", balance: 400000 },
        { id: "pph006", partner_id: 1001, type: "earned", amount: 100000, description: "포인트 충전", date: "2026-03-10", status: "earned", balance: 500000, payment_method: "card" },
      ],
      1005: [
        { id: "pph101", partner_id: 1005, type: "earned", amount: 500000, description: "포인트 충전", date: "2026-03-01", status: "earned", balance: 500000, payment_method: "card" },
        { id: "pph102", partner_id: 1005, type: "earned", amount: 300000, description: "포인트 충전", date: "2026-03-15", status: "earned", balance: 800000, payment_method: "bank" },
        { id: "pph103", partner_id: 1005, type: "withdrawn", amount: -100000, description: "리뷰어 포인트 지급", campaign_id: "camp010", date: "2026-03-18", status: "completed", balance: 700000 },
      ],
    };
    return res.status(200).json(pointData[pid] || pointData[1001]);
  }

  // ============ GET /partner/points ============
  // 24번 API: 포인트 페이지 조회 (무한스크롤 페이지네이션)
  if (req.method === "GET" && req.path === "/partner/points") {
    const type = req.query.type || "ALL";
    const page = parseInt(req.query.page || "0", 10);
    const size = parseInt(req.query.size || "15", 10);

    // 계정별 포인트 내역
    const transactionsByUser = {
      1001: {
        balance: 715000,
        transactions: [
          { transactionId: 1, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 300000, balanceAfter: 300000, createdAt: "2026-01-05T14:20:00+09:00", hasReceipt: true, paymentMethod: "card" },
          { transactionId: 2, type: "PAYOUT", label: "사용", description: "[배송형 캠페인 A] 포인트 사용", amount: -50000, balanceAfter: 250000, createdAt: "2026-01-12T10:30:00+09:00", hasReceipt: false },
          { transactionId: 3, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 200000, balanceAfter: 450000, createdAt: "2026-01-20T09:00:00+09:00", hasReceipt: true, paymentMethod: "bank" },
          { transactionId: 4, type: "PAYOUT", label: "사용", description: "[방문형 캠페인 B] 포인트 사용", amount: -30000, balanceAfter: 420000, createdAt: "2026-01-25T15:00:00+09:00", hasReceipt: false },
          { transactionId: 5, type: "REFUND", label: "반환", description: "[캠페인 취소] 포인트 반환", amount: 30000, balanceAfter: 450000, createdAt: "2026-02-01T11:00:00+09:00", hasReceipt: false },
          { transactionId: 6, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 150000, balanceAfter: 600000, createdAt: "2026-02-05T14:00:00+09:00", hasReceipt: true, paymentMethod: "card" },
          { transactionId: 7, type: "PAYOUT", label: "사용", description: "[구매평 캠페인 C] 포인트 사용", amount: -80000, balanceAfter: 520000, createdAt: "2026-02-10T10:00:00+09:00", hasReceipt: false },
          { transactionId: 8, type: "PAYOUT", label: "사용", description: "[배송형 캠페인 D] 포인트 사용", amount: -45000, balanceAfter: 475000, createdAt: "2026-02-15T16:30:00+09:00", hasReceipt: false },
          { transactionId: 9, type: "REFUND", label: "반환", description: "[리뷰어 미참여] 포인트 반환", amount: 20000, balanceAfter: 495000, createdAt: "2026-02-18T09:00:00+09:00", hasReceipt: false },
          { transactionId: 10, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 100000, balanceAfter: 595000, createdAt: "2026-02-22T12:00:00+09:00", hasReceipt: true, paymentMethod: "bank" },
          { transactionId: 11, type: "PAYOUT", label: "사용", description: "[미션형 캠페인 E] 포인트 사용", amount: -60000, balanceAfter: 535000, createdAt: "2026-02-28T14:00:00+09:00", hasReceipt: false },
          { transactionId: 12, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 50000, balanceAfter: 585000, createdAt: "2026-03-03T10:00:00+09:00", hasReceipt: true, paymentMethod: "card" },
          { transactionId: 13, type: "PAYOUT", label: "사용", description: "[기자단 캠페인 F] 포인트 사용", amount: -35000, balanceAfter: 550000, createdAt: "2026-03-08T11:00:00+09:00", hasReceipt: false },
          { transactionId: 14, type: "REFUND", label: "반환", description: "[캠페인 미진행] 포인트 반환", amount: 45000, balanceAfter: 595000, createdAt: "2026-03-12T09:30:00+09:00", hasReceipt: false },
          { transactionId: 15, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 200000, balanceAfter: 795000, createdAt: "2026-03-15T14:00:00+09:00", hasReceipt: true, paymentMethod: "card" },
          { transactionId: 16, type: "PAYOUT", label: "사용", description: "[배송형 캠페인 G] 포인트 사용", amount: -70000, balanceAfter: 725000, createdAt: "2026-03-18T10:00:00+09:00", hasReceipt: false },
          { transactionId: 17, type: "PAYOUT", label: "사용", description: "[방문형 캠페인 H] 포인트 사용", amount: -25000, balanceAfter: 700000, createdAt: "2026-03-20T16:00:00+09:00", hasReceipt: false },
          { transactionId: 18, type: "REFUND", label: "반환", description: "[리뷰어 미참여] 포인트 반환", amount: 15000, balanceAfter: 715000, createdAt: "2026-03-22T09:00:00+09:00", hasReceipt: false },
        ],
      },
      1005: {
        balance: 350000,
        transactions: [
          { transactionId: 101, type: "CHARGE", label: "충전", description: "포인트 충전", amount: 500000, balanceAfter: 500000, createdAt: "2026-02-01T10:00:00+09:00", hasReceipt: true, paymentMethod: "card" },
          { transactionId: 102, type: "PAYOUT", label: "사용", description: "[배송형 캠페인] 포인트 사용", amount: -80000, balanceAfter: 420000, createdAt: "2026-02-15T14:00:00+09:00", hasReceipt: false },
          { transactionId: 103, type: "PAYOUT", label: "사용", description: "[방문형 캠페인] 포인트 사용", amount: -50000, balanceAfter: 370000, createdAt: "2026-03-01T11:00:00+09:00", hasReceipt: false },
          { transactionId: 104, type: "REFUND", label: "반환", description: "[리뷰어 미참여] 포인트 반환", amount: 30000, balanceAfter: 400000, createdAt: "2026-03-10T09:00:00+09:00", hasReceipt: false },
          { transactionId: 105, type: "PAYOUT", label: "사용", description: "[구매평 캠페인] 포인트 사용", amount: -50000, balanceAfter: 350000, createdAt: "2026-03-18T15:00:00+09:00", hasReceipt: false },
        ],
      },
    };

    const userData = transactionsByUser[currentSession.userId] || transactionsByUser[1001];
    const allTransactions = userData.transactions;

    let filtered;
    if (type === "CHARGE") {
      filtered = allTransactions.filter((t) => t.type === "CHARGE");
    } else if (type === "USE") {
      filtered = allTransactions.filter((t) => t.type === "PAYOUT" || t.type === "REFUND");
    } else {
      filtered = allTransactions;
    }

    // 최신순 정렬
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const paged = filtered.slice(start, end);
    const hasNext = end < filtered.length;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        currentBalance: userData.balance,
        transactions: paged,
        hasNext,
      },
    });
  }

  // ============ GET /partner/points/charge/:chargeId/receipt ============
  // 24-1번 API: 거래명세서 조회
  if (req.method === "GET" && req.path.match(/^\/partner\/points\/charge\/\d+\/receipt$/)) {
    return res.status(200).json({
      success: true,
      data: {
        receiptUrl: "https://storage.example.com/receipts/receipt_mock.jpg",
        fileType: "jpg",
        paymentMethod: "card",
      },
    });
  }

  // ============ POST /partner/points/charge ============
  // 24-2번 API: 포인트 충전하기
  if (req.method === "POST" && req.path === "/partner/points/charge") {
    const { paymentMethod, amount, agreeToTerms } = req.body;

    if (!paymentMethod || !amount || !agreeToTerms) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "필수 항목을 모두 입력해주세요." },
      });
    }

    const chargeId = Date.now();
    const now = new Date().toISOString();

    if (paymentMethod === "CARD") {
      // 24-2-2: 신용카드 결제 → 즉시 완료
      return res.status(200).json({
        success: true,
        data: {
          chargeId,
          status: "COMPLETED",
          paymentMethod: "CARD",
          amount,
          createdAt: now,
        },
      });
    }

    if (paymentMethod === "BANK_TRANSFER") {
      // 24-2-1: 무통장 입금 → 입금 대기
      const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      return res.status(200).json({
        success: true,
        data: {
          chargeId,
          status: "PENDING",
          paymentMethod: "BANK_TRANSFER",
          amount,
          depositAccount: {
            bank: "국민은행",
            accountNumber: "659401-01-490957",
            accountHolder: "(주)청명종합광고기획",
          },
          expiredAt,
          createdAt: now,
        },
      });
    }

    return res.status(400).json({
      success: false,
      error: { code: "INVALID_PAYMENT_METHOD", message: "지원하지 않는 결제 수단입니다." },
    });
  }

  // ============ GET /partner/campaign/create ============
  // 09번 API: 캠페인 등록페이지 조회 (카테고리, 채널, 지역, 파트너 정보)
  if (req.method === "GET" && (req.path === "/partner/campaign/create" || req.originalUrl === "/partner/campaign/create")) {
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      partner: {
        partnerId: 501,
        businessName: "마크엑스컴퍼니",
        currentPoint: 425000,
      },
      categories: [
        { categoryId: 1, categoryName: "식품" },
        { categoryId: 2, categoryName: "뷰티" },
        { categoryId: 3, categoryName: "가전" },
        { categoryId: 4, categoryName: "유아동" },
        { categoryId: 5, categoryName: "여가" },
        { categoryId: 6, categoryName: "서비스" },
        { categoryId: 7, categoryName: "생활" },
        { categoryId: 8, categoryName: "패션" },
        { categoryId: 9, categoryName: "가구" },
        { categoryId: 10, categoryName: "디지털" },
        { categoryId: 11, categoryName: "문화" },
        { categoryId: 12, categoryName: "반려동물" },
        { categoryId: 13, categoryName: "기타" },
      ],
      channels: [
        { channelId: 1, channelName: "NAVER_BLOG" },
        { channelId: 2, channelName: "NAVER_CLIP" },
        { channelId: 3, channelName: "INSTAGRAM" },
        { channelId: 4, channelName: "INSTAGRAM_REELS" },
        { channelId: 5, channelName: "YOUTUBE" },
        { channelId: 6, channelName: "YOUTUBE_SHORTS" },
      ],
      regions: [
        // 서울특별시
        { regionId: 100, name: "서울특별시", level: 1, parentId: null },
        { regionId: 101, name: "강북구", level: 2, parentId: 100 },
        { regionId: 102, name: "관악구", level: 2, parentId: 100 },
        { regionId: 103, name: "구로구", level: 2, parentId: 100 },
        { regionId: 104, name: "노원구", level: 2, parentId: 100 },
        { regionId: 105, name: "동대문구", level: 2, parentId: 100 },
        { regionId: 106, name: "마포구", level: 2, parentId: 100 },
        { regionId: 107, name: "서초구", level: 2, parentId: 100 },
        { regionId: 108, name: "성북구", level: 2, parentId: 100 },
        { regionId: 109, name: "양천구", level: 2, parentId: 100 },
        { regionId: 110, name: "용산구", level: 2, parentId: 100 },
        { regionId: 111, name: "강남구", level: 2, parentId: 100 },
        { regionId: 112, name: "강서구", level: 2, parentId: 100 },
        { regionId: 113, name: "광진구", level: 2, parentId: 100 },
        { regionId: 114, name: "금천구", level: 2, parentId: 100 },
        { regionId: 115, name: "도봉구", level: 2, parentId: 100 },
        { regionId: 116, name: "동작구", level: 2, parentId: 100 },
        { regionId: 117, name: "서대문구", level: 2, parentId: 100 },
        { regionId: 118, name: "성동구", level: 2, parentId: 100 },
        { regionId: 119, name: "송파구", level: 2, parentId: 100 },
        { regionId: 120, name: "영등포구", level: 2, parentId: 100 },
        { regionId: 121, name: "은평구", level: 2, parentId: 100 },
        { regionId: 122, name: "종로구", level: 2, parentId: 100 },
        { regionId: 123, name: "중구", level: 2, parentId: 100 },
        { regionId: 124, name: "중랑구", level: 2, parentId: 100 },
        { regionId: 125, name: "강동구", level: 2, parentId: 100 },
        // 인천광역시
        { regionId: 200, name: "인천광역시", level: 1, parentId: null },
        { regionId: 201, name: "강화군", level: 2, parentId: 200 },
        { regionId: 202, name: "검단구", level: 2, parentId: 200 },
        { regionId: 203, name: "계양구", level: 2, parentId: 200 },
        { regionId: 204, name: "남구", level: 2, parentId: 200 },
        { regionId: 205, name: "남동구", level: 2, parentId: 200 },
        { regionId: 206, name: "미추홀구", level: 2, parentId: 200 },
        { regionId: 207, name: "부평구", level: 2, parentId: 200 },
        { regionId: 208, name: "서구", level: 2, parentId: 200 },
        { regionId: 209, name: "연수구", level: 2, parentId: 200 },
        { regionId: 210, name: "영종구", level: 2, parentId: 200 },
        { regionId: 211, name: "옹진군", level: 2, parentId: 200 },
        { regionId: 212, name: "제물포구", level: 2, parentId: 200 },
        // 경기도
        { regionId: 300, name: "경기도", level: 1, parentId: null },
        { regionId: 301, name: "고양시", level: 2, parentId: 300 },
        { regionId: 302, name: "광명시", level: 2, parentId: 300 },
        { regionId: 303, name: "구리시", level: 2, parentId: 300 },
        { regionId: 304, name: "김포시", level: 2, parentId: 300 },
        { regionId: 305, name: "동두천시", level: 2, parentId: 300 },
        { regionId: 306, name: "성남시", level: 2, parentId: 300 },
        { regionId: 307, name: "시흥시", level: 2, parentId: 300 },
        { regionId: 308, name: "안성시", level: 2, parentId: 300 },
        { regionId: 309, name: "양주시", level: 2, parentId: 300 },
        { regionId: 310, name: "여주시", level: 2, parentId: 300 },
        { regionId: 311, name: "가평군", level: 2, parentId: 300 },
        { regionId: 312, name: "과천시", level: 2, parentId: 300 },
        { regionId: 313, name: "광주시", level: 2, parentId: 300 },
        { regionId: 314, name: "군포시", level: 2, parentId: 300 },
        { regionId: 315, name: "남양주시", level: 2, parentId: 300 },
        { regionId: 316, name: "부천시", level: 2, parentId: 300 },
        { regionId: 317, name: "수원시", level: 2, parentId: 300 },
        { regionId: 318, name: "안산시", level: 2, parentId: 300 },
        { regionId: 319, name: "안양시", level: 2, parentId: 300 },
        { regionId: 320, name: "양평군", level: 2, parentId: 300 },
        { regionId: 321, name: "연천군", level: 2, parentId: 300 },
        { regionId: 322, name: "오산시", level: 2, parentId: 300 },
        { regionId: 323, name: "용인시", level: 2, parentId: 300 },
        { regionId: 324, name: "의왕시", level: 2, parentId: 300 },
        { regionId: 325, name: "의정부시", level: 2, parentId: 300 },
        { regionId: 326, name: "이천시", level: 2, parentId: 300 },
        { regionId: 327, name: "파주시", level: 2, parentId: 300 },
        { regionId: 328, name: "평택시", level: 2, parentId: 300 },
        { regionId: 329, name: "포천시", level: 2, parentId: 300 },
        { regionId: 330, name: "하남시", level: 2, parentId: 300 },
        { regionId: 331, name: "화성시", level: 2, parentId: 300 },
        // 강원특별자치도
        { regionId: 400, name: "강원특별자치도", level: 1, parentId: null },
        { regionId: 401, name: "강릉시", level: 2, parentId: 400 },
        { regionId: 402, name: "고성군", level: 2, parentId: 400 },
        { regionId: 403, name: "동해시", level: 2, parentId: 400 },
        { regionId: 404, name: "삼척시", level: 2, parentId: 400 },
        { regionId: 405, name: "속초시", level: 2, parentId: 400 },
        { regionId: 406, name: "양구군", level: 2, parentId: 400 },
        { regionId: 407, name: "양양군", level: 2, parentId: 400 },
        { regionId: 408, name: "영월군", level: 2, parentId: 400 },
        { regionId: 409, name: "원주시", level: 2, parentId: 400 },
        { regionId: 410, name: "인제군", level: 2, parentId: 400 },
        { regionId: 411, name: "정선군", level: 2, parentId: 400 },
        { regionId: 412, name: "철원군", level: 2, parentId: 400 },
        { regionId: 413, name: "춘천시", level: 2, parentId: 400 },
        { regionId: 414, name: "태백시", level: 2, parentId: 400 },
        { regionId: 415, name: "평창군", level: 2, parentId: 400 },
        { regionId: 416, name: "홍천군", level: 2, parentId: 400 },
        { regionId: 417, name: "화천군", level: 2, parentId: 400 },
        { regionId: 418, name: "횡성군", level: 2, parentId: 400 },
        // 대전광역시
        { regionId: 500, name: "대전광역시", level: 1, parentId: null },
        { regionId: 501, name: "대덕구", level: 2, parentId: 500 },
        { regionId: 502, name: "동구", level: 2, parentId: 500 },
        { regionId: 503, name: "서구", level: 2, parentId: 500 },
        { regionId: 504, name: "유성구", level: 2, parentId: 500 },
        { regionId: 505, name: "중구", level: 2, parentId: 500 },
        // 세종특별자치시
        { regionId: 600, name: "세종특별자치시", level: 1, parentId: null },
        { regionId: 601, name: "세종시", level: 2, parentId: 600 },
        // 충청북도
        { regionId: 700, name: "충청북도", level: 1, parentId: null },
        { regionId: 701, name: "괴산군", level: 2, parentId: 700 },
        { regionId: 702, name: "단양군", level: 2, parentId: 700 },
        { regionId: 703, name: "보은군", level: 2, parentId: 700 },
        { regionId: 704, name: "영동군", level: 2, parentId: 700 },
        { regionId: 705, name: "옥천군", level: 2, parentId: 700 },
        { regionId: 706, name: "음성군", level: 2, parentId: 700 },
        { regionId: 707, name: "제천시", level: 2, parentId: 700 },
        { regionId: 708, name: "증평군", level: 2, parentId: 700 },
        { regionId: 709, name: "진천군", level: 2, parentId: 700 },
        { regionId: 710, name: "청원군", level: 2, parentId: 700 },
        { regionId: 711, name: "청주시", level: 2, parentId: 700 },
        { regionId: 712, name: "충주시", level: 2, parentId: 700 },
        // 충청남도
        { regionId: 800, name: "충청남도", level: 1, parentId: null },
        { regionId: 801, name: "계룡시", level: 2, parentId: 800 },
        { regionId: 802, name: "공주시", level: 2, parentId: 800 },
        { regionId: 803, name: "금산군", level: 2, parentId: 800 },
        { regionId: 804, name: "논산시", level: 2, parentId: 800 },
        { regionId: 805, name: "당진시", level: 2, parentId: 800 },
        { regionId: 806, name: "보령시", level: 2, parentId: 800 },
        { regionId: 807, name: "부여군", level: 2, parentId: 800 },
        { regionId: 808, name: "서산시", level: 2, parentId: 800 },
        { regionId: 809, name: "서천군", level: 2, parentId: 800 },
        { regionId: 810, name: "아산시", level: 2, parentId: 800 },
        { regionId: 811, name: "연기군", level: 2, parentId: 800 },
        { regionId: 812, name: "예산군", level: 2, parentId: 800 },
        { regionId: 813, name: "천안시", level: 2, parentId: 800 },
        { regionId: 814, name: "청양군", level: 2, parentId: 800 },
        { regionId: 815, name: "태안군", level: 2, parentId: 800 },
        { regionId: 816, name: "홍성군", level: 2, parentId: 800 },
        // 전라북도
        { regionId: 900, name: "전라북도", level: 1, parentId: null },
        { regionId: 901, name: "고창군", level: 2, parentId: 900 },
        { regionId: 902, name: "군산시", level: 2, parentId: 900 },
        { regionId: 903, name: "김제시", level: 2, parentId: 900 },
        { regionId: 904, name: "남원시", level: 2, parentId: 900 },
        { regionId: 905, name: "무주군", level: 2, parentId: 900 },
        { regionId: 906, name: "부안군", level: 2, parentId: 900 },
        { regionId: 907, name: "순창군", level: 2, parentId: 900 },
        { regionId: 908, name: "완주군", level: 2, parentId: 900 },
        { regionId: 909, name: "익산시", level: 2, parentId: 900 },
        { regionId: 910, name: "임실군", level: 2, parentId: 900 },
        { regionId: 911, name: "장수군", level: 2, parentId: 900 },
        { regionId: 912, name: "전주시", level: 2, parentId: 900 },
        { regionId: 913, name: "정읍시", level: 2, parentId: 900 },
        { regionId: 914, name: "진안군", level: 2, parentId: 900 },
        // 전라남도
        { regionId: 1000, name: "전라남도", level: 1, parentId: null },
        { regionId: 1001, name: "강진군", level: 2, parentId: 1000 },
        { regionId: 1002, name: "고흥군", level: 2, parentId: 1000 },
        { regionId: 1003, name: "곡성군", level: 2, parentId: 1000 },
        { regionId: 1004, name: "광양시", level: 2, parentId: 1000 },
        { regionId: 1005, name: "구례군", level: 2, parentId: 1000 },
        { regionId: 1006, name: "나주시", level: 2, parentId: 1000 },
        { regionId: 1007, name: "담양군", level: 2, parentId: 1000 },
        { regionId: 1008, name: "목포시", level: 2, parentId: 1000 },
        { regionId: 1009, name: "무안군", level: 2, parentId: 1000 },
        { regionId: 1010, name: "보성군", level: 2, parentId: 1000 },
        { regionId: 1011, name: "순천시", level: 2, parentId: 1000 },
        { regionId: 1012, name: "신안군", level: 2, parentId: 1000 },
        { regionId: 1013, name: "여수시", level: 2, parentId: 1000 },
        { regionId: 1014, name: "영광군", level: 2, parentId: 1000 },
        { regionId: 1015, name: "영암군", level: 2, parentId: 1000 },
        { regionId: 1016, name: "완도군", level: 2, parentId: 1000 },
        { regionId: 1017, name: "장성군", level: 2, parentId: 1000 },
        { regionId: 1018, name: "장흥군", level: 2, parentId: 1000 },
        { regionId: 1019, name: "진도군", level: 2, parentId: 1000 },
        { regionId: 1020, name: "함평군", level: 2, parentId: 1000 },
        { regionId: 1021, name: "해남군", level: 2, parentId: 1000 },
        { regionId: 1022, name: "화순군", level: 2, parentId: 1000 },
        // 광주광역시
        { regionId: 1100, name: "광주광역시", level: 1, parentId: null },
        { regionId: 1101, name: "광산구", level: 2, parentId: 1100 },
        { regionId: 1102, name: "남구", level: 2, parentId: 1100 },
        { regionId: 1103, name: "동구", level: 2, parentId: 1100 },
        { regionId: 1104, name: "북구", level: 2, parentId: 1100 },
        { regionId: 1105, name: "서구", level: 2, parentId: 1100 },
        // 대구광역시
        { regionId: 1200, name: "대구광역시", level: 1, parentId: null },
        { regionId: 1201, name: "남구", level: 2, parentId: 1200 },
        { regionId: 1202, name: "달서구", level: 2, parentId: 1200 },
        { regionId: 1203, name: "달성군", level: 2, parentId: 1200 },
        { regionId: 1204, name: "동구", level: 2, parentId: 1200 },
        { regionId: 1205, name: "북구", level: 2, parentId: 1200 },
        { regionId: 1206, name: "서구", level: 2, parentId: 1200 },
        { regionId: 1207, name: "수성구", level: 2, parentId: 1200 },
        { regionId: 1208, name: "중구", level: 2, parentId: 1200 },
        // 경상북도
        { regionId: 1300, name: "경상북도", level: 1, parentId: null },
        { regionId: 1301, name: "경산시", level: 2, parentId: 1300 },
        { regionId: 1302, name: "경주시", level: 2, parentId: 1300 },
        { regionId: 1303, name: "고령군", level: 2, parentId: 1300 },
        { regionId: 1304, name: "구미시", level: 2, parentId: 1300 },
        { regionId: 1305, name: "군위군", level: 2, parentId: 1300 },
        { regionId: 1306, name: "김천시", level: 2, parentId: 1300 },
        { regionId: 1307, name: "문경시", level: 2, parentId: 1300 },
        { regionId: 1308, name: "봉화군", level: 2, parentId: 1300 },
        { regionId: 1309, name: "상주시", level: 2, parentId: 1300 },
        { regionId: 1310, name: "성주군", level: 2, parentId: 1300 },
        { regionId: 1311, name: "안동시", level: 2, parentId: 1300 },
        { regionId: 1312, name: "영덕군", level: 2, parentId: 1300 },
        { regionId: 1313, name: "영양군", level: 2, parentId: 1300 },
        { regionId: 1314, name: "영주시", level: 2, parentId: 1300 },
        { regionId: 1315, name: "영천시", level: 2, parentId: 1300 },
        { regionId: 1316, name: "예천군", level: 2, parentId: 1300 },
        { regionId: 1317, name: "울릉군", level: 2, parentId: 1300 },
        { regionId: 1318, name: "울진군", level: 2, parentId: 1300 },
        { regionId: 1319, name: "의성군", level: 2, parentId: 1300 },
        { regionId: 1320, name: "청도군", level: 2, parentId: 1300 },
        { regionId: 1321, name: "청송군", level: 2, parentId: 1300 },
        { regionId: 1322, name: "칠곡군", level: 2, parentId: 1300 },
        { regionId: 1323, name: "포항시", level: 2, parentId: 1300 },
        // 경상남도
        { regionId: 1400, name: "경상남도", level: 1, parentId: null },
        { regionId: 1401, name: "거제시", level: 2, parentId: 1400 },
        { regionId: 1402, name: "거창군", level: 2, parentId: 1400 },
        { regionId: 1403, name: "고성군", level: 2, parentId: 1400 },
        { regionId: 1404, name: "김해시", level: 2, parentId: 1400 },
        { regionId: 1405, name: "남해군", level: 2, parentId: 1400 },
        { regionId: 1406, name: "마산시", level: 2, parentId: 1400 },
        { regionId: 1407, name: "밀양시", level: 2, parentId: 1400 },
        { regionId: 1408, name: "사천시", level: 2, parentId: 1400 },
        { regionId: 1409, name: "산청군", level: 2, parentId: 1400 },
        { regionId: 1410, name: "양산시", level: 2, parentId: 1400 },
        { regionId: 1411, name: "의령군", level: 2, parentId: 1400 },
        { regionId: 1412, name: "진주시", level: 2, parentId: 1400 },
        { regionId: 1413, name: "진해시", level: 2, parentId: 1400 },
        { regionId: 1414, name: "창녕군", level: 2, parentId: 1400 },
        { regionId: 1415, name: "창원시", level: 2, parentId: 1400 },
        { regionId: 1416, name: "통영시", level: 2, parentId: 1400 },
        { regionId: 1417, name: "하동군", level: 2, parentId: 1400 },
        { regionId: 1418, name: "함안군", level: 2, parentId: 1400 },
        { regionId: 1419, name: "합천군", level: 2, parentId: 1400 },
        // 부산광역시
        { regionId: 1500, name: "부산광역시", level: 1, parentId: null },
        { regionId: 1501, name: "강서구", level: 2, parentId: 1500 },
        { regionId: 1502, name: "금정구", level: 2, parentId: 1500 },
        { regionId: 1503, name: "기장군", level: 2, parentId: 1500 },
        { regionId: 1504, name: "남구", level: 2, parentId: 1500 },
        { regionId: 1505, name: "동구", level: 2, parentId: 1500 },
        { regionId: 1506, name: "동래구", level: 2, parentId: 1500 },
        { regionId: 1507, name: "부산진구", level: 2, parentId: 1500 },
        { regionId: 1508, name: "북구", level: 2, parentId: 1500 },
        { regionId: 1509, name: "사상구", level: 2, parentId: 1500 },
        { regionId: 1510, name: "사하구", level: 2, parentId: 1500 },
        { regionId: 1511, name: "서구", level: 2, parentId: 1500 },
        { regionId: 1512, name: "수영구", level: 2, parentId: 1500 },
        { regionId: 1513, name: "연제구", level: 2, parentId: 1500 },
        { regionId: 1514, name: "영도구", level: 2, parentId: 1500 },
        { regionId: 1515, name: "중구", level: 2, parentId: 1500 },
        { regionId: 1516, name: "해운대구", level: 2, parentId: 1500 },
        // 울산광역시
        { regionId: 1600, name: "울산광역시", level: 1, parentId: null },
        { regionId: 1601, name: "남구", level: 2, parentId: 1600 },
        { regionId: 1602, name: "동구", level: 2, parentId: 1600 },
        { regionId: 1603, name: "북구", level: 2, parentId: 1600 },
        { regionId: 1604, name: "울주군", level: 2, parentId: 1600 },
        { regionId: 1605, name: "중구", level: 2, parentId: 1600 },
        // 제주특별자치도
        { regionId: 1700, name: "제주특별자치도", level: 1, parentId: null },
        { regionId: 1701, name: "서귀포시", level: 2, parentId: 1700 },
        { regionId: 1702, name: "제주시", level: 2, parentId: 1700 },
      ],
    });
  }

  // ============ POST /partner/campaign/create ============
  // 10번 API: 캠페인 등록하기
  if (req.method === "POST" && (req.path === "/partner/campaign/create" || req.originalUrl === "/partner/campaign/create")) {
    const body = req.body || {};
    const campaignId = Date.now();

    // ID → 이름 역조회
    const CATEGORY_MAP = { 1: "식품", 2: "뷰티", 3: "가전", 4: "유아동", 5: "여가", 6: "서비스", 7: "생활", 8: "패션", 9: "가구", 10: "디지털", 11: "문화", 12: "반려동물", 13: "기타" };
    const CHANNEL_MAP = { 1: "NAVER_BLOG", 2: "NAVER_CLIP", 3: "INSTAGRAM", 4: "INSTAGRAM_REELS", 5: "YOUTUBE", 6: "YOUTUBE_SHORTS" };
    const categoryId = Number(body.categoryId) || 1;
    const channelId = Number(body.requiredPlatformId) || 1;
    const categoryName = CATEGORY_MAP[categoryId] || "기타";
    const channelName = CHANNEL_MAP[channelId] || "NAVER_BLOG";
    const campaignType = body.type || "DELIVERY";

    // multer가 파싱한 파일 → buffer를 data URL로 변환하여 저장
    console.log("[POST /partner/campaign/create] req.files:", req.files ? req.files.map(function(f) { return { fieldname: f.fieldname, size: f.size, mimetype: f.mimetype, bufferLen: f.buffer ? f.buffer.length : 0 }; }) : "NO FILES");
    console.log("[POST /partner/campaign/create] content-type:", req.headers["content-type"]);
    const thumbFile = req.files && req.files.find(function(f) { return f.fieldname === "thumbnailImage"; });
    const detailFiles = req.files ? req.files.filter(function(f) { return f.fieldname === "detailImages"; }) : [];
    const defaultThumb = "/images/main/campaign_img/eximg_1.png";
    // multer가 파싱한 파일: buffer가 비어있으면(0바이트) 기본 이미지 사용
    const thumbnailUrl = (thumbFile && thumbFile.buffer && thumbFile.buffer.length > 0)
      ? "data:" + thumbFile.mimetype + ";base64," + thumbFile.buffer.toString("base64")
      : (body.thumbnailUrl || defaultThumb);
    const detailImageUrls = detailFiles.length > 0
      ? detailFiles.filter(function(f) { return f.buffer && f.buffer.length > 0; }).map(function(f) { return "data:" + f.mimetype + ";base64," + f.buffer.toString("base64"); })
      : [];

    // 지역 정보 조회 (VISIT 전용) — API 09 regions와 동일한 ID 체계
    var regionId = Number(body.regionId) || null;
    var regionObj = null;
    if (regionId) {
      // level 1 (시/도) ID → name 매핑
      var REGION_L1 = { 100: "서울특별시", 200: "인천광역시", 300: "경기도", 400: "강원특별자치도", 500: "대전광역시", 600: "세종특별자치시", 700: "충청북도", 800: "충청남도", 900: "전라북도", 1000: "전라남도", 1100: "광주광역시", 1200: "대구광역시", 1300: "경상북도", 1400: "경상남도", 1500: "부산광역시", 1600: "울산광역시", 1700: "제주특별자치도" };
      // level 2 (시/구/군) ID → name 매핑 — API 09 regions와 동일
      var REGION_L2 = {
        101:"강북구",102:"관악구",103:"구로구",104:"노원구",105:"동대문구",106:"마포구",107:"서초구",108:"성북구",109:"양천구",110:"용산구",111:"강남구",112:"강서구",113:"광진구",114:"금천구",115:"도봉구",116:"동작구",117:"서대문구",118:"성동구",119:"송파구",120:"영등포구",121:"은평구",122:"종로구",123:"중구",124:"중랑구",125:"강동구",
        201:"강화군",202:"검단구",203:"계양구",204:"남구",205:"남동구",206:"미추홀구",207:"부평구",208:"서구",209:"연수구",210:"영종구",211:"옹진군",212:"제물포구",
        301:"고양시",302:"광명시",303:"구리시",304:"김포시",305:"동두천시",306:"성남시",307:"시흥시",308:"안성시",309:"양주시",310:"여주시",311:"가평군",312:"과천시",313:"광주시",314:"군포시",315:"남양주시",316:"부천시",317:"수원시",318:"안산시",319:"안양시",320:"양평군",321:"연천군",322:"오산시",323:"용인시",324:"의왕시",325:"의정부시",326:"이천시",327:"파주시",328:"평택시",329:"포천시",330:"하남시",331:"화성시",
        401:"강릉시",402:"고성군",403:"동해시",404:"삼척시",405:"속초시",406:"양구군",407:"양양군",408:"영월군",409:"원주시",410:"인제군",411:"정선군",412:"철원군",413:"춘천시",414:"태백시",415:"평창군",416:"홍천군",417:"화천군",418:"횡성군",
        501:"대덕구",502:"동구",503:"서구",504:"유성구",505:"중구",
        601:"세종시",
        701:"제천시",702:"청주시",703:"충주시",704:"괴산군",705:"단양군",706:"보은군",707:"영동군",708:"옥천군",709:"음성군",710:"증평군",711:"진천군",
        801:"공주시",802:"논산시",803:"당진시",804:"보령시",805:"서산시",806:"아산시",807:"천안시",808:"금산군",809:"부여군",810:"서천군",811:"예산군",812:"청양군",813:"태안군",814:"홍성군",
        901:"군산시",902:"김제시",903:"남원시",904:"전주시",905:"정읍시",906:"익산시",907:"고창군",908:"무주군",909:"부안군",910:"순창군",911:"완주군",912:"임실군",913:"장수군",914:"진안군",
        1001:"광양시",1002:"나주시",1003:"목포시",1004:"순천시",1005:"여수시",1006:"강진군",1007:"고흥군",1008:"곡성군",1009:"구례군",1010:"담양군",1011:"무안군",1012:"보성군",1013:"신안군",1014:"영광군",1015:"영암군",1016:"완도군",1017:"장성군",1018:"장흥군",1019:"진도군",1020:"함평군",1021:"해남군",1022:"화순군",
        1101:"광산구",1102:"남구",1103:"동구",1104:"북구",1105:"서구",
        1201:"남구",1202:"달서구",1203:"동구",1204:"북구",1205:"서구",1206:"수성구",1207:"중구",1208:"달성군",
        1301:"경산시",1302:"경주시",1303:"구미시",1304:"김천시",1305:"문경시",1306:"상주시",1307:"안동시",1308:"영주시",1309:"영천시",1310:"포항시",1311:"고령군",1312:"군위군",1313:"봉화군",1314:"성주군",1315:"영덕군",1316:"영양군",1317:"예천군",1318:"울릉군",1319:"울진군",1320:"의성군",1321:"청도군",1322:"청송군",1323:"칠곡군",
        1401:"거제시",1402:"김해시",1403:"밀양시",1404:"사천시",1405:"양산시",1406:"진주시",1407:"창원시",1408:"통영시",1409:"거창군",1410:"고성군",1411:"남해군",1412:"산청군",1413:"의령군",1414:"창녕군",1415:"하동군",1416:"함안군",1417:"함양군",1418:"합천군",
        1501:"강서구",1502:"금정구",1503:"기장군",1504:"남구",1505:"동구",1506:"동래구",1507:"부산진구",1508:"북구",1509:"사상구",1510:"사하구",1511:"서구",1512:"수영구",1513:"연제구",1514:"영도구",1515:"중구",1516:"해운대구",
        1601:"남구",1602:"동구",1603:"북구",1604:"중구",1605:"울주군",
        1701:"서귀포시",1702:"제주시"
      };
      if (REGION_L1[regionId]) {
        regionObj = { regionId: regionId, name: REGION_L1[regionId], level: 1, parentId: null };
      } else {
        // level 2 — parentId 계산: 100단위 내림
        var parentId = Math.floor(regionId / 100) * 100;
        var regionName = REGION_L2[regionId] || body.subRegion || ("지역 " + regionId);
        var parentName = REGION_L1[parentId] || "";
        regionObj = { regionId: regionId, name: regionName, level: 2, parentId: parentId, parentName: parentName };
      }
    }

    // json-server DB(campaigns 컬렉션)에도 저장 → 캠페인 관리/상세 페이지에서 조회 가능
    const now = new Date().toISOString();
    // 날짜 기반 status 결정 (문자열 비교로 타임존 이슈 방지)
    const todayStr = new Date().toISOString().slice(0, 10);
    const rsStr = (body.recruitStartAt || "").slice(0, 10);
    const reStr = (body.recruitEndAt || "").slice(0, 10);
    const csStr = (body.contentStartAt || "").slice(0, 10);
    const ceStr = (body.contentEndAt || "").slice(0, 10);
    let initialStatus = "REGISTERING";
    if (ceStr && ceStr < todayStr) {
      initialStatus = "CLOSED";
    } else if (csStr && csStr <= todayStr) {
      initialStatus = "PURCHASING";
    } else if (reStr && reStr < todayStr) {
      initialStatus = "SELECTING";
    } else if (rsStr && rsStr <= todayStr) {
      initialStatus = "RECRUITING";
    }
    console.log("[CAMPAIGN CREATE] dates:", { todayStr, rsStr, reStr, csStr, ceStr, initialStatus });
    const dbRecord = {
      id: campaignId,
      campaignId,
      partner_id: body.partner_id || currentSession.partnerId || 501,
      type: campaignType,
      campaignType: campaignType,
      status: initialStatus,
      isEmergency: body.is_urgent === "true" || body.is_urgent === true,
      title: body.title || "새 캠페인",
      // 이미지
      thumbnailUrl: thumbnailUrl,
      thumbnail: { url: thumbnailUrl },
      detailImages: detailImageUrls,
      // 카테고리/플랫폼
      category: { categoryId: categoryId, categoryName: categoryName },
      platform: channelName,
      requiredPlatform: { channelId: channelId, channelName: channelName },
      // 지역 (VISIT 전용)
      region: regionObj,
      // 모집 정보
      recruitLimit: Number(body.recruitLimit) || 10,
      recruitCount: Number(body.recruitLimit) || 10,
      recruitStartAt: body.recruitStartAt || now,
      recruitEndAt: body.recruitEndAt || now,
      applicationStartDate: body.recruitStartAt || now,
      applicationEndDate: body.recruitEndAt || now,
      campaignStartDate: body.contentStartAt || now,
      campaignEndDate: body.contentEndAt || now,
      recruit: {
        recruitLimit: Number(body.recruitLimit) || 10,
        recruitStartAt: body.recruitStartAt || now,
        recruitEndAt: body.recruitEndAt || now,
        selectedAt: body.selectedAt || now,
        contentStartAt: body.contentStartAt || now,
        contentEndAt: body.contentEndAt || now,
      },
      content: {
        contentStartAt: body.contentStartAt || now,
        contentEndAt: body.contentEndAt || now,
      },
      // 포인트
      reward: {
        extraRewardPoint: Number(body.extraRewardPoint) || 0,
        paymentRewardPoint: Number(body.paymentRewardPoint) || 0,
      },
      // 미션 설정
      keywordPolicy: {
        keyword: body.keyword || "",
        minTextLength: Number(body.minTextLength) || 0,
        minPhotoCount: Number(body.minImageCount) || 0,
        minVideoCount: Number(body.videoCount) || 0,
        minVideoDuration: Number(body.videoDuration) || 0,
        requireBodyLink: body.requireLinkAttachment === "true" || body.requireLinkAttachment === true,
        requireKeywordAttachment: body.requireKeywordAttachment === "true" || body.requireKeywordAttachment === true,
      },
      // 참여/제출 옵션
      adultOnly: body.adultOnly === "true" || body.adultOnly === true,
      allowReParticipation: body.allowReParticipation === "true" || body.allowReParticipation === true,
      allowLateSubmission: body.allowLateSubmission === "true" || body.allowLateSubmission === true,
      // 미션형 전용
      requireContentLink: body.requireContentLink === "true" || body.requireContentLink === true,
      requireContentImage: body.requireContentImage === "true" || body.requireContentImage === true,
      // 구매평 전용
      purchasePeriod: body.purchasePeriod || "",
      purchaseLink: body.promotionUrl || "",
      purchaseInfo: body.promotionUrl ? { purchaseLink: body.promotionUrl || "", purchasePoint: Number(body.paymentRewardPoint) || 0 } : null,
      description: body.description || "",
      promotionUrl: body.promotionUrl || "",
      promotionLink: body.promotionUrl || "",
      keyword: body.keyword || "",
      notification: body.notification || "",
      visitAddress: body.visitAddress || "",
      visitZipCode: body.visitZipCode || "",
      visitBaseAddress: body.visitBaseAddress || "",
      visitDetailAddress: body.visitDetailAddress || "",
      addressDetail: body.addressDetail || "",
      addressGuide: body.addressDetail || "",
      visitLink: body.visitLink || "",
      contact_phone: body.contact_phone || "",
      ftc_agreement: body.ftc_agreement === "true" || body.ftc_agreement === true,
      appliedCount: 0,
      currentApplicants: 0,
      selectedCount: 0,
      metrics: { appliedCount: 0, selectedCount: 0, applicationRate: 0 },
      created_at: now,
      updated_at: now,
    };
    pushCampaign(dbRecord);

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: {
        campaignId,
        partnerId: 501,
        type: campaignType,
        status: "REGISTERING",
        title: body.title || "새 캠페인",
        category: { categoryId: categoryId, categoryName: categoryName },
        requiredPlatform: { channelId: channelId, channelName: channelName },
        thumbnail: { attachmentId: 1, fileId: 1, url: thumbnailUrl },
        detailImages: dbRecord.detailImages,
        recruit: dbRecord.recruit,
        reward: dbRecord.reward,
        keywordPolicy: dbRecord.keywordPolicy,
        regAt: now,
      },
      partner: { partnerId: 501, currentPoint: 400000 },
      next: { action: "REDIRECT", redirectPath: "/partner/campaign_management" },
    });
  }

  // ============ POST /partner/campaign/draft ============
  // 11번 API: 캠페인 임시저장
  if (req.method === "POST" && (req.path === "/partner/campaign/draft" || (req.originalUrl && req.originalUrl.startsWith("/partner/campaign/draft")))) {
    const body = req.body || {};
    const campaignId = Date.now();

    // categoryId → categoryName 역조회
    const CATEGORY_MAP = { 1: "식품", 2: "뷰티", 3: "가전", 4: "유아동", 5: "여가", 6: "서비스", 7: "생활", 8: "패션", 9: "가구", 10: "디지털", 11: "문화", 12: "반려동물", 13: "기타" };
    const CHANNEL_MAP = { 1: "NAVER_BLOG", 2: "NAVER_CLIP", 3: "INSTAGRAM", 4: "INSTAGRAM_REELS", 5: "YOUTUBE", 6: "YOUTUBE_SHORTS" };

    // 인메모리에 draft 데이터 저장 (API 12 불러오기용)
    draftStore[campaignId] = {
      campaignId,
      partnerId: 501,
      type: body.type || "DELIVERY",
      status: "DRAFT",
      title: body.title || "",
      description: body.description || undefined,
      category: body.categoryId ? { categoryId: Number(body.categoryId), categoryName: CATEGORY_MAP[Number(body.categoryId)] || "기타" } : null,
      requiredPlatform: body.requiredPlatformId ? { channelId: Number(body.requiredPlatformId), channelName: CHANNEL_MAP[Number(body.requiredPlatformId)] || "NAVER_BLOG" } : undefined,
      thumbnail: body.thumbnailUrl ? { attachmentId: 1, fileId: 1, url: body.thumbnailUrl } : undefined,
      detailImages: body.detailImageUrls ? body.detailImageUrls.map((url, i) => ({ attachmentId: i + 1, fileId: i + 1, url, displayOrder: i + 1 })) : undefined,
      recruit: (body.recruitLimit || body.recruitStartAt) ? {
        recruitLimit: Number(body.recruitLimit) || 0,
        recruitStartAt: body.recruitStartAt || "",
        recruitEndAt: body.recruitEndAt || "",
        selectedAt: body.selectedAt || undefined,
        contentStartAt: body.contentStartAt || undefined,
        contentEndAt: body.contentEndAt || undefined,
      } : undefined,
      reward: (body.extraRewardPoint != null || body.paymentRewardPoint != null) ? {
        extraRewardPoint: Number(body.extraRewardPoint) || 0,
        paymentRewardPoint: Number(body.paymentRewardPoint) || 0,
      } : undefined,
      promotionUrl: body.promotionUrl || undefined,
      keyword: body.keyword || undefined,
      notification: body.notification || undefined,
      visitAddress: body.visitAddress || undefined,
      visitZipCode: body.visitZipCode || undefined,
      visitBaseAddress: body.visitBaseAddress || undefined,
      visitDetailAddress: body.visitDetailAddress || undefined,
      addressDetail: body.addressDetail || undefined,
      visitLink: body.visitLink || undefined,
      region: body.region || undefined,
      subRegion: body.subRegion || undefined,
      savedAt: new Date().toISOString(),
    };
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: draftStore[campaignId],
      message: "임시저장되었습니다.",
    });
  }

  // ============ GET /partner/campaign/draft/:campaignId ============
  // 12번 API: 임시저장 캠페인 불러오기
  if (req.method === "GET" && (req.path.match(/^\/partner\/campaign\/draft\/\d+$/) || (req.originalUrl && req.originalUrl.match(/^\/partner\/campaign\/draft\/\d+$/)))) {
    const campaignId = Number(req.path.split("/").pop());
    const draft = draftStore[campaignId];
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: draft || {
        campaignId,
        partnerId: 501,
        type: "DELIVERY",
        status: "DRAFT",
        title: "",
        savedAt: new Date().toISOString(),
      },
    });
  }

  // ============ GET /partner/campaign/edit/:campaignId or /partner/campaign/edit/:type/:campaignId ============
  // 15번 API: 캠페인 수정페이지 조회
  if (req.method === "GET" && (req.path.match(/^\/partner\/campaign\/edit\/\d+$/) || req.path.match(/^\/partner\/campaign\/edit\/[A-Z]+\/\d+$/))) {
    const campaignId = Number(req.path.split("/").pop());
    const campaigns = getCampaigns();
    const campaign = campaigns.find(c => c.id === campaignId || c.campaignId === campaignId);

    if (!campaign) {
      return res.status(404).json({ result: "NOT_FOUND", message: "캠페인을 찾을 수 없습니다." });
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      partner: {
        partnerId: 501,
        businessName: "주식회사 마크엑스",
        currentPoint: 500000,
      },
      campaign: {
        campaignId: campaign.id || campaign.campaignId,
        partnerId: campaign.partner_id || 501,
        type: campaign.type || "DELIVERY",
        status: campaign.status || "REGISTERING",
        title: campaign.title || "",
        description: campaign.description || "",
        category: campaign.category || { categoryId: 1, categoryName: "식품" },
        requiredPlatform: campaign.requiredPlatform || null,
        region: campaign.region && typeof campaign.region === "object" ? campaign.region : (campaign.region ? { regionId: 0, name: String(campaign.region), level: 2, parentId: null } : null),
        thumbnail: campaign.thumbnail || { attachmentId: 1, fileId: 1, url: campaign.thumbnailUrl || "" },
        detailImages: (campaign.detailImages || []).map((img, i) => (
          typeof img === "string"
            ? { attachmentId: i + 100, fileId: i + 200, url: img, displayOrder: i + 1 }
            : img
        )),
        recruit: {
          recruitLimit: campaign.recruit?.recruitLimit || campaign.recruitLimit || 10,
          recruitStartAt: campaign.recruit?.recruitStartAt || campaign.recruitStartAt || new Date().toISOString(),
          recruitEndAt: campaign.recruit?.recruitEndAt || campaign.recruitEndAt || new Date().toISOString(),
          selectedAt: campaign.recruit?.selectedAt || campaign.selectedAt || new Date().toISOString(),
          contentStartAt: campaign.recruit?.contentStartAt || campaign.content?.contentStartAt || new Date().toISOString(),
          contentEndAt: campaign.recruit?.contentEndAt || campaign.content?.contentEndAt || new Date().toISOString(),
        },
        reward: campaign.reward || { extraRewardPoint: campaign.additionalPoint || 0, paymentRewardPoint: 0 },
        promotionUrl: campaign.promotionLink || campaign.promotionUrl || campaign.purchaseLink || "",
        keyword: campaign.keywordPolicy?.keyword || "",
        notification: campaign.notification || "",
        visitAddress: campaign.visitAddress || campaign.visitBaseAddress || "",
        visitZipCode: campaign.visitZipCode || "",
        visitBaseAddress: campaign.visitBaseAddress || "",
        visitDetailAddress: campaign.visitDetailAddress || "",
        addressGuide: campaign.addressGuide || campaign.addressDetail || "",
        visitLink: campaign.visitLink || "",
        keywordPolicy: campaign.keywordPolicy || null,
        contact_phone: campaign.contact_phone || "",
        isEmergency: campaign.isEmergency || false,
        adultOnly: campaign.adultOnly || false,
        allowReParticipation: campaign.allowReParticipation || false,
        allowLateSubmission: campaign.allowLateSubmission || false,
        // 미션형 전용
        requireContentLink: campaign.requireContentLink || false,
        requireContentImage: campaign.requireContentImage || false,
        // 구매평 전용
        purchaseInfo: campaign.purchaseInfo || (campaign.purchaseLink ? { purchaseLink: campaign.purchaseLink, purchasePoint: campaign.reward?.paymentRewardPoint || 0 } : null),
        purchasePeriod: campaign.purchasePeriod || "",
        regAt: campaign.regAt || campaign.created_at || new Date().toISOString(),
        updatedAt: campaign.updatedAt || campaign.updated_at || new Date().toISOString(),
      },
      categories: [
        { categoryId: 1, categoryName: "식품" },
        { categoryId: 2, categoryName: "뷰티" },
        { categoryId: 3, categoryName: "가전" },
        { categoryId: 4, categoryName: "유아동" },
        { categoryId: 5, categoryName: "여가" },
        { categoryId: 6, categoryName: "서비스" },
        { categoryId: 7, categoryName: "생활" },
        { categoryId: 8, categoryName: "패션" },
        { categoryId: 9, categoryName: "가구" },
        { categoryId: 10, categoryName: "디지털" },
        { categoryId: 11, categoryName: "문화" },
        { categoryId: 12, categoryName: "반려동물" },
        { categoryId: 13, categoryName: "기타" },
      ],
      channels: [
        { channelId: 1, channelName: "NAVER_BLOG" },
        { channelId: 2, channelName: "NAVER_CLIP" },
        { channelId: 3, channelName: "INSTAGRAM" },
        { channelId: 4, channelName: "INSTAGRAM_REELS" },
        { channelId: 5, channelName: "YOUTUBE" },
        { channelId: 6, channelName: "YOUTUBE_SHORTS" },
      ],
      regions: [
        { regionId: 100, name: "서울특별시", level: 1, parentId: null },
        { regionId: 101, name: "강북구", level: 2, parentId: 100 },
        { regionId: 102, name: "관악구", level: 2, parentId: 100 },
        { regionId: 103, name: "구로구", level: 2, parentId: 100 },
        { regionId: 104, name: "노원구", level: 2, parentId: 100 },
        { regionId: 105, name: "동대문구", level: 2, parentId: 100 },
        { regionId: 106, name: "마포구", level: 2, parentId: 100 },
        { regionId: 107, name: "서초구", level: 2, parentId: 100 },
        { regionId: 108, name: "성북구", level: 2, parentId: 100 },
        { regionId: 109, name: "양천구", level: 2, parentId: 100 },
        { regionId: 110, name: "용산구", level: 2, parentId: 100 },
        { regionId: 111, name: "강남구", level: 2, parentId: 100 },
        { regionId: 112, name: "강서구", level: 2, parentId: 100 },
        { regionId: 113, name: "광진구", level: 2, parentId: 100 },
        { regionId: 114, name: "금천구", level: 2, parentId: 100 },
        { regionId: 115, name: "도봉구", level: 2, parentId: 100 },
        { regionId: 116, name: "동작구", level: 2, parentId: 100 },
        { regionId: 117, name: "서대문구", level: 2, parentId: 100 },
        { regionId: 118, name: "성동구", level: 2, parentId: 100 },
        { regionId: 119, name: "송파구", level: 2, parentId: 100 },
        { regionId: 120, name: "영등포구", level: 2, parentId: 100 },
        { regionId: 121, name: "은평구", level: 2, parentId: 100 },
        { regionId: 122, name: "종로구", level: 2, parentId: 100 },
        { regionId: 123, name: "중구", level: 2, parentId: 100 },
        { regionId: 124, name: "중랑구", level: 2, parentId: 100 },
        { regionId: 125, name: "강동구", level: 2, parentId: 100 },
        { regionId: 200, name: "인천광역시", level: 1, parentId: null },
        { regionId: 201, name: "강화군", level: 2, parentId: 200 },
        { regionId: 202, name: "검단구", level: 2, parentId: 200 },
        { regionId: 203, name: "계양구", level: 2, parentId: 200 },
        { regionId: 204, name: "남구", level: 2, parentId: 200 },
        { regionId: 205, name: "남동구", level: 2, parentId: 200 },
        { regionId: 206, name: "미추홀구", level: 2, parentId: 200 },
        { regionId: 207, name: "부평구", level: 2, parentId: 200 },
        { regionId: 208, name: "서구", level: 2, parentId: 200 },
        { regionId: 209, name: "연수구", level: 2, parentId: 200 },
        { regionId: 210, name: "영종구", level: 2, parentId: 200 },
        { regionId: 211, name: "옹진군", level: 2, parentId: 200 },
        { regionId: 212, name: "제물포구", level: 2, parentId: 200 },
        { regionId: 300, name: "경기도", level: 1, parentId: null },
        { regionId: 301, name: "고양시", level: 2, parentId: 300 },
        { regionId: 302, name: "광명시", level: 2, parentId: 300 },
        { regionId: 303, name: "구리시", level: 2, parentId: 300 },
        { regionId: 304, name: "김포시", level: 2, parentId: 300 },
        { regionId: 305, name: "동두천시", level: 2, parentId: 300 },
        { regionId: 306, name: "성남시", level: 2, parentId: 300 },
        { regionId: 307, name: "시흥시", level: 2, parentId: 300 },
        { regionId: 308, name: "안성시", level: 2, parentId: 300 },
        { regionId: 309, name: "양주시", level: 2, parentId: 300 },
        { regionId: 310, name: "여주시", level: 2, parentId: 300 },
        { regionId: 311, name: "가평군", level: 2, parentId: 300 },
        { regionId: 312, name: "과천시", level: 2, parentId: 300 },
        { regionId: 313, name: "광주시", level: 2, parentId: 300 },
        { regionId: 314, name: "군포시", level: 2, parentId: 300 },
        { regionId: 315, name: "남양주시", level: 2, parentId: 300 },
        { regionId: 316, name: "부천시", level: 2, parentId: 300 },
        { regionId: 317, name: "수원시", level: 2, parentId: 300 },
        { regionId: 318, name: "안산시", level: 2, parentId: 300 },
        { regionId: 319, name: "안양시", level: 2, parentId: 300 },
        { regionId: 320, name: "양평군", level: 2, parentId: 300 },
        { regionId: 321, name: "연천군", level: 2, parentId: 300 },
        { regionId: 322, name: "오산시", level: 2, parentId: 300 },
        { regionId: 323, name: "용인시", level: 2, parentId: 300 },
        { regionId: 324, name: "의왕시", level: 2, parentId: 300 },
        { regionId: 325, name: "의정부시", level: 2, parentId: 300 },
        { regionId: 326, name: "이천시", level: 2, parentId: 300 },
        { regionId: 327, name: "파주시", level: 2, parentId: 300 },
        { regionId: 328, name: "평택시", level: 2, parentId: 300 },
        { regionId: 329, name: "포천시", level: 2, parentId: 300 },
        { regionId: 330, name: "하남시", level: 2, parentId: 300 },
        { regionId: 331, name: "화성시", level: 2, parentId: 300 },
        { regionId: 400, name: "강원특별자치도", level: 1, parentId: null },
        { regionId: 500, name: "대전광역시", level: 1, parentId: null },
        { regionId: 600, name: "세종특별자치시", level: 1, parentId: null },
        { regionId: 700, name: "충청북도", level: 1, parentId: null },
        { regionId: 800, name: "충청남도", level: 1, parentId: null },
        { regionId: 900, name: "전라북도", level: 1, parentId: null },
        { regionId: 1000, name: "전라남도", level: 1, parentId: null },
        { regionId: 1100, name: "광주광역시", level: 1, parentId: null },
        { regionId: 1200, name: "대구광역시", level: 1, parentId: null },
        { regionId: 1300, name: "경상북도", level: 1, parentId: null },
        { regionId: 1400, name: "경상남도", level: 1, parentId: null },
        { regionId: 1500, name: "부산광역시", level: 1, parentId: null },
        { regionId: 1600, name: "울산광역시", level: 1, parentId: null },
        { regionId: 1700, name: "제주특별자치도", level: 1, parentId: null },
      ],
    });
  }

  // ============ POST /partner/campaign/edit/:campaignId or /partner/campaign/edit/:type/:campaignId ============
  // 16번 API: 캠페인 수정하기
  if (req.method === "POST" && (req.path.match(/^\/partner\/campaign\/edit\/\d+$/) || req.path.match(/^\/partner\/campaign\/edit\/[A-Z]+\/\d+$/))) {
    const campaignId = Number(req.path.split("/").pop());
    const body = req.body || {};

    // json-server DB 업데이트 (lowdb API 사용)
    let updated = null;
    if (db) {
      try {
        const campaign = db.get("campaigns").find(function(c) {
          return c.id === campaignId || c.campaignId === campaignId;
        });
        if (campaign.value()) {
          // body에서 undefined/null 제거 후 병합
          const cleanBody = {};
          Object.keys(body).forEach(function(key) {
            if (body[key] !== undefined && body[key] !== null) {
              cleanBody[key] = body[key];
            }
          });
          cleanBody.updated_at = new Date().toISOString();
          // 필드명 매핑: promotionUrl → promotionLink (DB 필드명)
          if (cleanBody.promotionUrl && !cleanBody.promotionLink) {
            cleanBody.promotionLink = cleanBody.promotionUrl;
          }

          // 날짜 변경 시 status 재계산 (등록 로직과 동일)
          const existingCampaign = campaign.value();
          const todayStr = new Date().toISOString().slice(0, 10);
          const rsStr = (cleanBody.recruitStartAt || existingCampaign.recruitStartAt || (existingCampaign.recruit && existingCampaign.recruit.recruitStartAt) || "").slice(0, 10);
          const reStr = (cleanBody.recruitEndAt || existingCampaign.recruitEndAt || (existingCampaign.recruit && existingCampaign.recruit.recruitEndAt) || "").slice(0, 10);
          const csStr = (cleanBody.contentStartAt || (existingCampaign.content && existingCampaign.content.contentStartAt) || "").slice(0, 10);
          const ceStr = (cleanBody.contentEndAt || (existingCampaign.content && existingCampaign.content.contentEndAt) || "").slice(0, 10);
          let newStatus = "REGISTERING";
          if (ceStr && ceStr < todayStr) {
            newStatus = "CLOSED";
          } else if (csStr && csStr <= todayStr) {
            newStatus = "PURCHASING";
          } else if (reStr && reStr < todayStr) {
            newStatus = "SELECTING";
          } else if (rsStr && rsStr <= todayStr) {
            newStatus = "RECRUITING";
          }
          // EMERGENCY(취소)는 유지
          if (existingCampaign.status !== "EMERGENCY" && existingCampaign.status !== "CANCELLED") {
            cleanBody.status = newStatus;
          }
          console.log("[CAMPAIGN EDIT] status recalc:", { todayStr, rsStr, reStr, csStr, ceStr, oldStatus: existingCampaign.status, newStatus: cleanBody.status });

          campaign.assign(cleanBody).write();
          updated = campaign.value();
        }
      } catch (e) {
        console.error("Campaign edit DB error:", e.message);
      }
    }

    // 업데이트된 캠페인 데이터 또는 원본에서 응답 구성
    const c = updated || {};
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: {
        campaignId,
        partnerId: c.partner_id || 501,
        type: c.type || body.type || "DELIVERY",
        status: c.status || "REGISTERING",
        title: c.title || body.title || "",
        category: c.category || { categoryId: 1, categoryName: "식품" },
        requiredPlatform: c.requiredPlatform || null,
        recruit: {
          recruitLimit: c.recruitLimit || c.recruit?.recruitLimit || 10,
          recruitStartAt: c.recruitStartAt || c.recruit?.recruitStartAt || new Date().toISOString(),
          recruitEndAt: c.recruitEndAt || c.recruit?.recruitEndAt || new Date().toISOString(),
          selectedAt: c.selectedAt || c.recruit?.selectedAt || new Date().toISOString(),
          contentStartAt: c.content?.contentStartAt || c.recruit?.contentStartAt || new Date().toISOString(),
          contentEndAt: c.content?.contentEndAt || c.recruit?.contentEndAt || new Date().toISOString(),
        },
        reward: c.reward || { extraRewardPoint: 0, paymentRewardPoint: 0 },
        regAt: c.regAt || c.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      partner: { partnerId: 501, currentPoint: 500000 },
      message: "캠페인이 수정되었습니다.",
    });
  }

  // ============ 캠페인 관리 공통 유틸 ============
  // db.json campaigns → 백엔드 API 형식으로 변환
  /** content_url에서 username 추출 */
  function extractUsernameFromUrl(url) {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments[0] || "";
    } catch (_e) {
      return "";
    }
  }

  /** campaign_applications에서 실제 신청자 수 조회 (데이터 없으면 null → fallback) */
  function getActualApplicantCount(campaignId) {
    const apps = db ? (db.get("campaign_applications").value() || []) : [];
    const matched = apps.filter((a) => a.campaign_id == campaignId);
    if (matched.length === 0) return null;
    return matched.filter((a) => a.status === "APPLIED" || a.status === "PENDING" || a.status === "SELECTED").length;
  }

  /** campaign_applications에서 실제 선정자 수 조회 (데이터 없으면 null → fallback) */
  function getActualSelectedCount(campaignId) {
    const apps = db ? (db.get("campaign_applications").value() || []) : [];
    const matched = apps.filter((a) => a.campaign_id == campaignId);
    if (matched.length === 0) return null;
    return matched.filter((a) => a.status === "SELECTED").length;
  }

  // campaign_contents에서 실제 콘텐츠 건수 계산
  function getContentCountsForCampaign(campaignId) {
    let allContents = [];
    if (db) {
      try { allContents = db.get("campaign_contents").value() || []; } catch (_e) { /* fallback */ }
    }
    if (!allContents.length) {
      try { allContents = require("./db.json").campaign_contents || []; } catch (_e) { /* ignore */ }
    }
    const contents = allContents.filter((c) => c.campaign_id == campaignId || String(c.campaign_id) === String(campaignId));

    let waitingCount = 0;
    let submittedCount = 0;
    let approvedCount = 0;

    contents.forEach((item) => {
      if (item.status === "APPROVED") approvedCount++;
      else if (item.status === "SUBMITTED") submittedCount++;
      else waitingCount++; // WAITING, REJECTED, REPORTED, null 등
    });

    return { waitingCount, submittedCount, approvedCount, hasData: contents.length > 0 };
  }

  function transformCampaign(c) {
    const platformMap = {
      NAVER_BLOG: "naver_blog",
      NAVER_CLIP: "naver_clip",
      INSTAGRAM: "instagram",
      INSTAGRAM_REELS: "reels",
      REELS: "reels",
      YOUTUBE: "youtube",
      YOUTUBE_SHORTS: "youtube_shorts",
    };
    const channelName = (c.requiredPlatform && c.requiredPlatform.channelName) || "";
    const platform = platformMap[channelName] || channelName.toLowerCase();
    const points = ((c.reward && c.reward.extraRewardPoint) || 0) + ((c.reward && c.reward.paymentRewardPoint) || 0);

    // old mock status → backend status 정규화
    // SELECTING = 선정 중 (당첨자 미선정), PURCHASING = 진행 중 (당첨자 선정 완료)
    const statusNormalize = {
      SCHEDULED: "REGISTERING",
      approved: "REGISTERING",
      IN_PROGRESS: "SELECTING",
      SELECTED: "PURCHASING",
      REVIEW: "PURCHASING",
      COMPLETED: "CLOSED",
      CANCELLED: "EMERGENCY",
    };
    const normalizedStatus = statusNormalize[c.status] || c.status || "REGISTERING";

    // PURCHASING(진행 중) 또는 CLOSED(종료)는 당첨자 선정 완료 → selected_count > 0
    // SELECTING(선정 중)은 아직 선정 전 → selected_count = 0
    const selectedCount = (normalizedStatus === "PURCHASING" || normalizedStatus === "CLOSED")
      ? (c.selectedCount || c.recruitLimit || (c.recruit && c.recruit.recruitLimit) || 3)
      : 0;

    // 실제 campaign_contents 데이터에서 콘텐츠 건수 계산
    const contentCounts = getContentCountsForCampaign(c.id);
    const actualSelectedCount = getActualSelectedCount(c.id) ?? selectedCount;

    // campaign_contents 데이터가 없지만 콘텐츠 단계(PURCHASING/CLOSED/연장요청)인 경우:
    // → 선정된 리뷰어 전원이 "대기" 상태
    if (!contentCounts.hasData && (normalizedStatus === "PURCHASING" || normalizedStatus === "CLOSED" || c.extensionRequested)) {
      contentCounts.waitingCount = actualSelectedCount;
    }

    // 선정된 리뷰어 중 콘텐츠 미등록자 수도 대기에 포함
    const unregisteredCount = contentCounts.hasData
      ? Math.max(0, actualSelectedCount - (contentCounts.waitingCount + contentCounts.submittedCount + contentCounts.approvedCount))
      : 0;

    // 상태별 데이터 일관성 보장:
    // - REGISTERING(예정): 모집 전 → 신청자 0, 선정자 0, 콘텐츠 0
    // - RECRUITING(신청): 모집 중 → 신청자 O, 선정자 0, 콘텐츠 0
    // - SELECTING(진행-선정중): 선정 진행 → 신청자 O, 선정자 진행중, 콘텐츠 0
    // - PURCHASING(진행-콘텐츠): 콘텐츠 단계 → 신청자 O, 선정자 O, 콘텐츠 O
    // - CLOSED(종료): 마감 → 신청자 O, 선정자 O, 콘텐츠 O
    // - EMERGENCY(취소): 취소 → 신청자 O, 선정자 O, 콘텐츠 0
    const rawApplicants = getActualApplicantCount(c.id) ?? 0;
    const rawSelected = getActualSelectedCount(c.id) ?? selectedCount;

    let finalApplicants = rawApplicants;
    let finalSelected = rawSelected;
    let finalWaiting = contentCounts.waitingCount + unregisteredCount;
    let finalSubmitted = contentCounts.submittedCount;
    let finalApproved = contentCounts.approvedCount;

    if (normalizedStatus === "REGISTERING") {
      // 예정: 모집 전이므로 신청/선정/콘텐츠 모두 0
      finalApplicants = 0;
      finalSelected = 0;
      finalWaiting = 0;
      finalSubmitted = 0;
      finalApproved = 0;
    } else if (normalizedStatus === "RECRUITING") {
      // 신청: 모집 중이므로 선정/콘텐츠 0
      finalSelected = 0;
      finalWaiting = 0;
      finalSubmitted = 0;
      finalApproved = 0;
    } else if (normalizedStatus === "SELECTING") {
      // 선정 중: 콘텐츠 아직 0
      finalWaiting = 0;
      finalSubmitted = 0;
      finalApproved = 0;
    } else if (normalizedStatus === "EMERGENCY") {
      // 취소: 콘텐츠 0
      finalWaiting = 0;
      finalSubmitted = 0;
      finalApproved = 0;
    }

    return {
      id: c.id,
      campaignId: c.id,
      title: c.title || "",
      campaignType: (c.type || "DELIVERY").toLowerCase(),
      platform,
      thumbnailUrl: c.thumbnailUrl || (c.thumbnail && c.thumbnail.url) || "",
      category: (c.category && c.category.categoryName) || "",
      points,
      status: normalizedStatus,
      recruitCount: c.recruitLimit || (c.recruit && c.recruit.recruitLimit) || 0,
      currentApplicants: finalApplicants,
      selectedCount: finalSelected,
      applicationStartDate: (c.recruit && c.recruit.recruitStartAt) || c.recruitStartAt || "",
      applicationEndDate: (c.recruit && c.recruit.recruitEndAt) || c.recruitEndAt || "",
      campaignStartDate: (c.content && c.content.contentStartAt) || "",
      campaignEndDate: (c.content && c.content.contentEndAt) || "",
      description: c.description || "",
      notification: c.notification || "",
      createdAt: c.created_at || (c.recruit && c.recruit.recruitStartAt) || c.recruitStartAt || new Date().toISOString(),
      updatedAt: c.updated_at || c.created_at || (c.recruit && c.recruit.recruitStartAt) || c.recruitStartAt || new Date().toISOString(),
      extensionRequested: c.extensionRequested || false,
      // 연장 요청 건수: extensionRequested 캠페인만 1~5건 부여
      extensionRequestCount: c.extensionRequested
        ? (c.extension_request_count || ((c.id % 5) + 1))
        : 0,
      // 콘텐츠 건수: 상태별 일관성 적용
      waitingCount: finalWaiting,
      submittedCount: finalSubmitted,
      approvedCount: finalApproved,
    };
  }

  // status별 필터링 (백엔드 비즈니스 로직 모사)
  // mock DB의 old status (SCHEDULED, approved, IN_PROGRESS, SELECTED, COMPLETED, CANCELLED)도 처리
  function filterByApiStatus(campaigns, status) {
    if (status === "all") return campaigns.filter((c) => c.status !== "DRAFT");
    if (status === "REGISTERING") return campaigns.filter((c) =>
      (c.status === "REGISTERING" || c.status === "SCHEDULED" || c.status === "approved") && !c.extensionRequested);
    if (status === "RECRUITING") return campaigns.filter((c) => c.status === "RECRUITING" && !c.extensionRequested);
    if (status === "SELECTING") return campaigns.filter((c) =>
      (c.status === "SELECTING" || c.status === "PURCHASING" || c.status === "SELECTED" || c.status === "IN_PROGRESS" || c.status === "REVIEW")
      && !c.extensionRequested);
    if (status === "CLOSED") return campaigns.filter((c) =>
      (c.status === "CLOSED" || c.status === "COMPLETED") && !c.extensionRequested);
    if (status === "EMERGENCY") return campaigns.filter((c) =>
      (c.status === "EMERGENCY" || c.status === "CANCELLED") && !c.extensionRequested);
    if (status === "EXTENSION") return campaigns.filter((c) => c.extensionRequested === true);
    return campaigns.filter((c) => c.status === status);
  }

  // 정렬
  function sortCampaigns(campaigns, sort) {
    const arr = [...campaigns];
    if (sort === "OLDEST") {
      arr.sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
    } else if (sort === "DEADLINE") {
      const today = new Date().toISOString().slice(0, 10);
      arr.sort((a, b) => {
        const dA = Math.abs(new Date(a.application_end_date).getTime() - new Date(today).getTime());
        const dB = Math.abs(new Date(b.application_end_date).getTime() - new Date(today).getTime());
        return dA - dB;
      });
    } else {
      // LATEST (기본) — 수정일(updated_at)이 있으면 우선, 없으면 생성일(created_at) 기준
      arr.sort((a, b) => {
        const dateA = a.updated_at || a.created_at || "";
        const dateB = b.updated_at || b.created_at || "";
        return dateB.localeCompare(dateA);
      });
    }
    return arr;
  }

  // ============ GET /partner/campaign_management ============
  // API 13: 캠페인 관리 페이지 조회 (stats + 캠페인)
  if (req.method === "GET" && req.path === "/partner/campaign_management") {
    // 인메모리 lowdb에서 읽기 — 새로 등록한 캠페인도 포함
    const campaigns = getCampaigns();
    const partnerId = currentSession.partnerId;
    const allCampaigns = campaigns
      .filter((c) => c.partner_id === partnerId || c.partner_id === currentSession.userId || c.partner_id === 1)
      .map(transformCampaign);
    const nonDraft = allCampaigns.filter((c) => c.status !== "DRAFT");

    const stats = {
      totalCount: nonDraft.length,
      scheduledCount: allCampaigns.filter((c) => c.status === "REGISTERING" && !c.extensionRequested).length,
      applicationCount: allCampaigns.filter((c) => c.status === "RECRUITING" && !c.extensionRequested).length,
      ongoingCount: allCampaigns.filter((c) => (c.status === "SELECTING" || c.status === "PURCHASING") && !c.extensionRequested).length,
      completedCount: allCampaigns.filter((c) => c.status === "CLOSED" && !c.extensionRequested).length,
      canceledCount: allCampaigns.filter((c) => c.status === "EMERGENCY" && !c.extensionRequested).length,
      extensionRequestCount: allCampaigns.filter((c) => c.extensionRequested === true).length,
    };

    // 정렬
    const sort = req.query.sort || "LATEST";
    const sorted = sortCampaigns(nonDraft, sort);

    return res.status(200).json({
      result: "success",
      generatedAt: new Date().toISOString(),
      data: {
        campaigns: sorted,
        stats,
      },
    });
  }

  // ============ GET /partner/campaign_management/:status ============
  // API 14: 캠페인 상태별 조회
  if (req.method === "GET" && req.path.startsWith("/partner/campaign_management/")) {
    console.log("[API 14 HIT] path:", req.path, "method:", req.method);
    const pathStatus = req.path.split("/").pop();
    const campaigns = getCampaigns();
    const partnerId = currentSession.partnerId;
    const allCampaigns = campaigns
      .filter((c) => c.partner_id === partnerId || c.partner_id === currentSession.userId || c.partner_id === 1)
      .map(transformCampaign);

    console.log("[API 14] pathStatus:", pathStatus, "total campaigns:", allCampaigns.length, "statuses:", allCampaigns.map(c => c.status));

    // status별 필터링
    let filtered = filterByApiStatus(allCampaigns, pathStatus);
    console.log("[API 14] filtered count:", filtered.length);

    // type 필터
    if (req.query.type) {
      const types = req.query.type.split(",").map((t) => t.toLowerCase());
      filtered = filtered.filter((c) => types.includes(c.campaignType));
    }
    // channel 필터
    if (req.query.channel) {
      const channels = req.query.channel.split(",").map((ch) => ch.toLowerCase());
      const channelPlatformMap = { blog: "naver_blog", instagram: "instagram", youtube: "youtube", reels: "reels" };
      filtered = filtered.filter((c) => {
        return channels.some((ch) => c.platform === (channelPlatformMap[ch] || ch));
      });
    }
    // keyword 필터
    if (req.query.keyword) {
      const kw = req.query.keyword.toLowerCase();
      filtered = filtered.filter((c) => c.title.toLowerCase().includes(kw));
    }

    // 정렬
    const sort = req.query.sort || "LATEST";
    const sorted = sortCampaigns(filtered, sort);

    // 페이지네이션
    const page = parseInt(req.query.page || "0", 10);
    const size = parseInt(req.query.size || "20", 10);
    const total = sorted.length;
    const hasNext = (page + 1) * size < total;
    const paginated = sorted.slice(page * size, (page + 1) * size);

    return res.status(200).json({
      result: "success",
      generatedAt: new Date().toISOString(),
      data: {
        campaigns: paginated,
        hasNext,
        currentPage: page,
      },
    });
  }

  // ============ DELETE /partner/campaign/:campaignId ============
  // API 17: 캠페인 삭제
  if (req.method === "DELETE" && req.path.match(/^\/partner\/campaign\/\d+$/)) {
    const campaignId = Number(req.path.split("/").pop());
    if (db) {
      try {
        // 삭제가 아닌 status를 EMERGENCY(취소)로 변경 → 취소 탭에 표시
        const campaign = db.get("campaigns").find({ id: campaignId }).value();
        if (campaign) {
          db.get("campaigns").find({ id: campaignId }).assign({
            status: "EMERGENCY",
            updated_at: new Date().toISOString(),
          }).write();
        }
      } catch (_e) { /* fallback */ }
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      message: "캠페인이 삭제되었습니다.",
      deletedCampaignId: campaignId,
    });
  }

  // ============ GET /partner/mypage ============
  // 파트너 프로필 조회
  if (req.method === "GET" && req.path === "/partner/mypage") {
    const profiles = db ? db.get("partner_mypage").value() : [];
    const profile = profiles.find((p) => p.email === currentSession.email);

    if (!profile) {
      return res.status(404).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "NOT_FOUND", message: "파트너 정보를 찾을 수 없습니다." },
      });
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      ...profile,
    });
  }

  // ============ PUT /partner/mypage ============
  // 파트너 내 정보 수정
  if (req.method === "PUT" && req.path === "/partner/mypage") {
    const profiles = db ? db.get("partner_mypage").value() : [];
    const profileIndex = profiles.findIndex((p) => p.email === currentSession.email);

    if (profileIndex < 0) {
      return res.status(404).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "NOT_FOUND", message: "파트너 정보를 찾을 수 없습니다." },
      });
    }

    const updated = { ...profiles[profileIndex], ...req.body };
    if (db) {
      try {
        const allProfiles = db.get("partner_mypage");
        allProfiles.find({ email: currentSession.email }).assign(req.body).write();
      } catch (_e) { /* fallback */ }
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      ...updated,
    });
  }

  // ============ POST /partner/mypage/profile-image ============
  // 프로필 사진 업로드 (mock: URL만 반환)
  if (req.method === "POST" && req.path === "/partner/mypage/profile-image") {
    const mockImageUrl = "/images/profiles/partner_profile_" + Date.now() + ".jpg";

    // DB에 profileImage 업데이트
    if (db) {
      try {
        db.get("partner_mypage").find({ email: currentSession.email })
          .assign({ profileImage: mockImageUrl }).write();
      } catch (_e) { /* fallback */ }
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      profileImageUrl: mockImageUrl,
    });
  }

  // ============ DELETE /partner/mypage/profile-image ============
  // 프로필 사진 삭제
  if (req.method === "DELETE" && req.path === "/partner/mypage/profile-image") {
    if (db) {
      try {
        db.get("partner_mypage").find({ email: currentSession.email })
          .assign({ profileImage: null }).write();
      } catch (_e) { /* fallback */ }
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
    });
  }

  // ============ POST /partner/mypage/business-document ============
  // 사업자등록증 업로드 (mock: URL + 파일명 반환)
  if (req.method === "POST" && req.path === "/partner/mypage/business-document") {
    const mockDocUrl = "/documents/business_" + Date.now() + ".pdf";
    const mockFileName = "사업자등록증_" + new Date().getFullYear() + ".pdf";

    if (db) {
      try {
        db.get("partner_mypage").find({ email: currentSession.email })
          .assign({ businessDocumentUrl: mockDocUrl, businessDocumentFileName: mockFileName }).write();
      } catch (_e) { /* fallback */ }
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      documentUrl: mockDocUrl,
      documentFileName: mockFileName,
    });
  }

  // ============ PUT /partner/mypage/password ============
  // 비밀번호 변경
  if (req.method === "PUT" && req.path === "/partner/mypage/password") {
    const { currentPassword, newPassword } = req.body;

    // db.json에서 현재 비밀번호 조회
    const profile = db ? db.get("partner_mypage").find({ email: currentSession.email }).value() : null;
    const storedPassword = profile?.password || "1234";

    if (currentPassword !== storedPassword) {
      return res.status(400).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "INVALID_PASSWORD", message: "현재 비밀번호가 일치하지 않습니다." },
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "INVALID_NEW_PASSWORD", message: "새 비밀번호가 유효하지 않습니다." },
      });
    }

    // db.json에 새 비밀번호 저장
    if (db) {
      try {
        db.get("partner_mypage").find({ email: currentSession.email })
          .assign({ password: newPassword }).write();
      } catch (_e) { /* fallback */ }
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
    });
  }

  // ============ DELETE /partner/mypage ============
  // 회원 탈퇴 (DELETE /partner/mypage — PUT /partner/mypage와 구분: method가 다름)
  if (req.method === "DELETE" && req.path === "/partner/mypage") {
    // 진행 중인 캠페인 체크 (SELECTING, PURCHASING 상태)
    const campaigns = getCampaigns();
    const activeCampaigns = campaigns.filter((c) => {
      const status = c.status || "";
      return ["SELECTING", "PURCHASING", "IN_PROGRESS", "SELECTED", "REVIEW"].includes(status);
    });
    if (activeCampaigns.length > 0) {
      return res.status(409).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "ACTIVE_CAMPAIGN_EXISTS", message: "진행 중인 캠페인이 있을 경우 탈퇴가 불가합니다." },
      });
    }

    // db.json에서 계정 삭제
    if (db) {
      try {
        db.get("partner_mypage").remove({ email: currentSession.email }).write();
      } catch (_e) { /* fallback */ }
    }

    // 세션 초기화
    currentSession = null;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      message: "회원 탈퇴가 완료되었습니다.",
    });
  }

  // ============ GET /partner/campaign/:campaignId/contents ============
  // API 22: 캠페인 콘텐츠 내역 조회 (백엔드 스펙: flat 응답, data wrapper 없음)
  if (req.method === "GET" && req.path.match(/^\/partner\/campaign\/\d+\/contents$/)) {
    const campaignId = Number(req.path.split("/")[3]);
    const tab = req.query.tab || "waiting"; // waiting | submitted | approved

    // 캠페인 정보 조회 (type-safe 비교)
    const campaigns = getCampaigns();
    const campaign = campaigns.find((c) => c.id == campaignId || String(c.id) === String(campaignId));
    if (!campaign) {
      return res.status(404).json({
        result: "NOT_FOUND",
        generatedAt: new Date().toISOString(),
        error: { code: "NOT_FOUND", message: "캠페인을 찾을 수 없습니다." },
      });
    }

    // campaign_contents 조회
    let allContents = [];
    if (db) {
      try { allContents = db.get("campaign_contents").value() || []; } catch (_e) { /* fallback */ }
    }
    if (!allContents.length) {
      allContents = require("./db.json").campaign_contents || [];
    }
    const campaignContents = allContents.filter((c) => c.campaign_id == campaignId || String(c.campaign_id) === String(campaignId));

    // 리뷰어 닉네임 매핑 (mock)
    const reviewerNames = [
      "블로그마스터", "리뷰요정", "맛집탐방러", "뷰티크리에이터", "일상기록자",
      "감성리뷰어", "꼼꼼리뷰", "솔직후기맨", "트렌드세터", "체험전문가",
      "핫딜헌터", "라이프스타일러", "먹방킹", "패션피플", "홈카페러버",
      "여행블로거", "IT리뷰어", "키즈맘블로거", "펫스타그램", "운동일기",
    ];

    // status 분류
    const waiting = [];
    const submitted = [];
    const approved = [];

    // 등록 기한 (백엔드: campaign.content_end_at → contentRegistrationDeadline)
    const contentEndAt = (campaign.content && campaign.content.contentEndAt) || "2026-04-01T23:59:59+09:00";

    campaignContents.forEach((item) => {
      const nameIdx = ((item.reviewer_id || 1) - 1) % reviewerNames.length;
      const reviewerName = reviewerNames[nameIdx];

      const channelName = (campaign.requiredPlatform && campaign.requiredPlatform.channelName) || "NAVER_BLOG";

      // 백엔드 스펙 기준 필드만 반환 (channelName은 백엔드 코드값 그대로)
      const contentItem = {
        campaignContentId: item.id,
        reviewerId: item.reviewer_id || 0,
        reviewerName: reviewerName,
        reviewerGrade: item.reviewer_id && item.reviewer_id % 5 === 0 ? "EXCELLENT" : "NORMAL",
        channelName: channelName,
        channelUsername: item.content_url ? extractUsernameFromUrl(item.content_url) : ("user_" + (item.reviewer_id || 0)),
        contentUrl: item.content_url || null,
        contentStatus: item.status || null,
        contentRegAt: item.submitted_at || null,
        contentUpdateAt: null,
        // 프론트엔드 UI에 필요한 추가 필드 (mock에서 제공)
        applicationId: item.application_id || item.id + 100,
        registrationDeadline: contentEndAt,
        isLateSubmission: item.is_late_submission || false,
        extensionCount: item.extension_count || 0,
        rejectReason: item.admin_comment || undefined,
        reportedAt: item.reported_at || undefined,
        receiptImages: item.receipt_images || undefined,
      };

      if (item.status === "APPROVED") {
        approved.push(contentItem);
      } else if (item.status === "SUBMITTED") {
        submitted.push(contentItem);
      } else if (item.status === "REJECTED") {
        contentItem.contentStatus = "REJECTED";
        waiting.push(contentItem);
      } else if (item.status === "REPORTED") {
        contentItem.contentStatus = "REPORTED";
        waiting.push(contentItem);
      } else {
        // WAITING 또는 기타 → 대기
        waiting.push(contentItem);
      }
    });

    // 선정된 리뷰어 중 콘텐츠 미등록자도 대기에 추가 (campaignContentId = null)
    const selectedCount = campaign.selectedCount || campaign.recruitLimit || (campaign.recruit && campaign.recruit.recruitLimit) || 3;
    const existingReviewerIds = new Set(campaignContents.map((c) => c.reviewer_id));
    for (let i = 1; i <= selectedCount; i++) {
      if (!existingReviewerIds.has(i)) {
        const nameIdx = (i - 1) % reviewerNames.length;
        const channelName = (campaign.requiredPlatform && campaign.requiredPlatform.channelName) || "NAVER_BLOG";
        waiting.push({
          campaignContentId: null, // 백엔드 스펙: 미등록 시 null
          reviewerId: i,
          reviewerName: reviewerNames[nameIdx],
          reviewerGrade: i % 5 === 0 ? "EXCELLENT" : "NORMAL",
          channelName: channelName,
          channelUsername: "user_" + i,
          contentUrl: null,
          contentStatus: null, // 백엔드 스펙: 미등록 시 null
          contentRegAt: null,
          contentUpdateAt: null,
          applicationId: campaignId * 100 + i,
          registrationDeadline: contentEndAt,
          isLateSubmission: false,
          extensionCount: 0,
        });
      }
    }

    // 현재 탭의 콘텐츠 반환
    let tabContents = waiting;
    if (tab === "submitted") tabContents = submitted;
    else if (tab === "approved") tabContents = approved;

    // 캠페인 기본 정보 (백엔드 스펙: 5개 필수 필드 + mock 추가 필드)
    const transformedCampaign = transformCampaign(campaign);
    const platformLabelMap2 = {
      naver_blog: "NAVER_BLOG", instagram: "INSTAGRAM", youtube: "YOUTUBE",
      reels: "REELS",
    };
    const fmt = (s) => s ? s.slice(0, 10) : "";

    const campaignInfo = {
      // 백엔드 스펙 필수 5개 필드
      campaignId: campaign.id,
      title: campaign.title || "",
      recruitLimit: campaign.recruitLimit || (campaign.recruit && campaign.recruit.recruitLimit) || 0,
      selectedCount: selectedCount,
      contentRegistrationDeadline: contentEndAt,
      // mock 추가 필드 (프론트엔드 UI용)
      campaignType: (campaign.type || "DELIVERY").toUpperCase(),
      platform: platformLabelMap2[transformedCampaign.platform] || transformedCampaign.platform || "NAVER_BLOG",
      thumbnailUrl: transformedCampaign.thumbnailUrl,
      category: transformedCampaign.category || "",
      status: transformedCampaign.status,
      recruitCount: transformedCampaign.recruitCount,
      currentApplicants: transformedCampaign.currentApplicants,
      recruitmentPeriod: transformedCampaign.applicationStartDate && transformedCampaign.applicationEndDate
        ? fmt(transformedCampaign.applicationStartDate) + " ~ " + fmt(transformedCampaign.applicationEndDate)
        : "",
      announcementDate: fmt(transformedCampaign.campaignStartDate),
      registrationPeriod: transformedCampaign.campaignStartDate && transformedCampaign.campaignEndDate
        ? fmt(transformedCampaign.campaignStartDate) + " ~ " + fmt(transformedCampaign.campaignEndDate)
        : "",
    };

    // 백엔드 스펙: flat 응답 (data wrapper 없음)
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaignInfo,
      tabCounts: {
        waiting: waiting.length,
        submitted: submitted.length,
        approved: approved.length,
      },
      contents: tabContents,
    });
  }

  // ============ PUT /partner/campaign/contents/:contentId/approve ============
  // API 22-1: 콘텐츠 승인 (백엔드 스펙: data wrapper 있음)
  if (req.method === "PUT" && req.path.match(/^\/partner\/campaign\/contents\/\d+\/approve$/)) {
    const contentId = Number(req.path.split("/")[4]);
    if (db) {
      try {
        const item = db.get("campaign_contents").find({ id: contentId });
        if (item.value()) {
          item.assign({ status: "APPROVED" }).write();
        }
      } catch (_e) { /* ignore */ }
    }
    return res.status(200).json({
      result: "OK",
      data: {
        campaignContentId: contentId,
        contentStatus: "APPROVED",
        contentUpdateAt: new Date().toISOString(),
        message: "콘텐츠가 승인되었습니다.",
      },
    });
  }

  // ============ PUT /partner/campaign/contents/:contentId/reject ============
  // API 22-2: 콘텐츠 반려 (백엔드 스펙: data wrapper 있음)
  if (req.method === "PUT" && req.path.match(/^\/partner\/campaign\/contents\/\d+\/reject$/)) {
    const contentId = Number(req.path.split("/")[4]);
    const rejectReason = (req.body && req.body.rejectReason) || "";
    if (db) {
      try {
        const item = db.get("campaign_contents").find({ id: contentId });
        if (item.value()) {
          item.assign({ status: "REJECTED", admin_comment: rejectReason }).write();
        }
      } catch (_e) { /* ignore */ }
    }
    return res.status(200).json({
      result: "OK",
      data: {
        campaignContentId: contentId,
        contentStatus: "REJECTED",
        rejectReason: rejectReason,
        contentUpdateAt: new Date().toISOString(),
        message: "콘텐츠가 반려되었습니다.",
      },
    });
  }

  // ============ PUT /partner/campaign/applications/:applicationId/extend-deadline ============
  // API 22-3: 콘텐츠 기한 연장 (백엔드 스펙: data wrapper 있음)
  if (req.method === "PUT" && req.path.match(/^\/partner\/campaign\/applications\/\d+\/extend-deadline$/)) {
    const applicationId = Number(req.path.split("/")[4]);
    const extensionDays = (req.body && req.body.extensionDays) || 3;
    const now = new Date();
    const previousDeadline = new Date(now);
    const newDeadline = new Date(now);
    newDeadline.setDate(newDeadline.getDate() + extensionDays);
    return res.status(200).json({
      result: "OK",
      data: {
        applicationId: applicationId,
        campaignId: 0,
        reviewerId: 0,
        reviewerName: "",
        previousDeadline: previousDeadline.toISOString(),
        newDeadline: newDeadline.toISOString(),
        extensionDays: extensionDays,
        message: "등록 기간 연장이 완료되었습니다.",
      },
    });
  }

  // ============ POST /partner/campaign/applications/:applicationId/report ============
  // API 22-4: 리뷰어 신고 (백엔드 스펙: data wrapper 있음)
  if (req.method === "POST" && req.path.match(/^\/partner\/campaign\/applications\/\d+\/report$/)) {
    const applicationId = Number(req.path.split("/")[4]);
    const reportReason = (req.body && req.body.reportReason) || "NO_CONTACT_NO_SHOW";
    const reportDetail = (req.body && req.body.reportDetail) || null;
    return res.status(200).json({
      result: "OK",
      data: {
        reportId: Date.now(),
        applicationId: applicationId,
        campaignId: 0,
        reviewerId: 0,
        reviewerName: "",
        reportReason: reportReason,
        reportDetail: reportDetail,
        reportedAt: new Date().toISOString(),
        penaltyScore: 10,
        message: "리뷰어가 신고되었습니다.",
      },
    });
  }

  // ============ PUT /partner/campaign/contents/:contentId/complete ============
  // API 22-5: 콘텐츠 확인완료 (백엔드 스펙: data wrapper 있음)
  if (req.method === "PUT" && req.path.match(/^\/partner\/campaign\/contents\/\d+\/complete$/)) {
    const contentId = Number(req.path.split("/")[4]);
    if (db) {
      try {
        const item = db.get("campaign_contents").find({ id: contentId });
        if (item.value()) {
          item.assign({ status: "APPROVED" }).write();
        }
      } catch (_e) { /* ignore */ }
    }
    return res.status(200).json({
      result: "OK",
      data: {
        campaignContentId: contentId,
        contentStatus: "APPROVED",
        isCompleted: true,
        completedAt: new Date().toISOString(),
        message: "콘텐츠 확인이 완료되었습니다.",
      },
    });
  }

  // ========================================
  // 📋 API 19: 캠페인 신청내역 조회
  // GET /partner/campaign/applications/:campaignId
  // ========================================
  if (req.method === "GET" && req.path.match(/^\/partner\/campaign\/applications\/(\d+)$/)) {
    const campaignId = parseInt(req.path.split("/").pop(), 10);
    const statusFilter = (req.query.status || "ALL").toUpperCase();
    const sort = (req.query.sort || "LATEST").toUpperCase();

    // 캠페인 정보 조회 (campaigns 단일 테이블에서)
    const allCampaigns = db.get("campaigns").value() || [];
    const campaign = allCampaigns.find((c) => c.id === campaignId || c.id === String(campaignId));

    // 캠페인 상태 정규화 맵
    const statusNorm = { SCHEDULED: "REGISTERING", approved: "REGISTERING", IN_PROGRESS: "SELECTING", SELECTED: "PURCHASING", REVIEW: "PURCHASING", COMPLETED: "CLOSED", CANCELLED: "EMERGENCY" };
    // 캠페인 유형 코드 (백엔드: VISIT, PURCHASE 등 대문자)
    const typeMapUpper = { DELIVERY: "DELIVERY", VISIT: "VISIT", PURCHASE: "PURCHASE", PURCHASE_REVIEW: "PURCHASE", REPORTER: "REPORTER", MISSION: "MISSION" };

    let campaignInfo;
    if (campaign) {
      const cStatus = statusNorm[campaign.status] || campaign.status || "RECRUITING";
      // 플랫폼: requiredPlatform.channelName 우선, 없으면 platform 필드
      const rawPlatform = (campaign.requiredPlatform && campaign.requiredPlatform.channelName)
        || campaign.platform || "NAVER_BLOG";
      const platform = rawPlatform.toUpperCase().replace(/ /g, "_");
      // 포인트: reward.extraRewardPoint 우선
      const points = (campaign.reward && campaign.reward.extraRewardPoint) || campaign.point || campaign.points || campaign.additionalPoint || 0;
      // 선정일: recruit.announcementAt 또는 content.contentStartAt
      const announcementDate = (campaign.recruit && campaign.recruit.announcementAt)
        || (campaign.content && campaign.content.contentStartAt) || "";
      campaignInfo = {
        campaignId: campaignId,
        title: campaign.title || "",
        type: typeMapUpper[(campaign.type || "DELIVERY").toUpperCase()] || "DELIVERY",
        status: cStatus,
        recruitLimit: campaign.recruitLimit || (campaign.recruit && campaign.recruit.recruitLimit) || 10,
        totalApplied: 0, // 아래에서 실제 집계로 덮어씀
        totalSelected: 0,
        totalCanceled: 0,
        recruitStartAt: (campaign.recruit && campaign.recruit.recruitStartAt) || campaign.recruitStartAt || "",
        recruitEndAt: (campaign.recruit && campaign.recruit.recruitEndAt) || campaign.recruitEndAt || "",
        // 프론트엔드 UI 추가 필드
        thumbnailUrl: campaign.thumbnailUrl || (campaign.thumbnail && campaign.thumbnail.url) || "",
        platform: platform,
        category: (campaign.category && campaign.category.categoryName) || campaign.category || "",
        campaignStartAt: (campaign.content && campaign.content.contentStartAt) || "",
        campaignEndAt: (campaign.content && campaign.content.contentEndAt) || "",
        announcementDate: announcementDate,
        points: points,
        region: campaign.region || undefined,
        subRegion: campaign.subRegion || undefined,
      };
    } else {
      // 캠페인 없으면 기본 정보 생성
      campaignInfo = {
        campaignId: campaignId,
        title: `캠페인 #${campaignId}`,
        type: "DELIVERY",
        status: "RECRUITING",
        recruitLimit: 10,
        totalApplied: 0,
        totalSelected: 0,
        totalCanceled: 0,
        recruitStartAt: "2026-03-01T00:00:00",
        recruitEndAt: "2026-03-31T23:59:59",
        thumbnailUrl: "/images/main/campaign_img/eximg_1.png",
        platform: "NAVER_BLOG",
        category: "",
        campaignStartAt: "2026-04-01T00:00:00",
        campaignEndAt: "2026-04-30T23:59:59",
        announcementDate: "2026-04-01T00:00:00",
        points: 30000,
      };
    }

    // 신청내역 조회 (campaign_id가 문자열/숫자 모두 가능)
    const allApplications = db.get("campaign_applications").value() || [];
    let applications = allApplications.filter((a) => a.campaign_id == campaignId);

    // status 필터
    if (statusFilter === "APPLIED") {
      applications = applications.filter((a) => a.status === "APPLIED" || a.status === "PENDING");
    } else if (statusFilter === "SELECTED") {
      applications = applications.filter((a) => a.status === "SELECTED");
    }
    // ALL이면 필터 없음

    // 리뷰어 정보 enrichment
    const allReviewers = db.get("reviewers").value() || [];
    // channelName(대문자) → 채널 메트릭 생성 함수
    const channelMetricsFn = {
      NAVER_BLOG: (id) => ({ dailyVisits: 120 + (id % 200), totalVisits: 5000 + (id % 10000), neighbors: 300 + (id % 500), followerCount: 300 + (id % 500) }),
      NAVER_CLIP: (id) => ({ followerCount: 1500 + (id % 3000) }),
      INSTAGRAM: (id) => ({ followerCount: 2000 + (id % 5000) }),
      REELS: (id) => ({ followerCount: 1800 + (id % 4000) }),
      YOUTUBE: (id) => ({ followerCount: 3000 + (id % 8000), subscribers: 3000 + (id % 8000) }),
      SHORTS: (id) => ({ followerCount: 2500 + (id % 6000), subscribers: 2500 + (id % 6000) }),
    };
    const memberTypes = ["MODEL", "MODEL", "MODEL", "CAUTION", "WARNING"];
    const grades = ["GOLD", "SILVER", "BRONZE", "PLATINUM", "GOLD"];

    // 캠페인의 플랫폼으로 모든 신청자 채널 통일 (대문자)
    const campaignChannel = (campaignInfo.platform || "NAVER_BLOG").toUpperCase();

    const enrichedApps = applications.map((app) => {
      const reviewer = allReviewers.find((r) => r.id === app.reviewer_id);
      const channelName = campaignChannel; // 캠페인 플랫폼에 맞춤
      const metrics = (channelMetricsFn[channelName] || channelMetricsFn.NAVER_BLOG)(app.reviewer_id || 1);
      const channelUrl = reviewer && reviewer.channel_details && reviewer.channel_details[0] ? reviewer.channel_details[0].url : "";

      const rId = app.reviewer_id || 1;

      return {
        applicationId: app.id,
        reviewerId: rId,
        reviewerName: reviewer ? reviewer.nickname : `리뷰어${rId}`,
        reviewerEmail: `reviewer${rId}@example.com`,
        reviewerPhone: `010-${String(1000 + (rId % 9000)).padStart(4, "0")}-${String(1000 + ((rId * 7) % 9000)).padStart(4, "0")}`,
        reviewerGrade: grades[rId % grades.length],
        reviewerSex: rId % 2 === 0 ? "M" : "F",
        reviewerBirthDate: `19${90 + (rId % 10)}-${String(1 + (rId % 12)).padStart(2, "0")}-${String(1 + (rId % 28)).padStart(2, "0")}`,
        channelInfo: {
          channelId: rId * 10 + 1,
          channelName: channelName,
          channelUrl: channelUrl,
          ...metrics,
        },
        status: app.status === "PENDING" ? "APPLIED" : app.status,
        memo: app.memo || "",
        isAgreed: true,
        appliedAt: app.apply_date || new Date().toISOString(),
        selectedAt: app.status === "SELECTED" ? (app.selected_at || new Date().toISOString()) : null,
        canceledAt: null,
        // 프론트엔드 UI 추가 필드
        profileImage: (reviewer && reviewer.profile_image) || "/images/mypage/profile.svg",
        userType: rId % 5 === 0 ? "INFLUENCER" : "REVIEWER",
        memberType: memberTypes[rId % memberTypes.length],
      };
    });

    // 정렬
    if (sort === "OLDEST") {
      enrichedApps.sort((a, b) => (a.appliedAt || "").localeCompare(b.appliedAt || ""));
    } else if (sort === "RECOMMEND") {
      // 추천순: 등급(PLATINUM > GOLD > SILVER > BRONZE), 팔로워 수 순
      const gradeOrder = { PLATINUM: 4, GOLD: 3, SILVER: 2, BRONZE: 1 };
      enrichedApps.sort((a, b) => {
        const ga = gradeOrder[a.reviewerGrade] || 0;
        const gb = gradeOrder[b.reviewerGrade] || 0;
        if (ga !== gb) return gb - ga;
        return (b.channelInfo.followerCount || 0) - (a.channelInfo.followerCount || 0);
      });
    } else {
      // LATEST: 최신순
      enrichedApps.sort((a, b) => (b.appliedAt || "").localeCompare(a.appliedAt || ""));
    }

    // enrichedApps 기반으로 집계
    const appliedCount = enrichedApps.filter((a) => a.status === "APPLIED").length;
    const selectedCount = enrichedApps.filter((a) => a.status === "SELECTED").length;
    const canceledCount = enrichedApps.filter((a) => a.status === "CANCELED").length;

    // campaignInfo 집계값 반영
    campaignInfo.totalApplied = Math.max(appliedCount, campaignInfo.totalApplied || 0);
    campaignInfo.totalSelected = Math.max(selectedCount, campaignInfo.totalSelected || 0);
    campaignInfo.totalCanceled = canceledCount;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        campaignInfo: campaignInfo,
        applications: enrichedApps,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalElements: enrichedApps.length,
          size: 100,
          hasNext: false,
          hasPrevious: false,
        },
      },
    });
  }

  // ========================================
  // 📋 API 20: 리뷰어 선정하기
  // PUT /partner/campaign/applications/:applicationId/select
  // ========================================
  if (req.method === "PUT" && req.path.match(/^\/partner\/campaign\/applications\/(\d+)\/select$/)) {
    const applicationId = parseInt(req.path.split("/")[4], 10);

    try {
      const allApps = db.get("campaign_applications").value() || [];
      const appIndex = allApps.findIndex((a) => a.id === applicationId);

      if (appIndex === -1) {
        return res.status(404).json({
          result: "FAIL",
          message: "신청 내역을 찾을 수 없습니다.",
        });
      }

      const app = allApps[appIndex];

      // 이미 선정된 경우
      if (app.status === "SELECTED") {
        return res.status(409).json({
          result: "FAIL",
          message: "이미 선정된 리뷰어입니다.",
        });
      }

      // 모집인원 초과 체크
      const campaignId = app.campaign_id;
      const selectedCount = allApps.filter((a) => a.campaign_id === campaignId && a.status === "SELECTED").length;
      const allCampaigns = db.get("campaigns").value() || [];
      const campaign = allCampaigns.find((c) => c.id === campaignId);
      const recruitLimit = campaign ? (campaign.recruitLimit || (campaign.recruit && campaign.recruit.recruitLimit) || 999) : 999;

      if (selectedCount >= recruitLimit) {
        return res.status(400).json({
          result: "FAIL",
          message: "모집 인원을 초과할 수 없습니다.",
        });
      }

      // 상태 업데이트
      allApps[appIndex].status = "SELECTED";
      allApps[appIndex].selected_at = new Date().toISOString();
      db.set("campaign_applications", allApps).write();

      // 리뷰어 이름 조회
      const allReviewers20 = db.get("reviewers").value() || [];
      const reviewer20 = allReviewers20.find((r) => r.id === app.reviewer_id);

      return res.status(200).json({
        result: "OK",
        generatedAt: new Date().toISOString(),
        data: {
          applicationId: applicationId,
          campaignId: app.campaign_id,
          reviewerId: app.reviewer_id,
          reviewerName: reviewer20 ? reviewer20.nickname : `리뷰어${app.reviewer_id}`,
          status: "SELECTED",
          selectedAt: new Date().toISOString(),
          message: "리뷰어가 선정되었습니다.",
        },
      });
    } catch (e) {
      return res.status(500).json({ result: "FAIL", message: "서버 오류: " + e.message });
    }
  }

  // ========================================
  // 📋 API 21: 리뷰어 선정 취소하기
  // PUT /partner/campaign/applications/:applicationId/cancel-select
  // ========================================
  if (req.method === "PUT" && req.path.match(/^\/partner\/campaign\/applications\/(\d+)\/cancel-select$/)) {
    const applicationId = parseInt(req.path.split("/")[4], 10);

    try {
      const allApps = db.get("campaign_applications").value() || [];
      const appIndex = allApps.findIndex((a) => a.id === applicationId);

      if (appIndex === -1) {
        return res.status(404).json({
          result: "FAIL",
          message: "신청 내역을 찾을 수 없습니다.",
        });
      }

      const app = allApps[appIndex];

      if (app.status !== "SELECTED") {
        return res.status(400).json({
          result: "FAIL",
          message: "선정되지 않은 리뷰어입니다.",
        });
      }

      // 상태 업데이트
      allApps[appIndex].status = "APPLIED";
      allApps[appIndex].selected_at = null;
      db.set("campaign_applications", allApps).write();

      // 리뷰어 이름 조회
      const allReviewers21 = db.get("reviewers").value() || [];
      const reviewer21 = allReviewers21.find((r) => r.id === app.reviewer_id);

      return res.status(200).json({
        result: "OK",
        generatedAt: new Date().toISOString(),
        data: {
          applicationId: applicationId,
          campaignId: app.campaign_id,
          reviewerId: app.reviewer_id,
          reviewerName: reviewer21 ? reviewer21.nickname : `리뷰어${app.reviewer_id}`,
          status: "APPLIED",
          canceledAt: new Date().toISOString(),
          message: "리뷰어 선정이 취소되었습니다.",
        },
      });
    } catch (e) {
      return res.status(500).json({ result: "FAIL", message: "서버 오류: " + e.message });
    }
  }

  // ============ GET /reviewer/campaign/:campaignId (캠페인 상세) ============
  // 상태에 따라 appliedCount/selectedCount를 논리적으로 보정
  const reviewerCampaignMatch = req.method === "GET" && req.path.match(/^\/reviewer\/campaign\/(\d+)$/);
  if (reviewerCampaignMatch) {
    const campaignId = parseInt(reviewerCampaignMatch[1], 10);
    const campaigns = getCampaigns();
    const campaign = campaigns.find((c) => c.id === campaignId || c.campaignId === campaignId);
    if (campaign) {
      const statusNormalize = {
        SCHEDULED: "REGISTERING",
        approved: "REGISTERING",
        IN_PROGRESS: "SELECTING",
        SELECTED: "PURCHASING",
        REVIEW: "PURCHASING",
        COMPLETED: "CLOSED",
        CANCELLED: "EMERGENCY",
      };
      const normalizedStatus = statusNormalize[campaign.status] || campaign.status || "REGISTERING";

      // 모집 시작일이 미래이면 모집 전 → 신청자 0
      const recruitStartAt = (campaign.recruit && campaign.recruit.recruitStartAt) || campaign.recruitStartAt || "";
      const now = new Date();
      const isBeforeRecruitByDate = recruitStartAt && new Date(recruitStartAt) > now;
      const isBeforeRecruit = normalizedStatus === "REGISTERING" || isBeforeRecruitByDate;
      const isBeforeSelect = isBeforeRecruit || normalizedStatus === "RECRUITING";

      const result = { ...campaign, status: normalizedStatus };

      if (isBeforeRecruit) {
        result.appliedCount = 0;
        result.selectedCount = 0;
        if (result.metrics) {
          result.metrics = { ...result.metrics, appliedCount: 0, selectedCount: 0 };
        }
      } else if (isBeforeSelect) {
        result.selectedCount = 0;
        if (result.metrics) {
          result.metrics = { ...result.metrics, selectedCount: 0 };
        }
      }

      return res.json(result);
    }
  }

  // ====================================================================
  // 리뷰어 마이페이지 Mock (백엔드 R-28~R-32 응답 구조)
  // ====================================================================

  // GET /api/v1/reviewer/mypage/profile → 프로필 조회 (R-28 실제 API 경로)
  if (req.method === "GET" && req.path === "/api/v1/reviewer/mypage/profile") {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    const channels = r.channel_details || [];
    const firstConnected = channels.find(ch => ch.status === "connected");
    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      user: {
        userId: r.id || 2, role: "REVIEWER", name: r.name || "김은지",
        email: r.email || "kimeunji@gmail.com", phoneNum: r.phone || "010-2222-2222",
        address: r.address || "", postNumber: parseInt(r.postal_code) || 0, status: "ACTIVE",
        profileImage: r.profile_image ? { attachmentId: 1, fileId: 1, originalName: "profile.jpg", storedName: "profile.jpg", filePath: r.profile_image, fileType: "IMAGE" } : null,
        lastLoginAt: new Date().toISOString()
      },
      reviewerProfile: {
        reviewerId: r.number ? parseInt(r.number) : 2, grade: r.grade || "NORMAL",
        sex: r.gender === "여성" ? "W" : "M", birthDate: "1998-03-03",
        channel: firstConnected ? { channelId: 1, channelName: firstConnected.name, userChannelId: 10, externalId: firstConnected.url ? firstConnected.url.split("/").pop() : "", channelUrl: firstConnected.url } : null
      }
    });
  }

  // GET /api/v1/reviewer/mypage/edit → 내 정보 수정 조회 (R-31 실제 API 경로)
  if (req.method === "GET" && req.path === "/api/v1/reviewer/mypage/edit") {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      user: { userId: r.id || 2, name: r.name || "김은지", email: r.email || "kimeunji@gmail.com", phoneNum: r.phone || "010-2222-2222", status: "ACTIVE", createdAt: r.join_date || "2025-06-01T00:00:00+09:00", lastLoginAt: new Date().toISOString(), profileImageUrl: r.profile_image || null },
      address: r.address ? { zipCode: r.postal_code || "", address: r.address, addressDetail: r.detail_address || "" } : null,
      bankAccount: r.bank ? { bankName: r.bank, accountNumber: r.account_number || "", accountHolder: r.account_holder || "" } : null,
      reviewerProfile: { reviewerId: 2, grade: r.grade || "NORMAL", sex: r.gender === "여성" ? "FEMALE" : "MALE", birthDate: "1998-03-03" },
      social: { kakaoId: null, naverAccountId: "naver_12345" }
    });
  }

  // PUT /api/v1/reviewer/mypage/edit → 내 정보 수정 저장 (R-32 실제 API 경로)
  if (req.method === "PUT" && req.path === "/api/v1/reviewer/mypage/edit") {
    const body = req.body || {};
    return res.json({
      result: "UPDATED",
      generatedAt: new Date().toISOString(),
      userId: 2,
      address: { zipCode: String(body.postNumber || ""), address: body.address || "", addressDetail: body.addressDetail || "" },
      bankAccount: { bankAccountId: 7, bankName: body.bankName || "", accountNumber: body.accountNumber || "", accountHolder: body.accountHolder || "" },
      residentRegNoMasked: body.residentRegNo ? body.residentRegNo.substring(0, 6) + "-***" : "",
      updatedAt: new Date().toISOString()
    });
  }

  // GET /user/mypage/profile → 프로필 조회 (R-28 백엔드 정확 구조)
  if (req.method === "GET" && req.path === "/user/mypage/profile") {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    const channels = r.channel_details || [];
    const firstConnected = channels.find(ch => ch.status === "connected");
    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      user: {
        userId: r.id || 2, role: "REVIEWER", name: r.name || "김은지",
        email: r.email || "kimeunji@gmail.com", phoneNum: r.phone || "010-2222-2222",
        address: r.address || "", postNumber: parseInt(r.postal_code) || 0, status: "ACTIVE",
        profileImage: r.profile_image ? { attachmentId: 1, fileId: 1, originalName: "profile.jpg", storedName: "profile.jpg", filePath: r.profile_image, fileType: "IMAGE" } : null,
        lastLoginAt: new Date().toISOString()
      },
      reviewerProfile: {
        reviewerId: r.number ? parseInt(r.number) : 2, grade: r.grade || "NORMAL",
        sex: r.gender === "여성" ? "W" : "M", birthDate: "1998-03-03",
        channel: firstConnected ? { channelId: 1, channelName: firstConnected.name, userChannelId: 10, externalId: firstConnected.url ? firstConnected.url.split("/").pop() : "", channelUrl: firstConnected.url } : null
      }
    });
  }

  // GET /user/mypage/edit → 내 정보 수정 조회 (R-31 백엔드 정확 구조)
  if (req.method === "GET" && req.path === "/user/mypage/edit") {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      user: { userId: r.id || 2, name: r.name || "김은지", email: r.email || "kimeunji@gmail.com", phoneNum: r.phone || "010-2222-2222", status: "ACTIVE", createdAt: r.join_date || "2025-06-01T00:00:00+09:00", lastLoginAt: new Date().toISOString(), profileImageUrl: r.profile_image || null },
      address: r.address ? { zipCode: r.postal_code || "", address: r.address, addressDetail: r.detail_address || "" } : null,
      bankAccount: r.bank ? { bankName: r.bank, accountNumber: r.account_number || "", accountHolder: r.account_holder || "" } : null,
      reviewerProfile: { reviewerId: 2, grade: r.grade || "NORMAL", sex: r.gender === "여성" ? "FEMALE" : "MALE", birthDate: "1998-03-03" },
      social: { kakaoId: null, naverAccountId: "naver_12345" }
    });
  }

  // POST /user/mypage/edit → 내 정보 수정 저장 (R-32)
  if (req.method === "POST" && req.path === "/user/mypage/edit") {
    const body = req.body || {};
    return res.json({
      result: "UPDATED",
      generatedAt: new Date().toISOString(),
      userId: 2,
      address: { zipCode: String(body.postNumber || ""), address: body.address || "", addressDetail: body.addressDetail || "" },
      bankAccount: { bankAccountId: 7, bankName: body.bankName || "", accountNumber: body.accountNumber || "", accountHolder: body.accountHolder || "" },
      residentRegNoMasked: body.residentRegNo ? body.residentRegNo.substring(0, 6) + "-***" : "",
      updatedAt: new Date().toISOString()
    });
  }

  // GET /api/v1/reviewer/mypage/channels → 채널 조회 (R-29 실제 API 경로)
  if (req.method === "GET" && req.path === "/api/v1/reviewer/mypage/channels") {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    const channels = (r.channel_details || []).map((ch, idx) => ({
      userChannelId: idx + 1,
      channelId: idx + 1,
      channelName: ch.name,
      isConnected: ch.status === "connected",
      externalId: ch.url ? ch.url.split("/").pop() : null,
      channelUrl: ch.url || null,
      connectedAt: ch.status === "connected" ? "2025-06-01T00:00:00+09:00" : null
    }));
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      user: { userId: r.id || 2, role: "REVIEWER", name: r.name || "김은지", email: r.email || "", phoneNum: r.phone || "", address: r.address || "", postNumber: r.postal_code || "", status: "ACTIVE", profileImage: r.profile_image || null },
      reviewerProfile: { reviewerId: 2, grade: r.grade || "NORMAL", sex: r.gender === "여성" ? "W" : "M", birthDay: "1998-03-03", channel: channels }
    });
  }

  // PUT /api/v1/reviewer/mypage/channels → 채널 등록/수정 (R-30 실제 API 경로)
  if (req.method === "PUT" && req.path === "/api/v1/reviewer/mypage/channels") {
    return res.json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // GET /user/mypage/channel → 채널 조회 (R-29 백엔드 정확 구조)
  if (req.method === "GET" && req.path === "/user/mypage/channel") {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    const channels = (r.channel_details || []).map((ch, idx) => ({
      userChannelId: idx + 1,
      channelId: idx + 1,
      channelName: ch.name,
      isConnected: ch.status === "connected",
      externalId: ch.url ? ch.url.split("/").pop() : null,
      channelUrl: ch.url || null,
      connectedAt: ch.status === "connected" ? "2025-06-01T00:00:00+09:00" : null
    }));
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      user: { userId: r.id || 2, role: "REVIEWER", name: r.name || "김은지", email: r.email || "", phoneNum: r.phone || "", address: r.address || "", postNumber: r.postal_code || "", status: "ACTIVE", profileImage: r.profile_image || null },
      reviewerProfile: { reviewerId: 2, grade: r.grade || "NORMAL", sex: r.gender === "여성" ? "W" : "M", birthDay: "1998-03-03", channel: channels }
    });
  }

  // POST /user/mypage/channel → 채널 등록/수정 (R-30)
  if (req.method === "POST" && req.path === "/user/mypage/channel") {
    return res.json({ result: "OK", generatedAt: new Date().toISOString() });
  }

  // GET /user/point → 포인트 내역 (R-33) - middleware에서 처리
  if (req.method === "GET" && (req.path === "/user/point" || req.path === "/api/v1/reviewer/points")) {
    const pointHistory = db ? (db.get("point_history").value() || []) : [];
    const typeFilter = req.query.point_transaction_type;
    const typeMap = { earned: "PAYOUT", withdrawn: "WITHDRAW" };
    let filtered = pointHistory;
    if (typeFilter) {
      filtered = pointHistory.filter(p => {
        if (typeFilter === "PAYOUT") return p.type === "earned" || p.type === "PAYOUT";
        if (typeFilter === "WITHDRAW") return p.type === "withdrawn" || p.type === "WITHDRAW";
        return true;
      });
    }
    const items = filtered.map((p, idx) => ({
      pointTransactionId: p.id || idx + 1,
      type: p.type === "earned" ? "PAYOUT" : p.type === "withdrawn" ? "WITHDRAW" : (p.type || "PAYOUT"),
      amount: p.amount || 0,
      balanceBefore: (p.balance || 0) - (p.amount || 0),
      balanceAfter: p.balance || 0,
      description: p.description || "",
      campaignTitle: p.campaign_id ? "캠페인 " + p.campaign_id : null,
      status: p.status || "completed",
      rejectionReason: p.rejection_reason || null,
      createdAt: p.date ? p.date + "T00:00:00+09:00" : new Date().toISOString()
    }));
    return res.json({ result: "OK", generatedAt: new Date().toISOString(), data: { balance: 511200, items: items, nextCursor: null } });
  }

  // GET /user/point/withdrawal_request → 출금 페이지 (R-34)
  if (req.method === "GET" && (req.path === "/user/point/withdrawal_request" || req.path === "/api/v1/reviewer/points/withdraw")) {
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        balancePoint: 511200,
        bankAccount: { bankAccountId: 1, bankName: "신한은행", accountNumber: "00002469134000", accountHolder: "김은지" },
        withdrawalPolicy: { minAmount: 10000, maxAmount: 500000 }
      }
    });
  }

  // POST /user/point/withdrawal_request → 출금 신청 (R-35)
  if (req.method === "POST" && (req.path === "/user/point/withdrawal_request" || req.path === "/api/v1/reviewer/points/withdraw")) {
    const amount = (req.body && req.body.requestedAmount) || 0;
    const fee = Math.round(amount * 0.033);
    return res.json({
      result: "REQUESTED", generatedAt: new Date().toISOString(),
      data: {
        withdrawalId: 100, bankAccountId: 1, pointTransactionId: 200,
        withdrawalNumber: "WD-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-000001",
        status: "PENDING", requestedAmount: amount, feeAmount: fee, expectedAmount: amount - fee,
        feeRate: 0.033, balanceBefore: 511200, balanceAfter: 511200 - amount,
        requestedAt: new Date().toISOString()
      }
    });
  }

  // ====================================================================
  // 리뷰어 공지사항 Mock (백엔드 R-37 응답 구조)
  // ====================================================================

  // GET /user/notice → 공지사항 목록
  if (req.method === "GET" && (req.path === "/user/notice" || req.path === "/api/v1/reviewer/notices")) {
    const db = require("./db.json");
    const allNotices = db.user_notices || [];
    const boardCategory = req.query.board_category;

    const filtered = boardCategory && boardCategory !== "ALL"
      ? allNotices.filter((n) => n.boardCategory === boardCategory)
      : allNotices;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { totalCount: filtered.length, items: filtered },
    });
  }

  // GET /user/notice/:id → 공지사항 상세
  if (req.method === "GET" && (req.path.match(/^\/user\/notice\/\d+$/) || req.path.match(/^\/api\/v1\/reviewer\/notices\/\d+$/))) {
    const db = require("./db.json");
    const allNotices = db.user_notices || [];
    const boardId = Number(req.path.split("/").pop());
    const notice = allNotices.find((n) => n.boardId === boardId);

    if (!notice) {
      return res.status(404).json({
        result: "ERROR",
        generatedAt: new Date().toISOString(),
        error: { code: "NOT_FOUND", message: "존재하지 않는 공지사항입니다." },
      });
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { item: notice },
    });
  }

  // ====================================================================
  // 리뷰어 FAQ Mock (백엔드 R-38 응답 구조)
  // ====================================================================

  // GET /user/faq → FAQ 목록
  if (req.method === "GET" && (req.path === "/user/faq" || req.path === "/api/v1/reviewer/faq")) {
    const db = require("./db.json");
    const allFaqs = db.user_faqs || [];
    const boardCategory = req.query.board_category;

    const filtered = boardCategory && boardCategory !== "ALL"
      ? allFaqs.filter((f) => f.boardCategory === boardCategory)
      : allFaqs;

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { totalCount: filtered.length, items: filtered },
    });
  }

  // ====================================================================
  // 리뷰어 캠페인 유형별 목록 Mock (백엔드 R-22 응답 구조)
  // GET /campaign/{type} — type: delivery, visit, purchase, reporter, mission
  // ====================================================================

  var campaignTypeMatch = req.method === "GET" && /^\/campaign\/(delivery|visit|purchase|reporter|mission)$/.exec(req.path);
  if (campaignTypeMatch) {
    var cType = campaignTypeMatch[1];
    var collectionName = "campaign_" + cType;
    var dbData = require("./db.json");
    var allItems = dbData[collectionName] || [];

    // 유형별 컬렉션이 비어있으면 campaigns에서 유형별로 필터
    if (allItems.length === 0) {
      var TYPE_MAP_REVERSE = { delivery: "DELIVERY", visit: "VISIT", purchase: "PURCHASE_REVIEW", reporter: "REPORTER", mission: "MISSION" };
      var targetType = TYPE_MAP_REVERSE[cType] || cType.toUpperCase();
      var getCampaigns2 = function() {
        return getCampaigns();
      };
      allItems = getCampaigns2().filter(function(c) {
        return c.type === targetType || c.type === cType.toUpperCase();
      }).map(function(c) {
        // region 객체를 문자열로 변환
        var regionStr = c.region;
        if (c.region && typeof c.region === "object") {
          var parentName = c.region.parentName || "";
          var regionName = c.region.name || "";
          // 시/도 이름을 필터 표시용 짧은 이름으로 변환
          var REGION_SHORT = {"서울특별시":"서울","인천광역시":"인천","경기도":"경기","강원특별자치도":"강원","대전광역시":"대전","세종특별자치시":"세종","충청북도":"충북","충청남도":"충남","전라북도":"전북","전라남도":"전남","광주광역시":"광주","대구광역시":"대구","경상북도":"경북","경상남도":"경남","부산광역시":"부산","울산광역시":"울산","제주특별자치도":"제주"};
          var shortParent = REGION_SHORT[parentName] || parentName;
          regionStr = regionName ? (shortParent + " > " + regionName) : shortParent;
        }
        return Object.assign({}, c, { region: regionStr });
      });
    }

    // 필터: categoryId, requiredPlatformId
    var filtered = allItems;
    if (req.query.categoryId) {
      var catId = Number(req.query.categoryId);
      filtered = filtered.filter(function(c) { return c.category && c.category.categoryId === catId; });
    }
    if (req.query.requiredPlatformId) {
      var platId = Number(req.query.requiredPlatformId);
      filtered = filtered.filter(function(c) { return c.requiredPlatform && c.requiredPlatform.channelId === platId; });
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      items: filtered,
    });
  }

  // ====================================================================
  // 리뷰어 캠페인 상세 Mock (백엔드 R-23 응답 구조)
  // GET /campaign/{type}/{campaignId}
  // ====================================================================

  var campaignDetailMatch = req.method === "GET" && /^\/campaign\/(delivery|visit|purchase|reporter|mission)\/([^/]+)$/.exec(req.path);
  if (campaignDetailMatch) {
    var detailType = campaignDetailMatch[1];
    var detailIdRaw = campaignDetailMatch[2];
    var detailId = /^\d+$/.test(detailIdRaw) ? Number(detailIdRaw) : detailIdRaw;
    var dbData2 = require("./db.json");
    var allCampaigns = getCampaigns();
    // 1차: campaignId, id, campaignInfo.id 로 검색
    var found = allCampaigns.find(function(c) {
      var cId = c.campaignId || c.id;
      var infoId = c.campaignInfo && c.campaignInfo.id;
      return cId === detailId || String(cId) === String(detailId)
        || infoId === detailId || String(infoId) === String(detailId);
    });
    // 2차: 타입별 전용 배열에서 검색 (delivery_campaigns, visit_campaigns 등)
    if (!found) {
      var typeArrayKey = detailType + "_campaigns";
      var typeArray = dbData2[typeArrayKey] || [];
      found = typeArray.find(function(c) {
        var cId = c.campaignId || c.id;
        var infoId = c.campaignInfo && c.campaignInfo.id;
        return cId === detailId || String(cId) === String(detailId)
          || infoId === detailId || String(infoId) === String(detailId);
      });
    }
    // 3차: 모든 타입별 배열에서 검색
    if (!found) {
      var typeKeys = ["delivery_campaigns", "visit_campaigns", "review_campaigns", "reporter_campaigns", "mission_campaigns", "purchase_campaigns"];
      for (var ti = 0; ti < typeKeys.length && !found; ti++) {
        var arr = dbData2[typeKeys[ti]] || [];
        found = arr.find(function(c) {
          var cId = c.campaignId || c.id;
          var infoId = c.campaignInfo && c.campaignInfo.id;
          return cId === detailId || String(cId) === String(detailId)
            || infoId === detailId || String(infoId) === String(detailId);
        });
      }
    }

    if (!found) {
      return res.status(404).json({
        result: "FAIL",
        error: { code: "CAMPAIGN_NOT_FOUND", message: "캠페인을 찾을 수 없습니다." },
      });
    }

    // campaignInfo 중첩 구조인 경우 풀어서 사용
    var campaignData = found.campaignInfo ? Object.assign({}, found, found.campaignInfo) : found;

    // R-24 신청 모달 데이터도 함께 반환 (실제 백엔드는 인증된 유저에 대해 추가 필드 반환)
    var needsChannel = (detailType === "delivery" || detailType === "visit" || detailType === "reporter");
    var channelName = (campaignData.requiredPlatform && campaignData.requiredPlatform.channelName)
      || campaignData.channel || "NAVER_BLOG";

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: campaignData,
      // R-24 추가 필드
      campaignId: campaignData.id || detailId,
      type: campaignData.type || campaignData.campaignType || detailType.toUpperCase(),
      applicant: {
        name: "테스트 리뷰어",
        phoneNum: "010-1234-5678",
        postNumber: 12345,
        address: "서울특별시 강남구 테헤란로 123",
        addressDetail: "4층 401호",
      },
      requiredChannel: needsChannel ? {
        channelId: (campaignData.requiredPlatform && campaignData.requiredPlatform.channelId) || 1,
        channelName: channelName,
        isConnected: true,
        userChannelId: 100,
        externalId: "test_user_channel",
        channelUrl: "https://blog.naver.com/test_reviewer",
      } : null,
      defaults: { memo: "", isAgreed: false },
      eligibility: { canApply: true, reasons: [] },
    });
  }

  // ====================================================================
  // 리뷰어 캠페인 신청 Mock (백엔드 R-25 응답 구조)
  // POST /campaign/{type}/{campaignId}
  // ====================================================================

  var campaignApplyMatch = req.method === "POST" && /^\/campaign\/(delivery|visit|purchase|reporter|mission)\/([^/]+)$/.exec(req.path);
  if (campaignApplyMatch) {
    var applyIdRaw = campaignApplyMatch[2];
    var applyId = /^\d+$/.test(applyIdRaw) ? Number(applyIdRaw) : 9999;
    var dbData3 = require("./db.json");
    var allCampaigns3 = dbData3.campaigns || [];
    var foundCampaign = allCampaigns3.find(function(c) { return (c.campaignId || c.id) === applyId; });

    if (!foundCampaign) {
      return res.status(404).json({
        result: "FAIL",
        error: { code: "CAMPAIGN_NOT_FOUND", message: "캠페인을 찾을 수 없습니다." },
      });
    }

    // 모집중이 아니면 에러
    if (foundCampaign.status && foundCampaign.status !== "RECRUITING" && foundCampaign.status !== "EMERGENCY") {
      return res.status(400).json({
        result: "FAIL",
        error: { code: "CAMPAIGN_NOT_RECRUITING", message: "모집 중인 캠페인이 아닙니다." },
      });
    }

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      applicationId: Math.floor(Math.random() * 10000) + 1,
      campaignId: applyId,
      status: "APPLIED",
      appliedAt: new Date().toISOString(),
    });
  }

  // ====================================================================
  // 리뷰어 캠페인 신청 Mock (백엔드 R-24, R-25 응답 구조)
  // ====================================================================

  // GET /campaign/:type/:id → 신청 모달 데이터 조회 (R-24)
  if (req.method === "GET" && req.path.match(/^\/campaign\/(delivery|visit|review|reporter|mission)\/[^/]+$/)) {
    const reviewers = db ? (db.get("reviewers").value() || []) : [];
    const r = reviewers.find(rv => rv.id === 2) || reviewers[0] || {};
    const channels = r.channel_details || [];
    const firstConnected = channels.find(ch => ch.status === "connected");
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      applicant: { name: r.name || "김은지", phoneNum: r.phone || "010-2222-2222", postNumber: parseInt(r.postal_code) || 0, address: r.address || "", addressDetail: r.detail_address || "" },
      requiredChannel: firstConnected ? { channelId: 1, channelName: firstConnected.name, isConnected: true, userChannelId: 10, channelUrl: firstConnected.url } : null,
      eligibility: { canApply: true, reasons: [] }
    });
  }

  // POST /campaign/:type/:id → 캠페인 신청 (R-25)
  if (req.method === "POST" && req.path.match(/^\/campaign\/(delivery|visit|review|reporter|mission)\/[^/]+$/)) {
    const pathParts = req.path.split("/");
    const campaignId = parseInt(pathParts[pathParts.length - 1]);
    return res.json({
      result: "OK", generatedAt: new Date().toISOString(),
      applicationId: 900 + campaignId,
      campaignId: campaignId,
      status: "APPLIED",
      appliedAt: new Date().toISOString()
    });
  }

  // ====================================================================
  // 리뷰어 대시보드 Mock (백엔드 R-20 응답 구조)
  // GET /user → 대시보드 메인페이지 (섹션별 캠페인 목록)
  // ====================================================================

  if (req.method === "GET" && req.path === "/user") {
    var channelMap = { 1: "NAVER_BLOG", 2: "INSTAGRAM", 3: "YOUTUBE", 4: "NAVER_CLIP" };
    var categoryMap = { 1: "뷰티", 2: "맛집", 3: "생활", 4: "디지털", 5: "여행", 6: "패션", 7: "건강", 8: "반려동물" };

    // campaigns 테이블 하나에서 모든 타입의 캠페인을 UserDashboardCampaignItem 형식으로 변환
    var allCampaignsForDash = getCampaigns();
    var dashCampaigns = [];
    allCampaignsForDash.forEach(function(c) {
      var cId = c.campaignId || c.id;
      if (!cId || (typeof cId === "string" && cId.includes("test"))) return; // 테스트 데이터 제외
      if (!c.type) return; // 타입 없는 항목 제외
      var catId = c.categoryId || (c.category && c.category.categoryId) || 1;
      var chId = c.channelId || (c.requiredPlatform && c.requiredPlatform.channelId) || 1;
      dashCampaigns.push({
        campaignId: typeof cId === "string" ? parseInt(cId) || cId : cId,
        type: c.type,
        status: c.status || "RECRUITING",
        title: c.title || "캠페인 " + cId,
        thumbnail: { url: c.thumbnailUrl || (c.thumbnail && c.thumbnail.url) || "/images/main/campaign_img/eximg_01.png" },
        category: { categoryId: catId, categoryName: (c.category && c.category.categoryName) || categoryMap[catId] || "생활" },
        requiredPlatform: { channelId: chId, channelName: (c.requiredPlatform && c.requiredPlatform.channelName) || channelMap[chId] || "NAVER_BLOG" },
        region: c.region || null,
        recruit: {
          recruitLimit: c.recruitLimit || (c.recruit && c.recruit.recruitLimit) || 10,
          recruitStartAt: c.recruitStartAt || (c.recruit && c.recruit.recruitStartAt) || "2026-03-01T00:00:00+09:00",
          recruitEndAt: c.recruitEndAt || (c.recruit && c.recruit.recruitEndAt) || "2026-04-30T23:59:59+09:00",
        },
        metrics: {
          appliedCount: c.appliedCount || (c.metrics && c.metrics.appliedCount) || 0,
          selectedCount: c.selectedCount || (c.metrics && c.metrics.selectedCount) || 0,
          applicationRate: 0,
        },
        reward: {
          extraRewardPoint: c.extraRewardPoint || (c.reward && c.reward.extraRewardPoint) || 0,
          paymentRewardPoint: c.paymentRewardPoint || (c.reward && c.reward.paymentRewardPoint) || 0,
        },
      });
    });

    // 섹션별 분배 (파트너 대시보드와 동일한 로직)
    var recruiting = dashCampaigns.filter(function(c) { return c.status === "RECRUITING"; });
    var shuffled = recruiting.sort(function() { return 0.5 - Math.random(); });

    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      sections: {
        highSelectionProbability: shuffled.filter(function(c) { return c.metrics.appliedCount < 20; }).slice(0, 8),
        popularNow: shuffled.filter(function(c) { return c.metrics.appliedCount >= 5; }).slice(0, 8),
        ongoing: shuffled.slice(0, 32),
        similar: shuffled.slice(0, 8),
      },
    });
  }

  // ====================================================================
  // 리뷰어 캠페인 유형별 목록 Mock (백엔드 R-22 응답 구조)
  // ====================================================================

  // GET /api/v1/reviewer/dashboard/{type} → 유형별 캠페인 목록
  const reviewerTypeMatch = req.method === "GET" && req.path.match(/^\/api\/v1\/reviewer\/dashboard\/(delivery|visit|purchase|purchase-review|reporter|mission)$/);
  if (reviewerTypeMatch) {
    const typeParam = reviewerTypeMatch[1];
    const typeMap = { "delivery": "DELIVERY", "visit": "VISIT", "purchase": "PURCHASE", "purchase-review": "PURCHASE", "reporter": "REPORTER", "mission": "MISSION" };
    const targetType = typeMap[typeParam] || typeParam.toUpperCase();
    const campaigns = getCampaigns();
    const filtered = campaigns.filter(c => c.type === targetType);
    const items = filtered.map(c => ({
      campaignId: c.id || c.campaignId,
      type: c.type,
      status: c.status || "REGISTERING",
      isEmergency: c.isUrgent === true || c.isEmergency === true,
      title: c.title || "",
      thumbnailUrl: c.thumbnailUrl || c.thumbnail?.url || "/images/main/campaign_img/eximg_1.png",
      category: c.category || { categoryId: 1, categoryName: "기타" },
      requiredPlatform: c.requiredPlatform || { channelId: 1, channelName: "NAVER_BLOG" },
      recruitStartAt: c.recruitStartAt || c.recruit?.recruitStartAt || "",
      recruitEndAt: c.recruitEndAt || c.recruit?.recruitEndAt || "",
      recruitLimit: c.recruitLimit || c.recruit?.recruitLimit || 10,
      appliedCount: c.appliedCount || c.metrics?.appliedCount || c.recruitment?.current || 0,
      region: c.region || null,
    }));
    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: { items },
    });
  }

  // ====================================================================
  // 리뷰어 검색 Mock (백엔드 R-21 응답 구조)
  // ====================================================================

  // GET /search → 캠페인 검색 (R-21) — 파트너 검색과 동일한 응답 구조
  if (req.method === "GET" && (req.path === "/search" || req.path === "/api/v1/reviewer/dashboard/search")) {
    const keyword = (req.query.keyword || "").toLowerCase();
    const allCampaigns = getCampaigns();
    var filtered = keyword
      ? allCampaigns.filter(function(c) { return (c.title || "").toLowerCase().includes(keyword); })
      : allCampaigns;
    var searchCampaigns = filtered.map(function(c) {
      return {
        campaignId: c.id || c.campaignId,
        type: c.type || "DELIVERY",
        status: c.status || "RECRUITING",
        title: c.title || "",
        thumbnail: { url: c.thumbnailUrl || (c.thumbnail && c.thumbnail.url) || "" },
        category: c.category || { categoryId: 1, categoryName: "뷰티" },
        requiredPlatform: c.requiredPlatform || { channelId: 2, channelName: "NAVER_BLOG" },
        recruit: {
          recruitLimit: (c.recruit && c.recruit.recruitLimit) || c.recruitLimit || 30,
          recruitStartAt: (c.recruit && c.recruit.recruitStartAt) || c.recruitStartAt || "",
          recruitEndAt: (c.recruit && c.recruit.recruitEndAt) || c.recruitEndAt || "",
        },
        metrics: {
          appliedCount: (c.metrics && c.metrics.appliedCount) || 0,
        },
        reward: c.reward || { extraRewardPoint: 0, paymentRewardPoint: 0 },
      };
    });
    // R-21 flat 필드 추가 (실제 백엔드 호환)
    var searchItems = searchCampaigns.map(function(c) {
      return Object.assign({}, c, {
        imageUrl: c.thumbnail && c.thumbnail.url ? c.thumbnail.url : "",
        recruitLimit: c.recruit ? c.recruit.recruitLimit : 0,
        campaignApplicationCount: c.metrics ? c.metrics.appliedCount : 0,
        categoryId: c.category ? c.category.categoryId : 1,
        channelId: c.requiredPlatform ? c.requiredPlatform.channelId : 1,
      });
    });
    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      keyword: keyword,
      totalCount: searchItems.length,
      items: searchItems,
    });
  }

  // ====================================================================
  // 리뷰어 패널티 Mock (백엔드 R-36 응답 구조)
  // ====================================================================

  // GET /user/campaign_management/penalty → 패널티 현황/내역 (R-36)
  if (req.method === "GET" && (req.path === "/user/campaign_management/penalty" || req.path === "/api/v1/reviewer/penalties")) {
    const penalties = db ? (db.get("user_penalties").value() || []) : [];
    const statusArr = db ? (db.get("user_penalty_status").value() || []) : [];
    const statusData = statusArr[0] || { currentStatus: "활동 가능", penaltyCount: 0 };

    // currentStatus → currentLevel 매핑
    const levelMap = { "활동 가능": "NORMAL", "경고 조치": "NORMAL", "이용 정지 7일": "CAUTION", "이용 정지 15일": "CAUTION", "이용 정지 30일": "CAUTION", "영구 정지": "BANNED" };
    const isSuspended = statusData.currentStatus.includes("이용 정지");
    const remainDaysMatch = statusData.currentStatus.match(/(\d+)일/);

    const items = penalties.map((p, idx) => ({
      userPenaltyHistoryId: idx + 1,
      penaltyCode: "P00" + (idx + 1),
      penaltyReason: p.title || "",
      penaltyScore: (idx + 1) * 10,
      imposeType: "SYSTEM",
      createdAt: (p.date || "2025-09-01") + "T09:00:00+09:00",
      campaignTitle: p.campaignTitle || null,
    }));

    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        summary: {
          currentTotalScore: statusData.penaltyCount || 0,
          currentLevel: levelMap[statusData.currentStatus] || "NORMAL",
          isSuspended: isSuspended,
          suspendedRemainingDays: isSuspended && remainDaysMatch ? parseInt(remainDaysMatch[1]) : null,
          isPermanentlyBanned: statusData.currentStatus === "영구 정지",
        },
        items: items,
      },
    });
  }

  // ====================================================================
  // 리뷰어 알림 Mock (백엔드 R-26 응답 구조)
  // ====================================================================

  // GET /user/notification → 알림 내역 조회
  if (req.method === "GET" && (req.path === "/user/notification" || req.path === "/api/v1/reviewer/notifications")) {
    const mockNotifications = db ? (db.get("notifications").value() || []) : [];
    const items = mockNotifications.map((n, idx) => ({
      notificationHistoryId: n.id || 1200 + idx,
      campaignId: n.campaign_id || null,
      userId: 2,
      type: n.type || "CAMPAIGN_SELECTED",
      message: n.message || "",
      createdAt: n.created_at || new Date(Date.now() - idx * 3600000).toISOString(),
    }));
    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      data: {
        items: items,
        nextCursor: null
      },
    });
  }

  // DELETE /user/notification → 전체 알림 삭제
  if (req.method === "DELETE" && (req.path === "/user/notification" || req.path === "/api/v1/reviewer/notifications/all")) {
    return res.json({ result: "OK" });
  }

  // ====================================================================
  // 리뷰어 소셜 로그인 Mock (OAuth 시뮬레이션)
  // ====================================================================

  // GET /api/v1/auth/naver/authorize → 네이버 OAuth 시뮬레이션 (302 → callback)
  if (req.method === "GET" && req.path === "/api/v1/auth/naver/authorize") {
    return res.redirect(302, "http://localhost:3002/user/login/callback?code=mock_naver_code&state=mock_naver_state");
  }

  // GET /api/v1/auth/kakao/authorize → 카카오 OAuth 시뮬레이션 (302 → callback)
  if (req.method === "GET" && req.path === "/api/v1/auth/kakao/authorize") {
    return res.redirect(302, "http://localhost:3002/user/login/callback?code=mock_kakao_code&state=mock_kakao_state");
  }

  // GET /api/v1/auth/naver/callback → 기존 회원 (LOGGED_IN)
  if (req.method === "GET" && req.path === "/api/v1/auth/naver/callback") {
    return res.json({
      result: "LOGGED_IN",
      provider: "NAVER",
      user: { userId: 2, role: "REVIEWER", email: "kimeunji@gmail.com", name: "김은지" },
      token: { accessToken: "mock_access_token_naver_" + Date.now(), refreshToken: "mock_refresh_token_naver" },
      next: { action: "REDIRECT", redirectPath: "/user/campaign_management" }
    });
  }

  // GET /api/v1/auth/kakao/callback → 미가입자 (SIGN_UP_REQUIRED)
  if (req.method === "GET" && req.path === "/api/v1/auth/kakao/callback") {
    return res.json({
      result: "SIGN_UP_REQUIRED",
      provider: "KAKAO",
      signupToken: "st_mock_kakao_" + Date.now(),
      prefill: { email: "newuser@kakao.com", name: "", nickname: "", profileImageUrl: "", gender: null, ageRange: null, birthyear: null, phoneNum: null },
      next: { action: "SIGN_UP", redirectPath: "/user/signup" }
    });
  }

  // ====================================================================
  // 리뷰어 회원가입 Mock
  // ====================================================================

  // GET /api/v1/reviewer/sign-up → signupToken 검증 + prefill
  if (req.method === "GET" && req.path === "/api/v1/reviewer/sign-up" && req.query.signupToken) {
    return res.json({ result: "OK", data: { email: "newuser@kakao.com", provider: "KAKAO" } });
  }

  // POST /api/v1/reviewer/sign-up → 회원가입 완료
  if (req.method === "POST" && req.path === "/api/v1/reviewer/sign-up") {
    const body = req.body || {};
    return res.json({
      result: "SIGNED_UP_AND_LOGGED_IN",
      user: { userId: 999, role: "REVIEWER", email: body.email || "newuser@kakao.com", name: body.name || "새회원", phoneNum: body.phoneNum || "" },
      token: { accessToken: "mock_access_token_signup_" + Date.now(), refreshToken: "mock_refresh_token_signup" },
      next: { action: "REDIRECT", redirectPath: "/user/signup/complete" }
    });
  }

  // GET /api/v1/reviewer/sign-up/finish → 회원가입 완료 상태 확인
  if (req.method === "GET" && req.path === "/api/v1/reviewer/sign-up/finish") {
    return res.json({ result: "OK", page: "SIGN_UP_FINISH", message: "회원가입이 완료되었습니다." });
  }

  // ====================================================================
  // 리뷰어 계정 찾기 Mock
  // ====================================================================

  // POST /api/v1/auth/find-account → 계정 조회
  if (req.method === "POST" && req.path === "/api/v1/auth/find-account") {
    const phone = (req.body && req.body.phoneNum) || "";
    // 010-0000-0000 / 01000000000 → 네이버 계정 찾음
    if (phone === "01000000000" || phone === "010-0000-0000") {
      return res.json({ result: "FOUND", provider: "NAVER", maskedEmail: "gd***@naver.com" });
    }
    // 010-1111-1111 → 카카오 계정 찾음
    if (phone === "01011111111" || phone === "010-1111-1111") {
      return res.json({ result: "FOUND", provider: "KAKAO", maskedEmail: "ka***@kakao.com" });
    }
    return res.json({ result: "NOT_FOUND" });
  }

  // ====================================================================
  // 리뷰어 회원 탈퇴 Mock
  // ====================================================================

  // DELETE /api/v1/reviewer/withdraw → 탈퇴 처리
  if (req.method === "DELETE" && req.path === "/api/v1/reviewer/withdraw") {
    return res.json({ result: "OK", message: "탈퇴가 완료되었습니다." });
  }

  // ====================================================================
  // 리뷰어 캠페인 관리 Mock (백엔드 R-27 응답 구조)
  // ====================================================================

  // GET /user/campaign_management → 내 캠페인 내역 조회
  if (req.method === "GET" && req.path === "/user/campaign_management") {
    const statusFilter = req.query.status;
    const allItems = db ? (db.get("reviewer_campaign_management").value() || []) : [];

    // 백엔드 status 매핑 (db.json 한글 → 백엔드 ENUM)
    const statusMap = { "신청완료": "APPLIED", "선정완료": "SELECTED", "콘텐츠등록": "SELECTED", "완료": "COMPLETE", "취소/반려": "CANCELED" };
    const typeMap = { "배송형": "DELIVERY", "방문형": "VISIT", "구매평": "PURCHASE", "기자단": "REPORTER", "미션형": "MISSION" };

    const mapped = allItems.map((item, idx) => ({
      campaignApplicationId: 900 + idx,
      campaignId: isNaN(parseInt(item.id)) ? item.id : parseInt(item.id),
      campaignType: typeMap[item.type] || "DELIVERY",
      status: statusMap[item.status] || "APPLIED",
      title: item.title || "",
      thumbnailUrl: item.image || "",
      appliedAt: new Date(Date.now() - idx * 86400000).toISOString(),
      selectedAt: (item.status === "선정완료" || item.status === "콘텐츠등록" || item.status === "완료") ? new Date(Date.now() - idx * 43200000).toISOString() : null,
      content: (item.status === "선정완료" || item.status === "콘텐츠등록") ? {
        campaignContentId: 500 + idx,
        contentStatus: item.hasContent ? "SUBMITTED" : "WAIT",
        contentUrl: item.hasContent ? "https://blog.naver.com/mock/" + item.id : null
      } : null,
      remainingDays: item.remainingDays || 0,
      isUrgent: item.isUrgent || false,
      type: item.type || "배송형",
      category: item.category || "",
      image: item.image || "",
      statusMessage: item.statusMessage || "",
      hasContent: item.hasContent || false,
      isPenalty: item.isPenalty || false,
      extensionCount: item.extensionCount || 0,
      contentType: item.contentType || undefined,
    }));

    let filtered = mapped;
    if (statusFilter) {
      if (statusFilter === "REJECT") {
        filtered = mapped.filter(i => i.status === "CANCELED" && (allItems.find(o => o.id === String(i.campaignId))?.status === "취소/반려"));
      } else {
        filtered = mapped.filter(i => i.status === statusFilter);
      }
    }

    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      items: filtered,
      totalCount: filtered.length,
      nextCursor: null
    });
  }

  // GET /api/v1/reviewer/campaigns → 내 캠페인 내역 조회 (실제 API 경로)
  if (req.method === "GET" && req.path === "/api/v1/reviewer/campaigns") {
    const statusFilter = req.query.status;
    const allItems = db ? (db.get("reviewer_campaign_management").value() || []) : [];

    const statusMap = { "신청완료": "APPLIED", "선정완료": "SELECTED", "콘텐츠등록": "SELECTED", "완료": "COMPLETE", "취소/반려": "CANCELED" };
    const typeMap = { "배송형": "DELIVERY", "방문형": "VISIT", "구매평": "PURCHASE", "기자단": "REPORTER", "미션형": "MISSION" };

    const mapped = allItems.map((item, idx) => ({
      campaignApplicationId: 900 + idx,
      campaignId: isNaN(parseInt(item.id)) ? item.id : parseInt(item.id),
      campaignType: typeMap[item.type] || "DELIVERY",
      channelType: item.category || "",
      status: statusMap[item.status] || "APPLIED",
      title: item.title || "",
      thumbnailUrl: item.image || "",
      recruitEndAt: new Date(Date.now() + (item.remainingDays || 0) * 86400000).toISOString(),
      appliedAt: new Date(Date.now() - idx * 86400000).toISOString(),
      selectedAt: (item.status === "선정완료" || item.status === "콘텐츠등록" || item.status === "완료") ? new Date(Date.now() - idx * 43200000).toISOString() : null,
      content: (item.status === "선정완료" || item.status === "콘텐츠등록") ? {
        campaignContentId: 500 + idx,
        contentStatus: item.hasContent ? "SUBMITTED" : "WAIT",
        contentUrl: item.hasContent ? "https://blog.naver.com/mock/" + item.id : null
      } : null,
      isUrgent: item.isUrgent || false,
      subStatus: item.subStatus || undefined,
      rejectionReason: item.rejectionReason || undefined,
      rejectedAt: item.rejectedAt || undefined,
      isPenalty: item.isPenalty || false,
    }));

    let filtered = mapped;
    if (statusFilter) {
      filtered = mapped.filter(i => i.status === statusFilter);
    }

    return res.json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      items: filtered,
      nextCursor: null
    });
  }

  // DELETE /api/v1/reviewer/campaigns/:id/cancel → 신청 취소
  if (req.method === "DELETE" && req.path.match(/^\/api\/v1\/reviewer\/campaigns\/\d+\/cancel$/)) {
    return res.json({ result: "OK", message: "신청이 취소되었습니다." });
  }

  // POST /api/v1/reviewer/campaigns/:id/content → 콘텐츠 등록
  if (req.method === "POST" && req.path.match(/^\/api\/v1\/reviewer\/campaigns\/\d+\/content$/)) {
    return res.json({ result: "OK", campaignContentId: 600, contentStatus: "SUBMITTED" });
  }

  // PUT /api/v1/reviewer/campaigns/:id/content → 콘텐츠 수정
  if (req.method === "PUT" && req.path.match(/^\/api\/v1\/reviewer\/campaigns\/\d+\/content$/)) {
    return res.json({ result: "OK", campaignContentId: 600, contentStatus: "SUBMITTED" });
  }

  // POST /api/v1/reviewer/campaigns/:id/content/extend → 기한 연장
  if (req.method === "POST" && req.path.match(/^\/api\/v1\/reviewer\/campaigns\/\d+\/content\/extend$/)) {
    return res.json({ result: "OK", extensionCount: 1, newDeadline: new Date(Date.now() + 3 * 86400000).toISOString() });
  }

  // GET /api/v1/reviewer/campaigns/:id/content/rejection → 반려 사유
  if (req.method === "GET" && req.path.match(/^\/api\/v1\/reviewer\/campaigns\/\d+\/content\/rejection$/)) {
    return res.json({ result: "OK", rejectionCode: "R003", rejectionReason: "콘텐츠 내 홍보 키워드 누락", rejectedAt: new Date().toISOString(), resubmitDeadline: new Date(Date.now() + 5 * 86400000).toISOString() });
  }

  // ====================================================================
  // R-24: 신청 모달 데이터 조회 (GET /api/v1/reviewer/campaign/{type}/{id}/apply-form)
  // ====================================================================
  var applyFormMatch = req.method === "GET" && /^\/api\/v1\/reviewer\/campaign\/(delivery|visit|purchase|reporter|mission)\/([^/]+)\/apply-form$/.exec(req.path);
  if (applyFormMatch) {
    var applyFormType = applyFormMatch[1];
    var needsChannelApplyForm = (applyFormType === "delivery" || applyFormType === "visit" || applyFormType === "reporter");
    return res.status(200).json({
      result: "OK",
      applicant: {
        name: "테스트유저",
        phoneNum: "010-1234-5678",
        postNumber: 12345,
        address: "서울특별시 강남구 테헤란로 123",
        addressDetail: "4층 401호",
      },
      requiredChannel: needsChannelApplyForm ? {
        channelId: 1,
        channelName: "NAVER_BLOG",
        isConnected: true,
        userChannelId: 100,
        channelUrl: "https://blog.naver.com/test_reviewer",
      } : null,
      eligibility: { canApply: true, reasons: [] },
    });
  }

  // ====================================================================
  // R-25: 캠페인 신청 (POST /api/v1/reviewer/campaign/{type}/{id}/apply)
  // ====================================================================
  var apiApplyMatch = req.method === "POST" && /^\/api\/v1\/reviewer\/campaign\/(delivery|visit|purchase|reporter|mission)\/([^/]+)\/apply$/.exec(req.path);
  if (apiApplyMatch) {
    var apiApplyIdRaw = apiApplyMatch[2];
    var apiApplyId = /^\d+$/.test(apiApplyIdRaw) ? Number(apiApplyIdRaw) : 9999;
    return res.status(200).json({
      result: "APPLIED",
      generatedAt: new Date().toISOString(),
      applicationId: Math.floor(Math.random() * 9000) + 1000,
      campaignId: apiApplyId,
      status: "APPLIED",
      appliedAt: new Date().toISOString(),
    });
  }

  // DELETE /reviewer/my-page/my-campaign/:id → 신청 취소 (구 경로 유지)
  if (req.method === "DELETE" && req.path.match(/^\/reviewer\/my-page\/my-campaign\/\d+$/)) {
    return res.json({ result: "OK", message: "신청이 취소되었습니다." });
  }

  // POST /reviewer/my-page/my-campaign/:id/content → 콘텐츠 등록 (구 경로 유지)
  if (req.method === "POST" && req.path.match(/^\/reviewer\/my-page\/my-campaign\/\d+\/content$/)) {
    return res.json({ result: "OK", campaignContentId: 600, contentStatus: "SUBMITTED" });
  }

  // PUT /reviewer/my-page/my-campaign/:id/content → 콘텐츠 수정 (구 경로 유지)
  if (req.method === "PUT" && req.path.match(/^\/reviewer\/my-page\/my-campaign\/\d+\/content$/)) {
    return res.json({ result: "OK", campaignContentId: 600, contentStatus: "SUBMITTED" });
  }

  // POST /reviewer/my-page/my-campaign/:id/extension → 기한 연장 (구 경로 유지)
  if (req.method === "POST" && req.path.match(/^\/reviewer\/my-page\/my-campaign\/\d+\/extension$/)) {
    return res.json({ result: "OK", extensionCount: 1, newDeadline: new Date(Date.now() + 3 * 86400000).toISOString() });
  }

  // GET /user/campaign_management/content/rejection-reason/:id → 반려 사유 (구 경로 유지)
  if (req.method === "GET" && req.path.match(/^\/user\/campaign_management\/content\/rejection-reason\/\d+$/)) {
    return res.json({ result: "OK", rejectionCode: "R003", rejectionReason: "콘텐츠 내 홍보 키워드 누락", rejectedAt: new Date().toISOString(), resubmitDeadline: new Date(Date.now() + 5 * 86400000).toISOString() });
  }

  // ── SA-01: 대시보드 통합 조회 ──
  if (req.method === "GET" && req.path === "/api/admin-sa/dashboard") {
    const now = new Date();
    return res.json({
      result: "OK",
      generatedAt: now.toISOString(),
      dashboardData: {
        settlementSummary: {
          withdrawalRequestAmount: 1250000,
          withdrawalCompleteAmount: 3800000,
          totalDepositBalance: 15600000,
          settlementChart: [
            { month: "2025-10", amount: 2400000 },
            { month: "2025-11", amount: 3100000 },
            { month: "2025-12", amount: 2800000 },
            { month: "2026-01", amount: 3500000 },
            { month: "2026-02", amount: 3200000 },
            { month: "2026-03", amount: 3800000 },
          ],
        },
        paymentSummary: {
          totalPaymentAmount: 8500000,
          completedPaymentAmount: 6200000,
          pendingPaymentAmount: 2300000,
          paymentChart: [
            { month: "2025-10", amount: 1200000 },
            { month: "2025-11", amount: 1500000 },
            { month: "2025-12", amount: 1800000 },
            { month: "2026-01", amount: 1400000 },
            { month: "2026-02", amount: 1600000 },
            { month: "2026-03", amount: 1000000 },
          ],
        },
        memberActivation: {
          totalMembers: 1250,
          activeMembers: 890,
          inactiveMembers: 360,
          activePercentage: 71,
          totalMembersChange: { percentage: 5, type: "positive" },
        },
        memberType: {
          totalPartners: 320,
          activePartners: 245,
          totalReviewers: 930,
          activeReviewers: 645,
          partnerPercentage: 25.6,
          reviewerPercentage: 74.4,
          activePartnerPercentage: 77,
          activeReviewerPercentage: 69,
          totalPartnersChange: { percentage: 3, type: "positive" },
          totalReviewersChange: { percentage: 7, type: "positive" },
        },
        channelMember: {
          blog: { count: 420, percentage: 45 },
          instagram: { count: 280, percentage: 30 },
          clip: { count: 140, percentage: 15 },
          youtube: { count: 90, percentage: 10 },
        },
      },
    });
  }

  // 그 외 → json-server 기본 처리
  next();
  };
};
