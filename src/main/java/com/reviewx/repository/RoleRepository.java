package com.reviewx.repository;

import com.reviewx.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleCode(String roleCode);

    @Query("SELECT r FROM Role r WHERE r.roleCode = :roleCode AND r.isActive = true")
    Optional<Role> findByRoleCodeAndIsActive(@Param("roleCode") String roleCode);

    boolean existsByRoleCode(String roleCode);
}