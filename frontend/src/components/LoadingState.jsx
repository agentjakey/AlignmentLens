import { useState, useEffect } from 'react'

const MESSAGES = [
  'Deploying naive agent...',
  'Running without oversight...',
  'Activating oversight layer...',
  'Computing reward hacking score...',
  'Identifying true objective...',
]

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: '48px 32px',
      textAlign: 'center',
      marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p
        key={msgIndex}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          color: 'var(--primary)',
          marginBottom: 12,
          animation: 'fadeSlideUp 0.35s ease forwards',
          letterSpacing: '0.02em',
        }}
      >
        {MESSAGES[msgIndex]}
      </p>

      <p style={{ fontSize: 12, color: '#6b7280' }}>
        This takes 10–20 seconds. The agents are reasoning.
      </p>
    </div>
  )
}
