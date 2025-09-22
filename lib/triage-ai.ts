export interface PatientData {
  age: string
  symptoms: string
  heartRate: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  temperature: string
  oxygenSaturation: string
  immediateAccess: boolean
}

export interface TriageResult {
  level: "emergency" | "urgent" | "routine"
  priority: number
  reasoning: string
  recommendations: string[]
  specialist: string
  estimatedWaitTime: string
  riskFactors: string[]
  confidence: number
}

export interface VitalSigns {
  heartRate: number
  systolicBP: number
  diastolicBP: number
  temperature: number
  oxygenSaturation: number
  age: number
}

/**
 * Mock AI Triage Logic
 * This simulates an AI model that analyzes patient data and chatbot responses
 * to determine appropriate triage levels based on medical protocols.
 *
 * In production, this would be replaced with actual AI API calls (e.g., OpenAI, Claude)
 */
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GEMINI_API_KEY } from "@/lib/gemini-api-key"

export async function getGeminiResponse(userMessage: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.")
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
You are a medical triage assistant.
User said: "${userMessage}"
Decide triage level: Emergency, Urgent, or Routine.
Provide reasoning in simple terms.
Also suggest a relevant specialist if needed.
  `

  const result = await model.generateContent(prompt)
  return result.response.text()
}
