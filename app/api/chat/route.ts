import { convertToModelMessages, streamText, UIMessage } from "ai"
import { google } from "@ai-sdk/google"
import type { Section } from "@/lib/data"

// Define the blueprint structure that matches the API response
interface BlueprintSection {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
}

interface Blueprint {
  sections: BlueprintSection[];
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

function approxTokens(text: string) {
  // Very rough heuristic widely used for English text.
  // Good enough for logging/debugging, not billing-accurate.
  return Math.ceil(text.length / 4)
}

function stringifyForLog(value: unknown, maxChars = 20_000) {
  const str =
    typeof value === "string" ? value : JSON.stringify(value, null, 2)
  return str.length > maxChars
    ? str.slice(0, maxChars) + "\n…(truncated)"
    : str
}

function blueprintToSystemMessage(blueprint: Blueprint): string {
  // Create a structured outline for the blueprint display (without summaries)
  const blueprintOutline = blueprint.sections
    .map((section) => {
      const subs = section.subsections
        .map((sub) => `- [${sub.timestamp}] ${sub.title}`)
        .join("\n")
      return `Section: ${section.title}\n${subs}`
    })
    .join("\n\n")

  // Create detailed context for each subsection (for AI reference only)
  const detailedContext = blueprint.sections
    .map((section) => {
      return section.subsections
        .map((sub) => {
          return `Timestamp ${sub.timestamp} (${sub.title}): ${sub.summary}`
        })
        .join("\n")
    })
    .join("\n\n")

  return [
    "ROLE",
    "- You are a knowledgeable professor helping a student understand the current lecture.",
    "",
    "OBJECTIVE",
    "- Answer the student's questions using ONLY the lecture blueprint below as ground truth.",
    "",
    "GROUND TRUTH POLICY",
    "- If the blueprint does not contain enough information to answer, say so and ask a clarifying question.",
    "- Do not invent topics, claims, or timestamps that are not supported by the blueprint.",
    "- Use the detailed context provided below each timestamp to understand what was covered in that part of the lecture.",
    "",
    "CITATIONS / TIMESTAMPS",
    "- When referencing a specific part of the lecture, ALWAYS include a clickable timestamp in HH:MM:SS format.",
    "- The timestamp must appear verbatim in your response, e.g. 00:12:34.",
    "- Use the detailed context to provide comprehensive explanations based on what was actually covered.",
    "",
    "LECTURE BLUEPRINT",
    blueprintOutline,
    "",
    "DETAILED LECTURE CONTEXT",
    "Use this context to understand what was covered at each timestamp. This provides the foundation for your responses:",
    "",
    detailedContext,
    "",
    "IMPORTANT: The blueprint above shows the structure and timestamps. The detailed context below provides the actual content covered at each timestamp. Use both together to give accurate, context-aware responses that reference the exact content discussed in the lecture.",
  ].join("\n")
}

export async function POST(req: Request) {
  const {
    messages,
    blueprint,
  }: { messages: UIMessage[]; blueprint?: Blueprint } = await req.json()

  const trimmedUiMessages = messages.length > 4 ? messages.slice(-3) : messages

  // Handle case where no blueprint is provided
  let system: string
  if (!blueprint || !blueprint.sections || !Array.isArray(blueprint.sections)) {
    console.log("[chat] No blueprint provided, using default system message")
    system = [
      "ROLE",
      "- You are a knowledgeable professor helping a student understand the current lecture.",
      "",
      "OBJECTIVE",
      "- Answer the student's questions to the best of your ability.",
      "",
      "GROUND TRUTH POLICY",
      "- If you do not have enough information to answer, say so and ask a clarifying question.",
      "- Do not invent topics, claims, or timestamps that are not supported by the available information.",
      "",
      "CITATIONS / TIMESTAMPS",
      "- When referencing a specific part of the lecture, ALWAYS include a clickable timestamp in HH:MM:SS format.",
      "- The timestamp must appear verbatim in your response, e.g. 00:12:34.",
      "- Only provide timestamps if you have access to the lecture content.",
    ].join("\n")
  } else {
    system = blueprintToSystemMessage(blueprint)
  }
  const fullModelMessages = await convertToModelMessages(messages)
  const modelMessages =
    trimmedUiMessages === messages
      ? fullModelMessages
      : await convertToModelMessages(trimmedUiMessages)

  // Debug logging for exactly what we send to the LLM + approximate token counts.
  if (process.env.NODE_ENV !== "production") {
    const systemTokens = approxTokens(system)
    const fullPerMessage = fullModelMessages.map((m: any, idx: number) => {
      const content =
        typeof m.content === "string" ? m.content : JSON.stringify(m.content)

      return {
        index: idx,
        role: m.role,
        approxTokens: approxTokens(content),
      }
    })
    const fullTotalTokens =
      systemTokens + fullPerMessage.reduce((sum: number, m) => sum + m.approxTokens, 0)

    const perMessage = modelMessages.map((m: any, idx: number) => {
      const content =
        typeof m.content === "string" ? m.content : JSON.stringify(m.content)

      return {
        index: idx,
        role: m.role,
        approxTokens: approxTokens(content),
      }
    })
    const totalTokens =
      systemTokens + perMessage.reduce((sum: number, m) => sum + m.approxTokens, 0)

    console.log("[chat] uiMessages.count:", messages.length)
    console.log("[chat] uiMessages.trimmedCount:", trimmedUiMessages.length)
    console.log("[chat] approxTokens.total.full:", fullTotalTokens)
    console.log("[chat] approxTokens.total.trimmed:", totalTokens)
    console.log(
      "[chat] approxTokens.total.saved:",
      fullTotalTokens - totalTokens,
    )

    console.log("[chat] LLM payload.system:\n" + stringifyForLog(system))
    console.log(
      "[chat] LLM payload.messages:\n" + stringifyForLog(modelMessages),
    )
    console.log("[chat] approxTokens.system:", systemTokens)
    console.log("[chat] approxTokens.perMessage:", perMessage)
    console.log("[chat] approxTokens.total:", totalTokens)
  }

  // Validate API key before proceeding
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("[chat] GOOGLE_GENERATIVE_AI_API_KEY is missing")
    return new Response(
      JSON.stringify({ error: "Google Generative AI API key is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system,
    messages: modelMessages,
  })

  return result.toUIMessageStreamResponse()
}