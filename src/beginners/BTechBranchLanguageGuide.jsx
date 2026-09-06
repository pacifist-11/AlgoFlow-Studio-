import React, { useState } from 'react';

export default function BTechBranchLanguageGuide() {
  const [selectedBranch, setSelectedBranch] = useState('cse');
  const [hoveredBranchId, setHoveredBranchId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('roadmap'); // 'roadmap', 'dualtrack', 'moocs_challenges', 'codepreview', 'advisor_quiz', 'matrix'
  
  // Interactive Smart Advisor Quiz state
  const [quizBranch, setQuizBranch] = useState('cse');
  const [quizGoal, setQuizGoal] = useState('sde');
  const [quizYear, setQuizYear] = useState('1');
  const [quizSkillLevel, setQuizSkillLevel] = useState('beginner');
  const [quizResult, setQuizResult] = useState(null);

  // Filter Categories
  const categories = [
    { id: 'all', label: 'All Branches' },
    { id: 'cs_it', label: '💻 CS, IT & Software' },
    { id: 'ai_cyber', label: '🧠 AI, Data & Security' },
    { id: 'circuits', label: '⚡ Electronics & Electrical' },
    { id: 'core_eng', label: '⚙️ Mechanical, Auto & Robotics' },
    { id: 'specialized', label: '🚀 Aero, Bio, Chem & Materials' }
  ];

  // Comprehensive 16 B.Tech Branches Data
  const branchData = [
    {
      id: 'cse',
      shortName: 'CSE',
      name: 'Computer Science & Engineering (CSE)',
      category: 'cs_it',
      icon: '💻',
      color: '#38bdf8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      welcomeTitle: '🌟 Welcome to Computer Science & Software Engineering!',
      welcomeMessage: 'As a CSE student, code is your primary craft. Your objective is mastering algorithmic problem solving, scalable distributed architecture, operating systems, and high-concurrency systems.',
      difficulty: 'High in Logic & Algorithmic Thinking',
      placementDemand: '⭐⭐⭐⭐⭐ (Highest Job Openings worldwide: ₹8 - 45 LPA)',
      coreFocus: 'Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, Cloud, Distributed Systems & System Design.',
      primaryLang: {
        name: 'C++ or Java',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'The industry gold standards for Data Structures & Algorithms (DSA), competitive programming, and technical interviews at Tier-1 product companies (Google, Amazon, Microsoft).'
      },
      secondaryLang: {
        name: 'Python & JavaScript / TypeScript',
        badge: 'Recommended (2nd & 3rd Year)',
        reason: 'TypeScript powers modern Full-Stack Web/Mobile engineering (React, Next.js, Node.js). Python handles AI scripting, data pipelines, and backend microservices.'
      },
      domainTools: ['Git & GitHub', 'Docker & Kubernetes', 'PostgreSQL / MongoDB', 'Linux Bash & AWS/GCP Cloud'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Programming Fundamentals in C/C++, Math, Logic Building, Linux CLI, Git & GitHub basics' },
        { year: '2nd Year (Sophomore)', focus: 'Data Structures & Algorithms (DSA), OOPs in Java/C++, DBMS (SQL), Operating Systems & Networks' },
        { year: '3rd Year (Junior)', focus: 'Full-Stack Web (React/Next.js/Node) or Cloud/AI specialization, 2 Capstone Projects, Hackathons, Internships' },
        { year: '4th Year (Senior)', focus: 'System Design (HLD/LLD), LeetCode Grinding (Blind 75 & Top 150), Mock Technical Interviews & Campus Placements' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Direct Software Development Route (Product & FAANG Giants)',
        coreDescription: 'Standard Software Engineering track focusing on DSA, Web/Cloud Architecture, and High-Scale System Design.',
        steps: [
          'Master C++ STL or Java Collections Framework for DSA problem solving.',
          'Solve 250+ DSA problems across Arrays, Trees, Graphs, and DP on LeetCode.',
          'Build 2 production-grade Full-Stack projects with user authentication, database indexing, and cloud deployment.',
          'Study core CS subjects: OS (Threads, Deadlocks, Virtual Memory), DBMS (B-Trees, ACID, Sharding), OOPs.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'CS50x: Introduction to Computer Science', provider: 'Harvard University (edX)', tag: 'Best 1st Year Course' },
          { name: 'Data Structures & Algorithms Specialization', provider: 'UC San Diego (Coursera)', tag: 'Core DSA' },
          { name: 'Meta Full-Stack Developer Professional Certificate', provider: 'Meta (Coursera)', tag: 'Web Dev' }
        ],
        certifications: [
          { name: 'AWS Certified Cloud Practitioner / Solutions Architect', issuer: 'Amazon Web Services' },
          { name: 'Oracle Certified Associate: Java SE Programmer', issuer: 'Oracle' }
        ]
      },
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'Atlassian', 'Oracle', 'Goldman Sachs'],
      codeSample: {
        title: 'Binary Search Algorithm (C++)',
        language: 'cpp',
        code: `// C++ Binary Search - Core CSE Technical Interview Question
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    std::vector<int> sortedArr = {10, 25, 33, 47, 59, 81, 95};
    int index = binarySearch(sortedArr, 47);
    std::cout << "Target 47 found at index: " << index << std::endl;
    return 0;
}`
      }
    },
    {
      id: 'it',
      shortName: 'IT & Cloud',
      name: 'Information Technology (IT & Cloud)',
      category: 'cs_it',
      icon: '🌐',
      color: '#06b6d4',
      accentBg: 'rgba(6, 182, 212, 0.12)',
      welcomeTitle: '☁️ Welcome to Cloud Computing, Web Architecture & Enterprise Tech!',
      welcomeMessage: 'IT engineers focus on end-to-end software delivery, cloud infrastructure, enterprise microservices, database administration, and web/mobile application architectures.',
      difficulty: 'Moderate-High (Software Engineering & Cloud Deployments)',
      placementDemand: '⭐⭐⭐⭐⭐ (Massive Global Openings: ₹7 - 35 LPA)',
      coreFocus: 'Full-Stack Web Development, Cloud Services (AWS/Azure), DevOps Pipelines (CI/CD), Database Systems & Network Administration.',
      primaryLang: {
        name: 'Java or TypeScript',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Java powers enterprise backends (Spring Boot) and banking applications. TypeScript is the industry standard for type-safe full-stack web and cloud applications.'
      },
      secondaryLang: {
        name: 'Python & Go (Golang)',
        badge: 'Recommended (2nd & 3rd Year)',
        reason: 'Python for cloud automation scripting and APIs. Go for cloud-native microservices, Docker, and Kubernetes tooling.'
      },
      domainTools: ['AWS / Azure / GCP', 'Docker & Kubernetes', 'PostgreSQL & Redis', 'Terraform & GitHub Actions'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C / Java fundamentals, Web Basics (HTML/CSS/JS), Git, Linux Command Line' },
        { year: '2nd Year (Sophomore)', focus: 'DSA in Java/C++, RDBMS & SQL, Spring Boot / Node.js backend development, REST APIs' },
        { year: '3rd Year (Junior)', focus: 'Full-Stack Next.js apps, Docker containerization, AWS Cloud deployment, Microservices' },
        { year: '4th Year (Senior)', focus: 'DevOps CI/CD pipelines, System Architecture, LeetCode interview prep, Campus Placements' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Cloud Architect & Full-Stack SDE Route',
        coreDescription: 'Standard Software Engineering track focusing on cloud computing, APIs, and scalable web apps.',
        steps: [
          'Master Java / TypeScript for DSA problem solving.',
          'Build and deploy scalable Full-Stack applications on AWS / Vercel.',
          'Learn Docker, Redis caching, and relational database indexing (PostgreSQL).'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'AWS Cloud Solutions Architect Specialization', provider: 'Coursera / AWS', tag: 'Cloud Specialization' },
          { name: 'Full Stack Open (React, TypeScript, GraphQL)', provider: 'University of Helsinki', tag: 'Top Web Dev' }
        ],
        certifications: [
          { name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services' },
          { name: 'Microsoft Certified: Azure Developer Associate', issuer: 'Microsoft' }
        ]
      },
      topCompanies: ['Amazon AWS', 'Microsoft', 'Oracle Cloud', 'Cisco', 'Salesforce', 'Infosys Digital', 'TCS Prime', 'Accenture'],
      codeSample: {
        title: 'TypeScript / Node.js Express Cloud Microservice',
        language: 'typescript',
        code: `import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

app.listen(8080, () => console.log('Cloud Service listening on port 8080'));`
      }
    },
    {
      id: 'aiml',
      shortName: 'AI & ML',
      name: 'Artificial Intelligence & Machine Learning (AI/ML)',
      category: 'ai_cyber',
      icon: '🧠',
      color: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      welcomeTitle: '🧠 Welcome to Neural Networks, Deep Learning & LLMs!',
      welcomeMessage: 'AI/ML engineers build predictive machine learning models, neural networks, computer vision apps, natural language transformers, and Generative AI agents.',
      difficulty: 'High in Math (Linear Algebra, Probability) & Deep Learning',
      placementDemand: '⭐⭐⭐⭐⭐ (Highest Industry Growth: ₹10 - 45 LPA)',
      coreFocus: 'Machine Learning, Deep Learning (PyTorch), Generative AI (LLMs, RAG), Computer Vision (OpenCV), Natural Language Processing (NLP).',
      primaryLang: {
        name: 'Python',
        badge: 'Absolute King & Must Master (1st to 4th Year)',
        reason: 'The supreme global language for AI. Powers PyTorch, TensorFlow, Scikit-Learn, Hugging Face transformers, and LangChain LLM pipelines.'
      },
      secondaryLang: {
        name: 'SQL, C++ & Julia',
        badge: 'Essential (2nd & 3rd Year)',
        reason: 'SQL extracts data from big warehouses. C++ accelerates high-speed GPU AI inference (TensorRT, ONNX Runtime, CUDA).'
      },
      domainTools: ['PyTorch & TensorFlow', 'Hugging Face & LangChain', 'Jupyter, Colab & Kaggle', 'Docker & MLflow'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Mastery, Linear Algebra, Multivariable Calculus, Probability & Statistics, Git' },
        { year: '2nd Year (Sophomore)', focus: 'Data Structures in Python, NumPy/Pandas, Scikit-Learn Supervised & Unsupervised ML, SQL' },
        { year: '3rd Year (Junior)', focus: 'Deep Learning (PyTorch CNNs, Transformers), Computer Vision (OpenCV), Kaggle Competitions' },
        { year: '4th Year (Senior)', focus: 'Generative AI (RAG, Vector DBs, LangChain), MLOps deployment, AI/ML Engineer Placements' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'AI / Machine Learning Engineer & Research Scientist',
        coreDescription: 'Standard track for training neural networks, optimizing hyperparameters, and deploying AI models.',
        steps: [
          'Master PyTorch for building custom neural network architectures.',
          'Compete in Kaggle competitions to build proven rankings and portfolio notebooks.',
          'Build end-to-end GenAI applications with LangChain, FastAPI, and Pinecone Vector DB.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Machine Learning Specialization by Andrew Ng', provider: 'DeepLearning.AI / Stanford', tag: 'Best ML Foundation' },
          { name: 'Deep Learning Specialization (Neural Networks & NLP)', provider: 'DeepLearning.AI', tag: 'Core DL' }
        ],
        certifications: [
          { name: 'Google Cloud Professional Machine Learning Engineer', issuer: 'Google Cloud' },
          { name: 'AWS Certified Machine Learning – Specialty', issuer: 'Amazon Web Services' }
        ]
      },
      topCompanies: ['Google DeepMind', 'OpenAI', 'Microsoft AI', 'NVIDIA', 'Meta AI', 'Amazon AWS AI', 'Tiger Analytics', 'Fractal'],
      codeSample: {
        title: 'PyTorch: Simple Neural Network Binary Classifier',
        language: 'python',
        code: `import torch
import torch.nn as nn

class BinaryClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(10, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
    def forward(self, x):
        return self.net(x)

model = BinaryClassifier()
dummy_data = torch.randn(1, 10)
print(f"Prediction: {model(dummy_data).item():.4f}")`
      }
    },
    {
      id: 'ds',
      shortName: 'Data Science',
      name: 'Data Science & Big Data Engineering (DS)',
      category: 'ai_cyber',
      icon: '📊',
      color: '#f59e0b',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      welcomeTitle: '📈 Welcome to Big Data, Analytics & Business Intelligence!',
      welcomeMessage: 'Data Science engineers transform petabytes of unstructured raw data into predictive insights, business dashboards, automated data pipelines, and machine learning models.',
      difficulty: 'Moderate-High (Statistics, Data Pipelines & SQL)',
      placementDemand: '⭐⭐⭐⭐⭐ (Critical Shortage Across FinTech & E-commerce: ₹8 - 35 LPA)',
      coreFocus: 'Data Analytics, Statistical Inference, Big Data Distributed Pipelines (Apache Spark, Kafka), Data Warehousing (Snowflake), Business Intelligence (Tableau).',
      primaryLang: {
        name: 'Python & SQL',
        badge: 'Absolute Core (1st & 2nd Year)',
        reason: 'Python (Pandas, NumPy, Seaborn) handles analytical modeling. SQL is the mandatory query language for querying multi-terabyte data warehouses.'
      },
      secondaryLang: {
        name: 'R & Scala / Java',
        badge: 'Recommended for Big Data (2nd & 3rd Year)',
        reason: 'Scala/Java powers Apache Spark distributed clusters for processing millions of transactions per second. R is standard in statistical research.'
      },
      domainTools: ['Apache Spark & Kafka', 'Snowflake & BigQuery', 'Power BI & Tableau', 'PostgreSQL & Airflow'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Advanced SQL Queries & Joins, Descriptive Statistics, Excel' },
        { year: '2nd Year (Sophomore)', focus: 'Pandas, NumPy, Matplotlib/Seaborn, Exploratory Data Analysis (EDA), DSA basics' },
        { year: '3rd Year (Junior)', focus: 'Machine Learning (Scikit-Learn), Apache Spark Big Data, Snowflake, Dashboard Building' },
        { year: '4th Year (Senior)', focus: 'Data Engineering Pipelines (Airflow, DBT), End-to-End Analytics Capstone, Placements' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Data Scientist & Big Data Engineer Track',
        coreDescription: 'Standard track for designing data warehouses, Spark pipelines, and predictive analytics models.',
        steps: [
          'Master complex SQL queries, window functions, and database indexing.',
          'Build interactive analytical dashboards with Power BI or Tableau.',
          'Process big datasets using PySpark and store them in modern Cloud Data Warehouses.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Applied Data Science with Python Specialization', provider: 'University of Michigan', tag: 'Top Data Science' },
          { name: 'IBM Data Engineering Professional Certificate', provider: 'IBM (Coursera)', tag: 'Big Data Pipeline' }
        ],
        certifications: [
          { name: 'Databricks Certified Associate Developer for Apache Spark', issuer: 'Databricks' },
          { name: 'Google Cloud Professional Data Engineer', issuer: 'Google Cloud' }
        ]
      },
      topCompanies: ['Mu Sigma', 'Fractal Analytics', 'LatentView', 'Amazon', 'Flipkart', 'Walmart Global Tech', 'Deloitte', 'EY Analytics'],
      codeSample: {
        title: 'Python Pandas: Customer Cohort Analytics & Aggregation',
        language: 'python',
        code: `import pandas as pd

data = {'OrderID': [1, 2, 3, 4], 'Revenue': [250, 450, 120, 890], 'Region': ['South', 'North', 'South', 'East']}
df = pd.DataFrame(data)

summary = df.groupby('Region')['Revenue'].agg(['count', 'sum', 'mean'])
print("=== REGIONAL REVENUE SUMMARY ===")
print(summary)`
      }
    },
    {
      id: 'cyber',
      shortName: 'Cyber Security',
      name: 'Cyber Security & Digital Forensics',
      category: 'ai_cyber',
      icon: '🛡️',
      color: '#ef4444',
      accentBg: 'rgba(239, 68, 68, 0.12)',
      welcomeTitle: '🔒 Welcome to Ethical Hacking, Threat Defense & Cryptography!',
      welcomeMessage: 'Cyber Security engineers safeguard global digital infrastructure. You defend networks from state-sponsored cyberattacks, analyze malware binaries, and perform penetration testing.',
      difficulty: 'Moderate-High (OS Internals, Networking & Exploit Scripting)',
      placementDemand: '⭐⭐⭐⭐⭐ (Huge Talent Deficit: ₹7 - 35 LPA)',
      coreFocus: 'Penetration Testing, Ethical Hacking, Network Security, Malware Analysis, Cryptography, Cloud Security, SIEM & SOC Operations.',
      primaryLang: {
        name: 'Python & Linux Bash',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python is the #1 tool for writing exploit scripts, network packet sniffers (Scapy), automation scanners, and cryptography tools. Linux Bash is the daily operating language of security analysts.'
      },
      secondaryLang: {
        name: 'C & C++ / Go',
        badge: 'Essential (2nd & 3rd Year)',
        reason: 'C and C++ are needed to understand Buffer Overflows, reverse engineer malware binaries, and analyze OS kernel vulnerabilities. Go is favored for modern lightning-fast security tools.'
      },
      domainTools: ['Kali Linux & Parrot OS', 'Wireshark & Nmap', 'Burp Suite Pro & OWASP ZAP', 'Metasploit & Ghidra'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Networking fundamentals (TCP/IP, OSI, DNS), Linux CLI, Python basics, Cryptography' },
        { year: '2nd Year (Sophomore)', focus: 'Web Security (OWASP Top 10), Burp Suite, Network Sniffing with Wireshark, TryHackMe' },
        { year: '3rd Year (Junior)', focus: 'Penetration Testing, Metasploit, Reverse Engineering with Ghidra, Cloud Security' },
        { year: '4th Year (Senior)', focus: 'Bug Bounty hunting, Security Analyst / Pentester placements (Big 4, Defense)' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Ethical Hacker & SOC Security Analyst Route',
        coreDescription: 'Standard track for Red Team penetration testing and Blue Team defense.',
        steps: [
          'Earn foundational security certs: CompTIA Security+ or CEH.',
          'Practice actively on TryHackMe (beginner-friendly) and Hack The Box.',
          'Participate in public Bug Bounty programs (HackerOne, Bugcrowd).'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Google Cybersecurity Professional Certificate', provider: 'Google (Coursera)', tag: 'Top Entry' },
          { name: 'Information Security and Ethical Hacking', provider: 'NPTEL (IIT Kharagpur)', tag: 'College Credit' }
        ],
        certifications: [
          { name: 'CompTIA Security+ (Global Standard Entry)', issuer: 'CompTIA' },
          { name: 'Offensive Security Certified Professional (OSCP)', issuer: 'OffSec' }
        ]
      },
      topCompanies: ['Palo Alto Networks', 'CrowdStrike', 'Cisco Security', 'Cloudflare', 'Mandiant (Google)', 'KPMG / Deloitte Cyber', 'Microsoft Security'],
      codeSample: {
        title: 'Python: TCP Port Scanner & Banner Grabber',
        language: 'python',
        code: `import socket

def check_port(ip, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.8)
    return s.connect_ex((ip, port)) == 0

target = "127.0.0.1"
for p in [22, 80, 443, 3306]:
    if check_port(target, p):
        print(f"Port {p} is OPEN on {target}")`
      }
    },
    {
      id: 'ece',
      shortName: 'ECE',
      name: 'Electronics & Communication Engineering (ECE)',
      category: 'circuits',
      icon: '📡',
      color: '#f59e0b',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      welcomeTitle: '⚡ Welcome to the Fusion of Silicon Hardware & Software!',
      welcomeMessage: 'ECE engineers bridge physical silicon chips with embedded software. You control microcontrollers, IoT devices, signal processing systems, VLSI semiconductors, and 5G telecommunication networks.',
      difficulty: 'Moderate-High (Hardware + Software integration)',
      placementDemand: '⭐⭐⭐⭐ (Huge Semiconductor Boom & High Software Crossover: ₹6 - 28 LPA)',
      coreFocus: 'Embedded Systems, Microcontrollers (ARM Cortex, ESP32), VLSI & Chip Design, Digital Signal Processing (DSP), IoT, 5G Telecom.',
      primaryLang: {
        name: 'C / Embedded C',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'The absolute backbone of microcontroller programming, firmware development, memory registers manipulation, and hardware-level driver execution.'
      },
      secondaryLang: {
        name: 'C++ & Python',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'C++ for Object-Oriented Embedded Systems & ROS (Robotics). Python for Signal Processing, Automation testing, IoT backend, and AI on edge (TinyML).'
      },
      domainTools: ['Verilog / VHDL (VLSI Design)', 'MATLAB & Simulink (DSP)', 'KiCAD / Altium (PCB Design)', 'STM32CubeIDE / Keil'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C Programming, Basic Electronics, Arduino prototyping, Git, Engineering Physics' },
        { year: '2nd Year (Sophomore)', focus: 'Embedded C, 8051/ARM Microcontrollers, Digital Electronics, DSA in C++' },
        { year: '3rd Year (Junior)', focus: 'Verilog/VLSI or IoT/Robotics projects, MATLAB DSP, RTOS (FreeRTOS)' },
        { year: '4th Year (Senior)', focus: 'Core VLSI/Embedded Placements (Texas Instruments, Qualcomm) OR Software SDE prep' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🛠️ Core ECE Route (Semiconductor, VLSI, Embedded & IoT)',
        coreDescription: 'Focus on Microcontrollers, RTOS, Verilog, PCB Design, and Signal Processing.',
        transitionTitle: '💻 Software SDE Transition Route (IT Placements)',
        transitionDescription: 'If you want to crack Software Engineer roles in Google, Amazon, Microsoft, TCS, Infosys:',
        steps: [
          'Choose C++ as your primary coding language (you already learn C in ECE).',
          'Practice standard DSA on LeetCode / GeeksforGeeks alongside 3rd year.',
          'Learn Database Management Systems (SQL) & Web Development basics (Node.js/React).',
          'Highlight 1 Embedded IoT project + 1 Full-Stack Software project on your resume.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Embedded Systems: Shape The World (Microcontroller)', provider: 'UT Austin (edX)', tag: 'Top Embedded' },
          { name: 'Digital VLSI Design & Verilog', provider: 'NPTEL (IIT Roorkee)', tag: 'Core VLSI' }
        ],
        certifications: [
          { name: 'Arm Certified Engineer (Embedded Systems)', issuer: 'Arm Architecture' },
          { name: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco' }
        ]
      },
      topCompanies: ['Qualcomm', 'Texas Instruments', 'Intel', 'NVIDIA', 'Broadcom', 'NXP', 'Bosch', 'Samsung R&D'],
      codeSample: {
        title: 'Embedded C: Analog Sensor Reading & Alarm Trigger',
        language: 'c',
        code: `#define SENSOR_PIN A0
#define ALERT_LED 13

void setup() {
    pinMode(ALERT_LED, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    int val = analogRead(SENSOR_PIN);
    float temp = (val * (5.0 / 1023.0) - 0.5) * 100.0;
    digitalWrite(ALERT_LED, temp > 75.0 ? HIGH : LOW);
    delay(500);
}`
      }
    },
    {
      id: 'eee',
      shortName: 'EEE (Power & EV)',
      name: 'Electrical & Electronics Engineering (EEE)',
      category: 'circuits',
      icon: '⚡',
      color: '#ec4899',
      accentBg: 'rgba(236, 72, 153, 0.12)',
      welcomeTitle: '⚡ Welcome to Power Systems, EV Mobility & Smart Grids!',
      welcomeMessage: 'EEE engineers build the future of Electric Vehicles (EV), Smart Energy Grids, Power Electronics, Battery Management Systems (BMS), and Industrial Automation.',
      difficulty: 'Moderate-High (Circuits, Math & Control Code)',
      placementDemand: '⭐⭐⭐⭐ (EV Boom, Power Sector & IT Crossover: ₹6 - 25 LPA)',
      coreFocus: 'Power Systems, Electric Vehicle (EV) Powertrains, BMS, PLC/SCADA Automation, Control Systems, Power Electronics.',
      primaryLang: {
        name: 'C & MATLAB/Simulink',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'C is required for programming motor controllers and BMS chips. MATLAB/Simulink is essential for simulating power electronics, smart grids, and control algorithms.'
      },
      secondaryLang: {
        name: 'Python & C++',
        badge: 'Recommended (2nd & 3rd Year)',
        reason: 'Python for smart meter analytics and EV battery health forecasting. C++ for industrial robotics and high-speed motor control.'
      },
      domainTools: ['MATLAB / Simulink', 'PLC Ladder Logic (Siemens TIA)', 'PSCAD / ETAP', 'Embedded C / CAN Bus'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C Programming, Circuit Theory, Basic Arduino, Engineering Math' },
        { year: '2nd Year (Sophomore)', focus: 'MATLAB Simulation, Analog/Digital Electronics, Power Electronics basics, DSA fundamentals' },
        { year: '3rd Year (Junior)', focus: 'EV Battery Management System (BMS) simulation, PLC Automation, IoT Power monitoring' },
        { year: '4th Year (Senior)', focus: 'Core Placements (Tesla, L&T, Schneider, Tata Power, ABB) OR Software IT jobs' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '⚡ Core EEE Route (Electric Vehicles, Power & Automation)',
        coreDescription: 'Focus on EV battery algorithms, MATLAB power simulations, and PLC automation.',
        transitionTitle: '💻 Software IT Transition Route',
        transitionDescription: 'Leverage your analytical skills to switch to Software Engineering:',
        steps: [
          'Learn Java or C++ for Data Structures and Algorithms.',
          'Build strong fundamentals in SQL and Web backend development (Spring Boot / Node.js).',
          'Showcase an IoT Smart Energy Monitoring project combining hardware and web dashboard.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Introduction to Battery-Management Systems', provider: 'UC Boulder (Coursera)', tag: 'EV Specialization' },
          { name: 'Industrial Automation and Control', provider: 'NPTEL (IIT Kharagpur)', tag: 'PLC & Automation' }
        ],
        certifications: [
          { name: 'Siemens Certified PLC Automation Engineer', issuer: 'Siemens SITRAIN' },
          { name: 'MathWorks Certified MATLAB Professional', issuer: 'MathWorks' }
        ]
      },
      topCompanies: ['Tesla', 'Schneider Electric', 'ABB', 'Larsen & Toubro', 'Siemens', 'Tata Motors EV', 'Texas Instruments'],
      codeSample: {
        title: 'MATLAB Script: PWM DC Motor Speed Control Calculation',
        language: 'matlab',
        code: `V_battery = 48.0; duty_cycle = 0.75; R_armature = 0.5;
V_applied = V_battery * duty_cycle;
I_motor = (V_applied - 24.0) / R_armature;
fprintf('Applied Voltage: %.2f V | Current: %.2f A\\n', V_applied, I_motor);`
      }
    },
    {
      id: 'eie',
      shortName: 'EIE / ICE',
      name: 'Electronics & Instrumentation Engineering (EIE / ICE)',
      category: 'circuits',
      icon: '📟',
      color: '#14b8a6',
      accentBg: 'rgba(20, 184, 166, 0.12)',
      welcomeTitle: '🎛️ Welcome to Smart Sensors, Industrial IoT & Process Automation!',
      welcomeMessage: 'Instrumentation engineers automate industrial plants, refineries, biomedical sensors, and smart factories using PLC/SCADA, DCS, LabVIEW, and sensor fusion algorithms.',
      difficulty: 'Moderate (Sensors, Control Math & Hardware Code)',
      placementDemand: '⭐⭐⭐⭐ (Process Industries, Robotics & IT: ₹5.5 - 22 LPA)',
      coreFocus: 'Smart Sensors, Industrial IoT, Process Control Loops (PID), PLC/SCADA, LabVIEW, Biomedical Instrumentation.',
      primaryLang: {
        name: 'C & Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'C for reading analog sensor registers and microcontroller calibration. Python for sensor data logging, IoT dashboards, and automation.'
      },
      secondaryLang: {
        name: 'LabVIEW (G-Code) & MATLAB',
        badge: 'Core Tooling (2nd & 3rd Year)',
        reason: 'LabVIEW is standard in automated testing benches (National Instruments). MATLAB tunes PID control loops.'
      },
      domainTools: ['LabVIEW & NI DAQ', 'PLC / SCADA (Rockwell / Siemens)', 'MATLAB Control Toolbox', 'Modbus / MQTT Protocols'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C Programming, Basic Electronics, Sensor physics, Calculus' },
        { year: '2nd Year (Sophomore)', focus: 'Operational Amplifiers, Transducers, LabVIEW basics, Python data analysis' },
        { year: '3rd Year (Junior)', focus: 'PLC/SCADA Automation, PID Controller tuning in MATLAB, Industrial IoT' },
        { year: '4th Year (Senior)', focus: 'Core Placements (Honeywell, Yokogawa, Emerson, Siemens) OR Software SDE' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🎛️ Core Automation & Instrumentation Track',
        coreDescription: 'Focus on DCS systems, sensor signal conditioning, and PLC plant automation.',
        transitionTitle: '💻 Software & IoT Cloud Transition',
        transitionDescription: 'Bridge physical telemetry data to cloud analytics:',
        steps: [
          'Master Python / Java and SQL databases.',
          'Build an IoT Telemetry Dashboard with MQTT protocol and WebSockets.',
          'Practice standard LeetCode DSA for software roles.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Industrial IoT and Sensor Networks', provider: 'NPTEL (IIT Kharagpur)', tag: 'IIoT Core' },
          { name: 'Process Control and Instrumentation', provider: 'Coursera', tag: 'Process Engineering' }
        ],
        certifications: [
          { name: 'Certified LabVIEW Associate Developer (CLAD)', issuer: 'National Instruments' },
          { name: 'ISA Certified Automation Professional (CAP)', issuer: 'International Society of Automation' }
        ]
      },
      topCompanies: ['Honeywell', 'Yokogawa', 'Emerson', 'ABB', 'Siemens', 'National Instruments', 'Rockwell Automation'],
      codeSample: {
        title: 'Python: Reading MQTT Sensor Telemetry Stream',
        language: 'python',
        code: `import json

def process_sensor_packet(payload_str):
    data = json.loads(payload_str)
    pressure_psi = data.get('pressure', 0)
    if pressure_psi > 120:
        print(f"CRITICAL WARNING: Boiler pressure exceeds limit ({pressure_psi} PSI)!")
    return pressure_psi

process_sensor_packet('{"sensor_id": "P-101", "pressure": 134.5}')`
      }
    },
    {
      id: 'robotics',
      shortName: 'Robotics & Mechatronics',
      name: 'Robotics, Automation & Mechatronics',
      category: 'core_eng',
      icon: '🦾',
      color: '#8b5cf6',
      accentBg: 'rgba(139, 92, 246, 0.12)',
      welcomeTitle: '🦾 Welcome to Autonomous Robots, Drone Avionics & Cobots!',
      welcomeMessage: 'Mechatronics & Robotics engineers combine mechanical kinematics, electronics actuators, computer vision, and ROS 2 software to build autonomous mobile robots (AMRs), robotic arms, and drones.',
      difficulty: 'High in Multidisciplinary Code & Kinematics',
      placementDemand: '⭐⭐⭐⭐⭐ (Warehouse Robotics, Defence & Automotive: ₹7 - 32 LPA)',
      coreFocus: 'Robot Operating System (ROS 2), Kinematics & Dynamics, Computer Vision (OpenCV), SLAM Navigation, Motion Planning.',
      primaryLang: {
        name: 'C++ & Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'C++ is mandatory for high-speed ROS 2 nodes, trajectory calculation, and micro-controller drivers. Python is used for rapid computer vision and AI pathfinding.'
      },
      secondaryLang: {
        name: 'MATLAB / Simulink & C',
        badge: 'Essential for Simulation (2nd & 3rd Year)',
        reason: 'MATLAB simulates multi-body robotic arm physics and inverse kinematics before deploying to real physical hardware.'
      },
      domainTools: ['ROS 2 (Robot Operating System)', 'Gazebo / Webots (Physics Simulator)', 'OpenCV (Computer Vision)', 'SolidWorks CAD'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C/C++ basics, Arduino & ESP32 motor controls, Physics Kinematics, Python' },
        { year: '2nd Year (Sophomore)', focus: 'ROS 2 basics, Gazebo simulation, Forward/Inverse Kinematics, OpenCV Vision' },
        { year: '3rd Year (Junior)', focus: 'SLAM (Simultaneous Localization & Mapping), Autonomous Drone pathfinding, C++ DSA' },
        { year: '4th Year (Senior)', focus: 'Core Robotics Placements (Boston Dynamics, GreyOrange, Addverb, ISRO) OR SDE' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🦾 Core Robotics & Autonomous Systems Track',
        coreDescription: 'Focus on ROS 2 navigation, motor kinematics, and LIDAR computer vision.',
        transitionTitle: '💻 Autonomous Software SDE Transition',
        transitionDescription: 'Transitioning to Autonomous Driving and Systems Software:',
        steps: [
          'Master modern C++ (Smart Pointers, Multithreading, STL).',
          'Practice algorithmic Graph Algorithms (A*, Dijkstra, BFS) on LeetCode.',
          'Build an autonomous obstacle-avoidance simulation project.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Modern Robotics: Mechanics, Planning, and Control', provider: 'Northwestern University (Coursera)', tag: 'Gold Standard' },
          { name: 'ROS 2 Basics for C++ & Python', provider: 'ConstructSim / Udemy', tag: 'Hands-on ROS' }
        ],
        certifications: [
          { name: 'Certified ROS Developer (ROS 2)', issuer: 'Open Robotics / The Construct' },
          { name: 'NVIDIA Certified Associate: Jetson AI & Robotics', issuer: 'NVIDIA' }
        ]
      },
      topCompanies: ['GreyOrange', 'Addverb Technologies', 'Boston Dynamics', 'Tesla Bot', 'Fanuc', 'KUKA', 'ISRO Robotics'],
      codeSample: {
        title: 'C++ ROS 2 Node: Publishing Velocity Commands',
        language: 'cpp',
        code: `// C++ ROS 2 Publisher Node snippet
#include <iostream>

struct TwistMessage {
    double linear_x;
    double angular_z;
};

void publishVelocity(double forward_speed, double turn_rate) {
    TwistMessage msg = {forward_speed, turn_rate};
    std::cout << "Robot Moving Forward at: " << msg.linear_x << " m/s | Turning: " << msg.angular_z << " rad/s\\n";
}

int main() {
    publishVelocity(1.5, 0.2);
    return 0;
}`
      }
    },
    {
      id: 'mech',
      shortName: 'Mechanical',
      name: 'Mechanical Engineering',
      category: 'core_eng',
      icon: '⚙️',
      color: '#f97316',
      accentBg: 'rgba(249, 115, 22, 0.12)',
      welcomeTitle: '🦾 Welcome to Industry 4.0, Computational Design & Automation!',
      welcomeMessage: 'Modern Mechanical Engineering combines CAD scripting, computational fluid dynamics (CFD), FEA structural simulation, and automated manufacturing pipelines.',
      difficulty: 'Moderate in Coding (High in Physics, Thermal & Math)',
      placementDemand: '⭐⭐⭐⭐ (Automotive, Heavy Machinery, Aerospace & IT: ₹5.5 - 20 LPA)',
      coreFocus: 'CAD/CAM Automation, Finite Element Analysis (FEA), CFD Simulation, Thermodynamics, Mechatronics, CNC G-Code.',
      primaryLang: {
        name: 'Python & MATLAB',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python automates CAD designs (FreeCAD, SolidWorks macros) and handles data science. MATLAB is standard for vibration and dynamic simulations.'
      },
      secondaryLang: {
        name: 'C++ & C',
        badge: 'Recommended for Robotics (3rd Year)',
        reason: 'C++ powers Robot Operating System (ROS 2), CNC G-code automation, and real-time robotic arm trajectory control.'
      },
      domainTools: ['SolidWorks & CATIA', 'ANSYS Mechanical & Fluent', 'ROS 2 Robotics', 'G-Code & CNC'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Engineering Graphics, Math, Basic Mechanical Workshops' },
        { year: '2nd Year (Sophomore)', focus: 'CAD 3D Modeling, MATLAB Numerical Methods, Mechanics of Solids, C basics' },
        { year: '3rd Year (Junior)', focus: 'ANSYS FEA simulations, Python automated design optimization, ROS robotics' },
        { year: '4th Year (Senior)', focus: 'Core Placements (Boeing, Tata Motors, L&T, ISRO, Bosch) OR IT SDE switch' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '⚙️ Core Mechanical & Simulation Route',
        coreDescription: 'Excel in CAD automation, FEA simulation in ANSYS, and thermal engineering.',
        transitionTitle: '💻 Non-CS to Software Engineer Transition',
        transitionDescription: 'Over 40% of Mechanical grads succeed in high-paying IT roles:',
        steps: [
          'Choose Python or Java as your core programming language.',
          'Learn standard Object-Oriented Programming (OOP) and SQL Databases.',
          'Complete 150+ DSA problems on LeetCode / GeeksforGeeks.',
          'Build a Data Analysis or Web Application project to showcase on GitHub.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Introduction to Mechanical Engineering & CAD', provider: 'Autodesk (Coursera)', tag: 'Core CAD' },
          { name: 'Computational Fluid Dynamics (CFD)', provider: 'NPTEL (IIT Kharagpur)', tag: 'Simulation' }
        ],
        certifications: [
          { name: 'Certified SolidWorks Associate / Professional (CSWP)', issuer: 'Dassault Systèmes' },
          { name: 'ANSYS Certified FEA Associate', issuer: 'ANSYS' }
        ]
      },
      topCompanies: ['Boeing', 'Airbus', 'Tata Motors', 'Bosch', 'ISRO', 'Larsen & Toubro', 'Mahindra & Mahindra', 'Mercedes-Benz R&D'],
      codeSample: {
        title: 'Python: Calculating Young\'s Modulus from Tensile Test',
        language: 'python',
        code: `import numpy as np

force = np.array([0, 5000, 10000, 15000]) # Newtons
area = 50.0 # mm^2
elongation = np.array([0.0, 0.05, 0.10, 0.15]) # mm
orig_len = 100.0

stress = force / area
strain = elongation / orig_len
youngs_modulus_gpa = (stress[1] / strain[1]) / 1000.0
print(f"Calculated Young's Modulus: {youngs_modulus_gpa:.2f} GPa (Structural Steel)")`
      }
    },
    {
      id: 'auto',
      shortName: 'Automobile & EV',
      name: 'Automobile & Electric Vehicle (EV) Engineering',
      category: 'core_eng',
      icon: '🏎️',
      color: '#ef4444',
      accentBg: 'rgba(239, 68, 68, 0.12)',
      welcomeTitle: '🔋 Welcome to Electric Vehicles, Connected Cars & Autonomous ADAS!',
      welcomeMessage: 'Automotive engineers design EV battery management systems (BMS), electric motor powertrains, vehicle aerodynamics, and ADAS self-driving algorithms.',
      difficulty: 'Moderate-High (Powertrain Dynamics & Embedded Electronics)',
      placementDemand: '⭐⭐⭐⭐ (EV Revolution Boom: ₹6 - 24 LPA)',
      coreFocus: 'EV Battery Tech, CAN Bus Telemetry, Vehicle Dynamics (CarSim), ADAS Autonomous Driving, Motor Inverter Controls.',
      primaryLang: {
        name: 'C & MATLAB/Simulink',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'C is required for programming automotive Electronic Control Units (ECUs). MATLAB/Simulink models vehicle longitudinal dynamics and regenerative braking.'
      },
      secondaryLang: {
        name: 'Python & C++',
        badge: 'Recommended (2nd & 3rd Year)',
        reason: 'Python for CAN bus telemetry data logging and battery predictive maintenance. C++ for ADAS camera/radar sensor fusion.'
      },
      domainTools: ['MATLAB Simscape Driveline', 'CANalyzer / CANoe (Vector)', 'CarSim / IPG CarMaker', 'Ansys Fluent Aero'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C basics, Automotive Physics, CAD 3D modeling, Basic Electronics' },
        { year: '2nd Year (Sophomore)', focus: 'Vehicle Dynamics, MATLAB Simulation, Power Electronics in EVs' },
        { year: '3rd Year (Junior)', focus: 'CAN Bus Protocol, BMS Algorithm design, ADAS Computer Vision' },
        { year: '4th Year (Senior)', focus: 'Core Automotive Placements (Tata Motors, Tesla, Ola Electric, Bosch) OR IT' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🏎️ Core EV & Powertrain Engineering Route',
        coreDescription: 'Focus on BMS algorithms, inverter tuning, and vehicle testing.',
        transitionTitle: '💻 Autonomous Vehicle Software Transition',
        transitionDescription: 'Transitioning to Autonomous Vehicle & Telematics software:',
        steps: [
          'Learn C++ and Linux CAN networking.',
          'Build an EV battery health monitoring web dashboard with Python and React.',
          'Prepare DSA for mobility tech companies (Uber, Ola, Ather).'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Self-Driving Cars Specialization', provider: 'University of Toronto (Coursera)', tag: 'ADAS & Autonomy' },
          { name: 'Electric Vehicles Powertrain Design', provider: 'NPTEL (IIT Madras)', tag: 'EV Core' }
        ],
        certifications: [
          { name: 'Vector Certified CANoe & CANalyzer Specialist', issuer: 'Vector Informatik' },
          { name: 'ASQ Certified Automotive Quality Engineer', issuer: 'ASQ' }
        ]
      },
      topCompanies: ['Tata Motors EV', 'Tesla', 'Ola Electric', 'Ather Energy', 'Bosch Automotive', 'Mahindra Electric', 'Maruti Suzuki R&D'],
      codeSample: {
        title: 'Python: CAN Bus Telemetry Packet Decoder',
        language: 'python',
        code: `def decode_ev_battery_can(hex_payload):
    # Simulated CAN packet: Byte 0-1 (Voltage), Byte 2-3 (Current)
    raw_volts = int(hex_payload[0:4], 16) * 0.1
    raw_amps = int(hex_payload[4:8], 16) * 0.1
    power_kw = (raw_volts * raw_amps) / 1000.0
    return {"PackVoltage": raw_volts, "PackCurrent": raw_amps, "PowerKW": power_kw}

print(decode_ev_battery_can("0E1000C8")) # 360.0V, 20.0A`
      }
    },
    {
      id: 'aero',
      shortName: 'Aerospace',
      name: 'Aerospace & Aeronautical Engineering',
      category: 'specialized',
      icon: '🚀',
      color: '#38bdf8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      welcomeTitle: '🛰️ Welcome to Supersonic Aerodynamics, Orbital Dynamics & SpaceTech!',
      welcomeMessage: 'Aerospace engineers develop satellite orbits, rocket propulsion systems, supersonic aircraft, autonomous flight control autopilots, and space telescopes.',
      difficulty: 'High in Fluid Dynamics, Flight Mechanics & Physics',
      placementDemand: '⭐⭐⭐⭐ (SpaceTech Boom, Defense & Simulation Tech: ₹7 - 28 LPA)',
      coreFocus: 'Aerodynamics, Flight Dynamics & Control, Orbital Trajectories, Propulsion, CFD (ANSYS Fluent / OpenFOAM), Avionics (NASA cFS).',
      primaryLang: {
        name: 'Python & MATLAB/Simulink',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'MATLAB/Simulink is mandatory for autopilot control systems and attitude dynamics. Python optimizes launch trajectories and CFD post-processing.'
      },
      secondaryLang: {
        name: 'C++ & Fortran / C',
        badge: 'Essential for Avionics & High-Speed CFD (2nd & 3rd Year)',
        reason: 'C++ powers NASA core flight software (cFS) and real-time avionics autopilot computers. Fortran/C still powers heavy aerodynamic solvers.'
      },
      domainTools: ['MATLAB Aerospace Blockset', 'ANSYS Fluent / OpenFOAM', 'NASA cFS & ROS 2', 'CATIA Aerospace'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Physics of Flight, Engineering Mechanics, CAD 3D modeling' },
        { year: '2nd Year (Sophomore)', focus: 'MATLAB Flight Control, Fluid Mechanics, Aerodynamics calculations, C basics' },
        { year: '3rd Year (Junior)', focus: 'ANSYS Fluent CFD simulations, Autopilot control tuning, Orbital mechanics' },
        { year: '4th Year (Senior)', focus: 'Core SpaceTech Placements (ISRO, DRDO, Boeing, Airbus, Skyroot) OR SDE' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🚀 Core Aerospace & SpaceTech Route',
        coreDescription: 'Focus on Flight Control Systems, Aerodynamics with OpenFOAM, and Avionics.',
        transitionTitle: '💻 Autonomous Flight Software SDE Transition',
        transitionDescription: 'High demand in Drone Software, Robotics, and Simulation:',
        steps: [
          'Master C++ and ROS 2 for Drone autonomous pathfinding.',
          'Learn Computer Vision (OpenCV) for aerial target detection.',
          'Prepare DSA for general software engineering interviews.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Introduction to Aerodynamics', provider: 'MIT (edX)', tag: 'Core Aero' },
          { name: 'Flight Dynamics and Controls', provider: 'NPTEL (IIT Kanpur)', tag: 'SpaceTech' }
        ],
        certifications: [
          { name: 'MathWorks Certified Aerospace & Control Systems Associate', issuer: 'MathWorks' },
          { name: 'CATIA Certified Aerospace Structural Specialist', issuer: 'Dassault Systèmes' }
        ]
      },
      topCompanies: ['ISRO', 'DRDO', 'Boeing', 'Airbus', 'Skyroot Aerospace', 'Agnikul Cosmos', 'Lockheed Martin', 'HAL'],
      codeSample: {
        title: 'Python: Orbital Speed & Escape Velocity Calculation',
        language: 'python',
        code: `import math

G = 6.67430e-11; M_earth = 5.972e24; R_earth = 6371000
altitude = 400000 # 400 km ISS orbit
r = R_earth + altitude
v_orbital = math.sqrt((G * M_earth) / r)
print(f"ISS Orbital Velocity: {v_orbital / 1000.0:.2f} km/s (~27,600 km/h)")`
      }
    },
    {
      id: 'civil',
      shortName: 'Civil & Infra',
      name: 'Civil & Structural Engineering (BIM & GIS)',
      category: 'specialized',
      icon: '🏗️',
      color: '#84cc16',
      accentBg: 'rgba(132, 204, 22, 0.12)',
      welcomeTitle: '🌍 Welcome to Smart Infrastructure, BIM Modeling & Web-GIS!',
      welcomeMessage: 'Modern Civil Engineers design sustainable skyscrapers, smart transportation networks, and geospatial systems using BIM, GIS mapping, and Python structural automation.',
      difficulty: 'Low-Moderate in Coding (Math & Spatial Analysis)',
      placementDemand: '⭐⭐⭐ (Government Infrastructure, Smart Cities, BIM & IT: ₹5 - 18 LPA)',
      coreFocus: 'Building Information Modeling (BIM), GIS Spatial Analytics, Structural Analysis (STAAD Pro), Geotechnical Engineering, Smart Transport.',
      primaryLang: {
        name: 'Python & SQL',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python automates Revit/AutoCAD designs (Dynamo scripting), structural calculations, and analyzes Geographic Information Systems (GIS) data.'
      },
      secondaryLang: {
        name: 'JavaScript (Web-GIS)',
        badge: 'Recommended (3rd Year)',
        reason: 'JavaScript (Leaflet.js, Mapbox, Cesium 3D) powers Interactive Web-GIS maps for municipal smart city dashboards and traffic monitoring.'
      },
      domainTools: ['Autodesk AutoCAD & Revit', 'STAAD.Pro / ETABS', 'QGIS / ArcGIS', 'Dynamo Python for BIM'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'AutoCAD Basics, Python fundamentals, Surveying, Engineering Mechanics' },
        { year: '2nd Year (Sophomore)', focus: 'STAAD.Pro structural modeling, Concrete Technology, GIS basics in QGIS' },
        { year: '3rd Year (Junior)', focus: 'Revit BIM Modeling + Dynamo Python automation, Geotechnical analysis' },
        { year: '4th Year (Senior)', focus: 'Core Placements (L&T, Shapoorji, NHAI) OR Web-GIS / IT Software jobs' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🏗️ Core Civil, BIM & Smart Infrastructure Route',
        coreDescription: 'Specialize in BIM Modeling (Revit), Structural Analysis (ETABS), and Geospatial Tech.',
        transitionTitle: '💻 Non-CS to IT & Geospatial Data Analytics Route',
        transitionDescription: 'Transitioning to Data Analytics, GIS Software, or General IT:',
        steps: [
          'Master Python libraries (Pandas, GeoPandas) and SQL for relational data queries.',
          'Learn Web-GIS with JavaScript (Mapbox API) for city planning dashboards.',
          'Prepare DSA in Python or Java for IT recruitment drives.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'BIM Fundamentals for Engineers', provider: 'National Taiwan University (Coursera)', tag: 'Core BIM' },
          { name: 'Geographic Information Systems (GIS) Specialization', provider: 'UC Davis (Coursera)', tag: 'GIS Analytics' }
        ],
        certifications: [
          { name: 'Autodesk Certified Professional: Revit for Structural Design', issuer: 'Autodesk' },
          { name: 'Bentley STAAD.Pro Certified Professional', issuer: 'Bentley Systems' }
        ]
      },
      topCompanies: ['Larsen & Toubro (L&T ECC)', 'Shapoorji Pallonji', 'Tata Projects', 'AECOM', 'Atkins', 'Jacobs', 'Arcadis'],
      codeSample: {
        title: 'Python: Flood Elevation Risk Analyzer for Smart City',
        language: 'python',
        code: `elevations = {"Plot_A": 12.5, "Plot_B": 4.2, "Plot_C": 8.1}
FLOOD_THRESHOLD = 5.0
for p, elev in elevations.items():
    status = "⚠️ FLOOD RISK" if elev < FLOOD_THRESHOLD else "✅ SAFE"
    print(f"{p} ({elev}m): {status}")`
      }
    },
    {
      id: 'biotech',
      shortName: 'Biotech & Biomedical',
      name: 'Biotechnology & Biomedical Engineering',
      category: 'specialized',
      icon: '🧬',
      color: '#a855f7',
      accentBg: 'rgba(168, 85, 247, 0.12)',
      welcomeTitle: '🧪 Welcome to Bioinformatics, Genomic Data Science & AlphaFold!',
      welcomeMessage: 'Biotech and Biomedical engineers use computational biology, protein 3D folding simulations (AlphaFold), DNA sequence analysis, and medical imaging to design targeted therapies and medical devices.',
      difficulty: 'Low-Moderate in Coding (Biology/Genetics + Data Science)',
      placementDemand: '⭐⭐⭐⭐ (Pharma Giants, BioTech R&D, HealthTech & IT: ₹6 - 22 LPA)',
      coreFocus: 'Bioinformatics, Genomics Data Science, Molecular Dynamics (PyMOL), Next-Gen Sequencing (NGS), Biomedical Device Electronics.',
      primaryLang: {
        name: 'Python & R',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python (Biopython, RDKit) and R (Bioconductor) are the worldwide standards for DNA sequence analysis, drug discovery, and clinical trial statistics.'
      },
      secondaryLang: {
        name: 'C++ or MATLAB',
        badge: 'Recommended (3rd Year)',
        reason: 'C++ for high-performance molecular dynamics simulations (GROMACS). MATLAB for biomedical ECG/EEG signal processing.'
      },
      domainTools: ['Biopython & RDKit', 'PyMOL & ChimeraX', 'NCBI BLAST & GROMACS', 'R Bioconductor'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Programming, Organic Chemistry / Cell Biology, Math, Biopython basics' },
        { year: '2nd Year (Sophomore)', focus: 'Bioinformatics algorithms, R programming, Genomic sequencing methods' },
        { year: '3rd Year (Junior)', focus: 'Molecular docking simulations (PyMOL), Machine Learning for Drug Discovery' },
        { year: '4th Year (Senior)', focus: 'Core Pharma/Biotech Placements (Biocon, Pfizer, Dr. Reddy\'s) OR HealthTech IT' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🧪 Core Biotech, Genomics & Pharma Track',
        coreDescription: 'Specialize in Drug Discovery, Genomics Data Science, or Bio-Instrumentation.',
        transitionTitle: '💻 Non-CS to Data Science & HealthTech IT',
        transitionDescription: 'Strong statistical background makes transitioning to Data Science natural:',
        steps: [
          'Master Python libraries (Pandas, Scikit-Learn) for predictive analytics.',
          'Learn SQL to manage large healthcare and clinical trial datasets.',
          'Target HealthTech and Life Sciences software companies (IQVIA, Optum, Cerner).'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Bioinformatics Specialization (Genomic Data Science)', provider: 'UC San Diego (Coursera)', tag: 'Core Bioinformatics' },
          { name: 'Computational Systems Biology', provider: 'NPTEL (IIT Madras)', tag: 'Systems Biology' }
        ],
        certifications: [
          { name: 'Bioinformatics Certified Associate', issuer: 'ISCB' },
          { name: 'Certified Genomics Data Analyst', issuer: 'BioMed Informatics' }
        ]
      },
      topCompanies: ['Biocon', 'Dr. Reddy\'s Laboratories', 'Pfizer', 'Novartis', 'Serum Institute', 'IQVIA', 'Schrödinger', 'Optum Health'],
      codeSample: {
        title: 'Python: DNA Sequence GC-Content & RNA Transcription',
        language: 'python',
        code: `def analyze_dna(seq):
    seq = seq.upper()
    gc = (seq.count('G') + seq.count('C')) / len(seq) * 100.0
    return gc, seq.replace('T', 'U')

gc_pct, rna = analyze_dna("ATGCGATCGATCGATATAGCGATAGCTAG")
print(f"GC-Content: {gc_pct:.1f}% | Transcribed RNA: {rna}")`
      }
    },
    {
      id: 'chemical',
      shortName: 'Chemical & Petroleum',
      name: 'Chemical & Petroleum Engineering',
      category: 'specialized',
      icon: '🧪',
      color: '#f43f5e',
      accentBg: 'rgba(244, 63, 94, 0.12)',
      welcomeTitle: '⚗️ Welcome to Chemical Process Simulation, Energy & Green Hydrogen!',
      welcomeMessage: 'Chemical engineers design sustainable mega-refineries, green hydrogen plants, battery chemistries, and drug manufacturing systems using Aspen Plus and Python process optimization.',
      difficulty: 'Moderate in Coding (High in Thermodynamics & Mass Transfer)',
      placementDemand: '⭐⭐⭐⭐ (Oil & Gas, Energy, Petrochem & IT: ₹6 - 22 LPA)',
      coreFocus: 'Process Simulation (Aspen Plus), Reaction Kinetics, Heat & Mass Transfer, Plant Automation, Green Energy / Carbon Capture.',
      primaryLang: {
        name: 'Python & MATLAB',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python automates chemical reactor mass balances and Aspen simulations. MATLAB solves differential equations for reaction kinetics.'
      },
      secondaryLang: {
        name: 'C++ or SQL',
        badge: 'Recommended (3rd Year)',
        reason: 'SQL for refinery telemetry databases. C++ for high-performance computational chemistry and fluid dynamics.'
      },
      domainTools: ['Aspen Plus / Aspen HYSYS', 'MATLAB Chemical Toolbox', 'DWSIM (Open Source Chem Sim)', 'Ansys Fluent CFD'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Chemistry, Fluid Flow, Thermodynamics fundamentals' },
        { year: '2nd Year (Sophomore)', focus: 'Mass Transfer, Heat Transfer, MATLAB Reaction kinetics simulation' },
        { year: '3rd Year (Junior)', focus: 'Aspen Plus Chemical Plant Simulation, Distillation Column Design, Python optimization' },
        { year: '4th Year (Senior)', focus: 'Core Energy Placements (Reliance, Shell, ONGC, ExxonMobil) OR Tech switch' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '⚗️ Core Process Simulation & Refinery Route',
        coreDescription: 'Focus on Aspen HYSYS design, reactor scale-up, and refinery operations.',
        transitionTitle: '💻 Energy Tech & Data Analytics Transition',
        transitionDescription: 'Strong numerical modeling skills allow easy transition to Tech:',
        steps: [
          'Master Python for data analytics and predictive process control.',
          'Learn SQL and Tableau for energy supply-chain optimization.',
          'Prepare DSA in Python or Java for software engineering drives.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Aspen Plus Chemical Engineering Plant Design', provider: 'Udemy / AspenTech', tag: 'Process Simulation' },
          { name: 'Chemical Reaction Engineering', provider: 'NPTEL (IIT Bombay)', tag: 'Core Theory' }
        ],
        certifications: [
          { name: 'Certified Aspen Plus Chemical Process Engineer', issuer: 'AspenTech' },
          { name: 'AIChE Process Safety Certification', issuer: 'American Institute of Chemical Engineers' }
        ]
      },
      topCompanies: ['Reliance Industries', 'Shell', 'ONGC', 'ExxonMobil', 'Schlumberger (SLB)', 'Indian Oil (IOCL)', 'BASF', 'Linde'],
      codeSample: {
        title: 'Python: First-Order Reaction Kinetics Concentration Decay',
        language: 'python',
        code: `import numpy as np

k = 0.05 # Rate constant (1/min)
C0 = 10.0 # Initial concentration (mol/L)
time_mins = np.array([0, 10, 20, 30, 60])
C_t = C0 * np.exp(-k * time_mins)

print("=== REACTION CONCENTRATION OVER TIME ===")
for t, c in zip(time_mins, C_t):
    print(f"Time: {t:2d} min -> Concentration: {c:.2f} mol/L")`
      }
    },
    {
      id: 'metallurgy',
      shortName: 'Materials & Metallurgy',
      name: 'Materials Science & Metallurgy Engineering',
      category: 'specialized',
      icon: '⛏️',
      color: '#eab308',
      accentBg: 'rgba(234, 179, 8, 0.12)',
      welcomeTitle: '🔬 Welcome to Superalloys, Nanomaterials & Semiconductor Materials!',
      welcomeMessage: 'Materials engineers develop high-temperature turbine alloys, lithium-ion battery electrodes, silicon crystal wafers for chip manufacturing, and carbon-fiber composites.',
      difficulty: 'Low-Moderate in Coding (High in Physics & Metallurgy)',
      placementDemand: '⭐⭐⭐⭐ (Steel Giants, Semiconductor Fabs, EV Battery & IT: ₹5.5 - 20 LPA)',
      coreFocus: 'Crystallography, Semiconductor Silicon Materials, Phase Diagrams (Thermo-Calc), Nanomaterials, Corrosion & Failure Analysis.',
      primaryLang: {
        name: 'Python & MATLAB',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python (pymatgen, ASE - Atomic Simulation Environment) analyzes crystal lattices and materials property databases. MATLAB models phase equilibria.'
      },
      secondaryLang: {
        name: 'C++ or SQL',
        badge: 'Recommended (3rd Year)',
        reason: 'C++ for molecular dynamics atomistic modeling (LAMMPS). SQL for quality inspection databases in steel and semiconductor plants.'
      },
      domainTools: ['Thermo-Calc & DICTRA', 'pymatgen (Python Materials Gen)', 'VASP & LAMMPS', 'ImageJ (Microstructure)'],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Chemistry, Physics of Solids, Engineering Math' },
        { year: '2nd Year (Sophomore)', focus: 'Physical Metallurgy, Crystal Structures, Python pymatgen basics' },
        { year: '3rd Year (Junior)', focus: 'Thermo-Calc simulation, Semiconductor materials, Failure analysis' },
        { year: '4th Year (Senior)', focus: 'Core Placements (Tata Steel, JSW, Applied Materials, ISRO) OR IT SDE' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🔬 Core Metallurgy, Semiconductor Fabs & Steel Track',
        coreDescription: 'Focus on alloy design, semiconductor silicon purification, and failure analysis.',
        transitionTitle: '💻 Materials Informatics & Tech SDE Transition',
        transitionDescription: 'Transitioning to Data Science / Materials Informatics:',
        steps: [
          'Learn Machine Learning with Python to predict materials properties.',
          'Master SQL databases and Tableau for supply chain analytics.',
          'Practice standard LeetCode DSA for software placements.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Materials Science: 10 Things Every Engineer Should Know', provider: 'UC Davis (Coursera)', tag: 'Materials Core' },
          { name: 'Computational Materials Science', provider: 'NPTEL (IIT Madras)', tag: 'Simulation' }
        ],
        certifications: [
          { name: 'Certified Materials Characterization Specialist', issuer: 'ASM International' },
          { name: 'Six Sigma Green Belt in Manufacturing', issuer: 'ASQ' }
        ]
      },
      topCompanies: ['Tata Steel', 'JSW Steel', 'Applied Materials', 'Vedanta', 'ISRO Materials Division', 'ArcelorMittal', 'Corning'],
      codeSample: {
        title: 'Python: Calculating Theoretical Density of FCC Crystal Lattice',
        language: 'python',
        code: `def calc_fcc_density(atomic_weight_g_mol, lattice_param_angstrom):
    N_A = 6.022e23
    num_atoms = 4 # 4 atoms per FCC unit cell
    volume_cm3 = (lattice_param_angstrom * 1e-8) ** 3
    density = (num_atoms * atomic_weight_g_mol) / (volume_cm3 * N_A)
    return density

cu_density = calc_fcc_density(63.55, 3.615)
print(f"Theoretical Density of Copper (FCC): {cu_density:.2f} g/cm^3")`
      }
    }
  ];

  // Filtered list based on selected category
  const filteredBranches = branchData.filter(b => activeCategory === 'all' || b.category === activeCategory);
  const currentBranch = branchData.find(b => b.id === selectedBranch) || branchData[0];

  // Supercharged Year-Specific Smart Advisor Quiz Calculation
  const handleRunAdvisor = () => {
    const branchInfo = branchData.find(b => b.id === quizBranch) || branchData[0];
    
    let recommendedPrimary = 'Python';
    let recommendedSecondary = 'C++';
    let yearGoalTitle = '';
    let immediateAction = '';
    let milestones30_60_90 = [];
    let projects = [];
    let avoidMistake = '';
    let salaryRange = '₹8 - 25 LPA';

    const isCSBranch = ['cse', 'it', 'aiml', 'ds', 'cyber'].includes(quizBranch);

    if (quizGoal === 'sde') {
      recommendedPrimary = isCSBranch ? 'C++ or Java (for DSA)' : 'C++ (DSA & Problem Solving)';
      recommendedSecondary = 'JavaScript / TypeScript (Full-Stack Web)';
      salaryRange = '₹10 - 45 LPA (Product / FAANG / Fintech)';
      
      if (quizYear === '1') {
        yearGoalTitle = '🎯 1st Year (Freshman): Build Core Logic & Programming Habits';
        immediateAction = 'Do not jump straight into complex frameworks. Master syntax in C/C++, solve 50 beginner logic questions, learn Git & GitHub, and keep college CGPA above 8.0.';
        milestones30_60_90 = [
          'Day 1-30: Master C/C++ loops, arrays, functions, and pointers fundamentals.',
          'Day 31-60: Learn Git, create a GitHub profile, push 5 mini CLI projects.',
          'Day 61-90: Solve first 50 Easy problems on LeetCode/HackerRank in C++.'
        ];
        projects = ['CLI Student Record Management System', 'Text-Based Tic-Tac-Toe Game with AI Minimax', 'Personal Portfolio Webpage'];
        avoidMistake = 'Do not get stuck in "tutorial hell" watching endless YouTube videos without typing code yourself daily.';
      } else if (quizYear === '2') {
        yearGoalTitle = '🎯 2nd Year (Sophomore): Master DSA & Core CS Subjects';
        immediateAction = 'This is the most critical year! Master Data Structures (Linked Lists, Trees, Graphs, DP) in C++ STL or Java Collections. Learn DBMS & SQL.';
        milestones30_60_90 = [
          'Day 1-30: Complete Arrays, Strings, HashMaps, and Two-Pointer problems on LeetCode.',
          'Day 31-60: Master Recursion, Binary Trees, BFS/DFS Graphs, and SQL relational queries.',
          'Day 61-90: Build your first Full-Stack Web application with React and Node.js.'
        ];
        projects = ['Full-Stack E-Commerce Store with Stripe Payments', 'DSA Visualizer / Pathfinding Tool in React', 'Social Network REST API with JWT Auth'];
        avoidMistake = 'Do not ignore core subjects (Operating Systems & DBMS) — top companies test them in technical interview rounds.';
      } else if (quizYear === '3') {
        yearGoalTitle = '🎯 3rd Year (Junior): Projects, Open-Source & Internship Crack';
        immediateAction = 'Grind the LeetCode Blind 75 list, build 2 production-grade projects with real user auth and databases, and apply aggressively for summer internships.';
        milestones30_60_90 = [
          'Day 1-30: Solve 80+ Medium LeetCode questions (Dynamic Programming, Graphs, Heaps).',
          'Day 31-60: Build a full production-grade SaaS project with Docker and Cloud deployment.',
          'Day 61-90: Create a tailored single-page LaTeX resume and apply to 100+ internship openings.'
        ];
        projects = ['Real-Time Collaborative Code Editor with WebSockets', 'Cloud File Storage Service with AWS S3', 'High-Concurrency Redis Caching Microservice'];
        avoidMistake = 'Do not wait until final year to make your resume. Apply for 3rd-year internships early in July-September.';
      } else {
        yearGoalTitle = '🎯 4th Year (Senior): High-Speed Placement Grinding & System Design';
        immediateAction = 'Focus 100% on cracking interviews: solve Top 150 Interview Questions on LeetCode, practice Low-Level (LLD) & High-Level (HLD) System Design, and do daily mock interviews.';
        milestones30_60_90 = [
          'Day 1-30: Revise Blind 75 DSA questions with strict 25-minute timers.',
          'Day 31-60: Study System Design (Scalability, Sharding, Load Balancers, Caching).',
          'Day 61-90: Give 10+ Mock Interviews on Pramp/Interviewing.io and attend placement drives.'
        ];
        projects = ['Distributed Message Queue / Pub-Sub Engine', 'URL Shortener with 10M QPS System Architecture', 'Microservices API Gateway with Docker/K8s'];
        avoidMistake = 'Do not panic if you get rejected in initial rounds. Consistency across 15-20 company drives guarantees a great offer.';
      }
    } else if (quizGoal === 'ai_ds') {
      recommendedPrimary = 'Python (NumPy, Pandas, PyTorch)';
      recommendedSecondary = 'SQL & C++ (for TensorRT Inference)';
      salaryRange = '₹10 - 40 LPA (AI Labs, Global Product R&D)';
      
      if (quizYear === '1') {
        yearGoalTitle = '🎯 1st Year (Freshman): Python & Mathematical Foundations';
        immediateAction = 'Master Python syntax and build strong mathematical intuition in Linear Algebra (Matrices, Eigenvalues), Calculus, and Probability.';
        milestones30_60_90 = [
          'Day 1-30: Master Python data structures (Lists, Dicts, Tuples, Sets, Functions).',
          'Day 31-60: Complete 3Blue1Brown Essence of Linear Algebra series on YouTube.',
          'Day 61-90: Start analyzing datasets with Pandas & Matplotlib.'
        ];
        projects = ['Automated Web Scraper with BeautifulSoup', 'Exploratory Data Analysis on COVID / Titanic Dataset', 'Statistical Weather Analyzer'];
        avoidMistake = 'Do not skip math! Deep learning models cannot be debugged without linear algebra intuition.';
      } else if (quizYear === '2') {
        yearGoalTitle = '🎯 2nd Year (Sophomore): Classical ML & First Kaggle Contests';
        immediateAction = 'Complete Andrew Ng Machine Learning Specialization, master Scikit-Learn algorithms (Regression, Decision Trees, SVM, Random Forests), and learn SQL.';
        milestones30_60_90 = [
          'Day 1-30: Implement Regression and Classification models from scratch in Scikit-Learn.',
          'Day 31-60: Learn SQL queries (JOINs, Window Functions) and Kaggle data pipelines.',
          'Day 61-90: Compete in 2 Kaggle Beginner Competitions (House Prices, Spaceship Titanic).'
        ];
        projects = ['Customer Churn Prediction with Random Forests', 'Credit Card Fraud Detection with Anomaly Detection', 'House Price Prediction with XGBoost'];
        avoidMistake = 'Do not jump to Neural Networks before mastering Feature Engineering and Scikit-Learn.';
      } else if (quizYear === '3') {
        yearGoalTitle = '🎯 3rd Year (Junior): Deep Learning, PyTorch & LLM RAG Pipelines';
        immediateAction = 'Master PyTorch for Deep Learning (CNNs, RNNs, Transformers) and build Generative AI applications with LangChain, Vector DBs, and Hugging Face.';
        milestones30_60_90 = [
          'Day 1-30: Train Computer Vision models with PyTorch & Transfer Learning.',
          'Day 31-60: Build a RAG (Retrieval-Augmented Generation) pipeline with LangChain.',
          'Day 61-90: Deploy your AI models as REST APIs using FastAPI and Docker.'
        ];
        projects = ['Document Q&A RAG Chatbot with LangChain & Pinecone', 'Medical Image X-Ray Classification with PyTorch CNN', 'Autonomous Self-Driving Car Lane Tracker'];
        avoidMistake = 'Do not leave your models in Jupyter Notebooks. Wrap them in a live FastAPI web app and deploy them.';
      } else {
        yearGoalTitle = '🎯 4th Year (Senior): MLOps, LLM Fine-Tuning & AI Placements';
        immediateAction = 'Focus on MLOps pipelines (Docker, MLflow, ONNX), model quantization, fine-tuning open-source LLMs (Llama 3), and clearing AI technical rounds.';
        milestones30_60_90 = [
          'Day 1-30: Fine-tune an open-source LLM using LoRA / QLoRA.',
          'Day 31-60: Build an automated ML CI/CD training pipeline with MLflow.',
          'Day 61-90: Prepare ML System Design interviews (Recommendation Systems, Search Ranking).'
        ];
        projects = ['End-to-End Enterprise RAG Agent with Multi-Agent Workflows', 'Real-Time Edge Computer Vision with TensorRT', 'Full MLOps Pipeline with Automated Model Drift Monitoring'];
        avoidMistake = 'Make sure you can explain the exact loss functions, gradients, and trade-offs of all models on your resume.';
      }
    } else if (quizGoal === 'core') {
      recommendedPrimary = branchInfo.primaryLang.name;
      recommendedSecondary = branchInfo.secondaryLang.name;
      salaryRange = '₹6 - 22 LPA (Semiconductor, Automotive, EV, Aerospace R&D)';
      
      yearGoalTitle = `🎯 Year ${quizYear} Core Engineering Action Plan for ${branchInfo.name.split('(')[0]}`;
      if (quizYear === '1' || quizYear === '2') {
        immediateAction = `Master ${branchInfo.primaryLang.name} and get hands-on experience with ${branchInfo.domainTools[0]}. Maintain strong foundational core subject grades.`;
        milestones30_60_90 = [
          `Day 1-30: Master ${branchInfo.primaryLang.name} and fundamental engineering math.`,
          `Day 31-60: Learn simulation modeling using ${branchInfo.domainTools[0]}.`,
          `Day 61-90: Build your first mini hardware prototype or domain simulation project.`
        ];
      } else {
        immediateAction = `Build 2 high-impact domain projects using ${branchInfo.domainTools.slice(0, 2).join(' and ')}, learn standard DSA in C++ for backup IT eligibility, and target core placement drives.`;
        milestones30_60_90 = [
          `Day 1-30: Complete an advanced design simulation in ${branchInfo.domainTools[0]}.`,
          `Day 31-60: Prepare standard DSA in C++ to qualify for high-paying product tech rounds.`,
          `Day 61-90: Connect with alumni on LinkedIn working in ${branchInfo.topCompanies.slice(0, 3).join(', ')}.`
        ];
      }
      projects = [`Domain Project for ${branchInfo.name.split('(')[0]}`, `Automated Simulation Pipeline in ${branchInfo.domainTools[0]}`, 'Industrial Sensor & Data Logging System'];
      avoidMistake = 'Do not neglect software tools! Modern core engineering is 70% software simulation, automation, and data.';
    } else if (quizGoal === 'cyber') {
      recommendedPrimary = 'Python & Linux Bash';
      recommendedSecondary = 'C & C++ / Go';
      salaryRange = '₹8 - 30 LPA (Cyber Security, Red Team & SOC)';
      
      yearGoalTitle = `🎯 Year ${quizYear} Cyber Security & Ethical Hacking Track`;
      immediateAction = 'Master Linux terminal navigation, TCP/IP network packet analysis with Wireshark, and solve hands-on CTF challenges on TryHackMe.';
      milestones30_60_90 = [
        'Day 1-30: Master Linux command line and complete TryHackMe "Pre-Security" path.',
        'Day 31-60: Learn Web Security (OWASP Top 10) with Burp Suite.',
        'Day 61-90: Write automated custom port scanners and exploit scripts in Python.'
      ];
      projects = ['Automated Vulnerability & Port Scanner in Python', 'Packet Sniffer & Intrusion Detection Tool with Scapy', 'Secure Password Vault with AES-256 Encryption'];
      avoidMistake = 'Never hack real-world systems without authorization. Stick to legal practice platforms like TryHackMe and Hack The Box.';
    } else { // higher studies
      recommendedPrimary = 'Python & C/C++';
      recommendedSecondary = 'MATLAB';
      salaryRange = '₹12 - 35 LPA post-MS / M.Tech Research Stipend';
      
      yearGoalTitle = `🎯 Year ${quizYear} GATE / GRE / M.Tech Research Roadmap`;
      immediateAction = 'Focus heavily on Engineering Mathematics, core branch theoretical concepts, standard textbook problem solving, and GATE mock test series.';
      milestones30_60_90 = [
        'Day 1-30: Complete Engineering Mathematics and General Aptitude syllabus.',
        'Day 31-60: Finish 2 major core branch technical subjects with past 15-year GATE questions.',
        'Day 61-90: Join a national GATE/GRE test series and give weekly topic-wise tests.'
      ];
      projects = ['Research Paper Implementation Project in Python', 'Numerical Analysis Computational Solver', 'Algorithm Benchmark & Complexity Analyzer'];
      avoidMistake = 'Do not leave previous year questions (PYQs) for the last month. Solve them continuously from Year 2.';
    }

    setQuizResult({
      branchName: branchInfo.name,
      recommendedPrimary,
      recommendedSecondary,
      yearGoalTitle,
      immediateAction,
      milestones30_60_90,
      projects,
      avoidMistake,
      salaryRange,
      topCert: branchInfo.moocsAndCerts.certifications[0]?.name || 'AWS Certified Solutions Architect',
      topMooc: branchInfo.moocsAndCerts.moocs[0]?.name || 'CS50x Harvard University'
    });
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '18px',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      
      {/* ── Main Module Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderRadius: '14px',
        padding: '22px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🎓</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
              🎓 B.Tech Engineering Branch Roadmaps (16 Branches & Smart Advisor)
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.5' }}>
              Explore comprehensive 4-year coding roadmaps, primary & secondary programming languages, and core vs. IT placement transition guides for all engineering branches!
            </p>
            {/* General College / Curriculum Advisory Note */}
            <div style={{
              marginTop: '10px',
              padding: '8px 12px',
              background: 'rgba(56, 189, 248, 0.08)',
              borderLeft: '3px solid #38bdf8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '15px' }}>💡</span>
              <span style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                <strong style={{ color: '#38bdf8' }}>Curriculum Note:</strong> Primary programming languages (such as C, C++, Java, or Python) taught in 1st & 2nd year may vary depending on your college or university syllabus and department specializations.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filter Bar ── */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginRight: '4px' }}>FILTER:</span>
        {categories.map(c => {
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: isActive ? '1.5px solid #38bdf8' : '1px solid #334155',
                background: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* ── Horizontal Branch Selector Buttons Grid (16 Branches) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '10px'
      }}>
        {filteredBranches.map(b => {
          const isSelected = selectedBranch === b.id;
          const isHovered = hoveredBranchId === b.id;
          return (
            <div
              key={b.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredBranchId(b.id)}
              onMouseLeave={() => setHoveredBranchId(null)}
            >
              <button
                onClick={() => setSelectedBranch(b.id)}
                title={`${b.name} - Click to explore full 4-year roadmap`}
                style={{
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: isHovered ? '12px 14px' : '11px 13px',
                  borderRadius: '12px',
                  border: isSelected
                    ? `2px solid ${b.color}`
                    : isHovered
                    ? `2px solid ${b.color}`
                    : '1px solid #334155',
                  background: isSelected
                    ? `linear-gradient(135deg, ${b.accentBg} 0%, rgba(15, 23, 42, 0.95) 100%)`
                    : isHovered
                    ? `linear-gradient(135deg, ${b.accentBg} 0%, rgba(15, 23, 42, 0.95) 100%)`
                    : '#0f172a',
                  color: isSelected || isHovered ? '#f8fafc' : '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isHovered ? 'translateY(-3px) scale(1.03)' : isSelected ? 'scale(1.01)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered
                    ? `0 0 30px ${b.color}95, 0 8px 24px rgba(0,0,0,0.6), inset 0 0 16px ${b.color}35`
                    : isSelected
                    ? `0 0 16px ${b.color}40, inset 0 0 8px ${b.color}15`
                    : 'none',
                  zIndex: isHovered ? 20 : 1
                }}
              >
                <span style={{
                  fontSize: '20px',
                  filter: isHovered || isSelected ? `drop-shadow(0 0 8px ${b.color})` : 'none',
                  transition: 'transform 0.2s ease',
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  flexShrink: 0
                }}>
                  {b.icon}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <span style={{
                    fontSize: isHovered ? '12px' : '12.5px',
                    fontWeight: '700',
                    color: isHovered || isSelected ? b.color : '#f1f5f9',
                    lineHeight: '1.3',
                    whiteSpace: isHovered ? 'normal' : 'nowrap',
                    overflow: isHovered ? 'visible' : 'hidden',
                    textOverflow: isHovered ? 'clip' : 'ellipsis',
                    wordBreak: isHovered ? 'break-word' : 'normal',
                    transition: 'all 0.2s ease'
                  }}>
                    {b.name}
                  </span>
                  {isHovered && (
                    <span style={{
                      fontSize: '10.5px',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '2px'
                    }}>
                      <span>⚡ Primary:</span> <strong style={{ color: '#38bdf8' }}>{b.primaryLang.name.split(' ')[0]}</strong>
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Active Branch Header Showcase ── */}
      <div style={{
        background: `linear-gradient(135deg, ${currentBranch.accentBg} 0%, rgba(15, 23, 42, 0.9) 100%)`,
        borderRadius: '16px',
        padding: '24px',
        border: `1.5px solid ${currentBranch.color}40`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>{currentBranch.icon}</span>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: currentBranch.color }}>
                {currentBranch.name}
              </h3>
            </div>
            <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '13.5px', maxWidth: '850px', lineHeight: '1.5' }}>
              {currentBranch.welcomeMessage}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
            <span style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              💼 <strong>Placement Demand:</strong> {currentBranch.placementDemand}
            </span>
            <span style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' }}>
              📊 <strong>Difficulty:</strong> {currentBranch.difficulty}
            </span>
          </div>
        </div>

        {/* ── Sub Tabs Navigation ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1.5px solid #334155',
          paddingBottom: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'roadmap', label: '🗺️ Which Language & 4-Year Plan', icon: '🗺️' },
            { id: 'dualtrack', label: '⚖️ Core vs Software SDE Route', icon: '⚖️' },
            { id: 'moocs_challenges', label: '🏆 MOOCs & Certifications', icon: '🏆' },
            { id: 'codepreview', label: '💻 Branch Code Preview', icon: '💻' },
            { id: 'advisor_quiz', label: '✨ Smart Branch Advisor Quiz', icon: '✨' },
            { id: 'matrix', label: '📊 All-Branch Comparison Table', icon: '📊' }
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? currentBranch.color : 'rgba(30, 41, 59, 0.6)',
                  color: isActive ? '#0f172a' : '#cbd5e1',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SUB TAB 1: Which Language & 4-Year Plan ── */}
      {activeSubTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Languages Recommendation Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#0f172a', padding: '18px', borderRadius: '12px', border: '1.5px solid #38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                  PRIMARY LANGUAGE
                </span>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{currentBranch.primaryLang.badge}</span>
              </div>
              <h4 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>{currentBranch.primaryLang.name}</h4>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {currentBranch.primaryLang.reason}
              </p>
            </div>

            <div style={{ background: '#0f172a', padding: '18px', borderRadius: '12px', border: '1.5px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#d97706', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                  SECONDARY LANGUAGE
                </span>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{currentBranch.secondaryLang.badge}</span>
              </div>
              <h4 style={{ margin: 0, fontSize: '18px', color: '#f59e0b' }}>{currentBranch.secondaryLang.name}</h4>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {currentBranch.secondaryLang.reason}
              </p>
            </div>
          </div>

          {/* 4-Year Academic Progression Timeline */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: currentBranch.color }}>
              📅 4-Year Recommended Action Plan for {currentBranch.name.split('(')[0]}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {currentBranch.coreRoadmap.map((r, i) => (
                <div key={i} style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: currentBranch.color, marginBottom: '4px' }}>
                    {r.year}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: '#f1f5f9', lineHeight: '1.4' }}>
                    {r.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hiring Companies */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 18px', borderRadius: '10px', border: '1px dashed #334155' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#94a3b8' }}>🏢 Top Hiring Companies for this Branch: </span>
            <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '600' }}>
              {currentBranch.topCompanies.join(' • ')}
            </span>
          </div>
        </div>
      )}

      {/* ── SUB TAB 2: Core vs Software SDE Route ── */}
      {activeSubTab === 'dualtrack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#0f172a', padding: '18px', borderRadius: '12px', border: '1px solid #38bdf8' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#38bdf8' }}>
              {currentBranch.dualTrack.coreTitle}
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#cbd5e1' }}>
              {currentBranch.dualTrack.coreDescription}
            </p>
          </div>

          <div style={{ background: '#0f172a', padding: '18px', borderRadius: '12px', border: '1.5px solid #10b981' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#10b981' }}>
              {currentBranch.dualTrack.transitionTitle || '💻 Software SDE Strategy'}
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#cbd5e1' }}>
              {currentBranch.dualTrack.transitionDescription || 'How to stand out in software campus placements:'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentBranch.dualTrack.steps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#f1f5f9' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB TAB 3: MOOCs & Certifications Hub ── */}
      {activeSubTab === 'moocs_challenges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* MOOCs (Harvard, NPTEL, Coursera, edX) */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎓</span> Recommended MOOCs & College-Credit Courses
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {currentBranch.moocsAndCerts.moocs.map((m, idx) => (
                <div key={idx} style={{
                  background: '#0f172a',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div>
                    <span style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontSize: '10.5px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {m.tag}
                    </span>
                    <h5 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#f1f5f9' }}>{m.name}</h5>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{m.provider}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Certifications */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span> Top Recognized Industry Certifications for Placements
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {currentBranch.moocsAndCerts.certifications.map((c, idx) => (
                <div key={idx} style={{
                  background: '#0f172a',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{c.name}</strong>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Issuer: <span style={{ color: '#cbd5e1' }}>{c.issuer}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB TAB 4: Branch Code Preview ── */}
      {activeSubTab === 'codepreview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ margin: 0, fontSize: '16px', color: currentBranch.color }}>
            💻 Real-World Code Sample: {currentBranch.codeSample.title}
          </h4>
          <pre style={{
            background: '#090d16',
            padding: '18px',
            borderRadius: '12px',
            border: '1.5px solid #334155',
            color: '#38bdf8',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            overflowX: 'auto',
            margin: 0
          }}>
            <code>{currentBranch.codeSample.code}</code>
          </pre>
        </div>
      )}

      {/* ── SUB TAB 5: Supercharged Smart Advisor Quiz ── */}
      {activeSubTab === 'advisor_quiz' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '14px',
          padding: '24px',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', color: '#38bdf8', fontWeight: '800' }}>
              ✨ Interactive Smart Advisor: Generate Your Year-Specific Roadmap
            </h4>
            <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
              Select your B.Tech branch, target career dream role, and current college year to generate a customized 30-60-90 day milestone plan!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {/* Question 1: Branch */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>
                1. Your B.Tech Branch (16 Options):
              </label>
              <select
                value={quizBranch}
                onChange={e => setQuizBranch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '1.5px solid #334155',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                {branchData.map(b => (
                  <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
                ))}
              </select>
            </div>

            {/* Question 2: Career Goal */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>
                2. Your Primary Career Goal:
              </label>
              <select
                value={quizGoal}
                onChange={e => setQuizGoal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '1.5px solid #334155',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                <option value="sde">💻 Software SDE / FAANG / Tier-1 Product Company</option>
                <option value="ai_ds">🧠 AI, Machine Learning & Data Science</option>
                <option value="core">🛠️ Core Engineering R&D (Semiconductor / EV / CAD)</option>
                <option value="cyber">🔒 Cyber Security & Ethical Hacking</option>
                <option value="higher_studies">🎓 GATE / GRE / M.Tech / MS Research</option>
              </select>
            </div>

            {/* Question 3: College Year */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>
                3. Current College Year:
              </label>
              <select
                value={quizYear}
                onChange={e => setQuizYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '1.5px solid #334155',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                <option value="1">🌱 1st Year (Freshman)</option>
                <option value="2">🌿 2nd Year (Sophomore)</option>
                <option value="3">🚀 3rd Year (Junior)</option>
                <option value="4">🎓 4th Year (Senior / Final Year)</option>
              </select>
            </div>

            {/* Question 4: Current Skill Level */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px' }}>
                4. Current Coding Level:
              </label>
              <select
                value={quizSkillLevel}
                onChange={e => setQuizSkillLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '1.5px solid #334155',
                  color: '#fff',
                  fontSize: '13px'
                }}
              >
                <option value="beginner">🐣 Absolute Beginner (Zero coding experience)</option>
                <option value="intermediate">⚡ Intermediate (Know basics, starting DSA)</option>
                <option value="advanced">🔥 Advanced (Practicing LeetCode & Projects)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunAdvisor}
            style={{
              alignSelf: 'flex-start',
              padding: '11px 24px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              color: '#04101e',
              fontSize: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
            }}
          >
            ⚡ Generate My Year-{quizYear} Custom Roadmap
          </button>

          {/* Supercharged Year-Specific Result Box */}
          {quizResult && (
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '22px',
              border: '2px solid #38bdf8',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.2)'
            }}>
              {/* Header Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#38bdf8', fontWeight: '800' }}>
                    {quizResult.yearGoalTitle}
                  </h4>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    Branch: <strong>{quizResult.branchName}</strong> | Expected Package: <strong style={{ color: '#34d399' }}>{quizResult.salaryRange}</strong>
                  </span>
                </div>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  🎯 Year {quizYear} Action Plan
                </span>
              </div>

              {/* Language Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <span style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>Primary Language Today</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                    {quizResult.recommendedPrimary}
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <span style={{ fontSize: '11px', color: '#f59e0b', textTransform: 'uppercase', fontWeight: 'bold' }}>Secondary Tech Stack</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#fff', fontSize: '15px' }}>
                    {quizResult.recommendedSecondary}
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <span style={{ fontSize: '11px', color: '#10b981', textTransform: 'uppercase', fontWeight: 'bold' }}>Recommended Cert / MOOC</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#fff', fontSize: '13.5px' }}>
                    {quizResult.topCert}
                  </p>
                </div>
              </div>

              {/* Immediate Focus */}
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '14px 18px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8' }}>
                  ⚡ Immediate Action Focus for Year {quizYear}:
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#e2e8f0', lineHeight: '1.5' }}>
                  {quizResult.immediateAction}
                </p>
              </div>

              {/* 30-60-90 Day Milestones */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f59e0b' }}>
                  📅 Your 30-60-90 Day Milestone Execution Plan:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {quizResult.milestones30_60_90.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>📌</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Targeted Resume Projects */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399' }}>
                  💡 Top 3 High-Impact Resume Projects for Year {quizYear}:
                </span>
                <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {quizResult.projects.map((p, i) => (
                    <li key={i}><strong style={{ color: '#f8fafc' }}>{p}</strong></li>
                  ))}
                </ul>
              </div>

              {/* Common Trap to Avoid */}
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#ef4444' }}>
                  ⚠️ Critical Trap to Avoid in Year {quizYear}:
                </span>
                <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#fca5a5' }}>
                  {quizResult.avoidMistake}
                </p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── SUB TAB 6: All-Branch Comparison Table & FAQ ── */}
      {activeSubTab === 'matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Comparison Matrix Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              textAlign: 'left'
            }}>
              <thead>
                <tr style={{ background: '#1e293b', color: '#38bdf8', borderBottom: '2px solid #334155' }}>
                  <th style={{ padding: '12px 14px' }}>Branch</th>
                  <th style={{ padding: '12px 14px' }}>Primary Language</th>
                  <th style={{ padding: '12px 14px' }}>Secondary Stack</th>
                  <th style={{ padding: '12px 14px' }}>Key Industry Domain</th>
                  <th style={{ padding: '12px 14px' }}>Placement Demand</th>
                </tr>
              </thead>
              <tbody>
                {branchData.map((b, idx) => (
                  <tr key={b.id} style={{
                    background: idx % 2 === 0 ? 'rgba(15, 23, 42, 0.6)' : 'rgba(30, 41, 59, 0.4)',
                    borderBottom: '1px solid #334155'
                  }}>
                    <td style={{ padding: '12px 14px', fontWeight: 'bold', color: b.color }}>
                      <span style={{ marginRight: '6px' }}>{b.icon}</span> {b.name.split('(')[0]}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#f1f5f9', fontWeight: '600' }}>
                      {b.primaryLang.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                      {b.secondaryLang.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12.5px' }}>
                      {b.coreFocus.split(',').slice(0, 3).join(', ')}...
                    </td>
                    <td style={{ padding: '12px 14px', color: '#facc15', fontWeight: 'bold', fontSize: '12px' }}>
                      {b.placementDemand.split('(')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
