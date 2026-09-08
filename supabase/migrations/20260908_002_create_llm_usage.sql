-- Magda: Database Foundation - Create LLM Usage Tracking Table
-- Migration: 20260908_002_create_llm_usage.sql
-- Description: Observability table for OpenRouter API call metrics (append-only design)

-- Enable pgcrypto for UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the llm_usage table for observability
CREATE TABLE IF NOT EXISTS public.llm_usage (
  -- Identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Request tracking
  request_id VARCHAR(150) NULL,
  session_id UUID NULL,

  -- Provider and model information
  provider VARCHAR(50) NOT NULL DEFAULT 'openrouter',
  model VARCHAR(150) NOT NULL,

  -- Token accounting
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,

  -- Performance metrics
  latency_ms INTEGER NULL,
  cost_usd NUMERIC(12, 6) NULL,

  -- Fallback tracking
  fallback_used BOOLEAN NOT NULL DEFAULT false,

  -- Status tracking
  status VARCHAR(30) NOT NULL DEFAULT 'success',
  error_code VARCHAR(100) NULL,

  -- Non-sensitive technical metadata
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Constraints: String lengths (trimmed for consistency)
  CONSTRAINT llm_usage_provider_length CHECK (LENGTH(TRIM(provider)) BETWEEN 2 AND 50),
  CONSTRAINT llm_usage_model_length CHECK (LENGTH(TRIM(model)) BETWEEN 1 AND 150),
  CONSTRAINT llm_usage_request_id_length CHECK (request_id IS NULL OR LENGTH(TRIM(request_id)) BETWEEN 1 AND 150),

  -- Constraints: Token counts
  CONSTRAINT llm_usage_input_tokens_nonnegative CHECK (input_tokens >= 0),
  CONSTRAINT llm_usage_output_tokens_nonnegative CHECK (output_tokens >= 0),

  -- Constraints: Performance metrics (nullable or nonnegative)
  CONSTRAINT llm_usage_latency_nonnegative CHECK (latency_ms IS NULL OR latency_ms >= 0),
  CONSTRAINT llm_usage_cost_nonnegative CHECK (cost_usd IS NULL OR cost_usd >= 0),

  -- Constraint: Valid status values
  CONSTRAINT llm_usage_status_valid CHECK (status IN ('success', 'error')),

  -- Constraint: Error code consistency
  -- If status is 'success', error_code must be NULL
  -- If status is 'error', error_code can be NULL or have a value
  CONSTRAINT llm_usage_error_consistency CHECK (
    (status = 'success' AND error_code IS NULL) OR
    (status = 'error')
  )
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_llm_usage_created_at ON public.llm_usage (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_usage_session_id ON public.llm_usage (session_id);
CREATE INDEX IF NOT EXISTS idx_llm_usage_status ON public.llm_usage (status);
CREATE INDEX IF NOT EXISTS idx_llm_usage_model ON public.llm_usage (model);

-- Enable Row-Level Security
ALTER TABLE public.llm_usage ENABLE ROW LEVEL SECURITY;

-- Add documentation comments
COMMENT ON TABLE public.llm_usage IS
  'Technical observability table for OpenRouter API integration. '
  'Append-only design tracking: model usage, latency, costs, fallback activation. '
  'Used by backend and monitoring systems only. '
  'No prompts, responses, or PII stored. '
  'Browser cannot access directly; all writes via FastAPI service role.';

COMMENT ON COLUMN public.llm_usage.session_id IS
  'Pseudonymous UUID for correlating LLM calls within a user session. '
  'No PII, no identification data. Used for debugging conversation flows only.';

COMMENT ON COLUMN public.llm_usage.metadata IS
  'Non-sensitive technical metadata. '
  'Examples: feature flags, model versions, A/B test variants. '
  'NEVER store: complete prompts, complete responses, transcripts, PII, medical/patient data.';
