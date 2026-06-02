import { useState } from 'react'
import { correlateClaims } from '../api'

function SeverityBadge({ s }) {
  const map = { LOW: 'badge-green', MEDIUM: 'badge-yellow', HIGH: 'badge-red' }
  return <span className={`badge ${map[s] || 'badge-blue'}`}>{s}</span>
}
function RiskBadge({ level }) {
  const map = { LOW: 'badge-green', MEDIUM: 'badge-yellow', HIGH: 'badge-red', CRITICAL: 'badge-red' }
  return <span className={`badge ${map[level] || 'badge-blue'}`}>{level}</span>
}

export default function Correlation() {
  const [query,   setQuery]   = useState('')
  const [topK,    setTopK]    = useState(10)
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState('')

  async function handleCorrelate() {
    if (!query.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await correlateClaims(query, topK)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const statSignals = result?.statistical_pre_signals || {}
  const hasStats    = Object.keys(statSignals).length > 0

  return (
    <>
      <div className="card">
        <h3>Cross-Claim Correlation Analysis</h3>
        <div className="form-group">
          <label>Investigation Query</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Multiple vehicle theft claims in the northeast region with similar amounts"
          />
        </div>
        <div className="form-group">
          <label>Claims to Analyse (Top-K)</label>
          <input type="number" value={topK} min={3} max={50} onChange={e => setTopK(+e.target.value)} />
        </div>
        <button className="btn-primary" onClick={handleCorrelate} disabled={loading || !query.trim()}>
          {loading ? 'Detecting…' : 'Detect Patterns'}
        </button>
      </div>

      {loading && <div className="loading-row"><span className="spinner" /><span>Detecting cross-claim patterns…</span></div>}
      {error   && <div className="error-box">Error: {error}</div>}

      {result && !loading && (
        <>
          <div className="card">
            <h3>Correlation Summary</h3>
            <div className="info-row">
              <span className="info-key">Overall Risk</span>
              <span className="info-val"><RiskBadge level={result.overall_correlation_risk} /></span>
            </div>
            <div className="info-row">
              <span className="info-key">Claims Analysed</span>
              <span className="info-val">{result.claims_analysed}</span>
            </div>
            {result.crag_triggered && (
              <div className="info-row">
                <span className="info-key">CRAG</span>
                <span className="info-val"><span className="badge badge-purple">Triggered</span></span>
              </div>
            )}
            <p style={{ marginTop: '.75rem', fontSize: 13 }}>{result.summary}</p>
          </div>

          {hasStats && (
            <div className="card">
              <h3>Statistical Pre-Signals (Rule-Based)</h3>
              {Object.entries(statSignals).map(([k, v]) => (
                <div key={k} className="info-row">
                  <span className="info-key">{k}</span>
                  <span className="info-val" style={{ maxWidth: '65%', wordBreak: 'break-word' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {result.signals?.length > 0 && (
            <div className="card">
              <h3>Detected Signals ({result.signals.length})</h3>
              {result.signals.map((s, i) => (
                <div key={i} className="signal-item">
                  <div className="signal-header">
                    <span className="badge badge-blue">{s.signal_type}</span>
                    <SeverityBadge s={s.severity} />
                  </div>
                  <div style={{ fontSize: 13, margin: '.3rem 0' }}>{s.description}</div>
                  {s.affected_claims?.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Affected: {s.affected_claims.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.investigation_flags?.length > 0 && (
            <div className="card">
              <h3>Investigation Flags</h3>
              <ul className="step-list">
                {result.investigation_flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  )
}
