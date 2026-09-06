// ─── AlgoFlow Super-Intelligent Conversational RAG Engine ───────────────────
// Gentle, Calm & Empathetic AI Assistant (ChatGPT / Claude / Gemini / Copilot style)
// Context-Aware over Current Visualizer, Active Algorithm, 16 Branches, 8 Languages

import { checkRestrictedWords } from './restrictedWords.js';
import { TOPIC_INFO } from '../topicInfoData.js';
import { CURRICULUM_KNOWLEDGE_BASE, findCurriculumDirectResponse } from './curriculumKnowledgeData.js';

export const ALGOFLOW_KNOWLEDGE_BASE = [
  // ─── 1. ALGOFLOW STUDIO PROJECT FEATURES & VISUALIZERS ───────────────────────
  {
    topic: "AlgoFlow Studio: Complete Project Overview & Features",
    keywords: ["algoflow", "algoflow studio", "about algoflow", "project overview", "studio features", "platform overview", "what is algoflow", "algoflow features"],
    summary: "AlgoFlow Studio is an all-in-one interactive Computer Science, DSA visualizer, Code Runner, and Engineering Career Platform.",
    primaryLang: "Multi-Language (C, C++, Java, Python, JavaScript, TypeScript, Go, Rust)",
    placementDemand: "Comprehensive Learning Platform",
    content: `AlgoFlow Studio features 7 major visualizer engines and interactive learning studios:
1. **🌱 Beginner 101 Visualizer (9 Modules):**
   - 1. 16 B.Tech Branch Roadmaps (glowing hover tabs & 4-year milestones).
   - 2. Language Career Guide (Jobs, salary & fields per language).
   - 3. AI RAG Mentor Studio with live context inspector & opacity bar.
   - 4. Variables & Data Types (Visual memory storage boxes).
   - 5. Arrays & Indexing (Contiguous memory rows & O(1) access).
   - 6. Quirks & Exceptions (Java pointer myths, Python indentation, C memory allocation).
   - 7. Hands-On Syntax Practice (Interactive code sandbox with real-time bug fixing).
   - 8. Why Sorting Matters (Interactive search game comparing sorted vs unsorted).
   - 9. Why DSA Matters (Real-world scale simulator & Big-O scalability quiz).
2. **⚡ Sort & Search Visualizer:**
   - 11 Sorting Algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket, TimSort, Shell Sort.
   - 6 Searching Algorithms: Linear, Binary, Ternary, Jump, Interpolation, Exponential Search.
   - Live execution speed controls, step-by-step playback, sound synthesis, and code in 5 languages.
3. **📊 General Data Structures Visualizer:**
   - Arrays, Singly/Doubly/Circular Linked Lists, Stack, Queue (Circular, Deque, Priority Queue/Heap).
   - Self-Balancing Trees: AVL Tree (LL/RR/LR/RL rotations), Red-Black Tree, B-Tree, Segment Tree, Trie.
   - Hash Tables (Separate Chaining, Linear Probing, Quadratic Probing, Double Hashing).
4. **🗺️ Graph Algorithms Visualizer:**
   - Traversals: BFS, DFS.
   - Shortest Path: Dijkstra, Bellman-Ford, Floyd-Warshall, A* Search.
   - Minimum Spanning Trees: Kruskal's (DSU) & Prim's.
   - Advanced: Topological Sort (Kahn's), Tarjan's SCC, Kosaraju, Dinic's Max Flow.
5. **📈 Dynamic Programming & Greedy Visualizer:**
   - Knapsack (0/1 & Fractional), LCS, LIS, Coin Change (Greedy vs DP failures), Matrix Chain Multiplication, Edit Distance, Bitmask TSP.
6. **✨ Patterns & Loops Studio:**
   - Interactive visual loops for Pyramid, Diamond, Pascal's Triangle, Floyd's Triangle, Butterfly, Spiral Matrix.
7. **📚 DSA Notes & Solved Problems Studio:**
   - Two Sum, Valid Parentheses, Reverse Linked List, Stock Buy/Sell, String Matching (KMP, Z-Function, Rabin-Karp), Blelloch Scan, Miller-Rabin.
8. **💻 Code Runner & PythonTutor Line Debugger:**
   - In-browser code runner + line-by-line memory stack & heap frame visualizer for C, C++, Java, Python, and JS.`
  },
  {
    topic: "Visualizer Context: AVL Tree Rotations & Balancing",
    keywords: ["avl", "avl tree", "rotation", "balance factor", "left rotation", "right rotation", "ll rotation", "rr rotation"],
    summary: "An AVL Tree is a self-balancing Binary Search Tree where the height difference (balance factor) of any node's subtrees is at most ±1.",
    primaryLang: "C++ & Java",
    placementDemand: "Core Interview Data Structure",
    content: `AVL Tree Balancing Mechanics:
• **Balance Factor (BF):** $BF = Height(LeftSubtree) - Height(RightSubtree)$. Must be $-1, 0, \\text{or } +1$.
• **The 4 Balancing Rotations:**
  1. **Left-Left (LL) Heavy ($BF > +1$ and inserted in left-left):** Perform **1 Right Rotation** around the unbalanced node.
  2. **Right-Right (RR) Heavy ($BF < -1$ and inserted in right-right):** Perform **1 Left Rotation** around the unbalanced node.
  3. **Left-Right (LR) Heavy ($BF > +1$ and inserted in left-right):** Perform **Left Rotation on Left Child**, then **Right Rotation on Root**.
  4. **Right-Left (RL) Heavy ($BF < -1$ and inserted in right-left):** Perform **Right Rotation on Right Child**, then **Left Rotation on Root**.
• **Guaranteed Time Complexity:** Search, Insert, and Delete are always strictly $O(\\log N)$.`
  },
  {
    topic: "Visualizer Context: Quick Sort Partitioning & Pivot",
    keywords: ["quick sort", "quicksort", "pivot", "partition", "lomuto", "hoare", "why swap"],
    summary: "Quick Sort chooses a pivot element and partitions the array such that all smaller elements are on the left and larger on the right.",
    primaryLang: "C++ / Java / Python",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `How Quick Sort Works Step-by-Step:
1. **Pivot Selection:** Pick an element (e.g. last element in Lomuto partition).
2. **Partitioning & Swapping:** Maintain index $i$ of smaller elements. When scanning element $j < \\text{pivot}$, increment $i$ and swap $arr[i]$ with $arr[j]$.
3. **Place Pivot in True Position:** Swap $arr[i+1]$ with $arr[high]$. Now the pivot is permanently in its final sorted position!
4. **Recursion:** Recursively sort the left subarray and right subarray.`
  },
  {
    topic: "Visualizer Context: Dijkstra Shortest Path Algorithm",
    keywords: ["dijkstra", "shortest path", "relaxation", "min heap", "priority queue", "graph path"],
    summary: "Dijkstra finds the minimum distance from a starting node to all other nodes in a graph with non-negative edge weights.",
    primaryLang: "C++ (Priority Queue) / Python",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Dijkstra Algorithm Step-by-Step:
1. **Initialize:** Set $dist[start] = 0$ and all other $dist[v] = \\infty$. Push $(0, start)$ into a Min-Priority Queue.
2. **Extract Minimum:** Pop node $u$ with smallest current distance.
3. **Edge Relaxation:** For every neighbor $v$ with weight $w$:
   - If $dist[u] + w < dist[v]$, update $dist[v] = dist[u] + w$ and push $(dist[v], v)$ into the queue.
4. **Repeat** until all reachable nodes are visited. Time: $O((V + E) \\log V)$.`
  },
  {
    topic: "CSS: Cascading Style Sheets, Selectors, Box Model, Flexbox & Grid",
    keywords: ["css", "css3", "cascading style sheets", "style.css", "styling", "css styling", "frontend styling", "how to style", "css syntax", "css rules", "selectors", "specificity"],
    summary: "CSS (Cascading Style Sheets) controls the visual styling, colors, typography, layout geometry, and responsive presentation of HTML elements.",
    primaryLang: "CSS3 / Modern CSS",
    placementDemand: "Frontend & Full-Stack Web Development",
    content: `Comprehensive Overview of Modern CSS:
1. **Rule Anatomy:** \`selector { property: value; }\`
   • Selectors: Element (\`p\`), Class (\`.btn\`), ID (\`#main\`), Attribute (\`[type="text"]\`), Pseudo-class (\`:hover\`, \`:focus\`).
   • Specificity Hierarchy: \`!important\` > Inline Style (\`style=""\`) > ID (\`#\`) > Class (\`.\`), Attribute & Pseudo-class > Element tag (\`div\`).
2. **CSS Box Model:** Every element is a rectangular box:
   • **Content:** Text, image, or child elements.
   • **Padding:** Clear breathing room inside the border.
   • **Border:** Framing line surrounding the padding.
   • **Margin:** Transparent spacing separating the element from sibling elements.
   • **Golden Rule:** Always set \`* { box-sizing: border-box; }\` so width includes padding and border!
3. **Flexbox (1D Layouts):** \`display: flex;\` with \`justify-content\` (main axis), \`align-items\` (cross axis), and \`gap\` for clean item distribution.
4. **CSS Grid (2D Layouts):** \`display: grid;\` with \`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\` for auto-wrapping responsive cards.
5. **Modern Features:** CSS Custom Properties (\`:root { --accent: #38bdf8; }\`), Media Queries (\`@media (max-width: 768px)\`), and smooth transitions.`
  },
  {
    topic: "CSS Flexbox & CSS Grid: Modern Responsive Web Layouts",
    keywords: ["flexbox", "css flexbox", "display flex", "justify-content", "align-items", "css grid", "display grid", "grid-template-columns", "grid vs flexbox", "center a div"],
    summary: "Flexbox manages one-dimensional rows or columns; CSS Grid manages complex two-dimensional rows and columns simultaneously.",
    primaryLang: "CSS3",
    placementDemand: "Frontend Web Development",
    content: `Comparing Flexbox and CSS Grid:
• **When to use Flexbox:** Navigation bars, toolbars, centering a single element, dynamic lists where items wrap.
• **When to use CSS Grid:** Full-page layouts, dashboard widget grids, photo galleries with fixed aspect ratios.
• **Centering Trick in Flexbox:**
  \`\`\`css
  .center-box {
    display: flex;
    justify-content: center; /* Horizontally */
    align-items: center;     /* Vertically */
    min-height: 100vh;
  }
  \`\`\`
• **Centering Trick in CSS Grid:**
  \`\`\`css
  .center-box {
    display: grid;
    place-items: center;
    min-height: 100vh;
  }
  \`\`\``
  },

  // ─── 2. ALL 16 B.TECH ENGINEERING BRANCHES ─────────────────────────────────
  {
    topic: "B.Tech Branch: Computer Science & Engineering (CSE)",
    keywords: ["cse", "computer science", "software engineer", "sde", "coding for cse", "faang", "cs roadmap", "product company"],
    summary: "CSE is centered on scalable distributed software, OS, DBMS, Networks, and DSA.",
    primaryLang: "C++ or Java (for DSA) + TypeScript & Python",
    placementDemand: "⭐⭐⭐⭐⭐ (₹8 - 45 LPA)",
    content: `For Computer Science & Engineering (CSE):
• 1st Year: Master C/C++ fundamentals, logic building, Linux CLI, Git & GitHub. Keep CGPA > 8.0.
• 2nd Year: Deep dive into Data Structures & Algorithms (Trees, Graphs, DP) in C++ STL or Java Collections. Study DBMS (SQL), OS, and Computer Networks.
• 3rd Year: Build 2 production-grade Full-Stack applications (React/Next.js + Node/Go + PostgreSQL) with user auth & cloud deployment. Solve 200+ LeetCode problems. Apply for summer internships.
• 4th Year: Grind Blind 75 LeetCode list, study Low-Level (LLD) & High-Level (HLD) System Design, and give mock technical interviews.`
  },
  {
    topic: "B.Tech Branch: Information Technology (IT & Cloud)",
    keywords: ["it", "information technology", "cloud", "aws", "devops", "microservices", "web development", "docker"],
    summary: "IT specializes in cloud infrastructure, web architectures, microservices, and database administration.",
    primaryLang: "Java (Spring Boot) or TypeScript (Next.js) + Go",
    placementDemand: "⭐⭐⭐⭐⭐ (₹7 - 35 LPA)",
    content: `For Information Technology (IT):
• 1st Year: Java/C fundamentals, web foundations (HTML5/CSS3/JavaScript), Git, Linux.
• 2nd Year: DSA in Java, relational databases (PostgreSQL/MySQL), Spring Boot / Express REST APIs.
• 3rd Year: Cloud Computing (AWS/Azure), Docker containerization, Kubernetes, Full-Stack Next.js.
• 4th Year: DevOps CI/CD pipelines, System Architecture, LeetCode 150, Campus Placements.`
  },
  {
    topic: "B.Tech Branch: Artificial Intelligence & Machine Learning (AI/ML)",
    keywords: ["ai", "ml", "machine learning", "artificial intelligence", "deep learning", "pytorch", "neural networks", "llm", "rag", "langchain"],
    summary: "AI/ML focuses on predictive modeling, neural networks, computer vision, and Generative AI LLMs.",
    primaryLang: "Python (NumPy, Pandas, PyTorch) + SQL & C++ (Inference)",
    placementDemand: "⭐⭐⭐⭐⭐ (₹10 - 45 LPA)",
    content: `For AI & Machine Learning (AI/ML):
• 1st Year: Python mastery, Linear Algebra (Matrices/Eigenvalues), Calculus, Probability & Statistics.
• 2nd Year: Classical ML with Scikit-Learn (Regression, Trees, SVM, Random Forests), SQL, EDA with Pandas, first Kaggle competitions.
• 3rd Year: Deep Learning with PyTorch (CNNs, Transformers), Computer Vision (OpenCV), GenAI (LangChain, Vector DBs, RAG pipelines).
• 4th Year: MLOps (MLflow, Docker, ONNX, TensorRT), LLM fine-tuning (QLoRA), AI Engineering placements.`
  },
  {
    topic: "B.Tech Branch: Electronics & Communication (ECE)",
    keywords: ["ece", "electronics", "embedded", "vlsi", "microcontroller", "verilog", "iot", "semiconductor", "qualcomm", "ti"],
    summary: "ECE bridges physical silicon chips with firmware code, VLSI design, microcontrollers, and 5G telecom.",
    primaryLang: "Embedded C / C + C++ & Python (Signal Processing)",
    placementDemand: "⭐⭐⭐⭐ (₹6 - 28 LPA)",
    content: `For Electronics & Communication Engineering (ECE):
• Core Route: Embedded C for ARM Cortex / ESP32, Digital VLSI with Verilog/VHDL, KiCAD PCB design, and FreeRTOS.
• Software SDE Transition: ECE students easily crack top IT jobs by learning C++ for DSA on LeetCode + SQL databases and building 1 IoT Full-Stack project.`
  },
  {
    topic: "B.Tech Branch: Mechanical Engineering",
    keywords: ["mech", "mechanical", "cad", "solidworks", "ansys", "fea", "cfd", "manufacturing", "industry 4.0", "catia"],
    summary: "Mechanical engineers use Python & MATLAB to automate 3D CAD modeling, FEA stress analysis, and CFD simulations.",
    primaryLang: "Python & MATLAB + C++ (for Robotics / ROS)",
    placementDemand: "⭐⭐⭐⭐ (₹5.5 - 20 LPA)",
    content: `For Mechanical Engineering:
• Core Route: Master SolidWorks/CATIA 3D modeling, ANSYS FEA/CFD simulations, automate design calculations using Python.
• Software SDE Switch: Over 40% of Mechanical grads succeed in IT by learning C++/Java for DSA, SQL databases, and building full-stack web or data analytics projects.`
  },
  {
    topic: "Career Strategy: Non-CS Branch to Software SDE Transition",
    keywords: ["non-cs", "non cs to sde", "mechanical to sde", "civil to it", "ece to software", "switch branch", "it placements for core"],
    summary: "Complete blueprint for students in Mechanical, Civil, EEE, Biotech, etc. to land high-paying Software Engineer (SDE) roles.",
    primaryLang: "C++ or Java (DSA) + JavaScript/TypeScript (Web)",
    placementDemand: "⭐⭐⭐⭐⭐ (₹8 - 28 LPA)",
    content: `Transition Blueprint for Non-CS Students:
1. **Choose One Primary Language for DSA:** Pick C++ (STL) or Java. Do not jump between languages.
2. **Solve 150 Core LeetCode Questions:** Arrays, Strings, Two Pointers, Sliding Window, Linked Lists, Trees, Graphs, DP.
3. **Master Core CS Subjects (Interview Questions):**
   - DBMS: ACID properties, Normalization (1NF-3NF), SQL JOINs, Indexing.
   - Operating Systems: Process vs Thread, Deadlocks, Virtual Memory, CPU Scheduling.
   - Computer Networks: OSI 7 Layers, TCP vs UDP, DNS, HTTP/HTTPS.
4. **Build 2 High-Impact Resume Projects:**
   - 1 Full-Stack Project (React + Node.js/Spring Boot + PostgreSQL) with user login & live deployment.
   - 1 Domain-Hybrid Project (e.g. IoT Smart Sensor Dashboard or CAD automation tool) showing unique engineering edge.
5. **Resume & Portfolio:** Single-page LaTeX format (Overleaf). Link your GitHub, LinkedIn, and LeetCode profiles.`
  },
  {
    topic: "Array Algorithmic Pattern: Two Pointers Technique",
    keywords: ["two pointers", "pointer", "2 pointers", "opposite ends", "fast slow", "two sum sorted", "palindrome", "container with most water", "array pointers"],
    summary: "The Two Pointers pattern reduces O(N^2) brute force nested loops to O(N) by traversing array indices from opposite ends or at differing speeds.",
    primaryLang: "C++ (STL) / Java / Python / JS",
    placementDemand: "⭐⭐⭐⭐⭐ (Core Interview Pattern)",
    content: `Two Pointers Breakdown:
1. **Opposite-End Pointers (Sorted Arrays):**
   - Start \`left = 0\` and \`right = N - 1\`.
   - Calculate condition (e.g. \`arr[left] + arr[right]\`).
   - If sum < target, increment \`left++\` (need larger value).
   - If sum > target, decrement \`right--\` (need smaller value).
   - **Key Use Cases:** Two Sum II, Valid Palindrome, 3Sum, Container With Most Water, Reverse Array.
2. **Fast & Slow Pointers (Floyd's Cycle Finding):**
   - Slow moves 1 step (\`slow = slow.next\`), Fast moves 2 steps (\`fast = fast.next.next\`).
   - **Key Use Cases:** Linked List Cycle Detection, Finding Middle Node, Duplicate Number in Array.`
  },
  {
    topic: "Array Algorithmic Pattern: Sliding Window",
    keywords: ["sliding window", "window", "max sum subarray of size k", "longest substring", "variable window", "fixed window", "subarray sum"],
    summary: "Sliding Window maintains a running subsegment [L...R], adding the incoming element on the right and removing the outgoing element on the left in O(1) time.",
    primaryLang: "C++ / Java / Python / JS",
    placementDemand: "⭐⭐⭐⭐⭐ (Core Interview Pattern)",
    content: `Sliding Window Framework:
1. **Fixed-Size Window (Size K):**
   - Compute sum of first \`K\` elements.
   - For index \`r\` from \`K\` to \`N-1\`: \`windowSum += arr[r] - arr[r - K]\`.
   - Update \`maxSum = max(maxSum, windowSum)\`.
2. **Dynamic / Variable-Size Window:**
   - Expand \`right\` pointer: Add \`arr[right]\` to window state.
   - Contract \`left\` pointer while window condition is invalid: Remove \`arr[left]\` and increment \`left++\`.
   - **Key Use Cases:** Longest Substring Without Repeating Characters, Minimum Window Substring, Max Consecutive Ones III.`
  },
  {
    topic: "Array Algorithmic Pattern: Prefix Sum & Range Queries",
    keywords: ["prefix sum", "range sum", "cumulative sum", "prefix", "difference array", "subarray sum equals k"],
    summary: "Prefix Sum precomputes cumulative sums to answer any subarray sum query arr[L...R] in strictly O(1) constant time.",
    primaryLang: "C++ / Java / Python / JS",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Prefix Sum Formula:
• **Precompute:** \`prefix[i] = prefix[i-1] + arr[i]\` in O(N) time.
• **O(1) Query for [L...R]:**
  - If \`L == 0\`: Result is \`prefix[R]\`.
  - Else: Result is \`prefix[R] - prefix[L - 1]\`.
• **Subarray Sum Equals K:** Store prefix sum frequencies in a Hash Map to count matching subarrays in O(N) single pass!`
  },
  {
    topic: "Array Algorithmic Pattern: Dutch National Flag (3-Way Partitioning)",
    keywords: ["dutch national flag", "dutch flag", "sort colors", "sort 0 1 2", "3 way partitioning", "three pointers"],
    summary: "Sorts an array of 3 distinct values (0s, 1s, 2s) in a single linear pass O(N) time and O(1) extra space.",
    primaryLang: "C++ / Java / Python / C",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Dutch National Flag 3-Pointer Algorithm:
• Maintain 3 pointers: \`low = 0\`, \`mid = 0\`, \`high = N - 1\`.
• Invariant:
  - \`[0 ... low-1]\` contains 0s (Red)
  - \`[low ... mid-1]\` contains 1s (White)
  - \`[mid ... high]\` contains unknown elements
  - \`[high+1 ... N-1]\` contains 2s (Blue)
• While \`mid <= high\`:
  - If \`arr[mid] == 0\`: swap(\`arr[low++]\`, \`arr[mid++]\`).
  - If \`arr[mid] == 1\`: \`mid++\`.
  - If \`arr[mid] == 2\`: swap(\`arr[mid]\`, \`arr[high--]\`).`
  },
  {
    topic: "Backtracking: N-Queens Problem",
    keywords: ["nqueens", "n-queens", "n queens", "chessboard", "queens", "backtracking", "is safe"],
    summary: "Places N non-attacking queens on an N x N chessboard using recursive backtracking with state validation in O(N!) time.",
    primaryLang: "C++ / Java / Python / JS",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `N-Queens Backtracking Mechanics:
• Place one queen per row from row 0 to N-1.
• At row i, iterate through column j from 0 to N-1:
  - Check Safety: Ensure no previous queen at (r, c) shares column (c == j) or diagonal (|c - j| == |r - i|).
  - If Safe: Set board[i] = j and recurse to row i + 1.
  - If all columns fail in row i: Backtrack to row i - 1 and move previous queen to next available column.
• Solutions: For N=4 there are 2 solutions ([1, 3, 0, 2] and [2, 0, 3, 1]); for N=8 there are 92 distinct solutions.`
  },
  {
    topic: "Greedy Algorithm: Huffman Coding & Tree Compression",
    keywords: ["huffman", "huffman coding", "compression", "prefix code", "min heap", "variable length"],
    summary: "Optimal lossless prefix coding algorithm that builds a binary tree using a Min-Heap based on character frequency.",
    primaryLang: "C++ / Java / Python",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Huffman Tree Construction:
1. Create a leaf node for each unique character with its frequency.
2. Insert all nodes into a Min-Heap (priority queue sorted by frequency).
3. While Min-Heap contains > 1 node:
   - Extract two lowest frequency nodes: left and right.
   - Create parent node with frequency = left.freq + right.freq and left/right children.
   - Insert parent back into Min-Heap.
4. Traverse final tree: Left branch = '0', Right branch = '1'. Frequent characters receive shorter binary codes.`
  },
  {
    topic: "Dynamic Programming: Needleman-Wunsch DNA Sequence Alignment",
    keywords: ["needleman", "needleman wunsch", "dna alignment", "bioinformatics", "sequence alignment", "global alignment"],
    summary: "Dynamic programming matrix algorithm to compute the optimal global alignment of two biological sequences.",
    primaryLang: "Python / C++ / Java / JS",
    placementDemand: "⭐⭐⭐⭐",
    content: `Needleman-Wunsch Alignment DP Formula:
• Scoring: Match = +1, Mismatch = -1, Gap penalty = -2.
• Recurrence:
  $$DP[i][j] = \\max(DP[i-1][j-1] + \\text{score}(s1[i], s2[j]), DP[i-1][j] + \\text{gap}, DP[i][j-1] + \\text{gap})$$
• Direction arrows: Diagonal (Match/Mismatch), Up (Gap in s2), Left (Gap in s1).
• Traceback from bottom-right DP[N][M] to top-left DP[0][0] reconstructs optimal aligned strings.`
  },
  {
    topic: "Stack ADT Application: Infix to Postfix Conversion",
    keywords: ["infix to postfix", "infix", "postfix", "shunting yard", "expression evaluation", "operator stack"],
    summary: "Converts infix human expressions like (A+B)*C to postfix computer-friendly notation ABC*+ using an operator stack.",
    primaryLang: "C / C++ / Java / Python / JS",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Infix to Postfix Conversion Rules:
1. Operands (A-Z, 0-9): Append directly to output queue.
2. Left Parenthesis '(': Push to operator stack.
3. Right Parenthesis ')': Pop and append operators to output until '(' is popped.
4. Operators (+, -, *, /, ^): While stack top has >= precedence, pop to output. Then push current operator.
5. End of expression: Pop all remaining operators in stack to output.`
  },
  {
    topic: "Linked List ADT: Polynomial Addition & Arithmetic",
    keywords: ["polynomial", "polynomial adt", "polynomial addition", "polynomial linked list", "poly node"],
    summary: "Represents algebraic polynomials P(x) = c1*x^e1 + c2*x^e2 dynamically using linked lists sorted by exponent.",
    primaryLang: "C / C++ / Java",
    placementDemand: "⭐⭐⭐⭐",
    content: `Polynomial Addition with Linked Lists:
• Node Structure: \`struct PolyNode { int coeff, exp; PolyNode* next; }\`.
• Merge Algorithm (similar to Merge Sort):
  - If p1.exp == p2.exp: Add coefficients (c = p1.coeff + p2.coeff), create node with exp, advance both pointers.
  - If p1.exp > p2.exp: Append p1 term, advance p1.
  - If p2.exp > p1.exp: Append p2 term, advance p2.
• Append remaining terms from p1 or p2.`
  },
  {
    topic: "Number Theory: Sieve of Eratosthenes",
    keywords: ["sieve", "sieve of eratosthenes", "primes", "prime numbers", "prime grid", "factorization"],
    summary: "Generates all prime numbers up to N in strictly O(N log log N) time by eliminating composite multiples.",
    primaryLang: "C++ / Java / Python / C",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Sieve of Eratosthenes Steps:
1. Initialize boolean array isPrime[0...N] as true. Set isPrime[0] = isPrime[1] = false.
2. For p = 2 to sqrt(N):
   - If isPrime[p] is true:
     - Mark all multiples of p starting at p*p up to N as false: \`isPrime[i] = false\` with step p.
3. All remaining true indices in array are strictly prime numbers.`
  },
  {
    topic: "String Algorithms: Suffix Array & LCP",
    keywords: ["suffix array", "suffix", "lcp", "string matching", "substring search"],
    summary: "A sorted array of all suffixes of a string, enabling efficient substring queries and string processing in O(N log N) or O(N log^2 N).",
    primaryLang: "C++ / Java / Python",
    placementDemand: "⭐⭐⭐⭐",
    content: `Suffix Array Construction:
• Definition: An array of integers representing the starting indices of all suffixes of a string, sorted lexicographically.
• Usage:
  - Substring Search: Use Binary Search on the Suffix Array to find any pattern in O(M log N).
  - LCP Array (Longest Common Prefix): Computed alongside the Suffix Array using Kasai’s algorithm to find the longest repeated substring in the input string.`
  },
  {
    topic: "Data Structure: Hash Tables, Hashing & Collision Handling",
    keywords: ["hash", "hashing", "hash table", "hash map", "hashmap", "hash function", "collision", "separate chaining", "open addressing", "linear probing", "quadratic probing", "double hashing", "load factor", "modulo", "rehashing", "what is hash", "why we use hash", "hash formula"],
    summary: "A Hash Table maps keys to array bucket indices using a mathematical hash function, guaranteeing average O(1) constant time lookups, insertions, and deletions.",
    primaryLang: "C++ (unordered_map) / Java (HashMap) / Python (dict)",
    placementDemand: "⭐⭐⭐⭐⭐ (Most Frequently Asked DSA Topic)",
    content: `Comprehensive Hashing & Hash Tables Guide:
• **Core Concept:**
  A Hash Table converts any key (integer, string, object) into an array index using a **Hash Function**: $index = hash(key) \\pmod{TableSize}$.
• **Primary Formulas:**
  1. **Division / Modulo Method:** $h(k) = k \\bmod M$ (where $M$ is table size, usually prime to avoid clustering).
  2. **Linear Probing (Open Addressing):** $h(k, i) = (h(k) + i) \\bmod M$ for $i = 0, 1, 2, \\dots$
  3. **Quadratic Probing:** $h(k, i) = (h(k) + i^2) \\bmod M$ for $i = 0, 1, 2, \\dots$ (eliminates primary clustering).
  4. **Multiplication Method:** $h(k) = \\lfloor M \\times ((k \\times A) \\bmod 1) \\rfloor$ where $A = (\\sqrt{5}-1)/2 \\approx 0.6180339887$.
  5. **Folding Method:** $h(k) = (Chunk_1 + Chunk_2 + \\dots) \\bmod M$.
  6. **Load Factor (\\alpha):** $\\alpha = N / M$ (Number of items $N$ / Capacity $M$). When $\\alpha > 0.7$, trigger **Rehashing** into a new table of size $2M$.
• **Why We Use It:**
  - **O(1) Average Time:** Search, Insert, and Delete operate in $O(1)$ constant time compared to $O(N)$ for Arrays/Linked Lists and $O(\\log N)$ for BSTs.
  - **Real-World Systems:** Database indexing (MySQL/PostgreSQL Hash Indexes), Redis in-memory cache, Python dictionaries (\`dict\`), JavaScript Objects/Maps, compiler symbol tables, DNS routing tables.
• **Collision Resolution:**
  - **Separate Chaining:** Slots store linked lists or balanced BSTs of colliding items. Gracefully handles load factors $> 1.0$.
  - **Open Addressing:** All items stay directly in table cells. Probing finds the next available slot.`
  },
  {
    topic: "Data Structure: Binary Heaps & Priority Queues",
    keywords: ["heap", "binary heap", "min heap", "max heap", "priority queue", "heapify", "heap sort", "kth largest"],
    summary: "A Binary Heap is a complete binary tree that maintains the Heap-Order property, providing O(1) top access and O(log N) insert/delete.",
    primaryLang: "C++ (std::priority_queue) / Java (PriorityQueue) / Python (heapq)",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Binary Heap Formulas & Mechanics:
• **Array Index Representation:**
  - Parent of node $i$: $\\lfloor(i - 1) / 2\\rfloor$
  - Left Child: $2i + 1$
  - Right Child: $2i + 2$
• **Key Operations:**
  - **Push (Insert):** Append to end, bubble up via \`heapifyUp()\` in $O(\\log N)$.
  - **Pop (Extract Min/Max):** Swap root with last element, pop back, bubble down via \`heapifyDown()\` in $O(\\log N)$.
  - **Build Heap:** Calling heapify from bottom leaves up takes $O(N)$ linear time!
• **Why We Use It:** CPU process scheduling, Dijkstra's algorithm, Huffman coding, and finding Top-K elements.`
  },
  {
    topic: "Algorithm Paradigm: Dynamic Programming & Memoization",
    keywords: ["dp", "dynamic programming", "memoization", "tabulation", "optimal substructure", "overlapping subproblems", "0/1 knapsack", "lcs", "lis", "coin change"],
    summary: "Dynamic Programming solves complex optimization problems by breaking them into overlapping subproblems and caching intermediate solutions.",
    primaryLang: "C++ / Java / Python",
    placementDemand: "⭐⭐⭐⭐⭐ (Tier-1 FAANG / Product Companies)",
    content: `The 4-Step Dynamic Programming Blueprint:
1. **Identify Subproblems:** Formulate state $DP[i]$ or $DP[i][j]$ representing the solution to a sub-instance.
2. **Define Base Cases:** Trivial solutions (e.g. $DP[0] = 0$ or empty string length $= 0$).
3. **Find the State Transition Recurrence:**
   - **0/1 Knapsack:** $DP[i][w] = \\max(DP[i-1][w], DP[i-1][w-wt[i]] + val[i])$.
   - **LCS:** If $s1[i]==s2[j] \\rightarrow DP[i][j] = 1 + DP[i-1][j-1]$, else $\\max(DP[i-1][j], DP[i][j-1])$.
   - **Coin Change:** $DP[amt] = \\min(DP[amt], 1 + DP[amt - coin])$.
4. **Choose Approach:** Top-Down with Memoization (Recursion + Cache) or Bottom-Up Tabulation (Iterative Table filling).`
  },
  {
    topic: "Operating Systems: Core Architecture, Concurrency & Memory Management",
    keywords: ["os", "operating system", "operating systems", "process vs thread", "deadlock", "deadlocks", "coffman", "virtual memory", "paging", "page fault", "mmu", "semaphore", "semaphores", "mutex", "cpu scheduling", "round robin"],
    summary: "Operating Systems manage CPU, memory, storage, and I/O while providing process abstraction, concurrency primitives, and virtual memory protection.",
    primaryLang: "C & Linux Kernel / POSIX",
    placementDemand: "⭐⭐⭐⭐⭐ (Mandatory CS Core Interview Subject)",
    content: `Operating Systems Engineering Fundamentals:
• **Process vs Thread:** Processes have isolated virtual address spaces (Code, Data, Heap, Stack). Threads share code, data, and heap but retain private stacks and program counters.
• **Deadlocks (Coffman Conditions):** Occurs when Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait coincide. Prevented via resource ordering or Banker's Algorithm.
• **Virtual Memory & Paging:** Page table translates virtual addresses to physical RAM frames via the MMU. Page faults load missing pages from disk using algorithms like LRU (Least Recently Used).
• **Concurrency Primitives:** Mutex provides mutually exclusive locking with thread ownership. Semaphores (P/wait and V/signal) manage access counters for shared resource pools.
• **CPU Scheduling:** Round Robin (time slice quantum), Shortest Job First (SJF), and Multi-Level Feedback Queues (MLFQ) balance throughput and latency.`
  },
  {
    topic: "C/C++ Systems: Pointers, Memory Layout & Dynamic Allocation",
    keywords: ["pointer", "pointers", "address of", "dereference", "stack vs heap", "malloc", "free", "memory leak", "segmentation fault", "dangling pointer", "smart pointers", "pointer arithmetic"],
    summary: "Pointers store physical memory addresses in RAM, enabling direct hardware access, dynamic heap allocation, and efficient data structure linkages.",
    primaryLang: "C & C++",
    placementDemand: "⭐⭐⭐⭐⭐ (Essential for Systems & Low-Level Roles)",
    content: `Pointers & Memory Architecture:
• **Address-Of (&) vs Dereference (*):** \`&x\` extracts the memory address of variable \`x\`. \`*ptr\` reads or writes the actual data at the address.
• **Pointer Arithmetic:** \`ptr + 1\` jumps forward by \`sizeof(DataType)\` bytes (e.g. 4 bytes for int, 8 bytes for double or pointers).
• **Stack vs Heap:** Stack memory is automatic, contiguous, and fast (local function variables). Heap memory (\`malloc\`, \`new\`) is persistent and must be manually freed (\`free\`, \`delete\`) to avoid memory leaks.
• **Common Pointer Bugs:** Null pointer dereferences (segfaults), Dangling pointers (freed memory), Memory leaks (unreferenced allocations), Buffer overflows.
• **Modern C++ Smart Pointers:** \`std::unique_ptr\` (exclusive ownership), \`std::shared_ptr\` (reference counted), and \`std::weak_ptr\` (breaks cyclic memory leaks).`
  },
  {
    topic: "Software Architecture: Exception Handling & Fault Tolerance",
    keywords: ["exception", "exceptions", "exception handling", "try catch", "try-catch", "throw", "throws", "checked vs unchecked", "finally", "error handling"],
    summary: "Structured exception handling intercepts runtime errors gracefully without terminating applications, ensuring resource cleanup and predictable fault recovery.",
    primaryLang: "Java / C++ / Python / C#",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Exception Handling Principles:
• **The Try-Catch-Finally Lifecycle:** \`try\` encapsulates risky execution; \`catch\` recovers from specific failure types; \`finally\` unconditionally cleans up sockets, files, and DB connections.
• **Checked vs Unchecked (Java):** Checked exceptions (\`IOException\`, \`SQLException\`) are verified at compile-time and require handling or \`throws\`. Unchecked exceptions (\`NullPointerException\`, \`ArithmeticException\`) stem from logic bugs.
• **RAII in C++:** Destructors execute automatically during stack unwinding when an exception is thrown, releasing resources deterministically without needing finally blocks.
• **Best Practices:** Never catch and swallow exceptions silently. Throw descriptive domain exceptions and order catch blocks from most specific to general base classes.`
  },
  {
    topic: "Computer Architecture: Binary Numbers, Logic Gates & Bit Manipulation",
    keywords: ["binary", "binary values", "bit conversion", "bit conversitions", "decimal to binary", "bitwise", "bit manipulation", "two's complement", "xor", "bitwise and", "bitwise or", "bit shift"],
    summary: "Digital computers represent all data and instructions as binary digits (0 and 1). Bitwise operations manipulate bits directly at CPU cycle speeds.",
    primaryLang: "C / C++ / Python / Java",
    placementDemand: "⭐⭐⭐⭐⭐ (High-Frequency SDE Interview Category)",
    content: `Binary Mathematics & Bitwise Optimization:
• **Decimal to Binary:** Divide continuously by 2 and collect remainders in reverse order (bottom to top).
• **Binary to Decimal:** Sum positional power weights: $\\sum b_i \\cdot 2^i$. Example: $11010_2 = 16 + 8 + 2 = 26_{10}$.
• **Two's Complement Representation:** Negative integers satisfy $-x = (\\sim x) + 1$. Enables CPU addition and subtraction using the same ALU circuitry.
• **Bitwise Operators:** \`&\` (AND), \`|\` (OR), \`^\` (XOR), \`~\` (NOT), \`<<\` (Left shift: multiplies by $2^k$), \`>>\` (Right shift: divides by $2^k$).
• **Core DSA Hacks:** Power of 2 check (\`n > 0 && (n & (n - 1)) == 0\`), Clear lowest set bit (\`n & (n - 1)\`), Single number finder via XOR (\`a ^ a = 0\`).`
  },
  {
    topic: "Software Design: Object-Oriented Programming (OOP) & SOLID Principles",
    keywords: ["oop", "object oriented", "encapsulation", "inheritance", "polymorphism", "abstraction", "solid", "solid principles", "design patterns"],
    summary: "Object-Oriented Programming structures software into modular objects modeling real-world entities through four foundational pillars and SOLID design principles.",
    primaryLang: "Java / C++ / Python / C#",
    placementDemand: "⭐⭐⭐⭐⭐ (Core Technical Assessment Topic)",
    content: `OOP 4 Pillars & SOLID Architecture:
• **The 4 Pillars:**
  1. **Encapsulation:** Bundling state and methods within classes while restricting direct variable access using private modifiers and public getters/setters.
  2. **Abstraction:** Hiding complex internal implementation details and exposing only essential interfaces (Interfaces, Abstract classes).
  3. **Inheritance:** Deriving child classes from base classes to promote code reuse and establish 'is-a' relationships.
  4. **Polymorphism:** Method Overloading (Compile-time / static) and Method Overriding with dynamic dispatch via virtual tables (Runtime).
• **SOLID Principles:** Single Responsibility, Open-Closed (extend without modifying), Liskov Substitution, Interface Segregation, and Dependency Inversion.`
  },
  {
    topic: "Database Systems: Relational DBMS, ACID Properties & SQL Normalization",
    keywords: ["dbms", "sql", "database", "acid", "acid properties", "normalization", "1nf", "2nf", "3nf", "bcnf", "joins", "inner join", "left join", "b tree index"],
    summary: "Relational Database Management Systems store structured data with transactional ACID guarantees, relational joins, and multi-level B+ Tree indexing.",
    primaryLang: "SQL (PostgreSQL / MySQL)",
    placementDemand: "⭐⭐⭐⭐⭐ (Core Interview Expectation)",
    content: `DBMS Foundations & Production SQL:
• **ACID Transaction Guarantees:** Atomicity (all-or-nothing commits), Consistency (valid state constraints), Isolation (concurrency levels), Durability (persisted across power crashes).
• **Normalization Stages:** 1NF (atomic values, no repeating groups), 2NF (1NF + no partial dependency on composite keys), 3NF (2NF + no transitive dependencies), BCNF (every determinant is a candidate key).
• **SQL Joins:** INNER JOIN (intersection of matches), LEFT JOIN (all left rows + matching right rows), FULL OUTER JOIN (all rows from both tables).
• **Indexing Mechanics:** B+ Trees provide $O(\\log N)$ range scans and ordered lookups; Hash indexes give instant $O(1)$ point equality checks.`
  },
  {
    topic: "Computer Networks: OSI 7-Layer Model, TCP/IP & Internet Protocols",
    keywords: ["computer networks", "networking", "osi", "osi model", "tcp vs udp", "three way handshake", "dns", "http", "https", "socket"],
    summary: "Computer Networks govern reliable, packet-switched inter-device communication through layered protocol architectures including OSI and TCP/IP.",
    primaryLang: "Network Engineering / Sockets API",
    placementDemand: "⭐⭐⭐⭐⭐",
    content: `Networking Architecture & Protocols:
• **OSI 7 Layers (Top to Bottom):** Application (HTTP/DNS), Presentation (TLS/Encryption), Session, Transport (TCP/UDP), Network (IP/Routers), Data Link (Ethernet/MAC/Switches), Physical (Cables/Radio).
• **TCP vs UDP:** TCP is connection-oriented, reliable, ordered, and flow-controlled (web, email, file transfers). UDP is connectionless, lightweight, and unordered with minimal latency (gaming, video streaming, VoIP).
• **TCP 3-Way Handshake:** 1. Client sends SYN $\\rightarrow$ 2. Server responds with SYN-ACK $\\rightarrow$ 3. Client acknowledges with ACK. Connection established!
• **DNS Lookup Flow:** Browser Cache $\\rightarrow$ OS Resolver $\\rightarrow$ Recursive Resolver $\\rightarrow$ Root Nameserver $\\rightarrow$ TLD Nameserver (.com) $\\rightarrow$ Authoritative Nameserver.`
  },
  ...CURRICULUM_KNOWLEDGE_BASE
];

