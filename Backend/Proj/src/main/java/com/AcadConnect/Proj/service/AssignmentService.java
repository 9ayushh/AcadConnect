package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.assignment.CreateAssignmentRequest;
import com.AcadConnect.Proj.dto.response.AssignmentResponse;
import com.AcadConnect.Proj.dto.response.SubgroupResponse;
import com.AcadConnect.Proj.entity.ProjectAssignment;
import com.AcadConnect.Proj.entity.ProjectGroup;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.AssignmentStatus;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.repository.ProjectAssignmentRepository;
import com.AcadConnect.Proj.repository.ProjectGroupRepository;
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
public class AssignmentService {

    private final ProjectAssignmentRepository assignmentRepository;
    private final ProjectGroupRepository groupRepository;
    private final SubmissionRepository submissionRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByGroupId(Long groupId) {
        return assignmentRepository.findByMainGroupId(groupId).stream()
                .map(this::mapAssignment)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::mapAssignment)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(Long id) {
        ProjectAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        return mapAssignment(assignment);
    }

    @Transactional
    public AssignmentResponse createAssignment(Long mainGroupId, CreateAssignmentRequest request, User teacher) {
        ProjectGroup mainGroup = null;
        if (mainGroupId != null) {
            mainGroup = groupRepository.findById(mainGroupId).orElse(null);
        }

        LocalDateTime deadline = null;
        if (request.getDeadlineDate() != null) {
            deadline = request.getDeadlineDate();
        } else if (request.getDeadline() != null && !request.getDeadline().isBlank()) {
            try {
                deadline = LocalDateTime.parse(request.getDeadline(), DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception e) {
                deadline = LocalDateTime.now().plusWeeks(2);
            }
        } else {
            deadline = LocalDateTime.now().plusWeeks(2);
        }

        ProjectAssignment assignment = ProjectAssignment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(deadline)
                .startDate(LocalDateTime.now())
                .teacher(teacher)
                .mainGroup(mainGroup)
                .groupSizeMin(request.getGroupSizeMin() != null ? request.getGroupSizeMin() : 1)
                .groupSizeMax(request.getGroupSizeMax() != null ? request.getGroupSizeMax() : 3)
                .allowLateSubmission(Boolean.TRUE.equals(request.getAllowLateSubmission()))
                .isLocked(false)
                .status(AssignmentStatus.OPEN)
                .build();

        assignment = assignmentRepository.save(assignment);
        auditLogService.logAction(teacher, "CREATE_ASSIGNMENT", "ASSIGNMENT", assignment.getId(), "Assignment created: " + assignment.getTitle());
        return mapAssignment(assignment);
    }

    @Transactional
    public AssignmentResponse updateAssignment(Long id, CreateAssignmentRequest request) {
        ProjectAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        if (request.getDeadlineDate() != null) {
            assignment.setDeadline(request.getDeadlineDate());
        } else if (request.getDeadline() != null && !request.getDeadline().isBlank()) {
            try {
                assignment.setDeadline(LocalDateTime.parse(request.getDeadline(), DateTimeFormatter.ISO_DATE_TIME));
            } catch (Exception ignored) {}
        }
        if (request.getGroupSizeMin() != null) assignment.setGroupSizeMin(request.getGroupSizeMin());
        if (request.getGroupSizeMax() != null) assignment.setGroupSizeMax(request.getGroupSizeMax());
        if (request.getAllowLateSubmission() != null) assignment.setAllowLateSubmission(request.getAllowLateSubmission());

        return mapAssignment(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentResponse toggleLock(Long id) {
        ProjectAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        boolean newLock = !Boolean.TRUE.equals(assignment.getIsLocked());
        assignment.setIsLocked(newLock);
        assignment.setStatus(newLock ? AssignmentStatus.LOCKED : AssignmentStatus.OPEN);

        return mapAssignment(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentResponse updateStatus(Long id, AssignmentStatus status) {
        ProjectAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        assignment.setStatus(status);
        return mapAssignment(assignmentRepository.save(assignment));
    }

    public AssignmentResponse mapAssignment(ProjectAssignment a) {
        int totalSubgroups = 0;
        int submitted = 0;
        int pending = 0;
        int late = 0;

        if (a.getMainGroup() != null) {
            List<ProjectGroup> subs = groupRepository.findByParentGroupId(a.getMainGroup().getId());
            totalSubgroups = subs.size();
            for (ProjectGroup sub : subs) {
                if (sub.getSubmissionStatus() == SubmissionStatusType.SUBMITTED
                        || sub.getSubmissionStatus() == SubmissionStatusType.ACCEPTED
                        || sub.getSubmissionStatus() == SubmissionStatusType.APPROVED
                        || sub.getSubmissionStatus() == SubmissionStatusType.UNDER_REVIEW) {
                    submitted++;
                } else if (sub.getSubmissionStatus() == SubmissionStatusType.LATE) {
                    late++;
                } else {
                    pending++;
                }
            }
        }

        return AssignmentResponse.builder()
                .id(String.valueOf(a.getId()))
                .mainGroupId(a.getMainGroup() != null ? String.valueOf(a.getMainGroup().getId()) : null)
                .title(a.getTitle())
                .description(a.getDescription())
                .deadline(a.getDeadline() != null ? a.getDeadline().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .isLocked(Boolean.TRUE.equals(a.getIsLocked()))
                .status(a.getStatus())
                .totalGroups(totalSubgroups)
                .submittedCount(submitted)
                .pendingCount(pending)
                .lateCount(late)
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }
}

