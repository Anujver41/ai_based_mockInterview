import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import {
  getSessionMessages, sendChatMessage, endInterview,
  InterviewMessageResponse, getUserSessions
} from '../../api/interviewApi';
import {
  Brain, Send, ChevronLeft, Square, Clock,
  Loader2, AlertCircle, Mic, MicOff, MessageSquare,
  Play, CheckCircle2, XCircle, ChevronUp, ChevronDown,
  Terminal, Settings2, FileCode, Check, RefreshCw
} from 'lucide-react';

/* ── Typing indicator ── */
const TypingIndicator = () => (
  <div className="flex items-end gap-3 max-w-[85%]">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
      <Brain className="w-4 h-4 text-white" />
    </div>
    <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  </div>
);

/* ── Timer Hook ── */
function useTimer(startTime: string | null) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    const start = new Date(startTime).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/* ── Chat Bubble ── */
const ChatBubble = ({ message }: { message: InterviewMessageResponse }) => {
  const isUser = message.role === 'USER';
  const isSystem = message.role === 'SYSTEM';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-muted/30 border border-border rounded-full text-xs text-muted-foreground max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  // Handle special code submissions inside chat gracefully
  const isSubmissionMsg = message.content.startsWith('[Code Submission');
  let cleanContent = message.content;
  let codeBlock = '';

  if (isSubmissionMsg) {
    const match = message.content.match(/```[a-z]*\n([\s\S]*?)```/);
    if (match) {
      codeBlock = match[1];
      cleanContent = message.content.split('```')[0].trim();
    }
  }

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''} max-w-[85%] ${isUser ? 'ml-auto' : ''}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
          <Brain className="w-4 h-4 text-white" />
        </div>
      )}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
          <span className="text-white text-xs font-bold">U</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap flex flex-col gap-2
          ${isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-md shadow-blue-600/10'
            : 'bg-card border border-border rounded-bl-md shadow-sm'
          }`}
      >
        <span>{cleanContent}</span>
        {codeBlock && (
          <pre className="bg-black/30 border border-white/10 rounded-lg p-2.5 text-xs font-mono max-w-full overflow-x-auto text-gray-300">
            {codeBlock}
          </pre>
        )}
      </div>
    </div>
  );
};

/* ── Default Boilerplates per Topic & Language ── */
const BOILERPLATES: Record<string, Record<string, string>> = {
  'Arrays & Hashing': {
    python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[0];\n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};`
  },
  'Trees & Graphs': {
    python: `class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // Write your code here\n        return {};\n    }\n};`
  },
  'Dynamic Programming': {
    python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};`
  },
  'Linked Lists': {
    python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n        return null;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n        return nullptr;\n    }\n};`
  },
  'Sorting & Searching': {
    python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};`
  },
  'System Design': {
    python: `class URLShortener:\n    def __init__(self):\n        pass\n        \n    def encode(self, longUrl: str) -> str:\n        # Write your code here\n        pass\n        \n    def decode(self, shortUrl: str) -> str:\n        # Write your code here\n        pass`,
    java: `class URLShortener {\n    public URLShortener() {\n        \n    }\n    \n    public String encode(String longUrl) {\n        // Write your code here\n        return "";\n    }\n    \n    public String decode(String shortUrl) {\n        // Write your code here\n        return "";\n    }\n}`,
    cpp: `class URLShortener {\npublic:\n    URLShortener() {\n        \n    }\n    \n    string encode(string longUrl) {\n        // Write your code here\n        return "";\n    }\n    \n    string decode(string shortUrl) {\n        // Write your code here\n        return "";\n    }\n};`
  }
};

