import { useState } from 'react'
import { correlateClaims } from '../api'

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Cross-Claim Correlation</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: '.25rem' }}>
          Detect fraud rings, regional hotspots, amount clustering, and repeat-customer patterns across claims
        </p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Investigation Query</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Multiple fraud claims in urban areas with Sedan liability policies and no police reports"
          />
        </div>
        <div className="form-group">
          <label>Claims to Analyse (Top-K)</label>
          <input type="number" value={topK} min={3} max={50} onChange={e => setTopK(+e.target.value)} style={{ maxWidth: 120 }} />
        </div>
        <button className="btn-primary" onClick={handleCorrelate} disabled={loading || !query.trim()}>
          {loading ? 'Detecting…' : '🔗  Detect Patterns'}
        </button>
      </div>

      {loading && <div className="loading-row"><span className="spinner" /><span>Analysing cross-claim patterns…</span></div>}
      {error   && <div className="error-box">⚠ {error}</div>}

      {result && !loading && (
        <>
          {/* Summary */}
          <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <h3>Correlation Summary</h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.3rem', fontWeight: 700, textTransform: 'uppercase' }}>Overall Risk</div>
                <RiskBadge level={result.overall_correlation_risk} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.3rem', fontWeight: 700, textTransform: 'uppercase' }}>Claims Analysed</div>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{result.claims_analysed}</span>
              </div>
              {result.crag_triggered && (
                <div style={{ alignSelf: 'flex-end' }}>
                  <span className="badge badge-purple">CRAG Triggered</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>{result.summary}</p>
          </div>

          {/* Stats */}
          {hasStats && (
            <div className="card">
              <h3>Statistical Pre-Signals (Rule-Based)</h3>
              {Object.entries(statSignals).map(([k, v]) => (
                <div key={k} className="info-row">
                  <span className="info-key" style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                  <span className="info-val" style={{ maxWidth: '65%', wordBreak: 'break-word', textAlign: 'right', fontSize: 12 }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Signals */}
          {result.signals?.length > 0 && (
            <div className="card">
              <h3>Detected Signals ({result.signals.length})</h3>
              {result.signals.map((s, i) => (
                <div key={i} className="signal-item">
                  <div className="signal-header">
                    <span className="badge badge-blue">{s.signal_type.replace(/_/g, ' ')}</span>
                    <span className={`badge badge-${s.severity === 'HIGH' ? 'red' : s.severity === 'MEDIUM' ? 'yellow' : 'green'}`}>{s.severity}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', margin: '.35rem 0' }}>{s.description}</div>
                  {s.affected_claims?.length > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Claims involved: {s.affected_claims.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Flags */}
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
