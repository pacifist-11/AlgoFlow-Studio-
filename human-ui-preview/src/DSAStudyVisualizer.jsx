/* eslint-disable */
import React, { useState } from 'react';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import { toFullExecutableProgram } from './DSANotesVisualizer.jsx';
import { isLineDebuggerSupported } from './languageUtils.js';

// Allman brace formatter
const toAllman = code => {
  if (!code) return '';
  const lines = code.split('\n');
  const out = [];
  for (const line of lines) {
    const t = line.trimEnd();
    if (t.endsWith('{') && t.trim() !== '{' && !t.trim().startsWith('//') && !t.trim().startsWith('*')) {
      const indent = line.match(/^(\s*)/)[1];
      const body = t.slice(0, -1).trimEnd();
      if (body.trim().length > 0) { out.push(body); out.push(indent + '{'); continue; }
    }
    out.push(line);
  }
  return out.join('\n');
};

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
};

export const STUDY_LESSONS = {
  LESSON_VARIABLES: {
    title: "1. Variables, Constants & Memory Models",
    category: "Foundations",
    desc: "A variable is a named memory location that holds a mutable value during program execution. In contrast, a constant (const / final) is immutable once initialized. Variables in compiled languages map directly to stack memory offsets.",
    analogy: "A variable is like a labeled storage cubby where you can replace the stored item at any time. A constant is a sealed display glass box whose contents cannot be altered.",
    complexity: "Allocation: O(1) Time | Space: O(1) Stack Frame",
    code: {
      JS: `// Variables and Constants in JavaScript
let score = 10;
score = 25; // Mutable

const MAX_LIMIT = 100;
console.log("Score:", score, "Max Limit:", MAX_LIMIT);`,
      Python: `# Variables and Constants in Python
score = 10
score = 25 # Mutable

MAX_LIMIT = 100 # By convention, uppercase denotes constant
print(f"Score: {score}, Max Limit: {MAX_LIMIT}")`,
      "C++": `#include <iostream>
using namespace std;

int main() {
    int score = 10;
    score = 25; // Mutable
    
    const int MAX_LIMIT = 100;
    cout << "Score: " << score << " Max Limit: " << MAX_LIMIT << endl;
    return 0;
}`,
      Java: `public class Main {
    public static void main(String[] args) {
        int score = 10;
        score = 25; // Mutable
        
        final int MAX_LIMIT = 100;
        System.out.println("Score: " + score + ", Max Limit: " + MAX_LIMIT);
    }
}`,
      C: `#include <stdio.h>

int main() {
    int score = 10;
    score = 25;
    
    const int MAX_LIMIT = 100;
    printf("Score: %d, Max Limit: %d\\n", score, MAX_LIMIT);
    return 0;
}`
    }
  },
  LESSON_DATATYPES: {
    title: "2. Primitive vs Reference Types (Stack vs Heap)",
    category: "Foundations",
    desc: "Primitive types (int, float, boolean, char) store literal data values directly in fast CPU Stack memory. Reference types (arrays, objects, linked lists) store pointers in the Stack that point to dynamic memory allocated in Heap memory.",
    analogy: "A primitive is like carrying cash in your wallet (you hold the actual value). A reference type is like a locker key (the key is small in stack memory, but it points to a large storage locker in heap memory).",
    complexity: "Stack Access: O(1) | Heap Dereference: O(1)",
    code: {
      JS: `// Primitive Types (Stack)
let count = 42;
let isActive = true;

// Reference Types (Heap)
let numbers = [10, 20, 30];
let user = { name: "Antigravity", role: "AI Assistant" };
console.log(count, numbers[0], user.name);`,
      Python: `# Primitives and References in Python
count = 42
is_active = True

numbers = [10, 20, 30] # Reference to list in heap
user = {"name": "Antigravity", "role": "AI Assistant"}
print(count, numbers[0], user["name"])`,
      "C++": `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int count = 42; // Stack
    vector<int> numbers = {10, 20, 30}; // Dynamic heap allocation
    
    cout << "Primitive: " << count << ", Heap Array: " << numbers[0] << endl;
    return 0;
}`,
      Java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        int count = 42; // Primitive (Stack)
        int[] numbers = {10, 20, 30}; // Reference (Heap)
        
        System.out.println("Primitive: " + count + ", Heap Element: " + numbers[0]);
    }
}`,
      C: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int count = 42; // Stack
    int* numbers = (int*)malloc(3 * sizeof(int)); // Heap
    numbers[0] = 10; numbers[1] = 20; numbers[2] = 30;
    
    printf("Primitive: %d, Heap element: %d\\n", count, numbers[0]);
    free(numbers);
    return 0;
}`
    }
  },
  LESSON_CONTROL_FLOW: {
    title: "3. Control Flow & Branching Logic",
    category: "Foundations",
    desc: "Control flow structures (if-else, switch-case, ternary expressions) steer execution paths based on boolean evaluations, translating to conditional jump instructions in machine code.",
    analogy: "Like a railroad switch track: depending on the switch position (true/false condition), the train takes track A or track B.",
    complexity: "Branch evaluation: O(1) Time | O(1) Space",
    code: {
      JS: `let mark = 85;
if (mark >= 90) {
    console.log("Grade: A+");
} else if (mark >= 75) {
    console.log("Grade: A");
} else {
    console.log("Grade: B");
}`,
      Python: `mark = 85
if mark >= 90:
    print("Grade: A+")
elif mark >= 75:
    print("Grade: A")
else:
    print("Grade: B")`,
      "C++": `#include <iostream>
using namespace std;

int main() {
    int mark = 85;
    if (mark >= 90) cout << "Grade: A+" << endl;
    else if (mark >= 75) cout << "Grade: A" << endl;
    else cout << "Grade: B" << endl;
    return 0;
}`,
      Java: `public class Main {
    public static void main(String[] args) {
        int mark = 85;
        if (mark >= 90) System.out.println("Grade: A+");
        else if (mark >= 75) System.out.println("Grade: A");
        else System.out.println("Grade: B");
    }
}`,
      C: `#include <stdio.h>

int main() {
    int mark = 85;
    if (mark >= 90) printf("Grade: A+\\n");
    else if (mark >= 75) printf("Grade: A\\n");
    else printf("Grade: B\\n");
    return 0;
}`
    }
  },
  LESSON_ARRAYS_2D: {
    title: "4. 1D & 2D Arrays (Matrix Representation)",
    category: "Data Structures",
    desc: "Arrays store elements in contiguous memory blocks. 2D arrays (matrices) are mapped in memory via Row-Major order where index (r, c) maps to memory address: Base + (r * Cols + c) * sizeof(Type).",
    analogy: "A 1D array is a single row of numbered lockers. A 2D matrix is a building with floors (rows) and room numbers (columns).",
    complexity: "Access by Index: O(1) | Traversal: O(R * C)",
    code: {
      JS: `const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
console.log("Center element [1][1]:", matrix[1][1]);`,
      Python: `matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print("Center element [1][1]:", matrix[1][1])`,
      "C++": `#include <iostream>
using namespace std;

int main() {
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    cout << "Center element [1][1]: " << matrix[1][1] << endl;
    return 0;
}`,
      Java: `public class Main {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        System.out.println("Center element [1][1]: " + matrix[1][1]);
    }
}`,
      C: `#include <stdio.h>

int main() {
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    printf("Center element [1][1]: %d\\n", matrix[1][1]);
    return 0;
}`
    }
  },
  LESSON_LINKED_LISTS: {
    title: "5. Singly, Doubly & Circular Linked Lists",
    category: "Data Structures",
    desc: "Linked Lists store data in disconnected heap nodes connected via memory address pointers. Insertion and deletion at known pointer locations take O(1) without requiring element shifting.",
    analogy: "A treasure hunt: each clue (node) contains a prize (data) and a map coordinate (pointer) directing you to the next treasure box.",
    complexity: "Insert/Delete at Head: O(1) | Search: O(N) | Space: O(N)",
    code: {
      JS: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

let head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);
console.log("List Head:", head.val, "-> Next:", head.next.val);`,
      Python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

head = Node(10)
head.next = Node(20)
head.next.next = Node(30)
print(f"List Head: {head.val} -> Next: {head.next.val}")`,
      "C++": `#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    cout << "Head: " << head->val << " -> " << head->next->val << endl;
    return 0;
}`,
      Java: `class Node {
    int val;
    Node next;
    Node(int v) { this.val = v; this.next = null; }
}

public class Main {
    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println("Head: " + head.val + " -> " + head.next.val);
    }
}`,
      C: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int val;
    struct Node* next;
};

