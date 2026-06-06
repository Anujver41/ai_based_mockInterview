package com.platform.ai_platform.modules.problem.dto;

import com.platform.ai_platform.modules.problem.entity.Difficulty;
import com.platform.ai_platform.modules.problem.entity.TestCase;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ProblemCreateRequest(
        @NotBlank(message = "Title is required")
        String title,
        
        @NotBlank(message = "Description is required")
        String description,
        
        @NotNull(message = "Difficulty is required")
        Difficulty difficulty,
        
        List<String> tags,
        List<String> constraints,
        List<TestCase> testCases
) {}
