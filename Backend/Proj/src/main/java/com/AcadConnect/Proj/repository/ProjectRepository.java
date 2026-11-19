package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByGroupId(Long groupId);

    @Query("SELECT p FROM Project p JOIN p.group g JOIN g.members m WHERE m.student.id = :studentId")
    List<Project> findProjectsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT p FROM Project p WHERE p.group.parentGroup.teacher.id = :teacherId OR p.group.teacher.id = :teacherId")
    List<Project> findProjectsByTeacherId(@Param("teacherId") Long teacherId);
}

