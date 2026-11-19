package com.AcadConnect.Proj.entity;

import com.AcadConnect.Proj.enums.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private AcademicBatch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_group_id")
    private ProjectGroup mainGroup;

    @Column(name = "group_size_min")
    @Builder.Default
    private Integer groupSizeMin = 1;

    @Column(name = "group_size_max")
    @Builder.Default
    private Integer groupSizeMax = 3;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    private LocalDateTime deadline;

    @Column(name = "allow_late_submission")
    @Builder.Default
    private Boolean allowLateSubmission = false;

    @Column(name = "is_locked")
    @Builder.Default
    private Boolean isLocked = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.OPEN;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

