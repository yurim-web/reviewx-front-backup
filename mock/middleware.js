/**
 * json-server 커스텀 미들웨어
 * 파트너 로그인/세션 등 단순 REST로 처리 불가능한 엔드포인트 처리
 */

// 메모리 상태: 알림 전체 삭제 여부
let notificationsDeleted = false;

module.exports = (req, res, next) => {
  // ============ POST /partner/login ============
  if (req.method === "POST" && req.path === "/partner/login") {
    const { email, password } = req.body;

    // 테스트 계정 매핑
    const accounts = {
      "test@test.com": {
        password: "cjdaud1!",
        status: "ACTIVE",
        userId: 1001,
        name: "홍길동",
        phoneNum: "010-1234-5678",
        partnerId: 501,
        businessName: "마크엑스컴퍼니",
        ceoName: "홍길동",
        businessNumber: "123-45-67890",
        grade: "NORMAL",
      },
      "test@cmcm.co.kr": {
        password: "cjdaud1!",
        status: "ACTIVE",
        userId: 1002,
        name: "김파트너",
        phoneNum: "010-9876-5432",
        partnerId: 502,
        businessName: "주식회사 마크엑스",
        ceoName: "유가수",
        businessNumber: "246-87-04020",
        grade: "NORMAL",
      },
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

    const account = accounts[email];

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
    // mock에서는 항상 인증된 상태 반환 (테스트용)
    // 비인증 테스트: 이 블록을 UNAUTHENTICATED로 변경
    return res.status(200).json({
      result: "AUTHENTICATED",
      generatedAt: new Date().toISOString(),
      user: {
        userId: 1001,
        role: "PARTNER",
        email: "test@test.com",
        name: "홍길동",
        phoneNum: "010-1234-5678",
        address: "인천광역시 남동구 장제로 14",
        addressDetail: "2층 201호",
        postNumber: 15011,
        status: "ACTIVE",
      },
      partner: {
        partnerId: 501,
        businessName: "마크엑스컴퍼니",
        ceoName: "홍길동",
        businessNumber: "123-45-67890",
        csNumber: "010-1212-1541",
        grade: "NORMAL",
      },
    });
  }

  // ============ POST /partner/logout ============
  if (req.method === "POST" && req.path === "/partner/logout") {
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
    });
  }

  // ============ POST /partner/auth/find-id ============
  if (req.method === "POST" && req.path === "/partner/auth/find-id") {
    const phone = (req.body.phone || "").replace(/-/g, "");
    // mock: 01011111111 → 찾기 성공, 그 외 → 404
    if (phone === "01011111111") {
      return res.status(200).json({
        result: "OK",
        email: "test@cmcm.co.kr",
        signupDate: "2025-01-15",
      });
    }
    if (phone === "01099999999") {
      return res.status(403).json({
        result: "ERROR",
        error: { code: "BLOCKED_ACCOUNT", message: "정지되었거나 탈퇴된 계정입니다." },
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
    // mock: test@cmcm.co.kr + 01011111111 → 성공
    if (email === "test@cmcm.co.kr" && phone === "01011111111") {
      return res.status(200).json({ result: "OK" });
    }
    if (phone === "01099999999") {
      return res.status(403).json({
        result: "ERROR",
        error: { code: "BLOCKED_ACCOUNT", message: "정지되었거나 탈퇴된 계정입니다." },
      });
    }
    return res.status(404).json({
      result: "ERROR",
      error: { code: "NOT_FOUND", message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다." },
    });
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

    // 이메일 중복 체크 (mock: 기존 로그인 계정과 비교)
    const accounts = {
      "test@test.com": true,
      "test@cmcm.co.kr": true,
      "blocked@test.com": true,
      "banned@test.com": true,
    };
    if (accounts[email]) {
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
    const allItems = db.partner_notifications || [];
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

    const sliced = allItems.slice(startIdx, startIdx + size);
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
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: {
        campaignId: Date.now(),
        partnerId: 501,
        type: body.type || "DELIVERY",
        status: "DRAFT",
        title: body.title || "",
        category: body.category || null,
        savedAt: new Date().toISOString(),
      },
      message: "임시저장되었습니다.",
    });
  }

  // ============ GET /partner/campaign/draft/:campaignId ============
  // 12번 API: 임시저장 캠페인 불러오기
  if (req.method === "GET" && (req.path.match(/^\/partner\/campaign\/draft\/\d+$/) || (req.originalUrl && req.originalUrl.match(/^\/partner\/campaign\/draft\/\d+$/)))) {
    const campaignId = Number(req.path.split("/").pop());
    return res.status(200).json({
      result: "OK",
      generatedAt: new Date().toISOString(),
      campaign: {
        campaignId,
        partnerId: 501,
        type: "DELIVERY",
        status: "DRAFT",
        title: "",
        savedAt: new Date().toISOString(),
      },
    });
  }

  // 그 외 → json-server 기본 처리
  next();
};
