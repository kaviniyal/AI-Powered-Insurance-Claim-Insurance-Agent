import { useState, useRef, useEffect } from 'react'

const BOT_NAME = 'ClaimsIQ Assistant'

const RESPONSES = [
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'good'],
    answer: "Hello! 👋 I'm your ClaimsIQ assistant. I can help you navigate the platform. Ask me about:\n• Claim Search\n• Full Analysis\n• Correlation\n• Human Review (HITL)\n• Settings",
  },
  {
    keywords: ['search', 'claim search', 'find claim', 'retrieve', 'look up', 'history'],
    answer: "🔍 **Claim Search**\nGo to the Claim Search tab and type a natural language description — e.g. *'Sport vehicle collision, no police report'*.\n\nUse the Fraud Filter to show only fraudulent or legitimate claims. Adjust Top-K (1–20) to control how many results appear. Results are ranked by hybrid semantic + keyword relevance.",
  },
  {
    keywords: ['full analysis', 'investigate', 'investigation', 'pipeline', 'analyze', 'analyse', 'run'],
    answer: "🧠 **Full Analysis**\nGo to the Full Analysis tab and describe the claim in detail.\n\nThe AI runs 5 agents automatically:\n1. Retrieval (CRAG)\n2. Correlation\n3. Risk Scoring\n4. Policy Validation\n5. Recommendation\n\nYou'll get a fraud probability score, policy violations, correlation signals, and a final APPROVE / INVESTIGATE / ESCALATE / REJECT decision.",
  },
  {
    keywords: ['correlat', 'pattern', 'fraud ring', 'hotspot', 'cluster', 'repeat'],
    answer: "🔗 **Correlation Analysis**\nGo to the Correlation tab and describe the type of claims to analyse.\n\nIncrease Top-K (up to 50) to scan more claims. The system detects:\n• REPEAT_CUSTOMER — same policyholder filing multiple claims\n• REGION_HOTSPOT — fraud concentrated in one area\n• AMOUNT_CLUSTER — suspiciously similar claim amounts\n• PATTERN_MATCH — staging ring signals\n• TEMPORAL_BURST — multiple claims in short time window",
  },
  {
    keywords: ['hitl', 'human review', 'human in the loop', 'approve', 'escalate', 'reject', 'uncertain', 'banner'],
    answer: "👤 **Human Review (HITL)**\nWhen the fraud score falls between 40–60%, the pipeline pauses and shows a yellow banner asking for your decision.\n\n• **Approve** — claim appears legitimate\n• **Escalate** — needs senior investigator attention\n• **Reject** — clear policy violation\n\nYour decision is incorporated into the final recommendation.",
  },
  {
    keywords: ['risk', 'fraud score', 'probability', 'score', 'percentage'],
    answer: "📊 **Risk Scoring**\nThe fraud probability is shown as a 0–100% bar with colour coding:\n\n🟢 0–30% → LOW risk\n🟡 30–60% → MEDIUM risk\n🔴 60–100% → HIGH / CRITICAL risk\n\nA confidence score is also shown. If the score is in the 40–60% uncertainty band, a human review is requested.",
  },
  {
    keywords: ['policy', 'violation', 'eligible', 'compliance', 'valid', 'invalid'],
    answer: "📋 **Policy Validation**\nThe Policy Validation agent checks the claim against standard insurance policy rules and flags:\n\n• Claims filed shortly after policy start\n• Missing police reports for major incidents\n• Multiple recent claims from the same customer\n• High-fraud region patterns\n\nViolations are shown in red, eligibility flags in yellow.",
  },
  {
    keywords: ['setting', 'config', 'api', 'url', 'ingest', 'swagger', 'data'],
    answer: "⚙️ **Settings**\nIn the Settings tab you can:\n\n• Change the Backend Base URL (default: http://localhost:8000)\n• Open Swagger UI to test API endpoints directly\n• Re-ingest claims data into Pinecone if the dataset is updated\n• View system stats — claims count, fraud rate, active agents",
  },
  {
    keywords: ['agent', 'how many', 'agents', 'ai agent'],
    answer: "🤖 **AI Agents**\nClaimsIQ uses 5 specialised agents:\n\n1. **Fraud Retrieval Agent** — finds similar historical claims (CRAG)\n2. **Correlation Agent** — detects cross-claim patterns\n3. **Risk Scoring Agent** — estimates fraud probability\n4. **Policy Validation Agent** — checks compliance\n5. **Recommendation Agent** — generates final decision\n\nAll agents communicate via A2A (Agent-to-Agent) messaging.",
  },
  {
    keywords: ['dataset', 'data', 'claims', 'how many', '15420', 'csv', 'vehicle', 'car'],
    answer: "📁 **Dataset**\nThe platform uses the Vehicle Insurance Claim Fraud Detection dataset:\n\n• **15,420** automobile insurance claim records\n• **923** fraudulent cases (6% fraud rate)\n• Vehicle types: Sedan, Sport, Utility (4-wheelers only)\n• 33 features including policy type, accident area, fault, past claims, police report\n• Stored in Pinecone vector database",
  },
  {
    keywords: ['pinecone', 'vector', 'database', 'embed', 'store'],
    answer: "🗄️ **Vector Database**\nClaimsIQ uses Pinecone as the cloud vector database.\n\nDuring ingestion, each claim is embedded using OpenAI text-embedding-3-small (1536 dimensions) and stored in Pinecone.\n\nAt query time, the hybrid retriever combines Pinecone semantic search + BM25 keyword search + cross-encoder reranking.",
  },
  {
    keywords: ['login', 'sign in', 'password', 'username', 'credential', 'access'],
    answer: "🔐 **Login Credentials**\nDemo credentials for this platform:\n\n• **Username:** admin\n• **Password:** 1234\n\nClick Sign In to access the dashboard.",
  },
  {
    keywords: ['home', 'tab', 'navigate', 'navigation', 'page', 'where'],
    answer: "🏠 **Navigation**\nUse the tabs in the header to navigate:\n\n• **Home** — Overview, stats, and this agent guide\n• **Claim Search** — Search historical claims\n• **Full Analysis** — Run complete fraud investigation\n• **Correlation** — Detect cross-claim patterns\n• **Settings** — Configure API and manage data\n\nClick the logo at any time to return to Home.",
  },
]

