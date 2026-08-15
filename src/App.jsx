/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import './index.css';
import { getFullCodeTemplate } from './codeTemplates.js';
import SortSearchVisualizer from './SortSearchVisualizer.jsx';
import GeneralDSVisualizer from './GeneralDSVisualizer.jsx';
import GraphVisualizer from './GraphVisualizer.jsx';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import DPGreedyVisualizer from './DPGreedyVisualizer.jsx';
import PatternsVisualizer from './PatternsVisualizer.jsx';
import DSANotesVisualizer from './DSANotesVisualizer.jsx';
import Beginner101Visualizer from './Beginner101Visualizer.jsx';
import FloatingAiBot from './FloatingAiBot.jsx';
import AiRagMentorStudio from './AiRagMentorStudio.jsx';

// Allman brace formatter for code display
const toAllman = code => {
  if (!code) return '';
  const lines = code.split('\n');
  const out = [];
  for (const line of lines) {
    const t = line.trimEnd();
    if (t.endsWith('{') && t.trim() !== '{' && !t.trim().startsWith('//') && !t.trim().startsWith('*')) {
      const indent = line.match(/^(\s*)/)[1];
      const body = t.slice(0, -1).trimEnd();
      if (body.trim().length > 0) { out.push(body); out.push(indent + '{'); continue; }
    }
    out.push(line);
  }
  return out.join('\n');
};
import TopicInfoModal from './TopicInfoModal.jsx';

// ─── Safe LocalStorage Helper ────────────────────────────────────────────────
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, val);
      }
    } catch {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch {}
  }
};

// ─── Tree Node ───────────────────────────────────────────────────────────────
class TreeNode {
  static idCounter = 0;
  constructor(value) {
    this.id = ++TreeNode.idCounter;
    this.value = value;
    this.keys   = value !== undefined ? [value] : [];
    this.children = [];
    this.left  = null;
    this.right = null;
    this.x = 0; this.y = 0;
    this.height = 1;
    this.leaf   = true;
    this.range  = '';
    this.sum    = 0;
    this._color = null;
    this.bitRep = null;
    this.index  = null;
  }
}

const cloneTree = (node) => {
  if (!node) return null;
  const n = new TreeNode(node.value);
  n.id    = node.id;
  n.left  = cloneTree(node.left);
  n.right = cloneTree(node.right);
  n.x = node.x; n.y = node.y;
  n.height   = node.height;
  n.keys     = node.keys     ? [...node.keys]               : [];
  n.children = node.children ? node.children.map(cloneTree) : [];
  n.leaf   = node.leaf;
  n.range  = node.range;
  n.sum    = node.sum;
  n._color = node._color;
  n.bitRep = node.bitRep;
  n.index  = node.index;
  return n;
};

const highlightLogText = (text) => {
  if (!text) return '';
  const str = String(text);
  const lower = str.toLowerCase();
  
  if (
    lower.includes('root full') ||
    lower.includes('split') ||
    lower.includes('imbalance') ||
    lower.includes('rotate') ||
    lower.includes('rotation') ||
    lower.includes('delete') ||
    lower.includes('deleted') ||
    lower.includes('remove') ||
    lower.includes('removed') ||
    lower.includes('pop') ||
    lower.includes('popped') ||
    lower.includes('mismatch') ||
    lower.includes('⚡')
  ) {
    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = str.split(regex);
    return (
      <span style={{ color: '#f87171', fontWeight: 'bold' }}>
        {parts.map((p, i) => 
          regex.test(p) ? <span key={i} style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.3)' }}>{p}</span> : p
        )}
      </span>
    );
  }
  
  if (
    lower.includes('inserted') ||
    lower.includes('insert(') ||
    lower.includes('insert ') ||
    lower.includes('create node') ||
    lower.includes('success') ||
    lower.includes('match') ||
    lower.includes('completed') ||
    lower.includes('done') ||
    lower.includes('✦') ||
    lower.includes('✓') ||
    lower.includes('✅')
  ) {
    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = str.split(regex);
    return (
      <span style={{ color: '#34d399', fontWeight: 'bold' }}>
        {parts.map((p, i) => 
          regex.test(p) ? <span key={i} style={{ color: '#fbbf24' }}>{p}</span> : p
        )}
      </span>
    );
  }

  if (
    lower.includes('going to child') ||
    lower.includes('compare') ||
    lower.includes('comparing') ||
    lower.includes('probe') ||
    lower.includes('probing') ||
    lower.includes('relaxation') ||
    lower.includes('check') ||
    lower.includes('going to') ||
    lower.includes('➜') ||
    lower.includes('↳')
  ) {
    const regex = /(\b\d+(?:\.\d+)?\b)/g;
    const parts = str.split(regex);
    return (
      <span style={{ color: '#fb923c', fontWeight: 600 }}>
        {parts.map((p, i) => 
          regex.test(p) ? <span key={i} style={{ color: '#fbbf24', fontWeight: 'bold' }}>{p}</span> : p
        )}
      </span>
    );
  }
  
  const regex = /(\b\d+(?:\.\d+)?\b)/g;
  const parts = str.split(regex);
  return parts.map((p, i) => 
    /^\d+(?:\.\d+)?$/.test(p) ? <strong key={i} style={{ color: '#fbbf24' }}>{p}</strong> : p
  );
};

class Frame {
  constructor(root, logs, highlight, rotation) {
    this.root      = root ? cloneTree(root) : null;
    this.logs      = [...logs];
    this.highlight = highlight;
    this.rotation  = rotation;
  }
}

// ─── B-Tree / B+ Tree Engine ─────────────────────────────────────────────────
class BTreeEngine {
  constructor(m, isBPlus = false, splitStrategy = 'MEDIAN') {
    this.m = m;
    this.isBPlus = isBPlus;
    this.splitStrategy = splitStrategy;
    this.root = new TreeNode();
    this.root.leaf = true;
    this.root.keys = [];
    this.root.value = undefined;
  }

  insert(k, logs, recordFrame) {
    this._insertRecursive(this.root, null, 0, k, logs, recordFrame);
    if (this.root.keys.length === this.m) {
      logs.push({ text: `Root full (max ${this.m-1} keys). Splitting root.`, type: 'rotation' });
      const s = new TreeNode();
      s.leaf = false; s.keys = []; s.value = undefined;
      s.children.push(this.root);
      this.splitChild(s, 0, this.root, logs, recordFrame);
      this.root = s;
      recordFrame(null, 'New Root After Split');
    }
  }

  _insertRecursive(node, parent, idx, k, logs, recordFrame) {
    if (node.leaf) {
      node.keys.push(k);
      node.keys.sort((a, b) => a - b);
      logs.push({ text: `Inserted ${k} into leaf.`, type: 'normal' });
      recordFrame(k, null);
    } else {
      let i = 0;
      while (i < node.keys.length && k > node.keys[i]) i++;
      logs.push({ text: `Going to child[${i}]`, type: 'normal' });
      recordFrame(node.keys[i - 1] || k, null);
      this._insertRecursive(node.children[i], node, i, k, logs, recordFrame);
      if (node.children[i].keys.length === this.m) {
        this.splitChild(node, i, node.children[i], logs, recordFrame);
      }
    }
  }

  splitChild(parent, i, child, logs, recordFrame) {
    let mid = Math.floor(this.m / 2);
    if (this.splitStrategy === 'LEFT_BIASED') {
      mid = Math.floor(this.m / 2) - 1;
    } else if (this.splitStrategy === 'RIGHT_BIASED') {
      mid = Math.floor(this.m / 2) + (this.m % 2 === 0 ? 0 : 1);
    }
    mid = Math.max(1, Math.min(this.m - 2, mid));

    const z = new TreeNode();
    z.leaf = child.leaf; z.keys = []; z.value = undefined;
    if (this.isBPlus && child.leaf) {
      z.keys = child.keys.splice(mid);
      const upKey = z.keys[0];
      parent.keys.splice(i, 0, upKey);
      parent.children.splice(i + 1, 0, z);
      logs.push({ text: `B+ leaf split — copy key ${upKey} up`, type: 'normal' });
    } else {
      z.keys = child.keys.splice(mid + 1);
      if (!child.leaf) z.children = child.children.splice(mid + 1);
      const upKey = child.keys.pop();
      parent.keys.splice(i, 0, upKey);
      parent.children.splice(i + 1, 0, z);
      logs.push({ text: `Split — pushed key ${upKey} up`, type: 'normal' });
    }
    recordFrame(null, 'Node Split');
  }
}

// ─── Red-Black Tree Engine ────────────────────────────────────────────────────
class RBEngine {
  constructor() { this.nodes = []; }
  insert(val, logs, recordFrame) {
    this.nodes.push(val);
    const sorted = [...this.nodes].sort((a,b) => a-b);
    logs.push({ text: `RB-Tree insert ${val} → rebalancing...`, type: 'normal' });
    const root = this._buildBalanced(sorted, 1);
    recordFrame && recordFrame(val, null);
    return root;
  }
  _buildBalanced(arr, depth) {
    if (!arr.length) return null;
    const mid = Math.floor(arr.length / 2);
    const node = new TreeNode(arr[mid]);
    node._color = depth % 2 === 0 ? 'RED' : 'BLACK';
    node.left  = this._buildBalanced(arr.slice(0, mid), depth + 1);
    node.right = this._buildBalanced(arr.slice(mid + 1), depth + 1);
    return node;
  }
}

// ─── AVL / BST helpers ────────────────────────────────────────────────────────
const getHeight   = n => n ? n.height : 0;
const updateHeight = n => { if (n) n.height = Math.max(getHeight(n.left), getHeight(n.right)) + 1; };
const getBalance  = n => n ? getHeight(n.left) - getHeight(n.right) : 0;
const rightRotate = y => { const x=y.left,T2=x.right; x.right=y; y.left=T2; updateHeight(y); updateHeight(x); return x; };
const leftRotate  = x => { const y=x.right,T2=y.left; y.left=x; x.right=T2; updateHeight(x); updateHeight(y); return y; };

// ─── B-Tree / B+ Tree Bounds Calculator ───────────────────────────────────────
const getBTreeBounds = (m, isBPlus, splitStrategy) => {
  const standardMinKeys = Math.ceil(m / 2) - 1;
  const standardMaxKeys = m - 1;
  const standardMinChildren = Math.ceil(m / 2);
  const standardMaxChildren = m;

  let mid = Math.floor(m / 2);
  if (splitStrategy === 'LEFT_BIASED') {
    mid = Math.floor(m / 2) - 1;
  } else if (splitStrategy === 'RIGHT_BIASED') {
    mid = Math.floor(m / 2) + (m % 2 === 0 ? 0 : 1);
  }
  mid = Math.max(1, Math.min(m - 2, mid));

  const leftSplitKeys = mid;
  const rightSplitKeys = m - 1 - mid;
  const splitMinKeys = Math.min(leftSplitKeys, rightSplitKeys);
  const splitMaxKeys = Math.max(leftSplitKeys, rightSplitKeys);

  const leftLeafSplitKeys = mid;
  const rightLeafSplitKeys = m - mid;

  return {
    standardMinKeys,
    standardMaxKeys,
    standardMinChildren,
    standardMaxChildren,
    leftSplitKeys,
    rightSplitKeys,
    splitMinKeys,
    splitMaxKeys,
    leftLeafSplitKeys,
    rightLeafSplitKeys
  };
};

// ─── Segment Tree builder ─────────────────────────────────────────────────────
const buildSegmentTree = (arr) => {
  if (!arr || !arr.length) return null;
  const build = (l, r) => {
    const n = new TreeNode();
    n.range = `[${l}-${r}]`;
    if (l === r) { n.value = arr[l]; n.sum = arr[l]; return n; }
    const mid = Math.floor((l + r) / 2);
    n.left = build(l, mid); n.right = build(mid+1, r);
    n.sum = n.left.sum + n.right.sum; n.value = n.sum;
    return n;
  };
  return build(0, arr.length - 1);
};

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  'Neon Cyberpunk': {
    '--bg-primary': '#050510',
    '--bg-secondary': '#0d0d22',
    '--accent-primary': '#00e5ff',
    '--accent-secondary': '#d946ef',
    '--text-primary': '#f1f5f9',
    '--text-secondary': '#94a3b8',
    '--glass-bg': 'rgba(13, 15, 34, 0.65)',
    '--glass-border': 'rgba(0, 229, 255, 0.22)',
    '--node-fill-1': '#00b4d8',
    '--node-fill-2': '#9d4edd',
    '--edge-color': 'rgba(0, 229, 255, 0.65)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(0, 229, 255, 0.14), transparent 45%), radial-gradient(circle at 85% 85%, rgba(217, 70, 239, 0.14), transparent 45%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08), transparent 60%)',
    type: 'dark'
  },
  'Cosmic Dark': {
    '--bg-primary': '#0b0f19',
    '--bg-secondary': '#161e31',
    '--accent-primary': '#3b82f6',
    '--accent-secondary': '#f43f5e',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#94a3b8',
    '--glass-bg': 'rgba(22, 30, 49, 0.65)',
    '--glass-border': 'rgba(59, 130, 246, 0.2)',
    '--node-fill-1': '#3b82f6',
    '--node-fill-2': '#8b5cf6',
    '--edge-color': 'rgba(99, 140, 250, 0.6)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.15), transparent 40%), radial-gradient(circle at 90% 80%, rgba(244,63,94,0.14), transparent 40%)',
    type: 'dark'
  },
  'Forest Night': {
    '--bg-primary': '#06140b',
    '--bg-secondary': '#0e2415',
    '--accent-primary': '#10b981',
    '--accent-secondary': '#84cc16',
    '--text-primary': '#f0fdf4',
    '--text-secondary': '#86efac',
    '--glass-bg': 'rgba(14, 36, 21, 0.65)',
    '--glass-border': 'rgba(16, 185, 129, 0.22)',
    '--node-fill-1': '#10b981',
    '--node-fill-2': '#15803d',
    '--edge-color': 'rgba(16, 185, 129, 0.6)',
    bodyBg: 'radial-gradient(circle at 20% 30%, rgba(16,185,129,0.14), transparent 40%), radial-gradient(circle at 80% 70%, rgba(132,204,22,0.12), transparent 40%)',
    type: 'dark'
  },
  'Sunset Blaze': {
    '--bg-primary': '#160802',
    '--bg-secondary': '#281105',
    '--accent-primary': '#f97316',
    '--accent-secondary': '#ef4444',
    '--text-primary': '#fff7ed',
    '--text-secondary': '#fdba74',
    '--glass-bg': 'rgba(40, 17, 5, 0.65)',
    '--glass-border': 'rgba(249, 115, 22, 0.22)',
    '--node-fill-1': '#ea580c',
    '--node-fill-2': '#dc2626',
    '--edge-color': 'rgba(249, 115, 22, 0.6)',
    bodyBg: 'radial-gradient(circle at 15% 25%, rgba(249,115,22,0.16), transparent 40%), radial-gradient(circle at 85% 75%, rgba(239,68,68,0.14), transparent 40%)',
    type: 'dark'
  },
  'Midnight Lavender': {
    '--bg-primary': '#0f081d',
    '--bg-secondary': '#1a0e30',
    '--accent-primary': '#a855f7',
    '--accent-secondary': '#ec4899',
    '--text-primary': '#f5f3ff',
    '--text-secondary': '#c084fc',
    '--glass-bg': 'rgba(26, 14, 48, 0.65)',
    '--glass-border': 'rgba(168, 85, 247, 0.22)',
    '--node-fill-1': '#7c3aed',
    '--node-fill-2': '#c084fc',
    '--edge-color': 'rgba(168, 85, 247, 0.6)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(168,85,247,0.16), transparent 40%), radial-gradient(circle at 90% 80%, rgba(236,72,153,0.14), transparent 40%)',
    type: 'dark'
  },
  'Deep Ocean': {
    '--bg-primary': '#02101e',
    '--bg-secondary': '#062037',
    '--accent-primary': '#06b6d4',
    '--accent-secondary': '#3b82f6',
    '--text-primary': '#ecfeff',
    '--text-secondary': '#67e8f9',
    '--glass-bg': 'rgba(6, 32, 55, 0.65)',
    '--glass-border': 'rgba(6, 182, 212, 0.22)',
    '--node-fill-1': '#0891b2',
    '--node-fill-2': '#2563eb',
    '--edge-color': 'rgba(6, 182, 212, 0.6)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(6,182,212,0.16), transparent 45%), radial-gradient(circle at 85% 85%, rgba(59,130,246,0.14), transparent 45%)',
    type: 'dark'
  },
  'Cherry Blossom': {
    '--bg-primary': '#18070e',
    '--bg-secondary': '#2b0f1b',
    '--accent-primary': '#ec4899',
    '--accent-secondary': '#fb7185',
    '--text-primary': '#fdf2f8',
    '--text-secondary': '#f472b6',
    '--glass-bg': 'rgba(43, 15, 27, 0.65)',
    '--glass-border': 'rgba(236, 72, 153, 0.22)',
    '--node-fill-1': '#db2777',
    '--node-fill-2': '#e879f9',
    '--edge-color': 'rgba(236, 72, 153, 0.6)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(236,72,153,0.16), transparent 40%), radial-gradient(circle at 90% 80%, rgba(251,113,133,0.14), transparent 40%)',
    type: 'dark'
  },
  'Arctic Frost': {
    '--bg-primary': '#f8fafc',
    '--bg-secondary': '#ffffff',
    '--accent-primary': '#0284c7',
    '--accent-secondary': '#2563eb',
    '--text-primary': '#0f172a',
    '--text-secondary': '#334155',
    '--glass-bg': 'rgba(255, 255, 255, 0.88)',
    '--glass-border': 'rgba(2, 132, 199, 0.22)',
    '--node-fill-1': '#0284c7',
    '--node-fill-2': '#2563eb',
    '--edge-color': 'rgba(2, 132, 199, 0.75)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(14,165,233,0.12), transparent 45%), radial-gradient(circle at 85% 85%, rgba(37,99,235,0.12), transparent 45%), radial-gradient(circle at 50% 50%, rgba(99,102,241,0.06), transparent 50%)',
    type: 'light'
  },
  'Pure White Canvas': {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--accent-primary': '#4f46e5',
    '--accent-secondary': '#7c3aed',
    '--text-primary': '#0f172a',
    '--text-secondary': '#334155',
    '--glass-bg': 'rgba(255, 255, 255, 0.92)',
    '--glass-border': 'rgba(79, 70, 229, 0.22)',
    '--node-fill-1': '#4f46e5',
    '--node-fill-2': '#7c3aed',
    '--edge-color': 'rgba(79, 70, 229, 0.75)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(99,102,241,0.1), transparent 40%), radial-gradient(circle at 90% 80%, rgba(124,58,237,0.08), transparent 40%)',
    type: 'light'
  },
  'Light Sakura': {
    '--bg-primary': '#fff5f7',
    '--bg-secondary': '#ffffff',
    '--accent-primary': '#db2777',
    '--accent-secondary': '#f43f5e',
    '--text-primary': '#1f2937',
    '--text-secondary': '#4b5563',
    '--glass-bg': 'rgba(255, 255, 255, 0.9)',
    '--glass-border': 'rgba(219, 39, 119, 0.22)',
    '--node-fill-1': '#db2777',
    '--node-fill-2': '#f43f5e',
    '--edge-color': 'rgba(219, 39, 119, 0.75)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(219,39,119,0.12), transparent 45%), radial-gradient(circle at 85% 85%, rgba(244,63,94,0.12), transparent 45%)',
    type: 'light'
  },
  'Sunny Meadow': {
    '--bg-primary': '#fffbeb',
    '--bg-secondary': '#ffffff',
    '--accent-primary': '#d97706',
    '--accent-secondary': '#ca8a04',
    '--text-primary': '#1f2937',
    '--text-secondary': '#4b5563',
    '--glass-bg': 'rgba(255, 255, 255, 0.9)',
    '--glass-border': 'rgba(217, 119, 6, 0.22)',
    '--node-fill-1': '#d97706',
    '--node-fill-2': '#ca8a04',
    '--edge-color': 'rgba(217, 119, 6, 0.75)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(250,204,21,0.14), transparent 45%), radial-gradient(circle at 85% 85%, rgba(217,119,6,0.12), transparent 45%)',
    type: 'light'
  },
  'Minty Fresh': {
    '--bg-primary': '#f0fdf4',
    '--bg-secondary': '#ffffff',
    '--accent-primary': '#059669',
    '--accent-secondary': '#10b981',
    '--text-primary': '#1f2937',
    '--text-secondary': '#374151',
    '--glass-bg': 'rgba(255, 255, 255, 0.9)',
    '--glass-border': 'rgba(5, 150, 105, 0.22)',
    '--node-fill-1': '#059669',
    '--node-fill-2': '#10b981',
    '--glass-border': 'rgba(79, 70, 229, 0.2)',
    '--node-fill-1': '#4f46e5',
    '--node-fill-2': '#6366f1',
    '--edge-color': 'rgba(79, 70, 229, 0.7)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(99,102,241,0.08), transparent 40%), radial-gradient(circle at 90% 80%, rgba(79,70,229,0.06), transparent 40%)',
    type: 'light'
  },
  'Nordic Chalk': {
    '--bg-primary': '#f9fafb',
    '--bg-secondary': '#f3f4f6',
    '--accent-primary': '#0284c7',
    '--accent-secondary': '#f97316',
    '--text-primary': '#111827',
    '--text-secondary': '#4b5563',
    '--glass-bg': 'rgba(249, 250, 251, 0.9)',
    '--glass-border': 'rgba(156, 163, 175, 0.3)',
    '--node-fill-1': '#0284c7',
    '--node-fill-2': '#ea580c',
    '--edge-color': 'rgba(2, 132, 199, 0.7)',
    bodyBg: 'radial-gradient(circle at 20% 20%, rgba(2,132,199,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(249,115,22,0.06), transparent 40%)',
    type: 'light'
  },
  'Warm Paper': {
    '--bg-primary': '#faf8f5',
    '--bg-secondary': '#f2ede4',
    '--accent-primary': '#d97706',
    '--accent-secondary': '#c2410c',
    '--text-primary': '#292524',
    '--text-secondary': '#78350f',
    '--glass-bg': 'rgba(250, 248, 245, 0.92)',
    '--glass-border': 'rgba(217, 119, 6, 0.25)',
    '--node-fill-1': '#d97706',
    '--node-fill-2': '#c2410c',
    '--edge-color': 'rgba(217, 119, 6, 0.7)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(217,119,6,0.08), transparent 40%), radial-gradient(circle at 85% 85%, rgba(194,65,12,0.08), transparent 40%)',
    type: 'light'
  },
  'Lavender Mist': {
    '--bg-primary': '#f7f5ff',
    '--bg-secondary': '#ede9fe',
    '--accent-primary': '#7c3aed',
    '--accent-secondary': '#9333ea',
    '--text-primary': '#1e1b4b',
    '--text-secondary': '#5b21b6',
    '--glass-bg': 'rgba(247, 245, 255, 0.9)',
    '--glass-border': 'rgba(124, 58, 237, 0.25)',
    '--node-fill-1': '#7c3aed',
    '--node-fill-2': '#9333ea',
    '--edge-color': 'rgba(124, 58, 237, 0.7)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(124,58,237,0.1), transparent 40%), radial-gradient(circle at 90% 80%, rgba(147,51,234,0.08), transparent 40%)',
    type: 'light'
  },
  'Breeze Cyan': {
    '--bg-primary': '#f0fdfa',
    '--bg-secondary': '#ccfbf1',
    '--accent-primary': '#0d9488',
    '--accent-secondary': '#0284c7',
    '--text-primary': '#042f2e',
    '--text-secondary': '#115e59',
    '--glass-bg': 'rgba(240, 253, 250, 0.92)',
    '--glass-border': 'rgba(13, 148, 136, 0.25)',
    '--node-fill-1': '#0d9488',
    '--node-fill-2': '#0284c7',
    '--edge-color': 'rgba(13, 148, 136, 0.7)',
    bodyBg: 'radial-gradient(circle at 15% 15%, rgba(13,148,136,0.1), transparent 45%), radial-gradient(circle at 85% 85%, rgba(2,132,199,0.1), transparent 45%)',
    type: 'light'
  },
  'Blush Pearl': {
    '--bg-primary': '#fff8f6',
    '--bg-secondary': '#ffede8',
    '--accent-primary': '#e11d48',
    '--accent-secondary': '#f97316',
    '--text-primary': '#2a0c0e',
    '--text-secondary': '#9f1239',
    '--glass-bg': 'rgba(255, 248, 246, 0.92)',
    '--glass-border': 'rgba(225, 29, 72, 0.25)',
    '--node-fill-1': '#e11d48',
    '--node-fill-2': '#ea580c',
    '--edge-color': 'rgba(225, 29, 72, 0.7)',
    bodyBg: 'radial-gradient(circle at 10% 20%, rgba(225,29,72,0.08), transparent 40%), radial-gradient(circle at 90% 80%, rgba(249,115,22,0.08), transparent 40%)',
    type: 'light'
  },
  'High Contrast Light': {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f1f5f9',
    '--accent-primary': '#2563eb',
    '--accent-secondary': '#d97706',
    '--text-primary': '#000000',
    '--text-secondary': '#1e293b',
    '--glass-bg': 'rgba(255, 255, 255, 0.95)',
    '--glass-border': 'rgba(37, 99, 235, 0.3)',
    '--node-fill-1': '#2563eb',
    '--node-fill-2': '#0284c7',
    '--edge-color': 'rgba(37, 99, 235, 0.8)',
    bodyBg: 'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.05), transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,119,6,0.05), transparent 50%)',
    type: 'light'
  }
};

// ─── Enhanced AI ChatBot (Powered by RAG & Gemini) ─────────────────────────
const ChatBot = (props) => {
  return <FloatingAiBot {...props} />;
};

// ─── PythonTutor-Style Debugger ───────────────────────────────────────────────
const ptLangMap = { 'C': 'c', 'Java': 'java', 'C++': 'c_cpp', 'Python': '3', 'JS': 'js' };
const loadingQuotes = [
  { text: "\"First, solve the problem. Then, write the code.\"", color: "#3b82f6" },
  { text: "\"Code is like humor. When you have to explain it, it’s bad.\"", color: "#ec4899" },
  { text: "\"The best error message is the one that never shows up.\"", color: "#10b981" },
  { text: "\"Simplicity is the soul of efficiency.\"", color: "#8b5cf6" },
  { text: "\"Make it work, make it right, make it fast.\"", color: "#f59e0b" },
  { text: "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\"", color: "#06b6d4" },
  { text: "\"Experience is the name everyone gives to their mistakes.\"", color: "#ef4444" },
  { text: "\"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday’s code.\"", color: "#6366f1" },
  { text: "\"Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.\"", color: "#14b8a6" },
  { text: "\"In order to understand recursion, one must first understand recursion.\"", color: "#d946ef" },
  { text: "\"Programming isn't about what you know; it's about what you can figure out.\"", color: "#f43f5e" },
  { text: "\"Testing can only prove the presence of bugs, not their absence.\"", color: "#84cc16" },
  { text: "\"Talk is cheap. Show me the code.\"", color: "#2563eb" },
  { text: "\"Truth can only be found in one place: the code.\"", color: "#9333ea" },
  { text: "\"Before software can be reusable it first has to be usable.\"", color: "#eab308" }
];

