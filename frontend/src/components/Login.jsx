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
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '2.5rem 2rem',
        width: '100%', maxWidth: 380,
        boxShadow: '0 24px 60px rgba(0,0,0,.5)',
      }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>
            Insurance Claims Intelligence
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            AI-Powered Fraud Detection &amp; Investigation
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-box" style={{ marginBottom: '.75rem' }}>
            Invalid username or password.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
