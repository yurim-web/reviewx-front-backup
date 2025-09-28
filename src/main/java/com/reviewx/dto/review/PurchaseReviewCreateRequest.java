package com.reviewx.dto.review;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 구매평 리뷰 생성 요청 DTO
 */
@Data
@NoArgsConstructor
public class PurchaseReviewCreateRequest {

    @NotNull(message = "캠페인 ID는 필수입니다")
    private Long campaignId;

    @NotBlank(message = "리뷰 제목은 필수입니다")
    @Size(max = 200, message = "리뷰 제목은 200자 이하여야 합니다")
    private String title;

    @NotBlank(message = "리뷰 내용은 필수입니다")
    @Size(max = 5000, message = "리뷰 내용은 5000자 이하여야 합니다")
    private String content;

    @Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "별점은 5점 이하여야 합니다")
    private Integer rating;

    // 구매 인증 정보
    @NotBlank(message = "주문번호는 필수입니다")
    @Size(max = 100, message = "주문번호는 100자 이하여야 합니다")
    private String orderNumber;

    @NotNull(message = "구매 금액은 필수입니다")
    @Min(value = 0, message = "구매 금액은 0원 이상이어야 합니다")
    private Integer purchaseAmount;

    @NotBlank(message = "배송 주소는 필수입니다")
    @Size(max = 255, message = "배송 주소는 255자 이하여야 합니다")
    private String deliveryAddress;

    // 키워드 및 해시태그
    @Size(max = 1000, message = "사용된 키워드는 1000자 이하여야 합니다")
    private String keywordsUsed;

    @Size(max = 500, message = "해시태그는 500자 이하여야 합니다")
    private String hashtags;

    // 플랫폼 게시 정보
    @Size(max = 1000, message = "플랫폼 URL은 1000자 이하여야 합니다")
    private String platformUrl;

    @Size(max = 100, message = "플랫폼 리뷰 ID는 100자 이하여야 합니다")
    private String platformReviewId;

    private LocalDateTime postedAt;

    // 첨부 파일 ID 목록 (구매 영수증, 포토 리뷰)
    private List<Long> receiptFileIds; // 구매 영수증 파일 ID 목록

    private List<Long> photoFileIds; // 포토 리뷰 파일 ID 목록

    // 디바이스 정보 (자동 수집)
    private String deviceInfo;

    private String ipAddress;

    private String userAgent;

    /**
     * 요청 데이터 유효성 검증
     */
    public void validate() {
        // 필수 구매 인증 파일 검증
        if (receiptFileIds == null || receiptFileIds.isEmpty()) {
            throw new IllegalArgumentException("구매 영수증은 필수입니다");
        }

        // 키워드 포맷 검증
        if (keywordsUsed != null && !keywordsUsed.trim().isEmpty()) {
            String[] keywords = keywordsUsed.split(",");
            if (keywords.length > 20) {
                throw new IllegalArgumentException("키워드는 최대 20개까지 입력 가능합니다");
            }
        }

        // 해시태그 포맷 검증
        if (hashtags != null && !hashtags.trim().isEmpty()) {
            String[] tags = hashtags.split(",");
            if (tags.length > 10) {
                throw new IllegalArgumentException("해시태그는 최대 10개까지 입력 가능합니다");
            }
        }

        // 플랫폼 URL 검증
        if (platformUrl != null && !platformUrl.trim().isEmpty()) {
            if (!isValidUrl(platformUrl)) {
                throw new IllegalArgumentException("올바른 URL 형식이 아닙니다");
            }
        }
    }

    private boolean isValidUrl(String url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    /**
     * 텍스트 길이 계산
     */
    public int getTextLength() {
        return content != null ? content.length() : 0;
    }

    /**
     * 사진 개수 계산
     */
    public int getPhotoCount() {
        return photoFileIds != null ? photoFileIds.size() : 0;
    }

    /**
     * 키워드를 배열로 변환
     */
    public String[] getKeywordsArray() {
        if (keywordsUsed == null || keywordsUsed.trim().isEmpty()) {
            return new String[0];
        }
        return keywordsUsed.split(",");
    }

    /**
     * 해시태그를 배열로 변환
     */
    public String[] getHashtagsArray() {
        if (hashtags == null || hashtags.trim().isEmpty()) {
            return new String[0];
        }
        return hashtags.split(",");
    }
}