import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, BookOpen, Shield, Users, Stethoscope } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AboutPage() {
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
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">About TriageAI</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">AI-Powered Triage Assistant</CardTitle>
            <CardDescription className="text-lg">
              Revolutionizing emergency care through intelligent patient assessment and prioritization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed">
              Our AI-Powered Triage Assistant is designed to help healthcare professionals in clinics and emergency
              rooms make faster, more accurate triage decisions. By combining traditional triage protocols with advanced
              AI analysis, we provide real-time patient prioritization that can help reduce wait times, improve patient
              outcomes, and optimize resource allocation.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <Shield className="h-4 w-4 mr-2" />
                HIPAA Compliant
              </Badge>
              <Badge variant="secondary">
                <Users className="h-4 w-4 mr-2" />
                Healthcare Professional Tool
              </Badge>
              <Badge variant="secondary">
                <Stethoscope className="h-4 w-4 mr-2" />
                Evidence-Based
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Triage Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Triage Levels</CardTitle>
            <CardDescription>
              Our system uses a three-tier triage classification based on established medical protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {/* Emergency */}
              <div className="flex gap-4 p-4 rounded-lg border-2 border-chart-3/20 bg-chart-3/5">
                <AlertTriangle className="h-8 w-8 text-chart-3 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-chart-3">Emergency Priority</h3>
                    <Badge className="bg-chart-3 text-white">Level 1</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Wait Time:</strong> Immediate (0-15 minutes)
                  </p>
                  <p className="leading-relaxed">
                    Life-threatening conditions requiring immediate medical intervention. Includes critical vital signs,
                    severe trauma, cardiac events, respiratory distress, or loss of consciousness.
                  </p>
                  <div className="text-sm">
                    <strong>Examples:</strong> Chest pain, severe breathing difficulty, major trauma, stroke symptoms,
                    severe allergic reactions
                  </div>
                </div>
              </div>

              {/* Urgent */}
              <div className="flex gap-4 p-4 rounded-lg border-2 border-chart-2/20 bg-chart-2/5">
                <Clock className="h-8 w-8 text-chart-2 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-chart-2">Urgent Priority</h3>
                    <Badge className="bg-chart-2 text-black">Level 2</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Wait Time:</strong> 1-2 hours
                  </p>
                  <p className="leading-relaxed">
                    Conditions that require prompt medical attention but are not immediately life-threatening. May
                    involve abnormal vital signs, moderate pain, or concerning symptoms.
                  </p>
                  <div className="text-sm">
                    <strong>Examples:</strong> High fever, moderate pain, abnormal blood pressure, elderly patients with
                    concerning symptoms
                  </div>
                </div>
              </div>

              {/* Routine */}
              <div className="flex gap-4 p-4 rounded-lg border-2 border-chart-1/20 bg-chart-1/5">
                <CheckCircle className="h-8 w-8 text-chart-1 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-chart-1">Routine Priority</h3>
                    <Badge className="bg-chart-1 text-white">Level 3</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Wait Time:</strong> 2-4 hours or next available appointment
                  </p>
                  <p className="leading-relaxed">
                    Stable conditions with normal or near-normal vital signs. Can be managed during regular clinic hours
                    or with scheduled appointments.
                  </p>
                  <div className="text-sm">
                    <strong>Examples:</strong> Minor injuries, cold symptoms, routine check-ups, mild pain, stable
                    chronic conditions
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-World Triage Scales */}
        <Card>
          <CardHeader>
            <CardTitle>Established Triage Protocols</CardTitle>
            <CardDescription>
              Our AI system is based on internationally recognized triage scales used in healthcare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Emergency Severity Index (ESI)</h3>
                <p className="text-sm leading-relaxed mb-3">
                  Widely used in U.S. emergency departments, the ESI is a five-level triage algorithm that categorizes
                  patients based on acuity and resource needs.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• ESI Level 1: Immediate life-saving intervention</li>
                  <li>• ESI Level 2: High-risk situation, confused/lethargic</li>
                  <li>• ESI Level 3: Stable, multiple resources needed</li>
                  <li>• ESI Level 4: Stable, one resource needed</li>
                  <li>• ESI Level 5: Stable, no resources needed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Canadian Triage & Acuity Scale (CTAS)</h3>
                <p className="text-sm leading-relaxed mb-3">
                  The CTAS is a five-level triage system used across Canada that defines both urgency and complexity of
                  emergency department visits.
                </p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• CTAS 1: Resuscitation (immediate)</li>
                  <li>• CTAS 2: Emergent (15 minutes)</li>
                  <li>• CTAS 3: Urgent (30 minutes)</li>
                  <li>• CTAS 4: Less urgent (60 minutes)</li>
                  <li>• CTAS 5: Non-urgent (120 minutes)</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">How Our AI Enhances Traditional Triage</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      Reduces variability in triage decisions across different healthcare providers
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Speed</h4>
                    <p className="text-sm text-muted-foreground">
                      Accelerates the triage process while maintaining accuracy and thoroughness
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides detailed reasoning and recommendations for clinical decision-making
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Disclaimer */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Important Medical Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              <strong>
                This AI-Powered Triage Assistant is a clinical decision support tool and should not replace professional
                medical judgment.
              </strong>{" "}
              Healthcare providers should always use their clinical expertise and consider the full clinical picture
              when making triage decisions.
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Always verify AI recommendations with clinical assessment</li>
              <li>• Consider patient history and context not captured in the initial assessment</li>
              <li>• When in doubt, err on the side of higher acuity</li>
              <li>• This tool is designed to supplement, not replace, clinical judgment</li>
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/assessment">Start Patient Assessment</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
