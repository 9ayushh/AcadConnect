package com.AcadConnect.Proj.dto.response;

import com.AcadConnect.Proj.enums.ResourceType;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResourceResponse {
    private String id;
    private String mainGroupId;
    private String subgroupId;
    private String title;
    private String description;
    private ResourceType type;
    private String url;
    private String sharedById;
    private String sharedByName;
    private String createdAt;
}

