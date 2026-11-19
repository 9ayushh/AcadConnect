package com.AcadConnect.Proj.dto.request.submission;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSubmissionPayload {
    private String projectId;
    private String title;
    private String description;
    private String githubUrl;
    private String projectFileUrl;
    private String projectFileName;
    private String synopsisUrl;
    private String synopsisFileName;
    private String otherLink;
}

