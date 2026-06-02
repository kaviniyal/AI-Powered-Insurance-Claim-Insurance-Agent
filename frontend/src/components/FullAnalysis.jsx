import { useState } from 'react'
import { analyzeClaim, resumeAnalysis } from '../api'

function RiskBadge({ level }) {
  const map = { LOW:'badge-green', MEDIUM:'badge-yellow', HIGH:'badge-red', CRITICAL:'badge-red' }
  return <span className={`badge ${map[level]||'badge-blue'}`}>{level}</span>
}
function DecisionBadge({ d }) {
  const map = { APPROVE:'badge-green', INVESTIGATE:'badge-yellow', ESCALATE:'badge-red', REJECT:'badge-purple' }
  return <span className={`badge ${map[d]||'badge-blue'}`} style={{ fontSize:14, padding:'5px 14px' }}>{d}</span>
}
function riskColor(p) {
  if (p < 0.3) return '#10b981'
  if (p < 0.6) return '#f59e0b'
  return '#ef4444'
}

const SAMPLES = [
  'Sport vehicle collision in urban area, fault on policy holder, police report not filed, 3 past claims',
  'Sedan liability claim, witness present, no police report, more than 4 past claims, urban area',
  'Utility vehicle claim, third party fault, address changed before claim, driver rating 4',
]

