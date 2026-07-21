/* eslint-disable react/prop-types, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getGeneralCodeTemplate } from './codeTemplatesGeneral';
import CodeRunnerModal from './CodeRunnerModal.jsx';

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


const isPrime = (n) => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};
const nextPrime = (n) => {
  if (n <= 1) return 2;
  let prime = n;
  let found = false;
  while (!found) {
    prime++;
    if (isPrime(prime)) found = true;
  }
  return prime;
};
const getHTElementCount = (table, isChaining) => {
  if (!table) return 0;
  if (isChaining) {
    return table.reduce((sum, bucket) => sum + (Array.isArray(bucket) ? bucket.length : 0), 0);
  } else {
    return table.filter(v => v !== null && v !== 'TOMBSTONE').length;
  }
};
const getComplexityInfo = (type, variety) => {
  switch (type) {
    case 'STACK':
      if (variety === 'STACK_ARRAY' || variety === 'STACK_LL') {
        return {
          title: 'Stack (Array/LL)',
          operations: [
            { op: 'Push', time: 'O(1)', space: 'O(1)' },
            { op: 'Pop', time: 'O(1)', space: 'O(1)' },
            { op: 'Peek', time: 'O(1)', space: 'O(1)' },
            { op: 'Search', time: 'O(N)', space: 'O(1)' }
          ]
        };
      }
      return {
        title: 'Stack Apps',
        operations: [
          { op: 'Expr Eval', time: 'O(N)', space: 'O(N)' },
          { op: 'Bracket Check', time: 'O(N)', space: 'O(N)' },
          { op: 'Infix Converter', time: 'O(N)', space: 'O(N)' }
        ]
      };
    case 'QUEUE':
      return {
        title: `Queue (${variety === 'QUEUE_CIRCULAR' ? 'Circular' : variety === 'QUEUE_DEQUE' ? 'Deque' : variety === 'QUEUE_PRIORITY' ? 'Priority' : 'Simple'})`,
        operations: [
          { op: 'Enqueue', time: variety === 'QUEUE_PRIORITY' ? 'O(log N)' : 'O(1)', space: 'O(1)' },
          { op: 'Dequeue', time: 'O(1)', space: 'O(1)' },
          { op: 'Search', time: 'O(N)', space: 'O(1)' }
        ]
      };
    case 'LINKED_LIST':
      if (variety === 'LL_POLYNOMIAL') {
        return {
          title: 'Polynomial (LL)',
          operations: [
            { op: 'Addition', time: 'O(N + M)', space: 'O(N + M)' },
            { op: 'Multiplication', time: 'O(N * M)', space: 'O(N * M)' }
          ]
        };
      }
      return {
        title: `Linked List (${variety === 'LL_DOUBLY' ? 'Doubly' : variety === 'LL_CIRCULAR' ? 'Circular' : 'Singly'})`,
        operations: [
          { op: 'Insert Head', time: 'O(1)', space: 'O(1)' },
          { op: 'Insert Tail', time: variety === 'LL_CIRCULAR' || variety === 'LL_DOUBLY' ? 'O(1)' : 'O(N)', space: 'O(1)' },
          { op: 'Delete Value', time: 'O(N)', space: 'O(1)' },
          { op: 'Search', time: 'O(N)', space: 'O(1)' }
        ]
      };
    case 'HASH_TABLE':
      const modeLabel = variety === 'HASH_CHAINING' ? 'Chaining'
        : variety === 'HASH_QUADRATIC' ? 'Quadratic'
        : variety === 'HASH_MULTIPLICATION' ? 'Multiplication'
        : variety === 'HASH_FOLDING' ? 'Folding'
        : 'Linear';
      return {
        title: `Hash Table (${modeLabel})`,
        operations: [
          { op: 'Insert', time: 'O(1) avg / O(N) worst', space: 'O(1)' },
          { op: 'Search', time: 'O(1) avg / O(N) worst', space: 'O(1)' },
          { op: 'Delete', time: 'O(1) avg / O(N) worst', space: 'O(1)' },
          { op: 'Rehash', time: 'O(N) (resize)', space: 'O(N)' }
        ]
      };
    default:
      return null;
  }
};
const parsePolynomial = (str) => {
  if (!str) return [];
  const terms = [];
  const cleanStr = str.replace(/\s+/g, '');
  const parts = cleanStr.replace(/-/g, '+-').split('+');
  for (let part of parts) {
    if (!part) continue;
    let coeff = 1;
    let exp = 0;
    if (part.includes('x')) {
      const sides = part.split('x');
      const coeffStr = sides[0];
      const expStr = sides[1] || '';
      if (coeffStr === '') coeff = 1;
      else if (coeffStr === '-') coeff = -1;
      else coeff = parseInt(coeffStr, 10);
      if (expStr.startsWith('^')) {
        exp = parseInt(expStr.substring(1), 10);
      } else {
        exp = 1;
      }
    } else {
      coeff = parseInt(part, 10);
      exp = 0;
    }
    if (!isNaN(coeff) && !isNaN(exp) && coeff !== 0) {
      terms.push({ coeff, exp });
    }
  }
  terms.sort((a, b) => b.exp - a.exp);
  const merged = [];
  for (let term of terms) {
    let existing = merged.find(t => t.exp === term.exp);
    if (existing) {
      existing.coeff += term.coeff;
    } else {
      merged.push({ ...term });
    }
  }
  return merged.filter(t => t.coeff !== 0);
};

const GeneralDSVisualizer = ({ onBack, openSettings, initialType = 'HASH_TABLE', initialVariety = 'HASH_LINEAR', onCopyCode, onCodeChange, fontSize = 14, wordWrap = 'off', onShowUpcomingFeatures }) => {
  const [dsType, setDsType] = useState(initialType);
  const [dsVariety, setDsVariety] = useState(initialVariety);
  const [inputValue, setInputValue] = useState('');
  const [speed, setSpeed] = useState(400);
  const [tableSize, setTableSize] = useState(7);
  const [codeLanguage, setCodeLanguage] = useState('Java');
  const [showCode, setShowCode] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [mobileTab, setMobileTab] = useState('vis');
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draggable execution log states
  const [showLogPanel, setShowLogPanel] = useState(true);
  const [logPosition, setLogPosition] = useState({ x: 20, y: 120 });
  const [isDraggingLog, setIsDraggingLog] = useState(false);
  const [logSize, setLogSize] = useState({ width: 580, height: 300 });
  const [activeStateWidth, setActiveStateWidth] = useState(240);
  const [codeWidth, setCodeWidth] = useState(450);

  const logDragStart = useRef({ x: 0, y: 0 });
  const logPanelStart = useRef({ x: 0, y: 0 });
  const logContainerRef = useRef(null);

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
    const end  = () => {
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



  // State for the data structures
  const [elements, setElements] = useState([]); 
  const [hashTable, setHashTable] = useState(Array.from({length: tableSize}, () => []));
  const [cqState, setCqState] = useState({ arr: Array(5).fill(null), f: -1, r: -1 });
  const [operationsLog, setOperationsLog] = useState([]);
  const [poppedElements, setPoppedElements] = useState([]);
  const [polyA, setPolyA] = useState([]);
  const [polyB, setPolyB] = useState([]);
  const [polyResult, setPolyResult] = useState([]);
  const [polyAInput, setPolyAInput] = useState('3x^2 + 2x + 1');
  const [polyBInput, setPolyBInput] = useState('4x^2 + 5');
  const [polyOp, setPolyOp] = useState('+');
  const [showComplexity, setShowComplexity] = useState(true);

  // Declare currentCode here so it's initialized before hooks run
  const currentCode = getGeneralCodeTemplate(codeLanguage, dsType, dsVariety, operationsLog);

  const handleCopyCode = () => {
    copyToClipboard(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(currentCode, codeLanguage);
    }).catch(err => console.error("Clipboard copy failed:", err));
  };

  useEffect(() => {
    if (onCodeChange) onCodeChange(currentCode, codeLanguage);
  }, [currentCode, codeLanguage, onCodeChange]);


  // Animation timeline state
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStep, showLogPanel, timeline]);

  const bucketRefs = useRef([]);
  const inputRef = useRef(null);

  const triggerFocus = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < timeline.length - 1) {
      timer = setTimeout(() => setCurrentStep(p => p + 1), speed);
    } else if (currentStep >= timeline.length - 1) {
      setIsPlaying(false);
      triggerFocus();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, timeline.length, speed]);

  const handleClear = (overrideVariety = dsVariety, overrideSize = tableSize) => {
    setElements([]);
    setOperationsLog([]);
    setPoppedElements([]);
    setPolyA([]);
    setPolyB([]);
    setPolyResult([]);
    if (overrideVariety === 'HASH_CHAINING') {
      setHashTable(Array.from({length: overrideSize}, () => []));
    } else if (overrideVariety?.startsWith('HASH_')) {
      setHashTable(Array(overrideSize).fill(null));
    }
    setCqState({ arr: Array(5).fill(null), f: -1, r: -1 });
    setTimeline([]);
    setCurrentStep(0);
    setIsPlaying(false);
    triggerFocus();
  };

  useEffect(() => { 
    let initialVariety = dsVariety;
    // Only reset variety if the current variety doesn't match the new dsType
    if (dsType === 'STACK' && !initialVariety.startsWith('STACK_')) initialVariety = 'STACK_ARRAY';
    else if (dsType === 'QUEUE' && !initialVariety.startsWith('QUEUE_')) initialVariety = 'QUEUE_SIMPLE';
    else if (dsType === 'LINKED_LIST' && !initialVariety.startsWith('LL_')) initialVariety = 'LL_SINGLY';
    else if (dsType === 'HASH_TABLE' && !initialVariety.startsWith('HASH_')) initialVariety = 'HASH_LINEAR';
    
    if (initialVariety !== dsVariety) {
        setDsVariety(initialVariety);
    } else {
        handleClear(dsVariety, tableSize);
    }
  }, [dsType, tableSize]);

  useEffect(() => { handleClear(dsVariety, tableSize); }, [dsVariety, tableSize]);

  // GSAP Collision & Active Animation Trigger
  useEffect(() => {
    const frame = timeline[currentStep];
    if (!frame) return;

    if (frame.isCollision && frame.activeBucket !== -1 && bucketRefs.current[frame.activeBucket]) {
      gsap.fromTo(bucketRefs.current[frame.activeBucket], 
        { x: -10, filter: 'hue-rotate(90deg)' }, 
        { x: 10, duration: 0.08, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => {
            gsap.to(bucketRefs.current[frame.activeBucket], { x: 0, filter: 'hue-rotate(0deg)', duration: 0.2 });
        }}
      );
    } else if (frame.activeBucket !== -1 && bucketRefs.current[frame.activeBucket]) {
        gsap.fromTo(bucketRefs.current[frame.activeBucket], 
            { scale: 0.85, opacity: 0.5 }, 
            { scale: 1.08, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    }
  }, [currentStep, timeline]);

  // Operations for Stack
  const stackPush = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    
    let line1 = dsVariety === 'STACK_LL' ? 'Node n = new Node' : 'top == capacity - 1';
    let line2 = dsVariety === 'STACK_LL' ? 'top = n' : 'arr[++top] =';

    frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Preparing to push ${val} onto Stack`, activeLineText: line1 });
    frames.push({ arr: [...currentArr, val], activeIdx: currentArr.length, msg: `Pushed ${val} onto the top`, activeLineText: line2 });
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements([...currentArr, val]); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'push', val }]);
  };

  const stackPop = () => {
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    if(currentArr.length === 0) { alert('Stack Underflow'); return; }
    let frames = [];
    let val = currentArr[currentArr.length-1];
    
    let line1 = dsVariety === 'STACK_LL' ? 'top == null' : 'top == -1';
    let line2 = dsVariety === 'STACK_LL' ? 'top = top.next' : 'return arr[top--]';

    frames.push({ arr: [...currentArr], activeIdx: currentArr.length-1, msg: `Identify top element ${val} for popping`, activeLineText: line1 });
    let newArr = currentArr.slice(0, -1);
    frames.push({ arr: newArr, activeIdx: -1, msg: `Successfully popped ${val}`, activeLineText: line2 });
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(newArr); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'pop' }]);
    setPoppedElements(prev => [...prev, { val, op: 'Pop', ds: 'Stack' }]);
  };

  const stackSearch = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    let frames = [];
    frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Searching Stack for ${val}...`, activeLineText: 'search' });
    let foundIdx = -1;
    for (let i = currentArr.length - 1; i >= 0; i--) {
      if (currentArr[i] === val) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx === -1) {
      for (let i = currentArr.length - 1; i >= 0; i--) {
        frames.push({ arr: [...currentArr], activeIdx: i, msg: `Checking index ${i} (top-${currentArr.length - 1 - i}) ➔ ${currentArr[i]} != ${val}`, activeLineText: 'arr[i] == val' });
      }
      frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Value ${val} not found in Stack.` });
    } else {
      for (let i = currentArr.length - 1; i >= foundIdx; i--) {
        frames.push({
          arr: [...currentArr],
          activeIdx: i,
          msg: i === foundIdx ? `Found ${val} at index ${i} (top-${currentArr.length - 1 - i})!` : `Checking index ${i} (top-${currentArr.length - 1 - i}) ➔ ${currentArr[i]} != ${val}`,
          activeLineText: 'arr[i] == val'
        });
      }
    }

    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'search', val }]);
  };

  const evaluateExpression = () => {
    let tokens = inputValue.trim().split(/\s+/);
    if(tokens.length === 0 || tokens[0] === '') return;
    let frames = [];
    
    // Check if Prefix, Postfix, or Infix
    let isPrefix = ['+','-','*','/'].includes(tokens[0]);
    let isPostfix = ['+','-','*','/'].includes(tokens[tokens.length - 1]);
    let isInfix = !isPrefix && !isPostfix;

    if (isInfix) {
        let values = [];
        let ops = [];
        const precedence = (op) => {
            if (op === '+' || op === '-') return 1;
            if (op === '*' || op === '/') return 2;
            return -1;
        };
        const applyOp = (a, b, op) => {
            if (op === '+') return a + b;
            if (op === '-') return a - b;
            if (op === '*') return a * b;
            if (op === '/') return Math.floor(a / b);
            return 0;
        };
        
        frames.push({ arr: [...values], activeIdx: -1, msg: `Start Infix Evaluation. Values: [] | Ops: []`, activeLineText: 'evaluateExpression' });

        for (let i = 0; i < tokens.length; i++) {
            let t = tokens[i];
            if (t === '(') {
                ops.push('(');
                frames.push({ arr: [...values], activeIdx: -1, msg: `Read '('. Push to Operators. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]`, activeLineText: 'ops.push' });
            } else if (t === ')') {
                frames.push({ arr: [...values], activeIdx: -1, msg: `Read ')'. Evaluate until '(' is found. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
                while (ops.length && ops[ops.length - 1] !== '(') {
                    if (values.length < 2) {
                        frames.push({ arr: [...values], activeIdx: -1, msg: `Error: Invalid expression.` });
                        break;
                    }
                    let val2 = values.pop();
                    let val1 = values.pop();
                    let op = ops.pop();
                    let res = applyOp(val1, val2, op);
                    values.push(res);
                    frames.push({ arr: [...values], activeIdx: values.length - 1, msg: `Pop ${val2} and ${val1}. Apply '${op}' -> ${res}. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
                }
                if (ops.length && ops[ops.length - 1] === '(') {
                    ops.pop();
                    frames.push({ arr: [...values], activeIdx: -1, msg: `Pop '(' from Operators. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
                }
            } else if (['+', '-', '*', '/'].includes(t)) {
                while (ops.length && precedence(ops[ops.length - 1]) >= precedence(t)) {
                    if (values.length < 2) break;
                    let val2 = values.pop();
                    let val1 = values.pop();
                    let op = ops.pop();
                    let res = applyOp(val1, val2, op);
                    values.push(res);
                    frames.push({ arr: [...values], activeIdx: values.length - 1, msg: `Operator '${t}' precedence <= top operator '${op}'. Evaluate. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
                }
                ops.push(t);
                frames.push({ arr: [...values], activeIdx: -1, msg: `Push operator '${t}' to Operators. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
            } else if (!isNaN(t)) {
                values.push(parseInt(t));
                frames.push({ arr: [...values], activeIdx: values.length - 1, msg: `Read operand '${t}'. Push to Values. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
            }
        }
        
        while (ops.length) {
            if (values.length < 2) break;
            let val2 = values.pop();
            let val1 = values.pop();
            let op = ops.pop();
            let res = applyOp(val1, val2, op);
            values.push(res);
            frames.push({ arr: [...values], activeIdx: values.length - 1, msg: `Evaluate remaining operator '${op}'. Values: [${values.join(', ')}] | Ops: [${ops.join(', ')}]` });
        }
        
        frames.push({ arr: [...values], activeIdx: -1, msg: `Evaluation complete. Final Result: ${values[0]}` });
        setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(values); setInputValue(''); triggerFocus();
    } else {
        let stack = [];
        frames.push({ arr: [...stack], activeIdx: -1, msg: `Start ${isPrefix ? 'Prefix' : 'Postfix'} Evaluation: ${inputValue}`, activeLineText: 'split(" ")' });
        
        let processedTokens = isPrefix ? [...tokens].reverse() : tokens;

        for(let token of processedTokens) {
            if (!isNaN(token)) {
                stack.push(parseInt(token));
                frames.push({ arr: [...stack], activeIdx: stack.length-1, msg: `Read operand '${token}'. Push to Stack.`, activeLineText: 'stack.push(Integer.parseInt' });
            } else {
                if (stack.length < 2) { frames.push({ arr: [...stack], activeIdx: -1, msg: `Error: Not enough operands for operator '${token}'` }); break; }
                let b = stack.pop();
                let a = stack.pop();
                
                let op1 = isPrefix ? b : a;
                let op2 = isPrefix ? a : b;
                
                frames.push({ arr: [...stack], activeIdx: -1, msg: `Read operator '${token}'. Pop ${op2} and ${op1}.`, activeLineText: 'stack.pop()' });
                let res = 0;
                if(token === '+') res = op1 + op2;
                if(token === '-') res = op1 - op2;
                if(token === '*') res = op1 * op2;
                if(token === '/') res = Math.floor(op1 / op2);
                stack.push(res);
                frames.push({ arr: [...stack], activeIdx: stack.length-1, msg: `Calculated ${op1} ${token} ${op2} = ${res}. Push result.`, activeLineText: 'switch(token)' });
            }
        }
        setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(stack); setInputValue(''); triggerFocus();
    }
    setOperationsLog(prev => [...prev, { op: 'evaluateExpression', val: `"${inputValue}"` }]);
  };

  const evaluateBrackets = () => {
    let exp = inputValue.trim();
    if(exp.length === 0) return;
    let frames = [];
    let stack = [];
    
    frames.push({ arr: [...stack], activeIdx: -1, msg: `Start Bracket Evaluation: ${exp}`, activeLineText: 'isBalanced' });
    
    let balanced = true;
    for(let i=0; i<exp.length; i++) {
        let char = exp[i];
        if (['(', '{', '['].includes(char)) {
            stack.push(char);
            frames.push({ arr: [...stack], activeIdx: stack.length-1, msg: `Character '${char}' is opening. Push to Stack.`, activeLineText: 's.push' });
        } else if ([')', '}', ']'].includes(char)) {
            if (stack.length === 0) {
                balanced = false;
                frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' is closing, but Stack is empty! Mismatch.`, activeLineText: 's.isEmpty' });
                break;
            }
            let top = stack[stack.length - 1];
            if ((char === ')' && top === '(') || (char === '}' && top === '{') || (char === ']' && top === '[')) {
                stack.pop();
                frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' matches top '${top}'. Pop from Stack.`, activeLineText: 's.pop' });
            } else {
                balanced = false;
                frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' mismatches top '${top}'! Unbalanced.`, activeLineText: 'mismatch' });
                break;
            }
        } else {
            frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' is not a bracket. Ignore.`, activeLineText: 'continue' });
        }
    }
    
    if (balanced && stack.length === 0) {
        frames.push({ arr: [...stack], activeIdx: -1, msg: `All characters scanned. Stack is empty. Balanced!` });
    } else if (balanced && stack.length > 0) {
        frames.push({ arr: [...stack], activeIdx: -1, msg: `All characters scanned. Stack is not empty. Unbalanced!` });
    }
    
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(stack); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'isBalanced', val: `"${exp}"` }]);
  };

  const infixToPostfix = () => {
    let exp = inputValue.trim();
    if(exp.length === 0) return;
    let tokens = exp.includes(' ') ? exp.split(/\s+/) : exp.replace(/\s+/g, '').split('');
    let frames = [];
    let stack = [];
    let output = [];
    
    frames.push({ arr: [...stack], activeIdx: -1, output: '', msg: `Start Infix to Postfix: ${exp}`, activeLineText: 'infixToPostfix' });
    
    const precedence = (op) => {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        if (op === '^') return 3;
        return -1;
    };
    
    for (let i = 0; i < tokens.length; i++) {
        let t = tokens[i];
        if (/[a-zA-Z0-9]/.test(t)) {
            output.push(t);
            frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Read operand '${t}' ➔ append to output. Output: ${output.join(' ')}`, activeLineText: 'result.append' });
        } else if (t === '(') {
            stack.push(t);
            frames.push({ arr: [...stack], activeIdx: stack.length - 1, output: output.join(' '), msg: `Read '(' ➔ push to Stack. Output: ${output.join(' ')}`, activeLineText: 'stack.push' });
        } else if (t === ')') {
            frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Read ')' ➔ pop until '(' is found. Output: ${output.join(' ')}` });
            while (stack.length && stack[stack.length - 1] !== '(') {
                let op = stack.pop();
                output.push(op);
                frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Pop operator '${op}' to output. Output: ${output.join(' ')}`, activeLineText: 'result.append(stack.pop' });
            }
            if (stack.length && stack[stack.length - 1] === '(') {
                stack.pop();
                frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Discard '(' from Stack. Output: ${output.join(' ')}`, activeLineText: 'stack.pop()' });
            }
        } else {
            frames.push({ arr: [...stack], activeIdx: stack.length > 0 ? stack.length - 1 : -1, output: output.join(' '), msg: `Read operator '${t}' ➔ pop higher/equal precedence. Output: ${output.join(' ')}` });
            while (stack.length && precedence(stack[stack.length - 1]) >= precedence(t)) {
                let op = stack.pop();
                output.push(op);
                frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Pop '${op}' (precedence ${precedence(op)} >= ${precedence(t)}) to output. Output: ${output.join(' ')}`, activeLineText: 'result.append(stack.pop' });
            }
            stack.push(t);
            frames.push({ arr: [...stack], activeIdx: stack.length - 1, output: output.join(' '), msg: `Push operator '${t}' to Stack. Output: ${output.join(' ')}`, activeLineText: 'stack.push' });
        }
    }
    
    if (stack.length > 0) {
        frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Scanned all tokens. Pop remaining operators. Output: ${output.join(' ')}` });
        while (stack.length) {
            let op = stack.pop();
            output.push(op);
            frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Pop '${op}' to output. Output: ${output.join(' ')}`, activeLineText: 'stack.pop' });
        }
    }
    
    let finalResult = output.join(' ');
    frames.push({ arr: [...stack], activeIdx: -1, output: finalResult, msg: `Conversion complete! Postfix: ${finalResult}` });
    
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(stack); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'infixToPostfix', val: `"${exp}"` }]);
  };

  const infixToPrefix = () => {
    let exp = inputValue.trim();
    if(exp.length === 0) return;
    let tokens = exp.includes(' ') ? exp.split(/\s+/) : exp.replace(/\s+/g, '').split('');
    let frames = [];
    
    let revTokens = [];
    for (let i = tokens.length - 1; i >= 0; i--) {
        let t = tokens[i];
        if (t === '(') revTokens.push(')');
        else if (t === ')') revTokens.push('(');
        else revTokens.push(t);
    }
    
    frames.push({ arr: [], activeIdx: -1, output: '', msg: `Reverse expression & swap brackets: ${revTokens.join(' ')}`, activeLineText: 'infixToPrefix' });
    
    let stack = [];
    let output = [];
    
    const precedence = (op) => {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        if (op === '^') return 3;
        return -1;
    };
    
    for (let i = 0; i < revTokens.length; i++) {
        let t = revTokens[i];
        if (/[a-zA-Z0-9]/.test(t)) {
            output.push(t);
            frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Read operand '${t}'. Add to output. Output: ${output.join(' ')}`, activeLineText: 'postfixLike.append' });
        } else if (t === '(') {
            stack.push(t);
            frames.push({ arr: [...stack], activeIdx: stack.length - 1, output: output.join(' '), msg: `Read '(' ➔ push to Stack. Output: ${output.join(' ')}`, activeLineText: 'stack.push' });
        } else if (t === ')') {
            frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Read ')' ➔ pop until '(' is found. Output: ${output.join(' ')}` });
            while (stack.length && stack[stack.length - 1] !== '(') {
                let op = stack.pop();
                output.push(op);
                frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Pop operator '${op}' to output. Output: ${output.join(' ')}` });
            }
            if (stack.length && stack[stack.length - 1] === '(') {
                stack.pop();
                frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Discard '(' from Stack. Output: ${output.join(' ')}` });
            }
        } else {
            frames.push({ arr: [...stack], activeIdx: stack.length > 0 ? stack.length - 1 : -1, output: output.join(' '), msg: `Read operator '${t}' ➔ pop STRICTLY higher precedence. Output: ${output.join(' ')}` });
            while (stack.length && precedence(stack[stack.length - 1]) > precedence(t)) {
                let op = stack.pop();
                output.push(op);
                frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Pop '${op}' (precedence ${precedence(op)} > ${precedence(t)}) to output. Output: ${output.join(' ')}` });
            }
            stack.push(t);
            frames.push({ arr: [...stack], activeIdx: stack.length - 1, output: output.join(' '), msg: `Push operator '${t}' to Stack. Output: ${output.join(' ')}` });
        }
    }
    
    if (stack.length > 0) {
        frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Scanned reversed expression. Pop remaining operators. Output: ${output.join(' ')}` });
        while (stack.length) {
            let op = stack.pop();
            output.push(op);
            frames.push({ arr: [...stack], activeIdx: -1, output: output.join(' '), msg: `Pop '${op}' to output. Output: ${output.join(' ')}` });
        }
    }
    
    let reversedOutput = [...output].reverse();
    frames.push({ arr: [], activeIdx: -1, output: reversedOutput.join(' '), msg: `Reverse postfix-like output [${output.join(' ')}] to get prefix.` });
    let finalResult = reversedOutput.join(' ');
    frames.push({ arr: [], activeIdx: -1, output: finalResult, msg: `Conversion complete! Prefix: ${finalResult}` });
    
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(stack); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'infixToPrefix', val: `"${exp}"` }]);
  };

  const checkEquationBalance = () => {
    let exp = inputValue.trim();
    if(exp.length === 0) return;
    let frames = [];
    let stack = [];
    
    frames.push({ arr: [...stack], activeIdx: -1, msg: `Start Bracket Check: ${exp}`, activeLineText: 'isBalanced' });
    
    let balanced = true;
    for(let i=0; i<exp.length; i++) {
        let char = exp[i];
        if (['(', '{', '['].includes(char)) {
            stack.push(char);
            frames.push({ arr: [...stack], activeIdx: stack.length - 1, msg: `Character '${char}' is opening. Push to Stack.`, activeLineText: 's.push' });
        } else if ([')', '}', ']'].includes(char)) {
            if (stack.length === 0) {
                balanced = false;
                frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' is closing, but Stack is empty! Mismatch.`, activeLineText: 's.isEmpty' });
                break;
            }
            let top = stack[stack.length - 1];
            if ((char === ')' && top === '(') || (char === '}' && top === '{') || (char === ']' && top === '[')) {
                stack.pop();
                frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' matches top '${top}'. Pop from Stack.`, activeLineText: 's.pop' });
            } else {
                balanced = false;
                frames.push({ arr: [...stack], activeIdx: stack.length - 1, msg: `Character '${char}' mismatches top '${top}'! Unbalanced.`, activeLineText: 'mismatch' });
                break;
            }
        } else {
            frames.push({ arr: [...stack], activeIdx: -1, msg: `Character '${char}' is not a bracket. Skip.`, activeLineText: 'continue' });
        }
    }
    
    if (balanced && stack.length === 0) {
        frames.push({ arr: [...stack], activeIdx: -1, msg: `All characters scanned. Stack is empty. Balanced!` });
    } else if (balanced && stack.length > 0) {
        frames.push({ arr: [...stack], activeIdx: -1, msg: `All characters scanned. Stack is not empty. Unbalanced!` });
    }
    
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(stack); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'isBalanced', val: `"${exp}"` }]);
  };

  // Operations for Queue
  const queueEnqueue = (front = false) => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    if (dsVariety === 'QUEUE_CIRCULAR') {
      let state = timeline.length > 0 ? timeline[timeline.length-1].cq : cqState;
      let { arr, f, r } = state;
      if ((r + 1) % 5 === f) { alert('Circular Queue Overflow'); return; }
      let newF = f === -1 ? 0 : f;
      let newR = (r + 1) % 5;
      let newArr = [...arr];
      newArr[newR] = val;
      frames.push({ cq: { arr: [...arr], f, r }, activeIdx: newR, msg: `Calculate Rear index: (${r}+1)%5 = ${(r+1)%5}`, activeLineText: '(rear + 1) % size' });
      frames.push({ cq: { arr: newArr, f: newF, r: newR }, activeIdx: newR, msg: `Inserted ${val} at Rear`, activeLineText: 'arr[rear] = val' });
      setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setCqState({ arr: newArr, f: newF, r: newR }); setInputValue('');
      setOperationsLog(prev => [...prev, { op: 'enqueue', val }]);
    } else {
      let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
      frames.push({ arr: [...currentArr], activeIdx: -1, msg: front ? `Preparing to enqueue ${val} at Front` : `Preparing to enqueue ${val} at Rear`, activeLineText: 'rear == capacity - 1' });
      let newArr = front ? [val, ...currentArr] : [...currentArr, val];
      if (dsVariety === 'QUEUE_PRIORITY') {
        frames.push({ arr: newArr, activeIdx: newArr.indexOf(val), msg: `Appended ${val}, sorting by Priority...`, activeLineText: 'pq.add(val)' });
        newArr = [...newArr].sort((a,b) => a - b);
        frames.push({ arr: newArr, activeIdx: newArr.indexOf(val), msg: `Queue sorted. ${val} placed at correct priority level.` });
        setOperationsLog(prev => [...prev, { op: 'enqueue', val }]);
      } else {
        frames.push({ arr: newArr, activeIdx: front ? 0 : currentArr.length, msg: `${val} successfully enqueued.`, activeLineText: 'arr[++rear] =' });
        let opName = dsVariety === 'QUEUE_DEQUE' ? (front ? 'enqueueFront' : 'enqueueRear') : 'enqueue';
        setOperationsLog(prev => [...prev, { op: opName, val }]);
      }
      setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(newArr); setInputValue(''); triggerFocus();
    }
  };

  const queueDequeue = (rear = false) => {
    let frames = [];
    if (dsVariety === 'QUEUE_CIRCULAR') {
      let state = timeline.length > 0 ? timeline[timeline.length-1].cq : cqState;
      let { arr, f, r } = state;
      if (f === -1) { alert('Circular Queue Underflow'); return; }
      let val = arr[f];
      frames.push({ cq: { arr: [...arr], f, r }, activeIdx: f, msg: `Identifying element ${val} at Front (${f})`, activeLineText: 'front == -1' });
      let newArr = [...arr];
      newArr[f] = null;
      let newF = f === r ? -1 : (f + 1) % 5;
      let newR = f === r ? -1 : r;
      frames.push({ cq: { arr: newArr, f: newF, r: newR }, activeIdx: -1, msg: `Dequeued ${val}. Front advances to ${newF}`, activeLineText: '(front + 1) % size' });
      setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setCqState({ arr: newArr, f: newF, r: newR }); triggerFocus();
      setOperationsLog(prev => [...prev, { op: 'dequeue' }]);
      setPoppedElements(prev => [...prev, { val, op: 'Dequeue', ds: 'Queue' }]);
    } else {
      let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
      if(currentArr.length === 0) { alert('Queue Underflow'); return; }
      let val = rear ? currentArr[currentArr.length-1] : currentArr[0];
      frames.push({ arr: [...currentArr], activeIdx: rear ? currentArr.length-1 : 0, msg: `Identify element ${val} to Dequeue from ${rear ? 'Rear' : 'Front'}`, activeLineText: 'front > rear' });
      let newArr = rear ? currentArr.slice(0, -1) : currentArr.slice(1);
      frames.push({ arr: newArr, activeIdx: -1, msg: `Successfully dequeued ${val}. Remaining elements shift.`, activeLineText: 'return arr[front++]' });
      setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(newArr); triggerFocus();
      let opName = dsVariety === 'QUEUE_DEQUE' ? (rear ? 'dequeueRear' : 'dequeueFront') : 'dequeue';
      setOperationsLog(prev => [...prev, { op: opName }]);
      setPoppedElements(prev => [...prev, { val, op: opName === 'dequeueFront' ? 'Deq Front' : (opName === 'dequeueRear' ? 'Deq Rear' : 'Dequeue'), ds: 'Queue' }]);
    }
  };

  const queueSearch = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    
    if (dsVariety === 'QUEUE_CIRCULAR') {
      let state = timeline.length > 0 ? timeline[timeline.length-1].cq : cqState;
      let { arr, f, r } = state;
      frames.push({ cq: { arr: [...arr], f, r }, activeIdx: -1, msg: `Searching Circular Queue for ${val}...`, activeLineText: 'search' });
      if (f === -1) {
        frames.push({ cq: { arr: [...arr], f, r }, activeIdx: -1, msg: `Queue is empty. Value ${val} not found.` });
      } else {
        let i = f;
        let found = false;
        let visited = [];
        while (true) {
          visited.push(i);
          if (arr[i] === val) {
            found = true;
            break;
          }
          if (i === r) break;
          i = (i + 1) % 5;
        }

        for (let idx = 0; idx < visited.length; idx++) {
          let currIdx = visited[idx];
          let isLast = idx === visited.length - 1;
          frames.push({
            cq: { arr: [...arr], f, r },
            activeIdx: currIdx,
            msg: (isLast && found) ? `Found ${val} at index ${currIdx}!` : `Checking index ${currIdx} ➔ ${arr[currIdx]} != ${val}`,
            activeLineText: 'arr[i] == val'
          });
        }
        if (!found) {
          frames.push({ cq: { arr: [...arr], f, r }, activeIdx: -1, msg: `Value ${val} not found in Circular Queue.` });
        }
      }
      setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
      setOperationsLog(prev => [...prev, { op: 'search', val }]);
    } else {
      let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
      frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Searching Queue for ${val}...`, activeLineText: 'search' });
      let foundIdx = currentArr.indexOf(val);
      if (foundIdx === -1) {
        for (let i = 0; i < currentArr.length; i++) {
          frames.push({ arr: [...currentArr], activeIdx: i, msg: `Checking index ${i} (front+${i}) ➔ ${currentArr[i]} != ${val}`, activeLineText: 'arr[i] == val' });
        }
        frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Value ${val} not found in Queue.` });
      } else {
        for (let i = 0; i <= foundIdx; i++) {
          frames.push({
            arr: [...currentArr],
            activeIdx: i,
            msg: i === foundIdx ? `Found ${val} at index ${i} (front+${i})!` : `Checking index ${i} (front+${i}) ➔ ${currentArr[i]} != ${val}`,
            activeLineText: 'arr[i] == val'
          });
        }
      }
      setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
      setOperationsLog(prev => [...prev, { op: 'search', val }]);
    }
  };

  // Operations for Singly Linked List
  const sllInsertTail = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Instantiating new Node(${val})`, activeLineText: 'Node newNode = new Node' });
    frames.push({ arr: [...currentArr, val], activeIdx: currentArr.length, msg: `Node(${val}) successfully linked at Tail`, activeLineText: 'temp.next = newNode' });
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements([...currentArr, val]); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'insertTail', val }]);
  };

  const sllInsertHead = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Instantiating new Node(${val})`, activeLineText: 'Node newNode = new Node' });
    frames.push({ arr: [val, ...currentArr], activeIdx: 0, msg: `Node(${val}) linked as new Head`, activeLineText: 'head = newNode' });
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements([val, ...currentArr]); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'insertHead', val }]);
  };
  
  const sllDeleteValue = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    let frames = [];
    let foundIdx = currentArr.indexOf(val);
    frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Searching Linked List for ${val}...`, activeLineText: 'head == null' });
    if (foundIdx === -1) {
        frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Value ${val} not found.` });
        setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); return;
    }
    for(let i=0; i<=foundIdx; i++){
        frames.push({ arr: [...currentArr], activeIdx: i, msg: i === foundIdx ? `Found ${val} at Node index ${i}!` : `Traversing... checking Node index ${i}`, activeLineText: 'while (temp.next !=' });
    }
    let newArr = currentArr.filter((_, idx) => idx !== foundIdx);
    frames.push({ arr: newArr, activeIdx: -1, msg: `Unlinked Node(${val}) and reconnected pointers.`, activeLineText: 'temp.next = temp.next.next' });
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setElements(newArr); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'deleteValue', val }]);
    setPoppedElements(prev => [...prev, { val, op: 'Delete', ds: 'Linked List' }]);
  };

  const sllSearch = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let currentArr = timeline.length > 0 ? timeline[timeline.length-1].arr : elements;
    let frames = [];
    let foundIdx = currentArr.indexOf(val);
    frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Search: Searching Linked List for ${val}...`, activeLineText: 'search' });
    if (foundIdx === -1) {
        for(let i=0; i<currentArr.length; i++){
            frames.push({ arr: [...currentArr], activeIdx: i, msg: `Checking index ${i} ➔ ${currentArr[i]} != ${val}`, activeLineText: 't = t.next' });
        }
        frames.push({ arr: [...currentArr], activeIdx: -1, msg: `Value ${val} not found in Linked List.` });
    } else {
        for(let i=0; i<=foundIdx; i++){
            frames.push({ arr: [...currentArr], activeIdx: i, msg: i === foundIdx ? `Found ${val} at index ${i}!` : `Checking index ${i} ➔ ${currentArr[i]} != ${val}`, activeLineText: 't = t.next' });
        }
    }
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'search', val }]);
  };

  const getHashInfo = (val, size, variety) => {
    let absVal = Math.abs(val);
    let bucket = 0;
    let h_k = '';

    if (variety === 'HASH_MULTIPLICATION') {
      const A = 0.6180339887;
      const frac = (absVal * A) % 1;
      bucket = Math.floor(size * frac);
      h_k = `h(${val}) = ⌊${size} × ((${absVal} × 0.618034) mod 1)⌋ = ${bucket}`;
    } else if (variety === 'HASH_FOLDING') {
      const str = absVal.toString();
      const parts = [];
      for (let k = 0; k < str.length; k += 2) {
        parts.push(parseInt(str.substring(k, Math.min(k + 2, str.length)), 10));
      }
      const sum = parts.reduce((a, b) => a + b, 0);
      bucket = sum % size;
      h_k = `h(${val}) = (${parts.join(' + ')}) % ${size} = ${sum} % ${size} = ${bucket}`;
    } else {
      bucket = absVal % size;
      h_k = `h(${val}) = ${absVal} % ${size} = ${bucket}`;
    }
    return { absVal, bucket, h_k };
  };

  const getProbeInfo = (bucket, i, size, variety) => {
    let probeBucket = 0;
    let formula = '';
    if (variety === 'HASH_QUADRATIC') {
      probeBucket = (bucket + i * i) % size;
      formula = `(${bucket} + ${i}²) % ${size} = ${probeBucket}`;
    } else {
      probeBucket = (bucket + i) % size;
      formula = `(${bucket} + ${i}) % ${size} = ${probeBucket}`;
    }
    return { probeBucket, formula };
  };

  // Operations for Hash Table
  const hashInsert = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let ht = timeline.length > 0 ? timeline[timeline.length-1].ht : hashTable;
    
    let { bucket, h_k } = getHashInfo(val, tableSize, dsVariety);
    
    let currHt;
    let inserted = false;
    let duplicate = false;
    
    if (dsVariety === 'HASH_CHAINING') {
      let safeHt = Array.isArray(ht) && Array.isArray(ht[0]) ? ht : Array.from({length: tableSize}, () => []);
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: -1, activeNode: -1, msg: `Compute Hash: ${h_k}`, activeLineText: 'key % tableSize' });
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `Accessing Bucket ${bucket}`, activeLineText: 'table[index].contains(key)' });
      
      currHt = safeHt.map(b => [...b]);
      if(!currHt[bucket].includes(val)) {
          currHt[bucket].push(val);
          frames.push({ ht: currHt.map(b => [...b]), activeBucket: bucket, activeNode: currHt[bucket].length - 1, msg: `Inserted ${val} into Bucket ${bucket} chain.`, activeLineText: 'table[index].add(key)' });
          inserted = true;
      } else {
          duplicate = true;
          frames.push({ ht: currHt.map(b => [...b]), activeBucket: bucket, activeNode: currHt[bucket].indexOf(val), msg: `Collision! ${val} already exists in chain.`, isCollision: true });
      }
    } else {
      let safeHt = Array.isArray(ht) && ht.length === tableSize && !Array.isArray(ht[0]) ? ht : Array(tableSize).fill(null);
      currHt = [...safeHt];
      frames.push({ ht: [...currHt], activeBucket: -1, msg: `Compute Hash: ${h_k}`, activeLineText: 'key % size' });
      
      let i = 0;
      while (i < tableSize) {
        let { probeBucket, formula } = getProbeInfo(bucket, i, tableSize, dsVariety);
        frames.push({ ht: [...currHt], activeBucket: probeBucket, msg: `Probing slot ${probeBucket} ➔ Formula: ${formula}`, activeLineText: 'int probe =' });
        
        if (currHt[probeBucket] === null || currHt[probeBucket] === 'TOMBSTONE') {
          currHt[probeBucket] = val;
          frames.push({ ht: [...currHt], activeBucket: probeBucket, msg: `Inserted ${val} at slot ${probeBucket}`, activeLineText: 'table[probe] = key' });
          inserted = true;
          break;
        } else if (currHt[probeBucket] === val) {
          duplicate = true;
          frames.push({ ht: [...currHt], activeBucket: probeBucket, msg: `Collision! ${val} already exists at slot ${probeBucket}`, isCollision: true, activeLineText: 'table[probe] == key' });
          inserted = true;
          break;
        } else {
          frames.push({ ht: [...currHt], activeBucket: probeBucket, msg: `Collision! Slot ${probeBucket} is occupied by ${currHt[probeBucket] === 'TOMBSTONE' ? 'DEL' : currHt[probeBucket]}`, isCollision: true });
        }
        i++;
      }
      if (!inserted) {
        frames.push({ ht: [...currHt], activeBucket: -1, msg: `Table Overflow! Cannot insert ${val}` });
      }
    }
    
    if (inserted && !duplicate) {
      setOperationsLog(prev => [...prev, { op: 'insert', val }]);
    }
    setHashTable(currHt);
    
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
    setInputValue('');
    triggerFocus();
  };

  const hashSearch = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let ht = timeline.length > 0 ? timeline[timeline.length-1].ht : hashTable;
    let { bucket, h_k } = getHashInfo(val, tableSize, dsVariety);
    
    if (dsVariety === 'HASH_CHAINING') {
      let safeHt = Array.isArray(ht) && Array.isArray(ht[0]) ? ht : Array.from({length: tableSize}, () => []);
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: -1, activeNode: -1, msg: `Search: Compute Hash ➔ ${h_k}`, activeLineText: 'key % tableSize' });
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `Scanning Bucket ${bucket} chain...`, activeLineText: 'table[index].contains' });
      
      let nodeIdx = safeHt[bucket].indexOf(val);
      if(nodeIdx !== -1) {
          frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: nodeIdx, msg: `Found ${val} in Bucket ${bucket}!` });
      } else {
          frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `${val} not found in Bucket ${bucket}.` });
      }
    } else {
      let safeHt = Array.isArray(ht) && ht.length === tableSize && !Array.isArray(ht[0]) ? ht : Array(tableSize).fill(null);
      frames.push({ ht: [...safeHt], activeBucket: -1, msg: `Search: Compute Hash ➔ ${h_k}`, activeLineText: 'key % size' });
      let i = 0;
      let found = false;
      while (i < tableSize) {
        let { probeBucket, formula } = getProbeInfo(bucket, i, tableSize, dsVariety);
        frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Checking slot ${probeBucket} ➔ Formula: ${formula}`, activeLineText: 'int probe =' });
        
        if (safeHt[probeBucket] === val) {
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Found ${val} at slot ${probeBucket}!`, activeLineText: 'table[probe] == key' });
          found = true;
          break;
        } else if (safeHt[probeBucket] === null) {
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Slot ${probeBucket} is empty. Terminating search.`, activeLineText: 'table[probe] == null' });
          break;
        }
        i++;
      }
      if (!found) {
        frames.push({ ht: [...safeHt], activeBucket: -1, msg: `${val} not found in Table.` });
      }
    }
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
    setOperationsLog(prev => [...prev, { op: 'search', val }]);
  };

  const hashDelete = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let ht = timeline.length > 0 ? timeline[timeline.length-1].ht : hashTable;
    let { bucket, h_k } = getHashInfo(val, tableSize, dsVariety);
    
    if (dsVariety === 'HASH_CHAINING') {
      let safeHt = ht.map(b => [...b]);
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: -1, activeNode: -1, msg: `Delete: Compute Hash ➔ ${h_k}`, activeLineText: 'key % tableSize' });
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `Scanning Bucket ${bucket}`, activeLineText: 'table[index].remove' });
      
      let nodeIdx = safeHt[bucket].indexOf(val);
      if(nodeIdx !== -1) {
          frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: nodeIdx, msg: `Found ${val} in Bucket ${bucket}!` });
          safeHt[bucket] = safeHt[bucket].filter(v => v !== val);
          frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `Deleted ${val} and updated chain pointers.` });
          setOperationsLog(prev => [...prev, { op: 'delete', val }]);
          setPoppedElements(prev => [...prev, { val, op: 'Delete', ds: 'Hash Table' }]);
      } else {
          frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `${val} not found in Bucket ${bucket}.` });
      }
      setHashTable(safeHt);
    } else {
      let safeHt = [...ht];
      frames.push({ ht: [...safeHt], activeBucket: -1, msg: `Delete: Compute Hash ➔ ${h_k}`, activeLineText: 'key % size' });
      let i = 0;
      let found = false;
      while (i < tableSize) {
        let { probeBucket, formula } = getProbeInfo(bucket, i, tableSize, dsVariety);
        frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Checking slot ${probeBucket} ➔ Formula: ${formula}`, activeLineText: 'int probe =' });
        
        if (safeHt[probeBucket] === val) {
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Found ${val} at slot ${probeBucket}!`, activeLineText: 'table[probe] == key' });
          safeHt[probeBucket] = 'TOMBSTONE'; // Mark as DELETED
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Slot ${probeBucket} marked as DELETED (Tombstone).`, activeLineText: 'table[probe] = -1' });
          found = true;
          setOperationsLog(prev => [...prev, { op: 'delete', val }]);
          setPoppedElements(prev => [...prev, { val, op: 'Delete', ds: 'Hash Table' }]);
          break;
        } else if (safeHt[probeBucket] === null) {
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Slot ${probeBucket} is empty. Terminating search.`, activeLineText: 'table[probe] == null' });
          break;
        }
        i++;
      }
      if (!found) {
        frames.push({ ht: [...safeHt], activeBucket: -1, msg: `${val} not found in Table.` });
      }
      setHashTable(safeHt);
    }
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
  };

  const runPolynomialAdd = () => {
    const pA = parsePolynomial(polyAInput);
    const pB = parsePolynomial(polyBInput);
    setPolyA(pA);
    setPolyB(pB);
    
    const frames = [];
    const result = [];
    
    let i = 0, j = 0;
    frames.push({
      polyA: pA,
      polyB: pB,
      polyResult: [],
      activeIdxA: 0,
      activeIdxB: 0,
      msg: `Start polynomial addition: Pointers set to heads of Poly A and Poly B.`,
      activeLineText: 'addPolynomials'
    });
    
    while (i < pA.length || j < pB.length) {
      const termA = pA[i];
      const termB = pB[j];
      
      if (termA && (!termB || termA.exp > termB.exp)) {
        result.push({ ...termA });
        frames.push({
          polyA: pA,
          polyB: pB,
          polyResult: [...result],
          activeIdxA: i,
          activeIdxB: j < pB.length ? j : -1,
          activeIdxResult: result.length - 1,
          msg: `Poly A term has higher exponent (${termA.exp} > ${termB ? termB.exp : -1}). Copy ${termA.coeff}x^${termA.exp} to result.`,
          activeLineText: 'pA.exp > pB.exp'
        });
        i++;
      } else if (termB && (!termA || termB.exp > termA.exp)) {
        result.push({ ...termB });
        frames.push({
          polyA: pA,
          polyB: pB,
          polyResult: [...result],
          activeIdxA: i < pA.length ? i : -1,
          activeIdxB: j,
          activeIdxResult: result.length - 1,
          msg: `Poly B term has higher exponent (${termB.exp} > ${termA ? termA.exp : -1}). Copy ${termB.coeff}x^${termB.exp} to result.`,
          activeLineText: 'pB.exp > pA.exp'
        });
        j++;
      } else if (termA && termB && termA.exp === termB.exp) {
        const sumCoeff = termA.coeff + termB.coeff;
        if (sumCoeff !== 0) {
          result.push({ coeff: sumCoeff, exp: termA.exp });
        }
        frames.push({
          polyA: pA,
          polyB: pB,
          polyResult: [...result],
          activeIdxA: i,
          activeIdxB: j,
          activeIdxResult: sumCoeff !== 0 ? result.length - 1 : -1,
          msg: `Exponents match (${termA.exp} === ${termB.exp}). Add coefficients: ${termA.coeff} + ${termB.coeff} = ${sumCoeff}. ${sumCoeff !== 0 ? `Add ${sumCoeff}x^${termA.exp} to result.` : 'Coefficients cancel out, no term added.'}`,
          activeLineText: 'pA.exp == pB.exp'
        });
        i++;
        j++;
      }
    }
    
    frames.push({
      polyA: pA,
      polyB: pB,
      polyResult: [...result],
      activeIdxA: -1,
      activeIdxB: -1,
      msg: `Polynomial addition completed.`,
      activeLineText: 'return result'
    });
    
    setPolyResult(result);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
    setOperationsLog(prev => [...prev, { op: 'addPolynomials', val: `"${polyAInput}", "${polyBInput}"` }]);
  };

  const runPolynomialMult = () => {
    const pA = parsePolynomial(polyAInput);
    const pB = parsePolynomial(polyBInput);
    setPolyA(pA);
    setPolyB(pB);
    
    const frames = [];
    const result = [];
    
    frames.push({
      polyA: pA,
      polyB: pB,
      polyResult: [],
      activeIdxA: 0,
      activeIdxB: 0,
      msg: `Start polynomial multiplication: Multiply each term of Poly A by each term of Poly B.`,
      activeLineText: 'multiplyPolynomials'
    });
    
    for (let i = 0; i < pA.length; i++) {
      const termA = pA[i];
      for (let j = 0; j < pB.length; j++) {
        const termB = pB[j];
        const newCoeff = termA.coeff * termB.coeff;
        const newExp = termA.exp + termB.exp;
        
        frames.push({
          polyA: pA,
          polyB: pB,
          polyResult: [...result.map(t => ({ ...t }))],
          activeIdxA: i,
          activeIdxB: j,
          msg: `Multiply Poly A term ${termA.coeff}x^${termA.exp} by Poly B term ${termB.coeff}x^${termB.exp} ➔ Result: ${newCoeff}x^${newExp}`,
          activeLineText: 'coeff = termA.coeff * termB.coeff'
        });
        
        let existingIdx = result.findIndex(t => t.exp === newExp);
        if (existingIdx !== -1) {
          result[existingIdx].coeff += newCoeff;
          frames.push({
            polyA: pA,
            polyB: pB,
            polyResult: [...result.map(t => ({ ...t }))],
            activeIdxA: i,
            activeIdxB: j,
            activeIdxResult: existingIdx,
            msg: `Exponent ${newExp} already exists in result. Add coefficients: new coeff = ${result[existingIdx].coeff}`,
            activeLineText: 'existing.coeff += newCoeff'
          });
        } else {
          result.push({ coeff: newCoeff, exp: newExp });
          result.sort((a, b) => b.exp - a.exp);
          let insertedIdx = result.findIndex(t => t.exp === newExp);
          frames.push({
            polyA: pA,
            polyB: pB,
            polyResult: [...result.map(t => ({ ...t }))],
            activeIdxA: i,
            activeIdxB: j,
            activeIdxResult: insertedIdx,
            msg: `Insert new term ${newCoeff}x^${newExp} in sorted order.`,
            activeLineText: 'insertSorted'
          });
        }
      }
    }
    
    const finalResult = result.filter(t => t.coeff !== 0);
    frames.push({
      polyA: pA,
      polyB: pB,
      polyResult: finalResult,
      activeIdxA: -1,
      activeIdxB: -1,
      msg: `Polynomial multiplication completed.`,
      activeLineText: 'return result'
    });
    
    setPolyResult(finalResult);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
    setOperationsLog(prev => [...prev, { op: 'multiplyPolynomials', val: `"${polyAInput}", "${polyBInput}"` }]);
  };

  const renderPolynomials = (frame) => {
    const pA = frame.polyA || polyA;
    const pB = frame.polyB || polyB;
    const pRes = frame.polyResult || polyResult;
    
    const renderList = (list, activeIdx, label, color) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <div style={{ fontSize: '0.85rem', color: color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', minHeight: '60px' }}>
            {list.length === 0 && <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>empty</span>}
            {list.map((term, idx) => {
              const isActive = idx === activeIdx;
              return (
                <React.Fragment key={idx}>
                  <div style={{
                    display: 'flex', 
                    border: isActive ? `2px solid ${color}` : '1px solid var(--glass-border)', 
                    borderRadius: '10px', 
                    overflow: 'hidden',
                    background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                    boxShadow: isActive ? `0 0 15px ${color}` : '0 4px 8px rgba(0,0,0,0.2)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}>
                    <div style={{ 
                      padding: '8px 12px', 
                      background: isActive ? color : 'var(--accent-primary)', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      fontSize: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px'
                    }}>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>coeff</span>
                      <span>{term.coeff}</span>
                    </div>
                    <div style={{ 
                      padding: '8px 12px', 
                      background: 'rgba(255,255,255,0.05)', 
                      color: 'var(--text-primary)', 
                      fontWeight: 'bold', 
                      fontSize: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px'
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>exp</span>
                      <span>{term.exp}</span>
                    </div>
                    <div style={{ 
                      padding: '8px 8px', 
                      background: 'rgba(255,255,255,0.02)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.7rem', 
                      borderLeft: '1px solid var(--glass-border)' 
                    }}>
                      •
                    </div>
                  </div>
                  {idx < list.length - 1 ? (
                    <svg width="24" height="12" style={{ overflow: 'visible' }}>
                      <defs>
                        <marker id={`arrow-${label}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill={isActive ? color : 'var(--text-secondary)'} />
                        </marker>
                      </defs>
                      <line x1="0" y1="6" x2="20" y2="6" stroke={isActive ? color : 'var(--text-secondary)'} strokeWidth="2" markerEnd={`url(#arrow-${label})`} />
                    </svg>
                  ) : (
                    <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '1.5rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {renderList(pA, frame.activeIdxA, 'Polynomial A', '#3b82f6')}
        {renderList(pB, frame.activeIdxB, 'Polynomial B', '#a855f7')}
        <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }} />
        {renderList(pRes, frame.activeIdxResult, 'Result Polynomial', '#10b981')}
      </div>
    );
  };

  // RENDERERS
  const renderStack = (frame) => {
    const arr = frame.arr || [];
    const showOutput = dsVariety === 'STACK_CONVERSION' && frame.output !== undefined;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '1rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '4px', position: 'relative', minHeight: '220px', width: '160px', paddingBottom: '10px', justifyContent: 'flex-start' }}>
          <div style={{ position: 'absolute', bottom: '10px', width: '100%', height: 'calc(100% - 10px)', borderLeft: '4px solid var(--glass-border)', borderRight: '4px solid var(--glass-border)', borderBottom: '4px solid var(--glass-border)', borderRadius: '0 0 12px 12px', pointerEvents: 'none', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.02))' }} />
          {arr.map((val, idx) => (
            <React.Fragment key={idx}>
              <div style={{
                width: '130px', height: '42px', background: idx === frame.activeIdx ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.1rem',
                boxShadow: idx === frame.activeIdx ? '0 0 20px rgba(245,158,11,0.8)' : '0 4px 10px rgba(0,0,0,0.3)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 2
              }}>
                {val}
              </div>
              {dsVariety === 'STACK_LL' && idx > 0 && (
                <div style={{ color: '#10b981', fontSize: '1.5rem', margin: '-4px 0', zIndex: 1, textShadow: '0 0 5px rgba(16,185,129,0.5)' }}>⬇</div>
              )}
            </React.Fragment>
          ))}
          {arr.length === 0 && <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', zIndex: 2, paddingBottom: '20px', marginTop: 'auto' }}>Stack is empty</div>}
        </div>
        
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {dsVariety === 'STACK_CONVERSION' ? 'Operator Stack' : (dsVariety === 'STACK_LL' ? 'Linked List Stack' : 'Array Stack')}
        </div>

        {showOutput && (
          <div style={{
            marginTop: '20px',
            width: '90%',
            maxWidth: '450px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Output Expression
            </span>
            <div style={{ 
              fontSize: '1.25rem', 
              fontFamily: "'Fira Code', monospace", 
              color: '#34d399', 
              fontWeight: 'bold', 
              letterSpacing: '1px',
              textAlign: 'center',
              wordBreak: 'break-all',
              textShadow: '0 0 8px rgba(52,211,153,0.2)'
            }}>
              {frame.output || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.95rem', fontWeight: 'normal' }}>empty</span>}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQueue = (frame) => {
    if (dsVariety === 'QUEUE_CIRCULAR') {
      const { arr, f, r } = frame.cq || { arr: Array(5).fill(null), f: -1, r: -1 };
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '2rem', flexWrap: 'wrap' }}>
          {arr.map((val, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold', height: '18px', textShadow: '0 0 5px rgba(251,191,36,0.5)' }}>
                {f === idx && r === idx ? 'F / R' : f === idx ? 'Front' : r === idx ? 'Rear' : ''}
              </div>
              <div style={{
                width: '70px', height: '70px', background: val !== null ? (idx === frame.activeIdx ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))') : 'rgba(255,255,255,0.03)',
                border: `2px solid ${idx === frame.activeIdx ? '#f59e0b' : 'var(--glass-border)'}`,
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.4rem',
                boxShadow: idx === frame.activeIdx ? '0 0 20px rgba(245,158,11,0.6)' : (val !== null ? '0 5px 15px rgba(0,0,0,0.4)' : 'none'), transition: 'all 0.4s ease'
              }}>
                {val !== null ? val : ''}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>idx: {idx}</div>
            </div>
          ))}
        </div>
      );
    }
    
    const arr = frame.arr || [];
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '2rem', flexWrap: 'nowrap', overflowX: 'auto', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '80px', transform: 'translateY(-50%)', borderTop: '3px solid var(--glass-border)', borderBottom: '3px solid var(--glass-border)', borderRadius: '0', pointerEvents: 'none' }} />
        <div style={{ padding: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 'bold', zIndex: 2 }}>
          {dsVariety === 'QUEUE_DEQUE' ? '⟷ Front' : 'Front Out ➔'}
        </div>
        {arr.map((val, idx) => (
          <div key={idx} style={{
            width: '65px', height: '65px', background: idx === frame.activeIdx ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.3rem',
            boxShadow: idx === frame.activeIdx ? '0 0 20px rgba(245,158,11,0.6)' : '0 5px 15px rgba(0,0,0,0.3)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', flexShrink: 0, zIndex: 2
          }}>
            {val}
          </div>
        ))}
        {arr.length === 0 && <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0 2rem', zIndex: 2 }}>Queue is empty</div>}
        <div style={{ padding: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 'bold', zIndex: 2 }}>
          {dsVariety === 'QUEUE_DEQUE' ? 'Rear ⟷' : '➔ Rear In'}
        </div>
      </div>
    );
  };

  const renderLinkedList = (frame) => {
    const arr = frame.arr || [];
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
        {arr.length === 0 && <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '1.1rem' }}>List is completely empty.</div>}
        {arr.map((val, idx) => (
          <React.Fragment key={idx}>
            <div style={{
              display: 'flex', border: '1px solid var(--glass-border)', borderRadius: '10px', overflow: 'hidden',
              boxShadow: idx === frame.activeIdx ? '0 0 25px rgba(16,185,129,0.8)' : '0 6px 12px rgba(0,0,0,0.4)',
              transform: idx === frame.activeIdx ? 'scale(1.15) translateY(-5px)' : 'scale(1)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              {dsVariety === 'LL_DOUBLY' && <div style={{ width: '22px', height: '45px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 'bold' }}>P</div>}
              <div style={{ width: '55px', height: '45px', background: idx === frame.activeIdx ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>{val}</div>
              <div style={{ width: '22px', height: '45px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 'bold' }}>N</div>
            </div>
            {idx < arr.length - 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <svg width="45" height="15" style={{ overflow: 'visible' }}>
                  <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill={idx === frame.activeIdx ? '#10b981' : 'var(--text-secondary)'} /></marker></defs>
                  <line x1="0" y1="7.5" x2="40" y2="7.5" stroke={idx === frame.activeIdx ? '#10b981' : 'var(--text-secondary)'} strokeWidth="2.5" markerEnd="url(#arrow)" />
                </svg>
                {dsVariety === 'LL_DOUBLY' && (
                  <svg width="45" height="15" style={{ overflow: 'visible' }}>
                    <defs><marker id="arrow-back" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 10 0 L 0 5 L 10 10 z" fill={idx === frame.activeIdx ? '#10b981' : 'var(--text-secondary)'} /></marker></defs>
                    <line x1="45" y1="7.5" x2="5" y2="7.5" stroke={idx === frame.activeIdx ? '#10b981' : 'var(--text-secondary)'} strokeWidth="2.5" markerEnd="url(#arrow-back)" />
                  </svg>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="45" height="15" style={{ overflow: 'visible' }}>
                  <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-secondary)" /></marker></defs>
                  <line x1="0" y1="7.5" x2="40" y2="7.5" stroke="var(--text-secondary)" strokeWidth="2.5" markerEnd="url(#arrow)" />
                </svg>
                {dsVariety === 'LL_CIRCULAR' ? (
                  <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontStyle: 'italic', fontWeight: 700 }}>⤾ Loops to Head</span>
                ) : <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>null</span>}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderHashTable = (frame) => {
    if (dsVariety === 'HASH_CHAINING') {
      let ht = frame.ht || Array.from({length: tableSize}, () => []);
      if (!Array.isArray(ht) || !Array.isArray(ht[0])) {
        ht = Array.from({length: tableSize}, () => []);
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem', alignItems: 'center', width: '100%', overflowY: 'auto' }}>
          {ht.map((bucket, bIdx) => (
            <div key={bIdx} ref={el => bucketRefs.current[bIdx] = el} style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '800px', background: bIdx === frame.activeBucket ? 'rgba(245,158,11,0.08)' : 'transparent', padding: '8px 12px', borderRadius: '12px', transition: 'background 0.3s' }}>
              <div style={{
                width: '65px', height: '55px', background: 'rgba(255,255,255,0.03)', border: `2px solid ${bIdx === frame.activeBucket ? '#f59e0b' : 'var(--glass-border)'}`,
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: bIdx === frame.activeBucket ? '#fbbf24' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '1.3rem', flexShrink: 0,
                boxShadow: bIdx === frame.activeBucket ? '0 0 15px rgba(245,158,11,0.5)' : 'none', transition: 'all 0.3s'
              }}>
                [{bIdx}]
              </div>
              <div style={{ margin: '0 15px', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>➔</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                {bucket.length === 0 && <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', opacity: 0.7 }}>empty</span>}
                {bucket.map((val, vIdx) => (
                  <React.Fragment key={vIdx}>
                     <div style={{
                       width: '50px', height: '50px', borderRadius: '50%', background: bIdx === frame.activeBucket && vIdx === frame.activeNode ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.1rem',
                       boxShadow: bIdx === frame.activeBucket && vIdx === frame.activeNode ? '0 0 20px rgba(16,185,129,0.8)' : '0 5px 10px rgba(0,0,0,0.3)', transform: bIdx === frame.activeBucket && vIdx === frame.activeNode ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                     }}>
                       {val}
                     </div>
                     {vIdx < bucket.length - 1 && <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 'bold' }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // PROBING (Single Array)
      const ht = frame.ht || Array(tableSize).fill(null);
      return (
        <div style={{ display: 'flex', gap: '15px', padding: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {ht.map((val, bIdx) => {
            const isTombstone = val === 'TOMBSTONE';
            return (
              <div key={bIdx} ref={el => bucketRefs.current[bIdx] = el} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: bIdx === frame.activeBucket ? '#fbbf24' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '1.1rem', transition: 'color 0.3s' }}>[{bIdx}]</span>
                <div style={{
                  width: '75px', height: '75px', 
                  background: val !== null ? (isTombstone ? 'rgba(239, 68, 68, 0.15)' : (bIdx === frame.activeBucket ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))')) : 'rgba(255,255,255,0.02)',
                  border: `2px solid ${bIdx === frame.activeBucket ? '#f59e0b' : (isTombstone ? '#ef4444' : 'var(--glass-border)')}`,
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: isTombstone ? '#f87171' : 'white', fontWeight: 'bold', fontSize: isTombstone ? '0.9rem' : '1.4rem',
                  boxShadow: bIdx === frame.activeBucket ? '0 0 25px rgba(245,158,11,0.6)' : (val !== null && !isTombstone ? '0 5px 15px rgba(0,0,0,0.3)' : 'none'), 
                  transform: 'scale(1)',
                  transition: 'all 0.1s ease'
                }}>
                  {val !== null ? (isTombstone ? 'DEL' : val) : ''}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const frame = timeline.length > 0 ? timeline[currentStep] : { arr: elements, ht: hashTable, activeIdx: -1, activeBucket: -1, activeNode: -1, msg: '' };
  
  let currentElements = [];
  if (dsType === 'STACK' || dsType === 'LINKED_LIST' || (dsType === 'QUEUE' && dsVariety !== 'QUEUE_CIRCULAR')) {
    currentElements = frame.arr || elements;
  } else if (dsType === 'QUEUE' && dsVariety === 'QUEUE_CIRCULAR') {
    let cq = frame.cq || cqState;
    if (cq.f !== -1) {
      let i = cq.f;
      while (true) {
        currentElements.push(cq.arr[i]);
        if (i === cq.r) break;
        i = (i + 1) % cq.arr.length;
      }
    }
  } else if (dsType === 'HASH_TABLE') {
    let ht = frame.ht || hashTable;
    if (dsVariety === 'HASH_CHAINING') {
      ht.forEach(bucket => {
        if (Array.isArray(bucket)) currentElements.push(...bucket);
      });
    } else {
      ht.forEach(val => {
        if (val !== null && val !== 'TOMBSTONE') currentElements.push(val);
      });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary, #0f172a)' }}>
      <header className="header-glass" style={{ padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <h2 className="title-gradient" style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>✨ General DSA Visualizer</h2>
        </div>
        
        <div className="controls-glass" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="styled-select" style={{ width: isMobile ? '120px' : '160px', fontWeight: 'bold' }} value={dsType} onChange={e => setDsType(e.target.value)} disabled={isPlaying}>
            <option value="LINKED_LIST">Linked List</option>
            <option value="QUEUE">Queue</option>
            <option value="HASH_TABLE">Hash Table</option>
            <option value="STACK">Stack</option>
          </select>

          <select className="styled-select" style={{ width: isMobile ? '130px' : '180px', fontWeight: 'bold' }} value={dsVariety} onChange={e => setDsVariety(e.target.value)} disabled={isPlaying}>
            {dsType === 'STACK' && <>
                <option value="STACK_ARRAY">Array Based</option>
                <option value="STACK_LL">Linked List Based</option>
                <option value="STACK_EXPRESSION">Expression Evaluator</option>
                <option value="STACK_BRACKETS">Bracket Evaluator</option>
                <option value="STACK_CONVERSION">Equation Converter</option>
            </>}
            {dsType === 'QUEUE' && <>
                <option value="QUEUE_SIMPLE">Simple Queue</option>
                <option value="QUEUE_CIRCULAR">Circular Queue</option>
                <option value="QUEUE_DEQUE">Deque (Double Ended)</option>
                <option value="QUEUE_PRIORITY">Priority Queue</option>
            </>}
            {dsType === 'LINKED_LIST' && <>
                <option value="LL_SINGLY">Singly Linked List</option>
                <option value="LL_DOUBLY">Doubly Linked List</option>
                <option value="LL_CIRCULAR">Circular Linked List</option>
                <option value="LL_POLYNOMIAL">Polynomial ADT</option>
            </>}
            {dsType === 'HASH_TABLE' && <>
                <option value="HASH_CHAINING">Separate Chaining</option>
                <option value="HASH_LINEAR">Linear Probing</option>
                <option value="HASH_QUADRATIC">Quadratic Probing</option>
                <option value="HASH_MULTIPLICATION">Multiplication Hashing</option>
                <option value="HASH_FOLDING">Folding Method Hashing</option>
            </>}
          </select>

          <div style={{ width: '1px', height: '26px', background: 'var(--glass-border)', margin: '0 8px' }} />
          
          {dsType === 'HASH_TABLE' && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold'}}>Table Size:</span>
                <input type="number" className="styled-input" style={{ width: '50px', opacity: isPlaying ? 0.7 : 1, fontSize: '0.9rem', fontWeight: 'bold', padding: '0.3rem' }} value={tableSize} onChange={e=>setTableSize(Math.max(1, parseInt(e.target.value)||7))} disabled={isPlaying}/>
             </div>
          )}

          {dsVariety === 'LL_POLYNOMIAL' ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <input type="text" className="styled-input" style={{ width: isMobile ? '95px' : '150px', fontSize: '0.9rem' }} placeholder="Poly A (e.g. 3x^2+2x+1)" value={polyAInput} onChange={e => setPolyAInput(e.target.value)} disabled={isPlaying}/>
               <select className="styled-select" style={{ width: '45px', padding: '0.3rem', fontSize: '0.9rem' }} value={polyOp} onChange={e => setPolyOp(e.target.value)} disabled={isPlaying}>
                 <option value="+">+</option>
                 <option value="*">*</option>
               </select>
               <input type="text" className="styled-input" style={{ width: isMobile ? '95px' : '150px', fontSize: '0.9rem' }} placeholder="Poly B (e.g. 4x^2+5)" value={polyBInput} onChange={e => setPolyBInput(e.target.value)} disabled={isPlaying}/>
               <button className="btn btn-insert" onClick={polyOp === '+' ? runPolynomialAdd : runPolynomialMult} disabled={isPlaying || !polyAInput || !polyBInput}>Compute</button>
             </div>
          ) : (
             <input ref={inputRef} type={(dsVariety === 'STACK_EXPRESSION' || dsVariety === 'STACK_BRACKETS' || dsVariety === 'STACK_CONVERSION') ? 'text' : 'number'} className="styled-input" style={{ width: isMobile ? '80px' : ((dsVariety === 'STACK_EXPRESSION' || dsVariety === 'STACK_BRACKETS' || dsVariety === 'STACK_CONVERSION') ? '180px' : '90px'), opacity: isPlaying ? 0.7 : 1, fontSize: '1rem', fontWeight: 'bold' }} placeholder={isMobile ? "Val" : (dsVariety === 'STACK_EXPRESSION' ? "e.g. 2 3 + 4 *" : dsVariety === 'STACK_BRACKETS' ? "e.g. {[()]}" : dsVariety === 'STACK_CONVERSION' ? "e.g. ( A + B ) * C" : "Value")} value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyDown={e => {
               if(e.key === 'Enter' && !isPlaying && inputValue) {
                 if(dsType==='STACK') {
                   if (dsVariety === 'STACK_EXPRESSION') evaluateExpression();
                   else if (dsVariety === 'STACK_BRACKETS') evaluateBrackets();
                   else if (dsVariety === 'STACK_CONVERSION') infixToPostfix();
                   else stackPush();
                 } else if(dsType==='QUEUE') queueEnqueue();
                 else if(dsType==='LINKED_LIST') sllInsertTail();
                 else if(dsType==='HASH_TABLE') hashInsert();
               }
             }} disabled={isPlaying}/>
          )}
          
          {dsType === 'STACK' && <>
            {(dsVariety === 'STACK_EXPRESSION' || dsVariety === 'STACK_BRACKETS') ? (
                <button className="btn btn-insert" onClick={dsVariety === 'STACK_EXPRESSION' ? evaluateExpression : evaluateBrackets} disabled={isPlaying || !inputValue}>Evaluate</button>
            ) : dsVariety === 'STACK_CONVERSION' ? (
                <>
                <button className="btn btn-insert" onClick={infixToPostfix} disabled={isPlaying || !inputValue}>To Postfix</button>
                <button className="btn btn-insert" style={{background: '#8b5cf6'}} onClick={infixToPrefix} disabled={isPlaying || !inputValue}>To Prefix</button>
                <button className="btn btn-insert" style={{background: '#ec4899'}} onClick={checkEquationBalance} disabled={isPlaying || !inputValue}>Check Balance</button>
                </>
            ) : (
                <>
                <button className="btn btn-insert" onClick={stackPush} disabled={isPlaying || !inputValue}>Push</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || elements.length===0 ? 0.5:1}} onClick={stackPop} disabled={isPlaying || elements.length===0}>Pop</button>
                <button className="btn btn-clear" style={{background: '#10b981', color:'white', border:'none', opacity: isPlaying || elements.length===0 || !inputValue ? 0.5:1}} onClick={stackSearch} disabled={isPlaying || elements.length===0 || !inputValue}>Search</button>
                </>
            )}
          </>}
          
          {dsType === 'QUEUE' && <>
            {dsVariety === 'QUEUE_DEQUE' ? (
              <>
                <button className="btn btn-insert" onClick={() => queueEnqueue(true)} disabled={isPlaying || !inputValue}>{isMobile ? '+F' : 'Enqueue Front'}</button>
                <button className="btn btn-insert" onClick={() => queueEnqueue(false)} disabled={isPlaying || !inputValue} style={{background: '#8b5cf6'}}>{isMobile ? '+R' : 'Enqueue Rear'}</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || elements.length===0 ? 0.5:1}} onClick={() => queueDequeue(false)} disabled={isPlaying || elements.length===0}>{isMobile ? '-F' : 'Dequeue Front'}</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || elements.length===0 ? 0.5:1}} onClick={() => queueDequeue(true)} disabled={isPlaying || elements.length===0}>{isMobile ? '-R' : 'Dequeue Rear'}</button>
                <button className="btn btn-clear" style={{background: '#10b981', color:'white', border:'none', opacity: isPlaying || elements.length===0 || !inputValue ? 0.5:1}} onClick={queueSearch} disabled={isPlaying || elements.length===0 || !inputValue}>{isMobile ? '🔍' : 'Search'}</button>
              </>
            ) : (
              <>
                <button className="btn btn-insert" onClick={() => queueEnqueue(false)} disabled={isPlaying || !inputValue}>Enqueue</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || (dsVariety==='QUEUE_CIRCULAR'?cqState.f===-1:elements.length===0) ? 0.5:1}} onClick={() => queueDequeue(false)} disabled={isPlaying || (dsVariety==='QUEUE_CIRCULAR'?cqState.f===-1:elements.length===0)}>Dequeue</button>
                <button className="btn btn-clear" style={{background: '#10b981', color:'white', border:'none', opacity: isPlaying || (dsVariety==='QUEUE_CIRCULAR'?cqState.f===-1:elements.length===0) || !inputValue ? 0.5:1}} onClick={queueSearch} disabled={isPlaying || (dsVariety==='QUEUE_CIRCULAR'?cqState.f===-1:elements.length===0) || !inputValue}>Search</button>
              </>
            )}
          </>}

          {dsType === 'LINKED_LIST' && dsVariety !== 'LL_POLYNOMIAL' && <>
            <button className="btn btn-insert" onClick={sllInsertHead} disabled={isPlaying || !inputValue}>{isMobile ? '+H' : 'Insert Head'}</button>
            <button className="btn btn-insert" onClick={sllInsertTail} disabled={isPlaying || !inputValue} style={{background: '#8b5cf6'}}>{isMobile ? '+T' : 'Insert Tail'}</button>
            <button className="btn btn-clear" style={{background: '#10b981', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={sllSearch} disabled={isPlaying || !inputValue}>{isMobile ? '🔍' : 'Search'}</button>
            <button className="btn btn-clear" style={{background: '#ef4444', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={sllDeleteValue} disabled={isPlaying || !inputValue}>{isMobile ? '❌' : 'Delete Value'}</button>
          </>}

          {dsType === 'HASH_TABLE' && <>
            <button className="btn btn-insert" onClick={hashInsert} disabled={isPlaying || !inputValue}>Insert</button>
            <button className="btn btn-clear" style={{background: '#10b981', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={hashSearch} disabled={isPlaying || !inputValue}>Search</button>
            <button className="btn btn-clear" style={{background: '#ef4444', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={hashDelete} disabled={isPlaying || !inputValue}>Delete</button>
          </>}

          {isMobile && (
            <button 
              className="btn btn-clear" 
              style={{ 
                borderColor: showMobileOptions ? 'var(--accent-primary)' : 'var(--glass-border)', 
                color: showMobileOptions ? 'var(--accent-primary)' : 'var(--text-primary)' 
              }} 
              onClick={() => setShowMobileOptions(!showMobileOptions)}
            >
              ⚙️ Options
            </button>
          )}

          {(!isMobile || showMobileOptions) && (
            <>
              {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙️ Settings</button>}
              <button className="btn btn-clear" onClick={() => handleClear(dsVariety, tableSize)} disabled={isPlaying}>🗑 Clear</button>
            </>
          )}

          {!isMobile && (
            <>
              <div style={{ width: '1px', height: '26px', background: 'var(--glass-border)', margin: '0 8px' }} />
              <button className="btn btn-clear" onClick={() => setShowLogPanel(!showLogPanel)}>{showLogPanel ? '📋 Hide Log' : '📋 Show Log'}</button>
              <button className="btn btn-clear" onClick={() => setShowHistory(!showHistory)}>{showHistory ? '🗑️ Hide History' : '🗑️ Show History'}</button>
              <button className="btn btn-clear" onClick={() => setShowCode(!showCode)}>{showCode ? '💻 Hide Code' : '💻 Show Code'}</button>
            </>
          )}
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
        </div>
      </header>

      {isMobile && (
        <div className="mobile-tabs-container">
          <button className={`mobile-tab-btn ${mobileTab === 'vis' ? 'active' : ''}`} onClick={() => setMobileTab('vis')}>📊 Visualizer</button>
          <button className={`mobile-tab-btn ${mobileTab === 'code' ? 'active' : ''}`} onClick={() => { setMobileTab('code'); setShowCode(true); }}>💻 Code</button>
          <button className={`mobile-tab-btn ${mobileTab === 'log' ? 'active' : ''}`} onClick={() => { setMobileTab('log'); setShowLogPanel(true); }}>📋 Logs</button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
        <div style={{ display: (isMobile && mobileTab !== 'vis') ? 'none' : 'flex', flex: 1, flexDirection: 'column', padding: isMobile ? '0.35rem' : '1.5rem', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.2rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '6px 20px', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              {frame.msg || 'Select an operation to begin...'}
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '1.5rem', overflow: 'hidden', width: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'auto', position: 'relative', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)', width: '100%', height: '100%' }}>
            {dsType === 'STACK' && renderStack(frame)}
            {dsType === 'QUEUE' && renderQueue(frame)}
            {dsType === 'LINKED_LIST' && (dsVariety === 'LL_POLYNOMIAL' ? renderPolynomials(frame) : renderLinkedList(frame))}
            {dsType === 'HASH_TABLE' && renderHashTable(frame)}

            {/* Complexity Info Overlay Card */}
            {(() => {
              const comp = getComplexityInfo(dsType, dsVariety);
              if (!comp) return null;
              return (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: showComplexity ? '12px 16px' : '6px 12px',
                  width: showComplexity ? '260px' : 'auto',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                  zIndex: 20,
                  transition: 'all 0.3s ease',
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowComplexity(!showComplexity)}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)' }}>
                      📊 {comp.title} Big-O
                    </span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{showComplexity ? '▼' : '▲'}</span>
                  </div>
                  {showComplexity && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.75rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                          <th style={{ textAlign: 'left', padding: '4px 0' }}>Operation</th>
                          <th style={{ textAlign: 'center', padding: '4px 0' }}>Time</th>
                          <th style={{ textAlign: 'center', padding: '4px 0' }}>Space</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comp.operations.map((op, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < comp.operations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <td style={{ padding: '6px 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>{op.op}</td>
                            <td style={{ padding: '6px 0', textAlign: 'center', fontFamily: 'monospace', color: '#fbbf24' }}>{op.time}</td>
                            <td style={{ padding: '6px 0', textAlign: 'center', fontFamily: 'monospace', color: '#60a5fa' }}>{op.space}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })()}

             {showLogPanel && !isMobile && (
               <div
                 style={{
                   position: 'fixed',
                   left: `${Math.max(0, Math.min(logPosition.x, window.innerWidth - logSize.width))}px`,
                   top: `${Math.max(0, Math.min(logPosition.y, window.innerHeight - logSize.height))}px`,
                   width: `${logSize.width}px`,
                   height: `${logSize.height}px`,
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
                   className="log-drag-handle"
                   onMouseDown={handleLogMouseDown}
                   onTouchStart={handleLogMouseDown}
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
                     📋 Execution Log & Active State
                   </span>
                   <button
                     onClick={() => setShowLogPanel(false)}
                     style={{
                       background: 'transparent',
                       border: 'none',
                       color: 'var(--text-secondary)',
                       cursor: 'pointer',
                       fontSize: '1.1rem',
                       padding: '0 4px',
                       lineHeight: 1
                     }}
                     title="Hide Log"
                   >
                     ×
                   </button>
                 </div>

                 {/* Dual Column Content Body */}
                 <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                   {/* Left Column: Data Structure Pointers & Elements */}
                   <div
                     style={{
                       width: `${activeStateWidth}px`,
                       background: 'rgba(0, 0, 0, 0.25)',
                       borderRight: '1px solid var(--glass-border)',
                       padding: '10px 12px',
                       display: 'flex',
                       flexDirection: 'column',
                       gap: '10px',
                       fontSize: '0.8rem',
                       color: 'var(--text-secondary)',
                       overflowY: 'auto',
                       flexShrink: 0
                     }}
                   >
                     <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                       Active State
                     </div>
                     <div>
                       <span style={{ color: 'var(--text-secondary)' }}>Type: </span>
                       <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                         {dsType.replace('_', ' ')} {dsVariety && `(${dsVariety.replace('HASH_', '').replace('CIRCULAR_', '')})`}
                       </span>
                     </div>

                     {(() => {
                       const frame = timeline[currentStep] || {};
                       return (
                         <>
                           <div>
                             <div style={{ marginBottom: '2px', fontSize: '0.75rem' }}>Elements:</div>
                             {frame.arr ? (
                               <div style={{ background: 'rgba(0,0,0,0.18)', padding: '4px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', wordBreak: 'break-all', fontWeight: 'bold' }}>
                                 [{frame.arr.join(', ')}]
                               </div>
                             ) : frame.cq && frame.cq.arr ? (
                               <div style={{ background: 'rgba(0,0,0,0.18)', padding: '4px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', wordBreak: 'break-all', fontWeight: 'bold' }}>
                                 [{frame.cq.arr.map((x) => x === null ? 'null' : x).join(', ')}]
                               </div>
                             ) : frame.ht ? (
                               <div style={{ background: 'rgba(0,0,0,0.18)', padding: '4px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', fontSize: '0.72rem', overflowY: 'auto', maxHeight: '90px' }}>
                                 {frame.ht.map((bucket, bIdx) => (
                                   <div key={bIdx} style={{ whiteSpace: 'nowrap' }}>
                                     {bIdx}: {Array.isArray(bucket) ? (bucket.length > 0 ? bucket.join(' ➔ ') : 'empty') : (bucket === null ? 'empty' : bucket === 'TOMBSTONE' ? 'DEL' : bucket)}
                                   </div>
                                 ))}
                               </div>
                             ) : (
                               <span style={{ fontStyle: 'italic' }}>Empty</span>
                             )}
                           </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', marginTop: '4px' }}>
                              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', color: 'var(--accent-secondary)' }}>Trace Variables</div>
                              
                              {dsType === 'HASH_TABLE' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {frame.activeBucket !== undefined && frame.activeBucket !== -1 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Target Slot:</span>
                                      <span style={{ color: '#fbbf24', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                        {frame.activeBucket}
                                      </span>
                                    </div>
                                  )}
                                  {frame.activeNode !== undefined && frame.activeNode !== -1 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span>Chain Node Index:</span>
                                      <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{frame.activeNode}</span>
                                    </div>
                                  )}
                                  {(frame.activeBucket === undefined || frame.activeBucket === -1) && (
                                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>No active slot</div>
                                  )}
                                </div>
                              ) : dsVariety === 'QUEUE_CIRCULAR' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Front Index:</span>
                                    <span style={{ color: '#fbbf24', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                      {frame.cq && frame.cq.f !== -1 ? frame.cq.f : 'N/A'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Rear Index:</span>
                                    <span style={{ color: '#60a5fa', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                      {frame.cq && frame.cq.r !== -1 ? frame.cq.r : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  {frame.activeIdx !== undefined && frame.activeIdx !== -1 ? (
                                    <>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Active Val:</span>
                                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                                          {frame.arr ? (frame.arr[frame.activeIdx] ?? 'N/A') : 'N/A'}
                                        </span>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Active Index:</span>
                                        <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                          {frame.activeIdx}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>No active pointer</div>
                                  )}
                                </div>
                              )}

                              {frame.activeLineText && (
                                <div style={{ marginTop: '8px' }}>
                                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Snippet:</div>
                                  <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={frame.activeLineText}>
                                    {frame.activeLineText}
                                  </div>
                                </div>
                              )}
                            </div>
                         </>
                       );
                     })()}
                   </div>

                   {/* Vertical Column split resize handle */}
                    <div 
                      onMouseDown={handleActiveStateColDragStart}
                      onTouchStart={handleActiveStateColDragStart}
                      style={{
                        width: '6px',
                        cursor: 'col-resize',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderLeft: '1px solid var(--glass-border)',
                        borderRight: '1px solid var(--glass-border)',
                        alignSelf: 'stretch',
                        transition: 'background 0.2s',
                        borderRadius: '3px',
                        flexShrink: 0,
                        touchAction: 'none'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(96,165,250,0.5)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                      title="Drag to resize columns"
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
                           No simulation logs yet. Run operation to start.
                         </div>
                       )}
                       {timeline.slice(0, currentStep + 1).map((frame, idx) => (
                         <div key={idx} style={{ display: 'flex', gap: '6px', lineHeight: '1.4' }}>
                           <span style={{ color: 'var(--text-secondary)', userSelect: 'none', minWidth: '15px' }}>
                             {idx === currentStep ? '➔' : `${idx + 1}.`}
                           </span>
                           <span style={{ color: idx === currentStep ? '#fbbf24' : 'var(--text-primary)' }}>
                             {frame.msg}
                           </span>
                         </div>
                       ))}
                     </div>
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
                     onMouseDown={handleResizeMouseDown}
                     onTouchStart={handleResizeMouseDown}
                     title="Drag to resize panel"
                   />

                 </div>
               </div>
             )}
            </div>

            {/* Popped/Removed Elements Sidebar Panel */}
            {showHistory && !isMobile && (
              <div style={{
                width: '220px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.3s',
                flexShrink: 0
              }}>
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid var(--glass-border)',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {dsType === 'STACK' && '🗑️ Popped Elements'}
                    {dsType === 'QUEUE' && '🗑️ Dequeued Elements'}
                    {dsType === 'LINKED_LIST' && '🗑️ Deleted Elements'}
                    {dsType === 'HASH_TABLE' && '🗑️ Deleted Elements'}
                  </span>
                  {poppedElements.length > 0 && (
                    <button
                      onClick={() => setPoppedElements([])}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div style={{
                  flex: 1,
                  padding: '12px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {poppedElements.length === 0 ? (
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      marginTop: '20px'
                    }}>
                      No elements {dsType === 'STACK' ? 'popped' : dsType === 'QUEUE' ? 'dequeued' : 'deleted'} yet.
                    </div>
                  ) : (
                    [...poppedElements].reverse().map((item, index) => {
                      const displayVal = typeof item === 'object' ? item.val : item;
                      const opName = typeof item === 'object' ? item.op : 'Pop';
                      const dsName = typeof item === 'object' ? item.ds : 'Stack';
                      return (
                        <div 
                          key={index} 
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            padding: '10px 12px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            color: 'var(--text-primary)',
                            animation: 'fadeIn 0.3s ease-out'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                              #{poppedElements.length - index} ({dsName})
                            </span>
                            <span style={{ color: 'var(--accent-primary)', fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                              {opName}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'bold', fontSize: '1.1rem', color: '#f43f5e', textShadow: '0 0 10px rgba(244,63,94,0.3)' }}>
                            {displayVal}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', background: 'var(--glass-bg)', padding: isMobile ? '10px 14px' : '12px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={!timeline.length||currentStep===0}>⏮ First</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={!timeline.length||currentStep===0}>◀ Prev</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1.5rem', border: 'none', background: isPlaying ? 'rgba(59,130,246,0.6)' : 'var(--accent-primary)', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }} onClick={() => setIsPlaying(p => !p)} disabled={!timeline.length}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={!timeline.length||currentStep===timeline.length-1}>Next ▶</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={!timeline.length||currentStep===timeline.length-1}>Last ⏭</button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: isMobile ? '5px' : '15px', fontWeight: 'bold', fontFamily: 'monospace' }}>Frame: {timeline.length ? currentStep + 1 : 0} / {timeline.length}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Animation Speed</span>
              <input type="range" min={50} max={1000} step={50} value={1050 - speed} onChange={e => setSpeed(1050 - Number(e.target.value))} style={{ width: isMobile ? '100%' : '200px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}/>
            </div>
          </div>
        </div>

        {/* Inline Mobile Log Panel */}
        {isMobile && showLogPanel && mobileTab === 'log' && (
          <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', padding: '0.85rem', overflow: 'hidden', height: '100%', width: '100%' }}>
            <div style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                📋 Execution Log & Active State
              </span>
            </div>
            
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflowY: 'auto', gap: '10px', marginTop: '10px' }}>
              {/* Active State Details */}
              <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                  Active State
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Type: </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    {dsType.replace('_', ' ')} {dsVariety && `(${dsVariety.replace('HASH_', '').replace('CIRCULAR_', '')})`}
                  </span>
                </div>
                <div>
                  <div style={{ marginBottom: '2px', fontSize: '0.75rem' }}>Elements:</div>
                  {frame.arr ? (
                    <div style={{ background: 'rgba(0,0,0,0.18)', padding: '4px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', wordBreak: 'break-all', fontWeight: 'bold' }}>
                      [{frame.arr.join(', ')}]
                    </div>
                  ) : frame.cq && frame.cq.arr ? (
                    <div style={{ background: 'rgba(0,0,0,0.18)', padding: '4px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', wordBreak: 'break-all', fontWeight: 'bold' }}>
                      [{frame.cq.arr.map((x) => x === null ? 'null' : x).join(', ')}]
                    </div>
                  ) : frame.ht ? (
                    <div style={{ background: 'rgba(0,0,0,0.18)', padding: '4px 6px', borderRadius: '4px', fontFamily: 'monospace', color: '#34d399', fontSize: '0.72rem', overflowY: 'auto', maxHeight: '90px' }}>
                      {frame.ht.map((bucket, bIdx) => (
                        <div key={bIdx} style={{ whiteSpace: 'nowrap' }}>
                          {bIdx}: {Array.isArray(bucket) ? (bucket.length > 0 ? bucket.join(' ➔ ') : 'empty') : (bucket === null ? 'empty' : bucket === 'TOMBSTONE' ? 'DEL' : bucket)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontStyle: 'italic' }}>Empty</span>
                  )}
                </div>
                
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', marginTop: '4px' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', color: 'var(--accent-secondary)' }}>Trace Variables</div>
                  
                  {dsType === 'HASH_TABLE' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {frame.activeBucket !== undefined && frame.activeBucket !== -1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Target Slot:</span>
                          <span style={{ color: '#fbbf24', fontWeight: 'bold', fontFamily: 'monospace' }}>
                            {frame.activeBucket}
                          </span>
                        </div>
                      )}
                      {frame.activeNode !== undefined && frame.activeNode !== -1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Chain Node Index:</span>
                          <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{frame.activeNode}</span>
                        </div>
                      )}
                      {(frame.activeBucket === undefined || frame.activeBucket === -1) && (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>No active slot</div>
                      )}
                    </div>
                  ) : dsVariety === 'QUEUE_CIRCULAR' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Front Index:</span>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold', fontFamily: 'monospace' }}>
                          {frame.cq && frame.cq.f !== -1 ? frame.cq.f : 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Rear Index:</span>
                        <span style={{ color: '#60a5fa', fontWeight: 'bold', fontFamily: 'monospace' }}>
                          {frame.cq && frame.cq.r !== -1 ? frame.cq.r : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {frame.activeIdx !== undefined && frame.activeIdx !== -1 ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Active Val:</span>
                            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                              {frame.arr ? (frame.arr[frame.activeIdx] ?? 'N/A') : 'N/A'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Active Index:</span>
                            <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                              {frame.activeIdx}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>No active pointer</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Operations/Timeline Log */}
              <div style={{ flex: '1 0 150px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '0.75rem 1rem', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Log Steps</div>
                {timeline.length === 0 && (
                  <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                    No simulation logs yet. Run operation to start.
                  </div>
                )}
                {timeline.slice(0, currentStep + 1).map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{idx === currentStep ? '➔' : `${idx + 1}.`}</span>
                    <span style={{ color: idx === currentStep ? '#fbbf24' : 'var(--text-primary)' }}>{f.msg}</span>
                  </div>
                ))}
              </div>

              {/* Popped/Removed Elements History (under mobile Tab 3) */}
              {showHistory && (
                <div style={{ flex: '1 0 150px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '0.75rem 1rem', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {dsType === 'STACK' && '🗑️ Popped'}
                      {dsType === 'QUEUE' && '🗑️ Dequeued'}
                      {dsType === 'LINKED_LIST' && '🗑️ Deleted'}
                      {dsType === 'HASH_TABLE' && '🗑️ Deleted'} Elements History
                    </span>
                    {poppedElements.length > 0 && (
                      <button onClick={() => setPoppedElements([])} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 'bold' }}>
                        Clear
                      </button>
                    )}
                  </div>
                  {poppedElements.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
                      No elements processed yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[...poppedElements].reverse().map((item, index) => {
                        const displayVal = typeof item === 'object' ? item.val : item;
                        const opName = typeof item === 'object' ? item.op : 'Pop';
                        const dsName = typeof item === 'object' ? item.ds : 'Stack';
                        return (
                          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--glass-border)', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                              #{poppedElements.length - index} ({dsName} {opName})
                            </span>
                            <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>{displayVal}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Sidebar */}
        {showCode && (isMobile ? mobileTab === 'code' : true) && (
        <>
           {/* Vertical Drag Handle for column resizing */}
          {!isMobile && (
            <div onMouseDown={handleColDragStart} onTouchStart={handleColDragStart} style={{ width: '8px', background: 'var(--glass-border)', borderRadius: '4px', cursor: 'col-resize', flexShrink: 0, transition: 'background 0.2s', touchAction: 'none' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(96,165,250,0.5)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--glass-border)'}
              title="Drag to resize columns" />
          )}

          <div style={{ width: isMobile ? '100%' : `${codeWidth}px`, background: 'var(--bg-secondary)', borderLeft: isMobile ? 'none' : '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: isMobile ? '100%' : '200px' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-bg)', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold', flex: 1 }}>Implementation</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => onShowUpcomingFeatures ? onShowUpcomingFeatures() : setIsRunnerOpen(true)}
                  className="btn btn-clear"  
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  ▶ Run Code
                </button>
              <button 
                onClick={handleCopyCode} 
                className="btn btn-clear" 
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <select className="styled-select" style={{ width: '120px', padding: '0.3rem' }} value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)}>
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
              lineHeight: '1.6' 
            }}>
              <code>
                {currentCode.split('\n').map((line, i) => {
                  const isMatch = frame.activeLineText && line.includes(frame.activeLineText) && !line.trim().startsWith('//');
                  return (
                    <div key={i} style={{ 
                        background: isMatch ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                        borderLeft: isMatch ? '4px solid #10b981' : '4px solid transparent',
                        padding: '2px 1rem',
                        display: 'flex',
                        transition: 'all 0.2s'
                    }}>
                        <span style={{ width: '25px', color: isMatch ? '#10b981' : 'var(--text-secondary)', userSelect: 'none', textAlign: 'right', marginRight: '15px' }}>
                          {isMatch ? '➔' : i + 1}
                        </span>
                        <span>{line}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
        </>
        )}
      </div>
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={currentCode}
        language={codeLanguage}
      />
    </div>
  );
};

export default GeneralDSVisualizer;
