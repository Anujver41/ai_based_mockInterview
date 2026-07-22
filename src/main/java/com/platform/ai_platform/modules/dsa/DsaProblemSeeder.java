package com.platform.ai_platform.modules.dsa;

import com.platform.ai_platform.modules.problem.entity.Difficulty;
import com.platform.ai_platform.modules.problem.entity.Problem;
import com.platform.ai_platform.modules.problem.entity.SourcePlatform;
import com.platform.ai_platform.modules.problem.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class DsaProblemSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    private Problem p(String title, String desc, Difficulty diff, String topic, String url, SourcePlatform src, List<String> tags) {
        return Problem.builder()
            .title(title).description(desc).difficulty(diff)
            .dsaTopic(topic).sourceUrl(url).sourcePlatform(src)
            .tags(tags).constraints(List.of()).testCases(List.of())
            .build();
    }

    @Override
    public void run(String... args) {
        List<Problem> newProblems = buildProblems().stream()
            .filter(p -> !problemRepository.existsByTitle(p.getTitle()))
            .toList();
        if (!newProblems.isEmpty()) {
            problemRepository.saveAll(newProblems);
            System.out.println("✅ Seeded " + newProblems.size() + " DSA problems.");
        }
    }

    private List<Problem> buildProblems() {
        return List.of(
            // ── ARRAY ──
            p("Two Sum", "Given an array of integers and a target, return indices of two numbers that add up to the target.", Difficulty.EASY, "Array", "https://leetcode.com/problems/two-sum/", SourcePlatform.LEETCODE, List.of("Array", "HashMap")),
            p("Best Time to Buy and Sell Stock", "Find the max profit by choosing one day to buy and a later day to sell.", Difficulty.EASY, "Array", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", SourcePlatform.LEETCODE, List.of("Array")),
            p("Contains Duplicate", "Given an integer array, return true if any value appears at least twice.", Difficulty.EASY, "Array", "https://leetcode.com/problems/contains-duplicate/", SourcePlatform.LEETCODE, List.of("Array","HashMap")),
            p("Product of Array Except Self", "Return an array where each element is the product of all other elements.", Difficulty.MEDIUM, "Array", "https://leetcode.com/problems/product-of-array-except-self/", SourcePlatform.LEETCODE, List.of("Array")),
            p("Maximum Subarray", "Find the contiguous subarray with the largest sum.", Difficulty.MEDIUM, "Array", "https://leetcode.com/problems/maximum-subarray/", SourcePlatform.LEETCODE, List.of("Array","DP")),
            p("Trapping Rain Water", "Given elevation map, compute how much water it can trap after raining.", Difficulty.HARD, "Array", "https://leetcode.com/problems/trapping-rain-water/", SourcePlatform.LEETCODE, List.of("Array","Two Pointers")),

            // ── STRING ──
            p("Valid Anagram", "Given two strings, return true if one is an anagram of the other.", Difficulty.EASY, "String", "https://leetcode.com/problems/valid-anagram/", SourcePlatform.LEETCODE, List.of("String","HashMap")),
            p("Valid Palindrome", "A string is a palindrome if it reads the same after removing non-alphanumeric characters.", Difficulty.EASY, "String", "https://leetcode.com/problems/valid-palindrome/", SourcePlatform.LEETCODE, List.of("String","Two Pointers")),
            p("Longest Palindromic Substring", "Given a string, return the longest palindromic substring.", Difficulty.MEDIUM, "String", "https://leetcode.com/problems/longest-palindromic-substring/", SourcePlatform.LEETCODE, List.of("String","DP")),
            p("Group Anagrams", "Given an array of strings, group the anagrams together.", Difficulty.MEDIUM, "String", "https://leetcode.com/problems/group-anagrams/", SourcePlatform.LEETCODE, List.of("String","HashMap")),
            p("Minimum Window Substring", "Find the minimum window in string s that contains all characters of t.", Difficulty.HARD, "String", "https://leetcode.com/problems/minimum-window-substring/", SourcePlatform.LEETCODE, List.of("String","Sliding Window")),

            // ── HASHMAP ──
            p("Ransom Note", "Given ransom note and magazine strings, return if note can be constructed from magazine.", Difficulty.EASY, "HashMap", "https://leetcode.com/problems/ransom-note/", SourcePlatform.LEETCODE, List.of("HashMap","String")),
            p("Isomorphic Strings", "Two strings are isomorphic if chars in s can be replaced to get t.", Difficulty.EASY, "HashMap", "https://leetcode.com/problems/isomorphic-strings/", SourcePlatform.LEETCODE, List.of("HashMap","String")),
            p("Top K Frequent Elements", "Given integer array, return the k most frequent elements.", Difficulty.MEDIUM, "HashMap", "https://leetcode.com/problems/top-k-frequent-elements/", SourcePlatform.LEETCODE, List.of("HashMap","Heap")),
            p("LRU Cache", "Design a data structure that follows Least Recently Used cache constraints.", Difficulty.MEDIUM, "HashMap", "https://leetcode.com/problems/lru-cache/", SourcePlatform.LEETCODE, List.of("HashMap","Linked List")),
            p("Alien Dictionary", "Given sorted alien language words, derive the character order.", Difficulty.HARD, "HashMap", "https://leetcode.com/problems/alien-dictionary/", SourcePlatform.LEETCODE, List.of("HashMap","Graphs","Topological Sort")),

            // ── TWO POINTERS ──
            p("Valid Palindrome II", "Given a string, return true if it can be a palindrome after deleting at most one character.", Difficulty.EASY, "Two Pointers", "https://leetcode.com/problems/valid-palindrome-ii/", SourcePlatform.LEETCODE, List.of("Two Pointers","String")),
            p("Move Zeroes", "Move all 0s to the end while maintaining relative order of non-zero elements.", Difficulty.EASY, "Two Pointers", "https://leetcode.com/problems/move-zeroes/", SourcePlatform.LEETCODE, List.of("Two Pointers","Array")),
            p("3Sum", "Find all unique triplets in the array which give the sum of zero.", Difficulty.MEDIUM, "Two Pointers", "https://leetcode.com/problems/3sum/", SourcePlatform.LEETCODE, List.of("Two Pointers","Array")),
            p("Container With Most Water", "Find two lines that together with x-axis forms a container holding most water.", Difficulty.MEDIUM, "Two Pointers", "https://leetcode.com/problems/container-with-most-water/", SourcePlatform.LEETCODE, List.of("Two Pointers","Array")),
            p("Minimum Size Subarray Sum", "Find minimal length subarray where sum >= target.", Difficulty.HARD, "Two Pointers", "https://leetcode.com/problems/minimum-size-subarray-sum/", SourcePlatform.LEETCODE, List.of("Two Pointers","Sliding Window")),

            // ── SLIDING WINDOW ──
            p("Maximum Average Subarray I", "Find maximum average of any contiguous subarray of length k.", Difficulty.EASY, "Sliding Window", "https://leetcode.com/problems/maximum-average-subarray-i/", SourcePlatform.LEETCODE, List.of("Sliding Window","Array")),
            p("Longest Substring Without Repeating Characters", "Find length of longest substring without repeating characters.", Difficulty.MEDIUM, "Sliding Window", "https://leetcode.com/problems/longest-substring-without-repeating-characters/", SourcePlatform.LEETCODE, List.of("Sliding Window","String","HashMap")),
            p("Permutation in String", "Return true if one string is a permutation of a substring of the other.", Difficulty.MEDIUM, "Sliding Window", "https://leetcode.com/problems/permutation-in-string/", SourcePlatform.LEETCODE, List.of("Sliding Window","String")),
            p("Sliding Window Maximum", "Return max of each window of size k in the array.", Difficulty.HARD, "Sliding Window", "https://leetcode.com/problems/sliding-window-maximum/", SourcePlatform.LEETCODE, List.of("Sliding Window","Deque")),

            // ── STACK & QUEUE ──
            p("Valid Parentheses", "Given string with brackets, determine if the input is valid.", Difficulty.EASY, "Stack & Queue", "https://leetcode.com/problems/valid-parentheses/", SourcePlatform.LEETCODE, List.of("Stack")),
            p("Implement Queue using Stacks", "Implement FIFO queue using only two stacks.", Difficulty.EASY, "Stack & Queue", "https://leetcode.com/problems/implement-queue-using-stacks/", SourcePlatform.LEETCODE, List.of("Stack","Queue")),
            p("Daily Temperatures", "For each day return number of days until a warmer temperature.", Difficulty.MEDIUM, "Stack & Queue", "https://leetcode.com/problems/daily-temperatures/", SourcePlatform.LEETCODE, List.of("Stack","Array")),
            p("Largest Rectangle in Histogram", "Find the largest rectangle in a histogram.", Difficulty.HARD, "Stack & Queue", "https://leetcode.com/problems/largest-rectangle-in-histogram/", SourcePlatform.LEETCODE, List.of("Stack","Array")),

            // ── LINKED LIST ──
            p("Reverse Linked List", "Reverse a singly linked list.", Difficulty.EASY, "Linked List", "https://leetcode.com/problems/reverse-linked-list/", SourcePlatform.LEETCODE, List.of("Linked List")),
            p("Merge Two Sorted Lists", "Merge two sorted linked lists and return as one sorted list.", Difficulty.EASY, "Linked List", "https://leetcode.com/problems/merge-two-sorted-lists/", SourcePlatform.LEETCODE, List.of("Linked List")),
            p("Linked List Cycle", "Determine if a linked list has a cycle.", Difficulty.EASY, "Linked List", "https://leetcode.com/problems/linked-list-cycle/", SourcePlatform.LEETCODE, List.of("Linked List","Two Pointers")),
            p("Reorder List", "Reorder list so first node points to last, second to second-last, etc.", Difficulty.MEDIUM, "Linked List", "https://leetcode.com/problems/reorder-list/", SourcePlatform.LEETCODE, List.of("Linked List")),
            p("Merge K Sorted Lists", "Merge k sorted linked lists into one sorted linked list.", Difficulty.HARD, "Linked List", "https://leetcode.com/problems/merge-k-sorted-lists/", SourcePlatform.LEETCODE, List.of("Linked List","Heap")),

            // ── BINARY SEARCH ──
            p("Binary Search", "Given sorted array, return index of target or -1.", Difficulty.EASY, "Binary Search", "https://leetcode.com/problems/binary-search/", SourcePlatform.LEETCODE, List.of("Binary Search","Array")),
            p("Search a 2D Matrix", "Search for target in an m x n integer matrix.", Difficulty.MEDIUM, "Binary Search", "https://leetcode.com/problems/search-a-2d-matrix/", SourcePlatform.LEETCODE, List.of("Binary Search","Array")),
            p("Find Minimum in Rotated Sorted Array", "Find minimum in a rotated sorted array.", Difficulty.MEDIUM, "Binary Search", "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", SourcePlatform.LEETCODE, List.of("Binary Search","Array")),
            p("Median of Two Sorted Arrays", "Find the median of two sorted arrays in O(log(m+n)) time.", Difficulty.HARD, "Binary Search", "https://leetcode.com/problems/median-of-two-sorted-arrays/", SourcePlatform.LEETCODE, List.of("Binary Search","Array")),

            // ── TREES ──
            p("Maximum Depth of Binary Tree", "Given root of a binary tree, return its maximum depth.", Difficulty.EASY, "Trees", "https://leetcode.com/problems/maximum-depth-of-binary-tree/", SourcePlatform.LEETCODE, List.of("Trees","DFS")),
            p("Invert Binary Tree", "Invert a binary tree (mirror it).", Difficulty.EASY, "Trees", "https://leetcode.com/problems/invert-binary-tree/", SourcePlatform.LEETCODE, List.of("Trees","DFS")),
            p("Validate Binary Search Tree", "Determine if a given binary tree is a valid BST.", Difficulty.MEDIUM, "Trees", "https://leetcode.com/problems/validate-binary-search-tree/", SourcePlatform.LEETCODE, List.of("Trees","DFS")),
            p("Binary Tree Level Order Traversal", "Return level order traversal of binary tree values.", Difficulty.MEDIUM, "Trees", "https://leetcode.com/problems/binary-tree-level-order-traversal/", SourcePlatform.LEETCODE, List.of("Trees","BFS")),
            p("Serialize and Deserialize Binary Tree", "Design an algorithm to serialize and deserialize a binary tree.", Difficulty.HARD, "Trees", "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", SourcePlatform.LEETCODE, List.of("Trees","DFS")),

            // ── DYNAMIC PROGRAMMING ──
            p("Climbing Stairs", "Count distinct ways to climb to the top of n stairs.", Difficulty.EASY, "Dynamic Programming", "https://leetcode.com/problems/climbing-stairs/", SourcePlatform.LEETCODE, List.of("DP","Math")),
            p("Coin Change", "Find fewest coins needed to make up a given amount.", Difficulty.MEDIUM, "Dynamic Programming", "https://leetcode.com/problems/coin-change/", SourcePlatform.LEETCODE, List.of("DP","BFS")),
            p("Longest Increasing Subsequence", "Return length of the longest strictly increasing subsequence.", Difficulty.MEDIUM, "Dynamic Programming", "https://leetcode.com/problems/longest-increasing-subsequence/", SourcePlatform.LEETCODE, List.of("DP","Binary Search")),
            p("Edit Distance", "Return minimum operations required to convert word1 to word2.", Difficulty.HARD, "Dynamic Programming", "https://leetcode.com/problems/edit-distance/", SourcePlatform.LEETCODE, List.of("DP","String"))
        );
    }
}
