import React, { useState, useEffect } from 'react';

export default function HandsOnSyntaxPractice({ selectedLang: propLang, onSelectLang }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'js') return 'javascript';
    return lower;
  };

  const [internalLang, setInternalLang] = useState('c');
  const currentLang = propLang ? normLang(propLang) : internalLang;
  const selectedLang = currentLang;

  const setSelectedLang = (langId) => {
    setInternalLang(langId);
    if (onSelectLang) {
      const mapBack = { c: 'C', java: 'Java', python: 'Python', javascript: 'JS' };
      onSelectLang(mapBack[langId] || 'C');
    }
  };

  const [activeTab, setActiveTab] = useState('free_sandbox'); // free_sandbox, practice, anatomy

  // Language templates for Free Sandbox
  const langTemplates = {
    c: `#include <stdio.h>

// Single-line comment: This program prints a greeting & calculates a sum
/* Multi-line comment:
   Written in C Language
*/
int main() {
    char myName[] = "Alex";
    int a = 15;
    int b = 25;
    int sum = a + b;

    printf("Hello! My name is %s\\n", myName);
    printf("Sum of %d + %d = %d\\n", a, b, sum);

    return 0; // Exit code: 0 means success
}`,
    java: `import java.util.Scanner;

// Single-line comment: Java entry point class
/* Multi-line comment:
   Written in Java Language
*/
public class Main {
    public static void main(String[] args) {
        String myName = "Alex";
        int a = 15;
        int b = 25;
        int sum = a + b;

        System.out.println("Hello! My name is " + myName);
        System.out.println("Sum of " + a + " + " + b + " = " + sum);
    }
}`,
    python: `# Single-line comment: Python is clean and readable
"""
Multi-line comment (Docstring):
Written in Python Language
"""

def main():
    my_name = "Alex"
    a = 15
    b = 25
    total = a + b

    print(f"Hello! My name is {my_name}")
    print(f"Sum of {a} + {b} = {total}")

if __name__ == "__main__":
    main()`,
    javascript: `// Single-line comment: JavaScript web script
/* Multi-line comment:
   Written in JavaScript
*/
function main() {
    let myName = "Alex";
    let a = 15;
    let b = 25;
    let sum = a + b;

    console.log("Hello! My name is " + myName);
    console.log(\`Sum of \${a} + \${b} = \${sum}\`);
}

main();`
  };

  // Restored Level 1 to Level 4 Challenges
  const challenges = [
    {
      id: 1,
      title: 'Level 1: The Missing Semicolon (;)',
      concept: 'In C and Java, every command statement ends with a semicolon (;).',
      brokenCode: 'int score = 100\nprintf("Score: %d", score);',
      solution: 'int score = 100;\nprintf("Score: %d", score);',
      hint: 'Line 1 is missing a semicolon ; at the end!',
      explanation: 'Without a semicolon ;, C treats line 1 and line 2 as a single continuous line.'
    },
    {
      id: 2,
      title: 'Level 2: The Missing Quotes (" ")',
      concept: 'Text strings must be wrapped in double quotes "..." so the computer knows they are text words.',
      brokenCode: 'char name[] = Alex;\nprintf("Hello %s", name);',
      solution: 'char name[] = "Alex";\nprintf("Hello %s", name);',
      hint: 'Wrap Alex in double quotes "Alex"!',
      explanation: 'Without quotes, the computer searches for a variable named Alex instead of treating it as text.'
    },
    {
      id: 3,
      title: 'Level 3: The Missing Header File (#include <stdio.h>)',
      concept: 'Before using printf(), you must include the Standard Input/Output library header.',
      brokenCode: 'int main() {\n    printf("Hello World\\n");\n    return 0;\n}',
      solution: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}',
      hint: 'Add #include <stdio.h> at the very top!',
      explanation: '#include <stdio.h> imports the dictionary containing printf().'
    },
    {
      id: 4,
      title: 'Level 4: Matching Curly Braces ({ })',
      concept: 'Curly braces { } group code lines. Every opening { must have a matching closing }.',
      brokenCode: 'int main() {\n    int a = 10, b = 20;\n    if (a < b) {\n        printf("A is smaller");\n    \n    return 0;\n}',
      solution: 'int main() {\n    int a = 10, b = 20;\n    if (a < b) {\n        printf("A is smaller");\n    }\n    return 0;\n}',
      hint: 'The if-statement is missing its closing brace } !',
      explanation: 'Every { opens a box of code lines. You must close } every box.'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChallengeCode, setUserChallengeCode] = useState(challenges[0].brokenCode);
  const [challengeFeedback, setChallengeFeedback] = useState(null);

  const [freeCode, setFreeCode] = useState(langTemplates[selectedLang] || langTemplates['c']);
  const [sandboxResult, setSandboxResult] = useState(null);

  useEffect(() => {
    if (langTemplates[selectedLang]) {
      setFreeCode(langTemplates[selectedLang]);
      setSandboxResult(null);
    }
  }, [selectedLang]);

  const loadChallenge = (idx) => {
    setCurrentIdx(idx);
    setUserChallengeCode(challenges[idx].brokenCode);
    setChallengeFeedback(null);
  };

  const handleTestChallenge = () => {
    const cleanUser = userChallengeCode.replace(/\s+/g, ' ').trim();
    const cleanSol = challenges[currentIdx].solution.replace(/\s+/g, ' ').trim();

    if (cleanUser === cleanSol) {
      setChallengeFeedback({ type: 'success', msg: '🎉 Perfect! Syntax is 100% Correct!' });
    } else {
      setChallengeFeedback({ type: 'error', msg: `❌ Syntax Error! ${challenges[currentIdx].hint}` });
    }
  };

  // Language-Specific Syntax Validator
  const validateCustomCode = () => {
    const code = freeCode.trim();
    if (!code) {
      setSandboxResult({ type: 'error', msg: '⚠️ Code is empty. Write some code!' });
      return;
    }

    const lines = code.split('\n');

    // C Syntax Validation
    if (selectedLang === 'c') {
      if ((code.includes('printf') || code.includes('scanf')) && !code.includes('#include <stdio.h>') && !code.includes('#include<stdio.h>')) {
        setSandboxResult({ type: 'error', msg: '⚠️ Missing Header: Add #include <stdio.h> at top for printf().' });
        return;
      }
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith('#') || line.endsWith('{') || line.endsWith('}') || line.endsWith(':')) continue;
        if (line.startsWith('if') || line.startsWith('else') || line.startsWith('for') || line.startsWith('while') || line.startsWith('int main')) continue;
        if (!line.endsWith(';')) {
          setSandboxResult({ type: 'error', msg: `⚠️ Missing Semicolon (;) on Line ${i + 1}: "${line}"` });
          return;
        }
      }
    }

    // Java Syntax Validation
    if (selectedLang === 'java') {
      if (!code.includes('class')) {
        setSandboxResult({ type: 'error', msg: '⚠️ Missing Class: Java code must contain a class (e.g. public class Main { ... }).' });
        return;
      }
      if (!code.includes('main')) {
        setSandboxResult({ type: 'error', msg: '⚠️ Missing Main Method: Java requires public static void main(String[] args).' });
        return;
      }
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith('import') || line.startsWith('package') || line.endsWith('{') || line.endsWith('}')) continue;
        if (line.startsWith('public class') || line.startsWith('public static void main') || line.startsWith('if') || line.startsWith('else') || line.startsWith('for')) continue;
        if (!line.endsWith(';')) {
          setSandboxResult({ type: 'error', msg: `⚠️ Missing Semicolon (;) on Line ${i + 1}: "${line}"` });
          return;
        }
      }
    }

    // Python Syntax Validation
    if (selectedLang === 'python') {
      if (code.includes(';') && !code.includes('javascript')) {
        setSandboxResult({ type: 'warning', msg: '💡 Tip: Python does not require semicolons (;) at the end of lines.' });
      }
      const openParen = (code.match(/\(/g) || []).length;
      const closeParen = (code.match(/\)/g) || []).length;
      if (openParen !== closeParen) {
        setSandboxResult({ type: 'error', msg: `⚠️ Unmatched Parentheses in Python: Found ${openParen} '(' but ${closeParen} ')'.` });
        return;
      }
    }

    // JavaScript Syntax Validation
    if (selectedLang === 'javascript') {
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        setSandboxResult({ type: 'error', msg: `⚠️ Unmatched Braces in JS: Found ${openBraces} '{' but ${closeBraces} '}'.` });
        return;
      }
    }

    // Universal Quote Check
    const doubleQuoteCount = (code.match(/"/g) || []).length;
    if (doubleQuoteCount % 2 !== 0) {
      setSandboxResult({ type: 'error', msg: '⚠️ Unmatched Quotes: You have an odd number of double quotes (").' });
      return;
    }

    // Simulate Output Execution Preview
    let outputLines = [];
    if (selectedLang === 'c' || selectedLang === 'java') {
      const printMatches = code.matchAll(/(?:printf|System\.out\.println|console\.log)\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*(?:,\s*(.*?))?\s*\);/g);
      for (const m of printMatches) {
        outputLines.push(m[1].replace(/\\n/g, '\n'));
      }
    } else if (selectedLang === 'python') {
      const pyMatches = code.matchAll(/print\s*\(\s*f?"([^"\\]*)"\s*\)/g);
      for (const m of pyMatches) {
        outputLines.push(m[1]);
      }
    } else {
      const jsMatches = code.matchAll(/console\.log\s*\(\s*"([^"\\]*)"\s*\);?/g);
      for (const m of jsMatches) {
        outputLines.push(m[1]);
      }
    }

    const outputText = outputLines.length > 0 ? outputLines.join('\n') : 'Code compiled & executed cleanly with 0 syntax errors!';

    setSandboxResult({
      type: 'success',
      output: outputText,
      msg: `✅ ${selectedLang.toUpperCase()} Syntax is 100% Valid & Clean!`
    });
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>✍️</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
            Module 4: Code Anatomy, Comments & Syntax Sandbox ({selectedLang.toUpperCase()})
          </h2>
        </div>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
          Learn code structure (Comments, Imports, Main Functions, Returns), test custom code in the sandbox, or complete Level 1 to 4 syntax challenges!
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('free_sandbox')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'free_sandbox' ? '2px solid #38bdf8' : '1px solid #334155',
            background: activeTab === 'free_sandbox' ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
            color: activeTab === 'free_sandbox' ? '#38bdf8' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          🎨 Free Code Sandbox ({selectedLang.toUpperCase()})
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'practice' ? '2px solid #38bdf8' : '1px solid #334155',
            background: activeTab === 'practice' ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
            color: activeTab === 'practice' ? '#38bdf8' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          🎯 Level 1 to 4 Syntax Challenges
        </button>
        <button
          onClick={() => setActiveTab('anatomy')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeTab === 'anatomy' ? '2px solid #38bdf8' : '1px solid #334155',
            background: activeTab === 'anatomy' ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
            color: activeTab === 'anatomy' ? '#38bdf8' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          📖 Code Anatomy & Comments Guide
        </button>
      </div>

      {/* TAB 1: FREE CODE SANDBOX */}
      {activeTab === 'free_sandbox' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#f1f5f9' }}>
              ✨ Free Custom Sandbox ({selectedLang.toUpperCase()})
            </h3>
            <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
              Active Language: <strong>{selectedLang.toUpperCase()}</strong>
            </span>
          </div>

          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#94a3b8' }}>
            Write any custom code in {selectedLang.toUpperCase()} below! Click <strong>"Check Syntax & Run Output"</strong> to test for syntax errors.
          </p>

          <textarea
            rows={11}
            value={freeCode}
            onChange={e => setFreeCode(e.target.value)}
            style={{
              width: '100%',
              background: '#090d16',
              color: '#38bdf8',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13.5px',
              lineHeight: '1.5',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #475569',
              boxSizing: 'border-box',
              outline: 'none',
              marginBottom: '14px'
            }}
          />

          <button
            onClick={validateCustomCode}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '13.5px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
            }}
          >
            🔍 Check {selectedLang.toUpperCase()} Syntax & Run Output
          </button>

          {/* Validation Feedback & Output Box */}
          {sandboxResult && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '10px',
              background: sandboxResult.type === 'success' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1.5px solid ${sandboxResult.type === 'success' ? '#34d399' : '#f87171'}`
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: sandboxResult.type === 'success' ? '#34d399' : '#f87171',
                marginBottom: sandboxResult.output ? '10px' : '0'
              }}>
                {sandboxResult.msg}
              </div>

              {sandboxResult.output && (
                <div style={{
                  background: '#0f172a',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    💻 Output Terminal Preview:
                  </div>
                  <pre style={{ margin: 0, color: '#38bdf8', fontFamily: 'monospace', fontSize: '13px' }}>
                    {sandboxResult.output}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LEVEL 1 TO 4 CHALLENGES */}
      {activeTab === 'practice' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {challenges.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => loadChallenge(idx)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: currentIdx === idx ? '2px solid #38bdf8' : '1px solid #334155',
                  background: currentIdx === idx ? '#0284c7' : '#0f172a',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {c.title.split(':')[0]}
              </button>
            ))}
          </div>

          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#38bdf8' }}>
              {challenges[currentIdx].title}
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#cbd5e1' }}>
              💡 {challenges[currentIdx].concept}
            </p>

            <textarea
              rows={5}
              value={userChallengeCode}
              onChange={e => setUserChallengeCode(e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                color: '#38bdf8',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '13.5px',
                lineHeight: '1.5',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #475569',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '14px'
              }}
            />

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleTestChallenge}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ▶ Test Challenge Code
              </button>
              <button
                onClick={() => setUserChallengeCode(challenges[currentIdx].solution)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: '#334155',
                  color: '#cbd5e1',
                  border: 'none',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                👀 Show Solution
              </button>
            </div>

            {challengeFeedback && (
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: challengeFeedback.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${challengeFeedback.type === 'success' ? '#34d399' : '#f87171'}`,
                color: challengeFeedback.type === 'success' ? '#34d399' : '#f87171',
                fontSize: '13px',
                fontWeight: 'bold'
              }}>
                {challengeFeedback.msg}
                {challengeFeedback.type === 'error' && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 'normal', color: '#94a3b8' }}>
                    {challenges[currentIdx].explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CODE ANATOMY & COMMENTS GUIDE */}
      {activeTab === 'anatomy' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              icon: '💬',
              title: 'Comments (// and /* */)',
              desc: 'Notes written inside the code for human programmers to read. The computer completely ignores comments when running the code!'
            },
            {
              icon: '🚪',
              title: 'Main Entry Point (main())',
              desc: 'The starting door of your program. When you run code, the operating system looks for main() to begin executing instructions line-by-line.'
            },
            {
              icon: '📦',
              title: 'Header Includes & Imports',
              desc: 'Statements like #include <stdio.h> (C) or import java.util (Java) bring external tools and standard libraries into your code.'
            },
            {
              icon: '🔚',
              title: 'Return Statements (return 0;)',
              desc: 'Tells the operating system that your program finished its task successfully (0 means 0 errors).'
            },
            {
              icon: '🎯',
              title: 'Assignment (=) vs Equality (==)',
              desc: 'a = 10 puts the number 10 inside variable a. a == 10 checks if a is equal to 10.'
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#38bdf8' }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
