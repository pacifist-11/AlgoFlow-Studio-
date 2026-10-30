import React, { useState } from 'react';

/**
 * ─── AlgoFlow Rich Markdown & Code Formatter ────────────────────────────────
 * Transforms raw text into visually rich, high-contrast, beautiful typography:
 * - High-contrast H1, H2, and H3 with distinct vibrant colors & micro-icons
 * - Syntax-highlighted code blocks with line numbers & 1-click copy
 * - Clear font hierarchy (13.5px body, 18px H1, 15.5px H2, 14px H3)
 * - Distinct inline code tags (`arr[i]`) and complexity chips ($O(N)$)
 * - Crisp pure-white bold highlights and semantic status pills
 * - Glowing bullet diamonds and rounded number badges
 */

export function ChatMessageRenderer({ text = '', isUser = false, onSelectPrompt = null, isStreaming = false }) {
  if (isUser) {
    return (
      <div style={{
        overflowWrap: 'break-word',
        wordBreak: 'normal',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.65',
        fontSize: '14px',
        color: '#f8fafc',
        fontWeight: '500',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {text}
      </div>
    );
  }

  const { mainText, suggestions } = extractSuggestedQuestions(text);

  return (
    <div className="algoflow-chat-content" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      lineHeight: '1.72',
      fontSize: '14px',
      color: '#e2e8f0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      letterSpacing: '0.15px',
      overflowWrap: 'break-word',
      wordBreak: 'normal'
    }}>
      <style>{`
        @keyframes algoflowCursorPulse {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.15; transform: scaleY(0.85); }
        }
        .algoflow-code-scrollbox::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .algoflow-code-scrollbox::-webkit-scrollbar-track {
          background: rgba(10, 15, 29, 0.85);
        }
        .algoflow-code-scrollbox::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.4);
          border-radius: 4px;
        }
        .algoflow-code-scrollbox::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.7);
        }
      `}</style>

      {renderBlocks(mainText, isStreaming)}

      {isStreaming && (
        <span 
          style={{
            display: 'inline-block',
            width: '8px',
            height: '16px',
            background: '#38bdf8',
            borderRadius: '2px',
            marginLeft: '4px',
            verticalAlign: 'text-bottom',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.85)',
            animation: 'algoflowCursorPulse 0.75s ease-in-out infinite'
          }}
          title="Streaming response..."
        />
      )}

      {!isStreaming && suggestions && suggestions.length > 0 && (
        <div style={{
          marginTop: '14px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '9px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            <span>💡</span>
            <span>Suggested Next Questions (Click to Ask):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt && onSelectPrompt(q)}
                style={{
                  background: 'rgba(30, 41, 59, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  color: '#f8fafc',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: onSelectPrompt ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={e => {
                  if (onSelectPrompt) {
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (onSelectPrompt) {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.75)';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
                  }
                }}
              >
                <span style={{ color: '#38bdf8', fontSize: '10px' }}>✦</span>
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function extractSuggestedQuestions(rawText) {
  if (!rawText) return { mainText: '', suggestions: [] };
  const lines = rawText.split('\n');
  let headerIndex = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i].toLowerCase();
    if (l.includes('suggested') && (l.includes('question') || l.includes('follow') || l.includes('next'))) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    return { mainText: rawText, suggestions: [] };
  }

  let cutIndex = headerIndex;
  if (cutIndex > 0 && lines[cutIndex - 1].trim().match(/^[-*_]{3,}$/)) {
    cutIndex--;
  }

  const mainText = lines.slice(0, cutIndex).join('\n').trim();
  const suggestions = lines.slice(headerIndex + 1)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^[-*_]{3,}$/))
    .map(line => line.replace(/^[-*•\d.)\]\s]+/, '').replace(/^\[|\]$/g, '').trim())
    .filter(line => line.length > 2);

  return { mainText: mainText || rawText, suggestions };
}

