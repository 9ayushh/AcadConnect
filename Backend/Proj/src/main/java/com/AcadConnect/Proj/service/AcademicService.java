package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.academic.CreateBatchRequest;
import com.AcadConnect.Proj.dto.request.academic.CreateDepartmentRequest;
import com.AcadConnect.Proj.dto.request.academic.CreateSubjectRequest;
import com.AcadConnect.Proj.dto.response.BatchResponse;
import com.AcadConnect.Proj.dto.response.DepartmentResponse;
import com.AcadConnect.Proj.dto.response.SubjectResponse;
import com.AcadConnect.Proj.entity.AcademicBatch;
import com.AcadConnect.Proj.entity.Department;
import com.AcadConnect.Proj.entity.Subject;
import com.AcadConnect.Proj.exception.DuplicateResourceException;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.repository.AcademicBatchRepository;
import com.AcadConnect.Proj.repository.DepartmentRepository;
import com.AcadConnect.Proj.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final DepartmentRepository departmentRepository;
    private final AcademicBatchRepository batchRepository;
    private final SubjectRepository subjectRepository;

    // --- Departments ---
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapDepartment)
                .collect(Collectors.toList());
    }

    @Transactional
    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.existsByDepartmentCode(request.getDepartmentCode())) {
            throw new DuplicateResourceException("Department with code " + request.getDepartmentCode() + " already exists");
        }
        Department department = Department.builder()
                .departmentName(request.getDepartmentName())
                .departmentCode(request.getDepartmentCode().toUpperCase())
                .description(request.getDescription())
                .status("ACTIVE")
                .build();
        return mapDepartment(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, CreateDepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        dept.setDepartmentName(request.getDepartmentName());
        dept.setDepartmentCode(request.getDepartmentCode().toUpperCase());
        dept.setDescription(request.getDescription());
        return mapDepartment(departmentRepository.save(dept));
    }

    // --- Batches ---
    @Transactional(readOnly = true)
    public List<BatchResponse> getAllBatches() {
        return batchRepository.findAll().stream()
                .map(this::mapBatch)
                .collect(Collectors.toList());
    }

    @Transactional
    public BatchResponse createBatch(CreateBatchRequest request) {
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        AcademicBatch batch = AcademicBatch.builder()
                .batchName(request.getBatchName())
                .startYear(request.getStartYear())
                .endYear(request.getEndYear())
                .department(department)
                .status("ACTIVE")
                .build();
        return mapBatch(batchRepository.save(batch));
    }

    @Transactional
    public BatchResponse updateBatch(Long id, CreateBatchRequest request) {
        AcademicBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id: " + id));
        batch.setBatchName(request.getBatchName());
        batch.setStartYear(request.getStartYear());
        batch.setEndYear(request.getEndYear());
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId()).ifPresent(batch::setDepartment);
        }
        return mapBatch(batchRepository.save(batch));
    }

    // --- Subjects ---
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapSubject)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubjectResponse createSubject(CreateSubjectRequest request) {
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new DuplicateResourceException("Subject code already exists");
        }
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        Subject subject = Subject.builder()
                .subjectName(request.getSubjectName())
                .subjectCode(request.getSubjectCode().toUpperCase())
                .department(department)
                .semester(request.getSemester())
                .description(request.getDescription())
                .build();
        return mapSubject(subjectRepository.save(subject));
    }

    @Transactional
    public SubjectResponse updateSubject(Long id, CreateSubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        subject.setSubjectName(request.getSubjectName());
        subject.setSubjectCode(request.getSubjectCode().toUpperCase());
        subject.setSemester(request.getSemester());
        subject.setDescription(request.getDescription());
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId()).ifPresent(subject::setDepartment);
        }
        return mapSubject(subjectRepository.save(subject));
    }

    private DepartmentResponse mapDepartment(Department d) {
        return DepartmentResponse.builder()
                .id(String.valueOf(d.getId()))
                .departmentName(d.getDepartmentName())
                .departmentCode(d.getDepartmentCode())
                .description(d.getDescription())
                .status(d.getStatus())
                .createdAt(d.getCreatedAt() != null ? d.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }

    private BatchResponse mapBatch(AcademicBatch b) {
        return BatchResponse.builder()
                .id(String.valueOf(b.getId()))
                .batchName(b.getBatchName())
                .startYear(b.getStartYear())
                .endYear(b.getEndYear())
                .departmentId(b.getDepartment() != null ? String.valueOf(b.getDepartment().getId()) : null)
                .departmentName(b.getDepartment() != null ? b.getDepartment().getDepartmentName() : null)
                .status(b.getStatus())
                .build();
    }

    private SubjectResponse mapSubject(Subject s) {
        return SubjectResponse.builder()
                .id(String.valueOf(s.getId()))
                .subjectName(s.getSubjectName())
                .subjectCode(s.getSubjectCode())
                .departmentId(s.getDepartment() != null ? String.valueOf(s.getDepartment().getId()) : null)
                .departmentName(s.getDepartment() != null ? s.getDepartment().getDepartmentName() : null)
                .semester(s.getSemester())
                .description(s.getDescription())
                .build();
    }
}

