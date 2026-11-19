package com.AcadConnect.Proj.dto.response;

import com.AcadConnect.Proj.enums.AssignmentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AssignmentResponse {
    private String id;
    private String mainGroupId;
    private String title;
    private String description;
    private String deadline;
    private Boolean isLocked;
    private AssignmentStatus status;
    private int totalGroups;
    private int submittedCount;
    private int pendingCount;
    private int lateCount;
    private String createdAt;
}

