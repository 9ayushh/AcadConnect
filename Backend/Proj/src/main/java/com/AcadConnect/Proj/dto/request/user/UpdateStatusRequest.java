package com.AcadConnect.Proj.dto.request.user;

import com.AcadConnect.Proj.enums.AccountStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStatusRequest {
    private AccountStatus status;
}

