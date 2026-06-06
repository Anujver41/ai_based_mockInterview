package com.platform.ai_platform.modules.submission.service;

import com.platform.ai_platform.modules.problem.entity.Problem;
import com.platform.ai_platform.modules.problem.entity.TestCase;
import com.platform.ai_platform.modules.problem.repository.ProblemRepository;
import com.platform.ai_platform.modules.submission.domain.entity.Submission;
import com.platform.ai_platform.modules.submission.domain.enums.SubmissionStatus;
import com.platform.ai_platform.modules.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final CodeExecutionService codeExecutionService;

    @Transactional
    public void evaluate(Long submissionId, UUID problemId, String code, String language) {
        log.info("Evaluating submissionId: {} for problemId: {}", submissionId, problemId);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        // Set status to RUNNING
        submission.setStatus(SubmissionStatus.RUNNING);
        submissionRepository.save(submission);

        // Fetch the problem and its test cases
        Problem problem = problemRepository.findById(problemId).orElse(null);
        if (problem == null) {
            submission.setStatus(SubmissionStatus.FAILED);
            submission.setErrorMessage("Problem not found with id: " + problemId);
            submissionRepository.save(submission);
            return;
        }

        List<TestCase> testCases = problem.getTestCases();
        if (testCases == null || testCases.isEmpty()) {
            // No test cases defined — accept by default
            submission.setStatus(SubmissionStatus.PASSED);
            submissionRepository.save(submission);
            log.info("No test cases for problem {}. Auto-passing.", problemId);
            return;
        }

        // Run code against each test case
        for (int i = 0; i < testCases.size(); i++) {
            TestCase tc = testCases.get(i);
            String input = tc.getInput();
            String expectedOutput = tc.getExpectedOutput().trim();

            log.info("Running test case {} for submission {}", i + 1, submissionId);

            CodeExecutionService.ExecutionResult result = codeExecutionService.execute(code, language, input);

            // Check for execution errors (compilation error, runtime error, TLE)
            if (!result.success()) {
                String errorDetail = buildErrorMessage(i + 1, testCases.size(), tc, result);
                submission.setStatus(SubmissionStatus.FAILED);
                submission.setErrorMessage(errorDetail);
                submissionRepository.save(submission);
                log.info("Submission {} failed on test case {}: {}", submissionId, i + 1, result.errorOutput());
                return;
            }

            // Compare actual output vs expected output
            String actualOutput = result.actualOutput().trim();
            if (!actualOutput.equals(expectedOutput)) {
                String errorDetail = buildWrongAnswerMessage(i + 1, testCases.size(), tc, actualOutput);
                submission.setStatus(SubmissionStatus.FAILED);
                submission.setErrorMessage(errorDetail);
                submissionRepository.save(submission);
                log.info("Submission {} wrong answer on test case {}. Expected: '{}', Got: '{}'",
                        submissionId, i + 1, expectedOutput, actualOutput);
                return;
            }

            log.info("Test case {} passed for submission {}", i + 1, submissionId);
        }

        // All test cases passed!
        submission.setStatus(SubmissionStatus.PASSED);
        submission.setErrorMessage(null);
        submissionRepository.save(submission);
        log.info("Submission {} passed all {} test cases!", submissionId, testCases.size());
    }

    private String buildErrorMessage(int testCaseNum, int totalTestCases, TestCase tc, CodeExecutionService.ExecutionResult result) {
        StringBuilder sb = new StringBuilder();

        if (result.timedOut()) {
            sb.append("⏱ Time Limit Exceeded on Test Case ").append(testCaseNum).append("/").append(totalTestCases);
        } else {
            sb.append("❌ ").append(result.errorOutput().contains("Compilation Error") ? "Compilation Error" : "Runtime Error");
            sb.append(" on Test Case ").append(testCaseNum).append("/").append(totalTestCases);
        }

        sb.append("\n\n");
        if (!tc.isHidden()) {
            sb.append("Input:\n").append(tc.getInput()).append("\n\n");
            sb.append("Expected Output:\n").append(tc.getExpectedOutput()).append("\n\n");
        }
        sb.append("Error:\n").append(result.errorOutput());

        return sb.toString();
    }

    private String buildWrongAnswerMessage(int testCaseNum, int totalTestCases, TestCase tc, String actualOutput) {
        StringBuilder sb = new StringBuilder();
        sb.append("❌ Wrong Answer on Test Case ").append(testCaseNum).append("/").append(totalTestCases);
        sb.append("\n\n");

        if (!tc.isHidden()) {
            sb.append("Input:\n").append(tc.getInput()).append("\n\n");
            sb.append("Expected Output:\n").append(tc.getExpectedOutput().trim()).append("\n\n");
            sb.append("Your Output:\n").append(actualOutput);
        } else {
            sb.append("This is a hidden test case. Your output did not match the expected result.");
        }

        return sb.toString();
    }
}
