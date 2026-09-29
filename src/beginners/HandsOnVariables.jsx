import React, { useState } from 'react';

export default function HandsOnVariables({ selectedLang: propLang }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'js' || lower === 'frontend' || lower === 'javascript') return 'javascript';
    if (lower === 'cpp' || lower === 'c++') return 'c';
    return lower;
  };

  const rawLang = normLang(propLang);
  const activeLang = ['python', 'javascript', 'c', 'java'].includes(rawLang) ? rawLang : 'c';

  const [varName, setVarName] = useState('userAge');
  const [dataType, setDataType] = useState('int'); // int, float, char, string, boolean
  const [intValue, setIntValue] = useState(21);
  const [floatValue, setFloatValue] = useState(98.6);
  const [charValue, setCharValue] = useState('A');
  const [strValue, setStrValue] = useState('Alex');
  const [boolValue, setBoolValue] = useState(true);

  const [memoryBoxes, setMemoryBoxes] = useState([
    { id: 1, name: 'userAge', type: 'int', val: '21', address: '0x7FF01' },
    { id: 2, name: 'tempCelsius', type: 'float', val: '36.5', address: '0x7FF02' },
    { id: 3, name: 'gradeLetter', type: 'char', val: "'A'", address: '0x7FF03' },
    { id: 4, name: 'userName', type: 'string', val: '"Alex"', address: '0x7FF04' },
    { id: 5, name: 'isLoggedIn', type: 'boolean', val: 'true', address: '0x7FF05' }
  ]);

  const handleAddVariable = (e) => {
    e.preventDefault();
    if (!varName.trim()) return;

    let finalVal = intValue;
    if (dataType === 'float') finalVal = floatValue;
    if (dataType === 'char') finalVal = `'${charValue.slice(0, 1) || 'A'}'`;
    if (dataType === 'string') finalVal = `"${strValue}"`;
    if (dataType === 'boolean') finalVal = boolValue ? 'true' : 'false';

    const hexAddr = '0x7FF' + Math.floor(10 + Math.random() * 89);
    const newBox = {
      id: Date.now(),
      name: varName.trim().replace(/\s+/g, '_'),
      type: dataType,
      val: finalVal,
      address: hexAddr
    };

    setMemoryBoxes(prev => [newBox, ...prev.slice(0, 4)]);
  };

  const getCodeSnippet = (b) => {
    if (!b) return '';
    const name = b.name;
    const val = b.val;

    if (activeLang === 'python') {
      return `# Python (Dynamic Typing)\n${name} = ${val}`;
    }
    if (activeLang === 'javascript') {
      return `// Frontend (HTML/CSS/JS)\nlet ${name} = ${val};`;
    }
    if (activeLang === 'c') {
      if (b.type === 'int') return `// C Language\nint ${name} = ${val};`;
      if (b.type === 'float') return `// C Language\nfloat ${name} = ${val}f;`;
      if (b.type === 'char') return `// C Language\nchar ${name} = ${val};`;
      if (b.type === 'string') return `// C Language\nchar ${name}[] = ${val};`;
      return `// C Language\n#include <stdbool.h>\nbool ${name} = ${val};`;
    }
    if (activeLang === 'java') {
      if (b.type === 'int') return `// Java\nint ${name} = ${val};`;
      if (b.type === 'float') return `// Java\ndouble ${name} = ${val};`;
      if (b.type === 'char') return `// Java\nchar ${name} = ${val};`;
      if (b.type === 'string') return `// Java\nString ${name} = ${val};`;
      return `// Java\nboolean ${name} = ${val};`;
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
          <span style={{ fontSize: '24px' }}>📦</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--accent-primary)' }}>
            Module 1: Variables & Core Data Types ("Interactive Memory Boxes")
          </h2>
        </div>
        <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
          In computer programming, a <strong>Variable</strong> is like a labeled storage box in RAM memory. 
          The <strong>Data Type</strong> tells the computer what kind of information is inside (Whole numbers, Decimals, Single Characters, Text Strings, or True/False Decisions).
        </p>
      </div>

      {/* Creation & Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Interactive Form */}
        <form onSubmit={handleAddVariable} style={{
          background: 'var(--bg-secondary)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: 'var(--text-primary)' }}>
            ✨ Create a Memory Box
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              1. Variable Name (Box Label):
            </label>
            <input
              type="text"
              value={varName}
              onChange={e => setVarName(e.target.value)}
              placeholder="e.g. userAge, price, myGrade"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              2. Select Data Type (5 Fundamental Types):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { type: 'int', label: '🔢 int (Integer)', color: '#d97706' },
                { type: 'float', label: '🧮 float (Decimal)', color: '#0284c7' },
                { type: 'char', label: '🔤 char (\'A\')', color: '#7c3aed' },
                { type: 'string', label: '🧵 String ("Text")', color: '#059669' },
                { type: 'boolean', label: '☯ bool (True/False)', color: '#db2777' }
              ].map(t => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setDataType(t.type)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '6px',
                    border: dataType === t.type ? `2px solid ${t.color}` : '1px solid var(--glass-border)',
                    background: dataType === t.type ? 'rgba(56, 189, 248, 0.15)' : 'var(--glass-bg)',
                    color: dataType === t.type ? t.color : 'var(--text-primary)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value Inputs based on Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              3. Store Value inside Box:
            </label>
            {dataType === 'int' && (
              <input
                type="number"
                value={intValue}
                onChange={e => setIntValue(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'var(--glass-bg)',
                  border: '1.5px solid #d97706',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
              />
            )}
            {dataType === 'float' && (
              <input
                type="number"
                step="0.01"
                value={floatValue}
                onChange={e => setFloatValue(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'var(--glass-bg)',
                  border: '1.5px solid #0284c7',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
              />
            )}
            {dataType === 'char' && (
              <input
                type="text"
                maxLength={1}
                value={charValue}
                onChange={e => setCharValue(e.target.value)}
                placeholder="Single letter e.g. A"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'var(--glass-bg)',
                  border: '1.5px solid #7c3aed',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
              />
            )}
            {dataType === 'string' && (
              <input
                type="text"
                value={strValue}
                onChange={e => setStrValue(e.target.value)}
                placeholder="Type text e.g. Alex"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'var(--glass-bg)',
                  border: '1.5px solid #059669',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
              />
            )}
            {dataType === 'boolean' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBoolValue(true)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    background: boolValue ? '#059669' : 'var(--glass-bg)',
                    color: boolValue ? '#fff' : 'var(--text-primary)',
                    border: '1px solid #059669',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  true (YES)
                </button>
                <button
                  type="button"
                  onClick={() => setBoolValue(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    background: !boolValue ? '#dc2626' : 'var(--glass-bg)',
                    color: !boolValue ? '#fff' : 'var(--text-primary)',
                    border: '1px solid #dc2626',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  false (NO)
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}
          >
            ➕ Allocate RAM Memory Box
          </button>
        </form>

        {/* Live RAM Memory Visualization */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '18px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)' }}>
              🧠 Simulated Computer RAM Memory (RAM Addresses)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '2px 8px', borderRadius: '4px' }}>
              Physical RAM Storage
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {memoryBoxes.map((box) => {
              let typeColor = '#d97706';
              if (box.type === 'float') typeColor = '#0284c7';
              if (box.type === 'char') typeColor = '#7c3aed';
              if (box.type === 'string') typeColor = '#059669';
              if (box.type === 'boolean') typeColor = '#db2777';

              return (
                <div
                  key={box.id}
                  style={{
                    background: 'var(--glass-bg)',
                    border: `1.5px solid ${typeColor}`,
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: `0 4px 15px ${typeColor}22`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--glass-border)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        📍 {box.address}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {box.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: typeColor, marginTop: '2px', fontWeight: 'bold' }}>
                      Type: {box.type.toUpperCase()}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: typeColor,
                    fontFamily: 'monospace',
                    background: 'var(--bg-secondary)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    {box.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5 Core Data Types Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {[
          { type: 'int', title: 'Integer (int)', example: '21, 100, -5', desc: 'Whole numbers without decimals.', color: '#d97706' },
          { type: 'float', title: 'Float (float/double)', example: '98.6, 3.14159', desc: 'Numbers with fractional decimal points.', color: '#0284c7' },
          { type: 'char', title: 'Character (char)', example: '\'A\', \'Z\', \'#\'', desc: 'A single letter inside single quotes.', color: '#7c3aed' },
          { type: 'string', title: 'String (Text)', example: '"Alex", "Hello"', desc: 'Sequence of text inside double quotes.', color: '#059669' },
          { type: 'boolean', title: 'Boolean (bool)', example: 'true / false', desc: 'Binary decision (Yes or No).', color: '#db2777' }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${item.color}55`,
            borderRadius: '10px',
            padding: '12px'
          }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13.5px', color: item.color }}>
              {item.title}
            </h4>
            <div style={{ fontSize: '11.5px', fontFamily: 'monospace', color: 'var(--text-primary)', marginBottom: '4px' }}>
              e.g. {item.example}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Code Snippet */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            ⚡ How this looks in Actual Programming Code ({activeLang.toUpperCase()}):
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
          {memoryBoxes.map(b => getCodeSnippet(b)).join('\n')}
        </pre>
      </div>
    </div>
  );
}
