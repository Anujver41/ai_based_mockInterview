package com.platform.ai_platform.modules.resume.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.ai_platform.common.exception.AiProcessingException;
import com.platform.ai_platform.modules.resume.dto.ResumeAnalyzeResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ResumeAnalyzerService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    public ResumeAnalyzerService(ObjectMapper objectMapper) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public ResumeAnalyzeResponse analyzeResume(MultipartFile file, String jobDescription) {
        if (file.isEmpty() || !isPdf(file)) {
            throw new IllegalArgumentException("Invalid file. Please upload a valid PDF.");
        }

        String resumeText;
        try {
            resumeText = extractTextFromPdf(file);
        } catch (IOException e) {
            log.error("Failed to parse PDF", e);
            throw new RuntimeException("Error parsing the resume PDF", e);
        }

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new IllegalArgumentException("The uploaded PDF does not contain any readable text.");
        }

        log.info("Extracted text from resume, length: {}", resumeText.length());

        return callGeminiForAnalysis(resumeText, jobDescription);
    }

    private boolean isPdf(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.equalsIgnoreCase("application/pdf");
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private ResumeAnalyzeResponse callGeminiForAnalysis(String resumeText, String jobDescription) {
        String prompt = buildPrompt(resumeText, jobDescription);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model
                + ":generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "maxOutputTokens", 2048,
                        "responseMimeType", "application/json"
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

            String jsonResponse = textNode.asText();
            return parseResponse(jsonResponse);
        } catch (Exception e) {
            log.error("Failed to call Gemini API for resume analysis", e);
            throw new AiProcessingException("Failed to analyze resume: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String resumeText, String jobDescription) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert ATS (Applicant Tracking System) and a Senior Technical Recruiter. ");
        sb.append("Please analyze the following resume text ");
        
        if (jobDescription != null && !jobDescription.trim().isEmpty()) {
            sb.append("against the provided job description.\n\n");
            sb.append("Job Description:\n").append(jobDescription).append("\n\n");
        } else {
            sb.append("for general Software Engineering roles.\n\n");
        }

        sb.append("Resume Text:\n").append(resumeText).append("\n\n");
        
        sb.append("Respond ONLY with a valid JSON object matching this exact structure:\n");
        sb.append("{\n");
        sb.append("  \"atsScore\": <integer from 0 to 100>,\n");
        sb.append("  \"improvementSuggestions\": [\"<suggestion 1>\", \"<suggestion 2>\"],\n");
        sb.append("  \"missingKeywords\": [\"<keyword 1>\", \"<keyword 2>\"],\n");
        sb.append("  \"overallFeedback\": \"<a short paragraph of overall feedback>\"\n");
        sb.append("}\n");

        return sb.toString();
    }

    private ResumeAnalyzeResponse parseResponse(String raw) {
        try {
            String cleaned = raw.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceAll("(?s)^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
            }
            return objectMapper.readValue(cleaned, ResumeAnalyzeResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse JSON response from Gemini", e);
            throw new AiProcessingException("Failed to parse analysis results");
        }
    }
}
