package com.platform.ai_platform.modules.submission.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SubmissionRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Problem ID is required")
    private UUID problemId;

    @NotBlank(message = "Code cannot be empty")
    private String code;

    @NotBlank(message = "Language cannot be empty")
    private String language;

    private Boolean isRun = false;
}
