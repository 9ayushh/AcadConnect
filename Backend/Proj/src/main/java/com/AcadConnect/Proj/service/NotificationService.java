package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.response.NotificationResponse;
import com.AcadConnect.Proj.entity.Notification;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.NotificationType;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(User recipient, String title, String message, NotificationType type, String link, String refType, Long refId) {
        if (recipient == null) return;
        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(title)
                .message(message)
                .notificationType(type)
                .link(link)
                .referenceType(refType)
                .referenceId(refId)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (notification.getRecipient().getId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(list);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(String.valueOf(n.getId()))
                .userId(String.valueOf(n.getRecipient().getId()))
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getNotificationType())
                .isRead(Boolean.TRUE.equals(n.getIsRead()))
                .link(n.getLink())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }
}

