import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { URL } from 'node:url'

loadEnvFile()

const PORT = Number(process.env.PORT || process.env.API_PORT || 8787)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const ANTHROPIC_VERSION = process.env.ANTHROPIC_VERSION || '2023-06-01'
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8787',
  'http://127.0.0.1:8787',
]
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : DEFAULT_ALLOWED_ORIGINS)
    .map(origin => origin.trim())
    .filter(Boolean)
)
const ANALYSE_ROLE_ROUTE = '/api/analyse-role'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM || 'JRA Job Role Analyser <no-reply@jobroleanalyser.com>'
const EMAIL_TO = process.env.EMAIL_TO || 'alikhantauqeer26@gmail.com'
const DIST_DIR = path.resolve(process.cwd(), 'dist')
const INDEX_FILE = path.join(DIST_DIR, 'index.html')
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504, 529])
const SESSION_COOKIE_NAME = 'jra_session'
const DEFAULT_RATE_LIMIT_WINDOW_MS = readPositiveInteger(process.env.RATE_LIMIT_WINDOW_MS, 60_000)
const DEFAULT_ANALYSE_ROLE_LIMIT = readPositiveInteger(process.env.ANALYSE_ROLE_LIMIT, 6)
const DEFAULT_REPORT_REQUEST_LIMIT = readPositiveInteger(process.env.REPORT_REQUEST_LIMIT, 3)
const TASK_TYPES = new Set(['routine', 'repetitive', 'rule-based', 'creative', 'strategic', 'human-centred'])
const RISK_LEVELS = new Set(['very-high', 'high', 'medium', 'low-med', 'low', 'very-low'])
const rateLimitBuckets = new Map()

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
}

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function readPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? '').trim(), 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function formatMailError(error) {
  if (error?.status === 401 || error?.status === 403) {
    return 'Resend rejected the request. Check RESEND_API_KEY and confirm the from address is verified in Resend.'
  }

  if (error?.status === 429) {
    return 'Resend rate limit reached. Try again shortly.'
  }

  return error?.message || 'Failed to send report email'
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
  })
  res.end(JSON.stringify(payload))
}

