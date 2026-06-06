package com.platform.ai_platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.boot.autoconfigure.domain.EntityScan(basePackages = "com.platform.ai_platform")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories(basePackages = "com.platform.ai_platform")
public class AiPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiPlatformApplication.class, args);
	}

}
