"use client";

import { MedicationTracker } from "@/components/medication-tracker";
import Link from "next/link";
import { Pill, User, Calendar, Bell, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBubbles from "@/components/AnimatedBubbles";

export default function MedicationTrackingPage() {
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
                <Pill className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </div>
              MedAi Navigator
            </Link>

            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
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
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div
            className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-50 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-40 left-20 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-2xl opacity-50 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
              Medication Tracker
            </h1>
            <div className="flex justify-center items-center gap-3 mb-5">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFD700]/50"></span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-[#FFD700]">
                Stay on track with your treatments
              </span>
              <span className="h-[1px] w-12 bg-gradient-to-r from-[#FF3E96]/50 to-transparent"></span>
            </div>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Track your medications, set reminders, and manage your treatment
              schedule in one place. MedAi Navigator keeps all your medication
              information organized and accessible.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Calendar className="h-5 w-5 text-[#FFD700]" />
                <span className="text-foreground/80">Schedule Management</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Bell className="h-5 w-5 text-[#FF6B00]" />
                <span className="text-foreground/80">Medication Reminders</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Pill className="h-5 w-5 text-[#FF3E96]" />
                <span className="text-foreground/80">Dosage Tracking</span>
              </div>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#FFD700]/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#FF6B00]/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#FF6B00]/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#FF3E96]/30 rounded-br-3xl"></div>

            <MedicationTracker />
          </div>
        </div>
      </section>
    </div>
  );
}
