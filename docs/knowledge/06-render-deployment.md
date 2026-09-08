# Render Deployment

## Overview

Magda will be deployed on Render, a modern deployment platform that integrates directly with GitHub. This document describes the target deployment architecture.

**Current Status**:

- ✅ TanStack Start + React 19 (local development via `bun run dev`)
- ✅ Supabase PostgreSQL (public.leads, public.llm_usage deployed)
- ❌ Render Web Service: NOT YET configured or deployed
- ❌ Server routes (/api/leads, /api/chat): NOT YET implemented (Phase 2 task)

**Planned Setup** (v1 - Target for Production):

- **Service**: TanStack Start (full-stack: frontend + server routes)
- **Repository**: rckt-workspace/pagina-magda-3
- **Branch**: `main`
- **URL**: To be configured (Render preview + custom domain TBD)
- **Status**: Ready when Phase 2 server routes are completed

**Future Setup** (v2):

- **Service**: Single Render Web Service (TanStack Start)
- **Additional**: Optional job scheduler (async tasks, future)
- **Note**: Backend logic lives in server routes (`src/routes/api/*`), not separate microservice

## Planned Deployment Configuration (v1)

### Service Configuration

**Name**: `magda-3`  
**Type**: Full-stack TanStack Start (Node.js runtime, not just frontend)  
**Runtime**: Node.js 18.x (or later, as specified by Nitro preset)  
**Region**: US East (N. Virginia)  
**Auto-deploy**: On push to `main`

### Build and Start Commands (TBD - Nitro Preset Dependent)

**Current Configuration (LOCAL - bun run dev)**:

```
Local Dev: bun run dev
Nitro Preset: Currently auto-detected
```

**Render Deployment (NOT YET CONFIGURED)**:

Before deploying to Render, you MUST:

1. **Verify current Nitro preset**:

   ```bash
   # After building locally:
   bun run build
   cat dist/package.json  # or inspect build output
   ```

2. **Select appropriate Nitro preset for Node.js/Render**:
   - Options: `node-server`, `node-cluster`, `bun`, etc.
   - Check: https://nitro.unjs.io/deploy/providers

3. **Test locally**:

   ```bash
   bun run build
   [Run the generated start command locally to verify]
   ```

4. **Configure Render with verified commands**:
   ```
   Build Command: bun install && bun run build
   Start Command: [TBD - depends on Nitro preset output]
   ```

**Explanation**:

- `bun install` — Install dependencies (package.json + bun.lock)
- `bun run build` — Build with Vite + compile TypeScript + Nitro runtime
- Start command: **TBD** (e.g., `node .output/server/index.mjs`, `bun .output/server/index.mjs`, or `node_modules/.bin/nitro`, depending on preset)

### Environment Variables

**Public** (safe to expose):

```
VITE_SUPABASE_URL=https://abc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Private** (Render dashboard only, when Phase 2 server routes are ready):

```
# Current (v1): None in Render (Render not yet configured)
# Phase 2 (when implemented):
#   - OPENROUTER_API_KEY (for /api/chat)
#   - SUPABASE_SERVICE_ROLE_KEY (for /api/leads)
# Both stay server-side in TanStack routes, never exposed to client
```

### Health Check (Future - When Deployed)

**Endpoint**: `https://magda-3.onrender.com/`  
**Frequency**: Every 30 seconds  
**Timeout**: 30 seconds  
**Expected**: HTTP 200  
**Status**: TBD (not yet configured)

## Deployment Process (Future - When Render is Configured)

### Deploy on Push to Main (Target Workflow - When Render is Ready)

**Current Status**: This workflow is NOT YET ACTIVE. Render is not configured. Use local development (`bun run dev`) until Phase 2 is complete.

1. **Push to GitHub** (future, when ready to deploy)

   ```bash
   git push origin main
   ```

2. **Render Webhook Triggered** (future)
   - GitHub sends webhook to Render
   - Render clones repository

3. **Build Phase** (future)

   ```
   # Install dependencies
   $ bun install

   # Run checks
   $ bun run lint      # ESLint
   $ bun x tsc --noEmit  # TypeScript

   # Build TanStack Start with Nitro
   $ bun run build
   # Output: .output/ folder (Nitro server runtime) + dist/ (static assets)
   ```

