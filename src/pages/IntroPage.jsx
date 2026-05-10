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
      <main className="intro-page" style={{ maxWidth: 1020, margin: '0 auto', padding: '1.75rem 1.5rem 2.25rem' }}>
        <section className="card intro-shell" style={{ padding: '1.5rem 1.5rem 1.35rem', minHeight: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column' }}>
          <div className="intro-hero" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 18,
            flexWrap: 'wrap',
            marginBottom: '1rem',
            paddingRight: '13rem',
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
              <p style={{ color: 'var(--text2)', lineHeight: 1.65, fontSize: '0.93rem', marginBottom: 8 }}>
                AI is reshaping the job market by automating routine work, changing role expectations, and increasing demand for tool-driven skills.
              </p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.65, fontSize: '0.93rem' }}>
                JRF helps you analyze your role, understand where AI risk is highest, and find practical steps to stay relevant.
              </p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.65, fontSize: '0.88rem', marginTop: 8 }}>
                This project is backed by the Job Role Analysis framework developed by Tauqeer Ali Khan.
              </p>
            </div>

            <button
              className="btn-ghost"
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

          <div className="intro-grid intro-grid-2" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 12,
            marginBottom: 12,
          }}>
            <div style={{
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.62)',
              padding: '0.9rem 1rem',
            }}>
              <p className="label" style={{ marginBottom: 6 }}>FRAMEWORK FLOW</p>
              <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                Identify your role, break it into tasks, and classify them as routine, repetitive, rule-based, creative, strategic, or human-centred.
              </p>
            </div>

            <div style={{
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.62)',
              padding: '0.9rem 1rem',
            }}>
              <p className="label" style={{ marginBottom: 6 }}>RISK INTERPRETATION</p>
              <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.55 }}>
                High risk can already be automated. Medium risk may increase in 1-2 years. Low risk still depends on human judgment and strategy.
              </p>
            </div>
          </div>

          <div className="intro-grid intro-grid-3" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 12,
          }}>
            {[
              {
                title: 'High risk',
                text: 'Tasks can already be automated or strongly supported today. The response is to automate quickly and improve those workflows now.',
              },
              {
                title: 'Medium risk',
                text: 'Tasks may not be replaceable yet, but they can become more exposed in the next 1-2 years as AI tools improve.',
              },
              {
                title: 'Low risk',
                text: 'Tasks still rely heavily on human judgment, creativity, empathy, communication, responsibility, and strategic thinking.',
              },
            ].map(item => (
              <div key={item.title} style={{
                border: '0.5px solid var(--border)',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.62)',
                padding: '0.9rem 1rem',
              }}>
                <p className="label" style={{ marginBottom: 6 }}>{item.title}</p>
                <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.55 }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="intro-grid intro-grid-4" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
            marginBottom: 12,
          }}>
            <div style={{
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.62)',
              padding: '0.95rem 1rem',
            }}>
              <p className="label" style={{ marginBottom: 6 }}>WHAT THE FRAMEWORK DOES</p>
              <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.58 }}>
                It turns one job role into a structured task map, then uses the task map to judge AI exposure across the whole role.
              </p>
            </div>

            <div style={{
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.62)',
              padding: '0.95rem 1rem',
            }}>
              <p className="label" style={{ marginBottom: 6 }}>EXAMPLE ROLE</p>
              <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.58 }}>
                A role like Product Designer can be broken into UI creation, wireframing, research, decision-making, and collaboration tasks.
              </p>
            </div>

            <div style={{
              border: '0.5px solid var(--border)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.62)',
              padding: '0.95rem 1rem',
            }}>
              <p className="label" style={{ marginBottom: 6 }}>WHY IT MATTERS</p>
              <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.58 }}>
                Once you know which tasks are exposed, you can choose where to automate, where to learn AI tools, and where to build deeper expertise.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}