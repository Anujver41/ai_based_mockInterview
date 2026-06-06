package com.platform.ai_platform.modules.interview.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class InterviewMessageResponse {
    private UUID id;
    private String role;
    private String content;
    private LocalDateTime timestamp;
}