4. **Start Phase** (future - Command TBD)

   ```
   # Start command TBD based on Nitro preset
   # Examples:
   # $ node .output/server/index.mjs
   # $ bun .output/server/index.mjs
   # TanStack Start server listening on port specified by Render
   ```

5. **Health Check** (future)
   - Render hits `/` endpoint
   - Waits for 200 response
   - Marks deployment as "Live"

6. **DNS Switch** (future)
   - Render updates DNS (if configured)
   - Site is live

### Rollback (Future - When Deployed)

When Render is deployed, if deployment fails:

1. Render keeps previous successful build
2. Traffic automatically redirects to previous version
3. No manual action needed

To rollback manually:

1. Push a revert commit to `main`:
   ```bash
   git revert HEAD
   git push origin main
   ```
2. Render re-deploys automatically

**Current Status**: Rollback procedures apply only after Render is configured.

## Custom Domain (Future - When Ready)

**Target**: https://magda.rckt.es (or similar custom domain)  
**Render Default**: https://magda-3.onrender.com (will be assigned when service is created)

**To Set Up Custom Domain** (future, when Render service is created):

1. Create Render service first (when Phase 2 is complete)
2. Go to Render Dashboard → Service → Settings
3. Custom Domain → Add Custom Domain
4. Enter: `magda.rckt.es`
5. Update DNS at domain registrar:
   - Type: CNAME
   - Name: `magda` (or `www`)
   - Value: `[render-assigned-url].onrender.com`
6. Wait for DNS propagation (15 min - 48 hours)

**Current Status**: Custom domain configuration is TBD (Render service not yet created)

## Monitoring and Logs (Future - When Render is Deployed)

### Real-time Logs (Target Procedure)

**Render Dashboard** (when service is active):

- Click service name
- View "Logs" tab
- Last 1000 lines available
- Auto-tail enabled (optional)

**Current Status**: Not applicable (Render not yet configured)

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

### For Future Server Routes (TanStack Start)

When backend features are added (chat, advanced leads handling), these private variables will be added to the same service:

| Variable                    | Value       | Source               | Public? |
| --------------------------- | ----------- | -------------------- | ------- |
| `OPENROUTER_API_KEY`        | `sk_or_...` | OpenRouter Dashboard | ❌ No   |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...`    | Supabase Dashboard   | ❌ No   |

**Note**: All server-side logic runs in the same TanStack Start service, not a separate backend.

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

## Deployment Strategy (Future v2+)

### Single Service, Full-Stack Architecture

All logic (frontend + server routes + business services) runs in ONE Render Web Service:

```
Render Dashboard
└─ Service: magda-fullstack
   ├─ Build: bun install && bun run build
   ├─ Start: bun run preview
   ├─ Framework: TanStack Start (Node.js runtime)
   │
   ├─ Public Env: VITE_SUPABASE_*
   │
   └─ Private Env: OPENROUTER_API_KEY, SUPABASE_SERVICE_ROLE_KEY
      ├─ Used by src/routes/api/leads.ts
      ├─ Used by src/routes/api/chat.ts
      └─ Used by src/routes/api/metrics.ts
