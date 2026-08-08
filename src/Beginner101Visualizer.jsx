import React, { useState } from 'react';
import HandsOnVariables from './HandsOnVariables.jsx';
import HandsOnArrays from './HandsOnArrays.jsx';
import WhySortingMattersChallenge from './WhySortingMattersChallenge.jsx';
import HandsOnSyntaxPractice from './HandsOnSyntaxPractice.jsx';
import LanguageCareerGuide from './LanguageCareerGuide.jsx';

export default function Beginner101Visualizer({ codeLang = 'C', setCodeLang }) {
  const [activeModule, setActiveModule] = useState('variables'); // variables, arrays, why_sort, syntax, career
  const [localLang, setLocalLang] = useState(codeLang || 'C');

  const currentLang = setCodeLang ? codeLang : localLang;

  const handleSelectLang = (langId) => {
    setLocalLang(langId);
    if (setCodeLang) {
      setCodeLang(langId);
    }
  };

  const modules = [
    { id: 'variables', icon: '📦', title: '1. Variables & Data Types', desc: 'Memory storage boxes' },
    { id: 'arrays', icon: '📊', title: '2. Arrays & Indexing', desc: 'Rows of memory boxes' },
    { id: 'why_sort', icon: '⚡', title: '3. Why Sorting Matters', desc: 'Interactive search game' },
    { id: 'syntax', icon: '✍️', title: '4. Syntax & Practice', desc: 'Fix syntax errors & sandbox' },
    { id: 'career', icon: '🎯', title: '5. Which Language to Pick?', desc: 'Jobs & fields guide' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 🌟 TOP HEADER LANGUAGE SELECTOR BAR FOR BEGINNER 101 🌟 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '14px',
        padding: '14px 22px',
        marginBottom: '20px',
        border: '1.5px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🌐</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#38bdf8' }}>
              Select Beginner Coding Language:
            </h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Changes active language for Variables, Arrays & Syntax Practice!
            </span>
          </div>
        </div>

        {/* Header Language Pill Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'C', label: '⚙️ C Language' },
            { id: 'Java', label: '☕ Java' },
            { id: 'Python', label: '🐍 Python' },
            { id: 'JS', label: '🌐 JavaScript' }
          ].map(l => {
            const isSelected = (currentLang || 'C').toUpperCase() === l.id.toUpperCase() || ((currentLang || 'C') === 'JS' && l.id === 'JS');
            return (
              <button
                key={l.id}
                onClick={() => handleSelectLang(l.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                  background: isSelected ? '#0284c7' : '#0f172a',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none'
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Banner / Title */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: '#0284c7',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              ACTIVE LANGUAGE: {(currentLang || 'C').toUpperCase()}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Start Coding Journey Here!</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#f8fafc' }}>
            🌱 Beginner 101: Hands-On Fundamentals & Career Guide
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '14px' }}>
            Learn variables, arrays, syntax rules, and discover which programming language to choose for your target career!
          </p>
        </div>

        {/* Module Switcher Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {modules.map(m => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: isActive ? '2px solid #38bdf8' : '1px solid #334155',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
                }}
              >
                <span>{m.icon}</span>
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module View */}
      {activeModule === 'variables' && <HandsOnVariables selectedLang={currentLang} onSelectLang={handleSelectLang} />}
      {activeModule === 'arrays' && <HandsOnArrays selectedLang={currentLang} onSelectLang={handleSelectLang} />}
      {activeModule === 'why_sort' && <WhySortingMattersChallenge />}
      {activeModule === 'syntax' && <HandsOnSyntaxPractice selectedLang={currentLang} onSelectLang={handleSelectLang} />}
      {activeModule === 'career' && <LanguageCareerGuide />}
    </div>
  );
}
