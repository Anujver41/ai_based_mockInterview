package com.platform.ai_platform.modules.problem.repository;

import com.platform.ai_platform.modules.problem.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    boolean existsByTitle(String title);
    Page<Problem> findByDifficulty(String difficulty, Pageable pageable);
}
