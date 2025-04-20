"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Calendar,
  Contact2,
  FileText,
  Heart,
  HelpCircle,
  MapPin,
  Pill,
  Stethoscope,
  ChevronDown,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import BeatingHeart from "@/components/BeatingHeart";
import ThemeToggle from "@/components/ThemeToggle";
import ProfileModal from "@/components/ProfileModal";
import SettingsModal from "@/components/SettingsModal";
import AnimatedBubbles from "@/components/AnimatedBubbles";

const features = [
  {
    name: "Symptom Analysis",
    description:
      "AI-powered analysis of your symptoms for quick health insights",
    longDescription:
      "Our symptom analysis uses advanced AI algorithms to identify potential health conditions based on your symptoms. Get accurate insights within seconds, reference medical databases, and receive personalized recommendations tailored to your medical history.",
    icon: Brain,
    href: "/symptom-analysis",
  },
  {
    name: "Treatment Recommendations",
    description: "Personalized treatment suggestions based on your condition",
    longDescription:
      "Receive evidence-based treatment plans crafted specifically for your medical profile. Our system analyzes thousands of clinical studies, treatment protocols, and outcomes to suggest the most effective options for your specific health conditions.",
    icon: Stethoscope,
    href: "/treatment-recommendations",
  },
  {
    name: "Medication Tracking",
    description: "Smart medication reminders and adherence monitoring",
    longDescription:
      "Never miss a dose with our intelligent medication tracking system. Set personalized reminders, track medication effectiveness, monitor potential interactions, and receive refill alerts before you run out. Improve your adherence with detailed progress reports.",
    icon: Pill,
    href: "/medication-tracking",
  },
  {
    name: "Appointment Management",
    description: "Schedule and manage your medical appointments",
    longDescription:
      "Streamline your healthcare schedule with our appointment management feature. Easily book appointments with healthcare providers, receive automatic reminders, sync with your calendar, and maintain a comprehensive record of past and upcoming consultations.",
    icon: Calendar,
    href: "/appointment-management",
  },
  {
    name: "Find Medical Help",
    description: "Locate nearby hospitals, clinics, and pharmacies",
    longDescription:
      "Discover the closest healthcare facilities in moments of need. Our location-based service maps nearby hospitals, urgent care centers, specialists, and pharmacies with real-time availability information, ratings, and distance calculations.",
    icon: MapPin,
    href: "/find-medical-help",
  },
  {
    name: "Medical Q&A",
    description: "Get AI-powered answers to your medical questions",
    longDescription:
      "Have medical questions? Our AI provides accurate, evidence-based answers drawn from peer-reviewed medical journals and trusted health resources. Get instant information about conditions, treatments, procedures, and general health advice.",
    icon: HelpCircle,
    href: "/medical-q&a",
  },
  {
    name: "Health Metrics",
    description: "Track vital signs and health measurements",
    longDescription:
      "Monitor your vital health statistics with precision and insight. Track blood pressure, heart rate, blood glucose, weight, sleep patterns, and more. Visualize trends over time and receive alerts for measurements outside your normal range.",
    icon: Heart,
    href: "/health-metrics",
  },
  {
    name: "Medical Records",
    description: "Securely store and access your medical history",
    longDescription:
      "Keep your complete medical history in one secure, accessible location. Store lab results, diagnoses, medications, allergies, immunizations, and treatment history. Share specific records with healthcare providers when needed while maintaining privacy control.",
    icon: FileText,
    href: "/medical-records",
  },
  {
    name: "Emergency Contacts",
    description: "Quick access to emergency contacts and services",
    longDescription:
      "Be prepared for emergencies with instant access to your critical contacts. Store emergency contact information, medical alert details, and nearby emergency services. Includes one-touch calling and location sharing capabilities.",
    icon: Contact2,
    href: "/emergency-contacts",
  },
  {
    name: "Health Reports",
    description: "Generate comprehensive health reports",
    longDescription:
      "Create detailed health summaries that compile your medical data into clear, comprehensive reports. Perfect for doctor visits, specialist referrals, or personal health tracking. Export in multiple formats and share securely with healthcare providers.",
    icon: FileText,
    href: "/health-reports",
  },
];

// Define the color for icons (replacing with the exact gold from the gradient)
const iconColor = "#FFD700";

