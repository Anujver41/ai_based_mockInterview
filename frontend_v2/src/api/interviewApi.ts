import apiClient from '@/api/axios';

const INTERVIEWS = '/interviews';

export interface StartInterviewRequest {
  topic: string;
  difficulty: string;
}

export interface ChatRequest {
  content: string;
}

export interface InterviewSessionResponse {
  id: string;
  topic: string;
  difficulty: string;
  status: 'STARTED' | 'COMPLETED' | 'ABORTED';
  createdAt: string;
  solvedCount?: number;
  totalQuestions?: number;
  score?: string;
}

export interface InterviewMessageResponse {
  id: string;
  role: 'USER' | 'AI' | 'SYSTEM';
  content: string;
  timestamp: string;
}

export interface InterviewProblem {
  title: string;
  description: string;
  examples: string[];
  optimalComplexity: { time: string; space: string; approach: string };
  hints: string[];
}

export const TOPIC_PROBLEMS: Record<string, { q1: InterviewProblem; q2: InterviewProblem }> = {
  'Arrays & Hashing': {
    q1: {
      title: 'Two Sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input has exactly one solution, and you may not use the same element twice.',
      examples: [
        'Input: nums = [2, 7, 11, 15], target = 9 -> Output: [0, 1] (nums[0] + nums[1] = 9)',
        'Input: nums = [3, 2, 4], target = 6 -> Output: [1, 2]'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(N)', approach: 'One-pass Hash Map storing element indices' },
      hints: [
        'Think about storing the complement (target - num) in a hash table as you iterate through the array.',
        'Can we look up if target - nums[i] was already seen in O(1) time?'
      ]
    },
    q2: {
      title: 'Move Zeroes',
      description: 'Given an integer array `nums`, move all `0`\'s to the end of it while maintaining the relative order of the non-zero elements.\nNote that you must do this in-place without making a copy of the array.',
      examples: [
        'Input: nums = [0, 1, 0, 3, 12] -> Output: [1, 3, 12, 0, 0]',
        'Input: nums = [0] -> Output: [0]'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(1)', approach: 'Two-pointer approach swapping non-zeros to the front' },
      hints: [
        'Use two pointers: one slow pointer tracking the position for the next non-zero element, and a fast pointer scanning through the array.',
        'Whenever the fast pointer encounters a non-zero element, swap it with the slow pointer and increment the slow pointer.'
      ]
    }
  },
  'Trees & Graphs': {
    q1: {
      title: 'Binary Tree Level Order Traversal',
      description: 'Given the `root` of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
      examples: [
        'Input: root = [3, 9, 20, null, null, 15, 7] -> Output: [[3], [9, 20], [15, 7]]'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(N)', approach: 'Breadth-First Search (BFS) using a Queue' },
      hints: [
        'Use a Queue (FIFO) to track nodes at each level. At the start of each level, record the queue size.',
        'Process exactly queue.size() nodes to form the current level array before moving to children.'
      ]
    },
    q2: {
      title: 'Invert Binary Tree',
      description: 'Given the `root` of a binary tree, invert the tree, and return its root.',
      examples: [
        'Input: root = [4, 2, 7, 1, 3, 6, 9] -> Output: [4, 7, 2, 9, 6, 3, 1]'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(H) where H is tree height', approach: 'Recursive or Iterative DFS/BFS swapping left and right children' },
      hints: [
        'At each node, swap root.left and root.right, then recursively invert both subtrees.',
        'What is your base case when root is null?'
      ]
    }
  },
  'Dynamic Programming': {
    q1: {
      title: 'Climbing Stairs',
      description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      examples: [
        'Input: n = 2 -> Output: 2 (1+1 or 2)',
        'Input: n = 3 -> Output: 3 (1+1+1, 1+2, 2+1)'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(1)', approach: 'Fibonacci recurrence with two variables' },
      hints: [
        'To reach step i, you could have come from step i-1 or step i-2. So ways(i) = ways(i-1) + ways(i-2).',
        'Can we compute this iteratively using just two variables instead of an array?'
      ]
    },
    q2: {
      title: 'Maximum Subarray (Kadane\'s Algorithm)',
      description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
      examples: [
        'Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> Output: 6 ([4, -1, 2, 1])'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(1)', approach: "Kadane's algorithm maintaining current sum and max sum" },
      hints: [
        'At each element, decide whether to add it to the existing subarray or start a new subarray: currentSum = max(num, currentSum + num).',
        'Keep track of the overall maximum encountered.'
      ]
    }
  },
  'Linked Lists': {
    q1: {
      title: 'Reverse Linked List',
      description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
      examples: [
        'Input: head = [1, 2, 3, 4, 5] -> Output: [5, 4, 3, 2, 1]'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(1)', approach: 'Three-pointer iterative reversal (prev, curr, next)' },
      hints: [
        'Keep a `prev` pointer initialized to null, and `curr` initialized to head. In each iteration, save `curr.next`, reverse `curr.next = prev`, then advance `prev` and `curr`.'
      ]
    },
    q2: {
      title: 'Linked List Cycle',
      description: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.',
      examples: [
        'Input: head = [3, 2, 0, -4], pos = 1 -> Output: true'
      ],
      optimalComplexity: { time: 'O(N)', space: 'O(1)', approach: "Floyd's Cycle-Finding Algorithm (slow and fast pointers)" },
      hints: [
        'Use two pointers moving at different speeds: slow moves 1 step, fast moves 2 steps.',
        'If there is a cycle, the fast pointer will eventually catch up and meet the slow pointer.'
      ]
    }
  },
  'Sorting & Searching': {
    q1: {
      title: 'Binary Search',
      description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.',
      examples: [
        'Input: nums = [-1, 0, 3, 5, 9, 12], target = 9 -> Output: 4',
        'Input: nums = [-1, 0, 3, 5, 9, 12], target = 2 -> Output: -1'
      ],
      optimalComplexity: { time: 'O(log N)', space: 'O(1)', approach: 'Iterative binary search with low and high pointers' },
      hints: [
        'Calculate mid = low + Math.floor((high - low) / 2) to avoid integer overflow.',
        'If nums[mid] === target, return mid. If nums[mid] < target, search right (low = mid + 1), else search left (high = mid - 1).'
      ]
    },
    q2: {
      title: 'Merge Intervals',
      description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      examples: [
        'Input: intervals = [[1,3],[2,6],[8,10],[15,18]] -> Output: [[1,6],[8,10],[15,18]]'
      ],
      optimalComplexity: { time: 'O(N log N)', space: 'O(N)', approach: 'Sort intervals by start time and merge greedily' },
      hints: [
        'First, sort the intervals based on their start times.',
        'Iterate through the sorted intervals. If the current interval overlaps with the previous (current.start <= prev.end), merge them by updating prev.end = max(prev.end, current.end).'
      ]
    }
  },
  'System Design': {
    q1: {
      title: 'Design a URL Shortener',
      description: 'Design a system like TinyURL that takes a long URL and generates a unique short alias. When the user visits the short alias, the service redirects them to the original long URL.',
      examples: [
        'encode("https://example.com/very/long/path") -> "http://tinyurl.com/aB3x9Z"',
        'decode("http://tinyurl.com/aB3x9Z") -> "https://example.com/very/long/path"'
      ],
      optimalComplexity: { time: 'O(1) encode/decode', space: 'O(N)', approach: 'Base62 encoding + bidirectional HashMap or relational DB + Redis cache' },
      hints: [
        'Consider using Base62 (a-z, A-Z, 0-9) to convert an auto-incrementing 64-bit integer ID into a compact 6-7 character string.',
        'How would you handle caching frequently accessed URLs?'
      ]
    },
    q2: {
      title: 'Design an API Rate Limiter',
      description: 'Design an in-memory or distributed Rate Limiter that allows a maximum number of requests per time window (e.g. 100 requests per minute per IP address).',
      examples: [
        'isAllowed("user-123") -> true (under threshold)',
        'isAllowed("user-123") -> false (exceeded 100 req/min)'
      ],
      optimalComplexity: { time: 'O(1) per check', space: 'O(U) where U is active users', approach: 'Token Bucket or Sliding Window Counter algorithm' },
      hints: [
        'Common algorithms include Token Bucket, Leaky Bucket, and Sliding Window Log / Counter.',
        'How would you handle concurrency or multi-threaded access without race conditions?'
      ]
    }
  }
};

export const getProblemsForTopic = (topic: string) => {
  return TOPIC_PROBLEMS[topic] || TOPIC_PROBLEMS['Arrays & Hashing'];
};

// Intelligent conversation generation for offline / mock mode
function generateContextualInterviewResponse(
  content: string,
  topic: string,
  history: InterviewMessageResponse[]
): string {
  const norm = content.toLowerCase().trim();
  const problems = getProblemsForTopic(topic);

  // Check if this is a code submission from editor
  if (content.startsWith('[Code Submission')) {
    const isPassing = content.includes('PASSED');
    const isQ2 = content.includes('Q2') || content.includes('2/2');

    if (isPassing) {
      if (isQ2) {
        return (
          `🏆 **CONGRATULATIONS! You have successfully solved Question 2 (${problems.q2.title})!**\n\n` +
          `🎯 **Final Assessment — All Questions Solved (2/2)!**\n` +
          `• **Overall Score**: 9.5 / 10 (Strong Hire)\n` +
          `• **Correctness**: 2/2 Problems Solved (100% test cases passed)\n` +
          `• **Time Complexity**: Optimal O(N) runtime verified\n` +
          `• **Space Complexity**: Optimal in-place memory usage\n` +
          `• **Code Quality**: Clean structure, edge cases handled gracefully\n\n` +
          `You have completely cleared this technical interview for **${topic}**! You can now click the red **"End Session"** button in the top right to record your 2/2 score in your interview history.`
        );
      } else {
        return (
          `🎉 **Excellent work! You have solved Question 1 (${problems.q1.title})! (1/2 Solved)**\n\n` +
          `• **Correctness**: 15/15 test cases passed.\n` +
          `• **Efficiency**: Optimal runtime and memory usage.\n` +
          `• **Code Style**: Clean structure and good readability.\n\n` +
          `When you are ready, switch to **Question 2: ${problems.q2.title}** by clicking the **"Q2: ${problems.q2.title}"** tab above the code editor to complete the interview!`
        );
      }
    } else {
      return (
        `I see you submitted your code, but some test cases failed.\n\n` +
        `Take a close look at the console output and the edge cases. Would you like a hint to help identify where the logic might be breaking?`
      );
    }
  }

  // 1. Ready / Greetings / Yes
  if (/^(yess*|yes|yeah|yep|sure|ready|i am ready|im ready|ok|okay|let'?s go|let'?s start|hello|hi|hey)/i.test(norm)) {
    return (
      `Awesome! Take a look at **${problems.q1.title}** in the code editor on your right.\n\n` +
      `Before you write the code, how would you approach solving this problem? ` +
      `Do you see a brute-force approach first, or an optimized way using a specific data structure?`
    );
  }

  // 2. Confusion / "what?" / "huh?"
  if (/^(what\??|what\s+do\s+you\s+mean|huh\??|i don'?t understand|pardon\??|confused)/i.test(norm)) {
    return (
      `Let me clarify! We are working on **${problems.q1.title}**.\n\n` +
      `Take a look at the starter code in the editor on your right. Your goal is to implement the solution function.\n\n` +
      `You can tell me your approach here in chat, or write your code directly in the editor and click **Run** to test it!`
    );
  }

  // 3. Complexity answers (O(1), O(N), O(N^2), etc.)
  if (/o\s*\(\s*1\s*\)/i.test(norm)) {
    return (
      `O(1) space is achievable if we don't use extra data structures, but usually requires O(N²) time for checking all pairs.\n\n` +
      `If we trade a little space and use **O(N) space** with a Hash Map, we can achieve optimal **O(N) time**! ` +
      `Would you like to try implementing the O(N) Hash Map solution in the editor on the right?`
    );
  }

  if (/o\s*\(\s*n\s*\)/i.test(norm)) {
    return (
      `🎯 **Exactly right!** O(N) time is the optimal time complexity for this problem.\n\n` +
      `By doing a single pass and looking up elements in O(1) average time, we get maximum efficiency.\n\n` +
      `Go ahead and write the implementation in the code editor on your right, then click **Run** or **Submit**!`
    );
  }

  if (/o\s*\(\s*n\s*(\^|\*\*)\s*2\s*\)|o\s*\(\s*n2\s*\)|brute\s*force/i.test(norm)) {
    return (
      `A brute-force approach using nested loops will indeed work with O(N²) time complexity and O(1) space.\n\n` +
      `However, for large inputs, O(N²) may result in a Time Limit Exceeded (TLE). ` +
      `Can you think of a data structure (like a Hash Map or Set) that can help us bring the runtime down to O(N)?`
    );
  }

  // 4. Mentions of Hash Map / Dictionary / Set / Map
  if (/(hash\s*map|hashmap|hash\s*table|dictionary|dict|map|set)/i.test(norm)) {
    return (
      `Spot on! A Hash Map is the ideal data structure here.\n\n` +
      `As we iterate through the input, we can check if the needed complement is already in our map. ` +
      `If yes, we have our answer; if not, we record the current element and its index.\n\n` +
      `Go ahead and type this out in the code editor on the right and hit **Run**!`
    );
  }

  // 5. User asks for hints / help / stuck
  if (/(hint|help|stuck|clue|how to solve|don'?t know)/i.test(norm)) {
    return (
      `💡 **Here is a hint:**\n` +
      `${problems.q1.hints[0]}\n\n` +
      `Give it a try in the code editor on the right!`
    );
  }

  // 6. User asks for Question 2 / Next
  if (/(next|question\s*2|second\s*question|move\s*on)/i.test(norm)) {
    return (
      `Great! Let's move to **Question 2: ${problems.q2.title}**!\n\n` +
      `**Problem Statement:**\n${problems.q2.description}\n\n` +
      `Select **Q2: ${problems.q2.title}** at the top of the code editor on your right. ` +
      `How would you approach this in-place with optimal O(1) extra space?`
    );
  }

  // 7. Generic thoughtful interview response
  return (
    `That is a good insight! In technical interviews, explaining your thought process clearly is key.\n\n` +
    `How does that approach handle boundary cases (like small inputs or negative numbers)? ` +
    `Whenever you're ready, draft your solution in the code editor on the right and click **Run** to verify!`
  );
}

export const startInterview = async (request: StartInterviewRequest): Promise<InterviewSessionResponse> => {
  try {
    const response = await apiClient.post<InterviewSessionResponse>(`${INTERVIEWS}/start`, request);
    if (response.data) {
      try {
        const existing: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
        localStorage.setItem('interview_sessions', JSON.stringify([response.data, ...existing.filter(s => s.id !== response.data.id)]));
      } catch {}
    }
    return response.data;
  } catch (err) {
    const session: InterviewSessionResponse = {
      id: 'session-' + Date.now(),
      topic: request.topic,
      difficulty: request.difficulty,
      status: 'STARTED',
      createdAt: new Date().toISOString(),
    };
    try {
      const existing: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      localStorage.setItem('interview_sessions', JSON.stringify([session, ...existing]));
    } catch {}
    return session;
  }
};

export const sendChatMessage = async (sessionId: string, content: string): Promise<InterviewMessageResponse> => {
  try {
    const response = await apiClient.post<InterviewMessageResponse>(`${INTERVIEWS}/${sessionId}/chat`, { content });
    return response.data;
  } catch (err) {
    // Contextual local chat response engine
    let topic = 'Arrays & Hashing';
    try {
      const sessions: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      const current = sessions.find(s => s.id === sessionId);
      if (current?.topic) topic = current.topic;
    } catch {}

    let history: InterviewMessageResponse[] = [];
    try {
      history = JSON.parse(localStorage.getItem(`interview_messages_${sessionId}`) || '[]');
    } catch {}

    const replyText = generateContextualInterviewResponse(content, topic, history);

    const aiMessage: InterviewMessageResponse = {
      id: 'msg-' + Date.now(),
      role: 'AI',
      content: replyText,
      timestamp: new Date().toISOString(),
    };

    // Save user msg + AI response to local history
    try {
      const userMsg: InterviewMessageResponse = {
        id: 'msg-u-' + Date.now(),
        role: 'USER',
        content,
        timestamp: new Date().toISOString(),
      };
      const updated = [...history, userMsg, aiMessage];
      localStorage.setItem(`interview_messages_${sessionId}`, JSON.stringify(updated));
    } catch {}

    return aiMessage;
  }
};

export const getUserSessions = async (): Promise<InterviewSessionResponse[]> => {
  let localSessions: InterviewSessionResponse[] = [];
  try {
    localSessions = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
  } catch {}

  try {
    const response = await apiClient.get<InterviewSessionResponse[]>(INTERVIEWS);
    const backendData = response.data || [];
    const ids = new Set(backendData.map(s => s.id));
    return [...backendData, ...localSessions.filter(s => !ids.has(s.id))];
  } catch (err) {
    return localSessions;
  }
};

export const getSessionMessages = async (sessionId: string): Promise<InterviewMessageResponse[]> => {
  // Check if messages already exist in localStorage
  try {
    const cached = localStorage.getItem(`interview_messages_${sessionId}`);
    if (cached) {
      const parsed: InterviewMessageResponse[] = JSON.parse(cached);
      if (parsed.length > 0) return parsed;
    }
  } catch {}

  try {
    const response = await apiClient.get<InterviewMessageResponse[]>(`${INTERVIEWS}/${sessionId}/messages`);
    return response.data;
  } catch (err) {
    // Determine topic from session
    let topic = 'Arrays & Hashing';
    let difficulty = 'EASY';
    try {
      const sessions: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      const current = sessions.find(s => s.id === sessionId);
      if (current?.topic) topic = current.topic;
      if (current?.difficulty) difficulty = current.difficulty;
    } catch {}

    const problems = getProblemsForTopic(topic);
    const initialMsg: InterviewMessageResponse = {
      id: 'msg-init-' + Date.now(),
      role: 'AI',
      content: `Welcome to your AI Mock Interview! I am your interviewer today, and we will be focusing on **${topic}** (${difficulty} level).\n\nHere is your first problem: **${problems.q1.title}**\n\n**Problem Statement:**\n${problems.q1.description}\n\n**Example:**\n${problems.q1.examples.join('\n')}\n\nThe starter code is loaded in the editor on your right. How would you approach solving this problem? Feel free to discuss your thoughts before coding!`,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`interview_messages_${sessionId}`, JSON.stringify([initialMsg]));
    } catch {}

    return [initialMsg];
  }
};

export const endInterview = async (
  sessionId: string,
  solvedCount: number = 0,
  score?: string
): Promise<InterviewSessionResponse> => {
  const finalScore = score || (solvedCount === 2 ? '9.5/10' : solvedCount === 1 ? '7.0/10' : '4.0/10');
  try {
    const response = await apiClient.put<InterviewSessionResponse>(`${INTERVIEWS}/${sessionId}/end`, {
      solvedCount,
      score: finalScore
    });
    try {
      const sessions: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      const updated = sessions.map(s => s.id === sessionId ? {
        ...s,
        status: 'COMPLETED' as const,
        solvedCount,
        totalQuestions: 2,
        score: finalScore
      } : s);
      localStorage.setItem('interview_sessions', JSON.stringify(updated));
    } catch {}
    return response.data;
  } catch (err) {
    let topic = 'Arrays & Hashing';
    let difficulty = 'EASY';
    try {
      const sessions: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      const curr = sessions.find(s => s.id === sessionId);
      if (curr) {
        topic = curr.topic;
        difficulty = curr.difficulty;
      }
    } catch {}

    const completedSession: InterviewSessionResponse = {
      id: sessionId,
      topic,
      difficulty,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      solvedCount,
      totalQuestions: 2,
      score: finalScore,
    };
    try {
      const sessions: InterviewSessionResponse[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
      const updated = sessions.map(s => s.id === sessionId ? {
        ...s,
        status: 'COMPLETED' as const,
        solvedCount,
        totalQuestions: 2,
        score: finalScore
      } : s);
      localStorage.setItem('interview_sessions', JSON.stringify(updated));
    } catch {}
    return completedSession;
  }
};
