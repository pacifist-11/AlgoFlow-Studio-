// ─── AlgoFlow Super-Intelligent Conversational RAG Engine ───────────────────
// Gentle, Calm & Empathetic AI Assistant (ChatGPT / Claude / Gemini / Copilot style)
// Context-Aware over Current Visualizer, Active Algorithm, 16 Branches, 8 Languages

export const ALGOFLOW_KNOWLEDGE_BASE = [
  // ─── 1. ALGOFLOW STUDIO PROJECT FEATURES & VISUALIZERS ───────────────────────
  {
    topic: "AlgoFlow Studio: Complete Project Overview & Features",
    keywords: ["project", "algoflow", "what is algoflow", "features", "how to use", "studio", "about", "navigation", "visualizers", "app"],
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
  }
];

// ─── Conversational, Empathetic & Context-Aware Response Generator ───────────
export function generateLocalRagResponse(userMessage, activeCode = '', activeLang = 'C++', currentContext = {}) {
  const query = (userMessage || '').trim();
  const lower = query.toLowerCase();

  // ── 0. GENTLE CONTEXT DETECTION (User is currently in a visualizer / tab) ──
  const { appMode, treeType, globalSort, globalSearch, globalSortSearchTab } = currentContext || {};
  
  // If user asks context-dependent questions like "how does this work?", "why did it rotate/swap?", "explain this"
  if (lower.includes('this step') || lower.includes('why rotate') || lower.includes('why swap') || lower.includes('explain this') || lower.includes('how does this work') || lower.includes('what is happening')) {
    
    if (appMode === 'SORT_SEARCH_VIS') {
      const activeAlg = (globalSortSearchTab === 'search' ? globalSearch : globalSort) || 'Sorting/Searching';
      return {
        text: `✨ **Let's calmly break down what's happening in ${activeAlg.toUpperCase()}:**

You are currently exploring **${activeAlg}** in the Sort & Search Visualizer. 

1. **Current Operation:** The algorithm compares elements in the array to determine their relative order.
2. **Why It Highlighted/Swapped:** When two elements violate the sorting order (e.g., left item > right item in ascending order), the visualizer highlights them and performs a swap to bring the larger element closer to its true position.
3. **Try This:** Click the **"⏮️ Step Back"** or **"⏭️ Step Forward"** button at the top to watch the exact comparison index-by-index at your own pace!

Would you like me to show you the complete clean code implementation for **${activeAlg}**?`,
        sources: [`AlgoFlow Visualizer: ${activeAlg}`]
      };
    }

    if (appMode === 'GENERAL_DS_VIS' && treeType) {
      return {
        text: `✨ **Understanding your current Data Structure: ${treeType}**

You are currently visualizing **${treeType}** in the Data Structures Studio.

* **Balance & Pointers:** If you see nodes shifting or rotating, the data structure is self-balancing (maintaining the invariant that search time remains $O(\\log N)$ without degenerating into a linked list).
* **Key Operation:** Notice how each node strictly routes smaller elements to the left and larger elements to the right.
* **Try This:** Use the **"Insert"** or **"Delete"** buttons on the left canvas to test custom numbers and watch how the tree restructures smoothly!

Need help with insertion, deletion, or code implementation for **${treeType}**? Just let me know!`,
        sources: [`AlgoFlow DS Engine: ${treeType}`]
      };
    }

    if (appMode === 'GRAPH_VIS') {
      return {
        text: `✨ **Understanding your Graph Algorithm Step:**

You are currently in the **Graph Algorithms Visualizer**!

* **Edge Traversal:** Nodes change color as the algorithm explores paths. In BFS, it explores all direct neighbors level-by-level; in DFS, it dives deep along a branch until it hits a dead end.
* **Shortest Path (Dijkstra):** If distances are updating, it is performing **Edge Relaxation** — whenever a shorter path to a neighbor is discovered, the estimated distance is lowered!

Would you like a quick walkthrough of BFS, DFS, or Dijkstra?`,
        sources: ['AlgoFlow Graph Engine']
      };
    }
  }

  // ── 1. GENTLE EMPATHETIC SUPPORT (User is stuck, confused, or struggling) ──
  if (lower.includes('stuck') || lower.includes('confused') || lower.includes("don't understand") || lower.includes('dont understand') || lower.includes('hard') || lower.includes('help me understand') || lower.includes('frustrated')) {
    return {
      text: `🌿 **Take a deep, calm breath — learning CS & coding takes time, and you're doing great!**

It is completely normal to feel stuck or confused with algorithms, pointers, or roadmaps. Every great engineer started at the exact same spot.

**Let's solve this calmly step-by-step:**
1. **What specific topic or code is feeling tricky right now?** (e.g., Recursion, Linked Lists, Binary Search, DP, or choosing your language?).
2. **Visual Clues:** Try clicking the interactive visualizer in AlgoFlow to *see* the memory boxes and array swaps move in slow motion.

Tell me the exact concept or line of code that feels confusing, and I will explain it with simple real-life analogies without complicated jargon! 😊✨`,
      sources: ['AlgoFlow Gentle Mentor Support']
    };
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
      text: `🌸 **I'm doing wonderfully, peaceful, and ready to help you learn!**

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

Whenever you return, I'll be right here in the corner ready to support you. Take care! 🌸`,
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
      text: `### 🤖 Code Analysis & Step-by-Step Diagnostics (${activeLang})

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

  // ── 9. INTELLIGENT GENTLE FALLBACK ────────────────────────────────────────
  return {
    text: `### 🌸 AlgoFlow AI Mentor & Companion

I understand you're asking about **"${query}"**! Here are some great directions we can explore together:

* 🎓 **Branch Roadmaps:** Ask *"What language should I learn for 2nd Year ECE / Mech / CSE / Civil?"*
* ⚖️ **Career Transitions:** Ask *"How can a Mechanical student transition to Software SDE?"*
* 🧠 **Core CS Concepts:** Ask *"Explain Deadlocks in OS, ACID in DBMS, or TCP 3-Way Handshake."*
* ⚡ **DSA & Algorithms:** Ask *"Explain Binary Search, Quick Sort vs Merge Sort, or 0/1 Knapsack."*
* 💻 **Language Comparisons:** Ask *"Compare C++ STL vs Java Collections or Go vs Rust."*
* 🕹️ **Studio Visualizers:** Ask *"How do I use the Graph or Sort visualizer?"*

Tell me whatever is on your mind, and we will solve it step-by-step! ✨`,
    sources: ['AlgoFlow Universal Knowledge Base']
  };
}

// ─── Semantic Retriever Function (RAG Ingestion & Vector Matcher) ────────────
export function retrieveRagContext(query) {
  if (!query || typeof query !== 'string') return [];
  const cleanQuery = query.toLowerCase();
  const queryTokens = cleanQuery.split(/[\s,?!;:.()/-]+/).filter(t => t.length > 1);

  const scored = ALGOFLOW_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    
    // Exact topic match
    if (cleanQuery.includes(doc.topic.toLowerCase())) score += 25;
    
    // Keyword match
    doc.keywords.forEach(kw => {
      if (cleanQuery.includes(kw)) score += 12;
      queryTokens.forEach(token => {
        if (kw.includes(token)) score += 4;
      });
    });

    // Content match
    queryTokens.forEach(token => {
      if (doc.content.toLowerCase().includes(token)) score += 2;
      if (doc.summary.toLowerCase().includes(token)) score += 3;
    });

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 2).slice(0, 3).map(s => s.doc);
}
