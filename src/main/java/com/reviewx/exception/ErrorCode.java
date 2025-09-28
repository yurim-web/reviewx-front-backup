package com.reviewx.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 공통 에러
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C001", "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C003", "지원하지 않는 HTTP 메서드입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "C004", "접근 권한이 없습니다."),
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "C005", "해당 데이터를 찾을 수 없습니다."),

    // 인증/인가 에러
    USER_NOT_AUTHENTICATED(HttpStatus.UNAUTHORIZED, "A001", "인증이 필요합니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "A002", "사용자를 찾을 수 없습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "A003", "이미 존재하는 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "A004", "이미 존재하는 닉네임입니다."),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "A005", "비밀번호가 일치하지 않습니다."),
    INVALID_CURRENT_PASSWORD(HttpStatus.BAD_REQUEST, "A006", "현재 비밀번호가 올바르지 않습니다."),
    SOCIAL_USER_PASSWORD_CHANGE_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "A007", "소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다."),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "A008", "역할 정보를 찾을 수 없습니다."),

    // 캠페인 에러
    CAMPAIGN_NOT_FOUND(HttpStatus.NOT_FOUND, "M001", "캠페인을 찾을 수 없습니다."),
    CAMPAIGN_CLOSED(HttpStatus.BAD_REQUEST, "M002", "마감된 캠페인입니다."),
    CAMPAIGN_FULL(HttpStatus.BAD_REQUEST, "M003", "모집 인원이 초과되었습니다."),
    ALREADY_PARTICIPATED(HttpStatus.CONFLICT, "M004", "이미 참여한 캠페인입니다."),

    // 리뷰 에러
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "리뷰를 찾을 수 없습니다."),
    REVIEW_ALREADY_SUBMITTED(HttpStatus.CONFLICT, "R002", "이미 제출된 리뷰입니다."),
    REVIEW_NOT_EDITABLE(HttpStatus.BAD_REQUEST, "R003", "수정할 수 없는 리뷰입니다."),

    // 포인트/정산 에러
    INSUFFICIENT_POINTS(HttpStatus.BAD_REQUEST, "P001", "포인트가 부족합니다."),
    WITHDRAWAL_NOT_FOUND(HttpStatus.NOT_FOUND, "P002", "출금 요청을 찾을 수 없습니다."),
    WITHDRAWAL_ALREADY_PROCESSED(HttpStatus.CONFLICT, "P003", "이미 처리된 출금 요청입니다."),
    INSUFFICIENT_BALANCE(HttpStatus.BAD_REQUEST, "P004", "잔액이 부족합니다."),
    INVALID_WITHDRAWAL_AMOUNT(HttpStatus.BAD_REQUEST, "P005", "유효하지 않은 출금 금액입니다."),
    INVALID_WITHDRAWAL_STATUS(HttpStatus.BAD_REQUEST, "P006", "유효하지 않은 출금 상태입니다."),
    PENDING_WITHDRAWAL_EXISTS(HttpStatus.CONFLICT, "P007", "처리 중인 출금 신청이 있습니다."),
    DAILY_WITHDRAWAL_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "P008", "일일 출금 한도를 초과했습니다."),
    INSUFFICIENT_PERMISSIONS(HttpStatus.FORBIDDEN, "P009", "권한이 부족합니다."),

    // 파일 업로드 에러
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "F001", "파일 업로드에 실패했습니다."),
    INVALID_FILE_FORMAT(HttpStatus.BAD_REQUEST, "F002", "지원하지 않는 파일 형식입니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "F003", "파일 크기가 제한을 초과했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}