package com.platform.ai_platform.modules.problem.service;

import com.platform.ai_platform.common.exception.ResourceNotFoundException;
import com.platform.ai_platform.modules.problem.dto.ProblemCreateRequest;
import com.platform.ai_platform.modules.problem.dto.ProblemDto;
import com.platform.ai_platform.modules.problem.dto.ProblemUpdateRequest;
import com.platform.ai_platform.modules.problem.entity.Problem;
import com.platform.ai_platform.modules.problem.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;

    @Transactional
    public ProblemDto createProblem(ProblemCreateRequest request) {
        if (problemRepository.existsByTitle(request.title())) {
            throw new IllegalArgumentException("Problem with title already exists");
        }

        Problem problem = Problem.builder()
                .title(request.title())
                .description(request.description())
                .difficulty(request.difficulty())
                .tags(request.tags())
                .constraints(request.constraints())
                .testCases(request.testCases())
                .build();

        problem = problemRepository.save(problem);
        return mapToDto(problem);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "problems", key = "#id")
    public ProblemDto getProblemById(UUID id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));
        return mapToDto(problem);
    }

    @Transactional(readOnly = true)
    public Page<ProblemDto> getAllProblems(Pageable pageable) {
        return problemRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional
    @CachePut(value = "problems", key = "#id")
    public ProblemDto updateProblem(UUID id, ProblemUpdateRequest request) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));

        if (request.title() != null) problem.setTitle(request.title());
        if (request.description() != null) problem.setDescription(request.description());
        if (request.difficulty() != null) problem.setDifficulty(request.difficulty());
        if (request.tags() != null) problem.setTags(request.tags());
        if (request.constraints() != null) problem.setConstraints(request.constraints());
        if (request.testCases() != null) problem.setTestCases(request.testCases());

        problem = problemRepository.save(problem);
        return mapToDto(problem);
    }

    @Transactional
    @CacheEvict(value = "problems", key = "#id")
    public void deleteProblem(UUID id) {
        if (!problemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Problem not found");
        }
        problemRepository.deleteById(id);
    }

    private ProblemDto mapToDto(Problem problem) {
        return new ProblemDto(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getDifficulty(),
                problem.getTags() == null ? null : new java.util.ArrayList<>(problem.getTags()),
                problem.getConstraints() == null ? null : new java.util.ArrayList<>(problem.getConstraints()),
                problem.getTestCases() == null ? null : new java.util.ArrayList<>(problem.getTestCases())
        );
    }
}
