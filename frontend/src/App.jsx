import { useState, useCallback } from 'react'
import './App.css'
import Header from './components/Header'
import GoalInput from './components/GoalInput'
import LoadingState from './components/LoadingState'
import ScorePanel from './components/ScorePanel'
import ActionTimeline from './components/ActionTimeline'
import TrueObjective from './components/TrueObjective'
import BlueDotTags from './components/BlueDotTags'
import SharePanel from './components/SharePanel'
import EmptyState from './components/EmptyState'
import IntroAnimation from './components/IntroAnimation'
import Footer from './components/Footer'

const hasSeenIntro = () => {
  try { return sessionStorage.getItem('al_intro_seen') === '1' } catch { return false }
}
const markIntroSeen = () => {
  try { sessionStorage.setItem('al_intro_seen', '1') } catch {}
}

export default function App() {
  const [showIntro, setShowIntro] = useState(!hasSeenIntro())
  const [goal, setGoal] = useState('')
  const [domain, setDomain] = useState('Social media platform')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [rateLimited, setRateLimited] = useState(false)

  const handleIntroDone = useCallback(() => {
    markIntroSeen()
    setShowIntro(false)
  }, [])

  async function handleSubmit() {
    if (!goal.trim() || goal.trim().length < 3) return
    setLoading(true)
    setResults(null)
    setError(null)
    setRateLimited(false)

    try {
      const response = await fetch(`${window.location.origin}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim(), domain }),
      })

      if (response.status === 429) {
        setRateLimited(true)
        setLoading(false)
        return
      }

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Analysis failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function fillExample(exGoal, exDomain) {
    setGoal(exGoal)
    setDomain(exDomain)
    setResults(null)
    setError(null)
    setRateLimited(false)
  }

  return (
    <>
      {showIntro && <IntroAnimation onDone={handleIntroDone} />}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <Header />

        <GoalInput
          goal={goal}
          setGoal={setGoal}
          domain={domain}
          setDomain={setDomain}
          onSubmit={handleSubmit}
          loading={loading}
          onExample={fillExample}
        />

        {rateLimited && (
          <div style={{
            background: 'rgba(217,119,6,0.1)',
            border: '1px solid var(--caution)',
            color: '#fcd34d',
            padding: '16px 20px',
            marginTop: 16,
            lineHeight: 1.7,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>
              ⏱ Hourly limit reached
            </div>
            <div style={{ fontSize: 13, color: '#fde68a' }}>
              You've run 5 analyses this hour — the limit keeps this demo free for everyone.
              Come back in an hour, or{' '}
              <a
                href="https://github.com/agentjakey/alignmentLens"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', textDecoration: 'underline' }}
              >
                clone the repo
              </a>
              {' '}and run it locally with your own API key.
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--danger-dim)',
            border: '1px solid var(--danger)',
            color: '#fca5a5',
            padding: '12px 16px',
            marginTop: 16,
            fontSize: 14,
          }}>
            ⚠ {error}
          </div>
        )}

        {loading && <LoadingState />}

        {!loading && !results && !error && !rateLimited && (
          <EmptyState onSelect={fillExample} />
        )}

        {results && !loading && (
          <>
            <ScorePanel scores={results.scores} />
            <ActionTimeline
              naive={results.naive_agent?.actions || []}
              overseen={results.overseen_agent?.actions || []}
            />
            <TrueObjective text={results.true_objective} goal={results.goal} />
            <BlueDotTags tags={results.bluedot_tags || []} />
            <SharePanel results={results} />
          </>
        )}

        <Footer />
      </div>
    </>
  )
}
