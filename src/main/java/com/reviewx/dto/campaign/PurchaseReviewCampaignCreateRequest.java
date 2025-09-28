package com.reviewx.dto.campaign;

import com.reviewx.entity.Campaign;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 구매평 캠페인 생성 요청 DTO
 */
@Data
@NoArgsConstructor
public class PurchaseReviewCampaignCreateRequest {

    @NotBlank(message = "캠페인 제목은 필수입니다")
    @Size(max = 200, message = "캠페인 제목은 200자 이하여야 합니다")
    private String title;

    @Size(max = 2000, message = "캠페인 설명은 2000자 이하여야 합니다")
    private String description;

    // 제품 정보
    @NotBlank(message = "제품명은 필수입니다")
    @Size(max = 200, message = "제품명은 200자 이하여야 합니다")
    private String productName;

    @NotNull(message = "제품 가격은 필수입니다")
    @Min(value = 0, message = "제품 가격은 0원 이상이어야 합니다")
    private Integer productPrice;

    @NotBlank(message = "제품 URL은 필수입니다")
    @Size(max = 1000, message = "제품 URL은 1000자 이하여야 합니다")
    private String productUrl;

    @NotBlank(message = "쇼핑몰명은 필수입니다")
    @Size(max = 100, message = "쇼핑몰명은 100자 이하여야 합니다")
    private String shopName;

    @Size(max = 1000, message = "쇼핑몰 URL은 1000자 이하여야 합니다")
    private String shopUrl;

    // 리뷰 플랫폼 설정
    @NotNull(message = "리뷰 플랫폼은 필수입니다")
    private Campaign.ReviewPlatform reviewPlatform;

    // 리뷰 형식 설정 (구매평 전용)
    @NotNull(message = "리뷰 형식은 필수입니다")
    private Campaign.ReviewFormat reviewFormat;

    // 텍스트 리뷰 설정
    @Min(value = 0, message = "최소 텍스트 길이는 0자 이상이어야 합니다")
    private Integer minTextLength;

    // 포토 리뷰 설정
    @Min(value = 0, message = "최소 사진 개수는 0개 이상이어야 합니다")
    private Integer minPhotoCount;

    // 캠페인 모집 설정
    @NotNull(message = "모집 인원은 필수입니다")
    @Min(value = 1, message = "모집 인원은 1명 이상이어야 합니다")
    @Max(value = 1000, message = "모집 인원은 1000명 이하여야 합니다")
    private Integer recruitCount;

    @NotNull(message = "리워드 포인트는 필수입니다")
    @Min(value = 100, message = "리워드 포인트는 100포인트 이상이어야 합니다")
    private Integer rewardPoint;

    // 리뷰 가이드
    @NotBlank(message = "리뷰 가이드는 필수입니다")
    @Size(max = 5000, message = "리뷰 가이드는 5000자 이하여야 합니다")
    private String reviewGuide;

    @Size(max = 500, message = "키워드 요구사항은 500자 이하여야 합니다")
    private String keywordRequirements;

    // 일정 설정
    @NotNull(message = "신청 시작일은 필수입니다")
    private LocalDateTime applicationStartDate;

    @NotNull(message = "신청 마감일은 필수입니다")
    private LocalDateTime applicationEndDate;

    private LocalDateTime selectionDate;

    private LocalDateTime reviewStartDate;

    @NotNull(message = "리뷰 마감일은 필수입니다")
    private LocalDateTime reviewEndDate;

    // 배송 설정 (구매평의 경우 배송 관련 정보 포함)
    private Boolean shippingRequired = true; // 구매평은 기본적으로 배송 필요

    private Integer shippingFee;

    @Size(max = 500, message = "배송 안내는 500자 이하여야 합니다")
    private String shippingNote;

