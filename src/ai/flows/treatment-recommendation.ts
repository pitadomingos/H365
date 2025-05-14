// treatment-recommendation.ts
'use server';

/**
 * @fileOverview An AI agent that provides treatment recommendations based on lab results, imaging data, and symptoms.
 *
 * - treatmentRecommendation - A function that handles the treatment recommendation process.
 * - TreatmentRecommendationInput - The input type for the treatmentRecommendation function.
 * - TreatmentRecommendationOutput - The return type for the treatmentRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TreatmentRecommendationInputSchema = z.object({
  labResults: z.string().describe('The patient\'s lab results.'),
  imagingData: z.string().describe('The patient\'s imaging data.'),
  symptoms: z.string().describe('The patient\'s symptoms.'),
});
export type TreatmentRecommendationInput = z.infer<typeof TreatmentRecommendationInputSchema>;

const TreatmentRecommendationOutputSchema = z.object({
  diagnosis: z.string().describe('A ranked list of potential diagnoses.'),
  prescription: z.string().describe('A draft prescription.'),
  recommendations: z.string().describe('Treatment recommendations.'),
});
export type TreatmentRecommendationOutput = z.infer<typeof TreatmentRecommendationOutputSchema>;

export async function treatmentRecommendation(input: TreatmentRecommendationInput): Promise<TreatmentRecommendationOutput> {
  return treatmentRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'treatmentRecommendationPrompt',
  input: {schema: TreatmentRecommendationInputSchema},
  output: {schema: TreatmentRecommendationOutputSchema},
  prompt: `You are an expert medical doctor specializing in providing treatment recommendations based on lab results, imaging data, and symptoms.

You will use this information to provide a ranked list of potential diagnoses, a draft prescription, and treatment recommendations.

Lab Results: {{{labResults}}}
Imaging Data: {{{imagingData}}}
Symptoms: {{{symptoms}}}`,
});

const treatmentRecommendationFlow = ai.defineFlow(
  {
    name: 'treatmentRecommendationFlow',
    inputSchema: TreatmentRecommendationInputSchema,
    outputSchema: TreatmentRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
