package com.platform.ai_platform.modules.github.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class GithubAnalyzerResponse {
    private String username;
    private int totalPublicRepos;
    private Map<String, Integer> techStackUsage;
    private String commitActivitySummary;
    private String aiInsights;
    private Map<String, Integer> contributions;
}
