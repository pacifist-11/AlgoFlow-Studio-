/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import TopicInfoModal from './TopicInfoModal.jsx';
import { getPatternCodeTemplate } from './codeTemplatesPatterns.js';

// Converts K&R brace style to Allman style for display
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

// Fallback Copy to Clipboard
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

const highlightLogText = (text) => {
  if (!text) return '';
  const str = String(text);
  const lower = str.toLowerCase();
  
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
    lower.includes('⚡')
  ) {
    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = str.split(regex);
    return (
      <span style={{ color: '#f87171', fontWeight: 'bold' }}>
        {parts.map((p, i) => 
          regex.test(p) ? <span key={i} style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.3)' }}>{p}</span> : p
        )}
      </span>
    );
  }
  
  if (
    lower.includes('inserted') ||
    lower.includes('insert(') ||
    lower.includes('insert ') ||
    lower.includes('create node') ||
    lower.includes('success') ||
    lower.includes('match') ||
    lower.includes('completed') ||
    lower.includes('done') ||
    lower.includes('✦') ||
    lower.includes('✓') ||
    lower.includes('✅')
  ) {
    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = str.split(regex);
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
    lower.includes('➜') ||
    lower.includes('↳')
  ) {
    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = str.split(regex);
    return (
      <span style={{ color: '#fb923c', fontWeight: 600 }}>
        {parts.map((p, i) => 
          regex.test(p) ? <span key={i} style={{ color: '#fbbf24', fontWeight: 'bold' }}>{p}</span> : p
        )}
      </span>
    );
  }
  
  const regex = /(\b\d+(?:\.\d+)?\b)/g;
  const parts = str.split(regex);
  return parts.map((p, i) => 
    /^\d+(?:\.\d+)?$/.test(p) ? <strong key={i} style={{ color: '#fbbf24' }}>{p}</strong> : p
  );
};

// Helper to determine the type of statement executing in loop trace
const getLineTypeForFrame = (frame, selectedPattern) => {
  if (!frame) return 'outer_loop';
  if (frame.lineType) return frame.lineType;
  
  const msg = (frame.msg || '').toLowerCase();
  
  if (msg.includes('newline') || msg.includes('complete') || msg.includes('end of row') || frame.activeCol === '-') {
    return 'print_newline';
  }
  if (msg.includes('outer loop') || msg.includes('start pattern')) {
    return 'outer_loop';
  }
  if (msg.includes('space') || msg.includes('leading space') || frame.activeChar === ' ' || (frame.spaces > 0 && frame.activeCol === '-')) {
    return 'space_loop';
  }
  
  return 'print_char';
};

// Helper to scan code lines and return 0-indexed line to highlight
const getLineIndexToHighlight = (codeLines, lineType, frame, language) => {
  if (!frame) return -1;
  const msg = (frame.msg || '').toLowerCase();
  const isPrintingSpace = msg.includes('space') || frame.activeChar === ' ';
  
  for (let idx = 0; idx < codeLines.length; idx++) {
    const line = codeLines[idx].trim();
    
    if (lineType === 'outer_loop') {
      if (line.includes('for') && (line.includes('i') || line.includes('r'))) {
        return idx;
      }
    }
    
    if (lineType === 'space_loop') {
      if (line.includes('for') && (line.includes('s') || line.includes('space') || line.includes('sp'))) {
        return idx;
      }
    }
    
    if (lineType === 'inner_loop') {
      if (line.includes('for') && (line.includes('j') || line.includes('c') || line.includes('col') || line.includes('k'))) {
        if (!line.includes('s') || line.includes('c')) {
          return idx;
        }
      }
    }
    
    if (lineType === 'print_char') {
      if (
        line.includes('print') || 
        line.includes('cout <<') || 
        line.includes('printf') || 
        line.includes('System.out')
      ) {
        if (!line.includes('println') && !line.includes('endl') && !line.includes('\\n')) {
          if (isPrintingSpace) {
            if (line.includes('" "') || line.includes("' '") || line.includes('""') || line.includes('"  "') || line.includes('end=""') || line.includes('end=" "')) {
              return idx;
            }
          } else {
            if (!line.includes('" "') && !line.includes("' '") && !line.includes('"  "')) {
              return idx;
            }
          }
        }
      }
    }
    
    if (lineType === 'print_newline') {
      if (
        line.includes('println') || 
        line.includes('endl') || 
        line.includes('\\n') || 
        line.includes('print()') || 
        (line.includes('print') && !line.includes('end='))
      ) {
        return idx;
      }
    }
  }
  
  // Fallbacks if not found
  if (lineType === 'print_char') {
    for (let idx = 0; idx < codeLines.length; idx++) {
      const line = codeLines[idx].trim();
      if ((line.includes('print') || line.includes('cout <<') || line.includes('printf')) && 
          !line.includes('println') && !line.includes('endl') && !line.includes('\\n')) {
        return idx;
      }
    }
  }
  
  return -1;
};

