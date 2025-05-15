
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
import { Loader2, Sparkles, FileText, Stethoscope, Pill, UserCircle, Search, Thermometer, Weight, Ruler, Sigma, Edit3, Send, Home, BedDouble, ArrowRightToLine, Users2, Skull, History, HeartPulse, ShieldAlert, FileClock, Briefcase, FlaskConical, RadioTower } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";


const FormSchema = z.object({
  nationalIdSearch: z.string().optional(),
  bodyTemperature: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  symptoms: z.string().min(1, "Symptoms are required for AI recommendation.").optional(),
  labResultsSummary: z.string().optional(),
  imagingDataSummary: z.string().optional(),
  specialistComments: z.string().optional(),
  currentSpecialty: z.string().optional(),
}).refine(data => data.symptoms || data.labResultsSummary || data.imagingDataSummary, {
    message: "At least one of symptoms, lab results summary, or imaging data summary must be provided for AI recommendation.",
    path: ["symptoms"],
});

type FormValues = z.infer<typeof FormSchema>;

interface PatientData {
  nationalId: string;
  fullName: string;
  age: number;
  gender: string;
  address: string;
  homeClinic: string;
  photoUrl: string;
  allergies: string[];
  chronicConditions: string[];
  referringDoctor?: string;
  referringDepartment?: string;
  reasonForReferral?: string;
  assignedSpecialty?: string;
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
  { id: "v2", date: "2024-03-22", department: "Emergency", doctor: "Dr. Jones", reason: "Minor Laceration, Referred to Ortho" },
  { id: "v3", date: "2023-11-05", department: "Cardiology", doctor: "Dr. Eve", reason: "Follow-up: Post MI" },
];

const generalLabTests = [
  { id: "cbc", label: "Complete Blood Count (CBC)" },
  { id: "bmp", label: "Basic Metabolic Panel (BMP)" },
  { id: "cmp", label: "Comprehensive Metabolic Panel (CMP)" },
  { id: "lipid", label: "Lipid Panel" },
  { id: "ua", label: "Urinalysis (U/A)" },
  { id: "tsh", label: "Thyroid Stimulating Hormone (TSH)" },
  { id: "crp", label: "C-Reactive Protein (CRP)" },
  { id: "esr", label: "Erythrocyte Sedimentation Rate (ESR)" },
];


interface SpecialistConsultationFormProps {
  getRecommendationAction: (input: TreatmentRecommendationInput) => Promise<TreatmentRecommendationOutput | { error: string }>;
}

