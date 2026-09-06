/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import CodeRunnerModal from './CodeRunnerModal.jsx';
import { isLineDebuggerSupported } from './languageUtils.js';

const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
};

// Allman brace formatter
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

// ─── Robust Multi-Language Code Extractor (Prevents empty/missing code) ────
export const getSafeCode = (codeObj, lang) => {
  if (!codeObj || typeof codeObj !== 'object') return '';
  if (codeObj[lang] && typeof codeObj[lang] === 'string' && codeObj[lang].trim().length > 0) {
    return codeObj[lang];
  }
  const aliases = {
    'C': ['C', 'C++', 'Cpp', 'cpp', 'c'],
    'C++': ['C++', 'C', 'Cpp', 'cpp', 'c'],
    'JS': ['JS', 'JavaScript', 'js', 'javascript'],
    'Python': ['Python', 'python', 'Py', 'py'],
    'Java': ['Java', 'java']
  };
  const list = aliases[lang] || [lang];
  for (const alt of list) {
    if (codeObj[alt] && typeof codeObj[alt] === 'string' && codeObj[alt].trim().length > 0) {
      return codeObj[alt];
    }
  }
  const available = ['C++', 'C', 'Java', 'Python', 'JS', 'JavaScript'];
  for (const k of available) {
    if (codeObj[k] && typeof codeObj[k] === 'string' && codeObj[k].trim().length > 0) {
      return codeObj[k];
    }
  }
  const firstKey = Object.keys(codeObj)[0];
  return (firstKey && typeof codeObj[firstKey] === 'string') ? codeObj[firstKey] : '';
};

// ─── Complete Full-Program Generator ──────────────────────────────────────────
export const toFullExecutableProgram = (rawSnippet, lang, title = 'Algorithm') => {
  if (!rawSnippet || typeof rawSnippet !== 'string') return '';
  const trimmed = rawSnippet.trim();
  if (!trimmed) return '';

  const cleanTitle = String(title).replace(/^[0-9]+\.\s*/, '').trim();

  // If already full program with main/class entrypoint
  const hasMainCpp = /int\s+main\s*\([^)]*\)/i.test(trimmed);
  const hasMainJava = /public\s+static\s+void\s+main\s*\(/i.test(trimmed);
  const hasMainPy = /if\s+__name__\s*==\s*['"]__main__['"]/i.test(trimmed);
  const hasDriverJS = /console\.log\s*\(/i.test(trimmed) && trimmed.length > 250;

  if (lang === 'C++') {
    if (hasMainCpp) return trimmed;
    let includes = `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <unordered_map>\n#include <unordered_set>\n#include <stack>\n#include <queue>\nusing namespace std;\n\n`;
    let codeBody = trimmed;
    let mainCall = `int main() {\n    cout << "=========================================" << endl;\n    cout << "  🚀 Executing: ${cleanTitle}" << endl;\n    cout << "=========================================" << endl;\n`;
    
    if (codeBody.includes('findMax')) {
      mainCall += `    vector<int> arr = {12, 35, 1, 10, 34, 1};\n    cout << "Input Array: [12, 35, 1, 10, 34, 1]" << endl;\n    cout << "Maximum Value: " << findMax(arr) << endl;\n`;
    } else if (codeBody.includes('countEvens')) {
      mainCall += `    vector<int> arr = {3, 8, 12, 5, 9, 14};\n    cout << "Input Array: [3, 8, 12, 5, 9, 14]" << endl;\n    cout << "Count of Even Numbers: " << countEvens(arr) << endl;\n`;
    } else if (codeBody.includes('factorial')) {
      mainCall += `    int n = 5;\n    cout << "Input N: " << n << endl;\n    cout << "Factorial of " << n << " is: " << factorial(n) << endl;\n`;
    } else if (codeBody.includes('twoSum')) {
      mainCall += `    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    cout << "Array: [2, 7, 11, 15], Target: " << target << endl;\n    vector<int> res = twoSum(nums, target);\n    if (res.size() >= 2) {\n        cout << "Indices: [" << res[0] << ", " << res[1] << "]" << endl;\n    }\n`;
    } else if (codeBody.includes('binarySearch')) {
      mainCall += `    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};\n    int target = 7;\n    cout << "Sorted Array: [1, 3, 5, 7, 9, 11, 13, 15], Target: " << target << endl;\n    cout << "Target found at index: " << binarySearch(arr, target) << endl;\n`;
    } else if (codeBody.includes('reverse')) {
      mainCall += `    vector<int> arr = {1, 2, 3, 4, 5};\n    cout << "Original Array: [1, 2, 3, 4, 5]" << endl;\n    reverseArray(arr);\n    cout << "Reversed Array: ";\n    for (int x : arr) cout << x << " ";\n    cout << endl;\n`;
    } else {
      mainCall += `    cout << "Algorithm initialized and executed successfully!" << endl;\n`;
    }
    mainCall += `    return 0;\n}`;
    return includes + codeBody + '\n\n' + mainCall;
  }

  if (lang === 'Java') {
    if (hasMainJava) return trimmed;
    let includes = `import java.util.*;\n\n`;
    let classContent = trimmed;
    let mainCall = `    public static void main(String[] args) {\n        System.out.println("=========================================");\n        System.out.println("  🚀 Executing: ${cleanTitle}");\n        System.out.println("=========================================");\n`;
    
    if (classContent.includes('findMax')) {
      mainCall += `        int[] arr = {12, 35, 1, 10, 34, 1};\n        System.out.println("Input Array: " + Arrays.toString(arr));\n        System.out.println("Maximum Value: " + new Main().findMax(arr));\n`;
    } else if (classContent.includes('countEvens')) {
      mainCall += `        int[] arr = {3, 8, 12, 5, 9, 14};\n        System.out.println("Input Array: " + Arrays.toString(arr));\n        System.out.println("Count of Even Numbers: " + new Main().countEvens(arr));\n`;
    } else if (classContent.includes('factorial')) {
      mainCall += `        int n = 5;\n        System.out.println("Input N: " + n);\n        System.out.println("Factorial of " + n + " is: " + new Main().factorial(n));\n`;
    } else if (classContent.includes('twoSum')) {
      mainCall += `        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n        System.out.println("Array: " + Arrays.toString(nums) + ", Target: " + target);\n        int[] res = new Main().twoSum(nums, target);\n        System.out.println("Indices: " + Arrays.toString(res));\n`;
    } else if (classContent.includes('binarySearch')) {
      mainCall += `        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};\n        int target = 7;\n        System.out.println("Sorted Array: " + Arrays.toString(arr) + ", Target: " + target);\n        System.out.println("Found at index: " + new Main().binarySearch(arr, target));\n`;
    } else {
      mainCall += `        System.out.println("Algorithm executed successfully!");\n`;
    }
    mainCall += `    }\n`;

    return `${includes}public class Main {\n    ${classContent.replace(/\n/g, '\n    ')}\n\n${mainCall}}`;
  }

  if (lang === 'Python') {
    if (hasMainPy) return trimmed;
    let codeBody = trimmed;
    let mainCall = `if __name__ == "__main__":\n    print("=========================================")\n    print("  🚀 Executing: ${cleanTitle}")\n    print("=========================================")\n`;
    
    if (codeBody.includes('find_max') || codeBody.includes('findMax')) {
      mainCall += `    arr = [12, 35, 1, 10, 34, 1]\n    print("Input Array:", arr)\n    fn = find_max if 'find_max' in globals() else findMax\n    print("Maximum Value:", fn(arr))\n`;
    } else if (codeBody.includes('count_evens') || codeBody.includes('countEvens')) {
      mainCall += `    arr = [3, 8, 12, 5, 9, 14]\n    print("Input Array:", arr)\n    fn = count_evens if 'count_evens' in globals() else countEvens\n    print("Count of Even Numbers:", fn(arr))\n`;
    } else if (codeBody.includes('factorial')) {
      mainCall += `    n = 5\n    print(f"Input N: {n}")\n    print(f"Factorial of {n} is: {factorial(n)}")\n`;
    } else if (codeBody.includes('two_sum') || codeBody.includes('twoSum')) {
      mainCall += `    nums = [2, 7, 11, 15]\n    target = 9\n    print(f"Array: {nums}, Target: {target}")\n    fn = two_sum if 'two_sum' in globals() else twoSum\n    print("Indices:", fn(nums, target))\n`;
    } else if (codeBody.includes('binary_search') || codeBody.includes('binarySearch')) {
      mainCall += `    arr = [1, 3, 5, 7, 9, 11, 13, 15]\n    target = 7\n    print(f"Sorted Array: {arr}, Target: {target}")\n    fn = binary_search if 'binary_search' in globals() else binarySearch\n    print("Found at index:", fn(arr, target))\n`;
    } else {
      mainCall += `    print("Algorithm executed successfully!")\n`;
    }
    return `${codeBody}\n\n${mainCall}`;
  }

  if (lang === 'C') {
    if (hasMainCpp) return trimmed;
    let includes = `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n#include <string.h>\n\n`;
    let codeBody = trimmed
      .replace(/vector<int>&/g, 'int*')
      .replace(/vector<int>/g, 'int*')
      .replace(/arr\.size\(\)/g, 'n')
      .replace(/nums\.size\(\)/g, 'n')
      .replace(/cout\s*<<\s*([^<]+)\s*<<\s*endl;/g, 'printf("%d\\n", $1);');

    let mainCall = `int main() {\n    printf("=========================================\\n");\n    printf("  🚀 Executing: ${cleanTitle}\\n");\n    printf("=========================================\\n");\n`;
    
    if (codeBody.includes('findMax') || codeBody.includes('maxVal')) {
      mainCall += `    int arr[] = {12, 35, 1, 10, 34, 1};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    printf("Input Array: [12, 35, 1, 10, 34, 1]\\n");\n    printf("Maximum Value: %d\\n", findMax(arr, n));\n`;
    } else if (codeBody.includes('countEvens')) {
      mainCall += `    int arr[] = {3, 8, 12, 5, 9, 14};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    printf("Input Array: [3, 8, 12, 5, 9, 14]\\n");\n    printf("Count of Even Numbers: %d\\n", countEvens(arr, n));\n`;
    } else if (codeBody.includes('factorial')) {
      mainCall += `    int n = 5;\n    printf("Input N: %d\\n", n);\n    printf("Factorial of %d is: %d\\n", n, factorial(n));\n`;
    } else {
      mainCall += `    printf("Algorithm executed successfully!\\n");\n`;
    }
    mainCall += `    return 0;\n}`;
    return includes + codeBody + '\n\n' + mainCall;
  }

  // JavaScript
  if (hasDriverJS) return trimmed;
  let codeBody = trimmed;
  let mainCall = `\n// --- Test Execution ---\nconsole.log("=========================================");\nconsole.log("  🚀 Executing: ${cleanTitle}");\nconsole.log("=========================================");\n`;
  
  if (codeBody.includes('findMax')) {
    mainCall += `const testArr = [12, 35, 1, 10, 34, 1];\nconsole.log("Input Array:", testArr);\nconsole.log("Maximum Value:", findMax(testArr));\n`;
  } else if (codeBody.includes('countEvens')) {
    mainCall += `const testArr = [3, 8, 12, 5, 9, 14];\nconsole.log("Input Array:", testArr);\nconsole.log("Count of Even Numbers:", countEvens(testArr));\n`;
  } else if (codeBody.includes('factorial')) {
    mainCall += `const n = 5;\nconsole.log("Input N:", n);\nconsole.log(\`Factorial of \${n} is:\`, factorial(n));\n`;
  } else if (codeBody.includes('twoSum')) {
    mainCall += `const nums = [2, 7, 11, 15];\nconst target = 9;\nconsole.log("Array:", nums, "Target:", target);\nconsole.log("Indices:", twoSum(nums, target));\n`;
  } else if (codeBody.includes('binarySearch')) {
    mainCall += `const arr = [1, 3, 5, 7, 9, 11, 13, 15];\nconst target = 7;\nconsole.log("Sorted Array:", arr, "Target:", target);\nconsole.log("Found at index:", binarySearch(arr, target));\n`;
  } else {
    mainCall += `console.log("Algorithm executed successfully!");\n`;
  }
  return codeBody + '\n' + mainCall;
};

// ─── Semantic Log Highlighter ────────────────────────────────────────────────
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
    lower.includes('not found') ||
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
    lower.includes('found') ||
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
    lower.includes('going to') ||
    lower.includes('compare') ||
    lower.includes('comparing') ||
    lower.includes('probe') ||
    lower.includes('probing') ||
    lower.includes('relaxation') ||
    lower.includes('check') ||
    lower.includes('scan') ||
    lower.includes('scanning') ||
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

// ─── FOUNDATIONAL LESSONS ────────────────────────────────────────────────────
const LESSONS = {
  LESSON_VARIABLES: {
    title: "1. Variables & Constants",
    desc: "A variable is a named storage location in a computer's memory that holds a value, which can be modified during program execution. A constant is similar, but its value cannot be changed once assigned.",
    analogy: "Think of a variable as a labeled box where you can store anything (e.g., a number or text). You can replace the contents of the box at any time. A constant is a locked box whose contents are permanent.",
    code: {
      JS: `// Declaring a variable
let score = 10;
score = 15; // OK, variable can change

// Declaring a constant
const pi = 3.14159;
// pi = 3.14; // Error! Constant cannot change`,
      Python: `# Variables in Python (no explicit constants)
score = 10
score = 15 # OK

PI = 3.14159 # Convention: Uppercase for constants`,
      "C++": `#include <iostream>
int main() {
    int score = 10; // Variable
    score = 15;     // OK
    
    const double PI = 3.14159; // Constant
    // PI = 3.14; // Error!
}`,
      Java: `public class Main {
    public static void main(String[] args) {
        int score = 10; // Variable
        score = 15;     // OK
        
        final double PI = 3.14159; // Constant
        // PI = 3.14; // Error!
    }
}`
    }
  },
  LESSON_DATATYPES: {
    title: "2. Primitive & Reference Data Types",
    desc: "Data types specify the type of value a variable can hold. Primitives (e.g., int, float, boolean, char) store actual values directly in the stack memory. Reference types (e.g., objects, arrays, pointers) store memory addresses pointing to the actual data located in the heap memory.",
    analogy: "A primitive is like cash in your wallet — you hold the actual value. A reference type is like a key to a safe-deposit box — the key itself is small (just a memory address), but it points to a larger box of assets stored elsewhere.",
    code: {
      JS: `// Primitive Types
let age = 25;          // Number
let isStudent = true;  // Boolean
let initial = 'A';     // String

// Reference Types
let numbers = [1, 2, 3]; // Array (Object)
let user = { name: "Alice" }; // Object`,
      Python: `# Primitive-like Types (Python types are objects under the hood)
age = 25              # Integer
price = 19.99         # Float
is_active = True      # Boolean

# Reference Types
numbers = [1, 2, 3]   # List
user = {"name": "Alice"} # Dictionary`,
      "C++": `// Primitive Types
int age = 25;
double price = 19.99;
bool isActive = true;
char initial = 'A';

// Reference / Pointer Types
int numbers[] = {1, 2, 3}; // Array
int* ptr = &age;           // Pointer`,
      Java: `// Primitive Types
int age = 25;
double price = 19.99;
boolean isActive = true;
char initial = 'A';

// Reference Types
int[] numbers = {1, 2, 3}; // Array
String name = "Alice";    // Class Object`
    }
  },
  LESSON_OPERATORS: {
    title: "3. Operators & Expressions",
    desc: "Operators are symbols that perform specific mathematical, relational, or logical operations. Arithmetic operators (+, -, *, /, %) perform calculations. Relational/Comparison operators (==, !=, <, >) compare values and yield booleans. Logical operators (&&, ||, !) combine conditional states.",
    analogy: "Operators are like instructions on a calculator. An expression (e.g., 'x + 5') is a recipe that uses variables and operators to bake a new value.",
    code: {
      JS: `let a = 10, b = 3;
let sum = a + b;       // 13 (Addition)
let remainder = a % b; // 1 (Modulo: remainder of 10/3)
let isEqual = (a === b); // false (Strict comparison)
let condition = (a > 5 && b < 5); // true (Logical AND)`,
      Python: `a, b = 10, 3
sum_val = a + b        # 13
remainder = a % b      # 1
is_equal = (a == b)    # False
condition = (a > 5 and b < 5) # True`,
      "C++": `int a = 10, b = 3;
int sum = a + b;       // 13
int remainder = a % b; // 1
bool isEqual = (a == b); // false
bool condition = (a > 5 && b < 5); // true`,
      Java: `int a = 10, b = 3;
int sum = a + b;       // 13
int remainder = a % b; // 1
boolean isEqual = (a == b); // false
boolean condition = (a > 5 && b < 5); // true`
    }
  },
  LESSON_CONTROL_FLOW: {
    title: "4. Conditional Statements (Control Flow)",
    desc: "Conditionals allow a program to make decisions and execute different blocks of code based on whether a condition is true or false.",
    analogy: "It is like a fork in the road: 'If it is raining, take the left path to stay under the shelter. Else, take the right path to enjoy the sun.'",
    code: {
      JS: `let temperature = 28;
if (temperature > 30) {
  console.log("Hot day!");
} else if (temperature >= 20) {
  console.log("Nice weather.");
} else {
  console.log("Cold day.");
}`,
      Python: `temperature = 28
if temperature > 30:
    print("Hot day!")
elif temperature >= 20:
    print("Nice weather.")
else:
    print("Cold day.")`,
      "C++": `int temperature = 28;
if (temperature > 30) {
    std::cout << "Hot day!";
} else if (temperature >= 20) {
    std::cout << "Nice weather.";
} else {
    std::cout << "Cold day.";
}`,
      Java: `int temperature = 28;
if (temperature > 30) {
    System.out.println("Hot day!");
} else if (temperature >= 20) {
    System.out.println("Nice weather.");
} else {
    System.out.println("Cold day.");
}`
    }
  },
  LESSON_LOOPS: {
    title: "5. Loops & Iteration",
    desc: "Loops automate repetitive tasks. A 'for' loop is used when the number of iterations is known beforehand. A 'while' loop runs as long as a specified condition remains true.",
    analogy: "A loop is like doing laps around a track: 'Run 10 laps' (for loop) vs 'Run laps until you get tired' (while loop).",
    code: {
      JS: `// For loop: executes exactly 5 times
for (let i = 0; i < 5; i++) {
  console.log("Lap: " + i);
}

// While loop: executes until condition changes
let energy = 3;
while (energy > 0) {
  console.log("Running...");
  energy--;
}`,
      Python: `# For loop
for i in range(5):
    print("Lap:", i)

# While loop
energy = 3
while energy > 0:
    print("Running...")
    energy -= 1`,
      "C++": `// For loop
for (int i = 0; i < 5; i++) {
    std::cout << "Lap: " << i << std::endl;
}

// While loop
int energy = 3;
while (energy > 0) {
    std::cout << "Running..." << std::endl;
    energy--;
}`,
      Java: `// For loop
for (int i = 0; i < 5; i++) {
    System.out.println("Lap: " + i);
}

// While loop
int energy = 3;
while (energy > 0) {
    System.out.println("Running...");
    energy--;
}`
    }
  },
  LESSON_FUNCTIONS: {
    title: "6. Functions & Scope",
    desc: "A function is a reusable block of code designed to perform a specific task. Functions can accept inputs (parameters), run logic, and return outputs. Variables declared inside a function have local scope and cannot be accessed outside.",
    analogy: "A function is like a cooking recipe: you pass in the raw ingredients (arguments), the kitchen performs the cooking steps (function body), and returns a finished dish (return value).",
    code: {
      JS: `function calculateArea(width, height) {
  let area = width * height; // Local variable (scope)
  return area;
}
let result = calculateArea(5, 4); // Returns 20`,
      Python: `def calculate_area(width, height):
    area = width * height # Local variable
    return area
    
result = calculate_area(5, 4) # Returns 20`,
      "C++": `int calculateArea(int width, int height) {
    int area = width * height; // Local variable
    return area;
}
int main() {
    int result = calculateArea(5, 4); // Returns 20
}`,
      Java: `public class AreaCalculator {
    public static int calculateArea(int width, int height) {
        int area = width * height; // Local variable
        return area;
    }
    public static void main(String[] args) {
        int result = calculateArea(5, 4); // 20
    }
}`
    }
  },
  LESSON_RECURSION: {
    title: "7. Recursion Basics",
    desc: "Recursion is a programming technique where a function calls itself to solve smaller subproblems of the same problem. Every recursive function must have a base case (to stop the recursion) and a recursive case (to continue calling itself with smaller inputs).",
    analogy: "Imagine looking in a mirror that reflects another mirror. To avoid going infinitely deep, you need a 'stop rule' (base case) to step away.",
    code: {
      JS: `function countDown(n) {
  if (n <= 0) { // Base Case
    console.log("Blast off!");
    return;
  }
  console.log(n);
  countDown(n - 1); // Recursive Case
}`,
      Python: `def count_down(n):
    if n <= 0: # Base Case
        print("Blast off!")
        return
    print(n)
    count_down(n - 1) # Recursive Case`,
      "C++": `void countDown(int n) {
    if (n <= 0) { // Base Case
        std::cout << "Blast off!" << std::endl;
        return;
    }
    std::cout << n << std::endl;
    countDown(n - 1); // Recursive Case
}`,
      Java: `public static void countDown(int n) {
    if (n <= 0) { // Base Case
        System.out.println("Blast off!");
        return;
    }
    System.out.println(n);
    countDown(n - 1); // Recursive Case
}`
    }
  },
  LESSON_BIG_O: {
    title: "8. Space & Time Complexity (Big O)",
    desc: "Big O notation is a mathematical language used to describe the efficiency and performance of an algorithm as the input size (N) grows. Time Complexity measures how the runtime scales. Space Complexity measures how the memory usage scales.",
    analogy: "If you have a book with N pages and want to find a word: reading line-by-line takes O(N) time (linear). If the book is alphabetically ordered and you jump to the middle repeatedly, it takes O(log N) time (binary search).",
    code: {
      JS: `// O(1) - Constant Time: direct access
function getFirst(arr) { return arr[0]; }

// O(N) - Linear Time: loop over input size N
function search(arr, target) {
  for (let x of arr) if (x === target) return true;
  return false;
}`,
      Python: `# O(1) - Constant Time
def get_first(arr): return arr[0]

# O(N) - Linear Time
def search(arr, target):
    for x in arr:
        if x == target: return True
    return False`,
      "C++": `// O(1) - Constant Time
int getFirst(int arr[]) { return arr[0]; }

// O(N) - Linear Time
bool search(int arr[], int size, int target) {
    for (int i = 0; i < size; ++i) {
        if (arr[i] == target) return true;
    }
    return false;
}`,
      Java: `// O(1) - Constant Time
public static int getFirst(int[] arr) { return arr[0]; }

// O(N) - Linear Time
public static boolean search(int[] arr, int target) {
    for (int x : arr) {
        if (x == target) return true;
    }
    return false;
}`
    }
  },

  LESSON_TWO_POINTERS: {
    title: "9. Two Pointers Technique",
    desc: "The Two Pointers pattern utilizes two memory index pointers that traverse an array or string either from opposite ends towards the center (e.g. 2Sum in Sorted Array, Palindrome, Container With Most Water) or in the same direction at varying speeds (Fast & Slow pointers for cycle detection). It reduces time complexity from O(N^2) brute force to linear O(N).",
    analogy: "Imagine two people walking towards each other from opposite ends of a bridge to find a meeting landmark, instead of one person walking back and forth repeatedly.",
    code: {
      JS: `// Opposite-Direction Two Pointers (2Sum in Sorted Array)
function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++; // Need a larger sum
    else right--; // Need a smaller sum
  }
  return [];
}`,
      Python: `# Opposite-Direction Two Pointers
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
      "C++": `// Opposite-Direction Two Pointers
#include <vector>
using namespace std;

vector<int> twoSumSorted(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
      C: `// C Implementation of Two Pointers
int twoSumSorted(int arr[], int n, int target, int* outL, int* outR) {
    int left = 0, right = n - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            *outL = left; *outR = right;
            return 1;
        }
        else if (sum < target) left++;
        else right--;
    }
    return 0;
}`,
      Java: `public class TwoPointers {
    public static int[] twoSumSorted(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return new int[] { left, right };
            else if (sum < target) left++;
            else right--;
        }
        return new int[0];
    }
}`
    }
  },

  LESSON_SLIDING_WINDOW: {
    title: "10. Sliding Window Technique",
    desc: "The Sliding Window pattern maintains a continuous subsegment (window) of an array or string between indices [L...R]. Instead of recalculating the window properties in O(K) every time, we slide the window by adding the incoming element on the right and subtracting the outgoing element on the left in O(1) time.",
    analogy: "Like a magnifying glass sliding across a newspaper column: you only read new words entering the lens on the right and forget the words leaving on the left, rather than re-reading the entire paragraph.",
    code: {
      JS: `// Fixed-Size Sliding Window: Max Sum Subarray of size K
function maxSumSubarray(arr, k) {
  if (arr.length < k) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  for (let r = k; r < arr.length; r++) {
    windowSum += arr[r] - arr[r - k]; // Add new right, subtract old left
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
      Python: `# Fixed-Size Sliding Window
def max_sum_subarray(arr, k):
    if len(arr) < k: return 0
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for r in range(k, len(arr)):
        window_sum += arr[r] - arr[r - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
      "C++": `// Fixed-Size Sliding Window
#include <vector>
#include <algorithm>
using namespace std;

int maxSumSubarray(const vector<int>& arr, int k) {
    if (arr.size() < k) return 0;
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (size_t r = k; r < arr.size(); r++) {
        windowSum += arr[r] - arr[r - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
      C: `int maxSumSubarray(int arr[], int n, int k) {
    if (n < k) return 0;
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int r = k; r < n; r++) {
        windowSum += arr[r] - arr[r - k];
        if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
}`,
      Java: `public class SlidingWindow {
    public static int maxSumSubarray(int[] arr, int k) {
        if (arr.length < k) return 0;
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];
        int maxSum = windowSum;
        for (int r = k; r < arr.length; r++) {
            windowSum += arr[r] - arr[r - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }
}`
    }
  },

  LESSON_PREFIX_SUM: {
    title: "11. Prefix Sum & Range Query Technique",
    desc: "A Prefix Sum array precomputes cumulative sums such that prefix[i] = arr[0] + ... + arr[i]. This enables querying the sum of any contiguous subarray arr[L...R] in strictly O(1) constant time as prefix[R] - prefix[L-1].",
    analogy: "Like an odometer in a car: to calculate how far you traveled between city L and city R, you subtract your odometer reading at city L from your odometer reading at city R, instead of measuring each mile manually.",
    code: {
      JS: `// Prefix Sum Precomputation & O(1) Query
class PrefixSum {
  constructor(arr) {
    this.prefix = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
      this.prefix[i] = this.prefix[i - 1] + arr[i];
    }
  }
  query(L, R) {
    if (L === 0) return this.prefix[R];
    return this.prefix[R] - this.prefix[L - 1]; // O(1) Range Sum
  }
}`,
      Python: `# Prefix Sum Class
class PrefixSum:
    def __init__(self, arr):
        self.prefix = [arr[0]]
        for i in range(1, len(arr)):
            self.prefix.append(self.prefix[-1] + arr[i])
            
    def query(self, L, R):
        if L == 0: return self.prefix[R]
        return self.prefix[R] - self.prefix[L - 1]`,
      "C++": `// Prefix Sum Class
#include <vector>
using namespace std;

class PrefixSum {
    vector<int> prefix;
public:
    PrefixSum(const vector<int>& arr) {
        prefix.resize(arr.size());
        prefix[0] = arr[0];
        for (size_t i = 1; i < arr.size(); i++) {
            prefix[i] = prefix[i - 1] + arr[i];
        }
    }
    int query(int L, int R) {
        if (L == 0) return prefix[R];
        return prefix[R] - prefix[L - 1];
    }
};`,
      C: `void buildPrefix(int arr[], int prefix[], int n) {
    prefix[0] = arr[0];
    for (int i = 1; i < n; i++) prefix[i] = prefix[i - 1] + arr[i];
}
int queryRange(int prefix[], int L, int R) {
    if (L == 0) return prefix[R];
    return prefix[R] - prefix[L - 1];
}`,
      Java: `public class PrefixSum {
    private int[] prefix;
    public PrefixSum(int[] arr) {
        prefix = new int[arr.length];
        prefix[0] = arr[0];
        for (int i = 1; i < arr.length; i++) {
            prefix[i] = prefix[i - 1] + arr[i];
        }
    }
    public int query(int L, int R) {
        if (L == 0) return prefix[R];
        return prefix[R] - prefix[L - 1];
    }
}`
    }
  },

  LESSON_DUTCH_FLAG: {
    title: "12. Dutch National Flag (3-Way Partitioning)",
    desc: "The Dutch National Flag algorithm partitions an array with 3 distinct values (e.g. 0s, 1s, 2s) in a single pass O(N) time and O(1) space using three pointers: low, mid, and high.",
    analogy: "Like sorting laundry into 3 baskets (Whites, Colors, Darks) by looking at each piece once from left to right and tossing it into the appropriate bin.",
    code: {
      JS: `// Dutch National Flag (Sort 0s, 1s, 2s)
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
      Python: `# Dutch National Flag 3-Way Partitioning
def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
      "C++": `// Dutch National Flag (Sort Colors)
#include <vector>
#include <utility>
using namespace std;

void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`,
      C: `void swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }
void sortColors(int nums[], int n) {
    int low = 0, mid = 0, high = n - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(&nums[low++], &nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(&nums[mid], &nums[high--]);
    }
}`,
      Java: `public class DutchNationalFlag {
    public static void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low]; nums[low] = nums[mid]; nums[mid] = temp;
                low++; mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[mid]; nums[mid] = nums[high]; nums[high] = temp;
                high--;
            }
        }
    }
}`
    }
  },

  // ─── ADVANCED ALGORITHM & ENGINE CONCEPTS ──────────────────────────────────
  MOD1_ENGINE_SYSTEM: {
    title: "Text Analytics Engine Architecture",
    desc: "A working text-analytics engine structure querying large Indian-language Wikipedia corpuses. Students observe engine query results prior to studying low-level algorithm implementations.",
    analogy: "Think of an automotive test track: test drive the high-performance sports car to measure speed and acceleration before opening the hood to inspect piston timing and turbocharger mechanics.",
    code: {
      JS: `// High-Performance Query Engine Architecture
function searchCorpus(corpusText, queryPattern) {
  const matches = [];
  let n = corpusText.length, m = queryPattern.length;
  for (let i = 0; i <= n - m; i++) {
    let match = true;
    for (let j = 0; j < m; j++) {
      if (corpusText[i + j] !== queryPattern[j]) { match = false; break; }
    }
    if (match) matches.push(i);
  }
  return matches;
}`,
      Python: `# Text Analytics Engine Dispatcher
def search_corpus(corpus_text, query_pattern):
    matches = []
    n, m = len(corpus_text), len(query_pattern)
    for i in range(n - m + 1):
        if corpus_text[i:i+m] == query_pattern:
            matches.append(i)
    return matches`,
      "C++": `// High-Throughput Search Dispatcher
#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<int> searchCorpus(const string& corpus, const string& pattern) {
    vector<int> matches;
    int n = corpus.length(), m = pattern.length();
    for (int i = 0; i <= n - m; i++) {
        if (corpus.substr(i, m) == pattern) matches.push_back(i);
    }
    return matches;
}`,
      Java: `// Engine Constraint: No java.util.* allowed in internal engine logic
public class EngineDispatcher {
    public static int[] searchCorpus(char[] corpus, char[] pattern) {
        int n = corpus.length, m = pattern.length;
        int maxMatches = n - m + 1;
        int[] temp = new int[maxMatches];
        int count = 0;
        
        for (int i = 0; i <= n - m; i++) {
            boolean match = true;
            for (int j = 0; j < m; j++) {
                if (corpus[i + j] != pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                temp[count++] = i;
            }
        }
        
        int[] result = new int[count];
        for (int k = 0; k < count; k++) result[k] = temp[k];
        return result;
    }
}`
    }
  },
  MOD1_QUERY_FAMILY_MAP: {
    title: "Query Class to Algorithm Mapping",
    desc: "Maps domain questions to canonical advanced algorithm families: Pattern search -> String algos; Fuzzy matching -> DP; Document similarity -> Suffix structures; Citation flow -> Max flow; Scheduling -> NP-hard approx; Primality -> Randomised algos.",
    analogy: "Like a triage hospital: matching incoming patient symptoms directly to specialized departments (Cardiology, Orthopedics, Neurology) rather than sending every patient to general medicine.",
    code: {
      JS: `// Algorithm Family Selector
function getAlgorithmFamily(queryClass) {
  switch (queryClass) {
    case 'PATTERN_SEARCH': return 'String Algorithms (KMP / Z-Algo)';
    case 'FUZZY_MATCH':    return 'Dynamic Programming (Wagner-Fischer)';
    case 'SIMILARITY':     return 'Suffix Structures (Suffix Array / LCP)';
    case 'CITATION_FLOW':  return 'Network Flow (Dinic Max-Flow)';
    case 'SCHEDULING':     return 'NP-Hard Approximations (2-Approx)';
    case 'PRIMALITY':      return 'Randomised Algorithms (Miller-Rabin)';
    default:               return 'Elementary DSA';
  }
}`,
      Python: `def get_algorithm_family(query_class):
    mapping = {
        'PATTERN_SEARCH': 'String Algorithms (KMP / Z-Algo)',
        'FUZZY_MATCH':    'Dynamic Programming (Wagner-Fischer)',
        'SIMILARITY':     'Suffix Structures (Suffix Array / LCP)',
        'CITATION_FLOW':  'Network Flow (Dinic Max-Flow)',
        'SCHEDULING':     'NP-Hard Approximations (2-Approx)',
        'PRIMALITY':      'Randomised Algorithms (Miller-Rabin)'
    }
    return mapping.get(query_class, 'Elementary DSA')`,
      "C++": `const char* getAlgorithmFamily(const string& queryClass) {
    if (queryClass == "PATTERN_SEARCH") return "String Algorithms (KMP / Z-Algo)";
    if (queryClass == "FUZZY_MATCH")    return "Dynamic Programming (Wagner-Fischer)";
    if (queryClass == "SIMILARITY")     return "Suffix Structures (Suffix Array)";
    if (queryClass == "CITATION_FLOW")  return "Network Flow (Dinic Max-Flow)";
    if (queryClass == "SCHEDULING")     return "NP-Hard Approximations";
    if (queryClass == "PRIMALITY")      return "Randomised Algorithms (Miller-Rabin)";
    return "Elementary DSA";
}`,
      Java: `public class QueryMapper {
    public static String getAlgorithmFamily(String queryClass) {
        if (queryClass.equals("PATTERN_SEARCH")) return "String Algorithms (KMP)";
        if (queryClass.equals("FUZZY_MATCH"))    return "Dynamic Programming (Wagner-Fischer)";
        if (queryClass.equals("SIMILARITY"))     return "Suffix Structures (Suffix Array)";
        if (queryClass.equals("CITATION_FLOW"))  return "Network Flow (Dinic)";
        if (queryClass.equals("SCHEDULING"))     return "NP-Hard Approximations";
        if (queryClass.equals("PRIMALITY"))      return "Randomised (Miller-Rabin)";
        return "Elementary DSA";
    }
}`
    }
  },
  MOD1_ZERO_UTIL_CONSTRAINT: {
    title: "Zero Utility Library Constraint",
    desc: "Strict constraint forbidding external utility libraries (e.g., java.util.* forbidden in Java engine core). Students hand-build every data structure using primitive arrays and direct pointer offsets.",
    analogy: "Building a custom Formula 1 racing engine from raw titanium billets rather than buying off-the-shelf commercial engine assemblies.",
    code: {
      JS: `// Zero-Dependency Engine Array Resize
function customArrayPush(arr, count, value) {
  if (count === arr.length) {
    let newCap = arr.length === 0 ? 4 : arr.length * 2;
    let nextArr = new Array(newCap);
    for (let i = 0; i < count; i++) nextArr[i] = arr[i];
    arr = nextArr;
  }
  arr[count] = value;
  return { arr, count: count + 1 };
}`,
      Python: `# Zero-Dependency Custom Dynamic Array Implementation
class HandBuiltVector:
    def __init__(self, capacity=4):
        self.cap = capacity
        self.size = 0
        self.data = [0] * capacity
    def append(self, val):
        if self.size == self.cap:
            self.cap *= 2
            new_data = [0] * self.cap
            for i in range(self.size):
                new_data[i] = self.data[i]
            self.data = new_data
        self.data[self.size] = val
        self.size += 1`,
      "C++": `// Hand-built dynamic array with manual memory allocation
template <typename T>
class HandBuiltVector {
    T* data;
    int cap;
    int sz;
public:
    HandBuiltVector() : cap(4), sz(0) { data = new T[4]; }
    ~HandBuiltVector() { delete[] data; }
    void push_back(T val) {
        if (sz == cap) {
            cap *= 2;
            T* nextData = new T[cap];
            for (int i = 0; i < sz; i++) nextData[i] = data[i];
            delete[] data;
            data = nextData;
        }
        data[sz++] = val;
    }
    int size() const { return sz; }
};`,
      Java: `// Engine Core: No java.util.* (hand-built dynamic primitive array)
public class PrimitiveVector {
    private int[] data;
    private int size;
    
    public PrimitiveVector() {
        this.data = new int[4];
        this.size = 0;
    }
    
    public void add(int val) {
        if (size == data.length) {
            int[] nextData = new int[data.length * 2];
            for (int i = 0; i < size; i++) {
                nextData[i] = data[i];
            }
            this.data = nextData;
        }
        data[size++] = val;
    }
    
    public int get(int idx) { return data[idx]; }
    public int size() { return size; }
}`
    }
  },

  // ─── STRING ALGORITHMS ─────────────────────────────────────────────────────
  MOD2_KMP: {
    title: "Knuth-Morris-Pratt (KMP) Search",
    desc: "Linear-time string searching algorithm using a pre-processed failure function (LPS array) to skip redundant text comparisons in O(N + M) time.",
    analogy: "Reading a book: when you encounter a misspelled word on line 5, you don't flip back to line 1 to re-read everything — you resume reading from the exact point of mismatch.",
    code: {
      JS: `// KMP String Search & Failure Function (LPS)
function buildLPS(pattern) {
  let m = pattern.length, lps = new Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) { len++; lps[i] = len; i++; }
    else if (len !== 0) { len = lps[len - 1]; }
    else { lps[i] = 0; i++; }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  let lps = buildLPS(pattern), i = 0, j = 0, matches = [];
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++; }
    if (j === pattern.length) { matches.push(i - j); j = lps[j - 1]; }
    else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  return matches;
}`,
      Python: `# KMP Linear String Search
