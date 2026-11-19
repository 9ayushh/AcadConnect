package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByMainGroupIdOrderByCreatedAtDesc(Long mainGroupId);
    List<Resource> findBySubgroupIdOrderByCreatedAtDesc(Long subgroupId);
}

