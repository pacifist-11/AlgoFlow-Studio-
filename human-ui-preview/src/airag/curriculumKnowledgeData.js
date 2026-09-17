// ─── AlgoFlow Comprehensive Computer Science & Engineering Knowledge Base ─────────
// Deep Domain Coverage: Design Thinking, Discrete Mathematics, Java & Data Structures,
// Web Technologies, Professional Soft Skills, Backend & Microservices, Data Science,
// Machine Learning, Embedded Systems, Operating Systems, Advanced Algorithms & German A1.

import { EXPANDED_COURSES_KNOWLEDGE_BASE, findExpandedCoursesDirectResponse } from './expandedCurriculumData.js';

const BASE_CURRICULUM_KNOWLEDGE = [
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DESIGN THINKING & INNOVATION
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Design Thinking: Core Principles, Desirability, Feasibility & Viability",
    keywords: ["design thinking", "design thinking principles", "desirability", "feasibility", "viability", "mystery", "heuristics", "algorithm in design", "blind spots", "design framework", "l0 framework"],
    summary: "Design Thinking is a human-centered, iterative problem-solving methodology that balances human desirability, technical feasibility, and economic viability.",
    primaryLang: "Product Design & Innovation Framework",
    placementDemand: "Product Management, UI/UX & Systems Architecture",
    content: `Core Tenets of Design Thinking:
1. **The Innovation Sweet Spot (IDEO Venn Diagram):**
   • **Desirability (Human):** Does it solve a real human pain point? Do users actually want or love this solution?
   • **Feasibility (Technical):** Can we realistically build, scale, and maintain it with current or near-term technology?
   • **Viability (Business):** Is the economic business model sustainable, profitable, and strategically aligned?
   • *Innovation occurs strictly at the intersection of all three.*

2. **The Knowledge Funnel (Roger Martin):**
   • **Mystery:** An unstructured, ambiguous problem with unknown variables.
   • **Heuristics:** A rule-of-thumb or pattern-based intuitive approach to narrow the problem space.
   • **Algorithm:** A standardized, repeatable, and scalable procedure to produce predictable results every time.

3. **Cognitive Blind Spots & Patterns:**
   • Identifying assumptions, cognitive biases, and unstated user needs through continuous observational empathy.`
  },
  {
    topic: "Laws of Design Thinking & The Design Mind: SEPIA, DCAFE & VAL",
    keywords: ["laws of design thinking", "less is more", "last 2% equals 200%", "theory of prioritization", "sepia", "dcafe", "val", "5 forces of growth", "frictional forces", "capacity levers", "sustainable development goals", "sdg"],
    summary: "Guiding laws and mental models of design innovation: simplification laws, SEPIA growth drivers, DCAFE frictions, and VAL capacity levers.",
    primaryLang: "Innovation Strategy & Systems Engineering",
    placementDemand: "Executive Product Engineering & Design Strategy",
    content: `Laws of Design Innovation & Strategic Models:
1. **Foundational Laws:**
   • **Less is More:** Eliminating visual and functional clutter amplifies focus on core value propositions.
   • **The Last 2% Equals 200% Rule:** The final 2% of polish, micro-interactions, accessibility, and edge-case refinement produces 200% of perceived user delight and market differentiation.
   • **Theory of Prioritization:** Applying MoSCoW (Must, Should, Could, Won't) and Impact vs. Effort matrices to maximize ROI under constraint.

2. **The 5 Forces of Growth (SEPIA):**
   • **S - Scale:** Expandability of the solution without proportional cost growth.
   • **E - Experience:** Seamless, frictionless user emotional and operational journey.
   • **P - Partnership:** Strategic ecosystem and API integrations.
   • **I - Intelligence:** Continuous data-driven insights and AI/automation loops.
   • **A - Agility:** Speed of rapid iteration, pivot, and adaptation.

3. **The 5 Frictional Forces (DCAFE):**
   • **D - Inertia / Doubt:** User resistance to adopting new workflows.
   • **C - Complexity:** Cognitive overload and interface clutter.
   • **A - Anxiety:** User fear of errors, data loss, or system failure.
   • **F - Friction:** Physical and digital friction (excessive clicks, latency).
   • **E - Effort:** Energy and time required to complete tasks.

4. **The 3 Capacity Levers (VAL):**
   • **V - Vision:** Compelling clarity of the ultimate end-state.
   • **A - Alignment:** Cross-functional synergy between tech, business, and design.
   • **L - Leadership:** Empowering experimentation without fear of failure.

5. **SDGs in Design:** Integrating the 17 UN Sustainable Development Goals (climate, equality, accessible education) directly into product requirements.`
  },
  {
    topic: "Design Thinking Process: Empathy, Personas, Journey Maps & Define Phase",
    keywords: ["empathy research", "persona development", "customer journey mapping", "define phase", "problem statement", "how might we", "hmw", "user needs"],
    summary: "The structured multi-stage design process: observational user empathy, archetypal persona creation, end-to-end journey mapping, and actionable problem statement formulation.",
    primaryLang: "User Research & Product Discovery",
    placementDemand: "UX Strategy, Interaction Design, Product Innovation",
    content: `Discovery & Definition Frameworks:
1. **Empathy Research:**
   • Immersive user interviews, field shadowing, and "Fly-on-the-Wall" observation.
   • Empathy Map quadrants: Says, Thinks, Does, Feels. Uncovering contradictions between what users *say* and what they *actually do*.

2. **Persona Development:**
   • Archetypal representation of target users based on empirical research data.
   • Components: Demographics, Behaviors, Tech Savviness, Core Goals, and Emotional Frustrations/Pain Points.

3. **Customer Journey Mapping (CJM):**
   • Visualizing user touchpoints chronologically: Awareness ➔ Consideration ➔ Onboarding ➔ Core Usage ➔ Advocacy/Churn.
   • Tracking emotional highs and lows along with friction hotspots at each step.

4. **Define Phase & "How Might We" (HMW):**
   • Transforming ambiguous complaints into precise, actionable Problem Statements:
     *"[User] needs [Goal] because [Deep Root Cause/Insight]."*
   • Reframing into HMW questions: *"How might we enable first-time developers to understand pointer arithmetic without intimidating jargon?"*`
  },
  {
    topic: "Ideation, Prototyping & Testing: Mind Mapping, 10/100/1000 gm & Tangible Prototypes",
    keywords: ["ideation", "brainstorming", "mind mapping", "patterns and anti-patterns", "10/100/1000 gm", "prototyping", "tangible prototypes", "usability testing", "idea evaluation"],
    summary: "Systematic creative ideation techniques, anti-pattern avoidance, the 10/100/1000 gm evaluation framework, and rapid iterative prototyping.",
    primaryLang: "Design Execution & Prototyping",
    placementDemand: "Agile Development & User Experience Engineering",
    content: `Ideation & Prototyping Methodology:
1. **Ideation Techniques & Mind Mapping:**
   • Brainstorming with deferment of judgment: Quantity breeds quality in early stages.
   • Mind Mapping: Radial tree diagrams radiating from a central core problem to explore lateral concept branches.
   • SCAMPER: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse.

2. **Patterns vs. Anti-Patterns in Ideation:**
   • *Pattern:* "Yes, and..." lateral expansion, cross-pollination from unrelated domains.
   • *Anti-Pattern:* Early judgment ("That will never work"), premature optimization, HiPPO effect (Highest Paid Person's Opinion dominating).

3. **Idea Evaluation: The 10 / 100 / 1000 gm Criterion:**
   • **10 gm (Featherweight):** Low effort, instant micro-enhancements or quick UI wins implementable in days.
   • **100 gm (Midweight):** Substantial feature additions with moderate engineering effort and measurable quarter impact.
   • **1000 gm (Heavyweight):** Deep architectural innovations, platform shifts, or patented paradigm changes requiring strategic commitment.

4. **Tangible Prototyping & Testing:**
   • Low-Fidelity: Paper sketches, wireframes, Wizard-of-Oz prototypes (simulating backend intelligence manually).
   • High-Fidelity: Interactive clickable mockups and code prototypes.
   • Testing: Usability testing with 5 users to discover ~85% of critical usability flaws (Nielsen Norman Law).`
  },
  {
    topic: "Entrepreneurial Innovation: Business Models, Financial Estimation, Pitch Decks & IPR",
    keywords: ["innovation management", "business model canvas", "financial estimation", "pitch deck", "ipr", "intellectual property", "patents", "complete specification document", "patent specification", "prior art"],
    summary: "Translating innovative designs into scalable business ventures: Business Model Canvas, unit economics estimation, venture pitch decks, and patent documentation.",
    primaryLang: "Technology Entrepreneurship & IP Law",
    placementDemand: "Startup Founders, Tech Leads, Patent Analysts",
    content: `Venture Innovation & IP Framework:
1. **Business Model Canvas (BMC - Alexander Osterwalder):**
   • 9 Strategic Building Blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure.

2. **Financial Estimation & Unit Economics:**
   • Customer Acquisition Cost (CAC) vs. Lifetime Value (LTV) — healthy venture benchmark: $\\text{LTV} \\ge 3 \\times \\text{CAC}$.
   • Burn Rate & Runway Calculation: $\\text{Runway (Months)} = \\frac{\\text{Cash Balance}}{\\text{Monthly Net Burn}}$.
   • Break-Even Point: $\\text{Units} = \\frac{\\text{Fixed Costs}}{\\text{Price per Unit} - \\text{Variable Cost per Unit}}$.

3. **The 10-Slide Persuasive Pitch Deck Structure:**
   • 1. Title/Tagline ➔ 2. Problem ➔ 3. Solution/Demo ➔ 4. Market Size (TAM, SAM, SOM) ➔ 5. Product Architecture ➔ 6. Business Model ➔ 7. Traction/Validation ➔ 8. Competitive Advantage (Moat) ➔ 9. Team ➔ 10. The Ask & Use of Funds.

4. **Intellectual Property Rights (IPR) & Patenting:**
   • **Types of IP:** Patents (Functional inventions), Copyrights (Original code/art), Trademarks (Brand identifiers), Trade Secrets (Algorithms/Formulas).
   • **Patent Complete Specification Document:**
     - Title of Invention & Technical Field.
     - Background & Prior Art limitations.
     - Summary of Invention & Detailed Description with drawings.
     - **Patent Claims (Legal Core):** Independent Claims (broadest protection) and Dependent Claims (specific fallback embodiments). Must prove Novelty, Non-Obviousness, and Industrial Applicability.`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. DISCRETE MATHEMATICS & STRUCTURES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Discrete Mathematics: Set Theory, Venn Diagrams, Cartesian Products & Inclusion-Exclusion",
    keywords: ["sets", "subsets", "power set", "cartesian product", "set operations", "venn diagram", "inclusion exclusion", "principle of inclusion exclusion", "computer representation of sets", "bit vector sets"],
    summary: "Foundations of discrete set theory: operations, cardinality, power sets, Cartesian products, bit string representations, and the Inclusion-Exclusion principle.",
    primaryLang: "Discrete Mathematics & CS Theory",
    placementDemand: "Database Query Optimization & Algorithm Design",
    content: `Set Theory Principles & Computer Representation:
1. **Definitions & Notation:**
   • Set: An unordered collection of distinct objects ($S = \\{x \\mid P(x)\\}$).
   • Subset: $A \\subseteq B \\iff \\forall x (x \\in A \\implies x \\in B)$. Proper subset $A \\subset B$ if $A \\subseteq B$ and $A \\neq B$.
   • Empty Set: $\\emptyset$ or $\\{\\}$. Universal Set: $U$.

2. **Power Set:**
   • The set of all subsets of $S$: $\\mathcal{P}(S)$.
   • **Cardinality Formula:** If $|S| = n$, then $|\\mathcal{P}(S)| = 2^n$.
   • *Example:* For $S = \\{1, 2\\}$, $\\mathcal{P}(S) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$, length $= 2^2 = 4$.

3. **Cartesian Product:**
   • $A \\times B = \\{(a, b) \\mid a \\in A \\land b \\in B\\}$.
   • Cardinality: $|A \\times B| = |A| \\times |B|$.
   • Forms the mathematical foundation for relational database tables (tuples).

4. **Principle of Inclusion-Exclusion (PIE):**
   • For 2 sets: $|A \\cup B| = |A| + |B| - |A \\cap B|$
   • For 3 sets:
     $$|A \\cup B \\cup C| = |A| + |B| + |C| - (|A \\cap B| + |A \\cap C| + |B \\cap C|) + |A \\cap B \\cap C|$$

5. **Computer Representation of Sets (Bit Strings / Bitmasks):**
   • Let universal set $U = \\{e_1, e_2, \\dots, e_n\\}$. A subset $A$ is stored as an $n$-bit binary integer where bit $i = 1$ if $e_i \\in A$, else $0$.
   • Union: Bitwise OR (\`A | B\`). Intersection: Bitwise AND (\`A & B\`). Complement: Bitwise NOT (\`~A\`). Runs in $O(1)$ hardware CPU cycles!`
  },
  {
    topic: "Relations, Equivalence, Posets, Hasse Diagrams & Lattices",
    keywords: ["relations", "properties of relations", "reflexive", "symmetric", "transitive", "antisymmetric", "equivalence relation", "poset", "partially ordered set", "hasse diagram", "lattice", "lattices"],
    summary: "Binary relations and their mathematical properties, equivalence relations, partial orderings (Posets), Hasse diagram construction, and Lattices.",
    primaryLang: "Relational Theory & Abstract Algebra",
    placementDemand: "Type Systems, Compiler Dependency Graphs, Database Semantics",
    content: `Relations, Order Theory & Lattices:
1. **Properties of a Binary Relation $R$ on set $A$:**
   • **Reflexive:** $\\forall x \\in A, (x, x) \\in R$.
   • **Symmetric:** $\\forall x, y \\in A, (x, y) \\in R \\implies (y, x) \\in R$.
   • **Antisymmetric:** $\\forall x, y \\in A, ((x, y) \\in R \\land (y, x) \\in R) \\implies x = y$.
   • **Transitive:** $\\forall x, y, z \\in A, ((x, y) \\in R \\land (y, z) \\in R) \\implies (x, z) \\in R$.

2. **Equivalence Relation:**
   • A relation that is **Reflexive, Symmetric, and Transitive**.
   • Partitions set $A$ into disjoint **Equivalence Classes** ($[a] = \\{x \\in A \\mid (a, x) \\in R\\}$).

3. **Partial Ordering & Poset:**
   • A relation is a **Partial Order** if it is **Reflexive, Antisymmetric, and Transitive**.
   • A set $S$ together with partial order $\\le$ is denoted as a **Poset** $(S, \\le)$ (e.g., $(\\mathbb{Z}^+, |)$ divisibility, $(\\mathcal{P}(S), \\subseteq)$ subset inclusion).

4. **Hasse Diagrams:**
   • A simplified graphical representation of a finite Poset:
     - Vertices represent elements.
     - Eliminate all self-loops (due to reflexivity).
     - Eliminate all transitive edges (if $a \\le b$ and $b \\le c$, omit direct edge $a \\rightarrow c$).
     - Draw element $y$ higher than $x$ if $x \\le y$, connecting with an upward line.

5. **Lattices:**
   • A Poset in which every pair of elements has a unique:
     - **Least Upper Bound (LUB / Supremum / Join):** $a \\vee b$
     - **Greatest Lower Bound (GLB / Infimum / Meet):** $a \\wedge b$`
  },
  {
    topic: "Discrete Functions, CS Floor/Ceiling, Boolean Functions & Cardinality",
    keywords: ["functions", "injective", "surjective", "bijective", "one to one", "onto", "inverse function", "composite function", "ceiling function", "floor function", "boolean function"],
    summary: "Mathematical functions: injective, surjective, and bijective mappings, composition, inverses, floor and ceiling functions in computer science, and Boolean functions.",
    primaryLang: "Discrete Mathematics & Cryptography",
    placementDemand: "Hash Function Design, Cryptography & Algorithm Analysis",
    content: `Functions in Computer Science:
1. **Types of Functions ($f: A \\rightarrow B$):**
   • **Injective (One-to-One):** $f(a_1) = f(a_2) \\implies a_1 = a_2$. Distinct inputs map to distinct outputs. Essential for collision-free hash functions.
   • **Surjective (Onto):** $\\forall b \\in B, \\exists a \\in A \\text{ such that } f(a) = b$. Range equals Codomain.
   • **Bijective (One-to-One Correspondence):** Both Injective and Surjective. A bijection guarantees that an **Inverse Function** $f^{-1}: B \\rightarrow A$ exists! (Foundational for symmetric encryption/decryption).

2. **Composition of Functions:**
   • $(g \\circ f)(x) = g(f(x))$. Associative: $h \\circ (g \\circ f) = (h \\circ g) \\circ f$.

3. **Core Functions for Computer Science:**
   • **Floor Function ($\\lfloor x \\rfloor$):** Largest integer $\\le x$. Example: $\\lfloor 3.7 \\rfloor = 3$, $\\lfloor -2.3 \\rfloor = -3$. Used for integer division.
   • **Ceiling Function ($\\lceil x \\rceil$):** Smallest integer $\\ge x$. Example: $\\lceil 3.2 \\rceil = 4$, $\\lceil -2.8 \\rceil = -2$. Used for buffer allocation and binary search tree height: $h = \\lceil \\log_2(n+1) \\rceil$.

4. **Boolean Functions:**
   • Mappings from $f: \\{0, 1\\}^n \\rightarrow \\{0, 1\\}$. Can be represented via Truth Tables, Karnaugh Maps (K-Maps), or Disjunctive Normal Form (DNF).`
  },
  {
    topic: "Mathematical Logic, Propositional Equivalences, Inference Rules & Quantifiers",
    keywords: ["propositional logic", "truth tables", "propositional equivalences", "rules of inference", "modus ponens", "modus tollens", "predicates and quantifiers", "universal quantifier", "existential quantifier", "negation of quantified statements", "de morgan's laws"],
    summary: "Formal logic foundations: propositions, logical connectives, equivalences, formal rules of inference, predicates, quantifiers, and quantifier negation.",
    primaryLang: "Formal Verification, AI Logic & Discrete Structures",
    placementDemand: "Automated Theorem Proving, Hardware Verification, SQL Logic",
    content: `Formal Logic & Inference Systems:
1. **Logical Connectives & Truth Table Truths:**
   • Negation ($\\neg$), Conjunction ($\\land$, AND), Disjunction ($\\lor$, OR), Exclusive OR ($\\oplus$, XOR).
   • **Conditional ($p \\implies q$):** False *only* when $p$ is True and $q$ is False. Equivalently $\\neg p \\lor q$.
   • **Biconditional ($p \\iff q$):** True when both $p$ and $q$ have identical truth values.

2. **Core Propositional Equivalences:**
   • **De Morgan's Laws:**
     $$\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q \\qquad \\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$$
   • **Contrapositive:** $p \\implies q \\equiv \\neg q \\implies \\neg p$ (Logically equivalent!).
   • **Converse & Inverse:** $q \\implies p$ (Converse) and $\\neg p \\implies \\neg q$ (Inverse) are NOT equivalent to $p \\implies q$.

3. **Rules of Inference (Building Valid Arguments):**
   • **Modus Ponens:** $[p \\land (p \\implies q)] \\implies q$
   • **Modus Tollens:** $[\\neg q \\land (p \\implies q)] \\implies \\neg p$
   • **Hypothetical Syllogism:** $[(p \\implies q) \\land (q \\implies r)] \\implies (p \\implies r)$
   • **Disjunctive Syllogism:** $[(p \\lor q) \\land \\neg p] \\implies q$
   • **Resolution:** $[(p \\lor q) \\land (\\neg p \\lor r)] \\implies (q \\lor r)$ (Core of Prolog and SAT solvers).

4. **Predicates & Quantifiers:**
   • **Universal Quantifier ($\\forall x P(x)$):** True for every element in domain.
   • **Existential Quantifier ($\\exists x P(x)$):** True for at least one element in domain.
   • **Negation of Quantifiers (Generalized De Morgan's):**
     $$\\neg(\\forall x P(x)) \\equiv \\exists x \\neg P(x) \\qquad \\neg(\\exists x P(x)) \\equiv \\forall x \\neg P(x)$$`
  },
  {
    topic: "Proof Methods & Counting: Pigeonhole Principle, Permutations & Combinations",
    keywords: ["proof methods", "direct proof", "indirect proof", "proof by contradiction", "proof by contraposition", "counting", "pigeonhole principle", "permutations and combinations", "combinatorics"],
    summary: "Mathematical proof techniques (Direct, Contraposition, Contradiction) and combinatorial counting principles including the Pigeonhole Principle.",
    primaryLang: "Discrete Mathematics & Algorithm Analysis",
    placementDemand: "Algorithm Complexity, Cryptographic Protocols, Coding Theory",
    content: `Proof Methods & Combinatorics:
1. **Methods of Mathematical Proof:**
   • **Direct Proof:** Assume hypothesis $P$ is true, use definitions, axioms, and established theorems to logically derive conclusion $Q$.
   • **Proof by Contraposition (Indirect):** Prove the equivalent contrapositive $\\neg Q \\implies \\neg P$. Assume $\\neg Q$, show $\\neg P$.
   • **Proof by Contradiction (Reductio ad Absurdum):** To prove proposition $P$, assume $\\neg P$ is true. Derive a logical impossibility or contradiction ($R \\land \\neg R$). Conclude $P$ must be true! (e.g., proving $\\sqrt{2}$ is irrational, or that there are infinitely many primes).

2. **The Pigeonhole Principle:**
   • **Basic Form:** If $k+1$ or more objects (pigeons) are placed into $k$ boxes (holes), at least one box must contain 2 or more objects.
   • **Generalized Form:** If $N$ objects are placed into $k$ boxes, at least one box contains at least $\\lceil N/k \\rceil$ objects.
   • *CS Applications:* Hash table collision inevitability when $N > M$, Lossless data compression limits.

3. **Fundamental Counting Rules:**
   • **Sum Rule:** Disjoint independent events $A$ or $B$: $|A| + |B|$.
   • **Product Rule:** Sequential multi-stage events $A$ then $B$: $|A| \\times |B|$.
   • **Permutations (Order Matters):**
     $$P(n, r) = \\frac{n!}{(n - r)!}$$
   • **Combinations (Order Does NOT Matter):**
     $$C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}$$`
  },
  {
    topic: "Recurrence Relations: Characteristic Roots, Generating Functions & Master Theorem",
    keywords: ["recurrence relations", "linear recurrence relations", "characteristic roots", "generating functions", "recurrence with constant coefficients", "solving recurrence"],
    summary: "Analytical methods for solving linear recurrence relations: the characteristic roots method, generating functions, and recurrence applications.",
    primaryLang: "Algorithm Analysis & Discrete Math",
    placementDemand: "Divide-and-Conquer Complexity & Asymptotic Analysis",
    content: `Solving Recurrence Relations:
1. **Linear Homogeneous Recurrence with Constant Coefficients:**
   • Form: $a_n = c_1 a_{n-1} + c_2 a_{n-2} + \\dots + c_k a_{n-k}$ where $c_i$ are constants and $c_k \\neq 0$.

2. **The Characteristic Roots Method:**
   • Step 1: Write the **Characteristic Equation**: $r^k - c_1 r^{k-1} - c_2 r^{k-2} - \\dots - c_k = 0$.
   • Step 2: Find the roots $r_1, r_2, \\dots, r_k$.
   • **Case A (Distinct Real Roots):** General solution:
     $$a_n = \\alpha_1 r_1^n + \\alpha_2 r_2^n + \\dots + \\alpha_k r_k^n$$
   • **Case B (Repeated Roots of Multiplicity $m$):** For root $r_1$ of multiplicity $m$:
     $$(\\alpha_{1,0} + \\alpha_{1,1} n + \\dots + \\alpha_{1,m-1} n^{m-1}) r_1^n$$
   • Step 3: Use initial conditions (e.g. $a_0, a_1$) to solve linear system for constants $\\alpha_i$.
   • *Classic Fibonacci:* $F_n = F_{n-1} + F_{n-2} \\implies r^2 - r - 1 = 0 \\implies r = \\frac{1 \\pm \\sqrt{5}}{2}$ (Binet's Formula).

3. **Generating Functions:**
   • A formal power series whose coefficients represent terms of a sequence:
     $$G(x) = \\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + \\dots$$
   • Enables algebraic manipulation of recurrence relations into closed rational functions $\\frac{P(x)}{Q(x)}$, decomposed via partial fractions.`
  },
  {
    topic: "Graph Theory: Isomorphism, Euler & Hamiltonian Graphs, Planarity & Coloring",
    keywords: ["graph theory", "representation of graphs", "types of graphs", "graph isomorphism", "euler graph", "hamiltonian graph", "euler path", "eulerian circuit", "planar graphs", "graph coloring", "chromatic number", "four color theorem", "euler formula planar"],
    summary: "Graph representations (Adjacency Matrix/List), Euler and Hamiltonian tours, graph isomorphism, Euler's planar formula, and chromatic vertex coloring.",
    primaryLang: "Graph Algorithms & Network Topology",
    placementDemand: "Compilers (Register Allocation), Route Optimization, Circuit Layout",
    content: `Graph Theory Foundations & Theorems:
1. **Graph Representations:**
   • **Adjacency Matrix:** $V \\times V$ boolean/weight matrix. Space: $O(V^2)$. Edge lookup: $O(1)$. Best for dense graphs.
   • **Adjacency List:** Array of linked lists or vectors. Space: $O(V + E)$. Neighbor scan: $O(\\deg(v))$. Best for sparse graphs.

2. **Graph Isomorphism:**
   • Graphs $G_1 = (V_1, E_1)$ and $G_2 = (V_2, E_2)$ are isomorphic if there exists a bijection $f: V_1 \\rightarrow V_2$ such that $(u, v) \\in E_1 \\iff (f(u), f(v)) \\in E_2$.
   • Invariants preserved: $|V|$, $|E|$, degree sequences, presence of cycles of length $k$.

3. **Eulerian vs. Hamiltonian Graphs:**
   • **Euler Path / Circuit (Traverses every EDGE exactly once):**
     - Euler Circuit: Connected graph where **every vertex has an EVEN degree**.
     - Euler Path: Connected graph with **exactly 0 or 2 vertices of ODD degree**.
     - Solvable in polynomial time: $O(V + E)$ via Hierholzer's algorithm.
   • **Hamiltonian Path / Cycle (Visits every VERTEX exactly once):**
     - Determining if a general graph is Hamiltonian is **NP-Complete**!
     - *Dirac's Theorem:* If $n \\ge 3$ and $\\deg(v) \\ge n/2$ for all $v$, $G$ is Hamiltonian.

4. **Planar Graphs & Euler's Formula:**
   • A graph is **Planar** if it can be drawn in the plane without crossing edges.
   • **Euler's Planar Formula:** For any connected planar graph with $V$ vertices, $E$ edges, and $F$ faces:
     $$V - E + F = 2$$
   • Planar Edge Bound: $E \\le 3V - 6$ (for $V \\ge 3$).
   • *Kuratowski's Theorem:* A graph is planar $\\iff$ it contains no subgraph homeomorphic to $K_5$ or $K_{3,3}$.

5. **Graph Coloring & Chromatic Number ($\\chi(G)$):**
   • Assigning colors to vertices such that no two adjacent vertices share the same color.
   • **Chromatic Number $\\chi(G)$:** Minimal number of colors required.
   • **Four Color Theorem:** Any planar map can be colored using at most **4 colors**!
   • *Application:* Compiler register allocation, school exam scheduling without room conflicts.`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PROFESSIONAL COMMUNICATION & SOFT SKILLS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Professional Communication: Effective Listening, Comprehension & Probing Questions",
    keywords: ["techniques of effective listening", "listening and comprehension", "probing questions", "barriers to listening", "active listening"],
    summary: "Techniques for active and critical listening, comprehension frameworks, formulation of probing questions, and overcoming cognitive and environmental listening barriers.",
    primaryLang: "Professional Engineering Communication",
    placementDemand: "Technical Interviews, Client Discovery & Team Leadership",
    content: `Active Listening & Comprehensive Ingestion:
1. **Techniques of Effective Listening:**
   • **Active Engagement:** Giving verbal affirmations and maintaining supportive body language without interrupting.
   • **Paraphrasing & Mirroring:** Summarizing the speaker's thoughts back in your own words: *"What I hear you saying is that the database connection pool is exhausting under peak load..."*
   • **Withholding Premature Judgment:** Suspending internal rebuttal generation until the speaker has fully articulated their thought.

2. **Listening Comprehension Levels:**
   • Literal Comprehension (direct facts) ➔ Inferential (reading between the lines) ➔ Evaluative (judging logical validity).

3. **Formulating Probing Questions:**
   • **Clarifying Questions:** *"Could you walk me through what happens when this API call fails?"*
   • **Elaborating Questions:** *"What other alternatives did the team evaluate before choosing microservices?"*
   • **Hypothetical Probing:** *"If traffic scales 10x overnight, which subsystem will bottleneck first?"*

4. **Barriers to Listening:**
   • Environmental: Acoustic noise, screen notifications.
   • Psychological: Confirmation bias, defensiveness, anxiety.
   • Physiological: Cognitive fatigue, information overload.`
  },
  {
    topic: "Critical Reading & Textual Interpretation: Claims, Arguments & Theories",
    keywords: ["techniques of effective reading", "gathering ideas from text", "identify the main claim", "purpose of the text", "context of the text", "evaluating arguments", "interpret the text", "what text says does means"],
    summary: "Advanced analytical reading techniques: skimming, scanning, argument evaluation, implicit assumptions detection, and the three tiers of textual interpretation.",
    primaryLang: "Academic Research & Technical Literacy",
    placementDemand: "Research Paper Review, System Specifications, Architectural Audits",
    content: `Analytical Reading & Information Deconstruction:
1. **Effective Reading Strategies:**
   • **Skimming:** Rapid visual overview to capture central thesis, section hierarchy, and key conclusions.
   • **Scanning:** Targeted search for specific empirical data, definitions, or algorithms.
   • **Close / Critical Reading:** Thorough deconstruction of methodology, proofs, and edge conditions.

2. **Gathering Ideas & Evaluating Claims:**
   • **Main Claim (Thesis):** The primary assertion the author seeks to defend.
   • **Purpose & Context:** Identifying why the document was created and the technological/historical landscape it addresses.
   • **Evaluating Arguments:** Distinguishing sound empirical evidence from anecdotal assertions; uncovering unstated foundational assumptions.

3. **The 3 Tiers of Textual Interpretation:**
   • **What the text SAYS:** Direct literal statements and factual data.
   • **What the text DOES:** Functional role of the section (e.g., provides a counter-argument, provides empirical validation, illustrates via an edge case).
   • **What the text MEANS:** Broader implications, theoretical consequences, and practical engineering significance.`
  },
  {
    topic: "Technical & Professional Writing: Logical Sequencing, Emails, Proposals & MoM",
    keywords: ["writing and different modes of writing", "clearly state the claims", "avoid ambiguity", "signposting techniques", "logical sequence", "narrative sequence", "emails", "proposal writing", "proceedings of meetings", "minutes of meeting", "mom"],
    summary: "Clear, unambiguous technical and professional writing: claim construction, signposting, logical structural sequencing, emails, proposals for higher studies, and Minutes of Meetings (MoM).",
    primaryLang: "Technical Documentation & Professional Prose",
    placementDemand: "Engineering Proposals, Academic Applications, Corporate Correspondence",
    content: `Professional Technical Writing Architecture:
1. **Core Writing Tenets:**
   • **State Claims Clearly:** Front-load key takeaways (BLUF: Bottom Line Up Front).
   • **Eliminate Ambiguity & Oversimplification:** Avoid vague qualifiers (*"very fast"*, *"large"*) in favor of quantitative metrics (*"p99 latency under 25ms"*).
   • **Signposting Techniques:** Transitional connective phrases (*"Consequently"*, *"In contrast"*, *"Furthermore"*) that guide the reader through complex arguments.

2. **Structural Sequencing Patterns:**
   • **Logical Sequence:** Deductive reasoning proceeding from universal principles to specific application proofs.
   • **Narrative Sequence:** Chronological case study of problem emergence, debugging steps, and resolution.
   • **Categorical Groupings:** Deconstructing an architecture into orthogonal components (Frontend, Backend, Infrastructure).

3. **Professional Writing Modes:**
   • **Professional Email:** Concise Subject Line (Action Required / Update), Warm Professional Greeting, Context ➔ Concrete Ask ➔ Timeline ➔ Signature.
   • **Proposal Writing for Higher Studies (SOP / Research Proposal):** Academic background, research questions, literature gap identified, proposed methodology, and alignment with faculty expertise.
   • **Minutes of Meeting (MoM):**
     - Meeting Details: Date, Time, Attendees, Chair.
     - Agenda Topics Reviewed.
     - Decisions Finalized.
     - **Action Items Table:** Specific Task | Owner | Strict Deadline.`
  },
  {
    topic: "Soft Skills & Non-Verbal Communication (NVC): Body Language, Gestures & Etiquette",
    keywords: ["soft skills", "nonverbal communication", "nvc", "modes of nonverbal communication", "body language", "open and closed body language", "eye contact", "hand gestures", "do's and don'ts of nvc"],
    summary: "Foundations of Non-Verbal Communication (NVC): kinesics, proxemics, open vs. closed body language, facial micro-expressions, gestures, and professional interview etiquette.",
    primaryLang: "Interpersonal Dynamics & Leadership",
    placementDemand: "Technical Interviews, Team Collaboration & Executive Presentations",
    content: `Non-Verbal Communication Dynamics:
1. **Meaning & Impact of NVC:**
   • Communication without spoken words. Albert Mehrabian's model emphasizes that non-verbal signals (tone, facial cues, posture) heavily dictate perceived trust and authenticity.

2. **Primary Modes of NVC:**
   • **Open vs. Closed Body Language:**
     - Open: Uncrossed arms, palms visible, relaxed shoulders, slight forward lean (signals receptivity and confidence).
     - Closed: Folded arms, slouching, turned away (signals defensiveness or disinterest).
   • **Eye Contact:** Consistent, natural 3-5 second focus (demonstrates honesty and attention without intimidating).
   • **Facial Expressions & Smiling:** Congruence between words spoken and facial expressions builds rapport.
   • **Hand Gestures:** Purposeful gestures illustrating scale or steps; avoiding fidgeting, face-touching, or pen-clicking.

3. **Do's and Don'ts of NVC:**
   • **DO:** Maintain upright posture, nod to acknowledge understanding, offer a firm professional handshake, modulate vocal pitch.
   • **DON'T:** Check your phone or watch, cross arms across your chest, stare blankly, or invade personal space (respect proxemics).`
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. JAVA PROGRAMMING & DATA STRUCTURES PROBLEM SOLVING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Java Programming Model: JVM, Syntax, Scanner, BufferedReader & Control Flow",
    keywords: ["java programming model", "jvm architecture", "scanner vs bufferedreader", "type casting in java", "control flow java", "switch case java", "dry runs", "pattern printing java"],
    summary: "Java architecture (JVM, Bytecode, JIT), I/O mechanics (Scanner vs. BufferedReader), type casting, control flow branching, and loop dry-run tracing.",
    primaryLang: "Java (JDK 17/21)",
    placementDemand: "Core Java SDE, Enterprise Backends, Platform Engineering",
    content: `Java Execution Model & Control Architecture:
1. **JVM Architecture & Platform Independence:**
   • \`.java\` source code $\\rightarrow$ Compiled by \`javac\` into platform-independent \`.class\` **Bytecode**.
   • **JVM (Java Virtual Machine):** ClassLoader ➔ JVM Memory (Method Area, Heap, Stack, PC Register, Native Stack) ➔ Execution Engine (Interpreter + JIT Compiler + Garbage Collector).
   • "Write Once, Run Anywhere" (WORA).

2. **Input/Output: Scanner vs. BufferedReader:**
   • \`Scanner\`: Parses primitive types directly using regex tokenization. Slower due to overhead.
   • \`BufferedReader\`: Fast raw character stream reading with default 8KB buffer. Ideal for competitive programming:
     \`\`\`java
     BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
     String line = br.readLine();
     int num = Integer.parseInt(line);
     \`\`\`

3. **Type Casting:**
   • Implicit (Widening): Safe automatic conversion from smaller to larger data types: \`int x = 10; double d = x;\`
   • Explicit (Narrowing): Manual cast with potential data truncation: \`double d = 9.99; int x = (int) d; // x = 9\`

4. **Control Flow & Patterns:**
   • Enhanced \`switch\` statements (Java 14+): \`yield\` and arrow syntax \`case 1 -> "One";\`.
   • Nested loops for pattern generation (Triangles, Diamonds) require tracking outer row indices ($i$) and inner column printers ($j$).`
  },
  {
    topic: "Array & Matrix Algorithms: 2D Manipulations, Two Pointers, Prefix Sum & Sliding Window",
    keywords: ["arrays in java", "memory representation of arrays", "2d arrays", "matrix manipulation", "matrix transpose", "matrix rotation", "two-pointer technique", "prefix sum", "sliding window", "searching and sorting techniques"],
    summary: "Array memory representation, matrix operations (transpose, 90-degree rotation, diagonals), and optimal algorithmic techniques: Two Pointers, Prefix Sums, and Sliding Window.",
    primaryLang: "Java / C++ / DSA",
    placementDemand: "High-Frequency Coding Rounds (LeetCode / HackerRank)",
    content: `Array Algorithms & Advanced Optimization Patterns:
1. **Contiguous Memory & 2D Arrays:**
   • 1D arrays allocate a contiguous block in heap memory. Indexing is $O(1)$: $\\text{Addr}(arr[i]) = \\text{Base} + (i \\times \\text{size})$.
   • Java 2D arrays are "arrays of arrays" (rows can be jagged/non-uniform in memory).

2. **Matrix Algorithms:**
   • **Matrix Transpose:** Swap elements across the main diagonal: \`swap(matrix[i][j], matrix[j][i])\` for $j > i$.
   • **Rotate Matrix 90° Clockwise:** 1. Transpose matrix $\\rightarrow$ 2. Reverse each row! Total time: $O(N^2)$, space: $O(1)$.

3. **The Big 3 Array Optimization Strategies:**
   • **Two Pointers:** Moving inward from bounds ($L=0, R=N-1$) or at differing speeds (Fast/Slow). Reduces $O(N^2)$ to $O(N)$ for sorted arrays (e.g., Two Sum II, Container With Most Water).
   • **Prefix Sum:** Precompute running totals $\\text{pref}[i] = \\text{pref}[i-1] + arr[i]$. Answers range sum queries $arr[L \\dots R]$ in **$O(1)$ time**: $\\text{pref}[R] - \\text{pref}[L-1]$.
   • **Sliding Window:** Maintaining a dynamic window $[L, R]$ satisfying constraints (e.g. Longest Substring Without Repeating Characters, Maximum Sum Subarray of size $K$). Operates in $O(N)$ linear time.`
  },
  {
    topic: "Java Strings, Immutability, StringBuilder, StringBuffer & Regular Expressions",
    keywords: ["string handling", "string immutability", "string vs stringbuilder vs stringbuffer", "string constant pool", "scp", "palindrome", "anagram", "regex", "regular expressions"],
    summary: "Java String immutability, String Constant Pool (SCP), comparison of String vs. StringBuilder vs. StringBuffer, anagram detection, and Regex pattern matching.",
    primaryLang: "Java",
    placementDemand: "Core Java Engineering & String Parsing",
    content: `String Architecture & Performance in Java:
1. **String Immutability & The String Constant Pool (SCP):**
   • \`String\` objects in Java are immutable (backed by \`final byte[]\` since Java 9).
   • String literals like \`String s = "hello";\` are cached in the **String Constant Pool (SCP)** inside the Heap to conserve memory.
   • Every time you modify an existing String, a completely new object is allocated in memory!

2. **String vs. StringBuilder vs. StringBuffer:**
   • **String:** Immutable, thread-safe, but slow for continuous concatenation ($O(N^2)$ in loops).
   • **StringBuilder (Java 5+):** Mutable, **NOT thread-safe**, fastest performance for single-threaded string building.
   • **StringBuffer:** Mutable, **Thread-Safe** (methods are \`synchronized\`), but has synchronization lock overhead.

3. **Essential String Algorithms:**
   • **Anagram Check:** Count character frequencies using a fixed-size integer array \`int[26]\` in $O(N)$ time and $O(1)$ space.
   • **Palindrome Check:** Two pointers converging inward: \`while (l < r) { if (s.charAt(l++) != s.charAt(r--)) return false; }\`.

4. **Regular Expressions (Regex):**
   • \`Pattern\` and \`Matcher\` classes in \`java.util.regex\`.
   • Metacharacters: \`\\d\` (digit), \`\\w\` (word character), \`+\` (1 or more), \`*\` (0 or more), \`{n,m}\` (range quantifier).`
  },
  {
    topic: "Recursion, Call Stack Frames & Backtracking: N-Queens & Subset Sum",
    keywords: ["recursion fundamentals", "base cases", "stack frames", "recursive problem solving", "backtracking", "n-queens", "subset sum"],
    summary: "Recursive mechanics, call stack activation records, base case design, and backtracking algorithms (N-Queens, Subset Sum).",
    primaryLang: "Java / C++ / DSA",
    placementDemand: "Tier-1 Technical Assessments & Dynamic Tree Searches",
    content: `Recursive Mechanics & Backtracking:
1. **The Anatomy of Recursion:**
   • **Base Case:** The terminating condition that returns without further recursive calls. Omitting it leads to \`StackOverflowError\`.
   • **Recursive Step:** Subdividing problem into smaller instances of identical nature.
   • **Stack Frames:** Each call pushes a new Activation Record containing local variables and return address onto the Thread Call Stack.

2. **Backtracking Paradigm (Choose ➔ Explore ➔ Un-choose):**
   • A systematic search over a combinatorial solution space. If a partial state violates problem constraints, the algorithm **backtracks** (prunes the subtree) by undoing state changes.

3. **Classic Problem: The N-Queens Problem:**
   • Place $N$ chess queens on an $N \\times N$ board such that no two queens attack each other.
   • Algorithm: Try placing a queen row by row. For each column, check if attacked by checking column, main diagonal ($r - c$), and anti-diagonal ($r + c$). If safe, place queen and recurse. If no valid placement, backtrack.`
  },
  {
    topic: "Core Object-Oriented Programming in Java: Classes, Constructors, 'this' & Encapsulation",
    keywords: ["classes and objects", "constructors in java", "this keyword", "access specifiers", "encapsulation", "static keyword java", "modularization"],
    summary: "Object-oriented fundamentals in Java: class structure, object instantiation, constructor chaining, the 'this' keyword, access specifiers, and static members.",
    primaryLang: "Java",
    placementDemand: "Low-Level System Design (LLD) & Clean Architecture",
    content: `OOP Foundations in Java:
1. **Classes & Objects:**
   • A **Class** is a user-defined blueprint. An **Object** is a concrete instance allocated on the Heap.

2. **Constructors & Constructor Overloading:**
   • Special initialization methods sharing the exact class name with no return type.
   • \`this(...)\` constructor chaining: Allows one constructor to invoke another constructor within the same class (must be the first line!).

3. **Access Specifiers & Encapsulation:**
   • **private:** Visible only within the declaring class (Foundation of Encapsulation: protect state via private fields + public getters/setters).
   • **default (package-private):** Visible within the declaring package.
   • **protected:** Visible within package and in subclasses outside package.
   • **public:** Visible everywhere across the project.

4. **The \`static\` Keyword:**
   • Belongs to the **Class itself**, not individual object instances.
   • Shared across all instances. Static methods cannot access non-static instance fields or call \`this\` directly.`
  },
  {
    topic: "Advanced OOP in Java: Inheritance, Polymorphism, Abstract Classes, Interfaces & Reflection",
    keywords: ["inheritance types", "method overriding", "super keyword", "final keyword", "abstract classes", "interfaces in java", "multiple inheritance", "polymorphism runtime", "dynamic method dispatch", "reflection api"],
    summary: "Advanced Java OOP: inheritance hierarchies, runtime dynamic method dispatch, abstract classes vs. interfaces, the final keyword, and the Reflection API.",
    primaryLang: "Java",
    placementDemand: "Enterprise Frameworks (Spring Boot) & System Architecture",
    content: `Advanced Java Object Architecture:
1. **Inheritance & Polymorphism:**
   • Java supports Single and Multilevel class inheritance using \`extends\`. Multiple inheritance of state is disallowed to prevent the **Diamond Problem**.
   • **Method Overriding (@Override):** Child class redefines superclass method with identical signature and return type.
   • **Dynamic Method Dispatch:** Java resolves overridden method calls at **runtime** based on the actual object instance on the heap, not the reference type.

2. **Abstract Classes vs. Interfaces:**
   | Feature | Abstract Class (\`abstract\`) | Interface (\`interface\`) |
   |---|---|---|
   | **Multiple Inheritance** | No (single class inheritance) | Yes (a class can implement multiple interfaces) |
   | **Fields** | Can have instance fields with state | Only \`public static final\` constants |
   | **Methods** | Concrete and abstract methods | Abstract methods, \`default\` & \`static\` methods (Java 8+) |
   | **Constructor** | Has constructors | Cannot have constructors |

3. **The \`final\` Keyword:**
   • Final Variable: Constant value (cannot be reassigned).
   • Final Method: Cannot be overridden in child classes.
   • Final Class: Cannot be extended/inherited (e.g., \`java.lang.String\` is final for security).

4. **Reflection API (\`java.lang.reflect\`):**
   • Inspects and modifies classes, methods, and private fields dynamically at runtime. Used by frameworks like Spring Boot (for Dependency Injection) and JUnit.`
  },
  {
    topic: "Software Design Patterns in Java: Factory, Strategy & Template Method",
    keywords: ["design patterns", "factory pattern", "strategy pattern", "template method pattern", "gang of four"],
    summary: "Creational and Behavioral GoF design patterns in Java: Factory Pattern, Strategy Pattern, and Template Method Pattern.",
    primaryLang: "Java",
    placementDemand: "Senior SDE Design Interviews & Production Codebases",
    content: `Classic Design Patterns in Java:
1. **Factory Method Pattern (Creational):**
   • Defines an interface for creating an object, but lets subclasses decide which class to instantiate.
   • Eliminates tight coupling by replacing direct \`new ConcreteClass()\` calls with a centralized creator method.

2. **Strategy Pattern (Behavioral):**
   • Defines a family of interchangeable algorithms, encapsulates each inside a strategy interface, and makes them swappable at runtime.
   • *Example:* A PaymentProcessor interface with \`CreditCardPayment\`, \`PayPalPayment\`, and \`CryptoPayment\` implementations.

3. **Template Method Pattern (Behavioral):**
   • Defines the skeleton of an algorithm in an abstract base class, deferring specific steps to subclasses without altering the overarching algorithm structure.`
  },
  {
    topic: "Java Exceptions & File I/O: Streams, Serialization & Custom Exceptions",
    keywords: ["types of exceptions", "exception hierarchy", "try catch finally", "custom exception", "file handling java", "byte stream", "character stream", "fileinputstream", "filereader", "bufferedreader", "serialization", "deserialization", "serializable"],
    summary: "Java exception architecture, custom exceptions, byte vs. character streams, buffered I/O, and object Serialization/Deserialization.",
    primaryLang: "Java",
    placementDemand: "Robust Backend Engineering & Persistent Storage",
    content: `Exception Hierarchy & File Streams in Java:
1. **Exception Hierarchy:**
   • \`Throwable\` is the root. Split into:
     - \`Error\`: Severe system conditions that applications should not catch (\`OutOfMemoryError\`, \`StackOverflowError\`).
     - \`Exception\`: Checked (\`IOException\`, \`SQLException\`) and Unchecked (\`RuntimeException\`: \`NullPointerException\`, \`ArithmeticException\`).

2. **File I/O Streams:**
   • **Byte Streams (8-bit bytes):** For binary files (images, audio, compiled classes). Base classes: \`InputStream\` and \`OutputStream\` (e.g., \`FileInputStream\`).
   • **Character Streams (16-bit Unicode chars):** For human-readable text files. Base classes: \`Reader\` and \`Writer\` (e.g., \`FileReader\`, \`BufferedReader\`).
   • Always wrap raw file readers in \`BufferedReader\` for high-throughput buffered reading.

3. **Object Serialization & Deserialization:**
   • **Serialization:** Converting an in-memory Java object into a byte stream via \`ObjectOutputStream.writeObject()\`.
   • **Deserialization:** Reconstructing the object from a byte stream via \`ObjectInputStream.readObject()\`.
   • Requirement: Class must implement the marker interface \`java.io.Serializable\`.
   • Fields marked with \`transient\` are skipped during serialization (ideal for sensitive passwords).`
  },
  {
    topic: "Java Collections Framework, Generics & Functional Streams API",
    keywords: ["generics java", "java collections framework", "list set map queue", "arraylist vs linkedlist", "hashset vs treeset", "hashmap vs treemap", "priorityqueue", "lambda expressions", "stream api"],
    summary: "Java Collections Framework hierarchy (List, Set, Map, Queue), type-safe Generics, and modern Java 8+ Stream API pipelines.",
    primaryLang: "Java Collections",
    placementDemand: "Mandatory Core Java Interview Knowledge",
    content: `Collections Framework & Stream Processing:
1. **Collections Hierarchy Overview:**
   • **List (Ordered, allows duplicates):**
     - \`ArrayList\`: Dynamic array, fast $O(1)$ random access, slow $O(N)$ middle insertion/deletion.
     - \`LinkedList\`: Doubly linked nodes, fast $O(1)$ head/tail insertion/deletion, slow $O(N)$ random access.
   • **Set (Unique elements only):**
     - \`HashSet\`: Hash table backed, $O(1)$ average lookups, unordered.
     - \`TreeSet\`: Red-Black tree backed, $O(\\log N)$ operations, strictly sorted natural order.
   • **Map (Key-Value associations):**
     - \`HashMap\`: $O(1)$ average key lookups.
     - \`TreeMap\`: $O(\\log N)$ key lookups, sorted by keys.
   • **Queue & Deque:**
     - \`PriorityQueue\`: Min-Heap backed, $O(1)$ peek, $O(\\log N)$ push/pop.

2. **Java Generics (\`<T>\`):**
   • Enforces compile-time type safety and eliminates manual casting: \`List<String> list = new ArrayList<>();\`.

3. **Java 8+ Functional Streams API:**
   • Declarative, functional pipeline transformations over collections:
     \`\`\`java
     List<String> names = users.stream()
         .filter(u -> u.getAge() >= 18)
         .map(User::getName)
         .sorted()
         .collect(Collectors.toList());
     \`\`\``
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. WEB DEVELOPMENT & MODERN ARCHITECTURE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Internet Fundamentals, HTTP/HTTPS Protocols & Web Architecture",
    keywords: ["internet fundamentals", "http https", "web client server architecture", "browser basics", "web hosting", "domain concepts", "dns", "ssl tls handshake"],
    summary: "Internet fundamentals: Client-server architecture, DNS resolution, HTTP/HTTPS protocol mechanics, status codes, and browser rendering pipelines.",
    primaryLang: "Web Architecture & Protocols",
    placementDemand: "Full-Stack Development, DevOps & Web Infrastructure",
    content: `Internet Architecture & Web Protocols:
1. **Web Client-Server Model:**
   • Client (Browser/Mobile App) sends an HTTP Request $\\rightarrow$ Server processes request, queries DB $\\rightarrow$ Server sends back HTTP Response (HTML/CSS/JS/JSON).

2. **HTTP vs. HTTPS & TLS Handshake:**
   • **HTTP (Port 80):** Plaintext unencrypted data transfer.
   • **HTTPS (Port 443):** Secured via **TLS (Transport Layer Security)**. Encrypts all payload traffic using asymmetric public-key cryptography during handshake, switching to fast symmetric session keys for data transfer.

3. **Core HTTP Request Methods & Status Codes:**
   • Methods: \`GET\` (Read), \`POST\` (Create), \`PUT\` (Full update), \`PATCH\` (Partial update), \`DELETE\` (Remove).
   • Status Codes:
     - \`200 OK\`, \`201 Created\` (Success)
     - \`301 Moved Permanently\`, \`304 Not Modified\` (Redirection/Caching)
     - \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\` (Client Errors)
     - \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\` (Server Errors)

4. **DNS Lookup Sequence:**
   • Browser Cache $\\rightarrow$ OS Resolver $\\rightarrow$ Recursive DNS Server $\\rightarrow$ Root Server $\\rightarrow$ TLD Server (.com) $\\rightarrow$ Authoritative DNS Server (returns IP address).`
  },
  {
    topic: "Semantic HTML5, Forms, Advanced Input Attributes & Accessibility",
    keywords: ["html document structure", "semantic tags", "html forms", "advanced input attributes", "form validation html", "tables", "media tags", "accessibility attributes", "aria", "web accessibility"],
    summary: "Semantic HTML5 layout elements, accessible forms, input attributes, audio/video media tags, and ARIA web accessibility standards.",
    primaryLang: "HTML5 & Web Standards",
    placementDemand: "Frontend Development, Accessibility (a11y) Auditing",
    content: `Semantic HTML5 & Accessibility Architecture:
1. **Semantic Structure:**
   • Replacing generic \`<div>\` tags with meaningful landmarks: \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<aside>\`, \`<footer>\`.
   • Improves screen-reader navigation and search engine web crawler (SEO) comprehension.

2. **Robust HTML5 Forms & Input Controls:**
   • Form tags: \`<form action="/api" method="POST">\`.
   • Input types: \`text\`, \`email\`, \`password\`, \`number\`, \`date\`, \`file\`, \`checkbox\`, \`radio\`.
   • Validation attributes: \`required\`, \`pattern="[A-Za-z]{3,}"\`, \`min\`, \`max\`, \`maxlength\`, \`autocomplete\`.

3. **Accessibility (WCAG & ARIA):**
   • \`alt\` attributes on all \`<img>\` tags for vision-impaired users.
   • Proper \`<label for="inputId">\` associations for input focus.
   • ARIA roles: \`role="alert"\`, \`aria-expanded="false"\`, \`aria-live="polite"\` for dynamic JS content.`
  },
  {
    topic: "CSS Layouts: Flexbox, CSS Grid, Box Model, Responsive Design & Media Queries",
    keywords: ["introductory css styling", "box model", "flexbox", "css grid", "block layout", "media queries", "css transitions", "css animations", "css custom properties", "responsive layouts", "theme management"],
    summary: "Comprehensive CSS styling: Box Model, Flexbox 1D vs. CSS Grid 2D layouts, responsive media queries, CSS variables (custom properties), and keyframe animations.",
    primaryLang: "CSS3 / SCSS",
    placementDemand: "Modern Frontend Engineering & UI Design Systems",
    content: `CSS Layouts & Responsive Architecture:
1. **The CSS Box Model:**
   • **Content:** The actual text, image, or media.
   • **Padding:** Transparent space inside the border, around content.
   • **Border:** The edge surrounding the padding.
   • **Margin:** Transparent space outside the border separating neighboring elements.
   • Golden Rule: Use \`box-sizing: border-box;\` so padding and border are included within specified width and height.

2. **Flexbox (1-Dimensional Layouts):**
   • Manages alignment along a single axis (row or column).
   • Container: \`display: flex;\`, \`justify-content\` (main axis), \`align-items\` (cross axis), \`flex-wrap\`.
   • Items: \`flex: 1\`, \`flex-grow\`, \`flex-shrink\`.

3. **CSS Grid (2-Dimensional Layouts):**
   • Manages rows and columns simultaneously:
     \`\`\`css
     .grid-container {
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
       gap: 20px;
     }
     \`\`\`

4. **CSS Custom Properties (Variables) & Theming:**
   • \`:root { --primary-color: #0284c7; --bg-glass: rgba(15, 23, 42, 0.7); }\`
   • Dynamic theme switching (Dark/Light mode) without JavaScript recompilation!

5. **Responsive Media Queries:**
   • Mobile-First standard breakpoints:
     - \`@media (min-width: 640px)\`: Tablets.
     - \`@media (min-width: 1024px)\`: Laptops/Desktops.`
  },
  {
    topic: "JavaScript Programming: ES6+, Scope, Closures, Objects & Array Transformations",
    keywords: ["javascript fundamentals", "arrow functions", "callback functions", "objects javascript", "object inheritance", "array methods", "map filter reduce", "closures", "es6"],
    summary: "Core JavaScript: let/const scope, closures, prototype inheritance, arrow functions, and array transformations (map, filter, reduce).",
    primaryLang: "JavaScript (ES6+)",
    placementDemand: "Frontend & Full-Stack Engineering (React, Node.js)",
    content: `JavaScript Core Language Mechanics:
1. **Variable Scoping: \`var\` vs \`let\` vs \`const\`:**
   • \`var\`: Function-scoped, hoisted to top, can be redeclared.
   • \`let\` & \`const\`: Block-scoped, Temporal Dead Zone (TDZ) prevents access before declaration. \`const\` prevents variable reassignment.

2. **Closures:**
   • A function bundled together with references to its surrounding lexical environment.
   • Allows inner functions to remember variables from outer scopes even after the outer function has finished executing!

3. **Modern Array Transformations:**
   • \`.map(fn)\`: Transforms every element into a new array.
   • \`.filter(fn)\`: Returns elements satisfying a boolean predicate.
   • \`.reduce((acc, curr) => acc + curr, 0)\`: Accumulates array into a single value.
   • \`.find()\`, \`.some()\`, \`.every()\`, \`.slice()\`, \`.splice()\`.`
  },
  {
    topic: "JavaScript DOM Manipulation, Browser Storage, Promises & Async/Await",
    keywords: ["dom manipulation", "event handling", "event bubbling", "browser storage", "localstorage", "sessionstorage", "cookies", "asynchronous programming", "promises", "async await", "fetch api"],
    summary: "DOM tree interaction, event bubbling/delegation, web storage (LocalStorage vs SessionStorage), and asynchronous JavaScript (Promises, async/await).",
    primaryLang: "JavaScript (DOM & Web APIs)",
    placementDemand: "Interactive Web Applications & Real-Time Dashboards",
    content: `DOM, Storage & Asynchronous Architecture:
1. **DOM Tree & Event Handling:**
   • \`document.querySelector()\`, \`addEventListener()\`.
   • **Event Bubbling & Capturing:** Events propagate upwards through parent nodes (Bubbling). **Event Delegation** exploits bubbling by attaching one listener on a parent element to handle clicks on hundreds of dynamic children.

2. **Browser Storage Comparison:**
   | Storage | Capacity | Lifespan | Sent to Server? |
   |---|---|---|---|
   | **LocalStorage** | ~5-10 MB | Persistent until explicitly cleared | No |
   | **SessionStorage** | ~5 MB | Cleared on tab close | No |
   | **Cookies** | 4 KB | Set expiration date | Yes (with every HTTP request) |

3. **Asynchronous JavaScript: Promises & \`async/await\`:**
   • Event Loop: Call Stack ➔ Web APIs ➔ Microtask Queue (Promises) ➔ Macrotask Queue (setTimeout).
   • \`async / await\` offers clean synchronous-style syntax over Promises with \`try / catch\` error interception:
     \`\`\`javascript
     async function fetchUserData(id) {
       try {
         const res = await fetch(\`https://api.example.com/users/\${id}\`);
         if (!res.ok) throw new Error('Network response was not ok');
         const data = await res.json();
         return data;
       } catch (err) {
         console.error('Fetch failed:', err);
       }
     }
     \`\`\``
  },
  {
    topic: "Advanced Web Engineering: Form Validation, API Integration, CORS & Performance",
    keywords: ["advanced web development", "es6 modules", "form validation with javascript", "api integration", "optimize page load times", "meta tags for seo", "cors", "deploying web project"],
    summary: "Production web development: dynamic form validation, REST API integration, CORS mechanisms, web performance optimization, and SEO meta tags.",
    primaryLang: "Web Engineering & Production Deployment",
    placementDemand: "Production Frontend Engineering & Web Performance",
    content: `Production Web Engineering & Deployment:
1. **ES6 Modules:**
   • Modular code splitting using \`export\` and \`import\` statements.

2. **CORS (Cross-Origin Resource Sharing):**
   • Security mechanism enforced by browsers preventing web pages from making AJAX requests to a different origin (domain, protocol, or port) unless the server responds with appropriate headers:
     \`Access-Control-Allow-Origin: *\`.
   • **Preflight Request (\`OPTIONS\`):** Sent by the browser before complex requests (e.g. with custom headers or PUT/DELETE).

3. **Web Performance Optimization:**
   • Code splitting and dynamic \`import()\` lazy loading.
   • Asset minification (CSS/JS) and image compression (WebP/AVIF).
   • Browser caching headers (\`Cache-Control: max-age=31536000\`).
   • Tree-shaking unused code during production builds.

4. **SEO Meta Tags:**
   • Essential header tags for discoverability: \`<title>\`, \`<meta name="description">\`, Open Graph tags (\`og:title\`, \`og:image\`) for social media unfurling.`
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // 6. MATHEMATICS FOR ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Mathematics for AI: Linear Algebra, SVD, PCA, Vector Spaces & Tensors",
    keywords: ["linear algebra for ai", "vectors in ai", "feature representations", "matrix transformations", "tensors", "matrix rank", "gram-schmidt", "svd", "pca intuition", "eigenvalues", "eigenvectors", "cosine similarity"],
    summary: "Mathematical foundations of machine learning: vectors as high-dimensional features, matrices as geometric neural layer transformations, Gram-Schmidt orthogonalization, and PCA/SVD dimensionality reduction.",
    primaryLang: "Linear Algebra & AI Vector Spaces",
    placementDemand: "Machine Learning Engineering & AI Research",
    content: `Linear Algebra Foundations for Artificial Intelligence:
1. **Vectors as Feature Representations:**
   • Multi-dimensional numerical encoding: Image pixels ($H \\times W \\times C$), Word Embeddings (Word2Vec, Ada-002, 1536-dim), Sensor telemetry.
   • **Dot Product & Cosine Similarity:** $a \\cdot b = \\|a\\| \\|b\\| \\cos \\theta$. Measures geometric alignment irrespective of vector magnitude.
   • **Vector Projection:** Projecting vector $v$ onto direction $u$: $\\text{proj}_u(v) = \\frac{v \\cdot u}{\\|u\\|^2} u$. Isolates signal from orthogonal noise.

2. **Matrices as Geometric Transformations:**
   • Matrices represent spatial operations: Rotation, Scaling, Reflection, and Compression.
   • **Chained Transformations:** Matrix multiplication represents successive geometric warping: $y = W_2(W_1 x + b_1) + b_2$ (Multilayer Perceptrons).

3. **Tensors & Tensor Shapes in AI Frameworks:**
   • Generalization of matrices to $N$-dimensions: PyTorch / TensorFlow tensors:
     - Vision: \`(Batch_Size, Channels, Height, Width)\`
     - NLP & Transformers: \`(Batch_Size, Sequence_Length, Embedding_Dim)\`

4. **Matrix Rank, Basis & Orthogonality:**
   • **Matrix Rank:** Number of linearly independent columns; defines dimensionality of transformation output space.
   • **Gram-Schmidt Process:** Converts linearly independent vectors into an orthonormal basis ($e_i \\cdot e_j = 0$ for $i \\neq j$, $\\|e_i\\| = 1$).

5. **Eigenvalues, Eigenvectors & SVD/PCA:**
   • $Av = \\lambda v$: Eigenvectors identify directions where transformation acts as simple scalar stretching.
   • **PCA (Principal Component Analysis):** Identifies orthogonal directions of maximum data variance by computing eigenvectors of sample covariance matrix.
   • **SVD (Singular Value Decomposition):** Decomposes any matrix $A = U \\Sigma V^T$ into rotation, singular scaling, and reflection; powers recommender systems (matrix factorization).`
  },
  {
    topic: "Calculus & Optimization for AI: Gradients, Jacobian, Hessian & Loss Minimization",
    keywords: ["calculus for ai", "gradient vector", "jacobian", "hessian", "taylor expansion in ai", "loss minimization", "loss functions", "gradient descent", "adam optimizer", "momentum"],
    summary: "Multivariate calculus and optimization algorithms that drive deep learning: partial derivatives, gradients as directions of steepest ascent, Jacobian/Hessian curvature, and modern adaptive optimizers.",
    primaryLang: "Multivariate Calculus & Convex Optimization",
    placementDemand: "Deep Learning Engineering & Model Optimization",
    content: `Calculus & Optimization Driving AI Learning:
1. **Multivariate Derivatives & Gradients:**
   • Partial derivative $\\frac{\\partial f}{\\partial x_i}$ measures sensitivity to a single input parameter.
   • **Gradient Vector ($\\nabla f$):** Vector of all partial derivatives pointing in the direction of **fastest functional increase**. Negative gradient $-\\nabla f$ points to steepest descent!

2. **Jacobian & Hessian Matrices (Curvature & Sensitivity):**
   • **Jacobian Matrix ($J$):** First-order partial derivatives of vector-valued functions (describes local distortion and neural layer sensitivities).
   • **Hessian Matrix ($H$):** Second-order partial derivatives describing curvature of loss surface:
     - Positive Definite ($H > 0$): Local minimum (convex basin).
     - Indefinite (Mixed eigenvalue signs): **Saddle Point** (very common in high-dimensional deep neural networks).

3. **Taylor Series & Loss Surface Approximations:**
   • Second-order Taylor expansion explains local loss behavior: $L(w + \\Delta w) \\approx L(w) + \\nabla L^T \\Delta w + \\frac{1}{2} \\Delta w^T H \\Delta w$.

4. **Loss Functions in Machine Learning:**
   • **Mean Squared Error (MSE):** $L = \\frac{1}{2N} \\sum (y_i - \\hat{y}_i)^2$ (penalizes large outlier errors quadratically; standard for regression).
   • **Binary & Categorical Cross-Entropy:** $L = -\\sum y_i \\log(\\hat{y}_i)$ (measures divergence between true probability distribution and predicted softmax distribution).

5. **Gradient Descent & Modern Optimizers:**
   • **Gradient Descent Update:** $w_{t+1} = w_t - \\eta \\nabla L(w_t)$ (where $\\eta$ is learning rate).
   • **Batch vs Mini-Batch vs Stochastic GD (SGD):** Trade-off between convergence stability and memory throughput.
   • **Momentum:** Accumulates velocity in consistent gradient directions to blast past flat saddles: $v_t = \\beta v_{t-1} + \\eta \\nabla L$.
   • **Adam (Adaptive Moment Estimation):** Combines running averages of gradient (1st moment $m_t$) and squared gradient (2nd moment $v_t$) with bias correction to dynamically adapt per-parameter learning rates.`
  },
  {
    topic: "Mathematical Foundations of Modern Deep Learning: Attention (Q,K,V), Convolutions & Latent Spaces",
    keywords: ["attention mechanism math", "q k v vectors", "dot product attention", "convolution math", "word analogy math", "latent space math", "forward pass linear layer"],
    summary: "The explicit mathematical operations powering modern generative models and Transformers: Scaled Dot-Product Attention, sliding window convolutions, NLP vector arithmetic, and continuous latent manifolds.",
    primaryLang: "Deep Learning Mathematical Foundations",
    placementDemand: "Generative AI Engineering & Transformer Architecture",
    content: `Modern Deep Learning Architecture Mathematics:
1. **The Attention Mechanism Math (Transformers):**
   • Transforms input tokens into three projection matrices: Query ($Q$), Key ($K$), and Value ($V$).
   • **Scaled Dot-Product Attention Formula:**
     $$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$
   • Dividing by $\\sqrt{d_k}$ prevents dot products from growing excessively large in high dimensions, keeping softmax gradients healthy.

2. **2D Convolution from a Mathematical Viewpoint:**
   • Sliding window inner products between learned kernel filter $K$ and localized image receptive fields $I$:
     $$S(i, j) = (I * K)(i, j) = \\sum_m \\sum_n I(i + m, j + n) K(m, n)$$
   • Enforces translation equivariance and sparse weight sharing.

3. **Vector Spaces & Analogy Math in NLP:**
   • Dense embeddings capture semantic syntactic relationships geometrically:
     $$\\vec{v}_{\\text{king}} - \\vec{v}_{\\text{man}} + \\vec{v}_{\\text{woman}} \\approx \\vec{v}_{\\text{queen}}$$
   • Euclidean distance reflects semantic similarity in semantic vector spaces.

4. **Latent Space Geometry in Generative Models:**
   • Variational Autoencoders (VAEs) and Diffusion models map high-dimensional images into smooth, lower-dimensional continuous latent manifolds $z \\sim \\mathcal{N}(0, I)$.
   • Linear interpolation in latent space generates seamless conceptual morphing between output samples.`
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // 7. DIGITAL LOGIC DESIGN & COMPUTER ORGANIZATION / ARCHITECTURE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Digital Logic Design: Boolean Algebra, K-Maps, Adders, Multiplexers & PLDs",
    keywords: ["digital logic", "boolean algebra", "sop and pos", "k-map", "karnaugh map", "adders", "multiplexer", "demultiplexer", "encoder", "decoder", "reversible gates", "prom pal pla", "cpld", "fpga", "clb lut"],
    summary: "Foundational digital electronics: Boolean optimization, combinational arithmetic blocks, data selectors, reversible computing, and programmable silicon devices (PAL, PLA, CPLD, FPGA).",
    primaryLang: "Digital Electronics & HDL Design",
    placementDemand: "Hardware Engineering, VLSI & Embedded Systems",
    content: `Digital Logic Circuits & Silicon Implementation:
1. **Boolean Algebra, SOP & POS:**
   • **Sum of Products (SOP):** Boolean OR of ANDed minterms (active high logic $\\Sigma m$).
   • **Product of Sums (POS):** Boolean AND of ORed maxterms (active low logic $\\Pi M$).
   • **Karnaugh Maps (K-Maps):** Gray-code geometric simplification grouping $2^k$ adjacent minterms to eliminate redundant literals.

2. **Combinational Arithmetic & Data Routing:**
   • **Adders:** Half Adder ($S = A \\oplus B, C = AB$); Full Adder ($S = A \\oplus B \\oplus C_{in}, C_{out} = AB + C_{in}(A \\oplus B)$); Carry Lookahead Adders eliminate ripple delay.
   • **Multiplexers (MUX):** $2^n$-to-1 data selectors routing one input line to output based on $n$ select lines.
   • **Decoders & Encoders:** $n$-to-$2^n$ binary decoders; Priority encoders outputting index of highest-priority active input.

3. **Reversible Logic Gates:**
   • Classical logic gates destroy information ($A \\text{ AND } B$ outputs 1 bit from 2 inputs), dissipating heat according to Landauer's Principle ($k_B T \\ln 2$).
   • **Reversible Gates (Bijective 1-to-1 mappings):**
     - **Feynman Gate (CNOT):** $P = A, Q = A \\oplus B$
     - **Toffoli Gate (CCNOT):** Universal 3-bit reversible gate ($P = A, Q = B, R = C \\oplus (AB)$)
     - **Fredkin Gate (CSWAP):** Controlled swap gate.

4. **Programmable Logic Devices (PLDs):**
   • **PROM:** Fixed AND array, Programmable OR array.
   • **PAL:** Programmable AND array, Fixed OR array.
   • **PLA:** Programmable AND array, Programmable OR array (most flexible).
   • **CPLD:** Complex Programmable Logic Devices based on macrocells and non-volatile flash.
   • **FPGA:** Field Programmable Gate Arrays consisting of thousands of Configurable Logic Blocks (CLBs) using Look-Up Tables (LUTs), flip-flops, and programmable routing matrices.`
  },
  {
    topic: "Sequential Logic & Memory Systems: Latches, Flip-Flops, Registers, Counters & RAM",
    keywords: ["sequential circuits", "latches", "flip-flops", "jk flip flop", "race around condition", "shift registers", "ring counter", "johnson counter", "ram", "sram vs dram", "memory decoding"],
    summary: "Clocked sequential circuits, memory elements, master-slave flip-flops, sequence generation counters, and physical RAM cell architectures (SRAM vs DRAM).",
    primaryLang: "Sequential Hardware Architecture",
    placementDemand: "Computer Engineering & Semiconductor Architecture",
    content: `Sequential Circuits & Memory Hardware:
1. **Latches vs. Flip-Flops:**
   • **Latch:** Asynchronous, level-triggered memory storage (transparent during high clock).
   • **Flip-Flop:** Synchronous, edge-triggered memory storage (samples input only on clock rising/falling edge).
   • **JK Flip-Flop & Race-Around Condition:** When $J = K = 1$ and clock pulse duration exceeds propagation delay, the output toggles uncontrollably. Solved by **Master-Slave JK Flip-Flop** or edge-triggering.

2. **Registers & Counters:**
   • **Shift Registers:** SISO, SIPO, PISO, PIPO, and Universal Shift Registers.
   • **Asynchronous (Ripple) vs. Synchronous Counters:** Synchronous counters clock all flip-flops simultaneously, eliminating ripple propagation skew.
   • **Ring Counter:** Circulates a single '1' through an $N$-bit shift register ($N$ unique timing states).
   • **Johnson (Twisted Ring) Counter:** Feeds inverted output back to input, producing $2N$ timing states.

3. **RAM Architecture: SRAM vs. DRAM:**
   • **SRAM (Static RAM):** 6-Transistor (6T) bistable latch per bit. Blazing fast, zero refresh required, but larger cell size and higher cost. Used for CPU L1/L2/L3 Caches.
   • **DRAM (Dynamic RAM):** 1-Transistor 1-Capacitor (1T-1C) cell. Capacitor charge leaks over milliseconds, requiring periodic electrical refresh cycles. High density, low cost. Used for Main System RAM.
   • **Memory Decoding:** 2D row/column addressing using Row Address Strobe (RAS) and Column Address Strobe (CAS) to select target bits.`
  },
  {
    topic: "Computer Organization & Architecture: ISAs, Pipelining, Hazards & Locality",
    keywords: ["computer architecture", "addressing modes", "instruction formats", "machine cycle", "risc vs cisc", "hardwired vs microprogrammed", "pipelining", "pipeline hazards", "memory hierarchy", "cache mapping", "virtual memory", "tlb", "dma"],
    summary: "Instruction set architectures, CPU execution cycles, 5-stage RISC pipelining, structural/data/control hazards, cache memory mapping, virtual memory address translation, and DMA I/O.",
    primaryLang: "Computer Architecture & Hardware Design",
    placementDemand: "Systems Architecture, Firmware & CPU Engineering",
    content: `Computer Architecture & Pipeline Organization:
1. **Instruction Set Architecture (ISA) & Addressing Modes:**
   • **Addressing Modes:** Immediate (\`#5\`), Direct (\`[1000]\`), Indirect (\`[[R1]]\`), Register (\`R1\`), Register Indirect (\`[R1]\`), Indexed (\`[R1 + offset]\`), PC-Relative.
   • **Instruction Formats:** 3-Address, 2-Address, 1-Address (Accumulator), and 0-Address (Stack machines).
   • **RISC vs CISC:** RISC features fixed-length instructions, load-store architecture, and single-cycle execution; CISC features variable-length instructions with complex memory addressing.

2. **CPU Execution Cycle & Control Units:**
   • **Machine Cycle:** Instruction Fetch (IF) $\\to$ Instruction Decode (ID) $\\to$ Execute (EX) $\\to$ Memory Access (MEM) $\\to$ Write-Back (WB).
   • **Hardwired Control:** Pure combinational logic state machines; maximum speed but rigid.
   • **Microprogrammed Control:** Microinstructions stored in Control ROM; flexible and upgradable but slower.

3. **Pipelining & The 3 Pipeline Hazards:**
   • Overlapping instruction execution stages in a 5-stage pipeline achieves ideal throughput of 1 instruction per cycle.
   • **Structural Hazards:** Hardware resource conflict (e.g. unified memory accessed simultaneously for instruction fetch and data load; solved by separate Harvard I/D caches).
   • **Data Hazards (Read-After-Write / RAW):** Dependent instruction requires result before writeback; solved by **Operand Forwarding / Bypassing** or pipeline stalls.
   • **Control / Branch Hazards:** Branch instruction redirects PC; solved by static/dynamic **Branch Prediction** and delayed branch slots.

4. **Memory Hierarchy & Cache Memory:**
   • **Principle of Locality:** Temporal Locality (accessing same item again soon) and Spatial Locality (accessing adjacent addresses soon).
   • **Cache Mapping Schemes:**
     - **Direct Mapped:** Each memory block maps to exactly one cache line ($index = block \\bmod lines$).
     - **Fully Associative:** Block can reside anywhere in cache; checked via simultaneous parallel Tag comparators.
     - **$N$-Way Set Associative:** Cache partitioned into sets of $N$ lines; balances speed and hit rate.
   • **Store Policies:** Write-Through (updates cache & RAM simultaneously) vs Write-Back (marks cache dirty; writes to RAM only upon eviction).

5. **Virtual Memory, TLB & I/O Fundamentals:**
   • **Virtual Memory & Page Tables:** Hardware MMU translates virtual page numbers to physical frame numbers.
   • **TLB (Translation Lookaside Buffer):** High-speed CAM cache on CPU caching recent address translations.
   • **I/O Modes:** Programmed I/O (CPU polling), Interrupt-Driven I/O, and **DMA (Direct Memory Access)** where DMA controller transfers blocks directly to RAM without CPU overhead.`
  },
  {
    topic: "Advanced Processor Architecture: Superscalar, SIMD, Low-Power Design & Verilog",
    keywords: ["superscalar", "vliw", "multicore", "simd", "vector processors", "low power techniques", "clock gating", "dvfs", "verilog", "vhdl"],
    summary: "High-performance and low-power modern computing: superscalar out-of-order execution, SIMD vector instructions, multi-core cache coherence, dynamic voltage scaling, and Verilog HDL.",
    primaryLang: "Advanced Hardware Architecture & Verilog HDL",
    placementDemand: "GPU Engineering, ASIC Design & Embedded Systems",
    content: `High-Performance & Low-Power Processor Design:
1. **Instruction-Level Parallelism (ILP): Superscalar vs VLIW:**
   • **Superscalar Processors:** CPU hardware dynamically dispatches multiple independent instructions per clock cycle to parallel execution units (ALUs, FPUs) out-of-order.
   • **VLIW (Very Long Instruction Word):** Compiler statically schedules and packages multiple operations into one giant execution packet.

2. **SIMD & Vector Processing:**
   • Single Instruction, Multiple Data executes one operation simultaneously over vector registers (AVX-512, ARM Neon, GPU Shader Warps). Essential for matrix multiplication and AI tensor compute.

3. **Multicore Systems & Cache Coherence:**
   • Multiple CPU cores sharing main memory require hardware snooping protocols (**MESI**: Modified, Exclusive, Shared, Invalid) to prevent stale cache inconsistencies.

4. **Low-Power Architectural Techniques:**
   • **Clock Gating:** Hardware gates shut off the clock distribution network to idle functional units, eliminating dynamic switching power.
   • **DVFS (Dynamic Voltage and Frequency Scaling):** Since dynamic power $P \\propto C V^2 f$, reducing clock frequency and operating voltage during low CPU utilization yields cubic power savings!

5. **Verilog HDL Fundamentals:**
   • Hardware description modeling concurrency:
     \`\`\`verilog
     module full_adder(input a, b, cin, output sum, cout);
       assign sum = a ^ b ^ cin;
       assign cout = (a & b) | (cin & (a ^ b));
     endmodule
     \`\`\`
   • Combinational logic via \`assign\`; sequential clocked state machines via \`always @(posedge clk)\` with non-blocking assignment (\`<=\`).`
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // 8. PROFESSIONAL ENGINEERING COMMUNICATION, CAREER & TEAM SKILLS
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Engineering Communication & Career Skills: Resumes, Interviews & Group Discussions",
    keywords: ["professional communication", "resume skills", "ats resume", "interview skills", "star method", "group discussion", "gd skills", "gd common errors", "goal setting", "smart goals"],
    summary: "Career acceleration and technical communication: ATS-optimized engineering resumes, the Google XYZ impact formula, STAR behavioral interviews, and Group Discussion dynamics.",
    primaryLang: "Professional Engineering Communication",
    placementDemand: "Engineering Placement & Technical Leadership",
    content: `Technical Communication & Career Mastery:
1. **Engineering Résumé Architecture:**
   • Single-page clean formatting, reverse chronological work experience, and ATS-parseable headings.
   • **The Google XYZ Bullet Formula:**
     *"Accomplished [X] as measured by [Y], by doing [Z]."*
     - *Weak:* "Worked on backend caching."
     - *Strong:* "Reduced average API latency by 45% (measured by Datadog APM) by implementing a multi-tier Redis caching layer with LRU eviction."

2. **Technical & Behavioral Interview Skills (The STAR Framework):**
   • **S - Situation:** Set the context, systems architecture, and engineering environment.
   • **T - Task:** The specific technical challenge or delivery roadblock.
   • **A - Action:** The concrete algorithmic, architectural, or debugging actions you drove personally.
   • **R - Result:** Quantified engineering outcomes, performance speedup, and team lessons.

3. **Group Discussion (GD) Methodology & Simulation:**
   • Assesses communication clarity, technical knowledge, active listening, and collaborative temperament.
   • **Strategic Roles:**
     - **Initiator:** Frames the topic clearly with crisp definitions and structured sub-themes.
     - **Moderator:** Steers conversation back to core topics when debates derail.
     - **Summarizer:** Synthesizes competing perspectives into actionable takeaways.
   • **Common GD Fatal Errors:** Aggressive shouting, cutting off teammates mid-sentence, lacking concrete technical examples, monopolizing speaking time, and displaying dismissive body language.`
  },
  {
    topic: "Collaborative Team Skills: Presentation, Conflict Resolution & Engineering Leadership",
    keywords: ["team skills", "presentation skills", "building trust", "psychological safety", "conflict resolution in teams", "thomas kilmann", "internal communication", "brainstorming in teams"],
    summary: "High-performance team dynamics: establishing psychological safety, delivering engaging technical presentations, resolving team conflict, and asynchronous communication patterns.",
    primaryLang: "Organizational Engineering & Team Dynamics",
    placementDemand: "Engineering Management & Cross-Functional Teamwork",
    content: `Engineering Team Collaboration & Conflict Resolution:
1. **Psychological Safety & Trust:**
   • Establishing a blameless culture (Amy Edmondson) where team members feel safe to propose unconventional architectural approaches, admit bugs, and ask clarifying questions without fear of ridicule.

2. **Technical Presentation Skills:**
   • Structuring complex technical talks: Context $\\to$ Problem $\\to$ Architecture Options $\\to$ Chosen Solution $\\to$ Benchmark Results.
   • Clean visuals: replacing dense text slides with high-contrast architectural diagrams; handling adversarial Q&A with composure.

3. **Conflict Resolution in Technical Teams:**
   • **The Thomas-Kilmann Conflict Mode Instrument:**
     - **Collaborating (High Assertiveness, High Cooperation):** Striving for win-win solutions that satisfy all architectural and product constraints.
     - **Compromising (Moderate):** Finding mutually acceptable middle ground under hard deadlines.
     - **Accommodating:** Yielding on low-impact preferences to preserve relationship capital.
   • Conducting blameless post-mortems and focusing debates on objective data rather than personal opinions.

4. **Internal Team Communication Protocols:**
   • Asynchronous Engineering RFCs (Requests for Comments) for transparent architecture reviews.
   • Lightweight Daily Standups: What did I complete yesterday? What am I shipping today? What blockers stand in my way?`
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // 9. ALGORITHM ANALYSIS & ADVANCED DATA STRUCTURES
  // ─────────────────────────────────────────────────────────────────────────────
  {
    topic: "Algorithm Analysis: Asymptotic Notations, Master Theorem & Running Times",
    keywords: ["algorithm analysis", "asymptotic notation", "big o", "big omega", "big theta", "running time calculations", "master theorem"],
    summary: "Formal algorithmic performance analysis: Big-O upper bounds, Omega lower bounds, Theta tight bounds, RAM computational models, and Master Theorem recurrence solutions.",
    primaryLang: "Theoretical Computer Science & Complexity Analysis",
    placementDemand: "Core SDE Interview & Algorithmic Problem Solving",
    content: `Algorithm Complexity Analysis & Recurrences:
1. **Asymptotic Complexity Notations:**
   • **Big-O ($O(g(n))$) — Upper Bound:** $f(n) \le c \cdot g(n)$ for all $n \ge n_0$. Guarantees worst-case ceiling.
   • **Big-Omega ($\\Omega(g(n))$) — Lower Bound:** $f(n) \ge c \cdot g(n)$ for all $n \ge n_0$. Guarantees best-case floor.
   • **Big-Theta ($\\Theta(g(n))$) — Tight Bound:** $c_1 g(n) \le f(n) \le c_2 g(n)$. Exact growth rate.

2. **The Master Theorem for Divide-and-Conquer:**
   • **Case 2 ($f(n) = \\Theta(n^{\\log_b a} \\log^k n)$):** Work balanced across levels $\\implies T(n) = \\Theta(n^{\\log_b a} \\log^{k+1} n)$.
     - *Example:* Merge Sort: $T(n) = 2T(n/2) + O(n) \\implies \\log_2 2 = 1 \\implies T(n) = \\Theta(n \\log n)$.
   • **Case 3 ($f(n) = \\Omega(n^{\\log_b a + \\epsilon})$ and regularity holds):** Root work dominates $\\implies T(n) = \\Theta(f(n))$.`
  },
  {
    topic: "Advanced Data Structures: Polynomial ADT, Circular Queues, Heaps & Extendible Hashing",
    keywords: ["polynomial adt", "expression evaluation", "infix to postfix", "shunting yard", "circular queue", "dequeue", "binary heap", "buildheap", "extendible hashing", "dynamic hashing", "directory hashing"],
    summary: "Advanced abstract data types: polynomial representation via linked lists, stack-based arithmetic expression parsers, linear-time BuildHeap, and dynamic disk-based Extendible Hashing.",
    primaryLang: "Advanced Data Structures & Storage Engines",
    placementDemand: "Systems Programming & Database Engine Architecture",
    content: `Advanced Data Structures & Storage Systems:
1. **Polynomial ADT (Linked List Implementation):**
   • Representing sparse multi-degree polynomials: Node contains \`(coefficient, exponent, next)\`.
   • **Addition Algorithm:** Simultaneous two-pointer traversal merging terms with matching exponents in $O(M + N)$ linear time.

2. **Stack Applications: Expression Evaluation & Parsing:**
   • **Infix to Postfix (Dijkstra's Shunting-Yard Algorithm):** Uses operator stack to reorder tokens according to precedence and associativity.
   • **Postfix Evaluation:** Operands pushed to stack; operators pop two operands and push result ($O(N)$ single pass).
   • **Circular Queue:** Uses modulo arithmetic \`rear = (rear + 1) % capacity\` to eliminate false queue underutilization.

3. **Binary Heaps & Priority Queues:**
   • Array-backed complete binary tree: Left child at $2i + 1$, right child at $2i + 2$, parent at $\\lfloor(i-1)/2\\rfloor$.
   • \`insert\`: $O(\\log N)$ Heapify-Up. \`extractMin\`: $O(\\log N)$ Heapify-Down.
   • **Linear \`buildHeap\` ($O(N)$):** Sifting down non-leaf nodes from bottom up sums to $\\sum_{h=0}^{\\infty} \\frac{h}{2^h} = 2$, achieving strictly $O(N)$ time instead of $O(N \\log N)$!

4. **Extendible Hashing (Dynamic External Database Hashing):**
   • Solves file reorganization bottlenecks in physical database tables when records grow dynamically.
   • **Architecture:** A directory of pointers indexed by the first **Global Depth ($D$)** bits of the hash. Each directory entry points to a disk block bucket having a **Local Depth ($d$)**.
   • **Bucket Splitting:** When a bucket overflows:
     - If $d = D$: Directory doubles in size ($D \\leftarrow D + 1$), and the bucket splits into two buckets with $d + 1$.
     - If $d < D$: Only the bucket splits ($d \\leftarrow d + 1$); directory pointers are updated without expanding directory size.`
  }
];

