import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'

loadEnvFile()

const PORT = Number(process.env.PORT || process.env.API_PORT || 8787)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const ANTHROPIC_VERSION = process.env.ANTHROPIC_VERSION || '2023-06-01'
const DIST_DIR = path.resolve(process.cwd(), 'dist')
const INDEX_FILE = path.join(DIST_DIR, 'index.html')
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504, 529])

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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { ok: true })
    return
  }

  if (req.method !== 'POST' || url.pathname !== '/api/anthropic/messages') {
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

  if (!ANTHROPIC_API_KEY) {
    sendJson(res, 500, {
      error: 'Missing ANTHROPIC_API_KEY. Set it in your environment before starting the API server.',
    })
    return
  }

  try {
    const body = await readJsonBody(req)
    console.log('[API] /api/anthropic/messages request', {
      max_tokens: body.max_tokens ?? 2000,
      messages: Array.isArray(body.messages) ? body.messages.length : 0,
    })

    const upstreamRes = await callAnthropicWithRetry(body)

    if (upstreamRes.status === 529) {
      console.warn('[API] Anthropic overloaded (529) after all retries')
      sendJson(res, 529, { error: 'The app is under heavy load — please try again in a few minutes.' })
      return
    }

    const text = await upstreamRes.text()
    let payload

    try {
      payload = text ? JSON.parse(text) : {}
    } catch {
      payload = { error: text || `Anthropic returned status ${upstreamRes.status}` }
    }

    console.log('[API] /api/anthropic/messages response', {
      status: upstreamRes.status,
      ok: upstreamRes.ok,
    })

    sendJson(res, upstreamRes.status, payload)
  } catch (error) {
    console.error('[API] /api/anthropic/messages error', error)
    sendJson(res, 500, { error: error.message || 'Unexpected server error' })
  }
})

server.listen(PORT, () => {
  console.log(`Anthropic API server listening on http://localhost:${PORT}`)
})
