"use client";

import { useState, useRef, useEffect } from "react";
import { analyzeSymptoms } from "@/ai/flows/ai-symptom-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Mic,
  MicOff,
  Activity,
  AlertTriangle,
  Award,
  Send,
  Home,
  ArrowLeft,
  User,
  RotateCcw,
  Pill,
} from "lucide-react";
import AnimatedBubbles from "@/components/AnimatedBubbles";

export default function SymptomAnalysisPage() {
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false); // Track anonymous mode state
  const { toast } = useToast();

  // Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");
          setSymptoms(transcript);
        };
        recognition.current.onstart = () => setIsListening(true);
        recognition.current.onend = () => setIsListening(false);
        recognition.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast({
            title: "Voice Input Error",
            description: `Error occurred during voice recognition: ${event.error}`,
          });
        };
      } else {
        toast({
          title: "Voice Input Not Supported",
          description:
            "Your browser does not support voice input. Please use a supported browser like Chrome or Safari.",
        });
      }
    }
  }, [toast]);

  const handleStartStopListening = () => {
    if (!recognition.current) {
      toast({
        title: "Voice Input Not Available",
        description: "Voice input is not available in your browser.",
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await analyzeSymptoms({
        symptoms,
        medicalHistory,
        allergies,
      });
      setResults(data);
      // Simulate follow-up questions based on initial analysis
      setFollowUpQuestions([
        "Have you experienced any recent changes in your diet?",
        "Are you currently taking any medications?",
        "How would you rate your pain on a scale of 1 to 10?",
      ]);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setResults({
        conditions: [
          {
            condition: "Error",
            confidence: 1,
            recommendations: "Failed to analyze symptoms. Please try again.",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpQuestion = async (question: string) => {
    // Implement logic to handle follow-up questions and update the analysis
    setSymptoms(symptoms + ". " + question);
    handleAnalyze();
  };

  const getRiskAssessment = () => {
    if (!results || !results.conditions || results.conditions.length === 0) {
      return "Unknown";
    }
    const maxConfidence = results.conditions.reduce(
      (max: number, condition: any) => Math.max(max, condition.confidence),
      0
    );
    if (maxConfidence > 0.75) {
      return "Severe";
    } else if (maxConfidence > 0.5) {
      return "Moderate";
    } else {
      return "Mild";
    }
  };

  const getUrgencyLevel = () => {
    const riskAssessment = getRiskAssessment();
    if (riskAssessment === "Severe") {
      return "Doctor Visit Recommended";
    } else {
      return "Self-Care or Doctor Visit Optional";
    }
  };

  const getRiskColor = () => {
    const risk = getRiskAssessment();
    if (risk === "Severe") return "text-red-500";
    if (risk === "Moderate") return "text-amber-500";
    if (risk === "Mild") return "text-green-500";
    return "text-blue-500";
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Subtle background effects */}
      <div className="fixed inset-0 w-full h-full bg-dots-dark pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      {/* Animated bubbles background */}
      <AnimatedBubbles />

      {/* 3D animated background */}
      <div className="animated-bg fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="floating-shape shape5"></div>
      </div>

      {/* Header */}
      <header className="z-10 relative py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 px-8 rounded-full bg-gradient-to-r from-[#FFD700]/80 via-[#FF6B00]/80 at-60% to-[#FF3E96]/80 backdrop-blur-md border border-white/20 shadow-lg">
            <Link
              href="/"
              className="text-2xl font-bold text-white flex items-center gap-2 group"
            >
              <div className="relative h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <Brain className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </div>
              MedAi Navigator
            </Link>

            <div className="flex items-center">
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-12 relative z-0">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
              AI Symptom Analyzer
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Describe your symptoms and health information to receive
              AI-assisted insights about potential health conditions.
            </p>
          </div>

          {/* Change to a stacked layout instead of side-by-side */}
          <div className="grid grid-cols-1 gap-8">
            {/* Input Form */}
            <div>
              <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl">
                {/* Input Fields */}
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="symptoms"
                      className="text-lg font-medium flex items-center gap-2 mb-2 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent"
                    >
                      <Activity className="h-5 w-5 text-[#FFD700]" />
                      Symptoms
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Enter your symptoms (e.g., fever, cough, fatigue)"
                        className="min-h-[120px] bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] p-4 light-textarea"
                      />
                      <Button
                        variant="outline"
                        className={`absolute right-3 bottom-3 h-10 w-10 rounded-full p-0 border border-white/20 flex items-center justify-center transition-all ${
                          isListening
                            ? "bg-[#FF6B00]/20 text-[#FF6B00] border-[#FF6B00]/30"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                        onClick={handleStartStopListening}
                        disabled={!recognition.current}
                        title={
                          isListening ? "Stop voice input" : "Start voice input"
                        }
                      >
                        {isListening ? (
                          <MicOff className="h-5 w-5" />
                        ) : (
                          <Mic className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="medicalHistory"
                      className="text-lg font-medium flex items-center gap-2 mb-2 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent"
                    >
                      <Award className="h-5 w-5 text-[#FFD700]" />
                      Medical History
                    </Label>
                    <Textarea
                      id="medicalHistory"
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      placeholder="Enter your medical history"
                      className="min-h-[100px] bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] p-4 light-textarea"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="allergies"
                      className="text-lg font-medium flex items-center gap-2 mb-2 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent"
                    >
                      <AlertTriangle className="h-5 w-5 text-[#FFD700]" />
                      Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      placeholder="Enter your allergies"
                      className="min-h-[100px] bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] p-4 light-textarea"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer mr-3">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={() => setIsAnonymous(!isAnonymous)}
                          className="sr-only peer"
                          aria-label="Toggle anonymous mode"
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD700]"></div>
                      </label>
                      <span className="text-sm">Anonymous Mode</span>
                    </div>

                    <Button
                      className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] hover:from-[#FFD700]/90 hover:to-[#FF3E96]/90 text-white font-medium py-6 px-8 rounded-xl shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300 flex items-center gap-2"
                      onClick={handleAnalyze}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5" />
                          Analyze Symptoms
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel (conditionally rendered) */}
            <div>
              {!results && (
                <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center py-12">
                  <Brain className="h-16 w-16 text-[#FFD700]/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                    AI Analysis Results
                  </h3>
                  <p className="text-foreground/60 max-w-md mx-auto">
                    Submit your information to receive AI-generated insights
                    about potential health conditions.
                  </p>
                </div>
              )}

              {results && results.conditions && (
                <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl opacity-70"></div>

                  <div className="relative">
                    <h3 className="text-xl font-bold mb-4 flex items-center bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                      <Activity className="h-5 w-5 text-[#FFD700] mr-2" />
                      Analysis Results
                    </h3>

                    <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-400">
                            Medical Disclaimer
                          </p>
                          <p className="text-xs text-red-300/80">
                            This information is AI-generated and should not be
                            considered a substitute for professional medical
                            advice.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-sm text-foreground/70 block mb-1">
                          Risk Assessment:
                        </span>
                        <span
                          className={`font-medium text-lg ${getRiskColor()}`}
                        >
                          {getRiskAssessment()}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-sm text-foreground/70 block mb-1">
                          Recommended Action:
                        </span>
                        <span className="font-medium text-lg">
                          {getUrgencyLevel()}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-md font-semibold mb-3 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                      Potential Conditions:
                    </h4>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                      {results.conditions.map(
                        (condition: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-medium">
                                {condition.condition}
                              </h5>
                              <div className="text-xs px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
                                {Math.round(condition.confidence * 100)}%
                              </div>
                            </div>
                            <p className="text-sm text-foreground/70">
                              {condition.recommendations}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {followUpQuestions.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold mb-3 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                          Follow-up Questions:
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {followUpQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleFollowUpQuestion(question)}
                              className="text-left p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm flex items-center"
                            >
                              <Send className="h-3 w-3 mr-2 text-[#FFD700]" />
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setResults(null);
                            setSymptoms("");
                            setMedicalHistory("");
                            setAllergies("");
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Start New Analysis
                        </Button>

                        <Link
                          href={`/treatment-recommendations?symptoms=${encodeURIComponent(
                            symptoms
                          )}&medicalHistory=${encodeURIComponent(
                            medicalHistory
                          )}&allergies=${encodeURIComponent(allergies)}`}
                          className="w-full"
                        >
                          <Button className="w-full bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] hover:from-[#FFD700]/90 hover:to-[#FF3E96]/90">
                            <Pill className="h-4 w-4 mr-2" />
                            Get Treatment Plan
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Light mode styles for textareas */
        :root[class~="light"] .light-textarea {
          background-color: white !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
          color: #111827 !important;
        }

        :root[class~="light"] .light-textarea::placeholder {
          color: rgba(107, 114, 128, 0.7) !important;
        }

        :root[class~="light"] .light-textarea:focus {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 2px rgba(77, 224, 193, 0.2) !important;
        }

        /* Dark mode specific overrides if needed */
        :root[class~="dark"] .light-textarea {
          background-color: rgba(0, 0, 0, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        /* Light mode styles for cards and panels */
        :root[class~="light"] .bg-white\/5 {
          background-color: white !important;
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        :root[class~="light"] .border-white\/10 {
          border-color: rgba(0, 0, 0, 0.1) !important;
        }

        :root[class~="light"] .hover\:bg-white\/10:hover {
          background-color: #f9fafb !important;
        }

        :root[class~="light"] .bg-black\/20 {
          background-color: white !important;
        }

        :root[class~="light"] .text-foreground\/60,
        :root[class~="light"] .text-foreground\/70,
        :root[class~="light"] .text-foreground\/90 {
          color: #374151 !important;
        }

        /* Fix background effects in light mode */
        :root[class~="light"] .bg-dots-dark {
          opacity: 0.3;
        }

        :root[class~="light"] .from-blue-900\/10 {
          --tw-gradient-from: rgba(30, 58, 138, 0.03)
            var(--tw-gradient-from-position);
        }

        :root[class~="light"] .to-purple-900\/10 {
          --tw-gradient-to: rgba(88, 28, 135, 0.03)
            var(--tw-gradient-to-position);
        }

        /* Add shadows for better depth in light mode */
        :root[class~="light"] .backdrop-blur-sm.bg-white\/5 {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        /* Fix anonymous mode toggle in light mode */
        :root[class~="light"] .peer-checked\:bg-[#FFD700] {
          background-color: hsl(var(--yellow)) !important;
        }

        :root[class~="light"] .bg-white\/10 {
          background-color: rgba(0, 0, 0, 0.1) !important;
        }

        :root[class~="light"] .after\:bg-white.after\:border-white {
          background-color: white !important;
          border-color: rgba(0, 0, 0, 0.2) !important;
        }

        /* 3D Animated Background */
        .animated-bg {
          z-index: 0;
          opacity: 0.4;
        }

        :root[class~="light"] .animated-bg {
          opacity: 0.2;
        }

        .floating-shape {
          position: absolute;
          background: linear-gradient(
            45deg,
            var(--shape-color-1, rgba(77, 224, 193, 0.3)),
            var(--shape-color-2, rgba(90, 155, 255, 0.2))
          );
          border-radius: 50%;
          filter: blur(15px);
          animation: float-animation var(--float-duration, 20s) ease-in-out
            infinite alternate;
          transform-origin: center center;
        }

        .shape1 {
          --shape-color-1: rgba(77, 224, 193, 0.15);
          --shape-color-2: rgba(90, 155, 255, 0.1);
          --float-duration: 15s;
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape2 {
          --shape-color-1: rgba(255, 90, 90, 0.1);
          --shape-color-2: rgba(255, 149, 128, 0.15);
          --float-duration: 18s;
          width: 250px;
          height: 250px;
          top: 40%;
          right: 10%;
          animation-delay: -5s;
        }

        .shape3 {
          --shape-color-1: rgba(132, 173, 255, 0.1);
          --shape-color-2: rgba(90, 155, 255, 0.2);
          --float-duration: 16s;
          width: 200px;
          height: 200px;
          bottom: 10%;
          left: 20%;
          animation-delay: -2s;
        }

        .shape4 {
          --shape-color-1: rgba(255, 90, 90, 0.1);
          --shape-color-2: rgba(77, 224, 193, 0.15);
          --float-duration: 20s;
          width: 350px;
          height: 350px;
          top: 60%;
          right: 20%;
          animation-delay: -8s;
        }

        .shape5 {
          --shape-color-1: rgba(90, 155, 255, 0.15);
          --shape-color-2: rgba(132, 173, 255, 0.1);
          --float-duration: 25s;
          width: 400px;
          height: 400px;
          top: 30%;
          left: 30%;
          animation-delay: -12s;
        }

        @keyframes float-animation {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(5%, 5%) rotate(5deg) scale(1.05);
          }
          50% {
            transform: translate(-5%, 10%) rotate(-5deg) scale(0.95);
          }
          75% {
            transform: translate(10%, -5%) rotate(10deg) scale(1.1);
          }
          100% {
            transform: translate(-10%, -10%) rotate(-10deg) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
}
