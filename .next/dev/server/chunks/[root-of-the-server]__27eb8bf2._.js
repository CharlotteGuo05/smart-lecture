module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/gemini-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGenAIClient",
    ()=>getGenAIClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
// Use a global variable to preserve the client across hot-reloads in development
const globalForGenAI = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const getGenAIClient = ()=>{
    if (!globalForGenAI.genai) {
        console.log("Initializing Singleton Gemini Client...");
        globalForGenAI.genai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
    }
    return globalForGenAI.genai;
};
// Validation function
function validateResponse(data) {
    if (!data || typeof data !== 'object' || !('sections' in data)) {
        throw new Error("Invalid response structure: missing sections");
    }
    const sections = data.sections;
    if (!Array.isArray(sections)) {
        throw new Error("Invalid response structure: sections must be an array");
    }
    for (const section of sections){
        if (!section.title || !section.subsections) {
            throw new Error("Invalid section structure: missing title or subsections");
        }
        if (!Array.isArray(section.subsections)) {
            throw new Error("Invalid subsection structure: subsections must be an array");
        }
        for (const subsection of section.subsections){
            if (!subsection.title || !subsection.timestamp || !subsection.summary) {
                throw new Error("Invalid subsection structure: missing required fields");
            }
            // Validate timestamp format (HH:MM:SS)
            const timestampRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timestampRegex.test(subsection.timestamp)) {
                throw new Error(`Invalid timestamp format: ${subsection.timestamp}. Expected HH:MM:SS`);
            }
        }
    }
} // Note: The main video processing logic has been moved to app/api/process-video/route.ts
 // This file now only contains the singleton client and validation functions
}),
"[project]/app/api/process-video/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gemini-client.ts [app-route] (ecmascript)");
;
;
/**
 * Basic runtime check for sections/subsections/timestamp structure & MM:SS format
 */ function isValidBlueprint(obj) {
    // Enforce HH:MM:SS (e.g., 01:03:14) only
    const timestampRe = /^\d{2}:\d{2}:\d{2}$/;
    if (!obj || typeof obj !== "object" || !Array.isArray(obj.sections)) {
        return false;
    }
    for (const section of obj.sections){
        if (typeof section.title !== "string" || !Array.isArray(section.subsections)) return false;
        for (const sub of section.subsections){
            if (typeof sub.title !== "string" || typeof sub.timestamp !== "string" || !timestampRe.test(sub.timestamp) || typeof sub.summary !== "string" || sub.summary.trim().length === 0) {
                return false;
            }
        }
    }
    return true;
}
function isValidFlashcards(obj) {
    if (!Array.isArray(obj) || obj.length !== 20) return false;
    for (const card of obj){
        if (!card || typeof card !== "object") return false;
        if (typeof card.question !== "string" || card.question.trim().length === 0) return false;
        if (typeof card.answer !== "string" || card.answer.trim().length === 0) return false;
    }
    return true;
}
/**
 * Generates an LLM prompt for structured video summary.
 */ function makeLLMPrompt(youtubeUrl) {
    return `
You are an expert AI assistant that helps students navigate and learn from video lectures.
Your task is to watch and analyze the YouTube video at the URL provided below and produce:
1) a structured lecture "navigator" (blueprint)
2) 20 Quizlet-style flashcards (question/answer)

Here is the YouTube video to analyze(uploaded as a file already):
${youtubeUrl}

Your output MUST be a single valid JSON object with the following format (NO markdown, no explanations):

{
  "blueprint": {
    "sections": [
      {
        "title": "Section Example",
        "subsections": [
          { "title": "Subsection Example 1", "timestamp": "00:00:00", "summary": "3–5 sentences summarizing what is covered in this subsection." },
          { "title": "Subsection Example 2", "timestamp": "00:03:14", "summary": "3–5 sentences summarizing what is covered in this subsection." }
        ]
      }
    ]
  },
  "flashcards": [
    { "question": "Question 1", "answer": "Answer 1" }
  ]
}

Strict Instructions:
- Output ONLY valid, parsable JSON in the above shape (no markdown formatting, no comments, no extra text).
- The top-level object MUST have exactly two keys: "blueprint" and "flashcards".

Blueprint rules:
- The "blueprint" value MUST match this schema:
  { "sections": [ { "title": string, "subsections": [ { "title": string, "timestamp": string, "summary": string } ] } ] }
- Each section must have a "title" string.
- Each subsection must have BOTH a "title" and a "timestamp" string field.
- Each subsection MUST also include a "summary" string field.
- Each "summary" must be 3–5 complete sentences (plain text). It should concisely explain the key ideas, definitions, and/or example(s) covered in that subsection.
- Do not use bullet points in summaries. Do not mention that you are an AI. Do not refer to "the video"; summarize the content directly.
- All timestamps MUST be in "HH:MM:SS" (hours:minutes:seconds, zero-padded) and represent the starting point of the subsection in the video.
- Timestamp formatting MUST be strictly zero-padded to 2 digits per field:
  - 53 seconds => "00:00:53" (NOT "00:53:00")
  - 5 minutes 2 seconds => "00:05:02"
  - 1 hour 3 minutes 14 seconds => "01:03:14"
- Timestamps must be valid clock values (MM and SS must be 00–59).
- Timestamps should be monotonically increasing within the lecture timeline.
- Each section MUST have between 3 and 5 subsections. NEVER output more than 5 subsections in a section.
- If a section would naturally have more than 5 topics, MERGE adjacent small/related topics into broader subsections so it stays within the 5-subsection limit.
- Subsection titles should be short (3–8 words), concrete, and reflect what's happening at that moment (concept, derivation, example, or recap).

Flashcard rules:
- "flashcards" MUST be an array of exactly 20 items.
- Each item must be: { "question": string, "answer": string }
- Questions should be short and test understanding of the lecture.
- Answers should be concise (prefer 1–3 sentences). Use plain text only.
- Do not reference timestamps in flashcards.

- If exact timestamp is uncertain, make your most reasonable guess based on video flow.
- Do not include any non-JSON text, explanations, markdown, or notes.
`;
}
async function POST(req) {
    try {
        const body = await req.json();
        const youtubeUrl = body.videoUrl;
        if (!youtubeUrl || typeof youtubeUrl !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing videoUrl"
            }, {
                status: 400
            });
        }
        // Validate YouTube URL format
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!youtubeRegex.test(youtubeUrl)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid YouTube URL format"
            }, {
                status: 400
            });
        }
        const prompt = makeLLMPrompt(youtubeUrl);
        console.log("[process-video] Sending prompt to Gemini: ", prompt);
        const geminiClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gemini$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getGenAIClient"])();
        // Send prompt to the model
        const model = geminiClient.getGenerativeModel({
            model: "gemini-2.5-flash"
        });
        const result = await model.generateContent(prompt);
        const llmResponse = await result.response.text() || "";
        console.log("[process-video] LLM Response:", llmResponse);
        // Try to parse and validate the JSON response
        let payload = null;
        try {
            // If Gemini adds markdown code block, remove it
            const cleaned = llmResponse.replace(/^[`\s]*json\s*|[`]+$/gim, "").trim();
            payload = JSON.parse(cleaned);
        } catch (jsonErr) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Gemini response was not valid JSON",
                details: llmResponse
            }, {
                status: 422
            });
        }
        if (!payload || typeof payload !== "object") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Gemini response was not a JSON object",
                details: payload
            }, {
                status: 422
            });
        }
        const maybePayload = payload;
        const blueprint = maybePayload.blueprint;
        const flashcards = maybePayload.flashcards;
        if (!isValidBlueprint(blueprint)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "LLM response did not match expected lecture navigator schema",
                details: blueprint
            }, {
                status: 422
            });
        }
        if (!isValidFlashcards(flashcards)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "LLM response did not match expected flashcards schema",
                details: flashcards
            }, {
                status: 422
            });
        }
        const response = {
            blueprint,
            flashcards
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (err) {
        console.error("[process-video]", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal Server Error",
            details: err?.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__27eb8bf2._.js.map