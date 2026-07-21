import React from 'react';
import { TOPIC_INFO } from './topicInfoData.js';

const TopicInfoModal = ({ topicKey, customTitle, isOpen, onClose }) => {
  if (!isOpen) return null;

  const info = TOPIC_INFO[topicKey] || {
    title: customTitle || topicKey || 'Topic Guide',
    summary: 'An interactive data structure / algorithm visualizer module to help you learn step-by-step.',
    formula: 'Result = Evaluate(Input, Parameters)',
    example: '1. Enter input values.\n2. Click Run/Insert to observe calculation steps.\n3. Verify output in visualizer.',
    realLife: [
      'Used in software development for data processing and optimization.',
      'Used in web servers, databases, and operating system modules.'
    ],
    howToUse: [
      'Use the input controls to perform operations (Insert, Delete, Search, Step).',
      'Observe the visual state changes and pointer movements step-by-step.',
      'Check the Operations Log panel to inspect the exact formula or logic evaluated.'
    ],
    keyPoints: 'Designed for interactive pair programming and algorithm mastery.'
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(5, 5, 16, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(13, 13, 32, 0.99))',
          border: '1px solid var(--accent-primary)',
          borderRadius: '18px',
          boxShadow: '0 0 35px rgba(0, 229, 255, 0.3)',
          maxWidth: '580px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.8rem',
          color: 'var(--text-primary)',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '15px',
            right: '18px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: '8px'
          }}
          title="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
          <span style={{ fontSize: '2rem' }}>ℹ️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {info.title}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600 }}>Beginner Guide & Real-Life Uses</span>
          </div>
        </div>

        {/* What it is */}
        <div style={{ marginBottom: '1.2rem', background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '4px solid var(--accent-primary)' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.92rem', color: 'var(--accent-primary)' }}>📌 What is this?</h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {info.summary}
          </p>
        </div>

        {/* Formula / Rule */}
        {info.formula && (
          <div style={{ marginBottom: '1.2rem', background: 'rgba(16, 185, 129, 0.08)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🧮 Formula & Core Rule
            </h4>
            <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 'bold' }}>
              {info.formula}
            </div>
          </div>
        )}

        {/* Numerical Example */}
        {info.example && (
          <div style={{ marginBottom: '1.2rem', background: 'rgba(245, 158, 11, 0.08)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔢 Step-by-Step Numerical Example
            </h4>
            <div style={{ fontFamily: 'monospace', fontSize: '0.84rem', color: '#fef3c7', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
              {info.example}
            </div>
          </div>
        )}

        {/* Real-Life Applications */}
        {info.realLife && info.realLife.length > 0 && (
          <div style={{ marginBottom: '1.2rem', background: 'rgba(59, 130, 246, 0.08)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🌍 Where is this used in Real Life?
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {info.realLife.map((app, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{app}</li>
              ))}
            </ul>
          </div>
        )}

        {/* How to Observe */}
        {info.howToUse && info.howToUse.length > 0 && (
          <div style={{ marginBottom: '1.2rem' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#a78bfa' }}>🚀 How to Handle & Observe:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {info.howToUse.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Takeaways */}
        {info.keyPoints && (
          <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '10px 14px', borderRadius: '10px', border: '1px dashed rgba(0, 229, 255, 0.2)', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              💡 <strong>Key Takeaway:</strong> {info.keyPoints}
            </span>
          </div>
        )}

        <button 
          onClick={onClose}
          style={{
            marginTop: '0.5rem',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,229,255,0.3)'
          }}
        >
          Got it! Start Learning 🚀
        </button>
      </div>
    </div>
  );
};

export default TopicInfoModal;
