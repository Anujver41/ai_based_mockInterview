package com.platform.ai_platform.modules.interview.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class InterviewSessionResponse {
    private UUID id;
    private String topic;
    private String difficulty;
    private String status;
    private LocalDateTime createdAt;
}
