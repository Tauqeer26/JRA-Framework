import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/UI'

export default function IntroPage() {
  const navigate = useNavigate()

  function handleContinue() {
    navigate('/app')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar activeStep={-1} />
      <main className="intro-page" style={{ maxWidth: 1180, margin: '0 auto', padding: '2rem 1.5rem 2.5rem' }}>
        <section className="card intro-shell" style={{ padding: '1.5rem 1.5rem 1.35rem', minHeight: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative accent */}
          <div style={{ position: 'absolute', top: -40, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,95,209,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', top: '60%', left: -80, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,179,82,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div className="intro-hero" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 18,
            flexWrap: 'wrap',
            marginBottom: '1rem',
            paddingRight: '13rem',
            paddingTop: 8,
            borderTop: '2px solid transparent',
            borderImage: 'linear-gradient(90deg, #6b5fd1 0%, transparent 100%) 1',
          }}>
            <div style={{ maxWidth: 580 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.9rem, 3.6vw, 2.7rem)',
                fontWeight: 500,
                color: 'var(--text)',
                marginBottom: 10,
              }}>
                Welcome to JRF
              </h1>
              <p style={{ color: 'var(--text2)', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: 8 }}>
                Job Role Forecast (JRF) helps you understand where AI poses the greatest exposure in your work and gives practical, actionable steps to stay relevant.
              </p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.65, fontSize: '0.93rem' }}>
                Quickly generate a task map of your role, classify tasks by risk, and get a concise summary with tools and actions.
              </p>
            </div>

            <button
              className="btn-ghost intro-cta"
              onClick={handleContinue}
              style={{
                position: 'absolute',
                top: '0.5in',
                right: 0,
                minWidth: 220,
                color: 'var(--accent)',
                borderColor: 'rgba(107,95,209,0.35)',
                background: 'rgba(107,95,209,0.14)',
                fontWeight: 500,
                marginTop: 0,
              }}
            >
              Continue to analysis →
            </button>
          </div>

            {/* FLOW: how the project works */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <div style={{ border: '0.5px solid var(--border)', borderRadius: 10, background: 'rgba(255,255,255,0.62)', padding: '0.9rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b5fd1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="4" r="2"/><path d="M12 6v6M7 9h10M9 17h6M8 20h8"/>
                  </svg>
                  <p className="label" style={{ marginBottom: 0 }}>FLOW</p>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                  1) Tell us your job title and industry — 2) We generate a task list — 3) AI scores each task and produces a concise summary with actions.
                </p>
              </div>

              <div style={{ border: '0.5px solid var(--border)', borderRadius: 10, background: 'rgba(255,255,255,0.62)', padding: '0.9rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0b352" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
                  </svg>
                  <p className="label" style={{ marginBottom: 0 }}>OUTPUT</p>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                  You receive a task-by-task breakdown, an overall risk rating, and a short future-proofing guide with recommended tools and actions.
                </p>
              </div>

              <div style={{ border: '0.5px solid var(--border)', borderRadius: 10, background: 'rgba(255,255,255,0.62)', padding: '0.9rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#117a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <p className="label" style={{ marginBottom: 0 }}>AUDIENCE</p>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                  Designed for professionals across industries — managers, analysts, engineers, designers, and front-line workers who want clear guidance.
                </p>
              </div>
            </div>

            {/* FRAMEWORK: visuals + credit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              <div style={{ border: '0.5px solid var(--border)', borderRadius: 10, background: 'rgba(255,255,255,0.82)', padding: '1rem' }}>
                <p className="label" style={{ marginBottom: 8 }}>ABOUT THE FRAMEWORK</p>

                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }} className="framework-grid">
                  <div style={{ width: 220, height: 180 }}>
                    <img src="/framework-1.svg" alt="Framework visual 1" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }} />
                  </div>

                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                      The Job Role Analysis framework provides:
                    </p>

                    <ul style={{ marginTop: 8, paddingLeft: '1rem' }}>
                      <li style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b5fd1" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        <span>Task mapping: turn a role into specific day-to-day tasks.</span>
                      </li>
                      <li style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0b352" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M9 11l3 3L22 4M9 11l3 3L22 4" stroke="#f0b352"/><circle cx="12" cy="12" r="9" fill="none" stroke="#f0b352"/></svg>
                        <span>Risk taxonomy: classify tasks (routine → strategic) and assign risk levels.</span>
                      </li>
                      <li style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#117a65" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <span>Actionable recommendations and tool suggestions per task.</span>
                      </li>
                      <li style={{ fontSize: '0.88rem', color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M12 2v8m-6-2v8a6 6 0 0 0 12 0v-8M4 20h16"/></svg>
                        <span>Timeline guidance: immediate, short-term, long-term actions for future-proofing.</span>
                      </li>
                    </ul>

                    <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text3)' }}>
                      This project is backed by the framework developed by Tauqeer Ali Khan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </section>
        </main>
    </div>
  )
}