package com.AcadConnect.Proj.dto.request.group;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InviteMemberRequest {
    private Long studentId;
    private String email;
}

