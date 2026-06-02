import { useState } from 'react'
import { getApiBase, setApiBase, ingestData } from '../api'

export default function Settings() {
  const [apiBase,   setApiBaseState] = useState(getApiBase)
  const [savedMsg,  setSavedMsg]     = useState('')
  const [ingestMsg, setIngestMsg]    = useState('')
  const [ingestOk,  setIngestOk]     = useState(true)

  function handleSave() {
    setApiBase(apiBase.trim() || 'http://localhost:8000')
    setSavedMsg('Settings saved ✓')
    setTimeout(() => setSavedMsg(''), 2500)
  }

  async function handleIngest() {
    setIngestMsg('Ingesting data…'); setIngestOk(true)
    try {
      const data = await ingestData(false)
      setIngestMsg(`✓ Done — ${data.records_ingested} records ingested into Pinecone`)
    } catch (e) {
      setIngestMsg('Error: ' + e.message); setIngestOk(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#0a0e1a,#0a1628)',
        borderRadius:16, padding:'1.75rem 2rem',
        marginBottom:'1.5rem', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(0,201,167,.06)' }} />
        <span style={{ background:'rgba(0,201,167,.15)', border:'1px solid rgba(0,201,167,.3)', borderRadius:20, padding:'3px 12px', fontSize:11, color:'#00c9a7', fontWeight:700 }}>
          Configuration
        </span>
        <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:900, margin:'.6rem 0 .3rem' }}>⚙️ Settings</h1>
        <p style={{ color:'rgba(255,255,255,.55)', fontSize:13 }}>Manage API connection, data ingestion, and system configuration</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { value:'15,420', label:'Claims in Vector Store', color:'#0055ff', icon:'🗄️' },
          { value:'6%',     label:'Dataset Fraud Rate',     color:'#ff6b35', icon:'🚨' },
          { value:'5',      label:'Active AI Agents',       color:'#00c9a7', icon:'🤖' },
        ].map(s => (
          <div key={s.label} style={{
            background:'#fff', borderRadius:14, padding:'1.25rem 1.5rem',
            border:'1px solid #e2e8f0', borderTop:`4px solid ${s.color}`,
            boxShadow:'0 2px 12px rgba(0,0,0,.05)',
          }}>
            <div style={{ fontSize:24, marginBottom:'.4rem' }}>{s.icon}</div>
            <div style={{ fontSize:'1.7rem', fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:'.2rem', fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* API config */}
      <div className="card" style={{ borderTop:'4px solid #0055ff' }}>
        <h3>🔌 API Configuration</h3>
        <p style={{ fontSize:13, color:'#64748b', marginBottom:'1rem' }}>Backend FastAPI service connection URL</p>
        <div className="form-group">
          <label>Backend Base URL</label>
          <input
            type="text" value={apiBase}
            onChange={e => setApiBaseState(e.target.value)}
            style={{ fontFamily:'monospace' }}
            onKeyDown={e => e.key==='Enter' && handleSave()}
          />
        </div>
        <div style={{ display:'flex', gap:'.75rem', alignItems:'center', flexWrap:'wrap' }}>
          <button className="btn-primary" onClick={handleSave}>💾 Save Settings</button>
          <button className="btn-outline" onClick={() => window.open(apiBase.replace(/\/$/,'')+'/docs','_blank')}>
            📖 Swagger UI ↗
          </button>
        </div>
        {savedMsg && <div className="info-box" style={{ marginTop:'.75rem' }}>✅ {savedMsg}</div>}
      </div>

      {/* Data management */}
      <div className="card" style={{ borderTop:'4px solid #ff6b35' }}>
        <h3>📦 Data Management</h3>
        <p style={{ fontSize:13, color:'#64748b', marginBottom:'1rem' }}>Re-ingest claims from CSV into Pinecone vector store</p>
        <button className="btn-primary" style={{ background:'linear-gradient(135deg,#ff6b35,#ea580c)' }} onClick={handleIngest}>
          📦 Ingest Claims Data
        </button>
        {ingestMsg && (
          <div className={ingestOk?'info-box':'error-box'} style={{ marginTop:'.75rem' }}>{ingestMsg}</div>
        )}
      </div>

      {/* About */}
      <div className="card" style={{ borderTop:'4px solid #7c3aed' }}>
        <h3>ℹ️ About ClaimsIQ</h3>
        <div style={{ marginTop:'.5rem' }}>
          {[
            ['Project',    'Insurance Claims Intelligence Assistant'],
            ['Version',    '1.0.0'],
            ['Dataset',    'fraud_oracle.csv — 15,420 vehicle insurance records'],
            ['Stack',      'React · Vite · FastAPI · LangGraph · Pinecone · OpenAI'],
            ['Agents',     'Retrieval · Correlation · Risk · Policy · Recommendation'],
            ['Evaluation', 'DeepEval · Ragas · LLM-as-Judge'],
          ].map(([k,v]) => (
            <div key={k} className="info-row">
              <span className="info-key">{k}</span>
              <span className="info-val" style={{ fontSize:12 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
