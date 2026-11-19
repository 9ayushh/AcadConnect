package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {
    Optional<ProjectGroup> findByGroupCode(String groupCode);
    List<ProjectGroup> findByParentGroupIsNull();
    List<ProjectGroup> findByParentGroupId(Long parentGroupId);
    List<ProjectGroup> findByTeacherId(Long teacherId);
    List<ProjectGroup> findByAssignmentId(Long assignmentId);

    @Query("SELECT g FROM ProjectGroup g JOIN g.members m WHERE m.student.id = :studentId AND g.parentGroup IS NULL")
    List<ProjectGroup> findMainGroupsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT g FROM ProjectGroup g JOIN g.members m WHERE m.student.id = :studentId AND g.parentGroup IS NOT NULL")
    List<ProjectGroup> findSubgroupsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT g FROM ProjectGroup g JOIN g.members m WHERE m.student.id = :studentId")
    List<ProjectGroup> findAllGroupsByStudentId(@Param("studentId") Long studentId);
}

