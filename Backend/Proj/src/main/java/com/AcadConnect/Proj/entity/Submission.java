package com.AcadConnect.Proj.entity;

import com.AcadConnect.Proj.enums.SubmissionStatusType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private ProjectGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    private ProjectAssignment assignment;

    @Column(name = "submission_number")
    @Builder.Default
    private Integer submissionNumber = 1;

    @Column(name = "submission_type", length = 50)
    private String submissionType;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "project_file_url", length = 255)
    private String projectFileUrl;

    @Column(name = "project_file_name", length = 255)
    private String projectFileName;

    @Column(name = "synopsis_url", length = 255)
    private String synopsisUrl;

    @Column(name = "synopsis_file_name", length = 255)
    private String synopsisFileName;

    @Column(name = "other_link", length = 255)
    private String otherLink;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "teacher_remarks", columnDefinition = "TEXT")
    private String teacherRemarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private User submittedBy;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    @Column(name = "is_locked")
    @Builder.Default
    private Boolean isLocked = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private SubmissionStatusType status = SubmissionStatusType.SUBMITTED;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubmissionFile> files = new ArrayList<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("reviewedAt DESC")
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        lastUpdatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdatedAt = LocalDateTime.now();
    }
}

