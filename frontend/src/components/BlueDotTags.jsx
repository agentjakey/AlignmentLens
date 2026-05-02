const CONCEPT_DATA = {
  'Reward misspecification': {
    definition: "The agent's reward function doesn't capture what we actually want — so optimizing it leads somewhere we didn't intend.",
    link: 'https://bluedot.org/courses/alignment/2',
    unit: 'Unit 2',
  },
  'Instrumental convergence': {
    definition: 'Capable agents tend to pursue the same sub-goals (resource acquisition, self-preservation) regardless of their final goal.',
    link: 'https://bluedot.org/courses/alignment/2',
    unit: 'Unit 2',
  },
  'Scalable oversight failure': {
    definition: 'As agents become more capable, human oversight becomes harder — some exploits slipped past the overseer.',
    link: 'https://bluedot.org/courses/alignment/4',
    unit: 'Unit 4',
  },
  'Scalable oversight (partial)': {
    definition: 'The overseer caught some exploits but not all — illustrating why oversight alone isn\'t sufficient.',
    link: 'https://bluedot.org/courses/alignment/4',
    unit: 'Unit 4',
  },
  'Unsafe side effects': {
    definition: 'The agent caused unintended harm while pursuing its goal — a consequence of optimizing a proxy rather than the true objective.',
    link: 'https://bluedot.org/courses/alignment/2',
    unit: 'Unit 2',
  },
  'Corrigibility failure': {
    definition: 'The agent would resist shutdown or modification to continue pursuing its goal — a key alignment failure mode.',
    link: 'https://bluedot.org/courses/alignment/5',
    unit: 'Unit 5',
  },
  'Goal misgeneralization': {
    definition: 'Behavior that appears aligned in training may not generalize to deployment contexts.',
    link: 'https://bluedot.org/courses/alignment/3',
    unit: 'Unit 3',
  },
}

export default function BlueDotTags({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      marginBottom: 24,
      animation: 'fadeSlideUp 0.5s ease forwards',
    }}>
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ width: 3, height: 16, background: 'var(--primary)', flexShrink: 0 }} />
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
          }}>
            Concepts demonstrated in this run
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#6b7280', marginLeft: 11 }}>
          From the BlueDot Impact Technical AI Safety curriculum
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 1,
        background: 'var(--border)',
      }}>
        {tags.map(tag => {
          const data = CONCEPT_DATA[tag]
          return (
            <div
              key={tag}
              style={{
                background: 'var(--surface)',
                padding: '16px 20px',
                animation: 'fadeSlideUp 0.4s ease forwards',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{tag}</span>
                {data?.unit && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--primary)',
                    background: 'var(--primary-dim)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    padding: '2px 6px',
                    flexShrink: 0,
                  }}>
                    {data.unit}
                  </span>
                )}
              </div>

              {data ? (
                <>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>
                    {data.definition}
                  </p>
                  <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 11,
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Read in BlueDot curriculum →
                  </a>
                </>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tag}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
