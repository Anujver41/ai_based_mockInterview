package com.platform.ai_platform.modules.resume.controller;

import com.platform.ai_platform.modules.resume.dto.ResumeAnalyzeResponse;
import com.platform.ai_platform.modules.resume.service.ResumeAnalyzerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeAnalyzerService resumeAnalyzerService;

    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalyzeResponse> analyzeResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription) {
        
        ResumeAnalyzeResponse response = resumeAnalyzerService.analyzeResume(file, jobDescription);
        return ResponseEntity.ok(response);
    }
}
