package com.platform.ai_platform.modules.dsa.dto;

import java.util.UUID;

public record NextProblemRequest(
    UUID userId,
    String topic
) {}
