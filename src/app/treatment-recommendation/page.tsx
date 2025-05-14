'use server';

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";
import { TreatmentForm } from "./treatment-form";
import { treatmentRecommendation, TreatmentRecommendationInput, TreatmentRecommendationOutput } from "@/ai/flows/treatment-recommendation";

// Server action to call the AI flow
async function getTreatmentRecommendationAction(
  input: TreatmentRecommendationInput
): Promise<TreatmentRecommendationOutput | { error: string }> {
  try {
    if (!input.symptoms && !input.labResults && !input.imagingData) {
        return { error: "Please provide at least one input: symptoms, lab results, or imaging data." };
    }
    const result = await treatmentRecommendation(input);
    return result;
  } catch (error) {
    console.error("Error in treatment recommendation flow:", error);
    return { error: "Failed to get treatment recommendation. Please try again." };
  }
}


export default async function TreatmentRecommendationPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="h-8 w-8" /> AI Treatment Recommendation
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Patient Data Input</CardTitle>
            <CardDescription>
              Enter patient's lab results, imaging data, and symptoms to receive AI-powered treatment suggestions.
              The AI will provide potential diagnoses, a draft prescription, and treatment recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TreatmentForm getRecommendationAction={getTreatmentRecommendationAction} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
