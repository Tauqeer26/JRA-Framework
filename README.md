# JRA App

This app now calls Anthropic through a local Node API instead of directly from the browser.

## Why this fixes CORS

The browser no longer sends requests to `https://api.anthropic.com/v1/messages` directly. It calls `/api/anthropic/messages` on the same origin, and Vite proxies that to the local API server during development.

## Setup

1. Create a `.env` file in the project root.
2. Copy the values from `.env.example`.
3. Set `ANTHROPIC_API_KEY` to your real Anthropic API key.

Example:

```env
ANTHROPIC_API_KEY=your_real_key_here
ANTHROPIC_MODEL=claude-sonnet-4-6
ANTHROPIC_VERSION=2023-06-01
API_PORT=8787
```

## Run

Start the API server:

```bash
npm run api
```

Start the Vite app in a second terminal:

```bash
npm run dev
```

## Request Flow

- Frontend: `src/lib.js`
- Dev proxy: `vite.config.js`
- Backend API: `server/api.js`

The backend sends the required Anthropic headers:

- `x-api-key`
- `anthropic-version`

That keeps the API key out of browser code and removes the CORS failure in local development.
