package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectResponse {
    private String id;
    private String title;
    private String description;
    private List<String> requirements;
    private String teacherId;
    private String teacherName;
    private String mainGroupId;
    private String mainGroupName;
    private String subgroupId;
    private String subgroupName;
    private String status;
    private int progress;
    private String deadline;
    private List<MilestoneResponse> milestones;
    private String githubUrl;
    private String liveDemoUrl;
    private String technologyStack;
    private String createdAt;
}

