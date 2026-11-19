package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByMainGroupIdOrderByCreatedAtDesc(Long mainGroupId);
}

