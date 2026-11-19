package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByActorIdOrderByCreatedAtDesc(Long actorId);
    List<AuditLog> findTop50ByOrderByCreatedAtDesc();
}

