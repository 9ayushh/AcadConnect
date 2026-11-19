package com.AcadConnect.Proj.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "roll_number", length = 50, unique = true, nullable = false)
    private String rollNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id")
    private AcademicBatch batch;

    private Integer semester;

    @Column(name = "enrollment_year")
    private Integer enrollmentYear;

    @Column(name = "academic_year", length = 50)
    private String academicYear;

    @Column(length = 100)
    private String course;

    @Column(name = "year_semester", length = 50)
    private String yearSemester;

    @Column(name = "college_name", length = 200)
    private String collegeName;
}

