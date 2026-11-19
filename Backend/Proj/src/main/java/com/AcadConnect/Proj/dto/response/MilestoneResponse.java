package com.AcadConnect.Proj.dto.response;

import com.AcadConnect.Proj.enums.MilestoneStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MilestoneResponse {
    private String id;
    private String title;
    private String description;
    private String dueDate;
    private MilestoneStatus status;
    private int order;
}

