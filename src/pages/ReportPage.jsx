import { useEffect, useState } from 'react'
import { INDUSTRIES } from '../lib'

export default function ReportPage({ onBack, onStartOver, roleInfo }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [industry, setIndustry] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    setJobRole(roleInfo?.jobTitle || '')
    setIndustry(roleInfo?.industryFinal || '')
  }, [roleInfo])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !jobRole.trim() || !industry.trim() || !message.trim()) {
      return
    }

    setSending(true)
    setSendError('')

    try {
      const response = await fetch('/api/report-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          jobRole: jobRole.trim(),
          industry: industry.trim(),
          message: message.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send report request')
      }

      setSubmitted(true)
    } catch (error) {
      setSendError(error.message || 'Failed to send report request')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '3rem 2rem 4rem' }}>
        <div className="card fade-up" style={{ background: 'var(--bg3)', borderRadius: 12, padding: '2rem', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ maxWidth: 560 }}>
              <p className="label" style={{ color: 'var(--accent)', marginBottom: 10 }}>STEP 4 - REPORT</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1.08, marginBottom: 12 }}>
                Get an expert review and AI exposure report
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75 }}>
                Share a few details and we’ll prepare a tailored review based on the role analysis you just completed.
              </p>
            </div>

            <div style={{ padding: '0.9rem 1rem', borderRadius: 12, background: 'rgba(255,255,255,0.72)', border: '0.5px solid var(--border)', minWidth: 220 }}>
              <p className="label" style={{ marginBottom: 8 }}>YOUR ANALYSIS</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 4 }}>{roleInfo?.jobTitle || 'Role not set'}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text3)', lineHeight: 1.5 }}>{roleInfo?.industryFinal || 'Industry not set'}</p>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: '2rem 1.25rem', borderRadius: 12, background: 'rgba(255,255,255,0.82)', border: '0.5px solid var(--border)', textAlign: 'center' }}>
              <p className="label" style={{ color: 'var(--accent)', marginBottom: 10 }}>REQUEST RECEIVED</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 10 }}>Thanks, we’ll be in touch soon.</h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 1.5rem' }}>
                Your expert review request has been captured. You can start a new analysis or go back to the summary if you want to update anything.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="btn-ghost" type="button" onClick={onBack}>Back to Summary</button>
                <button className="btn-primary" type="button" onClick={onStartOver}>Start new analysis</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              {sendError && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: 10, background: 'rgba(192,57,43,0.08)', border: '0.5px solid rgba(192,57,43,0.22)', color: 'var(--text2)', fontSize: '0.9rem' }}>
                  {sendError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div>
                  <label className="label">NAME</label>
                  <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" disabled={sending} />
                </div>

                <div>
                  <label className="label">EMAIL</label>
                  <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" disabled={sending} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div>
                  <label className="label">JOB ROLE</label>
                  <input className="input" value={jobRole} onChange={e => setJobRole(e.target.value)} placeholder="Your job title" disabled={sending} />
                </div>

                <div>
                  <label className="label">INDUSTRY</label>
                  <select className="input" value={industry} onChange={e => setIndustry(e.target.value)} disabled={sending}>
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">MESSAGE</label>
                <textarea
                  className="input"
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us what kind of review or guidance you want."
                  style={{ resize: 'vertical', minHeight: 140 }}
                  disabled={sending}
                />
              </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn-ghost" onClick={onBack} type="button" disabled={sending}>Back to Summary</button>
                  <button className="btn-primary" onClick={onStartOver} type="button" disabled={sending}>Start new analysis</button>
                </div>
                <button className="btn-primary" type="submit" disabled={sending} style={{ opacity: sending ? 0.9 : 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {sending ? (
                    <>
                      <div className="spinner" style={{ width: 14, height: 14 }} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Request report →</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
