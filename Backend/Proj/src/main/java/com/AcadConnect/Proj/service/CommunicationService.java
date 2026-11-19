package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.communication.CreateAnnouncementRequest;
import com.AcadConnect.Proj.dto.request.communication.CreateResourceRequest;
import com.AcadConnect.Proj.dto.request.communication.SendMessageRequest;
import com.AcadConnect.Proj.dto.response.AnnouncementResponse;
import com.AcadConnect.Proj.dto.response.ResourceResponse;
import com.AcadConnect.Proj.dto.response.SubgroupMessageResponse;
import com.AcadConnect.Proj.entity.*;
import com.AcadConnect.Proj.enums.NotificationType;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.exception.UnauthorizedAccessException;
import com.AcadConnect.Proj.repository.AnnouncementRepository;
import com.AcadConnect.Proj.repository.ProjectGroupRepository;
import com.AcadConnect.Proj.repository.ResourceRepository;
import com.AcadConnect.Proj.repository.SubgroupMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final AnnouncementRepository announcementRepository;
    private final SubgroupMessageRepository subgroupMessageRepository;
    private final ResourceRepository resourceRepository;
    private final ProjectGroupRepository groupRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    // --- Announcements ---
    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAnnouncements(Long groupId) {
        return announcementRepository.findByMainGroupIdOrderByCreatedAtDesc(groupId).stream()
                .map(this::mapAnnouncement)
                .collect(Collectors.toList());
    }

    @Transactional
    public AnnouncementResponse createAnnouncement(Long groupId, CreateAnnouncementRequest request, User author) {
        if (author.getRole() != RoleType.TEACHER && author.getRole() != RoleType.ADMIN) {
            throw new UnauthorizedAccessException("Only teachers or administrators can post group announcements");
        }

        ProjectGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        Announcement ann = Announcement.builder()
                .mainGroup(group)
                .title(request.getTitle())
                .content(request.getContent())
                .author(author)
                .build();

        ann = announcementRepository.save(ann);

        // Notify group members
        if (group.getMembers() != null) {
            for (GroupMember m : group.getMembers()) {
                if (!m.getStudent().getId().equals(author.getId())) {
                    notificationService.createNotification(
                            m.getStudent(),
                            "New Announcement: " + ann.getTitle(),
                            ann.getContent(),
                            NotificationType.ANNOUNCEMENT,
                            "/student/overview",
                            "ANNOUNCEMENT",
                            ann.getId()
                    );
                }
            }
        }

        auditLogService.logAction(author, "CREATE_ANNOUNCEMENT", "ANNOUNCEMENT", ann.getId(), "Announcement: " + ann.getTitle());
        return mapAnnouncement(ann);
    }

    // --- Messages ---
    @Transactional(readOnly = true)
    public List<SubgroupMessageResponse> getMessages(Long groupId, User user) {
        List<SubgroupMessage> list = subgroupMessageRepository.findByMainGroupIdOrderByCreatedAtDesc(groupId);
        if (user.getRole() == RoleType.STUDENT) {
            list = list.stream().filter(m -> {
                if (m.getSubgroup() == null) return true;
                return m.getSubgroup().getMembers().stream().anyMatch(gm -> gm.getStudent().getId().equals(user.getId()));
            }).collect(Collectors.toList());
        }
        return list.stream().map(this::mapMessage).collect(Collectors.toList());
    }

    @Transactional
    public SubgroupMessageResponse sendMessage(Long groupId, SendMessageRequest request, User sender) {
        ProjectGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        ProjectGroup subgroup = null;
        if (request.getSubgroupId() != null && !request.getSubgroupId().isBlank()) {
            try {
                Long subId = Long.parseLong(request.getSubgroupId().replace("subgroup-", ""));
                subgroup = groupRepository.findById(subId).orElse(null);
            } catch (Exception ignored) {}
        }

        SubgroupMessage msg = SubgroupMessage.builder()
                .mainGroup(group)
                .subgroup(subgroup)
                .subgroupName(subgroup != null ? subgroup.getGroupName() : request.getSubgroupName())
                .sender(sender)
                .content(request.getContent())
                .build();

        return mapMessage(subgroupMessageRepository.save(msg));
    }

    // --- Resources ---
    @Transactional(readOnly = true)
    public List<ResourceResponse> getResources(Long groupId) {
        return resourceRepository.findByMainGroupIdOrderByCreatedAtDesc(groupId).stream()
                .map(this::mapResource)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResourceResponse createResource(Long groupId, CreateResourceRequest request, User user) {
        ProjectGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        ProjectGroup subgroup = null;
        if (request.getSubgroupId() != null && !request.getSubgroupId().isBlank()) {
            try {
                Long subId = Long.parseLong(request.getSubgroupId().replace("subgroup-", ""));
                subgroup = groupRepository.findById(subId).orElse(null);
            } catch (Exception ignored) {}
        }

        Resource res = Resource.builder()
                .mainGroup(group)
                .subgroup(subgroup)
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .url(request.getUrl())
                .sharedBy(user)
                .build();

        return mapResource(resourceRepository.save(res));
    }

    @Transactional
    public void deleteResource(Long id, User user) {
        Resource res = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        resourceRepository.delete(res);
        auditLogService.logAction(user, "DELETE_RESOURCE", "RESOURCE", id, "Resource removed");
    }

    private AnnouncementResponse mapAnnouncement(Announcement a) {
        return AnnouncementResponse.builder()
                .id(String.valueOf(a.getId()))
                .mainGroupId(a.getMainGroup() != null ? String.valueOf(a.getMainGroup().getId()) : null)
                .title(a.getTitle())
                .content(a.getContent())
                .authorId(String.valueOf(a.getAuthor().getId()))
                .authorName(a.getAuthor().getFullName())
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }

    private SubgroupMessageResponse mapMessage(SubgroupMessage m) {
        return SubgroupMessageResponse.builder()
                .id(String.valueOf(m.getId()))
                .mainGroupId(m.getMainGroup() != null ? String.valueOf(m.getMainGroup().getId()) : null)
                .subgroupId(m.getSubgroup() != null ? String.valueOf(m.getSubgroup().getId()) : null)
                .subgroupName(m.getSubgroupName())
                .senderId(String.valueOf(m.getSender().getId()))
                .senderName(m.getSender().getFullName())
                .content(m.getContent())
                .createdAt(m.getCreatedAt() != null ? m.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }

    private ResourceResponse mapResource(Resource r) {
        return ResourceResponse.builder()
                .id(String.valueOf(r.getId()))
                .mainGroupId(r.getMainGroup() != null ? String.valueOf(r.getMainGroup().getId()) : null)
                .subgroupId(r.getSubgroup() != null ? String.valueOf(r.getSubgroup().getId()) : null)
                .title(r.getTitle())
                .description(r.getDescription())
                .type(r.getType())
                .url(r.getUrl())
                .sharedById(String.valueOf(r.getSharedBy().getId()))
                .sharedByName(r.getSharedBy().getFullName())
                .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }
}

