import { RISK_CONFIG } from '../lib'
import { RiskPill, Spinner } from '../components/UI'

function TaskCard({ t }) {
  const rc = RISK_CONFIG[t.risk] || RISK_CONFIG['medium']
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `0.5px solid ${rc.border}`, marginBottom: 10 }}>
      {/* Header */}
      <div style={{
        padding: '0.875rem 1rem', background: rc.bg,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)', flex: 1 }}>{t.task}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {t.timeline && (
            <span style={{
              fontSize: 11, color: 'var(--text2)',
              background: 'rgba(15,23,42,0.06)', padding: '2px 8px', borderRadius: 20,
            }}>{t.timeline}</span>
          )}
          <RiskPill risk={t.risk} />
        </div>
      </div>

      {/* Why this risk level */}
      <div style={{
        padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.72)',
        borderTop: `0.5px solid ${rc.border}`, borderBottom: `0.5px solid ${rc.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            flexShrink: 0, marginTop: 2, width: 20, height: 20, borderRadius: '50%',
            background: rc.bg, border: `1px solid ${rc.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 10, color: rc.color, fontWeight: 700 }}>?</span>
          </div>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', color: rc.color, marginBottom: 4, fontWeight: 500 }}>
              WHY {rc.label.toUpperCase()}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.72 }}>{t.why}</p>
          </div>
        </div>
      </div>

      {/* Action + tools */}
      <div style={{ padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.04)' }}>
        {t.action && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.08em', color: rc.color, fontWeight: 500, flexShrink: 0, marginTop: 2 }}>
              ACTION
            </span>
            <p style={{ fontSize: '0.835rem', color: 'var(--text2)', lineHeight: 1.65 }}>{t.action}</p>
          </div>
        )}
        {t.tools?.length > 0 && (
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 10, fontWeight: 500 }}>
              AI TOOLS FOR THIS TASK
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {t.tools.map((tool, j) => (
                <a key={j} href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                  padding: '10px 16px', borderRadius: 8, fontSize: '0.85rem', textDecoration: 'none',
                  background: 'rgba(29,99,224,0.12)', color: 'var(--accent)',
                  border: '1.5px solid rgba(29,99,224,0.28)',
                  display: 'flex', alignItems: 'center', gap: 7, fontWeight: 500,
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(29,99,224,0.1)',
                }}>
                  <span>{tool.name}</span>
                  <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StepReport({ report, loading, error, roleInfo, onRetry, onEditTasks, onNext, onStartOver }) {
  if (loading) {
    return (
      <div className="step-page" style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <p className="label">STEP 3 — YOUR FULL SUMMARY</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, color: 'var(--text)', marginBottom: '2rem' }}>
          Building your summary
        </h1>
        <div className="card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Spinner text="Analysing your tasks with AI..." />
          <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Generating risk scores, tool recommendations, and your future-proofing plan...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="step-page" style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(192,57,43,0.8)', marginBottom: 8 }}>SUMMARY GENERATION FAILED</p>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 8 }}>
            Something went wrong. This usually happens if the response was too long or malformed.
          </p>
          {error && (
            <p style={{
              color: 'var(--text3)', fontSize: '0.775rem', fontFamily: 'monospace',
              marginBottom: '1.5rem', padding: '0.5rem 0.75rem',
              background: 'rgba(0,0,0,0.3)', borderRadius: 6, display: 'inline-block',
            }}>{error}</p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            <button className="btn-primary" onClick={onRetry} style={{ padding: '0.65rem 1.5rem' }}>Retry →</button>
            <button className="btn-ghost" onClick={onEditTasks}>← Edit tasks</button>
          </div>
        </div>
      </div>
    )
  }

  const rc = RISK_CONFIG[report.overall_risk] || RISK_CONFIG['medium']

  return (
    <div className="fade-up step-page" style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <p className="label">STEP 3 — YOUR FULL SUMMARY</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, color: 'var(--text)', marginBottom: '0.25rem' }}>
        AI Risk & Future-Proofing Summary
      </h1>
      <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        <span style={{ color: 'var(--accent)' }}>{roleInfo.jobTitle}</span>
        <span style={{ color: 'var(--text3)' }}> · {roleInfo.industryFinal}</span>
      </p>

      {/* Overall risk */}
      <div style={{
        background: 'rgba(255,255,255,0.82)', border: `1px solid ${rc.border}`,
        borderRadius: 14, padding: '1.5rem', marginBottom: '1rem',
      }}>
        <p className="label">OVERALL AI EXPOSURE</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: rc.color, marginBottom: '0.75rem' }}>
          {rc.label}
        </p>
        <p style={{ fontSize: '0.92rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: report.industry_note ? '0.85rem' : 0 }}>
          {report.summary}
        </p>
        {report.industry_note && (
          <div style={{
            padding: '0.75rem 1rem', borderRadius: 8,
            background: 'rgba(15,23,42,0.03)', border: '0.5px solid var(--border)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6, letterSpacing: '0.08em' }}>INDUSTRY CONTEXT</p>
            <p style={{ fontSize: '0.835rem', color: 'var(--text2)', lineHeight: 1.65 }}>{report.industry_note}</p>
          </div>
        )}
      </div>

      {/* Task breakdown */}
      {report.task_breakdown?.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p className="label" style={{ marginBottom: '1rem' }}>TASK-BY-TASK BREAKDOWN</p>
          {report.task_breakdown.map((t, i) => <TaskCard key={i} t={t} />)}
        </div>
      )}

      {/* Future-proof guide */}
      {report.future_proof_guide && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p className="label" style={{ marginBottom: '1rem' }}>HOW TO FUTURE-PROOF YOUR ROLE</p>

          <div className="future-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
            {[
              { key: 'immediate', label: 'Do now', color: '#0b1f69' },
              { key: 'short_term', label: 'Next 1–2 years', color: '#1d63e0' },
              { key: 'long_term', label: '3–5 year plan', color: '#3c8cff' },
            ].map(({ key, label, color }) => (
              <div key={key} style={{
                padding: '1rem', borderRadius: 10,
                background: 'rgba(255,255,255,0.82)', border: '0.5px solid var(--border)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginBottom: 8 }} />
                <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text3)', marginBottom: 8, letterSpacing: '0.06em' }}>
                  {label.toUpperCase()}
                </p>
                <ul style={{ paddingLeft: '1rem' }}>
                  {report.future_proof_guide[key]?.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.55, marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {report.future_proof_guide.skills_to_build?.length > 0 && (
            <div className="skills-wrap" style={{ marginBottom: '1.25rem' }}>
              <p className="label" style={{ marginBottom: 8 }}>SKILLS TO BUILD</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {report.future_proof_guide.skills_to_build.map((s, i) => (
                  <span key={i} style={{
                    padding: '7px 14px', borderRadius: 20, fontSize: '0.82rem',
                    background: 'rgba(29,99,224,0.1)', color: 'var(--accent)',
                    border: '0.5px solid rgba(29,99,224,0.2)',
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {report.future_proof_guide.top_tools?.length > 0 && (
            <div>
              <p className="label" style={{ marginBottom: 8 }}>TOP AI TOOLS FOR YOUR ROLE</p>
              <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {report.future_proof_guide.top_tools.map((tool, i) => (
                  <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                    padding: '0.875rem', borderRadius: 10, textDecoration: 'none',
                    background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--border)',
                    display: 'block', transition: 'border-color 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{tool.name}</p>
                      <span style={{ fontSize: 10, color: 'var(--text3)' }}>↗</span>
                    </div>
                    {tool.category && (
                      <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 5, letterSpacing: '0.06em' }}>
                        {tool.category.toUpperCase()}
                      </p>
                    )}
                    <p style={{ fontSize: '0.79rem', color: 'var(--text2)', lineHeight: 1.6 }}>{tool.why}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reassessment */}
      <div style={{
        padding: '1rem 1.25rem', borderRadius: 10,
        border: '0.5px dashed var(--border)',
        background: 'rgba(255,255,255,0.72)', marginBottom: '1.5rem',
      }}>
        <p className="label" style={{ marginBottom: 4 }}>REASSESSMENT REMINDER</p>
        <p style={{ fontSize: '0.835rem', color: 'var(--text3)', lineHeight: 1.7 }}>
          AI capabilities shift rapidly. Revisit this analysis in{' '}
          <strong style={{ color: 'var(--text2)' }}>6–12 months</strong> — risk levels and tool recommendations will evolve as new models are released.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={onNext}
          style={{ padding: '0.75rem 1.5rem' }}>View Report →</button>
        <button className="btn-primary" onClick={onEditTasks}
          style={{ padding: '0.75rem 1.5rem' }}>← Edit tasks</button>
        <button className="btn-primary" onClick={onStartOver}
          style={{ padding: '0.75rem 1.5rem' }}>
          Start new analysis
        </button>
      </div>
    </div>
  )
}
