import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup, error, setError } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    let ok
    if (mode === 'login') {
      ok = login(email, password)
    } else {
      ok = signup(name, email, password)
    }
    if (ok) navigate('/app')
    setLoading(false)
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'signup' : 'login')
    setError('')
    setName(''); setEmail(''); setPassword('')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg)',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', background: 'rgba(200,192,232,0.03)',
        borderRight: '0.5px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }} className="fade-in">
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,192,232,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,192,232,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent)', fontStyle: 'italic' }}>JRA</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text3)', letterSpacing: '0.14em', marginLeft: 10 }}>FRAMEWORK</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 500, lineHeight: 1.15, color: '#f0eeff', marginBottom: '1.25rem',
          }}>
            Understand your<br />
            <em style={{ color: 'var(--accent)' }}>AI risk</em> before<br />
            it understands you.
          </h1>

          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 380, marginBottom: '2.5rem' }}>
            The JRA Framework analyses your job role task-by-task, assesses your exposure to AI automation, and gives you a personalised future-proofing plan.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              '✦  Personalised AI risk score per task',
              '✦  Industry-specific context and timeline',
              '✦  Curated AI tools for your role',
              '✦  Complete future-proofing roadmap',
            ].map((item, i) => (
              <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text3)', letterSpacing: '0.01em' }}>{item}</p>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: '3rem', padding: '0.875rem 1rem', borderRadius: 10,
            border: '0.5px solid rgba(200,192,232,0.15)',
            background: 'rgba(200,192,232,0.05)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 4, letterSpacing: '0.08em' }}>DEMO CREDENTIALS</p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text2)' }}>demo@jra.ai &nbsp;·&nbsp; demo1234</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: 'min(480px, 100%)', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '3rem 2.5rem',
      }}>
        <div className="fade-up">
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.75rem',
            fontWeight: 500, color: '#f0eeff', marginBottom: '0.5rem',
          }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginBottom: '2rem' }}>
            {mode === 'login'
              ? 'Sign in to access your AI risk profile'
              : 'Start your personalised JRA analysis'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label className="label">FULL NAME</label>
                <input className="input" type="text" placeholder="Your name"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}

            <div>
              <label className="label">EMAIL ADDRESS</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="label">PASSWORD</label>
              <input className="input" type="password"
                placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 8,
                background: 'rgba(192,57,43,0.1)', border: '0.5px solid rgba(192,57,43,0.3)',
                fontSize: '0.825rem', color: '#e07070',
              }}>{error}</div>
            )}

            <button type="submit" className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8, width: '100%', padding: '0.875rem' }}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} /> : null}
              {mode === 'login' ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <div style={{
            marginTop: '1.75rem', paddingTop: '1.75rem',
            borderTop: '0.5px solid var(--border)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={switchMode} style={{
                background: 'none', border: 'none', color: 'var(--accent)',
                fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline',
              }}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
