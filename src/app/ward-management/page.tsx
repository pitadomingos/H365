
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BedDouble, Users, ListFilter, PlusCircle, LogOutIcon, CheckCircle2, ArrowRightLeft, FileText, Pill, MessageSquare, Loader2, Hospital, Activity, UserCheck, Bed } from "lucide-react"; // Added Bed
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";


// --- Data Structures ---
interface WardSummary {
  id: string;
  name: string;
}

interface BedData { // Renamed from Bed to BedData to avoid conflict with lucide-react Bed icon
    id: string;
    bedNumber: string;
    status: "Available" | "Occupied" | "Cleaning";
    patientName?: string;
    patientId?: string;
}

interface PatientInWard {
  admissionId: string; 
  patientId: string;
  name: string;
  bedNumber: string;
  admittedDate: string;
  primaryDiagnosis?: string;
}

interface WardDetails {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  patients: PatientInWard[];
  beds: BedData[];
}

interface MedicationScheduleItem {
  medication: string;
  dosage: string;
  time: string;
  status: "Administered" | "Pending" | "Skipped";
}

interface DoctorNote {
  date: string;
  doctor: string;
  note: string;
}

interface AdmittedPatientFullDetails {
  admissionId: string;
  patientId: string;
  name: string;
  wardName: string;
  bedNumber: string;
  treatmentPlan: string;
  medicationSchedule: MedicationScheduleItem[];
  doctorNotes: DoctorNote[];
}

// --- Mock Data ---
const mockWardSummariesData: WardSummary[] = [
    { id: "W001", name: "General Medicine Ward A" },
    { id: "W002", name: "Surgical Ward B" },
    { id: "W003", name: "Pediatrics Ward C" },
    { id: "W004", name: "Maternity Ward D" },
];

const mockWardDetailsData: Record<string, WardDetails> = {
  "W001": {
    id: "W001", name: "General Medicine Ward A", totalBeds: 20, occupiedBeds: 15, availableBeds: 5, occupancyRate: 75,
    patients: [
      { admissionId: "ADM001", patientId: "P001", name: "Eva Green", bedNumber: "Bed 3", admittedDate: "2024-07-28", primaryDiagnosis: "Pneumonia" },
      { admissionId: "ADM002", patientId: "P002", name: "Tom Hanks", bedNumber: "Bed 5", admittedDate: "2024-07-29", primaryDiagnosis: "CHF Exacerbation" },
    ],
    beds: Array.from({ length: 20 }).map((_, i) => ({
        id: `B001-${i+1}`, bedNumber: `Bed ${i+1}`,
        status: i < 15 ? (Math.random() > 0.9 ? "Cleaning" : "Occupied") : "Available",
        patientName: i < 15 ? (i === 2 ? "Eva Green" : i === 4 ? "Tom Hanks" : `Patient ${String.fromCharCode(65+i)}`) : undefined,
        patientId: i < 15 ? (i === 2 ? "P001" : i === 4 ? "P002" : `P${String.fromCharCode(65+i)}`) : undefined,
    }))
  },
  "W002": {
    id: "W002", name: "Surgical Ward B", totalBeds: 15, occupiedBeds: 10, availableBeds: 5, occupancyRate: 66.6,
    patients: [
      { admissionId: "ADM003", patientId: "P003", name: "Lucy Liu", bedNumber: "Bed 1", admittedDate: "2024-07-30", primaryDiagnosis: "Post-Appendectomy" },
    ],
     beds: Array.from({ length: 15 }).map((_, i) => ({
        id: `B002-${i+1}`, bedNumber: `Bed ${i+1}`,
        status: i < 10 ? "Occupied" : (Math.random() > 0.8 ? "Cleaning" : "Available"),
        patientName: i < 10 ? (i === 0 ? "Lucy Liu" : `Patient S${String.fromCharCode(65+i)}`) : undefined,
        patientId: i < 10 ? (i === 0 ? "P003" : `PS${String.fromCharCode(65+i)}`) : undefined,
    }))
  },
   "W003": {
    id: "W003", name: "Pediatrics Ward C", totalBeds: 10, occupiedBeds: 5, availableBeds: 5, occupancyRate: 50,
    patients: [
      { admissionId: "ADM004", patientId: "P004", name: "Kevin McCallister", bedNumber: "Bed 2", admittedDate: "2024-07-31", primaryDiagnosis: "Asthma Attack" },
    ],
     beds: Array.from({ length: 10 }).map((_, i) => ({
        id: `B003-${i+1}`, bedNumber: `Bed ${i+1}`,
        status: i < 5 ? "Occupied" : "Available",
        patientName: i < 5 ? (i === 1 ? "Kevin McCallister" : `Child ${String.fromCharCode(65+i)}`) : undefined,
        patientId: i < 5 ? (i === 1 ? "P004" : `PC${String.fromCharCode(65+i)}`) : undefined,
    }))
  },
   "W004": {
    id: "W004", name: "Maternity Ward D", totalBeds: 12, occupiedBeds: 8, availableBeds: 4, occupancyRate: 66.7,
    patients: [
      { admissionId: "ADM005", patientId: "P005", name: "Sarah Connor", bedNumber: "Bed 7", admittedDate: "2024-07-30", primaryDiagnosis: "Post-Partum Observation" },
    ],
     beds: Array.from({ length: 12 }).map((_, i) => ({
        id: `B004-${i+1}`, bedNumber: `Bed ${i+1}`,
        status: i < 8 ? "Occupied" : "Available",
        patientName: i < 8 ? (i === 6 ? "Sarah Connor" : `Mother ${String.fromCharCode(65+i)}`) : undefined,
        patientId: i < 8 ? (i === 6 ? "P005" : `PM${String.fromCharCode(65+i)}`) : undefined,
    }))
  }
};