export default function FullAnalysis() {
  const [query,    setQuery]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [threadId, setThreadId] = useState(null)
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState('')

  async function handleAnalyze() {
    if (!query.trim()) return
    const tid = 'thread_' + Math.random().toString(36).slice(2)
    setThreadId(tid); setLoading(true); setError(''); setResult(null)
    try { setResult(await analyzeClaim(query, tid)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleResume(decision) {
    setLoading(true); setError('')
    try { setResult(await resumeAnalysis(threadId, decision)) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function handleClear() { setQuery(''); setResult(null); setError(''); setThreadId(null) }

  const risk   = result?.risk_assessment || {}
  const policy = result?.policy_validation || {}
  const rec    = result?.recommendation || {}
  const corr   = result?.correlation_signals || {}
  const prob   = risk.fraud_probability ?? 0
  const pct    = (prob * 100).toFixed(1)
  const flags  = (result?.guardrail_flags || []).filter(f => f !== 'OK')

  return (
    <>
      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#0a0e1a,#0d1b3e)',
        borderRadius:16, padding:'1.75rem 2rem',
        marginBottom:'1.5rem', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(0,85,255,.08)' }} />
        <div style={{ position:'relative' }}>
          <span style={{ background:'rgba(0,85,255,.2)', border:'1px solid rgba(0,85,255,.4)', borderRadius:20, padding:'3px 12px', fontSize:11, color:'#60a5fa', fontWeight:700 }}>
            5-Agent AI Pipeline
          </span>
          <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:900, margin:'.6rem 0 .3rem' }}>🧠 Full Fraud Investigation</h1>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:13 }}>
            Retrieval → Correlation → Risk Scoring → Policy Validation → Recommendation
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="card">
        <div className="form-group">
          <label>Claim Description</label>
          <textarea value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Describe the claim — vehicle type, policy type, accident area, fault, past claims, police report status…" />
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <div style={{ fontSize:11, color:'#94a3b8', marginBottom:'.5rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em' }}>Try a sample</div>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {SAMPLES.map((q,i) => (
              <button key={i} className="btn-outline" style={{ fontSize:11, padding:'.3rem .75rem' }}
                onClick={() => setQuery(q)}>Sample {i+1}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'.5rem' }}>
          <button className="btn-primary" onClick={handleAnalyze} disabled={loading || !query.trim()}>
            {loading ? '⏳ Analysing…' : '🧠  Run Investigation'}
          </button>
          <button className="btn-secondary" onClick={handleClear}>Clear</button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'2.5rem' }}>
          <div className="spinner" style={{ width:44, height:44, borderWidth:4, margin:'0 auto 1rem' }} />
          <div style={{ fontSize:14, color:'#0f172a', fontWeight:700, marginBottom:'.3rem' }}>Running investigation pipeline…</div>
          <div style={{ fontSize:12, color:'#94a3b8' }}>Retrieval → Correlation → Risk → Policy → Recommendation</div>
        </div>
      )}
      {error && <div className="error-box">⚠ {error}</div>}

      {/* HITL */}
      {result?.awaiting_human && !loading && (
        <div className="hitl-banner">
          <h4>⚠️ Human Review Required</h4>
          <p style={{ fontSize:13, color:'#78350f', marginBottom:'.75rem' }}>
            Fraud probability in uncertainty band (40–60%). Please review and provide your decision.
          </p>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            <button className="btn-primary" style={{ background:'linear-gradient(135deg,#10b981,#059669)' }} onClick={() => handleResume('approve')}>✓ Approve</button>
            <button className="btn-primary" style={{ background:'linear-gradient(135deg,#ef4444,#b91c1c)' }} onClick={() => handleResume('escalate')}>⚠ Escalate</button>
            <button className="btn-primary" style={{ background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#000' }} onClick={() => handleResume('reject')}>✕ Reject</button>
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          {flags.length > 0 && <div className="error-box">Guardrail flags: {flags.join(', ')}</div>}

          {/* Risk + Policy */}
          <div className="analysis-grid">
            <div className="card" style={{ borderTop:'4px solid #ef4444' }}>
              <h3>📊 Risk Assessment</h3>
              {risk.risk_level ? (
                <>
                  <div style={{ marginBottom:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'.6rem' }}>
                      <div>
                        <span style={{ fontSize:'2.2rem', fontWeight:900, color:riskColor(prob) }}>{pct}%</span>
                        <span style={{ fontSize:12, color:'#94a3b8', marginLeft:'.4rem' }}>fraud probability</span>
                      </div>
                      <RiskBadge level={risk.risk_level} />
                    </div>
                    <div className="risk-meter-bar">
                      <div className="risk-meter-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${riskColor(prob)},${riskColor(prob)}cc)` }} />
                    </div>
                    <div style={{ fontSize:11, color:'#94a3b8', marginTop:'.4rem' }}>
                      Confidence: {((risk.confidence??0)*100).toFixed(0)}% · Human review: {risk.requires_human_review ? '⚠ Required' : '✓ Not required'}
                    </div>
                  </div>
                  {risk.key_risk_factors?.length > 0 && (
                    <>
                      <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.5rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Key Risk Factors</div>
                      <ul className="step-list">
                        {risk.key_risk_factors.map((f,i) => <li key={i}>{f}</li>)}
                      </ul>
                    </>
                  )}
                </>
              ) : <p style={{ color:'#94a3b8' }}>Not yet computed.</p>}
            </div>

            <div className="card" style={{ borderTop:'4px solid #0055ff' }}>
              <h3>📋 Policy Validation</h3>
              {policy.validation_summary ? (
                <>
                  <div className="info-row">
                    <span className="info-key">Status</span>
                    <span className="info-val">
                      {policy.is_policy_valid
                        ? <span className="badge badge-green">✓ Valid</span>
                        : <span className="badge badge-red">✕ Invalid</span>}
                    </span>
                  </div>
                  {policy.violations?.length > 0 && (
                    <div style={{ marginTop:'1rem' }}>
                      <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.4rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Violations</div>
                      <ul className="step-list">
                        {policy.violations.map((v,i) => <li key={i} style={{ color:'#ef4444' }}>✕ {v}</li>)}
                      </ul>
                    </div>
                  )}
                  {policy.eligibility_flags?.length > 0 && (
                    <div style={{ marginTop:'1rem' }}>
                      <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.4rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Eligibility Flags</div>
                      <ul className="step-list">
                        {policy.eligibility_flags.map((f,i) => <li key={i} style={{ color:'#f59e0b' }}>⚠ {f}</li>)}
                      </ul>
                    </div>
                  )}
                  <p style={{ marginTop:'.75rem', fontSize:12, color:'#64748b', fontStyle:'italic' }}>{policy.validation_summary}</p>
                </>
              ) : <p style={{ color:'#94a3b8' }}>Not yet computed.</p>}
            </div>
          </div>

          {/* Correlation */}
          {corr.overall_correlation_risk && (
            <div className="card" style={{ borderTop:'4px solid #7c3aed' }}>
              <h3>🔗 Correlation Analysis</h3>
              <div style={{ display:'flex', gap:'2rem', alignItems:'center', marginBottom:'.75rem', flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.3rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Overall Correlation Risk</div>
                  <RiskBadge level={corr.overall_correlation_risk} />
                </div>
              </div>
              <p style={{ fontSize:13, color:'#64748b', marginBottom:'.75rem', fontStyle:'italic' }}>{corr.summary}</p>
              {corr.signals?.map((s,i) => (
                <div key={i} className="signal-item">
                  <div className="signal-header">
                    <span className="badge badge-purple">{s.signal_type}</span>
                    <span className={`badge badge-${s.severity==='HIGH'?'red':s.severity==='MEDIUM'?'yellow':'green'}`}>{s.severity}</span>
                  </div>
                  <div style={{ fontSize:13, color:'#0f172a' }}>{s.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {rec.decision && (
            <div className="card" style={{ borderTop:'4px solid #00c9a7', background:'linear-gradient(135deg,#fff,#f0fdf9)' }}>
              <h3>✅ Investigation Recommendation</h3>
              <div style={{ display:'flex', alignItems:'center', gap:'2rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.35rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Decision</div>
                  <DecisionBadge d={rec.decision} />
                </div>
                <div>
                  <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.35rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Priority</div>
                  <span style={{ fontSize:'1.6rem', fontWeight:900, color:'#0055ff' }}>{rec.priority}</span>
                </div>
                {rec.estimated_fraud_savings && (
                  <div style={{ marginLeft:'auto', textAlign:'right' }}>
                    <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.2rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Est. Fraud Savings</div>
                    <span style={{ fontSize:'1.4rem', fontWeight:900, color:'#10b981' }}>{rec.estimated_fraud_savings}</span>
                  </div>
                )}
              </div>
              {rec.escalation_reason && <div className="error-box">🚨 {rec.escalation_reason}</div>}
              <p style={{ fontSize:13, color:'#64748b', marginBottom:'1rem', paddingBottom:'1rem', borderBottom:'1px solid #f1f5f9' }}>{rec.evidence_summary}</p>
              {rec.investigation_steps?.length > 0 && (
                <>
                  <div style={{ fontSize:10.5, color:'#94a3b8', marginBottom:'.5rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em' }}>Investigation Steps</div>
                  <ul className="step-list">
                    {rec.investigation_steps.map((s,i) => (
                      <li key={i}><strong style={{ color:'#0055ff' }}>{i+1}.</strong> {s}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
