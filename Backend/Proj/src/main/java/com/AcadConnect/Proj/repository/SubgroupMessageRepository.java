package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.SubgroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubgroupMessageRepository extends JpaRepository<SubgroupMessage, Long> {
    List<SubgroupMessage> findByMainGroupIdOrderByCreatedAtDesc(Long mainGroupId);
    List<SubgroupMessage> findBySubgroupIdOrderByCreatedAtDesc(Long subgroupId);
}

