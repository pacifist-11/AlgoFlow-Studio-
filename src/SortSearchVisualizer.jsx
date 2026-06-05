/* eslint-disable react/prop-types, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getSortSearchCode } from './codeTemplatesSort';

const SortSearchVisualizer = ({ onBack, openSettings, initialTab = 'Sort', initialSort = 'Bubble Sort', initialSearch = 'Linear Search', onCopyCode, onCodeChange }) => {
  const [array, setArray] = useState([]);
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
  const [codeLang, setCodeLang] = useState('C++');
  const [showCode, setShowCode] = useState(true);
  const barRefs = useRef([]);
  const currentDisplayedAlgo = activeTab === 'Sort' ? selectedSort : selectedSearch;
  
  const generateArray = () => {
    const arr = Array.from({length: 20}, () => Math.floor(Math.random() * 90) + 10);
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
    const arr = customArrayStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0 && n <= 100);
    if (arr.length > 0) {
      setArray(arr);
      setInitialArray(arr);
      setTimeline([{ arr: [...arr], i: -1, j: -1, k: -1, msg: 'Loaded custom array' }]);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const handleCopyCode = () => {
    const rawCode = getSortSearchCode(currentDisplayedAlgo, codeLang, array, searchValue ? parseInt(searchValue) : undefined);
    navigator.clipboard.writeText(rawCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyCode) onCopyCode(rawCode, codeLang);
    });
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

  const record = (arr, i, j, k, msg, frames) => {
    frames.push({ arr: [...arr], i, j, k, msg });
  };

  const bubbleSort = () => {
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, 'Starting Bubble Sort', frames);
    for (let i = 0; i < arr.length; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        record(arr, j, j + 1, -1, `Comparing ${arr[j]} and ${arr[j+1]}`, frames);
        if (arr[j] > arr[j+1]) {
          let temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
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
      let temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
      record(arr, i+1, high, i+1, `Placed pivot ${pivot} in its correct position`, frames);
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
    record(arr, -1, -1, -1, 'Starting Heap Sort', frames);

    const heapify = (n, i) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      if (l < n) {
        record(arr, largest, l, -1, `Comparing with left child`, frames);
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < n) {
        record(arr, largest, r, -1, `Comparing with right child`, frames);
        if (arr[r] > arr[largest]) largest = r;
      }

      if (largest !== i) {
        let temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        record(arr, i, largest, -1, `Swapped to maintain max-heap`, frames);
        heapify(n, largest);
      }
    };

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(arr.length, i);
    }
    record(arr, -1, -1, -1, 'Max Heap Built', frames);

    for (let i = arr.length - 1; i > 0; i--) {
      let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
      record(arr, 0, i, i, `Moved max element ${arr[i]} to end`, frames);
      heapify(i, 0);
    }

    record(arr, -1, -1, -1, 'Heap Sort Complete!', frames);
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
        record(arr, i, i + 1, -1, `Comparing ${arr[i]} and ${arr[i+1]}`, frames);
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
        record(arr, i, i + 1, -1, `Comparing ${arr[i]} and ${arr[i+1]}`, frames);
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
    if(isNaN(val)) return;
    let arr = [...array];
    let frames = [];
    record(arr, -1, -1, -1, `Starting Linear Search for ${val}`, frames);
    let found = false;
    for(let i=0; i<arr.length; i++){
      record(arr, i, -1, -1, `Checking if ${arr[i]} equals ${val}`, frames);
      if(arr[i] === val){
        record(arr, i, -1, i, `Found ${val} at index ${i}!`, frames);
        found = true;
        break;
      }
    }
    if(!found) record(arr, -1, -1, -1, `${val} not found in array.`, frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const binarySearch = () => {
    let val = parseInt(searchValue);
    if(isNaN(val)) return;
    
    let arr = [...array];
    let isSorted = true;
    for(let i=0; i<arr.length-1; i++) if(arr[i] > arr[i+1]) isSorted = false;
    
    let frames = [];
    if(!isSorted) {
        arr.sort((a, b) => a - b);
        setArray(arr);
        frames.push({arr: [...arr], i:-1, j:-1, k:-1, msg: 'Array sorted for Binary Search'});
    }

    record(arr, -1, -1, -1, `Starting Binary Search for ${val}`, frames);
    let l = 0, r = arr.length - 1;
    let found = false;
    while(l <= r){
        let m = Math.floor((l+r)/2);
        record(arr, m, l, r, `Checking middle element ${arr[m]} in range [${l}, ${r}]`, frames);
        if(arr[m] === val){
            record(arr, m, -1, m, `Found ${val} at index ${m}!`, frames);
            found = true;
            break;
        }
        if(arr[m] < val){
            record(arr, m, l, r, `${arr[m]} < ${val}, so search right half`, frames);
            l = m + 1;
        } else {
            record(arr, m, l, r, `${arr[m]} > ${val}, so search left half`, frames);
            r = m - 1;
        }
    }
    if(!found) record(arr, -1, -1, -1, `${val} not found in array.`, frames);
    setTimeline(frames);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const radixSort = () => {
    let arr = [...array];
    let frames = [];
    
    let maxVal = Math.max(...arr);
    const getDigit = (num, place) => {
      return Math.floor(Math.abs(num) / place) % 10;
    };

    frames.push({ 
      arr: [...arr], 
      i: -1, 
      j: -1, 
      k: 1, 
      msg: 'Starting Radix Sort: Find maximum value to decide passes', 
      buckets: Array.from({length: 10}, () => []) 
    });

    for (let place = 1; Math.floor(maxVal / place) > 0; place *= 10) {
      let buckets = Array.from({length: 10}, () => []);
      
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
        buckets: Array.from({length: 10}, () => [])
      });
    }

    frames.push({
      arr: [...arr],
      i: -1,
      j: -1,
      k: -1,
      msg: 'Radix Sort complete! Array is fully sorted!',
      buckets: Array.from({length: 10}, () => [])
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
  };

  const executeSearch = () => {
    if (selectedSearch === 'Linear Search') linearSearch();
    else if (selectedSearch === 'Binary Search') binarySearch();
  };

  const frame = timeline[currentStep] || { arr: array, i: -1, j: -1, k: -1, msg: '' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--body-bg, #0f172a)' }}>
      <header className="header-glass" style={{ padding: '0.8rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold', margin: 0 }}>Sort & Search Visualizer</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-clear" onClick={generateArray} disabled={isPlaying}>🔀 Random</button>
          <button className="btn btn-clear" onClick={resetArray} disabled={isPlaying}>🔄 Reset</button>
          
          <input type="text" className="styled-input" style={{ width: '130px', opacity: isPlaying ? 0.7 : 1 }} placeholder="e.g. 10,45,30" value={customArrayStr} onChange={e=>setCustomArrayStr(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !isPlaying && customArrayStr) handleCustomArray(); }} disabled={isPlaying}/>
          <button className="btn btn-clear" style={{background: '#4f46e5', color: 'white', border: 'none', opacity: isPlaying||!customArrayStr?0.5:1}} onClick={handleCustomArray} disabled={isPlaying || !customArrayStr}>Set Array</button>

          <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)', margin: '0 4px' }} />
          
          {/* Operation Type Toggle */}
          <select className="styled-select" style={{ fontWeight: 'bold' }} value={activeTab} onChange={e => setActiveTab(e.target.value)} disabled={isPlaying}>
            <option value="Sort">Sorting Algorithms</option>
            <option value="Search">Searching Algorithms</option>
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
              </select>
              <button className="btn btn-insert" onClick={executeSort} disabled={isPlaying}>▶ Run Sort</button>
            </>
          ) : (
            <>
              <select className="styled-select" value={selectedSearch} onChange={e => setSelectedSearch(e.target.value)} disabled={isPlaying}>
                <option value="Linear Search">Linear Search</option>
                <option value="Binary Search">Binary Search</option>
              </select>
              <input type="number" className="styled-input" style={{ width: '80px', opacity: isPlaying ? 0.7 : 1 }} placeholder="Target" value={searchValue} onChange={e=>setSearchValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !isPlaying && searchValue) executeSearch(); }} disabled={isPlaying}/>
              <button className="btn btn-insert" onClick={executeSearch} disabled={isPlaying || !searchValue}>🔍 Search</button>
            </>
          )}

          <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)', margin: '0 4px' }} />
          <button className="btn btn-clear" onClick={() => setShowCode(!showCode)}>{showCode ? '💻 Hide Code' : '💻 Show Code'}</button>
          {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙ Settings</button>}
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
        </div>
      </header>
      
      <div style={{ flex: 1, display: 'flex', padding: '1.5rem', gap: '1.5rem', overflow: 'hidden' }}>
        
        {/* Left Column: Visualizer */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.2rem', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
             <span style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '6px 20px', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
               {frame.msg || 'Select a sort or search algorithm'}
             </span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '8px', background: 'rgba(15,23,42,0.5)', borderRadius: '14px', border: '1px solid var(--glass-border)', padding: '2rem 1rem', overflow: 'hidden' }}>
            {frame.arr.map((val, idx) => {
              let bg = 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))';
              if (idx === frame.i || idx === frame.j) bg = 'linear-gradient(to top, #fbbf24, #f59e0b)'; 
              if (idx === frame.k) bg = 'linear-gradient(to top, #10b981, #059669)'; 
              
              return (
                <div key={idx} ref={el => barRefs.current[idx] = el} style={{
                  height: `${Math.max(val, 5)}%`, 
                  width: '45px',
                  background: bg,
                  borderRadius: '6px 6px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
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
          
          {selectedSort === 'Radix Sort' && frame.buckets && (
            <div style={{ 
              marginTop: '1.2rem', 
              background: 'rgba(0,0,0,0.2)', 
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px' }}>
                {frame.buckets.map((bucket, bIdx) => (
                  <div 
                    key={bIdx} 
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '8px', 
                      minHeight: '80px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '6px 0',
                      gap: '4px',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fbbf24', borderBottom: '1px solid var(--glass-border)', width: '100%', textAlign: 'center', paddingBottom: '3px' }}>
                      [{bIdx}]
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', alignItems: 'center', overflowY: 'auto' }}>
                      {bucket.map((val, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            borderRadius: '4px', 
                            padding: '2px 8px', 
                            fontSize: '0.8rem', 
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={!timeline.length||currentStep===0}>⏮ First</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={!timeline.length||currentStep===0}>◀ Prev</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1.5rem', border: 'none', background: isPlaying ? 'rgba(59,130,246,0.6)' : 'var(--accent-primary)', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }} onClick={() => setIsPlaying(p => !p)} disabled={!timeline.length}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={!timeline.length||currentStep===timeline.length-1}>Next ▶</button>
              <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', border: 'none', background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={!timeline.length||currentStep===timeline.length-1}>Last ⏭</button>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '15px', fontWeight: 'bold', fontFamily: 'monospace' }}>Step: {timeline.length ? currentStep + 1 : 0} / {timeline.length}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Animation Speed</span>
              <input type="range" min={50} max={1000} step={50} value={1050 - speed} onChange={e => setSpeed(1050 - Number(e.target.value))} style={{ width: '200px', accentColor: 'var(--accent-primary)' }}/>
            </div>
          </div>
        </div>

        {/* Right Column: Code Sidebar */}
        {showCode && (
        <div style={{ width: '450px', background: 'rgba(30,41,59,0.6)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', padding: '0.85rem', overflow: 'hidden', minWidth: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{currentDisplayedAlgo} Code</h3>
              <button 
                onClick={handleCopyCode} 
                className="btn btn-clear" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <select className="styled-select" style={{ padding: '4px 8px', fontSize: '0.8rem', width: '100px' }} value={codeLang} onChange={e => setCodeLang(e.target.value)}>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="JS">JavaScript</option>
            </select>
          </div>
          <div className="code-box" style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.8rem', padding: '1rem', borderRadius: '8px' }}>
            <pre style={{ margin: 0, color: 'var(--text-primary)', fontFamily: "'Fira Code', monospace", lineHeight: '1.6' }}>
               {getSortSearchCode(currentDisplayedAlgo, codeLang, array, searchValue ? parseInt(searchValue) : undefined)}
            </pre>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default SortSearchVisualizer;
