package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.communication.CreateAnnouncementRequest;
import com.AcadConnect.Proj.dto.request.communication.CreateResourceRequest;
import com.AcadConnect.Proj.dto.request.communication.SendMessageRequest;
import com.AcadConnect.Proj.dto.response.AnnouncementResponse;
import com.AcadConnect.Proj.dto.response.ResourceResponse;
import com.AcadConnect.Proj.dto.response.SubgroupMessageResponse;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.CommunicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CommunicationController {

    private final CommunicationService communicationService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    // --- Announcements ---
    @GetMapping({"/api/groups/{groupId}/announcements", "/api/v1/groups/{groupId}/announcements", "/groups/{groupId}/announcements"})
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncements(@PathVariable Long groupId) {
        return ResponseEntity.ok(communicationService.getAnnouncements(groupId));
    }

    @PostMapping({"/api/groups/{groupId}/announcements", "/api/v1/groups/{groupId}/announcements", "/groups/{groupId}/announcements"})
    public ResponseEntity<AnnouncementResponse> createAnnouncement(
            @PathVariable Long groupId,
            @Valid @RequestBody CreateAnnouncementRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communicationService.createAnnouncement(groupId, request, getUser(principal)));
    }

    // --- Messages ---
    @GetMapping({"/api/groups/{groupId}/messages", "/api/v1/groups/{groupId}/messages", "/groups/{groupId}/messages"})
    public ResponseEntity<List<SubgroupMessageResponse>> getMessages(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(communicationService.getMessages(groupId, getUser(principal)));
    }

    @PostMapping({"/api/groups/{groupId}/messages", "/api/v1/groups/{groupId}/messages", "/groups/{groupId}/messages"})
    public ResponseEntity<SubgroupMessageResponse> sendMessage(
            @PathVariable Long groupId,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communicationService.sendMessage(groupId, request, getUser(principal)));
    }

    // --- Resources ---
    @GetMapping({"/api/groups/{groupId}/resources", "/api/v1/groups/{groupId}/resources", "/groups/{groupId}/resources"})
    public ResponseEntity<List<ResourceResponse>> getResources(@PathVariable Long groupId) {
        return ResponseEntity.ok(communicationService.getResources(groupId));
    }

    @PostMapping({"/api/groups/{groupId}/resources", "/api/v1/groups/{groupId}/resources", "/groups/{groupId}/resources"})
    public ResponseEntity<ResourceResponse> createResource(
            @PathVariable Long groupId,
            @Valid @RequestBody CreateResourceRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communicationService.createResource(groupId, request, getUser(principal)));
    }

    @DeleteMapping({"/api/resources/{id}", "/api/v1/resources/{id}", "/resources/{id}"})
    public ResponseEntity<Map<String, String>> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        communicationService.deleteResource(id, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Resource removed"));
    }
}

