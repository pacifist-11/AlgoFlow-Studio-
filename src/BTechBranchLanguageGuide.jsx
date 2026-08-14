import React, { useState } from 'react';
import LanguageCareerGuide from './LanguageCareerGuide.jsx';

export default function BTechBranchLanguageGuide() {
  const [viewMode, setViewMode] = useState('branch'); // 'branch' or 'language'
  const [selectedBranch, setSelectedBranch] = useState('cse');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState('roadmap'); // 'roadmap', 'dualtrack', 'moocs_challenges', 'codepreview', 'faq'
  
  // Interactive Smart Advisor Quiz state
  const [quizBranch, setQuizBranch] = useState('cse');
  const [quizGoal, setQuizGoal] = useState('sde');
  const [quizYear, setQuizYear] = useState('1');
  const [quizResult, setQuizResult] = useState(null);

  // Filter Categories
  const categories = [
    { id: 'all', label: 'All Branches' },
    { id: 'cs_it', label: '💻 CS & IT' },
    { id: 'circuits', label: '⚡ Electronics & Electrical' },
    { id: 'core_eng', label: '⚙️ Mechanical & Civil' },
    { id: 'ai_cyber', label: '🤖 AI, Data & Security' },
    { id: 'specialized', label: '🚀 Aero, Auto & Biotech' }
  ];

  // Comprehensive B.Tech Branches Data
  const branchData = [
    {
      id: 'cse',
      name: 'Computer Science & Engineering (CSE / IT)',
      category: 'cs_it',
      icon: '💻',
      color: '#38bdf8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      welcomeTitle: '🌟 Welcome to Coding Languages & Software Engineering!',
      welcomeMessage: 'As a CSE / IT student, code is your core superpower and primary craft. Your objective is mastering problem solving, algorithms, system architecture, and scalable software development.',
      difficulty: 'High in Logic & Algorithmic Thinking',
      placementDemand: '⭐⭐⭐⭐⭐ (Highest Job Openings worldwide)',
      coreFocus: 'Data Structures, Algorithms, Operating Systems, DBMS, Networks, Cloud & Web/Mobile Architecture.',
      primaryLang: {
        name: 'C++ or Java',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'The industry standard for Data Structures & Algorithms (DSA), competitive programming, and high-frequency technical interviews (FAANG / Product companies).'
      },
      secondaryLang: {
        name: 'Python & JavaScript / TypeScript',
        badge: 'Recommended (2nd & 3rd Year)',
        reason: 'JavaScript/TypeScript powers modern Full-Stack Web/Mobile apps (React, Node.js). Python powers AI scripting, rapid prototyping, and backend microservices (FastAPI, Django).'
      },
      domainTools: [
        'Git & GitHub (Version Control)',
        'Docker & Kubernetes (Containerization)',
        'PostgreSQL / MongoDB (Databases)',
        'Linux Bash & Cloud (AWS / GCP)'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Programming Fundamentals in C/C++, Math, Logic Building, Git basics' },
        { year: '2nd Year (Sophomore)', focus: 'Data Structures & Algorithms (DSA), OOPs in Java/C++, DBMS & Computer Networks' },
        { year: '3rd Year (Junior)', focus: 'Full-Stack Web/App or Cloud/AI specialization, 2 Full Projects, Open Source, Hackathons' },
        { year: '4th Year (Senior)', focus: 'System Design basics, LeetCode Grinding (Blind 75), Mock Interviews & Placements' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Direct Software Development Route (Product & Service Giants)',
        coreDescription: 'Standard Software Engineering track focusing on DSA, Web/Cloud Architecture, and System Design.',
        steps: [
          'Master C++ STL or Java Collections Framework for DSA problem solving.',
          'Solve 250+ DSA problems across Arrays, Strings, Trees, Graphs, and DP on LeetCode.',
          'Build 2 production-grade Full-Stack projects with user authentication, database, and cloud deployment.',
          'Study core CS subjects: Operating Systems, Computer Networks, DBMS (SQL queries & indexing), OOPs.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'CS50x: Introduction to Computer Science', provider: 'Harvard University (edX)', link: 'https://cs50.harvard.edu/x/', tag: 'Best 1st Year Course' },
          { name: 'Data Structures & Algorithms Specialization', provider: 'UC San Diego (Coursera)', link: 'https://coursera.org', tag: 'Core DSA' },
          { name: 'Programming, Data Structures & Algorithms in Python/C', provider: 'NPTEL (IIT Madras / Kharagpur)', link: 'https://nptel.ac.in', tag: 'College Credit Ready' },
          { name: 'Meta Full-Stack Developer Professional Certificate', provider: 'Meta (Coursera)', link: 'https://coursera.org', tag: 'Web Dev' }
        ],
        certifications: [
          { name: 'AWS Certified Cloud Practitioner / Solutions Architect', issuer: 'Amazon Web Services', value: 'High' },
          { name: 'GitHub Foundations & Actions Certified', issuer: 'GitHub', value: 'Medium-High' },
          { name: 'Oracle Certified Associate: Java SE Programmer', issuer: 'Oracle', value: 'Good for Enterprise' },
          { name: 'Google Associate Cloud Engineer', issuer: 'Google Cloud', value: 'High' }
        ],
        challenges: [
          { name: 'LeetCode (Blind 75 & Top 150 Interview Questions)', type: 'DSA & Interviews', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'CodeChef (Monthly Star Contests & Long Challenges)', type: 'Competitive Coding', icon: '⭐', url: 'https://codechef.com' },
          { name: 'Codeforces (Div 2 / Div 3 Speed Contests)', type: 'Speed & Logic Mastery', icon: '⚡', url: 'https://codeforces.com' },
          { name: 'GeeksforGeeks Practice & POTD', type: 'Topic-wise Preparation', icon: '🟢', url: 'https://practice.geeksforgeeks.org' }
        ]
      },
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber', 'TCS Ninja/Digital', 'Infosys', 'Oracle'],
      codeSample: {
        title: 'Binary Search Algorithm (C++)',
        language: 'cpp',
        code: `// C++ Binary Search - Core CSE Interview Question
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid; // Found target index
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
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
      id: 'ece',
      name: 'Electronics & Communication Engineering (ECE)',
      category: 'circuits',
      icon: '📡',
      color: '#f59e0b',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      welcomeTitle: '⚡ Welcome to the Fusion of Hardware & Software!',
      welcomeMessage: 'ECE engineers bridge physical silicon chips with embedded software. You control microcontrollers, IoT devices, signal processing systems, and telecommunication networks.',
      difficulty: 'Moderate-High (Hardware + Software integration)',
      placementDemand: '⭐⭐⭐⭐ (Huge Core Semiconductor + High Software crossover)',
      coreFocus: 'Embedded Systems, Microcontrollers (ARM Cortex, ESP32), VLSI & Chip Design, Signal Processing, IoT, 5G Telecom.',
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
      domainTools: [
        'Verilog / VHDL & SystemVerilog (VLSI Design)',
        'MATLAB & Simulink (DSP & Communications)',
        'KiCAD / Altium Designer (PCB Design)',
        'Arduino IDE / STM32CubeIDE / Keil uVision'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C Programming, Basic Electronics, Arduino prototyping, Git' },
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
          { name: 'Embedded Systems: Shape The World (Microcontroller)', provider: 'UT Austin (edX)', link: 'https://edx.org', tag: 'Top Embedded Course' },
          { name: 'Digital VLSI Design & Verilog', provider: 'NPTEL (IIT Roorkee)', link: 'https://nptel.ac.in', tag: 'Core VLSI Prep' },
          { name: 'Applied Digital Signal Processing with MATLAB', provider: 'Coursera', link: 'https://coursera.org', tag: 'DSP & Telecom' },
          { name: 'Introduction to Internet of Things (IoT)', provider: 'NPTEL (IIT Kharagpur)', link: 'https://nptel.ac.in', tag: 'IoT Specialization' }
        ],
        certifications: [
          { name: 'Arm Certified Engineer (Embedded Systems)', issuer: 'Arm Architecture', value: 'High for Core' },
          { name: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco', value: 'Top for Telecom & Networks' },
          { name: 'MathWorks Certified MATLAB Associate', issuer: 'MathWorks', value: 'Core Signal Processing' },
          { name: 'IPC PCB Design Certification', issuer: 'IPC Standards', value: 'Hardware Engineering' }
        ],
        challenges: [
          { name: 'Wokwi Simulator (Online ESP32, Arduino & Pi Pico)', type: 'Virtual Hardware Coding', icon: '📟', url: 'https://wokwi.com' },
          { name: 'EDA Playground (Online Verilog / VHDL Simulator)', type: 'VLSI Digital Design', icon: '🔬', url: 'https://edaplayground.com' },
          { name: 'LeetCode (C++ DSA for IT Placement Transition)', type: 'DSA Problem Solving', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'Hackster.io Hardware Hackathons', type: 'IoT & Embedded Projects', icon: '🏆', url: 'https://hackster.io' }
        ]
      },
      topCompanies: ['Qualcomm', 'Texas Instruments', 'Intel', 'NVIDIA', 'Broadcom', 'NXP', 'Bosch', 'Samsung R&D'],
      codeSample: {
        title: 'Embedded C: Reading Analog Sensor & Triggering Alarm',
        language: 'c',
        code: `// Embedded C for Microcontroller / Arduino (Reading Temperature Sensor)
#define SENSOR_PIN A0
#define ALERT_LED_PIN 13
#define THRESHOLD_TEMP 75.0 // Celsius

void setup() {
    pinMode(ALERT_LED_PIN, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    int rawValue = analogRead(SENSOR_PIN);
    float voltage = rawValue * (5.0 / 1023.0);
    float temperatureC = (voltage - 0.5) * 100.0; // TMP36 formula

    if (temperatureC > THRESHOLD_TEMP) {
        digitalWrite(ALERT_LED_PIN, HIGH); // Overheat Alarm!
        Serial.println("ALERT: Overheating Detected!");
    } else {
        digitalWrite(ALERT_LED_PIN, LOW);
    }
    delay(500);
}`
      }
    },
    {
      id: 'eee',
      name: 'Electrical & Electronics Engineering (EEE)',
      category: 'circuits',
      icon: '⚡',
      color: '#ec4899',
      accentBg: 'rgba(236, 72, 153, 0.12)',
      welcomeTitle: '⚡ Welcome to Power, Automation & Electric Mobility!',
      welcomeMessage: 'EEE engineers build the future of Electric Vehicles (EV), Smart Energy Grids, Power Electronics, Battery Management Systems (BMS), and Industrial Automation.',
      difficulty: 'Moderate-High (Circuits, Math & Control Code)',
      placementDemand: '⭐⭐⭐⭐ (EV Boom, Power Sector, Industrial IoT & IT)',
      coreFocus: 'Power Systems, Electric Vehicle (EV) Powertrains, BMS, PLC/SCADA Automation, Control Systems, Microcontrollers.',
      primaryLang: {
        name: 'C & MATLAB/Simulink',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'C is required for programming motor controllers and BMS chips. MATLAB/Simulink is essential for simulating power electronics, smart grids, and control algorithms.'
      },
      secondaryLang: {
        name: 'Python & C++',
        badge: 'Recommended (2nd & 3rd Year)',
        reason: 'Python for smart meter data analytics, EV battery health forecasting, and machine learning in power grids. C++ for industrial robotics and high-speed motor control.'
      },
      domainTools: [
        'MATLAB / Simulink (Simscape Electrical)',
        'PLC Ladder Logic (Siemens TIA Portal / Rockwell)',
        'PSCAD / ETAP (Power Grid Simulation)',
        'Embedded C / CAN Bus Protocol'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C Programming, Circuit Theory, Basic Arduino, Engineering Math' },
        { year: '2nd Year (Sophomore)', focus: 'MATLAB Simulation, Analog/Digital Electronics, Power Electronics basics, DSA fundamentals' },
        { year: '3rd Year (Junior)', focus: 'EV Battery Management System (BMS) simulation, PLC Automation, IoT Power monitoring' },
        { year: '4th Year (Senior)', focus: 'Core Placements (Tesla, L&T, Schneider, Tata Power, ABB) OR Software IT jobs' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🛠️ Core EEE & EV Route (Power, Automation & Electric Vehicles)',
        coreDescription: 'Focus on Electric Vehicles, Battery Management Systems (BMS), Renewable Energy, and Smart Grids.',
        transitionTitle: '💻 Software / IT SDE Transition Route',
        transitionDescription: 'Blueprint for EEE students targeting top Software Development Engineer roles:',
        steps: [
          'Adopt C++ or Java for mastering Data Structures and Object Oriented Programming.',
          'Practice 150+ problems on LeetCode (Focus on Arrays, Strings, Hashing, Recursion, Binary Search).',
          'Learn SQL (Relational Databases) and Git version control.',
          'Build a full-stack dashboard or data analysis project (e.g. EV Fleet Telemetry Web Dashboard).'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Introduction to Battery-Management Systems', provider: 'UC Colorado (Coursera)', link: 'https://coursera.org', tag: 'EV & BMS Core' },
          { name: 'Power Electronics & Grid Systems', provider: 'NPTEL (IIT Delhi)', link: 'https://nptel.ac.in', tag: 'Core Electrical' },
          { name: 'PLC Programming from Scratch (Industrial Automation)', provider: 'Udemy / Siemens', link: 'https://udemy.com', tag: 'Automation' },
          { name: 'Control of Mobile Robots & Systems', provider: 'Georgia Tech (Coursera)', link: 'https://coursera.org', tag: 'Robotics & Control' }
        ],
        certifications: [
          { name: 'Certified LabVIEW Associate Developer (CLAD)', issuer: 'National Instruments', value: 'High in Test/Automation' },
          { name: 'Siemens Certified PLC / SCADA Engineer', issuer: 'Siemens Industrial', value: 'Top for Manufacturing' },
          { name: 'MathWorks Certified MATLAB Associate', issuer: 'MathWorks', value: 'High' }
        ],
        challenges: [
          { name: 'MATLAB Onramp & Simscape Challenges', type: 'Simulink Grid Simulation', icon: '📈', url: 'https://matlab.mathworks.com' },
          { name: 'Wokwi Simulator (Microcontroller & Relays)', type: 'Circuit & Microcontroller Coding', icon: '🔌', url: 'https://wokwi.com' },
          { name: 'LeetCode (C++/Java SDE Prep)', type: 'DSA Placement Preparation', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'Kaggle Energy Prediction Datasets', type: 'Smart Grid & Energy Forecasting', icon: '⚡', url: 'https://kaggle.com' }
        ]
      },
      topCompanies: ['ABB', 'Schneider Electric', 'Siemens', 'L&T', 'Tesla', 'Tata Power', 'Ola Electric', 'Texas Instruments'],
      codeSample: {
        title: 'Python: EV Battery State-of-Charge (SoC) Estimation',
        language: 'python',
        code: `# Python script for Electric Vehicle Battery State of Charge (SoC) Calculation
def calculate_battery_soc(voltage, max_v=4.2, min_v=3.0):
    """
    Estimates Lithium-Ion Battery SoC based on Open Circuit Voltage (OCV)
    """
    if voltage >= max_v:
        return 100.0
    elif voltage <= min_v:
        return 0.0
    
    # Linear interpolation approximation
    soc = ((voltage - min_v) / (max_v - min_v)) * 100.0
    return round(soc, 2)

battery_voltage = 3.82
current_soc = calculate_battery_soc(battery_voltage)
print(f"Current Battery Voltage: {battery_voltage}V -> Estimated SoC: {current_soc}%")`
      }
    },
    {
      id: 'mech',
      name: 'Mechanical & Mechatronics Engineering (MECH)',
      category: 'core_eng',
      icon: '⚙️',
      color: '#10b981',
      accentBg: 'rgba(16, 185, 129, 0.12)',
      welcomeTitle: '🤖 Welcome to Robotics, CAD Automation & Simulation!',
      welcomeMessage: 'Modern Mechanical Engineering is deeply computerized. From autonomous robot arms and self-driving cars to aerodynamic FEA/CFD simulation and CAD script automation, coding makes mechanical systems smart.',
      difficulty: 'Moderate (Math, Physics & Scripting)',
      placementDemand: '⭐⭐⭐⭐ (Core Automation, Robotics, Automotive & High IT Transition)',
      coreFocus: 'Robotics & Mechatronics, CAD/CAM Automation, Finite Element Analysis (FEA), Computational Fluid Dynamics (CFD), Autonomous Drones.',
      primaryLang: {
        name: 'Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'The ultimate scripting language for automating SolidWorks/AutoCAD, processing simulation data, FEA numerical solvers, and robot trajectory calculations.'
      },
      secondaryLang: {
        name: 'C++ & MATLAB',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'C++ is the global industry standard for ROS (Robot Operating System), high-speed physics engines, and robotics controls. MATLAB for vibration and thermal modeling.'
      },
      domainTools: [
        'ROS 2 (Robot Operating System in C++/Python)',
        'SolidWorks API & AutoCAD AutoLISP / Python Scripting',
        'Ansys Workbench / OpenFOAM (CFD & FEA)',
        'Arduino & Raspberry Pi for Mechatronics'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Engineering Mechanics, CAD 3D modeling (SolidWorks/Fusion 360)' },
        { year: '2nd Year (Sophomore)', focus: 'C++ Basics, Arduino for Mechatronics, Numerical Methods in Python, DSA fundamentals' },
        { year: '3rd Year (Junior)', focus: 'ROS (Robot Operating System) in C++/Python, Ansys FEA/CFD scripting, 3D printing project' },
        { year: '4th Year (Senior)', focus: 'Core Placements (Bosch, Tata Motors, L&T, ISRO, Boeing) OR Software IT placements' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🛠️ Core Mechatronics & Automotive Route (Robotics, CAD & Simulation)',
        coreDescription: 'Specialize in Robotics, Autonomous Systems, CAD Scripting, and Thermal/Structural Simulation.',
        transitionTitle: '💻 Software / IT SDE Transition Route',
        transitionDescription: 'Step-by-step roadmap for Mechanical engineers to crack high-paying Software jobs:',
        steps: [
          'Choose C++ or Java for Data Structures (C++ is already close to your mechanical robotics/simulation studies).',
          'Learn basic DSA: Arrays, Hashing, Two Pointers, Linked Lists, Binary Trees on LeetCode.',
          'Learn SQL and build 1 Web project (e.g. Mechanical Spare Parts Inventory or 3D Model Viewer using Three.js/React).',
          'Highlight problem-solving ability, analytical thinking, and code projects on your resume.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Modern Robotics: Mechanics, Planning, and Control', provider: 'Northwestern University (Coursera)', link: 'https://coursera.org', tag: 'Top Robotics' },
          { name: 'Python for Mechanical Engineers & FEA', provider: 'Skill-Lync / Udemy', link: 'https://udemy.com', tag: 'CAD & Simulation' },
          { name: 'Introduction to Robot Operating System (ROS)', provider: 'ConstructSim (edX)', link: 'https://edx.org', tag: 'ROS 2 Core' },
          { name: 'Computer Aided Engineering Design', provider: 'NPTEL (IIT Kanpur)', link: 'https://nptel.ac.in', tag: 'CAD & Engineering' }
        ],
        certifications: [
          { name: 'Certified SOLIDWORKS Associate / Professional (CSWA / CSWP)', issuer: 'Dassault Systèmes', value: 'Industry Standard CAD' },
          { name: 'Autodesk Certified Professional (Inventor / AutoCAD)', issuer: 'Autodesk', value: 'High for Design' },
          { name: 'ROS Developer Certification', issuer: 'The Construct', value: 'Robotics Engineering' }
        ],
        challenges: [
          { name: 'Kaggle Mechanical & Materials Datasets', type: 'Predictive Maintenance ML', icon: '📊', url: 'https://kaggle.com' },
          { name: 'LeetCode (C++/Python SDE Prep)', type: 'DSA Coding Practice', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'GrabCAD Design & Automation Challenges', type: '3D CAD & Modeling', icon: '🛠️', url: 'https://grabcad.com' },
          { name: 'HackerRank Problem Solving (Python/C++)', type: 'Coding Foundations', icon: '⭐', url: 'https://hackerrank.com' }
        ]
      },
      topCompanies: ['Bosch', 'Tata Motors', 'Mahindra', 'L&T', 'Boeing', 'Tesla', 'ISRO', 'Siemens'],
      codeSample: {
        title: 'Python: Cantilever Beam Stress & Deflection Calculation',
        language: 'python',
        code: `# Mechanical Engineering: Cantilever Beam Point Load Analysis
import math

def beam_analysis(length_m, force_n, elasticity_gpa, moment_inertia_m4):
    """
    Calculates Maximum Bending Moment, Maximum Stress, and Tip Deflection
    """
    E = elasticity_gpa * 1e9  # Convert GPa to Pascals
    max_moment = force_n * length_m # N*m
    # Deflection formula for cantilever beam under tip point load: (F * L^3) / (3 * E * I)
    max_deflection = (force_n * math.pow(length_m, 3)) / (3 * E * moment_inertia_m4)
    
    return max_moment, max_deflection

L, F = 2.0, 5000.0  # 2 meters beam, 5000 N tip load
moment, deflection = beam_analysis(L, F, 200.0, 8.33e-6) # Steel properties
print(f"Max Bending Moment: {moment:.1f} N*m")
print(f"Max Tip Deflection: {deflection*1000:.2f} mm")`
      }
    },
    {
      id: 'civil',
      name: 'Civil & Structural Engineering (CIVIL)',
      category: 'core_eng',
      icon: '🏗️',
      color: '#a855f7',
      accentBg: 'rgba(168, 85, 247, 0.12)',
      welcomeTitle: '🏗️ Welcome to Smart Cities, BIM Automation & Spatial Tech!',
      welcomeMessage: 'Civil Engineering in the 21st century revolves around Building Information Modeling (BIM), Geographic Information Systems (GIS), structural automation scripts, and smart infrastructure sensor monitoring.',
      difficulty: 'Moderate (Structural Math & Visual Modeling)',
      placementDemand: '⭐⭐⭐ (Infrastructure Boom, BIM Tech & IT Transition)',
      coreFocus: 'Structural Analysis, BIM Automation (Revit/Dynamo), GIS Spatial Analysis, Smart City Sensors, Geotechnical Optimization.',
      primaryLang: {
        name: 'Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Automates structural load calculations, GIS spatial mapping (QGIS/ArcGIS Python plugins), environmental modeling, and automated site data analysis.'
      },
      secondaryLang: {
        name: 'C# (.NET) & SQL',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'C# is the native language for building Autodesk Revit and AutoCAD plugins (BIM Automation). SQL is critical for managing urban planning and GIS databases.'
      },
      domainTools: [
        'Dynamo & Grasshopper (Visual Parametric Scripting)',
        'Autodesk Revit API & AutoCAD .NET / AutoLISP',
        'QGIS / ArcGIS Python API (GeoPandas, Shapely)',
        'ETABS / STAAD.Pro (Structural Analysis API)'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Programming, Engineering Graphics, AutoCAD basics, Math' },
        { year: '2nd Year (Sophomore)', focus: 'Structural Analysis, Python for GeoPandas/GIS, SQL databases, Dynamo visual scripting' },
        { year: '3rd Year (Junior)', focus: 'BIM Automation with C# Revit API, STAAD.Pro/ETABS structural scripting, Green building project' },
        { year: '4th Year (Senior)', focus: 'Core Placements (L&T, Afcons, Atkins, Bentley Systems) OR Software IT roles' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🛠️ Core BIM & Structural Tech Route (Smart Infrastructure & GIS)',
        coreDescription: 'Master BIM Modeling, Computational Structural Design, GIS mapping, and infrastructure project management.',
        transitionTitle: '💻 Software / IT SDE Transition Route',
        transitionDescription: 'Roadmap for Civil engineering students looking to switch to IT/Software jobs:',
        steps: [
          'Learn Java or Python + Data Structures & Algorithms (DSA).',
          'Practice basic-to-medium problems on LeetCode / GeeksforGeeks.',
          'Learn Full-Stack Web Development (HTML, CSS, JavaScript, React) or SQL Database Engineering.',
          'Build an interactive Web GIS or Real Estate mapping web app as your capstone project.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'BIM: From Sketch to Digital Twin (Revit & Dynamo)', provider: 'ETH Zurich (edX)', link: 'https://edx.org', tag: 'Top BIM Course' },
          { name: 'Spatial Data Science and Applications (GIS & Python)', provider: 'Yonsei University (Coursera)', link: 'https://coursera.org', tag: 'GIS Specialization' },
          { name: 'Advanced Concrete Technology & Structural Analysis', provider: 'NPTEL (IIT Madras)', link: 'https://nptel.ac.in', tag: 'Core Structural' },
          { name: 'Building Information Modeling with Revit API', provider: 'Udemy', link: 'https://udemy.com', tag: 'Revit C# Coding' }
        ],
        certifications: [
          { name: 'Autodesk Certified Professional: Revit for Structural / Architectural Design', issuer: 'Autodesk', value: 'Global BIM Standard' },
          { name: 'Bentley Systems Structural Certification (STAAD.Pro)', issuer: 'Bentley', value: 'High in Core' },
          { name: 'Esri Technical Certification (ArcGIS / Spatial)', issuer: 'Esri GIS', value: 'Top for GIS/Urban' }
        ],
        challenges: [
          { name: 'Kaggle Geospatial Analytics Datasets', type: 'Satellite & GIS Python Analysis', icon: '🗺️', url: 'https://kaggle.com' },
          { name: 'LeetCode (Python/Java DSA for IT)', type: 'DSA Problem Solving', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'HackerRank SQL Challenges', type: 'Database Query Mastery', icon: '💾', url: 'https://hackerrank.com' },
          { name: 'CodeChef Beginners Track', type: 'Logic & Algorithm Speed', icon: '⭐', url: 'https://codechef.com' }
        ]
      },
      topCompanies: ['L&T Construction', 'Atkins (SNC-Lavalin)', 'Bentley Systems', 'Afcons', 'AECOM', 'Jacobs', 'Tata Projects'],
      codeSample: {
        title: 'Python: Haversine Formula for GIS GPS Distance Mapping',
        language: 'python',
        code: `# Civil & GIS Engineering: GPS Distance Calculation between Construction Sites
import math

def haversine_distance_km(lat1, lon1, lat2, lon2):
    """
    Calculates great-circle distance between two GPS coordinates on Earth
    """
    R = 6371.0  # Earth radius in kilometers
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    
    a = math.sin(dLat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

# Site A (Delhi) to Site B (Noida Metro Project)
dist = haversine_distance_km(28.6139, 77.2090, 28.5355, 77.3910)
print(f"Geodesic Distance between Construction Sites: {dist:.2f} km")`
      }
    },
    {
      id: 'aids',
      name: 'AI & Data Science (AIDS / AIML)',
      category: 'ai_cyber',
      icon: '🤖',
      color: '#06b6d4',
      accentBg: 'rgba(6, 182, 212, 0.12)',
      welcomeTitle: '🧠 Welcome to Artificial Intelligence, Machine Learning & Big Data!',
      welcomeMessage: 'As an AI & Data Science engineer, you are shaping the future of intelligent systems, neural networks, Generative AI (LLMs), Computer Vision, and Predictive Analytics.',
      difficulty: 'High in Math, Statistics & Matrix Computing',
      placementDemand: '⭐⭐⭐⭐⭐ (Exploding Market for AI & Data Engineers)',
      coreFocus: 'Machine Learning, Deep Learning (PyTorch), Natural Language Processing (NLP), Large Language Models (LLMs), Big Data Pipelines, Vector DBs.',
      primaryLang: {
        name: 'Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'The uncontested global king of AI, Machine Learning, Data Science, and Deep Learning with PyTorch, TensorFlow, Pandas, and NumPy.'
      },
      secondaryLang: {
        name: 'SQL, R & C++',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'SQL is mandatory for data querying from warehouses (Snowflake, BigQuery). C++ is essential for low-latency AI model inference, CUDA GPU programming, and TensorRT optimization.'
      },
      domainTools: [
        'PyTorch & Hugging Face (Deep Learning & Transformers)',
        'Pandas, NumPy, Scikit-Learn (Data Wrangling & ML)',
        'Jupyter Lab, MLflow, LangChain / LlamaIndex (GenAI)',
        'Vector Databases (Chroma, Pinecone, Milvus)'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Mastery, Linear Algebra, Probability & Statistics, Git, Jupyter' },
        { year: '2nd Year (Sophomore)', focus: 'Data Wrangling (Pandas/NumPy), SQL, Classical ML (Scikit-Learn), DSA in Python/C++' },
        { year: '3rd Year (Junior)', focus: 'Deep Learning (PyTorch), NLP & Computer Vision, Generative AI (LLM fine-tuning, RAG)' },
        { year: '4th Year (Senior)', focus: 'Kaggle Competitions (Expert/Master), Research Paper implementation, AI Placements' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Direct AI / ML Engineer & Data Scientist Track',
        coreDescription: 'Standard career track for Machine Learning Engineers, Data Analysts, MLOps Engineers, and GenAI specialists.',
        steps: [
          'Master Python programming and mathematical foundations (Calculus, Linear Algebra, Probability).',
          'Participate actively in Kaggle competitions to build proven problem-solving credentials.',
          'Build end-to-end AI applications (e.g. RAG Q&A chatbot, Computer Vision Object Detector) deployed on Hugging Face or Streamlit Cloud.',
          'Learn basic DSA in Python/C++ for company technical screening rounds.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Machine Learning Specialization', provider: 'Andrew Ng / DeepLearning.AI (Coursera)', link: 'https://coursera.org', tag: 'Gold Standard ML' },
          { name: 'Deep Learning Specialization (Neural Networks & PyTorch)', provider: 'DeepLearning.AI (Coursera)', link: 'https://coursera.org', tag: 'Deep Learning Core' },
          { name: 'Applied Data Science with Python', provider: 'University of Michigan (Coursera)', link: 'https://coursera.org', tag: 'Data Science' },
          { name: 'Data Mining & Machine Learning', provider: 'NPTEL (IIT Kharagpur)', link: 'https://nptel.ac.in', tag: 'College Credit' }
        ],
        certifications: [
          { name: 'TensorFlow Developer Certificate / PyTorch Deep Learning Certificate', issuer: 'Google / Linux Foundation', value: 'High for CV/NLP' },
          { name: 'AWS Certified Machine Learning - Specialty', issuer: 'Amazon Web Services', value: 'Top Industry Value' },
          { name: 'Databricks Certified Machine Learning Associate / Professional', issuer: 'Databricks', value: 'High in Big Data' }
        ],
        challenges: [
          { name: 'Kaggle (Competitions, Notebooks & Grandmaster Tracks)', type: 'Data Science Competitions', icon: '🏆', url: 'https://kaggle.com' },
          { name: 'DrivenData (Social Impact & Machine Learning Challenges)', type: 'Real-world ML Contests', icon: '🌍', url: 'https://drivendata.org' },
          { name: 'Hugging Face Spaces (Build & Host AI Demos)', type: 'LLM & GenAI Projects', icon: '🤗', url: 'https://huggingface.co' },
          { name: 'LeetCode (Python DSA & SQL 50 Badge)', type: 'Coding & SQL Interviews', icon: '🔥', url: 'https://leetcode.com' }
        ]
      },
      topCompanies: ['OpenAI', 'Google DeepMind', 'Microsoft', 'NVIDIA', 'Amazon AWS', 'Fractal Analytics', 'Tiger Analytics', 'Meta'],
      codeSample: {
        title: 'Python: Neural Network Forward Pass (PyTorch)',
        language: 'python',
        code: `# PyTorch: Simple Feedforward Neural Network for Classification
import torch
import torch.nn as nn

class ClassifierNN(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super(ClassifierNN, self).__init__()
        self.layer1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        out = self.layer1(x)
        out = self.relu(out)
        out = self.layer2(out)
        return out

# Initialize model with 10 features, 32 hidden neurons, 2 output classes
model = ClassifierNN(input_dim=10, hidden_dim=32, output_dim=2)
dummy_input = torch.randn(4, 10) # Batch size of 4
output = model(dummy_input)
print("Model Prediction Logits Shape:", output.shape)`
      }
    },
    {
      id: 'cyber',
      name: 'Cyber Security & Forensics (CSE-CY / CYS)',
      category: 'ai_cyber',
      icon: '🛡️',
      color: '#e11d48',
      accentBg: 'rgba(225, 29, 72, 0.12)',
      welcomeTitle: '🔒 Welcome to Ethical Hacking, Defense & Cryptography!',
      welcomeMessage: 'Cyber Security engineers protect digital infrastructure from sophisticated attacks. You audit systems, find zero-day vulnerabilities, reverse engineer malware, and build secure network defenses.',
      difficulty: 'High in System Internals, OS & Networking',
      placementDemand: '⭐⭐⭐⭐⭐ (Critical shortage of qualified security specialists)',
      coreFocus: 'Penetration Testing, Ethical Hacking, Network Security, Reverse Engineering, Cryptography, SOC Analysis, Cloud Security.',
      primaryLang: {
        name: 'Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'The ultimate weapon for building penetration testing scripts, packet sniffing tools (Scapy), automated exploit scripts, and security log analyzers.'
      },
      secondaryLang: {
        name: 'C / C++, Bash & Go',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'C/C++ for memory corruption exploits (Buffer Overflows), kernel exploits, and reverse engineering. Go for writing fast, concurrent network scanning and security tools.'
      },
      domainTools: [
        'Wireshark, Nmap, Burp Suite (Network & Web Pentesting)',
        'Ghidra / IDA Pro / x64dbg (Binary Reverse Engineering)',
        'Metasploit Framework, Kali Linux',
        'Splunk / Elastic SIEM (SOC Operations)'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Scripting, Linux CLI (Ubuntu/Kali), Computer Networking (OSI, TCP/IP)' },
        { year: '2nd Year (Sophomore)', focus: 'C Programming, Memory Internals (Stack/Heap), Cryptography basics, CTF challenges' },
        { year: '3rd Year (Junior)', focus: 'Web Security (OWASP Top 10), Reverse Engineering (Ghidra), Bash/Go tools, Bug Bounty' },
        { year: '4th Year (Senior)', focus: 'Security Analyst / Pentester placements (PwC, EY, CrowdStrike, Cisco) OR SDE security roles' }
      ],
      dualTrack: {
        hasTransition: false,
        coreTitle: 'Direct Cyber Security & Ethical Hacking Track',
        coreDescription: 'Standard career track for SOC Analysts, Penetration Testers, Security Engineers, and Vulnerability Researchers.',
        steps: [
          'Master Linux terminal operations, Bash scripting, and Python network programming.',
          'Play Catch-the-Flag (CTF) challenges on TryHackMe, Hack The Box, and PicoCTF.',
          'Master OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, IDOR) on PortSwigger Web Security Academy.',
          'Build custom tools (e.g. Port Scanner, Keylogger detector, Log anomaly detector in Python).'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Introduction to Cyber Security Specialization', provider: 'NYU (Coursera)', link: 'https://coursera.org', tag: 'Core Fundamentals' },
          { name: 'Ethical Hacking & Penetration Testing', provider: 'NPTEL (IIT Kharagpur)', link: 'https://nptel.ac.in', tag: 'Academic Credit' },
          { name: 'PortSwigger Web Security Academy', provider: 'PortSwigger (Free)', link: 'https://portswigger.net/web-security', tag: 'Top Web Security' },
          { name: 'Practical Ethical Hacking (TCM Security)', provider: 'TCM Academy', link: 'https://tcm-sec.com', tag: 'Hands-on Pentesting' }
        ],
        certifications: [
          { name: 'CompTIA Security+ (SY0-701)', issuer: 'CompTIA', value: 'Best 1st Industry Cert' },
          { name: 'Certified Ethical Hacker (CEH) / Practical', issuer: 'EC-Council', value: 'Recognized by HR' },
          { name: 'eJPT (eLearnSecurity Junior Penetration Tester)', issuer: 'INE Security', value: 'Hands-on Gold Standard' },
          { name: 'Cisco Certified CyberOps Associate', issuer: 'Cisco', value: 'High for SOC roles' }
        ],
        challenges: [
          { name: 'TryHackMe (Guided Security Rooms & Paths)', type: 'Hands-on Pentesting Labs', icon: '🎯', url: 'https://tryhackme.com' },
          { name: 'Hack The Box (HTB Real Machine Exploits)', type: 'Advanced CTF & Pwning', icon: '📦', url: 'https://hackthebox.com' },
          { name: 'PicoCTF (Beginner friendly CTF contests)', type: 'Student CTF Challenges', icon: '🚩', url: 'https://picoctf.org' },
          { name: 'OverTheWire (Bandit Linux Wargame)', type: 'Linux CLI & Security Basics', icon: '💻', url: 'https://overthewire.org' }
        ]
      },
      topCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Cisco Security', 'FireEye / Mandiant', 'PwC', 'Deloitte', 'Qualys', 'Kroll'],
      codeSample: {
        title: 'Python: Simple TCP Port Scanner Script',
        language: 'python',
        code: `# Python Cyber Security: Multi-Port Scanner for Security Auditing
import socket

def scan_port(host, port):
    """
    Attempts TCP 3-way handshake on target host and port
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5) # Short timeout for speed
    try:
        result = s.connect_ex((host, port))
        if result == 0:
            print(f"[+] Port {port:5d} is OPEN on {host}")
        s.close()
    except Exception as e:
        pass

target_host = "127.0.0.1"
common_ports = [21, 22, 80, 443, 3306, 8080]
print(f"Scanning target {target_host} for open ports...")
for p in common_ports:
    scan_port(target_host, p)`
      }
    },
    {
      id: 'chem_bio',
      name: 'Chemical & Biotechnology Engineering (CHEM / BT / BME)',
      category: 'specialized',
      icon: '🧬',
      color: '#84cc16',
      accentBg: 'rgba(132, 204, 22, 0.12)',
      welcomeTitle: '🧪 Welcome to Computational Biology, Drug AI & Process Simulation!',
      welcomeMessage: 'Biotech and Chemical engineers use computational tools to model chemical reactions, analyze genomic sequences, simulate industrial reactors, and discover new pharmaceuticals using AI.',
      difficulty: 'Moderate (Organic Chemistry, Biology & Data)',
      placementDemand: '⭐⭐⭐ (Pharma, Bio-Tech, Process Engineering & High IT Transition)',
      coreFocus: 'Bioinformatics, Computational Drug Discovery, Chemical Process Simulation, Genomic Sequence Analysis, Molecular Dynamics.',
      primaryLang: {
        name: 'Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'Python is the undisputed king of Bioinformatics (Biopython), Cheminformatics (RDKit), molecular simulations, and biological machine learning.'
      },
      secondaryLang: {
        name: 'R & MATLAB / C++',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'R is the global standard for statistical genomics, microarray data, and clinical trial biostatistics. C++ for high-performance molecular dynamics solvers (GROMACS, LAMMPS).'
      },
      domainTools: [
        'Biopython & RDKit (Cheminformatics & DNA Analysis)',
        'Aspen Plus / DWSIM (Chemical Process Simulation)',
        'PyMOL & AlphaFold (Protein Structure Modeling)',
        'GROMACS / AutoDock (Molecular Docking)'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'Python Basics, Chemistry/Biology Fundamentals, Biopython introduction, Git' },
        { year: '2nd Year (Sophomore)', focus: 'R for Biostatistics, Sequence Alignment algorithms (BLAST logic in Python), SQL' },
        { year: '3rd Year (Junior)', focus: 'Computational Drug Discovery (RDKit / AutoDock), Aspen Plus process simulation' },
        { year: '4th Year (Senior)', focus: 'Core Pharma/Biotech Placements (Biocon, Dr. Reddy, Reliance Chem) OR Software IT jobs' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🛠️ Core Bioinformatics & Pharma Tech Route',
        coreDescription: 'Specialize in Drug Discovery, Genomics, Bioinformatics, and Chemical Process Modeling.',
        transitionTitle: '💻 Software / Data Science Transition Route',
        transitionDescription: 'Roadmap for Biotech/Chem students targeting IT, Data Analyst, and Software jobs:',
        steps: [
          'Leverage your Python skills to master Data Analysis (Pandas, NumPy, Matplotlib) and SQL.',
          'Learn basic DSA (Arrays, Strings, HashMaps, Trees) in Python or Java on LeetCode.',
          'Build 1 Data Science / Machine Learning capstone project (e.g. Disease Prediction Model or Clinical Data Dashboard).',
          'Apply for Data Analyst, Business Analyst, and Junior Software Engineer roles.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Bioinformatics Specialization (Genomic Data Science)', provider: 'UC San Diego (Coursera)', link: 'https://coursera.org', tag: 'Top Bioinformatics' },
          { name: 'Computational Systems Biology', provider: 'NPTEL (IIT Madras)', link: 'https://nptel.ac.in', tag: 'Core Biotechnology' },
          { name: 'Chemical Process Simulation with DWSIM/Aspen', provider: 'Udemy', link: 'https://udemy.com', tag: 'Process Engineering' },
          { name: 'Genomic Data Science with Python & R', provider: 'Johns Hopkins (Coursera)', link: 'https://coursera.org', tag: 'Genomics' }
        ],
        certifications: [
          { name: 'SAS Certified Clinical Trials Programmer', issuer: 'SAS Institute', value: 'High in Pharma' },
          { name: 'Aspen Plus Certified User', issuer: 'AspenTech', value: 'Gold Standard in Chemical' },
          { name: 'MathWorks Certified MATLAB Associate', issuer: 'MathWorks', value: 'High' }
        ],
        challenges: [
          { name: 'Rosalind (Bioinformatics Coding Challenges)', type: 'DNA & Protein Algorithm Problems', icon: '🧬', url: 'https://rosalind.info' },
          { name: 'Kaggle Healthcare & Molecule Contests', type: 'Drug Discovery & Medical AI', icon: '💊', url: 'https://kaggle.com' },
          { name: 'LeetCode (Python DSA for IT Placements)', type: 'DSA Problem Solving', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'HackerRank Python Track', type: 'Python Logic Practice', icon: '⭐', url: 'https://hackerrank.com' }
        ]
      },
      topCompanies: ['Biocon', 'Dr. Reddy’s Labs', 'Reliance Life Sciences', 'Pfizer', 'Schrödinger', 'Syngene', 'Thermo Fisher'],
      codeSample: {
        title: 'Python: DNA Sequence GC-Content & Reverse Complement',
        language: 'python',
        code: `# Biotechnology: DNA Sequence Analysis in Python
def analyze_dna(sequence):
    """
    Calculates GC-Content % and finds the Reverse Complement of a DNA strand
    """
    seq = sequence.upper()
    gc_count = seq.count('G') + seq.count('C')
    gc_percentage = (gc_count / len(seq)) * 100.0
    
    complement = {'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'}
    reverse_comp = "".join(complement.get(base, 'N') for base in reversed(seq))
    
    return round(gc_percentage, 2), reverse_comp

dna_strand = "ATGCGATCGATCGATCGAATCGCTA"
gc_pct, rev_comp = analyze_dna(dna_strand)
print(f"DNA Strand: {dna_strand}")
print(f"GC-Content: {gc_pct}%")
print(f"Reverse Complement: {rev_comp}")`
      }
    },
    {
      id: 'aero_auto',
      name: 'Aerospace & Automobile Engineering (AERO / AUTO)',
      category: 'specialized',
      icon: '🚀',
      color: '#f97316',
      accentBg: 'rgba(249, 115, 22, 0.12)',
      welcomeTitle: '🚀 Welcome to Flight Dynamics, Autonomous Driving & Avionics!',
      welcomeMessage: 'Aerospace and Automobile engineers design supersonic aircraft, autonomous vehicles, rockets, flight telemetry computers, and smart automotive ECUs.',
      difficulty: 'High in Aerodynamics, Dynamics & Control Math',
      placementDemand: '⭐⭐⭐⭐ (SpaceTech, Defense, EV Automotive Boom & Software crossover)',
      coreFocus: 'Flight Control Dynamics, Avionics Software, Autonomous Vehicle Navigation, CFD Aerodynamics, Telemetry & Sensor Fusion.',
      primaryLang: {
        name: 'C++ & Python',
        badge: 'Must Learn (1st & 2nd Year)',
        reason: 'C++ is mandatory for hard real-time flight control computers, autonomous vehicle sensor fusion, and ROS 2. Python for aerodynamics data, flight telemetry, and CFD scripts.'
      },
      secondaryLang: {
        name: 'MATLAB / Simulink & C',
        badge: 'Highly Recommended (2nd & 3rd Year)',
        reason: 'MATLAB/Simulink is the worldwide aerospace standard for auto-generating DO-178C flight control code and vehicle suspension/traction modeling.'
      },
      domainTools: [
        'MATLAB / Simulink (Aerospace Blockset)',
        'ROS 2 (Robot Operating System / Autonomous Drones)',
        'Ansys Fluent / OpenFOAM (CFD Aerodynamic Simulation)',
        'CANape / CANoe (Automotive ECU Communication)'
      ],
      coreRoadmap: [
        { year: '1st Year (Freshman)', focus: 'C/C++ Programming, Physics of Flight/Automotive, Engineering Math, Git' },
        { year: '2nd Year (Sophomore)', focus: 'MATLAB & Simulink for Dynamics, Python for Telemetry analysis, DSA basics' },
        { year: '3rd Year (Junior)', focus: 'Flight Control / Autonomous driving simulation in ROS, Ansys CFD aerodynamics project' },
        { year: '4th Year (Senior)', focus: 'Core Placements (ISRO, DRDO, Boeing, Airbus, Tesla, Mahindra) OR Software roles' }
      ],
      dualTrack: {
        hasTransition: true,
        coreTitle: '🛠️ Core Aerospace & Autonomous Vehicle Route',
        coreDescription: 'Focus on Flight Dynamics, Avionics, Drone Autopilot (PX4), and Automotive ECUs.',
        transitionTitle: '💻 Software / IT SDE Transition Route',
        transitionDescription: 'Roadmap for Aero/Auto students targeting top Software Engineering jobs:',
        steps: [
          'Choose C++ as your primary coding language (you already use it for physics & simulations).',
          'Practice 200+ DSA questions on LeetCode (Focus on Graphs, BFS/DFS, Trees, Hashing).',
          'Learn Database Management Systems (SQL) & Operating Systems basics.',
          'Build an interactive 3D Vehicle Telemetry Dashboard using React, Node.js & Three.js.'
        ]
      },
      moocsAndCerts: {
        moocs: [
          { name: 'Self-Driving Cars Specialization', provider: 'University of Toronto (Coursera)', link: 'https://coursera.org', tag: 'Top Autonomous Vehicle' },
          { name: 'Flight Dynamics & Control', provider: 'NPTEL (IIT Kanpur)', link: 'https://nptel.ac.in', tag: 'Core Aerospace' },
          { name: 'Introduction to Autonomous Drone Navigation with ROS', provider: 'edX', link: 'https://edx.org', tag: 'Drone Robotics' },
          { name: 'Automotive Embedded Systems & CAN Bus', provider: 'Udemy', link: 'https://udemy.com', tag: 'Automotive ECU' }
        ],
        certifications: [
          { name: 'MathWorks Certified MATLAB Associate / Professional', issuer: 'MathWorks', value: 'High in Aerospace' },
          { name: 'Certified SOLIDWORKS Professional (CSWP)', issuer: 'Dassault Systèmes', value: 'High for CAD' },
          { name: 'Ansys Certified Simulation Professional (CFD)', issuer: 'Ansys', value: 'High in Aerodynamics' }
        ],
        challenges: [
          { name: 'PX4 Autopilot & ArduPilot Open Source Simulators', type: 'Drone & Aircraft Coding', icon: '🛸', url: 'https://px4.io' },
          { name: 'CARLA Autonomous Driving Simulator', type: 'Self-Driving AI Simulation', icon: '🚗', url: 'https://carla.org' },
          { name: 'LeetCode (C++ DSA for Placements)', type: 'DSA Coding Practice', icon: '🔥', url: 'https://leetcode.com' },
          { name: 'Kaggle Space & Flight Datasets', type: 'Telemetry Data Analysis', icon: '🚀', url: 'https://kaggle.com' }
        ]
      },
      topCompanies: ['ISRO', 'DRDO', 'Boeing', 'Airbus', 'Collins Aerospace', 'Tesla', 'Mahindra Racing', 'Mercedes-Benz R&D'],
      codeSample: {
        title: 'Python: Rocket Trajectory & Gravity Turn Calculator',
        language: 'python',
        code: `# Aerospace Engineering: Rocket Altitude & Velocity Kinematics
import math

def rocket_stage_burn(dry_mass_kg, fuel_mass_kg, thrust_n, burn_time_s, isp_s):
    """
    Calculates final velocity (Tsiolkovsky rocket equation) and burn acceleration
    """
    g0 = 9.80665  # Earth gravitational acceleration (m/s^2)
    initial_mass = dry_mass_kg + fuel_mass_kg
    final_mass = dry_mass_kg
    
    # Delta-V formula = Isp * g0 * ln(m0 / mf)
    delta_v = isp_s * g0 * math.log(initial_mass / final_mass)
    avg_thrust_acc = (thrust_n / (initial_mass / 2 + final_mass / 2)) - g0
    
    return round(delta_v, 2), round(avg_thrust_acc, 2)

# Small sounding rocket stage calculation
dv, acc = rocket_stage_burn(dry_mass_kg=50.0, fuel_mass_kg=150.0, thrust_n=4000.0, burn_time_s=12.0, isp_s=250.0)
print(f"Calculated Stage Delta-V: {dv} m/s")
print(f"Estimated Net Acceleration: {acc} m/s^2 (~{acc/9.81:.1f} Gs)")`
      }
    }
  ];

  // Filtered list based on selected category
  const filteredBranches = branchData.filter(b => activeCategory === 'all' || b.category === activeCategory);
  const currentBranch = branchData.find(b => b.id === selectedBranch) || branchData[0];

  // Handle Smart Advisor Quiz calculation
  const handleRunAdvisor = () => {
    const branchInfo = branchData.find(b => b.id === quizBranch) || branchData[0];
    let recommendedPrimary = 'Python';
    let recommendedSecondary = 'C++';
    let nextStep = '';
    let projects = [];

    if (quizGoal === 'sde') {
      recommendedPrimary = quizBranch === 'cse' ? 'C++ or Java (for DSA)' : 'C++ (DSA) + Python (Web/Scripting)';
      recommendedSecondary = 'JavaScript / TypeScript (Full-Stack)';
      nextStep = `Start 60-day DSA plan on LeetCode solving 2 questions daily in ${recommendedPrimary.split(' ')[0]}. Build 1 Full-Stack project with database.`;
      projects = ['E-Commerce Store with Payment Integration', 'Real-Time Chat App with WebSockets', 'Collaborative Code Editor'];
    } else if (quizGoal === 'core') {
      recommendedPrimary = branchInfo.primaryLang.name;
      recommendedSecondary = branchInfo.secondaryLang.name;
      nextStep = `Master ${branchInfo.primaryLang.name} and build 2 domain hardware/simulation projects using ${branchInfo.domainTools[0]}.`;
      projects = [`Domain Project for ${branchInfo.name}`, 'Automation & Simulation Pipeline', 'Hardware / Sensor Interfacing System'];
    } else if (quizGoal === 'ai_ds') {
      recommendedPrimary = 'Python (NumPy, Pandas, PyTorch)';
      recommendedSecondary = 'SQL & C++ (Inference)';
      nextStep = 'Complete Andrew Ng ML Specialization on Coursera and participate in your first Kaggle competition.';
      projects = ['Generative AI RAG Q&A System', 'Computer Vision Object Detection App', 'Predictive Stock/Sensor Analytics Dashboard'];
    } else if (quizGoal === 'cyber') {
      recommendedPrimary = 'Python & Linux Bash';
      recommendedSecondary = 'C / C++ (Memory Internals)';
      nextStep = 'Create a free TryHackMe account and complete the "Pre-Security" and "Complete Beginner" paths.';
      projects = ['Automated Port Scanner & Vulnerability Checker', 'Packet Sniffer & Analyzer', 'Password Strength & Hasher Tool'];
    } else { // higher studies / gate
      recommendedPrimary = 'C & Python';
      recommendedSecondary = 'MATLAB or C++';
      nextStep = 'Focus on Engineering Mathematics, core branch theory, and competitive academic coding.';
      projects = ['Research Paper Implementation Project', 'Numerical Simulation Solver', 'Algorithm Benchmark Suite'];
    }

    setQuizResult({
      branchName: branchInfo.name,
      recommendedPrimary,
      recommendedSecondary,
      nextStep,
      projects,
      topCert: branchInfo.moocsAndCerts.certifications[0]?.name || 'AWS Cloud Practitioner',
      topChallenge: branchInfo.moocsAndCerts.challenges[0]?.name || 'LeetCode'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '28px' }}>🎓</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
              Which Programming Language to Pick? (B.Tech Branches & Language Career Guide)
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.5' }}>
              Explore comprehensive 4-year learning roadmaps either by your <strong>Engineering Branch</strong> (CSE, ECE, Mech, Civil, AI/DS...) or directly by <strong>Programming Language</strong> (C, C++, Java, Python, JavaScript, Go, Rust)!
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Branch vs Language */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setViewMode('branch')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: viewMode === 'branch' ? '2px solid #38bdf8' : '1px solid #334155',
              background: viewMode === 'branch' ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
              color: viewMode === 'branch' ? '#38bdf8' : '#94a3b8',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: viewMode === 'branch' ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
            }}
          >
            <span>🎓</span>
            <span>Explore by B.Tech Branch (4-Year Roadmap)</span>
          </button>

          <button
            onClick={() => setViewMode('language')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: viewMode === 'language' ? '2px solid #f59e0b' : '1px solid #334155',
              background: viewMode === 'language' ? 'rgba(245, 158, 11, 0.2)' : '#0f172a',
              color: viewMode === 'language' ? '#f59e0b' : '#94a3b8',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: viewMode === 'language' ? '0 0 15px rgba(245, 158, 11, 0.25)' : 'none'
            }}
          >
            <span>🎯</span>
            <span>Explore by Programming Language (C, C++, Java, Python, JS, Go, Rust)</span>
          </button>
        </div>
      </div>

      {viewMode === 'language' ? (
        <LanguageCareerGuide />
      ) : (
        <>
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

      {/* ── Horizontal Branch Selector Buttons ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        {filteredBranches.map(b => {
          const isSelected = selectedBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: isSelected ? `2px solid ${b.color}` : '1px solid #334155',
                background: isSelected ? b.accentBg : '#0f172a',
                color: isSelected ? b.color : '#cbd5e1',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? `0 0 16px ${b.color}25` : 'none'
              }}
            >
              <span style={{ fontSize: '20px' }}>{b.icon}</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ── Dynamic Branch Welcome & Context Header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${currentBranch.accentBg} 0%, rgba(15, 23, 42, 0.8) 100%)`,
        borderRadius: '14px',
        padding: '20px 24px',
        border: `1.5px solid ${currentBranch.color}60`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: `0 8px 30px ${currentBranch.color}15`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{
              background: currentBranch.color,
              color: '#050510',
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.5px'
            }}>
              BRANCH SELECTED
            </span>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: '800', color: currentBranch.color }}>
              {currentBranch.welcomeTitle}
            </h3>
            <p style={{ margin: '6px 0 0 0', color: '#f1f5f9', fontSize: '13.5px', lineHeight: '1.5', maxWidth: '850px' }}>
              {currentBranch.welcomeMessage}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'right' }}>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>Placement Demand:</span>
            <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#fbbf24', cursor: 'help' }} title={currentBranch.placementDemand}>
              {currentBranch.placementDemand.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Quick Branch Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <span style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' }}>
            🎯 <strong>Core Focus:</strong> {currentBranch.coreFocus}
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
          { id: 'moocs_challenges', label: '🏆 MOOCs, Certs & LeetCode/Kaggle', icon: '🏆' },
          { id: 'codepreview', label: '💻 Branch Code Preview', icon: '💻' },
          { id: 'advisor_quiz', label: '🤖 Smart Branch Advisor Quiz', icon: '🤖' },
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
                background: isActive ? '#38bdf8' : 'rgba(30, 41, 59, 0.6)',
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

      {/* ── SUB TAB 1: Which Language & 4-Year Plan ── */}
      {activeSubTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Language Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {/* Primary Language Card */}
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '18px',
              border: `1.5px solid ${currentBranch.color}`,
              boxShadow: `0 0 15px ${currentBranch.color}15`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: currentBranch.color, textTransform: 'uppercase' }}>
                  {currentBranch.primaryLang.badge}
                </span>
                <span style={{ fontSize: '18px' }}>🥇</span>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#f8fafc', fontWeight: '800' }}>
                Primary: {currentBranch.primaryLang.name}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {currentBranch.primaryLang.reason}
              </p>
            </div>

            {/* Secondary Language Card */}
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '18px',
              border: '1.5px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', textTransform: 'uppercase' }}>
                  {currentBranch.secondaryLang.badge}
                </span>
                <span style={{ fontSize: '18px' }}>🥈</span>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#f8fafc', fontWeight: '800' }}>
                Secondary: {currentBranch.secondaryLang.name}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {currentBranch.secondaryLang.reason}
              </p>
            </div>

            {/* Domain & Hardware Tools */}
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '18px',
              border: '1.5px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#a855f7', textTransform: 'uppercase' }}>
                  Domain & Industry Stack
                </span>
                <span style={{ fontSize: '18px' }}>🛠️</span>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', color: '#f8fafc', fontWeight: '800' }}>
                Specialized Tools
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
                {currentBranch.domainTools.map((tool, i) => (
                  <li key={i}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4-Year Milestone Roadmap */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid #334155'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅</span> 4-Year B.Tech Milestone Roadmap for {currentBranch.name.split('(')[0]}
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '14px'
            }}>
              {currentBranch.coreRoadmap.map((step, idx) => (
                <div key={idx} style={{
                  background: '#0f172a',
                  padding: '14px',
                  borderRadius: '10px',
                  borderTop: `3px solid ${idx === 0 ? '#38bdf8' : idx === 1 ? '#f59e0b' : idx === 2 ? '#10b981' : '#ec4899'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc' }}>
                    {step.year}
                  </span>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.4' }}>
                    {step.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Companies Hiring */}
          <div style={{
            background: '#090d16',
            padding: '14px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
              🏢 Top Hiring Giants for {currentBranch.name.split('(')[0]}:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentBranch.topCompanies.map((c, i) => (
                <span key={i} style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB TAB 2: Dual Track (Core vs Software SDE Route) ── */}
      {activeSubTab === 'dualtrack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            padding: '16px 20px',
            borderLeft: '4px solid #38bdf8'
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#38bdf8' }}>
              💡 Dual-Track Career Strategy
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Whether you want to build a career in your <strong>Core Engineering discipline</strong> or transition to high-paying <strong>IT / Software Product companies (SDE)</strong>, here is your exact blueprint!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {/* Track 1: Core Engineering */}
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '20px',
              border: `1.5px solid ${currentBranch.color}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>🛠️</span>
                <h4 style={{ margin: 0, fontSize: '16px', color: currentBranch.color, fontWeight: '800' }}>
                  {currentBranch.dualTrack.coreTitle}
                </h4>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                {currentBranch.dualTrack.coreDescription}
              </p>
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}>
                <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#38bdf8', textTransform: 'uppercase' }}>
                  Recommended Focus:
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#e2e8f0', lineHeight: '1.5' }}>
                  Master <strong>{currentBranch.primaryLang.name}</strong> + specialized tools (<strong>{currentBranch.domainTools.slice(0, 2).join(', ')}</strong>). 
                  Aim for GATE / PSU exams, core tech R&D, or specialized industry product design roles.
                </p>
              </div>
            </div>

            {/* Track 2: Software SDE Transition */}
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '20px',
              border: '1.5px solid #38bdf8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>💻</span>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#38bdf8', fontWeight: '800' }}>
                  {currentBranch.dualTrack.transitionTitle || 'Direct Software Engineering Track'}
                </h4>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                {currentBranch.dualTrack.transitionDescription || 'Standard software engineering roadmap for product and tier-1 companies.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
                  Step-by-Step Transition Checklist:
                </span>
                {currentBranch.dualTrack.steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>✓</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB TAB 3: MOOCs, Certifications & Challenges Hub ── */}
      {activeSubTab === 'moocs_challenges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Coding Challenge & Practice Platforms */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚔️</span> Top Coding & Competitive Platforms for {currentBranch.name.split('(')[0]}
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {currentBranch.moocsAndCerts.challenges.map((ch, idx) => (
                <div key={idx} style={{
                  background: '#0f172a',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '20px' }}>{ch.icon}</span>
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontSize: '10.5px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {ch.type}
                    </span>
                  </div>
                  <strong style={{ fontSize: '13.5px', color: '#f8fafc' }}>{ch.name}</strong>
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: '4px',
                      color: '#38bdf8',
                      fontSize: '12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '600'
                    }}
                  >
                    Open Platform ↗
                  </a>
                </div>
              ))}
            </div>
          </div>

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
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#38bdf8', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    View Course ↗
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Recognized Industry Certifications */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📜</span> Top Recognized Industry Certifications
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              {currentBranch.moocsAndCerts.certifications.map((c, idx) => (
                <div key={idx} style={{
                  background: '#0f172a',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{c.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Issuer: <strong>{c.issuer}</strong></span>
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>{c.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB TAB 4: Branch Real-World Code Preview ── */}
      {activeSubTab === 'codepreview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', color: currentBranch.color }}>
                {currentBranch.codeSample.title}
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                See how coding is directly used to solve real-world problems in {currentBranch.name.split('(')[0]}.
              </p>
            </div>
            <span style={{
              background: '#0f172a',
              border: `1px solid ${currentBranch.color}`,
              color: currentBranch.color,
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {currentBranch.codeSample.language}
            </span>
          </div>

          {/* Syntax Highlighted Box */}
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

      {/* ── SUB TAB 5: Smart Advisor Quiz ── */}
      {activeSubTab === 'advisor_quiz' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '14px',
          padding: '24px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px', color: '#38bdf8', fontWeight: '800' }}>
              🤖 Interactive Smart Advisor: Find Your Personalized Language & Action Plan
            </h4>
            <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
              Answer 3 quick questions about your branch, career goal, and college year to generate a customized 90-day learning roadmap!
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
                1. Your B.Tech Branch:
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
                  <option key={b.id} value={b.id}>{b.name}</option>
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
                <option value="sde">💻 Software SDE / Tier-1 Product Company</option>
                <option value="core">🛠️ Core Engineering Specialist (Hardware/R&D)</option>
                <option value="ai_ds">🤖 AI, Machine Learning & Data Science</option>
                <option value="cyber">🔒 Cyber Security & Ethical Hacking</option>
                <option value="higher_studies">🎓 GATE / M.Tech / MS Research</option>
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
                <option value="1">1st Year (Freshman)</option>
                <option value="2">2nd Year (Sophomore)</option>
                <option value="3">3rd Year (Junior)</option>
                <option value="4">4th Year (Senior)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunAdvisor}
            style={{
              alignSelf: 'flex-start',
              padding: '10px 22px',
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
            ⚡ Generate My Custom Roadmap
          </button>

          {/* Quiz Result Box */}
          {quizResult && (
            <div style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '20px',
              border: '2px solid #38bdf8',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🎯</span>
                <h4 style={{ margin: 0, fontSize: '17px', color: '#38bdf8', fontWeight: '800' }}>
                  Personalized Recommendation for Year {quizYear} ({quizResult.branchName.split('(')[0]})
                </h4>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Primary Language Today</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#38bdf8', fontSize: '14px' }}>
                    {quizResult.recommendedPrimary}
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Secondary Stack</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#f59e0b', fontSize: '14px' }}>
                    {quizResult.recommendedSecondary}
                  </p>
                </div>

                <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Target Challenge Platform</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#10b981', fontSize: '14px' }}>
                    {quizResult.topChallenge}
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}>
                  🚀 Next 90-Day Milestone:
                </span>
                <p style={{ margin: '4px 0 10px 0', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {quizResult.nextStep}
                </p>

                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}>
                  💡 High-Impact Resume Projects to Build:
                </span>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5' }}>
                  {quizResult.projects.map((p, i) => (
                    <li key={i}><strong style={{ color: '#e2e8f0' }}>{p}</strong></li>
                  ))}
                </ul>
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
                  <th style={{ padding: '12px 14px' }}>Key Challenge Platform</th>
                  <th style={{ padding: '12px 14px' }}>Software SDE Transition</th>
                </tr>
              </thead>
              <tbody>
                {branchData.map((b, i) => (
                  <tr key={b.id} style={{
                    background: i % 2 === 0 ? '#0f172a' : '#131d31',
                    borderBottom: '1px solid #334155'
                  }}>
                    <td style={{ padding: '12px 14px', fontWeight: 'bold', color: '#f8fafc' }}>
                      <span style={{ marginRight: '6px' }}>{b.icon}</span>
                      {b.name.split('(')[0]}
                    </td>
                    <td style={{ padding: '12px 14px', color: b.color, fontWeight: '700' }}>
                      {b.primaryLang.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                      {b.secondaryLang.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#f59e0b' }}>
                      {b.moocsAndCerts.challenges[0]?.name.split('(')[0]}
                    </td>
                    <td style={{ padding: '12px 14px', color: b.id === 'cse' ? '#10b981' : '#38bdf8' }}>
                      {b.id === 'cse' ? 'Native Track' : 'Smooth via C++/Java DSA'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Student FAQs */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #334155'
          }}>
            <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#38bdf8' }}>
              ❓ Frequently Asked Questions for B.Tech Beginners
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <strong style={{ fontSize: '13.5px', color: '#f8fafc' }}>
                  Q: Can Non-CSE students (ECE, Mech, Civil, EEE) get high-paying Software SDE jobs in FAANG/Product companies?
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5' }}>
                  <strong>Yes, 100%!</strong> Over 40% of software engineers in top tech companies come from non-CSE backgrounds. Companies test Data Structures, Problem Solving, and basic CS fundamentals (OOPs, DBMS, OS), which anyone can master in 6 to 9 months of consistent practice.
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '13.5px', color: '#f8fafc' }}>
                  Q: Should 1st year students start with C or Python?
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5' }}>
                  If you want to understand how RAM, pointers, and CPU memory work, start with <strong>C</strong>. If your goal is AI/Data Science or fast web prototyping, start with <strong>Python</strong>.
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '13.5px', color: '#f8fafc' }}>
                  Q: Which is better for DSA & Placements: C++ or Java?
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.5' }}>
                  Both are Tier-1 choices. <strong>C++</strong> is faster for competitive programming (STL). <strong>Java</strong> is widely used in enterprise server backends (Spring Boot) and Android. Choose either and stick to it for at least 150+ LeetCode problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
      )}

    </div>
  );
}
