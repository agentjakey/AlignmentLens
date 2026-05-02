export default function TrueObjective({ text, goal }) {
  return (
    <div style={{
      borderLeft: '3px solid var(--primary)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeftColor: 'var(--primary)',
      padding: '24px 28px',
      marginBottom: 24,
      animation: 'fadeSlideUp 0.5s ease forwards',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M12 6v6l4 2"/>
          <circle cx="12" cy="12" r="3" fill="var(--primary)" fillOpacity="0.3"/>
        </svg>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--primary)',
        }}>
          What did the agent actually optimize?
        </span>
      </div>

      <p style={{
        fontStyle: 'italic',
        fontSize: 17,
        color: 'var(--text)',
        lineHeight: 1.65,
        marginBottom: 12,
      }}>
        "{text}"
      </p>

      <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
        This is the gap between the stated goal (<span style={{ color: 'var(--text-muted)' }}>"{goal}"</span>) and the revealed objective —
        the core problem in AI alignment.
      </p>
    </div>
  )
}
