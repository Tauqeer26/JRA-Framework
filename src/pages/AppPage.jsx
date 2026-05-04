import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { callClaude, extractJSON } from '../lib'
import { Topbar, RiskLegend } from '../components/UI'
import StepRole from './StepRole'
import StepTasks from './StepTasks'
import StepReport from './StepReport'

export default function AppPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [step, setStep]           = useState(0)
  const [roleInfo, setRoleInfo]   = useState(null)
  const [tasks, setTasks]         = useState([])
  const [loadingTasks, setLoadingTasks]   = useState(false)
  const [report, setReport]       = useState(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const [reportError, setReportError]     = useState('')

  function handleLogout() {
    logout()
    navigate('/')
  }

  // Step 0 → 1: generate tasks
  async function handleRoleNext(info) {
    setRoleInfo(info)
    setLoadingTasks(true)
    setStep(1)
    try {
      const raw = await callClaude(
        'You are an AI workforce analyst. Return ONLY valid JSON — no markdown, no explanation.',
        `Job title: "${info.jobTitle}", Industry: "${info.industryFinal}".
Generate a realistic list of 10-14 day-to-day tasks this person does.
For each task assign:
- task_type: one of routine, repetitive, rule-based, creative, strategic, human-centred
- risk: one of very-high, high, medium, low-med, low, very-low

Return ONLY a JSON array:
[{"task":"...", "task_type":"...", "risk":"..."}, ...]`,
        2000
      )
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const start = cleaned.indexOf('[')
      const end   = cleaned.lastIndexOf(']')
      setTasks(JSON.parse(cleaned.slice(start, end + 1)))
    } catch {
      setTasks([
        { task: 'Administrative tasks',         task_type: 'routine',       risk: 'very-high' },
        { task: 'Repetitive reporting',          task_type: 'repetitive',    risk: 'very-high' },
        { task: 'Process-following work',        task_type: 'rule-based',    risk: 'high'      },
        { task: 'Creative problem solving',      task_type: 'creative',      risk: 'medium'    },
        { task: 'Strategic planning',            task_type: 'strategic',     risk: 'low-med'   },
        { task: 'Stakeholder communication',     task_type: 'human-centred', risk: 'very-low'  },
      ])
    }
    setLoadingTasks(false)
  }

  // Step 1 → 2: generate report
  const generateReport = useCallback(async () => {
    setLoadingReport(true)
    setReportError('')
    setReport(null)
    setStep(2)

    const taskSummary = tasks.map(t => `- ${t.task} [${t.task_type}, ${t.risk}]`).join('\n')

    try {
      const raw = await callClaude(
        'You are an AI workforce strategist. Return ONLY a valid JSON object. No markdown, no text outside JSON.',
        `Role: "${roleInfo.jobTitle}", Industry: "${roleInfo.industryFinal}".
Tasks:
${taskSummary}

Return this JSON (keep strings concise, max 2 tools per task, max 5 top_tools):
{
  "overall_risk": "very-high|high|medium|low-med|low|very-low",
  "summary": "2 sentences on overall AI exposure",
  "industry_note": "1 sentence on AI dynamics in this industry",
  "task_breakdown": [
    {
      "task": "exact task name",
      "risk": "very-high|high|medium|low-med|low|very-low",
      "why": "1 short sentence why this risk level",
      "timeline": "Now|1-2 yrs|3-5 yrs",
      "action": "one specific action to take",
      "tools": [{"name":"Tool","purpose":"short phrase","url":"https://example.com"}]
    }
  ],
  "future_proof_guide": {
    "immediate": ["3 short actions"],
    "short_term": ["3 short actions"],
    "long_term": ["3 short actions"],
    "skills_to_build": ["4 skills"],
    "top_tools": [{"name":"Tool","category":"cat","why":"1 sentence","url":"https://example.com"}]
  }
}
Only return the JSON. Keep all strings short.`,
        8000
      )
      const parsed = extractJSON(raw)
      setReport(parsed)
      setReportError('')
    } catch (e) {
      setReportError(e.message || 'Unknown error')
    }
    setLoadingReport(false)
  }, [tasks, roleInfo])

  function handleStartOver() {
    setStep(0)
    setRoleInfo(null)
    setTasks([])
    setReport(null)
    setReportError('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Topbar user={user} onLogout={handleLogout} step={step} />

      {step === 0 && (
        <StepRole onNext={handleRoleNext} initial={roleInfo} />
      )}
      {step === 1 && (
        <StepTasks
          tasks={tasks} setTasks={setTasks}
          loading={loadingTasks} roleInfo={roleInfo}
          onBack={() => setStep(0)}
          onNext={generateReport}
        />
      )}
      {step === 2 && (
        <StepReport
          report={report} loading={loadingReport}
          error={reportError} roleInfo={roleInfo}
          onRetry={generateReport}
          onEditTasks={() => setStep(1)}
          onStartOver={handleStartOver}
        />
      )}

      <RiskLegend />
    </div>
  )
}