int main() {
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->val = 10;
    head->next = (struct Node*)malloc(sizeof(struct Node));
    head->next->val = 20;
    head->next->next = NULL;
    printf("Head: %d -> %d\\n", head->val, head->next->val);
    return 0;
}`
    }
  },
  LESSON_STACK_QUEUE: {
    title: "6. Stacks (LIFO) & Queues (FIFO) ADT",
    category: "Data Structures",
    desc: "A Stack enforces Last-In First-Out (LIFO) with push() and pop() at top. A Queue enforces First-In First-Out (FIFO) with enqueue() at rear and dequeue() at front.",
    analogy: "Stack is like a stack of dinner plates (top plate used first). Queue is like a checkout line at a grocery store (first person served first).",
    complexity: "Push/Pop/Enqueue/Dequeue: O(1) Time | Space: O(N)",
    code: {
      JS: `const stack = [];
stack.push(10);
stack.push(20);
console.log("Popped top:", stack.pop()); // 20

const queue = [];
queue.push("A");
queue.push("B");
console.log("Dequeued front:", queue.shift()); // "A"`,
      Python: `stack = []
stack.append(10)
stack.append(20)
print("Popped top:", stack.pop()) # 20

from collections import deque
queue = deque(["A", "B"])
print("Dequeued front:", queue.popleft()) # "A"`,
      "C++": `#include <iostream>
#include <stack>
#include <queue>
using namespace std;

int main() {
    stack<int> st;
    st.push(10); st.push(20);
    cout << "Stack Top: " << st.top() << endl; st.pop();
    
    queue<string> q;
    q.push("A"); q.push("B");
    cout << "Queue Front: " << q.front() << endl; q.pop();
    return 0;
}`,
      Java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Stack<Integer> st = new Stack<>();
        st.push(10); st.push(20);
        System.out.println("Stack Pop: " + st.pop());
        
        Queue<String> q = new LinkedList<>();
        q.add("A"); q.add("B");
        System.out.println("Queue Poll: " + q.poll());
    }
}`,
      C: `#include <stdio.h>

