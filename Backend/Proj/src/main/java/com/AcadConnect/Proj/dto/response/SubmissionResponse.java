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
public class SubmissionResponse {
    private String id;
    private String projectId;
    private String projectTitle;
    private String subgroupId;
    private String subgroupName;
    private String assignmentId;
    private String assignmentTitle;
    private String githubUrl;
    private String projectFileUrl;
    private String projectFileName;
    private String synopsisUrl;
    private String synopsisFileName;
    private String otherLink;
    private String description;
    private SubmissionStatusType status;
    private String submittedAt;
    private String lastUpdatedAt;
    private Boolean isLocked;
    private String teacherRemarks;
    private List<ReviewHistoryEntryResponse> reviewHistory;
    private List<SubgroupMemberResponse> members;
}

