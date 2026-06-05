/* eslint-disable no-unused-vars */
export const getGeneralCodeTemplate = (lang, type, variety, operations) => {
  // Normalize language first
  if (lang) {
    let l = lang.toLowerCase();
    if (l === 'java') lang = 'Java';
    else if (l === 'cpp' || l === 'c++') lang = 'C++';
    else if (l === 'python') lang = 'Python';
    else if (l === 'js' || l === 'javascript') lang = 'JS';
  }

  let execBlock = '';
  
  if (!operations || !operations.length) {
    execBlock = '// Perform operations in the visualizer to see execution code here...';
  } else {
    let ops = [];
    operations.forEach(o => {
      let opName = o.op;
      if (o.val !== undefined) {
        ops.push(`${opName}(${o.val})`);
      } else {
        ops.push(`${opName}()`);
      }
    });

    if (lang === 'C++') {
      if (type === 'STACK') {
        execBlock = `    Stack s(100);\n` + ops.map(op => `    s.${op};`).join('\n') + `\n    s.display();`;
      } else if (type === 'QUEUE') {
        execBlock = `    Queue q(100);\n` + ops.map(op => `    q.${op};`).join('\n') + `\n    q.display();`;
      } else if (type === 'LINKED_LIST') {
        execBlock = `    LinkedList list;\n` + ops.map(op => `    list.${op};`).join('\n') + `\n    list.printList();`;
      } else if (type === 'HASH_TABLE') {
        execBlock = `    HashTable ht(7);\n` + ops.map(op => `    ht.${op};`).join('\n') + `\n    ht.display();`;
      }
    } else if (lang === 'Java') {
      if (type === 'STACK') {
        execBlock = `        Stack s = new Stack(100);\n` + ops.map(op => `        s.${op};`).join('\n') + `\n        s.display();`;
      } else if (type === 'QUEUE') {
        execBlock = `        Queue q = new Queue(100);\n` + ops.map(op => `        q.${op};`).join('\n') + `\n        q.display();`;
      } else if (type === 'LINKED_LIST') {
        execBlock = `        LinkedList list = new LinkedList();\n` + ops.map(op => `        list.${op};`).join('\n') + `\n        list.printList();`;
      } else if (type === 'HASH_TABLE') {
        execBlock = `        HashTable ht = new HashTable(7);\n` + ops.map(op => `        ht.${op};`).join('\n') + `\n        ht.printTable();`;
      }
    } else if (lang === 'Python') {
      if (type === 'STACK') {
        execBlock = `    s = Stack()\n` + ops.map(op => `    s.${op}`).join('\n') + `\n    s.display()`;
      } else if (type === 'QUEUE') {
        execBlock = `    q = Queue()\n` + ops.map(op => `    q.${op}`).join('\n') + `\n    q.display()`;
      } else if (type === 'LINKED_LIST') {
        execBlock = `    list = LinkedList()\n` + ops.map(op => `    list.${op}`).join('\n') + `\n    list.print_list()`;
      } else if (type === 'HASH_TABLE') {
        execBlock = `    ht = HashTable(7)\n` + ops.map(op => `    ht.${op}`).join('\n') + `\n    ht.display()`;
      }
    } else { // JS
      if (type === 'STACK') {
        execBlock = `  const s = new Stack(100);\n` + ops.map(op => `  s.${op};`).join('\n') + `\n  s.display();`;
      } else if (type === 'QUEUE') {
        execBlock = `  const q = new Queue(100);\n` + ops.map(op => `  q.${op};`).join('\n') + `\n  q.display();`;
      } else if (type === 'LINKED_LIST') {
        execBlock = `  const list = new LinkedList();\n` + ops.map(op => `  list.${op};`).join('\n') + `\n  list.printList();`;
      } else if (type === 'HASH_TABLE') {
        execBlock = `  const ht = new HashTable(7);\n` + ops.map(op => `  ht.${op};`).join('\n') + `\n  ht.display();`;
      }
    }
  }

  // LINKED LISTS
  if (type === 'LINKED_LIST') {
    if (variety === 'LL_SINGLY') {
      if (lang === 'Java') return `class Node {
    int data; Node next;
    Node(int d) { data = d; next = null; }
}
class LinkedList {
    Node head;
    void insertTail(int data) {
        Node n = new Node(data);
        if(head == null) { head = n; return; }
        Node t = head;
        while(t.next != null) t = t.next;
        t.next = n;
    }
    void printList() {
        Node t = head;
        while(t != null) { System.out.print(t.data + " -> "); t = t.next; }
        System.out.println("null");
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
struct Node {
    int data; Node* next;
    Node(int d) : data(d), next(nullptr) {}
};
class LinkedList {
    Node* head = nullptr;
public:
    void insertTail(int data) {
        Node* n = new Node(data);
        if(!head) { head = n; return; }
        Node* t = head;
        while(t->next) t = t->next;
        t->next = n;
    }
    void printList() {
        Node* t = head;
        while(t) { cout << t->data << " -> "; t = t->next; }
        cout << "null\\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Node:
    def __init__(self, d):
        self.data = d
        self.next = None
class LinkedList:
    def __init__(self): self.head = None
    def insertTail(self, d):
        n = Node(d)
        if not self.head:
            self.head = n
            return
        t = self.head
        while t.next: t = t.next
        t.next = n
    def print_list(self):
        t = self.head
        while t:
            print(t.data, end=" -> ")
            t = t.next
        print("None")
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Node {
    constructor(d) { this.data = d; this.next = null; }
}
class LinkedList {
    constructor() { this.head = null; }
    insertTail(d) {
        let n = new Node(d);
        if(!this.head) { this.head = n; return; }
        let t = this.head;
        while(t.next) t = t.next;
        t.next = n;
    }
    printList() {
        let t = this.head, out = [];
        while(t) { out.push(t.data); t = t.next; }
        console.log(out.join(" -> ") + " -> null");
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'LL_DOUBLY') {
      if (lang === 'Java') return `class Node {
    int data; Node prev, next;
    Node(int d) { data = d; prev = next = null; }
}
class LinkedList {
    Node head, tail;
    void insertTail(int data) {
        Node n = new Node(data);
        if(head == null) { head = tail = n; return; }
        tail.next = n; n.prev = tail; tail = n;
    }
    void printList() {
        Node t = head;
        while(t != null) { System.out.print(t.data + " <-> "); t = t.next; }
        System.out.println("null");
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
struct Node {
    int data; Node *prev, *next;
    Node(int d) : data(d), prev(nullptr), next(nullptr) {}
};
class LinkedList {
    Node *head = nullptr, *tail = nullptr;
public:
    void insertTail(int data) {
        Node* n = new Node(data);
        if(!head) { head = tail = n; return; }
        tail->next = n; n->prev = tail; tail = n;
    }
    void printList() {
        Node* t = head;
        while(t) { cout << t->data << " <-> "; t = t->next; }
        cout << "null\\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Node:
    def __init__(self, d):
        self.data = d
        self.prev = self.next = None
class LinkedList:
    def __init__(self): self.head = self.tail = None
    def insertTail(self, d):
        n = Node(d)
        if not self.head:
            self.head = self.tail = n
            return
        self.tail.next = n
        n.prev = self.tail
        self.tail = n
    def print_list(self):
        t = self.head
        while t:
            print(t.data, end=" <-> ")
            t = t.next
        print("None")
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Node {
    constructor(d) { this.data = d; this.prev = this.next = null; }
}
class LinkedList {
    constructor() { this.head = this.tail = null; }
    insertTail(d) {
        let n = new Node(d);
        if(!this.head) { this.head = this.tail = n; return; }
        this.tail.next = n; n.prev = this.tail; this.tail = n;
    }
    printList() {
        let t = this.head, out = [];
        while(t) { out.push(t.data); t = t.next; }
        console.log(out.join(" <-> ") + " <-> null");
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'LL_CIRCULAR') {
      if (lang === 'Java') return `class Node {
    int data; Node next;
    Node(int d) { data = d; }
}
class LinkedList {
    Node head, tail;
    void insertTail(int data) {
        Node n = new Node(data);
        if(head == null) { head = tail = n; n.next = head; return; }
        tail.next = n; tail = n; tail.next = head;
    }
    void printList() {
        if(head == null) return;
        Node t = head;
        do { System.out.print(t.data + " -> "); t = t.next; } while(t != head);
        System.out.println("(head)");
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
struct Node {
    int data; Node* next;
    Node(int d) : data(d), next(nullptr) {}
};
class LinkedList {
    Node *head = nullptr, *tail = nullptr;
public:
    void insertTail(int data) {
        Node* n = new Node(data);
        if(!head) { head = tail = n; n->next = head; return; }
        tail->next = n; tail = n; tail->next = head;
    }
    void printList() {
        if(!head) return;
        Node* t = head;
        do { cout << t->data << " -> "; t = t->next; } while(t != head);
        cout << "(head)\\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Node:
    def __init__(self, d):
        self.data = d
        self.next = None
class LinkedList:
    def __init__(self): self.head = self.tail = None
    def insertTail(self, d):
        n = Node(d)
        if not self.head:
            self.head = self.tail = n
            n.next = self.head
            return
        self.tail.next = n
        self.tail = n
        self.tail.next = self.head
    def print_list(self):
        if not self.head: return
        t = self.head
        while True:
            print(t.data, end=" -> ")
            t = t.next
            if t == self.head: break
        print("(head)")
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Node {
    constructor(d) { this.data = d; this.next = null; }
}
class LinkedList {
    constructor() { this.head = this.tail = null; }
    insertTail(d) {
        let n = new Node(d);
        if(!this.head) { this.head = this.tail = n; n.next = this.head; return; }
        this.tail.next = n; this.tail = n; this.tail.next = this.head;
    }
    printList() {
        if(!this.head) return;
        let t = this.head, out = [];
        do { out.push(t.data); t = t.next; } while(t !== this.head);
        console.log(out.join(" -> ") + " -> (head)");
    }
}
// Execution
${execBlock}`;
    }
  }

  // STACKS
  if (type === 'STACK') {
    if (variety === 'STACK_ARRAY') {
      if (lang === 'Java') return `class Stack {
    int[] arr; int top, cap;
    Stack(int size) { arr = new int[size]; cap = size; top = -1; }
    void push(int val) { if (top == cap - 1) return; arr[++top] = val; }
    int pop() { if (top == -1) return -1; return arr[top--]; }
    void display() { for(int i=0; i<=top; i++) System.out.print(arr[i] + " "); System.out.println(); }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
class Stack {
    int* arr; int top, cap;
public:
    Stack(int size) { arr = new int[size]; cap = size; top = -1; }
    void push(int val) { if (top == cap - 1) return; arr[++top] = val; }
    int pop() { if (top == -1) return -1; return arr[top--]; }
    void display() { for(int i=0; i<=top; i++) cout << arr[i] << " "; cout << "\\n"; }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Stack:
    def __init__(self): self.arr = []
    def push(self, val): self.arr.append(val)
    def pop(self): return self.arr.pop() if self.arr else None
    def display(self): print(self.arr)
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Stack {
    constructor() { this.arr = []; }
    push(val) { this.arr.push(val); }
    pop() { return this.arr.pop(); }
    display() { console.log(this.arr); }
}
// Execution
${execBlock}`;
    } else if (variety === 'STACK_LL') {
      if (lang === 'Java') return `class Node {
    int data; Node next;
    Node(int d) { data = d; next = null; }
}
class Stack {
    Node top;
    void push(int val) { Node n = new Node(val); n.next = top; top = n; }
    int pop() { if(top == null) return -1; int d = top.data; top = top.next; return d; }
    void display() { Node t = top; while(t != null) { System.out.print(t.data + " "); t = t.next; } System.out.println(); }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
struct Node { int data; Node* next; Node(int d) : data(d), next(nullptr) {} };
class Stack {
    Node* top = nullptr;
public:
    void push(int val) { Node* n = new Node(val); n->next = top; top = n; }
    int pop() { if(!top) return -1; int d = top->data; top = top->next; return d; }
    void display() { Node* t = top; while(t) { cout << t->data << " "; t = t->next; } cout << "\\n"; }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Node:
    def __init__(self, d): self.data = d; self.next = None
class Stack:
    def __init__(self): self.top = None
    def push(self, val):
        n = Node(val); n.next = self.top; self.top = n
    def pop(self):
        if not self.top: return None
        d = self.top.data; self.top = self.top.next; return d
    def display(self):
        t = self.top; out = []
        while t: out.append(t.data); t = t.next
        print(out)
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Node {
    constructor(d) { this.data = d; this.next = null; }
}
class Stack {
    constructor() { this.top = null; }
    push(val) { let n = new Node(val); n.next = this.top; this.top = n; }
    pop() { if(!this.top) return null; let d = this.top.data; this.top = this.top.next; return d; }
    display() {
        let t = this.top, out = [];
        while(t) { out.push(t.data); t = t.next; }
        console.log(out);
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'STACK_EXPRESSION') {
        let expFallback = `// Evaluate Postfix / Prefix Expression Logic here...`;
        if(lang === 'Java') return `import java.util.Stack;
public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        // ${execBlock}
        System.out.println("Result: " + (s.isEmpty() ? 0 : s.pop()));
    }
}`;
        if(lang === 'C++') return `#include <iostream>
#include <stack>
using namespace std;
int main() {
    stack<int> s;
    // ${execBlock}
    cout << "Result: " << (s.empty() ? 0 : s.top()) << endl;
    return 0;
}`;
        if(lang === 'Python') return `if __name__ == "__main__":
    s = []
    # ${execBlock}
    print("Result:", s.pop() if s else 0)`;
        if(lang === 'JS') return `const s = [];
// ${execBlock}
console.log("Result:", s.length ? s.pop() : 0);`;
    }
  }

  // QUEUES
  if (type === 'QUEUE') {
    if (variety === 'QUEUE_SIMPLE') {
      if (lang === 'Java') return `class Queue {
    int[] arr; int front=0, rear=-1, cap;
    Queue(int size) { cap = size; arr = new int[cap]; }
    void enqueue(int val) { if (rear == cap - 1) return; arr[++rear] = val; }
    int dequeue() { if (front > rear) return -1; return arr[front++]; }
    void display() { for(int i=front; i<=rear; i++) System.out.print(arr[i]+" "); System.out.println(); }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
class Queue {
    int* arr; int front=0, rear=-1, cap;
public:
    Queue(int size) { cap = size; arr = new int[cap]; }
    void enqueue(int val) { if (rear == cap - 1) return; arr[++rear] = val; }
    int dequeue() { if (front > rear) return -1; return arr[front++]; }
    void display() { for(int i=front; i<=rear; i++) cout << arr[i] << " "; cout << "\\n"; }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Queue:
    def __init__(self): self.arr = []
    def enqueue(self, val): self.arr.append(val)
    def dequeue(self): return self.arr.pop(0) if self.arr else None
    def display(self): print(self.arr)
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor() { this.arr = []; }
    enqueue(val) { this.arr.push(val); }
    dequeue() { return this.arr.shift(); }
    display() { console.log(this.arr); }
}
// Execution
${execBlock}`;
    } else if (variety === 'QUEUE_CIRCULAR') {
      if (lang === 'Java') return `class Queue {
    int[] arr; int front=-1, rear=-1, cap;
    Queue(int size) { cap = size; arr = new int[cap]; }
    void enqueue(int val) {
        if ((rear + 1) % cap == front) return;
        if (front == -1) front = 0;
        rear = (rear + 1) % cap; arr[rear] = val;
    }
    int dequeue() {
        if (front == -1) return -1;
        int d = arr[front];
        if (front == rear) { front = -1; rear = -1; } else front = (front + 1) % cap;
        return d;
    }
    void display() { /* Print circular logic */ }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;
class Queue {
    int* arr; int front=-1, rear=-1, cap;
public:
    Queue(int size) { cap = size; arr = new int[cap]; }
    void enqueue(int val) {
        if ((rear + 1) % cap == front) return;
        if (front == -1) front = 0;
        rear = (rear + 1) % cap; arr[rear] = val;
    }
    int dequeue() {
        if (front == -1) return -1;
        int d = arr[front];
        if (front == rear) { front = -1; rear = -1; } else front = (front + 1) % cap;
        return d;
    }
    void display() {}
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Queue:
    def __init__(self, cap=100):
        self.arr = [None]*cap; self.cap = cap; self.front = -1; self.rear = -1
    def enqueue(self, val):
        if (self.rear + 1) % self.cap == self.front: return
        if self.front == -1: self.front = 0
        self.rear = (self.rear + 1) % self.cap
        self.arr[self.rear] = val
    def dequeue(self):
        if self.front == -1: return None
        d = self.arr[self.front]
        if self.front == self.rear: self.front = self.rear = -1
        else: self.front = (self.front + 1) % self.cap
        return d
    def display(self): pass
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor(cap=100) { this.arr = new Array(cap); this.cap = cap; this.front = -1; this.rear = -1; }
    enqueue(val) {
        if ((this.rear + 1) % this.cap === this.front) return;
        if (this.front === -1) this.front = 0;
        this.rear = (this.rear + 1) % this.cap; this.arr[this.rear] = val;
    }
    dequeue() {
        if (this.front === -1) return null;
        let d = this.arr[this.front];
        if (this.front === this.rear) { this.front = -1; this.rear = -1; } else this.front = (this.front + 1) % this.cap;
        return d;
    }
    display() {}
}
// Execution
${execBlock}`;
    } else if (variety === 'QUEUE_DEQUE') {
      if (lang === 'Java') return `class Queue {
    // Basic Deque
    java.util.LinkedList<Integer> dq = new java.util.LinkedList<>();
    void enqueueFront(int v) { dq.addFirst(v); }
    void enqueueRear(int v) { dq.addLast(v); }
    int dequeueFront() { return dq.removeFirst(); }
    int dequeueRear() { return dq.removeLast(); }
    void display() { System.out.println(dq); }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
#include <deque>
using namespace std;
class Queue {
    deque<int> dq;
public:
    Queue(int c) {}
    void enqueueFront(int v) { dq.push_front(v); }
    void enqueueRear(int v) { dq.push_back(v); }
    int dequeueFront() { int v = dq.front(); dq.pop_front(); return v; }
    int dequeueRear() { int v = dq.back(); dq.pop_back(); return v; }
    void display() { for(int v : dq) cout << v << " "; cout << "\\n"; }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `import collections
class Queue:
    def __init__(self): self.dq = collections.deque()
    def enqueueFront(self, v): self.dq.appendleft(v)
    def enqueueRear(self, v): self.dq.append(v)
    def dequeueFront(self): return self.dq.popleft()
    def dequeueRear(self): return self.dq.pop()
    def display(self): print(list(self.dq))
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor() { this.arr = []; }
    enqueueFront(val) { this.arr.unshift(val); }
    enqueueRear(val) { this.arr.push(val); }
    dequeueFront() { return this.arr.shift(); }
    dequeueRear() { return this.arr.pop(); }
    display() { console.log(this.arr); }
}
// Execution
${execBlock}`;
    } else if (variety === 'QUEUE_PRIORITY') {
      if (lang === 'Java') return `import java.util.PriorityQueue;
class Queue {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    void enqueue(int v) { pq.add(v); }
    int dequeue() { return pq.poll(); }
    void display() { System.out.println(pq); }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
#include <queue>
using namespace std;
class Queue {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    Queue(int c) {}
    void enqueue(int v) { pq.push(v); }
    int dequeue() { int v = pq.top(); pq.pop(); return v; }
    void display() { /* PQ traversal not standard */ }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `import heapq
class Queue:
    def __init__(self): self.pq = []
    def enqueue(self, v): heapq.heappush(self.pq, v)
    def dequeue(self): return heapq.heappop(self.pq)
    def display(self): print(self.pq)
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor() { this.arr = []; }
    enqueue(val) { this.arr.push(val); this.arr.sort((a,b) => a-b); }
    dequeue() { return this.arr.shift(); }
    display() { console.log(this.arr); }
}
// Execution
${execBlock}`;
    }
  }

  // HASH TABLES
  if (type === 'HASH_TABLE') {
    if (variety === 'HASH_CHAINING') {
      if (lang === 'Java') return `import java.util.LinkedList;
class HashTable {
    int tableSize; LinkedList<Integer>[] table;
    HashTable(int size) {
        tableSize = size; table = new LinkedList[size];
        for(int i=0; i<size; i++) table[i] = new LinkedList<>();
    }
    void insert(int key) {
        int index = key % tableSize;
        if (!table[index].contains(key)) table[index].add(key);
    }
    void printTable() {
        for(int i=0; i<tableSize; i++) System.out.println(i + ": " + table[i]);
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
#include <vector>
#include <list>
#include <algorithm>
using namespace std;
class HashTable {
    int tableSize; vector<list<int>> table;
public:
    HashTable(int size) { tableSize = size; table.resize(size); }
    void insert(int key) {
        int index = key % tableSize;
        auto it = find(table[index].begin(), table[index].end(), key);
        if(it == table[index].end()) table[index].push_back(key);
    }
    void display() {
        for(int i=0; i<tableSize; i++) {
            cout << i << ": ";
            for(int v : table[i]) cout << v << " ";
            cout << "\\n";
        }
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class HashTable:
    def __init__(self, size):
        self.size = size; self.table = [[] for _ in range(size)]
    def insert(self, key):
        index = key % self.size
        if key not in self.table[index]: self.table[index].append(key)
    def display(self):
        for i, b in enumerate(self.table): print(f"{i}: {b}")
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class HashTable {
    constructor(size) { this.size = size; this.table = Array.from({length: size}, () => []); }
    insert(key) {
        let index = key % this.size;
        if (!this.table[index].includes(key)) this.table[index].push(key);
    }
    display() { this.table.forEach((b,i) => console.log(i + ": " + b.join(','))); }
}
// Execution
${execBlock}`;
    } else if (variety === 'HASH_LINEAR' || variety === 'HASH_QUADRATIC') {
      let isQuad = variety === 'HASH_QUADRATIC';
      let probeCodeC = isQuad ? 'int probe = (index + i * i) % tableSize;' : 'int probe = (index + i) % tableSize;';
      let probeCodeJ = isQuad ? 'int probe = (index + i * i) % tableSize;' : 'int probe = (index + i) % tableSize;';
      let probeCodeP = isQuad ? 'probe = (index + i * i) % self.size' : 'probe = (index + i) % self.size';
      let probeCodeJS = isQuad ? 'let probe = (index + i * i) % this.size;' : 'let probe = (index + i) % this.size;';

      if (lang === 'Java') return `import java.util.Arrays;
class HashTable {
    Integer[] table; int tableSize;
    HashTable(int size) { tableSize = size; table = new Integer[size]; }
    void insert(int key) {
        int index = key % tableSize;
        for (int i=0; i<tableSize; i++) {
            ${probeCodeJ}
            if (table[probe] == null || table[probe] == -1) { table[probe] = key; return; }
            if (table[probe] == key) return;
        }
    }
    void printTable() { System.out.println(Arrays.toString(table)); }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
#include <vector>
using namespace std;
class HashTable {
    vector<int> table; int tableSize;
public:
    HashTable(int size) { tableSize = size; table.assign(size, -1); }
    void insert(int key) {
        int index = key % tableSize;
        for (int i=0; i<tableSize; i++) {
            ${probeCodeC}
            if (table[probe] == -1 || table[probe] == -2) { table[probe] = key; return; }
            if (table[probe] == key) return;
        }
    }
    void display() {
        for(int v : table) cout << v << " ";
        cout << "\\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class HashTable:
    def __init__(self, size):
        self.size = size; self.table = [None]*size
    def insert(self, key):
        index = key % self.size
        for i in range(self.size):
            ${probeCodeP}
            if self.table[probe] is None or self.table[probe] == -1:
                self.table[probe] = key
                return
            if self.table[probe] == key: return
    def display(self): print(self.table)
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class HashTable {
    constructor(size) { this.size = size; this.table = new Array(size).fill(null); }
    insert(key) {
        let index = key % this.size;
        for (let i=0; i<this.size; i++) {
            ${probeCodeJS}
            if (this.table[probe] === null || this.table[probe] === 'TOMBSTONE') { this.table[probe] = key; return; }
            if (this.table[probe] === key) return;
        }
    }
    display() { console.log(this.table); }
}
// Execution
${execBlock}`;
    }
  }

  return `// Code template for ${type} - ${variety} in ${lang} coming soon...`;
};
