// ─── Expanded Curriculum Knowledge Base for AlgoFlow Studio ─────────────────
// Covers 10 Key Academic & Industrial Curricula:
// 1. Relational Database Engineering & Microservices
// 2. Data Structures & Algorithms II (Trees, Graphs, DP, Sorting)
// 3. Artificial Intelligence: Problem Solving & Search
// 4. German Language A1 Foundations
// 5. Data Science & Analytics
// 6. Machine Learning Systems (PlacementPredict)
// 7. German Language A1 Workplace & Daily Communication
// 8. Embedded Systems & Industrial Servo Control (STM32H7 / ARM Cortex-M7)
// 9. Operating Systems & Systems Programming (Linux / POSIX)
// 10. Advanced Algorithms & TextHack System

export const EXPANDED_COURSES_KNOWLEDGE_BASE = [
  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 1: RELATIONAL DATABASE & BACKEND ENGINEERING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "RDBMS Foundations, Schema Design & Normalization",
    keywords: ["rdbms", "database architecture", "three schema model", "data independence", "er modeling", "cardinality", "ddl", "normalization", "1nf", "2nf", "3nf", "bcnf", "acid", "mvcc"],
    summary: "Relational database foundations: ANSI-SPARC three-schema architecture, logical/physical data independence, ER modeling, functional dependencies, 1NF to BCNF, and ACID transaction isolation with MVCC.",
    primaryLang: "SQL & PostgreSQL / MySQL",
    placementDemand: "Core Backend, Data Engineering & SDE Placements",
    content: `Relational Database Engineering Foundations:
1. **ANSI-SPARC Three-Schema Architecture:**
   • **External Level (User Views):** Individual user/application views of data.
   • **Conceptual Level (Logical Schema):** Global community view (entities, relationships, constraints).
   • **Internal Level (Physical Schema):** Physical disk storage representation, B-tree file structures, block indexing.
   • **Data Independence:**
     - *Logical Data Independence:* Modifying conceptual schema (adding columns) without altering external views.
     - *Physical Data Independence:* Modifying physical storage (adding indexes, moving to SSD) without altering conceptual schema.

2. **Entity-Relationship (ER) Modeling & Cardinality:**
   • Strong Entities (independent key) vs. Weak Entities (discriminator + identifying relationship).
   • Cardinality ratios: 1:1, 1:N, M:N (resolved via associative/junction tables with composite primary keys).

3. **Normalization (Functional Dependencies):**
   • **1NF:** Attribute values must be atomic; no multi-valued attributes or repeating groups.
   • **2NF:** 1NF + No partial dependencies (all non-prime attributes fully functionally dependent on the entire candidate key).
   • **3NF:** 2NF + No transitive dependencies ($X \\to Y$ where $Y$ is non-prime and $X$ is not a superkey).
   • **BCNF:** For every non-trivial functional dependency $X \\to Y$, $X$ must be a superkey.

4. **Transactions, ACID & Multi-Version Concurrency Control (MVCC):**
   • **Atomicity:** All-or-nothing rollback via Write-Ahead Logging (WAL).
   • **Consistency:** Integrity constraints and foreign keys hold across commits.
   • **Isolation Levels:** Read Uncommitted (dirty reads) $\\to$ Read Committed $\\to$ Repeatable Read (non-repeatable reads prevented) $\\to$ Serializable (phantom reads prevented via predicate locks / SSI).
   • **MVCC:** Readers never block writers and writers never block readers; each transaction sees a consistent snapshot based on transaction ID ($xmin/xmax$).`
  },
  {
    topic: "SQL Advanced Querying: Joins, Subqueries, CTEs & Window Functions",
    keywords: ["sql", "sql joins", "inner join", "outer join", "subqueries", "correlated subquery", "cte", "common table expressions", "window functions", "row_number", "rank", "dense_rank", "partition by"],
    summary: "Advanced SQL query engineering: complex joins, correlated subqueries, recursive CTEs, and analytical window functions for high-throughput reporting.",
    primaryLang: "SQL (PostgreSQL / MySQL)",
    placementDemand: "Backend Engineering & Data Analytics",
    content: `Advanced SQL Querying:
1. **Join Mechanics & Execution Plans:**
   • Inner, Left Outer, Right Outer, Full Outer, Cross, and Self Joins.
   • Database execution strategies: Nested Loop (small outer table with index), Hash Join (equi-joins on unsorted data), Merge Join (pre-sorted inputs).

2. **Common Table Expressions (CTEs):**
   • \`WITH cte_name AS (SELECT ...)\` improves query readability and modularity.
   • **Recursive CTEs:** Essential for tree/graph traversals (organizational hierarchies, bill of materials):
     \`\`\`sql
     WITH RECURSIVE Hierarchy AS (
       SELECT emp_id, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL
       UNION ALL
       SELECT e.emp_id, e.manager_id, h.level + 1
       FROM employees e JOIN Hierarchy h ON e.manager_id = h.emp_id
     ) SELECT * FROM Hierarchy;
     \`\`\`

3. **Window Functions (\`OVER (PARTITION BY ... ORDER BY ...)\`):**
   • Calculate running metrics without collapsing rows like \`GROUP BY\`.
   • **Ranking:** \`ROW_NUMBER()\` (strict 1,2,3), \`RANK()\` (ties skip: 1,1,3), \`DENSE_RANK()\` (ties don't skip: 1,1,2).
   • **Offsets:** \`LAG(col, 1)\` (previous row), \`LEAD(col, 1)\` (next row).
   • **Running Aggregates:** \`SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\`.`
  },
  {
    topic: "NoSQL, MongoDB Document Engineering & CAP Theorem",
    keywords: ["nosql", "mongodb", "bson", "crud", "aggregation pipeline", "cap theorem", "polyglot persistence", "eventual consistency", "sharding", "document database"],
    summary: "NoSQL paradigms, Brewer's CAP theorem, MongoDB BSON document design, the multi-stage aggregation pipeline, and polyglot persistence strategies.",
    primaryLang: "MongoDB & Node.js / Python",
    placementDemand: "Full-Stack Development & High-Scale Cloud Architecture",
    content: `NoSQL & MongoDB Engineering:
1. **CAP Theorem (Brewer's Theorem):**
   • In a distributed data store, you can guarantee at most two of three:
     - **Consistency (C):** Every read receives the most recent write or an error.
     - **Availability (A):** Every non-failing node returns a response (without guarantee it is latest).
     - **Partition Tolerance (P):** System continues operating despite dropped or delayed network packets.
   • Network partitions are inevitable in real networks $\\implies$ choose between **CP** (e.g. MongoDB, HBase) or **AP** (e.g. Cassandra, DynamoDB).

2. **MongoDB Document Model & BSON:**
   • Binary JSON (BSON) supports typed scalars, date/time, 64-bit integers, and binary data.
   • Schema Patterns: Embedding (1-to-few, atomic updates, zero joins) vs. Referencing (1-to-many, 1-to-squillions, preventing document size exceeding 16MB).

3. **MongoDB Aggregation Pipeline:**
   • Linear data transformation stages:
     \`$match\` (filter rows) $\\to$ \`$unwind\` (flatten arrays) $\\to$ \`$group\` (accumulate sums/averages) $\\to$ \`$project\` (shape output) $\\to$ \`$sort\` & \`$limit\`.

4. **Polyglot Persistence:**
   • Combining relational databases (PostgreSQL for transactional orders & payments) + NoSQL (MongoDB for user activity logs & catalogs) + In-memory (Redis for cache & sessions).`
  },
  {
    topic: "Vector Databases, Embeddings & Similarity Search (pgvector, Pinecone, RAG)",
    keywords: ["vector database", "embeddings", "similarity search", "cosine similarity", "ann", "hnsw", "ivf", "pgvector", "pinecone", "weaviate", "rag", "hybrid search"],
    summary: "Modern AI vector retrieval: dense vector embeddings, distance metrics (Cosine, Euclidean, Dot Product), Approximate Nearest Neighbor (ANN) index algorithms (HNSW, IVF), and production RAG integration.",
    primaryLang: "Python (LangChain / LlamaIndex) & pgvector",
    placementDemand: "GenAI Engineer, Machine Learning Engineer & Backend SDE",
    content: `Vector Database Engineering & ANN Search:
1. **Vector Embeddings & Distance Metrics:**
   • High-dimensional floating-point vectors ($\mathbb{R}^{768}$ or $\mathbb{R}^{1536}$) capturing semantic meaning.
   • **Metrics:**
     - *Cosine Similarity:* $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$ (measures angular orientation, range $[-1, 1]$).
     - *Euclidean Distance ($L_2$):* $\\sqrt{\\sum (u_i - v_i)^2}$ (magnitude matters).
     - *Inner Product (Dot Product):* $u \\cdot v$ (fastest when vectors are unit normalized).

2. **Approximate Nearest Neighbor (ANN) Indexing:**
   • Exact k-NN requires scanning every vector ($O(N \\cdot D)$), too slow for millions of vectors.
   • **IVF (Inverted File Index):** Clusters vectors with Voronoi cells (K-means centroids); search only probes nearby centroid lists.
   • **HNSW (Hierarchical Navigable Small World):** Multi-layer graph where upper layers skip long distances and bottom layers refine locally ($O(\\log N)$ query speed, industry standard).

3. **Implementation Tools:**
   • **pgvector (PostgreSQL extension):** Allows vector search directly in SQL:
     \`SELECT * FROM documents ORDER BY embedding <=> $query_embedding LIMIT 5;\` (\`<=>\` is cosine distance).
   • Dedicated stores: Pinecone (managed serverless), Weaviate (GraphQL + hybrid BM25/vector search), Milvus, Qdrant.
   • **Hybrid Search:** Reciprocal Rank Fusion (RRF) combining sparse keyword search (BM25) with dense vector retrieval.`
  },
  {
    topic: "Backend API Engineering with FastAPI: Pydantic, Async & Authentication",
    keywords: ["fastapi", "rest api", "pydantic", "openapi", "dependency injection", "async await", "jwt", "oauth2", "rbac", "rate limiting", "sqlalchemy"],
    summary: "High-performance Python backend engineering: ASGI asynchronous event loops, Pydantic type validation, automated OpenAPI docs, Depends() dependency injection, JWT/OAuth2 authentication, and layered service-repository patterns.",
    primaryLang: "Python (FastAPI, Pydantic, SQLAlchemy)",
    placementDemand: "Backend Engineer, Python Developer, AI Backend Lead",
    content: `FastAPI Architecture & Best Practices:
1. **FastAPI Core & ASGI Asynchronous Design:**
   • Built on Starlette and Pydantic; powered by \`uvicorn\` ASGI server.
   • \`async def\` endpoints handle I/O concurrency without blocking worker threads:
     \`\`\`python
     @app.get("/items/{item_id}", response_model=ItemResponse)
     async def read_item(item_id: int, db: AsyncSession = Depends(get_db)):
         return await item_service.get_item(db, item_id)
     \`\`\`

2. **Pydantic Validation & Serialization:**
   • Strict type checking, default values, and schema transformation at request boundaries.
   • Automatic Swagger UI (\`/docs\`) and ReDoc generation complying with OpenAPI v3.

3. **Dependency Injection (\`Depends\`):**
   • Clean inversion of control for database sessions, security contexts, caching, and configuration.

4. **Authentication & Security:**
   • **JWT (JSON Web Tokens):** Stateless token composed of \`Header.Payload.Signature\`.
   • Password hashing using \`bcrypt\` or \`argon2\`.
   • **RBAC (Role-Based Access Control):** Role verification dependencies protecting admin routes.
   • Rate limiting using Redis token-bucket algorithms.`
  },
  {
    topic: "Multi-Framework Backend: Node.js/Express, Spring Boot & .NET Core",
    keywords: ["nodejs", "express", "event loop", "socket.io", "redis", "spring boot", "ioc", "dependency injection", "spring security", "jpa", "hibernate", ".net core", "asp.net core"],
    summary: "Comparative multi-framework backend engineering: Node.js single-threaded event loop and real-time WebSockets, Java Spring Boot IoC container and JPA/Hibernate ORM, and .NET Core enterprise patterns.",
    primaryLang: "Node.js (TypeScript), Java (Spring Boot) & C# (.NET)",
    placementDemand: "Full-Stack Engineer, Enterprise Java/C# Developer",
    content: `Multi-Framework Backend Comparison:
1. **Node.js / Express Core:**
   • **Single-Threaded Event Loop:** Libuv manages asynchronous I/O via call stack, microtask queue (Promises), and macrotask queue (timers, I/O callbacks).
   • Real-Time with **Socket.io**: Bidirectional WebSocket connections with fallback polling.
   • Redis caching for session sharing and pub/sub message brokering.

2. **Spring Boot (Java Enterprise Standard):**
   • **Inversion of Control (IoC) & DI:** \`@Autowired\`, \`@Service\`, \`@Repository\`, \`@RestController\`.
   • **Spring Data JPA / Hibernate:** Object-Relational Mapping with automated queries and transaction boundary management (\`@Transactional\`).
   • **Spring Security:** Filter chains, JWT tokens, Method Security (\`@PreAuthorize\`).
   • **Actuator:** Production health checks, metrics, and Prometheus endpoints (\`/actuator/prometheus\`).

3. **ASP.NET Core (.NET Core):**
   • High-throughput cross-platform web framework; Entity Framework Core (EF Core) ORM with LINQ queries, built-in dependency injection container.`
  },
  {
    topic: "Microservices Architecture, API Gateway & Distributed Resilience",
    keywords: ["microservices", "api gateway", "service boundaries", "database per service", "saga pattern", "two phase commit", "2pc", "circuit breaker", "compensating transactions"],
    summary: "Microservices design patterns: domain-driven bounded contexts, Database-per-Service, centralized API Gateways, Saga orchestration/choreography for distributed transactions, and Circuit Breaker resilience.",
    primaryLang: "Distributed Systems & Cloud Architecture",
    placementDemand: "Systems Architect, Principal Engineer, Cloud SDE",
    content: `Microservices & Distributed Systems:
1. **Decomposition & Service Boundaries:**
   • Domain-Driven Design (DDD): Mapping microservices to **Bounded Contexts**.
   • **Database-per-Service Rule:** Services must never directly query another service's private database; communication occurs strictly over REST, gRPC, or asynchronous message queues (Kafka/RabbitMQ).

2. **API Gateway Pattern:**
   • Single entry point for clients (FastAPI, Kong, or Spring Cloud Gateway).
   • Responsibilities: Request routing, SSL termination, JWT token validation & header forwarding, centralized rate limiting, and response aggregation.

3. **Distributed Transactions: 2PC vs. Saga:**
   • **Two-Phase Commit (2PC):** Prepare phase + Commit phase; synchronous, high latency, single point of failure (locks distributed databases).
   • **Saga Pattern (Eventual Consistency):**
     - Sequence of local transactions where each step publishes an event triggering the next step.
     - If a step fails, the Saga executes **Compensating Actions** in reverse order to undo changes!
     - *Choreography:* Services publish/subscribe to events without central coordinator.
     - *Orchestration:* A dedicated orchestrator state machine directs services.

4. **Resilience Patterns:**
   • **Circuit Breaker (Closed $\\to$ Open $\\to$ Half-Open):** Trips when error rates spike to fail fast and prevent cascading system outages.
   • Retries with exponential backoff and randomized jitter.`
  },
  {
    topic: "Containerization, Kubernetes & Observability: Docker, K8s, Prometheus & CI/CD",
    keywords: ["docker", "dockerfile", "docker compose", "kubernetes", "k8s", "pods", "deployments", "services", "ingress", "opentelemetry", "prometheus", "grafana", "github actions", "ci/cd"],
    summary: "Modern DevOps delivery: multi-stage Docker builds, Kubernetes cluster primitives (Pods, Deployments, Services, Ingress), OpenTelemetry distributed tracing, Prometheus metrics, and automated GitHub Actions CI/CD pipelines.",
    primaryLang: "Docker, Kubernetes, YAML & GitHub Actions",
    placementDemand: "DevOps Engineer, SRE, Cloud Infrastructure Engineer",
    content: `Containerization, Orchestration & Observability:
1. **Docker Containerization:**
   • **Dockerfile Best Practices:** Multi-stage builds to minimize image footprint, non-root user execution, caching dependency layers before source code copy.
   • **Docker Compose:** Multi-container local orchestration defining networks, volumes, and environment variables.

2. **Kubernetes (K8s) Architecture & Primitives:**
   • **Control Plane:** API Server, etcd, Scheduler, Controller Manager.
   • **Worker Nodes:** Kubelet, Kube-proxy, Container Runtime.
   • **Core Objects:**
     - **Pod:** Smallest deployable unit sharing network namespace and storage.
     - **Deployment:** Declarative state manager providing rolling updates, rollbacks, and replica scaling.
     - **Service:** Stable IP and DNS name balancing traffic across ephemeral Pods (ClusterIP, NodePort, LoadBalancer).
     - **Ingress:** HTTP/HTTPS reverse proxy routing external domains to internal services.

3. **Observability (The 3 Pillars):**
   • **Metrics:** Prometheus pulling time-series counters and gauges; Grafana dashboards for visual alerts.
   • **Logs:** Structured JSON logging aggregated via Loki or ELK.
   • **Traces:** OpenTelemetry (OTel) context propagation across microservice calls with TraceID and SpanID.

4. **CI/CD & Security:**
   • GitHub Actions workflows: lint $\\to$ test $\\to$ image vulnerability scan (Trivy) $\\to$ push to container registry $\\to$ GitOps deployment (ArgoCD).`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 2: DATA STRUCTURES & ALGORITHMS II
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Binary Search Trees (BST), AVL Trees, Rotations & B-Trees",
    keywords: ["bst", "binary search tree", "avl tree", "tree rotations", "balance factor", "b-tree", "b+ tree", "database indexing", "tree traversal"],
    summary: "Hierarchical search data structures: BST invariants, AVL self-balancing rotations, complexity bounds, and multi-way B-Tree and B+ Tree architectures for database disk indexing.",
    primaryLang: "C++ / Java",
    placementDemand: "Core SDE Placements & Systems Engineering",
    content: `Advanced Tree Data Structures:
1. **Binary Search Tree (BST) & Invariants:**
   • For any node $x$: $\\text{LeftSubtree}(x) < x < \\text{RightSubtree}(x)$.
   • Inorder traversal yields strictly ascending sorted order.
   • Worst-case: Degenerates to $O(N)$ skew on already-sorted input.

2. **AVL Trees (Adelson-Velsky & Landis):**
   • Strict balance invariant: $|BF| = |Height(Left) - Height(Right)| \\le 1$.
   • **4 Rotations:**
     - LL Case: 1 Right Rotation.
     - RR Case: 1 Left Rotation.
     - LR Case: Left Rotate on left child $\\to$ Right Rotate on root.
     - RL Case: Right Rotate on right child $\\to$ Left Rotate on root.
   • Guarantees strictly $O(\\log N)$ worst-case search, insertion, and deletion.

3. **B-Tree & B+ Tree (Secondary Storage Indexing):**
   • Multi-way self-balancing search trees optimized for block storage reads (MySQL InnoDB, PostgreSQL).
   • Each node holds up to $M$ children and $M-1$ keys, keeping tree height extremely small (typically $\\le 4$ levels for millions of rows).
   • **B+ Tree Superiority:**
     - Internal nodes store *keys only* (maximizing branch factor per 4KB disk page).
     - All actual data records live in leaf nodes.
     - Leaf nodes are linked via a bidirectional doubly-linked list, enabling blazing fast $O(\\log N + K)$ range queries!`
  },
  {
    topic: "Range Query Structures: Segment Trees, Lazy Propagation & Fenwick Trees",
    keywords: ["segment tree", "range queries", "lazy propagation", "fenwick tree", "binary indexed tree", "bit", "range sum query", "rmq"],
    summary: "Advanced range query paradigms: Segment Trees for dynamic range queries and updates in O(log N), Lazy Propagation for range updates, and space-efficient Fenwick Trees (Binary Indexed Trees).",
    primaryLang: "C++ (Competitive Programming) & Java",
    placementDemand: "Top-Tier Tech Placements (FAANG/Tier-1 SDE)",
    content: `Segment Trees & Fenwick Trees:
1. **Segment Trees:**
   • Binary tree representing array intervals. Leaf nodes store single array items; internal nodes store aggregated metrics (Sum, Min, Max, GCD).
   • Array size: Requires up to $4N$ space.
   • **Query:** $O(\\log N)$ by recursively decomposing query range $[L, R]$ into $O(\\log N)$ canonical segments.
   • **Point Update:** $O(\\log N)$ updating leaf and re-evaluating parents.

2. **Lazy Propagation:**
   • Solves range updates (e.g. "Add $V$ to all indices in $[L, R]$") in $O(\\log N)$ instead of $O(N \\log N)$.
   • **Mechanism:** Postpone updates to children by saving pending increments in a \`lazy[]\` array. Push pending values down only when a child node is explicitly visited.

3. **Fenwick Tree (Binary Indexed Tree / BIT):**
   • Compact array-based representation storing prefix sums using bitwise properties:
     - Isolating lowest set bit: \`lowbit(x) = x & (-x)\`.
     - \`update(idx, val)\`: \`idx += idx & (-idx)\`.
     - \`query(idx)\`: \`idx -= idx & (-idx)\`.
   • **Space:** Strictly $O(N)$ (no tree pointers).
   • **Time:** Prefix sum and point update both strictly $O(\\log N)$ with tiny constant factors.`
  },
  {
    topic: "Graph Traversal, Minimum Spanning Trees (MST) & Shortest Path Algorithms",
    keywords: ["graph", "bfs", "dfs", "connected components", "union find", "dsu", "kruskal", "prim", "dijkstra", "bellman-ford", "floyd-warshall", "topological sort", "scc"],
    summary: "Comprehensive graph algorithms: BFS/DFS traversals, Disjoint Set Union (DSU), Kruskal's & Prim's MST, Dijkstra, Bellman-Ford, Floyd-Warshall shortest paths, Topological Sort, and Strongly Connected Components.",
    primaryLang: "C++ / Java / Python",
    placementDemand: "⭐⭐⭐⭐⭐ (Highest Priority SDE Interview Domain)",
    content: `Graph Engineering & Algorithms:
1. **Representations & Traversals:**
   • Adjacency List ($O(V + E)$ space) vs. Adjacency Matrix ($O(V^2)$ space).
   • **BFS (Queue):** Shortest path in unweighted graphs ($O(V + E)$).
   • **DFS (Stack/Recursion):** Cycle detection, pathfinding, connected components.

2. **Disjoint Set Union (DSU / Union-Find):**
   • Manages partitions of elements.
   • Optimizations: **Path Compression** + **Union by Rank/Size**.
   • Amortized time per operation: $O(\\alpha(N))$ (nearly constant time via inverse Ackermann function).

3. **Minimum Spanning Trees (MST):**
   • **Kruskal's Algorithm:** Sort edges by weight ($O(E \\log E)$) and greedily add edges that do not form a cycle using DSU.
   • **Prim's Algorithm:** Start from arbitrary node, expand frontier using a Priority Queue / Min-Heap ($O(E \\log V)$).

4. **Shortest Path Algorithms:**
   • **Dijkstra's Algorithm:** Non-negative edge weights; greedily extracts minimum distance node with Min-Heap ($O((V + E) \\log V)$).
   • **Bellman-Ford Algorithm:** Handles negative edge weights; relaxes all edges $V-1$ times; detects negative weight cycles in $O(V \\cdot E)$.
   • **Floyd-Warshall Algorithm:** All-pairs shortest path in $O(V^3)$ using DP recurrence:
     $$dist[i][j] = \\min(dist[i][j], dist[i][k] + dist[k][j])$$.

5. **Directed Graphs: Topological Sort & SCC:**
   • **Topological Sort (Kahn's Algorithm / In-degree BFS):** DAG task dependency ordering.
   • **Strongly Connected Components:** Tarjan's (low-link values) and Kosaraju's (transpose graph + dual DFS) in $O(V + E)$.`
  },
  {
    topic: "Sorting Algorithms, Divide & Conquer, Greedy & Dynamic Programming",
    keywords: ["merge sort", "quick sort", "heap sort", "radix sort", "counting sort", "divide and conquer", "greedy algorithms", "fractional knapsack", "0/1 knapsack", "lcs", "lis", "matrix chain multiplication", "edit distance"],
    summary: "Algorithmic paradigms: divide-and-conquer sorting, linear-time distribution sorts, greedy optimization strategies, and dynamic programming memoization vs tabulation trade-offs.",
    primaryLang: "C++ / Java / Python",
    placementDemand: "Core LeetCode & Competitive Programming",
    content: `Algorithmic Paradigms & Decision Making:
1. **Sorting Complexity & Invariants:**
   • **Merge Sort:** Guaranteed $O(N \\log N)$ divide-and-conquer; stable; requires $O(N)$ auxiliary memory.
   • **Quick Sort:** Average $O(N \\log N)$, in-place, cache-friendly; worst-case $O(N^2)$ mitigated by randomized pivot selection.
   • **Heap Sort:** $O(N \\log N)$ in-place using Max-Heap; unstable.
   • **Linear Sorts:** Counting Sort & Radix Sort achieve $O(N + K)$ when input ranges are bounded.

2. **Greedy Design Strategy:**
   • Makes locally optimal choice at each step; requires **Greedy Choice Property** and **Optimal Substructure**.
   • Examples: Fractional Knapsack (sort by value/weight ratio), Huffman Coding, Activity Selection.

3. **Dynamic Programming (DP):**
   • Required when subproblems **overlap**.
   • **0/1 Knapsack:** $DP[i][w] = \\max(DP[i-1][w], DP[i-1][w - wt[i]] + val[i])$.
   • **Longest Common Subsequence (LCS):** $DP[i][j] = DP[i-1][j-1] + 1$ if chars match, else $\\max(DP[i-1][j], DP[i][j-1])$.
   • **Longest Increasing Subsequence (LIS):** $O(N^2)$ DP or $O(N \\log N)$ using patience sort with binary search (\`std::lower_bound\`).
   • **Edit Distance (Wagner-Fischer):** Minimum insertions, deletions, substitutions to convert string $A \\to B$.`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 3: ARTIFICIAL INTELLIGENCE: PROBLEM SOLVING & SEARCH
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "AI Agent Foundations: PEAS Model, Environments & Problem Formulation",
    keywords: ["ai agent", "peas", "performance measure", "environment", "actuators", "sensors", "state space", "transition model", "knowledge representation"],
    summary: "Foundations of intelligent agents: Russell & Norvig's PEAS framework, environment classifications, formal state space problem formulation, and knowledge representations.",
    primaryLang: "Python (AI Core)",
    placementDemand: "AI Engineer, Robotics Software, Intelligent Systems",
    content: `Intelligent Agents & Problem Formulation:
1. **The PEAS Framework:**
   • **P - Performance Measure:** Objective criteria for success (e.g. passenger safety, travel time, fuel efficiency for an autonomous taxi).
   • **E - Environment:** The operating domain (roads, traffic, pedestrians, weather).
   • **A - Actuators:** Mechanisms to effect change (steering wheel, brakes, throttle, indicator).
   • **S - Sensors:** Input data streams (cameras, LiDAR, radar, GPS, speedometer).

2. **Environment Classifications:**
   • *Fully Observable vs. Partially Observable:* Can sensors detect complete system state?
   • *Deterministic vs. Stochastic:* Does the next state depend solely on current state and agent action?
   • *Episodic vs. Sequential:* Do current decisions affect all subsequent choices?
   • *Static vs. Dynamic:* Does the world change while the agent is deliberating?
   • *Discrete vs. Continuous:* Are states, time, and actions finite or continuous real values?
   • *Single-Agent vs. Multi-Agent:* Competitive (Chess) or Cooperative (Fleet routing).

3. **Formal Problem Formulation:**
   • **Initial State:** $s_0$.
   • **Actions Available:** $ACTIONS(s)$.
   • **Transition Model:** $RESULT(s, a)$.
   • **Goal Test:** $IS\\_GOAL(s)$.
   • **Path Cost:** $c(s, a, s')$.`
  },
  {
    topic: "Uninformed & Informed Search: BFS, DFS, UCS, A* & Heuristic Design",
    keywords: ["informed search", "uninformed search", "bfs", "dfs", "uniform cost search", "ucs", "a*", "a-star", "heuristic", "admissibility", "consistency", "ida*"],
    summary: "State-space graph search: BFS/DFS, Uniform Cost Search (Dijkstra variant), A* algorithm, heuristic mathematical criteria (admissibility, consistency), and memory-bounded variants.",
    primaryLang: "Python (Heaps & Dataclasses)",
    placementDemand: "AI Pathfinding, Game Engine Dev, Robotics Planning",
    content: `State Space Search & Heuristics:
1. **Uninformed (Blind) Search:**
   • **BFS:** Explores shallowest nodes first; optimal for uniform step costs; space complexity $O(b^d)$ (severe memory bottleneck).
   • **DFS:** Explores deepest branches first; space complexity $O(b \\cdot m)$; can get trapped in infinite paths.
   • **Uniform Cost Search (UCS):** Expands node with lowest path cost $g(n)$ using Min-Priority Queue.

2. **Informed (Heuristic) Search & A* Algorithm:**
   • Evaluation function: $f(n) = g(n) + h(n)$
     - $g(n)$: Exact accumulated path cost from start to $n$.
     - $h(n)$: Estimated heuristic cost from $n$ to closest goal.
   • **Admissibility Condition:** $h(n) \\le h^*(n)$ for all $n$ ($h$ never overestimates true remaining cost). Guarantees A* tree search optimality!
   • **Consistency (Monotonicity) Condition:** For every node $n$ and successor $n'$:
     $$h(n) \\le c(n, a, n') + h(n')$$
     (Satisfies triangle inequality). Guarantees A* graph search optimality without reopening closed nodes!

3. **Empirical Evaluation & Memory Bounds:**
   • Metrics: Node expansions, peak memory footprint, effective branching factor $b^*$.
   • **IDA* (Iterative Deepening A*):** Reduces memory to $O(b \\cdot d)$ by using $f(n)$ cost thresholds instead of depth limits.`
  },
  {
    topic: "Constraint Satisfaction Problems (CSP): Backtracking, AC-3 & Heuristics",
    keywords: ["csp", "constraint satisfaction", "backtracking", "forward checking", "ac-3", "arc consistency", "mrv", "minimum remaining values", "lcv", "min-conflicts"],
    summary: "Constraint Satisfaction Problems: variable-domain-constraint modeling, backtracking search, constraint propagation (AC-3 arc consistency), variable ordering heuristics (MRV, Degree), and local search.",
    primaryLang: "Python (CSP Solvers)",
    placementDemand: "Operations Research, Automated Scheduling, SAT Solvers",
    content: `CSP Modeling & Propagation:
1. **Formal CSP Definition:**
   • Variables $X = \\{X_1, X_2, \\dots, X_n\\}$.
   • Domains $D = \\{D_1, D_2, \\dots, D_n\\}$ of allowable values.
   • Constraints $C = \\{C_1, C_2, \\dots, C_m\\}$ specifying allowable tuples (Unary, Binary, Global e.g. \`AllDifferent\`).

2. **Constraint Propagation & Arc Consistency (AC-3):**
   • Arc $(X_i, X_j)$ is **consistent** if for every value $x \\in D_i$, there exists an allowed value $y \\in D_j$.
   • **AC-3 Algorithm:** Maintains a queue of arcs. If removing inconsistent values shrinks $D_i$, re-enqueue all incoming neighbor arcs $(X_k, X_i)$ until queue is empty or domain collapses ($O(c \\cdot d^3)$).

3. **Search Heuristics:**
   • **MRV (Minimum Remaining Values / "Fail-First"):** Choose variable with fewest legal values left.
   • **Degree Heuristic:** Choose variable involved in largest number of constraints with unassigned variables (tie-breaker for MRV).
   • **LCV (Least Constraining Value / "Fail-Last"):** Choose value that rules out fewest choices for neighboring variables.

4. **Local Search for CSP (Min-Conflicts):**
   • Start with complete (possibly invalid) assignment; greedily change variable to value that violates minimum number of constraints (handles million-queen problem in seconds).`
  },
  {
    topic: "Adversarial Search & Game Playing: Minimax, Alpha-Beta Pruning & Expectimax",
    keywords: ["adversarial search", "minimax", "alpha-beta pruning", "game playing", "evaluation function", "depth limits", "iterative deepening", "expectimax"],
    summary: "Competitive multi-agent decision making: two-player zero-sum games, Minimax decision rule, Alpha-Beta pruning optimization, static evaluation functions, and stochastic games with Expectimax.",
    primaryLang: "Python / C++",
    placementDemand: "Game AI, Strategic Decision Systems, Autonomous Agents",
    content: `Adversarial Search & Games:
1. **Minimax Algorithm (Zero-Sum Games):**
   • Two players: **MAX** (seeks highest utility) and **MIN** (seeks lowest utility).
   • Recurrence:
     $$V(s) = \\begin{cases} \\text{Utility}(s) & \\text{if Terminal}(s) \\\\ \\max_{a} V(RESULT(s, a)) & \\text{if Player}(s) = MAX \\\\ \\min_{a} V(RESULT(s, a)) & \\text{if Player}(s) = MIN \\end{cases}$$
   • Time complexity: $O(b^m)$, Space: $O(b \\cdot m)$.

2. **Alpha-Beta Pruning:**
   • Mathematically eliminates branches that cannot possibly influence the final decision:
     - $\\alpha$: Best (highest-value) choice found so far along path for MAX.
     - $\\beta$: Best (lowest-value) choice found so far along path for MIN.
   • **Pruning Rule:** Prune subtree whenever $\\alpha \\ge \\beta$.
   • **Efficiency:** With optimal move ordering, cuts effective branching factor from $b$ to $\\sqrt{b}$, doubling search depth!

3. **Heuristic Depth Limits & Expectimax:**
   • Real games (Chess, Go) cannot reach terminal leaves $\\implies$ cut off search at depth $d$ and evaluate using heuristic evaluation function.
   • **Expectimax:** For games with chance/dice; introduces chance nodes computing expected value: $\\sum P(outcome) \\cdot Value(outcome)$.`
  },
  {
    topic: "Probabilistic Reasoning & Uncertainty: Bayesian Networks & Hidden Markov Models",
    keywords: ["bayes theorem", "bayesian network", "cpt", "variable elimination", "belief propagation", "markov chain", "hidden markov model", "hmm", "sensor fusion"],
    summary: "Reasoning under uncertainty: Bayes' Rule, Directed Acyclic Graph Bayesian Networks, Conditional Probability Tables (CPT), exact inference by Variable Elimination, and Hidden Markov Models (HMMs).",
    primaryLang: "Python (NumPy / SciPy / pgmpy)",
    placementDemand: "Robotics, Probabilistic AI, Sensor Fusion Engineer",
    content: `Uncertainty & Probabilistic Inference:
1. **Bayes' Rule & Conditional Probability:**
   $$P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}$$
   • Transforms prior probabilities into updated posterior beliefs based on noisy evidence.

2. **Bayesian Networks:**
   • Directed Acyclic Graph (DAG) where nodes represent random variables and directed edges represent direct conditional dependencies.
   • Each node $X_i$ has a **Conditional Probability Table (CPT)** $P(X_i \\mid Parents(X_i))$.
   • **Full Joint Distribution Factorization:**
     $$P(X_1, \\dots, X_n) = \\prod_{i=1}^n P(X_i \\mid Parents(X_i))$$
   • Massive exponential parameter reduction: An $n$-variable boolean system with bounded in-degree $k$ requires $O(n \\cdot 2^k)$ probabilities instead of $2^n$!

3. **Inference Algorithms:**
   • **Variable Elimination:** Exact inference by interleaving factor multiplications and summations of non-query hidden variables.
   • **Approximate Inference:** Rejection Sampling, Likelihood Weighting, and Markov Chain Monte Carlo (MCMC).

4. **Hidden Markov Models (HMMs) for Tracking:**
   • Models dynamic systems with hidden state $X_t$ and noisy sensor observations $E_t$.
   • Three canonical problems: Filtering (Forward algorithm), Smoothing (Forward-Backward), Most Likely Explanation (Viterbi algorithm).`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 4 & 7: GERMAN LANGUAGE A1 (FOUNDATIONS & WORKPLACE ROUTINE)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "German Language A1: Foundations, Alphabet, Numbers & Present Tense",
    keywords: ["german a1", "deutsch a1", "begrüßung", "german alphabet", "die zahlen", "addition", "subtraktion", "personalpronomen", "sein form", "haben form", "konjugation im präsens", "die artikel"],
    summary: "German A1 fundamentals: greetings, phonetic alphabet, numbers & arithmetic, personal pronouns, irregular auxiliary verbs 'sein' & 'haben', regular/irregular present tense conjugation, and gendered articles.",
    primaryLang: "German Language (Deutsch A1)",
    placementDemand: "International Careers, Germany Masters/Work Visa (Goethe A1)",
    content: `German A1 Foundations & Essential Grammar:
1. **Greetings & Basic Communication (Begrüßung & Höflichkeit):**
   • *Hallo!* (Hello), *Guten Morgen* (Good morning), *Guten Tag* (Good day), *Guten Abend* (Good evening).
   • *Auf Wiedersehen!* (Formal goodbye), *Tschüss!* (Informal bye).
   • *Wie geht es Ihnen?* (Formal: How are you?), *Wie geht's?* (Informal).
   • *Danke, gut!* (Thanks, good), *Bitte* (Please / You're welcome), *Entschuldigung* (Excuse me).

2. **Alphabet & Phonetics:**
   • Umlauts: **ä** [ɛ:], **ö** [ø:], **ü** [y:], **ß** (Eszett / sharp s).
   • Diphthongs: **ei/ai** = "eye" (zwei), **eu/äu** = "oy" (Euro), **ie** = long "ee" (sie).
   • Consonants: **w** sounds like English "v", **v** sounds like English "f", **j** sounds like English "y", **z** sounds like "ts".

3. **Numbers & Math (Die Zahlen & Grundrechenarten):**
   • 0–12: null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf.
   • 13–19: dreizehn ... neunzehn.
   • 20+: einundzwanzig (one-and-twenty), dreißig, vierzig, fünfzig, hundert.
   • Math: $+ (plus), - (minus), \\times (mal), \\div (geteilt durch), = (ist gleich)$.

4. **Personal Pronouns & Essential Auxiliary Verbs:**
   | Pronoun | sein (to be) | haben (to have) |
   |---|---|---|
   | **ich** (I) | bin | habe |
   | **du** (you, informal) | bist | hast |
   | **er / sie / es** (he/she/it) | ist | hat |
   | **wir** (we) | sind | haben |
   | **ihr** (you all) | seid | habt |
   | **sie / Sie** (they / formal You) | sind | haben |

5. **Regular Verb Conjugation (Präsens):**
   • Remove infinitive \`-en\` and add: ich \`-e\`, du \`-st\`, er/sie/es \`-t\`, wir \`-en\`, ihr \`-t\`, sie/Sie \`-en\`.
   • *Example (lernen):* ich lerne, du lernst, er lernt, wir lernen, ihr lernt, sie lernen.

6. **Articles & Negation:**
   • Definite: **der** (masculine), **die** (feminine), **das** (neuter), **die** (plural).
   • Indefinite: **ein** (m), **eine** (f), **ein** (n).
   • Negation: **nicht** (negates verbs/adjectives) vs. **kein / keine** (negates nouns with indefinite/zero article).`
  },
  {
    topic: "German Language A1: Workplace, Daily Routine, Cases & Goethe A1 Exam",
    keywords: ["büroalltag", "arbeitsplatz", "dativ", "akkusativ", "wechselpräpositionen", "modalverben", "perfekt", "partizip ii", "trennbare verben", "goethe zertifikat a1"],
    summary: "Comprehensive German A1 applied communication: office routine (Büroalltag), professions, body parts, accusative vs dative cases, two-way prepositions, modal verbs, conversational past (Perfekt), and Goethe-Zertifikat A1 exam strategies.",
    primaryLang: "German Language (Deutsch A1 / Goethe-Institut)",
    placementDemand: "DAAD Scholarships, German Tech Placements (Siemens, Bosch, BMW)",
    content: `German A1 Applied Communication & Advanced Grammar:
1. **Workplace & Daily Life Vocabulary (Büro & Alltag):**
   • **Der Arbeitsplatz:** der Computer, der Schreibtisch, der Drucker, die E-Mail, das Büro, das Meeting.
   • **Berufe:** der Ingenieur / die Ingenieurin, der Arzt / die Ärztin, der Entwickler / die Entwicklerin.
   • **Wohnen & Zimmer:** das Wohnzimmer, die Küche, das Bad, die Möbel (der Tisch, der Stuhl, das Bett).

2. **Cases (Kasus): Nominative, Accusative & Dative:**
   • **Nominative (Subject):** der / ein, die / eine, das / ein, die / -.
   • **Accusative (Direct Object / Question: Wen? Was?):**
     - *Only masculine changes:* **den / einen**. Feminine, neuter, and plural remain unchanged!
     - *Prepositions with Accusative:* **durch, für, gegen, ohne, um** (DOGFU).
   • **Dative (Indirect Object / Question: Wem?):**
     - Masculine: **dem / einem**, Neuter: **dem / einem**, Feminine: **der / einer**, Plural: **den + n**.
     - *Prepositions with Dative:* **aus, bei, mit, nach, seit, von, zu** (ABMN-SVZ).

3. **Two-Way Prepositions (Wechselpräpositionen):**
   • **an, auf, hinter, in, neben, über, unter, vor, zwischen**.
   • **Rule:**
     - **Wohin? (Movement / Destination) $\\implies$ AKKUSATIV** (*"Ich gehe in die Küche"*).
     - **Wo? (Stationary Location) $\\implies$ DATIV** (*"Ich bin in der Küche"*).

4. **Modal Verben (sollen, müssen, dürfen, können, wollen, möchten):**
   • Modal verb is conjugated in position 2; infinitive moves to the very **end of the sentence**:
     *"Ich **muss** heute einen Bericht **schreiben**."*

5. **Conversational Past Tense (Das Perfekt):**
   • Formed with: \`haben / sein\` (conjugated) $+$ \`Partizip II\` (at end of sentence).
   • **sein** used for verbs of movement (gehen, fahren) or change of state (aufwachen, sterben):
     *"Ich **bin** nach Berlin **gefahren**."*
   • **haben** used for transitive and stationary verbs:
     *"Er **hat** den Code **getestet**."*

6. **Goethe-Zertifikat A1 Exam Blueprint:**
   • **Hören (Listening - 20 min):** Short everyday dialogues and announcements.
   • **Lesen (Reading - 25 min):** Short emails, notices, signs, schedules.
   • **Schreiben (Writing - 20 min):** Fill out a registration form (Formular) + write a 30-word short email.
   • **Sprechen (Speaking - 15 min):** Self-introduction (Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby) + ask and answer questions using picture cards.`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 5: DATA SCIENCE & BUSINESS ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Data Science Foundations, Data Lifecycle & Exploratory Data Cleaning",
    keywords: ["data science", "structured data", "unstructured data", "data lifecycle", "missing values", "duplicates", "outliers", "data transformation", "feature preparation", "eda"],
    summary: "Foundations of data science: structured vs unstructured modalities, the 5-stage data lifecycle, missing data imputation, duplicate deduction, outlier detection (IQR & Z-score), and feature preparation.",
    primaryLang: "Python (Pandas, NumPy)",
    placementDemand: "Data Analyst, Business Analyst, Junior Data Scientist",
    content: `Data Science Lifecycle & Cleaning Engineering:
1. **Data Taxonomy:**
   • **Structured:** Tabular relational data with defined schemas (SQL, CSV).
   • **Semi-Structured:** Self-describing data with hierarchical tags (JSON, XML).
   • **Unstructured:** Free-form data without tabular schema (Text, Audio, Video, Satellite imagery).

2. **The 5-Stage Data Lifecycle:**
   • **Collection $\\to$ Cleaning/Preparation $\\to$ Exploratory Analysis (EDA) $\\to$ Modeling/Interpretation $\\to$ Storytelling/Reporting.**

3. **Data Cleaning Techniques:**
   • **Missing Values (MCAR, MAR, MNAR):**
     - Deletion: Listwise (drops entire row, risky if data is scarce) vs. Pairwise.
     - Imputation: Mean/Median (robust to skew), Mode (categorical), K-NN / Iterative regression imputation.
   • **Duplicates:** Exact row duplicates vs. semantic duplicates (fuzzy string matching).
   • **Outlier Detection:**
     - **IQR Method:** Outlier if $x < Q_1 - 1.5 \\times IQR$ or $x > Q_3 + 1.5 \\times IQR$.
     - **Z-Score Method:** Outlier if $|Z| = \\left|\\frac{x - \\mu}{\\sigma}\\right| > 3$ (assumes normal distribution).`
  },
  {
    topic: "Inferential Statistics, Probability Distributions & Hypothesis Testing",
    keywords: ["statistics", "measures of central tendency", "dispersion", "normal distribution", "central limit theorem", "hypothesis testing", "p-value", "z-test", "t-test", "chi-square", "type i error"],
    summary: "Applied statistical inference: central tendency and dispersion metrics, the Central Limit Theorem, probability distributions, confidence intervals, p-values, z-test, t-test, and chi-square significance testing.",
    primaryLang: "Python (SciPy, Statsmodels) & R",
    placementDemand: "Quantitative Analyst, Data Scientist, Research Engineer",
    content: `Statistical Foundations & Hypothesis Testing:
1. **Measures of Center & Spread:**
   • Mean (sensitive to outliers), Median (robust), Mode.
   • Variance ($\\sigma^2 = \\frac{1}{N}\\sum (x_i - \\mu)^2$), Standard Deviation ($\\sigma$), IQR ($Q_3 - Q_1$).

2. **Probability Distributions & Central Limit Theorem (CLT):**
   • **Distributions:** Bernoulli, Binomial ($P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$), Normal ($\mathcal{N}(\\mu, \\sigma^2)$).
   • **Central Limit Theorem:** Regardless of underlying population distribution, the distribution of sample means approaches a normal distribution as sample size $n \\ge 30$!

3. **Hypothesis Testing Framework:**
   • $H_0$ (Null Hypothesis: No effect / status quo) vs. $H_1$ (Alternative Hypothesis: Significant effect).
   • **Errors:**
     - **Type I Error ($\\alpha$):** False Positive (rejecting true $H_0$). Controlled by significance level (typically $0.05$).
     - **Type II Error ($\\beta$):** False Negative (failing to reject false $H_0$). Statistical Power $= 1 - \\beta$.
   • **p-value:** The probability of observing results at least as extreme as current data assuming $H_0$ is true. If $p < \\alpha \\implies$ Reject $H_0$!

4. **Canonical Tests:**
   • **Z-Test:** Comparing sample mean when population variance $\\sigma^2$ is known and $n \\ge 30$.
   • **Student's t-Test:** Population variance unknown; One-sample, Two-sample independent, and Paired t-test.
   • **Chi-Square ($\\chi^2$) Test:** Tests of independence between categorical variables: $\\sum \\frac{(O - E)^2}{E}$.`
  },
  {
    topic: "Regression Analysis, Multicollinearity & Data Storytelling Metrics",
    keywords: ["linear regression", "multiple regression", "ols", "regression assumptions", "residuals", "multicollinearity", "vif", "mse", "rmse", "mae", "r2", "data storytelling"],
    summary: "Parametric predictive modeling: Ordinary Least Squares (OLS) regression, Gauss-Markov assumptions, multicollinearity diagnostics (VIF), residual analysis, evaluation metrics (RMSE, MAE, R²), and executive data storytelling.",
    primaryLang: "Python (scikit-learn, statsmodels, Seaborn)",
    placementDemand: "Business Intelligence, Data Analytics Lead, ML Scientist",
    content: `Regression Analysis & Insight Delivery:
1. **Ordinary Least Squares (OLS) Regression:**
   $$Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + \\dots + \\epsilon$$
   • Minimizes the sum of squared residuals: $SSR = \\sum (y_i - \\hat{y}_i)^2$.

2. **Gauss-Markov Assumptions (BLUE - Best Linear Unbiased Estimator):**
   • Linearity in parameters.
   • Random sampling of observations.
   • No perfect multicollinearity.
   • Zero conditional mean of errors: $\mathbb{E}(\\epsilon \\mid X) = 0$.
   • **Homoscedasticity:** Constant variance of error terms (checked via residual plots vs fitted values).
   • No autocorrelation of error terms (Durbin-Watson test).

3. **Multicollinearity & Variance Inflation Factor (VIF):**
   • When independent variables are highly correlated with each other, coefficient estimates become unstable and standard errors inflate.
   • $VIF_i = \\frac{1}{1 - R_i^2}$. If $VIF > 5$ or $10 \\implies$ severe multicollinearity; resolve by dropping correlated feature or using Ridge regression.

4. **Model Evaluation Metrics:**
   • **MAE (Mean Absolute Error):** $\\frac{1}{n}\\sum |y_i - \\hat{y}_i|$ (interpretable, robust to extreme outliers).
   • **MSE / RMSE:** $\\sqrt{\\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2}$ (penalizes large errors heavily).
   • **R-Squared ($R^2$):** Proportion of variance explained by model ($1 - \\frac{SS_{res}}{SS_{tot}}$).
   • **Adjusted $R^2$:** Penalizes adding useless variables that don't improve fit.`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 6: MACHINE LEARNING SYSTEMS (PLACEMENTPREDICT)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Machine Learning System Lifecycle & PlacementPredict Architecture",
    keywords: ["placementpredict", "ml lifecycle", "supervised learning", "training serving skew", "feature store", "feast", "model registry", "monitoring drift", "retraining loop"],
    summary: "Production ML engineering using the PlacementPredict case study: end-to-end ML lifecycle from ingestion to retraining, training-serving skew mitigation, and feature store offline/online split.",
    primaryLang: "Python (FastAPI, Scikit-Learn, Feast, MLflow)",
    placementDemand: "Machine Learning Engineer (MLE), MLOps Specialist",
    content: `PlacementPredict Production ML Architecture:
1. **The 8-Stage Production ML Lifecycle:**
   • Raw Data Ingestion $\\to$ Feature Engineering Module $\\to$ Training Pipeline $\\to$ Model Registry (MLflow) $\\to$ Containerized Packaging (Docker/ONNX) $\\to$ Inference Service (FastAPI) $\\to$ Telemetry Monitoring (Evidently / Prometheus) $\\to$ Retraining Loop.

2. **The Training-Serving Boundary & Skew:**
   • **Training-Serving Skew** is the #1 silent killer of production ML models:
     - *Cause A:* Discrepancy in data processing code between training notebooks (Pandas batch) and production serving (FastAPI single request).
     - *Cause B:* Data leakage during training (using future information not available at inference time).
     - *Solution:* Centralized Feature Stores (e.g. **Feast**) maintaining single point-of-truth feature definitions with point-in-time correctness.

3. **Inference Latency Trade-offs:**
   • Batch Prediction (daily/hourly offline bulk scoring) vs. Online Real-Time Prediction (sub-50ms REST/gRPC endpoint).`
  },
  {
    topic: "Supervised Learning: Regularized Linear Models & Tree-Based Ensembles",
    keywords: ["linear regression", "logistic regression", "ridge", "lasso", "l1", "l2", "elastic net", "decision tree", "random forest", "xgboost", "lightgbm", "shap", "feature importance"],
    summary: "Supervised algorithms from first principles: Ridge (L2) and Lasso (L1 sparsity) regularized models, Decision Tree splitting criteria (Gini/Entropy), Random Forest bagging, and industrial Gradient Boosted Trees (XGBoost/LightGBM).",
    primaryLang: "Python (Scikit-Learn, XGBoost, LightGBM)",
    placementDemand: "Core ML Interviews & Kaggle Competitions",
    content: `Supervised Learning Algorithms:
1. **Regularization Mechanics (Ridge vs. Lasso):**
   • **Ridge (L2):** Adds penalty $\\lambda \\sum \\beta_j^2$. Shrinks coefficients toward zero; preserves all features; handles multicollinearity.
   • **Lasso (L1):** Adds penalty $\\lambda \\sum |\\beta_j|$. Due to diamond geometric contour, sets coefficients strictly to zero, performing **automatic feature selection**!
   • **Elastic Net:** Combines L1 and L2 penalties via mixing parameter $\\alpha$.

2. **Logistic Regression (Classification):**
   • Maps linear equation through sigmoid activation: $\\sigma(z) = \\frac{1}{1 + e^{-z}}$.
   • Cost function: Binary Cross-Entropy (Log-Loss):
     $$J(\\theta) = -\\frac{1}{m}\\sum [y \\log(\\hat{y}) + (1-y) \\log(1-\\hat{y})]$$

3. **Tree-Based Models:**
   • **Decision Trees:** Recursive greedy partitioning using Gini Impurity ($1 - \\sum p_i^2$) or Shannon Entropy ($-\\sum p_i \\log_2 p_i$). Pruned via Cost-Complexity Pruning (CCP).
   • **Random Forests (Bagging):** Bootstrap aggregation (trains $B$ trees on bootstrap samples) $+$ random feature subsampling ($\sqrt{p}$ features per split). Drastically reduces variance without increasing bias!
   • **Gradient Boosted Trees (XGBoost & LightGBM):**
     - Builds trees sequentially, where each new tree fits the negative gradient (pseudo-residuals) of the loss function.
     - XGBoost uses second-order Taylor expansion (gradients & Hessians) and histogram-based splitting.
     - LightGBM uses Leaf-wise tree growth and GOSS (Gradient-based One-Side Sampling) for ultra-fast training on tabular data.`
  },
  {
    topic: "Unsupervised Learning, Dimensionality Reduction & Clustering",
    keywords: ["k-means", "lloyd algorithm", "elbow method", "silhouette score", "hierarchical clustering", "dbscan", "pca", "t-sne", "umap", "anomaly detection", "isolation forest"],
    summary: "Unsupervised learning paradigms: K-Means Lloyd algorithm, Hierarchical linkage, density-based DBSCAN, linear PCA, non-linear manifold learning (t-SNE/UMAP), and Isolation Forest anomaly detection.",
    primaryLang: "Python (Scikit-Learn)",
    placementDemand: "Data Mining, Pattern Recognition & ML Research",
    content: `Unsupervised Learning & Dimensionality Reduction:
1. **K-Means Clustering:**
   • Minimizes within-cluster sum of squares (Inertia).
   • **K-Means++ Initialization:** Picks initial centers with probability proportional to squared distance from existing centers, preventing poor local minima.
   • **Selecting K:** Elbow curve (inflection point of inertia) and **Silhouette Score** ($s = \\frac{b - a}{\\max(a, b)}$, values close to $+1$ indicate tight, well-separated clusters).

2. **DBSCAN (Density-Based Spatial Clustering of Applications with Noise):**
   • Parameters: $\\epsilon$ (neighborhood radius) and $minPts$.
   • Points: Core points ($\ge minPts$ neighbors), Border points, and Noise/Outliers.
   • **Major Advantage:** Can discover clusters of arbitrary, non-convex shapes and naturally isolates noise without forcing every point into a cluster.

3. **Dimensionality Reduction (PCA vs. t-SNE / UMAP):**
   • **PCA (Principal Component Analysis):** Orthogonal linear transformation projecting data onto directions of maximal variance (Eigenvectors of covariance matrix).
   • **t-SNE & UMAP:** Non-linear manifold learning strictly for **2D/3D visualization**; preserves local neighborhood topology (distances across global clusters in t-SNE space are NOT meaningful).

4. **Anomaly Detection:**
   • **Isolation Forest:** Builds random partition trees; anomalies require significantly fewer splits to isolate near the tree root ($O(\\log N)$ path length).`
  },
  {
    topic: "ML Model Evaluation, Cross-Validation & Probability Calibration",
    keywords: ["model evaluation", "cross validation", "stratified k-fold", "roc auc", "pr auc", "f1 score", "confusion matrix", "probability calibration", "platt scaling", "data drift", "concept drift"],
    summary: "Rigorous ML model validation: three-way train/val/test split, stratified cross-validation, imbalanced classification metrics (PR-AUC, ROC-AUC), Platt probability calibration, and production drift detection.",
    primaryLang: "Python (Scikit-Learn, Evidently)",
    placementDemand: "Senior ML Engineer, Applied AI Researcher",
    content: `Model Evaluation, Calibration & Monitoring:
1. **Split Discipline & Cross-Validation:**
   • The golden rule: **The test set must NEVER touch any feature selection, scaling, or hyperparameter decisions.**
   • **Stratified K-Fold:** Ensures class label proportions are identical across all $k$ folds (essential for imbalanced datasets).
   • **Nested Cross-Validation:** Inner loop for hyperparameter search, outer loop for unbiased generalization error estimation.

2. **Classification Metrics for Imbalanced Datasets:**
   • *Accuracy is a trap:* In 99% fraud detection, a dummy model predicting "no fraud" achieves 99% accuracy but is 100% useless!
   • **Precision:** $\\frac{TP}{TP + FP}$ (Cost of false alarms).
   • **Recall:** $\\frac{TP}{TP + FN}$ (Cost of missed cases).
   • **F1-Score:** Harmonic mean: $\\frac{2 \\cdot Precision \\cdot Recall}{Precision + Recall}$.
   • **PR-AUC:** Area under Precision-Recall curve; vastly superior to ROC-AUC when positive class is rare.

3. **Probability Calibration (Reliability Diagrams):**
   • A well-calibrated classifier outputting $0.80$ probability should be correct 80 out of 100 times.
   • Tree models and SVMs output uncalibrated scores; calibrate using **Platt Scaling** (logistic sigmoid) or **Isotonic Regression**.

4. **Production Drift Detection:**
   • **Data Drift:** Shift in input feature distribution $P(X)$ over time (detected via Kolmogorov-Smirnov test or Population Stability Index - PSI).
   • **Concept Drift:** Shift in statistical relationship between features and target $P(Y \\mid X)$ (model predictions degrade even if input distributions appear stable).`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 8: EMBEDDED SYSTEMS & INDUSTRIAL SERVO CONTROL (STM32H7 / CORTEX-M7)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "ARM Cortex-M7 & STM32H7 Architecture: Memory Map, Clock Trees & NVIC",
    keywords: ["arm cortex-m7", "stm32h7", "dual-issue pipeline", "itcm", "dtcm", "axi bus matrix", "clock tree", "nvic", "stm32 hal", "nucleo-h743zi", "startup code"],
    summary: "Industrial embedded processor architecture: ARM Cortex-M7 480MHz superscalar pipeline, Tightly Coupled Memories (ITCM/DTCM), AXI interconnect, STM32H7 clock tree configuration, NVIC interrupt prioritization, and ST-LINK debugging.",
    primaryLang: "Embedded C / C++ & STM32CubeIDE",
    placementDemand: "Automotive ECU, Robotics Firmware & Industrial Automation (Bosch, Continental, ABB)",
    content: `ARM Cortex-M7 & STM32H7 Systems Engineering:
1. **ARM Cortex-M7 Core Architecture:**
   • 32-bit dual-issue, in-order 6-stage superscalar pipeline running up to 480 MHz.
   • Double-precision Hardware FPU and DSP SIMD instruction extensions.
   • **AXI Bus Matrix & TCM (Tightly Coupled Memory):**
     - **ITCM (Instruction TCM - 64 KB):** Zero-wait-state memory connected directly to CPU instruction bus; ideal for time-critical PID ISR execution loops!
     - **DTCM (Data TCM - 128 KB):** Zero-wait-state memory for time-critical sensor variables and DMA ring buffers.
     - **AXI SRAM (512 KB):** High-speed system memory shared between CPU and DMA peripherals.

2. **Clock Tree & Prescalers (STM32CubeMX):**
   • Sources: High-Speed External (HSE crystal oscillator, e.g. 25 MHz) and High-Speed Internal (HSI 64 MHz RC).
   • Phase-Locked Loop (PLL): Multiplies HSE frequency to generate 480 MHz \`sys_d1cpre_ck\`.
   • Prescalers divide core clock for AHB and APB peripheral buses (APB1/APB2/APB4).

3. **Nested Vectored Interrupt Controller (NVIC):**
   • Up to 240 interrupt request lines with 8-bit programmable priority registers.
   • **Preemption Priority vs. Subpriority:** Higher preemption priority interrupts can preempt running lower priority ISRs.
   • **Tail-Chaining & Late Arrival:** Hardware optimizes back-to-back interrupt context switches down to just 6 CPU clock cycles without popping/pushing registers!

4. **Boot Sequence & Startup Code:**
   • Power-On Reset $\\to$ Read initial Stack Pointer (SP) at address \`0x0000_0000\` (or mapped Flash \`0x0800_0000\`).
   • Read Reset Vector address $\\to$ Execute \`Reset_Handler\` in assembly:
     1. Copies \`.data\` section from Flash to SRAM.
     2. Zero-initializes \`.bss\` section in SRAM.
     3. Calls \`SystemInit()\` (clock setup).
     4. Branches to \`main()\`.`
  },
  {
    topic: "PWM Motor Actuation, 3-Phase BLDC Drivers & Current Sensing",
    keywords: ["pwm", "advanced timers", "tim1", "tim8", "dead-time insertion", "bldc", "brushless dc motor", "trapezoidal commutation", "drv8323", "shunt resistor", "current sensing"],
    summary: "Electric motor drive engineering: advanced timer PWM generation with hardware dead-time insertion, Brushless DC (BLDC) 6-step trapezoidal commutation, three-phase gate driver ICs, and low-side current shunt sensing.",
    primaryLang: "Embedded C (HAL / Register Level)",
    placementDemand: "Motor Control Engineer, Drone Avionics, EV Powertrain Firmware",
    content: `Motor Actuation & Power Stage Protection:
1. **PWM & Advanced-Control Timers (TIM1 / TIM8):**
   • High switching frequency (e.g. 20 kHz to 40 kHz) chosen strictly above the human audible range (20 Hz - 20 kHz) to eliminate acoustic motor whine.
   • Complementary outputs (\`TIMx_CH1\` and \`TIMx_CH1N\`) drive upper and lower MOSFET gates of a half-bridge.
   • **Dead-Time Insertion:** Essential hardware delay inserted between turning OFF one MOSFET and turning ON the opposing MOSFET in the same half-bridge leg.
     *Why?* Real MOSFETs have non-zero turn-off times ($t_{off}$). Without dead-time, both MOSFETs conduct simultaneously, causing a catastrophic short-circuit across the DC bus (**Shoot-Through** / "magic smoke")!

2. **Brushless DC (BLDC) Motors & 6-Step Commutation:**
   • 3 stator windings (Phase U, V, W) and permanent magnet rotor.
   • 6-step trapezoidal drive energizes 2 phases at any instant (one pulled to $V_{bus}$, one to Ground, third floating):
     - Step 1: $U^+ V^-$
     - Step 2: $U^+ W^-$
     - Step 3: $V^+ W^-$
     - Step 4: $V^+ U^-$
     - Step 5: $W^+ U^-$
     - Step 6: $W^+ V^-$

3. **Current Sensing via Shunt Resistors:**
   • Low-side shunt resistors ($R_{shunt} \\approx 5\\text{ m}\\Omega - 20\\text{ m}\\Omega$) placed between low-side MOSFET source and ground.
   • Small millivolt drop amplified by operational amplifiers (built into TI DRV8323) and fed into the STM32H7 16-bit SAR ADC.
   • Peak current limiting trips the timer **Break Input (BKIN)**, instantly forcing all PWM outputs into a high-impedance safe state via hardware within nanoseconds!`
  },
  {
    topic: "Sensors, Encoders, 16-bit SAR ADC & Industrial Fault Protection",
    keywords: ["quadrature encoder", "incremental encoder", "sar adc", "dma", "signal conditioning", "fault detection", "watchdog", "iwdg", "wwdg", "safe state shutdown"],
    summary: "Industrial feedback and safety engineering: incremental quadrature encoders with hardware timer decoding, 16-bit SAR ADC multichannel DMA scanning, signal conditioning filters, and independent/window watchdog fail-safes.",
    primaryLang: "Embedded C (Firmware Systems)",
    placementDemand: "Robotics Safety, Functional Safety (ISO 26262), Industrial Servos",
    content: `Sensors, Feedback & Hardware Safety:
1. **Quadrature Encoders (Position & Velocity):**
   • Two square-wave channels (Phase A and Phase B) phased $90^\\circ$ apart (in quadrature).
   • **Timer Encoder Mode:** STM32 timer hardware counts edges on both channels:
     - If A leads B $\\implies$ Counter increments (Forward rotation).
     - If B leads A $\\implies$ Counter decrements (Reverse rotation).
     - 4× encoding resolution: Evaluates rising and falling edges of both A and B.
   • **Velocity Estimation:** Backward difference $\\omega = \\frac{\\Delta \\theta}{T_s}$, smoothed through a 1st-order discrete low-pass filter to reject optical encoder quantization jitter.

2. **STM32H7 SAR ADC (Successive Approximation Register):**
   • 16-bit resolution, ultra-low conversion latency ($< 1\\,\\mu\\text{s}$).
   • Configured in **Scan Mode** driven by a hardware timer trigger and serviced by **Direct Memory Access (DMA)**:
     - ADC transfers sampled values directly into a DTCM RAM ring buffer without occupying any CPU cycles!

3. **Signal Conditioning:**
   • Anti-aliasing RC low-pass filters prior to ADC input pins ($f_c = \\frac{1}{2\\pi R C}$).
   • Voltage dividers and op-amp buffer followers for bus voltage telemetry.

4. **Watchdogs & Graceful Degradation:**
   • **Independent Watchdog (IWDG):** Clocked by an isolated 32 kHz Low-Speed Internal (LSI) RC oscillator. Must be periodically refreshed; resets MCU if firmware hangs.
   • **Window Watchdog (WWDG):** Must be refreshed within an exact time window (catches early runaway loops).
   • **Fault Latches:** On overcurrent, encoder disconnection, or overtemperature, firmware latches into an emergency stop state, disengaging gate drivers and transmitting diagnostic telemetry over CAN.`
  },
  {
    topic: "CAN Bus & FDCAN: Differential Signaling, Frame Formats & Arbitration",
    keywords: ["can bus", "fdcan", "controller area network", "differential signaling", "arbitration by identifier", "can frame", "transceiver", "mcp2562", "fifo filter banks"],
    summary: "Automotive and industrial networking: Controller Area Network (CAN) physical differential signaling, non-destructive bitwise arbitration, 11-bit/29-bit frame architecture, transceivers, and STM32H7 FDCAN peripheral hardware filtering.",
    primaryLang: "Embedded C / Automotive Networking",
    placementDemand: "Automotive Embedded (OEMs & Tier 1: Tesla, Bosch, Tata Motors)",
    content: `CAN Bus & FDCAN Protocol Engineering:
1. **The Physical Layer (Robustness Under Extreme EMI):**
   • Two balanced differential signal lines: **CAN-H (CAN High)** and **CAN-L (CAN Low)** terminated with $120\\,\\Omega$ split termination resistors at both bus ends.
   • **Recessive State (Logical 1):** Both CAN-H and CAN-L idle at $2.5\\,\\text{V}$ (differential voltage $V_{diff} \\approx 0\\,\\text{V}$).
   • **Dominant State (Logical 0):** CAN-H pulled up to $3.5\\,\\text{V}$, CAN-L pulled down to $1.5\\,\\text{V}$ ($V_{diff} = 2.0\\,\\text{V}$).
   • *Dominant bits physically overwrite recessive bits on the wire!*

2. **Non-Destructive Bitwise Arbitration:**
   • When multiple nodes transmit simultaneously, every node listens to the bus while sending its Identifier:
     - If a node sends a recessive bit (1) but senses a dominant bit (0), it detects that a higher-priority message is on the bus.
     - The node **immediately yields without corrupting the message** and becomes a receiver!
   • **Rule:** **Lowest numerical Identifier wins arbitration and has highest priority!**

3. **CAN 2.0B Frame Format:**
   • Start of Frame (SOF - 1 dominant bit).
   • Identifier: Standard (11-bit) or Extended (29-bit).
   • Control Field: Remote Transmission Request (RTR), Data Length Code (DLC - 0 to 8 bytes).
   • Data Field: 0 to 8 bytes payload (up to 64 bytes in CAN FD).
   • CRC (Cyclic Redundancy Check) + ACK bit (receiver pulls line dominant to acknowledge).

4. **STM32H7 FDCAN Peripheral:**
   • Hardware Filter Banks: Filter incoming IDs directly in hardware, automatically discarding unrelated messages before generating CPU interrupts.
   • Dedicated Message RAM with TX Event FIFO and RX FIFOs (FIFO 0 and FIFO 1).`
  },
  {
    topic: "Closed-Loop PID Control: Discrete Implementation, Anti-Windup & Cascaded Loops",
    keywords: ["pid", "discrete pid", "sampling rate", "integral windup", "anti-windup", "clamping", "bumpless transfer", "ziegler-nichols", "cascaded control"],
    summary: "Control theory in embedded systems: continuous to discrete PID formulation, sampling rate selection, jitter mitigation, integral windup remedies (clamping & back-calculation), tuning methods, and canonical 3-tier cascaded servo loops.",
    primaryLang: "Control Systems & Embedded C",
    placementDemand: "Control Systems Engineer, Robotics Controls, Gimbal/Drone Stabilization",
    content: `Discrete PID & Industrial Servo Loop Design:
1. **Discrete PID Mathematical Formulation:**
   Continuous PID:
   $$u(t) = K_p e(t) + K_i \\int_0^t e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}$$
   Discretized using backward Euler with sampling period $T_s$:
   $$u[k] = K_p e[k] + K_i T_s \\sum_{i=0}^k e[i] + \\frac{K_d}{T_s} (e[k] - e[k-1])$$

2. **Sampling Period ($T_s$) & Timing Jitter:**
   • Rule of thumb: Sample at least **$10\\times$ to $20\\times$ the desired closed-loop bandwidth**.
   • **Jitter Impact:** Executing the PID loop in a variable-duration \`while(1)\` polling loop causes catastrophic phase lag and instability!
   • **The Fix:** The control loop **MUST be placed on a dedicated hardware timer interrupt** (e.g. TIM6 firing at an exact, jitter-free 1 kHz or 10 kHz).

3. **Integral Wind-Up & Remedies:**
   • When the actuator saturates (motor at maximum PWM voltage duty cycle 100%), the error term continues to accumulate in the integrator:
     $$\\text{Integrator} \\to \\infty$$
   • When setpoint reverses, the system remains stuck at maximum output for seconds while the integrator slowly unwinds!
   • **Remedies:**
     1. **Clamping (Conditional Integration):** Stop integrating when output saturates AND error has the same sign as output.
     2. **Back-Calculation:** Subtract the difference between saturated and unsaturated output scaled by an anti-windup gain $K_w$.

4. **Cascaded Servo Loops (Industrial Canonical Architecture):**
   Three nested loops running at different frequencies:
   • **Innermost Current/Torque Loop:** Runs at high frequency (10 kHz - 20 kHz); regulates motor current.
   • **Middle Velocity Loop:** Runs at 1 kHz - 2 kHz; output feeds setpoint to current loop.
   • **Outermost Position Loop:** Runs at 100 Hz - 500 Hz; output feeds setpoint to velocity loop.`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 9: OPERATING SYSTEMS & SYSTEMS PROGRAMMING (LINUX / POSIX)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Linux Architecture, User vs. Kernel Space & System Calls",
    keywords: ["linux architecture", "user space", "kernel space", "system calls", "sys_call", "glibc", "shell", "command execution", "systems programming"],
    summary: "Linux operating system anatomy: dual-mode CPU operation (Ring 3 user vs Ring 0 kernel space), the system call journey through glibc, the Linux system stack, and shell command execution internals.",
    primaryLang: "C (POSIX Systems Programming) & Linux",
    placementDemand: "Systems Engineer, Linux Kernel Developer, Infrastructure SDE",
    content: `Linux OS Service Layer & System Calls:
1. **User Space vs. Kernel Space:**
   • **Ring 3 (User Space):** Applications run with restricted privileges; cannot directly access hardware registers, page tables, or device controllers.
   • **Ring 0 (Kernel Space):** Monolithic Linux kernel runs with full CPU privileges, managing memory, interrupts, drivers, and process scheduling.
   • **CPU Mode Switch:** Switching from User to Kernel space occurs through **Software Interrupts** (\`int 0x80\` on x86) or fast CPU instructions (\`syscall\` on x86-64 / \`svc\` on ARM).

2. **The Anatomy of a System Call:**
   1. User calls POSIX C wrapper: \`read(fd, buffer, count)\`.
   2. \`glibc\` places system call number (e.g. \`SYS_read = 0\` on x86-64) into the \`%rax\` register.
   3. Parameters loaded into registers: \`%rdi\` (fd), \`%rsi\` (buffer), \`%rdx\` (count).
   4. Executes \`syscall\` instruction: CPU transitions to Ring 0, saves user registers to the kernel stack, and jumps to the kernel's system call dispatch table.
   5. Kernel validates pointers, executes driver I/O, stores return value in \`%rax\`, and executes \`sysret\` returning to user mode.

3. **Shell Command Execution Journey (\`ls -l\`):**
   1. Shell reads line via \`getline()\` and parses tokens.
   2. Calls \`fork()\` to clone child process.
   3. Child calls \`execvp("ls", args)\`, replacing its address space with the \`/bin/ls\` binary ELF image.
   4. Parent shell invokes \`waitpid(child_pid, &status, 0)\` to await child exit.`
  },
  {
    topic: "Process Control, Lifecycle & Scheduling in Linux",
    keywords: ["process lifecycle", "process states", "fork", "exec", "waitpid", "zombie process", "orphan process", "cfs", "completely fair scheduler"],
    summary: "Process abstraction and control in Linux: state transitions, clone/fork/exec/wait lifecycle, process descriptor (task_struct), zombie/orphan mitigation, and CFS scheduling.",
    primaryLang: "C (POSIX) & Linux",
    placementDemand: "Core Operating Systems & Low-Level Systems",
    content: `Process Control & Process Lifecycle:
1. **Process Abstraction & \`task_struct\`:**
   • A process is an executing program instance with allocated resources: PID, memory descriptors, open file descriptor table, signal handlers, CPU credentials.
   • Linux represents processes and threads uniformly via the \`task_struct\` struct.

2. **Lifecycle & State Transitions:**
   • **TASK_RUNNING:** Actively executing on a CPU or waiting in the scheduler's runqueue.
   • **TASK_INTERRUPTIBLE (Sleeping):** Waiting for an event or I/O; wakes up on event or signal.
   • **TASK_UNINTERRUPTIBLE (D-State):** Waiting for direct disk I/O; ignores signals.
   • **TASK_STOPPED:** Paused by job control signal (\`SIGSTOP\`, \`SIGTSTP\`).
   • **EXIT_ZOMBIE:** Process has terminated via \`exit()\`, but parent has not yet read its exit code via \`waitpid()\`.

3. **Zombies & Orphans:**
   • **Zombie Process:** Retains entry in process table (holding PID) until parent calls \`wait()\`. Excessive zombies exhaust the system PID space!
   • **Orphan Process:** Parent terminates before child. The Linux \`init\` (PID 1 / systemd) adopts the orphan and automatically calls \`wait()\` when it exits.

4. **Completely Fair Scheduler (CFS):**
   • Uses a **Red-Black Tree** ordered by \`vruntime\` (virtual runtime).
   • The process that has run least (leftmost node in the RB-tree) is selected next ($O(1)$ pick, $O(\\log N)$ re-insert).`
  },
  {
    topic: "Inter-Process Communication (IPC): Pipes, FIFOs & POSIX Signals",
    keywords: ["ipc", "inter-process communication", "anonymous pipes", "named pipes", "fifo", "posix signals", "sigint", "sigkill", "sigaction", "job control"],
    summary: "POSIX inter-process communication: anonymous kernel pipes, named FIFO nodes, signal delivery mechanics, asynchronous signal handlers using sigaction(), and terminal job control.",
    primaryLang: "C (Systems Programming)",
    placementDemand: "Systems SDE, Backend Infrastructure, Linux Tooling",
    content: `IPC & Signal Programming:
1. **Anonymous Pipes (\`pipe(int fd[2])\`):**
   • Unidirectional data channel allocated in kernel memory buffer (typically 64 KB).
   • \`fd[0]\` opened for Reading, \`fd[1]\` opened for Writing.
   • Used between related processes (parent and child after \`fork()\`).
   • Standard shell pipeline (\`ls | grep foo\`): Shell creates pipe, connects child 1's \`stdout\` (fd 1) to \`fd[1]\` via \`dup2()\`, and connects child 2's \`stdin\` (fd 0) to \`fd[0]\`.

2. **Named Pipes (FIFOs - \`mkfifo()\`)**
   • Created as a special file node in the VFS filesystem namespace.
   • Allows completely unrelated processes running under different user accounts to stream data asynchronously.

3. **POSIX Signals & Asynchronous Notifications:**
   • Software interrupts delivered by the kernel to notify a process of an event:
     - \`SIGINT\` (Ctrl+C - 2), \`SIGKILL\` (9 - cannot be caught or ignored!), \`SIGTERM\` (15 - graceful shutdown), \`SIGSEGV\` (11 - invalid memory access), \`SIGCHLD\` (17 - child state changed).
   • **Safe Signal Handling (\`sigaction\`):**
     - Never use deprecated \`signal()\`; use \`sigaction()\` with explicit signal masks.
     - **Reentrancy Rule:** Signal handlers interrupt normal execution at any arbitrary instruction. Only **Async-Signal-Safe** functions (e.g. \`write()\`, \`_exit()\`) can be called inside an ISR! Avoid \`printf()\` or \`malloc()\` (they use non-reentrant internal mutex locks).`
  },
  {
    topic: "Virtual Memory, Page Tables, Demand Paging & Memory Allocation",
    keywords: ["virtual memory", "page tables", "page fault", "demand paging", "tlb", "address translation", "brk", "sbrk", "mmap", "copy-on-write", "cow"],
    summary: "Linux memory management: virtual address space layout, multi-level page table translation, TLB hardware caching, demand page fault handling, brk/mmap dynamic allocators, and Copy-on-Write (COW).",
    primaryLang: "C & Operating Systems Architecture",
    placementDemand: "Core SDE Interview & High-Performance Engineering",
    content: `Virtual Memory & Paging Internals:
1. **Process Address Space Layout (Low to High Memory):**
   • \`0x0000_0000\` (Reserved / Null trap).
   • **.text:** Compiled machine instructions (Read-Only, Executable).
   • **.data:** Initialized global/static variables (Read-Write).
   • **.bss:** Uninitialized global/static variables (zero-initialized).
   • **Heap:** Grows upward via \`brk()\` / \`sbrk()\` or anonymous \`mmap()\`.
   • **Memory Mapping Segment (mmap):** Shared libraries (\`libc.so\`), mapped files.
   • **Stack:** Grows downward (local variables, function call stack frames).
   • **Kernel Space (Top 128 TB on x86-64):** Mapped for all processes, accessible only in Ring 0.

2. **Multi-Level Page Tables & TLB:**
   • Modern 64-bit architectures use 4-level or 5-level page tables (PML4 $\\to$ PDPT $\\to$ PD $\\to$ PT $\\to$ Offset).
   • Virtual Address decomposed into index bits for each level plus a 12-bit offset (for 4 KB pages).
   • **TLB (Translation Lookaside Buffer):** CPU hardware associative cache storing recent virtual-to-physical frame translations. TLB hits resolve in $<1$ cycle!

3. **Demand Paging & Page Fault Journey:**
   • When a process accesses an unmapped virtual page:
     1. MMU triggers **Page Fault (Interrupt 14)**.
     2. Kernel inspects memory descriptors (\`vm_area_struct\`).
     3. If access is illegal (e.g. write to Read-Only text) $\\implies$ sends \`SIGSEGV\`.
     4. If legal, kernel allocates physical frame, loads page from disk/swap if needed, updates page table entry (PTE), and restarts the faulting instruction.

4. **Copy-on-Write (COW):**
   • When \`fork()\` is called, physical RAM pages are **NOT copied**.
   • Child page tables point to existing parent frames with permissions marked **Read-Only**.
   • When either parent or child attempts to *write* to a page, a page fault triggers, and the kernel allocates a new physical frame and copies *only that specific 4 KB page*!`
  },
  {
    topic: "Virtual File System (VFS), Inodes, File Descriptors & ext4",
    keywords: ["vfs", "virtual file system", "inode", "dentry", "file descriptor", "open file table", "ext4", "buffered io", "mmap file io"],
    summary: "Linux storage architecture: the Unix 'Everything is a File' abstraction, Virtual File System (VFS) interface, inodes and directory entries, file descriptor tables, and ext4 filesystem design.",
    primaryLang: "C & Storage Architecture",
    placementDemand: "Storage Systems, Cloud File Systems & Kernel Engineering",
    content: `File Systems & VFS Engineering:
1. **The Unix File Abstraction & VFS:**
   • The **Virtual File System (VFS)** provides an object-oriented kernel abstraction layer, allowing unified system calls (\`open\`, \`read\`, \`write\`, \`close\`) to work identically across ext4, XFS, NFS, and virtual filesystems (\`/proc\`, \`/sys\`).

2. **The 4 Primary VFS Objects:**
   • **Superblock:** Represents an entire mounted filesystem (block size, total inodes, free space).
   • **Inode (Index Node):** Stores metadata of a file: file size, owner UID/GID, permissions, timestamps, and pointers to physical data disk blocks. *An inode does NOT contain the filename!*
   • **Dentry (Directory Entry):** Associates a string filename with its corresponding inode number. Directories in Linux are simply special files containing a list of (filename, inode) pairs!
   • **File Object:** Represents an open file instance created when a process invokes \`open()\`. Tracks current read/write byte offset and file status flags.

3. **File Descriptor Table Architecture:**
   • Each process has a private **File Descriptor Table** containing integer indexes (0: stdin, 1: stdout, 2: stderr).
   • Each descriptor entry points to an entry in the system-wide **Open File Table**, which in turn points to the underlying VFS **Inode**.

4. **ext4 Filesystem Highlights:**
   • **Extents:** Replaces individual block pointers with contiguous block spans (starting block + length), drastically reducing metadata overhead for large files.
   • **Journaling:** Write-Ahead Logging of filesystem metadata, enabling instantaneous crash recovery without exhaustive \`fsck\` disk scans.`
  },
  {
    topic: "Concurrency, POSIX Threads, Mutexes, Condition Variables & Semaphores",
    keywords: ["concurrency", "pthreads", "posix threads", "race condition", "mutex", "pthread_mutex", "condition variable", "pthread_cond", "counting semaphore", "deadlock", "coffman"],
    summary: "POSIX multi-threaded programming: thread creation and joining, race conditions on shared memory, mutual exclusion with mutexes, thread synchronization with condition variables, counting semaphores, and deadlock prevention.",
    primaryLang: "C / C++ (Pthreads)",
    placementDemand: "High-Frequency Trading, Multi-threaded Systems, Game Engine Dev",
    content: `POSIX Concurrency & Thread Synchronization:
1. **Threads vs. Processes:**
   • Created via \`pthread_create()\`.
   • Threads share: Virtual Address Space (Heap, Global data, Code), Open File Descriptors, and Signal handlers.
   • Threads have private: Thread ID (TID), Register state / Program Counter, and Call Stack.

2. **Race Conditions & Mutexes (\`pthread_mutex_t\`):**
   • **Race Condition:** Two threads concurrently modify shared memory where the final result depends on non-deterministic thread execution timing.
   • **Mutex (Mutual Exclusion):**
     \`\`\`c
     pthread_mutex_lock(&lock);
     // Critical Section: access shared resource
     pthread_mutex_unlock(&lock);
     \`\`\`
   • Fast-path mutexes in Linux use **futex** (Fast Userspace Mutex) system calls: locking uncontended mutexes requires zero kernel transitions ($O(1)$ atomic assembly instructions)!

3. **Condition Variables (\`pthread_cond_t\`):**
   • Used when a thread must wait for a specific condition/predicate to become true.
   • **Mandatory Rule:** Must always check condition in a \`while\` loop (to guard against **Spurious Wakeups**):
     \`\`\`c
     pthread_mutex_lock(&lock);
     while (!data_ready) {
         pthread_cond_wait(&cond, &lock); // Atomically unlocks mutex & sleeps
     }
     // Process data...
     pthread_mutex_unlock(&lock);
     \`\`\`

4. **Deadlocks (The 4 Coffman Conditions):**
   • A deadlock occurs if and only if all four conditions hold:
     1. Mutual Exclusion.
     2. Hold and Wait.
     3. No Preemption.
     4. Circular Wait.
   • **The Universal Remedy:** Enforce a strict global **Lock Ordering** protocol (all threads must acquire locks in identical sequential order).`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 10: ADVANCED ALGORITHMS & TEXTHACK SYSTEM
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "TextHack System Architecture, String Algorithms (KMP, Z, Suffix Arrays)",
    keywords: ["texthack", "string matching", "kmp", "knuth morris pratt", "z-algorithm", "rabin karp", "rolling hash", "aho corasick", "suffix array", "lcp", "kasai algorithm"],
    summary: "Advanced string analytics and the TextHack engine: Knuth-Morris-Pratt failure function, linear Z-algorithm, Rabin-Karp polynomial rolling hash, Aho-Corasick trie automaton, Suffix Arrays and Kasai's LCP construction.",
    primaryLang: "C++ / Java (No java.util.* engine constraints)",
    placementDemand: "Search Engines, Bio-informatics, Advanced SDE Roles",
    content: `TextHack Analytics & String Engineering:
1. **The Exact String Matching Challenge:**
   • Searching pattern $P$ (length $m$) in text $T$ (length $n$): Naive search takes $O(n \\cdot m)$.

2. **Knuth-Morris-Pratt (KMP) Algorithm:**
   • Computes **Longest Proper Prefix which is also a Suffix (LPS array / $\\pi$ table)** for pattern $P$ in $O(m)$ time.
   • When a mismatch occurs at $P[j]$, instead of rewinding text pointer $i$, jump pattern index: $j \\leftarrow LPS[j-1]$.
   • Total runtime: strictly $O(n + m)$ linear time with zero backtracking on text!

3. **Z-Algorithm:**
   • Modern, highly intuitive linear alternative to KMP.
   • For string $S = P + \\$' + T$, computes $Z[i]$: the length of the longest substring starting at $i$ that matches the prefix of $S$.
   • Uses a moving $[L, R]$ match box window to compute all $Z$-values in strictly $O(|S|) = O(n + m)$ time.

4. **Rabin-Karp Algorithm (Polynomial Rolling Hash):**
   • Computes hash: $H(s) = \\sum_{i=0}^{m-1} s[i] \\cdot p^{m-1-i} \\bmod M$.
   • Rolling hash updates in $O(1)$ constant time as window slides:
     $$H_{new} = ((H_{old} - s[old] \\cdot p^{m-1}) \\cdot p + s[new]) \\bmod M$$
   • Double hashing with two large primes prevents malicious collision attacks.

5. **Suffix Arrays & LCP Array (Kasai's Algorithm):**
   • **Suffix Array:** Lexicographically sorted array of all $n$ suffixes of text $T$. Can be constructed in $O(n \\log^2 n)$ or linear $O(n)$ (SA-IS).
   • **Kasai's LCP Algorithm:** Given Suffix Array, constructs Longest Common Prefix array between adjacent suffixes in $O(n)$ linear time.
   • Enables sub-quadratic substring search, longest repeated substring, and suffix-based document similarity in TextHack!`
  },
  {
    topic: "Advanced Dynamic Programming: Wagner-Fischer, Interval DP, Bitmask & Trees",
    keywords: ["advanced dp", "edit distance", "wagner fischer", "needleman wunsch", "smith waterman", "interval dp", "matrix chain multiplication", "bitmask dp", "tsp", "tree dp", "rerooting", "sos dp"],
    summary: "Advanced dynamic programming paradigms: Wagner-Fischer edit distance, genomic sequence alignments, interval DP, O(2^N * N^2) Bitmask DP (TSP), Tree DP with tree re-rooting, and Sum-Over-Subsets (SOS DP).",
    primaryLang: "C++ (Competitive Programming) & Java",
    placementDemand: "Top-Percentile Competitive Programming & Algorithmic Engineering",
    content: `Advanced Dynamic Programming Paradigms:
1. **Edit Distance & Genomic Sequence Alignment:**
   • **Wagner-Fischer Algorithm (Levenshtein Distance):**
     $$DP[i][j] = \\begin{cases} DP[i-1][j-1] & \\text{if } A[i] = B[j] \\\\ 1 + \\min(DP[i-1][j], DP[i][j-1], DP[i-1][j-1]) & \\text{if } A[i] \\neq B[j] \\end{cases}$$
   • **Needleman-Wunsch (Global Alignment):** Uses gap penalty and similarity scoring matrix (BLOSUM/PAM).
   • **Smith-Waterman (Local Alignment):** Resets negative cells to $0$ to identify optimal local motif alignments.

2. **Interval DP (Matrix Chain Multiplication & Optimal BST):**
   • Solves optimal evaluation order over contiguous ranges $[i, j]$:
     $$DP[i][j] = \\min_{i \\le k < j} (DP[i][k] + DP[k+1][j] + cost(i, k, j))$$
   • Evaluated in order of increasing interval length $len = j - i + 1$ in $O(n^3)$ or $O(n^2)$ via Knuth's optimization.

3. **Bitmask DP (Compressed Exponential State Space):**
   • Represents subset of visited elements as an integer bitmask $mask \\in [0, 2^n - 1]$.
   • **Traveling Salesperson Problem (TSP):**
     $$DP[mask][u] = \\min_{v \\notin mask} (DP[mask \\mid (1 \\ll v)][v] + dist[u][v])$$
   • Reduces naive $O(n!)$ brute force to $O(2^n \\cdot n^2)$!

4. **Tree DP & The Re-rooting Technique:**
   • First pass (post-order DFS): Computes subtree metrics rooted at default root.
   • Second pass (pre-order DFS): Rolls root transition contribution forward to compute answer for *every node as root* in $O(N)$ total time!

5. **Sum Over Subsets (SOS DP):**
   • Computes $F(mask) = \\sum_{submask \\subseteq mask} A[submask]$ for all $2^n$ masks in $O(n \\cdot 2^n)$ time instead of $O(3^n)$.`
  },
  {
    topic: "Network Flow: Ford-Fulkerson, Edmonds-Karp, Dinic & Bipartite Matching",
    keywords: ["network flow", "max flow", "min cut", "ford fulkerson", "edmonds karp", "dinic algorithm", "blocking flow", "level graph", "bipartite matching", "konig theorem"],
    summary: "Combinatorial network optimization: capacity constraints and flow conservation, Max-Flow Min-Cut theorem, Edmonds-Karp O(VE^2), Dinic's blocking flow on level graphs O(V^2E), and bipartite matching reductions.",
    primaryLang: "C++ & Graph Optimization",
    placementDemand: "Operations Research, Network Optimization & Complex SDE Algorithms",
    content: `Network Flow & Optimization:
1. **The Maximum Flow Problem:**
   • Directed graph with Source $s$, Sink $t$, and edge capacities $c(u, v) \\ge 0$.
   • **Properties:**
     1. Capacity Constraint: $0 \\le f(u, v) \\le c(u, v)$.
     2. Skew Symmetry: $f(u, v) = -f(v, u)$.
     3. Flow Conservation: For all $u \\notin \\{s, t\\}$, $\\sum_v f(u, v) = 0$.

2. **The Max-Flow Min-Cut Theorem:**
   • The maximum value of an $s-t$ flow equals the minimum capacity of an $s-t$ cut!
   • Provides the foundational duality for image segmentation, project selection, and min-cut network partitioning.

3. **Flow Algorithms:**
   • **Ford-Fulkerson:** Finds augmenting paths in residual graph; time depends on capacities ($O(E \\cdot |f^*|)$).
   • **Edmonds-Karp:** Uses **BFS** to find shortest augmenting path (fewest edges), guaranteeing $O(V \\cdot E^2)$ polynomial time.
   • **Dinic's Algorithm (The Industrial Workhorse):**
     - Step 1: Constructs a **Level Graph** via BFS (assigning distance $dist[v]$ from source).
     - Step 2: Pushes **Blocking Flows** along admissible edges ($dist[v] = dist[u] + 1$) using DFS with pointer elimination.
     - Total runtime: strictly **$O(V^2 E)$** (and $O(E \\sqrt{V})$ on unit capacity graphs)!

4. **Bipartite Matching & König's Theorem:**
   • Construct flow network: connect Source $s$ to all left nodes, connect all right nodes to Sink $t$ with capacity 1.
   • Max Flow $=$ Maximum Cardinality Bipartite Matching.
   • **König's Theorem:** In any bipartite graph, the size of the maximum matching equals the size of the minimum vertex cover!`
  },
  {
    topic: "NP-Completeness, Complexity Classes (P, NP, co-NP) & Approximation",
    keywords: ["np completeness", "p vs np", "cook levin theorem", "sat", "3-sat", "polynomial reduction", "vertex cover", "tsp", "approximation algorithms", "ptas", "fpt"],
    summary: "Theoretical computer science and intractable problems: decision vs optimization, P, NP, and co-NP definitions, the Cook-Levin theorem, canonical reductions (3-SAT to Clique to Vertex Cover), and approximation algorithms with ratio guarantees.",
    primaryLang: "Theoretical Computer Science & Complexity Analysis",
    placementDemand: "Algorithm Engineer, Formal Verification, Research SDE",
    content: `Computational Complexity & Approximation:
1. **Complexity Classes Defined by Verification:**
   • **P:** Decision problems solvable in deterministic polynomial time ($O(n^k)$).
   • **NP (Nondeterministic Polynomial):** Decision problems where a candidate solution ("certificate") can be **verified** in polynomial time.
   • **co-NP:** Decision problems where "NO" instances have polynomial-time verifiable refutations.

2. **NP-Completeness & Cook-Levin Theorem:**
   • A language $L$ is **NP-Complete** if:
     1. $L \\in NP$.
     2. Every problem in NP is polynomial-time reducible to $L$ ($L$ is **NP-Hard**).
   • **Cook-Levin Theorem (1971):** Proved that **Boolean Satisfiability (SAT)** is NP-Complete from scratch by encoding non-deterministic Turing machine computations into Boolean logic formulas!

3. **The Canonical Reduction Zoo:**
   $$\\text{Circuit-SAT} \\le_P \\text{3-SAT} \\le_P \\text{CLIQUE} \\le_P \\text{INDEPENDENT-SET} \\le_P \\text{VERTEX-COVER} \\le_P \\text{SET-COVER}$$
   $$\\text{3-SAT} \\le_P \\text{SUBSET-SUM} \\le_P \\text{KNAPSACK}$$
   $$\\text{DIRECTED-HAM-CYCLE} \\le_P \\text{UNDIRECTED-HAM-CYCLE} \\le_P \\text{TSP}$$

4. **Approximation Algorithms (Tackling NP-Hard Problems):**
   • An algorithm has an approximation ratio $\\alpha$ if its solution $C$ satisfies:
     $$\\max\\left(\\frac{C}{C^*}, \\frac{C^*}{C}\\right) \\le \\alpha$$
   • **Vertex Cover 2-Approximation:** Repeatedly pick an arbitrary edge, add *both* endpoints to the cover, and remove all incident edges. Guaranteed to be $\\le 2 \\times OPT$ in $O(V + E)$!
   • **PTAS (Polynomial-Time Approximation Scheme):** $(1 + \\epsilon)$ approximation in polynomial time for any fixed $\\epsilon > 0$.`
  },
  {
    topic: "Randomised & Parallel Algorithms: Primality Testing, Work/Span & Blelloch Scan",
    keywords: ["randomised algorithms", "las vegas", "monte carlo", "miller rabin", "primality test", "universal hashing", "reservoir sampling", "parallel algorithms", "work and span", "brent's theorem", "blelloch scan"],
    summary: "Stochastic and parallel computation: Las Vegas vs Monte Carlo algorithms, Miller-Rabin probabilistic primality test, reservoir sampling, work and span (T1, T∞) DAG models, Brent's speedup theorem, and the Blelloch parallel prefix-sum scan.",
    primaryLang: "C++ (OpenMP / CUDA) & Systems Algorithms",
    placementDemand: "High-Performance Computing (HPC), GPU Engineering, Cryptography",
    content: `Randomised & Parallel Algorithm Engineering:
1. **Randomised Taxonomy:**
   • **Las Vegas:** Output is *always correct*; running time is a random variable (e.g. Randomised QuickSort expected $O(N \\log N)$).
   • **Monte Carlo:** Running time is deterministic; output is correct with *high probability* (e.g. Miller-Rabin primality test).

2. **Miller-Rabin Primality Test (Cryptographic Workhorse):**
   • Based on Fermat's Little Theorem and roots of unity modulo prime $p$: $x^2 \\equiv 1 \\pmod p \\implies x \\equiv \\pm 1 \\pmod p$.
   • Writes $n - 1 = 2^s \\cdot d$ with $d$ odd.
   • A candidate base $a$ is a witness that $n$ is composite if $a^d \\not\\equiv 1 \\pmod n$ and $a^{2^r d} \\not\\equiv -1 \\pmod n$ for all $0 \\le r < s$.
   • Running $k$ rounds of independent random tests reduces error probability of false prime to $< 4^{-k}$!

3. **Reservoir Sampling (Streaming Data):**
   • Selects $k$ random items uniformly from an infinite data stream of unknown length $N$:
     - Fill reservoir with first $k$ elements.
     - For item $i > k$, keep with probability $\\frac{k}{i}$; if kept, replace a random item in reservoir.
     - Every element has an exact uniform $\\frac{k}{N}$ probability of selection!

4. **Parallel Algorithm Performance Models:**
   • **Work ($T_1$):** Total operations executed on a single processor.
   • **Span ($T_\\infty$):** Critical path length of longest dependency chain on an infinite number of processors.
   • **Brent's Theorem:** With $P$ parallel processors:
     $$\\frac{T_1}{P} \\le T_P \\le \\frac{T_1}{P} + T_\\infty$$

5. **Blelloch Parallel Prefix-Sum (Scan):**
   • Computes running prefix sums in parallel across $N$ array elements:
     - **Up-Sweep (Reduce Phase):** Builds binary summation tree in $O(N)$ work and $O(\\log N)$ span.
     - **Down-Sweep Phase:** Distributes running totals down the tree in $O(N)$ work and $O(\\log N)$ span.
   • The core algorithmic building block of GPU hardware shaders, parallel radix sort, and compaction filters!`
  }
];

