
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
import { Loader2, Sparkles, FileText, Stethoscope, Pill, UserCircle, Search, Thermometer, Weight, Ruler, Sigma, Edit3, Send, Home, BedDouble, ArrowRightToLine, Users2, Skull, History, HeartPulse, ShieldAlert, FileClock, FlaskConical, RadioTower, Save } from "lucide-react";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMON_ORDERABLE_LAB_TESTS, type OrderableLabTest } from '@/lib/constants';

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
  gender: "Male" | "Female" | "Other";
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

const getBmiStatusAndColor = (bmi: number | null): { status: string; colorClass: string; textColorClass: string; } => {
  if (bmi === null || isNaN(bmi)) {
    return { status: "N/A", colorClass: "bg-gray-200 dark:bg-gray-700", textColorClass: "text-gray-800 dark:text-gray-200" };
  }
  if (bmi < 18.5) {
    return { status: "Underweight", colorClass: "bg-blue-100 dark:bg-blue-800/30", textColorClass: "text-blue-700 dark:text-blue-300" };
  } else if (bmi < 25) {
    return { status: "Normal weight", colorClass: "bg-green-100 dark:bg-green-800/30", textColorClass: "text-green-700 dark:text-green-300" };
  } else if (bmi < 30) {
    return { status: "Overweight", colorClass: "bg-yellow-100 dark:bg-yellow-800/30", textColorClass: "text-yellow-700 dark:text-yellow-300" };
  } else if (bmi < 35) {
    return { status: "Obese (Class I)", colorClass: "bg-orange-100 dark:bg-orange-800/30", textColorClass: "text-orange-700 dark:text-orange-300" };
  } else if (bmi < 40) {
    return { status: "Obese (Class II)", colorClass: "bg-red-100 dark:bg-red-800/30", textColorClass: "text-red-700 dark:text-red-300" };
  } else {
    return { status: "Obese (Class III)", colorClass: "bg-red-200 dark:bg-red-900/40", textColorClass: "text-red-800 dark:text-red-200" };
  }
};


