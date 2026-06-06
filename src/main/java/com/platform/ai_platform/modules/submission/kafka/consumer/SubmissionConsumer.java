package com.platform.ai_platform.modules.submission.kafka.consumer;

import com.platform.ai_platform.modules.submission.kafka.event.SubmissionEvent;
import com.platform.ai_platform.modules.submission.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionConsumer {

    private final EvaluationService evaluationService;

    // @KafkaListener(topics = "code_submissions", groupId = "evaluation-group")
    public void consumeSubmissionEvent(SubmissionEvent event) {
        log.info("Received submission event from Kafka: {}", event);
        try {
            evaluationService.evaluate(
                    event.getSubmissionId(),
                    event.getProblemId(),
                    event.getCode(),
                    event.getLanguage()
            );
        } catch (Exception e) {
            log.error("Error processing submission event: {}", event, e);
        }
    }
}
