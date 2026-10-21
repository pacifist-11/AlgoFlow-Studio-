import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

// --- DATA STRUCTURES & VEHICLE SPECIFICATIONS ---
export const COMPLEXITY_VEHICLES = [
  {
    id: 'o_1',
    notation: 'O(1)',
    name: 'Constant Time',
    vehicleName: 'Quantum Hyper-Rocket',
    emoji: '🚀',
    tier: 'Supreme Speed',
    badgeColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    glow: 'rgba(16, 185, 129, 0.4)',
    accent: '#34d399',
    description: 'Instantaneous teleportation! The operations never increase regardless of whether N is 5 or 500,000,000.',
    analogy: 'Grabbing a book from your desk by looking directly at the page number.',
    realWorld: [
      'Array index access: arr[0]',
      'Hash Table key lookup: map.get("user_123")',
      'Stack Push / Pop (top element)',
      'Checking if a number is even: (n % 2 === 0)'
    ],
    calcOps: (n) => 1,
    getSpeedScore: (n) => 100,
    getStatus: (n) => ({ text: 'Instant Teleport', state: 'finished', color: '#10b981' })
  },
  {
    id: 'o_logn',
    notation: 'O(log N)',
    name: 'Logarithmic Time',
    vehicleName: 'Formula 1 Hypercar',
    emoji: '🏎️',
    tier: 'Blazing Fast',
    badgeColor: '#00e5ff',
    gradient: 'linear-gradient(135deg, #0284c7, #00e5ff)',
    glow: 'rgba(0, 229, 255, 0.4)',
    accent: '#38bdf8',
    description: 'Cuts the remaining problem in half at every turn! Even for 1,000,000 items, takes only ~20 steps.',
    analogy: 'Opening a dictionary directly in the middle, then cutting the left or right half away.',
    realWorld: [
      'Binary Search in a sorted array',
      'Searching a Balanced Binary Tree (AVL / Red-Black)',
      'Finding an element in a Binary Search Tree (average)',
      'Integer power calculation (Exponentiation by squaring)'
    ],
    calcOps: (n) => Math.max(1, Math.ceil(Math.log2(Math.max(1, n)))),
    getSpeedScore: (n) => Math.max(80, 100 - Math.log2(Math.max(1, n)) * 2),
    getStatus: (n) => ({ text: 'Hypersonic Cruising', state: 'finished', color: '#00e5ff' })
  },
  {
    id: 'o_n',
    notation: 'O(N)',
    name: 'Linear Time',
    vehicleName: 'Electric Highway Sedan',
    emoji: '🚗',
    tier: 'Steady & Predictable',
    badgeColor: '#3b82f6',
    gradient: 'linear-gradient(135deg, #2563eb, #60a5fa)',
    glow: 'rgba(59, 130, 246, 0.4)',
    accent: '#93c5fd',
    description: 'Fair and honest travel. Every single passenger/item adds exactly 1 unit of travel distance.',
    analogy: 'Driving past every single house in a neighborhood sequentially looking for a specific house number.',
    realWorld: [
      'Linear Search in an unsorted list',
      'Finding the Maximum or Minimum in an array',
      'Single for-loop iterating over all elements',
      'Counting items matching a condition'
    ],
    calcOps: (n) => n,
    getSpeedScore: (n) => Math.max(20, Math.round(100 - Math.min(n, 100) * 0.7)),
    getStatus: (n) => ({ text: n > 50 ? 'Steady Highway Cruise' : 'Quick City Drive', state: 'finished', color: '#60a5fa' })
  },
  {
    id: 'o_nlogn',
    notation: 'O(N log N)',
    name: 'Linearithmic Time',
    vehicleName: 'Heavy Freight Cargo Transporter',
    emoji: '🚛',
    tier: 'Efficient Workhorse',
    badgeColor: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    glow: 'rgba(139, 92, 246, 0.4)',
    accent: '#c4b5fd',
    description: 'Splits work smartly into halves, then merges N items back together. The standard gold standard for general sorting.',
    analogy: 'A logistics convoy sorting warehouse crates by dividing parcels into pallets and assembling them in order.',
    realWorld: [
      'Merge Sort (Divide & Conquer)',
      'Quick Sort (Average & Best case)',
      'Heap Sort',
      'TimSort (Python and Java native array sort)'
    ],
    calcOps: (n) => Math.round(n * Math.max(1, Math.log2(Math.max(1, n)))),
    getSpeedScore: (n) => Math.max(15, Math.round(85 - Math.min(n, 100) * 0.8)),
    getStatus: (n) => ({ text: 'Heavy Logistics Haul', state: 'finished', color: '#a78bfa' })
  },
  {
    id: 'o_n2',
    notation: 'O(N²)',
    name: 'Quadratic Time',
    vehicleName: 'Industrial Steam Bulldozer',
    emoji: '🚜',
    tier: 'Slow Chugger',
    badgeColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #fbbf24)',
    glow: 'rgba(245, 158, 11, 0.4)',
    accent: '#fde68a',
    description: 'Compares every element against every other element. Acceptable for N=10, painful for N=100, impossible for N=100,000.',
    analogy: 'Shaking hands with every single guest at a wedding, and making every guest shake everyone else\'s hands too.',
    realWorld: [
      'Bubble Sort, Selection Sort, Insertion Sort',
      'Nested loops comparing all pairs (arr[i] vs arr[j])',
      'Checking for duplicate items with two loops',
      '2D Matrix element multiplication / traversal'
    ],
    calcOps: (n) => n * n,
    getSpeedScore: (n) => Math.max(5, Math.round(70 - (n * n) / 100)),
    getStatus: (n) => ({
      text: n > 40 ? 'Engine Chugging Hard' : 'Slow Bulldozing',
      state: n > 100 ? 'overheat' : 'finished',
      color: '#f59e0b'
    })
  },
  {
    id: 'o_2n',
    notation: 'O(2ᴺ)',
    name: 'Exponential Time',
    vehicleName: 'Overheating Steam Tortoise Cart',
    emoji: '🐢',
    tier: 'Critical Hazard',
    badgeColor: '#ef4444',
    gradient: 'linear-gradient(135deg, #b91c1c, #ef4444)',
    glow: 'rgba(239, 68, 68, 0.4)',
    accent: '#fca5a5',
    description: 'Doubles operations with every single added element (+1 to N doubles total work!). Crashes rapidly when N reaches 25-30.',
    analogy: 'Trying every single possible combination on a safe with N binary dials. Adding 1 dial doubles the combinations.',
    realWorld: [
      'Naive recursive Fibonacci: fib(n-1) + fib(n-2)',
      'Generating all Subsets of a set (Power Set)',
      'Tower of Hanoi recursive solution',
      'Brute force 0/1 Knapsack without dynamic programming'
    ],
    calcOps: (n) => {
      if (n > 60) return Infinity;
      return Math.pow(2, n);
    },
    getSpeedScore: (n) => (n > 12 ? 1 : Math.max(1, Math.round(50 - Math.pow(2, n) / 50))),
    getStatus: (n) => {
      if (n > 25) return { text: 'ENGINE MELTDOWN 💥 (Universe Ends First)', state: 'stalled', color: '#ef4444' };
      if (n > 12) return { text: 'CRITICAL OVERHEAT 🔥', state: 'overheat', color: '#f87171' };
      return { text: 'Slow Crawl', state: 'crawling', color: '#ef4444' };
    }
  },
  {
    id: 'o_nfact',
    notation: 'O(N!)',
    name: 'Factorial Time',
    vehicleName: 'Immobilized Snail in Tar',
    emoji: '🐌',
    tier: 'Catastrophic Freeze',
    badgeColor: '#a855f7',
    gradient: 'linear-gradient(135deg, #6b21a8, #9333ea)',
    glow: 'rgba(168, 85, 247, 0.4)',
    accent: '#d8b4fe',
    description: 'Tries every single permutation of all elements. N=10 is 3.6 million operations; N=20 exceeds human lifetimes.',
    analogy: 'Trying every possible route to visit N cities sequentially without any smart planning.',
    realWorld: [
      'Brute-force Traveling Salesperson Problem (TSP)',
      'Generating all Permutations of an array/string',
      'Bogosort (randomly shuffling until sorted)',
      'Solving N-Queens by testing all board permutations'
    ],
    calcOps: (n) => {
      if (n > 170) return Infinity;
      let res = 1;
      for (let i = 2; i <= Math.min(n, 20); i++) res *= i;
      return res;
    },
    getSpeedScore: (n) => (n > 7 ? 0 : Math.max(0, 30 - n * 4)),
    getStatus: (n) => {
      if (n > 10) return { text: 'STUCK IN MOLASSES 🪨 (Computer Frozen)', state: 'stalled', color: '#9333ea' };
      if (n > 6) return { text: 'Severe Wheel Lockup ⚠️', state: 'overheat', color: '#c084fc' };
      return { text: 'Glacial Snail Pace', state: 'crawling', color: '#a855f7' };
    }
  }
];

