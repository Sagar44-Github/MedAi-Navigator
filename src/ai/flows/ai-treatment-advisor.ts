'use server';

/**
 * @fileOverview Provides personalized treatment recommendations based on user symptoms, medical history, and allergies.
 *
 * - treatmentAdvisor - A function that generates treatment recommendations.
 * - TreatmentAdvisorInput - The input type for the treatmentAdvisor function.
 * - TreatmentAdvisorOutput - The return type for the treatmentAdvisor function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TreatmentAdvisorInputSchema = z.object({
  symptoms: z.string().describe('The user-reported symptoms.'),
  medicalHistory: z.string().describe('The user medical history.'),
  allergies: z.string().describe('The user allergies.'),
  age: z.number().describe('The user age.'),
  height: z.string().describe('The user height.'),
  weight: z.string().describe('The user weight.'),
});

export type TreatmentAdvisorInput = z.infer<typeof TreatmentAdvisorInputSchema>;

const TreatmentAdvisorOutputSchema = z.object({
  prescription: z.string().describe('The personalized treatment prescription with medication details.'),
  confidenceLevel: z.number().describe('The confidence level of the recommendations (0-1).'),
  disclaimer: z.string().describe('A disclaimer that the AI advice is not a substitute for professional medical care.'),
});

export type TreatmentAdvisorOutput = z.infer<typeof TreatmentAdvisorOutputSchema>;

export async function treatmentAdvisor(input: TreatmentAdvisorInput): Promise<TreatmentAdvisorOutput> {
  return treatmentAdvisorFlow(input);
}

const treatmentAdvisorPrompt = ai.definePrompt({
  name: 'treatmentAdvisorPrompt',
  input: {
    schema: z.object({
      symptoms: z.string().describe('The user-reported symptoms.'),
      medicalHistory: z.string().describe('The user medical history.'),
      allergies: z.string().describe('The user allergies.'),
      age: z.number().describe('The user age.'),
      height: z.string().describe('The user height.'),
      weight: z.string().describe('The user weight.'),
    }),
  },
  output: {
    schema: z.object({
      prescription: z.string().describe('The personalized treatment prescription with medication details including dosage, timing, and dietary considerations.'),
      confidenceLevel: z.number().describe('The confidence level of the recommendations (0-1).'),
      disclaimer: z.string().describe('A disclaimer that the AI advice is not a substitute for professional medical care.'),
    }),
  },
  prompt: `You are an AI treatment advisor. Based on the user's symptoms, medical history, allergies, age, height and weight, provide a detailed and personalized treatment prescription including medication names, dosages, timing (before or after food), and any dietary considerations.

Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}
Allergies: {{{allergies}}}
Age: {{{age}}}
Height: {{{height}}}
Weight: {{{weight}}}

Provide a detailed treatment prescription, a confidence level (0-1), and a disclaimer that AI advice is not a substitute for professional medical care. The prescription should resemble a real-world doctor's prescription.`,
});

const treatmentAdvisorFlow = ai.defineFlow<
  typeof TreatmentAdvisorInputSchema,
  typeof TreatmentAdvisorOutputSchema
>(
  {
    name: 'treatmentAdvisorFlow',
    inputSchema: TreatmentAdvisorInputSchema,
    outputSchema: TreatmentAdvisorOutputSchema,
  },
  async input => {
    const {output} = await treatmentAdvisorPrompt(input);
    return output!;
  }
);
