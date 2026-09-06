import React, { useState, useEffect } from 'react';

// Comprehensive DSA Question Pool across all core algorithmic disciplines
const ALL_DSA_QUIZ_QUESTIONS = [
  // ── 1. COMPLEXITY & BIG-O ───────────────────────────────────────────────
  {
    id: 'comp_1',
    categoryKey: 'complexity',
    category: 'Complexity & Big-O',
    difficulty: 'Easy',
    question: 'How many comparisons does Binary Search need to find a target in a sorted array of 1,000,000 items?',
    options: ['1,000,000 steps', '500,000 steps', 'About 20 steps', '1 step'],
    correct: 2,
    explanation: 'Binary search runs in O(log₂ N). log₂(1,000,000) ≈ 19.93 ≈ 20 comparisons because the search interval is halved on each step.'
  },
  {
    id: 'comp_2',
    categoryKey: 'complexity',
    category: 'Complexity & Big-O',
    difficulty: 'Medium',
    question: 'What is the time complexity of two nested loops where the outer loop runs N times and the inner loop doubles (j = 1; j < N; j *= 2)?',
    options: ['O(N²)', 'O(N log N)', 'O(N)', 'O(log N)'],
    correct: 1,
    explanation: 'The outer loop runs N times. The inner loop executes log₂ N times because j doubles on every iteration. Total time = O(N * log N).'
  },
  {
    id: 'comp_3',
    categoryKey: 'complexity',
    category: 'Complexity & Big-O',
    difficulty: 'Easy',
    question: 'What is the amortized time complexity of appending an element to a dynamically resizing array (such as C++ std::vector or Java ArrayList)?',
    options: ['O(1) Amortized', 'O(N) Always', 'O(log N)', 'O(N²)'],
    correct: 0,
    explanation: 'Although doubling the capacity takes O(N), it happens rarely. Over a sequence of N insertions, total resizing work is O(N), giving O(1) amortized cost per insertion.'
  },
  {
    id: 'comp_4',
    categoryKey: 'complexity',
    category: 'Complexity & Big-O',
    difficulty: 'Medium',
    question: 'What is the space complexity of standard Depth-First Search (DFS) recursion on a tree with maximum depth H?',
    options: ['O(1)', 'O(H)', 'O(N²)', 'O(2^H)'],
    correct: 1,
    explanation: 'The recursive call stack holds frames up to the maximum depth of the tree from root to leaf, requiring O(H) space (which is O(log N) for balanced trees and O(N) for degenerate trees).'
  },
  {
    id: 'comp_5',
    categoryKey: 'complexity',
    category: 'Complexity & Big-O',
    difficulty: 'Hard',
    question: 'What is the tight Big-O time complexity of the recurrence relation T(N) = 2T(N/2) + O(N) according to Master Theorem?',
    options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
    correct: 1,
    explanation: 'By Master Theorem Case 2: a = 2, b = 2, f(N) = O(N). Since N^(log_b a) = N^1 = N = f(N), the solution is T(N) = O(N log N), which models Merge Sort.'
  },

  // ── 2. STACKS & QUEUES ──────────────────────────────────────────────────
  {
    id: 'stk_1',
    categoryKey: 'stacks_queues',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    question: 'Which Data Structure is best suited for implementing browser "Back" navigation and text editor Ctrl+Z Undo?',
    options: ['Queue (FIFO)', 'Stack (LIFO)', 'Heap', 'Graph'],
    correct: 1,
    explanation: 'A Stack follows Last-In, First-Out (LIFO), which precisely matches undoing actions in reverse order of occurrence.'
  },
  {
    id: 'stk_2',
    categoryKey: 'stacks_queues',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    question: 'What data structure is optimal for solving the "Next Greater Element" problem in O(N) linear time?',
    options: ['Monotonic Stack', 'Binary Search Tree', 'Min-Heap', 'Queue'],
    correct: 0,
    explanation: 'A Monotonic Stack maintains elements in monotonically decreasing or increasing order, allowing each element to be pushed and popped at most once for O(N) total time.'
  },
  {
    id: 'stk_3',
    categoryKey: 'stacks_queues',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    question: 'Breadth-First Search (BFS) on graphs and trees uses which data structure to manage its frontier nodes?',
    options: ['Stack', 'Queue (FIFO)', 'Max-Heap', 'Disjoint Set'],
    correct: 1,
    explanation: 'BFS explores neighbor nodes level-by-level, which requires First-In, First-Out (FIFO) ordering provided by a Queue.'
  },
  {
    id: 'stk_4',
    categoryKey: 'stacks_queues',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    question: 'What is the primary advantage of a Circular Queue over a simple linear array queue?',
    options: ['Faster O(1) sorting', 'Reuses empty spaces created by dequeues without shifting elements', 'Stores infinite elements', 'Uses less CPU cache'],
    correct: 1,
    explanation: 'In a linear array queue, dequeuing leaves unused front slots. A circular queue wraps around using modulo arithmetic (rear = (rear + 1) % size) to prevent memory waste.'
  },

  // ── 3. HEAPS & HASHING ──────────────────────────────────────────────────
  {
    id: 'hash_1',
    categoryKey: 'heaps_hash',
    category: 'Heaps & Hashing',
    difficulty: 'Easy',
    question: 'Which Data Structure provides average O(1) time complexity for insert, delete, and key lookup?',
    options: ['Hash Table / Map', 'Singly Linked List', 'Binary Search Tree', 'Sorted Array'],
    correct: 0,
    explanation: 'Hash Tables use a hash function to map keys directly into bucket array indices, providing average O(1) constant time operations.'
  },
  {
    id: 'hash_2',
    categoryKey: 'heaps_hash',
    category: 'Heaps & Hashing',
    difficulty: 'Medium',
    question: 'What is the worst-case lookup time in a Hash Table when all keys collide into the exact same bucket?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correct: 2,
    explanation: 'If all keys hash to the same bucket in separate chaining, the bucket degrades into a linked list of length N, requiring O(N) linear search.'
  },
  {
    id: 'heap_1',
    categoryKey: 'heaps_hash',
    category: 'Heaps & Hashing',
    difficulty: 'Medium',
    question: 'What is the time complexity to find the Top K largest elements in a stream of N numbers using a Min-Heap of size K?',
    options: ['O(N log N)', 'O(N log K)', 'O(K log N)', 'O(N * K)'],
    correct: 1,
    explanation: 'Maintaining a Min-Heap of size K requires O(log K) for each of the N incoming numbers. Total time is O(N log K), which is much faster than sorting the whole array.'
  },
  {
    id: 'heap_2',
    categoryKey: 'heaps_hash',
    category: 'Heaps & Hashing',
    difficulty: 'Hard',
    question: 'What is the time complexity to construct a binary heap from an unsorted array of N elements using the bottom-up heapify approach?',
    options: ['O(N log N)', 'O(N)', 'O(log N)', 'O(N²)'],
    correct: 1,
    explanation: 'Bottom-up heapify takes O(N) because the sum of heights across all nodes converges to ∑ (h / 2^h) ≤ 2, resulting in linear O(N) time.'
  },

  // ── 4. TREES & BST ──────────────────────────────────────────────────────
  {
    id: 'tree_1',
    categoryKey: 'trees',
    category: 'Trees & BST',
    difficulty: 'Easy',
    question: 'An In-Order Traversal (Left -> Root -> Right) of a valid Binary Search Tree (BST) yields elements in:',
    options: ['Descending order', 'Ascending sorted order', 'Random order', 'Reverse level order'],
    correct: 1,
    explanation: 'In a BST, all left subtree values are smaller than the root, and all right subtree values are larger. In-Order traversal therefore visits nodes in strictly ascending sorted order.'
  },
  {
    id: 'tree_2',
    categoryKey: 'trees',
    category: 'Trees & BST',
    difficulty: 'Medium',
    question: 'What is the worst-case search time complexity in an un-balanced degenerate Binary Search Tree (skewed tree)?',
    options: ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
    correct: 2,
    explanation: 'If items are inserted in sorted order into an un-balanced BST, it degenerates into a linear linked list of height N, causing search to take O(N) linear time.'
  },
  {
    id: 'tree_3',
    categoryKey: 'trees',
    category: 'Trees & BST',
    difficulty: 'Medium',
    question: 'In an AVL Self-Balancing Tree, what is the valid range of balance factors (Height(Left) - Height(Right)) for every node?',
    options: ['{-1, 0, 1}', '{-2, 0, 2}', '{0, 1}', 'Any integer'],
    correct: 0,
    explanation: 'AVL trees strictly maintain the balance factor of every node within {-1, 0, 1}. If it becomes -2 or +2, rotations (LL, RR, LR, RL) are triggered.'
  },
  {
    id: 'tree_4',
    categoryKey: 'trees',
    category: 'Trees & BST',
    difficulty: 'Hard',
    question: 'In a BST, if node p has value 4 and node q has value 9, and the current root value is 7, where is their Lowest Common Ancestor (LCA)?',
    options: ['In the left subtree', 'In the right subtree', 'The current root (7) itself', 'Node p'],
    correct: 2,
    explanation: 'Because p (4) < root (7) and q (9) > root (7), the two targets split into different subtrees at node 7. Thus, node 7 is their Lowest Common Ancestor.'
  },

  // ── 5. GRAPHS & PATHS ───────────────────────────────────────────────────
  {
    id: 'graph_1',
    categoryKey: 'graphs',
    category: 'Graphs & Paths',
    difficulty: 'Medium',
    question: 'Which algorithm finds the single-source shortest path in a weighted graph with non-negative edge weights in O((V + E) log V)?',
    options: ['Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Floyd-Warshall', 'Depth-First Search'],
    correct: 0,
    explanation: 'Dijkstra’s algorithm uses a priority queue (Min-Heap) to greedily relax shortest known distances, running in O((V + E) log V) on graphs without negative weights.'
  },
  {
    id: 'graph_2',
    categoryKey: 'graphs',
    category: 'Graphs & Paths',
    difficulty: 'Medium',
    question: 'Which algorithm finds the shortest path in an UNWEIGHTED graph in O(V + E) linear time?',
    options: ['Breadth-First Search (BFS)', 'Dijkstra’s Algorithm', 'Bellman-Ford', 'Prim’s Algorithm'],
    correct: 0,
    explanation: 'In unweighted graphs where all edge costs are equal to 1, standard BFS visits nodes in order of shortest step distance, finding shortest paths in O(V + E) time.'
  },
  {
    id: 'graph_3',
    categoryKey: 'graphs',
    category: 'Graphs & Paths',
    difficulty: 'Medium',
    question: 'How do package managers (npm, pip, cargo) resolve dependency build order without circular conflicts?',
    options: ['Topological Sorting on a DAG', 'Binary Search', 'Dijkstra’s Algorithm', 'In-Order Traversal'],
    correct: 0,
    explanation: 'Topological Sort (Kahn’s algorithm or DFS post-order) produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) respecting all prerequisite dependencies.'
  },
  {
    id: 'graph_4',
    categoryKey: 'graphs',
    category: 'Graphs & Paths',
    difficulty: 'Hard',
    question: 'Which algorithm handles shortest paths with negative edge weights and detects negative weight cycles?',
    options: ['Bellman-Ford Algorithm', 'Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'A* Search'],
    correct: 0,
    explanation: 'Bellman-Ford relaxes all edges V-1 times. A V-th relaxation will only succeed if a negative weight cycle exists, allowing it to detect negative cycles.'
  },
  {
    id: 'graph_5',
    categoryKey: 'graphs',
    category: 'Graphs & Paths',
    difficulty: 'Medium',
    question: 'Which data structure is used in Kruskal’s Algorithm to prevent cycles while building a Minimum Spanning Tree (MST)?',
    options: ['Disjoint Set Union (DSU / Union-Find)', 'Stack', 'Fenwick Tree', 'Suffix Tree'],
    correct: 0,
    explanation: 'Union-Find (DSU) with path compression and union by rank checks whether two vertices are already connected in near-O(1) α(N) time, preventing cycles in Kruskal’s MST.'
  },

  // ── 6. DYNAMIC PROGRAMMING ──────────────────────────────────────────────
  {
    id: 'dp_1',
    categoryKey: 'dp',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    question: 'What are the two key properties required for a problem to be solvable via Dynamic Programming (DP)?',
    options: ['Optimal Substructure & Overlapping Subproblems', 'Greedy Choice & Sorted Input', 'Divide and Conquer & Graph Representation', 'Constant Time & Space'],
    correct: 0,
    explanation: 'DP applies when a problem can be broken down into overlapping subproblems whose optimal solutions combine into the global optimal solution (Optimal Substructure).'
  },
  {
    id: 'dp_2',
    categoryKey: 'dp',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    question: 'What is the time complexity of computing Fibonacci(N) using naive recursion vs Top-Down Memoized DP?',
    options: ['Naive: O(2^N), DP: O(N)', 'Naive: O(N), DP: O(1)', 'Naive: O(N²), DP: O(N log N)', 'Both are O(N)'],
    correct: 0,
    explanation: 'Naive recursion recomputes states repeatedly forming a binary tree of calls (O(2^N)). Memoization caches results so each subproblem F(k) is solved only once, giving O(N) time.'
  },
  {
    id: 'dp_3',
    categoryKey: 'dp',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    question: 'What is the time complexity to find the Longest Common Subsequence (LCS) of two strings of lengths M and N using standard 2D DP?',
    options: ['O(M * N)', 'O(M + N)', 'O(2^(M+N))', 'O(max(M, N))'],
    correct: 0,
    explanation: 'The DP table has dimensions (M + 1) × (N + 1). Each cell dp[i][j] is computed in O(1) time based on character equality, yielding O(M * N) total time.'
  },
  {
    id: 'dp_4',
    categoryKey: 'dp',
    category: 'Dynamic Programming',
    difficulty: 'Hard',
    question: 'In the 0/1 Knapsack problem with N items and maximum weight capacity W, what is the time complexity of the standard DP approach?',
    options: ['O(N * W) Pseudo-polynomial', 'O(2^N) Strict', 'O(N log W)', 'O(W²)'],
    correct: 0,
    explanation: '0/1 Knapsack DP fills an N × W table where dp[i][w] represents maximum value with i items and weight w. Time complexity is O(N * W) (pseudo-polynomial in weight capacity).'
  },

  // ── 7. ARRAYS, STRINGS & ADVANCED TREES ──────────────────────────────────
  {
    id: 'list_1',
    categoryKey: 'arrays_lists',
    category: 'Arrays & Linked Lists',
    difficulty: 'Medium',
    question: 'How can you detect a cycle in a Singly Linked List in O(N) time using O(1) auxiliary space?',
    options: ['Floyd’s Cycle Finding (Fast & Slow Pointers)', 'Hash Set of visited nodes', 'Sorting node values', 'Recursion without base case'],
    correct: 0,
    explanation: 'Floyd’s Tortoise and Hare algorithm uses slow pointer (1 step) and fast pointer (2 steps). If a cycle exists, they are guaranteed to meet inside the cycle in O(N) time with O(1) space.'
  },
  {
    id: 'list_2',
    categoryKey: 'arrays_lists',
    category: 'Arrays & Linked Lists',
    difficulty: 'Easy',
    question: 'What is the time complexity to find the middle node of a linked list in a single pass?',
    options: ['O(N)', 'O(N²)', 'O(1)', 'O(log N)'],
    correct: 0,
    explanation: 'By moving a slow pointer 1 step and a fast pointer 2 steps per iteration, when the fast pointer reaches the end, the slow pointer is precisely at the middle in O(N) single pass.'
  },
  {
    id: 'two_ptr_1',
    categoryKey: 'arrays_lists',
    category: 'Arrays & Strings',
    difficulty: 'Easy',
    question: 'How can you find if two numbers in a SORTED array sum to a target value T in O(N) time and O(1) space?',
    options: ['Two Pointers (Left at start, Right at end)', 'Nested double loop', 'Binary search every pair', 'Hash table with O(N) space'],
    correct: 0,
    explanation: 'With a sorted array, placing left=0 and right=N-1 allows moving left++ if sum < T or right-- if sum > T, converging in O(N) single pass and O(1) memory.'
  },
  {
    id: 'window_1',
    categoryKey: 'arrays_lists',
    category: 'Arrays & Strings',
    difficulty: 'Medium',
    question: 'What algorithmic pattern is optimal for finding the maximum sum subarray of fixed size K in O(N) time?',
    options: ['Sliding Window', 'Dynamic Programming', 'Divide & Conquer', 'Backtracking'],
    correct: 0,
    explanation: 'The Sliding Window technique adds the new incoming element and subtracts the outgoing element in O(1) per step, traversing the array of size N in O(N) time.'
  },
  {
    id: 'bit_1',
    categoryKey: 'arrays_lists',
    category: 'Fenwick & Advanced Trees',
    difficulty: 'Medium',
    question: 'What bitwise expression isolates the Least Significant Set Bit (LSB) of an integer x in a Fenwick Tree (Binary Indexed Tree)?',
    options: ['x & (-x)', 'x | (-x)', 'x ^ (-x)', 'x >> 1'],
    correct: 0,
    explanation: 'Using two’s complement representation, -x equals (~x + 1). The bitwise AND (x & -x) clears all bits except the lowest set bit 1.'
  },
  {
    id: 'bit_2',
    categoryKey: 'arrays_lists',
    category: 'Fenwick & Advanced Trees',
    difficulty: 'Medium',
    question: 'What is the time complexity for a point update and a prefix sum query in a Fenwick Tree (BIT) of size N?',
    options: ['Update: O(log N), Query: O(log N)', 'Update: O(1), Query: O(N)', 'Update: O(N), Query: O(1)', 'Update: O(log N), Query: O(1)'],
    correct: 0,
    explanation: 'A Fenwick Tree updates only log₂ N parent responsible nodes (i += i & -i) and queries by stripping set bits (i -= i & -i), giving O(log N) for both operations.'
  },

  // ── 8. SORTING ALGORITHMS ───────────────────────────────────────────────
  {
    id: 'sort_1',
    categoryKey: 'complexity',
    category: 'Sorting & Searching',
    difficulty: 'Medium',
    question: 'What is the worst-case time complexity of QuickSort when the pivot chosen is always the maximum or minimum element in an already sorted array?',
    options: ['O(N²)', 'O(N log N)', 'O(N)', 'O(log N)'],
    correct: 0,
    explanation: 'If the pivot divides the array into subproblems of size 0 and N-1 on every partition, the recursion depth is N, causing worst-case O(N²) quadratic time.'
  },
  {
    id: 'sort_2',
    categoryKey: 'complexity',
    category: 'Sorting & Searching',
    difficulty: 'Easy',
    question: 'Which of the following sorting algorithms guarantees O(N log N) worst-case time and is also stable?',
    options: ['Merge Sort', 'QuickSort', 'Heap Sort', 'Selection Sort'],
    correct: 0,
    explanation: 'Merge Sort always divides arrays evenly into halves and merges in O(N), guaranteeing O(N log N) in all cases (worst, avg, best) while maintaining relative order of equal keys (stability).'
  },
  {
    id: 'sort_3',
    categoryKey: 'complexity',
    category: 'Sorting & Searching',
    difficulty: 'Medium',
    question: 'Counting Sort can sort N integers in the range [0..K] in what time complexity?',
    options: ['O(N + K)', 'O(N log N)', 'O(N * K)', 'O(K log N)'],
    correct: 0,
    explanation: 'Counting Sort uses an auxiliary frequency array of size K, taking O(N) to count occurrences and O(K) to compute prefix counts for an optimal non-comparison time of O(N + K).'
  }
];

export default function WhyDSAMattersGuide() {
  const [dataSize, setDataSize] = useState(10000); // Default N = 10,000
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'realworld', 'quiz'
  
  // Interactive Randomized Quiz State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quizQuestionCount, setQuizQuestionCount] = useState(5);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState({ answered: 0, correct: 0 });
  const [quizRound, setQuizRound] = useState(1);

  // Helper to format large step counts cleanly
  const formatSteps = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + ' Trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + ' Billion';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + ' Million';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + ' K';
    return num.toLocaleString();
  };

  // Calculations for step counts based on N
  const n = Number(dataSize);
  const o1Steps = 1;
  const oLogNSteps = Math.ceil(Math.log2(n || 1));
  const oNSteps = n;
  const oNLogNSteps = Math.ceil(n * Math.log2(n || 1));
  const oN2Steps = n * n;

  // Real world case studies
  const caseStudies = [
    {
      icon: '🗺️',
      title: 'Google Maps & Uber',
      tech: 'Graphs & Dijkstra / A* Algorithm',
      desc: 'With over 10 million road segments, checking every path randomly would take days. Graph algorithms compute the optimal route in under 50 milliseconds!',
      impact: 'Saves millions of gallons of fuel and prevents traffic bottlenecks.'
    },
    {
      icon: '🔍',
      title: 'Google Search Engine',
      tech: 'Inverted Index & PageRank',
      desc: 'Google indexes over 100 billion web pages. Using Hash Maps and Inverted Indexing, search queries return relevant links in 0.2 seconds.',
      impact: 'Instantly serves answer queries to 5+ billion users worldwide.'
    },
    {
      icon: '💬',
      title: 'WhatsApp & Messaging',
      tech: 'Queues & Stacks',
      desc: 'Messages sent while offline are stored in Queues (First-In, First-Out). App navigation backstacks and Ctrl+Z undo functions use Stacks (Last-In, First-Out).',
      impact: 'Ensures zero lost messages and predictable user interface state.'
    },
    {
      icon: '🎬',
      title: 'Netflix & Spotify',
      tech: 'Heaps & Balanced Trees',
      desc: 'Top-10 trending charts and personalized recommendation queues process user ratings instantly using Min/Max Heaps and Binary Search Trees.',
      impact: 'Streams personalized feeds without buffer lag.'
    }
  ];

  // Helper to generate a new randomized set of questions
  const generateNewQuizSet = (category = selectedCategory, count = quizQuestionCount) => {
    let pool = ALL_DSA_QUIZ_QUESTIONS;
    if (category !== 'all') {
      pool = pool.filter(q => q.categoryKey === category);
    }
    // Deep shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(count, shuffled.length));
    setActiveQuestions(chosen);
    setUserAnswers({});
    setQuizScore({ answered: 0, correct: 0 });
    setQuizRound(prev => prev + 1);
  };

  // Initialize random questions on mount
  useEffect(() => {
    generateNewQuizSet('all', 5);
  }, []);

  const handleCategoryChange = (catKey) => {
    setSelectedCategory(catKey);
    generateNewQuizSet(catKey, quizQuestionCount);
  };

  const handleCountChange = (count) => {
    setQuizQuestionCount(count);
    generateNewQuizSet(selectedCategory, count);
  };

  const handleQuizAnswer = (qId, optionIdx) => {
    if (userAnswers[qId] !== undefined) return;
    const targetQ = activeQuestions.find(q => q.id === qId);
    if (!targetQ) return;
    const isCorrect = optionIdx === targetQ.correct;
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setQuizScore(prev => ({
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));
  };

  const isQuizFinished = activeQuestions.length > 0 && quizScore.answered === activeQuestions.length;
  const scorePercent = activeQuestions.length > 0 ? Math.round((quizScore.correct / activeQuestions.length) * 100) : 0;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '16px',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
              Module 7: "Why Do Data Structures & Algorithms (DSA) Matter?"
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
              Learn why choosing the right data structures and algorithms is the difference between a lightning-fast app and a frozen system!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'simulator', icon: '📊', label: '1. Speed & Scalability Simulator' },
          { id: 'realworld', icon: '🌍', label: '2. Real-World Tech Impact' },
          { id: 'quiz', icon: '🎯', label: '3. Interactive DSA Quiz (Randomized)' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: activeTab === t.id ? '2px solid #38bdf8' : '1px solid #334155',
              background: activeTab === t.id ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
              color: activeTab === t.id ? '#38bdf8' : '#cbd5e1',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: COMPLEXITY SIMULATOR */}
      {activeTab === 'simulator' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '14px', padding: '20px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Visualizing Algorithm Scalability (Big-O Notation)
          </h3>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            Adjust the dataset size <strong>N</strong> below to see how different algorithms perform as data grows!
          </p>

          {/* Slider Input */}
          <div style={{
            background: '#0f172a',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #334155',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '14px' }}>
                Dataset Size (N): <span style={{ color: '#fbbf24', fontSize: '18px' }}>{n.toLocaleString()} items</span>
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[100, 10000, 100000, 1000000].map(val => (
                  <button
                    key={val}
                    onClick={() => setDataSize(val)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #334155',
                      background: n === val ? '#0284c7' : '#1e293b',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {val >= 1000000 ? '1M' : val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min="100"
              max="1000000"
              step="5000"
              value={dataSize}
              onChange={(e) => setDataSize(e.target.value)}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

          {/* Bars Comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* O(1) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#34d399' }}>⚡ O(1) - Constant Time (Hash Table Lookup)</span>
                <span style={{ fontWeight: 'bold', color: '#34d399' }}>{formatSteps(o1Steps)} step</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '1%', background: '#34d399', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟢 Instantaneous lookup regardless of dataset size!
              </span>
            </div>

            {/* O(log N) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🚀 O(log N) - Logarithmic (Binary Search)</span>
                <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{formatSteps(oLogNSteps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (oLogNSteps / 30) * 100)}%`, background: '#38bdf8', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟢 Blazing fast — halves remaining dataset on every step!
              </span>
            </div>

            {/* O(N) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>🏃 O(N) - Linear Time (Unsorted Search)</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{formatSteps(oNSteps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (n / 1000000) * 100)}%`, background: '#fbbf24', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟡 Acceptable for small N, but degrades linearly as data grows.
              </span>
            </div>

            {/* O(N log N) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>📊 O(N log N) - Log-Linear (Merge / Quick Sort)</span>
                <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>{formatSteps(oNLogNSteps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (oNLogNSteps / 20000000) * 100)}%`, background: '#a78bfa', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟣 Standard algorithm complexity for sorting large datasets efficiently.
              </span>
            </div>

            {/* O(N^2) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #f87171' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#f87171' }}>🐢 O(N²) - Quadratic (Nested Loops / Bubble Sort)</span>
                <span style={{ fontWeight: 'bold', color: '#f87171' }}>{formatSteps(oN2Steps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '100%', background: '#ef4444', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                Status: 🔴 DANGER — Unusable for large N! Would freeze or crash your application!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-WORLD IMPACT */}
      {activeTab === 'realworld' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid #334155'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{cs.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>{cs.title}</h4>
                  <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>{cs.tech}</span>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                {cs.desc}
              </p>
              <div style={{
                background: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                color: '#34d399',
                fontWeight: '600'
              }}>
                💡 Impact: {cs.impact}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DYNAMIC RANDOMIZED INTERACTIVE QUIZ */}
      {activeTab === 'quiz' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '14px', padding: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Quiz Control Bar & Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>
                  🎯 Test Your DSA Knowledge
                </h3>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Round #{quizRound} (Dynamic Randomizer)
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
                Questions change dynamically every time! Filter by topic or roll a brand new random challenge set.
              </p>
            </div>

            {/* Top Action & Score Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => generateNewQuizSet(selectedCategory, quizQuestionCount)}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#fff',
                  border: '1px solid #38bdf8',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
                  transition: 'all 0.2s'
                }}
                title="Roll a fresh randomized set of questions from the question bank"
              >
                <span>🎲</span> Roll New Random Quiz
              </button>

              <div style={{
                background: '#0f172a',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Live Score:</span>
                <strong style={{ fontSize: '14px', color: quizScore.correct === quizScore.answered && quizScore.answered > 0 ? '#34d399' : '#fbbf24' }}>
                  {quizScore.correct} / {activeQuestions.length}
                </strong>
                {quizScore.answered > 0 && (
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>({scorePercent}%)</span>
                )}
              </div>
            </div>
          </div>

          {/* Topic / Category Filter Selector */}
          <div style={{
            background: '#0f172a',
            padding: '12px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📂 Filter by Topic ({ALL_DSA_QUIZ_QUESTIONS.length} Total Questions Available):
              </span>
              
              {/* Question Count Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Quiz Size:</span>
                {[5, 8, 10].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => handleCountChange(cnt)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '5px',
                      border: quizQuestionCount === cnt ? '1px solid #38bdf8' : '1px solid #334155',
                      background: quizQuestionCount === cnt ? '#0284c7' : '#1e293b',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: '🌟 All Topics (Mixed Challenge)' },
                { key: 'complexity', label: '⚡ Big-O & Complexity' },
                { key: 'trees', label: '🌲 Trees & BST' },
                { key: 'graphs', label: '🕸️ Graphs & Shortest Paths' },
                { key: 'dp', label: '🧩 Dynamic Programming' },
                { key: 'stacks_queues', label: '🥞 Stacks & Queues' },
                { key: 'heaps_hash', label: '🗄️ Heaps & Hashing' },
                { key: 'arrays_lists', label: '📊 Arrays, Lists & BIT' }
              ].map(cat => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => handleCategoryChange(cat.key)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: isActive ? '1px solid #38bdf8' : '1px solid #334155',
                      background: isActive ? 'rgba(56, 189, 248, 0.2)' : '#1e293b',
                      color: isActive ? '#38bdf8' : '#94a3b8',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Completion Celebration Card */}
          {isQuizFinished && (
            <div style={{
              background: scorePercent >= 80 ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)' : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
              padding: '16px 20px',
              borderRadius: '12px',
              border: scorePercent >= 80 ? '1.5px solid #10b981' : '1.5px solid #f59e0b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 0 20px rgba(0,0,0,0.4)'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', color: scorePercent >= 80 ? '#34d399' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{scorePercent === 100 ? '🏆' : scorePercent >= 80 ? '🌟' : scorePercent >= 60 ? '💪' : '📚'}</span>
                  {scorePercent === 100
                    ? 'Perfect Score! DSA Master!'
                    : scorePercent >= 80
                    ? 'Excellent Work! Strong Problem Solving Fundamentals!'
                    : scorePercent >= 60
                    ? 'Good Effort! Keep Reviewing the Explanations!'
                    : 'Practice Makes Perfect! Roll a New Set and Try Again!'}
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#cbd5e1' }}>
                  You scored <strong>{quizScore.correct} out of {activeQuestions.length}</strong> ({scorePercent}% Accuracy).
                </p>
              </div>

              <button
                type="button"
                onClick={() => generateNewQuizSet(selectedCategory, quizQuestionCount)}
                style={{
                  background: '#10b981',
                  color: '#0f172a',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
                }}
              >
                <span>🔄</span> Play Next Round (New Questions)
              </button>
            </div>
          )}

          {/* Active Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeQuestions.map((q, idx) => {
              const selected = userAnswers[q.id];
              const isAnswered = selected !== undefined;
              const diffColor = q.difficulty === 'Easy' ? '#34d399' : q.difficulty === 'Medium' ? '#fbbf24' : '#f87171';

              return (
                <div key={q.id} style={{
                  background: '#0f172a',
                  padding: '18px',
                  borderRadius: '12px',
                  border: isAnswered
                    ? selected === q.correct
                      ? '1px solid rgba(52, 211, 153, 0.4)'
                      : '1px solid rgba(248, 113, 113, 0.4)'
                    : '1px solid #334155',
                  boxShadow: isAnswered && selected === q.correct ? '0 0 15px rgba(52, 211, 153, 0.08)' : 'none'
                }}>
                  {/* Question Meta Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#38bdf8', fontWeight: '800', fontSize: '13px' }}>
                        Question {idx + 1} of {activeQuestions.length}
                      </span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#94a3b8',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {q.category}
                      </span>
                    </div>

                    <span style={{
                      color: diffColor,
                      fontSize: '11px',
                      fontWeight: '700',
                      background: `${diffColor}18`,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${diffColor}40`
                    }}>
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p style={{ margin: '0 0 14px 0', fontSize: '14.5px', fontWeight: '600', color: '#f1f5f9', lineHeight: '1.5' }}>
                    {q.question}
                  </p>

                  {/* Multiple Choice Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                    {q.options.map((opt, oIdx) => {
                      let btnBg = '#1e293b';
                      let btnBorder = '#334155';
                      let btnColor = '#cbd5e1';

                      if (isAnswered) {
                        if (oIdx === q.correct) {
                          btnBg = '#059669';
                          btnBorder = '#34d399';
                          btnColor = '#fff';
                        } else if (selected === oIdx) {
                          btnBg = '#991b1b';
                          btnBorder = '#f87171';
                          btnColor = '#fff';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleQuizAnswer(q.id, oIdx)}
                          style={{
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: `1px solid ${btnBorder}`,
                            background: btnBg,
                            color: btnColor,
                            fontSize: '13px',
                            fontWeight: '600',
                            textAlign: 'left',
                            cursor: isAnswered ? 'default' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: isAnswered && oIdx === q.correct ? '#34d399' : isAnswered && selected === oIdx ? '#f87171' : 'rgba(255,255,255,0.1)',
                            color: isAnswered && (oIdx === q.correct || selected === oIdx) ? '#0f172a' : '#94a3b8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation */}
                  {isAnswered && (
                    <div style={{
                      fontSize: '12.5px',
                      color: '#cbd5e1',
                      background: '#1e293b',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      borderLeft: selected === q.correct ? '3px solid #34d399' : '3px solid #f87171',
                      lineHeight: '1.5'
                    }}>
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Bar with Refresh Action */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => generateNewQuizSet(selectedCategory, quizQuestionCount)}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span>🎲</span> Roll Different Questions (Next Random Batch)
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
