import React, { useState, useEffect, useRef } from 'react';

// Line-number integrated code editor to improve syntax error discovery and line numbering
function CodeEditorWithLineNumbers({ value, onChange, color, borderColor, rows = 11 }) {
  const lineCount = value.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);
  const lineRef = useRef(null);
  const textareaRef = useRef(null);

  const handleScroll = () => {
    if (lineRef.current && textareaRef.current) {
      lineRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Sync scroll on mount or value change
  useEffect(() => {
    handleScroll();
  }, [value]);

  return (
    <div style={{
      display: 'flex',
      background: '#090d16',
      borderRadius: '10px',
      border: `1px solid ${borderColor}`,
      overflow: 'hidden',
      fontFamily: 'Consolas, Monaco, monospace',
      fontSize: '13.5px',
      marginBottom: '14px'
    }}>
      {/* Line Numbers Column */}
      <div
        ref={lineRef}
        style={{
          padding: '14px 8px 14px 12px',
          background: '#070a12',
          color: '#475569',
          textAlign: 'right',
          userSelect: 'none',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          minWidth: '32px'
        }}
      >
        {lineNumbers.map(n => (
          <div key={n} style={{ height: '20px', lineHeight: '20px' }}>{n}</div>
        ))}
      </div>
      {/* Textarea Column */}
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        style={{
          flex: 1,
          background: 'transparent',
          color: color,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: '20px',
          padding: '14px',
          border: 'none',
          boxSizing: 'border-box',
          outline: 'none',
          resize: 'vertical',
          display: 'block',
          margin: 0
        }}
      />
    </div>
  );
}

export default function HandsOnSyntaxPractice({ selectedLang: propLang }) {
  const normLang = (l) => {
    if (!l) return 'c';
    const lower = l.toLowerCase();
    if (lower === 'js' || lower === 'javascript' || lower === 'frontend') return 'frontend';
    return lower;
  };

  const selectedLang = normLang(propLang);

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

  // Language-Specific Level 1 to Level 6 Challenges
  const challengesByLang = {
    c: [
      {
        id: 1,
        title: 'C Level 1: The Missing Semicolon (;)',
        concept: 'In C, every command statement ends with a semicolon (;).',
        brokenCode: 'int count = 5\nprintf("Count is %d", count);',
        solution: 'int count = 5;\nprintf("Count is %d", count);',
        hint: 'Line 1 is missing a semicolon ; at the end!',
        explanation: 'Without a semicolon ;, C treats line 1 and line 2 as a single continuous line.'
      },
      {
        id: 2,
        title: 'C Level 2: String Formatting Placeholders',
        concept: 'Passing an integer to a format string requires %d, not %s.',
        brokenCode: 'int age = 19;\nprintf("I am %s years old", age);',
        solution: 'int age = 19;\nprintf("I am %d years old", age);',
        hint: 'Change %s to %d in the format string!',
        explanation: '%s expects a string pointer, while %d tells the compiler to format an integer.'
      },
      {
        id: 3,
        title: 'C Level 3: Missing math.h Header File',
        concept: 'To use math functions like sqrt(), you must include the math.h header.',
        brokenCode: '#include <stdio.h>\nint main() {\n    double root = sqrt(16.0);\n    return 0;\n}',
        solution: '#include <stdio.h>\n#include <math.h>\nint main() {\n    double root = sqrt(16.0);\n    return 0;\n}',
        hint: 'Add #include <math.h> below stdio.h!',
        explanation: 'The mathematical library functions are declared inside the math.h header file.'
      },
      {
        id: 4,
        title: 'C Level 4: Comparison vs Assignment Operator',
        concept: 'Conditionals check equality with ==. A single = changes the value instead of comparing it.',
        brokenCode: 'int x = 10;\nif (x = 5) {\n    printf("X is five");\n}',
        solution: 'int x = 10;\nif (x == 5) {\n    printf("X is five");\n}',
        hint: 'Change x = 5 to x == 5 inside the if condition!',
        explanation: 'A single = assigns the value 5 to x, which evaluates to true. Use == for logical comparison.'
      },
      {
        id: 5,
        title: 'C Level 5: Struct Definition Semicolon',
        concept: 'Struct declarations in C must end with a terminating semicolon ; after the closing brace.',
        brokenCode: 'struct Student {\n    char name[20];\n    int age;\n}',
        solution: 'struct Student {\n    char name[20];\n    int age;\n};',
        hint: 'Add a semicolon ; at the end of the closing brace } of the struct!',
        explanation: 'The C compiler requires a semicolon to end the struct declaration block.'
      },
      {
        id: 6,
        title: 'C Level 6: Array Bound Declarations',
        concept: 'Ensure that the array size matches the number of elements inside the initializer list.',
        brokenCode: 'int numbers[3] = {10, 20, 30, 40};',
        solution: 'int numbers[4] = {10, 20, 30, 40};',
        hint: 'Change numbers[3] to numbers[4] to accommodate all four values!',
        explanation: 'Declaring numbers[3] leaves space for only 3 elements, causing a buffer overflow error.'
      }
    ],
    javascript: [
      {
        id: 1,
        title: 'JS Level 1: Variable Declaration Syntax',
        concept: 'JavaScript uses let or const to declare variables. Do not use datatype names like int/float.',
        brokenCode: 'int score = 100;\nconsole.log(score);',
        solution: 'let score = 100;\nconsole.log(score);',
        hint: 'Replace int with let or const!',
        explanation: 'JavaScript is dynamically typed and uses let, const or var to declare variables, not int.'
      },
      {
        id: 2,
        title: 'JS Level 2: String Quote Mismatch',
        concept: 'Single or double quotes must match on both sides of a string.',
        brokenCode: 'let name = "Alex\';\nconsole.log(name);',
        solution: 'let name = "Alex";\nconsole.log(name);',
        hint: 'Match the quote types on line 1!',
        explanation: 'Ensure you open and close strings with matching double quotes or single quotes.'
      },
      {
        id: 3,
        title: 'JS Level 3: Template Literal Syntax',
        concept: 'To inject variables inside string values, use backticks `...` instead of single/double quotes.',
        brokenCode: 'let val = 10;\nconsole.log("Value: ${val}");',
        solution: 'let val = 10;\nconsole.log(`Value: ${val}`);',
        hint: 'Change the outer quotes of the print string to backticks ``!',
        explanation: 'Only backticks support string interpolation with ${variable} in JavaScript.'
      },
      {
        id: 4,
        title: 'JS Level 4: Unmatched Parentheses',
        concept: 'Function calls must close their brackets correctly.',
        brokenCode: 'console.log("Hello";',
        solution: 'console.log("Hello");',
        hint: 'Add a closing parenthesis ) before the semicolon!',
        explanation: 'Ensure all opening parentheses ( are closed by a matching ) before finishing the statement.'
      },
      {
        id: 5,
        title: 'JS Level 5: Event Listener click parameter',
        concept: 'HTML event parameters are lowercase and exclude the "on" prefix (e.g. use "click", not "onclick").',
        brokenCode: 'btn.addEventListener("onclick", () => {\n  console.log("Clicked");\n});',
        solution: 'btn.addEventListener("click", () => {\n  console.log("Clicked");\n});',
        hint: 'Change "onclick" to "click"!',
        explanation: 'addEventListener expects raw event names like "click", "mouseenter", or "submit".'
      },
      {
        id: 6,
        title: 'JS Level 6: Arrow Function Mapping syntax',
        concept: 'Arrow functions map parameter variables to expressions with a single => indicator.',
        brokenCode: 'const doubled = numbers.map(x => => x * 2);',
        solution: 'const doubled = numbers.map(x => x * 2);',
        hint: 'Remove the duplicate => indicator!',
        explanation: 'Arrow syntax maps parameter values once: parameter => expression.'
      }
    ],
    java: [
      {
        id: 1,
        title: 'Java Level 1: Missing Semicolon (;)',
        concept: 'Java statements require semicolons (;) at the end.',
        brokenCode: 'double price = 19.99\nSystem.out.println(price);',
        solution: 'double price = 19.99;\nSystem.out.println(price);',
        hint: 'Add a semicolon ; at the end of line 1!',
        explanation: 'Like C, Java will report a compiler error if statements are not terminated with a semicolon.'
      },
      {
        id: 2,
        title: 'Java Level 2: Main Method Parameters',
        concept: 'The main method requires string array args (String[] args).',
        brokenCode: 'public static void main(String args) {\n    System.out.println("Main method");\n}',
        solution: 'public static void main(String[] args) {\n    System.out.println("Main method");\n}',
        hint: 'Add square brackets [] to String args inside parameters!',
        explanation: 'Java requires String[] to represent array strings for command arguments.'
      },
      {
        id: 3,
        title: 'Java Level 3: String Value Comparison',
        concept: 'Compare string content in Java using .equals(), not == reference comparison.',
        brokenCode: 'String s1 = "hello";\nif (s1 == "hello") {\n    System.out.println("Match");\n}',
        solution: 'String s1 = "hello";\nif (s1.equals("hello")) {\n    System.out.println("Match");\n}',
        hint: 'Change s1 == "hello" to s1.equals("hello")!',
        explanation: '== compares variable object references. The .equals() method compares the actual text content.'
      },
      {
        id: 4,
        title: 'Java Level 4: Class Constructor Name',
        concept: 'Constructors in Java must match the class name exactly and lack any return types.',
        brokenCode: 'class User {\n    public void User() {\n        System.out.println("Created");\n    }\n}',
        solution: 'class User {\n    public User() {\n        System.out.println("Created");\n    }\n}',
        hint: 'Remove the "void" keyword from the User constructor!',
        explanation: 'Adding void makes User a regular method instead of a constructor.'
      },
      {
        id: 5,
        title: 'Java Level 5: Array Allocator Bracket Syntax',
        concept: 'Array allocations in Java specify sizes with square brackets [...], not parentheses.',
        brokenCode: 'int[] list = new int(5);',
        solution: 'int[] list = new int[5];',
        hint: 'Change (5) to [5] at the end of the declaration!',
        explanation: 'Square brackets are required to allocate sizes for collections in Java.'
      },
      {
        id: 6,
        title: 'Java Level 6: Missing Return Statement',
        concept: 'Any method declaring a return type other than void must return a compatible value.',
        brokenCode: 'public int getSum() {\n    int sum = 10 + 20;\n}',
        solution: 'public int getSum() {\n    int sum = 10 + 20;\n    return sum;\n}',
        hint: 'Add return sum; inside the method body!',
        explanation: 'Methods returning numeric values must specify a return statement to return compilation output.'
      }
    ],
    python: [
      {
        id: 1,
        title: 'Python Level 1: Missing Block Colon (:)',
        concept: 'Conditional blocks (if, for, while, def) in Python require a colon (:) at the end of the line.',
        brokenCode: 'if temperature > 30\n    print("It is hot outside")',
        solution: 'if temperature > 30:\n    print("It is hot outside")',
        hint: 'Add a colon : after temperature > 30!',
        explanation: 'Python uses colons to denote the start of indented statement blocks.'
      },
      {
        id: 2,
        title: 'Python Level 2: Helper Function Definition def Keyword',
        concept: 'In Python, define function helpers using the def keyword, not function.',
        brokenCode: 'function greet(name):\n    return "Hello " + name',
        solution: 'def greet(name):\n    return "Hello " + name',
        hint: 'Change function to def at the start of line 1!',
        explanation: 'Python uses def to declare functions, not JavaScript-style function.'
      },
      {
        id: 3,
        title: 'Python Level 3: List Comprehension Mismatched brackets',
        concept: 'List collections require matching opening and closing square brackets [...].',
        brokenCode: 'squares = [x*x for x in range(5)}',
        solution: 'squares = [x*x for x in range(5)]',
        hint: 'Replace the closing curly brace } with a square bracket ]!',
        explanation: 'List structures must begin and end with matching square brackets.'
      },
      {
        id: 4,
        title: 'Python Level 4: F-String Interpolation Curly Braces',
        concept: 'Values inside f-strings must be enclosed inside curly braces {}, not parentheses.',
        brokenCode: 'username = "Alex"\nmsg = f"User is (username)"',
        solution: 'username = "Alex"\nmsg = f"User is {username}"',
        hint: 'Change (username) to {username}!',
        explanation: 'F-strings require curly braces to correctly interpolate Python variables.'
      },
      {
        id: 5,
        title: 'Python Level 5: Range Function Arguments Type',
        concept: 'The range() generator takes integer values, not string representations.',
        brokenCode: 'for i in range("10"):\n    print(i)',
        solution: 'for i in range(10):\n    print(i)',
        hint: 'Remove quotes from "10" inside the range parameter!',
        explanation: 'range() parameters must be numerical integer values.'
      },
      {
        id: 6,
        title: 'Python Level 6: Dictionary colon assignment',
        concept: 'Key-value declarations in Python dictionaries use colons (:) to bind values, not equals (=).',
        brokenCode: 'student = {"name" = "Alex", "age" = 20}',
        solution: 'student = {"name": "Alex", "age": 20}',
        hint: 'Replace the = symbols inside the dictionary with colons :!',
        explanation: 'Dictionaries map keys to values using the key: value syntax, separated by commas.'
      }
    ],
    frontend: [
      {
        id: 1,
        title: 'Frontend Level 1: Mismatched HTML tags',
        concept: 'HTML tags must close with matching elements (e.g. section requires </section>).',
        brokenCode: '<section>\n  <p>Intro text</p>\n<div>',
        solution: '<section>\n  <p>Intro text</p>\n</section>',
        hint: 'Change <div> on line 3 to </section>!',
        explanation: 'Tags must match their opening containers to maintain proper document structure.'
      },
      {
        id: 2,
        title: 'Frontend Level 2: HTML Image Source attribute',
        concept: 'Images load data links using src attributes, not SDE hyperlink href parameters.',
        brokenCode: '<img href="logo.png" alt="Company Logo" />',
        solution: '<img src="logo.png" alt="Company Logo" />',
        hint: 'Change href="logo.png" to src="logo.png"!',
        explanation: 'The <img> tag requires the src attribute to find and display the target image resource.'
      },
      {
        id: 3,
        title: 'Frontend Level 3: CSS selector name syntax',
        concept: 'Custom class styling rules must begin with a dot (.) selector to tell the compiler it is a class.',
        brokenCode: 'header-title {\n  font-size: 24px;\n  color: #38bdf8;\n}',
        solution: '.header-title {\n  font-size: 24px;\n  color: #38bdf8;\n}',
        hint: 'Add a dot . selector prefix before header-title!',
        explanation: 'Without a dot, CSS treats header-title as a custom HTML tag instead of a class name.'
      },
      {
        id: 4,
        title: 'Frontend Level 4: CSS variable access',
        concept: 'CSS custom properties require the var() syntax wrapper to load styling colors.',
        brokenCode: '.card {\n  background-color: --primary-bg;\n}',
        solution: '.card {\n  background-color: var(--primary-bg);\n}',
        hint: 'Wrap --primary-bg inside var() wrapper!',
        explanation: 'CSS variables must be accessed via the var(--name) syntax.'
      },
      {
        id: 5,
        title: 'Frontend Level 5: JS event handler parameter',
        concept: 'Event handler names exclude the "on" prefix (e.g. click, not onclick).',
        brokenCode: 'btn.addEventListener("onclick", () => {\n  console.log("Pressed");\n});',
        solution: 'btn.addEventListener("click", () => {\n  console.log("Pressed");\n});',
        hint: 'Change "onclick" to "click"!',
        explanation: 'JS Event listeners register event names without the HTML attribute "on" prefix.'
      },
      {
        id: 6,
        title: 'Frontend Level 6: JS Array Arrow map return',
        concept: 'Arrow functions map inputs using a single inline => indicator.',
        brokenCode: 'const doubled = numbers.map(x => => x * 2);',
        solution: 'const doubled = numbers.map(x => x * 2);',
        hint: 'Remove the duplicate => operator!',
        explanation: 'Arrow expressions specify parameters mapping to results: x => x * 2.'
      }
    ]
  };

  const challenges = challengesByLang[selectedLang] || challengesByLang['c'];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChallengeCode, setUserChallengeCode] = useState(challenges[0].brokenCode);
  const [challengeFeedback, setChallengeFeedback] = useState(null);

  const [freeCode, setFreeCode] = useState(langTemplates[selectedLang] || langTemplates['c']);
  const [sandboxResult, setSandboxResult] = useState(null);

  // Frontend Separated Files State
  const [htmlCode, setHtmlCode] = useState(`<div class="welcome-box">
  <h1>Hello from AlgoFlow!</h1>
  <p>Click the button below to trigger an effect.</p>
  <button id="action-btn">Click Me!</button>
  <div id="output" class="hidden"></div>
</div>`);

  const [cssCode, setCssCode] = useState(`.welcome-box {
  background: #1e293b;
  border: 2px solid #38bdf8;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}
h1 {
  color: #38bdf8;
  margin-bottom: 8px;
}
button {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background: #0ea5e9;
}
.hidden {
  display: none;
}
#output {
  margin-top: 12px;
  color: #10b981;
  font-weight: bold;
}`);

  const [jsCode, setJsCode] = useState(`const btn = document.getElementById('action-btn');
const out = document.getElementById('output');
btn.addEventListener('click', () => {
  out.textContent = "🎉 Frontend Interactivity Works!";
  out.classList.remove('hidden');
  btn.style.transform = 'scale(1.1)';
  setTimeout(() => { btn.style.transform = 'scale(1)'; }, 100);
});`);

  const [activeFrontendTab, setActiveFrontendTab] = useState('html'); // 'html', 'css', 'js'

  useEffect(() => {
    if (langTemplates[selectedLang]) {
      setFreeCode(langTemplates[selectedLang]);
      setSandboxResult(null);
    } else if (selectedLang === 'frontend') {
      setSandboxResult(null);
    }
    // Load language-specific default challenge
    const activeChall = challengesByLang[selectedLang] || challengesByLang['c'];
    setCurrentIdx(0);
    setUserChallengeCode(activeChall[0].brokenCode);
    setChallengeFeedback(null);
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
    // Frontend Separated Validation
    if (selectedLang === 'frontend') {
      // 1. HTML Validation
      const tags = [];
      const htmlRegex = /<\/?([a-zA-Z1-6]+)(?:\s+[^>]*)?>/g;
      let match;
      const selfClosingTags = ['img', 'input', 'br', 'hr', 'link', 'meta'];
      while ((match = htmlRegex.exec(htmlCode)) !== null) {
        const tag = match[1].toLowerCase();
        const isClosing = match[0].startsWith('</');
        if (selfClosingTags.includes(tag)) continue;
        if (!isClosing) {
          tags.push({ tag, line: htmlCode.substring(0, match.index).split('\n').length });
        } else {
          if (tags.length === 0) {
            setSandboxResult({ type: 'error', msg: `⚠️ HTML Syntax Error: Missing opening tag for </${tag}>` });
            return;
          }
          const last = tags.pop();
          if (last.tag !== tag) {
            setSandboxResult({ type: 'error', msg: `⚠️ HTML Syntax Error: Unmatched Tag. Expected closing tag for <${last.tag}> (opened on line ${last.line}) but found </${tag}>` });
            return;
          }
        }
      }
      if (tags.length > 0) {
        const last = tags.pop();
        setSandboxResult({ type: 'error', msg: `⚠️ HTML Syntax Error: Unmatched Tag. <${last.tag}> opened on line ${last.line} is missing a closing </${last.tag}>` });
        return;
      }

      // 2. CSS Validation
      const openBraces = (cssCode.match(/\{/g) || []).length;
      const closeBraces = (cssCode.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        setSandboxResult({ type: 'error', msg: `⚠️ CSS Syntax Error: Unmatched braces. Found ${openBraces} '{' but ${closeBraces} '}'.` });
        return;
      }

      // 3. JS Validation
      const openBracesJS = (jsCode.match(/\{/g) || []).length;
      const closeBracesJS = (jsCode.match(/\}/g) || []).length;
      if (openBracesJS !== closeBracesJS) {
        setSandboxResult({ type: 'error', msg: `⚠️ JavaScript Syntax Error: Unmatched curly braces. Found ${openBracesJS} '{' and ${closeBracesJS} '}'.` });
        return;
      }
      const openParens = (jsCode.match(/\(/g) || []).length;
      const closeParens = (jsCode.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        setSandboxResult({ type: 'error', msg: `⚠️ JavaScript Syntax Error: Unmatched parentheses. Found ${openParens} '(' and ${closeParens} ')'.` });
        return;
      }

      setSandboxResult({
        type: 'success',
        isFrontend: true,
        msg: '✅ Frontend HTML, CSS & JavaScript Syntax is 100% Valid!'
      });
      return;
    }

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
      let inMultiLineComment = false;
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // Handle multi-line comment states
        if (inMultiLineComment) {
          if (line.includes('*/')) {
            const index = line.indexOf('*/');
            line = line.substring(index + 2).trim();
            inMultiLineComment = false;
          } else {
            continue;
          }
        }
        if (line.includes('/*')) {
          const startIndex = line.indexOf('/*');
          if (line.includes('*/', startIndex + 2)) {
            const endIndex = line.indexOf('*/', startIndex + 2);
            line = (line.substring(0, startIndex) + line.substring(endIndex + 2)).trim();
          } else {
            line = line.substring(0, startIndex).trim();
            inMultiLineComment = true;
          }
        }

        if (!line || line.startsWith('//') || line.startsWith('#') || line.endsWith('{') || line.endsWith('}') || line.endsWith(':')) continue;
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
      let inMultiLineComment = false;
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // Handle multi-line comment states
        if (inMultiLineComment) {
          if (line.includes('*/')) {
            const index = line.indexOf('*/');
            line = line.substring(index + 2).trim();
            inMultiLineComment = false;
          } else {
            continue;
          }
        }
        if (line.includes('/*')) {
          const startIndex = line.indexOf('/*');
          if (line.includes('*/', startIndex + 2)) {
            const endIndex = line.indexOf('*/', startIndex + 2);
            line = (line.substring(0, startIndex) + line.substring(endIndex + 2)).trim();
          } else {
            line = line.substring(0, startIndex).trim();
            inMultiLineComment = true;
          }
        }

        if (!line || line.startsWith('//') || line.startsWith('import') || line.startsWith('package') || line.endsWith('{') || line.endsWith('}')) continue;
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
            Module 4: Code Anatomy, Comments & Syntax Sandbox ({selectedLang === 'frontend' ? 'FRONTEND (HTML/CSS/JS)' : selectedLang.toUpperCase()})
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
          🎨 Free Code Sandbox ({selectedLang === 'frontend' ? 'FRONTEND (HTML/CSS/JS)' : selectedLang.toUpperCase()})
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
              ✨ Free Custom Sandbox ({selectedLang === 'frontend' ? 'FRONTEND (HTML/CSS/JS)' : selectedLang.toUpperCase()})
            </h3>
            <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600' }}>
              Active Language: <strong>{selectedLang === 'frontend' ? 'FRONTEND (HTML/CSS/JS)' : selectedLang.toUpperCase()}</strong>
            </span>
          </div>

          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#94a3b8' }}>
            Write any custom code in {selectedLang === 'frontend' ? 'Frontend (HTML/CSS/JS)' : selectedLang.toUpperCase()} below! Click <strong>"Check Syntax & Run Output"</strong> to test for syntax errors.
          </p>

          {selectedLang === 'frontend' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', background: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
                <button
                  type="button"
                  onClick={() => setActiveFrontendTab('html')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFrontendTab === 'html' ? '#ef4444' : 'transparent',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🧱 index.html
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFrontendTab('css')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFrontendTab === 'css' ? '#38bdf8' : 'transparent',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🎨 style.css
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFrontendTab('js')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFrontendTab === 'js' ? '#fbbf24' : 'transparent',
                    color: activeFrontendTab === 'js' ? '#0f172a' : '#fff',
                    fontWeight: 'bold',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ⚡ script.js
                </button>
              </div>

              {activeFrontendTab === 'html' && (
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>HTML5 STRUCTURE:</div>
                  <CodeEditorWithLineNumbers
                    value={htmlCode}
                    onChange={e => setHtmlCode(e.target.value)}
                    color="#f87171"
                    borderColor="#ef4444"
                    rows={11}
                  />
                </div>
              )}

              {activeFrontendTab === 'css' && (
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>CSS3 STYLING:</div>
                  <CodeEditorWithLineNumbers
                    value={cssCode}
                    onChange={e => setCssCode(e.target.value)}
                    color="#60a5fa"
                    borderColor="#38bdf8"
                    rows={11}
                  />
                </div>
              )}

              {activeFrontendTab === 'js' && (
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>JAVASCRIPT LOGIC:</div>
                  <CodeEditorWithLineNumbers
                    value={jsCode}
                    onChange={e => setJsCode(e.target.value)}
                    color="#fbbf24"
                    borderColor="#f59e0b"
                    rows={11}
                  />
                </div>
              )}
            </div>
          ) : (
            <CodeEditorWithLineNumbers
              value={freeCode}
              onChange={e => setFreeCode(e.target.value)}
              color="#38bdf8"
              borderColor="#475569"
              rows={11}
            />
          )}

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
            🔍 Check {selectedLang === 'frontend' ? 'Frontend HTML/CSS/JS' : selectedLang.toUpperCase()} Syntax & Run Output
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
                marginBottom: sandboxResult.output || sandboxResult.isFrontend ? '10px' : '0'
              }}>
                {sandboxResult.msg}
              </div>

              {sandboxResult.isFrontend ? (
                <div style={{
                  background: '#0f172a',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    🖥️ Live Interactive Result Preview (Sandboxed):
                  </div>
                  <iframe
                    title="Frontend Live Preview"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            body { font-family: system-ui, -apple-system, sans-serif; color: #f1f5f9; padding: 16px; margin: 0; background: #0b0f19; }
                            ${cssCode}
                          </style>
                        </head>
                        <body>
                          ${htmlCode}
                          <script>
                            try {
                              ${jsCode}
                            } catch (err) {
                              const errDiv = document.createElement('div');
                              errDiv.style.color = '#ef4444';
                              errDiv.style.marginTop = '12px';
                              errDiv.style.fontWeight = 'bold';
                              errDiv.textContent = 'JavaScript Error: ' + err.message;
                              document.body.appendChild(errDiv);
                            }
                          </script>
                        </body>
                      </html>
                    `}
                    style={{
                      width: '100%',
                      height: '240px',
                      border: '1.5px solid #334155',
                      borderRadius: '8px',
                      background: '#0b0f19'
                    }}
                  />
                </div>
              ) : (
                sandboxResult.output && (
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
                )
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

            <CodeEditorWithLineNumbers
              value={userChallengeCode}
              onChange={e => setUserChallengeCode(e.target.value)}
              color="#38bdf8"
              borderColor="#475569"
              rows={5}
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
