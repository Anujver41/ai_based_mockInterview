package com.platform.ai_platform.modules.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeReviewResponse {
    private String timeComplexity;
    private String spaceComplexity;
    private List<String> qualityFeedback;
    private List<String> optimizationSuggestions;
    private String overallScore;
}
