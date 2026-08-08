import React, { useState } from 'react';

export default function HandsOnVariables({ selectedLang: propLang }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'js') return 'javascript';
    return lower;
  };

  const activeLang = normLang(propLang);

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
      return `// JavaScript (let / const)\nlet ${name} = ${val};`;
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
          <span style={{ fontSize: '24px' }}>📦</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
            Module 1: Variables & Core Data Types ("Interactive Memory Boxes")
          </h2>
        </div>
        <p style={{ margin: '8px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
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
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#f1f5f9' }}>
            ✨ Create a Memory Box
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
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
                background: '#0f172a',
                border: '1px solid #475569',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>
              2. Select Data Type (5 Fundamental Types):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                { type: 'int', label: '🔢 int (Integer)', color: '#fbbf24' },
                { type: 'float', label: '🧮 float (Decimal)', color: '#60a5fa' },
                { type: 'char', label: '🔤 char (\'A\')', color: '#a78bfa' },
                { type: 'string', label: '🧵 String ("Text")', color: '#34d399' },
                { type: 'boolean', label: '☯ bool (True/False)', color: '#f472b6' }
              ].map(t => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setDataType(t.type)}
                  style={{
                    padding: '8px 6px',
                    borderRadius: '6px',
                    border: dataType === t.type ? `2px solid ${t.color}` : '1px solid #475569',
                    background: dataType === t.type ? 'rgba(51, 65, 85, 0.9)' : '#0f172a',
                    color: dataType === t.type ? t.color : '#94a3b8',
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
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px' }}>
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
                  background: '#0f172a',
                  border: '1px solid #fbbf24',
                  color: '#fbbf24',
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
                  background: '#0f172a',
                  border: '1px solid #60a5fa',
                  color: '#60a5fa',
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
                  background: '#0f172a',
                  border: '1px solid #a78bfa',
                  color: '#a78bfa',
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
                  background: '#0f172a',
                  border: '1px solid #34d399',
                  color: '#34d399',
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
                    background: boolValue ? '#059669' : '#0f172a',
                    color: '#fff',
                    border: '1px solid #34d399',
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
                    background: !boolValue ? '#dc2626' : '#0f172a',
                    color: '#fff',
                    border: '1px solid #f87171',
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
          background: 'rgba(15, 23, 42, 0.9)',
          borderRadius: '12px',
          padding: '18px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#f1f5f9' }}>
              🧠 Simulated Computer RAM Memory (RAM Addresses)
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b', background: '#0f172a', padding: '2px 8px', borderRadius: '4px' }}>
              Physical RAM Storage
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {memoryBoxes.map((box) => {
              let typeColor = '#fbbf24';
              if (box.type === 'float') typeColor = '#60a5fa';
              if (box.type === 'char') typeColor = '#a78bfa';
              if (box.type === 'string') typeColor = '#34d399';
              if (box.type === 'boolean') typeColor = '#f472b6';

              return (
                <div
                  key={box.id}
                  style={{
                    background: '#090d16',
                    border: `1.5px solid ${typeColor}`,
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    justify: 'space-between',
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
                        color: '#64748b',
                        background: '#1e293b',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        📍 {box.address}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
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
                    background: 'rgba(0,0,0,0.4)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)'
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
          { type: 'int', title: 'Integer (int)', example: '21, 100, -5', desc: 'Whole numbers without decimals.', color: '#fbbf24' },
          { type: 'float', title: 'Float (float/double)', example: '98.6, 3.14159', desc: 'Numbers with fractional decimal points.', color: '#60a5fa' },
          { type: 'char', title: 'Character (char)', example: '\'A\', \'Z\', \'#\'', desc: 'A single letter inside single quotes.', color: '#a78bfa' },
          { type: 'string', title: 'String (Text)', example: '"Alex", "Hello"', desc: 'Sequence of text inside double quotes.', color: '#34d399' },
          { type: 'boolean', title: 'Boolean (bool)', example: 'true / false', desc: 'Binary decision (Yes or No).', color: '#f472b6' }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: `1px solid ${item.color}44`,
            borderRadius: '10px',
            padding: '12px'
          }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '13.5px', color: item.color }}>
              {item.title}
            </h4>
            <div style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '4px' }}>
              e.g. {item.example}
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Code Snippet */}
      <div style={{
        background: '#090d16',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>
            ⚡ How this looks in Actual Programming Code ({activeLang.toUpperCase()}):
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
          {memoryBoxes.map(b => getCodeSnippet(b)).join('\n')}
        </pre>
      </div>
    </div>
  );
}
