import { SymptomAnalyzer } from "@/components/symptom-analyzer";

export default function SymptomAnalysisPage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            MedAi Navigator
          </a>
        </div>
      </header>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <SymptomAnalyzer />
        </div>
      </section>
    </div>
  );
}
