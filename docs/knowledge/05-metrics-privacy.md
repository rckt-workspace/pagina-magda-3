# Metrics and Privacy Policy

## Analytics Philosophy

**Principle**: Collect what we need to improve; don't collect "just in case."

We track:

- ✅ Aggregate page views (no PII)
- ✅ User journey (funnel: visit → explore → contact)
- ✅ Lead volume and quality
- ✅ AI agent usage (tokens, cost, performance)

We do NOT track:

- ❌ Individual user identities (anonymous sessions only)
- ❌ Full browsing history (no page-by-page tracking)
- ❌ User location (GeoIP is anonymized)
- ❌ Device identifiers (no persistent cookies)
- ❌ Email addresses (leads are separate)

## Data Categories

### Category 1: Leads (Business Value)

**What**: Contact form submissions  
**Fields**:

- `email` — User-provided
- `name` — User-provided
- `message` — User-provided
- `submitted_at` — Timestamp
- `status` — Internal (new, contacted, converted, spam)

**Retention**: Indefinite (business critical)  
**Access**: Admin only (Magdalena)  
**Disclosure**: Not shared with third parties without consent

**Uses**:

- Follow up on inquiries
- Track conversion funnel
- Identify repeating spam

### Category 2: Site Metrics (Usage Analytics)

**What**: Aggregate page views, bounce rates, conversion rates  
**Fields**:

- `page` — Which page was viewed (/, /work, /contact)
- `action` — What happened (page_view, form_submit, button_click)
- `device_type` — Mobile / Tablet / Desktop
- `user_country` — Anonymized via GeoIP
- `created_at` — Timestamp

**Retention**: 90 days (rolling average)  
**Access**: Admin only  
**Disclosure**: Never shared (internal only)

**Uses**:

- Understand user behavior
- Identify popular pages
- Measure form submission success rate
- Optimize based on device type

**Tools** (future):

- Plausible Analytics (privacy-focused, no Google)
- Supabase Events table (self-hosted analytics)
- Custom queries on `metrics` table

### Category 3: AI Agent Usage (Performance + Cost)

**What**: LLM token consumption and response quality  
**Fields**:

- `model` — Which LLM model was used
- `input_tokens` — Tokens in prompt
- `output_tokens` — Tokens in response
- `cost_usd` — Calculated cost
- `latency_ms` — Response time
- `created_at` — Timestamp

**Retention**: 12 months (cost tracking)  
**Access**: Admin only  
**Disclosure**: Never shared

**Uses**:

- Monitor agent performance
- Budget tracking (OpenRouter costs)
- Identify runaway costs or abuse
- A/B test model versions

### Category 4: Error Logs (Debugging)

**What**: Application errors and API failures  
**Fields**:

- `error_code` — HTTP or application error code
- `error_message` — Description
- `stack_trace` — Full traceback (server-side only)
- `endpoint` — Which API was called
- `user_id` — Anonymized session ID (optional)
- `created_at` — Timestamp

**Retention**: 30 days (Render logs), then deleted  
**Access**: Dev team only  
**Disclosure**: Never shared

**Uses**:

- Debug production issues
- Monitor uptime and reliability
- Identify bugs before users report them

**Scrubbing Rules**:

- Remove API keys before logging
- Truncate long request bodies
- Redact user input that might be PII

## Privacy Compliance

### GDPR (EU Users)

**Magda does NOT**:

- Use tracking pixels or cookies (except session JWT)
- Build user profiles or use retargeting ads
- Sell or share data with third parties
- Require login for browsing

**Magda DOES**:

- Provide a Privacy Policy (at /privacy, future)
- Allow users to request their data
- Allow users to request data deletion
- Use encryption in transit (HTTPS)

**User Rights**:

| Right             | How We Implement                                            |
| ----------------- | ----------------------------------------------------------- |
| Right to access   | Email Magdalena with request; provide export within 30 days |
| Right to delete   | Email with request; delete all PII and logs within 30 days  |
| Right to rectify  | Contact form resubmission (overwrites old data)             |
| Right to restrict | Mark lead as "do not contact" in Supabase                   |

**Data Processing Agreement**:

- Supabase DPA: https://supabase.com/dpa
- OpenRouter DPA: https://openrouter.ai/privacy (future)
- Resend DPA: https://resend.com/privacy (future)

### CCPA (California Users - Future)

**Planned approach** (if US expansion occurs):
- No sale of personal information
- Clear privacy disclosures
- Right to delete (same as GDPR process)
- No data sharing with third parties (not applicable)

### Third-Party Integrations

| Service    | Data Shared                  | Purpose              | DPA         |
| ---------- | ---------------------------- | -------------------- | ----------- |
| Supabase   | All (leads, metrics)         | Database             | ✅          |
| OpenRouter | Message content (anonymized) | AI Processing        | ✅ (future) |
| Resend     | Email address + name         | Email delivery       | ✅ (future) |
| Render     | App logs, metrics            | Hosting & monitoring | ✅          |

## Consent Management

### Explicit Consent (Contact Form)

