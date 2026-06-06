package com.platform.ai_platform.modules.interview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatRequest {
    @NotBlank(message = "Content cannot be blank")
    private String content;
}
