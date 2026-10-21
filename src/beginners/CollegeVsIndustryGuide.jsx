import React, { useState } from 'react';

// --- COMPARISON DATA ACROSS CORE ENGINEERING DIMENSIONS ---
const COMPARISON_DIMENSIONS = [
  {
    id: 'codebase_scale',
    category: 'architecture',
    title: 'Codebase Scale & Starting Point',
    icon: '📁',
    college: {
      headline: 'Starting from a blank file (`main.c` / `app.py`)',
      description: 'In college labs and semester projects, you almost always begin with an empty folder. You create `server.js` or `index.html` from scratch and write 200 to 1,500 lines of code.',
      workflow: 'Blank Screen ➔ Code ➔ Run Once ➔ Done',
      painPoint: 'Never teaches how to navigate or understand existing massive systems.',
      verdictBadge: 'Small & Ephemeral (1-3 Files)'
    },
    industry: {
      headline: 'Inheriting 500,000+ lines of existing production code',
      description: 'In tech companies, you NEVER start with an empty file. You join an existing repository with millions of lines of code written by hundreds of engineers over 5-10 years. 70% of your time is spent reading, searching, and understanding existing code before writing a single line.',
      workflow: 'Read Code ➔ Trace Flow ➔ Write RFC / Design Doc ➔ Surgical 50-line Change ➔ 100+ Tests',
      painPoint: 'Requires deep understanding of architectural patterns, modularity, and backwards compatibility.',
      verdictBadge: 'Massive & Enduring (Millions of Lines)'
    }
  },
  {
    id: 'team_git',
    category: 'collaboration',
    title: 'Team Collaboration & Version Control',
    icon: '🤝',
    college: {
      headline: 'Single `main` branch or sharing ZIP files on WhatsApp',
      description: 'Projects are usually solo or in groups of 3-4 where 1 student writes the code and others make the PowerPoint. Version control is either ignored, or every commit is pushed directly to `main` with messages like "final project", "final project 2", "actually final".',
      workflow: 'Edit ➔ Save ➔ Send project.zip on WhatsApp',
      painPoint: 'Overwrites teammate work, zero traceability, zero peer review.',
      verdictBadge: 'Unregulated & Ad-Hoc'
    },
    industry: {
      headline: 'Strict Feature Branches, Pull Requests & Peer Code Reviews',
      description: 'No one is permitted to push directly to `main`. Every feature has a dedicated branch (`feature/JIRA-402-payment-webhook`). Merging requires passing automated CI tests and receiving approval (LGTM) from at least 1-2 senior engineers in a detailed Pull Request review.',
      workflow: 'Branch ➔ PR ➔ Automated CI Checks ➔ Senior Review ➔ Squash & Merge',
      painPoint: 'Every line is scrutinized for readability, security, performance, and maintainability.',
      verdictBadge: 'Strictly Guarded & Audited'
    }
  },
  {
    id: 'architecture_quality',
    category: 'architecture',
    title: 'Software Architecture & Code Organization',
    icon: '🏛️',
    college: {
      headline: 'Monolithic "Spaghetti" File with Hardcoded Secrets',
      description: 'Routes, database queries, business logic, and UI elements are dumped inside one single 1,200-line file. Database passwords (`root` / `admin123`) and API keys are hardcoded directly into the source code.',
      workflow: '`app.js` containing 50 routes + raw SQL + HTML strings',
      painPoint: 'Impossible to test in isolation; security disaster if repo is public.',
      verdictBadge: 'Monolithic Spaghetti'
    },
    industry: {
      headline: 'Layered Separation of Concerns & Secret Management',
      description: 'Strict architectural patterns (MVC, Clean Architecture, Hexagonal). Controllers handle HTTP; Services execute business logic; Repositories query databases; Entities model data. All credentials use environment variables (`.env`, AWS Secrets Manager, HashiCorp Vault).',
      workflow: 'Controller ➔ Validation (Zod) ➔ Service ➔ Repository ➔ DB Pool',
      painPoint: 'Initial setup requires discipline, but enables teams to scale without collisions.',
      verdictBadge: 'Clean Layered Architecture'
    }
  },
  {
    id: 'testing_qa',
    category: 'testing',
    title: 'Testing & Quality Assurance',
    icon: '🧪',
    college: {
      headline: 'Manual "Happy Path" Testing only',
      description: '"I opened the browser, entered valid username and password, clicked login, and it worked, so my app has zero bugs!" Negative edge cases, malformed payloads, concurrent clicks, and network dropouts are never tested.',
      workflow: 'Click button once ➔ "It works!" ➔ Ready for viva',
      painPoint: 'Crashes immediately when an unexpected character or null value is entered.',
      verdictBadge: 'Zero Automated Tests'
    },
    industry: {
      headline: 'The Test Pyramid: Unit, Integration & End-to-End Tests',
      description: 'Automated test suites run on every commit. Unit tests verify individual functions; Integration tests verify database interactions; End-to-End tests (Cypress/Playwright) simulate full user journeys. Code coverage must exceed 80-90% to merge.',
      workflow: 'Vitest / Jest ➔ Integration Tests (Testcontainers) ➔ CI Pipeline Guard',
      painPoint: 'Writing tests often takes as much or more time than writing the feature itself.',
      verdictBadge: 'Automated Test Pyramid (>80% Coverage)'
    }
  },
  {
    id: 'database_scale',
    category: 'database',
    title: 'Database Design, Indexing & Scale',
    icon: '🗄️',
    college: {
      headline: 'Local SQLite/MySQL with 15 dummy rows',
      description: 'A single table on `localhost:3306` with 10-20 test rows (`Alice`, `Bob`, `Charlie`). Queries use un-indexed `SELECT * FROM users WHERE ...`. No connection pooling, no migrations, and no thought given to query speed.',
      workflow: 'phpMyAdmin / GUI ➔ Insert 5 rows ➔ Done',
      painPoint: 'Runs fine with 10 rows; crawls to a halt with 100,000 rows.',
      verdictBadge: 'Toy Dataset on Localhost'
    },
    industry: {
      headline: 'High-Concurrency Distributed DBs, Indexing & Migrations',
      description: 'Millions of rows across partitioned tables. Strict schema migration scripts (Prisma, Flyway, Liquibase) versioned in Git. Database indexing (B-Trees) optimized via `EXPLAIN ANALYZE`. Redis caching layers and read-replicas prevent database bottlenecks.',
      workflow: 'Schema Migration ➔ B-Tree Indexes ➔ PgBouncer Pool ➔ Redis Cache ➔ Read Replicas',
      painPoint: 'A single unindexed query can lock tables and cause a company-wide site outage.',
      verdictBadge: 'Distributed, Indexed & Cached'
    }
  },
  {
    id: 'devops_deployment',
    category: 'devops',
    title: 'Deployment, Hosting & Environments',
    icon: '🚀',
    college: {
      headline: '"Works on My Machine" (Localhost execution)',
      description: 'The project only runs inside the student\'s laptop when they open VS Code and run `npm start` or `python app.py`. If the external examiner asks to run it on their computer, dependencies fail, Node versions conflict, and the demo breaks.',
      workflow: 'VS Code terminal ➔ `localhost:3000` ➔ Show screen to professor',
      painPoint: 'Not a real product if no one on the internet can access or use it.',
      verdictBadge: 'Localhost Only'
    },
    industry: {
      headline: 'Containerized (Docker), CI/CD & Multi-Region Cloud',
      description: 'Packaged in standard Docker containers. Pushing to GitHub triggers automated GitHub Actions pipelines that build images, run tests, and deploy to Kubernetes or serverless clusters across multiple staging and production environments with zero downtime.',
      workflow: 'Git Push ➔ GitHub Actions CI ➔ Docker Build ➔ Staging Env ➔ Canary Prod Deploy',
      painPoint: 'Requires expertise in cloud infrastructure, networking, and environment parity.',
      verdictBadge: 'Zero-Downtime Multi-Region Cloud'
    }
  },
  {
    id: 'error_observability',
    category: 'monitoring',
    title: 'Error Handling, Logging & Observability',
    icon: '📊',
    college: {
      headline: '`console.log("here")` and empty `catch (e) {}` blocks',
      description: 'When an error occurs, the server prints a red stack trace in the terminal or swallows it silently with `catch (e) { /* do nothing */ }`. No logs are stored, and once the terminal is closed, all diagnostic history vanishes.',
      workflow: '`console.log("test 1")` ➔ Server crashes ➔ Restart server manually',
      painPoint: 'Impossible to diagnose what went wrong after the crash happens.',
      verdictBadge: 'Blind Debugging'
    },
    industry: {
      headline: 'Structured Logs, Distributed Tracing & On-Call Alerts',
      description: 'JSON structured logs sent to central aggregators (Datadog, ELK stack). Distributed tracing (OpenTelemetry) traces an API request through 10 microservices. Sentry captures front-end crashes. PagerDuty pages the on-call engineer at 3 AM if error rates exceed 0.1%.',
      workflow: 'Sentry Crash Alert ➔ Datadog Traces ➔ Grafana Dashboards ➔ Incident Post-Mortem',
      painPoint: 'Engineers are responsible for production health long after the code is written.',
      verdictBadge: '24/7 Observability & Telemetry'
    }
  },
  {
    id: 'lifespan_maintenance',
    category: 'collaboration',
    title: 'Project Lifespan & Purpose',
    icon: '⏳',
    college: {
      headline: 'Built in 2 weeks ➔ Evaluated in 5 minutes ➔ Abandoned forever',
      description: 'The sole purpose is passing an academic viva and getting a grade. Once the semester ends, the code is never touched, updated, or executed ever again. Technical debt doesn\'t matter because the project has zero real users.',
      workflow: 'Submit PPT ➔ 5-min Viva ➔ Forget project forever',
      painPoint: 'Teaches disposable coding habits that fail in long-term enterprise projects.',
      verdictBadge: 'Disposable (2-Week Life)'
    },
    industry: {
      headline: 'Maintained for 5 to 15+ Years by Changing Teams',
      description: 'The software powers real daily business for paying customers. The code you write today will be read, modified, and debugged by engineers who haven\'t even been hired yet. Clean naming, documentation, and maintainability are non-negotiable.',
      workflow: 'Spec ➔ Build ➔ Ship ➔ Monitor ➔ Refactor ➔ Maintain for 10 Years',
      painPoint: 'Bad code written 3 years ago costs millions of dollars in maintenance debt today.',
      verdictBadge: 'Living Enterprise Asset (Decade Life)'
    }
  }
];