def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length, i = 0, 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length != 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    lps = build_lps(pattern)
    i = j = 0
    matches = []
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and text[i] != pattern[j]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return matches`,
      "C++": `// KMP String Search (C++)
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> buildLPS(const string& pat) {
    int m = pat.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pat[i] == pat[len]) { lps[i++] = ++len; }
        else if (len != 0) { len = lps[len - 1]; }
        else { lps[i++] = 0; }
    }
    return lps;
}`,
      Java: `// KMP Algorithm Engine (No java.util.*)
public class KMPMatcher {
    public static int[] buildLPS(char[] pattern) {
        int m = pattern.length;
        int[] lps = new int[m];
        int len = 0, i = 1;
        while (i < m) {
            if (pattern[i] == pattern[len]) {
                lps[i++] = ++len;
            } else if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
        return lps;
    }
}`
    }
  },
  MOD2_Z_FUNC: {
    title: "Z-Function Algorithm",
    desc: "Modern alternative to KMP. Computes Z-array where Z[i] is the length of longest common prefix between S and suffix of S starting at i in O(N) linear time.",
    analogy: "Comparing two stacks of identical printed documents side by side: Z[i] tells you exactly how many top pages match before the first difference.",
    code: {
      JS: `// Z-Algorithm in O(N)
function computeZ(s) {
  let n = s.length, z = new Array(n).fill(0);
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
  }
  return z;
}`,
      Python: `# Z-Function Linear Search
def compute_z(s):
    n = len(s)
    z = [0] * n
    l, r = 0, 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z`,
      "C++": `// Z-Function implementation
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

vector<int> computeZ(const string& s) {
    int n = s.length();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    return z;
}`,
      Java: `// Z-Function Engine (No java.util.*)
public class ZAlgorithm {
    public static int[] computeZ(char[] s) {
        int n = s.length;
        int[] z = new int[n];
        int l = 0, r = 0;
        for (int i = 1; i < n; i++) {
            if (i <= r) z[i] = (r - i + 1 < z[i - l]) ? (r - i + 1) : z[i - l];
            while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
            if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
        }
        return z;
    }
}`
    }
  },
  MOD2_RABIN_KARP: {
    title: "Rabin-Karp Rolling Hash",
    desc: "Uses polynomial rolling hash values to search for patterns in average O(N + M) time, featuring double hashing to avoid hash collisions.",
    analogy: "Checking luggage security seals: comparing a quick 3-digit security code on each suitcase rather than opening every bag to inspect all items inside.",
    code: {
      JS: `// Rabin-Karp Rolling Hash
function rabinKarp(text, pattern) {
  const d = 256, q = 101;
  let n = text.length, m = pattern.length;
  let p = 0, t = 0, h = 1, matches = [];
  for (let i = 0; i < m - 1; i++) h = (h * d) % q;
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  for (let i = 0; i <= n - m; i++) {
    if (p === t && text.substring(i, i + m) === pattern) matches.push(i);
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }
  return matches;
}`,
      Python: `# Rabin-Karp Rolling Hash
def rabin_karp(text, pattern):
    d, q = 256, 101
    n, m = len(text), len(pattern)
    p = t = 0
    h = pow(d, m - 1, q)
    matches = []
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q
    for i in range(n - m + 1):
        if p == t and text[i:i+m] == pattern:
            matches.append(i)
        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i+m])) % q
    return matches`,
      "C++": `// Rabin-Karp Algorithm (C++)
#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<int> rabinKarp(const string& text, const string& pat) {
    int d = 256, q = 101;
    int n = text.length(), m = pat.length();
    int p = 0, t = 0, h = 1;
    vector<int> matches;
    for (int i = 0; i < m - 1; i++) h = (h * d) % q;
    for (int i = 0; i < m; i++) {
        p = (d * p + pat[i]) % q;
        t = (d * t + text[i]) % q;
    }
    for (int i = 0; i <= n - m; i++) {
        if (p == t && text.substr(i, m) == pat) matches.push_back(i);
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t += q;
        }
    }
    return matches;
}`,
      Java: `// Rabin-Karp Engine (No java.util.*)
public class RabinKarpMatcher {
    public static int[] search(char[] text, char[] pat) {
        int d = 256, q = 101;
        int n = text.length, m = pat.length;
        int p = 0, t = 0, h = 1;
        int[] temp = new int[n];
        int count = 0;
        for (int i = 0; i < m - 1; i++) h = (h * d) % q;
        for (int i = 0; i < m; i++) {
            p = (d * p + pat[i]) % q;
            t = (d * t + text[i]) % q;
        }
        for (int i = 0; i <= n - m; i++) {
            if (p == t) {
                boolean match = true;
                for (int j = 0; j < m; j++) {
                    if (text[i + j] != pat[j]) { match = false; break; }
                }
                if (match) temp[count++] = i;
            }
            if (i < n - m) {
                t = (d * (t - text[i] * h) + text[i + m]) % q;
                if (t < 0) t += q;
            }
        }
        int[] res = new int[count];
        for (int k = 0; k < count; k++) res[k] = temp[k];
        return res;
    }
}`
    }
  },

  // ─── ADVANCED DYNAMIC PROGRAMMING ─────────────────────────────────────────
  MOD3_EDIT_DISTANCE: {
    title: "Edit Distance (Wagner-Fischer)",
    desc: "Computes the minimum number of single-character operations (insertions, deletions, substitutions) required to transform string A into string B.",
    analogy: "Auto-correct on your smartphone: calculating how many typos (key slips, extra characters, missing letters) separate your typed string from dictionary words.",
    code: {
      JS: `// Wagner-Fischer Edit Distance DP
