import React, { useState, useEffect } from 'react';

export default function LanguageQuirksExceptions({ selectedLang = 'C' }) {
  const getMappedLang = (l) => {
    const up = (l || 'C').toUpperCase();
    if (up === 'JS' || up === 'JAVASCRIPT' || up === 'FRONTEND') return 'JS';
    if (up === 'PYTHON') return 'Python';
    if (up === 'JAVA') return 'Java';
    return 'C';
  };

  const [activeLangTab, setActiveLangTab] = useState(() => getMappedLang(selectedLang));
  const [activeQuirkIndex, setActiveQuirkIndex] = useState(0);
  const [simulatorState, setSimulatorState] = useState('normal'); // 'normal', 'trap', 'fixed'

  useEffect(() => {
    setActiveLangTab(getMappedLang(selectedLang));
    setActiveQuirkIndex(0);
    setSimulatorState('normal');
  }, [selectedLang]);

  const quirksData = {
    Java: {
      title: '☕ Java Quirks, References & Exceptions',
      icon: '☕',
      color: '#f97316',
      items: [
        {
          id: 'pointers',
          title: '1. "Where are Pointers in Java?" (References vs Pointers)',
          concept: 'Java has NO explicit pointer arithmetic (no int* p or &var like C), but ALL object variables are secret pointers called REFERENCES!',
          codeTrap: `String name = null;\nSystem.out.println(name.length()); // 💥 CRASH! NullPointerException`,
          codeFix: `String name = "AlgoFlow";\nif (name != null) {\n    System.out.println(name.length()); // ✅ Safe: 8\n}`,
          explanation: 'In Java, primitive types (int, double, boolean) store values directly in memory. Objects (String, Scanner, Arrays) store a memory reference. Accessing a method on a reference pointing to null throws java.lang.NullPointerException (NPE).'
        },
        {
          id: 'equality',
          title: '2. String Comparison: == vs .equals()',
          concept: '== compares memory reference addresses, while .equals() compares the actual string content!',
          codeTrap: `String a = new String("hello");\nString b = new String("hello");\nSystem.out.println(a == b); // ❌ false! (Different memory addresses)`,
          codeFix: `String a = new String("hello");\nString b = new String("hello");\nSystem.out.println(a.equals(b)); // ✅ true! (Same content)`,
          explanation: 'Using == on objects in Java checks if two variables point to the exact same spot in RAM, not if their text is identical!'
        },
        {
          id: 'primitives',
          title: '3. Primitive vs Wrapper Types (int vs Integer)',
          concept: 'int is a primitive value (fast, light), Integer is an Object wrapper (can be null, stored on Heap).',
          codeTrap: `Integer count = null;\nint total = count + 5; // 💥 NullPointerException via Auto-unboxing!`,
          codeFix: `Integer count = 10;\nint total = (count != null ? count : 0) + 5; // ✅ Safe: 15`,
          explanation: 'Java automatically converts between int and Integer (autoboxing). But if an Integer is null and Java tries to convert it to an int, it crashes with NPE.'
        }
      ]
    },
    Python: {
      title: '🐍 Python Quirks, Indentation & Syntax Rules',
      icon: '🐍',
      color: '#3b82f6',
      items: [
        {
          id: 'indentation',
          title: '1. Strict Indentation Rules (No Curly Braces {})',
          concept: 'Python uses whitespace indentation (4 spaces) instead of { } braces to define code blocks!',
          codeTrap: `def check_number(num):\nif num > 0:\nprint("Positive") # 💥 IndentationError: expected an indented block`,
          codeFix: `def check_number(num):\n    if num > 0:\n        print("Positive") # ✅ Perfectly aligned with 4 spaces`,
          explanation: 'Mixing tabs and spaces or missing indentation causes IndentationError or unexpected logic bugs because Python determines function boundaries purely by indentation!'
        },
        {
          id: 'mutable_default',
          title: '2. The Mutable Default Argument Trap',
          concept: 'Default argument values in Python functions are created ONCE when the function is defined, not every time it is called!',
          codeTrap: `def add_item(item, list_arr=[]):\n    list_arr.append(item)\n    return list_arr\n\nprint(add_item("A")) # ['A']\nprint(add_item("B")) # ❌ Unexpected: ['A', 'B'] (Reuses same list!)`,
          codeFix: `def add_item(item, list_arr=None):\n    if list_arr is None:\n        list_arr = [] # ✅ Creates a new list each invocation\n    list_arr.append(item)\n    return list_arr`,
          explanation: 'Default mutable objects (lists, dicts) persist state across multiple function calls. Always use None as the default value instead.'
        },
        {
          id: 'is_vs_equal',
          title: '3. Identity (is) vs Equality (==)',
          concept: '== compares values, while `is` checks if two variables point to the exact same object in memory.',
          codeTrap: `list1 = [1, 2, 3]\nlist2 = [1, 2, 3]\nprint(list1 == list2) # True (Same values)\nprint(list1 is list2) # ❌ False (Different memory objects)`,
          codeFix: `list1 = [1, 2, 3]\nlist2 = list1\nprint(list1 is list2) # ✅ True (Points to exact same object)`,
          explanation: 'Use == for comparing data values (numbers, strings, lists). Use `is` only for checking identity, such as checking `x is None`.'
        }
      ]
    },
    C: {
      title: '⚙️ C Language Pointers, Manual Memory & Segmentation Faults',
      icon: '⚙️',
      color: '#a855f7',
      items: [
        {
          id: 'pointers_c',
          title: '1. Manual Pointers & Addresses (& and *)',
          concept: 'C gives direct access to computer RAM addresses using pointer variables (int* p).',
          codeTrap: `int *ptr = NULL;\n*ptr = 100; // 💥 Segmentation Fault (Access Violation)!`,
          codeFix: `int val = 42;\nint *ptr = &val; // ✅ Point to valid memory address of val\n*ptr = 100; // val is now 100`,
          explanation: 'Dereferencing an uninitialized or NULL pointer in C causes a Segmentation Fault (the OS kills your program for reading invalid RAM).'
        },
        {
          id: 'malloc_free',
          title: '2. Memory Leaks (malloc without free)',
          concept: 'In C, memory allocated dynamically with malloc() must be manually released with free()!',
          codeTrap: `void process() {\n    int *arr = (int*)malloc(1000 * sizeof(int));\n    // ❌ Missing free(arr); Memory leaks every time function runs!\n}`,
          codeFix: `void process() {\n    int *arr = (int*)malloc(1000 * sizeof(int));\n    // Use arr...\n    free(arr); // ✅ Memory returned to Operating System\n}`,
          explanation: 'C has no Garbage Collector. Forgetting free() causes memory leaks that consume all RAM until the system crashes.'
        }
      ]
    },
    JS: {
      title: '🌐 Frontend (HTML/CSS/JS) Scope & Type Quirks',
      icon: '🌐',
      color: '#eab308',
      items: [
        {
          id: 'equality_js',
          title: '1. Loose Equality (==) vs Strict Equality (===)',
          concept: '== converts types automatically (type coercion), leading to bizarre results. Always use ===!',
          codeTrap: `console.log(5 == "5");     // true (Coerces string to number)\nconsole.log(0 == false);   // true\nconsole.log("" == false);  // ❌ true (Confusing!)`,
          codeFix: `console.log(5 === "5");    // ✅ false (Different types: number vs string)\nconsole.log(0 === false);  // ✅ false`,
          explanation: 'Strict equality === checks both value AND data type without silent type conversions.'
        },
        {
          id: 'typeof_null',
          title: '2. Historical Quirks: typeof null === "object" & NaN',
          concept: 'JavaScript has historical legacy bugs from 1995 that remain for backwards compatibility.',
          codeTrap: `console.log(typeof null); // ❌ "object" (1995 JS Bug! null is primitive)\nconsole.log(NaN === NaN); // ❌ false! (NaN is not equal to itself)`,
          codeFix: `let val = null;\nconsole.log(val === null); // ✅ Safe check\nconsole.log(Number.isNaN(NaN)); // ✅ Safe check`,
          explanation: 'In early JS implementations, type tags for objects were 0, and null had a 0 NULL pointer tag, leading to `typeof null === "object"`.'
        }
      ]
    }
  };

  const currentQuirksGroup = quirksData[activeLangTab] || quirksData.Java;
  const currentQuirk = currentQuirksGroup.items[activeQuirkIndex] || currentQuirksGroup.items[0];



  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '16px',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      padding: '24px',
      color: '#e2e8f0',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Module Title */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>⚠️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#38bdf8' }}>
              Module 4: Language Quirks, Exceptions & Syntax Rules
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
              Every programming language has hidden traps! Learn about Java null pointers, Python indentation rules, C manual pointers, and Frontend (HTML/CSS/JS) type coercion.
            </p>
          </div>
        </div>
      </div>

      {/* Active Language Badge Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{
          background: quirksData[activeLangTab]?.color || '#0284c7',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '6px 14px',
          borderRadius: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}>
          {quirksData[activeLangTab]?.icon || '🌐'} Showing Quirks for {activeLangTab === 'JS' ? 'Frontend (HTML/CSS/JS)' : activeLangTab}
        </span>
      </div>

      {/* Main Quirk Card */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '14px',
        padding: '20px',
        border: `1px solid ${currentQuirksGroup.color}`
      }}>
        {/* Quirk Topics Sub-Nav */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {currentQuirksGroup.items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveQuirkIndex(idx);
                setSimulatorState('normal');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: activeQuirkIndex === idx ? `1.5px solid ${currentQuirksGroup.color}` : '1px solid #334155',
                background: activeQuirkIndex === idx ? '#1e293b' : '#0f172a',
                color: activeQuirkIndex === idx ? '#fff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Selected Quirk Header */}
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#f8fafc' }}>
          {currentQuirk.title}
        </h3>
        <p style={{ fontSize: '13.5px', color: '#fbbf24', fontWeight: '600', margin: '0 0 16px 0', lineHeight: '1.5' }}>
          💡 {currentQuirk.concept}
        </p>

        {/* Code Comparison Grid (Trap vs Fix) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Trap Box */}
          <div style={{
            background: '#0f172a',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #ef4444'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f87171' }}>
                ❌ Common Beginner Trap / Exception:
              </span>
            </div>
            <pre style={{
              margin: 0,
              padding: '12px',
              background: '#1e1e2e',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '12.5px',
              fontFamily: 'monospace',
              overflowX: 'auto'
            }}>
              {currentQuirk.codeTrap}
            </pre>
          </div>

          {/* Fix Box */}
          <div style={{
            background: '#0f172a',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid #10b981'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#34d399' }}>
                ✅ Correct Solution & Best Practice:
              </span>
            </div>
            <pre style={{
              margin: 0,
              padding: '12px',
              background: '#1e1e2e',
              borderRadius: '8px',
              color: '#6ee7b7',
              fontSize: '12.5px',
              fontFamily: 'monospace',
              overflowX: 'auto'
            }}>
              {currentQuirk.codeFix}
            </pre>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '14px 18px',
          borderRadius: '10px',
          border: '1px solid #334155',
          fontSize: '13px',
          color: '#cbd5e1',
          lineHeight: '1.6'
        }}>
          <strong style={{ color: '#38bdf8' }}>📖 Why does this happen?</strong>
          <p style={{ margin: '4px 0 0 0' }}>{currentQuirk.explanation}</p>
        </div>

        {/* Interactive Simulator / Exception Trigger Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => setSimulatorState('trap')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#dc2626',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              💥 Run Trap Code (Simulate Error)
            </button>
            <button
              onClick={() => setSimulatorState('fixed')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#059669',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              ✅ Run Fixed Code (Safe Execution)
            </button>
          </div>

          {simulatorState === 'trap' && (
            <div style={{
              marginTop: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '12.5px',
              fontWeight: 'bold'
            }}>
              🚨 EXCEPTION TRIGGERED: Code failed execution due to unsafe language usage! Notice the trap above.
            </div>
          )}

          {simulatorState === 'fixed' && (
            <div style={{
              marginTop: '14px',
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid #34d399',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#34d399',
              fontSize: '12.5px',
              fontWeight: 'bold'
            }}>
              🎉 SUCCESS: Execution completed safely without exceptions or bugs!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