function renderBlocks(rawText, isStreaming = false) {
  if (!rawText) return null;
  const lines = rawText.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Code Block detection
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlockItem 
            key={'code-' + i} 
            code={codeBuffer.join('\n')} 
            language={codeLang || 'CODE'} 
          />
        );
        codeBuffer = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().replace(/^```/, '').trim().toUpperCase();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. Horizontal Rules (--- or ***)
    if (/^[-*_]{3,}$/.test(line.trim())) {
      elements.push(
        <hr key={'hr-' + i} style={{
          border: 'none',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          margin: '14px 0'
        }} />
      );
      continue;
    }

    // 3. Headings (# H1)
    if (line.startsWith('# ')) {
      elements.push(
        <h3 key={i} style={{
          margin: '18px 0 8px 0',
          fontSize: '18px',
          fontWeight: '800',
          color: '#f8fafc',
          borderBottom: '1px solid rgba(56, 189, 248, 0.28)',
          paddingBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          letterSpacing: '-0.2px'
        }}>
          <span style={{ color: '#38bdf8', fontSize: '15px' }}>✦</span>
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {line.replace(/^#\s*/, '')}
          </span>
        </h3>
      );
      continue;
    }

    // 4. Sub-Headings (## H2)
    if (line.startsWith('## ')) {
      const headingText = line.replace(/^##\s*/, '');
      elements.push(
        <h4 key={i} style={{
          margin: '14px 0 6px 0',
          fontSize: '15.5px',
          fontWeight: '700',
          color: '#fbbf24', // Radiant warm amber
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          letterSpacing: '-0.1px',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)'
        }}>
          <span style={{ color: '#f59e0b', fontSize: '12px' }}>◆</span>
          <span>{headingText}</span>
        </h4>
      );
      continue;
    }

    // 5. Section Titles (### H3)
    if (line.startsWith('### ')) {
      const headingText = line.replace(/^###\s*/, '');
      elements.push(
        <h5 key={i} style={{
          margin: '12px 0 4px 0',
          fontSize: '14px',
          fontWeight: '700',
          color: '#38bdf8', // Electric cyan
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '11px', color: '#818cf8' }}>▸</span>
          <span>{headingText}</span>
        </h5>
      );
      continue;
    }

    // 6. Callout / Alert Quotes (> text)
    if (line.trim().startsWith('>')) {
      const calloutText = line.replace(/^>\s*/, '');
      const isWarn = /⚠️|error|risk|drawdown|warning|myth/i.test(calloutText);
      const isTip = /💡|tip|note|hint|idea/i.test(calloutText);
      const borderColor = isWarn ? '#ef4444' : isTip ? '#10b981' : '#38bdf8';
      const bgGradient = isWarn 
        ? 'rgba(239, 68, 68, 0.12)' 
        : isTip 
          ? 'rgba(16, 185, 129, 0.12)' 
          : 'rgba(56, 189, 248, 0.09)';

      elements.push(
        <div key={i} style={{
          background: bgGradient,
          borderLeft: `3.5px solid ${borderColor}`,
          borderRadius: '0 8px 8px 0',
          padding: '10px 14px',
          margin: '6px 0',
          fontSize: '13px',
          lineHeight: '1.6',
          color: isWarn ? '#fca5a5' : isTip ? '#6ee7b7' : '#bae6fd',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {parseInlineSpans(calloutText)}
        </div>
      );
      continue;
    }

    // 7. Bullet points (- or * or •)
    if (/^(\s*[-*•])\s+/.test(line)) {
      const bulletMatch = line.match(/^(\s*[-*•])\s+(.*)$/);
      if (bulletMatch) {
        const content = bulletMatch[2];
        elements.push(
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '3px 0 3px 6px',
            fontSize: '13.5px',
            lineHeight: '1.65'
          }}>
            <span style={{
              color: '#38bdf8',
              fontSize: '12px',
              lineHeight: '1.7',
              flexShrink: 0
            }}>
              ✦
            </span>
            <div style={{ flex: 1, color: '#f1f5f9' }}>
              {parseInlineSpans(content)}
            </div>
          </div>
        );
        continue;
      }
    }

    // 8. Numbered lists (1., 2., etc.)
    if (/^(\s*\d+\.)\s+/.test(line)) {
      const numMatch = line.match(/^(\s*)(\d+\.)\s+(.*)$/);
      if (numMatch) {
        const numSymbol = numMatch[2];
        const content = numMatch[3];
        elements.push(
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '3px 0 3px 6px',
            fontSize: '13.5px',
            lineHeight: '1.65'
          }}>
            <span style={{
              background: 'rgba(56, 189, 248, 0.16)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '5px',
              padding: '0 5px',
              fontSize: '11px',
              fontWeight: '800',
              lineHeight: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {numSymbol}
            </span>
            <div style={{ flex: 1, color: '#f1f5f9' }}>
              {parseInlineSpans(content)}
            </div>
          </div>
        );
        continue;
      }
    }

    // 9. Regular Paragraph
    if (line.trim().length > 0) {
      elements.push(
        <div key={i} style={{ color: '#e2e8f0', fontSize: '13.5px', lineHeight: '1.68' }}>
          {parseInlineSpans(line)}
        </div>
      );
    }
  }

  // Handle open code block still being streamed
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <CodeBlockItem 
        key="code-open-streaming" 
        code={codeBuffer.join('\n')} 
        language={codeLang || 'CODE'} 
      />
    );
  }

  return elements;
}

function parseInlineSpans(text) {
  if (!text) return text;

  // Split by inline code (`code`), bold (**bold**), or math expressions ($expr$)
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$)/g);

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. Inline Code / Parameters: `arr[i]` or `ta.ema(9)`
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code key={idx} style={{
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '5px',
          padding: '2px 7px',
          fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
          fontSize: '13px',
          margin: '0 3px',
          fontWeight: '600',
          verticalAlign: 'baseline',
          display: 'inline-block'
        }}>
          {code}
        </code>
      );
    }

    // 2. Math / Complexity tags: $O(N \log N)$ or $BF = ...$
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      return (
        <span key={idx} style={{
          background: 'rgba(16, 185, 129, 0.16)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.38)',
          borderRadius: '5px',
          padding: '1px 7px',
          fontFamily: '"JetBrains Mono", Consolas, monospace',
          fontSize: '12.5px',
          fontWeight: '700',
          margin: '0 3px',
          verticalAlign: 'baseline',
          display: 'inline-block'
        }}>
          {math}
        </span>
      );
    }

    // 3. Bold Texts & Keyword Badges
    if (part.startsWith('**') && part.endsWith('**')) {
      const bold = part.slice(2, -2);

      // Complexity & Performance Badges
      if (/^(O\(.*\)|Time Complexity|Space Complexity|Optimal|PASSED|SUCCESS|BUY|TRUE)$/i.test(bold.trim())) {
        return (
          <span key={idx} style={{
            background: 'rgba(16, 185, 129, 0.16)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.38)',
            borderRadius: '5px',
            padding: '1px 7px',
            fontWeight: '800',
            fontSize: '12px',
            margin: '0 3px',
            verticalAlign: 'baseline',
            display: 'inline-block'
          }}>
            {bold}
          </span>
        );
      }

      // Warning & Error Badges
      if (/^(Error|Failed|Critical|Warning|Risk|Danger|SELL|FALSE)$/i.test(bold.trim())) {
        return (
          <span key={idx} style={{
            background: 'rgba(239, 68, 68, 0.16)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.38)',
            borderRadius: '5px',
            padding: '1px 7px',
            fontWeight: '800',
            fontSize: '12px',
            margin: '0 3px',
            verticalAlign: 'baseline',
            display: 'inline-block'
          }}>
            {bold}
          </span>
        );
      }

      // Step & Milestone Badges
      if (/^(\d+(st|nd|rd|th)\s+Year|Step\s+\d+|Note:|Important:|Notice:)/i.test(bold.trim())) {
        return (
          <span key={idx} style={{
            background: 'rgba(245, 158, 11, 0.16)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.38)',
            borderRadius: '5px',
            padding: '1px 7px',
            fontWeight: '700',
            fontSize: '12px',
            margin: '0 3px',
            verticalAlign: 'baseline',
            display: 'inline-block'
          }}>
            {bold}
          </span>
        );
      }

      // Crisp high-contrast white for bold text
      return (
        <strong key={idx} style={{
          color: '#ffffff',
          fontWeight: '700',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {bold}
        </strong>
      );
    }

    return part;
  });
}

function renderLineTokens(line) {
  if (!line || line.length === 0) return null;
  const trimmed = line.trim();

  // Full comment line
  if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
    return <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{line}</span>;
  }

  // Tokenize line into strings, keywords, built-ins, numbers, and operators
  const regex = /("[^"]*"|'[^']*'|`[^`]*`|\b(?:const|let|var|function|return|def|class|if|else|elif|for|while|import|from|as|public|private|protected|static|void|int|float|double|char|bool|boolean|true|false|null|nullptr|None|new|struct|template|typename|using|namespace|include|auto|long|short|unsigned|signed|sizeof|switch|case|default|break|continue|goto|try|catch|throw|throws|finally|yield|async|await|pass|lambda|self|this|super|override|virtual|interface|implements|extends|package|type|func|select|where|insert|update|delete)\b|\b(?:cout|cin|printf|scanf|vector|string|std|map|set|unordered_map|unordered_set|pair|list|queue|stack|priority_queue|print|range|len|console|log|Math|System|out|println|Integer|Double|Boolean|String|ArrayList|HashMap|HashSet)\b|\b\d+\.?\d*\b|->|==|!=|<=|>=|&&|\|\||\+\+|--|::)/g;

  const tokens = line.split(regex);

  return tokens.map((tok, tokIdx) => {
    if (!tok) return null;
    if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith('`')) {
      return <span key={tokIdx} style={{ color: '#34d399' }}>{tok}</span>; // Strings (Emerald)
    }
    if (/^(?:const|let|var|function|return|def|class|if|else|elif|for|while|import|from|as|public|private|protected|static|void|int|float|double|char|bool|boolean|true|false|null|nullptr|None|new|struct|template|typename|using|namespace|include|auto|long|short|unsigned|signed|sizeof|switch|case|default|break|continue|goto|try|catch|throw|throws|finally|yield|async|await|pass|lambda|self|this|super|override|virtual|interface|implements|extends|package|type|func|select|where|insert|update|delete)$/.test(tok)) {
      return <span key={tokIdx} style={{ color: '#c084fc', fontWeight: 'bold' }}>{tok}</span>; // Keywords (Purple)
    }
    if (/^(?:cout|cin|printf|scanf|vector|string|std|map|set|unordered_map|unordered_set|pair|list|queue|stack|priority_queue|print|range|len|console|log|Math|System|out|println|Integer|Double|Boolean|String|ArrayList|HashMap|HashSet)$/.test(tok)) {
      return <span key={tokIdx} style={{ color: '#38bdf8' }}>{tok}</span>; // Built-ins/Libraries (Cyan)
    }
    if (/^\d+\.?\d*$/.test(tok)) {
      return <span key={tokIdx} style={{ color: '#fb923c' }}>{tok}</span>; // Numbers (Orange)
    }
    if (/^(?:->|==|!=|<=|>=|&&|\|\||\+\+|--|::)$/.test(tok)) {
      return <span key={tokIdx} style={{ color: '#7dd3fc' }}>{tok}</span>; // Operators (Light Cyan)
    }
    return <span key={tokIdx} style={{ color: '#e2e8f0' }}>{tok}</span>; // Regular code
  });
}

