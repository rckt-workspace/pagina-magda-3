-- Magda: Database Foundation - Create Leads Table
-- Migration: 20260908_001_create_leads.sql
-- Description: Business leads table for contact form submissions with privacy controls

-- Enable pgcrypto for UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
  -- Identifiers
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Contact information
  company VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  area VARCHAR(100) NOT NULL,
  comment TEXT NOT NULL,

  -- Source tracking
  source VARCHAR(50) NOT NULL DEFAULT 'website',

  -- Lead status
  status VARCHAR(30) NOT NULL DEFAULT 'new',

  -- Privacy consent (must be explicit)
  consent_privacy BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMPTZ NULL,

  -- Session tracking (anonymous user identification)
  session_id UUID NULL,

  -- Extensible metadata (commercial leads context only, no sensitive data)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Constraints: String lengths (trimmed for consistency)
  CONSTRAINT leads_company_length CHECK (LENGTH(TRIM(company)) BETWEEN 2 AND 120),
  CONSTRAINT leads_email_length CHECK (LENGTH(TRIM(email)) BETWEEN 5 AND 254),
  CONSTRAINT leads_area_length CHECK (LENGTH(TRIM(area)) BETWEEN 2 AND 100),
  CONSTRAINT leads_comment_length CHECK (LENGTH(TRIM(comment)) BETWEEN 3 AND 2000),

  -- Constraint: Valid status values
  CONSTRAINT leads_status_valid CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'spam')),

  -- Constraint: Consent consistency
  -- If consent_privacy is true, consent_at must be set
  -- If consent_privacy is false, consent_at must be null
  CONSTRAINT leads_consent_consistency CHECK (
    (consent_privacy = true AND consent_at IS NOT NULL) OR
    (consent_privacy = false AND consent_at IS NULL)
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Drop existing trigger if present and recreate
DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;

CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON public.leads (session_id);

-- Enable Row-Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Add documentation comments
COMMENT ON TABLE public.leads IS
  'Contact form submissions from website visitors. '
  'Privacy-first design: requires explicit consent for contact. '
  'No sensitive or medical data permitted in metadata field.';

COMMENT ON COLUMN public.leads.metadata IS
  'Extensible JSON field for non-sensitive commercial context. '
  'Examples: project type, budget range, referral source. '
  'Do not store protected or medical information.';
