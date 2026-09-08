# Architecture: Magda

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   CURRENT STATE (v1 - Development)                      │
└─────────────────────────────────────────────────────────────────────────┘

Developer Machine
    │
    ├─ Local TanStack Start (bun run dev)
    │  ├─ React 19 + TypeScript
    │  ├─ TanStack Router (client-side routing)
    │  ├─ Tailwind CSS (utility-first styles)
    │  └─ public/site.css (custom design tokens)
    │
    ├─ HTML Injection (src/routes/-site-content.ts)
    │  └─ Sections: hero, work, testimonials, about, contact
    │  └─ DOM Imperatives (scroll triggers, animations)
    │  └─ Contact form (name, email, message) — NOT YET wired to /api/leads
    │
    └─ Supabase Client (JWT auth, via preview environment)
        └─ ANON_KEY (public anonymous key)

                    │ HTTPS
                    ▼

    Supabase Cloud (Development/Preview)
    ├─ Authentication (JWT issued)
    ├─ PostgreSQL Database
    │  ├─ public.leads (DEPLOYED, RLS enabled, no public policies)
    │  ├─ public.llm_usage (DEPLOYED, RLS enabled, no public policies)
    │  ├─ auth.users (managed by Supabase Auth)
    │  └─ RLS policies (row-level security)
    └─ Storage (optional, for image hosting)

NOTE: /api/leads and /api/chat endpoints do NOT exist yet (Phase 2 task)
NOTE: Render Web Service is NOT YET configured or deployed


┌─────────────────────────────────────────────────────────────────────────┐
│         TARGET STATE (v1 Production - After Phase 2 Implementation)     │
│            (When server routes are built and deployed to Render)        │
└─────────────────────────────────────────────────────────────────────────┘

