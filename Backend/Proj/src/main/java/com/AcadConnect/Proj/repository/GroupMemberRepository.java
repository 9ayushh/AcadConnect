package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.GroupMember;
import com.AcadConnect.Proj.enums.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
    List<GroupMember> findByStudentId(Long studentId);
    Optional<GroupMember> findByGroupIdAndStudentId(Long groupId, Long studentId);
    boolean existsByGroupIdAndStudentIdAndMembershipStatus(Long groupId, Long studentId, MembershipStatus status);
}

