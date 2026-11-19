package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnnouncementResponse {
    private String id;
    private String mainGroupId;
    private String title;
    private String content;
    private String authorId;
    private String authorName;
    private String createdAt;
}

