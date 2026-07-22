package com.platform.ai_platform.modules.dsa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dsa_topics")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DsaTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // "Array", "Sliding Window", etc.

    @Column(name = "topic_order", nullable = false)
    private int topicOrder; // sequence in roadmap

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String icon; // emoji like "📦"

    @Column(nullable = false)
    private String phase; // "Fundamentals", "Core DS", "Advanced DS", "Algorithms"
}
