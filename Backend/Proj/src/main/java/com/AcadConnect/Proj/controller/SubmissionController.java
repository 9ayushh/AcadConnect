package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.review.CreateReviewRequest;
import com.AcadConnect.Proj.dto.request.submission.CreateSubmissionPayload;
import com.AcadConnect.Proj.dto.response.ReviewHistoryEntryResponse;
import com.AcadConnect.Proj.dto.response.SubmissionResponse;
import com.AcadConnect.Proj.entity.SubmissionFile;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.ReviewService;
import com.AcadConnect.Proj.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/submissions", "/api/v1/submissions", "/submissions"})
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<SubmissionResponse>> getSubmissions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(submissionService.getSubmissions(getUser(principal)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmissionById(@PathVariable String id) {
        Long subId = Long.parseLong(id.replace("sub-", ""));
        return ResponseEntity.ok(submissionService.getSubmissionById(subId));
    }

    @PostMapping
    public ResponseEntity<SubmissionResponse> createSubmission(
            @RequestBody CreateSubmissionPayload payload,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(submissionService.createSubmission(payload, getUser(principal)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubmissionResponse> updateSubmission(
            @PathVariable String id,
            @RequestBody CreateSubmissionPayload payload,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long subId = Long.parseLong(id.replace("sub-", ""));
        return ResponseEntity.ok(submissionService.updateSubmission(subId, payload, getUser(principal)));
    }

    @PostMapping("/{id}/files")
    public ResponseEntity<SubmissionFile> uploadFile(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file
    ) {
        Long subId = Long.parseLong(id.replace("sub-", ""));
        return ResponseEntity.status(HttpStatus.CREATED).body(submissionService.uploadFile(subId, file));
    }

    @DeleteMapping("/{id}/files/{fileId}")
    public ResponseEntity<Map<String, String>> removeFile(
            @PathVariable String id,
            @PathVariable Long fileId
    ) {
        Long subId = Long.parseLong(id.replace("sub-", ""));
        submissionService.removeFile(subId, fileId);
        return ResponseEntity.ok(Map.of("message", "File removed successfully"));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<SubmissionResponse> submitFinal(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long subId = Long.parseLong(id.replace("sub-", ""));
        return ResponseEntity.ok(submissionService.submitFinal(subId, getUser(principal)));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Map<String, String>> createReview(
            @PathVariable String id,
            @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        request.setSubmissionId(id);
        reviewService.submitReview(request, getUser(principal));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Review recorded successfully"));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewHistoryEntryResponse>> getReviews(@PathVariable String id) {
        Long subId = Long.parseLong(id.replace("sub-", ""));
        return ResponseEntity.ok(reviewService.getSubmissionReviews(subId));
    }
}

