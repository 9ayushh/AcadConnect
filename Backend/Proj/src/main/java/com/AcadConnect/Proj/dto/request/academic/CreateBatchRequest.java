package com.AcadConnect.Proj.dto.request.academic;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBatchRequest {

    @NotBlank(message = "Batch name is required")
    private String batchName;

    private Integer startYear;

    private Integer endYear;

    private Long departmentId;
}

