
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Baby, Search, CalendarPlus, FileText, ShieldAlert, Microscope, ScanSearch, FlaskConical, RadioTower, Loader2, CalendarIcon, Save, UserPlus, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addWeeks, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { COMMON_ORDERABLE_LAB_TESTS, type OrderableLabTest } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


interface AntenatalVisit {
  id: string;
  date: string;
  gestationalAge: string; 
  weightKg: number | string;
  bp: string; 
  fhrBpm: number | string; 
  fundalHeightCm: number | string;
  notes: string;
  nextAppointment?: string;
}

interface MaternityPatient {
  id: string;
  nationalId: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  photoUrl: string;
  lmp?: string; 
  edd: string; 
  gestationalAge: string;
  gravida: number | string; 
  para: number | string;    
  bloodGroup: string;
  rhFactor: string;
  allergies: string[];
  existingConditions: string[];
  riskFactors: string[];
  antenatalVisits: AntenatalVisit[];
}

const mockPatientsList: MaternityPatient[] = [
  {
    id: "MP001",
    nationalId: "112233445",
    fullName: "Aisha Sharma",
    age: 28,
    gender: "Female",
    photoUrl: "https://placehold.co/100x100.png",
    lmp: "2024-03-01",
    edd: "2024-12-06", 
    gestationalAge: "24w 5d", 
    gravida: 1,
    para: 0,
    bloodGroup: "O+",
    rhFactor: "Positive",
    allergies: ["Penicillin"],
    existingConditions: ["Mild Asthma"],
    riskFactors: ["None Identified"],
    antenatalVisits: [
      { id: "AV001", date: "2024-05-10", gestationalAge: "10w 1d", weightKg: 60, bp: "110/70", fhrBpm: 150, fundalHeightCm: "N/A", notes: "First visit, all good.", nextAppointment: "2024-06-10" },
      { id: "AV002", date: "2024-06-12", gestationalAge: "14w 3d", weightKg: 62, bp: "115/75", fhrBpm: 155, fundalHeightCm: 15, notes: "Routine checkup, anomaly scan advised.", nextAppointment: "2024-07-12" },
    ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  },
   {
    id: "MP002",
    nationalId: "556677889",
    fullName: "Maria Rodriguez",
    age: 32,
    gender: "Female",
    photoUrl: "https://placehold.co/100x100.png",
    lmp: "2024-05-15",
    edd: "2025-02-19",
    gestationalAge: "13w 2d",
    gravida: 2,
    para: 1,
    bloodGroup: "A-",
    rhFactor: "Negative",
    allergies: [],
    existingConditions: ["Gestational Diabetes (Previous Pregnancy)"],
    riskFactors: ["Advanced Maternal Age", "History of GDM"],
    antenatalVisits: [
      { id: "AV003", date: "2024-07-20", gestationalAge: "9w 2d", weightKg: 70, bp: "120/80", fhrBpm: 160, fundalHeightCm: "N/A", notes: "Booking visit. GTT scheduled.", nextAppointment: "2024-08-20" },
    ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }
];

interface NewVisitFormState {
  visitDate?: Date;
  gestationalAge: string;
  weightKg: string;
  bp: string;
  fhrBpm: string;
  fundalHeightCm: string;
  notes: string;
  nextAppointmentDate?: Date;
}

interface MaternityIntakeFormState {
    nationalId: string;
    fullName: string;
    dob?: Date;
    gender: "Male" | "Female" | "Other" | "";
    lmp?: Date;
    edd?: Date; 
    gravida: string;
    para: string;
    bloodGroup: string;
    rhFactor: string;
    allergies: string; 
    existingConditions: string; 
}

export default function MaternityCarePage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<MaternityPatient | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [patientNotFound, setPatientNotFound] = useState(false);

  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false);
  const [isLoggingVisit, setIsLoggingVisit] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState<NewVisitFormState>({
    gestationalAge: "", weightKg: "", bp: "", fhrBpm: "", fundalHeightCm: "", notes: ""
  });

  const [selectedLabTests, setSelectedLabTests] = useState<Record<string, boolean>>({});
  const [isOrderingLabs, setIsOrderingLabs] = useState(false);
  const [isOrderingImaging, setIsOrderingImaging] = useState(false);
  
  const [isScheduleNextVisitModalOpen, setIsScheduleNextVisitModalOpen] = useState(false);
  const [isSchedulingNextVisit, setIsSchedulingNextVisit] = useState(false);
  const [nextScheduledDate, setNextScheduledDate] = useState<Date | undefined>();
  const [nextScheduledNotes, setNextScheduledNotes] = useState("");

  const [isMaternityIntakeModalOpen, setIsMaternityIntakeModalOpen] = useState(false);
  const [maternityIntakeForm, setMaternityIntakeForm] = useState<MaternityIntakeFormState>({
    nationalId: "", fullName: "", gender: "", gravida: "", para: "", bloodGroup: "", rhFactor: "", allergies: "", existingConditions: ""
  });
  const [isSubmittingIntake, setIsSubmittingIntake] = useState(false);
  const [allMaternityPatients, setAllMaternityPatients] = useState<MaternityPatient[]>(mockPatientsList);


  const calculateEdd = (lmp: Date | undefined): Date | undefined => {
    if (!lmp) return undefined;
    return addDays(addWeeks(lmp, 40), 0); 
  };
  
  useEffect(() => {
    if (maternityIntakeForm.lmp) {
      const calculated = calculateEdd(maternityIntakeForm.lmp);
      if (calculated) {
        setMaternityIntakeForm(prev => ({ ...prev, edd: calculated }));
      }
    }
  }, [maternityIntakeForm.lmp]);

  const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
    if (gender === "Male") return "male avatar";
    if (gender === "Female") return "female avatar";
    return "patient avatar";
  };

  const handleSearch = async () => {
    if (!searchNationalId) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a National ID." });
      return;
    }
    setIsLoadingSearch(true);
    setSelectedPatient(null);
    setPatientNotFound(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const found = allMaternityPatients.find(p => p.nationalId === searchNationalId);
    if (found) {
      setSelectedPatient(found);
      toast({ title: "Patient Found", description: `${found.fullName}'s maternity record loaded.` });
    } else {
      setPatientNotFound(true);
      toast({ variant: "destructive", title: "Not Found", description: "No maternity record found for this National ID. You can register them for maternity care." });
    }
    setIsLoadingSearch(false);
  };

  const handleLabTestSelection = (testId: string, checked: boolean) => {
    setSelectedLabTests(prev => ({ ...prev, [testId]: checked }));
  };

  const handleSubmitLabOrder = async () => {
    if (!selectedPatient) return;
    setIsOrderingLabs(true);
    const orderedTests = COMMON_ORDERABLE_LAB_TESTS.filter(test => selectedLabTests[test.id]);
    const orderedTestLabels = orderedTests.map(test => test.label);
    const orderedTestIds = orderedTests.map(test => test.id);

    const payload = {
      patientId: selectedPatient.nationalId, 
      maternityContext: true, 
      testIds: orderedTestIds,
      clinicalNotes: (document.getElementById('maternityLabClinicalNotes') as HTMLTextAreaElement)?.value || ""
    };

    console.log("Submitting Maternity Lab Order to /api/v1/maternity/lab-orders (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Lab Order Submitted (Mock)", 
      description:`Lab tests ordered for ${selectedPatient?.fullName}: ${orderedTestLabels.length > 0 ? orderedTestLabels.join(', ') : 'No specific tests selected.'}`
    });
    setSelectedLabTests({});
    const notesEl = document.getElementById('maternityLabClinicalNotes') as HTMLTextAreaElement;
    if (notesEl) notesEl.value = "";
    setIsOrderingLabs(false);
    
  }

  const handleSubmitImagingOrder = async () => {
     if (!selectedPatient) return;
    setIsOrderingImaging(true);

    const payload = {
        patientId: selectedPatient.nationalId,
        maternityContext: true, 
        imagingType: (document.getElementById('maternityImagingType') as HTMLSelectElement)?.value || "",
        regionDetails: (document.getElementById('maternityImagingRegionDetails') as HTMLTextAreaElement)?.value || "",
        clinicalNotes: (document.getElementById('maternityImagingClinicalNotes') as HTMLTextAreaElement)?.value || ""
    };
    console.log("Submitting Maternity Imaging Order to /api/v1/maternity/imaging-orders (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({title: "Imaging Order Submitted (Mock)", description:`Imaging study ordered for ${selectedPatient?.fullName}. Details: ${payload.imagingType} - ${payload.regionDetails}`});
    setIsOrderingImaging(false);
    
  }

  const handleNewVisitFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVisitForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogNewVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newVisitForm.visitDate) {
        toast({ variant: "destructive", title: "Missing Information", description: "Visit date is required." });
        return;
    }
    setIsLoggingVisit(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newVisit: AntenatalVisit = {
        id: `AV${Date.now()}`,
        date: format(newVisitForm.visitDate, "yyyy-MM-dd"),
        gestationalAge: newVisitForm.gestationalAge,
        weightKg: newVisitForm.weightKg,
        bp: newVisitForm.bp,
        fhrBpm: newVisitForm.fhrBpm,
        fundalHeightCm: newVisitForm.fundalHeightCm,
        notes: newVisitForm.notes,
        nextAppointment: newVisitForm.nextAppointmentDate ? format(newVisitForm.nextAppointmentDate, "yyyy-MM-dd") : undefined,
    };

    setSelectedPatient(prev => prev ? ({ ...prev, antenatalVisits: [...prev.antenatalVisits, newVisit].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }) : null);
    setAllMaternityPatients(prevPatients => prevPatients.map(p => p.id === selectedPatient.id ? {...selectedPatient, antenatalVisits: [...selectedPatient.antenatalVisits, newVisit].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())} : p));

    toast({ title: "New Antenatal Visit Logged", description: `Visit on ${newVisit.date} for ${selectedPatient.fullName} saved.`});
    setIsNewVisitModalOpen(false);
    setNewVisitForm({ visitDate: undefined, gestationalAge: "", weightKg: "", bp: "", fhrBpm: "", fundalHeightCm: "", notes: "", nextAppointmentDate: undefined }); 
    setIsLoggingVisit(false);
  };
  
  const handleScheduleNextVisitSubmit = async () => {
    if (!selectedPatient || !nextScheduledDate) {
        toast({ variant: "destructive", title: "Missing Date", description: "Please select a date for the next appointment." });
        return;
    }
    setIsSchedulingNextVisit(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Next Visit Scheduled (Mock)", description: `Next ANC visit for ${selectedPatient.fullName} scheduled for ${format(nextScheduledDate, "PPP")}. Notes: ${nextScheduledNotes}`});
    setIsScheduleNextVisitModalOpen(false);
    setNextScheduledDate(undefined);
    setNextScheduledNotes("");
    setIsSchedulingNextVisit(false);
  };

  const handleIntakeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMaternityIntakeForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMaternityIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nationalId, fullName, dob, gender, lmp, edd, gravida, para } = maternityIntakeForm;
    if (!nationalId || !fullName || !dob || !gender || !lmp || !edd || !gravida || !para) {
        toast({ variant: "destructive", title: "Missing Required Fields", description: "Please fill all required fields in the intake form." });
        return;
    }
    setIsSubmittingIntake(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newMaternityPatient: MaternityPatient = {
        id: `MP${Date.now()}`,
        nationalId,
        fullName,
        age: new Date().getFullYear() - new Date(dob).getFullYear(), 
        gender: gender as MaternityPatient["gender"],
        photoUrl: "https://placehold.co/100x100.png", 
        lmp: format(lmp, "yyyy-MM-dd"),
        edd: format(edd, "yyyy-MM-dd"),
        gestationalAge: "0w 0d", 
        gravida: parseInt(gravida),
        para: parseInt(para),
        bloodGroup: maternityIntakeForm.bloodGroup,
        rhFactor: maternityIntakeForm.rhFactor,
        allergies: maternityIntakeForm.allergies.split(',').map(s => s.trim()).filter(Boolean),
        existingConditions: maternityIntakeForm.existingConditions.split(',').map(s => s.trim()).filter(Boolean),
        riskFactors: [], 
        antenatalVisits: [], 
    };

    setAllMaternityPatients(prev => [...prev, newMaternityPatient]);
    setSelectedPatient(newMaternityPatient); 
    toast({ title: "Maternity Care Initiated", description: `${newMaternityPatient.fullName} registered for maternity care.` });
    setIsMaternityIntakeModalOpen(false);
    setMaternityIntakeForm({ nationalId: "", fullName: "", gender: "", gravida: "", para: "", bloodGroup: "", rhFactor: "", allergies: "", existingConditions: "" });
    setPatientNotFound(false); 
    setSearchNationalId(newMaternityPatient.nationalId); 
    setIsSubmittingIntake(false);
  };


  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Baby className="h-8 w-8" /> Maternity Care Management
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Maternity Patient Record</CardTitle>
            <CardDescription>Enter patient's National ID to load their maternity care details or register a new patient for maternity care.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Input
                id="searchNationalId"
                placeholder="Enter National ID (e.g., 112233445)"
                value={searchNationalId}
                onChange={(e) => setSearchNationalId(e.target.value)}
                className="max-w-xs"
                disabled={isLoadingSearch}
              />
              <Button onClick={handleSearch} disabled={isLoadingSearch || !searchNationalId.trim()}>
                {isLoadingSearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isLoadingSearch ? "Searching..." : "Search"}
              </Button>
               <Dialog open={isMaternityIntakeModalOpen} onOpenChange={(open) => {
                    if (!open) {
                        setMaternityIntakeForm({ nationalId: searchNationalId || "", fullName: "", gender: "", gravida: "", para: "", bloodGroup: "", rhFactor: "", allergies: "", existingConditions: "" });
                    } else {
                        setMaternityIntakeForm(prev => ({ ...prev, nationalId: searchNationalId || ""}));
                    }
                    setIsMaternityIntakeModalOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <Button variant="default" className="mt-2 sm:mt-0 w-full sm:w-auto">
                            <UserPlus className="mr-2 h-4 w-4"/> Register New Maternity Patient / Initiate Care
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <form onSubmit={handleMaternityIntakeSubmit}>
                            <DialogHeader>
                                <DialogTitle>Maternity Intake Form</DialogTitle>
                                <DialogDescription>
                                    Enter details for a new maternity patient or to initiate care for an existing patient.
                                    Fields marked <span className="text-destructive">*</span> are required.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                                <Separator/>
                                <h3 className="font-semibold text-md">Patient Demographics</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeNationalId">National ID <span className="text-destructive">*</span></Label>
                                        <Input id="intakeNationalId" name="nationalId" value={maternityIntakeForm.nationalId} onChange={handleIntakeFormChange} placeholder="Patient's National ID" required disabled={isSubmittingIntake}/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeFullName">Full Name <span className="text-destructive">*</span></Label>
                                        <Input id="intakeFullName" name="fullName" value={maternityIntakeForm.fullName} onChange={handleIntakeFormChange} placeholder="Patient's Full Name" required disabled={isSubmittingIntake}/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeDob">Date of Birth <span className="text-destructive">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !maternityIntakeForm.dob && "text-muted-foreground")} disabled={isSubmittingIntake}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {maternityIntakeForm.dob ? format(maternityIntakeForm.dob, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={maternityIntakeForm.dob} onSelect={(date) => setMaternityIntakeForm(prev => ({...prev, dob: date}))} initialFocus captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()} />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeGender">Gender <span className="text-destructive">*</span></Label>
                                        <Select name="gender" value={maternityIntakeForm.gender} onValueChange={(val) => setMaternityIntakeForm(prev => ({...prev, gender: val as MaternityIntakeFormState["gender"]}))} required disabled={isSubmittingIntake}>
                                            <SelectTrigger id="intakeGender"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Separator/>
                                <h3 className="font-semibold text-md">Maternity Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeLmp">Last Menstrual Period (LMP) <span className="text-destructive">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !maternityIntakeForm.lmp && "text-muted-foreground")} disabled={isSubmittingIntake}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {maternityIntakeForm.lmp ? format(maternityIntakeForm.lmp, "PPP") : <span>Pick LMP date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={maternityIntakeForm.lmp} onSelect={(date) => setMaternityIntakeForm(prev => ({...prev, lmp: date}))} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeEdd">Estimated Due Date (EDD)</Label>
                                        <Input id="intakeEdd" value={maternityIntakeForm.edd ? format(maternityIntakeForm.edd, "PPP") : "Auto-calculated"} readOnly disabled className="bg-muted/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeGravida">Gravida <span className="text-destructive">*</span></Label>
                                        <Input id="intakeGravida" name="gravida" type="number" value={maternityIntakeForm.gravida} onChange={handleIntakeFormChange} placeholder="e.g., 1" required disabled={isSubmittingIntake}/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakePara">Para <span className="text-destructive">*</span></Label>
                                        <Input id="intakePara" name="para" type="number" value={maternityIntakeForm.para} onChange={handleIntakeFormChange} placeholder="e.g., 0" required disabled={isSubmittingIntake}/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeBloodGroup">Blood Group</Label>
                                        <Input id="intakeBloodGroup" name="bloodGroup" value={maternityIntakeForm.bloodGroup} onChange={handleIntakeFormChange} placeholder="e.g., O+" disabled={isSubmittingIntake}/>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="intakeRhFactor">Rh Factor</Label>
                                        <Input id="intakeRhFactor" name="rhFactor" value={maternityIntakeForm.rhFactor} onChange={handleIntakeFormChange} placeholder="e.g., Positive" disabled={isSubmittingIntake}/>
                                    </div>
                                </div>
                                <Separator/>
                                <h3 className="font-semibold text-md">Medical History (Optional)</h3>
                                <div className="space-y-1">
                                    <Label htmlFor="intakeAllergies">Allergies (comma-separated)</Label>
                                    <Textarea id="intakeAllergies" name="allergies" value={maternityIntakeForm.allergies} onChange={handleIntakeFormChange} placeholder="e.g., Penicillin, Sulfa drugs" disabled={isSubmittingIntake}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="intakeExistingConditions">Existing Medical Conditions (comma-separated)</Label>
                                    <Textarea id="intakeExistingConditions" name="existingConditions" value={maternityIntakeForm.existingConditions} onChange={handleIntakeFormChange} placeholder="e.g., Hypertension, Diabetes" disabled={isSubmittingIntake}/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmittingIntake}>Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmittingIntake}>
                                    {isSubmittingIntake ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    {isSubmittingIntake ? "Saving..." : "Save & Start Maternity Care"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {patientNotFound && (
                 <Alert variant="default" className="border-primary/50">
                    <Info className="h-5 w-5 text-primary" />
                    <AlertTitle>Patient Not Found for Maternity Care</AlertTitle>
                    <AlertDescription>
                    No active maternity record found for National ID: {searchNationalId}. You can register them using the button above.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>

        {selectedPatient && (
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-[calc(theme(spacing.16)_+_theme(spacing.6))]">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <Image
                        src={selectedPatient.photoUrl}
                        alt={selectedPatient.fullName}
                        width={80}
                        height={80}
                        className="rounded-md border"
                        data-ai-hint={getAvatarHint(selectedPatient.gender)}
                    />
                    <div className="flex-1">
                        <CardTitle>{selectedPatient.fullName}</CardTitle>
                        <CardDescription>ID: {selectedPatient.nationalId} | Age: {selectedPatient.age} | Gender: {selectedPatient.gender}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p><strong>LMP:</strong> {selectedPatient.lmp ? new Date(selectedPatient.lmp + "T00:00:00").toLocaleDateString() : "N/A"}</p>
                  <p><strong>EDD:</strong> {new Date(selectedPatient.edd + "T00:00:00").toLocaleDateString()} ({selectedPatient.gestationalAge})</p>
                  <p><strong>Gravida/Para:</strong> G{selectedPatient.gravida} P{selectedPatient.para}</p>
                  <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup} ({selectedPatient.rhFactor})</p>
                  <div>
                    <h4 className="font-medium">Allergies:</h4>
                    {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : <span className="text-muted-foreground">None reported</span>}
                  </div>
                   <div>
                    <h4 className="font-medium">Existing Conditions:</h4>
                    {selectedPatient.existingConditions.length > 0 ? selectedPatient.existingConditions.join(', ') : <span className="text-muted-foreground">None reported</span>}
                  </div>
                  <Separator />
                   <div>
                     <h4 className="font-medium flex items-center gap-1"><ShieldAlert className="h-4 w-4 text-destructive" /> Risk Factors:</h4>
                    {selectedPatient.riskFactors.length > 0 ? (
                        <ul className="list-disc list-inside text-destructive">
                            {selectedPatient.riskFactors.map(risk => <li key={risk}>{risk}</li>)}
                        </ul>
                    ): <span className="text-muted-foreground">None identified.</span>}
                  </div>
                </CardContent>
                 <CardFooter className="flex-col items-start gap-2">
                    <Dialog open={isScheduleNextVisitModalOpen} onOpenChange={setIsScheduleNextVisitModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full" disabled={!selectedPatient || isSchedulingNextVisit}>
                                {isSchedulingNextVisit ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CalendarPlus className="mr-2 h-4 w-4"/>}
                                {isSchedulingNextVisit ? "Scheduling..." : "Schedule Next ANC Visit"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule Next ANC Visit for {selectedPatient.fullName}</DialogTitle>
                                <DialogDescription>Select the date and add any relevant notes for the next visit.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nextScheduledDate">Next Visit Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal",!nextScheduledDate && "text-muted-foreground")}
                                            disabled={isSchedulingNextVisit}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {nextScheduledDate ? format(nextScheduledDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={nextScheduledDate} onSelect={setNextScheduledDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nextScheduledNotes">Notes (Optional)</Label>
                                    <Textarea id="nextScheduledNotes" value={nextScheduledNotes} onChange={(e) => setNextScheduledNotes(e.target.value)} placeholder="e.g., Discuss scan results, GTT reminder." disabled={isSchedulingNextVisit}/>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={isSchedulingNextVisit}>Cancel</Button></DialogClose>
                                <Button onClick={handleScheduleNextVisitSubmit} disabled={isSchedulingNextVisit || !nextScheduledDate}>
                                    {isSchedulingNextVisit ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    {isSchedulingNextVisit ? "Scheduling..." : "Schedule Visit"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                 </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Antenatal Visit Log</CardTitle>
                  <CardDescription>Record of all antenatal care visits for {selectedPatient.fullName}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedPatient.antenatalVisits.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>GA</TableHead>
                          <TableHead>Wt(kg)</TableHead>
                          <TableHead>BP</TableHead>
                          <TableHead>FHR</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPatient.antenatalVisits.map((visit) => (
                          <TableRow key={visit.id}>
                            <TableCell>{new Date(visit.date + "T00:00:00").toLocaleDateString()}</TableCell>
                            <TableCell>{visit.gestationalAge}</TableCell>
                            <TableCell>{visit.weightKg}</TableCell>
                            <TableCell>{visit.bp}</TableCell>
                            <TableCell>{visit.fhrBpm} bpm</TableCell>
                            <TableCell className="text-xs max-w-xs truncate" title={visit.notes}>{visit.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No antenatal visits logged yet.</p>
                  )}
                </CardContent>
                <CardFooter>
                    <Dialog open={isNewVisitModalOpen} onOpenChange={setIsNewVisitModalOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!selectedPatient || isLoggingVisit}>
                                {isLoggingVisit ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CalendarPlus className="mr-2 h-4 w-4" />}
                                {isLoggingVisit ? "Logging..." : "Log New Visit"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <form onSubmit={handleLogNewVisitSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Log New Antenatal Visit for {selectedPatient.fullName}</DialogTitle>
                                    <DialogDescription>Enter details for the current antenatal visit.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="visitDate">Visit Date <span className="text-destructive">*</span></Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal",!newVisitForm.visitDate && "text-muted-foreground")}
                                                disabled={isLoggingVisit}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newVisitForm.visitDate ? format(newVisitForm.visitDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={newVisitForm.visitDate} onSelect={(date) => setNewVisitForm(prev => ({...prev, visitDate: date}))} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gestationalAge">Gestational Age (weeks+days)</Label>
                                            <Input id="gestationalAge" name="gestationalAge" value={newVisitForm.gestationalAge} onChange={handleNewVisitFormChange} placeholder="e.g., 12w 3d" disabled={isLoggingVisit}/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weightKg">Weight (kg)</Label>
                                            <Input id="weightKg" name="weightKg" type="number" value={newVisitForm.weightKg} onChange={handleNewVisitFormChange} placeholder="e.g., 65.5" disabled={isLoggingVisit}/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bp">Blood Pressure (mmHg)</Label>
                                            <Input id="bp" name="bp" value={newVisitForm.bp} onChange={handleNewVisitFormChange} placeholder="e.g., 120/80" disabled={isLoggingVisit}/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fhrBpm">Fetal Heart Rate (bpm)</Label>
                                            <Input id="fhrBpm" name="fhrBpm" type="number" value={newVisitForm.fhrBpm} onChange={handleNewVisitFormChange} placeholder="e.g., 140" disabled={isLoggingVisit}/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fundalHeightCm">Fundal Height (cm)</Label>
                                        <Input id="fundalHeightCm" name="fundalHeightCm" type="number" value={newVisitForm.fundalHeightCm} onChange={handleNewVisitFormChange} placeholder="e.g., 20" disabled={isLoggingVisit}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Clinical Notes</Label>
                                        <Textarea id="notes" name="notes" value={newVisitForm.notes} onChange={handleNewVisitFormChange} placeholder="Observations, advice given, etc." disabled={isLoggingVisit}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nextAppointmentDate">Next Appointment Date (Optional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal",!newVisitForm.nextAppointmentDate && "text-muted-foreground")}
                                                disabled={isLoggingVisit}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {newVisitForm.nextAppointmentDate ? format(newVisitForm.nextAppointmentDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={newVisitForm.nextAppointmentDate} onSelect={(date) => setNewVisitForm(prev => ({...prev, nextAppointmentDate: date}))} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline" disabled={isLoggingVisit}>Cancel</Button></DialogClose>
                                    <Button type="submit" disabled={isLoggingVisit || !newVisitForm.visitDate}>
                                        {isLoggingVisit ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                        {isLoggingVisit ? "Logging Visit..." : "Log Visit"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Ultrasound & Lab Results Summary</CardTitle>
                    <CardDescription>Key findings and links to reports for {selectedPatient.fullName}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label className="flex items-center gap-1.5"><ScanSearch className="h-4 w-4 text-primary"/> Latest Ultrasound Summary (Mock)</Label>
                        <Textarea readOnly defaultValue="Anomaly scan at 20w 2d: Normal fetal anatomy. Placenta posterior, clear of os. AFI normal. EFW: 350g. Next scan: Growth scan at 32w." className="text-sm bg-muted/50"/>
                    </div>
                     <div className="space-y-1">
                        <Label className="flex items-center gap-1.5"><Microscope className="h-4 w-4 text-primary"/> Key Lab Results (Mock)</Label>
                        <Textarea readOnly defaultValue="Hb: 11.5 g/dL (12w)\nGTT: Normal (26w)\nUrine Culture: No growth (12w)\nHIV/Syphilis/HepB: Non-reactive" className="text-sm bg-muted/50"/>
                    </div>
                </CardContent>
                 <CardFooter className="gap-2">
                    <Dialog onOpenChange={(open) => { if (!open) {setSelectedLabTests({}); const notesEl = document.getElementById('maternityLabClinicalNotes') as HTMLTextAreaElement; if(notesEl) notesEl.value = ""; }}}>
                      <DialogTrigger asChild>
                        <Button variant="outline" disabled={!selectedPatient || isOrderingLabs}>
                            {isOrderingLabs ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FlaskConical className="mr-2 h-4 w-4"/>}
                            {isOrderingLabs ? "Ordering..." : "Order Labs"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Order Lab Tests for {selectedPatient?.fullName}</DialogTitle>
                          <DialogDescription>Select the required lab tests and add any clinical notes.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                          <Label className="text-base font-semibold">Common Prenatal Tests:</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                            {COMMON_ORDERABLE_LAB_TESTS.map((test) => ( 
                              <div key={test.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`maternity-test-${test.id}`} 
                                    checked={!!selectedLabTests[test.id]}
                                    onCheckedChange={(checked) => handleLabTestSelection(test.id, !!checked)}
                                    disabled={isOrderingLabs}
                                />
                                <Label htmlFor={`maternity-test-${test.id}`} className="text-sm font-normal">
                                  {test.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-2"/>
                          <div className="space-y-2">
                            <Label htmlFor="maternityLabClinicalNotes">Clinical Notes / Reason for Test(s)</Label>
                            <Textarea id="maternityLabClinicalNotes" placeholder="e.g., Routine antenatal screening, specific concerns..." disabled={isOrderingLabs} />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild><Button type="button" variant="outline" disabled={isOrderingLabs}>Cancel</Button></DialogClose>
                          <Button type="submit" onClick={handleSubmitLabOrder} disabled={isOrderingLabs || Object.values(selectedLabTests).every(v => !v)}>
                            {isOrderingLabs ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {isOrderingLabs ? "Submitting..." : "Submit Lab Order"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" disabled={!selectedPatient || isOrderingImaging}>
                            {isOrderingImaging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RadioTower className="mr-2 h-4 w-4"/>}
                            {isOrderingImaging ? "Ordering..." : "Order Imaging Study"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Order Imaging Study for {selectedPatient?.fullName}</DialogTitle>
                          <DialogDescription>Select imaging type, specify details, and add clinical notes.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="maternityImagingType">Imaging Type</Label>
                            <Select disabled={isOrderingImaging} name="maternityImagingType" defaultValue="">
                              <SelectTrigger id="maternityImagingType">
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
                            <Label htmlFor="maternityImagingRegionDetails">Region / Details of Study</Label>
                            <Textarea id="maternityImagingRegionDetails" placeholder="e.g., Anomaly Scan, Pelvic Ultrasound, Fetal Growth Scan, Chest X-ray PA view, MRI Brain..." disabled={isOrderingImaging} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maternityImagingClinicalNotes">Clinical Notes / Reason for Study</Label>
                            <Textarea id="maternityImagingClinicalNotes" placeholder="e.g., Routine 20-week scan, assess fetal well-being, rule out pneumonia..." disabled={isOrderingImaging}/>
                          </div>
                        </div>
                        <DialogFooter>
                           <DialogClose asChild><Button type="button" variant="outline" disabled={isOrderingImaging}>Cancel</Button></DialogClose>
                          <Button type="submit" onClick={handleSubmitImagingOrder} disabled={isOrderingImaging}>
                            {isOrderingImaging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {isOrderingImaging ? "Submitting..." : "Submit Imaging Order"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                 </CardFooter>
              </Card>

               <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Birth Plan & Delivery Notes</CardTitle>
                    <CardDescription>Preferences and important notes for delivery for {selectedPatient.fullName}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Enter patient's birth preferences, specific requests, or important notes for the delivery team..." className="min-h-[100px]"/>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => toast({title: "Mock Action", description:"Birth plan notes saved."})}>Save Birth Plan</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
  )