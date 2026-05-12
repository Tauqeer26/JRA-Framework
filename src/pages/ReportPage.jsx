import { Topbar } from '../components/UI'

export default function ReportPage({ onBack, onStartOver }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar activeStep={3} steps={['Role', 'Tasks', 'Summary', 'Report']} />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 2rem' }}>
        <div className="card" style={{ background: 'var(--bg3)', borderRadius: 12, padding: '3rem 2rem', textAlign: 'center' }}>
          <p className="label" style={{ marginBottom: 12, color: 'var(--accent)' }}>STEP 4 — REPORT</p>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
            Report
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '3rem', lineHeight: 1.6 }}>
            This feature is coming soon
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={onBack}
              style={{ padding: '0.75rem 1.5rem' }}>← Back to Summary</button>
            <button className="btn-primary" onClick={onStartOver}
              style={{ padding: '0.75rem 1.5rem' }}>
              Start new analysis
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
