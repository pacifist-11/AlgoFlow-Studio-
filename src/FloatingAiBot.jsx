import React, { useState, useEffect, useRef } from 'react';
import { generateLocalRagResponse } from './aiRagEngine.js';

// ─── Super Calm, Gentle & Aesthetic Zen AI Avatar ───────────────────────────
export const CalmAiAvatar = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 52 52" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ 
      filter: 'drop-shadow(0 3px 10px rgba(56, 189, 248, 0.45))',
      flexShrink: 0,
      display: 'inline-block'
    }}
  >
    {/* Ambient Peaceful Outer Glow */}
    <circle cx="26" cy="26" r="24" fill="url(#calmAmbientGlow)" opacity="0.4" />
    
    {/* Soft Floating Halo Ring */}
    <ellipse cx="26" cy="7" rx="9" ry="3" fill="none" stroke="#38bdf8" strokeWidth="1.6" opacity="0.85" />
    
    {/* Main Serene Head Sphere */}
    <circle cx="26" cy="27" r="18" fill="url(#zenHeadGrad)" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.8" />
    
    {/* Gentle Cute Floating Side Ear Wings */}
    <rect x="5" y="22" width="4" height="10" rx="2" fill="#38bdf8" opacity="0.8" />
    <rect x="43" y="22" width="4" height="10" rx="2" fill="#38bdf8" opacity="0.8" />
    
    {/* Deep Glossy Visor Display Screen */}
    <ellipse cx="26" cy="27" rx="14" ry="11" fill="#070c18" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.2" />
    
    {/* Peaceful Calm Eyes (Gentle, friendly smiling curved arcs) */}
    <path 
      d="M17.5 25.5C17.5 23 19.5 21.5 22 21.5C23.5 21.5 24.5 22.5 24.5 25.5" 
      stroke="#38bdf8" 
      strokeWidth="2.4" 
      strokeLinecap="round" 
    />
    <path 
      d="M27.5 25.5C27.5 22.5 28.5 21.5 30 21.5C32.5 21.5 34.5 23 34.5 25.5" 
      stroke="#38bdf8" 
      strokeWidth="2.4" 
      strokeLinecap="round" 
    />
    
    {/* Cute Soft Rosy Cheeks */}
    <ellipse cx="18" cy="29" rx="2.5" ry="1.5" fill="#f472b6" opacity="0.75" />
    <ellipse cx="34" cy="29" rx="2.5" ry="1.5" fill="#f472b6" opacity="0.75" />

    {/* Subtle Sweet Smile */}
    <path 
      d="M24 29.5C25 30.5 27 30.5 28 29.5" 
      stroke="#38bdf8" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
    />
    
    <defs>
      <radialGradient id="calmAmbientGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="zenHeadGrad" x1="8" y1="9" x2="44" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1e293b" />
        <stop offset="40%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
    </defs>
  </svg>
);

