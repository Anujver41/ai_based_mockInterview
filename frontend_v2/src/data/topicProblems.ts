// ─────────────────────────────────────────────────────────────────────────────
// Curated DSA Problem Dataset — Real problems with direct platform links
// Each topic has 10–20 real problems from LeetCode and GFG
// ─────────────────────────────────────────────────────────────────────────────

export interface TopicProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: 'LeetCode' | 'GFG';
  url: string;
  tags?: string[];
}

export const TOPIC_PROBLEMS: Record<string, TopicProblem[]> = {

  'Arrays': [
    { id: 'lc-1', title: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/' },
    { id: 'lc-121', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { id: 'lc-238', title: 'Product of Array Except Self', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { id: 'lc-53', title: 'Maximum Subarray (Kadane)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { id: 'lc-152', title: 'Maximum Product Subarray', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-product-subarray/' },
    { id: 'lc-153', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
    { id: 'lc-217', title: 'Contains Duplicate', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/contains-duplicate/' },
    { id: 'lc-11', title: 'Container With Most Water', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 'lc-15', title: '3Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/3sum/' },
    { id: 'lc-33', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { id: 'gfg-ar1', title: 'Rotate Array', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1' },
    { id: 'gfg-ar2', title: 'Subarray with given sum', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/subarray-with-given-sum-1587115621/1' },
    { id: 'gfg-ar3', title: 'Move all zeroes to end', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/move-all-zeroes-to-end-of-array0751/1' },
    { id: 'lc-560', title: 'Subarray Sum Equals K', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
    { id: 'lc-41', title: 'First Missing Positive', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/first-missing-positive/' },
  ],

  'Strings': [
    { id: 'lc-3', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { id: 'lc-76', title: 'Minimum Window Substring', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-window-substring/' },
    { id: 'lc-242', title: 'Valid Anagram', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-anagram/' },
    { id: 'lc-49', title: 'Group Anagrams', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/group-anagrams/' },
    { id: 'lc-647', title: 'Palindromic Substrings', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/palindromic-substrings/' },
    { id: 'lc-5', title: 'Longest Palindromic Substring', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { id: 'lc-125', title: 'Valid Palindrome', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-palindrome/' },
    { id: 'lc-20', title: 'Valid Parentheses', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/' },
    { id: 'lc-271', title: 'Encode and Decode Strings', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/encode-and-decode-strings/' },
    { id: 'gfg-str1', title: 'Anagram Check', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/anagram-1587115620/1' },
    { id: 'gfg-str2', title: 'Longest Common Prefix', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/longest-common-prefix-in-an-array5129/1' },
    { id: 'lc-438', title: 'Find All Anagrams in a String', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' },
    { id: 'lc-8', title: 'String to Integer (atoi)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/string-to-integer-atoi/' },
    { id: 'lc-14', title: 'Longest Common Prefix', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-prefix/' },
  ],

  'Hash Table': [
    { id: 'lc-1-ht', title: 'Two Sum', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/' },
    { id: 'lc-49-ht', title: 'Group Anagrams', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/group-anagrams/' },
    { id: 'lc-128', title: 'Longest Consecutive Sequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    { id: 'lc-347', title: 'Top K Frequent Elements', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
    { id: 'lc-380', title: 'Insert Delete GetRandom O(1)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/' },
    { id: 'lc-146', title: 'LRU Cache', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/' },
    { id: 'lc-560-ht', title: 'Subarray Sum Equals K', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
    { id: 'lc-454', title: '4Sum II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/4sum-ii/' },
    { id: 'lc-202', title: 'Happy Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/happy-number/' },
    { id: 'gfg-ht1', title: 'Count Distinct Elements in Every Window', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1' },
    { id: 'gfg-ht2', title: 'First Non Repeating Character', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1' },
    { id: 'lc-290', title: 'Word Pattern', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-pattern/' },
    { id: 'lc-205', title: 'Isomorphic Strings', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/isomorphic-strings/' },
  ],

  'Linked List': [
    { id: 'lc-206', title: 'Reverse a Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list/' },
    { id: 'lc-21', title: 'Merge Two Sorted Lists', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { id: 'lc-141', title: 'Linked List Cycle', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle/' },
    { id: 'lc-142', title: 'Linked List Cycle II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
    { id: 'lc-19', title: 'Remove Nth Node From End', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
    { id: 'lc-23', title: 'Merge K Sorted Lists', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    { id: 'lc-25', title: 'Reverse Nodes in k-Group', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
    { id: 'lc-143', title: 'Reorder List', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/reorder-list/' },
    { id: 'lc-160', title: 'Intersection of Two Linked Lists', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
    { id: 'gfg-ll1', title: 'Detect Loop in Linked List', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1' },
    { id: 'gfg-ll2', title: 'Reverse a Doubly Linked List', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1' },
    { id: 'gfg-ll3', title: 'Middle of a Linked List', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/finding-middle-element-in-a-linked-list/1' },
    { id: 'lc-234', title: 'Palindrome Linked List', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/palindrome-linked-list/' },
    { id: 'lc-82', title: 'Remove Duplicates from Sorted List II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/' },
  ],

  'Stack': [
    { id: 'lc-20-st', title: 'Valid Parentheses', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/' },
    { id: 'lc-155', title: 'Min Stack', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/min-stack/' },
    { id: 'lc-84', title: 'Largest Rectangle in Histogram', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
    { id: 'lc-42', title: 'Trapping Rain Water', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/trapping-rain-water/' },
    { id: 'lc-739', title: 'Daily Temperatures', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/daily-temperatures/' },
    { id: 'lc-853', title: 'Car Fleet', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/car-fleet/' },
    { id: 'lc-150', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
    { id: 'lc-22', title: 'Generate Parentheses', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/generate-parentheses/' },
    { id: 'gfg-st1', title: 'Next Greater Element', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1' },
    { id: 'gfg-st2', title: 'Stack using two queues', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/stack-using-two-queues/1' },
    { id: 'gfg-st3', title: 'Get minimum element from stack', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/get-minimum-element-from-stack/1' },
    { id: 'lc-232', title: 'Implement Queue using Stacks', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
    { id: 'lc-496', title: 'Next Greater Element I', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/next-greater-element-i/' },
  ],

  'Heap & Queue': [
    { id: 'lc-703', title: 'Kth Largest Element in a Stream', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
    { id: 'lc-1046', title: 'Last Stone Weight', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/last-stone-weight/' },
    { id: 'lc-973', title: 'K Closest Points to Origin', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
    { id: 'lc-215', title: 'Kth Largest Element in an Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
    { id: 'lc-621', title: 'Task Scheduler', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/task-scheduler/' },
    { id: 'lc-295', title: 'Find Median from Data Stream', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
    { id: 'lc-23-h', title: 'Merge K Sorted Lists (Heap)', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    { id: 'gfg-h1', title: 'Kth Largest Element in a Stream', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/kth-largest-element-in-a-stream2220/1' },
    { id: 'gfg-h2', title: 'K Largest Elements', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/k-largest-elements4206/1' },
    { id: 'lc-347-h', title: 'Top K Frequent Elements', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
    { id: 'lc-355', title: 'Design Twitter', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/design-twitter/' },
  ],

  'Trees & Binary Tree': [
    { id: 'lc-226', title: 'Invert Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/invert-binary-tree/' },
    { id: 'lc-104', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { id: 'lc-543', title: 'Diameter of Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
    { id: 'lc-110', title: 'Balanced Binary Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/balanced-binary-tree/' },
    { id: 'lc-100', title: 'Same Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/same-tree/' },
    { id: 'lc-572', title: 'Subtree of Another Tree', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/subtree-of-another-tree/' },
    { id: 'lc-235', title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
    { id: 'lc-102', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 'lc-105', title: 'Construct Binary Tree from Preorder+Inorder', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
    { id: 'lc-124', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
    { id: 'gfg-bt1', title: 'Height of Binary Tree', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/height-of-binary-tree/1' },
    { id: 'gfg-bt2', title: 'Mirror Tree', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/mirror-tree/1' },
    { id: 'gfg-bt3', title: 'Diameter of Binary Tree', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1' },
    { id: 'lc-98', title: 'Validate Binary Search Tree', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  ],

  'Breadth-First Search (BFS)': [
    { id: 'lc-200-bfs', title: 'Number of Islands', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 'lc-102-bfs', title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 'lc-994', title: 'Rotting Oranges', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/rotting-oranges/' },
    { id: 'lc-286', title: 'Walls and Gates', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/walls-and-gates/' },
    { id: 'lc-1091', title: 'Shortest Path in Binary Matrix', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/' },
    { id: 'lc-127', title: 'Word Ladder', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-ladder/' },
    { id: 'lc-433', title: 'Minimum Genetic Mutation', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-genetic-mutation/' },
    { id: 'gfg-bfs1', title: 'BFS of Graph', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1' },
    { id: 'gfg-bfs2', title: 'Level order traversal', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/level-order-traversal/1' },
    { id: 'lc-542', title: '01 Matrix', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/01-matrix/' },
    { id: 'lc-695', title: 'Max Area of Island', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/max-area-of-island/' },
    { id: 'lc-417', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  ],

  'Depth-First Search (DFS)': [
    { id: 'lc-200-dfs', title: 'Number of Islands', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 'lc-133', title: 'Clone Graph', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/clone-graph/' },
    { id: 'lc-695-dfs', title: 'Max Area of Island', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/max-area-of-island/' },
    { id: 'lc-417-dfs', title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
    { id: 'lc-207', title: 'Course Schedule', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule/' },
    { id: 'lc-210', title: 'Course Schedule II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule-ii/' },
    { id: 'lc-684', title: 'Redundant Connection', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/redundant-connection/' },
    { id: 'lc-323', title: 'Number of Connected Components', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
    { id: 'gfg-dfs1', title: 'DFS of Graph', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1' },
    { id: 'gfg-dfs2', title: 'Detect cycle in a directed graph', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1' },
    { id: 'lc-130', title: 'Surrounded Regions', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/surrounded-regions/' },
    { id: 'lc-79', title: 'Word Search', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-search/' },
    { id: 'lc-332', title: 'Reconstruct Itinerary', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/reconstruct-itinerary/' },
  ],

  'Dynamic Programming': [
    { id: 'lc-70', title: 'Climbing Stairs', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/' },
    { id: 'lc-322', title: 'Coin Change', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/' },
    { id: 'lc-300', title: 'Longest Increasing Subsequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { id: 'lc-1143', title: 'Longest Common Subsequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
    { id: 'lc-518', title: 'Coin Change 2', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change-ii/' },
    { id: 'lc-416', title: 'Partition Equal Subset Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
    { id: 'lc-198', title: 'House Robber', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/house-robber/' },
    { id: 'lc-213', title: 'House Robber II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/house-robber-ii/' },
    { id: 'lc-91', title: 'Decode Ways', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/decode-ways/' },
    { id: 'lc-62', title: 'Unique Paths', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/unique-paths/' },
    { id: 'lc-72', title: 'Edit Distance', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/edit-distance/' },
    { id: 'gfg-dp1', title: 'Longest Common Subsequence', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1' },
    { id: 'gfg-dp2', title: '0 - 1 Knapsack Problem', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1' },
    { id: 'gfg-dp3', title: 'Matrix Chain Multiplication', difficulty: 'Hard', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1' },
    { id: 'lc-139', title: 'Word Break', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-break/' },
  ],

  'Binary Search': [
    { id: 'lc-704', title: 'Binary Search', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/binary-search/' },
    { id: 'lc-74', title: 'Search a 2D Matrix', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
    { id: 'lc-875', title: 'Koko Eating Bananas', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
    { id: 'lc-153-bs', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
    { id: 'lc-33-bs', title: 'Search in Rotated Sorted Array', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { id: 'lc-981', title: 'Time Based Key-Value Store', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/time-based-key-value-store/' },
    { id: 'lc-4', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
    { id: 'gfg-bs1', title: 'Binary Search', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/binary-search-1587115620/1' },
    { id: 'gfg-bs2', title: 'Floor in a Sorted Array', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1' },
    { id: 'lc-162', title: 'Find Peak Element', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-peak-element/' },
    { id: 'lc-278', title: 'First Bad Version', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/first-bad-version/' },
    { id: 'lc-35', title: 'Search Insert Position', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/search-insert-position/' },
  ],

  'Two Pointers': [
    { id: 'lc-125-tp', title: 'Valid Palindrome', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-palindrome/' },
    { id: 'lc-167', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
    { id: 'lc-15-tp', title: '3Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/3sum/' },
    { id: 'lc-11-tp', title: 'Container With Most Water', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 'lc-42-tp', title: 'Trapping Rain Water', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/trapping-rain-water/' },
    { id: 'lc-977', title: 'Squares of a Sorted Array', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/squares-of-a-sorted-array/' },
    { id: 'gfg-tp1', title: 'Count the triplets', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/count-the-triplets4615/1' },
    { id: 'lc-283-tp', title: 'Move Zeroes', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/move-zeroes/' },
    { id: 'lc-75', title: 'Sort Colors', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-colors/' },
  ],

  'Greedy': [
    { id: 'lc-53-gr', title: 'Maximum Subarray', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { id: 'lc-55', title: 'Jump Game', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/jump-game/' },
    { id: 'lc-45', title: 'Jump Game II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/jump-game-ii/' },
    { id: 'lc-134', title: 'Gas Station', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/gas-station/' },
    { id: 'lc-435', title: 'Non-overlapping Intervals', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
    { id: 'lc-763', title: 'Partition Labels', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/partition-labels/' },
    { id: 'gfg-gr1', title: 'Activity Selection', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1' },
    { id: 'gfg-gr2', title: 'Fractional Knapsack', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1' },
    { id: 'lc-678', title: 'Valid Parenthesis String', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parenthesis-string/' },
    { id: 'lc-57', title: 'Insert Interval', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/insert-interval/' },
  ],

  'Backtracking': [
    { id: 'lc-39', title: 'Combination Sum', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/combination-sum/' },
    { id: 'lc-40', title: 'Combination Sum II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/combination-sum-ii/' },
    { id: 'lc-46', title: 'Permutations', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/permutations/' },
    { id: 'lc-78', title: 'Subsets', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/subsets/' },
    { id: 'lc-79-bt', title: 'Word Search', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-search/' },
    { id: 'lc-51', title: 'N-Queens', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/n-queens/' },
    { id: 'lc-37', title: 'Sudoku Solver', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/sudoku-solver/' },
    { id: 'gfg-bt1', title: 'Rat in a Maze Problem', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' },
    { id: 'gfg-bt2', title: 'Permutations of a given string', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1' },
    { id: 'lc-17', title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
  ],

  'Sorting': [
    { id: 'lc-912', title: 'Sort an Array (Merge Sort)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-an-array/' },
    { id: 'lc-75-so', title: 'Sort Colors (Dutch National Flag)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-colors/' },
    { id: 'lc-56', title: 'Merge Intervals', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-intervals/' },
    { id: 'lc-179', title: 'Largest Number', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/largest-number/' },
    { id: 'lc-315', title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' },
    { id: 'gfg-so1', title: 'Sort an array of 0s, 1s and 2s', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1' },
    { id: 'gfg-so2', title: 'Quick Sort', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/quick-sort/1' },
    { id: 'lc-148', title: 'Sort List', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sort-list/' },
    { id: 'lc-252', title: 'Meeting Rooms', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/meeting-rooms/' },
  ],

  'Trie': [
    { id: 'lc-208', title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
    { id: 'lc-211', title: 'Design Add and Search Words', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
    { id: 'lc-212', title: 'Word Search II', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-search-ii/' },
    { id: 'lc-14-tr', title: 'Longest Common Prefix', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-prefix/' },
    { id: 'gfg-tr1', title: 'Trie | (Insert and Search)', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/trie-insert-and-search0651/1' },
    { id: 'gfg-tr2', title: 'Phone directory', difficulty: 'Hard', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/phone-directory4628/1' },
    { id: 'lc-648', title: 'Replace Words', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/replace-words/' },
    { id: 'lc-745', title: 'Prefix and Suffix Search', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/prefix-and-suffix-search/' },
  ],

  'Math': [
    { id: 'lc-9', title: 'Palindrome Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/palindrome-number/' },
    { id: 'lc-66', title: 'Plus One', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/plus-one/' },
    { id: 'lc-50', title: 'Pow(x, n)', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/powx-n/' },
    { id: 'lc-43', title: 'Multiply Strings', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/multiply-strings/' },
    { id: 'lc-279', title: 'Perfect Squares', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/perfect-squares/' },
    { id: 'lc-357', title: 'Count Numbers with Unique Digits', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/count-numbers-with-unique-digits/' },
    { id: 'gfg-ma1', title: 'GCD and LCM', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/lcm-and-gcd4516/1' },
    { id: 'gfg-ma2', title: 'Prime Number', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/prime-number2314/1' },
    { id: 'lc-202-ma', title: 'Happy Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/happy-number/' },
    { id: 'lc-69', title: 'Sqrt(x)', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/sqrtx/' },
  ],

  'Matrix': [
    { id: 'lc-73', title: 'Set Matrix Zeroes', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
    { id: 'lc-54', title: 'Spiral Matrix', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/spiral-matrix/' },
    { id: 'lc-48', title: 'Rotate Image', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/rotate-image/' },
    { id: 'lc-79-mx', title: 'Word Search', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/word-search/' },
    { id: 'gfg-mx1', title: 'Spirally traversing a matrix', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/spirally-traversing-a-matrix-1587115621/1' },
    { id: 'gfg-mx2', title: 'Transpose of Matrix', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/transpose-of-matrix-1587115621/1' },
    { id: 'lc-766', title: 'Toeplitz Matrix', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/toeplitz-matrix/' },
    { id: 'lc-1091-mx', title: 'Shortest Path in Binary Matrix', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/' },
  ],

  'Bit Manipulation': [
    { id: 'lc-136', title: 'Single Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/single-number/' },
    { id: 'lc-191', title: 'Number of 1 Bits', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-1-bits/' },
    { id: 'lc-338', title: 'Counting Bits', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/counting-bits/' },
    { id: 'lc-190', title: 'Reverse Bits', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-bits/' },
    { id: 'lc-268', title: 'Missing Number', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/missing-number/' },
    { id: 'lc-371', title: 'Sum of Two Integers', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
    { id: 'gfg-bi1', title: 'Bit Manipulation - 1', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/bit-manipulation-1664335202/1' },
    { id: 'lc-137', title: 'Single Number II', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/single-number-ii/' },
    { id: 'lc-201', title: 'Bitwise AND of Numbers Range', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/bitwise-and-of-numbers-range/' },
  ],

  'Union-Find': [
    { id: 'lc-684-uf', title: 'Redundant Connection', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/redundant-connection/' },
    { id: 'lc-323-uf', title: 'Number of Connected Components', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
    { id: 'lc-128-uf', title: 'Longest Consecutive Sequence', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    { id: 'lc-200-uf', title: 'Number of Islands', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 'gfg-uf1', title: 'Union-Find', difficulty: 'Easy', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/union-find/1' },
    { id: 'lc-547', title: 'Number of Provinces', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-provinces/' },
    { id: 'lc-1971', title: 'Find if Path Exists in Graph', difficulty: 'Easy', platform: 'LeetCode', url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/' },
  ],

  'Segment Tree': [
    { id: 'lc-307', title: 'Range Sum Query - Mutable', difficulty: 'Medium', platform: 'LeetCode', url: 'https://leetcode.com/problems/range-sum-query-mutable/' },
    { id: 'lc-315-st', title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' },
    { id: 'gfg-seg1', title: 'Segment Tree | Set 1 (Sum of given range)', difficulty: 'Medium', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/range-minimum-query/1' },
    { id: 'gfg-seg2', title: 'Longest Increasing Subsequence using BIT', difficulty: 'Hard', platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-using-binary-indexed-tree/1' },
    { id: 'lc-493', title: 'Reverse Pairs', difficulty: 'Hard', platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-pairs/' },
  ],
};

/**
 * Get shuffled random problems for a given DSA topic.
 * If topic not found in dataset, returns empty array.
 */
export const getTopicProblems = (topicName: string): TopicProblem[] => {
  // Direct match
  if (TOPIC_PROBLEMS[topicName]) {
    const list = [...TOPIC_PROBLEMS[topicName]];
    // Fisher-Yates shuffle for random order
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  // Fallback: search by partial name
  const key = Object.keys(TOPIC_PROBLEMS).find(k =>
    k.toLowerCase().includes(topicName.toLowerCase()) ||
    topicName.toLowerCase().includes(k.toLowerCase())
  );
  if (key) {
    const list = [...TOPIC_PROBLEMS[key]];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  return [];
};