const LineDebugger = ({ initialCode, lang: initialLang, fontSize, wordWrap, onBack, openSettings, isChatOpen, setIsChatOpen, chatMessages, setChatMessages, apiKey, setApiKey, model, setModel, onShowUpcomingFeatures, isMobile }) => {
  const [isDebugStarted, setIsDebugStarted] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * loadingQuotes.length));
  const [localCode, setLocalCode] = useState(initialCode || '');
  const [detectedLang, setDetectedLang] = useState(initialLang || 'C');
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    setLocalCode(initialCode || '');
    setIsDebugStarted(false);
  }, [initialCode]);

  useEffect(() => {
    setDetectedLang(initialLang || 'C');
  }, [initialLang]);

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

const makeCodePythonTutorRunnable = (code, lang) => {
  if (!code) return '';
  let src = code.trim();

  // Helper: Strip comments and compress excess blank lines if code is long
  const sanitizeLength = (str) => {
    if (encodeURIComponent(str).length <= 5400) return str;
    let cleaned = str.replace(/\/\*[\s\S]*?\*\//g, '');
    cleaned = cleaned.split('\n')
      .map(line => {
        if (lang === 'Python') return line.replace(/#.*$/, '');
        return line.replace(/\/\/.*$/, '');
      })
      .filter(line => line.trim().length > 0)
      .join('\n');
    return cleaned;
  };

  if (lang === 'C') {
    // Convert C++ STL headers & using namespace std to pure C
    src = src
      .replace(/#include\s*<vector>/g, '')
      .replace(/#include\s*<queue>/g, '')
      .replace(/#include\s*<stack>/g, '')
      .replace(/#include\s*<algorithm>/g, '')
      .replace(/#include\s*<iostream>/g, '#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>')
      .replace(/using namespace std;/g, '')
      .replace(/std::/g, '');

    if (!src.includes('<stdio.h>')) {
      src = `#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>\n\n${src}`;
    }

    src = src
      .replace(/cout\s*<<\s*arr\[i\]\s*<<\s*" ";/g, 'printf("%d ", arr[i]);')
      .replace(/cout\s*<<\s*"Element found at index: "\s*<<\s*(\w+)\s*<<\s*endl;/g, 'printf("Element found at index: %d\\n", $1);')
      .replace(/cout\s*<<\s*"Element not present in array"\s*<<\s*endl;/g, 'printf("Element not present in array\\n");')
      .replace(/cout\s*<<\s*([^<]+)\s*<<\s*endl;/g, 'printf("%d\\n", $1);')
      .replace(/cout\s*<<\s*([^;]+);/g, 'printf("%s\\n", $1);');

    const hasMain = /\bmain\s*\(/.test(src);
    if (!hasMain) {
      src = `#include <stdio.h>\n#include <stdbool.h>\n#include <stdlib.h>\n\nint main() {\n  ${src.split('\n').join('\n  ')}\n  return 0;\n}`;
    }
  } else if (lang === 'C++') {
    if (!src.includes('<iostream>')) {
      src = `#include <iostream>\nusing namespace std;\n\n${src}`;
    } else if (!src.includes('using namespace std')) {
      src = src.replace('#include <iostream>', '#include <iostream>\nusing namespace std;');
    }
    const hasMain = /\bmain\s*\(/.test(src);
    if (!hasMain) {
      src = `int main() {\n  ${src.split('\n').join('\n  ')}\n  return 0;\n}`;
    }
  } else if (lang === 'Java') {
    const hasClass = /\bclass\s+(\w+)/.test(src);
    const hasMain = /\bvoid\s+main\b/.test(src);

    if (!hasClass) {
      if (hasMain) {
        src = `public class Main {\n${src}\n}`;
      } else {
        src = `public class Main {\n  public static void main(String[] args) {\n    ${src.split('\n').join('\n    ')}\n  }\n}`;
      }
    } else {
      const match = src.match(/\bclass\s+(\w+)/);
      if (match && match[1] !== 'Main') {
        src = src.replace(new RegExp(`\\bclass\\s+${match[1]}\\b`, 'g'), 'class Main');
      }
      if (src.includes('class Main') && !src.includes('public class Main')) {
        src = src.replace(/\bclass\s+Main\b/, 'public class Main');
      }
    }
  } else if (lang === 'Python') {
    src = src
      .replace(/import numpy as np/g, '')
      .replace(/import pandas as pd/g, '')
      .replace(/np\.array\(([^)]+)\)/g, '$1')
      .replace(/np\.zeros\(([^)]+)\)/g, '[0]*$1');
  } else if (lang === 'JS') {
    src = src
      .replace(/document\.write\(([^)]+)\)/g, 'console.log($1)')
      .replace(/alert\(([^)]+)\)/g, 'console.log($1)');
  }

  return sanitizeLength(src);
};

  const handleStartDebug = () => {
    let codeToRun = makeCodePythonTutorRunnable(localCode, detectedLang);
    if (codeToRun.length === 0) return;

    setLocalCode(codeToRun);

    if (encodeURIComponent(codeToRun).length > 5500) {
      alert("🙏 We apologize for the inconvenience!\n\nYour code is too long (exceeds PythonTutor's 5,500 byte limit) even after auto-cleaning comments.\n\nPlease reduce size or execute it directly in our Sandboxed Code Runner!");
      return;
    }
    
    setIsIframeLoading(true);
    setIsDebugStarted(true);
    setTimeout(() => setIsIframeLoading(false), 8000);
  };

  useEffect(() => {
    let interval;
    if (isIframeLoading) interval = setInterval(() => setQuoteIndex(p => (p + 1) % loadingQuotes.length), 4000);
    return () => clearInterval(interval);
  }, [isIframeLoading]);

  useEffect(() => {
    if (localCode.length < 10) return;
    const code = localCode;
    if (code.includes('public static void main') || code.includes('System.out.print') || /import\s+java/.test(code) || code.includes('public class ')) setDetectedLang('Java');
    else if (code.includes('#include <stdio.h>') || code.includes('printf(') || code.includes('scanf(')) setDetectedLang('C');
    else if (code.includes('#include <iostream>') || code.includes('cout <<') || code.includes('std::') || code.includes('using namespace std')) setDetectedLang('C++');
    else if (code.includes('#include') || code.includes('int main(')) setDetectedLang('C');
    else if ((/def\s+\w+\(/.test(code) || /print\(/.test(code)) && !code.includes(';') && !code.includes('{')) setDetectedLang('Python');
    else if (code.includes('console.log') || code.includes('document.') || /let\s+\w+/.test(code) || /const\s+\w+/.test(code)) setDetectedLang('JS');
  }, [localCode]);

  const getUnsupportedInfo = () => {
    if (!localCode || localCode.trim().length === 0) return null;
    const byteLen = encodeURIComponent(localCode.trim()).length;
    if (byteLen > 5500) {
      return {
        title: "Code Size Limit Exceeded",
        reason: `Your code size (${byteLen} bytes) exceeds PythonTutor's max limit of 5,500 bytes.`,
        solution: "Remove comments, blank lines, or extra boilerplate code to reduce size below 5,500 bytes."
      };
    }

    if (detectedLang === 'C') {
      if (localCode.includes('<vector>') || localCode.includes('<iostream>') || localCode.includes('using namespace std') || localCode.includes('<queue>') || localCode.includes('<stack>') || localCode.includes('<algorithm>') || localCode.includes('<string>') || localCode.includes('<map>') || localCode.includes('<set>')) {
        return {
          title: "C++ Header in C Language Mode",
          reason: "C++ STL headers (like <vector>, <iostream>, <queue>) are unsupported in standard C compilers (GCC).",
          solution: "Switch to C++ Mode or replace C++ headers with native C structures & <stdio.h>."
        };
      }
      if (localCode.includes('<pthread.h>') || localCode.includes('<unistd.h>') || localCode.includes('<sys/')) {
        return {
          title: "Unsupported POSIX System Header",
          reason: "POSIX multithreading and system headers are blocked in sandboxed cloud tracing.",
          solution: "Use standard single-threaded C code."
        };
      }
    }

    if (detectedLang === 'C++') {
      if (localCode.includes('<thread>') || localCode.includes('<future>') || localCode.includes('<filesystem>') || localCode.includes('<chrono>')) {
        return {
          title: "Unsupported C++ System Header",
          reason: "C++ multithreading, async futures, and filesystem operations cannot be traced in PythonTutor sandboxes.",
          solution: "Use standard single-threaded C++ algorithmic logic."
        };
      }
    }

    if (detectedLang === 'Java') {
      if (localCode.includes('javax.swing') || localCode.includes('java.awt')) {
        return {
          title: "Unsupported Java GUI Package",
          reason: "Java Swing/AWT GUI packages cannot render in terminal trace sandboxes.",
          solution: "Use console output with System.out.println()."
        };
      }
      if (localCode.includes('java.io.File') || localCode.includes('java.net.')) {
        return {
          title: "Blocked Java System I/O",
          reason: "Disk file operations and network sockets are disabled in cloud sandboxes.",
          solution: "Use in-memory data structures."
        };
      }
    }

    if (detectedLang === 'Python') {
      if (localCode.includes('import numpy') || localCode.includes('import pandas') || localCode.includes('import matplotlib') || localCode.includes('import requests') || localCode.includes('import scipy')) {
        return {
          title: "Unsupported External Python Package",
          reason: "Third-party libraries (numpy, pandas, matplotlib, requests) are not installed on PythonTutor core.",
          solution: "Use standard Python data structures (lists, dicts, math, collections)."
        };
      }
    }

    if (detectedLang === 'JS') {
      if (localCode.includes('document.') || localCode.includes('window.') || localCode.includes('fetch(') || localCode.includes('require(')) {
        return {
          title: "Unsupported JavaScript DOM / Node.js API",
          reason: "DOM methods (document, window), fetch(), and Node.js require() are unavailable in PythonTutor JS engine.",
          solution: "Use pure JavaScript ES6 algorithmic code with console.log()."
        };
      }
    }

    return null;
  };

  const unsupportedInfo = getUnsupportedInfo();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <header className="header-glass">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <h1 className="title-gradient" style={{ fontSize: '1.55rem', margin: 0 }}>🐞 Line-by-Line Debugger</h1>
            <select className="styled-select" value={detectedLang} onChange={(e) => setDetectedLang(e.target.value)} style={{ padding: '4px 24px 4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer', height: 'auto', width: 'auto', backgroundPosition: 'right 6px center', backgroundSize: '10px' }}>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="JS">JavaScript</option>
            </select>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isDebugStarted ? 'Interactive Execution Mode' : 'Ready — write code and press Start Debug'}
          </div>
        </div>
        <div className="controls-glass" style={{ gap: '4px', alignItems: 'center' }}>
          {!isDebugStarted ? (
            <>
              <span style={{ fontSize: '0.75rem', color: encodeURIComponent(localCode).length > 5500 ? '#ef4444' : 'var(--text-secondary)', marginRight: '8px' }}>
                {encodeURIComponent(localCode).length} / 5500 bytes
              </span>
              <button className="btn btn-insert" style={{ padding: '0.4rem 1rem' }} onClick={handleStartDebug}>
                ▶ Start Debug
              </button>
            </>
          ) : (
            <button className="btn btn-clear" style={{ padding: '0.4rem 1rem' }} onClick={() => setIsDebugStarted(false)}>
              ✏️ Edit Code
            </button>
          )}
          <div style={{ width: '1px', height: '22px', background: 'var(--glass-border)', margin: '0 4px' }} />
          {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙ Settings</button>}
          <button className="btn btn-clear" onClick={onBack}>🏠 Home</button>
        </div>
      </header>

      {unsupportedInfo && (
        <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(220, 38, 38, 0.25))', borderBottom: '2px solid rgba(239, 68, 68, 0.5)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexShrink: 0, boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '2rem', lineHeight: '1' }}>🙏</div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#fca5a5', fontWeight: 'bold', letterSpacing: '0.3px' }}>
                OUR SINCERE APOLOGY FOR THIS INCONVENIENCE — {unsupportedInfo.title.toUpperCase()}
              </h4>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {unsupportedInfo.reason}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#fbbf24', marginTop: '4px', fontWeight: '500' }}>
                💡 Recommended Fix: {unsupportedInfo.solution}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            {detectedLang === 'C' && unsupportedInfo.title.includes('C++') && (
              <button className="btn btn-insert" style={{ fontSize: '0.85rem', padding: '6px 14px', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }} onClick={() => setDetectedLang('C++')}>
                Switch to C++ Mode
              </button>
            )}
            <button className="btn btn-clear" style={{ fontSize: '0.85rem', padding: '6px 14px', whiteSpace: 'nowrap', background: 'rgba(16,185,129,0.25)', color: '#34d399', border: '1px solid rgba(16,185,129,0.4)', fontWeight: 'bold' }} onClick={() => setIsRunnerOpen(true)}>
              ▶ Run in Sandboxed Code Runner
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>
        {!isDebugStarted ? (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: isMobile ? 'none' : '2px solid #ddd', background: 'var(--bg-secondary)' }}>
              <div style={{ padding: '6px 12px', borderBottom: '1px solid #ddd', background: 'var(--glass-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Code Editor</span>
              </div>
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div ref={lineNumbersRef} style={{ width: '44px', background: 'rgba(0,0,0,0.12)', color: 'var(--text-secondary)', textAlign: 'right', padding: '1rem 6px 2rem 0', fontFamily: 'monospace', fontSize: `${fontSize}px`, lineHeight: '1.6', flexShrink: 0, userSelect: 'none', borderRight: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                  {localCode.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea className="code-textarea" value={localCode} onChange={e => setLocalCode(e.target.value)} onScroll={handleScroll}
                  style={{ flex: 1, padding: '1rem', fontSize: `${fontSize}px`, lineHeight: '1.6', whiteSpace: wordWrap === 'on' ? 'pre-wrap' : 'pre', border: 'none', borderRadius: 0, height: '100%', background: 'transparent', color: 'var(--text-primary)', outline: 'none', resize: 'none', overflow: 'auto' }}
                  placeholder={
                    detectedLang === 'C' ? `Write C code here...\n\nExample:\n\n#include <stdio.h>\n\nint main() {\n  int x = 10;\n  printf("%d\\n", x);\n  return 0;\n}` :
                    detectedLang === 'Java' ? `Write Java code here...\n\nIMPORTANT: Java requires a public class.\nExample:\n\npublic class Main {\n  public static void main(String[] args) {\n    int x = 10;\n    System.out.println(x);\n  }\n}` :
                    detectedLang === 'C++' ? `Write C++ code here...\n\nExample:\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 10;\n  cout << x << endl;\n  return 0;\n}` :
                    detectedLang === 'Python' ? `Write Python code here...\n\nExample:\n\nx = 10\nprint(x)` :
                    `Write JS code here...\n\nExample:\n\nlet x = 10;\nconsole.log(x);`
                  }
                  spellCheck={false} />
              </div>
            </div>
            {!isMobile && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#e8ecf0', minWidth: '350px', padding: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔍</div>
                <h3 style={{ color: '#334155', margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Line-by-Line Execution Engine</h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem', textAlign: 'center', maxWidth: '380px', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
                  Click <strong>"▶ Start Debug"</strong> above to trace your C/C++/Java/Python/JS code line-by-line!
                </p>

                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px 18px', maxWidth: '420px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span>ℹ️</span> Execution Engine Guidance
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0, lineHeight: '1.5' }}>
                    We apologize for any inconvenience if a specific complex code snippet cannot be visualised line-by-line due to cloud execution limits (e.g. C++ headers in C mode or 5,500 bytes max limit). You can always copy full C/C++ code or execute it in our <strong>Sandboxed Code Runner</strong>!
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, background: '#fff', position: 'relative' }}>
            {isIframeLoading && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                <svg className="bike" viewBox="0 0 48 30" width="80px" height="50px" style={{ color: 'var(--accent-primary)' }}>
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                    <g transform="translate(9.5,19)">
                      <circle className="bike__tire" r="9" strokeDasharray="56.549 56.549" />
                      <g className="bike__spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
                        <circle className="bike__spokes" r="5" />
                        <circle className="bike__spokes" r="5" transform="rotate(180,0,0)" />
                      </g>
                    </g>
                    <g transform="translate(24,19)">
                      <g className="bike__pedals-spin" strokeDasharray="25.133 25.133" strokeDashoffset="-21.991" transform="rotate(67.5,0,0)">
                        <circle className="bike__pedals" r="4" />
                        <circle className="bike__pedals" r="4" transform="rotate(180,0,0)" />
                      </g>
                    </g>
                    <g transform="translate(38.5,19)">
                      <circle className="bike__tire" r="9" strokeDasharray="56.549 56.549" />
                      <g className="bike__spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
                        <circle className="bike__spokes" r="5" />
                        <circle className="bike__spokes" r="5" transform="rotate(180,0,0)" />
                      </g>
                    </g>
                    <polyline className="bike__seat" points="14 3,18 3" strokeDasharray="5 5" />
                    <polyline className="bike__body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" strokeDasharray="79 79" />
                    <path className="bike__handlebars" d="m30,2h6s1,0,1,1-1,1-1,1" strokeDasharray="10 10" />
                    <polyline className="bike__front" points="32.5 2,38.5 19" strokeDasharray="19 19" />
                  </g>
                </svg>
                <h3 style={{ color: 'var(--text-primary)', marginTop: '1rem', fontFamily: 'inherit' }}>Initializing Execution Engine...</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Please wait, the cloud server is processing your code.</p>
                <div style={{ marginTop: '1.5rem', fontStyle: 'italic', color: loadingQuotes[quoteIndex].color, fontSize: '0.95rem', fontWeight: 600, maxWidth: '80%', textAlign: 'center', minHeight: '40px', transition: 'opacity 0.3s' }}>
                  {loadingQuotes[quoteIndex].text}
                </div>
              </div>
            )}
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              src={`https://pythontutor.com/iframe-embed.html#code=${encodeURIComponent(localCode)}&cumulative=false&curInstr=0&heapPrimitives=nevernest&origin=opt-frontend.js&py=${ptLangMap[detectedLang] || 'js'}&rawInputLstJSON=%5B%5D&textReferences=false`}
              title="Execution Trace"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Fallback-safe Clipboard Copy Helper
const copyToClipboard = (text) => {
  const fallbackCopy = (txt) => {
    const textArea = document.createElement("textarea");
    textArea.value = txt;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 999999);
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error("execCommand('copy') returned false"));
      }
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.reject(err);
    }
  };

  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).catch((err) => {
      console.warn("navigator.clipboard failed, falling back to execCommand:", err);
      return fallbackCopy(text);
    });
  } else {
    return fallbackCopy(text);
  }
};


// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [welcomeRole] = useState(() => (Math.random() < 0.5 ? 'engineer' : 'coder'));
  const [appMode,       setAppMode]       = useState(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (isPageLoading) {
      const timer = setTimeout(() => setIsPageLoading(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isPageLoading]);
  const [treeType,      setTreeType]      = useState('BST');
  const [activeStateWidth, setActiveStateWidth] = useState(260);
  const [showTreeLogPanel, setShowTreeLogPanel] = useState(true);
  const [showCode,          setShowCode]          = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [treeLogPosition, setTreeLogPosition] = useState({ x: 20, y: 120 });
  const [isDraggingTreeLog, setIsDraggingTreeLog] = useState(false);
  const [treeLogSize, setTreeLogSize] = useState({ width: 580, height: 300 });
  const [globalDsType,  setGlobalDsType]  = useState('HASH_TABLE');
  const [globalDsVariety, setGlobalDsVariety] = useState('HASH_LINEAR');
  const [pendingModule, setPendingModule] = useState(null);
  const [fenwickBitMode, setFenwickBitMode] = useState(false);
  const [bTreeOrder,    setBTreeOrder]    = useState(4);
  const [deleteStrategy, setDeleteStrategy] = useState('RIGHT');
  const [splitStrategy,  setSplitStrategy]  = useState('MEDIAN');
  const [showBoundsInfo,  setShowBoundsInfo]  = useState(false);
  const [codeLang,      setCodeLang]      = useState('C');
  const [currentTheme,  setCurrentTheme]  = useState(() => {
    return safeLocalStorage.getItem('algoflow_theme') || 'Neon Cyberpunk';
  });
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [mobileTab, setMobileTab] = useState('vis'); // 'vis' | 'code' | 'log'
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [globalApiKey,  setGlobalApiKey]  = useState(() => safeLocalStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [globalModel,   setGlobalModel]   = useState(() => {
    const saved = safeLocalStorage.getItem('gemini_model');
    if (!saved || saved.includes('1.5')) {
      safeLocalStorage.setItem('gemini_model', 'gemini-2.0-flash');
      return import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
    }
    return saved;
  });

  const [globalSort, setGlobalSort] = useState('Bubble Sort');
  const [globalSearch, setGlobalSearch] = useState('Linear Search');
  const [globalSortSearchTab, setGlobalSortSearchTab] = useState('Sort');
  const [globalGraphAlgo, setGlobalGraphAlgo] = useState('Dijkstra');
  const [globalDpTab, setGlobalDpTab] = useState('LCS');

  const bTreeRef     = useRef(new BTreeEngine(4, false, 'MEDIAN'));
  const bPlusTreeRef = useRef(new BTreeEngine(4, true, 'MEDIAN'));
  const rbEngineRef  = useRef(new RBEngine());

  const [inputValue,     setInputValue]    = useState('');
  const [insertedValues, setInsertedValues]= useState([]);
  const [operationsLog,  setOperationsLog] = useState([]);
  const [showDeletionsInCode, setShowDeletionsInCode] = useState(true);
  const [customCode,     setCustomCode]    = useState('');
  const [homeSearchQuery,setHomeSearchQuery]= useState('');
  const [analysisResult, setAnalysisResult]= useState(null);
  const [animationSpeed, setAnimationSpeed]= useState(400);
  const [showTopicInfo, setShowTopicInfo]  = useState(false);

  const [timeline,    setTimeline]    = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);

  const prevStepRef = useRef(0);
  const prevTimelineRef = useRef([]);
  useEffect(() => {
    prevStepRef.current = currentStep;
    prevTimelineRef.current = timeline;
  }, [currentStep, timeline]);

  const containerRef    = useRef(null);
  const logEndRef       = useRef(null);
  const playIntervalRef = useRef(null);

  const [codeHeight, setCodeHeight] = useState(240);
  const [logWidth, setLogWidth] = useState(380);
  const treeLogDragStart = useRef({ x: 0, y: 0 });
  const treeLogPanelStart = useRef({ x: 0, y: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '👋 Hi! I\'m your AI coding assistant powered by Gemini.\n\nAsk me anything:\n• "Explain binary search"\n• "Fix my code"\n• "Write a bubble sort in Python"\n• "What is AVL tree rotation?"\n\nI\'m here to help!' }
  ]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [runnerCode, setRunnerCode] = useState('');
  const [runnerLang, setRunnerLang] = useState('Java');
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorWordWrap, setEditorWordWrap] = useState('off');
  const [editorScroll,   setEditorScroll]   = useState(0);

  // Copy success/options modal state
  const [copyModalData, setCopyModalData] = useState({ isOpen: false, code: '', language: '' });
  const [activeCodeForChat, setActiveCodeForChat] = useState('');
  const [activeLangForChat, setActiveLangForChat] = useState('C');
  const [themeMode, setThemeMode] = useState('dark');

  const [lastActiveMode, setLastActiveMode] = useState(null);
  const [lastSetupComplete, setLastSetupComplete] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [treeCodeCopied, setTreeCodeCopied] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('UI/UX');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isAdminFeedbackOpen, setIsAdminFeedbackOpen] = useState(false);
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');

  // ── Authentication, Session and Db State variables ──
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState(() => {
    const savedRole = safeLocalStorage.getItem('userRole');
    const savedTime = safeLocalStorage.getItem('loginTime');
    if (savedRole && savedTime && Date.now() - Number(savedTime) < 3600000) {
      return savedRole;
    }
    return '';
  });

  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginStep, setLoginStep] = useState(1); // 1: Email, 2: Password (Admin), 3: OTP (Others)
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [loginOtpInput, setLoginOtpInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginWarning, setLoginWarning] = useState('');
  const [fallbackOtp, setFallbackOtp] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');

  // ── OTP & Database Admin verification states ──
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [feedbackOtpCode, setFeedbackOtpCode] = useState('');
  const [isFeedbackSendingOtp, setIsFeedbackSendingOtp] = useState(false);
  const [isFeedbackVerifyingOtp, setIsFeedbackVerifyingOtp] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const feedbackScrollRef = useRef(null);

  const triggerFeedbackError = (msg) => {
    setFeedbackError(msg);
    setTimeout(() => {
      if (feedbackScrollRef.current) {
        feedbackScrollRef.current.scrollTop = feedbackScrollRef.current.scrollHeight;
      }
    }, 50);
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const savedRole = safeLocalStorage.getItem('userRole');
    const savedTime = safeLocalStorage.getItem('loginTime');
    if (savedRole && savedTime && Date.now() - Number(savedTime) < 3600000) {
      return savedRole === 'admin';
    }
    return false;
  });
  const [adminPinInput, setAdminPinInput] = useState(() => {
    const savedRole = safeLocalStorage.getItem('userRole');
    const savedTime = safeLocalStorage.getItem('loginTime');
    if (savedRole && savedTime && Date.now() - Number(savedTime) < 3600000 && savedRole === 'admin') {
      return 'Irctc@11';
    }
    return '';
  });
  const [adminErrorMessage, setAdminErrorMessage] = useState('');
  const [adminFeedbacksList, setAdminFeedbacksList] = useState([]);

  // Helper for safe API requests to handle connection errors and invalid/empty responses
  const safeFetchJson = async (url, options = {}) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || process.env.BACKEND_URL || '';
      const cleanBackend = backend.endsWith('/') ? backend.slice(0, -1) : backend;
      const cleanUrl = url.startsWith('/') ? url : `/${url}`;
      const targetUrl = `${cleanBackend}${cleanUrl}`;

      const res = await fetch(targetUrl, options);
      
      const contentType = res.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (!res.ok) {
        let errorMsg = `Server returned status ${res.status}`;
        if (isJson) {
          try {
            const errData = await res.json();
            errorMsg = errData.error || errorMsg;
          } catch (_) {}
        } else {
          try {
            const text = await res.text();
            if (text && text.length < 100) errorMsg = text;
          } catch (_) {}
        }
        throw new Error(errorMsg);
      }
      
      if (!isJson) {
        throw new Error('Server did not return a JSON response.');
      }
      
      try {
        return await res.json();
      } catch (err) {
        throw new Error('Failed to parse response from server.');
      }
    } catch (err) {
      if (err.message && (err.message.startsWith('Server returned') || err.message.startsWith('Server did not') || err.message.startsWith('Failed to parse'))) {
        throw err;
      }
      if (err.message && err.message.includes('Failed to fetch')) {
        throw new Error('Could not connect to the server. Please ensure the backend is running.');
      }
      throw err;
    }
  };

  // ── DB State Saver & Loader ──
  const applyState = (sd) => {
    if (sd.appMode !== undefined) setAppMode(sd.appMode);
    if (sd.treeType !== undefined) setTreeType(sd.treeType);
    if (sd.insertedValues !== undefined) setInsertedValues(sd.insertedValues);
    if (sd.operationsLog !== undefined) setOperationsLog(sd.operationsLog);
    if (sd.customCode !== undefined) setCustomCode(sd.customCode);
    if (sd.codeLang !== undefined) setCodeLang(sd.codeLang);
    if (sd.globalDsType !== undefined) setGlobalDsType(sd.globalDsType);
    if (sd.globalDsVariety !== undefined) setGlobalDsVariety(sd.globalDsVariety);
    if (sd.globalSort !== undefined) setGlobalSort(sd.globalSort);
    if (sd.globalSearch !== undefined) setGlobalSearch(sd.globalSearch);
    if (sd.globalSortSearchTab !== undefined) setGlobalSortSearchTab(sd.globalSortSearchTab);
    if (sd.globalGraphAlgo !== undefined) setGlobalGraphAlgo(sd.globalGraphAlgo);
    if (sd.setupComplete !== undefined) setSetupComplete(sd.setupComplete);
    if (sd.currentTheme !== undefined && THEMES[sd.currentTheme]) setCurrentTheme(sd.currentTheme);
  };

  const loadStateFromLocalStorage = () => {
    try {
      const saved = safeLocalStorage.getItem('algoflow_local_state');
      if (saved) {
        const sd = JSON.parse(saved);
        applyState(sd);
      }
    } catch (err) {
      console.error("Failed to parse local state:", err);
    }
  };

  // ── DB State Saver & Loader ──
  const saveStateToDatabase = async (email, stateData) => {
    // Always persist locally first so it works offline/statically
    safeLocalStorage.setItem('algoflow_local_state', JSON.stringify(stateData));
    if (!email) return;
    try {
      await fetch('/api/user/save-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, state_data: stateData })
      });
    } catch (err) {
      console.warn("Could not auto-save state to database (running in static mode):", err);
    }
  };

  const loadStateFromDatabase = async (email) => {
    try {
      const data = await safeFetchJson(`/api/user/load-state?email=${encodeURIComponent(email)}`);
      if (data && data.success && data.state_data) {
        applyState(data.state_data);
      }
    } catch (err) {
      console.warn("Could not load state from database (running in static mode):", err);
      // Fallback to local storage if API fails
      loadStateFromLocalStorage();
    }
  };

  // On Mount: load state
  useEffect(() => {
    loadStateFromLocalStorage();

    const savedEmail = safeLocalStorage.getItem('userEmail');
    const savedTime = safeLocalStorage.getItem('loginTime');
    if (savedEmail && savedTime && Date.now() - Number(savedTime) < 3600000) {
      loadStateFromDatabase(savedEmail);
    }

    // Automatically show upcoming features on first load
    const shown = safeLocalStorage.getItem('upcoming_features_v1');
    if (!shown) {
      setIsUpcomingOpen(true);
      safeLocalStorage.setItem('upcoming_features_v1', 'true');
    }
  }, []);

  // Fetch Google Client ID on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/auth/config');
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.googleClientId) {
            setGoogleClientId(data.googleClientId);
          }
        }
      } catch (_) {
        // Running in static mode
      }
    };
    fetchConfig();
  }, []);

  // Initialize and Render Google Sign-in Button when step 1 and google are available
  useEffect(() => {
    let checkInterval;
    if (loginStep === 1 && googleClientId) {
      const initButton = () => {
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleLogin,
            });

            const btnContainer = document.getElementById('google-signin-btn');
            if (btnContainer) {
              window.google.accounts.id.renderButton(
                btnContainer,
                { 
                  theme: 'filled_blue', 
                  size: 'large', 
                  width: btnContainer.offsetWidth || 380,
                  text: 'signin_with',
                  shape: 'rectangular'
                }
              );
            }
            if (checkInterval) clearInterval(checkInterval);
          } catch (err) {
            console.error("Failed to initialize Google login button:", err);
          }
        }
      };

      if (window.google) {
        initButton();
      } else {
        // Poll for window.google to load
        checkInterval = setInterval(initButton, 100);
      }
    }
    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [loginStep, googleClientId]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!isLoggedIn || !userEmail) return;
    const stateData = {
      appMode,
      treeType,
      insertedValues,
      operationsLog,
      customCode,
      codeLang,
      globalDsType,
      globalDsVariety,
      globalSort,
      globalSearch,
      globalSortSearchTab,
      globalGraphAlgo,
      setupComplete
    };
    
    const delayDebounce = setTimeout(() => {
      saveStateToDatabase(userEmail, stateData);
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [
    isLoggedIn,
    userEmail,
    appMode,
    treeType,
    insertedValues,
    operationsLog,
    customCode,
    codeLang,
    globalDsType,
    globalDsVariety,
    globalSort,
    globalSearch,
    globalSortSearchTab,
    globalGraphAlgo,
    setupComplete
  ]);

  // Login Handlers
  const handleCheckEmail = async () => {
    if (!loginEmailInput.trim()) {
      setLoginError("Please enter your email address.");
      return;
    }
    if (!loginEmailInput.includes('@') || !loginEmailInput.includes('.')) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    setLoginError('');
    setLoginWarning('');
    setFallbackOtp('');
    setLoginLoading(true);

    try {
      const data = await safeFetchJson('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmailInput.trim() })
      });
      
      if (data.warning) {
        setLoginWarning(data.warning);
      }
      if (data.otp) {
        setFallbackOtp(data.otp);
      }
      
      if (data.action === 'password') {
        setLoginStep(2);
      } else {
        setLoginStep(3);
      }
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      const data = await safeFetchJson('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('loginTime', Date.now().toString());

      setUserEmail(data.email);
      setUserRole(data.role);
      setIsLoggedIn(true);

      if (data.role === 'admin') {
        setIsAdminAuthenticated(true);
        setAdminPinInput('Irctc@11');
      }

      await loadStateFromDatabase(data.email);
    } catch (err) {
      setLoginError(err.message || 'Google authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!loginPasswordInput.trim()) {
      setLoginError("Please enter the password.");
      return;
    }

    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await safeFetchJson('/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmailInput.trim(),
          password: loginPasswordInput.trim()
        })
      });

      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('loginTime', Date.now().toString());

      setUserEmail(data.email);
      setUserRole(data.role);
      setIsAdminAuthenticated(true);
      setAdminPinInput('Irctc@11');
      setIsLoggedIn(true);

      await loadStateFromDatabase(data.email);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUserOtpLogin = async () => {
    if (!loginOtpInput.trim()) {
      setLoginError("Please enter the 6-digit verification code.");
      return;
    }

    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await safeFetchJson('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmailInput.trim(),
          otp: loginOtpInput.trim()
        })
      });

      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('loginTime', Date.now().toString());

      setUserEmail(data.email);
      setUserRole(data.role);
      setIsLoggedIn(true);

      await loadStateFromDatabase(data.email);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoginError('');
    setLoginWarning('');
    setFallbackOtp('');
    setIsResendingOtp(true);
    try {
      const data = await safeFetchJson('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmailInput.trim() })
      });
      if (data.warning) {
        setLoginWarning(data.warning);
      }
      if (data.otp) {
        setFallbackOtp(data.otp);
      }
      alert('A new verification code has been generated.');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTime');
    setUserEmail('');
    setUserRole('');
    setIsAdminAuthenticated(false);
    setAdminPinInput('');
    setIsLoggedIn(false);
    setAppMode(null);
    setSetupComplete(false);
    setLoginStep(1);
    setLoginEmailInput('');
    setLoginPasswordInput('');
    setLoginOtpInput('');
    setLoginWarning('');
    setFallbackOtp('');
  };

  const checkRestrictedWords = (text) => {
    if (!text) return null;
    
    // Normalize string to lowercase
    let raw = text.toLowerCase();
    
    // Map lookalike symbols and numbers to letters (leet-speak)
    const replacements = [
      { from: /@/g, to: 'a' },
      { from: /€/g, to: 'e' },
      { from: /3/g, to: 'e' },
      { from: /1/g, to: 'i' },
      { from: /!/g, to: 'i' },
      { from: /\|/g, to: 'i' },
      { from: /0/g, to: 'o' },
      { from: /°/g, to: 'o' },
      { from: /\$/g, to: 's' },
      { from: /5/g, to: 's' },
      { from: /7/g, to: 't' },
      { from: /\+/g, to: 't' },
      { from: /8/g, to: 'b' }
    ];
    
    let leetMapped = raw;
    replacements.forEach(r => {
      leetMapped = leetMapped.replace(r.from, r.to);
    });
    
    // Helper to collapse consecutive repeating characters (e.g. "erri-ppuukkaa" -> "eripuka")
    const collapse = (s) => s.replace(/(.)\1+/g, '$1');
    
    // Helper for homoglyphs / sound-alikes (e.g. c -> k, q -> k, v -> w)
    const homoglyph = (s) => s.replace(/[cq]/g, 'k').replace(/v/g, 'w');

    // Create variants of input text to match against:
    const alphaOnly = leetMapped.replace(/[^a-z0-9]/g, '');
    const rawAlphaOnly = raw.replace(/[^a-z0-9]/g, '');
    const collapsedAlpha = collapse(alphaOnly);
    const collapsedRawAlpha = collapse(rawAlphaOnly);
    const homoglyphAlpha = homoglyph(alphaOnly);
    const homoglyphCollapsed = collapse(homoglyphAlpha);

    const inputVariants = Array.from(new Set([
      raw,
      leetMapped,
      alphaOnly,
      rawAlphaOnly,
      collapsedAlpha,
      collapsedRawAlpha,
      homoglyphAlpha,
      homoglyphCollapsed
    ]));

    // Base forbidden root substrings & variants (Telugu & English profanity, pornstars, adult sites, genres)
    const badWords = [
      'aathu', 'aathoo', 'aathuu', 'athu', 'aatu', 'athuu',
      'gudu', 'gudha', 'guda', 'gudda', 'guddha', 'goodu', 'gudhu', 'gudh',
      'vattakayalu', 'vattakaayalu', 'vattalu', 'vattakaya', 'vatta', 'vattakay', 'vattakayal', 'vatakayalu', 'vatakaya',
      'puka', 'puku', 'pooku', 'pukaa', 'pooka', 'pukka', 'pulka', 'pukla', 'pukya', 'puk', 'pook', 'pucka',
      'erripuka', 'erri puka', 'erripooka', 'erri pooka', 'erripukka', 'erri pukka', 'erripulka', 'erri pulka', 'erripukla', 'erri pukla',
      'moddagudu', 'modda gudu', 'modagudu', 'moda gudu', 'modagudda',
      'lanja', 'lanjaa', 'lanza', 'lanjodaka', 'lanjodka', 'lanjakodaka', 'lanje', 'lanjakoda', 'lanjakora',
      'modda', 'madda', 'moddae', 'maddodda', 'moda', 'mada',
      'mogga', 'moga', 'moggah', 'mogaa',
      'bokka', 'boka', 'bokkah', 'bokaa',
      'sulli', 'suli',
      'dengai', 'dengey', 'denga', 'dengu', 'dengutha', 'denge', 'dengodka',
      'naaku',
      'fuck', 'fuk', 'fck', 'bitch', 'bich', 'ass', 'bastard', 'dick', 'dik', 'cunt', 'whore', 'whor', 'shit', 'sht',
      'penis', 'peneis', 'penus', 'pnis', 'peniss', 'peniz',
      'ovary', 'ovaries', 'ovaryy',
      'vagina', 'vaginaa', 'vagna', 'vgina',
      'boobs', 'boob', 'bobs', 'boobies',
      
      // Comprehensive Pornstars list
      'mia khalifa', 'miakhalifa', 'sunny leone', 'sunnyleone', 'lana rhoades', 'lanarhoades',
      'riley reid', 'rileyreid', 'angela white', 'angelawhite', 'abella danger', 'abelladanger',
      'dani daniels', 'danidaniels', 'brandi love', 'brandilove', 'eva elfie', 'evaelfie',
      'lisa ann', 'lisaann', 'mia melano', 'miamelano', 'johnny sins', 'johnnysins',
      'jordi el nino', 'jordielnino', 'sasha grey', 'sashagrey', 'lexi lore', 'lexilore',
      'sweetie fox', 'sweetiefox', 'kenzie reeves', 'kenziereeves', 'tori black', 'toriblack',
      'piper perri', 'piperperri', 'esperanza gomez', 'esperanzagomez', 'hentai', 'pornstar', 'porn',
      'august ames', 'asa akira', 'tasha reign', 'phoenix marie', 'charity crawford', 'alexis texas', 
      'briana banks', 'jenna jameson', 'jesse jane', 'belladonna', 'stormy daniels', 'katrina jade', 
      'gina valentina', 'lana lutz', 'emily willis', 'adriana chechik', 'kira noir', 'lena paul', 
      'nicole aniston', 'sophie dee', 'christy mack', 'janice griffith', 'megan rain', 'anjelica ebbi',
      
      // Comprehensive Porn sites and channels list
      'pornhub', 'xvideos', 'xnxx', 'xhamster', 'spankbang', 'redtube', 'youporn', 'onlyfans', 'chaturbate', 
      'fansly', 'brazzers', 'naughtyamerica', 'realitykings', 'bangbros', 'evilangel', 'digitalplayground', 
      'twistys', 'rkprime', 'faphouse', 'tube8', 'txxx', 'hentaihaven', 'porntrex', 'thumbzilla', 'eporner', 
      'hqporner', 'tubegalore', 'drrtube', 'heavy-r', 'motherless', 'xhamsterlive', 'commatozzee', 'cummatozzee', 'commatozze', 'cummatozze',
      
      // Comprehensive Adult styles, genres, and category keywords
      'milf', 'anal', 'blowjob', 'creampie', 'cumshot', 'deepthroat', 'gangbang', 'hardcore', 'softcore', 
      'threesome', 'orgy', 'bondage', 'bdsm', 'cuckold', 'squirt', 'facials', 'voyeur', 'lesbian', 'gay', 
      'ebony', 'interracial', 'babe', 'shemale', 'masturbation', 'masturbate', 'groupsex', 'transsexual',
      'bukkake', 'anilingus', 'cunnilingus', 'fellatio', 'fisting', 'ladyboy'
    ];

    // Collapsed forbidden root substrings
    const collapsedBadWords = [
      'athu', 'gudu', 'guda', 'gudh', 'vatakayalu', 'vatalu', 'vatakaya', 'vata',
      'puka', 'puku', 'poku', 'erripuka', 'moddagudu', 'cumatoze', 'comatoze',
      'lanja', 'lanza', 'lanjodaka', 'lanjodka', 'lanjakodaka', 'lanje',
      'moda', 'mada', 'moga', 'boka',
      'suli',
      'dengai', 'dengey', 'denga', 'dengu', 'dengutha',
      'fuk', 'bich', 'cunt', 'whor', 'shit',
      'penis', 'pnis', 'ovary', 'ovari', 'vagina', 'vagna', 'bob', 'boob',
      'pornhub', 'xvideo', 'xnxx', 'xhamster', 'spankbang', 'redtube', 'youporn', 'onlyfan', 'chaturbate', 'fansly', 'brazzer', 'naughtyamerica', 'realityking', 'bangbro', 'evilangel', 'digitalplayground', 'twisty', 'rkprime', 'faphouse', 'tube8', 'txxx', 'hentaihaven', 'porntrex', 'thumbzilla', 'eporner', 'hqporner', 'tubegalore', 'drrtube', 'heavy-r', 'motherless', 'xhamsterlive',
      'milf', 'anal', 'blowjob', 'creampie', 'cumshot', 'deepthroat', 'gangbang', 'hardcore', 'softcore', 'threesome', 'orgy', 'bondage', 'bdsm', 'cuckold', 'squirt', 'facial', 'voyeur', 'lesbian', 'gay', 'eboni', 'interracial', 'babe', 'shemale', 'masturbation', 'masturbate', 'groupsex', 'transsexual', 'bukkake', 'anilingus', 'cunnilingus', 'fellatio', 'fisting', 'ladyboy'
    ];

    // 0. Standalone check for "mg" (shortcut for moddagudu)
    for (const v of inputVariants) {
      if (/\bmg\b/i.test(v) || v === 'mg') {
        return 'mg';
      }
    }

    // 1. Direct match check for badWords across all input variants
    for (const w of badWords) {
      const wAlpha = w.replace(/[^a-z0-9]/g, '');
      const wCollapsed = collapse(wAlpha);
      const wHomoglyphCollapsed = collapse(homoglyph(wAlpha));

      for (const v of inputVariants) {
        if (w.length <= 3) {
          const boundaryRegex = new RegExp(`\\b${w}\\b`, 'i');
          if (boundaryRegex.test(v)) return w;
        } else {
          if (
            v.includes(w) ||
            v.includes(wAlpha) ||
            v.includes(wCollapsed) ||
            v.includes(wHomoglyphCollapsed)
          ) {
            return w;
          }
        }
      }
    }

    // 2. Additional check for collapsedBadWords
    for (const w of collapsedBadWords) {
      const wCollapsed = collapse(w);
      for (const v of inputVariants) {
        if (w.length <= 3) {
          const boundaryRegex = new RegExp(`\\b${w}\\b`, 'i');
          if (boundaryRegex.test(v)) return w;
        } else {
          if (v.includes(w) || v.includes(wCollapsed)) return w;
        }
      }
    }

    return null;
  };


  // Submit feedback directly
  const submitDirectFeedback = async () => {
    const nameTrimmed = feedbackName.trim();
    const emailTrimmed = feedbackEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (rating === 0) {
      triggerFeedbackError("Selecting a star rating is compulsory. Please select a rating (1-5 stars).");
      return;
    }
    if (!nameTrimmed) {
      triggerFeedbackError("Please enter your name.");
      return;
    }
    if (!emailTrimmed) {
      triggerFeedbackError("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(emailTrimmed)) {
      triggerFeedbackError("Please enter a valid email address (e.g. name@example.com) so we can update you on your feedback.");
      return;
    }
    if (!feedbackText.trim()) {
      triggerFeedbackError("Please enter some feedback message.");
      return;
    }

    // Check for restricted words/pornstars
    const restrictedInName = checkRestrictedWords(nameTrimmed);
    const restrictedInEmail = checkRestrictedWords(emailTrimmed);
    const restrictedInText = checkRestrictedWords(feedbackText);

    let isRestricted = false;
    let restrictedWord = null;
    let restrictedField = null;

    if (restrictedInName) {
      isRestricted = true;
      restrictedWord = restrictedInName;
      restrictedField = 'name';
    } else if (restrictedInEmail) {
      isRestricted = true;
      restrictedWord = restrictedInEmail;
      restrictedField = 'email';
    } else if (restrictedInText) {
      isRestricted = true;
      restrictedWord = restrictedInText;
      restrictedField = 'message';
    }

    if (isRestricted) {
      // Show polite user warning statement telling them to rectify without echoing profane words on screen
      triggerFeedbackError(`Inappropriate language detected in your ${restrictedField}. Please modify your input and submit again.`);

      // Log restricted attempt in database
      const payload = {
        name: nameTrimmed,
        email: emailTrimmed,
        rating,
        category: feedbackCategory,
        text: feedbackText.trim(),
        restricted_word: restrictedWord,
        restricted_field: restrictedField
      };

      try {
        await safeFetchJson('/api/feedback/submit-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log("💾 Restricted attempt logged in database.");
      } catch (err) {
        console.warn("Restricted attempt database logging failed:", err);
      }
      return; // Do NOT advance to success screen
    }

    // Normal clean flow
    setFeedbackError('');
    setIsFeedbackSubmitted(true); // Optimistically show success screen instantly
    
    const payload = {
      name: nameTrimmed,
      email: emailTrimmed,
      rating,
      category: feedbackCategory,
      text: feedbackText.trim()
    };

    // Run API call in the background
    (async () => {
      try {
        await safeFetchJson('/api/feedback/submit-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log("💾 Background feedback saved to database successfully.");
      } catch (err) {
        console.warn("Background feedback database submission failed, saving locally:", err);
        // Save locally as fallback
        try {
          const localFeedbacks = JSON.parse(localStorage.getItem('algoflow_feedbacks') || '[]');
          localFeedbacks.push({
            ...payload,
            created_at: new Date().toISOString()
          });
          localStorage.setItem('algoflow_feedbacks', JSON.stringify(localFeedbacks));
        } catch (_) {}
      }
    })();
  };

  // ── Feedback submission — no OTP, direct save to Neon ──
  const sendFeedbackOtp = async () => {
    // Skip OTP entirely — just submit directly
    await submitDirectFeedback();
  };

  const verifyOtpAndSubmit = async () => {
    if (rating === 0) {
      triggerFeedbackError("Selecting a star rating is compulsory. Please select a rating (1-5 stars).");
      return;
    }
    if (!feedbackOtpCode.trim()) {
      triggerFeedbackError("Please enter the 6-digit verification code.");
      return;
    }
    if (checkRestrictedWords(feedbackText)) {
      triggerFeedbackError("You are using restricted words. Please rectify them and send again.");
      return;
    }

    setFeedbackError('');
    setIsFeedbackVerifyingOtp(true);
    try {
      await safeFetchJson('/api/feedback/verify-and-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: feedbackEmail.trim(),
          otp: feedbackOtpCode.trim(),
          rating,
          category: feedbackCategory,
          text: feedbackText.trim()
        })
      });
      setIsFeedbackSubmitted(true);
    } catch (err) {
      setFeedbackError(err.message);
    } finally {
      setIsFeedbackVerifyingOtp(false);
    }
  };

  const loginAdminConsole = async () => {
    if (!adminPinInput.trim()) {
      setAdminErrorMessage("Please enter your developer security PIN.");
      return;
    }

    setAdminErrorMessage('');
    try {
      await safeFetchJson('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPinInput.trim() })
      });
      setIsAdminAuthenticated(true);
      fetchAdminFeedbacks(adminPinInput.trim());
    } catch (err) {
      setAdminErrorMessage(err.message);
    }
  };

  const fetchAdminFeedbacks = async (pinCode) => {
    try {
      const data = await safeFetchJson('/api/admin/feedbacks', {
        method: 'GET',
        headers: { 'Authorization': pinCode }
      });
      setAdminFeedbacksList(data);
    } catch (err) {
      console.error("Failed to fetch database feedbacks:", err);
    }
  };

  const clearAdminFeedbacks = async () => {
    if (!confirm("Are you sure you want to permanently clear all feedback entries from PostgreSQL database?")) {
      return;
    }

    try {
      await safeFetchJson('/api/admin/clear', {
        method: 'DELETE',
        headers: { 'Authorization': adminPinInput.trim() }
      });
      alert("All feedback logs cleared successfully from database!");
      setAdminFeedbacksList([]);
    } catch (err) {
      alert(err.message || "Failed to clear feedbacks.");
      console.error("Failed to clear feedbacks:", err);
    }
  };



  const handleCopyTrigger = (code, lang) => {
    setCopyModalData({ isOpen: true, code, language: lang });
  };

  // Sync theme mode type (dark/light) when theme changes
  useEffect(() => {
    if (THEMES[currentTheme]) {
      setThemeMode(THEMES[currentTheme].type);
    }
  }, [currentTheme]);

  // Sync Tree / Code Validator / Line Debugger changes to chatbot context
  useEffect(() => {
    if (appMode === 'MAIN_VIS') {
      const treeCode = getFullCodeTemplate(codeLang, treeType, showDeletionsInCode ? operationsLog : insertedValues.map(v => ({ op: 'insert', val: v })));
      setActiveCodeForChat(treeCode);
      setActiveLangForChat(codeLang);
    } else if (appMode === 'CODE_VAL_VIS' || appMode === 'LINE_BY_LINE_VIS') {
      setActiveCodeForChat(customCode);
      setActiveLangForChat(codeLang);
    }
  }, [appMode, codeLang, treeType, showDeletionsInCode, operationsLog, insertedValues, customCode]);

  // Apply theme
  useEffect(() => {
    const theme = THEMES[currentTheme] || THEMES['Neon Cyberpunk'];
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => {
      if (k !== 'bodyBg' && k !== 'type') {
        root.style.setProperty(k, v);
      }
    });
    root.style.setProperty('--body-bg', theme['--bg-primary']);
    root.style.colorScheme = theme.type;
    document.body.style.backgroundColor = theme['--bg-primary'];
    document.body.style.backgroundImage = theme.bodyBg;
    try {
      localStorage.setItem('algoflow_theme', currentTheme);
    } catch (e) {}
  }, [currentTheme]);

  const handleDragStart = e => {
    e.preventDefault();
    const startY = e.clientY, startH = codeHeight;
    const drag = ev => setCodeHeight(Math.max(100, Math.min(startH + (startY - ev.clientY), window.innerHeight - 200)));
    const end  = () => { document.removeEventListener('mousemove', drag); document.removeEventListener('mouseup', end); };
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', end);
  };

  const handleColDragStart = e => {
    if (e.cancelable) e.preventDefault();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startW = logWidth;
    const drag = ev => {
      const currentX = ev.type.startsWith('touch') ? ev.touches[0].clientX : ev.clientX;
      setLogWidth(Math.max(200, Math.min(startW + (startX - currentX), window.innerWidth - 300)));
    };
    const end  = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', end);
    };
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', end);
  };

  const handleActiveStateColDragStart = (e) => {
    if (e.cancelable) e.preventDefault();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startWidth = activeStateWidth;
    const drag = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const newWidth = Math.max(120, Math.min(600, startWidth + (currentX - startX)));
      setActiveStateWidth(newWidth);
    };
    const end = () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', end);
    };
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', end);
  };

  const handleTreeLogMouseDown = (e) => {
    const handle = e.target.closest('.log-drag-handle');
    if (handle) {
      setIsDraggingTreeLog(true);
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      treeLogDragStart.current = { x: clientX, y: clientY };
      treeLogPanelStart.current = { x: treeLogPosition.x, y: treeLogPosition.y };
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTreeLogResizeMouseDown = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const startWidth = treeLogSize.width;
    const startHeight = treeLogSize.height;

    const handleMouseMove = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newWidth = Math.max(340, startWidth + (currentX - startX));
      const newHeight = Math.max(180, startHeight + (currentY - startY));
      setTreeLogSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  useEffect(() => {
    if (!isDraggingTreeLog) return;
    const handleMouseMove = (e) => {
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      const dx = clientX - treeLogDragStart.current.x;
      const dy = clientY - treeLogDragStart.current.y;
      const maxX = Math.max(0, window.innerWidth - treeLogSize.width);
      const maxY = Math.max(0, window.innerHeight - treeLogSize.height);
      setTreeLogPosition({
        x: Math.max(0, Math.min(maxX, treeLogPanelStart.current.x + dx)),
        y: Math.max(0, Math.min(maxY, treeLogPanelStart.current.y + dy))
      });
    };
    const handleMouseUp = () => {
      setIsDraggingTreeLog(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingTreeLog, treeLogSize]);

  // Auto-detect language
  useEffect(() => {
    if (!customCode) return;
    if (customCode.includes('#include') || customCode.includes('cout <<')) setCodeLang('C++');
    else if (customCode.includes('public static void main') || customCode.includes('System.out.print')) setCodeLang('Java');
    else if ((customCode.includes('def ') || customCode.includes('print(')) && !customCode.includes(';')) setCodeLang('Python');
    else if (customCode.includes('console.log') || customCode.includes('function ')) setCodeLang('JS');
  }, [customCode]);

  // Drag to scroll functionality on tree visualizer container (works with mouse and touch)
  useEffect(() => {
    const slider = containerRef.current;
    if (!slider) return;
    let isDown = false;
    let startX, startY;
    let scrollLeft, scrollTop;

    const handleStart = (e) => {
      // Don't drag if clicking buttons, select dropdowns, inputs, or interactive tags
      if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;
      isDown = true;
      slider.style.cursor = 'grabbing';
      const pageX = e.pageX || (e.touches && e.touches[0].pageX);
      const pageY = e.pageY || (e.touches && e.touches[0].pageY);
      startX = pageX - slider.offsetLeft;
      startY = pageY - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollTop = slider.scrollTop;
    };

    const handleEnd = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const handleMove = (e) => {
      if (!isDown) return;
      // Only prevent default on touchmove to avoid breaking other controls, and prevent bounce scroll
      if (e.type === 'touchmove') e.preventDefault();
      const pageX = e.pageX || (e.touches && e.touches[0].pageX);
      const pageY = e.pageY || (e.touches && e.touches[0].pageY);
      const x = pageX - slider.offsetLeft;
      const y = pageY - slider.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      slider.scrollLeft = scrollLeft - walkX;
      slider.scrollTop = scrollTop - walkY;
    };

    slider.addEventListener('mousedown', handleStart);
    slider.addEventListener('mouseleave', handleEnd);
    slider.addEventListener('mouseup', handleEnd);
    slider.addEventListener('mousemove', handleMove);

    slider.addEventListener('touchstart', handleStart);
    slider.addEventListener('touchend', handleEnd);
    slider.addEventListener('touchmove', handleMove, { passive: false });

    return () => {
      slider.removeEventListener('mousedown', handleStart);
      slider.removeEventListener('mouseleave', handleEnd);
      slider.removeEventListener('mouseup', handleEnd);
      slider.removeEventListener('mousemove', handleMove);

      slider.removeEventListener('touchstart', handleStart);
      slider.removeEventListener('touchend', handleEnd);
      slider.removeEventListener('touchmove', handleMove);
    };
  }, [appMode]);

  // ── Enhanced Code Validator logic moved to top ─────────
  const validateCode = (code, lang) => {
    const errors = [];
    if (!code.trim()) return ['Code is empty.'];
    if (lang === 'Java' && !code.includes('class')) errors.push('Java code must contain a class definition.');
    return errors;
  };

  const extractOutput = (code, lang) => {
    // This is a fallback parser if network execution fails
    const outputs = [];
    const lines = code.split('\n');
    lines.forEach(line => {
      let match;
      if (lang === 'Java') match = line.match(/System\.out\.print(?:ln)?\s*\((.*?)\)\s*;/);
      else if (lang === 'C++') match = line.match(/cout\s*<<\s*(.*?)\s*(?:<<\s*endl\s*)?;/);
      else if (lang === 'Python') match = line.match(/print\s*\((.*?)\)/);
      if (match) {
        let val = match[1].trim().replace(/['"]/g, '');
        outputs.push(val);
      }
    });
    return outputs;
  };


  const enterMode = mode => {
    window.location.hash = mode;
    setAppMode(mode);
    const isStandalone = ['BEGINNER_101_VIS', 'GENERAL_DSA_VIS', 'SORT_SEARCH_VIS', 'GRAPH_VIS', 'DP_GREEDY_VIS', 'JAVA_OOP_VIS', 'DSA_NOTES_VIS'].includes(mode);
    setSetupComplete(isStandalone);
  };
  const goBack    = () => {
    window.location.hash = '';
    setAppMode(null);
    setSetupComplete(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '').trim();
      const validModes = ['BEGINNER_101_VIS', 'GENERAL_DSA_VIS', 'SORT_SEARCH_VIS', 'MAIN_VIS', 'GRAPH_VIS', 'DP_GREEDY_VIS', 'JAVA_OOP_VIS', 'DSA_NOTES_VIS', 'LINE_BY_LINE_VIS', 'CODE_VAL_VIS'];
      if (validModes.includes(hash)) {
        setAppMode(hash);
        const isStandalone = ['BEGINNER_101_VIS', 'GENERAL_DSA_VIS', 'SORT_SEARCH_VIS', 'GRAPH_VIS', 'DP_GREEDY_VIS', 'JAVA_OOP_VIS', 'DSA_NOTES_VIS'].includes(hash);
        if (isStandalone) setSetupComplete(true);
      } else {
        setAppMode(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasData = insertedValues.length > 0 || customCode.trim().length > 0 || timeline.length > 0;
      if (appMode && hasData) {
        e.preventDefault();
        e.returnValue = 'Refreshing will erase data. Are you sure?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [appMode, insertedValues.length, customCode, timeline.length]);




  const handleCopyTreeCode = () => {
    const rawCode = getFullCodeTemplate(codeLang, treeType, showDeletionsInCode ? operationsLog : insertedValues.map(v => ({ op: 'insert', val: v })));
    copyToClipboard(rawCode).then(() => {
      setTreeCodeCopied(true);
      setTimeout(() => setTreeCodeCopied(false), 2000);
      handleCopyTrigger(rawCode, codeLang);
    }).catch(err => console.error("Clipboard copy failed:", err));
  };

  const handleClear = () => {
    setTimeline([]); setCurrentStep(0); setIsPlaying(false);
    setInsertedValues([]); setOperationsLog([]); setAnalysisResult(null);
    bTreeRef.current = new BTreeEngine(bTreeOrder, false, splitStrategy);
    bPlusTreeRef.current = new BTreeEngine(bTreeOrder, true, splitStrategy);
    rbEngineRef.current = new RBEngine();
  };

  const prevTreeTypeRef = useRef(treeType);

  const rebuildTimeline = (targetTreeType, targetBTreeOrder, targetSplitStrategy) => {
    if (insertedValues.length === 0) {
      setTimeline([]);
      setCurrentStep(0);
      setIsPlaying(false);
      bTreeRef.current = new BTreeEngine(targetBTreeOrder, false, targetSplitStrategy);
      bPlusTreeRef.current = new BTreeEngine(targetBTreeOrder, true, targetSplitStrategy);
      rbEngineRef.current = new RBEngine();
      return;
    }

    const bTree = new BTreeEngine(targetBTreeOrder, false, targetSplitStrategy);
    const bPlusTree = new BTreeEngine(targetBTreeOrder, true, targetSplitStrategy);
    bTreeRef.current = bTree;
    bPlusTreeRef.current = bPlusTree;
    rbEngineRef.current = new RBEngine();

    let frames = [];
    let logs = [];
    let curRoot = null;
    let heapArr = [];
    let segValues = [];
    let fenValues = [];
    let graphValues = [];

    for (const val of insertedValues) {
      if (targetTreeType === 'MIN_HEAP' || targetTreeType === 'MAX_HEAP') {
        const res = simulateHeap(val, heapArr, logs, targetTreeType === 'MAX_HEAP');
        frames.push(...res.frames);
        heapArr = res.finalArr;
        logs = res.frames[res.frames.length - 1].logs;
      } else if (targetTreeType === 'BST' || targetTreeType === 'AVL') {
        const f = simulateBST(curRoot, val, logs);
        frames.push(...f);
        curRoot = f[f.length - 1].root;
        logs = f[f.length - 1].logs;
      } else if (targetTreeType === 'B_TREE' || targetTreeType === 'B_PLUS_TREE') {
        logs.push({ text: `─── ${targetTreeType === 'B_PLUS_TREE' ? 'B+ Tree' : 'B-Tree'} Insert(${val}) ───`, type: 'normal' });
        const rec = (h, r) => {
          const t = targetTreeType === 'B_TREE' ? bTree : bPlusTree;
          frames.push(new Frame(t.root, logs, h, r));
        };
        if (targetTreeType === 'B_TREE') bTree.insert(val, logs, rec);
        else bPlusTree.insert(val, logs, rec);
        rec(val, null);
      } else if (targetTreeType === 'SEGMENT_TREE') {
        const f = simulateSegTree(val, segValues, logs);
        frames.push(...f);
        curRoot = f[f.length - 1].root;
        logs = f[f.length - 1].logs;
        segValues.push(val);
      } else if (targetTreeType === 'FENWICK_TREE') {
        const f = simulateFenwick(val, fenValues, logs);
        frames.push(...f);
        curRoot = f[f.length - 1].root;
        logs = f[f.length - 1].logs;
        fenValues.push(val);
      } else if (targetTreeType === 'RB_TREE') {
        const f = simulateRB(val, logs);
        frames.push(...f);
        logs = f[f.length - 1].logs;
      } else if (targetTreeType === 'BFS_TREE' || targetTreeType === 'DFS_TREE') {
        const f = simulateGraphTree(val, graphValues, logs, targetTreeType === 'BFS_TREE' ? 'BFS' : 'DFS');
        frames.push(...f);
        logs = f[f.length - 1].logs;
        graphValues.push(val);
      }
    }

    setTimeline(frames);
    setCurrentStep(frames.length > 0 ? frames.length - 1 : 0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const isGraph = (t) => t === 'BFS_TREE' || t === 'DFS_TREE';
    const wasGraph = isGraph(prevTreeTypeRef.current);
    const nowGraph = isGraph(treeType);

    if (wasGraph !== nowGraph) {
      handleClear();
    } else {
      rebuildTimeline(treeType, bTreeOrder, splitStrategy);
    }
    prevTreeTypeRef.current = treeType;
  }, [treeType, bTreeOrder, splitStrategy]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(p => { if (p < timeline.length - 1) return p + 1; setIsPlaying(false); return p; });
      }, animationSpeed);
    } else clearInterval(playIntervalRef.current);
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, timeline.length, animationSpeed]);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [currentStep]);

  // ── Simulations ─────────────────────────────────────────────────────────
  const simulateBST = (startRoot, val, prevLogs) => {
    const frames = []; const logs = [...prevLogs];
    logs.push({ text: `─── Insert(${val}) ───`, type: 'normal' });
    const rw = { current: cloneTree(startRoot) };
    const rec = (h, r) => frames.push(new Frame(rw.current, logs, h, r));
    let performedRotation = null;

    const ins = (node, v) => {
      if (!node) { logs.push({ text: `✦ Create Node(${v})`, type: 'normal' }); return new TreeNode(v); }
      logs.push({ text: `Compare ${v} vs ${node.value} → ${v < node.value ? 'left' : 'right'}`, type: 'normal' });
      rec(node.value, null);
      if (v < node.value) { node.left  = ins(node.left,  v); rec(node.value, performedRotation); }
      else if (v > node.value) { node.right = ins(node.right, v); rec(node.value, performedRotation); }
      else { logs.push({ text: `Duplicate ${v} skipped.`, type: 'normal' }); return node; }
      updateHeight(node);
      if (treeType === 'AVL') {
        const bf = getBalance(node);
        if (Math.abs(bf) > 1) { logs.push({ text: `⚡ Imbalance at ${node.value} [BF:${bf}]`, type: 'rotation' }); rec(node.value, `Imbalance at ${node.value} (BF:${bf})`); }
        if (bf >  1 && v < node.left.value)  { performedRotation = `LL Case: Single Right Rotation at ${node.value}`; logs.push({ text: `→ ${performedRotation}`, type: 'rotation' }); return rightRotate(node); }
        if (bf < -1 && v > node.right.value) { performedRotation = `RR Case: Single Left Rotation at ${node.value}`; logs.push({ text: `→ ${performedRotation}`, type: 'rotation' }); return leftRotate(node); }
        if (bf >  1 && v > node.left.value)  { 
          performedRotation = `LR Step 1: Left Rotate child (${node.left.value})`; 
          logs.push({ text: `→ LR Case Step 1: Left Rotation on left child (${node.left.value})`, type: 'rotation' }); 
          node.left = leftRotate(node.left); 
          rec(node.left.value, performedRotation);
          performedRotation = `LR Step 2: Right Rotate node (${node.value})`; 
          logs.push({ text: `→ LR Case Step 2: Right Rotation on node (${node.value})`, type: 'rotation' }); 
          return rightRotate(node); 
        }
        if (bf < -1 && v < node.right.value) { 
          performedRotation = `RL Step 1: Right Rotate child (${node.right.value})`; 
          logs.push({ text: `→ RL Case Step 1: Right Rotation on right child (${node.right.value})`, type: 'rotation' }); 
          node.right = rightRotate(node.right); 
          rec(node.right.value, performedRotation);
          performedRotation = `RL Step 2: Left Rotate node (${node.value})`; 
          logs.push({ text: `→ RL Case Step 2: Left Rotation on node (${node.value})`, type: 'rotation' }); 
          return leftRotate(node); 
        }
      }
      return node;
    };
    rw.current = ins(rw.current, val);
    logs.push({ text: `✓ Insert(${val}) done.`, type: 'normal' });
    rec(val, performedRotation ? `✅ Completed ${performedRotation}` : null);
    return frames;
  };

  const simulateSegTree = (val, prevArr, prevLogs) => {
    const logs = [...prevLogs]; 
    const arr = [...prevArr, val];
    const frames = [];
    
    logs.push({ text: `─── Segment Tree Build for [${arr.join(', ')}] ───`, type: 'normal' });
    
    const buildSkeleton = (l, r) => {
      const n = new TreeNode();
      n.range = `[${l}-${r}]`;
      n.sum = "?";
      n._l = l; n._r = r;
      if (l === r) {
        n.value = arr[l];
        return n;
      }
      const mid = Math.floor((l + r) / 2);
      n.left = buildSkeleton(l, mid);
      n.right = buildSkeleton(mid + 1, r);
      n.value = undefined;
      return n;
    };
    
    const rootSkeleton = buildSkeleton(0, arr.length - 1);
    logs.push({ text: `✦ Initialized segment tree ranges (Divide phase)`, type: 'normal' });
    frames.push(new Frame(rootSkeleton, logs, null, "Divide Phase"));
    
    const animatePostOrder = (node) => {
      if (!node) return;
      if (node._l === node._r) {
        node.sum = arr[node._l];
        node.value = node.sum;
        logs.push({ text: `↳ Leaf range ${node.range} set to ${node.sum}`, type: 'normal' });
        frames.push(new Frame(rootSkeleton, logs, node.range, `Leaf ${node.range} = ${node.sum}`));
        return;
      }
      animatePostOrder(node.left);
      animatePostOrder(node.right);
      
      node.sum = (typeof node.left.sum === 'number' ? node.left.sum : 0) + (typeof node.right.sum === 'number' ? node.right.sum : 0);
      node.value = node.sum;
      logs.push({ text: `↳ Merge ${node.range}: left(${node.left.sum}) + right(${node.right.sum}) = ${node.sum}`, type: 'normal' });
      frames.push(new Frame(rootSkeleton, logs, node.range, `Merged ${node.range}`));
    };
    
    animatePostOrder(rootSkeleton);
    logs.push({ text: `✓ Segment tree build complete. Root sum = ${rootSkeleton.sum}`, type: 'normal' });
    frames.push(new Frame(rootSkeleton, logs, null, null));
    return frames;
  };

  const buildFenwickTree = (arr) => {
    if (!arr || !arr.length) return null;
    const n = arr.length;
    const bit = new Array(n + 1).fill(0);
    const nodes = new Array(n + 1).fill(null);
    for (let i = 1; i <= n; i++) {
      bit[i] += arr[i - 1];
      let p = i + (i & -i);
      if (p <= n) bit[p] += bit[i];
    }
    for (let i = 0; i <= n; i++) {
      nodes[i] = new TreeNode(i === 0 ? "BIT" : arr[i - 1]);
      if (i > 0) nodes[i].sum = bit[i];
      nodes[i].range = i > 0 ? `[${i - (i & -i) + 1}-${i}]` : '0';
      if (i > 0) nodes[i].bitRep = i.toString(2);
      nodes[i].index = i;
    }
    for (let i = 1; i <= n; i++) {
      let p = i - (i & -i);
      nodes[p].children.push(nodes[i]);
    }
    return nodes[0];
  };

  const simulateFenwick = (val, prevArr, prevLogs) => {
    const logs = [...prevLogs]; 
    const arr = [...prevArr, val];
    const n = arr.length;
    const frames = [];
    
    logs.push({ text: `─── Fenwick Tree Insert(${val}) at index ${n} ───`, type: 'normal' });
    
    const finalBit = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
      finalBit[i] += arr[i - 1];
      let p = i + (i & -i);
      if (p <= n) finalBit[p] += finalBit[i];
    }
    
    const updatedIndices = [];
    let c = n;
    while (c <= n) {
      updatedIndices.push(c);
      c += c & -c;
    }
    
    const currentBit = [...finalBit];
    updatedIndices.forEach(idx => { currentBit[idx] -= val; });
    
    const getTreeState = (bitArray) => {
      const nodes = new Array(n + 1).fill(null);
      for (let i = 0; i <= n; i++) {
        nodes[i] = new TreeNode(i === 0 ? "BIT" : arr[i - 1]);
        if (i > 0) nodes[i].sum = bitArray[i];
        nodes[i].range = i > 0 ? `[${i - (i & -i) + 1}-${i}]` : '0';
        if (i > 0) nodes[i].bitRep = i.toString(2);
        nodes[i].index = i;
      }
      for (let i = 1; i <= n; i++) {
        let p = i - (i & -i);
        nodes[p].children.push(nodes[i]);
      }
      return nodes[0];
    };
    
    logs.push({ text: `✦ Attach BIT node ${n} (Range [${n - (n & -n) + 1}-${n}])`, type: 'normal' });
    frames.push(new Frame(getTreeState(currentBit), logs, n, `New BIT node ${n}`));
    
    let curr = n;
    while (curr <= n) {
      currentBit[curr] += val;
      logs.push({ text: `↳ Update BIT[${curr}] += ${val} via LSB jump (+${curr & -curr})`, type: 'normal' });
      frames.push(new Frame(getTreeState(currentBit), logs, curr, `BIT[${curr}] += ${val}`));
      curr += curr & -curr;
    }
    
    logs.push({ text: `✓ Fenwick tree update complete.`, type: 'normal' });
    frames.push(new Frame(getTreeState(currentBit), logs, null, null));
    return frames;
  };

  const buildHeapTree = (arr) => {
    if (!arr || !arr.length) return null;
    const nodes = arr.map(v => new TreeNode(v));
    for (let i = 0; i < arr.length; i++) {
      let leftIdx = 2 * i + 1;
      let rightIdx = 2 * i + 2;
      if (leftIdx < arr.length) nodes[i].left = nodes[leftIdx];
      if (rightIdx < arr.length) nodes[i].right = nodes[rightIdx];
    }
    return nodes[0];
  };

  const simulateHeap = (val, prevArr, prevLogs, isMax = false) => {
    const frames = [];
    const logs = [...prevLogs];
    const arr = [...prevArr, val];
    const heapTypeName = isMax ? 'Max-Heap' : 'Min-Heap';
    logs.push({ text: `─── ${heapTypeName} Insert(${val}) ───`, type: 'normal' });
    logs.push({ text: `Inserted ${val} at end of array (index ${arr.length - 1})`, type: 'normal' });
    frames.push(new Frame(buildHeapTree(arr), logs, val, null));

    let curr = arr.length - 1;
    while (curr > 0) {
      let parent = Math.floor((curr - 1) / 2);
      logs.push({ text: `Comparing ${arr[curr]} with parent ${arr[parent]}`, type: 'normal' });
      frames.push(new Frame(buildHeapTree(arr), logs, arr[curr], null));

      if ((isMax && arr[curr] > arr[parent]) || (!isMax && arr[curr] < arr[parent])) {
        logs.push({ text: `⚡ Swapping ${arr[curr]} and ${arr[parent]} to maintain ${heapTypeName} property`, type: 'rotation' });
        let temp = arr[curr];
        arr[curr] = arr[parent];
        arr[parent] = temp;
        frames.push(new Frame(buildHeapTree(arr), logs, arr[parent], `Swapped ${arr[curr]} & ${arr[parent]}`));
        curr = parent;
      } else {
        logs.push({ text: `✓ Heap property satisfied.`, type: 'normal' });
        break;
      }
    }
    frames.push(new Frame(buildHeapTree(arr), logs, val, null));
    return { frames, finalArr: arr };
  };

  const simulateHeapDelete = (prevArr, prevLogs, isMax = false) => {
    const frames = [];
    const logs = [...prevLogs];
    if (!prevArr.length) return { frames, finalArr: [] };
    const arr = [...prevArr];
    const heapTypeName = isMax ? 'Max-Heap' : 'Min-Heap';
    const extracted = arr[0];
    logs.push({ text: `─── Extract Root (${extracted}) ───`, type: 'normal' });

    if (arr.length === 1) {
      logs.push({ text: `Extracted ${extracted}. Heap is now empty.`, type: 'normal' });
      frames.push(new Frame(null, logs, null, null));
      return { frames, finalArr: [] };
    }

    const lastVal = arr.pop();
    arr[0] = lastVal;
    logs.push({ text: `Replaced root with last element (${lastVal})`, type: 'normal' });
    frames.push(new Frame(buildHeapTree(arr), logs, lastVal, null));

    let curr = 0;
    while (true) {
      let left = 2 * curr + 1;
      let right = 2 * curr + 2;
      let target = curr;

      if (left < arr.length && ((isMax && arr[left] > arr[target]) || (!isMax && arr[left] < arr[target]))) {
        target = left;
      }
      if (right < arr.length && ((isMax && arr[right] > arr[target]) || (!isMax && arr[right] < arr[target]))) {
        target = right;
      }

      if (target !== curr) {
        logs.push({ text: `⚡ Swapping ${arr[curr]} with ${arr[target]} to bubble down`, type: 'rotation' });
        let temp = arr[curr];
        arr[curr] = arr[target];
        arr[target] = temp;
        frames.push(new Frame(buildHeapTree(arr), logs, arr[target], `Swapped ${arr[curr]} & ${arr[target]}`));
        curr = target;
      } else {
        logs.push({ text: `✓ Heapification complete.`, type: 'normal' });
        break;
      }
    }
    frames.push(new Frame(buildHeapTree(arr), logs, null, null));
    return { frames, finalArr: arr };
  };

  const simulateGraphTree = (newVal, prevValues, prevLogs, type) => {
    const logs = [...prevLogs];
    const vals = [...prevValues, newVal];
    logs.push({ text: `Added input/edge: ${newVal}`, type: 'normal' });
    
    const adj = {};
    let firstNode = null;
    vals.forEach(v => {
      if (typeof v === 'string' && v.includes('-')) {
        const [u, w] = v.split('-');
        const cleanU = u.trim(), cleanW = w.trim();
        if (!firstNode) firstNode = cleanU;
        if (!adj[cleanU]) adj[cleanU] = [];
        if (!adj[cleanW]) adj[cleanW] = [];
        adj[cleanU].push(cleanW);
        adj[cleanW].push(cleanU); // undirected
      } else if (v !== undefined && v !== null) {
        const s = v.toString().trim();
        if (s) {
          if (!firstNode) firstNode = s;
          if (!adj[s]) adj[s] = [];
        }
      }
    });
    
    if (!firstNode) return [new Frame(null, logs, null, null)];
    
    const frames = [];
    const rootNode = new TreeNode(firstNode);
    const visited = new Set([firstNode]);
    const nodeMap = { [firstNode]: rootNode };
    
    logs.push({ text: `✦ Initialize ${type} Spanning Tree root: ${firstNode}`, type: 'normal' });
    frames.push(new Frame(rootNode, logs, firstNode, `Start at root ${firstNode}`));
    
    if (type === 'BFS') {
      let queue = [firstNode];
      while (queue.length > 0) {
        let curr = queue.shift();
        let currNode = nodeMap[curr];
        if (adj[curr]) {
          let nbrs = [...new Set(adj[curr])].sort();
          for (let neighbor of nbrs) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              let child = new TreeNode(neighbor);
              nodeMap[neighbor] = child;
              currNode.children.push(child);
              queue.push(neighbor);
              
              logs.push({ text: `↳ Discovered ${neighbor} from ${curr}`, type: 'normal' });
              frames.push(new Frame(rootNode, logs, neighbor, `BFS edge: ${curr} → ${neighbor}`));
            }
          }
        }
      }
    } else { // DFS
      const dfs = (curr, currNode) => {
        if (!adj[curr]) return;
        let nbrs = [...new Set(adj[curr])].sort();
        for (let neighbor of nbrs) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            let child = new TreeNode(neighbor);
            nodeMap[neighbor] = child;
            currNode.children.push(child);
            
            logs.push({ text: `↳ Explored ${neighbor} from ${curr}`, type: 'normal' });
            frames.push(new Frame(rootNode, logs, neighbor, `DFS path: ${curr} → ${neighbor}`));
            
            dfs(neighbor, child);
          }
        }
      };
      dfs(firstNode, rootNode);
    }
    
    logs.push({ text: `✓ Completed ${type} Spanning Tree construction`, type: 'normal' });
    frames.push(new Frame(rootNode, logs, null, null));
    return frames;
  };

  const simulateRB = (val, prevLogs) => {
    const logs = [...prevLogs];
    logs.push({ text: `─── RB-Tree Insert(${val}) ───`, type: 'normal' });
    const root = rbEngineRef.current.insert(val, logs, null);
    logs.push({ text: `✓ Tree recolored & balanced.`, type: 'normal' });
    return [new Frame(root, logs, val, null)];
  };

  const simulateBSTDelete = (startRoot, val, prevLogs) => {
    const frames = []; const logs = [...prevLogs];
    logs.push({ text: `─── Delete(${val}) ───`, type: 'normal' });
    const rw = { current: cloneTree(startRoot) };
    const rec = (h, r) => frames.push(new Frame(rw.current, logs, h, r));
    let performedRotation = null;

    const minNode = (node) => {
      let current = node;
      while (current.left !== null) current = current.left;
      return current;
    };
    
    const maxNode = (node) => {
      let current = node;
      while (current.right !== null) current = current.right;
      return current;
    };

    const del = (node, v) => {
      if (!node) { logs.push({ text: `Value ${v} not found.`, type: 'normal' }); return null; }
      logs.push({ text: `Compare ${v} vs ${node.value} → ${v < node.value ? 'left' : v > node.value ? 'right' : 'found'}`, type: 'normal' });
      rec(node.value, null);
      if (v < node.value) { node.left = del(node.left, v); rec(node.value, performedRotation); }
      else if (v > node.value) { node.right = del(node.right, v); rec(node.value, performedRotation); }
      else {
        logs.push({ text: `Deleting node ${node.value}`, type: 'normal' });
        if (!node.left && !node.right) { return null; }
        if (!node.left) { return node.right; }
        if (!node.right) { return node.left; }
        
        if (deleteStrategy === 'RIGHT') {
          const temp = minNode(node.right);
          logs.push({ text: `Right Shift: Replacing with inorder successor ${temp.value}`, type: 'normal' });
          node.value = temp.value;
          node.right = del(node.right, temp.value);
        } else {
          const temp = maxNode(node.left);
          logs.push({ text: `Left Shift: Replacing with inorder predecessor ${temp.value}`, type: 'normal' });
          node.value = temp.value;
          node.left = del(node.left, temp.value);
        }
        rec(node.value, performedRotation);
      }
      updateHeight(node);
      if (treeType === 'AVL') {
        const bf = getBalance(node);
        if (Math.abs(bf) > 1) { logs.push({ text: `⚡ Imbalance at ${node.value} [BF:${bf}]`, type: 'rotation' }); rec(node.value, `Imbalance at ${node.value} (BF:${bf})`); }
        if (bf >  1 && getBalance(node.left) >= 0)  { performedRotation = `LL Case: Single Right Rotation at ${node.value}`; logs.push({ text: `→ ${performedRotation}`, type: 'rotation' }); return rightRotate(node); }
        if (bf >  1 && getBalance(node.left) < 0)   { 
          performedRotation = `LR Step 1: Left Rotate child (${node.left.value})`; 
          logs.push({ text: `→ LR Case Step 1: Left Rotation on left child (${node.left.value})`, type: 'rotation' }); 
          node.left = leftRotate(node.left); 
          rec(node.left.value, performedRotation);
          performedRotation = `LR Step 2: Right Rotate node (${node.value})`; 
          logs.push({ text: `→ LR Case Step 2: Right Rotation on node (${node.value})`, type: 'rotation' }); 
          return rightRotate(node); 
        }
        if (bf < -1 && getBalance(node.right) <= 0) { performedRotation = `RR Case: Single Left Rotation at ${node.value}`; logs.push({ text: `→ ${performedRotation}`, type: 'rotation' }); return leftRotate(node); }
        if (bf < -1 && getBalance(node.right) > 0)  { 
          performedRotation = `RL Step 1: Right Rotate child (${node.right.value})`; 
          logs.push({ text: `→ RL Case Step 1: Right Rotation on right child (${node.right.value})`, type: 'rotation' }); 
          node.right = rightRotate(node.right); 
          rec(node.right.value, performedRotation);
          performedRotation = `RL Step 2: Left Rotate node (${node.value})`; 
          logs.push({ text: `→ RL Case Step 2: Left Rotation on node (${node.value})`, type: 'rotation' }); 
          return leftRotate(node); 
        }
      }
      return node;
    };
    rw.current = del(rw.current, val);
    logs.push({ text: `✓ Delete(${val}) done.`, type: 'normal' });
    rec(val, performedRotation ? `✅ Completed ${performedRotation}` : null);
    return frames;
  };

  const handleInsert = () => {
    let val = inputValue.trim();
    if (treeType !== 'BFS_TREE' && treeType !== 'DFS_TREE') {
      val = parseInt(val);
      if (isNaN(val)) return;
    } else if (!val) return;

    const prev = timeline.length > 0 ? timeline[timeline.length - 1] : new Frame(null, [], null, null);
    let frames = [];
    let newArr = null;

    if (treeType === 'BST' || treeType === 'AVL') {
      frames = simulateBST(prev.root, val, prev.logs);
    } else if (treeType === 'B_TREE' || treeType === 'B_PLUS_TREE') {
      const logs = [...prev.logs];
      logs.push({ text: `─── ${treeType === 'B_PLUS_TREE' ? 'B+ Tree' : 'B-Tree'} Insert(${val}) ───`, type: 'normal' });
      const rec = (h, r) => { const t = treeType === 'B_TREE' ? bTreeRef.current : bPlusTreeRef.current; frames.push(new Frame(t.root, logs, h, r)); };
      if (treeType === 'B_TREE') bTreeRef.current.insert(val, logs, rec);
      else bPlusTreeRef.current.insert(val, logs, rec);
      rec(val, null);
    } else if (treeType === 'SEGMENT_TREE') {
      frames = simulateSegTree(val, insertedValues, prev.logs);
    } else if (treeType === 'FENWICK_TREE') {
      frames = simulateFenwick(val, insertedValues, prev.logs);
    } else if (treeType === 'MIN_HEAP' || treeType === 'MAX_HEAP') {
      const res = simulateHeap(val, insertedValues, prev.logs, treeType === 'MAX_HEAP');
      frames = res.frames;
      newArr = res.finalArr;
    } else if (treeType === 'RB_TREE') {
      frames = simulateRB(val, prev.logs);
    } else if (treeType === 'BFS_TREE' || treeType === 'DFS_TREE') {
      frames = simulateGraphTree(val, insertedValues, prev.logs, treeType === 'BFS_TREE' ? 'BFS' : 'DFS');
    }

    if (newArr) {
      setInsertedValues(newArr);
    } else {
      setInsertedValues(p => [...p, val]);
    }
    setOperationsLog(p => [...p, { op: 'insert', val }]);
    setTimeline(p => [...p, ...frames]);
    setInputValue('');
    setIsPlaying(true);
  };

  const handleDelete = () => {
    if (treeType === 'MIN_HEAP' || treeType === 'MAX_HEAP') {
      const prev = timeline.length > 0 ? timeline[timeline.length - 1] : new Frame(null, [], null, null);
      const res = simulateHeapDelete(insertedValues, prev.logs, treeType === 'MAX_HEAP');
      if (!res.frames.length) return;
      setInsertedValues(res.finalArr);
      setOperationsLog(p => [...p, { op: 'delete', val: 'root' }]);
      setTimeline(p => [...p, ...res.frames]);
      setInputValue('');
      setIsPlaying(true);
      return;
    }

    const val = parseInt(inputValue);
    if (isNaN(val)) return;
    const prev = timeline.length > 0 ? timeline[timeline.length - 1] : new Frame(null, [], null, null);
    let frames = [];

    if (treeType === 'BST' || treeType === 'AVL') {
      frames = simulateBSTDelete(prev.root, val, prev.logs);
    } else {
      alert('Deletion is currently supported for BST, AVL, and Heap trees.');
      return;
    }

    setInsertedValues(p => p.filter(v => v !== val));
    setOperationsLog(p => [...p, { op: 'delete', val }]);
    setTimeline(p => [...p, ...frames]);
    setInputValue('');
    setIsPlaying(true);
  };

  const analyzeCode = (jumpToEnd = false) => {
    if (!customCode.trim()) { setAnalysisResult({ type: 'error', message: 'Please paste some code first.' }); return; }
    setAnalysisResult({ type: 'loading', message: '⏳ Analyzing & compiling...' });
    setTimeout(() => {
      const errors = validateCode(customCode, codeLang);
      let nums = [];
      const re = /(?:insert|Node|push|append)\s*\([^)]*?(-?\d+)\s*\)/g; let m;
      while ((m = re.exec(customCode)) !== null) nums.push(parseInt(m[1]));
      if (!nums.length) { const am = customCode.match(/[\[{]\s*((?:-?\d+\s*,\s*)*-?\d+)\s*[\]}]/); if (am) nums = am[1].split(',').map(n => parseInt(n.trim())); }
      if (errors.length) {
        setAnalysisResult({ type: 'error', message: `Found ${errors.length} issue(s):\n${errors.join('\n')}` });
      } else {
        setAnalysisResult({ type: 'success', message: `✅ Syntax OK for ${codeLang}\n${nums.length ? `\n🌳 Detected ${nums.length} insertion(s) — visualizing!` : '\nNo tree insertions detected.'}` });
        if (nums.length) { 
          let frames=[],logs=[],arr=[],curRoot=null; bTreeRef.current=new BTreeEngine(bTreeOrder,false,splitStrategy); bPlusTreeRef.current=new BTreeEngine(bTreeOrder,true,splitStrategy); rbEngineRef.current=new RBEngine(); 
          let heapArr = [];
          for(const val of nums){if(isNaN(val))continue;if(treeType==='MIN_HEAP'||treeType==='MAX_HEAP'){const res=simulateHeap(val,heapArr,logs,treeType==='MAX_HEAP');frames.push(...res.frames);heapArr=res.finalArr;logs=res.frames[res.frames.length-1].logs;}else{arr.push(val);if(treeType==='BST'||treeType==='AVL'){const f=simulateBST(curRoot,val,logs);frames.push(...f);curRoot=f[f.length-1].root;logs=f[f.length-1].logs;}else if(treeType==='B_TREE'||treeType==='B_PLUS_TREE'){logs.push({text:`Insert(${val})`,type:'normal'});const rec=(h,r)=>{const t=treeType==='B_TREE'?bTreeRef.current:bPlusTreeRef.current;frames.push(new Frame(t.root,logs,h,r));};if(treeType==='B_TREE')bTreeRef.current.insert(val,logs,rec);else bPlusTreeRef.current.insert(val,logs,rec);rec(val,null);}else if(treeType==='SEGMENT_TREE'){const f=simulateSegTree(val,arr.slice(0,-1),logs);frames.push(...f);curRoot=f[f.length-1].root;logs=f[f.length-1].logs;}else if(treeType==='FENWICK_TREE'){const f=simulateFenwick(val,arr.slice(0,-1),logs);frames.push(...f);curRoot=f[f.length-1].root;logs=f[f.length-1].logs;}else if(treeType==='RB_TREE'){const f=simulateRB(val,logs);frames.push(...f);logs=f[f.length-1].logs;}}}
          setInsertedValues(treeType==='MIN_HEAP'||treeType==='MAX_HEAP'?heapArr:arr);setTimeline(frames);
          if (jumpToEnd === true) {
             setCurrentStep(frames.length - 1);
             setIsPlaying(false);
          } else {
             setCurrentStep(0);
             setIsPlaying(true); 
          }
        }
      }
    }, 600);
  };

  // ── Layout & SVG ──────────────────────────────────────────────────────
  const NODE_R = 28;

  const getNodeDimensions = (node) => {
    if (!node) return { w: 56, h: 56 };
    const isBT = node.keys?.length > 0 && !node.range && node.value === undefined;
    const isSeg = !!node.range;
    if (isBT) {
      const kw = Math.max(70, node.keys.length * 42 + 20);
      return { w: kw, h: 38 };
    }
    if (isSeg) {
      const showBits = treeType === 'FENWICK_TREE' && fenwickBitMode && node.bitRep;
      return { w: 80, h: showBits ? 66 : 54 };
    }
    return { w: 56, h: 56 };
  };

  const getChildNodes = (node) => {
    if (!node) return [];
    if (treeType === 'BFS_TREE' || treeType === 'DFS_TREE' || treeType === 'B_TREE' || treeType === 'B_PLUS_TREE') {
      return (node.children || []).filter(Boolean);
    }
    if (node.children && node.children.length > 0) {
      return node.children.filter(Boolean);
    }
    return [node.left, node.right].filter(Boolean);
  };

  const computeLayout = (rootNode) => {
    if (!rootNode) return;
    const containerW = containerRef.current ? Math.max(containerRef.current.clientWidth - 40, 700) : 900;
    
    // 1. HEAP TREE LAYOUT
    if (treeType === 'MIN_HEAP' || treeType === 'MAX_HEAP') {
      const queue = [rootNode];
      const nodes = [];
      while (queue.length > 0) {
        const curr = queue.shift();
        nodes.push(curr);
        if (curr.left) queue.push(curr.left);
        if (curr.right) queue.push(curr.right);
      }
      const n = nodes.length;
      const levels = Math.floor(Math.log2(n)) + 1;
      const maxNodesAtBottom = Math.pow(2, levels - 1);
      const minStep = 68;
      const reqW = Math.max(containerW, maxNodesAtBottom * minStep + 80);
      
      const paddingY = 60;
      const paddingX = 40;
      const usableWidth = reqW - 2 * paddingX;
      
      for (let i = 0; i < n; i++) {
        const level = Math.floor(Math.log2(i + 1));
        const levelNodes = Math.pow(2, level);
        const levelIndex = i - (levelNodes - 1);
        
        nodes[i].y = paddingY + level * 88;
        nodes[i].x = paddingX + (usableWidth / levelNodes) * (levelIndex + 0.5);
      }
      return;
    }

    // 2. B-TREE, B+ TREE, BFS, DFS SPANNING TREES (Dynamic Partition Layout to preserve layout style)
    if (treeType === 'B_TREE' || treeType === 'B_PLUS_TREE' || treeType === 'BFS_TREE' || treeType === 'DFS_TREE') {
      const getTreeDepthAndWidth = (node) => {
        let maxDepth = 0;
        const levelCounts = {};
        const traverse = (n, d) => {
          if (!n) return;
          maxDepth = Math.max(maxDepth, d);
          levelCounts[d] = (levelCounts[d] || 0) + 1;
          const kids = getChildNodes(n);
          kids.forEach(c => traverse(c, d + 1));
        };
        traverse(node, 0);
        const maxW = Math.max(...Object.values(levelCounts), 1);
        return { depth: maxDepth, maxW };
      };
      
      const { maxW } = getTreeDepthAndWidth(rootNode);
      const isBT = treeType === 'B_TREE' || treeType === 'B_PLUS_TREE';
      const nodeStep = isBT ? 140 : 80;
      const reqW = Math.max(containerW, maxW * nodeStep + 80);
      
      const layout = (n, d, l, r) => {
        if (!n) return;
        n.x = (l + r) / 2;
        n.y = d * 95 + 60;
        const kids = getChildNodes(n);
        if (kids.length > 0) {
          const sp = r - l;
          const st = sp / kids.length;
          kids.forEach((c, i) => layout(c, d + 1, l + i * st, l + (i + 1) * st));
        }
      };
      layout(rootNode, 0, 40, reqW - 40);
      return;
    }

    // 3. BINARY SEARCH, AVL, RED-BLACK, SEGMENT, FENWICK TREES (Dynamic In-order based spacious layout)
    let ctr = 0;
    const idx = n => {
      if (!n) return;
      idx(n.left);
      n._xi = ctr++;
      idx(n.right);
    };
    idx(rootNode);

    const sep = Math.max(58, Math.min(80, (containerW - 60) / Math.max(ctr, 1)));
    const sx = Math.max(45, (containerW - (ctr - 1) * sep) / 2);

    const pos = (n, d) => {
      if (!n) return;
      n.x = sx + (n._xi || 0) * sep;
      n.y = d * 88 + 60;
      pos(n.left, d + 1);
      pos(n.right, d + 1);
    };
    pos(rootNode, 0);
  };

  const getTraversals = (rootNode) => {
    const pre = [], inO = [], post = [];
    const traverse = (node) => {
      if (!node) return;
      if (node.value !== undefined) {
        pre.push(node.value);
        traverse(node.left);
        inO.push(node.value);
        traverse(node.right);
        post.push(node.value);
      }
    };
    traverse(rootNode);
    return { preorder: pre.join(' · '), inorder: inO.join(' · '), postorder: post.join(' · ') };
  };

  const renderTreeSVG = (rootNode, highlightedNode) => {
    if (!rootNode) return null;
    computeLayout(rootNode);
    const theme = THEMES[currentTheme] || THEMES['Neon Cyberpunk'];
    const c1 = theme['--node-fill-1'] || '#3b82f6';
    const c2 = theme['--node-fill-2'] || '#8b5cf6';

    const assignStableKeys = (root) => {
      const keysMap = new Map();
      const occurrences = {};
      let idCounter = 0;
      
      const traverse = (n) => {
        if (!n) return;
        const id = idCounter++;
        let key = `fallback-${id}`;
        
        if (n.keys && n.keys.length > 0) {
          key = `key-${n.keys.join(',')}`;
        } else if (n.range) {
          key = `range-${n.range}`;
        } else if (n.index !== null && n.index !== undefined) {
          key = `index-${n.index}`;
        } else if (n.value !== undefined && n.value !== null) {
          const valStr = String(n.value);
          occurrences[valStr] = (occurrences[valStr] || 0) + 1;
          const count = occurrences[valStr] - 1;
          key = `val-${valStr}-${count}`;
        }
        
        keysMap.set(n, key);
        
        const kids = getChildNodes(n);
        kids.forEach(traverse);
      };
      
      traverse(root);
      return keysMap;
    };

    const collectPositions = (node) => {
      const posMap = {};
      if (!node) return posMap;
      const keysMap = assignStableKeys(node);
      keysMap.forEach((key, n) => {
        posMap[key] = { x: n.x, y: n.y };
      });
      return posMap;
    };

    const transitionArrows = [];
    const timelineChanged = prevTimelineRef.current !== timeline;
    const isConsecutive = Math.abs(currentStep - prevStepRef.current) === 1 && !timelineChanged;

    if (isConsecutive && prevStepRef.current >= 0 && prevStepRef.current < timeline.length && timeline[prevStepRef.current]) {
      const prevRoot = timeline[prevStepRef.current].root;
      const prevPositions = collectPositions(prevRoot);
      const currentPositions = collectPositions(rootNode);
      const seenTransitions = new Set();
      Object.entries(currentPositions).forEach(([id, newPos]) => {
        const oldPos = prevPositions[id];
        if (oldPos && (oldPos.x !== newPos.x || oldPos.y !== newPos.y)) {
          const key = `${oldPos.x},${oldPos.y}->${newPos.x},${newPos.y}`;
          if (!seenTransitions.has(key)) {
            seenTransitions.add(key);
            transitionArrows.push({ x1: oldPos.x, y1: oldPos.y, x2: newPos.x, y2: newPos.y });
          }
        }
      });
    }

    const stableKeysMap = assignStableKeys(rootNode);
    const allNodes = [], allEdges = [];
    const collect = node => {
      if (!node) return;
      const currentKey = stableKeysMap.get(node);
      const kids = getChildNodes(node);
      kids.forEach(child => { 
        const childKey = stableKeysMap.get(child);
        const edgeKey = currentKey < childKey ? `e-${currentKey}-${childKey}` : `e-${childKey}-${currentKey}`;
        allEdges.push({ id: edgeKey, x1: node.x, y1: node.y, x2: child.x, y2: child.y, parentNode: node, childNode: child }); 
        collect(child); 
      });
      const isHL = highlightedNode === node.value || (node.keys?.includes(highlightedNode)) || (highlightedNode && highlightedNode === node.range) || (highlightedNode && highlightedNode === node.index);
      allNodes.push({ node, key: currentKey, isHL });
    };
    collect(rootNode);

    if (!allNodes.length) return null;
    const maxRight = Math.max(...allNodes.map(n => n.node.x + getNodeDimensions(n.node).w / 2));
    const maxBottom = Math.max(...allNodes.map(n => n.node.y + getNodeDimensions(n.node).h / 2));
    const containerW = containerRef.current ? Math.max(containerRef.current.clientWidth - 40, 700) : 900;
    
    const svgW = Math.max(containerW, maxRight + 50);
    const svgH = Math.max(300, maxBottom + 50);

    return (
      <svg width={svgW} height={svgH} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="ng"  x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient>
          <linearGradient id="nhl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/></linearGradient>
          <linearGradient id="rbr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#b91c1c"/></linearGradient>
          <linearGradient id="rbb" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#374151"/><stop offset="100%" stopColor="#111827"/></linearGradient>
          <linearGradient id="sg"  x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
          <marker id="arrow-cw" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#ef4444" />
          </marker>
          <marker id="arrow-ccw" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#3b82f6" />
          </marker>
          <marker id="transition-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="var(--accent-secondary)" />
          </marker>
          <style>{`
            @keyframes flowDashCw { to { stroke-dashoffset: -14; } }
            @keyframes flowDashCcw { to { stroke-dashoffset: 14; } }
          `}</style>
        </defs>
        <g>{allEdges.map(e => {
          const parentNode = e.parentNode;
          const childNode = e.childNode;
          
          let x1_val = e.x1, y1_val = e.y1;
          let x2_val = e.x2, y2_val = e.y2;
          
          if (parentNode && childNode) {
            const pDim = getNodeDimensions(parentNode);
            const cDim = getNodeDimensions(childNode);
            const dx = e.x2 - e.x1;
            const dy = e.y2 - e.y1;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            if (parentNode.keys?.length > 0 || parentNode.range) {
              y1_val = e.y1 + pDim.h / 2;
              x1_val = e.x1;
            } else {
              x1_val = e.x1 + (dx / dist) * NODE_R;
              y1_val = e.y1 + (dy / dist) * NODE_R;
            }
            
            if (childNode.keys?.length > 0 || childNode.range) {
              y2_val = e.y2 - cDim.h / 2;
              x2_val = e.x2;
            } else {
              x2_val = e.x2 - (dx / dist) * NODE_R;
              y2_val = e.y2 - (dy / dist) * NODE_R;
            }
          }

          return (
            <line 
              key={e.id} 
              x1={x1_val} 
              y1={y1_val} 
              x2={x2_val} 
              y2={y2_val} 
              stroke="var(--edge-color, rgba(99,140,250,0.45))" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
          );
        })}</g>
        {/* Curved animated transition arrows for shifting nodes */}
        <g>
          {transitionArrows.map((arrow, idx) => {
            const dx = arrow.x2 - arrow.x1;
            const dy = arrow.y2 - arrow.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 5) return null;
            const rStart = 16;
            const rEnd = 22;
            const x1_adj = arrow.x1 + (dx / len) * rStart;
            const y1_adj = arrow.y1 + (dy / len) * rStart;
            const x2_adj = arrow.x2 - (dx / len) * rEnd;
            const y2_adj = arrow.y2 - (dy / len) * rEnd;
            const px = -dy / len;
            const py = dx / len;
            const offset = 22;
            const cx = (x1_adj + x2_adj) / 2 + px * offset;
            const cy = (y1_adj + y2_adj) / 2 + py * offset;
            const pathD = `M ${x1_adj} ${y1_adj} Q ${cx} ${cy} ${x2_adj} ${y2_adj}`;
            return (
              <g key={`trans-${idx}`}>
                <path d={pathD} fill="none" stroke="var(--accent-secondary)" strokeWidth="4" opacity="0.25" strokeLinecap="round" />
                <path d={pathD} fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" markerEnd="url(#transition-arrow)" style={{ animation: 'flowDashCw 0.8s infinite linear', opacity: 0.85 }} />
              </g>
            );
          })}
        </g>
        <g>
          {allNodes.map(({ node, key, isHL }) => {
            const isBT  = node.keys?.length > 0 && !node.range && node.value === undefined;
            const isSeg = !!node.range;
            const fill  = isHL ? 'url(#nhl)' : node._color === 'RED' ? 'url(#rbr)' : node._color === 'BLACK' ? 'url(#rbb)' : isSeg ? 'url(#sg)' : 'url(#ng)';
            const glow  = isHL ? 'rgba(245,158,11,0.55)' : 'rgba(99,102,241,0.4)';

            if (isBT) {
              const kw = Math.max(70, node.keys.length * 42 + 20);
              return <g key={key} transform={`translate(${node.x}, ${node.y})`}>
                <rect x={-kw/2} y={-19} width={kw} height={38} rx={12} fill={fill} stroke={isHL?'rgba(245,158,11,0.9)':'rgba(255,255,255,0.2)'} strokeWidth="2" style={{filter:`drop-shadow(0 3px 12px ${glow})`}}/>
                {node.keys.slice(0,-1).map((_,ki)=><line key={ki} x1={-kw/2+(ki+1)*(kw/node.keys.length)} y1={-14} x2={-kw/2+(ki+1)*(kw/node.keys.length)} y2={14} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>)}
                <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="900" fill="#ffffff" fontFamily="sans-serif" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' }}>{node.keys.join(' | ')}</text>
              </g>;
            }
            if (isSeg) {
              const isFenwick = treeType === 'FENWICK_TREE';
              const showBits = isFenwick && fenwickBitMode && node.bitRep;
              const rh = showBits ? 66 : 54;
              const ry = showBits ? -33 : -27;
              return <g key={key} transform={`translate(${node.x}, ${node.y})`}>
                <rect x={-40} y={ry} width={80} height={rh} rx={12} fill={fill} stroke={isHL?'rgba(245,158,11,0.9)':'rgba(255,255,255,0.2)'} strokeWidth="2" style={{filter:`drop-shadow(0 3px 12px ${glow})`}}/>
                <text x={0} y={showBits ? -16 : -8} textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="900" fill="#ffffff" fontFamily="sans-serif" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))' }}>{node.sum}</text>
                <text x={0} y={showBits ? 2 : 12} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="rgba(255,255,255,0.85)" fontFamily="monospace" fontWeight="700">{node.range}</text>
                {showBits && (
                  <text x={0} y={20} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="bold" fill="var(--accent-primary)" fontFamily="monospace">
                    ({node.bitRep})₂
                  </text>
                )}
              </g>;
            }

            const isTargetRotated = frame.rotation && (() => {
              const match = frame.rotation.match(/(?:at|\(|child \()\s*(-?\d+)\s*\)?/);
              return match && parseInt(match[1]) === node.value;
            })();
            const isRightRot = isTargetRotated && frame.rotation.includes("Right Rotate");
            const isLeftRot = isTargetRotated && frame.rotation.includes("Left Rotate");

            return <g key={key} transform={`translate(${node.x}, ${node.y})`}>
              <circle cx={0} cy={0} r={isHL ? NODE_R * 1.12 : NODE_R} fill={fill} stroke={isHL?'rgba(245,158,11,0.85)':'rgba(255,255,255,0.18)'} strokeWidth="1.5" style={{filter:`drop-shadow(0 3px 14px ${glow})`, transition: 'r 0.3s ease'}}/>
              <text x={0} y={1} textAnchor="middle" dominantBaseline="central" fontSize={String(node.value??'').length > 3 ? '12' : String(node.value??'').length > 2 ? '14' : '17'} fontWeight="900" fill="#ffffff" fontFamily="sans-serif" style={{ pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}>{String(node.value??'')}</text>
              {treeType==='AVL'&&<text x={0} y={-NODE_R-7} textAnchor="middle" fontSize="10" fill="#a78bfa" fontFamily="monospace">BF:{getBalance(node)}</text>}
              {treeType==='RB_TREE'&&node._color&&<circle cx={NODE_R-7} cy={-NODE_R+7} r={5} fill={node._color==='RED'?'#ef4444':'#1f2937'} stroke="white" strokeWidth="1"/>}
              {isRightRot && (
                <g>
                  <path d="M -35 -12 A 38 38 0 0 1 35 -2" fill="none" stroke="#ef4444" strokeWidth="3.5" markerEnd="url(#arrow-cw)" strokeLinecap="round" strokeDasharray="8 6" style={{ animation: 'flowDashCw 0.6s infinite linear' }} />
                  <text x={42} y={-18} fill="#ef4444" fontSize="13" fontWeight="900" fontFamily="sans-serif" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))' }}>↻ Right Rotate</text>
                </g>
              )}
              {isLeftRot && (
                <g>
                  <path d="M 35 -12 A 38 38 0 0 0 -35 -2" fill="none" stroke="#3b82f6" strokeWidth="3.5" markerEnd="url(#arrow-ccw)" strokeLinecap="round" strokeDasharray="8 6" style={{ animation: 'flowDashCcw 0.6s infinite linear' }} />
                  <text x={-42} y={-18} textAnchor="end" fill="#3b82f6" fontSize="13" fontWeight="900" fontFamily="sans-serif" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9))' }}>↺ Left Rotate</text>
                </g>
              )}
            </g>;
          })}
        </g>
      </svg>
    );
  };

  // ── Settings Modal ─────────────────────────────────────────────────────
  const renderSettingsModal = () => {
    const filteredThemes = Object.entries(THEMES).filter(([_, th]) => th.type === themeMode);

    return (
      <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
        <div className="modal-content" style={{ maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }} onClick={e => e.stopPropagation()}>
          <h2 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⚙ Settings</h2>

          <div className="select-group" style={{ marginBottom: '0.6rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>🌓 Theme Mode</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button 
                onClick={() => {
                  setThemeMode('dark');
                  if (THEMES[currentTheme]?.type !== 'dark') {
                    setCurrentTheme('Neon Cyberpunk');
                  }
                }}
                style={{
                  flex: 1, padding: '0.55rem', borderRadius: '10px', 
                  border: `2px solid ${themeMode === 'dark' ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                  background: themeMode === 'dark' ? 'rgba(59,130,246,0.15)' : 'var(--glass-bg)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', fontSize: '0.9rem'
                }}
              >
                🌙 Dark Mode
              </button>
              <button 
                onClick={() => {
                  setThemeMode('light');
                  if (THEMES[currentTheme]?.type !== 'light') {
                    setCurrentTheme('Arctic Frost');
                  }
                }}
                style={{
                  flex: 1, padding: '0.55rem', borderRadius: '10px', 
                  border: `2px solid ${themeMode === 'light' ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                  background: themeMode === 'light' ? 'rgba(59,130,246,0.15)' : 'var(--glass-bg)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', fontSize: '0.9rem'
                }}
              >
                ☀️ Light Mode
              </button>
            </div>
          </div>

          <div className="select-group" style={{ marginBottom: '0.6rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>🎨 Select Theme</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '4px' }}>
              {filteredThemes.map(([name, th]) => (
                <button key={name} onClick={() => setCurrentTheme(name)}
                  style={{ padding: '0.5rem 0.65rem', borderRadius: '10px', border: `2px solid ${currentTheme === name ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: currentTheme === name ? 'rgba(59,130,246,0.12)' : 'var(--glass-bg)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: currentTheme === name ? 700 : 400, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: th['--accent-primary'], flexShrink: 0, boxShadow: `0 0 5px ${th['--accent-primary']}` }} />
                  <span>{name}</span>
                  {currentTheme === name && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--accent-primary)' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="select-group" style={{ marginBottom: '0.6rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>📝 Editor Font Size</label>
            <select className="styled-select" value={editorFontSize} onChange={e => setEditorFontSize(Number(e.target.value))} style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
              <option value={12}>Small (12px)</option>
              <option value={14}>Medium (14px)</option>
              <option value={16}>Large (16px)</option>
              <option value={18}>Extra Large (18px)</option>
              <option value={20}>Double XL (20px)</option>
              <option value={22}>Huge (22px)</option>
              <option value={24}>Colossal (24px)</option>
              <option value={28}>Giant (28px)</option>
              <option value={32}>Extreme (32px)</option>
              <option value={36}>Mega (36px)</option>
              <option value={40}>Hyper (40px)</option>
            </select>
          </div>

          <div className="select-group" style={{ marginBottom: '0.6rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>↩ Editor Word Wrap</label>
            <select className="styled-select" value={editorWordWrap} onChange={e => setEditorWordWrap(e.target.value)} style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
              <option value="off">Off (Horizontal Scroll)</option>
              <option value="on">On (Wrap to Viewport)</option>
            </select>
          </div>

          <div className="select-group" style={{ marginBottom: '0.6rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.8rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              📥 Install Application (PWA)
            </label>
            {(typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone)) ? (
              <div style={{
                padding: '0.65rem 0.85rem', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ color: '#10b981', fontSize: '1.1rem' }}>✓</span>
                <span>App is running in Standalone Desktop/Mobile Mode</span>
              </div>
            ) : (
              <div>
                <button 
                  onClick={async () => {
                    if (deferredPrompt) {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') {
                        setDeferredPrompt(null);
                        setIsInstallable(false);
                      }
                    } else {
                      alert("To install AlgoFlow Studio as a desktop/mobile app:\n\n1. Look for the Install icon (📥 or ⊕) in your browser's address bar or menu.\n2. Click 'Install' or 'Add to Home Screen'.");
                    }
                  }}
                  style={{
                    width: '100%', padding: '0.7rem', borderRadius: '10px', 
                    border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                  }}
                >
                  <span>📲</span>
                  <span>Install AlgoFlow Studio App</span>
                </button>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', textAlign: 'center' }}>
                  Install for quick desktop access, offline support &amp; native performance
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-start" style={{ marginTop: '0.75rem', padding: '0.75rem' }} onClick={() => setIsSettingsOpen(false)}>Save &amp; Close</button>
        </div>
      </div>
    );
  };

  const renderUpcomingFeaturesModal = () => {
    return (
      <div className="modal-overlay" onClick={() => setIsUpcomingOpen(false)}>
        <div className="modal-content" style={{ maxWidth: '460px', padding: '2.2rem 2rem', borderRadius: '18px', background: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(139, 92, 246, 0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.65)', backdropFilter: 'blur(16px)' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.6))' }}>🚀</span>
            <h2 className="title-gradient" style={{ fontSize: '1.8rem', margin: 0, fontWeight: 'bold' }}>Upcoming Features</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5', fontWeight: 500 }}>
            We are working on adding several powerful upgrades to AlgoFlow-Studio. Here is the upcoming list:
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: '0 0 2rem 0', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem' 
          }}>
            {[
              { title: 'Code Validator and Runner', desc: 'Compile, validate, and execute your code inside the visualizer canvas with dynamic test cases.' },
              { title: 'AI Assistant Bot', desc: 'Ask questions, dry run algorithms, and get code reviews from our built-in AI helper.' },
              { title: 'Run Code in Every Module', desc: 'Launch terminal execution containers for all search, sorting, tree, graph, and linear structures.' }
            ].map((f, i) => (
              <li key={i} style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '12px', 
                padding: '0.9rem 1.2rem',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '2px' }}>✦</span>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>{f.title}</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.45' }}>{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <button 
            className="btn btn-start" 
            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', border: 'none', color: '#fff', cursor: 'pointer' }} 
            onClick={() => setIsUpcomingOpen(false)}
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

  // ── Screens with State Preservation ──────────────────────────────────────────────────────────────
  const [mountedModes, setMountedModes] = useState({});

  useEffect(() => {
    if (appMode) {
      setMountedModes(prev => ({ ...prev, [appMode]: true }));
    }
  }, [appMode]);

  useEffect(() => {
    if (appMode) {
      setLastActiveMode(appMode);
      setLastSetupComplete(setupComplete);
    }
  }, [appMode, setupComplete]);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const frame = timeline[currentStep] || new Frame(null, [], null);
  const progress = timeline.length > 1 ? (currentStep / (timeline.length - 1)) * 100 : 0;



  return (
    <>
      {/* Home Screen */}
      <div style={{ display: !appMode ? 'block' : 'none', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 50, display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isInstallable && (
            <button 
              className="btn btn-clear" 
              onClick={async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') {
                    setDeferredPrompt(null);
                    setIsInstallable(false);
                  }
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.25s', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              📥 Install App
            </button>
          )}
          <button 
            className="btn btn-clear" 
            onClick={() => setIsUpcomingOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--accent-primary)', cursor: 'pointer', transition: 'all 0.25s', fontWeight: 'bold' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            🚀 Upcoming Features
          </button>
          <button 
            className="btn btn-clear" 
            onClick={() => setIsSettingsOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.25s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            ⚙️ Settings
          </button>
        </div>
        <div className="home-container">
          {!appMode && lastActiveMode && (
            <div className="resume-banner" style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1.5px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '0.8rem 1.2rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.1)',
              animation: 'fadeIn 0.5s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>⏳</span>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>Unsaved Session Detected</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    You were recently working on <strong>{
                      lastActiveMode === 'BEGINNER_101_VIS' ? 'Beginner 101' :
                      lastActiveMode === 'GENERAL_DSA_VIS' ? 'General DSA' :
                      lastActiveMode === 'SORT_SEARCH_VIS' ? 'Sort & Search' :
                      lastActiveMode === 'MAIN_VIS' ? 'Tree Visualizer' :
                      lastActiveMode === 'GRAPH_VIS' ? 'Graph Visualizer' :
                      lastActiveMode === 'DP_GREEDY_VIS' ? 'DP & Greedy' :
                      lastActiveMode === 'JAVA_OOP_VIS' ? 'Patterns' :
                      lastActiveMode === 'DSA_NOTES_VIS' ? 'DSA Study & Solved Sums' :
                      lastActiveMode === 'LINE_BY_LINE_VIS' ? 'Line Debugger' :
                      'Code Validator'
                    }</strong>.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-start" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', margin: 0 }} onClick={() => {
                  setAppMode(lastActiveMode);
                  setSetupComplete(lastSetupComplete);
                  window.location.hash = lastActiveMode;
                }}>Resume Session</button>
                <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', margin: 0 }} onClick={() => {
                  setLastActiveMode(null);
                  setLastSetupComplete(false);
                }}>Dismiss</button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '0.4rem' }}>AlgoFlow-Studio</h1>
            <p style={{ margin: '0 0 1.8rem 0', color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              AlgoFlow always welcomes uu {welcomeRole} ✨
            </p>
            <div style={{ 
              maxWidth: '500px', 
              margin: '0 auto 2.5rem auto', 
              position: 'relative',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${isSearchFocused ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
              boxShadow: isSearchFocused 
                ? '0 0 15px rgba(139, 92, 246, 0.4), 0 8px 32px 0 rgba(0,0,0,0.3)' 
                : '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem 1.2rem'
            }}>
              <span style={{ fontSize: '1.1rem', marginRight: '8px', opacity: 0.6 }}>🔍</span>
              <input 
                type="text" 
                value={homeSearchQuery} 
                onChange={e => setHomeSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search algorithms, data structures, debuggers..."
                style={{ 
                  flex: 1, 
                  padding: '0.8rem 0', 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-primary)', 
                  fontSize: '1rem', 
                  outline: 'none' 
                }} 
              />
              {homeSearchQuery.trim() !== '' && (
                <button 
                  onClick={() => setHomeSearchQuery('')}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: 'var(--text-secondary)', 
                    cursor: 'pointer', 
                    fontSize: '1.2rem', 
                    marginLeft: '8px',
                    padding: 0,
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="home-grid">
            {homeSearchQuery.trim() === '' ? (
              [
                { id: 'BEGINNER_101_VIS', icon: '🌱', title: 'Beginner 101', desc: 'B.Tech Branch Roadmaps, Language Picker, Variables, Arrays & Why Sorting Matters.' },
                { id: 'GENERAL_DSA_VIS', icon: '📦', title: 'General DSA Visualizer', desc: 'Explore foundational data structures: Stacks, Queues, Linked Lists, and Hash Tables.' },
                { id: 'SORT_SEARCH_VIS', icon: '📊', title: 'Sort & Search Visualizer', desc: 'Visualize array sorting and searching algorithms with dynamic GSAP animations.' },
                { id: 'MAIN_VIS', icon: '🚀', title: 'Tree Visualizer Studio', desc: 'Build BST / AVL / Heaps / B-Tree / Segment trees step-by-step with live code generation.' },
                { id: 'GRAPH_VIS', icon: '🕸️', title: 'Graph Visualizer Studio', desc: 'Construct customized weighted graphs. Animate BFS, DFS, Dijkstra, and Greedy best-first traversals.' },
                { id: 'DP_GREEDY_VIS', icon: '🧠', title: 'DP & Greedy Visualizer', desc: 'Visualize LCS, LIS, Knapsack, and Coin Change DP vs. Greedy side-by-side.' },
                { id: 'JAVA_OOP_VIS', icon: '✨', title: 'Patterns Visualizer Studio', desc: 'Animate and compile 10 different loop patterns (Pyramids, Diamond, Pascal, Floyd, Butterfly) in 5 languages.' },
                { id: 'DSA_NOTES_VIS', icon: '📚', title: 'DSA Study & Solved Sums', desc: 'Interactive step-by-step code trace, variables inspector and visualizations for 10 classic DSA problems.' },
                { id: 'LINE_BY_LINE_VIS', icon: '🐞', title: 'Line-by-Line Debugger', desc: 'PythonTutor-style execution tracing. Step through code, track variables, frames, and output.' },
                { id: 'CODE_VAL_VIS', icon: '💻', title: 'Code Validator & Runner', desc: 'Write or paste code in 5 languages. Enhanced syntax validation, error detection, and native cloud execution.' }
              ].map(card => (
                <div key={card.id} className="option-card" onClick={() => {
                  if (card.id === 'CODE_VAL_VIS') {
                    setIsUpcomingOpen(true);
                  } else {
                    enterMode(card.id);
                  }
                }} onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })} onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
                  <div className="option-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))
            ) : (
              [
                { id: 'BST', mode: 'MAIN_VIS', title: 'Binary Search Tree', icon: '🌳', desc: 'Tree Visualizer' },
                { id: 'AVL', mode: 'MAIN_VIS', title: 'AVL Tree', icon: '⚖️', desc: 'Tree Visualizer' },
                { id: 'MIN_HEAP', mode: 'MAIN_VIS', title: 'Min-Heap', icon: '🔽', desc: 'Tree Visualizer' },
                { id: 'MAX_HEAP', mode: 'MAIN_VIS', title: 'Max-Heap', icon: '🔼', desc: 'Tree Visualizer' },
                { id: 'RB_TREE', mode: 'MAIN_VIS', title: 'Red-Black Tree', icon: '🔴', desc: 'Tree Visualizer' },
                { id: 'B_TREE', mode: 'MAIN_VIS', title: 'B-Tree', icon: '🌲', desc: 'Tree Visualizer' },
                { id: 'B_PLUS_TREE', mode: 'MAIN_VIS', title: 'B+ Tree', icon: '🍃', desc: 'Tree Visualizer' },
                { id: 'SEGMENT_TREE', mode: 'MAIN_VIS', title: 'Segment Tree', icon: '📏', desc: 'Tree Visualizer' },
                { id: 'FENWICK_TREE', mode: 'MAIN_VIS', title: 'Fenwick Tree', icon: '🧮', desc: 'Tree Visualizer' },
                { id: 'LL_SINGLY', mode: 'GENERAL_DSA_VIS', title: 'Singly Linked List', icon: '🔗', desc: 'General DSA', type: 'LINKED_LIST', variety: 'LL_SINGLY' },
                { id: 'LL_DOUBLY', mode: 'GENERAL_DSA_VIS', title: 'Doubly Linked List', icon: '⛓️', desc: 'General DSA', type: 'LINKED_LIST', variety: 'LL_DOUBLY' },
                { id: 'LL_CIRCULAR', mode: 'GENERAL_DSA_VIS', title: 'Circular Linked List', icon: '🔄', desc: 'General DSA', type: 'LINKED_LIST', variety: 'LL_CIRCULAR' },
                { id: 'STACK_ARRAY', mode: 'GENERAL_DSA_VIS', title: 'Stack (Array)', icon: '🥞', desc: 'General DSA', type: 'STACK', variety: 'STACK_ARRAY' },
                { id: 'STACK_LL', mode: 'GENERAL_DSA_VIS', title: 'Stack (Linked List)', icon: '📚', desc: 'General DSA', type: 'STACK', variety: 'STACK_LL' },
                { id: 'QUEUE_SIMPLE', mode: 'GENERAL_DSA_VIS', title: 'Queue (Simple)', icon: '🚶‍♂️', desc: 'General DSA', type: 'QUEUE', variety: 'QUEUE_SIMPLE' },
                { id: 'QUEUE_CIRCULAR', mode: 'GENERAL_DSA_VIS', title: 'Circular Queue', icon: '🎡', desc: 'General DSA', type: 'QUEUE', variety: 'QUEUE_CIRCULAR' },
                { id: 'QUEUE_DEQUE', mode: 'GENERAL_DSA_VIS', title: 'Deque', icon: '↔️', desc: 'General DSA', type: 'QUEUE', variety: 'QUEUE_DEQUE' },
                { id: 'HASH_LINEAR', mode: 'GENERAL_DSA_VIS', title: 'Hash Table (Linear Probing)', icon: '#️⃣', desc: 'General DSA', type: 'HASH_TABLE', variety: 'HASH_LINEAR' },
                { id: 'HASH_QUADRATIC', mode: 'GENERAL_DSA_VIS', title: 'Hash Table (Quadratic Probing)', icon: '2️⃣', desc: 'General DSA', type: 'HASH_TABLE', variety: 'HASH_QUADRATIC' },
                { id: 'HASH_MULTIPLICATION', mode: 'GENERAL_DSA_VIS', title: 'Hash Table (Multiplication Hashing)', icon: '✖️', desc: 'General DSA', type: 'HASH_TABLE', variety: 'HASH_MULTIPLICATION' },
                { id: 'HASH_FOLDING', mode: 'GENERAL_DSA_VIS', title: 'Hash Table (Folding Method)', icon: '📁', desc: 'General DSA', type: 'HASH_TABLE', variety: 'HASH_FOLDING' },
                { id: 'HASH_CHAINING', mode: 'GENERAL_DSA_VIS', title: 'Hash Table (Separate Chaining)', icon: '⛓️‍💥', desc: 'General DSA', type: 'HASH_TABLE', variety: 'HASH_CHAINING' },
                { id: 'DIJKSTRA_GRAPH', mode: 'GRAPH_VIS', title: 'Dijkstra Algorithm', icon: '🛣️', desc: 'Graph Visualizer', algo: 'Dijkstra' },
                { id: 'BFS_GRAPH', mode: 'GRAPH_VIS', title: 'Breadth-First Search (BFS)', icon: '🌐', desc: 'Graph Visualizer', algo: 'BFS' },
                { id: 'DFS_GRAPH', mode: 'GRAPH_VIS', title: 'Depth-First Search (DFS)', icon: '🕵️', desc: 'Graph Visualizer', algo: 'DFS' },
                { id: 'GREEDY_GRAPH', mode: 'GRAPH_VIS', title: 'Greedy Best-First Search', icon: '🤑', desc: 'Graph Visualizer', algo: 'Greedy' },
                { id: 'PRIM_GRAPH', mode: 'GRAPH_VIS', title: "Prim's MST Algorithm", icon: '🌲', desc: 'Graph Visualizer', algo: 'Prim' },
                { id: 'BELLMAN_GRAPH', mode: 'GRAPH_VIS', title: 'Bellman-Ford Algorithm', icon: '📉', desc: 'Graph Visualizer', algo: 'Bellman-Ford' },
                { id: 'FLOYD_GRAPH', mode: 'GRAPH_VIS', title: 'Floyd-Warshall Algorithm', icon: '🕸️', desc: 'Graph Visualizer', algo: 'Floyd-Warshall' },
                { id: 'KAHN_GRAPH', mode: 'GRAPH_VIS', title: "Kahn's Algorithm (Topological Sort)", icon: '📐', desc: 'Graph Visualizer', algo: 'Kahn' },
                { id: 'BUBBLE_SORT', mode: 'SORT_SEARCH_VIS', title: 'Bubble Sort', icon: '🫧', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Bubble Sort' },
                { id: 'SELECTION_SORT', mode: 'SORT_SEARCH_VIS', title: 'Selection Sort', icon: '🎯', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Selection Sort' },
                { id: 'INSERTION_SORT', mode: 'SORT_SEARCH_VIS', title: 'Insertion Sort', icon: '📥', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Insertion Sort' },
                { id: 'MERGE_SORT', mode: 'SORT_SEARCH_VIS', title: 'Merge Sort', icon: '🧩', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Merge Sort' },
                { id: 'HEAP_SORT', mode: 'SORT_SEARCH_VIS', title: 'Heap Sort', icon: '🌲', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Heap Sort' },
                { id: 'SHELL_SORT', mode: 'SORT_SEARCH_VIS', title: 'Shell Sort', icon: '🐚', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Shell Sort' },
                { id: 'COCKTAIL_SORT', mode: 'SORT_SEARCH_VIS', title: 'Cocktail Shaker Sort', icon: '🍹', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Cocktail Shaker Sort' },
                { id: 'QUICK_SORT', mode: 'SORT_SEARCH_VIS', title: 'Quick Sort', icon: '⚡', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Quick Sort' },
                { id: 'RADIX_SORT', mode: 'SORT_SEARCH_VIS', title: 'Radix Sort', icon: '🔢', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Radix Sort' },
                { id: 'COUNTING_SORT', mode: 'SORT_SEARCH_VIS', title: 'Counting Sort', icon: '🧮', desc: 'Sort & Search Visualizer', tab: 'Sort', algo: 'Counting Sort' },
                { id: 'LINEAR_SEARCH', mode: 'SORT_SEARCH_VIS', title: 'Linear Search', icon: '🔍', desc: 'Sort & Search Visualizer', tab: 'Search', algo: 'Linear Search' },
                { id: 'BINARY_SEARCH', mode: 'SORT_SEARCH_VIS', title: 'Binary Search', icon: '🎯', desc: 'Sort & Search Visualizer', tab: 'Search', algo: 'Binary Search' },
                { id: 'DP_LCS', mode: 'DP_GREEDY_VIS', title: 'Longest Common Subsequence (LCS)', icon: '🧬', desc: 'DP & Greedy Visualizer', tab: 'LCS' },
                { id: 'DP_LIS', mode: 'DP_GREEDY_VIS', title: 'Longest Increasing Subsequence (LIS)', icon: '📈', desc: 'DP & Greedy Visualizer', tab: 'LIS' },
                { id: 'DP_KNAPSACK', mode: 'DP_GREEDY_VIS', title: 'Knapsack (0/1 & Fractional)', icon: '🎒', desc: 'DP & Greedy Visualizer', tab: 'Knapsack' },
                { id: 'DP_COIN_CHANGE', mode: 'DP_GREEDY_VIS', title: 'Coin Change (Greedy vs DP)', icon: '🪙', desc: 'DP & Greedy Visualizer', tab: 'CoinChange' },
                { id: 'PATTERNS_LOOP', mode: 'JAVA_OOP_VIS', title: 'Patterns & Loop Studio (Pyramid, Pascal, Floyd)', icon: '✨', desc: 'Patterns Visualizer Studio', tab: 'Patterns' },
                { id: 'MOD1_ENGINE_SYSTEM', mode: 'DSA_NOTES_VIS', title: 'Text Analytics Engine Architecture', icon: '🏛️', desc: 'Advanced Algorithm Concept' },
                { id: 'MOD1_QUERY_FAMILY_MAP', mode: 'DSA_NOTES_VIS', title: 'Query Class to Algorithm Mapping', icon: '🗺️', desc: 'Advanced Algorithm Concept' },
                { id: 'MOD1_ZERO_UTIL_CONSTRAINT', mode: 'DSA_NOTES_VIS', title: 'Zero Utility Library Constraint', icon: '⛔', desc: 'Advanced Algorithm Concept' },
                { id: 'MOD2_KMP', mode: 'DSA_NOTES_VIS', title: 'Knuth-Morris-Pratt (KMP) Pattern Search', icon: '🔍', desc: 'Advanced String Algorithms' },
                { id: 'MOD2_Z_FUNC', mode: 'DSA_NOTES_VIS', title: 'Z-Function String Matching', icon: '⚡', desc: 'Advanced String Algorithms' },
                { id: 'MOD2_RABIN_KARP', mode: 'DSA_NOTES_VIS', title: 'Rabin-Karp Rolling Hash & Double Hashing', icon: '🔑', desc: 'Advanced String Algorithms' },
                { id: 'MOD3_EDIT_DISTANCE', mode: 'DSA_NOTES_VIS', title: 'Edit Distance (Wagner-Fischer & Damerau)', icon: '📝', desc: 'Advanced Dynamic Programming' },
                { id: 'MOD3_BITMASK_DP', mode: 'DSA_NOTES_VIS', title: 'Bitmask DP (Travelling Salesman Problem)', icon: '🎛️', desc: 'Advanced Dynamic Programming' },
                { id: 'MOD4_DINIC', mode: 'DSA_NOTES_VIS', title: 'Dinic Max-Flow Algorithm (Level Graphs)', icon: '🌊', desc: 'Network Flow Algorithms' },
                { id: 'MOD5_APPROXIMATION', mode: 'DSA_NOTES_VIS', title: 'Approximation Algorithms & Vertex-Cover 2-Approx', icon: '🎯', desc: 'NP-Completeness & Approximation' },
                { id: 'MOD6_MILLER_RABIN', mode: 'DSA_NOTES_VIS', title: 'Miller-Rabin Primality Test', icon: '🎲', desc: 'Randomised & Parallel Algorithms' },
                { id: 'MOD6_PARALLEL_BLELLOCH', mode: 'DSA_NOTES_VIS', title: 'Blelloch Parallel Prefix Scan', icon: '🚀', desc: 'Randomised & Parallel Algorithms' },
                { id: 'DSA_NOTES_VIS', mode: 'DSA_NOTES_VIS', title: 'DSA Study & Solved Sums (Two Sum, List Reverse, Valid Parentheses, DP)', icon: '📚', desc: 'DSA Notes & Solved Problems Studio' },
                { id: 'BTECH_ROADMAP', mode: 'BEGINNER_101_VIS', title: 'B.Tech Branch Roadmaps & Language Picker', icon: '🎓', desc: 'Which language to pick for CSE, ECE, EEE, Mech, Civil, AI/ML, Cyber Security & more' },
                { id: 'LANG_CAREER', mode: 'BEGINNER_101_VIS', title: 'Language Career Guide', icon: '🎯', desc: 'Jobs, fields, and applications per programming language' },
                { id: 'AI_RAG_MENTOR', mode: 'AI_RAG_MENTOR_VIS', title: '🤖 AlgoFlow AI RAG Mentor Studio', icon: '🤖', desc: 'Ask career roadmaps, branch advice, languages & DSA questions to AI' }
              ].filter(c => c.title.toLowerCase().includes(homeSearchQuery.toLowerCase()) || c.desc.toLowerCase().includes(homeSearchQuery.toLowerCase())).map(card => (
                <div key={card.id} className="option-card" onClick={() => setPendingModule(card)} onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })} onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
                  <div className="option-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI RAG Mentor Studio Visualizer */}
      <div style={{ display: appMode === 'AI_RAG_MENTOR_VIS' ? 'block' : 'none' }}>
        <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-clear" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← 🏠 Home
          </button>
          <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🤖 AI RAG Mentor Studio</span>
        </div>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <AiRagMentorStudio codeLang={codeLang} customCode={customCode} />
        </div>
      </div>

      {/* Beginner 101 Visualizer */}
      <div style={{ display: appMode === 'BEGINNER_101_VIS' ? 'block' : 'none' }}>
        <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-clear" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← 🏠 Home
          </button>
          <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>🌱 Beginner 101</span>
        </div>
        <Beginner101Visualizer codeLang={codeLang} setCodeLang={setCodeLang} fontSize={editorFontSize} />
      </div>

      {/* Sort Search Visualizer */}
      <div style={{ display: appMode === 'SORT_SEARCH_VIS' ? 'block' : 'none' }}>
        <SortSearchVisualizer 
          onBack={goBack} 
          openSettings={() => setIsSettingsOpen(true)} 
          initialTab={globalSortSearchTab} 
          initialSort={globalSort} 
          initialSearch={globalSearch} 
          onCopyCode={handleCopyTrigger}
          onCodeChange={(code, lang) => {
            setActiveCodeForChat(code);
            setActiveLangForChat(lang);
          }}
          fontSize={editorFontSize}
          wordWrap={editorWordWrap}
          onShowUpcomingFeatures={() => setIsUpcomingOpen(true)}
        />
      </div>

      {/* General DSA Visualizer */}
      <div style={{ display: appMode === 'GENERAL_DSA_VIS' ? 'block' : 'none' }}>
        <GeneralDSVisualizer 
          onBack={goBack} 
          openSettings={() => setIsSettingsOpen(true)} 
          initialType={globalDsType} 
          initialVariety={globalDsVariety} 
          onCopyCode={handleCopyTrigger}
          onCodeChange={(code, lang) => {
            setActiveCodeForChat(code);
            setActiveLangForChat(lang);
          }}
          fontSize={editorFontSize}
          wordWrap={editorWordWrap}
          onShowUpcomingFeatures={() => setIsUpcomingOpen(true)}
        />
      </div>

      {/* Graph Visualizer Studio */}
      <div style={{ display: appMode === 'GRAPH_VIS' ? 'block' : 'none' }}>
        <GraphVisualizer 
          onBack={goBack} 
          openSettings={() => setIsSettingsOpen(true)} 
          initialAlgo={globalGraphAlgo} 
          onCopyCode={handleCopyTrigger}
          onCodeChange={(code, lang) => {
            setActiveCodeForChat(code);
            setActiveLangForChat(lang);
          }}
          fontSize={editorFontSize}
          wordWrap={editorWordWrap}
          onShowUpcomingFeatures={() => setIsUpcomingOpen(true)}
        />
      </div>

      {/* DP & Greedy Visualizer Studio */}
      <div style={{ display: appMode === 'DP_GREEDY_VIS' ? 'block' : 'none' }}>
        <DPGreedyVisualizer 
          onBack={goBack} 
          openSettings={() => setIsSettingsOpen(true)} 
          initialTab={globalDpTab || 'LCS'} 
          onCopyCode={handleCopyTrigger}
          onCodeChange={(code, lang) => {
            setActiveCodeForChat(code);
            setActiveLangForChat(lang);
          }}
          fontSize={editorFontSize}
          wordWrap={editorWordWrap}
          onShowUpcomingFeatures={() => setIsUpcomingOpen(true)}
        />
      </div>

      {/* Patterns Visualizer Studio */}
      <div style={{ display: appMode === 'JAVA_OOP_VIS' ? 'block' : 'none' }}>
        <PatternsVisualizer 
          onBack={goBack} 
          openSettings={() => setIsSettingsOpen(true)} 
          onCopyCode={handleCopyTrigger}
          onCodeChange={(code, lang) => {
            setActiveCodeForChat(code);
            setActiveLangForChat(lang);
          }}
          fontSize={editorFontSize}
          wordWrap={editorWordWrap}
          onShowUpcomingFeatures={() => setIsUpcomingOpen(true)}
        />
      </div>

      {/* DSA Notes & Solved Problems Studio */}
      <div style={{ display: appMode === 'DSA_NOTES_VIS' ? 'block' : 'none' }}>
        <DSANotesVisualizer 
          onBack={goBack} 
          openSettings={() => setIsSettingsOpen(true)} 
          fontSize={editorFontSize}
          wordWrap={editorWordWrap}
          onShowUpcomingFeatures={() => setIsUpcomingOpen(true)}
        />
      </div>



      {/* Pending Module (Language Setup via Search) */}
      {pendingModule && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2 className="title-gradient">Setup: {pendingModule.title}</h2>
            <div className="select-group">
              <label style={{ fontWeight: 600 }}>Select Programming Language</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '10px' }}>
                {['JS', 'Python', 'C++', 'Java'].map(lang => (
                  <button key={lang} onClick={() => setCodeLang(lang)}
                    style={{ padding: '0.8rem', borderRadius: '10px', border: `2px solid ${codeLang === lang ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: codeLang === lang ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)', color: codeLang === lang ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: codeLang === lang ? 800 : 400, fontSize: '1rem', transition: 'all 0.2s', textAlign: 'center' }}>
                    {lang === 'JS' ? 'JavaScript' : lang}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-start" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => {
              setIsPageLoading(true);
              setTimeout(() => {
                window.location.hash = pendingModule.mode;
                if (pendingModule.mode === 'MAIN_VIS') setTreeType(pendingModule.id);
                if (pendingModule.mode === 'GENERAL_DSA_VIS') {
                  setGlobalDsType(pendingModule.type);
                  setGlobalDsVariety(pendingModule.variety);
                }
                if (pendingModule.mode === 'SORT_SEARCH_VIS') {
                  setGlobalSortSearchTab(pendingModule.tab);
                  if (pendingModule.tab === 'Sort') {
                    setGlobalSort(pendingModule.algo);
                  } else {
                    setGlobalSearch(pendingModule.algo);
                  }
                }
                if (pendingModule.mode === 'GRAPH_VIS') {
                  setGlobalGraphAlgo(pendingModule.algo);
                }
                if (pendingModule.mode === 'DP_GREEDY_VIS') {
                  setGlobalDpTab(pendingModule.tab);
                }
                setAppMode(pendingModule.mode);
                setSetupComplete(true);
                setPendingModule(null);
                setHomeSearchQuery('');
                setIsPageLoading(false);
              }, 100);
            }}>Launch Visualizer</button>
            <button className="btn btn-clear" style={{ marginTop: '0.75rem', width: '100%' }} onClick={() => setPendingModule(null)}>← Cancel</button>
          </div>
        </div>
      )}

      {/* Setup Modals (Improved UI) */}
      {!setupComplete && appMode === 'CODE_VAL_VIS' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2 className="title-gradient">Setup Code Environment</h2>
            <div className="select-group">
              <label style={{ fontWeight: 600 }}>Select Programming Language</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '10px' }}>
                {['JS', 'Python', 'C++', 'Java'].map(lang => (
                  <button key={lang} onClick={() => setCodeLang(lang)}
                    style={{ padding: '0.8rem', borderRadius: '10px', border: `2px solid ${codeLang === lang ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: codeLang === lang ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)', color: codeLang === lang ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: codeLang === lang ? 800 : 400, fontSize: '1rem', transition: 'all 0.2s', textAlign: 'center' }}>
                    {lang === 'JS' ? 'JavaScript' : lang}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-start" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setSetupComplete(true)}>Open Editor</button>
            <button className="btn btn-clear" style={{ marginTop: '0.75rem', width: '100%' }} onClick={goBack}>← Back</button>
          </div>
        </div>
      )}

      {!setupComplete && appMode === 'LINE_BY_LINE_VIS' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <h2 className="title-gradient">Setup Debugger</h2>
            <div className="select-group">
              <label style={{ fontWeight: 600 }}>Select Programming Language</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '12px' }}>
                {['JS', 'Python', 'C++', 'Java'].map((lang) => (
                  <button key={lang} onClick={() => setCodeLang(lang)}
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
                    style={{ 
                      padding: '1.2rem', borderRadius: '14px', 
                      border: `2px solid ${codeLang === lang ? 'var(--accent-primary)' : 'var(--glass-border)'}`, 
                      background: codeLang === lang ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.2))' : 'rgba(255,255,255,0.02)', 
                      color: codeLang === lang ? 'var(--accent-primary)' : 'var(--text-primary)', 
                      cursor: 'pointer', fontWeight: codeLang === lang ? 800 : 500, fontSize: '1.1rem', 
                      transition: 'all 0.2s', textAlign: 'center',
                      boxShadow: codeLang === lang ? '0 0 15px rgba(59,130,246,0.2)' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                    }}>
                    <span style={{ fontSize: '2rem' }}>
                      {lang === 'JS' ? '🟨' : lang === 'Python' ? '🐍' : lang === 'C++' ? '⚙️' : '☕'}
                    </span>
                    {lang === 'JS' ? 'JavaScript' : lang}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-start" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setSetupComplete(true)}>Open Debugger</button>
            <button className="btn btn-clear" style={{ marginTop: '0.75rem', width: '100%' }} onClick={goBack}>← Back</button>
          </div>
        </div>
      )}

      {!setupComplete && appMode === 'MAIN_VIS' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <h2 className="title-gradient">Select Data Structure</h2>
            <div className="select-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginTop: '10px' }}>
                {[
                  { id: 'BST', name: 'Binary Search Tree' },
                  { id: 'AVL', name: 'AVL Tree' },
                  { id: 'MIN_HEAP', name: 'Min-Heap' },
                  { id: 'MAX_HEAP', name: 'Max-Heap' },
                  { id: 'RB_TREE', name: 'Red-Black Tree' },
                  { id: 'B_TREE', name: 'B-Tree' },
                  { id: 'B_PLUS_TREE', name: 'B+ Tree' },
                  { id: 'SEGMENT_TREE', name: 'Segment Tree' },
                  { id: 'FENWICK_TREE', name: 'Fenwick Tree' },
                ].map(type => (
                  <button key={type.id} onClick={() => setTreeType(type.id)}
                    style={{ padding: '0.7rem', borderRadius: '10px', border: `2px solid ${treeType === type.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: treeType === type.id ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)', color: treeType === type.id ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: treeType === type.id ? 800 : 400, fontSize: '0.9rem', transition: 'all 0.2s', textAlign: 'center' }}>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {(treeType === 'B_TREE' || treeType === 'B_PLUS_TREE') && (
              <>
                <div className="select-group">
                  <label style={{ fontWeight: 600 }}>B-Tree Order (Max Children)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.4rem', marginTop: '8px' }}>
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(o => (
                      <button key={o} onClick={() => setBTreeOrder(o)}
                        style={{ padding: '0.5rem 0', borderRadius: '8px', border: `2px solid ${bTreeOrder === o ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: bTreeOrder === o ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)', color: bTreeOrder === o ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: bTreeOrder === o ? 800 : 400, fontSize: '0.9rem', transition: 'all 0.2s', textAlign: 'center' }}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="select-group" style={{ marginTop: '1.2rem' }}>
                  <label style={{ fontWeight: 600 }}>Splitting Strategy</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginTop: '8px' }}>
                    {[
                      { id: 'MEDIAN', name: 'Median' },
                      { id: 'LEFT_BIASED', name: 'Left-Biased' },
                      { id: 'RIGHT_BIASED', name: 'Right-Biased' }
                    ].map(strategy => (
                      <button key={strategy.id} onClick={() => setSplitStrategy(strategy.id)}
                        style={{ padding: '0.55rem 0', borderRadius: '8px', border: `2px solid ${splitStrategy === strategy.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`, background: splitStrategy === strategy.id ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)', color: splitStrategy === strategy.id ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', fontWeight: splitStrategy === strategy.id ? 800 : 400, fontSize: '0.85rem', transition: 'all 0.2s', textAlign: 'center' }}>
                        {strategy.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button className="btn btn-start" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setSetupComplete(true)}>Launch Visualizer</button>
            <button className="btn btn-clear" style={{ marginTop: '0.75rem', width: '100%' }} onClick={goBack}>← Back</button>
          </div>
        </div>
      )}
      {/* Code Validator Visualizer */}
      <div style={{ display: appMode === 'CODE_VAL_VIS' && setupComplete ? 'block' : 'none' }}>
        {mountedModes['CODE_VAL_VIS'] && (
          <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header className="header-glass">
              <div>
                <h1 className="title-gradient" style={{ fontSize: '1.7rem' }}>Code Validator ({codeLang})</h1>
              </div>
              <div className="controls-glass">
                <button 
                  onClick={() => {
                    setIsUpcomingOpen(true);
                  }}
                  className="btn btn-clear" 
                  style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', display: 'inline-flex', alignItems: 'center' }}
                >
                  ▶ Run Code
                </button>
                <button className="btn btn-clear" style={{ background: 'rgba(236,72,153,0.2)', color: '#fbcfe8' }} onClick={() => enterMode('LINE_BY_LINE_VIS')}>🐛 Debug (Line-by-Line)</button>
                <button className="btn btn-clear" onClick={() => setIsSettingsOpen(true)}>⚙ Settings</button>
                <button className="btn btn-clear" onClick={() => setAppMode(null)}>🏠 Home</button>
              </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0.5rem 1rem 1rem 1rem', gap: '0', overflow: 'hidden' }}>
              <div style={{ flex: 1, background: '#1e1e1e', borderRadius: '10px', border: '1px solid #333', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '0.5rem 1rem', background: '#252526', borderBottom: '1px solid #333', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#969696', fontFamily: 'monospace' }}>main.{codeLang === 'Python' ? 'py' : codeLang === 'Java' ? 'java' : codeLang === 'C++' ? 'cpp' : 'js'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#858585' }}>{customCode.split('\n').length} lines</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', flex: 2, overflow: 'hidden' }}>
                    <div style={{ width: '44px', background: '#1e1e1e', borderRight: '1px solid #333', color: '#858585', textAlign: 'right', padding: '1rem 6px 1rem 0', fontFamily: 'monospace', fontSize: `${editorFontSize}px`, overflow: 'hidden', lineHeight: '1.6', userSelect: 'none' }}>
                      <div style={{ transform: `translateY(-${editorScroll}px)` }}>
                        {customCode.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                      </div>
                    </div>
                    <textarea className="code-textarea" value={customCode} onChange={e => setCustomCode(e.target.value)} onScroll={e => setEditorScroll(e.target.scrollTop)}
                      style={{ flex: 1, padding: '1rem', fontSize: `${editorFontSize}px`, lineHeight: '1.6', whiteSpace: editorWordWrap === 'on' ? 'pre-wrap' : 'pre', outline: 'none', border: 'none', background: 'transparent', color: '#d4d4d4', resize: 'none', fontFamily: 'monospace' }}
                      placeholder={`Write your ${codeLang} code here...\n\nExample:\nlet x = 5;\nlet y = 10;\nconsole.log(x + y);`}
                      spellCheck={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Line-by-Line Debugger */}
      <div style={{ display: appMode === 'LINE_BY_LINE_VIS' && setupComplete ? 'block' : 'none' }}>
        {mountedModes['LINE_BY_LINE_VIS'] && (
          <LineDebugger initialCode={customCode} lang={codeLang} fontSize={editorFontSize} wordWrap={editorWordWrap} onBack={goBack} openSettings={() => setIsSettingsOpen(true)} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} chatMessages={chatMessages} setChatMessages={setChatMessages} apiKey={globalApiKey} setApiKey={setGlobalApiKey} model={globalModel} setModel={setGlobalModel} onShowUpcomingFeatures={() => setIsUpcomingOpen(true)} isMobile={isMobile} />
        )}
      </div>

      {/* Main Tree Visualizer */}
      <div style={{ display: appMode === 'MAIN_VIS' && setupComplete ? 'block' : 'none' }}>
        {mountedModes['MAIN_VIS'] && (
          <div className="app-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header className="header-glass">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 className="title-gradient" style={{ fontSize: '1.7rem', margin: 0 }}>{treeType.replace(/_/g, ' ')} Studio</h1>
                <button 
                  type="button" 
                  className="btn btn-clear" 
                  style={{ padding: '4px 10px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '8px', cursor: 'pointer' }}
                  onClick={() => setShowTopicInfo(true)}
                  title="Learn about this topic (Beginner Guide)"
                >
                  ℹ️ Info
                </button>
                {frame.rotation && (
                  <div style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '0.95rem', fontWeight: 800, animation: 'fadeIn 0.3s ease', boxShadow: '0 4px 12px rgba(239,68,68,0.4)', display: 'inline-block' }}>
                    ⚡ {frame.rotation}
                  </div>
                )}
              </div>

              <div className="controls-glass" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Always show main operation inputs */}
                {treeType !== 'MIN_HEAP' && treeType !== 'MAX_HEAP' && (
                  <input type={treeType === 'BFS_TREE' || treeType === 'DFS_TREE' ? "text" : "number"} className="styled-input" style={{ width: isMobile ? '80px' : (treeType === 'BFS_TREE' || treeType === 'DFS_TREE' ? '150px' : '115px'), opacity: isPlaying ? 0.7 : 1 }} placeholder={isPlaying ? "Wait..." : "Val…"} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isPlaying && inputValue.trim() && handleInsert()} />
                )}
                {treeType !== 'MIN_HEAP' && treeType !== 'MAX_HEAP' ? (
                  <button className="btn btn-insert" onClick={handleInsert} disabled={isPlaying || !inputValue.trim()}>
                    {isPlaying ? '⏳' : 'Insert'}
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <input type="number" className="styled-input" style={{ width: '80px', opacity: isPlaying ? 0.7 : 1 }} placeholder="Val…" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && !isPlaying && inputValue.trim() && handleInsert()} />
                    <button className="btn btn-insert" onClick={handleInsert} disabled={isPlaying || !inputValue.trim()}>Insert</button>
                  </div>
                )}
                {(() => {
                  const isHeap = treeType === 'MIN_HEAP' || treeType === 'MAX_HEAP';
                  const canDel = !isPlaying && (isHeap ? insertedValues.length > 0 : ((treeType === 'BST' || treeType === 'AVL') && inputValue.trim()));
                  return (
                    <button className="btn btn-clear" style={{background: 'var(--accent-secondary)', color: 'white', border: 'none', opacity: canDel ? 1 : 0.5}} onClick={handleDelete} disabled={!canDel}>
                      {isHeap ? 'Extract' : 'Delete'}
                    </button>
                  );
                })()}

                {isMobile && (
                  <button 
                    className="btn btn-clear" 
                    style={{ 
                      borderColor: showMobileOptions ? 'var(--accent-primary)' : 'var(--glass-border)', 
                      color: showMobileOptions ? 'var(--accent-primary)' : 'var(--text-primary)' 
                    }} 
                    onClick={() => setShowMobileOptions(!showMobileOptions)}
                  >
                    ⚙️ Options
                  </button>
                )}

                {/* Secondary settings / Playbacks */}
                {(!isMobile || showMobileOptions) && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.35)', padding: '0.4rem 0.6rem', borderRadius: '10px' }}>
                      <button className="btn btn-clear" style={{ padding: '0.4rem 0.6rem', border: 'none' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={!timeline.length||currentStep===0}>⏮ First</button>
                      <button className="btn btn-clear" style={{ padding: '0.4rem 0.6rem', border: 'none' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={!timeline.length||currentStep===0}>◀ Prev</button>
                      <button className="btn btn-clear" style={{ padding: '0.4rem 1rem', border: 'none', background: isPlaying ? 'rgba(59,130,246,0.4)' : 'transparent', fontWeight: 'bold' }} onClick={() => setIsPlaying(p => !p)} disabled={!timeline.length}>{isPlaying ? '⏸' : '▶ Play'}</button>
                      <button className="btn btn-clear" style={{ padding: '0.4rem 0.6rem', border: 'none' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={!timeline.length||currentStep===timeline.length-1}>Next ▶</button>
                      <button className="btn btn-clear" style={{ padding: '0.4rem 0.6rem', border: 'none', fontWeight: 'bold', background: 'rgba(236, 72, 153, 0.2)', color: '#fbcfe8' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={!timeline.length||currentStep===timeline.length-1}>Last ⏭</button>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>{timeline.length ? currentStep + 1 : 0}/{timeline.length}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Speed</span>
                      <input type="range" min={80} max={3500} step={50} value={animationSpeed} onChange={e => setAnimationSpeed(Number(e.target.value))} style={{ width: '85px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} title={`Speed: ${animationSpeed}ms delay`} />
                    </div>

                    {(treeType === 'B_TREE' || treeType === 'B_PLUS_TREE') && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order</span>
                          <select className="styled-select" style={{ padding: '2px 8px', fontSize: '0.85rem', width: 'auto' }} value={bTreeOrder} onChange={e => setBTreeOrder(Number(e.target.value))}>
                            {[3,4,5,6,7,8,9,10].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Split</span>
                          <select className="styled-select" style={{ padding: '2px 8px', fontSize: '0.85rem', width: 'auto' }} value={splitStrategy} onChange={e => setSplitStrategy(e.target.value)}>
                            <option value="MEDIAN">Median</option>
                            <option value="LEFT_BIASED">Left-Biased</option>
                            <option value="RIGHT_BIASED">Right-Biased</option>
                          </select>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', userSelect: 'none' }}>
                          <input type="checkbox" checked={showBoundsInfo} onChange={e => setShowBoundsInfo(e.target.checked)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                          <span>Node Bounds</span>
                        </label>
                      </>
                    )}

                    {(treeType === 'BST' || treeType === 'AVL') && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Shift on Delete</span>
                        <select className="styled-select" style={{ padding: '2px 8px', fontSize: '0.85rem', width: 'auto' }} value={deleteStrategy} onChange={e => setDeleteStrategy(e.target.value)}>
                          <option value="RIGHT">Right (Successor)</option>
                          <option value="LEFT">Left (Predecessor)</option>
                        </select>
                      </div>
                    )}

                    {treeType === 'FENWICK_TREE' && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', userSelect: 'none' }}>
                        <input type="checkbox" checked={fenwickBitMode} onChange={e => setFenwickBitMode(e.target.checked)} style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                        <span>Show Bit Representation</span>
                      </label>
                    )}
                    
                    {isMobile && (
                      <>
                        <button className="btn btn-clear" onClick={handleClear}>Clear</button>
                        <button className="btn btn-clear" onClick={() => setIsSettingsOpen(true)}>⚙ Settings</button>
                      </>
                    )}
                  </>
                )}

                {/* Laptop-only options toggle panel nodes */}
                {!isMobile && (
                  <>
                    <button className="btn btn-clear" onClick={handleClear}>Clear</button>
                    <button className="btn btn-clear" onClick={() => setShowTreeLogPanel(p => !p)}>📋 {showTreeLogPanel ? 'Hide Log' : 'Show Log'}</button>
                    <button className="btn btn-clear" onClick={() => setShowCode(p => !p)}>💻 {showCode ? 'Hide Code' : 'Show Code'}</button>
                    <button className="btn btn-clear" onClick={() => setIsSettingsOpen(true)}>⚙ Settings</button>
                  </>
                )}
                <button className="btn btn-clear" onClick={() => setAppMode(null)}>🏠 Home</button>
              </div>
            </header>

            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', transition: 'width 0.25s' }} />
            </div>

            {/* Globally Attached/Sticky Traversals & Heap Array Bar */}
            {frame.root && (treeType === 'BST' || treeType === 'AVL' || treeType === 'RB_TREE') && (() => {
              const travs = getTraversals(frame.root);
              return (
                <div style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)', padding: '8px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', fontSize: '0.9rem', flexShrink: 0, zIndex: 20 }}>
                  <div><span style={{color: 'var(--accent-primary)', fontWeight: 'bold'}}>Inorder:</span> <span style={{fontFamily: 'monospace', color: '#e2e8f0', wordBreak: 'break-all'}}>{travs.inorder || 'None'}</span></div>
                  <div><span style={{color: '#a78bfa', fontWeight: 'bold'}}>Preorder:</span> <span style={{fontFamily: 'monospace', color: '#e2e8f0', wordBreak: 'break-all'}}>{travs.preorder || 'None'}</span></div>
                  <div><span style={{color: '#f43f5e', fontWeight: 'bold'}}>Postorder:</span> <span style={{fontFamily: 'monospace', color: '#e2e8f0', wordBreak: 'break-all'}}>{travs.postorder || 'None'}</span></div>
                </div>
              );
            })()}
            {frame.root && (treeType === 'MIN_HEAP' || treeType === 'MAX_HEAP') && (
              <div style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--glass-border)', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', flexShrink: 0, overflowX: 'auto', zIndex: 20 }}>
                <span style={{color: 'var(--accent-primary)', fontWeight: 'bold', whiteSpace: 'nowrap'}}>Heap Array:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {insertedValues.map((v, idx) => (
                    <span key={idx} style={{ background: frame.highlight === v ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', color: frame.highlight === v ? '#fff' : '#e2e8f0', fontWeight: 'bold' }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isMobile && (
              <div className="mobile-tabs-container">
                <button className={`mobile-tab-btn ${mobileTab === 'vis' ? 'active' : ''}`} onClick={() => setMobileTab('vis')}>📊 Visualizer</button>
                <button className={`mobile-tab-btn ${mobileTab === 'code' ? 'active' : ''}`} onClick={() => { setMobileTab('code'); setShowCode(true); }}>💻 Code</button>
                <button className={`mobile-tab-btn ${mobileTab === 'log' ? 'active' : ''}`} onClick={() => { setMobileTab('log'); setShowTreeLogPanel(true); }}>📋 Logs</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, padding: isMobile ? '0.25rem' : '0.75rem', gap: '0.75rem', overflow: 'hidden' }}>
              <div style={{ display: (isMobile && mobileTab !== 'vis') ? 'none' : 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="tree-container" ref={containerRef} style={{ flex: 1, background: 'rgba(15,23,42,0.5)', borderRadius: '14px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'auto', minHeight: '260px', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
                    {frame.root ? renderTreeSVG(frame.root, frame.highlight) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                        <span style={{ fontSize: '2.5rem' }}>🌱</span>
                        <p style={{ fontSize: '1rem' }}>Insert a value to start building the tree</p>
                        <p style={{ fontSize: '0.82rem', opacity: 0.6 }}>Try values like 50, 30, 70, 20, 40 …</p>
                      </div>
                    )}

                    {showBoundsInfo && (treeType === 'B_TREE' || treeType === 'B_PLUS_TREE') && (() => {
                      const bounds = getBTreeBounds(bTreeOrder, treeType === 'B_PLUS_TREE', splitStrategy);
                      return (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          zIndex: 10,
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '12px',
                          padding: '12px',
                          width: '240px',
                          fontSize: '0.82rem',
                          color: 'var(--text-primary)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          animation: 'fadeIn 0.2s ease-out',
                          pointerEvents: 'auto'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>📊 {treeType === 'B_TREE' ? 'B-Tree' : 'B+ Tree'} (M={bTreeOrder})</span>
                            <button onClick={() => setShowBoundsInfo(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', padding: '0 4px', lineHeight: 1 }}>×</button>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Keys per Node:</span>
                              <span style={{ fontWeight: 'bold' }}>{bounds.standardMinKeys} to {bounds.standardMaxKeys}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Children per Node:</span>
                              <span style={{ fontWeight: 'bold' }}>{bounds.standardMinChildren} to {bounds.standardMaxChildren}</span>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px', paddingTop: '6px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Split Sizes ({splitStrategy.replace('_', ' ')}):</span>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Internal Node Split:</span>
                                <span style={{ fontFamily: 'monospace' }}>{bounds.leftSplitKeys} ← [up] → {bounds.rightSplitKeys}</span>
                              </div>
                              {treeType === 'B_PLUS_TREE' && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '2px' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>Leaf Node Split:</span>
                                  <span style={{ fontFamily: 'monospace' }}>{bounds.leftLeafSplitKeys} ← [copy] → {bounds.rightLeafSplitKeys}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {showTreeLogPanel && !isMobile && (
                  <div
                    style={{
                      position: 'fixed',
                      left: `${Math.max(0, Math.min(treeLogPosition.x, window.innerWidth - treeLogSize.width))}px`,
                      top: `${Math.max(0, Math.min(treeLogPosition.y, window.innerHeight - treeLogSize.height))}px`,
                      width: `${treeLogSize.width}px`,
                      height: `${treeLogSize.height}px`,
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      zIndex: 99,
                      overflow: 'hidden'
                    }}
                  >
                    {/* Drag Handle Header */}
                    <div
                      className="log-drag-handle"
                      onMouseDown={handleTreeLogMouseDown}
                      onTouchStart={handleTreeLogMouseDown}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderBottom: '1px solid var(--glass-border)',
                        cursor: 'move',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        userSelect: 'none',
                        flexShrink: 0,
                        touchAction: 'none'
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📋 Execution Log & Active State
                      </span>
                      <button
                        onClick={() => setShowTreeLogPanel(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          padding: '0 4px',
                          lineHeight: 1
                        }}
                        title="Hide Log"
                      >
                        ×
                      </button>
                    </div>

                    {/* Dual Column Content Body */}
                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                      {/* Left Column: Stats & Operations Details */}
                      <div style={{ 
                        width: `${activeStateWidth}px`, 
                        background: 'rgba(0,0,0,0.25)', 
                        borderRight: '1px solid var(--glass-border)',
                        padding: '10px 12px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        overflowY: 'auto',
                        flexShrink: 0
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                          Active State
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Target Value:</span>
                          <span style={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 'bold', 
                            color: frame.highlight !== undefined && frame.highlight !== null ? '#fbbf24' : 'var(--text-primary)',
                            background: frame.highlight !== undefined && frame.highlight !== null ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {frame.highlight !== undefined && frame.highlight !== null ? String(frame.highlight) : 'None'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Event / Action:</span>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 700, 
                            color: frame.rotation ? '#f43f5e' : '#60a5fa',
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }} title={frame.rotation || 'Normal'}>
                            {frame.rotation ? '⚡ Rotation/Split' : 'Normal Trace'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Inserted Nodes:</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{insertedValues.length}</span>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Timeline Nodes History:</div>
                          <div style={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            background: 'rgba(0,0,0,0.12)', 
                            borderRadius: '6px', 
                            padding: '4px 6px',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.4',
                            wordBreak: 'break-all'
                          }}>
                            {insertedValues.length > 0 ? insertedValues.join(', ') : 'No nodes inserted yet'}
                          </div>
                        </div>
                      </div>

                      {/* Vertical Column split resize handle */}
                      <div 
                        onMouseDown={handleActiveStateColDragStart}
                        onTouchStart={handleActiveStateColDragStart}
                        style={{
                          width: '8px',
                          cursor: 'col-resize',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderLeft: '1px solid var(--glass-border)',
                          borderRight: '1px solid var(--glass-border)',
                          alignSelf: 'stretch',
                          transition: 'background 0.2s',
                          borderRadius: '3px',
                          flexShrink: 0,
                          touchAction: 'none'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(96,165,250,0.5)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        title="Drag to resize columns"
                      />

                      {/* Right Column: Scrolling Logs */}
                      <div style={{ 
                        flex: 1, 
                        background: 'rgba(0,0,0,0.15)', 
                        borderRadius: '10px', 
                        padding: '0.75rem 1rem', 
                        overflowY: 'auto',
                        border: '1px solid rgba(255,255,255,0.03)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '8px' }}>
                          Simulation Steps Log
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                          {frame.logs.map((log, i) => (
                            <div key={i} className={`execution-log-item ${log.type}`} style={{ padding: '3px 0', fontSize: '0.85rem' }}>
                              {highlightLogText(log.text)}
                            </div>
                          ))}
                          <div ref={logEndRef} />
                        </div>
                      </div>
                    </div>

                    {/* Resize Handle */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '4px',
                        bottom: '4px',
                        width: '12px',
                        height: '12px',
                        cursor: 'se-resize',
                        background: 'linear-gradient(135deg, transparent 60%, rgba(255,255,255,0.3) 60%)',
                        zIndex: 100,
                        touchAction: 'none'
                      }}
                      onMouseDown={handleTreeLogResizeMouseDown}
                      onTouchStart={handleTreeLogResizeMouseDown}
                      title="Drag to resize panel"
                    />
                  </div>
                )}
              </div>

              {/* Inline mobile execution logs */}
              {isMobile && showTreeLogPanel && mobileTab === 'log' && (
                <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', padding: '0.85rem', overflow: 'hidden', height: '100%', width: '100%' }}>
                  <div style={{ padding: '6px 12px', background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📋 Execution Log & Active State
                    </span>
                  </div>
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden', gap: '10px', marginTop: '10px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '4px' }}>
                        Active State
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Target Value:</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: frame.highlight !== undefined && frame.highlight !== null ? '#fbbf24' : 'var(--text-primary)', background: frame.highlight !== undefined && frame.highlight !== null ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                          {frame.highlight !== undefined && frame.highlight !== null ? String(frame.highlight) : 'None'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Event / Action:</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: frame.rotation ? '#f43f5e' : '#60a5fa' }}>
                          {frame.rotation ? '⚡ Rotation/Split' : 'Normal Trace'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Inserted Nodes:</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{insertedValues.length}</span>
                      </div>
                      
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Timeline Nodes History:</div>
                        <div style={{ overflowY: 'auto', background: 'rgba(0,0,0,0.12)', borderRadius: '6px', padding: '4px 6px', fontSize: '0.75rem', color: 'var(--text-secondary)', maxHeight: '60px', wordBreak: 'break-all' }}>
                          {insertedValues.length > 0 ? insertedValues.join(', ') : 'No nodes inserted yet'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.15)', borderRadius: '10px', padding: '0.75rem 1rem', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', marginBottom: '8px', flexShrink: 0 }}>
                        Simulation Steps Log
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {frame.logs.map((log, i) => (
                          <div key={i} className={`execution-log-item ${log.type}`} style={{ padding: '3px 0', fontSize: '0.85rem' }}>
                            {highlightLogText(log.text)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showCode && (isMobile ? mobileTab === 'code' : true) && (
                <>
                  {/* Vertical Drag Handle for column resizing */}
                  {!isMobile && (
                    <div onMouseDown={handleColDragStart} onTouchStart={handleColDragStart} style={{ width: '8px', background: 'var(--glass-border)', borderRadius: '4px', cursor: 'col-resize', flexShrink: 0, transition: 'background 0.2s', touchAction: 'none' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(96,165,250,0.5)'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--glass-border)'}
                      title="Drag to resize columns" />
                  )}

                  {/* Right Column Sidebar: Auto-Generated Code */}
                  <div style={{ width: isMobile ? '100%' : `${logWidth}px`, flexShrink: 0, background: 'var(--bg-secondary)', borderRadius: '14px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', padding: '0.85rem', overflow: 'hidden', height: isMobile ? '100%' : 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem', marginBottom: '0.6rem', flexShrink: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Auto-Generated Code</h3>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => {
                              setIsUpcomingOpen(true);
                            }}
                            className="btn btn-clear" 
                            style={{ padding: '2px 8px', fontSize: '0.78rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px' }}
                          >
                            ▶ Run Code
                          </button>
                          <button 
                            onClick={handleCopyTreeCode} 
                            className="btn btn-clear" 
                            style={{ padding: '2px 8px', fontSize: '0.78rem', whiteSpace: 'nowrap', border: '1px solid var(--glass-border)', borderRadius: '6px' }}
                          >
                            {treeCodeCopied ? '✓ Copied' : '📋 Copy'}
                          </button>
                        </div>
                      </div>
                      
                  {/* Row 1: Language pills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>🌐 Lang:</span>
                    {['C','Java','Python','JS'].map(lang => (
                      <button key={lang} onClick={() => setCodeLang(lang)}
                        style={{
                          padding: '2px 9px',
                          fontSize: '0.74rem',
                          borderRadius: '5px',
                          border: codeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                          background: codeLang === lang ? 'var(--accent-primary)' : 'transparent',
                          color: codeLang === lang ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: codeLang === lang ? 700 : 400,
                          transition: 'all 0.15s'
                        }}
                      >{lang === 'JS' ? 'JavaScript' : lang}</button>
                    ))}
                  </div>
                  {/* Row 2: Include Deletes checkbox */}
                  <div style={{ paddingTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <input type="checkbox" checked={showDeletionsInCode} onChange={e => setShowDeletionsInCode(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
                      <span>Include Deletes</span>
                    </label>
                  </div>
                    </div>
                    
                    <div className="code-box" style={{ flex: 1, overflowY: 'auto' }}>
                      <pre style={{ 
                        margin: 0, 
                        color: 'var(--text-primary)', 
                        fontFamily: "'Fira Code', monospace", 
                        lineHeight: '1.5',
                        fontSize: '11px',
                        whiteSpace: 'pre'
                      }}>
                        {toAllman(getFullCodeTemplate(codeLang, treeType, showDeletionsInCode ? operationsLog : insertedValues.map(v => ({ op: 'insert', val: v }))))}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isSettingsOpen && renderSettingsModal()}
      {isUpcomingOpen && renderUpcomingFeaturesModal()}

      {/* Copy Success & Options Modal */}
      {copyModalData.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}
              onClick={() => setCopyModalData(prev => ({ ...prev, isOpen: false }))}
            >
              ✕
            </button>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
            <h2 className="title-gradient" style={{ fontSize: '1.6rem', margin: '0 0 0.5rem 0' }}>Code Copied!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              The full code template has been successfully copied to your clipboard. What would you like to do next?
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                className="btn btn-insert"
                style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}
                onClick={() => {
                  setCustomCode(copyModalData.code);
                  setCodeLang(copyModalData.language);
                  setAppMode('LINE_BY_LINE_VIS');
                  setSetupComplete(true);
                  setCopyModalData(prev => ({ ...prev, isOpen: false }));
                }}
              >
                🐛 Go to Line-by-Line Debugger
              </button>

              <button 
                className="btn btn-clear"
                style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}
                onClick={() => {
                  copyToClipboard(copyModalData.code).then(() => {
                    alert("✨ Copied clean code template optimized for online visualizers (like PythonTutor or VisuAlgo)!");
                  }).catch(() => {
                    alert("❌ Failed to copy to clipboard.");
                  });
                  setCopyModalData(prev => ({ ...prev, isOpen: false }));
                }}
              >
                🌐 Copy for Online Visualizers
              </button>

              <button 
                className="btn btn-clear"
                style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}
                onClick={() => {
                  const isJava = copyModalData.language?.toLowerCase() === 'java';
                  const isCpp = copyModalData.language?.toLowerCase() === 'c++';
                  const isPython = copyModalData.language?.toLowerCase() === 'python';
                  
                  let formattedCode = copyModalData.code;
                  let targetIDE = 'IDE';
                  
                  if (isJava) {
                    targetIDE = 'Eclipse';
                    formattedCode = `// Eclipse IDE Compatibility Code\n// To run in Eclipse:\n// 1. Create a new Java Project\n// 2. Create a new class named Main (or name matching the public class)\n// 3. Paste this code inside Main.java\n// 4. Note: If your file is inside a package, keep the 'package <package_name>;' declaration at the very top!\n\n` + copyModalData.code;
                  } else if (isCpp) {
                    targetIDE = 'Eclipse CDT';
                    formattedCode = `// Eclipse CDT Compatibility Code\n// 1. Create a C++ project in Eclipse\n// 2. Paste this code in your main .cpp file\n\n` + copyModalData.code;
                  } else if (isPython) {
                    targetIDE = 'PyCharm';
                    formattedCode = `# PyCharm IDE Compatibility Code\n# To run in PyCharm:\n# 1. Create a new Python file (e.g. main.py)\n# 2. Paste this code and run it\n\n` + copyModalData.code;
                  }
                  
                  copyToClipboard(formattedCode).then(() => {
                    alert(`Formatted code copied to clipboard for ${targetIDE}!`);
                  }).catch(() => {
                    alert("❌ Failed to copy to clipboard.");
                  });
                  setCopyModalData(prev => ({ ...prev, isOpen: false }));
                }}
              >
                {copyModalData.language?.toLowerCase() === 'java' && "☕ Copy for Eclipse IDE"}
                {copyModalData.language?.toLowerCase() === 'python' && "🐍 Copy for PyCharm"}
                {copyModalData.language?.toLowerCase() === 'c++' && "⚙️ Copy for Eclipse CDT"}
                {copyModalData.language?.toLowerCase() !== 'java' && copyModalData.language?.toLowerCase() !== 'python' && copyModalData.language?.toLowerCase() !== 'c++' && "💻 Copy for IDE"}
              </button>

              <button 
                className="btn btn-clear"
                style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}
                onClick={() => {
                  let vscodeCode = copyModalData.code;
                  if (copyModalData.language === 'Java') {
                    vscodeCode = `// VS Code Java Compatibility Code\n// Ensure Extension Pack for Java is installed. Click 'Run' above the main class.\n\n` + copyModalData.code;
                  } else if (copyModalData.language === 'C++') {
                    vscodeCode = `// VS Code C++ Compatibility Code\n// Ensure C/C++ extension is installed. Press Ctrl+Alt+N or click run.\n\n` + copyModalData.code;
                  } else if (copyModalData.language === 'JS') {
                    vscodeCode = `// VS Code Node.js Compatibility Code\n// Run with: node <filename>.js\n\n` + copyModalData.code;
                  }
                  copyToClipboard(vscodeCode).then(() => {
                    alert("💻 Formatted code copied to clipboard for VS Code!");
                  }).catch(() => {
                    alert("❌ Failed to copy to clipboard.");
                  });
                  setCopyModalData(prev => ({ ...prev, isOpen: false }));
                }}
              >
                💻 Copy for VS Code
              </button>
            </div>
          </div>
        </div>
      )}
      {isPageLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <svg className="bike" viewBox="0 0 48 30" width="80px" height="50px" style={{ color: 'var(--accent-primary)' }}>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
              <g transform="translate(9.5,19)">
                <circle className="bike__tire" r="9" strokeDasharray="56.549 56.549" />
                <g className="bike__spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
                  <circle className="bike__spokes" r="5" />
                  <circle className="bike__spokes" r="5" transform="rotate(180,0,0)" />
                </g>
              </g>
              <g transform="translate(24,19)">
                <g className="bike__pedals-spin" strokeDasharray="25.133 25.133" strokeDashoffset="-21.991" transform="rotate(67.5,0,0)">
                  <circle className="bike__pedals" r="4" />
                  <circle className="bike__pedals" r="4" transform="rotate(180,0,0)" />
                </g>
              </g>
              <g transform="translate(38.5,19)">
                <circle className="bike__tire" r="9" strokeDasharray="56.549 56.549" />
                <g className="bike__spokes-spin" strokeDasharray="31.416 31.416" strokeDashoffset="-23.562">
                  <circle className="bike__spokes" r="5" />
                  <circle className="bike__spokes" r="5" transform="rotate(180,0,0)" />
                </g>
              </g>
              <polyline className="bike__seat" points="14 3,18 3" strokeDasharray="5 5" />
              <polyline className="bike__body" points="16 3,24 19,9.5 19,18 8,34 7,24 19" strokeDasharray="79 79" />
              <path className="bike__handlebars" d="m30,2h6s1,0,1,1-1,1-1,1" strokeDasharray="10 10" />
              <polyline className="bike__front" points="32.5 2,38.5 19" strokeDasharray="19 19" />
            </g>
          </svg>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '1.5rem', fontFamily: 'inherit', letterSpacing: '1px' }}>Loading Studio...</h3>
        </div>
      )}

      {/* Interactive Review & Feedback Modal */}
      {isFeedbackOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '520px', width: '90%', position: 'relative', overflow: 'hidden', padding: '2rem', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            {!isOtpVerifying && !isFeedbackSubmitted && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.85rem', marginBottom: '1.2rem', flexShrink: 0 }}>
                  <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.6rem', textAlign: 'left', fontWeight: 'bold' }}>Send Feedback</h2>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.4rem', cursor: 'pointer', transition: 'color 0.2s' }} onClick={() => setIsFeedbackOpen(false)} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>✕</button>
                </div>

                <div ref={feedbackScrollRef} style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {/* Feedback Category selection - 6 distinct categories including AI Assistant */}
                  <div className="select-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Feedback Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { id: 'AI Assistant / Bot', label: 'AI Bot & Mentor', emoji: '🤖' },
                        { id: 'Bug Report', label: 'Bug Report', emoji: '🐛' },
                        { id: 'DSA & Visualizer', label: 'DSA & Visualizer', emoji: '⚡' },
                        { id: 'Feature Request', label: 'Feature Request', emoji: '✨' },
                        { id: 'Suggestion', label: 'Suggestion', emoji: '💡' },
                        { id: 'Other', label: 'Other', emoji: '📝' }
                      ].map(type => {
                        const isSelected = feedbackCategory === type.id;
                        return (
                          <div 
                            key={type.id}
                            onClick={() => setFeedbackCategory(type.id)}
                            style={{
                              background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                              border: isSelected ? '2px solid #38bdf8' : '1px solid var(--glass-border)',
                              borderRadius: '12px',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              color: isSelected ? '#38bdf8' : 'var(--text-primary)',
                              fontWeight: isSelected ? 'bold' : 'normal',
                              boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
                            }}
                            onMouseEnter={e => { if(!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={e => { if(!isSelected) e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                          >
                            <span style={{ fontSize: '1.25rem' }}>{type.emoji}</span>
                            <span style={{ fontSize: '0.9rem' }}>{type.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating selection - Star layout matching screenshot */}
                  <div className="select-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Rate Your Experience</label>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '2.4rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          style={{ 
                            cursor: 'pointer', 
                            color: star <= rating ? '#fbbf24' : '#4b5563', 
                            transition: 'all 0.2s', 
                            transform: star <= rating ? 'scale(1.1)' : 'scale(1)' 
                          }}
                          onClick={() => setRating(star)}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                          onMouseLeave={e => e.currentTarget.style.transform = star <= rating ? 'scale(1.1)' : 'scale(1)'}
                        >
                          {star <= rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Name input */}
                  <div className="select-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Your Name</label>
                    <input 
                      type="text"
                      className="styled-input" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} 
                      placeholder="Enter your name" 
                      value={feedbackName} 
                      onChange={e => setFeedbackName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email verification input */}
                  <div className="select-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Your Email Address</label>
                    <p style={{ fontSize: '0.78rem', color: '#60a5fa', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                      💡 Please give your correct email so we can contact you and notify you once the problem you reported is fixed or the feature is developed!
                    </p>
                    <input 
                      type="email"
                      className="styled-input" 
                      style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} 
                      placeholder="name@example.com" 
                      value={feedbackEmail} 
                      onChange={e => setFeedbackEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Quick Topics & Suggestions */}
                  <div style={{ marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>💡 Quick topics to add:</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { text: '🤖 AI Accuracy & Explanations', cat: 'AI Assistant / Bot' },
                        { text: '💧 AI Transparency & Motion', cat: 'AI Assistant / Bot' },
                        { text: '⚡ Add More DSA Patterns', cat: 'DSA & Visualizer' },
                        { text: '🎨 UI & Theme Polish', cat: 'Suggestion' },
                        { text: '🐞 Animation Step Bug', cat: 'Bug Report' }
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFeedbackCategory(chip.cat);
                            if (!feedbackText.includes(chip.text)) {
                              setFeedbackText(prev => prev ? `${prev}\n- ${chip.text}: ` : `${chip.text}: `);
                            }
                          }}
                          style={{
                            background: 'rgba(56, 189, 248, 0.12)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#38bdf8',
                            borderRadius: '8px',
                            padding: '3px 8px',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'}
                        >
                          {chip.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment box */}
                  <div className="select-group" style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Your Message</label>
                    <textarea 
                      className="styled-input" 
                      style={{ width: '100%', height: '90px', resize: 'none', padding: '0.65rem 0.85rem', fontFamily: 'sans-serif', fontSize: '0.95rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} 
                      placeholder="Tell us your feedback about the AI Mentor, Visualizers, DSA study notes, or features you want..." 
                      value={feedbackText} 
                      onChange={e => setFeedbackText(e.target.value)} 
                    />
                  </div>

                  {feedbackError && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⚠️ {feedbackError}
                    </p>
                  )}
                </div>

                <button 
                  className="btn btn-start" 
                  style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', border: 'none', cursor: isFeedbackVerifyingOtp ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', flexShrink: 0 }} 
                  onClick={submitDirectFeedback}
                  disabled={isFeedbackVerifyingOtp}
                >
                  {isFeedbackVerifyingOtp ? '⏳ Submitting...' : 'Submit Feedback'}
                </button>
              </>
            )}

            {isOtpVerifying && !isFeedbackSubmitted && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.85rem', marginBottom: '1.2rem', flexShrink: 0 }}>
                  <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>Verify Your Email</h2>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setIsFeedbackOpen(false)}>✕</button>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.5rem 0', textAlign: 'center' }}>
                  We sent a 6-digit verification code to **{feedbackEmail}**.<br />Enter the code to verify your feedback.
                </p>

                <div className="select-group" style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
                  <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px', textAlign: 'center' }}>Enter Verification Code</label>
                  <input 
                    type="text" 
                    className="styled-input" 
                    style={{ width: '100%', textAlign: 'center', letterSpacing: '8px', fontSize: '1.6rem', fontWeight: 'bold', fontFamily: 'monospace', padding: '0.65rem', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1.5px solid var(--accent-primary)', color: '#fbbf24' }} 
                    placeholder="------" 
                    maxLength={6}
                    value={feedbackOtpCode} 
                    onChange={e => setFeedbackOtpCode(e.target.value.replace(/\D/g, ''))} 
                  />
                </div>

                {feedbackError && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 15px 0', textAlign: 'center' }}>
                    ⚠️ {feedbackError}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
                  <button 
                    className="btn btn-start" 
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', cursor: isFeedbackVerifyingOtp ? 'not-allowed' : 'pointer' }} 
                    onClick={verifyOtpAndSubmit}
                    disabled={isFeedbackVerifyingOtp}
                  >
                    {isFeedbackVerifyingOtp ? '⏳ Verifying Code...' : 'Verify & Submit Review'}
                  </button>

                  <button 
                    className="btn btn-clear" 
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }} 
                    onClick={() => { setIsOtpVerifying(false); setFeedbackError(''); }}
                  >
                    ← Edit Email Address
                  </button>
                </div>
              </>
            )}

            {isFeedbackSubmitted && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', flexShrink: 0 }}>
                <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '10px', animation: 'pulse 1s infinite' }}>🎉</span>
                <h2 className="title-gradient" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Thank You!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                  Your <strong>{rating}-Star</strong> review in <strong>{feedbackCategory}</strong> was saved successfully! Thank you for helping us improve.
                </p>
                <button className="btn btn-clear" style={{ width: '150px', borderRadius: '10px' }} onClick={() => { setIsFeedbackOpen(false); setIsOtpVerifying(false); setFeedbackOtpCode(''); }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Developer Feedback Console Modal */}
      {isAdminFeedbackOpen && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content" style={{ maxWidth: '650px', width: '90%', position: 'relative', overflow: 'hidden', padding: '2.2rem', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <button style={{ position: 'absolute', right: '15px', top: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setIsAdminFeedbackOpen(false)}>✕</button>
            
            {!isAdminAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>🛠️</span>
                  <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.7rem', fontWeight: 'bold' }}>Developer Authentication</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.2rem 0' }}>
                  Access to the persistent feedback database console is restricted. Please verify your Developer PIN to unlock logs.
                </p>

                <div className="select-group" style={{ marginBottom: '1.2rem' }}>
                  <label style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Developer Security PIN</label>
                  <input 
                    type="password" 
                    className="styled-input" 
                    style={{ width: '100%', padding: '0.65rem 0.85rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', textAlign: 'center', letterSpacing: '4px' }} 
                    placeholder="••••" 
                    value={adminPinInput} 
                    onChange={e => setAdminPinInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && loginAdminConsole()}
                  />
                </div>

                {adminErrorMessage && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>
                    ⚠️ {adminErrorMessage}
                  </p>
                )}

                <button 
                  className="btn btn-start" 
                  style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }} 
                  onClick={loginAdminConsole}
                >
                  Unlock Developer Console
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>🛠️</span>
                  <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.8rem', textAlign: 'left', fontWeight: 'bold' }}>Developer Feedback Console</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                  Monitor and inspect user-submitted ratings, emails, and bug reports from the PostgreSQL database server.
                </p>
                
                {/* Filter / Search Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexShrink: 0 }}>
                  <input 
                    type="text" 
                    className="styled-input" 
                    style={{ flex: 1, padding: '0.5rem 0.85rem', fontSize: '0.88rem', borderRadius: '8px' }}
                    placeholder="Search by email or comment details..."
                    value={feedbackSearchQuery}
                    onChange={e => setFeedbackSearchQuery(e.target.value)}
                  />
                  {feedbackSearchQuery && (
                    <button className="btn btn-clear" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setFeedbackSearchQuery('')}>Clear</button>
                  )}
                  <button 
                    className="btn btn-clear" 
                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderColor: 'rgba(59,130,246,0.3)', color: '#60a5fa', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', gap: '5px' }} 
                    onClick={() => fetchAdminFeedbacks(adminPinInput.trim() || 'Irctc@11')}
                  >
                    🔄 Refresh
                  </button>
                </div>

                {/* Scrollable list of feedback logs */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px', minHeight: '200px' }}>
                  {(() => {
                    const filtered = adminFeedbacksList.filter(log => 
                      !feedbackSearchQuery.trim() || 
                      (log.email || '').toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                      (log.feedback_text || '').toLowerCase().includes(feedbackSearchQuery.toLowerCase()) ||
                      (log.category || '').toLowerCase().includes(feedbackSearchQuery.toLowerCase())
                    );

                    if (filtered.length === 0) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', color: 'var(--text-secondary)', gap: '10px' }}>
                          <span style={{ fontSize: '2.5rem' }}>📂</span>
                          <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                            {adminFeedbacksList.length === 0 ? 'No feedbacks found in PostgreSQL database.' : 'No database records match your search filters.'}
                          </p>
                        </div>
                      );
                    }

                    return filtered.map((log, idx) => (
                      <div key={log.id || idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                            {log.email}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            🕒 {new Date(log.created_at || log.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', background: log.category === 'Bug Report' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', border: `1px solid ${log.category === 'Bug Report' ? '#ef4444' : '#3b82f6'}`, color: log.category === 'Bug Report' ? '#f87171' : '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                            {log.category}
                          </span>
                          <span style={{ color: '#fbbf24', fontSize: '1rem' }}>
                            {'★'.repeat(log.rating || 5)}{'☆'.repeat(5 - (log.rating || 5))}
                          </span>
                        </div>

                        {log.feedback_text && (
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', margin: '4px 0 0 0', lineHeight: '1.45', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.15)', padding: '0.6rem 0.8rem', borderRadius: '6px', borderLeft: '3px solid var(--glass-border)' }}>
                            {log.feedback_text}
                          </p>
                        )}
                      </div>
                    ));
                  })()}
                </div>

                {/* Bottom Admin Control actions */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', flexShrink: 0 }}>
                  <button 
                    className="btn btn-clear" 
                    style={{ flex: 1, borderColor: '#ef4444', color: '#f87171', background: 'rgba(239,68,68,0.05)', fontSize: '0.85rem' }} 
                    onClick={clearAdminFeedbacks}
                  >
                    🗑️ Clear Database Logs
                  </button>
                  <button 
                    className="btn btn-clear" 
                    style={{ flex: 1, borderColor: 'var(--accent-primary)', color: '#60a5fa', background: 'rgba(59,130,246,0.05)', fontSize: '0.85rem' }} 
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(adminFeedbacksList, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `postgresql_feedback_export_${new Date().toISOString().slice(0,10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📥 Export as JSON
                  </button>
                  <button 
                    className="btn btn-start" 
                    style={{ width: '120px', padding: '0.6rem', fontSize: '0.9rem' }} 
                    onClick={() => setIsAdminFeedbackOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Footer with Feedback options */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1.5rem 2rem 2.5rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-primary)', marginTop: !appMode ? '3.5rem' : '1.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© {new Date().getFullYear()} Algorithm Visualizer Studio. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="btn btn-clear" 
              style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.25s' }}
              onClick={() => { setIsFeedbackOpen(true); setIsFeedbackSubmitted(false); setRating(0); setFeedbackText(''); setFeedbackEmail(''); }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
            >
              💬 Feel any error or problem? Give Feedback
            </button>
            {(new URLSearchParams(window.location.search).get('dev') === 'true' || new URLSearchParams(window.location.search).get('admin') === 'true') && (
              <button 
                className="btn btn-clear" 
                style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '30px', cursor: 'pointer', color: 'var(--accent-primary)', transition: 'all 0.25s' }}
                onClick={() => { setIsAdminFeedbackOpen(true); }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                title="View submitted feedback entries to inspect and debug code issues"
              >
                🛠️ Feedback Console
              </button>
            )}
          </div>
        </div>
      </div>
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={runnerCode}
        language={runnerLang}
      />
      <TopicInfoModal
        topicKey={treeType}
        isOpen={showTopicInfo}
        onClose={() => setShowTopicInfo(false)}
      />
      <ChatBot
        customCode={activeCodeForChat || customCode}
        codeLang={activeLangForChat || codeLang}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        currentContext={{
          appMode,
          treeType,
          globalSort,
          globalSearch,
          globalSortSearchTab,
          codeLang: activeLangForChat || codeLang
        }}
      />
    </>
  );
}

export default App;
