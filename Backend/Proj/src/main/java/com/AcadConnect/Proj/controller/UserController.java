package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.user.CreateUserRequest;
import com.AcadConnect.Proj.dto.request.user.UpdateStatusRequest;
import com.AcadConnect.Proj.dto.request.user.UpdateUserRequest;
import com.AcadConnect.Proj.dto.response.UserResponse;
import com.AcadConnect.Proj.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping({"/api/admin/users", "/api/users", "/api/v1/users", "/admin/users"})
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping({"/api/admin/users/{id}", "/api/users/{id}", "/api/v1/users/{id}"})
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping({"/api/admin/users", "/api/users", "/api/v1/users", "/admin/users"})
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @PutMapping({"/api/admin/users/{id}", "/api/users/{id}", "/api/v1/users/{id}"})
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PatchMapping({"/api/admin/users/{id}/status", "/api/users/{id}/status", "/api/v1/users/{id}/status"})
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(userService.updateUserStatus(id, request));
    }

    @GetMapping({"/api/users/students", "/api/v1/users/students"})
    public ResponseEntity<List<UserResponse>> getStudents() {
        return ResponseEntity.ok(userService.getStudents());
    }

    @GetMapping({"/api/users/teachers", "/api/v1/users/teachers"})
    public ResponseEntity<List<UserResponse>> getTeachers() {
        return ResponseEntity.ok(userService.getTeachers());
    }
}

