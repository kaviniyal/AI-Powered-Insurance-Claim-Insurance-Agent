import { useState } from 'react'
import { queryClaims } from '../api'

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
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>Claim Search</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: '.25rem' }}>
          Search historical claims using natural language — powered by hybrid semantic + keyword retrieval
        </p>
      </div>

      {/* Search card */}
      <div className="card">
        <div className="form-group">
          <label>Investigation Query</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Sport vehicle collision claim with no police report and fault on policy holder"
            style={{ minHeight: 80 }}
          />
        </div>
        <div className="row" style={{ marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Top-K Results</label>
            <input type="number" value={topK} min={1} max={20} onChange={e => setTopK(+e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Fraud Filter</label>
            <select value={fraudFilter} onChange={e => setFraudFilter(e.target.value)}>
              <option value="">All claims</option>
              <option value="Y">Fraudulent only</option>
              <option value="N">Legitimate only</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : '🔍  Search Claims'}
        </button>
      </div>

      {loading && (
        <div className="loading-row">
          <span className="spinner" /><span>Searching through 15,420 historical claims…</span>
        </div>
      )}
      {error && <div className="error-box">⚠ {error}</div>}

      {results && (
        <>
          {/* Result summary bar */}
          <div style={{
            display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
            background: '#f0f6ff', border: '1px solid #bfdbfe',
            borderRadius: 8, padding: '.75rem 1rem', marginBottom: '1rem', fontSize: 13,
          }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {results.results.length} results found
            </span>
            <span style={{ color: 'var(--muted)' }}>
              Query: <em>"{results.query_used}"</em>
            </span>
            {results.crag_triggered && (
              <span className="badge badge-purple">CRAG Query Refinement Applied</span>
            )}
          </div>

          {results.results.map((r, i) => {
            const fl = r.metadata?.fraud_label || '?'
            return (
              <div key={i} className={`claim-item ${fl === 'Y' ? 'fraud' : fl === 'N' ? 'legit' : ''}`}>
                <div className="claim-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    <span style={{
                      background: fl === 'Y' ? '#fdecea' : fl === 'N' ? '#e6f7ee' : '#f0f6ff',
                      color: fl === 'Y' ? 'var(--red)' : fl === 'N' ? 'var(--green)' : 'var(--primary)',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>
                      {r.doc_id || ''}
                    </span>
                    {fl === 'Y' && <span className="badge badge-red">Fraud</span>}
                    {fl === 'N' && <span className="badge badge-green">Legitimate</span>}
                  </div>
                  <span style={{
                    fontSize: 12, color: 'var(--muted)',
                    background: 'var(--bg)', padding: '3px 8px', borderRadius: 4,
                  }}>
                    score: {(r.score ?? 0).toFixed(3)}
                  </span>
                </div>
                <div className="claim-doc">
                  {r.document?.slice(0, 450)}{r.document?.length > 450 ? '…' : ''}
                </div>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}
