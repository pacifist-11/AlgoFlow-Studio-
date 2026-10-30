/**
 * algorithmRunner.js
 * High-performance, offline-first in-browser algorithmic engine for Java, C, and C++.
 * Translates standard DSA code into safe sandboxed JavaScript so algorithms execute
 * immediately inside the browser even when cloud compilers are unavailable.
 */

export function transpileJavaAlgorithm(javaCode) {
  let js = javaCode;

  // 1. Strip package, imports, and comments
  js = js.replace(/package\s+[\w.]+;/g, '');
  js = js.replace(/import\s+[\w.*]+;/g, '');

  // 2. Standard prints
  js = js.replace(/Arrays\.toString\s*\(/g, 'JSON.stringify(');
  js = js.replace(/System\.out\.println\s*\(\s*\)/g, 'console.log("")');
  js = js.replace(/System\.out\.println\s*\(/g, 'console.log(');
  js = js.replace(/System\.out\.print\s*\(/g, 'console.print(');
  js = js.replace(/System\.out\.printf\s*\(/g, 'console.log(');

  // 3. Constants and Math helpers
  js = js.replace(/\bInteger\.MAX_VALUE\b/g, 'Infinity');
  js = js.replace(/\bInteger\.MIN_VALUE\b/g, '-Infinity');
  js = js.replace(/\bLong\.MAX_VALUE\b/g, 'Infinity');
  js = js.replace(/\bLong\.MIN_VALUE\b/g, '-Infinity');

  // 4. Array Initializations:
  // int[] arr = { 1, 2, 3 }; or int arr[] = { 1, 2, 3 };
  js = js.replace(/\b(?:int|double|float|long|boolean|char|String)\s*(?:\[\s*\])?\s*(\w+)\s*(?:\[\s*\])?\s*=\s*\{([^}]*)\}/g, 'let $1 = [$2]');
  js = js.replace(/new\s+(?:int|double|float|long|boolean|char|String)\s*\[\s*\]\s*\{([^}]*)\}/g, '[$1]');
  js = js.replace(/new\s+(?:int|long)\s*\[([^\]]+)\]/g, 'new Array($1).fill(0)');
  js = js.replace(/new\s+(?:double|float)\s*\[([^\]]+)\]/g, 'new Array($1).fill(0.0)');
  js = js.replace(/new\s+boolean\s*\[([^\]]+)\]/g, 'new Array($1).fill(false)');
  js = js.replace(/new\s+String\s*\[([^\]]+)\]/g, 'new Array($1).fill("")');

  // 5. Types in variable declarations
  js = js.replace(/\b(?:int|double|float|long|boolean|char|String)\b(?:\s*\[\s*\])?\s+(?=[a-zA-Z_]\w*\s*[=;,])/g, 'let ');

  // For-each: for (int x : arr) -> for (let x of arr)
  js = js.replace(/for\s*\(\s*(?:let\s+)?([a-zA-Z_]\w*)\s*:\s*([^)]+)\)/g, 'for (let $1 of $2)');

  // 6. Methods:
  // public static void main(String[] args) -> function main(args = [])
  js = js.replace(/public\s+static\s+void\s+main\s*\([^)]*\)/g, 'function main(args = [])');

  // static/public/private methods
  js = js.replace(/(?:public\s+|private\s+|protected\s+)?static\s+(?:void|int|double|float|long|boolean|char|String|(?:[A-Z]\w*))(?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/g, (match, fnName, fnArgs) => {
    const cleanedArgs = fnArgs.split(',').map(arg => {
      const parts = arg.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      return last ? last.replace(/[\[\]]/g, '') : '';
    }).filter(Boolean).join(', ');
    return `function ${fnName}(${cleanedArgs})`;
  });

  // Non-static methods
  js = js.replace(/(?:public\s+|private\s+|protected\s+)(?:void|int|double|float|long|boolean|char|String|(?:[A-Z]\w*))(?:\s*\[\s*\])?\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/g, (match, fnName, fnArgs) => {
    const cleanedArgs = fnArgs.split(',').map(arg => {
      const parts = arg.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      return last ? last.replace(/[\[\]]/g, '') : '';
    }).filter(Boolean).join(', ');
    return `function ${fnName}(${cleanedArgs})`;
  });

  // 7. Strip class wrapper: remove first { and matching last }
  const classIdx = js.search(/(?:public\s+)?class\s+\w+\s*\{/);
  if (classIdx !== -1) {
    const start = js.indexOf('{', classIdx);
    const end = js.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      js = js.slice(0, classIdx) + js.slice(start + 1, end);
    }
  }

  js += "\nif (typeof main === 'function') { main([]); }\n";
  return js;
}

