// Educational Topic Info Guides with Formulas, Numerical Examples & Real-Life Applications for Beginners

export const TOPIC_INFO = {
  // ─── STACK ─────────────────────────────────────────────────────────────
  'STACK_ARRAY': {
    title: 'Stack (Array Based)',
    summary: 'A Last-In, First-Out (LIFO) linear data structure where elements are pushed and popped from a single top pointer.',
    formula: 'Push: stack[++top] = val  |  Pop: val = stack[top--]',
    example: '1. Push(10) ➔ top = 0, stack = [10]\n2. Push(20) ➔ top = 1, stack = [10, 20]\n3. Pop() ➔ returns 20, top = 0, stack = [10]',
    realLife: [
      'Undo/Redo button (Ctrl+Z) in text editors like MS Word & VS Code.',
      'Browser back button history navigation.',
      'Function call stack execution in compilers & JS runtime engine.'
    ],
    howToUse: [
      'Enter a number in the input field and click "Push".',
      'Click "Pop" to remove the top item.',
      'Click "Peek" to view the top element without removing it.'
    ],
    keyPoints: 'Strict LIFO discipline: the last element added is always processed first.'
  },
  'STACK_LL': {
    title: 'Stack (Linked List Based)',
    summary: 'A dynamic LIFO stack implemented with linked nodes to handle unlimited elements without fixed size bounds.',
    formula: 'Push: newNode.next = head; head = newNode  |  Pop: val = head.val; head = head.next',
    example: '1. Push(5): head ➔ [5|null]\n2. Push(15): [15|next] ➔ [5|null], head = [15]\n3. Pop(): returns 15, head ➔ [5|null]',
    realLife: [
      'Memory management & allocation systems in operating systems.',
      'Undo buffers in graphic design tools (Photoshop canvas steps).',
      'Depth-First Search (DFS) graph traversal tracking.'
    ],
    howToUse: [
      'Click "Push" to allocate a node at the head.',
      'Click "Pop" to unlink the head node.'
    ],
    keyPoints: 'Dynamic memory allocation prevents stack overflow errors.'
  },
  'STACK_EXPRESSION': {
    title: 'Expression Evaluator',
    summary: 'Evaluates mathematical equations (Infix / Postfix) using an operand stack.',
    formula: 'On operand: push(val). On operator op: b = pop(), a = pop(), push(a op b)',
    example: 'Evaluate Postfix "3 4 + 2 *":\n1. Push 3, Push 4 ➔ stack = [3, 4]\n2. "+": b=4, a=3, 3+4=7 ➔ push 7 ➔ stack = [7]\n3. Push 2 ➔ stack = [7, 2]\n4. "*": b=2, a=7, 7*2=14 ➔ push 14 ➔ Final result = 14',
    realLife: [
      'Scientific calculators (HP calculators using Reverse Polish Notation).',
      'Compiler expression parsing engines (GCC, Clang, V8 JS Engine).',
      'Spreadsheet formula computation in Excel & Google Sheets.'
    ],
    howToUse: [
      'Enter a postfix string like "3 4 + 2 *".',
      'Click "Evaluate" to watch numbers get pushed and combined step-by-step.'
    ],
    keyPoints: 'Operators pop top operands, perform arithmetic, and push back results.'
  },
  'STACK_BRACKETS': {
    title: 'Bracket Evaluator',
    summary: 'Checks if parentheses (), {}, and [] are correctly balanced and closed in matching order.',
    formula: 'If open bracket `(,{,[` ➔ push(ch). If close bracket `),},]` ➔ match with pop().',
    example: 'Check "{ [ ] }":\n1. Push "{", Push "[" ➔ stack = ["{", "["]\n2. Read "]": matches top "[", pop() ➔ stack = ["{"]\n3. Read "}": matches top "{", pop() ➔ stack = [] (Balanced!)',
    realLife: [
      'IDE code syntax validation (VS Code highlighting missing brackets).',
      'HTML/XML tag matching (`<div>` ... `</div>`).',
      'JSON parser structural syntax checkers.'
    ],
    howToUse: [
      'Enter a string containing brackets like "{ [ ( ) ] }".',
      'Click "Check Balance" to step through matching and popping.'
    ],
    keyPoints: 'Every closing bracket must match the most recently opened bracket on top of the stack.'
  },
  'STACK_CONVERSION': {
    title: 'Infix to Postfix Converter',
    summary: 'Translates human-readable math expressions (A + B * C) into machine-friendly Postfix (A B C * +).',
    formula: 'Higher precedence operators pop lower precedence ones from stack onto output.',
    example: 'Convert "A + B * C":\n1. Output = "A", Push "+"\n2. Output = "A B", Push "*"\n3. Output = "A B C", Pop "*", Pop "+" ➔ Postfix = "A B C * +"',
    realLife: [
      'Compiler code generators translating source code to assembly instructions.',
      'Database query execution plan optimization.',
      'Math evaluation microservices.'
    ],
    howToUse: [
      'Enter an infix equation like "A + B * C".',
      'Click "Convert" to watch operators rearrange based on precedence.'
    ],
    keyPoints: 'Eliminates need for parentheses by placing operators directly after operands.'
  },

  // ─── QUEUE ─────────────────────────────────────────────────────────────
  'QUEUE_SIMPLE': {
    title: 'Simple Queue (FIFO)',
    summary: 'First-In, First-Out queue where items enter at rear and leave at front.',
    formula: 'Enqueue: queue[rear++] = val  |  Dequeue: val = queue[front++]',
    example: '1. Enqueue(10) ➔ queue = [10], front=0, rear=1\n2. Enqueue(20) ➔ queue = [10, 20], front=0, rear=2\n3. Dequeue() ➔ returns 10, front=1, rear=2',
    realLife: [
      'Printer job spooling queues (documents printed in order submitted).',
      'Web server incoming HTTP request queue (handling traffic spikes).',
      'Ticket booking queues (BookMyShow / IRCTC online waiting rooms).'
    ],
    howToUse: [
      'Click Enqueue to add an item to the rear.',
      'Click Dequeue to process and remove the front item.'
    ],
    keyPoints: 'First person to enter the line is always served first.'
  },
  'QUEUE_CIRCULAR': {
    title: 'Circular Queue (Ring Buffer)',
    summary: 'Connects the last position back to the first position to reuse empty array slots.',
    formula: 'rear = (rear + 1) % capacity  |  front = (front + 1) % capacity',
    example: 'Capacity = 5, rear = 4:\nNext position = (4 + 1) % 5 = 0 (wraps around to index 0!)\nReuses front slots freed by Dequeue without moving existing items.',
    realLife: [
      'CPU time-sharing scheduling (Round-Robin OS process scheduling).',
      'Audio & Video streaming buffering (YouTube buffer ring).',
      'Traffic light signal timing controllers.'
    ],
    howToUse: [
      'Fill up the circular queue.',
      'Dequeue items to free up front slots.',
      'Enqueue new items to observe rear wrapping back around to index 0!'
    ],
    keyPoints: 'Eliminates wasted memory slots without shifting array items.'
  },
  'QUEUE_DEQUE': {
    title: 'Deque (Double-Ended Queue)',
    summary: 'Queue allowing insertion and deletion from both front and rear ends.',
    formula: 'Insert/Delete at front OR rear in O(1) time.',
    example: '1. AddRear(10) ➔ [10]\n2. AddFront(5) ➔ [5, 10]\n3. RemoveRear() ➔ returns 10, deque = [5]',
    realLife: [
      'Browser forward/backward history navigation buffers.',
      'Sliding window maximum/minimum algorithms in data analysis.',
      'Undo-Redo history stacks with maximum capacity caps.'
    ],
    howToUse: [
      'Use "Add Front" / "Add Rear" to push items to either side.',
      'Use "Remove Front" / "Remove Rear" to pop items from either side.'
    ],
    keyPoints: 'Combines full flexibility of both Stack and Queue data structures.'
  },
  'QUEUE_PRIORITY': {
    title: 'Priority Queue (Min / Max Heap)',
    summary: 'Queue where each item has an associated priority; highest priority items are served first.',
    formula: 'Parent(i) = ⌊(i-1)/2⌋  |  Left(i) = 2i+1  |  Right(i) = 2i+2',
    example: 'Min-Heap with values [10, 20, 15]:\n1. Insert 5 ➔ Bubbles up to root ➔ Root becomes 5!\n2. Dequeue() ➔ Returns 5 (minimum) and rebalances heap to [10, 20, 15].',
    realLife: [
      'Hospital emergency room triage (critical patients treated first).',
      'Dijkstra Shortest Path algorithm edge selection.',
      'Bandwidth management (VIP video packets prioritized over downloads).'
    ],
    howToUse: [
      'Enqueue items with values.',
      'Click Dequeue to watch the highest-priority item get extracted.'
    ],
    keyPoints: 'Underlying data structure powering heaps and greedy graph algorithms.'
  },

  // ─── LINKED LIST ───────────────────────────────────────────────────────
  'LL_SINGLY': {
    title: 'Singly Linked List',
    summary: 'A chain of nodes where each node contains data and a pointer to the next node.',
    formula: 'newNode.next = head; head = newNode',
    example: 'Node(10, next=null) ➔ Node(20, next=null)\nLink 10 ➔ 20: Node(10).next = Node(20)',
    realLife: [
      'Image viewer slideshow (next photo pointer).',
      'Music playlist "Next Track" queue.',
      'Hash Table Separate Chaining bucket storage.'
    ],
    howToUse: [
      'Click "Insert Head" or "Insert Tail" to add nodes.',
      'Traverse rightwards along pointers.'
    ],
    keyPoints: 'Dynamic memory allocation with fast O(1) head insertion.'
  },
  'LL_DOUBLY': {
    title: 'Doubly Linked List',
    summary: 'Nodes maintain two pointers: `prev` to previous node and `next` to next node.',
    formula: 'newNode.next = curr; newNode.prev = curr.prev; curr.prev = newNode',
    example: '[null ⇇ Node(10) ⇄ Node(20) ⇉ null]\nAllows moving both forward (next) and backward (prev).',
    realLife: [
      'Browser tabs switching (forward ⇄ backward).',
      'LRU Cache implementation (O(1) node removal and re-insertion).',
      'Music player Next ⏭ / Previous ⏮ song navigation.'
    ],
    howToUse: [
      'Add nodes and observe bidirectional arrows (prev ↔ next).',
      'Delete nodes and watch both neighboring pointers re-link.'
    ],
    keyPoints: 'Allows efficient forward and backward list traversal.'
  },
  'LL_CIRCULAR': {
    title: 'Circular Linked List',
    summary: 'Linked list where the tail node points back to head node forming a continuous loop.',
    formula: 'tail.next = head',
    example: '[Node(10)] ➔ [Node(20)] ➔ [Node(30)] ➔ (points back to Node(10))',
    realLife: [
      'Multiplayer turn-based board games (Player 1 ➔ 2 ➔ 3 ➔ 1...).',
      'Operating System Round-Robin CPU process scheduling.',
      'Continuous carousel photo galleries.'
    ],
    howToUse: [
      'Observe the curved connection arrow from tail back to head.',
      'Traverse continuously around the ring.'
    ],
    keyPoints: 'No node contains a `null` ending pointer.'
  },
  'LL_POLYNOMIAL': {
    title: 'Polynomial ADT (Linked List)',
    summary: 'Represents mathematical terms like `3x² + 2x + 5` as linked nodes of `(coefficient, exponent)`.',
    formula: 'Term Node = (coeff, exp, next)',
    example: 'Polynomial A: 3x² + 5\nPolynomial B: 2x² + 4\nAddition: Add terms with same exponent (3+2)x² + (5+4) = 5x² + 9',
    realLife: [
      'Computer Algebra Systems (CAS) like Mathematica & Maple.',
      'Scientific physics simulations & curve fitting.',
      'Graphic rendering curve calculations (Bezier curves).'
    ],
    howToUse: [
      'Enter two polynomials in the inputs.',
      'Click Add (+) or Multiply (*) to observe term-by-term node merging.'
    ],
    keyPoints: 'Stores only non-zero terms efficiently without wasting memory.'
  },

  // ─── HASH TABLES ───────────────────────────────────────────────────────
  'HASH_CHAINING': {
    title: 'Hash Table (Separate Chaining)',
    summary: 'Collision handling technique where every table slot points to a linked list chain.',
    formula: 'index = key % size',
    example: 'Table size M = 7:\n1. Key = 15: index = 15 % 7 = 1 ➔ bucket[1] = [15]\n2. Key = 22: index = 22 % 7 = 1 ➔ Collision! Linked to bucket[1]: [15] ➔ [22]\n3. Both keys co-exist cleanly in index 1 linked list!',
    realLife: [
      'Database indexing (PostgreSQL / MySQL hash indexes).',
      'Compiler symbol tables storing variable declarations & scope.',
      'In-memory caches like Redis key-value lookups.'
    ],
    howToUse: [
      'Enter values and click Insert.',
      'Observe keys mapping to index `key % size`. Colliding keys chain together!'
    ],
    keyPoints: 'Table never fills up (no overflow). Handles high load factors gracefully.'
  },
  'HASH_LINEAR': {
    title: 'Hash Table (Linear Probing)',
    summary: 'Open addressing method checking consecutive slots `(hash + i) % size` on collision.',
    formula: 'slot = (key % size + i) % size  for i = 0, 1, 2, ...',
    example: 'Table size M = 7:\n1. Insert 14: 14 % 7 = 0 ➔ slot 0 filled\n2. Insert 21: 21 % 7 = 0 ➔ Collision at 0! Try i=1: (0 + 1) % 7 = 1 ➔ placed at slot 1.\n3. Insert 28: 28 % 7 = 0 ➔ Collides at 0, 1! Try i=2: (0 + 2) % 7 = 2 ➔ placed at slot 2.',
    realLife: [
      'High-speed CPU cache-friendly hash maps (Google Abseil flat_hash_map).',
      'Embedded systems with strict memory allocation bounds.',
      'Router IP lookup tables.'
    ],
    howToUse: [
      'Insert values with identical remainder modulo table size.',
      'Watch probing step through index `+1`, `+2`, `+3` until an open slot is found.'
    ],
    keyPoints: 'Contiguous memory layout provides superior CPU cache performance.'
  },
  'HASH_QUADRATIC': {
    title: 'Hash Table (Quadratic Probing)',
    summary: 'Open addressing probing non-linear quadratic square offsets `(hash + i²) % size`.',
    formula: 'slot = (key % size + i²) % size  for i = 0, 1, 2, ...',
    example: 'Table size M = 7, initial hash = 2:\n1. Collision at slot 2!\n2. i = 1: (2 + 1²) % 7 = 3 % 7 = 3 (Checks slot 3)\n3. i = 2: (2 + 2²) % 7 = 6 % 7 = 6 (Checks slot 6)\n4. i = 3: (2 + 3²) % 7 = 11 % 7 = 4 (Checks slot 4)\nJumps quadratically (+1, +4, +9) to avoid contiguous block clustering!',
    realLife: [
      'High-performance memory allocation tables.',
      'Distributed hash tables (DHT) peer node lookup.',
      'Database query caching layers.'
    ],
    howToUse: [
      'Insert keys that collide.',
      'Watch probing skip forward by square values (+1, +4, +9, +16...)!'
    ],
    keyPoints: 'Eliminates primary clustering by jumping away quadratically.'
  },
  'HASH_MULTIPLICATION': {
    title: 'Hash Table (Multiplication Method)',
    summary: 'Calculates hash using Knuth’s golden ratio constant A ≈ 0.6180339887.',
    formula: 'h(k) = ⌊ M × ((k × A) mod 1) ⌋  where A = (√5 - 1) / 2 ≈ 0.6180339887',
    example: 'Key k = 123, Table Size M = 100, A = 0.6180339887:\n1. k × A = 123 × 0.6180339887 = 76.0181806\n2. Fractional part = 76.0181806 mod 1 = 0.0181806\n3. Multiply by M = 100 × 0.0181806 = 1.81806\n4. Floor ⌊1.81806⌋ = 1 ➔ Hash Index = 1',
    realLife: [
      'Hash functions in programming language runtimes (Java, Python dicts).',
      'Cryptography pseudo-random hash generators.',
      'File checksum hashing algorithms.'
    ],
    howToUse: [
      'Insert numbers and watch the fractional part extracted and multiplied.',
      'Observe uniform key distribution regardless of table size power.'
    ],
    keyPoints: 'Works well for any table size M (especially powers of 2).'
  },
  'HASH_FOLDING': {
    title: 'Hash Table (Folding Method)',
    summary: 'Splits key into equal digit groups, sums them together, and takes modulo `size`.',
    formula: 'h(k) = (Chunk₁ + Chunk₂ + ... + Chunkₙ) % size',
    example: 'Key k = 567892, Table Size M = 100, Chunk size = 2 digits:\n1. Split key into 2-digit pairs: 56, 78, 92\n2. Sum the chunks: 56 + 78 + 92 = 226\n3. Modulo Table Size: 226 % 100 = 26\n➔ Hash Index = 26',
    realLife: [
      'Bank Account number validation & indexing.',
      'Book ISBN barcode verification hashing.',
      'Student Roll Number / Aadhaar / Social Security ID lookups.'
    ],
    howToUse: [
      'Enter a large integer key (e.g. 567892).',
      'Watch how the digits are folded in pairs, summed, and mapped to a slot.'
    ],
    keyPoints: 'Ideal for long numeric identifiers.'
  },

  // ─── TREES ─────────────────────────────────────────────────────────────
  'BST': {
    title: 'Binary Search Tree (BST)',
    summary: 'Binary tree where left node < parent and right node > parent.',
    formula: 'Left < Parent < Right',
    example: 'Insert [50, 30, 70, 20]:\n1. 50 becomes Root\n2. 30 < 50 ➔ Left child of 50\n3. 70 > 50 ➔ Right child of 50\n4. 20 < 50 ➔ Left ➔ 20 < 30 ➔ Left child of 30',
    realLife: [
      'File system directory hierarchy indexing.',
      'Auto-complete dropdown dictionary search.',
      'Game spatial decision trees.'
    ],
    howToUse: ['Insert values and inspect binary decision tree branching.'],
    keyPoints: 'Enables fast binary search when tree remains balanced.'
  },
  'AVL': {
    title: 'AVL Tree (Self-Balancing BST)',
    summary: 'Self-balancing BST maintaining height balance factor |h_left - h_right| ≤ 1.',
    formula: 'Balance Factor = Height(Left Subtree) - Height(Right Subtree) ∈ {-1, 0, 1}',
    example: 'Insert 1, 2, 3 in order:\n1. Insert 1 ➔ Root(1)\n2. Insert 2 ➔ 1 ➔ Right(2)\n3. Insert 3 ➔ 1 ➔ 2 ➔ Right(3)\n4. Balance Factor at Root(1) = 0 - 2 = -2 (Unbalanced RR!)\n5. Perform Left Rotation at Root(1) ➔ New Root = 2, Left = 1, Right = 3!',
    realLife: [
      'Database memory lookup indexes (frequent lookups, infrequent writes).',
      'Network router routing table lookups.',
      'Memory allocation freelist tracking.'
    ],
    howToUse: ['Insert sequential numbers (1, 2, 3, 4, 5) to watch auto-rotations.'],
    keyPoints: 'Strictly guarantees O(log N) tree height via automatic rotations.'
  },

  // ─── SORT & SEARCH ─────────────────────────────────────────────────────
  'Bubble Sort': {
    title: 'Bubble Sort',
    summary: 'Repeatedly swaps adjacent elements if left > right.',
    formula: 'if arr[j] > arr[j+1] ➔ swap(arr[j], arr[j+1])',
    example: 'Input = [5, 1, 4]:\nPass 1:\n- Compare 5 & 1: 5 > 1 ➔ Swap ➔ [1, 5, 4]\n- Compare 5 & 4: 5 > 4 ➔ Swap ➔ [1, 4, 5] (5 placed at end!)\nPass 2:\n- Compare 1 & 4: 1 < 4 ➔ OK ➔ [1, 4, 5] (Sorted!)',
    realLife: [
      'Educational demonstration of computer science sorting logic.',
      'Small array sorting in embedded microcontrollers with minimal code memory.',
      'Detecting near-sorted arrays with early exit flags.'
    ],
    howToUse: ['Watch larger values bubble right pass by pass.'],
    keyPoints: 'Simple baseline sorting algorithm.'
  },
  'Quick Sort': {
    title: 'Quick Sort',
    summary: 'Partitions array around a pivot element.',
    formula: 'Partition: elements ≤ pivot go left, elements > pivot go right',
    example: 'Input = [4, 2, 7, 1, 3], Pivot = 3:\n1. Partition items relative to 3: [2, 1] | 3 | [4, 7]\n2. Pivot 3 is now in its exact final position!\n3. Recursively sort left [2, 1] and right [4, 7].',
    realLife: [
      'Standard library sorting functions (`std::sort` in C++, `Arrays.sort()` in Java).',
      'Database engine query result ordering (`ORDER BY`).',
      'E-commerce product price filtering (Low to High).'
    ],
    howToUse: ['Watch pivot element settle into place after partitioning.'],
    keyPoints: 'Fastest in-place general-purpose sorting algorithm.'
  },
  'Binary Search': {
    title: 'Binary Search',
    summary: 'Searches sorted array by halving search range at every step.',
    formula: 'mid = ⌊(low + high) / 2⌋  |  If target < arr[mid] ➔ high = mid - 1  |  Else ➔ low = mid + 1',
    example: 'Sorted Array = [10, 20, 30, 40, 50, 60, 70], Target = 60:\n1. low=0, high=6 ➔ mid = (0+6)/2 = 3 (val = 40)\n2. 60 > 40 ➔ low = mid + 1 = 4\n3. low=4, high=6 ➔ mid = (4+6)/2 = 5 (val = 60)\n4. Match found at index 5 in just 2 steps!',
    realLife: [
      'Dictionary / Phonebook word lookup.',
      'Database B-Tree index searching.',
      'Debugging via Git Bisect (finding commit that introduced a bug).'
    ],
    howToUse: ['Watch search boundary [low, high] cut in half at every step.'],
    keyPoints: 'Extremely fast logarithmic search on sorted arrays.'
  },

  // ─── GRAPH ─────────────────────────────────────────────────────────────
  'Dijkstra': {
    title: "Dijkstra's Shortest Path Algorithm",
    summary: "Finds shortest path from start node to all other nodes in a non-negative weighted graph.",
    formula: "dist[v] = min(dist[v], dist[u] + weight(u, v))",
    example: "Start Node A (dist A=0, all others=∞):\n1. Edge A ➔ B (weight 4): dist[B] = min(∞, 0 + 4) = 4\n2. Edge A ➔ C (weight 2): dist[C] = min(∞, 0 + 2) = 2\n3. Pick unvisited min node C (dist 2). Edge C ➔ B (weight 1):\n   dist[B] = min(4, 2 + 1) = 3! (Shorter path found via C!)",
    realLife: [
      'Google Maps & Apple Maps GPS navigation route calculation.',
      'Network packet routing protocols (OSPF - Open Shortest Path First).',
      'Flight connection planning (cheapest/shortest flights).'
    ],
    howToUse: ["Watch node distances relax dynamically using Priority Queue."],
    keyPoints: "Greedy choice guarantees shortest distance for non-negative weights."
  },

  // ─── DP & GREEDY ───────────────────────────────────────────────────────
  'LCS': {
    title: 'Longest Common Subsequence (LCS)',
    summary: 'Finds longest subsequence present in 2 strings in same relative order.',
    formula: 'if str1[i-1] == str2[j-1] ➔ dp[i][j] = 1 + dp[i-1][j-1]  else ➔ dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    example: 'String 1 = "ABC", String 2 = "AC":\n1. Match "A" == "A": 1 + dp[0][0] = 1\n2. "B" != "C": max(dp[A][C], dp[AB][A]) = 1\n3. Match "C" == "C": 1 + dp[AB][A] = 2\n➔ LCS Length = 2 ("AC")',
    realLife: [
      'Git Diff tool (`git diff` comparing code line changes).',
      'Bioinformatics DNA & Protein sequence alignment.',
      'Plagiarism detection software.'
    ],
    howToUse: ['Watch 2D DP matrix populate step-by-step.'],
    keyPoints: 'Subsequences do not need to occupy contiguous positions.'
  },
  'Knapsack': {
    title: '0/1 Knapsack Problem',
    summary: 'Selects items with weights & values to maximize total value within capacity W.',
    formula: 'if wt[i-1] ≤ w ➔ dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])  else ➔ dp[i-1][w]',
    example: 'Capacity W = 5, Item 1 (wt=2, val=6), Item 2 (wt=3, val=10):\n- At capacity 5: max(include Item 2: 10 + dp[1][5-3], exclude Item 2: dp[1][5])\n= max(10 + 6, 6) = 16 (Include both items! Max Value = 16)',
    realLife: [
      'Financial portfolio asset allocation (maximizing return within risk limit).',
      'Cargo truck / Container shipping weight optimization.',
      'Cloud Server resource allocation (CPU / RAM budget limits).'
    ],
    howToUse: ['Watch DP table compute max value for every sub-capacity.'],
    keyPoints: 'Each item can either be taken (1) or left (0).'
  }
};
