package com.platform.ai_platform.modules.problem.dto;

import com.platform.ai_platform.modules.problem.entity.Difficulty;
import com.platform.ai_platform.modules.problem.entity.TestCase;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

public record ProblemDto(
        UUID id,
        String title,
        String description,
        Difficulty difficulty,
        List<String> tags,
        List<String> constraints,
        List<TestCase> testCases
) implements Serializable {}
