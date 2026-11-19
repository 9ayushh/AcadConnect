package com.AcadConnect.Proj.dto.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRegisterRequest {

    private String name;

    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String confirmPassword;

    private String rollNumber;

    private String department;

    private String academicYear;

    private String course;

    private String yearSemester;

    private String collegeName;

    private String phone;

    public String getDisplayName() {
        if (name != null && !name.isBlank()) {
            return name;
        }
        if (fullName != null && !fullName.isBlank()) {
            return fullName;
        }
        return email.split("@")[0];
    }
}

