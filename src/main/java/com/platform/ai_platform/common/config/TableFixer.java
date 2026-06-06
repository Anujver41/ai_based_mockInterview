package com.platform.ai_platform.common.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TableFixer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixSubmissionsTable() {
        try {
            // Check if problem_id column is already UUID type
            String columnType = jdbcTemplate.queryForObject(
                "SELECT data_type FROM information_schema.columns WHERE table_name = 'submissions' AND column_name = 'problem_id'",
                String.class
            );

            if ("uuid".equalsIgnoreCase(columnType)) {
                log.info("submissions.problem_id is already UUID. No fix needed.");
                return;
            }

            log.info("Fixing submissions.problem_id from {} to UUID...", columnType);
            // Drop and let JPA recreate since bigint values can't cast to UUID
            jdbcTemplate.execute("DROP TABLE IF EXISTS submissions CASCADE;");
            log.info("Dropped submissions table. JPA ddl-auto will recreate it.");
        } catch (Exception e) {
            // Table may not exist yet (first run) — that's fine, JPA will create it
            log.info("submissions table check skipped (may not exist yet): {}", e.getMessage());
        }
    }
}
