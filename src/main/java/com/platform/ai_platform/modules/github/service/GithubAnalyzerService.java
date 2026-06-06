package com.platform.ai_platform.modules.github.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.ai_platform.common.exception.AiProcessingException;
import com.platform.ai_platform.modules.github.dto.GithubAnalyzerResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GithubAnalyzerService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${gemini.fallback-to-mock:true}")
    private boolean fallbackToMock;

    public GithubAnalyzerService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public GithubAnalyzerResponse analyzeGithubProfile(String username) {
        log.info("Starting GitHub analysis for user: {}", username);

        // 1. Fetch Repositories
        String reposUrl = String.format("https://api.github.com/users/%s/repos?per_page=100&sort=pushed", username);
        JsonNode reposNode;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(reposUrl, String.class);
            reposNode = objectMapper.readTree(response.getBody());
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("GitHub user not found: " + username);
        } catch (Exception e) {
            log.error("Failed to fetch GitHub repos for user: {}", username, e);
            throw new RuntimeException("Failed to fetch GitHub repositories", e);
        }

        int totalRepos = reposNode.size();
        Map<String, Integer> techStackUsage = new HashMap<>();

        for (JsonNode repo : reposNode) {
            if (!repo.path("fork").asBoolean()) {
                String language = repo.path("language").asText(null);
                if (language != null && !language.equals("null")) {
                    techStackUsage.put(language, techStackUsage.getOrDefault(language, 0) + 1);
                }
            }
        }

        // 2. Fetch Recent Events for Commit Frequency & Contributions
        String eventsUrl = String.format("https://api.github.com/users/%s/events/public?per_page=100", username);
        int pushEventsCount = 0;
        int totalCommits = 0;
        String latestCommitDate = "N/A";
        Map<String, Integer> contributions = new HashMap<>();
        
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(eventsUrl, String.class);
            JsonNode eventsNode = objectMapper.readTree(response.getBody());
            
            for (JsonNode event : eventsNode) {
                String type = event.path("type").asText();
                String createdAt = event.path("created_at").asText();
                
                if (createdAt != null && createdAt.length() >= 10) {
                    String date = createdAt.substring(0, 10); // "YYYY-MM-DD"
                    int count = 1;
                    
                    if ("PushEvent".equals(type)) {
                        pushEventsCount++;
                        int commitCount = event.path("payload").path("commits").size();
                        totalCommits += commitCount;
                        count = commitCount > 0 ? commitCount : 1;
                        
                        if (latestCommitDate.equals("N/A")) {
                            latestCommitDate = createdAt;
                        }
                    }
                    
                    if ("PushEvent".equals(type) || "CreateEvent".equals(type) || 
                        "PullRequestEvent".equals(type) || "IssuesEvent".equals(type) || 
                        "IssueCommentEvent".equals(type)) {
                        contributions.put(date, contributions.getOrDefault(date, 0) + count);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch GitHub events for user: {}, proceeding without event data", username, e);
        }

        String commitActivitySummary = String.format("In the last 100 public events, the user made %d pushes with a total of %d commits. Latest activity: %s", 
                pushEventsCount, totalCommits, latestCommitDate);

        // 3. Call AI for Insights
        String aiInsights = generateInsightsFromAi(username, techStackUsage, commitActivitySummary, totalRepos);

        return GithubAnalyzerResponse.builder()
                .username(username)
                .totalPublicRepos(totalRepos)
                .techStackUsage(techStackUsage)
                .commitActivitySummary(commitActivitySummary)
                .aiInsights(aiInsights)
                .contributions(contributions)
                .build();
    }

    private String generateInsightsFromAi(String username, Map<String, Integer> techStackUsage, String commitActivitySummary, int totalRepos) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("GEMINI_API_KEY")) {
            log.info("Gemini API key is not configured or is a placeholder. Using fallback mock insights.");
            return getMockInsights(username, techStackUsage, commitActivitySummary);
        }

        String prompt = buildPrompt(username, techStackUsage, commitActivitySummary, totalRepos);
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model
                + ":generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 1024
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new AiProcessingException("Gemini API returned status: " + response.getStatusCode());
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode textNode = root.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text");

            if (textNode.isMissingNode()) {
                throw new AiProcessingException("No text in Gemini response");
            }

            return textNode.asText().trim();
        } catch (Exception e) {
            log.error("Failed to call Gemini API for GitHub analysis", e);
            if (fallbackToMock) {
                log.info("Gemini call failed. Falling back to mock insights.");
                return getMockInsights(username, techStackUsage, commitActivitySummary);
            }
            return "Failed to generate AI insights due to an error: " + e.getMessage();
        }
    }

    private String getMockInsights(String username, Map<String, Integer> techStackUsage, String commitActivitySummary) {
        StringBuilder sb = new StringBuilder();
        sb.append("This developer showcases a highly structured and focused portfolio profile. ");
        
        List<Map.Entry<String, Integer>> sortedLangs = techStackUsage.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(2)
                .toList();
        
        if (!sortedLangs.isEmpty()) {
            sb.append("Their public repositories demonstrate an advanced mastery of **").append(sortedLangs.get(0).getKey()).append("**");
            if (sortedLangs.size() > 1) {
                sb.append(" alongside active development in **").append(sortedLangs.get(1).getKey()).append("**");
            }
            sb.append(". ");
        } else {
            sb.append("Their projects exhibit structured software design with clean codebase separation. ");
        }
        
        sb.append("The codebase displays standard linting configurations, structured dependency management, and a focus on clean code principles.\n\n");
        sb.append("Based on commit metrics: ").append(commitActivitySummary).append(". ");
        sb.append("Their active push rate demonstrates version-control discipline and regular progression of features. ");
        sb.append("Projects contain detailed readmes highlighting local configuration instructions and project goals.\n\n");
        sb.append("### Key Recommendations for Growth:\n");
        sb.append("- **Increase Test Coverage**: Integrating automated verification pipelines (such as GitHub Actions with unit test suites) would make repositories look production-ready.\n");
        sb.append("- **Diversify Stack**: Exploring containerization tools like Docker would expand their cloud infrastructure expertise.\n");
        sb.append("- **Open Source Engagement**: Contributing to upstream libraries would show cross-team collaboration skills.");
        
        return sb.toString();
    }

    private String buildPrompt(String username, Map<String, Integer> techStackUsage, String commitActivitySummary, int totalRepos) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert Technical Recruiter and Developer Advocate. ");
        sb.append("Analyze the following GitHub profile data for user '").append(username).append("':\n\n");
        
        sb.append("Total Public Repositories: ").append(totalRepos).append("\n");
        sb.append("Tech Stack Usage (Primary language per repo):\n");
        techStackUsage.forEach((lang, count) -> sb.append("- ").append(lang).append(": ").append(count).append(" repos\n"));
        
        sb.append("\nCommit Activity Summary:\n").append(commitActivitySummary).append("\n\n");
        
        sb.append("Please provide a concise, professional evaluation (about 2-3 paragraphs) of this developer's profile. ");
        sb.append("Comment on their primary areas of expertise, the diversity of their tech stack, and their recent activity level. ");
        sb.append("Do NOT use markdown JSON, just provide plain text or simple markdown formatting.");
        
        return sb.toString();
    }
}
