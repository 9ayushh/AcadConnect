package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BatchResponse {
    private String id;
    private String batchName;
    private Integer startYear;
    private Integer endYear;
    private String departmentId;
    private String departmentName;
    private String status;
}