// --- QUIZ DATA ---
const SPEEDWAY_QUIZ = [
  {
    question: "You want to find a contact in a phonebook containing 1,000,000 alphabetically sorted names. Which vehicle algorithm is best?",
    options: [
      { text: "🚗 Electric Sedan: Scan every name from A to Z (O(N))", correct: false, feedback: "Scanning 1,000,000 names takes up to 1,000,000 checks. That's a long slow drive!" },
      { text: "🏎️ F1 Hypercar: Binary Search by opening to the middle repeatedly (O(log N))", correct: true, feedback: "Spot on! log₂(1,000,000) is only ~20 checks! The F1 hypercar finishes in milliseconds." },
      { text: "🚜 Industrial Bulldozer: Compare every name to every other name (O(N²))", correct: false, feedback: "That would require 1,000,000² = 1 TRILLION checks! The bulldozer will crush your phone." },
      { text: "🐌 Stuck Snail: Check all permutations of letters (O(N!))", correct: false, feedback: "Factorial time for 1,000,000 would take longer than the age of the known universe!" }
    ]
  },
  {
    question: "You look up an element in an array using an exact index like arr[42]. How fast is the vehicle?",
    options: [
      { text: "🚀 Quantum Rocket (O(1)): Instant teleport because memory address is calculated directly", correct: true, feedback: "Bingo! Base Address + (Index * Item Size) gives the memory byte address in 1 single step!" },
      { text: "🚗 Electric Sedan (O(N)): It has to count 42 times from index 0", correct: false, feedback: "Arrays have direct random access. It doesn't need to loop through previous items." },
      { text: "🏎️ F1 Hypercar (O(log N)): It halves the array until it finds 42", correct: false, feedback: "Halving is for searching when you don't know the index. Here you already know the index!" },
      { text: "🚛 Heavy Freight (O(N log N)): It sorts the array first", correct: false, feedback: "No sorting needed to access an index!" }
    ]
  },
  {
    question: "What does 'N' actually represent in Big-O notation?",
    options: [
      { text: "The clock speed of your computer's CPU in Gigahertz", correct: false, feedback: "Big-O is hardware-independent! An algorithm is O(N) whether on a smartphone or supercomputer." },
      { text: "The size or count of items in the input dataset being processed", correct: true, feedback: "Correct! N = 10 elements, N = 100,000 users, or N = 1,000,000,000 web pages." },
      { text: "The number of lines of source code in your program", correct: false, feedback: "A 3-line recursive function can be O(2ᴺ), while a 500-line clean function can be O(1)!" },
      { text: "The maximum amount of RAM in Gigabytes", correct: false, feedback: "That's hardware capacity, not algorithm input size." }
    ]
  },
  {
    question: "Why does O(log N) scale so gracefully when N grows from 1,000 to 1,000,000?",
    options: [
      { text: "Because the computer automatically buys more CPU cores", correct: false, feedback: "Algorithms don't depend on auto-buying hardware!" },
      { text: "Because log₂ N is the number of times you divide N by 2 before reaching 1. 1,000 needs ~10 cuts, 1,000,000 needs only ~20 cuts!", correct: true, feedback: "Exact! Multiplying N by 1,000 only adds 10 more highway cuts! That is why logarithms are computational superpowers." },
      { text: "Because O(log N) skips all the elements without reading them", correct: false, feedback: "It reads the midpoint on each step and discards the irrelevant half." },
      { text: "Because logarithmic math is an approximation that ignores errors", correct: false, feedback: "Binary search gives mathematically exact, guaranteed results." }
    ]
  },
  {
    question: "What is the difference between Time Complexity and Space Complexity?",
    options: [
      { text: "Time Complexity is in seconds; Space Complexity is hard-drive file size on disk", correct: false, feedback: "Neither is measured in hardware units. Time is operation count; Space is extra RAM memory used." },
      { text: "Time is how many operations the algorithm takes; Space is the extra RAM/memory the algorithm consumes during execution", correct: true, feedback: "Spot on! Time is execution steps (highway speed); Space is RAM memory bays (parking garage)." },
      { text: "Time Complexity is for sorting; Space Complexity is for searching", correct: false, feedback: "Both sorting and searching have both time and space complexities!" },
      { text: "Space Complexity only matters if your computer has no internet", correct: false, feedback: "Space complexity prevents OutOfMemory errors and app crashes." }
    ]
  }
];

