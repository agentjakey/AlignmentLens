import { useState } from 'react'

export default function SharePanel({ results }) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.origin : ''
  const snippet = `I just watched an AI agent completely game the goal "${results.goal}" on AlignmentLens.\nReward Hacking Score: ${results.scores?.reward_hacking_score}/100. True objective: "${results.true_objective}"\nTry it: ${url}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: '20px 24px',
      animation: 'fadeSlideUp 0.5s ease forwards',
    }}>
      <div style={{ marginBottom: 14 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--text-muted)',
        }}>
          Share this result
        </span>
      </div>

      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        padding: '12px 14px',
        marginBottom: 12,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {snippet}
      </div>

      <button
        onClick={handleCopy}
        style={{
          padding: '9px 20px',
          background: copied ? 'var(--safe-dim)' : 'transparent',
          border: `1px solid ${copied ? 'var(--safe)' : 'var(--border)'}`,
          color: copied ? 'var(--safe)' : 'var(--text-muted)',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
      >
        {copied ? '✓ Copied' : 'Copy to clipboard'}
      </button>
    </div>
  )
}
