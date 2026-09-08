import { z } from "zod";

const LeadCreateSchema = z
  .object({
    company: z.string().trim().min(2).max(120),
    email: z.string().email().max(254),
    area: z.string().trim().min(2).max(100),
    comment: z.string().trim().min(3).max(2000),
    consent_privacy: z.literal(true),
    session_id: z.string().uuid().optional(),
  })
  .strict();

type LeadCreate = z.infer<typeof LeadCreateSchema>;

export function validateLeadInput(
  data: unknown,
): { valid: true; data: LeadCreate } | { valid: false; error: string } {
  try {
    const parsed = LeadCreateSchema.parse(data);
    return { valid: true, data: parsed };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { valid: false, error: "Invalid input" };
    }
    return { valid: false, error: "Validation error" };
  }
}

export function buildLeadPayload(input: LeadCreate) {
  return {
    company: input.company,
    email: input.email,
    area: input.area,
    comment: input.comment,
    consent_privacy: input.consent_privacy,
    session_id: input.session_id || null,
    source: "website",
    status: "new",
    consent_at: new Date().toISOString(),
    metadata: {},
  };
}