int stack[100], top = -1;
void push(int x) { stack[++top] = x; }
int pop() { return stack[top--]; }

int main() {
    push(10); push(20);
    printf("Popped: %d\\n", pop());
    return 0;
}`
    }
  },
  LESSON_TREES_AVL: {
    title: "7. Binary Search Trees & AVL Balancing",
    category: "Trees & Hierarchies",
    desc: "A Binary Search Tree (BST) maintains Left < Root < Right. An AVL Tree maintains a strict Balance Factor BF = Height(Left) - Height(Right) in {-1, 0, +1} via 4 rotations (LL, RR, LR, RL) to guarantee O(log N) operations.",
    analogy: "A perfectly balanced mobile hanger: when one side gets too heavy, you shift the center ring so no child hangs disproportionately low.",
    complexity: "Search / Insert / Delete: O(log N) Time | Space: O(N)",
    code: {
      JS: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}
// AVL balance factor: height(left) - height(right)`,
      Python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1`,
      "C++": `struct TreeNode {
    int val, height;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};`,
      Java: `class TreeNode {
    int val, height = 1;
    TreeNode left, right;
    TreeNode(int v) { this.val = v; }
}`,
      C: `struct TreeNode {
    int val, height;
    struct TreeNode *left, *right;
};`
    }
  },
  LESSON_HASHING: {
    title: "8. Hashing & Hash Table Collision Resolution",
    category: "Data Structures",
    desc: "Hash Tables map keys to array bucket indices using a hash function hash(key) % capacity. Collisions are handled via Open Addressing (Linear/Quadratic Probing, Double Hashing) or Separate Chaining (Linked buckets).",
    analogy: "A library catalog where each book title has a unique shelf number computed by a mathematical formula.",
    complexity: "Average Lookup/Insert: O(1) | Worst Case: O(N)",
    code: {
      JS: `const map = new Map();
