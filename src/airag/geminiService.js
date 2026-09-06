// ─── AlgoFlow Gemini & Live AI Service ───────────────────────────────────────
// Universal integration for Google Gemini 3.6 Flash with Curriculum RAG Grounding
// Provides ChatGPT / Copilot / Gemini level conversational intelligence for AlgoFlow

import { retrieveRagContext, generateLocalRagResponse } from './aiRagEngine.js';
import { checkRestrictedWords } from './restrictedWords.js';

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
    const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
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
  customCode = '',
  codeLang = 'C++',
  currentContext = {},
  apiKey = '',
  model = ''
}) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return {
      text: "Please enter a question or choose one of the quick prompts above to get started!",
      sources: ['AlgoFlow Mentor System'],
      isLive: false
    };
  }

  const cleanQuery = query.trim();

  // Safety filter
  if (checkRestrictedWords(cleanQuery)) {
    return {
      text: "### 🛡️ Community Guidelines Notice\n\nI can only assist with academic, computer science, software engineering, algorithms, data structures, and engineering career inquiries.",
      sources: ['AlgoFlow Safety System'],
      isLive: false
    };
  }

  const resolvedKey = getActiveGeminiApiKey(apiKey);
  const resolvedModel = getActiveGeminiModel(model);

  // 1. Retrieve curriculum grounding context
  const retrievedDocs = retrieveRagContext(cleanQuery) || [];
  const groundedContextSnippets = retrievedDocs.map(d => `[TOPIC: ${d.topic}]\n${d.summary}\n${d.content.slice(0, 750)}...`).join('\n\n');

  // 2. If API Key is available, invoke Google Gemini 3.6 Flash
  if (resolvedKey && resolvedKey.length > 10) {
    // Model fallback sequence
    const candidateModels = [resolvedModel, 'gemini-3.6-flash'].filter((v, i, a) => a.indexOf(v) === i);

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

    for (const testModel of candidateModels) {
      try {
        const systemInstruction = `You are AlgoFlow AI, an elite Senior Computer Science Professor, Lead Software Architect, and Empathetic Engineering Mentor inside AlgoFlow Studio.
You answer questions with the warmth, depth, versatility, and intelligence of modern conversational assistants (like ChatGPT, Copilot, and Gemini).

STUDIO CONTEXT:
- Active Visualizer/Engine: ${currentContext?.appMode || 'AlgoFlow Studio General'}
- Active Tree/DS/Algorithm: ${currentContext?.treeType || currentContext?.globalDsType || currentContext?.globalSort || currentContext?.globalSearch || 'None'}
- Active Code Language: ${codeLang || 'C++'}
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
2. DO NOT DUMP UNREQUESTED CODE:
   - NEVER output large blocks of code or implementation templates unless the user explicitly requested code (e.g. "write code in Python", "implement in C", "how to write this in Java").
   - If the user simply asks for a fact, time, or concept, answer in plain words without dumping unsolicited code!
3. SUGGESTED NEXT QUESTIONS (MANDATORY):
   - At the very end of EVERY response, offer 3 or 4 relevant, clickable follow-up options tailored to what was asked under this exact heading:
---
**💡 Suggested Next Questions:**
- [Option to see code/implementation, e.g. "Show code in Python / C++"]
- [Option to see the mathematical formula or calculation]
- [Option to explore real-world use cases, background, or insights]
- [Option for comparisons, edge cases, or next steps]`;

        const requestPayload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemInstruction}\n\nSTUDENT QUESTION:\n${cleanQuery}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 2048,
          }
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${resolvedKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim()) {
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
        console.warn(`Gemini network call failed for ${testModel}:`, err);
      }
    }
  }

  // 3. Seamless fallback to local intelligent synthesis engine (Offline Mode)
  const localResult = generateLocalRagResponse(cleanQuery, customCode, codeLang, currentContext);
  return {
    text: localResult.text,
    sources: localResult.sources || ['AlgoFlow Local Knowledge Base (Offline)'],
    isLive: false,
    model: 'Local Intelligent Synthesis (Offline)',
    offlineNotice: '💡 You are currently in Offline Mode. Connect to the internet for live Gemini 3.6 Flash reasoning and real-time data.'
  };
}

0