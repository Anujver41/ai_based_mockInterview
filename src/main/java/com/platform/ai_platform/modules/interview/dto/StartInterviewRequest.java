package com.platform.ai_platform.modules.interview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StartInterviewRequest {
    @NotBlank(message = "Topic is required")
    private String topic;
    
    @NotBlank(message = "Difficulty is required")
    private String difficulty;
}