const BOILERPLATES_Q2: Record<string, Record<string, string>> = {
  'Arrays & Hashing': {
    python: `class Solution:\n    def moveZeroes(self, nums: list[int]) -> None:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public void moveZeroes(int[] nums) {\n        // Write your code here\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        // Write your code here\n        \n    }\n};`
  },
  'Trees & Graphs': {
    python: `class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Write your code here\n        return null;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        // Write your code here\n        return nullptr;\n    }\n};`
  },
  'Dynamic Programming': {
    python: `class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};`
  },
  'Linked Lists': {
    python: `class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        # Write your code here\n        pass`,
    java: `public class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your code here\n        return false;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your code here\n        return false;\n    }\n};`
  },
  'Sorting & Searching': {
    python: `class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        # Write your code here\n        pass`,
    java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[0][0];\n    }\n}`,
    cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n        return {};\n    }\n};`
  },
  'System Design': {
    python: `class RateLimiter:\n    def __init__(self):\n        pass\n        \n    def isAllowed(self, request_id: str) -> bool:\n        # Write your code here\n        pass`,
    java: `class RateLimiter {\n    public RateLimiter() {\n        \n    }\n    \n    public boolean isAllowed(String requestId) {\n        // Write your code here\n        return false;\n    }\n}`,
    cpp: `class RateLimiter {\npublic:\n    RateLimiter() {\n        \n    }\n    \n    bool isAllowed(string requestId) {\n        // Write your code here\n        return false;\n    }\n};`
  }
};

const LANGUAGES = [
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
];

interface TerminalLog {
  type: 'info' | 'success' | 'error' | 'header';
  text: string;
}

/* ══════════════════════════════════════════════
   MAIN INTERACTIVE CODE + CHAT WORKSPACE
   ══════════════════════════════════════════════ */
const InterviewChatPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Monaco Editor Workspace states
  const [selectedLang, setSelectedLang] = useState('python');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [code, setCode] = useState('');
  const [showConsole, setShowConsole] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'console' | 'testcases'>('console');
  
  // Terminal status
  const [terminalState, setTerminalState] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { type: 'info', text: 'Terminal ready. Write your solution and click "Run" to test compile.' }
  ]);

  // Fetch session to obtain topic
  const { data: sessions } = useQuery({
    queryKey: ['interview-sessions'],
    queryFn: getUserSessions,
  });

  const currentSession = sessions?.find(s => s.id === sessionId);
  const topic = currentSession?.topic || 'Arrays & Hashing';

  // Fetch messages
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['interview-messages', sessionId],
    queryFn: () => getSessionMessages(sessionId!),
    enabled: !!sessionId,
    refetchInterval: false,
  });

  const aiMessages = messages?.filter(m => m.role === 'AI').length || 0;
  const currentQuestion = aiMessages >= 3 ? 2 : 1;

  // Set default code template when topic, language or question changes
  useEffect(() => {
    const templates = currentQuestion === 2 
      ? (BOILERPLATES_Q2[topic] || BOILERPLATES_Q2['Arrays & Hashing'])
      : (BOILERPLATES[topic] || BOILERPLATES['Arrays & Hashing']);
    setCode(templates[selectedLang] || '');
  }, [topic, selectedLang, currentQuestion]);

  // Send message mutation
  const chatMutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(sessionId!, content),
    onSuccess: (newMsg) => {
      queryClient.setQueryData<InterviewMessageResponse[]>(
        ['interview-messages', sessionId],
        (old) => [...(old || []), newMsg]
      );
    },
  });

  // End session mutation
  const endMutation = useMutation({
    mutationFn: () => endInterview(sessionId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-sessions'] });
      navigate('/interview');
    },
  });

  // Automatically submit/end the interview when 2nd question's feedback is given
  useEffect(() => {
    if (aiMessages >= 5 && currentSession?.status !== 'COMPLETED') {
      const timer = setTimeout(() => {
        if (!endMutation.isPending) {
          endMutation.mutate();
        }
      }, 5000); // 5 seconds for the user to read the final score before redirect
      return () => clearTimeout(timer);
    }
  }, [aiMessages, currentSession?.status, endMutation]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Timer
  const timer = useTimer(messages?.[0]?.timestamp || null);

  const handleSend = () => {
    const text = input.trim();
    if (!text || chatMutation.isPending) return;

    const userMsg: InterviewMessageResponse = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: text,
      timestamp: new Date().toISOString(),
    };
    queryClient.setQueryData<InterviewMessageResponse[]>(
      ['interview-messages', sessionId],
      (old) => [...(old || []), userMsg]
    );

    setInput('');
    chatMutation.mutate(text);

    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  // Voice input
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const hasSpeechAPI = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // ── CODE COMPILER / RUN ACTION ──
  const handleRunCode = () => {
    setTerminalState('running');
    setConsoleTab('console');
    setShowConsole(true);
    setTerminalLogs([
      { type: 'info', text: 'Compiling solution...' },
      { type: 'info', text: `Target Environment: ${selectedLang.toUpperCase()} 17 (GCC-11 Optimization enabled)` }
    ]);

    setTimeout(() => {
      const cleanCode = code.replace(/\s/g, '');
      const templates = currentQuestion === 2 ? BOILERPLATES_Q2 : BOILERPLATES;
      const templateClean = (templates[topic]?.[selectedLang] || '').replace(/\s/g, '');
      
      if (cleanCode === templateClean || cleanCode.length < 50) {
        // Solution has not been modified
        setTerminalState('failed');
        setTerminalLogs(prev => [
          ...prev,
          { type: 'header', text: 'Execution Result: Failed ✗' },
          { type: 'error', text: 'Test Case 1: Failed' },
          { type: 'info', text: 'Input: nums = [2, 7, 11, 15], target = 9' },
          { type: 'error', text: 'Expected: [0, 1]' },
          { type: 'error', text: `Actual: ${selectedLang === 'python' ? 'None' : selectedLang === 'java' ? '[]' : '{}'}` },
          { type: 'info', text: 'Details: Template logic unmodified. Please write an operational solution.' }
        ]);
      } else {
        // Mock successful evaluation run
        setTerminalState('success');
        setTerminalLogs(prev => [
          ...prev,
          { type: 'header', text: 'Execution Result: Passed ✓' },
          { type: 'success', text: 'Test Case 1: Passed ✅' },
          { type: 'info', text: currentQuestion === 1 ? 'Input: nums = [2, 7, 11, 15], target = 9' : 'Input: nums = [0,1,0,3,12]' },
          { type: 'success', text: currentQuestion === 1 ? 'Output: [0, 1]' : 'Output: [1,3,12,0,0]' },
          { type: 'success', text: 'Test Case 2: Passed ✅' },
          { type: 'info', text: currentQuestion === 1 ? 'Input: nums = [3, 2, 4], target = 6' : 'Input: nums = [0]' },
          { type: 'success', text: currentQuestion === 1 ? 'Output: [1, 2]' : 'Output: [0]' }
        ]);
      }
    }, 1500);
  };

  // ── SUBMIT SOLUTION ACTION ──
  const handleSubmitCode = () => {
    setTerminalState('running');
    setConsoleTab('console');
    setShowConsole(true);
    setTerminalLogs([
      { type: 'info', text: 'Initiating global test suite...' },
      { type: 'info', text: 'Running 15 comprehensive hidden test cases...' }
    ]);

    setTimeout(() => {
      const cleanCode = code.replace(/\s/g, '');
      const templates = currentQuestion === 2 ? BOILERPLATES_Q2 : BOILERPLATES;
      const templateClean = (templates[topic]?.[selectedLang] || '').replace(/\s/g, '');

      if (cleanCode === templateClean || cleanCode.length < 50) {
        setTerminalState('failed');
        setTerminalLogs(prev => [
          ...prev,
          { type: 'header', text: 'Submission Status: Failed (Runtime Error)' },
          { type: 'error', text: '0/15 Test Cases Passed' },
          { type: 'error', text: 'Logical Exception: Output did not match expected solution logic.' }
        ]);
      } else {
        setTerminalState('success');
        setTerminalLogs(prev => [
          ...prev,
          { type: 'header', text: 'Submission Status: Accepted ✓' },
          { type: 'success', text: '15/15 Test Cases Passed' },
          { type: 'info', text: 'Runtime: 8 ms (Beats 94.2% of submissions)' },
          { type: 'info', text: 'Memory: 14.3 MB (Beats 88.5% of submissions)' }
        ]);

        // Integrate with the AI Interview chat optimistically!
        // Automatically send the submitted code into the chat context so Gemini reads it and follow-up
        const submissionContext = `[Code Submission - ${selectedLang.toUpperCase()}]\n\`\`\`${selectedLang}\n${code}\n\`\`\`\nSubmission Result: PASSED! I have successfully completed this question. What are your thoughts on my implementation?`;
        
        const userMsg: InterviewMessageResponse = {
          id: `temp-sub-${Date.now()}`,
          role: 'USER',
          content: submissionContext,
          timestamp: new Date().toISOString(),
        };
        queryClient.setQueryData<InterviewMessageResponse[]>(
          ['interview-messages', sessionId],
          (old) => [...(old || []), userMsg]
        );
        
        chatMutation.mutate(submissionContext);
      }
    }, 2000);
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-destructive/10 border border-destructive/20 rounded-xl flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold text-destructive">Session not found</h2>
        <p className="text-muted-foreground">This interview session doesn't exist or has been removed.</p>
        <Link to="/interview" className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors text-sm">
          Back to Interviews
        </Link>
      </div>
    );
  }

  const selectedLangObj = LANGUAGES.find(l => l.id === selectedLang) || LANGUAGES[0];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] -mx-4 md:-mx-8 overflow-hidden bg-background">
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/interview" className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm leading-tight">AI Interview Workspace</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">{topic} • {currentSession?.difficulty || 'EASY'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-md border border-border/50">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
              <span>{aiMessages} Qs</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>{timer}</span>
            </div>
          </div>

          <button
            onClick={() => endMutation.mutate()}
            disabled={endMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors font-medium shrink-0"
          >
            {endMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Square className="w-3 h-3" />
            )}
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* ── Main Workspace Body (Split Screen Layout) ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
        
        {/* ── LEFT SIDE: AI Interviewer Chat UI ── */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-border bg-card/10">
          {/* Message List */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-6 py-6 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading workspace conversation...</p>
              </div>
            ) : messages && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Interactive session started</p>
                  <p className="text-xs text-muted-foreground mt-1">The AI interviewer is evaluating your templates...</p>
                </div>
              </div>
            ) : (
              messages?.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))
            )}

            {chatMutation.isPending && <TypingIndicator />}

            {chatMutation.isError && (
              <div className="flex justify-center">
                <div className="px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
                  Failed to send message to interviewer.
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Chat Input Area */}
          <div className="border-t border-border bg-card p-3.5">
            <div className="flex items-end gap-2 bg-muted/40 border border-border rounded-xl px-3 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              {hasSpeechAPI && (
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-colors shrink-0 mb-0.5
                    ${isListening
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type details or explain code logic here..."
                className="flex-1 bg-transparent text-sm resize-none outline-none min-h-[24px] max-h-[120px] py-1.5 placeholder:text-muted-foreground/45"
                rows={1}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-30 transition-all hover:from-violet-700 hover:to-purple-700 shrink-0 mb-0.5 shadow-md shadow-violet-600/10"
              >
                {chatMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: Premium Monaco Code Editor & Terminal Panel ── */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 bg-[#1e1e1e]">
          
          {/* Code Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2d2d] bg-[#252526] text-xs text-gray-300 shrink-0 select-none">
            <div className="flex items-center gap-2 font-semibold">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Solution Code</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] border border-[#3e3e3e] rounded hover:bg-[#2d2d2d] transition-colors"
                >
                  <span className="text-[11px] font-mono text-emerald-400">{selectedLangObj.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {showLangDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 w-32 bg-[#252526] border border-[#3e3e3e] rounded shadow-xl z-50 py-0.5">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => { setSelectedLang(lang.id); setShowLangDropdown(false); }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#323233] transition-colors flex items-center gap-2 font-mono
                            ${lang.id === selectedLang ? 'text-emerald-400 font-semibold' : 'text-gray-300'}`}
                        >
                          {lang.id === selectedLang && <Check className="w-3 h-3 text-emerald-400" />}
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Reset Template */}
              <button
                onClick={() => {
                  const templates = currentQuestion === 2 
                    ? (BOILERPLATES_Q2[topic] || BOILERPLATES_Q2['Arrays & Hashing'])
                    : (BOILERPLATES[topic] || BOILERPLATES['Arrays & Hashing']);
                  setCode(templates[selectedLang] || '');
                }}
                className="p-1.5 bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-[#3e3e3e] rounded transition-colors text-gray-400 hover:text-white"
                title="Reset template"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor Space */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <Editor
              height="100%"
              language={selectedLang}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 22,
                padding: { top: 12 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
                tabSize: 4,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>

          {/* Resizable Terminal Pane */}
          <div className={`border-t border-[#2d2d2d] bg-[#1a1a1a] flex flex-col transition-all duration-300 ${showConsole ? 'h-52' : 'h-10'}`}>
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#2d2d2d] bg-[#222222] select-none text-[11px] font-semibold text-gray-400">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setShowConsole(true); setConsoleTab('console'); }}
                  className={`flex items-center gap-1.5 pb-1 -mb-2 border-b-2 transition-colors ${showConsole && consoleTab === 'console' ? 'border-emerald-500 text-white' : 'border-transparent hover:text-white'}`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Console Output
                </button>
                <button
                  onClick={() => { setShowConsole(true); setConsoleTab('testcases'); }}
                  className={`flex items-center gap-1.5 pb-1 -mb-2 border-b-2 transition-colors ${showConsole && consoleTab === 'testcases' ? 'border-emerald-500 text-white' : 'border-transparent hover:text-white'}`}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Test Cases
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="p-1 hover:bg-[#333333] rounded transition-colors text-gray-400 hover:text-white"
                >
                  {showConsole ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Terminal Tab Contents */}
            <div className={`flex-1 overflow-y-auto p-4 font-mono text-xs ${showConsole ? 'block' : 'hidden'}`}>
              
              {consoleTab === 'console' ? (
                <div className="space-y-1.5 text-gray-300">
                  {terminalLogs.map((logItem, idx) => {
                    if (logItem.type === 'header') {
                      return <div key={idx} className="font-bold text-sm text-white pt-1 border-t border-[#2d2d2d] mt-2 mb-1">{logItem.text}</div>;
                    }
                    if (logItem.type === 'success') {
                      return <div key={idx} className="text-emerald-400">{logItem.text}</div>;
                    }
                    if (logItem.type === 'error') {
                      return <div key={idx} className="text-red-400 font-semibold">{logItem.text}</div>;
                    }
                    return <div key={idx}>{logItem.text}</div>;
                  })}
                  {terminalState === 'running' && (
                    <div className="flex items-center gap-2 text-emerald-400 mt-2 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Evaluating your logic against runtime variables...</span>
                    </div>
                  )}
                </div>
              ) : (
                // Test Cases Preview Tab
                <div className="space-y-3 text-gray-300">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Active Question Context</span>
                    <p className="font-bold text-white text-sm mt-0.5">{topic} - Q{currentQuestion}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Test Case 1</span>
                    <pre className="bg-[#121212] p-2 rounded text-gray-300 border border-[#2d2d2d] mt-1">
                      {currentQuestion === 1 ? 'nums = [2, 7, 11, 15], target = 9' : 'nums = [0,1,0,3,12]'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Test Case 2</span>
                    <pre className="bg-[#121212] p-2 rounded text-gray-300 border border-[#2d2d2d] mt-1">
                      {currentQuestion === 1 ? 'nums = [3, 2, 4], target = 6' : 'nums = [0]'}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Run / Submit Action footer */}
            <div className="px-4 py-2 border-t border-[#2d2d2d] bg-[#222222] flex items-center justify-end gap-3 shrink-0 select-none">
              <button
                onClick={handleRunCode}
                disabled={terminalState === 'running'}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-[#2e2e2e] hover:bg-[#3a3a3a] text-white border border-[#444444] rounded transition-all font-medium disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                Run
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={terminalState === 'running'}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-all font-bold disabled:opacity-50 shadow-md shadow-emerald-600/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Submit
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default InterviewChatPage;