export function ConsultationForm({ getRecommendationAction }: ConsultationFormProps) {
  const [isAiPending, startAiTransition] = useTransition();
  const [recommendation, setRecommendation] = useState<TreatmentRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [bmi, setBmi] = useState<string | null>(null);
  const [bmiDisplay, setBmiDisplay] = useState<{ status: string; colorClass: string, textColorClass: string; } | null>(null);
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [isSubmittingOutcome, setIsSubmittingOutcome] = useState(false);
  
  const [selectedLabTests, setSelectedLabTests] = useState<Record<string, boolean>>({});
  const [isSubmittingLabOrder, setIsSubmittingLabOrder] = useState(false);
  const [isSubmittingImagingOrder, setIsSubmittingImagingOrder] = useState(false);
  const [isSavingProgress, setIsSavingProgress] = useState(false);


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

  const { watch } = form;
  const weightKg = watch('weight');
  const heightCm = watch('height');

  useEffect(() => {
    const w = parseFloat(weightKg || '0');
    const h = parseFloat(heightCm || '0');
    if (w > 0 && h > 0) {
      const hM = h / 100;
      const calculatedBmi = w / (hM * hM);
      setBmi(calculatedBmi.toFixed(2));
      setBmiDisplay(getBmiStatusAndColor(calculatedBmi));
    } else {
      setBmi(null);
      setBmiDisplay(getBmiStatusAndColor(null));
    }
  }, [weightKg, heightCm]);

  const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
    if (gender === "Male") return "male avatar";
    if (gender === "Female") return "female avatar";
    return "patient avatar";
  };

  const handlePatientSearch = async () => {
    const nationalId = form.getValues("nationalIdSearch");
    if (!nationalId) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a National ID to search." });
      return;
    }
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    if (nationalId === "123456789" || nationalId === "987654321") {
      const fetchedPatientData: PatientData = {
        nationalId: nationalId,
        fullName: nationalId === "123456789" ? "Demo Patient One" : "Jane Sample Doe",
        age: nationalId === "123456789" ? 34 : 45,
        gender: nationalId === "123456789" ? "Male" : "Female",
        address: "123 Health St, Wellness City",
        homeClinic: "City General Hospital",
        photoUrl: "https://placehold.co/120x120.png",
        allergies: nationalId === "123456789" ? ["Penicillin", "Dust Mites"] : ["None Reported"],
        chronicConditions: nationalId === "123456789" ? ["Asthma"] : ["Hypertension", "Type 2 Diabetes"],
      };
      setPatientData(fetchedPatientData);
      toast({ title: "Patient Found", description: `${fetchedPatientData.fullName}'s details loaded.` });
    } else {
      toast({ variant: "destructive", title: "Not Found", description: "Patient with this National ID not found." });
      setPatientData(null); // Clear patient data if not found
    }
    setRecommendation(null);
    setError(null);
    form.reset({
        nationalIdSearch: nationalId, // Keep the searched ID
        bodyTemperature: "",
        weight: "",
        height: "",
        symptoms: "",
        labResultsSummary: "",
        imagingDataSummary: "",
        doctorComments: "",
    });
    setBmi(null);
    setBmiDisplay(getBmiStatusAndColor(null));
    setSelectedLabTests({});
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
      const visitHistoryString = mockVisitHistory.slice(0, 5).map(
        visit => `Date: ${visit.date}, Dept: ${visit.department}, Doctor: ${visit.doctor}, Reason: ${visit.reason}`
      ).join('\\n');

      const comprehensiveSymptoms = `
Patient Name: ${patientData.fullName}
Patient Age: ${patientData.age}
Patient Gender: ${patientData.gender}

Vitals:
Body Temperature: ${data.bodyTemperature || 'N/A'}°C
Weight: ${data.weight || 'N/A'}kg
Height: ${data.height || 'N/A'}cm
BMI: ${bmi || 'N/A'} (${bmiDisplay?.status || 'N/A'})

Chief Complaint/Symptoms:
${data.symptoms || "Not specified."}

Recent Visit History (Last 5):
${visitHistoryString || "No recent visit history available."}
`;

      const aiInput: TreatmentRecommendationInput = {
        symptoms: comprehensiveSymptoms,
        labResults: data.labResultsSummary || "Not provided",
        imagingData: data.imagingDataSummary || "Not provided",
      };
      const result = await getRecommendationAction(aiInput);
      if ('error' in result) {
        setError(result.error);
        toast({ variant: "destructive", title: "AI Error", description: result.error });
      } else {
        setRecommendation(result);
        toast({ title: "AI Recommendation Received", description: "Review the suggestions below." });
      }
    });
  };

  const handleOutcome = async (outcome: string) => {
    if (!patientData) {
        toast({ variant: "destructive", title: "No patient loaded", description: "Please load patient data before selecting an outcome." });
        return;
    }
    setIsSubmittingOutcome(true);
    
    // Simulate API Call to save consultation
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log("Consultation Data to Save (Mock):", {
      patientId: patientData.nationalId,
      vitals: form.getValues(), // Or specific fields
      symptoms: form.getValues("symptoms"),
      aiRecommendation: recommendation,
      doctorComments: form.getValues("doctorComments"),
      outcome: outcome,
    });

    toast({ title: "Consultation Finished", description: `Outcome: ${outcome}. Action (mock): ${outcome} process initiated for ${patientData?.fullName}.` });
    
    form.reset();
    setPatientData(null);
    setRecommendation(null);
    setError(null);
    setBmi(null);
    setBmiDisplay(getBmiStatusAndColor(null));
    setSelectedLabTests({});
    setIsOutcomeModalOpen(false);
    setIsSubmittingOutcome(false);
  };
  
  const handleSaveProgress = async () => {
    if (!patientData) {
      toast({ variant: "destructive", title: "No patient loaded", description: "Cannot save progress without patient data." });
      return;
    }
    setIsSavingProgress(true);
    const currentFormData = form.getValues();
    // Simulate API Call to save draft
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Saving Draft (Mock):", {
      patientId: patientData.nationalId,
      formData: currentFormData,
      aiRecommendation: recommendation, 
    });
    toast({ title: "Progress Saved (Mock)", description: "Consultation draft has been saved." });
    setIsSavingProgress(false);
  };


  const handleSubmitLabOrder = async () => {
     if (!patientData) return;
     setIsSubmittingLabOrder(true);
     const orderedTestLabels = COMMON_ORDERABLE_LAB_TESTS
        .filter(test => selectedLabTests[test.id])
        .map(test => test.label);

    // Simulate API Call: POST /api/v1/consultations/{consultationId}/lab-orders
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
        title: "Lab Order Submitted (Mock)", 
        description:`Lab tests ordered for ${patientData?.fullName}: ${orderedTestLabels.length > 0 ? orderedTestLabels.join(', ') : 'No specific tests selected.'}`
    });
    setSelectedLabTests({}); 
    // Potentially close dialog here if it's a separate component
    setIsSubmittingLabOrder(false);
  };

  const handleSubmitImagingOrder = async () => {
    if (!patientData) return;
    setIsSubmittingImagingOrder(true);
    // Simulate API Call: POST /api/v1/consultations/{consultationId}/imaging-orders
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({title: "Imaging Order Submitted (Mock)", description:`Imaging study ordered for ${patientData?.fullName}.`});
    setIsSubmittingImagingOrder(false);
    // Potentially close dialog here
  };
  
  const isActionDisabled = isSearching || isAiPending || isSubmittingOutcome || isSubmittingLabOrder || isSubmittingImagingOrder || isSavingProgress;

  const handleLabTestSelection = (testId: string, checked: boolean) => {
    setSelectedLabTests(prev => ({ ...prev, [testId]: checked }));
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
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
                disabled={isActionDisabled}
              />
              <Button onClick={handlePatientSearch} disabled={isActionDisabled || !form.watch("nationalIdSearch")?.trim()}>
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isSearching ? "Searching..." : "Search Patient"}
              </Button>
            </div>

            {patientData && (
              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start mt-4 p-4 border rounded-md bg-muted/30">
                <Image
                  src={patientData.photoUrl}
                  alt="Patient Photo"
                  width={120}
                  height={120}
                  className="rounded-md border"
                  data-ai-hint={getAvatarHint(patientData.gender)}
                />
                <div className="space-y-1.5 text-sm">
                  <h3 className="text-xl font-semibold">{patientData.fullName}</h3>
                  <p><strong>National ID:</strong> {patientData.nationalId}</p>
                  <p><strong>Age:</strong> {patientData.age} | <strong>Gender:</strong> {patientData.gender}</p>
                  <p><strong>Address:</strong> {patientData.address}</p>
                  <p><strong>Home Clinic:</strong> {patientData.homeClinic}</p>
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
                  <Input id="bodyTemperature" placeholder="e.g., 37.5" {...form.register('bodyTemperature')} disabled={isActionDisabled || !patientData} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="weight" className="flex items-center"><Weight className="mr-1.5 h-4 w-4 text-primary" />Weight (kg)</Label>
                  <Input id="weight" placeholder="e.g., 70" {...form.register('weight')} disabled={isActionDisabled || !patientData}/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="height" className="flex items-center"><Ruler className="mr-1.5 h-4 w-4 text-primary" />Height (cm)</Label>
                  <Input id="height" placeholder="e.g., 175" {...form.register('height')} disabled={isActionDisabled || !patientData}/>
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center"><Sigma className="mr-1.5 h-4 w-4 text-primary" />BMI (kg/m²)</Label>
                  <div className="flex items-center gap-2 p-2 h-10 rounded-md border border-input bg-muted/50">
                    <span className="text-sm font-medium">{bmi || "N/A"}</span>
                    {bmiDisplay && bmiDisplay.status !== "N/A" && (
                      <Badge className={`${bmiDisplay.colorClass} ${bmiDisplay.textColorClass} border-transparent`}>
                        {bmiDisplay.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="symptoms">Symptoms / Chief Complaint <span className="text-destructive">*</span></Label>
                <Textarea
                  id="symptoms"
                  placeholder="Detailed description of patient's symptoms..."
                  {...form.register('symptoms')}
                  className="min-h-[100px]"
                  disabled={isActionDisabled || !patientData}
                />
                {form.formState.errors.symptoms && (
                  <p className="text-sm text-destructive">{form.formState.errors.symptoms.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {patientData && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Diagnostic Orders</CardTitle>
                  <CardDescription>Request lab tests or imaging studies for {patientData.fullName}.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2"> {/* Use flex-wrap for responsiveness */}
                  <Dialog onOpenChange={(open) => !open && setSelectedLabTests({})}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-shrink-0" disabled={isActionDisabled || !patientData}> {/* flex-shrink-0 helps button maintain size */}
                        <FlaskConical className="mr-2 h-4 w-4" /> Order Labs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Order Lab Tests for {patientData?.fullName}</DialogTitle>
                        <DialogDescription>Select the required lab tests and add any clinical notes.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        <Label className="text-base font-semibold">Common Lab Tests:</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {COMMON_ORDERABLE_LAB_TESTS.map((test) => (
                            <div key={test.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`consult-test-${test.id}`} 
                                checked={!!selectedLabTests[test.id]}
                                onCheckedChange={(checked) => handleLabTestSelection(test.id, !!checked)}
                                disabled={isSubmittingLabOrder}
                              />
                              <Label htmlFor={`consult-test-${test.id}`} className="text-sm font-normal">
                                {test.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                          <Label htmlFor="consultLabClinicalNotes">Clinical Notes / Reason for Test(s)</Label>
                          <Textarea id="consultLabClinicalNotes" placeholder="e.g., Routine screening, specific concerns..." disabled={isSubmittingLabOrder} />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmittingLabOrder}>Cancel</Button></DialogClose>
                        <Button type="button" onClick={handleSubmitLabOrder} disabled={isSubmittingLabOrder || Object.values(selectedLabTests).every(v => !v)}>
                           {isSubmittingLabOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                           {isSubmittingLabOrder ? "Submitting..." : "Submit Lab Order"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-shrink-0" disabled={isActionDisabled || !patientData}>
                        <RadioTower className="mr-2 h-4 w-4" /> Order Imaging Study
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Order Imaging Study for {patientData?.fullName}</DialogTitle>
                        <DialogDescription>Select imaging type, specify details, and add clinical notes.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="consultImagingType">Imaging Type</Label>
                          <Select disabled={isSubmittingImagingOrder}>
                            <SelectTrigger id="consultImagingType">
                              <SelectValue placeholder="Select imaging type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ultrasound">Ultrasound</SelectItem>
                              <SelectItem value="xray">X-Ray</SelectItem>
                              <SelectItem value="mri">MRI</SelectItem>
                              <SelectItem value="ctscan">CT Scan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="consultImagingRegionDetails">Region / Details of Study</Label>
                          <Textarea id="consultImagingRegionDetails" placeholder="e.g., Abdominal Ultrasound, Chest X-ray PA view, MRI Brain..." disabled={isSubmittingImagingOrder}/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="consultImagingClinicalNotes">Clinical Notes / Reason for Study</Label>
                          <Textarea id="consultImagingClinicalNotes" placeholder="e.g., Rule out appendicitis, check for pneumonia..." disabled={isSubmittingImagingOrder}/>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmittingImagingOrder}>Cancel</Button></DialogClose>
                        <Button type="button" onClick={handleSubmitImagingOrder} disabled={isSubmittingImagingOrder}>
                            {isSubmittingImagingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {isSubmittingImagingOrder ? "Submitting..." : "Submit Imaging Order"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" className="flex-shrink-0" onClick={handleSaveProgress} disabled={isActionDisabled || !patientData}>
                    {isSavingProgress ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingProgress ? "Saving..." : "Save Progress"}
                  </Button>
                </CardContent>
              </Card>
          )}

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Medical Data for AI Analysis</CardTitle>
              <CardDescription>Provide summaries of existing lab results and imaging data if available for AI input.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="labResultsSummary">Lab Results Summary</Label>
                <Textarea
                  id="labResultsSummary"
                  placeholder="e.g., CBC: WBC 12.5 x 10^9/L. Blood Glucose: 110 mg/dL..."
                  {...form.register('labResultsSummary')}
                  className="min-h-[100px]"
                  disabled={isActionDisabled || !patientData}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imagingDataSummary">Imaging Data Summary</Label>
                <Textarea
                  id="imagingDataSummary"
                  placeholder="e.g., Chest X-ray: Bilateral infiltrates. CT Brain: No acute findings..."
                  {...form.register('imagingDataSummary')}
                  className="min-h-[100px]"
                  disabled={isActionDisabled || !patientData}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isActionDisabled || !patientData} className="w-full md:w-auto">
                {isAiPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isAiPending ? "Getting Recommendation..." : "Get AI Recommendation"}
              </Button>
            </CardFooter>
          </Card>
        </form>


        {error && !recommendation && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>AI Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendation && patientData && (
          <div className="space-y-6 mt-6">
            <Card className="shadow-md">
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
              </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Edit3 className="mr-1.5 h-5 w-5 text-primary"/>Doctor's Comments / Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        id="doctorComments"
                        placeholder="Add any comments, adjustments, or final decisions here..."
                        {...form.register('doctorComments')}
                        className="min-h-[100px]"
                        disabled={isActionDisabled}
                        />
                </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
                <Dialog open={isOutcomeModalOpen} onOpenChange={setIsOutcomeModalOpen}>
                    <DialogTrigger asChild>
                    <Button variant="default" disabled={isActionDisabled || !patientData} size="lg">
                        <Send className="mr-2 h-4 w-4" /> Finish Consultation &amp; Select Outcome
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Consultation Outcome for {patientData?.fullName}</DialogTitle>
                        <DialogDescription>Select the appropriate next step for the patient.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                        {[
                          { label: "Send Home", value: "Send Home", icon: Home },
                          { label: "Send to Pharmacy", value: "Send to Pharmacy", icon: ArrowRightToLine },
                          { label: "Send to Inpatient", value: "Send to Inpatient (Ward)", icon: BedDouble },
                          { label: "Refer to Specialist", value: "Refer to Specialist", icon: Users2 },
                          { label: "Deceased", value: "Deceased", icon: Skull }
                        ].map(opt => (
                           <Button 
                            key={opt.value} 
                            variant="outline" 
                            onClick={() => handleOutcome(opt.value)} 
                            disabled={isSubmittingOutcome}
                          >
                            {isSubmittingOutcome ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <opt.icon className="mr-2 h-4 w-4"/>}
                            {isSubmittingOutcome ? "Processing..." : opt.label}
                          </Button>
                        ))}
                         <DialogClose asChild>
                            <Button type="button" variant="ghost" disabled={isSubmittingOutcome}>Cancel</Button>
                         </DialogClose>
                    </div>
                    </DialogContent>
                </Dialog>
            </div>
          </div>
        )}
      </div>

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
              <div><strong>Age:</strong> {patientData.age} | <strong>Gender:</strong> {patientData.gender}</div>
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


    