const mockAdmittedPatientFullDetailsData: Record<string, AdmittedPatientFullDetails> = {
  "ADM001": {
    admissionId: "ADM001", patientId: "P001", name: "Eva Green", wardName: "General Medicine Ward A", bedNumber: "Bed 3",
    treatmentPlan: "IV Ceftriaxone 1g OD. Oxygen support PRN. Monitor vitals Q4H. Chest physiotherapy BID.",
    medicationSchedule: [
      { medication: "Ceftriaxone 1g IV", dosage: "1g", time: "08:00", status: "Administered" },
      { medication: "Paracetamol 500mg PO", dosage: "500mg", time: "12:00", status: "Pending" },
    ],
    doctorNotes: [{ date: "2024-07-30", doctor: "Dr. Smith", note: "Patient responding well. Continue plan." }],
  },
  "ADM002": {
    admissionId: "ADM002", patientId: "P002", name: "Tom Hanks", wardName: "General Medicine Ward A", bedNumber: "Bed 5",
    treatmentPlan: "Furosemide 40mg IV BD. Fluid restriction 1.5L/day. Daily weights. Monitor electrolytes.",
    medicationSchedule: [{ medication: "Furosemide 40mg IV", dosage: "40mg", time: "09:00", status: "Administered" }],
    doctorNotes: [{ date: "2024-07-30", doctor: "Dr. House", note: "Mild improvement in edema." }],
  },
  "ADM003": {
    admissionId: "ADM003", patientId: "P003", name: "Lucy Liu", wardName: "Surgical Ward B", bedNumber: "Bed 1",
    treatmentPlan: "Post-op day 1. Pain management with Tramadol 50mg PO Q6H PRN. Wound care. Encourage mobilization.",
    medicationSchedule: [{ medication: "Tramadol 50mg PO", dosage: "50mg", time: "PRN", status: "Pending" }],
    doctorNotes: [{ date: "2024-07-30", doctor: "Dr. Grey", note: "Surgical site clean. Patient ambulating." }],
  },
  "ADM004": {
    admissionId: "ADM004", patientId: "P004", name: "Kevin McCallister", wardName: "Pediatrics Ward C", bedNumber: "Bed 2",
    treatmentPlan: "Nebulized Salbutamol Q4H. Prednisolone PO. Monitor oxygen saturation.",
    medicationSchedule: [{ medication: "Salbutamol Neb", dosage: "2.5mg", time: "10:00", status: "Administered" }],
    doctorNotes: [{ date: "2024-07-31", doctor: "Dr. Carter", note: "Wheezing reduced. Stable." }],
  },
  "ADM005": {
    admissionId: "ADM005", patientId: "P005", name: "Sarah Connor", wardName: "Maternity Ward D", bedNumber: "Bed 7",
    treatmentPlan: "Routine post-natal care. Monitor for bleeding. Pain relief PRN.",
    medicationSchedule: [{ medication: "Ibuprofen 400mg PO", dosage: "400mg", time: "PRN", status: "Pending" }],
    doctorNotes: [{ date: "2024-07-30", doctor: "Dr. Greene", note: "Patient and baby doing well." }],
  },
};