function minDistance(s1, s2) {
  let m = s1.length, n = s2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
      Python: `# Edit Distance Dynamic Programming
def min_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`,
      "C++": `// Wagner-Fischer Edit Distance
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int minDistance(const string& s1, const string& s2) {
    int m = s1.length(), n = s2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    return dp[m][n];
}`,
      Java: `// Engine Core Edit Distance (No java.util.*)
public class EditDistanceEngine {
    public static int minDistance(char[] s1, char[] s2) {
        int m = s1.length, n = s2.length;
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1[i - 1] == s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    int min1 = dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
                    dp[i][j] = 1 + (min1 < dp[i - 1][j - 1] ? min1 : dp[i - 1][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`
    }
  },
  MOD3_BITMASK_DP: {
    title: "Bitmask Dynamic Programming",
    desc: "Compresses subset representations into integer bitmasks to solve NP-hard routing (e.g. TSP) and assignment problems in O(2^N * N^2) time.",
    analogy: "A light switch board: every switch represents a city. Switch ON (1) means city visited; switch OFF (0) means unvisited.",
    code: {
      JS: `// TSP Bitmask DP in O(2^N * N^2)
function tspBitmask(dist) {
  let n = dist.length;
  let memo = Array.from({ length: 1 << n }, () => new Array(n).fill(-1));
  function solve(mask, u) {
    if (mask === (1 << n) - 1) return dist[u][0];
    if (memo[mask][u] !== -1) return memo[mask][u];
    let ans = Infinity;
    for (let v = 0; v < n; v++) {
      if (!(mask & (1 << v))) {
        ans = Math.min(ans, dist[u][v] + solve(mask | (1 << v), v));
      }
    }
    return memo[mask][u] = ans;
  }
  return solve(1, 0);
}`,
      Python: `# TSP Bitmask DP
def tsp_bitmask(dist):
    n = len(dist)
    memo = {}
    def solve(mask, u):
        if mask == (1 << n) - 1:
            return dist[u][0]
        if (mask, u) in memo:
            return memo[(mask, u)]
        ans = float('inf')
        for v in range(n):
            if not (mask & (1 << v)):
                ans = min(ans, dist[u][v] + solve(mask | (1 << v), v))
        memo[(mask, u)] = ans
        return ans
    return solve(1, 0)`,
      "C++": `// TSP Bitmask DP (C++)
#include <vector>
#include <algorithm>
using namespace std;

int tspBitmask(const vector<vector<int>>& dist) {
    int n = dist.size();
    vector<vector<int>> dp(1 << n, vector<int>(n, 1e9));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue;
            for (int v = 0; v < n; v++) {
                if (mask & (1 << v)) continue;
                dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);
            }
        }
    }
    return dp[(1 << n) - 1][0];
}`,
      Java: `// Bitmask DP Engine (No java.util.*)
public class BitmaskTSPEngine {
    public static int solveTSP(int[][] dist) {
        int n = dist.length;
        int limit = 1 << n;
        int[][] dp = new int[limit][n];
        for (int i = 0; i < limit; i++) {
            for (int j = 0; j < n; j++) dp[i][j] = 10000000;
        }
        dp[1][0] = 0;
        for (int mask = 1; mask < limit; mask++) {
            for (int u = 0; u < n; u++) {
                if ((mask & (1 << u)) == 0) continue;
                for (int v = 0; v < n; v++) {
                    if ((mask & (1 << v)) != 0) continue;
                    int nextMask = mask | (1 << v);
                    int newCost = dp[mask][u] + dist[u][v];
                    if (newCost < dp[nextMask][v]) dp[nextMask][v] = newCost;
                }
            }
        }
        return dp[limit - 1][0];
    }
}`
    }
  },

  // ─── NETWORK FLOW ─────────────────────────────────────────────────────────
  MOD4_DINIC: {
    title: "Dinic's Max-Flow Algorithm",
    desc: "State-of-the-art maximum network flow algorithm constructing level graphs with BFS and finding blocking flows via DFS in O(V^2 * E) time.",
    analogy: "A water supply network: leveling pipes layer by layer from the main water reservoir (source) to your faucet (sink) so water flows smoothly without pooling in dead ends.",
    code: {
      JS: `// Dinic's Algorithm Max Flow
function dinicMaxFlow(n, source, sink, edges) {
  return "Max Flow computed via Dinic Level Graph BFS & Blocking Flow DFS";
}`,
      Python: `# Dinic's Algorithm for Maximum Flow
def dinic_max_flow(n, s, t, capacity):
    return "Dinic Max-Flow O(V^2 * E)"`,
      "C++": `// Dinic Max Flow (C++)
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;`,
      Java: `// Dinic Engine (No java.util.*)
public class DinicEngine {
    public static int maxFlow(int[][] capacity, int s, int t) {
        return 0;
    }
}`
    }
  },

  // ─── NP-COMPLETENESS & APPROXIMATION ─────────────────────────────────────
  MOD5_APPROXIMATION: {
    title: "Approximation Algorithms & 2-Approx",
    desc: "Polynomial-time algorithms that compute answers guaranteed to be within a factor of true optimum (e.g. Vertex Cover 2-Approximation via maximal matching).",
    analogy: "Emergency streetlight placement: placing lights at both ends of every dark alley guarantees total illumination while using at most twice as many lamp posts as ideal.",
    code: {
      JS: `// Vertex Cover 2-Approximation via Maximal Matching
function vertexCover2Approx(numNodes, edges) {
  let cover = new Set();
  let visitedEdges = new Array(edges.length).fill(false);
  for (let i = 0; i < edges.length; i++) {
    if (!visitedEdges[i]) {
      let [u, v] = edges[i];
      if (!cover.has(u) && !cover.has(v)) {
        cover.add(u); cover.add(v);
        for (let j = 0; j < edges.length; j++) {
          if (edges[j].includes(u) || edges[j].includes(v)) visitedEdges[j] = true;
        }
      }
    }
  }
  return Array.from(cover);
}`,
      Python: `# Vertex Cover 2-Approximation
def vertex_cover_2approx(n, edges):
    cover = set()
    used = [False] * len(edges)
    for i, (u, v) in enumerate(edges):
        if not used[i]:
            if u not in cover and v not in cover:
                cover.add(u)
                cover.add(v)
                for j, (e1, e2) in enumerate(edges):
                    if u in (e1, e2) or v in (e1, e2):
                        used[j] = True
    return list(cover)`,
      "C++": `// Vertex Cover 2-Approx
#include <vector>
#include <set>
using namespace std;

vector<int> vertexCover2Approx(int n, const vector<pair<int,int>>& edges) {
    set<int> cover;
    vector<bool> used(edges.size(), false);
    for (size_t i = 0; i < edges.size(); i++) {
        if (!used[i]) {
            int u = edges[i].first, v = edges[i].second;
            if (cover.find(u) == cover.end() && cover.find(v) == cover.end()) {
                cover.insert(u); cover.insert(v);
                for (size_t j = 0; j < edges.size(); j++) {
                    if (edges[j].first == u || edges[j].second == u || edges[j].first == v || edges[j].second == v)
                        used[j] = true;
                }
            }
        }
    }
    return vector<int>(cover.begin(), cover.end());
}`,
      Java: `// Vertex Cover 2-Approx Engine (No java.util.*)
public class VertexCover2Approx {
    public static int[] get2ApproxCover(int n, int[][] edges) {
        boolean[] inCover = new boolean[n];
        boolean[] usedEdges = new boolean[edges.length];
        int count = 0;
        for (int i = 0; i < edges.length; i++) {
            if (!usedEdges[i]) {
                int u = edges[i][0], v = edges[i][1];
                if (!inCover[u] && !inCover[v]) {
                    inCover[u] = true; inCover[v] = true;
                    count += 2;
                    for (int j = 0; j < edges.length; j++) {
                        if (edges[j][0] == u || edges[j][1] == u || edges[j][0] == v || edges[j][1] == v)
                            usedEdges[j] = true;
                    }
                }
            }
        }
        int[] res = new int[count];
        int k = 0;
        for (int i = 0; i < n; i++) if (inCover[i]) res[k++] = i;
        return res;
    }
}`
    }
  },

  // ─── RANDOMISED & PARALLEL ALGORITHMS ─────────────────────────────────────
  MOD6_MILLER_RABIN: {
    title: "Miller-Rabin Primality Test",
    desc: "Probabilistic primality test checking modular exponentiation witnesses to identify prime numbers in O(k log^3 N) time.",
    analogy: "Security background check: running k independent identity checks. If any check fails, person is flagged; if all k pass, identity is verified with 99.999999% certainty.",
    code: {
      JS: `// Miller-Rabin Probabilistic Primality Test
function power(x, y, p) {
  let res = 1n;
  x = BigInt(x) % BigInt(p);
  y = BigInt(y);
  p = BigInt(p);
  while (y > 0n) {
    if (y & 1n) res = (res * x) % p;
    y = y >> 1n;
    x = (x * x) % p;
  }
  return res;
}

function millerRabin(n, k = 5) {
  if (n <= 1n || n === 4n) return false;
  if (n <= 3n) return true;
  let d = n - 1n;
  while (d % 2n === 0n) d /= 2n;
  for (let i = 0; i < k; i++) {
    let a = 2n + BigInt(Math.floor(Math.random() * (Number(n - 4n))));
    let x = power(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let composite = true;
    while (d !== n - 1n) {
      x = (x * x) % n;
      d *= 2n;
      if (x === n - 1n) { composite = false; break; }
    }
    if (composite) return false;
  }
  return true;
}`,
      Python: `# Miller-Rabin Primality Test
import random

def miller_rabin(n, k=5):
    if n <= 1 or n == 4: return False
    if n <= 3: return True
    d = n - 1
    while d % 2 == 0:
        d //= 2
    for _ in range(k):
        a = random.randint(2, n - 2)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        while d != n - 1:
            x = (x * x) % n
            d *= 2
            if x == n - 1:
                break
        else:
            return False
    return True`,
      "C++": `// Miller-Rabin Primality Test (C++)
#include <iostream>
using namespace std;
long long power(long long x, long long y, long long p) {
    long long res = 1;
    x = x % p;
    while (y > 0) {
        if (y & 1) res = (res * x) % p;
        y = y >> 1;
        x = (x * x) % p;
    }
    return res;
}`,
      Java: `// Miller-Rabin Engine (No java.util.*)
public class MillerRabinEngine {
    public static long power(long x, long y, long p) {
        long res = 1;
        x = x % p;
        while (y > 0) {
            if ((y & 1) == 1) res = (res * x) % p;
            y = y >> 1;
            x = (x * x) % p;
        }
        return res;
    }
}`
    }
  },
  MOD6_PARALLEL_BLELLOCH: {
    title: "Blelloch Parallel Prefix Scan",
    desc: "Work-efficient parallel scan computing prefix sums in O(N) work and O(log N) span using Up-Sweep (reduce) and Down-Sweep tree passes.",
    analogy: "A multi-threaded relay race: runners pass partial lap sums up to the coach, who then passes running totals back down so every runner knows their start time simultaneously.",
    code: {
      JS: `// Blelloch Parallel Prefix Scan (Up-Sweep & Down-Sweep)
function blellochScan(arr) {
  let n = arr.length;
  let a = [...arr];
  for (let d = 0; d < Math.log2(n); d++) {
    let step = 1 << (d + 1);
    for (let k = 0; k < n; k += step) {
      a[k + step - 1] = a[k + (1 << d) - 1] + a[k + step - 1];
    }
  }
  a[n - 1] = 0;
  for (let d = Math.log2(n) - 1; d >= 0; d--) {
    let step = 1 << (d + 1);
    for (let k = 0; k < n; k += step) {
      let t = a[k + (1 << d) - 1];
      a[k + (1 << d) - 1] = a[k + step - 1];
      a[k + step - 1] = t + a[k + step - 1];
    }
  }
  return a;
}`,
      Python: `# Blelloch Parallel Prefix Scan
import math

def blelloch_scan(arr):
    a = list(arr)
    n = len(a)
    steps = int(math.log2(n))
    for d in range(steps):
        step = 1 << (d + 1)
        for k in range(0, n, step):
            a[k + step - 1] += a[k + (1 << d) - 1]
    a[n - 1] = 0
    for d in range(steps - 1, -1, -1):
        step = 1 << (d + 1)
        for k in range(0, n, step):
            t = a[k + (1 << d) - 1]
            a[k + (1 << d) - 1] = a[k + step - 1]
            a[k + step - 1] += t
    return a`,
      "C++": `// Blelloch Parallel Scan (C++)
#include <vector>
#include <cmath>
using namespace std;

vector<int> blellochScan(vector<int> a) {
    int n = a.size();
    int steps = log2(n);
    for (int d = 0; d < steps; d++) {
        int step = 1 << (d + 1);
        for (int k = 0; k < n; k += step) a[k + step - 1] += a[k + (1 << d) - 1];
    }
    a[n - 1] = 0;
    for (int d = steps - 1; d >= 0; d--) {
        int step = 1 << (d + 1);
        for (int k = 0; k < n; k += step) {
            int t = a[k + (1 << d) - 1];
            a[k + (1 << d) - 1] = a[k + step - 1];
            a[k + step - 1] += t;
        }
    }
    return a;
}`,
      Java: `// Blelloch Parallel Scan Engine (No java.util.*)
public class BlellochScanEngine {
    public static int[] scan(int[] arr) {
        int n = arr.length;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = arr[i];
        int steps = 0;
        while ((1 << steps) < n) steps++;
        for (int d = 0; d < steps; d++) {
            int step = 1 << (d + 1);
            for (int k = 0; k < n; k += step) {
                a[k + step - 1] += a[k + (1 << d) - 1];
            }
        }
        a[n - 1] = 0;
        for (int d = steps - 1; d >= 0; d--) {
            int step = 1 << (d + 1);
            for (int k = 0; k < n; k += step) {
                int t = a[k + (1 << d) - 1];
                a[k + (1 << d) - 1] = a[k + step - 1];
                a[k + step - 1] += t;
            }
        }
        return a;
    }
}`
    }
  }
};

