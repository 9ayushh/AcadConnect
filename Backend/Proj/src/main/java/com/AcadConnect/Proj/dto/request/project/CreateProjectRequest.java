package com.AcadConnect.Proj.dto.request.project;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String abstractText;

    private String description;

    private String synopsis;

    private String githubUrl;

    private String liveDemoUrl;

    private String technologyStack;

    private Long groupId;

    private String subgroupId;

    private LocalDateTime deadline;

    private List<String> requirements;
}

