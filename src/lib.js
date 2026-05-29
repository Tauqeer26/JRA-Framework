export const RISK_CONFIG = {
  'very-high': { color: '#C0392B', bg: 'rgba(192,57,43,0.12)', border: 'rgba(192,57,43,0.3)',  label: 'Very High Risk', pill: 'VH', dot: '#C0392B', taskType: 'Routine'        },
  'high':      { color: '#D4820A', bg: 'rgba(212,130,10,0.12)', border: 'rgba(212,130,10,0.3)', label: 'High Risk',      pill: 'H',  dot: '#D4820A', taskType: 'Repetitive'     },
  'medium':    { color: '#2471A3', bg: 'rgba(36,113,163,0.12)', border: 'rgba(36,113,163,0.3)', label: 'Medium Risk',    pill: 'M',  dot: '#2471A3', taskType: 'Rule-Based'     },
  'low-med':   { color: '#1E8449', bg: 'rgba(30,132,73,0.12)',  border: 'rgba(30,132,73,0.3)',  label: 'Low–Med Risk',   pill: 'LM', dot: '#1E8449', taskType: 'Creative'       },
  'low':       { color: '#117A65', bg: 'rgba(17,122,101,0.12)', border: 'rgba(17,122,101,0.3)', label: 'Low Risk',       pill: 'L',  dot: '#117A65', taskType: 'Strategic'      },
  'very-low':  { color: '#6C3483', bg: 'rgba(108,52,131,0.12)', border: 'rgba(108,52,131,0.3)', label: 'Very Low Risk',  pill: 'VL', dot: '#6C3483', taskType: 'Human-Centred'  },
}

export const TASK_TYPES = [
  'routine',
  'repetitive',
  'rule-based',
  'creative',
  'strategic',
  'human-centred',
]

export const TASK_TYPE_LABELS = {
  'routine':        'Routine',
  'repetitive':     'Repetitive',
  'rule-based':     'Rule-Based',
  'creative':       'Creative',
  'strategic':      'Strategic',
  'human-centred':  'Human-Centred',
}

export const INDUSTRIES = [
  'Healthcare & Medical', 'Finance & Banking', 'Legal', 'Education',
  'Technology & Software', 'Marketing & Media', 'Manufacturing',
  'Retail & E-commerce', 'Construction & Engineering',
  'Government & Public Sector', 'Non-profit', 'Consulting',
  'Hospitality & Tourism', 'Transport & Logistics', 'Energy & Utilities',
]

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function apiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path
}

export async function analyseRole(action, payload) {
  console.log('[API] analyseRole request', { action })
  const res = await fetch(apiUrl('/api/analyse-role'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })

  const data = await res.json().catch(() => null)
  console.log('[API] analyseRole response', { status: res.status, ok: res.ok })

  if (!res.ok) {
    if (res.status === 529) {
      throw new Error('The app is under heavy load — please try again in a few minutes.')
    }
    const errObj = data?.error
    const message = (typeof errObj === 'string' ? errObj : errObj?.message) || data?.message || `API error ${res.status}`
    throw new Error(message)
  }

  if (data?.error) throw new Error(data.error.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data.error)))
  const text = data.content?.[0]?.text || ''
  if (!text) throw new Error('Empty response')
  return text
}

export function extractJSON(raw) {
  let cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const start = cleaned.indexOf('{')
  const end   = cleaned.lastIndexOf('}')
  if (start === -1) throw new Error('No JSON found in response')
  let jsonStr = end > start ? cleaned.slice(start, end + 1) : cleaned.slice(start)
  try {
    return JSON.parse(jsonStr)
  } catch {
    // Salvage truncated JSON
    let s = jsonStr.replace(/,\s*$/, '').replace(/,\s*[^,{[\]}"]*$/, '')
    const opens    = (s.match(/{/g) || []).length - (s.match(/}/g) || []).length
    const arrOpens = (s.match(/\[/g) || []).length - (s.match(/\]/g) || []).length
    for (let i = 0; i < arrOpens; i++) s += ']'
    for (let i = 0; i < opens;    i++) s += '}'
    return JSON.parse(s)
  }
}
