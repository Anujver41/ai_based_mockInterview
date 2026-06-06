package com.platform.ai_platform.modules.interview.repository;

import com.platform.ai_platform.modules.interview.entity.InterviewMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewMessageRepository extends JpaRepository<InterviewMessage, UUID> {
    List<InterviewMessage> findBySessionIdOrderByTimestampAsc(UUID sessionId);
}
