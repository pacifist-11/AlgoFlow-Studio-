import React, { useState } from 'react';
import { generateLocalRagResponse, retrieveRagContext, ALGOFLOW_KNOWLEDGE_BASE } from './aiRagEngine.js';
import { CalmAiAvatar } from './FloatingAiBot.jsx';

export default function AiRagMentorStudio({ codeLang = 'C++', customCode = '' }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `### ✨ Welcome to the AlgoFlow AI Mentor Studio!

I am your dedicated AI Counselor & DSA Mentor powered by **Universal Retrieval-Augmented Generation (RAG)**.

I have direct real-time indexing over:
* 🎓 **16 B.Tech Engineering Branches** (CSE, IT, AI/ML, DS, Cyber, ECE, EEE, EIE, Robotics, Mech, Auto, Aero, Civil, Biotech, Chem, Metallurgy)
* 💻 **8 Programming Languages** (C, C++, HTML/CSS/JS, Java, Python, TypeScript, Go, Rust)
* 🗺️ **4-Year Progressive Roadmaps & Dual-Track Placements**
* 🧠 **Core CS Subjects (OS, DBMS, Networks, OOPs, System Design)**
* ⚡ **DSA Algorithms & Time Complexities**

Ask any custom question, or pick a preset topic on the left to start!`,
      sources: ['AlgoFlow System RAG Index'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retrievedContextInspector, setRetrievedContextInspector] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [studioOpacity, setStudioOpacity] = useState(() => {
    try {
      const saved = localStorage.getItem('algoflow_studio_opacity');
      return saved ? parseFloat(saved) : 0.95;
    } catch {
      return 0.95;
    }
  });

  const presetCategories = [
    { id: 'all', label: '🌟 All Topics' },
    { id: 'core_cs', label: '🧠 Core CS (OS/DBMS/CN)' },
    { id: 'dsa', label: '⚡ DSA & Algorithms' },
    { id: 'branches', label: '🎓 Branch Roadmaps' },
    { id: 'switch', label: '⚖️ Non-CS to SDE' },
    { id: 'lang', label: '💻 Languages (C++/Java/Go)' }
  ];

  const presetQuestions = [
    { cat: 'switch', title: '💻 Non-CS to SDE Transition', query: 'How can a Mechanical, ECE or Civil student crack a Tier-1 Software SDE placement?' },
    { cat: 'core_cs', title: '🧠 OS: Deadlocks & Semaphore', query: 'Explain 4 Deadlock conditions and Mutex vs Semaphore with real-world examples.' },
    { cat: 'core_cs', title: '🗄️ DBMS: ACID & Normalization', query: 'Explain ACID properties in database transactions and 1NF to 3NF normalization.' },
    { cat: 'core_cs', title: '🌐 Networks: TCP vs UDP & OSI', query: 'Explain OSI 7 layers and TCP 3-way handshake vs UDP.' },
    { cat: 'dsa', title: '📈 DP: 4-Step Master Blueprint', query: 'What is the 4-step framework to solve any Dynamic Programming problem from recursion to tabulation?' },
    { cat: 'dsa', title: '⚡ Sorting Complexity Guide', query: 'Compare Merge Sort, Quick Sort, and Heap Sort time/space complexities.' },
    { cat: 'dsa', title: '🌲 BST & Inorder Traversal', query: 'Explain Binary Search Tree properties and why Inorder traversal yields sorted order.' },
    { cat: 'branches', title: '🤖 AI & Deep Learning Roadmap', query: 'What is the complete 4-year learning path for AI/ML, PyTorch and LLMs?' },
    { cat: 'branches', title: '🏎️ EV & BMS Engineering', query: 'How does an Automobile or EEE student prepare for Electric Vehicle BMS software roles?' },
    { cat: 'branches', title: '🛡️ Cyber Security Starting Path', query: 'What certifications and platforms should a beginner use for ethical hacking?' },
    { cat: 'lang', title: '⚙️ C++ STL vs Java Collections', query: 'Compare C++ STL and Java Collections for LeetCode DSA problem solving.' },
    { cat: 'lang', title: '🚀 Go vs Rust Comparison', query: 'Compare Go and Rust for modern backend microservices and systems programming.' }
  ];

  const filteredPresets = activeCategory === 'all' 
    ? presetQuestions 
    : presetQuestions.filter(p => p.cat === activeCategory);

  const handleSend = (queryToSend) => {
    const text = queryToSend || inputQuery;
    if (!text || text.trim() === '') return;

    const userMsg = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputQuery('');
    setIsLoading(true);

    // Update live inspector of retrieved RAG documents
    const matchedDocs = retrieveRagContext(text);
    setRetrievedContextInspector(matchedDocs);

    // Instant offline RAG response
    setTimeout(() => {
      try {
        const result = generateLocalRagResponse(text, customCode, codeLang);
        setMessages([...newHistory, {
          role: 'assistant',
          text: result.text,
          sources: result.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err) {
        const fallback = generateLocalRagResponse(text, customCode, codeLang);
        setMessages([...newHistory, {
          role: 'assistant',
          text: fallback.text,
          sources: fallback.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsLoading(false);
      }
    }, 280);
  };

  const handleOpacityChange = (e) => {
    const val = parseFloat(e.target.value);
    setStudioOpacity(val);
    try {
      localStorage.setItem('algoflow_studio_opacity', val.toString());
    } catch {}
  };

  return (
    <div style={{
      background: `rgba(15, 23, 42, ${studioOpacity})`,
      borderRadius: '18px',
      border: '1.5px solid rgba(56, 189, 248, 0.35)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backdropFilter: 'blur(16px)',
      transition: 'background 0.2s ease'
    }}>
      {/* Main Studio Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderRadius: '14px',
        padding: '20px 22px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <CalmAiAvatar size={38} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
                AlgoFlow AI Mentor Studio
              </h2>
              <span style={{ fontSize: '11px', background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                ● 100% Offline Universal RAG
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
              Ground-truth RAG knowledge over 16 B.Tech branches, 8 languages, Core CS & placement transitions.
            </p>
          </div>
        </div>

        {/* Opacity Control Slider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: `rgba(15, 23, 42, ${Math.max(studioOpacity * 0.8, 0.3)})`,
          padding: '6px 14px',
          borderRadius: '10px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            💧 Opacity:
          </span>
          <input
            type="range"
            min="0.05"
            max="1.0"
            step="0.05"
            value={studioOpacity}
            onChange={handleOpacityChange}
            style={{ width: '90px', accentColor: '#38bdf8', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '11.5px', color: '#f8fafc', fontWeight: 'bold', minWidth: '32px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            {Math.round(studioOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* Main Studio Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: Preset Queries & RAG Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Quick Presets */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14.5px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚡</span> Curated Knowledge Presets
            </h4>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {presetCategories.map(cat => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: isSelected ? '1.5px solid #38bdf8' : '1px solid #334155',
                      background: isSelected ? '#0284c7' : '#1e293b',
                      color: isSelected ? '#fff' : '#94a3b8',
                      fontSize: '11px',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
              {filteredPresets.map((pq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(pq.query)}
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#e2e8f0',
                    textAlign: 'left',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
                  }}
                >
                  <strong style={{ color: '#38bdf8' }}>{pq.title}</strong>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{pq.query}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RAG Retrieved Context Inspector */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '13.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔍</span> Live RAG Context Inspector
              </h4>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                {retrievedContextInspector.length} chunks retrieved
              </span>
            </div>

            {retrievedContextInspector.length === 0 ? (
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Ask a question to see real-time semantic document chunks retrieved from the AlgoFlow Knowledge Base!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {retrievedContextInspector.map((doc, idx) => (
                  <div key={idx} style={{ background: '#1e293b', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                    <strong style={{ fontSize: '12px', color: '#f8fafc', display: 'block' }}>{doc.topic}</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {doc.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Interactive Chat Interface */}
        <div style={{
          background: '#0f172a',
          borderRadius: '14px',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          height: '620px'
        }}>
          
          {/* Chat Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isUser ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#1e293b',
                    color: '#f8fafc',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    border: isUser ? 'none' : '1px solid #334155',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {m.text}
                  </div>

                  {!isUser && m.sources && m.sources.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Grounding Sources:</span>
                      {m.sources.map((s, idx) => (
                        <span key={idx} style={{ fontSize: '10px', color: '#38bdf8', background: 'rgba(56,189,248,0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: '#1e293b', padding: '12px 16px', borderRadius: '12px', color: '#38bdf8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ animation: 'spin 1s linear infinite' }}>⚡</span>
                <span>Searching engineering vectors & generating verified answer...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '14px',
              borderTop: '1px solid #334155',
              display: 'flex',
              gap: '10px',
              background: 'rgba(15, 23, 42, 0.95)'
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about B.Tech branches, languages, DSA, OS, DBMS or placements..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                background: '#1e293b',
                border: '1.5px solid #475569',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              style={{
                padding: '12px 22px',
                borderRadius: '10px',
                background: inputQuery.trim() ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : '#334155',
                color: '#04101e',
                fontWeight: '800',
                border: 'none',
                cursor: inputQuery.trim() ? 'pointer' : 'default',
                fontSize: '13.5px',
                boxShadow: inputQuery.trim() ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none'
              }}
            >
              Ask Mentor 🚀
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
