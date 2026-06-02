function getBase() {
  return (localStorage.getItem('api_base') || 'http://localhost:8000').replace(/\/$/, '')
}

async function post(path, body) {
  const res = await fetch(`${getBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || res.statusText)
  return data
}

export const queryClaims   = (query, topK, filters)  => post('/query',          { query, top_k: topK, filters: filters || undefined, rerank: true })
export const analyzeClaim  = (query, threadId)       => post('/analyze',         { query, thread_id: threadId || undefined })
export const resumeAnalysis = (threadId, decision)   => post('/analyze/resume', { thread_id: threadId, human_decision: decision })
export const correlateClaims = (query, topK)         => post('/correlate',       { query, top_k: topK })
export const ingestData    = (reset = false)         => post('/ingest',          { reset })

export const getApiBase = () => localStorage.getItem('api_base') || 'http://localhost:8000'
export const setApiBase = (url) => localStorage.setItem('api_base', url)
