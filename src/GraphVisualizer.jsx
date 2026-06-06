/* eslint-disable react/prop-types, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

// Multilingual Code Templates for Graph Algorithms
const getGraphCodeTemplate = (lang, algo, startNode = '0', endNode = '4') => {
  // Normalize language
  let l = lang ? lang.toLowerCase() : 'java';
  if (l === 'java') lang = 'Java';
  else if (l === 'cpp' || l === 'c++') lang = 'C++';
  else if (l === 'python') lang = 'Python';
  else if (l === 'js' || l === 'javascript') lang = 'JS';

  if (lang === 'C++') {
    if (algo === 'BFS') return `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> adj;
public:
    Graph(int V) : V(V), adj(V) {}
    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u); // Undirected
    }
    void BFS(int start) {
        vector<bool> visited(V, false);
        queue<int> q;
        visited[start] = true;
        q.push(start);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            cout << u << " ";
            for (int v : adj[u]) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.push(v);
                }
            }
        }
    }
};

int main() {
    Graph g(5);
    g.addEdge(0, 1); g.addEdge(0, 2); g.addEdge(1, 3); g.addEdge(2, 4);
    cout << "BFS Traversal: ";
    g.BFS(${startNode});
    return 0;
}`;
    if (algo === 'DFS') return `#include <iostream>
#include <vector>
using namespace std;

class Graph {
    int V;
    vector<vector<int>> adj;
    void DFSUtil(int u, vector<bool>& visited) {
        visited[u] = true;
        cout << u << " ";
        for (int v : adj[u]) {
            if (!visited[v]) DFSUtil(v, visited);
        }
    }
public:
    Graph(int V) : V(V), adj(V) {}
    void addEdge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    void DFS(int start) {
        vector<bool> visited(V, false);
        DFSUtil(start, visited);
    }
};

int main() {
    Graph g(5);
    g.addEdge(0, 1); g.addEdge(0, 2); g.addEdge(1, 3); g.addEdge(2, 4);
    cout << "DFS Traversal: ";
    g.DFS(${startNode});
    return 0;
}`;
    if (algo === 'Dijkstra') return `#include <iostream>
#include <vector>
#include <queue>
using namespace std;
#define INF 1e9

class Graph {
    int V;
    vector<vector<pair<int, int>>> adj;
public:
    Graph(int V) : V(V), adj(V) {}
    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
    void dijkstra(int start, int target) {
        vector<int> dist(V, INF);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        dist[start] = 0;
        pq.push({0, start});
        while (!pq.empty()) {
            int u = pq.top().second; pq.pop();
            if (u == target) break;
            for (auto& edge : adj[u]) {
                int v = edge.first, w = edge.second;
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }
        cout << "Shortest Path to target: " << dist[target] << endl;
    }
};

int main() {
    Graph g(5);
    g.addEdge(0, 1, 4); g.addEdge(0, 2, 2); g.addEdge(1, 3, 5); g.addEdge(2, 4, 3);
    g.dijkstra(${startNode}, ${endNode});
    return 0;
}`;
    // Greedy
    return `#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
using namespace std;

struct Node {
    int id, h;
    bool operator>(const Node& other) const { return h > other.h; }
};

class Graph {
    int V;
    vector<vector<pair<int, int>>> adj;
public:
    Graph(int V) : V(V), adj(V) {}
    void addEdge(int u, int v, int w) { adj[u].push_back({v, w}); adj[v].push_back({u, w}); }
    void greedyBestFirst(int start, int target, const vector<int>& h) {
        vector<bool> visited(V, false);
        priority_queue<Node, vector<Node>, greater<Node>> pq;
        pq.push({start, h[start]});
        while (!pq.empty()) {
            int u = pq.top().id; pq.pop();
            if (visited[u]) continue;
            visited[u] = true;
            cout << u << " ";
            if (u == target) break;
            for (auto& edge : adj[u]) {
                int v = edge.first;
                if (!visited[v]) pq.push({v, h[v]});
            }
        }
    }
};`;
  }

  if (lang === 'Java') {
    if (algo === 'BFS') return `import java.util.*;

class Graph {
    private int V;
    private LinkedList<Integer>[] adj;

    Graph(int V) {
        this.V = V;
        adj = new LinkedList[V];
        for (int i = 0; i < V; ++i) adj[i] = new LinkedList<>();
    }
    void addEdge(int u, int v) { adj[u].add(v); adj[v].add(u); }
    void BFS(int s) {
        boolean[] visited = new boolean[V];
        Queue<Integer> queue = new LinkedList<>();
        visited[s] = true; queue.add(s);
        while (!queue.isEmpty()) {
            s = queue.poll(); System.out.print(s + " ");
            for (int n : adj[s]) {
                if (!visited[n]) {
                    visited[n] = true; queue.add(n);
                }
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1); g.addEdge(0, 2); g.addEdge(1, 3); g.addEdge(2, 4);
        g.BFS(${startNode});
    }
}`;
    if (algo === 'DFS') return `import java.util.*;

class Graph {
    private int V;
    private LinkedList<Integer>[] adj;

    Graph(int V) {
        this.V = V;
        adj = new LinkedList[V];
        for (int i = 0; i < V; ++i) adj[i] = new LinkedList<>();
    }
    void addEdge(int u, int v) { adj[u].add(v); adj[v].add(u); }
    void DFSUtil(int v, boolean[] visited) {
        visited[v] = true; System.out.print(v + " ");
        for (int n : adj[v]) {
            if (!visited[n]) DFSUtil(n, visited);
        }
    }
    void DFS(int s) {
        boolean[] visited = new boolean[V];
        DFSUtil(s, visited);
    }
}

public class Main {
    public static void main(String[] args) {
        Graph g = new Graph(5);
        g.addEdge(0, 1); g.addEdge(0, 2); g.addEdge(1, 3); g.addEdge(2, 4);
        g.DFS(${startNode});
    }
}`;
    if (algo === 'Dijkstra') return `import java.util.*;

class Graph {
    int V; LinkedList<int[]>[] adj;
    Graph(int V) {
        this.V = V; adj = new LinkedList[V];
        for(int i=0; i<V; i++) adj[i] = new LinkedList<>();
    }
    void addEdge(int u, int v, int w) { adj[u].add(new int[]{v, w}); adj[v].add(new int[]{u, w}); }
    void dijkstra(int src, int target) {
        int[] dist = new int[V]; Arrays.fill(dist, Integer.MAX_VALUE);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        dist[src] = 0; pq.add(new int[]{0, src});
        while(!pq.isEmpty()) {
            int u = pq.poll()[1];
            if(u == target) break;
            for(int[] edge : adj[u]) {
                int v = edge[0], w = edge[1];
                if(dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{dist[v], v});
                }
            }
        }
        System.out.println("Shortest path cost: " + dist[target]);
    }
}`;
    // Greedy
    return `import java.util.*;

class Graph {
    int V; LinkedList<int[]>[] adj;
    Graph(int V) {
        this.V = V; adj = new LinkedList[V];
        for(int i=0; i<V; i++) adj[i] = new LinkedList<>();
    }
    void addEdge(int u, int v, int w) { adj[u].add(new int[]{v, w}); adj[v].add(new int[]{u, w}); }
    void greedyBestFirst(int src, int target, int[] h) {
        boolean[] visited = new boolean[V];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{h[src], src});
        while(!pq.isEmpty()) {
            int u = pq.poll()[1];
            if(visited[u]) continue;
            visited[u] = true;
            System.out.print(u + " ");
            if(u == target) break;
            for(int[] edge : adj[u]) {
                int v = edge[0];
                if(!visited[v]) pq.add(new int[]{h[v], v});
            }
        }
    }
}`;
  }

  if (lang === 'Python') {
    if (algo === 'BFS') return `from collections import deque

class Graph:
    def __init__(self, V):
        self.V = V
        self.adj = [[] for _ in range(V)]
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
    def bfs(self, start):
        visited = [False] * self.V
        q = deque([start])
        visited[start] = True
        while q:
            u = q.popleft()
            print(u, end=" ")
            for v in self.adj[u]:
                if not visited[v]:
                    visited[v] = True
                    q.append(v)

g = Graph(5)
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 3)
g.bfs(${startNode})`;
    if (algo === 'DFS') return `class Graph:
    def __init__(self, V):
        self.adj = [[] for _ in range(V)]
    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)
    def dfs_util(self, u, visited):
        visited[u] = True
        print(u, end=" ")
        for v in self.adj[u]:
            if not visited[v]:
                self.dfs_util(v, visited)
    def dfs(self, start):
        visited = [False] * len(self.adj)
        self.dfs_util(start, visited)

g = Graph(5)
g.add_edge(0, 1)
g.dfs(${startNode})`;
    if (algo === 'Dijkstra') return `import heapq

class Graph:
    def __init__(self, V):
        self.adj = [[] for _ in range(V)]
    def add_edge(self, u, v, w):
        self.adj[u].append((v, w))
        self.adj[v].append((u, w))
    def dijkstra(self, src, target):
        dist = [float('inf')] * len(self.adj)
        dist[src] = 0
        pq = [(0, src)]
        while pq:
            d, u = heapq.heappop(pq)
            if u == target: break
            for v, w in self.adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    heapq.heappush(pq, (dist[v], v))
        print("Shortest path cost:", dist[target])`;
    // Greedy
    return `import heapq

class Graph:
    def __init__(self, V):
        self.adj = [[] for _ in range(V)]
    def add_edge(self, u, v, w):
        self.adj[u].append((v, w))
        self.adj[v].append((u, w))
    def greedy(self, src, target, h):
        visited = [False] * len(self.adj)
        pq = [(h[src], src)]
        while pq:
            _, u = heapq.heappop(pq)
            if visited[u]: continue
            visited[u] = True
            print(u, end=" ")
            if u == target: break
            for v, w in self.adj[u]:
                if not visited[v]:
                    heapq.heappush(pq, (h[v], v))`;
  }

  // JS
  if (algo === 'BFS') return `class Graph {
  constructor(V) {
    this.V = V;
    this.adj = Array.from({ length: V }, () => []);
  }
  addEdge(u, v) {
    this.adj[u].push(v);
    this.adj[v].push(u);
  }
  bfs(start) {
    let visited = new Array(this.V).fill(false);
    let q = [start];
    visited[start] = true;
    while (q.length > 0) {
      let u = q.shift();
      console.log(u);
      this.adj[u].forEach(v => {
        if (!visited[v]) {
          visited[v] = true;
          q.push(v);
        }
      });
    }
  }
}

const g = new Graph(5);
g.addEdge(0, 1);
g.bfs(${startNode});`;

  if (algo === 'DFS') return `class Graph {
  constructor(V) {
    this.adj = Array.from({ length: V }, () => []);
  }
  addEdge(u, v) {
    this.adj[u].push(v);
    this.adj[v].push(u);
  }
  dfsUtil(u, visited) {
    visited[u] = true;
    console.log(u);
    this.adj[u].forEach(v => {
      if (!visited[v]) this.dfsUtil(v, visited);
    });
  }
  dfs(start) {
    let visited = new Array(this.adj.length).fill(false);
    this.dfsUtil(start, visited);
  }
}`;

  if (algo === 'Dijkstra') return `class Graph {
  constructor(V) {
    this.adj = Array.from({ length: V }, () => []);
  }
  addEdge(u, v, w) {
    this.adj[u].push({ v, w });
    this.adj[v].push({ u, w });
  }
  dijkstra(src, target) {
    let dist = new Array(this.adj.length).fill(Infinity);
    dist[src] = 0;
    let pq = [{ d: 0, u: src }];
    while (pq.length > 0) {
      pq.sort((a,b) => a.d - b.d);
      let { u } = pq.shift();
      if (u === target) break;
      this.adj[u].forEach(edge => {
        if (dist[u] + edge.w < dist[edge.v]) {
          dist[edge.v] = dist[u] + edge.w;
          pq.push({ d: dist[edge.v], u: edge.v });
        }
      });
    }
    console.log("Shortest Path:", dist[target]);
  }
}`;

  return `class Graph {
  constructor(V) {
    this.adj = Array.from({ length: V }, () => []);
  }
  addEdge(u, v, w) {
    this.adj[u].push({ v, w });
    this.adj[v].push({ u, w });
  }
  greedy(src, target, h) {
    let visited = new Array(this.adj.length).fill(false);
    let pq = [{ cost: h[src], u: src }];
    while (pq.length > 0) {
      pq.sort((a,b) => a.cost - b.cost);
      let { u } = pq.shift();
      if (visited[u]) continue;
      visited[u] = true;
      console.log(u);
      if (u === target) break;
      this.adj[u].forEach(edge => {
        if (!visited[edge.v]) pq.push({ cost: h[edge.v], u: edge.v });
      });
    }
  }
}`;
};

// Fallback-safe Clipboard Copy Helper
const copyToClipboard = (text) => {
  const fallbackCopy = (txt) => {
    const textArea = document.createElement("textarea");
    textArea.value = txt;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 999999);
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("execCommand('copy') returned false"));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.reject(err);
    }
  };

  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).catch((err) => {
      console.warn("navigator.clipboard failed, falling back to execCommand:", err);
      return fallbackCopy(text);
    });
  } else {
    return fallbackCopy(text);
  }
};

const GraphVisualizer = ({ onBack, openSettings, initialAlgo = 'Dijkstra', onCopyCode, onCodeChange, fontSize = 14, wordWrap = 'off' }) => {
  const [nodes, setNodes] = useState([
    { id: 0, label: '0', x: 120, y: 220, dist: Infinity, h: 4 },
    { id: 1, label: '1', x: 260, y: 120, dist: Infinity, h: 3 },
    { id: 2, label: '2', x: 260, y: 320, dist: Infinity, h: 2 },
    { id: 3, label: '3', x: 440, y: 120, dist: Infinity, h: 2 },
    { id: 4, label: '4', x: 440, y: 320, dist: Infinity, h: 0 }
  ]);
  const [edges, setEdges] = useState([
    { id: '0-1', from: 0, to: 1, weight: 4 },
    { id: '0-2', from: 0, to: 2, weight: 2 },
    { id: '1-3', from: 1, to: 3, weight: 5 },
    { id: '2-4', from: 2, to: 4, weight: 3 },
    { id: '3-4', from: 3, to: 4, weight: 1 }
  ]);
  const [nodeLabel, setNodeLabel] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [isDirected, setIsDirected] = useState(false);
  const [startNode, setStartNode] = useState(0);
  const [targetNode, setTargetNode] = useState(4);
  const [algoMode, setAlgoMode] = useState(initialAlgo);
  const [nodeToDelete, setNodeToDelete] = useState('');
  const [edgeToDelete, setEdgeToDelete] = useState('');

  // Animation timeline state
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);

  // Side-by-side Code
  const [codeLang, setCodeLang] = useState('Java');
  const [showCode, setShowCode] = useState(true);

  const [copied, setCopied] = useState(false);
  const handleCopyCode = () => {
    const rawCode = getGraphCodeTemplate(codeLang, algoMode, String(startNode), String(targetNode));
    copyToClipboard(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(rawCode, codeLang);
    }).catch(err => console.error("Clipboard copy failed:", err));
  };

  const handleDeleteNode = () => {
    if (nodeToDelete === '') return;
    const nid = parseInt(nodeToDelete);
    const updatedNodes = nodes.filter(n => n.id !== nid);
    setNodes(updatedNodes);
    setEdges(prev => prev.filter(e => e.from !== nid && e.to !== nid));
    if (startNode === nid) {
      setStartNode(updatedNodes.length > 0 ? updatedNodes[0].id : '');
    }
    if (targetNode === nid) {
      setTargetNode(updatedNodes.length > 1 ? updatedNodes[updatedNodes.length - 1].id : (updatedNodes.length > 0 ? updatedNodes[0].id : ''));
    }
    setNodeToDelete('');
    handleResetAnimation();
  };

  const handleDeleteEdge = () => {
    if (edgeToDelete === '') return;
    setEdges(prev => prev.filter(e => e.id !== edgeToDelete));
    setEdgeToDelete('');
    handleResetAnimation();
  };

  useEffect(() => {
    const rawCode = getGraphCodeTemplate(codeLang, algoMode, String(startNode), String(targetNode));
    if (onCodeChange) onCodeChange(rawCode, codeLang);
  }, [codeLang, algoMode, startNode, targetNode, onCodeChange]);

  // Drag state
  const [draggingNode, setDraggingNode] = useState(null);
  const containerRef = useRef(null);
  const lineRefs = useRef({});
  const nodeCircleRefs = useRef({});

  // Animation scheduler hook
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < timeline.length - 1) {
      timer = setTimeout(() => setCurrentStep(p => p + 1), speed);
    } else if (currentStep >= timeline.length - 1) {
      setTimeout(() => setIsPlaying(false), 0);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, timeline.length, speed]);

  // Node drawing click placement helper
  const handleCanvasClick = (e) => {
    if (draggingNode !== null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked too close to existing node
    const close = nodes.some(n => Math.hypot(n.x - x, n.y - y) < 60);
    if (close) return;

    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    const label = nodeLabel.trim() || String(newId);
    // calculate simple Euclidean h value relative to the target node
    const target = nodes.find(n => n.id === targetNode) || { x: 500, y: 300 };
    const h = Math.round(Math.hypot(x - target.x, y - target.y) / 100);

    setNodes(prev => [...prev, { id: newId, label, x, y, dist: Infinity, h }]);
    setNodeLabel('');
  };

  const handleAddNode = () => {
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    const label = nodeLabel.trim() || String(newId);
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 250;
    const target = nodes.find(n => n.id === targetNode) || { x: 440, y: 320 };
    const h = Math.round(Math.hypot(x - target.x, y - target.y) / 100);
    setNodes(prev => [...prev, { id: newId, label, x, y, dist: Infinity, h }]);
    setNodeLabel('');
  };

  const handleAddEdge = () => {
    if (edgeFrom === '' || edgeTo === '' || edgeFrom === edgeTo) return;
    const fId = parseInt(edgeFrom);
    const tId = parseInt(edgeTo);
    const edgeId = `${fId}-${tId}`;
    if (edges.some(e => e.id === edgeId || (!isDirected && e.id === `${tId}-${fId}`))) {
      alert('Edge already exists!');
      return;
    }
    setEdges(prev => [...prev, { id: edgeId, from: fId, to: tId, weight: parseInt(edgeWeight) || 1 }]);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setTimeline([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleResetAnimation = () => {
    setTimeline([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setNodes(p => p.map(n => ({ ...n, dist: Infinity })));
  };

  // Node Dragging Logic
  const handleNodeMouseDown = (nodeId) => {
    setDraggingNode(nodeId);
  };

  const handleCanvasMouseMove = (e) => {
    if (draggingNode === null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(prev => prev.map(n => {
      if (n.id === draggingNode) {
        const target = prev.find(no => no.id === targetNode) || { x: 500, y: 300 };
        const h = Math.round(Math.hypot(x - target.x, y - target.y) / 100);
        return { ...n, x, y, h };
      }
      return n;
    }));
  };

  const handleCanvasMouseUp = () => {
    setDraggingNode(null);
  };

  // Traversal simulations
  const runTraversal = () => {
    if (nodes.length === 0) return;
    const frames = [];
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.from].push({ to: e.to, w: e.weight });
      if (!isDirected) {
        adj[e.to].push({ to: e.from, w: e.weight });
      }
    });

    if (algoMode === 'BFS') {
      const visited = {};
      const q = [startNode];
      visited[startNode] = true;
      frames.push({
        visited: { ...visited },
        active: startNode,
        queue: [...q],
        activeEdge: null,
        msg: `Initialize BFS from Node ${startNode}`,
        activeLine: 'visited[start] = true'
      });

      while (q.length > 0) {
        const u = q.shift();
        frames.push({
          visited: { ...visited },
          active: u,
          queue: [...q],
          activeEdge: null,
          msg: `Dequeued Node ${u} from the queue`,
          activeLine: 'int u = q.front()'
        });

        for (let edge of adj[u]) {
          const v = edge.to;
          if (!visited[v]) {
            visited[v] = true;
            q.push(v);
            frames.push({
              visited: { ...visited },
              active: u,
              queue: [...q],
              activeEdge: `${u}-${v}`,
              msg: `Discovered neighbor ${v}, pushing to queue`,
              activeLine: 'q.push(v)'
            });
          }
        }
      }
    } else if (algoMode === 'DFS') {
      const visited = {};
      const stack = [startNode];
      
      frames.push({
        visited: { ...visited },
        active: startNode,
        stack: [...stack],
        msg: `Initialize DFS recursion from Node ${startNode}`,
        activeLine: 'DFSUtil(start)'
      });

      const dfs = (u) => {
        visited[u] = true;
        frames.push({
          visited: { ...visited },
          active: u,
          stack: [...stack],
          msg: `Visited Node ${u}`,
          activeLine: 'visited[u] = true'
        });

        for (let edge of adj[u]) {
          const v = edge.to;
          if (!visited[v]) {
            stack.push(v);
            frames.push({
              visited: { ...visited },
              active: u,
              stack: [...stack],
              activeEdge: `${u}-${v}`,
              msg: `Traversing edge ${u} ➔ ${v}`,
              activeLine: 'DFSUtil(v)'
            });
            dfs(v);
            stack.pop();
            frames.push({
              visited: { ...visited },
              active: u,
              stack: [...stack],
              msg: `Backtracking from ${v} to ${u}`,
              activeLine: '}'
            });
          }
        }
      };
      dfs(startNode);
    } else if (algoMode === 'Dijkstra') {
      const dist = {};
      const parent = {};
      nodes.forEach(n => dist[n.id] = Infinity);
      dist[startNode] = 0;
      
      const q = [...nodes.map(n => n.id)];
      frames.push({
        dist: { ...dist },
        active: startNode,
        queue: [...q],
        msg: `Initialize Dijkstra: dist[${startNode}] = 0, others = ∞`,
        activeLine: 'dist[start] = 0'
      });

      while (q.length > 0) {
        // Extract minimum distance node
        q.sort((a, b) => dist[a] - dist[b]);
        const u = q.shift();
        
        if (dist[u] === Infinity) break;
        if (u === targetNode) {
          frames.push({
            dist: { ...dist },
            active: u,
            queue: [...q],
            msg: `Reached target Node ${targetNode}! Shortest path is found.`,
            activeLine: 'if (u == target) break;'
          });
          break;
        }

        frames.push({
          dist: { ...dist },
          active: u,
          queue: [...q],
          msg: `Extract minimum node ${u} with dist = ${dist[u]}`,
          activeLine: 'int u = pq.top().second'
        });

        for (let edge of adj[u]) {
          const v = edge.to;
          const alt = dist[u] + edge.w;
          frames.push({
            dist: { ...dist },
            active: u,
            queue: [...q],
            activeEdge: `${u}-${v}`,
            msg: `Relaxation probe: Check ${u}➔${v} (cost: ${dist[u]} + ${edge.w} vs current: ${dist[v]})`,
            activeLine: 'if (dist[u] + w < dist[v])'
          });

          if (alt < dist[v]) {
            dist[v] = alt;
            parent[v] = u;
            frames.push({
              dist: { ...dist },
              active: u,
              queue: [...q],
              activeEdge: `${u}-${v}`,
              msg: `Success! Relax dist[${v}] to ${alt}`,
              activeLine: 'dist[v] = dist[u] + w'
            });
          }
        }
      }
      
      // Trace path
      let curr = targetNode;
      const pathEdges = [];
      while (parent[curr] !== undefined) {
        pathEdges.push(`${parent[curr]}-${curr}`);
        curr = parent[curr];
      }
      if (pathEdges.length > 0) {
        frames.push({
          dist: { ...dist },
          active: targetNode,
          pathHighlight: pathEdges,
          msg: `Finished! Glowing gold highlights the optimal path.`,
          activeLine: 'cout << dist[target]'
        });
      }
    } else if (algoMode === 'Greedy') {
      // Greedy Best-First Search using Euclidean distance heuristics
      const visited = {};
      const pq = [{ id: startNode, h: nodes.find(n => n.id === startNode)?.h || 0 }];
      
      frames.push({
        visited: { ...visited },
        active: startNode,
        queue: [...pq],
        msg: `Initialize Greedy Best-First: Start at ${startNode} with heuristic value h=${pq[0].h}`,
        activeLine: 'pq.push({start, h[start]})'
      });

      while (pq.length > 0) {
        pq.sort((a,b) => a.h - b.h);
        const { id: u } = pq.shift();
        if (visited[u]) continue;
        visited[u] = true;

        frames.push({
          visited: { ...visited },
          active: u,
          queue: [...pq],
          msg: `Visiting Node ${u} (h=${nodes.find(n => n.id === u)?.h})`,
          activeLine: 'int u = pq.top().id'
        });

        if (u === targetNode) {
          frames.push({
            visited: { ...visited },
            active: u,
            queue: [...pq],
            msg: `Reached target Node ${targetNode}! Traversal complete.`,
            activeLine: 'if (u == target) break;'
          });
          break;
        }

        for (let edge of adj[u]) {
          const v = edge.to;
          if (!visited[v]) {
            const hVal = nodes.find(n => n.id === v)?.h || 0;
            pq.push({ id: v, h: hVal });
            frames.push({
              visited: { ...visited },
              active: u,
              queue: [...pq],
              activeEdge: `${u}-${v}`,
              msg: `Push neighbor ${v} to queue with heuristic h=${hVal}`,
              activeLine: 'pq.push({v, h[v]})'
            });
          }
        }
      }
    }

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const currentFrame = timeline[currentStep] || {
    visited: {},
    dist: {},
    active: -1,
    queue: [],
    stack: [],
    activeEdge: null,
    pathHighlight: [],
    msg: 'Assemble your graph, select start/target nodes, and click Run Traversal!'
  };

  // GSAP pulse triggers on active nodes
  useEffect(() => {
    if (currentFrame.active !== -1 && nodeCircleRefs.current[currentFrame.active]) {
      gsap.fromTo(nodeCircleRefs.current[currentFrame.active],
        { scale: 0.8, filter: 'brightness(1.5)' },
        { scale: 1.15, filter: 'brightness(1)', duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }
  }, [currentStep]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary, #0f172a)', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem 0', background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid var(--glass-border)' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, textShadow: '0 0 25px rgba(59,130,246,0.3)' }}>
          Graph Visualizer
        </h1>
      </div>

      {/* Control Bar matching user screenshot exact design */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '15px', 
        padding: '0.8rem 1.5rem', 
        background: 'rgba(15,23,42,0.6)', 
        borderBottom: '1px solid var(--glass-border)',
        flexWrap: 'wrap'
      }}>
        {/* Node controls */}
        <input 
          type="text" 
          className="styled-input" 
          style={{ width: '110px', fontSize: '0.9rem', padding: '0.35rem 0.6rem' }} 
          placeholder="Node Label" 
          value={nodeLabel} 
          onChange={e => setNodeLabel(e.target.value)} 
          onKeyDown={e => { if (e.key === 'Enter') handleAddNode(); }}
        />
        <button className="btn btn-insert" style={{ padding: '0.4rem 1rem' }} onClick={handleAddNode}>
          + Node
        </button>

        <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)' }} />

        {/* Edge links */}
        <select 
          className="styled-select" 
          style={{ width: '100px', padding: '0.35rem' }} 
          value={edgeFrom} 
          onChange={e => setEdgeFrom(e.target.value)}
        >
          <option value="">From...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        
        <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>➔</span>

        <select 
          className="styled-select" 
          style={{ width: '100px', padding: '0.35rem' }} 
          value={edgeTo} 
          onChange={e => setEdgeTo(e.target.value)}
        >
          <option value="">To...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>

        <input 
          type="number" 
          className="styled-input" 
          style={{ width: '60px', padding: '0.35rem' }} 
          placeholder="Wt" 
          value={edgeWeight} 
          onChange={e => setEdgeWeight(Math.max(1, parseInt(e.target.value) || 1))} 
          onKeyDown={e => { if (e.key === 'Enter') handleAddEdge(); }}
          title="Edge Weight"
        />

        <button className="btn btn-insert" style={{ padding: '0.4rem 1rem', background: '#8b5cf6' }} onClick={handleAddEdge}>
          + Edge
        </button>

        <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)' }} />

        {/* Delete controls */}
        <select 
          className="styled-select" 
          style={{ width: '90px', padding: '0.35rem' }} 
          value={nodeToDelete} 
          onChange={e => setNodeToDelete(e.target.value)}
        >
          <option value="">Node...</option>
          {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', borderColor: 'transparent' }} onClick={handleDeleteNode}>
          Delete Node
        </button>

        <select 
          className="styled-select" 
          style={{ width: '110px', padding: '0.35rem' }} 
          value={edgeToDelete} 
          onChange={e => setEdgeToDelete(e.target.value)}
        >
          <option value="">Edge...</option>
          {edges.map(e => {
            const fromLabel = nodes.find(n => n.id === e.from)?.label || String(e.from);
            const toLabel = nodes.find(n => n.id === e.to)?.label || String(e.to);
            return <option key={e.id} value={e.id}>{`${fromLabel} ➔ ${toLabel}`}</option>;
          })}
        </select>
        <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem', background: '#ef4444', color: 'white', borderColor: 'transparent' }} onClick={handleDeleteEdge}>
          Delete Edge
        </button>

        <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)' }} />

        {/* Graph directed/undirected toggle */}
        <button 
          className="btn btn-clear" 
          style={{ 
            background: isDirected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)', 
            border: `1.5px solid ${isDirected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
            color: isDirected ? 'var(--accent-primary)' : 'var(--text-primary)',
            fontWeight: 800,
            padding: '0.4rem 1.1rem'
          }} 
          onClick={() => setIsDirected(!isDirected)}
        >
          {isDirected ? 'Directed Graph' : 'Undirected Graph'}
        </button>

        <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)' }} />

        {/* Action controls */}
        <span 
          style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline', transition: 'color 0.2s' }}
          onClick={handleResetAnimation}
          onMouseOver={e => e.currentTarget.style.color = '#fff'}
          onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
        >
          Reset
        </span>
        
        <span 
          style={{ color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline', transition: 'color 0.2s' }}
          onClick={handleClear}
          onMouseOver={e => e.currentTarget.style.color = '#f87171'}
          onMouseOut={e => e.currentTarget.style.color = '#ef4444'}
        >
          Clear
        </span>

        <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)' }} />

        {openSettings && (
          <button className="btn btn-clear" style={{ padding: '0.4rem 1rem' }} onClick={openSettings}>
            ⚙ Settings
          </button>
        )}

        <button className="btn btn-clear" style={{ padding: '0.4rem 1rem' }} onClick={onBack}>
          🏠 Home
        </button>

      </div>

      {/* Main Workspace split */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Side: Visualizer and Animation Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.2rem', overflow: 'hidden' }}>
          
          {/* Active step message bar */}
          <div style={{ textAlign: 'center', marginBottom: '1rem', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ 
              fontSize: '1.2rem', 
              color: 'var(--text-primary)', 
              fontWeight: 'bold', 
              background: 'rgba(255,255,255,0.04)', 
              padding: '5px 22px', 
              borderRadius: '20px', 
              border: '1px solid var(--glass-border)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
            }}>
              {currentFrame.msg}
            </span>
          </div>

          {/* Graph Canvas */}
          <div 
            ref={containerRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            style={{ 
              flex: 1, 
              background: 'rgba(15,23,42,0.4)', 
              borderRadius: '16px', 
              border: '1px solid var(--glass-border)', 
              position: 'relative', 
              overflow: 'hidden',
              cursor: draggingNode !== null ? 'grabbing' : 'crosshair',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)'
            }}
          >
            {/* Edge Lines drawing */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                </marker>
                <marker id="arrow-path" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>

              {edges.map(edge => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const edgeKey1 = `${edge.from}-${edge.to}`;
                const edgeKey2 = `${edge.to}-${edge.from}`;
                const isActive = currentFrame.activeEdge === edgeKey1 || currentFrame.activeEdge === edgeKey2;
                const isPath = currentFrame.pathHighlight?.includes(edgeKey1) || currentFrame.pathHighlight?.includes(edgeKey2);

                let color = 'rgba(99, 102, 241, 0.4)';
                let strokeWidth = 2.5;
                if (isActive) { color = '#fbbf24'; strokeWidth = 4.5; }
                if (isPath) { color = '#10b981'; strokeWidth = 5.5; }

                // Text placement in center
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                return (
                  <g key={edge.id}>
                    <line 
                      x1={fromNode.x} 
                      y1={fromNode.y} 
                      x2={toNode.x} 
                      y2={toNode.y} 
                      stroke={color} 
                      strokeWidth={strokeWidth}
                      markerEnd={isDirected ? (isPath ? 'url(#arrow-path)' : isActive ? 'url(#arrow-active)' : 'url(#arrow') : undefined}
                      style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                    />
                    <rect x={midX - 10} y={midY - 10} width={20} height={20} rx={4} fill="#1e293b" stroke="var(--glass-border)" strokeWidth="1" />
                    <text x={midX} y={midY + 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">{edge.weight}</text>
                  </g>
                );
              })}
            </svg>

            {/* Nodes drawing */}
            {nodes.map(node => {
              const isVisited = currentFrame.visited && currentFrame.visited[node.id];
              const isActive = currentFrame.active === node.id;
              
              let bg = 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))';
              let border = '2px solid var(--glass-border)';
              let glow = '0 0 10px rgba(99,102,241,0.2)';

              if (isVisited) {
                bg = 'linear-gradient(135deg, #10b981, #059669)';
                glow = '0 0 18px rgba(16,185,129,0.5)';
              }
              if (isActive) {
                bg = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                border = '3px solid #fff';
                glow = '0 0 25px rgba(245,158,11,0.8)';
              }

              // Dijkstra dynamic distance badge
              let distText = '';
              if (algoMode === 'Dijkstra') {
                const currentDist = currentFrame.dist && currentFrame.dist[node.id] !== undefined ? currentFrame.dist[node.id] : node.dist;
                distText = currentDist === Infinity ? '∞' : String(currentDist);
              } else if (algoMode === 'Greedy') {
                distText = `h:${node.h}`;
              }

              return (
                <div 
                  key={node.id}
                  ref={el => nodeCircleRefs.current[node.id] = el}
                  onMouseDown={(e) => { e.stopPropagation(); handleNodeMouseDown(node.id); }}
                  style={{
                    position: 'absolute',
                    left: node.x - 25,
                    top: node.y - 25,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: bg,
                    border: border,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: glow,
                    cursor: 'grab',
                    userSelect: 'none',
                    zIndex: 10,
                    transition: 'background 0.3s, border 0.3s, box-shadow 0.3s'
                  }}
                >
                  <span>{node.label}</span>
                  {distText !== '' && (
                    <span style={{ 
                      position: 'absolute', 
                      top: '-18px', 
                      fontSize: '0.75rem', 
                      background: 'rgba(30,41,59,0.9)', 
                      padding: '2px 6px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--glass-border)',
                      color: '#fbbf24',
                      fontWeight: 800
                    }}>
                      {distText}
                    </span>
                  )}
                </div>
              );
            })}

            {nodes.length === 0 && (
              <div style={{ position: 'absolute', top: '45%', left: '30%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', textAlign: 'center', width: '40%' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>🎨 Drawing Workspace</span>
                Click anywhere on the workspace to add nodes, or use the select tools in the control bar to construct custom paths!
              </div>
            )}
          </div>

          {/* Bottom animation steps & algorithm configuration bar */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '1.2rem', background: 'var(--glass-bg)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select className="styled-select" style={{ width: '130px', fontWeight: 'bold' }} value={algoMode} onChange={e => { setAlgoMode(e.target.value); handleResetAnimation(); }} disabled={isPlaying}>
                <option value="Dijkstra">Dijkstra</option>
                <option value="BFS">BFS</option>
                <option value="DFS">DFS</option>
                <option value="Greedy">Greedy BFS</option>
              </select>

              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '5px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Start:</span>
                <select className="styled-select" style={{ width: '65px', padding: '0.2rem' }} value={startNode} onChange={e => setStartNode(parseInt(e.target.value))} disabled={isPlaying}>
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>

              {(algoMode === 'Dijkstra' || algoMode === 'Greedy') && (
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '5px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Target:</span>
                  <select className="styled-select" style={{ width: '65px', padding: '0.2rem' }} value={targetNode} onChange={e => setTargetNode(parseInt(e.target.value))} disabled={isPlaying}>
                    {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                  </select>
                </div>
              )}

              <button className="btn btn-insert" style={{ marginLeft: '10px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }} onClick={runTraversal} disabled={isPlaying || nodes.length === 0}>
                ▶ Run Traversal
              </button>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />

            {/* Playback controller */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={!timeline.length || currentStep === 0}>⏮</button>
              <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={!timeline.length || currentStep === 0}>◀</button>
              <button className="btn btn-clear" style={{ padding: '0.4rem 1.2rem', background: isPlaying ? 'rgba(59,130,246,0.5)' : 'var(--accent-primary)', color: 'white' }} onClick={() => setIsPlaying(!isPlaying)} disabled={!timeline.length}>
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={!timeline.length || currentStep === timeline.length - 1}>▶</button>
              <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={!timeline.length || currentStep === timeline.length - 1}>⏭</button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginLeft: '5px' }}>{timeline.length ? currentStep + 1 : 0}/{timeline.length}</span>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>Speed</span>
              <input type="range" min={100} max={1500} step={100} value={1600 - speed} onChange={e => setSpeed(1600 - Number(e.target.value))} style={{ width: '100px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }} />
            </div>

          </div>

        </div>

        {/* Right Side Code Panel */}
        {showCode && (
          <div style={{ width: '450px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold', flex: 1 }}>Algorithm Code</h3>
              <button 
                onClick={handleCopyCode} 
                className="btn btn-clear" 
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
              <select className="styled-select" style={{ width: '120px', padding: '0.3rem' }} value={codeLang} onChange={e => setCodeLang(e.target.value)}>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="JS">JavaScript</option>
              </select>
            </div>
            
            <div style={{ flex: 1, padding: '1rem 0', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
              <pre style={{ 
                margin: 0, 
                color: 'var(--text-primary)', 
                fontFamily: "'Fira Code', monospace", 
                fontSize: `${fontSize}px`, 
                whiteSpace: wordWrap === 'on' ? 'pre-wrap' : 'pre', 
                lineHeight: '1.55' 
              }}>
                <code>
                  {getGraphCodeTemplate(codeLang, algoMode, String(startNode), String(targetNode)).split('\n').map((line, i) => {
                    const isMatch = currentFrame.activeLine && line.includes(currentFrame.activeLine);
                    return (
                      <div key={i} style={{ 
                        background: isMatch ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                        borderLeft: isMatch ? '4px solid #10b981' : '4px solid transparent',
                        padding: '1px 1rem',
                        display: 'flex'
                      }}>
                        <span style={{ width: '25px', color: isMatch ? '#10b981' : 'var(--text-secondary)', userSelect: 'none', marginRight: '10px', textAlign: 'right' }}>
                          {isMatch ? '➔' : i + 1}
                        </span>
                        <span>{line}</span>
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>

            <div style={{ padding: '0.8rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', background: 'var(--glass-bg)' }}>
              <button className="btn btn-clear" style={{ width: '100%' }} onClick={() => setShowCode(false)}>💻 Hide Panel</button>
            </div>
          </div>
        )}

      </div>
      
      {/* Floating workspace buttons */}
      {!showCode && (
        <button 
          style={{ position: 'absolute', right: '20px', bottom: '80px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 15px rgba(59,130,246,0.4)', zIndex: 100 }}
          onClick={() => setShowCode(true)}
          title="Show Code Panel"
        >
          💻
        </button>
      )}

    </div>
  );
};

export default GraphVisualizer;
