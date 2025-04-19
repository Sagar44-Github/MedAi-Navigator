'use client';

import {useState, useRef, useEffect} from 'react';
import {analyzeSymptoms} from '@/ai/flows/ai-symptom-analyzer';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Textarea} from '@/components/ui/textarea';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {Slider} from '@/components/ui/slider';
import {Label} from '@/components/ui/label';
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
} from '@/components/ui/alert-dialog';
import {useToast} from '@/hooks/use-toast';

export default function SymptomAnalysisPage() {
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conditionLikelihood, setConditionLikelihood] = useState<number>(50); // Default value of 50%
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false); // Track anonymous mode state
  const {toast} = useToast();
  const audioRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        audioRecorder.current = new MediaRecorder(stream);
        audioRecorder.current.ondataavailable = handleDataAvailable;
        audioRecorder.current.onstop = handleStop;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings to use voice input.',
        });
      }
    };

    initializeRecorder();

    return () => {
      if (audioRecorder.current) {
        audioRecorder.current.ondataavailable = null;
        audioRecorder.current.onstop = null;
      }
    };
  }, [toast]);

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setAudioChunks(prev => [...prev, event.data]);
    }
  };

  const handleStop = () => {
    const audioBlob = new Blob(audioChunks, {type: 'audio/wav'});
    const audioUrl = URL.createObjectURL(audioBlob);
    // Here you would typically upload the audioBlob to a server
    // and transcribe it to text, then set the symptoms state.
    console.log('Audio URL:', audioUrl);
  };

  const startRecording = () => {
    if (audioRecorder.current && audioRecorder.current.state === "inactive") {
      setAudioChunks([]);
      audioRecorder.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (audioRecorder.current && audioRecorder.current.state === "recording") {
      audioRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const data = await analyzeSymptoms({symptoms, medicalHistory, allergies});
      setResults(data);
      // Simulate follow-up questions based on initial analysis
      setFollowUpQuestions([
        'Have you experienced any recent changes in your diet?',
        'Are you currently taking any medications?',
        'How would you rate your pain on a scale of 1 to 10?',
      ]);
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

  const handleFollowUpQuestion = async (question: string) => {
    // Implement logic to handle follow-up questions and update the analysis
    setSymptoms(symptoms + '. ' + question);
    handleAnalyze();
  };

  const getRiskAssessment = () => {
    if (!results || !results.conditions || results.conditions.length === 0) {
      return 'Unknown';
    }
    const maxConfidence = results.conditions.reduce((max: number, condition: any) => Math.max(max, condition.confidence), 0);
    if (maxConfidence > 0.75) {
      return 'Severe';
    } else if (maxConfidence > 0.5) {
      return 'Moderate';
    } else {
      return 'Mild';
    }
  };

  const getUrgencyLevel = () => {
    const riskAssessment = getRiskAssessment();
    if (riskAssessment === 'Severe') {
      return 'Doctor Visit Recommended';
    } else {
      return 'Self-Care or Doctor Visit Optional';
    }
  };

  const handleLikelihoodChange = (value: number[]) => {
    setConditionLikelihood(value[0]);
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
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  placeholder="Enter your symptoms (e.g., fever, cough, fatigue)"
                />
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startRecording}
                    disabled={isRecording}
                  >
                    {isRecording ? 'Recording...' : 'Start Voice Input'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopRecording}
                    disabled={!isRecording}
                  >
                    Stop Voice Input
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={medicalHistory}
                  onChange={e => setMedicalHistory(e.target.value)}
                  placeholder="Enter your medical history"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="Enter your allergies"
                />
              </div>
              <div className="mb-4">
                <Label>Condition Likelihood: {conditionLikelihood}%</Label>
                <Slider
                  defaultValue={[conditionLikelihood]}
                  max={100}
                  step={1}
                  onValueChange={handleLikelihoodChange}
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
                  {followUpQuestions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mt-2 mb-1">
                        Follow-Up Questions:
                      </h4>
                      <ul>
                        {followUpQuestions.map((question: string, index: number) => (
                          <li key={index}>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleFollowUpQuestion(question)}
                            >
                              {question}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4">
                    <p>
                      <strong>Risk Assessment:</strong> {getRiskAssessment()}
                    </p>
                    <p>
                      <strong>Urgency Level:</strong> {getUrgencyLevel()}
                    </p>
                  </div>
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
              <div className="flex items-center space-x-2 mt-4">
                <Label htmlFor="anonymousMode">Anonymous Mode</Label>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Toggle Anonymous Mode
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Anonymous Mode</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enabling anonymous mode will prevent any personal
                        information from being stored.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setIsAnonymous(!isAnonymous)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
