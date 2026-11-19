package com.AcadConnect.Proj.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MyGroupResponse {
    private GroupResponse mainGroup;
    private SubgroupResponse subgroup;
    private List<SubgroupResponse> allMySubgroups;
}

