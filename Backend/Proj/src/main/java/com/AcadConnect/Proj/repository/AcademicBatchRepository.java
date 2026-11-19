package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.AcademicBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicBatchRepository extends JpaRepository<AcademicBatch, Long> {
    List<AcademicBatch> findByDepartmentId(Long departmentId);
}

