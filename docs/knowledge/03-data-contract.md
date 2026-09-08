# Data Contract: Database and Privacy

## Data Ownership and Governance

**Supabase PostgreSQL is the source of truth for:**

- User authentication (Supabase Auth managed)
- Lead contacts (name, email, message)
- Usage metrics (LLM API calls, response times)
- Future: Analytics (page views, click tracking)

**Responsibility**:

- Claude Code: Database schema, migrations, RLS policies
- Lovable Cloud: Generated schema (do not modify)
- Both teams: Data privacy and security

## Current Tables (v1)

### `auth.users` (Supabase Managed)

Controlled by Supabase Authentication service. Do not modify.

**Fields**:

- `id` (UUID) — User identifier
- `email` (string) — Email address
- `email_confirmed_at` (timestamp) — Verification status
- `encrypted_password` (hashed) — Password hash
- `metadata` (JSON) — Custom user data

**Access**:

- Anonymous users: No direct access
- Authenticated users: Can read own record
- Service role: Full access (server-side only)

### `leads` (To Be Created or Verified)

Contact form submissions.

**Fields** (proposed):

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new',  -- new, contacted, converted, spam
  submitted_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  ip_address INET,  -- Optional: for spam detection
  created_by UUID REFERENCES auth.users(id) -- Anonymous submissions: NULL
);
```

**Access Policy (RLS)**:

```sql
-- Anonymous users: Can INSERT only (submit contact form)
CREATE POLICY "insert_leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Anonymous: Cannot SELECT, UPDATE, DELETE
-- Authenticated (admin): Can read all
```

### `llm_usage` (Future)

Tracks OpenRouter API consumption.

**Fields** (proposed):

```sql
CREATE TABLE llm_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,  -- e.g., "openrouter/openai/gpt-4"
  input_tokens INT NOT NULL,
  output_tokens INT NOT NULL,
  cost_usd DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)  -- NULL for anonymous
);
```

**Access**: Admin only (no user access)

### `metrics` (Future)

Analytics without PII.

**Fields** (proposed):

```sql
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,  -- e.g., "page_view", "form_submit"
  page TEXT,  -- e.g., "/", "/work", "/contact"
  user_country TEXT,  -- GeoIP lookup, no PII
  device_type TEXT,  -- "mobile", "tablet", "desktop"
  created_at TIMESTAMP DEFAULT now()
);
```

**Access**: Admin only

## Row-Level Security (RLS) Policy

**Principle**: Trust the client for read-only content; use RLS for sensitive data.

### Current RLS Setup (via Lovable Cloud)

**For leads table**:

- ✅ Anonymous users CAN insert (contact form submission)
- ❌ Anonymous users CANNOT read, update, or delete
- ✅ Authenticated admins CAN read all leads
- ❌ Regular authenticated users CANNOT access leads

**Example Policy**:

```sql
-- Allow anonymous to insert
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY leads_insert_anonymous ON leads
  FOR INSERT
  WITH CHECK (auth.uid() IS NULL);  -- Only anonymous

CREATE POLICY leads_select_admin ON leads
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY leads_update_admin ON leads
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

**Warning**: Do not disable RLS; it is the only protection for sensitive data.

## Personally Identifiable Information (PII)

**PII Data Collected**:

- Name (from contact form)
- Email (from contact form)
- IP address (optional, for spam detection)

**PII Data NOT Collected**:

