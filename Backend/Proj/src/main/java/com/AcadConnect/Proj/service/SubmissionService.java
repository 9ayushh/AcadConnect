package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.submission.CreateSubmissionPayload;
import com.AcadConnect.Proj.dto.response.ReviewHistoryEntryResponse;
import com.AcadConnect.Proj.dto.response.SubgroupMemberResponse;
import com.AcadConnect.Proj.dto.response.SubmissionResponse;
import com.AcadConnect.Proj.entity.*;
import com.AcadConnect.Proj.enums.NotificationType;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.exception.BusinessRuleException;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionFileRepository submissionFileRepository;
    private final ProjectRepository projectRepository;
    private final ProjectGroupRepository groupRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissions(User user) {
        if (user.getRole() == RoleType.STUDENT) {
            List<Submission> list = submissionRepository.findSubmissionsByStudentId(user.getId());
            if (list.isEmpty()) {
                list = submissionRepository.findAll();
            }
            return list.stream().map(this::mapSubmission).collect(Collectors.toList());
        } else if (user.getRole() == RoleType.TEACHER) {
            List<Submission> list = submissionRepository.findSubmissionsByTeacherId(user.getId());
            if (list.isEmpty()) {
                list = submissionRepository.findAll();
            }
            return list.stream().map(this::mapSubmission).collect(Collectors.toList());
        }
        return submissionRepository.findAll().stream().map(this::mapSubmission).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionById(Long id) {
        Submission sub = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        return mapSubmission(sub);
    }

    @Transactional
    public SubmissionResponse createSubmission(CreateSubmissionPayload payload, User user) {
        Project project = null;
        if (payload.getProjectId() != null && !payload.getProjectId().isBlank()) {
            try {
                Long pId = Long.parseLong(payload.getProjectId().replace("project-", ""));
                project = projectRepository.findById(pId).orElse(null);
            } catch (Exception ignored) {}
        }
        if (project == null) {
            List<Project> studentProjects = projectRepository.findProjectsByStudentId(user.getId());
            if (!studentProjects.isEmpty()) {
                project = studentProjects.get(0);
            } else {
                project = projectRepository.findAll().stream().findFirst().orElse(null);
            }
        }

        ProjectGroup group = project != null ? project.getGroup() : null;
        if (group == null) {
            List<ProjectGroup> mySubs = groupRepository.findSubgroupsByStudentId(user.getId());
            if (!mySubs.isEmpty()) group = mySubs.get(0);
        }

        Submission submission = Submission.builder()
                .project(project)
                .group(group)
                .title(payload.getTitle() != null ? payload.getTitle() : (project != null ? project.getTitle() : "Project Deliverable"))
                .description(payload.getDescription())
                .githubUrl(payload.getGithubUrl())
                .projectFileUrl(payload.getProjectFileUrl() != null ? payload.getProjectFileUrl() : "/mock-files/project_submission.zip")
                .projectFileName(payload.getProjectFileName() != null ? payload.getProjectFileName() : "project_submission.zip")
                .synopsisUrl(payload.getSynopsisUrl() != null ? payload.getSynopsisUrl() : "/mock-files/synopsis.pdf")
                .synopsisFileName(payload.getSynopsisFileName() != null ? payload.getSynopsisFileName() : "synopsis.pdf")
                .otherLink(payload.getOtherLink())
                .submittedBy(user)
                .submittedAt(LocalDateTime.now())
                .status(SubmissionStatusType.SUBMITTED)
                .isLocked(false)
                .build();

        submission = submissionRepository.save(submission);

        if (group != null) {
            group.setSubmissionStatus(SubmissionStatusType.SUBMITTED);
            groupRepository.save(group);
        }

        // Notify teacher
        if (group != null && group.getParentGroup() != null && group.getParentGroup().getTeacher() != null) {
            notificationService.createNotification(
                    group.getParentGroup().getTeacher(),
                    "New Project Submission",
                    user.getFullName() + " submitted capstone deliverables for " + submission.getTitle(),
                    NotificationType.SUBMISSION,
                    "/teacher/submissions",
                    "SUBMISSION",
                    submission.getId()
            );
        }

        auditLogService.logAction(user, "CREATE_SUBMISSION", "SUBMISSION", submission.getId(), "Deliverables submitted for project");
        return mapSubmission(submission);
    }

    @Transactional
    public SubmissionResponse updateSubmission(Long id, CreateSubmissionPayload payload, User user) {
        Submission sub = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));

        if (Boolean.TRUE.equals(sub.getIsLocked())) {
            throw new BusinessRuleException("This submission has been locked by the teacher and cannot be modified.");
        }

        if (payload.getTitle() != null) sub.setTitle(payload.getTitle());
        if (payload.getDescription() != null) sub.setDescription(payload.getDescription());
        if (payload.getGithubUrl() != null) sub.setGithubUrl(payload.getGithubUrl());
        if (payload.getProjectFileUrl() != null) sub.setProjectFileUrl(payload.getProjectFileUrl());
        if (payload.getProjectFileName() != null) sub.setProjectFileName(payload.getProjectFileName());
        if (payload.getSynopsisUrl() != null) sub.setSynopsisUrl(payload.getSynopsisUrl());
        if (payload.getSynopsisFileName() != null) sub.setSynopsisFileName(payload.getSynopsisFileName());
        if (payload.getOtherLink() != null) sub.setOtherLink(payload.getOtherLink());
        sub.setLastUpdatedAt(LocalDateTime.now());

        sub = submissionRepository.save(sub);
        auditLogService.logAction(user, "UPDATE_SUBMISSION", "SUBMISSION", sub.getId(), "Submission updated");
        return mapSubmission(sub);
    }

    @Transactional
    public SubmissionFile uploadFile(Long submissionId, MultipartFile file) {
        Submission sub = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));

        if (Boolean.TRUE.equals(sub.getIsLocked())) {
            throw new BusinessRuleException("Submission is locked");
        }

        FileStorageService.StorageResult result = fileStorageService.storeFile(file);

        SubmissionFile sf = SubmissionFile.builder()
                .submission(sub)
                .originalFilename(result.getOriginalFilename())
                .storageKey(result.getStorageKey())
                .mimeType(result.getMimeType())
                .sizeBytes(result.getSizeBytes())
                .build();

        return submissionFileRepository.save(sf);
    }

    @Transactional
    public void removeFile(Long submissionId, Long fileId) {
        SubmissionFile sf = submissionFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));

        fileStorageService.deleteFile(sf.getStorageKey());
        submissionFileRepository.delete(sf);
    }

    @Transactional
    public SubmissionResponse submitFinal(Long submissionId, User user) {
        Submission sub = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));

        sub.setStatus(SubmissionStatusType.SUBMITTED);
        sub.setSubmittedAt(LocalDateTime.now());
        sub = submissionRepository.save(sub);

        if (sub.getGroup() != null) {
            sub.getGroup().setSubmissionStatus(SubmissionStatusType.SUBMITTED);
            groupRepository.save(sub.getGroup());
        }

        return mapSubmission(sub);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsByProjectId(Long projectId) {
        return submissionRepository.findByProjectId(projectId).stream()
                .map(this::mapSubmission)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsByAssignmentId(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapSubmission)
                .collect(Collectors.toList());
    }

    public SubmissionResponse mapSubmission(Submission s) {
        List<ReviewHistoryEntryResponse> history = new ArrayList<>();
        if (s.getReviews() != null) {
            history = s.getReviews().stream().map(r -> ReviewHistoryEntryResponse.builder()
                    .id(String.valueOf(r.getId()))
                    .status(r.getReviewStatus())
                    .remarks(r.getFeedback())
                    .reviewerId(String.valueOf(r.getReviewer().getId()))
                    .reviewerName(r.getReviewer().getFullName())
                    .createdAt(r.getReviewedAt() != null ? r.getReviewedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                    .build()).collect(Collectors.toList());
        }

        List<SubgroupMemberResponse> members = new ArrayList<>();
        String subgroupId = null;
        String subgroupName = null;

        if (s.getGroup() != null) {
            subgroupId = String.valueOf(s.getGroup().getId());
            subgroupName = s.getGroup().getGroupName();
            if (s.getGroup().getMembers() != null) {
                for (GroupMember m : s.getGroup().getMembers()) {
                    User u = m.getStudent();
                    StudentProfile sp = u.getStudentProfile();
                    members.add(SubgroupMemberResponse.builder()
                            .id(String.valueOf(m.getId()))
                            .userId(String.valueOf(u.getId()))
                            .name(u.getFullName())
                            .email(u.getEmail())
                            .rollNumber(sp != null ? sp.getRollNumber() : "21CSE00" + u.getId())
                            .department(u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "CSE")
                            .joinedAt(m.getJoinedAt() != null ? m.getJoinedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                            .build());
                }
            }
        }

        return SubmissionResponse.builder()
                .id(String.valueOf(s.getId()))
                .projectId(s.getProject() != null ? String.valueOf(s.getProject().getId()) : null)
                .projectTitle(s.getProject() != null ? s.getProject().getTitle() : s.getTitle())
                .subgroupId(subgroupId != null ? subgroupId : "1")
                .subgroupName(subgroupName != null ? subgroupName : "Team Alpha")
                .assignmentId(s.getAssignment() != null ? String.valueOf(s.getAssignment().getId()) : null)
                .assignmentTitle(s.getAssignment() != null ? s.getAssignment().getTitle() : null)
                .githubUrl(s.getGithubUrl())
                .projectFileUrl(s.getProjectFileUrl())
                .projectFileName(s.getProjectFileName())
                .synopsisUrl(s.getSynopsisUrl())
                .synopsisFileName(s.getSynopsisFileName())
                .otherLink(s.getOtherLink())
                .description(s.getDescription())
                .status(s.getStatus())
                .submittedAt(s.getSubmittedAt() != null ? s.getSubmittedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .lastUpdatedAt(s.getLastUpdatedAt() != null ? s.getLastUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .isLocked(Boolean.TRUE.equals(s.getIsLocked()))
                .teacherRemarks(s.getTeacherRemarks())
                .reviewHistory(history)
                .members(members)
                .build();
    }
}

