/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';

const CodeRunnerModal = ({ isOpen, onClose, code, language }) => {
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [exitCode, setExitCode] = useState(null);
  const outputEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setOutput('Terminal initialized. Click "Run Code" to execute...\n');
      setExitCode(null);
    }
  }, [isOpen, code, language]);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  if (!isOpen) return null;

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Compiling & running code on sandboxed cloud server...\n');
    setExitCode(null);

    // Map language to Piston identifiers
    let pistonLang = 'javascript';
    let filename = 'main.js';
    const langLower = language.toLowerCase();
    
    if (langLower === 'c') {
      pistonLang = 'c';
      filename = 'main.c';
    } else if (langLower.includes('c++') || langLower.includes('cpp')) {
      pistonLang = 'cpp';
      filename = 'main.cpp';
    } else if (langLower.includes('java')) {
      pistonLang = 'java';
      filename = 'Main.java'; // Java requires matching class name
    } else if (langLower.includes('python')) {
      pistonLang = 'python';
      filename = 'main.py';
    } else if (langLower.includes('js') || langLower.includes('javascript')) {
      pistonLang = 'javascript';
      filename = 'main.js';
    }

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: pistonLang,
          version: '*',
          files: [
            {
              name: filename,
              content: code,
            },
          ],
          stdin: stdin,
        }),
      });

      if (!response.ok) {
        throw new Error(`Execution service returned status ${response.status}`);
      }

      const data = await response.json();
      
      let consoleOutput = '';
      
      // Handle compilation errors if present
      if (data.compile && data.compile.stderr) {
        consoleOutput += `⚙️ Compilation Error:\n${data.compile.stderr}\n`;
        setExitCode(data.compile.code);
      } else if (data.compile && data.compile.output) {
        consoleOutput += data.compile.output + '\n';
      }

      // Handle standard run output
      if (data.run) {
        if (data.run.stdout) {
          consoleOutput += data.run.stdout;
        }
        if (data.run.stderr) {
          consoleOutput += `⚠️ Runtime Error:\n${data.run.stderr}\n`;
        }
        
        if (!data.run.stdout && !data.run.stderr && (!data.compile || !data.compile.stderr)) {
          consoleOutput += '(Program executed successfully with empty output)\n';
        }
        
        setExitCode(data.run.code);
        
        // Piston doesn't always return execution time, calculate if possible or mock
        if (data.run.signal) {
          consoleOutput += `\n❌ Program terminated by signal: ${data.run.signal}\n`;
        }
      }

      setOutput(consoleOutput);
    } catch (error) {
      console.error('Code execution failed:', error);
      
      // Fallback for JS running locally in case of network error
      if (pistonLang === 'javascript') {
        setOutput(prev => prev + '⚠️ Cloud Runner failed. Executing JavaScript locally in browser...\n');
        try {
          const logs = [];
          const originalLog = console.log;
          console.log = (...args) => {
            logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
            originalLog(...args);
          };
          
          // Execute code
          const startTime = window.performance.now();
          const runLocal = new Function(code);
          runLocal();
          const duration = (window.performance.now() - startTime).toFixed(2);
          
          console.log = originalLog;
          
          setOutput(logs.join('\n') + `\n\n💡 Local browser run completed in ${duration}ms.\n`);
          setExitCode(0);
        } catch (localErr) {
          setOutput(prev => prev + `❌ JavaScript error: ${localErr.message}\n`);
          setExitCode(1);
        }
      } else {
        setOutput(`❌ Failed to execute code: ${error.message}\nPlease check your internet connection or try again.`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('Terminal output copied to clipboard!');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
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
        maxWidth: '850px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
      }}>
        {/* Terminal Header */}
        <div style={{
          padding: '12px 20px',
          background: '#111827',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span style={{ marginLeft: '10px', color: '#9ca3af', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
              💻 terminal - {language} Code Runner
            </span>
          </div>
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

        {/* Workspace Area: Left Editor Details / Right Stdin / Bottom Output */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}>
          
          {/* Top Panel: Stdin Input */}
          <div style={{
            padding: '16px 20px',
            background: '#0d1321',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flexShrink: 0
          }}>
            <label style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📥 Standard Input (stdin) <span style={{ fontSize: '0.75rem', fontWeight: 'normal', textTransform: 'none', opacity: 0.6 }}>(Provide inputs separated by space/newline if code requires input)</span>
            </label>
            <textarea
              placeholder="e.g. 5 10 15"
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              style={{
                background: '#070a13',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                resize: 'none',
                height: '55px',
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
            fontSize: '0.9rem',
            lineHeight: '1.5',
            color: '#34d399',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', flex: 1 }}>
              {output}
              {isRunning && (
                <span style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  ⏳ Running...
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
          padding: '16px 20px',
          background: '#111827',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={runCode}
              disabled={isRunning}
              style={{
                background: isRunning ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isRunning ? 'none' : '0 4px 14px rgba(16,185,129,0.4)',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              ▶ Run Code
            </button>
            <button 
              onClick={() => setOutput('Terminal cleared. Write/paste code and run...\n')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#9ca3af',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
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
              <span style={{ fontSize: '0.85rem', color: exitCode === 0 ? '#34d399' : '#f87171', fontFamily: 'monospace' }}>
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
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
            >
              📋 Copy Output
            </button>
          </div>
        </div>

        {/* Simple cursor blink animation style */}
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
