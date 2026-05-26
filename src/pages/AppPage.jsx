import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyseRole, extractJSON } from '../lib'
import { Topbar, RiskLegend } from '../components/UI'
import StepRole from './StepRole'
import StepTasks from './StepTasks'
import StepReport from './StepReport'
import ReportPage from './ReportPage'

export default function AppPage() {
  const navigate = useNavigate()
  const [step, setStep]           = useState(0)
  const [roleInfo, setRoleInfo]   = useState(null)
  const [tasks, setTasks]         = useState([])
  const [loadingTasks, setLoadingTasks]   = useState(false)
  const [report, setReport]       = useState(null)
  const [loadingReport, setLoadingReport] = useState(false)
  const [reportError, setReportError]     = useState('')

  // Step 0 → 1: generate tasks
  async function handleRoleNext(info) {
    setRoleInfo(info)
    setLoadingTasks(true)
    setStep(1)
    try {
      const raw = await analyseRole('tasks', {
        jobTitle: info.jobTitle,
        industryFinal: info.industryFinal,
      })
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      const start = cleaned.indexOf('[')
      const end   = cleaned.lastIndexOf(']')
      setTasks(JSON.parse(cleaned.slice(start, end + 1)))
    } catch {
      setTasks([
        { task: 'Administrative tasks',         task_type: 'routine',       risk: 'very-high' },
        { task: 'Repetitive summarising',         task_type: 'repetitive',    risk: 'very-high' },
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

    try {
      const raw = await analyseRole('report', {
        jobTitle: roleInfo.jobTitle,
        industryFinal: roleInfo.industryFinal,
        tasks,
      })
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
      <Topbar activeStep={step} steps={['Role', 'Tasks', 'Summary', 'Report']} />

      {step === 0 && (
        <StepRole onNext={handleRoleNext} initial={roleInfo} onBackToIntro={() => navigate('/intro')} />
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
          onNext={() => setStep(3)}
          onStartOver={handleStartOver}
        />
      )}
      {step === 3 && (
        <ReportPage
          onBack={() => setStep(2)}
          onStartOver={handleStartOver}
          roleInfo={roleInfo}
        />
      )}

      {step === 2 && <RiskLegend />}
    </div>
  )
}
