import { useState } from 'react'
import { analyzeClaim, resumeAnalysis } from '../api'

function RiskBadge({ level }) {
  const map = { LOW: 'badge-green', MEDIUM: 'badge-yellow', HIGH: 'badge-red', CRITICAL: 'badge-red' }
  return <span className={`badge ${map[level] || 'badge-blue'}`}>{level}</span>
}
function DecisionBadge({ d }) {
  const map = { APPROVE: 'badge-green', INVESTIGATE: 'badge-yellow', ESCALATE: 'badge-red', REJECT: 'badge-purple' }
  return <span className={`badge ${map[d] || 'badge-blue'}`} style={{ fontSize: 13, padding: '4px 12px' }}>{d}</span>
}
function riskColor(p) {
  if (p < 0.3) return '#1a9e5a'
  if (p < 0.6) return '#e69900'
  return '#d93025'
}

const SAMPLE_QUERIES = [
  'Sport vehicle collision, fault on policy holder, police report not filed, 3 past claims',
  'Sedan liability claim in urban area, witness present, no police report, more than 4 past claims',
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
    try {
      const data = await analyzeClaim(query, tid)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResume(decision) {
    setLoading(true); setError('')
    try {
      const data = await resumeAnalysis(threadId, decision)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setQuery(''); setResult(null); setError(''); setThreadId(null)
  }

  const risk   = result?.risk_assessment   || {}
  const policy = result?.policy_validation || {}
  const rec    = result?.recommendation    || {}
  const corr   = result?.correlation_signals || {}
  const prob   = risk.fraud_probability ?? 0
  const pct    = (prob * 100).toFixed(1)
  const flags  = (result?.guardrail_flags || []).filter(f => f !== 'OK')

  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>Full Fraud Investigation</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: '.25rem' }}>
          Multi-agent AI pipeline — retrieval → correlation → risk scoring → policy validation → recommendation
        </p>
      </div>

      {/* Input card */}
      <div className="card">
        <div className="form-group">
          <label>Claim Description</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Describe the claim in detail — vehicle type, policy type, accident area, fault, past claims, police report status…"
          />
        </div>

        {/* Sample queries */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Try a sample query
          </div>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {SAMPLE_QUERIES.map((q, i) => (
              <button key={i} className="btn-outline" onClick={() => setQuery(q)}
                style={{ fontSize: 11, padding: '.3rem .7rem' }}>
                Sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="btn-primary" onClick={handleAnalyze} disabled={loading || !query.trim()}>
            {loading ? 'Analysing…' : '🧠  Run Investigation'}
          </button>
          <button className="btn-secondary" onClick={handleClear}>Clear</button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, margin: '0 auto .75rem' }} />
          <div style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>Running multi-agent investigation pipeline…</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: '.25rem' }}>Retrieval → Correlation → Risk → Policy → Recommendation</div>
        </div>
      )}

      {error && <div className="error-box">⚠ {error}</div>}

      {/* HITL */}
      {result?.awaiting_human && !loading && (
        <div className="hitl-banner">
          <h4>⚠️ Human Review Required</h4>
          <p style={{ fontSize: 13, color: '#78350f', marginBottom: '.75rem' }}>
            The fraud probability falls in the uncertainty band (40–60%). Please review the analysis and provide your decision.
          </p>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ background: 'var(--green)' }} onClick={() => handleResume('approve')}>✓ Approve</button>
            <button className="btn-primary" style={{ background: 'var(--red)' }} onClick={() => handleResume('escalate')}>⚠ Escalate</button>
            <button className="btn-primary" style={{ background: 'var(--yellow)', color: '#000' }} onClick={() => handleResume('reject')}>✕ Reject</button>
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          {flags.length > 0 && <div className="error-box">Guardrail flags: {flags.join(', ')}</div>}

          {/* Risk + Policy */}
          <div className="analysis-grid">
            {/* Risk */}
            <div className="card">
              <h3>Risk Assessment</h3>
              {risk.risk_level ? (
                <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '.5rem' }}>
                      <div>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: riskColor(prob) }}>{pct}%</span>
                        <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: '.4rem' }}>fraud probability</span>
                      </div>
                      <RiskBadge level={risk.risk_level} />
                    </div>
                    <div className="risk-meter-bar">
                      <div className="risk-meter-fill" style={{ width: `${pct}%`, background: riskColor(prob) }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: '.4rem' }}>
                      Model confidence: {((risk.confidence ?? 0) * 100).toFixed(0)}% ·
                      Human review: {risk.requires_human_review ? '⚠ Required' : '✓ Not required'}
                    </div>
                  </div>
                  {risk.key_risk_factors?.length > 0 && (
                    <>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Key Risk Factors</div>
                      <ul className="step-list">
                        {risk.key_risk_factors.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </>
                  )}
                </>
              ) : <p style={{ color: 'var(--muted)' }}>Not yet computed.</p>}
            </div>

            {/* Policy */}
            <div className="card">
              <h3>Policy Validation</h3>
              {policy.validation_summary ? (
                <>
                  <div className="info-row">
                    <span className="info-key">Policy Status</span>
                    <span className="info-val">
                      {policy.is_policy_valid
                        ? <span className="badge badge-green">✓ Valid</span>
                        : <span className="badge badge-red">✕ Invalid</span>}
                    </span>
                  </div>
                  {policy.violations?.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Violations</div>
                      <ul className="step-list">
                        {policy.violations.map((v, i) => <li key={i} style={{ color: 'var(--red)' }}>✕ {v}</li>)}
                      </ul>
                    </div>
                  )}
                  {policy.eligibility_flags?.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Eligibility Flags</div>
                      <ul className="step-list">
                        {policy.eligibility_flags.map((f, i) => <li key={i} style={{ color: 'var(--yellow)' }}>⚠ {f}</li>)}
                      </ul>
                    </div>
                  )}
                  <div style={{ marginTop: '.75rem', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>{policy.validation_summary}</div>
                </>
              ) : <p style={{ color: 'var(--muted)' }}>Not yet computed.</p>}
            </div>
          </div>

          {/* Correlation */}
          {corr.overall_correlation_risk && (
            <div className="card">
              <h3>Correlation Analysis</h3>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '.75rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.2rem', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Overall Correlation Risk</div>
                  <RiskBadge level={corr.overall_correlation_risk} />
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '.75rem', fontStyle: 'italic' }}>{corr.summary}</p>
              {corr.signals?.map((s, i) => (
                <div key={i} className="signal-item">
                  <div className="signal-header">
                    <span className="badge badge-blue">{s.signal_type}</span>
                    <span className={`badge badge-${s.severity === 'HIGH' ? 'red' : s.severity === 'MEDIUM' ? 'yellow' : 'green'}`}>{s.severity}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)' }}>{s.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {rec.decision && (
            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <h3>Investigation Recommendation</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.35rem', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Decision</div>
                  <DecisionBadge d={rec.decision} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.35rem', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Priority</div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{rec.priority}</span>
                </div>
                {rec.estimated_fraud_savings && (
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.2rem', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700 }}>Est. Fraud Savings</div>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)' }}>{rec.estimated_fraud_savings}</span>
                  </div>
                )}
              </div>
              {rec.escalation_reason && (
                <div className="error-box" style={{ marginBottom: '.75rem' }}>🚨 Escalation Reason: {rec.escalation_reason}</div>
              )}
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>{rec.evidence_summary}</p>
              {rec.investigation_steps?.length > 0 && (
                <>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Recommended Investigation Steps</div>
                  <ul className="step-list">
                    {rec.investigation_steps.map((s, i) => <li key={i}><strong style={{ color: 'var(--primary)' }}>{i + 1}.</strong> {s}</li>)}
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
