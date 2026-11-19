package com.AcadConnect.Proj.dto.request.group;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGroupRequest {

    @NotBlank(message = "Group name is required")
    private String name;

    private String description;

    private Long subjectId;

    private Long batchId;

    private Long teacherId;

    private Long assignmentId;

    private Long leaderStudentId;

    private List<Long> studentIds;
}

