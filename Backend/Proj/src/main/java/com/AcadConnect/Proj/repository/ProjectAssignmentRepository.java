package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {
    List<ProjectAssignment> findByTeacherId(Long teacherId);
    List<ProjectAssignment> findByMainGroupId(Long mainGroupId);
    List<ProjectAssignment> findBySubjectId(Long subjectId);
}