User Device (Browser)
    │
    ├─ TanStack Start (SSR/Hydration, via Render)
    │  ├─ React 19 + TypeScript
    │  ├─ Marketing pages (Hero, work, about)
    │  ├─ Chat UI component (React)
    │  └─ Forms (contact, lead submission)
    │
    └─ Client-side routing (TanStack Router)

                    │ HTTPS
                    ▼

    Render Web Service (ONE Service, Node.js Runtime)
    ├─ TanStack Start Runtime (Nitro runtime)
    │  ├─ SSR + Hydration
    │  ├─ Server Routes (src/routes/api/*, to be implemented in Phase 2)
    │  │  ├─ POST /api/leads (validation → Supabase via service role)
    │  │  ├─ POST /api/chat (OpenRouter → llm_usage logging)
    │  │  └─ GET /api/metrics (observability data)
    │  │
    │  ├─ Services (business logic, to be implemented in Phase 2)
    │  │  ├─ ChatService (message handling, context)
    │  │  ├─ LeadService (validation, persistence)
    │  │  └─ MetricsService (observability)
    │  │
    │  └─ Providers (infrastructure, to be implemented in Phase 2)
    │     ├─ SupabaseProvider (admin client, service role)
    │     ├─ OpenRouterProvider (LLM API calls)
    │     └─ MetricsProvider (logging)
    │
    └─ Environment Secrets (Render Dashboard, server-only):
       ├─ OPENROUTER_API_KEY
       └─ SUPABASE_SERVICE_ROLE_KEY

                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼

    Supabase      OpenRouter    Future
    (data)        (AI)          (email, etc.)
    │             │             │
    ├─ leads      ├─ Chat       └─ Resend
    ├─ llm_usage  └─ Response      (optional)
    ├─ metrics
    └─ auth.users

NOTE: This diagram shows the TARGET architecture.
Current development state uses local TanStack Start (bun run dev).
```

## Component Layers

### Layer 1: Frontend (Lovable Cloud)

**Technologies**:

- TanStack Start 1.168.32
- React 19.2.0
- TypeScript 5.8.3
- Tailwind CSS 4.2.1
- Vite 8.1.5
- Bun (package manager)

**Owner**: Lovable Cloud (visual-first)

**Responsibilities**:

- Page layout and structure
- Responsive design
- Animations (scroll reveal, hover states, parallax)
- Asset management
- Accessibility (keyboard nav, ARIA, color contrast)

**Key Files**:

- `src/routes/index.tsx` — Main page component
- `src/routes/-site-content.ts` — HTML content, sections
- `public/site.css` — Design tokens (colors, fonts, spacing)
- `src/routes/__root.tsx` — Root layout (auth provider)

**Constraints**:

- No API calls in client code (move to server functions)
- No environment secrets in client (use server functions)
- No GraphQL or complex state management
- Keep animations performant (60fps target)

### Layer 2: Server Routes & Business Logic (TanStack Start + TypeScript)

**Technologies**:

- TanStack Start server routes (`src/routes/api/*`)
- Nitro runtime (Cloudflare Workers, Node.js compatible)
- CSRF middleware (built-in)
- Supabase Auth middleware
- TypeScript for type safety

**Owner**: Claude Code

**Responsibilities**:

- API route handlers (`/api/leads`, `/api/chat`, `/api/metrics`)
- Request validation (Zod, custom validators)
- CSRF protection
- Business logic orchestration (Services)
- Infrastructure integration (Providers)
- Secrets management (server-side only)
- Logging and observability

**Key Files**:

- `src/start.ts` — Server middleware setup
- `src/integrations/supabase/auth-middleware.ts` — JWT extraction
- `src/integrations/supabase/client.server.ts` — DB operations
- `src/integrations/supabase/auth-attacher.ts` — Auth provider

**Constraints**:

- Keep routes light; complex business logic belongs in Services layer
- Use server routes for API operations, Services for domain logic
- Never expose service role key in responses

### Layer 3: Data (Supabase PostgreSQL)

**Technologies**:

- Supabase Cloud (managed PostgreSQL)
- Row-Level Security (RLS) policies
- JWT authentication

**Owner**: Claude Code + Lovable Cloud (generated schema)

**Responsibilities**:

- User authentication (via Supabase Auth)
- Lead data storage
- Access control (RLS)

**Key Tables**:

- `auth.users` — Supabase-managed user records
- `leads` — Contact form submissions (future: create or query existing)
- `llm_usage` — Token counts for OpenRouter calls (future)
- `metrics` — Analytics without PII (future)

**Constraints**:

- RLS must protect user data; anonymous access only to public endpoints
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- All migrations versioned in Git (future)

## Technical Decisions

### Why TanStack Start?

- **Full-stack React**: Single language (TypeScript)
- **Server functions**: No separate API layer complexity
- **Type safety**: Generated routes, shared types
- **Developer experience**: Fast feedback loop with Vite
- **Scalable**: Nitro runtime supports Node.js and Cloudflare Workers

### Why Supabase (not Firebase)?

- **PostgreSQL**: Relational data, complex queries
- **RLS**: Row-level security native to database
- **Open source**: Can self-host if needed
- **Cost**: Generous free tier for lead gen sites
- **Integrations**: Works with any backend (TanStack Start, Node, Python, etc.)

### Why TanStack Start (Full-Stack)?

- **Single Language**: TypeScript across frontend + backend
- **Type Safety**: End-to-end type safety with shared types
- **Server Routes**: No inter-service communication overhead
- **Developer Experience**: Unified project structure, Vite feedback loop
- **Deployment**: One Render service, simpler operations
- **Future Flexibility**: Can add separate backend later if scale/complexity justifies it (see RCKT Principle in Change Policy)

### Why OpenRouter (not native LLM)?

- **Cost**: Pay-per-token, no vendor lock-in
- **Flexibility**: Switch models without code changes
- **Fallbacks**: Automatic failover if primary provider is down
- **No fine-tuning needed**: Off-the-shelf models sufficient for chat

## Deployment Topology

### Current (v1 - Development)

```
GitHub (repo)
    ↓
Local Development Machine
    ├─ TanStack Start dev server (bun run dev)
    ├─ Nitro preset: Currently auto-detected
    └─ Connected to Lovable Cloud + Supabase (preview env)

Status:
- Render NOT YET configured or deployed
- /api/leads, /api/chat endpoints: NOT YET implemented
```

### Planned (v1 - Production Deployment)

```
GitHub (repo)
    ↓
Render Web Service (ONE service for full-stack)
    ├─ Build: bun install && bun run build
    ├─ Start: [TBD - depends on Nitro preset configuration]
    ├─ Nitro Preset: Must verify and configure before deployment
    ├─ Framework: TanStack Start (Node.js runtime)
    │  ├─ Install deps (bun install)
    │  ├─ Build (bun run build)
    │  ├─ Output artifact: dist/ (server + static)
    │  └─ Start command: TBD (depends on preset)
    │
    ├─ Environment Variables:
    │  ├─ Public: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
    │  └─ Private: OPENROUTER_API_KEY, SUPABASE_SERVICE_ROLE_KEY
    │
    └─ Health checks: / (HTTP 200)

IMPORTANT: Before deploying to Render:
1. Verify current Nitro preset (bun run build → inspect build output)
2. Select appropriate Nitro preset for Render/Node.js
3. Test build and start command locally
4. Define final start command based on preset configuration
```

### Future (v2+, With Backend Features)

```
GitHub (repo)
    ↓
Render (Single Web Service)
    ├─ Build: bun install && bun run build
    ├─ Start: bun run preview
    ├─ Framework: TanStack Start (Node.js runtime)
    ├─ Public Env: VITE_SUPABASE_*
    ├─ Private Env: OPENROUTER_API_KEY, SUPABASE_SERVICE_ROLE_KEY
    └─ Health: / (returns 200)
        ├─ Server Routes: /api/leads, /api/chat, /api/metrics
        ├─ Services: LeadService, ChatService, MetricsService
        └─ Providers: SupabaseProvider, OpenRouterProvider
            ├─ Supabase (data)
            ├─ OpenRouter (AI)
            └─ Resend (future email)

Note: No inter-service communication; all in-process.
```

## Scaling Considerations

| Scenario            | Action                                     |
| ------------------- | ------------------------------------------ |
| High lead volume    | Add rate limiting on `/api/leads` endpoint |
| Chat feature needed | Add `/api/chat` server route               |
| Database grows      | Implement connection pooling (PgBouncer)   |
| API rate limits hit | Implement queue + retry logic              |
| At scale (10M rows) | Separate backend only if justified (RCKT)  |

## Dependencies and Versions

**Core**:

- React 19.2.0
- TypeScript 5.8.3
- TanStack Start 1.168.32
- Tailwind CSS 4.2.1
- Vite 8.1.5

**UI Components** (Radix UI, shadcn/ui-inspired):

- @radix-ui/* (form, dialog, etc.)
- lucide-react (icons)
- clsx, tailwind-merge (styling utilities)

**Data**:

- @supabase/supabase-js 2.115.0
- zod (schema validation)

**Forms**:

- react-hook-form
- @hookform/resolvers

**State & Queries**:

- @tanstack/react-query (data fetching)

**Linting**:

- ESLint 9.32.0
- Prettier 3.7.3

## No-No's (Architectural Anti-Patterns)

- ❌ **RAG without need**: No vector databases or semantic search
- ❌ **LangChain/LangGraph**: Use OpenRouter SDK directly
- ❌ **Redis for this scale**: In-memory session is fine
- ❌ **Kafka/queues**: Not needed yet; direct API calls sufficient
- ❌ **Microservices sprawl**: Monolith until proven otherwise
- ❌ **GraphQL**: REST + type safety via TypeScript sufficient
- ❌ **ORM bloat**: Direct SQL for complex queries (future)

---

**Architecture Version**: 1.0 (Current: v1, Foundation Phase)  
**Last Updated**: 2026-09-08  
**Architecture Decision**: Full-stack TanStack Start (see RCKT Principle in 07-change-policy.md)  
**Next Review**: When considering backend separation (justified by scale/complexity)
