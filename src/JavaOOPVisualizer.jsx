/* eslint-disable react/prop-types, react-hooks/exhaustive-deps, no-unused-vars, react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import CodeRunnerModal from './CodeRunnerModal.jsx';

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

// Standard Complexity and Concept Overlays
const getJavaConceptInfo = (topic) => {
  switch (topic) {
    case 'Basics':
      return {
        title: 'Java Basics & Casting',
        details: [
          { name: 'Implicit Casting (Widening)', desc: 'byte ➔ short ➔ int ➔ long ➔ float ➔ double (Automatic)' },
          { name: 'Explicit Casting (Narrowing)', desc: 'double ➔ float ➔ long ➔ int ➔ short ➔ byte (Manual operator)' },
          { name: 'Pattern Printing Loop', desc: 'Nested loops iterate O(R * C) time complexity' }
        ]
      };
    case 'Arrays':
      return {
        title: 'Arrays & Optimization',
        details: [
          { name: 'Array Rotation', desc: 'Time: O(N), Space: O(1) in-place' },
          { name: 'Matrix Transpose', desc: 'Time: O(N²), Space: O(1) in-place' },
          { name: 'Sliding Window / Two-Pointer', desc: 'Time: O(N) linear scan, Space: O(1)' }
        ]
      };
    case 'Recursion':
      return {
        title: 'Recursion & Backtracking',
        details: [
          { name: 'Stack Frame Allocation', desc: 'LIFO order. Each recursive call consumes memory on stack.' },
          { name: 'N-Queens Backtracking', desc: 'Time Complexity: O(N!), Space Complexity: O(N)' }
        ]
      };
    case 'OOP':
      return {
        title: 'OOP Memory & Binding',
        details: [
          { name: 'Stack vs Heap', desc: 'Stack stores references and primitives. Heap stores raw instantiated Objects.' },
          { name: 'Dynamic Method Binding', desc: 'Overridden methods resolved at runtime via class method lookup.' }
        ]
      };
    case 'Exceptions':
      return {
        title: 'Exceptions & Streams',
        details: [
          { name: 'Exception Propagation', desc: 'Errors bubble up stack frames from method called to the caller.' },
          { name: 'Byte vs Character Stream', desc: 'Byte streams handle binary files (8-bit). Character streams handle text reader (16-bit).' }
        ]
      };
    case 'Collections':
      return {
        title: 'Collections & Streams',
        details: [
          { name: 'HashMap Bucket Chaining', desc: 'Time: O(1) average. Collisions resolved via linked lists / trees.' },
          { name: 'Functional Stream API', desc: 'Lazy evaluation pipelines: filter() and map() compile items dynamically.' }
        ]
      };
    default:
      return null;
  }
};

// Java Code Templates
const getJavaOOPCodeTemplate = (topic) => {
  switch (topic) {
    case 'Basics':
      return `public class JavaBasics {
    public static void main(String[] args) {
        // 1. Primitive Variable declaration
        int x = 10;
        
        // 2. Type Casting (Implicit & Explicit)
        double y = x; // Implicit casting (int to double)
        int castedBack = (int) y; // Explicit casting (double to int)
        
        System.out.println("y: " + y + ", casted: " + castedBack);

        // 3. Pattern printing loop (Nested constructs)
        int rows = 4;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}`;
    case 'Arrays':
      return `import java.util.Arrays;

public class ArrayOptimization {
    // 1. Transpose a square matrix in-place
    public static void transpose(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
    }

    // 2. Sliding Window (Maximum sum subarray of size K)
    public static int maxSubarraySum(int[] arr, int k) {
        int n = arr.length;
        if (n < k) return -1;
        
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];
        
        int maxSum = windowSum;
        for (int i = k; i < n; i++) {
            windowSum += arr[i] - arr[i - k]; // Slide window
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        int[] arr = {2, 1, 5, 1, 3, 2};
        System.out.println("Max subarray sum of size 3: " + maxSubarraySum(arr, 3));
    }
}`;
    case 'Recursion':
      return `public class NQueensBacktracking {
    static final int N = 4;

    static boolean isSafe(int[][] board, int row, int col) {
        int i, j;
        for (i = 0; i < col; i++) if (board[row][i] == 1) return false;
        for (i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 1) return false;
        for (i = row, j = col; i < N && j >= 0; i++, j--) if (board[i][j] == 1) return false;
        return true;
    }

    static boolean solveNQUtil(int[][] board, int col) {
        if (col >= N) return true;
        for (int i = 0; i < N; i++) {
            if (isSafe(board, i, col)) {
                board[i][col] = 1; // Recurse: place queen
                if (solveNQUtil(board, col + 1)) return true;
                board[i][col] = 0; // Backtrack
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] board = new int[N][N];
        if (solveNQUtil(board, 0)) {
            for (int[] row : board) {
                for (int cell : row) System.out.print(cell + " ");
                System.out.println();
            }
        }
    }
}`;
    case 'OOP':
      return `// OOP Principles: Encapsulation, Inheritance, Overriding & Dynamic Binding
abstract class Animal {
    private String name; // Encapsulation: private field
    
    public Animal(String name) { this.name = name; }
    public String getName() { return name; }
    
    public abstract void makeSound(); // Abstraction
}

class Dog extends Animal { // Inheritance
    public Dog(String name) { super(name); }

    @Override
    public void makeSound() { // Overriding
        System.out.println(getName() + " says: Woof! Woof!");
    }
}

class Cat extends Animal {
    public Cat(String name) { super(name); }

    @Override
    public void makeSound() { // Overriding
        System.out.println(getName() + " says: Meow! Meow!");
    }
}

public class OOPDemo {
    public static void main(String[] args) {
        // Polymorphism: Base class reference pointing to Subclass objects
        Animal ref = new Dog("Buddy"); 
        ref.makeSound(); // Dynamic Binding: resolves to Dog.makeSound() at runtime
        
        ref = new Cat("Whiskers");
        ref.makeSound(); // Resolves to Cat.makeSound()
    }
}`;
    case 'Exceptions':
      return `import java.io.*;

// Custom exception
class InvalidFileException extends Exception {
    public InvalidFileException(String msg) { super(msg); }
}

public class ExceptionAndFileDemo {
    public static void readFile(String path) throws InvalidFileException {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            String line = br.readLine();
            System.out.println("First line: " + line);
        } catch (FileNotFoundException e) {
            // Exception propagation & wrapping
            throw new InvalidFileException("Target file not found: " + e.getMessage());
        } catch (IOException e) {
            System.out.println("IO Error: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        try {
            readFile("invalid.txt");
        } catch (InvalidFileException e) {
            System.out.println("Custom Exception caught: " + e.getMessage());
        }
    }
}`;
    case 'Collections':
      return `import java.util.*;
import java.util.stream.*;

public class CollectionsAndStreams {
    public static void main(String[] args) {
        // 1. HashMap mapping keys to values
        Map<String, Integer> map = new HashMap<>();
        map.put("Alice", 25);
        map.put("Bob", 30);
        map.put("Charlie", 15);

        // 2. Stream API - Filter, Map and Collect (Lambdas)
        List<String> names = map.keySet().stream()
            .filter(name -> map.get(name) >= 20) // Lambda filter
            .map(String::toUpperCase)          // Method reference map
            .collect(Collectors.toList());

        System.out.println("Filtered & Mapped Names: " + names);
    }
}`;
    default:
      return '';
  }
};

const JavaOOPVisualizer = ({ onBack, openSettings, onCopyCode, onCodeChange, fontSize = 14, wordWrap = 'off', onShowUpcomingFeatures }) => {
  const [activeTab, setActiveTab] = useState('Basics'); // 'Basics' | 'Arrays' | 'Recursion' | 'OOP' | 'Exceptions' | 'Collections'
  const [showCode, setShowCode] = useState(false);
  const [showComplexity, setShowComplexity] = useState(true);
  const [speed, setSpeed] = useState(400);
  const [copied, setCopied] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);

  // Trace log variables
  const [showLogPanel, setShowLogPanel] = useState(true);
  const [logPosition, setLogPosition] = useState({ x: 20, y: 120 });
  const [isDraggingLog, setIsDraggingLog] = useState(false);
  const [logSize, setLogSize] = useState({ width: 580, height: 300 });
  const [activeStateWidth, setActiveStateWidth] = useState(240);
  const [codeWidth, setCodeWidth] = useState(450);

  const logDragStart = useRef({ x: 0, y: 0 });
  const logPanelStart = useRef({ x: 0, y: 0 });
  const logContainerRef = useRef(null);

  // Interactive configurations
  // Basics inputs
  const [castSourceVal, setCastSourceVal] = useState('10');
  // Arrays inputs
  const [matrixSize, setMatrixSize] = useState(3);
  const [array1DInput, setArray1DInput] = useState('2, 1, 5, 1, 3, 2');
  const [windowK, setWindowK] = useState(3);
  // OOP inputs
  const [oopInstType, setOopInstType] = useState('Dog');
  const [oopInstName, setOopInstName] = useState('Buddy');

  // Timeline / Frames
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentCode = getJavaOOPCodeTemplate(activeTab);

  useEffect(() => {
    if (onCodeChange) onCodeChange(currentCode, 'Java');
  }, [currentCode]);

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

  const handleReset = () => {
    setTimeline([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleCopyCode = () => {
    copyToClipboard(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(currentCode, 'Java');
    }).catch(err => console.error("Clipboard copy failed:", err));
  };

  // Draggable panels events
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

  // -----------------------------------------------------------------
  // MODULE 1: Java Basics (Casting & Nested Loops Patterns)
  // -----------------------------------------------------------------
  const runBasicsFlow = () => {
    const val = parseInt(castSourceVal);
    if (isNaN(val)) {
      alert("Please enter a valid numeric value.");
      return;
    }
    let frames = [];
    let logs = ["Start Java basics simulation. Int value initialized."];

    // 1. Casting
    logs.push(`int x = ${val}; declared.`);
    frames.push({
      logs: [...logs],
      x: val,
      y: null,
      castedBack: null,
      patternRows: 0,
      patternOutputs: [],
      msg: `Variable x (int) declared with value ${val}.`
    });

    let y = parseFloat(val);
    logs.push(`Implicit casting (widening): double y = x; (y = ${y.toFixed(1)})`);
    frames.push({
      logs: [...logs],
      x: val,
      y: y,
      castedBack: null,
      patternRows: 0,
      patternOutputs: [],
      msg: `Casting int to double. Value automatically widened to double representation: ${y.toFixed(1)}`
    });

    let castedBack = Math.round(y);
    logs.push(`Explicit casting (narrowing): int casted = (int) y; (value: ${castedBack})`);
    frames.push({
      logs: [...logs],
      x: val,
      y: y,
      castedBack: castedBack,
      patternRows: 0,
      patternOutputs: [],
      msg: `Manual conversion back to integer using (int) casting. Value converted: ${castedBack}`
    });

    // 2. Nested loop pattern printing
    logs.push("Executing nested loops for pattern printing (Pyramid structure)...");
    let rowsCount = 4;
    let patternAccumulator = [];

    for (let r = 1; r <= rowsCount; r++) {
      let rowStr = '';
      logs.push(`Outer Loop: Row i = ${r}`);
      for (let c = 1; c <= r; c++) {
        rowStr += '* ';
        logs.push(`  Inner Loop: Column j = ${c} ➔ printed '*'`);
        
        let currentPrints = [...patternAccumulator, rowStr];
        frames.push({
          logs: [...logs],
          x: val,
          y: y,
          castedBack: castedBack,
          patternRows: r,
          activeCol: c,
          patternOutputs: currentPrints,
          msg: `Nested Loop: Printing character for row ${r}, col ${c}.`
        });
      }
      patternAccumulator.push(rowStr);
    }
    logs.push("Basics simulation completed!");
    frames.push({
      logs: [...logs],
      x: val,
      y: y,
      castedBack: castedBack,
      patternRows: rowsCount,
      patternOutputs: [...patternAccumulator],
      msg: "Basics flow trace finished. casting variables & loop pattern outputs compiled."
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -----------------------------------------------------------------
  // MODULE 2: Arrays & Matrix Optimization (Rotate, Transpose, Window)
  // -----------------------------------------------------------------
  const runArrayOpt = (optType) => {
    let frames = [];
    let logs = [];

    if (optType === 'Rotate') {
      const raw = array1DInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
      if (raw.length === 0) return;
      logs.push(`Initial 1D Array: [${raw.join(', ')}]`);
      frames.push({
        optType,
        arr: [...raw],
        logs: [...logs],
        msg: "Rotate Array: Shift items right circular by 1 step."
      });

      let rotated = [...raw];
      let last = rotated[rotated.length - 1];
      logs.push(`Saved last element ${last} temporarily.`);
      frames.push({
        optType,
        arr: [...rotated],
        tempVal: last,
        logs: [...logs],
        msg: `Copy last element ${last} to hold variable.`
      });

      for (let i = rotated.length - 1; i > 0; i--) {
        rotated[i] = rotated[i - 1];
        logs.push(`Shifted index ${i-1} to index ${i}. Array: [${rotated.join(', ')}]`);
        frames.push({
          optType,
          arr: [...rotated],
          tempVal: last,
          shiftIdx: i,
          logs: [...logs],
          msg: `Shift element: arr[${i}] = arr[${i - 1}].`
        });
      }
      rotated[0] = last;
      logs.push(`Placed temp value ${last} at index 0. final: [${rotated.join(', ')}]`);
      frames.push({
        optType,
        arr: [...rotated],
        logs: [...logs],
        msg: "Completed circular shift. Shifted last element back to index 0."
      });

    } else if (optType === 'Transpose') {
      let matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      logs.push("Initial 3x3 Matrix grid loaded.");
      frames.push({
        optType,
        matrix: matrix.map(r => [...r]),
        logs: [...logs],
        msg: "Transpose: Swap matrix[i][j] with matrix[j][i] above diagonal."
      });

      let copyMat = matrix.map(r => [...r]);
      for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 3; j++) {
          logs.push(`Swapping index (${i}, ${j}) [value: ${copyMat[i][j]}] with (${j}, ${i}) [value: ${copyMat[j][i]}]`);
          let temp = copyMat[i][j];
          copyMat[i][j] = copyMat[j][i];
          copyMat[j][i] = temp;

          frames.push({
            optType,
            matrix: copyMat.map(r => [...r]),
            activeCoords: [i, j],
            logs: [...logs],
            msg: `Swap elements at coordinates (${i}, ${j}) and (${j}, ${i}).`
          });
        }
      }
      logs.push("Transpose completed successfully!");
      frames.push({
        optType,
        matrix: copyMat.map(r => [...r]),
        logs: [...logs],
        msg: "Matrix Transpose finished. Pointers successfully mapped."
      });

    } else if (optType === 'Window') {
      const raw = array1DInput.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
      const k = parseInt(windowK);
      if (raw.length < k || k <= 0) {
        alert("Subarray size K must be less than array length.");
        return;
      }
      logs.push(`Sliding Window: Finding max sum subarray of size K = ${k}.`);
      let windowSum = 0;
      for (let i = 0; i < k; i++) windowSum += raw[i];
      let maxSum = windowSum;

      logs.push(`Initial Window sum [0..${k-1}]: ${windowSum}`);
      frames.push({
        optType,
        arr: [...raw],
        windowStart: 0,
        windowEnd: k - 1,
        sum: windowSum,
        maxSum: maxSum,
        logs: [...logs],
        msg: `Compute initial window sum. Sum = ${windowSum}.`
      });

      for (let i = k; i < raw.length; i++) {
        let leftIdx = i - k;
        let oldVal = raw[leftIdx];
        let newVal = raw[i];
        windowSum += newVal - oldVal;
        
        let isMaxUpdate = windowSum > maxSum;
        maxSum = Math.max(maxSum, windowSum);

        logs.push(`Slided Window right. Subtracted index ${leftIdx} (${oldVal}), Added index ${i} (${newVal}). New Sum: ${windowSum}`);
        frames.push({
          optType,
          arr: [...raw],
          windowStart: leftIdx + 1,
          windowEnd: i,
          sum: windowSum,
          maxSum: maxSum,
          logs: [...logs],
          msg: `Slide Window: Subtract arr[${leftIdx}] (${oldVal}), Add arr[${i}] (${newVal}). Sum = ${windowSum}.` + (isMaxUpdate ? " Update Max Sum!" : "")
        });
      }

      logs.push(`Sliding Window completed. Maximum sub-segment sum of size ${k} is ${maxSum}`);
      frames.push({
        optType,
        arr: [...raw],
        windowStart: -1,
        windowEnd: -1,
        maxSum: maxSum,
        logs: [...logs],
        msg: `Completed! Maximum subarray sum is ${maxSum}.`
      });
    }

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -----------------------------------------------------------------
  // MODULE 3: Recursion & Backtracking (Call Stack Trace & N-Queens)
  // -----------------------------------------------------------------
  const runNQueens = () => {
    let board = Array.from({ length: 4 }, () => Array(4).fill(0));
    let frames = [];
    let logs = ["N-Queens (4x4): Place 4 queens so that no two queens attack each other."];
    let callStack = [];

    const isSafe = (b, r, c) => {
      // row check
      for (let col = 0; col < c; col++) {
        if (b[r][col] === 1) return false;
      }
      // upper left diagonal
      for (let i = r, j = c; i >= 0 && j >= 0; i--, j--) {
        if (b[i][j] === 1) return false;
      }
      // lower left diagonal
      for (let i = r, j = c; i < 4 && j >= 0; i++, j--) {
        if (b[i][j] === 1) return false;
      }
      return true;
    };

    const solveNQ = (b, col) => {
      callStack.push(`solve(col=${col})`);
      logs.push(`Entered solve(col=${col}). Stack size: ${callStack.length}`);
      
      frames.push({
        board: b.map(row => [...row]),
        col,
        activeCell: null,
        stack: [...callStack],
        logs: [...logs],
        msg: `Recursive call: checking columns for col ${col}.`
      });

      if (col >= 4) {
        logs.push("All 4 queens placed successfully! Solution found.");
        frames.push({
          board: b.map(row => [...row]),
          col,
          stack: [...callStack],
          logs: [...logs],
          msg: "Base Case: Col >= 4. Solution reached successfully!"
        });
        return true;
      }

      for (let i = 0; i < 4; i++) {
        logs.push(`Checking cell (${i}, ${col})`);
        let safe = isSafe(b, i, col);
        
        frames.push({
          board: b.map(row => [...row]),
          col,
          activeCell: [i, col],
          stack: [...callStack],
          logs: [...logs],
          msg: safe ? `Cell (${i}, ${col}) is SAFE. Placing Queen...` : `Cell (${i}, ${col}) is UNDER ATTACK. Skip.`
        });

        if (safe) {
          b[i][col] = 1;
          logs.push(`Placed Queen at (${i}, ${col})`);
          frames.push({
            board: b.map(row => [...row]),
            col,
            activeCell: null,
            stack: [...callStack],
            logs: [...logs],
            msg: `Placed Queen at (${i}, ${col}). Move to next column.`
          });

          if (solveNQ(b, col + 1)) return true;

          // Backtrack
          b[i][col] = 0;
          logs.push(`Backtracking: Removed Queen from (${i}, ${col})`);
          frames.push({
            board: b.map(row => [...row]),
            col,
            activeCell: [i, col],
            stack: [...callStack],
            logs: [...logs],
            msg: `Recurse failed. Backtrack: remove Queen from (${i}, ${col}).`
          });
        }
      }

      callStack.pop();
      logs.push(`solve(col=${col}) finished. Popped from Stack.`);
      frames.push({
        board: b.map(row => [...row]),
        col,
        stack: [...callStack],
        logs: [...logs],
        msg: `Return false. Popped frame solve(col=${col}).`
      });
      return false;
    };

    solveNQ(board, 0);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -----------------------------------------------------------------
  // MODULE 4: OOP Memory Allocation & Runtime Binding
  // -----------------------------------------------------------------
  const runOOPMemory = () => {
    let frames = [];
    let logs = ["Start OOP Memory & Polymorphism trace."];

    // Reference declaration
    logs.push("Animal ref; declared in main()'s Stack Frame.");
    frames.push({
      refName: 'ref',
      refAddr: null,
      heapObjects: [],
      methodOutput: '',
      logs: [...logs],
      msg: "OOP: Declare parent reference pointer on stack: Animal ref."
    });

    // Object creation
    let targetAddr = oopInstType === 'Dog' ? '0x8A7B' : '0x9E2C';
    logs.push(`ref = new ${oopInstType}("${oopInstName}"); called.`);
    logs.push(`Constructor: Allocated instance in Heap Memory at address ${targetAddr}.`);
    
    let heapObjects = [{
      addr: targetAddr,
      type: oopInstType,
      fields: { name: oopInstName }
    }];

    frames.push({
      refName: 'ref',
      refAddr: targetAddr,
      heapObjects: [...heapObjects],
      methodOutput: '',
      logs: [...logs],
      msg: `Constructor allocation: allocated new ${oopInstType} object in Heap memory.`
    });

    // Polymorphism method call
    logs.push("Calling ref.makeSound();");
    logs.push(`Dynamic Binding: Reference points to ${oopInstType} object. Look up overridden makeSound() inside Class method Table.`);
    
    let outputStr = oopInstType === 'Dog' ? `${oopInstName} says: Woof! Woof!` : `${oopInstName} says: Meow! Meow!`;
    logs.push(`Executing ${oopInstType}.makeSound() ➔ "${outputStr}"`);

    frames.push({
      refName: 'ref',
      refAddr: targetAddr,
      heapObjects: [...heapObjects],
      methodOutput: outputStr,
      activeMethodLookup: true,
      logs: [...logs],
      msg: `Runtime Resolution: dynamic method binding resolves ref.makeSound() to ${oopInstType}.makeSound().`
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -----------------------------------------------------------------
  // MODULE 5: Exceptions & Streams Visualizer
  // -----------------------------------------------------------------
  const runExceptionsFlow = () => {
    let frames = [];
    let logs = ["Start Custom Exceptions & File Byte Stream trace."];

    // 1. Try-Catch propagation
    let stack = ['main()', 'readFile("invalid.txt")'];
    logs.push("main() calls readFile(\"invalid.txt\"). BufferedReader tries to load FileReader.");
    frames.push({
      callStack: [...stack],
      activeFrame: 1,
      exceptionBubble: null,
      logs: [...logs],
      msg: "Exceptions: BufferedReader attempts to open file. Encapsulated in try block."
    });

    logs.push("File not found! FileReader throws FileNotFoundException.");
    frames.push({
      callStack: [...stack],
      activeFrame: 1,
      exceptionBubble: 'FileNotFoundException',
      logs: [...logs],
      msg: "FileNotFoundException generated in FileReader (lower level API)."
    });

    // Bubble up and wrap
    stack.pop();
    logs.push("readFile() catches FileNotFoundException. Wraps it and throws custom InvalidFileException.");
    frames.push({
      callStack: [...stack],
      activeFrame: 0,
      exceptionBubble: 'InvalidFileException (Custom)',
      logs: [...logs],
      msg: "Exception wraps & propagates: thrown as custom InvalidFileException to caller main()."
    });

    logs.push("main() catches InvalidFileException inside catch block.");
    frames.push({
      callStack: [...stack],
      activeFrame: 0,
      exceptionBubble: null,
      caughtException: 'InvalidFileException',
      logs: [...logs],
      msg: "Exception Caught! main()'s catch block executes. Program handles it safely without crashing."
    });

    // 2. Streams flow
    logs.push("Simulating Byte Stream File I/O transfer...");
    let buffer = [];
    let fileBytes = ['H', 'e', 'l', 'l', 'o'];

    for (let i = 0; i < fileBytes.length; i++) {
      buffer.push(fileBytes[i]);
      logs.push(`Byte Stream: read byte '${fileBytes[i]}' into memory buffer.`);
      frames.push({
        callStack: [...stack],
        activeFrame: -1,
        fileBytesLeft: fileBytes.slice(i + 1),
        streamBuffer: [...buffer],
        logs: [...logs],
        msg: `FileInputStream: Streaming data byte '${fileBytes[i]}' from file to buffer.`
      });
    }

    logs.push("File reading completed successfully.");
    frames.push({
      callStack: [...stack],
      activeFrame: -1,
      fileBytesLeft: [],
      streamBuffer: [...buffer],
      logs: [...logs],
      msg: "Byte Stream completed. Buffer populated."
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // -----------------------------------------------------------------
  // MODULE 6: Collections & Functional Streams Visualizer
  // -----------------------------------------------------------------
  const runCollectionsStreams = () => {
    let frames = [];
    let logs = ["Start Java Collections & Functional Stream API trace."];

    // 1. HashMap hashing and chains
    let map = {
      'Alice': 25,
      'Bob': 30,
      'Charlie': 15
    };
    logs.push("Populating Java HashMap: map.put('Alice', 25), put('Bob', 30), put('Charlie', 15)...");
    
    // Virtual bucket mapping (simulating hash index mapping)
    let buckets = Array(4).fill(null).map(() => []);
    buckets[0].push({ key: 'Bob', val: 30 }); // Bob hashes to bucket 0
    buckets[2].push({ key: 'Alice', val: 25 }); // Alice hashes to bucket 2
    buckets[2].push({ key: 'Charlie', val: 15 }); // Charlie collision: chains to bucket 2

    frames.push({
      mapBuckets: buckets.map(b => [...b]),
      streamElements: [],
      logs: [...logs],
      msg: "Collections: Key-value entries placed into hash buckets. Collision resolved via chaining at bucket [2]."
    });

    // 2. Stream API conveyor filter/map
    let namesList = ['Alice', 'Bob', 'Charlie'];
    logs.push("Executing functional Stream pipeline on map keys...");
    logs.push("names = map.keySet().stream();");
    
    let streamElements = namesList.map(name => ({ name, val: map[name], state: 'initial' }));
    frames.push({
      mapBuckets: buckets.map(b => [...b]),
      streamElements: JSON.parse(JSON.stringify(streamElements)),
      logs: [...logs],
      msg: "Stream Pipeline initialized with keys list."
    });

    // Filter stage
    logs.push("Pipeline Stage 1: filter(name -> map.get(name) >= 20)");
    streamElements = streamElements.map(el => {
      let passed = el.val >= 20;
      logs.push(`  Checking '${el.name}' (Age: ${el.val}) ➔ ` + (passed ? "Passed filter" : "Failed filter (Discarded)"));
      return { ...el, state: passed ? 'filtered' : 'failed' };
    });
    frames.push({
      mapBuckets: buckets.map(b => [...b]),
      streamElements: JSON.parse(JSON.stringify(streamElements)),
      logs: [...logs],
      msg: "Filter evaluation: Charlie (15 < 20) falls off the conveyor stream."
    });

    // Map stage
    logs.push("Pipeline Stage 2: map(String::toUpperCase)");
    streamElements = streamElements.map(el => {
      if (el.state === 'filtered') {
        let upper = el.name.toUpperCase();
        logs.push(`  Mapped '${el.name}' to '${upper}'`);
        return { ...el, name: upper, state: 'mapped' };
      }
      return el;
    });
    frames.push({
      mapBuckets: buckets.map(b => [...b]),
      streamElements: JSON.parse(JSON.stringify(streamElements)),
      logs: [...logs],
      msg: "Map mapping: Remaining name strings capitalized."
    });

    // Collect stage
    let collectedResult = streamElements.filter(el => el.state === 'mapped').map(el => el.name);
    logs.push(`Pipeline Stage 3: collect() ➔ final output: [${collectedResult.join(', ')}]`);
    frames.push({
      mapBuckets: buckets.map(b => [...b]),
      streamElements: JSON.parse(JSON.stringify(streamElements)),
      collectedResult,
      logs: [...logs],
      msg: `Collected output: [${collectedResult.join(', ')}].`
    });

    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const currentFrame = timeline[currentStep] || {
    logs: [],
    msg: "Select a topic, configure inputs, and click Play or Animate to start tracing Java execution."
  };

  const progress = timeline.length > 1 ? (currentStep / (timeline.length - 1)) * 100 : 0;

  // -----------------------------------------------------------------
  // RENDER GRAPHICAL CANVAS ACCORDING TO ACTIVE TOPIC
  // -----------------------------------------------------------------

  const renderBasicsCanvas = () => {
    const { x = '-', y = null, castedBack = null, patternOutputs = [] } = currentFrame;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
        
        {/* Casting cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>1. Variable Type Casting (Implicit vs Explicit)</h4>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            {/* int x */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1.5px solid var(--glass-border)', borderRadius: '12px', padding: '10px 15px', width: '130px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>int x</div>
              <strong style={{ fontSize: '1.4rem', color: '#3b82f6' }}>{x}</strong>
            </div>
            
            {/* arrow widening */}
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>➔</div>

            {/* double y */}
            <div style={{ 
              background: y !== null ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255,255,255,0.01)', 
              border: y !== null ? '1.5px solid #3b82f6' : '1.5px solid var(--glass-border)', 
              borderRadius: '12px', padding: '10px 15px', width: '130px', textAlign: 'center', transition: 'all 0.25s' 
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>double y</div>
              <strong style={{ fontSize: '1.4rem', color: y !== null ? '#60a5fa' : 'var(--text-secondary)' }}>
                {y !== null ? y.toFixed(1) : '-'}
              </strong>
            </div>

            {/* arrow narrowing */}
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>➔</div>

            {/* int casted */}
            <div style={{ 
              background: castedBack !== null ? 'rgba(236, 72, 153, 0.12)' : 'rgba(255,255,255,0.01)', 
              border: castedBack !== null ? '1.5px solid #ec4899' : '1.5px solid var(--glass-border)', 
              borderRadius: '12px', padding: '10px 15px', width: '130px', textAlign: 'center', transition: 'all 0.25s' 
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>(int) casted</div>
              <strong style={{ fontSize: '1.4rem', color: castedBack !== null ? '#f472b6' : 'var(--text-secondary)' }}>
                {castedBack !== null ? castedBack : '-'}
              </strong>
            </div>
          </div>
        </div>

        {/* Pattern outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>2. Pattern Loop Print (Nested dry-run console)</h4>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', border: '1.5px solid var(--glass-border)', 
            borderRadius: '12px', padding: '15px', flex: 1, fontFamily: 'monospace', 
            fontSize: '1.1rem', color: '#10b981', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', minHeight: '120px'
          }}>
            {patternOutputs.map((line, idx) => (
              <div key={idx} style={{ letterSpacing: '3px', animation: 'fadeIn 0.2s ease' }}>{line}</div>
            ))}
            {patternOutputs.length === 0 && (
              <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem' }}>Console output is empty.</span>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderArraysCanvas = () => {
    const { optType, arr = [], tempVal, shiftIdx, matrix = [], activeCoords, windowStart, windowEnd, sum, maxSum } = currentFrame;

    if (!optType) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Select an array operation and click run to visualize matrix/sliding window logic.
        </div>
      );
    }

    if (optType === 'Rotate' || optType === 'Window') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem', padding: '1rem', justifyContent: 'center', overflow: 'auto' }}>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
            {/* Temp register box */}
            {optType === 'Rotate' && tempVal !== undefined && (
              <div style={{ background: 'rgba(251,146,60,0.15)', border: '1.5px solid #fb923c', borderRadius: '12px', padding: '8px 15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Temp Hold</div>
                <strong style={{ color: '#fb923c', fontSize: '1.2rem' }}>{tempVal}</strong>
              </div>
            )}

            {/* Sum/Max registers for Sliding Window */}
            {optType === 'Window' && (
              <>
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1.5px solid #3b82f6', borderRadius: '12px', padding: '8px 15px', textAlign: 'center', minWidth: '95px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Window Sum</div>
                  <strong style={{ color: '#60a5fa', fontSize: '1.25rem' }}>{sum !== undefined ? sum : '-'}</strong>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981', borderRadius: '12px', padding: '8px 15px', textAlign: 'center', minWidth: '95px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Max Sum</div>
                  <strong style={{ color: '#34d399', fontSize: '1.25rem' }}>{maxSum !== undefined ? maxSum : '-'}</strong>
                </div>
              </>
            )}
          </div>

          {/* Contiguous elements */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
            {arr.map((val, idx) => {
              const isShifting = optType === 'Rotate' && idx === shiftIdx;
              const inWindow = optType === 'Window' && windowStart !== -1 && idx >= windowStart && idx <= windowEnd;
              const isWindowBound = optType === 'Window' && (idx === windowStart || idx === windowEnd);

              let border = '1.5px solid var(--glass-border)';
              let bg = 'rgba(255,255,255,0.02)';
              let color = 'white';

              if (isShifting) {
                border = '2px solid #fb923c';
                bg = 'rgba(251,146,60,0.2)';
              } else if (inWindow) {
                border = isWindowBound ? '2px solid #3b82f6' : '1px solid rgba(59,130,246,0.3)';
                bg = 'rgba(59, 130, 246, 0.2)';
                color = '#60a5fa';
              }

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ 
                    width: '55px', height: '55px', 
                    borderRadius: '12px', border, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 'bold', color,
                    transition: 'all 0.2s ease'
                  }}>
                    {val}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>[{idx}]</span>
                </div>
              );
            })}
          </div>

        </div>
      );
    } else { // Transpose
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '1rem' }}>
          <table style={{ borderCollapse: 'collapse', color: 'white', fontFamily: 'monospace', fontSize: '1.2rem' }}>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => {
                    const isSwap = activeCoords && ((activeCoords[0] === r && activeCoords[1] === c) || (activeCoords[0] === c && activeCoords[1] === r));
                    const isDiagonal = r === c;
                    
                    let bg = 'rgba(255,255,255,0.02)';
                    let border = '1.5px solid var(--glass-border)';

                    if (isSwap) {
                      bg = 'rgba(139,92,246,0.3)';
                      border = '2px solid var(--accent-primary)';
                    } else if (isDiagonal) {
                      bg = 'rgba(236,72,153,0.12)';
                      border = '1px solid rgba(236,72,153,0.3)';
                    }

                    return (
                      <td key={c} style={{ 
                        width: '55px', height: '55px', 
                        border, background: bg, textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const renderRecursionCanvas = () => {
    const { board = [], col, activeCell, stack = [] } = currentFrame;
    if (board.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          {'Click "Animate N-Queens" to trace recursive calls & chessboard backtracking.'}
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
        
        {/* Chessboard grid */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>👑 4x4 Chessboard</h3>
          <div style={{ display: 'inline-block', margin: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', border: '2px solid var(--glass-border)' }}>
              <tbody>
                {board.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => {
                      const isQueen = cell === 1;
                      const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;
                      const isDark = (r + c) % 2 === 1;

                      let bg = isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.03)';
                      let border = '1px solid var(--glass-border)';

                      if (isActive) {
                        bg = 'rgba(239, 68, 68, 0.25)';
                        border = '2px solid #ef4444';
                      } else if (isQueen) {
                        bg = 'rgba(16, 185, 129, 0.2)';
                        border = '1.5px solid #10b981';
                      }

                      return (
                        <td key={c} style={{ 
                          width: '55px', height: '55px', 
                          border, background: bg, textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}>
                          {isQueen && <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 5px #10b981)' }}>♛</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stack Frame box display */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>📚 Recursion Stack Frames</h3>
          <div style={{ 
            display: 'flex', flexDirection: 'column-reverse', gap: '8px', 
            flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.2)', 
            border: '1px dashed var(--glass-border)', borderRadius: '10px', padding: '10px'
          }}>
            {stack.map((frame, idx) => (
              <div key={idx} style={{ 
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                border: '1.5px solid rgba(139,92,246,0.3)', borderRadius: '8px',
                padding: '8px 12px', textAlign: 'center', fontSize: '0.82rem',
                fontFamily: 'monospace', color: '#a78bfa', fontWeight: 'bold',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                {frame}
              </div>
            ))}
            {stack.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.78rem', textAlign: 'center', margin: 'auto' }}>
                Stack is empty.
              </div>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderOOPCanvas = () => {
    const { refName, refAddr, heapObjects = [], methodOutput, activeMethodLookup } = currentFrame;

    if (!refName) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Click Instantiate Object to trace Stack frames, Heap allocations, and overridden method execution.
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
        
        {/* Stack frame block */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>🥞 Stack Memory</h3>
          <div style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>
              Stack Frame: main()
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'monospace' }}>
              <span>Animal ref</span>
              <strong style={{ color: refAddr ? '#3b82f6' : 'var(--text-secondary)' }}>
                {refAddr ? `ref ➔ ${refAddr}` : 'null'}
              </strong>
            </div>
            
            {methodOutput && (
              <div style={{ 
                marginTop: 'auto', background: 'rgba(16, 185, 129, 0.12)', 
                border: '1.5px solid #10b981', borderRadius: '8px', padding: '8px 12px', 
                fontSize: '0.85rem', fontFamily: 'monospace', color: '#34d399', textAlign: 'center' 
              }}>
                Method Output:<br /><strong>&quot;{methodOutput}&quot;</strong>
              </div>
            )}
          </div>
        </div>

        {/* Heap objects */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>🌳 Heap Memory</h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.15)', border: '1.5px dashed var(--glass-border)', 
            borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center', gap: '10px', flex: 1 
          }}>
            {heapObjects.map((obj, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(255,255,255,0.03)', border: activeMethodLookup ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)', 
                borderRadius: '12px', padding: '12px', width: '90%', transition: 'all 0.25s' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px', marginBottom: '6px' }}>
                  <span>Address: {obj.addr}</span>
                  <strong style={{ color: '#fb923c' }}>{obj.type} Object</strong>
                </div>
                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>super.name: <strong style={{ color: '#60a5fa' }}>&quot;{obj.fields.name}&quot;</strong></div>
                </div>
                {activeMethodLookup && (
                  <div style={{ 
                    marginTop: '8px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', color: '#60a5fa', textAlign: 'center', fontWeight: 'bold'
                  }}>
                    🔍 Bound overridden makeSound()
                  </div>
                )}
              </div>
            ))}
            {heapObjects.length === 0 && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Heap is empty.
              </span>
            )}
          </div>
        </div>

      </div>
    );
  };

  const renderExceptionsCanvas = () => {
    const { callStack = [], activeFrame, exceptionBubble, caughtException, fileBytesLeft = [], streamBuffer = [] } = currentFrame;

    if (callStack.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Click run to simulate try-catch exception bubbles and File streams.
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
        
        {/* Exception stacks */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>⚠️ Try-Catch Exception</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px', flex: 1, justifyItems: 'center' }}>
            {callStack.map((frame, idx) => {
              const isActive = idx === activeFrame;
              let border = '1px solid var(--glass-border)';
              let bg = 'rgba(255,255,255,0.01)';

              if (isActive) {
                border = '2px solid var(--accent-primary)';
                bg = 'rgba(139,92,246,0.15)';
              }

              return (
                <div key={idx} style={{ 
                  border, background: bg, borderRadius: '8px', 
                  padding: '8px 12px', textAlign: 'center', fontSize: '0.78rem',
                  fontFamily: 'monospace', position: 'relative'
                }}>
                  <span>{frame}</span>
                  {isActive && exceptionBubble && (
                    <div style={{ 
                      position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                      background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px',
                      fontSize: '0.65rem', fontWeight: 'bold', boxShadow: '0 4px 8px rgba(239,68,68,0.4)',
                      animation: 'pulse 1s infinite'
                    }}>
                      ⚡ {exceptionBubble}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Byte streams */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>💾 FileInputStream stream</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, justifyContent: 'center' }}>
            {/* File Source */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span>File Data:</span>
              <strong style={{ fontFamily: 'monospace', color: '#fb923c' }}>
                {fileBytesLeft.length > 0 ? fileBytesLeft.join('') : '-'}
              </strong>
            </div>

            {/* stream pipe */}
            <div style={{ height: '10px', background: 'var(--glass-border)', borderRadius: '5px', position: 'relative', overflow: 'hidden' }}>
              {streamBuffer.length > 0 && fileBytesLeft.length > 0 && (
                <div style={{ 
                  position: 'absolute', width: '15px', height: '100%', background: '#60a5fa',
                  borderRadius: '50%', animation: 'slideRight 0.8s infinite linear'
                }}></div>
              )}
            </div>

            {/* Target Buffer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Buffered Output:</span>
              <div style={{ 
                minHeight: '40px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: '8px', display: 'flex', gap: '5px', padding: '6px', alignItems: 'center', justifyContent: 'center'
              }}>
                {streamBuffer.map((b, idx) => (
                  <div key={idx} style={{ 
                    background: 'rgba(59,130,246,0.15)', border: '1px solid #3b82f6', 
                    borderRadius: '4px', padding: '2px 6px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#60a5fa' 
                  }}>
                    {b}
                  </div>
                ))}
                {streamBuffer.length === 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Buffer empty</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderCollectionsCanvas = () => {
    const { mapBuckets = [], streamElements = [], collectedResult = [] } = currentFrame;

    if (mapBuckets.length === 0 && streamElements.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Click run to map keys to HashMap chains and trace Stream operations.
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: '100%', gap: '1.5rem', padding: '1rem', overflowY: 'auto' }}>
        
        {/* HashMap bucket visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>🔑 HashMap Buckets</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
            {mapBuckets.map((bucket, bIdx) => (
              <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.15)', padding: '6px 10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'monospace', minWidth: '40px' }}>Bucket {bIdx}</span>
                <span style={{ color: 'var(--glass-border)', fontSize: '0.8rem' }}>➔</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {bucket.map((entry, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', 
                      borderRadius: '6px', padding: '3px 8px', fontSize: '0.75rem', fontFamily: 'monospace' 
                    }}>
                      {entry.key}: <strong style={{ color: '#fb923c' }}>{entry.val}</strong>
                    </div>
                  ))}
                  {bucket.length === 0 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>null</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conveyor belt streams visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '1rem' }}>
          <h3 className="title-gradient" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>🌊 Stream Conveyor</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Stream elements:</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {streamElements.map((el, idx) => {
                let border = '1px solid var(--glass-border)';
                let bg = 'rgba(255,255,255,0.02)';
                let color = 'white';

                if (el.state === 'filtered') {
                  border = '1px solid #3b82f6';
                  bg = 'rgba(59, 130, 246, 0.1)';
                  color = '#60a5fa';
                } else if (el.state === 'mapped') {
                  border = '1px solid #ec4899';
                  bg = 'rgba(236,72,153,0.1)';
                  color = '#f472b6';
                } else if (el.state === 'failed') {
                  border = '1px dashed #ef4444';
                  bg = 'rgba(239, 68, 68, 0.05)';
                  color = 'var(--text-secondary)';
                }

                return (
                  <div key={idx} style={{ 
                    border, background: bg, borderRadius: '8px', 
                    padding: '6px 12px', display: 'flex', justifyContent: 'space-between', 
                    alignItems: 'center', fontSize: '0.78rem', fontFamily: 'monospace',
                    textDecoration: el.state === 'failed' ? 'line-through' : 'none'
                  }}>
                    <span>{el.name} (Val: {el.val})</span>
                    <strong style={{ fontSize: '0.7rem', color: el.state === 'failed' ? '#ef4444' : '#10b981' }}>
                      {el.state === 'failed' ? 'Dropped' : el.state === 'initial' ? 'Pending' : el.state === 'filtered' ? 'Filtered' : 'Mapped'}
                    </strong>
                  </div>
                );
              })}
            </div>

            {collectedResult.length > 0 && (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid #10b981', 
                borderRadius: '8px', padding: '6px', fontSize: '0.8rem', color: '#34d399',
                textAlign: 'center', fontFamily: 'monospace'
              }}>
                Collected: [<strong>{collectedResult.join(', ')}</strong>]
              </div>
            )}
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
          <h1 className="title-gradient" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Java OOP Studio</h1>
        </div>

        {/* Curriculum Navigation Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '3px', gap: '3px' }}>
          {[
            { id: 'Basics', name: '📚 Basics' },
            { id: 'Arrays', name: '🧮 Arrays' },
            { id: 'Recursion', name: '👑 Recursion' },
            { id: 'OOP', name: '⚙️ OOP principles' },
            { id: 'Exceptions', name: '⚠️ Exceptions' },
            { id: 'Collections', name: '🔑 Collections' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#60a5fa' : 'var(--text-secondary)',
                border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal', fontSize: '0.82rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.name}
            </button>
          ))}
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
      <div style={{ display: 'flex', padding: '10px 20px', background: 'rgba(15, 23, 42, 0.3)', borderBottom: '1px solid var(--glass-border)', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexShrink: 0 }}>
        
        {/* Dynamic Inputs based on selected Tab */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
          
          {activeTab === 'Basics' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>int x value:</span>
                <input type="number" className="styled-input" style={{ width: '80px', padding: '5px 10px', fontSize: '0.88rem' }} value={castSourceVal} onChange={e => { setCastSourceVal(e.target.value); handleReset(); }} />
              </div>
              <button className="btn btn-insert" onClick={runBasicsFlow} disabled={isPlaying}>Animate Basics & casting</button>
            </>
          )}

          {activeTab === 'Arrays' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, maxWidth: '280px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Array:</span>
                <input type="text" className="styled-input" style={{ width: '100%', padding: '5px 10px', fontSize: '0.88rem' }} value={array1DInput} onChange={e => { setArray1DInput(e.target.value); handleReset(); }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>K size:</span>
                <input type="number" className="styled-input" style={{ width: '60px', padding: '5px 10px', fontSize: '0.88rem' }} value={windowK} onChange={e => { setWindowK(e.target.value); handleReset(); }} />
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className="btn btn-insert" onClick={() => runArrayOpt('Rotate')} disabled={isPlaying}>Rotate 1D</button>
                <button className="btn btn-insert" onClick={() => runArrayOpt('Transpose')} disabled={isPlaying}>Transpose 2D</button>
                <button className="btn btn-insert" onClick={() => runArrayOpt('Window')} disabled={isPlaying}>Sliding Window</button>
              </div>
            </div>
          )}

          {activeTab === 'Recursion' && (
            <>
              <button className="btn btn-insert" onClick={runNQueens} disabled={isPlaying}>Animate N-Queens Recursion</button>
            </>
          )}

          {activeTab === 'OOP' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Class:</span>
                <select className="styled-select" style={{ padding: '5px 25px 5px 10px', fontSize: '0.88rem', height: 'auto' }} value={oopInstType} onChange={e => { setOopInstType(e.target.value); handleReset(); }}>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Name:</span>
                <input type="text" className="styled-input" style={{ width: '100px', padding: '5px 10px', fontSize: '0.88rem' }} value={oopInstName} onChange={e => { setOopInstName(e.target.value); handleReset(); }} />
              </div>
              <button className="btn btn-insert" onClick={runOOPMemory} disabled={isPlaying}>Instantiate Object</button>
            </>
          )}

          {activeTab === 'Exceptions' && (
            <>
              <button className="btn btn-insert" onClick={runExceptionsFlow} disabled={isPlaying}>Animate Exception File streams</button>
            </>
          )}

          {activeTab === 'Collections' && (
            <>
              <button className="btn btn-insert" onClick={runCollectionsStreams} disabled={isPlaying}>Animate Collections Streams</button>
            </>
          )}

        </div>

        {/* Speed slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Speed:</span>
          <input 
            type="range" min="100" max="1500" step="100" 
            value={speed} onChange={e => setSpeed(parseInt(e.target.value))}
            style={{ width: '80px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* MAIN CONTENT BLOCK */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* VISUALIZER CANVAS AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 30, 0.3)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            
            {activeTab === 'Basics' && renderBasicsCanvas()}
            {activeTab === 'Arrays' && renderArraysCanvas()}
            {activeTab === 'Recursion' && renderRecursionCanvas()}
            {activeTab === 'OOP' && renderOOPCanvas()}
            {activeTab === 'Exceptions' && renderExceptionsCanvas()}
            {activeTab === 'Collections' && renderCollectionsCanvas()}

            {/* FLOATING COMPLEXITY CARD OVERLAY */}
            {showComplexity && (
              <div style={{ 
                position: 'absolute', top: '15px', right: '15px', zIndex: 30,
                width: '260px', background: 'rgba(15, 23, 42, 0.9)', border: '1.5px solid var(--glass-border)',
                borderRadius: '12px', padding: '12px', backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)', transition: 'all 0.3s ease'
              }}>
                {(() => {
                  const comp = getJavaConceptInfo(activeTab);
                  if (!comp) return null;
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>📊 Java Concept Details</span>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setShowComplexity(false)}>✕</button>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 'bold', marginBottom: '8px' }}>{comp.title}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {comp.details.map((detail, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.02)', padding: '4px 6px', borderRadius: '4px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{detail.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{detail.desc}</div>
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
              background: 'rgba(15, 23, 42, 0.9)',
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
                  {activeTab === 'Basics' && (
                    <>
                      <div>x (int): <strong style={{ color: '#3b82f6' }}>{currentFrame.x !== undefined ? currentFrame.x : '-'}</strong></div>
                      <div>y (double): <strong style={{ color: '#60a5fa' }}>{currentFrame.y !== null && currentFrame.y !== undefined ? currentFrame.y.toFixed(1) : '-'}</strong></div>
                      <div>castedBack: <strong style={{ color: '#ec4899' }}>{currentFrame.castedBack !== null && currentFrame.castedBack !== undefined ? currentFrame.castedBack : '-'}</strong></div>
                      <div>pyramidRows: <strong style={{ color: '#10b981' }}>{currentFrame.patternRows ?? '-'}</strong></div>
                    </>
                  )}
                  {activeTab === 'Arrays' && (
                    <>
                      <div>optType: <strong style={{ color: '#a78bfa' }}>{currentFrame.optType}</strong></div>
                      {currentFrame.tempVal !== undefined && <div>holdVal: <strong style={{ color: '#fb923c' }}>{currentFrame.tempVal}</strong></div>}
                      {currentFrame.shiftIdx !== undefined && <div>shiftIdx: <strong style={{ color: '#38bdf8' }}>{currentFrame.shiftIdx}</strong></div>}
                      {currentFrame.sum !== undefined && <div>windowSum: <strong style={{ color: '#60a5fa' }}>{currentFrame.sum}</strong></div>}
                      {currentFrame.maxSum !== undefined && <div>maxSubSum: <strong style={{ color: '#34d399' }}>{currentFrame.maxSum}</strong></div>}
                    </>
                  )}
                  {activeTab === 'Recursion' && (
                    <>
                      <div>col: <strong style={{ color: '#38bdf8' }}>{currentFrame.col ?? '-'}</strong></div>
                      {currentFrame.activeCell && <div>testing cell: <strong style={{ color: '#ef4444' }}>({currentFrame.activeCell[0]}, {currentFrame.activeCell[1]})</strong></div>}
                      {currentFrame.stack && <div>stack depth: <strong style={{ color: '#a78bfa' }}>{currentFrame.stack.length}</strong></div>}
                    </>
                  )}
                  {activeTab === 'OOP' && (
                    <>
                      <div>ref pointer: <strong style={{ color: '#a78bfa' }}>{currentFrame.refName ?? '-'}</strong></div>
                      <div>ref address: <strong style={{ color: '#60a5fa' }}>{currentFrame.refAddr ?? 'null'}</strong></div>
                      {currentFrame.heapObjects && <div>heap count: <strong style={{ color: '#fb923c' }}>{currentFrame.heapObjects.length}</strong></div>}
                    </>
                  )}
                  {activeTab === 'Exceptions' && (
                    <>
                      {currentFrame.exceptionBubble && <div>Active Error: <strong style={{ color: '#ef4444' }}>{currentFrame.exceptionBubble}</strong></div>}
                      {currentFrame.caughtException && <div>Handled: <strong style={{ color: '#34d399' }}>{currentFrame.caughtException}</strong></div>}
                      {currentFrame.streamBuffer && <div>Bytes Read: <strong style={{ color: '#60a5fa' }}>{currentFrame.streamBuffer.length}</strong></div>}
                    </>
                  )}
                  {activeTab === 'Collections' && (
                    <>
                      {currentFrame.collectedResult && <div>collected: <strong style={{ color: '#34d399' }}>{currentFrame.collectedResult.length}</strong></div>}
                    </>
                  )}
                </div>
              </div>

              {/* Col Resize bar */}
              <div 
                onMouseDown={handleActiveStateColDragStart}
                onTouchStart={handleActiveStateColDragStart}
                style={{ width: '4px', cursor: 'col-resize', background: 'transparent' }}
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
              <svg width="8" height="8" viewBox="0 0 8 8"><path d="M6 0 L8 0 L8 8 L0 8 L0 6 L4 6 L4 4 L6 4 Z" fill="rgba(255,255,255,0.3)"/></svg>
            </div>

          </div>
        )}

        {/* CODE PANELS / JAVA SYNTAX TEMPLATE ON RIGHT */}
        {showCode && (
          <div style={{ width: `${codeWidth}px`, borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', flexShrink: 0, position: 'relative' }}>
            
            {/* Header controls */}
            <div style={{ padding: '10px 15px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>☕ Java OOP Code Template</span>
              
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
        language="Java"
      />

    </div>
  );
};

export default JavaOOPVisualizer;
