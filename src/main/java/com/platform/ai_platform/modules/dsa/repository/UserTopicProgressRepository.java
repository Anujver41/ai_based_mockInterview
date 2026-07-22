package com.platform.ai_platform.modules.dsa.repository;

import com.platform.ai_platform.modules.dsa.entity.UserTopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTopicProgressRepository extends JpaRepository<UserTopicProgress, Long> {
    Optional<UserTopicProgress> findByUserIdAndTopicName(UUID userId, String topicName);
    List<UserTopicProgress> findByUserId(UUID userId);
}
