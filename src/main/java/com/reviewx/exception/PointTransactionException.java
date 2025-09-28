package com.reviewx.exception;

/**
 * 포인트 거래 관련 예외 클래스
 */
public class PointTransactionException extends RuntimeException {

    private final ErrorCode errorCode;
    
    public enum ErrorCode {
        // 사용자 관련 오류
        USER_NOT_FOUND("사용자를 찾을 수 없습니다"),
        INVALID_USER_STATUS("사용자 상태가 올바르지 않습니다"),
        INSUFFICIENT_PERMISSIONS("권한이 부족합니다"),
        
        // 잔액 관련 오류
        INSUFFICIENT_BALANCE("포인트 잔액이 부족합니다"),
        INVALID_AMOUNT("유효하지 않은 금액입니다"),
        BALANCE_MISMATCH("포인트 잔액이 일치하지 않습니다"),
        
        // 거래 상태 관련 오류
        TRANSACTION_NOT_FOUND("거래 내역을 찾을 수 없습니다"),
        INVALID_TRANSACTION_STATUS("유효하지 않은 거래 상태입니다"),
        TRANSACTION_ALREADY_PROCESSED("이미 처리된 거래입니다"),
        TRANSACTION_TIMEOUT("거래 처리 시간이 초과되었습니다"),
        
        // 결제 관련 오류
        PAYMENT_VERIFICATION_FAILED("결제 정보 검증에 실패했습니다"),
        DUPLICATE_PAYMENT("중복 결제 요청입니다"),
        INVALID_PAYMENT_METHOD("유효하지 않은 결제 방법입니다"),
        
        // 캠페인 관련 오류
        CAMPAIGN_NOT_FOUND("캠페인을 찾을 수 없습니다"),
        INVALID_CAMPAIGN_STATUS("캠페인 상태가 올바르지 않습니다"),
        CAMPAIGN_BUDGET_EXCEEDED("캠페인 예산을 초과했습니다"),
        
        // 리뷰 관련 오류
        REVIEW_NOT_FOUND("리뷰를 찾을 수 없습니다"),
        REVIEW_ALREADY_REWARDED("이미 보상이 지급된 리뷰입니다"),
        INVALID_REVIEW_STATUS("리뷰 상태가 올바르지 않습니다"),
        
        // 출금 관련 오류
        WITHDRAWAL_LIMIT_EXCEEDED("출금 한도를 초과했습니다"),
        INVALID_WITHDRAWAL_ACCOUNT("출금 계좌 정보가 올바르지 않습니다"),
        WITHDRAWAL_NOT_ALLOWED("출금이 허용되지 않습니다"),
        
        // 시스템 오류
        DATABASE_ERROR("데이터베이스 오류가 발생했습니다"),
        CONCURRENCY_ERROR("동시 처리 오류가 발생했습니다"),
        EXTERNAL_API_ERROR("외부 API 호출에 실패했습니다"),
        SYSTEM_ERROR("시스템 오류가 발생했습니다");
        
        private final String message;
        
        ErrorCode(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
    }
    
    public PointTransactionException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
    
    public PointTransactionException(ErrorCode errorCode, String details) {
        super(errorCode.getMessage() + ": " + details);
        this.errorCode = errorCode;
    }
    
    public PointTransactionException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }
    
    public PointTransactionException(ErrorCode errorCode, String details, Throwable cause) {
        super(errorCode.getMessage() + ": " + details, cause);
        this.errorCode = errorCode;
    }
    
    public ErrorCode getErrorCode() {
        return errorCode;
    }
    
    // 편의 메서드들
    public static PointTransactionException userNotFound(Long userId) {
        return new PointTransactionException(ErrorCode.USER_NOT_FOUND, "ID: " + userId);
    }
    
    public static PointTransactionException insufficientBalance(Integer balance, Integer required) {
        return new PointTransactionException(ErrorCode.INSUFFICIENT_BALANCE, 
            String.format("보유: %,d P, 필요: %,d P", balance, required));
    }
    
    public static PointTransactionException invalidAmount(Integer amount) {
        return new PointTransactionException(ErrorCode.INVALID_AMOUNT, 
            "금액: " + (amount == null ? "null" : amount));
    }
    
    public static PointTransactionException transactionNotFound(Long transactionId) {
        return new PointTransactionException(ErrorCode.TRANSACTION_NOT_FOUND, "ID: " + transactionId);
    }
    
    public static PointTransactionException balanceMismatch(Integer expected, Integer actual) {
        return new PointTransactionException(ErrorCode.BALANCE_MISMATCH, 
            String.format("예상: %,d P, 실제: %,d P", expected, actual));
    }
    
    public static PointTransactionException campaignNotFound(Long campaignId) {
        return new PointTransactionException(ErrorCode.CAMPAIGN_NOT_FOUND, "ID: " + campaignId);
    }
    
    public static PointTransactionException reviewNotFound(Long reviewId) {
        return new PointTransactionException(ErrorCode.REVIEW_NOT_FOUND, "ID: " + reviewId);
    }
    
    public static PointTransactionException reviewAlreadyRewarded(Long reviewId) {
        return new PointTransactionException(ErrorCode.REVIEW_ALREADY_REWARDED, "리뷰 ID: " + reviewId);
    }
    
    public static PointTransactionException duplicatePayment(String paymentKey) {
        return new PointTransactionException(ErrorCode.DUPLICATE_PAYMENT, "결제키: " + paymentKey);
    }
}