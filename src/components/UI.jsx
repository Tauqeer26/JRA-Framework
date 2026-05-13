import { RISK_CONFIG } from '../lib'
import { useState, useEffect } from 'react'

export function BrandMark({ compact = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/file.svg"
        alt="JRA Job Role Analyzer"
        style={{
          width: compact ? 72 : 120,
          height: 'auto',
          display: 'block',
          flexShrink: 0,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}

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
  const [displayText, setDisplayText] = useState(text)
  const [progress, setProgress] = useState(0)

  const messages = {
    task: [
      'Getting it ready for you...',
      'Analyzing your role...',
      'Building your task list...',
    ],
    summary: [
      'Getting it ready for you...',
      'Analyzing AI exposure...',
      'Calculating risk scores...',
      'Checking model outputs...',
      'Cross-referencing recommended tools...',
      'Building recommendations...',
      'Formatting your action plan...',
      'Finalizing recommendations...',
      'Almost there...',
    ]
  }
  // Choose mode: 'task' rotates indefinitely; 'summary' rotates then shows final message.
  const isTask = text && text.toLowerCase().includes('personalised')

  const rotatingList = isTask ? messages.task : messages.summary.slice(0, -1)
  const finalMessage = isTask ? null : messages.summary[messages.summary.length - 1]

  useEffect(() => {
    let messageIndex = 0
    let cycles = 0
    const interval = setInterval(() => {
      // For task mode rotate indefinitely
      if (isTask) {
        messageIndex = (messageIndex + 1) % rotatingList.length
        setDisplayText(rotatingList[messageIndex])
        return
      }

      // For summary mode rotate a few times, then show finalMessage permanently
      messageIndex = (messageIndex + 1) % rotatingList.length
      setDisplayText(rotatingList[messageIndex])
      if (messageIndex === rotatingList.length - 1) {
        cycles += 1
      }
      // After three full cycles, move to final 'Almost there...' and stop rotating
      if (cycles >= 3) {
        setDisplayText(finalMessage)
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [text])

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text3)', fontSize: '0.85rem', marginBottom: 12 }}>
        <div className="spinner" />
        <span>{displayText}</span>
      </div>
    </div>
  )
}

export function RiskLegend() {
  return (
    <div className="risk-legend" style={{
      position: 'fixed', bottom: '1.25rem', right: '1.25rem',
      background: 'rgba(255,255,255,0.96)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '0.75rem 1rem', zIndex: 50,
      boxShadow: '0 16px 40px rgba(15,23,42,0.08)', minWidth: 190,
    }}>
      <p className="label" style={{ marginBottom: 8 }}>RISK SCALE</p>
      {Object.entries(RISK_CONFIG).map(([k, v]) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: 'var(--text2)', flex: 1 }}>{v.label}</span>
          <span style={{
            fontSize: 9, color: v.color, background: v.bg,
            border: `0.5px solid ${v.border}`,
            padding: '1px 6px', borderRadius: 10, fontWeight: 500, whiteSpace: 'nowrap',
          }}>{v.taskType}</span>
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
      position: 'sticky', top: 0, background: 'rgba(247,251,255,0.92)',
      backdropFilter: 'blur(10px)', zIndex: 40,
    }}>
      <div className="topbar-brand" style={{ position: 'absolute', left: '2rem' }}>
        <BrandMark compact />
      </div>

      {activeStep !== undefined && (
        <div className="topbar-steps" style={{ display: 'flex', gap: 6, alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {steps.map((label, i) => (
            <div key={i} className="topbar-step" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="topbar-step-circle" style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeStep >= i ? 'var(--brand-gradient)' : 'rgba(17,32,74,0.08)',
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
