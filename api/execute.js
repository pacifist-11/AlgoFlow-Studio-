import { cors } from './_cors.js';

const JUDGE0_LANG_IDS = {
  c: 50,
  cpp: 54,
  'c++': 54,
  java: 62,
  python: 71,
  javascript: 63,
  js: 63,
};

const PAIZA_LANGS = {
  c: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  java: 'java',
  python: 'python3',
  javascript: 'javascript',
  js: 'javascript',
};

/**
 * Execute using Judge0 CE
 */
async function executeWithJudge0(langKey, code, stdin) {
  const langId = JUDGE0_LANG_IDS[langKey] || 62;
  const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language_id: langId,
      source_code: code,
      stdin: stdin || '',
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge0 responded with HTTP ${response.status}`);
  }

  const data = await response.json();
  const stdout = data.stdout || '';
  const stderr = data.stderr || '';
  const compileOutput = data.compile_output || '';
  const exitCode = data.status?.id === 3 ? 0 : 1;

  return {
    stdout,
    stderr,
    compileOutput,
    exitCode,
    provider: 'Judge0 Cloud Compiler',
  };
}

/**
 * Execute using Paiza.io
 */
async function executeWithPaiza(langKey, code, stdin) {
  const paizaLang = PAIZA_LANGS[langKey] || 'java';
  
  const createResp = await fetch('https://api.paiza.io/runners/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      source_code: code,
      language: paizaLang,
      input: stdin || '',
      longpoll: 'true',
      api_key: 'guest',
    }),
  });

  if (!createResp.ok) {
    throw new Error(`Paiza.io create responded with HTTP ${createResp.status}`);
  }

  const createData = await createResp.json();
  const id = createData.id;

  if (!id) {
    throw new Error('Paiza.io did not return a session id');
  }

  // If already completed via longpoll, or poll get_details
  let details = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const detailsResp = await fetch(`https://api.paiza.io/runners/get_details?id=${id}&api_key=guest`);
    if (detailsResp.ok) {
      details = await detailsResp.json();
      if (details.status === 'completed') break;
    }
    await new Promise(r => setTimeout(r, 600));
  }

  if (!details) {
    throw new Error('Paiza.io execution timed out');
  }

  const stdout = details.stdout || '';
  const stderr = details.stderr || '';
  const compileOutput = (details.build_stdout || '') + (details.build_stderr ? ('\n' + details.build_stderr) : '');
  const exitCode = details.exit_code !== undefined ? details.exit_code : (details.result === 'success' ? 0 : 1);

  return {
    stdout,
    stderr,
    compileOutput: compileOutput.trim(),
    exitCode,
    provider: 'Paiza.io Cloud Compiler',
  };
}

/**
 * Execute using Wandbox with dynamic compiler resolution
 */
async function executeWithWandbox(langKey, code, stdin) {
  let compiler = 'gcc-head';
  let options = '';

  if (langKey === 'c') {
    compiler = 'gcc-head-c';
  } else if (langKey === 'cpp' || langKey === 'c++') {
    compiler = 'gcc-head';
    options = 'c++20';
  } else if (langKey === 'java') {
    // Wandbox requires exact OpenJDK version name
    try {
      const listResp = await fetch('https://wandbox.org/api/list.json');
      if (listResp.ok) {
        const list = await listResp.json();
        const jComp = list.find(c => (c.language || '').toLowerCase() === 'java');
        if (jComp) compiler = jComp.name;
        else compiler = 'openjdk-21+35';
      } else {
        compiler = 'openjdk-21+35';
      }
    } catch {
      compiler = 'openjdk-21+35';
    }
  }

  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      compiler,
      code,
      stdin: stdin || '',
      options,
    }),
  });

  if (!response.ok) {
    throw new Error(`Wandbox responded with HTTP ${response.status}`);
  }

  const data = await response.json();
  const stdout = data.program_output || '';
  const stderr = data.program_error || '';
  const compileOutput = (data.compiler_output || '') + (data.compiler_error ? ('\n' + data.compiler_error) : '');
  const exitCode = data.status !== undefined && data.status !== null ? parseInt(data.status, 10) : 0;

  return {
    stdout,
    stderr,
    compileOutput: compileOutput.trim(),
    exitCode,
    provider: 'Wandbox Cloud Compiler',
  };
}

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { language = 'java', code = '', stdin = '' } = req.body || {};

    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const cleanLang = (language || '').toLowerCase().trim();
    let langKey = 'java';
    if (cleanLang === 'c') langKey = 'c';
    else if (cleanLang.includes('c++') || cleanLang.includes('cpp')) langKey = 'cpp';
    else if (cleanLang.includes('java')) langKey = 'java';
    else if (cleanLang.includes('python')) langKey = 'python';
    else if (cleanLang.includes('js') || cleanLang.includes('javascript')) langKey = 'javascript';

    const errors = [];

    // Provider 1: Judge0 CE
    try {
      const result = await executeWithJudge0(langKey, code, stdin);
      return res.status(200).json(result);
    } catch (err1) {
      errors.push(`Judge0: ${err1.message}`);
    }

    // Provider 2: Paiza.io
    try {
      const result = await executeWithPaiza(langKey, code, stdin);
      return res.status(200).json(result);
    } catch (err2) {
      errors.push(`Paiza: ${err2.message}`);
    }

    // Provider 3: Wandbox
    try {
      const result = await executeWithWandbox(langKey, code, stdin);
      return res.status(200).json(result);
    } catch (err3) {
      errors.push(`Wandbox: ${err3.message}`);
    }

    return res.status(503).json({
      error: 'All compiler backends failed',
      details: errors.join('; '),
    });
  } catch (err) {
    console.error('Execute error:', err);
    return res.status(500).json({
      error: 'Execution failed: ' + (err.message || String(err)),
    });
  }
}
