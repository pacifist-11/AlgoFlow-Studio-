const toCCode = (cppCode) => {
  if (!cppCode) return cppCode;
  return cppCode
    .replace('#include <iostream>\nusing namespace std;', '#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>')
    .replace('#include <iostream>', '#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>')
    .replace(/using namespace std;/g, '')
    .replace(/std::/g, '')
    .replace(/cout\s*<<\s*([^<]+)\s*<<\s*endl;/g, 'printf("%d\\n", $1);')
    .replace(/cout\s*<<\s*([^;]+);/g, 'printf("%s\\n", $1);');
};

export const getGeneralCodeTemplate = (lang, type, variety, operations) => {
  // Normalize language first
  if (lang) {
    let l = lang.toLowerCase();
    if (l === 'c') lang = 'C';
    else if (l === 'java') lang = 'Java';
    else if (l === 'cpp' || l === 'c++') lang = 'C++';
    else if (l === 'python') lang = 'Python';
    else if (l === 'js' || l === 'javascript') lang = 'JS';
  }

  if (lang === 'C') {
    const cppRes = getGeneralCodeTemplate('C++', type, variety, operations);
    return toCCode(cppRes);
  }

  let execBlock = '';
  
  if (!operations || !operations.length) {
    execBlock = '// Perform operations in the visualizer to see execution code here...';
  } else {
    let ops = [];
    operations.forEach(o => {
      let opName = o.op;
      if (lang === 'C++' && opName === 'delete') {
        opName = 'remove';
      }
      if (o.val !== undefined) {
        ops.push(`${opName}(${o.val})`);
      } else {
        ops.push(`${opName}()`);
      }
    });

    if (lang === 'C++') {
      if (type === 'STACK') {
        if (variety === 'STACK_EXPRESSION') {
          execBlock = `    ExpressionEvaluator ev;\n` + ops.map(op => `    cout << "Result: " << ev.${op} << endl;`).join('\n');
        } else if (variety === 'STACK_BRACKETS') {
          execBlock = `    BracketEvaluator ev;\n` + ops.map(op => `    cout << (ev.${op} ? "Balanced" : "Unbalanced") << endl;`).join('\n');
        } else if (variety === 'STACK_CONVERSION') {
          execBlock = `    EquationAnalyzer ev;\n` + ops.map(op => {
            let methodName = op.split('(')[0];
            if (op.includes("isBalanced")) return `    cout << "${methodName}: " << (ev.${op} ? "Balanced" : "Unbalanced") << endl;`;
            return `    cout << "${methodName}: " << ev.${op} << endl;`;
          }).join('\n');
        } else {
          let constructorArg = variety === 'STACK_LL' ? '' : '(100)';
          execBlock = `    Stack s${constructorArg};\n` + ops.map(op => `    s.${op};`).join('\n') + `\n    s.display();`;
        }
      } else if (type === 'QUEUE') {
        execBlock = `    Queue q(100);\n` + ops.map(op => `    q.${op};`).join('\n') + `\n    q.display();`;
      } else if (type === 'LINKED_LIST') {
        if (variety === 'LL_POLYNOMIAL') {
          execBlock = `    PolynomialSolver solver;\n` + ops.map(op => `    solver.${op};`).join('\n');
        } else {
          execBlock = `    LinkedList list;\n` + ops.map(op => `    list.${op};`).join('\n') + `\n    list.printList();`;
        }
      } else if (type === 'HASH_TABLE') {
        execBlock = `    HashTable ht(7);\n` + ops.map(op => `    ht.${op};`).join('\n') + `\n    ht.display();`;
      }
    } else if (lang === 'Java') {
      if (type === 'STACK') {
        if (variety === 'STACK_EXPRESSION') {
          execBlock = `        ExpressionEvaluator ev = new ExpressionEvaluator();\n` + ops.map(op => `        System.out.println("Result: " + ev.${op});`).join('\n');
        } else if (variety === 'STACK_BRACKETS') {
          execBlock = `        BracketEvaluator ev = new BracketEvaluator();\n` + ops.map(op => `        System.out.println(ev.${op} ? "Balanced" : "Unbalanced");`).join('\n');
        } else if (variety === 'STACK_CONVERSION') {
          execBlock = `        EquationAnalyzer ev = new EquationAnalyzer();\n` + ops.map(op => {
            let methodName = op.split('(')[0];
            if (op.includes("isBalanced")) return `        System.out.println("${methodName}: " + (ev.${op} ? "Balanced" : "Unbalanced"));`;
            return `        System.out.println("${methodName}: " + ev.${op});`;
          }).join('\n');
        } else {
          let constructorArg = variety === 'STACK_LL' ? '' : '100';
          execBlock = `        Stack s = new Stack(${constructorArg});\n` + ops.map(op => `        s.${op};`).join('\n') + `\n        s.display();`;
        }
      } else if (type === 'QUEUE') {
        execBlock = `        Queue q = new Queue(100);\n` + ops.map(op => `        q.${op};`).join('\n') + `\n        q.display();`;
      } else if (type === 'LINKED_LIST') {
        if (variety === 'LL_POLYNOMIAL') {
          execBlock = `        PolynomialSolver solver = new PolynomialSolver();\n` + ops.map(op => `        solver.${op};`).join('\n');
        } else {
          execBlock = `        LinkedList list = new LinkedList();\n` + ops.map(op => `        list.${op};`).join('\n') + `\n        list.printList();`;
        }
      } else if (type === 'HASH_TABLE') {
        execBlock = `        HashTable ht = new HashTable(7);\n` + ops.map(op => `        ht.${op};`).join('\n') + `\n        ht.printTable();`;
      }
    } else if (lang === 'Python') {
      if (type === 'STACK') {
        if (variety === 'STACK_EXPRESSION') {
          execBlock = `    ev = ExpressionEvaluator()\n` + ops.map(op => `    print("Result:", ev.${op})`).join('\n');
        } else if (variety === 'STACK_BRACKETS') {
          execBlock = `    ev = BracketEvaluator()\n` + ops.map(op => `    print("Balanced" if ev.${op} else "Unbalanced")`).join('\n');
        } else if (variety === 'STACK_CONVERSION') {
          execBlock = `    ev = EquationAnalyzer()\n` + ops.map(op => {
            let methodName = op.split('(')[0];
            if (op.includes("isBalanced")) return `    print("${methodName}:", "Balanced" if ev.${op} else "Unbalanced")`;
            return `    print("${methodName}:", ev.${op})`;
          }).join('\n');
        } else {
          execBlock = `    s = Stack()\n` + ops.map(op => `    s.${op}`).join('\n') + `\n    s.display()`;
        }
      } else if (type === 'QUEUE') {
        execBlock = `    q = Queue()\n` + ops.map(op => `    q.${op}`).join('\n') + `\n    q.display()`;
      } else if (type === 'LINKED_LIST') {
        if (variety === 'LL_POLYNOMIAL') {
          execBlock = `    solver = PolynomialSolver()\n` + ops.map(op => `    solver.${op}`).join('\n');
        } else {
          execBlock = `    list = LinkedList()\n` + ops.map(op => `    list.${op}`).join('\n') + `\n    list.print_list()`;
        }
      } else if (type === 'HASH_TABLE') {
        execBlock = `    ht = HashTable(7)\n` + ops.map(op => `    ht.${op}`).join('\n') + `\n    ht.display()`;
      }
    } else { // JS
      if (type === 'STACK') {
        if (variety === 'STACK_EXPRESSION') {
          execBlock = `  const ev = new ExpressionEvaluator();\n` + ops.map(op => `  console.log("Result:", ev.${op});`).join('\n');
        } else if (variety === 'STACK_BRACKETS') {
          execBlock = `  const ev = new BracketEvaluator();\n` + ops.map(op => `  console.log(ev.${op} ? "Balanced" : "Unbalanced");`).join('\n');
        } else if (variety === 'STACK_CONVERSION') {
          execBlock = `  const ev = new EquationAnalyzer();\n` + ops.map(op => {
            let methodName = op.split('(')[0];
            if (op.includes("isBalanced")) return `  console.log("${methodName}:", ev.${op} ? "Balanced" : "Unbalanced");`;
            return `  console.log("${methodName}:", ev.${op});`;
          }).join('\n');
        } else {
          let constructorArg = variety === 'STACK_LL' ? '' : '100';
          execBlock = `  const s = new Stack(${constructorArg});\n` + ops.map(op => `  s.${op};`).join('\n') + `\n  s.display();`;
        }
      } else if (type === 'QUEUE') {
        execBlock = `  const q = new Queue(100);\n` + ops.map(op => `  q.${op};`).join('\n') + `\n  q.display();`;
      } else if (type === 'LINKED_LIST') {
        if (variety === 'LL_POLYNOMIAL') {
          execBlock = `  const solver = new PolynomialSolver();\n` + ops.map(op => `  solver.${op};`).join('\n');
        } else {
          execBlock = `  const list = new LinkedList();\n` + ops.map(op => `  list.${op};`).join('\n') + `\n  list.printList();`;
        }
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
    void insertHead(int data) {
        Node n = new Node(data);
        n.next = head; head = n;
    }
    void insertTail(int data) {
        Node n = new Node(data);
        if(head == null) { head = n; return; }
        Node t = head;
        while(t.next != null) t = t.next;
        t.next = n;
    }
    void deleteValue(int data) {
        if(head == null) return;
        if(head.data == data) { head = head.next; return; }
        Node t = head;
        while(t.next != null && t.next.data != data) t = t.next;
        if(t.next != null) t.next = t.next.next;
    }
    boolean search(int data) {
        Node t = head;
        while (t != null) {
            if (t.data == data) return true;
            t = t.next;
        }
        return false;
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
    void insertHead(int data) {
        Node* n = new Node(data);
        n->next = head; head = n;
    }
    void insertTail(int data) {
        Node* n = new Node(data);
        if(!head) { head = n; return; }
        Node* t = head;
        while(t->next) t = t->next;
        t->next = n;
    }
    void deleteValue(int data) {
        if(!head) return;
        if(head->data == data) { Node* temp = head; head = head->next; delete temp; return; }
        Node* t = head;
        while(t->next && t->next->data != data) t = t->next;
        if(t->next) { Node* temp = t->next; t->next = t->next->next; delete temp; }
    }
    bool search(int data) {
        Node* t = head;
        while (t) {
            if (t->data == data) return true;
            t = t->next;
        }
        return false;
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
    def insertHead(self, d):
        n = Node(d)
        n.next = self.head
        self.head = n
    def insertTail(self, d):
        n = Node(d)
        if not self.head:
            self.head = n
            return
        t = self.head
        while t.next: t = t.next
        t.next = n
    def deleteValue(self, d):
        if not self.head: return
        if self.head.data == d:
            self.head = self.head.next
            return
        t = self.head
        while t.next and t.next.data != d: t = t.next
        if t.next: t.next = t.next.next
    def search(self, d):
        t = self.head
        while t:
            if t.data == d: return True
            t = t.next
        return False
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
    insertHead(d) {
        let n = new Node(d);
        n.next = this.head;
        this.head = n;
    }
    insertTail(d) {
        let n = new Node(d);
        if(!this.head) { this.head = n; return; }
        let t = this.head;
        while(t.next) t = t.next;
        t.next = n;
    }
    deleteValue(d) {
        if(!this.head) return;
        if(this.head.data === d) { this.head = this.head.next; return; }
        let t = this.head;
        while(t.next && t.next.data !== d) t = t.next;
        if(t.next) t.next = t.next.next;
    }
    search(d) {
        let t = this.head;
        while (t) {
            if (t.data === d) return true;
            t = t.next;
        }
        return false;
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
    void insertHead(int data) {
        Node n = new Node(data);
        if(head == null) { head = tail = n; return; }
        n.next = head; head.prev = n; head = n;
    }
    void insertTail(int data) {
        Node n = new Node(data);
        if(head == null) { head = tail = n; return; }
        tail.next = n; n.prev = tail; tail = n;
    }
    void deleteValue(int data) {
        if(head == null) return;
        Node t = head;
        while(t != null && t.data != data) t = t.next;
        if(t == null) return;
        if(t == head) {
            head = head.next;
            if(head != null) head.prev = null;
            else tail = null;
        } else if(t == tail) {
            tail = tail.prev;
            if(tail != null) tail.next = null;
            else head = null;
        } else {
            t.prev.next = t.next;
            t.next.prev = t.prev;
        }
    }
    boolean search(int data) {
        Node t = head;
        while (t != null) {
            if (t.data == data) return true;
            t = t.next;
        }
        return false;
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
    void insertHead(int data) {
        Node* n = new Node(data);
        if(!head) { head = tail = n; return; }
        n->next = head; head->prev = n; head = n;
    }
    void insertTail(int data) {
        Node* n = new Node(data);
        if(!head) { head = tail = n; return; }
        tail->next = n; n->prev = tail; tail = n;
    }
    void deleteValue(int data) {
        if(!head) return;
        Node* t = head;
        while(t && t->data != data) t = t->next;
        if(!t) return;
        if(t == head) {
            head = head->next;
            if(head) head->prev = nullptr;
            else tail = nullptr;
        } else if(t == tail) {
            tail = tail->prev;
            if(tail) tail->next = nullptr;
            else head = nullptr;
        } else {
            t->prev->next = t->next;
            t->next->prev = t->prev;
        }
        delete t;
    }
    bool search(int data) {
        Node* t = head;
        while (t) {
            if (t->data == data) return true;
            t = t->next;
        }
        return false;
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
    def insertHead(self, d):
        n = Node(d)
        if not self.head:
            self.head = self.tail = n
            return
        n.next = self.head
        self.head.prev = n
        self.head = n
    def insertTail(self, d):
        n = Node(d)
        if not self.head:
            self.head = self.tail = n
            return
        self.tail.next = n
        n.prev = self.tail
        self.tail = n
    def deleteValue(self, d):
        if not self.head: return
        t = self.head
        while t and t.data != d: t = t.next
        if not t: return
        if t == self.head:
            self.head = self.head.next
            if self.head: self.head.prev = None
            else: self.tail = None
        elif t == self.tail:
            self.tail = self.tail.prev
            if self.tail: self.tail.next = None
            else: self.head = None
        else:
            t.prev.next = t.next
            t.next.prev = t.prev
    def search(self, d):
        t = self.head
        while t:
            if t.data == d: return True
            t = t.next
        return False
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
    insertHead(d) {
        let n = new Node(d);
        if(!this.head) { this.head = this.tail = n; return; }
        n.next = this.head;
        this.head.prev = n;
        this.head = n;
    }
    insertTail(d) {
        let n = new Node(d);
        if(!this.head) { this.head = this.tail = n; return; }
        this.tail.next = n; n.prev = this.tail; this.tail = n;
    }
    deleteValue(d) {
        if(!this.head) return;
        let t = this.head;
        while(t && t.data !== d) t = t.next;
        if(!t) return;
        if(t === this.head) {
            this.head = this.head.next;
            if(this.head) this.head.prev = null;
            else this.tail = null;
        } else if(t === this.tail) {
            this.tail = this.tail.prev;
            if(this.tail) this.tail.next = null;
            else this.head = null;
        } else {
            t.prev.next = t.next;
            t.next.prev = t.prev;
        }
    }
    search(d) {
        let t = this.head;
        while (t) {
            if (t.data === d) return true;
            t = t.next;
        }
        return false;
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
    void insertHead(int data) {
        Node n = new Node(data);
        if(head == null) { head = tail = n; n.next = head; return; }
        n.next = head; head = n; tail.next = head;
    }
    void insertTail(int data) {
        Node n = new Node(data);
        if(head == null) { head = tail = n; n.next = head; return; }
        tail.next = n; tail = n; tail.next = head;
    }
    void deleteValue(int data) {
        if(head == null) return;
        if(head.data == data) {
            if(head == tail) head = tail = null;
            else { head = head.next; tail.next = head; }
            return;
        }
        Node t = head;
        do {
            if(t.next.data == data) {
                if(t.next == tail) tail = t;
                t.next = t.next.next;
                return;
            }
            t = t.next;
        } while(t != head);
    }
    boolean search(int data) {
        if (head == null) return false;
        Node t = head;
        do {
            if (t.data == data) return true;
            t = t.next;
        } while (t != head);
        return false;
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
    void insertHead(int data) {
        Node* n = new Node(data);
        if(!head) { head = tail = n; n->next = head; return; }
        n->next = head; head = n; tail->next = head;
    }
    void insertTail(int data) {
        Node* n = new Node(data);
        if(!head) { head = tail = n; n->next = head; return; }
        tail->next = n; tail = n; tail->next = head;
    }
    void deleteValue(int data) {
        if(!head) return;
        if(head->data == data) {
            Node* temp = head;
            if(head == tail) head = tail = nullptr;
            else { head = head->next; tail->next = head; }
            delete temp;
            return;
        }
        Node* t = head;
        do {
            if(t->next->data == data) {
                Node* temp = t->next;
                if(temp == tail) tail = t;
                t->next = temp->next;
                delete temp;
                return;
            }
            t = t->next;
        } while(t != head);
    }
    bool search(int data) {
        if (!head) return false;
        Node* t = head;
        do {
            if (t->data == data) return true;
            t = t->next;
        } while (t != head);
        return false;
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
    def insertHead(self, d):
        n = Node(d)
        if not self.head:
            self.head = self.tail = n
            n.next = self.head
            return
        n.next = self.head
        self.head = n
        self.tail.next = self.head
    def insertTail(self, d):
        n = Node(d)
        if not self.head:
            self.head = self.tail = n
            n.next = self.head
            return
        self.tail.next = n
        self.tail = n
        self.tail.next = self.head
    def deleteValue(self, d):
        if not self.head: return
        if self.head.data == d:
            if self.head == self.tail: self.head = self.tail = None
            else:
                self.head = self.head.next
                self.tail.next = self.head
            return
        t = self.head
        while True:
            if t.next.data == d:
                if t.next == self.tail: self.tail = t
                t.next = t.next.next
                return
            t = t.next
            if t == self.head: break
    def search(self, d):
        if not self.head: return False
        t = self.head
        while True:
            if t.data == d: return True
            t = t.next
            if t == self.head: break
        return False
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
    insertHead(d) {
        let n = new Node(d);
        if(!this.head) { this.head = this.tail = n; n.next = this.head; return; }
        n.next = this.head; this.head = n; this.tail.next = this.head;
    }
    insertTail(d) {
        let n = new Node(d);
        if(!this.head) { this.head = this.tail = n; n.next = this.head; return; }
        this.tail.next = n; this.tail = n; this.tail.next = this.head;
    }
    deleteValue(d) {
        if(!this.head) return;
        if(this.head.data === d) {
            if(this.head === this.tail) this.head = this.tail = null;
            else { this.head = this.head.next; this.tail.next = this.head; }
            return;
        }
        let t = this.head;
        do {
            if(t.next.data === d) {
                if(t.next === this.tail) this.tail = t;
                t.next = t.next.next;
                return;
            }
            t = t.next;
        } while(t !== this.head);
    }
    search(d) {
        if (!this.head) return false;
        let t = this.head;
        do {
            if (t.data === d) return true;
            t = t.next;
        } while (t !== this.head);
        return false;
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
    } else if (variety === 'LL_POLYNOMIAL') {
      if (lang === 'Java') return `class Term {
    int coeff, exp;
    Term next;
    Term(int c, int e) { coeff = c; exp = e; next = null; }
}
class Polynomial {
    Term head;
    void insert(int coeff, int exp) {
        if (coeff == 0) return;
        Term n = new Term(coeff, exp);
        if (head == null || head.exp < exp) {
            n.next = head; head = n; return;
        }
        Term curr = head;
        while (curr.next != null && curr.next.exp >= exp) {
            curr = curr.next;
        }
        if (curr.exp == exp) {
            curr.coeff += coeff;
        } else if (curr.next != null && curr.next.exp == exp) {
            curr.next.coeff += coeff;
        } else {
            n.next = curr.next; curr.next = n;
        }
    }
    void print() {
        Term t = head;
        boolean first = true;
        while (t != null) {
            if (t.coeff != 0) {
                if (t.coeff > 0 && !first) System.out.print("+");
                System.out.print(t.coeff + "x^" + t.exp + " ");
                first = false;
            }
            t = t.next;
        }
        System.out.println();
    }
}
class PolynomialSolver {
    Polynomial parse(String str) {
        Polynomial p = new Polynomial();
        String clean = str.replaceAll("\\\\s+", "");
        String[] parts = clean.replace("-", "+-").split("\\\\+");
        for (String part : parts) {
            if (part.isEmpty()) continue;
            int coeff = 1, exp = 0;
            if (part.contains("x")) {
                String[] sides = part.split("x");
                String coeffStr = sides[0];
                String expStr = sides.length > 1 ? sides[1] : "";
                if (coeffStr.equals("")) coeff = 1;
                else if (coeffStr.equals("-")) coeff = -1;
                else coeff = Integer.parseInt(coeffStr);
                if (expStr.startsWith("^")) exp = Integer.parseInt(expStr.substring(1));
                else exp = 1;
            } else {
                coeff = Integer.parseInt(part);
                exp = 0;
            }
            p.insert(coeff, exp);
        }
        return p;
    }
    void addPolynomials(String polyA, String polyB) {
        Polynomial pA = parse(polyA);
        Polynomial pB = parse(polyB);
        Polynomial result = new Polynomial();
        Term a = pA.head, b = pB.head;
        while (a != null || b != null) {
            if (a != null && (b == null || a.exp > b.exp)) {
                result.insert(a.coeff, a.exp);
                a = a.next;
            } else if (b != null && (a == null || b.exp > a.exp)) {
                result.insert(b.coeff, b.exp);
                b = b.next;
            } else {
                result.insert(a.coeff + b.coeff, a.exp);
                a = a.next; b = b.next;
            }
        }
        System.out.print("Result: "); result.print();
    }
    void multiplyPolynomials(String polyA, String polyB) {
        Polynomial pA = parse(polyA);
        Polynomial pB = parse(polyB);
        Polynomial result = new Polynomial();
        for (Term a = pA.head; a != null; a = a.next) {
            for (Term b = pB.head; b != null; b = b.next) {
                result.insert(a.coeff * b.coeff, a.exp + b.exp);
            }
        }
        System.out.print("Result: "); result.print();
    }
}
public class Main {
    public static void main(String[] args) {
\${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
#include <string>
#include <vector>
#include <sstream>
using namespace std;
struct Term {
    int coeff, exp;
    Term* next;
    Term(int c, int e) : coeff(c), exp(e), next(nullptr) {}
};
class Polynomial {
public:
    Term* head = nullptr;
    void insert(int coeff, int exp) {
        if (coeff == 0) return;
        Term* n = new Term(coeff, exp);
        if (!head || head->exp < exp) {
            n->next = head; head = n; return;
        }
        Term* curr = head;
        while (curr->next && curr->next->exp >= exp) {
            curr = curr->next;
        }
        if (curr->exp == exp) {
            curr->coeff += coeff;
            delete n;
        } else if (curr->next && curr->next->exp == exp) {
            curr->next->coeff += coeff;
            delete n;
        } else {
            n->next = curr->next; curr->next = n;
        }
    }
    void print() {
        Term* t = head;
        bool first = true;
        while (t) {
            if (t->coeff != 0) {
                if (t->coeff > 0 && !first) cout << "+";
                cout << t->coeff << "x^" << t->exp << " ";
                first = false;
            }
            t = t->next;
        }
        cout << "\\n";
    }
};
class PolynomialSolver {
public:
    Polynomial parse(string str) {
        Polynomial p;
        string clean = "";
        for(char c : str) if(c != ' ') clean += c;
        string withPluses = "";
        for(char c : clean) {
            if(c == '-') withPluses += "+-";
            else withPluses += c;
        }
        stringstream ss(withPluses);
        string part;
        while(getline(ss, part, '+')) {
            if(part.empty()) continue;
            int coeff = 1, exp = 0;
            size_t xPos = part.find('x');
            if(xPos != string::npos) {
                string coeffStr = part.substr(0, xPos);
                string expStr = part.substr(xPos + 1);
                if(coeffStr.empty()) coeff = 1;
                else if(coeffStr == "-") coeff = -1;
                else coeff = stoi(coeffStr);
                if(!expStr.empty() && expStr[0] == '^') exp = stoi(expStr.substr(1));
                else exp = 1;
            } else {
                coeff = stoi(part);
                exp = 0;
            }
            p.insert(coeff, exp);
        }
        return p;
    }
    void addPolynomials(string polyA, string polyB) {
        Polynomial pA = parse(polyA);
        Polynomial pB = parse(polyB);
        Polynomial result;
        Term *a = pA.head, *b = pB.head;
        while(a || b) {
            if(a && (!b || a->exp > b->exp)) {
                result.insert(a->coeff, a->exp);
                a = a->next;
            } else if(b && (!a || b->exp > a->exp)) {
                result.insert(b->coeff, b->exp);
                b = b->next;
            } else {
                result.insert(a->coeff + b->coeff, a->exp);
                a = a->next; b = b->next;
            }
        }
        cout << "Result: "; result.print();
    }
    void multiplyPolynomials(string polyA, string polyB) {
        Polynomial pA = parse(polyA);
        Polynomial pB = parse(polyB);
        Polynomial result;
        for(Term* a = pA.head; a != nullptr; a = a->next) {
            for(Term* b = pB.head; b != nullptr; b = b->next) {
                result.insert(a->coeff * b->coeff, a->exp + b->exp);
            }
        }
        cout << "Result: "; result.print();
    }
};
int main() {
\${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Term:
    def __init__(self, c, e):
        self.coeff = c
        self.exp = e
        self.next = None
class Polynomial:
    def __init__(self):
        self.head = None
    def insert(self, coeff, exp):
        if coeff == 0: return
        n = Term(coeff, exp)
        if not self.head or self.head.exp < exp:
            n.next = self.head
            self.head = n
            return
        curr = self.head
        while curr.next and curr.next.exp >= exp:
            curr = curr.next
        if curr.exp == exp:
            curr.coeff += coeff
        elif curr.next and curr.next.exp == exp:
            curr.next.coeff += coeff
        else:
            n.next = curr.next
            curr.next = n
    def print_poly(self):
        t = self.head
        first = True
        out = []
        while t:
            if t.coeff != 0:
                coeff_str = ""
                if t.coeff > 0 and not first:
                    coeff_str = "+"
                out.append(f"{coeff_str}{t.coeff}x^{t.exp}")
                first = False
            t = t.next
        print("Result:", " ".join(out))
class PolynomialSolver:
    def parse(self, s):
        p = Polynomial()
        clean = s.replace(" ", "")
        parts = clean.replace("-", "+-").split("+")
        for part in parts:
            if not part: continue
            coeff, exp = 1, 0
            if "x" in part:
                sides = part.split("x")
                coeff_str = sides[0]
                exp_str = sides[1] if len(sides) > 1 else ""
                if coeff_str == "": coeff = 1
                elif coeff_str == "-": coeff = -1
                else: coeff = int(coeff_str)
                if exp_str.startswith("^"): exp = int(exp_str[1:])
                else: exp = 1
            else:
                coeff = int(part)
                exp = 0
            p.insert(coeff, exp)
        return p
    def addPolynomials(self, polyA, polyB):
        pA = self.parse(polyA)
        pB = self.parse(polyB)
        result = Polynomial()
        a, b = pA.head, pB.head
        while a or b:
            if a and (not b or a.exp > b.exp):
                result.insert(a.coeff, a.exp)
                a = a.next
            elif b and (not a or b.exp > a.exp):
                result.insert(b.coeff, b.exp)
                b = b.next
            else:
                result.insert(a.coeff + b.coeff, a.exp)
                a = a.next
                b = b.next
        result.print_poly()
    def multiplyPolynomials(self, polyA, polyB):
        pA = self.parse(polyA)
        pB = self.parse(polyB)
        result = Polynomial()
        a = pA.head
        while a:
            b = pB.head
            while b:
                result.insert(a.coeff * b.coeff, a.exp + b.exp)
                b = b.next
            a = a.next
        result.print_poly()
if __name__ == "__main__":
\${execBlock}`;
      if (lang === 'JS') return `class Term {
    constructor(c, e) {
        this.coeff = c;
        this.exp = e;
        this.next = null;
    }
}
class Polynomial {
    constructor() { this.head = null; }
    insert(coeff, exp) {
        if (coeff === 0) return;
        let n = new Term(coeff, exp);
        if (!this.head || this.head.exp < exp) {
            n.next = this.head; this.head = n; return;
        }
        let curr = this.head;
        while (curr.next && curr.next.exp >= exp) {
            curr = curr.next;
        }
        if (curr.exp === exp) {
            curr.coeff += coeff;
        } else if (curr.next && curr.next.exp === exp) {
            curr.next.coeff += coeff;
        } else {
            n.next = curr.next; curr.next = n;
        }
    }
    print() {
        let t = this.head, first = true, out = [];
        while (t) {
            if (t.coeff !== 0) {
                let sign = (t.coeff > 0 && !first) ? "+" : "";
                out.push(sign + t.coeff + "x^" + t.exp);
                first = false;
            }
            t = t.next;
        }
        console.log("Result:", out.join(" "));
    }
}
class PolynomialSolver {
    parse(str) {
        let p = new Polynomial();
        let clean = str.replace(/\\s+/g, "");
        let parts = clean.replace(/-/g, "+-").split("+");
        for (let part of parts) {
            if (!part) continue;
            let coeff = 1, exp = 0;
            if (part.includes("x")) {
                let sides = part.split("x");
                let coeffStr = sides[0];
                let expStr = sides[1] || "";
                if (coeffStr === "") coeff = 1;
                else if (coeffStr === "-") coeff = -1;
                else coeff = parseInt(coeffStr, 10);
                if (expStr.startsWith("^")) exp = parseInt(expStr.substring(1), 10);
                else exp = 1;
            } else {
                coeff = parseInt(part, 10);
                exp = 0;
            }
            p.insert(coeff, exp);
        }
        return p;
    }
    addPolynomials(polyA, polyB) {
        let pA = this.parse(polyA);
        let pB = this.parse(polyB);
        let result = new Polynomial();
        let a = pA.head, b = pB.head;
        while (a || b) {
            if (a && (!b || a.exp > b.exp)) {
                result.insert(a.coeff, a.exp);
                a = a.next;
            } else if (b && (!a || b.exp > a.exp)) {
                result.insert(b.coeff, b.exp);
                b = b.next;
            } else {
                result.insert(a.coeff + b.coeff, a.exp);
                a = a.next; b = b.next;
            }
        }
        result.print();
    }
    multiplyPolynomials(polyA, polyB) {
        let pA = this.parse(polyA);
        let pB = this.parse(polyB);
        let result = new Polynomial();
        for (let a = pA.head; a !== null; a = a.next) {
            for (let b = pB.head; b !== null; b = b.next) {
                result.insert(a.coeff * b.coeff, a.exp + b.exp);
            }
        }
        result.print();
    }
}
// Execution
\${execBlock}`;
    }
  }

  // STACKS
  if (type === 'STACK') {
    if (variety === 'STACK_ARRAY') {
      if (lang === 'Java') return `class Stack {
    int[] arr;
    int top, cap;

    Stack(int size) {
        arr = new int[size];
        cap = size;
        top = -1;
    }

    void push(int val) {
        if (top == cap - 1) return;
        arr[++top] = val;
    }

    int pop() {
        if (top == -1) return -1;
        return arr[top--];
    }

    boolean search(int val) {
        for (int i = 0; i <= top; i++) {
            if (arr[i] == val) return true;
        }
        return false;
    }

    void display() {
        for (int i = 0; i <= top; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;

class Stack {
    int* arr;
    int top, cap;
public:
    Stack(int size) {
        arr = new int[size];
        cap = size;
        top = -1;
    }
    ~Stack() {
        delete[] arr;
    }
    void push(int val) {
        if (top == cap - 1) return;
        arr[++top] = val;
    }
    int pop() {
        if (top == -1) return -1;
        return arr[top--];
    }
    bool search(int val) {
        for (int i = 0; i <= top; i++) {
            if (arr[i] == val) return true;
        }
        return false;
    }
    void display() {
        for (int i = 0; i <= top; i++) {
            cout << arr[i] << " ";
        }
        cout << "\\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Stack:
    def __init__(self, cap=100):
        self.arr = [None] * cap
        self.cap = cap
        self.top = -1

    def push(self, val):
        if self.top == self.cap - 1:
            return
        self.top += 1
        self.arr[self.top] = val

    def pop(self):
        if self.top == -1:
            return None
        val = self.arr[self.top]
        self.top -= 1
        return val

    def search(self, val):
        for i in range(self.top + 1):
            if self.arr[i] == val:
                return True
        return False

    def display(self):
        if self.top == -1:
            print("[]")
            return
        print(" ".join(str(self.arr[i]) for i in range(self.top + 1)))
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Stack {
    constructor(cap = 100) {
        this.arr = new Array(cap);
        this.cap = cap;
        this.top = -1;
    }
    push(val) {
        if (this.top === this.cap - 1) return;
        this.arr[++this.top] = val;
    }
    pop() {
        if (this.top === -1) return null;
        return this.arr[this.top--];
    }
    search(val) {
        for (let i = 0; i <= this.top; i++) {
            if (this.arr[i] === val) return true;
        }
        return false;
    }
    display() {
        if (this.top === -1) {
            console.log("[]");
            return;
        }
        let out = [];
        for (let i = 0; i <= this.top; i++) {
            out.push(this.arr[i]);
        }
        console.log(out.join(" "));
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'STACK_LL') {
      if (lang === 'Java') return `class Node {
    int data;
    Node next;
    Node(int d) {
        data = d;
        next = null;
    }
}
class Stack {
    Node top;

    void push(int val) {
        Node n = new Node(val);
        n.next = top;
        top = n;
    }

    int pop() {
        if (top == null) return -1;
        int d = top.data;
        top = top.next;
        return d;
    }

    boolean search(int val) {
        Node t = top;
        while (t != null) {
            if (t.data == val) return true;
            t = t.next;
        }
        return false;
    }

    void display() {
        Node t = top;
        while (t != null) {
            System.out.print(t.data + " ");
            t = t.next;
        }
        System.out.println();
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
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};
class Stack {
    Node* top = nullptr;
public:
    ~Stack() {
        while (top) {
            Node* temp = top;
            top = top->next;
            delete temp;
        }
    }
    void push(int val) {
        Node* n = new Node(val);
        n->next = top;
        top = n;
    }
    int pop() {
        if (!top) return -1;
        Node* temp = top;
        int d = top->data;
        top = top->next;
        delete temp;
        return d;
    }
    bool search(int val) {
        Node* t = top;
        while (t) {
            if (t->data == val) return true;
            t = t->next;
        }
        return false;
    }
    void display() {
        Node* t = top;
        while (t) {
            cout << t->data << " ";
            t = t->next;
        }
        cout << "\\n";
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

class Stack:
    def __init__(self):
        self.top = None

    def push(self, val):
        n = Node(val)
        n.next = self.top
        self.top = n

    def pop(self):
        if not self.top:
            return None
        d = self.top.data
        self.top = self.top.next
        return d

    def search(self, val):
        t = self.top
        while t:
            if t.data == val:
                return True
            t = t.next
        return False

    def display(self):
        t = self.top
        out = []
        while t:
            out.append(t.data)
            t = t.next
        print(" ".join(str(x) for x in out))
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Node {
    constructor(d) {
        this.data = d;
        this.next = null;
    }
}
class Stack {
    constructor() {
        this.top = null;
    }
    push(val) {
        let n = new Node(val);
        n.next = this.top;
        this.top = n;
    }
    pop() {
        if (!this.top) return null;
        let d = this.top.data;
        this.top = this.top.next;
        return d;
    }
    search(val) {
        let t = this.top;
        while (t) {
            if (t.data === val) return true;
            t = t.next;
        }
        return false;
    }
    display() {
        let t = this.top;
        let out = [];
        while (t) {
            out.push(t.data);
            t = t.next;
        }
        console.log(out.join(" "));
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'STACK_EXPRESSION') {
        if (lang === 'Java') return `import java.util.Stack;
class ExpressionEvaluator {
    private int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        return -1;
    }
    private int applyOp(int a, int b, char op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b == 0 ? 0 : a / b;
        }
        return 0;
    }
    public int evaluateExpression(String exp) {
        String[] tokens = exp.trim().split("\\\\s+");
        if (tokens.length == 0 || tokens[0].isEmpty()) return 0;
        boolean isPrefix = false;
        boolean isPostfix = false;
        String first = tokens[0];
        String last = tokens[tokens.length - 1];
        if (first.equals("+") || first.equals("-") || first.equals("*") || first.equals("/")) {
            isPrefix = true;
        } else if (last.equals("+") || last.equals("-") || last.equals("*") || last.equals("/")) {
            isPostfix = true;
        }
        if (isPrefix) {
            Stack<Integer> s = new Stack<>();
            for (int i = tokens.length - 1; i >= 0; i--) {
                String t = tokens[i];
                if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
                    if (s.size() < 2) return 0;
                    s.push(applyOp(s.pop(), s.pop(), t.charAt(0)));
                } else {
                    s.push(Integer.parseInt(t));
                }
            }
            return s.isEmpty() ? 0 : s.pop();
        } else if (isPostfix) {
            Stack<Integer> s = new Stack<>();
            for (String t : tokens) {
                if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
                    if (s.size() < 2) return 0;
                    int val2 = s.pop();
                    int val1 = s.pop();
                    s.push(applyOp(val1, val2, t.charAt(0)));
                } else {
                    s.push(Integer.parseInt(t));
                }
            }
            return s.isEmpty() ? 0 : s.pop();
        } else {
            Stack<Integer> values = new Stack<>();
            Stack<Character> ops = new Stack<>();
            for (String t : tokens) {
                if (t.equals("(")) {
                    ops.push('(');
                } else if (t.equals(")")) {
                    while (!ops.isEmpty() && ops.peek() != '(') {
                        if (values.size() < 2) return 0;
                        int val2 = values.pop();
                        int val1 = values.pop();
                        values.push(applyOp(val1, val2, ops.pop()));
                    }
                    if (!ops.isEmpty()) ops.pop();
                } else if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
                    while (!ops.isEmpty() && precedence(ops.peek()) >= precedence(t.charAt(0))) {
                        if (values.size() < 2) return 0;
                        int val2 = values.pop();
                        int val1 = values.pop();
                        values.push(applyOp(val1, val2, ops.pop()));
                    }
                    ops.push(t.charAt(0));
                } else {
                    values.push(Integer.parseInt(t));
                }
            }
            while (!ops.isEmpty()) {
                if (values.size() < 2) return 0;
                int val2 = values.pop();
                int val1 = values.pop();
                values.push(applyOp(val1, val2, ops.pop()));
            }
            return values.isEmpty() ? 0 : values.pop();
        }
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
        if (lang === 'C++') return `#include <iostream>
#include <stack>
#include <sstream>
#include <vector>
#include <algorithm>
using namespace std;
class ExpressionEvaluator {
    int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        return -1;
    }
    int applyOp(int a, int b, char op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b == 0 ? 0 : a / b;
        }
        return 0;
    }
public:
    int evaluateExpression(string exp) {
        stringstream ss(exp);
        string token;
        vector<string> tokens;
        while (ss >> token) tokens.push_back(token);
        if (tokens.empty()) return 0;
        bool isPrefix = false;
        bool isPostfix = false;
        string first = tokens[0];
        string last = tokens[tokens.size() - 1];
        if (first == "+" || first == "-" || first == "*" || first == "/") {
            isPrefix = true;
        } else if (last == "+" || last == "-" || last == "*" || last == "/") {
            isPostfix = true;
        }
        if (isPrefix) {
            stack<int> s;
            for (int i = tokens.size() - 1; i >= 0; i--) {
                string t = tokens[i];
                if (t == "+" || t == "-" || t == "*" || t == "/") {
                    if (s.size() < 2) return 0;
                    int val1 = s.top(); s.pop();
                    int val2 = s.top(); s.pop();
                    s.push(applyOp(val1, val2, t[0]));
                } else {
                    s.push(stoi(t));
                }
            }
            return s.empty() ? 0 : s.top();
        } else if (isPostfix) {
            stack<int> s;
            for (string t : tokens) {
                if (t == "+" || t == "-" || t == "*" || t == "/") {
                    if (s.size() < 2) return 0;
                    int val2 = s.top(); s.pop();
                    int val1 = s.top(); s.pop();
                    s.push(applyOp(val1, val2, t[0]));
                } else {
                    s.push(stoi(t));
                }
            }
            return s.empty() ? 0 : s.top();
        } else {
            stack<int> values;
            stack<char> ops;
            for (string t : tokens) {
                if (t == "(") {
                    ops.push('(');
                } else if (t == ")") {
                    while (!ops.empty() && ops.top() != '(') {
                        if (values.size() < 2) return 0;
                        int val2 = values.top(); values.pop();
                        int val1 = values.top(); values.pop();
                        values.push(applyOp(val1, val2, ops.top()));
                        ops.pop();
                    }
                    if (!ops.empty()) ops.pop();
                } else if (t == "+" || t == "-" || t == "*" || t == "/") {
                    while (!ops.empty() && precedence(ops.top()) >= precedence(t[0])) {
                        if (values.size() < 2) return 0;
                        int val2 = values.top(); values.pop();
                        int val1 = values.top(); values.pop();
                        values.push(applyOp(val1, val2, ops.top()));
                        ops.pop();
                    }
                    ops.push(t[0]);
                } else {
                    values.push(stoi(t));
                }
            }
            while (!ops.empty()) {
                if (values.size() < 2) return 0;
                int val2 = values.top(); values.pop();
                int val1 = values.top(); values.pop();
                values.push(applyOp(val1, val2, ops.top()));
                ops.pop();
            }
            return values.empty() ? 0 : values.top();
        }
    }
};
int main() {
${execBlock}
    return 0;
}`;
        if (lang === 'Python') return `class ExpressionEvaluator:
    def precedence(self, op):
        if op in ['+', '-']: return 1
        if op in ['*', '/']: return 2
        return -1
    def applyOp(self, a, b, op):
        if op == '+': return a + b
        if op == '-': return a - b
        if op == '*': return a * b
        if op == '/': return 0 if b == 0 else int(a / b)
        return 0
    def evaluateExpression(self, exp):
        tokens = exp.strip().split()
        if not tokens: return 0
        is_prefix = tokens[0] in ['+', '-', '*', '/']
        is_postfix = tokens[-1] in ['+', '-', '*', '/']
        if is_prefix:
            s = []
            for t in reversed(tokens):
                if t in ['+', '-', '*', '/']:
                    if len(s) < 2: return 0
                    s.append(self.applyOp(s.pop(), s.pop(), t))
                else:
                    s.append(int(t))
            return s[-1] if s else 0
        elif is_postfix:
            s = []
            for t in tokens:
                if t in ['+', '-', '*', '/']:
                    if len(s) < 2: return 0
                    val2 = s.pop()
                    val1 = s.pop()
                    s.append(self.applyOp(val1, val2, t))
                else:
                    s.append(int(t))
            return s[-1] if s else 0
        else:
            values = []
            ops = []
            for t in tokens:
                if t == '(':
                    ops.append('(')
                elif t == ')':
                    while ops and ops[-1] != '(':
                        if len(values) < 2: return 0
                        val2 = values.pop()
                        val1 = values.pop()
                        values.append(self.applyOp(val1, val2, ops.pop()))
                    if ops: ops.pop()
                elif t in ['+', '-', '*', '/']:
                    while ops and self.precedence(ops[-1]) >= self.precedence(t):
                        if len(values) < 2: return 0
                        val2 = values.pop()
                        val1 = values.pop()
                        values.append(self.applyOp(val1, val2, ops.pop()))
                    ops.append(t)
                else:
                    values.append(int(t))
            while ops:
                if len(values) < 2: return 0
                val2 = values.pop()
                val1 = values.pop()
                values.append(self.applyOp(val1, val2, ops.pop()))
            return values[-1] if values else 0
if __name__ == "__main__":
${execBlock}`;
        if (lang === 'JS') return `class ExpressionEvaluator {
    precedence(op) {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return -1;
    }
    applyOp(a, b, op) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b === 0 ? 0 : Math.floor(a / b);
        }
        return 0;
    }
    evaluateExpression(exp) {
        const tokens = exp.trim().split(/\\s+/);
        if (tokens.length === 0 || tokens[0] === "") return 0;
        const isPrefix = ['+', '-', '*', '/'].includes(tokens[0]);
        const isPostfix = ['+', '-', '*', '/'].includes(tokens[tokens.length - 1]);
        if (isPrefix) {
            const s = [];
            for (let i = tokens.length - 1; i >= 0; i--) {
                let t = tokens[i];
                if (['+', '-', '*', '/'].includes(t)) {
                    if (s.length < 2) return 0;
                    s.push(this.applyOp(s.pop(), s.pop(), t));
                } else {
                    s.push(parseInt(t));
                }
            }
            return s.length ? s.pop() : 0;
        } else if (isPostfix) {
            const s = [];
            for (let t of tokens) {
                if (['+', '-', '*', '/'].includes(t)) {
                    if (s.length < 2) return 0;
                    let val2 = s.pop();
                    let val1 = s.pop();
                    s.push(this.applyOp(val1, val2, t));
                } else {
                    s.push(parseInt(t));
                }
            }
            return s.length ? s.pop() : 0;
        } else {
            const values = [];
            const ops = [];
            for (let t of tokens) {
                if (t === '(') {
                    ops.push('(');
                } else if (t === ')') {
                    while (ops.length && ops[ops.length - 1] !== '(') {
                        if (values.length < 2) return 0;
                        let val2 = values.pop();
                        let val1 = values.pop();
                        values.push(this.applyOp(val1, val2, ops.pop()));
                    }
                    if (ops.length) ops.pop();
                } else if (['+', '-', '*', '/'].includes(t)) {
                    while (ops.length && this.precedence(ops[ops.length - 1]) >= this.precedence(t)) {
                        if (values.length < 2) return 0;
                        let val2 = values.pop();
                        let val1 = values.pop();
                        values.push(this.applyOp(val1, val2, ops.pop()));
                    }
                    ops.push(t);
                } else {
                    values.push(parseInt(t));
                }
            }
            while (ops.length) {
                if (values.length < 2) return 0;
                let val2 = values.pop();
                let val1 = values.pop();
                values.push(this.applyOp(val1, val2, ops.pop()));
            }
            return values.length ? values.pop() : 0;
        }
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'STACK_BRACKETS') {
        if (lang === 'Java') return `import java.util.Stack;
class BracketEvaluator {
    public boolean isBalanced(String exp) {
        Stack<Character> s = new Stack<>();
        for (int i = 0; i < exp.length(); i++) {
            char c = exp.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                s.push(c);
            } else if (c == ')' || c == '}' || c == ']') {
                if (s.isEmpty()) return false;
                char top = s.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        return s.isEmpty();
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
        if (lang === 'C++') return `#include <iostream>
#include <stack>
#include <string>
using namespace std;
class BracketEvaluator {
public:
    bool isBalanced(string exp) {
        stack<char> s;
        for (char c : exp) {
            if (c == '(' || c == '{' || c == '[') {
                s.push(c);
            } else if (c == ')' || c == '}' || c == ']') {
                if (s.empty()) return false;
                char top = s.top(); s.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        return s.empty();
    }
};
int main() {
${execBlock}
    return 0;
}`;
        if (lang === 'Python') return `class BracketEvaluator:
    def isBalanced(self, exp):
        s = []
        for c in exp:
            if c in ['(', '{', '[']:
                s.append(c)
            elif c in [')', '}', ']']:
                if not s: return False
                top = s.pop()
                if (c == ')' and top != '(') or \\
                   (c == '}' and top != '{') or \\
                   (c == ']' and top != '['):
                    return False
        return len(s) == 0
if __name__ == "__main__":
${execBlock}`;
        if (lang === 'JS') return `class BracketEvaluator {
    isBalanced(exp) {
        const s = [];
        for (let c of exp) {
            if (c === '(' || c === '{' || c === '[') {
                s.push(c);
            } else if (c === ')' || c === '}' || c === ']') {
                if (s.length === 0) return false;
                let top = s.pop();
                if ((c === ')' && top !== '(') ||
                    (c === '}' && top !== '{') ||
                    (c === ']' && top !== '[')) {
                    return false;
                }
            }
        }
        return s.length === 0;
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'STACK_CONVERSION') {
        if (lang === 'Java') return `import java.util.Stack;
import java.util.ArrayList;
class EquationAnalyzer {
    private int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        if (op == '^') return 3;
        return -1;
    }
    public boolean isBalanced(String exp) {
        Stack<Character> s = new Stack<>();
        for (int i = 0; i < exp.length(); i++) {
            char c = exp.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                s.push(c);
            } else if (c == ')' || c == '}' || c == ']') {
                if (s.isEmpty()) return false;
                char top = s.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        return s.isEmpty();
    }
    public String infixToPostfix(String exp) {
        StringBuilder result = new StringBuilder();
        Stack<Character> stack = new Stack<>();
        String[] tokens = exp.trim().split("\\\\s+");
        if (tokens.length <= 1 && !exp.isEmpty() && !exp.contains(" ")) {
            tokens = exp.replace(" ", "").split("");
        }
        for (String t : tokens) {
            if (t.isEmpty()) continue;
            char c = t.charAt(0);
            if (Character.isLetterOrDigit(c)) {
                result.append(t).append(" ");
            } else if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    result.append(stack.pop()).append(" ");
                }
                if (!stack.isEmpty()) stack.pop();
            } else {
                while (!stack.isEmpty() && precedence(stack.peek()) >= precedence(c)) {
                    result.append(stack.pop()).append(" ");
                }
                stack.push(c);
            }
        }
        while (!stack.isEmpty()) {
            result.append(stack.pop()).append(" ");
        }
        return result.toString().trim();
    }
    public String infixToPrefix(String exp) {
        String[] tokens = exp.trim().split("\\\\s+");
        if (tokens.length <= 1 && !exp.isEmpty() && !exp.contains(" ")) {
            tokens = exp.replace(" ", "").split("");
        }
        ArrayList<String> revTokens = new ArrayList<>();
        for (int i = tokens.length - 1; i >= 0; i--) {
            String t = tokens[i];
            if (t.equals("(")) revTokens.add(")");
            else if (t.equals(")")) revTokens.add("(");
            else revTokens.add(t);
        }
        StringBuilder postfixLike = new StringBuilder();
        Stack<Character> stack = new Stack<>();
        for (String t : revTokens) {
            if (t.isEmpty()) continue;
            char c = t.charAt(0);
            if (Character.isLetterOrDigit(c)) {
                postfixLike.append(t).append(" ");
            } else if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                while (!stack.isEmpty() && stack.peek() != '(') {
                    postfixLike.append(stack.pop()).append(" ");
                }
                if (!stack.isEmpty()) stack.pop();
            } else {
                while (!stack.isEmpty() && precedence(stack.peek()) > precedence(c)) {
                    postfixLike.append(stack.pop()).append(" ");
                }
                stack.push(c);
            }
        }
        while (!stack.isEmpty()) {
            postfixLike.append(stack.pop()).append(" ");
        }
        String[] pfTokens = postfixLike.toString().trim().split("\\\\s+");
        StringBuilder prefix = new StringBuilder();
        for (int i = pfTokens.length - 1; i >= 0; i--) {
            prefix.append(pfTokens[i]).append(" ");
        }
        return prefix.toString().trim();
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
        if (lang === 'C++') return `#include <iostream>
#include <stack>
#include <string>
#include <vector>
#include <algorithm>
#include <cctype>
#include <sstream>
using namespace std;
class EquationAnalyzer {
    int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        if (op == '^') return 3;
        return -1;
    }
public:
    bool isBalanced(string exp) {
        stack<char> s;
        for (char c : exp) {
            if (c == '(' || c == '{' || c == '[') {
                s.push(c);
            } else if (c == ')' || c == '}' || c == ']') {
                if (s.empty()) return false;
                char top = s.top(); s.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        return s.empty();
    }
    string infixToPostfix(string exp) {
        vector<string> tokens;
        bool hasSpace = false;
        for (char c : exp) { if (c == ' ') { hasSpace = true; break; } }
        if (hasSpace) {
            stringstream ss(exp);
            string temp;
            while (ss >> temp) tokens.push_back(temp);
        } else {
            for (char c : exp) {
                if (c != ' ') tokens.push_back(string(1, c));
            }
        }
        string result = "";
        stack<char> s;
        for (string t : tokens) {
            if (t.empty()) continue;
            char c = t[0];
            if (isalnum(c)) {
                result += t + " ";
            } else if (c == '(') {
                s.push(c);
            } else if (c == ')') {
                while (!s.empty() && s.top() != '(') {
                    result += string(1, s.top()) + " ";
                    s.pop();
                }
                if (!s.empty()) s.pop();
            } else {
                while (!s.empty() && precedence(s.top()) >= precedence(c)) {
                    result += string(1, s.top()) + " ";
                    s.pop();
                }
                s.push(c);
            }
        }
        while (!s.empty()) {
            result += string(1, s.top()) + " ";
            s.pop();
        }
        if (!result.empty() && result.back() == ' ') result.pop_back();
        return result;
    }
    string infixToPrefix(string exp) {
        vector<string> tokens;
        bool hasSpace = false;
        for (char c : exp) { if (c == ' ') { hasSpace = true; break; } }
        if (hasSpace) {
            stringstream ss(exp);
            string temp;
            while (ss >> temp) tokens.push_back(temp);
        } else {
            for (char c : exp) {
                if (c != ' ') tokens.push_back(string(1, c));
            }
        }
        vector<string> revTokens;
        for (int i = tokens.size() - 1; i >= 0; i--) {
            string t = tokens[i];
            if (t == "(") revTokens.push_back(")");
            else if (t == ")") revTokens.push_back("(");
            else revTokens.push_back(t);
        }
        string postfixLike = "";
        stack<char> s;
        for (string t : revTokens) {
            if (t.empty()) continue;
            char c = t[0];
            if (isalnum(c)) {
                postfixLike += t + " ";
            } else if (c == '(') {
                s.push(c);
            } else if (c == ')') {
                while (!s.empty() && s.top() != '(') {
                    postfixLike += string(1, s.top()) + " ";
                    s.pop();
                }
                if (!s.empty()) s.pop();
            } else {
                while (!s.empty() && precedence(s.top()) > precedence(c)) {
                    postfixLike += string(1, s.top()) + " ";
                    s.pop();
                }
                s.push(c);
            }
        }
        while (!s.empty()) {
            postfixLike += string(1, s.top()) + " ";
            s.pop();
        }
        stringstream ss(postfixLike);
        string temp;
        vector<string> pfTokens;
        while (ss >> temp) pfTokens.push_back(temp);
        string prefix = "";
        for (int i = pfTokens.size() - 1; i >= 0; i--) {
            prefix += pfTokens[i] + " ";
        }
        if (!prefix.empty() && prefix.back() == ' ') prefix.pop_back();
        return prefix;
    }
};
int main() {
${execBlock}
    return 0;
}`;
        if (lang === 'Python') return `class EquationAnalyzer:
    def precedence(self, op):
        if op in ['+', '-']: return 1
        if op in ['*', '/']: return 2
        if op == '^': return 3
        return -1
    def isBalanced(self, exp):
        s = []
        for c in exp:
            if c in ['(', '{', '[']:
                s.append(c)
            elif c in [')', '}', ']']:
                if not s: return False
                top = s.pop()
                if (c == ')' and top != '(') or \
                   (c == '}' and top != '{') or \
                   (c == ']' and top != '['):
                    return False
        return len(s) == 0
    def infixToPostfix(self, exp):
        tokens = exp.strip().split()
        if len(tokens) <= 1 and exp and ' ' not in exp:
            tokens = [c for c in exp.replace(" ", "")]
        result = []
        stack = []
        for t in tokens:
            if not t: continue
            c = t[0]
            if c.isalnum():
                result.append(t)
            elif c == '(':
                stack.append(c)
            elif c == ')':
                while stack and stack[-1] != '(':
                    result.append(stack.pop())
                if stack: stack.pop()
            else:
                while stack and self.precedence(stack[-1]) >= self.precedence(c):
                    result.append(stack.pop())
                stack.append(c)
        while stack:
            result.append(stack.pop())
        return " ".join(result)
    def infixToPrefix(self, exp):
        tokens = exp.strip().split()
        if len(tokens) <= 1 and exp and ' ' not in exp:
            tokens = [c for c in exp.replace(" ", "")]
        rev_tokens = []
        for t in reversed(tokens):
            if t == '(': rev_tokens.append(')')
            elif t == ')': rev_tokens.append('(')
            else: rev_tokens.append(t)
        result = []
        stack = []
        for t in rev_tokens:
            if not t: continue
            c = t[0]
            if c.isalnum():
                result.append(t)
            elif c == '(':
                stack.append(c)
            elif c == ')':
                while stack and stack[-1] != '(':
                    result.append(stack.pop())
                if stack: stack.pop()
            else:
                while stack and self.precedence(stack[-1]) > self.precedence(c):
                    result.append(stack.pop())
                stack.append(c)
        while stack:
            result.append(stack.pop())
        return " ".join(reversed(result))
if __name__ == "__main__":
${execBlock}`;
        if (lang === 'JS') return `class EquationAnalyzer {
    precedence(op) {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        if (op === '^') return 3;
        return -1;
    }
    isBalanced(exp) {
        const s = [];
        for (let c of exp) {
            if (['(', '{', '['].includes(c)) {
                s.push(c);
            } else if ([')', '}', ']'].includes(c)) {
                if (s.length === 0) return false;
                let top = s.pop();
                if ((c === ')' && top !== '(') ||
                    (c === '}' && top !== '{') ||
                    (c === ']' && top !== '[')) {
                    return false;
                }
            }
        }
        return s.length === 0;
    }
    infixToPostfix(exp) {
        let tokens = exp.trim().split(/\\s+/);
        if (tokens.length <= 1 && exp && !exp.includes(' ')) {
            tokens = exp.replace(/\\s+/g, '').split('');
        }
        const result = [];
        const stack = [];
        for (let t of tokens) {
            if (!t) continue;
            let c = t[0];
            if (/[a-zA-Z0-9]/.test(c)) {
                result.push(t);
            } else if (c === '(') {
                stack.push(c);
            } else if (c === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    result.push(stack.pop());
                }
                if (stack.length) stack.pop();
            } else {
                while (stack.length && this.precedence(stack[stack.length - 1]) >= this.precedence(c)) {
                    result.push(stack.pop());
                }
                stack.push(c);
            }
        }
        while (stack.length) {
            result.push(stack.pop());
        }
        return result.join(' ');
    }
    infixToPrefix(exp) {
        let tokens = exp.trim().split(/\\s+/);
        if (tokens.length <= 1 && exp && !exp.includes(' ')) {
            tokens = exp.replace(/\\s+/g, '').split('');
        }
        const revTokens = [];
        for (let i = tokens.length - 1; i >= 0; i--) {
            let t = tokens[i];
            if (t === '(') revTokens.push(')');
            else if (t === ')') revTokens.push('(');
            else revTokens.push(t);
        }
        const result = [];
        const stack = [];
        for (let t of revTokens) {
            if (!t) continue;
            let c = t[0];
            if (/[a-zA-Z0-9]/.test(c)) {
                result.push(t);
            } else if (c === '(') {
                stack.push(c);
            } else if (c === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    result.push(stack.pop());
                }
                if (stack.length) stack.pop();
            } else {
                while (stack.length && this.precedence(stack[stack.length - 1]) > this.precedence(c)) {
                    result.push(stack.pop());
                }
                stack.push(c);
            }
        }
        while (stack.length) {
            result.push(stack.pop());
        }
        return result.reverse().join(' ');
    }
}
// Execution
${execBlock}`;
    }
  }
  // QUEUES
  if (type === 'QUEUE') {
    if (variety === 'QUEUE_SIMPLE') {
      if (lang === 'Java') return `class Queue {
    int[] arr;
    int front = 0;
    int rear = -1;
    int cap;

    Queue(int size) {
        cap = size;
        arr = new int[cap];
    }

    void enqueue(int val) {
        if (rear == cap - 1) {
            return;
        }
        arr[++rear] = val;
    }

    int dequeue() {
        if (front > rear) {
            return -1;
        }
        return arr[front++];
    }

    boolean search(int val) {
        for (int i = front; i <= rear; i++) {
            if (arr[i] == val) {
                return true;
            }
        }
        return false;
    }

    void display() {
        for (int i = front; i <= rear; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;

class Queue {
    int* arr;
    int front = 0;
    int rear = -1;
    int cap;
public:
    Queue(int size) {
        cap = size;
        arr = new int[cap];
    }
    ~Queue() {
        delete[] arr;
    }
    void enqueue(int val) {
        if (rear == cap - 1) {
            return;
        }
        arr[++rear] = val;
    }
    int dequeue() {
        if (front > rear) {
            return -1;
        }
        return arr[front++];
    }
    bool search(int val) {
        for (int i = front; i <= rear; i++) {
            if (arr[i] == val) {
                return true;
            }
        }
        return false;
    }
    void display() {
        for (int i = front; i <= rear; i++) {
            cout << arr[i] << " ";
        }
        cout << "\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Queue:
    def __init__(self, cap=100):
        self.arr = [None] * cap
        self.cap = cap
        self.front = 0
        self.rear = -1

    def enqueue(self, val):
        if self.rear == self.cap - 1:
            return
        self.rear += 1
        self.arr[self.rear] = val

    def dequeue(self):
        if self.front > self.rear:
            return None
        val = self.arr[self.front]
        self.front += 1
        return val

    def search(self, val):
        for i in range(self.front, self.rear + 1):
            if self.arr[i] == val:
                return True
        return False

    def display(self):
        if self.front > self.rear:
            print("[]")
            return
        print(" ".join(str(self.arr[i]) for i in range(self.front, self.rear + 1)))
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor(cap = 100) {
        this.arr = new Array(cap);
        this.cap = cap;
        this.front = 0;
        this.rear = -1;
    }
    enqueue(val) {
        if (this.rear === this.cap - 1) {
            return;
        }
        this.arr[++this.rear] = val;
    }
    dequeue() {
        if (this.front > this.rear) {
            return null;
        }
        return this.arr[this.front++];
    }
    search(val) {
        for (let i = this.front; i <= this.rear; i++) {
            if (this.arr[i] === val) {
                return true;
            }
        }
        return false;
    }
    display() {
        if (this.front > this.rear) {
            console.log("[]");
            return;
        }
        let out = [];
        for (let i = this.front; i <= this.rear; i++) {
            out.push(this.arr[i]);
        }
        console.log(out.join(" "));
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'QUEUE_CIRCULAR') {
      if (lang === 'Java') return `class Queue {
    int[] arr;
    int front = -1;
    int rear = -1;
    int cap;

    Queue(int size) {
        cap = size;
        arr = new int[cap];
    }

    void enqueue(int val) {
        if ((rear + 1) % cap == front) {
            return;
        }
        if (front == -1) {
            front = 0;
        }
        rear = (rear + 1) % cap;
        arr[rear] = val;
    }

    int dequeue() {
        if (front == -1) {
            return -1;
        }
        int d = arr[front];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else {
            front = (front + 1) % cap;
        }
        return d;
    }

    boolean search(int val) {
        if (front == -1) {
            return false;
        }
        int i = front;
        while (true) {
            if (arr[i] == val) {
                return true;
            }
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        return false;
    }

    void display() {
        if (front == -1) {
            System.out.println("[]");
            return;
        }
        int i = front;
        System.out.print("[");
        while (true) {
            System.out.print(arr[i] + (i == rear ? "" : ", "));
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        System.out.println("]");
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;

class Queue {
    int* arr;
    int front = -1;
    int rear = -1;
    int cap;
public:
    Queue(int size) {
        cap = size;
        arr = new int[cap];
    }
    ~Queue() {
        delete[] arr;
    }
    void enqueue(int val) {
        if ((rear + 1) % cap == front) {
            return;
        }
        if (front == -1) {
            front = 0;
        }
        rear = (rear + 1) % cap;
        arr[rear] = val;
    }
    int dequeue() {
        if (front == -1) {
            return -1;
        }
        int d = arr[front];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else {
            front = (front + 1) % cap;
        }
        return d;
    }
    bool search(int val) {
        if (front == -1) {
            return false;
        }
        int i = front;
        while (true) {
            if (arr[i] == val) {
                return true;
            }
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        return false;
    }
    void display() {
        if (front == -1) {
            cout << "[]\n";
            return;
        }
        int i = front;
        cout << "[";
        while (true) {
            cout << arr[i] << (i == rear ? "" : ", ");
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        cout << "]\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Queue:
    def __init__(self, cap=100):
        self.arr = [None] * cap
        self.cap = cap
        self.front = -1
        self.rear = -1

    def enqueue(self, val):
        if (self.rear + 1) % self.cap == self.front:
            return
        if self.front == -1:
            self.front = 0
        self.rear = (self.rear + 1) % self.cap
        self.arr[self.rear] = val

    def dequeue(self):
        if self.front == -1:
            return None
        d = self.arr[self.front]
        if self.front == self.rear:
            self.front = self.rear = -1
        else:
            self.front = (self.front + 1) % self.cap
        return d

    def search(self, val):
        if self.front == -1:
            return False
        i = self.front
        while True:
            if self.arr[i] == val:
                return True
            if i == self.rear:
                break
            i = (i + 1) % self.cap
        return False

    def display(self):
        if self.front == -1:
            print("[]")
            return
        i = self.front
        out = []
        while True:
            out.append(str(self.arr[i]))
            if i == self.rear:
                break
            i = (i + 1) % self.cap
        print("[" + ", ".join(out) + "]")
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor(cap = 100) {
        this.arr = new Array(cap);
        this.cap = cap;
        this.front = -1;
        this.rear = -1;
    }
    enqueue(val) {
        if ((this.rear + 1) % this.cap === this.front) {
            return;
        }
        if (this.front === -1) {
            this.front = 0;
        }
        this.rear = (this.rear + 1) % this.cap;
        this.arr[this.rear] = val;
    }
    dequeue() {
        if (this.front === -1) {
            return null;
        }
        let d = this.arr[this.front];
        if (this.front === this.rear) {
            this.front = -1;
            this.rear = -1;
        } else {
            this.front = (this.front + 1) % this.cap;
        }
        return d;
    }
    search(val) {
        if (this.front === -1) {
            return false;
        }
        let i = this.front;
        while (true) {
            if (this.arr[i] === val) {
                return true;
            }
            if (i === this.rear) {
                break;
            }
            i = (i + 1) % this.cap;
        }
        return false;
    }
    display() {
        if (this.front === -1) {
            console.log("[]");
            return;
        }
        let i = this.front;
        let out = [];
        while (true) {
            out.push(this.arr[i]);
            if (i === this.rear) {
                break;
            }
            i = (i + 1) % this.cap;
        }
        console.log("[" + out.join(", ") + "]");
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'QUEUE_DEQUE') {
      if (lang === 'Java') return `class Queue {
    int[] arr;
    int front;
    int rear;
    int cap;

    public Queue(int size) {
        cap = size;
        arr = new int[cap];
        front = -1;
        rear = -1;
    }

    void enqueueFront(int val) {
        if ((front == 0 && rear == cap - 1) || (front == rear + 1)) {
            return;
        }
        if (front == -1) {
            front = 0;
            rear = 0;
        } else if (front == 0) {
            front = cap - 1;
        } else {
            front = front - 1;
        }
        arr[front] = val;
    }

    void enqueueRear(int val) {
        if ((front == 0 && rear == cap - 1) || (front == rear + 1)) {
            return;
        }
        if (front == -1) {
            front = 0;
            rear = 0;
        } else if (rear == cap - 1) {
            rear = 0;
        } else {
            rear = rear + 1;
        }
        arr[rear] = val;
    }

    int dequeueFront() {
        if (front == -1) {
            return -1;
        }
        int d = arr[front];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else if (front == cap - 1) {
            front = 0;
        } else {
            front = front + 1;
        }
        return d;
    }

    int dequeueRear() {
        if (front == -1) {
            return -1;
        }
        int d = arr[rear];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else if (rear == 0) {
            rear = cap - 1;
        } else {
            rear = rear - 1;
        }
        return d;
    }

    boolean search(int val) {
        if (front == -1) {
            return false;
        }
        int i = front;
        while (true) {
            if (arr[i] == val) {
                return true;
            }
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        return false;
    }

    void display() {
        if (front == -1) {
            System.out.println("[]");
            return;
        }
        int i = front;
        System.out.print("[");
        while (true) {
            System.out.print(arr[i] + (i == rear ? "" : ", "));
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        System.out.println("]");
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
using namespace std;

class Queue {
    int* arr;
    int front;
    int rear;
    int cap;
public:
    Queue(int size) {
        cap = size;
        arr = new int[cap];
        front = -1;
        rear = -1;
    }
    ~Queue() {
        delete[] arr;
    }
    void enqueueFront(int val) {
        if ((front == 0 && rear == cap - 1) || (front == rear + 1)) {
            return;
        }
        if (front == -1) {
            front = 0;
            rear = 0;
        } else if (front == 0) {
            front = cap - 1;
        } else {
            front = front - 1;
        }
        arr[front] = val;
    }
    void enqueueRear(int val) {
        if ((front == 0 && rear == cap - 1) || (front == rear + 1)) {
            return;
        }
        if (front == -1) {
            front = 0;
            rear = 0;
        } else if (rear == cap - 1) {
            rear = 0;
        } else {
            rear = rear + 1;
        }
        arr[rear] = val;
    }
    int dequeueFront() {
        if (front == -1) {
            return -1;
        }
        int d = arr[front];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else if (front == cap - 1) {
            front = 0;
        } else {
            front = front + 1;
        }
        return d;
    }
    int dequeueRear() {
        if (front == -1) {
            return -1;
        }
        int d = arr[rear];
        if (front == rear) {
            front = -1;
            rear = -1;
        } else if (rear == 0) {
            rear = cap - 1;
        } else {
            rear = rear - 1;
        }
        return d;
    }
    bool search(int val) {
        if (front == -1) {
            return false;
        }
        int i = front;
        while (true) {
            if (arr[i] == val) {
                return true;
            }
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        return false;
    }
    void display() {
        if (front == -1) {
            cout << "[]\n";
            return;
        }
        int i = front;
        cout << "[";
        while (true) {
            cout << arr[i] << (i == rear ? "" : ", ");
            if (i == rear) {
                break;
            }
            i = (i + 1) % cap;
        }
        cout << "]\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `class Queue:
    def __init__(self, cap=100):
        self.arr = [None] * cap
        self.cap = cap
        self.front = -1
        self.rear = -1

    def enqueueFront(self, val):
        if (self.front == 0 and self.rear == self.cap - 1) or (self.front == self.rear + 1):
            return
        if self.front == -1:
            self.front = 0
            self.rear = 0
        elif self.front == 0:
            self.front = self.cap - 1
        else:
            self.front -= 1
        self.arr[self.front] = val

    def enqueueRear(self, val):
        if (self.front == 0 and self.rear == self.cap - 1) or (self.front == self.rear + 1):
            return
        if self.front == -1:
            self.front = 0
            self.rear = 0
        elif self.rear == self.cap - 1:
            self.rear = 0
        else:
            self.rear += 1
        self.arr[self.rear] = val

    def dequeueFront(self):
        if self.front == -1:
            return None
        val = self.arr[self.front]
        if self.front == self.rear:
            self.front = self.rear = -1
        elif self.front == self.cap - 1:
            self.front = 0
        else:
            self.front += 1
        return val

    def dequeueRear(self):
        if self.front == -1:
            return None
        val = self.arr[self.rear]
        if self.front == self.rear:
            self.front = self.rear = -1
        elif self.rear == 0:
            self.rear = self.cap - 1
        else:
            self.rear -= 1
        return val

    def search(self, val):
        if self.front == -1:
            return False
        i = self.front
        while True:
            if self.arr[i] == val:
                return True
            if i == self.rear:
                break
            i = (i + 1) % self.cap
        return False

    def display(self):
        if self.front == -1:
            print("[]")
            return
        out = []
        i = self.front
        while True:
            out.append(str(self.arr[i]))
            if i == self.rear:
                break
            i = (i + 1) % self.cap
        print("[" + ", ".join(out) + "]")
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor(cap = 100) {
        this.arr = new Array(cap);
        this.cap = cap;
        this.front = -1;
        this.rear = -1;
    }
    enqueueFront(val) {
        if ((this.front === 0 && this.rear === this.cap - 1) || (this.front === this.rear + 1)) {
            return;
        }
        if (this.front === -1) {
            this.front = 0;
            this.rear = 0;
        } else if (this.front === 0) {
            this.front = this.cap - 1;
        } else {
            this.front = this.front - 1;
        }
        this.arr[this.front] = val;
    }
    enqueueRear(val) {
        if ((this.front === 0 && this.rear === this.cap - 1) || (this.front === this.rear + 1)) {
            return;
        }
        if (this.front === -1) {
            this.front = 0;
            this.rear = 0;
        } else if (this.rear === this.cap - 1) {
            this.rear = 0;
        } else {
            this.rear = this.rear + 1;
        }
        this.arr[this.rear] = val;
    }
    dequeueFront() {
        if (this.front === -1) {
            return null;
        }
        let d = this.arr[this.front];
        if (this.front === this.rear) {
            this.front = -1;
            this.rear = -1;
        } else if (this.front === this.cap - 1) {
            this.front = 0;
        } else {
            this.front = this.front + 1;
        }
        return d;
    }
    dequeueRear() {
        if (this.front === -1) {
            return null;
        }
        let d = this.arr[this.rear];
        if (this.front === this.rear) {
            this.front = -1;
            this.rear = -1;
        } else if (this.rear === 0) {
            this.rear = this.cap - 1;
        } else {
            this.rear = this.rear - 1;
        }
        return d;
    }
    search(val) {
        if (this.front === -1) {
            return false;
        }
        let i = this.front;
        while (true) {
            if (this.arr[i] === val) {
                return true;
            }
            if (i === this.rear) {
                break;
            }
            i = (i + 1) % this.cap;
        }
        return false;
    }
    display() {
        if (this.front === -1) {
            console.log("[]");
            return;
        }
        let out = [];
        let i = this.front;
        while (true) {
            out.push(this.arr[i]);
            if (i === this.rear) {
                break;
            }
            i = (i + 1) % this.cap;
        }
        console.log("[" + out.join(", ") + "]");
    }
}
// Execution
${execBlock}`;
    } else if (variety === 'QUEUE_PRIORITY') {
      if (lang === 'Java') return `import java.util.PriorityQueue;

class Queue {
    PriorityQueue<Integer> pq = new PriorityQueue<>();

    public Queue(int cap) {}

    void enqueue(int v) {
        pq.add(v);
    }

    int dequeue() {
        return pq.poll();
    }

    boolean search(int val) {
        return pq.contains(val);
    }

    void display() {
        System.out.println(pq);
    }
}
public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;
      if (lang === 'C++') return `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

class Queue {
    priority_queue<int, vector<int>, greater<int>> pq;
public:
    Queue(int c) {}

    void enqueue(int v) {
        pq.push(v);
    }

    int dequeue() {
        int v = pq.top();
        pq.pop();
        return v;
    }

    bool search(int val) {
        priority_queue<int, vector<int>, greater<int>> temp = pq;
        while (!temp.empty()) {
            if (temp.top() == val) {
                return true;
            }
            temp.pop();
        }
        return false;
    }

    void display() {
        // Traversal of C++ priority_queue prints elements in sorted order
        priority_queue<int, vector<int>, greater<int>> temp = pq;
        while (!temp.empty()) {
            cout << temp.top() << " ";
            temp.pop();
        }
        cout << "\n";
    }
};
int main() {
${execBlock}
    return 0;
}`;
      if (lang === 'Python') return `import heapq

class Queue:
    def __init__(self):
        self.pq = []

    def enqueue(self, v):
        heapq.heappush(self.pq, v)

    def dequeue(self):
        if not self.pq:
            return None
        return heapq.heappop(self.pq)

    def search(self, val):
        for x in self.pq:
            if x == val:
                return True
        return False

    def display(self):
        print(self.pq)
if __name__ == "__main__":
\${execBlock}`;
      if (lang === 'JS') return `class Queue {
    constructor() {
        this.arr = [];
    }

    enqueue(val) {
        this.arr.push(val);
        this.arr.sort((a, b) => a - b);
    }

    dequeue() {
        if (this.arr.length === 0) {
            return null;
        }
        return this.arr.shift();
    }

    search(val) {
        for (let i = 0; i < this.arr.length; i++) {
            if (this.arr[i] === val) {
                return true;
            }
        }
        return false;
    }

    display() {
        console.log(this.arr);
    }
}
// Execution
\${execBlock}`;
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
    boolean search(int key) {
        int index = key % tableSize;
        return table[index].contains(key);
    }
    void delete(int key) {
        int index = key % tableSize;
        table[index].remove(Integer.valueOf(key));
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
    bool search(int key) {
        int index = key % tableSize;
        auto it = find(table[index].begin(), table[index].end(), key);
        return it != table[index].end();
    }
    void remove(int key) {
        int index = key % tableSize;
        table[index].remove(key);
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
    def search(self, key):
        index = key % self.size
        return key in self.table[index]
    def delete(self, key):
        index = key % self.size
        if key in self.table[index]:
            self.table[index].remove(key)
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
    search(key) {
        let index = key % this.size;
        return this.table[index].includes(key);
    }
    delete(key) {
        let index = key % this.size;
        this.table[index] = this.table[index].filter(v => v !== key);
    }
    display() { this.table.forEach((b,i) => console.log(i + ": " + b.join(','))); }
}
// Execution
${execBlock}`;
    } else if (variety === 'HASH_LINEAR' || variety === 'HASH_QUADRATIC' || variety === 'HASH_MULTIPLICATION' || variety === 'HASH_FOLDING') {
      let isQuad = variety === 'HASH_QUADRATIC';
      let isMult = variety === 'HASH_MULTIPLICATION';
      let isFold = variety === 'HASH_FOLDING';

      let probeCodeC = isQuad ? 'int probe = (index + i * i) % tableSize;' : 'int probe = (index + i) % tableSize;';
      let probeCodeJ = isQuad ? 'int probe = (index + i * i) % tableSize;' : 'int probe = (index + i) % tableSize;';
      let probeCodeP = isQuad ? 'probe = (index + i * i) % self.size' : 'probe = (index + i) % self.size';
      let probeCodeJS = isQuad ? 'let probe = (index + i * i) % this.size;' : 'let probe = (index + i) % this.size;';

      let hashCalcJ = isMult 
        ? 'int index = (int) Math.floor(tableSize * ((Math.abs(key) * 0.6180339887) % 1));' 
        : isFold 
        ? 'int index = foldKey(key) % tableSize;' 
        : 'int index = Math.abs(key) % tableSize;';
      
      let hashCalcC = isMult 
        ? 'int index = (int)(tableSize * fmod(abs(key) * 0.6180339887, 1.0));' 
        : isFold 
        ? 'int index = foldKey(key) % tableSize;' 
        : 'int index = abs(key) % tableSize;';
      
      let hashCalcP = isMult 
        ? 'index = int(self.size * ((abs(key) * 0.6180339887) % 1))' 
        : isFold 
        ? 'index = self.fold_key(key) % self.size' 
        : 'index = abs(key) % self.size';

      let hashCalcJS = isMult 
        ? 'let index = Math.floor(this.size * ((Math.abs(key) * 0.6180339887) % 1));' 
        : isFold 
        ? 'let index = this.foldKey(key) % this.size;' 
        : 'let index = Math.abs(key) % this.size;';

      let foldHelperJ = isFold ? `
    int foldKey(int key) {
        String s = String.valueOf(Math.abs(key));
        int sum = 0;
        for (int i = 0; i < s.length(); i += 2) {
            sum += Integer.parseInt(s.substring(i, Math.min(i + 2, s.length())));
        }
        return sum;
    }` : '';

      let foldHelperC = isFold ? `
    int foldKey(int key) {
        string s = to_string(abs(key));
        int sum = 0;
        for (size_t i = 0; i < s.length(); i += 2) {
            sum += stoi(s.substr(i, 2));
        }
        return sum;
    }` : '';

      let foldHelperP = isFold ? `
    def fold_key(self, key):
        s = str(abs(key))
        return sum(int(s[i:i+2]) for i in range(0, len(s), 2))` : '';

      let foldHelperJS = isFold ? `
    foldKey(key) {
        let s = Math.abs(key).toString(), sum = 0;
        for (let i = 0; i < s.length; i += 2) {
            sum += parseInt(s.substring(i, i + 2), 10);
        }
        return sum;
    }` : '';

      if (lang === 'Java') return `import java.util.Arrays;
class HashTable {
    Integer[] table; int tableSize;
    HashTable(int size) { tableSize = size; table = new Integer[size]; }${foldHelperJ}
    void insert(int key) {
        ${hashCalcJ}
        for (int i=0; i<tableSize; i++) {
            ${probeCodeJ}
            if (table[probe] == null || table[probe] == -1) { table[probe] = key; return; }
            if (table[probe] == key) return;
        }
    }
    boolean search(int key) {
        ${hashCalcJ}
        for (int i=0; i<tableSize; i++) {
            ${probeCodeJ}
            if (table[probe] == null) return false;
            if (table[probe] == key) return true;
        }
        return false;
    }
    void delete(int key) {
        ${hashCalcJ}
        for (int i=0; i<tableSize; i++) {
            ${probeCodeJ}
            if (table[probe] == null) return;
            if (table[probe] == key) { table[probe] = -1; return; }
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
#include <string>
#include <cmath>
using namespace std;
class HashTable {
    vector<int> table; int tableSize;
public:
    HashTable(int size) { tableSize = size; table.assign(size, -1); }${foldHelperC}
    void insert(int key) {
        ${hashCalcC}
        for (int i=0; i<tableSize; i++) {
            ${probeCodeC}
            if (table[probe] == -1 || table[probe] == -2) { table[probe] = key; return; }
            if (table[probe] == key) return;
        }
    }
    bool search(int key) {
        ${hashCalcC}
        for (int i=0; i<tableSize; i++) {
            ${probeCodeC}
            if (table[probe] == -1) return false;
            if (table[probe] == key) return true;
        }
        return false;
    }
    void remove(int key) {
        ${hashCalcC}
        for (int i=0; i<tableSize; i++) {
            ${probeCodeC}
            if (table[probe] == -1) return;
            if (table[probe] == key) { table[probe] = -2; return; }
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
        self.size = size; self.table = [None]*size${foldHelperP}
    def insert(self, key):
        ${hashCalcP}
        for i in range(self.size):
            ${probeCodeP}
            if self.table[probe] is None or self.table[probe] == -1:
                self.table[probe] = key
                return
            if self.table[probe] == key: return
    def search(self, key):
        ${hashCalcP}
        for i in range(self.size):
            ${probeCodeP}
            if self.table[probe] is None: return False
            if self.table[probe] == key: return True
        return False
    def delete(self, key):
        ${hashCalcP}
        for i in range(self.size):
            ${probeCodeP}
            if self.table[probe] is None: return
            if self.table[probe] == key:
                self.table[probe] = -1
                return
    def display(self): print(self.table)
if __name__ == "__main__":
${execBlock}`;
      if (lang === 'JS') return `class HashTable {
    constructor(size) { this.size = size; this.table = new Array(size).fill(null); }${foldHelperJS}
    insert(key) {
        ${hashCalcJS}
        for (let i=0; i<this.size; i++) {
            ${probeCodeJS}
            if (this.table[probe] === null || this.table[probe] === 'TOMBSTONE') { this.table[probe] = key; return; }
            if (this.table[probe] === key) return;
        }
    }
    search(key) {
        ${hashCalcJS}
        for (let i=0; i<this.size; i++) {
            ${probeCodeJS}
            if (this.table[probe] === null) return false;
            if (this.table[probe] === key) return true;
        }
        return false;
    }
    delete(key) {
        ${hashCalcJS}
        for (let i=0; i<this.size; i++) {
            ${probeCodeJS}
            if (this.table[probe] === null) return;
            if (this.table[probe] === key) { this.table[probe] = 'TOMBSTONE'; return; }
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
