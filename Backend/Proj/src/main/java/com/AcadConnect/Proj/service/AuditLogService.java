package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.entity.AuditLog;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(User actor, String action, String entityType, Long entityId, String details) {
        try {
            AuditLog log = AuditLog.builder()
                    .actor(actor)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .details(details)
                    .build();
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Audit log failures should not break the primary business transaction
        }
    }
}

