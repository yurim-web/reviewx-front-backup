package com.reviewx.controller;

import com.reviewx.entity.AttachedFile;
import com.reviewx.service.PurchaseReviewFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 구매평 캠페인용 파일 업로드 컨트롤러
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final PurchaseReviewFileService fileService;

    /**
     * 구매 증빙 파일 임시 업로드
     */
    @PostMapping(value = "/upload/purchase-proof", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadPurchaseProof(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {

        log.info("Uploading purchase proof file: {}", file.getOriginalFilename());

        try {
            AttachedFile attachedFile = fileService.uploadTempFile(
                file, AttachedFile.AttachmentType.PURCHASE_PROOF, auth);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileId", attachedFile.getId());
            response.put("fileName", attachedFile.getOriginalFilename());
            response.put("fileSize", attachedFile.getFileSize());
            response.put("contentType", attachedFile.getContentType());
            response.put("message", "구매 증빙 파일이 업로드되었습니다");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Purchase proof file upload failed", e);
            return createErrorResponse("파일 업로드 중 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IllegalArgumentException e) {
            log.warn("Purchase proof file upload validation failed: {}", e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 리뷰 이미지 파일 임시 업로드 (다중 파일)
     */
    @PostMapping(value = "/upload/review-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadReviewImages(
            @RequestParam("files") List<MultipartFile> files,
            Authentication auth) {

        log.info("Uploading review images: count={}", files.size());

        try {
            // 파일 개수 검증
            fileService.validateFileCount(files, AttachedFile.AttachmentType.REVIEW_IMAGE);

            // 각 파일 개별 업로드
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("uploadedFiles", files.size());
            response.put("fileIds", new java.util.ArrayList<>());

            for (MultipartFile file : files) {
                AttachedFile attachedFile = fileService.uploadTempFile(
                    file, AttachedFile.AttachmentType.REVIEW_IMAGE, auth);

                Map<String, Object> fileInfo = new HashMap<>();
                fileInfo.put("fileId", attachedFile.getId());
                fileInfo.put("fileName", attachedFile.getOriginalFilename());
                fileInfo.put("fileSize", attachedFile.getFileSize());

                ((java.util.List<Map<String, Object>>) response.get("fileIds")).add(fileInfo);
            }

            response.put("message", "리뷰 이미지가 업로드되었습니다");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Review images upload failed", e);
            return createErrorResponse("파일 업로드 중 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IllegalArgumentException e) {
            log.warn("Review images upload validation failed: {}", e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 단일 파일 임시 업로드 (범용)
     */
    @PostMapping(value = "/upload/temp", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadTempFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String attachmentType,
            Authentication auth) {

        log.info("Uploading temp file: {} with type: {}", file.getOriginalFilename(), attachmentType);

        try {
            AttachedFile.AttachmentType type = AttachedFile.AttachmentType.valueOf(attachmentType.toUpperCase());
            AttachedFile attachedFile = fileService.uploadTempFile(file, type, auth);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileId", attachedFile.getId());
            response.put("fileName", attachedFile.getOriginalFilename());
            response.put("fileSize", attachedFile.getFileSize());
            response.put("contentType", attachedFile.getContentType());
            response.put("downloadUrl", attachedFile.getSecureAccessUrl());
            response.put("message", "파일이 업로드되었습니다");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Temp file upload failed", e);
            return createErrorResponse("파일 업로드 중 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IllegalArgumentException e) {
            log.warn("Temp file upload validation failed: {}", e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 파일 다운로드 정보 조회
     */
    @GetMapping("/{fileId}/info")
    public ResponseEntity<Map<String, Object>> getFileInfo(
            @PathVariable Long fileId,
            Authentication auth) {

        log.info("Getting file info: fileId={}", fileId);

        try {
            Map<String, Object> fileInfo = fileService.getFileDownloadInfo(fileId, auth);
            return ResponseEntity.ok(fileInfo);

        } catch (IllegalArgumentException e) {
            log.warn("File info retrieval failed: {}", e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * 파일 삭제
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Map<String, Object>> deleteFile(
            @PathVariable Long fileId,
            Authentication auth) {

        log.info("Deleting file: fileId={}", fileId);

        try {
            fileService.deleteFile(fileId, auth);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "파일이 삭제되었습니다");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("File deletion failed: {}", e.getMessage());
            return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * 파일 업로드 가이드라인 조회
     */
    @GetMapping("/upload-guidelines")
    public ResponseEntity<Map<String, Object>> getUploadGuidelines() {

        Map<String, Object> guidelines = new HashMap<>();

        // 구매 증빙 파일 가이드라인
        Map<String, Object> purchaseProof = new HashMap<>();
        purchaseProof.put("maxFiles", 3);
        purchaseProof.put("maxSizeMB", 5);
        purchaseProof.put("allowedTypes", List.of("jpg", "jpeg", "png", "pdf"));
        purchaseProof.put("description", "구매 영수증, 주문 확인서 등의 구매 증빙 자료");
        purchaseProof.put("requirements", List.of(
            "주문번호가 명확히 보여야 함",
            "배송지 주소가 포함되어야 함",
            "결제 정보가 확인 가능해야 함"
        ));

        // 리뷰 이미지 가이드라인
        Map<String, Object> reviewImages = new HashMap<>();
        reviewImages.put("maxFiles", 10);
        reviewImages.put("maxSizeMB", 5);
        reviewImages.put("allowedTypes", List.of("jpg", "jpeg", "png", "gif", "webp"));
        reviewImages.put("description", "제품 사용 후기를 보여주는 사진들");
        reviewImages.put("requirements", List.of(
            "실제 제품이 포함된 사진이어야 함",
            "선명하고 품질이 좋은 사진이어야 함",
            "개인정보가 노출되지 않도록 주의"
        ));

        guidelines.put("purchaseProof", purchaseProof);
        guidelines.put("reviewImages", reviewImages);

        return ResponseEntity.ok(guidelines);
    }

    // === Helper Methods ===

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return ResponseEntity.status(status).body(response);
    }
}