```

**RCKT Principle**: Full-stack by default for light projects. Backend separation (microservices) only if complexity explicitly justifies it.

### Adding Backend Features (Phase 2+)

When new features require server-side logic (chat, advanced leads processing):

1. **Add server route locally** (`src/routes/api/chat.ts`)
   - Test locally with `bun run dev`

2. **Create service layer** (`src/services/ChatService.ts`)
   - Test with unit tests

3. **Create provider** (`src/providers/OpenRouterProvider.ts`)
   - Test integration

4. **Push to feature branch**

   ```bash
   git commit -m "feat: add /api/chat server route"
   git push origin feature/chat-integration
   # Create PR, review, merge to main
   ```

5. **Render re-deploys same service** (when Render is configured)
   - No new service needed
   - Same build/start commands apply
   - All logic stays in-process (no inter-service communication)

Example: Chat feature rollout

```typescript
// src/routes/api/chat.ts (new in same service)
export async function POST({ request }) {
  const { message } = await request.json();
  const chatService = new ChatService(supabaseProvider, openrouterProvider);
  return chatService.handleMessage(message);
}
```

**Development Workflow**: Test locally → PR → Merge → Render auto-deploys (when configured)  
**No inter-service communication**: All logic stays in-process in single TanStack Start service

## Disaster Recovery (Future - When Production Deployed)

### Backup Plan (Target Procedures)

**If Render is down** (when deployed):

1. Site is unavailable (no failover configured)
2. Check Render status: https://status.render.com
3. Wait for Render to restore (typically < 1 hour)

**If database is corrupted**:

1. Restore from Supabase backup (see Data Contract)
2. Redeploy from main (no code changes needed)

**If secrets are exposed**:

1. Immediately revoke in provider dashboard (OpenRouter, Supabase)
2. Rotate to new secrets
3. Update Render Dashboard environment variables
4. Trigger re-deploy by pushing empty commit: `git commit --allow-empty -m "chore: rotate secrets"`

### Monitoring for Disasters (Target State)

- **Uptime monitoring**: (future) Add Uptime Robot or similar
- **Error tracking**: (future) Add Sentry for JavaScript errors
- **Performance tracking**: (future) Add Datadog or New Relic

**Current Status**: Disaster recovery procedures apply only after Render is in production

## Cost Estimation (2026)

### Current (v1 - Development, NOT Yet in Render)

| Component             | Tier           | Cost/Month        |
| --------------------- | -------------- | ----------------- |
| Render Web Service    | Not yet active | $0                |
| Supabase (PostgreSQL) | Free (preview) | $0                |
| OpenRouter (AI)       | Not yet used   | $0                |
| **Total**             | —              | **$0 (dev only)** |

**Note**: Using local development (`bun run dev`) and Supabase preview environment. Render deployment TBD.

### Target (v1 - Production, When Deployed)

| Component                | Tier     | Cost/Month        |
| ------------------------ | -------- | ----------------- |
| Render Web Service       | Standard | $10/month         |
| Supabase (PostgreSQL)    | Free/Pro | $0–50/month       |
| OpenRouter (AI, Phase 2) | Usage    | $0–100/month      |
| **Total**                | —        | **$10–160/month** |

### Future (v2+, With Advanced Features)

| Component               | Tier        | Cost/Month          |
| ----------------------- | ----------- | ------------------- |
| TanStack Start (single) | Standard    | $10/month           |
| Supabase                | Pro         | $25/month           |
| OpenRouter (AI, chat)   | Usage-based | $10–100/month (TBD) |
| **Total**               | —           | **$45–235/month**   |

**Note**: Still ONE Render service (no multi-service overhead). Costs scale with traffic/usage. Start with free/standard; upgrade as needed.

## Performance Optimization

### Frontend Optimization

- **Lazy load images** (Intersection Observer)
- **Defer non-critical CSS** (media queries)
- **Minimize JavaScript** (tree-shaking via Vite)
- **Use WebP for images** (with JPEG fallback)
- **Cache static assets** (Render handles this)

### Server Route Optimization (Future, when APIs added)

- **Connection pooling** (via Supabase)
- **Response caching** (server-side with headers)
- **Rate limiting** (middleware on server routes)
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
- [ ] Rate limiting enabled (when server routes added)
- [ ] Database RLS policies tested
- [ ] Error messages don't leak PII
- [ ] Environment variables are private (not in public env list)
- [ ] Health checks working
- [ ] Monitoring configured (future)

---

**Render Deployment Version**: 1.0  
**Current Status**: Development (v1, Render NOT YET deployed)

- TanStack Start: ✅ Local development (`bun run dev`)
- Supabase: ✅ Deployed (public.leads, public.llm_usage)
- Render Web Service: ❌ Not configured or deployed
- Server routes (/api/leads, /api/chat): ❌ Not implemented (Phase 2)

**Target Status** (When Ready): v1 Production (ONE Render Web Service, full-stack TanStack Start)  
**Last Updated**: 2026-09-08 (Factual correction: Render not yet active)  
**Architecture**: ONE Render Web Service (full-stack TanStack Start) — target design, not yet active
**Next Steps**:

1. Complete Phase 2 (implement server routes)
2. Verify Nitro preset configuration
3. Set up Render service with verified build/start commands
4. Test deployment to Render staging
5. Deploy to production
