package com.AcadConnect.Proj.dto.response;

import com.AcadConnect.Proj.enums.AccountStatus;
import com.AcadConnect.Proj.enums.RoleType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private String id;
    private String name;
    private String fullName;
    private String email;
    private RoleType role;
    private String rollNumber;
    private String department;
    private String academicYear;
    private String course;
    private String yearSemester;
    private String collegeName;
    private String avatarUrl;
    private String profileImage;
    private AccountStatus accountStatus;
    private String createdAt;
}