function CodeBlockItem({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const cleanCode = code ? code.replace(/\r\n/g, '\n').replace(/\r/g, '\n') : '';
  const lines = cleanCode.split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const digitCount = String(Math.max(lines.length, 1)).length;
  const gutterWidth = Math.max(38, digitCount * 8 + 18);

  return (
    <div style={{
      margin: '12px 0',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1.5px solid rgba(56, 189, 248, 0.35)',
      background: '#070b14',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.55), 0 0 15px rgba(56, 189, 248, 0.15)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Code Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 14px',
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#94a3b8',
        userSelect: 'none',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px rgba(239, 68, 68, 0.4)' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px rgba(245, 158, 11, 0.4)' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              color: '#38bdf8',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              {language || 'CODE'}
            </span>
            <span style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#94a3b8',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '9.5px',
              fontWeight: '600'
            }}>
              {lines.length} {lines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lines.length > 14 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse to fixed box with scrolling" : "Expand code height"}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                borderRadius: '5px',
                padding: '2px 8px',
                fontSize: '10.5px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              {isExpanded ? '↕ Collapse' : '↕ Expand'}
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy code to clipboard"
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.18)',
              border: copied ? '1px solid #10b981' : '1px solid rgba(56, 189, 248, 0.4)',
              color: copied ? '#34d399' : '#38bdf8',
              borderRadius: '5px',
              padding: '2px 10px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
              boxShadow: copied ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Fixed Box Scrollable Code Area with Sticky Line Numbering */}
      <div 
        className="algoflow-code-scrollbox"
        style={{
          margin: 0,
          padding: '8px 0',
          maxHeight: isExpanded ? 'none' : '360px',
          overflowY: 'auto',
          overflowX: 'auto',
          background: '#070b14',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'inline-block',
            minWidth: '100%',
            fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
            fontSize: '13px',
            lineHeight: '1.68',
            boxSizing: 'border-box'
          }}
        >
          {lines.map((line, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                minWidth: 'max-content',
                width: '100%',
                lineHeight: '1.68'
              }}
            >
              {/* Sticky Line Number Gutter: Frozen at left: 0 even during horizontal scroll! */}
              <div
                style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  width: `${gutterWidth}px`,
                  minWidth: `${gutterWidth}px`,
                  maxWidth: `${gutterWidth}px`,
                  textAlign: 'right',
                  paddingRight: '12px',
                  paddingLeft: '6px',
                  userSelect: 'none',
                  color: '#64748b',
                  fontSize: '11.5px',
                  fontFamily: '"JetBrains Mono", Consolas, monospace',
                  background: '#070b14',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexShrink: 0
                }}
              >
                {idx + 1}
              </div>

              {/* Code Line Content */}
              <div
                style={{
                  flex: 1,
                  paddingLeft: '14px',
                  paddingRight: '16px',
                  whiteSpace: 'pre',
                  fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                  fontSize: '13px',
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {renderLineTokens(line) || '\u00A0'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatMessageRenderer;
