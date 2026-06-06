package com.platform.ai_platform.modules.interview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.ai_platform.common.exception.AiProcessingException;
import com.platform.ai_platform.common.exception.ResourceNotFoundException;
import com.platform.ai_platform.modules.iam.entity.User;
import com.platform.ai_platform.modules.iam.repository.UserRepository;
import com.platform.ai_platform.modules.interview.dto.*;
import com.platform.ai_platform.modules.interview.entity.*;
import com.platform.ai_platform.modules.interview.repository.InterviewMessageRepository;
import com.platform.ai_platform.modules.interview.repository.InterviewSessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${gemini.fallback-to-mock:false}")
    private boolean fallbackToMock;

    public InterviewService(InterviewSessionRepository sessionRepository,
                            InterviewMessageRepository messageRepository,
                            UserRepository userRepository,
                            ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    @Transactional
    public InterviewSessionResponse startSession(UUID userId, StartInterviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InterviewSession session = InterviewSession.builder()
                .user(user)
                .topic(request.getTopic())
                .difficulty(request.getDifficulty())
                .status(InterviewStatus.STARTED)
                .build();
        
        session = sessionRepository.save(session);

        String systemPrompt = String.format("You are an expert technical interviewer at a top tech company. " +
                "You are interviewing a candidate for a Software Engineering role. " +
                "The topic is '%s' and the difficulty is '%s'. " +
                "Start by greeting the candidate and giving them a DSA coding question relevant to the topic. " +
                "Keep your responses concise. Do NOT provide the solution immediately. " +
                "Wait for the candidate to provide their approach or code. " +
                "You MUST evaluate their code correctness, approach, and their time/space complexity analysis. " +
                "If they miss the approach or complexities, ask for them. " +
                "Once the first question is fully resolved and evaluated, ask exactly one more coding question. " +
                "After the second question is resolved and evaluated, conclude the interview. " +
                "In your conclusion, you MUST give a final score out of 10 based on code review, complexity analysis, approach, and explanation.", 
                request.getTopic(), request.getDifficulty());

        InterviewMessage systemMessage = InterviewMessage.builder()
                .session(session)
                .role(MessageRole.SYSTEM)
                .content(systemPrompt)
                .build();
        messageRepository.save(systemMessage);

        String aiResponse = callGeminiChat(List.of(systemMessage));

        InterviewMessage aiMessage = InterviewMessage.builder()
                .session(session)
                .role(MessageRole.AI)
                .content(aiResponse)
                .build();
        messageRepository.save(aiMessage);

        return mapToSessionResponse(session);
    }

    @Transactional
    public InterviewMessageResponse chat(UUID sessionId, UUID userId, ChatRequest request) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Session does not belong to user");
        }

        if (session.getStatus() != InterviewStatus.STARTED) {
            throw new IllegalArgumentException("Session is not active");
        }

        InterviewMessage userMessage = InterviewMessage.builder()
                .session(session)
                .role(MessageRole.USER)
                .content(request.getContent())
                .build();
        messageRepository.save(userMessage);

        List<InterviewMessage> history = messageRepository.findBySessionIdOrderByTimestampAsc(sessionId);

        String aiResponse = callGeminiChat(history);

        InterviewMessage aiMessage = InterviewMessage.builder()
                .session(session)
                .role(MessageRole.AI)
                .content(aiResponse)
                .build();
        messageRepository.save(aiMessage);

        return mapToMessageResponse(aiMessage);
    }
    
    @Transactional(readOnly = true)
    public List<InterviewSessionResponse> getUserSessions(UUID userId) {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToSessionResponse).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<InterviewMessageResponse> getSessionMessages(UUID sessionId, UUID userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Session does not belong to user");
        }
        
        return messageRepository.findBySessionIdOrderByTimestampAsc(sessionId)
                .stream()
                .filter(m -> m.getRole() != MessageRole.SYSTEM)
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewSessionResponse endSession(UUID sessionId, UUID userId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Session does not belong to user");
        }
        
        session.setStatus(InterviewStatus.COMPLETED);
        session = sessionRepository.save(session);
        return mapToSessionResponse(session);
    }

    private String callGeminiChat(List<InterviewMessage> history) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model
                + ":generateContent?key=" + apiKey;

        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> systemInstruction = null;
        String topic = "Arrays & Hashing";
        String difficulty = "EASY";
        
        for (InterviewMessage msg : history) {
            if (msg.getRole() == MessageRole.SYSTEM) {
                systemInstruction = Map.of("parts", List.of(Map.of("text", msg.getContent())));
                // Extract topic/difficulty for mock fallback if needed
                if (msg.getContent().contains("topic is '")) {
                    int start = msg.getContent().indexOf("topic is '") + 10;
                    int end = msg.getContent().indexOf("'", start);
                    if (start > 9 && end > start) {
                        topic = msg.getContent().substring(start, end);
                    }
                }
                if (msg.getContent().contains("difficulty is '")) {
                    int start = msg.getContent().indexOf("difficulty is '") + 15;
                    int end = msg.getContent().indexOf("'", start);
                    if (start > 14 && end > start) {
                        difficulty = msg.getContent().substring(start, end);
                    }
                }
                continue;
            }
            
            String role = (msg.getRole() == MessageRole.AI) ? "model" : "user";
            contents.add(Map.of(
                    "role", role,
                    "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }

        // If history only had system message (start session), we need to send a dummy "user" message 
        // to start the chat, since contents array cannot be empty.
        if (contents.isEmpty()) {
             contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", "Hello, I am ready for the interview."))
            ));
        }

        Map<String, Object> body = new HashMap<>();
        body.put("contents", contents);
        body.put("generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 2048
        ));
        
        if (systemInstruction != null) {
            body.put("systemInstruction", systemInstruction);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new AiProcessingException("Gemini API returned status: " + response.getStatusCode());
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode textNode = root.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text");

            if (textNode.isMissingNode()) {
                throw new AiProcessingException("No text in Gemini response");
            }

            return textNode.asText();
        } catch (Exception e) {
            log.error("Failed to call Gemini chat API. Checking fallback configuration...", e);
            if (fallbackToMock) {
                log.info("Returning simulated response for topic: {}, difficulty: {}", topic, difficulty);
                return getMockInterviewResponse(history, topic, difficulty);
            }
            throw new AiProcessingException("Failed to process chat response: " + e.getMessage(), e);
        }
    }

    private String getMockInterviewResponse(List<InterviewMessage> history, String topic, String difficulty) {
        // Count non-system messages
        long userMsgCount = history.stream().filter(m -> m.getRole() == MessageRole.USER).count();
        
        if (userMsgCount <= 0) {
            // This is the start of the interview
            switch (topic) {
                case "Arrays & Hashing":
                    return "Hello! Welcome to your technical interview. Today we will focus on Arrays & Hashing. Let's start with a classic problem: **Two Sum**.\n\n" +
                           "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n" +
                           "You may assume that each input would have exactly one solution, and you may not use the same element twice. How would you approach this problem?";
                case "Trees & Graphs":
                    return "Hello! Let's begin the interview. For Trees & Graphs, let's explore **Binary Tree Level Order Traversal**.\n\n" +
                           "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).\n\n" +
                           "What approach or algorithm would you use to solve this?";
                case "Dynamic Programming":
                    return "Hello! Today we'll cover Dynamic Programming. Let's discuss the **Climbing Stairs** problem.\n\n" +
                           "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n" +
                           "Could you describe your thoughts on how to break this down?";
                case "Linked Lists":
                    return "Welcome! For our interview on Linked Lists, let's tackle **Reverse a Linked List**.\n\n" +
                           "Given the head of a singly linked list, reverse the list and return its new head.\n\n" +
                           "How would you implement this iteratively or recursively?";
                case "Sorting & Searching":
                    return "Hello! Let's start with **Search in Rotated Sorted Array**.\n\n" +
                           "You are given a sorted integer array that has been rotated at some pivot. Search for a target value with O(log n) runtime complexity.\n\n" +
                           "How would you approach finding the target efficiently?";
                case "System Design":
                    return "Welcome to the System Design interview. Let's design a high-throughput, highly available URL Shortener (like Bit.ly).\n\n" +
                           "What are the key functional and non-functional requirements, API designs, and database schemas you would propose?";
                default:
                    return "Hello! Welcome to your technical interview. Let's start by discussing a standard DSA problem. Given an array of integers, how would you find the maximum sum of a contiguous subarray? What is your initial approach?";
            }
        } else if (userMsgCount == 1) {
            return "Thanks for sharing your solution. Let's analyze it. Your approach looks generally correct, but can you specifically explain why you chose this data structure and what the exact time and space complexities are?";
        } else if (userMsgCount == 2) {
            String q2 = "";
            switch (topic) {
                case "Arrays & Hashing":
                    q2 = "Given an array of integers, write a function to move all 0's to the end of it while maintaining the relative order of the non-zero elements.\n\nHow would you approach this in-place?";
                    break;
                case "Trees & Graphs":
                    q2 = "Given the root of a binary tree, invert the tree, and return its root.\n\nHow would you approach this recursively or iteratively?";
                    break;
                case "Dynamic Programming":
                    q2 = "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nWhat is the most optimal approach here?";
                    break;
                case "Linked Lists":
                    q2 = "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nHow would you solve this with O(1) memory?";
                    break;
                case "Sorting & Searching":
                    q2 = "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.\n\nHow would you approach this effectively?";
                    break;
                case "System Design":
                    q2 = "Now, let's consider scale. How would you design a rate limiter to protect our API from being overwhelmed by too many requests?\n\nWhat algorithms and data stores would you use?";
                    break;
                default:
                    q2 = "Let's move to a second question. Given a string, find the first non-repeating character in it and return its index. If it does not exist, return -1.\n\nHow would you approach this?";
            }
            return "Great analysis. You correctly identified the complexities and your approach is optimal.\n\nNow, let's move on to the second question.\n\n" + q2;
        } else if (userMsgCount == 3) {
            return "I see your logic. To ensure it works in all edge cases, could you write out the code and walk me through your time and space complexity analysis for this in-place approach?";
        } else {
            return "Spot on. Your time and space complexities are accurate, and your code handles the constraints well.\n\n" +
                   "That concludes our technical interview.\n\n" +
                   "**Feedback & Score:**\n" +
                   "- **Code Review**: Solid logic, minor optimizations possible.\n" +
                   "- **Approach**: Clear explanations and good choice of data structures.\n" +
                   "- **Complexity Analysis**: Accurate.\n" +
                   "- **Overall Score**: 8.5/10. \n\n" +
                   "Do you have any questions for me?";
        }
    }

    private InterviewSessionResponse mapToSessionResponse(InterviewSession session) {
        return InterviewSessionResponse.builder()
                .id(session.getId())
                .topic(session.getTopic())
                .difficulty(session.getDifficulty())
                .status(session.getStatus() != null ? session.getStatus().name() : null)
                .createdAt(session.getCreatedAt())
                .build();
    }

    private InterviewMessageResponse mapToMessageResponse(InterviewMessage message) {
        return InterviewMessageResponse.builder()
                .id(message.getId())
                .role(message.getRole().name())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
