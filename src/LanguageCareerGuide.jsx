import React, { useState } from 'react';

export default function LanguageCareerGuide() {
  const [selectedLang, setSelectedLang] = useState('c');
  const [hoveredLangId, setHoveredLangId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'four_year_plan', 'moocs_challenges', 'syntax_demo'

  const languages = [
    {
      id: 'c',
      name: 'C Language',
      icon: '⚙️',
      color: '#38bdf8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      tagline: 'The Mother of All Modern Languages & Hardware Master',
      beginnerDifficulty: 'Medium (Teaches RAM Memory & Pointers)',
      industryDemand: '⭐⭐⭐⭐ (Operating Systems, Embedded & IoT)',
      fields: [
        'Operating Systems (Linux Kernel, Windows NT, macOS Kernel)',
        'Embedded Systems & Microcontrollers (Robotics, Automotive ECUs)',
        'IoT (Internet of Things) & Smart Appliances',
        'Game Engine Core Foundations (Low-level Graphics Drivers)',
        'Database Storage Engines (MySQL & PostgreSQL storage core)'
      ],
      jobTitles: [
        'Embedded Systems Engineer',
        'Firmware Developer',
        'System Software Developer',
        'Kernel / Driver Engineer',
        'Robotics Software Engineer'
      ],
      famousApps: ['Linux OS Kernel', 'Windows Kernel', 'Git VCS', 'Python Interpreter (CPython)', 'Redis In-Memory DB'],
      whyLearn: 'If you master C, learning any other language like Java, Python, or JS becomes effortlessly easy because C teaches you how the computer hardware, CPU registers, and RAM memory actually work under the hood!',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'C Basics, Data Types, Control Structures, Functions & Pointers fundamentals' },
        { year: '2nd Year (Sophomore)', milestone: 'Dynamic Memory Allocation (malloc/free), Structs, Linked Lists & Pointers in C' },
        { year: '3rd Year (Junior)', milestone: 'Microcontroller programming (Arduino/STM32), POSIX Threads, Socket Networking' },
        { year: '4th Year (Senior)', milestone: 'Real-Time Operating Systems (FreeRTOS), Device Drivers, Embedded Industry Placements' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'CS50x: Introduction to Computer Science', provider: 'Harvard University (edX)', link: 'https://cs50.harvard.edu/x/' },
          { name: 'Problem Solving through Programming in C', provider: 'NPTEL (IIT Kharagpur)', link: 'https://nptel.ac.in' },
          { name: 'C Programming for Embedded Systems', provider: 'Coursera', link: 'https://coursera.org' }
        ],
        certifications: [
          { name: 'C Programming Certified Associate (CLA)', issuer: 'C++ Institute' },
          { name: 'Arm Certified Embedded Engineer', issuer: 'Arm Architecture' }
        ],
        challenges: [
          { name: 'HackerRank C Language Track (5-Star Badge)', url: 'https://hackerrank.com' },
          { name: 'LeetCode (C Memory Management Problems)', url: 'https://leetcode.com' },
          { name: 'CodeChef C Beginners Practice Contests', url: 'https://codechef.com' }
        ]
      },
      codeSnippet: `// C Language: Dynamic Memory Allocation & Pointer Manipulation
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*) malloc(n * sizeof(int));
    if (arr == NULL) return 1;

    for (int i = 0; i < n; i++) {
        *(arr + i) = (i + 1) * 10;
        printf("Memory Address: %p | Value: %d\\n", (void*)(arr + i), *(arr + i));
    }

    free(arr); // Clean RAM memory
    return 0;
}`
    },
    {
      id: 'cpp',
      name: 'C++',
      icon: '⚡',
      color: '#60a5fa',
      accentBg: 'rgba(96, 165, 250, 0.12)',
      tagline: 'High Performance, DSA Gold Standard & Game Engines',
      beginnerDifficulty: 'Moderate-High (OOPs + STL + Memory Speed)',
      industryDemand: '⭐⭐⭐⭐⭐ (Top Choice for Product Placements & HFT)',
      fields: [
        'Competitive Programming & Campus DSA Technical Rounds (FAANG / Product)',
        'AAA Game Engines (Unreal Engine 5, CryEngine, Unity Native Plugins)',
        'High-Frequency Trading (HFT & Wall Street Systems)',
        'Computer Vision & Autonomous Robotics (OpenCV, ROS 2)',
        'Web Browsers (Google Chrome V8 Engine, Mozilla Firefox)'
      ],
      jobTitles: [
        'Software Development Engineer (SDE)',
        'Quantitative / HFT Developer',
        'Game Engine Developer',
        'Robotics & Autonomous Vehicle Engineer',
        'High-Performance Systems Architect'
      ],
      famousApps: ['Unreal Engine 5', 'Adobe Photoshop', 'Google Chrome Core', 'Microsoft Office', 'Oracle Database Core'],
      whyLearn: 'C++ combines the raw bare-metal execution speed of C with powerful Object-Oriented features and the Standard Template Library (STL). It is the #1 preferred language worldwide for cracking LeetCode DSA interviews and high-frequency trading.',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'C++ Syntax, Fast I/O, OOPs (Classes, Inheritance, Polymorphism), Basics of STL (Vectors, Sets)' },
        { year: '2nd Year (Sophomore)', milestone: 'Data Structures & Algorithms (STL Maps, Queues, Heaps, Trees, Graphs, DP) on LeetCode' },
        { year: '3rd Year (Junior)', milestone: 'Advanced C++ (Smart Pointers, Lambda, Move Semantics, Multithreading), Project Building' },
        { year: '4th Year (Senior)', milestone: 'Competitive Programming (Codeforces Div 2), System Architecture, FAANG SDE Interviews' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'C++ For C Programmers Specialization', provider: 'UC Santa Cruz (Coursera)', link: 'https://coursera.org' },
          { name: 'Data Structures & Algorithms in C++', provider: 'NPTEL (IIT Madras)', link: 'https://nptel.ac.in' },
          { name: 'Unreal Engine 5 C++ Developer Course', provider: 'Udemy / Epic Games', link: 'https://udemy.com' }
        ],
        certifications: [
          { name: 'C++ Certified Associate Programmer (CPA)', issuer: 'C++ Institute' },
          { name: 'Certified C++ Professional Programmer (CPP)', issuer: 'C++ Institute' }
        ],
        challenges: [
          { name: 'LeetCode (Blind 75 & Top Interview 150 in C++)', url: 'https://leetcode.com' },
          { name: 'Codeforces (Div 2 & Div 3 Speed Contests)', url: 'https://codeforces.com' },
          { name: 'CodeChef Star Rating Challenges (C++ STL)', url: 'https://codechef.com' }
        ]
      },
      codeSnippet: `// C++: Standard Template Library (STL) Map for Frequency Counting
#include <iostream>
#include <vector>
#include <unordered_map>

int main() {
    std::vector<std::string> skills = {"DSA", "SystemDesign", "DSA", "WebDev", "DSA", "Cloud"};
    std::unordered_map<std::string, int> freqMap;

    for (const auto& s : skills) {
        freqMap[s]++;
    }

    std::cout << "Skill Frequency Count (O(1) Avg Lookup):\\n";
    for (const auto& pair : freqMap) {
        std::cout << pair.first << " -> " << pair.second << " times\\n";
    }
    return 0;
}`
    },
    {
      id: 'frontend',
      name: 'Frontend Web Dev (HTML, CSS & JS)',
      icon: '🌐',
      color: '#f472b6',
      accentBg: 'rgba(244, 114, 182, 0.12)',
      tagline: 'The Core Web Trio: Structure (HTML), Styling (CSS) & Brain (JavaScript/React)',
      beginnerDifficulty: 'Easy (Instant Visual Output in Browsers)',
      industryDemand: '⭐⭐⭐⭐⭐ (Used on 98%+ of all websites on Earth)',
      fields: [
        'Front-End Web Development (HTML5, CSS3, JavaScript ES6+, TypeScript)',
        'Modern Component Frameworks (React.js, Next.js, Vue, Svelte)',
        'Responsive UI & Modern CSS (Tailwind CSS, Flexbox, CSS Grid, GSAP Animations)',
        'Cross-Platform Mobile Apps (React Native, Expo)',
        'Desktop Applications (Electron - VS Code, Discord, Slack)'
      ],
      jobTitles: [
        'Frontend Web Developer',
        'UI/UX Software Engineer',
        'React / Next.js Developer',
        'Full-Stack JavaScript Engineer',
        'Design Systems Engineer'
      ],
      famousApps: ['YouTube Web App', 'Netflix Web App', 'VS Code Editor', 'Discord App', 'Spotify Web Player'],
      whyLearn: 'Frontend development is powered by the legendary Holy Trinity of the Web: HTML builds the skeleton, CSS crafts the beautiful design and animations, and JavaScript/TypeScript brings dynamic interactivity and React components to life!',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'HTML5 Semantic Tags, CSS3 (Flexbox/Grid, Responsive Media Queries), JavaScript ES6+ & Git' },
        { year: '2nd Year (Sophomore)', milestone: 'React.js Component Architecture, Hooks (useState, useEffect), Tailwind CSS, TypeScript' },
        { year: '3rd Year (Junior)', milestone: 'Next.js (SSR, Server Actions), State Management (Redux/Zustand), REST/GraphQL APIs, Full-Stack' },
        { year: '4th Year (Senior)', milestone: 'Performance Optimization, Micro-Frontends, Web Accessibility (a11y), Frontend SDE Placements' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'Meta Front-End Developer Professional Certificate', provider: 'Meta (Coursera)', link: 'https://coursera.org' },
          { name: 'Full Stack Open (React, TypeScript, GraphQL)', provider: 'University of Helsinki (Free)', link: 'https://fullstackopen.com' },
          { name: 'The Odin Project (Foundations & Full Stack JS)', provider: 'Open Source Community', link: 'https://theodinproject.com' }
        ],
        certifications: [
          { name: 'Meta Certified Front-End Software Engineer', issuer: 'Meta' },
          { name: 'OpenJS Node.js Application Developer (JSNAD)', issuer: 'Linux Foundation' }
        ],
        challenges: [
          { name: 'Frontend Mentor (Real-World HTML/CSS/JS UI Challenges)', url: 'https://frontendmentor.io' },
          { name: 'LeetCode (JavaScript 30-Day Coding Challenge)', url: 'https://leetcode.com' },
          { name: 'Codewars (JavaScript Kata Level 8 to 1)', url: 'https://codewars.com' }
        ]
      },
      codeSnippet: `<!-- Frontend Trio: HTML5 Skeleton + CSS3 Style + JavaScript Interactivity -->
<!-- 1. HTML5 Structure -->
<div id="card" class="tech-card">
  <h2>AlgoFlow Studio</h2>
  <button id="likeBtn">❤️ <span id="count">0</span> Likes</button>
</div>

<!-- 2. CSS3 Styling -->
<style>
  .tech-card {
    background: #0f172a;
    border: 1px solid #38bdf8;
    padding: 20px;
    border-radius: 12px;
    color: #fff;
    text-align: center;
  }
  button {
    background: #0284c7;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  button:hover { transform: scale(1.08); }
</style>

<!-- 3. JavaScript / React Interactivity -->
<script>
  let likes = 0;
  const btn = document.getElementById('likeBtn');
  const countSpan = document.getElementById('count');
  btn.addEventListener('click', () => {
    likes++;
    countSpan.textContent = likes;
  });
</script>`
    },
    {
      id: 'java',
      name: 'Java',
      icon: '☕',
      color: '#f59e0b',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      tagline: 'Enterprise Scale, FinTech & Android Ecosystem',
      beginnerDifficulty: 'Moderate (Strict Object-Oriented Structure)',
      industryDemand: '⭐⭐⭐⭐⭐ (Trusted by 90% of Fortune 500 Enterprises)',
      fields: [
        'Enterprise Backend Microservices (Spring Boot, Hibernate)',
        'Banking & FinTech Core Transaction Systems (HDFC, Goldman Sachs)',
        'Android Native Mobile App Development',
        'Big Data Engineering (Apache Hadoop, Apache Spark, Kafka)',
        'Cloud Infrastructure & Large-Scale Distributed Computing'
      ],
      jobTitles: [
        'Java Backend Developer',
        'Enterprise Application Engineer',
        'Android Mobile Developer',
        'FinTech Software Architect',
        'Big Data Engineer'
      ],
      famousApps: ['Android OS', 'Minecraft', 'Amazon Backend Services', 'Uber Backend Architecture', 'Netflix Streaming Engine'],
      whyLearn: 'Java is famous for "Write Once, Run Anywhere" via the JVM. It dominates enterprise corporate backends, banking systems, and large-scale cloud microservices. Mastering Java ensures solid placement opportunities across product and service companies alike.',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'Core Java, JVM Architecture, OOPs (Encapsulation, Interfaces, Abstract Classes), Exceptions' },
        { year: '2nd Year (Sophomore)', milestone: 'Java Collections Framework (ArrayList, HashMap, PriorityQueue), DSA on LeetCode, JDBC SQL' },
        { year: '3rd Year (Junior)', milestone: 'Spring Boot REST APIs, Microservices, Hibernate ORM, Docker, Full-Stack Project' },
        { year: '4th Year (Senior)', milestone: 'Distributed Systems, Kafka, System Design, Mock Technical Interviews & Placements' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'Java Programming and Software Engineering Fundamentals', provider: 'Duke University (Coursera)', link: 'https://coursera.org' },
          { name: 'Programming in Java', provider: 'NPTEL (IIT Kharagpur)', link: 'https://nptel.ac.in' },
          { name: 'Building Scalable Java Microservices with Spring Boot', provider: 'Coursera / Google Cloud', link: 'https://coursera.org' }
        ],
        certifications: [
          { name: 'Oracle Certified Associate / Professional Java SE Developer', issuer: 'Oracle Corporation' },
          { name: 'Spring Certified Professional', issuer: 'VMware Tanzu' }
        ],
        challenges: [
          { name: 'LeetCode (Java Collections DSA 150)', url: 'https://leetcode.com' },
          { name: 'GeeksforGeeks POTD & Java Practice Track', url: 'https://practice.geeksforgeeks.org' },
          { name: 'HackerRank Java Badge (Gold 5-Star)', url: 'https://hackerrank.com' }
        ]
      },
      codeSnippet: `// Java: Clean Object-Oriented User Account Management
import java.util.*;

class BankAccount {
    private String accountNumber;
    private double balance;

    public BankAccount(String accNo, double initialDeposit) {
        this.accountNumber = accNo;
        this.balance = initialDeposit;
    }

    public synchronized void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited $" + amount + " | New Balance: $" + balance);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("ACC-98214", 500.0);
        acc.deposit(250.0);
    }
}`
    },
    {
      id: 'python',
      name: 'Python',
      icon: '🐍',
      color: '#34d399',
      accentBg: 'rgba(52, 211, 153, 0.12)',
      tagline: 'AI, Machine Learning, Data Science & Fast Prototyping',
      beginnerDifficulty: 'Easiest (Clean syntax that reads like English)',
      industryDemand: '⭐⭐⭐⭐⭐ (#1 Worldwide for AI & Data Analysis)',
      fields: [
        'Artificial Intelligence & Machine Learning (PyTorch, TensorFlow)',
        'Data Science, Analytics & Big Data (Pandas, NumPy, Matplotlib)',
        'Generative AI & Large Language Models (LangChain, Hugging Face)',
        'Web Backends & Rapid APIs (FastAPI, Django, Flask)',
        'Cybersecurity Scripting, Ethical Hacking & Automation'
      ],
      jobTitles: [
        'AI / Machine Learning Engineer',
        'Data Scientist / Data Analyst',
        'Python Web Developer (Backend)',
        'Automation & QA Scripting Engineer',
        'Cybersecurity Security Researcher'
      ],
      famousApps: ['ChatGPT / OpenAI Backend', 'Instagram Backend (Django)', 'Spotify Recommendation Engine', 'Netflix AI Algorithm', 'Dropbox'],
      whyLearn: 'Python has the gentlest learning curve and the most vibrant open-source ecosystem in the world. If your goal is AI, Machine Learning, Data Analytics, or rapid web app development, Python is mandatory.',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'Python Syntax, Data Structures (Lists, Dicts, Tuples, Sets), File Handling, Basic Git' },
        { year: '2nd Year (Sophomore)', milestone: 'Data Wrangling with Pandas & NumPy, SQL Databases, Basic DSA in Python, OOPs' },
        { year: '3rd Year (Junior)', milestone: 'Machine Learning (Scikit-learn), Deep Learning (PyTorch), FastAPI web backend, Kaggle' },
        { year: '4th Year (Senior)', milestone: 'Generative AI (RAG, LLM fine-tuning), Model Deployment (MLflow, Docker), AI Placements' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'Python for Everybody Specialization', provider: 'University of Michigan (Coursera)', link: 'https://coursera.org' },
          { name: 'Machine Learning Specialization', provider: 'DeepLearning.AI / Andrew Ng (Coursera)', link: 'https://coursera.org' },
          { name: 'Joy of Computing using Python', provider: 'NPTEL (IIT Madras)', link: 'https://nptel.ac.in' }
        ],
        certifications: [
          { name: 'PCEP / PCAP Certified Associate Python Programmer', issuer: 'OpenEDG Python Institute' },
          { name: 'AWS Certified Machine Learning - Specialty', issuer: 'Amazon Web Services' }
        ],
        challenges: [
          { name: 'Kaggle (Competitions, Notebooks & Datasets)', url: 'https://kaggle.com' },
          { name: 'LeetCode (Python DSA & SQL 50 Study Plan)', url: 'https://leetcode.com' },
          { name: 'HackerRank Python 5-Star Track', url: 'https://hackerrank.com' }
        ]
      },
      codeSnippet: `# Python: Data Analysis & Statistics with Pandas
import pandas as pd

data = {
    'Student': ['Aarav', 'Diya', 'Rohan', 'Sneha', 'Vikram'],
    'Branch': ['CSE', 'ECE', 'CSE', 'MECH', 'AIDS'],
    'LeetCode_Solved': [180, 140, 220, 95, 210]
}

df = pd.DataFrame(data)
print("--- Average LeetCode Problems Solved by Branch ---")
print(df.groupby('Branch')['LeetCode_Solved'].mean())`
    },
    {
      id: 'go',
      name: 'Go (Golang)',
      icon: '🐹',
      color: '#22d3ee',
      accentBg: 'rgba(34, 211, 238, 0.12)',
      tagline: 'High Concurrency, Cloud Native & Microservices Engine',
      beginnerDifficulty: 'Moderate (Clean syntax with built-in concurrency)',
      industryDemand: '⭐⭐⭐⭐ (The Engine of Kubernetes, Docker & DevOps)',
      fields: [
        'Cloud-Native Infrastructure & DevOps (Docker, Kubernetes, Terraform)',
        'High-Scale Backend Microservices (Uber, Twitch, Google Cloud)',
        'Network Programming & High-Concurrency Web Servers (Goroutines)',
        'Cybersecurity & Network Tools',
        'Distributed Storage & Message Brokers'
      ],
      jobTitles: [
        'Cloud Engineer / Platform Developer',
        'Go Backend Engineer',
        'DevOps / SRE (Site Reliability Engineer)',
        'Distributed Systems Architect'
      ],
      famousApps: ['Docker', 'Kubernetes', 'Terraform', 'Twitch Video Streaming Backend', 'Cloudflare Proxy'],
      whyLearn: 'Created by Google, Go is designed for building fast, concurrent network servers and distributed cloud platforms. Its lightweight Goroutines make handling millions of simultaneous user connections incredibly simple.',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'Go Syntax, Structs, Pointers, Slices & Basic CLI Applications' },
        { year: '2nd Year (Sophomore)', milestone: 'Concurrency with Goroutines & Channels, Interfaces, Error Handling, REST APIs' },
        { year: '3rd Year (Junior)', milestone: 'gRPC Microservices, Docker, PostgreSQL Integration, High-Throughput Web Services' },
        { year: '4th Year (Senior)', milestone: 'Kubernetes Operators, Distributed Caching, Cloud Native Placements & DevOps' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'Programming with Google Go Specialization', provider: 'UC Irvine (Coursera)', link: 'https://coursera.org' },
          { name: 'Building Modern Web Applications with Go', provider: 'Udemy', link: 'https://udemy.com' }
        ],
        certifications: [
          { name: 'Certified Kubernetes Application Developer (CKAD)', issuer: 'Cloud Native Computing Foundation (CNCF)' },
          { name: 'Google Cloud Professional Cloud Architect', issuer: 'Google Cloud' }
        ],
        challenges: [
          { name: 'Exercism Go Track (Mentor Reviewed Exercises)', url: 'https://exercism.org/tracks/go' },
          { name: 'LeetCode (Go Solutions for Concurrency & Arrays)', url: 'https://leetcode.com' },
          { name: 'Gophercises (20 Hands-on Go Projects)', url: 'https://gophercises.com' }
        ]
      },
      codeSnippet: `// Go: Ultra-Lightweight Goroutines for Concurrent Execution
package main

import (
    "fmt"
    "time"
)

func worker(id int, ch chan string) {
    time.Sleep(100 * time.Millisecond)
    ch <- fmt.Sprintf("Worker #%d completed task in parallel", id)
}

func main() {
    ch := make(chan string)
    for i := 1; i <= 3; i++ {
        go worker(i, ch) // Spawn 3 concurrent lightweight threads
    }

    for i := 1; i <= 3; i++ {
        msg := <-ch
        fmt.Println(msg)
    }
}`
    },
    {
      id: 'rust',
      name: 'Rust',
      icon: '🦀',
      color: '#fb923c',
      accentBg: 'rgba(251, 146, 60, 0.12)',
      tagline: 'Memory Safety Without Garbage Collection & Next-Gen Systems',
      beginnerDifficulty: 'High (Strict Borrow Checker & Ownership Model)',
      industryDemand: '⭐⭐⭐⭐ (Most Loved Language on Stack Overflow 8 years straight)',
      fields: [
        'Next-Generation Systems Programming (Linux Kernel, Windows Core)',
        'WebAssembly (WASM) High-Speed Browser Computation',
        'Blockchain & Crypto Protocols (Solana, Polkadot, Near)',
        'High-Performance Web Servers & Tools (Tauri, Deno, Turbopack)',
        'Embedded Systems & Aerospace Firmware'
      ],
      jobTitles: [
        'Rust Systems Engineer',
        'WebAssembly Developer',
        'Blockchain Core Engineer',
        'Infrastructure & Tooling Developer'
      ],
      famousApps: ['Linux Kernel (Rust support)', 'Discord Real-time Core', 'Cloudflare Workers', 'Solana Blockchain', 'Figma WebAssembly Engine'],
      whyLearn: 'Rust provides C++ speed while completely eliminating memory corruption bugs and segmentation faults at compile time through its revolutionary Ownership and Borrowing system.',
      fourYearRoadmap: [
        { year: '1st Year (Freshman)', milestone: 'Rust Syntax, Cargo Build System, Basic Data Types, Pattern Matching' },
        { year: '2nd Year (Sophomore)', milestone: 'Ownership, References & Borrow Checker, Structs, Enums & Traits' },
        { year: '3rd Year (Junior)', milestone: 'Async Rust (Tokio), Actix-web REST APIs, WebAssembly (WASM), CLI Tools' },
        { year: '4th Year (Senior)', milestone: 'High-Performance Systems, Embedded Rust / Blockchain Core, Advanced Tooling Roles' }
      ],
      moocsAndCerts: {
        moocs: [
          { name: 'Rust Fundamentals Specialization', provider: 'Duke University (Coursera)', link: 'https://coursera.org' },
          { name: 'The Rust Programming Language (Official Book & Interactive Course)', provider: 'Rust Foundation', link: 'https://doc.rust-lang.org/book/' }
        ],
        certifications: [
          { name: 'Linux Foundation Certified Rust Developer', issuer: 'Linux Foundation' }
        ],
        challenges: [
          { name: 'Rustlings (Hands-on Interactive Rust Exercises)', url: 'https://github.com/rust-lang/rustlings' },
          { name: 'Exercism Rust Track', url: 'https://exercism.org/tracks/rust' },
          { name: 'LeetCode Rust Solutions', url: 'https://leetcode.com' }
        ]
      },
      codeSnippet: `// Rust: Compile-Time Memory Safety with Ownership
fn process_vector(v: Vec<i32>) -> i32 {
    v.iter().sum() // Takes ownership of vector
}

fn main() {
    let numbers = vec![10, 20, 30, 40, 50];
    let total = process_vector(numbers);
    // numbers cannot be used here -> Zero memory leaks guaranteed!
    println!("Sum calculated with zero memory leaks: {}", total);
}`
    }
  ];

  const current = languages.find(l => l.id === selectedLang) || languages[0];

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
      gap: '22px'
    }}>
      {/* Title */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderRadius: '14px',
        padding: '20px 24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>🎯</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '21px', fontWeight: '800', color: '#38bdf8' }}>
              Which Programming Language to Pick? (Language Career Guide & 4-Year Roadmaps)
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.5' }}>
              Deep dive into every major language and stack: <strong>C, C++, Frontend Web Dev (HTML, CSS & JS), Java, Python, Go, and Rust</strong>. Explore why learn it, 4-year learning roadmaps, target job roles, MOOCs, certifications, and coding challenges!
            </p>
          </div>
        </div>
      </div>

      {/* Language Selector Buttons */}
      {/* Horizontal Language Selector Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {languages.map(l => {
          const isActive = selectedLang === l.id;
          const isHovered = hoveredLangId === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setSelectedLang(l.id)}
              onMouseEnter={() => setHoveredLangId(l.id)}
              onMouseLeave={() => setHoveredLangId(null)}
              title={`${l.name} - ${l.tagline}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                borderRadius: '12px',
                border: isActive
                  ? `2px solid ${l.color}`
                  : isHovered
                  ? `2px solid ${l.color}`
                  : '1px solid #334155',
                background: isActive
                  ? `linear-gradient(135deg, ${l.accentBg} 0%, rgba(15, 23, 42, 0.95) 100%)`
                  : isHovered
                  ? `linear-gradient(135deg, ${l.accentBg} 0%, rgba(15, 23, 42, 0.9) 100%)`
                  : '#0f172a',
                color: isActive || isHovered ? '#f8fafc' : '#cbd5e1',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-3px) scale(1.02)' : isActive ? 'scale(1.01)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                  ? `0 0 28px ${l.color}90, 0 8px 20px rgba(0,0,0,0.5), inset 0 0 16px ${l.color}35`
                  : isActive
                  ? `0 0 18px ${l.color}45, inset 0 0 10px ${l.color}20`
                  : 'none',
                zIndex: isHovered ? 5 : 1
              }}
            >
              <span style={{
                fontSize: '20px',
                filter: isHovered || isActive ? `drop-shadow(0 0 8px ${l.color})` : 'none',
                transition: 'transform 0.2s ease',
                transform: isHovered ? 'scale(1.15)' : 'scale(1)'
              }}>
                {l.icon}
              </span>
              <span style={{ color: isHovered || isActive ? l.color : '#f1f5f9' }}>{l.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Details Card */}
      <div style={{
        background: `linear-gradient(135deg, ${current.accentBg} 0%, rgba(30, 41, 59, 0.9) 100%)`,
        borderRadius: '16px',
        padding: '24px',
        border: `1.5px solid ${current.color}`,
        boxShadow: `0 0 25px ${current.color}15`,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>{current.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: current.color }}>
                {current.name}
              </h3>
              <span style={{ fontSize: '13.5px', color: '#cbd5e1', fontWeight: '600' }}>
                {current.tagline}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Difficulty: <strong style={{ color: '#fff' }}>{current.beginnerDifficulty}</strong>
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Industry Demand: <strong style={{ color: '#fbbf24', cursor: 'help' }} title={current.industryDemand}>{current.industryDemand.split(' ')[0]}</strong>
            </div>
          </div>
        </div>

        {/* Sub Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: '💡 Why Learn & Careers' },
            { id: 'four_year_plan', label: '📅 4-Year Language Roadmap' },
            { id: 'moocs_challenges', label: '🏆 MOOCs & Certifications' },
            { id: 'syntax_demo', label: '💻 Live Code Showcase' }
          ].map(tab => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isTabActive ? current.color : 'rgba(15, 23, 42, 0.6)',
                  color: isTabActive ? '#0f172a' : '#cbd5e1',
                  fontSize: '12.5px',
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '16px 20px',
              borderRadius: '10px',
              borderLeft: `4px solid ${current.color}`
            }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: current.color }}>
                💡 Why Learn {current.name}?
              </h4>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#e2e8f0', lineHeight: '1.5' }}>
                {current.whyLearn}
              </p>
            </div>

            {/* Special Highlight for Frontend Trio if selected */}
            {current.id === 'frontend' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #ef4444' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px' }}>🧱 1. HTML5 (Structure)</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Semantic elements (header, main, section), SEO structure, Accessibility (ARIA), and DOM foundation.
                  </p>
                </div>

                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #38bdf8' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '13px' }}>🎨 2. CSS3 (Styling)</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Flexbox, CSS Grid layouts, Tailwind CSS utility styling, smooth animations, and responsive media queries.
                  </p>
                </div>

                <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #fbbf24' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '13px' }}>⚡ 3. JavaScript / React (Logic)</span>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    DOM manipulation, ES6+ async/await, API data fetching, React components, state hooks, and Next.js.
                  </p>
                </div>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {/* Fields */}
              <div style={{
                background: '#0f172a',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #334155'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🚀</span> Fields & Industries
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
                  {current.fields.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Job Titles */}
              <div style={{
                background: '#0f172a',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid #334155'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💼</span> Target Job Roles
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
                  {current.jobTitles.map((j, i) => (
                    <li key={i}><strong>{j}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Famous Apps */}
            <div style={{
              background: '#090d16',
              padding: '14px 18px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
                🌟 Famous Software Built With {current.name}:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {current.famousApps.map((app, i) => (
                  <span key={i} style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#f1f5f9',
                    fontWeight: '600'
                  }}>
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 4-YEAR LANGUAGE ROADMAP */}
        {activeTab === 'four_year_plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: '800' }}>
              📅 4-Year Progressive Learning Roadmap for {current.name}
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px'
            }}>
              {current.fourYearRoadmap.map((step, idx) => (
                <div key={idx} style={{
                  background: '#0f172a',
                  padding: '16px',
                  borderRadius: '10px',
                  borderTop: `3px solid ${idx === 0 ? '#38bdf8' : idx === 1 ? '#f59e0b' : idx === 2 ? '#10b981' : '#ec4899'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#f8fafc' }}>
                    {step.year}
                  </span>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5' }}>
                    {step.milestone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MOOCS & CERTIFICATIONS */}
        {activeTab === 'moocs_challenges' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* MOOCs */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#38bdf8' }}>
                🎓 Top MOOCs & Courses for {current.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {current.moocsAndCerts.moocs.map((m, i) => (
                  <div key={i} style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13.5px', color: '#f1f5f9' }}>{m.name}</h5>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{m.provider}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#10b981' }}>
                📜 Industry Recognized Certifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {current.moocsAndCerts.certifications.map((c, i) => (
                  <div key={i} style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{c.name}</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Issuer: {c.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CODE SHOWCASE */}
        {activeTab === 'syntax_demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: current.color }}>
              💻 Live Real-World Code Sample in {current.name}
            </h4>
            <pre style={{
              background: '#090d16',
              padding: '16px',
              borderRadius: '10px',
              border: '1.5px solid #334155',
              color: '#38bdf8',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
              overflowX: 'auto',
              margin: 0
            }}>
              <code>{current.codeSnippet}</code>
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}
