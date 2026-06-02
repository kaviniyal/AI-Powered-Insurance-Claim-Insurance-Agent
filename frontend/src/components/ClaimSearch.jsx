import { useState } from 'react'
import { queryClaims } from '../api'

// Parse "Key: Value. Key: Value." document string into a dict
function parseDoc(doc) {
  const fields = {}
  const parts = doc.split(/\.\s+/)
  parts.forEach(part => {
    const idx = part.indexOf(':')
    if (idx > -1) {
      const key = part.slice(0, idx).trim()
      const val = part.slice(idx + 1).trim().replace(/\.$/, '')
      fields[key] = val
    }
  })
  return fields
}

const FIELD_CONFIG = [
  { key: 'Policy Number',        icon: '🔖', label: 'Policy No.' },
  { key: 'Policy Type',          icon: '📄', label: 'Policy Type' },
  { key: 'Base Policy',          icon: '🛡️', label: 'Base Policy' },
  { key: 'Accident Area',        icon: '📍', label: 'Area' },
  { key: 'Fault',                icon: '⚖️', label: 'Fault' },
  { key: 'Vehicle',              icon: '🚗', label: 'Vehicle' },
  { key: 'Price',                icon: '💰', label: 'Price' },
  { key: 'Days Policy to Accident', icon: '📅', label: 'Days to Accident' },
  { key: 'Days Policy to Claim', icon: '📅', label: 'Days to Claim' },
  { key: 'Past Claims',          icon: '📂', label: 'Past Claims' },
  { key: 'Police Report Filed',  icon: '👮', label: 'Police Report' },
  { key: 'Witness Present',      icon: '👁️', label: 'Witness' },
  { key: 'Driver Rating',        icon: '⭐', label: 'Driver Rating' },
  { key: 'Age of Policyholder',  icon: '🎂', label: 'Age' },
  { key: 'Number of Cars',       icon: '🚘', label: 'No. of Cars' },
  { key: 'Address Change',       icon: '🏠', label: 'Address Change' },
  { key: 'Incident',             icon: '🗓️', label: 'Incident Date' },
]

