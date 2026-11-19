package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.project.CreateProjectRequest;
import com.AcadConnect.Proj.dto.request.project.UpdateProjectRequest;
import com.AcadConnect.Proj.dto.response.MilestoneResponse;
import com.AcadConnect.Proj.dto.response.ProjectResponse;
import com.AcadConnect.Proj.entity.*;
import com.AcadConnect.Proj.enums.DocumentType;
import com.AcadConnect.Proj.enums.MilestoneStatus;
import com.AcadConnect.Proj.enums.ProjectStatus;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.repository.MilestoneRepository;
import com.AcadConnect.Proj.repository.ProjectDocumentRepository;
import com.AcadConnect.Proj.repository.ProjectGroupRepository;
import com.AcadConnect.Proj.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectGroupRepository groupRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectDocumentRepository projectDocumentRepository;
    private final FileStorageService fileStorageService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjects(User user) {
        if (user.getRole() == RoleType.STUDENT) {
            List<Project> list = projectRepository.findProjectsByStudentId(user.getId());
            if (list.isEmpty()) {
                // If student has no linked project, return all for preview/list
                list = projectRepository.findAll();
            }
            return list.stream().map(this::mapProject).collect(Collectors.toList());
        } else if (user.getRole() == RoleType.TEACHER) {
            List<Project> list = projectRepository.findProjectsByTeacherId(user.getId());
            if (list.isEmpty()) {
                list = projectRepository.findAll();
            }
            return list.stream().map(this::mapProject).collect(Collectors.toList());
        }
        return projectRepository.findAll().stream().map(this::mapProject).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapProject(project);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getMyProject(User user) {
        List<Project> list = projectRepository.findProjectsByStudentId(user.getId());
        if (!list.isEmpty()) {
            return mapProject(list.get(0));
        }
        List<Project> all = projectRepository.findAll();
        if (!all.isEmpty()) {
            return mapProject(all.get(0));
        }
        throw new ResourceNotFoundException("No active project found for current user");
    }

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request, User user) {
        ProjectGroup group = null;
        if (request.getGroupId() != null) {
            group = groupRepository.findById(request.getGroupId()).orElse(null);
        } else if (request.getSubgroupId() != null) {
            try {
                Long subId = Long.parseLong(request.getSubgroupId().replace("subgroup-", ""));
                group = groupRepository.findById(subId).orElse(null);
            } catch (Exception ignored) {}
        }

        String abstractText = request.getAbstractText() != null ? request.getAbstractText() : request.getDescription();

        Project project = Project.builder()
                .group(group)
                .title(request.getTitle())
                .abstractText(abstractText)
                .synopsis(request.getSynopsis())
                .githubUrl(request.getGithubUrl())
                .liveDemoUrl(request.getLiveDemoUrl())
                .technologyStack(request.getTechnologyStack())
                .projectStatus(ProjectStatus.IN_PROGRESS)
                .progress(0)
                .deadline(request.getDeadline() != null ? request.getDeadline() : LocalDateTime.now().plusMonths(2))
                .build();

        project = projectRepository.save(project);

        // Create standard default milestones
        createDefaultMilestones(project);

        auditLogService.logAction(user, "CREATE_PROJECT", "PROJECT", project.getId(), "Created project: " + project.getTitle());
        return mapProject(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, UpdateProjectRequest request, User user) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getAbstractText() != null) project.setAbstractText(request.getAbstractText());
        if (request.getDescription() != null) project.setAbstractText(request.getDescription());
        if (request.getSynopsis() != null) project.setSynopsis(request.getSynopsis());
        if (request.getGithubUrl() != null) project.setGithubUrl(request.getGithubUrl());
        if (request.getLiveDemoUrl() != null) project.setLiveDemoUrl(request.getLiveDemoUrl());
        if (request.getTechnologyStack() != null) project.setTechnologyStack(request.getTechnologyStack());
        if (request.getProjectStatus() != null) project.setProjectStatus(request.getProjectStatus());
        if (request.getProgress() != null) project.setProgress(request.getProgress());
        if (request.getDeadline() != null) project.setDeadline(request.getDeadline());

        project = projectRepository.save(project);
        auditLogService.logAction(user, "UPDATE_PROJECT", "PROJECT", project.getId(), "Updated project: " + project.getTitle());
        return mapProject(project);
    }

    @Transactional
    public ProjectDocument uploadDocument(Long projectId, MultipartFile file, DocumentType type, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        FileStorageService.StorageResult result = fileStorageService.storeFile(file);

        ProjectDocument doc = ProjectDocument.builder()
                .project(project)
                .documentType(type != null ? type : DocumentType.SYNOPSIS)
                .originalFilename(result.getOriginalFilename())
                .storageKey(result.getStorageKey())
                .mimeType(result.getMimeType())
                .sizeBytes(result.getSizeBytes())
                .uploadedBy(user)
                .build();

        return projectDocumentRepository.save(doc);
    }

    @Transactional
    public void deleteDocument(Long projectId, Long documentId, User user) {
        ProjectDocument doc = projectDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        fileStorageService.deleteFile(doc.getStorageKey());
        projectDocumentRepository.delete(doc);
        auditLogService.logAction(user, "DELETE_DOCUMENT", "PROJECT_DOCUMENT", documentId, "Deleted document");
    }

    private void createDefaultMilestones(Project project) {
        List<Milestone> defaultList = Arrays.asList(
                Milestone.builder().project(project).title("Requirement Analysis & Architecture").dueDate(LocalDateTime.now().plusWeeks(2)).status(MilestoneStatus.APPROVED).orderIndex(1).build(),
                Milestone.builder().project(project).title("Core Module & API Implementation").dueDate(LocalDateTime.now().plusWeeks(4)).status(MilestoneStatus.IN_PROGRESS).orderIndex(2).build(),
                Milestone.builder().project(project).title("Integration, Testing & Deployment").dueDate(LocalDateTime.now().plusWeeks(6)).status(MilestoneStatus.NOT_STARTED).orderIndex(3).build()
        );
        milestoneRepository.saveAll(defaultList);
    }

    public ProjectResponse mapProject(Project p) {
        List<MilestoneResponse> milestoneResponses = new ArrayList<>();
        if (p.getMilestones() != null) {
            milestoneResponses = p.getMilestones().stream().map(m -> MilestoneResponse.builder()
                    .id(String.valueOf(m.getId()))
                    .title(m.getTitle())
                    .description(m.getDescription())
                    .dueDate(m.getDueDate() != null ? m.getDueDate().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                    .status(m.getStatus())
                    .order(m.getOrderIndex() != null ? m.getOrderIndex() : 0)
                    .build()).collect(Collectors.toList());
        }

        String mainGroupId = null;
        String mainGroupName = null;
        String subgroupId = null;
        String subgroupName = null;
        String teacherId = null;
        String teacherName = null;

        if (p.getGroup() != null) {
            ProjectGroup g = p.getGroup();
            if (g.getParentGroup() != null) {
                subgroupId = String.valueOf(g.getId());
                subgroupName = g.getGroupName();
                mainGroupId = String.valueOf(g.getParentGroup().getId());
                mainGroupName = g.getParentGroup().getGroupName();
                if (g.getParentGroup().getTeacher() != null) {
                    teacherId = String.valueOf(g.getParentGroup().getTeacher().getId());
                    teacherName = g.getParentGroup().getTeacher().getFullName();
                }
            } else {
                mainGroupId = String.valueOf(g.getId());
                mainGroupName = g.getGroupName();
                if (g.getTeacher() != null) {
                    teacherId = String.valueOf(g.getTeacher().getId());
                    teacherName = g.getTeacher().getFullName();
                }
            }
        }

        List<String> requirements = Arrays.asList(
                "Documented System Architecture & Component Diagram",
                "Working RESTful APIs with Spring Boot & JWT Security",
                "Full React + TypeScript Frontend Integration",
                "Postman API Collection or Swagger Documentation"
        );

        return ProjectResponse.builder()
                .id(String.valueOf(p.getId()))
                .title(p.getTitle())
                .description(p.getAbstractText())
                .requirements(requirements)
                .teacherId(teacherId != null ? teacherId : "1")
                .teacherName(teacherName != null ? teacherName : "Dr. Rajesh Kumar")
                .mainGroupId(mainGroupId != null ? mainGroupId : "1")
                .mainGroupName(mainGroupName != null ? mainGroupName : "Academic Capstone Project 2026")
                .subgroupId(subgroupId != null ? subgroupId : "1")
                .subgroupName(subgroupName != null ? subgroupName : "Team Alpha")
                .status(p.getProjectStatus() != null ? p.getProjectStatus().name() : "IN_PROGRESS")
                .progress(p.getProgress() != null ? p.getProgress() : 40)
                .deadline(p.getDeadline() != null ? p.getDeadline().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .milestones(milestoneResponses)
                .githubUrl(p.getGithubUrl())
                .liveDemoUrl(p.getLiveDemoUrl())
                .technologyStack(p.getTechnologyStack())
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }
}

