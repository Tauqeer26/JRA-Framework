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
    <div className="risk-legend" style={{
      position: 'fixed', bottom: '1.25rem', right: '1.25rem',
      background: 'rgba(255,255,255,0.92)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '0.75rem 1rem', zIndex: 50,
      boxShadow: '0 16px 40px rgba(15,23,42,0.08)',
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

export function Topbar({ activeStep, steps = ['Role', 'Tasks', 'Summary'] }) {
  return (
    <header className="topbar" style={{
      borderBottom: '0.5px solid var(--border)', padding: '0.875rem 2rem', minHeight: '0.75in',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'sticky', top: 0, background: 'rgba(251,248,242,0.92)',
      backdropFilter: 'blur(10px)', zIndex: 40,
    }}>
      <div className="topbar-brand" style={{ position: 'absolute', left: '2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--accent)', fontStyle: 'normal', fontWeight: 700, letterSpacing: '0.16em' }}>JRF</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.12em' }}>JOB ROLE FORECAST</span>
      </div>

      {activeStep !== undefined && (
        <div className="topbar-steps" style={{ display: 'flex', gap: 6, alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {steps.map((label, i) => (
            <div key={i} className="topbar-step" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="topbar-step-circle" style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeStep >= i ? 'var(--accent)' : 'rgba(15,23,42,0.08)',
                color: activeStep >= i ? '#ffffff' : 'var(--text3)',
                fontWeight: 500, transition: 'all 0.3s',
              }}>{i + 1}</div>
              <span className="topbar-step-label" style={{ fontSize: 10, color: activeStep === i ? 'var(--text2)' : 'var(--text3)' }}>{label}</span>
              {i < steps.length - 1 && <div className="topbar-step-connector" style={{ width: 16, height: '0.5px', background: 'var(--border)' }} />}
            </div>
          ))}
        </div>
      )}

    </header>
  )
}
