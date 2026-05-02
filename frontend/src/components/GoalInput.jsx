import { useState } from 'react'

const DOMAINS = [
  'Social media platform',
  'City government',
  'School district',
  'Healthcare system',
  'Financial markets',
  'Content recommendation',
  'Law enforcement',
  'Environmental regulation',
  'Corporate HR',
  'Custom',
]

const EXAMPLE_PILLS = [
  { label: 'maximize engagement', goal: 'maximize user engagement', domain: 'Social media platform' },
  { label: 'reduce reported crime', goal: 'reduce reported crime', domain: 'City government' },
  { label: 'improve test scores', goal: 'improve student test scores', domain: 'School district' },
  { label: 'increase productivity', goal: 'increase employee productivity', domain: 'Corporate HR' },
  { label: 'minimize costs', goal: 'minimize operational costs', domain: 'Healthcare system' },
]

export default function GoalInput({ goal, setGoal, domain, setDomain, onSubmit, loading, onExample }) {
  const [customDomain, setCustomDomain] = useState('')
  const isCustom = domain === 'Custom'
  const effectiveDomain = isCustom ? customDomain : domain

  function handleSubmit(e) {
    e.preventDefault()
    if (!goal.trim() || goal.trim().length < 3 || loading) return
    if (isCustom) setDomain(customDomain || 'Custom domain')
    onSubmit()
  }

  function handleExample(pill) {
    setGoal(pill.goal)
    setDomain(pill.domain)
    onExample(pill.goal, pill.domain)
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      padding: 24,
      marginBottom: 24,
    }}>
      <label style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--primary)',
        marginBottom: 10,
      }}>
        Define the agent's goal
      </label>

      <textarea
        value={goal}
        onChange={e => setGoal(e.target.value)}
        rows={3}
        placeholder="e.g. maximize website engagement, reduce reported crime, increase test scores..."
        disabled={loading}
        style={{
          width: '100%',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          padding: '12px 14px',
          fontSize: 15,
          resize: 'vertical',
          outline: 'none',
          borderRadius: 0,
          transition: 'border-color 0.2s',
          opacity: loading ? 0.6 : 1,
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label style={{
            display: 'block',
            fontSize: 11,
            color: 'var(--text-muted)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>Domain</label>
          <select
            value={domain}
            onChange={e => setDomain(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '9px 12px',
              fontSize: 14,
              borderRadius: 0,
              outline: 'none',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {isCustom && (
          <div style={{ flex: '2 1 260px' }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              color: 'var(--text-muted)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Custom domain name</label>
            <input
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value)}
              placeholder="e.g. municipal water utility"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '9px 12px',
                fontSize: 14,
                borderRadius: 0,
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !goal.trim() || goal.trim().length < 3}
        style={{
          width: '100%',
          marginTop: 16,
          padding: '14px',
          background: loading || !goal.trim() ? 'rgba(124,58,237,0.3)' : 'var(--primary)',
          color: '#fff',
          border: 'none',
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: loading || !goal.trim() ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { if (!loading && goal.trim()) e.currentTarget.style.background = '#6d28d9' }}
        onMouseLeave={e => { if (!loading && goal.trim()) e.currentTarget.style.background = 'var(--primary)' }}
      >
        {loading ? 'Analyzing...' : 'Run Analysis'}
      </button>

      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>Try:</span>
        {EXAMPLE_PILLS.map(pill => (
          <button
            key={pill.label}
            type="button"
            onClick={() => handleExample(pill)}
            disabled={loading}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: '4px 10px',
              fontSize: 12,
              borderRadius: 0,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </form>
  )
}