export default function WardManagementPage() {
  const [allWardsData, setAllWardsData] = useState<WardSummary[]>([]);
  const [isLoadingAllWards, setIsLoadingAllWards] = useState(true);

  const [selectedWardId, setSelectedWardId] = useState<string | undefined>();
  const [currentWardDetails, setCurrentWardDetails] = useState<WardDetails | null>(null);
  const [isLoadingCurrentWardDetails, setIsLoadingCurrentWardDetails] = useState(false);

  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<PatientInWard | null>(null);
  const [currentAdmittedPatientFullDetails, setCurrentAdmittedPatientFullDetails] = useState<AdmittedPatientFullDetails | null>(null);
  const [isLoadingSelectedPatientDetails, setIsLoadingSelectedPatientDetails] = useState(false);
  
  const [newDoctorNote, setNewDoctorNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdatingMedication, setIsUpdatingMedication] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Fetch all wards list on mount
  useEffect(() => {
    setIsLoadingAllWards(true);
    // Simulate API call: GET /api/v1/wards
    setTimeout(() => {
      setAllWardsData(mockWardSummariesData);
      setIsLoadingAllWards(false);
    }, 800);
  }, []);

  // Fetch details for the selected ward
  useEffect(() => {
    if (selectedWardId) {
      setIsLoadingCurrentWardDetails(true);
      setCurrentWardDetails(null); 
      setSelectedPatientForDetails(null); 
      setCurrentAdmittedPatientFullDetails(null);
      // Simulate API call: GET /api/v1/wards/{selectedWardId}/details
      setTimeout(() => {
        setCurrentWardDetails(mockWardDetailsData[selectedWardId] || null);
        setIsLoadingCurrentWardDetails(false);
      }, 1000);
    } else {
      setCurrentWardDetails(null);
      setSelectedPatientForDetails(null);
      setCurrentAdmittedPatientFullDetails(null);
    }
  }, [selectedWardId]);

  // Fetch full details for the selected patient within the ward
  useEffect(() => {
    if (selectedPatientForDetails) {
      setIsLoadingSelectedPatientDetails(true);
      setCurrentAdmittedPatientFullDetails(null);
      // Simulate API call: GET /api/v1/admissions/{selectedPatientForDetails.admissionId}
      setTimeout(() => {
        setCurrentAdmittedPatientFullDetails(mockAdmittedPatientFullDetailsData[selectedPatientForDetails.admissionId] || null);
        setIsLoadingSelectedPatientDetails(false);
      }, 800);
    } else {
        setCurrentAdmittedPatientFullDetails(null);
    }
  }, [selectedPatientForDetails]);


  const handleAddNote = async () => {
    if (!newDoctorNote.trim() || !currentAdmittedPatientFullDetails) return;
    setIsAddingNote(true);
    // Simulate API call: POST /api/v1/admissions/{admissionId}/doctor-notes
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newNoteEntry: DoctorNote = {
        date: new Date().toISOString().split('T')[0],
        doctor: "Dr. Current User (Mock)",
        note: newDoctorNote
    };
    setCurrentAdmittedPatientFullDetails(prev => prev ? ({
        ...prev,
        doctorNotes: [...prev.doctorNotes, newNoteEntry]
    }) : null);
    toast({title: "Note Saved (Mock)", description: "New doctor's note added."});
    setNewDoctorNote("");
    setIsAddingNote(false);
  };

  const handleUpdateMedication = async () => {
    setIsUpdatingMedication(true);
     // Simulate API call: PUT /api/v1/admissions/{admissionId}/medication-schedule
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({title: "Medication Log Updated (Mock)", description: "Status of medications updated."});
    setIsUpdatingMedication(false);
  };

  const handleDischarge = async () => {
    if (!currentAdmittedPatientFullDetails || !selectedWardId) return;
    setIsDischarging(true);
    // Simulate API call: PUT /api/v1/admissions/{admissionId}/discharge
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Patient Discharged (Mock)", description: `${currentAdmittedPatientFullDetails.name} has been processed for discharge.` });
    
    const admissionIdToDischarge = currentAdmittedPatientFullDetails.admissionId;
    const patientIdToClearFromBed = currentAdmittedPatientFullDetails.patientId;

    setSelectedPatientForDetails(null); 
    setCurrentAdmittedPatientFullDetails(null);
    
    // Re-fetch current ward details to update patient list and bed status
    // This is a simplified local update for mock purposes
    setCurrentWardDetails(prevDetails => {
        if (!prevDetails) return null;
        const updatedPatients = prevDetails.patients.filter(p => p.admissionId !== admissionIdToDischarge);
        const updatedBeds = prevDetails.beds.map(bed => 
            bed.patientId === patientIdToClearFromBed ? { ...bed, status: "Cleaning" as "Cleaning", patientId: undefined, patientName: undefined } : bed
        );
        const occupiedBeds = updatedBeds.filter(b => b.status === "Occupied").length;

        return {
            ...prevDetails,
            patients: updatedPatients,
            beds: updatedBeds,
            occupiedBeds: occupiedBeds,
            availableBeds: prevDetails.totalBeds - occupiedBeds,
            occupancyRate: (occupiedBeds / prevDetails.totalBeds) * 100,
        };
    });
    setIsDischarging(false);
  };
  
  const handleTransfer = async () => {
    if (!currentAdmittedPatientFullDetails) return;
    setIsTransferring(true);
    // Simulate API call: PUT /api/v1/admissions/{admissionId}/transfer
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Patient Transfer Initiated (Mock)", description: `Transfer process for ${currentAdmittedPatientFullDetails.name} has started.` });
    setIsTransferring(false);
  };


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BedDouble className="h-8 w-8" /> Ward Management
          </h1>
          <Button variant="outline" disabled>
            <ListFilter className="mr-2 h-4 w-4" /> Filter Options
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Hospital className="h-6 w-6 text-primary"/>Select Ward & View Dashboard</CardTitle>
            <CardDescription>Choose a ward to view its specific occupancy, patient list, and bed status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-md">
              <Label htmlFor="selectWard">Select Ward</Label>
              <Select 
                value={selectedWardId} 
                onValueChange={setSelectedWardId}
                disabled={isLoadingAllWards || isLoadingCurrentWardDetails}
              >
                <SelectTrigger id="selectWard">
                  <SelectValue placeholder="Select a ward..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingAllWards && <SelectItem value="loading" disabled>Loading wards...</SelectItem>}
                  {!isLoadingAllWards && allWardsData.length === 0 && <SelectItem value="no-wards" disabled>No wards found.</SelectItem>}
                  {!isLoadingAllWards && allWardsData.map(ward => (
                    <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoadingCurrentWardDetails && (
                 <div className="flex items-center justify-center py-6 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" /> Loading ward details...
                </div>
            )}

            {currentWardDetails && !isLoadingCurrentWardDetails && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-3">
                <h3 className="text-lg font-semibold">{currentWardDetails.name} - Dashboard</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><strong>Total Beds:</strong> {currentWardDetails.totalBeds}</div>
                  <div><strong>Occupied:</strong> {currentWardDetails.occupiedBeds}</div>
                  <div><strong>Available:</strong> {currentWardDetails.availableBeds}</div>
                  <div><strong>Occupancy:</strong> {currentWardDetails.occupancyRate.toFixed(1)}%</div>
                </div>
                <Progress value={currentWardDetails.occupancyRate} className="h-3 mt-1" />
              </div>
            )}
          </CardContent>
        </Card>

        {selectedWardId && currentWardDetails && !isLoadingCurrentWardDetails && (
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Patients in {currentWardDetails.name}</CardTitle>
                <CardDescription>Click on a patient to view detailed care information.</CardDescription>
              </CardHeader>
              <CardContent>
                {currentWardDetails.patients.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Bed</TableHead>
                        <TableHead>Admitted</TableHead>
                        <TableHead>Diagnosis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentWardDetails.patients.map((patient) => (
                        <TableRow 
                          key={patient.admissionId} 
                          onClick={() => setSelectedPatientForDetails(patient)}
                          className={cn(
                            "cursor-pointer hover:bg-muted/60", 
                            selectedPatientForDetails?.admissionId === patient.admissionId && "bg-accent/30 dark:bg-accent/20"
                           )}
                        >
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.bedNumber}</TableCell>
                          <TableCell className="text-xs">{new Date(patient.admittedDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-xs">{patient.primaryDiagnosis || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">No patients currently admitted to this ward.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary"/>Bed Status - {currentWardDetails.name}</CardTitle>
                <CardDescription>Overview of all beds in this ward.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-80 overflow-y-auto pr-1">
                  {currentWardDetails.beds.map(bed => (
                    <Badge 
                        key={bed.id} 
                        variant={
                            bed.status === 'Occupied' ? 'destructive' : 
                            bed.status === 'Cleaning' ? 'secondary' : 'default' // default (teal) for Available
                        } 
                        className="h-16 w-full flex flex-col items-center justify-center p-1 text-center shadow-sm hover:shadow-md transition-shadow"
                        title={bed.status === 'Occupied' && bed.patientName ? `Occupied by: ${bed.patientName}` : bed.status}
                    >
                       <Bed className="h-5 w-5 mb-0.5" />
                       <span className="text-xs font-medium">{bed.bedNumber}</span>
                       {bed.status === 'Occupied' && bed.patientName && (
                           <span className="text-[9px] truncate w-full opacity-80">
                               {bed.patientName.split(' ')[0]}
                           </span>
                       )}
                       {bed.status !== 'Occupied' && (
                           <span className="text-[9px] opacity-80">{bed.status}</span>
                       )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedPatientForDetails && (
          <Card className="lg:col-span-full shadow-sm mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCheck className="h-6 w-6 text-primary"/>In-Patient Care: {currentAdmittedPatientFullDetails?.name || selectedPatientForDetails.name}</CardTitle>
                <CardDescription>Details for {currentAdmittedPatientFullDetails?.bedNumber || selectedPatientForDetails.bedNumber} in {currentWardDetails?.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingSelectedPatientDetails && (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" /> Loading patient care details...
                </div>
              )}
              {!isLoadingSelectedPatientDetails && currentAdmittedPatientFullDetails && (
                <>
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><FileText className="mr-2 h-4 w-4 text-primary" /> Treatment Plan Summary</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{currentAdmittedPatientFullDetails.treatmentPlan}</p>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><Pill className="mr-2 h-4 w-4 text-primary" /> Medication Schedule</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Medication</TableHead>
                          <TableHead className="text-xs">Time</TableHead>
                          <TableHead className="text-xs text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentAdmittedPatientFullDetails.medicationSchedule.map((med, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-xs font-medium">{med.medication} <span className="text-muted-foreground">({med.dosage})</span></TableCell>
                            <TableCell className="text-xs">{med.time}</TableCell>
                            <TableCell className="text-xs text-right">
                              <Badge variant={med.status === "Administered" ? "default" : med.status === "Pending" ? "secondary" : "outline"} className="text-xs">
                                {med.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleUpdateMedication} disabled={isUpdatingMedication}>
                        {isUpdatingMedication ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        {isUpdatingMedication ? "Updating..." : "Log/Update Medications"}
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-primary" /> Doctor's Notes</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {currentAdmittedPatientFullDetails.doctorNotes.map((note, index) => (
                        <div key={index} className="text-xs p-2 border rounded-md bg-muted/30">
                          <p className="font-medium">{note.doctor} - <span className="text-muted-foreground">{new Date(note.date).toLocaleDateString()}</span></p>
                          <p className="mt-0.5">{note.note}</p>
                        </div>
                      ))}
                      {currentAdmittedPatientFullDetails.doctorNotes.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No notes recorded yet.</p>}
                    </div>
                    <Textarea placeholder="Add new note..." className="mt-2 text-xs" rows={2} value={newDoctorNote} onChange={(e) => setNewDoctorNote(e.target.value)} disabled={isAddingNote}/>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleAddNote} disabled={isAddingNote || !newDoctorNote.trim()}>
                       {isAddingNote ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                       {isAddingNote ? "Adding..." : "Add Note"}
                    </Button>
                  </div>
                </>
              )}
              {!isLoadingSelectedPatientDetails && !currentAdmittedPatientFullDetails && selectedPatientForDetails && (
                 <p className="text-center py-6 text-muted-foreground">Could not load full details for this patient.</p>
              )}
            </CardContent>
            {currentAdmittedPatientFullDetails && (
                <CardFooter className="border-t pt-4 flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDischarge} disabled={isDischarging || isTransferring}>
                        {isDischarging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOutIcon className="mr-2 h-4 w-4" />}
                        {isDischarging ? "Discharging..." : `Discharge ${currentAdmittedPatientFullDetails.name.split(' ')[0]}`}
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleTransfer} disabled={isDischarging || isTransferring}>
                        {isTransferring ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
                        {isTransferring ? "Transferring..." : `Transfer ${currentAdmittedPatientFullDetails.name.split(' ')[0]}`}
                    </Button>
                </CardFooter>
            )}
          </Card>
        )}

        {!selectedWardId && !isLoadingAllWards && allWardsData.length > 0 &&(
            <Card className="shadow-sm">
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">Please select a ward to view its details and manage patients.</p>
                </CardContent>
            </Card>
        )}
         {!isLoadingAllWards && allWardsData.length === 0 && (
            <Card className="shadow-sm">
                <CardContent className="py-10">
                    <p className="text-center text-muted-foreground">No wards available. Please configure wards in the system.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </AppShell>
  );
}
    