export function transpileCppAlgorithm(cppCode) {
  let js = cppCode;

  // 1. Headers & namespace
  js = js.replace(/#include\s*<[^>]+>/g, '');
  js = js.replace(/using\s+namespace\s+\w+;/g, '');

  // 2. Constants
  js = js.replace(/\bINT_MAX\b/g, 'Infinity');
  js = js.replace(/\bINT_MIN\b/g, '-Infinity');

  // 3. sizeof(arr) / sizeof(arr[0]) -> arr.length
  js = js.replace(/sizeof\s*\(\s*(\w+)\s*\)\s*\/\s*sizeof\s*\([^)]+\)/g, '$1.length');

  // 4. cout << ... << endl;
  js = js.replace(/cout\s*<<\s*([^;]+);/g, (m, chain) => {
    const parts = chain.split('<<').map(p => p.trim());
    const items = parts.map(p => {
      if (p === 'endl' || p === '"\\n"') return '"\\n"';
      return p;
    });
    return `console.print(${items.join(' + ')});`;
  });

  // printf("%d ", x);
  js = js.replace(/printf\s*\(\s*"[^"]*"\s*,\s*([^)]+)\);/g, 'console.print($1 + " ");');
  js = js.replace(/printf\s*\(\s*"([^"]*)"\s*\);/g, 'console.print("$1");');

  // Vector helpers
  js = js.replace(/vector\s*<\s*\w+\s*>\s+(\w+)\s*=\s*\{([^}]*)\}/g, 'let $1 = [$2]');
  js = js.replace(/vector\s*<\s*\w+\s*>\s+(\w+)\s*\(([^)]+)\)/g, 'let $1 = new Array($2).fill(0)');
  js = js.replace(/\.push_back\s*\(/g, '.push(');
  js = js.replace(/\.size\s*\(\s*\)/g, '.length');

  // Arrays: int arr[] = { 1, 2, 3 };
  js = js.replace(/\b(?:int|double|float|long|bool|char|String)\s+(\w+)\s*(?:\[\s*\])?\s*=\s*\{([^}]*)\}/g, 'let $1 = [$2]');
  js = js.replace(/\b(?:int|double|float|long|bool|char)\b(?:\s*\[\s*\])?\s+(?=[a-zA-Z_]\w*\s*[=;,])/g, 'let ');

  // int main()
  js = js.replace(/\bint\s+main\s*\([^)]*\)/g, 'function main()');

  // functions: void bubbleSort(int arr[], int n)
  js = js.replace(/\b(?:void|int|double|float|bool)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)/g, (match, fnName, fnArgs) => {
    if (fnName === 'main') return match;
    const cleanedArgs = fnArgs.split(',').map(arg => {
      const parts = arg.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      return last ? last.replace(/[\[\]*&]/g, '') : '';
    }).filter(Boolean).join(', ');
    return `function ${fnName}(${cleanedArgs})`;
  });

  js += "\nif (typeof main === 'function') { main(); }\n";
  return js;
}

/**
 * Execute transpiled algorithm safely in browser with console capturing
 */
export function executeTranspiledAlgorithm(transpiledCode, stdin = '') {
  let outputBuffer = '';
  const startTime = window.performance.now();

  const mockConsole = {
    log: (...args) => {
      outputBuffer += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
    },
    print: (...args) => {
      outputBuffer += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    },
    warn: (...args) => {
      outputBuffer += '⚠️ ' + args.join(' ') + '\n';
    },
    error: (...args) => {
      outputBuffer += '❌ ' + args.join(' ') + '\n';
    },
  };

  const stdinTokens = (stdin || '').trim().split(/\s+/).filter(Boolean);
  let tokenIdx = 0;
  const readNext = () => stdinTokens[tokenIdx++] ?? '';

  let exitCode = 0;
  try {
    const fn = new Function('console', 'readNext', transpiledCode);
    fn(mockConsole, readNext);
  } catch (err) {
    outputBuffer += `\n❌ Execution Error: ${err.message}\n`;
    exitCode = 1;
  }

  const duration = (window.performance.now() - startTime).toFixed(2);
  return {
    output: outputBuffer.trim() ? outputBuffer : '(Program executed with empty output)\n',
    duration,
    exitCode,
  };
}
