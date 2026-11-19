package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubgroupMemberResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String rollNumber;
    private String department;
    private String joinedAt;
}

