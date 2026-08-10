import React, { useState } from 'react';

export default function WhyDSAMattersGuide() {
  const [dataSize, setDataSize] = useState(10000); // Default N = 10,000
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'realworld', 'quiz'
  const [quizScore, setQuizScore] = useState({ answered: 0, correct: 0 });
  const [userAnswers, setUserAnswers] = useState({});

  // Helper to format large step counts cleanly
  const formatSteps = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + ' Trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + ' Billion';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + ' Million';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + ' K';
    return num.toLocaleString();
  };

  // Calculations for step counts based on N
  const n = Number(dataSize);
  const o1Steps = 1;
  const oLogNSteps = Math.ceil(Math.log2(n || 1));
  const oNSteps = n;
  const oNLogNSteps = Math.ceil(n * Math.log2(n || 1));
  const oN2Steps = n * n;

  // Real world case studies
  const caseStudies = [
    {
      icon: '🗺️',
      title: 'Google Maps & Uber',
      tech: 'Graphs & Dijkstra / A* Algorithm',
      desc: 'With over 10 million road segments, checking every path randomly would take days. Graph algorithms compute the optimal route in under 50 milliseconds!',
      impact: 'Saves millions of gallons of fuel and prevents traffic bottlenecks.'
    },
    {
      icon: '🔍',
      title: 'Google Search Engine',
      tech: 'Inverted Index & PageRank',
      desc: 'Google indexes over 100 billion web pages. Using Hash Maps and Inverted Indexing, search queries return relevant links in 0.2 seconds.',
      impact: 'Instantly serves answer queries to 5+ billion users worldwide.'
    },
    {
      icon: '💬',
      title: 'WhatsApp & Messaging',
      tech: 'Queues & Stacks',
      desc: 'Messages sent while offline are stored in Queues (First-In, First-Out). App navigation backstacks and Ctrl+Z undo functions use Stacks (Last-In, First-Out).',
      impact: 'Ensures zero lost messages and predictable user interface state.'
    },
    {
      icon: '🎬',
      title: 'Netflix & Spotify',
      tech: 'Heaps & Balanced Trees',
      desc: 'Top-10 trending charts and personalized recommendation queues process user ratings instantly using Min/Max Heaps and Binary Search Trees.',
      impact: 'Streams personalized feeds without buffer lag.'
    }
  ];

  // Interactive Quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: 'Which Data Structure is best for implementing a browser "Back" button or Ctrl+Z Undo?',
      options: ['Queue (FIFO)', 'Stack (LIFO)', 'Graph', 'Array'],
      correct: 1,
      explanation: 'A Stack follows Last-In, First-Out (LIFO), making it perfect for reversing recent actions in order!'
    },
    {
      id: 2,
      question: 'How many comparisons does Binary Search need to find a name in a sorted phonebook of 1,000,000 people?',
      options: ['1,000,000 steps', '500,000 steps', 'About 20 steps', '1 step'],
      correct: 2,
      explanation: 'Binary Search is O(log₂ N). log₂(1,000,000) ≈ 20 clicks to eliminate half the items each time!'
    },
    {
      id: 3,
      question: 'Which Data Structure allows instant O(1) lookup by key (like finding a user profile by ID)?',
      options: ['Hash Table / Object / Map', 'Linked List', 'Stack', 'Array (Unsorted)'],
      correct: 0,
      explanation: 'Hash Tables convert keys directly into memory addresses using a hash function for near-instant O(1) access!'
    }
  ];

  const handleQuizAnswer = (qId, optionIdx) => {
    if (userAnswers[qId] !== undefined) return;
    const isCorrect = optionIdx === quizQuestions.find(q => q.id === qId).correct;
    setUserAnswers({ ...userAnswers, [qId]: optionIdx });
    setQuizScore(prev => ({
      answered: prev.answered + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '16px',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
              Module 7: "Why Do Data Structures & Algorithms (DSA) Matter?"
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
              Learn why choosing the right data structures and algorithms is the difference between a lightning-fast app and a frozen system!
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'simulator', icon: '📊', label: '1. Speed & Scalability Simulator' },
          { id: 'realworld', icon: '🌍', label: '2. Real-World Tech Impact' },
          { id: 'quiz', icon: '🎯', label: '3. Interactive DSA Quiz' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: activeTab === t.id ? '2px solid #38bdf8' : '1px solid #334155',
              background: activeTab === t.id ? 'rgba(56, 189, 248, 0.2)' : '#0f172a',
              color: activeTab === t.id ? '#38bdf8' : '#cbd5e1',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: COMPLEXITY SIMULATOR */}
      {activeTab === 'simulator' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '14px', padding: '20px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '17px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span> Visualizing Algorithm Scalability (Big-O Notation)
          </h3>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 20px 0', lineHeight: '1.5' }}>
            Adjust the dataset size <strong>N</strong> below to see how different algorithms perform as data grows!
          </p>

          {/* Slider Input */}
          <div style={{
            background: '#0f172a',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #334155',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold', color: '#38bdf8', fontSize: '14px' }}>
                Dataset Size (N): <span style={{ color: '#fbbf24', fontSize: '18px' }}>{n.toLocaleString()} items</span>
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[100, 10000, 100000, 1000000].map(val => (
                  <button
                    key={val}
                    onClick={() => setDataSize(val)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #334155',
                      background: n === val ? '#0284c7' : '#1e293b',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {val >= 1000000 ? '1M' : val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min="100"
              max="1000000"
              step="5000"
              value={dataSize}
              onChange={(e) => setDataSize(e.target.value)}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
          </div>

          {/* Bars Comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* O(1) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#34d399' }}>⚡ O(1) - Constant Time (Hash Table Lookup)</span>
                <span style={{ fontWeight: 'bold', color: '#34d399' }}>{formatSteps(o1Steps)} step</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '1%', background: '#34d399', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟢 Instantaneous lookup regardless of dataset size!
              </span>
            </div>

            {/* O(log N) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🚀 O(log N) - Logarithmic (Binary Search)</span>
                <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{formatSteps(oLogNSteps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (oLogNSteps / 30) * 100)}%`, background: '#38bdf8', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟢 Blazing fast — halves remaining dataset on every step!
              </span>
            </div>

            {/* O(N) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>🏃 O(N) - Linear Time (Unsorted Search)</span>
                <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{formatSteps(oNSteps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (n / 1000000) * 100)}%`, background: '#fbbf24', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟡 Acceptable for small N, but degrades linearly as data grows.
              </span>
            </div>

            {/* O(N log N) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>📊 O(N log N) - Log-Linear (Merge / Quick Sort)</span>
                <span style={{ fontWeight: 'bold', color: '#a78bfa' }}>{formatSteps(oNLogNSteps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (oNLogNSteps / 20000000) * 100)}%`, background: '#a78bfa', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                Status: 🟣 Standard algorithm complexity for sorting large datasets efficiently.
              </span>
            </div>

            {/* O(N^2) */}
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid #f87171' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ fontWeight: 'bold', color: '#f87171' }}>🐢 O(N²) - Quadratic (Nested Loops / Bubble Sort)</span>
                <span style={{ fontWeight: 'bold', color: '#f87171' }}>{formatSteps(oN2Steps)} steps</span>
              </div>
              <div style={{ background: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '100%', background: '#ef4444', height: '100%' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px', display: 'block' }}>
                Status: 🔴 DANGER — Unusable for large N! Would freeze or crash your application!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REAL-WORLD IMPACT */}
      {activeTab === 'realworld' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid #334155'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{cs.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>{cs.title}</h4>
                  <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>{cs.tech}</span>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                {cs.desc}
              </p>
              <div style={{
                background: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                color: '#34d399',
                fontWeight: '600'
              }}>
                💡 Impact: {cs.impact}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INTERACTIVE QUIZ */}
      {activeTab === 'quiz' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '14px', padding: '20px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#38bdf8' }}>
              🎯 Test Your DSA Knowledge
            </h3>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fbbf24' }}>
              Score: {quizScore.correct} / {quizQuestions.length}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {quizQuestions.map(q => {
              const selected = userAnswers[q.id];
              const isAnswered = selected !== undefined;
              return (
                <div key={q.id} style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>
                    Q{q.id}: {q.question}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                    {q.options.map((opt, oIdx) => {
                      let btnBg = '#1e293b';
                      let btnBorder = '#334155';
                      let btnColor = '#cbd5e1';

                      if (isAnswered) {
                        if (oIdx === q.correct) {
                          btnBg = '#059669';
                          btnBorder = '#34d399';
                          btnColor = '#fff';
                        } else if (selected === oIdx) {
                          btnBg = '#991b1b';
                          btnBorder = '#f87171';
                          btnColor = '#fff';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(q.id, oIdx)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: `1px solid ${btnBorder}`,
                            background: btnBg,
                            color: btnColor,
                            fontSize: '12.5px',
                            fontWeight: '600',
                            textAlign: 'left',
                            cursor: isAnswered ? 'default' : 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {isAnswered && (
                    <div style={{ fontSize: '12px', color: '#94a3b8', background: '#1e293b', padding: '8px 12px', borderRadius: '6px' }}>
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
