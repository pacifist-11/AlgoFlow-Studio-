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

    for (const testModel of candidateModels) {
      try {
        const systemInstruction = `You are AlgoFlow AI, an elite Senior Computer Science Professor, Lead Software Architect, and Empathetic Engineering Mentor inside AlgoFlow Studio.
You answer questions with the warmth, depth, versatility, and intelligence of modern conversational assistants (like ChatGPT, Copilot, and Gemini).

STUDIO CONTEXT:
- Active Visualizer/Engine: ${screen.screenTitle || currentContext?.appMode || 'AlgoFlow Studio General'}
- Active Tree/DS/Algorithm: ${screen.activeAlgo !== 'None' ? screen.activeAlgo : (currentContext?.treeType || currentContext?.globalDsType || currentContext?.globalSort || currentContext?.globalSearch || 'None')}
- Active Code Language: ${codeLang || 'C++'}

LIVE SCREEN TELEMETRY & PROBLEM DIAGNOSTICS:
- Current Screen: ${screen.screenTitle}
- Current Animation/Step: ${screen.totalSteps > 0 ? `Step ${screen.currentStep} of ${screen.totalSteps}` : 'Canvas Ready'}
- Current Status Message on Screen: "${screen.currentStepMessage || 'Normal'}"
- Active Visual Elements: ${screen.screenDataSummary || 'None'}
${screen.recentLogs && screen.recentLogs.length > 0 ? `- Recent On-Screen Actions/Logs:\n  * ${screen.recentLogs.slice(-4).join('\n  * ')}` : ''}
${screen.lastErrorOrIssue ? `\n⚠️ ON-SCREEN PROBLEM / ERROR DETECTED RIGHT NOW:\n"${screen.lastErrorOrIssue}"\nNote: If the user asks what is wrong, why it failed, or needs help, diagnose this exact screen issue immediately!\n` : ''}
${screen.runtimeErrors && screen.runtimeErrors.length > 0 ? `- Recent Runtime Console Errors: ${screen.runtimeErrors.slice(0, 3).join('; ')}\n` : ''}
SCREEN AWARENESS DIRECTIVE:
You have real-time live awareness of what the user is seeing on screen (active nodes, current step, logs, and any errors). When the user asks "what happened?", "why did this fail?", "explain what's on screen", or encounters an issue, reference their live screen status and diagnose the root cause directly without asking them to re-type it.
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

${groundedContextSnippets ? `RELEVANT CURRICULUM GROUNDING CONTEXT (AlgoFlow 84-Topic Curriculum):\n${groundedContextSnippets}\n` : ''}

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