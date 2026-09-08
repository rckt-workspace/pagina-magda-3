# Render Deployment

## Overview

Magda is deployed on Render, a modern deployment platform that integrates directly with GitHub.

**Current Setup** (v1):

- **Service**: Static site (TanStack Start frontend)
- **Repository**: rckt-workspace/pagina-magda-3
- **Branch**: `main`
- **URL**: https://magda-3.onrender.com (custom domain: TBD)

**Future Setup** (v2):

- **Service 1**: Frontend (unchanged)
- **Service 2**: FastAPI backend
- **Service 3**: Job scheduler (optional)

## Current Deployment (v1)

### Service Configuration

**Name**: `magda-3-frontend`  
**Type**: Static site + TanStack Start (Node.js runtime)  
**Runtime**: Node.js 18.x  
**Region**: US East (N. Virginia)  
**Auto-deploy**: On push to `main`

### Build Settings

```
Build Command: bun install && bun run build
Start Command: bun run preview
```

**Explanation**:

- `bun install` — Install dependencies (package.json + bun.lock)
- `bun run build` — Build frontend (Vite) and run TypeScript check
- `bun run preview` — Serve built site

### Environment Variables

**Public** (safe to expose):

```
VITE_SUPABASE_URL=https://abc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Private** (Render dashboard only):

```
# None needed for v1 (frontend only)
```

### Health Check

**Endpoint**: `https://magda-3.onrender.com/`  
**Frequency**: Every 30 seconds  
**Timeout**: 30 seconds  
**Expected**: HTTP 200

## Deployment Process

### Deploy on Push to Main

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Render Webhook Triggered**
   - GitHub sends webhook to Render
   - Render clones repository

3. **Build Phase**

   ```
   # Install dependencies
   $ bun install

   # Run checks
   $ bun run lint      # ESLint
   $ bun x tsc --noEmit  # TypeScript

   # Build
   $ bun run build

   # Output: dist/ folder (static + server runtime)
   ```

4. **Start Phase**

   ```
   $ bun run preview
   # TanStack Start server listening on port 3000
   ```

5. **Health Check**
   - Render hits `/` endpoint
   - Waits for 200 response
   - Marks deployment as "Live"

6. **DNS Switch**
   - Render updates DNS (if configured)
   - Site is live

### Rollback

If deployment fails:

1. Render keeps previous successful build
2. Traffic automatically redirects to previous version
3. No manual action needed

If you need to rollback:

1. Push a revert commit to `main`:
   ```bash
   git revert HEAD
   git push origin main
   ```
2. Render re-deploys automatically

## Custom Domain

**Current**: https://magda-3.onrender.com  
**Desired**: https://magda.rckt.es (or similar)

**To Set Up**:

1. Go to Render Dashboard → Service → Settings
2. Custom Domain → Add Custom Domain
3. Update DNS at domain registrar:
   - Type: CNAME
   - Name: `magda` (or `www`)
   - Value: `magda-3.onrender.com`
4. Wait for DNS propagation (15 min - 48 hours)

## Monitoring and Logs

### Real-time Logs

**Render Dashboard**:

- Click service name
- View "Logs" tab
- Last 1000 lines available
- Auto-tail enabled (optional)

### Common Issues

| Issue            | Symptom                         | Fix                                                    |
| ---------------- | ------------------------------- | ------------------------------------------------------ |
| Build fails      | "Build exited with code 1"      | Check error in logs; fix code; push new commit         |
| Type errors      | "TypeScript compilation failed" | Run `bun x tsc --noEmit` locally; fix; push            |
| Lint errors      | "ESLint found errors"           | Run `bun run lint --fix` locally; push                 |
| Missing env vars | Logs show "undefined"           | Add to Render Dashboard → Environment                  |
| Out of memory    | Process crashes                 | Upgrade Render plan (currently v1 should not hit this) |

### Performance Monitoring

**Render Metrics**:

- Dashboard → Analytics
- CPU usage
- Memory usage
- Network in/out
- Request count
- Response times

**Target SLOs**:

- Uptime: Target 99%+ (internal operational goal, not contractual SLA)
- Response time (p95): Target < 2 seconds
- CPU: Monitor; alert if > 80%
- Memory: Monitor; alert if > 80%

If metrics exceed targets:

1. Review logs for errors
2. Optimize slow queries (Supabase)
3. Reduce asset sizes (images, CSS)
4. Upgrade Render plan if needed

## Environment Variables (Full List)

### For Frontend (TanStack Start)

| Variable                 | Value                     | Source             | Public? |
| ------------------------ | ------------------------- | ------------------ | ------- |
| `VITE_SUPABASE_URL`      | `https://abc.supabase.co` | Supabase Dashboard | ✅ Yes  |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...`                  | Supabase Dashboard | ✅ Yes  |
| `NODE_ENV`               | `production`              | Render (auto)      | ✅ Yes  |

### For Future FastAPI Backend

| Variable                    | Value              | Source               | Public? |
| --------------------------- | ------------------ | -------------------- | ------- |
| `OPENROUTER_API_KEY`        | `sk_or_...`        | OpenRouter Dashboard | ❌ No   |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...`           | Supabase Dashboard   | ❌ No   |
| `DATABASE_URL`              | `postgresql://...` | Supabase Conn String | ❌ No   |
| `PYTHONUNBUFFERED`          | `1`                | For logging          | N/A     |

