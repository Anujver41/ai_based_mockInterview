package com.platform.ai_platform.modules.submission.dto;

import com.platform.ai_platform.modules.submission.domain.enums.SubmissionStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

import java.util.UUID;

@Data
@Builder
public class SubmissionResponse {
    private Long id;
    private UUID userId;
    private UUID problemId;
    private String code;
    private String language;
    private SubmissionStatus status;
    private String errorMessage;
    private Boolean isRun;
    private LocalDateTime createdAt;
}
