package com.platform.ai_platform.modules.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeReviewRequest {
    @NotBlank(message = "Code snippet is required")
    private String code;

    @NotBlank(message = "Programming language is required")
    private String language;

    private String problemDescription;
}
