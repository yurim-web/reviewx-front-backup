package com.reviewx.service;

import com.reviewx.entity.AttachedFile;
import com.reviewx.entity.Review;
import com.reviewx.entity.User;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 구매평 캠페인용 파일 업로드 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PurchaseReviewFileService {

    private final UserRepository userRepository;

    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    @Value("${app.file.max-size:5242880}") // 5MB
    private long maxFileSize;

    @Value("${app.file.allowed-image-types:jpg,jpeg,png,gif,webp}")
    private String allowedImageTypes;

    // 지원되는 이미지 형식
    private static final Set<String> ALLOWED_IMAGE_CONTENT_TYPES = Set.of(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    // 지원되는 문서 형식 (구매 증빙용)
    private static final Set<String> ALLOWED_DOCUMENT_CONTENT_TYPES = Set.of(
        "image/jpeg", "image/jpg", "image/png", "image/pdf"
    );

    /**
     * 구매 증빙 파일 업로드 (영수증, 주문서 등)
     */
    @Transactional
    public AttachedFile uploadPurchaseProof(MultipartFile file, Review review, Authentication auth)
            throws IOException {
        log.info("Uploading purchase proof file: originalName={}, size={}",
                file.getOriginalFilename(), file.getSize());

        User uploadedBy = getUserFromAuth(auth);

        // 파일 유효성 검증
        validatePurchaseProofFile(file);

        // 파일 저장
        String storedFilename = generateStoredFilename(file);
        String filePath = saveFileToStorage(file, storedFilename, "purchase-proofs");

        // AttachedFile 엔티티 생성
        AttachedFile attachedFile = AttachedFile.createPurchaseProof(
            file.getOriginalFilename(),
            storedFilename,
            filePath,
            file.getSize(),
            file.getContentType(),
            uploadedBy,
            review
        );

        // 파일 해시 생성
        String fileHash = generateFileHash(file);
        attachedFile.setFileHash(fileHash);

        log.info("Purchase proof file uploaded successfully: fileId={}", attachedFile.getId());

        return attachedFile;
    }

    /**
     * 리뷰 이미지 파일 업로드
     */
    @Transactional
    public List<AttachedFile> uploadReviewImages(List<MultipartFile> files, Review review,
                                               Authentication auth) throws IOException {
        log.info("Uploading review images: count={}", files.size());

        User uploadedBy = getUserFromAuth(auth);
        List<AttachedFile> attachedFiles = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);

            // 파일 유효성 검증
            validateReviewImageFile(file);

            // 파일 저장
            String storedFilename = generateStoredFilename(file);
            String filePath = saveFileToStorage(file, storedFilename, "review-images");

            // AttachedFile 엔티티 생성
            AttachedFile attachedFile = AttachedFile.createReviewImage(
                file.getOriginalFilename(),
                storedFilename,
                filePath,
                file.getSize(),
                file.getContentType(),
                uploadedBy,
                review,
                i + 1 // 표시 순서
            );

            // 첫 번째 이미지를 대표 이미지로 설정
            if (i == 0) {
                attachedFile.markAsPrimary();
            }

            // 파일 해시 생성
            String fileHash = generateFileHash(file);
            attachedFile.setFileHash(fileHash);

            attachedFiles.add(attachedFile);
        }

        log.info("Review images uploaded successfully: count={}", attachedFiles.size());

        return attachedFiles;
    }

    /**
     * 임시 파일 업로드 (리뷰 작성 전)
     */
    @Transactional
    public AttachedFile uploadTempFile(MultipartFile file, AttachedFile.AttachmentType attachmentType,
                                     Authentication auth) throws IOException {
        log.info("Uploading temp file: originalName={}, type={}",
                file.getOriginalFilename(), attachmentType);

        User uploadedBy = getUserFromAuth(auth);

        // 첨부 타입에 따른 파일 검증
        if (attachmentType == AttachedFile.AttachmentType.PURCHASE_PROOF) {
            validatePurchaseProofFile(file);
        } else if (attachmentType == AttachedFile.AttachmentType.REVIEW_IMAGE) {
            validateReviewImageFile(file);
        } else {
            validateCommonFile(file);
        }

        // 파일 저장
        String storedFilename = generateStoredFilename(file);
        String filePath = saveFileToStorage(file, storedFilename, "temp");

        // AttachedFile 엔티티 생성 (임시 파일)
        AttachedFile attachedFile = new AttachedFile(
            file.getOriginalFilename(),
            storedFilename,
            filePath,
            file.getSize(),
            file.getContentType(),
            uploadedBy
        );

        attachedFile.setAttachmentType(attachmentType);
        attachedFile.markAsProcessing(); // 임시 파일 상태

        // 파일 해시 생성
        String fileHash = generateFileHash(file);
        attachedFile.setFileHash(fileHash);

        log.info("Temp file uploaded successfully: fileId={}", attachedFile.getId());

        return attachedFile;
    }

    /**
     * 파일 다운로드 정보 조회
     */
    public Map<String, Object> getFileDownloadInfo(Long fileId, Authentication auth) {
        // 실제 구현에서는 AttachedFileRepository를 사용하여 파일 정보를 조회해야 함
        // 여기서는 예시로 기본 구조만 제공

        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("fileId", fileId);
        fileInfo.put("downloadUrl", "/api/files/" + fileId + "/download");
        fileInfo.put("contentType", "application/octet-stream");

        return fileInfo;
    }

    /**
     * 파일 삭제 (소프트 삭제)
     */
    @Transactional
    public void deleteFile(Long fileId, Authentication auth) {
        // 실제 구현에서는 AttachedFileRepository를 사용하여 파일을 조회하고 삭제 처리
        log.info("Deleting file: fileId={}, user={}", fileId, auth.getName());

        // 파일 엔티티 소프트 삭제 처리
        // attachedFile.softDelete();
    }

    // === Private Helper Methods ===

    private User getUserFromAuth(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
    }

    private void validatePurchaseProofFile(MultipartFile file) {
        validateFileNotEmpty(file);
        validateFileSize(file);
        validateFileContentType(file, ALLOWED_DOCUMENT_CONTENT_TYPES, "구매 증빙");
        validateFileName(file);
    }

    private void validateReviewImageFile(MultipartFile file) {
        validateFileNotEmpty(file);
        validateFileSize(file);
        validateFileContentType(file, ALLOWED_IMAGE_CONTENT_TYPES, "리뷰 이미지");
        validateFileName(file);
    }

    private void validateCommonFile(MultipartFile file) {
        validateFileNotEmpty(file);
        validateFileSize(file);
        validateFileName(file);
    }

    private void validateFileNotEmpty(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일은 업로드할 수 없습니다");
        }
    }

    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                String.format("파일 크기가 너무 큽니다. 최대 %d MB까지 업로드 가능합니다",
                maxFileSize / (1024 * 1024)));
        }
    }

    private void validateFileContentType(MultipartFile file, Set<String> allowedTypes, String fileTypeDesc) {
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                String.format("%s 파일로 지원되지 않는 파일 형식입니다: %s", fileTypeDesc, contentType));
        }
    }

    private void validateFileName(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("파일명이 올바르지 않습니다");
        }

        // 위험한 파일명 패턴 검사
        if (originalFilename.contains("..") || originalFilename.contains("/") ||
            originalFilename.contains("\\")) {
            throw new IllegalArgumentException("안전하지 않은 파일명입니다");
        }
    }

    private String generateStoredFilename(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        String uuid = UUID.randomUUID().toString();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        return String.format("%s_%s%s", timestamp, uuid, extension);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private String saveFileToStorage(MultipartFile file, String storedFilename, String subDir)
            throws IOException {
        // 날짜별 디렉토리 생성
        String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path targetDir = Paths.get(uploadDir, subDir, datePath);

        // 디렉토리가 없으면 생성
        Files.createDirectories(targetDir);

        // 파일 저장
        Path targetFile = targetDir.resolve(storedFilename);
        Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

        return targetFile.toString();
    }

    private String generateFileHash(MultipartFile file) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(file.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (NoSuchAlgorithmException | IOException e) {
            log.warn("Failed to generate file hash", e);
            return null;
        }
    }

    /**
     * 파일 형식별 최대 업로드 개수 확인
     */
    public void validateFileCount(List<MultipartFile> files, AttachedFile.AttachmentType type) {
        int maxCount = getMaxFileCount(type);

        if (files.size() > maxCount) {
            throw new IllegalArgumentException(
                String.format("%s는 최대 %d개까지 업로드 가능합니다", type.getDescription(), maxCount));
        }
    }

    private int getMaxFileCount(AttachedFile.AttachmentType type) {
        switch (type) {
            case PURCHASE_PROOF:
                return 3; // 구매 증빙은 최대 3개
            case REVIEW_IMAGE:
                return 10; // 리뷰 이미지는 최대 10개
            case REVIEW_VIDEO:
                return 1; // 리뷰 비디오는 1개
            default:
                return 5;
        }
    }

    /**
     * 이미지 메타데이터 추출 (실제 구현시 ImageIO 등 사용)
     */
    public void extractImageMetadata(AttachedFile file) {
        if (!file.isImage()) {
            return;
        }

        // 실제 구현에서는 이미지 파일을 읽어서 가로/세로 크기 추출
        // 썸네일 생성 등의 작업도 여기서 수행

        log.info("Extracting image metadata for file: {}", file.getId());

        // 예시: 기본값 설정
        file.setImageMetadata(800, 600, null);
    }

    /**
     * 썸네일 생성 (실제 구현시 이미지 처리 라이브러리 사용)
     */
    public String generateThumbnail(AttachedFile file) {
        if (!file.isImage()) {
            return null;
        }

        // 실제 구현에서는 이미지 리사이징을 통한 썸네일 생성
        log.info("Generating thumbnail for file: {}", file.getId());

        // 썸네일 파일 경로 반환
        return "/api/files/" + file.getId() + "/thumbnail";
    }
}