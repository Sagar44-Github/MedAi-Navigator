'use client';

import {useState} from 'react';
import {treatmentAdvisor} from '@/ai/flows/ai-treatment-advisor';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

export function TreatmentAdvisor() {
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await treatmentAdvisor({symptoms, medicalHistory, allergies});
      setRecommendations(data);
    } catch (error) {
      console.error('Error getting treatment recommendations:', error);
      setRecommendations({
        recommendations:
          'Failed to get treatment recommendations. Please try again.',
        confidenceLevel: 1,
        disclaimer: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>AI Treatment Advisor</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="symptoms">Symptoms</label>
          <Input
            id="symptoms"
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="Enter your symptoms"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="medicalHistory">Medical History</label>
          <Input
            id="medicalHistory"
            value={medicalHistory}
            onChange={e => setMedicalHistory(e.target.value)}
            placeholder="Enter your medical history"
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="allergies">Allergies</label>
          <Input
            id="allergies"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
            placeholder="Enter your allergies"
          />
        </div>
        <Button onClick={handleGetRecommendations} disabled={isLoading}>
          {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </Button>
        {recommendations && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Treatment Recommendations:
            </h3>
            <p>{recommendations.recommendations}</p>
            <p className="text-sm mt-2">
              <strong>Confidence Level:</strong>{' '}
              {Math.round(recommendations.confidenceLevel * 100)}%
            </p>
            <p className="text-xs mt-2">{recommendations.disclaimer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
