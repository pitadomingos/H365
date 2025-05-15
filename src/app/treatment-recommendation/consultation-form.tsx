
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, FileText, Stethoscope, Pill, UserCircle, Search, Thermometer, Weight, Ruler, Combine, Sigma, Edit3, Send, CheckCircle, XCircle, Home, BedDouble, ArrowRightToLine, Users2, Skull, History, HeartPulse, ShieldAlert, FileClock } from "lucide-react";
import type { TreatmentRecommendationInput, TreatmentRecommendationOutput } from '@/ai/flows/treatment-recommendation';
import { Separator } from '@/components/ui/separator';
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

const FormSchema = z.object({
  nationalIdSearch: z.string().optional(),
  bodyTemperature: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  symptoms: z.string().min(1, "Symptoms are required for AI recommendation.").optional(),
  labResultsSummary: z.string().optional(),
  imagingDataSummary: z.string().optional(),
  doctorComments: z.string().optional(),
}).refine(data => data.symptoms || data.labResultsSummary || data.imagingDataSummary, {
    message: "At least one of symptoms, lab results summary, or imaging data summary must be provided for AI recommendation.",
    path: ["symptoms"],
});

type FormValues = z.infer<typeof FormSchema>;

interface PatientData {
  nationalId: string;
  fullName: string;
  age: number;
  address: string;
  homeClinic: string;
  photoUrl: string;
  allergies: string[];
  chronicConditions: string[];
}

interface VisitHistoryItem {
  id: string;
  date: string;
  department: string;
  doctor: string;
  reason: string;
}

const mockVisitHistory: VisitHistoryItem[] = [
  { id: "v1", date: "2024-05-10", department: "Outpatient", doctor: "Dr. Smith", reason: "Annual Checkup" },
  { id: "v2", date: "2024-03-22", department: "Emergency", doctor: "Dr. Jones", reason: "Minor Laceration" },
  { id: "v3", date: "2023-11-05", department: "Specialist", doctor: "Dr. Eve", reason: "Cardiology Consult" },
  { id: "v4", date: "2023-08-15", department: "Laboratory", doctor: "N/A", reason: "Routine Blood Work" },
  { id: "v5", date: "2023-01-30", department: "Outpatient", doctor: "Dr. Smith", reason: "Flu Symptoms" },
];


interface ConsultationFormProps {
  getRecommendationAction: (input: TreatmentRecommendationInput) => Promise<TreatmentRecommendationOutput | { error: string }>;
}

