'use server';

/**
 * @fileOverview Implements a medical Q&A flow using a general doctor chatbot.
 *
 * - medicalQA - A function that processes medical questions and returns answers with sources.
 * - MedicalQAInput - The input type for the medicalQA function.
 * - MedicalQAOutput - The return type for the medicalQA function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const MedicalQAInputSchema = z.object({
  question: z.string().describe('The medical question to answer.'),
});

export type MedicalQAInput = z.infer<typeof MedicalQAInputSchema>;

const MedicalQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, as provided by the doctor chatbot.'),
  sources: z.array(z.string()).describe('A list of sources used to formulate the answer.'),
});

export type MedicalQAOutput = z.infer<typeof MedicalQAOutputSchema>;

export async function medicalQA(input: MedicalQAInput): Promise<MedicalQAOutput> {
  return medicalQAFlow(input);
}

const medicalQAPrompt = ai.definePrompt({
  name: 'medicalQAPrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The medical question to answer.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The answer to the question, as provided by the doctor chatbot.'),
      sources: z.array(z.string()).describe('A list of sources used to formulate the answer.'),
    }),
  },
  prompt: `You are a helpful and informative doctor chatbot. A user will ask you a medical question, and you should provide a clear and concise answer. Include a list of sources that you used to formulate your answer.

Question: {{{question}}}

Answer:`,
});

const medicalQAFlow = ai.defineFlow<
  typeof MedicalQAInputSchema,
  typeof MedicalQAOutputSchema
>(
  {
    name: 'medicalQAFlow',
    inputSchema: MedicalQAInputSchema,
    outputSchema: MedicalQAOutputSchema,
  },
  async input => {
    const {output} = await medicalQAPrompt(input);
    return output!;
  }
);
