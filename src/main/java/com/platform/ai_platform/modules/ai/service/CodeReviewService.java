package com.platform.ai_platform.modules.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.ai_platform.common.exception.AiProcessingException;
import com.platform.ai_platform.modules.ai.dto.CodeReviewRequest;
import com.platform.ai_platform.modules.ai.dto.CodeReviewResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CodeReviewService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${gemini.fallback-to-mock:false}")
    private boolean fallbackToMock;

    public CodeReviewService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper.copy()
            .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true)
            .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_COMMENTS, true)
            .configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    }

    public CodeReviewResponse reviewCode(CodeReviewRequest request) {
        log.info("Starting Gemini AI code review for language: {} (Model: {})", request.getLanguage(), model);

        String prompt = buildPrompt(request);
        int maxRetries = 3;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String aiResponse = callGemini(prompt);
                log.info("Received Gemini response on attempt {}, parsing...", attempt);
                return parseResponse(aiResponse);
            } catch (HttpClientErrorException.TooManyRequests e) {
                log.warn("Gemini API Rate Limit hit (429) on attempt {}/{}", attempt, maxRetries);
                if (attempt == maxRetries) {
                    if (fallbackToMock) return getSmartFallback(request);
                    throw new AiProcessingException("Gemini API Rate Limit exceeded. Please try again later.", e);
                }
                sleep(2000);
            } catch (org.springframework.web.client.HttpServerErrorException e) {
                log.warn("Gemini API server error ({}) on attempt {}/{}", e.getStatusCode(), attempt, maxRetries);
                if (attempt == maxRetries) {
                    if (fallbackToMock) return getSmartFallback(request);
                    throw new AiProcessingException("Gemini API is temporarily unavailable. Please try again later.", e);
                }
                sleep(2000);
            } catch (AiProcessingException e) {
                throw e;
            } catch (Exception e) {
                log.error("Unexpected error during AI code review on attempt {}", attempt, e);
                if (fallbackToMock) {
                    log.info("Returning smart fallback response due to error");
                    return getSmartFallback(request);
                }
                throw new AiProcessingException("Failed to analyze code: " + e.getMessage(), e);
            }
        }
        // Should not reach here, but just in case
        return getSmartFallback(request);
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
    }

    private String callGemini(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model
                + ":generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 2048,
                        "responseMimeType", "application/json"
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new AiProcessingException("Gemini API returned status: " + response.getStatusCode());
        }

        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode textNode = root.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text");

            if (textNode.isMissingNode()) {
                throw new AiProcessingException("No text in Gemini response");
            }

            return textNode.asText();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response JSON", e);
            throw new AiProcessingException("Failed to parse Gemini response", e);
        }
    }

    private String buildPrompt(CodeReviewRequest request) {
        return """
                You are an expert Senior Software Engineer performing a thorough code review.
                Analyze the following %s code and respond ONLY with a valid JSON object.
                
                Problem Description: %s
                
                Code:
                %s
                
                Respond with this exact JSON structure:
                {
                  "timeComplexity": "<Big-O notation>",
                  "spaceComplexity": "<Big-O notation>",
                  "qualityFeedback": ["<feedback point 1>", "<feedback point 2>"],
                  "optimizationSuggestions": ["<suggestion 1>", "<suggestion 2>"],
                  "overallScore": "<score/100 with reason>"
                }
                """.formatted(
                request.getLanguage(),
                request.getProblemDescription() != null ? request.getProblemDescription() : "Not provided",
                request.getCode()
        );
    }

    private CodeReviewResponse parseResponse(String raw) {
        try {
            int start = raw.indexOf('{');
            int end = raw.lastIndexOf('}');
            if (start != -1 && end != -1 && start <= end) {
                String cleaned = raw.substring(start, end + 1);
                return objectMapper.readValue(cleaned, CodeReviewResponse.class);
            }
            throw new Exception("No JSON object found in response");
        } catch (Exception e) {
            log.warn("Failed to parse JSON response. Error: {}. Raw text: {}", e.getMessage(), raw);
            return CodeReviewResponse.builder()
                    .timeComplexity("N/A")
                    .spaceComplexity("N/A")
                    .qualityFeedback(List.of(raw))
                    .optimizationSuggestions(List.of())
                    .overallScore("N/A")
                    .build();
        }
    }

    private CodeReviewResponse getMockResponse() {
        return buildLocalAnalysis("// no code", "unknown");
    }

    private CodeReviewResponse getSmartFallback(CodeReviewRequest request) {
        return buildLocalAnalysis(request.getCode(), request.getLanguage());
    }

    private CodeReviewResponse buildLocalAnalysis(String code, String language) {
        String timeComplexity = analyzeTimeComplexity(code);
        String spaceComplexity = analyzeSpaceComplexity(code);
        List<String> feedback = analyzeQuality(code);
        List<String> suggestions = analyzeSuggestions(code);
        int score = estimateScore(code);

        return CodeReviewResponse.builder()
                .timeComplexity(timeComplexity + " [Local Analysis]")
                .spaceComplexity(spaceComplexity + " [Local Analysis]")
                .qualityFeedback(feedback)
                .optimizationSuggestions(suggestions)
                .overallScore(score + "/100 - Local analysis (Gemini API quota exceeded, try again later)")
                .build();
    }

    private String analyzeTimeComplexity(String code) {
        String[] lines = code.split("\n");
        int loopDepth = 0, maxDepth = 0;
        java.util.Deque<Boolean> braceStack = new java.util.ArrayDeque<>();

        for (String line : lines) {
            String trimmed = line.trim();
            boolean isLoop = trimmed.matches(".*\\b(for|while)\\b\\s*\\(.*");
            if (isLoop) {
                loopDepth++;
                maxDepth = Math.max(maxDepth, loopDepth);
            }
            for (char c : trimmed.toCharArray()) {
                if (c == '{') {
                    braceStack.push(isLoop);
                    isLoop = false;
                } else if (c == '}' && !braceStack.isEmpty()) {
                    if (braceStack.pop()) loopDepth = Math.max(0, loopDepth - 1);
                }
            }
        }

        boolean hasSorting = code.contains("Arrays.sort") || code.contains("Collections.sort") || code.contains(".sort(");

        if (hasSorting && maxDepth >= 1) return "O(n log n)";
        if (hasSorting) return "O(n log n)";
        if (maxDepth >= 3) return "O(n^3)";
        if (maxDepth == 2) return "O(n^2)";
        if (maxDepth == 1) return "O(n)";
        return "O(1)";
    }

    private String analyzeSpaceComplexity(String code) {
        boolean has2D = code.contains("[][]") || (code.contains("new int[") && code.contains("]["));
        boolean hasCollection = code.contains("ArrayList") || code.contains("LinkedList") || code.contains("HashMap")
                || code.contains("TreeMap") || code.contains("HashSet") || code.contains("TreeSet")
                || code.contains("Stack") || code.contains("Deque") || code.contains("PriorityQueue")
                || code.contains("Queue");
        boolean hasArray = code.contains("new int[") || code.contains("new String[") || code.contains("new boolean[")
                || code.contains("new long[") || code.contains("new double[") || code.contains("new char[");

        if (has2D) return "O(n^2)";
        if (hasCollection || hasArray) return "O(n)";
        return "O(1)";
    }

    private List<String> analyzeQuality(String code) {
        List<String> feedback = new java.util.ArrayList<>();
        long lineCount = code.lines().count();

        if (lineCount > 100) feedback.add("Code is lengthy — consider breaking into smaller methods.");
        else if (lineCount > 5) feedback.add("Code length is reasonable and well-structured.");
        else feedback.add("Code is very concise.");

        if (code.contains("//") || code.contains("/*")) feedback.add("Good: includes comments for readability.");
        else feedback.add("Consider adding comments to explain key logic.");

        if (code.contains("try") && code.contains("catch")) feedback.add("Good: includes error/exception handling.");
        else feedback.add("Consider adding error handling for edge cases.");

        feedback.add("Variable naming follows readable conventions.");
        return feedback;
    }

    private List<String> analyzeSuggestions(String code) {
        List<String> suggestions = new java.util.ArrayList<>();

        if (code.contains("Scanner")) suggestions.add("Consider BufferedReader for faster I/O in competitive programming.");
        if (code.contains("HashMap") && code.contains("containsKey")) suggestions.add("Use getOrDefault() or computeIfAbsent() instead of separate containsKey + get calls.");
        if (code.contains("ArrayList") && code.contains(".remove(")) suggestions.add("ArrayList.remove() is O(n). Consider LinkedList if frequent removal is needed.");

        if (suggestions.isEmpty()) {
            suggestions.add("Code looks efficient for the given approach.");
            suggestions.add("Consider edge cases: empty input, single element, max constraints.");
        }
        return suggestions;
    }

    private int estimateScore(String code) {
        int score = 60;
        if (code.contains("//") || code.contains("/*")) score += 10;
        if (code.lines().count() > 5) score += 5;
        if (code.contains("try") && code.contains("catch")) score += 10;
        if (code.contains("Scanner") || code.contains("BufferedReader")) score += 5;
        return Math.min(score, 95);
    }
}
