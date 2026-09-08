type OpenRouterRequest = {
  model: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  temperature: number;
  max_tokens: number;
};

type OpenRouterResponse = {
  choices: Array<{ message: { content: string }; finish_reason: string }>;
  usage: { prompt_tokens: number; completion_tokens: number };
  model: string;
};

export async function callOpenRouter(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  options?: { signal?: AbortSignal },
): Promise<{
  success: boolean;
  message?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  finishReason?: string;
  error?: string;
}> {
  const apiKey = process.env["OPENROUTER_API_KEY"];
  const baseUrl = process.env["OPENROUTER_BASE_URL"] || "https://openrouter.ai/api/v1";
  const model = process.env["CHAT_PRIMARY_LLM"] || "openrouter/free";
  const temperature = parseFloat(process.env["CHAT_TEMPERATURE"] || "0.2");
  const maxTokens = parseInt(process.env["CHAT_MAX_TOKENS"] || "600", 10);

  if (!apiKey) {
    return { success: false, error: "Service not configured" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const payload: OpenRouterRequest = {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      };

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "magda-app/1.0",
        },
        body: JSON.stringify(payload),
        signal: options?.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter error:", response.status, errorBody);
        return { success: false, error: "Provider error" };
      }

      const data = (await response.json()) as OpenRouterResponse;

      if (!data.choices || data.choices.length === 0) {
        return { success: false, error: "No response from provider" };
      }

      const choice = data.choices[0];
      if (!choice || !choice.message) {
        return { success: false, error: "No response from provider" };
      }

      const message = choice.message.content;
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0 };
      return {
        success: true,
        message,
        model: data.model,
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        finishReason: choice.finish_reason,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, error: "Request timeout" };
    }
    console.error("OpenRouter call error:", err);
    return { success: false, error: "Request failed" };
  }
}
