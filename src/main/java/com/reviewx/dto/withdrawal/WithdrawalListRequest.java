package com.reviewx.dto.withdrawal;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class WithdrawalListRequest {

    // 필터링
    private String status; // 출금 상태 필터 (PENDING, APPROVED, COMPLETED 등)

    // 기간 검색
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    // 금액 범위
    private Integer minAmount;
    private Integer maxAmount;

    // 페이징
    private Integer page = 0;
    private Integer size = 20;
    private String sort = "requestedAt";
    private String direction = "desc";

    // 검색어 (출금번호, 계좌번호, 예금주명 대상)
    private String keyword;

    public void setDefaults() {
        if (page == null || page < 0) page = 0;
        if (size == null || size < 1 || size > 100) size = 20;
        if (sort == null || sort.trim().isEmpty()) sort = "requestedAt";
        if (direction == null || (!direction.equalsIgnoreCase("asc") && !direction.equalsIgnoreCase("desc"))) {
            direction = "desc";
        }
    }
}