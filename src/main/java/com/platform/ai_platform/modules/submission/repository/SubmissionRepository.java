package com.platform.ai_platform.modules.submission.repository;

import com.platform.ai_platform.modules.submission.domain.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdAndIsRunFalse(UUID userId);
}