function sendJsonWithHeaders(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...headers,
  })
  res.end(JSON.stringify(payload))
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const index = part.indexOf('=')
        if (index === -1) return [part, '']
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      })
  )
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`]

  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  if (options.secure) parts.push('Secure')

  return parts.join('; ')
}

function getOrCreateSession(req) {
  const cookies = parseCookies(req.headers.cookie || '')
  const existing = cookies[SESSION_COOKIE_NAME]
  const sessionId = existing || crypto.randomUUID()
  const sessionCreated = !existing
  const cookieHeader = existing
    ? null
    : serializeCookie(SESSION_COOKIE_NAME, sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      })

  return { sessionId, cookieHeader, sessionCreated }
}

function getClientKey(req, sessionId) {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '')
  const forwardedIp = forwardedFor.split(',')[0].trim()
  return sessionId || forwardedIp || req.socket.remoteAddress || 'unknown'
}

function formatSessionLog(sessionId) {
  return sessionId ? `${sessionId.slice(0, 8)}…` : 'none'
}

function rateLimit(req, routeKey, options = {}) {
  const session = getOrCreateSession(req)
  const { sessionId, cookieHeader, sessionCreated } = session
  const clientKey = getClientKey(req, sessionId)
  const windowMs = options.windowMs ?? DEFAULT_RATE_LIMIT_WINDOW_MS
  const limit = options.limit ?? DEFAULT_ANALYSE_ROLE_LIMIT
  const now = Date.now()
  const bucketKey = `${routeKey}:${clientKey}`
  const existing = rateLimitBuckets.get(bucketKey) || []
  const recent = existing.filter(timestamp => now - timestamp < windowMs)
  recent.push(now)
  rateLimitBuckets.set(bucketKey, recent)

  if (recent.length > limit) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
      cookieHeader,
      sessionCreated,
      requestCount: recent.length,
      limit,
    }
  }

  return {
    limited: false,
    sessionId,
    cookieHeader,
    sessionCreated,
    requestCount: recent.length,
    limit,
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return true
  return ALLOWED_ORIGINS.has(origin)
}

function getCorsHeaders(origin) {
  if (!origin || !isAllowedOrigin(origin)) return {}

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }
}

function rejectDisallowedOrigin(req, res) {
  if (isAllowedOrigin(req.headers.origin)) return false

  sendJson(res, 403, { error: 'Origin not allowed' })
  return true
}

function ensureJsonContentType(req, res) {
  const contentType = String(req.headers['content-type'] || '')
  if (contentType.includes('application/json')) return false

  sendJson(res, 415, { error: 'Content-Type must be application/json' })
  return true
}

function normalizeText(value, maxLength) {
  return String(value ?? '').trim().slice(0, maxLength)
}

function sanitizeTaskList(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0 || tasks.length > 20) {
    throw new Error('Tasks must be a non-empty array with no more than 20 items.')
  }

  return tasks.map((task, index) => {
    const taskName = normalizeText(task?.task, 160)
    const taskType = normalizeText(task?.task_type, 40)
    const risk = normalizeText(task?.risk, 20)

    if (!taskName) {
      throw new Error(`Task ${index + 1} is missing a task name.`)
    }

    if (!TASK_TYPES.has(taskType)) {
      throw new Error(`Task ${index + 1} has an invalid task type.`)
    }

    if (!RISK_LEVELS.has(risk)) {
      throw new Error(`Task ${index + 1} has an invalid risk level.`)
    }

    return {
      task: taskName,
      task_type: taskType,
      risk,
    }
  })
}

function buildRoleAnalysisRequest(body) {
  const action = normalizeText(body.action, 20)

  if (action === 'tasks') {
    const jobTitle = normalizeText(body.jobTitle, 120)
    const industryFinal = normalizeText(body.industryFinal, 120)

    if (!jobTitle || !industryFinal) {
      throw new Error('jobTitle and industryFinal are required.')
    }

    return {
      model: ANTHROPIC_MODEL,
      max_tokens: 2000,
      system: 'You are an AI workforce analyst. Return ONLY valid JSON. No markdown, no explanation.',
      messages: [{
        role: 'user',
        content: `Job title: "${jobTitle}", Industry: "${industryFinal}".
Generate a realistic list of 6-8 day-to-day tasks this person does.
For each task assign:
- task_type: one of routine, repetitive, rule-based, creative, strategic, human-centred
- risk: one of very-high, high, medium, low-med, low, very-low

Return ONLY a JSON array:
[{"task":"...", "task_type":"...", "risk":"..."}, ...]`,
      }],
    }
  }

  if (action === 'report') {
    const jobTitle = normalizeText(body.jobTitle, 120)
    const industryFinal = normalizeText(body.industryFinal, 120)
    const tasks = sanitizeTaskList(body.tasks)

    if (!jobTitle || !industryFinal) {
      throw new Error('jobTitle and industryFinal are required.')
    }

    const taskSummary = tasks.map(task => `- ${task.task} [${task.task_type}, ${task.risk}]`).join('\n')

    return {
      model: ANTHROPIC_MODEL,
      max_tokens: 8000,
      system: 'You are an AI workforce strategist. Return ONLY a valid JSON object. No markdown, no text outside JSON.',
      messages: [{
        role: 'user',
        content: `Role: "${jobTitle}", Industry: "${industryFinal}".

Task classification framework:
- routine / repetitive / rule-based → highly automatable, lean toward higher AI risk
- creative / strategic / human-centred → harder to automate, lean toward lower AI risk
The user has reviewed and confirmed the task type and risk level for each task below — treat these as ground truth and let them directly inform your analysis, timelines, and recommendations.

Tasks (format: task name [task_type, risk]):
${taskSummary}