- ❌ Passwords (we don't manage user authentication)
- ❌ Phone numbers (not requested)
- ❌ Full browsing history (only page views, anonymized)
- ❌ Cookies or tracking identifiers (except session JWT)
- ❌ Financial data (no purchases, no payments)

**PII Retention Policy**:

- Leads: Keep indefinitely (business value)
- Metrics: Aggregate only, no individual tracking
- Access logs: Retain for 30 days (Render), then delete
- Email: Shared with external services (Resend, future) only with consent

**Consent and GDPR**:

1. Contact form includes privacy notice checkbox
2. Email collection is explicit (not pre-checked)
3. User can request data deletion (email support@magda.rckt)
4. Data processing agreement with Supabase in place

## Secrets Management

### Never Commit to Git

- ❌ `.env` files (local development)
- ❌ Private API keys (OPENROUTER_API_KEY)
- ❌ Database credentials (SUPABASE_SERVICE_ROLE_KEY)
- ❌ Webhook signing secrets
- ❌ OAuth client secrets

### Store in Render Dashboard

All production secrets live in Render, not Git.

| Secret                      | Value                     | Scope                     |
| --------------------------- | ------------------------- | ------------------------- |
| `SUPABASE_URL`              | `https://abc.supabase.co` | Public (frontend)         |
| `SUPABASE_ANON_KEY`         | `eyJ...`                  | Public (frontend)         |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (secret)         | Private (backend only)    |
| `OPENROUTER_API_KEY`        | `sk_or_...`               | Private (FastAPI backend) |

### Local Development (.env.local)

Create `.env.local` in project root (`.gitignore` includes it):

```
SUPABASE_URL=https://abc.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

Never commit `.env.local`.

## Database Migrations

**Principle**: All schema changes are version-controlled in Git.

### Migration Structure (Future)

```
migrations/
├── 001_init.sql
├── 002_add_llm_usage.sql
├── 003_add_metrics.sql
└── README.md
```

### Migration Rules

1. **Never modify existing migrations**
   - Once pushed, migrations are immutable
   - Create a new migration to fix mistakes

2. **Test locally first**
   - Run migrations on local Supabase instance
   - Verify schema with `psql` or Supabase Studio

3. **Write rollback logic**
   - Each migration should be reversible
   - Example:
     ```sql
     -- Up
     CREATE TABLE new_table (...);

     -- Down (in comments for manual rollback)
     -- DROP TABLE new_table;
     ```

4. **Include in PR**
   - Migration files added to feature branch
   - Reviewed by team before merge
   - Deployed to production via Render hook (future)

## Backup and Disaster Recovery

**Supabase Backups**:

- Automatic daily backups (7-day retention)
- Manual backups available via Supabase dashboard
- Export: Use `pg_dump` for full backup

**Recovery Procedure**:

1. Alert team immediately
2. Assess data loss scope
3. Restore from latest backup in Supabase dashboard
4. Verify data integrity
5. Notify affected users

**Disaster Plan**:

- Leads table can be regenerated from form emails (Resend future)
- Metrics can be regenerated from logs (minimal business value)
- User data (auth.users) is Supabase-managed; we do not control recovery

## Query Performance

**Indexing Strategy**:

- Always add indexes on foreign keys
- Always add indexes on WHERE clauses in common queries
- Example:
  ```sql
  CREATE INDEX idx_leads_status ON leads(status);
  CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
  ```

**Connection Pooling** (Future):

- Use PgBouncer if connection limit is exceeded
- Render supports pooling via Supabase connection pool

**Query Monitoring**:

- Use Supabase dashboard to identify slow queries
- Add `explain analyze` before optimizing

## Compliance and Auditing

**GDPR Requirements**:

- ✅ User can request data export
- ✅ User can request data deletion
- ✅ Privacy policy is displayed on site
- ✅ Data processing is documented (this file)

**Audit Trail** (Future):

- Log all admin queries to leads table
- Log all API access attempts
- Retain logs for 90 days

## Data Access in Code

### Server-Side Only (FastAPI or TanStack Start)

```python
# FastAPI example
from supabase import create_client

supabase = create_client(url, service_role_key)  # ← Never expose key
leads = supabase.table("leads").select("*").execute()
```

### Client-Side (React)

```typescript
// Use Supabase client with ANON_KEY
const supabase = createClient(url, anonKey); // ← Public key is OK
const { data } = await supabase.auth.getUser(); // ← User session only
```

### Never Do This

```typescript
❌ const response = await fetch("/api/admin-secrets");  // Exposes secrets
❌ const url = process.env.SUPABASE_SERVICE_ROLE_KEY;  // Client can read
❌ const sql = "SELECT * FROM users";  // Direct SQL in client (use API)
```

---

**Data Contract Version**: 1.0  
**Effective Date**: 2026-09-07  
**Last Reviewed**: 2026-09-07  
**Audit Status**: No current breaches  
**Next Review**: 2026-12-07
