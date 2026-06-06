package com.platform.ai_platform.modules.submission.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionEvent {
    private Long submissionId;
    private UUID problemId;
    private String code;
    private String language;
}
