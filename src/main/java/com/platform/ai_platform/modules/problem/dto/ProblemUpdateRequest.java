package com.platform.ai_platform.modules.problem.dto;

import com.platform.ai_platform.modules.problem.entity.Difficulty;
import com.platform.ai_platform.modules.problem.entity.TestCase;
import java.util.List;

public record ProblemUpdateRequest(
        String title,
        String description,
        Difficulty difficulty,
        List<String> tags,
        List<String> constraints,
        List<TestCase> testCases
) {}
