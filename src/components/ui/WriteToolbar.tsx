'use client';
import { RefObject } from 'react';

interface Props {
  editorRef: RefObject<HTMLDivElement | null>;
  night: boolean;
  fontSize: number;
  setFontSize: (s: number) => void;
  lineHeight: number;
  setLineHeight: (h: number) => void;
}

const FONT_SIZES = [14, 16, 18, 20, 24, 28, 32];
const LINE_HEIGHTS = [1.4, 1.8, 2.1, 2.6];

export function WriteToolbar({ editorRef, night, fontSize, setFontSize, lineHeight, setLineHeight }: Props) {
  const n = night;
  const bdCol = n ? 'rgba(160,124,200,.22)' : 'rgba(208,191,240,.55)';
  const btnCol = n ? 'rgba(200,170,255,.72)' : '#6a5a80';
  const bg = n ? 'rgba(22,14,40,.94)' : 'rgba(252,249,255,.96)';

  function cmd(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value ?? undefined);
  }

  function insertChar(char: string) {
    editorRef.current?.focus();
    document.execCommand('insertText', false, char);
  }

  const btn: React.CSSProperties = {
    width: 30, height: 30, borderRadius: 6,
    border: `1px solid ${bdCol}`,
    background: 'transparent', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, color: btnCol, fontFamily: "'DM Sans',sans-serif",
    flexShrink: 0,
  };

  const sep: React.CSSProperties = {
    width: 1, height: 18, background: bdCol, margin: '0 2px', flexShrink: 0,
  };

  const sel: React.CSSProperties = {
    padding: '0 6px', height: 30, borderRadius: 6,
    border: `1px solid ${bdCol}`,
    background: bg, color: btnCol, fontSize: 11, cursor: 'pointer',
    fontFamily: "'DM Sans',sans-serif", outline: 'none',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap',
      padding: '7px 10px', borderRadius: 10,
      border: `1px solid ${bdCol}`,
      background: bg,
      backdropFilter: 'blur(16px)',
      marginBottom: 14,
    }}>
      {/* Bold / Italic / Underline */}
      <button style={{ ...btn, fontWeight: 700 }} onMouseDown={e => e.preventDefault()} onClick={() => cmd('bold')} title="Bold">B</button>
      <button style={{ ...btn, fontStyle: 'italic' }} onMouseDown={e => e.preventDefault()} onClick={() => cmd('italic')} title="Italic">I</button>
      <button style={{ ...btn, textDecoration: 'underline' }} onMouseDown={e => e.preventDefault()} onClick={() => cmd('underline')} title="Underline">U</button>

      <div style={sep} />

      {/* Superscript / Subscript */}
      <button style={btn} onMouseDown={e => e.preventDefault()} onClick={() => cmd('superscript')} title="Superscript">
        <span style={{ fontSize: 11 }}>x<sup style={{ fontSize: 8 }}>2</sup></span>
      </button>
      <button style={btn} onMouseDown={e => e.preventDefault()} onClick={() => cmd('subscript')} title="Subscript">
        <span style={{ fontSize: 11 }}>x<sub style={{ fontSize: 8 }}>2</sub></span>
      </button>

      <div style={sep} />

      {/* Alignment */}
      <button style={btn} onMouseDown={e => e.preventDefault()} onClick={() => cmd('justifyCenter')} title="Center">≡</button>
      <button style={btn} onMouseDown={e => e.preventDefault()} onClick={() => cmd('justifyLeft')} title="Left align">≣</button>

      <div style={sep} />

      {/* Insert characters */}
      <button
        style={{ ...btn, fontFamily: "'Playfair Display',serif", fontSize: 15 }}
        onMouseDown={e => e.preventDefault()}
        onClick={() => insertChar('—')}
        title="Em dash"
      >—</button>
      <button
        style={{ ...btn, fontFamily: "'Playfair Display',serif", fontSize: 15 }}
        onMouseDown={e => e.preventDefault()}
        onClick={() => insertChar('…')}
        title="Ellipsis"
      >…</button>

      <div style={sep} />

      {/* Font size */}
      <select style={sel} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} title="Font size">
        {FONT_SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
      </select>

      {/* Line height */}
      <select style={sel} value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} title="Line height">
        {LINE_HEIGHTS.map(h => <option key={h} value={h}>× {h}</option>)}
      </select>

      <div style={sep} />

      {/* Clear formatting */}
      <button
        style={{ ...btn, fontSize: 11, color: n ? 'rgba(210,140,160,.7)' : '#c08090' }}
        onMouseDown={e => e.preventDefault()}
        onClick={() => cmd('removeFormat')}
        title="Clear formatting"
      >✕</button>
    </div>
  );
}