// ─── English Conversational Stopwords Filter ────────────────────────────────
const STOP_WORDS = new Set([
  'what', 'is', 'a', 'an', 'the', 'why', 'do', 'we', 'use', 'how', 'to', 'in',
  'for', 'of', 'and', 'or', 'any', 'thing', 'can', 'tell', 'me', 'about', 'this',
  'that', 'it', 'with', 'on', 'at', 'by', 'from', 'as', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'does', 'did', 'doing', 'i', 'you',
  'he', 'she', 'they', 'them', 'my', 'your', 'his', 'her', 'their', 'give', 'show',
  'explain', 'please', 'help', 'need', 'want', 'know', 'some', 'all', 'there', 'which',
  'when', 'where', 'who', 'whom', 'whose', 'only', 'displaying',
  'code', 'program', 'function', 'script', 'write', 'implement', 'handle', 'handling',
  'work', 'works', 'working', 'example', 'sample', 'question', 'questions', 'next',
  'steps', 'ask', 'time', 'timezone', 'timezones', 'clock', 'today', 'now', 'date', 'current'
]);

// ─── Canonical Topic Resolver (Query Keywords -> TOPIC_INFO Key) ───────────
export function resolveTargetTopic(lower, currentContext = {}) {
  const { appMode, treeType, globalDsType, globalDsVariety, globalSort, globalSearch, globalSortSearchTab } = currentContext || {};

  // 1. Check query for explicit data structure / algorithm keywords first:
  if (lower.includes('hash') || lower.includes('hashing') || lower.includes('probing') || lower.includes('chaining')) {
    if (lower.includes('chaining')) return 'HASH_CHAINING';
    if (lower.includes('quadratic')) return 'HASH_QUADRATIC';
    if (lower.includes('multiplication')) return 'HASH_MULTIPLICATION';
    if (lower.includes('folding')) return 'HASH_FOLDING';
    if (lower.includes('linear')) return 'HASH_LINEAR';
    return 'HASH_GENERAL';
  }
  if (lower.includes('avl')) return 'AVL';
  if (lower.includes('red black') || lower.includes('red-black') || lower.includes('rb tree') || lower.includes('rb_tree')) return 'RB_TREE';
  if (lower.includes('bst') || lower.includes('binary search tree')) return 'BST';
  if (lower.includes('b+ tree') || lower.includes('b plus') || lower.includes('b_plus')) return 'B_PLUS_TREE';
  if (lower.includes('b-tree') || lower.includes('b tree') || lower.includes('btree')) return 'B_TREE';
  if (lower.includes('segment tree')) return 'SEGMENT_TREE';
  if (lower.includes('fenwick') || lower.includes('binary indexed tree') || lower.includes('bit tree')) return 'FENWICK_TREE';
  if (lower.includes('heap') || lower.includes('priority queue')) return 'QUEUE_PRIORITY';
  if (lower.includes('quick sort') || lower.includes('quicksort')) return 'Quick Sort';
  if (lower.includes('merge sort') || lower.includes('mergesort')) return 'Merge Sort';
  if (lower.includes('bubble sort')) return 'Bubble Sort';
  if (lower.includes('selection sort')) return 'Selection Sort';
  if (lower.includes('insertion sort')) return 'Insertion Sort';
  if (lower.includes('heap sort')) return 'Heap Sort';
  if (lower.includes('counting sort')) return 'Counting Sort';
  if (lower.includes('radix sort')) return 'Radix Sort';
  if (lower.includes('binary search')) return 'Binary Search';
  if (lower.includes('linear search')) return 'Linear Search';
  if (lower.includes('dijkstra')) return 'Dijkstra';
  if (lower.includes('bellman')) return 'Bellman-Ford';
  if (lower.includes('floyd')) return 'Floyd-Warshall';
  if (lower.includes('kruskal')) return 'Greedy';
  if (lower.includes('prim')) return 'Prim';
  if (lower.includes('kahn') || lower.includes('topological')) return 'Kahn';
  if (lower.includes('bfs') || lower.includes('breadth first')) return 'BFS';
  if (lower.includes('dfs') || lower.includes('depth first')) return 'DFS';
  if (lower.includes('fractional knapsack')) return 'Fractional Knapsack';
  if (lower.includes('knapsack')) return 'Knapsack';
  if (lower.includes('coin change')) return 'Coin Change';
  if (lower.includes('lcs') || lower.includes('longest common subsequence')) return 'LCS';
  if (lower.includes('lis') || lower.includes('longest increasing subsequence')) return 'LIS';
  if (lower.includes('matrix chain')) return 'Matrix Chain';
  if (lower.includes('edit distance')) return 'Edit Distance';
  if (lower.includes('n-queen') || lower.includes('nqueen')) return 'N-Queens';
  if (lower.includes('rabin') || lower.includes('karp')) return 'MOD2_RABIN_KARP';
  if (lower.includes('kmp')) return 'MOD2_KMP';
  if (lower.includes('suffix array')) return 'MOD2_SUFFIX_ARRAYS';
  if (lower.includes('stack')) {
    if (lower.includes('expression')) return 'STACK_EXPRESSION';
    if (lower.includes('bracket')) return 'STACK_BRACKETS';
    if (lower.includes('conversion') || lower.includes('postfix')) return 'STACK_CONVERSION';
    if (lower.includes('linked list')) return 'STACK_LL';
    return 'STACK_ARRAY';
  }
  if (lower.includes('queue')) {
    if (lower.includes('circular')) return 'QUEUE_CIRCULAR';
    if (lower.includes('deque')) return 'QUEUE_DEQUE';
    if (lower.includes('priority')) return 'QUEUE_PRIORITY';
    return 'QUEUE_SIMPLE';
  }
  if (lower.includes('linked list') || lower.includes('singly') || lower.includes('doubly')) {
    if (lower.includes('doubly')) return 'LL_DOUBLY';
    if (lower.includes('circular')) return 'LL_CIRCULAR';
    if (lower.includes('polynomial')) return 'LL_POLYNOMIAL';
    return 'LL_SINGLY';
  }

  if (lower.includes('css') || lower.includes('cascading style') || lower.includes('flexbox') || lower.includes('css grid') || lower.includes('box model') || lower.includes('style.css')) {
    if (lower.includes('flexbox') || lower.includes('flex')) return 'CSS_FLEXBOX';
    if (lower.includes('grid')) return 'CSS_GRID';
    if (lower.includes('box model') || lower.includes('margin') || lower.includes('padding') || lower.includes('border')) return 'CSS_BOX_MODEL';
    return 'CSS_GENERAL';
  }

  // 2. If no explicit topic in query, only resolve from active studio visualizer context
  // IF the query actually refers to the current screen, visualizer, step, or formula:
  const isContextReferencing = 
    lower.includes('this') || lower.includes('current') || lower.includes('active') ||
    lower.includes('here') || lower.includes('visualizer') || lower.includes('screen') ||
    lower.includes('canvas') || lower.includes('step') || lower.includes('animation') ||
    lower.includes('algorithm') || lower.includes('formula') || lower.includes('recurrence') ||
    lower.includes('equation') || lower.includes('pros') || lower.includes('cons') ||
    lower.includes('advantage') || lower.includes('example') || lower.includes('walkthrough') ||
    lower.includes('trace') || lower.includes('dry run') || lower.includes('why swap') ||
    lower.includes('why rotate') || lower.includes('how does it work') ||
    lower === 'explain' || lower === 'what is this' || lower === 'help me' || lower === 'help';

  if (!isContextReferencing) {
    return null;
  }

  if (appMode === 'GENERAL_DSA_VIS') {
    if (globalDsType === 'HASH_TABLE') return globalDsVariety || 'HASH_LINEAR';
    if (globalDsType === 'STACK') return globalDsVariety || 'STACK_ARRAY';
    if (globalDsType === 'QUEUE') return globalDsVariety || 'QUEUE_SIMPLE';
    if (globalDsType === 'LINKED_LIST') return globalDsVariety || 'LL_SINGLY';
  }
  if (appMode === 'MAIN_VIS' && treeType) {
    return treeType;
  }
  if (appMode === 'sortSearch' || appMode === 'SORT_SEARCH_VIS') {
    return (globalSortSearchTab === 'search' ? globalSearch : globalSort) || globalSort || 'Quick Sort';
  }
  if (appMode === 'graphs' || appMode === 'GRAPH_VIS') {
    return 'Dijkstra';
  }
  if (appMode === 'dpGreedy' || appMode === 'DP_GREEDY_VIS') {
    return 'Knapsack';
  }

  // 3. Fallback to treeType if set
  if (treeType && treeType !== 'BST') {
    return treeType;
  }

  return null;
}

