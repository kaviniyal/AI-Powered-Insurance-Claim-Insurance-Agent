import Chatbot from './Chatbot'

const TABS = [
  { id: 'home',      label: 'Home',         icon: '🏠' },
  { id: 'search',    label: 'Claim Search',  icon: '🔍' },
  { id: 'analyze',   label: 'Full Analysis', icon: '🧠' },
  { id: 'correlate', label: 'Correlation',   icon: '🔗' },
  { id: 'settings',  label: 'Settings',      icon: '⚙️' },
]

export default function Layout({ tab, setTab, onLogout, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top ticker bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0055ff, #7c3aed, #0055ff)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 4s ease infinite',
        padding: '.3rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11.5, color: '#fff', fontWeight: 600, letterSpacing: '.03em',
      }}>
        <span>⚡ AI-Powered Fraud Detection Platform</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>📞 1800-258-5881</span>
          <span>🕐 24x7 Support</span>
        </div>
      </div>

      {/* Main header */}
      <header style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b3e 50%, #0a1628 100%)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        height: 80,
        gap: '1.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,.4)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>

        {/* Logo brand */}
        <div
          onClick={() => setTab('home')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '.2rem' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          title="Go to Home"
        >
          <span style={{
            fontSize: '1.6rem', fontWeight: 900,
            color: '#fff',
            letterSpacing: '.08em',
            lineHeight: 1,
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(0,150,255,.6)',
          }}>
            Claims<span style={{ color: '#00d4ff' }}>IQ</span>
          </span>
          <span style={{
            fontSize: 11, fontWeight: 800, fontStyle: 'italic',
            color: '#ff6b35',
            letterSpacing: '.05em',
            lineHeight: 1,
            textShadow: '0 0 10px rgba(255,107,53,.5)',
          }}>
            Fraud tried. AI replied. ⚡
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,.15)', flexShrink: 0 }} />

        {/* Nav tabs */}
        <nav style={{ display: 'flex', marginLeft: 'auto' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? 'rgba(0,212,255,.12)' : 'none',
                border: 'none',
                borderBottom: tab === t.id ? '3px solid #00d4ff' : '3px solid transparent',
                color: tab === t.id ? '#00d4ff' : 'rgba(255,255,255,.65)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: tab === t.id ? 700 : 500,
                padding: '0 1rem',
                height: 80,
                display: 'flex', alignItems: 'center', gap: '.35rem',
                transition: 'all .2s',
                whiteSpace: 'nowrap',
                borderRadius: tab === t.id ? '6px 6px 0 0' : 0,
              }}
              onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,.06)' } }}
              onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.color = 'rgba(255,255,255,.65)'; e.currentTarget.style.background = 'none' } }}
            >
              <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* User + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(0,212,255,.1)',
            border: '1px solid rgba(0,212,255,.3)',
            borderRadius: 50,
            padding: '.35rem .85rem',
            fontSize: 12, color: '#00d4ff', fontWeight: 700,
          }}>
            <span>👤</span> Admin
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.2)',
              borderRadius: 50,
              color: 'rgba(255,255,255,.8)',
              cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              padding: '.35rem .9rem',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.2)'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)'; e.currentTarget.style.color = 'rgba(255,255,255,.8)'; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main style={{ padding: '1.75rem 2rem' }}>
        {children}
      </main>

      <Chatbot />

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #0a0e1a, #0d1b3e)',
        padding: '1.25rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '2rem', flexWrap: 'wrap', gap: '.5rem',
      }}>
        <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>
          © 2025 <span style={{ color: '#00d4ff', fontWeight: 700 }}>ClaimsIQ</span> — AI-Powered Insurance Claims Intelligence
        </span>
        <span style={{ color: '#ff6b35', fontSize: 11, fontWeight: 700, fontStyle: 'italic' }}>
          Fraud tried. AI replied. ⚡
        </span>
      </footer>

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
