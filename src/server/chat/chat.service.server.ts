import { z } from "zod";
import { MAGDA_SYSTEM_PROMPT } from "./system.prompt";
import { callOpenRouter } from "../llm/openrouter.provider.server";

const ChatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(2000),
  })
  .strict();

const ChatRequestSchema = z
  .object({
    message: z.string().trim().min(1).max(2000),
    sessionId: z.string().uuid().optional(),
    history: z.array(ChatMessageSchema).max(8).optional(),
  })
  .strict();

type ChatRequest = z.infer<typeof ChatRequestSchema>;
type ChatMessage = z.infer<typeof ChatMessageSchema>;

export function validateChatInput(
  data: unknown,
): { valid: true; data: ChatRequest } | { valid: false; error: string } {
  try {
    const parsed = ChatRequestSchema.parse(data);
    return { valid: true, data: parsed };
  } catch (err) {
    return { valid: false, error: "Invalid input" };
  }
}

export async function handleChatMessage(
  req: ChatRequest,
  signal?: AbortSignal,
): Promise<{
  success: boolean;
  message?: string;
  model?: string;
  usedFallback?: boolean;
  error?: string;
}> {
  const messages: ChatMessage[] = [...(req.history || []), { role: "user", content: req.message }];

  const callOptions = signal ? { signal } : {};
  const result = await callOpenRouter(messages, callOptions);

  if (!result.success || !result.message || !result.model) {
    return {
      success: false,
      error: result.error || "Assistant temporarily unavailable",
    };
  }

  return {
    success: true,
    message: result.message,
    model: result.model,
    usedFallback: false,
  };
}

export function getSystemPrompt(): string {
  return MAGDA_SYSTEM_PROMPT;
}
