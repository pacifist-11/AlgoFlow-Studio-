/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';

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
  }
};

// ─── VISUALIZER COMPONENTS ───────────────────────────────────────────────────
const DSANotesVisualizer = ({ onBack, openSettings, fontSize = 14, wordWrap = 'off', onShowUpcomingFeatures }) => {
  const [selectedProbKey, setSelectedProbKey] = useState('LESSON_VARIABLES');
  const [activeLang, setActiveLang] = useState('JS');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'solved'
  const [localFontSize, setLocalFontSize] = useState(fontSize);

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

  const isLesson = selectedProbKey.startsWith('LESSON_');
  const problem = isLesson 
    ? { 
        title: LESSONS[selectedProbKey].title, 
        difficulty: "Lesson", 
        category: "Theory", 
        notes: { desc: LESSONS[selectedProbKey].desc, intuition: LESSONS[selectedProbKey].analogy, complexity: "N/A" }, 
        code: LESSONS[selectedProbKey].code, 
        generator: () => [] 
      } 
    : PROBLEMS[selectedProbKey];

  const codeLines = problem.code && problem.code[activeLang] ? problem.code[activeLang].split('\n') : [];

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
  };

  const renderHighlightedCode = () => {
    const allmanLines = toAllman(codeLines.join('\n')).split('\n');
    return (
      <div className="code-box" style={{ flex: 1, overflow: 'auto', padding: '1rem', borderRadius: '8px' }}>
        <pre style={{ 
          margin: 0, 
          color: 'var(--text-primary)', 
          fontFamily: "'Fira Code', monospace", 
          lineHeight: '1.6',
          fontSize: `${localFontSize}px`
        }}>
          {allmanLines.map((lineText, idx) => {
            const isHighlighted = (activeFrame.line === idx + 1);
            return (
              <div 
                key={idx} 
                style={{ 
                  background: isHighlighted ? 'rgba(59,130,246,0.16)' : 'transparent',
                  borderLeft: isHighlighted ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  padding: '1px 12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ 
                  whiteSpace: 'pre',
                  color: isHighlighted ? '#ffffff' : 'var(--text-primary)',
                  fontFamily: "'Fira Code', monospace"
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
        <div style={{ display: 'flex', gap: '8px' }}>
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
        const isLesson = selectedProbKey.startsWith('LESSON_');
        if (isLesson) {
          const lesson = LESSONS[selectedProbKey];
          return (
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h1 className="title-gradient" style={{ margin: 0 }}>{lesson.title}</h1>
                <select className="styled-select" style={{ minWidth: '240px' }} value={selectedProbKey} onChange={e => setSelectedProbKey(e.target.value)}>
                  <optgroup label="Foundational Programming Lessons">
                    {Object.entries(LESSONS).map(([key, l]) => (
                      <option key={key} value={key}>{l.title}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Classic DSA Solved Sums">
                    {Object.entries(PROBLEMS).map(([key, prob]) => (
                      <option key={key} value={key}>{prob.title}</option>
                    ))}
                  </optgroup>
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
                <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid var(--glass-border)', flexWrap: 'wrap', background: 'var(--bg-secondary)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>💻 Lang:</span>
                  {['JS', 'Python', 'C++', 'Java'].map(lang => (
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
                {/* Code block - Allman style, no line numbers */}
                <pre style={{
                  margin: 0,
                  padding: '12px 16px',
                  background: 'var(--bg-primary, rgba(0,0,0,0.18))',
                  color: 'var(--text-primary)',
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.86rem',
                  lineHeight: '1.6',
                  overflowX: 'auto'
                }}>
                  {toAllman(lesson.code[activeLang] || '').split('\n').map((lineText, idx) => (
                    <div key={idx} style={{ padding: '1px 0', whiteSpace: 'pre', fontFamily: "'Fira Code', monospace", color: 'var(--text-primary)' }}>
                      {lineText || ' '}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          );
        }

        // Else, it's a solved problem
        const problem = PROBLEMS[selectedProbKey];
        return (
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h1 className="title-gradient" style={{ margin: 0 }}>{problem.title} Notes</h1>
              <select className="styled-select" style={{ minWidth: '240px' }} value={selectedProbKey} onChange={e => setSelectedProbKey(e.target.value)}>
                <optgroup label="Foundational Programming Lessons">
                  {Object.entries(LESSONS).map(([key, l]) => (
                    <option key={key} value={key}>{l.title}</option>
                  ))}
                </optgroup>
                <optgroup label="Classic DSA Solved Sums">
                  {Object.entries(PROBLEMS).map(([key, prob]) => (
                    <option key={key} value={key}>{prob.title}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>📌 Problem Description</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>{problem.notes.desc}</p>
            </div>

            <div style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--accent-secondary)', marginTop: 0 }}>💡 Algorithmic Intuition</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{problem.notes.intuition}</p>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#34d399' }}>Complexity Analysis:</span>
              <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '1.1rem' }}>{problem.notes.complexity}</span>
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
                  <optgroup label="Foundational Programming Lessons">
                    {Object.entries(LESSONS).map(([key, l]) => (
                      <option key={key} value={key}>{l.title}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Classic DSA Solved Sums">
                    {Object.entries(PROBLEMS).map(([key, prob]) => (
                      <option key={key} value={key}>{prob.title}</option>
                    ))}
                  </optgroup>
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
          <div style={{ width: '420px', background: 'var(--glass-bg)', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Sticky 2-row header */}
            <div style={{ flexShrink: 0, borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
              {/* Row 1: Language pills */}
              <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>🌐 Lang:</span>
                {['JS', 'Python', 'C++', 'Java'].map(lang => (
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
              {/* Row 2: Utility actions */}
              <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Solved Solution</h3>
                <button onClick={() => setLocalFontSize(prev => Math.max(10, prev - 2))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.73rem', padding: '1px 6px', cursor: 'pointer' }}>A−</button>
                <button onClick={() => setLocalFontSize(prev => Math.min(40, prev + 2))} style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.73rem', padding: '1px 6px', cursor: 'pointer' }}>A+</button>
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

    </div>
  );
};

export default DSANotesVisualizer;
