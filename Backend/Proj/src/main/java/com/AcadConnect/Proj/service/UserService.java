package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.user.CreateUserRequest;
import com.AcadConnect.Proj.dto.request.user.UpdateStatusRequest;
import com.AcadConnect.Proj.dto.request.user.UpdateUserRequest;
import com.AcadConnect.Proj.dto.response.UserResponse;
import com.AcadConnect.Proj.entity.Department;
import com.AcadConnect.Proj.entity.StudentProfile;
import com.AcadConnect.Proj.entity.TeacherProfile;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.AccountStatus;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.exception.DuplicateResourceException;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.mapper.UserMapper;
import com.AcadConnect.Proj.repository.DepartmentRepository;
import com.AcadConnect.Proj.repository.StudentProfileRepository;
import com.AcadConnect.Proj.repository.TeacherProfileRepository;
import com.AcadConnect.Proj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getStudents() {
        return userRepository.findByRole(RoleType.STUDENT).stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getTeachers() {
        return userRepository.findByRole(RoleType.TEACHER).stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        } else if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            department = departmentRepository.findByDepartmentName(request.getDepartment())
                    .orElseGet(() -> departmentRepository.findByDepartmentCode(request.getDepartment()).orElse(null));
        }

        RoleType role = request.getRole() != null ? request.getRole() : RoleType.STUDENT;
        String rawPassword = request.getPassword() != null && !request.getPassword().isBlank()
                ? request.getPassword() : "Default@123";

        User user = User.builder()
                .fullName(request.getDisplayName())
                .email(request.getEmail().toLowerCase())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .accountStatus(AccountStatus.ACTIVE)
                .department(department)
                .build();

        user = userRepository.save(user);

        if (role == RoleType.STUDENT) {
            String roll = request.getRollNumber() != null && !request.getRollNumber().isBlank()
                    ? request.getRollNumber() : "21CSE" + String.format("%03d", user.getId());
            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .rollNumber(roll)
                    .academicYear("2026-2027")
                    .course("B.Tech CSE")
                    .yearSemester("4th Year / Sem 7")
                    .collegeName("National Institute of Technology")
                    .build();
            studentProfileRepository.save(profile);
            user.setStudentProfile(profile);
        } else if (role == RoleType.TEACHER) {
            TeacherProfile profile = TeacherProfile.builder()
                    .user(user)
                    .employeeNumber("EMP-" + user.getId())
                    .designation("Associate Professor")
                    .collegeName("National Institute of Technology")
                    .build();
            teacherProfileRepository.save(profile);
            user.setTeacherProfile(profile);
        }

        auditLogService.logAction(null, "CREATE_USER", "USER", user.getId(), "User created with role " + role);
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setFullName(request.getName());
        }
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId()).ifPresent(user::setDepartment);
        }

        user = userRepository.save(user);
        auditLogService.logAction(user, "UPDATE_USER", "USER", user.getId(), "User details updated");
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUserStatus(Long id, UpdateStatusRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (request.getStatus() != null) {
            user.setAccountStatus(request.getStatus());
            user = userRepository.save(user);
            auditLogService.logAction(user, "UPDATE_USER_STATUS", "USER", user.getId(), "Account status set to " + request.getStatus());
        }
        return userMapper.toResponse(user);
    }
}

