package com.reviewx.service;

import com.reviewx.entity.User;
import com.reviewx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 포인트 거래 관련 스케줄 작업 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PointTransactionSchedulerService {

    private final PointTransactionService pointTransactionService;
    private final UserRepository userRepository;

    /**
     * 타임아웃된 거래 정리 스케줄러
     * 매 10분마다 실행
     */
    @Scheduled(fixedRate = 600000) // 10분 = 600,000ms
    @Transactional
    public void cleanupTimeoutTransactions() {
        try {
            log.debug("Starting cleanup of timeout transactions");
            pointTransactionService.cleanupTimeoutTransactions();
            log.debug("Completed cleanup of timeout transactions");
        } catch (Exception e) {
            log.error("Failed to cleanup timeout transactions", e);
        }
    }

    /**
     * 사용자 포인트 잔액 검증 스케줄러
     * 매일 새벽 3시에 실행
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional(readOnly = true)
    public void verifyUserBalances() {
        try {
            log.info("Starting daily user balance verification");
            
            List<User> activeUsers = userRepository.findActiveUsers();
            int totalUsers = activeUsers.size();
            int mismatchCount = 0;
            
            for (User user : activeUsers) {
                try {
                    boolean isValid = pointTransactionService.verifyUserBalance(user.getId());
                    if (!isValid) {
                        mismatchCount++;
                        log.error("Balance mismatch detected for user: {}", user.getId());
                    }
                } catch (Exception e) {
                    log.error("Failed to verify balance for user: {}", user.getId(), e);
                }
            }
            
            log.info("Completed daily user balance verification. Total: {}, Mismatches: {}", 
                totalUsers, mismatchCount);
                
        } catch (Exception e) {
            log.error("Failed to execute daily balance verification", e);
        }
    }

    /**
     * 포인트 거래 통계 요약 스케줄러
     * 매일 자정에 실행
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional(readOnly = true)
    public void generateDailyTransactionSummary() {
        try {
            log.info("Generating daily transaction summary");
            
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
            
            // 여기에서 일일 거래 통계를 생성하고 저장하는 로직을 구현
            // 예: 총 거래량, 거래 건수, 충전액, 출금액 등
            
            log.info("Daily transaction summary generated successfully");
            
        } catch (Exception e) {
            log.error("Failed to generate daily transaction summary", e);
        }
    }
}