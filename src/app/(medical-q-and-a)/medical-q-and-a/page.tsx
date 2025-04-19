'use client';

import {useState} from 'react';
import {medicalQA} from '@/ai/flows/medical-q-and-a-flow';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';

export default function MedicalQAPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAnswer = async () => {
    setIsLoading(true);
    try {
      const data = await medicalQA({question});
      setAnswer(data);
    } catch (error) {
      console.error('Error getting medical answer:', error);
      setAnswer({
        answer: 'Failed to get an answer. Please try again.',
        sources: [],
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
              <CardTitle>AI Medical Q&A</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="question">Ask a Medical Question</label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Enter your medical question"
                />
              </div>
              <Button
                className="transition-colors duration-300 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md py-2 px-4 font-semibold"
                onClick={handleGetAnswer}
                disabled={isLoading}
              >
                {isLoading ? 'Getting Answer...' : 'Get Answer'}
              </Button>

              {answer && (
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
                    Answer:
                  </h3>
                  <p>{answer.answer}</p>
                  {answer.sources.length > 0 && (
                    <>
                      <h4 className="text-md font-semibold mt-2 mb-1">
                        Sources:
                      </h4>
                      <ul>
                        {answer.sources.map((source: string, index: number) => (
                          <li key={index}>
                            <a href={source} target="_blank" rel="noopener noreferrer">
                              {source}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
