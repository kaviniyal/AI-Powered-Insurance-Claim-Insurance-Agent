const STEPS = [
  {
    number: '01', icon: '🔍', color: '#0066cc',
    title: 'Search Historical Claims',
    tab: 'search',
    description: 'Retrieve similar historical claims using natural language.',
    instructions: [
      'Go to the Claim Search tab from the top navigation',
      'Type a natural language description of the claim you are investigating',
      'Use the Fraud Filter dropdown to narrow down to fraudulent or legitimate claims only',
      'Adjust Top-K to control how many similar claims are returned',
      'Click "Search Claims" — results are ranked by semantic + keyword relevance',
      'Claims marked in red are historical fraud cases; green are legitimate',
    ],
    tip: 'Try describing the vehicle type, accident area, and fault — e.g. "Sport vehicle urban collision, fault on policy holder, no police report"',
  },
  {
    number: '02', icon: '🧠', color: '#7c3aed',
    title: 'Run Full Fraud Investigation',
    tab: 'analyze',
    description: 'Run a complete 5-agent AI pipeline — retrieval, correlation, risk scoring, policy validation, and final recommendation.',
    instructions: [
      'Go to the Full Analysis tab from the top navigation',
      'Describe the claim in detail — vehicle type, policy type, fault, past claims, police report status',
      'Use one of the 3 Sample Query buttons to try a pre-built example',
      'Click "Run Investigation" — the AI pipeline will run all 5 agents automatically',
      'Review the Risk Assessment — the fraud probability bar shows 0–100% with confidence score',
      'Check Policy Validation for any violations or eligibility flags',
      'Review Correlation Analysis for cross-claim patterns across similar cases',
      'The final Recommendation will be APPROVE, INVESTIGATE, ESCALATE, or REJECT with priority P1–P4',
      'If the fraud score falls between 40–60%, a Human Review banner appears — choose Approve, Escalate, or Reject',
    ],
    tip: 'Priority P1 means urgent action required. Always act on P1 ESCALATE cases first.',
  },
  {
    number: '03', icon: '🔗', color: '#0891b2',
    title: 'Detect Cross-Claim Patterns',
    tab: 'correlate',
    description: 'Detect fraud rings, regional hotspots, amount clustering, and repeat customers across a batch of claims.',
    instructions: [
      'Go to the Correlation tab from the top navigation',
      'Describe the type of claims you want to analyse for patterns',
      'Increase Top-K (up to 50) to analyse a larger batch of claims',
      'Click "Detect Patterns" — both rule-based and LLM analysis will run',
      'Statistical Pre-Signals show rule-based findings (fast, deterministic)',
      'REPEAT_CUSTOMER: same policyholder filing multiple claims',
      'REGION_HOTSPOT: fraud concentrated in one geographic area',
      'AMOUNT_CLUSTER: suspiciously similar claim amounts across unrelated customers',
      'PATTERN_MATCH: identical accident type + fraud label suggesting a staging ring',
      'Use Investigation Flags to guide your next actions',
    ],
    tip: 'A HIGH correlation risk alongside a HIGH risk score from Full Analysis is a strong signal of organised fraud.',
  },
  {
    number: '04', icon: '⚠️', color: '#d97706',
    title: 'Handle Human Review (HITL)',
    tab: 'analyze',
    description: 'When the AI is uncertain (fraud score 40–60%), the system pauses and asks for your decision.',
    instructions: [
      'If a yellow "Human Review Required" banner appears, the AI needs your input',
      'Review all the evidence shown — Risk Assessment, Policy Validation, Correlation',
      'Click Approve if you believe the claim is legitimate based on the evidence',
      'Click Escalate if you believe this requires senior investigator attention',
      'Click Reject if the claim clearly violates policy terms',
      'The AI will then generate the final recommendation incorporating your decision',
      'Your decision is recorded in the thread and can be audited later',
    ],
    tip: 'The HITL band (40–60%) represents genuine model uncertainty. Your domain expertise is critical here.',
  },
  {
    number: '05', icon: '⚙️', color: '#059669',
    title: 'Configure & Manage',
    tab: 'settings',
    description: 'Configure the API connection, re-ingest data, and access Swagger API documentation.',
    instructions: [
      'Go to the Settings tab from the top navigation',
      'Verify the Backend Base URL points to the running FastAPI service (default: http://localhost:8000)',
      'Click "Open Swagger UI" to access full API documentation and test endpoints manually',
      'Click "Ingest Claims Data" if you have updated the dataset and want to re-embed into Pinecone',
      'The stats cards show current system status — claims in vector store, fraud rate, active agents',
    ],
    tip: 'The Swagger UI at /docs lets you test all API endpoints directly — useful for debugging or building integrations.',
  },
]

