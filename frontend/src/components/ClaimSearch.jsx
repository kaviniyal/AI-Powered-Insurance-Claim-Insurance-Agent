import { useState } from 'react'
import { queryClaims } from '../api'

function escHtml(s) {
  return String(s ?? '')
}

export default function ClaimSearch() {
  const [query,       setQuery]       = useState('')
  const [topK,        setTopK]        = useState(5)
  const [fraudFilter, setFraudFilter] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [results,     setResults]     = useState(null)
  const [error,       setError]       = useState('')

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true); setError(''); setResults(null)
    try {
      const filters = fraudFilter ? { fraud_label: fraudFilter } : null
      const data = await queryClaims(query, topK, filters)
      setResults(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="card">
        <h3>Semantic Claim Search</h3>
        <div className="form-group">
          <label>Investigation Query</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Vehicle fire claim filed 3 days after policy start, no police report, $72k damages"
          />
        </div>
        <div className="row">
          <div className="form-group">
            <label>Top-K Results</label>
            <input type="number" value={topK} min={1} max={20} onChange={e => setTopK(+e.target.value)} />
          </div>
          <div className="form-group">
            <label>Fraud Filter</label>
            <select value={fraudFilter} onChange={e => setFraudFilter(e.target.value)}>
              <option value="">All claims</option>
              <option value="Y">Fraudulent only</option>
              <option value="N">Legitimate only</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : 'Search Claims'}
        </button>
      </div>

      {loading && (
        <div className="loading-row">
          <span className="spinner" /><span>Searching claims…</span>
        </div>
      )}

      {error && <div className="error-box">Error: {error}</div>}

      {results && (
        <>
          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '.5rem' }}>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>
              Query used: <strong style={{ color: 'var(--text)' }}>{results.query_used}</strong>
            </span>
            {results.crag_triggered && <span className="badge badge-purple">CRAG Triggered</span>}
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>{results.results.length} results</span>
          </div>

          {results.results.map((r, i) => {
            const fl = r.metadata?.fraud_label || '?'
            return (
              <div key={i} className={`claim-item ${fl === 'Y' ? 'fraud' : fl === 'N' ? 'legit' : ''}`}>
                <div className="claim-header">
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
                    #{i + 1} · {r.doc_id || ''}
                  </span>
                  <span style={{ display: 'flex', gap: '.5rem', alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
                    {fl === 'Y' && <span className="badge badge-red">Fraud</span>}
                    {fl === 'N' && <span className="badge badge-green">Legit</span>}
                    score: {(r.score ?? 0).toFixed(3)}
                  </span>
                </div>
                <div className="claim-doc">
                  {r.document?.slice(0, 400)}{r.document?.length > 400 ? '…' : ''}
                </div>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}
