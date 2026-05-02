import { useState, useEffect } from 'react'

const LINES = [
  { text: 'Deploying agent...', color: '#7c3aed', delay: 0 },
  { text: 'Goal: maximize engagement', color: '#94a3b8', delay: 900 },
  { text: 'Actions: 5/5 — specification gamed', color: '#dc2626', delay: 1900 },
]

export default function IntroAnimation({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, line.delay)
    )
    const fadeTimer = setTimeout(() => setFading(true), 3200)
    const doneTimer = setTimeout(() => onDone(), 3700)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  function skip() {
    setFading(true)
    setTimeout(() => onDone(), 400)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050510',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.5s ease',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
    }}>
      <button
        onClick={skip}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          background: 'transparent',
          border: '1px solid #1e1e3f',
          color: '#6b7280',
          padding: '5px 12px',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#94a3b8' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#1e1e3f' }}
      >
        skip →
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 40,
        opacity: 0.5,
      }}>
        <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="#7c3aed" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="5" stroke="#7c3aed" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="2" fill="#7c3aed" />
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#7c3aed', letterSpacing: '0.1em' }}>
          ALIGNMENTLENS
        </span>
      </div>

      <div style={{
        fontFamily: 'var(--font-mono)',
        width: '100%',
        maxWidth: 480,
        padding: '0 24px',
      }}>
        {LINES.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: i === 0 ? 18 : i === 2 ? 15 : 14,
              color: line.color,
              marginBottom: 12,
              opacity: visibleLines.includes(i) ? 1 : 0,
              transform: visibleLines.includes(i) ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              letterSpacing: i === 2 ? '0.02em' : '0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {i === 0 && (
              <span style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#7c3aed',
                animation: visibleLines.includes(0) ? 'pulse-dot 1.2s ease-in-out infinite' : 'none',
                flexShrink: 0,
              }} />
            )}
            {i === 2 && <span style={{ color: '#dc2626', flexShrink: 0 }}>✗</span>}
            {line.text}
          </div>
        ))}

        {visibleLines.includes(2) && (
          <div style={{
            marginTop: 20,
            height: 1,
            background: 'linear-gradient(to right, #7c3aed44, transparent)',
            animation: 'fadeSlideUp 0.5s ease forwards',
          }} />
        )}
      </div>
    </div>
  )
}
