import { useState } from 'react'
import { correlateClaims } from '../api'

function RiskBadge({ level }) {
  const map = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-red', CRITICAL:'badge-red' }
  return <span className={`badge ${map[level]||'badge-blue'}`}>{level}</span>
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
      setResult(await correlateClaims(query, topK))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const statSignals = result?.statistical_pre_signals || {}

  return (
    <>
      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#0a0e1a,#1a0a3e)',
        borderRadius:16, padding:'1.75rem 2rem',
        marginBottom:'1.5rem', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(124,58,237,.08)' }} />
        <div style={{ position:'relative' }}>
          <span style={{ background:'rgba(124,58,237,.2)', border:'1px solid rgba(124,58,237,.4)', borderRadius:20, padding:'3px 12px', fontSize:11, color:'#a78bfa', fontWeight:700 }}>
            Statistical + LLM Pattern Detection
          </span>
          <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:900, margin:'.6rem 0 .3rem' }}>🔗 Correlation Analysis</h1>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:13 }}>
            Detect fraud rings, regional hotspots, amount clustering, and repeat-customer patterns across claims
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <div className="form-group">
          <label>Investigation Query</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Multiple fraud claims in urban areas with Sedan liability policies and no police reports"
          />
        </div>
        <div className="form-group" style={{ marginBottom:'1rem', maxWidth:200 }}>
          <label>Claims to Analyse (Top-K)</label>
          <input type="number" value={topK} min={3} max={50} onChange={e => setTopK(+e.target.value)} />
        </div>
        <button className="btn-primary" style={{ background:'linear-gradient(135deg,#7c3aed,#6d28d9)' }} onClick={handleCorrelate} disabled={loading || !query.trim()}>
          {loading ? '⏳ Detecting…' : '🔗  Detect Patterns'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'2rem' }}>
          <div className="spinner" style={{ width:36, height:36, borderWidth:3, borderTopColor:'#7c3aed', margin:'0 auto .75rem' }} />
          <div style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Analysing cross-claim patterns…</div>
        </div>
      )}
      {error && <div className="error-box">⚠ {error}</div>}

      {result && !loading && (
        <>
          {/* Summary */}
          <div className="card" style={{ borderTop:'4px solid #7c3aed' }}>
            <h3>Correlation Summary</h3>
            <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap', marginBottom:'1rem' }}>
              <div>
                <div style={{ fontSize:11, color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'.3rem' }}>Overall Risk</div>
                <RiskBadge level={result.overall_correlation_risk} />
              </div>
              <div>
                <div style={{ fontSize:11, color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'.3rem' }}>Claims Analysed</div>
                <span style={{ fontWeight:800, fontSize:'1.2rem', color:'#7c3aed' }}>{result.claims_analysed}</span>
              </div>
              {result.crag_triggered && <div style={{ alignSelf:'flex-end' }}><span className="badge badge-purple">⚡ CRAG Triggered</span></div>}
            </div>
            <p style={{ fontSize:13, color:'#64748b', fontStyle:'italic', lineHeight:1.7 }}>{result.summary}</p>
          </div>

          {/* Statistical signals */}
          {Object.keys(statSignals).length > 0 && (
            <div className="card">
              <h3>⚡ Statistical Pre-Signals (Rule-Based)</h3>
              {Object.entries(statSignals).map(([k,v]) => (
                <div key={k} className="info-row">
                  <span className="info-key" style={{ textTransform:'capitalize' }}>{k.replace(/_/g,' ')}</span>
                  <span className="info-val" style={{ fontSize:12, maxWidth:'60%', textAlign:'right', wordBreak:'break-word' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Detected signals */}
          {result.signals?.length > 0 && (
            <div className="card">
              <h3>🔍 Detected Signals ({result.signals.length})</h3>
              {result.signals.map((s,i) => (
                <div key={i} className="signal-item">
                  <div className="signal-header">
                    <span className="badge badge-purple">{s.signal_type.replace(/_/g,' ')}</span>
                    <span className={`badge badge-${s.severity==='HIGH'?'red':s.severity==='MEDIUM'?'yellow':'green'}`}>{s.severity}</span>
                  </div>
                  <div style={{ fontSize:13, color:'#0f172a', margin:'.3rem 0' }}>{s.description}</div>
                  {s.affected_claims?.length > 0 && (
                    <div style={{ fontSize:11, color:'#94a3b8' }}>Claims involved: {s.affected_claims.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Flags */}
          {result.investigation_flags?.length > 0 && (
            <div className="card" style={{ borderTop:'4px solid #ff6b35' }}>
              <h3>🚩 Investigation Flags</h3>
              <ul className="step-list">
                {result.investigation_flags.map((f,i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  )
}
