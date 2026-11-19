package com.AcadConnect.Proj.dto.request.assignment;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAssignmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String deadline;

    private LocalDateTime deadlineDate;

    private Long subjectId;

    private Long batchId;

    private Integer groupSizeMin;

    private Integer groupSizeMax;

    private Boolean allowLateSubmission;
}

