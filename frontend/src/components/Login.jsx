import { useState } from 'react'

const VALID_USER = 'admin'
const VALID_PASS = '1234'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(false)

  function handleSubmit(e) {
    e?.preventDefault()
    if (username === VALID_USER && password === VALID_PASS) {
      setError(false); onLogin()
    } else {
      setError(true); setPassword('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4ff',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        background: 'linear-gradient(90deg,#0055ff,#7c3aed,#0055ff)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 4s ease infinite',
        padding: '.3rem 2rem',
        display: 'flex', justifyContent: 'space-between',
        fontSize: 11.5, color: '#fff', fontWeight: 600,
      }}>
        <span>⚡ AI-Powered Fraud Detection Platform</span>
        <span>📞 1800-258-5881 &nbsp;|&nbsp; 🕐 24x7 Support</span>
      </div>

      {/* Nav */}
      <div style={{
        background: 'linear-gradient(135deg,#0a0e1a,#0d1b3e)',
        padding: '0 2rem', height: 70,
        display: 'flex', alignItems: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,.4)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '.08em', textTransform: 'uppercase', textShadow: '0 0 20px rgba(0,150,255,.6)', lineHeight: 1 }}>
            Claims<span style={{ color: '#00d4ff' }}>IQ</span>
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 800, fontStyle: 'italic', color: '#ff6b35', letterSpacing: '.05em', lineHeight: 1 }}>
            Fraud tried. AI replied. ⚡
          </span>
        </div>
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          maxWidth: 900, width: '100%',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,.15)',
        }}>

          {/* Left — dark info panel */}
          <div style={{
            background: 'linear-gradient(160deg,#0a0e1a 0%,#0d1b3e 60%,#0a1628 100%)',
            padding: '3rem 2.5rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.75rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'rgba(0,212,255,.06)' }} />
            <div style={{ position:'absolute', bottom:-40, left:-40, width:150, height:150, borderRadius:'50%', background:'rgba(124,58,237,.06)' }} />

            <div>
              <span style={{ background:'rgba(0,212,255,.15)', border:'1px solid rgba(0,212,255,.3)', borderRadius:20, padding:'4px 14px', fontSize:11, color:'#00d4ff', fontWeight:700 }}>
                Claims Intelligence Platform
              </span>
              <h2 style={{ color:'#fff', fontSize:'1.6rem', fontWeight:900, margin:'1rem 0 .6rem', lineHeight:1.25 }}>
                Got questions regarding<br />
                <span style={{ color:'#ff6b35' }}>Insurance Claim?</span>
              </h2>
              <p style={{ color:'rgba(255,255,255,.65)', fontSize:13.5, lineHeight:1.7 }}>
                Our AI agents are available <strong style={{ color:'#00d4ff' }}>24X7*</strong> to assist your claims team
              </p>
            </div>

            <div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.5)', marginBottom:'.6rem' }}>
                For Motor, Health, Travel &amp; Term Insurance claim queries
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
                {['🚗 Motor','❤️ Health','✈️ Travel','📋 Term'].map(t => (
                  <span key={t} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:20, padding:'4px 12px', fontSize:12, color:'rgba(255,255,255,.85)', fontWeight:600 }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ background:'rgba(0,212,255,.08)', border:'1px solid rgba(0,212,255,.2)', borderRadius:14, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
              <div style={{ background:'linear-gradient(135deg,#0055ff,#00d4ff)', borderRadius:'50%', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>📞</div>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', marginBottom:'.1rem' }}>Call at</div>
                <div style={{ fontSize:'1.25rem', fontWeight:900, color:'#fff', letterSpacing:'.02em' }}>1800-258-5881</div>
              </div>
            </div>

            <div style={{ display:'flex', gap:'1.5rem', borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:'1.25rem' }}>
              {[['15,420','Claims'],['6%','Fraud Rate'],['5','AI Agents']].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontSize:'1.2rem', fontWeight:900, color:'#ff6b35' }}>{v}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:10.5, color:'rgba(255,255,255,.3)' }}>*24x7 claim assistance available for Health &amp; Motor insurance</p>
          </div>

          {/* Right — login form */}
          <div style={{ background:'#fff', padding:'3rem 2.5rem', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ marginBottom:'1.75rem' }}>
              <h2 style={{ fontSize:'1.4rem', fontWeight:900, color:'#0a0e1a', marginBottom:'.3rem' }}>Welcome back 👋</h2>
              <p style={{ fontSize:13, color:'#64748b' }}>Sign in to your claims intelligence dashboard</p>
            </div>

            {error && <div className="error-box">⚠ Invalid credentials. Please try again.</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" placeholder="Enter username" autoComplete="username" autoFocus value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom:'1.5rem' }}>
                <label>Password</label>
                <input type="password" placeholder="Enter password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ width:'100%', padding:'.8rem', fontSize:15 }}>
                Sign In →
              </button>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', margin:'1.5rem 0' }}>
              <div style={{ flex:1, height:1, background:'#e2e8f0' }} />
              <span style={{ fontSize:11, color:'#94a3b8' }}>demo credentials</span>
              <div style={{ flex:1, height:1, background:'#e2e8f0' }} />
            </div>

            <div style={{ background:'linear-gradient(135deg,#f0f4ff,#e8f1fd)', border:'1.5px solid #bfdbfe', borderRadius:12, padding:'1rem 1.25rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.4rem' }}>
                <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>Username</span>
                <strong style={{ color:'#0055ff', fontSize:13 }}>admin</strong>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>Password</span>
                <strong style={{ color:'#0055ff', fontSize:13 }}>1234</strong>
              </div>
            </div>

            <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:'1.25rem' }}>🔒 Secured by AI-powered fraud detection</p>
          </div>
        </div>
      </div>

      <footer style={{ textAlign:'center', fontSize:11, color:'#94a3b8', padding:'1rem', borderTop:'1px solid #e2e8f0', background:'#fff' }}>
        © 2025 ClaimsIQ — Prodapt FDE Capstone
      </footer>

      <style>{`
        @keyframes gradientShift {
          0%  { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100%{ background-position: 0% 50%; }
        }
        @media(max-width:640px){ .login-grid{grid-template-columns:1fr !important} }
      `}</style>
    </div>
  )
}