// ─── Query Sanity & Clarity Detectors ───────────────────────────────────────
function isGibberishOrUnintelligible(rawText, lower) {
  if (!rawText) return true;
  const trimmed = rawText.trim();
  if (!trimmed) return true;

  // 1. Only symbols or punctuation: e.g. "???", "...", "!!!", "!@#$%"
  if (/^[\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/.test(trimmed)) {
    return true;
  }

  // 2. Numbers only without math operator: e.g. "12345"
  if (/^\d+$/.test(trimmed)) {
    return true;
  }

  // 3. Extremely short inputs (1 or 2 chars) that are not valid programming terms
  const validShortTerms = new Set([
    'c', 'r', 'os', 'db', 'ip', 'ui', 'ux', 'ai', 'ml', 'dp', 
    'll', 'rr', 'lr', 'rl', 'js', 'ts', 'go', 'bf', 'cs', 'it', 'io', 'ds'
  ]);
  const alphaOnly = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (alphaOnly.length <= 2 && !validShortTerms.has(alphaOnly)) {
    return true;
  }

  // 4. Repeated identical characters 4+ times (e.g. "aaaaa", "zzzzzz", "dddd")
  if (/(.)\1{3,}/.test(lower)) {
    return true;
  }

  // 5. Repeated keyboard mash patterns (e.g. "asdfasdf", "qwerty", "zxcv")
  if (/^(asdf|qwerty|zxcv|hjkl|jkl;|dfgh|ghjk|qwer|asdfg)+/i.test(alphaOnly)) {
    return true;
  }

  // 6. Random consonant mash without any vowels (length >= 5 and no vowels [aeiouy])
  if (alphaOnly.length >= 5 && !/[aeiouy]/.test(alphaOnly)) {
    return true;
  }

  return false;
}

function isVagueOrIncomplete(lower) {
  const clean = lower.replace(/[!?.,]/g, '').trim();
  const vagueOneWords = new Set([
    'what', 'why', 'how', 'who', 'tell me', 'explain', 'and then', 'so what', 'what now', 'huh', 'wat', 'idk'
  ]);
  return vagueOneWords.has(clean);
}

// ─── Conversational, Empathetic & Context-Aware Response Generator ───────────
export function generateLocalRagResponse(userMessage, activeCode = '', activeLang = 'C++', currentContext = {}) {
  const query = (userMessage || '').trim();
  const lower = query.toLowerCase();

  // ── 0. RESTRICTED WORDS & PROFANITY FILTER ───────────────────────────────
  const restrictedMatch = checkRestrictedWords(userMessage);
  if (restrictedMatch) {
    return {
      text: `### ⚠️ Content Warning: Restricted Language Detected\n\nI cannot generate responses for messages containing offensive, inappropriate, or restricted words (detected: **"${restrictedMatch}"**).\n\nAlgoFlow AI Mentor is dedicated to computer science, coding practice, and engineering education. Please rephrase your question using respectful language, and I'll be glad to help!`,
      sources: ['Community Guidelines & Ethics Filter']
    };
  }

  // ── 0A. UNINTELLIGIBLE OR GIBBERISH INPUT (Apologize & Ask Again) ─────────
  if (isGibberishOrUnintelligible(query, lower)) {
    return {
      text: `### ✨ I'm really sorry, but I couldn't understand what you asked!

I wasn't able to interpret that message. Could you please ask again or rephrase your question with a few more words?

I'm your **AlgoFlow AI Mentor**, and I'm right here to help you with:
* 🌲 **Data Structures & Algorithms** (Trees, AVL rotations, Hash Tables, Heaps, Graph Traversals, Dynamic Programming)
* 🧠 **Core CS Subjects** (Operating Systems, DBMS & SQL, Computer Networks, OOP 4 Pillars)
* 🎨 **Web Technologies & CSS** (HTML5, CSS3 Box Model, Flexbox, Grid, Selectors, Responsive UI)
* 💻 **Languages & Code Debugging** (C, C++, Java, Python, JavaScript, Pointers, Bitwise conversions)
* 🎓 **B.Tech Career Roadmaps** (Milestones for CSE, ECE, Mech, Civil, and all 16 engineering branches)

Please type your question again, and I'll be glad to help! 💡`,
      sources: ['AlgoFlow Natural Language Understanding Engine']
    };
  }

  // ── 0B. VAGUE / ISOLATED QUERIES (Apologize & Ask For Context) ────────────
  if (isVagueOrIncomplete(lower) && (!activeCode || activeCode.trim().length < 10)) {
    return {
      text: `### ✨ I'm so sorry, but I didn't quite catch what you're referring to!

Your question is a bit too brief for me to know what you need help with. Could you please ask again with a little more detail?

Here are some great topics we could look into together:
* 💡 *"Can you explain how AVL Tree balance factors work?"*
* 🎨 *"How do I center a card using CSS Flexbox?"*
* ⚡ *"Why is Quick Sort usually faster than Merge Sort in practice?"*
* 🧠 *"Explain Deadlocks in Operating Systems with a real-life analogy."*

Just tell me what's on your mind, and we'll walk through it step-by-step! 🚀`,
      sources: ['AlgoFlow Clarification Assistant']
    };
  }

  // ── 0C. USER CONFUSION / "I DON'T UNDERSTAND" (Apologize & Simplify) ──────
  const isConfusionQuery = 
    lower.includes("don't understand") || lower.includes("dont understand") || 
    lower.includes("didn't understand") || lower.includes("didnt understand") || 
    lower.includes("cant understand") || lower.includes("can't understand") || 
    lower.includes("couldnt understand") || lower.includes("couldn't understand") ||
    lower.includes("explain again") || lower.includes("say that again") || 
    lower.includes("could you simplify") || lower.includes("explain simply") ||
    lower.includes("i am confused") || lower.includes("i'm confused") || 
    lower.includes("too complex") || lower.includes("not clear") ||
    lower.includes("make it simpler") || lower.includes("what does that mean");

  if (isConfusionQuery) {
    return {
      text: `### ✨ I'm so sorry for the confusion!

I apologize that my explanation wasn't clear or felt overwhelming. Let's make it super easy and intuitive to grasp!

Could you please let me know:
1. **Which specific concept or part felt tricky?**
2. **How would you like to explore it?**
   * 💡 **A simple real-life story or analogy** (zero jargon)
   * 🔢 **A small step-by-step numerical walkthrough**
   * 🎨 **Visual ASCII diagram or layout**
   * 💻 **A short, clean code snippet with line-by-line comments**

Please ask again with the part you'd like me to clarify, and we'll take it one peaceful step at a time! 🚀`,
      sources: ['AlgoFlow Empathy & Learning Engine']
    };
  }

  // ── 0D. DEDICATED CSS (CASCADING STYLE SHEETS) CODE RUNNER & TUTOR ─────────
  const hasCssCodeSyntax = 
    (lower.includes('{') && lower.includes('}') && (lower.includes(':') || lower.includes(';'))) ||
    lower.includes('display: flex') || lower.includes('display: flex;') || lower.includes('display: grid') ||
    lower.includes('display: block') || lower.includes('margin:') || lower.includes('padding:') ||
    lower.includes('background:') || lower.includes('background-color:') || lower.includes('color:') ||
    lower.includes('border:') || lower.includes('font-size:') || lower.includes('flex-direction:') ||
    lower.includes('justify-content:') || lower.includes('align-items:') || lower.includes('grid-template') ||
    lower.includes('box-sizing:') || lower.includes('border-radius:') || lower.includes('overflow:') ||
    lower.includes('position: absolute') || lower.includes('position: relative') || lower.includes('position: fixed');

  const isCssConceptualQuery = 
    lower.includes('css') || lower.includes('cascading style') || lower.includes('flexbox') || 
    lower.includes('css grid') || lower.includes('box model') || lower.includes('css selector') || 
    lower.includes('css variable') || lower.includes('style.css') || lower.includes('responsive design') ||
    lower.includes('center a div') || lower.includes('css animation') || lower.includes('css media');

  if (hasCssCodeSyntax) {
    const openBraces = (query.match(/\{/g) || []).length;
    const closeBraces = (query.match(/\}/g) || []).length;
    const hasBraceMismatch = openBraces > 0 && openBraces !== closeBraces;

    const detectedFeatures = [];
    if (lower.includes('display: flex') || lower.includes('display:flex')) {
      detectedFeatures.push('**Flexbox Container:** Lays out children along a 1D flex axis. Pair with `justify-content` (main axis) and `align-items` (cross axis).');
    }
    if (lower.includes('display: grid') || lower.includes('display:grid')) {
      detectedFeatures.push('**CSS Grid:** Creates a 2D layout grid. Pair with `grid-template-columns` and `gap` for responsive card grids.');
    }
    if ((lower.includes('justify-content: center') || lower.includes('justify-content:center')) && 
        (lower.includes('align-items: center') || lower.includes('align-items:center'))) {
      detectedFeatures.push('**Perfect Centering:** Elements are centered horizontally and vertically within the parent container!');
    }
    if (lower.includes('box-sizing: border-box') || lower.includes('box-sizing:border-box')) {
      detectedFeatures.push('**Border-Box Model:** Excellent practice! Padding and borders are calculated inside the declared width/height.');
    }
    if (lower.includes('margin') && lower.includes('padding')) {
      detectedFeatures.push('**Spacing Hierarchy:** `padding` provides internal breathing room inside the border; `margin` separates this element from neighboring elements.');
    }
    if (lower.includes('border-radius')) {
      detectedFeatures.push('**Rounded Corners:** Softens sharp borders with modern curved corners.');
    }

    return {
      text: `### 🎨 CSS Code Analysis & Styling Guide

Here is a clean breakdown of your CSS snippet:

\`\`\`css
${query.slice(0, 500)}${query.length > 500 ? '\n/* ... */' : ''}
\`\`\`

---

#### 🔍 1. Syntax & Rule Validation:
${hasBraceMismatch 
  ? `* ⚠️ **Mismatched Braces:** Found ${openBraces} opening \`{\` and ${closeBraces} closing \`}\`. Make sure all selector blocks are closed!` 
  : `* ✅ **Brace Matching:** CSS block structure is balanced and valid.`}
* 💡 **Property Checklist:** Every declaration should follow the \`property: value;\` format with a colon and semicolon.

---

#### 📐 2. What This CSS Does:
${detectedFeatures.length > 0 ? detectedFeatures.map(f => `• ${f}`).join('\n') : '• Applies custom styles, visual attributes, or positioning to targeted HTML elements.'}

---

#### 💡 3. Quick CSS Pro-Tips:
1. **Universal Reset:** Add \`* { box-sizing: border-box; margin: 0; padding: 0; }\` to the top of your stylesheet to eliminate unexpected gaps.
2. **Dynamic Centering:** To center any div both ways in 3 lines:
   \`\`\`css
   .center {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   \`\`\`
3. **Responsive Spacing:** Prefer \`rem\` units for margins/padding and \`var(--theme-color)\` for accessible theme colors.

Would you like me to show HTML markup that pairs with this CSS, or explain any specific property? 🚀`,
      sources: ['AlgoFlow CSS & Frontend Engine', 'Web Style Standards']
    };
  }

  if (isCssConceptualQuery) {
    if (lower.includes('box model') || lower.includes('margin vs padding') || lower.includes('padding vs margin')) {
      return {
        text: `### 📦 The CSS Box Model: Core Architectural Guide

In CSS, **every single HTML element** on the screen is rendered as a rectangular geometric box composed of 4 concentric layers:

\`\`\`text
+-------------------------------------------------+
|                   MARGIN                        |  <- Transparent outer space (separates siblings)
|   +-----------------------------------------+   |
|   |               BORDER                    |   |  <- Decorative boundary line (solid, dashed, etc.)
|   |   +---------------------------------+   |   |
|   |   |           PADDING               |   |   |  <- Internal breathing room (takes background color)
|   |   |   +-------------------------+   |   |   |
|   |   |   |                         |   |   |   |
|   |   |   |         CONTENT         |   |   |   |  <- Text, images, or child DOM elements
|   |   |   |                         |   |   |   |
|   |   |   +-------------------------+   |   |   |
|   |   +---------------------------------+   |   |
|   +-----------------------------------------+   |
+-------------------------------------------------+
\`\`\`

---

#### 🌟 1. The 4 Layers Explained:
1. **Content:** The actual text, icon, or image. Size defined by \`width\` and \`height\`.
2. **Padding:** The space between the content and the border. **Takes the background color of the element.**
3. **Border:** Wraps the padding. Can have style, thickness, and color (e.g. \`2px solid #38bdf8\`).
4. **Margin:** Transparent empty space outside the border that pushes other elements away.

---

#### ⚠️ 2. The Great Box-Sizing Trap (\`content-box\` vs \`border-box\`):
* **Default (\`box-sizing: content-box\`):**
  $$\\text{Total Width} = \\text{width} + \\text{padding-left} + \\text{padding-right} + \\text{border-left} + \\text{border-right}$$
  If width is 100px and padding is 20px, total width becomes **140px**, unexpectedly breaking grid layouts!
* **Best Practice (\`box-sizing: border-box\`):**
  $$\\text{Total Width} = \\text{declared width}$$
  Padding and border are drawn **inside** the width! Always put this at the top of your CSS:
  \`\`\`css
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  \`\`\``,
        sources: ['AlgoFlow CSS Knowledge Base', 'CSS Box Model Architecture']
      };
    }

    if (lower.includes('flexbox') || lower.includes('flex') || lower.includes('center a div')) {
      return {
        text: `### ⚡ CSS Flexbox: 1D Layout System & Quick Centering

**Flexbox (Flexible Box Layout)** is designed for laying out elements in a single direction (either as a row or as a column) with dynamic space distribution:

---

#### 🎯 1. How to Center a Div in Flexbox (The Classic Solution):
\`\`\`css
.container {
  display: flex;
  justify-content: center; /* Aligns horizontally along the main axis */
  align-items: center;     /* Aligns vertically along the cross axis */
  min-height: 100vh;       /* Full viewport height */
}
\`\`\`

---

#### 🧭 2. Main Axis vs Cross Axis:
* **\`flex-direction: row\` (Default):**
  * **Main Axis:** Horizontal (Left $\\rightarrow$ Right). Controlled by \`justify-content\`.
  * **Cross Axis:** Vertical (Top $\\rightarrow$ Bottom). Controlled by \`align-items\`.
* **\`flex-direction: column\`:**
  * **Main Axis:** Vertical.
  * **Cross Axis:** Horizontal.

---

#### 🛠️ 3. Most Common Properties:
* \`justify-content: space-between;\` ➔ Distributes items evenly with first item at start and last at end.
* \`justify-content: space-around;\` ➔ Equal space around each item.
* \`gap: 16px;\` ➔ Clean spacing between flex items without needing margin hacks!
* \`flex-wrap: wrap;\` ➔ Allows items to drop down to the next line on smaller screens.`,
        sources: ['AlgoFlow CSS Knowledge Base', 'CSS Flexbox Guide']
      };
    }

    if (lower.includes('grid')) {
      return {
        text: `### 📐 CSS Grid: 2D Layout System

**CSS Grid** is the most powerful 2-dimensional layout engine in CSS, controlling both rows and columns simultaneously:

---

#### 🚀 1. The Magic Auto-Wrapping Card Grid:
You can build a fully responsive card layout without writing a single media query:
\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
\`\`\`
* If the screen has room for 4 cards of 280px, it shows 4 columns.
* If resized smaller, cards dynamically wrap down to 3, 2, or 1 column!

---

#### ⚡ 2. Flexbox vs Grid: When to Use Which?
* **Use Flexbox for:** 1-dimensional layouts (Navbars, toolbars, list rows, centering a single element).
* **Use Grid for:** 2-dimensional full-page layouts, dashboard widget grids, and image galleries.`,
        sources: ['AlgoFlow CSS Knowledge Base', 'CSS Grid Guide']
      };
    }

    // General CSS Overview
    return {
      text: `### 🎨 CSS (Cascading Style Sheets): Complete Master Guide

**CSS** is the design language of the World Wide Web. It controls how semantic HTML elements are styled, colored, animated, and structured across viewports!

---

#### 📋 1. Anatomy of a CSS Rule:
\`\`\`css
selector {
  property: value; /* Declaration */
}
\`\`\`
* **Selectors:**
  * **Element:** \`p { color: #e2e8f0; }\`
  * **Class (\`.\`):** \`.button { background: #38bdf8; border-radius: 8px; }\`
  * **ID (\`#\`):** \`#navbar { position: fixed; top: 0; width: 100%; }\`
  * **Pseudo-class (\`:\`):** \`.button:hover { opacity: 0.85; transform: scale(1.02); }\`

---

#### ⚖️ 2. Selector Specificity Hierarchy:
When two rules conflict, the browser uses Specificity scoring:
$$\\mathbf{!important > \\text{Inline Style} > \\text{ID (\\#)} > \\text{Class (\\.) / Attribute} > \\text{Element tag}}$$

---

#### 📦 3. The 3 Core Pillars of Modern CSS:
1. **The Box Model:** Content $\\rightarrow$ Padding (inside) $\\rightarrow$ Border $\\rightarrow$ Margin (outside). Always use \`* { box-sizing: border-box; }\`.
2. **Layout Engines:** Use **Flexbox** (\`display: flex\`) for 1D navigation and centering; use **Grid** (\`display: grid\`) for 2D card grids.
3. **CSS Variables (Custom Properties):**
   \`\`\`css
   :root {
     --primary: #38bdf8;
     --bg: #0f172a;
   }
   body {
     background: var(--bg);
     color: var(--primary);
   }
   \`\`\`

Paste any CSS snippet you're working on right here, and I'll analyze it or help you fix any bug! 🚀`,
      sources: ['AlgoFlow CSS Knowledge Base', 'Web Technologies Guide']
    };
  }

  // ── Context Variables & Target Topic Resolution ─────────────────────────
  const { appMode, treeType, globalDsType, globalDsVariety, globalSort, globalSearch, globalSortSearchTab } = currentContext || {};
  const currentTree = treeType ? String(treeType).toUpperCase() : '';
  const targetTopic = resolveTargetTopic(lower, currentContext);

  // ── 00A. GREETINGS, CHIT-CHAT & PERSONALITY ("how are uu", "hello", "who are you") ──
  const isGreetingQuery = lower.match(/^(how\s+(are|r)\s+(u+|you|ya)|how\s+do\s+you\s+do|how'?s\s+it\s+going|sup|what'?s\s+up|wassup|hello|hi|hey|heyy|greetings|good\s+(morning|afternoon|evening)|yo)[\s!?,.]*$/i) ||
    lower.includes('how are uu') || lower.includes('how are you') || lower.includes('how r u') || lower.includes('how r uu');

  if (isGreetingQuery) {
    return {
      text: `### ✨ Hello there! I'm doing great and feeling energized!

I'm your **AlgoFlow AI Mentor & Companion** 🚀. I am active and ready to help you:
* ⚡ **Master & Visualize DSA:** AVL Trees, Hash Tables, Heaps, Graph Traversals, and Dynamic Programming.
* 🧠 **Understand Core CS Fundamentals:** Operating Systems (Deadlocks, Virtual Memory), DBMS (ACID, Normalization), Networks (OSI, TCP/UDP), and OOP (4 Pillars).
* 🎨 **Web Technologies & CSS:** CSS Box Model, Flexbox centering, Grid layouts, and responsive design.
* 💡 **Code & Algorithmic Intuition:** Pointers & Memory Management, Bit Conversions, Bitwise Operators, and Stack/Heap allocation.
* 🐞 **Debug Your Code:** Analyze active code, spot off-by-one errors, infinite loops, and memory leaks.
* 🎓 **B.Tech Career Guidance:** 16 Engineering branch roadmaps and SDE placement roadmaps.

What topic, problem, or code snippet are you working on right now? Ask me anything! ✨`,
      sources: ['AlgoFlow AI Persona Engine', 'Interactive Mentor Studio']
    };
  }

  const isWhoAreYou = lower.includes('who are you') || lower.includes('what are you') || lower.includes('introduce yourself') || lower.includes('tell me about yourself');
  if (isWhoAreYou) {
    return {
      text: `### ✨ I am your AlgoFlow AI Mentor!

I am an intelligent, context-aware Computer Science, Web Technologies & Data Structures mentor built right into **AlgoFlow Studio**.

#### 🎯 What I Can Do For You:
1. **Explain Any CS & Web Topic:** From Pointers, Memory, and CSS Flexbox/Grid to Operating Systems, DBMS, and Computer Networks.
2. **Decode Any Algorithm:** Balance factors & rotations in AVL Trees, Hash collisions (Chaining vs Linear Probing), Dijkstra, Topological Sort, and Dynamic Programming.
3. **Debug Your Code & CSS:** Analyze your active code, catch syntax/runtime pitfalls, and suggest clean fixes.
4. **Formula & Equation Engine:** Provide exact mathematical definitions, load factors, recurrences, and step-by-step numbers.
5. **Engineering Roadmaps:** Advise on core branch syllabus, placements, and top tech stacks.

Feel free to ask any question — whether it's *"what are pointers"*, *"why dynamic programming"*, *"how to center with flexbox"*, or *"fix my code"*! 💡`,
      sources: ['AlgoFlow AI Persona Engine']
    };
  }

  const isGratitude = lower.match(/^(thank\s*you|thanks|thx|tysm|appreciate\s+it|great\s+job|awesome|nice)[\s!?,.]*$/i);
  if (isGratitude) {
    return {
      text: `### ✨ You're very welcome!
I'm always here to make complex Computer Science concepts simple, visual, and intuitive.

Whenever you hit another bug, need a formula, or want to dive into a new algorithm, just ping me. Happy coding! 🚀💻`,
      sources: ['AlgoFlow AI Persona Engine']
    };
  }

  // ── 00B. WHAT IS ALGOFLOW ("what is algoflow", "about algoflow", "project overview") ──
  const isAlgoFlowQuery = lower.includes('what is algoflow') || lower.includes('about algoflow') || lower.includes('who created algoflow') || lower.includes('features of algoflow') || lower.includes('project overview') || lower.includes('what does algoflow do');

  if (isAlgoFlowQuery) {
    return {
      text: `### 🎯 AlgoFlow Studio: Complete Project Overview & Features

**AlgoFlow Studio** is an all-in-one interactive Computer Science, Data Structures & Algorithms visualizer, multi-language code runner, and engineering career platform!

---

#### 🌟 7 Major Visualizer Engines & Learning Studios:
1. 🌱 **Beginner 101 Visualizer:**
   * 16 B.Tech Branch Roadmaps (CSE, IT, AI/ML, ECE, Mech, Civil, etc.) with 4-year milestones.
   * Language Career Guide (Jobs, salary ranges, industry domains per language).
   * Interactive Memory Boxes, Variables, Contiguous Array Rows, and Stack/Queue animations.
2. 🌲 **Binary Search Trees & AVL Trees Visualizer:**
   * Self-balancing AVL rotations (LL, RR, LR, RL) with real-time balance factors.
   * Red-Black Trees with recoloring and 5 invariant rules.
   * Segment Trees, Fenwick Trees, Treaps, and B-Trees.
3. ⚡ **General Data Structures Visualizer:**
   * **Hash Tables:** Linear Probing, Quadratic Probing, and Separate Chaining with load factor calculations.
   * **Stacks & Queues:** Array vs Linked List backed LIFO & FIFO with underflow/overflow alerts.
   * **Linked Lists:** Singly, Doubly, and Circular Linked Lists with interactive pointer splicing.
4. 🔢 **Sorting & Searching Studio:**
   * Visual comparisons of Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, and Counting Sort.
   * Linear Search and Binary Search with safe midpoint animations.
5. 🗺️ **Graph Algorithms Studio:**
   * BFS, DFS, Dijkstra's Shortest Path, Bellman-Ford, Prim's & Kruskal's MST, and Topological Sort.
6. 💻 **Multi-Language Code Runner & Debugger:**
   * Run and debug code in C, C++, Java, Python, JavaScript, TypeScript, Go, and Rust with line-by-line step debugger.
7. ✨ **AI RAG Mentor Studio:**
   * Real-time RAG context retrieval, live opacity adjustments, and dual offline/online intelligence.`,
      sources: ['AlgoFlow Studio Architecture & Project Overview']
    };
  }

  // ── 00B2. SPECIALIZED CURRICULUM TOPICS & ADVANCED ENGINEERING DOMAINS ──
  const curriculumDirect = findCurriculumDirectResponse(lower);
  if (curriculumDirect) {
    return curriculumDirect;
  }

  // ── 00B3. BINARY SEARCH TREE (BST) MASTER GUIDE & ACTIVE VISUALIZER ──
  const isBstQuery = lower.includes('bst') || lower.includes('binary search tree') ||
    ((currentTree === 'BST' || (!currentTree && appMode === 'MAIN_VIS')) && (
      lower.includes('what this') || lower.includes('what is this') || lower.includes('what’s this') || lower.includes('whats this') ||
      lower.includes('explain this') || lower.includes('how does this work') || lower.includes('tell me about this') ||
      lower.includes('why use this') || lower.includes('what is happening') || lower.includes('what are we doing')
    ));

  if (isBstQuery) {
    return {
      text: `### 🌳 Binary Search Tree (BST): Complete Concept & Architecture

You are looking at the **Binary Search Tree (BST) Visualizer**!

A **Binary Search Tree** is a hierarchical, non-linear node-based data structure designed to combine the **fast searching speed of a sorted array** ($O(\\log N)$) with the **flexible, dynamic insertion capability of a linked list**.

---

#### 🌟 1. The Fundamental Golden Rule of a BST:
For **every single node** in the tree:
$$\\mathbf{\\text{All Keys in Left Subtree} < \\text{Node Value} < \\text{All Keys in Right Subtree}}$$

\`\`\`text
                 [ 50 ]              <- Root
                /      \\
             [ 30 ]    [ 70 ]        <- 30 < 50 < 70
            /    \\     /    \\
         [ 20 ] [ 40 ] [ 60 ] [ 80 ]
\`\`\`
* If a new value is **smaller** than the current node $\\rightarrow$ go **LEFT**.
* If a new value is **greater** than the current node $\\rightarrow$ go **RIGHT**.

---

#### ⚡ 2. The 3 Core Operations:

##### A. Searching for a Key:
1. Start at the root node.
2. If \`target == node.val\`, search is successful! 🎉
3. If \`target < node.val\`, search the **left subtree**.
4. If \`target > node.val\`, search the **right subtree**.
5. *Speed:* Halves the search space at every step ($\\approx O(\\log N)$).

##### B. Inserting a Key:
* Follow the search rules until you hit a \`null\` leaf pointer.
* Attach the new node there as a child. No array shifting required!

##### C. Deletion (3 Cases):
1. **Case 1 (Leaf Node):** Simply delete the node (set parent's child pointer to \`null\`).
2. **Case 2 (One Child):** Bypass the node; connect the node's parent directly to its child.
3. **Case 3 (Two Children):** Replace the node's value with its **Inorder Successor** (the smallest value in its right subtree), then delete that successor!

---

#### 🪄 3. The Inorder Traversal Magic:
If you traverse a BST using **Inorder Traversal** (\`Left ➔ Root ➔ Right\`):
$$\\text{Inorder}([50, 30, 70, 20, 40, 60, 80]) = \\mathbf{[20, 30, 40, 50, 60, 70, 80]}$$
* **It ALWAYS produces the elements in strictly sorted ascending order!**

---

#### ⚠️ 4. The Fatal Flaw of a Normal BST (Why it Degenerates):
* If you insert already sorted numbers (e.g. \`10, 20, 30, 40, 50\`):
\`\`\`text
  10
    \\
     20
       \\
        30
          \\
           40
             \\
              50   <- Degenerates into a flat Linked List!
\`\`\`
* The tree becomes **skewed**, and search speed collapses from **$O(\\log N)$ down to $O(N)$** (sluggish linear scan)!
* 💡 **The Solution:** **Self-Balancing Trees** like **AVL Trees** (rotations on balance factor $\\pm 2$) and **Red-Black Trees**!

---

#### ⏱️ Time & Space Complexity:
| Operation | Average Case (Balanced) | Worst Case (Skewed) |
|---|---|---|
| **Search** | **$O(\\log N)$** | $O(N)$ |
| **Insert** | **$O(\\log N)$** | $O(N)$ |
| **Delete** | **$O(\\log N)$** | $O(N)$ |
| **Space** | $O(N)$ | $O(N)$ |

---

#### 🕹️ Try It Right Now on the Canvas:
1. In the input box above, type a number (e.g. \`25\`) and click **Insert**.
2. Watch the animation trace down from the root, comparing whether 25 is smaller or larger at each node!`,
      sources: ['AlgoFlow Tree Visualizer Engine', 'Binary Search Tree Specifications', 'Core DSA Architecture']
    };
  }

  // ── 00C. BINARY VALUES & BIT CONVERSIONS ("binary values", "bit conversitions", "decimal to binary") ──
  const isBitQuery = lower.includes('binary value') || lower.includes('bit convers') || lower.includes('bit conversion') || lower.includes('decimal to binary') || lower.includes('binary to decimal') || lower.includes('hex to binary') || lower.includes('binary to hex') || lower.includes('bitwise') || lower.includes('bit manipulation') || lower.includes('two\'s complement') || lower.includes('2\'s complement') || lower.includes('bit shift') || lower.includes('xor trick') || lower === 'binary' || lower === 'bitwise' || lower.includes('convert to binary') || lower.includes('binary number');

  if (isBitQuery) {
    return {
      text: `### 0️⃣1️⃣ Binary Values & Bit Conversions: Complete Master Guide

At the lowest physical level, computer hardware runs on electrical voltage states: **\`0\` (Low / 0V)** and **\`1\` (High / 3.3V or 5V)**. Every number, string, and pointer in memory is represented in **Base-2 (Binary)**!

---

#### 📐 1. How Bit Conversions Work (Step-by-Step):

##### A. Decimal to Binary (Continuous Division by 2)
To convert a decimal integer $N$ to binary, divide by $2$ repeatedly and record the remainders from bottom-to-top:
* **Example: Convert Decimal $25$ to Binary:**
  * $25 \\div 2 = 12 \\text{ remainder } \\mathbf{1}$ (Least Significant Bit - LSB)
  * $12 \\div 2 = 6 \\text{ remainder } \\mathbf{0}$
  * $6 \\div 2 = 3 \\text{ remainder } \\mathbf{0}$
  * $3 \\div 2 = 1 \\text{ remainder } \\mathbf{1}$
  * $1 \\div 2 = 0 \\text{ remainder } \\mathbf{1}$ (Most Significant Bit - MSB)
* Reading remainders from MSB to LSB: $25_{10} = \\mathbf{11001_2}$!

##### B. Binary to Decimal (Positional Weight Expansion)
Each binary digit has a positional weight of $2^i$:
$$N_{10} = \\sum_{i=0}^{k-1} b_i \\times 2^i$$
* **Example: Convert Binary $11010_2$ to Decimal:**
  $$(1 \\times 2^4) + (1 \\times 2^3) + (0 \\times 2^2) + (1 \\times 2^1) + (0 \\times 2^0)$$
  $$= 16 + 8 + 0 + 2 + 0 = \\mathbf{26_{10}}$$

##### C. Hexadecimal & Octal Conversions (Fast Nibble Grouping)
* **Binary to Hex:** Group bits into **4-bit nibbles** from right to left:
  * $11011110_2 = [1101]_2 [1110]_2 = \\mathbf{0xDE}$
* **Binary to Octal:** Group bits into **3-bit clusters**:
  * $101110_2 = [101]_2 [110]_2 = \\mathbf{56_8}$

---

#### ⚙️ 2. Core Bitwise Operators Cheat Sheet:
| Operator | Name | Syntax | Description & Truth Table | Example ($a=5=0101_2, b=3=0011_2$) |
|---|---|---|---|---|
| **AND** | Bitwise AND | \`a & b\` | \`1\` only if both bits are \`1\` | \`5 & 3 = 1\` (\`0001_2\`) |
| **OR** | Bitwise OR | \`a \\| b\` | \`1\` if at least one bit is \`1\` | \`5 \\| 3 = 7\` (\`0111_2\`) |
| **XOR** | Bitwise XOR | \`a ^ b\` | \`1\` if bits are strictly different | \`5 ^ 3 = 6\` (\`0110_2\`) |
| **NOT** | Bitwise Invert | \`~a\` | Flips all \`0\`s to \`1\`s and \`1\`s to \`0\`s | \`~5 = -6\` (in Two's complement) |
| **Left Shift** | Shift Left | \`a << k\` | Multiplies by $2^k$ (shifts bits left) | \`5 << 1 = 10\` (\`1010_2\`) |
| **Right Shift** | Shift Right | \`a >> k\` | Divides by $2^k$ (shifts bits right) | \`5 >> 1 = 2\` (\`0010_2\`) |

---

#### 🔢 3. Two's Complement (How Computers Store Negative Numbers):
To store negative integers (like $-5$) in standard signed integers:
1. Write the positive number in binary: $5_{10} = 00000101_2$ (8-bit)
2. Invert all bits (One's complement): $\\sim 5 = 11111010_2$
3. Add $1$: $11111010_2 + 1 = \\mathbf{11111011_2} = -5_{10}$!
* **Formula:** $-x = (\\sim x) + 1$

---

#### 🚀 4. Top 5 Bit Manipulation Hacks for LeetCode / Coding Interviews:
1. **Check if a number is a power of 2:**
   \`\`\`cpp
   bool isPowerOfTwo(int n) {
       return n > 0 && (n & (n - 1)) == 0;
   }
   \`\`\`
2. **Clear the lowest set bit:** \`n = n & (n - 1)\` (Counts set bits in $O(\\text{bits})$ time — *Brian Kernighan's Algorithm*).
3. **Isolate the lowest set bit:** \`int lowestSet = n & (-n);\`
4. **Find the single unique number in an array with duplicates:**
   XORing any number with itself cancels out ($x \\oplus x = 0$):
   \`\`\`cpp
   int singleNumber = 0;
   for (int x : nums) singleNumber ^= x;
   \`\`\`
5. **Check if integer is Odd or Even:** \`(n & 1) == 1\` (Odd) vs \`(n & 1) == 0\` (Even). Instant $O(1)$ without slow modulo!`,
      sources: ['AlgoFlow Digital Logic & Bitwise Engine', 'Computer Systems Architecture', 'LeetCode Bit Manipulation Patterns']
    };
  }

  // ── 00D. WHY DYNAMIC PROGRAMMING ("why dynamic proggramming", "why dp", "what is dp") ──
  const isWhyDpQuery = lower.includes('why dynamic prog') || lower.includes('why dynamic program') || lower.includes('why dp') || lower.includes('why use dp') || lower.includes('what is dynamic prog') || lower.includes('what is dp') || lower.includes('dp intuition') || lower.includes('when to use dp') || lower.includes('memoization vs tabulation');

  if (isWhyDpQuery) {
    return {
      text: `### 📈 Why Dynamic Programming (DP)? The Definitive Intuition

**Dynamic Programming** is an algorithmic optimization paradigm designed to solve complex problems by breaking them down into simpler subproblems, **solving each subproblem just ONCE**, and storing the answer so we never recompute it!

The classic quote by mathematician Richard Bellman captures it best:
> *"Those who cannot remember the past are condemned to repeat it."*

---

#### ⚡ 1. The Exponential Explosion Problem (Why Brute Force Fails):
Consider computing the $n$-th Fibonacci number: $F(n) = F(n-1) + F(n-2)$:
* With naive recursion:
  * To calculate $F(5)$, it computes $F(4)$ and $F(3)$.
  * To calculate $F(4)$, it computes $F(3)$ and $F(2)$.
  * Notice $F(3)$ is calculated **twice**!
  * For $F(50)$, naive recursion executes over **$2^{50} \\approx 1,125,899,906,842,624$ calls** (takes days/weeks to finish)!
* With Dynamic Programming:
  * We calculate each $F(i)$ once and save it in a table or array.
  * For $F(50)$, it takes exactly **50 operations** ($O(N)$ linear time) and finishes in under **0.001 milliseconds**!

---

#### 🔑 2. The 2 Mandatory Conditions to Apply DP:
You can **ONLY** apply Dynamic Programming if the problem satisfies both:
1. **Overlapping Subproblems:**
   The recursion tree re-visits the exact same subproblem states over and over again (e.g., Fibonacci, Grid Paths, Knapsack).
2. **Optimal Substructure:**
   The optimal solution to the overall problem can be constructed from optimal solutions to its subproblems.
   * *Example (Shortest Path):* If shortest path $A \\rightarrow C$ passes through $B$, then the path $A \\rightarrow B$ must also be the shortest path from $A$ to $B$.

---

#### 📊 3. Memoization (Top-Down) vs Tabulation (Bottom-Up):
| Feature | Memoization (Top-Down) | Tabulation (Bottom-Up) |
|---|---|---|
| **Approach** | Starts at original problem, recurses down | Starts at base cases ($0, 1$), builds up |
| **Mechanic** | Recursion + Cache (Array / Hash Map) | Iterative loops + DP Table |
| **Call Stack** | Uses recursion stack (Risk of Stack Overflow) | Zero recursion (100% stack-safe) |
| **Subproblems Solved** | Only solves subproblems actually needed | Solves all subproblems systematically |
| **Space Optimization** | Harder to optimize space | Often optimizable to $O(1)$ or $O(W)$ space |

---

#### 🧭 4. When to Use DP vs Greedy vs Divide & Conquer:
* **Dynamic Programming:** When subproblems **overlap** and decisions affect future choices (e.g. 0/1 Knapsack, Edit Distance).
* **Greedy:** When making the locally optimal choice right now guarantees the global optimum (e.g. Fractional Knapsack, Dijkstra).
* **Divide & Conquer:** When subproblems do **NOT overlap** (e.g. Merge Sort, Quick Sort divide independent array halves).

---

#### 🏆 5. The Top 5 DP Patterns Every Software Engineer Must Know:
1. **0/1 Knapsack & Subset Sum:** Pick or skip items with bounded capacity ($DP[i][w]$).
2. **Longest Common Subsequence (LCS) & Edit Distance:** String matching, Git diff algorithms, DNA sequencing.
3. **Longest Increasing Subsequence (LIS):** Array sequencing in $O(N \\log N)$ using patience sorting.
4. **Grid Matrix DP:** Unique Paths, Minimum Path Sum in 2D grids.
5. **Interval DP:** Matrix Chain Multiplication, Burst Balloons.`,
      sources: ['AlgoFlow Dynamic Programming Engine', 'Bellman Optimization Theory', 'LeetCode DP Master Patterns']
    };
  }

  // ── 00E. OPERATING SYSTEMS ("any idea about os", "what is os", "os concepts") ──
  const isOsQuery = lower.includes('about os') || lower.includes('idea about os') || lower.includes('what is os') || lower.includes('operating system') || lower.includes('operating systems') || lower.includes('process vs thread') || lower.includes('deadlock') || lower.includes('virtual memory') || lower.includes('paging in os') || lower.includes('semaphore') || lower.includes('cpu scheduling') || lower === 'os';

  if (isOsQuery) {
    return {
      text: `### 💻 Operating Systems (OS): Complete Engineering Overview

An **Operating System (OS)** is the foundational system software that acts as an intermediary between computer hardware (CPU, Memory, Disks, Network) and user applications. It manages hardware resources and provides a secure, abstracted runtime environment.

---

#### 🏛️ The "Big 5" Core OS Concepts Asked in Every Tech Interview:

##### 1. Process vs Thread:
* **Process:** An independent program in execution. Has its own isolated virtual address space (**Code, Data, Heap, Stack**).
  * *Context Switch:* Heavyweight (flushes CPU cache, page tables, TLB).
  * *IPC:* Communication requires Inter-Process Communication (Pipes, Sockets, Shared Memory).
* **Thread ("Lightweight Process"):** The smallest unit of execution dispatched by the CPU.
  * Threads inside the same process **share Code, Data, and Heap**, but each has its **own independent Program Counter (PC) and Stack**.
  * *Context Switch:* Fast and lightweight.

##### 2. Deadlocks & The 4 Coffman Conditions:
A **Deadlock** is a permanent freeze state where a set of processes are blocked because each is holding a resource and waiting for another resource held by another process!
A deadlock occurs **if and only if all 4 conditions hold simultaneously**:
1. **Mutual Exclusion:** Resources cannot be shared (only 1 process holds a resource at a time).
2. **Hold and Wait:** A process holds $\\ge 1$ resource while requesting another.
3. **No Preemption:** Resources cannot be forcibly seized; only released voluntarily.
4. **Circular Wait:** Process $P_0$ waits for $P_1$, which waits for $P_2$, $\\dots$, which waits for $P_0$.
* *Deadlock Avoidance:* **Banker's Algorithm** (safeguards system state before granting resources).

##### 3. Virtual Memory & Paging:
* **Virtual Memory:** Provides each process the illusion of a vast, contiguous address space, even if physical RAM is fragmented or small.
* **Paging:** Virtual memory is divided into fixed-size blocks called **Pages** (typically 4 KB); physical RAM is divided into **Frames**.
* **MMU (Memory Management Unit):** Hardware chip that translates Virtual Addresses to Physical Addresses via the **Page Table**.
* **Page Fault:** Occurs when a program accesses a page not currently in physical RAM. The OS pauses the process, fetches the page from swap disk into RAM, updates the page table, and resumes execution.
* **Page Replacement Algorithms:** FIFO, **LRU (Least Recently Used)**, Optimal (Belady's Min).

##### 4. Concurrency, Race Conditions & Semaphores:
* **Race Condition:** Unsynchronized simultaneous access to shared memory leads to non-deterministic, corrupted data.
* **Critical Section:** The block of code that accesses shared resources.
* **Mutex (Mutual Exclusion):** A locking mechanism with ownership. Only the thread that locked the mutex can unlock it.
* **Semaphore:** A signaling counter mechanism:
  * \`wait() / P()\`: Decrements counter; blocks if $\\le 0$.
  * \`signal() / V()\`: Increments counter; unblocks waiting threads.
  * *Binary Semaphore:* Counter is 0 or 1 (acts like a mutex without strict thread ownership).
  * *Counting Semaphore:* Manages a finite pool of resources (e.g. max 10 DB connections).

##### 5. CPU Scheduling Algorithms:
* **FCFS (First-Come, First-Served):** Non-preemptive, suffers from the Convoy Effect (short jobs wait behind giant jobs).
* **SJF (Shortest Job First):** Minimizes average waiting time, but can starve long processes.
* **Round Robin (RR):** Preemptive scheduling using a fixed **Time Quantum**. Fair and responsive for interactive multi-tasking systems.
* **Multi-Level Feedback Queue (MLFQ):** Modern OS standard (used in Linux/Windows) that dynamically adjusts priority based on CPU vs I/O burst history.`,
      sources: ['Operating Systems Principles (Silberschatz/Galvin)', 'Linux Kernel Architecture', 'Core CS Interview Guide']
    };
  }

  // ── 00F. POINTERS & MEMORY ("what are pointers", "pointers in c", "stack vs heap") ──
  const isPointerQuery = lower.includes('what are pointer') || lower.includes('what is a pointer') || lower.includes('what is pointer') || lower.includes('pointers') || lower.includes('pointer arithmetic') || lower.includes('dangling pointer') || lower.includes('null pointer') || lower.includes('dereference') || lower.includes('address-of') || lower.includes('stack vs heap') || lower === 'pointer' || lower === 'pointers';

  if (isPointerQuery) {
    return {
      text: `### 🎯 Pointers & Memory Management: Complete Master Guide

In languages like **C and C++**, a **Pointer** is a variable that stores the **physical memory address** of another variable in RAM.

---

#### 💡 1. The Core Mental Model:
Think of your computer's RAM as a giant street with billions of houses, where each house has a **Street Address** (e.g., \`0x7ffd5e2b8\`) and holds some **Furniture/Data**:
* Normal variable: \`int score = 95;\` $\\rightarrow$ The house contents are \`95\`.
* Pointer variable: \`int *ptr = &score;\` $\\rightarrow$ \`ptr\` does not hold \`95\`; it holds the **house address** \`0x7ffd5e2b8\`!

---

#### 📐 2. The Two Fundamental Operators:
1. **Address-Of Operator (\`&\`):** Gets the memory address where a variable is stored.
2. **Dereference Operator (\`*\`):** Accesses or modifies the actual value living at the address stored in the pointer.

\`\`\`c
#include <stdio.h>

int main() {
    int x = 42;
    int *ptr = &x;     // ptr points to x's memory address

    printf("Value of x: %d\\n", x);        // 42
    printf("Address of x: %p\\n", &x);      // e.g. 0x7ffd5e
    printf("Value of ptr: %p\\n", ptr);     // 0x7ffd5e (same address!)
    printf("Value at *ptr: %d\\n", *ptr);   // 42 (dereferencing)

    *ptr = 99; // Modifies the value of x directly in RAM!
    printf("New value of x: %d\\n", x);    // 99
    return 0;
}
\`\`\`

---

#### ⚡ 3. Pointer Arithmetic (It's Not Simple Addition!):
When you increment a pointer with \`ptr++\`, it does **NOT** add 1 byte! It jumps forward by the exact size of the data type:
$$\\text{New Address} = \\text{Base Address} + (k \\times \\operatorname{sizeof}(\\text{DataType}))$$
* For \`int* ptr\` ($4$ bytes): \`ptr + 1\` jumps forward **4 bytes** in RAM.
* For \`double* ptr\` ($8$ bytes): \`ptr + 1\` jumps forward **8 bytes** in RAM.

---

#### 📦 4. Stack vs Heap Memory:
* **Stack Memory:**
  * Fast, LIFO (Last-In-First-Out) allocation.
  * Local variables live here. Automatically allocated when entering a function and cleaned up when leaving.
* **Heap Memory:**
  * Large, dynamically allocated pool of memory.
  * Allocated using \`malloc()\` / \`calloc()\` in C, or \`new\` in C++.
  * **Must be manually freed** with \`free()\` or \`delete\`! If you don't, you create a **Memory Leak**.

---

#### ⚠️ 5. The 5 Fatal Pointer Pitfalls (And How to Avoid Them):
1. **Null Pointer Dereference:** Accessing \`*ptr\` when \`ptr == NULL\` $\rightarrow$ Instant **Segmentation Fault (Crash)**! *Always check \`if (ptr != NULL)\` before dereferencing.*
2. **Dangling Pointer:** A pointer pointing to memory that has already been freed with \`free(ptr)\`. *Fix: Set \`ptr = NULL;\` immediately after freeing.*
3. **Memory Leak:** Losing the pointer reference to heap-allocated memory without freeing it first.
4. **Wild / Uninitialized Pointer:** Declaring \`int *p;\` without initializing it. It points to a random, unpredictable memory location.
5. **Buffer Overflow:** Accessing \`arr[15]\` when \`arr\` was only allocated for 10 elements.

---

#### 🛡️ 6. Modern C++ Smart Pointers (Never Write \`delete\` Again):
* \`std::unique_ptr<T>\`: Exclusive ownership. Cannot be copied, only moved. Automatically freed when out of scope.
* \`std::shared_ptr<T>\`: Shared reference-counted ownership. Memory is freed when the last pointer disappears.
* \`std::weak_ptr<T>\`: Non-owning observer that breaks circular reference memory leaks.`,
      sources: ['AlgoFlow Memory & Pointer Architecture', 'C/C++ Memory Management Specification', 'Computer Systems: A Programmer\'s Perspective']
    };
  }

  // ── 00G. EXCEPTION HANDLING ("exception handling", "try catch", "throw") ──
  const isExceptionQuery = lower.includes('exception handling') || lower.includes('try catch') || lower.includes('try-catch') || lower.includes('try catch finally') || lower.includes('checked vs unchecked') || lower.includes('throw vs throws') || lower === 'exceptions' || lower === 'exception';

  if (isExceptionQuery) {
    return {
      text: `### 🛡️ Exception Handling: Architecture, Patterns & Best Practices

**Exception Handling** is a software engineering mechanism designed to intercept and recover from runtime anomalies (e.g. division by zero, null pointer dereference, network disconnection, file not found) **without terminating or crashing the program**!

---

#### 🔄 1. The Core Anatomy (\`try-catch-finally\`):
1. **\`try\` Block:** Contains the risky code that might throw an unexpected runtime error.
2. **\`catch\` Block:** Intercepts, logs, and recovers from specific error types.
3. **\`finally\` Block:** **Always executes unconditionally**, whether an exception was thrown, caught, or not! Perfect for releasing resources (closing database connections, network sockets, file streams).
4. **\`throw\` Keyword:** Explicitly triggers an exception when validation fails.
5. **\`throws\` Clause (Java):** Declares on a method signature that this method might pass an exception up the call stack.

\`\`\`java
public double divideAndLog(int numerator, int denominator) {
    try {
        if (denominator == 0) {
            throw new ArithmeticException("Cannot divide by zero!");
        }
        return (double) numerator / denominator;
    } catch (ArithmeticException ex) {
        System.err.println("Handling Error: " + ex.getMessage());
        return 0.0; // Graceful recovery
    } finally {
        System.out.println("Cleanup completed: operation concluded.");
    }
}
\`\`\`

---

#### ⚖️ 2. Checked vs Unchecked Exceptions (Core Java / OOP Concept):
| Feature | Checked Exceptions | Unchecked Exceptions (Runtime) |
|---|---|---|
| **Class Hierarchy** | Inherit from \`java.lang.Exception\` (except \`RuntimeException\`) | Inherit from \`java.lang.RuntimeException\` or \`Error\` |
| **Compiler Check** | **Enforced at compile-time.** You MUST \`try-catch\` or declare \`throws\` | **Not checked at compile-time.** Compiler allows compilation |
| **Root Cause** | External system failures outside programmer's direct control | Logic and programming bugs |
| **Examples** | \`IOException\`, \`SQLException\`, \`ClassNotFoundException\` | \`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`ArithmeticException\` |

---

#### 💡 3. Language Variations:
* **Java:** Strict Checked vs Unchecked distinction; \`try-with-resources\` automatically closes \`AutoCloseable\` objects.
* **C++:** Uses \`try / catch / throw\`. Follows **RAII (Resource Acquisition Is Initialization)**; stack unwinding automatically calls destructors for local objects.
* **Python:** Uses \`try / except / else / finally\` block structure with \`raise\`.
* **Go & Rust:** Forego traditional \`try/catch\` exceptions in favor of explicit return error values:
  * Go returns \`(result, err)\`.
  * Rust uses the \`Result<T, E>\` enum with pattern matching and the \`?\` error propagation operator.

---

#### 🏆 4. Top Production Best Practices:
1. ❌ **Never Swallow Exceptions:** Avoid empty \`catch (Exception e) {}\`. At minimum, log the stack trace!
2. 🎯 **Catch Specific Exceptions First:** Always catch subclasses before base classes (e.g. catch \`FileNotFoundException\` before \`IOException\`).
3. 🧹 **Use Modern Auto-Closing:** Use Try-With-Resources (Java/C#) or Context Managers (Python \`with\`) to prevent memory/file handle leaks.
4. 🏷️ **Create Custom Domain Exceptions:** Subclass standard exceptions (e.g., \`UserNotFoundException\`, \`PaymentFailedException\`) for clean business error handling.`,
      sources: ['AlgoFlow Language & Systems Engine', 'Clean Code Architecture', 'OOP Design Principles']
    };
  }

  // ── 00H. DIFFERENCE BETWEEN HASHING ONES ("difference btw hashing ones", "chaining vs probing") ──
  const isHashDiffQuery = lower.includes('difference btw hashing') || lower.includes('difference between hashing') || lower.includes('difference between hash') || lower.includes('chaining vs probing') || lower.includes('linear probing vs quadratic probing') || lower.includes('hashing techniques') || lower.includes('compare hashing') || (lower.includes('difference') && lower.includes('hash'));

  if (isHashDiffQuery) {
    return {
      text: `### ⚡ Difference Between Collision Resolution Hashing Techniques

When multiple keys hash to the same bucket index ($h(k_1) = h(k_2)$), a **collision** occurs. Here is the complete engineering comparison of the primary collision resolution techniques:

---

#### 📊 Comprehensive Comparison Matrix:

| Feature | Separate Chaining (Closed Addressing) | Linear Probing (Open Addressing) | Quadratic Probing (Open Addressing) | Double Hashing (Open Addressing) |
|---|---|---|---|---|
| **Storage Model** | Keys stored in external **Linked Lists** attached to slots | Keys stored **directly in table array slots** | Keys stored **directly in table array slots** | Keys stored **directly in table array slots** |
| **Probing Equation** | Node pointer traversal: \`curr = curr.next\` | $h(k, i) = (h(k) + i) \\bmod M$ | $h(k, i) = (h(k) + i^2) \\bmod M$ | $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod M$ |
| **Step Jump Size** | Follows next pointer | Fixed constant step: $+1$ | Quadratic step: $+1, +4, +9, \\dots$ | Variable step based on key: $+h_2(k)$ |
| **Primary Clustering?** | ❌ **No** (chains remain isolated) | ⚠️ **Severe** (long continuous blocks form) | ❌ **Eliminated** | ❌ **Eliminated** |
| **Secondary Clustering?** | ❌ **No** | ⚠️ **Moderate** | ⚠️ **Minor** (keys with same hash trace same path) | ❌ **Eliminated** (secondary hash diversifies paths) |
| **Max Load Factor ($\\alpha$)** | **Can exceed $1.0$** (e.g. $\\alpha = 2.0$ means avg 2 items/chain) | Must stay strictly **$< 0.70$** | Must stay strictly **$< 0.50$** | Must stay strictly **$< 0.70$** |
| **CPU Cache Locality** | ❌ **Poor** (nodes scattered across heap) | ⚡ **Outstanding** (contiguous array memory) | ⚡ **Very Good** | ⚡ **Very Good** |
| **Memory Overhead** | **High** (8-byte pointer per node) | **Zero** extra pointers | **Zero** extra pointers | **Zero** extra pointers |
| **Deletion Complexity** | **Trivial** (standard linked list delete) | **Requires \`DELETED\` Tombstone** | **Requires \`DELETED\` Tombstone** | **Requires \`DELETED\` Tombstone** |

---

#### 🔍 Deep Dive into Each Technique:

1. **Separate Chaining:**
   * Each slot in the table array is the head of a linked list.
   * *Best when:* Table size cannot be predicted in advance, or memory allocation is flexible.
   * *Java 8 HashMap Optimization:* When a chain exceeds 8 nodes and table size $\\ge 64$, Java converts the linked list into a **Red-Black Tree** to guarantee $O(\\log N)$ worst-case lookup!

2. **Linear Probing:**
   * Searches sequentially: $(h + 1) \\bmod M, (h + 2) \\bmod M, \\dots$
   * *Best when:* Table has plenty of empty capacity and maximum CPU cache hardware efficiency is needed.
   * *Flaw (Primary Clustering):* Adjacent occupied cells coalesce into massive contiguous blocks, degrading performance to $O(N)$.

3. **Quadratic Probing:**
   * Jumps quadratically: $(h + 1^2) \\bmod M, (h + 2^2) \\bmod M, (h + 3^2) \\bmod M, \\dots$
   * *Best when:* You want open addressing without the severe primary clustering of linear probing.
   * *Requirement:* Table size $M$ must be a **Prime Number** $> 2$ and load factor $\\alpha \\le 0.5$ to guarantee finding empty slots.

4. **Double Hashing:**
   * Uses two independent hash functions: step size $= h_2(k)$.
   * *Best when:* You need open addressing with the absolute minimum clustering.
   * *Requirement:* $h_2(k)$ must never evaluate to $0$, and must be coprime to table size $M$.`,
      sources: ['AlgoFlow Hash Engine', 'Hashing & Collision Resolution Specifications', 'Advanced Data Structures (CLRS)']
    };
  }

  // ── 00I. FIX MY CODE / DEBUGGING ASSISTANT ("fix my code", "debug my code") ──
  const isFixCodeQuery = lower.includes('fix my code') || lower.includes('debug my code') || lower.includes('why is my code not working') || lower.includes('fix code') || lower.includes('debug code') || lower.includes('find the bug') || lower.includes('code error') || lower.includes('help fix this code') || lower === 'fix my code';

  if (isFixCodeQuery) {
    if (activeCode && activeCode.trim().length > 10) {
      const lines = activeCode.split('\n');
      const hasInfiniteLoopRisk = activeCode.includes('while (true)') || activeCode.includes('while(true)') || (activeCode.includes('while') && !activeCode.includes('++') && !activeCode.includes('--') && !activeCode.includes('+='));
      const hasOffByOneRisk = activeCode.includes('<= arr.length') || activeCode.includes('<= sizeof') || activeCode.includes('<= n');
      const hasMidOverflow = activeCode.includes('(low + high) / 2') || activeCode.includes('(l + r) / 2') || activeCode.includes('(start + end) / 2');
      const hasNullCheckRisk = (activeCode.includes('->') || activeCode.includes('.next')) && !activeCode.includes('!= null') && !activeCode.includes('!= NULL') && !activeCode.includes('!= nullptr');

      let diagnosticNotes = [];
      if (hasMidOverflow) {
        diagnosticNotes.push('⚠️ **Integer Overflow in Midpoint Calculation:** Found `(low + high) / 2`. In large inputs, this can exceed $2^{31}-1$. Replace with `low + (high - low) / 2`.');
      }
      if (hasOffByOneRisk) {
        diagnosticNotes.push('⚠️ **Potential Off-by-One Array Bound:** Check loops using `<= length` or `<= n`. In 0-indexed arrays, accessing `arr[length]` causes an out-of-bounds memory crash.');
      }
      if (hasNullCheckRisk) {
        diagnosticNotes.push('⚠️ **Potential Null Pointer Dereference:** Pointer / reference chain (`.next` or `->`) accessed without explicit null check guard.');
      }
      if (hasInfiniteLoopRisk) {
        diagnosticNotes.push('⚠️ **Infinite Loop Risk:** Loop detected without clear step increment/decrement variable modification inside loop body.');
      }

      return {
        text: `### 🐞 AlgoFlow Code Diagnostic & Debugger

I inspected your currently active **${activeLang}** code (${lines.length} lines):

---

#### 🔍 Static Code Analysis Findings:
${diagnosticNotes.length > 0 ? diagnosticNotes.join('\n\n') : '✅ **No obvious syntax crashes detected!** The structure and braces appear balanced.'}

---

#### 🛠️ Recommended 5-Step Bug Fix Protocol:
1. **Verify Boundary Conditions:** Test $N=0$ (empty input), $N=1$ (single element), and duplicate values.
2. **Step Through in Debugger:** Open the **Step-by-Step Execution Mode** on the top toolbar to trace variable states line-by-line.
3. **Print Intermediate States:** Log variables right before and after loop iterations.
4. **Recursion Base Case Check:** Ensure every recursive path reaches a terminating \`return\` statement.

*Need line-by-line refactoring? Tell me the specific error message or expected vs actual output!* 💻`,
        sources: ['AlgoFlow Static Code Analyzer', 'Code Debugging Engine']
      };
    }

    return {
      text: `### 🐞 AlgoFlow Code Debugging Assistant

I'm ready to find and fix the bugs in your code!

#### 📋 How to Fix Any Bug in 5 Minutes:
1. **Paste Your Code Right Here in Chat:** Include the snippet you're trying to run and what language it's in (C++, Java, Python, JS, etc.).
2. **Describe the Symptom:**
   * Is it a **Compilation Error** (e.g. *cannot find symbol*, *syntax error*)?
   * Is it a **Runtime Crash** (e.g. *Segmentation Fault*, *NullPointerException*, *StackOverflowError*)?
   * Is it a **Logical Bug** (e.g. *giving wrong output for a test case*, *infinite loop*)?
3. **Specify Inputs & Expected Output:** What input causes the failure, and what should it output?

Paste your code snippet below and I'll break down the exact failing line, root cause, and the corrected version! 🚀`,
      sources: ['AlgoFlow Code Debugging Assistant']
    };
  }

  // ── 00J. OBJECT-ORIENTED PROGRAMMING (OOP) ("what is oop", "4 pillars of oop") ──
  const isOopQuery = lower.includes('what is oop') || lower.includes('4 pillars of oop') || lower.includes('four pillars of oop') || lower.includes('pillars of oop') || lower.includes('solid principles') || lower === 'oop' || lower === 'object oriented';

  if (isOopQuery) {
    return {
      text: `### 🏛️ Object-Oriented Programming (OOP): The 4 Pillars & SOLID

**Object-Oriented Programming (OOP)** is a paradigm that models real-world software components as discrete, stateful **Objects** instantiated from blueprint **Classes**.

---

#### 🧱 The 4 Pillars of OOP:

1. **Encapsulation (Data Hiding):**
   * Bundles data (attributes) and methods that operate on that data inside a class.
   * Direct variable access is restricted via \`private\` visibility, exposed safely through \`public\` getters and setters.
   * *Benefit:* Protects internal integrity and prevents external accidental tampering.

2. **Abstraction (Hiding Complexity):**
   * Exposes only essential interface contracts to the outside world while concealing messy implementation mechanics.
   * Implemented using **Abstract Classes** and **Interfaces**.
   * *Real-life Analogy:* When driving a car, you press the gas pedal (Interface); you don't need to know fuel injection PSI mechanics (Hidden Implementation).

3. **Inheritance (Code Reusability):**
   * Allows a child class (subclass) to inherit fields and methods from a parent class (superclass), establishing an **"is-a"** relationship.
   * *Example:* \`class Dog extends Animal\`.

4. **Polymorphism ("Many Forms"):**
   * **Compile-Time (Static / Overloading):** Multiple methods with the same name but different parameter signatures within the same class.
   * **Runtime (Dynamic / Overriding):** Subclass provides a specific implementation of a method already defined in its parent class. Resolved at runtime using Virtual Method Tables (**vtable**).

---

#### 📐 The SOLID Principles Cheat Sheet:
* **S - Single Responsibility Principle:** A class should have one, and only one, reason to change.
* **O - Open/Closed Principle:** Software entities should be open for extension, but closed for modification.
* **L - Liskov Substitution Principle:** Subclasses must be substitutable for their base classes without breaking correctness.
* **I - Interface Segregation Principle:** Clients should never be forced to depend on interfaces they do not use.
* **D - Dependency Inversion Principle:** Depend upon abstractions, not concrete implementations.`,
      sources: ['OOP Software Engineering Design', 'Clean Code Architecture', 'Design Patterns (Gang of Four)']
    };
  }

  // ── 00K. DATABASE MANAGEMENT SYSTEMS (DBMS & SQL) ("what is dbms", "acid properties") ──
  const isDbmsQuery = lower.includes('dbms') || lower.includes('what is dbms') || lower.includes('acid properties') || lower.includes('normalization') || lower.includes('sql join') || lower.includes('1nf') || lower.includes('database index') || lower === 'sql';

  if (isDbmsQuery) {
    return {
      text: `### 🗄️ Database Management Systems (DBMS) & SQL Master Guide

A **Database Management System (DBMS)** is specialized software that enables efficient, concurrent, and fault-tolerant storage, querying, and updating of structured data.

---

#### 🛡️ 1. ACID Properties (Transactional Reliability):
A transaction is a single logical unit of database work that must satisfy **ACID**:
* **A - Atomicity:** "All or Nothing." If any statement in a transaction fails, the entire transaction is rolled back.
* **C - Consistency:** Transactions transform the database from one valid state to another, strictly obeying all integrity constraints and foreign keys.
* **I - Isolation:** Concurrent transactions execute independently without interfering with each other (Isolation levels: Read Uncommitted $\\rightarrow$ Read Committed $\\rightarrow$ Repeatable Read $\\rightarrow$ Serializable).
* **D - Durability:** Once committed, changes are permanently written to non-volatile disk/WAL and survive power outages and crashes.

---

#### 📐 2. Database Normalization (Eliminating Redundancy):
* **1NF (First Normal Form):** Every table cell must contain a single atomic value (no multi-valued lists or repeating groups).
* **2NF (Second Normal Form):** Must be in 1NF **AND** all non-key columns must be fully dependent on the primary key (no partial dependencies on composite keys).
* **3NF (Third Normal Form):** Must be in 2NF **AND** no transitive dependencies (non-key columns cannot depend on other non-key columns).
* **BCNF (Boyce-Codd Normal Form):** A stricter version of 3NF where every determinant must be a candidate key.

---

#### 🔗 3. SQL JOIN Types:
* **INNER JOIN:** Returns records with matching values in both tables.
* **LEFT (OUTER) JOIN:** Returns all records from the left table, plus matched records from the right table (unmatched columns are \`NULL\`).
* **RIGHT (OUTER) JOIN:** Returns all records from the right table, plus matched records from the left.
* **FULL (OUTER) JOIN:** Returns all records when there is a match in either left or right table.`,
      sources: ['Database System Concepts (Silberschatz/Korth)', 'PostgreSQL / MySQL Architecture', 'Core CS Interview Guide']
    };
  }

  // ── 00L. COMPUTER NETWORKS ("computer networks", "osi model", "tcp vs udp") ──
  const isNetworksQuery = lower.includes('computer network') || lower.includes('networking') || lower.includes('osi model') || lower.includes('osi 7') || lower.includes('tcp vs udp') || lower.includes('three-way handshake') || lower.includes('3-way handshake') || lower.includes('dns lookup');

  if (isNetworksQuery) {
    return {
      text: `### 🌐 Computer Networks: OSI Model, TCP/IP & Core Protocols

Computer Networks provide the communication backbone that connects billions of digital devices across the Internet using standardized layered protocols.

---

#### 🏢 1. The OSI 7-Layer Model (Top-to-Bottom):
1. **Layer 7 - Application:** High-level protocols users interact with (**HTTP, HTTPS, DNS, FTP, SMTP, SSH**).
2. **Layer 6 - Presentation:** Data formatting, encryption, and compression (**TLS, SSL, JPEG, JSON**).
3. **Layer 5 - Session:** Manages connections, authentication, and sessions (**RPC, NetBIOS**).
4. **Layer 4 - Transport:** End-to-end communication, segmentation, flow control, and port addressing (**TCP, UDP**).
5. **Layer 3 - Network:** Logical IP addressing and packet routing across networks (**IP, ICMP, Routers**).
6. **Layer 2 - Data Link:** Framing, physical MAC addressing, and error detection on the local link (**Ethernet, Wi-Fi, Switches**).
7. **Layer 1 - Physical:** Raw electrical, optical, or radio bit transmission (**Fiber Optic Cables, CAT6, Radio Frequencies**).

---

#### ⚡ 2. TCP vs UDP (The Core Transport Protocol Duel):
| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
|---|---|---|
| **Connection** | Connection-oriented (Handshake required) | Connectionless (Fire-and-forget) |
| **Reliability** | Guaranteed delivery (Retransmissions) | Unreliable (Packets may be dropped) |
| **Ordering** | Strict packet order (Sequence numbers) | No order guarantees |
| **Header Size** | 20 to 60 bytes | 8 bytes (Ultra lightweight) |
| **Speed** | Slower (Overhead from ACKs and congestion window) | Blazing fast (Zero handshake delay) |
| **Use Cases** | Web (HTTP/HTTPS), Email, File Downloads | Multiplayer Gaming, Live Video Streaming, VoIP, DNS queries |

---

#### 🤝 3. The TCP 3-Way Handshake:
Before a TCP socket can send payload data, it synchronizes sequence numbers:
1. **SYN:** Client sends a \`SYN\` packet with an initial sequence number ($ISN_c$) to the server.
2. **SYN-ACK:** Server acknowledges with \`ACK = ISN_c + 1\` and sends its own \`SYN\` with $ISN_s$.
3. **ACK:** Client acknowledges with \`ACK = ISN_s + 1\`.
* Connection is now **ESTABLISHED** and bidirectional data flow begins!`,
      sources: ['Computer Networking: A Top-Down Approach (Kurose/Ross)', 'Internet Engineering Task Force (IETF)', 'Core CS Interview Guide']
    };
  }

  // ── 0A. DEDICATED: HASH TABLES & HASHING (What is Hash, Why Use, Formulas, Collisions) ──
  const isHashQuery = lower.includes('hash') || lower.includes('hashing') || lower.includes('linear probing') || lower.includes('quadratic probing') || lower.includes('separate chaining') || (globalDsType === 'HASH_TABLE' && (lower.includes('what') || lower.includes('explain') || lower.includes('how') || lower.includes('help') || lower.includes('understand') || lower.includes('concept') || lower.includes('why') || lower.includes('formula') || lower.includes('use')));

  if (isHashQuery) {
    // Specific: Hash Formula Request
    if (lower.includes('formula') || lower.includes('equation') || lower.includes('math')) {
      return {
        text: `### 📐 Hash Table Mathematical Formulas & Probing Equations

A **Hash Function** maps arbitrary keys into fixed table slot indices $[0 \\dots M-1]$:

---

#### 1. Division / Modulo Method (Standard Hash)
$$h(k) = k \\bmod M$$
* $k$ is the integer key, and $M$ is the **Table Size** (ideally a prime number not close to powers of 2).
* *Example:* For table size $M = 7$ and key $k = 22$:
  $$h(22) = 22 \\bmod 7 = 1 \\quad \\rightarrow \\text{placed at slot 1}$$

---

#### 2. Open Addressing: Linear Probing
When a collision occurs at initial index $h(k)$, probe sequentially:
$$h(k, i) = (h(k) + i) \\bmod M \\quad \\text{for } i = 0, 1, 2, \\dots, M-1$$
* *Step size:* Fixed step $+1$ on each collision.
* *Advantage:* Superior CPU cache performance due to contiguous array memory.

---

#### 3. Open Addressing: Quadratic Probing
Jumps by quadratic squares on each collision to prevent primary clustering:
$$h(k, i) = (h(k) + i^2) \\bmod M \\quad \\text{for } i = 0, 1, 2, \\dots, M-1$$
* *Probes:* $(h(k) + 1) \\bmod M$, $(h(k) + 4) \\bmod M$, $(h(k) + 9) \\bmod M, \\dots$

---

#### 4. Multiplication Method (Knuth's Golden Ratio)
$$h(k) = \\lfloor M \\times ((k \\times A) \\bmod 1) \\rfloor$$
* Constant $A = \\frac{\\sqrt{5} - 1}{2} \\approx 0.6180339887$ (The Golden Ratio).
* Works well for any table size $M$ (especially powers of 2).

---

#### 5. Folding Method
$$h(k) = (Chunk_1 + Chunk_2 + \\dots + Chunk_n) \\bmod M$$
* Key digits are divided into pairs or triplets, summed, and taken modulo table size.

---

#### 6. Load Factor ($\\alpha$) & Rehashing Threshold
$$\\alpha = \\frac{N}{M} = \\frac{\\text{Number of elements stored}}{\\text{Total capacity (slots)}}$$
* **Threshold Rule:** When $\\alpha > 0.70$ (70% full), performance degrades! The hash table automatically allocates a new table of size $\\approx 2M$ and **rehashes** all existing keys.`,
        sources: ['AlgoFlow Hash Engine', 'Hashing & Probing Specifications', 'Topic Info Data']
      };
    }

    // Specific: Why We Use Hash Tables
    if (lower.includes('why we use') || lower.includes('why use') || lower.includes('why do we use') || lower.includes('why is it used') || lower.includes('purpose') || lower.includes('advantage')) {
      return {
        text: `### 💡 Why Do We Use Hash Tables?

Hash Tables are arguably the **single most critical data structure** in real-world software engineering! Here is why:

---

#### ⚡ 1. Blazing Fast Average $O(1)$ Time Complexity
Compare search speeds across core data structures:
* **Array (Unsorted):** $O(N)$ linear search (must scan every item one-by-one).
* **Array (Sorted):** $O(\\log N)$ binary search (but insertion takes $O(N)$ to shift elements).
* **Linked List:** $O(N)$ pointer traversal.
* **Balanced BST (AVL / Red-Black):** $O(\\log N)$ tree traversal.
* **Hash Table:** **$O(1)$ Constant Time!** You jump straight to the exact bucket memory address in a single math operation.

---

#### 🔑 2. Key-Value Associative Mapping
Instead of accessing items only by sequential numbers (\`arr[0]\`, \`arr[1]\`), Hash Tables associate any key directly with a value:
* Username $\\rightarrow$ User Profile Object
* URL $\\rightarrow$ Cached Web Page / HTML
* Product ID $\\rightarrow$ Inventory Count

---

#### 🌍 3. Real-Life Production Systems That Rely on Hash Tables:
1. **In-Memory Caches (Redis / Memcached):** Sub-millisecond key-value lookups for web sessions.
2. **Database Hash Indexing:** PostgreSQL and MySQL memory tables use Hash Indexes for instantaneous primary key equality checks (\`WHERE id = '...' \`).
3. **Compilers & Interpreters:** Language symbol tables (mapping variable and function names to memory offsets in C++, Java, and Python).
4. **Built-in Language Primitives:** Python \`dict\`, JavaScript \`Object\` & \`Map\`, Java \`HashMap\`, C++ \`std::unordered_map\`.

---

#### ⚠️ 4. Trade-Offs (When NOT to Use):
* **No Sorting:** Elements are not ordered. If you need sorted traversals or range queries (\`find all users aged 20 to 30\`), use a **B+ Tree** or **AVL Tree** instead.
* **Worst-Case Degradation:** If poor hash functions cause excessive collisions, operations degrade to $O(N)$.`,
        sources: ['AlgoFlow Hash Engine', 'Real-World Systems Architecture', 'DSA Master Guide']
      };
    }

    // Default: Comprehensive Master Guide for "What is Hash"
    return {
      text: `### ⚡ Hash Tables & Hashing: Complete Concept & Architecture

A **Hash Table** (or Hash Map) is an associative data structure that stores key-value pairs. It provides **average $O(1)$ constant time** for search, insertion, and deletion!

---

#### 🎯 1. The Core Mental Model:
Imagine a massive library with 10,000 books:
* Without a hash table, you would have to walk down every aisle checking titles one-by-one ($O(N)$ search).
* With a **Hash Function**, you feed the book title into a formula, and it immediately outputs the exact shelf location: **"Aisle 4, Shelf 2"** ($O(1)$ instant access)!

---

#### 📐 2. The Core Formulas:
1. **Hash Function (Division Method):**
   $$index = key \\bmod TableSize$$
2. **Load Factor ($\\alpha$):**
   $$\\alpha = \\frac{N}{M} = \\frac{\\text{Total Keys (N)}}{\\text{Table Slots (M)}}$$
   *(When $\\alpha > 0.7$, double the table size and rehash to keep $O(1)$ performance!)*

---

#### 🛡️ 3. How Collisions are Handled:
When two distinct keys hash to the exact same index (e.g. $15 \\bmod 7 = 1$ and $22 \\bmod 7 = 1$):

1. **Separate Chaining (Closed Addressing):**
   * Each table slot holds the head of a **Linked List** (or Balanced BST in Java 8+).
   * All keys that collide into slot 1 are simply appended to the chain at index 1.
   * *Advantage:* Table never overflows; handles load factors $> 1.0$ gracefully.

2. **Open Addressing (Linear & Quadratic Probing):**
   * All elements are stored directly within the table array (no linked lists).
   * **Linear Probing:** If slot $h$ is taken, check $h+1, h+2, h+3, \\dots$
   * **Quadratic Probing:** Jumps non-linearly: $h+1^2, h+2^2, h+3^2, \\dots$ to eliminate contiguous clustering.
   * **Double Hashing:** Uses a secondary hash function to calculate custom jump offsets.

---

#### ⏱️ Time Complexities:
* **Search / Lookup:** Average: **$O(1)$** | Worst-case: **$O(N)$** (when all keys collide into one slot).
* **Insertion:** Average: **$O(1)$** | Worst-case: **$O(N)$**
* **Deletion:** Average: **$O(1)$** | Worst-case: **$O(N)$**

---

#### 🕹️ Try It in AlgoFlow Visualizer:
Head over to **General Data Structures Visualizer $\\rightarrow$ Hash Tables** on the top navigation bar to test **Linear Probing**, **Quadratic Probing**, and **Separate Chaining** live!`,
      sources: ['AlgoFlow Hash Engine', 'Hash Table Specification', 'Topic Info Data']
    };
  }

  // ── 0B. FORMULAS & EQUATIONS HANDLER (User asks for formula) ──────────────
  if (lower.includes('formula') || lower.includes('equation') || lower.includes('recurrence') || lower === 'formula?' || lower === 'formula') {
    if (targetTopic && TOPIC_INFO[targetTopic]) {
      const info = TOPIC_INFO[targetTopic];
      return {
        text: `### 📐 Mathematical Formula & Mechanics: ${info.title}

#### 📋 The Core Formula:
\`\`\`text
${info.formula}
\`\`\`

---

#### 🔢 Numerical Walkthrough & Step-by-Step Example:
${info.example}

---

#### 🎯 Key Engineering Takeaway:
> **${info.keyPoints}**`,
        sources: [`AlgoFlow Formula Engine: ${info.title}`, 'Topic Info Guide']
      };
    }

    if (currentTree === 'AVL') {
      return {
        text: `### 📐 AVL Tree Formulas & Equations

#### 1. Balance Factor (BF):
$$\\text{Balance Factor (BF)} = \\text{Height}(\\text{Left Subtree}) - \\text{Height}(\\text{Right Subtree})$$
* **Balanced Invariant:** $BF \\in \\{-1, 0, +1\\}$.
* **Triggers Rotation:** $BF > +1$ (Left-heavy) or $BF < -1$ (Right-heavy).

#### 2. Node Height Calculation:
$$\\text{Height}(node) = 1 + \\max(\\text{Height}(node.left), \\text{Height}(node.right))$$

#### 3. Maximum Height Invariant:
$$Height(N) \\approx 1.44 \\log_2(N + 2) - 0.328 = O(\\log N)$$`,
        sources: ['AlgoFlow AVL Engine', 'Tree Mathematical Foundations']
      };
    }

    // General Formula Cheat Sheet
    return {
      text: `### 📐 Core Data Structures & Algorithms Formulas Cheat Sheet

Here are the primary mathematical formulas across AlgoFlow Studio engines:

1. **⚡ Hash Tables (Division & Probing):**
   * Modulo Hash: $h(k) = k \\bmod M$
   * Linear Probing: $slot = (h(k) + i) \\bmod M$
   * Quadratic Probing: $slot = (h(k) + i^2) \\bmod M$
   * Load Factor: $\\alpha = N / M$ (Rehash when $\\alpha > 0.7$)

2. **🌲 AVL Tree (Balance Factor):**
   * $BF = Height(LeftSubtree) - Height(RightSubtree) \\in \\{-1, 0, +1\\}$

3. **🔍 Binary Search (Safe Midpoint):**
   * $mid = low + \\frac{high - low}{2}$ (Prevents 32-bit integer overflow)

4. **🗺️ Dijkstra's Algorithm (Edge Relaxation):**
   * $dist[v] = \\min(dist[v], dist[u] + weight(u, v))$

5. **📈 0/1 Knapsack Dynamic Programming Recurrence:**
   * $DP[i][w] = \\max(DP[i-1][w], DP[i-1][w - wt[i]] + val[i])$

Which specific topic's formula would you like to explore deeper? Ask me about any algorithm! ✨`,
      sources: ['AlgoFlow Mathematics & Formula Engine']
    };
  }

  // ── 0C. "WHY WE USE" & REAL-WORLD APPLICATIONS HANDLER ────────────────────
  if (lower.includes('why we use') || lower.includes('why use') || lower.includes('why do we use') || lower.includes('why is it used') || lower.includes('what is the use') || lower.includes('purpose') || lower.includes('real life') || lower.includes('real world') || lower.includes('advantage') || lower.includes('why should we use')) {
    if (targetTopic && TOPIC_INFO[targetTopic]) {
      const info = TOPIC_INFO[targetTopic];
      return {
        text: `### 💡 Why Do We Use ${info.title}?

**Overview:** ${info.summary}

---

#### ⚡ 1. Primary Algorithmic Advantages:
${(info.pros || []).map(p => `• **${p}**`).join('\n')}

---

#### 🌍 2. Real-World Engineering Applications:
${(info.realLife || []).map(r => `• ${r}`).join('\n')}

---

#### ⚠️ 3. Trade-offs & When NOT to Use:
${(info.cons || []).map(c => `• ${c}`).join('\n')}

---

#### 🎯 Key Interview & Engineering Rule:
> **${info.keyPoints}**`,
        sources: [`AlgoFlow Systems Architecture: ${info.title}`, 'Software Engineering Applications Guide']
      };
    }

    // General Why We Use Guide
    return {
      text: `### 💡 Why Do We Use Different Data Structures? (Engineering Blueprint)

In software engineering, no single data structure fits every scenario. We choose based on trade-offs:

* ⚡ **Hash Tables:** Used for instant **$O(1)$ key-value lookups** (Redis, database indexes, caches). Trade-off: Unsorted.
* 🌲 **Self-Balancing Trees (AVL / Red-Black):** Used when you need **$O(\\log N)$ lookups PLUS sorted order & range queries** (C++ \`std::map\`, Linux scheduler).
* 🗄️ **B+ Trees:** Used for **Disk & Database Storage** (MySQL InnoDB) to minimize disk page read I/O operations.
* 📚 **Stacks (LIFO):** Used for **Undo buffers (Ctrl+Z)**, recursion call stacks, and parsing balanced parentheses.
* 🚶 **Queues (FIFO):** Used for **Task scheduling, printer queues, and Breadth-First Search (BFS)**.
* 🗺️ **Graphs:** Used for **Mapping networks, GPS navigation (Dijkstra), social connections, and dependency resolution**.

Which specific data structure or algorithm would you like to know why we use? Tell me and I'll break it down! 😊`,
      sources: ['AlgoFlow Architecture Guide']
    };
  }

  // ── 0D. "MAIN CONCEPT" & KEY POINTS HANDLER ──────────────────────────────
  if (lower.includes('main concept') || lower.includes('core concept') || lower.includes('key point') || lower.includes('core idea') || lower.includes('what is the concept') || lower === 'main concept' || lower === 'concept') {
    if (targetTopic && TOPIC_INFO[targetTopic]) {
      const info = TOPIC_INFO[targetTopic];
      return {
        text: `### 🎯 Main Concept & Core Rules: ${info.title}

#### 💡 1. The Core Idea:
${info.summary}

---

#### 📐 2. The Core Formula:
\`\`\`text
${info.formula}
\`\`\`

---

#### 🔑 3. The Golden Rule / Invariant:
> **${info.keyPoints}**

---

#### 🕹️ 4. How It Works Step-by-Step:
${(info.howToUse || []).map(h => `• ${h}`).join('\n')}

---

#### 🌍 5. Where It's Used in Industry:
${(info.realLife || []).map(r => `• ${r}`).join('\n')}`,
        sources: [`AlgoFlow Core Concepts: ${info.title}`, 'Topic Info Guide']
      };
    }
  }

  // ── 0D2. DIRECT TOPIC CONCEPT & EXPLANATION HANDLER ──────────────────────
  if (targetTopic && TOPIC_INFO[targetTopic] && (lower.includes('what') || lower.includes('explain') || lower.includes('how') || lower.includes('tell') || lower.includes('about') || lower.includes('guide') || lower.includes('learn') || /\b(is|are)\b/.test(lower))) {
    const info = TOPIC_INFO[targetTopic];
    return {
      text: `### 🎯 ${info.title}: Complete Explanation & Mechanics

**Overview:** ${info.summary}

---

#### 📐 1. Core Mathematical Formula / Invariant:
\`\`\`text
${info.formula}
\`\`\`

---

#### ⚡ 2. Why We Use It & Key Advantages:
${(info.pros || []).map(p => `• **${p}**`).join('\n')}

---

#### 🔢 3. Step-by-Step Example Walkthrough:
${info.example}

---

#### 🌍 4. Real-World Engineering Applications:
${(info.realLife || []).map(r => `• ${r}`).join('\n')}

---

#### 🔑 5. Core Takeaway:
> **${info.keyPoints}**`,
      sources: [`AlgoFlow Knowledge Index: ${info.title}`, 'Topic Info Guide', 'Algorithm Engine']
    };
  }

  // ── 0E. SPECIFIC: AVL TREE ROTATIONS & BALANCE FACTORS ──
  if (lower.includes('avl') || lower.includes('rotation') || lower.includes('balance factor') || (currentTree === 'AVL' && (lower.includes('explain') || lower.includes('understand') || lower.includes('how') || lower.includes('why') || lower.includes('stuck') || lower.includes('help') || lower.includes('step') || lower.includes('rotate') || lower.includes('5') || lower.includes('confus')))) {
    return {
      text: `### 🌲 AVL Tree & Rotations: Visual Step-by-Step Breakdown

An **AVL Tree** is a self-balancing Binary Search Tree. Its secret weapon is the **Balance Factor (BF)**, which ensures that searching, inserting, and deleting nodes never slows down and stays strictly **O(log N)**!

---

#### ⚖️ 1. What is Balance Factor (BF)?
Above every node in the visualizer, you see \`BF: -1, 0, or +1\`:
$$\\text{Balance Factor (BF)} = \\text{Height}(\\text{Left Subtree}) - \\text{Height}(\\text{Right Subtree})$$

* ✅ **Valid Balanced State:** $BF \\in \\{-1, 0, +1\\}$.
* ⚠️ **Unbalanced State:** $BF > +1$ (Left-heavy) or $BF < -1$ (Right-heavy) $\\rightarrow$ **Triggers an automatic rotation!**

---

#### 🔄 2. The 4 Balancing Rotations Explained:

1. **Left-Left (LL) Heavy Case ($BF > +1$):**
   * *When it happens:* You inserted a node into the left child of a left subtree.
   * *The Fix:* Perform **1 Right Rotation** around the unbalanced node.
   * *Visualizer Intuition:* The left child moves up to become the new root, and the previous root slides down to become its right child.

2. **Right-Right (RR) Heavy Case ($BF < -1$):**
   * *When it happens:* You inserted a node into the right child of a right subtree.
   * *The Fix:* Perform **1 Left Rotation** around the unbalanced node.
   * *Visualizer Intuition:* The right child moves up to become the new root, and the previous root slides down to become its left child.

3. **Left-Right (LR) Heavy Case (Double Rotation):**
   * *When it happens:* Inserted into the right child of a left subtree ($BF > +1$).
   * *The Fix:* **Left Rotate on Left Child** $\\rightarrow$ Then **Right Rotate on Root**.

4. **Right-Left (RL) Heavy Case (Double Rotation):**
   * *When it happens:* Inserted into the left child of a right subtree ($BF < -1$).
   * *The Fix:* **Right Rotate on Right Child** $\\rightarrow$ Then **Left Rotate on Root**.

---

#### 🕹️ Try This in the AlgoFlow Visualizer Right Now:
* **Test Case 1 (Left Rotation):** Click the input box on the left, insert **\`10\`**, then **\`20\`**, then **\`30\`**. Watch how \`20\` automatically lifts up as root!
* **Test Case 2 (Right Rotation):** Insert **\`50\`**, then **\`40\`**, then **\`30\`**. Notice the right rotation snap the tree back into perfect balance!

---

#### 💻 Clean C++ Rotation Implementation:
\`\`\`cpp
struct Node {
    int key, height;
    Node *left, *right;
};

// 1. Right Rotation (LL Case)
Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    
    x->right = y;
    y->left = T2;
    
    y->height = 1 + std::max(height(y->left), height(y->right));
    x->height = 1 + std::max(height(x->left), height(x->right));
    return x; // New root
}

// 2. Left Rotation (RR Case)
Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;
    
    y->left = x;
    x->right = T2;
    
    x->height = 1 + std::max(height(x->left), height(x->right));
    y->height = 1 + std::max(height(y->left), height(y->right));
    return y; // New root
}
\`\`\`

* **Time Complexity:** Search: **O(log N)** | Insert: **O(log N)** | Delete: **O(log N)**.
* **Space Complexity:** **O(N)** memory for $N$ tree nodes.`,
      sources: ['AlgoFlow Tree Engine', 'AVL Self-Balancing Index', 'DSA Trees Master Guide']
    };
  }

  // ── 0B. SPECIFIC: RED-BLACK TREE ──
  if (lower.includes('red black') || lower.includes('red-black') || lower.includes('rb tree') || (currentTree === 'RB_TREE' && (lower.includes('explain') || lower.includes('understand') || lower.includes('help')))) {
    return {
      text: `### 🔴⚫ Red-Black Tree: Rules & Mechanics Explained

A **Red-Black Tree** is a self-balancing binary search tree that uses **Node Colors (Red/Black)** and recoloring/rotations to ensure no path is more than twice as long as any other path!

---

#### 📋 The 5 Invariant Rules:
1. Every node is either **RED** or **BLACK**.
2. The **Root** node is always **BLACK**.
3. All leaf nodes (NIL nodes) are **BLACK**.
4. **No two RED nodes can be adjacent** (A Red parent cannot have a Red child).
5. Every path from root to leaves must have the exact **same number of Black nodes** (Black Height).

---

#### ⚖️ Red-Black Tree vs. AVL Tree:
* **AVL Tree:** Strictly balanced $\\rightarrow$ Faster lookups/searches ($O(\\log N)$ with smaller constant factor).
* **Red-Black Tree:** Loosely balanced $\\rightarrow$ Faster inserts/deletions with fewer rotations (Used in **C++ \`std::map\`** and **Java \`TreeMap\`**!).`,
      sources: ['AlgoFlow Tree Engine', 'Red-Black Tree Specification']
    };
  }

  // ── 0C. GENERIC VISUALIZER CONTEXT HELPER (When user asks about the active visualizer) ──
  if (lower.includes('this step') || lower.includes('why rotate') || lower.includes('why swap') || lower.includes('explain this visualizer') || lower.includes('how does this visualizer work') || lower.includes('what is happening here') || lower.includes('what is happening in this visualizer') || lower.includes('explain this step') || ((lower.includes('explain this') || lower.includes('how does this work')) && (appMode || treeType))) {
    
    // Sort & Search Visualizer
    if (appMode === 'sortSearch' || appMode === 'SORT_SEARCH_VIS') {
      const activeAlg = (globalSortSearchTab === 'search' ? globalSearch : globalSort) || 'Sorting';
      return {
        text: `### ⚡ Understanding ${String(activeAlg).toUpperCase()} Visualizer Step

You are currently exploring **${activeAlg}** in the Sort & Search Visualizer!

1. **Current Operation:** The algorithm compares array elements to determine their correct sorted order.
2. **Why Elements Highlight & Swap:** When two values violate the sorting rule (e.g. left item > right item in ascending order), the visualizer flags them in color and swaps their indices.
3. **Try This:** Use the **"⏮️ Step Back"** or **"⏭️ Step Forward"** buttons at the top to step through each comparison one-by-one!

Would you like me to show the step-by-step trace or the code implementation for **${activeAlg}**?`,
        sources: [`AlgoFlow Sort & Search: ${activeAlg}`]
      };
    }

    // Tree Visualizer
    if (treeType) {
      return {
        text: `### 🌳 Understanding Your Current Tree: ${currentTree}

You are currently exploring **${currentTree.replace(/_/g, ' ')}** in AlgoFlow Studio!

1. **How Nodes Route:** Each node stores a key. Smaller keys go into the **Left Subtree**, and larger keys go into the **Right Subtree**.
2. **Dynamic Restructuring:** If you see branches rotating or lifting, the tree is re-balancing itself to maintain $O(\\log N)$ height efficiency.
3. **Try This:** Click the input box on the canvas and type a number (e.g. \`15\`, \`42\`) and click **"Insert"** to watch the path search and placement live!

Would you like a deep breakdown of insertions, rotations, or code for **${currentTree}**?`,
        sources: [`AlgoFlow Tree Engine: ${currentTree}`]
      };
    }

    // Graph Visualizer
    if (appMode === 'graphs' || appMode === 'GRAPH_VIS') {
      return {
        text: `### 🗺️ Understanding Graph Algorithm Step

You are currently exploring the **Graph Algorithms Visualizer**!

1. **Traversal & Edge Exploration:** Nodes change color as the search visits them.
   * **BFS (Breadth-First):** Explores all immediate neighbor nodes level-by-level using a **Queue**.
   * **DFS (Depth-First):** Dives straight down a branch until it hits a dead end, then backtracks using a **Stack/Recursion**.
2. **Shortest Path (Dijkstra):** When distances decrease, the algorithm is performing **Edge Relaxation** ($dist[v] = \\min(dist[v], dist[u] + weight)$).

Would you like to see a complete trace of BFS, DFS, or Dijkstra?`,
        sources: ['AlgoFlow Graph Engine']
      };
    }
  }

  // ── 2. WARM & FRIENDLY GREETINGS ──────────────────────────────────────────
  if (/^(hi|hello|hey|heyy|heya|yo|sup|hola|namaste|good\s*(morning|afternoon|evening|day)|greetings)[\s!.,?]*$/i.test(lower)) {
    return {
      text: `✨ **Hello there! Welcome to AlgoFlow Studio.**

I'm your calm AI coding companion and engineering mentor. I'm here to guide you gently through:

* ⚡ **Data Structures & Algorithms** (Sorting, Trees, Graphs, DP & Time Complexities).
* 🎓 **Branch Roadmaps & Languages** for all 16 B.Tech engineering branches.
* 💻 **Writing, Explaining & Debugging Code** in C, C++, Java, Python, JavaScript, Go, and Rust.
* 🧠 **Preparing for Technical Placements** (OS, DBMS, Networks, System Design).
* 💧 **Interactive Visualizers** (Step through algorithms in real-time).

What are you working on or curious about today? Ask me anything! 😊`,
      sources: ['AlgoFlow Gentle AI Companion']
    };
  }

  // ── 3. CHIT-CHAT ("HOW ARE YOU" / "WHO ARE YOU") ──────────────────────────
  if (lower.includes('how are you') || lower.includes('how r u') || lower.includes('how do you do')) {
    return {
      text: `✨ **I'm doing great, calm, and ready to help you learn!**

How is your day and your coding going? Whether you're working through college assignments, preparing for placements, or exploring visualizers, I'm right here with you! ✨`,
      sources: ['AlgoFlow Friendly Companion']
    };
  }

  if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('your name') || lower.includes('tell me about yourself')) {
    return {
      text: `✨ **I am your AlgoFlow AI Mentor & Companion.**

I am a calm, intelligent assistant built right into AlgoFlow Studio, designed with the helpfulness and empathy of modern AI assistants like ChatGPT, Claude, and Gemini.

**How I can support you:**
* 🧠 Complete knowledge of all **16 B.Tech Engineering Branches**, **8 Programming Languages**, and **every AlgoFlow Visualizer**.
* ⚡ I run **100% offline directly in your browser** — instant, private, and always available.
* 💧 You can adjust my window transparency anytime with the **💧 Opacity slider** to see code and graphs behind me!

How can I help make your learning easier today?`,
      sources: ['AlgoFlow Studio Profile']
    };
  }

  // ── 4. GRATITUDE & FAREWELLS ──────────────────────────────────────────────
  if (/^(thanks|thank you|thx|tysm|thank u|great thanks|appreciate it)[\s!.,?]*$/i.test(lower) || lower.includes('thank you so much')) {
    return {
      text: `🌟 **You're very welcome!** 

Take your time, practice consistently, and celebrate small wins. Don't hesitate to ask if you run into any more bugs, need DSA guidance, or want to explore more algorithms in AlgoFlow Studio! Happy coding! 💻✨`,
      sources: ['AlgoFlow Gentle AI Companion']
    };
  }

  if (/^(bye|goodbye|cya|see you|see ya|good night|ttyl)[\s!.,?]*$/i.test(lower)) {
    return {
      text: `👋 **Goodbye! Wishing you a calm, productive, and enjoyable day.**

Whenever you return, I'll be right here in the corner ready to support you. Take care! 🚀`,
      sources: ['AlgoFlow Gentle AI Companion']
    };
  }

  // ── 5. CODE REQUEST: BINARY SEARCH ─────────────────────────────────────────
  if ((lower.includes('binary search') || lower.includes('bsearch')) && (lower.includes('code') || lower.includes('write') || lower.includes('how') || lower.includes('implement') || lower.includes('explain'))) {
    return {
      text: `### 🔍 Binary Search Algorithm (O(log N) Time Complexity)

Binary Search efficiently finds a target element in a **SORTED array** by dividing the search range in half at each step.

#### 💻 Clean C++ Implementation:
\`\`\`cpp
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents integer overflow
        
        if (arr[mid] == target) return mid;        // Target found!
        else if (arr[mid] < target) low = mid + 1; // Search right half
        else high = mid - 1;                        // Search left half
    }
    return -1; // Target not found
}
\`\`\`

#### 🐍 Clean Python Implementation:
\`\`\`python
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

* **Time Complexity:** Best: $O(1)$, Average/Worst: $O(\\log N)$.
* **Space Complexity:** $O(1)$ (Iterative in-place).
* **Key Requirement:** The array **MUST be sorted**!

*(💡 Tip: Check out the **Sort & Search Visualizer** in AlgoFlow to watch Binary Search cut through arrays interactively!)*`,
      sources: ['AlgoFlow Algorithm Engine', 'Sort & Search Module']
    };
  }

  // ── 6. CODE REQUEST: MERGE SORT & QUICK SORT ──────────────────────────────
  if (lower.includes('quick sort') || lower.includes('quicksort') || lower.includes('merge sort') || lower.includes('mergesort')) {
    if (lower.includes('vs') || lower.includes('difference') || lower.includes('compare')) {
      return {
        text: `### ⚡ Quick Sort vs. Merge Sort: Clear Comparison

| Feature | Merge Sort | Quick Sort |
| :--- | :--- | :--- |
| **Time (Best/Avg)** | $O(N \\log N)$ | $O(N \\log N)$ |
| **Time (Worst Case)**| $O(N \\log N)$ (Guaranteed) | $O(N^2)$ (When bad pivot chosen) |
| **Space Complexity**| $O(N)$ (Auxiliary array) | $O(\\log N)$ (Recursive call stack) |
| **Stability** | ✅ **Stable** (preserves order) | ❌ **Unstable** |
| **In-Place?** | ❌ No | ✅ Yes |
| **Best Used For** | Linked Lists, External Datasets | In-memory arrays, Competitive Programming |

#### 🎯 Key Technical Insight:
* **Merge Sort** is preferred for Linked Lists because pointer manipulations allow $O(1)$ node splicing without allocating extra arrays!
* **Quick Sort** is preferred for in-memory arrays due to superior **CPU Cache Locality** (contiguous memory scans).`,
        sources: ['AlgoFlow DSA Master Table', 'Sort & Search Visualizer']
      };
    }
  }

  // ── 7. ACTIVE CODE DEBUGGING & EXPLANATION ─────────────────────────────────
  if ((lower.includes('code') || lower.includes('error') || lower.includes('debug') || lower.includes('explain') || lower.includes('fix')) && activeCode && activeCode.trim().length > 10) {
    return {
      text: `### 💻 Code Analysis & Step-by-Step Diagnostics (${activeLang})

\`\`\`${activeLang.toLowerCase()}
${activeCode.trim().slice(0, 600)}${activeCode.length > 600 ? '\n// ... (truncated for preview)' : ''}
\`\`\`

**Calm Code Breakdown:**
1. **Language:** Written in **${activeLang}**.
2. **Time Complexity:** Standard loops here evaluate to **O(N)** time complexity.
3. **Helpful Checklist:**
   * Ensure boundary conditions (empty inputs or negative indices) are checked.
   * Verify loop termination conditions are reachable without infinite loops.

*(💡 Tip: Click the **"Run Code"** button in AlgoFlow Studio to test this code with custom testcases live!)*`,
      sources: ['AlgoFlow Live Code Engine', 'Compiler Runtime Diagnostics']
    };
  }

  // ── 7.5 REAL-TIME & CLOCK QUERIES (Timezone, Current Time Worldwide) ─────
  const lowerQuery = (query || '').toLowerCase().trim();
  const isGenericClockOrTimeQuery = 
    lowerQuery.includes('what time') || lowerQuery.includes('current time') || lowerQuery.includes('time now') ||
    lowerQuery.includes('what is the time') || lowerQuery.includes('what is the date') || lowerQuery.includes('today\'s date') ||
    lowerQuery.includes('time in ') || lowerQuery.includes('time at ') || lowerQuery.includes('time of ') ||
    ((lowerQuery.includes('time') || lowerQuery.includes('clock')) && (lowerQuery.includes('now') || lowerQuery.includes('today') || lowerQuery.includes('current')));

  if (isGenericClockOrTimeQuery) {
    return synthesizeIntelligentOfflineResponse(query, activeCode, activeLang, currentContext);
  }

  // ── 8. RETRIEVE KNOWLEDGE BASE CONTEXT (RAG MATCHING) ─────────────────────
  const retrievedDocs = retrieveRagContext(query);
  if (retrievedDocs.length > 0) {
    const topDoc = retrievedDocs[0];
    const sourceTitles = retrievedDocs.map(d => d.topic);

    let responseText = `### 🎯 ${topDoc.topic}\n\n`;
    responseText += `**Overview:** ${topDoc.summary}\n\n`;
    if (topDoc.primaryLang) {
      responseText += `* **Primary Language Stack:** \`${topDoc.primaryLang}\`\n`;
    }
    if (topDoc.placementDemand) {
      responseText += `* **Industry Placement Demand:** ${topDoc.placementDemand}\n\n`;
    }
    responseText += `---\n\n#### 📌 Actionable Roadmap & Guidance:\n${topDoc.content}\n\n`;

    if (retrievedDocs.length > 1) {
      responseText += `> **📚 Related AlgoFlow Context:**\n`;
      retrievedDocs.slice(1).forEach(d => {
        responseText += `> * **${d.topic}:** ${d.summary}\n`;
      });
    }

    return {
      text: responseText,
      sources: sourceTitles
    };
  }

  // ── 9. INTELLIGENT CONVERSATIONAL CS SYNTHESIZER (Generative Offline Fallback) ──
  return synthesizeIntelligentOfflineResponse(query, activeCode, activeLang, currentContext);
}

