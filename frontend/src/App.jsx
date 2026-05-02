import { useState } from 'react'
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

export default function App() {
  const [goal, setGoal] = useState('')
  const [domain, setDomain] = useState('Social media platform')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit() {
    if (!goal.trim() || goal.trim().length < 3) return
    setLoading(true)
    setResults(null)
    setError(null)

    try {
      const response = await fetch(`${window.location.origin}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim(), domain }),
      })
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
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 64px' }}>
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

      {!loading && !results && !error && (
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
    </div>
  )
}
