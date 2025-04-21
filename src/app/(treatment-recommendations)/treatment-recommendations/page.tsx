"use client";

import React, { useState, useEffect } from "react";
import { treatmentAdvisor } from "@/ai/flows/ai-treatment-advisor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Pill,
  AlertTriangle,
  Activity,
  Award,
  ArrowLeft,
  User,
  RotateCcw,
  Ruler,
  Scale,
  Clock,
  ThumbsUp,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import AnimatedBubbles from "@/components/AnimatedBubbles";

export default function TreatmentAdvisor() {
  const searchParams = useSearchParams();
  const symptomsFromParams = searchParams.get("symptoms") || "";
  const medicalHistoryFromParams = searchParams.get("medicalHistory") || "";
  const allergiesFromParams = searchParams.get("allergies") || "";

  const [symptoms, setSymptoms] = useState(symptomsFromParams);
  const [medicalHistory, setMedicalHistory] = useState(
    medicalHistoryFromParams
  );
  const [allergies, setAllergies] = useState(allergiesFromParams);
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [prescription, setPrescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [medicationLinks, setMedicationLinks] = useState<
    {
      name: string;
      apolloUrl: string;
      medplusUrl: string;
      netmedsUrl: string;
    }[]
  >([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (symptomsFromParams) {
      setSymptoms(symptomsFromParams);
    }
    if (medicalHistoryFromParams) {
      setMedicalHistory(medicalHistoryFromParams);
    }
    if (allergiesFromParams) {
      setAllergies(allergiesFromParams);
    }
  }, [symptomsFromParams, medicalHistoryFromParams, allergiesFromParams]);

  // Extract medications from prescription text
  const extractMedications = (text: string) => {
    // Common medication names to look for
    const commonMeds = [
      "acetaminophen",
      "paracetamol",
      "ibuprofen",
      "aspirin",
      "diphenhydramine",
      "loratadine",
      "cetirizine",
      "pseudoephedrine",
      "guaifenesin",
      "dextromethorphan",
      "amoxicillin",
      "azithromycin",
      "omeprazole",
      "ranitidine",
      "famotidine",
      "simvastatin",
      "atorvastatin",
      "lisinopril",
      "metformin",
      "albuterol",
      "fluticasone",
      "prednisone",
      "metoprolol",
      "amlodipine",
      "losartan",
      "fluoxetine",
      "sertraline",
      "citalopram",
      "escitalopram",
      "bupropion",
      "advil",
      "tylenol",
      "motrin",
      "benadryl",
      "zyrtec",
      "claritin",
      "pepto-bismol",
      "tums",
      "prilosec",
      "nexium",
      "zantac",
    ];

    const foundMeds: { name: string; url: string }[] = [];

    // Search for medication names in the text
    commonMeds.forEach((med) => {
      // Use a word boundary regex to find whole words only
      const regex = new RegExp(`\\b${med}\\b`, "i");
      if (regex.test(text.toLowerCase())) {
        // Get Indian pharmacy links
        foundMeds.push({
          name: med.charAt(0).toUpperCase() + med.slice(1),
          // Provide links to Indian pharmacy chains
          apolloUrl: `https://www.apollopharmacy.in/search-medicines/${med}`,
          medplusUrl: `https://www.medplusmart.com/search/product?text=${med}`,
          netmedsUrl: `https://www.netmeds.com/catalogsearch/result/${med}/all`,
        });
      }
    });

    // Check for common medication patterns (text followed by dosage)
    const medPatterns = text.match(/\*\*(.*?)\*\*\s+\d+mg/g) || [];
    medPatterns.forEach((match) => {
      const medName = match.replace(/\*\*/g, "").trim().split(/\s+/)[0];
      if (medName && !commonMeds.includes(medName.toLowerCase())) {
        foundMeds.push({
          name: medName.charAt(0).toUpperCase() + medName.slice(1),
          // Provide links to Indian pharmacy chains
          apolloUrl: `https://www.apollopharmacy.in/search-medicines/${encodeURIComponent(
            medName
          )}`,
          medplusUrl: `https://www.medplusmart.com/search/product?text=${encodeURIComponent(
            medName
          )}`,
          netmedsUrl: `https://www.netmeds.com/catalogsearch/result/${encodeURIComponent(
            medName
          )}/all`,
        });
      }
    });

    return [
      ...new Map(
        foundMeds.map((med) => [med.name.toLowerCase(), med])
      ).values(),
    ];
  };

  // Format text with markdown-style syntax
  const formatText = (text: string) => {
    // Format for Medication Type heading
    if (text.match(/^([A-Za-z\s]+)(\(.+\)):?$/)) {
      const medType = text.match(/^([A-Za-z\s]+)(\(.+\)):?$/)?.[1] || "";
      const description = text.match(/^([A-Za-z\s]+)(\(.+\)):?$/)?.[2] || "";

      // Determine color based on content
      const colorClass =
        text.toLowerCase().includes("diagnosis") ||
        text.toLowerCase().includes("test") ||
        text.toLowerCase().includes("severe") ||
        text.toLowerCase().includes("warning")
          ? "heading-red"
          : "heading-blue";

      return `<div class="med-type ${colorClass}">${medType}${description}</div>`;
    }

    // Format for "Medication Name:" subheading
    if (text.match(/^\s*Medication Name:$/i)) {
      return `<div class="med-name-heading">Medication Name:</div>`;
    }

    // Format for hyphen list items (- xyz) with different colors
    if (text.match(/^\s*-\s+(.+)$/)) {
      const item = text.match(/^\s*-\s+(.+)$/)?.[1] || "";

      // Alternate colors for medications
      let itemColorClass = "";
      if (
        item.toLowerCase().includes("severe") ||
        item.toLowerCase().includes("warning")
      ) {
        itemColorClass = "med-item-red";
      } else if (
        item.toLowerCase().includes("mild") ||
        item.toLowerCase().includes("moderate")
      ) {
        itemColorClass = "med-item-blue";
      } else {
        // Cycle through colors based on content
        const firstChar = item.charAt(0).toLowerCase();
        if (["a", "e", "i", "o", "u"].includes(firstChar)) {
          itemColorClass = "med-item-red";
        } else if (["b", "c", "d", "f", "g"].includes(firstChar)) {
          itemColorClass = "med-item-blue";
        } else {
          itemColorClass = "med-item-teal";
        }
      }

      return `<div class="med-bullet-item">
        <span class="med-bullet">-</span>
        <span class="med-bullet-content ${itemColorClass}">${item}</span>
      </div>`;
    }

    // Handle numbered list items
    if (text.match(/^\d+\.\s+(.+)$/)) {
      const num = text.match(/^\d+\./)?.[0] || "";
      const content = text.match(/^\d+\.\s+(.+)$/)?.[1] || "";

      return `<div class="med-list-item">
        <span class="med-number">${num}</span>
        <span class="med-content">${content}</span>
      </div>`;
    }

    // Handle asterisk lines as details
    if (text.match(/^\*\s+([A-Za-z]+):(.*)$/)) {
      const detailName = text.match(/^\*\s+([A-Za-z]+):/)?.[1] || "";
      const detailValue = text.match(/^\*\s+[A-Za-z]+:(.*)$/)?.[1] || "";

      return `<div class="med-detail">
        <span class="detail-label">${detailName}:</span>
        <span class="detail-text">${detailValue}</span>
      </div>`;
    }

    // Then handle general text replacements
    let formatted = text;

    // Replace **text:** with colored headings (if not already handled)
    formatted = formatted.replace(
      /\*\*(.*?):\*\*/g,
      '<span class="heading">$1:</span>'
    );

    // Replace remaining **text** with bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    return formatted;
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await treatmentAdvisor({
        symptoms,
        medicalHistory,
        allergies,
        age: parseInt(age),
        height,
        weight,
        isAnonymous,
      });
      setPrescription(data);

      // Extract medications from the prescription
      const medications = extractMedications(data.prescription);
      setMedicationLinks(medications);
    } catch (error) {
      console.error("Error getting treatment recommendations:", error);
      setPrescription({
        prescription:
          "Failed to get treatment recommendations. Please try again.",
        confidenceLevel: 0,
        disclaimer: "An error occurred while processing your request.",
      });
      setMedicationLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (level: number) => {
    if (level > 0.75) return "text-green-500";
    if (level > 0.5) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Animated background effect */}
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
                <Pill className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
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
              AI Treatment Advisor
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Get personalized treatment recommendations based on your health
              profile and symptoms.
            </p>
          </div>

          {/* Main Content */}
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
                    <Textarea
                  id="symptoms"
                  value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Enter your symptoms"
                      className="min-h-[120px] bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] p-4"
                />
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
                      className="min-h-[100px] bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] p-4"
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
                      className="min-h-[100px] bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] p-4"
                />
              </div>

                  {/* Personal Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 35"
                        className="mt-1 bg-black/20 border-white/10 focus:border-[#FFD700]"
                />
              </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 175 cm"
                        className="mt-1 bg-black/20 border-white/10 focus:border-[#FFD700]"
                />
              </div>
                    <div>
                      <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g. 70 kg"
                        className="mt-1 bg-black/20 border-white/10 focus:border-[#FFD700]"
                      />
                    </div>
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
                      onClick={handleGetRecommendations}
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
                          Getting Recommendations...
                        </>
                      ) : (
                        <>
                          <Pill className="h-5 w-5" />
                          Get Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel (conditionally rendered) */}
            <div>
              {!prescription && (
                <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center py-12">
                  <Pill className="h-16 w-16 text-[#FFD700]/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                    Treatment Recommendations
                  </h3>
                  <p className="text-foreground/60 max-w-md mx-auto">
                    Submit your information to receive AI-generated treatment
                    recommendations tailored to your health profile.
                  </p>
                </div>
              )}

              {prescription && (
                <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl opacity-70"></div>

                  <div className="relative">
                    <h3 className="text-xl font-bold mb-4 flex items-center bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                      <Pill className="h-5 w-5 text-[#FFD700] mr-2" />
                      Treatment Recommendations
                    </h3>

                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-400">
                            Medical Disclaimer
                          </p>
                          <p className="text-xs text-red-300/80">
                            {prescription.disclaimer ||
                              "This information is AI-generated and should not be considered a substitute for professional medical advice."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-foreground/70">
                            Confidence Level:
                          </span>
                          <div
                            className={`text-xs px-2 py-1 rounded-full bg-primary/20 ${getConfidenceColor(
                              prescription.confidenceLevel
                            )}`}
                          >
                            {Math.round(prescription.confidenceLevel * 100)}%
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${
                              prescription.confidenceLevel > 0.75
                                ? "bg-green-500"
                                : prescription.confidenceLevel > 0.5
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.round(
                                prescription.confidenceLevel * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 border border-primary/20 hover:bg-white/10 transition-colors">
                      <h4 className="text-lg font-semibold mb-4 text-[#FFD700] bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                        Recommended Treatment
                      </h4>
                      <div className="prose prose-invert max-w-none">
                        <div className="text-foreground/90 space-y-3 treatment-recommendations">
                          {prescription.prescription
                            .split("\n\n")
                            .map((paragraph, i) => (
                              <p
                                key={i}
                                className="my-2 leading-relaxed text-justify"
                              >
                                {paragraph.split("\n").map((line, j, arr) => (
                                  <React.Fragment key={j}>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: formatText(line),
                                      }}
                                      className="leading-relaxed"
                                    />
                                    {j < arr.length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </p>
                            ))}
                        </div>
                      </div>

                      {/* Medication Purchase Options */}
                      {medicationLinks.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                          <h4 className="text-lg font-semibold mb-4 text-[#FFD700] flex items-center bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Purchase Medications Online
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {medicationLinks.map((med, index) => (
                              <div
                                key={index}
                                className="bg-white/5 rounded-lg border border-primary/20 p-3"
                              >
                                <div className="font-medium text-[#FFD700] mb-2 flex items-center">
                                  <Pill className="h-4 w-4 mr-2" />
                                  {med.name}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <a
                                    href={med.apolloUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <span className="flex-1 text-sm">
                                      Apollo
                                    </span>
                                    <ExternalLink className="h-3 w-3 text-primary/50" />
                                  </a>
                                  <a
                                    href={med.medplusUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <span className="flex-1 text-sm">
                                      MedPlus
                                    </span>
                                    <ExternalLink className="h-3 w-3 text-primary/50" />
                                  </a>
                                  <a
                                    href={med.netmedsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <span className="flex-1 text-sm">
                                      NetMeds
                                    </span>
                                    <ExternalLink className="h-3 w-3 text-primary/50" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-foreground/50 mt-2">
                            * Medication links are provided for convenience.
                            Always consult with a healthcare professional before
                            purchasing or taking any medication.
                          </p>
                        </div>
                      )}

                      <style jsx global>{`
                        .dark-input,
                        .force-dark-input {
                          background-color: rgba(0, 0, 0, 0.2) !important;
                          border-color: rgba(255, 255, 255, 0.1) !important;
                          color: var(--foreground) !important;
                          padding: 1rem !important;
                          border-radius: 0.75rem !important;
                          transition: all 0.2s ease-in-out !important;
                          appearance: none !important;
                          -webkit-appearance: none !important;
                          -moz-appearance: textfield !important;
                        }

                        /* Light mode styles for inputs */
                        :root[class~="light"] .dark-input,
                        :root[class~="light"] .force-dark-input {
                          background-color: white !important;
                          border-color: rgba(0, 0, 0, 0.1) !important;
                          color: #111827 !important;
                          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
                        }

                        :root[class~="light"] textarea.dark-input,
                        :root[class~="light"] textarea.force-dark-input {
                          background-color: white !important;
                        }

                        :root[class~="light"] .dark-input::placeholder,
                        :root[class~="light"] .force-dark-input::placeholder {
                          color: rgba(107, 114, 128, 0.7) !important;
                        }

                        :root[class~="light"] .dark-input:focus,
                        :root[class~="light"] .force-dark-input:focus {
                          border-color: hsl(var(--primary)) !important;
                          box-shadow: 0 0 0 2px rgba(77, 224, 193, 0.2) !important;
                          background-color: white !important;
                        }

                        /* Remove spinners from number inputs */
                        .force-dark-input::-webkit-outer-spin-button,
                        .force-dark-input::-webkit-inner-spin-button {
                          -webkit-appearance: none !important;
                          margin: 0 !important;
                        }

                        .dark-input::placeholder,
                        .force-dark-input::placeholder {
                          color: rgba(255, 255, 255, 0.5) !important;
                        }

                        .dark-input:focus,
                        .force-dark-input:focus {
                          border-color: hsl(var(--primary)) !important;
                          box-shadow: 0 0 0 1px hsl(var(--primary)) !important;
                          background-color: rgba(0, 0, 0, 0.3) !important;
                        }

                        /* Make sure inputs stay dark even on autofill */
                        input:-webkit-autofill,
                        input:-webkit-autofill:hover,
                        input:-webkit-autofill:focus,
                        input:-webkit-autofill:active {
                          transition: background-color 5000s ease-in-out 0s !important;
                          -webkit-text-fill-color: var(--foreground) !important;
                        }

                        :root[class~="light"] input:-webkit-autofill,
                        :root[class~="light"] input:-webkit-autofill:hover,
                        :root[class~="light"] input:-webkit-autofill:focus,
                        :root[class~="light"] input:-webkit-autofill:active {
                          -webkit-text-fill-color: #111827 !important;
                        }

                        .treatment-recommendations strong {
                          color: hsl(var(--primary));
                          font-weight: 600;
                        }

                        /* Light mode styles for recommendations */
                        :root[class~="light"] .treatment-recommendations {
                          color: #111827;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          strong {
                          color: #0d9488;
                        }

                        /* Different heading styles */
                        .treatment-recommendations .heading {
                          font-weight: 700;
                          font-size: 1.05em;
                          color: #4de0c1;
                          display: inline-block;
                          margin-right: 0.25rem;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .heading {
                          color: #0d9488;
                        }

                        /* Main medication type heading */
                        .treatment-recommendations .med-type {
                          font-weight: 700;
                          font-size: 1.1em;
                          margin: 2rem 0 0.5rem 0;
                          color: white;
                        }

                        .treatment-recommendations .heading-red {
                          color: #ff5a5a;
                        }

                        .treatment-recommendations .heading-blue {
                          color: #5a9bff;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .heading-red {
                          color: #dc2626;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .heading-blue {
                          color: #2563eb;
                        }

                        /* Medication name subheading */
                        .treatment-recommendations .med-name-heading {
                          color: #4de0c1;
                          font-weight: 600;
                          margin: 0.5rem 0;
                          padding-left: 1.5rem;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-name-heading {
                          color: #0d9488;
                        }

                        /* Numbered list item */
                        .treatment-recommendations .med-list-item {
                          display: flex;
                          align-items: flex-start;
                          margin: 1.25rem 0 0.5rem 0;
                        }

                        .treatment-recommendations .med-number {
                          color: #ff9580;
                          font-weight: 600;
                          margin-right: 0.5rem;
                          flex-shrink: 0;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-number {
                          color: #f97316;
                        }

                        .treatment-recommendations .med-content {
                          color: rgba(255, 255, 255, 0.9);
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-content {
                          color: #1f2937;
                        }

                        /* Bullet list item */
                        .treatment-recommendations .med-bullet-item {
                          display: flex;
                          align-items: flex-start;
                          margin: 0.25rem 0;
                          padding-left: 3rem;
                          white-space: nowrap;
                        }

                        .treatment-recommendations .med-bullet {
                          color: #4de0c1;
                          font-weight: 600;
                          margin-right: 0.75rem;
                          flex-shrink: 0;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-bullet {
                          color: #0d9488;
                        }

                        .treatment-recommendations .med-bullet-content {
                          color: rgba(255, 255, 255, 0.9);
                          white-space: normal;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-bullet-content {
                          color: #1f2937;
                        }

                        /* Medication detail */
                        .treatment-recommendations .med-detail {
                          display: flex;
                          align-items: flex-start;
                          margin: 0.3rem 0;
                          padding-left: 2.5rem;
                          white-space: nowrap;
                        }

                        .treatment-recommendations .detail-label {
                          color: #84adff;
                          font-weight: 600;
                          width: 100px;
                          flex-shrink: 0;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .detail-label {
                          color: #3b82f6;
                        }

                        .treatment-recommendations .detail-text {
                          color: rgba(255, 255, 255, 0.9);
                          white-space: normal;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .detail-text {
                          color: #1f2937;
                        }

                        /* Card styles for light mode */
                        :root[class~="light"] .bg-white\/5 {
                          background-color: rgba(255, 255, 255, 0.9) !important;
                        }

                        :root[class~="light"] .border-white\/10 {
                          border-color: rgba(0, 0, 0, 0.1) !important;
                        }

                        :root[class~="light"] .hover\:bg-white\/10:hover {
                          background-color: rgba(255, 255, 255, 1) !important;
                        }

                        :root[class~="light"] .bg-white\/5.rounded-3xl {
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                            0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                        }

                        :root[class~="light"] .text-foreground\/60,
                        :root[class~="light"] .text-foreground\/70,
                        :root[class~="light"] .text-foreground\/90 {
                          color: #374151 !important;
                        }

                        /* Patient info section */
                        .treatment-recommendations p:first-child {
                          margin-bottom: 1.5rem;
                        }

                        /* Treatment plan section */
                        .treatment-recommendations p:nth-child(2) {
                          font-size: 1.1em;
                          margin-bottom: 1rem;
                          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                          padding-bottom: 0.5rem;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          p:nth-child(2) {
                          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                        }

                        /* Follow-up and dietary sections */
                        .treatment-recommendations p:nth-last-child(-n + 2) {
                          margin-top: 1.5rem;
                          padding-top: 0.5rem;
                          border-top: 1px solid rgba(255, 255, 255, 0.1);
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          p:nth-last-child(-n + 2) {
                          border-top: 1px solid rgba(0, 0, 0, 0.1);
                        }

                        /* Colored medication items */
                        .treatment-recommendations .med-item-red {
                          color: #ff5a5a;
                        }

                        .treatment-recommendations .med-item-blue {
                          color: #5a9bff;
                        }

                        .treatment-recommendations .med-item-teal {
                          color: #4de0c1;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-item-red {
                          color: #dc2626;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-item-blue {
                          color: #2563eb;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-item-teal {
                          color: #0d9488;
                        }

                        :root[class~="light"]
                          .treatment-recommendations
                          .med-bullet-content {
                          color: #1f2937;
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
                          animation: float-animation var(--float-duration, 20s)
                            ease-in-out infinite alternate;
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
                            transform: translate(5%, 5%) rotate(5deg)
                              scale(1.05);
                          }
                          50% {
                            transform: translate(-5%, 10%) rotate(-5deg)
                              scale(0.95);
                          }
                          75% {
                            transform: translate(10%, -5%) rotate(10deg)
                              scale(1.1);
                          }
                          100% {
                            transform: translate(-10%, -10%) rotate(-10deg)
                              scale(0.9);
                          }
                        }
                      `}</style>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setPrescription(null);
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Start New Recommendation
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