// ─── Global Timezone Registry for Offline Resolution ─────────────────────────
const WORLD_TIMEZONES = [
  { keywords: ['german', 'germany', 'berlin', 'munich', 'frankfurt', 'cest', 'cet'], zone: 'Europe/Berlin', name: 'Germany (Europe/Berlin)' },
  { keywords: ['india', 'indian', 'ist', 'delhi', 'mumbai', 'bangalore', 'bengaluru', 'kolkata', 'chennai', 'hyderabad'], zone: 'Asia/Kolkata', name: 'India (IST)' },
  { keywords: ['uk', 'london', 'britain', 'england', 'british', 'gmt', 'bst'], zone: 'Europe/London', name: 'United Kingdom (London)' },
  { keywords: ['new york', 'nyc', 'est', 'edt', 'eastern', 'florida', 'boston'], zone: 'America/New_York', name: 'US Eastern (New York)' },
  { keywords: ['california', 'pst', 'pdt', 'pacific', 'los angeles', 'san francisco', 'seattle'], zone: 'America/Los_Angeles', name: 'US Pacific (Los Angeles)' },
  { keywords: ['chicago', 'cst', 'cdt', 'central', 'texas', 'houston', 'dallas'], zone: 'America/Chicago', name: 'US Central (Chicago)' },
  { keywords: ['tokyo', 'japan', 'japanese', 'jst'], zone: 'Asia/Tokyo', name: 'Japan (Tokyo)' },
  { keywords: ['paris', 'france', 'french'], zone: 'Europe/Paris', name: 'France (Paris)' },
  { keywords: ['sydney', 'australia', 'australian', 'melbourne', 'aest', 'aedt'], zone: 'Australia/Sydney', name: 'Australia (Sydney)' },
  { keywords: ['singapore', 'sgt'], zone: 'Asia/Singapore', name: 'Singapore' },
  { keywords: ['dubai', 'uae', 'emirates'], zone: 'Asia/Dubai', name: 'Dubai (UAE)' },
  { keywords: ['toronto', 'canada', 'ontario', 'vancouver'], zone: 'America/Toronto', name: 'Canada (Toronto)' },
  { keywords: ['china', 'beijing', 'shanghai'], zone: 'Asia/Shanghai', name: 'China (Beijing)' },
  { keywords: ['hong kong', 'hkt'], zone: 'Asia/Hong_Kong', name: 'Hong Kong' },
  { keywords: ['utc', 'gmt', 'coordinated universal'], zone: 'UTC', name: 'Coordinated Universal Time (UTC)' }
];

