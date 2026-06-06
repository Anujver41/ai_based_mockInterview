package com.platform.ai_platform.modules.submission.service;

import com.platform.ai_platform.modules.submission.domain.entity.Submission;
import com.platform.ai_platform.modules.submission.domain.enums.SubmissionStatus;
import com.platform.ai_platform.modules.submission.dto.SubmissionRequest;
import com.platform.ai_platform.modules.submission.dto.SubmissionResponse;
import com.platform.ai_platform.modules.submission.kafka.event.SubmissionEvent;
import com.platform.ai_platform.modules.submission.kafka.producer.SubmissionProducer;
import com.platform.ai_platform.modules.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionProducer submissionProducer;

    @Transactional
    public SubmissionResponse submitCode(SubmissionRequest request) {
        log.info("Received code submission for user: {}, problem: {}", request.getUserId(), request.getProblemId());

        Submission submission = Submission.builder()
                .userId(request.getUserId())
                .problemId(request.getProblemId())
                .code(request.getCode())
                .language(request.getLanguage())
                .status(SubmissionStatus.PENDING)
                .isRun(request.getIsRun() != null ? request.getIsRun() : false)
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        SubmissionEvent event = SubmissionEvent.builder()
                .submissionId(savedSubmission.getId())
                .problemId(savedSubmission.getProblemId())
                .code(savedSubmission.getCode())
                .language(savedSubmission.getLanguage())
                .build();

        submissionProducer.sendSubmissionEvent(event);

        return mapToResponse(savedSubmission);
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionStatus(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found with id: " + submissionId));
        return mapToResponse(submission);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getUserSubmissions(UUID userId) {
        return submissionRepository.findByUserIdAndIsRunFalse(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .userId(submission.getUserId())
                .problemId(submission.getProblemId())
                .code(submission.getCode())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .errorMessage(submission.getErrorMessage())
                .isRun(submission.getIsRun())
                .createdAt(submission.getCreatedAt())
                .build();
    }
}
