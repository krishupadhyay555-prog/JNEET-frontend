# JNEET+ AI — launch checklist (Tuesday, Free tier only)

Do these in order. Never paste keys into chat or commit them — only into Render / Vercel dashboards.

## A. Merge the code
1. Open the PR for `launch-prep` → check the GitHub Actions run is green → merge to `main`.
2. Render and Vercel redeploy automatically.

## B. Render (backend) → Environment
| Variable | Value |
|---|---|
| `OPENAI_API_KEY` | your key (new key, spend limit set in OpenAI dashboard) |
| `BREVO_API_KEY` | Brevo → SMTP & API → API keys |
| `EMAIL_FROM` | a **verified** sender, e.g. `no-reply@jneetai.com` |
| `FRONTEND_URL` | `https://jneetai.com` (comma-separate extra origins, e.g. the www one) |
| `AI_DAILY_BUDGET_INR` | e.g. `500` (daily spend cap; AI pauses above it) |
| `COOKIE_SAMESITE` | `lax` **only after** step D (api.jneetai.com). Before that leave unset |

Keep existing `MONGO_URI`, `JWT_SECRET`, `COOKIE_SECRET`. Remove `GEMINI_API_KEY` (unused).

## C. Brevo (why OTP mail wasn't arriving)
1. Senders & IP → Domains → add `jneetai.com` → add the DKIM + SPF records Brevo shows at your DNS → "Authenticate".
2. Add the sender address from `EMAIL_FROM`.
3. After a test signup check Brevo → Transactional → Logs (delivered / blocked / bounced).

## D. API domain (cookies work better, Safari/Chrome blockers)
1. Render → backend service → Custom Domains → add `api.jneetai.com` → create the DNS record Render shows.
2. Vercel → frontend env `VITE_API_BASE_URL=https://api.jneetai.com/api` → redeploy.
3. Then set `COOKIE_SAMESITE=lax` on Render.

## D2. Captcha (Cloudflare Turnstile, free)
1. https://dash.cloudflare.com → Turnstile → Add widget → hostnames: `jneetai.com`, `www.jneetai.com`, your `*.vercel.app` URL → mode **Managed** → copy **Site key** and **Secret key**.
2. Vercel → frontend → Environment Variables → `VITE_TURNSTILE_SITE_KEY` = site key → redeploy.
3. Render → `TURNSTILE_SECRET_KEY` = secret key (leave unset to keep the captcha off).
4. Works on register, login, forgot-password, login-by-code and every resend; each request uses a fresh token. If Cloudflare is down the app lets students through.

## E. OpenAI models
1. Check exact model IDs your account can use (OpenAI dashboard → Models, or `GET /v1/models`).
2. If they differ from `gpt-6-luna` / `gpt-6.1-sol`, set `AI_MODEL_FREE`, `AI_MODEL_FALLBACK`, etc. on Render.
3. Locally: `cd backend && OPENAI_API_KEY=... node scripts/ai-eval.mjs` and read the 6 answers (hint-first, Hinglish, distress, off-topic). Tell me anything that feels off.

## F. Legal details
Edit `frontend/src/legal/content.js` → `BUSINESS` (operator name, address if any, support email, grievance officer). Run `npm run legal` in `frontend` (or just build) and commit. Have a lawyer read Privacy / Terms / Refund once.

## G. Production safety
- MongoDB Atlas: turn on backups (M0 has none → consider M10 or a weekly `mongodump`).
- Render: free tier sleeps → upgrade to a paid instance before launch day (first request after sleep is slow, OTP mail feels "late").
- UptimeRobot (free) pinging `https://api.jneetai.com/health` every 5 min.
- Sentry (free tier) for frontend + backend errors.
- Check git history never contained a real `.env` (`git log --all -- '*.env'`); if it did, rotate those keys.

## H. Smoke test on production (10 minutes)
Register (adult) → code arrives → verify → ask 1 doubt → logout → "email me a login code" → forgot password → register a 15-year-old with a parent email → parent link works → AI unlocks → delete test accounts.

## Not in this release (by decision)
Razorpay / Pro / Elite (landing shows "Coming soon"), Google login, photo/PDF doubts, voice.