const FALLBACK = "I'm not sure about that. Try asking me about:\n• Claim Search\n• Full Analysis\n• Correlation\n• Human Review (HITL)\n• Risk Scoring\n• Settings\n• Dataset\n• AI Agents"

function getBotResponse(input) {
  const lower = input.toLowerCase()
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r.answer
  }
  return FALLBACK
}

function Message({ msg }) {
  const isBot = msg.from === 'bot'
  return (
    <div style={{
      display: 'flex',
      flexDirection: isBot ? 'row' : 'row-reverse',
      alignItems: 'flex-end',
      gap: '.4rem',
      marginBottom: '.75rem',
    }}>
      {isBot && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#0066cc', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isBot ? '#f0f6ff' : '#0066cc',
        color: isBot ? '#1a1a2e' : '#fff',
        border: isBot ? '1px solid #bfdbfe' : 'none',
        borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
        padding: '.55rem .85rem',
        fontSize: 12.5,
        lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.text}
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm your ClaimsIQ Assistant.\n\nMay I help you? Ask me anything about how to use this platform!" }
  ])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)

  // Draggable state
  const [pos,      setPos]      = useState({ x: window.innerWidth - 90, y: window.innerHeight - 90 })
  const dragging   = useRef(false)
  const offset     = useRef({ x: 0, y: 0 })
  const btnRef     = useRef(null)
  const bottomRef  = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  // Drag handlers
  function onMouseDown(e) {
    dragging.current = true
    offset.current   = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }
  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current) return
      const x = Math.min(Math.max(e.clientX - offset.current.x, 0), window.innerWidth  - 64)
      const y = Math.min(Math.max(e.clientY - offset.current.y, 0), window.innerHeight - 64)
      setPos({ x, y })
    }
    function onMouseUp() { dragging.current = false }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [])

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: getBotResponse(text) }])
      setTyping(false)
    }, 700)
  }

  // Chat window position — open above/left of the button
  const chatW = 320
  const chatH = 440
  const chatX = Math.min(pos.x, window.innerWidth  - chatW - 8)
  const chatY = Math.max(pos.y - chatH - 12, 8)

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed',
          left: chatX, top: chatY,
          width: chatW, height: chatH,
          background: '#fff',
          border: '1px solid #e2e6f0',
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
          display: 'flex', flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0052a3, #0066cc)',
            padding: '.75rem 1rem',
            display: 'flex', alignItems: 'center', gap: '.6rem',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{BOT_NAME}</div>
              <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Online · Always ready to help
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'rgba(255,255,255,.15)', border: 'none',
                borderRadius: '50%', width: 26, height: 26,
                color: '#fff', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '.75rem',
            scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent',
          }}>
            {messages.map((m, i) => <Message key={i} msg={m} />)}
            {typing && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.4rem', marginBottom: '.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{
                  background: '#f0f6ff', border: '1px solid #bfdbfe',
                  borderRadius: '0 12px 12px 12px', padding: '.55rem .85rem',
                  display: 'flex', gap: '.3rem', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#0066cc',
                      animation: `bounce .9s ${i * .2}s ease-in-out infinite`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts */}
          <div style={{ padding: '0 .75rem .4rem', display: 'flex', gap: '.35rem', flexWrap: 'wrap' }}>
            {['How to search?', 'Run analysis', 'What is HITL?', 'Correlation'].map(q => (
              <button key={q}
                onClick={() => { setInput(q); setTimeout(() => sendMessage(), 0) }}
                style={{
                  background: '#f0f6ff', border: '1px solid #bfdbfe',
                  borderRadius: 12, padding: '3px 9px',
                  fontSize: 11, color: '#0066cc', cursor: 'pointer',
                  fontWeight: 600,
                }}
                onMouseDown={e => {
                  // send directly
                  const text = q
                  setMessages(m => [...m, { from: 'user', text }])
                  setTyping(true)
                  setTimeout(() => {
                    setMessages(m => [...m, { from: 'bot', text: getBotResponse(text) }])
                    setTyping(false)
                  }, 700)
                  e.preventDefault()
                }}
              >{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '.6rem .75rem',
            borderTop: '1px solid #e2e6f0',
            display: 'flex', gap: '.5rem',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything…"
              style={{
                flex: 1, border: '1.5px solid #e2e6f0', borderRadius: 20,
                padding: '.45rem .9rem', fontSize: 13, outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#0066cc'}
              onBlur={e => e.target.style.borderColor = '#e2e6f0'}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? '#0066cc' : '#e2e6f0',
                border: 'none', borderRadius: '50%',
                width: 36, height: 36, flexShrink: 0,
                cursor: input.trim() ? 'pointer' : 'default',
                color: '#fff', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s',
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* Floating robot button */}
      <div
        ref={btnRef}
        onMouseDown={onMouseDown}
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          left: pos.x, top: pos.y,
          width: 60, height: 60,
          borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg, #d93025, #b71c1c)'
            : 'linear-gradient(135deg, #0052a3, #0066cc)',
          boxShadow: '0 4px 20px rgba(0,102,204,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'grab',
          zIndex: 9999,
          fontSize: 28,
          userSelect: 'none',
          transition: 'background .2s, box-shadow .2s',
        }}
        title="Chat with ClaimsIQ Assistant"
      >
        {open ? '✕' : '🤖'}

        {/* Pulse ring */}
        {!open && (
          <span style={{
            position: 'absolute', inset: -4,
            borderRadius: '50%',
            border: '2px solid #0066cc',
            animation: 'pulse 2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%   { transform: scale(1);   opacity: .8; }
          100% { transform: scale(1.6); opacity: 0;  }
        }
      `}</style>
    </>
  )
}
