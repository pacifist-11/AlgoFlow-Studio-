import React, { useState } from 'react';

export default function HandsOnArrays({ selectedLang: propLang }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'js') return 'javascript';
    return lower;
  };

  const activeLang = normLang(propLang);
  const [arrayName, setArrayName] = useState('favoriteSongs');
  const [items, setItems] = useState(['Believer', 'Shape of You', 'Counting Stars', 'Levitating']);
  const [newItem, setNewItem] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems(prev => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    if (selectedIndex >= items.length - 1) {
      setSelectedIndex(Math.max(0, items.length - 2));
    }
  };

  const getCodeSnippet = () => {
    const arrStr = items.map(x => `"${x}"`).join(', ');
    if (activeLang === 'python') {
      return `# Python\n${arrayName} = [${arrStr}]\n\n# Access item at index ${selectedIndex}:\nselected_song = ${arrayName}[${selectedIndex}]  # Output: "${items[selectedIndex] || ''}"`;
    }
    if (activeLang === 'javascript') {
      return `// JavaScript\nconst ${arrayName} = [${arrStr}];\n\n// Access item at index ${selectedIndex}:\nconst selectedSong = ${arrayName}[${selectedIndex}]; // Output: "${items[selectedIndex] || ''}"`;
    }
    if (activeLang === 'c') {
      return `// C Language\n#include <stdio.h>\n\nchar* ${arrayName}[] = {${arrStr}};\n\n// Access item at index ${selectedIndex}:\nchar* selectedSong = ${arrayName}[${selectedIndex}]; // "${items[selectedIndex] || ''}"`;
    }
    if (activeLang === 'java') {
      return `// Java\nString[] ${arrayName} = {${arrStr}};\n\n// Access item at index ${selectedIndex}:\nString selectedSong = ${arrayName}[${selectedIndex}]; // "${items[selectedIndex] || ''}"`;
    }
    return '';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
            Module 2: Arrays & Indexing ("Rows of Memory Boxes")
          </h2>
        </div>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
          What if you want to store multiple items (like a music playlist or high scores) under a single name? 
          An <strong>Array</strong> is a row of memory boxes placed side-by-side. 
          Each box has an <strong>Index Number</strong> starting at <code>0</code>!
        </p>
      </div>

      {/* Array Controls & Form */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Form */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#f1f5f9' }}>
            🎵 Manage Your Array Playlist
          </h3>

          <form onSubmit={handleAddItem} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
              Add a new item to the end of the array:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="e.g. Starboy, Perfect"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#38bdf8',
                  color: '#0f172a',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Add ➕
              </button>
            </div>
          </form>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#38bdf8' }}>
              💡 Why does indexing start at 0?
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
              Index <code>0</code> means <em>"0 steps away from the start of the memory row"</em>. 
              Index <code>1</code> means <em>"1 step away from the start"</em>, and so on.
            </p>
          </div>
        </div>

        {/* Selected Item Info Box */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#94a3b8' }}>
            🔍 Selected Index Inspection:
          </h3>
          {items[selectedIndex] !== undefined ? (
            <div style={{
              background: '#0f172a',
              border: '2px solid #38bdf8',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {arrayName}[<span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{selectedIndex}</span>]
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399', marginBottom: '8px' }}>
                "{items[selectedIndex]}"
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Memory Location: <code>0x7FF00 + ({selectedIndex} × 8 bytes)</code>
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center' }}>No index selected</div>
          )}
        </div>
      </div>

      {/* Visual Array Row of Boxes */}
      <div style={{
        background: '#090d16',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#f1f5f9' }}>
          📦 Interactive Array Memory Row:
        </h3>

        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {items.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                style={{
                  minWidth: '120px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                  borderRadius: '10px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none'
                }}
              >
                {/* Index Badge */}
                <div style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: isSelected ? '#fbbf24' : '#64748b',
                  marginBottom: '8px'
                }}>
                  Index [{idx}]
                </div>

                {/* Value */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#e2e8f0',
                  wordBreak: 'break-word',
                  marginBottom: '10px'
                }}>
                  "{item}"
                </div>

                {/* Action button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(idx);
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    padding: '2px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Delete 🗑
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Snippet & Language Selector */}
      <div style={{
        background: '#090d16',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>
            ⚡ Code syntax to create and access this array ({activeLang.toUpperCase()}):
          </span>
        </div>

        <pre style={{
          margin: 0,
          padding: '12px',
          background: '#020617',
          borderRadius: '8px',
          color: '#38bdf8',
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          overflowX: 'auto'
        }}>
          {getCodeSnippet()}
        </pre>
      </div>
    </div>
  );
}
