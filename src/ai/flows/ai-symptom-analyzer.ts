'use server';
/**
 * @fileOverview An AI Symptom Analyzer flow.
 *
 * - analyzeSymptoms - A function that analyzes user-reported symptoms and returns a list of potential conditions with confidence levels.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A comma-separated list of symptoms reported by the user (e.g., fever, cough, fatigue).'
    ),
  medicalHistory: z
    .string()
    .optional()
    .describe('The user medical history.'),
  allergies: z.string().optional().describe('The user allergies.'),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  conditions: z.array(
    z.object({
      condition: z.string().describe('The name of the potential condition.'),
      confidence: z
        .number()
        .describe(
          'The confidence level (0-1) that the symptoms match the condition.'
        ),
      recommendations: z
        .string()
        .describe('Recommended actions based on the potential condition.'),
    })
  ).describe('A prioritized list of potential conditions with confidence levels.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(input: AnalyzeSymptomsInput): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {
    schema: z.object({
      symptoms: z
        .string()
        .describe(
          'A comma-separated list of symptoms reported by the user (e.g., fever, cough, fatigue).'
        ),
      medicalHistory: z
        .string()
        .optional()
        .describe('The user medical history.'),
      allergies: z.string().optional().describe('The user allergies.'),
    }),
  },
  output: {
    schema: z.object({
      conditions: z.array(
        z.object({
          condition: z.string().describe('The name of the potential condition.'),
          confidence: z
            .number()
            .describe(
              'The confidence level (0-1) that the symptoms match the condition.'
            ),
          recommendations: z
            .string()
            .describe('Recommended actions based on the potential condition.'),
        })
      ).describe('A prioritized list of potential conditions with confidence levels.'),
    }),
  },
  prompt: `You are an AI-powered symptom analyzer. Given a list of symptoms, medical history and allergies, you will provide a prioritized list of potential medical conditions with confidence levels and recommendations.

Symptoms: {{{symptoms}}}
Medical History: {{{medicalHistory}}}
Allergies: {{{allergies}}}

Analyze the symptoms and provide a prioritized list of potential conditions. For each condition, provide a confidence level (0-1) indicating the likelihood that the symptoms match the condition. Also, provide recommendations for each condition, such as seeking medical advice or self-care.

Output the response in JSON format.`,
});

const analyzeSymptomsFlow = ai.defineFlow<
  typeof AnalyzeSymptomsInputSchema,
  typeof AnalyzeSymptomsOutputSchema
>(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
