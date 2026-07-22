package com.platform.ai_platform.modules.dsa.repository;

import com.platform.ai_platform.modules.dsa.entity.DsaTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DsaTopicRepository extends JpaRepository<DsaTopic, Long> {
    Optional<DsaTopic> findByName(String name);
    boolean existsByName(String name);
}
