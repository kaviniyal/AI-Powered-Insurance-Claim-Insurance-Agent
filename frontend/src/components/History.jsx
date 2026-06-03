import { useState, useEffect } from 'react'
import { getApiBase } from '../api'

function DecisionBadge({ d }) {
  const map = { APPROVE: 'badge-green', INVESTIGATE: 'badge-yellow', ESCALATE: 'badge-red', REJECT: 'badge-purple', UNKNOWN: 'badge-blue' }
  return <span className={`badge ${map[d] || 'badge-blue'}`}>{d || 'N/A'}</span>
}

function RiskBadge({ level }) {
  const map = { LOW: 'badge-green', MEDIUM: 'badge-yellow', HIGH: 'badge-red', CRITICAL: 'badge-red' }
  return level ? <span className={`badge ${map[level] || 'badge-blue'}`}>{level}</span> : null
}

function riskColor(prob) {
  const p = parseFloat(prob)
  if (p < 0.3) return '#10b981'
  if (p < 0.6) return '#f59e0b'
  return '#ef4444'
}

export default function History() {
  const [investigations, setInvestigations] = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [filter,         setFilter]         = useState('')

  useEffect(() => { fetchHistory() }, [])

  async function fetchHistory() {
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${getApiBase()}/history?limit=50`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || res.statusText)
      setInvestigations(data.investigations || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter
    ? investigations.filter(i => i.decision === filter)
    : investigations

  const counts = {
    total:       investigations.length,
    escalate:    investigations.filter(i => i.decision === 'ESCALATE').length,
    investigate: investigations.filter(i => i.decision === 'INVESTIGATE').length,
    approve:     investigations.filter(i => i.decision === 'APPROVE').length,
    reject:      investigations.filter(i => i.decision === 'REJECT').length,
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0a0e1a,#0d1b3e)',
        borderRadius: 16, padding: '1.75rem 2rem',
        marginBottom: '1.5rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,107,53,.06)' }} />
        <span style={{ background:'rgba(255,107,53,.15)', border:'1px solid rgba(255,107,53,.3)', borderRadius:20, padding:'3px 12px', fontSize:11, color:'#ff6b35', fontWeight:700 }}>
          Saved to Pinecone
        </span>
        <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:900, margin:'.6rem 0 .3rem' }}>📋 Investigation History</h1>
        <p style={{ color:'rgba(255,255,255,.55)', fontSize:13 }}>
          All completed fraud investigations — automatically saved to Pinecone and searchable as historical data
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Total',       value: counts.total,       color:'#0055ff' },
          { label:'Escalated',   value: counts.escalate,    color:'#ef4444' },
          { label:'Investigate', value: counts.investigate, color:'#f59e0b' },
          { label:'Approved',    value: counts.approve,     color:'#10b981' },
          { label:'Rejected',    value: counts.reject,      color:'#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{
            background:'#fff', borderRadius:12, padding:'1rem 1.25rem',
            border:'1px solid #e2e8f0', borderTop:`4px solid ${s.color}`,
            textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,.04)',
          }}>
            <div style={{ fontSize:'1.6rem', fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#64748b', fontWeight:600, marginTop:'.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + refresh */}
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
          {['', 'ESCALATE', 'INVESTIGATE', 'APPROVE', 'REJECT'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#0055ff' : '#fff',
                border: '1.5px solid',
                borderColor: filter === f ? '#0055ff' : '#e2e8f0',
                borderRadius: 50, padding: '.35rem 1rem',
                fontSize: 12, fontWeight: 700,
                color: filter === f ? '#fff' : '#64748b',
                cursor: 'pointer', transition: 'all .15s',
              }}>
              {f || 'All'}
            </button>
          ))}
        </div>
        <button className="btn-outline" onClick={fetchHistory} style={{ marginLeft:'auto', fontSize:12 }}>
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'2.5rem' }}>
          <div className="spinner" style={{ width:36, height:36, borderWidth:3, margin:'0 auto .75rem' }} />
          <div style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Loading investigations from Pinecone…</div>
        </div>
      )}
      {error && <div className="error-box">⚠ {error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
          <div style={{ fontSize:48, marginBottom:'1rem' }}>🔍</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:'.5rem' }}>No investigations yet</div>
          <div style={{ color:'#64748b', fontSize:13 }}>
            Run a Full Analysis — results are automatically saved here.
          </div>
        </div>
      )}

      {!loading && filtered.map((inv, i) => {
        const prob = parseFloat(inv.fraud_probability) || 0
        const pct  = (prob * 100).toFixed(0)

        return (
          <div key={inv.id} style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderLeft: `5px solid ${inv.decision === 'ESCALATE' ? '#ef4444' : inv.decision === 'APPROVE' ? '#10b981' : inv.decision === 'REJECT' ? '#7c3aed' : '#f59e0b'}`,
            borderRadius: 14, marginBottom: '.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,.04)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '.85rem 1.25rem',
              background: '#f8fafc',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#0055ff,#0040cc)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900,
              }}>{i + 1}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: '.15rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {inv.query || 'Investigation'}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  🕐 {inv.timestamp || 'N/A'} &nbsp;·&nbsp; ID: {inv.id}
                </div>
              </div>

              <div style={{ display:'flex', gap:'.5rem', alignItems:'center', flexWrap:'wrap' }}>
                <DecisionBadge d={inv.decision} />
                <RiskBadge level={inv.risk_level} />
                {inv.human_decision && (
                  <span className="badge badge-blue">👤 Human: {inv.human_decision}</span>
                )}
              </div>
            </div>

            {/* Details row */}
            <div style={{ display:'flex', flexWrap:'wrap' }}>
              {[
                { label:'Fraud Probability', value: pct + '%',           icon:'📊', highlight: prob > 0.6 },
                { label:'Risk Level',        value: inv.risk_level,      icon:'⚠️', highlight: false },
                { label:'Decision',          value: inv.decision,        icon:'✅', highlight: false },
                { label:'Priority',          value: inv.priority,        icon:'🎯', highlight: false },
                { label:'Policy Valid',      value: inv.is_policy_valid, icon:'📋', highlight: inv.is_policy_valid === 'False' },
              ].map(f => (
                <div key={f.label} style={{
                  flex: '1 1 18%', minWidth: 100,
                  padding: '.6rem 1rem',
                  borderRight: '1px solid #f1f5f9',
                  borderBottom: '1px solid #f1f5f9',
                  background: f.highlight ? '#fff5f5' : 'transparent',
                }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.2rem' }}>
                    {f.icon} {f.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: f.highlight ? '#ef4444' : '#0f172a' }}>
                    {f.value || 'N/A'}
                  </div>
                </div>
              ))}

              {/* Risk bar */}
              <div style={{ width:'100%', padding:'.5rem 1rem', borderTop:'1px solid #f1f5f9' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                  <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600, width:100, flexShrink:0 }}>Fraud Probability</span>
                  <div style={{ flex:1, background:'#f1f5f9', borderRadius:99, height:8 }}>
                    <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:`linear-gradient(90deg,${riskColor(prob)},${riskColor(prob)}cc)`, transition:'width .4s' }} />
                  </div>
                  <span style={{ fontSize:12, fontWeight:800, color:riskColor(prob), width:40, textAlign:'right' }}>{pct}%</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