    /**
     * DTO를 Campaign 엔티티로 변환
     */
    public Campaign toEntity() {
        Campaign campaign = new Campaign();

        // 기본 정보
        campaign.setCampaignType(Campaign.CampaignType.PURCHASE_REVIEW);
        campaign.setTitle(this.title);
        campaign.setDescription(this.description);

        // 제품 정보
        campaign.setProductName(this.productName);
        campaign.setProductPrice(this.productPrice);
        campaign.setProductUrl(this.productUrl);
        campaign.setShopName(this.shopName);
        campaign.setShopUrl(this.shopUrl);

        // 플랫폼 및 리뷰 형식
        campaign.setReviewPlatform(this.reviewPlatform);
        campaign.setReviewFormat(this.reviewFormat);

        // 리뷰 설정
        campaign.setMinTextLength(this.minTextLength);
        campaign.setMinPhotoCount(this.minPhotoCount);

        // 모집 설정
        campaign.setRecruitCount(this.recruitCount);
        campaign.setRewardPoint(this.rewardPoint);

        // 가이드
        campaign.setReviewGuide(this.reviewGuide);
        campaign.setKeywordRequirements(this.keywordRequirements);

        // 일정
        campaign.setApplicationStartDate(this.applicationStartDate);
        campaign.setApplicationEndDate(this.applicationEndDate);
        campaign.setSelectionDate(this.selectionDate);
        campaign.setReviewStartDate(this.reviewStartDate);
        campaign.setReviewEndDate(this.reviewEndDate);

        // 배송 설정
        campaign.setShippingRequired(this.shippingRequired);
        campaign.setShippingFee(this.shippingFee);
        campaign.setShippingNote(this.shippingNote);

        // 예산 계산
        campaign.setTotalBudget(this.recruitCount * this.rewardPoint);

        // 초기 상태 설정
        campaign.setStatus(Campaign.CampaignStatus.DRAFT);

        return campaign;
    }

    /**
     * 요청 데이터 유효성 검증
     */
    public void validate() {
        // 날짜 검증
        if (applicationStartDate != null && applicationEndDate != null) {
            if (applicationStartDate.isAfter(applicationEndDate)) {
                throw new IllegalArgumentException("신청 시작일은 마감일보다 빨라야 합니다");
            }
        }

        if (applicationEndDate != null && reviewEndDate != null) {
            if (applicationEndDate.isAfter(reviewEndDate)) {
                throw new IllegalArgumentException("신청 마감일은 리뷰 마감일보다 빨라야 합니다");
            }
        }

        if (selectionDate != null && applicationEndDate != null) {
            if (selectionDate.isBefore(applicationEndDate)) {
                throw new IllegalArgumentException("선발 발표일은 신청 마감일 이후여야 합니다");
            }
        }

        if (reviewStartDate != null && selectionDate != null) {
            if (reviewStartDate.isBefore(selectionDate)) {
                throw new IllegalArgumentException("리뷰 시작일은 선발 발표일 이후여야 합니다");
            }
        }

        // 리뷰 형식에 따른 필수 값 검증
        if (reviewFormat != null) {
            switch (reviewFormat) {
                case TEXT:
                    if (minTextLength == null || minTextLength < 50) {
                        throw new IllegalArgumentException("텍스트 리뷰의 경우 최소 50자 이상이어야 합니다");
                    }
                    break;
                case PHOTO:
                    if (minPhotoCount == null || minPhotoCount < 1) {
                        throw new IllegalArgumentException("포토 리뷰의 경우 최소 1장 이상이어야 합니다");
                    }
                    break;
                case TEXT_AND_PHOTO:
                    if (minTextLength == null || minTextLength < 30) {
                        throw new IllegalArgumentException("텍스트+포토 리뷰의 경우 최소 30자 이상이어야 합니다");
                    }
                    if (minPhotoCount == null || minPhotoCount < 1) {
                        throw new IllegalArgumentException("텍스트+포토 리뷰의 경우 최소 1장 이상이어야 합니다");
                    }
                    break;
            }
        }

        // 배송비 검증
        if (Boolean.TRUE.equals(shippingRequired) && shippingFee != null && shippingFee < 0) {
            throw new IllegalArgumentException("배송비는 0원 이상이어야 합니다");
        }
    }
}