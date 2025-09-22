import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock, Users, Shield, Stethoscope, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">TriageAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Stethoscope className="h-4 w-4 mr-2" />
            AI-Powered Healthcare Solution
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            AI-Powered Triage Assistant for <span className="text-primary">Clinics & ERs</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Streamline patient flow, reduce overcrowding, and prioritize cases efficiently with intelligent AI
            assessment and real-time triage recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/assessment">Start Assessment</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Triage Made Simple</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system helps healthcare professionals make faster, more accurate triage decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-3/10 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-chart-3" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Emergency Detection</CardTitle>
                    <Badge variant="destructive" className="text-xs">
                      Critical
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Instantly identifies life-threatening conditions requiring immediate attention with AI-powered symptom
                  analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-2/10 rounded-lg">
                    <Clock className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Urgent Prioritization</CardTitle>
                    <Badge className="bg-chart-2 text-chart-2-foreground text-xs">Urgent</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Efficiently categorizes patients who need prompt medical attention within hours.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-1/10 rounded-lg">
                    <Users className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Routine Management</CardTitle>
                    <Badge className="bg-chart-1 text-white text-xs">Routine</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Streamlines workflow for non-urgent cases, optimizing resource allocation and patient satisfaction.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Vital Signs Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive evaluation of heart rate, blood pressure, temperature, and oxygen saturation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">HIPAA Compliant</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Secure, encrypted data handling that meets all healthcare privacy and security requirements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Specialist Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  AI suggests appropriate specialists based on symptoms and assessment results.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Ready to Transform Your Triage Process?</CardTitle>
              <CardDescription className="text-lg">
                Start using our AI-powered triage assistant today and experience faster, more accurate patient
                assessments.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/assessment">Begin Patient Assessment</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-semibold">TriageAI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 TriageAI. Built for healthcare professionals to improve patient outcomes.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
