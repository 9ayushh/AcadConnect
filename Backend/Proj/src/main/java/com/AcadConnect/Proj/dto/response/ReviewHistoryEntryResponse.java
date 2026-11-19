package com.AcadConnect.Proj.dto.response;

import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewHistoryEntryResponse {
    private String id;
    private SubmissionStatusType status;
    private String remarks;
    private String reviewerId;
    private String reviewerName;
    private String createdAt;
}

