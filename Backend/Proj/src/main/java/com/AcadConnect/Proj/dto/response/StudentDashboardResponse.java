package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentDashboardResponse {
    private Map<String, Object> student;
    private Map<String, Object> group;
    private Map<String, Object> project;
    private Map<String, Object> assignment;
    private Map<String, Object> progress;
    private long unreadNotifications;
}