export default function FloatingAiBot({
  customCode = '',
  codeLang = 'C++',
  isChatOpen,
  setIsChatOpen,
  chatMessages,
  setChatMessages,
  currentContext = {}
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // ── Absolute Window Dimensions (Resizable) ──────────────────────────────────
  const [windowDimensions, setWindowDimensions] = useState(() => {
    const defaultW = Math.min(window.innerWidth - 30, 420);
    const defaultH = Math.min(window.innerHeight - 100, 580);
    return { width: defaultW, height: defaultH };
  });

  // ── Absolute Window Position (Draggable) ────────────────────────────────────
  const [windowPos, setWindowPos] = useState(() => {
    const left = Math.max(10, window.innerWidth - 450);
    const top = Math.max(10, window.innerHeight - 670);
    return { x: left, y: top };
  });

  // ── Floating Button Position (Draggable Orb) ────────────────────────────────
  const [orbPos, setOrbPos] = useState(() => {
    const left = Math.max(10, window.innerWidth - 80);
    const top = Math.max(10, window.innerHeight - 80);
    return { x: left, y: top };
  });

  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null); // 'n'|'s'|'e'|'w'|'ne'|'nw'|'se'|'sw'|null
  const [isDraggingOrb, setIsDraggingOrb] = useState(false);

  const dragOffsetRef = useRef({ 
    startX: 0, 
    startY: 0, 
    initialX: 0, 
    initialY: 0, 
    initialW: 0, 
    initialH: 0, 
    dir: null 
  });
  const orbMovedRef = useRef(false);

  const [chatOpacity, setChatOpacity] = useState(() => {
    try {
      const saved = localStorage.getItem('algoflow_chat_opacity');
      return saved ? parseFloat(saved) : 0.45;
    } catch {
      return 0.45;
    }
  });

  const messagesEndRef = useRef(null);

  // Initialize welcome message if empty
  useEffect(() => {
    if (!chatMessages || chatMessages.length === 0) {
      if (setChatMessages) {
        setChatMessages([
          {
            role: 'assistant',
            text: `✨ **Hello! I'm your AlgoFlow AI Mentor & Companion.**
I'm right here with you to explain concepts, guide your branch roadmaps, and help you understand whatever visualizer or code you're currently exploring.

How are you doing today? Ask me any question or pick a prompt below!`,
            sources: ['AlgoFlow Universal Knowledge Base'],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Adjust positions on window resize so nothing goes off-screen
  useEffect(() => {
    const handleResize = () => {
      setWindowPos(prev => ({
        x: Math.min(prev.x, Math.max(10, window.innerWidth - windowDimensions.width - 10)),
        y: Math.min(prev.y, Math.max(10, window.innerHeight - windowDimensions.height - 10))
      }));
      setOrbPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - 75),
        y: Math.min(prev.y, window.innerHeight - 75)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowDimensions]);

  // ── Drag Window Header Handlers ─────────────────────────────────────────────
  const onHeaderPointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    e.preventDefault();
    setIsDraggingWindow(true);
    dragOffsetRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: windowPos.x,
      initialY: windowPos.y
    };
  };

  // ── 8-Direction Edge & Corner Resize Start Handler ──────────────────────────
  const startEdgeResize = (e, dir) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setResizeDirection(dir);
    dragOffsetRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: windowPos.x,
      initialY: windowPos.y,
      initialW: windowDimensions.width,
      initialH: windowDimensions.height,
      dir
    };
  };

  // ── Drag Floating Launcher Orb Handlers ─────────────────────────────────────
  const onOrbPointerDown = (e) => {
    orbMovedRef.current = false;
    setIsDraggingOrb(true);
    dragOffsetRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: orbPos.x,
      initialY: orbPos.y
    };
  };

  // Global Pointer Movement for Drag & Edge Resizing
  useEffect(() => {
    const onPointerMove = (e) => {
      // 1. Dragging Window
      if (isDraggingWindow) {
        e.preventDefault();
        const dx = e.clientX - dragOffsetRef.current.startX;
        const dy = e.clientY - dragOffsetRef.current.startY;
        const newX = Math.max(5, Math.min(window.innerWidth - 80, dragOffsetRef.current.initialX + dx));
        const newY = Math.max(5, Math.min(window.innerHeight - 60, dragOffsetRef.current.initialY + dy));
        setWindowPos({ x: newX, y: newY });
      }

      // 2. Resizing from Any Edge or Corner (8 Directions)
      if (resizeDirection) {
        e.preventDefault();
        const dx = e.clientX - dragOffsetRef.current.startX;
        const dy = e.clientY - dragOffsetRef.current.startY;
        const { initialX, initialY, initialW, initialH, dir } = dragOffsetRef.current;

        const MIN_W = 300;
        const MIN_H = 360;
        const MAX_W = window.innerWidth - 15;
        const MAX_H = window.innerHeight - 15;

        let newW = initialW;
        let newH = initialH;
        let newX = initialX;
        let newY = initialY;

        // East (Right edge)
        if (dir.includes('e')) {
          newW = Math.min(MAX_W - newX, Math.max(MIN_W, initialW + dx));
        }
        // South (Bottom edge)
        if (dir.includes('s')) {
          newH = Math.min(MAX_H - newY, Math.max(MIN_H, initialH + dy));
        }
        // West (Left edge)
        if (dir.includes('w')) {
          const potentialW = Math.min(initialX + initialW - 5, Math.max(MIN_W, initialW - dx));
          newX = initialX + (initialW - potentialW);
          newW = potentialW;
        }
        // North (Top edge)
        if (dir.includes('n')) {
          const potentialH = Math.min(initialY + initialH - 5, Math.max(MIN_H, initialH - dy));
          newY = initialY + (initialH - potentialH);
          newH = potentialH;
        }

        setWindowDimensions({ width: Math.round(newW), height: Math.round(newH) });
        setWindowPos({ x: Math.round(newX), y: Math.round(newY) });
      }

      // 3. Dragging Launcher Orb
      if (isDraggingOrb) {
        const dx = e.clientX - dragOffsetRef.current.startX;
        const dy = e.clientY - dragOffsetRef.current.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          orbMovedRef.current = true;
        }
        const newX = Math.max(10, Math.min(window.innerWidth - 70, dragOffsetRef.current.initialX + dx));
        const newY = Math.max(10, Math.min(window.innerHeight - 70, dragOffsetRef.current.initialY + dy));
        setOrbPos({ x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      if (isDraggingWindow) setIsDraggingWindow(false);
      if (resizeDirection) setResizeDirection(null);
      if (isDraggingOrb) setIsDraggingOrb(false);
    };

    if (isDraggingWindow || resizeDirection || isDraggingOrb) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDraggingWindow, resizeDirection, isDraggingOrb]);

  const quickPrompts = [
    '💡 Explain this visualizer step',
    '🎓 Roadmap for 2nd Year Mech',
    '⚖️ Switch from ECE to SDE',
    '🧠 Deadlocks & Semaphore in OS',
    '🗄️ ACID & Normalization in DBMS',
    '📈 4-Step DP Blueprint',
    '⚡ Quick Sort vs Merge Sort',
    '🤖 AI & ML Career Path',
    '🛡️ Certifications for Cyber Security'
  ];

  const handleSendMessage = (msgText) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend || textToSend.trim() === '') return;

    const userMsg = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...(chatMessages || []), userMsg];
    if (setChatMessages) setChatMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        const result = generateLocalRagResponse(textToSend, customCode, codeLang, currentContext);
        const botMsg = {
          role: 'assistant',
          text: result.text,
          sources: result.sources,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        if (setChatMessages) setChatMessages([...newMessages, botMsg]);
      } catch (err) {
        const fallbackMsg = {
          role: 'assistant',
          text: `### ✨ AlgoFlow AI Mentor\n\nI am right here to help guide your learning across all 16 engineering branches, languages, and DSA algorithms! Try asking about branches (e.g. *2nd Year ECE*), DSA (e.g. *Binary Search*), or career switching.`,
          sources: ['System Knowledge Base'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        if (setChatMessages) setChatMessages([...newMessages, fallbackMsg]);
      } finally {
        setIsLoading(false);
      }
    }, 250);
  };

  const handleOpacityChange = (e) => {
    const val = parseFloat(e.target.value);
    setChatOpacity(val);
    try {
      localStorage.setItem('algoflow_chat_opacity', val.toString());
    } catch {}
  };

  const bgAlpha = Math.max(chatOpacity, 0.08);
  const blurVal = Math.max(Math.round(chatOpacity * 20), 4);
  const bubbleAlpha = Math.max(chatOpacity * 0.9, 0.25);
  const headerAlpha = Math.max(chatOpacity, 0.45);

  const curWidth = isMaximized ? Math.min(window.innerWidth - 40, 920) : windowDimensions.width;
  const curHeight = isMaximized ? Math.min(window.innerHeight - 40, 840) : windowDimensions.height;
  const curLeft = isMaximized ? Math.max(10, (window.innerWidth - curWidth) / 2) : windowPos.x;
  const curTop = isMaximized ? Math.max(10, (window.innerHeight - curHeight) / 2) : windowPos.y;

  return (
    <>
      {/* ── Chat Window Modal (Fully Draggable & Edge-Resizable) ── */}
      {isChatOpen && (
        <div 
          style={{
            position: 'fixed',
            left: `${curLeft}px`,
            top: `${curTop}px`,
            width: `${curWidth}px`,
            height: `${curHeight}px`,
            zIndex: 9999,
            background: `rgba(15, 23, 42, ${bgAlpha})`,
            border: `1.5px solid rgba(56, 189, 248, ${Math.max(chatOpacity * 0.6, 0.35)})`,
            borderRadius: '18px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 20px 60px rgba(0, 0, 0, ${Math.max(chatOpacity * 0.9, 0.45)}), 0 0 30px rgba(56, 189, 248, ${Math.max(chatOpacity * 0.3, 0.15)})`,
            backdropFilter: `blur(${blurVal}px)`,
            WebkitBackdropFilter: `blur(${blurVal}px)`,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            userSelect: (isDraggingWindow || resizeDirection) ? 'none' : 'auto'
          }}
        >
          {/* ── 8-Direction Interactive Resize Edge/Corner Hitboxes ── */}
          {!isMaximized && (
            <>
              {/* Top Edge */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'n')}
                style={{ position: 'absolute', top: 0, left: 12, right: 12, height: 7, cursor: 'ns-resize', zIndex: 10001, touchAction: 'none' }}
                title="Drag top edge to resize height"
              />
              {/* Bottom Edge */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 's')}
                style={{ position: 'absolute', bottom: 0, left: 12, right: 12, height: 7, cursor: 'ns-resize', zIndex: 10001, touchAction: 'none' }}
                title="Drag bottom edge to resize height"
              />
              {/* Left Edge */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'w')}
                style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 7, cursor: 'ew-resize', zIndex: 10001, touchAction: 'none' }}
                title="Drag left edge to resize width"
              />
              {/* Right Edge */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'e')}
                style={{ position: 'absolute', right: 0, top: 12, bottom: 12, width: 7, cursor: 'ew-resize', zIndex: 10001, touchAction: 'none' }}
                title="Drag right edge to resize width"
              />
              {/* Top-Left Corner */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'nw')}
                style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, cursor: 'nwse-resize', zIndex: 10002, touchAction: 'none' }}
                title="Drag corner to resize"
              />
              {/* Top-Right Corner */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'ne')}
                style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, cursor: 'nesw-resize', zIndex: 10002, touchAction: 'none' }}
                title="Drag corner to resize"
              />
              {/* Bottom-Left Corner */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'sw')}
                style={{ position: 'absolute', bottom: 0, left: 0, width: 14, height: 14, cursor: 'nesw-resize', zIndex: 10002, touchAction: 'none' }}
                title="Drag corner to resize"
              />
              {/* Bottom-Right Corner */}
              <div
                onPointerDown={(e) => startEdgeResize(e, 'se')}
                style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, cursor: 'nwse-resize', zIndex: 10002, touchAction: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '2px' }}
                title="Drag corner to resize"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M11 1L1 11M11 5L5 11M11 9L9 11" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
                </svg>
              </div>
            </>
          )}

          {/* Header (Acts as Smooth Real-Time Drag Handle) */}
          <div 
            onPointerDown={onHeaderPointerDown}
            style={{
              padding: '12px 16px',
              background: `linear-gradient(90deg, rgba(2, 132, 199, ${headerAlpha}) 0%, rgba(99, 102, 241, ${headerAlpha}) 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid rgba(255, 255, 255, ${Math.max(chatOpacity * 0.3, 0.15)})`,
              backdropFilter: 'blur(10px)',
              cursor: isDraggingWindow ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none'
            }}
            title="Grab & drag anywhere to move window around screen"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'none' }}>
              <CalmAiAvatar size={30} />
              <div>
                <strong style={{ fontSize: '13.5px', display: 'block', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                  AlgoFlow AI Companion
                </strong>
                <span style={{ fontSize: '10.5px', opacity: 0.95, display: 'flex', alignItems: 'center', gap: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                  Edge-Resizable & Movable
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {/* Quick Size Presets */}
              <button
                onClick={() => {
                  setIsMaximized(false);
                  setWindowDimensions({ width: 340, height: 460 });
                }}
                title="Compact Size (S)"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                S
              </button>
              <button
                onClick={() => {
                  setIsMaximized(false);
                  setWindowDimensions({ width: 440, height: 600 });
                }}
                title="Medium Size (M)"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                M
              </button>

              {/* Opacity Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Adjust Window Opacity / Transparency"
                style={{
                  background: showSettings ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: 'bold'
                }}
              >
                💧 {Math.round(chatOpacity * 100)}%
              </button>

              {/* Maximize / Restore Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore Window Size" : "Maximize Window"}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  cursor: 'pointer',
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                {isMaximized ? '❐' : '⛶'}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsChatOpen(false)}
                title="Close"
                style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', cursor: 'pointer', width: '26px', height: '26px', borderRadius: '50%', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Opacity Slider Drawer */}
          {showSettings && (
            <div style={{
              background: `rgba(9, 13, 22, ${Math.max(chatOpacity * 0.95, 0.6)})`,
              padding: '12px 16px',
              borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
              backdropFilter: 'blur(12px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  💧 See-Through Glass Opacity:
                </span>
                <span style={{ color: '#f8fafc', fontWeight: 'bold', background: '#0284c7', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>
                  {Math.round(chatOpacity * 100)}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Glass (5%)</span>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={chatOpacity}
                  onChange={handleOpacityChange}
                  style={{ flex: 1, accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Solid (100%)</span>
              </div>
            </div>
          )}

          {/* Chat Messages List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {(chatMessages || []).map((msg, i) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: isMaximized ? '75%' : '88%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
                    {!isUser && <CalmAiAvatar size={24} />}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: isUser 
                        ? `linear-gradient(135deg, rgba(2, 132, 199, ${Math.max(chatOpacity * 0.9, 0.75)}), rgba(99, 102, 241, ${Math.max(chatOpacity * 0.9, 0.75)}))` 
                        : `rgba(30, 41, 59, ${bubbleAlpha})`,
                      color: '#ffffff',
                      fontSize: '12.5px',
                      lineHeight: '1.55',
                      border: isUser ? '1px solid #38bdf8' : `1.5px solid rgba(56, 189, 248, ${Math.max(chatOpacity * 0.5, 0.35)})`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      backdropFilter: 'blur(8px)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {msg.text}
                    </div>
                  </div>

                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px', marginLeft: '32px' }}>
                      <span style={{ fontSize: '9.5px', color: '#cbd5e1', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Sources:</span>
                      {msg.sources.slice(0, 2).map((s, idx) => (
                        <span key={idx} style={{ fontSize: '9.5px', color: '#38bdf8', background: 'rgba(56,189,248,0.2)', padding: '1px 5px', borderRadius: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px', marginLeft: isUser ? '0' : '32px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CalmAiAvatar size={24} />
                <div style={{ background: `rgba(30, 41, 59, ${bubbleAlpha})`, padding: '10px 14px', borderRadius: '12px', color: '#38bdf8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(56,189,248,0.3)', backdropFilter: 'blur(8px)' }}>
                  <span style={{ animation: 'spin 1s linear infinite' }}>✨</span>
                  <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Thinking calmly & crafting solution...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div style={{
            padding: '6px 12px',
            background: `rgba(10, 16, 30, ${Math.max(chatOpacity * 0.7, 0.2)})`,
            borderTop: `1px solid rgba(255, 255, 255, ${Math.max(chatOpacity * 0.2, 0.1)})`,
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)'
          }}>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                style={{
                  background: `rgba(30, 41, 59, ${Math.max(chatOpacity * 0.8, 0.35)})`,
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#f8fafc',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.color = '#f8fafc'}
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ position: 'relative' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{
                padding: '10px 12px',
                background: `rgba(10, 16, 30, ${Math.max(chatOpacity * 0.85, 0.3)})`,
                borderTop: `1px solid rgba(255, 255, 255, ${Math.max(chatOpacity * 0.2, 0.1)})`,
                display: 'flex',
                gap: '8px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <input
                type="text"
                placeholder="Ask anything, or describe any doubt in this visualizer..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: `rgba(30, 41, 59, ${Math.max(chatOpacity * 0.9, 0.5)})`,
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  padding: '9px 14px',
                  borderRadius: '8px',
                  background: inputMessage.trim() ? 'linear-gradient(135deg, #0284c7, #6366f1)' : 'rgba(51, 65, 85, 0.6)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: inputMessage.trim() ? 'pointer' : 'default',
                  fontSize: '12.5px',
                  transition: 'all 0.2s',
                  boxShadow: inputMessage.trim() ? '0 2px 10px rgba(56, 189, 248, 0.4)' : 'none'
                }}
              >
                Ask ✨
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Freely Draggable Floating Launcher Orb Button ── */}
      <div
        onPointerDown={onOrbPointerDown}
        onClick={() => {
          // Only toggle chat if user clicked without dragging
          if (!orbMovedRef.current) {
            setIsChatOpen(!isChatOpen);
          }
        }}
        title="AlgoFlow AI Companion (Click to open, drag to move orb anywhere)"
        style={{
          position: 'fixed',
          left: `${orbPos.x}px`,
          top: `${orbPos.y}px`,
          zIndex: 9998,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #8b5cf6 100%)',
          border: '2px solid rgba(255, 255, 255, 0.75)',
          color: '#fff',
          cursor: isDraggingOrb ? 'grabbing' : 'grab',
          boxShadow: '0 8px 30px rgba(99, 102, 241, 0.55), 0 0 25px rgba(56, 189, 248, 0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: isDraggingOrb ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isChatOpen ? 'scale(1.05)' : 'scale(1)',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        <CalmAiAvatar size={36} />
        <span style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.6)',
          animation: 'pulse 2.5s ease-in-out infinite',
          opacity: 0.7,
          pointerEvents: 'none'
        }} />
      </div>
    </>
  );
}
