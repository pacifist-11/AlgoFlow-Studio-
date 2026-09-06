import React, { useState } from 'react';

const GRID_SIZE = 36; // 6x6 grid (36 blocks)

function generateChallengeData() {
  const set = new Set();
  while (set.size < GRID_SIZE) {
    const rand = Math.floor(Math.random() * 90) + 10; // Random 2-digit numbers from 10 to 99
    set.add(rand);
  }
  const unsorted = Array.from(set);
  const target = unsorted[Math.floor(Math.random() * GRID_SIZE)];
  const sorted = [...unsorted].sort((a, b) => a - b);
  return {
    unsortedNumbers: unsorted,
    sortedNumbers: sorted,
    targetNumber: target
  };
}

export default function WhySortingMattersChallenge({ selectedLang = 'c' }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'cpp' || lower === 'c++') return 'cpp';
    if (lower === 'js' || lower === 'javascript' || lower === 'frontend') return 'frontend';
    return lower;
  };
  const activeLang = normLang(selectedLang);

  const codeSnippets = {
    cpp: {
      name: 'C++',
      linear: `// Linear Search (O(N))
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i; // Found!
    }
    return -1; // Not found
}`,
      binary: `// Binary Search (O(log N))
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid; // Found!
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}`
    },
    c: {
      name: 'C Language',
      linear: `// Linear Search (O(N))
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i; // Found!
    }
    return -1; // Not found
}`,
      binary: `// Binary Search (O(log N))
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid; // Found!
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}`
    },
    java: {
      name: 'Java',
      linear: `// Linear Search (O(N))
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i; // Found!
    }
    return -1; // Not found
}`,
      binary: `// Binary Search (O(log N))
public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid; // Found!
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}`
    },
    python: {
      name: 'Python',
      linear: `# Linear Search (O(N))
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found!
    return -1  # Not found`,
      binary: `# Binary Search (O(log N))
def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid  # Found!
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1  # Not found`
    },
    frontend: {
      name: 'JavaScript',
      linear: `// Linear Search (O(N))
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return i; // Found!
    }
    return -1; // Not found
}`,
      binary: `// Binary Search (O(log N))
function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid; // Found!
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // Not found
}`
    }
  };
  const activeLangKey = codeSnippets[activeLang] ? activeLang : 'c';

  const [challengeData, setChallengeData] = useState(() => generateChallengeData());
  const { unsortedNumbers, sortedNumbers, targetNumber } = challengeData;

  // Unsorted game state
  const [revealedUnsorted, setRevealedUnsorted] = useState(new Array(GRID_SIZE).fill(false));
  const [unsortedClicks, setUnsortedClicks] = useState(0);
  const [foundUnsorted, setFoundUnsorted] = useState(false);

  // Sorted game state
  const [revealedSorted, setRevealedSorted] = useState(new Array(GRID_SIZE).fill(false));
  const [sortedClicks, setSortedClicks] = useState(0);
  const [foundSorted, setFoundSorted] = useState(false);

  const handleUnsortedClick = (idx) => {
    if (revealedUnsorted[idx] || foundUnsorted) return;
    const next = [...revealedUnsorted];
    next[idx] = true;
    setRevealedUnsorted(next);
    setUnsortedClicks(c => c + 1);
    if (unsortedNumbers[idx] === targetNumber) {
      setFoundUnsorted(true);
    }
  };

  const handleSortedClick = (idx) => {
    if (revealedSorted[idx] || foundSorted) return;
    const next = [...revealedSorted];
    next[idx] = true;
    setRevealedSorted(next);
    setSortedClicks(c => c + 1);
    if (sortedNumbers[idx] === targetNumber) {
      setFoundSorted(true);
    }
  };

  const resetChallenge = () => {
    setChallengeData(generateChallengeData());
    setRevealedUnsorted(new Array(GRID_SIZE).fill(false));
    setUnsortedClicks(0);
    setFoundUnsorted(false);
    setRevealedSorted(new Array(GRID_SIZE).fill(false));
    setSortedClicks(0);
    setFoundSorted(false);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
              Module 6: "Why Do We Need Sorting?" (Interactive Speed Challenge - {codeSnippets[activeLangKey].name})
            </h2>
          </div>
          <button
            onClick={resetChallenge}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: '#334155',
              color: '#f1f5f9',
              border: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Reset Challenge
          </button>
        </div>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
          Why do programmers spend so much time sorting data? 
          <strong>Goal: Find the hidden target number <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{targetNumber}</span></strong> in both sets of cards below and compare how many steps it takes!
        </p>
      </div>

      {/* Grid Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Game 1: Unsorted Cards */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '18px',
          borderRadius: '14px',
          border: foundUnsorted ? '2px solid #34d399' : '1px solid #475569'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#f87171' }}>
              ❌ Unsorted Mess (Random Order)
            </h3>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fbbf24' }}>
              Clicks: {unsortedClicks}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>
            Without order, you have no choice but to guess cards randomly one by one!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {unsortedNumbers.map((num, idx) => {
              const isRevealed = revealedUnsorted[idx];
              const isTarget = num === targetNumber;
              return (
                <button
                  key={idx}
                  onClick={() => handleUnsortedClick(idx)}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    border: isRevealed ? (isTarget ? '2px solid #34d399' : '1px solid #64748b') : '1px solid #475569',
                    background: isRevealed ? (isTarget ? '#059669' : '#1e293b') : '#0f172a',
                    color: isRevealed ? (isTarget ? '#fff' : '#cbd5e1') : '#475569',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: foundUnsorted || isRevealed ? 'default' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isRevealed ? num : '❓'}
                </button>
              );
            })}
          </div>

          {foundUnsorted && (
            <div style={{
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid #34d399',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#34d399',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              🎉 Found {targetNumber} in {unsortedClicks} clicks! (Linear Search O(N))
            </div>
          )}
        </div>

        {/* Game 2: Sorted Cards */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '18px',
          borderRadius: '14px',
          border: foundSorted ? '2px solid #34d399' : '1px solid #38bdf8'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#38bdf8' }}>
              ✅ Sorted Order (Smallest to Largest)
            </h3>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fbbf24' }}>
              Clicks: {sortedClicks}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>
            💡 <strong>Smart Tip:</strong> Click the middle card! If your target is bigger, eliminate the left half!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {sortedNumbers.map((num, idx) => {
              const isRevealed = revealedSorted[idx];
              const isTarget = num === targetNumber;
              return (
                <button
                  key={idx}
                  onClick={() => handleSortedClick(idx)}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    border: isRevealed ? (isTarget ? '2px solid #34d399' : '1px solid #38bdf8') : '1px solid #0284c7',
                    background: isRevealed ? (isTarget ? '#059669' : '#0f172a') : 'rgba(2, 132, 199, 0.2)',
                    color: isRevealed ? (isTarget ? '#fff' : '#38bdf8') : '#7dd3fc',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: foundSorted || isRevealed ? 'default' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isRevealed ? num : `[${idx}]`}
                </button>
              );
            })}
          </div>

          {foundSorted && (
            <div style={{
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid #34d399',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#34d399',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              🚀 Found {targetNumber} in only {sortedClicks} clicks! (Binary Search O(log N))
            </div>
          )}
        </div>
      </div>

      {/* Comparison Results Card & Code Preview */}
      {foundUnsorted && foundSorted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Comparison Results Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1.5px solid #38bdf8',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fbbf24' }}>
              🏆 Challenge Result: Sorted Search is {Math.round((unsortedClicks / (sortedClicks || 1)) * 100)}% Faster!
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>
              In an unsorted list, finding an item takes <strong>{unsortedClicks} steps</strong>. 
              In a sorted list, you eliminate half the remaining items with every click, taking only <strong>{sortedClicks} steps</strong>!
              <br />
              This is why Google, Amazon, Spotify, and Uber sort millions of records so you get instant search results.
            </p>
          </div>

          {/* Search Algorithms Code Show */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#38bdf8', textAlign: 'center' }}>
              💻 How We Code This in {codeSnippets[activeLangKey].name}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#f87171' }}>Linear Search (O(N)) - Used on Unsorted Cards</h4>
                <pre style={{
                  margin: 0,
                  padding: '12px',
                  background: '#090d16',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontFamily: 'Consolas, Monaco, monospace',
                  overflowX: 'auto',
                  border: '1px solid #475569'
                }}>{codeSnippets[activeLangKey].linear}</pre>
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#38bdf8' }}>Binary Search (O(log N)) - Used on Sorted Cards</h4>
                <pre style={{
                  margin: 0,
                  padding: '12px',
                  background: '#090d16',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontFamily: 'Consolas, Monaco, monospace',
                  overflowX: 'auto',
                  border: '1px solid #0284c7'
                }}>{codeSnippets[activeLangKey].binary}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
