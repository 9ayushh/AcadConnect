package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GroupResponse {
    private String id;
    private String name;
    private String description;
    private String teacherId;
    private String teacherName;
    private String inviteCode;
    private String inviteUrl;
    private boolean isActive;
    private int memberCount;
    private int subgroupCount;
    private String createdAt;
}

