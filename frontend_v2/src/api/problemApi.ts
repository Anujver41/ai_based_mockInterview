import apiClient from '@/api/axios';

const PROBLEMS = '/problems';

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  constraints: string[];
  testCases: TestCase[];
}

export interface ProblemCreateRequest {
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  constraints: string[];
  testCases: TestCase[];
}

export interface Page<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Complete 50 DSA Problem Dataset (Matching localhost DsaProblemSeeder)
export const DEFAULT_PROBLEMS: Problem[] = [
  {
    id: 'p-1',
    title: 'Edit Distance',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have 3 operations permitted on a word: Insert a character, Delete a character, Replace a character.',
    difficulty: 'HARD',
    tags: ['Dynamic Programming', 'String'],
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    testCases: [{ input: '"horse"\n"ros"', expectedOutput: '3', isHidden: false }]
  },
  {
    id: 'p-2',
    title: 'Longest Increasing Subsequence',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    difficulty: 'MEDIUM',
    tags: ['Dynamic Programming', 'Binary Search'],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    testCases: [{ input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4', isHidden: false }]
  },
  {
    id: 'p-3',
    title: 'Coin Change',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.',
    difficulty: 'MEDIUM',
    tags: ['Dynamic Programming', 'Breadth-First Search'],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    testCases: [{ input: '[1,2,5]\n11', expectedOutput: '3', isHidden: false }]
  },
  {
    id: 'p-4',
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: 'EASY',
    tags: ['Dynamic Programming', 'Math'],
    constraints: ['1 <= n <= 45'],
    testCases: [{ input: '2', expectedOutput: '2', isHidden: false }, { input: '3', expectedOutput: '3', isHidden: false }]
  },
  {
    id: 'p-5',
    title: 'Serialize and Deserialize Binary Tree',
    description: 'Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer. Design an algorithm to serialize and deserialize a binary tree.',
    difficulty: 'HARD',
    tags: ['Trees', 'Depth-First Search'],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-1000 <= Node.val <= 1000'],
    testCases: [{ input: '[1,2,3,null,null,4,5]', expectedOutput: '[1,2,3,null,null,4,5]', isHidden: false }]
  },
  {
    id: 'p-6',
    title: 'Binary Tree Level Order Traversal',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes values. (i.e., from left to right, level by level).',
    difficulty: 'MEDIUM',
    tags: ['Trees', 'Breadth-First Search'],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    testCases: [{ input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false }]
  },
  {
    id: 'p-7',
    title: 'Validate Binary Search Tree',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    difficulty: 'MEDIUM',
    tags: ['Trees', 'Depth-First Search'],
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    testCases: [{ input: '[2,1,3]', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-8',
    title: 'Maximum Depth of Binary Tree',
    description: 'Given the root of a binary tree, return its maximum depth.',
    difficulty: 'EASY',
    tags: ['Trees', 'Depth-First Search'],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    testCases: [{ input: '[3,9,20,null,null,15,7]', expectedOutput: '3', isHidden: false }]
  },
  {
    id: 'p-9',
    title: 'Invert Binary Tree',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    difficulty: 'EASY',
    tags: ['Trees', 'Depth-First Search'],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    testCases: [{ input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]', isHidden: false }]
  },
  {
    id: 'p-10',
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    difficulty: 'HARD',
    tags: ['Binary Search', 'Array'],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000'],
    testCases: [{ input: '[1,3]\n[2]', expectedOutput: '2.0', isHidden: false }]
  },
  {
    id: 'p-11',
    title: 'Find Minimum in Rotated Sorted Array',
    description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element.',
    difficulty: 'MEDIUM',
    tags: ['Binary Search', 'Array'],
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000'],
    testCases: [{ input: '[3,4,5,1,2]', expectedOutput: '1', isHidden: false }]
  },
  {
    id: 'p-12',
    title: 'Search a 2D Matrix',
    description: 'Write an efficient algorithm that searches for a value target in an m x n integer matrix.',
    difficulty: 'MEDIUM',
    tags: ['Binary Search', 'Array'],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 100'],
    testCases: [{ input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n3', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-13',
    title: 'Binary Search',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
    difficulty: 'EASY',
    tags: ['Binary Search', 'Array'],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4'],
    testCases: [{ input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4', isHidden: false }]
  },
  {
    id: 'p-14',
    title: 'Merge K Sorted Lists',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    difficulty: 'HARD',
    tags: ['Linked List', 'Heap'],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500'],
    testCases: [{ input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]', isHidden: false }]
  },
  {
    id: 'p-15',
    title: 'Reorder List',
    description: 'You are given the head of a singly linked-list. Reorder the list to be: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...',
    difficulty: 'MEDIUM',
    tags: ['Linked List'],
    constraints: ['The number of nodes in the list is in the range [1, 5 * 10^4].'],
    testCases: [{ input: '[1,2,3,4]', expectedOutput: '[1,4,2,3]', isHidden: false }]
  },
  {
    id: 'p-16',
    title: 'Linked List Cycle',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    difficulty: 'EASY',
    tags: ['Linked List', 'Two Pointers'],
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].'],
    testCases: [{ input: '[3,2,0,-4]\n1', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-17',
    title: 'Merge Two Sorted Lists',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.',
    difficulty: 'EASY',
    tags: ['Linked List'],
    constraints: ['The number of nodes in both lists is in the range [0, 50].'],
    testCases: [{ input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]', isHidden: false }]
  },
  {
    id: 'p-18',
    title: 'Reverse Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'EASY',
    tags: ['Linked List'],
    constraints: ['The number of nodes in the list is the range [0, 5000].'],
    testCases: [{ input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false }]
  },
  {
    id: 'p-19',
    title: 'Largest Rectangle in Histogram',
    description: 'Given an array of integers heights representing the histogram bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    difficulty: 'HARD',
    tags: ['Stack & Queue', 'Array'],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    testCases: [{ input: '[2,1,5,6,2,3]', expectedOutput: '10', isHidden: false }]
  },
  {
    id: 'p-20',
    title: 'Daily Temperatures',
    description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    difficulty: 'MEDIUM',
    tags: ['Stack & Queue', 'Array'],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    testCases: [{ input: '[73,74,75,71,69,72,76,73]', expectedOutput: '[1,1,4,2,1,1,0,0]', isHidden: false }]
  },
  {
    id: 'p-21',
    title: 'Implement Queue using Stacks',
    description: 'Implement a first in first out (FIFO) queue using only two stacks.',
    difficulty: 'EASY',
    tags: ['Stack & Queue', 'Queue'],
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    testCases: [{ input: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]', expectedOutput: '[null, null, null, 1, 1, false]', isHidden: false }]
  },
  {
    id: 'p-22',
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    difficulty: 'EASY',
    tags: ['Stack & Queue', 'Stack'],
    constraints: ['1 <= s.length <= 10^4'],
    testCases: [{ input: '"()[]{}"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-23',
    title: 'Sliding Window Maximum',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.',
    difficulty: 'HARD',
    tags: ['Sliding Window', 'Deque'],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    testCases: [{ input: '[1,3,-1,-3,5,3,6,7]\n3', expectedOutput: '[3,3,5,5,6,7]', isHidden: false }]
  },
  {
    id: 'p-24',
    title: 'Permutation in String',
    description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.',
    difficulty: 'MEDIUM',
    tags: ['Sliding Window', 'String'],
    constraints: ['1 <= s1.length, s2.length <= 10^4'],
    testCases: [{ input: '"ab"\n"eidbaooo"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-25',
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'MEDIUM',
    tags: ['Sliding Window', 'String', 'Hash Table'],
    constraints: ['0 <= s.length <= 5 * 10^4'],
    testCases: [{ input: '"abcabcbb"', expectedOutput: '3', isHidden: false }]
  },
  {
    id: 'p-26',
    title: 'Maximum Average Subarray I',
    description: 'You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value.',
    difficulty: 'EASY',
    tags: ['Sliding Window', 'Array'],
    constraints: ['n == nums.length', '1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [{ input: '[1,12,-5,-6,50,3]\n4', expectedOutput: '12.75', isHidden: false }]
  },
  {
    id: 'p-27',
    title: 'Minimum Size Subarray Sum',
    description: 'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target.',
    difficulty: 'HARD',
    tags: ['Two Pointers', 'Sliding Window'],
    constraints: ['1 <= target <= 10^9', '1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4'],
    testCases: [{ input: '7\n[2,3,1,2,4,3]', expectedOutput: '2', isHidden: false }]
  },
  {
    id: 'p-28',
    title: 'Container With Most Water',
    description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    difficulty: 'MEDIUM',
    tags: ['Two Pointers', 'Array'],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    testCases: [{ input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49', isHidden: false }]
  },
  {
    id: 'p-29',
    title: '3Sum',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    difficulty: 'MEDIUM',
    tags: ['Two Pointers', 'Array'],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    testCases: [{ input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isHidden: false }]
  },
  {
    id: 'p-30',
    title: 'Move Zeroes',
    description: 'Given an integer array nums, move all 0s to the end of it while maintaining the relative order of the non-zero elements.',
    difficulty: 'EASY',
    tags: ['Two Pointers', 'Array'],
    constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    testCases: [{ input: '[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]', isHidden: false }]
  },
  {
    id: 'p-31',
    title: 'Valid Palindrome II',
    description: 'Given a string s, return true if the s can be palindrome after deleting at most one character from it.',
    difficulty: 'EASY',
    tags: ['Two Pointers', 'String'],
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [{ input: '"abca"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-32',
    title: 'Alien Dictionary',
    description: 'There is a new alien language that uses the Latin alphabet. However, the order of letters is unknown to you. You are given a list of strings words from the alien language dictionary.',
    difficulty: 'HARD',
    tags: ['HashMap', 'Graphs'],
    constraints: ['1 <= words.length <= 100', '1 <= words[i].length <= 100'],
    testCases: [{ input: '["wrt","wrf","er","ett","rftt"]', expectedOutput: '"wertf"', isHidden: false }]
  },
  {
    id: 'p-33',
    title: 'LRU Cache',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    difficulty: 'MEDIUM',
    tags: ['HashMap', 'Linked List'],
    constraints: ['1 <= capacity <= 3000'],
    testCases: [{ input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', expectedOutput: '[null, null, null, 1, null, -1, null, -1, 3, 4]', isHidden: false }]
  },
  {
    id: 'p-34',
    title: 'Top K Frequent Elements',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements.',
    difficulty: 'MEDIUM',
    tags: ['HashMap', 'Heap'],
    constraints: ['1 <= nums.length <= 10^5', 'k is in the range [1, the number of unique elements in the array].'],
    testCases: [{ input: '[1,1,1,2,2,3]\n2', expectedOutput: '[1,2]', isHidden: false }]
  },
  {
    id: 'p-35',
    title: 'Isomorphic Strings',
    description: 'Given two strings s and t, determine if they are isomorphic.',
    difficulty: 'EASY',
    tags: ['HashMap', 'String'],
    constraints: ['1 <= s.length <= 5 * 10^4', 't.length == s.length'],
    testCases: [{ input: '"egg"\n"add"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-36',
    title: 'Ransom Note',
    description: 'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.',
    difficulty: 'EASY',
    tags: ['HashMap', 'String'],
    constraints: ['1 <= ransomNote.length, magazine.length <= 10^5'],
    testCases: [{ input: '"a"\n"b"', expectedOutput: 'false', isHidden: false }, { input: '"aa"\n"aab"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-37',
    title: 'Minimum Window Substring',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    difficulty: 'HARD',
    tags: ['String', 'Sliding Window'],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5'],
    testCases: [{ input: '"ADOBECODEBANC"\n"ABC"', expectedOutput: '"BANC"', isHidden: false }]
  },
  {
    id: 'p-38',
    title: 'Group Anagrams',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    difficulty: 'MEDIUM',
    tags: ['String', 'Hash Table'],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    testCases: [{ input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', isHidden: false }]
  },
  {
    id: 'p-39',
    title: 'Longest Palindromic Substring',
    description: 'Given a string s, return the longest palindromic substring in s.',
    difficulty: 'MEDIUM',
    tags: ['String', 'Dynamic Programming'],
    constraints: ['1 <= s.length <= 1000'],
    testCases: [{ input: '"babad"', expectedOutput: '"bab"', isHidden: false }]
  },
  {
    id: 'p-40',
    title: 'Valid Palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    difficulty: 'EASY',
    tags: ['String', 'Two Pointers'],
    constraints: ['1 <= s.length <= 2 * 10^5'],
    testCases: [{ input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-41',
    title: 'Valid Anagram',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    difficulty: 'EASY',
    tags: ['String', 'Hash Table'],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
    testCases: [{ input: '"anagram"\n"nagaram"', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-42',
    title: 'Trapping Rain Water',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    difficulty: 'HARD',
    tags: ['Array', 'Two Pointers'],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    testCases: [{ input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isHidden: false }]
  },
  {
    id: 'p-43',
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    difficulty: 'MEDIUM',
    tags: ['Array', 'Dynamic Programming'],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', isHidden: false }]
  },
  {
    id: 'p-44',
    title: 'Product of Array Except Self',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
    difficulty: 'MEDIUM',
    tags: ['Array'],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    testCases: [{ input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', isHidden: false }]
  },
  {
    id: 'p-45',
    title: 'Contains Duplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    difficulty: 'EASY',
    tags: ['Array', 'Hash Table'],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    testCases: [{ input: '[1,2,3,1]', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-46',
    title: 'Best Time to Buy and Sell Stock',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
    difficulty: 'EASY',
    tags: ['Array'],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    testCases: [{ input: '[7,1,5,3,6,4]', expectedOutput: '5', isHidden: false }]
  },
  {
    id: 'p-47',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'EASY',
    tags: ['Array', 'Hash Table'],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    testCases: [{ input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false }]
  },
  {
    id: 'p-48',
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    difficulty: 'EASY',
    tags: ['Two Pointers', 'String'],
    constraints: ['1 <= s.length <= 10^5'],
    testCases: [{ input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isHidden: false }]
  },
  {
    id: 'p-49',
    title: 'Palindrome Number',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    difficulty: 'EASY',
    tags: ['Math'],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    testCases: [{ input: '121', expectedOutput: 'true', isHidden: false }]
  },
  {
    id: 'p-50',
    title: 'Merge Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    difficulty: 'MEDIUM',
    tags: ['Array', 'Sorting'],
    constraints: ['1 <= intervals.length <= 10^4'],
    testCases: [{ input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false }]
  }
];

export const getProblems = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  direction: string = 'DESC'
): Promise<Page<Problem>> => {
  try {
    const response = await apiClient.get<Page<Problem>>(PROBLEMS, {
      params: { page, size, sortBy, direction },
    });
    // If connected backend returns a complete problem set (> 5 items total), use it!
    if (response.data && response.data.content && response.data.totalElements > 5) {
      return response.data;
    }
  } catch (err) {
    console.warn('Backend problems API call failed; utilizing complete 50-problem DSA dataset.');
  }

  // Fallback to client-side 50 problem dataset matching localhost exactly
  const totalElements = DEFAULT_PROBLEMS.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const end = Math.min(start + size, totalElements);
  const content = DEFAULT_PROBLEMS.slice(start, end);

  return {
    content,
    pageable: { pageNumber: page, pageSize: size },
    totalElements,
    totalPages,
    last: page >= totalPages - 1,
    size,
    number: page,
    sort: { sorted: true, unsorted: false, empty: false },
    numberOfElements: content.length,
    first: page === 0,
    empty: content.length === 0,
  };
};

export const getProblemById = async (id: string): Promise<Problem> => {
  try {
    const response = await apiClient.get<Problem>(`${PROBLEMS}/${id}`);
    if (response.data) return response.data;
  } catch (err) {
    console.warn('Backend problem detail API call failed; searching fallback dataset.');
  }
  const found = DEFAULT_PROBLEMS.find(
    p => p.id === id || p.title.toLowerCase() === id.toLowerCase() || p.id === `p-${id}`
  );
  return found || DEFAULT_PROBLEMS[0];
};

export const createProblem = async (problem: ProblemCreateRequest): Promise<Problem> => {
  try {
    const response = await apiClient.post<Problem>(PROBLEMS, problem);
    return response.data;
  } catch (err) {
    const newProblem: Problem = {
      id: `p-${DEFAULT_PROBLEMS.length + 1}`,
      ...problem,
    };
    DEFAULT_PROBLEMS.unshift(newProblem);
    return newProblem;
  }
};
