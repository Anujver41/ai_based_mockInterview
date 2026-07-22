package com.platform.ai_platform.modules.problem.repository;

import com.platform.ai_platform.modules.problem.entity.Difficulty;
import com.platform.ai_platform.modules.problem.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, UUID> {
    boolean existsByTitle(String title);
    Page<Problem> findByDifficulty(String difficulty, Pageable pageable);

    List<Problem> findByDsaTopicAndDifficulty(String dsaTopic, Difficulty difficulty);

    @Query("""
        SELECT p FROM Problem p
        WHERE p.dsaTopic = :topic
          AND p.difficulty = :difficulty
          AND p.id NOT IN (
              SELECT s.problemId FROM Submission s
              WHERE s.userId = :userId AND s.status = 'PASSED'
          )
        ORDER BY RANDOM()
    """)
    List<Problem> findUnsolvedByTopicAndDifficulty(
        @Param("userId") UUID userId,
        @Param("topic") String topic,
        @Param("difficulty") Difficulty difficulty,
        Pageable pageable
    );
}
