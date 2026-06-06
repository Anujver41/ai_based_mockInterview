package com.platform.ai_platform.modules.github.controller;

import com.platform.ai_platform.modules.github.dto.GithubAnalyzerResponse;
import com.platform.ai_platform.modules.github.service.GithubAnalyzerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/github")
@RequiredArgsConstructor
public class GithubController {

    private final GithubAnalyzerService githubAnalyzerService;

    @GetMapping("/analyze/{username}")
    public ResponseEntity<GithubAnalyzerResponse> analyzeGithubProfile(@PathVariable String username) {
        return ResponseEntity.ok(githubAnalyzerService.analyzeGithubProfile(username));
    }
}
