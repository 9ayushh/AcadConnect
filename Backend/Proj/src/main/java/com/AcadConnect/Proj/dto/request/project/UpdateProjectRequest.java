package com.AcadConnect.Proj.dto.request.project;

import com.AcadConnect.Proj.enums.ProjectStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProjectRequest {
    private String title;
    private String abstractText;
    private String description;
    private String synopsis;
    private String githubUrl;
    private String liveDemoUrl;
    private String technologyStack;
    private ProjectStatus projectStatus;
    private Integer progress;
    private LocalDateTime deadline;
}

