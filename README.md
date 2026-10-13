# order-sync
GET /result (also /) -> {clients, stats}. Fetches SOURCE_URL (default https://test.ooobs.ru/api/orders) on each request, normalizes phones to +7XXXXXXXXXX, drops invalid, dedups by phone (max amount, tie -> latest created_at). Stateless => idempotent. No secrets used.
Run: `node server.js` (PORT env). Deploy: Render/Railway (start: node server.js) or Vercel (api/result.js + vercel.json).
