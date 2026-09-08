# Agent Contract: AI Integration (Future)

## Overview

This document defines how the AI agent will operate in Magda v2+. The agent is a future service, not yet implemented.

**Status**: Architecture planning (Phase 2)  
**Target Release**: Q1 2027  
**Implementation**: FastAPI + OpenRouter

## Agent Responsibilities

### What the Agent Will Do

1. **Answer Questions About Magdalena**
   - Work experience and expertise
   - Services offered (design, development, strategy)
   - Availability and project scope
   - Project timeline and process

2. **Qualify Leads**
   - Understand project needs
   - Assess scope and budget fit
   - Identify red flags (unrealistic budgets, timeline)
   - Route to next step (contact form, email)

3. **Provide Context**
   - Reference work samples shown on site
   - Explain design rationale
   - Discuss past projects and outcomes
   - Share testimonials from previous clients

### What the Agent Will NOT Do

- ❌ Make commitments on behalf of Magdalena
- ❌ Give exact quotes or pricing (redirect to contact form)
- ❌ Access real business data (CRM, finances)
- ❌ Perform tasks outside of site context
- ❌ Generate new content (images, code) for clients
- ❌ Act as a general-purpose chatbot

## Agent Architecture

### Components

```
User Message (Browser)
        │
        ▼
TanStack Start (Frontend)
        │ (POST /api/chat)
        ▼
Render Compute (FastAPI)
        │
        ├─ Middleware: Auth, rate limit
        ├─ Handler: /api/chat endpoint
        ├─ Message Validator: Zod schema
        │
        ├─ Agent Orchestrator
        │  ├─ Read system prompt
        │  ├─ Retrieve context (about Magdalena)
        │  ├─ Format conversation history
        │  └─ Call OpenRouter API
        │
        └─ Response Formatter
           ├─ Parse LLM response
           ├─ Extract action (answer, qualify, redirect)
           ├─ Log usage metrics
           └─ Return to client

                    ▼
            OpenRouter API
            ├─ Primary Model: gpt-4-turbo
            ├─ Fallback: gpt-3.5-turbo
            └─ (Fallback configurable per deployment)

                    ▼
            Supabase (Logging)
            ├─ llm_usage (tokens, cost)
            └─ conversation_logs (transcript, optional)
```

### Deployment

**Service**: FastAPI on Render  
**Runtime**: Python 3.11  
**Framework**: FastAPI + Pydantic  
**Package Manager**: pip (or uv for speed)

```dockerfile
# Proposed Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

## Knowledge Base

### What the Agent Knows (AGENT.md)

The agent's knowledge is stored in a separate file: `AGENT.md`

**Contents**:

- Magdalena's bio and expertise
- Services offered
- Work philosophy and process
- Project types and scope
- Availability status
- Testimonials and case studies
- Frequently asked questions
- Redirect instructions

**Format**: Markdown, human-readable, updatable without code changes.

**Example**:

```markdown
# Magdalena Cardona - Agent Knowledge

## Who is Magdalena?

Magdalena is a designer and developer with 10+ years of experience in...

## Services

- Strategic design
- Full-stack development
- Design systems
- UX research

## Availability

As of Sep 2026: Available for new projects starting November.

## Testimonials

"Working with Magdalena..." — Client Name, Company

## FAQ

Q: Do you work remote?
A: Yes, 100% remote. I work with clients worldwide.

Q: What's your project minimum?
A: Typically $15k for design + dev projects. Custom arrangements possible.

Q: Can you do X?
A: Yes, and here's why...
```

### Version Control

- `AGENT.md` is in Git (like any code)
- Changes via PR (review by Magdalena)
- No secrets or API keys in AGENT.md
- Update frequency: As needed (availability changes, new testimonials)

### Context Injection (future)

When calling the LLM, include:

```python
system_prompt = f"""
You are an AI assistant for Magdalena Cardona's website.
Your role is to answer questions about her work and services.

{load_from_agent_md()}

Always be honest. If you don't know, say so and suggest contacting Magdalena directly.
"""
```

## Conversation Flow

### Typical Interaction

```
User: "Do you do mobile app development?"
        │
        ▼
Agent: "Yes, I specialize in full-stack mobile development.
        I've built iOS and Android apps with React Native and native platforms.
        What kind of app are you thinking about?"
        │
        ▼
User: "We need a custom dashboard for real-time analytics."
        │
        ▼
Agent: "That sounds like a great fit for my services.
        I've built several analytics dashboards for SaaS companies.
        To move forward, could you fill out the contact form so Magdalena
        can discuss specifics like budget, timeline, and team size?"
        │
        ▼
Redirect to Contact Form
```

### Edge Cases

**User asks for a quote:**

```
Agent: "I don't provide quotes via chat. Each project is unique.
        Please share details in the contact form, and Magdalena will
        send you a detailed proposal."
```

**User asks for code help (off-topic):**

```
Agent: "I'm here to help with questions about Magdalena's services.
        For general coding help, I'd recommend StackOverflow or ChatGPT.
        Is there anything about Magdalena's work I can help with?"