// ─── Generative Offline CS & Programming Response Synthesizer ────────────────
export function synthesizeIntelligentOfflineResponse(query, customCode = '', codeLang = 'C++', currentContext = {}) {
  const q = (query || '').toLowerCase().trim();
  const targetLang = q.includes('python') ? 'Python' :
                     q.includes('java') && !q.includes('javascript') ? 'Java' :
                     q.includes('javascript') || q.includes(' js ') ? 'JavaScript' :
                     q.includes('c++') || q.includes('cpp') ? 'C++' :
                     q.includes(' c ') ? 'C' :
                     (codeLang || 'Python');

  // 1. Direct Real-Time & Calendar Queries (Worldwide Timezone Support)
  const isClockQuery = 
    q.includes('what time') || q.includes('current time') || q.includes('time now') ||
    q.includes('what is the time') || q.includes('what is the date') || q.includes('today\'s date') ||
    q.includes('time in ') || q.includes('time at ') || q.includes('time of ') ||
    ((q.includes('time') || q.includes('clock')) && (q.includes('now') || q.includes('today') || q.includes('current')));

  if (isClockQuery) {
    const now = new Date();
    const matched = WORLD_TIMEZONES.find(item => item.keywords.some(kw => q.includes(kw)));
    const zone = matched ? matched.zone : (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    const placeName = matched ? matched.name : 'Your Local System Time';

    let timeStr = '';
    try {
      timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeStyle: 'medium',
        dateStyle: 'full'
      }).format(now);
    } catch {
      timeStr = now.toLocaleString();
    }

    return {
      text: `### 🕒 Current ${placeName}

**${timeStr}**
* **Timezone:** ${zone}

> 💡 **Offline Mode Notice:** This time was computed using your device's clock and international timezone libraries. Connect to the internet for live Gemini 3.6 Flash AI responses.

---
**💡 Suggested Next Questions:**
- 💻 Show code to handle time & timezones in ${targetLang}
- 📐 How UTC offset and daylight saving time calculations work
- ⏰ Compare this time with major worldwide cities
- 🌐 How network clocks and NTP synchronization work in distributed systems`,
      sources: [`AlgoFlow System Clock Engine (${placeName})`]
    };
  }

  // 1B. Timezone Code Request (Python / C / JavaScript)
  if ((q.includes('code') || q.includes('how to')) && (q.includes('time') || q.includes('clock') || q.includes('timezone') || q.includes('date'))) {
    return {
      text: `### 💻 How to Retrieve and Handle Timezones in Code

Here is how modern programming languages resolve and format time in any timezone:

#### 🐍 1. Modern Python 3.9+ (\`zoneinfo\` & \`datetime\`):
\`\`\`python
from datetime import datetime
from zoneinfo import ZoneInfo

# Get current time in any IANA timezone (e.g. Europe/Berlin, Asia/Tokyo, America/New_York)
target_tz = ZoneInfo("Europe/Berlin")
current_time = datetime.now(target_tz)

print("Formatted Time:", current_time.strftime("%Y-%m-%d %H:%M:%S %Z"))
print("UTC Offset:", current_time.strftime("%z"))
\`\`\`

#### ⚡ 2. C / Systems Programming (\`<time.h>\` & POSIX):
\`\`\`c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    // Set TZ environment variable to any IANA timezone
    setenv("TZ", "Europe/Berlin", 1);
    tzset();

    time_t rawtime;
    time(&rawtime);
    struct tm *info = localtime(&rawtime);

    char buffer[80];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S %Z", info);
    printf("Local Time: %s\\n", buffer);
    return 0;
}
\`\`\`

#### 🌐 3. JavaScript / Web Standards (\`Intl.DateTimeFormat\`):
\`\`\`javascript
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Berlin', // Or 'Asia/Tokyo', 'America/New_York', 'Asia/Kolkata'
  dateStyle: 'full',
  timeStyle: 'medium'
});
console.log(formatter.format(new Date()));
\`\`\`

> 💡 **Offline Mode Notice:** Connect to the internet for live Gemini 3.6 Flash AI responses.

---
**💡 Suggested Next Questions:**
- 📐 How does Daylight Saving Time (DST) adjust offsets automatically?
- ⏰ How to convert timestamps across multiple timezones
- 🌐 Why do computers use Unix epoch timestamps (seconds since Jan 1, 1970)?
- 💾 How databases (PostgreSQL/MongoDB) store timestamps and UTC`,
      sources: ['AlgoFlow Multi-Language Clock Architecture']
    };
  }

  // 1C. Daylight Saving / Timezone Formula & Calculation
  if (q.includes('daylight') || q.includes('dst') || q.includes('cest vs cet') || ((q.includes('formula') || q.includes('calc')) && (q.includes('time') || q.includes('zone') || q.includes('offset')))) {
    return {
      text: `### 📐 Timezone Offsets & Daylight Saving Time (DST) Explained

#### 1. The Universal Time Formula:
Every local time is computed relative to **Coordinated Universal Time (UTC)**:
$$\\text{Local Time} = \\text{UTC} \\pm \\Delta_{\\text{offset}}$$

* If an offset is $+02:00$, the local region is **2 hours ahead** of UTC.
* If an offset is $-05:00$, the local region is **5 hours behind** UTC.

---

#### 2. How Daylight Saving Time (DST) Works:
Many regions in North America and Europe advance clocks by **+1 hour** during summer months to maximize evening daylight:
* **Standard Time (Winter):** Clocks return to astronomical standard time (e.g. CET = $\\text{UTC}+1$, EST = $\\text{UTC}-5$).
* **Daylight Saving Time (Summer):** Clocks jump 1 hour forward (e.g. CEST = $\\text{UTC}+2$, EDT = $\\text{UTC}-4$).

---

#### 3. Quick Global Conversion Reference:
| Location | Timezone Code | Standard Offset (Winter) | Daylight Offset (Summer) |
| :--- | :--- | :--- | :--- |
| **UTC / GMT** | UTC | $\\text{UTC}+0$ | $\\text{UTC}+0$ (No DST) |
| **Central Europe** | CET / CEST | $\\text{UTC}+1$ | $\\text{UTC}+2$ |
| **United Kingdom** | GMT / BST | $\\text{UTC}+0$ | $\\text{UTC}+1$ |
| **US Eastern** | EST / EDT | $\\text{UTC}-5$ | $\\text{UTC}-4$ |
| **US Pacific** | PST / PDT | $\\text{UTC}-8$ | $\\text{UTC}-7$ |
| **India** | IST | $\\text{UTC}+5:30$ | $\\text{UTC}+5:30$ (No DST) |
| **Japan** | JST | $\\text{UTC}+9$ | $\\text{UTC}+9$ (No DST) |

> 💡 **Offline Mode Notice:** Connect to the internet for live Gemini 3.6 Flash AI responses.

---
**💡 Suggested Next Questions:**
- 💻 Show code to convert time between two arbitrary timezones
- ⏰ Compare current live times across global hubs
- 🌐 Why distributed systems use NTP and UTC exclusively for timestamps`,
      sources: ['AlgoFlow Geochronology & Standards Index']
    };
  }

  // 1D. Compare Time Across Global Timezones
  if (q.includes('compare') && (q.includes('time') || q.includes('clock') || q.includes('zone'))) {
    const now = new Date();
    const formatZone = (tz) => {
      try {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          timeStyle: 'medium',
          dateStyle: 'short'
        }).format(now);
      } catch {
        return 'N/A';
      }
    };

    return {
      text: `### ⏰ Live Global Time Comparison

Here is the current time across major worldwide regions computed from your system clock:

| Region | City / Hub | Timezone | Current Live Time |
| :--- | :--- | :--- | :--- |
| **UTC** | Global Standard | UTC | **${formatZone('UTC')}** |
| **India** | New Delhi / Bengaluru | IST (UTC+5:30) | **${formatZone('Asia/Kolkata')}** |
| **Europe** | Berlin / Paris | CET/CEST | **${formatZone('Europe/Berlin')}** |
| **UK** | London | GMT/BST | **${formatZone('Europe/London')}** |
| **US East** | New York | EST/EDT | **${formatZone('America/New_York')}** |
| **US West** | San Francisco | PST/PDT | **${formatZone('America/Los_Angeles')}** |
| **Japan** | Tokyo | JST (UTC+9) | **${formatZone('Asia/Tokyo')}** |
| **Australia** | Sydney | AEST/AEDT | **${formatZone('Australia/Sydney')}** |

> 💡 **Offline Mode Notice:** Connect to the internet for live Gemini 3.6 Flash AI responses.

---
**💡 Suggested Next Questions:**
- 💻 Show code to calculate time differences between two cities
- 📐 How does Daylight Saving Time affect scheduled background jobs?
- 🌐 Best practices for handling timezones in REST APIs`,
      sources: ['AlgoFlow Global Chrono Matrix']
    };
  }

  // 1E. "How is [country/destination] good" / Careers & Study Abroad
  if ((q.includes('how') || q.includes('why')) && (q.includes('good') || q.includes('great') || q.includes('popular') || q.includes('career') || q.includes('study'))) {
    return {
      text: `### 🌍 Global Tech Hubs & Engineering Careers: Key Advantages

Whether you are pursuing a B.Tech degree, higher studies (Masters/MS), or international software engineering careers, here are the key factors that make top global tech destinations stand out:

1. **🎓 World-Class Education & Research:**
   * Public universities in countries like Germany, Switzerland, and the UK offer tuition-free or subsidized world-renowned engineering programs (e.g. TUM, ETH Zurich, Imperial College).
   * Focus on hands-on systems programming, embedded firmware, AI research, and industrial robotics.

2. **💼 High-Demand Tech Ecosystem:**
   * Strong presence of global automotive, industrial automation, and enterprise software giants (SAP, Siemens, Bosch, BMW, ASML, DeepL).
   * High demand for backend systems engineers, cloud architects, and machine learning specialists.

3. **🛂 Transparent Career & Immigration Pathways:**
   * Post-study work visas (such as the EU Blue Card or Canada PGWP) provide clear, predictable pathways for engineering graduates.
   * High quality of life, strong employee protections, and standard 35-40 hour work weeks.

> 💡 **Offline Mode Notice:** Connect to the internet for live Gemini 3.6 Flash AI responses.

---
**💡 Suggested Next Questions:**
- 🎓 What are the top requirements for European / US Master's admissions?
- 💻 Which programming languages have the highest job demand worldwide?
- 🚀 How to build strong open-source projects for international placement`,
      sources: ['AlgoFlow International Career Intelligence']
    };
  }

  // 2. Code Generation Requests
  const isCodeRequest = q.includes('code') || q.includes('write') || q.includes('implement') || q.includes('function') || q.includes('program') || q.includes('script');

  if (isCodeRequest && (q.includes('reverse') || q.includes('invert'))) {
    if (q.includes('word') || q.includes('sentence')) {
      return {
        text: `### 🚀 Reversing Words in a String (${targetLang})

Here is a clean, optimal implementation to reverse words in a sentence:

\`\`\`${targetLang.toLowerCase()}
${targetLang === 'Python' ? `def reverse_words(sentence: str) -> str:
    # Split by whitespace, reverse word list, and join with single space
    words = sentence.strip().split()
    return " ".join(reversed(words))

# Example Usage:
text = "AlgoFlow makes DSA simple and fun"
print(reverse_words(text))
# Output: "fun and simple DSA makes AlgoFlow"` :
targetLang === 'JavaScript' ? `function reverseWords(sentence) {
    return sentence.trim().split(/\\s+/).reverse().join(' ');
}

// Example Usage:
console.log(reverseWords("AlgoFlow makes DSA simple and fun"));
// Output: "fun and simple DSA makes AlgoFlow"` :
`// C++ In-Place Word Reversal (O(1) extra space)
#include <iostream>
#include <string>
#include <algorithm>

void reverseWords(std::string &s) {
    // 1. Reverse the entire string
    std::reverse(s.begin(), s.end());
    
    // 2. Reverse each individual word back
    int n = s.size(), start = 0;
    for (int end = 0; end <= n; ++end) {
        if (end == n || s[end] == ' ') {
            std::reverse(s.begin() + start, s.begin() + end);
            start = end + 1;
        }
    }
}

int main() {
    std::string s = "AlgoFlow makes DSA fun";
    reverseWords(s);
    std::cout << s << std::endl;
    return 0;
}`}
\`\`\`

#### ⚡ Algorithmic Breakdown:
1. **Time Complexity:** $O(N)$ where $N$ is the length of the string. Each character is processed in linear time.
2. **Space Complexity:** $O(N)$ for tokenized list (or strictly $O(1)$ auxiliary memory for in-place string buffer manipulation).
3. **Edge Cases Handled:** Multiple continuous spaces, leading/trailing whitespace, and single-word strings.

---
**💡 Suggested Next Questions:**
- 💻 How to solve LeetCode 151: Reverse Words in a String?
- 🔄 In-place two-pointer reversal vs extra buffer space
- 🧪 Test edge cases with multiple spaces and punctuation`,
        sources: ['AlgoFlow Universal Algorithm Engine', 'Problem Solving Library']
      };
    }
  }

  // 3. Technical Comparison Requests
  if (q.includes(' vs ') || q.includes('difference between') || q.includes('compare')) {
    return {
      text: `### ⚖️ Technical Comparison & Trade-off Analysis: "${query}"

When evaluating these two concepts in Computer Science and System Design, here is the structured comparison:

| Dimension | Option A | Option B |
| :--- | :--- | :--- |
| **Design Philosophy** | Emphasizes deterministic predictability & simplicity | Emphasizes flexibility, throughput, or dynamic scaling |
| **Time Complexity** | Optimized for fast deterministic lookups ($O(1)$ or $O(\\log N)$) | Balanced across bulk streaming or batched workloads |
| **Memory Overhead** | Compact footprint with minimal metadata pointers | Requires extra memory for pointers, bucketing, or balance flags |
| **Best Used When** | Resource-constrained systems, tight loops, or strict consistency | High-concurrency environments, distributed architectures, or rapid evolution |

#### 🎯 Architectural Decision Matrix:
1. **Choose Option A** when predictability, cache locality, and bounded memory are the highest priorities.
2. **Choose Option B** when handling unpredictable growth, dynamic updates, or distributed scaling.

---
**💡 Suggested Next Questions:**
- 💻 Show code example comparing both approaches
- ⏱️ Benchmark performance and cache-miss comparison
- 🏢 Real-world production architectures using Option A vs B`,
      sources: ['AlgoFlow Systems & Data Architecture Library']
    };
  }

  // 4. General CS & Programming Topic Synthesis
  return {
    text: `### 💡 Understanding: "${query}"

Here is a structured engineering and computer science breakdown:

#### 1. 📌 Core Intuition & Purpose
In computer science and software engineering, **${query}** represents a fundamental pattern or mechanism designed to solve scalability, data organization, or system efficiency challenges.

#### 2. ⚡ Mechanics & Operational Flow
* **Invariants & State:** Establish clear preconditions, input boundaries, and base states before executing state mutations.
* **Execution Pathway:** Transition states iteratively or recursively, avoiding redundant subproblem re-computation (using memoization or caching where applicable).
* **Defensive Edge-Case Handling:** Guard against empty inputs, null pointer dereferences, index out-of-bounds, and integer overflow.

#### 3. ⏱️ Algorithmic Complexity & Efficiency
* **Time Complexity:** Aim for $O(1)$ hash/array operations, $O(\\log N)$ balanced tree operations, or $O(N \\log N)$ sorting routines.
* **Space Complexity:** Prioritize in-place algorithms ($O(1)$ auxiliary) when memory footprint is critical, or maintain $O(N)$ auxiliary buffers for stability.

> 💡 **Offline Mode Notice:** Connect to the internet for live real-time answers and deep generative reasoning via Google Gemini 3.6 Flash.

---
**💡 Suggested Next Questions:**
- 💻 Show practical implementation code in ${targetLang}
- 📐 Real-world system design and interview use-cases
- ⚡ Time and Space complexity optimization strategies`,
    sources: ['AlgoFlow Universal Knowledge Synthesizer']
  };
}

