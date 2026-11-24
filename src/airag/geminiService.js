// ─── AlgoFlow Gemini & Live AI Service ───────────────────────────────────────
// Universal integration for Google Gemini 3.6 Flash with Curriculum RAG Grounding
// Provides ChatGPT / Copilot / Gemini level conversational intelligence for AlgoFlow

import { retrieveRagContext, generateLocalRagResponse } from './aiRagEngine.js';
import { checkRestrictedWords } from './restrictedWords.js';
import { getScreenContext } from '../screenContext.js';

// Safe resolution of Gemini API Key (User local storage -> Vite env variable)
export function getActiveGeminiApiKey(explicitKey = '') {
  if (explicitKey && explicitKey.trim().length > 10) {
    return explicitKey.trim();
  }
  try {
    const saved = localStorage.getItem('gemini_api_key');
    if (saved && saved.trim().length > 10) return saved.trim();
  } catch {}

  try {
    const envKey = import.meta.env?.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? window.__VITE_GEMINI_API_KEY : '');
    if (envKey && envKey.trim().length > 10) return envKey.trim();
  } catch {}

  return '';
}

// Safe resolution of Gemini Model (defaulting to latest active gemini-3.6-flash)
export function getActiveGeminiModel(explicitModel = '') {
  let model = explicitModel;
  if (!model) {
    try {
      model = localStorage.getItem('gemini_model');
    } catch {}
  }
  if (!model) {
    try {
      model = import.meta.env?.VITE_GEMINI_MODEL;
    } catch {}
  }

  // Google phased out 2.0-flash and 1.5-flash with 404s; automatically migrate to gemini-3.6-flash
  if (!model || model.includes('2.0') || model.includes('1.5')) {
    model = 'gemini-3.6-flash';
    try {
      localStorage.setItem('gemini_model', 'gemini-3.6-flash');
    } catch {}
  }

  return model;
}

/**
 * Universal Ask Mentor AI Function
 * Intelligently routes queries through Google Gemini with RAG grounding,
 * with seamless fallback to high-speed local intelligent synthesis.
 */
