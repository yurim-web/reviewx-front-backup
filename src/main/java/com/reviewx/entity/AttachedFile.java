package com.reviewx.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "attached_files")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AttachedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long id;

    // 연관관계 - 다양한 엔티티에 첨부 가능
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review; // 리뷰 첨부파일

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign; // 캠페인 첨부파일

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 사용자 프로필 이미지 등

    // 파일 기본 정보
    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename; // 원본 파일명

    @Column(name = "stored_filename", nullable = false, length = 255)
    private String storedFilename; // 저장된 파일명 (UUID 등)

    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath; // 파일 저장 경로

    @Column(name = "file_url", length = 1000)
    private String fileUrl; // 접근 가능한 URL (CDN 등)

    @Column(name = "file_size", nullable = false)
    private Long fileSize; // 파일 크기 (bytes)

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType; // MIME 타입

    @Column(name = "file_extension", length = 10)
    private String fileExtension; // 파일 확장자

    // 파일 타입 분류
    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false)
    private FileType fileType;

    @Enumerated(EnumType.STRING)
    @Column(name = "attachment_type", nullable = false)
    private AttachmentType attachmentType;

    // 이미지 전용 메타데이터
    @Column(name = "image_width")
    private Integer imageWidth;

    @Column(name = "image_height")
    private Integer imageHeight;

    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl; // 썸네일 URL

    // 정렬 및 표시 순서
    @Column(name = "display_order", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer displayOrder = 0;

    @Column(name = "is_primary", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isPrimary = false; // 대표 이미지 여부

    // 파일 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FileStatus status = FileStatus.ACTIVE;

    // 업로드 관련 정보
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy; // 업로드한 사용자

    @Column(name = "upload_ip", length = 45)
    private String uploadIp; // 업로드 IP

    @Column(name = "user_agent", length = 500)
    private String userAgent; // User Agent

    // 클라우드 스토리지 관련 (S3, GCS 등)
    @Column(name = "storage_provider")
    @Enumerated(EnumType.STRING)
    private StorageProvider storageProvider;

    @Column(name = "bucket_name", length = 100)
    private String bucketName;

    @Column(name = "object_key", length = 1000)
    private String objectKey; // S3 Object Key

    // 파일 검증 및 보안
    @Column(name = "file_hash", length = 64)
    private String fileHash; // SHA-256 해시

    @Column(name = "virus_scan_result")
    @Enumerated(EnumType.STRING)
    private VirusScanResult virusScanResult;

    @Column(name = "scan_date")
    private LocalDateTime scanDate;

    // 메타 정보
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // ENUM 정의
    public enum FileType {
        IMAGE("이미지"),
        VIDEO("동영상"),
        DOCUMENT("문서"),
        AUDIO("오디오"),
        ARCHIVE("압축파일"),
        OTHER("기타");

        private final String description;

        FileType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        public static FileType fromContentType(String contentType) {
            if (contentType.startsWith("image/")) {
                return IMAGE;
            } else if (contentType.startsWith("video/")) {
                return VIDEO;
            } else if (contentType.startsWith("audio/")) {
                return AUDIO;
            } else if (contentType.contains("pdf") || contentType.contains("document") || 
                      contentType.contains("spreadsheet") || contentType.contains("presentation")) {
                return DOCUMENT;
            } else if (contentType.contains("zip") || contentType.contains("rar") || 
                      contentType.contains("tar") || contentType.contains("gzip")) {
                return ARCHIVE;
            }
            return OTHER;
        }
    }

    public enum AttachmentType {
        // 리뷰 관련
        REVIEW_IMAGE("리뷰이미지"),           // 리뷰 본문 이미지
        REVIEW_VIDEO("리뷰동영상"),           // 리뷰 동영상
        PURCHASE_PROOF("구매증빙"),          // 구매 증빙 이미지
        DELIVERY_PROOF("배송증빙"),          // 배송 증빙 이미지
        VISIT_PROOF("방문증빙"),             // 방문 증빙 이미지
        
        // 캠페인 관련
        CAMPAIGN_IMAGE("캠페인이미지"),        // 캠페인 대표 이미지
        PRODUCT_IMAGE("상품이미지"),          // 상품 이미지
        GUIDE_DOCUMENT("가이드문서"),         // 미션 가이드 문서
        
        // 사용자 관련
        PROFILE_IMAGE("프로필이미지"),        // 사용자 프로필 이미지
        ID_VERIFICATION("신분증명"),         // 신분증 등 본인확인 서류
        BUSINESS_LICENSE("사업자등록증"),     // 사업자등록증
        BANK_ACCOUNT("통장사본"),            // 계좌 확인용 통장사본
        
        // 기타
        OTHER("기타");

        private final String description;

        AttachmentType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum FileStatus {
        ACTIVE("활성"),
        PROCESSING("처리중"),    // 업로드 중, 변환 중 등
        DELETED("삭제됨"),
        QUARANTINE("격리");     // 바이러스 등으로 격리

        private final String description;

        FileStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum StorageProvider {
        LOCAL("로컬"),
        AWS_S3("AWS S3"),
        GCP_CLOUD_STORAGE("구글 클라우드"),
        NCLOUD_OBJECT_STORAGE("네이버 클라우드"),
        CDN("CDN");

        private final String description;

        StorageProvider(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum VirusScanResult {
        CLEAN("안전"),
        INFECTED("감염"),
        SUSPICIOUS("의심"),
        SCAN_FAILED("스캔실패"),
        NOT_SCANNED("미스캔");

        private final String description;

        VirusScanResult(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 생성자
    public AttachedFile(String originalFilename, String storedFilename, String filePath, 
                       Long fileSize, String contentType, User uploadedBy) {
        this.originalFilename = originalFilename;
        this.storedFilename = storedFilename;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.uploadedBy = uploadedBy;
        this.fileExtension = extractFileExtension(originalFilename);
        this.fileType = FileType.fromContentType(contentType);
    }

    // 편의 메서드
    public boolean isImage() {
        return this.fileType == FileType.IMAGE;
    }

    public boolean isVideo() {
        return this.fileType == FileType.VIDEO;
    }

    public boolean isDocument() {
        return this.fileType == FileType.DOCUMENT;
    }

    public boolean isActive() {
        return this.status == FileStatus.ACTIVE && this.deletedAt == null;
    }

    public boolean isProcessing() {
        return this.status == FileStatus.PROCESSING;
    }

    public boolean isSafeToAccess() {
        return this.isActive() && 
               (this.virusScanResult == null || 
                this.virusScanResult == VirusScanResult.CLEAN ||
                this.virusScanResult == VirusScanResult.NOT_SCANNED);
    }

    // 파일 확장자 추출
    private String extractFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return null;
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    // 파일 크기 포맷팅
    public String getFormattedFileSize() {
        if (fileSize == null) return "0 B";
        
        long bytes = fileSize;
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1f MB", bytes / (1024.0 * 1024.0));
        return String.format("%.1f GB", bytes / (1024.0 * 1024.0 * 1024.0));
    }

    // 이미지 메타데이터 설정
    public void setImageMetadata(Integer width, Integer height, String thumbnailUrl) {
        this.imageWidth = width;
        this.imageHeight = height;
        this.thumbnailUrl = thumbnailUrl;
    }

    // 클라우드 스토리지 정보 설정
    public void setCloudStorageInfo(StorageProvider provider, String bucket, String objectKey, String publicUrl) {
        this.storageProvider = provider;
        this.bucketName = bucket;
        this.objectKey = objectKey;
        this.fileUrl = publicUrl;
    }

    // 바이러스 스캔 결과 설정
    public void setVirusScanResult(VirusScanResult result) {
        this.virusScanResult = result;
        this.scanDate = LocalDateTime.now();
        
        if (result == VirusScanResult.INFECTED || result == VirusScanResult.SUSPICIOUS) {
            this.status = FileStatus.QUARANTINE;
        }
    }

    // 상태 변경 메서드
    public void markAsProcessing() {
        this.status = FileStatus.PROCESSING;
    }

    public void markAsActive() {
        this.status = FileStatus.ACTIVE;
    }

    public void markAsPrimary() {
        this.isPrimary = true;
    }

    public void unmarkAsPrimary() {
        this.isPrimary = false;
    }

    public void softDelete() {
        this.status = FileStatus.DELETED;
        this.deletedAt = LocalDateTime.now();
    }

    // 리뷰 첨부 메서드
    public void attachToReview(Review review, AttachmentType type, Integer order) {
        this.review = review;
        this.attachmentType = type;
        this.displayOrder = order;
    }

    // 캠페인 첨부 메서드
    public void attachToCampaign(Campaign campaign, AttachmentType type, Integer order) {
        this.campaign = campaign;
        this.attachmentType = type;
        this.displayOrder = order;
    }

    // 사용자 첨부 메서드 (프로필 이미지 등)
    public void attachToUser(User user, AttachmentType type) {
        this.user = user;
        this.attachmentType = type;
    }

    // 정적 팩토리 메서드들
    public static AttachedFile createReviewImage(String originalFilename, String storedFilename, 
                                               String filePath, Long fileSize, String contentType, 
                                               User uploadedBy, Review review, Integer order) {
        AttachedFile file = new AttachedFile(originalFilename, storedFilename, filePath, 
                                           fileSize, contentType, uploadedBy);
        file.attachToReview(review, AttachmentType.REVIEW_IMAGE, order);
        return file;
    }

    public static AttachedFile createPurchaseProof(String originalFilename, String storedFilename, 
                                                 String filePath, Long fileSize, String contentType, 
                                                 User uploadedBy, Review review) {
        AttachedFile file = new AttachedFile(originalFilename, storedFilename, filePath, 
                                           fileSize, contentType, uploadedBy);
        file.attachToReview(review, AttachmentType.PURCHASE_PROOF, 0);
        return file;
    }

    public static AttachedFile createProfileImage(String originalFilename, String storedFilename, 
                                                String filePath, Long fileSize, String contentType, 
                                                User user) {
        AttachedFile file = new AttachedFile(originalFilename, storedFilename, filePath, 
                                           fileSize, contentType, user);
        file.attachToUser(user, AttachmentType.PROFILE_IMAGE);
        file.markAsPrimary();
        return file;
    }

    public static AttachedFile createCampaignImage(String originalFilename, String storedFilename, 
                                                 String filePath, Long fileSize, String contentType, 
                                                 User uploadedBy, Campaign campaign, Integer order) {
        AttachedFile file = new AttachedFile(originalFilename, storedFilename, filePath, 
                                           fileSize, contentType, uploadedBy);
        file.attachToCampaign(campaign, AttachmentType.CAMPAIGN_IMAGE, order);
        return file;
    }

    // 접근 URL 생성 (보안 고려)
    public String getSecureAccessUrl() {
        if (!isSafeToAccess()) {
            return null;
        }
        
        // CDN URL이 있으면 우선 사용
        if (fileUrl != null && !fileUrl.isEmpty()) {
            return fileUrl;
        }
        
        // 로컬 파일인 경우 컨트롤러 경로 반환
        return "/api/files/" + id + "/download";
    }

    // 썸네일 URL 가져오기
    public String getThumbnailAccessUrl() {
        if (!isImage() || !isSafeToAccess()) {
            return null;
        }
        
        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
            return thumbnailUrl;
        }
        
        // 썸네일이 없으면 원본 이미지 URL 반환 (작은 이미지인 경우)
        if (fileSize != null && fileSize < 500 * 1024) { // 500KB 미만
            return getSecureAccessUrl();
        }
        
        return "/api/files/" + id + "/thumbnail";
    }
}