```html
<label>
  <input type="checkbox" name="consent" required />
  I agree to share my email so Magdalena can follow up.
</label>
```

**Non-negotiable** (form will not submit without consent)

### Implicit Consent (Site Analytics)

Visiting the site implies consent to anonymous aggregate analytics.

**Opt-out**: Users can:

1. Enable browser "Do Not Track" (respected)
2. Use privacy extensions (uBlock Origin, etc.)
3. Request Magdalena disable tracking for their email

### Cookie Policy

**Cookies We Set**:

- `session_jwt` — Supabase session (expires in 1 hour)
- `csrf_token` — CSRF protection (per-request)

**Cookies We Do NOT Set**:

- ❌ Google Analytics (tracking cookies)
- ❌ Facebook Pixel
- ❌ HubSpot, Intercom, or CRM cookies
- ❌ Advertising cookies

**User Control**:

- All cookies are session-based (cleared when browser closes)
- No persistent tracking

## Data Retention Schedule

| Data Type         | Retention  | Reason            | Deletion Method          |
| ----------------- | ---------- | ----------------- | ------------------------ |
| Leads             | Forever    | Business critical | Manual (email Magdalena) |
| Site Metrics      | 90 days    | Monthly analysis  | Auto-delete via cron     |
| AI Usage          | 12 months  | Cost tracking     | Auto-delete via cron     |
| Error Logs        | 30 days    | Debugging         | Render auto-deletes      |
| Conversation Logs | 30 days    | Debugging         | Auto-delete via cron     |
| Session Tokens    | 1 hour     | Security          | Auto-expire              |
| IP Addresses      | Not stored | Privacy           | N/A                      |

## Data Security

### Encryption

| Data      | In Transit             | At Rest                        |
| --------- | ---------------------- | ------------------------------ |
| Leads     | HTTPS (TLS 1.3)        | Supabase encrypted disk        |
| Metrics   | HTTPS                  | Supabase encrypted disk        |
| API Keys  | N/A (server-side only) | Environment variables (Render) |
| Passwords | N/A (Supabase managed) | Supabase bcrypt + salt         |

### Access Control

| Role              | Can Read            | Can Write                | Can Delete |
| ----------------- | ------------------- | ------------------------ | ---------- |
| Anonymous User    | None (RLS)          | Leads only (anon insert) | None       |
| Magdalena (admin) | All                 | All                      | All        |
| AI Agent (future) | AGENT.md, knowledge | Usage logs               | None       |
| Render (hosting)  | App code only       | Logs                     | None       |

### Secrets Management

**Secrets stored in Render Dashboard**:

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- Database credentials (future)
- Webhook signing keys (future)

**Never in Git**:

- `.env` files
- `config.yml` with secrets
- API keys in code comments

**Never in Client Code**:

- Service role keys
- API keys
- Database credentials

## Incident Response

### If Data is Compromised

1. **Immediate** (within 1 hour):
   - Identify scope (what data, how many users)
   - Revoke compromised API keys (Render dashboard)
   - Check Supabase audit logs

2. **Short-term** (within 24 hours):
   - Notify affected users (email)
   - Document incident (for compliance)
   - Deploy fix

3. **Long-term** (within 7 days):
   - Post-mortem analysis
   - Update security policies
   - Implement preventive measures

### Contact

- **Security Report**: security@magda.rckt
- **Privacy Concern**: privacy@magda.rckt
- **Response Target**: 48 hours

## Transparency Report

**We publish (annually)**:

- Total leads collected
- Average response time (agent)
- Total API costs (OpenRouter)
- Uptime percentage
- Security audit results

Example:

```
# Magda 2026 Transparency Report

Leads Collected: 147
Avg Quality Score: 4.2/5
Agent Response Time: 1.2 seconds
API Costs: $342.50
Uptime: 99.8%
Security Audits: 0 issues
```

## User-Facing Privacy Policy

**Summary for /privacy page**:

---

### Privacy Policy (Short Version)

**We collect**:

- Email and name (when you contact us)
- Anonymous page views (no cookies)
- AI agent usage (tokens, performance)

**We do NOT**:

- Sell your data
- Track your full browsing history
- Use cookies for advertising
- Require an account

**You can**:

- Request your data (email privacy@magda.rckt)
- Request data deletion (same email)
- Opt out of metrics (browser "Do Not Track")

**Questions?** Email privacy@magda.rckt

---

## Compliance Checklist

Before deploying to production:

- [ ] Privacy Policy live on site (/privacy)
- [ ] Consent checkbox on contact form
- [ ] Supabase DPA signed
- [ ] No API keys in frontend code
- [ ] RLS policies tested
- [ ] Error logs scrubbed of PII
- [ ] Encryption enabled (HTTPS)
- [ ] Session tokens expire
- [ ] Backup strategy documented
- [ ] Incident response plan ready

---

**Metrics & Privacy Version**: 1.0  
**Effective Date**: 2026-09-07  
**Last Audit**: 2026-09-07  
**Next Review**: 2026-12-07  
**Privacy Model**: Data minimization + user control (consult legal for compliance)