export const CURRICULUM_KNOWLEDGE_BASE = [
  ...BASE_CURRICULUM_KNOWLEDGE,
  ...EXPANDED_COURSES_KNOWLEDGE_BASE
];

// ─── Direct Topic Resolver for Instant Expert Curriculum Answering ──────────
export function findCurriculumDirectResponse(lower) {
  if (!lower) return null;

  // 0. Check Expanded Curricula
  const expandedRes = findExpandedCoursesDirectResponse(lower);
  if (expandedRes) return expandedRes;

  // 1. DESIGN THINKING & INNOVATION
  if (lower.includes('sepia') || lower.includes('5 forces of growth') || lower.includes('forces of growth')) {
    return {
      text: `### 🚀 The 5 Forces of Growth (SEPIA Framework)

The **SEPIA** framework defines the five foundational acceleration forces that enable an innovative product or enterprise to scale sustainably:

---

#### 1. S — Scale
* **Concept:** The structural capability of a solution to expand exponentially without requiring a linear increase in operational costs or headcount.
* **Engineering Reality:** Cloud-native microservices, automated CI/CD pipelines, and horizontal database sharding.

#### 2. E — Experience
* **Concept:** Delivering an intuitive, frictionless, and emotionally resonant end-to-end user journey.
* **Engineering Reality:** Micro-interactions, sub-100ms response times, and accessible, responsive interfaces.

#### 3. P — Partnership
* **Concept:** Strategic ecosystem integration that multiplies value by connecting external platforms, APIs, and business networks.
* **Engineering Reality:** Open REST/GraphQL APIs, OAuth integrations, and developer SDKs.

#### 4. I — Intelligence
* **Concept:** Leveraging automated telemetry, machine learning, and data feedback loops to make products self-optimizing.
* **Engineering Reality:** Telemetry logging, vector search, predictive algorithms, and AI mentors.

#### 5. A — Agility
* **Concept:** The organizational and technical velocity required to adapt, pivot, and ship iterations rapidly.
* **Engineering Reality:** Continuous deployment, trunk-based development, and agile design sprints.`,
      sources: ['Design Mind & Strategic Innovation Framework']
    };
  }

  if (lower.includes('dcafe') || lower.includes('frictional forces')) {
    return {
      text: `### 🛑 The 5 Frictional Forces (DCAFE Framework)

The **DCAFE** model maps the primary resistance factors that prevent users from adopting an innovative product or workflow:

---

#### 1. D — Doubt & Inertia
* **The Friction:** User hesitation and loyalty to established legacy habits (*"Why change when my current tool works fine?"*).
* **The Countermeasure:** Provide immediate value within the first 60 seconds of onboarding (low Time-to-Value).

#### 2. C — Complexity
* **The Friction:** Overwhelming cognitive load, cluttered user interfaces, or convoluted multi-step workflows.
* **The Countermeasure:** Progressive disclosure (hide advanced settings until needed) and the *"Less is More"* law.

#### 3. A — Anxiety
* **The Friction:** Fear of making irreversible mistakes, losing data, or exposing security vulnerabilities.
* **The Countermeasure:** Explicit confirmation dialogs, non-destructive actions, and reliable Undo buffers (Ctrl+Z).

#### 4. F — Friction (Operational & Physical)
* **The Friction:** Excessive clicks, slow page loads, form validation errors, or mandatory sign-ups before previewing.
* **The Countermeasure:** Frictionless guest modes, 1-click authentication, and instant optimistic UI updates.

#### 5. E — Effort
* **The Friction:** The physical and mental energy required to master and execute tasks in the system.
* **The Countermeasure:** Automation of repetitive tasks, keyboard shortcuts, and intelligent defaults.`,
      sources: ['Design Mind & Behavioral Friction Analysis']
    };
  }

  if (lower.includes('10/100/1000') || lower.includes('10 100 1000') || lower.includes('gm criteria') || lower.includes('idea evaluation')) {
    return {
      text: `### ⚖️ Idea Evaluation: The 10 / 100 / 1000 gm Framework

In design thinking and product ideation, the **10 / 100 / 1000 gm** framework categorizes generated ideas by weight, implementation effort, and strategic return on investment:

---

#### 🪶 1. 10 gm (Featherweight Ideas — Quick Wins)
* **Effort:** Minimal engineering effort (hours to days).
* **Scope:** Micro-interactions, copy improvements, keyboard shortcuts, UI contrast tuning, or removing a redundant form field.
* **Objective:** Immediate customer satisfaction and momentum building without architectural changes.

#### 📦 2. 100 gm (Midweight Ideas — Core Features)
* **Effort:** Moderate engineering effort (weeks to a quarter).
* **Scope:** Developing a new dedicated module, integrating an external payment gateway or auth provider, building a real-time notification engine.
* **Objective:** Measurable business metrics impact (conversion rate, retention, user engagement).

#### 🚀 3. 1000 gm (Heavyweight Ideas — Moonshots & Strategic Shifts)
* **Effort:** Substantial strategic commitment (6 months to multi-year).
* **Scope:** Architectural redesigns, proprietary patentable algorithms, AI engine integration, or expanding into entirely new markets.
* **Objective:** Creating an unassailable competitive moat and category leadership.`,
      sources: ['Design Thinking Evaluation Framework']
    };
  }

  if (lower.includes('desirability') && (lower.includes('feasibility') || lower.includes('viability'))) {
    return {
      text: `### 🎯 The Innovation Sweet Spot: Desirability, Feasibility & Viability

True innovation occurs strictly at the convergence of three foundational pillars:

---

\`\`\`text
                 DESIRABILITY
                   (Human)
                    /   \\
                   /  ★  \\
                  / (Sweet\\
                 /   Spot) \\
      FEASIBILITY ———————— VIABILITY
      (Technical)          (Business)
\`\`\`

1. **Desirability (Human / User):**
   * *Core Question:* *"Do people want this?"*
   * Focuses on empathy, emotional resonance, usability, and solving real, painful human problems.
   * If a product has feasibility and viability but lacks desirability, **nobody will adopt it**.

2. **Feasibility (Technical / Engineering):**
   * *Core Question:* *"Can we build and scale this?"*
   * Evaluates technical capacity, architecture, algorithmic complexity, hardware constraints, and infrastructure.
   * If a product is desirable and viable but not feasible, it remains an **unrealizable fantasy**.

3. **Viability (Economic / Business):**
   * *Core Question:* *"Is it sustainable and profitable?"*
   * Examines unit economics, pricing models, Customer Acquisition Cost (CAC), and Lifetime Value (LTV).
   * If a product is desirable and feasible but not viable, **the business will go bankrupt**.`,
      sources: ['Design Thinking & Innovation Strategy']
    };
  }

  // 2. DISCRETE MATHEMATICS & STRUCTURES
  if (lower.includes('hasse diagram') || lower.includes('poset') || lower.includes('lattice')) {
    return {
      text: `### 🌲 Posets, Hasse Diagrams & Lattices: Complete Guide

In Discrete Mathematics, order theory organizes elements into structured mathematical hierarchies.

---

#### 1. Partially Ordered Set (Poset)
A set $S$ together with a binary relation $\\le$ is a **Poset**, denoted $(S, \\le)$, if and only if the relation satisfies three properties:
* **Reflexivity:** $a \\le a$ for all $a \\in S$.
* **Antisymmetry:** If $a \\le b$ and $b \\le a$, then $a = b$.
* **Transitivity:** If $a \\le b$ and $b \\le c$, then $a \\le c$.
* *Classic Examples:* $(\\mathcal{P}(S), \\subseteq)$ (Power set under subset inclusion) and $(\\mathbb{Z}^+, \\mid)$ (Positive integers under divisibility).

---

#### 2. How to Construct a Hasse Diagram
A **Hasse Diagram** eliminates visual clutter from a Poset's directed graph:
1. **Remove all self-loops** (implied by reflexivity).
2. **Remove all transitive shortcut edges** (if $a \\rightarrow b$ and $b \\rightarrow c$, remove $a \\rightarrow c$).
3. **Orient upward:** Place element $y$ strictly higher than $x$ whenever $x < y$, replacing arrows with simple upward edges.

*Example:* Divisors of 12: $D_{12} = \\{1, 2, 3, 4, 6, 12\\}$ under divisibility:
\`\`\`text
         12
        /  \\
       4    6
      / \\  / \\
     /   \\/   \\
    2     3    \\
     \\   /     /
       1 —————
\`\`\`

---

#### 3. What is a Lattice?
A Poset $(L, \\le)$ is called a **Lattice** if **every pair of elements** $\{a, b\}$ possesses:
* A unique **Least Upper Bound (LUB / Join):** $a \\vee b = \\sup(a, b)$
* A unique **Greatest Lower Bound (GLB / Meet):** $a \\wedge b = \\inf(a, b)$
* *Application in CS:* Compiler static dataflow analysis, type hierarchy resolution, and cryptographic access control models.`,
      sources: ['Discrete Structures & Order Theory']
    };
  }

  if (lower.includes('pigeonhole') || lower.includes('pigeon hole')) {
    return {
      text: `### 🕊️ The Pigeonhole Principle & Its Applications

The **Pigeonhole Principle** is one of the most elegant and powerful non-constructive proof tools in discrete mathematics and computer science:

---

#### 1. Basic Principle
> If $n$ items (pigeons) are placed into $k$ containers (pigeonholes) and $n > k$, then **at least one container must contain two or more items**.

*Simple Example:* In any group of **367 people**, at least two must share a birthday, because there are at most 366 possible calendar birthdays!

---

#### 2. Generalized Pigeonhole Principle
> If $N$ objects are placed into $k$ boxes, then **at least one box must contain at least $\\lceil N / k \\rceil$ objects**.

*Numerical Example:* What is the minimum number of cards you must draw from a standard 52-card deck to guarantee at least 3 cards of the same suit?
* Here, the 4 suits are the "boxes" ($k = 4$). We need $\\lceil N / 4 \\rceil \\ge 3$.
* Setting $\\lceil N / 4 \\rceil = 3 \\implies \\frac{N-1}{4} = 2 \\implies N - 1 = 8 \\implies N = 9$.
* Drawing 9 cards guarantees at least 3 cards of the same suit!

---

#### 3. Core Computer Science Applications:
1. **Hash Collisions:** If a hash function maps $N$ distinct keys into a table with $M$ slots and $N > M$, collisions are mathematically unavoidable.
2. **Data Compression Limits:** Lossless compression algorithms cannot compress every possible input file. If an algorithm compressed all $N$-bit files to $< N$ bits, two distinct files would map to the same compressed representation, violating lossless reconstruction!`,
      sources: ['Discrete Mathematics & Combinatorics']
    };
  }

  if (!lower.includes('planar') && lower.includes('euler') && (lower.includes('hamiltonian') || lower.includes('circuit') || lower.includes('trail') || (lower.includes('graph') && !lower.includes('formula')))) {
    return {
      text: `### 🗺️ Euler vs. Hamiltonian Graphs: Comparison & Algorithms

Understanding the distinction between traversing edges vs. visiting vertices is fundamental in Graph Theory:

---

#### 📊 Side-by-Side Comparison:

| Feature | Eulerian Graph / Circuit | Hamiltonian Graph / Cycle |
|---|---|---|
| **What it visits** | Every **EDGE** exactly once | Every **VERTEX** exactly once |
| **Vertices visited** | Vertices may be revisited multiple times | Each vertex visited once (except start/end) |
| **Condition for Circuit** | Connected & **every vertex has an EVEN degree** | No simple necessary & sufficient condition |
| **Computational Complexity** | **$O(V + E)$ Polynomial Time** (Easy!) | **NP-Complete** (Provably Hard!) |
| **Famous Theorem** | Euler's Theorem (1736 - Königsberg Bridges) | Dirac's Theorem (If $\\deg(v) \\ge n/2 \\implies$ Hamiltonian) |
| **Classic Algorithm** | **Hierholzer's Algorithm** | Backtracking / Branch and Bound |

---

#### 1. Euler Path vs. Euler Circuit Conditions:
* **Euler Circuit:** A closed trail visiting every edge once and returning to the start.
  $$\\text{Exists} \\iff \\text{Connected and ALL vertices have EVEN degree}$$
* **Euler Path:** An open trail visiting every edge once.
  $$\\text{Exists} \\iff \\text{Connected and EXACTLY 2 vertices have ODD degree}$$ (starts at one odd vertex and terminates at the other).

---

#### 2. Real-World Engineering Applications:
* **Eulerian Paths:** Snowplow routing, mail carrier street delivery, circuit board drilling with minimal path retracing.
* **Hamiltonian Cycles:** The Traveling Salesperson Problem (TSP), genome fragment assembly, and network packet routing.`,
      sources: ['Graph Theory & Combinatorial Algorithms']
    };
  }

  if (lower.includes('generating function') || lower.includes('characteristic roots') || (lower.includes('recurrence') && lower.includes('linear'))) {
    return {
      text: `### 📈 Solving Linear Recurrence Relations: Characteristic Roots & Generating Functions

Linear recurrence relations with constant coefficients can be solved analytically using two primary methods:

---

#### 1. The Characteristic Roots Method
For a recurrence of the form:
$$a_n = c_1 a_{n-1} + c_2 a_{n-2}$$

##### Step-by-Step Procedure:
1. **Formulate the Characteristic Equation:** Replace $a_n$ with $r^n$:
   $$r^2 - c_1 r - c_2 = 0$$
2. **Find Roots $r_1, r_2$:**
   * **Case A (Distinct Real Roots $r_1 \\neq r_2$):**
     $$a_n = \\alpha_1 (r_1)^n + \\alpha_2 (r_2)^n$$
   * **Case B (Single Repeated Root $r_1 = r_2 = r$):**
     $$a_n = (\\alpha_1 + \\alpha_2 n) r^n$$
3. **Solve for Constants $\\alpha_1, \\alpha_2$:** Substitute base conditions (e.g. $a_0, a_1$) into the equation to create a simple system of 2 linear equations.

---

#### 2. Worked Example: The Fibonacci Sequence
$$F_n = F_{n-1} + F_{n-2}, \\quad F_0 = 0, F_1 = 1$$
1. Characteristic equation: $r^2 - r - 1 = 0$
2. Quadratic formula gives roots:
   $$r_1 = \\frac{1 + \\sqrt{5}}{2}, \\quad r_2 = \\frac{1 - \\sqrt{5}}{2}$$
3. General solution: $F_n = \\alpha_1 \\left(\\frac{1+\\sqrt{5}}{2}\\right)^n + \\alpha_2 \\left(\\frac{1-\\sqrt{5}}{2}\\right)^n$
4. Using $F_0 = 0 \\implies \\alpha_1 + \\alpha_2 = 0$ and $F_1 = 1 \\implies \\alpha_1 = \\frac{1}{\\sqrt{5}}, \\alpha_2 = -\\frac{1}{\\sqrt{5}}$.
5. **Binet's Closed-Form Formula:**
   $$F_n = \\frac{1}{\\sqrt{5}}\\left[\\left(\\frac{1+\\sqrt{5}}{2}\\right)^n - \\left(\\frac{1-\\sqrt{5}}{2}\\right)^n\\right]$$

---

#### 3. The Generating Function Method
Represent the infinite sequence as coefficients of a formal power series:
$$G(x) = \\sum_{n=0}^{\\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + \\dots$$
By multiplying by $x$ and $x^2$ and subtracting, the recurrence collapses into a closed algebraic rational expression:
$$G(x) = \\frac{P(x)}{Q(x)}$$
Decomposing into partial fractions directly exposes the closed-form coefficients!`,
      sources: ['Discrete Mathematics & Recurrence Analysis']
    };
  }

  // 3. JAVA & DATA STRUCTURES
  if (lower.includes('stringbuilder') || lower.includes('stringbuffer') || (lower.includes('string') && lower.includes('immutable'))) {
    return {
      text: `### 🧵 Java String vs. StringBuilder vs. StringBuffer: Definitive Guide

In Java, managing string memory efficiently is critical because naive string manipulation can severely degrade performance.

---

#### 📊 Comprehensive Comparison:

| Feature | \`String\` | \`StringBuilder\` (Java 5+) | \`StringBuffer\` |
|---|---|---|---|
| **Mutability** | **Immutable** (Cannot be altered once created) | **Mutable** (Modifiable in-place) | **Mutable** (Modifiable in-place) |
| **Thread Safety** | **Thread-Safe** (due to immutability) | ❌ **Not Thread-Safe** | ✅ **Thread-Safe** (\`synchronized\` methods) |
| **Memory Storage** | Heap & **String Constant Pool (SCP)** | Heap memory | Heap memory |
| **Performance** | Slow for loops ($O(N^2)$ allocations) | ⚡ **Fastest** (Zero lock overhead) | Moderate (Locking contention overhead) |
| **Use Case** | Constants, Map keys, entity fields | Single-threaded loops & concatenations | Multi-threaded shared string accumulators |

---

#### 🔍 Why Is \`String\` Immutable?
1. **String Constant Pool (SCP) Optimization:** Caches identical literals to save massive RAM.
2. **Security:** Strings are used for DB connection URLs, usernames, and file paths. If mutable, another thread could modify sensitive paths after validation!
3. **Hash Code Caching:** The hash value is calculated once on creation and cached, making Strings the ideal key for \`HashMap\`.

---

#### ⚠️ The Fatal Loop Mistake:
\`\`\`java
// ❌ TERRIBLE PRACTICE: Creates 10,000 garbage objects on the heap!
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i; // O(N^2) copying on every iteration
}

// ✅ CLEAN & OPTIMAL: Single mutable buffer resized dynamically
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i); // O(1) amortized append
}
String result = sb.toString();
\`\`\``,
      sources: ['Java Memory Architecture & Performance Specifications']
    };
  }

  if (lower.includes('stream api') || lower.includes('lambda') || (lower.includes('java') && lower.includes('functional'))) {
    return {
      text: `### ⚡ Java 8+ Functional Programming: Streams API & Lambdas

The **Stream API** (\`java.util.stream\`) brings functional, declarative data pipeline processing to Java collections:

---

#### 1. The 3 Phases of a Stream Pipeline:
1. **Source:** Origin collection, array, or I/O channel (\`list.stream()\`).
2. **Intermediate Operations (Lazy):** Transform the stream into another stream. Nothing executes until a terminal operation is called!
   * \`.filter(Predicate)\`: Retains items matching a boolean condition.
   * \`.map(Function)\`: Transforms elements into another type/value.
   * \`.sorted()\`: Sorts elements naturally or via \`Comparator\`.
   * \`.distinct()\`: Eliminates duplicates using \`.equals()\`.
3. **Terminal Operations (Eager):** Triggers the pipeline and produces a final result or side-effect.
   * \`.collect(Collectors.toList())\`, \`.count()\`, \`.reduce()\`, \`.forEach()\`, \`.findFirst()\`.

---

#### 2. Clean Code Example:
\`\`\`java
List<Student> students = getStudents();

// Extract names of honor students (GPA >= 3.8) sorted alphabetically:
List<String> honorRoll = students.stream()
    .filter(s -> s.getGpa() >= 3.8)       // Intermediate (Lazy)
    .map(Student::getName)                 // Intermediate (Method Reference)
    .sorted()                              // Intermediate
    .limit(10)                             // Intermediate (Short-circuit)
    .collect(Collectors.toList());         // Terminal (Executes pipeline!)
\`\`\`

---

#### 3. Key Advantages:
* **Declarative Readability:** Expresses *what* to do rather than writing nested loops and mutable state counters.
* **Effortless Parallelism:** Switching from \`.stream()\` to \`.parallelStream()\` distributes processing across multi-core CPUs via the ForkJoinPool!`,
      sources: ['Java 8+ Functional Architecture Guide']
    };
  }

  // 4. WEB TECHNOLOGIES
  if (lower.includes('cors') || lower.includes('cross origin')) {
    return {
      text: `### 🌐 CORS (Cross-Origin Resource Sharing): Complete Guide

**CORS** is a browser security mechanism governed by the **Same-Origin Policy (SOP)** that prevents unauthorized cross-domain data access.

---

#### 1. What Defines an "Origin"?
An origin consists of **Protocol + Domain + Port**:
* \`https://myweb.com:443\` vs \`http://myweb.com:80\` $\\rightarrow$ **Different origin** (different protocol/port).
* \`https://api.myweb.com\` vs \`https://myweb.com\` $\\rightarrow$ **Different origin** (subdomain difference).

---

#### 2. How CORS Works:
When frontend code at \`http://localhost:3000\` requests data from API at \`https://api.myapp.com\`:
1. **Simple Requests (\`GET\`, \`POST\` with standard headers):**
   * Browser sends request with header: \`Origin: http://localhost:3000\`.
   * If server permits this origin, it replies with header:
     \`Access-Control-Allow-Origin: http://localhost:3000\` (or \`*\`).
   * If header is missing, the browser **blocks the response** and throws a CORS error!
2. **Preflight Requests (\`OPTIONS\`):**
   * For complex requests (e.g. \`PUT\`, \`DELETE\`, or custom headers like \`Authorization: Bearer ...\`), the browser sends an automatic \`OPTIONS\` preflight request first to ask: *"Are you willing to accept my actual request?"*

---

#### 3. How to Fix CORS Errors (Server-Side Resolution):
* **Express.js (Node):**
  \`\`\`javascript
  const cors = require('cors');
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  \`\`\`
* **Spring Boot (Java):**
  \`\`\`java
  @CrossOrigin(origins = "http://localhost:3000")
  @GetMapping("/data")
  public ResponseEntity<Data> getData() { ... }
  \`\`\``,
      sources: ['Web Security & Modern Web Architecture']
    };
  }

  if (lower.includes('flexbox vs grid') || lower.includes('css grid vs flexbox') || (lower.includes('flexbox') && lower.includes('grid'))) {
    return {
      text: `### 📐 CSS Flexbox vs. CSS Grid: When to Use Which

Both Flexbox and CSS Grid are modern CSS layout models, but they are built for fundamentally different dimensions:

---

#### 📊 Core Comparison:

| Feature | CSS Flexbox | CSS Grid |
|---|---|---|
| **Dimension** | **1-Dimensional** (Row OR Column) | **2-Dimensional** (Rows AND Columns simultaneously) |
| **Approach** | Content-first (Items dictate sizing) | Layout-first (Predefined grid tracks dictate sizing) |
| **Alignment** | Superior for aligning items along one axis | Superior for complex structural page layout |
| **Overlapping** | Items cannot overlap naturally | Items can deliberately overlap on grid cells |
| **Container Property** | \`display: flex;\` | \`display: grid;\` |

---

#### 🎯 When to Use Which:
* **Use Flexbox When:**
  * Building navigation bars with logo on the left and links on the right (\`justify-content: space-between\`).
  * Centering a modal or card horizontally and vertically (\`justify-content: center; align-items: center;\`).
  * Distributing buttons, badges, or tag chips that wrap naturally.
* **Use CSS Grid When:**
  * Building an entire dashboard page layout (Header, Sidebar, Main Feed, Right Widgets, Footer).
  * Responsive card grids where each card must maintain uniform column widths across screen sizes:
    \`\`\`css
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    \`\`\``,
      sources: ['CSS3 Specifications & Modern Web Layouts']
    };
  }

  // 1B. DESIGN THINKING LAWS & ENTREPRENEURSHIP
  if (lower.includes('last 2%') || lower.includes('last 2 percent') || lower.includes('theory of prioritization') || lower.includes('less is more')) {
    return {
      text: `### ⚖️ Laws of Design Thinking: Simplification & Polish

Innovative products stand apart by adhering to three foundational design laws:

---

#### 1. Less is More
* **Principle:** Every unnecessary button, line of text, visual border, or step added to a user interface dilutes the core value proposition and increases cognitive friction.
* **Application:** Progressive disclosure — present only the essential controls upfront, revealing advanced options contextually when needed.

#### 2. The Last 2% Equals 200%
* **Principle:** While 98% of engineering goes into functional mechanics (making the code work), the final 2% spent on micro-animations, loading skeletons, sub-millisecond feedback, error recovery states, and typography polish produces **200% of the perceived user delight, trust, and market value**.

#### 3. Theory of Prioritization
* **Principle:** Managing trade-offs under constraints of time and resources using structured matrices:
  * **MoSCoW Matrix:** Categorizing features into *Must have* (core MVP), *Should have* (important enhancements), *Could have* (nice-to-have), and *Won't have right now*.
  * **Impact vs. Effort Grid:** Prioritize *High Impact, Low Effort* initiatives first.`,
      sources: ['Design Thinking Laws & Product Architecture']
    };
  }

  if (lower.includes('pitch deck') || lower.includes('patent') || lower.includes('complete specification') || lower.includes('ipr')) {
    return {
      text: `### 📑 Entrepreneurial Innovation: Pitch Decks & Patent Complete Specifications

Transforming design innovations into protected, funded commercial enterprises:

---

#### 🎯 1. The 10-Slide Investor Pitch Deck Architecture:
1. **Title & Tagline:** Clear one-sentence value proposition.
2. **The Problem:** The acute, quantified human or enterprise pain point.
3. **The Solution & Live Demo:** How your product uniquely eliminates the pain point.
4. **Market Opportunity:** TAM (Total Addressable), SAM (Serviceable Addressable), and SOM (Serviceable Obtainable Market).
5. **Product & Tech Architecture:** Proprietary algorithms, scalability, and technical defensibility.
6. **Business & Revenue Model:** Pricing tiers, margins, unit economics (LTV/CAC).
7. **Traction & Validation:** Active users, pilot tests, retention rates, or benchmark metrics.
8. **Competitive Moat:** Network effects, patents, proprietary data, switching costs.
9. **Team:** Key technical and business capabilities.
10. **The Ask:** Capital required and specific milestone allocations (Runway & Roadmap).

---

#### 🛡️ 2. Patent-Complete Specification Document:
When filing a full patent for an algorithmic or hardware innovation, the document must contain:
* **Title of Invention & Technical Field:** Clear domain identification.
* **Background & Prior Art:** Detailed explanation of current technology and its limitations.
* **Summary of the Invention:** Core mechanism solving prior art flaws.
* **Detailed Description & Flowcharts:** Step-by-step disclosure so a person skilled in the art can reproduce it (Enabling Disclosure).
* **Claims (Legal Core):**
  - **Independent Claims:** Broadest legal scope defining the novel combination of elements.
  - **Dependent Claims:** Specific embodiments adding narrower limitations (fallback protection).
* **Abstract:** 150-word concise technical overview.`,
      sources: ['Entrepreneurial Innovation & Intellectual Property Rights']
    };
  }

  // 2B. DISCRETE MATHEMATICS: LOGIC, PROOFS & RELATIONS
  if (lower.includes('modus ponens') || lower.includes('rules of inference') || lower.includes('propositional equival')) {
    return {
      text: `### 🧠 Rules of Inference & Propositional Logic

Formal logic provides the mathematical foundation for computer algorithms, database query optimizers, and automated verification:

---

#### 📐 The Primary Rules of Inference:

1. **Modus Ponens (Law of Detachment):**
   $$\\frac{p, \\quad p \\implies q}{\\therefore q}$$
   * *Intuition:* If hypothesis $p$ is true, and $p$ implies $q$, then $q$ must be true.

2. **Modus Tollens (Law of Contraposition):**
   $$\\frac{\\neg q, \\quad p \\implies q}{\\therefore \\neg p}$$
   * *Intuition:* If $q$ is false, but $p$ would guarantee $q$, then $p$ could not have occurred.

3. **Hypothetical Syllogism (Transitivity of Implication):**
   $$\\frac{p \\implies q, \\quad q \\implies r}{\\therefore p \\implies r}$$

4. **Disjunctive Syllogism:**
   $$\\frac{p \\lor q, \\quad \\neg p}{\\therefore q}$$

5. **Resolution (Core of Automated Provers & SAT Solvers):**
   $$\\frac{p \\lor q, \\quad \\neg p \\lor r}{\\therefore q \\lor r}$$

---

#### 🔄 Key Propositional Equivalences:
* **De Morgan's Laws:** $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$ and $\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$
* **Conditional Equivalence:** $p \\implies q \\equiv \\neg p \\lor q$
* **Contrapositive Equivalence:** $p \\implies q \\equiv \\neg q \\implies \\neg p$`,
      sources: ['Discrete Mathematics & Formal Logic']
    };
  }

  if (lower.includes('proof by contradiction') || lower.includes('proof by contraposition') || lower.includes('direct proof') || lower.includes('proof methods')) {
    return {
      text: `### ✍️ Methods of Mathematical Proof: Direct, Contraposition & Contradiction

Proving mathematical propositions and algorithmic correctness requires formal deduction:

---

#### 1. Direct Proof (Assume $P$, Prove $Q$)
* **Method:** Start with the hypothesis $P$ assumed true. Apply definitions, axioms, and established theorems through algebraic steps to directly arrive at $Q$.
* *Example:* Prove that if $n$ is an odd integer, then $n^2$ is odd.
  - Since $n$ is odd, $n = 2k + 1$ for some integer $k$.
  - $n^2 = (2k + 1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$.
  - Since $2k^2 + 2k$ is an integer $m$, $n^2 = 2m + 1$, which is odd! $\\blacksquare$

---

#### 2. Proof by Contraposition (Indirect Proof)
* **Method:** Prove the logically equivalent statement: $\\neg Q \\implies \\neg P$. Assume conclusion $Q$ is false, and prove hypothesis $P$ must be false.
* *When to use:* When $\\neg Q$ gives simpler algebraic structure than $P$ (e.g. proving *"If $3n+2$ is odd, then $n$ is odd"* by showing *"If $n$ is even, then $3n+2$ is even"*).

---

#### 3. Proof by Contradiction (Reductio ad Absurdum)
* **Method:** To prove $P$, assume that $P$ is **FALSE** (assume $\\neg P$). Follow logical steps until reaching an impossible contradiction ($R \\land \\neg R$ or $0 = 1$). This proves $\\neg P$ is impossible, so $P$ must be true!
* *Famous Example (Euclid's Infinitude of Primes):*
  - Assume there is a finite list of all primes $p_1, p_2, \\dots, p_k$.
  - Construct number $N = (p_1 \\times p_2 \\times \\dots \\times p_k) + 1$.
  - $N$ is either prime itself or divisible by a prime not in our list (dividing by any $p_i$ leaves remainder 1).
  - Contradiction! Hence, infinitely many primes exist. $\\blacksquare$`,
      sources: ['Discrete Structures & Proof Theory']
    };
  }

  if (lower.includes('planar graph') || lower.includes('graph coloring') || lower.includes('chromatic number')) {
    return {
      text: `### 🗺️ Planar Graphs, Euler's Formula & Graph Coloring

Planar graphs and vertex coloring form the bedrock of compiler optimization, circuit layout, and scheduling algorithms:

---

#### 1. Planar Graphs & Euler's Formula
A graph is **Planar** if it can be drawn in a 2D plane such that no edges intersect or cross each other.
* **Euler's Planar Formula:** For any connected planar graph with $V$ vertices, $E$ edges, and $F$ planar faces:
  $$V - E + F = 2$$
* **Planar Edge Bounds:** For $V \\ge 3$, every planar graph satisfies:
  $$E \\le 3V - 6$$
* **Kuratowski's Theorem:** A graph is planar $\\iff$ it does NOT contain a subgraph homeomorphic to:
  * $K_5$ (Complete graph on 5 vertices)
  * $K_{3,3}$ (Complete bipartite "utilities" graph on $3+3$ vertices)

---

#### 2. Graph Coloring & Chromatic Number ($\\chi(G)$)
* **Vertex Coloring:** Assigning colors to vertices such that **no two adjacent vertices share the same color**.
* **Chromatic Number $\\chi(G)$:** The absolute minimum number of colors needed to color graph $G$.
  * Bipartite Graph: $\\chi(G) = 2$
  * Complete Graph $K_n$: $\\chi(K_n) = n$
  * Cycle Graph $C_n$: $\\chi(C_n) = 2$ (if $n$ is even) or $3$ (if $n$ is odd)
* **The Four Color Theorem:** Any planar map can be colored using at most **4 colors**!
* **Engineering Applications:**
  * **Compiler Register Allocation:** Variables (vertices) with overlapping live ranges (edges) cannot share the same hardware register (color).
  * **Exam & Task Scheduling:** Courses with common students cannot be scheduled in the same exam timeslot.`,
      sources: ['Graph Theory & Discrete Structures']
    };
  }

  // 3B. PROFESSIONAL SOFT SKILLS & COMMUNICATION
  if (lower.includes('effective listening') || lower.includes('probing questions') || lower.includes('barriers to listening')) {
    return {
      text: `### 🎧 Professional Communication: Active Listening, Probing & Overcoming Barriers

In technical leadership and software engineering, effective listening directly determines system requirements accuracy and team alignment:

---

#### 1. Techniques of Active Listening:
* **The 80/20 Rule:** Spend 80% of client/team discovery meetings listening and 20% speaking.
* **Paraphrasing & Reflection:** Mirror back key architectural points: *"So if I understand correctly, our service must maintain sub-50ms latency even during payment gateway failovers?"*
* **Non-Verbal Attunement:** Open posture, eye contact, and nodding without interrupting mid-sentence.

---

#### 2. Mastering Probing Questions:
* **Clarifying Probes:** *"What specific error codes were returned when the cache invalidated?"*
* **Exploratory Probes:** *"What were the primary architectural trade-offs when choosing MongoDB over PostgreSQL?"*
* **Impact Probes:** *"How does this data inconsistency affect downstream analytics?"*

---

#### 3. Overcoming Barriers to Listening:
* **Physiological Barriers:** Cognitive fatigue and screen exhaustion $\\rightarrow$ Use structured meeting agendas and short syncs.
* **Psychological Barriers:** Rebuttal tendency (formulating counter-arguments while the other person is still speaking) and confirmation bias $\\rightarrow$ Adopt a beginner's mind.
* **Environmental Barriers:** Slack notifications and ambient noise $\\rightarrow$ Dedicate focused discovery sessions without multi-tasking.`,
      sources: ['Professional Engineering Communication & Leadership']
    };
  }

  if (lower.includes('nonverbal communication') || lower.includes('nvc') || lower.includes('body language')) {
    return {
      text: `### 🤝 Non-Verbal Communication (NVC) in Professional Engineering

Non-Verbal Communication conveys authority, empathy, and technical confidence beyond spoken words:

---

#### 1. Core Modes of Non-Verbal Communication:
* **Kinesics (Body Language & Posture):**
  * **Open Posture:** Shoulders back, arms uncrossed, hands visible (projects transparency, confidence, and active collaboration).
  * **Closed Posture:** Folded arms, hunched shoulders (projects defensiveness or disengagement).
* **Oculesics (Eye Contact):**
  * Maintaining steady 3–5 second eye contact signals honesty and focus. In video interviews, looking at the camera lens creates direct perceived eye contact.
* **Facial Expressions:** Congruence between technical enthusiasm and pleasant facial demeanor builds rapport with interviewers and stakeholders.
* **Gestures:** Purposeful hand movements illustrating architectural boundaries or scale; avoiding fidgeting or nervous habits.

---

#### 2. Professional Do's and Don'ts:
* ✅ **DO:** Maintain an upright, engaged seated posture; nod to validate speaker points; speak with measured cadence.
* ❌ **DON'T:** Check phone or smartwatch notifications during meetings; cross arms defensively when receiving code review feedback; look away repeatedly.`,
      sources: ['Professional Soft Skills & Organizational Behavior']
    };
  }

  // 4B. JAVA & PROBLEM SOLVING
  if (lower.includes('scanner vs bufferedreader') || (lower.includes('scanner') && lower.includes('bufferedreader'))) {
    return {
      text: `### ⚡ Java I/O Performance: Scanner vs. BufferedReader

Choosing the right input mechanism in Java can mean the difference between Time Limit Exceeded (TLE) and an optimal runtime:

---

#### 📊 Comprehensive Comparison:

| Feature | \`BufferedReader\` | \`Scanner\` |
|---|---|---|
| **Buffer Size** | **8 KB** default character buffer | **1 KB** small buffer |
| **Parsing Overhead** | Reads raw characters/strings; zero parsing overhead | Heavy overhead: parses primitives via Regex tokenization |
| **Speed** | ⚡ **Significantly Faster** (Ideal for large I/O) | Slower (Can TLE on inputs $> 10^5$) |
| **Thread Safety** | ✅ **Thread-Safe** (\`synchronized\` operations) | ❌ **Not Thread-Safe** |
| **Convenience** | Requires manual parsing: \`Integer.parseInt()\` | Built-in helper methods: \`.nextInt()\`, \`.nextDouble()\` |

---

#### 💻 Optimal Competitive Programming Fast I/O:
\`\`\`java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class FastIO {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        
        int n = Integer.parseInt(st.nextToken());
        int k = Integer.parseInt(st.nextToken());
    }
}
\`\`\``,
      sources: ['Java High-Performance I/O Architecture']
    };
  }

  if (lower.includes('matrix transpose') || lower.includes('rotate matrix') || lower.includes('matrix rotation')) {
    return {
      text: `### 🔄 Matrix Algorithms: In-Place Transpose & 90° Rotation

Matrix transformations are classic interview problems testing 2D array pointer manipulation:

---

#### 1. In-Place Matrix Transpose (Swapping Across Main Diagonal):
Given an $N \\times N$ matrix, swap \`matrix[i][j]\` with \`matrix[j][i]\` for all $j > i$:
\`\`\`java
void transpose(int[][] matrix, int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
}
\`\`\`

---

#### 2. Rotate Matrix 90° Clockwise In-Place:
The golden two-step transformation:
1. **Transpose the matrix** (rows become columns).
2. **Reverse each row** horizontally!

\`\`\`java
public void rotate(int[][] matrix) {
    int n = matrix.length;
    // Step 1: Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    // Step 2: Reverse each row
    for (int i = 0; i < n; i++) {
        int left = 0, right = n - 1;
        while (left < right) {
            int temp = matrix[i][left];
            matrix[i][left++] = matrix[i][right];
            matrix[i][right--] = temp;
        }
    }
}
\`\`\`
* **Time Complexity:** $O(N^2)$
* **Space Complexity:** **$O(1)$ strictly in-place!**`,
      sources: ['Matrix Manipulation & 2D Array Algorithms']
    };
  }

  if (lower.includes('abstract class vs interface') || lower.includes('interface vs abstract class')) {
    return {
      text: `### 🏛️ Java Abstract Classes vs. Interfaces: Complete Architecture

In Java OOP, abstract classes and interfaces establish contracts between systems:

---

#### 📊 Comprehensive Side-by-Side Comparison:

| Feature | Abstract Class (\`abstract class\`) | Interface (\`interface\`) |
|---|---|---|
| **Multiple Inheritance** | ❌ No (Class can extend only **one** class) | ✅ Yes (Class can implement **multiple** interfaces) |
| **State & Instance Fields** | Can maintain non-final instance fields | Only \`public static final\` constants |
| **Constructors** | Has constructors (called via \`super()\`) | ❌ Cannot have constructors |
| **Method Types** | Abstract, concrete, final, and static | Abstract, \`default\` (Java 8), and \`private\` (Java 9) |
| **Speed** | Slightly faster (direct virtual table index) | Slight interface dispatch lookup overhead |
| **Relationship** | **"IS-A"** identity hierarchy (e.g. \`Dog is an Animal\`) | **"CAN-DO"** capability contract (e.g. \`Payment can be Cloneable\`) |

---

#### 🎯 When to Use Which:
* **Use an Abstract Class when:**
  * You need to share code, state, and protected instance fields across closely related subclasses.
  * You want to utilize the **Template Method Pattern** (defining an algorithm skeleton with customizable steps).
* **Use an Interface when:**
  * You want to define a common role/contract for completely unrelated classes (e.g. \`Serializable\`, \`Comparable\`).
  * You want multiple inheritance of behavior.`,
      sources: ['Java Object-Oriented System Architecture']
    };
  }

  if (lower.includes('factory pattern') || lower.includes('strategy pattern') || lower.includes('template method pattern')) {
    return {
      text: `### 🏭 Java Software Design Patterns: Factory, Strategy & Template Method

Design patterns provide proven architectural templates for reusable, maintainable code:

---

#### 1. Factory Method Pattern (Creational)
* **Problem Solved:** Tight coupling caused by direct object instantiation with \`new ConcreteClass()\`.
* **Mechanism:** Subclasses or a dedicated creator method decide which concrete class to instantiate based on runtime parameters.
* *Example:* \`NotificationFactory.createNotification("EMAIL")\` returns an instance of \`EmailNotification\`.

---

#### 2. Strategy Pattern (Behavioral)
* **Problem Solved:** Long, brittle \`if-else\` or \`switch\` chains executing different algorithms.
* **Mechanism:** Encapsulates a family of algorithms behind a common interface, making them swappable at runtime without altering the context class.
* *Example:* A shopping cart where user can toggle between \`CreditCardStrategy\`, \`PayPalStrategy\`, or \`CryptoStrategy\` dynamically at checkout.

---

#### 3. Template Method Pattern (Behavioral)
* **Problem Solved:** Multiple classes implementing identical multi-step workflows with slight variations in individual steps.
* **Mechanism:** An abstract base class defines the invariant skeleton of an algorithm in a \`final\` template method, while leaving specific abstract hook methods for child classes to override.`,
      sources: ['Software Design Patterns (Gang of Four)']
    };
  }

  // 5B. WEB TECHNOLOGIES: DOM, STORAGE & CSS
  if (lower.includes('box model') || lower.includes('css box model')) {
    return {
      text: `### 📦 The CSS Box Model: Visual Anatomy & Calculations

Every rendered element on a web page is fundamentally a rectangular box:

---

\`\`\`text
+------------------------------------------+
|                 MARGIN                   |  <- Space outside border (transparent)
|  +------------------------------------+  |
|  |              BORDER                |  <- Visible line around padding
|  |  +------------------------------+  |  |
|  |  |           PADDING            |  |  |  <- Space inside border (colored by background)
|  |  |  +------------------------+  |  |  |
|  |  |  |        CONTENT         |  |  |  |  <- Actual text, image, or elements
|  |  |  +------------------------+  |  |  |
|  |  +------------------------------+  |  |
|  +------------------------------------+  |
+------------------------------------------+
\`\`\`

#### 📐 Total Rendered Width Calculation:
* **Standard Box Model (\`box-sizing: content-box\`):**
  $$\\text{Total Width} = \\text{width} + \\text{padding-left} + \\text{padding-right} + \\text{border-left} + \\text{border-right} + \\text{margins}$$
  *(Setting \`width: 200px\` with \`padding: 20px\` makes the element 240px wide — breaks layouts!)*
* **Modern Box Model (\`box-sizing: border-box\`):**
  $$\\text{Total Width} = \\text{width (includes padding and border!)}$$
  *(Setting \`width: 200px\` keeps it exactly 200px wide!)*

#### 🌟 Modern CSS Reset Best Practice:
\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
\`\`\``,
      sources: ['CSS3 Box Model & Layout Specifications']
    };
  }

  if (lower.includes('event bubbling') || lower.includes('event delegation')) {
    return {
      text: `### 🎯 DOM Event Propagation: Bubbling, Capturing & Delegation

Understanding how events travel through the DOM tree is critical for writing clean, performant JavaScript:

---

#### 1. The 3 Phases of Event Propagation:
1. **Capturing Phase:** Event travels **downwards** from the \`window\` ➔ \`document\` ➔ \`<html>\` ➔ target element.
2. **Target Phase:** Event reaches the exact element clicked/triggered.
3. **Bubbling Phase:** Event bubbles **upwards** back to the root, triggering ancestor listeners!
   * *Stopping Bubbling:* \`event.stopPropagation()\` prevents ancestors from firing.

---

#### 2. What is Event Delegation?
Instead of attaching individual click listeners to 1,000 list items (\`<li>\`), you attach **a single listener to the parent \`<ul>\` container**!
When an item is clicked, the event bubbles up to the parent, where you inspect \`event.target\`:

\`\`\`javascript
document.querySelector('#todo-list').addEventListener('click', (e) => {
    // Check if clicked element is a delete button:
    if (e.target.matches('.delete-btn')) {
        const taskId = e.target.dataset.id;
        deleteTask(taskId);
    }
});
\`\`\`
* **Benefits:** Saves massive memory, and automatically works for newly added dynamic elements without re-attaching listeners!`,
      sources: ['W3C DOM Level 3 Events Specification']
    };
  }

  if (lower.includes('localstorage') || lower.includes('sessionstorage') || lower.includes('cookies')) {
    return {
      text: `### 💾 Browser Storage: LocalStorage vs. SessionStorage vs. Cookies

Modern web applications use different client-side storage mechanisms depending on data persistence needs:

---

#### 📊 Comprehensive Storage Matrix:

| Feature | \`localStorage\` | \`sessionStorage\` | \`Cookies\` |
|---|---|---|---|
| **Capacity** | **~5 to 10 MB** | **~5 MB** | **4 KB** (Tiny) |
| **Lifespan** | Persistent until explicitly deleted | Until browser tab/window is closed | Until expiration date set by server/client |
| **Network Traffic** | Never sent to server automatically | Never sent to server automatically | **Sent with every HTTP request** in \`Cookie\` header |
| **Accessibility** | Any window/tab on same origin | Same tab only | Any window/tab on same origin |
| **Ideal For** | User themes (Dark/Light mode), drafts | Single-session wizard forms, temp filters | Auth session tokens (\`HttpOnly\` secure cookies) |

---

#### 💻 Clean Storage Code Example:
\`\`\`javascript
// 1. LocalStorage (String key-value pairs)
localStorage.setItem('user_theme', 'dark');
const theme = localStorage.getItem('user_theme');

// Storing Objects via JSON serialization:
localStorage.setItem('settings', JSON.stringify({ notifications: true }));
const settings = JSON.parse(localStorage.getItem('settings'));
\`\`\``,
      sources: ['HTML5 Web Storage Specification']
    };
  }

  // 1C. DESIGN THINKING: VAL, JOURNEY MAPPING, MIND MAPPING & BUSINESS MODELS
  if (lower.includes('val') && (lower.includes('capacity') || lower.includes('lever') || lower.includes('growth') || lower.includes('vision'))) {
    return {
      text: `### 🚀 The 3 Capacity Levers of Innovation: VAL Framework

The **VAL** framework articulates the three core organizational and psychological levers that empower teams to turn ambitious design concepts into scalable realities:

---

#### 1. V — Vision (Strategic Direction)
* **The Principle:** A clear, compelling, and ambitious picture of the future state that solves the core human problem.
* **Impact:** Without a unified vision, teams fall into local optimization traps and build fragmented features rather than cohesive products.
* **Leadership Action:** Formulate an inspiring North Star metric and transparent product roadmap.

#### 2. A — Alignment (Cross-Functional Synergy)
* **The Principle:** Harmonizing engineering, design, marketing, and business operations toward the same target outcomes.
* **Impact:** Eliminates organizational silos where engineers build features that designers did not specify or that sales cannot sell.
* **Leadership Action:** Shared sprint goals, cross-disciplinary design critiques, and unified Design Systems.

#### 3. L — Leadership (Psychological Safety & Empowerment)
* **The Principle:** Fostering a culture where experimentation, iterative prototyping, and calculated risk-taking are actively rewarded.
* **Impact:** Removes the fear of failure, encouraging rapid low-fidelity testing before heavy capital expenditure.
* **Leadership Action:** Decentralized decision-making, blame-free post-mortems, and rapid resource allocation.`,
      sources: ['Design Mind & Strategic Innovation Framework']
    };
  }

  if (lower.includes('journey map') || lower.includes('customer journey') || lower.includes('empathy research') || lower.includes('persona development') || lower.includes('define phase') || lower.includes('how might we')) {
    return {
      text: `### 🗺️ Design Thinking Process: Empathy, Personas, Journey Maps & Define Phase

The foundation of human-centered innovation relies on deeply understanding user needs before writing a single line of code:

---

#### 1. Empathy Research & The Empathy Map
* **Techniques:** Immersive observational shadowing, active listening interviews, and contextual inquiry.
* **The Empathy Map Quadrants:**
  * **Says:** Direct, explicit quotes from the user during interviews.
  * **Thinks:** Unspoken beliefs, values, and subconscious motivations.
  * **Does:** Observable physical behaviors, workflows, and workarounds.
  * **Feels:** Emotional states, anxieties, frustrations, and moments of delight.
* *Key Insight:* Greatest breakthroughs occur when uncovering contradictions between what users *say* and what they *actually do*!

---

#### 2. Persona Development
* An archetypal synthesis of real empirical user data representing a specific target audience segment.
* **Core Components:**
  * **Demographics & Role:** Age, technical background, work environment.
  * **Goals & Motivations:** What they want to accomplish efficiently.
  * **Pain Points & Frustrations:** Roadblocks, latency, confusing interfaces, cognitive overload.
  * **Tech Stack & Habits:** Preferred devices, software fluency, and mental models.

---

#### 3. Customer Journey Mapping (CJM)
* Chronological visualization of the user's end-to-end experience across touchpoints:
  $$\\text{Awareness} \\longrightarrow \\text{Discovery} \\longrightarrow \\text{Onboarding} \\longrightarrow \\text{Core Usage} \\longrightarrow \\text{Retention / Advocacy}$$
* **Mapping Dimensions:** User Actions, Emotional Arc (Highs/Lows curve), Pain Points, and High-Impact Opportunities for intervention.

---

#### 4. Define Phase & "How Might We" (HMW) Questions
* Synthesizing raw empathy data into a razor-sharp **Actionable Problem Statement**:
  $$\\text{[User Persona]} \\text{ needs a way to } \\text{[User Need]} \\text{ because } \\text{[Surprising Root Insight]}.$$
* Reframing constraints into open ideation launchpads:
  * *"How might we help beginner developers debug memory leaks without overwhelming them with terminal stack traces?"*`,
      sources: ['Human-Centered Design & User Research Frameworks']
    };
  }

  if (lower.includes('mind map') || lower.includes('mind mapping') || lower.includes('ideation') || lower.includes('brainstorming') || lower.includes('anti-patterns in ideation') || lower.includes('antipattern')) {
    return {
      text: `### 💡 Ideation Techniques, Mind Mapping & Anti-Pattern Avoidance

Ideation transitions teams from analyzing user problems to generating a rich volume of divergent creative solutions:

---

#### 1. Core Ideation Techniques:
* **Brainstorming with Deferment of Judgment:** Prioritize quantity over quality initially. Never critique or shoot down an idea during divergence.
* **Mind Mapping:** A radial visual diagram that radiates outward from a central core challenge:
  * **Central Node:** The core problem statement or HMW question.
  * **Primary Branches:** High-level themes (e.g., UI Automation, Hardware Acceleration, Gamification).
  * **Sub-branches:** Specific actionable feature concepts and technical implementations.
* **SCAMPER Method:** **S**ubstitute, **C**ombine, **A**dapt, **M**odify/Magnify, **P**ut to another use, **E**liminate, **R**everse.

---

#### 2. Destructive Anti-Patterns in Ideation & Countermeasures:
| Anti-Pattern | Description & Harm | Strategic Countermeasure |
|---|---|---|
| **HiPPO Effect** | "Highest Paid Person's Opinion" dominates and silences team ideas | Silent "Brainwriting" (everyone writes ideas on post-its simultaneously) |
| **Premature Convergence** | Falling in love with the very first feasible idea and ending exploration | Mandate generating at least 50 ideas before any evaluation |
| **Groupthink** | Team members conform to consensus to avoid friction or conflict | Assign an explicit "Devil's Advocate" to challenge assumptions |
| **Analysis Paralysis** | Overthinking technical edge cases before the concept is even proven | Rapid paper prototyping within 1-hour timeboxes |`,
      sources: ['Creative Ideation & Innovation Engineering']
    };
  }

  if (lower.includes('business model') || lower.includes('business models') || lower.includes('financial estimation') || lower.includes('business model canvas') || lower.includes('bmc')) {
    return {
      text: `### 💼 Business Model Canvas (BMC) & Financial Estimation for Innovation

A brilliant technical solution fails unless backed by a sustainable, scalable business model:

---

#### 1. The 9 Building Blocks of the Business Model Canvas:
1. **Value Propositions:** The unique quantitative & qualitative value delivered to the user.
2. **Customer Segments:** Distinct user groups targeted (B2B Enterprise, B2C, Prosumer).
3. **Channels:** Distribution and communication touchpoints (Direct Web, SaaS, App Store, API).
4. **Customer Relationships:** Self-service, automated onboarding, dedicated enterprise account reps.
5. **Revenue Streams:** Subscription (SaaS), freemium, usage-based compute, marketplace commission.
6. **Key Resources:** Cloud infrastructure, proprietary algorithms, specialized talent, patents.
7. **Key Activities:** Software development, algorithm optimization, security audits, customer support.
8. **Key Partnerships:** Cloud vendors (AWS/GCP), API providers, payment gateways, open-source communities.
9. **Cost Structure:** Fixed costs (salaries, licenses) and Variable costs (server compute, bandwidth, storage).

---

#### 2. Financial Estimation Metrics:
* **CapEx vs. OpEx:** Capital Expenditure (one-time R&D hardware/licenses) vs. Operational Expenditure (monthly recurring cloud servers, APIs).
* **Unit Economics:**
  * **CAC (Customer Acquisition Cost):** Total sales & marketing expenses $\\div$ new users acquired.
  * **LTV (Lifetime Value):** Gross profit generated per customer across their entire relationship.
  * **Rule of Thumb:** $\\mathbf{\\text{LTV} / \\text{CAC} \\ge 3.0}$ for a healthy, venture-backable SaaS.
* **Burn Rate & Runway:** Monthly net cash depletion and remaining months before capital exhaustion.`,
      sources: ['Entrepreneurial Innovation & Startup Finance']
    };
  }

  if (lower.includes('mystery') && (lower.includes('heuristics') || lower.includes('algorithm') || lower.includes('knowledge funnel'))) {
    return {
      text: `### 🔮 The Knowledge Funnel: Mystery ➔ Heuristics ➔ Algorithm

Roger Martin's **Knowledge Funnel** describes how human innovation transforms raw ambiguity into scalable computer software:

---

\`\`\`text
       \\    MYSTERY    /     <- Ambiguous, unstructured chaos with unknown variables
        \\             /
         \\ HEURISTICS/       <- Rule of thumb, intuitive guidelines, patterns
          \\         /
           |ALGORITHM|        <- Deterministic, automated, perfectly scalable code
\`\`\`

1. **Stage 1: Mystery (The Unknown Space)**
   * A complex, unresolved problem where causes and effects are murky.
   * *Example:* "Why do web users abandon their shopping carts at checkout?" or "How can computers understand spoken human dialogue?"
   * Handled by exploratory empathy, qualitative research, and deep domain observation.

2. **Stage 2: Heuristics (Rules of Thumb & Patterns)**
   * Rules, guidelines, and mental models that narrow the problem space from infinite to manageable.
   * *Example:* "Keep checkout forms under 3 steps," or "Use N-gram frequency analysis to predict the next word."
   * Success rate improves, but execution requires skilled human judgment and intuition.

3. **Stage 3: Algorithm (Standardized, Scalable Automation)**
   * Codifying heuristics into explicit mathematical formulas, deterministic logic, and software code.
   * *Example:* A 1-click tokenized payment API (Stripe) or Transformer-based Neural Network (LLM).
   * Algorithms scale infinitely with near-zero marginal cost, creating massive commercial value.`,
      sources: ['The Design of Business & Knowledge Funnel Theory']
    };
  }

  // 2C. DISCRETE MATHEMATICS: INCLUSION-EXCLUSION, FUNCTIONS, QUANTIFIERS & ISOMORPHISM
  if (lower.includes('inclusion-exclusion') || lower.includes('inclusion exclusion') || lower.includes('power set') || lower.includes('computer representation of set')) {
    return {
      text: `### 🔢 Discrete Set Structures: Inclusion-Exclusion, Power Sets & Bit Vectors

Set theory forms the foundational mathematical substrate for databases, relational algebra, and bitwise programming:

---

#### 1. The Principle of Inclusion-Exclusion (PIE):
To compute the size of the union of overlapping sets, add the sizes of individual sets, subtract pairwise intersections, add 3-way intersections, and alternate signs:
* **For 2 Sets:**
  $$|A \\cup B| = |A| + |B| - |A \\cap B|$$
* **For 3 Sets:**
  $$|A \\cup B \\cup C| = |A| + |B| + |C| - (|A \\cap B| + |B \\cap C| + |A \\cap C|) + |A \\cap B \\cap C|$$
* **General Formula for $n$ Sets:**
  $$\\left|\\bigcup_{i=1}^n A_i\\right| = \\sum_{k=1}^n (-1)^{k-1} \\sum_{1 \\le i_1 < \\dots < i_k \\le n} |A_{i_1} \\cap \\dots \\cap A_{i_k}|$$

---

#### 2. Power Set ($\\mathcal{P}(S)$):
* The set of all subsets of $S$, including the empty set $\\emptyset$ and $S$ itself.
* If $|S| = n$, then the cardinality of the power set is strictly:
  $$|\\mathcal{P}(S)| = 2^n$$
* *Example:* If $S = \\{a, b\\}$, then $\\mathcal{P}(S) = \\{\\emptyset, \\{a\\}, \\{b\\}, \\{a, b\\}\\}$.

---

#### 3. Computer Representation of Sets (Bit Vector / Masking):
In computer memory, a finite universal set $U = \\{e_0, e_1, \\dots, e_{k-1}\\}$ of up to 64 elements can be stored in a **single 64-bit integer**!
* Element $e_i \\in S \\iff$ bit $i$ is \`1\`.
* **Set Operations compile into instant single-cycle CPU instructions:**
  * **Union ($A \\cup B$):** Bitwise OR (\`A | B\`)
  * **Intersection ($A \\cap B$):** Bitwise AND (\`A & B\`)
  * **Complement ($A'$):** Bitwise NOT (\`~A\`)
  * **Difference ($A \\setminus B$):** \`A & (~B)\`
  * **Subset Check ($A \\subseteq B$):** \`(A & B) == A\``,
      sources: ['Discrete Mathematics & Set Theory']
    };
  }

  if (lower.includes('injective') || lower.includes('bijective') || lower.includes('surjective') || lower.includes('floor function') || lower.includes('ceiling function') || lower.includes('boolean function')) {
    return {
      text: `### 🎯 Discrete Functions: Injective, Surjective, Bijective & CS Functions

Functions map elements from a domain $X$ to a codomain $Y$:

---

#### 1. Function Classifications:
* **Injective (One-to-One):** Every element of domain maps to a distinct element in codomain:
  $$f(a) = f(b) \\implies a = b$$
  *(No two inputs produce the same output. No collisions!)*
* **Surjective (Onto):** Every element of the codomain is mapped to by at least one element of the domain:
  $$\\forall y \\in Y, \\; \\exists x \\in X \\text{ such that } f(x) = y$$
  *($\\text{Range} = \\text{Codomain}$)*
* **Bijective (One-to-One & Onto):** Both injective AND surjective.
  * *Crucial Property:* A function has a two-sided **Inverse Function** $f^{-1}$ if and only if it is **Bijective**!

---

#### 2. Essential Functions for Computer Science:
* **Floor Function ($\\lfloor x \\rfloor$):** The greatest integer less than or equal to $x$ (e.g. $\\lfloor 3.8 \\rfloor = 3, \\lfloor -2.3 \\rfloor = -3$).
  * *CS Usage:* Integer division, binary search midpoints $\\lfloor (L + R) / 2 \\rfloor$, tree height calculations $\\lfloor \\log_2 N \\rfloor$.
* **Ceiling Function ($\\lceil x \\rceil$):** The smallest integer greater than or equal to $x$ (e.g. $\\lceil 3.2 \\rceil = 4, \\lceil -2.7 \\rceil = -2$).
  * *CS Usage:* Memory pagination, buffer chunk allocation $\\lceil N / \\text{pageSize} \\rceil$.
* **Boolean Functions:** Functions of the form $f: \\{0, 1\\}^n \\to \\{0, 1\\}$ mapping $n$-bit binary vectors to a single bit. They model every combinational logic circuit and ALU instruction in hardware.`,
      sources: ['Discrete Structures & Functions for Computer Science']
    };
  }

  if (lower.includes('predicate') || lower.includes('quantifier') || lower.includes('negation of quantified')) {
    return {
      text: `### 🔍 Predicate Logic, Quantifiers & Negations

Predicate logic extends propositional logic by introducing variables, predicates, and quantifiers:

---

#### 1. The Two Fundamental Quantifiers:
* **Universal Quantifier ($\\forall$ — "For All"):**
  $$\\forall x \\; P(x)$$
  * True if and only if $P(x)$ is true for **every single element** in the domain of discourse.
  * False if there exists even a single counterexample.
* **Existential Quantifier ($\\exists$ — "There Exists"):**
  $$\\exists x \\; P(x)$$
  * True if there is **at least one element** in the domain where $P(x)$ is true.
  * False if $P(x)$ is false for every element.

---

#### 2. Negation of Quantified Statements (De Morgan's Laws for Quantifiers):
When pushing a negation $\\neg$ through a quantifier, the quantifier flips:
* **Negating a Universal Statement:**
  $$\\neg \\big(\\forall x \\; P(x)\\big) \\equiv \\exists x \\; \\neg P(x)$$
  *(To disprove "All algorithms run in $O(N)$ time", you only need to show "There exists an algorithm that does NOT run in $O(N)$ time".)*
* **Negating an Existential Statement:**
  $$\\neg \\big(\\exists x \\; P(x)\\big) \\equiv \\forall x \\; \\neg P(x)$$
  *(Disproving "There exists a bug in the code" means proving "All paths in the code are bug-free".)*

---

#### 3. Order of Nested Quantifiers Matters!
$$\\forall x \\; \\exists y \\; (x + y = 0) \\quad \\text{vs.} \\quad \\exists y \\; \\forall x \\; (x + y = 0)$$
* The first statement is **True** over $\\mathbb{R}$ (for every $x$, we can choose $y = -x$).
* The second statement is **False** (there is no single constant $y$ that makes $x + y = 0$ for all numbers $x$).`,
      sources: ['Predicate Calculus & Mathematical Logic']
    };
  }

  if (lower.includes('graph isomorphism') || lower.includes('isomorphic graph')) {
    return {
      text: `### 🕸️ Graph Isomorphism: Mathematical Definition & Properties

Two graphs that look visually different may be structurally identical:

---

#### 1. Formal Definition:
Simple graphs $G_1 = (V_1, E_1)$ and $G_2 = (V_2, E_2)$ are **Isomorphic** (denoted $G_1 \\cong G_2$) if and only if there exists a **bijective function** $f: V_1 \\to V_2$ such that:
$$(u, v) \\in E_1 \\iff (f(u), f(v)) \\in E_2 \\quad \\forall u, v \\in V_1$$
*In plain words: An isomorphism is an edge-preserving relabeling of vertices.*

---

#### 2. Necessary Graph Invariants (Quick Sanity Checks):
If two graphs are isomorphic, they **must** share all the following properties (though sharing them does not guarantee isomorphism!):
1. **Same number of vertices:** $|V_1| = |V_2|$.
2. **Same number of edges:** $|E_1| = |E_2|$.
3. **Identical degree sequence:** Both graphs must have the exact same list of vertex degrees.
4. **Same cycle structure:** If $G_1$ contains a triangle ($C_3$), $G_2$ must also contain a triangle.
5. **Same chromatic number and connected components.**

---

#### 3. Computational Complexity:
* The **Graph Isomorphism Problem** occupies a unique place in theoretical computer science: it is neither known to be solvable in polynomial time (P) nor proven to be NP-complete (it belongs to the **NP-Intermediate** class).
* In 2015, László Babai proved that Graph Isomorphism can be solved in **Quasi-polynomial time** ($2^{O((\\log N)^c)}$).`,
      sources: ['Graph Theory & Structural Combinatorics']
    };
  }

  // 3C. COMMUNICATION & SOFT SKILLS: READING, PROPOSALS & MINUTES OF MEETINGS
  if (lower.includes('techniques of effective reading') || lower.includes('sq3r') || lower.includes('skimming') || lower.includes('scanning') || lower.includes('says does means')) {
    return {
      text: `### 📖 Techniques of Effective Reading: SQ3R & Critical Interpretation

In engineering and academic research, effective reading transforms passive consumption into active knowledge extraction:

---

#### 1. Core Reading Strategies:
* **Skimming:** Rapid visual sweep over titles, headings, abstract, and conclusions to grasp the macro architecture and main thesis.
* **Scanning:** Searching specifically for a targeted keyword, metric, or code snippet without reading every sentence.
* **Intensive Reading:** Deep, line-by-line analytical evaluation of complex algorithms, mathematical proofs, and technical specifications.
* **Extensive Reading:** Wide, contextual reading across domain literature to build holistic background intuition.

---

#### 2. The SQ3R Academic Reading Framework:
1. **Survey:** Preview chapter headings, diagrams, and summaries.
2. **Question:** Formulate active questions: *"What trade-off is this algorithm making?"*
3. **Read:** Read focused sections looking specifically for answers to your questions.
4. **Recite:** Summarize the core concept aloud or in notes in your own words.
5. **Review:** Re-evaluate key concepts 24 hours later to cement retention in long-term memory.

---

#### 3. The Says / Does / Means Critical Analysis:
* **What the text SAYS:** The literal factual statements and direct claims.
* **What the text DOES:** The rhetorical function (e.g., refuting an existing hypothesis, introducing a benchmarking metric, defending an edge case).
* **What the text MEANS:** The broader engineering and real-world significance of the findings.`,
      sources: ['Academic Reading Strategies & Critical Text Analysis']
    };
  }

  if (lower.includes('proposal writing') || lower.includes('proposal for higher studies') || lower.includes('minutes of meeting') || lower.includes('record the proceedings') || lower.includes('signposting')) {
    return {
      text: `### 📝 Professional Technical Writing: Proposals, Minutes of Meetings & Signposting

Professional engineering communication requires structured, unambiguous writing:

---

#### 1. Research Proposal Architecture (For Higher Studies & Grants):
1. **Title:** Concise, informative, and indicative of methodology.
2. **Abstract:** 250-word synthesis of problem, proposed approach, and expected contribution.
3. **Introduction & Problem Statement:** Highlighting the critical research gap in current literature.
4. **Literature Review:** Critical synthesis of state-of-the-art work (not a mere list).
5. **Methodology & Architecture:** Algorithms, datasets, experimental setups, and evaluation metrics.
6. **Work Plan & Timeline:** Gantt chart mapping milestones across academic semesters.
7. **Expected Impact & References:** Tangible contributions to industry/academia.

---

#### 2. Recording Minutes of Meetings (MoM):
A professional MoM document ensures team accountability and eliminates post-meeting ambiguity:
* **Header:** Date, Time, Location/Link, Meeting Chair, and List of Attendees & Absentees.
* **Agenda Review:** The topics scheduled for discussion.
* **Discussion Summary:** Brief, objective summary of arguments without verbatim transcriptions.
* **Decisions Made:** Explicit recording of agreed architectural choices.
* **Action Items Table (The Most Critical Section):**
  | Action Item | Owner / Assignee | Hard Deadline | Status |
  |---|---|---|---|
  | Set up Redis caching cluster | Dev Team (Alex) | Sept 15 | In Progress |
  | Refactor auth token validation | Security (Sam) | Sept 18 | Pending |

---

#### 3. Signposting Techniques:
Signposts are linguistic transition markers that guide the reader through your logical train of thought:
* **Major Signposts:** *"This report examines three primary bottlenecks: First... Next... Finally..."*
* **Linking Signposts:** *"Consequently," "In contrast," "Furthermore," "Crucially."
* **Summary Signposts:** *"In summary, the benchmark data demonstrates..."*`,
      sources: ['Professional Technical Writing & Engineering Documentation']
    };
  }

  // 4C. JAVA ALGORITHMS: TWO POINTER, SLIDING WINDOW, PREFIX SUM & EXCEPTIONS
  if (!lower.includes('convolution') && !lower.includes('cnn') && (lower.includes('two pointer') || lower.includes('two-pointer') || lower.includes('sliding window') || lower.includes('prefix sum'))) {
    return {
      text: `### ⚡ Algorithmic Optimization: Two-Pointer, Sliding Window & Prefix Sum

These three algorithmic paradigms transform naive $O(N^2)$ brute-force solutions into blazing-fast $O(N)$ linear time algorithms:

---

#### 1. The Two-Pointer Technique
* **When to use:** Sorted arrays, palindrome checks, or searching for pairs meeting a condition.
* **Mechanism:** Two indices move toward each other (converging) or in the same direction (fast/slow runner).
* **Two Sum on Sorted Array:**
\`\`\`java
public boolean hasPairWithSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        else if (sum < target) left++; // Need a larger sum
        else right--; // Need a smaller sum
    }
    return false;
}
\`\`\`
* **Complexity:** $O(N)$ Time, $O(1)$ Space.

---

#### 2. The Sliding Window Technique
* **When to use:** Contiguous subarrays or subsegments (maximum sum subarray of size $K$, longest substring with unique characters).
* **Mechanism:** Maintain a window $[L, R]$. Expand $R$ to include new elements; contract $L$ when constraints are violated.
* **Maximum Sum Subarray of Size $K$:**
\`\`\`java
public int maxSumSubarray(int[] arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    maxSum = windowSum;
    
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k]; // Slide window: add new, drop oldest
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
\`\`\`
* **Complexity:** $O(N)$ Time, $O(1)$ Space.

---

#### 3. The Prefix Sum Technique
* **When to use:** Answering multiple Range Sum Queries in $O(1)$ time.
* **Precomputation:** $P[i] = P[i-1] + arr[i]$ with $P[0] = 0$.
* **Range Query Sum $(L, R)$:**
  $$\\text{Sum}(L, R) = P[R + 1] - P[L]$$
* **Complexity:** $O(N)$ precomputation time, **$O(1)$ per query!**`,
      sources: ['Algorithmic Problem Solving & Optimization Patterns']
    };
  }

  if (lower.includes('exception hierarchy') || lower.includes('try catch finally') || lower.includes('throw vs throws') || lower.includes('custom exception')) {
    return {
      text: `### 🛡️ Java Exception Handling Hierarchy & Custom Exceptions

Java's exception handling mechanism enforces structured runtime reliability:

---

#### 1. The Throwable Class Hierarchy:
\`\`\`text
                  Throwable
                 /         \\
            Exception        Error (Fatal JVM crashes: OutOfMemoryError, StackOverflowError)
           /         \\
    Checked Exceptions   RuntimeException (Unchecked Exceptions)
    (IOException,        (NullPointerException,
     SQLException)        ArrayIndexOutOfBoundsException,
                          ArithmeticException)
\`\`\`

* **Checked Exceptions:** Inherit from \`Exception\` (excluding \`RuntimeException\`). Must be handled via \`try-catch\` or declared in the method signature via \`throws\`. Checked at compile-time!
* **Unchecked Exceptions:** Inherit from \`RuntimeException\`. Represent programming bugs and logic errors. Optional to catch; not enforced at compile time.

---

#### 2. \`throw\` vs. \`throws\`:
* **\`throw\`:** Keyword used inside a method body to explicitly trigger an exception instance: \`throw new IllegalArgumentException("Balance cannot be negative");\`.
* **\`throws\`:** Keyword used in a method declaration to warn callers that the method might propagate an exception: \`public void readFile() throws IOException { ... }\`.

---

#### 3. Creating Clean Custom Exceptions:
\`\`\`java
public class InsufficientFundsException extends Exception {
    private final double deficit;
    
    public InsufficientFundsException(String message, double deficit) {
        super(message);
        this.deficit = deficit;
    }
    
    public double getDeficit() {
        return deficit;
    }
}
\`\`\`

#### 4. Modern \`try-with-resources\` (Auto-closing streams):
\`\`\`java
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    return br.readLine();
} // br is automatically closed even if an IOException is thrown!
\`\`\``,
      sources: ['Java Language Specification & Robust Exception Architecture']
    };
  }

  if (lower.includes('serialization') || lower.includes('deserialization') || lower.includes('transient') || lower.includes('file handling in java') || lower.includes('byte stream')) {
    return {
      text: `### 💾 Java File Handling, Streams & Object Serialization

Managing persistent storage and transmitting objects across networks in Java:

---

#### 1. Byte Streams vs. Character Streams:
* **Byte Streams (\`InputStream\` / \`OutputStream\`):** Read and write raw 8-bit bytes. Used for binary data: images, audio, compiled bytecode, and PDFs (e.g., \`FileInputStream\`, \`FileOutputStream\`).
* **Character Streams (\`Reader\` / \`Writer\`):** Read and write 16-bit Unicode characters. Automatically handle character encodings (UTF-8) for text files (e.g., \`FileReader\`, \`FileWriter\`, \`BufferedReader\`).

---

#### 2. Object Serialization & Deserialization:
* **Serialization:** The process of converting an in-memory Java object graph into a sequential byte stream to save to a file or transmit over a network (\`ObjectOutputStream.writeObject(obj)\`).
* **Deserialization:** Reconstructing the live Java object in heap memory from the byte stream (\`ObjectInputStream.readObject()\`).
* **The \`Serializable\` Marker Interface:** Must be implemented by any class whose objects need serialization. It has zero methods!

---

#### 3. The \`transient\` Keyword & \`serialVersionUID\`:
* **\`transient\`:** Applied to sensitive or ephemeral instance fields (e.g., passwords, DB connections). The JVM skips transient fields during serialization, initializing them to their default values (\`null\` or \`0\`) upon deserialization:
  \`\`\`java
  private String username;
  private transient String passwordHash; // Will NEVER be saved to disk!
  \`\`\`
* **\`serialVersionUID\`:** A unique version hash ensuring that the serialized byte stream matches the loaded class bytecode during deserialization. Prevents \`InvalidClassException\` if class fields change.`,
      sources: ['Java I/O, JVM Serialization Architecture']
    };
  }

  if (lower.includes('collections framework') || lower.includes('java collections') || (lower.includes('arraylist') && lower.includes('linkedlist')) || (lower.includes('hashmap') && lower.includes('treemap'))) {
    return {
      text: `### 📚 Java Collections Framework: Complete Architecture & Time Complexities

The **Java Collections Framework** (\`java.util\`) provides unified, highly optimized data structures:

---

#### 1. Primary Collection Interfaces:
* **\`List<E>\` (Ordered, allows duplicates, index-based access):**
  * **\`ArrayList\`:** Dynamic resizable array. Fast random access $O(1)$; expensive shift operations on middle insertion/deletion $O(N)$.
  * **\`LinkedList\`:** Doubly-linked list. Fast insertion/deletion at ends $O(1)$; slow random access by index $O(N)$.
* **\`Set<E>\` (Unordered collection of unique elements, NO duplicates):**
  * **\`HashSet\`:** Backed by \`HashMap\`. $O(1)$ average add, remove, and lookup.
  * **\`TreeSet\`:** Backed by Red-Black Tree. Guarantees natural sorted order; $O(\\log N)$ operations.
  * **\`LinkedHashSet\`:** \`HashSet\` maintaining insertion-order doubly-linked list.
* **\`Map<K, V>\` (Key-Value pairs, unique keys):**
  * **\`HashMap\`:** Array of buckets with separate chaining. When a bucket exceeds 8 elements, Java 8 converts it to a Red-Black Tree ($O(\\log N)$ worst-case instead of $O(N)$!).
  * **\`TreeMap\`:** Red-Black Tree. Keys sorted naturally or via \`Comparator\`. $O(\\log N)$ operations.
* **\`Queue<E>\` & \`Deque<E>\` (FIFO & Double-ended queues):**
  * **\`PriorityQueue\`:** Binary min-heap. Top element is always minimum. $O(\\log N)$ insert, $O(1)$ peek.
  * **\`ArrayDeque\`:** Resizable circular array buffer. Faster than \`Stack\` and \`LinkedList\` for LIFO/FIFO operations!`,
      sources: ['Java Collections Framework Specification']
    };
  }

  // 5C. WEB ARCHITECTURE: SEMANTIC HTML, ASYNC JS, HTTP/HTTPS & WEB PERFORMANCE
  if (lower.includes('semantic html') || lower.includes('semantic tags') || lower.includes('accessibility') || lower.includes('aria')) {
    return {
      text: `### 🌐 Semantic HTML5 & Modern Web Accessibility (a11y)

Semantic HTML uses tags that clearly describe their meaning and role to both the browser and developer:

---

#### 1. Core Semantic Structural Tags:
| Semantic Element | Architectural Purpose & Meaning |
|---|---|
| \`<header>\` | Introductory content, logos, site navigational headers |
| \`<nav>\` | Major section containing navigational links |
| \`<main>\` | The central, unique content of the document (only one per page!) |
| \`<article>\` | Self-contained, syndicatable composition (blog post, tweet, card) |
| \`<section>\` | Generic standalone thematic grouping with a heading |
| \`<aside>\` | Content tangentially related to the main content (sidebars, callouts) |
| \`<footer>\` | Concluding content, copyrights, legal links, author metadata |

---

#### 2. Why Semantic HTML Trumps Generic \`<div>\` Soup:
1. **Accessibility (Screen Readers):** Visually impaired users using screen readers (JAWS, NVDA) rely on landmark tags to navigate directly to main content.
2. **Search Engine Optimization (SEO):** Search crawler spiders (Googlebot) weigh content inside \`<article>\` and \`<h1>\` much heavier than inside generic \`<div>\` containers.
3. **Maintainability:** Code is instantly readable and self-documenting for engineering teams.

---

#### 3. Essential ARIA Attributes:
* **\`role="dialog"\` / \`role="alert"\`:** Informs assistive technology of dynamic modals or critical warnings.
* **\`aria-label="Close modal"\`:** Provides text descriptions for icon-only buttons.
* **\`aria-expanded="true/false"\`:** Communicates dropdown toggle states dynamically.`,
      sources: ['W3C HTML5 & WAI-ARIA Accessibility Standards']
    };
  }

  if (lower.includes('promise') || lower.includes('async await') || lower.includes('event loop')) {
    return {
      text: `### ⚡ Asynchronous JavaScript: Promises, Async/Await & The Event Loop

JavaScript is single-threaded; it handles non-blocking I/O through its **Event Loop** and concurrency queues:

---

#### 1. The 3 States of a Promise:
A **Promise** represents an eventual completion (or failure) of an asynchronous operation:
* **Pending:** Initial state; operation is ongoing.
* **Fulfilled (Resolved):** Operation completed successfully (\`.then()\`).
* **Rejected:** Operation failed (\`.catch()\`).

---

#### 2. Promises vs. Modern \`async\` / \`await\`:
\`\`\`javascript
// Approach A: Promise Chaining (.then / .catch)
fetch('/api/user')
  .then(res => res.json())
  .then(user => fetch(\`/api/orders/\${user.id}\`))
  .then(orders => console.log(orders))
  .catch(err => console.error(err));

// Approach B: Clean, Synchronous-Looking async/await
async function getUserOrders() {
  try {
    const userRes = await fetch('/api/user');
    const user = await userRes.json();
    const orderRes = await fetch(\`/api/orders/\${user.id}\`);
    const orders = await orderRes.json();
    console.log(orders);
  } catch (err) {
    console.error('Failed to fetch user orders:', err);
  }
}
\`\`\`

---

#### 3. Concurrency Combinators:
* **\`Promise.all([p1, p2, p3])\`:** Runs in parallel; fails fast if **any single promise rejects**.
* **\`Promise.allSettled([p1, p2, p3])\`:** Waits for all to complete regardless of resolution or rejection.
* **\`Promise.race([p1, p2, p3])\`:** Resolves or rejects as soon as the **first promise finishes**.`,
      sources: ['ECMAScript Specification & JavaScript Concurrency Architecture']
    };
  }

  if (lower.includes('vectors in ai') || lower.includes('feature representations') || lower.includes('matrices as transformations') || lower.includes('chained transformations') || lower.includes('matrix multiplication as chained') || lower.includes('tensors and shapes') || lower.includes('vector projection') || (lower.includes('vector') && (lower.includes('pixel') || lower.includes('embedding') || lower.includes('dot product') || lower.includes('sensor')))) {
    return {
      text: `### 📐 Mathematics for AI: Vectors, Matrices & Tensor Transformations

In Modern Artificial Intelligence, all real-world data and neural operations are represented as vector spaces and matrix transformations:

---

#### 1. Vectors as Multi-Dimensional Feature Representations:
* **Image Pixels:** Flattened 1D array of pixel intensities ($28 \\times 28 = 784$-dim vector for MNIST) or 3D tensor ($H \\times W \\times C$ for RGB).
* **Word & Text Embeddings:** Dense semantic vectors (e.g. OpenAI Ada-002: 1536 dimensions; Word2Vec: 300 dimensions) where semantic proximity equals geometric proximity.
* **Sensor & Time-Series Data:** Vectors representing continuous telemetry readings across time steps.

---

#### 2. Vector Operations & Geometric Interpretations:
* **Dot Product (Similarity Metric):**
  $$\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos \\theta$$
  - If $\\mathbf{u} \\cdot \\mathbf{v} > 0$: Vectors point in a similar direction (acute angle).
  - If $\\mathbf{u} \\cdot \\mathbf{v} = 0$: Orthogonal (independent / perpendicular features).
  - If $\\mathbf{u} \\cdot \\mathbf{v} < 0$: Inverted or conflicting features.
* **Vector Projection (Noise Removal & Feature Extraction):**
  $$\\text{proj}_{\\mathbf{u}}(\\mathbf{v}) = \\left(\\frac{\\mathbf{v} \\cdot \\mathbf{u}}{\\|\\mathbf{u}\\|^2}\\right) \\mathbf{u}$$
  - Decomposes vector $\\mathbf{v}$ into a component along feature axis $\\mathbf{u}$ and an orthogonal error component $\\mathbf{e} = \\mathbf{v} - \\text{proj}_{\\mathbf{u}}(\\mathbf{v})$.

---

#### 3. Matrices as Geometric Transformations:
A matrix $A \\in \\mathbb{R}^{m \\times n}$ maps input vectors from $\\mathbb{R}^n$ to transformed vectors in $\\mathbb{R}^m$:
* **Rotation Matrix:** Rotates space without altering vector lengths:
  $$R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}$$
* **Scaling & Compression:** Diagonal matrix stretching or squashing coordinate axes.
* **Chained Transformations in Neural Networks:**
  Matrix multiplication chains successive spatial transformations. A forward pass in a multi-layer perceptron (MLP) is a sequence of linear warps followed by non-linear activations:
  $$\\mathbf{y} = \\sigma(W_2 \\cdot \\sigma(W_1 \\mathbf{x} + \\mathbf{b}_1) + \\mathbf{b}_2)$$

---

#### 4. Tensors & Shapes in Deep Learning Frameworks:
| Modality | PyTorch / TensorFlow Tensor Shape | Description |
|---|---|---|
| **Computer Vision (CNN)** | \`[B, C, H, W]\` | Batch size, Color channels (3), Height, Width |
| **NLP & Transformers** | \`[B, T, D]\` | Batch size, Sequence token length, Embedding dimension |
| **Video Models** | \`[B, C, F, H, W]\` | Batch, Channels, Frame count, Height, Width |`,
      sources: ['Mathematics for Machine Learning (Deisenroth/Faisal)', 'Deep Learning Foundations & Linear Algebra']
    };
  }

  if (lower.includes('matrix rank') || lower.includes('linear independence') || (lower.includes('basis') && lower.includes('subspace')) || lower.includes('gram-schmidt') || lower.includes('gram schmidt') || lower.includes('orthonormal') || lower.includes('cosine similarity') || (lower.includes('l1') && lower.includes('l2')) || (lower.includes('svd') && lower.includes('pca')) || (lower.includes('eigenvalue') && (lower.includes('variance') || lower.includes('pca') || lower.includes('spectral')))) {
    return {
      text: `### 🌲 Linear Independence, Gram-Schmidt, Distance Metrics & SVD / PCA

The core mathematical apparatus for dimensionality reduction, vector search, and feature compression:

---

#### 1. Matrix Rank, Basis & Subspaces:
* **Linear Independence:** Vectors $\\{v_1, \\dots, v_k\\}$ are linearly independent if $c_1 v_1 + \\dots + c_k v_k = 0 \\implies c_1 = \\dots = c_k = 0$.
* **Basis & Subspace:** A minimal linearly independent set that spans the entire subspace.
* **Matrix Rank:** The number of linearly independent rows or columns in a matrix. In Deep Learning, low-rank matrices (LoRA — Low-Rank Adaptation) allow fine-tuning 70B parameter models by decomposing weight updates into $\\Delta W = A \\times B$ where $\\text{rank } r \\ll d$.

---

#### 2. Gram-Schmidt Orthonormalization (Intuitive):
Constructs a set of mutually perpendicular unit vectors $\\{u_1, u_2, \\dots, u_k\\}$ from arbitrary linearly independent vectors:
1. $u_1 = \\frac{v_1}{\\|v_1\\|}$.
2. For $v_2$: subtract its projection along $u_1$ to remove shared components:
   $$v'_2 = v_2 - (v_2 \\cdot u_1) u_1, \\quad u_2 = \\frac{v'_2}{\\|v'_2\\|}$$
3. Repeat iteratively: strip all prior components, leaving strictly orthogonal feature axes!

---

#### 3. Distance Metrics & Cosine Similarity in AI:
| Metric | Mathematical Formula | Geometric Meaning | Primary AI Application |
|---|---|---|---|
| **Euclidean ($L_2$)** | $\\sqrt{\\sum (u_i - v_i)^2}$ | Straight-line geometric distance | Clustering (K-Means), regression |
| **Manhattan ($L_1$)** | $\\sum |u_i - v_i|$ | Grid / City-block distance | Robust regression (Lasso sparsity) |
| **Cosine Similarity**| $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$ | Angle cosine $\\in [-1, 1]$ (magnitude invariant) | Vector DBs (Pinecone, Chroma), NLP embeddings, RecSys |

---

#### 4. Eigenvalues, Eigenvectors & SVD / PCA:
* **Eigen Equation:**
  $$A \\mathbf{v} = \\lambda \\mathbf{v}$$
  - The vector $v$ does not rotate under transformation $A$; it is simply scaled by eigenvalue $\\lambda$.
  - In PCA, the eigenvector with the largest eigenvalue points in the **direction of maximum data variance**!
* **Singular Value Decomposition (SVD):**
  $$A = U \\Sigma V^T$$
  - Decomposes any rectangular matrix into left singular vectors $U$ (data points in latent space), singular values $\\Sigma$ (feature importances), and right singular vectors $V^T$ (feature axes). Powers recommendation systems (Netflix Collaborative Filtering).`,
      sources: ['Linear Algebra and Its Applications (Strang)', 'AI Vector Spaces & Metric Embeddings']
    };
  }

  if (lower.includes('gradient vector') || lower.includes('jacobian') || lower.includes('hessian') || lower.includes('taylor expansion') || lower.includes('direction of fastest increase') || lower.includes('calculus drives learning') || (lower.includes('partial derivative') && lower.includes('gradient')) || lower.includes('loss surface curvature')) {
    return {
      text: `### 📈 Multivariate Calculus for AI: Gradients, Jacobian, Hessian & Curvature

Calculus is the mathematical engine of AI that computes how each parameter in a billion-parameter network must adjust to minimize loss:

---

#### 1. The Gradient Vector ($\\nabla f$): Direction of Fastest Increase:
For a scalar loss function $f(x_1, x_2, \\dots, x_n)$:
$$\\nabla f(\\mathbf{x}) = \\left[ \\frac{\\partial f}{\\partial x_1}, \\; \\frac{\\partial f}{\\partial x_2}, \\; \\dots, \\; \\frac{\\partial f}{\\partial x_n} \\right]^T$$
* **Geometric Meaning:** Points in the exact direction of **steepest ascent** (fastest rate of increase).
* **Why Learning Minimizes:** To minimize loss, parameters must step in the opposite direction: **$-\\nabla f$ (steepest descent)**!

---

#### 2. The Jacobian Matrix ($J$): First-Order Vector Sensitivity:
When a vector function maps inputs $\\mathbf{x} \\in \\mathbb{R}^n$ to multiple outputs $\\mathbf{f}(\\mathbf{x}) \\in \\mathbb{R}^m$:
$$J = \\begin{bmatrix}
\\frac{\\partial f_1}{\\partial x_1} & \\dots & \\frac{\\partial f_1}{\\partial x_n} \\\\
\\vdots & \\ddots & \\vdots \\\\
\\frac{\\partial f_m}{\\partial x_1} & \\dots & \\frac{\\partial f_m}{\\partial x_n}
\\end{bmatrix} \\in \\mathbb{R}^{m \\times n}$$
* **Role in AI:** Chains derivatives across layers during backpropagation (Matrix Chain Rule): $\\frac{\\partial L}{\\partial x} = J^T \\frac{\\partial L}{\\partial y}$.

---

#### 3. The Hessian Matrix ($H$): Loss Surface Curvature:
The matrix of all second-order partial derivatives:
$$H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$$
* **Curvature Analysis:**
  - **Positive Definite ($H > 0$):** All eigenvalues positive $\\implies$ Bowl-shaped convex minimum!
  - **Negative Definite ($H < 0$):** Inverted bowl $\\implies$ Local maximum.
  - **Indefinite (Mixed $\\pm$ Eigenvalues):** **Saddle Point** (valley in one direction, peak in another). Saddle points are pervasive in high-dimensional deep learning loss landscapes!

---

#### 4. Second-Order Taylor Expansion & Loss Approximations:
$$f(\\mathbf{x} + \\Delta \\mathbf{x}) \\approx f(\\mathbf{x}) + \\nabla f(\\mathbf{x})^T \\Delta \\mathbf{x} + \\frac{1}{2} \\Delta \\mathbf{x}^T H \\Delta \\mathbf{x}$$
* First-order term provides the gradient step direction.
* Second-order term captures curvature, preventing gradient descent from overshooting in narrow ravines.`,
      sources: ['Optimization Methods for Large-Scale Machine Learning', 'Multivariate Calculus & Loss Surface Topology']
    };
  }

  if (lower.includes('loss function') || lower.includes('cross-entropy') || lower.includes('cross entropy') || lower.includes('mean squared error') || lower.includes('mse vs') || lower.includes('adam optimizer') || lower.includes('momentum optimizer') || lower.includes('nesterov') || lower.includes('batch vs mini-batch') || lower.includes('gradient descent') || lower.includes('learning rate selection') || lower.includes('local minima and saddle')) {
    return {
      text: `### 🎯 AI Optimization: Loss Functions & Gradient Descent (SGD, Momentum, Adam)

How machine learning models measure errors and update billions of weights systematically:

---

#### 1. Core Loss Functions:
* **Mean Squared Error (MSE) — Regression:**
  $$L_{\\text{MSE}} = \\frac{1}{2N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$
  - Penalizes large errors quadratically; smooth, differentiable parabolic loss curve.
* **Cross-Entropy Loss — Classification:**
  $$L_{\\text{CE}} = -\\sum_{k=1}^C y_k \\log(\\hat{y}_k)$$
  - For binary classification ($y \\in \\{0, 1\\}$): $L = -[y \\log \\hat{y} + (1 - y) \\log(1 - \\hat{y})]$.
  - Measures the information-theoretic distance between true labels and predicted softmax probabilities. If model predicts $0.01$ for a true label, loss explodes toward $+\\infty$!

---

#### 2. Gradient Descent: Geometric Intuition:
Imagine a ball rolling down a foggy mountainous terrain:
$$\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta \\nabla L(\\mathbf{w}_t)$$
* **Learning Rate ($\\eta$):** Step size of the ball:
  - Too small: Extremely sluggish training, traps in local saddle plateaus.
  - Too large: Overshoots the valley and diverges to $\\infty$ (Exploding gradients).

---

#### 3. Gradient Descent Variants:
* **Batch GD:** Computes loss over the entire dataset before making a single update (Exact gradient, but slow and memory-prohibitive for large datasets).
* **Stochastic GD (SGD):** Computes gradient per single random sample (Extremely fast, but noisy, erratic trajectory).
* **Mini-Batch GD:** Standard in modern PyTorch/TensorFlow: batches of $32, 64, 128$ samples balancing GPU matrix parallelism with gradient stability.

---

#### 4. Modern Adaptive Optimizers:
* **Momentum:** Simulates physical momentum: accelerates downhill and dampens lateral oscillations:
  $$v_t = \\beta v_{t-1} + \\eta \\nabla L_t, \\quad w_{t+1} = w_t - v_t$$
* **Adam (Adaptive Moment Estimation):** The gold standard optimizer in deep learning:
  - Tracks running average of gradients (1st moment $m_t$ — direction).
  - Tracks running average of squared gradients (2nd moment $v_t$ — parameter scale).
  - Normalizes updates: parameters with huge gradients take cautious steps; sparse parameters with tiny gradients take bolder steps!`,
      sources: ['Deep Learning (Goodfellow/Bengio/Courville)', 'Adam: A Method for Stochastic Optimization']
    };
  }

  if (lower.includes('attention mechanism') || lower.includes('q k v') || lower.includes('q, k, v') || lower.includes('dot product attention') || (lower.includes('convolution') && (lower.includes('sliding window') || lower.includes('dot product') || lower.includes('mathematical'))) || lower.includes('king - man') || lower.includes('king-man') || lower.includes('analogy math') || (lower.includes('latent space') && (lower.includes('generative') || lower.includes('math')))) {
    return {
      text: `### 🧠 Deep Learning Math: Transformers Attention (Q, K, V), Convolutions & Latent Space

The mathematical mechanisms underlying LLMs, Generative AI, and Computer Vision:

---

#### 1. The Attention Mechanism Math (Transformers):
In Transformers (GPT, Gemini, Claude), words are transformed into three vector representations:
* **Query ($Q = X W_Q$):** What this token is searching for.
* **Key ($K = X W_K$):** What this token contains (address tag).
* **Value ($V = X W_V$):** The actual semantic information payload.

##### The Scaled Dot-Product Attention Equation:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$
1. **$Q K^T$ (Compatibility Matrix):** Dot products compute pairwise relevance between all tokens.
2. **Dividing by $\\sqrt{d_k}$:** Prevents dot products from exploding in high dimensions ($d_k = 64$), keeping softmax out of vanishing-gradient saturation regions.
3. **Softmax:** Normalizes affinities into attention weights summing to 1.
4. **Multiplying by $V$:** Produces context-aware token representations!

---

#### 2. 2D Convolution as Sliding Window Dot Products:
Mathematically, a CNN layer is an element-wise inner product between kernel filter $K$ and localized image patch:
$$S(i, j) = \\sum_m \\sum_n I(i + m, j + n) K(m, n)$$
* Achieves **translation equivariance** (detects edges, textures, or faces anywhere in the image) and massive weight reduction.

---

#### 3. Vector Spaces & Analogy Math in NLP:
Semantic relationships translate into vector arithmetic:
$$\\vec{v}_{\\text{king}} - \\vec{v}_{\\text{man}} + \\vec{v}_{\\text{woman}} \\approx \\vec{v}_{\\text{queen}}$$
* Subtracting $\\vec{v}_{\\text{man}}$ removes the masculine gender concept vector; adding $\\vec{v}_{\\text{woman}}$ injects feminine gender while preserving royalty features!

---

#### 4. Latent Space Geometry in Generative Models:
* Generative models (VAEs, Diffusion, GANs) map unstructured data (images, audio) into smooth, continuous low-dimensional latent manifolds ($z \\sim \\mathcal{N}(0, I)$).
* Because the space is continuous, linear interpolation $z_t = (1-t) z_A + t z_B$ creates seamless morphing from one generated object to another.`,
      sources: ['Attention Is All You Need (Vaswani et al.)', 'Deep Generative Modeling & Latent Space Topology']
    };
  }

  if (lower.includes('forward pass') || lower.includes('linear layer') || lower.includes('compute gradients') || lower.includes('gradients manually') || lower.includes('backpropagation math') || lower.includes('optimizing a small function')) {
    return {
      text: `### 🧠 End-to-End AI Computations: Forward Pass, Manual Gradients & Backpropagation

Step-by-step mathematical mechanics connecting linear algebra, multivariate calculus, and gradient descent:

---

#### 1. Forward Pass of a Linear Layer:
Given an input vector $\\mathbf{x} \\in \\mathbb{R}^d$, weight matrix $W \\in \\mathbb{R}^{k \\times d}$, bias vector $\\mathbf{b} \\in \\mathbb{R}^k$, and activation function $\\sigma(z)$:
1. **Affine Transformation (Linear Combination):**
   $$\\mathbf{z} = W \\mathbf{x} + \\mathbf{b} \\quad \\implies \\quad z_i = \\sum_{j=1}^d W_{ij} x_j + b_i$$
2. **Non-Linear Activation:**
   $$\\mathbf{a} = \\sigma(\\mathbf{z}) \\quad (\\text{e.g. ReLU } \\max(0, z) \\text{ or Sigmoid } \\frac{1}{1 + e^{-z}})$$

---

#### 2. Manual Gradient Computation (Backpropagation via Chain Rule):
For a scalar loss $L = \\frac{1}{2} (y - a)^2$ with a single neuron output ($a = \\sigma(z)$):
1. **Loss wrt Activation:** $\\frac{\\partial L}{\\partial a} = -(y - a) = (a - y)$.
2. **Activation wrt Pre-Activation $z$:** $\\frac{\\partial a}{\\partial z} = \\sigma'(z)$.
3. **Local Error Delta ($\\delta$):**
   $$\\delta = \\frac{\\partial L}{\\partial z} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} = (a - y) \\sigma'(z)$$
4. **Weight Gradients:** Because $z_i = \\sum_j W_{ij} x_j + b_i$, $\\frac{\\partial z}{\\partial W} = \\mathbf{x}^T$:
   $$\\frac{\\partial L}{\\partial W} = \\delta \\cdot \\mathbf{x}^T \\in \\mathbb{R}^{k \\times d}$$
5. **Bias Gradients:** Because $\\frac{\\partial z}{\\partial b} = 1$:
   $$\\frac{\\partial L}{\\partial \\mathbf{b}} = \\delta$$

---

#### 3. Parameter Update via Gradient Descent:
With learning rate $\\eta$:
$$W \\leftarrow W - \\eta \\frac{\\partial L}{\\partial W}$$
$$\\mathbf{b} \\leftarrow \\mathbf{b} - \\eta \\frac{\\partial L}{\\partial \\mathbf{b}}$$

---

#### 4. PCA-Like Dimensionality Reduction & Vector Similarity:
* **Projection onto Principal Component:** $\\mathbf{x}_{\\text{proj}} = (\\mathbf{x}^T \\mathbf{v}_1) \\mathbf{v}_1$, preserving maximal variance with minimal reconstruction error.
* **Document / Image Similarity:** Cosine similarity of normalized feature embeddings:
  $$\\text{Sim}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$$`,
      sources: ['Deep Learning (Goodfellow/Bengio)', 'Mathematics for Machine Learning: Computations & Backpropagation']
    };
  }

  if (lower.includes('http vs https') || lower.includes('client server') || lower.includes('browser rendering') || lower.includes('critical rendering path')) {
    return {
      text: `### 🌐 Internet Architecture: HTTP/HTTPS, Client-Server & Browser Rendering Pipeline

Understanding how web traffic flows from a server to a rendered pixel on screen:

---

#### 1. HTTP vs. HTTPS:
* **HTTP (Hypertext Transfer Protocol):** Port **80**. Transmits plain text data across the network; vulnerable to eavesdropping and Man-In-The-Middle (MITM) tampering.
* **HTTPS (HTTP Secure):** Port **443**. Encapsulates HTTP inside an encrypted **TLS (Transport Layer Security)** session:
  * **Encryption:** Symmetric key encryption ensures privacy.
  * **Integrity:** Digital signatures and MAC codes prevent data alteration.
  * **Authentication:** X.509 SSL Certificates verify the authentic identity of the remote server.

---

#### 2. The Browser Critical Rendering Path (CRP):
How the browser engine turns HTML/CSS into pixels:
1. **DOM Construction:** Parser converts raw HTML bytes $\\rightarrow$ tokens $\\rightarrow$ nodes $\\rightarrow$ **DOM Tree**.
2. **CSSOM Construction:** Parser converts CSS rules into the **CSS Object Model**.
3. **Render Tree:** Combines visible DOM nodes with calculated CSSOM styles (ignoring \`display: none\` elements).
4. **Layout (Reflow):** Calculates the exact geometric coordinates and pixel dimensions for every element.
5. **Paint:** Fills in text, colors, images, borders, and shadows into bitmap layers.
6. **Composite:** GPU draws multiple layers onto the screen in correct stacking order (\`z-index\`).`,
      sources: ['Web Architecture, Network Protocols & Browser Engine Specs']
    };
  }

  if (lower.includes('optimize page load') || lower.includes('web performance') || lower.includes('core web vitals') || lower.includes('seo') || lower.includes('meta tag')) {
    return {
      text: `### 🚀 Web Performance Optimization & Modern Technical SEO

High-performance web architecture directly impacts user conversion and search engine discoverability:

---

#### 1. Core Web Vitals (Google UX Metrics):
* **LCP (Largest Contentful Paint):** Measures loading speed. Time taken to render the largest visible image or text block. **Target: $\\le 2.5\\text{s}$**.
* **INP (Interaction to Next Paint):** Measures responsiveness. Latency between user action (click/tap) and visual UI update. **Target: $\\le 200\\text{ms}$**.
* **CLS (Cumulative Layout Shift):** Measures visual stability. Unexpected jumping of content while images/fonts load. **Target: $\\le 0.1$**.

---

#### 2. Concrete Performance Engineering Tactics:
1. **Resource Bundling & Code Splitting:** Use dynamic \`import('./module.js')\` to load heavy modules only when navigated to.
2. **Asset Compression:** Serve modern image formats (**WebP / AVIF**) instead of heavy PNGs; enable Gzip or Brotli compression on reverse proxy (Nginx).
3. **Browser Caching:** Configure immutable cache headers for hashed bundles:
   \`Cache-Control: public, max-age=31536000, immutable\`.
4. **Non-Blocking Scripts:** Use \`<script defer>\` or \`<script async>\` so JavaScript downloading does not block initial HTML parsing.

---

#### 3. Essential Technical SEO Meta Tags:
\`\`\`html
<title>AlgoFlow Studio — Interactive CS & DSA Visualizer</title>
<meta name="description" content="Master Computer Science, DSA, and System Architecture with live interactive visualizers and AI mentorship.">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph Social Media Card Tags -->
<meta property="og:title" content="AlgoFlow Studio">
<meta property="og:description" content="All-in-one Computer Science & DSA Visualizer">
<meta property="og:type" content="website">
\`\`\``,
      sources: ['Web Performance Engineering & Google Web Vitals']
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. DIGITAL LOGIC DESIGN & COMPUTER ARCHITECTURE
  // ─────────────────────────────────────────────────────────────────────────────
  if (lower.includes('sop and pos') || lower.includes('sop vs pos') || lower.includes('k-map') || lower.includes('karnaugh map') || lower.includes('full adder') || lower.includes('half adder') || (lower.includes('adder') && lower.includes('subtractor')) || lower.includes('multiplexer') || lower.includes('demultiplexer') || lower.includes('mux') || lower.includes('demux') || lower.includes('decoder') || lower.includes('encoder') || lower.includes('reversible gate') || lower.includes('feynman') || lower.includes('toffoli') || lower.includes('fredkin') || lower.includes('landauer')) {
    return {
      text: `### ⚡ Digital Logic Design: Boolean SOP/POS, K-Maps, Adders, MUX & Reversible Gates

The physical building blocks of modern CPUs and digital processing circuits:

---

#### 1. Boolean SOP vs. POS Forms:
* **Sum of Products (SOP):** Boolean OR of ANDed minterms (active high logic):
  $$F(A, B, C) = \\sum m(1, 3, 5, 7) = \\bar{A}\\bar{B}C + \\bar{A}BC + A\\bar{B}C + ABC$$
* **Product of Sums (POS):** Boolean AND of ORed maxterms (active low logic):
  $$F(A, B, C) = \\prod M(0, 2, 4, 6) = (A+B+C)(A+\\bar{B}+C)(\\bar{A}+B+C)(\\bar{A}+\\bar{B}+C)$$

---

#### 2. Karnaugh Maps (K-Maps):
Geometric tabular minimization using **Gray Code adjacency** (adjacent cells differ by only 1 bit):
* Group adjacent $1$s (SOP) into powers of 2 ($2, 4, 8, 16$).
* Eliminates variables: grouping a quad ($4$ cells) eliminates 2 literal terms!

---

#### 3. Arithmetic Circuits: Adders & Subtractors:
* **Half Adder:** Adds 2 bits: $\\text{Sum} = A \\oplus B, \\; \\text{Carry} = A \\cdot B$.
* **Full Adder:** Adds 3 bits ($A, B, C_{\\text{in}}$):
  $$\\text{Sum} = A \\oplus B \\oplus C_{\\text{in}}, \\quad C_{\\text{out}} = AB + C_{\\text{in}}(A \\oplus B)$$
* **Carry Lookahead Adder:** Computes generate ($G_i = A_i B_i$) and propagate ($P_i = A_i \\oplus B_i$) terms simultaneously to eliminate ripple propagation delays ($O(1)$ addition latency).

---

#### 4. Multiplexers (MUX) & Demultiplexers (DEMUX):
* **Multiplexer (Data Selector):** $2^n$ inputs, $n$ select lines, 1 output.
  - $4:1$ MUX Boolean Equation: $Y = \\bar{S}_1 \\bar{S}_0 I_0 + \\bar{S}_1 S_0 I_1 + S_1 \\bar{S}_0 I_2 + S_1 S_0 I_3$.
* **De-Multiplexer (Data Distributor):** 1 input routed to one of $2^n$ outputs based on select lines.
* **Encoders vs Decoders:** A $3:8$ decoder activates one of 8 outputs for a 3-bit binary input; priority encoders resolve simultaneous active inputs.

---

#### 5. Reversible Logic Gates (Zero Thermal Dissipation):
According to **Landauer's Principle**, erasing 1 bit of information dissipates $k_B T \\ln 2$ joules of heat. Reversible computing has identical input and output counts with unique bijective mapping (zero information loss!):
* **Feynman Gate (CNOT):** $P = A, \\; Q = A \\oplus B$.
* **Toffoli Gate (CCNOT):** Universal reversible 3-bit gate: $P = A, \\; Q = B, \\; R = C \\oplus (A \\cdot B)$.
* **Fredkin Gate (CSWAP):** If $A=0$, outputs pass unchanged; if $A=1$, swaps $B$ and $C$.`,
      sources: ['Digital Design (Morris Mano)', 'Reversible Computing & Quantum Logic Gates']
    };
  }

  if ((lower.includes('prom') && lower.includes('pal')) || lower.includes('prom pal pla') || (lower.includes('fpga') && (lower.includes('cpld') || lower.includes('clb') || lower.includes('lut'))) || lower.includes('programmable logic device') || lower.includes('macrocell')) {
    return {
      text: `### 🔌 Programmable Logic Devices: PROM, PAL, PLA, CPLD & FPGA

Configurable digital silicon chips that bridge fixed hardware logic with reprogrammable flexibility:

---

#### 1. PLD Comparison Matrix (PROM vs. PAL vs. PLA):

| Device | AND Array | OR Array | Flexibility & Applications |
|---|---|---|---|
| **PROM** | **Fixed** | **Programmable** | Look-up tables, firmware memory |
| **PAL (Programmable Array Logic)** | **Programmable** | **Fixed** | Faster, simpler timing; glue logic |
| **PLA (Programmable Logic Array)** | **Programmable** | **Programmable** | Maximum flexibility, complex state machines |

---

#### 2. CPLD vs. FPGA Architecture:

| Feature | CPLD (Complex Programmable Logic Device) | FPGA (Field Programmable Gate Array) |
|---|---|---|
| **Architecture** | Coarse-grained **Macrocells** + Global Interconnect | Fine-grained **CLBs (Configurable Logic Blocks)** |
| **Storage Element** | **Non-Volatile** Flash/EEPROM (instant ON) | **SRAM-based** (volatile; requires bootloader flash) |
| **Capacity** | Low to Medium ($\sim 10^3$ gates) | Massive (millions to billions of gates) |
| **Timing Predictability** | **Deterministic** pin-to-pin delays | Routing dependent (requires timing closure) |
| **Ideal For** | Bootloaders, bus bridging, reset controllers | Neural network acceleration, GPU emulation, DSP |

---

#### 3. FPGA Internal Anatomy (CLB & LUT):
* **Look-Up Table (LUT):** A small SRAM holding truth table outputs (e.g. 6-input LUT models any 6-variable Boolean function).
* **Flip-Flop / Latch:** Built into each slice for sequential pipeline registers.
* **Programmable Interconnect:** Switch boxes routing signals between CLBs, DSP slices, and Block RAM (BRAM).`,
      sources: ['CMOS VLSI Design & Field-Programmable Gate Array Architecture']
    };
  }

  if (lower.includes('latches and flip-flops') || lower.includes('latch') || lower.includes('flip-flop') || lower.includes('flip flop') || lower.includes('race around condition') || lower.includes('master slave jk') || lower.includes('shift register') || lower.includes('ring counter') || lower.includes('johnson counter') || (lower.includes('ring') && lower.includes('counter'))) {
    return {
      text: `### ⏱️ Sequential Circuits: Latches, Flip-Flops, Shift Registers & Counters

Circuits with memory where current output depends on both current inputs and past states:

---

#### 1. Latches vs. Flip-Flops:
* **Latch (Level-Triggered):** Sensitive to clock levels (High or Low). Transparent while clock is high (any input wobble directly perturbs output).
* **Flip-Flop (Edge-Triggered):** Sensitive only to instantaneous clock transitions (Rising $\\uparrow$ or Falling $\\downarrow$ edge). Eliminates transparency glitches.

---

#### 2. The JK Race-Around Condition & Master-Slave Solution:
* **The Problem:** In a level-triggered JK flip-flop, when $J = 1$ and $K = 1$, output toggles. If clock pulse width $t_p > t_{\\text{propagation}}$, the output will toggle uncontrollably back and forth multiple times during a single clock pulse, ending in an unpredictable state!
* **The Solution:**
  1. **Master-Slave JK Flip-Flop:** Two flip-flops in series. The Master responds during clock High; the Slave latches output during clock Low.
  2. **Edge-Triggered Flip-Flops:** Propagation window restricted to $< 0.1$ ns clock transition edges.

---

#### 3. Shift Registers:
Transmit and convert digital words across 4 topologies:
* **SISO (Serial-In Serial-Out):** Used for signal delays.
* **SIPO (Serial-In Parallel-Out):** Serial bus receivers (UART, SPI).
* **PISO (Parallel-In Serial-Out):** Serial bus transmitters.
* **PIPO (Parallel-In Parallel-Out):** High-speed CPU internal bus registers.

---

#### 4. Timing & Control Units: Ring vs. Johnson Counter:
* **Ring Counter ($N$-Bit):** Circulates a single \`1\` in a circular shift register. Has **$N$ unique timing states**. Used as a direct 1-hot sequence controller without requiring output decoders.
* **Johnson (Twisted-Ring) Counter ($N$-Bit):** Inverted output $\\bar{Q}$ of the last stage is fed back into input $D_0$. Has **$2N$ unique states**! Cuts required flip-flops in half for sequence generation.`,
      sources: ['Digital Logic & Computer Design (M. Morris Mano)']
    };
  }

  if (lower.includes('sram vs dram') || (lower.includes('sram') && lower.includes('dram')) || lower.includes('ram architecture') || lower.includes('memory decoding') || lower.includes('ras and cas') || lower.includes('sense amplifier')) {
    return {
      text: `### 💾 RAM Architecture: SRAM vs. DRAM & 2D Memory Decoding

Random Access Memory (RAM) provides byte-addressable read/write storage for computer execution:

---

#### 1. SRAM vs. DRAM Comprehensive Comparison:

| Parameter | SRAM (Static RAM) | DRAM (Dynamic RAM) |
|---|---|---|
| **Storage Element** | **6 Transistors (6T)** bistable cross-coupled inverters | **1 Transistor + 1 Capacitor (1T-1C)** |
| **Speed** | ⚡ **Blazing Fast ($\sim 0.5 - 2$ ns)** | Moderate ($\sim 10 - 50$ ns) |
| **Refresh Requirement** | ❌ **No Refresh** (retains data as long as powered) | ⚠️ **Requires Refresh** every 64 ms (charge leaks) |
| **Density & Cost** | Low density, High cost per bit | **Very High density, Low cost** |
| **Primary Placement** | **CPU Caches (L1, L2, L3)** | **Main System Memory (DDR4 / DDR5)** |

---

#### 2. 2D Memory Decoding (RAS & CAS):
To access a single bit inside a 1-Gigabit RAM chip, a linear decoder would require $2^{30}$ select lines (physically impossible!).
* **2D Matrix Grid Organization:**
  - Memory cells are arranged in an $N \\times M$ matrix grid of rows and columns.
  - **Row Address Strobe (RAS):** Activates an entire WordLine row into a bank of sense amplifiers.
  - **Column Address Strobe (CAS):** Multiplexes out the specific BitLine column requested.
  - This reduces decoding pins from $2^k$ to $2 \\times 2^{k/2}$!`,
      sources: ['Computer Architecture: A Quantitative Approach (Hennessy & Patterson)']
    };
  }

  if (lower.includes('addressing mode') || lower.includes('instruction format') || lower.includes('risc vs cisc') || lower.includes('cisc vs risc') || lower.includes('cisc and risc') || lower.includes('machine cycle') || lower.includes('hardwired vs microprogrammed') || lower.includes('hardwired realization')) {
    return {
      text: `### 💻 Instruction Set Architecture (ISA): Addressing Modes, Formats & RISC vs CISC

The ISA serves as the fundamental contract between software compilers and underlying CPU silicon:

---

#### 1. Common Addressing Modes:
| Addressing Mode | Syntax Example | Effective Address (EA) Calculation | Use Case |
|---|---|---|---|
| **Immediate** | \`ADD R1, #5\` | Operand is the constant value itself | Initializing loop counters |
| **Direct (Absolute)** | \`LOAD R1, [1000]\` | $\\text{EA} = 1000$ | Global static variables |
| **Indirect** | \`LOAD R1, [[R2]]\` | $\\text{EA} = \\text{Mem}[R2]$ | Pointers and references |
| **Register** | \`ADD R1, R2\` | Operand is inside CPU register | High-speed arithmetic |
| **Register Indirect** | \`LOAD R1, [R2]\` | $\\text{EA} = R2$ | Dynamic heap objects |
| **Indexed / Base-Offset** | \`LOAD R1, [R2 + 16]\` | $\\text{EA} = R2 + 16$ | Array indexing (\`arr[i]\`), struct field access |
| **PC-Relative** | \`BEQ +8\` | $\\text{EA} = \\text{PC} + \\text{offset}$ | Branching and relocatable code |

---

#### 2. Instruction Formats:
* **3-Address:** \`ADD R1, R2, R3\` ($R_1 \\leftarrow R_2 + R_3$). Standard in RISC (ARM, RISC-V).
* **2-Address:** \`ADD R1, R2\` ($R_1 \\leftarrow R_1 + R_2$). Standard in x86 CISC.
* **1-Address:** \`ADD M\` ($AC \\leftarrow AC + \\text{Mem}[M]$). Accumulator architectures.
* **0-Address:** \`ADD\` (Pops two operands from top of stack, adds, and pushes result). Java Virtual Machine bytecode.

---

#### 3. RISC vs. CISC Architecture:
* **RISC (Reduced Instruction Set Computer — ARM, RISC-V, Apple Silicon):**
  - Fixed 32-bit instruction length, single-cycle execution, load-store architecture (only \`LOAD\`/\`STORE\` touch RAM), large register file ($32+$ general registers).
* **CISC (Complex Instruction Set Computer — Intel x86, AMD64):**
  - Variable-length instructions ($1 - 15$ bytes), rich multi-cycle operations (e.g. string copying in 1 opcode), hardware microcode decoder translates complex instructions into RISC-like micro-ops ($\\mu$-ops).

---

#### 4. Hardwired vs. Microprogrammed Control Realization:
* **Hardwired Control:** Fixed combinational logic gates, decoders, and PLA state machines generate control signals. Extremely fast, but inflexible.
* **Microprogrammed Control:** Instructions execute a sequence of micro-instructions stored in an internal Control ROM. Flexible and easy to update, but slower.`,
      sources: ['Computer Systems Architecture (M. Morris Mano)', 'RISC-V Reader: An Open Architecture Atlas']
    };
  }

  if (lower.includes('pipeline hazard') || lower.includes('instruction pipelining') || lower.includes('structural hazard') || lower.includes('data hazard') || lower.includes('branch hazard') || lower.includes('operand forwarding') || lower.includes('principle of locality') || lower.includes('temporal and spatial locality')) {
    return {
      text: `### ⚡ Instruction Pipelining, Pipeline Hazards & Locality of Reference

Pipelining overlaps instruction execution across clock cycles to maximize CPU throughput:

---

#### 1. The Classic 5-Stage RISC Pipeline:
1. **IF (Instruction Fetch):** Read instruction from instruction cache; increment PC.
2. **ID (Instruction Decode):** Decode opcode; read registers from Register File.
3. **EX (Execute):** ALU computes arithmetic, effective addresses, or branch targets.
4. **MEM (Memory Access):** Read or write data from/to Data Cache (\`LOAD\`/\`STORE\`).
5. **WB (Write Back):** Write computed result back into destination register in Register File.

---

#### 2. The 3 Pipeline Hazards & Countermeasures:

##### A. Structural Hazards (Resource Conflict):
* **The Problem:** Two instructions attempt to use the same physical hardware unit in the same clock cycle (e.g. IF stage fetching instruction while MEM stage loads data).
* **The Countermeasure:** **Harvard Architecture** (splitting cache into separate L1 Instruction Cache and L1 Data Cache).

##### B. Data Hazards (Data Dependency):
* **RAW (Read-After-Write / True Dependency):** Instruction 2 needs register result from Instruction 1 before Instruction 1 has written it back:
  \`\`\`text
  ADD R1, R2, R3   <- Writes R1 in WB stage (cycle 5)
  SUB R4, R1, R5   <- Reads R1 in ID stage (cycle 3) -> Stale data!
  \`\`\`
* **The Countermeasures:**
  1. **Operand Forwarding / Bypassing:** Route ALU output from cycle 3 directly back into ALU input for cycle 4 via multiplexers (zero stall cycles!).
  2. **Pipeline Stalls (Bubbles):** If loading from RAM (\`LOAD\` delay), insert a 1-cycle bubble stall.

##### C. Control Hazards (Branch Penalty):
* **The Problem:** Conditional branches (\`BEQ\`) change the PC only in the EX stage, but the pipeline already fetched the next 2 instructions speculatively!
* **The Countermeasure:** Dynamic **Branch Prediction** (Branch Target Buffer, 2-bit saturating counters, neural branch predictors) and Delayed Branch slots.

---

#### 3. Principle of Locality:
* **Temporal Locality:** If a memory address is accessed once, it is highly likely to be accessed again in the near future (e.g. loop variables, function call stack).
* **Spatial Locality:** If a memory address is accessed, its adjacent contiguous memory addresses will be accessed soon (e.g. iterating through sequential arrays, instruction sequence).`,
      sources: ['Computer Architecture: A Quantitative Approach (Hennessy & Patterson)']
    };
  }

  if (lower.includes('cache memory') || lower.includes('cache mapping') || lower.includes('direct mapped') || lower.includes('set associative') || lower.includes('write through') || lower.includes('write back') || lower.includes('write-through') || lower.includes('write-back') || lower.includes('page table') || lower.includes('tlb') || lower.includes('translation lookaside buffer') || lower.includes('virtual memory')) {
    return {
      text: `### 🚀 Cache Memory Mapping, Store Policies & Virtual Memory (TLB)

Bridging the massive speed gap between multi-gigahertz CPUs and nanosecond DRAM:

---

#### 1. Cache Address Decomposition & Mapping Schemes:
A physical memory address is divided into three fields:
$$\\mathbf{[\\text{ Tag } \\mid \\text{ Set Index } \\mid \\text{ Block Offset }]}$$

| Mapping Scheme | Mechanism & Tag Matching | Pros & Cons |
|---|---|---|
| **Direct Mapped** | Each block maps to exactly **one cache line**: $\\text{Line} = \\text{Block} \\bmod N$ | Simple, fast; prone to severe **conflict misses** |
| **Fully Associative** | Block can be placed in **any line**; no Index field | Zero conflict misses; requires expensive parallel comparators |
| **$N$-Way Set Associative** | Cache is partitioned into sets of $N$ lines. Maps to one set, then search within that set | **Industry standard** (balances speed, hit rate, and hardware cost) |

---

#### 2. Cache Write / Store Policies:
* **Write-Through:** Every write is written to both the Cache AND Main Memory simultaneously.
  - *Pro:* Memory is always up-to-date and consistent.
  - *Con:* High memory bus bandwidth consumption.
* **Write-Back:** Data is written **only to the Cache**. A **Dirty Bit** is set to 1. The data is written to main memory only when that cache line is evicted!
  - *Pro:* Blazing fast bursts of repeated writes.
  - *Con:* Stale data in main memory until eviction.

---

#### 3. Virtual Memory & Translation Lookaside Buffer (TLB):
* **Virtual Memory:** Gives each process a private 64-bit address space, abstracting physical RAM.
* **Page Table:** OS data structure mapping Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).
* **TLB (Hardware Cache for Addresses):**
  - Checking the Page Table in RAM on every instruction would cut CPU speed in half!
  - The **TLB** is an ultra-fast hardware associative CAM cache located directly on the CPU chip caching recent VPN $\\to$ PFN translations.
  - **TLB Hit:** Translation resolved in $< 1$ cycle!
  - **TLB Miss:** CPU hardware walks the Page Table in RAM, loads translation into TLB, and resumes execution.`,
      sources: ['Modern Processor Architecture & Cache Hierarchy Design']
    };
  }

  if (lower.includes('programmed io') || lower.includes('interrupt driven io') || lower.includes('dma') || lower.includes('direct memory access') || lower.includes('io fundamentals') || lower.includes('handshaking') || lower.includes('buffering')) {
    return {
      text: `### 🔌 I/O Organization: Programmed I/O, Interrupt-Driven I/O & DMA

How peripheral hardware (Disks, NICs, Keyboards, GPUs) communicates with CPU and Memory:

---

#### 1. Programmed I/O (Busy-Waiting / Polling):
* **Mechanism:** CPU sits in a tight loop repeatedly reading a device's status register until the device is ready (\`while (!deviceReady) {}\`).
* **Fatal Flaw:** CPU utilization approaches 100% doing zero productive work; wastes billions of clock cycles.

---

#### 2. Interrupt-Driven I/O:
* **Mechanism:** CPU initiates an I/O request and immediately switches to executing other user processes. When the peripheral finishes its transfer, it raises a hardware **Interrupt Request (IRQ)** line.
* **CPU Action:**
  1. Suspends current task, saves registers to stack.
  2. Jumps to the **Interrupt Service Routine (ISR)** using the Interrupt Vector Table.
  3. Services the device and resumes previous execution.
* **Benefit:** Eliminates CPU idle waiting.

---

#### 3. Direct Memory Access (DMA):
* **The Bottleneck:** Transferring a 4 GB file from an NVMe SSD into RAM using interrupt-driven I/O would trigger 1 billion CPU interrupts (1 per 4-byte word), freezing the system!
* **The DMA Solution:**
  - The CPU delegates the bulk transfer to a dedicated **DMA Controller (DMAC)** by providing:
    1. Source Address (Device port)
    2. Destination Address (RAM starting buffer)
    3. Transfer Word Count
  - The DMAC takes bus mastership and streams megabytes/gigabytes directly between the device and RAM over the high-speed system bus.
  - When the entire multi-megabyte block finishes, the DMAC fires **a single interrupt** to notify the CPU!`,
      sources: ['Computer Organization and Embedded Systems (Hamacher)']
    };
  }

  if (lower.includes('superscalar') || lower.includes('vliw') || lower.includes('simd') || lower.includes('vector processor') || lower.includes('clock gating') || lower.includes('dvfs') || lower.includes('low power techniques') || lower.includes('verilog') || lower.includes('vhdl')) {
    return {
      text: `### ⚡ Advanced Processor Architecture: Superscalar, SIMD, Low-Power & Verilog HDL

Modern high-performance silicon engineering pushing compute parallelism and energy efficiency:

---

#### 1. Instruction-Level Parallelism: Superscalar vs. VLIW:
* **Superscalar (x86, ARM Cortex, Apple M-Series):**
  - Hardware dynamic scheduler analyzes instructions at runtime in hardware execution windows.
  - Issues $> 1$ instruction per clock cycle out-of-order to multiple parallel execution pipelines (ALUs, FPUs).
* **VLIW (Very Long Instruction Word):**
  - Eliminates dynamic hardware scheduling logic to save power.
  - The **compiler** statically bundles multiple independent operations into a single giant multi-operation word.

---

#### 2. SIMD & Vector Processors (AI & Graphics Acceleration):
* **SIMD (Single Instruction, Multiple Data):**
  - Executes a single instruction simultaneously across vector registers containing multiple data elements:
    $$\\mathbf{C}[0..7] = \\mathbf{A}[0..7] + \\mathbf{B}[0..7] \\quad (8 \\text{ additions in } 1 \\text{ clock cycle!})$$
  - Forms the foundation of AVX-512, ARM Neon, and GPU CUDA Tensor Cores for matrix multiplication.

---

#### 3. Low-Power Silicon Techniques:
* **Dynamic Switching Power Equation:**
  $$P_{\\text{dynamic}} = \\alpha \\cdot C \\cdot V^2 \\cdot f$$
* **Clock Gating:** Hardware AND gates shut off the clock signal to idle execution units, eliminating dynamic switching capacitance ($\\alpha = 0$).
* **DVFS (Dynamic Voltage and Frequency Scaling):**
  - Because power scales quadratically with voltage ($V^2$), cutting voltage and frequency in half drops power consumption by nearly **$80\\%$**!

---

#### 4. Verilog HDL Syntax Cheat Sheet:
\`\`\`verilog
// 1. Combinational 4:1 Multiplexer
module mux4to1(input [3:0] in, input [1:0] sel, output reg out);
  always @(*) begin
    case(sel)
      2'b00: out = in[0];
      2'b01: out = in[1];
      2'b10: out = in[2];
      2'b11: out = in[3];
    endcase
  end
endmodule

// 2. Sequential Clocked D Flip-Flop
module d_flip_flop(input clk, rst, d, output reg q);
  always @(posedge clk or posedge rst) begin
    if (rst) q <= 1'b0;      // Non-blocking assignment for sequential logic
    else     q <= d;
  end
endmodule
\`\`\``,
      sources: ['Computer Architecture: SIMD & Low Power VLSI', 'Verilog HDL Hardware Synthesis']
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. PROFESSIONAL ENGINEERING COMMUNICATION & TEAM SKILLS
  // ─────────────────────────────────────────────────────────────────────────────
  if (lower.includes('resume') || lower.includes('ats') || lower.includes('xyz formula') || lower.includes('google xyz') || lower.includes('star method') || lower.includes('interview skills') || lower.includes('group discussion') || lower.includes('gd common errors') || lower.includes('goal setting') || lower.includes('stress and time management') || lower.includes('career opportunities') || lower.includes('global competence')) {
    return {
      text: `### 🎯 Technical Career Mastery: Resumes, The STAR Method & Group Discussions

Professional engineering communication and interview frameworks for top-tier software engineering roles:

---

#### 1. High-Impact Engineering Résumé Architecture:
* **ATS (Applicant Tracking System) Optimization:** Clean single-column layout, standard fonts, no nested table graphics or icons that confuse parsers.
* **The Google XYZ Bullet Formula:**
  $$\\mathbf{\\text{“Accomplished [X] as measured by [Y], by doing [Z].”}}$$
  * *Bad:* "Created a web app for sorting algorithms."
  * *Good:* "Engineered an interactive multi-language DSA visualization suite handling 8 languages, reducing student debugging time by 40% as measured by benchmark user testing."

---

#### 2. The STAR Interview Method (Behavioral & Architecture Questions):
When interviewers ask *"Tell me about a time you resolved a major bug under deadline"*:
* **S — Situation:** Set the context: system scale, tech stack, and business criticality.
* **T — Task:** The specific technical obstacle or deliverable you were responsible for.
* **A — Action:** Concrete technical steps you executed (profiling CPU, checking memory leaks, refactoring queries).
* **R — Result:** Quantified impact and engineering lessons learned (e.g. latency reduced by 35%, 99.99% uptime).

---

#### 3. Group Discussion (GD) Dynamics & Common Errors:
* **Key Roles to Assume:**
  - **The Initiator:** Opens with a crisp definition, objective framework, and structured sub-themes.
  - **The Moderator:** Gently redirects the conversation back on track if team members become hostile or tangential.
  - **The Synthesizer / Summarizer:** Bridges opposing arguments and unifies key takeaways.
* **Common GD Fatal Errors:**
  - ❌ Monopolizing conversation or speaking in continuous run-on monologues.
  - ❌ Aggressive tone, personal attacks, or cutting teammates off mid-sentence.
  - ❌ Making emotional claims without empirical data or technical examples.`,
      sources: ['Engineering Career Acceleration & Professional Placement Standards']
    };
  }

  if (lower.includes('team skills') || lower.includes('conflict resolution') || lower.includes('thomas-kilmann') || lower.includes('thomas kilmann') || lower.includes('building trust in teams') || lower.includes('presentation skills') || lower.includes('technical presentation') || lower.includes('10/20/30 rule') || lower.includes('brainstorming techniques') || lower.includes('listening as a team') || lower.includes('internal communication in teams') || lower.includes('cognitive and non-cognitive')) {
    return {
      text: `### 🤝 Team Skills, Presentation Mastery & Conflict Resolution (Thomas-Kilmann)

Engineering complex software requires high-functioning collaborative team dynamics:

---

#### 1. Cognitive vs. Non-Cognitive Skills in Engineering Teams:
* **Cognitive Skills:** System design, algorithmic problem solving, code modularity, and debugging depth.
* **Non-Cognitive Skills:** Active empathy, emotional intelligence (EQ), constructive feedback reception, and maintaining **Psychological Safety** (where teammates feel safe taking risks and admitting bugs).

---

#### 2. Technical Presentation Skills:
* **The 10/20/30 Rule:** Maximum 10 slides, 20 minutes presentation time, minimum 30pt readable font.
* **Visuals over Verbatim Text:** Replace dense text bullets with high-contrast architecture block diagrams and live benchmark plots.
* **Adversarial Q&A Handling:** Never get defensive; validate tough questions: *"That's a fantastic observation regarding edge-case cache invalidation. Here is how our fallback handles it..."*

---

#### 3. Conflict Resolution: The Thomas-Kilmann Instrument (TKI):
Maps 5 conflict-handling modes across Assertiveness vs. Cooperativeness:
1. **Collaborating (High Assertive, High Cooperative):** Seeking win-win technical solutions (e.g., finding an architecture that satisfies both low latency and strict data durability).
2. **Compromising (Moderate):** Finding middle-ground trade-offs under tight project deadlines.
3. **Accommodating (Low Assertive, High Cooperative):** Conceding on low-impact preferences (e.g. linter formatting choices) to maintain team harmony.
4. **Avoiding (Low Assertive, Low Cooperative):** Stepping back when emotions run high to allow objective cooldown.
5. **Competing (High Assertive, Low Cooperative):** Standing firm on non-negotiable security or safety constraints.`,
      sources: ['Organizational Psychology & Engineering Leadership (Harvard Business Review)']
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. ALGORITHM ANALYSIS & ADVANCED DATA STRUCTURES
  // ─────────────────────────────────────────────────────────────────────────────
  if (lower.includes('asymptotic notation') || lower.includes('big o') || lower.includes('big omega') || lower.includes('big theta') || lower.includes('master theorem') || lower.includes('running time calculations') || lower.includes('algorithm analysis')) {
    return {
      text: `### ⏱️ Algorithm Analysis: Asymptotic Notations ($O, \\Omega, \\Theta$) & The Master Theorem

Formal mathematical evaluation of algorithm performance and recurrence relations:

---

#### 1. The Big 3 Asymptotic Complexity Notations:

##### A. Big-O ($O(g(n))$) — Asymptotic Upper Bound:
$$f(n) \\le c \\cdot g(n) \\quad \\forall n \\ge n_0, \\; c > 0$$
* Represents the **worst-case ceiling**. The algorithm will *never* run slower than this rate for large inputs.

##### B. Big-Omega ($\\Omega(g(n))$) — Asymptotic Lower Bound:
$$f(n) \\ge c \\cdot g(n) \\quad \\forall n \\ge n_0, \\; c > 0$$
* Represents the **best-case floor**. The algorithm will take *at least* this much time.

##### C. Big-Theta ($\\Theta(g(n))$) — Asymptotically Tight Bound:
$$c_1 \\cdot g(n) \\le f(n) \\le c_2 \\cdot g(n) \\quad \\forall n \\ge n_0$$
* An algorithm is $\\Theta(g(n))$ if and only if it is simultaneously $O(g(n))$ AND $\\Omega(g(n))$. Represents the exact order of growth.

---

#### 2. The Master Theorem for Divide-and-Conquer Recurrences:
Applies to recurrences of the form:
$$T(n) = a T\\left(\\frac{n}{b}\\right) + f(n) \\quad (a \\ge 1, \\; b > 1)$$

Compare $f(n)$ with the critical exponent boundary $n^{\\log_b a}$:
* **Case 1 ($f(n) = O(n^{\\log_b a - \\epsilon})$):**
  Leaves dominate $\\implies T(n) = \\mathbf{\\Theta(n^{\\log_b a})}$.
  - *Example:* Strassen Matrix Multiplication: $T(n) = 7T(n/2) + O(n^2) \\implies \\log_2 7 \\approx 2.81 > 2 \\implies \\Theta(n^{2.81})$.
* **Case 2 ($f(n) = \\Theta(n^{\\log_b a} \\log^k n)$):**
  Work balanced across tree $\\implies T(n) = \\mathbf{\\Theta(n^{\\log_b a} \\log^{k+1} n)}$.
  - *Example:* Merge Sort: $T(n) = 2T(n/2) + O(n) \\implies \\log_2 2 = 1 \\implies \\Theta(n \\log n)$.
* **Case 3 ($f(n) = \\Omega(n^{\\log_b a + \\epsilon})$ and regularity holds):**
  Root work dominates $\\implies T(n) = \\mathbf{\\Theta(f(n))}$.`,
      sources: ['Introduction to Algorithms (CLRS)', 'Algorithm Analysis & Complexity Theory']
    };
  }

  if (lower.includes('linear search vs binary search') || (lower.includes('linear search') && lower.includes('binary search')) || lower.includes('bubble sort') || lower.includes('selection sort') || lower.includes('insertion sort') || lower.includes('merge sort') || lower.includes('quick sort') || lower.includes('sorting algorithm')) {
    return {
      text: `### 🔍 Searching & Sorting Algorithms: Complexity, Invariants & Trade-Offs

Comprehensive algorithmic analysis of fundamental searching and sorting paradigms:

---

#### 1. Searching Algorithms: Linear vs. Binary Search:

| Algorithm | Precondition | Best Case | Average Case | Worst Case | Space Complexity |
|---|---|---|---|---|---|
| **Linear Search** | Any list (Unsorted/Sorted) | $O(1)$ | $O(N/2) = O(N)$ | $O(N)$ | $O(1)$ |
| **Binary Search** | **Strictly Sorted Array** | $O(1)$ | $O(\\log N)$ | $O(\\log N)$ | $O(1)$ Iterative / $O(\\log N)$ Recursive |

* **Recurrence Relation of Binary Search:**
  $$T(N) = T(N/2) + O(1) \\implies \\text{By Master Theorem: } T(N) = \\mathbf{\\Theta(\\log N)}$$

---

#### 2. Comparison-Based Sorting Algorithms Matrix:

| Algorithm | Best Time | Average Time | Worst Time | Auxiliary Space | Stable? | Key Mechanism |
|---|---|---|---|---|---|---|
| **Bubble Sort** | $O(N)$ (optimized) | $O(N^2)$ | $O(N^2)$ | $O(1)$ | ✅ Yes | Repeatedly swaps adjacent out-of-order elements |
| **Selection Sort**| $O(N^2)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | ❌ No | Finds minimum in unsorted suffix and swaps to front |
| **Insertion Sort**| $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ | ✅ Yes | Inserts current element into sorted prefix (Fast for nearly sorted!) |
| **Merge Sort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N \\log N)$ | $O(N)$ | ✅ Yes | Divide-and-conquer: divide in half, recursively sort, merge sorted halves |
| **Quick Sort** | $O(N \\log N)$ | $O(N \\log N)$ | $O(N^2)$ (bad pivot) | $O(\\log N)$ | ❌ No | Partition array around pivot (Lomuto / Hoare); recursive in-place sort |

---

#### 3. Why Merge Sort is $O(N \\log N)$ Guaranteed:
$$T(N) = 2T(N/2) + O(N)$$
* The recursion tree has depth $\\log_2 N$.
* At each level $k$, merging takes $N$ total operations.
* Total Time: $\\sum_{k=1}^{\\log_2 N} N = \\mathbf{N \\log_2 N}$.

---

#### 4. The $\\Omega(N \\log N)$ Comparison Sort Lower Bound:
Any comparison-based sort can be modeled as a **Decision Tree** with $N!$ leaf outcomes (all permutations of $N$ elements).
Because a binary tree of height $h$ has at most $2^h$ leaves:
$$2^h \\ge N! \\implies h \\ge \\log_2(N!) \\approx N \\log_2 N - N \\log_2 e = \\mathbf{\\Omega(N \\log N)!}$$
No comparison sort can ever beat $O(N \\log N)$ in the worst case!`,
      sources: ['Introduction to Algorithms (CLRS)', 'The Art of Computer Programming (Knuth Vol 3)']
    };
  }

  if (lower.includes('polynomial adt') || lower.includes('polynomial addition') || lower.includes('applications of lists') || lower.includes('singly linked list') || lower.includes('doubly linked list') || lower.includes('circularly linked list') || lower.includes('circular linked list') || lower.includes('list adt')) {
    return {
      text: `### 📜 List ADTs & Polynomial Arithmetic via Linked Lists

Abstract Data Types (ADTs) separate interface specifications from physical memory implementations:

---

#### 1. Polynomial ADT (Linked List Implementation):
Sparse polynomials (e.g. $P(x) = 5x^{1000} + 3x^2 + 7$) would waste vast memory in arrays. A linked list stores only non-zero terms:
\`\`\`text
[ Coeff: 5 | Exp: 1000 | Next ] ➔ [ Coeff: 3 | Exp: 2 | Next ] ➔ [ Coeff: 7 | Exp: 0 | NULL ]
\`\`\`

##### Polynomial Addition Algorithm:
1. Maintain two pointers $p_1$ and $p_2$ at the heads of polynomials $A$ and $B$.
2. Compare exponents:
   - If $p_1.exp == p_2.exp$: Add coefficients, create new term if sum $\\neq 0$, advance both pointers.
   - If $p_1.exp > p_2.exp$: Append $p_1$ term to result, advance $p_1$.
   - If $p_2.exp > p_1.exp$: Append $p_2$ term to result, advance $p_2$.
3. **Time Complexity:** strictly linear **$O(M + N)$**!

---

#### 2. Specialized Linked List Applications:
* **Circular Linked List:** Last node points back to Head node.
  - *Use Case:* CPU Round-Robin process scheduling rings; media player track looping.
* **Doubly Linked List:** Pointers to both \`next\` and \`prev\`.
  - *Use Case:* Browser forward/back navigation history; LRU Cache eviction lists.`,
      sources: ['Data Structures and Algorithm Analysis in C++ (Mark Allen Weiss)']
    };
  }

  if (lower.includes('infix to postfix') || lower.includes('evaluating arithmetic expressions') || lower.includes('evaluate arithmetic') || lower.includes('shunting yard') || lower.includes('circular queue') || lower.includes('dequeue') || lower.includes('balancing symbols') || (lower.includes('stack') && lower.includes('expression'))) {
    return {
      text: `### 🥞 Expression Parsing: Shunting-Yard (Infix to Postfix) & Circular Queues

Stack-based arithmetic compilers and circular ring buffers:

---

#### 1. Infix to Postfix: Dijkstra's Shunting-Yard Algorithm:
Translates human-readable infix math ($A + B \\times C$) into postfix reverse Polish notation ($A \\; B \\; C \\; \\times \\; +$):
* **Rules:**
  1. If token is an **operand (number/variable)**: output immediately.
  2. If token is \`'('\`: push to operator stack.
  3. If token is \`')'\`: pop operators to output until matching \`'('\` is popped.
  4. If token is an **operator ($+, -, \\times, /$)**: while top of stack has higher or equal precedence, pop to output; then push current operator.
  5. At end of input, pop all remaining operators to output.
* **Evaluating Postfix Expression:** Read tokens left-to-right: push numbers to stack; on operator, pop 2 numbers, apply math, and push result. Total time: **$O(N)$ single pass**!

---

#### 2. Circular Queue ADT (Modulo Ring Buffer):
* **The Problem with Linear Array Queues:** Dequeuing leaves empty slots at front that cannot be reused without expensive $O(N)$ shifting.
* **The Circular Solution:** Wrap indices around using modulo arithmetic:
  $$\\text{rear} = (\\text{rear} + 1) \\bmod \\text{capacity}$$
  $$\\text{front} = (\\text{front} + 1) \\bmod \\text{capacity}$$
* **Queue Full Condition:** $(\\text{rear} + 1) \\bmod \\text{capacity} == \\text{front}$.
* **Queue Empty Condition:** $\\text{front} == \\text{rear}$.`,
      sources: ['Compilers: Principles, Techniques, and Tools', 'Data Structures Specification']
    };
  }

  if (lower.includes('priority queue') || lower.includes('priority queues') || lower.includes('binary heap') || lower.includes('heapify') || lower.includes('buildheap') || lower.includes('build heap')) {
    return {
      text: `### ⛰️ Binary Heaps, Priority Queues & Linear $O(N)$ BuildHeap

A **Binary Heap** is a complete binary tree stored compactly in an array:

---

#### 1. Array Indexing Formulas:
For any node at index $i$:
* **Parent:** $\\lfloor (i - 1) / 2 \\rfloor$
* **Left Child:** $2i + 1$
* **Right Child:** $2i + 2$
* Zero pointer overhead; 100% cache contiguous memory!

---

#### 2. Min-Heap vs Max-Heap Property:
* **Min-Heap:** For every node $i$, $\\text{val}(i) \\le \\text{val}(\\text{children})$. Smallest element is always at root (\`arr[0]\`).
* **Max-Heap:** For every node $i$, $\\text{val}(i) \\ge \\text{val}(\\text{children})$. Largest element is always at root (\`arr[0]\`).

---

#### 3. Core Operations:
* **Insert ($O(\\log N)$ — Heapify-Up):** Append new element at end of array; sift up by swapping with parent until heap invariant holds.
* **Extract-Min ($O(\\log N)$ — Heapify-Down):** Replace root with last element in array; sift down by swapping with smaller child.

---

#### 4. Why \`buildHeap\` Takes $O(N)$ Linear Time:
Starting from the first non-leaf node $\\lfloor N/2 \\rfloor - 1$ down to root and sifting down:
$$\\sum_{h=0}^{\\lfloor \\log N \\rfloor} \\frac{N}{2^{h+1}} \\times O(h) = \\frac{N}{2} \\sum_{h=0}^\\infty \\frac{h}{2^h} = \\frac{N}{2} \\times 2 = \\mathbf{O(N)!}$$
* Most nodes are near the bottom leaves where height $h$ is tiny (0 or 1), making bottom-up construction strictly linear!`,
      sources: ['Data Structures & Binary Heap Performance Analysis']
    };
  }

  if (lower.includes('extendible hashing') || lower.includes('dynamic hashing') || lower.includes('global depth') || lower.includes('local depth') || lower.includes('directory hashing') || lower.includes('separate chaining') || lower.includes('open addressing') || lower.includes('rehashing')) {
    return {
      text: `### 🗄️ Extendible Hashing: Dynamic External Database Hashing

**Extendible Hashing** is an external dynamic hashing technique designed for large database files on secondary disk storage:

---

#### 1. Why Standard Hashing Fails for Databases:
* Standard hash tables require static array allocations. When overflowing, doubling the table requires rehashing every single record on disk ($O(N)$ expensive disk I/O!).
* Extendible hashing grows and shrinks dynamically **one disk bucket at a time** without reorganizing the entire file.

---

#### 2. Architecture: Directory & Buckets:
* **Global Depth ($D$):** The number of leading bits of the hash used to index into the in-memory **Directory**. The directory has $2^D$ pointer entries.
* **Buckets (Disk Blocks):** Fixed-capacity disk blocks storing records. Each bucket has a **Local Depth ($d$)** indicating how many bits its stored keys share in common ($d \\le D$).

---

#### 3. Bucket Splitting Mechanism on Overflow:
When a record is inserted into a full bucket:
1. **Case A (Local Depth $d < D$):**
   * The directory size stays the same!
   * The overflowing bucket is split into two buckets, and their local depth increments: $d \\leftarrow d + 1$.
   * Directory pointers are adjusted to point to the new bucket.
2. **Case B (Local Depth $d == D$):**
   * **The Directory Doubles!** Global depth increments: $D \\leftarrow D + 1$.
   * The number of directory pointers doubles from $2^D$ to $2^{D+1}$.
   * The overflowing bucket splits, and its local depth becomes $d + 1$.
* **Key Advantage:** Fast $O(1)$ lookups requiring at most 2 disk accesses (1 for directory, 1 for data block), with minimal rehashing!`,
      sources: ['Database System Implementation (Garcia-Molina/Ullman/Widom)', 'Extendible Hashing Architecture']
    };
  }

  return null;
}

