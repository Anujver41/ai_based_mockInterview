package com.platform.ai_platform.modules.iam.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        String email,
        String role,
        UUID id
) {}
