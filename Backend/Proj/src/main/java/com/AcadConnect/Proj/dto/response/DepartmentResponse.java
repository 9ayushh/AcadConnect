package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DepartmentResponse {
    private String id;
    private String departmentName;
    private String departmentCode;
    private String description;
    private String status;
    private String createdAt;
}

