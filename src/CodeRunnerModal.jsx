/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import {
  transpileJavaAlgorithm,
  transpileCppAlgorithm,
  executeTranspiledAlgorithm,
} from './algorithmRunner.js';
import { setScreenContext, recordScreenError, clearScreenError } from './screenContext.js';

// Cache for Pyodide instance so it only downloads once per session
let pyodideInstance = null;

async function getPyodideInstance(onStatus) {
  if (pyodideInstance) return pyodideInstance;

  if (!window.loadPyodide) {
    onStatus?.('⏳ Loading in-browser Python WebAssembly runtime (Pyodide)...');
    await new Promise((resolve, reject) => {
      const existing = document.getElementById('pyodide-loader-script');
      if (existing) {
        if (window.loadPyodide) return resolve();
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', () => reject(new Error('Failed to load Pyodide script from CDN.')));
        return;
      }
      const script = document.createElement('script');
      script.id = 'pyodide-loader-script';
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load Pyodide WebAssembly runtime from CDN.'));
      document.head.appendChild(script);
    });
  }

  onStatus?.('⏳ Initializing Python 3.12 WebAssembly environment...');
  pyodideInstance = await window.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
  });
  return pyodideInstance;
}

const CodeRunnerModal = ({ isOpen, onClose, code, language }) => {
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [exitCode, setExitCode] = useState(null);
  
  // Settings for custom endpoint (e.g. self-hosted Piston or Docker instance)
  const [customEndpoint, setCustomEndpoint] = useState(() => localStorage.getItem('algoflow_custom_runner_url') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [testResult, setTestResult] = useState('');

  const outputEndRef = useRef(null);
  const prevIsOpenRef = useRef(false);
  const prevLangRef = useRef(language);

  useEffect(() => {
    if (isOpen) {
      const openedJustNow = !prevIsOpenRef.current;
      const langChanged = prevLangRef.current !== language;
      prevIsOpenRef.current = true;
      prevLangRef.current = language;

      setScreenContext({
        screenTitle: `${language} Code Runner Terminal`,
        activeAlgo: `${language} Code Execution`,
        screenDataSummary: `Terminal open for ${language}. Stdin: ${stdin ? `"${stdin}"` : 'empty'}. Code length: ${code?.length || 0} characters.`,
        currentStepMessage: `Terminal active for ${language}. Ready to run.`
      });

      if (openedJustNow || langChanged) {
        const langLower = (language || '').toLowerCase();
        let initMsg = `💻 Terminal ready for ${language || 'Code'}.\n`;
        if (langLower.includes('js') || langLower.includes('javascript')) {
          initMsg += '⚡ Engine: In-Browser JavaScript (V8 Engine, Instant Local Execution)\n';
        } else if (langLower.includes('python')) {
          initMsg += '🐍 Engine: In-Browser Python 3.12 (Pyodide WebAssembly, Zero Server Delay)\n';
        } else if (langLower.includes('java')) {
          initMsg += '☕ Engine: Dual Compiler & In-Browser Java Algorithmic Engine\n';
        } else if (langLower.includes('c++') || langLower.includes('cpp')) {
          initMsg += '⚙️ Engine: Dual Compiler & In-Browser C++ Algorithmic Engine\n';
        } else {
          initMsg += '☁️ Engine: Cloud Compiler & Smart Runtime\n';
        }
        initMsg += 'Click "▶ Run Code" to execute.\n';
        setOutput(initMsg);
        setExitCode(null);
        setStatusMessage('');
        setTestResult('');
      }
    } else {
      prevIsOpenRef.current = false;
    }
  }, [isOpen, language, stdin, code?.length]);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, statusMessage]);

  if (!isOpen) return null;

  // Determine which engine will be used
  const langLower = (language || '').toLowerCase();
  const isJS = langLower.includes('js') || langLower.includes('javascript');
  const isPython = langLower.includes('python') || langLower.includes('py');
  const isJava = langLower.includes('java');
  const isCpp = langLower.includes('c++') || langLower.includes('cpp') || langLower === 'c';

  /**
   * Run JavaScript locally in browser
   */
  const runJavaScript = () => {
    const logs = [];
    const errors = [];
    const startTime = window.performance.now();

    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalError = console.error;

    const stringify = (val) => {
      if (val === undefined) return 'undefined';
      if (val === null) return 'null';
      if (typeof val === 'object') {
        try { return JSON.stringify(val); } catch { return String(val); }
      }
      return String(val);
    };

    console.log = (...args) => logs.push(args.map(stringify).join(' '));
    console.info = (...args) => logs.push(args.map(stringify).join(' '));
    console.warn = (...args) => logs.push('⚠️ ' + args.map(stringify).join(' '));
    console.error = (...args) => errors.push('❌ ' + args.map(stringify).join(' '));

    // Stdin simulation for JavaScript
    const stdinLines = (stdin || '').split(/\r?\n/);
    let lineIdx = 0;
    const readline = () => stdinLines[lineIdx++] ?? '';
    const prompt = (msg) => {
      if (msg) logs.push(msg);
      return readline();
    };

    let exitVal = 0;
    try {
      const fn = new Function('readline', 'prompt', code);
      fn(readline, prompt);
    } catch (err) {
      errors.push(`❌ ${err.name}: ${err.message}`);
      exitVal = 1;
    } finally {
      console.log = originalLog;
      console.info = originalInfo;
      console.warn = originalWarn;
      console.error = originalError;
    }

    const duration = (window.performance.now() - startTime).toFixed(2);
    let finalOut = '';
    if (logs.length > 0) finalOut += logs.join('\n') + '\n';
    if (errors.length > 0) finalOut += '\n' + errors.join('\n') + '\n';
    if (!logs.length && !errors.length) finalOut += '(Program executed with empty output)\n';

    finalOut += `\n⚡ Executed locally in browser V8 engine in ${duration}ms.\n`;
    setOutput(finalOut);
    setExitCode(exitVal);
    if (errors.length > 0) {
      recordScreenError(`JavaScript Execution Error: ${errors.join('; ')}`);
    } else {
      clearScreenError();
    }
  };

  /**
   * Run Python locally in browser via Pyodide WebAssembly
   */
  const runPython = async () => {
    try {
      const pyodide = await getPyodideInstance((msg) => setStatusMessage(msg));
      setStatusMessage('🚀 Executing Python code locally...');

      const startTime = window.performance.now();

      const runnerScript = `
import sys
from io import StringIO

_stdin_data = ${JSON.stringify(stdin || '')}
sys.stdin = StringIO(_stdin_data)

_stdout_buffer = StringIO()
_stderr_buffer = StringIO()
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

_user_code = ${JSON.stringify(code)}
_exit_code = 0
try:
    exec(compile(_user_code, '<string>', 'exec'), {})
except SystemExit as se:
    _exit_code = se.code if isinstance(se.code, int) else 0
except Exception:
    import traceback
    traceback.print_exc(file=_stderr_buffer)
    _exit_code = 1

_out = _stdout_buffer.getvalue()
_err = _stderr_buffer.getvalue()
`;

      await pyodide.runPythonAsync(runnerScript);
      const duration = (window.performance.now() - startTime).toFixed(2);

      const out = pyodide.globals.get('_out') || '';
      const err = pyodide.globals.get('_err') || '';
      const exitVal = pyodide.globals.get('_exit_code') ?? 0;

      let finalOut = '';
      if (out) finalOut += out;
      if (err) finalOut += (finalOut ? '\n' : '') + `⚠️ Runtime Error:\n${err}\n`;
      if (!out && !err) finalOut += '(Program executed successfully with empty output)\n';

      finalOut += `\n🐍 Executed locally in Python 3.12 WebAssembly in ${duration}ms.\n`;
      setOutput(finalOut);
      setExitCode(exitVal);
      if (err || exitVal !== 0) {
        recordScreenError(`Python Runtime Error: ${err.slice(0, 200)}`);
      } else {
        clearScreenError();
      }
    } catch (err) {
      console.error('Pyodide execution failed, falling back to cloud:', err);
      setOutput(`⚠️ Local WebAssembly Python engine failed to load (${err.message}). Trying cloud compiler...\n`);
      await runCloud();
    }
  };

  /**
   * Run code via cloud compiler or in-browser algorithmic engine
   */
  const runCloud = async () => {
    setStatusMessage('Compiling & executing code on cloud compiler...');
    const startTime = window.performance.now();

    // 1. If user configured a custom Piston / runner endpoint
    if (customEndpoint && customEndpoint.trim()) {
      try {
        let pistonLang = 'c';
        let filename = 'main.c';
        if (langLower.includes('c++') || langLower.includes('cpp')) {
          pistonLang = 'cpp';
          filename = 'main.cpp';
        } else if (langLower.includes('java')) {
          pistonLang = 'java';
          filename = 'Main.java';
        } else if (langLower.includes('python')) {
          pistonLang = 'python';
          filename = 'main.py';
        } else if (langLower.includes('js') || langLower.includes('javascript')) {
          pistonLang = 'javascript';
          filename = 'main.js';
        }

        const resp = await fetch(customEndpoint.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: pistonLang,
            version: '*',
            files: [{ name: filename, content: code }],
            stdin: stdin || '',
          }),
        });

        if (!resp.ok) throw new Error(`Custom server returned HTTP ${resp.status}`);
        const data = await resp.json();
        const duration = (window.performance.now() - startTime).toFixed(2);

        let finalOut = '';
        if (data.compile?.stderr) finalOut += `⚙️ Compilation Error:\n${data.compile.stderr}\n`;
        else if (data.compile?.output) finalOut += data.compile.output + '\n';

        if (data.run?.stdout) finalOut += data.run.stdout;
        if (data.run?.stderr) finalOut += `⚠️ Runtime Error:\n${data.run.stderr}\n`;
        if (!finalOut) finalOut = '(Program executed successfully with empty output)\n';

        finalOut += `\n☁️ Custom Server executed in ${duration}ms.\n`;
        setOutput(finalOut);
        setExitCode(data.run?.code ?? data.compile?.code ?? 0);
        return;
      } catch (customErr) {
        setOutput(`⚠️ Custom server failed (${customErr.message}). Falling back...\n`);
      }
    }

    // 2. Try the application's built-in /api/execute endpoint (Judge0 / Paiza / Wandbox)
    try {
      const resp = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          stdin: stdin || '',
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const duration = (window.performance.now() - startTime).toFixed(2);

        let finalOut = '';
        if (data.compileOutput) finalOut += `⚙️ Compiler Output:\n${data.compileOutput}\n\n`;
        if (data.stdout) finalOut += data.stdout;
        if (data.stderr) finalOut += (data.stdout ? '\n' : '') + `⚠️ Runtime Error:\n${data.stderr}\n`;
        if (!finalOut) finalOut = '(Program executed successfully with empty output)\n';

        finalOut += `\n☁️ ${data.provider || 'Cloud Compiler'} completed in ${duration}ms.\n`;
        setOutput(finalOut);
        setExitCode(data.exitCode ?? 0);
        return;
      }
    } catch {
      // /api/execute not reachable (e.g. running on static-only hosting without backend)
    }

    // 3. In-Browser Algorithmic Engine Fallback for Java, C++, and C
    try {
      if (isJava) {
        setStatusMessage('⚡ Running via In-Browser Java Algorithmic Engine...');
        const transpiled = transpileJavaAlgorithm(code);
        const result = executeTranspiledAlgorithm(transpiled, stdin);
        
        let finalOut = result.output;
        finalOut += `\n⚡ Executed via AlgoFlow In-Browser Java Engine in ${result.duration}ms (Offline Runtime).\n`;
        setOutput(finalOut);
        setExitCode(result.exitCode);
        return;
      }

      if (isCpp) {
        setStatusMessage('⚡ Running via In-Browser C/C++ Algorithmic Engine...');
        const transpiled = transpileCppAlgorithm(code);
        const result = executeTranspiledAlgorithm(transpiled, stdin);

        let finalOut = result.output;
        finalOut += `\n⚡ Executed via AlgoFlow In-Browser C++ Engine in ${result.duration}ms (Offline Runtime).\n`;
        setOutput(finalOut);
        setExitCode(result.exitCode);
        return;
      }
    } catch (algoErr) {
      console.warn('In-browser algorithmic engine failed:', algoErr);
    }

    // 4. If all methods fail, show clear instructions
    recordScreenError(`Execution service unavailable for ${language} (HTTP 401 on legacy compiler). Recommend switching to JavaScript or Python in-browser.`);
    const msg = [
      '❌ Execution service unavailable for ' + language + '.',
      '',
      '📌 Notice: The public legacy Piston API at emkc.org now requires whitelisted access (HTTP 401).',
      '',
      '💡 Tips:',
      '• Switch to JavaScript or Python to execute 100% in-browser with zero server reliance.',
      '• Open "⚙️ Server Settings" above to point to your local Docker container (e.g. http://localhost:2000/api/v2/execute).',
      '• In local development, running "npm run dev" uses the integrated multi-compiler backend proxy.',
    ].join('\n');

    setOutput(msg);
    setExitCode(1);
  };

  /**
   * Main execution trigger
   */
  const handleRunCode = async () => {
    setIsRunning(true);
    setExitCode(null);
    setStatusMessage('');

    try {
      if (isJS) {
        setOutput('⚡ Initializing local browser V8 execution...\n');
        runJavaScript();
      } else if (isPython) {
        setOutput('🐍 Initializing local Python 3.12 WebAssembly execution...\n');
        await runPython();
      } else {
        setOutput(`⚡ Initializing execution for ${language}...\n`);
        await runCloud();
      }
    } catch (err) {
      recordScreenError(`Execution error in ${language}: ${err.message}`);
      setOutput(`❌ Execution error: ${err.message}\n`);
      setExitCode(1);
    } finally {
      setIsRunning(false);
      setStatusMessage('');
    }
  };

  const handleSaveEndpoint = () => {
    localStorage.setItem('algoflow_custom_runner_url', customEndpoint.trim());
    setTestResult('✅ Saved custom endpoint to local storage!');
    setTimeout(() => setTestResult(''), 3000);
  };

  const handleResetEndpoint = () => {
    setCustomEndpoint('');
    localStorage.removeItem('algoflow_custom_runner_url');
    setTestResult('🔄 Reset to default execution providers.');
    setTimeout(() => setTestResult(''), 3000);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('Terminal output copied to clipboard!');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#0b0f19',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '880px',
        height: '86vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(16, 185, 129, 0.1)',
        overflow: 'hidden',
      }}>
        {/* Terminal Header */}
        <div style={{
          padding: '12px 20px',
          background: '#111827',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            
            <span style={{ marginLeft: '10px', color: '#e2e8f0', fontSize: '0.88rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
              💻 terminal - {language} Code Runner
            </span>

            {/* Engine Pill Badge */}
            <span style={{
              marginLeft: '10px',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              letterSpacing: '0.3px',
              background: isJS ? 'rgba(234, 179, 8, 0.15)' : isPython ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isJS ? '#fde047' : isPython ? '#38bdf8' : '#34d399',
              border: `1px solid ${isJS ? 'rgba(234, 179, 8, 0.3)' : isPython ? 'rgba(56, 189, 248, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}>
              {isJS ? '⚡ In-Browser V8 (Instant)' : isPython ? '🐍 Pyodide WASM (Local)' : customEndpoint ? '⚙️ Custom Endpoint' : '⚡ Smart Compiler Engine'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Settings button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Execution Server Settings"
              style={{
                background: showSettings ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: showSettings ? '#60a5fa' : '#9ca3af',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            >
              ⚙️ Server Settings
            </button>

            {/* Close modal button */}
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: '#9ca3af',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Optional Settings Panel (Drawer) */}
        {showSettings && (
          <div style={{
            padding: '14px 20px',
            background: '#0d1322',
            borderBottom: '1px solid rgba(59, 130, 246, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#93c5fd', fontFamily: 'monospace' }}>
                ⚙️ Custom Execution Endpoint (Docker / Piston / Proxy)
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                JavaScript & Python execute locally inside the browser.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="e.g. http://localhost:2000/api/v2/execute or https://your-piston.com/api/v2/execute"
                value={customEndpoint}
                onChange={e => setCustomEndpoint(e.target.value)}
                style={{
                  flex: 1,
                  background: '#070a13',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  color: '#e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSaveEndpoint}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              {customEndpoint && (
                <button
                  onClick={handleResetEndpoint}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '7px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {testResult && (
              <span style={{ fontSize: '0.78rem', color: testResult.startsWith('✅') ? '#34d399' : '#f87171', fontFamily: 'monospace' }}>
                {testResult}
              </span>
            )}
          </div>
        )}

        {/* Workspace Area: Stdin Top / Terminal Output Bottom */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}>
          
          {/* Top Panel: Stdin Input */}
          <div style={{
            padding: '14px 20px',
            background: '#0d1321',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            flexShrink: 0
          }}>
            <label style={{ color: '#9ca3af', fontSize: '0.78rem', fontWeight: 'bold', fontFamily: 'monospace', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📥 Standard Input (stdin) <span style={{ fontSize: '0.72rem', fontWeight: 'normal', textTransform: 'none', opacity: 0.6 }}>(Space/newline separated inputs for interactive prompts or tests)</span>
            </label>
            <textarea
              placeholder="e.g. 5 10 15 or 100"
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              style={{
                background: '#070a13',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                resize: 'none',
                height: '50px',
                outline: 'none'
              }}
            />
          </div>

          {/* Bottom Panel: Terminal Output */}
          <div style={{
            flex: 1,
            background: '#070913',
            padding: '20px',
            overflowY: 'auto',
            fontFamily: '"Fira Code", Consolas, Monaco, monospace',
            fontSize: '0.88rem',
            lineHeight: '1.55',
            color: '#34d399',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', flex: 1 }}>
              {output}
              {isRunning && (
                <span style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {statusMessage || '⏳ Compiling & executing...'}
                </span>
              )}
              <span className="terminal-cursor" style={{
                display: 'inline-block',
                width: '8px',
                height: '15px',
                background: '#34d399',
                marginLeft: '4px',
                animation: 'blink 1s infinite'
              }}></span>
            </pre>
            <div ref={outputEndRef} />
          </div>

        </div>

        {/* Footer controls */}
        <div style={{
          padding: '14px 20px',
          background: '#111827',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleRunCode}
              disabled={isRunning}
              style={{
                background: isRunning ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '8px 22px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isRunning ? 'none' : '0 4px 14px rgba(16,185,129,0.35)',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {isRunning ? '⏳ Running...' : '▶ Run Code'}
            </button>
            <button 
              onClick={() => {
                setOutput('Terminal output cleared. Click "▶ Run Code" to execute...\n');
                setExitCode(null);
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#9ca3af',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.88rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              🧹 Clear Output
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {exitCode !== null && (
              <span style={{
                fontSize: '0.82rem',
                color: exitCode === 0 ? '#34d399' : '#f87171',
                background: exitCode === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${exitCode === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                padding: '4px 10px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}>
                Process exited with status {exitCode}
              </span>
            )}
            <button 
              onClick={copyOutput}
              style={{
                background: 'rgba(59,130,246,0.1)',
                color: '#60a5fa',
                border: '1px solid rgba(59,130,246,0.2)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.88rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
            >
              📋 Copy Output
            </button>
          </div>
        </div>

        {/* Cursor blink animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}} />
      </div>
    </div>
  );
};

export default CodeRunnerModal;
