export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: 48,
      paddingTop: 24,
      paddingBottom: 32,
      color: '#6b7280',
      fontSize: 12,
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 16,
      }}>
        <div style={{ lineHeight: 1.7 }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
            Built on May 2, 2026 during Replit's 10th birthday — 24-hour free build
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a
              href="https://github.com/agentjakey/alignmentLens"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              GitHub
            </a>
            <span style={{ color: 'var(--border)' }}>·</span>
            <a
              href="https://bluedot.org/courses/technical-ai-safety"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              BlueDot AI Safety Course
            </a>
            <span style={{ color: 'var(--border)' }}>·</span>
            <a
              href="https://www.anthropic.com/api"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
              Anthropic API
            </a>
          </div>
        </div>

        <img
          src="https://visitor-badge.laobi.icu/badge?page_id=agentjakey.AlignmentLens"
          alt="visitor count"
          style={{ height: 20, opacity: 0.7 }}
        />
      </div>

      <div style={{ fontSize: 11, color: '#374151' }}>
        Powered by Claude Haiku · Rate limited to 5 analyses/IP/hour · MIT License
      </div>
    </footer>
  )
}
