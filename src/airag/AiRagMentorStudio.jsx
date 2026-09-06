import React, { useState, useRef } from 'react';
import { generateLocalRagResponse, retrieveRagContext, ALGOFLOW_KNOWLEDGE_BASE } from './aiRagEngine.js';
import { CalmAiAvatar } from './FloatingAiBot.jsx';
import { ChatMessageRenderer } from './ChatMessageRenderer.jsx';
import { askAlgoFlowAiMentor, getActiveGeminiApiKey, getActiveGeminiModel } from './geminiService.js';

export default function AiRagMentorStudio({ codeLang = 'C++', customCode = '', apiKey = '', model = 'gemini-3.6-flash' }) {
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const textareaRef = useRef(null);
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
    { id: 'backend', label: '🗄️ Backend & Microservices' },
    { id: 'dsa', label: '⚡ DSA & Trees' },
    { id: 'adv_algo', label: '🧵 Advanced Algorithms' },
    { id: 'ai_ml', label: '🤖 AI & Machine Learning' },
    { id: 'embedded', label: '🔌 Embedded & Servos' },
    { id: 'linux_os', label: '🐧 Linux Systems & OS' },
    { id: 'german', label: '🇩🇪 German A1' },
    { id: 'branches', label: '🎓 Branch Roadmaps' },
    { id: 'switch', label: '⚖️ Non-CS to SDE' }
  ];

  const presetQuestions = [
    { cat: 'switch', title: '💻 Non-CS to SDE Transition', query: 'How can a Mechanical, ECE or Civil student crack a Tier-1 Software SDE placement?' },
    { cat: 'linux_os', title: '🧠 OS: Deadlocks & Semaphore', query: 'Explain 4 Deadlock conditions and Mutex vs Semaphore with real-world examples.' },
    { cat: 'backend', title: '🗄️ DBMS: ACID & Normalization', query: 'Explain ACID properties in database transactions and 1NF to 3NF normalization.' },
    { cat: 'backend', title: '🌐 CAP Theorem & Distributed DBs', query: 'Explain the CAP Theorem and why CP vs AP trade-offs exist in distributed data stores.' },
    { cat: 'backend', title: '🔄 Saga Pattern vs 2PC', query: 'Explain the Saga Pattern and how compensating transactions maintain eventual consistency across microservices.' },
    { cat: 'backend', title: '🧠 Vector Databases & pgvector', query: 'How do vector databases perform ANN similarity search using HNSW and IVF with pgvector?' },
    { cat: 'dsa', title: '📈 DP: 4-Step Master Blueprint', query: 'What is the 4-step framework to solve any Dynamic Programming problem from recursion to tabulation?' },
    { cat: 'dsa', title: '⚡ Sorting Complexity Guide', query: 'Compare Merge Sort, Quick Sort, and Heap Sort time/space complexities.' },
    { cat: 'dsa', title: '🌲 BST & Inorder Traversal', query: 'Explain Binary Search Tree properties and why Inorder traversal yields sorted order.' },
    { cat: 'adv_algo', title: '🧵 KMP String Matching', query: 'How does the Knuth-Morris-Pratt (KMP) algorithm achieve O(N + M) search using the LPS array?' },
    { cat: 'adv_algo', title: '🌊 Dinic Network Flow Algorithm', query: 'Explain Dinic\'s algorithm for Maximum Flow using level graphs and blocking flows.' },
    { cat: 'adv_algo', title: '🧩 Cook-Levin & NP-Completeness', query: 'What is the Cook-Levin theorem and how does 3-SAT reduce to Clique and Vertex Cover?' },
    { cat: 'ai_ml', title: '🤖 PEAS Model & Intelligent Agents', query: 'Explain the PEAS framework and environment classifications for intelligent AI agents.' },
    { cat: 'ai_ml', title: '⚠️ Training-Serving Skew & Feast', query: 'What causes training-serving skew in production ML and how do feature stores prevent it?' },
    { cat: 'ai_ml', title: '📊 Hypothesis Testing & P-Values', query: 'Explain null hypothesis, p-values, and Type I vs Type II errors in data analytics.' },
    { cat: 'embedded', title: '⚡ STM32H7 Memory & ITCM/DTCM', query: 'Explain the ARM Cortex-M7 dual-issue pipeline and why ITCM/DTCM memory is critical for servo control.' },
    { cat: 'embedded', title: '🚗 CAN Bus Arbitration by ID', query: 'How does CAN Bus differential signaling and bitwise arbitration by identifier work?' },
    { cat: 'embedded', title: '🎛️ PID Anti-Windup Mechanisms', query: 'What causes integral windup in discrete motor PID controllers and how does clamping resolve it?' },
    { cat: 'linux_os', title: '🐧 System Call Execution Journey', query: 'Trace the complete journey of a Linux system call from user-space glibc into Ring 0 kernel space.' },
    { cat: 'linux_os', title: '🧟 Zombie vs Orphan Processes', query: 'Explain the difference between zombie and orphan processes in Linux and how each is reaped.' },
    { cat: 'german', title: '🇩🇪 Wechselpräpositionen (Two-Way)', query: 'Explain German Wechselpräpositionen and the rule for Wohin (Akkusativ) vs Wo (Dativ).' },
    { cat: 'german', title: '🇩🇪 Goethe A1 Exam Preparation', query: 'What is the format of the Goethe-Zertifikat A1 exam across Hören, Lesen, Schreiben, and Sprechen?' },
    { cat: 'branches', title: '🧠 AI & Deep Learning Roadmap', query: 'What is the complete 4-year learning path for AI/ML, PyTorch and LLMs?' },
    { cat: 'branches', title: '🏎️ EV & BMS Engineering', query: 'How does an Automobile or EEE student prepare for Electric Vehicle BMS software roles?' }
  ];

  const filteredPresets = activeCategory === 'all' 
    ? presetQuestions 
    : presetQuestions.filter(p => p.cat === activeCategory);

  const handleSend = async (queryToSend) => {
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
    if (textareaRef.current) {
      textareaRef.current.style.height = '42px';
    }
    setIsLoading(true);

    // Update live inspector of retrieved RAG documents
    const matchedDocs = retrieveRagContext(text);
    setRetrievedContextInspector(matchedDocs);

    try {
      const activeKey = apiKey || getActiveGeminiApiKey();
      const activeModel = model || getActiveGeminiModel();
      const result = await askAlgoFlowAiMentor({
        query: text,
        customCode,
        codeLang,
        apiKey: activeKey,
        model: activeModel
      });

      setMessages([...newHistory, {
        role: 'assistant',
        text: result.text,
        sources: result.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.warn('AI Studio error, using local fallback:', err);
      const fallbackResult = generateLocalRagResponse(text, customCode, codeLang);
      setMessages([...newHistory, {
        role: 'assistant',
        text: fallbackResult.text,
        sources: fallbackResult.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollH, 42), 160)}px`;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
              <span style={{
                fontSize: '11px',
                background: (apiKey || getActiveGeminiApiKey()) ? 'rgba(56, 189, 248, 0.15)' : 'rgba(74, 222, 128, 0.15)',
                color: (apiKey || getActiveGeminiApiKey()) ? '#38bdf8' : '#4ade80',
                border: `1px solid ${(apiKey || getActiveGeminiApiKey()) ? 'rgba(56, 189, 248, 0.4)' : 'rgba(74, 222, 128, 0.3)'}`,
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {(apiKey || getActiveGeminiApiKey()) ? '⚡ Gemini 3.6 Flash Active' : '● High-Speed Universal RAG'}
              </span>
              <span style={{
                fontSize: '11px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)',
                color: '#fbbf24',
                border: '1px solid rgba(251, 191, 36, 0.6)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Beta Version
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
                    padding: '14px 18px',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    background: isUser ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#0f172a',
                    color: '#f8fafc',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    border: isUser ? 'none' : '1px solid #334155',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    wordBreak: 'break-word'
                  }}>
                    <ChatMessageRenderer text={m.text} isUser={isUser} onSelectPrompt={handleSend} />
                  </div>

                  {!isUser && (m.offlineNotice || (m.sources && m.sources.some(s => s.toLowerCase().includes('offline')))) && (
                    <div style={{
                      marginTop: '6px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      color: '#fcd34d',
                      fontSize: '10.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>📡</span>
                      <span>Offline Mode • Connect to internet for live Google Gemini 3.6 Flash reasoning.</span>
                    </div>
                  )}

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
              <div style={{
                alignSelf: 'flex-start',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                padding: '14px 20px',
                borderRadius: '16px 16px 16px 3px',
                color: '#38bdf8',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: '1.5px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <span style={{ animation: 'spin 1.2s linear infinite' }}>⚡</span>
                  <span>Synthesizing answer with AlgoFlow AI...</span>
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.25)', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', animation: 'pulse 1.2s ease-in-out infinite' }} />
                  </div>
                  <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.25)', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #818cf8, #c084fc)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.25s' }} />
                  </div>
                  <div style={{ width: '30px', height: '6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.25)', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #c084fc, #38bdf8)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.5s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Edge-Cutting Multi-Line Input Box */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid #334155'
          }}>
            <div style={{
              borderRadius: '16px',
              background: '#1e293b',
              border: isInputFocused ? '1.5px solid #38bdf8' : '1.5px solid #475569',
              boxShadow: isInputFocused 
                ? '0 0 16px rgba(56, 189, 248, 0.22), inset 0 1px 2px rgba(255,255,255,0.06)' 
                : '0 2px 8px rgba(0, 0, 0, 0.35)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 14px',
              gap: '6px'
            }}>
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask anything about B.Tech branches, languages, DSA, OS, DBMS or placements... (Shift+Enter for next line)"
                value={inputQuery}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  width: '100%',
                  minHeight: '42px',
                  maxHeight: '160px',
                  resize: 'none',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#f8fafc',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  padding: '2px 0',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflowY: inputQuery.split('\n').length > 5 ? 'auto' : 'hidden'
                }}
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <kbd style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      fontSize: '10px',
                      color: '#94a3b8'
                    }}>↵ Enter</kbd> send
                    <span style={{ margin: '0 3px' }}>•</span>
                    <kbd style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      padding: '1px 5px',
                      fontSize: '10px',
                      color: '#94a3b8'
                    }}>Shift+↵</kbd> next line
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputQuery.trim()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    background: inputQuery.trim() ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : '#334155',
                    color: inputQuery.trim() ? '#04101e' : '#94a3b8',
                    fontWeight: '800',
                    border: 'none',
                    cursor: inputQuery.trim() ? 'pointer' : 'default',
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: inputQuery.trim() ? '0 4px 15px rgba(56, 189, 248, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (inputQuery.trim()) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>Ask Mentor</span>
                  <span style={{ fontSize: '12px' }}>🚀</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