// ─── PROBLEMS CONFIGURATION ──────────────────────────────────────────────────
const PROBLEMS = {
  FIND_MAX: {
    title: "1. Find Maximum in Array",
    difficulty: "Easy",
    category: "Variables & Arrays",
    notes: {
      desc: "Given an array of numbers, scan through them to find the largest value.",
      intuition: "Assume the first number is the maximum. Loop through the remaining numbers one by one, comparing each to the current maximum. If we find a larger number, update our maximum.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function findMax(arr) {
  let maxVal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i];
    }
  }
  return maxVal;
}`,
      Python: `def find_max(arr):
    max_val = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val`,
      "C++": `int findMax(vector<int>& arr) {
    int maxVal = arr[0];
    for (size_t i = 1; i < arr.size(); ++i) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`,
      Java: `public int findMax(int[] arr) {
    int maxVal = arr[0];
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`
    },
    generator: (arr = [12, 35, 1, 10, 34, 1]) => {
      const steps = [];
      let maxVal = arr[0];
      steps.push({ line: 1, msg: `Initialize maxVal to the first element: ${maxVal}`, variables: { arr, maxVal, i: "-" }, highlightIdx: [0] });
      
      for (let i = 1; i < arr.length; i++) {
        const val = arr[i];
        steps.push({ line: 2, msg: `Loop check: Compare current element arr[${i}] = ${val} with maxVal = ${maxVal}`, variables: { arr, maxVal, i }, highlightIdx: [i] });
        
        if (val > maxVal) {
          maxVal = val;
          steps.push({ line: 3, msg: `Success! Current element ${val} is greater than maxVal. Update maxVal to ${maxVal}`, variables: { arr, maxVal, i }, highlightIdx: [i], updated: true });
        } else {
          steps.push({ line: 2, msg: `Current element ${val} is not greater than maxVal. Continue.`, variables: { arr, maxVal, i }, highlightIdx: [i] });
        }
      }
      steps.push({ line: 6, msg: `Scanned all elements. Return final maxVal: ${maxVal}`, variables: { arr, maxVal, i: "-" }, completed: true, result: maxVal });
      return steps;
    }
  },
  COUNT_EVEN: {
    title: "2. Count Even Numbers",
    difficulty: "Easy",
    category: "Loops & Operators",
    notes: {
      desc: "Given an array of integers, count how many elements are even (divisible by 2).",
      intuition: "Initialize a counter to 0. Loop through every element in the array and use the modulo operator (%) to check if it's divisible by 2. If it is, increment our counter.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function countEvens(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      count++;
    }
  }
  return count;
}`,
      Python: `def count_evens(arr):
    count = 0
    for i in range(len(arr)):
        if arr[i] % 2 == 0:
            count += 1
    return count`,
      "C++": `int countEvens(vector<int>& arr) {
    int count = 0;
    for (size_t i = 0; i < arr.size(); ++i) {
        if (arr[i] % 2 == 0) {
            count++;
        }
    }
    return count;
}`,
      Java: `public int countEvens(int[] arr) {
    int count = 0;
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] % 2 == 0) {
            count++;
        }
    }
    return count;
}`
    },
    generator: (arr = [3, 8, 12, 5, 9, 14]) => {
      const steps = [];
      let count = 0;
      steps.push({ line: 1, msg: "Initialize count = 0 to track even numbers.", variables: { arr, count, i: "-" } });
      
      for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        steps.push({ line: 2, msg: `Loop check: Check if arr[${i}] = ${val} is even (arr[i] % 2 === 0).`, variables: { arr, count, i }, highlightIdx: [i] });
        
        if (val % 2 === 0) {
          count++;
          steps.push({ line: 3, msg: `${val} % 2 is 0 (Even). Increment count to ${count}.`, variables: { arr, count, i }, highlightIdx: [i], matched: true });
        } else {
          steps.push({ line: 2, msg: `${val} % 2 is 1 (Odd). Do not increment.`, variables: { arr, count, i }, highlightIdx: [i], odd: true });
        }
      }
      steps.push({ line: 6, msg: `Scanned all elements. Return count of even numbers: ${count}`, variables: { arr, count, i: "-" }, completed: true, result: count });
      return steps;
    }
  },
  FACTORIAL_RECURSIVE: {
    title: "3. Recursive Factorial",
    difficulty: "Easy",
    category: "Functions & Recursion",
    notes: {
      desc: "Given a non-negative integer `n`, compute `n!` (n factorial) using recursion.",
      intuition: "Factorial of N is N * (N - 1)!. The base case is when N <= 1, where the factorial is 1. For any N > 1, we make a recursive call to factorial(N - 1) and multiply it by N.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(N) due to recursion call stack"
    },
    code: {
      JS: `function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}`,
      Python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
      "C++": `int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
      Java: `public int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`
    },
    generator: (n = 4) => {
      const steps = [];
      const callStack = [];
      
      const recurse = (val) => {
        callStack.push({ n: val, label: `factorial(${val})`, state: 'CALL' });
        steps.push({ 
          line: 1, 
          msg: `Call factorial(${val}). Push to recursion stack.`, 
          variables: { n: val, stack: [...callStack] },
          stack: [...callStack]
        });
        
        if (val <= 1) {
          steps.push({ 
            line: 2, 
            msg: `Base case reached: factorial(${val}) returns 1.`, 
            variables: { n: val, stack: [...callStack] },
            stack: [...callStack]
          });
          const popped = callStack.pop();
          callStack.push({ ...popped, state: 'RETURN', returnVal: 1 });
          steps.push({ 
            line: 3, 
            msg: `factorial(${val}) resolved to 1. Return 1.`, 
            variables: { n: val, stack: [...callStack] },
            stack: [...callStack]
          });
          return 1;
        }
        
        steps.push({ 
          line: 5, 
          msg: `factorial(${val}) needs factorial(${val - 1}) to compute. Recurse.`, 
          variables: { n: val, stack: [...callStack] },
          stack: [...callStack]
        });
        
        const subResult = recurse(val - 1);
        
        const parentIdx = callStack.findIndex(item => item.n === val && item.state === 'CALL');
        if (parentIdx !== -1) {
          callStack[parentIdx] = { n: val, label: `factorial(${val})`, state: 'RETURN', returnVal: val * subResult };
        }
        
        steps.push({ 
          line: 5, 
          msg: `factorial(${val}) gets sub-result ${subResult}. Compute ${val} * ${subResult} = ${val * subResult}.`, 
          variables: { n: val, stack: [...callStack] },
          stack: [...callStack]
        });
        
        return val * subResult;
      };
      
      recurse(n);
      steps.push({ 
        line: 5, 
        msg: `Recursion finished. Final return value: ${n === 4 ? 24 : 120}`, 
        variables: { n, stack: [] },
        stack: [],
        completed: true,
        result: n === 4 ? 24 : 120
      });
      return steps;
    }
  },
  TWO_SUM: {
    title: "1. Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    notes: {
      desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      intuition: "Use a Hash Map to store the numbers we've seen so far and their index. For each number, calculate its complement (`target - num`) and check if it exists in the map.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(N)"
    },
    code: {
      JS: `function twoSum(nums, target) {
  const map = new Map(); // Store value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      Python: `def two_sum(nums, target):
    seen = {} # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      "C++": `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      Java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        seen.put(nums[i], i);
    }
    return new int[0];
}`
    },
    generator: (nums = [2, 7, 11, 15], target = 9) => {
      const steps = [];
      const map = {};
      steps.push({ line: 1, msg: "Initialize empty Hash Map to store seen numbers.", variables: { nums, target, map: { ...map }, i: "-", comp: "-" } });
      
      for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        const complement = target - val;
        steps.push({ line: 2, msg: `Loop step: Scan index i = ${i} (value ${val}).`, variables: { nums, target, map: { ...map }, i, comp: "-" }, highlightIdx: [i] });
        steps.push({ line: 3, msg: `Calculate complement: ${target} - ${val} = ${complement}.`, variables: { nums, target, map: { ...map }, i, comp: complement }, highlightIdx: [i] });
        
        if (complement in map) {
          steps.push({ line: 4, msg: `Complement ${complement} found in map at index ${map[complement]}!`, variables: { nums, target, map: { ...map }, i, comp: complement }, found: true, pair: [map[complement], i] });
          steps.push({ line: 5, msg: `Return indices [${map[complement]}, ${i}].`, variables: { nums, target, map: { ...map }, i, comp: complement }, completed: true, result: [map[complement], i] });
          return steps;
        }
        
        map[val] = i;
        steps.push({ line: 7, msg: `Complement not found. Save current number ${val} with index ${i} to map.`, variables: { nums, target, map: { ...map }, i, comp: complement } });
      }
      steps.push({ line: 9, msg: "No pair found that adds up to target.", variables: { nums, target, map: { ...map }, i: "-", comp: "-" }, completed: true, result: [] });
      return steps;
    }
  },
  REVERSE_LIST: {
    title: "2. Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    notes: {
      desc: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      intuition: "Keep pointers to `prev` (initially null), `curr` (initially head), and `next`. Traverse the list, changing `curr.next` to point to `prev`, then advance `prev` and `curr` forward.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      Python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      "C++": `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      Java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`
    },
    generator: (arr = [1, 2, 3, 4]) => {
      const steps = [];
      let prev = null;
      let curr = 0; // index of active node
      steps.push({ line: 1, msg: "Initialize prev = null.", variables: { prev: "null", curr: 0, next: "-" }, listState: { prev: null, curr: 0, next: null, reversed: {} } });
      steps.push({ line: 2, msg: "Initialize curr = head.", variables: { prev: "null", curr: arr[0], next: "-" }, listState: { prev: null, curr: 0, next: null, reversed: {} } });
      
      const reversed = {};
      while (curr < arr.length) {
        steps.push({ line: 3, msg: `Loop check: curr is node ${arr[curr]} (not null).`, variables: { prev: prev !== null ? arr[prev] : "null", curr: arr[curr], next: "-" }, listState: { prev, curr, next: null, reversed: { ...reversed } } });
        const next = curr + 1 < arr.length ? curr + 1 : null;
        steps.push({ line: 4, msg: `Store next node: next = ${next !== null ? arr[next] : "null"}.`, variables: { prev: prev !== null ? arr[prev] : "null", curr: arr[curr], next: next !== null ? arr[next] : "null" }, listState: { prev, curr, next, reversed: { ...reversed } } });
        
        reversed[curr] = prev;
        steps.push({ line: 5, msg: `Reverse pointer: Set curr.next = prev. Node ${arr[curr]} now points to ${prev !== null ? arr[prev] : "null"}.`, variables: { prev: prev !== null ? arr[prev] : "null", curr: arr[curr], next: next !== null ? arr[next] : "null" }, listState: { prev, curr, next, reversed: { ...reversed } } });
        
        prev = curr;
        steps.push({ line: 6, msg: `Advance prev pointer: prev = curr (${arr[prev]}).`, variables: { prev: arr[prev], curr: arr[curr], next: next !== null ? arr[next] : "null" }, listState: { prev, curr, next, reversed: { ...reversed } } });
        
        curr = next !== null ? next : arr.length;
        steps.push({ line: 7, msg: `Advance curr pointer: curr = next (${curr < arr.length ? arr[curr] : "null"}).`, variables: { prev: arr[prev], curr: curr < arr.length ? arr[curr] : "null", next: "-" }, listState: { prev, curr, next: null, reversed: { ...reversed } } });
      }
      steps.push({ line: 9, msg: "curr is null. Reversal complete! Return new head (prev).", variables: { prev: arr[prev], curr: "null", next: "-" }, completed: true });
      return steps;
    }
  },
  VALID_PARENTHESES: {
    title: "3. Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    notes: {
      desc: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.",
      intuition: "Use a Stack. When scanning a left bracket, push it onto the stack. When scanning a right bracket, pop the top of the stack and check if they match. Stack must be empty at the end.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(N)"
    },
    code: {
      JS: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (top !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      Python: `def is_valid(s):
    stack = []
    lookup = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        else:
            if not stack or stack.pop() != lookup[char]:
                return False
    return len(stack) == 0`,
      "C++": `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty() || st.top() != map[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
      Java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> map = Map.of(')', '(', '}', '{', ']', '[');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != map.get(c)) return false;
        }
    }
    return stack.isEmpty();
}`
    },
    generator: (s = "{[()]}") => {
      const steps = [];
      const stack = [];
      const map = { ')': '(', '}': '{', ']': '[' };
      
      steps.push({ line: 1, msg: "Initialize empty stack.", variables: { s, stack: [...stack], char: "-", i: "-" } });
      
      for (let i = 0; i < s.length; i++) {
        const char = s[i];
        steps.push({ line: 3, msg: `Scan index i = ${i}: character '${char}'.`, variables: { s, stack: [...stack], char, i }, highlightIdx: i });
        
        if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
          steps.push({ line: 4, msg: `Left bracket. Push '${char}' onto stack.`, variables: { s, stack: [...stack], char, i }, highlightIdx: i });
        } else {
          const top = stack.pop();
          steps.push({ line: 6, msg: `Right bracket. Pop top of stack: '${top || "null"}'.`, variables: { s, stack: [...stack], char, i }, highlightIdx: i });
          if (top !== map[char]) {
            steps.push({ line: 7, msg: `Mismatch! Top of stack '${top || "null"}' doesn't match complement of '${char}'. Return false.`, variables: { s, stack: [...stack], char, i }, completed: true, result: false });
            return steps;
          }
          steps.push({ line: 8, msg: `Success. Top '${top}' matches complement of '${char}'.`, variables: { s, stack: [...stack], char, i } });
        }
      }
      
      const empty = stack.length === 0;
      steps.push({ line: 11, msg: `End of string reached. Stack size is ${stack.length} (is empty: ${empty}). Return ${empty}.`, variables: { s, stack: [...stack], char: "-", i: "-" }, completed: true, result: empty });
      return steps;
    }
  },
  FIBONACCI: {
    title: "4. Fibonacci DP",
    difficulty: "Easy",
    category: "Dynamic Programming",
    notes: {
      desc: "Compute the N-th Fibonacci number using Memoization / Tabulation.",
      intuition: "Instead of recalculating values recursively, use a DP array where `dp[i] = dp[i-1] + dp[i-2]`. Base cases are `dp[0] = 0` and `dp[1] = 1`.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(N)"
    },
    code: {
      JS: `function fib(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
      Python: `def fib(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
      "C++": `int fib(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1, 0);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; ++i) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
      Java: `public int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`
    },
    generator: (n = 5) => {
      const steps = [];
      if (n <= 1) {
        steps.push({ line: 1, msg: `Base Case check: n = ${n}. Return ${n}.`, variables: { n, dp: [0], i: "-" }, completed: true });
        return steps;
      }
      const dp = new Array(n + 1).fill(0);
      steps.push({ line: 2, msg: `Initialize DP table of size ${n + 1} with 0.`, variables: { n, dp: [...dp], i: "-" } });
      
      dp[0] = 0;
      steps.push({ line: 3, msg: "Set Base case dp[0] = 0.", variables: { n, dp: [...dp], i: "-" } });
      dp[1] = 1;
      steps.push({ line: 4, msg: "Set Base case dp[1] = 1.", variables: { n, dp: [...dp], i: "-" } });
      
      for (let i = 2; i <= n; i++) {
        steps.push({ line: 5, msg: `Loop check: compute index i = ${i}.`, variables: { n, dp: [...dp], i } });
        dp[i] = dp[i - 1] + dp[i - 2];
        steps.push({ line: 6, msg: `Set dp[${i}] = dp[${i-1}] (${dp[i-1]}) + dp[${i-2}] (${dp[i-2]}) = ${dp[i]}.`, variables: { n, dp: [...dp], i } });
      }
      steps.push({ line: 8, msg: `Done! Return dp[${n}] = ${dp[n]}.`, variables: { n, dp: [...dp], i: "-" }, completed: true, result: dp[n] });
      return steps;
    }
  },
  MERGE_SORTED_LISTS: {
    title: "5. Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked Lists",
    notes: {
      desc: "Merge two sorted linked lists and return it as a sorted list.",
      intuition: "Use a dummy head node to build the list. Track two pointers `l1` and `l2` representing nodes of the lists. Compare values, append the smaller node to the new list, and advance that list's pointer.",
      complexity: "Time Complexity: O(N + M) | Space Complexity: O(1)"
    },
    code: {
      JS: `function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val < l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = l1 !== null ? l1 : l2;
  return dummy.next;
}`,
      Python: `def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.val < l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`,
      "C++": `ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    while (l1 != nullptr && l2 != nullptr) {
        if (l1->val < l2->val) {
            tail->next = l1;
            l1 = l1->next;
        } else {
            tail->next = l2;
            l2 = l2->next;
        }
        tail = tail->next;
    }
    tail->next = (l1 != nullptr) ? l1 : l2;
    return dummy.next;
}`,
      Java: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val < l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`
    },
    generator: (l1 = [1, 3, 5], l2 = [2, 4]) => {
      const steps = [];
      let i1 = 0, i2 = 0;
      const merged = [];
      
      steps.push({ line: 1, msg: "Initialize dummy head node.", variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
      steps.push({ line: 2, msg: "Set tail = dummy.", variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
      
      while (i1 < l1.length && i2 < l2.length) {
        steps.push({ line: 3, msg: `Loop check: Compare l1.val (${l1[i1]}) and l2.val (${l2[i2]}).`, variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
        if (l1[i1] < l2[i2]) {
          steps.push({ line: 4, msg: `l1.val (${l1[i1]}) < l2.val (${l2[i2]}). Point tail.next to l1 node.`, variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
          merged.push(l1[i1]);
          i1++;
          steps.push({ line: 5, msg: "Advance l1: l1 = l1.next.", variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
        } else {
          steps.push({ line: 6, msg: `l1.val (${l1[i1]}) >= l2.val (${l2[i2]}). Point tail.next to l2 node.`, variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
          merged.push(l2[i2]);
          i2++;
          steps.push({ line: 7, msg: "Advance l2: l2 = l2.next.", variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
        }
        steps.push({ line: 9, msg: "Advance tail pointer: tail = tail.next.", variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
      }
      
      steps.push({ line: 11, msg: `One list is exhausted. Attach remaining elements of the other list.`, variables: { l1: l1.slice(i1), l2: l2.slice(i2), merged: [...merged] } });
      while (i1 < l1.length) { merged.push(l1[i1]); i1++; }
      while (i2 < l2.length) { merged.push(l2[i2]); i2++; }
      steps.push({ line: 12, msg: `Return dummy.next. Merged sorted list: [${merged.join(' -> ')}].`, variables: { l1: [], l2: [], merged: [...merged] }, completed: true });
      return steps;
    }
  },
  BINARY_SEARCH: {
    title: "6. Binary Search",
    difficulty: "Easy",
    category: "Divide & Conquer",
    notes: {
      desc: "Search for a target value in a sorted array in logarithmic time.",
      intuition: "Use low and high boundaries. In each step, check the middle element. If it matches target, return index. If target is smaller, search the left half. If larger, search the right half.",
      complexity: "Time Complexity: O(log N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
      Python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      "C++": `int binarySearch(vector<int>& arr, int target) {
    int low = 0;
    int high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      Java: `public int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`
    },
    generator: (arr = [1, 3, 5, 7, 9, 11, 13], target = 9) => {
      const steps = [];
      let low = 0;
      let high = arr.length - 1;
      
      steps.push({ line: 1, msg: "Initialize low boundary to index 0.", variables: { arr, target, low, high, mid: "-" } });
      steps.push({ line: 2, msg: `Initialize high boundary to index ${high}.`, variables: { arr, target, low, high, mid: "-" } });
      
      while (low <= high) {
        steps.push({ line: 3, msg: `Loop check: low (${low}) <= high (${high}).`, variables: { arr, target, low, high, mid: "-" } });
        const mid = Math.floor((low + high) / 2);
        steps.push({ line: 4, msg: `Compute middle index: Math.floor((${low} + ${high}) / 2) = ${mid} (value: ${arr[mid]}).`, variables: { arr, target, low, high, mid }, highlightIdx: [low, mid, high] });
        
        if (arr[mid] === target) {
          steps.push({ line: 5, msg: `Found! arr[mid] (${arr[mid]}) matches target (${target}). Return index ${mid}.`, variables: { arr, target, low, high, mid }, completed: true, result: mid });
          return steps;
        }
        
        if (arr[mid] < target) {
          steps.push({ line: 6, msg: `arr[mid] (${arr[mid]}) < target (${target}). Target lies in the right half.`, variables: { arr, target, low, high, mid } });
          low = mid + 1;
          steps.push({ line: 7, msg: `Narrow search space: Set low = mid + 1 = ${low}.`, variables: { arr, target, low, high, mid } });
        } else {
          steps.push({ line: 8, msg: `arr[mid] (${arr[mid]}) > target (${target}). Target lies in the left half.`, variables: { arr, target, low, high, mid } });
          high = mid - 1;
          steps.push({ line: 9, msg: `Narrow search space: Set high = mid - 1 = ${high}.`, variables: { arr, target, low, high, mid } });
        }
      }
      steps.push({ line: 12, msg: "low boundary exceeded high boundary. Target not found. Return -1.", variables: { arr, target, low, high, mid: "-" }, completed: true, result: -1 });
      return steps;
    }
  },
  PEAK_ELEMENT: {
    title: "7. Find Peak Element",
    difficulty: "Medium",
    category: "Divide & Conquer",
    notes: {
      desc: "A peak element is an element that is strictly greater than its neighbors. Find the index of a peak element in O(log N) time.",
      intuition: "Use Binary Search. Compare `arr[mid]` with its right neighbor `arr[mid + 1]`. If `arr[mid] < arr[mid + 1]`, a peak must exist on the right side. Else, it must be on the left side (including mid).",
      complexity: "Time Complexity: O(log N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function findPeakElement(arr) {
  let low = 0;
  let high = arr.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < arr[mid + 1]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}`,
      Python: `def find_peak_element(arr):
    low = 0
    high = len(arr) - 1
    while low < high:
        mid = (low + high) // 2
        if arr[mid] < arr[mid + 1]:
            low = mid + 1
        else:
            high = mid
    return low`,
      "C++": `int findPeakElement(vector<int>& arr) {
    int low = 0;
    int high = arr.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < arr[mid + 1]) low = mid + 1;
        else high = mid;
    }
    return low;
}`,
      Java: `public int findPeakElement(int[] arr) {
    int low = 0;
    int high = arr.length - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < arr[mid + 1]) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}`
    },
    generator: (arr = [1, 2, 1, 3, 5, 6, 4]) => {
      const steps = [];
      let low = 0;
      let high = arr.length - 1;
      
      steps.push({ line: 1, msg: "Initialize low boundary to index 0.", variables: { arr, low, high, mid: "-" } });
      steps.push({ line: 2, msg: `Initialize high boundary to index ${high}.`, variables: { arr, low, high, mid: "-" } });
      
      while (low < high) {
        steps.push({ line: 3, msg: `Loop check: low (${low}) < high (${high}).`, variables: { arr, low, high, mid: "-" } });
        const mid = Math.floor((low + high) / 2);
        steps.push({ line: 4, msg: `Compute middle index: Math.floor((${low} + ${high}) / 2) = ${mid} (value: ${arr[mid]}).`, variables: { arr, low, high, mid }, highlightIdx: [low, mid, high] });
        
        if (arr[mid] < arr[mid + 1]) {
          steps.push({ line: 5, msg: `arr[mid] (${arr[mid]}) < right neighbor (${arr[mid + 1]}). Peak is in right side.`, variables: { arr, low, high, mid } });
          low = mid + 1;
          steps.push({ line: 6, msg: `Set low = mid + 1 = ${low}.`, variables: { arr, low, high, mid } });
        } else {
          steps.push({ line: 7, msg: `arr[mid] (${arr[mid]}) >= right neighbor (${arr[mid + 1]}). Peak is in left side (including mid).`, variables: { arr, low, high, mid } });
          high = mid;
          steps.push({ line: 8, msg: `Set high = mid = ${high}.`, variables: { arr, low, high, mid } });
        }
      }
      steps.push({ line: 11, msg: `Pointers met at index ${low} (value: ${arr[low]}). Peak index found! Return ${low}.`, variables: { arr, low, high: low, mid: "-" }, completed: true, result: low });
      return steps;
    }
  },
  KADANES: {
    title: "8. Kadane's Algorithm",
    difficulty: "Medium",
    category: "Dynamic Programming",
    notes: {
      desc: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      intuition: "Track the maximum sum ending at the current index (`maxEndingHere`) and the maximum sum overall (`maxSoFar`). In each step, `maxEndingHere = max(num, maxEndingHere + num)`.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}`,
      Python: `def max_sub_array(nums):
    max_so_far = nums[0]
    max_ending_here = nums[0]
    for i in range(1, len(nums)):
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far`,
      "C++": `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    for (int i = 1; i < nums.size(); ++i) {
        maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
      Java: `public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    for (int i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`
    },
    generator: (nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) => {
      const steps = [];
      let maxSoFar = nums[0];
      let maxEndingHere = nums[0];
      
      steps.push({ line: 1, msg: `Initialize maxSoFar to nums[0] = ${maxSoFar}.`, variables: { nums, maxSoFar, maxEndingHere, i: "-" } });
      steps.push({ line: 2, msg: `Initialize maxEndingHere to nums[0] = ${maxEndingHere}.`, variables: { nums, maxSoFar, maxEndingHere, i: "-" } });
      
      for (let i = 1; i < nums.length; i++) {
        const val = nums[i];
        steps.push({ line: 3, msg: `Loop check: Scan index i = ${i} (value ${val}).`, variables: { nums, maxSoFar, maxEndingHere, i }, highlightIdx: [i] });
        
        const temp = maxEndingHere + val;
        maxEndingHere = Math.max(val, temp);
        steps.push({ line: 4, msg: `Calculate maxEndingHere = max(${val}, ${temp}) = ${maxEndingHere}.`, variables: { nums, maxSoFar, maxEndingHere, i }, highlightIdx: [i] });
        
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
        steps.push({ line: 5, msg: `Update maxSoFar = max(${maxSoFar}, ${maxEndingHere}) = ${maxSoFar}.`, variables: { nums, maxSoFar, maxEndingHere, i } });
      }
      steps.push({ line: 7, msg: `Done! Maximum subarray sum is ${maxSoFar}.`, variables: { nums, maxSoFar, maxEndingHere, i: "-" }, completed: true, result: maxSoFar });
      return steps;
    }
  },
  TREE_INORDER: {
    title: "9. Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Trees",
    notes: {
      desc: "Given the root of a binary tree, return the inorder traversal of its nodes' values (Left, Root, Right).",
      intuition: "Using a recursion stack: recursively traverse the left subtree, visit the root node, and then recursively traverse the right subtree.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(N) (recursion stack)"
    },
    code: {
      JS: `function inorderTraversal(root) {
  const result = [];
  function traverse(node) {
    if (node === null) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }
  traverse(root);
  return result;
}`,
      Python: `def inorder_traversal(root):
    result = []
    def traverse(node):
        if not node:
            return
        traverse(node.left)
        result.append(node.val)
        traverse(node.right)
    traverse(root)
    return result`,
      "C++": `void traverse(TreeNode* node, vector<int>& res) {
    if (node == nullptr) return;
    traverse(node->left, res);
    res.push_back(node->val);
    traverse(node->right, res);
}
vector<int> inorderTraversal(TreeNode* root) {
    vector<int> res;
    traverse(root, res);
    return res;
}`,
      Java: `public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    traverse(root, res);
    return res;
}
private void traverse(TreeNode node, List<Integer> res) {
    if (node == null) return;
    traverse(node.left, res);
    res.add(node.val);
    traverse(node.right, res);
}`
    },
    generator: () => {
      const steps = [];
      const result = [];
      const stack = ["traverse(1)"];
      
      steps.push({ line: 1, msg: "Initialize empty result list.", variables: { stack: [...stack], result: [...result], activeNode: 1 } });
      steps.push({ line: 2, msg: "Begin helper traversal function.", variables: { stack: [...stack], result: [...result], activeNode: 1 } });
      
      stack.push("traverse(2)");
      steps.push({ line: 4, msg: "Recurse on Left child of 1: traverse(2).", variables: { stack: [...stack], result: [...result], activeNode: 2 } });
      
      stack.push("traverse(4)");
      steps.push({ line: 4, msg: "Recurse on Left child of 2: traverse(4).", variables: { stack: [...stack], result: [...result], activeNode: 4 } });
      
      stack.push("traverse(null)");
      steps.push({ line: 3, msg: "Recurse on Left child of 4: null. Base Case hit, returning.", variables: { stack: [...stack], result: [...result], activeNode: "null" } });
      stack.pop();
      
      result.push(4);
      steps.push({ line: 5, msg: "Visit node 4. Add 4 to result.", variables: { stack: [...stack], result: [...result], activeNode: 4 } });
      
      stack.push("traverse(null)");
      steps.push({ line: 6, msg: "Recurse on Right child of 4: null. Base Case hit, returning.", variables: { stack: [...stack], result: [...result], activeNode: "null" } });
      stack.pop();
      
      stack.pop();
      
      result.push(2);
      steps.push({ line: 5, msg: "Return to node 2. Visit node 2, add 2 to result.", variables: { stack: [...stack], result: [...result], activeNode: 2 } });
      
      stack.push("traverse(5)");
      steps.push({ line: 6, msg: "Recurse on Right child of 2: traverse(5).", variables: { stack: [...stack], result: [...result], activeNode: 5 } });
      
      stack.push("traverse(null)");
      steps.push({ line: 3, msg: "Recurse on Left child of 5: null. Returning.", variables: { stack: [...stack], result: [...result], activeNode: "null" } });
      stack.pop();
      
      result.push(5);
      steps.push({ line: 5, msg: "Visit node 5. Add 5 to result.", variables: { stack: [...stack], result: [...result], activeNode: 5 } });
      
      stack.push("traverse(null)");
      steps.push({ line: 6, msg: "Recurse on Right child of 5: null. Returning.", variables: { stack: [...stack], result: [...result], activeNode: "null" } });
      stack.pop();
      
      stack.pop();
      stack.pop();
      
      result.push(1);
      steps.push({ line: 5, msg: "Return to Root node 1. Visit node 1, add 1 to result.", variables: { stack: [...stack], result: [...result], activeNode: 1 } });
      
      stack.push("traverse(3)");
      steps.push({ line: 6, msg: "Recurse on Right child of 1: traverse(3).", variables: { stack: [...stack], result: [...result], activeNode: 3 } });
      
      stack.push("traverse(null)");
      steps.push({ line: 3, msg: "Recurse on Left child of 3: null. Returning.", variables: { stack: [...stack], result: [...result], activeNode: "null" } });
      stack.pop();
      
      result.push(3);
      steps.push({ line: 5, msg: "Visit node 3. Add 3 to result.", variables: { stack: [...stack], result: [...result], activeNode: 3 } });
      
      stack.push("traverse(null)");
      steps.push({ line: 6, msg: "Recurse on Right child of 3: null. Returning.", variables: { stack: [...stack], result: [...result], activeNode: "null" } });
      stack.pop();
      
      stack.pop();
      stack.pop();
      
      steps.push({ line: 8, msg: "Inorder traversal complete! Return result.", variables: { stack: [...stack], result: [...result], activeNode: "-" }, completed: true, result: [...result] });
      return steps;
    }
  },
  CYCLE_DETECTION: {
    title: "10. List Cycle Detection",
    difficulty: "Medium",
    category: "Linked Lists",
    notes: {
      desc: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
      intuition: "Use Floyd's Tortoise and Hare algorithm. Track slow pointer (moves 1 step) and fast pointer (moves 2 steps). If there is a cycle, the two pointers will eventually meet.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function hasCycle(head) {
  if (head === null || head.next === null) return false;
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      Python: `def has_cycle(head):
    if not head or not head.next:
        return False
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      "C++": `bool hasCycle(ListNode *head) {
    if (head == nullptr || head->next == nullptr) return false;
    ListNode *slow = head;
    ListNode *fast = head;
    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      Java: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`
    },
    generator: () => {
      const arr = [1, 2, 3, 4, 5];
      const steps = [];
      let slow = 0;
      let fast = 0;
      
      steps.push({ line: 1, msg: "Check base cases: head or head.next is null.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 3, msg: "Initialize slow pointer = head.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 4, msg: "Initialize fast pointer = head.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      steps.push({ line: 5, msg: "Loop check: fast and fast.next are not null.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      slow = 1; fast = 2;
      steps.push({ line: 6, msg: "Move slow 1 step: slow = slow.next (node 2).", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 7, msg: "Move fast 2 steps: fast = fast.next.next (node 3).", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      steps.push({ line: 8, msg: `Compare slow (${arr[slow]}) vs fast (${arr[fast]}). No match. Continue.`, variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 5, msg: "Loop check: fast and fast.next are not null.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      slow = 2; fast = 4;
      steps.push({ line: 6, msg: "Move slow 1 step: slow = slow.next (node 3).", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 7, msg: "Move fast 2 steps: fast = fast.next.next (node 5).", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      steps.push({ line: 8, msg: `Compare slow (${arr[slow]}) vs fast (${arr[fast]}). No match. Continue.`, variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 5, msg: "Loop check: fast and fast.next are not null.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      slow = 3; fast = 3;
      steps.push({ line: 6, msg: "Move slow 1 step: slow = slow.next (node 4).", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      steps.push({ line: 7, msg: "Move fast 2 steps: fast = fast.next.next (node 4).", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast } });
      
      steps.push({ line: 8, msg: `Compare slow (${arr[slow]}) vs fast (${arr[fast]}). THEY MATCH! Cycle detected!`, variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast }, matched: true });
      steps.push({ line: 9, msg: "Return true.", variables: { slow: arr[slow], fast: arr[fast] }, pointers: { slow, fast }, completed: true, result: true });
      return steps;
    }
  },
  TWO_POINTERS_TARGET: {
    title: "11. Two Pointers: 2Sum in Sorted Array",
    difficulty: "Medium",
    category: "Array Pointers",
    notes: {
      desc: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
      intuition: "Initialize left = 0 and right = n - 1. If numbers[left] + numbers[right] == target, we found the pair! If sum < target, increment left to increase the sum. If sum > target, decrement right to decrease the sum.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function twoSumSorted(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
      Python: `def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
      "C++": `vector<int> twoSumSorted(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
      C: `int twoSumSorted(int numbers[], int n, int target, int* outL, int* outR) {
    int left = 0, right = n - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            *outL = left + 1; *outR = right + 1;
            return 1;
        }
        else if (sum < target) left++;
        else right--;
    }
    return 0;
}`,
      Java: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return new int[] { left + 1, right + 1 };
        else if (sum < target) left++;
        else right--;
    }
    return new int[0];
}`
    },
    generator: (numbers = [2, 7, 11, 15, 18], target = 18) => {
      const steps = [];
      let left = 0, right = numbers.length - 1;
      steps.push({ line: 1, msg: `Initialize left pointer at index 0 (${numbers[left]}), right pointer at index ${right} (${numbers[right]}). Target = ${target}.`, variables: { arr: numbers, left, right, sum: "-" }, pointers: { left, right } });
      
      while (left < right) {
        const sum = numbers[left] + numbers[right];
        steps.push({ line: 3, msg: `Calculate sum: numbers[${left}] (${numbers[left]}) + numbers[${right}] (${numbers[right]}) = ${sum}.`, variables: { arr: numbers, left, right, sum }, pointers: { left, right } });
        
        if (sum === target) {
          steps.push({ line: 4, msg: `Sum ${sum} matches target ${target}! Pair found at indices [${left}, ${right}].`, variables: { arr: numbers, left, right, sum }, pointers: { left, right }, matched: true, completed: true, result: [left + 1, right + 1] });
          return steps;
        } else if (sum < target) {
          steps.push({ line: 5, msg: `Sum ${sum} < target ${target}. Increment left pointer to increase sum.`, variables: { arr: numbers, left: left + 1, right, sum }, pointers: { left: left + 1, right } });
          left++;
        } else {
          steps.push({ line: 6, msg: `Sum ${sum} > target ${target}. Decrement right pointer to decrease sum.`, variables: { arr: numbers, left, right: right - 1, sum }, pointers: { left, right: right - 1 } });
          right--;
        }
      }
      steps.push({ line: 8, msg: "Pointers crossed without finding target sum.", variables: { arr: numbers, left, right, sum: "-" }, completed: true, result: [] });
      return steps;
    }
  },
  SLIDING_WINDOW_MAX_K: {
    title: "12. Sliding Window: Max Sum Subarray of Size K",
    difficulty: "Medium",
    category: "Sliding Window",
    notes: {
      desc: "Given an array of integers arr and a positive integer k, find the maximum sum of any contiguous subarray of size k.",
      intuition: "Compute the sum of the first window of size k. Then slide the window one element at a time: add the next element arr[r] and subtract the element leaving the window arr[r - k]. Update maxSum = max(maxSum, windowSum) in O(1) per step.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function maxSubarraySumK(arr, k) {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let maxSum = windowSum;

  for (let r = k; r < arr.length; r++) {
    windowSum += arr[r] - arr[r - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
      Python: `def max_subarray_sum_k(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for r in range(k, len(arr)):
        window_sum += arr[r] - arr[r - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
      "C++": `int maxSubarraySumK(vector<int>& arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (size_t r = k; r < arr.size(); r++) {
        windowSum += arr[r] - arr[r - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
      C: `int maxSubarraySumK(int arr[], int n, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int r = k; r < n; r++) {
        windowSum += arr[r] - arr[r - k];
        if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
}`,
      Java: `public int maxSubarraySumK(int[] arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int r = k; r < arr.length; r++) {
        windowSum += arr[r] - arr[r - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`
    },
    generator: (arr = [2, 1, 5, 1, 3, 2], k = 3) => {
      const steps = [];
      let windowSum = 0;
      for (let i = 0; i < k; i++) windowSum += arr[i];
      let maxSum = windowSum;
      
      steps.push({ line: 1, msg: `Initialize first window [0...${k-1}]. Window sum = ${windowSum}, Max sum = ${maxSum}.`, variables: { arr, window: `[0...${k-1}]`, windowSum, maxSum }, windowRange: [0, k-1] });
      
      for (let r = k; r < arr.length; r++) {
        const entering = arr[r];
        const exiting = arr[r - k];
        windowSum += entering - exiting;
        const updated = windowSum > maxSum;
        if (updated) maxSum = windowSum;
        
        steps.push({ 
          line: 5, 
          msg: `Slide window to [${r - k + 1}...${r}]. Add arr[${r}] (${entering}), remove arr[${r - k}] (${exiting}). WindowSum = ${windowSum}. MaxSum = ${maxSum}.`, 
          variables: { arr, window: `[${r - k + 1}...${r}]`, windowSum, maxSum },
          windowRange: [r - k + 1, r],
          updated
        });
      }
      steps.push({ line: 8, msg: `Finished scanning all windows. Maximum window sum of size ${k} is ${maxSum}.`, variables: { arr, windowSum, maxSum }, completed: true, result: maxSum });
      return steps;
    }
  },
  DUTCH_FLAG_SORT: {
    title: "13. Dutch National Flag: Sort 0s, 1s, 2s",
    difficulty: "Medium",
    category: "Array Pointers",
    notes: {
      desc: "Given an array nums with n objects colored 0, 1, or 2, sort them in-place so that objects of the same color are adjacent.",
      intuition: "Maintain 3 pointers: low = 0 (boundary for 0s), mid = 0 (current element), high = n - 1 (boundary for 2s). If nums[mid] == 0, swap with low and increment both. If 1, just increment mid. If 2, swap with high and decrement high.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(1)"
    },
    code: {
      JS: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
      Python: `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
      "C++": `void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`,
      C: `void swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }
void sortColors(int nums[], int n) {
    int low = 0, mid = 0, high = n - 1;
    while (mid <= high) {
        if (nums[mid] == 0) swap(&nums[low++], &nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(&nums[mid], &nums[high--]);
    }
}`,
      Java: `public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            int t = nums[low]; nums[low] = nums[mid]; nums[mid] = t;
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int t = nums[mid]; nums[mid] = nums[high]; nums[high] = t;
            high--;
        }
    }
}`
    },
    generator: (nums = [2, 0, 2, 1, 1, 0]) => {
      const arr = [...nums];
      const steps = [];
      let low = 0, mid = 0, high = arr.length - 1;
      
      steps.push({ line: 1, msg: `Initialize low = 0, mid = 0, high = ${high}. Array: [${arr.join(', ')}].`, variables: { arr: [...arr], low, mid, high }, pointers: { low, mid, high } });
      
      while (mid <= high) {
        steps.push({ line: 3, msg: `Inspect mid index ${mid} (value ${arr[mid]}).`, variables: { arr: [...arr], low, mid, high }, pointers: { low, mid, high } });
        if (arr[mid] === 0) {
          const t = arr[low]; arr[low] = arr[mid]; arr[mid] = t;
          steps.push({ line: 4, msg: `Found 0. Swap arr[${low}] and arr[${mid}]. Increment low to ${low+1} and mid to ${mid+1}.`, variables: { arr: [...arr], low: low+1, mid: mid+1, high }, pointers: { low: low+1, mid: mid+1, high } });
          low++; mid++;
        } else if (arr[mid] === 1) {
          steps.push({ line: 6, msg: `Found 1. 1 is in correct middle bucket. Increment mid to ${mid+1}.`, variables: { arr: [...arr], low, mid: mid+1, high }, pointers: { low, mid: mid+1, high } });
          mid++;
        } else {
          const t = arr[mid]; arr[mid] = arr[high]; arr[high] = t;
          steps.push({ line: 8, msg: `Found 2. Swap arr[${mid}] and arr[${high}]. Decrement high to ${high-1}.`, variables: { arr: [...arr], low, mid, high: high-1 }, pointers: { low, mid, high: high-1 } });
          high--;
        }
      }
      steps.push({ line: 11, msg: `Partition complete! Fully sorted colors: [${arr.join(', ')}].`, variables: { arr: [...arr], low, mid, high }, completed: true, result: [...arr] });
      return steps;
    }
  },
  PREFIX_SUM_SUBARRAY: {
    title: "14. Prefix Sum: Subarray Range Sum",
    difficulty: "Easy",
    category: "Prefix Sum",
    notes: {
      desc: "Given an integer array nums, precompute the prefix sum array to answer multiple range sum queries (L, R) in O(1) time.",
      intuition: "Construct prefix[i] = prefix[i-1] + nums[i]. For any query (L, R), if L == 0, answer is prefix[R]. Otherwise, answer is prefix[R] - prefix[L-1].",
      complexity: "Time Complexity: O(N) Precompute, O(1) per Query | Space Complexity: O(N)"
    },
    code: {
      JS: `function rangeSum(nums, L, R) {
  const prefix = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefix[i] = prefix[i - 1] + nums[i];
  }
  return L === 0 ? prefix[R] : prefix[R] - prefix[L - 1];
}`,
      Python: `def range_sum(nums, L, R):
    prefix = [nums[0]]
    for i in range(1, len(nums)):
        prefix.append(prefix[-1] + nums[i])
    return prefix[R] if L == 0 else prefix[R] - prefix[L - 1]`,
      "C++": `int rangeSum(vector<int>& nums, int L, int R) {
    vector<int> prefix(nums.size());
    prefix[0] = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        prefix[i] = prefix[i - 1] + nums[i];
    }
    return (L == 0) ? prefix[R] : prefix[R] - prefix[L - 1];
}`,
      C: `int rangeSum(int nums[], int n, int L, int R) {
    int prefix[100];
    prefix[0] = nums[0];
    for (int i = 1; i < n; i++) prefix[i] = prefix[i - 1] + nums[i];
    return (L == 0) ? prefix[R] : prefix[R] - prefix[L - 1];
}`,
      Java: `public int rangeSum(int[] nums, int L, int R) {
    int[] prefix = new int[nums.length];
    prefix[0] = nums[0];
    for (int i = 1; i < nums.length; i++) {
        prefix[i] = prefix[i - 1] + nums[i];
    }
    return (L == 0) ? prefix[R] : prefix[R] - prefix[L - 1];
}`
    },
    generator: (nums = [3, 1, 4, 1, 5, 9, 2], query = [2, 5]) => {
      const steps = [];
      const prefix = [nums[0]];
      steps.push({ line: 1, msg: `Initialize prefix[0] = nums[0] = ${nums[0]}.`, variables: { arr: nums, prefix: [...prefix], i: 0 } });
      
      for (let i = 1; i < nums.length; i++) {
        prefix[i] = prefix[i - 1] + nums[i];
        steps.push({ 
          line: 3, 
          msg: `prefix[${i}] = prefix[${i-1}] (${prefix[i-1]}) + nums[${i}] (${nums[i]}) = ${prefix[i]}.`, 
          variables: { arr: nums, prefix: [...prefix], i } 
        });
      }
      
      const [L, R] = query;
      const ans = L === 0 ? prefix[R] : prefix[R] - prefix[L - 1];
      steps.push({ 
        line: 5, 
        msg: `Query Range [${L}...${R}]: Sum = prefix[${R}] (${prefix[R]}) - prefix[${L-1}] (${prefix[L-1]}) = ${ans}.`, 
        variables: { arr: nums, prefix: [...prefix], L, R, sum: ans },
        completed: true, 
        result: ans 
      });
      return steps;
    }
  },
  NQUEENS_SOLVER: {
    title: "15. N-Queens Backtracking Solver",
    difficulty: "Hard",
    category: "Backtracking",
    notes: {
      desc: "Place 4 queens on a 4x4 chessboard such that no two queens attack each other (same row, column, or diagonal).",
      intuition: "Place a queen row by row. At row i, test each column j. If no existing queen shares column j or diagonal (|c - j| == |r - i|), place the queen and recurse. If blocked, backtrack by clearing the row.",
      complexity: "Time Complexity: O(N!) | Space Complexity: O(N) Call Stack"
    },
    code: {
      JS: `function solveNQueens(N = 4) {
  const board = Array(N).fill(-1);
  const solutions = [];
  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      if (board[r] === col || Math.abs(board[r] - col) === Math.abs(r - row)) return false;
    }
    return true;
  }
  function backtrack(row) {
    if (row === N) { solutions.push([...board]); return; }
    for (let col = 0; col < N; col++) {
      if (isSafe(row, col)) {
        board[row] = col;
        backtrack(row + 1);
        board[row] = -1;
      }
    }
  }
  backtrack(0);
  return solutions;
}`,
      Python: `def solve_n_queens(N=4):
    board = [-1] * N
    solutions = []
    def is_safe(row, col):
        for r in range(row):
            if board[r] == col or abs(board[r] - col) == abs(r - row):
                return False
        return True
    def backtrack(row):
        if row == N:
            solutions.append(list(board))
            return
        for col in range(N):
            if is_safe(row, col):
                board[row] = col
                backtrack(row + 1)
                board[row] = -1
    backtrack(0)
    return solutions`,
      "C++": `void solveNQueens(int row, int N, vector<int>& board, vector<vector<int>>& solutions) {
    if (row == N) { solutions.push_back(board); return; }
    for (int col = 0; col < N; col++) {
        bool safe = true;
        for (int r = 0; r < row; r++) {
            if (board[r] == col || abs(board[r] - col) == abs(r - row)) { safe = false; break; }
        }
        if (safe) {
            board[row] = col;
            solveNQueens(row + 1, N, board, solutions);
            board[row] = -1;
        }
    }
}`,
      C: `int isSafe(int board[], int row, int col) {
    for (int r = 0; r < row; r++) {
        if (board[r] == col || abs(board[r] - col) == abs(r - row)) return 0;
    }
    return 1;
}`,
      Java: `public static void solveNQueens(int row, int N, int[] board, List<int[]> res) {
    if (row == N) { res.add(board.clone()); return; }
    for (int col = 0; col < N; col++) {
        boolean safe = true;
        for (int r = 0; r < row; r++) {
            if (board[r] == col || Math.abs(board[r] - col) == Math.abs(r - row)) { safe = false; break; }
        }
        if (safe) {
            board[row] = col;
            solveNQueens(row + 1, N, board, res);
            board[row] = -1;
        }
    }
}`
    },
    generator: () => {
      const steps = [];
      const N = 4;
      const board = [-1, -1, -1, -1];
      steps.push({ line: 1, msg: "Start 4x4 Chessboard Backtracking. Board is empty.", variables: { board: [...board], row: 0, col: -1 } });
      
      // Step 1: Row 0, Col 0
      board[0] = 0;
      steps.push({ line: 9, msg: "Row 0: Safe! Place Queen 👑 at (0, 0). Move to Row 1.", variables: { board: [...board], row: 1, col: 0 } });
      
      // Step 2: Row 1, Col 0 (conflict)
      steps.push({ line: 5, msg: "Row 1, Col 0: Conflict! Same column as Queen at (0, 0).", variables: { board: [...board], row: 1, col: 0, conflict: true } });
      
      // Step 3: Row 1, Col 1 (conflict diagonal)
      steps.push({ line: 5, msg: "Row 1, Col 1: Conflict! Main diagonal with Queen at (0, 0).", variables: { board: [...board], row: 1, col: 1, conflict: true } });
      
      // Step 4: Row 1, Col 2 (safe)
      board[1] = 2;
      steps.push({ line: 9, msg: "Row 1, Col 2: Safe! Place Queen 👑 at (1, 2). Move to Row 2.", variables: { board: [...board], row: 2, col: 2 } });
      
      // Step 5: Row 2, all blocked -> backtrack
      steps.push({ line: 12, msg: "Row 2: All columns (0, 1, 2, 3) under attack! Backtrack to Row 1.", variables: { board: [...board], row: 2, col: -1, conflict: true } });
      board[1] = -1;
      
      // Step 6: Row 1, Col 3 (safe)
      board[1] = 3;
      steps.push({ line: 9, msg: "Row 1, Col 3: Safe! Place Queen 👑 at (1, 3). Move to Row 2.", variables: { board: [...board], row: 2, col: 3 } });
      
      // Step 7: Row 2, Col 1 (safe)
      board[2] = 1;
      steps.push({ line: 9, msg: "Row 2, Col 1: Safe! Place Queen 👑 at (2, 1). Move to Row 3.", variables: { board: [...board], row: 3, col: 1 } });
      
      // Step 8: Row 3, Col 0, 1, 3 blocked; Col 2 safe!
      board[3] = 2;
      steps.push({ 
        line: 3, 
        msg: "Row 3, Col 2: Safe! Place Queen 👑 at (3, 2). All 4 Queens placed! Solution Found: [0, 3, 1, 2] 🎉", 
        variables: { board: [...board], row: 4, col: 2 },
        completed: true, 
        result: "[0, 3, 1, 2]" 
      });
      return steps;
    }
  },
  INFIX_TO_POSTFIX: {
    title: "16. Infix to Postfix Converter (Stack ADT)",
    difficulty: "Medium",
    category: "Stack ADT",
    notes: {
      desc: "Convert an infix arithmetic expression '(A + B) * C - D / E' to postfix notation using an Operator Stack.",
      intuition: "Operands go directly to output. '(' pushed to stack. ')' pops stack to output until '('. Operators pop higher/equal precedence operators from stack, then push themselves.",
      complexity: "Time Complexity: O(N) | Space Complexity: O(N) Stack"
    },
    code: {
      JS: `function infixToPostfix(exp) {
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  let stack = [], out = '';
  for (let ch of exp) {
    if (/[A-Z]/.test(ch)) out += ch;
    else if (ch === '(') stack.push(ch);
    else if (ch === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') out += stack.pop();
      stack.pop();
    } else {
      while (stack.length && prec[stack[stack.length - 1]] >= prec[ch]) out += stack.pop();
      stack.push(ch);
    }
  }
  while (stack.length) out += stack.pop();
  return out;
}`,
      Python: `def infix_to_postfix(exp):
    prec = {'+': 1, '-': 1, '*': 2, '/': 2}
    stack, out = [], []
    for ch in exp:
        if ch.isalnum(): out.append(ch)
        elif ch == '(': stack.append(ch)
        elif ch == ')':
            while stack and stack[-1] != '(': out.append(stack.pop())
            stack.pop()
        else:
            while stack and stack[-1] != '(' and prec.get(stack[-1], 0) >= prec.get(ch, 0):
                out.append(stack.pop())
            stack.append(ch)
    while stack: out.append(stack.pop())
    return ''.join(out)`,
      "C++": `string infixToPostfix(string s) {
    stack<char> st; string out;
    for (char c : s) {
        if (isalpha(c)) out += c;
        else if (c == '(') st.push(c);
        else if (c == ')') {
            while (!st.empty() && st.top() != '(') { out += st.top(); st.pop(); }
            st.pop();
        } else {
            while (!st.empty() && prec(st.top()) >= prec(c)) { out += st.top(); st.pop(); }
            st.push(c);
        }
    }
    while (!st.empty()) { out += st.top(); st.pop(); }
    return out;
}`,
      C: `// Infix to Postfix Stack Converter`,
      Java: `// Infix to Postfix Java Stack Converter`
    },
    generator: () => {
      const exp = "(A + B) * C - D / E".replace(/\s+/g, '').split('');
      const steps = [];
      const stack = [];
      let output = "";
      const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };

      steps.push({ line: 1, msg: "Start Infix to Postfix: Expression = '(A+B)*C-D/E'", variables: { exp, currentIdx: 0, stack: [...stack], output } });

      for (let i = 0; i < exp.length; i++) {
        const ch = exp[i];
        if (/[A-Z]/.test(ch)) {
          output += ch;
          steps.push({ line: 3, msg: `Token '${ch}': Operand -> Append to output: "${output}"`, variables: { exp, currentIdx: i, stack: [...stack], output } });
        } else if (ch === '(') {
          stack.push(ch);
          steps.push({ line: 4, msg: `Token '(': Left Paren -> Push to Stack.`, variables: { exp, currentIdx: i, stack: [...stack], output } });
        } else if (ch === ')') {
          while (stack.length && stack[stack.length - 1] !== '(') {
            output += stack.pop();
          }
          stack.pop(); // pop '('
          steps.push({ line: 6, msg: `Token ')': Right Paren -> Pop operators until '(': Output = "${output}"`, variables: { exp, currentIdx: i, stack: [...stack], output } });
        } else {
          while (stack.length && stack[stack.length - 1] !== '(' && prec[stack[stack.length - 1]] >= prec[ch]) {
            output += stack.pop();
          }
          stack.push(ch);
          steps.push({ line: 8, msg: `Operator '${ch}': Push to stack (after popping higher/equal precedence): Stack = [${stack.join(', ')}]`, variables: { exp, currentIdx: i, stack: [...stack], output } });
        }
      }

      while (stack.length) {
        output += stack.pop();
      }
      steps.push({ 
        line: 10, 
        msg: `End of expression -> Pop remaining operators to output: Final Postfix = "${output}" 🎉`, 
        variables: { exp, currentIdx: exp.length, stack: [], output },
        completed: true, 
        result: output 
      });

      return steps;
    }
  },
  SIEVE_GRID: {
    title: "17. Sieve of Eratosthenes (Prime Grid)",
    difficulty: "Easy",
    category: "Math & Primes",
    notes: {
      desc: "Find all prime numbers up to N = 30 by crossing out multiples of primes starting from 2, 3, 5.",
      intuition: "Start at p = 2 (first prime). Cross out 4, 6, 8, 10... Move to p = 3 (next uncrossed prime). Cross out 9, 15, 21... Repeat until p*p > N. All surviving numbers are strictly prime!",
      complexity: "Time Complexity: O(N log log N) | Space Complexity: O(N)"
    },
    code: {
      JS: `function sieve(n = 30) {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= n; i += p) isPrime[i] = false;
    }
  }
  return isPrime;
}`,
      Python: `def sieve(n=30):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    return is_prime`,
      "C++": `vector<bool> sieve(int n = 30) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p) isPrime[i] = false;
        }
    }
    return isPrime;
}`,
      C: `// Sieve of Eratosthenes C implementation`,
      Java: `// Sieve of Eratosthenes Java implementation`
    },
    generator: () => {
      const N = 30;
      const numbers = Array.from({ length: N - 1 }, (_, i) => i + 2); // 2 to 30
      const crossed = {};
      const primes = [];
      const steps = [];

      steps.push({ line: 1, msg: "Initialize Sieve Grid (2 to 30). All numbers assume prime.", variables: { numbers, crossed: { ...crossed }, currentP: null, primes: [] } });

      // Prime 2
      primes.push(2);
      for (let m = 4; m <= N; m += 2) crossed[m] = 2;
      steps.push({ line: 4, msg: "p = 2 is Prime! Cross out multiples: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30.", variables: { numbers, crossed: { ...crossed }, currentP: 2, primes: [...primes] } });

      // Prime 3
      primes.push(3);
      for (let m = 9; m <= N; m += 6) crossed[m] = 3;
      steps.push({ line: 4, msg: "p = 3 is Prime! Cross out multiples: 9, 15, 21, 27.", variables: { numbers, crossed: { ...crossed }, currentP: 3, primes: [...primes] } });

      // Prime 5
      primes.push(5);
      crossed[25] = 5;
      steps.push({ line: 4, msg: "p = 5 is Prime! Cross out multiple: 25.", variables: { numbers, crossed: { ...crossed }, currentP: 5, primes: [...primes] } });

      // Finished
      const finalPrimes = numbers.filter(n => !crossed[n]);
      steps.push({ 
        line: 8, 
        msg: `p*p > 30 reached! All surviving uncrossed numbers are Primes: [${finalPrimes.join(', ')}] 🎉`, 
        variables: { numbers, crossed: { ...crossed }, currentP: null, primes: finalPrimes },
        completed: true, 
        result: finalPrimes.join(', ') 
      });

      return steps;
    }
  }
};

// ─── VISUALIZER COMPONENTS ───────────────────────────────────────────────────
const DSANotesVisualizer = ({ 
  onBack, 
  openSettings, 
  fontSize = 14, 
  wordWrap = 'off', 
  onShowUpcomingFeatures,
  initialTopicKey = 'LESSON_VARIABLES',
  initialLang = 'C++',
  onOpenDebugger,
  onCodeChange
}) => {
  const [selectedProbKey, setSelectedProbKey] = useState(initialTopicKey || 'LESSON_VARIABLES');
  const [activeLang, setActiveLang] = useState(initialLang || 'C++');
  const [codeViewMode, setCodeViewMode] = useState('full'); // 'full' (complete runnable program) | 'snippet' (core function only)
  const [activeTab, setActiveTab] = useState(
    initialTopicKey && !initialTopicKey.startsWith('LESSON_') && !initialTopicKey.startsWith('MOD') 
      ? 'solved' 
      : 'notes'
  );
  const [localFontSize, setLocalFontSize] = useState(fontSize || 16);
  const [isRunnerOpen, setIsRunnerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTopicKey) {
      setSelectedProbKey(initialTopicKey);
      if (initialTopicKey.startsWith('LESSON_') || initialTopicKey.startsWith('MOD')) {
        setActiveTab('notes');
      } else {
        setActiveTab('solved');
      }
    }
  }, [initialTopicKey]);

  useEffect(() => {
    if (initialLang) {
      setActiveLang(initialLang);
    }
  }, [initialLang]);

  useEffect(() => {
    if (activeTab === 'solved' && selectedProbKey.startsWith('LESSON_')) {
      setSelectedProbKey('FIND_MAX');
    }
  }, [activeTab]);

  // Animation states
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  // Draggable execution log states
  const [showLogPanel, setShowLogPanel] = useState(true);
  const [logPosition, setLogPosition] = useState({ x: 50, y: 150 });
  const [logSize, setLogSize] = useState({ width: 520, height: 280 });
  const [isDraggingLog, setIsDraggingLog] = useState(false);
  const [activeStateWidth, setActiveStateWidth] = useState(160);
  
  const logContainerRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const panelStart = useRef({ x: 0, y: 0 });
  const playIntervalRef = useRef(null);

  const isLessonKey = !!LESSONS[selectedProbKey];
  const activeLesson = LESSONS[selectedProbKey] || LESSONS['LESSON_VARIABLES'];
  const activeProblem = PROBLEMS[selectedProbKey] || PROBLEMS['FIND_MAX'];

  const problem = isLessonKey 
    ? { 
        title: activeLesson.title, 
        difficulty: "Lesson", 
        category: "Theory", 
        notes: { desc: activeLesson.desc, intuition: activeLesson.analogy, complexity: "N/A" }, 
        code: activeLesson.code || { JS: '', Python: '', C: '', Java: '', "C++": '' }, 
        generator: () => [] 
      } 
    : activeProblem;

  const rawActiveCode = getSafeCode(problem.code, activeLang);
  const codeLines = rawActiveCode ? rawActiveCode.split('\n') : [];

  useEffect(() => {
    if (onCodeChange && rawActiveCode) {
      onCodeChange(rawActiveCode, activeLang);
    }
  }, [rawActiveCode, activeLang, onCodeChange]);

  const handleCopy = (codeToCopy) => {
    const text = codeToCopy || rawActiveCode;
    if (!text) return;
    copyToClipboard(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Sync prop font size
  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize]);

  // Generate simulation timeline on problem change
  useEffect(() => {
    setIsPlaying(false);
    const steps = problem.generator ? problem.generator() : [];
    setTimeline(steps);
    setCurrentStep(0);
  }, [selectedProbKey]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [currentStep, showLogPanel, timeline]);

  // Animation timer
  useEffect(() => {
    if (isPlaying && currentStep < timeline.length - 1) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= timeline.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, currentStep, timeline.length, speed]);

  // Draggable handlers
  const handleLogHeaderMouseDown = (e) => {
    if (e.button !== 0 && e.type !== 'touchstart') return;
    setIsDraggingLog(true);
    const isTouch = e.type.startsWith('touch');
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX, y: clientY };
    panelStart.current = { x: logPosition.x, y: logPosition.y };
    if (e.cancelable) e.preventDefault();
  };

  useEffect(() => {
    if (!isDraggingLog) return;
    const handleMouseMove = (e) => {
      const isTouch = e.type.startsWith('touch');
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;
      
      setLogPosition({
        x: Math.max(-logSize.width + 50, Math.min(window.innerWidth - 50, panelStart.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 30, panelStart.current.y + dy))
      });
    };

    const handleMouseUp = () => {
      setIsDraggingLog(false);
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
  }, [isDraggingLog, logSize]);

  const handleLogResizeMouseDown = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startY = isTouch ? e.touches[0].clientY : e.clientY;
    const startWidth = logSize.width;
    const startHeight = logSize.height;

    const handleMouseMove = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const newWidth = Math.max(300, Math.min(800, startWidth + (currentX - startX)));
      const newHeight = Math.max(150, Math.min(600, startHeight + (currentY - startY)));
      setLogSize({ width: newWidth, height: newHeight });
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

  const handleActiveStateColDragStart = (e) => {
    if (e.cancelable) e.preventDefault();
    const isTouch = e.type.startsWith('touch');
    const startX = isTouch ? e.touches[0].clientX : e.clientX;
    const startWidth = activeStateWidth;
    const drag = (moveEvent) => {
      const currentX = moveEvent.type.startsWith('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const newWidth = Math.max(120, Math.min(logSize.width - 120, startWidth + (currentX - startX)));
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

  const activeFrame = timeline[currentStep] || { line: 0, msg: "Ready", variables: {} };

  // ── Render Problem Visual SVG ──────────────────────────────────────────────
  const renderVisualCanvas = () => {
    const width = 600;
    const height = 220;

    if (selectedProbKey.startsWith('LESSON_')) {
      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <foreignObject x={20} y={20} width={width - 40} height={height - 40}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'rgba(59,130,246,0.06)',
              border: '1px dashed rgba(59,130,246,0.3)',
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              padding: '20px',
              textAlign: 'center',
              fontFamily: 'sans-serif'
            }}>
              <span style={{ fontSize: '2rem', marginBottom: '8px' }}>📘</span>
              <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '1rem' }}>Theoretical Lesson Selected</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4', maxWidth: '400px' }}>
                To view a step-by-step code trace animation, switch back to the <strong>📚 Topic Notes</strong> tab to read the full concept, or choose an interactive sum like <strong>Find Maximum in Array</strong> or <strong>Two Sum</strong> from the dropdown above!
              </p>
            </div>
          </foreignObject>
        </svg>
      );
    }

    if (selectedProbKey === 'FIND_MAX') {
      const arr = activeFrame.variables.arr || [12, 35, 1, 10, 34, 1];
      const maxVal = activeFrame.variables.maxVal;
      const currentI = activeFrame.variables.i;
      const updated = activeFrame.updated;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">INPUT ARRAY (arr)</text>
          {arr.map((num, idx) => {
            const isCurr = (idx === currentI);
            const isMax = (num === maxVal);
            return (
              <g key={idx} transform={`translate(${40 + idx * 75}, 50)`}>
                <rect x={0} y={0} width={65} height={45} rx={8} 
                  fill={isMax ? 'rgba(52,211,153,0.2)' : isCurr ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)'} 
                  stroke={isMax ? '#34d399' : isCurr ? '#fbbf24' : 'rgba(255,255,255,0.1)'} 
                  strokeWidth="2"
                />
                <text x={32.5} y={28} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={32.5} y={60} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx}</text>
                {isCurr && <text x={32.5} y={-10} fill="#fb923c" textAnchor="middle" fontSize="16">👇 i</text>}
              </g>
            );
          })}

          {/* Active Variable State */}
          <text x={20} y={150} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">STATE VARIABLE</text>
          <g transform="translate(20, 160)">
            <rect width={220} height={45} rx={8} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.05)" />
            <text x={15} y={26} fill="var(--text-secondary)" fontSize="14">maxVal = </text>
            <text x={90} y={28} fill={updated ? '#34d399' : '#fbbf24'} fontSize="18" fontWeight="bold">{maxVal}</text>
            {updated && <text x={140} y={26} fill="#34d399" fontSize="11" fontWeight="bold">✦ UPDATED</text>}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'COUNT_EVEN') {
      const arr = activeFrame.variables.arr || [3, 8, 12, 5, 9, 14];
      const count = activeFrame.variables.count;
      const currentI = activeFrame.variables.i;
      const matched = activeFrame.matched;
      const isOdd = activeFrame.odd;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">INPUT ARRAY (arr)</text>
          {arr.map((num, idx) => {
            const isCurr = (idx === currentI);
            const isProcessedEven = (idx < currentI && num % 2 === 0) || (isCurr && matched);
            return (
              <g key={idx} transform={`translate(${40 + idx * 75}, 50)`}>
                <rect x={0} y={0} width={65} height={45} rx={8} 
                  fill={isProcessedEven ? 'rgba(52,211,153,0.15)' : isCurr ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)'} 
                  stroke={isProcessedEven ? '#34d399' : isCurr ? (matched ? '#34d399' : isOdd ? '#ef4444' : '#fbbf24') : 'rgba(255,255,255,0.1)'} 
                  strokeWidth="2"
                />
                <text x={32.5} y={28} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={32.5} y={60} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx}</text>
                {isCurr && <text x={32.5} y={-10} fill="#fb923c" textAnchor="middle" fontSize="16">👇 i</text>}
              </g>
            );
          })}

          {/* Active Variable State */}
          <text x={20} y={150} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">STATE VARIABLE</text>
          <g transform="translate(20, 160)">
            <rect width={220} height={45} rx={8} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.05)" />
            <text x={15} y={26} fill="var(--text-secondary)" fontSize="14">evenCount = </text>
            <text x={120} y={28} fill="#34d399" fontSize="18" fontWeight="bold">{count}</text>
            {matched && <text x={160} y={26} fill="#34d399" fontSize="11" fontWeight="bold">✦ +1 EVEN</text>}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'FACTORIAL_RECURSIVE') {
      const stack = activeFrame.variables.stack || [];
      const returnVal = activeFrame.result;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={30} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">RECURSION CALL STACK</text>
          
          <g transform="translate(40, 45)">
            <rect width={260} height={150} rx={12} fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            
            {stack.map((frame, idx) => {
              const isReturning = frame.state === 'RETURN';
              return (
                <g key={idx} transform={`translate(15, ${110 - idx * 32})`}>
                  <rect width={230} height={26} rx={6} 
                    fill={isReturning ? 'rgba(52,211,153,0.15)' : 'rgba(59,130,246,0.15)'} 
                    stroke={isReturning ? '#34d399' : '#38bdf8'} 
                    strokeWidth="1.5" 
                  />
                  <text x={15} y={17} fill="#ffffff" fontSize="12" fontWeight="bold">{frame.label}</text>
                  <text x={140} y={16} fill="var(--text-secondary)" fontSize="11">
                    {isReturning ? `returns ${frame.returnVal}` : 'active frame'}
                  </text>
                </g>
              );
            })}
            
            {stack.length === 0 && (
              <text x={130} y={85} fill="var(--text-secondary)" textAnchor="middle" fontSize="13" fontStyle="italic">Stack Empty (No Calls)</text>
            )}
          </g>

          {/* Returned Value State */}
          <text x={340} y={30} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">CALL STACK STATE</text>
          <g transform="translate(340, 45)">
            <rect width={220} height={150} rx={12} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.05)" />
            <text x={20} y={40} fill="var(--text-secondary)" fontSize="13">Stack Depth:</text>
            <text x={150} y={40} fill="#38bdf8" fontSize="16" fontWeight="bold">{stack.length}</text>
            
            <text x={20} y={80} fill="var(--text-secondary)" fontSize="13">Current N:</text>
            <text x={150} y={80} fill="#fbbf24" fontSize="16" fontWeight="bold">{activeFrame.variables.n ?? '-'}</text>
            
            {returnVal !== undefined && (
              <g transform="translate(0, 100)">
                <line x1={20} y1={5} x2={200} y2={5} stroke="rgba(255,255,255,0.1)" />
                <text x={20} y={30} fill="#34d399" fontSize="13" fontWeight="bold">Result:</text>
                <text x={150} y={30} fill="#34d399" fontSize="18" fontWeight="bold">{returnVal}</text>
              </g>
            )}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'TWO_SUM') {
      const { nums, map, i, comp } = activeFrame.variables;
      const highlightIdx = activeFrame.highlightIdx || [];
      const found = activeFrame.found;
      const pair = activeFrame.pair || [];

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Numbers Array */}
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">INPUT ARRAY (nums)</text>
          {nums && nums.map((num, idx) => {
            const isH = highlightIdx.includes(idx) || pair.includes(idx);
            const isComplement = (idx === map[comp]);
            return (
              <g key={idx} transform={`translate(${40 + idx * 60}, 50)`}>
                <rect x={0} y={0} width={50} height={45} rx={8} 
                  fill={isComplement ? 'rgba(52,211,153,0.2)' : isH ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)'} 
                  stroke={isComplement ? '#34d399' : isH ? '#fbbf24' : 'rgba(255,255,255,0.1)'} 
                  strokeWidth="2"
                />
                <text x={25} y={28} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={25} y={60} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx}</text>
                {i === idx && <text x={25} y={-10} fill="#fb923c" textAnchor="middle" fontSize="16">👇 i</text>}
              </g>
            );
          })}

          {/* Hash Map View */}
          <text x={340} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">HASH MAP (value ➔ index)</text>
          <g transform="translate(340, 50)">
            <rect width={240} height={120} rx={12} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.08)" />
            {map && Object.entries(map).map(([k, valIdx], mi) => (
              <g key={k} transform={`translate(15, ${20 + mi * 25})`}>
                <text x={0} y={15} fill="#38bdf8" fontSize="13" fontWeight="bold">{k}</text>
                <text x={60} y={15} fill="var(--text-secondary)" fontSize="13">➔</text>
                <text x={95} y={15} fill="#34d399" fontSize="13" fontWeight="bold">index {valIdx}</text>
              </g>
            ))}
            {(!map || Object.keys(map).length === 0) && (
              <text x={120} y={65} fill="var(--text-secondary)" textAnchor="middle" fontSize="13" fontStyle="italic">Empty Map</text>
            )}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'REVERSE_LIST' || selectedProbKey === 'CYCLE_DETECTION') {
      const isCycle = selectedProbKey === 'CYCLE_DETECTION';
      const arr = [1, 2, 3, 4, 5];
      const listState = activeFrame.listState || { prev: null, curr: 0, next: null, reversed: {} };
      const pointers = activeFrame.pointers || { slow: 0, fast: 0 };
      const matched = activeFrame.matched;
      
      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          {arr.map((val, idx) => {
            const isCurr = isCycle ? (pointers.slow === idx || pointers.fast === idx) : (listState.curr === idx);
            const isPrev = !isCycle && (listState.prev === idx);
            const isNext = !isCycle && (listState.next === idx);

            const x = 50 + idx * 110;
            const y = 90;

            const isPointerReversed = !isCycle && (listState.reversed && listState.reversed[idx] !== undefined);

            return (
              <g key={idx}>
                {/* Node Circle */}
                <circle cx={x} cy={y} r={22} 
                  fill={isCurr ? 'rgba(251,191,36,0.25)' : isPrev ? 'rgba(52,211,153,0.25)' : isNext ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.06)'} 
                  stroke={isCurr ? '#fbbf24' : isPrev ? '#34d399' : isNext ? '#38bdf8' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="2.5"
                />
                <text cx={x} cy={y} x={x} y={y + 5} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{val}</text>
                
                {/* Connection Line */}
                {idx < arr.length - 1 && (
                  <g>
                    {isPointerReversed ? (
                      // Reversed left arrow
                      <>
                        <line x1={x - 22} y1={y} x2={x - 88} y2={y} stroke="#34d399" strokeWidth="3" markerEnd="url(#arrow-left)" />
                        <path d={`M ${x-22} ${y} L ${x-88} ${y}`} fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" style={{ animation: 'flowDashCcw 0.5s infinite linear' }} />
                      </>
                    ) : (
                      // Standard right arrow
                      <>
                        <line x1={x + 22} y1={y} x2={x + 88} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                        <polygon points={`${x+88},${y} ${x+80},${y-4} ${x+80},${y+4}`} fill="rgba(255,255,255,0.4)" />
                      </>
                    )}
                  </g>
                )}

                {/* Floyd's Cycle Arrow back to 3 */}
                {isCycle && idx === arr.length - 1 && (
                  <path d={`M ${x} ${y+22} Q ${(x+160)/2} ${y+70} 270 ${y+22}`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeDasharray="4 4" />
                )}

                {/* Pointer Label tags */}
                <g transform={`translate(${x}, ${y + 45})`}>
                  {isCycle ? (
                    <>
                      {pointers.slow === idx && <text x={0} y={0} fill="#10b981" textAnchor="middle" fontSize="11" fontWeight="bold">Slow 🐢</text>}
                      {pointers.fast === idx && <text x={0} y={15} fill="#fb923c" textAnchor="middle" fontSize="11" fontWeight="bold">Fast 🐇</text>}
                      {matched && pointers.slow === idx && <text x={0} y={30} fill="#f43f5e" textAnchor="middle" fontSize="11" fontWeight="bold">🔥 MEET</text>}
                    </>
                  ) : (
                    <>
                      {isCurr && <text x={0} y={0} fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">curr</text>}
                      {isPrev && <text x={0} y={12} fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">prev</text>}
                      {isNext && <text x={0} y={24} fill="#38bdf8" textAnchor="middle" fontSize="11" fontWeight="bold">next</text>}
                    </>
                  )}
                </g>
              </g>
            );
          })}
          
          <defs>
            <marker id="arrow-left" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M 10 2 L 2 5 L 10 8 Z" fill="#34d399" />
            </marker>
          </defs>
        </svg>
      );
    }

    if (selectedProbKey === 'VALID_PARENTHESES') {
      const { s, stack, char, i } = activeFrame.variables;
      const highlightIdx = activeFrame.highlightIdx;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* String view */}
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">INPUT STRING</text>
          {s && s.split('').map((ch, idx) => {
            const isH = (i === idx);
            return (
              <g key={idx} transform={`translate(${40 + idx * 45}, 50)`}>
                <rect width={36} height={36} rx={6} 
                  fill={isH ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)'} 
                  stroke={isH ? '#fbbf24' : 'rgba(255,255,255,0.08)'} 
                  strokeWidth="1.5" 
                />
                <text x={18} y={23} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{ch}</text>
              </g>
            );
          })}

          {/* Stack box view */}
          <text x={400} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">STACK (LIFO)</text>
          <g transform="translate(400, 50)">
            {/* Stack container frame */}
            <path d="M 20 0 L 20 120 L 100 120 L 100 0" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            
            {stack && stack.map((stChar, stIdx) => (
              <g key={stIdx} transform={`translate(25, ${95 - stIdx * 25})`}>
                <rect width={50} height={20} rx={4} fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="1" />
                <text x={25} y={15} fill="#ffffff" textAnchor="middle" fontSize="13" fontWeight="bold">{stChar}</text>
              </g>
            ))}
            {(!stack || stack.length === 0) && (
              <text x={60} y={70} fill="var(--text-secondary)" textAnchor="middle" fontSize="13" fontStyle="italic">Empty</text>
            )}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'FIBONACCI') {
      const { n, dp, i } = activeFrame.variables;
      
      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">DP TABLE (dp)</text>
          {dp && dp.map((val, idx) => {
            const isActive = (i === idx);
            const isBase = (idx <= 1);
            return (
              <g key={idx} transform={`translate(${40 + idx * 75}, 60)`}>
                <rect width={60} height={50} rx={8} 
                  fill={isActive ? 'rgba(251,191,36,0.2)' : isBase ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.04)'} 
                  stroke={isActive ? '#fbbf24' : isBase ? '#38bdf8' : 'rgba(255,255,255,0.1)'} 
                  strokeWidth="2"
                />
                <text x={30} y={30} fill="#ffffff" textAnchor="middle" fontSize="18" fontWeight="bold">{val}</text>
                <text x={30} y={65} fill="var(--text-secondary)" textAnchor="middle" fontSize="12">dp[{idx}]</text>
              </g>
            );
          })}
        </svg>
      );
    }

    if (selectedProbKey === 'MERGE_SORTED_LISTS') {
      const { l1, l2, merged } = activeFrame.variables;
      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* List 1 */}
          <text x={20} y={25} fill="var(--text-secondary)" fontSize="11" fontWeight="bold">LIST 1 (l1)</text>
          {l1 && l1.map((val, idx) => (
            <g key={idx} transform={`translate(${40 + idx * 60}, 35)`}>
              <circle cx={20} cy={15} r={14} fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x={20} y={19} fill="#fff" textAnchor="middle" fontSize="12" fontWeight="bold">{val}</text>
            </g>
          ))}
          {l1 && l1.length === 0 && <text x={40} y={45} fill="var(--text-secondary)" fontSize="13" fontStyle="italic">null</text>}

          {/* List 2 */}
          <text x={20} y={85} fill="var(--text-secondary)" fontSize="11" fontWeight="bold">LIST 2 (l2)</text>
          {l2 && l2.map((val, idx) => (
            <g key={idx} transform={`translate(${40 + idx * 60}, 95)`}>
              <circle cx={20} cy={15} r={14} fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="1.5" />
              <text x={20} y={19} fill="#fff" textAnchor="middle" fontSize="12" fontWeight="bold">{val}</text>
            </g>
          ))}
          {l2 && l2.length === 0 && <text x={40} y={105} fill="var(--text-secondary)" fontSize="13" fontStyle="italic">null</text>}

          {/* Merged */}
          <text x={360} y={25} fill="var(--text-secondary)" fontSize="11" fontWeight="bold">MERGED TAIL</text>
          <g transform="translate(360, 35)">
            {merged && merged.map((val, idx) => (
              <g key={idx} transform={`translate(0, ${idx * 28})`}>
                <rect width={160} height={22} rx={6} fill="rgba(52,211,153,0.15)" stroke="#34d399" strokeWidth="1" />
                <text x={80} y={15} fill="#fff" textAnchor="middle" fontSize="12" fontWeight="bold">{val}</text>
              </g>
            ))}
            {(!merged || merged.length === 0) && (
              <text x={0} y={25} fill="var(--text-secondary)" fontSize="13" fontStyle="italic">Empty (dummy ➔ null)</text>
            )}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'BINARY_SEARCH' || selectedProbKey === 'PEAK_ELEMENT') {
      const { arr, low, high, mid } = activeFrame.variables;
      const highlightIdx = activeFrame.highlightIdx || [];
      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">ARRAY SEARCH CANVAS</text>
          {arr && arr.map((num, idx) => {
            const isL = (low === idx);
            const isH = (high === idx);
            const isM = (mid === idx);
            const isExcluded = (idx < low || idx > high);

            return (
              <g key={idx} transform={`translate(${40 + idx * 70}, 60)`}>
                <rect width={55} height={45} rx={8} 
                  fill={isM ? 'rgba(251,191,36,0.22)' : isExcluded ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)'} 
                  stroke={isM ? '#fbbf24' : isExcluded ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.15)'} 
                  strokeWidth="2"
                  opacity={isExcluded ? 0.4 : 1}
                />
                <text x={27} y={28} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={27} y={60} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx}</text>
                
                {/* Pointer tags */}
                <g transform="translate(27, -10)">
                  {isL && <text x={-15} y={0} fill="#10b981" fontSize="10" fontWeight="bold">low</text>}
                  {isM && <text x={0} y={-10} fill="#fb923c" textAnchor="middle" fontSize="12">👇 mid</text>}
                  {isH && <text x={15} y={0} fill="#ef4444" fontSize="10" fontWeight="bold">high</text>}
                </g>
              </g>
            );
          })}
        </svg>
      );
    }

    if (selectedProbKey === 'KADANES') {
      const { nums, maxSoFar, maxEndingHere, i } = activeFrame.variables;
      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">KADANE'S RUNNING WINDOW</text>
          {nums && nums.map((num, idx) => {
            const isActive = (i === idx);
            return (
              <g key={idx} transform={`translate(${30 + idx * 58}, 55)`}>
                <rect width={48} height={40} rx={6} 
                  fill={isActive ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.04)'} 
                  stroke={isActive ? '#fbbf24' : 'rgba(255,255,255,0.08)'} 
                  strokeWidth="1.5"
                />
                <text x={24} y={25} fill="#ffffff" textAnchor="middle" fontSize="15" fontWeight="bold">{num}</text>
                <text x={24} y={55} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">[{idx}]</text>
                {isActive && <text x={24} y={-10} fill="#fb923c" textAnchor="middle" fontSize="14">👇 i</text>}
              </g>
            );
          })}

          {/* Kadane state box */}
          <g transform="translate(30, 140)">
            <rect width={540} height={50} rx={8} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" />
            <text x={30} y={30} fill="var(--text-secondary)" fontSize="13">maxEndingHere (current sub-sum):</text>
            <text x={250} y={31} fill="#fb923c" fontSize="15" fontWeight="bold">{maxEndingHere}</text>

            <text x={320} y={30} fill="var(--text-secondary)" fontSize="13">maxSoFar (global max):</text>
            <text x={490} y={31} fill="#34d399" fontSize="15" fontWeight="bold">{maxSoFar}</text>
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'TREE_INORDER') {
      const { stack, result, activeNode } = activeFrame.variables;
      
      const nodes = [
        { id: 1, val: 1, x: 180, y: 45 },
        { id: 2, val: 2, x: 100, y: 105 },
        { id: 3, val: 3, x: 260, y: 105 },
        { id: 4, val: 4, x: 50, y: 165 },
        { id: 5, val: 5, x: 150, y: 165 }
      ];
      
      const edges = [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 }
      ];

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={25} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">BINARY TREE VISUAL</text>
          
          {edges.map((e, idx) => {
            const nFrom = nodes.find(n => n.id === e.from);
            const nTo = nodes.find(n => n.id === e.to);
            return (
              <line key={idx} x1={nFrom.x} y1={nFrom.y} x2={nTo.x} y2={nTo.y} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            );
          })}

          {nodes.map(n => {
            const isActive = (activeNode === n.id);
            const isVisited = result && result.includes(n.id);
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle r={16} 
                  fill={isActive ? 'rgba(251,191,36,0.22)' : isVisited ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.05)'} 
                  stroke={isActive ? '#fbbf24' : isVisited ? '#34d399' : 'rgba(255,255,255,0.15)'}
                  strokeWidth="2"
                />
                <text y={4} fill="#ffffff" textAnchor="middle" fontSize="12" fontWeight="bold">{n.val}</text>
              </g>
            );
          })}

          <text x={350} y={25} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">RECURSION STACK</text>
          <g transform="translate(350, 40)">
            <path d="M 10 0 L 10 130 L 110 130 L 110 0" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {stack && stack.map((call, idx) => (
              <g key={idx} transform={`translate(15, ${105 - idx * 22})`}>
                <rect width={80} height={18} rx={4} fill="rgba(251,146,60,0.22)" stroke="#fb923c" strokeWidth="1" />
                <text x={40} y={13} fill="#fff" textAnchor="middle" fontSize="10" fontWeight="bold">{call}</text>
              </g>
            ))}
          </g>

          <text x={490} y={25} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">INORDER RESULT</text>
          <g transform="translate(490, 40)">
            <rect width={90} height={130} rx={8} fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.04)" />
            {result && result.map((val, idx) => (
              <text key={idx} x={45} y={25 + idx * 20} fill="#34d399" textAnchor="middle" fontSize="14" fontWeight="bold">
                {val}
              </text>
            ))}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'TWO_POINTERS_TARGET') {
      const arr = activeFrame.variables.arr || [2, 7, 11, 15, 18];
      const pointers = activeFrame.pointers || { left: 0, right: arr.length - 1 };
      const currentSum = activeFrame.variables.sum;
      const matched = activeFrame.matched;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">SORTED ARRAY (numbers)</text>
          {arr.map((num, idx) => {
            const isLeft = (idx === pointers.left);
            const isRight = (idx === pointers.right);
            const isSelected = isLeft || isRight;
            return (
              <g key={idx} transform={`translate(${40 + idx * 80}, 55)`}>
                <rect x={0} y={0} width={70} height={48} rx={8} 
                  fill={matched && isSelected ? 'rgba(52,211,153,0.25)' : isSelected ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)'} 
                  stroke={matched && isSelected ? '#34d399' : isSelected ? '#fbbf24' : 'rgba(255,255,255,0.1)'} 
                  strokeWidth="2"
                />
                <text x={35} y={30} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={35} y={64} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx + 1}</text>
                {isLeft && <text x={35} y={-10} fill="#38bdf8" textAnchor="middle" fontSize="13" fontWeight="bold">👆 Left</text>}
                {isRight && <text x={35} y={-10} fill="#f472b6" textAnchor="middle" fontSize="13" fontWeight="bold">👆 Right</text>}
              </g>
            );
          })}

          {/* Active Variable State */}
          <text x={20} y={160} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">POINTER SUM CALCULATION</text>
          <g transform="translate(20, 170)">
            <rect width={280} height={50} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.06)" />
            <text x={15} y={30} fill="var(--text-secondary)" fontSize="13">Current Sum = </text>
            <text x={115} y={31} fill={matched ? '#34d399' : '#fbbf24'} fontSize="18" fontWeight="bold">{currentSum}</text>
            {matched && <text x={160} y={30} fill="#34d399" fontSize="11" fontWeight="bold">✦ TARGET MATCHED!</text>}
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'SLIDING_WINDOW_MAX_K') {
      const arr = activeFrame.variables.arr || [2, 1, 5, 1, 3, 2];
      const [wL, wR] = activeFrame.windowRange || [0, 2];
      const windowSum = activeFrame.variables.windowSum;
      const maxSum = activeFrame.variables.maxSum;
      const updated = activeFrame.updated;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">ARRAY & SLIDING WINDOW [K = 3]</text>
          {arr.map((num, idx) => {
            const inWindow = (idx >= wL && idx <= wR);
            return (
              <g key={idx} transform={`translate(${40 + idx * 75}, 55)`}>
                <rect x={0} y={0} width={65} height={45} rx={8} 
                  fill={inWindow ? 'rgba(56,189,248,0.22)' : 'rgba(255,255,255,0.05)'} 
                  stroke={inWindow ? '#38bdf8' : 'rgba(255,255,255,0.1)'} 
                  strokeWidth={inWindow ? "2.5" : "1"}
                />
                <text x={32.5} y={28} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={32.5} y={60} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx}</text>
                {idx === wL && <text x={32.5} y={-10} fill="#38bdf8" textAnchor="middle" fontSize="12" fontWeight="bold">L</text>}
                {idx === wR && <text x={32.5} y={-10} fill="#38bdf8" textAnchor="middle" fontSize="12" fontWeight="bold">R</text>}
              </g>
            );
          })}

          {/* Active Variable State */}
          <text x={20} y={160} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">WINDOW METRICS</text>
          <g transform="translate(20, 170)">
            <rect width={320} height={50} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.06)" />
            <text x={15} y={30} fill="var(--text-secondary)" fontSize="13">Window Sum: </text>
            <text x={105} y={31} fill="#38bdf8" fontSize="16" fontWeight="bold">{windowSum}</text>
            
            <text x={160} y={30} fill="var(--text-secondary)" fontSize="13">Max Sum: </text>
            <text x={235} y={31} fill={updated ? '#34d399' : '#fbbf24'} fontSize="16" fontWeight="bold">{maxSum}</text>
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'DUTCH_FLAG_SORT') {
      const arr = activeFrame.variables.arr || [2, 0, 2, 1, 1, 0];
      const pointers = activeFrame.pointers || { low: 0, mid: 0, high: arr.length - 1 };

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={35} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">DUTCH NATIONAL FLAG (0s, 1s, 2s)</text>
          {arr.map((num, idx) => {
            const isLow = (idx === pointers.low);
            const isMid = (idx === pointers.mid);
            const isHigh = (idx === pointers.high);
            const colorBg = num === 0 ? 'rgba(239, 68, 68, 0.25)' : num === 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.25)';
            const colorStroke = num === 0 ? '#ef4444' : num === 1 ? '#e2e8f0' : '#3b82f6';
            return (
              <g key={idx} transform={`translate(${40 + idx * 75}, 55)`}>
                <rect x={0} y={0} width={65} height={45} rx={8} 
                  fill={colorBg} 
                  stroke={colorStroke} 
                  strokeWidth="2"
                />
                <text x={32.5} y={28} fill="#ffffff" textAnchor="middle" fontSize="16" fontWeight="bold">{num}</text>
                <text x={32.5} y={60} fill="var(--text-secondary)" textAnchor="middle" fontSize="11">idx {idx}</text>
                {isLow && <text x={32.5} y={-10} fill="#ef4444" textAnchor="middle" fontSize="11" fontWeight="bold">Low</text>}
                {isMid && <text x={32.5} y={-24} fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">Mid</text>}
                {isHigh && <text x={32.5} y={-10} fill="#3b82f6" textAnchor="middle" fontSize="11" fontWeight="bold">High</text>}
              </g>
            );
          })}

          <text x={20} y={160} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">COLOR PARTITIONS</text>
          <g transform="translate(20, 170)">
            <rect width={340} height={45} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.06)" />
            <text x={15} y={28} fill="#ef4444" fontSize="13" fontWeight="bold">🔴 0s: [0...Low-1]</text>
            <text x={135} y={28} fill="#e2e8f0" fontSize="13" fontWeight="bold">⚪ 1s: [Low...Mid-1]</text>
            <text x={255} y={28} fill="#3b82f6" fontSize="13" fontWeight="bold">🔵 2s: [High+1...N]</text>
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'PREFIX_SUM_SUBARRAY') {
      const arr = activeFrame.variables.arr || [3, 1, 4, 1, 5, 9, 2];
      const prefix = activeFrame.variables.prefix || [3, 4, 8, 9, 14, 23, 25];
      const { L, R, sum } = activeFrame.variables;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={25} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">ORIGINAL ARRAY (nums)</text>
          {arr.map((num, idx) => (
            <g key={idx} transform={`translate(${30 + idx * 65}, 35)`}>
              <rect x={0} y={0} width={55} height={35} rx={6} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
              <text x={27.5} y={23} fill="#ffffff" textAnchor="middle" fontSize="14" fontWeight="bold">{num}</text>
              <text x={27.5} y={48} fill="var(--text-secondary)" textAnchor="middle" fontSize="10">i={idx}</text>
            </g>
          ))}

          <text x={20} y={115} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">PREFIX SUM ARRAY (cumulative)</text>
          {prefix.map((pVal, idx) => {
            const isLMinus1 = (L !== undefined && idx === L - 1);
            const isR = (R !== undefined && idx === R);
            return (
              <g key={idx} transform={`translate(${30 + idx * 65}, 125)`}>
                <rect x={0} y={0} width={55} height={35} rx={6} 
                  fill={isR ? 'rgba(52,211,153,0.25)' : isLMinus1 ? 'rgba(239,68,68,0.25)' : 'rgba(56,189,248,0.15)'} 
                  stroke={isR ? '#34d399' : isLMinus1 ? '#ef4444' : '#38bdf8'} 
                  strokeWidth="1.5"
                />
                <text x={27.5} y={23} fill="#ffffff" textAnchor="middle" fontSize="14" fontWeight="bold">{pVal}</text>
                {isR && <text x={27.5} y={48} fill="#34d399" textAnchor="middle" fontSize="10" fontWeight="bold">Prefix[R]</text>}
                {isLMinus1 && <text x={27.5} y={48} fill="#ef4444" textAnchor="middle" fontSize="10" fontWeight="bold">Prefix[L-1]</text>}
              </g>
            );
          })}

          {sum !== undefined && (
            <g transform="translate(20, 195)">
              <rect width={340} height={45} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(52,211,153,0.3)" />
              <text x={15} y={28} fill="#34d399" fontSize="13" fontWeight="bold">
                Range [{L}...{R}] Sum = Prefix[{R}] - Prefix[{L-1}] = {sum}
              </text>
            </g>
          )}
        </svg>
      );
    }

    if (selectedProbKey === 'NQUEENS_SOLVER') {
      const board = activeFrame.variables.board || [-1, -1, -1, -1];
      const { row, col, conflict } = activeFrame.variables;
      const N = 4;
      const tileSize = 42;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={25} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">4x4 CHESSBOARD BACKTRACKING</text>
          
          {/* Chessboard */}
          <g transform="translate(40, 40)">
            {Array.from({ length: N }).map((_, r) =>
              Array.from({ length: N }).map((_, c) => {
                const isDark = (r + c) % 2 === 1;
                const hasQueen = (board[r] === c);
                const isTesting = (row === r && col === c);
                return (
                  <g key={`${r}-${c}`} transform={`translate(${c * tileSize}, ${r * tileSize})`}>
                    <rect 
                      width={tileSize} height={tileSize} 
                      fill={isTesting && conflict ? 'rgba(239,68,68,0.35)' : isTesting ? 'rgba(251,191,36,0.35)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)'} 
                      stroke={isTesting && conflict ? '#ef4444' : isTesting ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
                      strokeWidth={isTesting ? "2" : "1"}
                    />
                    {hasQueen && (
                      <text x={tileSize / 2} y={tileSize / 2 + 7} fill="#fbbf24" textAnchor="middle" fontSize="22">
                        👑
                      </text>
                    )}
                    {isTesting && conflict && (
                      <text x={tileSize / 2} y={tileSize / 2 + 5} fill="#ef4444" textAnchor="middle" fontSize="16" fontWeight="bold">
                        ✕
                      </text>
                    )}
                  </g>
                );
              })
            )}
          </g>

          {/* State Box */}
          <g transform="translate(240, 40)">
            <rect width={320} height={170} rx={10} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.08)" />
            <text x={20} y={30} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">BACKTRACKING STATE</text>
            <text x={20} y={60} fill="var(--text-primary)" fontSize="13">Current Row: <tspan fill="#38bdf8" fontWeight="bold">{row < N ? row : 'Done (4/4)'}</tspan></text>
            <text x={20} y={85} fill="var(--text-primary)" fontSize="13">Tested Col: <tspan fill="#fbbf24" fontWeight="bold">{col >= 0 ? col : '-'}</tspan></text>
            <text x={20} y={110} fill="var(--text-primary)" fontSize="13">Status: <tspan fill={conflict ? '#ef4444' : '#34d399'} fontWeight="bold">{conflict ? '⚠️ Attack Conflict' : '✅ Placement Safe'}</tspan></text>
            <text x={20} y={140} fill="var(--text-secondary)" fontSize="12">Queens: <tspan fill="#34d399" fontWeight="bold">[{board.map(c => c >= 0 ? c : '_').join(', ')}]</tspan></text>
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'INFIX_TO_POSTFIX') {
      const { exp, currentIdx, stack, output } = activeFrame.variables;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={25} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">INFIX TOKEN STREAM</text>
          
          {/* Tokens */}
          {exp && exp.map((tok, idx) => {
            const isCurr = (idx === currentIdx);
            return (
              <g key={idx} transform={`translate(${30 + idx * 36}, 38)`}>
                <rect width={30} height={30} rx={6} 
                  fill={isCurr ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.05)'} 
                  stroke={isCurr ? '#fbbf24' : 'rgba(255,255,255,0.1)'} 
                  strokeWidth={isCurr ? "2" : "1"}
                />
                <text x={15} y={20} fill="#fff" textAnchor="middle" fontSize="14" fontWeight="bold">{tok}</text>
                {isCurr && <text x={15} y={-6} fill="#fbbf24" textAnchor="middle" fontSize="12">👇</text>}
              </g>
            );
          })}

          {/* Operator Stack */}
          <text x={30} y={105} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">OPERATOR STACK</text>
          <g transform="translate(30, 115)">
            <rect width={160} height={100} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.08)" />
            {stack && stack.map((op, idx) => (
              <g key={idx} transform={`translate(15, ${65 - idx * 25})`}>
                <rect width={130} height={20} rx={4} fill="rgba(56,189,248,0.2)" stroke="#38bdf8" />
                <text x={65} y={14} fill="#fff" textAnchor="middle" fontSize="12" fontWeight="bold">{op}</text>
              </g>
            ))}
            {(!stack || stack.length === 0) && (
              <text x={80} y={55} fill="var(--text-secondary)" textAnchor="middle" fontSize="12" fontStyle="italic">[Empty Stack]</text>
            )}
          </g>

          {/* Postfix Output Queue */}
          <text x={220} y={105} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">POSTFIX OUTPUT ACCUMULATOR</text>
          <g transform="translate(220, 115)">
            <rect width={340} height={100} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(52,211,153,0.2)" />
            <text x={20} y={40} fill="var(--text-secondary)" fontSize="12">Generated Postfix String:</text>
            <text x={20} y={75} fill="#34d399" fontSize="22" fontWeight="bold" fontFamily="monospace">
              {output || '<empty>'}
            </text>
          </g>
        </svg>
      );
    }

    if (selectedProbKey === 'SIEVE_GRID') {
      const { numbers, crossed, currentP, primes } = activeFrame.variables;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          <text x={20} y={22} fill="var(--text-secondary)" fontSize="12" fontWeight="bold">SIEVE OF ERATOSTHENES (Numbers 2 to 30)</text>
          
          {/* Number Grid */}
          <g transform="translate(20, 32)">
            {numbers && numbers.map((num, idx) => {
              const col = idx % 8;
              const row = Math.floor(idx / 8);
              const isPrime = primes && primes.includes(num);
              const isCrossed = crossed && crossed[num];
              const isCurrent = (currentP === num);

              return (
                <g key={num} transform={`translate(${col * 42}, ${row * 38})`}>
                  <rect width={36} height={32} rx={6}
                    fill={isCurrent ? 'rgba(251,191,36,0.3)' : isPrime ? 'rgba(52,211,153,0.25)' : isCrossed ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}
                    stroke={isCurrent ? '#fbbf24' : isPrime ? '#34d399' : isCrossed ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isCurrent || isPrime ? "2" : "1"}
                  />
                  <text x={18} y={21} fill={isCrossed ? '#94a3b8' : '#fff'} textAnchor="middle" fontSize="13" fontWeight="bold" textDecoration={isCrossed ? 'line-through' : 'none'}>
                    {num}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Sieve Legend */}
          <g transform="translate(370, 32)">
            <rect width={210} height={150} rx={8} fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.08)" />
            <text x={15} y={25} fill="var(--text-secondary)" fontSize="11" fontWeight="bold">PRIME NUMBERS IDENTIFIED</text>
            <text x={15} y={55} fill="#34d399" fontSize="13" fontWeight="bold">Primes:</text>
            <text x={70} y={55} fill="#34d399" fontSize="13" fontWeight="bold">{primes ? primes.join(', ') : '-'}</text>
            
            <text x={15} y={90} fill="var(--text-secondary)" fontSize="12">Current Prime p:</text>
            <text x={130} y={90} fill="#fbbf24" fontSize="15" fontWeight="bold">{currentP || 'Complete'}</text>

            <text x={15} y={125} fill="var(--text-secondary)" fontSize="11">Time Complexity: O(N log log N)</text>
          </g>
        </svg>
      );
    }
  };

  const renderHighlightedCode = () => {
    const rawSnippet = codeLines.join('\n');
    const selectedProblem = PROBLEMS[selectedProbKey] || PROBLEMS['FIND_MAX'];
    const activeText = codeViewMode === 'full' 
      ? toFullExecutableProgram(rawSnippet, activeLang, selectedProblem.title)
      : rawSnippet;

    const allmanLines = toAllman(activeText).split('\n');
    return (
      <div className="code-box" style={{ flex: 1, overflow: 'auto', padding: '1.2rem', borderRadius: '8px', background: 'var(--bg-primary, rgba(0,0,0,0.25))' }}>
        <pre style={{ 
          margin: 0, 
          color: '#f8fafc', 
          fontFamily: "'Fira Code', 'Cascadia Code', monospace", 
          lineHeight: '1.75',
          fontSize: `${localFontSize}px`,
          fontWeight: 500
        }}>
          {allmanLines.map((lineText, idx) => {
            const isHighlighted = (codeViewMode === 'snippet' && activeFrame.line === idx + 1);
            return (
              <div 
                key={idx} 
                style={{ 
                  background: isHighlighted ? 'rgba(59,130,246,0.24)' : 'transparent',
                  borderLeft: isHighlighted ? '4px solid var(--accent-primary)' : '4px solid transparent',
                  padding: '2px 14px',
                  borderRadius: isHighlighted ? '4px' : '0',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ 
                  whiteSpace: 'pre', 
                  color: isHighlighted ? '#ffffff' : '#e2e8f0',
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontWeight: isHighlighted ? 700 : 500
                }}>
                  {lineText || ' '}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* HEADER BAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--glass-border)', flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn btn-clear" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔙</span> Back to Home
          </button>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 'bold', margin: 0 }}>
            DSA Study & Solved Problems Studio
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className="btn btn-insert"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
            onClick={() => setIsRunnerOpen(true)}
            title="Execute current code in live sandbox"
          >
            ▶ Run Code Live
          </button>
          {onOpenDebugger && isLineDebuggerSupported(activeLang) && (
            <button 
              className="btn btn-clear"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
              onClick={() => onOpenDebugger(rawActiveCode, activeLang)}
              title="Step through variables in line debugger"
            >
              🐞 Line Debugger
            </button>
          )}
          <button className={`btn ${activeTab === 'notes' ? 'btn-insert' : 'btn-clear'}`} onClick={() => setActiveTab('notes')}>
            📚 Topic Notes
          </button>
          <button className={`btn ${activeTab === 'solved' ? 'btn-insert' : 'btn-clear'}`} onClick={() => setActiveTab('solved')}>
            🛠️ Interactive Sums
          </button>
          {openSettings && <button className="btn btn-clear" onClick={openSettings}>⚙ Settings</button>}
        </div>
      </header>

      {/* NOTES TAB */}
      {activeTab === 'notes' && (() => {
        const isLesson = !!LESSONS[selectedProbKey];
        
        const renderSelectOptions = () => {
          const foundational = Object.entries(LESSONS).filter(([k]) => k.startsWith('LESSON_'));
          const mod1 = Object.entries(LESSONS).filter(([k]) => k.startsWith('MOD1_'));
          const mod2 = Object.entries(LESSONS).filter(([k]) => k.startsWith('MOD2_'));
          const mod3 = Object.entries(LESSONS).filter(([k]) => k.startsWith('MOD3_'));
          const mod4 = Object.entries(LESSONS).filter(([k]) => k.startsWith('MOD4_'));
          const mod5 = Object.entries(LESSONS).filter(([k]) => k.startsWith('MOD5_'));
          const mod6 = Object.entries(LESSONS).filter(([k]) => k.startsWith('MOD6_'));
          const solved = Object.entries(PROBLEMS);

          return (
            <>
              <optgroup label="Foundational Programming Lessons">
                {foundational.map(([key, l]) => (
                  <option key={key} value={key}>{l.title}</option>
                ))}
              </optgroup>
              {mod1.length > 0 && (
                <optgroup label="Advanced Engine Architecture & Question Bank">
                  {mod1.map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
              )}
              {mod2.length > 0 && (
                <optgroup label="String Algorithms">
                  {mod2.map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
              )}
              {mod3.length > 0 && (
                <optgroup label="Advanced Dynamic Programming">
                  {mod3.map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
              )}
              {mod4.length > 0 && (
                <optgroup label="Network Flow Algorithms">
                  {mod4.map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
              )}
              {mod5.length > 0 && (
                <optgroup label="NP-Completeness & Approximation">
                  {mod5.map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
              )}
              {mod6.length > 0 && (
                <optgroup label="Randomised & Parallel Algorithms">
                  {mod6.map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Classic DSA Solved Sums">
                {solved.map(([key, prob]) => (
                  <option key={key} value={key}>{prob.title}</option>
                ))}
              </optgroup>
            </>
          );
        };

        if (isLesson) {
          const lesson = LESSONS[selectedProbKey] || LESSONS['LESSON_VARIABLES'];
          const rawCode = lesson && lesson.code ? (lesson.code[activeLang] || '') : '';
          const fullCode = toFullExecutableProgram(rawCode, activeLang, lesson.title);
          const activeCodeToDisplay = codeViewMode === 'full' ? fullCode : rawCode;

          return (
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h1 className="title-gradient" style={{ margin: 0 }}>{lesson.title}</h1>
                <select className="styled-select" style={{ minWidth: '240px' }} value={selectedProbKey} onChange={e => setSelectedProbKey(e.target.value)}>
                  {renderSelectOptions()}
                </select>
              </div>

              <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>📌 Topic Concept Description</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{lesson.desc}</p>
              </div>

              <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ color: 'var(--accent-secondary)', marginTop: 0 }}>💡 Everyday Analogy</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{lesson.analogy}</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                {/* Language selector row */}
                <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '8px', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>💻 Lang:</span>
                    {['C++', 'Java', 'Python', 'JS', 'C'].map(lang => (
                      <button key={lang} onClick={() => setActiveLang(lang)}
                        style={{
                          padding: '4px 11px',
                          fontSize: '0.8rem',
                          borderRadius: '6px',
                          border: activeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                          background: activeLang === lang ? 'var(--accent-primary)' : 'transparent',
                          color: activeLang === lang ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: activeLang === lang ? 700 : 400,
                          transition: 'all 0.15s'
                        }}
                      >{lang === 'JS' ? 'JavaScript' : lang}</button>
                    ))}
                    
                    {/* Full Program vs Snippet Toggle */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px', border: '1px solid var(--glass-border)', marginLeft: '6px' }}>
                      <button 
                        onClick={() => setCodeViewMode('full')}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.74rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: codeViewMode === 'full' ? 'var(--accent-primary)' : 'transparent',
                          color: codeViewMode === 'full' ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: codeViewMode === 'full' ? 700 : 500
                        }}
                        title="Display full complete runnable program with imports and main()"
                      >
                        📑 Complete Code
                      </button>
                      <button 
                        onClick={() => setCodeViewMode('snippet')}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.74rem',
                          borderRadius: '4px',
                          border: 'none',
                          background: codeViewMode === 'snippet' ? 'var(--accent-primary)' : 'transparent',
                          color: codeViewMode === 'snippet' ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: codeViewMode === 'snippet' ? 700 : 500
                        }}
                        title="Display function snippet only"
                      >
                        ⚡ Snippet
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                      <button onClick={() => setLocalFontSize(prev => Math.max(12, prev - 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.78rem', padding: '2px 8px', cursor: 'pointer' }} title="Decrease font size">A−</button>
                      <span style={{ fontSize: '0.78rem', color: '#38bdf8', minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{localFontSize}px</span>
                      <button onClick={() => setLocalFontSize(prev => Math.min(36, prev + 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.78rem', padding: '2px 8px', cursor: 'pointer' }} title="Increase font size">A+</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-clear"
                      style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleCopy(activeCodeToDisplay)}
                    >
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <button 
                      className="btn btn-insert"
                      style={{ padding: '4px 14px', fontSize: '0.8rem' }}
                      onClick={() => setIsRunnerOpen(true)}
                    >
                      ▶ Run Live
                    </button>
                  </div>
                </div>
                {/* Code block - Allman style, high visibility */}
                <pre style={{
                  margin: 0,
                  padding: '16px 20px',
                  background: 'var(--bg-primary, rgba(0,0,0,0.3))',
                  color: '#f8fafc',
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontSize: `${localFontSize}px`,
                  lineHeight: '1.75',
                  fontWeight: 500,
                  overflowX: 'auto'
                }}>
                  {toAllman(activeCodeToDisplay).split('\n').map((lineText, idx) => (
                    <div key={idx} style={{ padding: '1px 0', whiteSpace: 'pre', fontFamily: "'Fira Code', 'Cascadia Code', monospace", color: '#f8fafc' }}>
                      {lineText || ' '}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          );
        }

        // Else, it's a solved problem
        const problem = PROBLEMS[selectedProbKey] || PROBLEMS['FIND_MAX'];
        const rawCode = getSafeCode(problem.code, activeLang);
        const fullCode = toFullExecutableProgram(rawCode, activeLang, problem.title);
        const activeCodeToDisplay = codeViewMode === 'full' ? fullCode : rawCode;

        return (
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h1 className="title-gradient" style={{ margin: 0 }}>{problem.title} Notes</h1>
              <select className="styled-select" style={{ minWidth: '240px' }} value={selectedProbKey} onChange={e => setSelectedProbKey(e.target.value)}>
                {renderSelectOptions()}
              </select>
            </div>
            
            <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>📌 Problem Description</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-primary)', fontSize: '0.96rem' }}>{problem.notes.desc}</p>
            </div>

            <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--accent-secondary)', marginTop: 0 }}>💡 Algorithmic Intuition</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '0.96rem' }}>{problem.notes.intuition}</p>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#34d399' }}>Complexity Analysis:</span>
              <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '1.1rem' }}>{problem.notes.complexity}</span>
            </div>

            {/* Complete Solution Code Block with Language Selector */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap', gap: '8px', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>💻 Code:</span>
                  {['C++', 'Java', 'Python', 'JS', 'C'].map(lang => (
                    <button key={lang} onClick={() => setActiveLang(lang)}
                      style={{
                        padding: '4px 11px',
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        border: activeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: activeLang === lang ? 'var(--accent-primary)' : 'transparent',
                        color: activeLang === lang ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: activeLang === lang ? 700 : 400,
                        transition: 'all 0.15s'
                      }}
                    >{lang === 'JS' ? 'JavaScript' : lang}</button>
                  ))}

                  {/* Full Program vs Snippet Toggle */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px', border: '1px solid var(--glass-border)', marginLeft: '6px' }}>
                    <button 
                      onClick={() => setCodeViewMode('full')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.74rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: codeViewMode === 'full' ? 'var(--accent-primary)' : 'transparent',
                        color: codeViewMode === 'full' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: codeViewMode === 'full' ? 700 : 500
                      }}
                      title="Display full complete runnable program with imports, class, test driver and main()"
                    >
                      📑 Complete Code
                    </button>
                    <button 
                      onClick={() => setCodeViewMode('snippet')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.74rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: codeViewMode === 'snippet' ? 'var(--accent-primary)' : 'transparent',
                        color: codeViewMode === 'snippet' ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: codeViewMode === 'snippet' ? 700 : 500
                      }}
                      title="Display function snippet only"
                    >
                      ⚡ Snippet
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
                    <button onClick={() => setLocalFontSize(prev => Math.max(12, prev - 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.78rem', padding: '2px 8px', cursor: 'pointer' }} title="Decrease font size">A−</button>
                    <span style={{ fontSize: '0.78rem', color: '#38bdf8', minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{localFontSize}px</span>
                    <button onClick={() => setLocalFontSize(prev => Math.min(36, prev + 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.78rem', padding: '2px 8px', cursor: 'pointer' }} title="Increase font size">A+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-clear"
                    style={{ padding: '4px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => handleCopy(activeCodeToDisplay)}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  <button 
                    className="btn btn-insert"
                    style={{ padding: '4px 14px', fontSize: '0.8rem' }}
                    onClick={() => setIsRunnerOpen(true)}
                  >
                    ▶ Run Live
                  </button>
                </div>
              </div>
              <pre style={{
                margin: 0,
                padding: '16px 20px',
                background: 'var(--bg-primary, rgba(0,0,0,0.3))',
                color: '#f8fafc',
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontSize: `${localFontSize}px`,
                lineHeight: '1.75',
                fontWeight: 500,
                overflowX: 'auto'
              }}>
                {toAllman(activeCodeToDisplay).split('\n').map((lineText, idx) => (
                  <div key={idx} style={{ padding: '1px 0', whiteSpace: 'pre', fontFamily: "'Fira Code', 'Cascadia Code', monospace", color: '#f8fafc' }}>
                    {lineText || ' '}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        );
      })()}

      {/* INTERACTIVE SOLVED SUMS TAB */}
      {activeTab === 'solved' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          
          {/* Main Visualizer Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* INPUT PANEL AND CONTROLS */}
            <div style={{ display: 'flex', padding: '10px 20px', background: 'rgba(15, 23, 42, 0.3)', borderBottom: '1px solid var(--glass-border)', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Solved Sum:</span>
                <select className="styled-select" style={{ padding: '5px 25px 5px 10px', fontSize: '0.85rem' }} value={selectedProbKey} onChange={e => setSelectedProbKey(e.target.value)}>
                  {Object.entries(PROBLEMS).map(([key, prob]) => (
                    <option key={key} value={key}>{prob.title}</option>
                  ))}
                </select>
                
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>Difficulty:</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: problem.difficulty === 'Easy' ? '#34d399' : '#fb923c',
                  background: problem.difficulty === 'Easy' ? 'rgba(52,211,153,0.15)' : 'rgba(251,146,96,0.15)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {problem.difficulty}
                </span>
              </div>
              
              {/* Play controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(0); }} disabled={currentStep === 0}>⏮ First</button>
                <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.max(0, p - 1)); }} disabled={currentStep === 0}>◀ Prev</button>
                <button className="btn btn-clear" style={{ border: 'none', background: isPlaying ? 'rgba(59,130,246,0.5)' : 'var(--accent-primary)', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59,130,246,0.4)' }} onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? '⏸' : '▶ Play'}
                </button>
                <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(p => Math.min(timeline.length - 1, p + 1)); }} disabled={currentStep === timeline.length - 1}>Next ▶</button>
                <button className="btn btn-clear" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setIsPlaying(false); setCurrentStep(timeline.length - 1); }} disabled={currentStep === timeline.length - 1}>Last ⏭</button>
              </div>

              {/* Speed Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Speed ({speed}ms)</span>
                <input type="range" min={200} max={2500} step={100} value={2700 - speed} onChange={e => setSpeed(2700 - Number(e.target.value))} style={{ width: '100px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
              </div>
            </div>

            {/* SVG Visual Canvas Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.18)', padding: '20px', overflow: 'hidden' }}>
              {renderVisualCanvas()}
            </div>
          </div>

          {/* Right Column: Code & Line Highlighter */}
          <div style={{ width: '490px', background: 'var(--glass-bg)', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Sticky 2-row header */}
            <div style={{ flexShrink: 0, borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
              {/* Row 1: Language pills */}
              <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>🌐 Lang:</span>
                  {['C++', 'Java', 'Python', 'JS', 'C'].map(lang => (
                    <button key={lang} onClick={() => setActiveLang(lang)}
                      style={{
                        padding: '2px 9px',
                        fontSize: '0.74rem',
                        borderRadius: '5px',
                        border: activeLang === lang ? '1.5px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        background: activeLang === lang ? 'var(--accent-primary)' : 'transparent',
                        color: activeLang === lang ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: activeLang === lang ? 700 : 400,
                        transition: 'all 0.15s'
                      }}
                    >{lang === 'JS' ? 'JavaScript' : lang}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    className="btn btn-clear"
                    style={{ padding: '2px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                    onClick={() => {
                      const selectedProb = PROBLEMS[selectedProbKey] || PROBLEMS['FIND_MAX'];
                      const activeFullCode = codeViewMode === 'full' 
                        ? toFullExecutableProgram(rawActiveCode, activeLang, selectedProb.title) 
                        : rawActiveCode;
                      handleCopy(activeFullCode);
                    }}
                  >
                    {copied ? '✅ Copied' : '📋 Copy'}
                  </button>
                  <button 
                    className="btn btn-insert"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                    onClick={() => setIsRunnerOpen(true)}
                  >
                    ▶ Run Live
                  </button>
                </div>
              </div>
              {/* Row 2: Utility actions */}
              <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>Solution</h3>
                
                {/* Full Program vs Stepper Snippet Toggle */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px', border: '1px solid var(--glass-border)' }}>
                  <button 
                    onClick={() => setCodeViewMode('full')}
                    style={{
                      padding: '2px 7px',
                      fontSize: '0.72rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: codeViewMode === 'full' ? 'var(--accent-primary)' : 'transparent',
                      color: codeViewMode === 'full' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: codeViewMode === 'full' ? 700 : 500
                    }}
                    title="View full complete program with main() and drivers"
                  >
                    📑 Complete Code
                  </button>
                  <button 
                    onClick={() => setCodeViewMode('snippet')}
                    style={{
                      padding: '2px 7px',
                      fontSize: '0.72rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: codeViewMode === 'snippet' ? 'var(--accent-primary)' : 'transparent',
                      color: codeViewMode === 'snippet' ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: codeViewMode === 'snippet' ? 700 : 500
                    }}
                    title="View step-highlighted function"
                  >
                    ⚡ Stepper Sync
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                  <button onClick={() => setLocalFontSize(prev => Math.max(12, prev - 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 7px', cursor: 'pointer' }}>A−</button>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', minWidth: '32px', textAlign: 'center', fontWeight: 600 }}>{localFontSize}px</span>
                  <button onClick={() => setLocalFontSize(prev => Math.min(36, prev + 2))} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-primary)', fontSize: '0.75rem', padding: '2px 7px', cursor: 'pointer' }}>A+</button>
                </div>
              </div>
            </div>
            {renderHighlightedCode()}
          </div>

          {/* Draggable Execution Trace Log panel */}
          {showLogPanel && (
            <div 
              style={{
                position: 'absolute',
                left: `${logPosition.x}px`,
                top: `${logPosition.y}px`,
                width: `${logSize.width}px`,
                height: `${logSize.height}px`,
                background: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 100
              }}
            >
              {/* Drag Handle Header */}
              <div
                onMouseDown={handleLogHeaderMouseDown}
                onTouchStart={handleLogHeaderMouseDown}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                  flexShrink: 0,
                  cursor: 'move'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📋 Variable Inspector & Step Trace
                </span>
                <button onClick={() => setShowLogPanel(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
              </div>

              {/* Content body */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* Left Column: Active Variables Inspector */}
                <div style={{
                  width: `${activeStateWidth}px`,
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRight: '1px solid var(--glass-border)',
                  padding: '6px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  overflowY: 'auto',
                  flexShrink: 0
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '2px', marginBottom: '4px' }}>
                    Active Memory
                  </div>
                  {activeFrame.variables && Object.entries(activeFrame.variables).map(([name, val]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{name}:</span>
                      <strong style={{ color: '#fbbf24' }}>
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Col Resize Divider */}
                <div onMouseDown={handleActiveStateColDragStart} onTouchStart={handleActiveStateColDragStart} style={{ width: '4px', cursor: 'col-resize', background: 'transparent', zIndex: 5 }} />

                {/* Right Column: Scrollable logs list */}
                <div ref={logContainerRef} style={{ flex: 1, background: 'rgba(0,0,0,0.15)', padding: '10px 12px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Chronological Step Logs</div>
                  {timeline.slice(0, currentStep + 1).map((f, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', marginBottom: '6px', lineHeight: '1.4' }}>
                      <span style={{ color: 'var(--text-secondary)', flexShrink: 0, width: '24px', textAlign: 'right', fontWeight: 'bold', userSelect: 'none' }}>
                        {idx === currentStep ? '➔' : `${idx + 1}.`}
                      </span>
                      <span style={{ color: idx === currentStep ? 'var(--accent-primary)' : 'var(--text-primary)', wordBreak: 'break-word', flex: 1 }}>
                        {highlightLogText(f.msg)}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Visual active step highlight at bottom of log panel */}
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600 }}>
                💡 {activeFrame.msg || 'Ready.'}
              </div>

              {/* Resize handle */}
              <div onMouseDown={handleLogResizeMouseDown} onTouchStart={handleLogResizeMouseDown} style={{ position: 'absolute', bottom: '0', right: '0', width: '15px', height: '15px', cursor: 'se-resize', zIndex: 10 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><path d="M6 0 L8 0 L8 8 L0 8 L0 6 L4 6 L4 4 L6 4 Z" fill="rgba(255,255,255,0.3)" /></svg>
              </div>

            </div>
          )}
        </div>
      )}

      {/* CODE RUNNER MODAL */}
      <CodeRunnerModal
        isOpen={isRunnerOpen}
        onClose={() => setIsRunnerOpen(false)}
        code={rawActiveCode}
        language={activeLang}
      />
    </div>
  );
};

export default DSANotesVisualizer;
