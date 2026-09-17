import React, { useState } from 'react';
import HandsOnVariables from './HandsOnVariables.jsx';
import HandsOnArrays from './HandsOnArrays.jsx';
import WhySortingMattersChallenge from './WhySortingMattersChallenge.jsx';
import WhyDSAMattersGuide from './WhyDSAMattersGuide.jsx';
import LanguageQuirksExceptions from './LanguageQuirksExceptions.jsx';
import HandsOnSyntaxPractice from './HandsOnSyntaxPractice.jsx';
import LanguageCareerGuide from './LanguageCareerGuide.jsx';
import BTechBranchLanguageGuide from './BTechBranchLanguageGuide.jsx';
import AiRagMentorStudio from '../airag/AiRagMentorStudio.jsx';
import { isLineDebuggerSupported } from '../languageUtils.js';

export default function Beginner101Visualizer({ codeLang = 'C', setCodeLang, fontSize = 14, onOpenDebugger }) {
  const [activeModule, setActiveModule] = useState('btech_branches'); // btech_branches, career, ai_mentor, variables, arrays, quirks, syntax, why_sort, why_dsa
  const [localLang, setLocalLang] = useState(codeLang || 'C');

  const currentLang = setCodeLang ? codeLang : localLang;

  const handleSelectLang = (langId) => {
    setLocalLang(langId);
    if (setCodeLang) {
      setCodeLang(langId);
    }
  };

  const modules = [
    { id: 'btech_branches', icon: '🎓', title: '1. B.Tech Branch Roadmaps', desc: 'CSE, ECE, Mech, Civil, AI & more' },
    { id: 'career', icon: '🎯', title: '2. Language Career Guide', desc: 'Jobs & fields per language' },
    { id: 'ai_mentor', icon: '✨', title: '3. AI RAG Mentor Studio', desc: 'Ask anything to AI Career Mentor' },
    { id: 'variables', icon: '📦', title: '4. Variables & Data Types', desc: 'Memory storage boxes' },
    { id: 'arrays', icon: '📊', title: '5. Arrays & Indexing', desc: 'Rows of memory boxes' },
    { id: 'quirks', icon: '⚠️', title: '6. Quirks & Exceptions', desc: 'Java pointers, Python syntax, etc.' },
    { id: 'syntax', icon: '✍️', title: '7. Syntax & Practice', desc: 'Fix syntax errors & sandbox' },
    { id: 'why_sort', icon: '⚡', title: '8. Why Sorting Matters', desc: 'Interactive search game' },
    { id: 'why_dsa', icon: '🧠', title: '9. Why DSA Matters', desc: 'Scalability, Big-O & quiz' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Main Banner / Title */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1.5px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Title Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Start Coding Journey Here!</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#f8fafc' }}>
            🌱 Beginner 101: Hands-On Fundamentals & Career Guide
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '14px' }}>
            Learn variables, arrays, why sorting & DSA matter, language quirks, syntax rules, and discover which programming language to choose for your target career!
          </p>
          
        </div>

        {/* Module Switcher Buttons (Position 1) */}
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

        {/* Integrated Active Language Selector Bar (Only shown for code-syntax modules: Variables, Arrays, Quirks, Syntax) */}
        {['variables', 'arrays', 'quirks', 'syntax'].includes(activeModule) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '12px 18px',
            borderRadius: '12px',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🌐</span>
              <span style={{
                background: '#0284c7',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '3px 9px',
                borderRadius: '12px',
                letterSpacing: '0.5px'
              }}>
                ACTIVE LANGUAGE:
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Applies to Variables, Arrays, Quirks & Syntax Practice!
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'C', label: '⚙️ C' },
                  { id: 'Java', label: '☕ Java' },
                  { id: 'Python', label: '🐍 Python' },
                  { id: 'Frontend', label: '🌐 Frontend (HTML/CSS/JS)' }
                ].map(l => {
                  const cleanLang = (currentLang || 'C').toLowerCase();
                  const cleanId = l.id.toLowerCase();
                  const isSelected = 
                    cleanLang === cleanId ||
                    (cleanLang === 'cpp' && cleanId === 'c') ||
                    (cleanLang === 'c++' && cleanId === 'c') ||
                    ((cleanLang === 'js' || cleanLang === 'javascript' || cleanLang === 'frontend') && cleanId === 'frontend');
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleSelectLang(l.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                        background: isSelected ? '#0284c7' : '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none'
                      }}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>

              {/* Only show Line Debugger button if the active language is supported; for Frontend/HTML/CSS or unsupported languages, do not show */}
              {onOpenDebugger && isLineDebuggerSupported(currentLang) && (
                <button
                  onClick={() => onOpenDebugger('', currentLang)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #38bdf8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
                  }}
                  title={`Open Line-by-Line Debugger for ${currentLang}`}
                >
                  <span>🐞</span>
                  <span>Line Debugger ({currentLang})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Module View */}
      {activeModule === 'btech_branches' && <BTechBranchLanguageGuide />}
      {activeModule === 'career' && <LanguageCareerGuide />}
      {activeModule === 'ai_mentor' && <AiRagMentorStudio codeLang={currentLang} />}
      {activeModule === 'variables' && <HandsOnVariables selectedLang={currentLang} />}
      {activeModule === 'arrays' && <HandsOnArrays selectedLang={currentLang} />}
      {activeModule === 'why_sort' && <WhySortingMattersChallenge selectedLang={currentLang} />}
      {activeModule === 'why_dsa' && <WhyDSAMattersGuide />}
      {activeModule === 'quirks' && <LanguageQuirksExceptions selectedLang={currentLang} />}
      {activeModule === 'syntax' && <HandsOnSyntaxPractice selectedLang={currentLang} />}
    </div>
  );
}
