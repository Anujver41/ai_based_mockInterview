package com.platform.ai_platform.modules.dsa.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_topic_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "topic_name"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTopicProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "topic_name", nullable = false)
    private String topicName; // matches DsaTopic.name

    @Enumerated(EnumType.STRING)
    @Column(name = "current_difficulty", nullable = false)
    private TopicDifficulty currentDifficulty;

    @Column(name = "easy_done", nullable = false)
    @Builder.Default
    private boolean easyDone = false;

    @Column(name = "medium_done", nullable = false)
    @Builder.Default
    private boolean mediumDone = false;

    @Column(name = "hard_done", nullable = false)
    @Builder.Default
    private boolean hardDone = false;

    @Column(name = "mastered", nullable = false)
    @Builder.Default
    private boolean mastered = false;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TopicDifficulty {
        EASY, MEDIUM, HARD
    }
}
