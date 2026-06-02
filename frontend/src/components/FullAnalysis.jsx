import { useState } from 'react'
import { analyzeClaim, resumeAnalysis } from '../api'

function RiskBadge({ level }) {
  const map = { LOW: 'badge-green', MEDIUM: 'badge-yellow', HIGH: 'badge-red', CRITICAL: 'badge-red' }
  return <span className={`badge ${map[level] || 'badge-blue'}`}>{level}</span>
}
function DecisionBadge({ d }) {
  const map = { APPROVE: 'badge-green', INVESTIGATE: 'badge-yellow', ESCALATE: 'badge-red', REJECT: 'badge-purple' }
  return <span className={`badge ${map[d] || 'badge-blue'}`}>{d}</span>
}
function riskColor(p) {
  if (p < 0.3) return 'var(--green)'
  if (p < 0.6) return 'var(--yellow)'
  return 'var(--red)'
}

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
      <div className="card">
        <h3>Full Fraud Investigation Pipeline</h3>
        <div className="form-group">
          <label>Claim Description</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Describe the claim in detail — policy type, incident, amount, customer history, red flags…"
          />
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button className="btn-primary" onClick={handleAnalyze} disabled={loading || !query.trim()}>
            {loading ? 'Analysing…' : 'Run Investigation'}
          </button>
          <button className="btn-secondary" onClick={handleClear}>Clear</button>
        </div>
      </div>

      {loading && <div className="loading-row"><span className="spinner" /><span>Running pipeline…</span></div>}
      {error   && <div className="error-box">Error: {error}</div>}

      {/* HITL banner */}
      {result?.awaiting_human && !loading && (
        <div className="hitl-banner">
          <h4>⚠ Human Review Required</h4>
          <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: '.75rem' }}>
            Fraud probability falls in the uncertainty band. Please provide your decision:
          </p>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ background: 'var(--green)' }}  onClick={() => handleResume('approve')}>Approve</button>
            <button className="btn-primary" style={{ background: 'var(--red)' }}    onClick={() => handleResume('escalate')}>Escalate</button>
            <button className="btn-primary" style={{ background: 'var(--yellow)', color: '#000' }} onClick={() => handleResume('reject')}>Reject</button>
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          {flags.length > 0 && <div className="error-box">Guardrail flags: {flags.join(', ')}</div>}

          {/* Risk + Policy */}
          <div className="analysis-grid">
            <div className="card">
              <h3>Risk Assessment</h3>
              {risk.risk_level ? (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '1.4rem' }}>{pct}%</span>
                      <RiskBadge level={risk.risk_level} />
                    </div>
                    <div className="risk-meter-bar">
                      <div className="risk-meter-fill" style={{ width: `${pct}%`, background: riskColor(prob) }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: '.3rem' }}>
                      Fraud probability · confidence {((risk.confidence ?? 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-key">Human Review</span>
                    <span className="info-val">
                      {risk.requires_human_review
                        ? <span className="badge badge-yellow">Required</span>
                        : <span className="badge badge-green">Not Required</span>}
                    </span>
                  </div>
                  {risk.key_risk_factors?.length > 0 && (
                    <div style={{ marginTop: '.75rem' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Key Risk Factors</div>
                      <ul className="step-list">
                        {risk.key_risk_factors.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </>
              ) : <p style={{ color: 'var(--muted)' }}>Not yet computed.</p>}
            </div>

            <div className="card">
              <h3>Policy Validation</h3>
              {policy.validation_summary ? (
                <>
                  <div className="info-row">
                    <span className="info-key">Status</span>
                    <span className="info-val">
                      {policy.is_policy_valid
                        ? <span className="badge badge-green">Valid</span>
                        : <span className="badge badge-red">Invalid</span>}
                    </span>
                  </div>
                  {policy.violations?.length > 0 && (
                    <div style={{ marginTop: '.75rem' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Violations</div>
                      <ul className="step-list">
                        {policy.violations.map((v, i) => <li key={i} style={{ color: 'var(--red)' }}>{v}</li>)}
                      </ul>
                    </div>
                  )}
                  {policy.eligibility_flags?.length > 0 && (
                    <div style={{ marginTop: '.75rem' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.4rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Eligibility Flags</div>
                      <ul className="step-list">
                        {policy.eligibility_flags.map((f, i) => <li key={i} style={{ color: 'var(--yellow)' }}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                  <div style={{ marginTop: '.75rem', fontSize: 12, color: 'var(--muted)' }}>{policy.validation_summary}</div>
                </>
              ) : <p style={{ color: 'var(--muted)' }}>Not yet computed.</p>}
            </div>
          </div>

          {/* Correlation */}
          {corr.overall_correlation_risk && (
            <div className="card">
              <h3>Correlation Analysis</h3>
              <div className="info-row">
                <span className="info-key">Overall Risk</span>
                <span className="info-val"><RiskBadge level={corr.overall_correlation_risk} /></span>
              </div>
              <p style={{ margin: '.75rem 0', fontSize: 13 }}>{corr.summary}</p>
              {corr.signals?.map((s, i) => (
                <div key={i} className="signal-item">
                  <div className="signal-header">
                    <span className="badge badge-blue">{s.signal_type}</span>
                    <span className={`badge badge-${s.severity === 'HIGH' ? 'red' : s.severity === 'MEDIUM' ? 'yellow' : 'green'}`}>{s.severity}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>{s.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          {rec.decision && (
            <div className="card">
              <h3>Investigation Recommendation</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.25rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Decision</div>
                  <DecisionBadge d={rec.decision} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.25rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Priority</div>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>{rec.priority}</span>
                </div>
                {rec.estimated_fraud_savings && (
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: '.25rem' }}>Est. fraud savings</div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--green)' }}>{rec.estimated_fraud_savings}</span>
                  </div>
                )}
              </div>
              {rec.escalation_reason && (
                <div className="error-box" style={{ marginBottom: '.75rem' }}>Escalation: {rec.escalation_reason}</div>
              )}
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '.5rem' }}>{rec.evidence_summary}</p>
              {rec.investigation_steps?.length > 0 && (
                <>
                  <div style={{ fontSize: 11, color: 'var(--muted)', margin: '.75rem 0 .4rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>Investigation Steps</div>
                  <ul className="step-list">
                    {rec.investigation_steps.map((s, i) => <li key={i}><strong>{i + 1}.</strong> {s}</li>)}
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
