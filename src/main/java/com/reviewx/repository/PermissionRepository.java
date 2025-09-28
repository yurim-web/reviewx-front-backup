package com.reviewx.repository;

import com.reviewx.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Optional<Permission> findByPermissionCode(String permissionCode);

    @Query("SELECT p FROM Permission p WHERE p.resource = :resource AND p.action = :action AND p.isActive = true")
    Optional<Permission> findByResourceAndAction(@Param("resource") String resource, @Param("action") String action);

    @Query("SELECT p FROM Permission p JOIN p.rolePermissions rp WHERE rp.role.id = :roleId AND p.isActive = true")
    List<Permission> findByRoleId(@Param("roleId") Long roleId);

    boolean existsByPermissionCode(String permissionCode);
}