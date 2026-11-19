package com.AcadConnect.Proj.dto.request.review;

import com.AcadConnect.Proj.enums.SubmissionStatusType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReviewRequest {
    private String submissionId;
    private SubmissionStatusType status;
    private String remarks;
    private BigDecimal score;
}