// --- CODE INSPECTOR DATA: COLLEGE VS INDUSTRY SNIPPETS ---
const CODE_INSPECTIONS = [
  {
    id: 'db_connection',
    title: '1. Database Connection & Config',
    collegeCode: `// ❌ COLLEGE WAY: Hardcoded credentials in server.js
const mysql = require('mysql');

// Hardcoded root password directly in git repository!
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123', // SECURITY RISK!
  database: 'college_project'
});

connection.connect((err) => {
  if (err) {
    console.log("Database connection failed!"); // Vague error
  } else {
    console.log("Connected to MySQL!");
  }
});

// Single connection: Drops when 10 users click at once!
module.exports = connection;`,
    industryCode: `// ✅ PRODUCTION INDUSTRY WAY: Pool + Env Vars + Health Check
import { Pool } from 'pg';
import { z } from 'zod';

// Validate environment variables at boot with strict schema
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DB_POOL_MAX: z.coerce.number().default(20),
  DB_IDLE_TIMEOUT_MS: z.coerce.number().default(30000)
});
const env = envSchema.parse(process.env);

// Robust Connection Pool with automatic failover & timeout guards
export const dbPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: 5000
});

// Resilient Health Check with structured logging
export async function verifyDbConnection() {
  const client = await dbPool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('Database pool healthy and ready');
  } catch (err) {
    logger.error('Database connection failed critical healthcheck', { error: err });
    process.exit(1); // Fail fast in container orchestration (Kubernetes)
  } finally {
    client.release();
  }
}`,
    explanation: 'College code uses a single fragile connection with plaintext passwords pushed to GitHub. Real companies use connection pools that handle thousands of concurrent queries, with strictly validated environment variables and health checks for Kubernetes.'
  },
  {
    id: 'user_registration',
    title: '2. User Registration & Password Security',
    collegeCode: `// ❌ COLLEGE WAY: Plain text passwords & SQL injection hazard
app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password; // Unencrypted plain text!

  // SQL Injection vulnerability! Input concatenated directly into query
  const query = "INSERT INTO users (username, password) VALUES ('" + username + "', '" + password + "')";

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.send("Registered successfully!");
    }
  });
});`,
    industryCode: `// ✅ PRODUCTION INDUSTRY WAY: Schema Validation + Argon2/Bcrypt + Param Queries
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';

const RegisterSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  fullName: z.string().min(2).max(100)
});

export async function handleRegister(req, res, next) {
  try {
    // 1. Strict Request Validation
    const { email, password, fullName } = RegisterSchema.parse(req.body);

    // 2. Cryptographic Salted Hashing (Cost Factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Parameterized Query (100% immune to SQL Injection)
    const result = await dbPool.query(
      \`INSERT INTO users (email, password_hash, full_name, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, email, full_name, created_at\`,
      [email, passwordHash, fullName]
    );

    logger.info('User successfully registered', { userId: result.rows[0].id });
    return res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    next(error); // Delegated to centralized error handling middleware
  }
}`,
    explanation: 'College code stores plain text passwords and allows SQL injection via string concatenation. Real software enforces schema validation, cryptographic password hashing, parameterized queries, and delegates errors to standardized middleware.'
  },
  {
    id: 'error_handling',
    title: '3. Error Handling & API Responses',
    collegeCode: `// ❌ COLLEGE WAY: Empty catch blocks & crashing servers
app.get('/order/:id', async (req, res) => {
  try {
    const order = await getOrderFromDatabase(req.params.id);
    res.send(order);
  } catch (e) {
    // Empty catch! Swallows the error so no one knows what failed
    console.log("error happened");
    res.status(500).send("Something went wrong"); 
  }
});`,
    industryCode: `// ✅ PRODUCTION INDUSTRY WAY: Typed Errors + Correlation IDs + Structured Telemetry
import { logger } from '../observability/logger.js';
import { NotFoundError, ValidationError } from '../errors/domainErrors.js';

export async function getOrderHandler(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  const { id } = req.params;

  try {
    if (!id || !isValidUUID(id)) {
      throw new ValidationError('Invalid Order UUID format', { correlationId, id });
    }

    const order = await orderService.findOrderById(id);
    if (!order) {
      throw new NotFoundError(\`Order with ID \${id} not found\`, { correlationId });
    }

    return res.status(200).json({
      status: 'success',
      data: order,
      meta: { timestamp: new Date().toISOString(), correlationId }
    });
  } catch (err) {
    logger.error('Failed to retrieve order', {
      error: err.message,
      stack: err.stack,
      correlationId,
      orderId: id
    });
    next(err); // Centralized error middleware formats sanitized JSON for client
  }
}`,
    explanation: 'In college code, errors are logged with `console.log` and swallowed, leaving zero clues during crashes. In production, correlation IDs trace the user request across microservices, and structured errors are monitored in real time.'
  }
];

