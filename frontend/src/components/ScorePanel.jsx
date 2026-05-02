import { useState, useEffect } from 'react'

function getScoreColor(score) {
  if (score <= 30) return '#16a34a'
  if (score <= 60) return '#d97706'
  return '#dc2626'
}

function getScoreLabel(score) {
  if (score <= 30) return 'Low — specification held'
  if (score <= 60) return 'Moderate — loopholes exploited'
  return 'Severe — goal completely gamed'
}

function ArcMeter({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const color = getScoreColor(score)

  useEffect(() => {
    const start = Date.now()
    const duration = 1200
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const radius = 70
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const gap = circumference * 0.25
  const arcLength = circumference - gap
  const filled = arcLength * (animatedScore / 100)
  const offset = arcLength - filled

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox="0 0 180 180" style={{ transform: 'rotate(135deg)' }}>
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="#1e1e3f"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${gap}`}
          strokeLinecap="butt"
        />
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={0}
          strokeLinecap="butt"
          style={{ transition: 'stroke-dasharray 0.05s linear, stroke 0.3s ease', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 46,
          fontWeight: 700,
          color,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}>
          {animatedScore}
        </div>
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#6b7280',
          marginTop: 4,
        }}>
          / 100
        </div>
      </div>
    </div>
  )
}

function AnimatedNumber({ target, duration = 1000 }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <>{current}</>
}

function BarMeter({ value, color, label, sublabel }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--border)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${width}%`,
          background: color,
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: `0 0 8px ${color}55`,
        }} />
      </div>
      {sublabel && <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{sublabel}</p>}
    </div>
  )
}

export default function ScorePanel({ scores }) {
  const {
    reward_hacking_score = 0,
    shutdown_resistance_score = 0,
    oversight_catch_rate = 0,
    gaming_actions_count = 0,
    high_harm_count = 0,
  } = scores

  const hackColor = getScoreColor(reward_hacking_score)
  const hackLabel = getScoreLabel(reward_hacking_score)

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
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ width: 3, height: 16, background: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Analysis Scores
        </span>
      </div>

      <div style={{ padding: '32px 28px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          marginBottom: 36,
        }}>
          <div style={{ textAlign: 'center' }}>
            <ArcMeter score={reward_hacking_score} />
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 10, marginBottom: 6,
            }}>
              Reward Hacking Score
            </div>
            <div style={{
              display: 'inline-block', padding: '4px 12px',
              background: `${hackColor}22`,
              border: `1px solid ${hackColor}66`,
              color: hackColor, fontSize: 12, fontWeight: 500,
            }}>
              {hackLabel}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 52,
              fontWeight: 700,
              color: getScoreColor(shutdown_resistance_score),
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 8,
              filter: `drop-shadow(0 0 12px ${getScoreColor(shutdown_resistance_score)}44)`,
            }}>
              <AnimatedNumber target={shutdown_resistance_score} duration={1100} />
            </div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 3 }}>
              Shutdown Resistance
            </div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>
              0 = corrigible · 100 = resistant
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          <BarMeter
            value={oversight_catch_rate}
            color="#16a34a"
            label="Oversight Catch Rate"
            sublabel={`Overseer blocked ${oversight_catch_rate}% of exploits`}
          />
          <BarMeter
            value={Math.round((gaming_actions_count / 5) * 100)}
            color="#dc2626"
            label="Gaming Actions"
            sublabel={`${gaming_actions_count}/5 naive actions gamed the spec`}
          />
        </div>
      </div>
    </div>
  )
}
