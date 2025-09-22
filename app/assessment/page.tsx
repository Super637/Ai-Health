"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, ArrowLeft, User, Heart, Thermometer, Droplets, Wind, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function AssessmentPage() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<PatientData>({
    age: "",
    symptoms: "",
    heartRate: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    temperature: "",
    oxygenSaturation: "",
    immediateAccess: false,
  })

  const [errors, setErrors] = useState<Partial<PatientData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof PatientData, value: string | boolean) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof Partial<PatientData>]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PatientData> = {}

    if (!patientData.age || Number.parseInt(patientData.age) < 0 || Number.parseInt(patientData.age) > 150) {
      newErrors.age = "Please enter a valid age (0-150)"
    }

    if (!patientData.symptoms.trim()) {
      newErrors.symptoms = "Please describe the patient's symptoms"
    }

    if (!patientData.immediateAccess) {
      if (
        !patientData.heartRate ||
        Number.parseInt(patientData.heartRate) < 30 ||
        Number.parseInt(patientData.heartRate) > 250
      ) {
        newErrors.heartRate = "Please enter a valid heart rate (30-250 bpm)"
      }

      if (
        !patientData.bloodPressureSystolic ||
        Number.parseInt(patientData.bloodPressureSystolic) < 60 ||
        Number.parseInt(patientData.bloodPressureSystolic) > 300
      ) {
        newErrors.bloodPressureSystolic = "Please enter valid systolic BP (60-300 mmHg)"
      }

      if (
        !patientData.bloodPressureDiastolic ||
        Number.parseInt(patientData.bloodPressureDiastolic) < 30 ||
        Number.parseInt(patientData.bloodPressureDiastolic) > 200
      ) {
        newErrors.bloodPressureDiastolic = "Please enter valid diastolic BP (30-200 mmHg)"
      }

      if (
        !patientData.temperature ||
        Number.parseFloat(patientData.temperature) < 90 ||
        Number.parseFloat(patientData.temperature) > 110
      ) {
        newErrors.temperature = "Please enter valid temperature (90-110°F)"
      }

      if (
        !patientData.oxygenSaturation ||
        Number.parseInt(patientData.oxygenSaturation) < 70 ||
        Number.parseInt(patientData.oxygenSaturation) > 100
      ) {
        newErrors.oxygenSaturation = "Please enter valid oxygen saturation (70-100%)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store patient data in sessionStorage for the chatbot
    sessionStorage.setItem("patientData", JSON.stringify(patientData))

    if (patientData.immediateAccess) {
      router.push("/results")
    } else {
      router.push("/chatbot")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Patient Assessment</span>
            </div>
          </div>
          <Badge variant="outline">
            <User className="h-4 w-4 mr-2" />
            Step 1 of 3
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Patient Information & Vitals</h1>
          <p className="text-muted-foreground text-lg">
            Please provide the patient's basic information and current vital signs for AI assessment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Patient Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Demographics
              </CardTitle>
              <CardDescription>Basic patient information for assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter patient age"
                  value={patientData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className={errors.age ? "border-destructive" : ""}
                />
                {errors.age && <p className="text-sm text-destructive mt-1">{errors.age}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Clock className="h-5 w-5" />
                Immediate Access Option
              </CardTitle>
              <CardDescription>
                For non-emergency services like vaccinations, certificates, or routine procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="immediateAccess"
                  checked={patientData.immediateAccess}
                  onCheckedChange={(checked) => handleInputChange("immediateAccess", checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="immediateAccess"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Request Immediate Access
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Skip triage queue for non-emergency needs (vaccinations, medical certificates, routine check-ups)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Chief Complaint & Symptoms</CardTitle>
              <CardDescription>Describe the patient's primary symptoms and concerns</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="symptoms">Symptoms Description *</Label>
                <Textarea
                  id="symptoms"
                  placeholder={
                    patientData.immediateAccess
                      ? "Describe the service needed (e.g., flu vaccination, medical certificate for work, routine check-up)..."
                      : "Describe the patient's symptoms, pain level, duration, and any relevant details..."
                  }
                  value={patientData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  className={`min-h-32 ${errors.symptoms ? "border-destructive" : ""}`}
                />
                {errors.symptoms && <p className="text-sm text-destructive mt-1">{errors.symptoms}</p>}
              </div>
            </CardContent>
          </Card>

          {!patientData.immediateAccess && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
                <CardDescription>Current vital sign measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Heart Rate */}
                  <div>
                    <Label htmlFor="heartRate" className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-chart-3" />
                      Heart Rate (bpm) *
                    </Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="e.g., 72"
                      value={patientData.heartRate}
                      onChange={(e) => handleInputChange("heartRate", e.target.value)}
                      className={errors.heartRate ? "border-destructive" : ""}
                    />
                    {errors.heartRate && <p className="text-sm text-destructive mt-1">{errors.heartRate}</p>}
                  </div>

                  {/* Temperature */}
                  <div>
                    <Label htmlFor="temperature" className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-chart-2" />
                      Temperature (°F) *
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 98.6"
                      value={patientData.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                      className={errors.temperature ? "border-destructive" : ""}
                    />
                    {errors.temperature && <p className="text-sm text-destructive mt-1">{errors.temperature}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Blood Pressure */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-chart-3" />
                      Blood Pressure (mmHg) *
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Systolic"
                        value={patientData.bloodPressureSystolic}
                        onChange={(e) => handleInputChange("bloodPressureSystolic", e.target.value)}
                        className={errors.bloodPressureSystolic ? "border-destructive" : ""}
                      />
                      <span className="text-muted-foreground">/</span>
                      <Input
                        type="number"
                        placeholder="Diastolic"
                        value={patientData.bloodPressureDiastolic}
                        onChange={(e) => handleInputChange("bloodPressureDiastolic", e.target.value)}
                        className={errors.bloodPressureDiastolic ? "border-destructive" : ""}
                      />
                    </div>
                    {(errors.bloodPressureSystolic || errors.bloodPressureDiastolic) && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.bloodPressureSystolic || errors.bloodPressureDiastolic}
                      </p>
                    )}
                  </div>

                  {/* Oxygen Saturation */}
                  <div>
                    <Label htmlFor="oxygenSaturation" className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-chart-1" />
                      Oxygen Saturation (%) *
                    </Label>
                    <Input
                      id="oxygenSaturation"
                      type="number"
                      placeholder="e.g., 98"
                      value={patientData.oxygenSaturation}
                      onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                      className={errors.oxygenSaturation ? "border-destructive" : ""}
                    />
                    {errors.oxygenSaturation && (
                      <p className="text-sm text-destructive mt-1">{errors.oxygenSaturation}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting} className="px-8">
              {isSubmitting ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : patientData.immediateAccess ? (
                "Request Immediate Access"
              ) : (
                "Continue to AI Assessment"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