// --- A DAY IN THE LIFE: TIMELINE STEPPER ---
const LIFECYCLE_STEPS = [
  {
    phase: '1. Inception & Planning',
    collegeTitle: 'Semester Project Begins',
    collegeDesc: 'Professor announces project topic. Students pick a popular topic from YouTube ("Hospital Management System" or "Online Bookstore"). No written specs, no requirements, just a vague idea.',
    collegeTools: 'WhatsApp group chat, MS Word, YouTube',
    companyTitle: 'Product Requirements Doc (PRD) & RFC',
    companyDesc: 'Product Managers write a PRD detailing user needs, business impact, and KPIs. Senior Engineers draft an RFC (Request for Comments) outlining system architecture, database changes, and trade-offs before writing a single line of code.',
    companyTools: 'Jira, Confluence, Figma, Design Review Meetings'
  },
  {
    phase: '2. Task Allocation & Architecture',
    collegeTitle: 'Verbal Splitting (or 1 Hero Coder)',
    collegeDesc: '"You do frontend, I do backend, you do report PPT." Usually 1 student ends up doing all the coding at the last minute while others watch.',
    collegeTools: 'Google Drive, verbal agreements',
    companyTitle: 'Agile Sprint Planning & Story Points',
    companyDesc: 'The feature is broken down into small, estimable Jira tickets with clear acceptance criteria. Team discusses dependencies in Sprint Planning. Engineers assign story points and assign tickets.',
    companyTools: 'Agile / Scrum boards, Daily 15-min Standups'
  },
  {
    phase: '3. Development & Version Control',
    collegeTitle: 'Coding on `main` or Desktop',
    collegeDesc: 'Work is saved on a USB drive or pushed directly to `main` with commit message "update". Code merges result in conflicts that are solved by copy-pasting someone else\'s file.',
    collegeTools: 'VS Code, Desktop folder, ZIP files',
    companyTitle: 'Feature Branches, Pre-Commit Hooks & Linting',
    companyDesc: 'Engineers branch from `develop`. Husky pre-commit hooks run ESLint and Prettier automatically. Code follows strict style guides, unit tests are written alongside features (TDD).',
    companyTools: 'Git branching (`feature/*`), ESLint, TypeScript, Husky'
  },
  {
    phase: '4. Code Review & Verification',
    collegeTitle: 'Zero Code Review',
    collegeDesc: 'No one reads anyone else\'s code. If the page loads without an error popup, it\'s considered done. Bugs remain hidden.',
    collegeTools: 'Manual button clicking',
    companyTitle: 'Peer Pull Request (PR) Code Review',
    companyDesc: 'A Pull Request is submitted. Automated CI builds run tests and security vulnerability scans (Snyk/SonarQube). 1-2 peers review logic, performance bottlenecks, and edge cases before approval.',
    companyTools: 'GitHub PRs, SonarQube, CI checks'
  },
  {
    phase: '5. Deployment & Release',
    collegeTitle: 'Running on `localhost:3000`',
    collegeDesc: 'Project is run locally on the student\'s laptop during the final viva. If the laptop battery dies or Node version mismatch occurs, the demo fails.',
    collegeTools: 'Local laptop, browser tab',
    companyTitle: 'CI/CD Pipeline to Staging & Production',
    companyDesc: 'Code is containerized into Docker images. Automated pipelines deploy to a Staging environment for QA testing, then to Production using Canary or Blue-Green zero-downtime deployments.',
    companyTools: 'Docker, Kubernetes, AWS/GCP, GitHub Actions'
  },
  {
    phase: '6. Post-Launch & Maintenance',
    collegeTitle: 'Project is Abandoned',
    collegeDesc: 'Viva finishes, external examiner gives marks, and the project is never opened again. Technical debt has zero consequence.',
    collegeTools: 'None (Project archived or deleted)',
    companyTitle: '24/7 Monitoring, Metrics & On-Call Support',
    companyDesc: 'Engineers monitor Datadog dashboards and Prometheus metrics. Sentry alerts the team to customer errors. The engineer rotates on-call duty with PagerDuty to maintain 99.99% uptime SLA.',
    companyTools: 'Datadog, Grafana, Sentry, PagerDuty'
  }
];