export default function Home() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure this only runs on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="fixed inset-0 w-full h-full bg-dots-dark pointer-events-none"></div>

      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      {/* Animated bubbles background */}
      <AnimatedBubbles />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Navbar content with glassmorphism and gold-orange-pink gradient */}
          <div className="relative flex items-center justify-between py-3 px-8 rounded-full bg-gradient-to-r from-[#FFD700]/80 via-[#FF6B00]/80 at-60% to-[#FF3E96]/80 backdrop-blur-md border border-white/20 shadow-lg">
            {/* Logo area */}
            <a
              href="/"
              className="group relative text-2xl font-bold text-white"
            >
              MedAi Navigator
            </a>

            <div className="flex items-center">
              {/* Non-functional theme toggle - hidden but preserved for layout */}
              <div className="opacity-0 invisible">
                <ThemeToggle />
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="relative group p-2 rounded-lg flex items-center text-white hover:text-white/80 transition-colors"
                aria-label="Open settings"
              >
                <SettingsIcon className="h-5 w-5" color={iconColor} />
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-300 hover:shadow-lg group"
                aria-label="Open profile"
              >
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] flex items-center justify-center overflow-hidden border-2 border-white/20">
                  <User className="h-4 w-4 text-white" />
                  {/* Profile pic would be displayed here when available */}
                </div>
                <span className="text-white group-hover:text-white/80 transition-colors text-sm hidden md:block">
                  Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Hero Section - Full Screen Landing */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-12 py-8 pt-20 relative">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
            MedAi Navigator
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-foreground/80 mb-8">
            Your intelligent AI-powered medical assistant that provides
            comprehensive healthcare guidance, tracking, and support in one
            seamless experience.
          </p>
          <a
            href="#features"
            className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] text-white px-6 py-3 text-xl font-semibold flex items-center justify-center transition duration-300 ease-in-out hover:opacity-90 rounded-full shadow-md"
          >
            Explore Features{" "}
            <ChevronDown className="ml-2 h-5 w-5" color="white" />
          </a>
          <div className="mt-24 mb-12 mx-auto w-full max-w-3xl px-8">
            <BeatingHeart />
          </div>
        </div>
      </section>

      {/* Features Section with alternating layout */}
      <section id="features" className="py-12 px-6 lg:px-12 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
            Features
          </h2>
          <div className="space-y-24">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-16 items-center mb-20`}
              >
                <div className="w-full md:w-1/2">
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                    {feature.name}
                  </h3>
                  <p className="text-xl text-foreground/80 mb-8">
                    {feature.description}
                  </p>
                  <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                    {feature.longDescription}
                  </p>
                  <ul className="space-y-2 mb-8">
                    <li className="flex items-start gap-2">
                      <span className="mt-1" style={{ color: iconColor }}>
                        •
                      </span>
                      <span>Personalized to your unique health profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1" style={{ color: iconColor }}>
                        •
                      </span>
                      <span>Backed by evidence-based medical research</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1" style={{ color: iconColor }}>
                        •
                      </span>
                      <span>
                        Continuously updated with the latest medical knowledge
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="relative p-8 rounded-3xl overflow-hidden border-l-4 border-[#FFD700] bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm shadow-lg transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full -mr-16 -mt-16 z-0"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFD700]/5 rounded-full -ml-12 -mb-12 z-0"></div>

                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center p-3 mb-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FF3E96]/5 rounded-2xl backdrop-blur-md">
                        <feature.icon className="h-16 w-16" color={iconColor} />
                      </div>

                      <h4 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                        Try {feature.name}
                      </h4>
                      <p className="text-lg text-foreground/70 mb-8 max-w-md">
                        Access our {feature.name.toLowerCase()} feature to
                        improve your healthcare experience and make more
                        informed decisions.
                      </p>

                      <Link
                        href={feature.href}
                        className="group relative inline-flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 overflow-hidden rounded-full"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#FF6B00]/20 at-60% to-[#FF3E96]/20 rounded-full transition-all duration-300 group-hover:scale-105"></span>
                        <span className="relative z-10">Try Out</span>
                        <svg
                          className="w-5 h-5 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-foreground/10 px-6 lg:px-12 relative">
        <div className="max-w-6xl mx-auto text-center text-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} MedAi Navigator. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
