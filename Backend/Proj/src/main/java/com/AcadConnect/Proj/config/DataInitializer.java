package com.AcadConnect.Proj.config;

import com.AcadConnect.Proj.entity.*;
import com.AcadConnect.Proj.enums.*;
import com.AcadConnect.Proj.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicBatchRepository batchRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ProjectGroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ProjectAssignmentRepository assignmentRepository;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final SubmissionRepository submissionRepository;
    private final ReviewRepository reviewRepository;
    private final AnnouncementRepository announcementRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0 && userRepository.count() > 0) {
            log.info("Database already initialized.");
            return;
        }

        log.info("Initializing AcadConnect platform data...");

        // 1. Roles
        Role adminRole = roleRepository.save(Role.builder().roleName(RoleType.ADMIN).description("Platform Administrator").build());
        Role teacherRole = roleRepository.save(Role.builder().roleName(RoleType.TEACHER).description("Academic Instructor").build());
        Role studentRole = roleRepository.save(Role.builder().roleName(RoleType.STUDENT).description("Student").build());

        // 2. Departments
        Department cseDept = departmentRepository.save(Department.builder()
                .departmentName("Computer Science & Engineering")
                .departmentCode("CSE")
                .description("Department of Computer Science and Engineering")
                .status("ACTIVE")
                .build());

        Department itDept = departmentRepository.save(Department.builder()
                .departmentName("Information Technology")
                .departmentCode("IT")
                .description("Department of Information Technology")
                .status("ACTIVE")
                .build());

        Department adminDept = departmentRepository.save(Department.builder()
                .departmentName("Central Administration")
                .departmentCode("ADMIN")
                .description("Central Academic Administration")
                .status("ACTIVE")
                .build());

        // 3. Batches
        AcademicBatch batch2026 = batchRepository.save(AcademicBatch.builder()
                .batchName("2023-2027 CSE Batch")
                .startYear(2023)
                .endYear(2027)
                .department(cseDept)
                .status("ACTIVE")
                .build());

        // 4. Subjects
        Subject capstoneSubject = subjectRepository.save(Subject.builder()
                .subjectName("Major Capstone Project")
                .subjectCode("CS401")
                .department(cseDept)
                .semester(7)
                .description("Senior year academic capstone project")
                .build());

        String defaultPass = passwordEncoder.encode("password123");

        // 5. Users
        // Admin
        User admin = userRepository.save(User.builder()
                .fullName("System Administrator")
                .email("admin@example.com")
                .password(defaultPass)
                .role(RoleType.ADMIN)
                .department(adminDept)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        // Teacher 1
        User teacher1 = userRepository.save(User.builder()
                .fullName("Dr. Rajesh Kumar")
                .email("teacher@example.com")
                .password(defaultPass)
                .role(RoleType.TEACHER)
                .department(cseDept)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        teacherProfileRepository.save(TeacherProfile.builder()
                .user(teacher1)
                .employeeNumber("EMP-101")
                .designation("Professor & Project Coordinator")
                .collegeName("National Institute of Technology")
                .build());

        // Teacher 2
        User teacher2 = userRepository.save(User.builder()
                .fullName("Prof. Sneha Verma")
                .email("teacher2@example.com")
                .password(defaultPass)
                .role(RoleType.TEACHER)
                .department(itDept)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        teacherProfileRepository.save(TeacherProfile.builder()
                .user(teacher2)
                .employeeNumber("EMP-102")
                .designation("Associate Professor")
                .collegeName("National Institute of Technology")
                .build());

        // Student 1 (Aarav Sharma)
        User student1 = userRepository.save(User.builder()
                .fullName("Aarav Sharma")
                .email("student@example.com")
                .password(defaultPass)
                .role(RoleType.STUDENT)
                .department(cseDept)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        StudentProfile sp1 = studentProfileRepository.save(StudentProfile.builder()
                .user(student1)
                .rollNumber("21CSE001")
                .batch(batch2026)
                .semester(7)
                .enrollmentYear(2023)
                .academicYear("2026-2027")
                .course("B.Tech CSE")
                .yearSemester("4th Year / Sem 7")
                .collegeName("National Institute of Technology")
                .build());
        student1.setStudentProfile(sp1);

        // Student 2 (Diya Patel)
        User student2 = userRepository.save(User.builder()
                .fullName("Diya Patel")
                .email("diya.patel@example.com")
                .password(defaultPass)
                .role(RoleType.STUDENT)
                .department(cseDept)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(student2)
                .rollNumber("21CSE002")
                .batch(batch2026)
                .semester(7)
                .academicYear("2026-2027")
                .course("B.Tech CSE")
                .yearSemester("4th Year / Sem 7")
                .collegeName("National Institute of Technology")
                .build());

        // Student 3 (Rohan Gupta)
        User student3 = userRepository.save(User.builder()
                .fullName("Rohan Gupta")
                .email("rohan.gupta@example.com")
                .password(defaultPass)
                .role(RoleType.STUDENT)
                .department(cseDept)
                .accountStatus(AccountStatus.ACTIVE)
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(student3)
                .rollNumber("21CSE003")
                .batch(batch2026)
                .semester(7)
                .academicYear("2026-2027")
                .course("B.Tech CSE")
                .yearSemester("4th Year / Sem 7")
                .collegeName("National Institute of Technology")
                .build());

        // 6. Main Academic Group
        ProjectGroup mainGroup = groupRepository.save(ProjectGroup.builder()
                .groupName("CSE 2026 Capstone Major Projects")
                .description("Final year major project academic group for Computer Science batch of 2026.")
                .groupCode("CSE-2026-FINAL")
                .teacher(teacher1)
                .createdBy(teacher1)
                .status(GroupStatus.ACTIVE)
                .isActive(true)
                .build());

        // Add students to main group
        groupMemberRepository.save(GroupMember.builder().group(mainGroup).student(student1).memberRole(MemberRole.MEMBER).build());
        groupMemberRepository.save(GroupMember.builder().group(mainGroup).student(student2).memberRole(MemberRole.MEMBER).build());
        groupMemberRepository.save(GroupMember.builder().group(mainGroup).student(student3).memberRole(MemberRole.MEMBER).build());

        // 7. Subgroup (Team Alpha)
        ProjectGroup subgroup = groupRepository.save(ProjectGroup.builder()
                .groupName("Team Alpha")
                .description("Distributed Health Record AI Orchestrator project team")
                .parentGroup(mainGroup)
                .createdBy(student1)
                .leaderStudent(student1)
                .status(GroupStatus.ACTIVE)
                .submissionStatus(SubmissionStatusType.SUBMITTED)
                .isActive(true)
                .build());

        groupMemberRepository.save(GroupMember.builder().group(subgroup).student(student1).memberRole(MemberRole.LEADER).build());
        groupMemberRepository.save(GroupMember.builder().group(subgroup).student(student2).memberRole(MemberRole.MEMBER).build());
        groupMemberRepository.save(GroupMember.builder().group(subgroup).student(student3).memberRole(MemberRole.MEMBER).build());

        // 8. Project Assignment
        ProjectAssignment assignment = assignmentRepository.save(ProjectAssignment.builder()
                .title("Final Year Capstone Project Deliverable")
                .description("Submit complete architecture design, synopsis document, and GitHub repository for evaluation.")
                .subject(capstoneSubject)
                .teacher(teacher1)
                .batch(batch2026)
                .mainGroup(mainGroup)
                .startDate(LocalDateTime.now().minusWeeks(2))
                .deadline(LocalDateTime.now().plusWeeks(3))
                .groupSizeMin(1)
                .groupSizeMax(3)
                .allowLateSubmission(false)
                .isLocked(false)
                .status(AssignmentStatus.OPEN)
                .build());

        // 9. Project
        Project project = projectRepository.save(Project.builder()
                .group(subgroup)
                .title("Distributed Health Record AI Orchestrator")
                .abstractText("Scalable FHIR-compliant multi-agent medical record orchestrator with end-to-end cryptographic integrity and automated anomaly detection.")
                .synopsis("A modern distributed clinical data platform coordinating heterogeneous hospital systems via agentic microservices.")
                .githubUrl("https://github.com/acadconnect/health-record-ai")
                .liveDemoUrl("https://health-ai.acadconnect.edu")
                .technologyStack("React, TypeScript, Spring Boot, MySQL, Docker, FHIR API")
                .projectStatus(ProjectStatus.IN_PROGRESS)
                .progress(40)
                .deadline(LocalDateTime.now().plusWeeks(3))
                .build());

        // Milestones
        milestoneRepository.saveAll(Arrays.asList(
                Milestone.builder().project(project).title("Requirement Analysis & Architecture").dueDate(LocalDateTime.now().minusWeeks(1)).status(MilestoneStatus.APPROVED).orderIndex(1).build(),
                Milestone.builder().project(project).title("Core API & Multi-agent workflow").dueDate(LocalDateTime.now().plusWeeks(2)).status(MilestoneStatus.IN_PROGRESS).orderIndex(2).build(),
                Milestone.builder().project(project).title("Integration, Testing & Deployment").dueDate(LocalDateTime.now().plusWeeks(4)).status(MilestoneStatus.NOT_STARTED).orderIndex(3).build()
        ));

        // 10. Submission
        Submission submission = submissionRepository.save(Submission.builder()
                .project(project)
                .group(subgroup)
                .assignment(assignment)
                .submissionNumber(1)
                .title("Sprint 3 Core Architecture & API Implementation")
                .description("Complete implementation of the REST API modules, JWT authentication, and FHIR parsing service.")
                .githubUrl("https://github.com/acadconnect/health-record-ai")
                .projectFileName("health_record_ai_v1.zip")
                .projectFileUrl("/mock-files/project_submission.zip")
                .synopsisFileName("health_record_ai_synopsis.pdf")
                .synopsisUrl("/mock-files/synopsis.pdf")
                .otherLink("https://health-ai.acadconnect.edu/docs")
                .submittedBy(student1)
                .submittedAt(LocalDateTime.now().minusDays(2))
                .status(SubmissionStatusType.UNDER_REVIEW)
                .teacherRemarks("Good progress on the API architecture. Please ensure test coverage exceeds 80% before final sprint.")
                .isLocked(false)
                .build());

        // Review
        reviewRepository.save(Review.builder()
                .submission(submission)
                .reviewer(teacher1)
                .score(new BigDecimal("8.50"))
                .feedback("Good progress on the API architecture. Please ensure test coverage exceeds 80% before final sprint.")
                .reviewStatus(SubmissionStatusType.UNDER_REVIEW)
                .reviewedAt(LocalDateTime.now().minusDays(1))
                .build());

        // 11. Announcements
        announcementRepository.save(Announcement.builder()
                .mainGroup(mainGroup)
                .title("Mid-Semester Capstone Submission Review Schedule")
                .content("All subgroups are required to push their intermediate progress and synopsis by Friday 5:00 PM for evaluation.")
                .author(teacher1)
                .build());

        announcementRepository.save(Announcement.builder()
                .mainGroup(mainGroup)
                .title("Welcome to Senior Capstone Project 2026")
                .content("Please form your subgroups (maximum 3 members) and register your project topics by next week.")
                .author(teacher1)
                .build());

        // 12. Resources
        resourceRepository.save(Resource.builder()
                .mainGroup(mainGroup)
                .title("Capstone Project Guidelines & Rubric")
                .description("Official grading rubric and synopsis template for 2026")
                .type(ResourceType.DOCUMENTATION)
                .url("https://acadconnect.edu/resources/guidelines-2026.pdf")
                .sharedBy(teacher1)
                .build());

        resourceRepository.save(Resource.builder()
                .mainGroup(mainGroup)
                .title("Sample Project Architecture Repository")
                .description("Starter repository structure with CI/CD GitHub Actions workflow")
                .type(ResourceType.GITHUB)
                .url("https://github.com/acadconnect/project-template")
                .sharedBy(teacher1)
                .build());

        // 13. Notifications
        notificationRepository.save(Notification.builder()
                .recipient(student1)
                .title("Submission Status: Under Review")
                .message("Dr. Rajesh Kumar marked your Sprint 3 deliverable as Under Review.")
                .notificationType(NotificationType.REVIEW)
                .link("/student/feedback")
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .recipient(student1)
                .title("Upcoming Deadline: Nov 15")
                .message("Capstone Sprint 3 review deadline is approaching in 5 days.")
                .notificationType(NotificationType.ASSIGNMENT)
                .link("/student/submissions")
                .isRead(false)
                .build());

        log.info("AcadConnect initial data seeding completed successfully.");
    }
}

