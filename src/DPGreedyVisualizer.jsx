/* eslint-disable react/prop-types, react-hooks/exhaustive-deps, no-unused-vars, react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getDPCodeTemplate } from './codeTemplatesDP';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import TopicInfoModal from './TopicInfoModal.jsx';

// Fallback Clipboard copy
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
      return successful ? Promise.resolve() : Promise.reject(new Error("Copy command failed"));
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

const getDPComplexityInfo = (algo) => {
  switch (algo) {
    case 'LCS':
      return {
        title: 'Longest Common Subsequence (LCS)',
        operations: [
          { op: 'LCS Length (DP)', time: 'O(N * M)', space: 'O(N * M)' },
          { op: 'Backtrack LCS String', time: 'O(N + M)', space: 'O(1)' }
        ]
      };
    case 'LIS':
      return {
        title: 'Longest Increasing Subsequence (LIS)',
        operations: [
          { op: 'LIS Length (DP)', time: 'O(N²)', space: 'O(N)' },
          { op: 'LIS length (Optimal)', time: 'O(N log N)', space: 'O(N)' }
        ]
      };
    case 'Knapsack':
      return {
        title: 'Knapsack Algorithms',
        operations: [
          { op: '0/1 Knapsack (DP)', time: 'O(N * W)', space: 'O(N * W)' },
          { op: 'Fractional Knapsack (Greedy)', time: 'O(N log N)', space: 'O(N)' }
        ]
      };
    case 'CoinChange':
      return {
        title: 'Coin Change Problem',
        operations: [
          { op: 'Min Coins (DP)', time: 'O(N * C)', space: 'O(N)' },
          { op: 'Min Coins (Greedy)', time: 'O(C log C + N)', space: 'O(C)' }
        ]
      };
    default:
      return null;
  }
};

const DPGreedyVisualizer = ({ onBack, openSettings, initialTab = 'LCS', onCopyCode, onCodeChange, fontSize = 14, wordWrap = 'off', onShowUpcomingFeatures }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'LCS' | 'LIS' | 'Knapsack' | 'CoinChange'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [codeLanguage, setCodeLanguage] = useState('Java');
  const [showCode, setShowCode] = useState(false);
  const [showComplexity, setShowComplexity] = useState(true);
  const [showTopicInfo, setShowTopicInfo] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [copied, setCopied] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  // Layout sizing
  const [showLogPanel, setShowLogPanel] = useState(true);
  const [logPosition, setLogPosition] = useState({ x: 20, y: 120 });
  const [isDraggingLog, setIsDraggingLog] = useState(false);
  const [logSize, setLogSize] = useState({ width: 580, height: 300 });
  const [activeStateWidth, setActiveStateWidth] = useState(240);
  const [codeWidth, setCodeWidth] = useState(450);

  const logDragStart = useRef({ x: 0, y: 0 });
  const logPanelStart = useRef({ x: 0, y: 0 });
  const logContainerRef = useRef(null);

  // LCS Inputs
  const [lcsStr1, setLcsStr1] = useState('ABCDGH');
  const [lcsStr2, setLcsStr2] = useState('AEDFHR');

  // LIS Inputs
  const [lisArrInput, setLisArrInput] = useState('10, 22, 9, 33, 21, 50, 41, 60');

  // Knapsack Inputs
  const [knapCapacity, setKnapCapacity] = useState(10);
  const [knapItems, setKnapItems] = useState([
    { val: 10, wt: 2, id: 1 },
    { val: 12, wt: 3, id: 2 },
    { val: 28, wt: 5, id: 3 },
    { val: 25, wt: 4, id: 4 }
  ]);
  const [newItemVal, setNewItemVal] = useState('');
  const [newItemWt, setNewItemWt] = useState('');

  // Coin Change Inputs
  const [coinInput, setCoinInput] = useState('1, 3, 4');
  const [coinTarget, setCoinTarget] = useState(6);

  // Timeline / Frames
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Current Code Template
  const currentCode = getDPCodeTemplate(codeLanguage, activeTab);

  const handleReset = () => {
    setTimeline([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (onCodeChange) onCodeChange(currentCode, codeLanguage);
  }, [currentCode, codeLanguage]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < timeline.length - 1) {
      timer = setTimeout(() => setCurrentStep(p => p + 1), speed);
    } else if (currentStep >= timeline.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, timeline, speed]);

  useEffect(() => {
    handleReset();
  }, [activeTab]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStep, showLogPanel, timeline]);

  const handleCopyCode = () => {
    copyToClipboard(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(currentCode, codeLanguage);
    }).catch(err => console.error("Clipboard copy failed:", err));
  };

  // Draggable Tracelog Events
  const handleLogMouseDown = (e) => {
    const handle = e.target.closest('.log-drag-handle');
    if (handle) {
      setIsDraggingLog(true);
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      logDragStart.current = { x: clientX, y: clientY };
      logPanelStart.current = { x: logPosition.x, y: logPosition.y };
      if (e.cancelable) e.preventDefault();
    }
  };

  useEffect(() => {
    if (!isDraggingLog) return;
    const handleMouseMove = (e) => {
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      const dx = clientX - logDragStart.current.x;
      const dy = clientY - logDragStart.current.y;
      const maxX = Math.max(0, window.innerWidth - logSize.width);
      const maxY = Math.max(0, window.innerHeight - logSize.height);
      setLogPosition({
        x: Math.max(0, Math.min(maxX, logPanelStart.current.x + dx)),
        y: Math.max(0, Math.min(maxY, logPanelStart.current.y + dy))
      });
    };
    const handleMouseUp = () => {
      setIsDraggingLog(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingLog, logSize]);

  const handleResizeMouseDown = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const startWidth = logSize.width;
    const startHeight = logSize.height;

    const handleMouseMove = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newWidth = Math.max(340, startWidth + (currentX - startX));
      const newHeight = Math.max(180, startHeight + (currentY - startY));
      setLogSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleActiveStateColDragStart = (e) => {
    if (e.cancelable) e.preventDefault();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startWidth = activeStateWidth;
    const drag = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const newWidth = Math.max(120, Math.min(logSize.width - 120, startWidth + (currentX - startX)));
      setActiveStateWidth(newWidth);
    };
    const end = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', end);
    };
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', end);
  };

  const handleColDragStart = e => {
    if (e.cancelable) e.preventDefault();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startW = codeWidth;
    const drag = ev => {
      const currentX = ev.type.startsWith('touch') ? ev.touches[0].clientX : ev.clientX;
      setCodeWidth(Math.max(200, Math.min(startW + (startX - currentX), window.innerWidth - 300)));
    };
    const end = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', end);
    };
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', end);
  };

  // -------------------------------------------------------------
  // LCS Frames Generator
  // -------------------------------------------------------------
  const solveLCS = () => {
    const s1 = lcsStr1.toUpperCase().trim();
    const s2 = lcsStr2.toUpperCase().trim();
    if (!s1 || !s2) {
      alert("Please enter two valid strings.");
      return;
    }
    const m = s2.length; // rows (Y)
    const n = s1.length; // cols (X)

    // dp initialized
    let dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    let arrows = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
    let frames = [];
    let logs = ["Initial DP table of size (S2.length + 1) x (S1.length + 1) filled with 0."];

    frames.push({
      dp: Array.from(dp, r => [...r]),
      arrows: Array.from(arrows, r => [...r]),
      i: 0,
      j: 0,
      activeCell: null,
      backtrackPath: [],
      lcsStr: '',
      logs: [...logs],
      msg: "Starting LCS. Initialize DP Table with base cases (zeros)."
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        logs.push(`Comparing X[${j - 1}]='${s1[j - 1]}' with Y[${i - 1}]='${s2[i - 1]}'`);

        let match = s1[j - 1] === s2[i - 1];
        if (match) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          arrows[i][j] = 'diag';
          logs.push(`➜ Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`);
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          arrows[i][j] = dp[i - 1][j] >= dp[i][j - 1] ? 'top' : 'left';
          logs.push(`➜ Mismatch. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}`);
        }

        frames.push({
          dp: Array.from(dp, r => [...r]),
          arrows: Array.from(arrows, r => [...r]),
          i,
          j,
          activeCell: [i, j],
          backtrackPath: [],
          lcsStr: '',
          logs: [...logs],
          msg: match
            ? `Characters match! Increment diagonal: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`
            : `Characters mismatch. Take max of Top and Left: dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`
        });
      }
    }

    // Backtrack to find LCS string
    logs.push("Backtracking from bottom-right cell to reconstruct LCS...");
    let r = m;
    let c = n;
    let path = [];
    let lcsResult = [];

    while (r > 0 && c > 0) {
      path.push([r, c]);
      if (s2[r - 1] === s1[c - 1]) {
        lcsResult.unshift(s1[c - 1]);
        logs.push(`➜ Match '${s1[c - 1]}' at Y[${r - 1}], X[${c - 1}]. Add to LCS. Move Diagonally Up-Left.`);
        frames.push({
          dp: Array.from(dp, row => [...row]),
          arrows: Array.from(arrows, row => [...row]),
          i: r,
          j: c,
          activeCell: null,
          backtrackPath: [...path],
          lcsStr: lcsResult.join(''),
          logs: [...logs],
          msg: `Match '${s1[c - 1]}'! Move to diagonal cell dp[${r - 1}][${c - 1}].`
        });
        r--;
        c--;
      } else {
        if (dp[r - 1][c] >= dp[r][c - 1]) {
          logs.push(`➜ dp[${r - 1}][${c}] (${dp[r - 1][c]}) >= dp[${r}][${c - 1}] (${dp[r][c - 1]}). Move Up.`);
          frames.push({
            dp: Array.from(dp, row => [...row]),
            arrows: Array.from(arrows, row => [...row]),
            i: r,
            j: c,
            activeCell: null,
            backtrackPath: [...path],
            lcsStr: lcsResult.join(''),
            logs: [...logs],
            msg: `Mismatch. Value at Top (${dp[r - 1][c]}) >= Left (${dp[r][c - 1]}). Move Up.`
          });
          r--;
        } else {
          logs.push(`➜ dp[${r - 1}][${c}] (${dp[r - 1][c]}) < dp[${r}][${c - 1}] (${dp[r][c - 1]}). Move Left.`);
          frames.push({
            dp: Array.from(dp, row => [...row]),
            arrows: Array.from(arrows, row => [...row]),
            i: r,
            j: c,
            activeCell: null,
            backtrackPath: [...path],
            lcsStr: lcsResult.join(''),
            logs: [...logs],
            msg: `Mismatch. Value at Left (${dp[r][c - 1]}) > Top (${dp[r - 1][c]}). Move Left.`
          });
          c--;
        }
      }
    }
    path.push([r, c]);
    logs.push(`LCS trace finished! Reconstructed String: "${lcsResult.join('')}" (Length: ${dp[m][n]}).`);
    frames.push({
      dp: Array.from(dp, row => [...row]),
      arrows: Array.from(arrows, row => [...row]),
      i: 0,
      j: 0,
      activeCell: null,
      backtrackPath: [...path],
      lcsStr: lcsResult.join(''),
      logs: [...logs],
      msg: `LCS Completed! Result: "${lcsResult.join('')}" (Length: ${dp[m][n]}).`
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -------------------------------------------------------------
  // LIS Frames Generator
  // -------------------------------------------------------------
  const solveLIS = () => {
    const raw = lisArrInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (raw.length === 0) {
      alert("Please enter a valid comma-separated array.");
      return;
    }
    const n = raw.length;
    let dp = Array(n).fill(1);
    let parent = Array(n).fill(-1);
    let logs = ["Initialised LIS dp array. All elements have a baseline LIS length of 1."];
    let frames = [];

    frames.push({
      arr: [...raw],
      dp: [...dp],
      i: 0,
      j: -1,
      backtrackPath: [],
      logs: [...logs],
      msg: "Initialize LIS dp table. Every single element is an increasing subsequence of length 1."
    });

    for (let i = 1; i < n; i++) {
      logs.push(`Computing LIS for element arr[${i}] = ${raw[i]}`);
      for (let j = 0; j < i; j++) {
        logs.push(`  Comparing with arr[${j}] = ${raw[j]}`);

        let possibleUpdate = false;
        let didUpdate = false;

        if (raw[i] > raw[j]) {
          possibleUpdate = true;
          if (dp[j] + 1 > dp[i]) {
            dp[i] = dp[j] + 1;
            parent[i] = j;
            didUpdate = true;
          }
        }

        logs.push(
          possibleUpdate
            ? `  ➜ arr[i] > arr[j] (${raw[i]} > ${raw[j]}). ` + (didUpdate ? `Update dp[${i}] = dp[${j}] + 1 = ${dp[i]}` : `No update, dp[${i}] already >= dp[${j}]+1`)
            : `  ➜ arr[i] <= arr[j] (${raw[i]} <= ${raw[j]}). No sequence possible.`
        );

        frames.push({
          arr: [...raw],
          dp: [...dp],
          i,
          j,
          backtrackPath: [],
          logs: [...logs],
          msg: possibleUpdate
            ? (didUpdate
              ? `Since ${raw[i]} > ${raw[j]}, LIS ending at index ${i} is updated using index ${j}: dp[${i}] = ${dp[i]}`
              : `Checked index ${j}. No update since current dp[${i}] (${dp[i]}) is already optimal.`)
            : `Cannot append ${raw[i]} after ${raw[j]} since it is not strictly increasing.`
        });
      }
    }

    // Find max index
    let maxLen = 0;
    let maxIdx = 0;
    for (let i = 0; i < n; i++) {
      if (dp[i] > maxLen) {
        maxLen = dp[i];
        maxIdx = i;
      }
    }

    logs.push(`Maximum LIS length found is ${maxLen} ending at index ${maxIdx}. Reconstructing path...`);

    let path = [];
    let curr = maxIdx;
    while (curr !== -1) {
      path.unshift(curr);
      logs.push(`➜ Backtrack parent pointer: index ${curr} (value ${raw[curr]})`);
      frames.push({
        arr: [...raw],
        dp: [...dp],
        i: -1,
        j: -1,
        backtrackPath: [...path],
        logs: [...logs],
        msg: `Backtracking: Added element ${raw[curr]} at index ${curr} to LIS.`
      });
      curr = parent[curr];
    }

    logs.push(`LIS trace completed! Longest Increasing Subsequence elements: [${path.map(idx => raw[idx]).join(', ')}]`);
    frames.push({
      arr: [...raw],
      dp: [...dp],
      i: -1,
      j: -1,
      backtrackPath: [...path],
      logs: [...logs],
      msg: `LIS completed! Subsequence: [${path.map(idx => raw[idx]).join(', ')}] (Length: ${maxLen})`
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -------------------------------------------------------------
  // Knapsack Frames Generator (0/1 DP & Fractional Greedy side-by-side)
  // -------------------------------------------------------------
  const solveKnapsack = () => {
    const cap = parseInt(knapCapacity);
    if (isNaN(cap) || cap <= 0) {
      alert("Please enter a valid Knapsack Capacity.");
      return;
    }
    if (knapItems.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    // DP 0/1 Knapsack
    const n = knapItems.length;
    let dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
    let logs = ["Initialised 0/1 Knapsack DP matrix and Fractional Knapsack values."];
    let frames = [];

    frames.push({
      dp: Array.from(dp, r => [...r]),
      i: 0,
      w: 0,
      greedyItems: [],
      greedyWeight: 0,
      greedyValue: 0,
      backtrackPath01: [],
      logs: [...logs],
      msg: "Starting Knapsack visualizer. Initial DP matrix for 0/1 is prepared."
    });

    for (let i = 1; i <= n; i++) {
      const item = knapItems[i - 1];
      logs.push(`DP: Processing Item ${i} (Value: ${item.val}, Weight: ${item.wt})`);
      for (let w = 1; w <= cap; w++) {
        if (item.wt <= w) {
          let incl = item.val + dp[i - 1][w - item.wt];
          let excl = dp[i - 1][w];
          dp[i][w] = Math.max(incl, excl);
          logs.push(`  dp[${i}][${w}] = max(Value(${item.val}) + dp[${i - 1}][${w - item.wt}] (${dp[i - 1][w - item.wt]}), dp[${i - 1}][${w}] (${excl})) = ${dp[i][w]}`);
        } else {
          dp[i][w] = dp[i - 1][w];
          logs.push(`  Weight (${item.wt}) > capacity (${w}). Carry over top cell dp[${i - 1}][${w}] = ${dp[i][w]}`);
        }

        frames.push({
          dp: Array.from(dp, r => [...r]),
          i,
          w,
          activeCell: [i, w],
          greedyItems: [],
          greedyWeight: 0,
          greedyValue: 0,
          backtrackPath01: [],
          logs: [...logs],
          msg: item.wt <= w
            ? `Evaluate inclusion vs exclusion for capacity ${w}. dp[${i}][${w}] = max(${item.val} + ${dp[i - 1][w - item.wt]}, ${dp[i - 1][w]}) = ${dp[i][w]}`
            : `Item is too heavy (${item.wt} > ${w}) for this sub-capacity. Copy top cell: dp[${i}][${w}] = ${dp[i - 1][w]}`
        });
      }
    }

    // 0/1 Knapsack Backtracking
    logs.push("DP complete. Backtracking to find items included in 0/1 Knapsack...");
    let wtLeft = cap;
    let chosen01 = [];
    for (let i = n; i > 0; i--) {
      if (dp[i][wtLeft] !== dp[i - 1][wtLeft]) {
        chosen01.push(i - 1);
        logs.push(`➜ Included Item ${i} (Value: ${knapItems[i - 1].val}, Weight: ${knapItems[i - 1].wt})`);
        wtLeft -= knapItems[i - 1].wt;
        frames.push({
          dp: Array.from(dp, r => [...r]),
          i,
          w: wtLeft + knapItems[i - 1].wt,
          activeCell: null,
          greedyItems: [],
          greedyWeight: 0,
          greedyValue: 0,
          backtrackPath01: [...chosen01],
          logs: [...logs],
          msg: `Item ${i} value was added! It must have been selected. Deduct weight: W = ${wtLeft}.`
        });
      } else {
        logs.push(`➜ Excluded Item ${i}`);
        frames.push({
          dp: Array.from(dp, r => [...r]),
          i,
          w: wtLeft,
          activeCell: null,
          greedyItems: [],
          greedyWeight: 0,
          greedyValue: 0,
          backtrackPath01: [...chosen01],
          logs: [...logs],
          msg: `Item ${i} value wasn't added. Move to row ${i - 1}.`
        });
      }
    }

    // Now, let's run Fractional Knapsack (Greedy Approach) step-by-step
    logs.push("Greedy: Solving Fractional Knapsack by value-to-weight ratio...");
    let sortedItems = knapItems.map((item, idx) => ({
      ...item,
      ratio: item.val / item.wt,
      originalIndex: idx
    })).sort((a, b) => b.ratio - a.ratio);

    logs.push("Sorted items by value-to-weight ratio: " + sortedItems.map(item => `Item ${item.id} (ratio: ${item.ratio.toFixed(2)})`).join(', '));
    frames.push({
      dp: Array.from(dp, r => [...r]),
      i: -1,
      w: -1,
      greedyItems: sortedItems.map(item => ({ ...item, fraction: 0, selected: false })),
      greedyWeight: 0,
      greedyValue: 0,
      backtrackPath01: [...chosen01],
      logs: [...logs],
      msg: `Fractional Knapsack: Items sorted by ratio: [${sortedItems.map(item => `Item ${item.id}`).join(', ')}].`
    });

    let currentWeight = 0;
    let currentValue = 0;
    let greedyVisualList = sortedItems.map(item => ({ ...item, fraction: 0, selected: false }));

    for (let i = 0; i < sortedItems.length; i++) {
      let item = sortedItems[i];
      logs.push(`Greedy: Checking Item ${item.id} (Weight: ${item.wt}, Value: ${item.val})`);
      if (currentWeight + item.wt <= cap) {
        currentWeight += item.wt;
        currentValue += item.val;
        greedyVisualList[i].fraction = 1;
        greedyVisualList[i].selected = true;
        logs.push(`➜ Fits fully! Total Value: ${currentValue.toFixed(1)}, Weight: ${currentWeight}/${cap}`);

        frames.push({
          dp: Array.from(dp, r => [...r]),
          i: -1,
          w: -1,
          greedyItems: JSON.parse(JSON.stringify(greedyVisualList)),
          greedyWeight: currentWeight,
          greedyValue: currentValue,
          backtrackPath01: [...chosen01],
          logs: [...logs],
          msg: `Greedy Knapsack: Fit Item ${item.id} fully. Weight: ${currentWeight}/${cap}. Value: ${currentValue}.`
        });
      } else {
        let remain = cap - currentWeight;
        if (remain > 0) {
          let fraction = remain / item.wt;
          currentWeight += remain;
          currentValue += item.val * fraction;
          greedyVisualList[i].fraction = fraction;
          greedyVisualList[i].selected = true;
          logs.push(`➜ Fits partially! Taken fraction: ${fraction.toFixed(2)} (${remain}/${item.wt}). Total Value: ${currentValue.toFixed(1)}, Weight: ${currentWeight}/${cap}`);

          frames.push({
            dp: Array.from(dp, r => [...r]),
            i: -1,
            w: -1,
            greedyItems: JSON.parse(JSON.stringify(greedyVisualList)),
            greedyWeight: currentWeight,
            greedyValue: currentValue,
            backtrackPath01: [...chosen01],
            logs: [...logs],
            msg: `Greedy Knapsack: Taken ${(fraction * 100).toFixed(0)}% of Item ${item.id}. Knapsack full! Capacity reached.`
          });
        } else {
          logs.push(`➜ Cannot take Item ${item.id}. Knapsack is full.`);
          frames.push({
            dp: Array.from(dp, r => [...r]),
            i: -1,
            w: -1,
            greedyItems: JSON.parse(JSON.stringify(greedyVisualList)),
            greedyWeight: currentWeight,
            greedyValue: currentValue,
            backtrackPath01: [...chosen01],
            logs: [...logs],
            msg: `Greedy Knapsack: Item ${item.id} skipped, capacity is already full.`
          });
        }
        break;
      }
    }

    logs.push(`Knapsack complete! 0/1 Knapsack Value: ${dp[n][cap]} | Fractional Knapsack Value: ${currentValue.toFixed(1)}`);
    frames.push({
      dp: Array.from(dp, r => [...r]),
      i: -1,
      w: -1,
      greedyItems: JSON.parse(JSON.stringify(greedyVisualList)),
      greedyWeight: currentWeight,
      greedyValue: currentValue,
      backtrackPath01: [...chosen01],
      logs: [...logs],
      msg: `Knapsack Completed! 0/1 DP Value = ${dp[n][cap]} vs. Greedy Fractional Value = ${currentValue.toFixed(1)}.`
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // Add Item to list
  const handleAddItem = () => {
    const val = parseInt(newItemVal);
    const wt = parseInt(newItemWt);
    if (isNaN(val) || isNaN(wt) || val <= 0 || wt <= 0) {
      alert("Please enter a valid value and weight.");
      return;
    }
    const newId = knapItems.length > 0 ? Math.max(...knapItems.map(item => item.id)) + 1 : 1;
    setKnapItems([...knapItems, { val, wt, id: newId }]);
    setNewItemVal('');
    setNewItemWt('');
    handleReset();
  };

  const handleRemoveItem = (id) => {
    setKnapItems(knapItems.filter(item => item.id !== id));
    handleReset();
  };

  // -------------------------------------------------------------
  // Coin Change Frames Generator (DP vs Greedy side-by-side)
  // -------------------------------------------------------------
  const solveCoinChange = () => {
    const target = parseInt(coinTarget);
    const coins = coinInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)).sort((a, b) => a - b);

    if (isNaN(target) || target <= 0) {
      alert("Please enter a valid target amount.");
      return;
    }
    if (coins.length === 0) {
      alert("Please enter a valid set of coins.");
      return;
    }

    // 1. DP solution: min coins to make change
    let dp = Array(target + 1).fill(target + 1);
    dp[0] = 0;
    let parent = Array(target + 1).fill(-1);
    let logs = ["Initialised DP Coin Change array. Index is target, value is min coins required."];
    let frames = [];

    frames.push({
      dp: [...dp],
      currAmount: 0,
      activeCoin: -1,
      greedyCoins: [],
      greedyRemaining: target,
      logs: [...logs],
      msg: "Starting Coin Change. Initialized DP array. base case dp[0] = 0."
    });

    for (let a = 1; a <= target; a++) {
      logs.push(`DP: Solving min coins for amount ${a}`);
      for (let c = 0; c < coins.length; c++) {
        let coin = coins[c];
        if (a - coin >= 0) {
          logs.push(`  Checking coin ${coin}`);
          let possible = dp[a - coin] + 1;
          let current = dp[a];
          let updated = possible < current;
          if (updated) {
            dp[a] = possible;
            parent[a] = a - coin;
            logs.push(`    ➜ dp[${a}] updated: min(dp[${a}], dp[${a - coin}] + 1) = ${dp[a]}`);
          } else {
            logs.push(`    ➜ No update: dp[${a}] remains ${dp[a]}`);
          }
          frames.push({
            dp: [...dp],
            currAmount: a,
            activeCoin: coin,
            greedyCoins: [],
            greedyRemaining: target,
            logs: [...logs],
            msg: updated
              ? `Sub-amount ${a} updated! Coin ${coin} fits. dp[${a}] = min(${current}, dp[${a - coin}] + 1) = ${dp[a]}`
              : `Checked coin ${coin} for amount ${a}. Current dp[${a}] (${current}) is already optimal.`
          });
        }
      }
    }

    // Backtrack chosen coins in DP
    let dpCoinsSelected = [];
    let tempAmount = target;
    if (dp[target] <= target) {
      while (tempAmount > 0) {
        let prev = parent[tempAmount];
        if (prev === -1) break;
        dpCoinsSelected.push(tempAmount - prev);
        tempAmount = prev;
      }
    }

    // 2. Greedy Solution
    logs.push("Greedy: Repeatedly picking the largest coin possible...");
    let sortedCoins = [...coins].sort((a, b) => b - a); // descending
    let remain = target;
    let greedyCoinsSelected = [];

    frames.push({
      dp: [...dp],
      currAmount: -1,
      activeCoin: -1,
      greedyCoins: [],
      greedyRemaining: remain,
      logs: [...logs],
      msg: `Fractional Coin Change (Greedy): Sorting coins descending: [${sortedCoins.join(', ')}]`
    });

    for (let coin of sortedCoins) {
      logs.push(`Greedy: Checking coin ${coin}`);
      while (remain >= coin) {
        remain -= coin;
        greedyCoinsSelected.push(coin);
        logs.push(`➜ Selected coin ${coin}. Remaining amount: ${remain}`);
        frames.push({
          dp: [...dp],
          currAmount: -1,
          activeCoin: coin,
          greedyCoins: [...greedyCoinsSelected],
          greedyRemaining: remain,
          logs: [...logs],
          msg: `Greedy: Select coin ${coin}. Remaining target: ${remain}.`
        });
      }
    }

    if (remain === 0) {
      logs.push(`Greedy success! Total coins: ${greedyCoinsSelected.length} [${greedyCoinsSelected.join(', ')}]`);
    } else {
      logs.push(`Greedy failed! Could not form amount ${target}. Leftover: ${remain}`);
    }

    const dpOptimalCount = dp[target] > target ? -1 : dp[target];
    const greedyOptimalCount = remain === 0 ? greedyCoinsSelected.length : -1;

    let finalMsg = '';
    if (dpOptimalCount === -1 && greedyOptimalCount === -1) {
      finalMsg = `Coin Change finished. Impossible to make change for amount ${target} with given coin set.`;
    } else {
      finalMsg = `Completed! DP Optimal Coins: ${dpOptimalCount} vs. Greedy Coins: ${greedyOptimalCount !== -1 ? greedyOptimalCount : 'FAILED'}.`;
      if (greedyOptimalCount > dpOptimalCount) {
        finalMsg += ` ⚠️ Greedy yields a sub-optimal result.`;
      }
    }
    logs.push(finalMsg);

    frames.push({
      dp: [...dp],
      currAmount: -1,
      activeCoin: -1,
      greedyCoins: [...greedyCoinsSelected],
      greedyRemaining: remain,
      logs: [...logs],
      msg: finalMsg
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const currentFrame = timeline[currentStep] || {
    dp: [],
    arrows: [],
    i: -1,
    j: -1,
    activeCell: null,
    backtrackPath: [],
    lcsStr: '',
    arr: [],
    backtrackPathLIS: [],
    greedyItems: [],
    greedyWeight: 0,
    greedyValue: 0,
    backtrackPath01: [],
    currAmount: -1,
    activeCoin: -1,
    greedyCoins: [],
    greedyRemaining: coinTarget,
    logs: [],
    msg: "Provide inputs and click Run Visualizer to start step-by-step execution trace."
  };

  const progress = timeline.length > 1 ? (currentStep / (timeline.length - 1)) * 100 : 0;

  // -------------------------------------------------------------
  // JSX RENDERING HELPERS FOR MAIN PANELS
  // -------------------------------------------------------------

  const renderLCSGrid = () => {
    const s1 = ' ' + lcsStr1.toUpperCase().trim();
    const s2 = ' ' + lcsStr2.toUpperCase().trim();
    const { dp = [], arrows = [], activeCell, backtrackPath = [] } = currentFrame;

    if (dp.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Configure strings and click Solve to visualize the DP matrix.
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1rem', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Rows (Y-axis): <strong style={{ color: '#ec4899' }}>{lcsStr2}</strong> | Columns (X-axis): <strong style={{ color: '#3b82f6' }}>{lcsStr1}</strong>
          </div>
          {currentFrame.lcsStr && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.95rem' }}>
              Current LCS Reconstructed: <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>&quot;{currentFrame.lcsStr}&quot;</strong>
            </div>
          )}
        </div>

        <div style={{ display: 'inline-block', margin: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', color: 'white', fontFamily: 'sans-serif' }}>
            <thead>
              <tr>
                <th style={{ width: '45px', height: '45px', border: '1px solid var(--glass-border)' }}></th>
                {s1.split('').map((char, idx) => (
                  <th key={idx} style={{
                    width: '45px', height: '45px',
                    border: '1px solid var(--glass-border)',
                    background: idx === currentFrame.j ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.02)',
                    color: idx === currentFrame.j ? '#3b82f6' : 'var(--text-secondary)',
                    fontWeight: 'bold', fontSize: '1rem'
                  }}>
                    {idx === 0 ? 'Ø' : char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s2.split('').map((char, r) => (
                <tr key={r}>
                  <td style={{
                    width: '45px', height: '45px',
                    border: '1px solid var(--glass-border)',
                    background: r === currentFrame.i ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255,255,255,0.02)',
                    color: r === currentFrame.i ? '#ec4899' : 'var(--text-secondary)',
                    fontWeight: 'bold', textAlign: 'center', fontSize: '1rem'
                  }}>
                    {r === 0 ? 'Ø' : char}
                  </td>
                  {s1.split('').map((_, c) => {
                    const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;
                    const inPath = backtrackPath.some(cell => cell[0] === r && cell[1] === c);
                    const cellVal = dp[r] ? dp[r][c] : 0;
                    const arrow = arrows[r] ? arrows[r][c] : null;

                    let bg = 'rgba(255,255,255,0.01)';
                    let border = '1px solid var(--glass-border)';
                    let scale = 'scale(1)';

                    if (isActive) {
                      bg = 'rgba(139, 92, 246, 0.25)';
                      border = '2px solid var(--accent-primary)';
                      scale = 'scale(1.05)';
                    } else if (inPath) {
                      bg = 'rgba(16, 185, 129, 0.3)';
                      border = '1px solid #10b981';
                    }

                    return (
                      <td key={c} style={{
                        width: '45px', height: '45px',
                        border, background: bg,
                        textAlign: 'center', position: 'relative',
                        transition: 'all 0.2s ease', transform: scale
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: inPath ? '#34d399' : 'white' }}>{cellVal}</div>
                        {arrow && (
                          <div style={{
                            position: 'absolute', top: '2px', left: '2px',
                            fontSize: '0.65rem', opacity: inPath ? 1 : 0.4,
                            color: inPath ? '#34d399' : 'var(--text-secondary)'
                          }}>
                            {arrow === 'diag' ? '↖' : arrow === 'top' ? '↑' : '←'}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLISGrid = () => {
    const { arr = [], dp = [], i, j, backtrackPath = [] } = currentFrame;
    if (arr.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Configure integers and click Solve to visualize the LIS state loops.
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', overflow: 'auto', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Outer Loop Pointers: <span style={{ color: '#fb923c', fontWeight: 'bold' }}>i (current index)</span> | <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>j (scanning index)</span>
          </div>
          {backtrackPath.length > 0 && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.95rem' }}>
              Final LIS: <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>[{backtrackPath.map(idx => arr[idx]).join(', ')}]</strong>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', margin: 'auto' }}>
          {/* Elements list */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {arr.map((val, idx) => {
              const isI = idx === i;
              const isJ = idx === j;
              const inPath = backtrackPath.includes(idx);

              let border = '1.5px solid var(--glass-border)';
              let bg = 'rgba(255, 255, 255, 0.03)';
              let shadow = 'none';

              if (isI) {
                border = '2px solid #fb923c';
                bg = 'rgba(251, 146, 60, 0.2)';
                shadow = '0 0 10px rgba(251, 146, 60, 0.4)';
              } else if (isJ) {
                border = '2px solid #38bdf8';
                bg = 'rgba(56, 189, 248, 0.2)';
                shadow = '0 0 10px rgba(56, 189, 248, 0.4)';
              } else if (inPath) {
                border = '2px solid #10b981';
                bg = 'rgba(16, 185, 129, 0.25)';
                shadow = '0 0 10px rgba(16, 185, 129, 0.4)';
              }

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '60px', height: '60px',
                    borderRadius: '12px', border, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 'bold', color: inPath ? '#34d399' : 'white',
                    boxShadow: shadow, transition: 'all 0.2s'
                  }}>
                    {val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {isI ? 'i' : isJ ? 'j' : `[${idx}]`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DP Array */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, paddingLeft: '8px' }}>DP Array (LIS lengths):</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {dp.map((val, idx) => {
                const isI = idx === i;
                const inPath = backtrackPath.includes(idx);
                let bg = 'rgba(255,255,255,0.02)';
                let border = '1px dashed var(--glass-border)';
                let color = 'var(--text-secondary)';

                if (isI) {
                  border = '1.5px solid #fb923c';
                  color = '#fb923c';
                } else if (inPath) {
                  border = '1.5px solid #10b981';
                  color = '#34d399';
                  bg = 'rgba(16, 185, 129, 0.1)';
                }

                return (
                  <div key={idx} style={{
                    width: '60px', height: '40px',
                    borderRadius: '8px', border, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', fontWeight: 600, color, transition: 'all 0.2s'
                  }}>
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKnapsackGrid = () => {
    const { dp = [], i, w, greedyItems = [], greedyWeight = 0, greedyValue = 0, backtrackPath01 = [] } = currentFrame;

    if (dp.length === 0 && greedyItems.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Configure Knapsack capacity & items, then click Solve to compare DP and Greedy.
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>

        {/* Left Side: 0/1 Knapsack (DP Table) */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🎒 0/1 Knapsack (DP Matrix)</span>
            {dp[knapItems.length] && (
              <span style={{ fontSize: '0.82rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 8px', borderRadius: '6px' }}>
                Opt Value: {dp[knapItems.length][knapCapacity]}
              </span>
            )}
          </h3>

          <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
            <table style={{ margin: 'auto', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'monospace' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid var(--glass-border)', padding: '6px', color: 'var(--text-secondary)' }}>Item</th>
                  {Array.from({ length: knapCapacity + 1 }, (_, capIdx) => (
                    <th key={capIdx} style={{
                      border: '1px solid var(--glass-border)', padding: '6px',
                      background: capIdx === w ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      color: capIdx === w ? '#3b82f6' : 'var(--text-secondary)', width: '32px', textAlign: 'center'
                    }}>
                      {capIdx}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dp.map((row, r) => {
                  const it = r > 0 ? knapItems[r - 1] : null;
                  return (
                    <tr key={r}>
                      <td style={{
                        border: '1px solid var(--glass-border)', padding: '6px',
                        background: r === i ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                        color: r === i ? '#ec4899' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap'
                      }}>
                        {r === 0 ? 'Ø' : `I${it.id} (W:${it.wt}, V:${it.val})`}
                      </td>
                      {row.map((val, c) => {
                        const isActive = i === r && w === c;
                        const isChosen = backtrackPath01.includes(r - 1) && c === knapCapacity && r > 0;
                        let cellBg = 'transparent';
                        let border = '1px solid var(--glass-border)';

                        if (isActive) {
                          cellBg = 'rgba(139, 92, 246, 0.3)';
                          border = '1.5px solid var(--accent-primary)';
                        } else if (isChosen) {
                          cellBg = 'rgba(16, 185, 129, 0.2)';
                          border = '1px solid #10b981';
                        }

                        return (
                          <td key={c} style={{
                            border, padding: '6px', background: cellBg,
                            textAlign: 'center', fontWeight: (isActive || isChosen) ? 'bold' : 'normal',
                            color: isChosen ? '#34d399' : 'white'
                          }}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Fractional Knapsack (Greedy Sorted List & Bag Fill) */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🍕 Fractional Knapsack (Greedy ratio)</span>
            <span style={{ fontSize: '0.82rem', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '2px 8px', borderRadius: '6px' }}>
              Val: {greedyValue.toFixed(1)}
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, justifyContent: 'center' }}>
            {/* Sorted Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Items sorted by V/W Ratio:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {greedyItems.map((item, idx) => {
                  let border = '1px solid var(--glass-border)';
                  let bg = 'rgba(255,255,255,0.02)';
                  if (item.selected) {
                    border = '1px solid #10b981';
                    bg = 'rgba(16, 185, 129, 0.15)';
                  }
                  return (
                    <div key={idx} style={{
                      border, background: bg, borderRadius: '8px',
                      padding: '6px', textAlign: 'center', fontSize: '0.78rem',
                      display: 'flex', flexDirection: 'column', gap: '2px'
                    }}>
                      <strong style={{ color: '#fbbf24' }}>I{item.id}</strong>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ratio: {item.ratio.toFixed(2)}</div>
                      {item.fraction > 0 && (
                        <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 'bold' }}>
                          Take: {(item.fraction * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bag Fill Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Knapsack Weight Capacity:</span>
                <strong style={{ color: greedyWeight === knapCapacity ? '#10b981' : '#fb923c' }}>
                  {greedyWeight.toFixed(1)} / {knapCapacity}
                </strong>
              </div>
              <div style={{
                height: '35px', width: '100%',
                background: 'rgba(0,0,0,0.2)', border: '1.5px solid var(--glass-border)',
                borderRadius: '10px', display: 'flex', overflow: 'hidden', position: 'relative'
              }}>
                {greedyItems.filter(i => i.fraction > 0).map((item, idx) => {
                  const widthPct = ((item.wt * item.fraction) / knapCapacity) * 100;
                  return (
                    <div key={idx} style={{
                      width: `${widthPct}%`, height: '100%',
                      background: `linear-gradient(to right, rgba(59, 130, 246, 0.7), rgba(139, 92, 246, 0.7))`,
                      borderRight: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 'bold', color: 'white', overflow: 'hidden', whiteSpace: 'nowrap'
                    }}>
                      I{item.id} ({(item.fraction * 100).toFixed(0)}%)
                    </div>
                  );
                })}
                {greedyWeight < knapCapacity && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Empty ({(100 - (greedyWeight / knapCapacity * 100)).toFixed(0)}%)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCoinChangeGrid = () => {
    const { dp = [], currAmount, activeCoin, greedyCoins = [], greedyRemaining } = currentFrame;

    if (dp.length === 0 && greedyCoins.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Configure coins and target, then click Solve to visualize DP vs Greedy selection.
        </div>
      );
    }

    const dpOptimalCount = dp[coinTarget] > coinTarget ? 'INF' : dp[coinTarget];
    const greedyOptimalCount = greedyRemaining === 0 ? greedyCoins.length : 'FAILED';
    const isSuboptimal = greedyRemaining === 0 && greedyOptimalCount > dpOptimalCount && dpOptimalCount !== 'INF';

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>

        {/* Left Side: Dynamic Programming array */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.2rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🪙 Min Coins (DP Array)</span>
            <span style={{ fontSize: '0.82rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 8px', borderRadius: '6px' }}>
              Min Coins: {dpOptimalCount}
            </span>
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', margin: 'auto' }}>
            {dp.map((val, idx) => {
              const isActive = currAmount === idx;
              let border = '1px solid var(--glass-border)';
              let bg = 'rgba(255,255,255,0.02)';
              let color = 'white';

              if (isActive) {
                border = '2px solid var(--accent-primary)';
                bg = 'rgba(139, 92, 246, 0.2)';
              } else if (idx === coinTarget) {
                border = '1.5px solid #10b981';
                bg = 'rgba(16, 185, 129, 0.1)';
                color = '#34d399';
              }

              return (
                <div key={idx} style={{
                  width: '42px', height: '55px',
                  borderRadius: '8px', border, background: bg,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>${idx}</span>
                  <strong style={{ fontSize: '0.95rem', color }}>
                    {val > coinTarget ? '∞' : val}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Greedy Coin Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1.2rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🤑 Greedy Coin Selection</span>
            <span style={{ fontSize: '0.82rem', background: isSuboptimal ? 'rgba(239, 68, 68, 0.15)' : 'rgba(236, 72, 153, 0.15)', border: `1px solid ${isSuboptimal ? '#ef4444' : 'rgba(236, 72, 153, 0.3)'}`, color: isSuboptimal ? '#f87171' : 'white', padding: '2px 8px', borderRadius: '6px' }}>
              Coins: {greedyOptimalCount}
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Remaining Target Amount:</span>
              <strong style={{ color: '#fb923c', fontSize: '1.05rem' }}>{greedyRemaining}</strong>
            </div>

            {isSuboptimal && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px', padding: '8px 12px', color: '#f87171', fontSize: '0.78rem', lineHeight: '1.4'
              }}>
                ⚠️ <strong>Sub-optimal greedy result!</strong> Greedy picked {greedyOptimalCount} coins, but the optimal DP solution only needs {dpOptimalCount} coins.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Selected Coins in Bag:</div>
              <div style={{
                minHeight: '75px', width: '100%',
                background: 'rgba(0,0,0,0.2)', border: '1.5px dashed var(--glass-border)',
                borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px',
                alignItems: 'center', justifyContent: 'center'
              }}>
                {greedyCoins.map((coin, idx) => (
                  <div key={idx} style={{
                    width: '35px', height: '35px',
                    borderRadius: '50%', background: 'linear-gradient(135deg, #fcd34d, #fbbf24)',
                    border: '1px solid #d97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#78350f', fontWeight: 'bold', fontSize: '0.9rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                  }}>
                    {coin}
                  </div>
                ))}
                {greedyCoins.length === 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Bag is empty</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary, #0f172a)' }}>

      {/* HEADER SECTION */}
      <header className="header-glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
          <h1 className="title-gradient" style={{ fontSize: '1.6rem', fontWeight: 800 }}>DP & Greedy Studio</h1>
        </div>

        {/* Algorithm Selection Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '3px', gap: '3px' }}>
          {[
            { id: 'LCS', name: '🧬 LCS' },
            { id: 'LIS', name: '📈 LIS' },
            { id: 'Knapsack', name: '🎒 Knapsack' },
            { id: 'CoinChange', name: '🪙 Coin Change' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#60a5fa' : 'var(--text-secondary)',
                border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal', fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.name}
            </button>
          ))}
          <button 
            type="button" 
            className="btn btn-clear" 
            style={{ padding: '4px 10px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => setShowTopicInfo(true)}
            title="Learn about this algorithm (Beginner Guide)"
          >
            ℹ️ Info
          </button>
        </div>

        {/* Action Controls */}
        <div className="controls-glass" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn btn-clear" style={{ background: 'rgba(139, 92, 246, 0.18)', color: '#a78bfa' }} onClick={() => setShowComplexity(!showComplexity)}>
            {showComplexity ? '👁️ Hide Big-O' : '👁️ Show Big-O'}
          </button>
          <button className="btn btn-clear" onClick={() => setShowCode(!showCode)}>
            {showCode ? '📖 Hide Code' : '📖 Show Code'}
          </button>
          <button className="btn btn-clear" onClick={openSettings}>⚙ Settings</button>
        </div>
      </header>

      {/* INPUT PANEL AND RUN BUTTONS */}
      <div style={{ display: 'flex', padding: '10px 20px', background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexShrink: 0 }}>

        {/* Dynamic Inputs based on selected Tab */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>

          {activeTab === 'LCS' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>String 1:</span>
                <input type="text" className="styled-input" style={{ width: '130px', padding: '5px 10px', fontSize: '0.88rem' }} value={lcsStr1} onChange={e => { setLcsStr1(e.target.value); handleReset(); }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>String 2:</span>
                <input type="text" className="styled-input" style={{ width: '130px', padding: '5px 10px', fontSize: '0.88rem' }} value={lcsStr2} onChange={e => { setLcsStr2(e.target.value); handleReset(); }} />
              </div>
              <button className="btn btn-insert" onClick={solveLCS} disabled={isPlaying}>Animate LCS</button>
            </>
          )}

          {activeTab === 'LIS' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, maxWidth: '500px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Array:</span>
                <input type="text" className="styled-input" style={{ width: '100%', padding: '5px 10px', fontSize: '0.88rem' }} value={lisArrInput} onChange={e => { setLisArrInput(e.target.value); handleReset(); }} placeholder="e.g. 10, 22, 9, 33" />
              </div>
              <button className="btn btn-insert" onClick={solveLIS} disabled={isPlaying}>Animate LIS</button>
            </>
          )}

          {activeTab === 'Knapsack' && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Capacity:</span>
                <input type="number" className="styled-input" style={{ width: '65px', padding: '5px 8px', fontSize: '0.88rem' }} value={knapCapacity} onChange={e => { setKnapCapacity(parseInt(e.target.value) || 0); handleReset(); }} />
              </div>

              {/* Item Manager */}
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center', borderRight: '1px solid var(--glass-border)', paddingRight: '15px' }}>
                <input type="number" className="styled-input" style={{ width: '70px', padding: '5px 8px', fontSize: '0.85rem' }} placeholder="Val" value={newItemVal} onChange={e => setNewItemVal(e.target.value)} />
                <input type="number" className="styled-input" style={{ width: '70px', padding: '5px 8px', fontSize: '0.85rem' }} placeholder="Wt" value={newItemWt} onChange={e => setNewItemWt(e.target.value)} />
                <button className="btn btn-clear" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={handleAddItem}>➕ Add Item</button>
              </div>

              {/* Items Pill List */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flex: 1, maxWidth: '400px' }}>
                {knapItems.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '2px 8px', fontSize: '0.75rem'
                  }}>
                    <span>I{item.id} (W:{item.wt}, V:{item.val})</span>
                    <button style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleRemoveItem(item.id)}>✕</button>
                  </div>
                ))}
              </div>

              <button className="btn btn-insert" onClick={solveKnapsack} disabled={isPlaying}>Animate Knapsack</button>
            </div>
          )}

          {activeTab === 'CoinChange' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, maxWidth: '350px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Coins:</span>
                <input type="text" className="styled-input" style={{ width: '100%', padding: '5px 10px', fontSize: '0.88rem' }} value={coinInput} onChange={e => { setCoinInput(e.target.value); handleReset(); }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Target:</span>
                <input type="number" className="styled-input" style={{ width: '70px', padding: '5px 10px', fontSize: '0.88rem' }} value={coinTarget} onChange={e => { setCoinTarget(parseInt(e.target.value) || 0); handleReset(); }} />
              </div>
              <button className="btn btn-insert" onClick={solveCoinChange} disabled={isPlaying}>Animate Coins</button>
            </>
          )}

        </div>

        {/* Speed / Media control summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Speed ({speed}ms):</span>
          <input
            type="range" min="100" max="3500" step="50"
            value={speed} onChange={e => setSpeed(parseInt(e.target.value))}
            style={{ width: '120px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            title={`Delay: ${speed}ms`}
          />
        </div>
      </div>

      {/* MAIN CONTENT BLOCK */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* VISUALIZER GRID AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 30, 0.3)', position: 'relative', overflow: 'hidden' }}>

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

            {activeTab === 'LCS' && renderLCSGrid()}
            {activeTab === 'LIS' && renderLISGrid()}
            {activeTab === 'Knapsack' && renderKnapsackGrid()}
            {activeTab === 'CoinChange' && renderCoinChangeGrid()}

            {/* FLOATING COMPLEXITY CARD OVERLAY */}
            {showComplexity && (
              <div style={{
                position: 'absolute', top: '15px', right: '15px', zIndex: 30,
                width: '250px', background: 'rgba(15, 23, 42, 0.88)', border: '1.5px solid var(--glass-border)',
                borderRadius: '12px', padding: '12px', backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)', transition: 'all 0.3s ease'
              }}>
                {(() => {
                  const comp = getDPComplexityInfo(activeTab);
                  if (!comp) return null;
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>📊 Big-O Complexity</span>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setShowComplexity(false)}>✕</button>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 'bold', marginBottom: '8px' }}>{comp.title}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {comp.operations.map((op, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{op.op}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              <span>Time: <strong style={{ color: '#fbbf24' }}>{op.time}</strong></span>
                              <span>Space: <strong style={{ color: '#f472b6' }}>{op.space}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

          </div>

          {/* PLAYBACK CONTROL BAR AT THE BOTTOM */}
          <div style={{ display: 'flex', padding: '12px 20px', background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', alignItems: 'center', justifyContent: 'space-between', gap: '15px', zIndex: 10, flexShrink: 0 }}>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="btn btn-clear" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { handleReset(); }} disabled={timeline.length === 0}>
                🔄 Restart
              </button>
              <button className="btn btn-clear" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setCurrentStep(p => Math.max(0, p - 1)); }} disabled={timeline.length === 0 || currentStep === 0}>
                ◀ Prev Step
              </button>
              <button
                className="btn btn-insert"
                style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={timeline.length === 0}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button className="btn btn-clear" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={timeline.length === 0 || currentStep === timeline.length - 1}>
                Next Step ▶
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Frame {timeline.length > 0 ? currentStep + 1 : 0} / {timeline.length}</span>
              <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', transition: 'width 0.15s ease' }}></div>
              </div>
            </div>

          </div>

        </div>

        {/* DRAGGABLE EXECUTION LOG PANEL OVERLAY */}
        {showLogPanel && timeline.length > 0 && (
          <div
            onMouseDown={handleLogMouseDown}
            onTouchStart={handleLogMouseDown}
            style={{
              position: 'absolute',
              left: `${logPosition.x}px`,
              top: `${logPosition.y}px`,
              width: `${logSize.width}px`,
              height: `${logSize.height}px`,
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--glass-border)',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 100
            }}
          >
            {/* Log Header handle */}
            <div className="log-drag-handle" style={{
              padding: '10px 15px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)',
              cursor: 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                <span>📜 Execution Tracelog</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }} onClick={() => setShowLogPanel(false)}>✕</button>
              </div>
            </div>

            {/* Split panel: Left for Active State Values, Right for chronological text logs */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

              {/* Active State Values */}
              <div style={{ width: `${activeStateWidth}px`, borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)' }}>
                  State Variables
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  {activeTab === 'LCS' && (
                    <>
                      <div>String 1: <strong style={{ color: '#3b82f6' }}>&quot;{lcsStr1}&quot;</strong></div>
                      <div>String 2: <strong style={{ color: '#ec4899' }}>&quot;{lcsStr2}&quot;</strong></div>
                      <div>i (row): <strong style={{ color: '#ec4899' }}>{currentFrame.i}</strong></div>
                      <div>j (col): <strong style={{ color: '#3b82f6' }}>{currentFrame.j}</strong></div>
                      {currentFrame.lcsStr && <div>LCS: <strong style={{ color: '#10b981' }}>&quot;{currentFrame.lcsStr}&quot;</strong></div>}
                    </>
                  )}
                  {activeTab === 'LIS' && (
                    <>
                      <div>i: <strong style={{ color: '#fb923c' }}>{currentFrame.i}</strong></div>
                      <div>j: <strong style={{ color: '#38bdf8' }}>{currentFrame.j}</strong></div>
                      {currentFrame.arr && <div>Value[i]: <strong style={{ color: '#fb923c' }}>{currentFrame.arr[currentFrame.i] ?? '-'}</strong></div>}
                      {currentFrame.arr && <div>Value[j]: <strong style={{ color: '#38bdf8' }}>{currentFrame.arr[currentFrame.j] ?? '-'}</strong></div>}
                      {currentFrame.dp && <div>dp[i]: <strong style={{ color: '#10b981' }}>{currentFrame.dp[currentFrame.i] ?? '-'}</strong></div>}
                    </>
                  )}
                  {activeTab === 'Knapsack' && (
                    <>
                      <div>W Capacity: <strong style={{ color: '#3b82f6' }}>{knapCapacity}</strong></div>
                      <div>i (Item): <strong style={{ color: '#ec4899' }}>{currentFrame.i === -1 ? 'Greedy run' : currentFrame.i}</strong></div>
                      <div>w (Weight): <strong style={{ color: '#3b82f6' }}>{currentFrame.w === -1 ? 'Greedy run' : currentFrame.w}</strong></div>
                      {currentFrame.greedyWeight > 0 && <div>Greedy W: <strong style={{ color: '#fb923c' }}>{currentFrame.greedyWeight.toFixed(1)}</strong></div>}
                      {currentFrame.greedyValue > 0 && <div>Greedy V: <strong style={{ color: '#34d399' }}>{currentFrame.greedyValue.toFixed(1)}</strong></div>}
                    </>
                  )}
                  {activeTab === 'CoinChange' && (
                    <>
                      <div>Target: <strong style={{ color: '#3b82f6' }}>{coinTarget}</strong></div>
                      <div>DP Subsum: <strong style={{ color: '#ec4899' }}>{currentFrame.currAmount === -1 ? 'Greedy run' : currentFrame.currAmount}</strong></div>
                      <div>Active Coin: <strong style={{ color: '#fb923c' }}>{currentFrame.activeCoin === -1 ? '-' : currentFrame.activeCoin}</strong></div>
                      <div>Greedy Left: <strong style={{ color: '#f87171' }}>{currentFrame.greedyRemaining}</strong></div>
                    </>
                  )}
                </div>
              </div>

              {/* Col Resize bar */}
              <div
                onMouseDown={handleActiveStateColDragStart}
                onTouchStart={handleActiveStateColDragStart}
                style={{ width: '4px', cursor: 'col-resize', background: 'transparent', hover: { background: 'var(--accent-primary)' } }}
              />

              {/* Chronological steps */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '8px 12px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)' }}>
                  Chronological Step History
                </div>
                <div ref={logContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {currentFrame.logs?.map((log, idx) => (
                    <div key={idx} className="execution-log-item" style={{
                      color: idx === currentFrame.logs.length - 1 ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: idx === currentFrame.logs.length - 1 ? 'bold' : 'normal',
                      fontSize: '0.8rem'
                    }}>
                      • {log}
                    </div>
                  ))}
                  {(!currentFrame.logs || currentFrame.logs.length === 0) && (
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>No steps recorded yet.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Visual step highlight at bottom of log panel */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 15px', borderTop: '1px solid var(--glass-border)', fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, minHeight: '34px' }}>
              💡 {currentFrame.msg || 'Ready to analyze.'}
            </div>

            {/* Resize Handle */}
            <div
              onMouseDown={handleResizeMouseDown}
              onTouchStart={handleResizeMouseDown}
              style={{
                position: 'absolute', bottom: '0', right: '0', width: '15px', height: '15px',
                cursor: 'se-resize', background: 'transparent',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '2px'
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8"><path d="M6 0 L8 0 L8 8 L0 8 L0 6 L4 6 L4 4 L6 4 Z" fill="rgba(255,255,255,0.3)" /></svg>
            </div>

          </div>
        )}

        {/* CODE PANELS / MULTILANGUAGE CODE TEMPLATES ON RIGHT */}
        {showCode && (
          <div style={{ width: `${codeWidth}px`, borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', flexShrink: 0 }}>

            {/* Header controls for language selection */}
            <div style={{ padding: '10px 15px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['C++', 'Java', 'Python', 'JS'].map(lang => (
                  <button
                    key={lang}
                    className={`code-tab ${codeLanguage === lang ? 'active' : ''}`}
                    onClick={() => setCodeLanguage(lang)}
                  >
                    {lang === 'JS' ? 'JavaScript' : lang}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setIsRunnerOpen(true)}
                  className="btn btn-clear"
                  style={{ padding: '2px 8px', fontSize: '0.78rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px' }}
                >
                  ▶ Run Code
                </button>
                <button className="btn btn-clear" style={{ padding: '2px 8px', fontSize: '0.78rem' }} onClick={handleCopyCode}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Code Box displaying the template */}
            <div className="code-box" style={{ flex: 1, borderRadius: 0, border: 'none', margin: 0, overflowY: 'auto' }}>
              <pre style={{
                margin: 0,
                color: 'var(--text-primary)',
                fontFamily: "'Fira Code', monospace",
                lineHeight: '1.5',
                fontSize: `${fontSize}px`,
                whiteSpace: wordWrap === 'on' ? 'pre-wrap' : 'pre'
              }}>
                {currentCode}
              </pre>
            </div>

            {/* Drag column resize */}
            <div
              onMouseDown={handleColDragStart}
              onTouchStart={handleColDragStart}
              style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: '4px',
                cursor: 'col-resize', background: 'transparent', zIndex: 10
              }}
            />

          </div>
        )}

      </div>

      {/* Code Runner Modal integration */}
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={currentCode}
        language={codeLanguage}
      />
      <TopicInfoModal
        topicKey={activeTab}
        isOpen={showTopicInfo}
        onClose={() => setShowTopicInfo(false)}
      />
    </div>
  );
};

export default DPGreedyVisualizer;