const FEATURES = [
  { icon: '🤖', title: 'Multi-Agent AI',     desc: '5 specialised agents orchestrated by LangGraph with full state management' },
  { icon: '🔎', title: 'Hybrid Search',      desc: 'BM25 + semantic vector search + cross-encoder reranking via Reciprocal Rank Fusion' },
  { icon: '📊', title: 'Fraud Analytics',    desc: '15,420 historical vehicle insurance claims with 33 feature dimensions' },
  { icon: '🔗', title: 'A2A Communication',  desc: 'Agents communicate directly via typed messages for dynamic workflow decisions' },
  { icon: '🛡️', title: 'Guardrails',         desc: 'PII redaction, prompt injection detection, and input validation on every query' },
  { icon: '👤', title: 'Human-in-the-Loop',  desc: 'Pipeline pauses for human review when fraud score is in the uncertainty band (40–60%)' },
]

import { useEffect, useRef } from 'react'

export default function Home({ setTab }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let paused    = false
    let resetting = false

    const pause  = () => { paused = true }
    const resume = () => { paused = false }

    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)

    const interval = setInterval(() => {
      if (paused || resetting) return

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        resetting = true
        // jump instantly to top, then resume scrolling
        setTimeout(() => {
          el.scrollTop = 0
          resetting = false
        }, 800)
      } else {
        el.scrollTop += 1
      }
    }, 30)

    return () => {
      clearInterval(interval)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

      {/* ── LEFT — 70% ─────────────────────────────────────────────── */}
      <div style={{ flex: '0 0 68%', minWidth: 0 }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0052a3 0%, #0066cc 60%, #1a7dd7 100%)',
          borderRadius: 14, padding: '2.5rem 2rem', marginBottom: '1.25rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
          <div style={{ position: 'relative' }}>
            <span style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#fff', fontWeight: 600 }}>
              AI-Powered Platform
            </span>
            <h1 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 800, margin: '.75rem 0 .4rem', lineHeight: 1.25 }}>
              Insurance Claims<br />Intelligence Assistant
            </h1>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 14, maxWidth: 480, marginBottom: '1.25rem', lineHeight: 1.7 }}>
              AI-powered fraud detection for automobile insurance claims — retrieve historical cases,
              score fraud risk, detect cross-claim patterns, and generate explainable recommendations.
            </p>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <button className="btn-primary"
                style={{ background: '#fff', color: '#0066cc', fontWeight: 700 }}
                onClick={() => setTab('analyze')}>
                🧠 Start Investigation
              </button>
              <button className="btn-primary"
                style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)' }}
                onClick={() => setTab('search')}>
                🔍 Search Claims
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
          {[
            { value: '15,420', label: 'Claims in Database', color: '#0066cc' },
            { value: '923',    label: 'Fraud Cases',        color: '#d93025' },
            { value: '6%',     label: 'Fraud Rate',         color: '#d97706' },
            { value: '5',      label: 'AI Agents',          color: '#059669' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center', borderTop: `4px solid ${s.color}`, marginBottom: 0 }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: '.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Platform capabilities */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h3>Platform Capabilities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: '#f8faff', border: '1px solid #e2e6f0',
                borderRadius: 10, padding: '1rem',
              }}>
                <div style={{ fontSize: 22, marginBottom: '.4rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: '.3rem', color: '#1a1a2e' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── RIGHT — 30% scrollable instructions ────────────────────── */}
      <div ref={scrollRef} style={{
        flex: '0 0 30%',
        position: 'sticky',
        top: '1rem',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        borderRadius: 12,
        border: '1px solid var(--border)',
        background: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,.07)',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent',
      }}>

        {/* Sticky panel header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: '#0066cc',
          padding: '1rem 1.25rem',
          borderRadius: '12px 12px 0 0',
        }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>📖 Agent Guide</div>
          <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 12, marginTop: '.15rem' }}>
            Step-by-step instructions for claims analysts
          </div>
        </div>

        {/* Steps */}
        <div style={{ padding: '1rem' }}>
          {STEPS.map((step, idx) => (
            <div key={idx} style={{
              borderLeft: `4px solid ${step.color}`,
              borderRadius: '0 8px 8px 0',
              background: '#f8faff',
              border: `1px solid #e2e6f0`,
              borderLeft: `4px solid ${step.color}`,
              marginBottom: '1rem',
              overflow: 'hidden',
            }}>
              {/* Step header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '.6rem',
                padding: '.75rem 1rem',
                background: step.color + '12',
                borderBottom: `1px solid ${step.color}30`,
              }}>
                <span style={{
                  background: step.color, color: '#fff',
                  borderRadius: 6, padding: '2px 8px',
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                }}>{step.number}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{step.icon} {step.title}</span>
              </div>

              {/* Body */}
              <div style={{ padding: '.75rem 1rem' }}>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: '.6rem', lineHeight: 1.6 }}>
                  {step.description}
                </p>

                <ol style={{ paddingLeft: '1.1rem', margin: '0 0 .6rem' }}>
                  {step.instructions.map((inst, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#374151', marginBottom: '.35rem', lineHeight: 1.6 }}>
                      {inst}
                    </li>
                  ))}
                </ol>

                {/* Tip */}
                <div style={{
                  background: '#fffbeb', border: '1px solid #fcd34d',
                  borderRadius: 6, padding: '.5rem .75rem',
                  display: 'flex', gap: '.4rem',
                }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>💡</span>
                  <span style={{ fontSize: 11, color: '#92400e', lineHeight: 1.5 }}>{step.tip}</span>
                </div>

                {/* Jump button */}
                <button
                  className="btn-outline"
                  style={{ marginTop: '.6rem', width: '100%', borderColor: step.color, color: step.color, fontSize: 12 }}
                  onClick={() => setTab(step.tab)}
                >
                  Open {step.title.split(' ').slice(-1)} Tab →
                </button>
              </div>
            </div>
          ))}

          {/* Pipeline flow */}
          <div style={{
            background: '#f0f6ff', border: '1px solid #bfdbfe',
            borderRadius: 10, padding: '1rem', marginBottom: '.5rem',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.75rem' }}>
              🔄 AI Pipeline Flow
            </div>
            {['📝 Input Query', '🛡️ Guardrails', '🔍 Retrieval (CRAG)', '🔗 Correlation', '📊 Risk Scoring', '📋 Policy Validation', '👤 HITL Check', '✅ Recommendation'].map((node, i, arr) => (
              <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: i < arr.length - 1 ? '.2rem' : 0 }}>
                <span style={{
                  background: '#fff', border: '1px solid #bfdbfe',
                  borderRadius: 5, padding: '3px 8px',
                  fontSize: 11, color: '#1e3a5f', fontWeight: 500, flex: 1,
                }}>{node}</span>
                {i < arr.length - 1 && <span style={{ color: '#93c5fd', fontSize: 14 }}>↓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
