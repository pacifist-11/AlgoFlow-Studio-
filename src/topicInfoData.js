// Educational Topic Info Guides with Formulas, Numerical Examples & Unique Real-Life Applications for Beginners

export const TOPIC_INFO = {
  // ─── STACK ─────────────────────────────────────────────────────────────
  'STACK_ARRAY': {
    title: 'Stack (Array Based)',
    summary: 'A Last-In, First-Out (LIFO) linear data structure where elements are pushed and popped from a single top pointer.',
    formula: 'Push: stack[++top] = val  |  Pop: val = stack[top--]',
    example: '1. Push(10) ➔ top = 0, stack = [10]\n2. Push(20) ➔ top = 1, stack = [10, 20]\n3. Pop() ➔ returns 20, top = 0, stack = [10]',
    realLife: [
      'Text Editor Undo Buffer (Ctrl+Z) storing character edit steps.',
      'Web Browser History Back button returning to previous URLs.',
      'Function call stack execution in C/C++/Java runtime memory.'
    ],
    howToUse: [
      'Enter a number in the input field and click "Push".',
      'Click "Pop" to remove the top item.',
      'Click "Peek" to view the top element without removing it.'
    ],
    pros: [
      'Fast O(1) push and pop operations.',
      'Low memory overhead (no pointers stored).'
    ],
    cons: [
      'Fixed maximum size limit.',
      'Wastes memory if capacity is underutilized.'
    ],
    keyPoints: 'Strict LIFO discipline: the last element added is always processed first.'
  },
  'STACK_LL': {
    title: 'Stack (Linked List Based)',
    summary: 'A dynamic LIFO stack implemented with linked nodes to handle unlimited elements without fixed size bounds.',
    formula: 'Push: newNode.next = head; head = newNode  |  Pop: val = head.val; head = head.next',
    example: '1. Push(5): head ➔ [5|null]\n2. Push(15): [15|next] ➔ [5|null], head = [15]\n3. Pop(): returns 15, head ➔ [5|null]',
    realLife: [
      'Photoshop & Figma infinite undo action history stack.',
      'Operating System interrupt request (IRQ) handling stack.',
      'Compiler Depth-First AST syntax tree parsing stack.'
    ],
    howToUse: [
      'Click "Push" to allocate a node at the head.',
      'Click "Pop" to unlink the head node.'
    ],
    pros: [
      'Dynamic size (no overflow).',
      'Memory allocated only when needed.'
    ],
    cons: [
      'Extra memory used for pointer addresses.',
      'Slightly slower due to heap allocations.'
    ],
    keyPoints: 'Dynamic memory allocation prevents stack overflow errors.'
  },
  'STACK_EXPRESSION': {
    title: 'Expression Evaluator',
    summary: 'Evaluates mathematical equations (Infix / Postfix) using an operand stack.',
    formula: 'On operand: push(val). On operator op: b = pop(), a = pop(), push(a op b)',
    example: 'Evaluate Postfix "3 4 + 2 *":\n1. Push 3, Push 4 ➔ stack = [3, 4]\n2. "+": b=4, a=3, 3+4=7 ➔ push 7 ➔ stack = [7]\n3. Push 2 ➔ stack = [7, 2]\n4. "*": b=2, a=7, 7*2=14 ➔ push 14 ➔ Final result = 14',
    realLife: [
      'Scientific Reverse Polish Notation (RPN) financial calculators.',
      'Excel & Google Sheets formula evaluation engine (`SUM(A1:A5) * 1.1`).',
      'JavaScript V8 Engine bytecode arithmetic instruction interpreter.'
    ],
    howToUse: [
      'Enter a postfix string like "3 4 + 2 *".',
      'Click "Evaluate" to watch numbers get pushed and combined step-by-step.'
    ],
    pros: [
      'Systematic evaluation without parenthesis.',
      'Excellent for machine code interpretation.'
    ],
    cons: [
      'Requires conversion from infix to postfix.',
      'Debugging complex expressions can be difficult.'
    ],
    keyPoints: 'Operators pop top operands, perform arithmetic, and push back results.'
  },
  'STACK_BRACKETS': {
    title: 'Bracket Evaluator',
    summary: 'Checks if parentheses (), {}, and [] are correctly balanced and closed in matching order.',
    formula: 'If open bracket `(,{,[` ➔ push(ch). If close bracket `),},]` ➔ match with pop().',
    example: 'Check "{ [ ] }":\n1. Push "{", Push "[" ➔ stack = ["{", "["]\n2. Read "]": matches top "[", pop() ➔ stack = ["{"]\n3. Read "}": matches top "{", pop() ➔ stack = [] (Balanced!)',
    realLife: [
      'VS Code & IDE automatic syntax matching highlighting missing `}`, `]`, `)`.',
      'HTML / XML tag validator (ensuring `<div><span></span></div>` is balanced).',
      'JSON parser checking payload syntax integrity.'
    ],
    howToUse: [
      'Enter a string containing brackets like "{ [ ( ) ] }".',
      'Click "Check Balance" to step through matching and popping.'
    ],
    pros: [
      'Linear time complexity O(N).',
      'Simple and elegant implementation.'
    ],
    cons: [
      'Requires extra stack storage space.',
      'Only checks syntax structure, not semantic meaning.'
    ],
    keyPoints: 'Every closing bracket must match the most recently opened bracket on top of the stack.'
  },
  'STACK_CONVERSION': {
    title: 'Infix to Postfix Converter',
    summary: 'Translates human-readable math expressions (A + B * C) into machine-friendly Postfix (A B C * +).',
    formula: 'Higher precedence operators pop lower precedence ones from stack onto output.',
    example: 'Convert "A + B * C":\n1. Output = "A", Push "+"\n2. Output = "A B", Push "*"\n3. Output = "A B C", Pop "*", Pop "+" ➔ Postfix = "A B C * +"',
    realLife: [
      'Compiler code generators converting source math to assembly CPU opcodes.',
      'Database SQL query optimizer converting WHERE clause math into evaluation trees.',
      'Mathematical graph plotting engines evaluating functions.'
    ],
    howToUse: [
      'Enter an infix equation like "A + B * C".',
      'Click "Convert" to watch operators rearrange based on precedence.'
    ],
    pros: [
      'Facilitates mathematical parsing.',
      'Handles operator precedence accurately.'
    ],
    cons: [
      'Requires temporary stack storage.',
      'Harder for humans to read the output directly.'
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
      'Office Printer document queue (files print in exact order submitted).',
      'Call Center customer support queue ("Your call is 3rd in line").',
      'Ticket Booking queues (IRCTC / BookMyShow online waiting rooms).'
    ],
    howToUse: [
      'Click Enqueue to add an item to the rear.',
      'Click Dequeue to process and remove the front item.'
    ],
    pros: [
      'Maintains strict FIFO order.',
      'Simple to implement.'
    ],
    cons: [
      'Array shifts or pointer gaps cause memory waste.',
      'Cannot easily access middle elements.'
    ],
    keyPoints: 'First person to enter the line is always served first.'
  },
  'QUEUE_CIRCULAR': {
    title: 'Circular Queue (Ring Buffer)',
    summary: 'Connects the last position back to the first position to reuse empty array slots.',
    formula: 'rear = (rear + 1) % capacity  |  front = (front + 1) % capacity',
    example: 'Capacity = 5, rear = 4:\nNext position = (4 + 1) % 5 = 0 (wraps around to index 0!)\nReuses front slots freed by Dequeue without moving existing items.',
    realLife: [
      'Operating System Round-Robin CPU process time-slicing scheduler.',
      'Real-time Streaming Media Buffers (YouTube / Spotify audio ring buffer).',
      'Automated traffic light signal timing loop controllers.'
    ],
    howToUse: [
      'Fill up the circular queue.',
      'Dequeue items to free up front slots.',
      'Enqueue new items to observe rear wrapping back around to index 0!'
    ],
    pros: [
      'Efficient reuse of array space.',
      'No need to shift elements.'
    ],
    cons: [
      'Fixed capacity limit.',
      'Harder to implement and debug.'
    ],
    keyPoints: 'Eliminates wasted memory slots without shifting array items.'
  },
  'QUEUE_DEQUE': {
    title: 'Deque (Double-Ended Queue)',
    summary: 'Queue allowing insertion and deletion from both front and rear ends.',
    formula: 'Insert/Delete at front OR rear in O(1) time.',
    example: '1. AddRear(10) ➔ [10]\n2. AddFront(5) ➔ [5, 10]\n3. RemoveRear() ➔ returns 10, deque = [5]',
    realLife: [
      'Browser forward and backward history navigation buffers.',
      'Sliding Window Maximum algorithm in stock market ticker analysis.',
      'Work-stealing thread pools in Java ForkJoinPool & Go goroutine schedulers.'
    ],
    howToUse: [
      'Use "Add Front" / "Add Rear" to push items to either side.',
      'Use "Remove Front" / "Remove Rear" to pop items from either side.'
    ],
    pros: [
      'Insert/delete from both ends in O(1).',
      'Highly versatile.'
    ],
    cons: [
      'Higher pointer storage overhead.',
      'Complex pointer management in linked lists.'
    ],
    keyPoints: 'Combines full flexibility of both Stack and Queue data structures.'
  },
  'QUEUE_PRIORITY': {
    title: 'Priority Queue (Min / Max Heap)',
    summary: 'Queue where each item has an associated priority; highest priority items are served first.',
    formula: 'Parent(i) = ⌊(i-1)/2⌋  |  Left(i) = 2i+1  |  Right(i) = 2i+2',
    example: 'Min-Heap with values [10, 20, 15]:\n1. Insert 5 ➔ Bubbles up to root ➔ Root becomes 5!\n2. Dequeue() ➔ Returns 5 (minimum) and rebalances heap to [10, 20, 15].',
    realLife: [
      'Hospital Emergency Room triage (critical trauma patients treated ahead of cold/fever).',
      'Air Traffic Control landing priority (fuel-deficient planes land ahead of scheduled flights).',
      'Bandwidth Quality of Service (QoS) prioritizing Zoom video packets over downloads.'
    ],
    howToUse: [
      'Enqueue items with values.',
      'Click Dequeue to watch the highest-priority item get extracted.'
    ],
    pros: [
      'Always extracts min/max in O(log N).',
      'Self-balancing heap structure.'
    ],
    cons: [
      'Search for an arbitrary element is slow O(N).',
      'High overhead for sorted sequences.'
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
      'Music Player "Play Next" queue where each song points to the next track.',
      'Image Carousel slider in e-commerce sites (next photo link).',
      'Hash Table Separate Chaining bucket storage for collision chains.'
    ],
    howToUse: [
      'Click "Insert Head" or "Insert Tail" to add nodes.',
      'Traverse rightwards along pointers.'
    ],
    pros: [
      'Dynamic sizing (grows as needed).',
      'Fast insertion/deletion at head O(1).'
    ],
    cons: [
      'Cannot traverse backward.',
      'No random access (requires O(N) traversal).'
    ],
    keyPoints: 'Dynamic memory allocation with fast O(1) head insertion.'
  },
  'LL_DOUBLY': {
    title: 'Doubly Linked List',
    summary: 'Nodes maintain two pointers: `prev` to previous node and `next` to next node.',
    formula: 'newNode.next = curr; newNode.prev = curr.prev; curr.prev = newNode',
    example: '[null ⇇ Node(10) ⇄ Node(20) ⇉ null]\nAllows moving both forward (next) and backward (prev).',
    realLife: [
      'Browser Tab Navigation (switching forward ⇄ backward between adjacent tabs).',
      'LRU Cache implementation (O(1) node detachment and head promotion).',
      'Media Player timeline scrubbing (Next / Previous song navigation).'
    ],
    howToUse: [
      'Add nodes and observe bidirectional arrows (prev ↔ next).',
      'Delete nodes and watch both neighboring pointers re-link.'
    ],
    pros: [
      'Bidirectional traversal.',
      'O(1) deletion of a node if given its pointer.'
    ],
    cons: [
      'Extra memory for `prev` pointers.',
      'Complex pointer manipulation code.'
    ],
    keyPoints: 'Allows efficient forward and backward list traversal.'
  },
  'LL_CIRCULAR': {
    title: 'Circular Linked List',
    summary: 'Linked list where the tail node points back to head node forming a continuous loop.',
    formula: 'tail.next = head',
    example: '[Node(10)] ➔ [Node(20)] ➔ [Node(30)] ➔ (points back to Node(10))',
    realLife: [
      'Multiplayer turn-based board games (Player 1 ➔ Player 2 ➔ Player 3 ➔ Player 1...).',
      'Task Manager Alt+Tab window switching selection ring.',
      'Digital billboard advertising display loop (Ad 1 ➔ Ad 2 ➔ Ad 3 ➔ Ad 1...).'
    ],
    howToUse: [
      'Observe the curved connection arrow from tail back to head.',
      'Traverse continuously around the ring.'
    ],
    pros: [
      'Infinite loop navigation.',
      'Any node can be a starting point.'
    ],
    cons: [
      'Endless loops if not terminated correctly.',
      'Self-referencing makes debugging trickier.'
    ],
    keyPoints: 'No node contains a `null` ending pointer.'
  },
  'LL_POLYNOMIAL': {
    title: 'Polynomial ADT (Linked List)',
    summary: 'Represents mathematical terms like `3x² + 2x + 5` as linked nodes of `(coefficient, exponent)`.',
    formula: 'Term Node = (coeff, exp, next)',
    example: 'Polynomial A: 3x² + 5\nPolynomial B: 2x² + 4\nAddition: Add terms with same exponent (3+2)x² + (5+4) = 5x² + 9',
    realLife: [
      'Computer Algebra Systems (CAS) like Mathematica & Maple for symbolic calculus.',
      'Graphic rendering vector curve calculations (Bezier curves & splines).',
      'Physics engine trajectory calculations for sparse polynomial forces.'
    ],
    howToUse: [
      'Enter two polynomials in the inputs.',
      'Click Add (+) or Multiply (*) to observe term-by-term node merging.'
    ],
    pros: [
      'Sparsity-friendly (stores non-zero terms).',
      'Flexible polynomial sizes.'
    ],
    cons: [
      'High memory overhead per term.',
      'Slow term search times.'
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
      'Database indexing (PostgreSQL / MySQL hash indexes mapping keys to linked lists).',
      'Compiler symbol tables storing variable names and scope declarations.',
      'In-memory Key-Value stores like Redis storing colliding hash keys.'
    ],
    howToUse: [
      'Enter values and click Insert.',
      'Observe keys mapping to index `key % size`. Colliding keys chain together!'
    ],
    pros: [
      'Table never fills up (unlimited load factor).',
      'Very easy to implement.'
    ],
    cons: [
      'Requires extra memory for linked list nodes.',
      'Poor cache performance.'
    ],
    keyPoints: 'Table never fills up (no overflow). Handles high load factors gracefully.'
  },
  'HASH_LINEAR': {
    title: 'Hash Table (Linear Probing)',
    summary: 'Open addressing method checking consecutive slots `(hash + i) % size` on collision.',
    formula: 'slot = (key % size + i) % size  for i = 0, 1, 2, ...',
    example: 'Table size M = 7:\n1. Insert 14: 14 % 7 = 0 ➔ slot 0 filled\n2. Insert 21: 21 % 7 = 0 ➔ Collision at 0! Try i=1: (0 + 1) % 7 = 1 ➔ placed at slot 1.\n3. Insert 28: 28 % 7 = 0 ➔ Collides at 0, 1! Try i=2: (0 + 2) % 7 = 2 ➔ placed at slot 2.',
    realLife: [
      'High-performance C++ cache-friendly flat hash maps (Google Abseil flat_hash_map).',
      'Embedded microcontroller memory allocation tables.',
      'Network router IP routing table lookups.'
    ],
    howToUse: [
      'Insert values with identical remainder modulo table size.',
      'Watch probing step through index `+1`, `+2`, `+3` until an open slot is found.'
    ],
    pros: [
      'Excellent CPU cache performance.',
      'No pointer/list overhead.'
    ],
    cons: [
      'Suffers from primary clustering.',
      'Performance degrades as load factor > 0.7.'
    ],
    keyPoints: 'Contiguous memory layout provides superior CPU cache performance.'
  },
  'HASH_QUADRATIC': {
    title: 'Hash Table (Quadratic Probing)',
    summary: 'Open addressing probing non-linear quadratic square offsets `(hash + i²) % size`.',
    formula: 'slot = (key % size + i²) % size  for i = 0, 1, 2, ...',
    example: 'Table size M = 7, initial hash = 2:\n1. Collision at slot 2!\n2. i = 1: (2 + 1²) % 7 = 3 % 7 = 3 (Checks slot 3)\n3. i = 2: (2 + 2²) % 7 = 6 % 7 = 6 (Checks slot 6)\n4. i = 3: (2 + 3²) % 7 = 11 % 7 = 4 (Checks slot 4)\nJumps quadratically (+1, +4, +9) to avoid contiguous block clustering!',
    realLife: [
      'Distributed Peer-to-Peer network node lookup tables.',
      'Dynamic memory allocation freelist hashing layers.',
      'High-concurrency database query result caches.'
    ],
    howToUse: [
      'Insert keys that collide.',
      'Watch probing skip forward by square values (+1, +4, +9, +16...)!'
    ],
    pros: [
      'Eliminates primary clustering.',
      'No extra node memory needed.'
    ],
    cons: [
      'Can suffer from secondary clustering.',
      'May fail to find open slots even if table is not full.'
    ],
    keyPoints: 'Eliminates primary clustering by jumping away quadratically.'
  },
  'HASH_MULTIPLICATION': {
    title: 'Hash Table (Multiplication Method)',
    summary: 'Calculates hash using Knuth’s golden ratio constant A ≈ 0.6180339887.',
    formula: 'h(k) = ⌊ M × ((k × A) mod 1) ⌋  where A = (√5 - 1) / 2 ≈ 0.6180339887',
    example: 'Key k = 123, Table Size M = 100, A = 0.6180339887:\n1. k × A = 123 × 0.6180339887 = 76.0181806\n2. Fractional part = 76.0181806 mod 1 = 0.0181806\n3. Multiply by M = 100 × 0.0181806 = 1.81806\n4. Floor ⌊1.81806⌋ = 1 ➔ Hash Index = 1',
    realLife: [
      'Python dictionary internal hash calculation using golden ratio constant.',
      'Cryptographic pseudo-random number generators (PRNG).',
      'File checksum and digital signature hash distribution.'
    ],
    howToUse: [
      'Insert numbers and watch the fractional part extracted and multiplied.',
      'Observe uniform key distribution regardless of table size power.'
    ],
    pros: [
      'Uniform key distribution.',
      'Works well with any table size.'
    ],
    cons: [
      'Floating-point arithmetic is slower on some CPUs.',
      'Slightly more math overhead.'
    ],
    keyPoints: 'Works well for any table size M (especially powers of 2).'
  },
  'HASH_FOLDING': {
    title: 'Hash Table (Folding Method)',
    summary: 'Splits key into equal digit groups, sums them together, and takes modulo `size`.',
    formula: 'h(k) = (Chunk₁ + Chunk₂ + ... + Chunkₙ) % size',
    example: 'Key k = 567892, Table Size M = 100, Chunk size = 2 digits:\n1. Split key into 2-digit pairs: 56, 78, 92\n2. Sum the chunks: 56 + 78 + 92 = 226\n3. Modulo Table Size: 226 % 100 = 26\n➔ Hash Index = 26',
    realLife: [
      'Bank Account Number & Credit Card Luhn/Hash validation indexing.',
      'International Standard Book Number (ISBN) barcode verification.',
      'Employee ID / Social Security Number (SSN) database indexing.'
    ],
    howToUse: [
      'Enter a large integer key (e.g. 567892).',
      'Watch how the digits are folded in pairs, summed, and mapped to a slot.'
    ],
    pros: [
      'Excellent for long numeric keys.',
      'Simple integer arithmetic.'
    ],
    cons: [
      'Higher collision rates for structured keys.',
      'Chunk sizes must be pre-determined.'
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
      'File system directory hierarchy indexing (Mac Finder / Windows Explorer file search).',
      'Auto-complete search dictionary indexing.',
      'Game AI decision trees for path decision choices.'
    ],
    howToUse: ['Insert values and inspect binary decision tree branching.'],
    pros: [
      'Sorted order traversal.',
      'Dynamic memory allocation.'
    ],
    cons: [
      'Can degenerate to a linked list (worst case O(N)).',
      'No balance guarantees.'
    ],
    keyPoints: 'Enables fast binary search when tree remains balanced.'
  },
  'AVL': {
    title: 'AVL Tree (Self-Balancing BST)',
    summary: 'Self-balancing BST maintaining height balance factor |h_left - h_right| ≤ 1.',
    formula: 'Balance Factor = Height(Left Subtree) - Height(Right Subtree) ∈ {-1, 0, 1}',
    example: 'Insert 1, 2, 3 in order:\n1. Insert 1 ➔ Root(1)\n2. Insert 2 ➔ 1 ➔ Right(2)\n3. Insert 3 ➔ 1 ➔ 2 ➔ Right(3)\n4. Balance Factor at Root(1) = 0 - 2 = -2 (Unbalanced RR!)\n5. Perform Left Rotation at Root(1) ➔ New Root = 2, Left = 1, Right = 3!',
    realLife: [
      'High-read database indexing where lookups occur millions of times per second.',
      'Router IP subnet table lookups requiring strict O(log N) search times.',
      'In-memory database index trees (Oracle / DB2 index balancing).'
    ],
    howToUse: ['Insert sequential numbers (1, 2, 3, 4, 5) to watch auto-rotations.'],
    pros: [
      'Strict height balancing.',
      'Guaranteed O(log N) operations.'
    ],
    cons: [
      'Frequent balancing rotations during inserts.',
      'Slower write operations.'
    ],
    keyPoints: 'Strictly guarantees O(log N) tree height via automatic rotations.'
  },
  'RB_TREE': {
    title: 'Red-Black Tree',
    summary: 'Self-balancing BST using node colors (Red/Black) and rotations to maintain height balance.',
    formula: 'Root is Black. Red nodes cannot have Red children. Every path from node to leaves has same Black-height.',
    example: 'Insert 10, 20, 30:\n1. 10 inserted as Black Root\n2. 20 inserted as Red right child\n3. 30 inserted as Red ➔ Double Red violation! Rotate left at 10 and recolor 20 to Black!',
    realLife: [
      'Java `TreeMap` and `TreeSet` underlying data structure.',
      'C++ Standard Template Library `std::map` and `std::set` implementation.',
      'Linux kernel completely fair scheduler (CFS) process tracking tree.'
    ],
    howToUse: ['Insert numbers and watch color recoloring and rotations.'],
    pros: [
      'Fewer rotations than AVL on insert/delete.',
      'Excellent all-around lookup/write speed.'
    ],
    cons: [
      'Slightly taller tree than AVL.',
      'Extremely complex implementation.'
    ],
    keyPoints: 'Provides faster insertion/deletion than AVL trees due to fewer rebalancing rotations.'
  },
  'B_TREE': {
    title: 'B-Tree',
    summary: 'Self-balancing M-way search tree optimized for disk drives and database storage engines.',
    formula: 'Every internal node contains up to M-1 sorted keys and M child pointers.',
    example: 'Order M = 3:\n1. Node keys = [10, 20]. Insert 15 ➔ Node full [10, 15, 20]!\n2. Median key 15 splits node and moves up to parent node!',
    realLife: [
      'Relational Database storage engines (MySQL InnoDB, PostgreSQL disk index files).',
      'File Systems like NTFS, ext4, and HFS+ directory indexing on HDDs/SSDs.',
      'Distributed storage engines like Apache Cassandra B-Tree SSTables.'
    ],
    howToUse: ['Set Order (M=4) and insert numbers to watch nodes split.'],
    pros: [
      'Highly optimized for disk block reads.',
      'Very low tree height.'
    ],
    cons: [
      'Waste of memory in nodes with few keys.',
      'Complex key insertion splits and merges.'
    ],
    keyPoints: 'Keeps tree height extremely shallow to minimize disk read operations.'
  },
  'B_PLUS_TREE': {
    title: 'B+ Tree',
    summary: 'Variation of B-Tree where data/pointers exist ONLY in leaf nodes linked as a sequence list.',
    formula: 'Internal nodes store routing keys; Leaf nodes store data records linked via `next` pointers.',
    example: 'Range Query `10 to 30`:\n1. Search B+ Tree to find leaf node containing key 10.\n2. Follow leaf `next` pointers sequentially to retrieve 20 and 30 without re-traversing the tree!',
    realLife: [
      'Database sequential range queries (`SELECT * FROM sales WHERE date BETWEEN ...`).',
      'Mobile SQLite database engine used in Android and iOS apps.',
      'Mainframe disk volume block allocation indexing.'
    ],
    howToUse: ['Insert keys and observe how bottom leaves form a linked chain for range queries.'],
    pros: [
      'Extremely fast sequential range scans.',
      'Consistent search times.'
    ],
    cons: [
      'Redundant keys stored in internal nodes.',
      'Complex traversal logic.'
    ],
    keyPoints: 'Standard storage engine layout for high-throughput range scans.'
  },
  'SEGMENT_TREE': {
    title: 'Segment Tree',
    summary: 'Binary tree used for storing interval/range queries (sum, min, max) over an array.',
    formula: 'Parent node = RangeQuery(LeftChild) + RangeQuery(RightChild)',
    example: 'Array = [1, 3, 5, 7]:\n1. Root covers range [0, 3] with sum = 16\n2. Left child [0, 1] sum = 4, Right child [2, 3] sum = 12\n3. Range sum [1, 2] = val[1] + val[2] = 3 + 5 = 8 in O(log N) time!',
    realLife: [
      'Stock market range minimum/maximum price queries over time intervals `[start, end]`.',
      'Image processing range pixel intensity sum queries.',
      'Competitive programming range query & point update problems.'
    ],
    howToUse: ['Query range `[L, R]` or update an index to watch O(log N) range updates.'],
    pros: [
      'O(log N) range queries.',
      'O(log N) point updates.'
    ],
    cons: [
      'Requires 4N memory space.',
      'Implementation is complex for beginners.'
    ],
    keyPoints: 'Answers interval sum/min/max queries in O(log N) time.'
  },
  'FENWICK_TREE': {
    title: 'Fenwick Tree (Binary Indexed Tree / BIT)',
    summary: 'Array-based data structure using lowest significant bit (LSB) offsets for prefix sums.',
    formula: 'LSB(i) = i & (-i)  |  Next index to update: i += i & (-i)  |  Prefix sum: i -= i & (-i)',
    example: 'Calculate Prefix Sum up to index 7 (binary `0111`₂):\n1. i = 7 (`0111`₂): sum += BIT[7], i -= 1 ➔ i = 6 (`0110`₂)\n2. i = 6 (`0110`₂): sum += BIT[6], i -= 2 ➔ i = 4 (`0100`₂)\n3. i = 4 (`0100`₂): sum += BIT[4], i -= 4 ➔ i = 0 (Done in 3 bit steps!)',
    realLife: [
      'Cumulative frequency counting in data analytics & rank queries.',
      'Frequency distribution tracking in online gaming leaderboards.',
      'Signal processing running prefix sum calculations.'
    ],
    howToUse: ['Toggle BIT mode to inspect binary representations and `i += (i & -i)` index jumps.'],
    pros: [
      'Extremely memory efficient (O(N)).',
      'Simple to write.'
    ],
    cons: [
      'Only handles prefix sums easily.',
      'Difficult to adapt for arbitrary range queries.'
    ],
    keyPoints: 'Memory-efficient alternative to Segment Tree for prefix sum calculations.'
  },

  // ─── SORT & SEARCH ─────────────────────────────────────────────────────
  'Bubble Sort': {
    title: 'Bubble Sort',
    summary: 'Repeatedly swaps adjacent elements if left > right.',
    formula: 'if arr[j] > arr[j+1] ➔ swap(arr[j], arr[j+1])',
    example: 'Input = [5, 1, 4]:\nPass 1:\n- Compare 5 & 1: 5 > 1 ➔ Swap ➔ [1, 5, 4]\n- Compare 5 & 4: 5 > 4 ➔ Swap ➔ [1, 4, 5] (5 placed at end!)\nPass 2:\n- Compare 1 & 4: 1 < 4 ➔ OK ➔ [1, 4, 5] (Sorted!)',
    realLife: [
      'Educational demonstration of sorting mechanics in introductory computer science.',
      'Tiny array sorting in microcontrollers with limited RAM (e.g. 5-element sensor arrays).',
      'Detecting if an array is already sorted in a single pass.'
    ],
    howToUse: ['Watch larger values bubble right pass by pass.'],
    pros: [
      'Detects already sorted arrays in O(N).',
      'Stable sort.'
    ],
    cons: [
      'Terrible O(N²) average/worst time.',
      'Inefficient for large datasets.'
    ],
    keyPoints: 'Simple baseline sorting algorithm.'
  },
  'Selection Sort': {
    title: 'Selection Sort',
    summary: 'Finds the minimum element from the unsorted section and swaps it to the front.',
    formula: 'minIdx = findMin(unsorted); swap(arr[i], arr[minIdx])',
    example: 'Input = [64, 25, 12]:\n1. Find min in [64, 25, 12] ➔ 12 ➔ Swap with 64 ➔ [12, 25, 64]\n2. Find min in [25, 64] ➔ 25 ➔ Already in place! Array sorted [12, 25, 64].',
    realLife: [
      'Flash memory wear leveling where writing/swapping is expensive (minimizes swaps to max N).',
      'Sorting small physical items where moving items requires high physical effort.',
      'Finding top K smallest elements in small datasets.'
    ],
    howToUse: ['Observe how the sorted partition grows from left to right one minimum element at a time.'],
    pros: [
      'Performs at most O(N) swaps.',
      'Excellent when writes are expensive.'
    ],
    cons: [
      'Always takes O(N²) time.',
      'Unstable sorting behavior.'
    ],
    keyPoints: 'Performs at most N swaps total.'
  },
  'Insertion Sort': {
    title: 'Insertion Sort',
    summary: 'Builds sorted array one element at a time by inserting current item into its correct position.',
    formula: 'while key < arr[j] ➔ arr[j+1] = arr[j]; j--',
    example: 'Input = [12, 11, 13]:\n1. Pick 11: 11 < 12 ➔ Shift 12 right ➔ Insert 11 ➔ [11, 12, 13]\n2. Pick 13: 13 > 12 ➔ Keep position ➔ [11, 12, 13]',
    realLife: [
      'Sorting playing cards held in hand (inserting card into proper position).',
      'Online live streaming data feed insertion (sorting incoming data nearly sorted).',
      'Hybrid sorting algorithms (used as base case in Timsort & QuickSort for small arrays N < 16).'
    ],
    howToUse: ['Watch items slide left until placed in their sorted position.'],
    pros: [
      'Best for nearly sorted data O(N).',
      'In-place and stable.'
    ],
    cons: [
      'O(N²) worst-case time.',
      'Slow for reverse-sorted data.'
    ],
    keyPoints: 'Extremely fast O(N) for nearly sorted data and small arrays.'
  },
  'Merge Sort': {
    title: 'Merge Sort',
    summary: 'Divide-and-conquer algorithm splitting array into halves, sorting recursively, and merging.',
    formula: 'Merge(leftHalf, rightHalf) combining 2 sorted arrays in O(N) time.',
    example: 'Split [38, 27, 43, 3] ➔ [38, 27] and [43, 3]\n- Sort sub-arrays ➔ [27, 38] and [3, 43]\n- Merge ➔ Compare 27 & 3 (pick 3), compare 27 & 43 (pick 27)... ➔ Final [3, 27, 38, 43]',
    realLife: [
      'External sorting of massive datasets too large for RAM (sorting terabytes on disk).',
      'Python `list.sort()` and Java `Arrays.sort(Object[])` (Timsort is based on Merge Sort).',
      'E-commerce stable product sorting (preserving seller order when sorting by price).'
    ],
    howToUse: ['Watch array divide into single elements and re-merge into sorted sub-lists.'],
    pros: [
      'Guaranteed O(N log N) worst-case.',
      'Stable sort.'
    ],
    cons: [
      'Requires O(N) extra memory.',
      'Not in-place.'
    ],
    keyPoints: 'Guarantees O(N log N) sorting time in all cases.'
  },
  'Quick Sort': {
    title: 'Quick Sort',
    summary: 'Partitions array around a pivot element.',
    formula: 'Partition: elements ≤ pivot go left, elements > pivot go right',
    example: 'Input = [4, 2, 7, 1, 3], Pivot = 3:\n1. Partition items relative to 3: [2, 1] | 3 | [4, 7]\n2. Pivot 3 is now in its exact final position!\n3. Recursively sort left [2, 1] and right [4, 7].',
    realLife: [
      'C `qsort()` and C++ `std::sort()` internal sorting algorithm.',
      'Database query engine `ORDER BY` execution.',
      'Graphics engine mesh vertex sorting.'
    ],
    howToUse: ['Watch pivot element settle into place after partitioning.'],
    pros: [
      'Extremely fast in practice.',
      'In-place sorting.'
    ],
    cons: [
      'Worst-case O(N²) if pivot is poor.',
      'Unstable sorting behavior.'
    ],
    keyPoints: 'Fastest in-place general-purpose sorting algorithm.'
  },
  'Heap Sort': {
    title: 'Heap Sort',
    summary: 'Builds a Max-Heap from the array, then repeatedly extracts the max element to the end.',
    formula: 'MaxHeapify() ➔ swap(root, last) ➔ shrink heap size by 1',
    example: 'Array = [4, 10, 3, 51]:\n1. Build Max-Heap ➔ Root = 51\n2. Swap 51 with end ➔ [4, 10, 3 | 51]\n3. Re-heapify remaining [4, 10, 3] ➔ Root = 10 ➔ Swap 10 with end ➔ [4, 3 | 10, 51]...',
    realLife: [
      'Embedded systems with strict O(1) extra space constraints and no recursion allowed.',
      'Real-time systems requiring guaranteed O(N log N) worst-case time without quadratic spikes.',
      'Priority queue extraction and order tracking.'
    ],
    howToUse: ['Watch max element get swapped to the end and heapify restore tree order.'],
    pros: [
      'Guaranteed O(N log N) worst-case.',
      'O(1) extra space (in-place).'
    ],
    cons: [
      'Unstable sort.',
      'Poor cache locality (skipping indices).'
    ],
    keyPoints: 'In-place sort with guaranteed O(N log N) time bound.'
  },
  'Counting Sort': {
    title: 'Counting Sort',
    summary: 'Non-comparison sorting algorithm counting frequency of each distinct key.',
    formula: 'count[val]++;  cumulativeCount[i] = count[i] + count[i-1]',
    example: 'Input = [1, 4, 1, 2, 7, 5, 2]:\n1. Count frequencies: 1:2, 2:2, 4:1, 5:1, 7:1\n2. Reconstruct array using counts ➔ [1, 1, 2, 2, 4, 5, 7]',
    realLife: [
      'Sorting exam percentage scores (0 to 100) for millions of students in linear O(N) time.',
      'Age demographic sorting in census data (ages 0 to 120).',
      'Sub-routine for Radix Sort digit sorting.'
    ],
    howToUse: ['Watch frequency count array build up and reconstruct sorted elements.'],
    pros: [
      'Linear time complexity O(N+K).',
      'Stable sort.'
    ],
    cons: [
      'Requires extra memory for counts.',
      'Only works on positive integers in a small range.'
    ],
    keyPoints: 'Linear O(N + K) time when key range K is small.'
  },
  'Radix Sort': {
    title: 'Radix Sort',
    summary: 'Sorts numbers digit by digit from least significant digit (LSD) to most significant (MSD).',
    formula: 'Sort by digit `d`: `(val / 10^d) % 10` using stable Counting Sort.',
    example: 'Input = [170, 45, 75, 90]:\n1. Sort by Units digit ➔ [170, 90, 45, 75]\n2. Sort by Tens digit ➔ [45, 75, 170, 90]\n3. Sort by Hundreds digit ➔ [45, 75, 90, 170] (Sorted!)',
    realLife: [
      'Sorting 9-digit Social Security Numbers or 10-digit phone numbers in linear time.',
      'Card shufflers sorting playing cards by suit then by rank.',
      'Suffix array construction in DNA string processing.'
    ],
    howToUse: ['Watch array get grouped into buckets by units digit, then tens digit, then hundreds.'],
    pros: [
      'Linear-time non-comparison sorting.',
      'Stable sort.'
    ],
    cons: [
      'Depends on Counting Sort constraints.',
      'High memory overhead for digit arrays.'
    ],
    keyPoints: 'Linear-time non-comparison sorting for integers.'
  },
  'Linear Search': {
    title: 'Linear Search',
    summary: 'Sequentially checks every element in the list until match is found.',
    formula: 'for i = 0 to N-1: if arr[i] == target ➔ return i',
    example: 'Array = [5, 12, 8, 20], Target = 8:\n1. Check i=0 (val 5) ➔ 5 != 8\n2. Check i=1 (val 12) ➔ 12 != 8\n3. Check i=2 (val 8) ➔ Match found at index 2!',
    realLife: [
      'Finding a contact in an unsorted address book or recent call log.',
      'Searching for a specific word in an unindexed text document.',
      'Scanning small lists (N < 20) where hash overhead exceeds linear search speed.'
    ],
    howToUse: ['Watch search highlight index 0, 1, 2, ... until target is found.'],
    pros: [
      'Works on unsorted arrays.',
      'No preprocessing required.'
    ],
    cons: [
      'Slow time complexity O(N).',
      'Inefficient for large search spaces.'
    ],
    keyPoints: 'Works on unsorted arrays.'
  },
  'Binary Search': {
    title: 'Binary Search',
    summary: 'Searches sorted array by halving search range at every step.',
    formula: 'mid = ⌊(low + high) / 2⌋  |  If target < arr[mid] ➔ high = mid - 1  |  Else ➔ low = mid + 1',
    example: 'Sorted Array = [10, 20, 30, 40, 50, 60, 70], Target = 60:\n1. low=0, high=6 ➔ mid = (0+6)/2 = 3 (val = 40)\n2. 60 > 40 ➔ low = mid + 1 = 4\n3. low=4, high=6 ➔ mid = (4+6)/2 = 5 (val = 60)\n4. Match found at index 5 in just 2 steps!',
    realLife: [
      'Looking up a word in a printed dictionary or glossary.',
      '`git bisect` automated bug hunting (binary searching commit history to find regression).',
      'Standard library functions (`std::binary_search` in C++, `Arrays.binarySearch()` in Java).'
    ],
    howToUse: ['Watch search boundary [low, high] cut in half at every step.'],
    pros: [
      'Logarithmic search time O(log N).',
      'Very fast on large sorted arrays.'
    ],
    cons: [
      'Requires array to be sorted first.',
      'Random access is necessary (cannot search linked lists easily).'
    ],
    keyPoints: 'Extremely fast logarithmic search on sorted arrays.'
  },

  // ─── GRAPH ─────────────────────────────────────────────────────────────
  'Dijkstra': {
    title: "Dijkstra's Shortest Path Algorithm",
    summary: "Finds shortest path from start node to all other nodes in a non-negative weighted graph.",
    formula: "dist[v] = min(dist[v], dist[u] + weight(u, v))",
    example: "Start Node A (dist A=0, all others=∞):\n1. Edge A ➔ B (weight 4): dist[B] = min(∞, 0 + 4) = 4\n2. Edge A ➔ C (weight 2): dist[C] = min(∞, 0 + 2) = 2\n3. Pick unvisited min node C (dist 2). Edge C ➔ B (weight 1):\n   dist[B] = min(4, 2 + 1) = 3! (Shorter path found via C!)",
    realLife: [
      'Google Maps, Apple Maps, and Waze GPS route navigation.',
      'OSPF (Open Shortest Path First) internet router packet routing protocol.',
      'Flight ticket search engines finding shortest/cheapest multi-stop flight path.'
    ],
    howToUse: ["Watch node distances relax dynamically using Priority Queue."],
    pros: [
      'Guarantees shortest path.',
      'Efficient using priority queues.'
    ],
    cons: [
      'Fails on negative edge weights.',
      'High memory overhead for large graphs.'
    ],
    keyPoints: "Greedy choice guarantees shortest distance for non-negative weights."
  },
  'BFS': {
    title: 'Breadth-First Search (BFS)',
    summary: 'Explores graph level-by-level using a FIFO Queue.',
    formula: 'Enqueue neighbors ➔ mark visited ➔ dequeue front node',
    example: 'Start Node A:\n1. Level 0: [A]\n2. Level 1: Neighbors of A ➔ [B, C]\n3. Level 2: Neighbors of B & C ➔ [D, E, F]',
    realLife: [
      'Social Network friend suggestions (LinkedIn 1st, 2nd, 3rd degree connections).',
      'Web Crawlers indexing pages layer by layer from seed URLs.',
      'Peer-to-Peer network (BitTorrent) neighbor discovery.'
    ],
    howToUse: ['Watch search expand outward in concentric circles/levels from start node.'],
    pros: [
      'Guarantees shortest path on unweighted graphs.',
      'Excellent for level traversal.'
    ],
    cons: [
      'High memory usage (stores all frontier nodes).',
      'Not suitable for deep search paths.'
    ],
    keyPoints: 'Guarantees shortest path in unweighted graphs.'
  },
  'DFS': {
    title: 'Depth-First Search (DFS)',
    summary: 'Explores as far as possible along each branch before backtracking using a Stack/Recursion.',
    formula: 'Visit node ➔ push to stack ➔ recurse down unvisited neighbor ➔ pop & backtrack on dead-end',
    example: 'Start A: A ➔ B ➔ D (Dead end!) ➔ Backtrack to B ➔ B ➔ E ➔ Backtrack to A ➔ A ➔ C',
    realLife: [
      'Solving mazes and puzzle games (Sudoku, N-Queens backtracking).',
      'Detecting cycles in software package dependency graphs.',
      'Topological sorting of build steps in compiler makefiles.'
    ],
    howToUse: ['Watch search dive deep down a branch until hitting a dead-end, then backtrack.'],
    pros: [
      'Uses less memory than BFS.',
      'Great for cycle detection and backtracking.'
    ],
    cons: [
      'Can get stuck in infinite loops/paths.',
      'Does not guarantee shortest path.'
    ],
    keyPoints: 'Uses recursion/stack to explore pathways deeply.'
  },
  'Greedy': {
    title: 'Greedy Best-First Search',
    summary: 'Explores paths based purely on heuristic distance to target.',
    formula: 'Pick neighbor node with smallest heuristic h(n) = StraightLineDistance(n, target)',
    example: 'Target at (10, 10):\nNode A heuristic = 5, Node B heuristic = 12 ➔ Pick Node A first!',
    realLife: [
      'Video game NPC pathfinding (moving straight toward player character).',
      'Heuristic robot navigation in simple obstacle fields.',
      'Initial fast path estimation in GIS mapping software.'
    ],
    howToUse: ['Watch algorithm move towards target node using straight-line distance heuristic.'],
    pros: [
      'Extremely fast.',
      'Uses simple straight-line distance heuristics.'
    ],
    cons: [
      'Can get stuck in local minima.',
      'Does not guarantee shortest path.'
    ],
    keyPoints: 'Fast but does not guarantee shortest path (unlike A* or Dijkstra).'
  },
  'Prim': {
    title: "Prim's Minimum Spanning Tree (MST)",
    summary: 'Grows a Minimum Spanning Tree from a single starting vertex by picking cheapest connected edge.',
    formula: 'Pick edge (u, v) with min weight where u ∈ MST and v ∉ MST',
    example: 'MST = {A}:\nEdge (A, B) weight 2, Edge (A, C) weight 4 ➔ Add (A, B) weight 2 ➔ MST = {A, B}',
    realLife: [
      'Telecommunication cable network design (connecting cities with minimum total optical fiber).',
      'Electrical power grid wire routing connecting power stations with minimum cable cost.',
      'Water pipeline distribution layout connecting residential houses.'
    ],
    howToUse: ['Watch cheapest edge candidate get added to connect unvisited nodes.'],
    pros: [
      'Finds optimal minimum spanning tree.',
      'Fast using heaps.'
    ],
    cons: [
      'Requires connected graphs.',
      'Not efficient on sparse graphs without heaps.'
    ],
    keyPoints: 'Connects all graph vertices with minimum total edge weight without cycles.'
  },
  'Bellman-Ford': {
    title: 'Bellman-Ford Algorithm',
    summary: 'Computes single-source shortest path allowing negative edge weights and detecting negative cycles.',
    formula: 'Relax all edges V-1 times: `dist[v] = min(dist[v], dist[u] + weight(u, v))`',
    example: 'Graph with V=4 nodes:\nRelax all edges 3 times. If edge distances keep decreasing on 4th pass ➔ Negative Weight Cycle Detected!',
    realLife: [
      'Distance-Vector Routing Protocol (RIP - Routing Information Protocol in networking).',
      'Currency arbitrage detection in financial forex trading (finding negative log multiplier cycles).',
      'Shortest path routing in graphs containing negative cost edges (e.g. tolls & discounts).'
    ],
    howToUse: ['Watch all edges get relaxed V-1 times step-by-step.'],
    pros: [
      'Works with negative weights.',
      'Detects negative cycles.'
    ],
    cons: [
      'Slow time complexity O(V*E).',
      'Inefficient for positive-only weight graphs.'
    ],
    keyPoints: 'Handles negative edge weights safely.'
  },
  'Floyd-Warshall': {
    title: 'Floyd-Warshall Algorithm',
    summary: 'All-Pairs Shortest Path dynamic programming algorithm.',
    formula: 'dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])  for k = 1 to V',
    example: 'Matrix 3x3:\nUpdate distance from i to j using intermediate node k=1, then k=2, then k=3.',
    realLife: [
      'Transitive closure matrix computation in database relational queries.',
      'All-pairs shortest path distance matrices for airline route scheduling.',
      'Traffic congestion analysis computing travel times between all city node pairs.'
    ],
    howToUse: ['Watch matrix update shortest path between every pair of vertices (u, v) using intermediate node k.'],
    pros: [
      'Finds paths between all node pairs.',
      'Simple nested-loop structure.'
    ],
    cons: [
      'High time complexity O(V³).',
      'Requires large O(V²) memory matrix.'
    ],
    keyPoints: 'Computes distance between all node pairs.'
  },
  'Kahn': {
    title: "Kahn's Topological Sort",
    summary: 'Linearly orders vertices in a Directed Acyclic Graph (DAG) using in-degrees.',
    formula: 'Process node with in-degree 0 ➔ decrement neighbor in-degrees ➔ repeat',
    example: 'Nodes: A (in=0), B (in=1, A➔B), C (in=1, B➔C):\n1. Process A ➔ Output [A], B in-degree becomes 0\n2. Process B ➔ Output [A, B], C in-degree becomes 0\n3. Process C ➔ Output [A, B, C]',
    realLife: [
      'Build systems like Make, Maven, and Gradle resolving build order of dependent source files.',
      'University course prerequisite registration planning (CS101 ➔ CS102 ➔ CS201).',
      'Task scheduling in workflow engines like Apache Airflow and Celery.'
    ],
    howToUse: ['Watch vertices with in-degree 0 get processed and removed from graph sequentially.'],
    pros: [
      'Detects cycles in DAGs.',
      'Simple queue-based implementation.'
    ],
    cons: [
      'Only works on Directed Acyclic Graphs.',
      'High overhead for simple chains.'
    ],
    keyPoints: 'Essential for dependency resolution.'
  },

  // ─── DP & GREEDY ───────────────────────────────────────────────────────
  'LCS': {
    title: 'Longest Common Subsequence (LCS)',
    summary: 'Finds longest subsequence present in 2 strings in same relative order.',
    formula: 'if str1[i-1] == str2[j-1] ➔ dp[i][j] = 1 + dp[i-1][j-1]  else ➔ dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    example: 'String 1 = "ABC", String 2 = "AC":\n1. Match "A" == "A": 1 + dp[0][0] = 1\n2. "B" != "C": max(dp[A][C], dp[AB][A]) = 1\n3. Match "C" == "C": 1 + dp[AB][A] = 2\n➔ LCS Length = 2 ("AC")',
    realLife: [
      'Git Diff tool (`git diff` highlighting added/deleted code lines).',
      'Bioinformatics DNA & RNA strand similarity matching.',
      'Anti-plagiarism software comparing essay text similarity.'
    ],
    howToUse: ['Watch 2D DP matrix populate step-by-step.'],
    pros: [
      'Finds exact non-contiguous matching segments.',
      'Guaranteed optimal solution.'
    ],
    cons: [
      'Quadratic time and space complexity O(N*M).',
      'Slow for long strings.'
    ],
    keyPoints: 'Subsequences do not need to occupy contiguous positions.'
  },
  'LIS': {
    title: 'Longest Increasing Subsequence (LIS)',
    summary: 'Finds length of longest strictly increasing subsequence in an array.',
    formula: 'if arr[i] > arr[j] ➔ dp[i] = max(dp[i], 1 + dp[j])  for j < i',
    example: 'Array = [10, 22, 9, 33]:\n1. dp[10]=1\n2. 22 > 10 ➔ dp[22] = 1 + dp[10] = 2\n3. 9 < 22 ➔ dp[9] = 1\n4. 33 > 22 ➔ dp[33] = 1 + dp[22] = 3 ➔ LIS = [10, 22, 33] (Length 3)',
    realLife: [
      'Stock Market bull run trend duration analysis (longest rising price sequence).',
      'Tower stacking box height optimization problems.',
      'Box nesting / envelope containment hierarchy ordering.'
    ],
    howToUse: ['Watch DP array build longest increasing sub-chain length for each element.'],
    pros: [
      'Guaranteed optimal increasing subsequence.',
      'DP table tracks lengths accurately.'
    ],
    cons: [
      'O(N²) time complexity for basic DP.',
      'Requires O(N) extra space.'
    ],
    keyPoints: 'Computes maximum strictly ascending sequence length.'
  },
  'Knapsack': {
    title: '0/1 Knapsack Problem',
    summary: 'Selects items with weights & values to maximize total value within capacity W.',
    formula: 'if wt[i-1] ≤ w ➔ dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])  else ➔ dp[i-1][w]',
    example: 'Capacity W = 5, Item 1 (wt=2, val=6), Item 2 (wt=3, val=10):\n- At capacity 5: max(include Item 2: 10 + dp[1][5-3], exclude Item 2: dp[1][5])\n= max(10 + 6, 6) = 16 (Include both items! Max Value = 16)',
    realLife: [
      'Financial investment portfolio asset selection (maximizing profit under a strict budget).',
      'Truck / Cargo container loading (maximizing cargo value within weight capacity).',
      'Cloud Virtual Machine resource allocation (packing apps into server RAM/CPU bounds).'
    ],
    howToUse: ['Watch DP table compute max value for every sub-capacity.'],
    pros: [
      'Guaranteed optimal value selection.',
      'Prevents fractional items.'
    ],
    cons: [
      'NP-hard problem.',
      'Pseudo-polynomial time complexity O(N*W).'
    ],
    keyPoints: 'Each item can either be taken (1) or left (0).'
  },
  'Fractional Knapsack': {
    title: 'Fractional Knapsack (Greedy)',
    summary: 'Greedy algorithm sorting items by value-to-weight ratio and taking fractional items when needed.',
    formula: 'Ratio = Value / Weight  |  Take item fraction `f = remainingCapacity / Weight`',
    example: 'Capacity W = 10, Item A (wt=10, val=60, ratio=6), Item B (wt=20, val=100, ratio=5):\n- Pick Item A fully (wt 10, val 60) ➔ Capacity left = 0 ➔ Max Val = 60',
    realLife: [
      'Commodity trading (buying fractional quantities of gold, silver, oil to maximize value).',
      'Bandwidth allocation in media streaming (allocating bitrates to video streams).',
      'Recipe ingredient selection under weight limits.'
    ],
    howToUse: ['Watch items get sorted by `value / weight` ratio and added greedily.'],
    pros: [
      'Linear-time greedy solution.',
      'Highly efficient.'
    ],
    cons: [
      'Only works if items are divisible.',
      'Cannot be used for discrete items.'
    ],
    keyPoints: 'Greedy choice yields global optimal solution because items are divisible.'
  },
  'Matrix Chain': {
    title: 'Matrix Chain Multiplication',
    summary: 'Finds most efficient way to multiply a chain of matrices to minimize scalar multiplications.',
    formula: 'dp[i][j] = min(dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j])  for i ≤ k < j',
    example: 'Matrices A(10x30), B(30x5), C(5x60):\n- (A*B)*C = (10*30*5) + (10*5*60) = 1500 + 3000 = 4500 ops\n- A*(B*C) = (30*5*60) + (10*30*60) = 9000 + 18000 = 27000 ops! (9x faster!)',
    realLife: [
      'Graphics rendering pipeline matrix transformation optimization.',
      'Machine Learning tensor operations in PyTorch & TensorFlow graph compilers.',
      'Scientific matrix computation in MATLAB & NumPy.'
    ],
    howToUse: ['Watch DP table compute optimal parenthesization split points `k`.'],
    pros: [
      'Saves millions of scalar operations.',
      'Finds global optimal multiplication order.'
    ],
    cons: [
      'O(N³) dynamic programming time.',
      'Requires O(N²) table space.'
    ],
    keyPoints: 'Order of multiplication drastically changes computational cost.'
  },
  'Coin Change': {
    title: 'Coin Change Problem',
    summary: 'Finds minimum number of coins needed to make a target change amount.',
    formula: 'dp[i] = min(dp[i], 1 + dp[i - coin])',
    example: 'Coins = [1, 2, 5], Target = 11:\n- dp[11] = 1 + dp[11 - 5] = 1 + dp[6] = 1 + (1 + dp[1]) = 1 + 1 + 1 = 3 coins (5 + 5 + 1)!',
    realLife: [
      'Automated Vending Machine change dispenser calculating minimum coins returned.',
      'Cash Register payment breakdown in POS retail software.',
      'Crypto token denomination swapping.'
    ],
    howToUse: ['Watch DP array build min coins from `0` to target amount `amount`.'],
    pros: [
      'Guarantees minimum coin count.',
      'Works on arbitrary coin systems.'
    ],
    cons: [
      'Inefficient for large target amounts.',
      'O(N * Target) space complexity.'
    ],
    keyPoints: 'Keep code tracing dynamically to locate minimum coins.'
  },
  'Edit Distance': {
    title: 'Edit Distance (Levenshtein Distance)',
    summary: 'Calculates minimum operations (Insert, Delete, Replace) to convert string A into string B.',
    formula: 'if str1[i] == str2[j] ➔ dp[i][j] = dp[i-1][j-1]  else ➔ 1 + min(Insert, Delete, Replace)',
    example: 'Convert "CAT" to "CUT":\n1. "C" == "C" ➔ Cost 0\n2. Replace "A" with "U" ➔ Cost 1\n3. "T" == "T" ➔ Cost 0 ➔ Edit Distance = 1',
    realLife: [
      'Search engine "Did you mean?" spelling auto-correction (Google search).',
      'Mobile keyboard auto-correct (iOS / Gboard word suggestion).',
      'Speech recognition transcript error matching.'
    ],
    howToUse: ['Watch 2D DP grid calculate character edit costs.'],
    pros: [
      'Computes exact minimum operations.',
      'Highly versatile for spell checking.'
    ],
    cons: [
      'O(N*M) time and space.',
      'Heavy computation for long texts.'
    ],
    keyPoints: 'Core algorithm behind spell checkers and auto-correct.'
  },
  'Activity Selection': {
    title: 'Activity Selection Problem (Greedy)',
    summary: 'Selects maximum number of non-overlapping activities sharing a resource.',
    formula: 'Sort activities by finish time `finish[i]` ➔ Select if `start[i] ≥ lastFinishTime`',
    example: 'Activities: A(start 1, finish 3), B(2, 5), C(4, 7):\n- Pick A(1-3). B starts at 2 < 3 (Skip!). C starts at 4 ≥ 3 (Pick C!). Max activities = 2.',
    realLife: [
      'Conference room meeting room reservation system (maximizing non-overlapping meetings).',
      'Movie theater screen scheduling.',
      'Satellite observation scheduling (maximizing satellite photography targets).'
    ],
    howToUse: ['Watch activities sorted by finish time and picked greedily.'],
    pros: [
      'Greedy strategy is optimal O(N log N).',
      'Extremely fast.'
    ],
    cons: [
      'Only works if activities have fixed start/end times.',
      'Cannot handle dependent activities.'
    ],
    keyPoints: 'Greedy strategy sorting by end time is optimal.'
  },
  'Job Sequencing': {
    title: 'Job Sequencing with Deadlines',
    summary: 'Schedules jobs with deadlines and profits to maximize total profit.',
    formula: 'Sort jobs by profit descending ➔ Place job in latest available slot before deadline',
    example: 'Job 1 (Deadline 2, Profit 100), Job 2 (Deadline 1, Profit 50):\n- Slot 2: Job 1 (Profit 100)\n- Slot 1: Job 2 (Profit 50) ➔ Total Profit = 150',
    realLife: [
      'Factory assembly line job scheduling with strict deadlines and profits.',
      'Cloud Server batch job execution scheduler.',
      'Freelancer project scheduling maximizing revenue before deadlines.'
    ],
    howToUse: ['Watch jobs sorted by profit placed in latest available free time slot.'],
    pros: [
      'Maximizes profit within deadlines.',
      'Simple greedy logic.'
    ],
    cons: [
      'Time slots must be discrete.',
      'Cannot handle overlapping non-divisible jobs easily.'
    ],
    keyPoints: 'Greedy strategy scheduling highest profit jobs as late as possible.'
  },
  'Huffman Coding': {
    title: 'Huffman Coding (Greedy Data Compression)',
    summary: 'Generates variable-length prefix codes based on character frequencies for optimal compression.',
    formula: 'Min-Heap combines 2 lowest frequency nodes ➔ Build binary prefix code tree',
    example: 'Frequencies: A:50, B:10, C:5:\n- Combine B(10) + C(5) = 15 ➔ Code for A="0" (1 bit), B="10" (2 bits), C="11" (2 bits)! Compression achieved!',
    realLife: [
      'ZIP & GZIP file archiving compression.',
      'JPEG image file header encoding.',
      'MP3 audio file encoding compressing sound frequencies.'
    ],
    howToUse: ['Watch min-heap repeatedly combine lowest frequency nodes into a binary prefix tree.'],
    pros: [
      'Guarantees lossless optimal compression.',
      'Variable-length codes save space.'
    ],
    cons: [
      'Must store Huffman tree with data.',
      'Requires two passes over source data.'
    ],
    keyPoints: 'Used in ZIP, JPEG, and MP3 data compression.'
  },
  'N-Queens': {
    title: 'N-Queens Backtracking Problem',
    summary: 'Places N non-attacking queens on an N×N chessboard.',
    formula: 'Backtracking: Place queen in col ➔ Check row/diag conflict ➔ Recurse to next row ➔ Backtrack if conflict',
    example: '4 Queens:\nRow 0: Queen at col 1\nRow 1: Queen at col 3\nRow 2: Queen at col 0\nRow 3: Queen at col 2 ➔ Valid non-attacking arrangement!',
    realLife: [
      'VLSI microchip component placement avoiding electronic signal interference.',
      'Robot collision-free positioning in automated warehouses.',
      'Backtracking algorithmic puzzle solver design.'
    ],
    howToUse: ['Watch algorithm try queen positions and backtrack when attacks occur.'],
    pros: [
      'Finds all possible arrangements.',
      'Prunes branches early.'
    ],
    cons: [
      'Exponential worst-case time complexity.',
      'Slow for large board sizes N.'
    ],
    keyPoints: 'Classic backtracking depth-first search demonstration.'
  },
  'Subset Sum': {
    title: 'Subset Sum Problem',
    summary: 'Determines if there is a subset of numbers that sum up to a target value.',
    formula: 'dp[i][s] = dp[i-1][s] || dp[i-1][s - arr[i-1]]',
    example: 'Set = [3, 34, 4, 12, 5, 2], Target = 9:\nSubset [3, 4, 2] sums to 3 + 4 + 2 = 9 ➔ Returns TRUE!',
    realLife: [
      'Financial auditing verifying if a set of transactions sums to a target discrepancy.',
      'Cargo weight balancing on airplanes.',
      'Vault combination verification.'
    ],
    howToUse: ['Watch DP boolean grid check sum reachability step-by-step.'],
    pros: [
      'Finds exact sum combinations.',
      'Adapts to multiple targets.'
    ],
    cons: [
      'NP-complete problem.',
      'O(N * Sum) memory footprint.'
    ],
    keyPoints: 'Subset sum is a special case of 0/1 Knapsack.'
  },
  'Sudoku': {
    title: 'Sudoku Solver (Backtracking)',
    summary: 'Fills a 9×9 grid so every row, column, and 3×3 box contains digits 1 to 9.',
    formula: 'If empty cell ➔ Try digits 1 to 9 ➔ Check valid ➔ Recurse ➔ Undo & try next if invalid',
    example: 'Try number 5 at cell (0, 2) ➔ Row valid, Col valid, Box valid ➔ Recurse next empty cell!',
    realLife: [
      'Automated puzzle generation and solving engines.',
      'Constraint Satisfaction Problem (CSP) solver in AI systems.',
      'Logic gate allocation in circuit synthesis.'
    ],
    howToUse: ['Watch backtracking algorithm place valid numbers and undo choices when invalid.'],
    pros: [
      'Solves any valid puzzle.',
      'Prunes invalid paths early.'
    ],
    cons: [
      'Can have high backtracking depth.',
      'Worst-case time is exponential.'
    ],
    keyPoints: 'Constraint satisfaction problem solved via depth-first recursive backtracking.'
  },
  'Patterns': {
    title: 'Pattern Printing (Nested Loops)',
    summary: 'A visual demonstration of nested loop execution to print 2D shapes, grids, and numbers. Perfect for mastering iteration, spacing, and inner-outer loop dynamics.',
    formula: 'For Row i in 1..R: For Space s in 1..S: print(" ") | For Col j in 1..C: print(symbol)',
    example: 'Right Pyramid (Rows=3):\nRow 1: Col 1 ➔ prints "* "\nRow 2: Col 1,2 ➔ prints "* * "\nRow 3: Col 1,2,3 ➔ prints "* * * "',
    realLife: [
      'Rendering text-based terminal graphics and charts.',
      'Constructing mathematical grids or pixel grids in games.',
      'Developing strong programmatic trace skills and logical loop structuring.'
    ],
    howToUse: [
      'Select a pattern from the dropdown menu (e.g. Pascal, Floyd, Pyramid).',
      'Adjust rows count and symbol type (such as stars, letters, or numbers).',
      'Use the media controls to play the execution trace step-by-step.',
      'Check variables inside the Active State panel during the animation.'
    ],
    pros: [
      'Excellent for mastering nested iterations.',
      'Immediate visual feedback.'
    ],
    cons: [
      'Limited to simple text shapes.',
      'No direct runtime optimization benefits.'
    ],
    keyPoints: 'Inner loops control the columns printed per line, while the outer loop controls vertical rows.'
  }
};
