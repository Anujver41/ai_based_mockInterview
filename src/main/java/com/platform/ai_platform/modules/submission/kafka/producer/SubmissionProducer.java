package com.platform.ai_platform.modules.submission.kafka.producer;

import com.platform.ai_platform.modules.submission.kafka.event.SubmissionEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.platform.ai_platform.modules.submission.service.EvaluationService;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionProducer {

    // private final KafkaTemplate<String, Object> kafkaTemplate;
    private final EvaluationService evaluationService;
    private static final String TOPIC = "code_submissions";

    public void sendSubmissionEvent(SubmissionEvent event) {
        log.info("Kafka is temporarily disabled. Forwarding to evaluation directly: {}", event);
        // kafkaTemplate.send(TOPIC, String.valueOf(event.getSubmissionId()), event);
        evaluationService.evaluate(event.getSubmissionId(), event.getProblemId(), event.getCode(), event.getLanguage());
    }
}
