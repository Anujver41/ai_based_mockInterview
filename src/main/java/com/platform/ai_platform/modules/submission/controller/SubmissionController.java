package com.platform.ai_platform.modules.submission.controller;

import com.platform.ai_platform.modules.submission.dto.SubmissionRequest;
import com.platform.ai_platform.modules.submission.dto.SubmissionResponse;
import com.platform.ai_platform.modules.submission.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<SubmissionResponse> submitCode(@Valid @RequestBody SubmissionRequest request) {
        SubmissionResponse response = submissionService.submitCode(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmissionStatus(@PathVariable Long id) {
        SubmissionResponse response = submissionService.getSubmissionStatus(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubmissionResponse>> getUserSubmissions(@PathVariable UUID userId) {
        List<SubmissionResponse> responses = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(responses);
    }
}
