package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.assignment.CreateAssignmentRequest;
import com.AcadConnect.Proj.dto.response.AssignmentResponse;
import com.AcadConnect.Proj.dto.response.SubmissionResponse;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.AssignmentStatus;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.AssignmentService;
import com.AcadConnect.Proj.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final SubmissionService submissionService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    // Direct assignment endpoints
    @GetMapping({"/api/assignments", "/api/v1/assignments", "/assignments"})
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping({"/api/assignments/{id}", "/api/v1/assignments/{id}", "/assignments/{id}"})
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @PostMapping({"/api/assignments", "/api/v1/assignments", "/assignments"})
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody CreateAssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.createAssignment(null, request, getUser(principal)));
    }

    @PutMapping({"/api/assignments/{id}", "/api/v1/assignments/{id}", "/assignments/{id}"})
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody CreateAssignmentRequest request
    ) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request));
    }

    @PutMapping({"/api/assignments/{id}/lock", "/api/v1/assignments/{id}/lock", "/assignments/{id}/lock"})
    public ResponseEntity<AssignmentResponse> toggleLock(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.toggleLock(id));
    }

    @PatchMapping({"/api/assignments/{id}/status", "/api/v1/assignments/{id}/status", "/assignments/{id}/status"})
    public ResponseEntity<AssignmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam AssignmentStatus status
    ) {
        return ResponseEntity.ok(assignmentService.updateStatus(id, status));
    }

    @GetMapping({"/api/assignments/{id}/submissions", "/api/v1/assignments/{id}/submissions", "/assignments/{id}/submissions"})
    public ResponseEntity<List<SubmissionResponse>> getAssignmentSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignmentId(id));
    }

    // Group-scoped assignment endpoints
    @GetMapping({"/api/groups/{groupId}/assignments", "/api/v1/groups/{groupId}/assignments", "/groups/{groupId}/assignments"})
    public ResponseEntity<List<AssignmentResponse>> getGroupAssignments(@PathVariable Long groupId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByGroupId(groupId));
    }

    @PostMapping({"/api/groups/{groupId}/assignments", "/api/v1/groups/{groupId}/assignments", "/groups/{groupId}/assignments"})
    public ResponseEntity<AssignmentResponse> createGroupAssignment(
            @PathVariable Long groupId,
            @Valid @RequestBody CreateAssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.createAssignment(groupId, request, getUser(principal)));
    }
}

