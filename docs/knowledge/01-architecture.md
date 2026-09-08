# Architecture: Magda

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CURRENT STATE (v1)                               │
└─────────────────────────────────────────────────────────────────────────┘

User Device (Browser)
    │
    ├─ TanStack Start (SSR/Hydration)
    │  ├─ React 19 + TypeScript
    │  ├─ TanStack Router (client-side routing)
    │  ├─ Tailwind CSS (utility-first styles)
    │  └─ public/site.css (custom design tokens)
    │
    ├─ HTML Injection (src/routes/-site-content.ts)
    │  └─ Sections: hero, work, testimonials, about, contact
    │  └─ DOM Imperatives (scroll triggers, animations)
    │  └─ Contact form (name, email, message)
    │
    └─ Supabase Client (JWT auth)
        └─ ANON_KEY (public anonymous key)

                    │ HTTPS
                    ▼

    Render Edge (Frontend Deployment)
    ├─ TanStack Start SSR Runtime
    ├─ Static Assets (CSS, JS, images)
    └─ API Routes (server functions)
        └─ Middleware: CSRF protection
        └─ Auth: Supabase JWT extraction
        └─ Handlers: Form submission, etc.

                    │ HTTPS
                    ▼

    Supabase Cloud
    ├─ Authentication (JWT issued)
    ├─ PostgreSQL Database
    │  ├─ leads table (name, email, message, status)
    │  ├─ auth.users (managed by Supabase Auth)
    │  └─ RLS policies (row-level security)
    ├─ Storage (optional, for image hosting)
    └─ Real-time subscriptions (optional)


┌─────────────────────────────────────────────────────────────────────────┐
│                        FUTURE STATE (v2+)                               │
└─────────────────────────────────────────────────────────────────────────┘

User Device (Browser)
    │
    ├─ TanStack Start (SSR/Hydration, UNCHANGED)
    │  └─ Same as v1
    │
    └─ Chat UI Component (React)
        └─ Sends messages to backend

                    │ HTTPS
                    ▼

    Render Compute (New Layer)
    ├─ FastAPI Backend (Python)
    │  ├─ Agent Service
    │  │  ├─ OpenRouter API client
    │  │  └─ Agent prompt/persona
    │  ├─ Endpoints:
    │  │  ├─ POST /api/chat (message → response)
    │  │  ├─ POST /api/leads (contact form)
    │  │  └─ GET /api/metrics (usage stats)
    │  └─ Middleware: Auth, logging, rate limits
    │
    ├─ Session Store (Redis or in-memory, future)
    └─ Logging (stdout or DataDog, future)

                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼

    Supabase      OpenRouter    External
    (data)        (AI)          (email, etc.)
    │             │             │
    ├─ leads      ├─ Chat       └─ Resend
    ├─ users      └─ Response      (future)
    └─ metrics
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

### Layer 2: API / Middleware (TanStack Start Server Functions)

**Technologies**:

- TanStack Start server-side rendering
- Nitro runtime (Cloudflare Workers, Node.js)
- CSRF middleware
- Supabase Auth middleware

**Owner**: Claude Code

**Responsibilities**:

- Route handlers (form submission, etc.)
- Request validation
- CSRF protection
- JWT token extraction and verification
- Database queries via Supabase client

**Key Files**:

- `src/start.ts` — Server middleware setup
- `src/integrations/supabase/auth-middleware.ts` — JWT extraction
- `src/integrations/supabase/client.server.ts` — DB operations
- `src/integrations/supabase/auth-attacher.ts` — Auth provider

**Constraints**:

- Keep logic light; complex business logic belongs in FastAPI (future)
- Use server functions for isolated operations
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
- **Integrations**: Works with any backend (FastAPI, Node, etc.)

### Why FastAPI (future)?

- **Python**: Data science / AI is Python-first
- **OpenRouter**: Python client library is mature
- **Type hints**: Pydantic for schema validation
- **Async**: High concurrency for chat workloads
- **Separation**: API microservice (on Render) decoupled from frontend

### Why OpenRouter (not native LLM)?

- **Cost**: Pay-per-token, no vendor lock-in
- **Flexibility**: Switch models without code changes
- **Fallbacks**: Automatic failover if primary provider is down
- **No fine-tuning needed**: Off-the-shelf models sufficient for chat

## Deployment Topology

### Current (v1)

```
GitHub (repo)
    ↓
Render (frontend builder + hosting)
    ├─ Install deps (bun install)
    ├─ Build (bun run build)
    ├─ Serve (TanStack Start runtime)
    └─ Health checks (/api/health)

Environment Variables:
- SUPABASE_URL (public)
- SUPABASE_ANON_KEY (public)
```

### Future (v2)

```
GitHub (repo)
    ↓
Render (multi-service)
    ├─ Service 1: Frontend
    │  └─ Same as v1
    ├─ Service 2: FastAPI
    │  ├─ Build: python:3.11
    │  ├─ Start: gunicorn app:app
    │  ├─ Env: OPENROUTER_API_KEY, DATABASE_URL
    │  └─ Health: /health
    └─ Networking:
        └─ Frontend → FastAPI (internal Render network)
        └─ FastAPI → Supabase (HTTPS, encrypted)
        └─ FastAPI → OpenRouter (HTTPS)
```

## Scaling Considerations

| Scenario            | Action                                      |
| ------------------- | ------------------------------------------- |
| High lead volume    | Add rate limiting on form endpoint          |
| Chat feature needed | Deploy FastAPI independently                |
| Database grows      | Implement connection pooling (PgBouncer)    |
| API rate limits hit | Implement queue + retry logic               |
| Analytics needed    | Add event table + aggregation jobs (future) |

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
**Last Updated**: 2026-09-07  
**Next Review**: Before FastAPI integration (Phase 3)
