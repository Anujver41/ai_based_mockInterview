package com.platform.ai_platform.modules.problem.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCase implements Serializable {
    private String input;
    private String expectedOutput;
    private boolean isHidden;
}
