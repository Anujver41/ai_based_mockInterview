package com.platform.ai_platform.modules.resume.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResumeAnalyzeResponse {
    private int atsScore;
    private List<String> improvementSuggestions;
    private List<String> missingKeywords;
    private String overallFeedback;
}
