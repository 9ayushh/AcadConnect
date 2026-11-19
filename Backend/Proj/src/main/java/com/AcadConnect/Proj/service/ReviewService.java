package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.review.CreateReviewRequest;
import com.AcadConnect.Proj.dto.request.review.SendReminderRequest;
import com.AcadConnect.Proj.dto.response.ReviewHistoryEntryResponse;
import com.AcadConnect.Proj.dto.response.SubmissionResponse;
import com.AcadConnect.Proj.entity.*;
import com.AcadConnect.Proj.enums.NotificationType;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.exception.UnauthorizedAccessException;
import com.AcadConnect.Proj.repository.ProjectGroupRepository;
import com.AcadConnect.Proj.repository.ReviewRepository;
import com.AcadConnect.Proj.repository.SubgroupMessageRepository;
import com.AcadConnect.Proj.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final SubmissionRepository submissionRepository;
    private final ProjectGroupRepository groupRepository;
    private final SubgroupMessageRepository subgroupMessageRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final SubmissionService submissionService;

    @Transactional
    public void submitReview(CreateReviewRequest request, User teacher) {
        if (teacher.getRole() != RoleType.TEACHER && teacher.getRole() != RoleType.ADMIN) {
            throw new UnauthorizedAccessException("Only teachers or administrators can evaluate submissions");
        }

        Long subId = Long.parseLong(request.getSubmissionId().replace("sub-", ""));
        Submission submission = submissionRepository.findById(subId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + request.getSubmissionId()));

        SubmissionStatusType status = request.getStatus() != null ? request.getStatus() : SubmissionStatusType.UNDER_REVIEW;
        submission.setStatus(status);
        submission.setTeacherRemarks(request.getRemarks());

        Review review = Review.builder()
                .submission(submission)
                .reviewer(teacher)
                .score(request.getScore())
                .feedback(request.getRemarks())
                .reviewStatus(status)
                .reviewedAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);
        submission.getReviews().add(0, review);
        submissionRepository.save(submission);

        // Update subgroup status as well
        if (submission.getGroup() != null) {
            submission.getGroup().setSubmissionStatus(status);
            groupRepository.save(submission.getGroup());

            // Notify each member of the subgroup
            if (submission.getGroup().getMembers() != null) {
                for (GroupMember member : submission.getGroup().getMembers()) {
                    notificationService.createNotification(
                            member.getStudent(),
                            "Submission Status: " + status,
                            teacher.getFullName() + " marked your submission as " + status + ": " + (request.getRemarks() != null ? request.getRemarks() : ""),
                            NotificationType.REVIEW,
                            "/student/feedback",
                            "SUBMISSION",
                            submission.getId()
                    );
                }
            }
        }

        auditLogService.logAction(teacher, "SUBMIT_REVIEW", "SUBMISSION", submission.getId(), "Review added with status " + status);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getPendingReviews(User teacher) {
        List<Submission> list = submissionRepository.findSubmissionsByTeacherIdAndStatus(teacher.getId(), SubmissionStatusType.SUBMITTED);
        if (list.isEmpty()) {
            list = submissionRepository.findByStatus(SubmissionStatusType.SUBMITTED);
        }
        return list.stream().map(submissionService::mapSubmission).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewHistoryEntryResponse> getSubmissionReviews(Long submissionId) {
        return reviewRepository.findBySubmissionIdOrderByReviewedAtDesc(submissionId).stream()
                .map(r -> ReviewHistoryEntryResponse.builder()
                        .id(String.valueOf(r.getId()))
                        .status(r.getReviewStatus())
                        .remarks(r.getFeedback())
                        .reviewerId(String.valueOf(r.getReviewer().getId()))
                        .reviewerName(r.getReviewer().getFullName())
                        .createdAt(r.getReviewedAt() != null ? r.getReviewedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void sendReminder(SendReminderRequest request, User teacher) {
        Long sId = Long.parseLong(request.getSubgroupId().replace("subgroup-", ""));
        ProjectGroup subgroup = groupRepository.findById(sId)
                .orElseThrow(() -> new ResourceNotFoundException("Subgroup not found with id: " + request.getSubgroupId()));

        String msgText = request.getMessage() != null && !request.getMessage().isBlank()
                ? request.getMessage() : "Reminder: Your assignment submission is pending or due soon. Please review deliverables.";

        SubgroupMessage msg = SubgroupMessage.builder()
                .mainGroup(subgroup.getParentGroup())
                .subgroup(subgroup)
                .subgroupName(subgroup.getGroupName())
                .sender(teacher)
                .content(msgText)
                .build();

        subgroupMessageRepository.save(msg);

        // Notify subgroup members
        if (subgroup.getMembers() != null) {
            for (GroupMember member : subgroup.getMembers()) {
                notificationService.createNotification(
                        member.getStudent(),
                        "Teacher Reminder",
                        teacher.getFullName() + ": " + msgText,
                        NotificationType.REMINDER,
                        "/student/submissions",
                        "SUBGROUP",
                        subgroup.getId()
                );
            }
        }

        auditLogService.logAction(teacher, "SEND_REMINDER", "SUBGROUP", subgroup.getId(), "Reminder sent to subgroup");
    }
}

