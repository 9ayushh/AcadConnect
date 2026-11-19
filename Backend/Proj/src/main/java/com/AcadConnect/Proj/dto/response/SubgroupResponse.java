package com.AcadConnect.Proj.dto.response;

import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubgroupResponse {
    private String id;
    private String mainGroupId;
    private String name;
    private String description;
    private String creatorId;
    private String creatorName;
    private List<SubgroupMemberResponse> members;
    private String assignedProjectId;
    private String projectTitle;
    private SubmissionStatusType submissionStatus;
    private String lastUpdated;
    private String createdAt;
}

