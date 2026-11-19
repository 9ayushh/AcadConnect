package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.auth.ForgotPasswordRequest;
import com.AcadConnect.Proj.dto.request.auth.LoginRequest;
import com.AcadConnect.Proj.dto.request.auth.ResetPasswordRequest;
import com.AcadConnect.Proj.dto.request.auth.StudentRegisterRequest;
import com.AcadConnect.Proj.dto.response.ApiResponse;
import com.AcadConnect.Proj.dto.response.LoginResponse;
import com.AcadConnect.Proj.dto.response.UserResponse;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth", "/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping({"/register", "/register/student"})
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody StudentRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerStudent(request));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, UserResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserResponse user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(Map.of("user", user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.refreshToken(principal));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password recovery instructions sent if account exists"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}

