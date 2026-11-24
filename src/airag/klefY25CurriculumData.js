// ─── KL Deemed to be University (KLEF) Y25 B.Tech Academic Curriculum Knowledge Base ──
// Official Data Source: https://y25btech.klef.in
// Covers DSA-1 (ESC25SC1204ECASE), DSA-2 (ESC25SC1305ECASE), DSA-3 (PCC25CS2103ECASE),
// Project-Based Learning (PBL), CASE Framework, Evaluation System & Zero-Utility Constraint.

export const KLEF_Y25_KNOWLEDGE_BASE = [
  // ─── 1. KLEF Y25 B.TECH PORTAL & ACADEMIC ARCHITECTURE ──────────────────────
  {
    topic: "KLEF Y25 B.Tech Curriculum Overview & Portal (y25btech.klef.in)",
    keywords: [
      "y25btech", "y25btech.klef.in", "klef", "kl university", "kl deemed to be university",
      "y25", "y25 batch", "y25 curriculum", "klef curriculum", "pbl", "case", "trimester",
      "credit structure", "academic regulations", "contact hours"
    ],
    summary: "Official academic portal and curriculum architecture for the KL Deemed to be University (KLEF) Y25 B.Tech batch, featuring Project-Based Learning (PBL) and Continuous Assessment & Skill Evaluation (CASE).",
    primaryLang: "Academic Regulations & Curriculum Architecture",
    placementDemand: "KLEF Academic Excellence & Tier-1 Placement Readiness",
    content: `KLEF Y25 B.Tech Curriculum Overview (https://y25btech.klef.in):
1. **Institution & Batch Identity:**
   • **Institution:** KL Deemed to be University (Koneru Lakshmaiah Education Foundation - KLEF), Vaddeswaram, Guntur & Hyderabad.
   • **Portal:** https://y25btech.klef.in (Official open-access repository for Y25 B.Tech curriculum, course handbooks, modules, and lab workbooks).
   • **Target Batch:** Y25 B.Tech students (admitted 2025/2026).

2. **Pedagogy & Learning Framework:**
   • **PBL (Project-Based Learning):** Every core course transitions theory directly into production-grade engineering artifacts and working software engines.
   • **CASE (Continuous Assessment & Skill Evaluation):** Hands-on skilling and continuous lab evaluation rather than pure rote theory.
   • **Credit Architecture:** 4 Credits per DSA course structured as **2-0-2-4** (2 Lecture hours, 0 Tutorial hours, 2 Practical/Lab hours, 4 Skilling/Self-study hours) = **8 Contact Hours (CH)** weekly.

3. **Data Structures & Algorithms Course Sequence:**
   • **Trimester 2 (Year 1):** DSA-1 — Course Code: \`ESC25SC1204ECASE\` (Linear Data Structures, Searching, Sorting, Stacks, Queues).
   • **Trimester 3 (Year 1):** DSA-2 — Course Code: \`ESC25SC1305ECASE\` (Trees, BST, AVL, Heaps, Hashing, Graph Algorithms, Shortest Paths, MST).
   • **Year 2 (Trimester 4):** DSA-3 — Course Code: \`PCC25CS2103ECASE\` (Advanced Algorithms & Text Analytics Engine, KMP, Z-Algo, Dinic Max Flow, Bitmask DP, NP-Completeness, Parallel Blelloch Scan).`
  },

  // ─── 2. DSA-1 (ESC25SC1204ECASE) ─────────────────────────────────────────────
  {
    topic: "KLEF DSA-1 (ESC25SC1204ECASE): Complete Course Syllabus & Modules",
    keywords: [
      "esc25sc1204ecase", "dsa 1", "dsa-1", "dsa 1 syllabus", "dsa 1 klef", "klef dsa 1",
      "y25 dsa 1", "data structures and algorithms 1", "trimester 2 dsa", "pspj prerequisite",
      "dsa 1 modules", "esc25sc1204"
    ],
    summary: "Complete syllabus, modules, and competencies for DSA-1 (ESC25SC1204ECASE) at KLEF: Asymptotic complexity, linear data structures, search/sort algorithms, linked lists, stacks, and circular queues.",
    primaryLang: "Java / C / C++",
    placementDemand: "Core Coding Assessments & First-Year Engineering Foundations",
    content: `KLEF DSA-1 (ESC25SC1204ECASE) Complete Syllabus & Structure:
• **Course Code:** \`ESC25SC1204ECASE\`
• **Course Title:** Data Structures & Algorithms - 1
• **Academic Term:** Trimester 2 (Year 1) | **Credits:** 4.0 | **L-T-P-S:** 2-0-2-4 (8 Contact Hours)
• **Prerequisite:** PSPJ (Problem Solving & Programming in Java) / C Programming

---

#### 📚 Module Breakdown:
1. **Module 1: Algorithmic Thinking & Asymptotic Analysis:**
   • Need for data structures; RAM computational model.
   • Asymptotic notations: Big-O ($O$), Big-Omega ($\\Omega$), Big-Theta ($\\Theta$).
   • Growth of functions; Best, Average, and Worst-case analysis.
   • Space-time trade-offs and recurrence relation basics.

2. **Module 2: Arrays, Dynamic Arrays & String Processing:**
   • Fixed arrays vs. dynamic arrays (growth factor $\\times 2$, amortized $O(1)$ append).
   • Two Pointers technique (opposite ends, fast & slow pointers).
   • Sliding Window (fixed size $K$, variable window for longest substring).
   • Prefix Sums & Difference Arrays for $O(1)$ range queries.
   • Dutch National Flag algorithm (3-way partitioning of 0s, 1s, and 2s).

3. **Module 3: Searching & Elementary Sorting Algorithms:**
   • Linear Search ($O(N)$) vs Binary Search ($O(\\log N)$ on sorted data).
   • Binary search variants: safe midpoint calculation \`low + (high - low) / 2\`, floor, ceil, first/last occurrences.
   • Bubble Sort ($O(N^2)$ with early-exit optimization).
   • Selection Sort ($O(N^2)$, minimum swaps $O(N)$).
   • Insertion Sort ($O(N^2)$ worst, $O(N)$ best on adaptive/partially sorted inputs).
   • Stability and in-place properties of elementary sorts.

4. **Module 4: Linked Lists & Pointer Splicing:**
   • Singly Linked List (SLL): node anatomy \`(data, next)\`, insertion, deletion, search, traversal.
   • Doubly Linked List (DLL): bidirectional traversal with \`prev\` and \`next\`.
   • Circular Linked List (CLL): last node points to head (Round-Robin CPU scheduling).
   • In-place list reversal using 3 pointers (\`prev, curr, next\`).
   • Floyd's Cycle Detection algorithm (Tortoise and Hare) and cycle start point finding.

5. **Module 5: Stacks & Queues (ADTs & Parsing Applications):**
   • Stack ADT (LIFO): Array-based vs Linked List-based implementations, push/pop/peek in $O(1)$.
   • Applications: Balanced parentheses validation, function call stack frames.
   • Arithmetic Expression Parsing: Dijkstra's Shunting-Yard algorithm (Infix to Postfix conversion) and Postfix evaluation in $O(N)$.
   • Queue ADT (FIFO): Linear queue limitation (unusable front slots).
   • Circular Queue with modulo arithmetic: \`rear = (rear + 1) % capacity\`, full vs empty conditions.
   • Double-Ended Queue (Deque): insert/delete from both front and rear.`
  },

  // ─── 3. DSA-2 (ESC25SC1305ECASE) ─────────────────────────────────────────────
  {
    topic: "KLEF DSA-2 (ESC25SC1305ECASE): Complete Course Syllabus & Modules",
    keywords: [
      "esc25sc1305ecase", "dsa 2", "dsa-2", "dsa 2 syllabus", "dsa 2 klef", "klef dsa 2",
      "y25 dsa 2", "data structures and algorithms 2", "trimester 3 dsa", "trees", "graphs",
      "hashing", "avl", "heaps", "esc25sc1305"
    ],
    summary: "Complete syllabus, modules, and competencies for DSA-2 (ESC25SC1305ECASE) at KLEF: Advanced sorting, BST, AVL trees, Binary Heaps, Hashing collision techniques, Graph traversals, Dijkstra, and MST.",
    primaryLang: "Java / C++",
    placementDemand: "Tier-1 SDE Assessments & Technical Placements",
    content: `KLEF DSA-2 (ESC25SC1305ECASE) Complete Syllabus & Structure:
• **Course Code:** \`ESC25SC1305ECASE\`
• **Course Title:** Data Structures & Algorithms - 2
• **Academic Term:** Trimester 3 (Year 1) | **Credits:** 4.0 | **L-T-P-S:** 2-0-2-4 (8 Contact Hours)
• **Prerequisite:** \`ESC25SC1204ECASE\` (DSA-1)

---

#### 📚 Module Breakdown:
1. **Module 1: Advanced Divide-and-Conquer & Linear Sorting:**
   • Merge Sort: Divide, Conquer, Combine; $O(N \\log N)$ guaranteed; count inversions.
   • Quick Sort: Pivot selection, Lomuto vs. Hoare partitioning, randomized pivot to avoid $O(N^2)$ worst-case.
   • Heap Sort: In-place array sorting using Binary Heap in $O(N \\log N)$.
   • Non-comparison linear sorting: Counting Sort ($O(N + K)$), Radix Sort ($O(d \\cdot (N + K))$), Bucket Sort ($O(N)$ average).

2. **Module 2: Trees & Binary Search Trees (BST):**
   • Tree terminologies: height, depth, ancestors, subtree, degree.
   • Traversals: Inorder (sorted for BST), Preorder, Postorder, and Level-Order (BFS).
   • BST Invariant: $\\text{Left} < \\text{Node} < \\text{Right}$.
   • Operations: Search ($O(h)$), Insertion ($O(h)$), Deletion (3 cases: leaf, 1 child, 2 children via in-order successor).
   • Lowest Common Ancestor (LCA) in BST ($O(h)$).

3. **Module 3: Balanced Search Trees (AVL & B-Trees):**
   • Balance Factor (BF): $BF = Height(\\text{Left}) - Height(\\text{Right}) \\in \\{-1, 0, +1\\}$.
   • The 4 AVL Rotations: Single (LL Right Rotation, RR Left Rotation) and Double (LR Left-Right, RL Right-Left).
   • Maximum AVL height: $h < 1.44 \\log_2 N \\implies O(\\log N)$ guaranteed search/insert/delete.
   • Introduction to Red-Black Trees (5 invariants, black height) and B-Trees / B+ Trees for database disk indexing.

4. **Module 4: Priority Queues & Binary Heaps:**
   • Complete Binary Tree representation in array: left child $2i + 1$, right child $2i + 2$, parent $\\lfloor(i-1)/2\\rfloor$.
   • Min-Heap vs Max-Heap property.
   • Operations: \`insert\` with Heapify-Up ($O(\\log N)$), \`extractMin\`/\`extractMax\` with Heapify-Down ($O(\\log N)$).
   • Mathematical proof of Linear-time \`buildHeap\` in $O(N)$ time.

5. **Module 5: Hashing, Hash Tables & Collision Resolution:**
   • Direct Addressing, Hash Functions: Division ($k \\bmod M$), Multiplication, Mid-Square.
   • Collision Resolution:
     - Separate Chaining (Linked Lists / BSTs at buckets).
     - Open Addressing: Linear Probing ($h(k) + i$), Quadratic Probing ($h(k) + i^2$), Double Hashing ($h_1(k) + i \\cdot h_2(k)$).
   • Load Factor $\\alpha = N / M$, threshold dynamic rehashing at $\\alpha > 0.7$.
   • Dynamic disk-based Extendible Hashing (Global vs Local Depth, directory doubling).

6. **Module 6: Graph Algorithms & Traversals:**
   • Representations: Adjacency Matrix ($O(V^2)$) vs Adjacency List ($O(V + E)$).
   • Breadth-First Search (BFS) using Queue; Depth-First Search (DFS) using Stack/Recursion.
   • Connected components, Bipartite Graph checking (2-coloring), Cycle detection in directed (visiting recursion stack) and undirected graphs.
   • Directed Acyclic Graphs (DAGs) & Topological Sorting (Kahn's in-degree algorithm & DFS finish times).

7. **Module 7: Shortest Paths & Minimum Spanning Trees (MST):**
   • Dijkstra's Algorithm: Greedy edge relaxation using Min-Priority Queue in $O((V + E) \\log V)$ for non-negative weights.
   • Bellman-Ford Algorithm: Dynamic programming edge relaxation in $O(V \\cdot E)$ handling negative weights & cycle detection.
   • Prim's Algorithm: Greedy MST growth from a root vertex using priority queue in $O(E \\log V)$.
   • Kruskal's Algorithm: Edge sorting + Disjoint Set Union (DSU) with Path Compression and Union by Rank in $O(E \\log E)$.`
  },

  // ─── 4. DSA-3 (PCC25CS2103ECASE) ─────────────────────────────────────────────
  {
    topic: "KLEF DSA-3 (PCC25CS2103ECASE): Advanced Algorithms & TextHack System",
    keywords: [
      "pcc25cs2103ecase", "dsa 3", "dsa-3", "dsa 3 syllabus", "dsa 3 klef", "klef dsa 3",
      "y25 dsa 3", "advanced algorithms", "texthack", "pcc25cs2103", "kmp", "z-algo",
      "dinic", "blelloch", "miller rabin", "np completeness", "zero utility"
    ],
    summary: "Complete syllabus, modules, and competencies for DSA-3 (PCC25CS2103ECASE) at KLEF: Text Analytics Engine, string matching (KMP, Z-algo, Rabin-Karp), advanced DP, Dinic max-flow, NP-completeness, and parallel Blelloch scan.",
    primaryLang: "Java / C++ / Python",
    placementDemand: "High-Performance Systems Engineering & Tier-1 Product Companies",
    content: `KLEF DSA-3 (PCC25CS2103ECASE) Complete Syllabus & Structure:
• **Course Code:** \`PCC25CS2103ECASE\`
• **Course Title:** Data Structures & Algorithms - 3 (Advanced Algorithms & PBL)
• **Academic Term:** Year 2 / Trimester 4 | **Credits:** 4.0 | **L-T-P-S:** 2-0-2-4 (8 Contact Hours)
• **Core Project Theme:** High-Performance Indian-Language Text Analytics Engine (TextHack / Corpus Query Engine).
• **Prerequisite:** \`ESC25SC1305ECASE\` (DSA-2)

---

#### 📚 The 6 Core Modules:
1. **Module 1: High-Performance Engine Architecture & Zero-Utility Design:**
   • Building a working text-analytics engine querying large Indian-language Wikipedia corpuses.
   • Query-class to algorithm-family mapping:
     - Pattern Search $\\rightarrow$ String Algorithms (KMP / Z-Algo)
     - Fuzzy Matching $\\rightarrow$ Dynamic Programming (Wagner-Fischer)
     - Document Similarity $\\rightarrow$ Suffix Structures (Suffix Array / LCP)
     - Citation Flow $\\rightarrow$ Network Flow (Dinic Max-Flow)
     - Scheduling $\\rightarrow$ NP-Hard Approximations (2-Approx)
     - Primality / Hashing $\\rightarrow$ Randomized Algorithms (Miller-Rabin)
   • **Zero-Utility Library Constraint:** Strict ban on \`java.util.*\` within core engine logic. Students build custom dynamic arrays, lists, queues, and buffers from raw primitives.

2. **Module 2: Advanced String Algorithms & Text Processing:**
   • **Knuth-Morris-Pratt (KMP):** Longest Proper Prefix which is Suffix (LPS/$\\pi$) failure table; $O(N + M)$ linear search skipping redundant comparisons.
   • **Z-Algorithm:** Linear-time computation of $Z$-array ($Z[i]$ = length of longest substring starting at $i$ matching prefix of $S$); maintain $[L, R]$ $Z$-box in $O(N + M)$.
   • **Rabin-Karp Rolling Hash:** Polynomial rolling hash with Horner's method ($O(1)$ window slide); average $O(N + M)$ with modulo hashing to avoid spurious collisions.
   • Suffix Arrays, Suffix Trees, and Longest Common Prefix (LCP) array via Kasai's algorithm.

3. **Module 3: Advanced Dynamic Programming:**
   • **Fuzzy String Matching & Wagner-Fischer:** Levenshtein Edit Distance matrix computing insertion, deletion, and substitution costs in $O(N \\cdot M)$.
   • Longest Common Subsequence (LCS) & Longest Increasing Subsequence (LIS in $O(N \\log N)$ using patience sorting).
   • Matrix Chain Multiplication (MCM) interval DP.
   • Bitmask DP: Traveling Salesperson Problem (TSP) in $O(N^2 2^N)$ vs brute-force $O(N!)$.

4. **Module 4: Network Flow & Matching Algorithms:**
   • Flow networks, capacity constraints, flow conservation, Max-Flow Min-Cut Theorem.
   • Ford-Fulkerson method & Edmonds-Karp ($O(V E^2)$ with BFS).
   • **Dinic's Algorithm:** Level graph construction via BFS + Blocking Flow via DFS with dead-end pruning; runs in $O(V^2 E)$ general, $O(E \\sqrt{V})$ on unit networks!
   • Bipartite Matching: Maximum Cardinality Bipartite Matching via Hopcroft-Karp and reduction to Max Flow.

5. **Module 5: NP-Completeness & Approximation Algorithms:**
   • Complexity classes: P, NP, NP-Hard, NP-Complete; Polynomial-time reductions.
   • Canonical NP-Complete problems: 3-SAT, Vertex Cover, Independent Set, Hamiltonian Cycle, Metric TSP.
   • **Approximation Algorithms:**
     - 2-Approximation for Vertex Cover (Maximal Matching heuristic).
     - 2-Approximation for Metric TSP using MST preorder traversal with triangle inequality.
     - Greedy logarithmic approximation for Set Cover.

6. **Module 6: Randomized & Parallel Algorithmic Paradigms:**
   • Monte Carlo (probabilistic runtime/correctness) vs Las Vegas (always correct, probabilistic runtime).
   • **Miller-Rabin Primality Test:** Deterministic vs randomized witness testing for large cryptographic keys in $O(k \\log^3 N)$.
   • Reservoir Sampling for processing infinite streaming data with uniform $1/N$ probability.
   • **Blelloch Parallel Scan (Prefix Sum):** Work-efficient parallel prefix computation on multi-core/GPU architectures with Up-sweep (reduce) and Down-sweep phases; $O(N)$ work, $O(\\log N)$ depth!`
  },

  // ─── 5. EVALUATION SYSTEM & GRADING ──────────────────────────────────────────
  {
    topic: "KLEF Y25 Academic Evaluation Pattern, Grading & Examination System",
    keywords: [
      "klef evaluation", "klef grading", "klef marks", "in-sem", "semester end exam",
      "see exam", "y25 grading", "cgpa scale", "klef rubrics", "lab continuous evaluation",
      "in-sem exam", "y25btech exam"
    ],
    summary: "The official academic evaluation rubric and examination pattern at KL University (KLEF): 60% In-Semester Continuous Assessment and 40% Semester End Examination (SEE) on a 10-point CGPA scale.",
    primaryLang: "Academic Assessment Policy",
    placementDemand: "Academic Honors & High CGPA Maintenance",
    content: `KLEF Academic Evaluation System & Grading Policy:
1. **Assessment Weightage Distribution:**
   • **In-Semester Continuous Assessment (In-Sem):** **60% Weightage**
     - In-Sem Exam 1 & In-Sem Exam 2 (Theory & Problem Solving).
     - Continuous Lab Evaluation: Weekly lab workbooks, algorithm execution, code quality.
     - Surprise Quizzes, Active Class Engagement, and Skilling Reviews.
     - PBL Project Phase Deliverables & Viva Voce.
   • **Semester End Examination (SEE):** **40% Weightage**
     - Comprehensive University Examination: Theory Paper + Practical Lab Coding Assessment.

2. **10-Point CGPA Grading Scale:**
   • **O (Outstanding):** Grade Point **10.0** (90% - 100%)
   • **A+ (Excellent):** Grade Point **9.0** (80% - 89%)
   • **A (Very Good):** Grade Point **8.0** (70% - 79%)
   • **B+ (Good):** Grade Point **7.0** (60% - 69%)
   • **B (Above Average):** Grade Point **6.0** (50% - 59%)
   • **C (Average):** Grade Point **5.0** (45% - 49%)
   • **P (Pass):** Grade Point **4.0** (40% - 44%)
   • **F (Fail):** Grade Point **0.0** (< 40%)

3. **Project-Based Learning (PBL) Rubrics:**
   • Problem Formulation & Algorithmic Design: 25%
   • Clean Code Implementation & Zero-Utility Compliance: 35%
   • Benchmark Performance Profiling (Time/Space Empirical Data): 20%
   • Technical Presentation, Documentation & Oral Viva: 20%`
  },

  // ─── 6. ZERO-UTILITY LIBRARY CONSTRAINT ───────────────────────────────────────
  {
    topic: "KLEF Zero-Utility Library Constraint (Hand-Crafted Data Structures)",
    keywords: [
      "zero utility", "zero-utility", "no java.util", "hand-built", "hand built",
      "klef constraint", "engine constraint", "primitive array", "custom vector",
      "zero dependency"
    ],
    summary: "KLEF's strict pedagogical constraint forbidding standard library utility packages (such as java.util.*) in core engine assignments to master low-level memory mechanics.",
    primaryLang: "Java / C / C++",
    placementDemand: "Low-Level Systems Architecture & High-Performance Engineering",
    content: `The KLEF Zero-Utility Library Constraint Explained:
1. **The Core Rule:**
   • In core algorithmic modules and systems labs (especially DSA-3 TextHack engine assignments), students are **strictly prohibited** from importing \`java.util.ArrayList\`, \`java.util.LinkedList\`, \`java.util.Stack\`, \`java.util.Queue\`, or \`java.util.HashMap\`.

2. **Why KLEF Enforces This Constraint:**
   • **Deep Architectural Understanding:** Calling \`ArrayList.add()\` hides memory allocation, amortized cost doubling, and pointer arithmetic. Hand-building forces students to write resizing logic.
   • **Cache Locality & Memory Profiling:** Standard wrapper objects (\`Integer\`, \`Double\`) create severe memory fragmentation and cache misses on large Indian-language text corpuses. Contiguous primitive arrays (\`int[]\`, \`char[]\`) run up to **$10\\times$ faster**!
   • **Preparation for Systems & Kernel Programming:** Emulates real-world operating system kernel and game engine environments where C/C++ runtimes run with zero external library dependencies.

3. **How to Comply:**
   • Build dynamic array resizers from raw arrays (\`new int[cap * 2]\`).
   • Implement ring buffers for queues using modulo arithmetic.
   • Implement hash tables using raw arrays of buckets and manual linked nodes.`
  }
];

