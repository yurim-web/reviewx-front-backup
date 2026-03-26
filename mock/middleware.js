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
      { id: "admin_ga_001", email: "manager_ga@test.com", phone: "01012345678", name: "김관리", userType: "admin_ga", role: "manager_ga", password: "cjdaud1!", isBanned: false, isBlocked: false, signupDate: "2025-01-15" },
      { id: "admin_sa_001", email: "manager_sa@test.com", phone: "01098765432", name: "박최고", userType: "admin_sa", role: "manager_sa", password: "cjdaud1!", isBanned: false, isBlocked: false, signupDate: "2025-01-10" },
      { id: "admin_ga_002", email: "blocked_ga@test.com", phone: "01011112222", name: "차단관리자", userType: "admin_ga", role: "manager_ga", password: "cjdaud1!", isBanned: false, isBlocked: true, signupDate: "2025-02-01" },
      { id: "admin_ga_003", email: "banned_ga@test.com", phone: "01033334444", name: "정지관리자", userType: "admin_ga", role: "manager_ga", password: "cjdaud1!", isBanned: true, isBlocked: false, signupDate: "2025-03-01" },
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
  // SA-02: SA 캠페인 상태별 통계 카드 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/campaign/progress/stats") {
    var saStats = db ? (db.get("sa_campaign_progress_stats").value() || null) : null;
    if (!saStats) {
      try { saStats = require("./db.json").sa_campaign_progress_stats || null; } catch (_e) {}
    }
    if (saStats) {
      return res.status(200).json(saStats);
    }
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      stats: { total: 0, openScheduled: 0, applying: 0, inProgress: 0, ended: 0, cancelled: 0, urgent: 0 },
    });
  }

  // ============ GET /api/admin-sa/campaign/progress ============
  // SA-02: SA 캠페인 목록 조회
  if (req.method === "GET" && req.path === "/api/admin-sa/campaign/progress") {
    var saList = db ? (db.get("sa_campaign_progress").value() || []) : [];
    if (!saList || saList.length === 0) {
      try { saList = require("./db.json").sa_campaign_progress || []; } catch (_e) {}
    }
    var { status: saStatus, type: saType, channel: saChannel, keyword: saKeyword } = req.query;
    var saFiltered = saList;
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
    if (ptItem) {
      return res.status(200).json(ptItem);
    }
    return res.status(200).json({
      id: ptId, number: String(ptId).padStart(6, "0"),
      business_name: "테스트파트너" + ptId, business_number: "000-00-00000",
      representative_name: "대표" + ptId, division: "개인",
      email: "partner" + ptId + "@test.com", phone: "010-0000-0000",
      address: "서울시 강남구", contact_name: "담당자" + ptId, contact_phone: "010-0000-0000",
      campaign_in_progress: 0, campaign_completed: 0, current_points: 0, used_points: 0,
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
    if (rvItem) {
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
      campaign_participated: 3, campaign_completed: 2,
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

  // ============ GET /api/admin/partners/:id/campaigns ============
  // GA-09: 파트너 캠페인 진행 내역
  if (req.method === "GET" && req.path.match(/^\/api\/admin\/partners\/\d+\/campaigns$/)) {
    return res.status(200).json({
      result: "OK", generatedAt: new Date().toISOString(),
      data: {
        totalCount: 3,
        campaigns: [
          { campaignId: 201, campaignTitle: "뷰티 제품 인스타 리뷰", status: "COMPLETED", type: "DELIVERY", channel: "Instagram", rewardPoint: 50000 },
          { campaignId: 202, campaignTitle: "건강식품 블로그 체험단", status: "IN_PROGRESS", type: "DELIVERY", channel: "Blog", rewardPoint: 30000 },
          { campaignId: 203, campaignTitle: "카페 방문 리뷰", status: "COMPLETED", type: "VISIT", channel: "Blog", rewardPoint: 20000 },
        ],
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
        password: "cjdaud1!",
        id: "admin_ga_001",
        name: "김관리",
        role: "manager_ga",
        admin_level: "GA",
        status: "ACTIVE",
      },
      "manager_sa@test.com": {
        password: "cjdaud1!",
        id: "admin_sa_001",
        name: "박최고",
        role: "manager_sa",
        admin_level: "SA",
        status: "ACTIVE",
      },
      "blocked_ga@test.com": {
        password: "cjdaud1!",
        id: "admin_ga_002",
        name: "차단관리자",
        role: "manager_ga",
        admin_level: "GA",
        status: "BLOCKED",
      },
      "banned_ga@test.com": {
        password: "cjdaud1!",
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
        password: "cjdaud1!",
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
        password: "cjdaud1!",
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
      "contact@cmcm.co.kr": { password: "cjdaud1!", status: "ACTIVE", userId: 501, name: "김민회", phoneNum: "02-1234-5678", partnerId: 1, businessName: "주식회사 청명종합광고기획", ceoName: "김민회", businessNumber: "122-86-45790", grade: "NORMAL" },
      "test@test.com": { password: "cjdaud1!", status: "ACTIVE", userId: 502, name: "이사장", phoneNum: "010-1234-5678", partnerId: 2, businessName: "마크엑스컴퍼니", ceoName: "이사장", businessNumber: "123-45-67890", grade: "EXCELLENT" },
      "aaaa@test.com": { password: "akzmdprtm1!", status: "ACTIVE", userId: 503, name: "김테스트", phoneNum: "010-5555-5555", partnerId: 3, businessName: "테스트컴퍼니", ceoName: "김테스트", businessNumber: "234-56-78901", grade: "NORMAL" },
      "cafe@bene.com": { password: "cjdaud1!", status: "ACTIVE", userId: 504, name: "박카페", phoneNum: "02-9876-5432", partnerId: 4, businessName: "카페베네", ceoName: "박카페", businessNumber: "345-67-89012", grade: "CAUTION" },
      "beauty@lab.com": { password: "cjdaud1!", status: "ACTIVE", userId: 505, name: "정뷰티", phoneNum: "010-3333-4444", partnerId: 5, businessName: "뷰티랩", ceoName: "정뷰티", businessNumber: "456-78-90123", grade: "NORMAL" },
      "tech@korea.com": { password: "cjdaud1!", status: "PAUSED", userId: 506, name: "최테크", phoneNum: "02-5555-6666", partnerId: 6, businessName: "테크코리아", ceoName: "최테크", businessNumber: "567-89-01234", grade: "WARNING" },
      "social@plus.com": { password: "cjdaud1!", status: "BLOCKED", userId: 507, name: "한소셜", phoneNum: "02-7777-8888", partnerId: 7, businessName: "소셜플러스", ceoName: "한소셜", businessNumber: "678-90-12345", grade: "RESTRICTED" },
      "food@yummy.com": { password: "cjdaud1!", status: "WITHDRAW", userId: 508, name: "오맛집", phoneNum: "010-8888-9999", partnerId: 8, businessName: "맛있는식당", ceoName: "오맛집", businessNumber: "789-01-23456", grade: "NORMAL" },
      "coffee@beans.com": { password: "cjdaud1!", status: "ACTIVE", userId: 509, name: "강커피", phoneNum: "010-2222-3333", partnerId: 9, businessName: "커피빈즈", ceoName: "강커피", businessNumber: "890-12-34567", grade: "EXCELLENT" },
      "premium@marketing.com": { password: "cjdaud1!", status: "ACTIVE", userId: 510, name: "류마케팅", phoneNum: "02-1111-2222", partnerId: 10, businessName: "프리미엄마케팅", ceoName: "류마케팅", businessNumber: "901-23-45678", grade: "NORMAL" },
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
          password: profile.password || "cjdaud1!",
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
    const db = require("./db.json");
    const searchData = db.search || { result: "OK", campaigns: [] };
    const keyword = (req.query.keyword || "").toLowerCase();

    if (keyword) {
      const filtered = (searchData.campaigns || []).filter(
        (c) => c.title.toLowerCase().includes(keyword)
      );
      return res.status(200).json({
        ...searchData,
        keyword: req.query.keyword,
        totalCount: filtered.length,
        campaigns: filtered,
      });
    }

    return res.status(200).json(searchData);
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
        { regionId: 100, name: "서울특별시", level: 1, parentId: null },
        { regionId: 101, name: "강남구", level: 2, parentId: 100 },
        { regionId: 102, name: "강동구", level: 2, parentId: 100 },
        { regionId: 103, name: "강북구", level: 2, parentId: 100 },
        { regionId: 104, name: "강서구", level: 2, parentId: 100 },
        { regionId: 105, name: "관악구", level: 2, parentId: 100 },
        { regionId: 106, name: "성동구", level: 2, parentId: 100 },
        { regionId: 107, name: "성북구", level: 2, parentId: 100 },
        { regionId: 108, name: "송파구", level: 2, parentId: 100 },
        { regionId: 109, name: "마포구", level: 2, parentId: 100 },
        { regionId: 200, name: "인천광역시", level: 1, parentId: null },
        { regionId: 201, name: "남동구", level: 2, parentId: 200 },
        { regionId: 202, name: "부평구", level: 2, parentId: 200 },
        { regionId: 300, name: "경기도", level: 1, parentId: null },
        { regionId: 301, name: "수원시", level: 2, parentId: 300 },
        { regionId: 302, name: "성남시", level: 2, parentId: 300 },
        { regionId: 303, name: "고양시", level: 2, parentId: 300 },
        { regionId: 400, name: "부산광역시", level: 1, parentId: null },
        { regionId: 401, name: "해운대구", level: 2, parentId: 400 },
        { regionId: 500, name: "대구광역시", level: 1, parentId: null },
        { regionId: 600, name: "대전광역시", level: 1, parentId: null },
        { regionId: 700, name: "광주광역시", level: 1, parentId: null },
        { regionId: 800, name: "울산광역시", level: 1, parentId: null },
        { regionId: 900, name: "세종특별자치시", level: 1, parentId: null },
        { regionId: 901, name: "세종시", level: 2, parentId: 900 },
        { regionId: 1000, name: "강원특별자치도", level: 1, parentId: null },
        { regionId: 1100, name: "충청북도", level: 1, parentId: null },
        { regionId: 1200, name: "충청남도", level: 1, parentId: null },
        { regionId: 1300, name: "전라북도", level: 1, parentId: null },
        { regionId: 1400, name: "전라남도", level: 1, parentId: null },
        { regionId: 1500, name: "경상북도", level: 1, parentId: null },
        { regionId: 1600, name: "경상남도", level: 1, parentId: null },
        { regionId: 1700, name: "제주특별자치도", level: 1, parentId: null },
        { regionId: 1701, name: "제주시", level: 2, parentId: 1700 },
        { regionId: 1702, name: "서귀포시", level: 2, parentId: 1700 },
      ],
    });
  }

  // ============ POST /partner/campaign/create ============
  // 10번 API: 캠페인 등록하기
  if (req.method === "POST" && (req.path === "/partner/campaign/create" || req.originalUrl === "/partner/campaign/create")) {
    const body = req.body || {};
    const campaignId = Date.now();

    // json-server DB(campaigns 컬렉션)에도 저장 → 캠페인 관리/상세 페이지에서 조회 가능
    // body 전체를 저장하되 필수 필드만 기본값 보장
    const now = new Date().toISOString();
    const dbRecord = {
      ...body,
      id: campaignId,
      campaignId,
      partner_id: body.partner_id || currentSession.partnerId || 501,
      status: body.status || "REGISTERING",
      appliedCount: 0,
      created_at: now,
      updated_at: now,
      metrics: body.metrics || { appliedCount: 0, selectedCount: 0, applicationRate: 0 },
    };
    pushCampaign(dbRecord);

    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: {
        campaignId,
        partnerId: 501,
        type: body.type || "DELIVERY",
        status: "REGISTERING",
        title: body.title || "새 캠페인",
        category: body.category || { categoryId: 1, categoryName: "식품" },
        requiredPlatform: body.requiredPlatform || { channelId: 1, channelName: "NAVER_BLOG" },
        recruit: body.recruit || {
          recruitLimit: 10,
          recruitStartAt: new Date().toISOString(),
          recruitEndAt: new Date().toISOString(),
          selectedAt: new Date().toISOString(),
          contentStartAt: new Date().toISOString(),
          contentEndAt: new Date().toISOString(),
        },
        reward: body.reward || { extraRewardPoint: 0, paymentRewardPoint: 0 },
        regAt: new Date().toISOString(),
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
    // 인메모리에 draft 데이터 저장 (API 12 불러오기용)
    draftStore[campaignId] = {
      campaignId,
      partnerId: 501,
      type: body.type || "DELIVERY",
      status: "DRAFT",
      title: body.title || "",
      description: body.description || undefined,
      category: body.categoryId ? { categoryId: Number(body.categoryId), categoryName: "" } : null,
      requiredPlatform: body.requiredPlatformId ? { channelId: Number(body.requiredPlatformId), channelName: "" } : undefined,
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
        region: campaign.region ? { regionId: 110, name: campaign.region, level: 2, parentId: 100 } : null,
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
        visitDetailAddress: campaign.visitDetailAddress || "",
        addressGuide: campaign.addressGuide || campaign.addressDetail || "",
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
        { categoryId: 3, categoryName: "패션" },
        { categoryId: 4, categoryName: "생활" },
        { categoryId: 5, categoryName: "카페" },
        { categoryId: 6, categoryName: "유아동" },
      ],
      channels: [
        { channelId: 1, channelName: "NAVER_BLOG" },
        { channelId: 2, channelName: "NAVER_CLIP" },
        { channelId: 3, channelName: "INSTAGRAM" },
        { channelId: 4, channelName: "YOUTUBE" },
      ],
      regions: [
        { regionId: 100, name: "전국", level: 1, parentId: null },
        { regionId: 110, name: "서울", level: 1, parentId: null },
        { regionId: 111, name: "서울/강남", level: 2, parentId: 110 },
        { regionId: 112, name: "서울/성수", level: 2, parentId: 110 },
        { regionId: 120, name: "경기", level: 1, parentId: null },
        { regionId: 121, name: "경기/수원", level: 2, parentId: 120 },
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
  if (req.method === "GET" && req.path.match(/^\/partner\/campaign_management\/[A-Za-z]+$/)) {
    const pathStatus = req.path.split("/").pop();
    const campaigns = req.routerDb
      ? req.routerDb.get("campaigns").value()
      : require("./db.json").campaigns || [];
    const partnerId = currentSession.partnerId;
    const allCampaigns = campaigns
      .filter((c) => c.partner_id === partnerId || c.partner_id === currentSession.userId || c.partner_id === 1)
      .map(transformCampaign);

    // status별 필터링
    let filtered = filterByApiStatus(allCampaigns, pathStatus);

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
    const storedPassword = profile?.password || "cjdaud1!";

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

    // 캠페인 정보 조회 (campaigns 컬렉션에서)
    const allCampaigns = db.get("campaigns").value() || [];
    const campaign = allCampaigns.find((c) => c.id === campaignId || c.id === String(campaignId));

    // partner_campaigns에서도 찾기 (id가 문자열일 수 있음)
    const allPartnerCampaigns = db.get("partner_campaigns").value() || [];
    const pCampaign = allPartnerCampaigns.find((c) => c.id == campaignId || String(c.id) === String(campaignId));

    // 캠페인 타입/플랫폼 결정
    const typeMap = { DELIVERY: "delivery", VISIT: "visit", PURCHASE_REVIEW: "purchase", REPORTER: "reporter", MISSION: "mission" };
    const statusNorm = { SCHEDULED: "REGISTERING", approved: "REGISTERING", IN_PROGRESS: "SELECTING", SELECTED: "PURCHASING", REVIEW: "PURCHASING", COMPLETED: "CLOSED", CANCELLED: "EMERGENCY" };
    // requiredPlatform.channelName → API platform 코드 매핑
    const channelNameToPlatform = {
      NAVER_BLOG: "naver_blog", NAVER_CLIP: "naver_clip",
      INSTAGRAM: "instagram", YOUTUBE: "youtube",
      REELS: "reels", SHORTS: "shorts",
    };

    // 캠페인 유형 코드 (백엔드: VISIT, PURCHASE 등 대문자)
    const typeMapUpper = { DELIVERY: "DELIVERY", VISIT: "VISIT", PURCHASE_REVIEW: "PURCHASE", REPORTER: "REPORTER", MISSION: "MISSION" };

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
    } else if (pCampaign && pCampaign.campaignInfo) {
      const ci = pCampaign.campaignInfo;
      const typeReverseMap = { "배송형": "DELIVERY", "방문형": "VISIT", "구매평": "PURCHASE", "기자단": "REPORTER", "미션형": "MISSION" };
      const statusReverseMap = { "대기 중": "REGISTERING", "모집 중": "RECRUITING", "선정 중": "SELECTING", "진행 중": "PURCHASING", "종료": "CLOSED", "취소": "EMERGENCY" };
      // brandName/channel → 플랫폼 코드 매핑
      const brandToPlatform = {
        "네이버 블로그": "NAVER_BLOG", "네이버블로그": "NAVER_BLOG",
        "네이버 클립": "NAVER_CLIP", "네이버클립": "NAVER_CLIP",
        "인스타그램": "INSTAGRAM", "유튜브": "YOUTUBE",
        "릴스": "REELS", "숏츠": "SHORTS",
      };
      const channelSource = ci.brandName || ci.channel || "네이버 블로그";
      campaignInfo = {
        campaignId: campaignId,
        title: ci.title || "",
        type: typeReverseMap[ci.campaignType] || "DELIVERY",
        status: statusReverseMap[ci.status] || "RECRUITING",
        recruitLimit: ci.totalCount || 10,
        totalApplied: ci.recruitedCount || 0,
        totalSelected: 0,
        totalCanceled: 0,
        recruitStartAt: (ci.recruitmentPeriod || "").split(" ~ ")[0] || "",
        recruitEndAt: (ci.recruitmentPeriod || "").split(" ~ ")[1] || "",
        thumbnailUrl: ci.image || "",
        platform: brandToPlatform[channelSource] || "NAVER_BLOG",
        category: ci.category || "",
        campaignStartAt: (ci.registrationPeriod || "").split(" ~ ")[0] || "",
        campaignEndAt: (ci.registrationPeriod || "").split(" ~ ")[1] || "",
        announcementDate: ci.announcementDate || "",
        points: ci.additionalPoint || ci.point || 0,
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

    // campaign_applications에 없으면 partner_campaigns의 applicantData에서 생성
    if (applications.length === 0 && pCampaign && pCampaign.applicantData) {
      const applicants = pCampaign.applicantData.applicants || [];
      const selectedApplicants = pCampaign.applicantData.selectedApplicants || [];
      // applicants → APPLIED, selectedApplicants → SELECTED로 변환
      let fakeId = campaignId * 1000;
      applications = applicants.map((a) => ({
        id: fakeId++,
        campaign_id: campaignId,
        reviewer_id: fakeId,
        status: "APPLIED",
        memo: a.memo || "",
        apply_date: a.registrationDate || new Date().toISOString(),
        _nickname: a.nickname,
        _profileImage: a.profileImage,
        _userType: a.userType,
        _memberType: a.memberType,
        _channel: a.channel,
        _dailyVisits: a.dailyVisits,
        _totalVisits: a.totalVisits,
        _neighbors: a.neighbors,
        _followers: a.followers,
        _subscribers: a.subscribers,
      }));
      const selectedApps = selectedApplicants.map((a) => ({
        id: fakeId++,
        campaign_id: campaignId,
        reviewer_id: fakeId,
        status: "SELECTED",
        memo: a.memo || "",
        apply_date: a.registrationDate || new Date().toISOString(),
        _nickname: a.nickname,
        _profileImage: a.profileImage,
        _userType: a.userType,
        _memberType: a.memberType,
        _channel: a.channel,
        _dailyVisits: a.dailyVisits,
        _totalVisits: a.totalVisits,
        _neighbors: a.neighbors,
        _followers: a.followers,
        _subscribers: a.subscribers,
      }));
      applications = [...applications, ...selectedApps];
    }

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
      // partner_campaigns에서 온 데이터는 _prefix 필드를 가짐 → 우선 사용
      const hasPcData = !!app._nickname;
      const metrics = hasPcData
        ? { dailyVisits: app._dailyVisits || 0, totalVisits: app._totalVisits || 0, neighbors: app._neighbors || 0, followerCount: app._followers || app._subscribers || 0, subscribers: app._subscribers || 0 }
        : (channelMetricsFn[channelName] || channelMetricsFn.NAVER_BLOG)(app.reviewer_id || 1);
      const channelUrl = reviewer && reviewer.channel_details && reviewer.channel_details[0] ? reviewer.channel_details[0].url : "";

      // partner_campaigns에서 온 데이터는 _prefix 필드 우선 사용
      const rId = app.reviewer_id || 1;
      const userTypeLabelMap = { "리뷰어": "REVIEWER", "인플루언서": "INFLUENCER" };
      const memberTypeLabelMap = { "모범 회원": "MODEL", "주의 회원": "CAUTION", "경고 회원": "WARNING", "이용 제한": "BLOCKED" };

      return {
        applicationId: app.id,
        reviewerId: rId,
        reviewerName: hasPcData ? app._nickname : (reviewer ? reviewer.nickname : `리뷰어${rId}`),
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
        profileImage: hasPcData ? (app._profileImage || "/images/mypage/profile.svg") : ((reviewer && reviewer.profile_image) || "/images/mypage/profile.svg"),
        userType: hasPcData ? (userTypeLabelMap[app._userType] || "REVIEWER") : (rId % 5 === 0 ? "INFLUENCER" : "REVIEWER"),
        memberType: hasPcData ? (memberTypeLabelMap[app._memberType] || "MODEL") : memberTypes[rId % memberTypes.length],
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

    // enrichedApps 기반으로 집계 (partner_campaigns 데이터 포함)
    const appliedCount = enrichedApps.filter((a) => a.status === "APPLIED").length;
    const selectedCount = enrichedApps.filter((a) => a.status === "SELECTED").length;
    const canceledCount = enrichedApps.filter((a) => a.status === "CANCELED").length;

    // campaignInfo 집계값 반영 (단, partner_campaigns의 recruitedCount가 더 크면 그 값 사용)
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

  // 그 외 → json-server 기본 처리
  next();
  };
};
