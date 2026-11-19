package com.AcadConnect.Proj.entity;

import com.AcadConnect.Proj.enums.RoleType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", length = 30, unique = true, nullable = false)
    private RoleType roleName;

    @Column(length = 255)
    private String description;
}

