import React, { useState } from 'react';

/**
 * ─── AlgoFlow Rich Markdown & Code Formatter ────────────────────────────────
 * Transforms raw text into visually rich UI:
 * - Glowing & sized headings
 * - Syntax-styled Code Blocks with 1-Click Copy
 * - Complexity chips (O(log N), O(1), etc.)
 * - Vibrant Action badges (BUY/SELL, TRUE/FALSE, Milestones)
 * - Highlighted inline code chips
 * - Clean structured lists and callout cards
 */

export function ChatMessageRenderer({ text = '', isUser = false, onSelectPrompt = null }) {
  if (isUser) {
    return (
      <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {text}
      </div>
    );
  }

  const { mainText, suggestions } = extractSuggestedQuestions(text);

  return (
    <div className="algoflow-chat-content" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      lineHeight: '1.65',
      fontSize: '13px',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {renderBlocks(mainText)}

      {suggestions && suggestions.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '0.4px' }}>
            <span>💡</span>
            <span>SUGGESTED NEXT QUESTIONS (CLICK TO ASK):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt && onSelectPrompt(q)}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  color: '#f1f5f9',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: onSelectPrompt ? 'pointer' : 'default',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={e => {
                  if (onSelectPrompt) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(99, 102, 241, 0.4))';
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  }
                }}
                onMouseLeave={e => {
                  if (onSelectPrompt) {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
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

function renderBlocks(rawText) {
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

    // 2. Headings (# H1)
    if (line.startsWith('# ')) {
      elements.push(
        <h3 key={i} style={{
          margin: '12px 0 6px 0',
          fontSize: '16.5px',
          fontWeight: '800',
          color: '#38bdf8',
          borderBottom: '1.5px solid rgba(56, 189, 248, 0.3)',
          paddingBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>✦</span> {line.replace('# ', '')}
        </h3>
      );
      continue;
    }

    // 3. Sub-Headings (## H2 or ### H3)
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const headingText = line.replace(/^#{2,3}\s*/, '');
      elements.push(
        <h4 key={i} style={{
          margin: '10px 0 4px 0',
          fontSize: '14.5px',
          fontWeight: '700',
          color: '#c084fc',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#38bdf8', fontSize: '11px' }}>◆</span> {headingText}
        </h4>
      );
      continue;
    }

    // 4. Callout / Alert Quotes (> text)
    if (line.trim().startsWith('>')) {
      const calloutText = line.replace(/^>\s*/, '');
      const isWarn = /⚠️|error|risk|drawdown|warning|myth/i.test(calloutText);
      elements.push(
        <div key={i} style={{
          background: isWarn ? 'rgba(239, 68, 68, 0.12)' : 'rgba(56, 189, 248, 0.12)',
          borderLeft: isWarn ? '3.5px solid #ef4444' : '3.5px solid #38bdf8',
          borderRadius: '0 8px 8px 0',
          padding: '8px 12px',
          margin: '4px 0',
          fontSize: '12.5px',
          color: isWarn ? '#fca5a5' : '#bae6fd'
        }}>
          {parseInlineSpans(calloutText)}
        </div>
      );
      continue;
    }

    // 5. Bullet points (- or * or •)
    if (/^(\s*[-*•]|\s*\d+\.)\s+/.test(line)) {
      const bulletMatch = line.match(/^(\s*)([-*•]|\d+\.)\s+(.*)$/);
      if (bulletMatch) {
        const bulletSymbol = bulletMatch[2];
        const content = bulletMatch[3];
        const isNum = /\d+\./.test(bulletSymbol);

        elements.push(
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '2px 0 2px 6px',
            fontSize: '12.5px'
          }}>
            <span style={{
              color: isNum ? '#fbbf24' : '#38bdf8',
              fontWeight: '700',
              fontSize: isNum ? '12px' : '14px',
              lineHeight: '1.5',
              flexShrink: 0
            }}>
              {isNum ? bulletSymbol : '•'}
            </span>
            <div style={{ flex: 1, color: '#f1f5f9' }}>
              {parseInlineSpans(content)}
            </div>
          </div>
        );
        continue;
      }
    }

    // 6. Regular Paragraph
    if (line.trim().length > 0) {
      elements.push(
        <div key={i} style={{ color: '#f8fafc', fontSize: '13px' }}>
          {parseInlineSpans(line)}
        </div>
      );
    }
  }

  return elements;
}

function parseInlineSpans(text) {
  if (!text) return text;

  // Split by inline code (`code`), bold (**bold**), or math expressions ($expr$)
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\$[^$]+\$)/g);

  return parts.map((part, idx) => {
    if (!part) return null;

    // 1. Inline Code / Parameters: `ta.ema(9)` or `arr[i]`
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code key={idx} style={{
          background: '#090d16',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '5px',
          padding: '2px 6px',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: '12px',
          margin: '0 2px',
          fontWeight: '600'
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
          background: 'rgba(99, 102, 241, 0.2)',
          color: '#a5b4fc',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '5px',
          padding: '1px 7px',
          fontFamily: 'Consolas, monospace',
          fontSize: '11.5px',
          fontWeight: '700',
          margin: '0 2px'
        }}>
          {math}
        </span>
      );
    }

    // 3. Bold Texts & Keyword Badges: **BUY**, **O(1)**, **1st Year**
    if (part.startsWith('**') && part.endsWith('**')) {
      const bold = part.slice(2, -2);
      const upper = bold.toUpperCase();

      // Green Badge (BUY, LONG, PASSED, SUCCESS, O(1))
      if (upper === 'BUY' || upper.includes('LONG') || upper === 'PASSED' || upper === 'O(1)') {
        return (
          <span key={idx} style={{
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#4ade80',
            border: '1px solid rgba(34, 197, 94, 0.45)',
            borderRadius: '5px',
            padding: '1px 7px',
            fontWeight: '800',
            fontSize: '12px',
            margin: '0 2px'
          }}>
            {bold}
          </span>
        );
      }

      // Red Badge (SELL, SHORT, FAILED, CRITICAL, RISK, DANGER)
      if (upper === 'SELL' || upper.includes('SHORT') || upper === 'FAILED' || upper.includes('CRITICAL') || upper.includes('RISK')) {
        return (
          <span key={idx} style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            borderRadius: '5px',
            padding: '1px 7px',
            fontWeight: '800',
            fontSize: '12px',
            margin: '0 2px'
          }}>
            {bold}
          </span>
        );
      }

      // Amber Badge (Milestones like 1st Year, Step 1, Core)
      if (/(\d+(st|nd|rd|th)\s+Year|Step\s+\d+|Time Complexity|Space Complexity)/i.test(bold)) {
        return (
          <span key={idx} style={{
            background: 'rgba(245, 158, 11, 0.18)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '5px',
            padding: '1px 7px',
            fontWeight: '700',
            fontSize: '12px',
            margin: '0 2px'
          }}>
            {bold}
          </span>
        );
      }

      return (
        <strong key={idx} style={{ color: '#38bdf8', fontWeight: '700' }}>
          {bold}
        </strong>
      );
    }

    return part;
  });
}

function CodeBlockItem({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      margin: '8px 0',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      background: '#070c18',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Code Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 10px',
        background: '#0f172a',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        fontSize: '11px',
        fontWeight: 'bold',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }}></span>
          <span style={{ color: '#38bdf8', letterSpacing: '0.5px' }}>{language || 'CODE'}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? '#10b981' : 'rgba(56, 189, 248, 0.15)',
            border: copied ? '1px solid #10b981' : '1px solid rgba(56, 189, 248, 0.35)',
            color: copied ? '#ffffff' : '#38bdf8',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '10.5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Area */}
      <pre style={{
        margin: 0,
        padding: '12px',
        overflowX: 'auto',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '12px',
        lineHeight: '1.5',
        color: '#4ade80'
      }}>
        {code}
      </pre>
    </div>
  );
}

export default ChatMessageRenderer;
