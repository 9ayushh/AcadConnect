package com.AcadConnect.Proj.repository;

import com.AcadConnect.Proj.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySubmissionIdOrderByReviewedAtDesc(Long submissionId);
    List<Review> findByReviewerId(Long reviewerId);
}

