import { Topbar } from '../components/UI'

export default function ReportPage({ onBack, onStartOver }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar activeStep={3} steps={['Role', 'Tasks', 'Summary', 'Report']} />

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '3rem 2rem' }}>
        <div
          className="card fade-up"
          style={{
            background: 'var(--bg3)',
            borderRadius: 12,
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <p className="label" style={{ color: 'var(--accent)' }}>STEP 4 - REPORT</p>

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--bg2)',
              border: '2px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
            }}
          >
            &#9200;
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.3rem',
              lineHeight: 1.1,
              maxWidth: 560,
            }}
          >
            This feature is coming soon
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text2)',
              lineHeight: 1.75,
              maxWidth: 520,
            }}
          >
            Something exciting is on its way. Stay tuned.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '0.5rem',
            }}
          >
            <button className="btn-ghost" onClick={onBack} type="button">
              Back to Summary
            </button>
            <button className="btn-primary" onClick={onStartOver} type="button">
              Start new analysis
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