Return this JSON (moderately concise, max 2 tools per task, max 5 top_tools):
{
  "overall_risk": "very-high|high|medium|low-med|low|very-low",
  "summary": "2-3 sentences on overall AI exposure",
  "industry_note": "1-2 sentences on AI dynamics in this industry",
  "task_breakdown": [
    {
      "task": "exact task name",
      "risk": "very-high|high|medium|low-med|low|very-low",
      "why": "1-2 short sentences why this risk level",
      "timeline": "Now|1-2 yrs|3-5 yrs",
      "action": "one specific action to take in 1-2 short sentences",
      "tools": [{"name":"Tool","purpose":"short phrase","url":"https://example.com"}]
    }
  ],
  "future_proof_guide": {
    "immediate": ["short actions"],
    "short_term": ["short actions"],
    "long_term": ["short actions"],
    "skills_to_build": ["short skills"],
    "top_tools": [{"name":"Tool","category":"cat","why":"1-2 short sentences","url":"https://example.com"}]
  }
}
Only return the JSON. Keep strings brief and practical, especially the future-proofing and tools sections.`,
      }],
    }
  }

  throw new Error('Unsupported analysis action.')
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  try {
    const data = fs.readFileSync(filePath)
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', chunk => {
      body += chunk
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })

    req.on('error', reject)
  })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function callAnthropicWithRetry(body) {
  let lastResponse = null

  for (let attempt = 0; attempt < 3; attempt++) {
    const upstreamRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: body.max_tokens ?? 2000,
        system: body.system ?? '',
        messages: Array.isArray(body.messages) ? body.messages : [],
      }),
    })

    if (!RETRYABLE_STATUS_CODES.has(upstreamRes.status) || attempt === 2) {
      return upstreamRes
    }

    lastResponse = upstreamRes
    await delay(800 * (attempt + 1))
  }

  return lastResponse
}

async function sendReportEmail(mailOptions) {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY. Add your Resend API key to the environment before sending report emails.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: mailOptions.to,
      reply_to: mailOptions.replyTo,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    }),
  })

  if (!response.ok) {
    let details
    try {
      const data = await response.json()
      details = data?.message || data?.error || ''
    } catch {
      details = await response.text().catch(() => '')
    }

    const error = new Error(details || 'Failed to send report email')
    error.status = response.status
    throw error
  }

  return response.json().catch(() => ({}))
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const corsHeaders = getCorsHeaders(req.headers.origin)

  if (Object.keys(corsHeaders).length > 0) {
    Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value))
  }

  if (req.method === 'OPTIONS') {
    if (rejectDisallowedOrigin(req, res)) return
    res.writeHead(204, corsHeaders)
    res.end()
    return
  }

  if (req.method === 'POST' && rejectDisallowedOrigin(req, res)) {
    return
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/report-request') {
    try {
      const limitState = rateLimit(req, 'report-request', {
        limit: DEFAULT_REPORT_REQUEST_LIMIT,
        windowMs: DEFAULT_RATE_LIMIT_WINDOW_MS,
      })

      console.log('[API] /api/report-request session', {
        session: formatSessionLog(limitState.sessionId),
        hasCookie: Boolean(parseCookies(req.headers.cookie || '')[SESSION_COOKIE_NAME]),
        newSession: limitState.sessionCreated,
        rateLimitCount: `${limitState.requestCount}/${limitState.limit}`,
        remainingRequests: Math.max(0, limitState.limit - limitState.requestCount),
      })

      if (limitState.limited) {
        const headers = {
          'Retry-After': String(limitState.retryAfterSeconds),
        }

        if (limitState.cookieHeader) {
          headers['Set-Cookie'] = limitState.cookieHeader
        }

        sendJsonWithHeaders(res, 429, { error: 'Too many report requests. Try again later.' }, headers)
        return
      }

      const body = await readJsonBody(req)
      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim()
      const jobRole = String(body.jobRole || '').trim()
      const industry = String(body.industry || '').trim()
      const message = String(body.message || '').trim()

      if (!name || !email || !jobRole || !industry || !message) {
        sendJson(res, 400, { error: 'All report fields are required.' })
        return
      }

      await sendReportEmail({
        from: RESEND_FROM,
        to: EMAIL_TO,
        replyTo: email,
        subject: `JRA report request from ${name}`,
        text: [
          'New report request from the JRA app',
          '',
          `Name: ${name}`,
          `Email: ${email}`,
          `Job role: ${jobRole}`,
          `Industry: ${industry}`,
          '',
          'Message:',
          message,
        ].join('\n'),
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6">
            <h2 style="margin: 0 0 12px">New JRA report request</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Job role:</strong> ${escapeHtml(jobRole)}</p>
            <p><strong>Industry:</strong> ${escapeHtml(industry)}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc">${escapeHtml(message)}</div>
          </div>
        `,
      })

      const headers = {}
      if (limitState.cookieHeader) {
        headers['Set-Cookie'] = limitState.cookieHeader
      }

      sendJsonWithHeaders(res, 200, { ok: true }, headers)
    } catch (error) {
      console.error('[API] /api/report-request error', error)
      sendJson(res, 500, { error: formatMailError(error) })
    }
    return
  }

  if (req.method !== 'POST' || url.pathname !== ANALYSE_ROLE_ROUTE) {
    if (req.method === 'GET' && fs.existsSync(INDEX_FILE)) {
      const assetPath = url.pathname === '/' ? INDEX_FILE : path.join(DIST_DIR, url.pathname)

      if (url.pathname !== '/' && fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
        sendFile(res, assetPath)
        return
      }

      sendFile(res, INDEX_FILE)
      return
    }

    sendJson(res, 404, { error: 'Not found' })
    return
  }

  if (ensureJsonContentType(req, res)) {
    return
  }

  if (!ANTHROPIC_API_KEY) {
    sendJson(res, 500, {
      error: 'Missing ANTHROPIC_API_KEY. Set it in your environment before starting the API server.',
    })
    return
  }

  try {
    const limitState = rateLimit(req, 'analyse-role', {
      limit: DEFAULT_ANALYSE_ROLE_LIMIT,
      windowMs: DEFAULT_RATE_LIMIT_WINDOW_MS,
    })

    console.log('[API] /api/analyse-role session', {
      session: formatSessionLog(limitState.sessionId),
      hasCookie: Boolean(parseCookies(req.headers.cookie || '')[SESSION_COOKIE_NAME]),
      newSession: limitState.sessionCreated,
      rateLimitCount: `${limitState.requestCount}/${limitState.limit}`,
      remainingRequests: Math.max(0, limitState.limit - limitState.requestCount),
    })

    if (limitState.limited) {
      const headers = {
        'Retry-After': String(limitState.retryAfterSeconds),
      }

      if (limitState.cookieHeader) {
        headers['Set-Cookie'] = limitState.cookieHeader
      }

      sendJsonWithHeaders(res, 429, { error: 'Too many analysis requests. Try again later.' }, headers)
      return
    }

    const body = await readJsonBody(req)
    const upstreamRequest = buildRoleAnalysisRequest(body)

    console.log('[API] /api/analyse-role request', {
      action: body.action,
      taskCount: Array.isArray(body.tasks) ? body.tasks.length : 0,
    })

    const upstreamRes = await callAnthropicWithRetry(upstreamRequest)

    if (upstreamRes.status === 529) {
      console.warn('[API] Anthropic overloaded (529) after all retries')
      const headers = {}
      if (limitState.cookieHeader) {
        headers['Set-Cookie'] = limitState.cookieHeader
      }
      sendJsonWithHeaders(res, 529, { error: 'The app is under heavy load — please try again in a few minutes.' }, headers)
      return
    }

    const text = await upstreamRes.text()
    let payload

    try {
      payload = text ? JSON.parse(text) : {}
    } catch {
      payload = { error: text || `Anthropic returned status ${upstreamRes.status}` }
    }

    console.log('[API] /api/analyse-role response', {
      status: upstreamRes.status,
      ok: upstreamRes.ok,
    })

    const headers = {}
    if (limitState.cookieHeader) {
      headers['Set-Cookie'] = limitState.cookieHeader
    }

    sendJsonWithHeaders(res, upstreamRes.status, payload, headers)
  } catch (error) {
    console.error('[API] /api/analyse-role error', error)
    sendJson(res, 500, { error: error.message || 'Unexpected server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Anthropic API server listening on http://localhost:${PORT}`)
})
