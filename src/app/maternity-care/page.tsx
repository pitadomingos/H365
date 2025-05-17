
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Baby, Search, CalendarPlus, FileText, ShieldAlert, Microscope, ScanSearch, FlaskConical, RadioTower, Loader2, CalendarIcon } from "lucide-react";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";


interface AntenatalVisit {
  id: string;
  date: string;
  gestationalAge: string; // e.g., "12w 3d"
  weightKg: number | string;
  bp: string; // e.g., "120/80 mmHg"
  fhrBpm: number | string; // Fetal Heart Rate
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
  edd: string; // Estimated Due Date
  gestationalAge: string;
  gravida: number;
  para: number;
  bloodGroup: string;
  rhFactor: string;
  allergies: string[];
  existingConditions: string[];
  riskFactors: string[];
  antenatalVisits: AntenatalVisit[];
}

const mockPatients: MaternityPatient[] = [
  {
    id: "MP001",
    nationalId: "112233445",
    fullName: "Aisha Sharma",
    age: 28,
    gender: "Female",
    photoUrl: "https://placehold.co/100x100.png",
    edd: "2024-12-15",
    gestationalAge: "20w 5d",
    gravida: 1,
    para: 0,
    bloodGroup: "O+",
    rhFactor: "Positive",
    allergies: ["Penicillin"],
    existingConditions: ["Mild Asthma"],
    riskFactors: ["None Identified"],
    antenatalVisits: [
      { id: "AV001", date: "2024-05-10", gestationalAge: "12w 1d", weightKg: 60, bp: "110/70", fhrBpm: 150, fundalHeightCm: "N/A", notes: "First visit, all good.", nextAppointment: "2024-06-10" },
      { id: "AV002", date: "2024-06-12", gestationalAge: "16w 3d", weightKg: 62, bp: "115/75", fhrBpm: 155, fundalHeightCm: 15, notes: "Routine checkup, anomaly scan advised.", nextAppointment: "2024-07-12" },
    ],
  },
   {
    id: "MP002",
    nationalId: "556677889",
    fullName: "Maria Rodriguez",
    age: 32,
    gender: "Female",
    photoUrl: "https://placehold.co/100x100.png",
    edd: "2025-02-20",
    gestationalAge: "10w 2d",
    gravida: 2,
    para: 1,
    bloodGroup: "A-",
    rhFactor: "Negative",
    allergies: [],
    existingConditions: ["Gestational Diabetes (Previous Pregnancy)"],
    riskFactors: ["Advanced Maternal Age", "History of GDM"],
    antenatalVisits: [
      { id: "AV003", date: "2024-07-20", gestationalAge: "8w 0d", weightKg: 70, bp: "120/80", fhrBpm: 160, fundalHeightCm: "N/A", notes: "Booking visit. GTT scheduled.", nextAppointment: "2024-08-20" },
    ],
  }
];

const labTests = [
  { id: "cbc", label: "Complete Blood Count (CBC)" },
  { id: "blood_group_rh", label: "Blood Group & Rh Factor" },
  { id: "urine_re", label: "Urine Routine & Microscopy (Urine R/E)" },
  { id: "gtt", label: "Glucose Tolerance Test (GTT)" },
  { id: "hiv", label: "HIV Screening" },
  { id: "vdrl", label: "VDRL/RPR (Syphilis Test)" },
  { id: "hbsag", label: "Hepatitis B Surface Antigen (HBsAg)" },
  { id: "thyroid", label: "Thyroid Function Tests (TSH, T3, T4)" },
];

// New Visit Form State
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

