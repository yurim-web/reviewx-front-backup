package com.reviewx.dto.point;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class PointTransactionListRequest {

    // 필터링
    private String transactionType; // 거래 유형 필터
    private String status; // 상태 필터

    // 기간 검색
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    // 페이징
    private Integer page = 0;
    private Integer size = 20;
    private String sort = "createdAt";
    private String direction = "desc";

    // 검색어 (description 대상)
    private String keyword;

    public void setDefaults() {
        if (page == null || page < 0) page = 0;
        if (size == null || size < 1 || size > 100) size = 20;
        if (sort == null || sort.trim().isEmpty()) sort = "createdAt";
        if (direction == null || (!direction.equalsIgnoreCase("asc") && !direction.equalsIgnoreCase("desc"))) {
            direction = "desc";
        }
    }
}