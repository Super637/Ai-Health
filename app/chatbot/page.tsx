"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { GEMINI_API_KEY } from "@/lib/gemini-api-key"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, ArrowLeft, Bot, User, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface PatientData {
  age: string
  symptoms: string
  heartRate: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  temperature: string
  oxygenSaturation: string
  immediateAccess: boolean
}

export default function ChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const clarifyingQuestions = [
    "How long have you been experiencing these symptoms?",
    "On a scale of 1-10, how would you rate the pain or discomfort?",
    "Have you experienced these symptoms before?",
    "Are you currently taking any medications?",
    "Do you have any known allergies or medical conditions?",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load patient data from sessionStorage
    const storedData = sessionStorage.getItem("patientData")
    if (!storedData) {
      router.push("/assessment")
      return
    }

    const data = JSON.parse(storedData) as PatientData
    setPatientData(data)

    if (data.immediateAccess) {
      router.push("/results")
      return
    }

    // Initialize conversation
    const initialMessage: Message = {
      id: "1",
      type: "bot",
      content: `Hello! I'm your AI Triage Assistant. I've reviewed the patient information you provided. Let me ask a few clarifying questions to provide the most accurate assessment. ${clarifyingQuestions[0]}`,
      timestamp: new Date(),
    }

    setMessages([initialMessage])
  }, [router])

  const addMessage = (type: "user" | "bot", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = async (duration = 2000) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, duration))
    setIsTyping(false)
  }

  const generateBotResponse = async (userInput: string) => {
    await simulateTyping()

    // Use Gemini for the bot's response
    let botReply = ""
    if (currentQuestionIndex < clarifyingQuestions.length - 1) {
      // Continue with next question
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      botReply = `Thank you for that information. ${clarifyingQuestions[nextIndex]}`
    } else if (!assessmentComplete) {
      setAssessmentComplete(true)
      botReply = "Thank you for providing all the necessary information. I'm now analyzing the patient data and your responses to determine the appropriate triage level. This will take just a moment..."
      addMessage("bot", botReply)
      await simulateTyping(3000)

      // Prepare prompt for Gemini
      const responses = messages.filter((msg) => msg.type === "user").map((msg) => msg.content)
      sessionStorage.setItem("chatbotResponses", JSON.stringify(responses))

      // Compose a prompt for Gemini
      const prompt = `Patient Data: ${JSON.stringify(patientData)}\nUser Responses: ${responses.join(" | ")}\nBased on this information, provide a triage assessment and recommendations.`

      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const result = await model.generateContent(prompt)
        const geminiReply = result.response.text()
        addMessage("bot", `Assessment complete! ${geminiReply} Click the button below to view your detailed results.`)
      } catch (err) {
        addMessage("bot", "Sorry, I couldn't connect to the AI service. Please try again later.")
      }
      return
    }
    if (botReply) addMessage("bot", botReply)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const userMessage = inputValue.trim()
    setInputValue("")
    addMessage("user", userMessage)

    await generateBotResponse(userMessage)
  }

  const handleViewResults = () => {
    router.push("/results")
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading patient data...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/assessment">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">AI Assessment</span>
            </div>
          </div>
          <Badge variant="outline">
            <User className="h-4 w-4 mr-2" />
            Step 2 of 3
          </Badge>
        </div>
      </header>

      {/* Patient Summary */}
      <div className="border-b border-border bg-card/30 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-4 text-sm">
            <Badge variant="secondary">Age: {patientData.age}</Badge>
            <Badge variant="secondary">HR: {patientData.heartRate} bpm</Badge>
            <Badge variant="secondary">
              BP: {patientData.bloodPressureSystolic}/{patientData.bloodPressureDiastolic} mmHg
            </Badge>
            <Badge variant="secondary">Temp: {patientData.temperature}°F</Badge>
            <Badge variant="secondary">O2 Sat: {patientData.oxygenSaturation}%</Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 max-w-4xl h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <Card className={`${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area or Results Button */}
          {assessmentComplete && messages[messages.length - 1]?.content.includes("Assessment complete") ? (
            <div className="border-t border-border pt-4">
              <div className="flex justify-center">
                <Button onClick={handleViewResults} size="lg" className="px-8">
                  <Activity className="h-4 w-4 mr-2" />
                  View Triage Results
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border-t border-border pt-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your response..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
