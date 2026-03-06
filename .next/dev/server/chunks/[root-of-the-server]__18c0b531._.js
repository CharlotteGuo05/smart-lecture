module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

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
"[project]/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/google/dist/index.mjs [app-route] (ecmascript)");
;
;
const maxDuration = 30;
function approxTokens(text) {
    // Very rough heuristic widely used for English text.
    // Good enough for logging/debugging, not billing-accurate.
    return Math.ceil(text.length / 4);
}
function stringifyForLog(value, maxChars = 20_000) {
    const str = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    return str.length > maxChars ? str.slice(0, maxChars) + "\n…(truncated)" : str;
}
function blueprintToSystemMessage(blueprint) {
    // Create a structured outline for the blueprint display (without summaries)
    const blueprintOutline = blueprint.sections.map((section)=>{
        const subs = section.subsections.map((sub)=>`- [${sub.timestamp}] ${sub.title}`).join("\n");
        return `Section: ${section.title}\n${subs}`;
    }).join("\n\n");
    // Create detailed context for each subsection (for AI reference only)
    const detailedContext = blueprint.sections.map((section)=>{
        return section.subsections.map((sub)=>{
            return `Timestamp ${sub.timestamp} (${sub.title}): ${sub.summary}`;
        }).join("\n");
    }).join("\n\n");
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
        "IMPORTANT: The blueprint above shows the structure and timestamps. The detailed context below provides the actual content covered at each timestamp. Use both together to give accurate, context-aware responses that reference the exact content discussed in the lecture."
    ].join("\n");
}
async function POST(req) {
    const { messages, blueprint } = await req.json();
    const trimmedUiMessages = messages.length > 4 ? messages.slice(-3) : messages;
    // Handle case where no blueprint is provided
    let system;
    if (!blueprint || !blueprint.sections || !Array.isArray(blueprint.sections)) {
        console.log("[chat] No blueprint provided, using default system message");
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
            "- Only provide timestamps if you have access to the lecture content."
        ].join("\n");
    } else {
        system = blueprintToSystemMessage(blueprint);
    }
    const fullModelMessages = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertToModelMessages"])(messages);
    const modelMessages = trimmedUiMessages === messages ? fullModelMessages : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertToModelMessages"])(trimmedUiMessages);
    // Debug logging for exactly what we send to the LLM + approximate token counts.
    if ("TURBOPACK compile-time truthy", 1) {
        const systemTokens = approxTokens(system);
        const fullPerMessage = fullModelMessages.map((m, idx)=>{
            const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
            return {
                index: idx,
                role: m.role,
                approxTokens: approxTokens(content)
            };
        });
        const fullTotalTokens = systemTokens + fullPerMessage.reduce((sum, m)=>sum + m.approxTokens, 0);
        const perMessage = modelMessages.map((m, idx)=>{
            const content = typeof m.content === "string" ? m.content : JSON.stringify(m.content);
            return {
                index: idx,
                role: m.role,
                approxTokens: approxTokens(content)
            };
        });
        const totalTokens = systemTokens + perMessage.reduce((sum, m)=>sum + m.approxTokens, 0);
        console.log("[chat] uiMessages.count:", messages.length);
        console.log("[chat] uiMessages.trimmedCount:", trimmedUiMessages.length);
        console.log("[chat] approxTokens.total.full:", fullTotalTokens);
        console.log("[chat] approxTokens.total.trimmed:", totalTokens);
        console.log("[chat] approxTokens.total.saved:", fullTotalTokens - totalTokens);
        console.log("[chat] LLM payload.system:\n" + stringifyForLog(system));
        console.log("[chat] LLM payload.messages:\n" + stringifyForLog(modelMessages));
        console.log("[chat] approxTokens.system:", systemTokens);
        console.log("[chat] approxTokens.perMessage:", perMessage);
        console.log("[chat] approxTokens.total:", totalTokens);
    }
    // Validate API key before proceeding
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error("[chat] GOOGLE_GENERATIVE_AI_API_KEY is missing");
        return new Response(JSON.stringify({
            error: "Google Generative AI API key is required"
        }), {
            status: 400,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
        model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"])("gemini-2.5-flash"),
        system,
        messages: modelMessages
    });
    return result.toUIMessageStreamResponse();
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__18c0b531._.js.map