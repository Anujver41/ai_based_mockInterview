package com.platform.ai_platform.modules.submission.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;

/**
 * Executes user-submitted code locally using system compilers/interpreters.
 * Supports: Java, Python, JavaScript (Node.js)
 *
 * Each execution runs in an isolated temp directory with a timeout.
 */
@Service
@Slf4j
public class CodeExecutionService {

    private static final long TIMEOUT_SECONDS = 10;

    /**
     * Result of executing code against a single test case.
     */
    public record ExecutionResult(
            boolean success,
            String actualOutput,
            String errorOutput,
            boolean timedOut
    ) {}

    /**
     * Compiles (if needed) and runs the given code with the provided stdin input.
     *
     * @param code     the source code
     * @param language the language id (java, python, javascript)
     * @param input    the stdin input to feed to the program
     * @return ExecutionResult with actual stdout, stderr, and status
     */
    public ExecutionResult execute(String code, String language, String input) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("code_exec_");
            return switch (language.toLowerCase()) {
                case "java" -> executeJava(code, input, tempDir);
                case "python" -> executePython(code, input, tempDir);
                case "javascript", "typescript" -> executeJavaScript(code, input, tempDir);
                default -> new ExecutionResult(false, "", "Unsupported language: " + language, false);
            };
        } catch (Exception e) {
            log.error("Code execution failed", e);
            return new ExecutionResult(false, "", "Execution error: " + e.getMessage(), false);
        } finally {
            // Clean up temp directory
            if (tempDir != null) {
                try {
                    deleteDirectory(tempDir);
                } catch (IOException e) {
                    log.warn("Failed to clean up temp dir: {}", tempDir, e);
                }
            }
        }
    }

    private ExecutionResult executeJava(String code, String input, Path tempDir) throws IOException, InterruptedException {
        // Write the source file
        Path sourceFile = tempDir.resolve("Solution.java");
        Files.writeString(sourceFile, code);

        // Compile
        ProcessBuilder compileBuilder = new ProcessBuilder("javac", sourceFile.toString());
        compileBuilder.directory(tempDir.toFile());
        compileBuilder.redirectErrorStream(false);

        Process compileProcess = compileBuilder.start();
        String compileError = readStream(compileProcess.getErrorStream());
        boolean compiled = compileProcess.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

        if (!compiled) {
            compileProcess.destroyForcibly();
            return new ExecutionResult(false, "", "Compilation timed out", true);
        }

        if (compileProcess.exitValue() != 0) {
            return new ExecutionResult(false, "", "Compilation Error:\n" + compileError, false);
        }

        // Run
        ProcessBuilder runBuilder = new ProcessBuilder("java", "-cp", tempDir.toString(), "Solution");
        runBuilder.directory(tempDir.toFile());
        return runProcess(runBuilder, input);
    }

    private ExecutionResult executePython(String code, String input, Path tempDir) throws IOException, InterruptedException {
        Path sourceFile = tempDir.resolve("solution.py");
        Files.writeString(sourceFile, code);

        // Try python3 first, fall back to python
        String pythonCmd = isProgramAvailable("python3") ? "python3" : "python";

        ProcessBuilder runBuilder = new ProcessBuilder(pythonCmd, sourceFile.toString());
        runBuilder.directory(tempDir.toFile());
        return runProcess(runBuilder, input);
    }

    private ExecutionResult executeJavaScript(String code, String input, Path tempDir) throws IOException, InterruptedException {
        Path sourceFile = tempDir.resolve("solution.js");
        Files.writeString(sourceFile, code);

        ProcessBuilder runBuilder = new ProcessBuilder("node", sourceFile.toString());
        runBuilder.directory(tempDir.toFile());
        return runProcess(runBuilder, input);
    }

    private ExecutionResult runProcess(ProcessBuilder processBuilder, String input) throws IOException, InterruptedException {
        processBuilder.redirectErrorStream(false);
        Process process = processBuilder.start();

        // Feed stdin
        if (input != null && !input.isEmpty()) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(input.getBytes());
                os.flush();
            }
        } else {
            process.getOutputStream().close();
        }

        // Read stdout and stderr concurrently to avoid blocking
        Future<String> stdoutFuture = Executors.newSingleThreadExecutor().submit(() -> readStream(process.getInputStream()));
        Future<String> stderrFuture = Executors.newSingleThreadExecutor().submit(() -> readStream(process.getErrorStream()));

        boolean finished = process.waitFor(TIMEOUT_SECONDS, TimeUnit.SECONDS);

        if (!finished) {
            process.destroyForcibly();
            return new ExecutionResult(false, "", "Time Limit Exceeded (>" + TIMEOUT_SECONDS + "s)", true);
        }

        String stdout = "";
        String stderr = "";
        try {
            stdout = stdoutFuture.get(2, TimeUnit.SECONDS);
            stderr = stderrFuture.get(2, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Error reading process output", e);
        }

        if (process.exitValue() != 0) {
            return new ExecutionResult(false, stdout.trim(), "Runtime Error:\n" + stderr.trim(), false);
        }

        return new ExecutionResult(true, stdout.trim(), stderr.trim(), false);
    }

    private String readStream(InputStream stream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (sb.length() > 0) sb.append("\n");
                sb.append(line);
            }
        }
        return sb.toString();
    }

    private boolean isProgramAvailable(String program) {
        try {
            Process p = new ProcessBuilder(program, "--version").start();
            p.waitFor(2, TimeUnit.SECONDS);
            p.destroyForcibly();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void deleteDirectory(Path dir) throws IOException {
        if (Files.exists(dir)) {
            Files.walk(dir)
                    .sorted((a, b) -> b.compareTo(a)) // reverse order to delete children first
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException e) {
                            // ignore
                        }
                    });
        }
    }
}
