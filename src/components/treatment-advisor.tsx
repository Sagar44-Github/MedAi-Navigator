'use client';

import {useState, useEffect} from 'react';
import {treatmentAdvisor} from '@/ai/flows/ai-treatment-advisor';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useSearchParams} from 'next/navigation';

export function TreatmentAdvisor() {
  const searchParams = useSearchParams();
  const symptomsFromParams = searchParams.get('symptoms') || '';

  const [symptoms, setSymptoms] = useState(symptomsFromParams);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [prescription, setPrescription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (symptomsFromParams) {
      setSymptoms(symptomsFromParams);
    }
  }, [symptomsFromParams]);

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
      });
      setPrescription(data);
    } catch (error) {
      console.error('Error getting treatment recommendations:', error);
      setPrescription({
        prescription:
          'Failed to get treatment recommendations. Please try again.',
        confidenceLevel: 0,
        disclaimer: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
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
          <div className="grid gap-2">
            <label htmlFor="age">Age</label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="height">Height</label>
            <Input
              id="height"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="weight">Weight</label>
            <Input
              id="weight"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </div>
          <Button onClick={handleGetRecommendations} disabled={isLoading}>
            {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
          </Button>
          {prescription && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Treatment Prescription:
              </h3>
              <p>{prescription.prescription}</p>
              <p className="text-sm mt-2">
                <strong>Confidence Level:</strong>{' '}
                {Math.round(prescription.confidenceLevel * 100)}%
              </p>
              <p className="text-xs mt-2">{prescription.disclaimer}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