const PatternsVisualizer = ({ onBack, openSettings, onCopyCode, onCodeChange, fontSize = 14, wordWrap = 'off', onShowUpcomingFeatures }) => {
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  const [showTopicInfo, setShowTopicInfo] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showComplexity, setShowComplexity] = useState(true);
  const [speed, setSpeed] = useState(400); // Animation delay in ms
  const [copied, setCopied] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  // Trace log variables
  const [showLogPanel, setShowLogPanel] = useState(true);
  const [logPosition, setLogPosition] = useState({ x: 50, y: 150 });
  const [logSize, setLogSize] = useState({ width: 520, height: 280 });
  const [isDraggingLog, setIsDraggingLog] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelStart = useRef({ x: 0, y: 0 });
  const [activeStateWidth, setActiveStateWidth] = useState(240);
  const [codeWidth, setCodeWidth] = useState(380);

  const logContainerRef = useRef(null);

  // Interactive configurations
  const [selectedLanguage, setSelectedLanguage] = useState('Java'); // 'Java' | 'Python' | 'C++' | 'C' | 'JavaScript'
  const [selectedPattern, setSelectedPattern] = useState('PYRAMID_HALF');
  const [patternInputRows, setPatternInputRows] = useState(5);
  const [patternSymbol, setPatternSymbol] = useState('*');

  // Timeline / Frames
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentCode = getPatternCodeTemplate(selectedPattern, selectedLanguage, patternInputRows, patternSymbol);
  const currentLang = selectedLanguage;

  useEffect(() => {
    if (onCodeChange) onCodeChange(currentCode, currentLang);
  }, [currentCode, currentLang]);

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
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStep, showLogPanel, timeline]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeline([]);
  };

  // Draggable columns and panels resize helpers
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
      const newWidth = Math.max(120, Math.min(450, startWidth + (currentX - startX)));
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

  const handleCopyCode = () => {
    copyToClipboard(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(currentCode, currentLang);
    });
  };

  // -----------------------------------------------------------------
  // MODULE: Patterns Visualizer Box
  // -----------------------------------------------------------------
  const runPatternsFlow = () => {
    const rows = Math.max(1, Math.min(25, parseInt(patternInputRows) || 5));
    let frames = [];
    let logs = [`Start pattern simulation: ${selectedPattern} (${rows} rows)`];
    let consoleLines = [];
    const sym = patternSymbol;

    const getSymbolForPos = (c) => {
      if (sym === 'Numbers') return `${c} `;
      if (sym === 'Letters') return `${String.fromCharCode(64 + c)} `;
      return `${sym} `;
    };

    if (selectedPattern === 'PYRAMID_HALF') {
      let grid = [];
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        for (let c = 1; c <= r; c++) {
          let char = getSymbolForPos(c);
          rowStr += char;
          gridRow.push(char.trim());
          logs.push(`  Inner Loop: Col j = ${c} ➔ printed '${char.trim()}'`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: 0, activeChar: char.trim(),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Row ${r}, Col ${c}: Placed '${char.trim()}'`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: 0, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'PYRAMID_INVERTED') {
      let grid = [];
      for (let r = rows; r >= 1; r--) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        for (let c = 1; c <= r; c++) {
          let char = getSymbolForPos(c);
          rowStr += char;
          gridRow.push(char.trim());
          logs.push(`  Inner Loop: Col j = ${c} ➔ printed '${char.trim()}'`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: 0, activeChar: char.trim(),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Row ${r}, Col ${c}: Placed '${char.trim()}'`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: 0, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'PYRAMID_FULL') {
      let grid = [];
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        // Leading spaces
        let spaceCount = rows - r;
        logs.push(`  Leading Spaces: Printed ${spaceCount} spaces`);
        for (let s = 1; s <= spaceCount; s++) {
          rowStr += ' ';
          gridRow.push(' ');
        }
        if (spaceCount > 0) {
          frames.push({
            lineType: 'space_loop',
            logs: [...logs], activeRow: r, activeCol: '-', spaces: spaceCount, activeChar: ' ',
            patternOutputs: [...consoleLines, ' '.repeat(spaceCount)], grid: [...grid, Array(spaceCount).fill(' ')],
            msg: `Row ${r}: Placed leading spaces`
          });
        }

        // Symbols
        let symCount = 2 * r - 1;
        for (let c = 1; c <= symCount; c++) {
          let char = getSymbolForPos(c);
          rowStr += char.trim();
          gridRow.push(char.trim());
          logs.push(`  Inner Loop: Character ${c} ➔ printed '${char.trim()}'`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: spaceCount, activeChar: char.trim(),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Row ${r}: Placed character ${c} of ${symCount}`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: spaceCount, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'PYRAMID_FULL_INVERTED') {
      let grid = [];
      for (let r = rows; r >= 1; r--) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        // Leading spaces
        let spaceCount = rows - r;
        logs.push(`  Leading Spaces: Printed ${spaceCount} spaces`);
        for (let s = 1; s <= spaceCount; s++) {
          rowStr += ' ';
          gridRow.push(' ');
        }
        if (spaceCount > 0) {
          frames.push({
            lineType: 'space_loop',
            logs: [...logs], activeRow: r, activeCol: '-', spaces: spaceCount, activeChar: ' ',
            patternOutputs: [...consoleLines, ' '.repeat(spaceCount)], grid: [...grid, Array(spaceCount).fill(' ')],
            msg: `Row ${r}: Placed leading spaces`
          });
        }

        // Symbols
        let symCount = 2 * r - 1;
        for (let c = 1; c <= symCount; c++) {
          let char = getSymbolForPos(c);
          rowStr += char.trim();
          gridRow.push(char.trim());
          logs.push(`  Inner Loop: Character ${c} ➔ printed '${char.trim()}'`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: spaceCount, activeChar: char.trim(),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Row ${r}: Placed character ${c} of ${symCount}`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: spaceCount, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'FLOYD') {
      let grid = [];
      let val = 1;
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        for (let c = 1; c <= r; c++) {
          rowStr += `${val} `;
          gridRow.push(String(val));
          logs.push(`  Inner Loop: Col j = ${c} ➔ placed Floyd value ${val}`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: 0, activeChar: String(val),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Placed number ${val}`
          });
          val++;
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: 0, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'PASCAL') {
      let grid = [];
      for (let r = 0; r < rows; r++) {
        let rowStr = ' '.repeat(rows - r - 1);
        let gridRow = [];
        for (let s = 1; s <= rows - r - 1; s++) {
          gridRow.push(' ');
        }
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r + 1, activeCol: '-', spaces: rows - r - 1, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        let termVal = 1;
        for (let c = 0; c <= r; c++) {
          rowStr += `${termVal} `;
          gridRow.push(String(termVal));
          logs.push(`  Inner Loop: Col j = ${c} ➔ computed Pascal term ${termVal}`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r + 1, activeCol: c + 1, spaces: rows - r - 1, activeChar: String(termVal),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Pascal Row ${r}, Term ${c}: Val = ${termVal}`
          });
          termVal = Math.floor(termVal * (r - c) / (c + 1)) || 1;
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r + 1, activeCol: '-', spaces: rows - r - 1, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r + 1} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'DIAMOND') {
      let grid = [];
      // Top Half
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        let spacesCount = rows - r;
        for (let s = 1; s <= spacesCount; s++) {
          rowStr += ' ';
          gridRow.push(' ');
        }
        logs.push(`Top Diamond Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: spacesCount, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Top Half: Row ${r}`
        });

        if (spacesCount > 0) {
          frames.push({
            lineType: 'space_loop',
            logs: [...logs], activeRow: r, activeCol: '-', spaces: spacesCount, activeChar: ' ',
            patternOutputs: [...consoleLines, ' '.repeat(spacesCount)], grid: [...grid, Array(spacesCount).fill(' ')],
            msg: `Top Half Row ${r}: Placed leading spaces`
          });
        }

        let symCount = 2 * r - 1;
        for (let c = 1; c <= symCount; c++) {
          let char = getSymbolForPos(c);
          rowStr += char.trim();
          gridRow.push(char.trim());
          frames.push({
            lineType: 'print_char',
            logs: [...logs, `Top Diamond: Row ${r}, Symbol ${c}/${symCount}`],
            activeRow: r, activeCol: c, spaces: spacesCount, activeChar: char.trim(),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Top Half Row ${r}: Placing symbol ${c}`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: spacesCount, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
      // Bottom Half
      for (let r = rows - 1; r >= 1; r--) {
        let rowStr = '';
        let gridRow = [];
        let spacesCount = rows - r;
        for (let s = 1; s <= spacesCount; s++) {
          rowStr += ' ';
          gridRow.push(' ');
        }
        logs.push(`Bottom Diamond Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: rows * 2 - r, activeCol: '-', spaces: spacesCount, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Bottom Half: Row ${r}`
        });

        if (spacesCount > 0) {
          frames.push({
            lineType: 'space_loop',
            logs: [...logs], activeRow: rows * 2 - r, activeCol: '-', spaces: spacesCount, activeChar: ' ',
            patternOutputs: [...consoleLines, ' '.repeat(spacesCount)], grid: [...grid, Array(spacesCount).fill(' ')],
            msg: `Bottom Half Row ${r}: Placed leading spaces`
          });
        }

        let symCount = 2 * r - 1;
        for (let c = 1; c <= symCount; c++) {
          let char = getSymbolForPos(c);
          rowStr += char.trim();
          gridRow.push(char.trim());
          frames.push({
            lineType: 'print_char',
            logs: [...logs, `Bottom Diamond: Row ${r}, Symbol ${c}/${symCount}`],
            activeRow: rows * 2 - r, activeCol: c, spaces: spacesCount, activeChar: char.trim(),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Bottom Half Row ${r}: Placing symbol ${c}`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: rows * 2 - r, activeCol: '-', spaces: spacesCount, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${rows * 2 - r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'HOLLOW_SQUARE') {
      let grid = [];
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        for (let c = 1; c <= rows; c++) {
          const isBorder = (r === 1 || r === rows || c === 1 || c === rows || r === c || r + c === rows + 1);
          let char = isBorder ? getSymbolForPos(c).trim() : ' ';
          rowStr += char + ' ';
          gridRow.push(char);
          logs.push(`  Col j = ${c} ➔ '${char}'`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: 0, activeChar: char,
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Hollow Grid (${r}, ${c}): Placed '${char}'`
          });
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: 0, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'BUTTERFLY') {
      let grid = [];
      const symChar = sym === 'Numbers' || sym === 'Letters' ? '*' : sym;
      // Top Half
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Butterfly Top Wings Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Top Half: Row ${r}`
        });

        // Left wing
        for (let c = 1; c <= r; c++) { rowStr += symChar; gridRow.push(symChar); }
        // Center spaces
        let spacesCount = 2 * (rows - r);
        for (let s = 1; s <= spacesCount; s++) { rowStr += ' '; gridRow.push(' '); }
        // Right wing
        for (let c = 1; c <= r; c++) { rowStr += symChar; gridRow.push(symChar); }

        frames.push({
          lineType: 'print_char',
          logs: [...logs, `Butterfly Top Wings: Row ${r}`], activeRow: r, activeCol: r, spaces: spacesCount, activeChar: symChar,
          patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
          msg: `Butterfly Row ${r}: Placing Wing stars`
        });
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: spacesCount, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
      // Bottom Half
      for (let r = rows; r >= 1; r--) {
        let rowStr = '';
        let gridRow = [];
        logs.push(`Butterfly Bottom Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: rows * 2 - r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Bottom Half: Row ${r}`
        });

        // Left wing
        for (let c = 1; c <= r; c++) { rowStr += symChar; gridRow.push(symChar); }
        // Center spaces
        let spacesCount = 2 * (rows - r);
        for (let s = 1; s <= spacesCount; s++) { rowStr += ' '; gridRow.push(' '); }
        // Right wing
        for (let c = 1; c <= r; c++) { rowStr += symChar; gridRow.push(symChar); }

        frames.push({
          lineType: 'print_char',
          logs: [...logs, `Butterfly Bottom Wings: Row ${r}`], activeRow: rows * 2 - r, activeCol: r, spaces: spacesCount, activeChar: symChar,
          patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
          msg: `Butterfly Row ${r}: Placing Wing stars`
        });
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: rows * 2 - r, activeCol: '-', spaces: spacesCount, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${rows * 2 - r} complete. Print newline.`
        });
      }
    } 
    else if (selectedPattern === 'BINARY_TRIANGLE') {
      let grid = [];
      for (let r = 1; r <= rows; r++) {
        let rowStr = '';
        let gridRow = [];
        let bitVal = (r % 2 === 1) ? 1 : 0;
        logs.push(`Outer Loop: Row i = ${r}`);
        frames.push({
          lineType: 'outer_loop',
          logs: [...logs], activeRow: r, activeCol: '-', spaces: 0, activeChar: '-',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Outer loop check: Row i = ${r}`
        });

        for (let c = 1; c <= r; c++) {
          rowStr += `${bitVal} `;
          gridRow.push(String(bitVal));
          logs.push(`  Col j = ${c} ➔ printed '${bitVal}'`);
          frames.push({
            lineType: 'print_char',
            logs: [...logs], activeRow: r, activeCol: c, spaces: 0, activeChar: String(bitVal),
            patternOutputs: [...consoleLines, rowStr], grid: [...grid, gridRow],
            msg: `Row ${r}, Col ${c}: Placed '${bitVal}'`
          });
          bitVal = 1 - bitVal;
        }
        consoleLines.push(rowStr);
        grid.push(gridRow);
        frames.push({
          lineType: 'print_newline',
          logs: [...logs, `Print newline`],
          activeRow: r, activeCol: '-', spaces: 0, activeChar: '\\n',
          patternOutputs: [...consoleLines], grid: [...grid],
          msg: `Row ${r} complete. Print newline.`
        });
      }
    }

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const currentFrame = timeline[currentStep] || { logs: [], patternOutputs: [], grid: [] };
  const progress = timeline.length > 0 ? ((currentStep + 1) / timeline.length) * 100 : 0;

  const renderPatternsCanvas = () => {
    const { activeRow = '-', activeCol = '-', spaces = 0, activeChar = '-', patternOutputs = [], grid = [] } = currentFrame;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.2rem', padding: '1rem', overflowY: 'auto' }}>
        
        {/* Status badges bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1.5px solid #3b82f6', borderRadius: '12px', padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Row (i)</div>
            <strong style={{ fontSize: '1.2rem', color: '#60a5fa' }}>{activeRow}</strong>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Col / Char (j)</div>
            <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>{activeCol}</strong>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1.5px solid #f59e0b', borderRadius: '12px', padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Spaces (s)</div>
            <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>{spaces}</strong>
          </div>
          <div style={{ background: 'rgba(236, 72, 153, 0.12)', border: '1.5px solid #ec4899', borderRadius: '12px', padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Active Symbol</div>
            <strong style={{ fontSize: '1.2rem', color: '#f472b6' }}>{activeChar}</strong>
          </div>
        </div>

        {/* Split Grid & Terminal Output */}
        <div style={{ display: 'flex', gap: '15px', flex: 1, minHeight: '260px' }}>
          
          {/* 2D Matrix Grid */}
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1.5px solid var(--glass-border)', borderRadius: '14px', padding: '15px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', flexShrink: 0 }}>🌐 2D Cell Matrix View</h4>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', minWidth: 'min-content' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px' }}>
              {grid.map((rowCells, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', gap: '6px' }}>
                  {rowCells.map((cellChar, cIdx) => {
                    const isActive = (rIdx + 1 === activeRow && cIdx + 1 === activeCol);
                    return (
                      <div 
                        key={cIdx}
                        style={{
                          width: '34px', height: '34px', borderRadius: '8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 'bold', fontSize: '1rem',
                          background: isActive ? 'rgba(16, 185, 129, 0.3)' : cellChar.trim() !== '' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: isActive ? '2px solid #10b981' : cellChar.trim() !== '' ? '1.5px solid #3b82f6' : '1px dashed rgba(255,255,255,0.1)',
                          color: isActive ? '#34d399' : '#60a5fa',
                          boxShadow: isActive ? '0 0 12px rgba(16, 185, 129, 0.6)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {cellChar.trim() !== '' ? cellChar : '·'}
                      </div>
                    );
                  })}
                </div>
              ))}
              {grid.length === 0 && (
                <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem' }}>Select a pattern & click "Run Pattern Trace" to start.</span>
              )}
              </div>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div style={{ width: '45%', background: '#090d16', border: '1.5px solid var(--glass-border)', borderRadius: '14px', padding: '15px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💻 Live Console Output
            </h4>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '12px', overflowY: 'auto', fontSize: '1.05rem', color: '#10b981', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {patternOutputs.map((line, idx) => (
                <div key={idx} style={{ whiteSpace: 'pre', letterSpacing: '2px' }}>{line}</div>
              ))}
              {patternOutputs.length === 0 && (
                <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem' }}>Console output will appear here line-by-line...</span>
              )}
            </div>
          </div>

        </div>

      </div>
    );
  };

  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* HEADER SECTION */}
      <header className="header-glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
          <h1 className="title-gradient" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Patterns Visualizer Studio</h1>
        </div>

        {/* Action Controls */}
        <div className="controls-glass" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className="btn btn-clear" 
            style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }} 
            onClick={() => setShowTopicInfo(true)} 
            title="Learn about Loop Patterns"
          >
            ℹ️ Info
          </button>
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)', userSelect: 'none' }}>
              <input type="checkbox" checked={showComplexity} onChange={e => setShowComplexity(e.target.checked)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
              <span>Big-O</span>
            </label>
          </div>
          {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙ Settings</button>}
        </div>
      </header>

      {/* INPUT PANEL AND RUN BUTTONS */}
      <div style={{ display: 'flex', padding: '10px 20px', background: 'rgba(15, 23, 42, 0.3)', borderBottom: '1px solid var(--glass-border)', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexShrink: 0 }}>
        
        {/* Dynamic Inputs based on selected Tab */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Pattern:</span>
            <select className="styled-select" style={{ padding: '5px 25px 5px 10px', fontSize: '0.85rem', height: 'auto' }} value={selectedPattern} onChange={e => { setSelectedPattern(e.target.value); handleReset(); }}>
              <option value="PYRAMID_HALF">Right Half Pyramid</option>
              <option value="PYRAMID_INVERTED">Inverted Half Pyramid</option>
              <option value="PYRAMID_FULL">Full Centered Pyramid</option>
              <option value="PYRAMID_FULL_INVERTED">Inverted Full Pyramid</option>
              <option value="DIAMOND">Star Diamond / Rhombus</option>
              <option value="FLOYD">Floyd's Number Triangle</option>
              <option value="PASCAL">Pascal's Triangle</option>
              <option value="HOLLOW_SQUARE">Hollow Square & Cross</option>
              <option value="BUTTERFLY">Butterfly Pattern</option>
              <option value="BINARY_TRIANGLE">Binary 0/1 Triangle</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Rows:</span>
            <input type="number" min="1" max="25" className="styled-input" style={{ width: '65px', padding: '5px 10px', fontSize: '0.88rem' }} value={patternInputRows} onChange={e => { setPatternInputRows(e.target.value); handleReset(); }} />
          </div>
          {selectedPattern !== 'FLOYD' && selectedPattern !== 'PASCAL' && selectedPattern !== 'BINARY_TRIANGLE' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Symbol:</span>
              <select className="styled-select" style={{ padding: '5px 20px 5px 10px', fontSize: '0.85rem', height: 'auto' }} value={patternSymbol} onChange={e => { setPatternSymbol(e.target.value); handleReset(); }}>
                <option value="*">* (Star)</option>
                <option value="#"># (Hash)</option>
                <option value="@">@ (At)</option>
                <option value="$">$ (Dollar)</option>
                <option value="Numbers">Numbers</option>
                <option value="Letters">Letters</option>
              </select>
            </div>
          )}
          <button className="btn btn-insert" onClick={runPatternsFlow} disabled={isPlaying}>Run Pattern Trace</button>
        </div>
      </div>

      {/* MAIN CONTENT BLOCK */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* VISUALIZER CANVAS AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 30, 0.3)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            
            {renderPatternsCanvas()}

            {/* FLOATING COMPLEXITY CARD OVERLAY */}
            {showComplexity && (
              <div style={{ 
                position: 'absolute', top: '15px', right: '15px', zIndex: 30,
                width: '260px', background: 'rgba(15, 23, 42, 0.9)', border: '1.5px solid var(--glass-border)',
                borderRadius: '12px', padding: '12px', backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)', transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>📊 Pattern Complexity Details</span>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setShowComplexity(false)}>✕</button>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 'bold', marginBottom: '8px' }}>Nested Loop Mechanics</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Outer Loop (Rows)</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Iterates vertically row-by-row (i = 1..N)</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Spaces Padding Loop</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Pads offset spaces for centered shapes</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Time Complexity</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>O(N²) quadratic time complexity</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Space Complexity</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>O(1) in-place auxiliary space</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* FLOATING GLASSMORPHIC LOG PANEL */}
          {showLogPanel && timeline.length > 0 && (
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
              {/* Log Header - Drag Handle */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <span>📜 Pattern Trace variables</span>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setShowLogPanel(false)}>✕</button>
              </div>

              {/* Split panel content */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* Active State Values */}
                <div style={{ width: `${activeStateWidth}px`, borderRight: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ padding: '4px 8px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    State Variables
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.72rem', fontFamily: 'monospace' }}>
                    <div>pattern: <strong style={{ color: '#a78bfa' }}>{selectedPattern}</strong></div>
                    <div>row (i): <strong style={{ color: '#ec4899' }}>{currentFrame.activeRow || '-'}</strong></div>
                    <div>col (j): <strong style={{ color: '#3b82f6' }}>{currentFrame.activeCol || '-'}</strong></div>
                    <div>spaces (s): <strong style={{ color: '#fb923c' }}>{currentFrame.spaces || 0}</strong></div>
                    <div>symbol: <strong style={{ color: '#10b981' }}>{currentFrame.activeChar || '-'}</strong></div>
                  </div>
                </div>

                {/* Col Resize bar */}
                <div 
                  onMouseDown={handleActiveStateColDragStart} 
                  onTouchStart={handleActiveStateColDragStart}
                  style={{ width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 5 }} 
                />

                {/* Chronological steps */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '4px 8px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    Trace Log
                  </div>
                  <div ref={logContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {currentFrame.logs?.map((log, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', lineHeight: '1.4' }}>
                        <span style={{ color: 'var(--text-secondary)', flexShrink: 0, width: '24px', textAlign: 'right', fontWeight: 'bold', userSelect: 'none' }}>
                          {idx === currentFrame.logs.length - 1 ? '➔' : `${idx + 1}.`}
                        </span>
                        <span style={{ color: idx === currentFrame.logs.length - 1 ? 'var(--accent-primary)' : 'var(--text-primary)', wordBreak: 'break-word', flex: 1 }}>
                          {highlightLogText(log)}
                        </span>
                      </div>
                    ))}
                    {(!currentFrame.logs || currentFrame.logs.length === 0) && (
                      <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.75rem' }}>No steps recorded yet.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* Visual step highlight at bottom of log panel */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600, minHeight: '26px' }}>
                💡 {currentFrame.msg || 'Ready to analyze.'}
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

          {/* PLAYBACK CONTROL BAR AT THE BOTTOM */}
          <div style={{ display: 'flex', padding: '12px 20px', background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', alignItems: 'center', justifyContent: 'space-between', gap: '15px', zIndex: 10, flexShrink: 0 }}>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="btn btn-clear" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={handleReset} disabled={timeline.length === 0}>
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

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Frame {timeline.length > 0 ? currentStep + 1 : 0} / {timeline.length}</span>
              <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', transition: 'width 0.15s ease' }}></div>
              </div>
              
              {/* Inverted Speed Slider placed in the bottom bar on the right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Speed ({speed}ms)</span>
                <input 
                  type="range" min={50} max={3500} step={50} 
                  value={3550 - speed} onChange={e => setSpeed(3550 - Number(e.target.value))} 
                  style={{ width: '120px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} 
                  title={`Delay: ${speed}ms`}
                />
              </div>
            </div>

          </div>

        </div>



        {/* CODE PANELS / MULTI-LANGUAGE SYNTAX TEMPLATE ON RIGHT */}
        {showCode && (
          <div style={{ width: `${codeWidth}px`, borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', flexShrink: 0, position: 'relative' }}>
            
            {/* Header controls — sticky so always visible while code scrolls */}
            <div style={{ flexShrink: 0, borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 2 }}>
              {/* Row 1: Language selector */}
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>🌐 Lang:</span>
                {['Java','Python','C++','C','JavaScript'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    style={{
                      padding: '2px 9px',
                      fontSize: '0.74rem',
                      borderRadius: '5px',
                      border: selectedLanguage === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                      background: selectedLanguage === lang ? 'var(--accent-primary)' : 'transparent',
                      color: selectedLanguage === lang ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: selectedLanguage === lang ? 700 : 400,
                      transition: 'all 0.15s'
                    }}
                  >{lang}</button>
                ))}
              </div>
              {/* Row 2: Utility actions */}
              <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => setLocalFontSize(prev => Math.max(10, prev - 2))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.73rem', padding: '1px 6px', cursor: 'pointer' }}>A−</button>
                <button onClick={() => setLocalFontSize(prev => Math.min(40, prev + 2))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.73rem', padding: '1px 6px', cursor: 'pointer' }}>A+</button>
                <button 
                  onClick={() => setIsRunnerOpen(true)}
                  style={{ padding: '2px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '5px', cursor: 'pointer' }}
                >▶ Run</button>
                <button onClick={handleCopyCode} style={{ padding: '2px 8px', fontSize: '0.74rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Code Box displaying the template */}
            <div className="code-box" style={{ flex: 1, borderRadius: 0, border: 'none', margin: 0, overflow: 'auto', padding: '1rem' }}>
              <pre style={{ 
                margin: 0, 
                color: 'var(--text-primary)', 
                fontFamily: "'Fira Code', monospace", 
                lineHeight: '1.6',
                fontSize: `${localFontSize}px`
              }}>
                {(() => {
                  const codeLines = toAllman(currentCode).split('\n');
                  const lineType = getLineTypeForFrame(currentFrame, selectedPattern);
                  const highlightLineIdx = getLineIndexToHighlight(codeLines, lineType, currentFrame, selectedLanguage);
                  return codeLines.map((lineText, idx) => {
                    const isHighlighted = (highlightLineIdx === idx);
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          background: isHighlighted ? 'rgba(59,130,246,0.16)' : 'transparent',
                          borderLeft: isHighlighted ? '3px solid var(--accent-primary)' : '3px solid transparent',
                          padding: '1px 12px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ 
                          whiteSpace: wordWrap === 'on' ? 'pre-wrap' : 'pre',
                          color: isHighlighted ? '#ffffff' : 'var(--text-primary)',
                          fontFamily: "'Fira Code', monospace"
                        }}>
                          {lineText || ' '}
                        </span>
                      </div>
                    );
                  });
                })()}
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
        language={currentLang}
      />
      <TopicInfoModal
        topicKey="Patterns"
        isOpen={showTopicInfo}
        onClose={() => setShowTopicInfo(false)}
      />
    </div>
  );
};

export default PatternsVisualizer;
