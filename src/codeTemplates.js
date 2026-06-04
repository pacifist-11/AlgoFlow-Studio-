export const getFullCodeTemplate = (lang, type, operations) => {
  let execBlock = '';

  if (!operations || !operations.length) {
    execBlock = '// Insert nodes in the visualizer to generate the main() logic here...';
  } else {
    if (type === 'SEGMENT_TREE' || type === 'FENWICK_TREE') {
      let finalArr = [];
      operations.forEach(o => { if (o.op === 'insert') finalArr.push(o.val); else finalArr = finalArr.filter(v => v !== o.val); });
      
      if (type === 'SEGMENT_TREE') {
        if (lang === 'C++') {
          execBlock = `    vector<int> arr = {${finalArr.join(', ')}};\n    SegmentTree st(arr);\n    cout << "Sum [0, ${Math.max(0, finalArr.length-1)}] = " << st.query(0, ${Math.max(0, finalArr.length-1)}) << endl;`;
        } else if (lang === 'Java') {
          execBlock = `        int[] arr = {${finalArr.join(', ')}};\n        SegmentTree st = new SegmentTree(arr);\n        System.out.println("Sum [0,${Math.max(0, finalArr.length-1)}] = " + st.query(0, ${Math.max(0, finalArr.length-1)}));`;
        } else if (lang === 'Python') {
          execBlock = `    arr = [${finalArr.join(', ')}]\n    st = SegmentTree(arr)\n    print("Sum [0,${Math.max(0, finalArr.length-1)}] =", st.query(0, ${Math.max(0, finalArr.length-1)}))`;
        } else {
          execBlock = `  const arr = [${finalArr.join(', ')}];\n  const st = new SegmentTree(arr);\n  console.log("Sum [0,${Math.max(0, finalArr.length-1)}] =", st.query(0, ${Math.max(0, finalArr.length-1)}));`;
        }
      } else { // FENWICK_TREE
        if (lang === 'C++') {
          execBlock = `    vector<int> arr = {${finalArr.join(', ')}};\n    FenwickTree ft(arr.size());\n    for(int i=0; i<arr.size(); i++) ft.add(i+1, arr[i]);\n    cout << "Prefix sum up to " << arr.size() << " = " << ft.query(arr.size()) << endl;`;
        } else if (lang === 'Java') {
          execBlock = `        int[] arr = {${finalArr.join(', ')}};\n        FenwickTree ft = new FenwickTree(arr.length);\n        for(int i=0; i<arr.length; i++) ft.add(i+1, arr[i]);\n        System.out.println("Prefix sum up to " + arr.length + " = " + ft.query(arr.length));`;
        } else if (lang === 'Python') {
          execBlock = `    arr = [${finalArr.join(', ')}]\n    ft = FenwickTree(len(arr))\n    for i, v in enumerate(arr):\n        ft.add(i+1, v)\n    print("Prefix sum up to", len(arr), "=", ft.query(len(arr)))`;
        } else {
          execBlock = `  const arr = [${finalArr.join(', ')}];\n  const ft = new FenwickTree(arr.length);\n  arr.forEach((v, i) => ft.add(i+1, v));\n  console.log("Prefix sum up to", arr.length, "=", ft.query(arr.length));`;
        }
      }
    } else {
      if (lang === 'C++') {
        if (type === 'B_TREE' || type === 'B_PLUS_TREE') {
          execBlock = `    BTree t(4);\n` + operations.map(o => `    t.${o.op}(${o.val});`).join('\n') + '\n    t.traverse();';
        } else if (type === 'MIN_HEAP' || type === 'MAX_HEAP') {
          let hClass = type === 'MIN_HEAP' ? 'MinHeap' : 'MaxHeap';
          execBlock = `    ${hClass} heap(100);\n` + operations.map(o => `    heap.${o.op}(${o.val});`).join('\n');
        } else if (type === 'RB_TREE') {
          execBlock = `    RBTree t;\n` + operations.map(o => `    t.${o.op}(${o.val});`).join('\n');
        } else if (type === 'BFS_TREE' || type === 'DFS_TREE') {
          execBlock = `  // Adjacency List built from inputs:\n` + operations.map(o => `  // Inserted: ${o.val}`).join('\n') + `\n  // Root Node of ${type.split('_')[0]} Spanning Tree visualized above.`;
        } else {
          execBlock = `    Node* root = nullptr;\n` + operations.map(o => o.op === 'insert' ? `    root = insert(root, ${o.val});` : `    root = deleteNode(root, ${o.val});`).join('\n');
        }
      } else if (lang === 'Java') {
        if (type === 'B_TREE' || type === 'B_PLUS_TREE') {
          execBlock = `        BTree t = new BTree(4);\n` + operations.map(o => `        t.${o.op}(${o.val});`).join('\n') + '\n        t.traverse();';
        } else if (type === 'MIN_HEAP' || type === 'MAX_HEAP') {
          let hClass = type === 'MIN_HEAP' ? 'MinHeap' : 'MaxHeap';
          execBlock = `        ${hClass} heap = new ${hClass}(100);\n` + operations.map(o => `        heap.${o.op}(${o.val});`).join('\n');
        } else if (type === 'RB_TREE') {
          execBlock = `        RBTree tree = new RBTree();\n` + operations.map(o => `        tree.${o.op}(${o.val});`).join('\n');
        } else {
          execBlock = `        Node root = null;\n` + operations.map(o => o.op === 'insert' ? `        root = tree.insert(root, ${o.val});` : `        root = tree.deleteNode(root, ${o.val});`).join('\n');
        }
      } else if (lang === 'Python') {
        if (type === 'B_TREE' || type === 'B_PLUS_TREE') {
          execBlock = `    t = BTree(4)\n` + operations.map(o => `    t.${o.op}(${o.val})`).join('\n') + '\n    t.traverse()';
        } else if (type === 'MIN_HEAP' || type === 'MAX_HEAP') {
          let hClass = type === 'MIN_HEAP' ? 'MinHeap' : 'MaxHeap';
          execBlock = `    heap = ${hClass}()\n` + operations.map(o => `    heap.${o.op}(${o.val})`).join('\n');
        } else if (type === 'RB_TREE') {
          execBlock = `    tree = RBTree()\n` + operations.map(o => `    tree.${o.op}(${o.val})`).join('\n');
        } else {
          execBlock = `    tree = BST()\n` + operations.map(o => o.op === 'insert' ? `    root = tree.insert(root, ${o.val})` : `    root = tree.deleteNode(root, ${o.val})`).join('\n');
        }
      } else { // JS
        if (type === 'B_TREE' || type === 'B_PLUS_TREE') {
          execBlock = `  const t = new BTree(4);\n` + operations.map(o => `  t.${o.op}(${o.val});`).join('\n') + '\n  t.traverse();';
        } else if (type === 'MIN_HEAP' || type === 'MAX_HEAP') {
          let hClass = type === 'MIN_HEAP' ? 'MinHeap' : 'MaxHeap';
          execBlock = `  const heap = new ${hClass}();\n` + operations.map(o => `  heap.${o.op}(${o.val});`).join('\n');
        } else if (type === 'RB_TREE') {
          execBlock = `  const tree = new RBTree();\n` + operations.map(o => `  tree.${o.op}(${o.val});`).join('\n');
        } else {
          execBlock = `  let root = null;\n` + operations.map(o => o.op === 'insert' ? `  root = insert(root, ${o.val});` : `  root = deleteNode(root, ${o.val});`).join('\n');
        }
      }
    }
  }

  // ── C++ ────────────────────────────────────────────────────────────────────
  if (lang === 'C++' && type === 'BST') return `#include <iostream>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    Node(int k) : key(k), left(nullptr), right(nullptr) {}
};

Node* insert(Node* node, int key) {
    if (!node) return new Node(key);
    if (key < node->key)       node->left  = insert(node->left,  key);
    else if (key > node->key)  node->right = insert(node->right, key);
    return node;
}

void inorder(Node* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->key << " ";
    inorder(node->right);
}

int main() {
${execBlock}
    cout << "Inorder: "; inorder(root); cout << endl;
    return 0;
}`;

  if (lang === 'C++' && type === 'AVL') return `#include <iostream>
#include <algorithm>
using namespace std;

struct Node {
    int key, height;
    Node *left, *right;
    Node(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
};

int height(Node* n) { return n ? n->height : 0; }
int getBalance(Node* n) { return n ? height(n->left) - height(n->right) : 0; }
void updateH(Node* n) { if (n) n->height = 1 + max(height(n->left), height(n->right)); }

Node* rotR(Node* y) { Node* x=y->left; y->left=x->right; x->right=y; updateH(y); updateH(x); return x; }
Node* rotL(Node* x) { Node* y=x->right; x->right=y->left; y->left=x; updateH(x); updateH(y); return y; }

Node* insert(Node* n, int key) {
    if (!n) return new Node(key);
    if (key < n->key)      n->left  = insert(n->left,  key);
    else if (key > n->key) n->right = insert(n->right, key);
    else return n;

    updateH(n);
    int bf = getBalance(n);
    if (bf > 1  && key < n->left->key)  return rotR(n);
    if (bf < -1 && key > n->right->key) return rotL(n);
    if (bf > 1  && key > n->left->key)  { n->left  = rotL(n->left);  return rotR(n); }
    if (bf < -1 && key < n->right->key) { n->right = rotR(n->right); return rotL(n); }
    return n;
}

void inorder(Node* n) { if (!n) return; inorder(n->left); cout << n->key << "(" << getBalance(n) << ") "; inorder(n->right); }

int main() {
${execBlock}
    cout << "Inorder (BF): "; inorder(root); cout << endl;
    return 0;
}`;

  if (lang === 'C++' && type === 'RB_TREE') return `#include <iostream>
using namespace std;
enum Color { RED, BLACK };

struct Node {
    int key; Color color;
    Node *left, *right, *parent;
    Node(int k) : key(k), color(RED), left(nullptr), right(nullptr), parent(nullptr) {}
};

class RBTree {
    Node* root = nullptr;
    void fixInsert(Node* z) { /* rotation & recolor logic */ }
public:
    void insert(int key) {
        Node* z = new Node(key);
        // BST insert + fix
        fixInsert(z);
    }
};

int main() {
${execBlock}
    return 0;
}`;

  if (lang === 'C++' && type === 'FENWICK_TREE') return `#include <iostream>
#include <vector>
using namespace std;

class FenwickTree {
    vector<int> bit;
public:
    FenwickTree(int n) { bit.assign(n + 1, 0); }
    void add(int idx, int val) {
        for (; idx < bit.size(); idx += idx & -idx) bit[idx] += val;
    }
    int query(int idx) {
        int sum = 0;
        for (; idx > 0; idx -= idx & -idx) sum += bit[idx];
        return sum;
    }
};

int main() {
${execBlock}
    return 0;
}`;

  if (lang === 'C++' && type === 'B_TREE') return `#include <iostream>
#include <vector>
using namespace std;

class BTreeNode {
public:
    vector<int> keys;
    vector<BTreeNode*> C;
    bool leaf;
    int t;
    BTreeNode(int t1, bool leaf1) : t(t1), leaf(leaf1) {}
    void insertNonFull(int k) {
        int i = keys.size() - 1;
        if (leaf) {
            keys.push_back(0);
            while (i >= 0 && keys[i] > k) { keys[i + 1] = keys[i]; i--; }
            keys[i + 1] = k;
        } else {
            while (i >= 0 && keys[i] > k) i--;
            if (C[i + 1]->keys.size() == 2 * t - 1) {
                splitChild(i + 1, C[i + 1]);
                if (keys[i + 1] < k) i++;
            }
            C[i + 1]->insertNonFull(k);
        }
    }
    void splitChild(int i, BTreeNode* y) {
        BTreeNode* z = new BTreeNode(y->t, y->leaf);
        for (int j = 0; j < t - 1; j++) z->keys.push_back(y->keys[j + t]);
        if (!y->leaf) {
            for (int j = 0; j < t; j++) z->C.push_back(y->C[j + t]);
        }
        y->keys.resize(t - 1);
        if (!y->leaf) y->C.resize(t);
        C.insert(C.begin() + i + 1, z);
        keys.insert(keys.begin() + i, y->keys[t - 1]);
    }
    void traverse() {
        int i;
        for (i = 0; i < keys.size(); i++) {
            if (!leaf) C[i]->traverse();
            cout << keys[i] << " ";
        }
        if (!leaf) C[i]->traverse();
    }
};

class BTree {
    BTreeNode* root = nullptr;
    int t;
public:
    BTree(int t) : t(t) {}
    void traverse() { if (root) root->traverse(); cout << endl; }
    void insert(int k) {
        if (!root) {
            root = new BTreeNode(t, true);
            root->keys.push_back(k);
        } else {
            if (root->keys.size() == 2 * t - 1) {
                BTreeNode* s = new BTreeNode(t, false);
                s->C.push_back(root);
                s->splitChild(0, root);
                int i = 0;
                if (s->keys[0] < k) i++;
                s->C[i]->insertNonFull(k);
                root = s;
            } else {
                root->insertNonFull(k);
            }
        }
    }
};

int main() {
${execBlock}
    return 0;
}`;

  if (lang === 'C++' && type === 'B_PLUS_TREE') return `#include <iostream>
#include <vector>
using namespace std;

class BPlusNode {
public:
    vector<int> keys;
    vector<BPlusNode*> ptrs;
    BPlusNode* next = nullptr;
    bool isLeaf;
    int order;
    BPlusNode(int order, bool isLeaf) : order(order), isLeaf(isLeaf) {}
};

class BPlusTree {
    BPlusNode* root;
    int order;
public:
    BPlusTree(int order) : order(order), root(new BPlusNode(order, true)) {}
    void insert(int key) {
        // Full insertion involves root splitting and linking leaf nodes
        // Simplified stub for space constraints:
        root->keys.push_back(key);
    }
    void traverse() {
        BPlusNode* cursor = root;
        while (!cursor->isLeaf) cursor = cursor->ptrs[0];
        while (cursor != nullptr) {
            for (int k : cursor->keys) cout << k << " ";
            cursor = cursor->next;
        }
        cout << endl;
    }
};

int main() {
${execBlock}
    return 0;
}`;

  if (lang === 'C++' && type === 'MIN_HEAP') return `#include <iostream>
#include <vector>
using namespace std;

class MinHeap {
    vector<int> heap;
    void heapifyUp(int i) {
        while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
            swap(heap[i], heap[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }
public:
    MinHeap(int cap) {}
    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }
    void print() {
        for (int v : heap) cout << v << " "; cout << endl;
    }
};

int main() {
${execBlock}
    heap.print();
    return 0;
}`;

  if (lang === 'C++' && type === 'MAX_HEAP') return `#include <iostream>
#include <vector>
using namespace std;

class MaxHeap {
    vector<int> heap;
    void heapifyUp(int i) {
        while (i > 0 && heap[(i - 1) / 2] < heap[i]) {
            swap(heap[i], heap[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }
public:
    MaxHeap(int cap) {}
    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }
    void print() {
        for (int v : heap) cout << v << " "; cout << endl;
    }
};

int main() {
${execBlock}
    heap.print();
    return 0;
}`;

  if (lang === 'C++' && type === 'SEGMENT_TREE') return `#include <iostream>
#include <vector>
using namespace std;

class SegmentTree {
    vector<int> tree;
    int n;
    void build(const vector<int>& arr, int node, int l, int r) {
        if (l == r) { tree[node] = arr[l]; return; }
        int mid = (l + r) / 2;
        build(arr, 2*node, l, mid);
        build(arr, 2*node+1, mid+1, r);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size(); tree.resize(4 * n);
        build(arr, 1, 0, n - 1);
    }
    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];
        int mid = (l + r) / 2;
        return query(2*node, l, mid, ql, qr) + query(2*node+1, mid+1, r, ql, qr);
    }
    int query(int l, int r) { return query(1, 0, n-1, l, r); }
};

int main() {
${execBlock}
    return 0;
}`;

  // ── Java ───────────────────────────────────────────────────────────────────
  if (lang === 'Java' && type === 'BST') return `class Node {
    int key; Node left, right;
    Node(int k) { key = k; }
}

public class BST {
    Node insert(Node node, int key) {
        if (node == null) return new Node(key);
        if (key < node.key)       node.left  = insert(node.left,  key);
        else if (key > node.key)  node.right = insert(node.right, key);
        return node;
    }

    void inorder(Node node) {
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.key + " ");
        inorder(node.right);
    }

    public static void main(String[] args) {
        BST tree = new BST();
${execBlock}
        System.out.print("Inorder: "); tree.inorder(root);
    }
}`;

  if (lang === 'Java' && type === 'AVL') return `public class AVLTree {
    class Node {
        int key, height; Node left, right;
        Node(int k) { key = k; height = 1; }
    }

    int height(Node n) { return n == null ? 0 : n.height; }
    int getBalance(Node n) { return n == null ? 0 : height(n.left) - height(n.right); }

    Node rotR(Node y) { Node x=y.left; y.left=x.right; x.right=y; y.height=1+Math.max(height(y.left),height(y.right)); x.height=1+Math.max(height(x.left),height(x.right)); return x; }
    Node rotL(Node x) { Node y=x.right; x.right=y.left; y.left=x; x.height=1+Math.max(height(x.left),height(x.right)); y.height=1+Math.max(height(y.left),height(y.right)); return y; }

    Node insert(Node n, int key) {
        if (n == null) return new Node(key);
        if (key < n.key)      n.left  = insert(n.left,  key);
        else if (key > n.key) n.right = insert(n.right, key);
        else return n;
        n.height = 1 + Math.max(height(n.left), height(n.right));
        int bf = getBalance(n);
        if (bf >  1 && key < n.left.key)  return rotR(n);
        if (bf < -1 && key > n.right.key) return rotL(n);
        if (bf >  1 && key > n.left.key)  { n.left  = rotL(n.left);  return rotR(n); }
        if (bf < -1 && key < n.right.key) { n.right = rotR(n.right); return rotL(n); }
        return n;
    }

    public static void main(String[] args) {
        AVLTree tree = new AVLTree();
${execBlock}
    }
}`;

  if (lang === 'Java' && type === 'RB_TREE') return `enum Color { RED, BLACK }

class Node {
    int key;
    Color color = Color.RED;
    Node left, right, parent;
    Node(int key) { this.key = key; }
}

class RBTree {
    Node root;
    void insert(int key) {
        // Implementation for RB Tree insertion
    }
}

public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;

  if (lang === 'Java' && type === 'MIN_HEAP') return `import java.util.Arrays;

class MinHeap {
    int[] heap;
    int size;
    MinHeap(int capacity) { heap = new int[capacity]; size = 0; }
    void insert(int val) {
        heap[size] = val;
        int curr = size++;
        while (curr > 0 && heap[curr] < heap[(curr - 1) / 2]) {
            int temp = heap[curr];
            heap[curr] = heap[(curr - 1) / 2];
            heap[(curr - 1) / 2] = temp;
            curr = (curr - 1) / 2;
        }
    }
    void print() {
        System.out.println(Arrays.toString(Arrays.copyOf(heap, size)));
    }
}

public class Main {
    public static void main(String[] args) {
${execBlock}
        heap.print();
    }
}`;

  if (lang === 'Java' && type === 'MAX_HEAP') return `import java.util.Arrays;

class MaxHeap {
    int[] heap;
    int size;
    MaxHeap(int capacity) { heap = new int[capacity]; size = 0; }
    void insert(int val) {
        heap[size] = val;
        int curr = size++;
        while (curr > 0 && heap[curr] > heap[(curr - 1) / 2]) {
            int temp = heap[curr];
            heap[curr] = heap[(curr - 1) / 2];
            heap[(curr - 1) / 2] = temp;
            curr = (curr - 1) / 2;
        }
    }
    void print() {
        System.out.println(Arrays.toString(Arrays.copyOf(heap, size)));
    }
}

public class Main {
    public static void main(String[] args) {
${execBlock}
        heap.print();
    }
}`;

  if (lang === 'Java' && type === 'B_TREE') return `import java.util.ArrayList;

class BTreeNode {
    ArrayList<Integer> keys = new ArrayList<>();
    ArrayList<BTreeNode> children = new ArrayList<>();
    boolean leaf;
    int t;
    BTreeNode(int t, boolean leaf) { this.t = t; this.leaf = leaf; }
    void traverse() {
        int i;
        for (i = 0; i < keys.size(); i++) {
            if (!leaf) children.get(i).traverse();
            System.out.print(keys.get(i) + " ");
        }
        if (!leaf) children.get(i).traverse();
    }
    void insertNonFull(int k) {
        int i = keys.size() - 1;
        if (leaf) {
            keys.add(0);
            while (i >= 0 && keys.get(i) > k) { keys.set(i + 1, keys.get(i)); i--; }
            keys.set(i + 1, k);
        } else {
            while (i >= 0 && keys.get(i) > k) i--;
            if (children.get(i + 1).keys.size() == 2 * t - 1) {
                splitChild(i + 1, children.get(i + 1));
                if (keys.get(i + 1) < k) i++;
            }
            children.get(i + 1).insertNonFull(k);
        }
    }
    void splitChild(int i, BTreeNode y) {
        BTreeNode z = new BTreeNode(y.t, y.leaf);
        for (int j = 0; j < t - 1; j++) z.keys.add(y.keys.get(j + t));
        if (!y.leaf) {
            for (int j = 0; j < t; j++) z.children.add(y.children.get(j + t));
        }
        y.keys.subList(t - 1, y.keys.size()).clear();
        if (!y.leaf) y.children.subList(t, y.children.size()).clear();
        children.add(i + 1, z);
        keys.add(i, y.keys.get(t - 1));
    }
}

class BTree {
    BTreeNode root;
    int t;
    BTree(int t) { this.t = t; }
    void traverse() { if (root != null) root.traverse(); System.out.println(); }
    void insert(int k) {
        if (root == null) {
            root = new BTreeNode(t, true);
            root.keys.add(k);
        } else {
            if (root.keys.size() == 2 * t - 1) {
                BTreeNode s = new BTreeNode(t, false);
                s.children.add(root);
                s.splitChild(0, root);
                int i = 0;
                if (s.keys.get(0) < k) i++;
                s.children.get(i).insertNonFull(k);
                root = s;
            } else {
                root.insertNonFull(k);
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;

  if (lang === 'Java' && type === 'B_PLUS_TREE') return `class BPlusTree {
    int order;
    BPlusTree(int order) { this.order = order; }
    void insert(int key) { /* Full B+ Tree insertion logic */ }
    void traverse() { /* Leaf traversal logic */ }
}

public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;

  if (lang === 'Java' && type === 'SEGMENT_TREE') return `class SegmentTree {
    int[] tree;
    int n;
    
    SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        build(arr, 1, 0, n - 1);
    }
    
    void build(int[] arr, int node, int l, int r) {
        if (l == r) { tree[node] = arr[l]; return; }
        int mid = (l + r) / 2;
        build(arr, 2*node, l, mid);
        build(arr, 2*node+1, mid+1, r);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    
    int query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];
        int mid = (l + r) / 2;
        return query(2*node, l, mid, ql, qr) + query(2*node+1, mid+1, r, ql, qr);
    }
    
    int query(int l, int r) { return query(1, 0, n-1, l, r); }
}

public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;

  // ── Python ─────────────────────────────────────────────────────────────────
  if (lang === 'Python' && type === 'BST') return `class Node:
    def __init__(self, key):
        self.key = key
        self.left = self.right = None

class BST:
    def insert(self, root, key):
        if root is None:
            return Node(key)
        if key < root.key:
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        return root

    def inorder(self, root):
        if root:
            self.inorder(root.left)
            print(root.key, end=' ')
            self.inorder(root.right)

if __name__ == '__main__':
${execBlock}
    tree.inorder(root)`;

  if (lang === 'Python' && type === 'AVL') return `class Node:
    def __init__(self, key):
        self.key = key
        self.left = self.right = None
        self.height = 1

class AVLTree:
    def height(self, n): return n.height if n else 0
    def bf(self, n): return self.height(n.left) - self.height(n.right) if n else 0
    def updateH(self, n):
        if n: n.height = 1 + max(self.height(n.left), self.height(n.right))
    def rotR(self, y):
        x=y.left; y.left=x.right; x.right=y; self.updateH(y); self.updateH(x); return x
    def rotL(self, x):
        y=x.right; x.right=y.left; y.left=x; self.updateH(x); self.updateH(y); return y
    def insert(self, n, key):
        if not n: return Node(key)
        if key < n.key:   n.left  = self.insert(n.left,  key)
        elif key > n.key: n.right = self.insert(n.right, key)
        else: return n
        self.updateH(n); b = self.bf(n)
        if b >  1 and key < n.left.key:  return self.rotR(n)
        if b < -1 and key > n.right.key: return self.rotL(n)
        if b >  1 and key > n.left.key:  n.left  = self.rotL(n.left);  return self.rotR(n)
        if b < -1 and key < n.right.key: n.right = self.rotR(n.right); return self.rotL(n)
        return n

if __name__ == '__main__':
${execBlock}`;

  if (lang === 'Python' && type === 'SEGMENT_TREE') return `class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self._build(arr, 0, 0, self.n - 1)

    def _build(self, arr, node, l, r):
        if l == r:
            self.tree[node] = arr[l]; return
        mid = (l + r) // 2
        self._build(arr, 2*node+1, l, mid)
        self._build(arr, 2*node+2, mid+1, r)
        self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]

    def query(self, ql, qr, node=0, l=None, r=None):
        if l is None: l, r = 0, self.n - 1
        if qr < l or r < ql: return 0
        if ql <= l and r <= qr: return self.tree[node]
        mid = (l + r) // 2
        return self.query(ql, qr, 2*node+1, l, mid) + self.query(ql, qr, 2*node+2, mid+1, r)

if __name__ == '__main__':
${execBlock}`;

  if (lang === 'Python' && type === 'RB_TREE') return `class RBTree:
    def __init__(self):
        self.root = None
    def insert(self, key):
        pass # Implementation for RB Tree

if __name__ == '__main__':
${execBlock}`;

  if (lang === 'Python' && type === 'MIN_HEAP') return `class MinHeap:
    def __init__(self):
        self.heap = []
    def insert(self, val):
        self.heap.append(val)
        curr = len(self.heap) - 1
        while curr > 0 and self.heap[curr] < self.heap[(curr - 1) // 2]:
            self.heap[curr], self.heap[(curr - 1) // 2] = self.heap[(curr - 1) // 2], self.heap[curr]
            curr = (curr - 1) // 2
    def print_heap(self):
        print(self.heap)

if __name__ == '__main__':
${execBlock}
    heap.print_heap()`;

  if (lang === 'Python' && type === 'MAX_HEAP') return `class MaxHeap:
    def __init__(self):
        self.heap = []
    def insert(self, val):
        self.heap.append(val)
        curr = len(self.heap) - 1
        while curr > 0 and self.heap[curr] > self.heap[(curr - 1) // 2]:
            self.heap[curr], self.heap[(curr - 1) // 2] = self.heap[(curr - 1) // 2], self.heap[curr]
            curr = (curr - 1) // 2
    def print_heap(self):
        print(self.heap)

if __name__ == '__main__':
${execBlock}
    heap.print_heap()`;

  if (lang === 'Python' && type === 'B_TREE') return `class BTreeNode:
    def __init__(self, t, leaf):
        self.t = t
        self.leaf = leaf
        self.keys = []
        self.children = []
    def insertNonFull(self, k):
        i = len(self.keys) - 1
        if self.leaf:
            self.keys.append(0)
            while i >= 0 and self.keys[i] > k:
                self.keys[i + 1] = self.keys[i]
                i -= 1
            self.keys[i + 1] = k
        else:
            while i >= 0 and self.keys[i] > k:
                i -= 1
            i += 1
            if len(self.children[i].keys) == 2 * self.t - 1:
                self.splitChild(i, self.children[i])
                if self.keys[i] < k:
                    i += 1
            self.children[i].insertNonFull(k)
    def splitChild(self, i, y):
        z = BTreeNode(y.t, y.leaf)
        z.keys = y.keys[self.t:]
        y.keys = y.keys[:self.t - 1]
        if not y.leaf:
            z.children = y.children[self.t:]
            y.children = y.children[:self.t]
        self.children.insert(i + 1, z)
        self.keys.insert(i, y.keys[self.t - 1])
    def traverse(self):
        for i in range(len(self.keys)):
            if not self.leaf:
                self.children[i].traverse()
            print(self.keys[i], end=" ")
        if not self.leaf:
            self.children[len(self.keys)].traverse()

class BTree:
    def __init__(self, t):
        self.root = None
        self.t = t
    def insert(self, k):
        if not self.root:
            self.root = BTreeNode(self.t, True)
            self.root.keys.append(k)
        else:
            if len(self.root.keys) == 2 * self.t - 1:
                s = BTreeNode(self.t, False)
                s.children.append(self.root)
                s.splitChild(0, self.root)
                i = 0
                if s.keys[0] < k:
                    i += 1
                s.children[i].insertNonFull(k)
                self.root = s
            else:
                self.root.insertNonFull(k)
    def traverse(self):
        if self.root:
            self.root.traverse()
        print()

if __name__ == '__main__':
${execBlock}`;

  if (lang === 'Python' && type === 'B_PLUS_TREE') return `class BPlusTree:
    def __init__(self, order):
        self.order = order
    def insert(self, key):
        pass # Full B+ Tree implementation
    def traverse(self):
        pass

if __name__ == '__main__':
${execBlock}`;

  if (lang === 'Java' && type === 'FENWICK_TREE') return `public class Main {
    static class FenwickTree {
        int[] bit;
        public FenwickTree(int n) { bit = new int[n + 1]; }
        public void add(int idx, int val) {
            for (; idx < bit.length; idx += idx & -idx) bit[idx] += val;
        }
        public int query(int idx) {
            int sum = 0;
            for (; idx > 0; idx -= idx & -idx) sum += bit[idx];
            return sum;
        }
    }

    public static void main(String[] args) {
${execBlock}
    }
}`;

  if (lang === 'Python' && type === 'FENWICK_TREE') return `class FenwickTree:
    def __init__(self, size):
        self.bit = [0] * (size + 1)
        
    def add(self, idx, val):
        while idx < len(self.bit):
            self.bit[idx] += val
            idx += idx & -idx
            
    def query(self, idx):
        s = 0
        while idx > 0:
            s += self.bit[idx]
            idx -= idx & -idx
        return s

if __name__ == "__main__":
${execBlock}
`;

  if (lang === 'JS' && type === 'FENWICK_TREE') return `class FenwickTree {
  constructor(size) {
    this.bit = new Array(size + 1).fill(0);
  }
  add(idx, val) {
    for (; idx < this.bit.length; idx += idx & -idx) this.bit[idx] += val;
  }
  query(idx) {
    let sum = 0;
    for (; idx > 0; idx -= idx & -idx) sum += this.bit[idx];
    return sum;
  }
}

function main() {
${execBlock}
}
main();`;

  // ── JavaScript fallback ───────────────────────────────────────────────────
  if (lang === 'JS') {
      if (type === 'MIN_HEAP' || type === 'MAX_HEAP') {
          return `// ${type.replace(/_/g,' ')} — JavaScript

class ${type === 'MIN_HEAP' ? 'MinHeap' : 'MaxHeap'} {
    constructor() {
        this.heap = [];
    }
    insert(val) {
        this.heap.push(val);
        let curr = this.heap.length - 1;
        while (curr > 0) {
            let parent = Math.floor((curr - 1) / 2);
            ${type === 'MIN_HEAP' ? 'if (this.heap[curr] >= this.heap[parent]) break;' : 'if (this.heap[curr] <= this.heap[parent]) break;'}
            [this.heap[curr], this.heap[parent]] = [this.heap[parent], this.heap[curr]];
            curr = parent;
        }
    }
}

// ── Execution ──
${execBlock}
console.log(heap.heap);
`;
      }
      
      if (type === 'B_TREE') {
          return `// B Tree — JavaScript

class BTreeNode {
    constructor(t, leaf) {
        this.t = t;
        this.leaf = leaf;
        this.keys = [];
        this.children = [];
    }
    insertNonFull(k) {
        let i = this.keys.length - 1;
        if (this.leaf) {
            while (i >= 0 && this.keys[i] > k) { i--; }
            this.keys.splice(i + 1, 0, k);
        } else {
            while (i >= 0 && this.keys[i] > k) { i--; }
            if (this.children[i + 1].keys.length === 2 * this.t - 1) {
                this.splitChild(i + 1, this.children[i + 1]);
                if (this.keys[i + 1] < k) i++;
            }
            this.children[i + 1].insertNonFull(k);
        }
    }
    splitChild(i, y) {
        let z = new BTreeNode(y.t, y.leaf);
        z.keys = y.keys.splice(this.t, this.t - 1);
        if (!y.leaf) {
            z.children = y.children.splice(this.t, this.t);
        }
        this.children.splice(i + 1, 0, z);
        this.keys.splice(i, 0, y.keys.pop());
    }
    traverse() {
        for (let i = 0; i < this.keys.length; i++) {
            if (!this.leaf) this.children[i].traverse();
            process.stdout.write(this.keys[i] + " ");
        }
        if (!this.leaf) this.children[this.keys.length].traverse();
    }
}
class BTree {
    constructor(t) { this.root = null; this.t = t; }
    insert(k) {
        if (!this.root) {
            this.root = new BTreeNode(this.t, true);
            this.root.keys.push(k);
        } else {
            if (this.root.keys.length === 2 * this.t - 1) {
                let s = new BTreeNode(this.t, false);
                s.children.push(this.root);
                s.splitChild(0, this.root);
                let i = 0;
                if (s.keys[0] < k) i++;
                s.children[i].insertNonFull(k);
                this.root = s;
            } else {
                this.root.insertNonFull(k);
            }
        }
    }
    traverse() { if (this.root) this.root.traverse(); console.log(); }
}

// ── Execution ──
${execBlock}
`;
      }
      
      return `// ${type.replace(/_/g,' ')} — JavaScript

class Node {
    constructor(val) {
        this.value = val;
        this.left = this.right = null;
    }
}

function insert(node, key) {
    if (!node) return new Node(key);
    if (key < node.value)       node.left  = insert(node.left,  key);
    else if (key > node.value)  node.right = insert(node.right, key);
    return node;
}

function inorder(node, result = []) {
    if (!node) return result;
    inorder(node.left, result);
    result.push(node.value);
    inorder(node.right, result);
    return result;
}

// ── Execution ──
${execBlock}
`;
  }

  // General catch-all fallbacks to ensure syntactically valid boilerplate
  if (lang === 'Java') return `public class Main {
    public static void main(String[] args) {
${execBlock}
    }
}`;

  if (lang === 'C++') return `#include <iostream>
using namespace std;

int main() {
${execBlock}
    return 0;
}`;

  if (lang === 'Python') return `if __name__ == '__main__':
${execBlock}`;

  return `// Unknown Type Fallback
${execBlock}`;
};