function ClaimCard({ r, index }) {
  const [expanded, setExpanded] = useState(false)
  const fl     = r.metadata?.fraud_label || '?'
  const fields = parseDoc(r.document || '')

  const riskFlags = []
  if (fields['Police Report Filed'] === 'No')  riskFlags.push({ label: 'No Police Report', color: '#ef4444' })
  if (fields['Witness Present'] === 'No')       riskFlags.push({ label: 'No Witness',       color: '#f59e0b' })
  if (fields['Days Policy to Accident'] === 'none') riskFlags.push({ label: 'Missing Accident Date', color: '#ef4444' })
  if (fields['Fault'] === 'Policy Holder')      riskFlags.push({ label: 'Fault: Policy Holder', color: '#f59e0b' })

  return (
    <div style={{
      background: '#fff',
      border: `1px solid #e2e8f0`,
      borderLeft: `5px solid ${fl === 'Y' ? '#ef4444' : fl === 'N' ? '#10b981' : '#0055ff'}`,
      borderRadius: 14,
      marginBottom: '1rem',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,.05)',
      transition: 'box-shadow .2s',
    }}>

      {/* Card header */}
      <div style={{
        padding: '1rem 1.25rem',
        background: fl === 'Y' ? 'linear-gradient(135deg,#fff,#fff5f5)' : fl === 'N' ? 'linear-gradient(135deg,#fff,#f0fdf4)' : 'linear-gradient(135deg,#fff,#f0f4ff)',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap',
      }}>
        {/* Index badge */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: fl === 'Y' ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : fl === 'N' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#0055ff,#0040cc)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900,
        }}>{index + 1}</div>

        {/* Claim ID */}
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{r.doc_id}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
            Policy: {fields['Policy Number'] || 'N/A'} · {fields['Policy Type'] || 'N/A'}
          </div>
        </div>

        {/* Fraud badge */}
        <div style={{ marginLeft: '.25rem' }}>
          {fl === 'Y'
            ? <span className="badge badge-red">🚨 Fraud Detected</span>
            : fl === 'N'
              ? <span className="badge badge-green">✅ Legitimate</span>
              : <span className="badge badge-blue">Unknown</span>}
        </div>

        {/* Risk flags */}
        <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginLeft: '.25rem' }}>
          {riskFlags.map(f => (
            <span key={f.label} style={{
              background: f.color + '18', border: `1px solid ${f.color}40`,
              color: f.color, borderRadius: 20, fontSize: 10.5, fontWeight: 700,
              padding: '2px 8px',
            }}>{f.label}</span>
          ))}
        </div>

        {/* Score + expand */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#0055ff' }}>{(r.score ?? 0).toFixed(3)}</div>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: '#f0f4ff', border: '1.5px solid #bfdbfe',
              borderRadius: 8, padding: '.35rem .75rem',
              fontSize: 12, fontWeight: 700, color: '#0055ff',
              cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap',
            }}
          >
            {expanded ? '▲ Less' : '▼ Details'}
          </button>
        </div>
      </div>

      {/* Quick summary row */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0',
        borderBottom: expanded ? '1px solid #f1f5f9' : 'none',
      }}>
        {[
          { label: 'Area',       value: fields['Accident Area'],    icon: '📍' },
          { label: 'Fault',      value: fields['Fault'],            icon: '⚖️' },
          { label: 'Vehicle',    value: fields['Vehicle'],          icon: '🚗' },
          { label: 'Base Policy',value: fields['Base Policy'],      icon: '🛡️' },
          { label: 'Past Claims',value: fields['Past Claims'],      icon: '📂' },
          { label: 'Incident',   value: fields['Incident'],         icon: '🗓️' },
        ].map(f => (
          <div key={f.label} style={{
            flex: '1 1 16%', minWidth: 110,
            padding: '.65rem 1rem',
            borderRight: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
          }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.2rem' }}>
              {f.icon} {f.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{f.value || 'N/A'}</div>
          </div>
        ))}
      </div>

      {/* Expanded full details */}
      {expanded && (
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.75rem' }}>
            Full Claim Details
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.5rem' }}>
            {FIELD_CONFIG.map(fc => {
              const val = fields[fc.key]
              if (!val) return null
              const isRisk = (fc.key === 'Police Report Filed' && val === 'No') ||
                             (fc.key === 'Witness Present' && val === 'No') ||
                             (fc.key === 'Days Policy to Accident' && val === 'none')
              return (
                <div key={fc.key} style={{
                  background: isRisk ? '#fff5f5' : '#f8fafc',
                  border: `1px solid ${isRisk ? '#fecaca' : '#e2e8f0'}`,
                  borderRadius: 8, padding: '.5rem .75rem',
                }}>
                  <div style={{ fontSize: 10, color: isRisk ? '#ef4444' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.2rem' }}>
                    {fc.icon} {fc.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isRisk ? '#ef4444' : '#0f172a' }}>{val}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ClaimSearch() {
  const [query,       setQuery]       = useState('')
  const [topK,        setTopK]        = useState(5)
  const [fraudFilter, setFraudFilter] = useState('')
  const [areaFilter,  setAreaFilter]  = useState('')
  const [faultFilter, setFaultFilter] = useState('')
  const [policyFilter,setPolicyFilter]= useState('')
  const [loading,     setLoading]     = useState(false)
  const [results,     setResults]     = useState(null)
  const [error,       setError]       = useState('')
  const [showFilters, setShowFilters] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true); setError(''); setResults(null)
    const filters = {}
    if (fraudFilter) filters.fraud_label    = fraudFilter
    if (areaFilter)  filters.accident_type  = areaFilter
    if (faultFilter) filters.claim_status   = faultFilter
    if (policyFilter) filters.policy_type   = policyFilter
    try {
      setResults(await queryClaims(query, topK, Object.keys(filters).length ? filters : null))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setFraudFilter(''); setAreaFilter(''); setFaultFilter(''); setPolicyFilter('')
  }

  const activeFilterCount = [fraudFilter, areaFilter, faultFilter, policyFilter].filter(Boolean).length

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,#0a0e1a,#0d1b3e)',
        borderRadius: 16, padding: '1.75rem 2rem',
        marginBottom: '1.5rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(0,212,255,.06)' }} />
        <div style={{ position:'relative' }}>
          <span style={{ background:'rgba(0,212,255,.15)', border:'1px solid rgba(0,212,255,.3)', borderRadius:20, padding:'3px 12px', fontSize:11, color:'#00d4ff', fontWeight:700 }}>
            Hybrid Semantic + Keyword Search
          </span>
          <h1 style={{ color:'#fff', fontSize:'1.4rem', fontWeight:900, margin:'.6rem 0 .3rem' }}>🔍 Claim Search</h1>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:13 }}>
            Search 15,420 historical claims using natural language
          </p>
        </div>
      </div>

      {/* Search card */}
      <div className="card">
        <div className="form-group">
          <label>Investigation Query</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Sedan collision in urban area, policy holder at fault, no police report"
            onKeyDown={e => e.ctrlKey && e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Filter toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          <button
            onClick={() => setShowFilters(f => !f)}
            style={{
              background: showFilters ? '#0055ff' : '#f0f4ff',
              border: '1.5px solid #bfdbfe', borderRadius: 50,
              color: showFilters ? '#fff' : '#0055ff',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              padding: '.4rem 1rem', display: 'flex', alignItems: 'center', gap: '.4rem',
              transition: 'all .2s',
            }}
          >
            🎯 Filters {activeFilterCount > 0 && (
              <span style={{ background: showFilters ? 'rgba(255,255,255,.3)' : '#0055ff', color: showFilters ? '#fff' : '#fff', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:12, fontWeight:700 }}>
              ✕ Clear filters
            </button>
          )}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'.5rem' }}>
            <label style={{ marginBottom:0, textTransform:'none', letterSpacing:'normal', fontSize:12, color:'#64748b' }}>Top-K:</label>
            <input type="number" value={topK} min={1} max={20} onChange={e => setTopK(+e.target.value)}
              style={{ width:70, padding:'.4rem .6rem' }} />
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={{
            background:'#f8fafc', border:'1.5px solid #e2e8f0',
            borderRadius:12, padding:'1rem 1.25rem', marginBottom:'1rem',
          }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.75rem' }}>
              🎯 Filter Options
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'.75rem' }}>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Fraud Status</label>
                <select value={fraudFilter} onChange={e => setFraudFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Y">🚨 Fraudulent</option>
                  <option value="N">✅ Legitimate</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Accident Area</label>
                <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
                  <option value="">All Areas</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Fault</label>
                <select value={faultFilter} onChange={e => setFaultFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Policy Holder">Policy Holder</option>
                  <option value="Third Party">Third Party</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label>Policy Type</label>
                <select value={policyFilter} onChange={e => setPolicyFilter(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="Sedan - Collision">Sedan - Collision</option>
                  <option value="Sedan - Liability">Sedan - Liability</option>
                  <option value="Sedan - All Perils">Sedan - All Perils</option>
                  <option value="Sport - Collision">Sport - Collision</option>
                  <option value="Utility - All Perils">Utility - All Perils</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <button className="btn-primary" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? '⏳ Searching…' : '🔍  Search Claims'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'2.5rem' }}>
          <div className="spinner" style={{ width:40, height:40, borderWidth:4, margin:'0 auto .75rem' }} />
          <div style={{ fontSize:13, color:'#64748b', fontWeight:600 }}>Searching 15,420 historical claims…</div>
        </div>
      )}
      {error && <div className="error-box">⚠ {error}</div>}

      {results && (
        <>
          {/* Result bar */}
          <div style={{
            display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap',
            background:'linear-gradient(135deg,#f0f4ff,#e8f1fd)',
            border:'1.5px solid #bfdbfe', borderRadius:12,
            padding:'.85rem 1.25rem', marginBottom:'1rem',
          }}>
            <span style={{ fontWeight:800, color:'#0055ff', fontSize:14 }}>
              ✅ {results.results.length} results
            </span>
            <span style={{ color:'#64748b', fontSize:12 }}>
              Query: <em>"{results.query_used}"</em>
            </span>
            {results.crag_triggered && <span className="badge badge-purple">⚡ CRAG Applied</span>}
            {activeFilterCount > 0 && (
              <span className="badge badge-blue">{activeFilterCount} filter{activeFilterCount>1?'s':''} active</span>
            )}
          </div>

          {results.results.map((r, i) => (
            <ClaimCard key={i} r={r} index={i} />
          ))}
        </>
      )}
    </>
  )
}
