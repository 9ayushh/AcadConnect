package com.AcadConnect.Proj.dto.request.review;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendReminderRequest {
    private String subgroupId;
    private String message;
}