export async function askAlgoFlowAiMentor({
  query,
  image = null,
  customCode = '',
  codeLang = 'C++',
  currentContext = {},
  apiKey = '',
  model = '',
  userProfile = null,
  chatHistory = [],
  onStreamChunk = null,
  signal = null
}) {
  // Normalize attached image payload if provided
  let imagePayload = null;
  if (image) {
    if (typeof image === 'string') {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        imagePayload = { mimeType: match[1], base64: match[2] };
      }
    } else if (typeof image === 'object') {
      const mime = image.mimeType || 'image/jpeg';
      const b64 = image.base64 || (image.dataUrl ? image.dataUrl.replace(/^data:[^;]+;base64,/, '') : '');
      if (b64) {
        imagePayload = { mimeType: mime, base64: b64 };
      }
    }
  }

  if ((!query || typeof query !== 'string' || !query.trim()) && !imagePayload) {
    return {
      text: "Please enter a question, choose a prompt, or upload a problem image to get started!",
      sources: ['AlgoFlow Mentor System'],
      isLive: false
    };
  }

  const cleanQuery = query && typeof query === 'string' ? query.trim() : '';

  // Safety filter
  if (cleanQuery && checkRestrictedWords(cleanQuery)) {
    return {
      text: "### 🛡️ Community Guidelines Notice\n\nI can only assist with academic, computer science, software engineering, algorithms, data structures, and engineering career inquiries.",
      sources: ['AlgoFlow Safety System'],
      isLive: false
    };
  }

  const resolvedKey = getActiveGeminiApiKey(apiKey);
  const resolvedModel = getActiveGeminiModel(model);

  // 1. Retrieve curriculum grounding context
  const retrievedDocs = cleanQuery ? (retrieveRagContext(cleanQuery) || []) : [];
  const groundedContextSnippets = retrievedDocs.map(d => `[TOPIC: ${d.topic}]\n${d.summary}\n${d.content.slice(0, 750)}...`).join('\n\n');

  // 2. If API Key is available, invoke Google Gemini 3.6 Flash
  if (resolvedKey && resolvedKey.length > 10) {
    // Model sequence: Prioritize 3.6, and automatically switch to active/better models if 3.6 is unavailable
    const candidateModels = [
      resolvedModel || 'gemini-3.6-flash',
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ].filter((v, i, a) => v && a.indexOf(v) === i);

    // Real-time clock and calendar context
    const now = new Date();
    let userTimeStr = '';
    let localTimeZone = 'UTC';
    try {
      localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      userTimeStr = new Intl.DateTimeFormat('en-US', {
        timeStyle: 'medium',
        dateStyle: 'full'
      }).format(now);
    } catch {
      userTimeStr = now.toUTCString();
    }

    const screen = getScreenContext();
    const isHome = !currentContext?.appMode || screen.screenTitle === 'Home Dashboard' || screen.screenTitle === 'AlgoFlow Studio';
    const activeAlgo = isHome
      ? 'None'
      : (screen.activeAlgo && screen.activeAlgo !== 'None' && screen.activeAlgo !== 'General'
          ? screen.activeAlgo
          : (currentContext?.treeType || currentContext?.globalDsType || (currentContext?.appMode === 'SORT_SEARCH_VIS' ? currentContext?.globalSort : null) || 'None'));

    for (const testModel of candidateModels) {
      try {
        const systemInstruction = `You are AlgoFlow AI, an elite Senior Computer Science Professor, Lead Software Architect, and Empathetic Engineering Mentor inside AlgoFlow Studio.
You answer questions with the warmth, depth, versatility, and intelligence of modern conversational assistants (like ChatGPT, Copilot, and Gemini).

STUDIO CONTEXT:
- Active Visualizer/Engine: ${isHome ? 'Home Dashboard' : (screen.screenTitle || currentContext?.appMode || 'AlgoFlow Studio General')}
- Active Tree/DS/Algorithm: ${isHome ? 'None' : activeAlgo}
- Active Code Language: ${codeLang || 'C++'}

LIVE SCREEN TELEMETRY & PROBLEM DIAGNOSTICS:
- Current Screen: ${isHome ? 'Home Dashboard' : screen.screenTitle}
- Current Animation/Step: ${isHome ? 'None (User is on Home Dashboard)' : (screen.totalSteps > 0 ? `Step ${screen.currentStep} of ${screen.totalSteps}` : 'Canvas Ready')}
- Current Status Message on Screen: "${isHome ? 'Home Dashboard active' : (screen.currentStepMessage || 'Normal')}"
- Active Visual Elements: ${isHome ? 'Home catalog with cards for Sorting, Searching, Trees, Graphs, DP, and Data Structures' : (screen.screenDataSummary || 'None')}
${!isHome && screen.recentLogs && screen.recentLogs.length > 0 ? `- Recent On-Screen Actions/Logs:\n  * ${screen.recentLogs.slice(-4).join('\n  * ')}` : ''}
${!isHome && screen.lastErrorOrIssue ? `\n⚠️ ON-SCREEN PROBLEM / ERROR DETECTED RIGHT NOW:\n"${screen.lastErrorOrIssue}"\nNote: If the user asks what is wrong, why it failed, or needs help, diagnose this exact screen issue immediately!\n` : ''}
${!isHome && screen.runtimeErrors && screen.runtimeErrors.length > 0 ? `- Recent Runtime Console Errors: ${screen.runtimeErrors.slice(0, 3).join('; ')}\n` : ''}
SCREEN AWARENESS DIRECTIVE:
You have real-time live awareness of what the user is seeing on screen (active nodes, current step, logs, and any errors). When the user asks "what happened?", "why did this fail?", "explain what's on screen", or encounters an issue, reference their live screen status and diagnose the root cause directly without asking them to re-type it.
${isHome ? `\nHOME DASHBOARD AWARENESS (CRITICAL):
- The user is currently on the AlgoFlow Studio Home Dashboard (main landing page / catalog).
- There is NO algorithm or animation currently active (activeAlgo is None).
- Do NOT assume, claim, or hallucinate that the user is in Bubble Sort or any specific visualizer unless their question explicitly asks about that algorithm by name. If the user asks what is on screen or what algorithm is open, explain that they are on the Home Dashboard and can launch any visualizer (Sorting, Graphs, Trees, Dynamic Programming, etc.) from the dashboard cards.\n` : ''}
${userProfile?.name ? `\nSTUDENT PROFILE & HABITUATION:
- Student Name: ${userProfile.name} (${userProfile.name.split(' ')[0]})
- Verified Email: ${userProfile.email || 'N/A'}
${userProfile.habits && userProfile.habits.length > 0 ? `- Frequented / Habituated Topics: ${userProfile.habits.join(', ')}` : ''}
Address the student warmly and directly, keeping their habituated learning pace in mind.\n` : ''}
${customCode ? `\nUSER'S ACTIVE CODE IN RUNNER:\n\`\`\`${codeLang}\n${customCode}\n\`\`\`\n` : ''}

REAL-TIME CLOCK CONTEXT:
- User's Local Time: ${userTimeStr} (Timezone: ${localTimeZone})
- Current UTC Time: ${now.toUTCString()}
- Note: You have access to real-time calendar and clock. If the user asks for the current time or date in ANY city, country, or timezone worldwide (e.g. New York, Tokyo, London, Berlin, Sydney, Paris, Mumbai, Dubai, etc.), calculate it accurately from UTC offsets and state it directly.

${groundedContextSnippets ? `RELEVANT CURRICULUM GROUNDING CONTEXT (AlgoFlow & KLEF Curriculum):\n${groundedContextSnippets}\n` : ''}

OFFICIAL INSTITUTIONAL CURRICULUM GROUNDING (KL DEEMED TO BE UNIVERSITY - KLEF Y25 B.TECH):
- You possess complete, authoritative mastery of the official KL Deemed to be University (KLEF) Y25 B.Tech Academic Curriculum (open-source portal: https://y25btech.klef.in).
- Core Course Tracks:
  * DSA-1 (ESC25SC1204ECASE): Trimester 2, 4 credits (2-0-2-4, 8 Contact Hours). Modules: 1. Asymptotic Complexity (O, Ω, Θ), RAM Model; 2. Dynamic Arrays, Strings, Two Pointers, Sliding Window, Prefix Sums, Dutch National Flag; 3. Linear/Binary Search (safe midpoint), Bubble/Selection/Insertion Sorts; 4. Singly/Doubly/Circular Linked Lists, Floyd's Cycle Detection; 5. Stacks (Balanced Parentheses, Infix to Postfix Shunting-Yard, Evaluation), Circular Queue, Deque.
  * DSA-2 (ESC25SC1305ECASE): Trimester 3, 4 credits (2-0-2-4, 8 Contact Hours). Modules: 1. Advanced Sorts (Merge, Quick Lomuto/Hoare, Heap, Radix, Counting); 2. Trees, BST traversals, LCA; 3. Balanced Trees (AVL Rotations LL/RR/LR/RL, Red-Black, B-Trees/B+ Trees); 4. Binary Heaps, linear buildHeap O(N); 5. Hashing & Collision Resolution (Chaining, Linear/Quadratic Probing, Double Hashing, Extendible Hashing); 6. Graphs (BFS, DFS, Bipartite, Topological Sort Kahn's); 7. Shortest Paths (Dijkstra, Bellman-Ford) & MST (Prim's, Kruskal's with DSU).
  * DSA-3 (PCC25CS2103ECASE): Year 2 / Trimester 4, 4 credits (2-0-2-4, 8 Contact Hours). Capstone Project-Based Learning (PBL) Text Analytics Engine (TextHack). Modules: 1. High-Performance Engine Architecture & Zero-Utility Library Constraint (strict ban on java.util.* in internal engine code); 2. String Algorithms (KMP with LPS failure table, Z-Algorithm, Rabin-Karp Rolling Hash, Suffix Structures); 3. Advanced DP (Wagner-Fischer Edit Distance, LCS, LIS, Bitmask DP for TSP, MCM); 4. Network Flow (Dinic's Algorithm with Level Graph & Blocking Flow, Ford-Fulkerson, Max-Flow Min-Cut); 5. NP-Completeness & Approximation (P vs NP, NP-Hard, 2-Approximation for Vertex Cover & Metric TSP); 6. Randomized & Parallel Paradigms (Miller-Rabin Primality, Blelloch Work-Efficient Parallel Prefix Scan, Reservoir Sampling).
- Academic Regulations & Evaluation: Continuous Assessment & Skill Evaluation (CASE) model: 60% In-Semester (In-Sem Exams 1 & 2, Continuous Lab Evaluation, Workbooks, PBL project reviews) + 40% Semester End Exam (SEE) on a 10-point CGPA scale (O: 10, A+: 9, A: 8, B+: 7, B: 6, C: 5, P: 4, F: 0).
- If the student asks about KLEF, KL University, Y25 B.Tech, y25btech.klef.in, course codes (ESC25SC1204ECASE, ESC25SC1305ECASE, PCC25CS2103ECASE), modules, workbooks, or exams, answer with total fluency, quoting the official course codes, syllabus modules, and academic guidelines directly!

CONVERSATIONAL RULES & PROPORTIONALITY (CRITICAL):
1. PROPORTIONALITY & DIRECTNESS:
   - Always match the length and depth of your answer to the user's intent.
   - For quick, direct questions (e.g., asking for the time anywhere, asking for a definition, date, or a single fact), answer DIRECTLY and CONCISELY in 1 to 3 sentences.
2. CODE CLEANLINESS & ISOLATION:
   - NEVER output large blocks of code or implementation templates unless the user explicitly requested code (e.g. "write code in Python", "implement in C", "how to write this in Java", "show code").
   - When code IS requested, deliver the code cleanly inside proper syntax-highlighted markdown code blocks. Keep chat commentary outside the code block crisp and minimal, never scattering loose code statements as chat prose.
   - If the user simply asks for a concept, fact, time, or explanation, explain with clear prose without dumping unsolicited code!
3. SUGGESTED NEXT QUESTIONS (MANDATORY):
   - At the very end of EVERY response, offer 3 or 4 relevant, clickable follow-up options tailored to what was asked under this exact heading:
---
**💡 Suggested Next Questions:**
- [Option to see code/implementation, e.g. "Show code in Python / C++"]
- [Option to see the mathematical formula or calculation]
- [Option to explore real-world use cases, background, or insights]
- [Option for comparisons, edge cases, or next steps]
${imagePayload ? `
4. IMAGE PROBLEM SOLVING DIRECTIVE (CRITICAL):
   - The user has uploaded an image containing a problem statement, handwritten math sum, algorithm question, data structure diagram, code snippet, or exam question.
   - CAREFULLY TRANSCRIBE & READ the problem statement, equations, formulas, numbers, matrices, or visual structures shown in the image.
   - SOLVE THE PROBLEM / SUM STEP-BY-STEP:
     * Clearly state the given values/inputs and what needs to be solved.
     * Show each intermediate calculation step, algebraic manipulation, or algorithm state transition.
     * Explain the intuition and reasoning for each step so the student learns how to solve similar sums.
     * If multiple choice (MCQ), state why the correct option is right and explain the flaws in distractors.
     * If code or DSA is required, provide clean, optimal code in appropriate syntax-highlighted code blocks with time & space complexity analysis.
   - STATE THE FINAL ANSWER clearly at the end (e.g. **Final Answer: ...**).` : ''}`;

        // Format recent conversation history turns (excluding current question)
        const formattedHistory = [];
        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
          const recentTurns = chatHistory.slice(-6);
          for (const turn of recentTurns) {
            if (!turn?.text || typeof turn.text !== 'string') continue;
            const isModel = turn.role === 'assistant' || turn.sender === 'bot';
            formattedHistory.push({
              role: isModel ? 'model' : 'user',
              parts: [{ text: turn.text }]
            });
          }
        }

        const userContentParts = [];
        if (imagePayload) {
          userContentParts.push({
            inlineData: {
              mimeType: imagePayload.mimeType,
              data: imagePayload.base64
            }
          });
        }
        userContentParts.push({
          text: `${systemInstruction}\n\nSTUDENT QUESTION / INSTRUCTION:\n${cleanQuery || 'Please inspect this uploaded problem/sum, solve it step-by-step with clear calculations, explain the concept, and provide the final answer and any relevant code.'}`
        });

        const requestPayload = {
          contents: [
            ...formattedHistory,
            {
              role: 'user',
              parts: userContentParts
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 2048,
          }
        };

        // 2A. Attempt real-time SSE streaming from Gemini (line-by-line / word-by-word)
        try {
          const streamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:streamGenerateContent?alt=sse&key=${resolvedKey}`;
          const streamResponse = await fetch(streamUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
            signal
          });

          if (streamResponse.ok && streamResponse.body && typeof streamResponse.body.getReader === 'function') {
            const reader = streamResponse.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let accumulatedText = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('data: ')) {
                  const jsonStr = trimmed.slice(6).trim();
                  if (!jsonStr || jsonStr === '[DONE]') continue;
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (chunk) {
                      accumulatedText += chunk;
                      if (typeof onStreamChunk === 'function') {
                        onStreamChunk(accumulatedText, chunk);
                      }
                    }
                  } catch {
                    // Ignore transient chunk parse errors
                  }
                }
              }
            }

            if (accumulatedText && accumulatedText.trim()) {
              const sources = [
                `Google Gemini (${testModel}) - Live AI Engine`,
                ...(retrievedDocs.length > 0 ? retrievedDocs.map(d => d.topic) : ['AlgoFlow Interactive Studio'])
              ];
              return {
                text: accumulatedText.trim(),
                sources,
                isLive: true,
                model: testModel
              };
            }
          }
        } catch (streamErr) {
          if (streamErr.name === 'AbortError') throw streamErr;
          console.warn(`Streaming fetch failed for ${testModel}, attempting standard request:`, streamErr);
        }

        // 2B. Unary fallback if streaming returned empty or is unsupported
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${resolvedKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload),
            signal
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim()) {
            if (typeof onStreamChunk === 'function') {
              onStreamChunk(generatedText.trim(), generatedText.trim());
            }
            const sources = [
              `Google Gemini (${testModel}) - Live AI Engine`,
              ...(retrievedDocs.length > 0 ? retrievedDocs.map(d => d.topic) : ['AlgoFlow Interactive Studio'])
            ];
            return {
              text: generatedText.trim(),
              sources,
              isLive: true,
              model: testModel
            };
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn(`Gemini model ${testModel} returned error:`, errData);
        }
      } catch (err) {
        if (err.name === 'AbortError') throw err;
        console.warn(`Gemini network call failed for ${testModel}:`, err);
      }
    }
  }

  // 3. Image Fallback: if an image was provided but live Gemini models were unreachable
  if (imagePayload) {
    const visionOfflineText = `### 📷 Image Received for Problem Solving\n\nAlgoFlow successfully received your problem photo! To analyze handwritten math, formulas, and visual problem statements, the live **Google Gemini Vision** engine is required.\n\n* **Tips to enable:** Ensure you have an active internet connection, or provide a Google Gemini API Key in chat settings (⚙️ icon).`;
    if (typeof onStreamChunk === 'function') {
      onStreamChunk(visionOfflineText, visionOfflineText);
    }
    return {
      text: visionOfflineText,
      sources: ['AlgoFlow Vision Assistant'],
      isLive: false,
      model: 'Vision Assistant (Requires Online)',
      offlineNotice: '💡 Vision requires online Gemini'
    };
  }

  // 4. Seamless fallback to local intelligent synthesis engine (Offline Mode)
  const localResult = generateLocalRagResponse(cleanQuery, customCode, codeLang, currentContext);
  if (typeof onStreamChunk === 'function') {
    onStreamChunk(localResult.text, localResult.text);
  }
  return {
    text: localResult.text,
    sources: localResult.sources || ['AlgoFlow Local Knowledge Base (Offline)'],
    isLive: false,
    model: 'Local Intelligent Synthesis (Offline)',
    offlineNotice: '💡 You are currently in Offline Mode. Connect to the internet for live Gemini 3.6 Flash reasoning and real-time data.'
  };
}