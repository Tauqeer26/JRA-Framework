import { useState } from 'react'
import { INDUSTRIES } from '../lib'

export default function StepRole({ onNext, initial, onBackToIntro }) {
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle || '')
  const [industry, setIndustry] = useState(initial?.industry || '')
  const [customIndustry, setCustomIndustry] = useState(initial?.customIndustry || '')

  const industryFinal = industry === 'Other' ? customIndustry : industry
  const canContinue = jobTitle.trim() && industryFinal.trim()

  function handleSubmit(e) {
    e.preventDefault()
    if (canContinue) onNext({ jobTitle: jobTitle.trim(), industry, customIndustry, industryFinal })
  }

  return (
    <div className="fade-up step-page" style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
        <p className="label" style={{ marginBottom: 0 }}>STEP 1 — IDENTIFY YOUR ROLE</p>
        <button className="btn-ghost" onClick={onBackToIntro} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
          ← Back to intro
        </button>
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
        fontWeight: 500, lineHeight: 1.2, color: 'var(--text)', marginBottom: '0.5rem',
      }}>Tell us about your work</h1>
      <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: 520 }}>
        We'll use AI to generate a personalised task list and assess your exposure to automation — specific to your exact role and industry.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="label">JOB TITLE</label>
          <input className="input" style={{ fontSize: '1rem', padding: '0.875rem 1rem' }}
            placeholder="e.g. Senior Product Manager, ICU Nurse, Tax Accountant, Civil Engineer..."
            value={jobTitle} onChange={e => setJobTitle(e.target.value)}
          />
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--accent)',
            marginTop: 8,
            lineHeight: 1.5,
            fontWeight: 700,
          }}>
            Be specific — "Senior Software Engineer" gives better results than "Engineer"
          </p>
        </div>

        <div>
          <label className="label">INDUSTRY</label>
          <div className="step-role-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8,
          }}>
            {INDUSTRIES.map(ind => (
              <button type="button" key={ind} onClick={() => setIndustry(ind)} style={{
                padding: '0.65rem 0.875rem', borderRadius: 9, textAlign: 'left',
                border: industry === ind ? '1.5px solid var(--accent)' : '0.5px solid var(--border)',
                background: industry === ind ? 'var(--accent-bg)' : 'rgba(255,255,255,0.78)',
                color: industry === ind ? 'var(--text)' : 'var(--text2)',
                fontSize: '0.825rem', cursor: 'pointer', transition: 'all 0.2s',
              }}>{ind}</button>
            ))}
          </div>

          {industry === 'Other' && (
            <input className="input" style={{ marginTop: 10 }}
              placeholder="Type your industry..."
              value={customIndustry} onChange={e => setCustomIndustry(e.target.value)}
            />
          )}
        </div>

        <div style={{ paddingTop: 8 }}>
          <button type="submit" className="btn-primary"
            disabled={!canContinue}
            style={{ padding: '0.875rem 2.5rem', fontSize: '0.95rem' }}>
            Generate my task list →
          </button>
        </div>
      </form>
    </div>
  )
}
