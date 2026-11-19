package com.AcadConnect.Proj.dto.request.communication;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendMessageRequest {
    private String subgroupId;
    private String subgroupName;

    @NotBlank(message = "Message content is required")
    private String content;
}

