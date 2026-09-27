import { MAGDA_SYSTEM_PROMPT } from "./system.prompt";
import { MAGDA_KNOWLEDGE } from "./magda.knowledge";
import { getSystemPrompt, buildChatMessages } from "./chat.service.server";

// Static validation assertions for HEOR Assistant Knowledge

function assertContains(str: string, substring: string, label: string): void {
  if (!str.includes(substring)) {
    throw new Error(`Validation failed: "${label}" - missing "${substring}"`);
  }
}

function assertNotContains(str: string, substring: string, label: string): void {
  if (str.includes(substring)) {
    throw new Error(`Validation failed: "${label}" - should not contain "${substring}"`);
  }
}

// Validate assistant identity
const prompt = getSystemPrompt();
assertContains(prompt, "virtual assistant", "Assistant identity: virtual assistant");
assertContains(prompt, "NOT Magda", "Assistant identity: NOT Magda");

// Validate HEOR services
assertContains(MAGDA_KNOWLEDGE, "HEALTH ECONOMICS / HEOR", "HEOR services section");
assertContains(MAGDA_KNOWLEDGE, "Cost-effectiveness models", "HEOR: cost-effectiveness");
assertContains(MAGDA_KNOWLEDGE, "Budget Impact Analysis", "HEOR: budget impact");
assertContains(
  MAGDA_KNOWLEDGE,
  "Systematic Reviews and Evidence Synthesis",
  "HEOR: evidence synthesis",
);

// Validate pricing and market access services
assertContains(MAGDA_KNOWLEDGE, "PRICING AND MARKET ACCESS", "Pricing section");
assertContains(MAGDA_KNOWLEDGE, "Pricing and Launch Business Cases", "Pricing: launch");
assertContains(MAGDA_KNOWLEDGE, "Value Propositions", "Pricing: value prop");
assertContains(MAGDA_KNOWLEDGE, "International reference pricing", "Pricing: reference");

// Validate scientific communication services
assertContains(MAGDA_KNOWLEDGE, "SCIENTIFIC COMMUNICATION", "Science comm section");
assertContains(MAGDA_KNOWLEDGE, "Value Dossiers", "Sci comm: dossiers");
assertContains(MAGDA_KNOWLEDGE, "Manuscripts", "Sci comm: publications");
assertContains(MAGDA_KNOWLEDGE, "Evidence and Data Translation", "Sci comm: translation");

// Validate training services
assertContains(MAGDA_KNOWLEDGE, "TRAINING", "Training section");
assertContains(MAGDA_KNOWLEDGE, "Bespoke Training", "Training: bespoke");
assertContains(MAGDA_KNOWLEDGE, "Health economics", "Training: health econ");

// Validate safety boundaries
assertContains(MAGDA_KNOWLEDGE, "Provide individual medical advice", "Boundary: medical advice");
assertContains(MAGDA_KNOWLEDGE, "Invent prices, consulting fees", "Boundary: invented prices");
assertContains(MAGDA_KNOWLEDGE, "Do not invent pricing", "Boundary: advisory session no pricing");

// Validate verified profile
assertContains(MAGDA_KNOWLEDGE, "Magda Gutiérrez Ardila", "Profile: name");
assertContains(MAGDA_KNOWLEDGE, "14 years", "Profile: experience");
assertContains(MAGDA_KNOWLEDGE, "Pfizer", "Profile: Pfizer");
assertContains(MAGDA_KNOWLEDGE, "AbbVie", "Profile: AbbVie");
assertContains(MAGDA_KNOWLEDGE, "Madrid", "Profile: Madrid");
assertContains(MAGDA_KNOWLEDGE, "MSc in Health Economics", "Profile: MSc");
assertContains(MAGDA_KNOWLEDGE, "Executive MBA", "Profile: MBA");

// Validate contact information
assertContains(MAGDA_KNOWLEDGE, "magda.vianey.g@gmail.com", "Contact: email");
assertContains(MAGDA_KNOWLEDGE, "linkedin.com/in/magda-gutierrez-ardila", "Contact: LinkedIn");

// Validate advisory session without pricing
assertContains(MAGDA_KNOWLEDGE, "ADVISORY SESSION", "Advisory: section");
assertContains(MAGDA_KNOWLEDGE, "60-minute", "Advisory: duration");
assertContains(MAGDA_KNOWLEDGE, "Do not invent pricing", "Advisory: no pricing");

// Validate system prompt imports knowledge
assertContains(MAGDA_SYSTEM_PROMPT, MAGDA_KNOWLEDGE, "System prompt imports knowledge");

// Validate plain text format (check knowledge content, not instruction text)
assertNotContains(MAGDA_KNOWLEDGE, "**", "Format: no markdown bold");
assertNotContains(MAGDA_KNOWLEDGE, "##", "Format: no markdown headers");
assertNotContains(MAGDA_KNOWLEDGE, "###", "Format: no markdown subheaders");

// Validate third-person language guidelines
assertContains(
  MAGDA_SYSTEM_PROMPT,
  'Do NOT say: "I worked at Pfizer"',
  "Guidelines: do not say section",
);
assertContains(
  MAGDA_SYSTEM_PROMPT,
  '"Magda specializes in..."',
  "Guidelines: third-person language",
);

// Validate message construction with system prompt
const testMessages = buildChatMessages("Test question", [
  { role: "user", content: "Previous question" },
  { role: "assistant", content: "Previous answer" },
]);

assertContains(
  JSON.stringify(testMessages),
  '"role":"system"',
  "Message construction: system message included",
);

if (testMessages.length < 3) {
  throw new Error(
    `Validation failed: message construction expected at least 3 messages (system + history + user), got ${testMessages.length}`,
  );
}

const firstMsg = testMessages[0];
if (!firstMsg || firstMsg.role !== "system") {
  throw new Error(`Validation failed: first message should be system role, got ${firstMsg?.role}`);
}

if (!firstMsg.content.includes(MAGDA_KNOWLEDGE)) {
  throw new Error("Validation failed: system message should contain MAGDA_KNOWLEDGE");
}

const lastMsg = testMessages[testMessages.length - 1];
if (!lastMsg || lastMsg.role !== "user") {
  throw new Error(`Validation failed: last message should be user role, got ${lastMsg?.role}`);
}

if (!lastMsg || lastMsg.content !== "Test question") {
  throw new Error("Validation failed: last message should contain current user message");
}

// Validation complete
export const validationComplete = true;
