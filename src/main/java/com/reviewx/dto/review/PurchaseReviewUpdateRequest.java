package com.reviewx.dto.review;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 구매평 리뷰 수정 요청 DTO
 */
@Data
@NoArgsConstructor
public class PurchaseReviewUpdateRequest {

    @NotBlank(message = "리뷰 제목은 필수입니다")
    @Size(max = 200, message = "리뷰 제목은 200자 이하여야 합니다")
    private String title;

    @NotBlank(message = "리뷰 내용은 필수입니다")
    @Size(max = 5000, message = "리뷰 내용은 5000자 이하여야 합니다")
    private String content;

    @Min(value = 1, message = "별점은 1점 이상이어야 합니다")
    @Max(value = 5, message = "별점은 5점 이하여야 합니다")
    private Integer rating;

    // 키워드 및 해시태그 (수정 가능)
    @Size(max = 1000, message = "사용된 키워드는 1000자 이하여야 합니다")
    private String keywordsUsed;

    @Size(max = 500, message = "해시태그는 500자 이하여야 합니다")
    private String hashtags;

    // 플랫폼 게시 정보 (수정 가능)
    @Size(max = 1000, message = "플랫폼 URL은 1000자 이하여야 합니다")
    private String platformUrl;

    @Size(max = 100, message = "플랫폼 리뷰 ID는 100자 이하여야 합니다")
    private String platformReviewId;

    private LocalDateTime postedAt;

    // 첨부 파일 ID 목록 (수정 가능)
    private List<Long> photoFileIds; // 포토 리뷰 파일 ID 목록 (추가/삭제 가능)

    // 새로 추가된 파일 ID 목록
    private List<Long> addedPhotoFileIds;

    // 삭제할 파일 ID 목록
    private List<Long> removedPhotoFileIds;

    /**
     * 요청 데이터 유효성 검증
     */
    public void validate() {
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
     * 최종 사진 개수 계산
     */
    public int getFinalPhotoCount() {
        int currentCount = photoFileIds != null ? photoFileIds.size() : 0;
        int addedCount = addedPhotoFileIds != null ? addedPhotoFileIds.size() : 0;
        int removedCount = removedPhotoFileIds != null ? removedPhotoFileIds.size() : 0;

        return Math.max(0, currentCount + addedCount - removedCount);
    }
}