## Secrets Rotation

### API Keys

**Schedule**: Quarterly (or after compromised)

**How to Rotate**:

1. Generate new key (in OpenRouter, Supabase, etc.)
2. Update in Render Dashboard
3. Deploy by pushing a dummy commit (`git commit --allow-empty -m "chore: rotate secrets"`)
4. Verify new key works in logs
5. Deactivate old key in provider dashboard

### Database Credentials

**If using Supabase**:

- Supabase auto-rotates credentials
- No manual action needed
- Notify team if emergency rotation needed

## Deployment Strategy (Future v2)

### Multi-Service Architecture

```
Render Dashboard
├─ Service: magda-frontend
│  ├─ Build: bun install && bun run build
│  ├─ Start: bun run preview
│  └─ Env: VITE_SUPABASE_* (public)
│
└─ Service: magda-backend
   ├─ Build: pip install -r requirements.txt
   ├─ Start: gunicorn -w 4 -b 0.0.0.0:8000 app:app
   └─ Env: OPENROUTER_API_KEY, DATABASE_URL (private)
```

### Inter-Service Communication

**Frontend → Backend**:

```typescript
// TanStack Start server function (server-side only)
const response = await fetch("https://magda-backend.onrender.com/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "..." }),
});
```

**No direct backend calls from client** (all via frontend middleware)

### Deploy Order

1. **Deploy backend first** (FastAPI)
   - Push to `feature/fastapi-backend`
   - Render builds and starts
   - Test endpoint manually

2. **Update frontend to call backend** (TanStack Start)
   - Push to `feature/integrate-backend`
   - TanStack Start now makes API calls to FastAPI
   - Test end-to-end

3. **Merge to main**
   - Full integration test
   - Production deployment

## Disaster Recovery

### Backup Plan

**If Render is down**:

1. Site is unavailable (no failover)
2. Check Render status: https://status.render.com
3. Wait for Render to restore (typically < 1 hour)

**If database is corrupted**:

1. Restore from Supabase backup (see Data Contract)
2. Redeploy frontend (no code changes needed)

**If secrets are exposed**:

1. Immediately revoke in provider dashboard
2. Rotate to new secrets
3. Update Render Dashboard
4. Re-deploy

### Monitoring for Disasters

- **Uptime monitoring**: (future) Add Uptime Robot or similar
- **Error tracking**: (future) Add Sentry for JavaScript errors
- **Performance tracking**: (future) Add Datadog or New Relic

## Cost Estimation (2026)

### Current (v1)

| Component                 | Tier     | Cost/Month       |
| ------------------------- | -------- | ---------------- |
| Frontend (TanStack Start) | Standard | $10/month        |
| Supabase (PostgreSQL)     | Free/Pro | $0–50/month      |
| **Total**                 | —        | **$10–60/month** |

### Future (v2)

| Component         | Tier        | Cost/Month          |
| ----------------- | ----------- | ------------------- |
| Frontend          | Standard    | $10/month           |
| Backend (FastAPI) | Standard    | $10/month           |
| Supabase          | Pro         | $25/month           |
| OpenRouter (AI)   | Usage-based | $10–100/month (TBD) |
| **Total**         | —           | **$55–245/month**   |

**Note**: Costs scale with traffic/usage. Start with free/standard; upgrade as needed.

## Performance Optimization

### Frontend Optimization

- **Lazy load images** (Intersection Observer)
- **Defer non-critical CSS** (media queries)
- **Minimize JavaScript** (tree-shaking via Vite)
- **Use WebP for images** (with JPEG fallback)
- **Cache static assets** (Render handles this)

### Backend Optimization (Future)

- **Connection pooling** (PgBouncer for Supabase)
- **Response caching** (Redis, optional)
- **Rate limiting** (to prevent abuse)
- **Query optimization** (indexes, N+1 fixes)

### Monitoring Performance

- Render → Analytics tab (CPU, memory, requests)
- Lighthouse audit (local): `bun run build && bun run preview`
- WebPageTest: https://www.webpagetest.org

## Security Checklist

Before deploying to production:

- [ ] No secrets in `.env.local` or code
- [ ] HTTPS enforced (Render default)
- [ ] CORS headers set correctly (if needed)
- [ ] CSRF protection enabled (TanStack Start middleware)
- [ ] Rate limiting enabled (future backend)
- [ ] Database RLS policies tested
- [ ] Error messages don't leak PII
- [ ] Environment variables are private (not in public env list)
- [ ] Health checks working
- [ ] Monitoring configured (future)

---

**Render Deployment Version**: 1.0  
**Current Status**: v1 (Frontend only)  
**Last Updated**: 2026-09-07  
**Deployment Frequency**: On-demand (push to main)  
**Average Deploy Time**: 2–3 minutes  
**Rollback Time**: < 1 minute
