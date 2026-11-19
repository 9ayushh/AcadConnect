package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TeacherDashboardResponse {
    private Map<String, Object> teacher;
    private int assignedGroupsCount;
    private int pendingReviewsCount;
    private int activeAssignmentsCount;
    private List<Map<String, Object>> recentSubmissions;
    private List<Map<String, Object>> upcomingDeadlines;
}

