/* eslint-disable react/prop-types, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getGeneralCodeTemplate } from './codeTemplatesGeneral';

const GeneralDSVisualizer = ({ onBack, openSettings, initialType = 'HASH_TABLE', initialVariety = 'HASH_LINEAR', onCopyCode, onCodeChange }) => {
  const [dsType, setDsType] = useState(initialType);
  const [dsVariety, setDsVariety] = useState(initialVariety);
  const [inputValue, setInputValue] = useState('');
  const [speed, setSpeed] = useState(400);
  const [tableSize, setTableSize] = useState(7);
  const [codeLanguage, setCodeLanguage] = useState('Java');
  const [showCode, setShowCode] = useState(true);
  const [theme, setTheme] = useState('dark');
  
  const [copied, setCopied] = useState(false);
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(currentCode, codeLanguage);
    });
  };

  useEffect(() => {
    if (onCodeChange) onCodeChange(currentCode, codeLanguage);
  }, [currentCode, codeLanguage, onCodeChange]);
  
  // State for the data structures
  const [elements, setElements] = useState([]); 
  const [hashTable, setHashTable] = useState(Array.from({length: tableSize}, () => []));
  const [cqState, setCqState] = useState({ arr: Array(5).fill(null), f: -1, r: -1 });
  const [operationsLog, setOperationsLog] = useState([]);
  const currentCode = getGeneralCodeTemplate(codeLanguage, dsType, dsVariety, operationsLog);

  // Animation timeline state
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
  };

  const evaluateExpression = () => {
    let tokens = inputValue.trim().split(/\s+/);
    if(tokens.length === 0 || tokens[0] === '') return;
    let frames = [];
    let stack = [];
    frames.push({ arr: [...stack], activeIdx: -1, msg: `Start Expression Evaluation: ${inputValue}`, activeLineText: 'split(" ")' });
    
    let isPrefix = ['+','-','*','/'].includes(tokens[0]);
    if(isPrefix) tokens = tokens.reverse();

    for(let token of tokens) {
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
    setOperationsLog(prev => [...prev, { op: 'evaluateExpression', val: `"${inputValue}"` }]);
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
  };

  // Operations for Hash Table
  const hashInsert = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let ht = timeline.length > 0 ? timeline[timeline.length-1].ht : hashTable;
    
    let absVal = Math.abs(val);
    let bucket = absVal % tableSize;
    let h_k = `h(${val}) = ${absVal} % ${tableSize} = ${bucket}`;
    
    if (dsVariety === 'HASH_CHAINING') {
      let safeHt = Array.isArray(ht) && Array.isArray(ht[0]) ? ht : Array.from({length: tableSize}, () => []);
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: -1, activeNode: -1, msg: `Compute Hash: ${h_k}`, activeLineText: 'key % tableSize' });
      frames.push({ ht: safeHt.map(b => [...b]), activeBucket: bucket, activeNode: -1, msg: `Accessing Bucket ${bucket}`, activeLineText: 'table[index].contains(key)' });
      
      let nextHt = safeHt.map(b => [...b]);
      if(!nextHt[bucket].includes(val)) {
          nextHt[bucket].push(val);
          frames.push({ ht: nextHt, activeBucket: bucket, activeNode: nextHt[bucket].length - 1, msg: `Inserted ${val} into Bucket ${bucket} chain.`, activeLineText: 'table[index].add(key)' });
          setOperationsLog(prev => [...prev, { op: 'insert', val }]);
      } else {
          frames.push({ ht: nextHt, activeBucket: bucket, activeNode: nextHt[bucket].indexOf(val), msg: `Collision! ${val} already exists in chain.`, isCollision: true });
      }
      setHashTable(nextHt);
    } else {
      let safeHt = Array.isArray(ht) && ht.length === tableSize && !Array.isArray(ht[0]) ? ht : Array(tableSize).fill(null);
      let currHt = [...safeHt];
      frames.push({ ht: [...currHt], activeBucket: -1, msg: `Compute Hash: ${h_k}`, activeLineText: 'key % size' });
      
      let i = 0;
      let inserted = false;
      while (i < tableSize) {
        let probeBucket = dsVariety === 'HASH_LINEAR' ? (bucket + i) % tableSize : (bucket + i * i) % tableSize;
        let formula = dsVariety === 'HASH_LINEAR' ? `(${bucket} + ${i}) % ${tableSize}` : `(${bucket} + ${i}²) % ${tableSize}`;
        frames.push({ ht: [...currHt], activeBucket: probeBucket, msg: `Probing slot ${probeBucket} ➔ Formula: ${formula}`, activeLineText: 'int probe =' });
        
        if (currHt[probeBucket] === null || currHt[probeBucket] === 'TOMBSTONE') {
          currHt[probeBucket] = val;
          frames.push({ ht: [...currHt], activeBucket: probeBucket, msg: `Inserted ${val} at slot ${probeBucket}`, activeLineText: 'table[probe] = key' });
          inserted = true;
          setOperationsLog(prev => [...prev, { op: 'insert', val }]);
          break;
        } else if (currHt[probeBucket] === val) {
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
      setHashTable(currHt);
    }
    setTimeline(frames); setCurrentStep(0); setIsPlaying(true); setInputValue(''); triggerFocus();
  };

  const hashSearch = () => {
    let val = parseInt(inputValue);
    if(isNaN(val)) return;
    let frames = [];
    let ht = timeline.length > 0 ? timeline[timeline.length-1].ht : hashTable;
    let absVal = Math.abs(val);
    let bucket = absVal % tableSize;
    let h_k = `h(${val}) = ${absVal} % ${tableSize} = ${bucket}`;
    
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
        let probeBucket = dsVariety === 'HASH_LINEAR' ? (bucket + i) % tableSize : (bucket + i * i) % tableSize;
        frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Checking slot ${probeBucket}`, activeLineText: 'int probe =' });
        
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
    let absVal = Math.abs(val);
    let bucket = absVal % tableSize;
    let h_k = `h(${val}) = ${absVal} % ${tableSize} = ${bucket}`;
    
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
        let probeBucket = dsVariety === 'HASH_LINEAR' ? (bucket + i) % tableSize : (bucket + i * i) % tableSize;
        frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Checking slot ${probeBucket}`, activeLineText: 'int probe =' });
        
        if (safeHt[probeBucket] === val) {
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Found ${val} at slot ${probeBucket}!`, activeLineText: 'table[probe] == key' });
          safeHt[probeBucket] = 'TOMBSTONE'; // Mark as DELETED
          frames.push({ ht: [...safeHt], activeBucket: probeBucket, msg: `Slot ${probeBucket} marked as DELETED (Tombstone).`, activeLineText: 'table[probe] = -1' });
          found = true;
          setOperationsLog(prev => [...prev, { op: 'delete', val }]);
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

  // RENDERERS
  const renderStack = (frame) => {
    const arr = frame.arr || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '4px', marginTop: 'auto', padding: '2rem' }}>
        <div style={{ position: 'absolute', bottom: '15%', width: '160px', height: '60%', borderLeft: '4px solid var(--glass-border)', borderRight: '4px solid var(--glass-border)', borderBottom: '4px solid var(--glass-border)', borderRadius: '0 0 12px 12px', pointerEvents: 'none', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.02))' }} />
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
        {arr.length === 0 && <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', zIndex: 2, paddingBottom: '10px' }}>Stack is empty</div>}
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
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select className="styled-select" style={{ width: '160px', fontWeight: 'bold' }} value={dsType} onChange={e => setDsType(e.target.value)} disabled={isPlaying}>
            <option value="LINKED_LIST">Linked List</option>
            <option value="QUEUE">Queue</option>
            <option value="HASH_TABLE">Hash Table</option>
            <option value="STACK">Stack</option>
          </select>

          <select className="styled-select" style={{ width: '180px', fontWeight: 'bold' }} value={dsVariety} onChange={e => setDsVariety(e.target.value)} disabled={isPlaying}>
            {dsType === 'STACK' && <>
                <option value="STACK_ARRAY">Array Based</option>
                <option value="STACK_LL">Linked List Based</option>
                <option value="STACK_EXPRESSION">Prefix/Postfix Eval</option>
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
            </>}
            {dsType === 'HASH_TABLE' && <>
                <option value="HASH_CHAINING">Separate Chaining</option>
                <option value="HASH_LINEAR">Linear Probing</option>
                <option value="HASH_QUADRATIC">Quadratic Probing</option>
            </>}
          </select>

          <div style={{ width: '1px', height: '26px', background: 'var(--glass-border)', margin: '0 8px' }} />
          
          {dsType === 'HASH_TABLE' && (
             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold'}}>Table Size:</span>
                <input type="number" className="styled-input" style={{ width: '60px', opacity: isPlaying ? 0.7 : 1, fontSize: '0.9rem', fontWeight: 'bold', padding: '0.3rem' }} value={tableSize} onChange={e=>setTableSize(Math.max(1, parseInt(e.target.value)||7))} disabled={isPlaying}/>
             </div>
          )}

          <input ref={inputRef} type={dsVariety === 'STACK_EXPRESSION' ? 'text' : 'number'} className="styled-input" style={{ width: dsVariety === 'STACK_EXPRESSION' ? '150px' : '90px', opacity: isPlaying ? 0.7 : 1, fontSize: '1rem', fontWeight: 'bold' }} placeholder={dsVariety === 'STACK_EXPRESSION' ? "e.g. 2 3 + 4 *" : "Value"} value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyDown={e => {
            if(e.key === 'Enter' && !isPlaying && inputValue) {
              if(dsType==='STACK') { dsVariety === 'STACK_EXPRESSION' ? evaluateExpression() : stackPush(); } else if(dsType==='QUEUE') queueEnqueue(); else if(dsType==='LINKED_LIST') sllInsertTail(); else if(dsType==='HASH_TABLE') hashInsert();
            }
          }} disabled={isPlaying}/>
          
          {dsType === 'STACK' && <>
            {dsVariety === 'STACK_EXPRESSION' ? (
                <button className="btn btn-insert" onClick={evaluateExpression} disabled={isPlaying || !inputValue}>Evaluate</button>
            ) : (
                <>
                <button className="btn btn-insert" onClick={stackPush} disabled={isPlaying || !inputValue}>Push</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || elements.length===0 ? 0.5:1}} onClick={stackPop} disabled={isPlaying || elements.length===0}>Pop</button>
                </>
            )}
          </>}
          
          {dsType === 'QUEUE' && <>
            {dsVariety === 'QUEUE_DEQUE' ? (
              <>
                <button className="btn btn-insert" onClick={() => queueEnqueue(true)} disabled={isPlaying || !inputValue}>Enqueue Front</button>
                <button className="btn btn-insert" onClick={() => queueEnqueue(false)} disabled={isPlaying || !inputValue} style={{background: '#8b5cf6'}}>Enqueue Rear</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || elements.length===0 ? 0.5:1}} onClick={() => queueDequeue(false)} disabled={isPlaying || elements.length===0}>Dequeue Front</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || elements.length===0 ? 0.5:1}} onClick={() => queueDequeue(true)} disabled={isPlaying || elements.length===0}>Dequeue Rear</button>
              </>
            ) : (
              <>
                <button className="btn btn-insert" onClick={() => queueEnqueue(false)} disabled={isPlaying || !inputValue}>Enqueue</button>
                <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || (dsVariety==='QUEUE_CIRCULAR'?cqState.f===-1:elements.length===0) ? 0.5:1}} onClick={() => queueDequeue(false)} disabled={isPlaying || (dsVariety==='QUEUE_CIRCULAR'?cqState.f===-1:elements.length===0)}>Dequeue</button>
              </>
            )}
          </>}

          {dsType === 'LINKED_LIST' && <>
            <button className="btn btn-insert" onClick={sllInsertHead} disabled={isPlaying || !inputValue}>Insert Head</button>
            <button className="btn btn-insert" onClick={sllInsertTail} disabled={isPlaying || !inputValue} style={{background: '#8b5cf6'}}>Insert Tail</button>
            <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={sllDeleteValue} disabled={isPlaying || !inputValue}>Delete Value</button>
          </>}

          {dsType === 'HASH_TABLE' && <>
            <button className="btn btn-insert" onClick={hashInsert} disabled={isPlaying || !inputValue}>Insert</button>
            <button className="btn btn-clear" style={{background: '#10b981', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={hashSearch} disabled={isPlaying || !inputValue}>Search</button>
            <button className="btn btn-clear" style={{background: '#ef4444', color:'white', border:'none', opacity: isPlaying || !inputValue ? 0.5:1}} onClick={hashDelete} disabled={isPlaying || !inputValue}>Delete</button>
          </>}

          <div style={{ width: '1px', height: '26px', background: 'var(--glass-border)', margin: '0 8px' }} />
          <button className="btn btn-clear" onClick={() => setShowCode(!showCode)}>{showCode ? '💻 Hide Code' : '💻 Show Code'}</button>
          {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙️ Settings</button>}
          <button className="btn btn-clear" onClick={() => handleClear(dsVariety, tableSize)} disabled={isPlaying}>🗑 Clear</button>
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.2rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '6px 20px', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              {frame.msg || 'Select an operation to begin...'}
            </span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'auto', position: 'relative', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)' }}>
            {dsType === 'STACK' && renderStack(frame)}
            {dsType === 'QUEUE' && renderQueue(frame)}
            {dsType === 'LINKED_LIST' && renderLinkedList(frame)}
            {dsType === 'HASH_TABLE' && renderHashTable(frame)}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={!timeline.length||currentStep===0}>⏮ First</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={!timeline.length||currentStep===0}>◀ Prev</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1.5rem', border: 'none', background: isPlaying ? 'rgba(59,130,246,0.6)' : 'var(--accent-primary)', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }} onClick={() => setIsPlaying(p => !p)} disabled={!timeline.length}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={!timeline.length||currentStep===timeline.length-1}>Next ▶</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={!timeline.length||currentStep===timeline.length-1}>Last ⏭</button>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '15px', fontWeight: 'bold', fontFamily: 'monospace' }}>Frame: {timeline.length ? currentStep + 1 : 0} / {timeline.length}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Animation Speed</span>
              <input type="range" min={50} max={1000} step={50} value={1050 - speed} onChange={e => setSpeed(1050 - Number(e.target.value))} style={{ width: '200px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}/>
            </div>
          </div>
        </div>

        {/* Code Sidebar */}
        {showCode && (
        <div style={{ width: '450px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold', flex: 1 }}>Implementation</h3>
            <button 
              onClick={handleCopyCode} 
              className="btn btn-clear" 
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <select className="styled-select" style={{ width: '120px', padding: '0.3rem' }} value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)}>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Python">Python</option>
              <option value="JS">JavaScript</option>
            </select>
          </div>
          <div style={{ flex: 1, padding: '1rem 0', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
            <pre style={{ margin: 0, color: 'var(--text-primary)', fontFamily: "'Fira Code', monospace", fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              <code>
                {currentCode.split('\\n').map((line, i) => {
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
        )}
      </div>
    </div>
  );
};

export default GeneralDSVisualizer;
