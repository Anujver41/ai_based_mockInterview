package com.platform.ai_platform.modules.ai.controller;

import com.platform.ai_platform.modules.ai.dto.CodeReviewRequest;
import com.platform.ai_platform.modules.ai.dto.CodeReviewResponse;
import com.platform.ai_platform.modules.ai.service.CodeReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai/review")
@RequiredArgsConstructor
public class AiController {

    private final CodeReviewService codeReviewService;

    @PostMapping
    public ResponseEntity<CodeReviewResponse> reviewCode(@Valid @RequestBody CodeReviewRequest request) {
        CodeReviewResponse response = codeReviewService.reviewCode(request);
        return ResponseEntity.ok(response);
    }
}
