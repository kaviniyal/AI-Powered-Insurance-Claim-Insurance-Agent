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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Settings</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: '.25rem' }}>
          Configure API connection and manage data ingestion
        </p>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-value">15,420</div>
          <div className="stat-label">Claims in Vector Store</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--accent)' }}>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>6%</div>
          <div className="stat-label">Fraud Rate in Dataset</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: 'var(--green)' }}>
          <div className="stat-value" style={{ color: 'var(--green)' }}>5</div>
          <div className="stat-label">AI Agents Active</div>
        </div>
      </div>

      {/* API Config */}
      <div className="card">
        <div className="card-title">API Configuration</div>
        <div className="card-sub" style={{ marginBottom: '1.25rem' }}>Backend FastAPI service URL</div>
        <div className="form-group">
          <label>Backend Base URL</label>
          <input
            type="text"
            value={apiBase}
            onChange={e => setApiBaseState(e.target.value)}
            style={{ fontFamily: 'monospace' }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleSave}>Save Settings</button>
          <button className="btn-outline" onClick={() => window.open(apiBase.replace(/\/$/, '') + '/docs', '_blank')}>
            Open Swagger UI ↗
          </button>
        </div>
        {savedMsg && <div className="info-box" style={{ marginTop: '.75rem' }}>{savedMsg}</div>}
      </div>

      {/* Data */}
      <div className="card">
        <div className="card-title">Data Management</div>
        <div className="card-sub" style={{ marginBottom: '1.25rem' }}>Re-ingest claims data from CSV into Pinecone vector store</div>
        <button className="btn-secondary" onClick={handleIngest}>📦 Ingest Claims Data</button>
        {ingestMsg && (
          <div className={ingestOk ? 'info-box' : 'error-box'} style={{ marginTop: '.75rem' }}>{ingestMsg}</div>
        )}
      </div>

      {/* About */}
      <div className="card">
        <div className="card-title">About</div>
        <div style={{ marginTop: '.75rem' }}>
          {[
            ['Project',    'Insurance Claims Intelligence Assistant'],
            ['Version',    '1.0.0'],
            ['Dataset',    'fraud_oracle.csv — 15,420 vehicle insurance records'],
            ['Stack',      'React · Vite · FastAPI · LangGraph · Pinecone · OpenAI'],
            ['Agents',     'Retrieval · Correlation · Risk Scoring · Policy Validation · Recommendation'],
            ['Evaluation', 'DeepEval · Ragas · LLM-as-Judge'],
          ].map(([k, v]) => (
            <div key={k} className="info-row">
              <span className="info-key">{k}</span>
              <span className="info-val" style={{ fontSize: 12 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
