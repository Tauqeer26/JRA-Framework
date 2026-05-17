import { jsPDF } from 'jspdf'
import { RISK_CONFIG } from '../lib'
import { RiskPill, Spinner } from '../components/UI'

function wrapLines(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text || ''), maxWidth)
}

function addWrappedLines(doc, lines, x, y, lineHeight, maxWidth, options = {}) {
  const { fontSize = 10, color = [51, 65, 85], bold = false, gapAfter = 0 } = options
  doc.setFontSize(fontSize)
  doc.setTextColor(...color)
  doc.setFont('helvetica', bold ? 'bold' : 'normal')

  let cursorY = y
  lines.forEach(line => {
    const wrapped = wrapLines(doc, line, maxWidth)
    wrapped.forEach((segment, index) => {
      doc.text(segment, x, cursorY)
      cursorY += lineHeight
      if (index < wrapped.length - 1) {
        cursorY += 0
      }
    })
  })

  return cursorY + gapAfter
}

function downloadSummaryPdf(report, roleInfo) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 48
  const maxWidth = pageWidth - marginX * 2
  let y = 54

  const ensureSpace = (spaceNeeded = 40) => {
    if (y + spaceNeeded > pageHeight - 48) {
      doc.addPage()
      y = 54
    }
  }

  const sectionTitle = title => {
    ensureSpace(44)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(15, 23, 42)
    doc.text(title, marginX, y)
    y += 18
  }

  const body = text => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(51, 65, 85)
    const lines = wrapLines(doc, text, maxWidth)
    lines.forEach(line => {
      ensureSpace(16)
      doc.text(line, marginX, y)
      y += 14
    })
    y += 2
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(15, 23, 42)
  doc.text('AI Risk & Future-Proofing Summary', marginX, y)
  y += 22

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Role: ${roleInfo?.jobTitle || 'Not provided'}`, marginX, y)
  y += 14
  doc.text(`Industry: ${roleInfo?.industryFinal || 'Not provided'}`, marginX, y)
  y += 14
  doc.text(`Overall AI exposure: ${RISK_CONFIG[report.overall_risk]?.label || report.overall_risk || 'Not provided'}`, marginX, y)
  y += 22

  sectionTitle('Summary')
  body(report.summary)

  if (report.industry_note) {
    sectionTitle('Industry context')
    body(report.industry_note)
  }

  if (report.task_breakdown?.length > 0) {
    sectionTitle('Task breakdown')
    report.task_breakdown.forEach(task => {
      ensureSpace(54)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(15, 23, 42)
      doc.text(`${task.task} - ${task.risk || 'risk not provided'}`, marginX, y)
      y += 14
      body(task.why || 'No explanation provided.')
      if (task.timeline) {
        body(`Timeline: ${task.timeline}`)
      }
      if (task.action) {
        body(`Action: ${task.action}`)
      }
      y += 4
    })
  }

  if (report.future_proof_guide) {
    sectionTitle('Future-proofing guide')
    const guideSections = [
      ['Do now', report.future_proof_guide.immediate],
      ['Next 1-2 years', report.future_proof_guide.short_term],
      ['3-5 year plan', report.future_proof_guide.long_term],
    ]

    guideSections.forEach(([label, items]) => {
      if (items?.length) {
        ensureSpace(40)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(37, 99, 235)
        doc.text(label, marginX, y)
        y += 14
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(51, 65, 85)
        items.forEach(item => {
          ensureSpace(18)
          const lines = wrapLines(doc, `- ${item}`, maxWidth)
          lines.forEach(line => {
            ensureSpace(14)
            doc.text(line, marginX, y)
            y += 12
          })
        })
        y += 4
      }
    })

    if (report.future_proof_guide.skills_to_build?.length) {
      ensureSpace(30)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(37, 99, 235)
      doc.text('Skills to build', marginX, y)
      y += 14
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      report.future_proof_guide.skills_to_build.forEach(skill => {
        ensureSpace(16)
        const lines = wrapLines(doc, `- ${skill}`, maxWidth)
        lines.forEach(line => {
          ensureSpace(14)
          doc.text(line, marginX, y)
          y += 12
        })
      })
    }
  }

  doc.save('ai-risk-summary.pdf')
}

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: '0.25rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, color: 'var(--text)', marginBottom: 0, flex: '1 1 340px' }}>
          AI Risk & Future-Proofing Summary
        </h1>
        {report && (
          <button
            className="btn-primary"
            type="button"
            onClick={onNext}
            style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <span>Get your report</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
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
        <button
          className="btn-primary"
          type="button"
          onClick={() => downloadSummaryPdf(report, roleInfo)}
          style={{ padding: '0.85rem 1.75rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 18px 44px rgba(29,99,224,0.22)', borderRadius: 12 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 3v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 21H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 600 }}>Download PDF</span>
        </button>
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