map.set("apple", 150);
map.set("banana", 40);
console.log("Price of apple:", map.get("apple"));`,
      Python: `prices = {"apple": 150, "banana": 40}
print("Price of apple:", prices["apple"])`,
      "C++": `#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> prices;
    prices["apple"] = 150;
    prices["banana"] = 40;
    cout << "Price of apple: " << prices["apple"] << endl;
    return 0;
}`,
      Java: `import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> prices = new HashMap<>();
        prices.put("apple", 150);
        prices.put("banana", 40);
        System.out.println("Price of apple: " + prices.get("apple"));
    }
}`,
      C: `// Hash Table in C using Separate Chaining`
    }
  },
  LESSON_INFIX_POSTFIX: {
    title: "9. Infix to Postfix & Expression Evaluation",
    category: "Stack ADT",
    desc: "Infix notation (A + B * C) requires operator precedence and parentheses rules. Postfix notation (A B C * +) eliminates parentheses and is evaluated in a single linear stack scan.",
    analogy: "Stack evaluation is like stacking calculation slips: numbers push, operators pop the top 2 slips, compute, and push the answer back.",
    complexity: "Time: O(N) | Space: O(N) Operator Stack",
    code: {
      JS: `function infixToPostfix(exp) {
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  let stack = [], out = '';
  for (let ch of exp) {
    if (/[A-Z0-9]/.test(ch)) out += ch;
    else if (ch === '(') stack.push(ch);
    else if (ch === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') out += stack.pop();
      stack.pop();
    } else {
      while (stack.length && prec[stack[stack.length - 1]] >= prec[ch]) out += stack.pop();
      stack.push(ch);
    }
  }
  while (stack.length) out += stack.pop();
  return out;
}
console.log(infixToPostfix("(A+B)*C")); // AB+C*`,
      Python: `def infix_to_postfix(exp):
    prec = {'+': 1, '-': 1, '*': 2, '/': 2}
    stack, out = [], []
    for ch in exp:
        if ch.isalnum(): out.append(ch)
        elif ch == '(': stack.append(ch)
        elif ch == ')':
            while stack and stack[-1] != '(': out.append(stack.pop())
            stack.pop()
        else:
            while stack and stack[-1] != '(' and prec.get(stack[-1], 0) >= prec.get(ch, 0):
                out.append(stack.pop())
            stack.append(ch)
    while stack: out.append(stack.pop())
    return "".join(out)
print(infix_to_postfix("(A+B)*C")) # AB+C*`,
      "C++": `#include <iostream>
#include <stack>
#include <string>
using namespace std;

int prec(char c) {
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

string infixToPostfix(string s) {
    stack<char> st; string out;
    for (char c : s) {
        if (isalnum(c)) out += c;
        else if (c == '(') st.push(c);
        else if (c == ')') {
            while (!st.empty() && st.top() != '(') { out += st.top(); st.pop(); }
            if (!st.empty()) st.pop();
        } else {
            while (!st.empty() && prec(st.top()) >= prec(c)) { out += st.top(); st.pop(); }
            st.push(c);
        }
    }
    while (!st.empty()) { out += st.top(); st.pop(); }
    return out;
}

int main() {
    cout << infixToPostfix("(A+B)*C") << endl;
    return 0;
}`,
      Java: `import java.util.Stack;

public class Main {
    static int prec(char c) {
        if (c == '*' || c == '/') return 2;
        if (c == '+' || c == '-') return 1;
        return -1;
    }
    public static String convert(String s) {
        StringBuilder out = new StringBuilder();
        Stack<Character> st = new Stack<>();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) out.append(c);
            else if (c == '(') st.push(c);
            else if (c == ')') {
                while (!st.isEmpty() && st.peek() != '(') out.append(st.pop());
                if (!st.isEmpty()) stack.pop();
            } else {
                while (!st.isEmpty() && prec(st.peek()) >= prec(c)) out.append(st.pop());
                st.push(c);
            }
        }
        while (!st.isEmpty()) out.append(st.pop());
        return out.toString();
    }
    public static void main(String[] args) {
        System.out.println(convert("(A+B)*C"));
    }
}`,
      C: `// Infix to Postfix C implementation`
    }
  },
  LESSON_POLYNOMIAL: {
    title: "10. Polynomial ADT (Linked List Arithmetic)",
    category: "Data Structures",
    desc: "Represents mathematical polynomials P(x) = c1*x^e1 + c2*x^e2 + ... dynamically using linked lists sorted in descending order of exponents, enabling seamless addition and multiplication without memory fragmentation.",
    analogy: "Like combining recipe spices: terms with the same exponent combine quantities, while unique terms sit side-by-side in rank order.",
    complexity: "Addition: O(N + M) Time | Space: O(N + M)",
    code: {
      JS: `class PolyNode {
  constructor(coeff, exp, next = null) {
    this.coeff = coeff;
    this.exp = exp;
    this.next = next;
  }
}

function addPoly(p1, p2) {
  let dummy = new PolyNode(0, 0), tail = dummy;
  while (p1 && p2) {
    if (p1.exp === p2.exp) {
      tail.next = new PolyNode(p1.coeff + p2.coeff, p1.exp);
      p1 = p1.next; p2 = p2.next;
    } else if (p1.exp > p2.exp) {
      tail.next = new PolyNode(p1.coeff, p1.exp);
      p1 = p1.next;
    } else {
      tail.next = new PolyNode(p2.coeff, p2.exp);
      p2 = p2.next;
    }
    tail = tail.next;
  }
  tail.next = p1 || p2;
  return dummy.next;
}`,
      Python: `class PolyNode:
    def __init__(self, coeff, exp, next=None):
        self.coeff = coeff
        self.exp = exp
        self.next = next

def add_poly(p1, p2):
    dummy = PolyNode(0, 0)
    tail = dummy
    while p1 and p2:
        if p1.exp == p2.exp:
            tail.next = PolyNode(p1.coeff + p2.coeff, p1.exp)
            p1 = p1.next; p2 = p2.next
        elif p1.exp > p2.exp:
            tail.next = PolyNode(p1.coeff, p1.exp)
            p1 = p1.next
        else:
            tail.next = PolyNode(p2.coeff, p2.exp)
            p2 = p2.next
        tail = tail.next
    tail.next = p1 or p2
    return dummy.next`,
      "C++": `struct PolyNode {
    int coeff, exp;
    PolyNode* next;
    PolyNode(int c, int e) : coeff(c), exp(e), next(nullptr) {}
};`,
      Java: `class PolyNode {
    int coeff, exp;
    PolyNode next;
    PolyNode(int c, int e) { this.coeff = c; this.exp = e; }
}`,
      C: `struct PolyNode { int coeff, exp; struct PolyNode* next; };`
    }
  },
  LESSON_SIEVE: {
    title: "11. Sieve of Eratosthenes & Prime Factorization",
    category: "Number Theory",
    desc: "An ancient and optimal algorithm to compute all prime numbers up to limit N in O(N log log N) time by iteratively crossing out composite multiples.",
    analogy: "A flour sifter: prime numbers are kept, while their composite multiples fall through the sieve holes and get eliminated.",
    complexity: "Time: O(N log log N) | Space: O(N)",
    code: {
      JS: `function sieve(n = 30) {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= n; i += p) isPrime[i] = false;
    }
  }
  return isPrime.map((p, i) => p ? i : null).filter(Boolean);
}
console.log("Primes up to 30:", sieve(30));`,
      Python: `def sieve(n=30):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    return [i for i in range(2, n + 1) if is_prime[i]]
print("Primes up to 30:", sieve(30))`,
      "C++": `#include <iostream>
#include <vector>
using namespace std;

vector<int> sieve(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p) isPrime[i] = false;
        }
    }
    vector<int> primes;
    for (int i = 2; i <= n; i++) if (isPrime[i]) primes.push_back(i);
    return primes;
}

int main() {
    vector<int> res = sieve(30);
    for (int p : res) cout << p << " ";
    cout << endl;
    return 0;
}`,
      Java: `import java.util.*;

public class Main {
    public static List<Integer> sieve(int n) {
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int p = 2; p * p <= n; p++) {
            if (isPrime[p]) {
                for (int i = p * p; i <= n; i += p) isPrime[i] = false;
            }
        }
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) if (isPrime[i]) primes.add(i);
        return primes;
    }
    public static void main(String[] args) {
        System.out.println("Primes up to 30: " + sieve(30));
    }
}`,
      C: `// Sieve of Eratosthenes in C`
    }
  },
  LESSON_HUFFMAN: {
    title: "12. Huffman Coding & Compression Trees",
    category: "Greedy Algorithms",
    desc: "A greedy prefix-coding algorithm that constructs an optimal binary tree using a Min-Heap based on character frequencies, assigning shorter variable-length codes to frequent characters.",
    analogy: "Morse code: common letter 'E' gets a single short dot (.), while rare 'Q' gets (--.-) to minimize transmission bandwidth.",
    complexity: "Tree Construction: O(N log N) | Space: O(N)",
    code: {
      JS: `function buildHuffmanTree(charFreqs) {
  let pq = charFreqs.map(i => ({ ...i, left: null, right: null }));
  pq.sort((a, b) => a.freq - b.freq);
  while (pq.length > 1) {
    let l = pq.shift(), r = pq.shift();
    pq.push({ char: '$', freq: l.freq + r.freq, left: l, right: r });
    pq.sort((a, b) => a.freq - b.freq);
  }
  return pq[0];
}`,
      Python: `import heapq

class Node:
    def __init__(self, char, freq):
        self.char = char; self.freq = freq
        self.left = None; self.right = None
    def __lt__(self, other):
        return self.freq < other.freq`,
      "C++": `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

struct Node {
    char ch; int freq; Node *left, *right;
    Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};`,
      Java: `import java.util.*;

class Node {
    char ch; int freq; Node left, right;
    Node(char c, int f) { this.ch = c; this.freq = f; }
}`,
      C: `// Huffman Coding Tree in C`
    }
  }
};