// ─── Direct Topic Resolver for Expanded Curricula ───────────────────────────
export function findExpandedCoursesDirectResponse(lower) {
  if (!lower) return null;

  // 1. BACKEND & MICROSERVICES
  if (lower.includes('cap theorem') || lower.includes('brewer theorem')) {
    return {
      text: `### 🌐 The CAP Theorem (Brewer's Theorem) & Distributed Data Stores

The **CAP Theorem** states that any distributed data store can simultaneously guarantee at most **two out of three** fundamental properties:

---

#### 🏛️ The Three Pillars:
1. **Consistency (C):** Every read receives the most recent write or an error. All nodes see identical data at the same instant.
2. **Availability (A):** Every non-failing node returns a successful response for every request (without guaranteeing it is the most recent write).
3. **Partition Tolerance (P):** The system continues to operate despite arbitrary message loss or network communication delays between nodes.

---

#### ⚖️ The Hard Truth: P is Non-Negotiable!
* In real-world physical networks, packet drops and network partitions **will inevitably happen**!
* Therefore, distributed systems must trade off between **CP** and **AP**:
  * **CP Systems (Consistency + Partition Tolerance):** On network split, nodes refuse writes or return errors to prevent stale or conflicting data (e.g. **MongoDB**, **HBase**, **Consul**).
  * **AP Systems (Availability + Partition Tolerance):** On network split, all nodes accept writes and reads, guaranteeing 100% uptime with **Eventual Consistency** (e.g. **Apache Cassandra**, **Amazon DynamoDB**, **CouchDB**).`,
      sources: ['Distributed Systems Principles', 'Brewer CAP Theorem', 'Database Engineering Curriculum']
    };
  }

  if (lower.includes('vector db') || lower.includes('vector database') || lower.includes('pgvector') || lower.includes('hnsw') || lower.includes('ivf') || lower.includes('embeddings')) {
    return {
      text: `### 🧠 Vector Databases, Embeddings & ANN Search (HNSW vs. IVF)

**Vector Databases** store high-dimensional floating-point vectors generated by AI embedding models (e.g. OpenAI \`text-embedding-3\`, BERT, CLIP) to enable semantic similarity search:

---

#### 📐 1. Distance Metrics:
* **Cosine Similarity:** $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$ — Measures the angular angle between vectors regardless of magnitude (standard for NLP).
* **Euclidean Distance ($L_2$):** $\\sqrt{\\sum (u_i - v_i)^2}$ — Geometric distance in space.
* **Dot Product (Inner Product):** $u \\cdot v$ — Fastest to compute when embeddings are pre-normalized to unit length.

---

#### ⚡ 2. Approximate Nearest Neighbor (ANN) Algorithms:
Exact K-Nearest Neighbors ($O(N \\cdot D)$) is too slow for millions of vectors. Vector DBs use ANN indexing:
1. **HNSW (Hierarchical Navigable Small World):**
   * Multi-layer graph where upper layers skip long distances and bottom layers navigate localized clusters.
   * Delivers **$O(\\log N)$ logarithmic query latency** with ultra-high recall.
2. **IVF (Inverted File Index):**
   * Uses K-means to partition vectors into Voronoi centroid cells. Lookups search only vectors assigned to nearest centroids.

---

#### 🛠️ 3. Industrial Implementations:
* **pgvector (PostgreSQL):** Adds native \`vector\` column type and \`HNSW\` / \`IVFFlat\` indexes directly in relational tables.
* **Specialized Vector Stores:** Pinecone (Serverless), Weaviate (Hybrid BM25 + Vector), Qdrant, Milvus.`,
      sources: ['Vector Database Foundations', 'pgvector Architecture', 'AI Engineering Curriculum']
    };
  }

  if (lower.includes('saga pattern') || lower.includes('compensating transaction') || lower.includes('2pc') || lower.includes('two phase commit')) {
    return {
      text: `### 🔄 Distributed Transactions: 2PC vs. The Saga Pattern

In microservices architectures where each service owns a private database (**Database-per-Service**), maintaining data consistency across multiple databases cannot rely on standard ACID database transactions:

---

#### 🚫 1. Why Two-Phase Commit (2PC) Fails at Scale:
* Uses a central coordinator with **Prepare Phase** and **Commit Phase**.
* **Fatal Flaws:** Latency spikes because rows across all participating databases remain locked until every node acknowledges. If the coordinator or network fails mid-transaction, distributed locks freeze the entire system!

---

#### 🛡️ 2. The Saga Pattern (Eventual Consistency):
A **Saga** breaks a distributed transaction into a sequence of local transactions:
1. Service A updates its database and publishes an event (e.g. \`OrderCreated\`).
2. Service B consumes the event and executes its local transaction (e.g. \`PaymentProcessed\`).
3. Service C consumes the next event (e.g. \`InventoryReserved\`).

#### ⚠️ Handling Failures: Compensating Actions
If any intermediate step fails (e.g. Inventory is out of stock):
* The Saga executes **Compensating Transactions** in reverse order to undo prior committed changes:
  - *Action:* Deduct payment $\\implies$ *Compensating Action:* Refund payment.
  - *Action:* Create pending order $\\implies$ *Compensating Action:* Cancel order.

---

#### 🏗️ Saga Execution Models:
* **Choreography:** Services listen to message queues (Kafka/RabbitMQ) and publish events directly without a central master.
* **Orchestration:** A dedicated orchestrator state machine coordinates calls and explicitly triggers rollbacks.`,
      sources: ['Microservices Patterns (Chris Richardson)', 'Distributed Systems Resilience']
    };
  }

  // 2. EMBEDDED SYSTEMS & STM32H7 / CORTEX-M7
  if (lower.includes('stm32h7') || lower.includes('cortex-m7') || lower.includes('itcm') || lower.includes('dtcm')) {
    return {
      text: `### ⚡ ARM Cortex-M7 & STM32H7 Architecture: Memory Map & TCM

The **STM32H7** (powered by an ARM Cortex-M7 core running up to 480 MHz) is one of the most powerful microcontrollers deployed in automotive electronic control units (ECUs), drones, and industrial servos:

---

#### 🏛️ 1. Tightly Coupled Memory (TCM): Zero-Wait-State Speed:
* Normal Flash and SRAM require the CPU to arbitrate across the multi-layer AXI bus matrix, introducing wait cycles.
* **ITCM (Instruction TCM - 64 KB):** Mapped directly to the Cortex-M7 instruction bus at address \`0x0000_0000\`. Time-critical motor control PID interrupt routines execute out of ITCM with **strictly 0 wait states**!
* **DTCM (Data TCM - 128 KB):** Directly accessible by the core for high-frequency sensor variables, control matrices, and stack frames.

---

#### ⏱️ 2. Dual-Issue Superscalar Pipeline:
* 6-stage in-order pipeline capable of issuing and executing **two instructions per clock cycle** simultaneously (e.g., one ALU integer arithmetic and one floating-point FPU load).
* Hardware Double-Precision Floating Point Unit (FPU) and DSP extensions.

---

#### 🎯 3. The NVIC (Nested Vectored Interrupt Controller):
* Manages up to 240 interrupt sources with 8-bit priority registers (256 priority levels).
* Features **Hardware Tail-Chaining** and **Late Arrival** optimizations, reducing interrupt transition latency to just 6 CPU clock cycles!`,
      sources: ['ARM Cortex-M7 Technical Reference Manual', 'STM32H7 Reference Manual (RM0433)']
    };
  }

  if (lower.includes('dead time') || lower.includes('dead-time') || lower.includes('shoot-through') || lower.includes('bldc') || lower.includes('trapezoidal commutation')) {
    return {
      text: `### ⚡ PWM Dead-Time Insertion & BLDC 6-Step Commutation

In electric motor drives and high-power inverter stages, hardware protection against electrical destruction is non-negotiable:

---

#### 💥 1. Why Dead-Time Insertion is Mandatory:
* A motor half-bridge consists of an Upper MOSFET and a Lower MOSFET connected across the DC power bus ($V_{bus}$ to Ground).
* Real silicon MOSFETs do not switch instantaneously; they take non-zero time to turn off ($t_{off}$).
* If the Upper MOSFET is commanded ON at the exact microsecond the Lower MOSFET is commanded OFF, both will be partially conductive at the same time.
* This creates a catastrophic direct short-circuit between the power rail and ground (**Shoot-Through** / "magic smoke")!
* **The Solution:** Advanced timers (STM32 **TIM1 / TIM8**) insert an automatic programmable **Dead-Time Delay** (nanoseconds to microseconds) where **both gates are held strictly OFF** before the complementary switch is engaged.

---

#### 🔄 2. Six-Step (Trapezoidal) Commutation:
A Brushless DC (BLDC) motor has 3 stator winding phases ($U, V, W$).
In 6-step trapezoidal control, only 2 phases conduct at any given instant while the third floats:
* **Step 1:** $U^+ \\to V^-$
* **Step 2:** $U^+ \\to W^-$
* **Step 3:** $V^+ \\to W^-$
* **Step 4:** $V^+ \\to U^-$
* **Step 5:** $W^+ \\to U^-$
* **Step 6:** $W^+ \\to V^-$
Commutation steps are synchronized with rotor position detected via Hall sensors or back-EMF zero-crossing detection.`,
      sources: ['Electric Motor Drives & Inverters', 'STM32 Advanced Timers Specification']
    };
  }

  if (lower.includes('can bus') || lower.includes('fdcan') || lower.includes('arbitration by id') || lower.includes('can frame')) {
    return {
      text: `### 🚗 Controller Area Network (CAN Bus & FDCAN)

Invented by Bosch in 1986, **CAN Bus** remains the undisputed backbone of automotive vehicle networking, robotics, and industrial factory automation:

---

#### ⚡ 1. Differential Signaling & Noise Immunity:
* Uses a twisted pair: **CAN-H (High)** and **CAN-L (Low)** with $120\\,\\Omega$ termination resistors at each end.
* **Recessive Bit (1):** Both CAN-H and CAN-L idle at $2.5\\,\\text{V}$ ($V_{diff} \\approx 0\\,\\text{V}$).
* **Dominant Bit (0):** CAN-H rises to $3.5\\,\\text{V}$, CAN-L drops to $1.5\\,\\text{V}$ ($V_{diff} = 2.0\\,\\text{V}$).
* Any electromagnetic interference (EMI) induces equal voltage spikes in both wires; the differential receiver subtracts them ($V_H - V_L$), completely canceling out ambient noise!

---

#### 🏆 2. Non-Destructive Bitwise Arbitration:
* Multiple nodes can attempt to transmit simultaneously on the bus.
* As nodes transmit their 11-bit or 29-bit Identifiers bit-by-bit:
  - Dominant bits (0) physically override Recessive bits (1) on the wire.
  - If node A sends a \`1\` but detects a \`0\` on the bus, it realizes a higher-priority message is transmitting, yields instantly, and switches to receiver mode without corrupting the active packet!
* **Rule:** **Lowest numerical Identifier has the highest priority on the bus!**

---

#### 📦 3. CAN FD (Flexible Data-rate):
* Classic CAN: Maximum 1 Mbit/s and 8 bytes payload.
* **CAN FD:** Shifts to higher baud rates (up to 5–8 Mbit/s) during the data phase and expands payload to **64 bytes per frame**!`,
      sources: ['ISO 11898 CAN Standard', 'Bosch CAN Specification 2.0B / FDCAN']
    };
  }

  if (lower.includes('pid') && (lower.includes('windup') || lower.includes('anti-windup') || lower.includes('discrete') || lower.includes('tuning'))) {
    return {
      text: `### 🎛️ Discrete PID Control & Anti-Windup Mechanisms

A **Proportional-Integral-Derivative (PID)** controller calculates an error value $e(t) = \\text{Setpoint} - \\text{Feedback}$ and outputs a correction signal:

---

#### 📐 1. Discrete PID Formula:
Implemented on microcontrollers using backward difference with sampling time $T_s$:
$$u[k] = \\underbrace{K_p e[k]}_{\\text{Proportional}} + \\underbrace{K_i T_s \\sum_{i=0}^k e[i]}_{\\text{Integral}} + \\underbrace{\\frac{K_d}{T_s} (e[k] - e[k-1])}_{\\text{Derivative}}$$

---

#### ⚠️ 2. The Integral Wind-Up Problem:
* Real physical actuators have limits (e.g. PWM duty cycle maxes out at 100%, valve is fully open).
* If a large disturbance or setpoint step occurs, the actuator saturates.
* However, the error continues to accumulate in the mathematical integral accumulator: $\\text{Integrator} \\to \\infty$!
* When the error finally reverses, the system **remains pegged at maximum output** for seconds while the bloated integrator slowly discharges, resulting in massive overshoots and oscillations.

#### 🛡️ Anti-Windup Solutions:
1. **Clamping (Conditional Integration):** Freeze the integrator whenever the output reaches the saturation limit AND the error has the same sign as the output.
2. **Back-Calculation:** Feed back the difference between saturated and unsaturated output to subtractively correct the integrator.`,
      sources: ['Control Systems Engineering (Norman Nise)', 'Embedded Discrete Control Systems']
    };
  }

  // 3. OPERATING SYSTEMS & SYSTEMS PROGRAMMING
  if (lower.includes('user space') || lower.includes('kernel space') || lower.includes('system call journey') || lower.includes('syscall')) {
    return {
      text: `### 🐧 Linux: User Space vs. Kernel Space & The System Call Journey

Modern operating systems rely on hardware-enforced CPU privilege levels to maintain rock-solid stability and prevent rogue processes from corrupting memory:

---

#### 🛡️ 1. Dual-Mode CPU Operation:
* **User Space (Ring 3 on x86 / EL0 on ARM):** Where your application code (Python, C++, Java, Node.js) executes. Cannot execute privileged CPU instructions or directly access hardware memory addresses.
* **Kernel Space (Ring 0 on x86 / EL1 on ARM):** Where the Linux kernel core, interrupt handlers, and device drivers live with unrestricted hardware access.

---

#### 🚀 2. The Step-by-Step System Call Journey (\`read(fd, buf, size)\`):
1. **User Application:** Calls standard C library function \`read()\`.
2. **glibc Wrapper:**
   - Loads the designated system call number (\`SYS_read = 0\`) into the CPU register (\`%rax\`).
   - Copies function arguments into architecture registers (\`%rdi\`, \`%rsi\`, \`%rdx\`).
3. **Transition to Kernel:** Executes the \`syscall\` assembly instruction.
4. **Hardware Mode Switch:** CPU switches to Ring 0, saves user instruction pointer (\`%rip\`) and flags, and jumps to kernel entry point \`system_call_entry\`.
5. **Dispatch Table:** Kernel indexes its \`sys_call_table\` and executes the kernel function \`ksys_read()\`.
6. **I/O & Return:** Kernel accesses filesystem/device drivers, places the return value into \`%rax\`, and calls \`sysret\` returning to user space!`,
      sources: ['Linux Kernel Development (Robert Love)', 'Systems Programming with POSIX']
    };
  }

  if (lower.includes('zombie process') || lower.includes('orphan process') || (lower.includes('fork') && lower.includes('exec'))) {
    return {
      text: `### 🧟 Zombie vs. Orphan Processes in Linux

In Unix/Linux process management, process creation follows the classic \`fork()\` and \`exec()\` model:

---

#### 🧟 1. What is a Zombie Process?
* A **Zombie** is a process that has completed execution (\`exit()\`), but its entry still remains in the OS Process Table.
* **Why does it exist?** The kernel preserves the terminated child's exit status and resource usage statistics so its parent process can read them via \`wait()\` or \`waitpid()\`.
* Once the parent calls \`waitpid()\`, the zombie entry is reaped and completely deleted.
* **Danger:** Zombies consume no RAM or CPU, but they hold onto a **Process ID (PID)**. If a buggy parent creates thousands of un-reaped zombies, the system runs out of PIDs and cannot start any new processes!

---

#### 🐣 2. What is an Orphan Process?
* An **Orphan** is a running child process whose parent process has terminated or crashed before the child finished.
* **The Resolution:** Linux automatically adopts orphan processes under **PID 1 (\`init\` or \`systemd\`)**. PID 1 periodically executes \`wait()\` to cleanly reap orphans as soon as they exit!`,
      sources: ['Advanced Programming in the UNIX Environment (Stevens/Rago)', 'Linux Process Model']
    };
  }

  // 4. GERMAN A1
  if (lower.includes('german') || lower.includes('deutsch') || lower.includes('dativ') || lower.includes('akkusativ') || lower.includes('wechselpräpositionen') || lower.includes('modalverben')) {
    if (lower.includes('wechselpräpositionen') || (lower.includes('dativ') && lower.includes('akkusativ'))) {
      return {
        text: `### 🇩🇪 German Grammar: Wechselpräpositionen (Two-Way Prepositions)

The 9 **Wechselpräpositionen** (two-way prepositions) can take **either Dativ OR Akkusativ** depending on the meaning of the sentence:

$$\\mathbf{\\text{an, auf, hinter, in, neben, über, unter, vor, zwischen}}$$

---

#### 🧭 The Golden Rule:
* **Wohin? (Movement / Change of Location / Direction) $\\implies$ AKKUSATIV**
  - *"Ich stelle das Buch **auf den Tisch**."* (I put the book onto the table — Action/Movement $\\to$ masculine *den*).
  - *"Wir gehen **in die Stadt**."* (We are walking into the city $\\to$ feminine *die*).

* **Wo? (Stationary Location / No change of place) $\\implies$ DATIV**
  - *"Das Buch liegt **auf dem Tisch**."* (The book is lying on the table — Position/Stationary $\\to$ masculine *dem*).
  - *"Wir sind **in der Stadt**."* (We are in the city $\\to$ feminine *der*).

---

#### 📋 Quick Article Changes in Dativ & Akkusativ:
| Gender | Nominativ | Akkusativ | Dativ |
|---|---|---|---|
| Masculine | **der / ein** | **den / einen** | **dem / einem** |
| Feminine | **die / eine** | **die / eine** | **der / einer** |
| Neuter | **das / ein** | **das / ein** | **dem / einem** |
| Plural | **die / -** | **die / -** | **den + n** |`,
        sources: ['Goethe-Zertifikat A1 Grammatik', 'Netzwerk Deutsch als Fremdsprache A1']
      };
    }
  }

  // 5. DATA SCIENCE & ML
  if (lower.includes('p-value') || lower.includes('p value') || lower.includes('hypothesis testing') || lower.includes('type 1 error') || lower.includes('type i error')) {
    return {
      text: `### 📊 Hypothesis Testing, P-Values & Type I / Type II Errors

In data science and statistics, **Hypothesis Testing** determines whether an observed pattern or metric difference is statistically significant or merely caused by random sampling noise:

---

#### 🎯 1. The Core Hypotheses:
* **$H_0$ (Null Hypothesis):** Default baseline assumption; there is no effect, no difference, or no relationship.
* **$H_1$ (Alternative Hypothesis):** The research claim; there is a statistically significant effect.

---

#### 💡 2. What is a P-Value?
The **p-value** is the probability of observing a test statistic at least as extreme as the current sample data, **assuming the Null Hypothesis ($H_0$) is strictly true**!
* **Decision Rule:**
  - If $p \\le \\alpha$ (typically $\\alpha = 0.05$): **Reject $H_0$** $\\implies$ Statistically significant result!
  - If $p > \\alpha$: **Fail to Reject $H_0$** $\\implies$ Insufficient evidence.

---

#### ⚖️ 3. Type I vs. Type II Errors:
| Reality | Decision: Reject $H_0$ | Decision: Fail to Reject $H_0$ |
|---|---|---|
| **$H_0$ is Actually TRUE** | ❌ **Type I Error ($\\alpha$)** (False Positive) | ✅ Correct Decision ($1 - \\alpha$) |
| **$H_0$ is Actually FALSE** | ✅ Correct Decision ($1 - \\beta$, **Statistical Power**) | ❌ **Type II Error ($\\beta$)** (False Negative) |

* *Real-world Analogy:*
  - Type I Error: Convicting an innocent person in court.
  - Type II Error: Acquitting a guilty criminal.`,
      sources: ['Inferential Statistics & Analytics', 'Statistical Hypothesis Testing Foundations']
    };
  }

  if (lower.includes('training-serving skew') || lower.includes('training serving skew') || lower.includes('feature store') || lower.includes('feast')) {
    return {
      text: `### ⚠️ Training-Serving Skew & Feature Stores (Feast)

**Training-Serving Skew** is the #1 silent bug class in production machine learning systems, causing models that score 95% in Jupyter notebooks to fail catastrophically in production:

---

#### 💥 1. What Causes Training-Serving Skew?
1. **Code Duplication & Drift:** Feature transformation code is written twice: once in Python Pandas for training notebooks, and rewritten in Java, Go, or FastAPI for live inference. Slight differences in rounding, timezone parsing, or missing value fills corrupt model inputs!
2. **Data Leakage (Lookahead Bias):** Training features accidentally incorporate data from the future that is impossible to know at inference time.
3. **Data Distribution Drift:** Changes in real-world user behavior between when the model was trained and when live requests arrive.

---

#### 🛡️ 2. The Solution: Modern Feature Stores (e.g. Feast)
A **Feature Store** acts as a unified data management layer between data engineering pipelines and ML models:
* **Single Definition:** Features are declared once as declarative code.
* **Offline Store (BigQuery / Snowflake / S3):** Generates point-in-time correct training datasets with zero data leakage.
* **Online Store (Redis / DynamoDB):** Provides sub-millisecond low-latency feature lookups for live production API serving.`,
      sources: ['PlacementPredict ML Engineering', 'Feast: Feature Store for ML', 'Production MLOps']
    };
  }

  // 6. ADVANCED ALGORITHMS (TEXTHACK)
  if (lower.includes('kmp') || lower.includes('knuth morris pratt') || lower.includes('lps array')) {
    return {
      text: `### 🧵 Knuth-Morris-Pratt (KMP) String Matching Algorithm

The **KMP Algorithm** searches for occurrences of a pattern string $P$ of length $m$ inside a text string $T$ of length $n$ in strictly **$O(n + m)$ linear time**, completely eliminating backtracking over the text:

---

#### 💡 1. The Key Insight:
* In naive $O(n \\cdot m)$ search, when a mismatch occurs after matching several characters, the text pointer rewinds back to the next starting character.
* KMP observes: The matched characters themselves tell us the longest prefix of the pattern that is also a suffix of what we just saw! We can jump the pattern forward without ever moving the text pointer backward.

---

#### 📐 2. The LPS ($\pi$) Array:
The **Longest Proper Prefix which is also a Suffix (LPS)** array is precomputed on pattern $P$ in $O(m)$ time:
* \`LPS[i]\` stores the length of the longest proper prefix of $P[0 \\dots i]$ that is also a suffix of $P[0 \\dots i]$.

#### 💻 Step-by-Step KMP Search:
\`\`\`cpp
void computeLPS(string& pat, vector<int>& lps) {
    int len = 0, i = 1;
    lps[0] = 0;
    while (i < pat.length()) {
        if (pat[i] == pat[len]) {
            lps[i++] = ++len;
        } else {
            if (len != 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
    }
}
\`\`\`
* Total comparisons: At most $2n$ comparisons across the text, guaranteeing strictly linear $O(n + m)$ performance!`,
      sources: ['TextHack String Algorithm Canon', 'Introduction to Algorithms (CLRS)', 'Advanced String Algorithms']
    };
  }

  if (lower.includes('dinic') || lower.includes('max flow') || lower.includes('ford fulkerson') || lower.includes('edmonds karp')) {
    return {
      text: `### 🌊 Network Flow: Dinic's Algorithm & Max-Flow Min-Cut

**Maximum Network Flow** solves the optimal routing of fluid, network traffic, or tasks from a Source node $s$ to a Sink node $t$ under capacity constraints:

---

#### 🏆 1. Why Dinic's Algorithm is the Industrial Standard:
* **Ford-Fulkerson:** $O(E \\cdot |f^*|)$ — dependent on flow values; can loop infinitely on irrational capacities.
* **Edmonds-Karp:** $O(V \\cdot E^2)$ — uses BFS to find augmenting paths.
* **Dinic's Algorithm:** Strictly **$O(V^2 \\cdot E)$** on general networks, and **$O(E \\sqrt{V})$** on unit networks (such as bipartite matching)!

---

#### ⚙️ 2. The Two-Phase Mechanism of Dinic's:
1. **Level Graph Construction (BFS):**
   * Run a BFS from Source $s$ to compute the distance $level[u]$ to every node.
   * If Sink $t$ is unreachable, the algorithm terminates!
2. **Blocking Flow (DFS with Pointer Elimination):**
   * Pushes flow exclusively along **admissible edges** where $level[v] = level[u] + 1$.
   * Uses an iterator pointer array \`ptr[]\` to avoid revisiting dead-end saturated edges, ensuring each search step does productive work.

---

#### ✂️ 3. The Max-Flow Min-Cut Theorem:
The maximum throughput of flow through the network is **strictly equal to the minimum total capacity of edges** whose removal disconnects the Source from the Sink!`,
      sources: ['Combinatorial Optimization (Kleinberg-Tardos)', 'Dinic Network Flow Canon']
    };
  }

  if (lower.includes('np-complete') || lower.includes('np complete') || lower.includes('cook levin') || lower.includes('p vs np')) {
    return {
      text: `### 🧩 P vs. NP, NP-Completeness & The Cook-Levin Theorem

The **P vs. NP problem** is the most famous open question in theoretical computer science and mathematics (a Clay Millennium Prize Problem):

---

#### 🏛️ 1. The Core Complexity Classes:
* **Class P (Polynomial Time):** Decision problems that can be **solved** by a deterministic Turing machine in polynomial time ($O(n^k)$) — e.g., Shortest Path, Sorting, Minimum Spanning Tree.
* **Class NP (Nondeterministic Polynomial Time):** Decision problems where a proposed solution ("certificate") can be **verified** in polynomial time — e.g., 3-SAT, Traveling Salesperson, Subset-Sum.
* **P $\\subseteq$ NP:** Any problem that can be solved in polynomial time can trivially be verified in polynomial time. *The $1M question is: Is P = NP?*

---

#### 👑 2. NP-Completeness & The Cook-Levin Theorem:
* A problem $X$ is **NP-Complete** if:
  1. $X \\in NP$.
  2. Every problem in NP can be reduced to $X$ in polynomial time ($X$ is **NP-Hard**).
* **The Cook-Levin Theorem (1971):** Proved that **Boolean Satisfiability (SAT)** is NP-Complete by formally showing that any polynomial-time verification computation of a nondeterministic Turing machine can be encoded as a Boolean formula in Conjunctive Normal Form (CNF)!
* If anyone finds a polynomial-time algorithm for **even one** NP-complete problem, then $P = NP$ and **every problem in NP becomes solvable in polynomial time**!`,
      sources: ['Introduction to the Theory of Computation (Sipser)', 'CLRS Complexity Canon']
    };
  }

  if (lower.includes('miller rabin') || lower.includes('primality test') || lower.includes('blelloch scan') || lower.includes('parallel prefix')) {
    return {
      text: `### 🎲 Miller-Rabin Primality Test & Blelloch Parallel Scan

Two pinnacle algorithms in randomised cryptography and high-performance parallel computation:

---

#### 🔐 1. The Miller-Rabin Primality Test (Monte Carlo):
* Determines whether an integer $n$ is prime in $O(k \\log^3 n)$ operations without slow trial division!
* Writes $n - 1 = 2^s \\cdot d$ where $d$ is odd.
* For a random base $a \\in [2, n-2]$, checks if $a^d \\equiv 1 \\pmod n$ or $a^{2^r d} \\equiv -1 \\pmod n$ for some $0 \\le r < s$.
* If neither holds, $a$ is a **witness** that $n$ is composite!
* Running $k$ independent tests reduces the probability of a false prime down to at most $\\left(\\frac{1}{4}\\right)^k$ (at $k=40$, error rate is $< 10^{-24}$).

---

#### ⚡ 2. The Blelloch Parallel Scan (Prefix-Sum):
Computes running prefix sums across an array $[x_0, x_0+x_1, \\dots]$ in parallel on GPUs:
* **Up-Sweep (Reduce Phase):** Computes sums of leaves up a balanced binary tree. Work: $O(N)$, Span: $O(\\log N)$.
* **Down-Sweep Phase:** Replaces root with $0$ and passes running totals down the branches. Work: $O(N)$, Span: $O(\\log N)$.
* Runs in strictly $O(\\log N)$ time on parallel SIMD processors, acting as the foundation for parallel sorting and GPU shaders!`,
      sources: ['Randomised Algorithms (Motwani/Raghavan)', 'Parallel Computation & GPU Algorithms']
    };
  }

  return null;
}
