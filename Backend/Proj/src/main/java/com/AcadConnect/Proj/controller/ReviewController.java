package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.review.CreateReviewRequest;
import com.AcadConnect.Proj.dto.request.review.SendReminderRequest;
import com.AcadConnect.Proj.dto.response.SubmissionResponse;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/reviews", "/api/v1/reviews", "/reviews"})
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submitReview(
            @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        reviewService.submitReview(request, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Review recorded successfully"));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<SubmissionResponse>> getPendingReviews(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(reviewService.getPendingReviews(getUser(principal)));
    }

    @PostMapping("/send-reminder")
    public ResponseEntity<Map<String, String>> sendReminder(
            @RequestBody SendReminderRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        reviewService.sendReminder(request, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Reminder sent to subgroup"));
    }
}

