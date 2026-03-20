/**
 * json-server 커스텀 미들웨어
 * 파트너 로그인/세션 등 단순 REST로 처리 불가능한 엔드포인트 처리
 */
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

  // 그 외 → json-server 기본 처리
  next();
};