export default function MaternityCarePage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<MaternityPatient | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false);
  const [isLoggingVisit, setIsLoggingVisit] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState<NewVisitFormState>({
    gestationalAge: "", weightKg: "", bp: "", fhrBpm: "", fundalHeightCm: "", notes: ""
  });

  const [isOrderingLabs, setIsOrderingLabs] = useState(false);
  const [isOrderingImaging, setIsOrderingImaging] = useState(false);
  
  const [isScheduleNextVisitModalOpen, setIsScheduleNextVisitModalOpen] = useState(false);
  const [isSchedulingNextVisit, setIsSchedulingNextVisit] = useState(false);
  const [nextScheduledDate, setNextScheduledDate] = useState<Date | undefined>();
  const [nextScheduledNotes, setNextScheduledNotes] = useState("");


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
    // Simulate API call: GET /api/v1/maternity/patients/{nationalId}
    await new Promise(resolve => setTimeout(resolve, 1000));
    const found = mockPatients.find(p => p.nationalId === searchNationalId);
    if (found) {
      setSelectedPatient(found);
      toast({ title: "Patient Found", description: `${found.fullName}'s maternity record loaded.` });
    } else {
      toast({ variant: "destructive", title: "Not Found", description: "No maternity record found for this National ID." });
    }
    setIsLoadingSearch(false);
  };

  const handleSubmitLabOrder = async () => {
    if (!selectedPatient) return;
    setIsOrderingLabs(true);
    // Simulate API POST to /api/v1/maternity/patients/{patientId}/lab-orders
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({title: "Lab Order Submitted (Mock)", description:`Lab tests ordered for ${selectedPatient?.fullName}.`});
    setIsOrderingLabs(false);
    // Potentially close dialog here if needed
  }

  const handleSubmitImagingOrder = async () => {
     if (!selectedPatient) return;
    setIsOrderingImaging(true);
    // Simulate API POST to /api/v1/maternity/patients/{patientId}/imaging-orders
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({title: "Imaging Order Submitted (Mock)", description:`Imaging study ordered for ${selectedPatient?.fullName}.`});
    setIsOrderingImaging(false);
    // Potentially close dialog here if needed
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
    // Simulate API POST: /api/v1/maternity/patients/{selectedPatient.id}/antenatal-visits
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

    setSelectedPatient(prev => prev ? ({ ...prev, antenatalVisits: [...prev.antenatalVisits, newVisit] }) : null);
    toast({ title: "New Antenatal Visit Logged", description: `Visit on ${newVisit.date} for ${selectedPatient.fullName} saved.`});
    setIsNewVisitModalOpen(false);
    setNewVisitForm({ gestationalAge: "", weightKg: "", bp: "", fhrBpm: "", fundalHeightCm: "", notes: "" }); // Reset form
    setIsLoggingVisit(false);
  };
  
  const handleScheduleNextVisitSubmit = async () => {
    if (!selectedPatient || !nextScheduledDate) {
        toast({ variant: "destructive", title: "Missing Date", description: "Please select a date for the next appointment." });
        return;
    }
    setIsSchedulingNextVisit(true);
    // Simulate API POST or PUT for scheduling
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Next Visit Scheduled (Mock)", description: `Next ANC visit for ${selectedPatient.fullName} scheduled for ${format(nextScheduledDate, "PPP")}.`});
    setIsScheduleNextVisitModalOpen(false);
    setNextScheduledDate(undefined);
    setNextScheduledNotes("");
    setIsSchedulingNextVisit(false);
  };


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Baby className="h-8 w-8" /> Maternity Care Management
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Search Maternity Patient Record</CardTitle>
            <CardDescription>Enter patient's National ID to load their maternity care details (e.g., 112233445 or 556677889 for demo).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                id="searchNationalId"
                placeholder="Enter National ID"
                value={searchNationalId}
                onChange={(e) => setSearchNationalId(e.target.value)}
                className="max-w-xs"
                disabled={isLoadingSearch}
              />
              <Button onClick={handleSearch} disabled={isLoadingSearch || !searchNationalId.trim()}>
                {isLoadingSearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isLoadingSearch ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedPatient && (
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Left Panel: Patient Overview & Risks */}
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
                  <p><strong>EDD:</strong> {new Date(selectedPatient.edd).toLocaleDateString()} ({selectedPatient.gestationalAge})</p>
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
                            <Button variant="outline" className="w-full" disabled={!selectedPatient}>
                                <CalendarPlus className="mr-2 h-4 w-4"/>Schedule Next ANC Visit
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
                                    <Textarea id="nextScheduledNotes" value={nextScheduledNotes} onChange={(e) => setNextScheduledNotes(e.target.value)} placeholder="e.g., Discuss scan results, GTT reminder."/>
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

            {/* Right Panel: Visit Log, Results, Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Antenatal Visit Log</CardTitle>
                  <CardDescription>Record of all antenatal care visits.</CardDescription>
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
                            <TableCell>{new Date(visit.date).toLocaleDateString()}</TableCell>
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
                            <Button disabled={!selectedPatient}>
                                <CalendarPlus className="mr-2 h-4 w-4" /> Log New Visit
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
                                            <Input id="gestationalAge" name="gestationalAge" value={newVisitForm.gestationalAge} onChange={handleNewVisitFormChange} placeholder="e.g., 12w 3d"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weightKg">Weight (kg)</Label>
                                            <Input id="weightKg" name="weightKg" type="number" value={newVisitForm.weightKg} onChange={handleNewVisitFormChange} placeholder="e.g., 65.5"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bp">Blood Pressure (mmHg)</Label>
                                            <Input id="bp" name="bp" value={newVisitForm.bp} onChange={handleNewVisitFormChange} placeholder="e.g., 120/80"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fhrBpm">Fetal Heart Rate (bpm)</Label>
                                            <Input id="fhrBpm" name="fhrBpm" type="number" value={newVisitForm.fhrBpm} onChange={handleNewVisitFormChange} placeholder="e.g., 140"/>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fundalHeightCm">Fundal Height (cm)</Label>
                                        <Input id="fundalHeightCm" name="fundalHeightCm" type="number" value={newVisitForm.fundalHeightCm} onChange={handleNewVisitFormChange} placeholder="e.g., 20"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Clinical Notes</Label>
                                        <Textarea id="notes" name="notes" value={newVisitForm.notes} onChange={handleNewVisitFormChange} placeholder="Observations, advice given, etc."/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nextAppointmentDate">Next Appointment Date (Optional)</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-full justify-start text-left font-normal",!newVisitForm.nextAppointmentDate && "text-muted-foreground")}
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
                    <CardDescription>Key findings and links to reports.</CardDescription>
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
                    <Dialog>
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
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                          <Label className="text-base font-semibold">Common Prenatal Tests:</Label>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {labTests.map((test) => (
                              <div key={test.id} className="flex items-center space-x-2">
                                <Checkbox id={`test-${test.id}`} />
                                <Label htmlFor={`test-${test.id}`} className="text-sm font-normal">
                                  {test.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-2"/>
                          <div className="space-y-2">
                            <Label htmlFor="labClinicalNotes">Clinical Notes / Reason for Test(s)</Label>
                            <Textarea id="labClinicalNotes" placeholder="e.g., Routine antenatal screening, specific concerns..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild><Button type="button" variant="outline" disabled={isOrderingLabs}>Cancel</Button></DialogClose>
                          <Button type="submit" onClick={handleSubmitLabOrder} disabled={isOrderingLabs}>
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
                            <Label htmlFor="imagingType">Imaging Type</Label>
                            <Select>
                              <SelectTrigger id="imagingType">
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
                            <Label htmlFor="imagingRegionDetails">Region / Details of Study</Label>
                            <Textarea id="imagingRegionDetails" placeholder="e.g., Anomaly Scan, Pelvic Ultrasound, Fetal Growth Scan, Chest X-ray PA view, MRI Brain..." />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="imagingClinicalNotes">Clinical Notes / Reason for Study</Label>
                            <Textarea id="imagingClinicalNotes" placeholder="e.g., Routine 20-week scan, assess fetal well-being, rule out pneumonia..." />
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
                    <CardDescription>Preferences and important notes for delivery (placeholder).</CardDescription>
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
    </AppShell>
  );
}

