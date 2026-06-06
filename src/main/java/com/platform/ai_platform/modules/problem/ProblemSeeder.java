package com.platform.ai_platform.modules.problem;

import com.platform.ai_platform.modules.problem.entity.Difficulty;
import com.platform.ai_platform.modules.problem.entity.Problem;
import com.platform.ai_platform.modules.problem.entity.TestCase;
import com.platform.ai_platform.modules.problem.repository.ProblemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProblemSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    public ProblemSeeder(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() == 0) {
            Problem twoSum = Problem.builder()
                    .title("Two Sum")
                    .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.")
                    .difficulty(Difficulty.valueOf("EASY"))
                    .tags(List.of("Array", "Hash Table"))
                    .constraints(List.of("2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."))
                    .testCases(List.of(
                            new TestCase("[2,7,11,15]\n9", "[0,1]", false),
                            new TestCase("[3,2,4]\n6", "[1,2]", false),
                            new TestCase("[3,3]\n6", "[0,1]", false)
                    ))
                    .build();

            Problem reverseString = Problem.builder()
                    .title("Reverse String")
                    .description("Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.")
                    .difficulty(Difficulty.valueOf("EASY"))
                    .tags(List.of("Two Pointers", "String"))
                    .constraints(List.of("1 <= s.length <= 10^5", "s[i] is a printable ascii character."))
                    .testCases(List.of(
                            new TestCase("[\"h\",\"e\",\"l\",\"l\",\"o\"]", "[\"o\",\"l\",\"l\",\"e\",\"h\"]", false),
                            new TestCase("[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]", false)
                    ))
                    .build();

            Problem longestSubstring = Problem.builder()
                    .title("Longest Substring Without Repeating Characters")
                    .description("Given a string s, find the length of the longest substring without repeating characters.")
                    .difficulty(Difficulty.valueOf("MEDIUM"))
                    .tags(List.of("Hash Table", "String", "Sliding Window"))
                    .constraints(List.of("0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."))
                    .testCases(List.of(
                            new TestCase("\"abcabcbb\"", "3", false),
                            new TestCase("\"bbbbb\"", "1", false),
                            new TestCase("\"pwwkew\"", "3", false)
                    ))
                    .build();

            Problem palindromeNumber = Problem.builder()
                    .title("Palindrome Number")
                    .description("Given an integer x, return true if x is a palindrome, and false otherwise.")
                    .difficulty(Difficulty.valueOf("EASY"))
                    .tags(List.of("Math"))
                    .constraints(List.of("-2^31 <= x <= 2^31 - 1"))
                    .testCases(List.of(
                            new TestCase("121", "true", false),
                            new TestCase("-121", "false", false),
                            new TestCase("10", "false", false)
                    ))
                    .build();

            Problem mergeIntervals = Problem.builder()
                    .title("Merge Intervals")
                    .description("Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.")
                    .difficulty(Difficulty.valueOf("MEDIUM"))
                    .tags(List.of("Array", "Sorting"))
                    .constraints(List.of("1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"))
                    .testCases(List.of(
                            new TestCase("[[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]", false),
                            new TestCase("[[1,4],[4,5]]", "[[1,5]]", false)
                    ))
                    .build();

            problemRepository.saveAll(List.of(twoSum, reverseString, longestSubstring, palindromeNumber, mergeIntervals));
            System.out.println("Seeded database with 5 coding problems.");
        }
    }
}
