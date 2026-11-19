package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.response.AdminDashboardResponse;
import com.AcadConnect.Proj.dto.response.StudentDashboardResponse;
import com.AcadConnect.Proj.dto.response.TeacherDashboardResponse;
import com.AcadConnect.Proj.entity.Project;
import com.AcadConnect.Proj.entity.ProjectAssignment;
import com.AcadConnect.Proj.entity.ProjectGroup;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectGroupRepository groupRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final NotificationRepository notificationRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(User user) {
        List<Project> studentProjects = projectRepository.findProjectsByStudentId(user.getId());
        Project project = !studentProjects.isEmpty() ? studentProjects.get(0) : projectRepository.findAll().stream().findFirst().orElse(null);

        List<ProjectGroup> mySubgroups = groupRepository.findSubgroupsByStudentId(user.getId());
        ProjectGroup subgroup = !mySubgroups.isEmpty() ? mySubgroups.get(0) : null;

        Map<String, Object> studentMap = new HashMap<>();
        studentMap.put("id", user.getId());
        studentMap.put("fullName", user.getFullName());

        Map<String, Object> groupMap = new HashMap<>();
        if (subgroup != null) {
            groupMap.put("id", subgroup.getId());
            groupMap.put("groupName", subgroup.getGroupName());
            groupMap.put("groupStatus", subgroup.getStatus().name());
        } else {
            groupMap.put("id", 1);
            groupMap.put("groupName", "Team Alpha");
            groupMap.put("groupStatus", "ACTIVE");
        }

        Map<String, Object> projectMap = new HashMap<>();
        if (project != null) {
            projectMap.put("id", project.getId());
            projectMap.put("title", project.getTitle());
            projectMap.put("projectStatus", project.getProjectStatus().name());
        } else {
            projectMap.put("id", 1);
            projectMap.put("title", "Campus Management & Project Portal");
            projectMap.put("projectStatus", "IN_PROGRESS");
        }

        Map<String, Object> assignmentMap = new HashMap<>();
        assignmentMap.put("deadline", project != null && project.getDeadline() != null
                ? project.getDeadline().format(DateTimeFormatter.ISO_DATE_TIME) : "2026-12-10T23:59:00");

        Map<String, Object> progressMap = new HashMap<>();
        progressMap.put("percentage", project != null ? project.getProgress() : 40);
        progressMap.put("nextAction", "UPLOAD_SYNOPSIS");

        long unread = notificationRepository.countByRecipientIdAndIsReadFalse(user.getId());

        return StudentDashboardResponse.builder()
                .student(studentMap)
                .group(groupMap)
                .project(projectMap)
                .assignment(assignmentMap)
                .progress(progressMap)
                .unreadNotifications(unread)
                .build();
    }

    @Transactional(readOnly = true)
    public TeacherDashboardResponse getTeacherDashboard(User user) {
        Map<String, Object> teacherMap = new HashMap<>();
        teacherMap.put("id", user.getId());
        teacherMap.put("fullName", user.getFullName());

        List<ProjectGroup> groups = groupRepository.findByTeacherId(user.getId());
        int assignedGroups = groups.size();

        long pendingReviews = submissionRepository.findByStatus(SubmissionStatusType.SUBMITTED).size();
        List<ProjectAssignment> assignments = assignmentRepository.findByTeacherId(user.getId());

        List<Map<String, Object>> recentSubmissions = new ArrayList<>();
        submissionRepository.findAll().stream().limit(5).forEach(s -> {
            Map<String, Object> subMap = new HashMap<>();
            subMap.put("id", s.getId());
            subMap.put("title", s.getTitle());
            subMap.put("status", s.getStatus());
            subMap.put("submittedAt", s.getSubmittedAt());
            recentSubmissions.add(subMap);
        });

        return TeacherDashboardResponse.builder()
                .teacher(teacherMap)
                .assignedGroupsCount(assignedGroups)
                .pendingReviewsCount((int) pendingReviews)
                .activeAssignmentsCount(assignments.size())
                .recentSubmissions(recentSubmissions)
                .upcomingDeadlines(Collections.emptyList())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard(User user) {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.findByRole(RoleType.STUDENT).size();
        long totalTeachers = userRepository.findByRole(RoleType.TEACHER).size();
        long totalDepts = departmentRepository.count();
        long activeAssignments = assignmentRepository.count();
        long totalGroups = groupRepository.count();
        long totalSubmissions = submissionRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("totalDepartments", totalDepts);
        stats.put("activeAssignments", activeAssignments);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalDepartments(totalDepts)
                .activeAssignments(activeAssignments)
                .totalGroups(totalGroups)
                .totalSubmissions(totalSubmissions)
                .stats(stats)
                .build();
    }
}