export function ConsultationForm({ getRecommendationAction }: ConsultationFormProps) {
  const [isAiPending, startAiTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<TreatmentRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [bmi, setBmi] = useState<string | null>(null);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);


  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nationalIdSearch: "",
      bodyTemperature: "",
      weight: "",
      height: "",
      symptoms: "",
      labResultsSummary: "",
      imagingDataSummary: "",
      doctorComments: "",
    },
  });

  const { watch, setValue } = form;
  const weightKg = watch('weight');
  const heightCm = watch('height');

  useEffect(() => {
    const w = parseFloat(weightKg || '0');
    const h = parseFloat(heightCm || '0');
    if (w > 0 && h > 0) {
      const hM = h / 100; 
      const calculatedBmi = w / (hM * hM);
      setBmi(calculatedBmi.toFixed(2));
    } else {
      setBmi(null);
    }
  }, [weightKg, heightCm]);

  const handlePatientSearch = async () => {
    const nationalId = form.getValues("nationalIdSearch");
    if (!nationalId) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a National ID to search." });
      return;
    }
    setIsSearching(true);
    setPatientData(null);
    setRecommendation(null);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    if (nationalId === "123456789" || nationalId === "987654321") {
      setPatientData({
        nationalId: nationalId,
        fullName: nationalId === "123456789" ? "Demo Patient One" : "Jane Sample Doe",
        age: nationalId === "123456789" ? 34 : 45,
        address: "123 Health St, Wellness City",
        homeClinic: "City General Hospital",
        photoUrl: "https://placehold.co/120x120.png",
        allergies: nationalId === "123456789" ? ["Penicillin", "Dust Mites"] : ["None Reported"],
        chronicConditions: nationalId === "123456789" ? ["Asthma"] : ["Hypertension", "Type 2 Diabetes"],
      });
      toast({ title: "Patient Found", description: "Patient details loaded." });
    } else {
      toast({ variant: "destructive", title: "Not Found", description: "Patient with this National ID not found." });
    }
    setIsSearching(false);
  };

  const onAiSubmit: SubmitHandler<FormValues> = (data) => {
    if (!patientData) {
      toast({ variant: "destructive", title: "Error", description: "Please search and load patient data first." });
      return;
    }
    setError(null);
    setRecommendation(null);
    startAiTransition(async () => {
      const aiInput: TreatmentRecommendationInput = {
        symptoms: `Patient: ${patientData.fullName}, Age: ${patientData.age}. Vitals: Temp ${data.bodyTemperature || 'N/A'}°C, Weight ${data.weight || 'N/A'}kg, Height ${data.height || 'N/A'}cm, BMI ${bmi || 'N/A'}. Symptoms: ${data.symptoms || "Not specified."}`,
        labResults: data.labResultsSummary || "Not provided",
        imagingData: data.imagingDataSummary || "Not provided",
      };
      const result = await getRecommendationAction(aiInput);
      if ('error' in result) {
        setError(result.error);
      } else {
        setRecommendation(result);
      }
    });
  };
  
  const handleOutcome = (outcome: string) => {
    setIsOutcomeModalOpen(false);
    toast({ title: "Consultation Finished", description: `Outcome: ${outcome}. Action (mock): ${outcome} process initiated for ${patientData?.fullName}.` });
    if (outcome === "Send to Pharmacy" && patientData && recommendation?.prescription) {
        console.log(`Prescription for ${patientData.fullName} to be sent to pharmacy: ${recommendation.prescription}`);
    }
    // Reset form and patient data
    form.reset();
    setPatientData(null);
    setRecommendation(null);
    setError(null);
    setBmi(null);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      {/* Main Form Content Area (Spans 2 columns on lg screens) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Search for patient by National ID (e.g., 123456789 or 987654321 for demo).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                id="nationalIdSearch"
                placeholder="Enter National ID"
                {...form.register('nationalIdSearch')}
                className="max-w-xs"
              />
              <Button onClick={handlePatientSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search Patient
              </Button>
            </div>

            {patientData && (
              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start mt-4 p-4 border rounded-md bg-muted/30">
                <Image src={patientData.photoUrl} alt="Patient Photo" width={120} height={120} className="rounded-md border" data-ai-hint="patient photo" />
                <div className="space-y-1.5">
                  <h3 className="text-xl font-semibold">{patientData.fullName}</h3>
                  <p className="text-sm"><strong>National ID:</strong> {patientData.nationalId}</p>
                  <p className="text-sm"><strong>Age:</strong> {patientData.age}</p>
                  <p className="text-sm"><strong>Address:</strong> {patientData.address}</p>
                  <p className="text-sm"><strong>Home Clinic:</strong> {patientData.homeClinic}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(onAiSubmit)} className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Patient Vitals & Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="bodyTemperature" className="flex items-center"><Thermometer className="mr-1.5 h-4 w-4 text-primary" />Body Temperature (°C)</Label>
                  <Input id="bodyTemperature" placeholder="e.g., 37.5" {...form.register('bodyTemperature')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="weight" className="flex items-center"><Weight className="mr-1.5 h-4 w-4 text-primary" />Weight (kg)</Label>
                  <Input id="weight" placeholder="e.g., 70" {...form.register('weight')} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="height" className="flex items-center"><Ruler className="mr-1.5 h-4 w-4 text-primary" />Height (cm)</Label>
                  <Input id="height" placeholder="e.g., 175" {...form.register('height')} />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center"><Sigma className="mr-1.5 h-4 w-4 text-primary" />BMI (kg/m²)</Label>
                  <Input value={bmi || "N/A"} readOnly className="font-semibold bg-muted/50" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="symptoms">Symptoms / Chief Complaint <span className="text-destructive">*</span></Label>
                <Textarea
                  id="symptoms"
                  placeholder="Detailed description of patient's symptoms..."
                  {...form.register('symptoms')}
                  className="min-h-[100px]"
                />
                {form.formState.errors.symptoms && (
                  <p className="text-sm text-destructive">{form.formState.errors.symptoms.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Medical Data for AI Analysis</CardTitle>
              <CardDescription>Provide summaries of lab results and imaging data if available.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="labResultsSummary">Lab Results Summary</Label>
                <Textarea
                  id="labResultsSummary"
                  placeholder="e.g., CBC: WBC 12.5 x 10^9/L. Blood Glucose: 110 mg/dL..."
                  {...form.register('labResultsSummary')}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imagingDataSummary">Imaging Data Summary</Label>
                <Textarea
                  id="imagingDataSummary"
                  placeholder="e.g., Chest X-ray: Bilateral infiltrates. CT Brain: No acute findings..."
                  {...form.register('imagingDataSummary')}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isAiPending || !patientData} className="w-full md:w-auto">
                {isAiPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get AI Recommendation
              </Button>
            </CardFooter>
          </Card>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>AI Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendation && patientData && (
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-6 w-6 text-primary" /> AI Generated Insights for {patientData.fullName}
              </CardTitle>
              <CardDescription>Please review carefully and apply clinical judgment.</CardDescription>
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
              <div className="space-y-1">
                <Label htmlFor="doctorComments" className="flex items-center"><Edit3 className="mr-1.5 h-4 w-4 text-primary"/>Doctor's Comments / Adjustments</Label>
                <Textarea
                  id="doctorComments"
                  placeholder="Add any comments, adjustments, or final decisions here..."
                  {...form.register('doctorComments')}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2 md:flex-row md:justify-between">
              <Button variant="secondary" onClick={() => { toast({title: "Comments Saved (Mock)"})}}>Save Comments</Button>
              
              <Dialog open={isOutcomeModalOpen} onOpenChange={setIsOutcomeModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" disabled={!patientData}>
                    <Send className="mr-2 h-4 w-4" /> Finish Consultation & Select Outcome
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Consultation Outcome for {patientData?.fullName}</DialogTitle>
                    <DialogDescription>Select the appropriate next step for the patient.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-4">
                    <Button variant="outline" onClick={() => handleOutcome("Send Home")}><Home className="mr-2 h-4 w-4"/>Send Home</Button>
                    <Button variant="outline" onClick={() => handleOutcome("Send to Pharmacy")}><ArrowRightToLine className="mr-2 h-4 w-4"/>Send to Pharmacy</Button>
                    <Button variant="outline" onClick={() => handleOutcome("Send to Inpatient (Ward)")}><BedDouble className="mr-2 h-4 w-4"/>Send to Inpatient</Button>
                    <Button variant="outline" onClick={() => handleOutcome("Refer to Specialist")}><Users2 className="mr-2 h-4 w-4"/>Refer to Specialist</Button>
                    <Button variant="destructive" onClick={() => handleOutcome("Deceased")}><Skull className="mr-2 h-4 w-4"/>Deceased</Button>
                    <Button variant="ghost" onClick={() => setIsOutcomeModalOpen(false)} className="col-span-2"><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Right Panel: Patient History & Dashboard (Spans 1 column on lg screens) */}
      {patientData && (
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[calc(theme(spacing.16)_+_theme(spacing.6))]">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCircle className="h-6 w-6 text-primary" /> Patient Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong>Name:</strong> {patientData.fullName}</div>
              <div><strong>Age:</strong> {patientData.age}</div>
              <div><strong>National ID:</strong> {patientData.nationalId}</div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-destructive"/>Allergies:</h4>
                {patientData.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patientData.allergies.map(allergy => <Badge key={allergy} variant="destructive" className="text-xs">{allergy}</Badge>)}
                  </div>
                ) : <p className="text-muted-foreground">None reported.</p>}
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1.5"><HeartPulse className="h-4 w-4 text-blue-500"/>Chronic Conditions:</h4>
                {patientData.chronicConditions.length > 0 ? (
                   <div className="flex flex-wrap gap-1">
                    {patientData.chronicConditions.map(condition => <Badge key={condition} variant="secondary" className="text-xs">{condition}</Badge>)}
                  </div>
                ) : <p className="text-muted-foreground">None reported.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-6 w-6 text-primary" /> Visit History (Last 5)
              </CardTitle>
              <CardDescription>Recent encounters for this patient.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {mockVisitHistory.length > 0 ? (
                <ul className="space-y-4">
                  {mockVisitHistory.slice(0, 5).map((visit) => (
                    <li key={visit.id} className="p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold flex items-center gap-1.5"><FileClock className="h-4 w-4" />{visit.date}</p>
                        <Badge variant="outline" className="text-xs">{visit.department}</Badge>
                      </div>
                      <p className="text-xs"><strong>Doctor:</strong> {visit.doctor}</p>
                      <p className="text-xs mt-0.5"><strong>Reason:</strong> {visit.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No visit history available.</p>
              )}
            </CardContent>
            <CardFooter>
                <Button variant="link" className="p-0 h-auto text-xs" disabled>View Full History</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

