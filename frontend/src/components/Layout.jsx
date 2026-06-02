const TABS = [
  { id: 'search',    label: 'Claim Search' },
  { id: 'analyze',   label: 'Full Analysis' },
  { id: 'correlate', label: 'Correlation' },
  { id: 'settings',  label: 'Settings' },
]

export default function Layout({ tab, setTab, onLogout, children }) {
  return (
    <>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        height: 60,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
            Insurance Claims Intelligence
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            AI-Powered Fraud Detection &amp; Investigation Assistant
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: 12,
            padding: '.3rem .75rem',
            transition: 'color .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.target.style.color = 'var(--red)'; e.target.style.borderColor = 'var(--red)'; }}
          onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border)'; }}
        >
          Logout
        </button>
      </header>

      {/* Nav */}
      <nav style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        padding: '0 2rem',
        gap: '.25rem',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '3px solid var(--accent)' : '3px solid transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              padding: '.75rem 1rem',
              transition: 'color .15s, border-color .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </>
  )
}
