package com.reviewx.repository;

import com.reviewx.entity.Role;
import com.reviewx.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 기본 사용자 조회
    Optional<User> findByEmail(String email);
    Optional<User> findByNickname(String nickname);
    
    // 소셜 로그인 사용자 조회
    Optional<User> findByProviderAndProviderId(User.LoginProvider provider, String providerId);

    // 활성 사용자 조회
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE' AND u.deletedAt IS NULL")
    List<User> findActiveUsers();

    // 역할별 사용자 조회
    @Query("SELECT u FROM User u WHERE u.role = :role " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "ORDER BY u.createdAt DESC")
    Page<User> findByRole(@Param("role") Role role, Pageable pageable);

    // 체험단 캠페인 관련 - 활성 파트너 목록
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'PARTNER' " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "ORDER BY u.createdAt DESC")
    List<User> findActivePartners();

    // 체험단 캠페인 관련 - 활성 리뷰어 목록
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'REVIEWER' " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "ORDER BY u.createdAt DESC")
    Page<User> findActiveReviewers(Pageable pageable);

    // 체험단 캠페인 관련 - 특정 지역의 리뷰어
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'REVIEWER' " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "AND u.address LIKE %:location% " +
           "ORDER BY u.createdAt DESC")
    List<User> findReviewersByLocation(@Param("location") String location);

    // 팔로워 수 기준 상위 리뷰어
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'REVIEWER' " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "AND u.followerCount >= :minFollowers " +
           "ORDER BY u.followerCount DESC")
    List<User> findTopReviewersByFollowers(@Param("minFollowers") Integer minFollowers);

    // 승인률 기준 상위 리뷰어
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'REVIEWER' " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "AND u.totalCampaigns >= 5 " +
           "ORDER BY (CAST(u.completedCampaigns AS DOUBLE) / u.totalCampaigns) DESC")
    List<User> findTopReviewersByApprovalRate();

    // 이메일 중복 확인
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email " +
           "AND u.deletedAt IS NULL")
    boolean existsByEmail(@Param("email") String email);

    // 닉네임 중복 확인
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.nickname = :nickname " +
           "AND u.deletedAt IS NULL")
    boolean existsByNickname(@Param("nickname") String nickname);

    // 사용자 통계
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.roleCode = :roleCode " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL")
    Long countActiveUsersByRole(@Param("roleCode") String roleCode);

    // 특정 기간 가입 사용자
    @Query("SELECT u FROM User u WHERE u.createdAt >= :startDate " +
           "AND u.createdAt <= :endDate " +
           "AND u.deletedAt IS NULL " +
           "ORDER BY u.createdAt DESC")
    List<User> findUsersByRegistrationPeriod(
            @Param("startDate") java.time.LocalDateTime startDate, 
            @Param("endDate") java.time.LocalDateTime endDate);

    // 포인트 보유 사용자 (리뷰어)
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'REVIEWER' " +
           "AND u.pointBalance > 0 " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "ORDER BY u.pointBalance DESC")
    List<User> findReviewersWithPoints();

    // 출금 대기 중인 리뷰어
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleCode = 'REVIEWER' " +
           "AND u.pendingWithdrawal > 0 " +
           "AND u.status = 'ACTIVE' " +
           "AND u.deletedAt IS NULL " +
           "ORDER BY u.pendingWithdrawal DESC")
    List<User> findReviewersWithPendingWithdrawal();
}