// --- 7 STEPS TO LEVEL UP COLLEGE PROJECT TO PRODUCTION GRADE ---
const LEVEL_UP_STEPS = [
  {
    step: 1,
    title: 'Containerize Everything with Docker',
    icon: '🐳',
    why: 'Solves "It works on my machine!" forever. Anyone on any OS can run your project in 1 command: `docker compose up`.',
    collegeState: 'Local installation instructions that fail on different operating systems.',
    upgradeAction: 'Add a `Dockerfile` and `docker-compose.yml` defining the app, database, and Redis cache.',
    resumePill: 'Docker & Containerization'
  },
  {
    step: 2,
    title: 'Automate CI with GitHub Actions',
    icon: '⚙️',
    why: 'Demonstrates professional workflow knowledge. Proves your code is tested and linted on every push.',
    collegeState: 'No continuous integration; broken commits pushed to repo.',
    upgradeAction: 'Create `.github/workflows/ci.yml` that runs linter and unit tests automatically on every PR.',
    resumePill: 'CI/CD Pipelines'
  },
  {
    step: 3,
    title: 'Write Meaningful Unit & Integration Tests',
    icon: '🧪',
    why: '95% of college applicants have zero tests on their GitHub. Having 15+ automated tests instantly sets you apart.',
    collegeState: 'Zero automated tests.',
    upgradeAction: 'Write unit tests for business logic and integration tests for API endpoints using Vitest, Jest, or PyTest.',
    resumePill: 'Automated Testing (TDD)'
  },
  {
    step: 4,
    title: 'Deploy Live to Cloud with Real Database',
    icon: '🌐',
    why: 'A recruiter or interviewer will NOT clone your repo and run `npm install`. They want a clickable live URL in your resume header.',
    collegeState: 'Screenshots in a PowerPoint presentation; only runs on localhost.',
    upgradeAction: 'Deploy frontend to Vercel/Netlify, backend to Render/Railway/Fly.io, and DB to Neon/Supabase with HTTPS.',
    resumePill: 'Cloud Deployment (AWS/Vercel)'
  },
  {
    step: 5,
    title: 'Implement Clean Layered Architecture',
    icon: '🏛️',
    why: 'Shows you know how software scales in enterprise teams rather than writing 1,000-line monolithic scripts.',
    collegeState: 'All database queries and route handlers mashed together in `server.js`.',
    upgradeAction: 'Separate into `controllers/`, `services/`, `models/`, and `middlewares/`. Add validation via Zod/Joi.',
    resumePill: 'System Architecture & Clean Code'
  },
  {
    step: 6,
    title: 'Add Real-Time Telemetry & Error Tracking',
    icon: '📈',
    why: 'Shows engineering maturity. You know what happens when things break in production.',
    collegeState: '`console.log` scattered everywhere.',
    upgradeAction: 'Integrate Sentry (free tier) for error reporting and Winston/Pino for structured JSON logging.',
    resumePill: 'Observability & Monitoring'
  },
  {
    step: 7,
    title: 'Write a Professional README with Architecture Diagram',
    icon: '📝',
    why: 'The README is the landing page of your engineering capability. Senior engineers judge you by your documentation.',
    collegeState: 'Empty README or default "Created with Vite" text.',
    upgradeAction: 'Include high-level architecture diagram (Mermaid.js), feature list, API schema, and live demo link.',
    resumePill: 'Technical Documentation'
  }
];

