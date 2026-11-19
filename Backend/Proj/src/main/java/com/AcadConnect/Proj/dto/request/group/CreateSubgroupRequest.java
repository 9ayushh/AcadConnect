package com.AcadConnect.Proj.dto.request.group;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSubgroupRequest {

    @NotBlank(message = "Subgroup name is required")
    private String name;

    private String description;

    private String memberEmail1;

    private String memberEmail2;

    private List<String> memberEmails;
}

