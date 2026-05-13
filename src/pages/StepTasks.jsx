import { useState } from 'react'
import { TASK_TYPES, TASK_TYPE_LABELS } from '../lib'
import { Spinner } from '../components/UI'

export default function StepTasks({ tasks, setTasks, loading, roleInfo, onBack, onNext }) {
  const [editingIdx, setEditingIdx] = useState(null)
  const [editText, setEditText]     = useState('')
  const [newTask, setNewTask]       = useState('')

  function removeTask(i) { setTasks(t => t.filter((_, idx) => idx !== i)) }
  function startEdit(i)  { setEditingIdx(i); setEditText(tasks[i].task) }
  function saveEdit(i) {
    if (!editText.trim()) return
    setTasks(t => t.map((item, idx) => idx === i ? { ...item, task: editText.trim() } : item))
    setEditingIdx(null)
  }
  function updateType(i, type) {
    setTasks(t => t.map((item, idx) => idx === i ? { ...item, task_type: type } : item))
  }
  function addTask() {
    if (!newTask.trim()) return
    setTasks(t => [...t, { task: newTask.trim(), task_type: 'routine', risk: 'medium' }])
    setNewTask('')
  }

  return (
    <div className="fade-up step-page" style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      <p className="label">STEP 2 — REVIEW & EDIT YOUR TASKS</p>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '2rem',
        fontWeight: 500, color: 'var(--text)', marginBottom: '0.25rem',
      }}>Your task breakdown</h1>
      <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--accent)' }}>{roleInfo.jobTitle}</span>
        <span style={{ color: 'var(--text3)' }}> · {roleInfo.industryFinal}</span>
      </p>
      <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginBottom: '2rem', lineHeight: 1.6 }}>
        Review and adjust the task type for each task, or edit the task name — then run the analysis.
      </p>

      {loading ? (
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Spinner text="Generating your personalised task list..." />
          <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>This takes about 10 seconds</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1rem' }}>
            {tasks.map((t, i) => (
              <div key={i} style={{
                borderRadius: 10,
                border: '0.5px solid var(--border)',
                background: 'rgba(255,255,255,0.84)',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {/* Task name row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.875rem 1rem' }}>
                  {editingIdx === i ? (
                    <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                      <input
                        className="input"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(i); if (e.key === 'Escape') setEditingIdx(null) }}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        autoFocus
                      />
                      <button className="btn-primary" onClick={() => saveEdit(i)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save</button>
                      <button className="btn-ghost" onClick={() => setEditingIdx(null)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>✕</button>
                    </div>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text)' }}>{t.task}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <button onClick={() => startEdit(i)} title="Edit task name" style={{
                          background: 'none', border: 'none', color: 'var(--text3)',
                          cursor: 'pointer', fontSize: 13, padding: '3px 5px', transition: 'color 0.2s',
                        }}>✏</button>
                        <button onClick={() => removeTask(i)} title="Remove task" style={{
                          background: 'none', border: 'none', color: 'rgba(192,57,43,0.5)',
                          cursor: 'pointer', fontSize: 14, padding: '3px 5px', transition: 'color 0.2s',
                        }}>✕</button>
                      </div>
                    </>
                  )}
                </div>

                {/* Task type row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '0.5rem 1rem 0.625rem',
                  borderTop: '0.5px solid rgba(29,99,224,0.12)',
                  background: 'rgba(29,99,224,0.04)',
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.06em' }}>TYPE</span>
                  <select
                    value={t.task_type}
                    onChange={e => updateType(i, e.target.value)}
                    style={{
                      fontSize: '0.775rem', padding: '3px 10px', borderRadius: 6,
                      border: '0.5px solid rgba(29,99,224,0.25)',
                      background: 'white',
                      color: 'var(--accent)', cursor: 'pointer', outline: 'none',
                      fontFamily: 'inherit', fontWeight: 500,
                    }}
                  >
                    {TASK_TYPES.map(type => (
                      <option key={type} value={type}>{TASK_TYPE_LABELS[type]}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add task */}
          <div className="task-add-row" style={{ display: 'flex', gap: 8, marginBottom: '2rem' }}>
            <input
              className="input"
              style={{ flex: 1 }}
              placeholder="Add a task not in the list..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <button className="btn-ghost" onClick={addTask}
              style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.25rem' }}>+ Add</button>
          </div>

          <div className="task-actions" style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn-primary"
              onClick={onNext}
              disabled={tasks.length === 0}
              style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}
            >
              Analyse & generate summary →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
