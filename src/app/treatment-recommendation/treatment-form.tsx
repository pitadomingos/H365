"use client";

import React, { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, FileText, Stethoscope, Pill } from "lucide-react";
import type { TreatmentRecommendationInput, TreatmentRecommendationOutput } from '@/ai/flows/treatment-recommendation';
import { Separator } from '@/components/ui/separator';

const FormSchema = z.object({
  labResults: z.string().optional(),
  imagingData: z.string().optional(),
  symptoms: z.string().min(1, "Symptoms are required if other fields are empty.").optional(),
  doctorComments: z.string().optional(),
}).refine(data => data.labResults || data.imagingData || data.symptoms, {
    message: "At least one of lab results, imaging data, or symptoms must be provided.",
    path: ["symptoms"], // Attach error to a common field or a new virtual field
});

type FormValues = z.infer<typeof FormSchema>;

interface TreatmentFormProps {
  getRecommendationAction: (input: TreatmentRecommendationInput) => Promise<TreatmentRecommendationOutput | { error: string }>;
}

export function TreatmentForm({ getRecommendationAction }: TreatmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<TreatmentRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      labResults: "",
      imagingData: "",
      symptoms: "",
      doctorComments: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setError(null);
    setRecommendation(null);
    startTransition(async () => {
      const aiInput: TreatmentRecommendationInput = {
        labResults: data.labResults || "Not provided",
        imagingData: data.imagingData || "Not provided",
        symptoms: data.symptoms || "Not provided",
      };
      const result = await getRecommendationAction(aiInput);
      if ('error' in result) {
        setError(result.error);
      } else {
        setRecommendation(result);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="symptoms">Symptoms</Label>
          <Textarea
            id="symptoms"
            placeholder="e.g., Fever, cough, headache for 3 days..."
            {...form.register('symptoms')}
            className="min-h-[120px]"
          />
          {form.formState.errors.symptoms && (
            <p className="text-sm text-destructive">{form.formState.errors.symptoms.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="labResults">Lab Results</Label>
          <Textarea
            id="labResults"
            placeholder="e.g., CBC: WBC 12.5 x 10^9/L, Hb 10.2 g/dL..."
            {...form.register('labResults')}
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imagingData">Imaging Data (Text Summary)</Label>
          <Textarea
            id="imagingData"
            placeholder="e.g., Chest X-ray: Bilateral infiltrates noted. CT Scan Head: No acute abnormalities..."
            {...form.register('imagingData')}
            className="min-h-[120px]"
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Get AI Recommendation
      </Button>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendation && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" /> AI Generated Insights
            </CardTitle>
            <CardDescription>Based on the provided patient data. Please review carefully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Stethoscope className="h-5 w-5" />Potential Diagnoses</h3>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{recommendation.diagnosis || "No specific diagnosis provided."}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Pill className="h-5 w-5" />Draft Prescription</h3>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{recommendation.prescription || "No specific prescription provided."}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><FileText className="h-5 w-5" />Treatment Recommendations</h3>
              <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{recommendation.recommendations || "No specific recommendations provided."}</p>
            </div>
            <Separator />
             <div className="space-y-2 pt-4">
              <Label htmlFor="doctorComments">Doctor's Comments / Adjustments</Label>
              <Textarea
                id="doctorComments"
                placeholder="Add any comments, adjustments, or final decisions here..."
                {...form.register('doctorComments')}
                className="min-h-[100px]"
              />
              <Button variant="secondary" className="mt-2" onClick={() => alert("Comments saved (mock)")}>Save Comments</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
