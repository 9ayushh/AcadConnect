package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubgroupMessageResponse {
    private String id;
    private String mainGroupId;
    private String subgroupId;
    private String subgroupName;
    private String senderId;
    private String senderName;
    private String content;
    private String createdAt;
}

