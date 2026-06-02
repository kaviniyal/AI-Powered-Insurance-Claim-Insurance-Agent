import { useState } from 'react'
import { getApiBase, setApiBase, ingestData } from '../api'

export default function Settings() {
  const [apiBase,    setApiBaseState] = useState(getApiBase)
  const [savedMsg,   setSavedMsg]     = useState('')
  const [ingestMsg,  setIngestMsg]    = useState('')
  const [ingestOk,   setIngestOk]     = useState(true)

  function handleSave() {
    setApiBase(apiBase.trim() || 'http://localhost:8000')
    setSavedMsg('Saved ✓')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  async function handleIngest() {
    setIngestMsg('Ingesting…'); setIngestOk(true)
    try {
      const data = await ingestData(false)
      setIngestMsg(`Done ✓ — ${data.records_ingested} records ingested`)
    } catch (e) {
      setIngestMsg('Error: ' + e.message)
      setIngestOk(false)
    }
  }

  return (
    <>
      <div className="card">
        <h3>API Configuration</h3>
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
        <button className="btn-primary" onClick={handleSave}>Save</button>
        {savedMsg && <p style={{ color: 'var(--green)', fontSize: 12, marginTop: '.5rem' }}>{savedMsg}</p>}
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
          <button className="btn-secondary" onClick={handleIngest}>Ingest Data</button>
          <button className="btn-secondary" onClick={() => window.open(apiBase.replace(/\/$/, '') + '/docs', '_blank')}>
            API Docs (Swagger)
          </button>
        </div>
        {ingestMsg && (
          <p style={{ color: ingestOk ? 'var(--green)' : 'var(--red)', fontSize: 12 }}>{ingestMsg}</p>
        )}
      </div>

      <div className="card">
        <h3>About</h3>
        <div className="info-row"><span className="info-key">Project</span><span className="info-val">Insurance Claims Intelligence Assistant</span></div>
        <div className="info-row"><span className="info-key">Stack</span><span className="info-val">React · Vite · FastAPI · LangGraph · Pinecone</span></div>
        <div className="info-row"><span className="info-key">Agents</span><span className="info-val">Retrieval · Correlation · Risk · Policy · Recommendation</span></div>
        <div className="info-row"><span className="info-key">Version</span><span className="info-val">1.0.0</span></div>
      </div>
    </>
  )
}
