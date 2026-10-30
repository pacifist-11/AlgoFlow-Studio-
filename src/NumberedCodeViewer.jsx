import React from 'react';

/**
 * NumberedCodeViewer
 * Displays code with line numbers on every line.
 * Even when scrolling horizontally across long lines, line numbers remain
 * pinned to the left edge of that line (position: sticky, left: 0).
 * Even when scrolling vertically, line numbers scroll synchronously with their lines.
 */
export default function NumberedCodeViewer({
  code = '',
  fontSize = 12,
  lineHeight = 1.6,
  wordWrap = 'off',
  isHighlighted = null,
  activeLineText = null,
  activeLineIndex = null,
  renderCustomLine = null,
  accentColor = 'var(--accent-primary, #3b82f6)',
  bg = 'rgba(8, 15, 30, 0.95)',
  style = {}
}) {
  const cleanCode = typeof code === 'string' ? code.replace(/\r\n/g, '\n').replace(/\r/g, '\n') : '';
  const lines = cleanCode.split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  const numFontSize = typeof fontSize === 'number' ? fontSize : parseInt(fontSize, 10) || 12;
  const digitCount = String(Math.max(lines.length, 1)).length;
  const gutterWidth = Math.max(38, digitCount * 8 + 18);

  const isEmerald = typeof accentColor === 'string' && (accentColor.includes('10b981') || accentColor === 'emerald');
  const activeBorderColor = isEmerald ? '#10b981' : (accentColor || 'var(--accent-primary, #38bdf8)');
  const activeBg = isEmerald ? 'rgba(16, 185, 129, 0.18)' : 'rgba(59, 130, 246, 0.18)';
  const activeGutterColor = isEmerald ? '#34d399' : (accentColor || '#38bdf8');

  return (
    <div
      className="algoflow-numbered-code-container"
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        overflow: 'auto',
        position: 'relative',
        background: bg,
        borderRadius: '6px',
        ...style
      }}
    >
      <div
        className="algoflow-numbered-code-inner"
        style={{
          display: 'inline-block',
          minWidth: '100%',
          boxSizing: 'border-box',
          padding: '6px 0',
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          lineHeight: lineHeight
        }}
      >
        {lines.map((lineText, idx) => {
          let highlighted = false;
          if (typeof isHighlighted === 'function') {
            highlighted = isHighlighted(lineText, idx);
          } else if (activeLineIndex !== null && activeLineIndex !== undefined) {
            highlighted = (activeLineIndex === idx);
          } else if (activeLineText && lineText) {
            highlighted = lineText.includes(activeLineText) && !lineText.trim().startsWith('//');
          }

          const rowBg = highlighted ? activeBg : 'transparent';
          const gutterBg = highlighted 
            ? (isEmerald ? 'rgba(6, 40, 25, 0.98)' : 'rgba(15, 30, 60, 0.98)')
            : (bg || 'rgba(8, 15, 30, 0.98)');
          const gutterBorder = highlighted 
            ? `1px solid ${activeBorderColor}` 
            : '1px solid rgba(255, 255, 255, 0.08)';

          return (
            <div
              key={idx}
              className="algoflow-code-line-row"
              style={{
                display: 'flex',
                alignItems: 'stretch',
                minWidth: 'max-content',
                width: '100%',
                background: rowBg,
                borderLeft: highlighted ? `3.5px solid ${activeBorderColor}` : '3.5px solid transparent',
                transition: 'background 0.12s ease'
              }}
            >
              {/* Sticky Line Number Column: Frozen at left: 0 even during horizontal scroll! */}
              <div
                className="algoflow-code-line-num"
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
                  color: highlighted ? activeGutterColor : 'var(--text-secondary, #64748b)',
                  fontWeight: highlighted ? '700' : '400',
                  fontSize: `${Math.max(10, numFontSize - 1)}px`,
                  fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                  background: gutterBg,
                  borderRight: gutterBorder,
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
                className="algoflow-code-line-content"
                style={{
                  flex: 1,
                  paddingLeft: '12px',
                  paddingRight: '16px',
                  whiteSpace: wordWrap === 'on' ? 'pre-wrap' : 'pre',
                  wordBreak: wordWrap === 'on' ? 'break-all' : 'normal',
                  color: highlighted ? '#ffffff' : 'var(--text-primary, #e2e8f0)',
                  fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                  fontSize: `${numFontSize}px`,
                  lineHeight: lineHeight,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {renderCustomLine 
                  ? renderCustomLine(lineText, idx, highlighted) 
                  : (lineText || '\u00A0')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
