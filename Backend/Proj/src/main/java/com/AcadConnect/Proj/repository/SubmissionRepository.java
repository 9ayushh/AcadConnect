package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.Submission;
import com.AcadConnect.Proj.enums.SubmissionStatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByProjectId(Long projectId);
    List<Submission> findByGroupId(Long groupId);
    List<Submission> findByAssignmentId(Long assignmentId);
    List<Submission> findByStatus(SubmissionStatusType status);

    @Query("SELECT s FROM Submission s JOIN s.group g JOIN g.members m WHERE m.student.id = :studentId")
    List<Submission> findSubmissionsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT s FROM Submission s WHERE s.group.parentGroup.teacher.id = :teacherId OR s.assignment.teacher.id = :teacherId")
    List<Submission> findSubmissionsByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT s FROM Submission s WHERE (s.group.parentGroup.teacher.id = :teacherId OR s.assignment.teacher.id = :teacherId) AND s.status = :status")
    List<Submission> findSubmissionsByTeacherIdAndStatus(@Param("teacherId") Long teacherId, @Param("status") SubmissionStatusType status);
}

