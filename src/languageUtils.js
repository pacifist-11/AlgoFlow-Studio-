/**
 * Language utilities for checking Line-by-Line Debugger support.
 * PythonTutor execution tracing specifically supports:
 * - C
 * - C++ (GCC/Clang standard algorithms)
 * - Java (standard console/algorithmic code)
 * - Python (Python 3 core)
 * - JavaScript (ES6 console/algorithmic code)
 *
 * Languages like Frontend (HTML/CSS markup), Go, Rust, Kotlin, Swift, C#, etc.
 * are NOT supported for line-by-line step tracing.
 */

export const isLineDebuggerSupported = (lang) => {
  if (!lang) return false;
  const clean = String(lang).trim().toLowerCase();
  
  // Specific exclusions first
  if (
    clean === 'frontend' ||
    clean === 'html' ||
    clean === 'css' ||
    clean === 'go' ||
    clean === 'golang' ||
    clean === 'rust' ||
    clean === 'c#' ||
    clean === 'csharp' ||
    clean === 'kotlin' ||
    clean === 'swift' ||
    clean === 'ruby' ||
    clean === 'php' ||
    clean === 'sql' ||
    clean === 'typescript' ||
    clean === 'ts'
  ) {
    return false;
  }

  // Supported languages
  if (clean === 'c') return true;
  if (clean === 'cpp' || clean === 'c++' || clean === 'c_cpp') return true;
  if (clean === 'java') return true;
  if (clean === 'python' || clean === 'python3' || clean === 'py' || clean === '3') return true;
  if (clean === 'js' || clean === 'javascript') return true;

  return false;
};

/**
 * Normalizes language name to standard display/debugger key
 */
export const normalizeDebuggerLang = (lang) => {
  if (!lang) return 'C';
  const clean = String(lang).trim().toLowerCase();
  if (clean === 'c') return 'C';
  if (clean === 'cpp' || clean === 'c++' || clean === 'c_cpp') return 'C++';
  if (clean === 'java') return 'Java';
  if (clean === 'python' || clean === 'python3' || clean === 'py' || clean === '3') return 'Python';
  if (clean === 'js' || clean === 'javascript') return 'JS';
  return lang;
};
