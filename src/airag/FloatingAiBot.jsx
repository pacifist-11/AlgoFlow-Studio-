import React, { useState, useEffect, useRef } from 'react';
import { generateLocalRagResponse } from './aiRagEngine.js';
import { ChatMessageRenderer } from './ChatMessageRenderer.jsx';
import { askAlgoFlowAiMentor, getActiveGeminiApiKey, getActiveGeminiModel } from './geminiService.js';
import { 
  clearUserChatMessages, 
  trackUserHabit, 
  getTopUserHabits,
  loadUserChatSessions,
  saveUserChatSessions,
  generateSessionTitle
} from '../auth/userAuthService.js';
import { subscribeScreenContext, clearScreenError, getScreenContext } from '../screenContext.js';

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
  currentContext = {},
  apiKey = '',
  model = 'gemini-3.6-flash',
  setApiKey,
  setModel,
  activeUser = null
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // ── Problem Pic / Image Upload & Vision State ─────────────────────────────
  const [attachedImage, setAttachedImage] = useState(null);
  const [isDragOverChat, setIsDragOverChat] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const fileInputRef = useRef(null);

  const processImageFile = (file) => {
    if (!file || !file.type || !file.type.startsWith('image/')) return;
    if (typeof window === 'undefined') return;
    const FileReaderClass = window.FileReader;
    const ImageClass = window.Image;
    if (!FileReaderClass || !ImageClass) return;

    const reader = new FileReaderClass();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new ImageClass();
      img.onload = () => {
        // Downscale to max 1280px on longest edge so textbook/handwritten math remains crisp, but base64 is light (~150-250KB)
        const maxDim = 1280;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mime, 0.85);
        const base64Data = compressedDataUrl.replace(/^data:[^;]+;base64,/, '');

        setAttachedImage({
          dataUrl: compressedDataUrl,
          mimeType: mime,
          base64: base64Data,
          name: file.name || 'problem-photo.jpg',
          size: Math.round(base64Data.length * 0.75)
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleInputPaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          e.preventDefault();
          return;
        }
      }
    }
  };

  // ── ChatGPT / Copilot / Gemini Smooth Streaming & Typewriter Controller ─────
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const fullTextTargetRef = useRef('');
  const displayedTextRef = useRef('');
  const isStreamCompleteRef = useRef(false);
  const activeSourcesRef = useRef([]);
  const activeNoticeRef = useRef('');

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // ── Real-Time Live Screen Telemetry & Diagnostics ───────────────────────────
  const [liveScreen, setLiveScreen] = useState(() => getScreenContext());

  useEffect(() => {
    const unsub = subscribeScreenContext((st) => {
      setLiveScreen({ ...st });
    });
    return unsub;
  }, []);
  
  // ── Absolute Window Dimensions (Spacious, Responsive & Persisted) ───────────
  const [windowDimensions, setWindowDimensions] = useState(() => {
    try {
      const saved = localStorage.getItem('algoflow_chat_dimensions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.width >= 380 && parsed.height >= 480) {
          return {
            width: Math.min(window.innerWidth - 30, parsed.width),
            height: Math.min(window.innerHeight - 40, parsed.height)
          };
        }
      }
    } catch {}
    // Spacious, modern default: 570px × 700px on desktop
    const defaultW = Math.min(window.innerWidth - 30, Math.max(460, Math.min(Math.round(window.innerWidth * 0.40), 570)));
    const defaultH = Math.min(window.innerHeight - 40, Math.max(540, Math.min(Math.round(window.innerHeight * 0.78), 700)));
    return { width: defaultW, height: defaultH };
  });

  // ── Absolute Window Position (Draggable) ────────────────────────────────────
  const [windowPos, setWindowPos] = useState(() => {
    try {
      const saved = localStorage.getItem('algoflow_chat_dimensions');
      const w = saved ? JSON.parse(saved).width : Math.min(window.innerWidth - 30, Math.max(460, Math.min(Math.round(window.innerWidth * 0.40), 570)));
      const h = saved ? JSON.parse(saved).height : Math.min(window.innerHeight - 40, Math.max(540, Math.min(Math.round(window.innerHeight * 0.78), 700)));
      const left = Math.max(15, window.innerWidth - w - 24);
      const top = Math.max(15, window.innerHeight - h - 24);
      return { x: left, y: top };
    } catch {
      const left = Math.max(15, window.innerWidth - 590);
      const top = Math.max(15, window.innerHeight - 730);
      return { x: left, y: top };
    }
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
  const chatContainerRef = useRef(null);
  const userScrolledUpRef = useRef(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

  // ── Multi-Session Past Chats & Conversations State ─────────────────────────
  const [sessions, setSessions] = useState(() => {
    return loadUserChatSessions(activeUser?.email);
  });
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const list = loadUserChatSessions(activeUser?.email);
    return (list && list.length > 0) ? list[0].id : null;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [infoModalSession, setInfoModalSession] = useState(null);

  // Sync sessions when activeUser changes or on first mount
  useEffect(() => {
    const loaded = loadUserChatSessions(activeUser?.email);
    if (loaded && loaded.length > 0) {
      setSessions(loaded);
      if (!activeSessionId || !loaded.some(s => s.id === activeSessionId)) {
        setActiveSessionId(loaded[0].id);
        if (setChatMessages && loaded[0].messages) {
          setChatMessages(loaded[0].messages);
        }
      }
    } else {
      const defaultSession = {
        id: `session_${Date.now()}`,
        title: 'New Chat',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        searchedQueries: [],
        messages: chatMessages && chatMessages.length > 0 ? chatMessages : [
          {
            role: 'assistant',
            text: `✨ **Hello! I'm your AlgoFlow AI Mentor & Companion.**
I'm right here with you to explain concepts, guide your branch roadmaps, and help you understand whatever visualizer or code you're currently exploring.

How are you doing today? Ask me any question or pick a prompt below!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setSessions([defaultSession]);
      setActiveSessionId(defaultSession.id);
      saveUserChatSessions(activeUser?.email, [defaultSession]);
      if (setChatMessages) setChatMessages(defaultSession.messages);
    }
  }, [activeUser?.email]);

  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // When distance from bottom is greater than 65px, user has deliberately scrolled up
    const isUp = (scrollHeight - scrollTop - clientHeight) > 65;
    userScrolledUpRef.current = isUp;
    setShowScrollBottomBtn(isUp);
  };

  const scrollToBottom = (behavior = 'smooth') => {
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Auto-scroll only if user has NOT scrolled up
  useEffect(() => {
    if (messagesEndRef.current && !userScrolledUpRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: isGenerating ? 'auto' : 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Auto-focus input when chat opens so user can immediately type
  useEffect(() => {
    if (isChatOpen) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

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
      if (resizeDirection) {
        setResizeDirection(null);
        try {
          localStorage.setItem('algoflow_chat_dimensions', JSON.stringify({
            width: windowDimensions.width,
            height: windowDimensions.height
          }));
        } catch {}
      }
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

  // ── Context-Aware Algorithm & Visualizer Detection ──────────────────────────
  const getContextInfo = () => {
    const { appMode, treeType, globalDsType, globalDsVariety, globalSort, globalSearch, globalSortSearchTab } = currentContext || {};
    
    // 0. Beginners 101 Visualizer (Branch Roadmaps, Language Career Guide, Memory, DSA Scale)
    if (appMode === 'BEGINNER_101_VIS') {
      return {
        title: '🌱 Beginner 101 & Engineering Foundations',
        badge: 'Beginner 101',
        prompts: [
          '🎓 16 B.Tech Branch Roadmaps & Milestones',
          '💼 Language Career Guide (Salary & Roles)',
          '📦 Variables & Memory Allocation in RAM',
          '⚡ Why DSA Matters for Tech Placements',
          '🔍 Linear vs Binary Search Scalability',
          '👶 Explain Big-O Complexity like I am 5'
        ],
        defaultQuestion: 'Guide me through engineering branch roadmaps, language career options, and beginner CS foundations!'
      };
    }

    // 1. General Data Structures Visualizer (Hash Tables, Stacks, Queues, Linked Lists)
    if (appMode === 'GENERAL_DSA_VIS') {
      if (globalDsType === 'HASH_TABLE' || (globalDsVariety && String(globalDsVariety).startsWith('HASH_'))) {
        return {
          title: '⚡ Hash Table & Hashing Visualizer',
          badge: 'Hash Table',
          prompts: [
            '⚡ What is Hash & How does it work?',
            '📐 Hash Formulas (Linear vs Quadratic)',
            '💡 Why do we use Hash Tables?',
            '🛡️ Chaining vs Open Addressing',
            '💻 Show Hash Table C++ / Java Code',
            '👶 Explain Hashing like I am 5'
          ],
          defaultQuestion: 'Help me understand Hash Tables, collision resolution, and hash formulas step-by-step!'
        };
      }
      if (globalDsType === 'STACK') {
        return {
          title: '📚 Stack Data Structure (LIFO)',
          badge: 'Stack ADT',
          prompts: [
            '📚 Explain Stack LIFO Principle',
            '📐 Push & Pop Formulas',
            '💡 Why do we use Stacks?',
            '🔄 Infix to Postfix Conversion',
            '💻 Stack in C++ / Java',
            '👶 Explain Stack like I am 5'
          ],
          defaultQuestion: 'Help me understand Stack LIFO operations and expression evaluation!'
        };
      }
      if (globalDsType === 'QUEUE') {
        return {
          title: '🚶 Queue Data Structure (FIFO)',
          badge: 'Queue ADT',
          prompts: [
            '🚶 Explain Queue FIFO Principle',
            '📐 Circular Queue Modulo Formula',
            '💡 Why do we use Queues?',
            '⚡ Deque vs Priority Queue',
            '💻 Queue in C++ / Java',
            '👶 Explain Queue like I am 5'
          ],
          defaultQuestion: 'Help me understand Queue FIFO operations and circular buffering!'
        };
      }
      if (globalDsType === 'LINKED_LIST') {
        return {
          title: '🔗 Linked List Visualizer',
          badge: 'Linked List',
          prompts: [
            '🔗 Singly vs Doubly Linked List',
            '📐 Pointer Manipulation & Reversal',
            '💡 Why do we use Linked Lists?',
            '⚡ Floyd Cycle Finding Algorithm',
            '💻 Reverse Linked List Code',
            '👶 Explain Linked List like I am 5'
          ],
          defaultQuestion: 'Help me understand Linked List node traversal and pointer manipulation!'
        };
      }
    }

    // 2. Tree Visualizer (MAIN_VIS) - ONLY when user is actively inside the Tree Visualizer
    if (appMode === 'MAIN_VIS') {
      const normalizedTree = String(treeType || 'BST').toUpperCase();
      if (normalizedTree === 'AVL') {
        return {
          title: '🌲 AVL Tree (Self-Balancing BST)',
          badge: 'AVL Tree',
          prompts: [
            '🌲 Explain AVL Tree & Balance Factor',
            '🔄 Why LL vs LR Rotation happens?',
            '👶 Explain AVL like I am 5',
            '💻 Show AVL Tree C++ / Java Code',
            '⚖️ AVL Tree vs Red-Black Tree',
            '⚡ Try: Insert 10, 20, 30'
          ],
          defaultQuestion: 'Help me understand AVL Tree rotations, balance factors, and how balancing works step-by-step!'
        };
      }
      if (normalizedTree === 'RB_TREE' || normalizedTree === 'RED_BLACK') {
        return {
          title: '🔴⚫ Red-Black Tree',
          badge: 'Red-Black Tree',
          prompts: [
            '🔴 Explain Red-Black Tree 5 Rules',
            '🔄 Color Flipping vs Rotations',
            '👶 Explain Red-Black like I am 5',
            '⚖️ Red-Black vs AVL Tree',
            '💻 Show RB Tree Search & Insert'
          ],
          defaultQuestion: 'Help me understand Red-Black Tree rules, color flipping, and rotations step-by-step!'
        };
      }
      if (normalizedTree === 'B_TREE' || normalizedTree === 'B_PLUS_TREE') {
        return {
          title: '🗄️ B-Tree / B+ Tree (Database Index)',
          badge: 'B-Tree',
          prompts: [
            '🗄️ Why do Databases use B+ Trees?',
            '✂️ How Node Splitting works on overflow',
            '👶 Explain B-Tree like I am 5',
            '⚖️ B-Tree vs B+ Tree Differences',
            '💻 B-Tree Order (M) & Disk I/O'
          ],
          defaultQuestion: 'Help me understand B-Tree / B+ Tree node splitting and database indexing!'
        };
      }
      if (normalizedTree === 'SEGMENT_TREE') {
        return {
          title: '📊 Segment Tree (Range Queries)',
          badge: 'Segment Tree',
          prompts: [
            '📊 How Segment Tree Range Query works O(log N)',
            '⚡ Point Update vs Range Update',
            '👶 Explain Segment Tree like I am 5',
            '💻 Segment Tree Build & Query Code'
          ],
          defaultQuestion: 'Help me understand Segment Tree range sum queries and tree construction!'
        };
      }
      if (normalizedTree === 'MIN_HEAP' || normalizedTree === 'MAX_HEAP') {
        return {
          title: '⛰️ Binary Heap (Priority Queue)',
          badge: 'Binary Heap',
          prompts: [
            '⛰️ How Heapify-Up & Heapify-Down work',
            '⚡ Complete Binary Tree Array Indexing',
            '👶 Explain Heap like I am 5',
            '💻 Heap Sort O(N log N) in-place'
          ],
          defaultQuestion: 'Help me understand Binary Heap, Priority Queue, and Heapify operations!'
        };
      }
      if (normalizedTree === 'TRIE') {
        return {
          title: '🔤 Trie (Prefix Tree)',
          badge: 'Trie',
          prompts: [
            '🔤 How Trie Autocomplete works',
            '⚡ Insert & Search O(L) time',
            '👶 Explain Trie like I am 5',
            '💻 Trie Implementation in C++ / Java'
          ],
          defaultQuestion: 'Help me understand Trie Prefix Tree search and autocomplete!'
        };
      }
      // Default to BST only inside MAIN_VIS
      return {
        title: '🌳 Binary Search Tree (BST)',
        badge: 'BST',
        prompts: [
          '🌳 How does BST Insert & Search work?',
          '📉 Why can BST degenerate to O(N)?',
          '👶 Explain BST like I am 5',
          '💻 BST Inorder Traversal (Sorted)',
          '🌲 BST vs AVL Tree'
        ],
        defaultQuestion: 'Help me understand how Binary Search Tree works and why it needs balancing!'
      };
    }

    // 3. Sorting & Searching Visualizer
    if (appMode === 'SORT_SEARCH_VIS' || appMode === 'sortSearch') {
      const activeAlg = (globalSortSearchTab === 'search' ? globalSearch : globalSort) || globalSort || 'Quick Sort';
      return {
        title: `⚡ ${String(activeAlg).toUpperCase()} Visualizer`,
        badge: activeAlg,
        prompts: [
          `⚡ Explain ${activeAlg} step-by-step`,
          '⏱️ Best vs Worst Case Time Complexity',
          '👶 Explain this algorithm like I am 5',
          '💻 Show Clean C++ / Java / Python Code',
          '⚖️ Quick Sort vs Merge Sort'
        ],
        defaultQuestion: `Help me understand ${activeAlg} algorithm and how it partitions/swaps elements!`
      };
    }

    // 4. Graph Visualizer
    if (appMode === 'GRAPH_VIS' || appMode === 'graphs') {
      return {
        title: '🗺️ Graph Algorithms Visualizer',
        badge: 'Graphs',
        prompts: [
          '🗺️ Why Dijkstra relaxes edges',
          '🚀 BFS vs DFS when to use which',
          '⛰️ Kruskal vs Prim Minimum Spanning Tree',
          '⏱️ Time Complexities of Graph Traversal',
          '💻 Dijkstra Priority Queue implementation'
        ],
        defaultQuestion: 'Help me understand Dijkstra shortest path, BFS, and graph edge relaxation!'
      };
    }

    // 5. Dynamic Programming & Greedy
    if (appMode === 'DP_GREEDY_VIS' || appMode === 'dpGreedy') {
      return {
        title: '📈 Dynamic Programming & Greedy',
        badge: 'DP & Greedy',
        prompts: [
          '📈 4-Step DP Blueprint (State & Recurrence)',
          '💰 0/1 Knapsack: Memoization vs Tabulation',
          '⚖️ Coin Change: Why Greedy Fails',
          '👶 Explain Dynamic Programming like I am 5',
          '💻 LCS & LIS implementation in C++ / Java'
        ],
        defaultQuestion: 'Help me understand Dynamic Programming state transitions and subproblem memoization!'
      };
    }

    // 6. Java & OOP Architecture Visualizer
    if (appMode === 'JAVA_OOP_VIS') {
      return {
        title: '🧱 Object-Oriented Programming (OOP) Architecture',
        badge: 'OOP & Java',
        prompts: [
          '🧱 4 Pillars of OOP (Encapsulation, Abstraction, etc.)',
          '📐 SOLID Principles with Clean Code Examples',
          '⚙️ Abstract Class vs Interface in Java',
          '🧠 Method Overloading vs Overriding & vtable',
          '👶 Explain OOP like I am 5'
        ],
        defaultQuestion: 'Explain the 4 Pillars of OOP and SOLID principles with real-world software architecture examples!'
      };
    }

    // 7. PythonTutor Line Debugger & Code Runner
    if (appMode === 'LINE_BY_LINE_VIS' || appMode === 'CODE_VAL_VIS') {
      return {
        title: '💻 Code Debugger & Runtime Stack Inspector',
        badge: 'Code Runner',
        prompts: [
          '🐞 Trace Stack & Heap Memory Allocation',
          '⏱️ Calculate Time & Space Complexity',
          '🛡️ Boundary & Null Pointer Edge Cases',
          '⚡ Optimize this code to O(1) / O(log N)',
          '🔄 Convert this code to Python / C++'
        ],
        defaultQuestion: 'Analyze my active code in the runner for bugs, time complexity, and optimization opportunities!'
      };
    }

    // 8. DSA Notes & Solved Problems Studio
    if (appMode === 'DSA_NOTES_VIS' || appMode === 'DSA_STUDY_VIS' || appMode === 'DSA_SUMS_VIS') {
      return {
        title: '📚 DSA Notes & LeetCode Interview Problems',
        badge: 'DSA Solved',
        prompts: [
          '🎯 Two Sum: O(N) Hash Map approach',
          '📚 Valid Parentheses using Stack',
          '🔗 Reverse a Singly Linked List in-place',
          '📈 Best Time to Buy & Sell Stock (Kadane)',
          '🧵 KMP String Matching LPS Array'
        ],
        defaultQuestion: 'Explain core DSA interview problems, optimal approaches, and trade-offs!'
      };
    }

    // 9. Default General Studio Prompts (Home Screen / Landing Page)
    return {
      title: '✨ AlgoFlow AI Mentor',
      badge: 'AlgoFlow AI',
      prompts: [
        '🕒 What is the current time?',
        '⚡ Quick Sort vs Merge Sort',
        '🎓 4-Year B.Tech Roadmap for CSE / ECE',
        '🧠 Deadlocks & Semaphores in OS',
        '🗄️ ACID & Normalization in DBMS',
        '🌲 How does AVL Tree balance?',
        '💻 Show code to reverse words in Python',
        '🗺️ Dijkstra Shortest Path Algorithm'
      ],
      defaultQuestion: 'Help me understand algorithms, computer science concepts, and engineering roadmaps!'
    };
  };

  const contextInfo = getContextInfo();
  const rawPrompts = contextInfo.prompts;
  const quickPrompts = [
    ...(liveScreen?.screenTitle ? [`🔍 What's happening on my screen?`] : []),
    ...(liveScreen?.lastErrorOrIssue ? [`🐞 Fix screen issue`] : []),
    ...rawPrompts
  ];

  const updateActiveSessionMessages = (msgs, queryToAdd = null) => {
    setSessions(prev => {
      const currentList = prev && prev.length > 0 ? [...prev] : [];
      let idx = currentList.findIndex(s => s.id === activeSessionId);
      if (idx === -1) {
        const newS = {
          id: activeSessionId || `session_${Date.now()}`,
          title: queryToAdd ? generateSessionTitle(queryToAdd) : 'New Chat',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          searchedQueries: queryToAdd ? [queryToAdd.trim()] : [],
          messages: msgs
        };
        currentList.unshift(newS);
        saveUserChatSessions(activeUser?.email, currentList);
        return currentList;
      }
      const existing = { ...currentList[idx] };
      existing.messages = msgs;
      existing.updatedAt = Date.now();
      if (queryToAdd) {
        if (!existing.title || existing.title === 'New Chat' || existing.title === 'Previous Chat' || existing.title === 'New Conversation') {
          existing.title = generateSessionTitle(queryToAdd);
        }
        const queries = Array.isArray(existing.searchedQueries) ? [...existing.searchedQueries] : [];
        if (!queries.includes(queryToAdd.trim())) {
          queries.unshift(queryToAdd.trim());
          existing.searchedQueries = queries.slice(0, 30);
        }
      }
      currentList[idx] = existing;
      currentList.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      saveUserChatSessions(activeUser?.email, currentList);
      return currentList;
    });
  };

  const handleStartNewChat = () => {
    const newSessionId = `session_${Date.now()}`;
    const initialMsg = [
      {
        role: 'assistant',
        text: `✨ **Hello! I'm your AlgoFlow AI Mentor & Companion.**\nReady for your next coding exploration or algorithm challenge! What would you like to ask or build today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    const newSession = {
      id: newSessionId,
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      searchedQueries: [],
      messages: initialMsg
    };

    const updated = [newSession, ...(sessions || [])];
    setSessions(updated);
    setActiveSessionId(newSessionId);
    if (setChatMessages) setChatMessages(initialMsg);
    saveUserChatSessions(activeUser?.email, updated);
    setIsSidebarOpen(false);
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
  };

  const handleSelectSession = (session) => {
    if (!session) return;
    setActiveSessionId(session.id);
    if (setChatMessages && session.messages) {
      setChatMessages(session.messages);
    }
    setIsSidebarOpen(false);
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    const remaining = (sessions || []).filter(s => s.id !== sessionId);
    setSessions(remaining);
    saveUserChatSessions(activeUser?.email, remaining);

    if (activeSessionId === sessionId) {
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        if (setChatMessages) setChatMessages(remaining[0].messages || []);
      } else {
        handleStartNewChat();
      }
    }
  };

  const handleStopGenerating = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const currentText = displayedTextRef.current || fullTextTargetRef.current || '';
    setChatMessages(prev => {
      if (!prev || prev.length === 0) return prev;
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last && last.role === 'assistant') {
        copy[copy.length - 1] = {
          ...last,
          text: currentText,
          isStreaming: false,
          sources: activeSourcesRef.current && activeSourcesRef.current.length > 0 ? activeSourcesRef.current : (last.sources || []),
          offlineNotice: activeNoticeRef.current || last.offlineNotice
        };
      }
      updateActiveSessionMessages(copy);
      return copy;
    });

    setIsGenerating(false);
    setIsLoading(false);
  };

  const handleSendMessage = async (msgText) => {
    if (isGenerating) return;
    const currentAttached = attachedImage;
    let textToSend = typeof msgText === 'string' ? msgText : inputMessage;

    if ((!textToSend || textToSend.trim() === '') && !currentAttached) return;

    if ((!textToSend || textToSend.trim() === '') && currentAttached) {
      textToSend = "Please inspect this uploaded problem/sum, solve it step-by-step with clear calculations, explain the concept, and provide the final answer and any relevant code.";
    }

    if (textToSend === "🔍 What's happening on my screen?") {
      textToSend = "Can you analyze what is currently happening on my screen, what algorithm is active, what step I am on, and explain the current visualization or status?";
    } else if (textToSend === "🐞 Fix screen issue") {
      textToSend = `I encountered an issue on my screen: "${liveScreen?.lastErrorOrIssue || 'a problem occurred'}". Can you explain why it happened and provide the exact fix or alternative?`;
    }

    const userMsg = {
      role: 'user',
      text: textToSend.trim(),
      image: currentAttached ? currentAttached.dataUrl : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const streamingBotMsg = {
      role: 'assistant',
      text: '',
      isStreaming: true,
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...(chatMessages || []), userMsg, streamingBotMsg];
    if (setChatMessages) setChatMessages(updatedMessages);
    updateActiveSessionMessages(updatedMessages, textToSend);

    setInputMessage('');
    setAttachedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = '38px';
    }
    setIsGenerating(true);
    setIsLoading(true);
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);

    fullTextTargetRef.current = '';
    displayedTextRef.current = '';
    isStreamCompleteRef.current = false;
    activeSourcesRef.current = [];
    activeNoticeRef.current = '';

    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Smooth progressive typewriter that outputs word-by-word and line-by-line
    streamIntervalRef.current = setInterval(() => {
      const target = fullTextTargetRef.current;
      const current = displayedTextRef.current;

      if (current.length < target.length) {
        // Once first characters stream in, dismiss loading skeleton
        setIsLoading(false);

        const diff = target.length - current.length;
        let step = 2;
        if (diff > 450) step = 16;
        else if (diff > 180) step = 8;
        else if (diff > 60) step = 4;
        else if (diff > 15) step = 2;
        else step = 1;

        const nextSlice = target.slice(0, current.length + step);
        displayedTextRef.current = nextSlice;

        setChatMessages(prev => {
          if (!prev || prev.length === 0) return prev;
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.role === 'assistant' && last.isStreaming) {
            copy[copy.length - 1] = {
              ...last,
              text: nextSlice
            };
          }
          return copy;
        });

        if (messagesEndRef.current && !userScrolledUpRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
      } else if (isStreamCompleteRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setIsGenerating(false);
        setIsLoading(false);

        setChatMessages(prev => {
          if (!prev || prev.length === 0) return prev;
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last && last.role === 'assistant') {
            copy[copy.length - 1] = {
              ...last,
              text: target,
              isStreaming: false,
              sources: activeSourcesRef.current && activeSourcesRef.current.length > 0 ? activeSourcesRef.current : (last.sources || []),
              offlineNotice: activeNoticeRef.current || last.offlineNotice
            };
          }
          updateActiveSessionMessages(copy);
          return copy;
        });

        if (messagesEndRef.current && !userScrolledUpRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 22);

    try {
      const activeKey = apiKey || getActiveGeminiApiKey();
      const activeModel = model || 'gemini-3.6-flash';
      const userHabits = activeUser?.email ? getTopUserHabits(activeUser.email, 4) : [];

      const result = await askAlgoFlowAiMentor({
        query: textToSend,
        image: currentAttached ? { mimeType: currentAttached.mimeType, base64: currentAttached.base64 } : null,
        customCode,
        codeLang,
        currentContext,
        apiKey: activeKey,
        model: activeModel,
        userProfile: activeUser ? { ...activeUser, habits: userHabits } : null,
        chatHistory: updatedMessages.slice(-6),
        signal: abortController.signal,
        onStreamChunk: (accumulated) => {
          fullTextTargetRef.current = accumulated;
        }
      });

      fullTextTargetRef.current = result.text || fullTextTargetRef.current;
      activeSourcesRef.current = result.sources || [];
      activeNoticeRef.current = result.offlineNotice || '';
      isStreamCompleteRef.current = true;

      if (activeUser?.email) {
        const topic = currentContext?.treeType || currentContext?.globalSort || currentContext?.globalDsType || currentContext?.appMode || 'General';
        trackUserHabit(activeUser.email, topic);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Stopped by user
      }
      console.warn('AI Mentor response error, using fallback:', err);
      if (currentAttached) {
        fullTextTargetRef.current = `### 📷 Image Received for Problem Solving\n\nAlgoFlow received your problem photo! To analyze handwritten math, formulas, and visual problem statements, the live **Google Gemini Vision** engine is required.\n\n* **Tips to enable:** Ensure your internet connection is active, or configure a Google Gemini API Key in chat settings (⚙️ icon in top bar).`;
        activeSourcesRef.current = ['AlgoFlow Vision Assistant'];
        activeNoticeRef.current = '💡 Vision requires online Gemini';
        isStreamCompleteRef.current = true;
      } else {
        const fallbackResult = generateLocalRagResponse(textToSend, customCode, codeLang, currentContext);
        fullTextTargetRef.current = fallbackResult.text;
        activeSourcesRef.current = fallbackResult.sources || [];
        activeNoticeRef.current = '💡 Offline Mode';
        isStreamCompleteRef.current = true;
      }
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollH, 38), 140)}px`;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating) {
        handleSendMessage();
      }
    }
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
  const isCompact = curWidth <= 530;

  const filteredSessions = (sessions || []).filter(session => {
    if (!chatSearchQuery.trim()) return true;
    const q = chatSearchQuery.toLowerCase();
    const titleMatch = session.title?.toLowerCase().includes(q);
    const queryMatch = session.searchedQueries?.some(sq => sq.toLowerCase().includes(q));
    const msgMatch = session.messages?.some(m => m.text?.toLowerCase().includes(q));
    return titleMatch || queryMatch || msgMatch;
  });

  return (
    <>
      {/* ── Chat Window Modal (Fully Draggable & Edge-Resizable) ── */}
      {isChatOpen && (
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            if (!isDragOverChat) setIsDragOverChat(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsDragOverChat(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOverChat(false);
            const file = e.dataTransfer?.files?.[0];
            if (file && file.type?.startsWith('image/')) {
              processImageFile(file);
            }
          }}
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
          {/* Visual Dropzone Indicator when dragging an image over chat */}
          {isDragOverChat && (
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 100018,
              background: 'rgba(2, 132, 199, 0.65)',
              backdropFilter: 'blur(6px)',
              border: '3px dashed #38bdf8',
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#ffffff',
              pointerEvents: 'none',
              animation: 'fadeIn 0.15s ease'
            }}>
              <span style={{ fontSize: '42px' }}>📷</span>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.3px' }}>
                Drop your problem photo or sum here!
              </span>
              <span style={{ fontSize: '13px', color: '#e0f2fe', maxWidth: '80%', textAlign: 'center' }}>
                AlgoFlow AI Vision will inspect the question, equations & diagrams to solve step-by-step
              </span>
            </div>
          )}
          {/* ── Slide-Out Past Chats Sidebar Drawer ── */}
          {isSidebarOpen && (
            <>
              {/* Click-away backdrop overlay */}
              <div
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10009,
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(3px)',
                  animation: 'fadeIn 0.15s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: isCompact ? '100%' : Math.min(330, curWidth - 35),
                zIndex: 10010,
                background: 'linear-gradient(180deg, #0b1120 0%, #0f172a 100%)',
                borderRight: '1.5px solid rgba(56, 189, 248, 0.45)',
                boxShadow: '10px 0 35px rgba(0, 0, 0, 0.75), 0 0 20px rgba(56, 189, 248, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(20px)',
                animation: 'fadeIn 0.18s ease'
              }}>
              {/* Sidebar Header */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(30, 41, 59, 0.75)'
              }}>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  style={{
                    background: 'rgba(56, 189, 248, 0.18)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Return to active conversation"
                >
                  ← Back to Chat
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>💬</span>
                  <span style={{ fontWeight: '700', fontSize: '13px', color: '#f8fafc' }}>
                    {isCompact ? 'Past Chats' : 'Past Conversations'}
                  </span>
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    fontSize: '10.5px',
                    fontWeight: '800'
                  }}>
                    {sessions.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleStartNewChat();
                    setIsSidebarOpen(false);
                  }}
                  title="Start a new chat session"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ➕ New
                </button>
              </div>

              {/* Start New Chat Button */}
              <div style={{ padding: '10px 12px 6px 12px' }}>
                <button
                  onClick={handleStartNewChat}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 3px 12px rgba(2, 132, 199, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>➕</span>
                  <span>Start New Chat</span>
                </button>
              </div>

              {/* Search Past Chats Input */}
              <div style={{ padding: '6px 12px 8px 12px', position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(30, 41, 59, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  padding: '0 8px',
                  height: '32px'
                }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '6px' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search chats & questions..."
                    value={chatSearchQuery}
                    onChange={e => setChatSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '11.5px',
                      outline: 'none'
                    }}
                  />
                  {chatSearchQuery && (
                    <button
                      onClick={() => setChatSearchQuery('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '11px',
                        padding: '0 2px'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Past Chats List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '4px 10px 12px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {filteredSessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 10px', color: '#94a3b8', fontSize: '12px' }}>
                    {chatSearchQuery ? 'No conversations matching your search.' : 'No saved conversations yet.'}
                  </div>
                ) : (
                  filteredSessions.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const queryCount = session.searchedQueries?.length || 0;
                    return (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session)}
                        style={{
                          padding: '9px 10px',
                          borderRadius: '8px',
                          background: isActive 
                            ? 'rgba(56, 189, 248, 0.18)' 
                            : 'rgba(30, 41, 59, 0.45)',
                          borderLeft: isActive 
                            ? '3px solid #38bdf8' 
                            : '3px solid transparent',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(56, 189, 248, 0.09)';
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(30, 41, 59, 0.45)';
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: isActive ? '700' : '600',
                            color: isActive ? '#38bdf8' : '#f1f5f9',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {session.title || 'Conversation'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>
                              {session.updatedAt ? new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                            {queryCount > 0 && (
                              <span style={{
                                fontSize: '9.5px',
                                color: '#67e8f9',
                                background: 'rgba(6, 182, 212, 0.18)',
                                padding: '0 4px',
                                borderRadius: '4px',
                                flexShrink: 0
                              }}>
                                {queryCount} {queryCount === 1 ? 'query' : 'queries'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons: Info (ℹ️) and Delete (✕) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                          {/* ℹ️ Info Symbol Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInfoModalSession(session);
                            }}
                            title="View all search queries & questions in this chat"
                            style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.4)',
                              color: '#38bdf8',
                              cursor: 'pointer',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.35)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                              e.currentTarget.style.color = '#38bdf8';
                            }}
                          >
                            ℹ️
                          </button>

                          {/* 🗑️ Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            title="Delete chat"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

          {/* ── ℹ️ Info Modal Popover (Chat Details & Searched Queries) ── */}
          {infoModalSession && (
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10020,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '380px',
                maxHeight: '85%',
                background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.45)',
                borderRadius: '16px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {/* Modal Header */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(15, 23, 42, 0.8)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px' }}>ℹ️</span>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#f8fafc' }}>
                      Chat Details & Search History
                    </span>
                  </div>
                  <button
                    onClick={() => setInfoModalSession(null)}
                    title="Close details"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div style={{
                  padding: '14px 16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8', fontWeight: '800' }}>
                      Topic Title
                    </span>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                      {infoModalSession.title}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                    <div>
                      <span style={{ color: '#cbd5e1' }}>Messages:</span> {infoModalSession.messages?.length || 0}
                    </div>
                    <div>
                      <span style={{ color: '#cbd5e1' }}>Updated:</span> {infoModalSession.updatedAt ? new Date(infoModalSession.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently'}
                    </div>
                  </div>

                  {/* User Searched Questions */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>🔍</span>
                        <span>Questions Asked in this Chat ({infoModalSession.searchedQueries?.length || 0})</span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {!infoModalSession.searchedQueries || infoModalSession.searchedQueries.length === 0 ? (
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                          No search questions recorded in this chat yet.
                        </div>
                      ) : (
                        infoModalSession.searchedQueries.map((query, qIdx) => (
                          <div
                            key={qIdx}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: 'rgba(30, 41, 59, 0.65)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', gap: '8px', flex: 1, overflow: 'hidden' }}>
                              <span style={{
                                color: '#38bdf8',
                                fontWeight: '800',
                                fontSize: '11px',
                                background: 'rgba(56, 189, 248, 0.15)',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                height: 'fit-content'
                              }}>
                                #{qIdx + 1}
                              </span>
                              <span style={{ fontSize: '12px', color: '#f1f5f9', wordBreak: 'break-word', lineHeight: '1.4' }}>
                                {query}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setInputMessage(query);
                                setInfoModalSession(null);
                                setIsSidebarOpen(false);
                                if (activeSessionId !== infoModalSession.id) {
                                  handleSelectSession(infoModalSession);
                                }
                                if (textareaRef.current) textareaRef.current.focus();
                              }}
                              title="Ask this question again"
                              style={{
                                background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: '700',
                                padding: '3px 7px',
                                cursor: 'pointer',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <span>Use</span>
                              <span>↗</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 auto', overflow: 'hidden', pointerEvents: 'none' }}>
              <CalmAiAvatar size={isCompact ? 26 : 30} />
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{
                    fontSize: isCompact ? '12.5px' : '13.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                  }}>
                    {isCompact ? 'AlgoFlow AI' : 'AlgoFlow AI Companion'}
                  </strong>
                  {!isCompact && (
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      padding: '1.5px 5px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.35) 100%)',
                      border: '1px solid rgba(251, 191, 36, 0.7)',
                      color: '#fef08a',
                      boxShadow: '0 1px 4px rgba(245, 158, 11, 0.3)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      whiteSpace: 'nowrap'
                    }}>
                      Beta
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '10px', opacity: 0.95, display: 'flex', alignItems: 'center', gap: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: liveScreen?.lastErrorOrIssue ? '#ef4444' : '#4ade80', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {isCompact 
                      ? (liveScreen?.activeAlgo && liveScreen.activeAlgo !== 'None' ? `👁️ ${liveScreen.activeAlgo}` : (liveScreen?.screenTitle ? `👁️ ${liveScreen.screenTitle}` : '👁️ Live')) 
                      : (liveScreen?.screenTitle 
                          ? `👁️ Screen: ${liveScreen.screenTitle}${liveScreen.activeAlgo && liveScreen.activeAlgo !== 'None' ? ` (${liveScreen.activeAlgo})` : ''}` 
                          : '👁️ Live Screen Telemetry Active')}
                  </span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isCompact ? '4px' : '5px', flexShrink: 0 }}>
              {/* Quick Size Presets Segmented Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.28)',
                padding: '2px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                marginRight: '2px'
              }}>
                <button
                  onClick={() => {
                    setIsMaximized(false);
                    const newW = Math.min(500, typeof window !== 'undefined' ? window.innerWidth - 16 : 500);
                    const newH = Math.min(640, typeof window !== 'undefined' ? window.innerHeight - 30 : 640);
                    const newDims = { width: newW, height: newH };
                    setWindowDimensions(newDims);
                    try { localStorage.setItem('algoflow_chat_dimensions', JSON.stringify(newDims)); } catch {}
                  }}
                  title="Compact View (500x640)"
                  style={{
                    background: windowDimensions.width <= 530 && !isMaximized ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
                    border: 'none',
                    color: windowDimensions.width <= 530 && !isMaximized ? '#ffffff' : '#cbd5e1',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 'bold',
                    transition: 'all 0.15s ease'
                  }}
                >
                  S
                </button>
                <button
                  onClick={() => {
                    setIsMaximized(false);
                    const newW = Math.min(620, typeof window !== 'undefined' ? window.innerWidth - 16 : 620);
                    const newH = Math.min(730, typeof window !== 'undefined' ? window.innerHeight - 30 : 730);
                    const newDims = { width: newW, height: newH };
                    setWindowDimensions(newDims);
                    try { localStorage.setItem('algoflow_chat_dimensions', JSON.stringify(newDims)); } catch {}
                  }}
                  title="Balanced View (620x730)"
                  style={{
                    background: windowDimensions.width > 530 && windowDimensions.width <= 680 && !isMaximized ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
                    border: 'none',
                    color: windowDimensions.width > 530 && windowDimensions.width <= 680 && !isMaximized ? '#ffffff' : '#cbd5e1',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 'bold',
                    transition: 'all 0.15s ease'
                  }}
                >
                  M
                </button>
                <button
                  onClick={() => {
                    setIsMaximized(false);
                    const newW = Math.min(780, typeof window !== 'undefined' ? window.innerWidth - 16 : 780);
                    const newH = Math.min(820, typeof window !== 'undefined' ? window.innerHeight - 30 : 820);
                    const newDims = { width: newW, height: newH };
                    setWindowDimensions(newDims);
                    try { localStorage.setItem('algoflow_chat_dimensions', JSON.stringify(newDims)); } catch {}
                  }}
                  title="Wide View (780x820)"
                  style={{
                    background: windowDimensions.width > 680 && !isMaximized ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
                    border: 'none',
                    color: windowDimensions.width > 680 && !isMaximized ? '#ffffff' : '#cbd5e1',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    fontWeight: 'bold',
                    transition: 'all 0.15s ease'
                  }}
                >
                  L
                </button>
              </div>

              {/* Sidebar Past Chats Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(prev => !prev)}
                title={isSidebarOpen ? "Close Past Chats" : "Open Past Chats (Conversations History)"}
                style={{
                  background: isSidebarOpen ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.18)',
                  border: isSidebarOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 'bold',
                  boxShadow: isSidebarOpen ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>💬</span>
                <span>Chats</span>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '0 5px',
                  fontSize: '9.5px',
                  fontWeight: '800'
                }}>
                  {sessions.length}
                </span>
              </button>

              {/* Start New Chat Button */}
              <button
                onClick={handleStartNewChat}
                title="Start a new chat session"
                style={{
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.55) 0%, rgba(99, 102, 241, 0.55) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.6)',
                  color: '#e0f2fe',
                  cursor: 'pointer',
                  padding: isCompact ? '3px 6px' : '3px 7px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: 'bold'
                }}
              >
                <span>➕</span>
                {!isCompact && <span>New</span>}
              </button>

              {/* Opacity Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                title={`Adjust Window Opacity (currently ${Math.round(chatOpacity * 100)}%)`}
                style={{
                  background: showSettings ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: isCompact ? '3px 6px' : '3px 7px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: 'bold'
                }}
              >
                <span>💧</span>
                {!isCompact && <span>{Math.round(chatOpacity * 100)}%</span>}
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
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Settings Drawer (Glass Opacity & AI Engine Mode) */}
          {showSettings && (
            <div style={{
              background: `rgba(9, 13, 22, ${Math.max(chatOpacity * 0.95, 0.85)})`,
              padding: '12px 16px',
              borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '12px',
              backdropFilter: 'blur(12px)'
            }}>
              {/* Opacity Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    💧 Window Glass Opacity:
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
            </div>
          )}

          {/* ── Fetching Answer Status Bar (Shown when AI is querying / reasoning) ── */}
          {isLoading && (
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '9px 18px',
              background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.94) 50%, rgba(15, 23, 42, 0.96) 100%)',
              borderBottom: '1.5px solid rgba(56, 189, 248, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '12px',
              color: '#38bdf8',
              fontWeight: '700',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.2)',
              letterSpacing: '0.4px'
            }}>
              {/* Animated scanning glow bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2.5px',
                background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #38bdf8)',
                backgroundSize: '200% 100%',
                animation: 'algoflowShimmer 2s linear infinite'
              }} />
              <span style={{ fontSize: '13px', animation: 'spin 1.2s linear infinite' }}>⚡</span>
              <span>Thinking & Generating Response...</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 0.9s infinite alternate' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#818cf8', animation: 'pulse 0.9s infinite alternate', animationDelay: '0.2s' }} />
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c084fc', animation: 'pulse 0.9s infinite alternate', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {/* Chat Messages List */}
          <div 
            ref={chatContainerRef}
            onScroll={handleChatScroll}
            style={{
              flex: '1 1 0%',
              minHeight: 0,
              overflowY: 'auto',
              padding: isCompact ? '10px 10px 16px 10px' : '16px 18px 24px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: isCompact ? '10px' : '14px',
              position: 'relative'
            }}
          >
            {(!chatMessages || chatMessages.length === 0 || (!chatMessages.some(m => m.role === 'user') && chatMessages.length <= 1)) ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: isCompact ? '12px 6px 10px 6px' : '24px 14px 18px 14px',
                margin: 'auto 0',
                gap: isCompact ? '10px' : '16px'
              }}>
                {/* Glowing Zen Avatar Ambient Hub */}
                <div style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px'
                }}>
                  <div style={{
                    position: 'absolute',
                    width: isCompact ? '56px' : '76px',
                    height: isCompact ? '56px' : '76px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(99, 102, 241, 0.2) 65%, transparent 100%)',
                    filter: 'blur(12px)',
                    animation: 'pulse 2.8s ease-in-out infinite'
                  }} />
                  <CalmAiAvatar size={isCompact ? 40 : 50} />
                </div>

                <div>
                  <h3 style={{
                    fontSize: isCompact ? '16px' : '18px',
                    fontWeight: '800',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.3px',
                    background: 'linear-gradient(135deg, #ffffff 40%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}>
                    AlgoFlow AI Mentor Studio
                  </h3>
                  <p style={{
                    fontSize: isCompact ? '12px' : '13px',
                    color: '#94a3b8',
                    margin: 0,
                    maxWidth: '440px',
                    lineHeight: '1.5'
                  }}>
                    Your live interactive companion for algorithmic reasoning, code optimizations, real-time screen diagnostics, and career roadmaps.
                  </p>
                </div>

                {/* Live Screen Telemetry Active Pill */}
                {liveScreen?.screenTitle && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    fontSize: isCompact ? '11px' : '11.5px',
                    color: '#38bdf8',
                    fontWeight: '600'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                    <span>Connected to Screen: <strong>{liveScreen.screenTitle}</strong>{liveScreen.activeAlgo && liveScreen.activeAlgo !== 'None' ? ` (${liveScreen.activeAlgo})` : ''}</span>
                  </div>
                )}

                {/* 4 Interactive Starter Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: isCompact ? '6px' : '10px',
                  width: '100%',
                  maxWidth: '520px',
                  marginTop: '4px'
                }}>
                  {[
                    {
                      icon: '👁️',
                      title: 'Explain My Screen',
                      desc: isCompact ? 'Analyze algorithm & steps' : 'Analyze active algorithm, steps & operations',
                      prompt: "Can you analyze what is currently happening on my screen, what algorithm is active, what step I am on, and explain the current visualization or status?"
                    },
                    {
                      icon: '🌲',
                      title: 'Tree & Graph Logic',
                      desc: isCompact ? 'Rotations, BFS & Dijkstra' : 'AVL rotations, Dijkstra, BFS vs DFS & MST',
                      prompt: 'Explain AVL Tree rotations and balancing step-by-step with simple intuitive examples.'
                    },
                    {
                      icon: '⚡',
                      title: 'Big-O & Complexity',
                      desc: isCompact ? 'Time & space bounds' : 'Time and space bounds (Best vs Worst case)',
                      prompt: 'Explain Big-O time and space complexity with real-world examples and asymptotic notation.'
                    },
                    {
                      icon: '🎓',
                      title: 'Branch Roadmaps',
                      desc: isCompact ? 'B.Tech milestone paths' : 'B.Tech milestone paths & language careers',
                      prompt: 'Guide me through engineering branch roadmaps, language career options, and beginner CS foundations!'
                    }
                  ].map((card, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleSendMessage(card.prompt)}
                      style={{
                        background: 'rgba(30, 41, 59, 0.55)',
                        border: '1px solid rgba(56, 189, 248, 0.28)',
                        borderRadius: '10px',
                        padding: isCompact ? '8px 10px' : '12px 14px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        transition: 'all 0.18s ease',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.14)';
                        e.currentTarget.style.borderColor = '#38bdf8';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(56, 189, 248, 0.25)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.55)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.28)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.25)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: isCompact ? '13px' : '15px' }}>{card.icon}</span>
                        <span style={{ fontSize: isCompact ? '11.5px' : '12.5px', fontWeight: '700', color: '#f1f5f9' }}>{card.title}</span>
                      </div>
                      <span style={{ fontSize: isCompact ? '10px' : '11px', color: '#94a3b8', lineHeight: '1.3' }}>{card.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              (chatMessages || []).map((msg, i) => {
                const isUser = msg.role === 'user';
                if (!isUser && msg.isStreaming && (!msg.text || msg.text.length === 0)) {
                  return null;
                }
                return (
                  <div
                    key={i}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: isCompact ? '96%' : (isMaximized ? '82%' : '90%'),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ display: 'flex', gap: isCompact ? '6px' : '10px', alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row', width: '100%' }}>
                      {!isUser && <CalmAiAvatar size={isCompact ? 22 : 26} />}
                      <div style={{
                        padding: isCompact ? '10px 12px' : '14px 18px',
                        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: isUser 
                          ? `linear-gradient(135deg, rgba(2, 132, 199, ${Math.max(chatOpacity * 0.92, 0.8)}), rgba(99, 102, 241, ${Math.max(chatOpacity * 0.92, 0.8)}))` 
                          : `rgba(11, 18, 33, ${Math.max(bubbleAlpha, 0.92)})`,
                        color: '#f8fafc',
                        fontSize: isCompact ? '13px' : '14px',
                        lineHeight: isCompact ? '1.55' : '1.7',
                        border: isUser ? '1px solid rgba(56, 189, 248, 0.55)' : `1.5px solid rgba(56, 189, 248, ${Math.max(chatOpacity * 0.45, 0.3)})`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        overflowWrap: 'break-word',
                        wordBreak: 'normal',
                        backdropFilter: 'blur(12px)',
                        flex: 1,
                        minWidth: 0
                      }}>
                        {msg.image && (
                          <div style={{ marginBottom: msg.text ? '8px' : '0' }}>
                            <img 
                              src={msg.image} 
                              alt="Uploaded problem photo" 
                              onClick={() => setPreviewModalImage(msg.image)}
                              title="Click photo to view full size"
                              style={{
                                maxWidth: '100%',
                                maxHeight: isCompact ? '180px' : '260px',
                                borderRadius: '8px',
                                objectFit: 'contain',
                                border: '1px solid rgba(56, 189, 248, 0.45)',
                                background: 'rgba(0, 0, 0, 0.4)',
                                cursor: 'zoom-in',
                                display: 'block'
                              }} 
                            />
                            <div style={{ fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <span>🔍</span>
                              <span>Click photo to enlarge</span>
                            </div>
                          </div>
                        )}
                        <ChatMessageRenderer 
                          text={msg.text} 
                          isUser={isUser} 
                          onSelectPrompt={isGenerating ? null : handleSendMessage} 
                          isStreaming={!isUser && msg.isStreaming} 
                        />
                      </div>
                    </div>

                    {!isUser && !msg.isStreaming && (msg.offlineNotice || (msg.sources && msg.sources.some(s => s.toLowerCase().includes('offline')))) && (
                      <div style={{
                        marginTop: '6px',
                        marginLeft: '36px',
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
                        <span>Offline Mode • Live real-time answers active on internet reconnect.</span>
                      </div>
                    )}

                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', marginLeft: isUser ? '0' : '36px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })
            )}

            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CalmAiAvatar size={26} />
                <div style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)',
                  padding: '14px 20px',
                  borderRadius: '16px 16px 16px 4px',
                  color: '#e2e8f0',
                  fontSize: '12.5px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 'bold', fontSize: '12px' }}>
                    <span style={{ animation: 'spin 1.2s linear infinite' }}>⚡</span>
                    <span>Analyzing & Synthesizing Answer...</span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.25)', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', animation: 'pulse 1.2s ease-in-out infinite' }} />
                    </div>
                    <div style={{ width: '35px', height: '6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.25)', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #818cf8, #c084fc)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.25s' }} />
                    </div>
                    <div style={{ width: '25px', height: '6px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.25)', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #c084fc, #38bdf8)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: '0.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showScrollBottomBtn && (
              <button
                type="button"
                onClick={() => scrollToBottom('smooth')}
                title="Scroll down to latest response"
                style={{
                  position: 'sticky',
                  bottom: '10px',
                  alignSelf: 'center',
                  zIndex: 35,
                  padding: '7px 16px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.96), rgba(99, 102, 241, 0.96))',
                  border: '1.5px solid rgba(255, 255, 255, 0.75)',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.55), 0 0 16px rgba(56, 189, 248, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                <span style={{ fontSize: '13px' }}>↓</span>
                <span>Jump to latest</span>
              </button>
            )}

            <div style={{ height: '14px', flexShrink: 0 }} />
            <div ref={messagesEndRef} />
          </div>

          {/* Active Screen Issue Detection Alert Banner */}
          {liveScreen?.lastErrorOrIssue && (
            <div style={{
              margin: '6px 12px 4px 12px',
              padding: '8px 12px',
              background: 'rgba(239, 68, 68, 0.16)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>⚠️</span>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Screen Issue Detected
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#fecaca', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={liveScreen.lastErrorOrIssue}>
                    {liveScreen.lastErrorOrIssue}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => handleSendMessage(`I encountered this problem on my screen: "${liveScreen.lastErrorOrIssue}". Can you explain why it happened and how I can solve or fix it?`)}
                  style={{
                    padding: '4px 10px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  Fix with AI ✨
                </button>
                <button
                  onClick={clearScreenError}
                  title="Dismiss alert"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '15px',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

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

          {/* ── Edge-Cutting Multi-Line Input Box ── */}
          <div style={{
            padding: isCompact ? '8px 10px 10px 10px' : '10px 14px 12px 14px',
            background: `rgba(9, 14, 26, ${Math.max(chatOpacity * 0.95, 0.45)})`,
            borderTop: `1px solid rgba(255, 255, 255, ${Math.max(chatOpacity * 0.18, 0.08)})`,
            backdropFilter: 'blur(16px)',
            position: 'relative'
          }}>
            <div style={{
              borderRadius: isCompact ? '12px' : '16px',
              background: `rgba(18, 26, 47, ${Math.max(chatOpacity * 0.9, 0.65)})`,
              border: isInputFocused 
                ? '1.5px solid #38bdf8' 
                : '1.5px solid rgba(56, 189, 248, 0.3)',
              boxShadow: isInputFocused 
                ? '0 0 16px rgba(56, 189, 248, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.06)' 
                : '0 3px 12px rgba(0, 0, 0, 0.35)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              padding: isCompact ? '6px 10px' : '8px 12px',
              gap: '4px'
            }}>
              {/* Attached Problem Image Preview Card */}
              {attachedImage && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 8px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.14)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  marginBottom: '4px',
                  animation: 'fadeIn 0.15s ease'
                }}>
                  <img 
                    src={attachedImage.dataUrl} 
                    alt="Thumbnail" 
                    onClick={() => setPreviewModalImage(attachedImage.dataUrl)}
                    title="Click to zoom problem image"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      cursor: 'zoom-in',
                      border: '1px solid rgba(56, 189, 248, 0.5)'
                    }} 
                  />
                  <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#f8fafc', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📷 {attachedImage.name || 'Problem Photo'}
                    </span>
                    <span style={{ fontSize: '9.5px', color: '#38bdf8' }}>
                      {attachedImage.size ? `${(attachedImage.size / 1024).toFixed(0)} KB • Ready to solve sums` : 'Ready to solve sums'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    title="Remove attached photo"
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: '5px',
                      color: '#f87171',
                      cursor: 'pointer',
                      fontSize: '11px',
                      padding: '2px 6px',
                      fontWeight: 'bold',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}

              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={attachedImage ? "Add an optional prompt or press Enter / Ask to solve this sum..." : "Ask AlgoFlow AI or upload a problem pic... (Shift+Enter for next line)"}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onPaste={handleInputPaste}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                style={{
                  width: '100%',
                  minHeight: isCompact ? '34px' : '38px',
                  maxHeight: '140px',
                  resize: 'none',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: '#f8fafc',
                  fontSize: isCompact ? '13px' : '13.5px',
                  lineHeight: '1.5',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  padding: '2px 0',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflowY: inputMessage.split('\n').length > 5 ? 'auto' : 'hidden'
                }}
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Photo / Problem Image Upload Button */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileSelect} 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload a photo of a math sum, algorithm problem, or code question (or paste with Ctrl+V)"
                    style={{
                      background: attachedImage ? 'rgba(56, 189, 248, 0.28)' : 'rgba(255, 255, 255, 0.08)',
                      border: attachedImage ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '7px',
                      color: attachedImage ? '#38bdf8' : '#e2e8f0',
                      cursor: 'pointer',
                      padding: '3px 8px',
                      fontSize: '11px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '700',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!attachedImage) e.currentTarget.style.background = 'rgba(56, 189, 248, 0.16)';
                    }}
                    onMouseLeave={e => {
                      if (!attachedImage) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <span>📷</span>
                    <span>{attachedImage ? 'Pic Attached' : (isCompact ? 'Pic' : 'Add Pic')}</span>
                  </button>

                  <span style={{
                    fontSize: '10px',
                    color: '#64748b',
                    letterSpacing: '0.2px',
                    display: isCompact ? 'none' : 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <kbd style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      padding: '1px 4px',
                      fontSize: '9.5px',
                      color: '#94a3b8'
                    }}>↵</kbd> send
                    <span style={{ margin: '0 2px' }}>•</span>
                    <kbd style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      padding: '1px 4px',
                      fontSize: '9.5px',
                      color: '#94a3b8'
                    }}>Ctrl+V</kbd> paste pic
                  </span>
                </div>

                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      color: '#ffffff',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 10px rgba(239, 68, 68, 0.45)',
                      transition: 'all 0.2s ease'
                    }}
                    title="Stop Generating"
                  >
                    <span style={{ fontSize: '10px' }}>⏹</span>
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || (!inputMessage.trim() && !attachedImage)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      background: (inputMessage.trim() || attachedImage)
                        ? 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)' 
                        : 'rgba(51, 65, 85, 0.5)',
                      color: (inputMessage.trim() || attachedImage) ? '#ffffff' : '#94a3b8',
                      fontWeight: '600',
                      border: 'none',
                      cursor: (inputMessage.trim() || attachedImage) ? 'pointer' : 'default',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                      boxShadow: (inputMessage.trim() || attachedImage) ? '0 2px 10px rgba(56, 189, 248, 0.35)' : 'none'
                    }}
                    onMouseEnter={e => {
                      if (inputMessage.trim() || attachedImage) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(56, 189, 248, 0.5)';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      if (inputMessage.trim() || attachedImage) {
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(56, 189, 248, 0.35)';
                      }
                    }}
                  >
                    <span>{attachedImage && !inputMessage.trim() ? 'Solve' : 'Ask'}</span>
                    <span style={{ fontSize: '11px', transform: 'rotate(-45deg)', display: 'inline-block' }}>➤</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Problem Photo Lightbox / Zoom Modal ── */}
      {previewModalImage && (
        <div 
          onClick={() => setPreviewModalImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100025,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.18s ease'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '92vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <img 
              src={previewModalImage} 
              alt="Enlarged Problem View" 
              style={{
                maxWidth: '100%',
                maxHeight: '86vh',
                borderRadius: '12px',
                boxShadow: '0 25px 70px rgba(0,0,0,0.85), 0 0 35px rgba(56,189,248,0.35)',
                border: '1.5px solid rgba(56, 189, 248, 0.55)',
                display: 'block'
              }} 
            />
            <button
              onClick={() => setPreviewModalImage(null)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                background: '#ef4444',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ffffff',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
              }}
              title="Close image preview"
            >
              ✕
            </button>
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