// Directional orientation helper so all racers face forward towards the finish line (to the right)
const getEmojiTransform = (id) => {
  switch (id) {
    case 'o_1': return 'rotate(45deg)'; // Rocket tip points forward towards right
    case 'o_logn': return 'scaleX(-1)'; // F1 car flipped so front nose points right
    case 'o_n': return 'scaleX(-1)'; // Car hood flipped to point right
    case 'o_nlogn': return 'scaleX(-1)'; // Truck cab flipped to point right
    case 'o_n2': return 'scaleX(-1)'; // Bulldozer bucket flipped to point right
    case 'o_2n': return 'scaleX(-1)'; // Tortoise head flipped to point right
    case 'o_nfact': return 'scaleX(1)'; // Snail already crawls to the right
    default: return 'none';
  }
};

export default function VehicleComplexitySpeedway() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('speedway'); // 'speedway', 'what_is_n', 'what_is_log', 'space_garage', 'asymptotics', 'quiz'

  // Input N state
  const [nValue, setNValue] = useState(20);
  const [customNInput, setCustomNInput] = useState('20');

  // Race state
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceTime, setRaceTime] = useState(0);
  const [selectedVehicles, setSelectedVehicles] = useState(COMPLEXITY_VEHICLES.map(v => v.id));
  const [raceSpeedMult, setRaceSpeedMult] = useState(1); // 0.5x, 1x, 2x, 4x

  // Interactive Log N folding state
  const [logNCurrent, setLogNCurrent] = useState(16);
  const [logStepsHistory, setLogStepsHistory] = useState([16]);

  // Space garage simulation state
  const [garageN, setGarageN] = useState(8);
  const [garageMode, setGarageMode] = useState('o1'); // 'o1', 'on', 'on2', 'stack'

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Animation Refs
  const vehicleRefs = useRef({});
  const progressRefs = useRef({});
  const trackContainerRef = useRef(null);

  // Sync custom input
  const handleSetN = (val) => {
    const num = Math.max(1, Math.min(1000000, Number(val) || 1));
    setNValue(num);
    setCustomNInput(String(num));
    resetRace();
  };

  // Toggle vehicle participation
  const toggleVehicle = (id) => {
    setSelectedVehicles(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(v => v !== id) : prev) 
        : [...prev, id]
    );
  };

  // Format large numbers cleanly
  const formatOps = (num) => {
    if (num === Infinity || isNaN(num) || num > 1e18) return '∞ (Astronomical / Meltdown)';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' Trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' Million';
    if (num >= 1e3) return num.toLocaleString();
    return String(num);
  };

  // Calculate real visual duration in seconds for GSAP animation based on N
  const getVehicleDuration = (vehId, n) => {
    const mult = 1 / raceSpeedMult;
    switch (vehId) {
      case 'o_1':
        return 0.35 * mult;
      case 'o_logn': {
        const ops = Math.log2(Math.max(1, n));
        return Math.min(2.5, 0.6 + ops * 0.08) * mult;
      }
      case 'o_n': {
        return Math.min(6.0, 1.2 + (n / 20) * 1.0) * mult;
      }
      case 'o_nlogn': {
        const ops = n * Math.log2(Math.max(1, n));
        return Math.min(8.0, 1.6 + (ops / 100) * 1.2) * mult;
      }
      case 'o_n2': {
        const ops = n * n;
        if (n > 50) return 14 * mult;
        return Math.min(11.0, 2.0 + (ops / 400) * 2.5) * mult;
      }
      case 'o_2n': {
        if (n > 25) return 999; // Never finishes
        if (n > 12) return 18 * mult;
        return Math.min(15.0, 3.0 + Math.pow(2, n) / 200) * mult;
      }
      case 'o_nfact': {
        if (n > 8) return 999; // Stalls
        return 20 * mult;
      }
      default:
        return 3 * mult;
    }
  };

  // Reset Race
  const resetRace = () => {
    setIsRacing(false);
    setIsPaused(false);
    setRaceFinished(false);
    setRaceTime(0);

    if (activeTweensRef.current) {
      activeTweensRef.current.forEach(t => t.kill());
      activeTweensRef.current = [];
    }

    COMPLEXITY_VEHICLES.forEach(veh => {
      const el = vehicleRefs.current[veh.id];
      if (el) {
        gsap.killTweensOf(el);
        gsap.set(el, { x: 0, rotate: 0, scale: 1 });
      }
      const prog = progressRefs.current[veh.id];
      if (prog) {
        prog.innerText = '0%';
      }
    });
  };

  // Pause Race
  const pauseRace = () => {
    if (!isRacing || isPaused) return;
    activeTweensRef.current.forEach(t => t.pause());
    setIsPaused(true);
  };

  // Resume Race
  const resumeRace = () => {
    if (!isRacing || !isPaused) return;
    activeTweensRef.current.forEach(t => t.resume());
    setIsPaused(false);
  };

  // Unified Start / Pause / Resume Button Handler
  const handleStartOrPause = () => {
    if (!isRacing) {
      startRace();
    } else if (isPaused) {
      resumeRace();
    } else {
      pauseRace();
    }
  };

  // Run Race with GSAP
  const startRace = () => {
    resetRace();
    setIsRacing(true);
    setIsPaused(false);
    setRaceFinished(false);

    const trackWidth = trackContainerRef.current 
      ? trackContainerRef.current.offsetWidth - 130 
      : 600;

    const participating = COMPLEXITY_VEHICLES.filter(v => selectedVehicles.includes(v.id));
    const validCount = participating.filter(v => getVehicleDuration(v.id, nValue) < 900).length;
    let completedCount = 0;
    activeTweensRef.current = [];

    participating.forEach(veh => {
      const el = vehicleRefs.current[veh.id];
      if (!el) return;

      const duration = getVehicleDuration(veh.id, nValue);
      const isStalled = duration >= 900;
      const targetX = isStalled 
        ? (veh.id === 'o_nfact' ? trackWidth * 0.08 : trackWidth * 0.22)
        : trackWidth;

      // GSAP Tween
      const tween = gsap.to(el, {
        x: targetX,
        duration: isStalled ? 2.5 : duration,
        ease: veh.id === 'o_1' 
          ? 'power4.out' 
          : (veh.id === 'o_logn' ? 'power2.out' : (isStalled ? 'power1.in' : 'power1.inOut')),
        onUpdate: function() {
          const prog = progressRefs.current[veh.id];
          if (prog) {
            const currentPct = Math.round((this.progress() * (targetX / trackWidth)) * 100);
            prog.innerText = `${currentPct}%`;
          }
        },
        onComplete: () => {
          if (isStalled) {
            // Smoke / shake animation
            const shake = gsap.to(el, {
              x: '+=4',
              repeat: 8,
              yoyo: true,
              duration: 0.08,
              ease: 'rough'
            });
            activeTweensRef.current.push(shake);
          } else {
            completedCount++;
            if (completedCount >= validCount) {
              setIsRacing(false);
              setIsPaused(false);
              setRaceFinished(true);
            }
          }
        }
      });

      activeTweensRef.current.push(tween);
    });
  };

  // Log N interactive step
  const handleLogHalve = () => {
    if (logNCurrent <= 1) return;
    const nextVal = Math.floor(logNCurrent / 2);
    setLogNCurrent(nextVal);
    setLogStepsHistory(prev => [...prev, nextVal]);
  };

  const resetLogDemo = (initVal = 16) => {
    setLogNCurrent(initVal);
    setLogStepsHistory([initVal]);
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1.5px solid var(--glass-border)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit'
    }}>
      {/* ── HEADER BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(168, 85, 247, 0.15))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '26px' }}>🏎️</span>
            <span style={{
              background: 'linear-gradient(90deg, #38bdf8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}>
              Big-O Complexity Speedway & Visual Demystifier
            </span>
            <span style={{
              background: '#0284c7',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              GSAP POWERED
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Ever wondered what <strong>Time Complexity</strong>, <strong>Space Complexity</strong>, <strong>N</strong>, and <strong>Log N</strong> really mean?
            Watch algorithms race as vehicles — from instant 🚀 <strong>Quantum Rockets</strong> to stalled 🐌 <strong>Snails in Molasses</strong>!
          </p>
        </div>

        {/* Global Preset N Quick Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '6px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
            ACTIVE INPUT SIZE (N):
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="number"
              min="1"
              max="1000000"
              value={customNInput}
              onChange={(e) => {
                setCustomNInput(e.target.value);
                const val = Number(e.target.value);
                if (val > 0) handleSetN(val);
              }}
              style={{
                width: '90px',
                padding: '6px 10px',
                background: 'rgba(0,0,0,0.4)',
                border: '1.5px solid var(--accent-primary)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            />
            <div style={{ display: 'flex', gap: '4px' }}>
              {[5, 20, 50, 100, 1000].map(val => (
                <button
                  key={val}
                  onClick={() => handleSetN(val)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: nValue === val ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                    background: nValue === val ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: nValue === val ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {val >= 1000 ? `${val/1000}k` : val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        {[
          { id: 'speedway', icon: '🏁', label: '1. Vehicle Grand Prix Track' },
          { id: 'what_is_n', icon: '🔢', label: '2. What is "N"?' },
          { id: 'what_is_log', icon: '✂️', label: '3. What is "Log N"?' },
          { id: 'space_garage', icon: '🅿️', label: '4. Space Complexity Garage' },
          { id: 'asymptotics', icon: '📐', label: '5. Big-O vs Ω vs Θ' },
          { id: 'quiz', icon: '🎯', label: '6. Speedway Quiz Challenge' }
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
                padding: '9px 15px',
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
      {/* TAB 1: VEHICLE SPEEDWAY RACE TRACK                                        */}
      {/* ========================================================================= */}
      {activeTab === 'speedway' && (
        <div>
          {/* Race Controls Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '16px',
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
          }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleStartOrPause}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: !isRacing
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : (isPaused
                        ? 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                        : 'linear-gradient(135deg, #f59e0b, #d97706)'),
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: !isRacing
                    ? '0 4px 15px rgba(16, 185, 129, 0.35)'
                    : (isPaused
                        ? '0 4px 15px rgba(14, 165, 233, 0.35)'
                        : '0 4px 15px rgba(245, 158, 11, 0.35)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <span>
                  {!isRacing
                    ? '🏁 Start Grand Prix!'
                    : (isPaused ? '▶️ Resume Race' : '⏸️ Pause Race')}
                </span>
              </button>

              <button
                onClick={resetRace}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                🔄 Reset Track
              </button>

              {/* Speed Multiplier */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginRight: '4px' }}>SPEED:</span>
                {[0.5, 1, 2, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => { setRaceSpeedMult(s); resetRace(); }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: raceSpeedMult === s ? '1.5px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: raceSpeedMult === s ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0,0,0,0.3)',
                      color: raceSpeedMult === s ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Current N Operations Snapshot Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Simulating race with <strong>N = {nValue.toLocaleString()}</strong> items
              </span>
              {raceFinished && (
                <span style={{
                  background: '#10b981',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '3px 8px',
                  borderRadius: '8px'
                }}>
                  RACE COMPLETED!
                </span>
              )}
            </div>
          </div>

          {/* Vehicle Selection Chips */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '4px' }}>
              Active Racers:
            </span>
            {COMPLEXITY_VEHICLES.map(v => {
              const active = selectedVehicles.includes(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => toggleVehicle(v.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    border: `1px solid ${active ? v.badgeColor : 'rgba(255,255,255,0.1)'}`,
                    background: active ? `${v.badgeColor}22` : 'rgba(0,0,0,0.2)',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    fontSize: '11.5px',
                    fontWeight: active ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{v.emoji}</span>
                  <span>{v.notation}</span>
                  <span style={{ opacity: 0.6, fontSize: '10px' }}>({v.name.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>

          {/* Quick Explainer: What is "ops"? What is 🏎️? */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.08))',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            marginBottom: '16px',
            fontSize: '12.5px',
            lineHeight: '1.5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 320px' }}>
              <span style={{ fontSize: '18px' }}>💡</span>
              <span style={{ color: 'var(--text-primary)' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>What is "ops"?</strong> <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>ops</code> = <strong>Operations</strong> (CPU instructions: memory reads, comparisons, arithmetic). When N = {nValue.toLocaleString()}, an algorithm requiring 20 ops runs in nanoseconds, while an algorithm taking 1,000,000 ops lags!
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ fontSize: '16px' }}>🏎️</span>
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                🏎️ F1 Hypercar = O(log N)
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                (Halves search space each step — e.g. Binary Search)
              </span>
            </div>
          </div>

          {/* ── 3D SPEEDWAY ASPHALT TRACK ── */}
          <div
            ref={trackContainerRef}
            style={{
              position: 'relative',
              background: '#090d16',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '16px 20px',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 8px 30px rgba(0, 229, 255, 0.15)'
            }}
          >
            {/* Speedway Ambient Light and Grid */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 50px, transparent 50px, transparent 100px)',
              pointerEvents: 'none'
            }} />

            {/* START & FINISH BANNERS */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              padding: '0 8px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>
                <span>🚦 START GRID</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>(0 operations)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 'bold', fontSize: '12px' }}>
                <span>🏁 FINISH LINE</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>(N = {nValue.toLocaleString()})</span>
              </div>
            </div>

            {/* Individual Vehicle Lanes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {COMPLEXITY_VEHICLES.map((v, index) => {
                const isSelected = selectedVehicles.includes(v.id);
                if (!isSelected) return null;

                const ops = v.calcOps(nValue);
                const status = v.getStatus(nValue);

                return (
                  <div
                    key={v.id}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: `1px solid ${v.badgeColor}33`,
                      borderRadius: '12px',
                      padding: '8px 12px',
                      transition: 'border 0.2s'
                    }}
                  >
                    {/* Lane Header: Vehicle Info & Ops badge */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: v.badgeColor,
                          color: '#fff',
                          fontWeight: '800',
                          fontSize: '11px',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          fontFamily: 'monospace'
                        }}>
                          {v.notation}
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#f8fafc' }}>
                          {v.vehicleName}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          • {v.name}
                        </span>
                      </div>

                      {/* Right side live status & Ops count */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: status.color
                        }}>
                          {status.text}
                        </span>
                        <div style={{
                          background: 'rgba(0,0,0,0.5)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          color: v.accent
                        }}>
                          ⚙️ <strong>{formatOps(ops)}</strong> ops
                        </div>
                      </div>
                    </div>

                    {/* Asphalt Lane Track */}
                    <div style={{
                      position: 'relative',
                      height: '52px',
                      background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}>
                      {/* Lane Dash Lines */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        right: '70px',
                        height: '2px',
                        background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 20px, transparent 20px, transparent 35px)',
                        transform: 'translateY(-50%)'
                      }} />

                      {/* Finish Line Checkered Strip */}
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        bottom: '0',
                        width: '36px',
                        background: 'repeating-conic-gradient(#fff 0% 25%, #000 0% 50%) 50% / 12px 12px',
                        opacity: 0.85,
                        borderLeft: '2px solid #f59e0b'
                      }} />

                      {/* Animated Vehicle Pod (Sleek Dark Carbon Chassis - Zero Glaring Glow) */}
                      <div
                        ref={el => vehicleRefs.current[v.id] = el}
                        style={{
                          position: 'absolute',
                          left: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#090d16', // Solid dark carbon chassis without glaring lights
                          border: `1.5px solid ${v.badgeColor}`,
                          borderRadius: '8px',
                          padding: '4px 10px',
                          color: '#fff',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.7)', // Clean crisp drop shadow, no blinding aura
                          zIndex: 5,
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        <span style={{ 
                          fontSize: '22px', 
                          lineHeight: 1, 
                          display: 'inline-block',
                          transform: getEmojiTransform(v.id), // Forward-facing towards the finish line
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
                        }}>
                          {v.emoji}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '900', 
                            color: v.badgeColor,
                            lineHeight: 1.1,
                            fontFamily: 'monospace'
                          }}>
                            {v.notation}
                          </span>
                          <span
                            ref={el => progressRefs.current[v.id] = el}
                            style={{ 
                              fontSize: '9.5px', 
                              color: '#94a3b8', 
                              fontWeight: '600',
                              fontFamily: 'monospace' 
                            }}
                          >
                            0%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── LIVE LEADERBOARD & COMPARISON TABLE ── */}
          <div style={{
            marginTop: '20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '14px',
            border: '1px solid var(--glass-border)',
            padding: '16px'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span>
              <span>Speedway Telemetry & Operations Leaderboard (For N = {nValue.toLocaleString()})</span>
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '8px' }}>Vehicle</th>
                    <th style={{ padding: '8px' }}>Complexity</th>
                    <th style={{ padding: '8px' }} title="ops = Total CPU operations / comparisons / memory reads needed">Operations Count (ops: CPU Steps) ℹ️</th>
                    <th style={{ padding: '8px' }}>Estimated Runtime</th>
                    <th style={{ padding: '8px' }}>Performance Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPLEXITY_VEHICLES.map(v => {
                    const ops = v.calcOps(nValue);
                    let runtimeEstimate = '< 0.0001 ms';
                    let verdict = 'Instant / Perfect';
                    let verdictColor = '#10b981';

                    if (v.id === 'o_1') {
                      runtimeEstimate = '0.0001 ms (1 step)';
                      verdict = 'Instantaneous teleport';
                    } else if (v.id === 'o_logn') {
                      runtimeEstimate = '~0.001 ms';
                      verdict = 'Blazing fast (F1)';
                    } else if (v.id === 'o_n') {
                      runtimeEstimate = nValue > 100000 ? '~15 ms' : '< 0.05 ms';
                      verdict = 'Steady & linear';
                      verdictColor = '#3b82f6';
                    } else if (v.id === 'o_nlogn') {
                      runtimeEstimate = nValue > 100000 ? '~250 ms' : '< 0.5 ms';
                      verdict = 'Standard for efficient sorts';
                      verdictColor = '#8b5cf6';
                    } else if (v.id === 'o_n2') {
                      if (nValue > 10000) {
                        runtimeEstimate = '> 100 seconds';
                        verdict = 'Struggling bulldozer 🚜';
                        verdictColor = '#f59e0b';
                      } else {
                        runtimeEstimate = `${(nValue * nValue / 10000).toFixed(2)} ms`;
                        verdict = 'Moderate / slow';
                        verdictColor = '#f59e0b';
                      }
                    } else if (v.id === 'o_2n') {
                      if (nValue >= 60) {
                        runtimeEstimate = '36 billion years (Universe dies)';
                        verdict = 'CATASTROPHIC MELTDOWN 💥';
                        verdictColor = '#ef4444';
                      } else if (nValue >= 30) {
                        runtimeEstimate = '~17 minutes';
                        verdict = 'Severe overheat 🔥';
                        verdictColor = '#ef4444';
                      } else {
                        runtimeEstimate = `${Math.pow(2, nValue) * 0.00001} ms`;
                        verdict = 'Crawling tortoise';
                        verdictColor = '#ef4444';
                      }
                    } else if (v.id === 'o_nfact') {
                      if (nValue >= 15) {
                        runtimeEstimate = 'Trillions of centuries';
                        verdict = 'PERMANENT FREEZE 🪨';
                        verdictColor = '#a855f7';
                      } else if (nValue >= 10) {
                        runtimeEstimate = '~3.6 seconds';
                        verdict = 'Snail stuck in tar';
                        verdictColor = '#a855f7';
                      } else {
                        runtimeEstimate = '< 1 ms';
                        verdict = 'Glacial snail';
                        verdictColor = '#a855f7';
                      }
                    }

                    return (
                      <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>
                          <span style={{ marginRight: '6px' }}>{v.emoji}</span>
                          {v.vehicleName}
                        </td>
                        <td style={{ padding: '8px' }}>
                          <span style={{
                            background: `${v.badgeColor}22`,
                            color: v.badgeColor,
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }}>
                            {v.notation}
                          </span>
                        </td>
                        <td style={{ padding: '8px', fontFamily: 'monospace', color: v.accent }}>
                          {formatOps(ops)}
                        </td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>
                          {runtimeEstimate}
                        </td>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: verdictColor }}>
                          {verdict}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WHAT IS "N"? MASTERCLASS & SLIDER                                   */}
      {/* ========================================================================= */}
      {activeTab === 'what_is_n' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Core Concept Banner */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1.5px solid var(--accent-primary)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔢</span>
              <span>Demystifying "N": What is it and why does it matter?</span>
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              In mathematics, <strong>N</strong> can mean anything. But in <strong>Computer Science and DSA</strong>, 
              <strong> N is simply the NUMBER OF ITEMS you give to your algorithm to process!</strong>
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              marginTop: '16px'
            }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '18px' }}>📱</span>
                <h4 style={{ margin: '6px 0 4px 0', color: '#38bdf8', fontSize: '14px' }}>Phone Contacts List</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  If you have <strong>250 contacts</strong> in your phone, then <strong>N = 250</strong>.
                  Searching linearly checks 250 names. Binary search checks only 8 names!
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '18px' }}>🛍️</span>
                <h4 style={{ margin: '6px 0 4px 0', color: '#10b981', fontSize: '14px' }}>Amazon Product Catalog</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Amazon has over <strong>350,000,000 products</strong>. Here, <strong>N = 350 Million</strong>.
                  An O(N²) algorithm would take 122 QUADRILLION steps and crash the site!
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '18px' }}>📸</span>
                <h4 style={{ margin: '6px 0 4px 0', color: '#c084fc', fontSize: '14px' }}>Instagram Feed</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  If 5,000 users post stories today, <strong>N = 5,000</strong>.
                  Sorting their stories chronologically takes O(N log N) ≈ 60,000 operations.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive N Scaling Sandbox */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
              🎛️ Interactive N Slider: Watch How Operations Explode
            </h4>

            {/* Slider Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Drag slider to change input size <strong>(N)</strong>:
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: 'var(--accent-primary)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  padding: '4px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--accent-primary)'
                }}>
                  N = {nValue}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="60"
                value={nValue}
                onChange={(e) => handleSetN(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>N = 1 (Tiny)</span>
                <span>N = 15 (Moderate)</span>
                <span>N = 30 (Exponential Barrier)</span>
                <span>N = 60 (Quadratic Heavy)</span>
              </div>
            </div>

            {/* Visual Bar Comparison of Operations for this N */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {COMPLEXITY_VEHICLES.map(v => {
                const ops = v.calcOps(nValue);
                const maxOpsCap = 3600; // Reference 60^2
                const widthPercent = ops === Infinity 
                  ? 100 
                  : Math.min(100, Math.max(3, (ops / maxOpsCap) * 100));

                return (
                  <div key={v.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: 'bold' }}>
                        {v.emoji} {v.notation} — {v.vehicleName}
                      </span>
                      <span style={{ fontFamily: 'monospace', color: v.accent, fontWeight: 'bold' }}>
                        {formatOps(ops)} steps
                      </span>
                    </div>
                    <div style={{
                      height: '14px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '7px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${widthPercent}%`,
                        background: v.gradient,
                        borderRadius: '7px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: WHAT IS "LOG N"? INTERACTIVE HIGHWAY FOLDER                        */}
      {/* ========================================================================= */}
      {activeTab === 'what_is_log' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Explanation Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(0, 229, 255, 0.1))',
            border: '1.5px solid #00e5ff',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✂️</span>
              <span>Demystifying "Log N": Why Binary Search is Formula 1 Speed</span>
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', lineHeight: '1.6' }}>
              Most students get scared when they see the word <em>"Logarithm"</em> because math textbooks make it abstract.
              In Computer Science, <strong>log₂ N is simply the answer to one simple question:</strong>
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '14px 18px',
              borderRadius: '10px',
              borderLeft: '4px solid #00e5ff',
              fontSize: '15px',
              fontWeight: '600',
              color: '#f8fafc'
            }}>
              "How many times can you cut a number in half until you reach 1?"
            </div>
          </div>

          {/* Interactive Road Cutter Sandbox */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-primary)' }}>
                  Interactive "Cut Highway In Half" Machine
                </h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Start with a highway of N miles. Click "Cut in Half" and watch how fast you reach 1!
                </p>
              </div>

              {/* Presets */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[16, 64, 256, 1024, 1000000].map(val => (
                  <button
                    key={val}
                    onClick={() => resetLogDemo(val)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: logStepsHistory[0] === val ? '1.5px solid #00e5ff' : '1px solid var(--glass-border)',
                      background: logStepsHistory[0] === val ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                      color: logStepsHistory[0] === val ? '#00e5ff' : 'var(--text-secondary)',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    N = {val >= 1000000 ? '1 Million' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Current State & Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
              padding: '24px',
              background: '#090d16',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current Highway Items Remaining:</span>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#00e5ff', fontFamily: 'monospace' }}>
                    {logNCurrent.toLocaleString()}
                  </div>
                </div>

                <div style={{ height: '40px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cuts Made (Steps):</span>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#10b981', fontFamily: 'monospace' }}>
                    {logStepsHistory.length - 1}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleLogHalve}
                  disabled={logNCurrent <= 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: logNCurrent <= 1 ? '#475569' : 'linear-gradient(135deg, #0284c7, #00e5ff)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: logNCurrent <= 1 ? 'not-allowed' : 'pointer',
                    boxShadow: logNCurrent <= 1 ? 'none' : '0 4px 15px rgba(0, 229, 255, 0.4)'
                  }}
                >
                  <span>✂️ Cut Highway in Half!</span>
                </button>

                <button
                  onClick={() => resetLogDemo(logStepsHistory[0])}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Reset
                </button>
              </div>

              {logNCurrent <= 1 && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#34d399',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}>
                  🎉 Reached 1 item! Total cuts = {logStepsHistory.length - 1}. Therefore, log₂({logStepsHistory[0].toLocaleString()}) ≈ {logStepsHistory.length - 1}!
                </div>
              )}

              {/* Step by step timeline */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: '12px',
                justifyContent: 'center'
              }}>
                {logStepsHistory.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: idx === logStepsHistory.length - 1 ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255,255,255,0.06)',
                      border: idx === logStepsHistory.length - 1 ? '1.5px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)',
                      color: idx === logStepsHistory.length - 1 ? '#00e5ff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}>
                      {val.toLocaleString()}
                    </div>
                    {idx < logStepsHistory.length - 1 && (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SPACE COMPLEXITY "PARKING GARAGE"                                    */}
      {/* ========================================================================= */}
      {activeTab === 'space_garage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Explanation Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
            border: '1.5px solid #8b5cf6',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🅿️</span>
              <span>Space Complexity: The Memory Parking Garage</span>
            </h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.6' }}>
              While <strong>Time Complexity</strong> is how fast your vehicle travels on the highway (CPU operations), 
              <strong> Space Complexity</strong> is how many <strong>PARKING BAYS</strong> your algorithm consumes in RAM memory!
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981', fontSize: '12.5px' }}>
                <strong>Input Space:</strong> The memory needed to store the original input data (e.g., your initial array of N items).
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #8b5cf6', fontSize: '12.5px' }}>
                <strong>Auxiliary Space:</strong> The EXTRA temporary memory your code allocates (e.g. temporary helper arrays, recursion stack frames).
              </div>
            </div>
          </div>

          {/* Parking Garage Simulator Controls */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>CHOOSE ALGORITHM MEMORY PROFILE:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'o1', label: '🚀 O(1) Auxiliary Space', sub: 'In-Place Swap (1 temp bay)' },
                    { id: 'on', label: '🚗 O(N) Auxiliary Space', sub: 'Copy Array (N bays)' },
                    { id: 'on2', label: '🚜 O(N²) Auxiliary Space', sub: '2D Grid (N × N bays - Danger!)' },
                    { id: 'stack', label: '📚 O(H) Call Stack', sub: 'Recursion Depth Frames' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setGarageMode(m.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: garageMode === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: garageMode === m.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: garageMode === m.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '12.5px' }}>{m.label}</div>
                      <div style={{ fontSize: '10.5px', opacity: 0.7 }}>{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Garage N adjuster */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>N Items:</span>
                {[4, 8, 16].map(val => (
                  <button
                    key={val}
                    onClick={() => setGarageN(val)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: garageN === val ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                      background: garageN === val ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                      color: garageN === val ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    N={val}
                  </button>
                ))}
              </div>
            </div>

            {/* Garage Visual Bays */}
            <div style={{
              background: '#090d16',
              borderRadius: '14px',
              border: '2px solid rgba(255,255,255,0.1)',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>
                  🏢 RAM MEMORY BANK (64 AVAILABLE PARKING BAYS)
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: garageMode === 'on2' ? '#ef4444' : '#10b981' }}>
                  Occupied Bays: {garageMode === 'o1' ? '1 bay' : (garageMode === 'on' ? `${garageN} bays` : (garageMode === 'on2' ? `${garageN * garageN} bays (CRITICAL OVERFLOW!)` : `${Math.ceil(Math.log2(garageN))} call frames`))}
                </span>
              </div>

              {/* Parking Lot Grid with Touch Scroll */}
              <div style={{
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '8px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(16, minmax(30px, 1fr))',
                  gap: '6px',
                  minWidth: '540px'
                }}>
                {Array.from({ length: 64 }).map((_, idx) => {
                  let isOccupied = false;
                  let carEmoji = '🚗';
                  let bayLabel = `[${idx}]`;

                  if (garageMode === 'o1') {
                    isOccupied = idx === 0;
                    carEmoji = '🚀';
                  } else if (garageMode === 'on') {
                    isOccupied = idx < garageN;
                    carEmoji = '🚗';
                  } else if (garageMode === 'on2') {
                    isOccupied = idx < Math.min(64, garageN * garageN);
                    carEmoji = '🚜';
                  } else if (garageMode === 'stack') {
                    const depth = Math.ceil(Math.log2(garageN));
                    isOccupied = idx < depth;
                    carEmoji = '📚';
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        height: '42px',
                        background: isOccupied 
                          ? (garageMode === 'on2' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.25)') 
                          : 'rgba(255,255,255,0.03)',
                        border: isOccupied 
                          ? (garageMode === 'on2' ? '1.5px solid #ef4444' : '1.5px solid #38bdf8') 
                          : '1px dashed rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                      title={`RAM Slot ${idx}`}
                    >
                      {isOccupied ? (
                        <span>{carEmoji}</span>
                      ) : (
                        <span style={{ fontSize: '9px', opacity: 0.2, fontFamily: 'monospace' }}>
                          P{idx}
                        </span>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ASYMPTOTIC BOUNDS: BIG-O vs Ω vs Θ                                 */}
      {/* ========================================================================= */}
      {activeTab === 'asymptotics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            padding: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: 'var(--text-primary)' }}>
              📐 The 3 Speed Boundaries: Big-O, Big-Omega (Ω), and Big-Theta (Θ)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Big-O */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1.5px solid #ef4444',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🛡️</span>
                  <div>
                    <h4 style={{ margin: 0, color: '#f87171', fontSize: '16px' }}>Big-O (O): The Upper Bound</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>WORST-CASE SCENARIO</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.5' }}>
                  "In the worst bumper-to-bumper traffic with flat tires, <strong>how slow will this car go?</strong>"
                </p>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}>
                  Example: Linear Search worst case is <strong>O(N)</strong> when the target item is at the very last index or doesn't exist.
                </div>
              </div>

              {/* Big-Omega */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px solid #10b981',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>⚡</span>
                  <div>
                    <h4 style={{ margin: 0, color: '#34d399', fontSize: '16px' }}>Big-Omega (Ω): The Lower Bound</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BEST-CASE SCENARIO</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.5' }}>
                  "With an empty open highway and green lights, <strong>what is the fastest speed?</strong>"
                </p>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}>
                  Example: Linear Search best case is <strong>Ω(1)</strong> when the target item happens to be right at index [0]!
                </div>
              </div>

              {/* Big-Theta */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1.5px solid var(--accent-primary)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '16px' }}>Big-Theta (Θ): The Tight Bound</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>AVERAGE CRUISING SPEED</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', lineHeight: '1.5' }}>
                  When the upper and lower bounds grow at the exact same rate! The realistic cruise speed.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace' }}>
                  Example: Merge Sort is <strong>Θ(N log N)</strong> because it always divides and merges regardless of initial order.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SPEEDWAY QUIZ CHALLENGE                                             */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          padding: '24px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              QUESTION {quizIndex + 1} OF {SPEEDWAY_QUIZ.length}
            </span>
            <span style={{
              background: 'rgba(56, 189, 248, 0.2)',
              color: 'var(--accent-primary)',
              fontSize: '12px',
              fontWeight: 'bold',
              padding: '4px 10px',
              borderRadius: '10px'
            }}>
              🏆 Score: {quizScore} / {SPEEDWAY_QUIZ.length}
            </span>
          </div>

          {/* Question Text */}
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#fff', lineHeight: '1.5' }}>
            {SPEEDWAY_QUIZ[quizIndex].question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {SPEEDWAY_QUIZ[quizIndex].options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              let bg = 'rgba(255,255,255,0.04)';
              let border = '1px solid rgba(255,255,255,0.1)';

              if (quizSubmitted) {
                if (opt.correct) {
                  bg = 'rgba(16, 185, 129, 0.2)';
                  border = '1.5px solid #10b981';
                } else if (isSelected && !opt.correct) {
                  bg = 'rgba(239, 68, 68, 0.2)';
                  border = '1.5px solid #ef4444';
                }
              } else if (isSelected) {
                bg = 'rgba(56, 189, 248, 0.15)';
                border = '1.5px solid var(--accent-primary)';
              }

              return (
                <button
                  key={i}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedAnswer(i)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border,
                    background: bg,
                    color: '#fff',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    cursor: quizSubmitted ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {quizSubmitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: SPEEDWAY_QUIZ[quizIndex].options[selectedAnswer]?.correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: SPEEDWAY_QUIZ[quizIndex].options[selectedAnswer]?.correct ? '1px solid #10b981' : '1px solid #ef4444',
                color: SPEEDWAY_QUIZ[quizIndex].options[selectedAnswer]?.correct ? '#34d399' : '#f87171',
                fontSize: '13.5px'
              }}>
                {SPEEDWAY_QUIZ[quizIndex].options[selectedAnswer]?.feedback}
              </div>

              <button
                onClick={() => {
                  if (quizIndex < SPEEDWAY_QUIZ.length - 1) {
                    setQuizIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setQuizSubmitted(false);
                  } else {
                    // Reset quiz
                    setQuizIndex(0);
                    setQuizScore(0);
                    setSelectedAnswer(null);
                    setQuizSubmitted(false);
                  }
                }}
                style={{
                  alignSelf: 'flex-end',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--accent-primary)',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                {quizIndex < SPEEDWAY_QUIZ.length - 1 ? 'Next Question ➔' : 'Restart Quiz 🔄'}
              </button>
            </div>
          ) : (
            <button
              disabled={selectedAnswer === null}
              onClick={() => {
                if (selectedAnswer !== null) {
                  setQuizSubmitted(true);
                  if (SPEEDWAY_QUIZ[quizIndex].options[selectedAnswer].correct) {
                    setQuizScore(prev => prev + 1);
                  }
                }
              }}
              style={{
                alignSelf: 'flex-end',
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                background: selectedAnswer === null ? '#475569' : 'linear-gradient(135deg, #0284c7, #00e5ff)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '13.5px',
                cursor: selectedAnswer === null ? 'not-allowed' : 'pointer'
              }}
            >
              Submit Answer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
