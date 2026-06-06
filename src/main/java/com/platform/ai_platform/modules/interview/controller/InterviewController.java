package com.platform.ai_platform.modules.interview.controller;

import com.platform.ai_platform.modules.iam.entity.User;
import com.platform.ai_platform.modules.interview.dto.*;
import com.platform.ai_platform.modules.interview.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/start")
    public ResponseEntity<InterviewSessionResponse> startSession(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StartInterviewRequest request) {
        return new ResponseEntity<>(interviewService.startSession(user.getId(), request), HttpStatus.CREATED);
    }

    @PostMapping("/{sessionId}/chat")
    public ResponseEntity<InterviewMessageResponse> chat(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(interviewService.chat(sessionId, user.getId(), request));
    }

    @GetMapping
    public ResponseEntity<List<InterviewSessionResponse>> getUserSessions(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(interviewService.getUserSessions(user.getId()));
    }

    @GetMapping("/{sessionId}/messages")
    public ResponseEntity<List<InterviewMessageResponse>> getSessionMessages(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(interviewService.getSessionMessages(sessionId, user.getId()));
    }

    @PutMapping("/{sessionId}/end")
    public ResponseEntity<InterviewSessionResponse> endSession(
            @PathVariable UUID sessionId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(interviewService.endSession(sessionId, user.getId()));
    }
}
