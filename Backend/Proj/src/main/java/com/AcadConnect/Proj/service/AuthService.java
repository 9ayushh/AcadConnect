package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.auth.ForgotPasswordRequest;
import com.AcadConnect.Proj.dto.request.auth.LoginRequest;
import com.AcadConnect.Proj.dto.request.auth.ResetPasswordRequest;
import com.AcadConnect.Proj.dto.request.auth.StudentRegisterRequest;
import com.AcadConnect.Proj.dto.response.LoginResponse;
import com.AcadConnect.Proj.dto.response.UserResponse;
import com.AcadConnect.Proj.entity.Department;
import com.AcadConnect.Proj.entity.StudentProfile;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.enums.AccountStatus;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.exception.DuplicateResourceException;
import com.AcadConnect.Proj.exception.InvalidRequestException;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.mapper.UserMapper;
import com.AcadConnect.Proj.repository.DepartmentRepository;
import com.AcadConnect.Proj.repository.StudentProfileRepository;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.JwtTokenProvider;
import com.AcadConnect.Proj.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final AuditLogService auditLogService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getAccountStatus() == AccountStatus.INACTIVE) {
            throw new InvalidRequestException("Account is inactive. Please contact your administrator.");
        }
        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new InvalidRequestException("Account has been suspended.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        UserResponse userResponse = userMapper.toResponse(user);

        auditLogService.logAction(user, "LOGIN", "USER", user.getId(), "User logged in successfully");

        return LoginResponse.builder()
                .user(userResponse)
                .token(token)
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }

    @Transactional
    public LoginResponse registerStudent(StudentRegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        if (request.getRollNumber() != null && !request.getRollNumber().isBlank()
                && studentProfileRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("A student with this roll number already exists");
        }

        Department department = null;
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            department = departmentRepository.findByDepartmentName(request.getDepartment())
                    .orElseGet(() -> departmentRepository.findByDepartmentCode(request.getDepartment()).orElse(null));
        }

        User user = User.builder()
                .fullName(request.getDisplayName())
                .email(request.getEmail().toLowerCase())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.STUDENT)
                .accountStatus(AccountStatus.ACTIVE)
                .department(department)
                .build();

        user = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .rollNumber(request.getRollNumber() != null ? request.getRollNumber() : "ROLL-" + user.getId())
                .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : "2026-2027")
                .course(request.getCourse() != null ? request.getCourse() : "B.Tech Computer Science")
                .yearSemester(request.getYearSemester() != null ? request.getYearSemester() : "4th Year / Sem 7")
                .collegeName(request.getCollegeName() != null ? request.getCollegeName() : "National Institute of Technology")
                .build();

        studentProfileRepository.save(profile);
        user.setStudentProfile(profile);

        String token = tokenProvider.generateTokenForUser(user.getId(), user.getEmail(), user.getRole().name(), user.getFullName());
        UserResponse userResponse = userMapper.toResponse(user);

        auditLogService.logAction(user, "REGISTER", "USER", user.getId(), "Student self-registered");

        return LoginResponse.builder()
                .user(userResponse)
                .token(token)
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(user);
    }

    public LoginResponse refreshToken(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String token = tokenProvider.generateTokenForUser(user.getId(), user.getEmail(), user.getRole().name(), user.getFullName());
        return LoginResponse.builder()
                .user(userMapper.toResponse(user))
                .token(token)
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        // As per §6.1: success message that does not reveal whether email exists
        userRepository.findByEmailIgnoreCase(request.getEmail()).ifPresent(u -> {
            auditLogService.logAction(u, "FORGOT_PASSWORD_REQUEST", "USER", u.getId(), "Password reset requested");
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!tokenProvider.validateToken(request.getToken())) {
            throw new InvalidRequestException("Invalid or expired password reset token");
        }
        String email = tokenProvider.getEmailFromToken(request.getToken());
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        auditLogService.logAction(user, "RESET_PASSWORD", "USER", user.getId(), "Password was reset");
    }
}