const DSAStudyVisualizer = ({ onBack, onOpenDebugger }) => {
  const [selectedKey, setSelectedKey] = useState('LESSON_VARIABLES');
  const [activeLang, setActiveLang] = useState('C++');
  const [codeViewMode, setCodeViewMode] = useState('full');
  const [codeFontSize, setCodeFontSize] = useState(16);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeLesson = STUDY_LESSONS[selectedKey] || STUDY_LESSONS['LESSON_VARIABLES'];
  const rawCode = activeLesson.code[activeLang] || activeLesson.code['C++'] || activeLesson.code['JS'] || '';
  const fullCode = toFullExecutableProgram(rawCode, activeLang, activeLesson.title);
  const activeCodeToDisplay = codeViewMode === 'full' ? fullCode : rawCode;

  const filteredKeys = Object.entries(STUDY_LESSONS).filter(([k, item]) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    copyToClipboard(activeCodeToDisplay).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary, #0f172a)' }}>
      {/* HEADER */}
      <header className="header-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
          <div>
            <h1 className="title-gradient" style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800 }}>📚 DSA Study & Theory Studio</h1>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Master Data Structures, Memory Models & Algorithms with Live Runnable Demos</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-insert"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
            onClick={() => setIsRunnerOpen(true)}
            title="Execute this topic's code directly in the sandbox"
          >
            ▶ Run Live Demo
          </button>
          {onOpenDebugger && isLineDebuggerSupported(activeLang) && (
            <button 
              className="btn btn-clear"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #38bdf8', color: '#38bdf8' }}
              onClick={() => onOpenDebugger(rawCode, activeLang)}
              title="Step through variables and memory stack"
            >
              🐞 Line Debugger
            </button>
          )}
        </div>
      </header>

      {/* MAIN DUAL-PANE VIEW */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR: TOPIC LIST */}
        <div style={{ width: '320px', borderRight: '1px solid var(--glass-border)', background: 'rgba(15,23,42,0.6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
            <input 
              type="text"
              className="styled-input"
              placeholder="🔍 Search theory topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', fontSize: '0.85rem', padding: '6px 12px' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {filteredKeys.map(([k, item]) => {
              const isSelected = (selectedKey === k);
              return (
                <div
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59,130,246,0.18)' : 'transparent',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#60a5fa' : 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    🏷️ {item.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div>
            <span style={{ fontSize: '0.78rem', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
              {activeLesson.category}
            </span>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', margin: '8px 0 0 0' }}>{activeLesson.title}</h1>
          </div>

          {/* CONCEPT CARD */}
          <div style={{ background: 'var(--glass-bg)', padding: '1.4rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ color: 'var(--accent-primary)', marginTop: 0, fontSize: '1.05rem' }}>📌 Concept Overview</h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0 }}>
              {activeLesson.desc}
            </p>
          </div>

          {/* EVERYDAY ANALOGY */}
          <div style={{ background: 'rgba(251,191,36,0.06)', padding: '1.4rem', borderRadius: '14px', border: '1px solid rgba(251,191,36,0.25)' }}>
            <h3 style={{ color: '#fbbf24', marginTop: 0, fontSize: '1.05rem' }}>💡 Everyday Analogy</h3>
            <p style={{ lineHeight: '1.7', color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0 }}>
              {activeLesson.analogy}
            </p>
          </div>

          {/* COMPLEXITY BADGE */}
          <div style={{ background: 'rgba(16,185,129,0.08)', padding: '1rem 1.4rem', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.9rem' }}>Complexity Model:</span>
            <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{activeLesson.complexity}</span>
          </div>

          {/* MULTI-LANGUAGE CODE BLOCK */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>💻 Code:</span>
                {['C++', 'Java', 'Python', 'JS', 'C'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      border: activeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                      background: activeLang === lang ? 'var(--accent-primary)' : 'transparent',
                      color: activeLang === lang ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: activeLang === lang ? 700 : 400
                    }}
                  >
                    {lang === 'JS' ? 'JavaScript' : lang}
                  </button>
                ))}

                {/* Full Program vs Snippet Toggle */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px', border: '1px solid var(--glass-border)', marginLeft: '6px' }}>
                  <button 
                    onClick={() => setCodeViewMode('full')}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.74rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: codeViewMode === 'full' ? 'var(--accent-primary)' : 'transparent',
                      color: codeViewMode === 'full' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: codeViewMode === 'full' ? 700 : 500
                    }}
                    title="Display full complete runnable program with imports and main()"
                  >
                    📑 Complete Code
                  </button>
                  <button 
                    onClick={() => setCodeViewMode('snippet')}
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.74rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: codeViewMode === 'snippet' ? 'var(--accent-primary)' : 'transparent',
                      color: codeViewMode === 'snippet' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: codeViewMode === 'snippet' ? 700 : 500
                    }}
                    title="Display function snippet only"
                  >
                    ⚡ Snippet
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                  <button onClick={() => setCodeFontSize(prev => Math.max(12, prev - 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 7px', cursor: 'pointer' }} title="Decrease font size">A−</button>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{codeFontSize}px</span>
                  <button onClick={() => setCodeFontSize(prev => Math.min(36, prev + 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 7px', cursor: 'pointer' }} title="Increase font size">A+</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-clear"
                  style={{ padding: '3px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleCopy}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
                <button
                  className="btn btn-insert"
                  style={{ padding: '3px 12px', fontSize: '0.75rem' }}
                  onClick={() => setIsRunnerOpen(true)}
                >
                  ▶ Run Live
                </button>
              </div>
            </div>

            <pre style={{
              margin: 0,
              padding: '16px 20px',
              background: 'var(--bg-primary, rgba(0,0,0,0.3))',
              color: '#f8fafc',
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: `${codeFontSize}px`,
              lineHeight: '1.75',
              fontWeight: 500,
              overflowX: 'auto'
            }}>
              {toAllman(activeCodeToDisplay).split('\n').map((line, idx) => (
                <div key={idx} style={{ padding: '1px 0', whiteSpace: 'pre', color: '#f8fafc' }}>
                  {line || ' '}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* CODE RUNNER MODAL */}
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={activeCodeToDisplay}
        language={activeLang}
      />
    </div>
  );
};

export default DSAStudyVisualizer;
