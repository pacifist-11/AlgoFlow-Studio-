import React, { useState } from 'react';

export default function HandsOnArrays({ selectedLang: propLang }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'js' || lower === 'frontend' || lower === 'javascript') return 'javascript';
    if (lower === 'cpp' || lower === 'c++') return 'c';
    return lower;
  };

  const rawLang = normLang(propLang);
  const activeLang = ['python', 'javascript', 'c', 'java'].includes(rawLang) ? rawLang : 'c';
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
      return `// Frontend (HTML/CSS/JS)\nconst ${arrayName} = [${arrStr}];\n\n// Access item at index ${selectedIndex}:\nconst selectedSong = ${arrayName}[${selectedIndex}]; // Output: "${items[selectedIndex] || ''}"`;
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
      background: 'var(--glass-bg)',
      borderRadius: '16px',
      border: '1px solid var(--glass-border)',
      padding: '24px',
      color: 'var(--text-primary)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--accent-primary)' }}>
            Module 2: Arrays & Indexing ("Rows of Memory Boxes")
          </h2>
        </div>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
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
          background: 'var(--bg-secondary)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: 'var(--text-primary)' }}>
            🎵 Manage Your Array Playlist
          </h3>

          <form onSubmit={handleAddItem} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
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
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'var(--accent-primary)',
                  color: '#fff',
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
            background: 'var(--glass-bg)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--accent-primary)' }}>
              💡 Why does indexing start at 0?
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Index <code>0</code> means <em>"0 steps away from the start of the memory row"</em>. 
              Index <code>1</code> means <em>"1 step away from the start"</em>, and so on.
            </p>
          </div>
        </div>

        {/* Selected Item Info Box */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            🔍 Selected Index Inspection:
          </h3>
          {items[selectedIndex] !== undefined ? (
            <div style={{
              background: 'var(--glass-bg)',
              border: '2px solid var(--accent-primary)',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {arrayName}[<span style={{ color: '#d97706', fontWeight: 'bold' }}>{selectedIndex}</span>]
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>
                "{items[selectedIndex]}"
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Memory Location: <code>0x7FF00 + ({selectedIndex} × 8 bytes)</code>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No index selected</div>
          )}
        </div>
      </div>

      {/* Visual Array Row of Boxes */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid var(--glass-border)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-primary)' }}>
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
                  background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'var(--glass-bg)',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
                }}
              >
                {/* Index Badge */}
                <div style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: isSelected ? '#d97706' : 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Index [{idx}]
                </div>

                {/* Value */}
                <div style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
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
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#dc2626',
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
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            ⚡ Code syntax to create and access this array ({activeLang.toUpperCase()}):
          </span>
        </div>

        <pre style={{
          margin: 0,
          padding: '12px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          color: 'var(--text-primary)',
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
