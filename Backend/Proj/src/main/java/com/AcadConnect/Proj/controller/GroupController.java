package com.AcadConnect.Proj.controller;

import com.AcadConnect.Proj.dto.request.group.CreateGroupRequest;
import com.AcadConnect.Proj.dto.request.group.CreateSubgroupRequest;
import com.AcadConnect.Proj.dto.response.GroupResponse;
import com.AcadConnect.Proj.dto.response.MyGroupResponse;
import com.AcadConnect.Proj.dto.response.SubgroupResponse;
import com.AcadConnect.Proj.entity.User;
import com.AcadConnect.Proj.repository.UserRepository;
import com.AcadConnect.Proj.security.UserPrincipal;
import com.AcadConnect.Proj.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId()).orElseThrow();
    }

    // --- Groups API ---
    @GetMapping({"/api/groups/my-group", "/api/v1/groups/my", "/groups/my-group"})
    public ResponseEntity<MyGroupResponse> getMyGroup(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.getMyGroup(getUser(principal)));
    }

    @GetMapping({"/api/groups", "/api/v1/groups", "/groups"})
    public ResponseEntity<List<GroupResponse>> getAllGroups(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.getAllGroups(getUser(principal)));
    }

    @PostMapping({"/api/groups", "/api/v1/groups", "/groups"})
    public ResponseEntity<GroupResponse> createGroup(
            @Valid @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.createGroup(request, getUser(principal)));
    }

    @GetMapping({"/api/groups/{id}", "/api/v1/groups/{id}", "/groups/{id}"})
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @PostMapping({"/api/groups/{id}/leave", "/api/v1/groups/{id}/leave", "/groups/{id}/leave"})
    public ResponseEntity<Map<String, String>> leaveGroup(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        groupService.leaveGroup(id, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Successfully left the group"));
    }

    @GetMapping({"/api/groups/{id}/subgroups", "/api/v1/groups/{id}/subgroups", "/groups/{id}/subgroups"})
    public ResponseEntity<List<SubgroupResponse>> getGroupSubgroups(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(groupService.getGroupSubgroups(id, getUser(principal)));
    }

    @PostMapping({"/api/groups/{id}/subgroups", "/api/v1/groups/{id}/subgroups", "/groups/{id}/subgroups"})
    public ResponseEntity<SubgroupResponse> createSubgroup(
            @PathVariable Long id,
            @Valid @RequestBody CreateSubgroupRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.createSubgroup(id, request, getUser(principal)));
    }

    // --- Subgroups API ---
    @GetMapping({"/api/subgroups/{id}", "/api/v1/subgroups/{id}", "/subgroups/{id}"})
    public ResponseEntity<SubgroupResponse> getSubgroupById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long subId = Long.parseLong(id.replace("subgroup-", ""));
        return ResponseEntity.ok(groupService.getSubgroupById(subId, getUser(principal)));
    }

    @DeleteMapping({"/api/subgroups/{id}/members/{userId}", "/api/v1/subgroups/{id}/members/{userId}", "/subgroups/{id}/members/{userId}"})
    public ResponseEntity<Map<String, String>> removeSubgroupMember(
            @PathVariable String id,
            @PathVariable String userId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long subId = Long.parseLong(id.replace("subgroup-", ""));
        Long uId = Long.parseLong(userId.replace("user-", "").replace("mem-", ""));
        groupService.removeSubgroupMember(subId, uId, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
    }

    // --- Invite Codes API ---
    @GetMapping({"/api/invite/{code}", "/api/v1/invite/{code}", "/invite/{code}"})
    public ResponseEntity<GroupResponse> getInvitePreview(@PathVariable String code) {
        return ResponseEntity.ok(groupService.getInvitePreview(code));
    }

    @PostMapping({"/api/invite/{code}/join", "/api/v1/invite/{code}/join", "/invite/{code}/join"})
    public ResponseEntity<Map<String, Object>> joinByInvite(
            @PathVariable String code,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        GroupResponse group = groupService.joinByInvite(code, getUser(principal));
        return ResponseEntity.ok(Map.of("message", "Successfully joined group", "group", group));
    }
}