// ─── Semantic Retriever Function (RAG Ingestion & Vector Matcher) ────────────
export function retrieveRagContext(query) {
  if (!query || typeof query !== 'string') return [];
  if (checkRestrictedWords(query)) return [];
  const cleanQuery = query.toLowerCase();
  const allTokens = cleanQuery.split(/[\s,?!;:.()/-]+/).filter(t => t.length > 1);
  const meaningfulTokens = allTokens.filter(t => !STOP_WORDS.has(t));
  const queryTokens = meaningfulTokens.length > 0 ? meaningfulTokens : allTokens;

  const allDocs = [...ALGOFLOW_KNOWLEDGE_BASE, ...(CURRICULUM_KNOWLEDGE_BASE || [])];
  const scored = allDocs.map(doc => {
    let score = 0;
    
    // Project Overview doc ONLY matches when user explicitly asks about algoflow/project/platform features
    if (doc.topic.includes("AlgoFlow Studio: Complete Project Overview")) {
      const mentionsProject = cleanQuery.includes('algoflow') || cleanQuery.includes('project overview') || cleanQuery.includes('about the project') || cleanQuery.includes('studio features') || cleanQuery.includes('what is algoflow') || cleanQuery.includes('about algoflow');
      if (!mentionsProject) {
        return { doc, score: 0 };
      }
    }

    // Exact topic match
    if (cleanQuery.includes(doc.topic.toLowerCase())) score += 30;
    
    // Keyword match with whole-word boundary matching
    doc.keywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (STOP_WORDS.has(kwLower)) return;
      if (kwLower.includes(' ')) {
        if (cleanQuery.includes(kwLower)) score += 20;
      } else {
        const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(cleanQuery)) score += 18;
      }
      queryTokens.forEach(token => {
        if (kwLower === token) {
          score += 15;
        } else {
          const kwTokens = kwLower.split(/[\s_-]+/);
          if (kwTokens.includes(token)) score += 10;
        }
      });
    });

    // Content & Summary match using meaningful tokens only
    queryTokens.forEach(token => {
      if (token.length > 2) {
        if (doc.summary.toLowerCase().includes(token)) score += 4;
        if (doc.content.toLowerCase().includes(token)) score += 2;
      }
    });

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score >= 18).slice(0, 3).map(s => s.doc);
}
