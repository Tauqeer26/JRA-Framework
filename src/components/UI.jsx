import { RISK_CONFIG } from '../lib'

export function RiskPill({ risk }) {
  const rc = RISK_CONFIG[risk] || RISK_CONFIG['medium']
  return (
    <span style={{
      fontSize: '10px', fontWeight: '500', padding: '3px 9px',
      borderRadius: '20px', background: rc.bg, color: rc.color,
      border: `0.5px solid ${rc.border}`, whiteSpace: 'nowrap', flexShrink: 0,
    }}>{rc.label}</span>
  )
}

export function Spinner({ text = 'Generating...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text3)', fontSize: '0.85rem' }}>
      <div className="spinner" />
      {text}
    </div>
  )
}

export function RiskLegend() {
  return (
    <div style={{
      position: 'fixed', bottom: '1.25rem', right: '1.25rem',
      background: 'rgba(8,8,16,0.96)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '0.75rem 1rem', zIndex: 50,
    }}>
      <p className="label" style={{ marginBottom: 6 }}>RISK SCALE</p>
      {Object.entries(RISK_CONFIG).map(([k, v]) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.dot }} />
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>{v.label}</span>
        </div>
      ))}
    </div>
  )
}

export function Topbar({ user, onLogout, step }) {
  return (
    <header style={{
      borderBottom: '0.5px solid var(--border)', padding: '0.875rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, background: 'rgba(8,8,16,0.95)',
      backdropFilter: 'blur(10px)', zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--accent)', fontStyle: 'italic' }}>JRA</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.12em' }}>FRAMEWORK</span>
      </div>

      {step !== undefined && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['Role', 'Tasks', 'Report'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= i ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                color: step >= i ? '#0a0a0f' : 'var(--text3)',
                fontWeight: 500, transition: 'all 0.3s',
              }}>{i + 1}</div>
              <span style={{ fontSize: 10, color: step === i ? 'var(--text2)' : 'var(--text3)' }}>{label}</span>
              {i < 2 && <div style={{ width: 16, height: '0.5px', background: 'var(--border)' }} />}
            </div>
          ))}
        </div>
      )}

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-bg)',
            border: '0.5px solid rgba(200,192,232,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 500, color: 'var(--accent)',
          }}>{user.initials}</div>
          <span style={{ fontSize: '0.825rem', color: 'var(--text2)' }}>{user.name}</span>
          <button className="btn-ghost" onClick={onLogout}
            style={{ padding: '0.4rem 0.875rem', fontSize: '0.775rem' }}>
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
