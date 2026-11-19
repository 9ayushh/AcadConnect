package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.academic.CreateBatchRequest;
import com.AcadConnect.Proj.dto.request.academic.CreateDepartmentRequest;
import com.AcadConnect.Proj.dto.request.academic.CreateSubjectRequest;
import com.AcadConnect.Proj.dto.response.BatchResponse;
import com.AcadConnect.Proj.dto.response.DepartmentResponse;
import com.AcadConnect.Proj.dto.response.SubjectResponse;
import com.AcadConnect.Proj.service.AcademicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;

    // --- Departments ---
    @GetMapping({"/api/admin/departments", "/api/departments", "/api/v1/departments", "/admin/departments"})
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(academicService.getAllDepartments());
    }

    @PostMapping({"/api/admin/departments", "/api/departments", "/api/v1/departments", "/admin/departments"})
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(academicService.createDepartment(request));
    }

    @PutMapping({"/api/admin/departments/{id}", "/api/departments/{id}", "/api/v1/departments/{id}"})
    public ResponseEntity<DepartmentResponse> updateDepartment(@PathVariable Long id, @Valid @RequestBody CreateDepartmentRequest request) {
        return ResponseEntity.ok(academicService.updateDepartment(id, request));
    }

    // --- Batches ---
    @GetMapping({"/api/batches", "/api/v1/batches"})
    public ResponseEntity<List<BatchResponse>> getBatches() {
        return ResponseEntity.ok(academicService.getAllBatches());
    }

    @PostMapping({"/api/batches", "/api/v1/batches"})
    public ResponseEntity<BatchResponse> createBatch(@Valid @RequestBody CreateBatchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(academicService.createBatch(request));
    }

    @PutMapping({"/api/batches/{id}", "/api/v1/batches/{id}"})
    public ResponseEntity<BatchResponse> updateBatch(@PathVariable Long id, @Valid @RequestBody CreateBatchRequest request) {
        return ResponseEntity.ok(academicService.updateBatch(id, request));
    }

    // --- Subjects ---
    @GetMapping({"/api/subjects", "/api/v1/subjects"})
    public ResponseEntity<List<SubjectResponse>> getSubjects() {
        return ResponseEntity.ok(academicService.getAllSubjects());
    }

    @PostMapping({"/api/subjects", "/api/v1/subjects"})
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(academicService.createSubject(request));
    }

    @PutMapping({"/api/subjects/{id}", "/api/v1/subjects/{id}"})
    public ResponseEntity<SubjectResponse> updateSubject(@PathVariable Long id, @Valid @RequestBody CreateSubjectRequest request) {
        return ResponseEntity.ok(academicService.updateSubject(id, request));
    }
}

