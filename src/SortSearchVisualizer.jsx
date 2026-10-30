/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { getSortSearchCode } from './codeTemplatesSort';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import NumberedCodeViewer from './NumberedCodeViewer.jsx';
import TopicInfoModal from './TopicInfoModal.jsx';
import { setScreenContext, recordScreenError } from './screenContext.js';

// Allman brace formatter
const toAllman = code => {
  if (!code) return '';
  const lines = code.split('\n');
  const out = [];
  for (const line of lines) {
    const t = line.trimEnd();
    if (t.endsWith('{') && t.trim() !== '{' && !t.trim().startsWith('//') && !t.trim().startsWith('*')) {
      const indent = line.match(/^(\s*)/)[1];
      const body = t.slice(0, -1).trimEnd();
      if (body.trim().length > 0) { out.push(body); out.push(indent + '{'); continue; }
    }
    out.push(line);
  }
  return out.join('\n');
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

export const ALGO_COMPLEXITIES = {
  'Bubble Sort': {
    timeBest: 'Ω(N)',
    timeAvg: 'Θ(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    inPlace: 'Yes',
    type: 'Comparison (Exchange)'
  },
  'Selection Sort': {
    timeBest: 'Ω(N²)',
    timeAvg: 'Θ(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'No',
    inPlace: 'Yes',
    type: 'Comparison (Selection)'
  },
  'Insertion Sort': {
    timeBest: 'Ω(N)',
    timeAvg: 'Θ(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    inPlace: 'Yes',
    type: 'Comparison (Insertion)'
  },
  'Merge Sort': {
    timeBest: 'Ω(N log N)',
    timeAvg: 'Θ(N log N)',
    timeWorst: 'O(N log N)',
    space: 'O(N)',
    stable: 'Yes',
    inPlace: 'No',
    type: 'Divide & Conquer'
  },
  'Quick Sort': {
    timeBest: 'Ω(N log N)',
    timeAvg: 'Θ(N log N)',
    timeWorst: 'O(N²)',
    space: 'O(log N)',
    stable: 'No',
    inPlace: 'Yes',
    type: 'Divide & Conquer (Partition)'
  },
  'Heap Sort': {
    timeBest: 'Ω(N log N)',
    timeAvg: 'Θ(N log N)',
    timeWorst: 'O(N log N)',
    space: 'O(1)',
    stable: 'No',
    inPlace: 'Yes',
    type: 'Comparison (Binary Heap)'
  },
  'Shell Sort': {
    timeBest: 'Ω(N log N)',
    timeAvg: 'Θ(N^(4/3))',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'No',
    inPlace: 'Yes',
    type: 'Diminishing Increment Sort'
  },
  'Cocktail Shaker Sort': {
    timeBest: 'Ω(N)',
    timeAvg: 'Θ(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    inPlace: 'Yes',
    type: 'Bidirectional Bubble Sort'
  },
  'Cocktail Sort': {
    timeBest: 'Ω(N)',
    timeAvg: 'Θ(N²)',
    timeWorst: 'O(N²)',
    space: 'O(1)',
    stable: 'Yes',
    inPlace: 'Yes',
    type: 'Bidirectional Bubble Sort'
  },
  'Counting Sort': {
    timeBest: 'Ω(N + K)',
    timeAvg: 'Θ(N + K)',
    timeWorst: 'O(N + K)',
    space: 'O(K)',
    stable: 'Yes',
    inPlace: 'No',
    type: 'Non-Comparison Integer Sort'
  },
  'Radix Sort': {
    timeBest: 'Ω(N · d)',
    timeAvg: 'Θ(N · d)',
    timeWorst: 'O(N · d)',
    space: 'O(N + K)',
    stable: 'Yes',
    inPlace: 'No',
    type: 'Non-Comparison Distribution'
  },
  'Linear Search': {
    timeBest: 'Ω(1)',
    timeAvg: 'Θ(N)',
    timeWorst: 'O(N)',
    space: 'O(1)',
    stable: 'N/A',
    inPlace: 'Yes',
    type: 'Sequential Search'
  },
  'Binary Search': {
    timeBest: 'Ω(1)',
    timeAvg: 'Θ(log N)',
    timeWorst: 'O(log N)',
    space: 'O(1)',
    stable: 'N/A',
    inPlace: 'Yes',
    type: 'Divide & Conquer Search'
  }
};

export const detectInputCase = (algo, arr, searchVal) => {
  if (!arr || arr.length === 0) return 'avg';

  const n = arr.length;
  let isSorted = true;
  let isReverseSorted = true;
  for (let idx = 0; idx < n - 1; idx++) {
    if (arr[idx] > arr[idx + 1]) isSorted = false;
    if (arr[idx] < arr[idx + 1]) isReverseSorted = false;
  }

  if (algo === 'Bubble Sort' || algo === 'Insertion Sort' || algo === 'Cocktail Shaker Sort' || algo === 'Cocktail Sort') {
    if (isSorted) return 'best';
    if (isReverseSorted) return 'worst';
    return 'avg';
  }

  if (algo === 'Quick Sort') {
    if (isSorted || isReverseSorted) return 'worst';
    return 'avg';
  }

  if (algo === 'Selection Sort') {
    if (isSorted) return 'best';
    if (isReverseSorted) return 'worst';
    return 'avg';
  }

  if (algo === 'Shell Sort') {
    if (isSorted) return 'best';
    if (isReverseSorted) return 'worst';
    return 'avg';
  }

  if (algo === 'Merge Sort' || algo === 'Heap Sort' || algo === 'Counting Sort' || algo === 'Radix Sort') {
    return 'avg';
  }

  if (algo === 'Linear Search') {
    const val = parseInt(searchVal);
    if (isNaN(val)) return 'avg';
    const targetIdx = arr.indexOf(val);
    if (targetIdx === 0) return 'best';
    if (targetIdx === -1 || targetIdx === arr.length - 1) return 'worst';
    return 'avg';
  }

  if (algo === 'Binary Search') {
    const val = parseInt(searchVal);
    if (isNaN(val)) return 'avg';
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor((sorted.length - 1) / 2);
    if (sorted[mid] === val) return 'best';
    if (!sorted.includes(val)) return 'worst';
    return 'avg';
  }

  return 'avg';
};

export const getPointerDetails = (algo, frame) => {
  if (!frame) return [];
  const { arr, i, j, k } = frame;
  const getValStr = (idx) => {
    if (idx === undefined || idx === -1 || !arr) return null;
    return `Index ${idx} (Val: ${arr[idx] ?? 'N/A'})`;
  };
  const details = [];

  if (algo === 'Bubble Sort') {
    if (i !== -1) details.push({ label: 'Index j', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Index j+1', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Sorted boundary', val: getValStr(k), color: '#10b981' });
  } else if (algo === 'Selection Sort') {
    if (i !== -1) details.push({ label: 'Index j', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Min Index', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Index i (sorted)', val: getValStr(k), color: '#10b981' });
  } else if (algo === 'Insertion Sort') {
    if (i !== -1) details.push({ label: 'Active Key Index', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Index j', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Sorted Boundary', val: getValStr(k), color: '#10b981' });
  } else if (algo === 'Merge Sort') {
    if (i !== -1) details.push({ label: 'Merge Left', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Merge Right', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Merge Active', val: getValStr(k), color: '#10b981' });
  } else if (algo === 'Quick Sort') {
    if (i !== -1) details.push({ label: 'Pivot Index', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Pointer i', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Pointer j', val: getValStr(k), color: '#10b981' });
  } else if (algo === 'Heap Sort') {
    if (i !== -1) details.push({ label: 'Node i', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Largest Node', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'End index', val: getValStr(k), color: '#10b981' });
  } else if (algo === 'Counting Sort') {
    if (i !== -1) details.push({ label: 'Input Index', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Placed Index', val: getValStr(j), color: '#60a5fa' });
  } else if (algo === 'Radix Sort') {
    if (i !== -1) details.push({ label: 'Item Index', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Output Index', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Place Value', val: `${k}s place`, color: '#10b981' });
  } else if (algo === 'Shell Sort') {
    if (i !== -1) details.push({ label: 'Index i', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Index j', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Current Gap', val: String(k), color: '#10b981' });
  } else if (algo === 'Cocktail Shaker Sort' || algo === 'Cocktail Sort') {
    if (i !== -1) details.push({ label: 'Index i', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Swapped occurred', val: j === 1 ? 'Yes' : 'No', color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Direction', val: k === 1 ? 'Forward' : 'Backward', color: '#10b981' });
  } else if (algo === 'Linear Search') {
    if (i !== -1) details.push({ label: 'Mid/Active Index', val: getValStr(i), color: '#fbbf24' });
  } else if (algo === 'Binary Search') {
    if (i !== -1) details.push({ label: 'Mid Index', val: getValStr(i), color: '#fbbf24' });
    if (j !== -1) details.push({ label: 'Left Index', val: getValStr(j), color: '#60a5fa' });
    if (k !== -1) details.push({ label: 'Right Index', val: getValStr(k), color: '#10b981' });
  }

  return details;
};

const getHeapTreePositions = (n, width, height) => {
  if (n === 0) return [];
  const levels = Math.floor(Math.log2(n)) + 1;
  const paddingY = 40;
  const paddingX = 35;
  const usableWidth = width - 2 * paddingX;
  const usableHeight = height - 2 * paddingY;

  const positions = [];
  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const levelNodes = Math.pow(2, level);
    const levelIndex = i - (levelNodes - 1);

    const y = paddingY + (usableHeight / Math.max(1, levels - 1)) * level;
    const x = paddingX + (usableWidth / levelNodes) * (levelIndex + 0.5);

    positions.push({ x, y, level, levelIndex });
  }
  return positions;
};

const getBSTPositions = (arr, width, height) => {
  if (arr.length === 0) return [];

  const nodes = Array(arr.length).fill(null).map((_, idx) => ({
    idx,
    val: arr[idx],
    depth: 0,
    parentIdx: -1,
    leftIdx: -1,
    rightIdx: -1
  }));

  const buildTree = (l, r, parentIdx, depth) => {
    if (l > r) return -1;
    const m = Math.floor((l + r) / 2);

    nodes[m].depth = depth;
    nodes[m].parentIdx = parentIdx;

    nodes[m].leftIdx = buildTree(l, m - 1, m, depth + 1);
    nodes[m].rightIdx = buildTree(m + 1, r, m, depth + 1);
    return m;
  };

  buildTree(0, arr.length - 1, -1, 0);

  const maxDepth = Math.max(...nodes.map(n => n.depth), 1);
  const paddingX = 40;
  const paddingY = 45;
  const usableWidth = width - 2 * paddingX;
  const usableHeight = height - 2 * paddingY;

  const positions = nodes.map((node) => {
    const x = arr.length > 1 ? paddingX + (node.idx * usableWidth) / (arr.length - 1) : paddingX + usableWidth / 2;
    const y = maxDepth > 0 ? paddingY + (node.depth * usableHeight) / maxDepth : paddingY + usableHeight / 2;
    return {
      ...node,
      x,
      y
    };
  });

  return positions;
};

const highlightLogText = (text) => {
  if (!text) return '';
  const str = String(text);

  const renderContent = (contentStr) => {
    const lower = contentStr.toLowerCase();

    if (
      lower.includes('root full') ||
      lower.includes('split') ||
      lower.includes('imbalance') ||
      lower.includes('rotate') ||
      lower.includes('rotation') ||
      lower.includes('delete') ||
      lower.includes('deleted') ||
      lower.includes('remove') ||
      lower.includes('removed') ||
      lower.includes('pop') ||
      lower.includes('popped') ||
      lower.includes('mismatch') ||
      lower.includes('not found') ||
      lower.includes('⚡')
    ) {
      const regex = /(\b\d+(?:\.\d+)?\b)/g;
      const parts = contentStr.split(regex);
      return (
        <span style={{ color: '#f87171', fontWeight: 'bold' }}>
          {parts.map((p, i) =>
            regex.test(p) ? <span key={i} style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.3)' }}>{p}</span> : p
          )}
        </span>
      );
    }

    if (
      lower.includes('starting') ||
      lower.includes('starting ') ||
      lower.includes('inserted') ||
      lower.includes('insert(') ||
      lower.includes('insert ') ||
      lower.includes('create node') ||
      lower.includes('success') ||
      lower.includes('match') ||
      lower.includes('completed') ||
      lower.includes('complete') ||
      lower.includes('done') ||
      lower.includes('found') ||
      lower.includes('placed') ||
      lower.includes('✦') ||
      lower.includes('✓') ||
      lower.includes('✅')
    ) {
      const regex = /(\b\d+(?:\.\d+)?\b)/g;
      const parts = contentStr.split(regex);
      return (
        <span style={{ color: '#34d399', fontWeight: 'bold' }}>
          {parts.map((p, i) =>
            regex.test(p) ? <span key={i} style={{ color: '#fbbf24' }}>{p}</span> : p
          )}
        </span>
      );
    }

    if (
      lower.includes('going to') ||
      lower.includes('compare') ||
      lower.includes('comparing') ||
      lower.includes('probe') ||
      lower.includes('probing') ||
      lower.includes('relaxation') ||
      lower.includes('check') ||
      lower.includes('swap') ||
      lower.includes('swapped') ||
      lower.includes('➜') ||
      lower.includes('↳')
    ) {
      const regex = /(\b\d+(?:\.\d+)?\b)/g;
      const parts = contentStr.split(regex);
      return (
        <span style={{ color: '#fb923c', fontWeight: 600 }}>
          {parts.map((p, i) =>
            regex.test(p) ? <span key={i} style={{ color: '#fbbf24', fontWeight: 'bold' }}>{p}</span> : p
          )}
        </span>
      );
    }

    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = contentStr.split(regex);
    return parts.map((p, i) =>
      /^\d+(?:\.\d+)?$/.test(p) ? <strong key={i} style={{ color: '#fbbf24' }}>{p}</strong> : p
    );
  };

  return (
    <span>
      {renderContent(str)}
    </span>
  );
};

const isSortSearchLineMatch = (algo, msg, lineText) => {
  const m = String(msg).toLowerCase();
  const line = String(lineText).trim().toLowerCase();

  if (line.startsWith('//') || line.startsWith('import') || line.startsWith('#include') || line.startsWith('using')) {
    return false;
  }

  if (algo === 'Bubble Sort') {
    if (m.includes('starting')) {
      return line.includes('void bubblesort') || line.includes('def bubble_sort') || line.includes('function bubblesort');
    }
    if (m.includes('comparing')) {
      return line.includes('if') && (line.includes('[j]') || line.includes('[j+1]') || line.includes('[j + 1]'));
    }
    if (m.includes('swapped')) {
      return line.includes('swap') || line.includes('temp') || line.includes('arr[j] =') || line.includes('arr[j+1] =') || line.includes('arr[j + 1] =');
    }
    if (m.includes('placed')) {
      return line.includes('for') && (line.includes('i <') || line.includes('range'));
    }
    if (m.includes('complete')) {
      return line.includes('return') || line.includes('}');
    }
  }

  if (algo === 'Selection Sort') {
    if (m.includes('starting')) {
      return line.includes('selectionsort') || line.includes('selection_sort');
    }
    if (m.includes('comparing')) {
      return line.includes('if') && line.includes('arr[j]') && line.includes('min_idx');
    }
    if (m.includes('new minimum')) {
      return line.includes('min_idx = j') || line.includes('min_idx =');
    }
    if (m.includes('swapped')) {
      return line.includes('swap') || line.includes('temp') || line.includes('arr[i] =');
    }
    if (m.includes('placed')) {
      return line.includes('for') && (line.includes('i <') || line.includes('range'));
    }
  }

  if (algo === 'Insertion Sort') {
    if (m.includes('starting')) {
      return line.includes('insertionsort') || line.includes('insertion_sort');
    }
    if (m.includes('selected key')) {
      return line.includes('key =');
    }
    if (m.includes('moving')) {
      return line.includes('arr[j + 1] = arr[j]') || line.includes('arr[j+1] = arr[j]') || line.includes('while');
    }
    if (m.includes('placed key')) {
      return line.includes('arr[j + 1] = key') || line.includes('arr[j+1] = key');
    }
  }

  if (algo === 'Merge Sort') {
    if (m.includes('starting')) {
      return line.includes('mergesort') || line.includes('merge_sort');
    }
    if (m.includes('comparing')) {
      return line.includes('if') && line.includes('l[i] <= r[j]');
    }
    if (m.includes('writing') || m.includes('copying')) {
      return line.includes('arr[k') || line.includes('arr[k++]');
    }
  }

  if (algo === 'Quick Sort') {
    if (m.includes('starting')) {
      return line.includes('quicksort') || line.includes('quick_sort');
    }
    if (m.includes('pivot selected')) {
      return line.includes('pivot =') || line.includes('arr[high]');
    }
    if (m.includes('comparing')) {
      return line.includes('if') && line.includes('pivot');
    }
    if (m.includes('swapped')) {
      return line.includes('swap') || line.includes('temp');
    }
    if (m.includes('placed pivot') || m.includes('correct position')) {
      return line.includes('swap') && (line.includes('i+1') || line.includes('high'));
    }
  }

  if (algo === 'Heap Sort') {
    if (m.includes('starting')) {
      return line.includes('heapsort') || line.includes('heap_sort');
    }
    if (m.includes('heapify')) {
      return line.includes('heapify');
    }
    if (m.includes('swapped') || m.includes('extract')) {
      return line.includes('swap') || line.includes('temp');
    }
  }

  if (algo === 'Binary Search') {
    if (m.includes('starting')) {
      return line.includes('binarysearch') || line.includes('binary_search');
    }
    if (m.includes('mid')) {
      return line.includes('mid =');
    }
    if (m.includes('found')) {
      return line.includes('return mid') || line.includes('return true') || line.includes('return');
    }
    if (m.includes('smaller')) {
      return line.includes('high =') || line.includes('r =');
    }
    if (m.includes('larger')) {
      return line.includes('low =') || line.includes('l =');
    }
    if (m.includes('not found') || m.includes('not present')) {
      return line.includes('return -1') || line.includes('return false');
    }
  }

  if (algo === 'Linear Search') {
    if (m.includes('starting')) {
      return line.includes('linearsearch') || line.includes('linear_search');
    }
    if (m.includes('comparing') || m.includes('check')) {
      return line.includes('if') && (line.includes('arr[i]') || line.includes('== target'));
    }
    if (m.includes('found')) {
      return line.includes('return i') || line.includes('return true') || line.includes('return');
    }
    if (m.includes('not found') || m.includes('not present')) {
      return line.includes('return -1') || line.includes('return false');
    }
  }

  return false;
};

const SortSearchVisualizer = ({ onBack, openSettings, initialTab = 'Sort', initialSort = 'Bubble Sort', initialSearch = 'Linear Search', onCopyCode, onCodeChange, fontSize = 14, wordWrap = 'off', onShowUpcomingFeatures }) => {
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  const [array, setArray] = useState([]);
  const [visualizerStyle, setVisualizerStyle] = useState('classic'); // 'classic' or 'crane'
  const [initialArray, setInitialArray] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [searchValue, setSearchValue] = useState('');
  const [customArrayStr, setCustomArrayStr] = useState('');
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedSearch, setSelectedSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState(initialTab); // 'Sort' or 'Search'
  const currentDisplayedAlgo = activeTab === 'Sort' ? selectedSort : selectedSearch;
  const [codeLang, setCodeLang] = useState('C');
  const [showCode, setShowCode] = useState(false);
  const [showTopicInfo, setShowTopicInfo] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [mobileTab, setMobileTab] = useState('vis'); // 'vis' | 'code' | 'log'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize Live Screen Telemetry & Problem Diagnostics for AI ChatBot
  useEffect(() => {
    const algo = activeTab === 'Sort' ? selectedSort : selectedSearch;
    const stepData = timeline && timeline[currentStep] ? timeline[currentStep] : null;
    const recentMsgs = timeline ? timeline.slice(Math.max(0, currentStep - 4), currentStep + 1).map(s => s.msg) : [];
    const screenSummary = `${activeTab} mode with algorithm ${algo}. Array: [${array.slice(0, 10).join(', ')}${array.length > 10 ? '...' : ''}]. ${activeTab === 'Search' ? `Searching for: ${searchValue}` : ''}`;

    let problem = null;
    if (stepData?.msg) {
      const m = stepData.msg.toLowerCase();
      if (m.includes('not found') || m.includes('failed') || m.includes('error')) {
        problem = stepData.msg;
      }
    }

    setScreenContext({
      screenTitle: `${activeTab} Visualizer`,
      activeAlgo: algo,
      currentStep,
      totalSteps: timeline ? timeline.length : 0,
      currentStepMessage: stepData?.msg || `${algo} ready on array of ${array.length} items.`,
      recentLogs: recentMsgs,
      screenDataSummary: screenSummary,
      lastErrorOrIssue: problem
    });
  }, [activeTab, selectedSort, selectedSearch, currentStep, timeline, array, searchValue]);

  // Dynamic free-space finder: places log panel in bottom-right corner away from the central array bars
  const getFreeLogPosition = () => {
    if (typeof window === 'undefined') return { x: 500, y: 350 };
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const panelW = 520;
    const panelH = 280;
    return {
      x: Math.max(30, winW - panelW - 40),
      y: Math.max(80, winH - panelH - 100)
    };
  };

  // Draggable execution log states
  const [showLogPanel, setShowLogPanel] = useState(true);
  const [logPosition, setLogPosition] = useState(() => getFreeLogPosition());
  const hasUserMovedLog = useRef(false);
  const [logSize, setLogSize] = useState({ width: 520, height: 280 });
  const [isDraggingLog, setIsDraggingLog] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelStart = useRef({ x: 0, y: 0 });
  const [activeStateWidth, setActiveStateWidth] = useState(240);
  const [codeWidth, setCodeWidth] = useState(360);

  const logContainerRef = useRef(null);

  // Draggable tree visualizer states
  const [showTreePanel, setShowTreePanel] = useState(false);
  const [treePanelPosition, setTreePanelPosition] = useState({ x: 620, y: 120 });
  const [isDraggingTreePanel, setIsDraggingTreePanel] = useState(false);
  const [treePanelSize, setTreePanelSize] = useState({ width: 550, height: 380 });

  const treePanelDragStart = useRef({ x: 0, y: 0 });
  const treePanelStart = useRef({ x: 0, y: 0 });

  const handleTreePanelMouseDown = (e) => {
    const handle = e.target.closest('.tree-panel-drag-handle');
    if (handle) {
      setIsDraggingTreePanel(true);
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      treePanelDragStart.current = { x: clientX, y: clientY };
      treePanelStart.current = { x: treePanelPosition.x, y: treePanelPosition.y };
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTreePanelResizeMouseDown = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const startWidth = treePanelSize.width;
    const startHeight = treePanelSize.height;

    const handleMouseMove = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newWidth = Math.max(340, startWidth + (currentX - startX));
      const newHeight = Math.max(240, startHeight + (currentY - startY));
      setTreePanelSize({ width: newWidth, height: newHeight });
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

  const handleLogHeaderMouseDown = (e) => {
    if (e.button !== 0 && e.type !== 'touchstart') return;
    setIsDraggingLog(true);
    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    panelStart.current = { x: logPosition.x, y: logPosition.y };
    if (e.cancelable) e.preventDefault();
  };

  useEffect(() => {
    if (!isDraggingLog) return;
    const handleMouseMove = (e) => {
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;

      hasUserMovedLog.current = true;
      setLogPosition({
        x: Math.max(-logSize.width + 40, Math.min(window.innerWidth - 40, panelStart.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 40, panelStart.current.y + dy))
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

  const handleLogResizeMouseDown = (e) => {
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
      const newWidth = Math.max(300, Math.min(800, startWidth + (currentX - startX)));
      const newHeight = Math.max(150, Math.min(600, startHeight + (currentY - startY)));
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



  useEffect(() => {
    if (!isDraggingTreePanel) return;
    const handleMouseMove = (e) => {
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      const dx = clientX - treePanelDragStart.current.x;
      const dy = clientY - treePanelDragStart.current.y;
      const maxX = Math.max(0, window.innerWidth - treePanelSize.width);
      const maxY = Math.max(0, window.innerHeight - treePanelSize.height);
      setTreePanelPosition({
        x: Math.max(0, Math.min(maxX, treePanelStart.current.x + dx)),
        y: Math.max(0, Math.min(maxY, treePanelStart.current.y + dy))
      });
    };
    const handleMouseUp = () => {
      setIsDraggingTreePanel(false);
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
  }, [isDraggingTreePanel, treePanelSize]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStep, showLogPanel, timeline]);

  useEffect(() => {
    if (currentDisplayedAlgo === 'Heap Sort' || currentDisplayedAlgo === 'Binary Search') {
      setShowTreePanel(true);
    } else {
      setShowTreePanel(false);
    }
  }, [currentDisplayedAlgo]);



  const barRefs = useRef([]);

  const generateArray = () => {
    const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(arr);
    setInitialArray(arr);
    setTimeline([{ arr: [...arr], i: -1, j: -1, k: -1, msg: 'Generated new random array' }]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const resetArray = () => {
    if (initialArray.length > 0) {
      setArray(initialArray);
      setTimeline([{ arr: [...initialArray], i: -1, j: -1, k: -1, msg: 'Array reset to original state' }]);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const handleCustomArray = () => {
    if (!customArrayStr.trim()) return;
    const parsed = customArrayStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 0 && n <= 100);
    const arr = parsed.slice(0, 30);
    if (arr.length > 0) {
      setArray(arr);
      setInitialArray(arr);
      setTimeline([{ arr: [...arr], i: -1, j: -1, k: -1, msg: `Loaded custom array (${arr.length} elements${parsed.length > 30 ? ' - max 30' : ''})` }]);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopyCode = () => {
    const rawCode = getSortSearchCode(currentDisplayedAlgo, codeLang, array, searchValue ? parseInt(searchValue) : undefined);
    copyToClipboard(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(rawCode, codeLang);
    }).catch(err => console.error("Clipboard copy failed:", err));
  };

  useEffect(() => {
    const rawCode = getSortSearchCode(currentDisplayedAlgo, codeLang, array, searchValue ? parseInt(searchValue) : undefined);
    if (onCodeChange) onCodeChange(rawCode, codeLang);
  }, [currentDisplayedAlgo, codeLang, array, searchValue, onCodeChange]);

  useEffect(() => { generateArray(); }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < timeline.length - 1) {
      timer = setTimeout(() => setCurrentStep(p => p + 1), speed);
    } else if (currentStep >= timeline.length - 1) {
      setTimeout(() => setIsPlaying(false), 0);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, timeline.length, speed]);

  // GSAP Animations
  useEffect(() => {
    const frame = timeline[currentStep];
    if (!frame) return;

    if (frame.i !== -1 && barRefs.current[frame.i]) {
      gsap.fromTo(barRefs.current[frame.i],
        { filter: 'brightness(2)', scaleY: 1.1 },
        { filter: 'brightness(1)', scaleY: 1, duration: 0.3, ease: "back.out(1.5)" }
      );
    }
    if (frame.j !== -1 && barRefs.current[frame.j]) {
      gsap.fromTo(barRefs.current[frame.j],
        { filter: 'brightness(2)', scaleY: 1.1 },
        { filter: 'brightness(1)', scaleY: 1, duration: 0.3, ease: "back.out(1.5)" }
      );
    }
    if (frame.k !== -1 && barRefs.current[frame.k]) {
      gsap.fromTo(barRefs.current[frame.k],
        { filter: 'hue-rotate(90deg) brightness(1.5)', scaleY: 1.15 },
        { filter: 'hue-rotate(0deg) brightness(1)', scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" }
      );
    }
  }, [currentStep, timeline]);

  const record = (arr, i, j, k, msg, frames, extra = {}) => {
    frames.push({ arr: [...arr], i, j, k, msg, ...extra });
  };

  const bubbleSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Bubble Sort', frames);
    for (let i = 0; i < arr.length; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        record(arr, j, j + 1, -1, `Comparing ${arr[j]} and ${arr[j + 1]}`, frames);
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;
          record(arr, j, j + 1, -1, `Swapped!`, frames);
        }
      }
      record(arr, -1, -1, arr.length - 1 - i, `${arr[arr.length - 1 - i]} is placed in its correct sorted position`, frames);
      if (!swapped) break;
    }
    record(arr, -1, -1, -1, 'Bubble Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const quickSort = () => {
    let arr = [...array];
    let frames = [];

    const partition = (low, high) => {
      let pivot = arr[high];
      record(arr, high, -1, -1, `Pivot selected: ${pivot}`, frames);
      let i = low - 1;
      for (let j = low; j < high; j++) {
        record(arr, j, high, i, `Comparing ${arr[j]} with pivot ${pivot}`, frames);
        if (arr[j] < pivot) {
          i++;
          let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
          record(arr, i, j, high, `Swapped ${arr[i]} and ${arr[j]}`, frames);
        }
      }
      let temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
      record(arr, i + 1, high, i + 1, `Placed pivot ${pivot} in its correct position`, frames);
      return i + 1;
    };

    const qs = (low, high) => {
      if (low < high) {
        let pi = partition(low, high);
        qs(low, pi - 1);
        qs(pi + 1, high);
      } else if (low === high) {
        record(arr, -1, -1, low, `Element ${arr[low]} is in correct position`, frames);
      }
    };

    record(arr, -1, -1, -1, 'Starting Quick Sort', frames);
    qs(0, arr.length - 1);
    record(arr, -1, -1, -1, 'Quick Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const selectionSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Selection Sort', frames);
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        record(arr, j, minIdx, i, `Comparing ${arr[j]} and current min ${arr[minIdx]}`, frames);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          record(arr, j, minIdx, i, `New minimum found: ${arr[minIdx]}`, frames);
        }
      }
      if (minIdx !== i) {
        let temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;
        record(arr, i, minIdx, i, `Swapped ${arr[i]} and ${arr[minIdx]}`, frames);
      }
      record(arr, -1, -1, i, `${arr[i]} is placed in its correct sorted position`, frames);
    }
    record(arr, -1, -1, arr.length - 1, 'Selection Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const insertionSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Insertion Sort', frames);
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      record(arr, i, -1, -1, `Selected key: ${key}`, frames);
      while (j >= 0 && arr[j] > key) {
        record(arr, j, j + 1, -1, `Moving ${arr[j]} to the right`, frames);
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
      record(arr, j + 1, -1, -1, `Placed key ${key} at position ${j + 1}`, frames);
    }
    record(arr, -1, -1, -1, 'Insertion Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const mergeSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Merge Sort', frames);

    const merge = (l, m, r) => {
      let n1 = m - l + 1;
      let n2 = r - m;
      let L = new Array(n1);
      let R = new Array(n2);

      for (let i = 0; i < n1; i++) L[i] = arr[l + i];
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

      let i = 0, j = 0, k = l;
      while (i < n1 && j < n2) {
        record(arr, l + i, m + 1 + j, k, `Comparing left and right sub-arrays`, frames);
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          record(arr, -1, -1, k, `Writing ${L[i]} to position ${k}`, frames);
          i++;
        } else {
          arr[k] = R[j];
          record(arr, -1, -1, k, `Writing ${R[j]} to position ${k}`, frames);
          j++;
        }
        k++;
      }
      while (i < n1) {
        arr[k] = L[i];
        record(arr, -1, -1, k, `Copying remaining ${L[i]} from left`, frames);
        i++; k++;
      }
      while (j < n2) {
        arr[k] = R[j];
        record(arr, -1, -1, k, `Copying remaining ${R[j]} from right`, frames);
        j++; k++;
      }
      record(arr, l, r, -1, `Merged range [${l}, ${r}]`, frames);
    };

    const sort = (l, r) => {
      if (l >= r) return;
      let m = Math.floor((l + r) / 2);
      sort(l, m);
      sort(m + 1, r);
      merge(l, m, r);
    };

    sort(0, arr.length - 1);
    record(arr, -1, -1, -1, 'Merge Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const heapSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Heap Sort', frames, { heapSize: arr.length });

    const heapify = (n, i) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      if (l < n) {
        record(arr, largest, l, -1, `Comparing left child ${arr[l]} with parent ${arr[largest]}`, frames, { heapSize: n });
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < n) {
        record(arr, largest, r, -1, `Comparing right child ${arr[r]} with parent ${arr[largest]}`, frames, { heapSize: n });
        if (arr[r] > arr[largest]) largest = r;
      }

      if (largest !== i) {
        let oldParent = arr[i];
        let oldChild = arr[largest];
        let temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        record(arr, i, largest, -1, `Swapped parent ${oldParent} and child ${oldChild}`, frames, { heapSize: n });
        heapify(n, largest);
      }
    };

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(arr.length, i);
    }
    record(arr, -1, -1, -1, 'Max Heap Built', frames, { heapSize: arr.length });

    for (let i = arr.length - 1; i > 0; i--) {
      let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
      record(arr, 0, i, i, `Moved max element ${arr[i]} to end of heap`, frames, { heapSize: i });
      heapify(i, 0);
    }

    record(arr, -1, -1, -1, 'Heap Sort Complete!', frames, { heapSize: 0 });
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const shellSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Shell Sort', frames);

    let n = arr.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      record(arr, -1, -1, -1, `Current Gap: ${gap}`, frames);
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j;
        record(arr, i, -1, -1, `Selected key: ${temp}`, frames);
        for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
          record(arr, j, j - gap, -1, `Moving ${arr[j - gap]} to the right by gap ${gap}`, frames);
          arr[j] = arr[j - gap];
        }
        arr[j] = temp;
        record(arr, j, -1, -1, `Placed key ${temp} at position ${j}`, frames);
      }
    }
    record(arr, -1, -1, -1, 'Shell Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const cocktailSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Cocktail Shaker Sort', frames);

    let swapped = true;
    let start = 0;
    let end = arr.length - 1;

    while (swapped) {
      swapped = false;
      for (let i = start; i < end; ++i) {
        record(arr, i, i + 1, -1, `Comparing ${arr[i]} and ${arr[i + 1]}`, frames);
        if (arr[i] > arr[i + 1]) {
          let temp = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = temp;
          swapped = true;
          record(arr, i, i + 1, -1, `Swapped!`, frames);
        }
      }
      if (!swapped) break;
      swapped = false;
      record(arr, -1, -1, end, `${arr[end]} is placed in its correct sorted position`, frames);
      end--;

      for (let i = end - 1; i >= start; --i) {
        record(arr, i, i + 1, -1, `Comparing ${arr[i]} and ${arr[i + 1]}`, frames);
        if (arr[i] > arr[i + 1]) {
          let temp = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = temp;
          swapped = true;
          record(arr, i, i + 1, -1, `Swapped!`, frames);
        }
      }
      record(arr, -1, -1, start, `${arr[start]} is placed in its correct sorted position`, frames);
      start++;
    }

    record(arr, -1, -1, -1, 'Cocktail Shaker Sort Complete!', frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const linearSearch = () => {
    let val = parseInt(searchValue);
    if (isNaN(val)) return;
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, `Starting Linear Search for ${val}`, frames);
    let found = false;
    for (let i = 0; i < arr.length; i++) {
      record(arr, i, -1, -1, `Checking if ${arr[i]} equals ${val}`, frames);
      if (arr[i] === val) {
        record(arr, i, -1, i, `Found ${val} at index ${i}!`, frames);
        found = true;
        break;
      }
    }
    if (!found) record(arr, -1, -1, -1, `${val} not found in array.`, frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const binarySearch = () => {
    let val = parseInt(searchValue);
    if (isNaN(val)) return;

    let arr = [...array];
    let isSorted = true;
    for (let i = 0; i < arr.length - 1; i++) if (arr[i] > arr[i + 1]) isSorted = false;

    let frames = [];
    if (!isSorted) {
      arr.sort((a, b) => a - b);
      setArray(arr);
      frames.push({ arr: [...arr], i: -1, j: -1, k: -1, msg: 'Array sorted for Binary Search' });
    }

    record(arr, -1, -1, -1, `Starting Binary Search for ${val}`, frames);
    let l = 0, r = arr.length - 1;
    let found = false;
    while (l <= r) {
      let m = Math.floor((l + r) / 2);
      record(arr, m, l, r, `Checking middle element ${arr[m]} in range [${l}, ${r}]`, frames);
      if (arr[m] === val) {
        record(arr, m, -1, m, `Found ${val} at index ${m}!`, frames);
        found = true;
        break;
      }
      if (arr[m] < val) {
        record(arr, m, l, r, `${arr[m]} < ${val}, so search right half`, frames);
        l = m + 1;
      } else {
        record(arr, m, l, r, `${arr[m]} > ${val}, so search left half`, frames);
        r = m - 1;
      }
    }
    if (!found) record(arr, -1, -1, -1, `${val} not found in array.`, frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const radixSort = () => {
    let arr = [...array];
    let frames = [];

    let maxVal = Math.max(...arr, 0);
    const getDigit = (num, place) => {
      return Math.floor(Math.abs(num) / place) % 10;
    };

    frames.push({
      arr: [...arr],
      i: -1,
      j: -1,
      k: 1,
      msg: 'Starting Radix Sort: LSD passes',
      buckets: Array.from({ length: 10 }, () => [])
    });

    let maxPass = maxVal > 0 ? maxVal : 1;
    for (let place = 1; Math.floor(maxPass / place) > 0; place *= 10) {
      let buckets = Array.from({ length: 10 }, () => []);

      // Step 1: Distribute elements into buckets
      for (let i = 0; i < arr.length; i++) {
        let val = arr[i];
        let digit = getDigit(val, place);

        frames.push({
          arr: [...arr],
          i: i,
          j: -1,
          k: place,
          msg: `Digit place ${place}s: Checking element ${val}, digit is ${digit}. Move to bucket ${digit}`,
          buckets: buckets.map((b, idx) => idx === digit ? [...b, val] : [...b])
        });

        buckets[digit].push(val);
      }

      // Step 2: Reassemble elements back from buckets to array
      let idx = 0;
      let newArr = [...arr];
      for (let d = 0; d < 10; d++) {
        while (buckets[d].length > 0) {
          let val = buckets[d].shift();
          newArr[idx] = val;

          frames.push({
            arr: [...newArr],
            i: -1,
            j: idx,
            k: place,
            msg: `Digit place ${place}s: Pulling ${val} from bucket ${d} back to index ${idx}`,
            buckets: buckets.map(b => [...b])
          });

          idx++;
        }
      }

      arr = [...newArr];
      frames.push({
        arr: [...arr],
        i: -1,
        j: -1,
        k: place,
        msg: `Completed pass for ${place}s place: Array is temporarily sorted by this digit`,
        buckets: Array.from({ length: 10 }, () => [])
      });
    }

    frames.push({
      arr: [...arr],
      i: -1,
      j: -1,
      k: -1,
      msg: 'Radix Sort Complete!',
      buckets: Array.from({ length: 10 }, () => [])
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const countingSort = () => {
    let arr = [...array];
    let frames = [];
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    let range = maxVal - minVal + 1;
    let counts = new Array(range).fill(0);

    frames.push({
      arr: [...arr],
      i: -1,
      j: -1,
      k: -1,
      msg: `Starting Counting Sort: Range [${minVal}, ${maxVal}]`,
      counts: [...counts],
      minVal
    });

    // Step 1: Count occurrences
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i];
      counts[val - minVal]++;
      frames.push({
        arr: [...arr],
        i: i,
        j: -1,
        k: -1,
        msg: `Count phase: Element ${val} found, incrementing count at index ${val} to ${counts[val - minVal]}`,
        counts: [...counts],
        minVal
      });
    }

    // Step 2: Accumulate counts (prefix sums)
    let cumCounts = [...counts];
    for (let i = 1; i < cumCounts.length; i++) {
      cumCounts[i] += cumCounts[i - 1];
    }
    frames.push({
      arr: [...arr],
      i: -1,
      j: -1,
      k: -1,
      msg: `Calculate cumulative counts (prefix sums) for stable sorting`,
      counts: [...cumCounts],
      minVal
    });

    // Step 3: Reconstruct sorted array
    let output = new Array(arr.length).fill(0);
    let tempCounts = [...cumCounts];
    for (let i = arr.length - 1; i >= 0; i--) {
      let val = arr[i];
      let pos = tempCounts[val - minVal] - 1;
      output[pos] = val;
      tempCounts[val - minVal]--;

      frames.push({
        arr: [...output],
        i: i,
        j: pos,
        k: -1,
        msg: `Reconstruction: Placing ${val} from index ${i} to sorted index ${pos} (Count was ${tempCounts[val - minVal] + 1})`,
        counts: [...tempCounts],
        minVal
      });
    }

    arr = [...output];
    frames.push({
      arr: [...arr],
      i: -1,
      j: -1,
      k: -1,
      msg: 'Counting Sort Complete!',
      counts: new Array(range).fill(0),
      minVal
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const executeSort = () => {
    if (selectedSort === 'Bubble Sort') bubbleSort();
    else if (selectedSort === 'Selection Sort') selectionSort();
    else if (selectedSort === 'Insertion Sort') insertionSort();
    else if (selectedSort === 'Merge Sort') mergeSort();
    else if (selectedSort === 'Heap Sort') heapSort();
    else if (selectedSort === 'Shell Sort') shellSort();
    else if (selectedSort === 'Cocktail Shaker Sort') cocktailSort();
    else if (selectedSort === 'Quick Sort') quickSort();
    else if (selectedSort === 'Radix Sort') radixSort();
    else if (selectedSort === 'Counting Sort') countingSort();
  };

  const executeSearch = () => {
    if (selectedSearch === 'Linear Search') linearSearch();
    else if (selectedSearch === 'Binary Search') binarySearch();
  };

  const renderTreeSVG = (width = 600, height = 400) => {
    const frame = timeline[currentStep] || { arr: array, i: -1, j: -1, k: -1, msg: '' };
    const arr = frame.arr || array;
    if (arr.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          No elements to display
        </div>
      );
    }

    if (currentDisplayedAlgo === 'Heap Sort') {
      const positions = getHeapTreePositions(arr.length, width, height);
      const heapSize = frame.heapSize !== undefined ? frame.heapSize : arr.length;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="heap-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="heap-highlight-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="heap-boundary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="heap-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" floodColor="#000" />
            </filter>
          </defs>

          {/* Render Connections */}
          {positions.map((node, idx) => {
            if (idx === 0) return null;
            const parentIdx = Math.floor((idx - 1) / 2);
            const parent = positions[parentIdx];
            if (!parent) return null;

            const isSorted = idx >= heapSize || parentIdx >= heapSize;
            const isActiveComparison = (idx === frame.i && parentIdx === frame.j) || (idx === frame.j && parentIdx === frame.i);

            let stroke = 'rgba(99, 102, 241, 0.35)';
            let strokeWidth = 2;
            let dash = undefined;

            if (isActiveComparison) {
              stroke = '#fbbf24';
              strokeWidth = 3;
            } else if (isSorted) {
              stroke = 'rgba(255, 255, 255, 0.12)';
              dash = '4,4';
            }

            return (
              <line
                key={`line-${idx}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          })}

          {/* Render Nodes */}
          {positions.map((node, idx) => {
            const val = arr[idx];
            const isSorted = idx >= heapSize;
            const isHighlight = idx === frame.i || idx === frame.j;
            const isBoundary = idx === frame.k;

            let fill = 'url(#heap-node-grad)';
            let stroke = 'rgba(99, 102, 241, 0.8)';
            let strokeWidth = 2;
            let opacity = 1;
            let textColor = '#ffffff';

            if (isHighlight) {
              fill = 'url(#heap-highlight-grad)';
              stroke = '#f59e0b';
              strokeWidth = 3;
            } else if (isBoundary) {
              fill = 'url(#heap-boundary-grad)';
              stroke = '#059669';
              strokeWidth = 3;
            } else if (isSorted) {
              fill = 'rgba(30, 41, 59, 0.45)';
              stroke = 'rgba(255, 255, 255, 0.15)';
              opacity = 0.55;
              textColor = 'rgba(255, 255, 255, 0.35)';
            }

            return (
              <g key={`node-${idx}`} transform={`translate(${node.x}, ${node.y})`} style={{ transition: 'all 0.3s ease', opacity }}>
                <circle
                  r={16}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  filter="url(#heap-shadow)"
                />
                <text
                  fill={textColor}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dy=".3em"
                  style={{ userSelect: 'none' }}
                >
                  {val}
                </text>
                <text
                  fill="rgba(255, 255, 255, 0.35)"
                  fontSize="8"
                  textAnchor="middle"
                  y={24}
                  style={{ userSelect: 'none', fontFamily: 'monospace' }}
                >
                  [{idx}]
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    if (currentDisplayedAlgo === 'Binary Search') {
      const positions = getBSTPositions(arr, width, height);

      // Determine active search range
      let searchL = 0;
      let searchR = arr.length - 1;
      if (frame.msg && (frame.msg.includes('Found') || frame.msg.includes('complete'))) {
        if (frame.k !== -1) {
          searchL = frame.k;
          searchR = frame.k;
        } else {
          searchL = -1;
          searchR = -1;
        }
      } else if (frame.j !== -1 && frame.k !== -1) {
        searchL = frame.j;
        searchR = frame.k;
      } else if (frame.i === -1 && frame.j === -1 && frame.k === -1) {
        if (frame.msg && (frame.msg.includes('not found') || frame.msg.includes('Complete'))) {
          searchL = -1;
          searchR = -1;
        }
      }

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="bst-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="bst-highlight-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <filter id="bst-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" floodColor="#000" />
            </filter>
          </defs>

          {/* Render Connections */}
          {positions.map((node) => {
            if (node.parentIdx === -1) return null;
            const parent = positions[node.parentIdx];
            if (!parent) return null;

            const isNodeExcluded = node.idx < searchL || node.idx > searchR;
            const isParentExcluded = parent.idx < searchL || parent.idx > searchR;
            const isExcluded = isNodeExcluded || isParentExcluded;

            // Highlight path connection if parent is checked and this node is part of active path/comparison
            const isActivePath = (parent.idx === frame.i && (node.idx === frame.j || node.idx === frame.k || node.idx === frame.i)) ||
              (node.idx === frame.i && parent.idx !== -1);

            let stroke = 'rgba(16, 185, 129, 0.35)';
            let strokeWidth = 2;
            let dash = undefined;

            if (isActivePath && !isExcluded && frame.i !== -1) {
              stroke = '#fbbf24';
              strokeWidth = 3;
            } else if (isExcluded) {
              stroke = 'rgba(255, 255, 255, 0.12)';
              dash = '4,4';
            }

            return (
              <line
                key={`line-${node.idx}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dash}
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          })}

          {/* Render Nodes */}
          {positions.map((node) => {
            const val = node.val;
            const isExcluded = node.idx < searchL || node.idx > searchR;
            const isHighlight = node.idx === frame.i; // Current mid node
            const isBoundary = node.idx === frame.j || node.idx === frame.k;

            let fill = 'url(#bst-node-grad)';
            let stroke = 'rgba(16, 185, 129, 0.8)';
            let strokeWidth = 2;
            let opacity = 1;
            let textColor = '#ffffff';

            if (isHighlight) {
              fill = 'url(#bst-highlight-grad)';
              stroke = '#f59e0b';
              strokeWidth = 3;
            } else if (isBoundary && !isExcluded) {
              stroke = '#38bdf8'; // Sky blue border for L/R boundaries
              strokeWidth = 2.5;
            } else if (isExcluded) {
              fill = 'rgba(30, 41, 59, 0.45)';
              stroke = 'rgba(255, 255, 255, 0.15)';
              opacity = 0.55;
              textColor = 'rgba(255, 255, 255, 0.35)';
            }

            return (
              <g key={`node-${node.idx}`} transform={`translate(${node.x}, ${node.y})`} style={{ transition: 'all 0.3s ease', opacity }}>
                <circle
                  r={16}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  filter="url(#bst-shadow)"
                />
                <text
                  fill={textColor}
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dy=".3em"
                  style={{ userSelect: 'none' }}
                >
                  {val}
                </text>
                <text
                  fill="rgba(255, 255, 255, 0.35)"
                  fontSize="8"
                  textAnchor="middle"
                  y={24}
                  style={{ userSelect: 'none', fontFamily: 'monospace' }}
                >
                  [{node.idx}]
                </text>
              </g>
            );
          })}
        </svg>
      );
    }

    return null;
  };

  const frame = timeline[currentStep] || { arr: array, i: -1, j: -1, k: -1, msg: '' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary, #0f172a)' }}>
      <header className="header-glass" style={{ padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold', margin: 0 }}>Sort & Search Visualizer</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-clear" onClick={generateArray} disabled={isPlaying}>🔀 Random</button>
          <button className="btn btn-clear" onClick={resetArray} disabled={isPlaying}>🔄 Reset</button>

          <input type="text" className="styled-input" style={{ width: '130px', opacity: isPlaying ? 0.7 : 1 }} placeholder="e.g. 10,45,30" value={customArrayStr} onChange={e => setCustomArrayStr(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !isPlaying && customArrayStr) handleCustomArray(); }} disabled={isPlaying} />
          <button className="btn btn-clear" style={{ background: '#4f46e5', color: 'white', border: 'none', opacity: isPlaying || !customArrayStr ? 0.5 : 1 }} onClick={handleCustomArray} disabled={isPlaying || !customArrayStr}>Set Array</button>

          <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)', margin: '0 4px' }} />

          {/* Operation Type Toggle */}
          <select className="styled-select" style={{ fontWeight: 'bold' }} value={activeTab} onChange={e => setActiveTab(e.target.value)} disabled={isPlaying}>
            <option value="Sort">Sorting Algorithms</option>
            <option value="Search">Searching Algorithms</option>
          </select>

          {/* Visualizer Style Toggle */}
          <select className="styled-select" value={visualizerStyle} onChange={e => setVisualizerStyle(e.target.value)} disabled={isPlaying}>
            <option value="classic">📊 Classic 2D Bars</option>
            <option value="crane">🏗️ 3D Industrial Crane</option>
          </select>

          {activeTab === 'Sort' ? (
            <>
              <select className="styled-select" value={selectedSort} onChange={e => setSelectedSort(e.target.value)} disabled={isPlaying}>
                <option value="Bubble Sort">Bubble Sort</option>
                <option value="Selection Sort">Selection Sort</option>
                <option value="Insertion Sort">Insertion Sort</option>
                <option value="Merge Sort">Merge Sort</option>
                <option value="Heap Sort">Heap Sort</option>
                <option value="Shell Sort">Shell Sort</option>
                <option value="Cocktail Shaker Sort">Cocktail Sort</option>
                <option value="Quick Sort">Quick Sort</option>
                <option value="Radix Sort">Radix Sort</option>
                <option value="Counting Sort">Counting Sort</option>
              </select>
              <button className="btn btn-insert" onClick={executeSort} disabled={isPlaying}>▶ Run Sort</button>
            </>
          ) : (
            <>
              <select className="styled-select" value={selectedSearch} onChange={e => setSelectedSearch(e.target.value)} disabled={isPlaying}>
                <option value="Linear Search">Linear Search</option>
                <option value="Binary Search">Binary Search</option>
              </select>
              <input type="number" className="styled-input" style={{ width: '80px', opacity: isPlaying ? 0.7 : 1 }} placeholder="Target" value={searchValue} onChange={e => setSearchValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !isPlaying && searchValue) executeSearch(); }} disabled={isPlaying} />
              <button className="btn btn-insert" onClick={executeSearch} disabled={isPlaying || !searchValue}>🔍 Search</button>
            </>
          )}

          <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)', margin: '0 4px' }} />
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', fontSize: '0.82rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>View:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none' }}>
              <input type="checkbox" checked={showLogPanel} onChange={e => setShowLogPanel(e.target.checked)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
              <span>Log</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none' }}>
              <input type="checkbox" checked={showCode} onChange={e => setShowCode(e.target.checked)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
              <span>Code</span>
            </label>
            {(currentDisplayedAlgo === 'Heap Sort' || currentDisplayedAlgo === 'Binary Search') && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none' }}>
                <input type="checkbox" checked={showTreePanel} onChange={e => setShowTreePanel(e.target.checked)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                <span>Tree</span>
              </label>
            )}
          </div>
          <button className="btn btn-clear" style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }} onClick={() => setShowTopicInfo(true)} title="Learn about this algorithm">ℹ️ Info</button>
          {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙ Settings</button>}
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
        </div>
      </header>

      {isMobile && (
        <div className="mobile-tabs-container">
          <button className={`mobile-tab-btn ${mobileTab === 'vis' ? 'active' : ''}`} onClick={() => setMobileTab('vis')}>📊 Visualizer</button>
          {(currentDisplayedAlgo === 'Heap Sort' || currentDisplayedAlgo === 'Binary Search') && (
            <button className={`mobile-tab-btn ${mobileTab === 'tree' ? 'active' : ''}`} onClick={() => { setMobileTab('tree'); setShowTreePanel(true); }}>🌳 Tree</button>
          )}
          <button className={`mobile-tab-btn ${mobileTab === 'code' ? 'active' : ''}`} onClick={() => { setMobileTab('code'); setShowCode(true); }}>💻 Code</button>
          <button className={`mobile-tab-btn ${mobileTab === 'log' ? 'active' : ''}`} onClick={() => { setMobileTab('log'); setShowLogPanel(true); }}>📋 Logs</button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '0.35rem' : '1.5rem', gap: isMobile ? '0.5rem' : '1.5rem', overflow: 'hidden' }}>

        {/* Left Column: Visualizer */}
        <div style={{ display: (isMobile && mobileTab !== 'vis') ? 'none' : 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {(() => {
            const isCompleted = timeline.length > 0 && currentStep === timeline.length - 1 && (frame.msg?.includes('Complete') || frame.msg?.includes('Found') || frame.msg?.includes('not found'));
            const complexity = ALGO_COMPLEXITIES[currentDisplayedAlgo] || ALGO_COMPLEXITIES['Bubble Sort'];
            const nVal = frame.arr ? frame.arr.length : array.length;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.2rem', gap: '8px', flexShrink: 0 }}>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{
                    fontSize: isMobile ? '1.02rem' : '1.35rem',
                    color: isCompleted ? '#34d399' : 'var(--text-primary)',
                    fontWeight: 'bold',
                    background: isCompleted ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255,255,255,0.05)',
                    padding: '6px 20px',
                    borderRadius: '20px',
                    border: isCompleted ? '1.5px solid rgba(52, 211, 153, 0.45)' : '1px solid var(--glass-border)',
                    boxShadow: isCompleted ? '0 0 20px rgba(52, 211, 153, 0.25)' : '0 4px 15px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}>
                    {frame.msg || 'Select a sort or search algorithm'}
                  </span>
                </div>
              </div>
            );
          })()}

          {visualizerStyle === 'crane' ? (() => {
            const totalItems = Math.max(1, frame.arr?.length || 1);
            const isSearch = activeTab === 'Search';

            // Active indices tracking
            const craneAIdx = frame.i !== -1 ? frame.i : (frame.j !== -1 ? frame.j : 0);
            const craneBActive = !isSearch && frame.j !== -1 && frame.j !== frame.i;
            const craneBIdx = craneBActive ? frame.j : null;

            // Mathematical exact centers aligned with column slots
            const craneALeft = `calc(${(craneAIdx + 0.5) * (100 / totalItems)}% - 22px)`;
            const craneBLeft = craneBActive ? `calc(${(craneBIdx + 0.5) * (100 / totalItems)}% - 22px)` : null;

            // Search range bounds for Binary Search
            const searchLow = isSearch ? (frame.j !== -1 ? frame.j : 0) : 0;
            const searchHigh = isSearch ? (frame.k !== -1 ? frame.k : totalItems - 1) : totalItems - 1;

            return (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'flex-end', 
                background: 'radial-gradient(ellipse at 50% 100%, rgba(30, 41, 59, 0.7), rgba(10, 15, 30, 0.95))', 
                borderRadius: '16px', 
                border: '1.5px solid rgba(56, 189, 248, 0.2)', 
                padding: isMobile ? '12px 8px 16px 8px' : '16px 20px 24px 20px', 
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)'
              }}>
                {/* Industrial HUD Telemetry Status Bar */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 14px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  zIndex: 20,
                  fontSize: isMobile ? '10.5px' : '12px',
                  backdropFilter: 'blur(8px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>🏗️</span>
                    <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>
                      3D Industrial Gantry Crane System
                    </span>
                    <span style={{
                      background: '#0284c7',
                      color: '#fff',
                      fontSize: '9.5px',
                      fontWeight: 'bold',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      ALIGNED 1:1
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'monospace' }}>
                    <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
                      Crane A ({isSearch ? 'Target' : 'PTR i'}): [{craneAIdx}] = {frame.arr[craneAIdx] !== undefined ? frame.arr[craneAIdx] : '-'}
                    </span>
                    {craneBActive && (
                      <span style={{ color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', display: 'inline-block' }} />
                        Crane B (PTR j): [{craneBIdx}] = {frame.arr[craneBIdx]}
                      </span>
                    )}
                    {isSearch && selectedSearch === 'Binary Search' && (
                      <span style={{ color: '#10b981' }}>
                        Window: [{searchLow} ➔ {searchHigh}]
                      </span>
                    )}
                  </div>
                </div>

                {/* Centered Industrial Assembly (Tracks + 3D Blocks share EXACT container) */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: `${Math.min(totalItems * 80, 1100)}px`,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  margin: '0 auto',
                  paddingTop: isMobile ? '65px' : '85px'
                }}>
                  {/* Overhead Heavy Gantry Truss */}
                  <div style={{
                    position: 'absolute',
                    top: isMobile ? '8px' : '14px',
                    left: 0,
                    right: 0,
                    height: '18px',
                    background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                    border: '1.5px solid #475569',
                    borderRadius: '6px',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                    zIndex: 10
                  }}>
                    {/* Caution Stripes on Top of Girder */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 8px, #0f172a 8px, #0f172a 16px)',
                      borderRadius: '4px 4px 0 0'
                    }} />

                    {/* Support Girders at extremes */}
                    <div style={{ position: 'absolute', left: '-8px', top: '-4px', bottom: '-10px', width: '12px', background: '#475569', borderRadius: '3px', border: '1px solid #64748b' }} />
                    <div style={{ position: 'absolute', right: '-8px', top: '-4px', bottom: '-10px', width: '12px', background: '#475569', borderRadius: '3px', border: '1px solid #64748b' }} />

                    {/* Crane A Trolley (Amber / Gold) */}
                    <div style={{
                      position: 'absolute',
                      left: craneALeft,
                      top: '-8px',
                      width: '44px',
                      height: '24px',
                      background: 'linear-gradient(135deg, #78350f, #d97706)',
                      border: '2px solid #fbbf24',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: '0 6px 14px rgba(251, 191, 36, 0.4)',
                      zIndex: 13
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>
                        {isSearch ? 'SCAN' : 'CR-A'}
                      </span>
                      {/* Heavy Steel Wheel Accents */}
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a', border: '1px solid #fbbf24', position: 'absolute', left: '3px', top: '12px' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a', border: '1px solid #fbbf24', position: 'absolute', right: '3px', top: '12px' }} />
                    </div>

                    {/* Crane A Cable, Gripper Claw & Laser Beam */}
                    <div style={{
                      position: 'absolute',
                      left: craneALeft,
                      top: '16px',
                      width: '44px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      zIndex: 12,
                      pointerEvents: 'none'
                    }}>
                      {/* Pulley Cable */}
                      <div style={{
                        width: '2.5px',
                        height: (frame.i !== -1 || frame.j !== -1) ? '32px' : '14px',
                        background: 'linear-gradient(to bottom, #cbd5e1, #94a3b8)',
                        transition: 'height 0.25s ease'
                      }} />

                      {/* Claw Head */}
                      <div style={{
                        width: '24px',
                        height: '11px',
                        background: '#fbbf24',
                        borderRadius: '3px 3px 0 0',
                        border: '1.5px solid #b45309',
                        position: 'relative'
                      }}>
                        {/* Left claw finger */}
                        <div style={{
                          position: 'absolute',
                          left: '-3px',
                          bottom: '-10px',
                          width: '5px',
                          height: '13px',
                          borderLeft: '2.5px solid #fbbf24',
                          borderBottom: '2.5px solid #fbbf24',
                          borderRadius: '0 0 0 3px',
                          transform: (frame.i !== -1 || frame.j !== -1) ? 'rotate(-10deg)' : 'rotate(-25deg)',
                          transformOrigin: 'top right',
                          transition: 'transform 0.2s'
                        }} />
                        {/* Right claw finger */}
                        <div style={{
                          position: 'absolute',
                          right: '-3px',
                          bottom: '-10px',
                          width: '5px',
                          height: '13px',
                          borderRight: '2.5px solid #fbbf24',
                          borderBottom: '2.5px solid #fbbf24',
                          borderRadius: '0 0 3px 0',
                          transform: (frame.i !== -1 || frame.j !== -1) ? 'rotate(10deg)' : 'rotate(25deg)',
                          transformOrigin: 'top left',
                          transition: 'transform 0.2s'
                        }} />
                      </div>

                      {/* Targeted Value Payload Box */}
                      <div style={{
                        marginTop: '6px',
                        padding: '2px 8px',
                        background: 'linear-gradient(135deg, #d97706, #fbbf24)',
                        border: '1.5px solid #fff',
                        borderRadius: '6px',
                        color: '#000',
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.5)'
                      }}>
                        {isSearch ? (searchValue || '?') : (frame.arr[craneAIdx] !== undefined ? frame.arr[craneAIdx] : '-')}
                      </div>

                      {/* Vertical Laser Targeting Beam extending down to block */}
                      <div style={{
                        width: '2px',
                        height: '140px',
                        background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0.1) 100%)',
                        boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)'
                      }} />
                    </div>

                    {/* Crane B Trolley (Cyan / Emerald - Dual Crane for j) */}
                    {craneBActive && (
                      <>
                        <div style={{
                          position: 'absolute',
                          left: craneBLeft,
                          top: '-8px',
                          width: '44px',
                          height: '24px',
                          background: 'linear-gradient(135deg, #0369a1, #0284c7)',
                          border: '2px solid #00e5ff',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                          boxShadow: '0 6px 14px rgba(0, 229, 255, 0.4)',
                          zIndex: 14
                        }}>
                          <span style={{ fontSize: '9px', fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>
                            CR-B
                          </span>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a', border: '1px solid #00e5ff', position: 'absolute', left: '3px', top: '12px' }} />
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a', border: '1px solid #00e5ff', position: 'absolute', right: '3px', top: '12px' }} />
                        </div>

                        {/* Crane B Cable, Claw & Cyan Laser */}
                        <div style={{
                          position: 'absolute',
                          left: craneBLeft,
                          top: '16px',
                          width: '44px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
                          zIndex: 13,
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            width: '2.5px',
                            height: '32px',
                            background: 'linear-gradient(to bottom, #cbd5e1, #94a3b8)',
                            transition: 'height 0.25s ease'
                          }} />
                          <div style={{
                            width: '24px',
                            height: '11px',
                            background: '#00e5ff',
                            borderRadius: '3px 3px 0 0',
                            border: '1.5px solid #0284c7',
                            position: 'relative'
                          }}>
                            <div style={{
                              position: 'absolute',
                              left: '-3px',
                              bottom: '-10px',
                              width: '5px',
                              height: '13px',
                              borderLeft: '2.5px solid #00e5ff',
                              borderBottom: '2.5px solid #00e5ff',
                              borderRadius: '0 0 0 3px',
                              transform: 'rotate(-10deg)',
                              transformOrigin: 'top right'
                            }} />
                            <div style={{
                              position: 'absolute',
                              right: '-3px',
                              bottom: '-10px',
                              width: '5px',
                              height: '13px',
                              borderRight: '2.5px solid #00e5ff',
                              borderBottom: '2.5px solid #00e5ff',
                              borderRadius: '0 0 3px 0',
                              transform: 'rotate(10deg)',
                              transformOrigin: 'top left'
                            }} />
                          </div>
                          <div style={{
                            marginTop: '6px',
                            padding: '2px 8px',
                            background: 'linear-gradient(135deg, #0284c7, #00e5ff)',
                            border: '1.5px solid #fff',
                            borderRadius: '6px',
                            color: '#000',
                            fontWeight: '900',
                            fontSize: '0.8rem',
                            boxShadow: '0 4px 12px rgba(0, 229, 255, 0.5)'
                          }}>
                            {frame.arr[craneBIdx]}
                          </div>
                          <div style={{
                            width: '2px',
                            height: '140px',
                            background: 'linear-gradient(180deg, rgba(0, 229, 255, 0.8) 0%, rgba(0, 229, 255, 0.1) 100%)',
                            boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)'
                          }} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* 3D BLOCKS GRID CONTAINER (Exact 1:1 Match with Gantry Overhead Rail) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${totalItems}, minmax(0, 1fr))`,
                    width: '100%',
                    height: '100%',
                    alignItems: 'flex-end',
                    gap: isMobile ? '3px' : '6px',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    {frame.arr.map((val, idx) => {
                      let colorType = 'primary'; // 'primary', 'active', 'inactive', 'highlight_a', 'highlight_b'

                      if (isSearch) {
                        const low = frame.j !== -1 ? frame.j : 0;
                        const high = frame.k !== -1 ? frame.k : totalItems - 1;
                        const mid = frame.i;

                        if (idx >= low && idx <= high) {
                          if (idx === mid) {
                            colorType = 'highlight_a'; // Laser focused midpoint
                          } else {
                            colorType = 'active'; // Inside active search window
                          }
                        } else {
                          colorType = 'inactive'; // Excluded region
                        }
                      } else {
                        // Sort colors
                        if (idx === frame.i) {
                          colorType = 'highlight_a';
                        } else if (idx === frame.j) {
                          colorType = 'highlight_b';
                        } else if (idx === frame.k) {
                          colorType = 'active';
                        } else {
                          colorType = 'primary';
                        }
                      }

                      const maxVal = Math.max(...frame.arr, 1);
                      const heightPercent = Math.max((val / maxVal) * 72, 12);

                      let frontBg, topBg, rightBg, borderStyle, glowEffect;
                      if (colorType === 'highlight_a') {
                        frontBg = 'linear-gradient(to top, #b45309, #f59e0b)';
                        topBg = '#fbbf24';
                        rightBg = '#78350f';
                        borderStyle = '1.5px solid #fbbf24';
                        glowEffect = '0 0 16px rgba(251, 191, 36, 0.6)';
                      } else if (colorType === 'highlight_b') {
                        frontBg = 'linear-gradient(to top, #0369a1, #00e5ff)';
                        topBg = '#38bdf8';
                        rightBg = '#0c4a6e';
                        borderStyle = '1.5px solid #00e5ff';
                        glowEffect = '0 0 16px rgba(0, 229, 255, 0.6)';
                      } else if (colorType === 'active') {
                        frontBg = 'linear-gradient(to top, #047857, #10b981)';
                        topBg = '#34d399';
                        rightBg = '#065f46';
                        borderStyle = '1px solid #10b981';
                        glowEffect = '0 0 10px rgba(16, 185, 129, 0.4)';
                      } else if (colorType === 'inactive') {
                        frontBg = 'linear-gradient(to top, #0f172a, #1e293b)';
                        topBg = '#334155';
                        rightBg = '#020617';
                        borderStyle = '1px solid rgba(255,255,255,0.04)';
                        glowEffect = 'none';
                      } else {
                        frontBg = 'linear-gradient(to top, #3730a3, #6366f1)';
                        topBg = '#818cf8';
                        rightBg = '#1e1b4b';
                        borderStyle = '1px solid rgba(255,255,255,0.1)';
                        glowEffect = 'none';
                      }

                      const blockWidth = isMobile ? 'clamp(14px, 85%, 26px)' : 'clamp(20px, 80%, 46px)';

                      return (
                        <div key={idx} style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          position: 'relative'
                        }}>
                          {/* 3D Isometric Block Pillar */}
                          <div style={{
                            position: 'relative',
                            height: `${heightPercent}%`,
                            width: blockWidth,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                          }}>
                            {/* Top Face */}
                            <div style={{
                              position: 'absolute',
                              top: '-8px',
                              left: '4px',
                              width: '100%',
                              height: '8px',
                              background: topBg,
                              transform: 'skewX(-45deg)',
                              transformOrigin: 'bottom left',
                              transition: 'all 0.3s ease',
                              borderTop: borderStyle
                            }} />

                            {/* Right Face */}
                            <div style={{
                              position: 'absolute',
                              top: '-4px',
                              right: '-8px',
                              width: '8px',
                              height: '100%',
                              background: rightBg,
                              transform: 'skewY(-45deg)',
                              transformOrigin: 'top left',
                              transition: 'all 0.3s ease',
                              borderRight: borderStyle
                            }} />

                            {/* Front Face */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: frontBg,
                              border: borderStyle,
                              borderRadius: '3px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 2px',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: isMobile ? '0.7rem' : '0.95rem',
                              boxShadow: glowEffect,
                              transition: 'all 0.3s ease'
                            }}>
                              <span>{val}</span>
                              <span style={{
                                fontSize: '0.62rem',
                                opacity: 0.75,
                                fontFamily: 'monospace',
                                background: 'rgba(0,0,0,0.3)',
                                padding: '1px 4px',
                                borderRadius: '3px'
                              }}>
                                {idx}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: isMobile ? '4px' : '8px', background: 'var(--glass-bg)', borderRadius: '14px', border: '1px solid var(--glass-border)', padding: isMobile ? '1rem 0.5rem' : '2rem 1rem', overflow: 'hidden' }}>
              {frame.arr.map((val, idx) => {
                let bg = 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))';
                if (idx === frame.i || idx === frame.j) bg = 'linear-gradient(to top, #fbbf24, #f59e0b)';
                if (idx === frame.k) bg = 'linear-gradient(to top, #10b981, #059669)';

                return (
                  <div key={idx} ref={el => barRefs.current[idx] = el} style={{
                    height: `${Math.max(val, 5)}%`,
                    width: isMobile ? '20px' : '45px',
                    background: bg,
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '0.7rem' : '1rem',
                    paddingTop: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'height 0.2s ease, background 0.2s',
                    transformOrigin: 'bottom center'
                  }}>
                    {val}
                  </div>
                );
              })}
            </div>
          )}

          {selectedSort === 'Counting Sort' && frame.counts && (
            <div style={{
              marginTop: '1.2rem',
              background: 'var(--glass-bg)',
              borderRadius: '14px',
              border: '1px solid var(--glass-border)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexShrink: 0
            }}>
              <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🧮 Counting Sort Frequency / Cumulative Counts Array
              </h4>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
                {frame.counts.map((cnt, idx) => {
                  const numVal = idx + frame.minVal;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        minWidth: '55px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '4px',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#fbbf24', borderBottom: '1px solid var(--glass-border)', width: '100%', textAlign: 'center', paddingBottom: '3px' }}>
                        Val: {numVal}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', paddingTop: '4px' }}>
                        {cnt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedSort === 'Radix Sort' && frame.buckets && (
            <div style={{
              marginTop: '1.2rem',
              background: 'var(--glass-bg)',
              borderRadius: '14px',
              border: '1px solid var(--glass-border)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flexShrink: 0
            }}>
              <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🪣 Radix Digits Buckets (0 to 9) - {frame.k}s Place
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: isMobile ? '4px' : '10px' }}>
                {frame.buckets.map((bucket, bIdx) => (
                  <div
                    key={bIdx}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      minHeight: isMobile ? '50px' : '80px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '4px 0',
                      gap: '4px',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.85rem', fontWeight: 'bold', color: '#fbbf24', borderBottom: '1px solid var(--glass-border)', width: '100%', textAlign: 'center', paddingBottom: '3px' }}>
                      [{bIdx}]
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', alignItems: 'center', overflowY: 'auto' }}>
                      {bucket.map((val, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            borderRadius: '4px',
                            padding: '1px 4px',
                            fontSize: isMobile ? '0.65rem' : '0.8rem',
                            fontWeight: 'bold',
                            color: '#fff',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                          }}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', background: 'var(--glass-bg)', padding: isMobile ? '10px 14px' : '12px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)', flexShrink: 0, gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-clear" style={{ fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={!timeline.length || currentStep === 0}>⏮ First</button>
              <button className="btn btn-clear" style={{ fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={!timeline.length || currentStep === 0}>◀ Prev</button>
              <button className="btn btn-clear" style={{ border: 'none', background: isPlaying ? 'rgba(59,130,246,0.6)' : 'var(--accent-primary)', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }} onClick={() => setIsPlaying(p => !p)} disabled={!timeline.length}>{isPlaying ? '⏸' : '▶ Play'}</button>
              <button className="btn btn-clear" style={{ fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={!timeline.length || currentStep === timeline.length - 1}>Next ▶</button>
              <button className="btn btn-clear" style={{ fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={!timeline.length || currentStep === timeline.length - 1}>Last ⏭</button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: isMobile ? '5px' : '15px', fontWeight: 'bold', fontFamily: 'monospace' }}>Step: {timeline.length ? currentStep + 1 : 0}/{timeline.length}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Speed ({speed}ms)</span>
              <input type="range" min={50} max={1500} step={50} value={1550 - speed} onChange={e => setSpeed(1550 - Number(e.target.value))} style={{ width: isMobile ? '100%' : '160px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} title={`Delay: ${speed}ms`} />
            </div>
          </div>

          {showLogPanel && !isMobile && (
            <div
              style={{
                position: 'absolute',
                left: `${logPosition.x}px`,
                top: `${logPosition.y}px`,
                width: `${logSize.width}px`,
                height: `${logSize.height}px`,
                background: 'rgba(15, 23, 42, 0.45)', // Translucent glassmorphism
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 100
              }}
            >
              {/* Drag Handle Header */}
              <div
                onMouseDown={handleLogHeaderMouseDown}
                onTouchStart={handleLogHeaderMouseDown}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                  flexShrink: 0,
                  cursor: 'move'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📋 Execution Log & Active State
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => {
                      hasUserMovedLog.current = false;
                      setLogPosition(getFreeLogPosition());
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '5px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      padding: '2px 7px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    title="Snap log to free unoccupied canvas space (avoids core animation)"
                  >
                    <span>🧭</span> Free Space
                  </button>
                  <button
                    onClick={() => setShowLogPanel(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0 4px',
                      lineHeight: 1
                    }}
                    title="Hide Log"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Column: Data Structure Pointers & Elements */}
                <div
                  style={{
                    width: `${activeStateWidth}px`,
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderRight: '1px solid var(--glass-border)',
                    padding: '6px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    overflowY: 'auto',
                    flexShrink: 0
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '2px' }}>
                    Active State
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Algorithm: </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                      {currentDisplayedAlgo} ({codeLang})
                    </span>
                  </div>

                  {(() => {
                    const frame = timeline[currentStep] || { arr: array, i: -1, j: -1, k: -1 };
                    return (
                      <>
                        <div>
                          <div style={{ marginBottom: '2px', fontSize: '0.7rem' }}>Elements:</div>
                          {frame.arr && frame.arr.length > 0 ? (
                            <div style={{ background: 'rgba(0,0,0,0.18)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', wordBreak: 'break-all', fontWeight: 'bold' }}>
                              [{frame.arr.join(', ')}]
                            </div>
                          ) : (
                            <span style={{ fontStyle: 'italic' }}>Empty</span>
                          )}
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '4px', marginTop: '2px' }}>
                          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px', color: 'var(--accent-secondary)' }}>Pointers & Highlights</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {(() => {
                              const details = getPointerDetails(currentDisplayedAlgo, frame);
                              if (details.length === 0) {
                                return <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No active pointers</span>;
                              }
                              return details.map((d, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                                  <span>{d.label}:</span>
                                  <span style={{ color: d.color, fontWeight: 'bold' }}>{d.val}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* Asymptotic Complexity Analysis Card */}
                        {(() => {
                          const complexity = ALGO_COMPLEXITIES[currentDisplayedAlgo] || ALGO_COMPLEXITIES['Bubble Sort'];
                          const isCompleted = timeline.length > 0 && currentStep === timeline.length - 1 && (frame.msg?.includes('Complete') || frame.msg?.includes('Found') || frame.msg?.includes('not found'));
                          const nVal = frame.arr ? frame.arr.length : array.length;
                          const sourceArr = initialArray.length > 0 ? initialArray : array;
                          const activeCase = detectInputCase(currentDisplayedAlgo, sourceArr, searchValue);

                          return (
                            <div style={{
                              borderTop: isCompleted ? '1.5px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255,255,255,0.08)',
                              paddingTop: '6px',
                              marginTop: '6px',
                              background: isCompleted ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(16, 185, 129, 0.12))' : 'rgba(0, 0, 0, 0.18)',
                              borderRadius: '8px',
                              padding: '7px 8px',
                              border: isCompleted ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255,255,255,0.05)',
                              boxShadow: isCompleted ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none',
                              transition: 'all 0.3s ease'
                            }}>
                              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px', color: isCompleted ? '#38bdf8' : '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>⚡ Complexity for N={nVal}:</span>
                              </div>
                              <div style={{ fontSize: '0.64rem', color: isCompleted ? '#34d399' : '#94a3b8', fontStyle: 'italic', marginBottom: '6px' }}>
                                [{complexity.type}]
                              </div>
                              <div style={{
                                background: isCompleted ? 'rgba(15, 23, 42, 0.7)' : 'rgba(0, 0, 0, 0.3)',
                                border: isCompleted ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(56, 189, 248, 0.18)',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                fontSize: '0.68rem',
                                fontFamily: 'monospace'
                              }}>
                                <div>
                                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.64rem', marginBottom: '3px', fontWeight: 600 }}>⏱️ Time Complexity:</div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px' }}>
                                    {/* Best */}
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: activeCase === 'best' ? '2px 5px' : '1px 0',
                                      borderRadius: '4px',
                                      background: activeCase === 'best' ? 'rgba(52, 211, 153, 0.18)' : 'transparent',
                                      border: activeCase === 'best' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent'
                                    }}>
                                      <span style={{ color: activeCase === 'best' ? '#34d399' : '#94a3b8', fontWeight: activeCase === 'best' ? 'bold' : 'normal' }}>
                                        {activeCase === 'best' ? '⚡ Best (Active):' : 'Best:'}
                                      </span>
                                      <span style={{ color: activeCase === 'best' ? '#34d399' : '#cbd5e1', fontWeight: activeCase === 'best' ? 'bold' : 'normal' }}>
                                        {complexity.timeBest}
                                      </span>
                                    </div>

                                    {/* Avg */}
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: activeCase === 'avg' ? '2px 5px' : '1px 0',
                                      borderRadius: '4px',
                                      background: activeCase === 'avg' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                                      border: activeCase === 'avg' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent'
                                    }}>
                                      <span style={{ color: activeCase === 'avg' ? '#38bdf8' : '#94a3b8', fontWeight: activeCase === 'avg' ? 'bold' : 'normal' }}>
                                        {activeCase === 'avg' ? '⚡ Avg (Active):' : 'Avg:'}
                                      </span>
                                      <span style={{ color: activeCase === 'avg' ? '#38bdf8' : '#cbd5e1', fontWeight: activeCase === 'avg' ? 'bold' : 'normal' }}>
                                        {complexity.timeAvg}
                                      </span>
                                    </div>

                                    {/* Worst */}
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: activeCase === 'worst' ? '2px 5px' : '1px 0',
                                      borderRadius: '4px',
                                      background: activeCase === 'worst' ? 'rgba(248, 113, 113, 0.18)' : 'transparent',
                                      border: activeCase === 'worst' ? '1px solid rgba(248, 113, 113, 0.4)' : '1px solid transparent'
                                    }}>
                                      <span style={{ color: activeCase === 'worst' ? '#f87171' : '#94a3b8', fontWeight: activeCase === 'worst' ? 'bold' : 'normal' }}>
                                        {activeCase === 'worst' ? '⚡ Worst (Active):' : 'Worst:'}
                                      </span>
                                      <span style={{ color: activeCase === 'worst' ? '#f87171' : '#cbd5e1', fontWeight: activeCase === 'worst' ? 'bold' : 'normal' }}>
                                        {complexity.timeWorst}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '4px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>💾 Space:</span>
                                    <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{complexity.space}</span>
                                  </div>
                                </div>
                                {complexity.stable !== 'N/A' && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Stable:</span>
                                    <span style={{ color: complexity.stable === 'Yes' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{complexity.stable}</span>
                                  </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>In-Place:</span>
                                  <span style={{ color: complexity.inPlace === 'Yes' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{complexity.inPlace}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    );
                  })()}

                </div>

                {/* Col Resize bar */}
                <div
                  onMouseDown={handleActiveStateColDragStart}
                  onTouchStart={handleActiveStateColDragStart}
                  style={{ width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 5 }}
                />

                {/* Right Column: Log list container */}
                <div
                  ref={logContainerRef}
                  style={{
                    padding: '10px 12px',
                    overflowY: 'auto',
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {timeline.length === 0 && (
                      <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                        No simulation logs yet. Run algorithm to start.
                      </div>
                    )}
                    {timeline.slice(0, currentStep + 1).map((frame, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', lineHeight: '1.4' }}>
                        <span style={{ color: 'var(--text-secondary)', flexShrink: 0, width: '24px', textAlign: 'right', fontWeight: 'bold', userSelect: 'none' }}>
                          {idx === currentStep ? '➔' : `${idx + 1}.`}
                        </span>
                        <span style={{ color: idx === currentStep ? 'var(--accent-primary)' : 'var(--text-primary)', wordBreak: 'break-word', flex: 1 }}>
                          {highlightLogText(frame.msg)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resize Handle */}
              <div
                onMouseDown={handleLogResizeMouseDown}
                onTouchStart={handleLogResizeMouseDown}
                style={{
                  position: 'absolute', bottom: '0', right: '0', width: '15px', height: '15px',
                  cursor: 'se-resize', background: 'transparent',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '2px',
                  zIndex: 10
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8"><path d="M6 0 L8 0 L8 8 L0 8 L0 6 L4 6 L4 4 L6 4 Z" fill="rgba(255,255,255,0.3)" /></svg>
              </div>

            </div>
          )}

          {showTreePanel && !isMobile && (currentDisplayedAlgo === 'Heap Sort' || currentDisplayedAlgo === 'Binary Search') && (
            <div
              style={{
                position: 'fixed',
                left: `${Math.max(0, Math.min(treePanelPosition.x, window.innerWidth - treePanelSize.width))}px`,
                top: `${Math.max(0, Math.min(treePanelPosition.y, window.innerHeight - treePanelSize.height))}px`,
                width: `${treePanelSize.width}px`,
                height: `${treePanelSize.height}px`,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 99,
                overflow: 'hidden'
              }}
            >
              {/* Drag Handle Header */}
              <div
                className="tree-panel-drag-handle"
                onMouseDown={handleTreePanelMouseDown}
                onTouchStart={handleTreePanelMouseDown}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid var(--glass-border)',
                  cursor: 'move',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                  flexShrink: 0,
                  touchAction: 'none'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🌳 {currentDisplayedAlgo === 'Heap Sort' ? 'Heap Tree Visualizer' : 'BST Recursion Tree'}
                </span>
                <button
                  onClick={() => setShowTreePanel(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '0 4px',
                    lineHeight: 1
                  }}
                  title="Hide Tree"
                >
                  ×
                </button>
              </div>

              {/* Tree Content Body */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '10px' }}>
                {renderTreeSVG(600, 400)}
              </div>

              {/* Resize Handle */}
              <div
                style={{
                  position: 'absolute',
                  right: '4px',
                  bottom: '4px',
                  width: '12px',
                  height: '12px',
                  cursor: 'se-resize',
                  background: 'linear-gradient(135deg, transparent 60%, rgba(255,255,255,0.3) 60%)',
                  zIndex: 100,
                  touchAction: 'none'
                }}
                onMouseDown={handleTreePanelResizeMouseDown}
                onTouchStart={handleTreePanelResizeMouseDown}
                title="Drag to resize panel"
              />
            </div>
          )}
        </div>

        {/* Inline Mobile Log Panel */}
        {isMobile && showLogPanel && mobileTab === 'log' && (
          <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', padding: '0.85rem', overflow: 'hidden', height: '100%', width: '100%' }}>
            <div style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                📋 Execution Log & Active State
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  className="btn btn-clear"
                  style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }}
                  disabled={!timeline.length || currentStep === 0}
                  title="Previous Step"
                >
                  ◀
                </button>
                <button
                  className="btn btn-clear"
                  style={{ padding: '2px 10px', fontSize: '0.72rem', background: isPlaying ? 'rgba(59,130,246,0.6)' : 'var(--accent-primary)', color: 'white' }}
                  onClick={() => setIsPlaying(p => !p)}
                  disabled={!timeline.length}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  className="btn btn-clear"
                  style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }}
                  disabled={!timeline.length || currentStep === timeline.length - 1}
                  title="Next Step"
                >
                  ▶
                </button>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {timeline.length ? `${currentStep + 1}/${timeline.length}` : '0/0'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden', gap: '10px', marginTop: '10px' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  Active State
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Algorithm: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{currentDisplayedAlgo}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Elements: </span>
                  <span style={{ color: '#34d399', fontFamily: 'monospace', fontWeight: 'bold' }}>[{frame.arr ? frame.arr.join(', ') : ''}]</span>
                </div>
                {(() => {
                  const details = getPointerDetails(currentDisplayedAlgo, frame);
                  if (details.length === 0) return null;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
                      {details.map((d, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span>{d.label}:</span>
                          <span style={{ color: d.color, fontWeight: 'bold' }}>{d.val}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Mobile Asymptotic Complexities */}
                {(() => {
                  const complexity = ALGO_COMPLEXITIES[currentDisplayedAlgo] || ALGO_COMPLEXITIES['Bubble Sort'];
                  const isCompleted = timeline.length > 0 && currentStep === timeline.length - 1 && (frame.msg?.includes('Complete') || frame.msg?.includes('Found') || frame.msg?.includes('not found'));
                  const nVal = frame.arr ? frame.arr.length : array.length;
                  const sourceArr = initialArray.length > 0 ? initialArray : array;
                  const activeCase = detectInputCase(currentDisplayedAlgo, sourceArr, searchValue);

                  return (
                    <div style={{
                      marginTop: '6px',
                      paddingTop: '6px',
                      borderTop: isCompleted ? '1.5px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255,255,255,0.08)',
                      background: isCompleted ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(16, 185, 129, 0.12))' : 'rgba(0,0,0,0.18)',
                      borderRadius: '8px',
                      padding: '6px 8px',
                      border: isCompleted ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255,255,255,0.04)',
                      boxShadow: isCompleted ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: isCompleted ? '#38bdf8' : '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>⚡ Complexity for N={nVal}:</span>
                      </div>
                      <div style={{ fontSize: '0.64rem', color: isCompleted ? '#34d399' : '#94a3b8', fontStyle: 'italic', marginBottom: '6px' }}>
                        [{complexity.type}]
                      </div>
                      <div style={{
                        background: isCompleted ? 'rgba(15, 23, 42, 0.7)' : 'rgba(0,0,0,0.3)',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        border: isCompleted ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        fontSize: '0.72rem',
                        fontFamily: 'monospace'
                      }}>
                        <div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.64rem', marginBottom: '3px', fontWeight: 600 }}>⏱️ Time Complexity:</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px' }}>
                            {/* Best */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: activeCase === 'best' ? '2px 5px' : '1px 0',
                              borderRadius: '4px',
                              background: activeCase === 'best' ? 'rgba(52, 211, 153, 0.18)' : 'transparent',
                              border: activeCase === 'best' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent'
                            }}>
                              <span style={{ color: activeCase === 'best' ? '#34d399' : '#94a3b8', fontWeight: activeCase === 'best' ? 'bold' : 'normal' }}>
                                {activeCase === 'best' ? '⚡ Best (Active):' : 'Best:'}
                              </span>
                              <span style={{ color: activeCase === 'best' ? '#34d399' : '#cbd5e1', fontWeight: activeCase === 'best' ? 'bold' : 'normal' }}>
                                {complexity.timeBest}
                              </span>
                            </div>

                            {/* Avg */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: activeCase === 'avg' ? '2px 5px' : '1px 0',
                              borderRadius: '4px',
                              background: activeCase === 'avg' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                              border: activeCase === 'avg' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent'
                            }}>
                              <span style={{ color: activeCase === 'avg' ? '#38bdf8' : '#94a3b8', fontWeight: activeCase === 'avg' ? 'bold' : 'normal' }}>
                                {activeCase === 'avg' ? '⚡ Avg (Active):' : 'Avg:'}
                              </span>
                              <span style={{ color: activeCase === 'avg' ? '#38bdf8' : '#cbd5e1', fontWeight: activeCase === 'avg' ? 'bold' : 'normal' }}>
                                {complexity.timeAvg}
                              </span>
                            </div>

                            {/* Worst */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: activeCase === 'worst' ? '2px 5px' : '1px 0',
                              borderRadius: '4px',
                              background: activeCase === 'worst' ? 'rgba(248, 113, 113, 0.18)' : 'transparent',
                              border: activeCase === 'worst' ? '1px solid rgba(248, 113, 113, 0.4)' : '1px solid transparent'
                            }}>
                              <span style={{ color: activeCase === 'worst' ? '#f87171' : '#94a3b8', fontWeight: activeCase === 'worst' ? 'bold' : 'normal' }}>
                                {activeCase === 'worst' ? '⚡ Worst (Active):' : 'Worst:'}
                              </span>
                              <span style={{ color: activeCase === 'worst' ? '#f87171' : '#cbd5e1', fontWeight: activeCase === 'worst' ? 'bold' : 'normal' }}>
                                {complexity.timeWorst}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>💾 Space:</span>
                            <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{complexity.space}</span>
                          </div>
                        </div>
                        {complexity.stable !== 'N/A' && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Stable:</span>
                            <span style={{ color: complexity.stable === 'Yes' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{complexity.stable}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>In-Place:</span>
                          <span style={{ color: complexity.inPlace === 'Yes' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{complexity.inPlace}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ flex: 1, background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '0.75rem 1rem', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.03)' }}>
                {timeline.slice(0, currentStep + 1).map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', marginBottom: '6px', lineHeight: '1.4' }}>
                    <span style={{ color: 'var(--text-secondary)', flexShrink: 0, width: '24px', textAlign: 'right', fontWeight: 'bold', userSelect: 'none' }}>
                      {idx === currentStep ? '➔' : `${idx + 1}.`}
                    </span>
                    <span style={{ color: idx === currentStep ? 'var(--accent-primary)' : 'var(--text-primary)', wordBreak: 'break-word', flex: 1 }}>
                      {highlightLogText(f.msg)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inline Mobile Tree Panel */}
        {isMobile && mobileTab === 'tree' && (currentDisplayedAlgo === 'Heap Sort' || currentDisplayedAlgo === 'Binary Search') && (
          <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', padding: '0.85rem', overflow: 'hidden', height: '100%', width: '100%' }}>
            <div style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                🌳 {currentDisplayedAlgo === 'Heap Sort' ? 'Heap Tree Visualizer' : 'BST Recursion Tree'}
              </span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginTop: '10px', overflow: 'hidden', padding: '5px' }}>
              {renderTreeSVG(600, 400)}
            </div>
          </div>
        )}

        {/* Right Column: Code Sidebar */}
        {showCode && (isMobile ? mobileTab === 'code' : true) && (
          <>
            {/* Vertical Drag Handle for column resizing */}
            {!isMobile && (
              <div onMouseDown={handleColDragStart} onTouchStart={handleColDragStart} style={{ width: '8px', background: 'var(--glass-border)', borderRadius: '4px', cursor: 'col-resize', flexShrink: 0, transition: 'background 0.2s', touchAction: 'none' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(96,165,250,0.5)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--glass-border)'}
                title="Drag to resize columns" />
            )}

            <div style={{ width: isMobile ? '100%' : `${codeWidth}px`, background: 'var(--glass-bg)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: isMobile ? '100%' : '200px' }}>
              {/* Header — sticky 2-row layout */}
              <div style={{ flexShrink: 0, borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', borderRadius: '14px 14px 0 0' }}>
                {/* Row 1: Language selector */}
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>🌐 Lang:</span>
                  {['C', 'Java', 'Python', 'JS'].map(lang => (
                    <button key={lang} onClick={() => setCodeLang(lang)}
                      style={{
                        padding: '2px 9px',
                        fontSize: '0.74rem',
                        borderRadius: '5px',
                        border: codeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: codeLang === lang ? 'var(--accent-primary)' : 'transparent',
                        color: codeLang === lang ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: codeLang === lang ? 700 : 400,
                        transition: 'all 0.15s'
                      }}
                    >{lang === 'JS' ? 'JavaScript' : lang}</button>
                  ))}
                </div>
                {/* Row 2: Utility actions */}
                <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Code</h3>
                  <button onClick={() => setLocalFontSize(prev => Math.max(10, prev - 2))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.73rem', padding: '1px 6px', cursor: 'pointer' }}>A−</button>
                  <button onClick={() => setLocalFontSize(prev => Math.min(40, prev + 2))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.73rem', padding: '1px 6px', cursor: 'pointer' }}>A+</button>
                  <button
                    onClick={() => setIsRunnerOpen(true)}
                    style={{ padding: '2px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '5px', cursor: 'pointer' }}
                  >▶ Run</button>
                  <button
                    onClick={handleCopyCode}
                    style={{ padding: '2px 8px', fontSize: '0.74rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >{copied ? '✓ Copied' : '📋 Copy'}</button>
                </div>
              </div>
              <div className="code-box" style={{ flex: 1, overflow: 'hidden', padding: 0, borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                <NumberedCodeViewer
                  code={toAllman(getSortSearchCode(currentDisplayedAlgo, codeLang, array, searchValue ? parseInt(searchValue) : undefined))}
                  fontSize={localFontSize}
                  wordWrap={wordWrap}
                  accentColor="var(--accent-primary)"
                  isHighlighted={(line) => isSortSearchLineMatch(currentDisplayedAlgo, (timeline[currentStep] || {}).msg || '', line)}
                  bg="transparent"
                />
              </div>
            </div>
          </>
        )}

      </div>
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={getSortSearchCode(currentDisplayedAlgo, codeLang, array, searchValue ? parseInt(searchValue) : undefined)}
        language={codeLang}
      />
      <TopicInfoModal
        topicKey={currentDisplayedAlgo}
        isOpen={showTopicInfo}
        onClose={() => setShowTopicInfo(false)}
      />
    </div>
  );
};

export default SortSearchVisualizer;
