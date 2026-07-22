package com.platform.ai_platform.modules.dsa.dto;

import com.platform.ai_platform.modules.dsa.entity.UserTopicProgress.TopicDifficulty;

public record TopicProgressDto(
    String topicName,
    String icon,
    String phase,
    int topicOrder,
    TopicDifficulty currentDifficulty,
    boolean easyDone,
    boolean mediumDone,
    boolean hardDone,
    boolean mastered,
    boolean locked
) {}
