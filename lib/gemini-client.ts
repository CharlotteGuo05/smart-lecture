import { GoogleGenerativeAI } from "@google/generative-ai"

// Use a global variable to preserve the client across hot-reloads in development
const globalForGenAI = global as unknown as {
  genai: GoogleGenerativeAI | undefined;
};

export const getGenAIClient = () => {
  if (!globalForGenAI.genai) {
    console.log("Initializing Singleton Gemini Client...");
    globalForGenAI.genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  }
  return globalForGenAI.genai;
};

export interface VideoSummary {
  sections: Section[]
}

export interface Section {
  title: string
  subsections: SubSection[]
}

export interface SubSection {
  title: string
  timestamp: string // Format: HH:MM:SS
  summary: string
}

// Validation function
function validateResponse(data: unknown): asserts data is VideoSummary {
  if (!data || typeof data !== 'object' || !('sections' in data)) {
    throw new Error("Invalid response structure: missing sections")
  }

  const sections = (data as any).sections
  if (!Array.isArray(sections)) {
    throw new Error("Invalid response structure: sections must be an array")
  }

  for (const section of sections) {
    if (!section.title || !section.subsections) {
      throw new Error("Invalid section structure: missing title or subsections")
    }

    if (!Array.isArray(section.subsections)) {
      throw new Error("Invalid subsection structure: subsections must be an array")
    }

    for (const subsection of section.subsections) {
      if (!subsection.title || !subsection.timestamp || !subsection.summary) {
        throw new Error("Invalid subsection structure: missing required fields")
      }

      // Validate timestamp format (HH:MM:SS)
      const timestampRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
      if (!timestampRegex.test(subsection.timestamp)) {
        throw new Error(`Invalid timestamp format: ${subsection.timestamp}. Expected HH:MM:SS`)
      }
    }
  }
}

// Note: The main video processing logic has been moved to app/api/process-video/route.ts
// This file now only contains the singleton client and validation functions