export function SpecialistConsultationForm({ getRecommendationAction }: SpecialistConsultationFormProps) {
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
      specialistComments: "",
      currentSpecialty: "Cardiology",
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
    form.reset({
        nationalIdSearch: nationalId,
        bodyTemperature: "",
        weight: "",
        height: "",
        symptoms: "",
        labResultsSummary: "",
        imagingDataSummary: "",
        specialistComments: "",
        currentSpecialty: form.getValues("currentSpecialty"),
    });
    setBmi(null);

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
        referringDoctor: nationalId === "123456789" ? "Dr. Primary Care" : "Dr. John GP",
        referringDepartment: nationalId === "123456789" ? "Outpatient Clinic A" : "General Practice Wing",
        reasonForReferral: nationalId === "123456789" ? "Persistent cough, rule out TB" : "Elevated blood pressure, needs specialist review",
        assignedSpecialty: form.getValues("currentSpecialty") || "Cardiology",
      };
      setPatientData(fetchedPatientData);
      toast({ title: "Patient Found", description: `${fetchedPatientData.fullName}'s details loaded for ${fetchedPatientData.assignedSpecialty} consultation.` });
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
      const visitHistoryString = mockVisitHistory.slice(0, 5).map(
        visit => `Date: ${visit.date}, Dept: ${visit.department}, Doctor: ${visit.doctor}, Reason: ${visit.reason}`
      ).join('\\n');

      const comprehensiveSymptoms = `
Patient Name: ${patientData.fullName}
Patient Age: ${patientData.age}
Patient Gender: ${patientData.gender}
Current Specialty: ${patientData.assignedSpecialty}
Referring Doctor: ${patientData.referringDoctor || 'N/A'}
Referring Department: ${patientData.referringDepartment || 'N/A'}
Reason for Referral: ${patientData.reasonForReferral || 'N/A'}

Vitals:
Body Temperature: ${data.bodyTemperature || 'N/A'}°C
Weight: ${data.weight || 'N/A'}kg
Height: ${data.height || 'N/A'}cm
BMI: ${bmi || 'N/A'}

Chief Complaint/Symptoms (Specialist Focus):
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

  const handleOutcome = (outcome: string) => {
    setIsOutcomeModalOpen(false);
    toast({ title: "Specialist Consultation Finished", description: `Outcome: ${outcome}. Action (mock): ${outcome} process initiated for ${patientData?.fullName}.` });

    form.reset();
    setPatientData(null);
    setRecommendation(null);
    setError(null);
    setBmi(null);
  };

  const handleSubmitLabOrder = () => {
    toast({title: "Lab Order Submitted (Mock)", description:`Lab tests ordered for ${patientData?.fullName} by Specialist.`});
  };

  const handleSubmitImagingOrder = () => {
     toast({title: "Imaging Order Submitted (Mock)", description:`Imaging study ordered for ${patientData?.fullName} by Specialist.`});
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Patient & Referral Information</CardTitle>
            <CardDescription>Search patient and select specialty (e.g., 123456789 for demo).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="currentSpecialty">Consulting Specialty</Label>
                    <Select
                        defaultValue={form.getValues("currentSpecialty")}
                        onValueChange={(value) => setValue("currentSpecialty", value)}
                    >
                        <SelectTrigger id="currentSpecialty">
                        <SelectValue placeholder="Select Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="Oncology">Oncology</SelectItem>
                        <SelectItem value="Dermatology">Dermatology</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="nationalIdSearch">Patient National ID</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="nationalIdSearch"
                            placeholder="Enter National ID"
                            {...form.register('nationalIdSearch')}
                        />
                        <Button onClick={handlePatientSearch} disabled={isSearching}>
                            {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Search
                        </Button>
                    </div>
                </div>
            </div>


            {patientData && (
              <div className="mt-4 p-4 border rounded-md bg-muted/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
                    <Image src={patientData.photoUrl} alt="Patient Photo" width={120} height={120} className="rounded-md border" data-ai-hint="patient photo" />
                    <div className="space-y-1.5 text-sm">
                    <h3 className="text-xl font-semibold">{patientData.fullName}</h3>
                    <p><strong>National ID:</strong> {patientData.nationalId}</p>
                    <p><strong>Age:</strong> {patientData.age} | <strong>Gender:</strong> {patientData.gender}</p>
                    <p><strong>Assigned Specialty:</strong> {patientData.assignedSpecialty || "N/A"}</p>
                    </div>
                </div>
                <Separator/>
                 <div className="text-sm space-y-1">
                    <h4 className="font-medium text-md">Referral Details:</h4>
                    <p><strong>Referring Doctor:</strong> {patientData.referringDoctor || "N/A"}</p>
                    <p><strong>Referring Department:</strong> {patientData.referringDepartment || "N/A"}</p>
                    <p><strong>Reason for Referral:</strong> {patientData.reasonForReferral || "N/A"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(onAiSubmit)} className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Patient Vitals & Specialist Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="bodyTemperature" className="flex items-center"><Thermometer className="mr-1.5 h-4 w-4 text-primary" />Temp (°C)</Label>
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
                  <Label className="flex items-center"><Sigma className="mr-1.5 h-4 w-4 text-primary" />BMI</Label>
                  <Input value={bmi || "N/A"} readOnly className="font-semibold bg-muted/50" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="symptoms">Specialist Assessment / Symptoms <span className="text-destructive">*</span></Label>
                <Textarea
                  id="symptoms"
                  placeholder="Detailed description of patient's symptoms relevant to the specialty..."
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
                <Label htmlFor="labResultsSummary">Relevant Lab Results Summary</Label>
                <Textarea
                  id="labResultsSummary"
                  placeholder="e.g., Echo: EF 55%. Troponin: <0.01 ng/mL..."
                  {...form.register('labResultsSummary')}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imagingDataSummary">Relevant Imaging Data Summary</Label>
                <Textarea
                  id="imagingDataSummary"
                  placeholder="e.g., Cardiac MRI: No significant abnormalities. Angiogram: Mild LAD stenosis..."
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

        {patientData && (
            <Card className="shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Diagnostic Orders for Specialist</CardTitle>
                <CardDescription>Request lab tests or imaging studies for {patientData.fullName}.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto" disabled={!patientData}>
                      <FlaskConical className="mr-2 h-4 w-4" /> Order Labs
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Order Lab Tests for {patientData?.fullName}</DialogTitle>
                      <DialogDescription>Select the required lab tests and add any clinical notes.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                      <Label className="text-base font-semibold">Common Lab Tests:</Label>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {generalLabTests.map((test) => (
                          <div key={test.id} className="flex items-center space-x-2">
                            <Checkbox id={`specialist-test-${test.id}`} />
                            <Label htmlFor={`specialist-test-${test.id}`} className="text-sm font-normal">
                              {test.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                      <div className="space-y-2">
                        <Label htmlFor="specialistLabClinicalNotes">Clinical Notes / Reason for Test(s)</Label>
                        <Textarea id="specialistLabClinicalNotes" placeholder="e.g., Specialist screening, follow-up..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                      <Button type="submit" onClick={handleSubmitLabOrder}>Submit Lab Order</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto" disabled={!patientData}>
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
                        <Label htmlFor="specialistImagingType">Imaging Type</Label>
                        <Select>
                          <SelectTrigger id="specialistImagingType">
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
                        <Label htmlFor="specialistImagingRegionDetails">Region / Details of Study</Label>
                        <Textarea id="specialistImagingRegionDetails" placeholder="e.g., Echocardiogram, MRI Knee, CT Angio..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialistImagingClinicalNotes">Clinical Notes / Reason for Study</Label>
                        <Textarea id="specialistImagingClinicalNotes" placeholder="e.g., Assess cardiac function, rule out ligament tear..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                      <Button type="submit" onClick={handleSubmitImagingOrder}>Submit Imaging Order</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
        )}

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
                  <Sparkles className="h-6 w-6 text-primary" /> AI Generated Insights for {patientData.fullName} ({patientData.assignedSpecialty})
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
                    <CardTitle className="flex items-center gap-2"><Edit3 className="mr-1.5 h-5 w-5 text-primary"/>Specialist's Notes & Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        id="specialistComments"
                        placeholder="Add specialist findings, final diagnosis, treatment plan, and any adjustments..."
                        {...form.register('specialistComments')}
                        className="min-h-[100px]"
                        />
                </CardContent>
                <CardFooter>
                     <Button variant="secondary" onClick={() => toast({title: "Notes Saved (Mock)"})}>Save Notes & Plan</Button>
                </CardFooter>
            </Card>

            <div className="flex justify-end mt-6">
                <Dialog open={isOutcomeModalOpen} onOpenChange={setIsOutcomeModalOpen}>
                    <DialogTrigger asChild>
                    <Button variant="default" disabled={!patientData} size="lg">
                        <Send className="mr-2 h-4 w-4" /> Finish Specialist Consultation & Select Outcome
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Specialist Consultation Outcome for {patientData?.fullName}</DialogTitle>
                        <DialogDescription>Select the appropriate next step for the patient.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-4">
                        <Button variant="outline" onClick={() => handleOutcome("Schedule Specialist Follow-up")}><FileClock className="mr-2 h-4 w-4"/>Schedule Follow-up</Button>
                        <Button variant="outline" onClick={() => handleOutcome("Return to Referring Doctor")}><ArrowRightToLine className="mr-2 h-4 w-4"/>Return to Referrer</Button>
                        <Button variant="outline" onClick={() => handleOutcome("Admit to Ward")}><BedDouble className="mr-2 h-4 w-4"/>Admit to Ward</Button>
                        <Button variant="outline" onClick={() => handleOutcome("Refer to Sub-specialist")}><Users2 className="mr-2 h-4 w-4"/>Refer Sub-specialist</Button>
                        <Button variant="outline" onClick={() => handleOutcome("Discharge from Specialist Care")}><Home className="mr-2 h-4 w-4"/>Discharge Specialist Care</Button>
                        <DialogClose asChild><Button variant="ghost" className="col-span-2">Cancel</Button></DialogClose>
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
                <h4 className="font-semibold mb-1 flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-indigo-500"/>Current Specialty:</h4>
                <p>{patientData.assignedSpecialty || "N/A"}</p>
              </div>
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