export default function CollegeVsIndustryGuide() {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'code_inspector', 'lifecycle', 'scale', 'levelup_blueprint'
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0);
  const [codeMode, setCodeMode] = useState('split'); // 'split', 'college', 'industry'
  const [teamViewMode, setTeamViewMode] = useState('group'); // 'solo', 'group', 'company'

  const filteredDimensions = filterCategory === 'all'
    ? COMPARISON_DIMENSIONS
    : COMPARISON_DIMENSIONS.filter(d => d.category === filterCategory);

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1.5px solid var(--glass-border)',
      borderRadius: '20px',
      padding: 'clamp(12px, 3vw, 24px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit'
    }}>
      {/* ── HEADER BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(56, 189, 248, 0.15), rgba(16, 185, 129, 0.12))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: 'clamp(14px, 3vw, 24px)',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🏢</span>
            <span style={{
              background: 'linear-gradient(90deg, #38bdf8, #818cf8, #34d399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '24px',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}>
              College vs Industry: The Reality of Real-World Software Engineering
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Ever wondered why top tech companies rarely ask about college projects, or why fresh graduates feel completely lost in their first software engineering job?
            Discover how <strong>college teaches coding</strong> vs how <strong>tech companies build massive systems at scale</strong> — and learn how to bridge the gap today!
          </p>
        </div>

        {/* Quick Highlights Badge Box */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(0,0,0,0.35)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🎓 College:</span>
            <span>Single user • Localhost • Runs once for viva</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>🏢 Industry:</span>
            <span>Millions of users • 24/7 Uptime • 10-year lifespan</span>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        paddingBottom: '8px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        {[
          { id: 'matrix', icon: '⚖️', label: '1. The Great Divide (Comparison Matrix)' },
          { id: 'code_inspector', icon: '🔍', label: '2. Code Inspector: College vs Production' },
          { id: 'lifecycle', icon: '🔄', label: '3. Project Lifecycle Stepper' },
          { id: 'scale', icon: '📈', label: '4. Mind-Blowing Scale Telemetry' },
          { id: 'levelup_blueprint', icon: '🚀', label: '5. Level-Up Your Project Blueprint' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: isActive ? '2px solid var(--accent-primary)' : '1px solid transparent',
                background: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: THE GREAT DIVIDE (SIDE-BY-SIDE COMPARISON MATRIX)                  */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div>
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '4px' }}>
              Filter Dimension:
            </span>
            {[
              { id: 'all', label: 'All Dimensions' },
              { id: 'architecture', label: '🏛️ Architecture & Code' },
              { id: 'collaboration', label: '🤝 Teams & Version Control' },
              { id: 'testing', label: '🧪 Testing & QA' },
              { id: 'database', label: '🗄️ Database & Scale' },
              { id: 'devops', label: '🚀 DevOps & Hosting' },
              { id: 'monitoring', label: '📊 Observability & Logs' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: filterCategory === cat.id ? '1.5px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                  background: filterCategory === cat.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.25)',
                  color: filterCategory === cat.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: filterCategory === cat.id ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dimension Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredDimensions.map((dim) => (
              <div
                key={dim.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  borderRadius: '16px',
                  border: '1px solid var(--glass-border)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
                }}
              >
                {/* Card Title Banner */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px 18px',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{dim.icon}</span>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: '700' }}>
                      {dim.title}
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {dim.category}
                  </span>
                </div>

                {/* Side-by-Side Comparison Columns */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  divideX: '1px solid rgba(255,255,255,0.08)'
                }}>
                  {/* College Side (Left) */}
                  <div style={{
                    padding: '20px',
                    background: 'rgba(239, 68, 68, 0.03)',
                    borderRight: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        🎓 HOW COLLEGE TEACHES IT
                      </span>
                      <span style={{ fontSize: '11px', color: '#ef4444' }}>
                        {dim.college.verdictBadge}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14.5px', color: '#fca5a5', lineHeight: '1.4' }}>
                      {dim.college.headline}
                    </h4>

                    <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {dim.college.description}
                    </p>

                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #ef4444',
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      color: '#fca5a5'
                    }}>
                      ⚠️ {dim.college.workflow}
                    </div>
                  </div>

                  {/* Industry Side (Right) */}
                  <div style={{
                    padding: '20px',
                    background: 'rgba(16, 185, 129, 0.03)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        🏢 HOW REAL TECH COMPANIES DO IT
                      </span>
                      <span style={{ fontSize: '11px', color: '#10b981' }}>
                        {dim.industry.verdictBadge}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14.5px', color: '#86efac', lineHeight: '1.4' }}>
                      {dim.industry.headline}
                    </h4>

                    <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {dim.industry.description}
                    </p>

                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #10b981',
                      fontSize: '11.5px',
                      fontFamily: 'monospace',
                      color: '#86efac'
                    }}>
                      ✅ {dim.industry.workflow}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CODE INSPECTOR (COLLEGE CODE vs PRODUCTION CODE)                   */}
      {/* ========================================================================= */}
      {activeTab === 'code_inspector' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header & Snippet Selector */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CODE_INSPECTIONS.map((snip, idx) => (
                <button
                  key={snip.id}
                  onClick={() => setActiveSnippetIdx(idx)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: activeSnippetIdx === idx ? '1.5px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                    background: activeSnippetIdx === idx ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: activeSnippetIdx === idx ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {snip.title}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '8px' }}>
              {['split', 'college', 'industry'].map(m => (
                <button
                  key={m}
                  onClick={() => setCodeMode(m)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: codeMode === m ? 'var(--accent-primary)' : 'transparent',
                    color: codeMode === m ? '#000' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {m === 'split' ? 'Side-by-Side' : (m === 'college' ? '🎓 College Only' : '🏢 Production Only')}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Alert */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid var(--accent-primary)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13.5px',
            color: 'var(--text-primary)',
            lineHeight: '1.5'
          }}>
            💡 <strong>Why this matters:</strong> {CODE_INSPECTIONS[activeSnippetIdx].explanation}
          </div>

          {/* Code Viewer Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: codeMode === 'split' ? 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' : '1fr',
            gap: '16px'
          }}>
            {/* College Code Box */}
            {(codeMode === 'split' || codeMode === 'college') && (
              <div style={{
                background: '#090d16',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  padding: '10px 16px',
                  borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '13px' }}>
                    🎓 The "College Project" Way
                  </span>
                  <span style={{ fontSize: '11px', color: '#ef4444', fontFamily: 'monospace' }}>
                    Fragile • Security Risk
                  </span>
                </div>
                <pre style={{
                  margin: 0,
                  padding: '16px',
                  fontFamily: 'Consolas, monospace',
                  fontSize: '12px',
                  color: '#fca5a5',
                  overflowX: 'auto', WebkitOverflowScrolling: 'touch',
                  lineHeight: '1.6'
                }}>
                  <code>{CODE_INSPECTIONS[activeSnippetIdx].collegeCode}</code>
                </pre>
              </div>
            )}

            {/* Production Code Box */}
            {(codeMode === 'split' || codeMode === 'industry') && (
              <div style={{
                background: '#090d16',
                border: '1.5px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '14px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  padding: '10px 16px',
                  borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#34d399', fontWeight: 'bold', fontSize: '13px' }}>
                    🏢 The "Enterprise Production" Way
                  </span>
                  <span style={{ fontSize: '11px', color: '#10b981', fontFamily: 'monospace' }}>
                    Resilient • Scalable • Auditable
                  </span>
                </div>
                <pre style={{
                  margin: 0,
                  padding: '16px',
                  fontFamily: 'Consolas, monospace',
                  fontSize: '12px',
                  color: '#86efac',
                  overflowX: 'auto', WebkitOverflowScrolling: 'touch',
                  lineHeight: '1.6'
                }}>
                  <code>{CODE_INSPECTIONS[activeSnippetIdx].industryCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROJECT LIFECYCLE STEPPER                                          */}
      {/* ========================================================================= */}
      {activeTab === 'lifecycle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>
              🔄 From Idea to Production: The 6 Stages of Software Creation
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
              Notice how in college, 90% of the focus is on rushed last-minute coding, while in tech companies, coding is just one small step between extensive architecture planning, rigorous testing, and continuous 24/7 observability!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {LIFECYCLE_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '18px',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: '8px'
                  }}>
                    <span style={{
                      background: 'var(--accent-primary)',
                      color: '#000',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {idx + 1}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>
                      {step.phase}
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {/* College */}
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.05)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      borderLeft: '3px solid #ef4444'
                    }}>
                      <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', marginBottom: '4px' }}>
                        🎓 COLLEGE SEMESTER REALITY:
                      </div>
                      <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#fca5a5', marginBottom: '4px' }}>
                        {step.collegeTitle}
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {step.collegeDesc}
                      </p>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <strong>Common tools:</strong> {step.collegeTools}
                      </div>
                    </div>

                    {/* Company */}
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.05)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      borderLeft: '3px solid #10b981'
                    }}>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                        🏢 TECH COMPANY REALITY:
                      </div>
                      <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#86efac', marginBottom: '4px' }}>
                        {step.companyTitle}
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {step.companyDesc}
                      </p>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <strong>Standard tools:</strong> {step.companyTools}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MIND-BLOWING SCALE TELEMETRY                                       */}
      {/* ========================================================================= */}
      {activeTab === 'scale' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(56, 189, 248, 0.15))',
            border: '1.5px solid #a855f7',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#d8b4fe' }}>
              📈 How Big Are Real Production Software Projects?
            </h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
              In college, your project has <strong>1 user</strong> (you) and maybe <strong>1,000 lines of code</strong>.
              Here is what software engineering looks like at actual tech companies:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {[
              {
                company: 'Google',
                stat: '2+ Billion Lines',
                metric: 'Single Monolithic Repository',
                desc: 'Google stores Google Search, YouTube, Docs, and Maps in a single monorepo with 25,000+ software engineers committing code thousands of times a day.',
                icon: '🔍',
                color: '#38bdf8'
              },
              {
                company: 'Amazon',
                stat: '150,000+ Deploys/Day',
                metric: 'Zero-Downtime Microservices',
                desc: 'Every ~0.5 seconds, an automated deployment goes live to Amazon production worldwide across thousands of microservices without customers noticing.',
                icon: '📦',
                color: '#f59e0b'
              },
              {
                company: 'Netflix',
                stat: '1,000+ Microservices',
                metric: 'Chaos Engineering Resiliency',
                desc: 'Netflix runs "Chaos Monkey", a tool that randomly kills production servers in real time to guarantee that the system survives automatic server crashes.',
                icon: '🎬',
                color: '#ef4444'
              },
              {
                company: 'Instagram / Meta',
                stat: 'Thousands of Deploys/Day',
                metric: 'Massive Python & React Scale',
                desc: 'Over 2 billion active monthly users. A single slow database query or memory leak can crash hundreds of servers in seconds, costing millions in revenue.',
                icon: '📸',
                color: '#10b981'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  borderRadius: '14px',
                  border: `1px solid ${card.color}33`,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px' }}>{card.icon}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: card.color,
                    background: `${card.color}15`,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {card.company}
                  </span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
                  {card.stat}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: card.color }}>
                  {card.metric}
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Downtime Cost Alert */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ fontSize: '28px' }}>💸</span>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#f87171', fontSize: '15px' }}>
                Why Companies Obsess Over Code Quality: The Cost of 1 Hour of Downtime
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                For enterprise tech companies, 1 hour of server downtime costs between <strong>$300,000 to $1,000,000+</strong> in lost revenue and brand damage.
                That is why code reviews, automated CI tests, rollback plans, and Docker containerization are mandatory requirements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: LEVEL-UP YOUR PROJECT BLUEPRINT                                    */}
      {/* ========================================================================= */}
      {activeTab === 'levelup_blueprint' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))',
            border: '1.5px solid #10b981',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#34d399' }}>
              🚀 The 7-Step "Project Level-Up" Blueprint: Turn Any College Project into an SDE Job Magnet
            </h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
              Don't throw away your college project! You don't need a groundbreaking new idea.
              Take your existing simple project (e.g. Blog, E-commerce, Todo, or Management system) and <strong>engineer it like a tech company</strong>.
              Having these 7 elements on your GitHub will put you in the top 1% of campus engineering applicants!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {LEVEL_UP_STEPS.map((step) => (
              <div
                key={step.step}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{step.icon}</span>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>
                      Step {step.step}: {step.title}
                    </h4>
                  </div>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid var(--accent-primary)',
                    color: 'var(--accent-primary)',
                    padding: '3px 9px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    Resume Tag: {step.resumePill}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: '#93c5fd', lineHeight: '1.5' }}>
                  ⭐ <strong>Why recruiters care:</strong> {step.why}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '10px',
                  marginTop: '4px'
                }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #ef4444', fontSize: '12px', color: '#fca5a5' }}>
                    <strong>Average College Project:</strong> {step.collegeState}
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #10b981', fontSize: '12px', color: '#86efac' }}>
                    <strong>Your Production Upgrade:</strong> {step.upgradeAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
