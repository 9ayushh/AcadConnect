package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.project.CreateProjectRequest;
import com.AcadConnect.Proj.dto.request.project.UpdateProjectRequest;
import com.AcadConnect.Proj.dto.response.ProjectResponse;
import com.AcadConnect.Proj.dto.response.SubmissionResponse;
import com.AcadConnect.Proj.entity.ProjectDocument;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.DocumentType;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.ProjectService;
import com.AcadConnect.Proj.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/projects", "/api/v1/projects", "/projects"})
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final SubmissionService submissionService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(projectService.getProjects(getUser(principal)));
    }

    @GetMapping("/my")
    public ResponseEntity<ProjectResponse> getMyProject(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(projectService.getMyProject(getUser(principal)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable String id) {
        Long pId = Long.parseLong(id.replace("project-", ""));
        return ResponseEntity.ok(projectService.getProjectById(pId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request, getUser(principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable String id,
            @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long pId = Long.parseLong(id.replace("project-", ""));
        return ResponseEntity.ok(projectService.updateProject(pId, request, getUser(principal)));
    }

    @PostMapping("/{id}/documents")
    public ResponseEntity<ProjectDocument> uploadDocument(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentType", required = false) DocumentType documentType,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long pId = Long.parseLong(id.replace("project-", ""));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.uploadDocument(pId, file, documentType, getUser(principal)));
    }

    @DeleteMapping("/{id}/documents/{documentId}")
    public ResponseEntity<Map<String, String>> deleteDocument(
            @PathVariable String id,
            @PathVariable Long documentId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long pId = Long.parseLong(id.replace("project-", ""));
        projectService.deleteDocument(pId, documentId, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Document deleted successfully"));
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<List<SubmissionResponse>> getProjectSubmissions(@PathVariable String id) {
        Long pId = Long.parseLong(id.replace("project-", ""));
        return ResponseEntity.ok(submissionService.getSubmissionsByProjectId(pId));
    }
}

