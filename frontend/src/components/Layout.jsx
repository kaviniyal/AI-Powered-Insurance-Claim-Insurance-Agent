import Chatbot from './Chatbot'

const TABS = [
  { id: 'home',      label: 'Home',          icon: '🏠' },
  { id: 'search',    label: 'Claim Search',   icon: '🔍' },
  { id: 'analyze',   label: 'Full Analysis',  icon: '🧠' },
  { id: 'correlate', label: 'Correlation',    icon: '🔗' },
  { id: 'settings',  label: 'Settings',       icon: '⚙️' },
]

export default function Layout({ tab, setTab, onLogout, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top info bar */}
      <div style={{
        background: 'var(--primary)',
        padding: '.35rem 2rem',
        display: 'flex', justifyContent: 'flex-end',
        fontSize: 12, color: 'rgba(255,255,255,.85)',
        gap: '1.5rem',
      }}>
        <span>📞 Claims Helpline: 1800-258-5881</span>
        <span>🕐 Mon–Sat 9AM–6PM</span>
      </div>

      {/* Header — logo + tabs + user in one row */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        height: 90,
        gap: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      }}>
        {/* Clickable logo */}
        <img
          src="/logo.png"
          alt="ClaimsIQ Logo"
          onClick={() => setTab('home')}
          style={{
            height: 80,
            width: 'auto',
            objectFit: 'contain',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'opacity .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          title="Go to Home"
        />

        {/* Divider */}
        <div style={{ width: 1, height: 40, background: 'var(--border)', flexShrink: 0, marginLeft: '1.5rem' }} />

        {/* Nav tabs inline */}
        <nav style={{ display: 'flex', gap: '0', flex: 1 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? '3px solid var(--primary)' : '3px solid transparent',
                color: tab === t.id ? 'var(--primary)' : 'var(--muted)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: tab === t.id ? 700 : 500,
                padding: '0 1.1rem',
                height: 90,
                display: 'flex', alignItems: 'center', gap: '.4rem',
                transition: 'all .15s',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* Right side — user + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.5rem',
            padding: '.4rem .9rem',
            background: '#f0f6ff',
            borderRadius: 20,
            fontSize: 13,
          }}>
            <span style={{ fontSize: 16 }}>👤</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Admin</span>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: '1.5px solid var(--border)',
              borderRadius: 6,
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              padding: '.4rem .85rem',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '100%', padding: '1.75rem 2rem' }}>
        {children}
      </main>

      <Chatbot />

      {/* Footer */}
      <footer style={{
        background: '#fff',
        borderTop: '1px solid var(--border)',
        padding: '1rem 2rem',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--muted)',
        marginTop: '2rem',
      }}>
        © 2025 ClaimsIQ — AI-Powered Insurance Claims Intelligence Platform · Built for Prodapt FDE Capstone
      </footer>
    </div>
  )
}
