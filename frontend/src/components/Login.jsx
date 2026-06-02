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
      setError(false)
      onLogin()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f4f6fb',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Top nav bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e2e6f0',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center',
        height: 64,
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <img src="/logo.png" alt="ClaimsIQ Logo" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#6b7280' }}>
          📞 Claims Helpline:&nbsp;
          <strong style={{ color: '#0066cc' }}>1800-258-5881</strong>
        </div>
      </div>

      {/* Main content — two column */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: 880,
          width: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,.12)',
        }}
          className="login-grid"
        >

          {/* ── Left panel ────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(160deg, #0052a3 0%, #0066cc 60%, #1a7dd7 100%)',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}>

            {/* Background decoration */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 200, height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.06)',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: -40,
              width: 150, height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.06)',
            }} />

            {/* Main headline */}
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
                Claims Intelligence Platform
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800,
                lineHeight: 1.3, marginBottom: '.75rem' }}>
                Got questions regarding<br />
                <span style={{ color: '#ffd166' }}>Insurance Claim?</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 14, lineHeight: 1.7 }}>
                Our claims assistance experts are available
                <strong style={{ color: '#fff' }}> 24X7*</strong>
              </p>
            </div>

            {/* Coverage tags */}
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginBottom: '.6rem' }}>
                For Motor, Health, Travel &amp; Term Insurance claim related queries
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                {['🚗 Motor', '❤️ Health', '✈️ Travel', '📋 Term'].map(tag => (
                  <span key={tag} style={{
                    background: 'rgba(255,255,255,.15)',
                    border: '1px solid rgba(255,255,255,.25)',
                    borderRadius: 20,
                    padding: '4px 12px',
                    fontSize: 12,
                    color: '#fff',
                    fontWeight: 500,
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Phone CTA */}
            <div style={{
              background: 'rgba(255,255,255,.12)',
              border: '1px solid rgba(255,255,255,.2)',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '.75rem',
            }}>
              <div style={{
                background: '#fff',
                borderRadius: '50%',
                width: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>📞</div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginBottom: '.15rem' }}>
                  Call at
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '.02em' }}>
                  1800-258-5881
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>
              *24x7 claim assistance available for Health &amp; Motor insurance
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: '1.25rem' }}>
              {[['15,420', 'Claims Analysed'], ['6%', 'Fraud Rate'], ['5', 'AI Agents']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffd166' }}>{v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel — login form ───────────────────── */}
          <div style={{
            background: '#fff',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '.3rem' }}>
              Sign In
            </h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: '1.75rem' }}>
              Access your claims intelligence dashboard
            </p>

            {error && (
              <div className="error-box" style={{ marginBottom: '1rem' }}>
                ⚠ Invalid username or password. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '.8rem', fontSize: '15px' }}
              >
                Sign In →
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '.75rem',
              margin: '1.5rem 0',
            }}>
              <div style={{ flex: 1, height: 1, background: '#e2e6f0' }} />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>demo credentials</span>
              <div style={{ flex: 1, height: 1, background: '#e2e6f0' }} />
            </div>

            {/* Demo hint */}
            <div style={{
              background: '#f0f6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 10,
              padding: '1rem',
              fontSize: 13,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
                <span style={{ color: '#6b7280' }}>Username</span>
                <strong style={{ color: '#0066cc' }}>admin</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Password</span>
                <strong style={{ color: '#0066cc' }}>1234</strong>
              </div>
            </div>

            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: '1.5rem' }}>
              🔒 Secured by AI-powered fraud detection engine
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', fontSize: 12, color: '#9ca3af',
        padding: '1rem', borderTop: '1px solid #e2e6f0', background: '#fff',
      }}>
        © 2025 ClaimsIQ — Prodapt FDE Capstone · All rights reserved
      </div>

      {/* Responsive style */}
      <style>{`
        @media (max-width: 640px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-grid > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  )
}
