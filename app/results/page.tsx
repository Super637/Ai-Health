"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  ArrowLeft,
  Download,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  Stethoscope,
  ClockIcon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getGeminiResponse, type PatientData, type TriageResult } from "@/lib/triage-ai"

export default function ResultsPage() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [chatbotResponses, setChatbotResponses] = useState<string[]>([])
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Load patient data
      const storedPatientData = sessionStorage.getItem("patientData")
      const storedResponses = sessionStorage.getItem("chatbotResponses")

      if (!storedPatientData) {
        router.push("/assessment")
        return
      }

      const patientInfo = JSON.parse(storedPatientData) as PatientData
      const responses = storedResponses ? (JSON.parse(storedResponses) as string[]) : []

      setPatientData(patientInfo)
      setChatbotResponses(responses)

      try {
        // Compose a prompt for Gemini using patient info and responses
        const prompt = `Patient Data: ${JSON.stringify(patientInfo)}\nUser Responses: ${responses.join(" | ")}\nBased on this information, provide a triage assessment and recommendations in JSON format matching the TriageResult interface.`
        const geminiText = await getGeminiResponse(prompt)
        // Try to parse the Gemini response as JSON, fallback if not possible
        let result: TriageResult | null = null
        try {
          // Extract JSON from Gemini response if present
          const match = geminiText.match(/\{[\s\S]*\}/)
          if (match) {
            result = JSON.parse(match[0])
          }
        } catch (e) {
          // ignore parse error, fallback below
        }
        if (!result) {
          // Fallback: use Gemini text as reasoning, fill other fields minimally
          result = {
            level: "urgent",
            priority: 2,
            reasoning: geminiText,
            recommendations: ["Seek medical evaluation within 2 hours", "Monitor symptoms closely"],
            specialist: "Internal Medicine Physician",
            estimatedWaitTime: "1-2 hours",
            riskFactors: ["Assessment incomplete"],
            confidence: 0.5,
          }
        }
        setTriageResult(result)
      } catch (error) {
        console.error("Triage assessment failed:", error)
        // Fallback to basic assessment if AI service fails
        const fallbackResult: TriageResult = {
          level: "urgent",
          priority: 2,
          reasoning: "Unable to complete full AI assessment. Defaulting to urgent care for safety.",
          recommendations: ["Seek medical evaluation within 2 hours", "Monitor symptoms closely"],
          specialist: "Internal Medicine Physician",
          estimatedWaitTime: "1-2 hours",
          riskFactors: ["Assessment incomplete"],
          confidence: 0.5,
        }
        setTriageResult(fallbackResult)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const getTriageColor = (level: string) => {
    switch (level) {
      case "emergency":
        return "text-chart-3 bg-chart-3/10 border-chart-3/20"
      case "urgent":
        return "text-chart-2 bg-chart-2/10 border-chart-2/20"
      case "routine":
        return "text-chart-1 bg-chart-1/10 border-chart-1/20"
      default:
        return "text-muted-foreground bg-muted/10 border-muted/20"
    }
  }

  const getTriageIcon = (level: string) => {
    if (patientData?.immediateAccess) {
      return <ClockIcon className="h-6 w-6" />
    }

    switch (level) {
      case "emergency":
        return <AlertTriangle className="h-6 w-6" />
      case "urgent":
        return <Clock className="h-6 w-6" />
      case "routine":
        return <CheckCircle className="h-6 w-6" />
      default:
        return <Activity className="h-6 w-6" />
    }
  }

  const handleDownloadSummary = () => {
    if (!patientData || !triageResult) return

    const summary = patientData.immediateAccess
      ? `
IMMEDIATE ACCESS REQUEST SUMMARY
===============================

Patient Information:
- Age: ${patientData.age} years
- Service Requested: ${patientData.symptoms}

REQUEST TYPE: IMMEDIATE ACCESS
Priority Level: ${triageResult.priority}
Estimated Processing Time: ${triageResult.estimatedWaitTime}
AI Confidence: ${(triageResult.confidence * 100).toFixed(1)}%

Service Details:
${triageResult.reasoning}

Next Steps:
${triageResult.recommendations.map((rec) => `- ${rec}`).join("\n")}

Assigned Provider: ${triageResult.specialist}

Service Notes:
${triageResult.riskFactors.map((note) => `- ${note}`).join("\n")}

Generated: ${new Date().toLocaleString()}
AI-Powered Triage Assistant v1.0
    `.trim()
      : `
TRIAGE ASSESSMENT SUMMARY
========================

Patient Information:
- Age: ${patientData.age} years
- Symptoms: ${patientData.symptoms}

Vital Signs:
- Heart Rate: ${patientData.heartRate} bpm
- Blood Pressure: ${patientData.bloodPressureSystolic}/${patientData.bloodPressureDiastolic} mmHg
- Temperature: ${patientData.temperature}°F
- Oxygen Saturation: ${patientData.oxygenSaturation}%

TRIAGE RESULT: ${triageResult.level.toUpperCase()}
Priority Level: ${triageResult.priority}
Estimated Wait Time: ${triageResult.estimatedWaitTime}
AI Confidence: ${(triageResult.confidence * 100).toFixed(1)}%

Reasoning:
${triageResult.reasoning}

Recommendations:
${triageResult.recommendations.map((rec) => `- ${rec}`).join("\n")}

Recommended Specialist: ${triageResult.specialist}

Risk Factors:
${triageResult.riskFactors.map((risk) => `- ${risk}`).join("\n")}

Chatbot Responses:
${chatbotResponses.map((response, index) => `${index + 1}. ${response}`).join("\n")}

Generated: ${new Date().toLocaleString()}
AI-Powered Triage Assistant v1.0
    `.trim()

    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${patientData.immediateAccess ? "immediate-access" : "triage-assessment"}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading || !patientData || !triageResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">
            {patientData?.immediateAccess ? "Processing Request" : "Processing Assessment"}
          </h2>
          <p className="text-muted-foreground">
            {patientData?.immediateAccess
              ? "Confirming your immediate access request and preparing next steps..."
              : "Our AI is analyzing the patient data and generating triage recommendations..."}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={patientData.immediateAccess ? "/assessment" : "/chatbot"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">
                {patientData.immediateAccess ? "Access Confirmation" : "Triage Results"}
              </span>
            </div>
          </div>
          <Badge variant="outline">
            <User className="h-4 w-4 mr-2" />
            {patientData.immediateAccess ? "Request Complete" : "Step 3 of 3"}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {patientData.immediateAccess ? (
          <Card className="border-2 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-6 w-6 text-amber-600" />
                  <div>
                    <CardTitle className="text-2xl text-amber-700 dark:text-amber-300">
                      Immediate Access Approved
                    </CardTitle>
                    <CardDescription className="text-base">
                      Direct access granted • {triageResult.estimatedWaitTime}
                      <Badge variant="outline" className="ml-2 border-amber-300 text-amber-700">
                        Confirmed
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
                  IMMEDIATE ACCESS
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{triageResult.reasoning}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className={`border-2 ${getTriageColor(triageResult.level)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTriageIcon(triageResult.level)}
                  <div>
                    <CardTitle className="text-2xl capitalize">{triageResult.level} Priority</CardTitle>
                    <CardDescription className="text-base">
                      Priority Level {triageResult.priority} • {triageResult.estimatedWaitTime}
                      <Badge variant="outline" className="ml-2">
                        {(triageResult.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize ${triageResult.level}`}
                  style={{ background: 'var(--triage-color)', color: '#fff', border: 'none' }}
                >
                  {triageResult.level.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{triageResult.reasoning}</p>
            </CardContent>
          </Card>
        )}

        {/* Patient Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {patientData.immediateAccess ? "Service Request Summary" : "Patient Summary"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                <p className="text-lg">{patientData.age} years</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  {patientData.immediateAccess ? "Assigned Provider" : "Recommended Specialist"}
                </Label>
                <p className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  {triageResult.specialist}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                {patientData.immediateAccess ? "Service Requested" : "Chief Complaint"}
              </Label>
              <p className="text-base leading-relaxed mt-1">{patientData.symptoms}</p>
            </div>

            {!patientData.immediateAccess && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-3 block">Vital Signs</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-chart-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="font-medium">{patientData.heartRate} bpm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-chart-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="font-medium">
                          {patientData.bloodPressureSystolic}/{patientData.bloodPressureDiastolic}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-chart-2" />
                      <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-medium">{patientData.temperature}°F</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-chart-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">O2 Saturation</p>
                        <p className="font-medium">{patientData.oxygenSaturation}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>{patientData.immediateAccess ? "Next Steps" : "Clinical Recommendations"}</CardTitle>
            <CardDescription>
              {patientData.immediateAccess
                ? "What happens next for your service request"
                : "Suggested next steps based on AI assessment"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {triageResult.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-chart-1 mt-0.5 flex-shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Risk Factors / Service Notes */}
        <Card>
          <CardHeader>
            <CardTitle>{patientData.immediateAccess ? "Service Notes" : "Assessment Factors"}</CardTitle>
            <CardDescription>
              {patientData.immediateAccess
                ? "Important information about your service request"
                : "Key factors considered in this triage decision"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {triageResult.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-chart-2 mt-0.5 flex-shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownloadSummary} variant="outline" size="lg">
            <Download className="h-4 w-4 mr-2" />
            {patientData.immediateAccess ? "Download Confirmation" : "Download Summary"}
          </Button>
          <Button asChild size="lg">
            <Link href="/assessment">
              <RefreshCw className="h-4 w-4 mr-2" />
              {patientData.immediateAccess ? "New Request" : "New Assessment"}
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
