package com.AcadConnect.Proj.dto.request.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequest {
    private String name;
    private String fullName;
    private String phone;
    private String department;
    private Long departmentId;
    private String profileImage;
}

