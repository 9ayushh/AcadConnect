package com.AcadConnect.Proj.dto.request.user;

import com.AcadConnect.Proj.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {

    private String name;

    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String password;

    private RoleType role;

    private String department;

    private Long departmentId;

    private String rollNumber;

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

