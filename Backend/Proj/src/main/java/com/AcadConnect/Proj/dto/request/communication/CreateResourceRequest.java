package com.AcadConnect.Proj.dto.request.communication;

import com.AcadConnect.Proj.enums.ResourceType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateResourceRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Builder.Default
    private ResourceType type = ResourceType.OTHER;

    @NotBlank(message = "URL is required")
    private String url;

    private String subgroupId;
}

