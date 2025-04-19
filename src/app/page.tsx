import {SymptomAnalyzer} from '@/components/symptom-analyzer';
import {TreatmentAdvisor} from '@/components/treatment-advisor';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to HealthWise AI</h1>
      <p className="mb-4">
        Your personalized AI health companion. Get insights and recommendations
        for your health concerns.
      </p>
      <SymptomAnalyzer />
      <TreatmentAdvisor />
    </div>
  );
}
