package com.AcadConnect.Proj.mapper;

import com.AcadConnect.Proj.dto.response.UserResponse;
import com.AcadConnect.Proj.entity.StudentProfile;
import com.AcadConnect.Proj.entity.TeacherProfile;
import com.AcadConnect.Proj.entity.User;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        UserResponse.UserResponseBuilder builder = UserResponse.builder()
                .id(String.valueOf(user.getId()))
                .name(user.getFullName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .accountStatus(user.getAccountStatus())
                .profileImage(user.getProfileImage())
                .avatarUrl(user.getProfileImage())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null);

        if (user.getDepartment() != null) {
            builder.department(user.getDepartment().getDepartmentName());
        }

        StudentProfile sp = user.getStudentProfile();
        if (sp != null) {
            builder.rollNumber(sp.getRollNumber())
                    .academicYear(sp.getAcademicYear())
                    .course(sp.getCourse())
                    .yearSemester(sp.getYearSemester())
                    .collegeName(sp.getCollegeName());
            if (user.getDepartment() == null && sp.getBatch() != null && sp.getBatch().getDepartment() != null) {
                builder.department(sp.getBatch().getDepartment().getDepartmentName());
            }
        }

        TeacherProfile tp = user.getTeacherProfile();
        if (tp != null) {
            builder.collegeName(tp.getCollegeName());
        }

        return builder.build();
    }
}

