package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.response.AdminDashboardResponse;
import com.AcadConnect.Proj.dto.response.StudentDashboardResponse;
import com.AcadConnect.Proj.dto.response.TeacherDashboardResponse;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    @GetMapping({"/api/student/dashboard", "/api/v1/student/dashboard"})
    public ResponseEntity<StudentDashboardResponse> getStudentDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(getUser(principal)));
    }

    @GetMapping({"/api/teacher/dashboard", "/api/v1/teacher/dashboard"})
    public ResponseEntity<TeacherDashboardResponse> getTeacherDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getTeacherDashboard(getUser(principal)));
    }

    @GetMapping({"/api/admin/dashboard", "/api/v1/admin/dashboard", "/api/reports/dashboard"})
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getAdminDashboard(getUser(principal)));
    }
}