// ─── Fast Direct Topic Resolver for KLEF Y25 Queries ─────────────────────────
export function findKlefY25DirectResponse(lower) {
  if (!lower) return null;

  // 1. General KLEF / Y25 B.Tech Portal & Overview Queries
  if (
    lower.includes('y25btech') || lower.includes('y25') || lower.includes('klef') ||
    lower.includes('kl university') || lower.includes('kl deemed') || lower.includes('kl deemed to be university')
  ) {
    // Specific DSA 1
    if (lower.includes('dsa 1') || lower.includes('dsa-1') || lower.includes('dsa1') || lower.includes('esc25sc1204') || lower.includes('trimester 2')) {
      return {
        text: `### 🏛️ KLEF Y25 B.Tech: DSA-1 Course (\`ESC25SC1204ECASE\`)
**Official Portal:** [y25btech.klef.in](https://y25btech.klef.in)

**Data Structures & Algorithms - 1** is a foundational 4-credit course taught in **Trimester 2** of Year 1 under the **CASE (Continuous Assessment & Skill Evaluation)** learning framework:

---

#### 📋 Course Snapshot:
* **Course Code:** \`ESC25SC1204ECASE\`
* **Credits:** 4.0 | **Structure:** 2-0-2-4 (8 Contact Hours weekly)
* **Prerequisite:** PSPJ (Problem Solving & Programming in Java) / C Programming

---

#### 📚 The 5 Syllabus Modules:
1. **Module 1 — Asymptotic Complexity & Algorithmic Analysis:**
   * Big-O ($O$), Big-Omega ($\\Omega$), Big-Theta ($\\Theta$) notations, RAM model, space-time trade-offs.
2. **Module 2 — Linear Data Structures & Techniques:**
   * Dynamic arrays, Two Pointers, Sliding Window, Prefix Sums, Dutch National Flag (3-way partitioning).
3. **Module 3 — Searching & Elementary Sorting:**
   * Linear Search, Binary Search (safe midpoint \`low + (high - low) / 2\`, floor/ceil), Bubble Sort, Selection Sort, Insertion Sort, stability analysis.
4. **Module 4 — Linked Lists:**
   * Singly, Doubly, and Circular Linked Lists; in-place reversal; Floyd's Cycle Detection (Tortoise and Hare).
5. **Module 5 — Stacks & Queues:**
   * Stack ADT, Balanced Parentheses, Infix to Postfix (Dijkstra's Shunting-Yard), Postfix evaluation; Circular Queue with modulo arithmetic, Deque.

---
**💡 Suggested Next Questions:**
- 📚 What is the syllabus for KLEF DSA-2 (\`ESC25SC1305ECASE\`)?
- 🚀 Explain the 6 modules of KLEF DSA-3 (\`PCC25CS2103ECASE\`)
- 📝 How are In-Sem and Semester-End exams evaluated at KLEF?`,
        sources: ['KLEF Y25 B.Tech Portal (y25btech.klef.in)', 'Course Specification: ESC25SC1204ECASE']
      };
    }

    // Specific DSA 2
    if (lower.includes('dsa 2') || lower.includes('dsa-2') || lower.includes('dsa2') || lower.includes('esc25sc1305') || lower.includes('trimester 3')) {
      return {
        text: `### 🏛️ KLEF Y25 B.Tech: DSA-2 Course (\`ESC25SC1305ECASE\`)
**Official Portal:** [y25btech.klef.in](https://y25btech.klef.in)

**Data Structures & Algorithms - 2** is a 4-credit course taught in **Trimester 3** of Year 1 focusing on non-linear data structures, balanced trees, heaps, and graph algorithms:

---

#### 📋 Course Snapshot:
* **Course Code:** \`ESC25SC1305ECASE\`
* **Credits:** 4.0 | **Structure:** 2-0-2-4 (8 Contact Hours weekly)
* **Prerequisite:** \`ESC25SC1204ECASE\` (DSA-1)

---

#### 📚 The 7 Syllabus Modules:
1. **Module 1 — Advanced Sorting:**
   * Merge Sort (inversion counting), Quick Sort (Lomuto & Hoare partition, randomized pivot), Heap Sort, Counting Sort, Radix Sort, Bucket Sort.
2. **Module 2 — Trees & Binary Search Trees (BST):**
   * Tree traversals (Inorder, Preorder, Postorder, Level-order), BST operations (insert, search, delete with successor), Lowest Common Ancestor (LCA).
3. **Module 3 — Balanced Search Trees:**
   * AVL Trees (Balance Factor $\\in \\{-1, 0, +1\\}$, LL/RR/LR/RL rotations), Red-Black Trees, B-Trees & B+ Trees for database disk indexing.
4. **Module 4 — Priority Queues & Heaps:**
   * Binary Min/Max Heap array formulas ($2i+1, 2i+2$), Heapify-Up/Down ($O(\\log N)$), Linear-time \`buildHeap\` ($O(N)$ proof).
5. **Module 5 — Hashing & Collision Resolution:**
   * Separate Chaining vs Open Addressing (Linear Probing, Quadratic Probing, Double Hashing), Load Factor $\\alpha$, Dynamic Rehashing, Extendible Hashing.
6. **Module 6 — Graph Foundations & Traversals:**
   * Adjacency Matrix vs List, BFS (Queue), DFS (Stack/Recursion), Connected Components, Bipartite Graph check, Cycle Detection, Topological Sort (Kahn's).
7. **Module 7 — Shortest Paths & Minimum Spanning Trees (MST):**
   * Dijkstra ($O((V+E)\\log V)$), Bellman-Ford ($O(V \\cdot E)$ with negative cycles), Prim's Algorithm, Kruskal's with Disjoint Set Union (DSU).

---
**💡 Suggested Next Questions:**
- 🌲 How do AVL tree rotations work in AlgoFlow?
- 🗺️ Explain Dijkstra's algorithm and edge relaxation
- 🚀 What is in the KLEF DSA-3 (\`PCC25CS2103ECASE\`) curriculum?`,
        sources: ['KLEF Y25 B.Tech Portal (y25btech.klef.in)', 'Course Specification: ESC25SC1305ECASE']
      };
    }

    // Specific DSA 3
    if (lower.includes('dsa 3') || lower.includes('dsa-3') || lower.includes('dsa3') || lower.includes('pcc25cs2103') || lower.includes('advanced algorithms') || lower.includes('texthack')) {
      return {
        text: `### 🏛️ KLEF Y25 B.Tech: DSA-3 (\`PCC25CS2103ECASE\`) — Advanced Algorithms & PBL
**Official Portal:** [y25btech.klef.in](https://y25btech.klef.in)

**Data Structures & Algorithms - 3** is a capstone Project-Based Learning (PBL) course in Year 2 where students build a **High-Performance Indian-Language Text Analytics Engine (TextHack)**:

---

#### 📋 Course Snapshot:
* **Course Code:** \`PCC25CS2103ECASE\`
* **Credits:** 4.0 | **Structure:** 2-0-2-4 (8 Contact Hours weekly)
* **Prerequisite:** \`ESC25SC1305ECASE\` (DSA-2)
* **Core Project:** Text Analytics Engine querying large Wikipedia corpuses with a strict **Zero-Utility Library Constraint** (no \`java.util.*\`).

---

#### 📚 The 6 Core Modules:
1. **Module 1 — Engine Architecture & Zero-Utility Design:**
   * Domain query classification to algorithm families; hand-building primitive dynamic arrays and buffers.
2. **Module 2 — String Algorithms & Text Processing:**
   * Knuth-Morris-Pratt (KMP with LPS table in $O(N+M)$), Z-Algorithm ($Z$-box in $O(N+M)$), Rabin-Karp polynomial rolling hash, Suffix Structures.
3. **Module 3 — Advanced Dynamic Programming:**
   * Wagner-Fischer Edit Distance for fuzzy search, Longest Common Subsequence (LCS), $O(N \\log N)$ LIS, Bitmask DP for TSP ($O(N^2 2^N)$).
4. **Module 4 — Network Flow & Matching:**
   * Max-Flow Min-Cut Theorem, Ford-Fulkerson, Dinic's Algorithm (Level Graph + Blocking Flow in $O(V^2 E)$), Bipartite Matching.
5. **Module 5 — NP-Completeness & Approximation:**
   * P vs NP, NP-Hard, polynomial-time reductions, 2-Approximation for Vertex Cover & Metric TSP.
6. **Module 6 — Randomized & Parallel Paradigms:**
   * Miller-Rabin primality testing, Blelloch Work-Efficient Parallel Prefix Scan (Up-sweep/Down-sweep), Reservoir Sampling.

---
**💡 Suggested Next Questions:**
- 🛡️ Why does KLEF enforce the Zero-Utility Library constraint?
- 💻 Show code for KMP string search from Module 2
- ⚡ How does Dinic's Max-Flow algorithm work?`,
        sources: ['KLEF Y25 B.Tech Portal (y25btech.klef.in)', 'Course Specification: PCC25CS2103ECASE']
      };
    }

    // Evaluation / Grading
    if (lower.includes('eval') || lower.includes('grade') || lower.includes('exam') || lower.includes('marks') || lower.includes('cgpa')) {
      return {
        text: `### 📊 KLEF Y25 B.Tech Academic Evaluation & Grading System
**Official Portal:** [y25btech.klef.in](https://y25btech.klef.in)

KL University evaluates B.Tech courses through a rigorous **Continuous Assessment & Skill Evaluation (CASE)** model:

---

#### 1. Evaluation Breakdown (60% In-Sem + 40% SEE):
* **In-Semester Evaluation (60% Total Weightage):**
  - **In-Sem 1 & In-Sem 2 Exams:** Written and problem-solving evaluations.
  - **Continuous Lab Evaluation:** Weekly lab workbooks, live code execution, code cleanliness.
  - **Project-Based Learning (PBL) Reviews:** Milestone deliverables, design architecture, and viva voce.
  - **Surprise Quizzes & Skilling Assessment:** Regular competency checks.
* **Semester End Examination (SEE) (40% Total Weightage):**
  - Comprehensive University Examination: Theory Paper + Practical Lab Coding Exam.

---

#### 2. 10-Point CGPA Grading Scale:
| Grade | Description | Grade Point | Score Range |
| :---: | :--- | :---: | :---: |
| **O** | Outstanding | **10.0** | 90% – 100% |
| **A+** | Excellent | **9.0** | 80% – 89% |
| **A** | Very Good | **8.0** | 70% – 79% |
| **B+** | Good | **7.0** | 60% – 69% |
| **B** | Above Average | **6.0** | 50% – 59% |
| **C** | Average | **5.0** | 45% – 49% |
| **P** | Pass | **4.0** | 40% – 44% |
| **F** | Fail | **0.0** | < 40% |

---
**💡 Suggested Next Questions:**
- 📚 What are the modules in KLEF DSA-1 (\`ESC25SC1204ECASE\`)?
- 🌲 What are the modules in KLEF DSA-2 (\`ESC25SC1305ECASE\`)?
- 🚀 What is the PBL project in KLEF DSA-3 (\`PCC25CS2103ECASE\`)?`,
        sources: ['KLEF Academic Regulations', 'y25btech.klef.in Evaluation Rubric']
      };
    }

    // Default general portal overview
    return {
      text: `### 🎓 KL Deemed to be University (KLEF) — Y25 B.Tech Academic Portal
**Official Open-Access Curriculum Repository:** [y25btech.klef.in](https://y25btech.klef.in)

Welcome! AlgoFlow Studio is fully grounded with the **KL Deemed to be University (KLEF) Y25 B.Tech Academic Curriculum**. Here is your curriculum map:

---

#### 🏛️ Core DSA Course Progression:
1. **DSA-1 (\`ESC25SC1204ECASE\`):**
   * *Term:* Trimester 2 (Year 1) | 4 Credits (2-0-2-4, 8 Contact Hours)
   * *Covers:* Complexity Analysis, Arrays, Strings, Two Pointers, Sliding Window, Prefix Sums, Linear & Binary Search, Basic Sorts, Linked Lists, Stacks, Circular Queues.
2. **DSA-2 (\`ESC25SC1305ECASE\`):**
   * *Term:* Trimester 3 (Year 1) | 4 Credits (2-0-2-4, 8 Contact Hours)
   * *Covers:* Advanced Sorts (Merge, Quick, Heap, Radix), Trees, BST, AVL Trees (Rotations), Binary Heaps, Hashing (Chaining & Probing), Graphs (BFS, DFS), Dijkstra, Bellman-Ford, Prim's & Kruskal's MST.
3. **DSA-3 (\`PCC25CS2103ECASE\`):**
   * *Term:* Year 2 (Trimester 4) | 4 Credits (2-0-2-4, 8 Contact Hours)
   * *Covers:* Text Analytics Engine (TextHack), KMP, Z-Algorithm, Rabin-Karp, Suffix Arrays, Wagner-Fischer Edit Distance, Dinic's Max Flow, NP-Completeness, Blelloch Parallel Scan, Zero-Utility Library Constraint.

---

#### 🌟 Key Academic Features:
* **Pedagogy:** Project-Based Learning (PBL) with CASE continuous assessment.
* **Evaluation:** 60% In-Semester (Labs, Workbooks, In-Sem Exams) + 40% Semester End Exam (SEE).
* **Grading:** Standard 10-point CGPA scale (O: 10, A+: 9, A: 8, B+: 7, B: 6, C: 5, P: 4, F: 0).

---
**💡 Suggested Next Questions:**
- 📘 What is the detailed syllabus for DSA-1 (\`ESC25SC1204ECASE\`)?
- 📗 What is the detailed syllabus for DSA-2 (\`ESC25SC1305ECASE\`)?
- 📕 Tell me about the TextHack PBL Engine in DSA-3 (\`PCC25CS2103ECASE\`)`,
      sources: ['KLEF Y25 B.Tech Curriculum Portal (y25btech.klef.in)', 'Academic Handbooks']
    };
  }

  // 2. Direct Course Code Matches (even without the word KLEF or Y25)
  if (lower.includes('esc25sc1204') || (lower.includes('esc') && lower.includes('1204'))) {
    return findKlefY25DirectResponse('klef dsa 1');
  }
  if (lower.includes('esc25sc1305') || (lower.includes('esc') && lower.includes('1305'))) {
    return findKlefY25DirectResponse('klef dsa 2');
  }
  if (lower.includes('pcc25cs2103') || (lower.includes('pcc') && lower.includes('2103'))) {
    return findKlefY25DirectResponse('klef dsa 3');
  }

  // 3. Direct Zero-Utility Constraint Queries
  if (lower.includes('zero utility') || lower.includes('zero-utility') || (lower.includes('constraint') && lower.includes('java.util'))) {
    return {
      text: `### 🛡️ KLEF Zero-Utility Library Constraint Explained
**Academic Context:** KLEF Y25 B.Tech Advanced Systems & PBL Labs (\`PCC25CS2103ECASE\`)

At KL University, students are **strictly forbidden from importing \`java.util.*\`** (such as \`ArrayList\`, \`LinkedList\`, \`Stack\`, \`Queue\`, \`HashMap\`) in core algorithmic engine modules.

---

#### 🎯 Why This Rule Exists:
1. **Mastering Memory Mechanics:**
   * High-level collections hide memory doubling, pointer overhead, and heap allocations. Writing dynamic array growth (\`new int[cap * 2]\`) cements amortized $O(1)$ intuition.
2. **Extreme Cache Locality:**
   * \`java.util.ArrayList<Integer>\` creates millions of boxed reference pointers, causing severe CPU cache misses. Hand-built contiguous primitive arrays (\`int[]\`, \`char[]\`) run up to **$10\\times$ faster** when querying massive Wikipedia corpuses!
3. **Industrial Kernel & Embedded Readiness:**
   * Linux kernel drivers, game engines (Unreal Engine), and low-latency trading engines operate in environments where standard libraries are banned for performance and predictability.

---
**💡 Suggested Next Questions:**
- 💻 Show how to build a zero-utility dynamic vector in Java
- 🚀 Tell me about the KLEF DSA-3 TextHack engine
- 📚 How are lab workbooks evaluated at KLEF?`,
      sources: ['KLEF Systems Lab Guidelines', 'PCC25CS2103ECASE Engine Rules']
    };
  }

  return null;
}
