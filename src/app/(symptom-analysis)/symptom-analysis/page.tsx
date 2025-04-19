'use client';

import {useState} from 'react';
import {analyzeSymptoms} from '@/ai/flows/ai-symptom-analyzer';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Textarea} from '@/components/ui/textarea';
import Link from 'next/link';
import {cn} from '@/lib/utils';

export default function SymptomAnalysisPage() {
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await analyzeSymptoms({symptoms, medicalHistory, allergies});
      setResults(data);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setResults({
        conditions: [
          {
            condition: 'Error',
            confidence: 1,
            recommendations: 'Failed to analyze symptoms. Please try again.',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Card className="w-full max-w-lg mx-auto hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <CardHeader>
              <CardTitle>AI Symptom Analyzer</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="symptoms">Symptoms</label>
                <Textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="Enter your symptoms (e.g., fever, cough, fatigue)"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="medicalHistory">Medical History</label>
                <Textarea
                  id="medicalHistory"
                  value={medicalHistory}
                  onChange={e => setMedicalHistory(e.target.value)}
                  placeholder="Enter your medical history"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="allergies">Allergies</label>
                <Textarea
                  id="allergies"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="Enter your allergies"
                />
              </div>
              <Button
                className="transition-colors duration-300 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md py-2 px-4 font-semibold"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
              </Button>

              {results && results.conditions && (
                <div className="mt-4">
                  <Alert
                    variant="destructive"
                    className="bg-red-100 border border-red-500 text-red-700 rounded-md p-4"
                  >
                    <AlertTitle>AI Analysis</AlertTitle>
                    <AlertDescription>
                      This information is AI-generated and should not be
                      considered a substitute for professional medical advice.
                    </AlertDescription>
                  </Alert>
                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Potential Conditions:
                  </h3>
                  <ul>
                    {results.conditions.map((condition: any, index: number) => (
                      <li
                        key={index}
                        className="mb-2 p-4 rounded-md shadow-sm bg-card"
                      >
                        <strong>{condition.condition}</strong> (Confidence:{' '}
                        {Math.round(condition.confidence * 100)}%)
                        <p>Recommendations: {condition.recommendations}</p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/treatment-recommendations?symptoms=${encodeURIComponent(
                      symptoms
                    )}`}
                  >
                    <Button
                      variant="secondary"
                      className="transition-colors duration-300 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md py-2 px-4 font-semibold"
                    >
                      Get Treatment Recommendations
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
