import { useState } from 'react'
import Login from './components/Login'
import Layout from './components/Layout'
import Home from './components/Home'
import ClaimSearch from './components/ClaimSearch'
import FullAnalysis from './components/FullAnalysis'
import Correlation from './components/Correlation'
import Settings from './components/Settings'

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('auth') === '1')
  const [tab, setTab] = useState('home')

  function handleLogin() {
    sessionStorage.setItem('auth', '1')
    setAuthed(true)
  }
  function handleLogout() {
    sessionStorage.removeItem('auth')
    setAuthed(false)
    setTab('home')
  }

  if (!authed) return <Login onLogin={handleLogin} />

  const panels = {
    home:      <Home setTab={setTab} />,
    search:    <ClaimSearch />,
    analyze:   <FullAnalysis />,
    correlate: <Correlation />,
    settings:  <Settings />,
  }

  return (
    <Layout tab={tab} setTab={setTab} onLogout={handleLogout}>
      {panels[tab]}
    </Layout>
  )
}
