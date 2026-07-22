package com.platform.ai_platform.modules.dsa;

import com.platform.ai_platform.modules.dsa.entity.DsaTopic;
import com.platform.ai_platform.modules.dsa.repository.DsaTopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(1)
@RequiredArgsConstructor
public class DsaTopicSeeder implements CommandLineRunner {

    private final DsaTopicRepository dsaTopicRepository;

    @Override
    public void run(String... args) throws Exception {
        if (dsaTopicRepository.count() > 0) return;

        List<DsaTopic> topics = List.of(
            // Phase 1: Fundamentals
            DsaTopic.builder().topicOrder(1).name("Array").icon("📦").phase("Fundamentals")
                .description("Master the basics — traversal, searching, and manipulation of arrays.").build(),
            DsaTopic.builder().topicOrder(2).name("String").icon("🔤").phase("Fundamentals")
                .description("String operations, pattern matching, and character manipulation.").build(),
            DsaTopic.builder().topicOrder(3).name("HashMap").icon("🗺️").phase("Fundamentals")
                .description("Hash maps and hash sets for O(1) lookups and frequency counting.").build(),
            DsaTopic.builder().topicOrder(4).name("Two Pointers").icon("👆").phase("Fundamentals")
                .description("Use two indices to reduce time complexity on sorted or paired data.").build(),
            DsaTopic.builder().topicOrder(5).name("Sliding Window").icon("🪟").phase("Fundamentals")
                .description("Maintain a window of elements for subarray/substring problems.").build(),

            // Phase 2: Core Data Structures
            DsaTopic.builder().topicOrder(6).name("Stack & Queue").icon("📚").phase("Core DS")
                .description("LIFO/FIFO structures, monotonic stacks, and deque patterns.").build(),
            DsaTopic.builder().topicOrder(7).name("Linked List").icon("🔗").phase("Core DS")
                .description("Pointer manipulation, reversal, merging, and cycle detection.").build(),
            DsaTopic.builder().topicOrder(8).name("Binary Search").icon("🔍").phase("Core DS")
                .description("Efficiently search sorted arrays and answer min/max questions.").build(),
            DsaTopic.builder().topicOrder(9).name("Recursion").icon("🔄").phase("Core DS")
                .description("Break problems into smaller subproblems using recursive thinking.").build(),

            // Phase 3: Advanced Data Structures
            DsaTopic.builder().topicOrder(10).name("Trees").icon("🌳").phase("Advanced DS")
                .description("Binary trees, BSTs, DFS/BFS traversals, and tree properties.").build(),
            DsaTopic.builder().topicOrder(11).name("Graphs").icon("🕸️").phase("Advanced DS")
                .description("BFS, DFS, topological sort, union-find, and shortest paths.").build(),
            DsaTopic.builder().topicOrder(12).name("Heap").icon("🏔️").phase("Advanced DS")
                .description("Min/Max heaps for priority queues, top-K problems, and scheduling.").build(),

            // Phase 4: Algorithms
            DsaTopic.builder().topicOrder(13).name("Dynamic Programming").icon("💡").phase("Algorithms")
                .description("Memoization and tabulation for optimal substructure problems.").build(),
            DsaTopic.builder().topicOrder(14).name("Greedy").icon("🤑").phase("Algorithms")
                .description("Make locally optimal choices for globally optimal solutions.").build(),
            DsaTopic.builder().topicOrder(15).name("Backtracking").icon("↩️").phase("Algorithms")
                .description("Explore all possibilities with systematic pruning.").build()
        );

        dsaTopicRepository.saveAll(topics);
        System.out.println("✅ Seeded 15 DSA topics.");
    }
}
