import { useState } from 'react'

function HarmBadge({ level }) {
  const colors = {
    low:    { bg: 'var(--safe-dim)',    border: 'var(--safe)',    text: 'var(--safe)' },
    medium: { bg: 'var(--caution-dim)', border: 'var(--caution)', text: 'var(--caution)' },
    high:   { bg: 'var(--danger-dim)',  border: 'var(--danger)',  text: 'var(--danger)' },
  }
  const c = colors[level] || colors.low
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px',
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em',
    }}>
      {level} harm
    </span>
  )
}

function NaiveCard({ action, index, diffMode, correspondingBlocked }) {
  const dimmed = diffMode && correspondingBlocked

  return (
    <div style={{
      background: dimmed ? 'rgba(220,38,38,0.06)' : 'var(--bg)',
      border: `1px solid ${dimmed ? 'rgba(220,38,38,0.4)' : 'var(--border)'}`,
      padding: '14px 16px',
      marginBottom: 10,
      animation: `fadeSlideUp 0.4s ease ${index * 0.12}s both`,
      position: 'relative',
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      {dimmed && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 2, background: 'var(--danger)',
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--primary)', background: 'var(--primary-dim)',
          border: '1px solid rgba(124,58,237,0.3)',
          width: 22, height: 22, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, fontWeight: 700,
        }}>
          {action.step}
        </span>
        <p style={{
          fontSize: 13, color: 'var(--text)', lineHeight: 1.55, margin: 0,
          textDecoration: dimmed ? 'line-through' : 'none',
          textDecorationColor: '#dc2626',
          opacity: dimmed ? 0.6 : 1,
          transition: 'opacity 0.2s',
        }}>
          {action.action}
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <HarmBadge level={action.harm_potential} />
        {action.is_gaming && (
          <span style={{
            padding: '2px 8px', background: 'var(--caution-dim)',
            border: '1px solid var(--caution)', color: 'var(--caution)',
            fontSize: 11, fontWeight: 600,
          }}>
            ⚡ Specification gamed
          </span>
        )}
        {dimmed && (
          <span style={{
            padding: '2px 8px', background: 'var(--danger-dim)',
            border: '1px solid var(--danger)', color: 'var(--danger)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
          }}>
            → BLOCKED
          </span>
        )}
      </div>
      {action.loophole_used && !dimmed && (
        <p style={{
          fontSize: 11, color: '#6b7280', marginTop: 8,
          borderLeft: '2px solid var(--border)', paddingLeft: 8,
          fontStyle: 'italic', lineHeight: 1.5,
        }}>
          Loophole: {action.loophole_used}
        </p>
      )}
    </div>
  )
}

function OverseerCard({ action, index }) {
  const flagged = action.overseer_flagged
  return (
    <div style={{
      background: 'var(--bg)',
      border: `1px solid ${flagged ? 'rgba(220,38,38,0.3)' : 'rgba(22,163,74,0.3)'}`,
      padding: '14px 16px', marginBottom: 10,
      animation: `fadeSlideUp 0.4s ease ${index * 0.12}s both`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: flagged ? 'var(--danger)' : 'var(--safe)',
          background: flagged ? 'var(--danger-dim)' : 'var(--safe-dim)',
          border: `1px solid ${flagged ? 'rgba(220,38,38,0.4)' : 'rgba(22,163,74,0.4)'}`,
          width: 22, height: 22, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, fontWeight: 700,
        }}>
          {action.step}
        </span>
        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55, margin: 0 }}>
          {action.action}
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {flagged ? (
          <span style={{
            padding: '3px 10px', background: 'var(--danger-dim)',
            border: '1px solid var(--danger)', color: 'var(--danger)',
            fontSize: 11, fontWeight: 700,
          }}>
            🚫 BLOCKED BY OVERSEER
          </span>
        ) : (
          <span style={{
            padding: '3px 10px', background: 'var(--safe-dim)',
            border: '1px solid var(--safe)', color: 'var(--safe)',
            fontSize: 11, fontWeight: 600,
          }}>
            ✓ Allowed
          </span>
        )}
        {action.is_gaming && (
          <span style={{
            padding: '2px 8px', background: 'var(--caution-dim)',
            border: '1px solid var(--caution)', color: 'var(--caution)',
            fontSize: 11, fontWeight: 600,
          }}>
            ⚡ Specification gamed
          </span>
        )}
      </div>
      {flagged && action.flag_reason && (
        <p style={{
          fontSize: 11, color: '#f87171', marginTop: 8,
          borderLeft: '2px solid var(--danger)', paddingLeft: 8,
          fontStyle: 'italic', lineHeight: 1.5,
        }}>
          {action.flag_reason}
        </p>
      )}
    </div>
  )
}

export default function ActionTimeline({ naive, overseen }) {
  const [diffMode, setDiffMode] = useState(false)

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', justifyContent: 'flex-end', marginBottom: 10,
      }}>
        <button
          onClick={() => setDiffMode(d => !d)}
          style={{
            background: diffMode ? 'var(--primary-dim)' : 'transparent',
            border: `1px solid ${diffMode ? 'var(--primary)' : 'var(--border)'}`,
            color: diffMode ? 'var(--primary)' : 'var(--text-muted)',
            padding: '5px 12px', fontSize: 12, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            transition: 'all 0.15s',
          }}
        >
          {diffMode ? '◉ Diff mode ON' : '○ Diff mode'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
      }}>
        <div>
          <div style={{
            borderTop: '3px solid var(--danger)',
            background: 'var(--surface)',
            border: '1px solid var(--border)', borderTopColor: 'var(--danger)',
            padding: '12px 16px', marginBottom: 12,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: 'var(--danger)',
            }}>
              Naive Agent — No Oversight
            </span>
          </div>
          {naive.map((action, i) => {
            const correspondingBlocked = overseen[i]?.overseer_flagged === true
            return (
              <NaiveCard
                key={action.step || i}
                action={action}
                index={i}
                diffMode={diffMode}
                correspondingBlocked={correspondingBlocked && action.is_gaming}
              />
            )
          })}
        </div>

        <div>
          <div style={{
            borderTop: '3px solid var(--safe)',
            background: 'var(--surface)',
            border: '1px solid var(--border)', borderTopColor: 'var(--safe)',
            padding: '12px 16px', marginBottom: 12,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: 'var(--safe)',
            }}>
              Overseen Agent — Scalable Oversight Active
            </span>
          </div>
          {overseen.map((action, i) => (
            <OverseerCard key={action.step || i} action={action} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