```

**Offensive or spam message:**

```
Agent: [No response / logged as spam]
[Rate limit triggered after N spam attempts]
```

## API Endpoints (Future)

### POST /api/chat

**Request**:

```json
{
  "message": "Do you work with startups?",
  "conversation_id": "conv_xyz",
  "user_id": null // Anonymous users only
}
```

**Response**:

```json
{
  "response": "Yes, I love working with startups...",
  "action": "answer", // or "qualify", "redirect", "clarify"
  "metadata": {
    "tokens_used": 150,
    "cost_usd": 0.00225,
    "model": "openrouter/openai/gpt-4-turbo"
  }
}
```

### Errors

**Rate limit exceeded**:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Please wait before sending another message.",
  "retry_after_seconds": 60
}
```

**API key invalid**:

```json
{
  "error": "service_unavailable",
  "message": "The agent is temporarily unavailable. Please try again later."
}
```

## OpenRouter Integration

### Why OpenRouter?

1. **Flexibility**: Switch models without code changes
2. **Cost**: Pay-per-token, no lock-in
3. **Fallback**: Automatic failover if primary provider is down
4. **Monitoring**: Built-in usage analytics

### Model Strategy

**Primary**: `openrouter/openai/gpt-4-turbo`

- Best reasoning
- Handles complex questions
- Cost: ~$0.01 per 1K input tokens

**Fallback**: `openrouter/openai/gpt-3.5-turbo`

- Faster, cheaper
- Handles simple questions
- Cost: ~$0.0005 per 1K input tokens

**Fallback (in case of outage)**: `openrouter/meta-llama/llama-2-70b-chat`

- Open source
- Reliable availability
- Cost: ~$0.0008 per 1K input tokens

### Usage Tracking

```python
# Log to Supabase after each call
supabase.table("llm_usage").insert({
    "model": response["model"],
    "input_tokens": response["usage"]["prompt_tokens"],
    "output_tokens": response["usage"]["completion_tokens"],
    "cost_usd": calculate_cost(response),
    "created_at": datetime.now(),
}).execute()
```

## Monitoring and Observability

### Metrics to Track

| Metric               | Purpose      | Alert           |
| -------------------- | ------------ | --------------- |
| Avg Response Time    | Performance  | > 3s            |
| Error Rate           | Reliability  | > 5%            |
| Cost per Message     | Budget       | > $0.05         |
| Message Volume       | Growth       | (informational) |
| Fallback Model Usage | Availability | > 10%           |

### Logging

**Every chat message**:

```json
{
  "timestamp": "2026-09-07T14:30:00Z",
  "message_id": "msg_abc123",
  "user_id": null,
  "input": "Do you work with startups?",
  "output": "Yes, I love working with startups...",
  "model": "gpt-4-turbo",
  "tokens": 150,
  "latency_ms": 850,
  "action": "answer",
  "status": "success"
}
```

**Failures**:

- Log full error (for debugging)
- Do NOT include API keys or sensitive data
- Alert on repeated failures

## Testing Strategy

### Unit Tests

```python
def test_agent_formats_response():
    response = agent.format_response("Do you do React?")
    assert "yes" in response.lower()

def test_agent_redirects_to_contact():
    response = agent.format_response("Can you give me a quote?")
    assert "contact form" in response.lower()
```

### Integration Tests

```python
def test_agent_calls_openrouter():
    response = agent.chat("Hello")
    assert response["tokens_used"] > 0
    assert response["cost_usd"] > 0
```

### Load Testing

```bash
# Simulated 100 concurrent users, 10 messages each
locust -f locustfile.py --users 100 --spawn-rate 10
```

### Manual Testing

Before deploying to production:

1. Test 10+ common questions
2. Test edge cases (spam, off-topic)
3. Verify fallback model works
4. Check cost tracking

## Privacy and Data Handling

### What Gets Logged

- ✅ Message content (for debugging)
- ✅ Model and tokens used
- ✅ Cost calculation
- ✅ Response time

### What Does NOT Get Logged

- ❌ User IP address (privacy)
- ❌ User session tokens
- ❌ PII beyond context (assume all messages are sensitive)

### Retention Policy

- **Conversation logs**: Keep for 30 days (debugging), then delete
- **Usage metrics**: Keep for 12 months (cost tracking)
- **Error logs**: Keep for 90 days

### GDPR Compliance

- Users can request deletion of conversation logs
- No PII stored outside of context
- Data processing agreement with OpenRouter

## Limitations and Responsibilities

### Agent Limitations

- ❌ Cannot make binding commitments
- ❌ Cannot access real-time data (projects, availability)
- ❌ Cannot generate new content (code, designs)
- ❌ Cannot replace human review
- ❌ Subject to hallucination (may make false claims)

### Human Oversight

- Magdalena reviews all leads from chat
- Agent qualifies but does not commit
- All pricing/timeline is subject to human review
- Agent failures are reviewed weekly

---

**Agent Contract Version**: 1.0 (Planning)  
**Implementation Timeline**: Phase 3 (Q1 2027)  
**Status**: Not yet built  
**Next Step**: FastAPI backend architecture (Phase 2)
