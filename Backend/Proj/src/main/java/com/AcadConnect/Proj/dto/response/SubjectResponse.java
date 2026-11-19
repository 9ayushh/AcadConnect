package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubjectResponse {
    private String id;
    private String subjectName;
    private String subjectCode;
    private String departmentId;
    private String departmentName;
    private Integer semester;
    private String description;
}

