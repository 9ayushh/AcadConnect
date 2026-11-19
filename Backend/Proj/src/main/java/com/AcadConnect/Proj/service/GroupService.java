package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.dto.request.group.CreateGroupRequest;
import com.AcadConnect.Proj.dto.request.group.CreateSubgroupRequest;
import com.AcadConnect.Proj.dto.response.GroupResponse;
import com.AcadConnect.Proj.dto.response.MyGroupResponse;
import com.AcadConnect.Proj.dto.response.SubgroupMemberResponse;
import com.AcadConnect.Proj.dto.response.SubgroupResponse;
import com.AcadConnect.Proj.entity.*;
import com.AcadConnect.Proj.enums.AccountStatus;
import com.AcadConnect.Proj.enums.GroupStatus;
import com.AcadConnect.Proj.enums.MemberRole;
import com.AcadConnect.Proj.enums.MembershipStatus;
import com.AcadConnect.Proj.enums.RoleType;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import com.AcadConnect.Proj.exception.BusinessRuleException;
import com.AcadConnect.Proj.exception.ResourceNotFoundException;
import com.AcadConnect.Proj.exception.UnauthorizedAccessException;
import com.AcadConnect.Proj.repository.GroupMemberRepository;
import com.AcadConnect.Proj.repository.ProjectGroupRepository;
import com.AcadConnect.Proj.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final ProjectGroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public MyGroupResponse getMyGroup(User user) {
        if (user.getRole() == RoleType.STUDENT) {
            List<ProjectGroup> mySubgroups = groupRepository.findSubgroupsByStudentId(user.getId());
            ProjectGroup activeSubgroup = mySubgroups.isEmpty() ? null : mySubgroups.get(0);

            ProjectGroup mainGroup = null;
            if (activeSubgroup != null && activeSubgroup.getParentGroup() != null) {
                mainGroup = activeSubgroup.getParentGroup();
            } else {
                List<ProjectGroup> myMainGroups = groupRepository.findMainGroupsByStudentId(user.getId());
                if (!myMainGroups.isEmpty()) {
                    mainGroup = myMainGroups.get(0);
                } else {
                    List<ProjectGroup> allMains = groupRepository.findByParentGroupIsNull();
                    mainGroup = allMains.isEmpty() ? null : allMains.get(0);
                }
            }

            return MyGroupResponse.builder()
                    .mainGroup(mainGroup != null ? mapToGroupResponse(mainGroup) : null)
                    .subgroup(activeSubgroup != null ? mapToSubgroupResponse(activeSubgroup) : null)
                    .allMySubgroups(mySubgroups.stream().map(this::mapToSubgroupResponse).collect(Collectors.toList()))
                    .build();
        }

        // For Teacher / Admin
        List<ProjectGroup> teacherGroups = groupRepository.findByTeacherId(user.getId());
        ProjectGroup firstGroup = !teacherGroups.isEmpty() ? teacherGroups.get(0)
                : groupRepository.findByParentGroupIsNull().stream().findFirst().orElse(null);

        return MyGroupResponse.builder()
                .mainGroup(firstGroup != null ? mapToGroupResponse(firstGroup) : null)
                .subgroup(null)
                .allMySubgroups(Collections.emptyList())
                .build();
    }

    @Transactional(readOnly = true)
    public List<GroupResponse> getAllGroups(User user) {
        if (user.getRole() == RoleType.TEACHER) {
            return groupRepository.findByTeacherId(user.getId()).stream()
                    .filter(g -> g.getParentGroup() == null)
                    .map(this::mapToGroupResponse)
                    .collect(Collectors.toList());
        }
        return groupRepository.findByParentGroupIsNull().stream()
                .map(this::mapToGroupResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GroupResponse getGroupById(Long id) {
        ProjectGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + id));
        return mapToGroupResponse(group);
    }

    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request, User user) {
        if (user.getRole() != RoleType.TEACHER && user.getRole() != RoleType.ADMIN) {
            throw new UnauthorizedAccessException("Only teachers or administrators can create academic main groups");
        }

        String inviteCode = request.getName().toUpperCase()
                .replaceAll("[^A-Z0-9]", "-")
                .replaceAll("-+", "-");
        if (inviteCode.length() > 10) {
            inviteCode = inviteCode.substring(0, 10);
        }
        inviteCode += "-" + (100 + new Random().nextInt(900));

        ProjectGroup group = ProjectGroup.builder()
                .groupName(request.getName())
                .description(request.getDescription())
                .groupCode(inviteCode)
                .teacher(user)
                .createdBy(user)
                .status(GroupStatus.ACTIVE)
                .isActive(true)
                .build();

        group = groupRepository.save(group);
        auditLogService.logAction(user, "CREATE_MAIN_GROUP", "GROUP", group.getId(), "Main group created: " + group.getGroupName());
        return mapToGroupResponse(group);
    }

    @Transactional(readOnly = true)
    public GroupResponse getInvitePreview(String code) {
        ProjectGroup group = groupRepository.findByGroupCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired invitation code: " + code));
        return mapToGroupResponse(group);
    }

    @Transactional
    public GroupResponse joinByInvite(String code, User user) {
        ProjectGroup group = groupRepository.findByGroupCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired invitation code"));

        boolean alreadyMember = groupMemberRepository.existsByGroupIdAndStudentIdAndMembershipStatus(
                group.getId(), user.getId(), MembershipStatus.ACTIVE
        );

        if (!alreadyMember) {
            GroupMember member = GroupMember.builder()
                    .group(group)
                    .student(user)
                    .memberRole(MemberRole.MEMBER)
                    .membershipStatus(MembershipStatus.ACTIVE)
                    .build();
            groupMemberRepository.save(member);
            group.getMembers().add(member);
            auditLogService.logAction(user, "JOIN_GROUP", "GROUP", group.getId(), "Joined group via code " + code);
        }

        return mapToGroupResponse(group);
    }

    @Transactional
    public void leaveGroup(Long groupId, User user) {
        ProjectGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));

        // Remove from main group if member
        groupMemberRepository.findByGroupIdAndStudentId(groupId, user.getId())
                .ifPresent(groupMemberRepository::delete);

        // Also remove from any subgroups under this main group
        List<ProjectGroup> subgroups = groupRepository.findByParentGroupId(groupId);
        for (ProjectGroup sub : subgroups) {
            groupMemberRepository.findByGroupIdAndStudentId(sub.getId(), user.getId())
                    .ifPresent(groupMemberRepository::delete);
        }

        auditLogService.logAction(user, "LEAVE_GROUP", "GROUP", groupId, "User left group");
    }

    @Transactional(readOnly = true)
    public List<SubgroupResponse> getGroupSubgroups(Long groupId, User user) {
        List<ProjectGroup> subs = groupRepository.findByParentGroupId(groupId);
        // Student rule (§6.3, §14): student only sees their own subgroup
        if (user.getRole() == RoleType.STUDENT) {
            subs = subs.stream()
                    .filter(s -> s.getMembers().stream().anyMatch(m -> m.getStudent().getId().equals(user.getId())))
                    .collect(Collectors.toList());
        }
        return subs.stream().map(this::mapToSubgroupResponse).collect(Collectors.toList());
    }

    @Transactional
    public SubgroupResponse createSubgroup(Long mainGroupId, CreateSubgroupRequest request, User user) {
        ProjectGroup mainGroup = groupRepository.findById(mainGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Main group not found with id: " + mainGroupId));

        // Enforce maximum 3 members per subgroup (LLD §5.2, §12)
        Set<String> emails = new LinkedHashSet<>();
        emails.add(user.getEmail().toLowerCase());

        if (request.getMemberEmail1() != null && !request.getMemberEmail1().isBlank()) {
            emails.add(request.getMemberEmail1().trim().toLowerCase());
        }
        if (request.getMemberEmail2() != null && !request.getMemberEmail2().isBlank()) {
            emails.add(request.getMemberEmail2().trim().toLowerCase());
        }
        if (request.getMemberEmails() != null) {
            for (String em : request.getMemberEmails()) {
                if (em != null && !em.isBlank()) emails.add(em.trim().toLowerCase());
            }
        }

        if (emails.size() > 3) {
            throw new BusinessRuleException("Maximum 3 students permitted per subgroup");
        }

        ProjectGroup subgroup = ProjectGroup.builder()
                .groupName(request.getName())
                .description(request.getDescription())
                .parentGroup(mainGroup)
                .createdBy(user)
                .leaderStudent(user)
                .status(GroupStatus.ACTIVE)
                .submissionStatus(SubmissionStatusType.PENDING)
                .isActive(true)
                .build();

        subgroup = groupRepository.save(subgroup);

        // Add creator and invited members
        for (String email : emails) {
            Optional<User> uOpt = userRepository.findByEmailIgnoreCase(email);
            User memberUser = uOpt.orElseGet(() -> {
                User dummy = User.builder()
                        .fullName(email.split("@")[0])
                        .email(email)
                        .password("Default@123")
                        .role(RoleType.STUDENT)
                        .accountStatus(AccountStatus.ACTIVE)
                        .build();
                return userRepository.save(dummy);
            });

            GroupMember member = GroupMember.builder()
                    .group(subgroup)
                    .student(memberUser)
                    .memberRole(memberUser.getId().equals(user.getId()) ? MemberRole.LEADER : MemberRole.MEMBER)
                    .membershipStatus(MembershipStatus.ACTIVE)
                    .build();
            groupMemberRepository.save(member);
            subgroup.getMembers().add(member);
        }

        auditLogService.logAction(user, "CREATE_SUBGROUP", "SUBGROUP", subgroup.getId(), "Subgroup created: " + subgroup.getGroupName());
        return mapToSubgroupResponse(subgroup);
    }

    @Transactional(readOnly = true)
    public SubgroupResponse getSubgroupById(Long id, User user) {
        ProjectGroup subgroup = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subgroup not found with id: " + id));

        // Student privacy guard (§14): only allowed to see own subgroup
        if (user.getRole() == RoleType.STUDENT) {
            boolean isMember = subgroup.getMembers().stream()
                    .anyMatch(m -> m.getStudent().getId().equals(user.getId()));
            if (!isMember) {
                throw new UnauthorizedAccessException("You do not have permission to view other subgroups");
            }
        }

        return mapToSubgroupResponse(subgroup);
    }

    @Transactional
    public void removeSubgroupMember(Long subgroupId, Long studentId, User user) {
        ProjectGroup subgroup = groupRepository.findById(subgroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Subgroup not found"));

        groupMemberRepository.findByGroupIdAndStudentId(subgroupId, studentId)
                .ifPresent(groupMemberRepository::delete);

        auditLogService.logAction(user, "REMOVE_SUBGROUP_MEMBER", "SUBGROUP", subgroupId, "Removed member " + studentId);
    }

    public GroupResponse mapToGroupResponse(ProjectGroup g) {
        int membersCount = g.getMembers() != null ? g.getMembers().size() : 0;
        int subCount = g.getSubgroups() != null ? g.getSubgroups().size() : 0;

        return GroupResponse.builder()
                .id(String.valueOf(g.getId()))
                .name(g.getGroupName())
                .description(g.getDescription())
                .teacherId(g.getTeacher() != null ? String.valueOf(g.getTeacher().getId()) : null)
                .teacherName(g.getTeacher() != null ? g.getTeacher().getFullName() : null)
                .inviteCode(g.getGroupCode())
                .inviteUrl("/join/" + g.getGroupCode())
                .isActive(Boolean.TRUE.equals(g.getIsActive()))
                .memberCount(membersCount)
                .subgroupCount(subCount)
                .createdAt(g.getCreatedAt() != null ? g.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }

    public SubgroupResponse mapToSubgroupResponse(ProjectGroup sg) {
        List<SubgroupMemberResponse> memberResponses = new ArrayList<>();
        if (sg.getMembers() != null) {
            for (GroupMember m : sg.getMembers()) {
                User u = m.getStudent();
                StudentProfile sp = u.getStudentProfile();
                memberResponses.add(SubgroupMemberResponse.builder()
                        .id(String.valueOf(m.getId()))
                        .userId(String.valueOf(u.getId()))
                        .name(u.getFullName())
                        .email(u.getEmail())
                        .rollNumber(sp != null ? sp.getRollNumber() : "21CSE00" + u.getId())
                        .department(u.getDepartment() != null ? u.getDepartment().getDepartmentName() : "CSE")
                        .joinedAt(m.getJoinedAt() != null ? m.getJoinedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                        .build());
            }
        }

        String projectTitle = null;
        String assignedProjectId = null;
        if (sg.getProject() != null) {
            assignedProjectId = String.valueOf(sg.getProject().getId());
            projectTitle = sg.getProject().getTitle();
        }

        return SubgroupResponse.builder()
                .id(String.valueOf(sg.getId()))
                .mainGroupId(sg.getParentGroup() != null ? String.valueOf(sg.getParentGroup().getId()) : null)
                .name(sg.getGroupName())
                .description(sg.getDescription())
                .creatorId(sg.getCreatedBy() != null ? String.valueOf(sg.getCreatedBy().getId()) : null)
                .creatorName(sg.getCreatedBy() != null ? sg.getCreatedBy().getFullName() : null)
                .members(memberResponses)
                .assignedProjectId(assignedProjectId)
                .projectTitle(projectTitle)
                .submissionStatus(sg.getSubmissionStatus() != null ? sg.getSubmissionStatus() : SubmissionStatusType.PENDING)
                .lastUpdated(sg.getUpdatedAt() != null ? sg.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .createdAt(sg.getCreatedAt() != null ? sg.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null)
                .build();
    }
}
