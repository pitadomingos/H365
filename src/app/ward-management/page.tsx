
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BedDouble, Users, LogOutIcon, CheckCircle2, ArrowRightLeft, FileText, Pill, MessageSquare, Loader2, Hospital, Activity, UserCheck, Bed, Edit } from "lucide-react";
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
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
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

// --- Data Structures (aligned with API thinking) ---
interface WardSummary {
  id: string;
  name: string;
  totalBeds?: number; 
  occupiedBeds?: number;
  occupancyRate?: number;
}

interface BedData {
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
  admittedDate: string; // YYYY-MM-DD
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
  medicationItemId: string;
  medication: string;
  dosage: string;
  time: string;
  status: "Administered" | "Pending" | "Skipped";
}

interface DoctorNote {
  noteId: string; 
  date: string; // ISO DateTime string
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
    { id: "W001", name: "General Medicine Ward A", totalBeds: 20, occupiedBeds: 15, occupancyRate: 75 },
    { id: "W002", name: "Surgical Ward B", totalBeds: 15, occupiedBeds: 10, occupancyRate: 66.6 },
    { id: "W003", name: "Pediatrics Ward C", totalBeds: 10, occupiedBeds: 5, occupancyRate: 50 },
    { id: "W004", name: "Maternity Ward D", totalBeds: 12, occupiedBeds: 8, occupancyRate: 66.7 },
];

const mockWardDetailsData: Record<string, WardDetails> = {
  "W001": {
    id: "W001", name: "General Medicine Ward A", totalBeds: 20, occupiedBeds: 2, availableBeds: 18, occupancyRate: 10,
    patients: [
      { admissionId: "ADM001", patientId: "P001", name: "Eva Green", bedNumber: "Bed 3", admittedDate: "2024-07-28", primaryDiagnosis: "Pneumonia" },
      { admissionId: "ADM002", patientId: "P002", name: "Tom Hanks", bedNumber: "Bed 5", admittedDate: "2024-07-29", primaryDiagnosis: "CHF Exacerbation" },
    ],
    beds: Array.from({ length: 20 }).map((_, i) => ({
        id: `B001-${i+1}`, bedNumber: `Bed ${i+1}`,
        status: (i === 2 || i === 4) ? "Occupied" : (Math.random() > 0.95 ? "Cleaning" : "Available"),
        patientName: i === 2 ? "Eva Green" : i === 4 ? "Tom Hanks" : undefined,
        patientId: i === 2 ? "P001" : i === 4 ? "P002" : undefined,
    }))
  },
   "W002": {
    id: "W002", name: "Surgical Ward B", totalBeds: 15, occupiedBeds: 1, availableBeds: 14, occupancyRate: 6.6,
    patients: [ { admissionId: "ADM003", patientId: "P003", name: "Lucy Liu", bedNumber: "Bed 1", admittedDate: "2024-07-30", primaryDiagnosis: "Post-Appendectomy" } ],
    beds: Array.from({ length: 15 }).map((_, i) => ({ id: `B002-${i+1}`, bedNumber: `Bed ${i+1}`, status: i === 0 ? "Occupied" : "Available", patientName: i === 0 ? "Lucy Liu" : undefined, patientId: i === 0 ? "P003" : undefined }))
  },
   "W003": {
    id: "W003", name: "Pediatrics Ward C", totalBeds: 10, occupiedBeds: 1, availableBeds: 9, occupancyRate: 10,
    patients: [ { admissionId: "ADM004", patientId: "P004", name: "Kevin McCallister", bedNumber: "Bed 2", admittedDate: "2024-07-31", primaryDiagnosis: "Asthma Attack" } ],
    beds: Array.from({ length: 10 }).map((_, i) => ({ id: `B003-${i+1}`, bedNumber: `Bed ${i+1}`, status: i === 1 ? "Occupied" : "Available", patientName: i === 1 ? "Kevin McCallister" : undefined, patientId: i === 1 ? "P004" : undefined }))
  },
   "W004": {
    id: "W004", name: "Maternity Ward D", totalBeds: 12, occupiedBeds: 1, availableBeds: 11, occupancyRate: 8.3,
    patients: [ { admissionId: "ADM005", patientId: "P005", name: "Sarah Connor", bedNumber: "Bed 7", admittedDate: "2024-07-30", primaryDiagnosis: "Post-Partum Observation" } ],
    beds: Array.from({ length: 12 }).map((_, i) => ({ id: `B004-${i+1}`, bedNumber: `Bed ${i+1}`, status: i === 6 ? "Occupied" : "Available", patientName: i === 6 ? "Sarah Connor" : undefined, patientId: i === 6 ? "PM005" : undefined }))
  }
};

const mockAdmittedPatientFullDetailsData: Record<string, AdmittedPatientFullDetails> = {
  "ADM001": {
    admissionId: "ADM001", patientId: "P001", name: "Eva Green", wardName: "General Medicine Ward A", bedNumber: "Bed 3",
    treatmentPlan: "IV Ceftriaxone 1g OD. Oxygen support PRN. Monitor vitals Q4H. Chest physiotherapy BID.",
    medicationSchedule: [
      { medicationItemId: "MEDSCH001-A", medication: "Ceftriaxone 1g IV", dosage: "1g", time: "08:00", status: "Administered" },
      { medicationItemId: "MEDSCH001-B", medication: "Paracetamol 500mg PO", dosage: "500mg", time: "12:00", status: "Pending" },
      { medicationItemId: "MEDSCH001-C", medication: "Salbutamol Neb", dosage: "2.5mg", time: "14:00", status: "Pending" },
    ],
    doctorNotes: [{ noteId: "DN001-A", date: new Date(Date.now() - 86400000).toISOString(), doctor: "Dr. Smith", note: "Patient responding well. Continue plan." }, {noteId: "DN001-B", date: new Date().toISOString(), doctor: "Dr. House", note: "Reviewed chest X-ray, slight improvement in consolidation."}],
  },
  "ADM002": {
    admissionId: "ADM002", patientId: "P002", name: "Tom Hanks", wardName: "General Medicine Ward A", bedNumber: "Bed 5",
    treatmentPlan: "Furosemide 40mg IV BD. Fluid restriction 1.5L/day. Daily weights. Monitor electrolytes.",
    medicationSchedule: [{ medicationItemId: "MEDSCH002-A", medication: "Furosemide 40mg IV", dosage: "40mg", time: "09:00", status: "Administered" }],
    doctorNotes: [{ noteId: "DN002-A", date: new Date().toISOString(), doctor: "Dr. House", note: "Mild improvement in edema." }],
  },
   "ADM003": {
    admissionId: "ADM003", patientId: "P003", name: "Lucy Liu", wardName: "Surgical Ward B", bedNumber: "Bed 1",
    treatmentPlan: "Post-op day 1. Pain management with Tramadol 50mg PO Q6H PRN. Wound care. Encourage mobilization.",
    medicationSchedule: [{ medicationItemId: "MEDSCH003-A", medication: "Tramadol 50mg PO", dosage: "50mg", time: "PRN", status: "Pending" }],
    doctorNotes: [{ noteId: "DN003-A", date: new Date().toISOString(), doctor: "Dr. Grey", note: "Surgical site clean. Patient ambulating." }],
  },
  "ADM004": {
    admissionId: "ADM004", patientId: "P004", name: "Kevin McCallister", wardName: "Pediatrics Ward C", bedNumber: "Bed 2",
    treatmentPlan: "Nebulized Salbutamol Q4H. Prednisolone PO. Monitor oxygen saturation.",
    medicationSchedule: [{ medicationItemId: "MEDSCH004-A", medication: "Salbutamol Neb", dosage: "2.5mg", time: "10:00", status: "Administered" }],
    doctorNotes: [{ noteId: "DN004-A", date: new Date().toISOString(), doctor: "Dr. Carter", note: "Wheezing reduced. Stable." }],
  },
  "ADM005": {
    admissionId: "ADM005", patientId: "P005", name: "Sarah Connor", wardName: "Maternity Ward D", bedNumber: "Bed 7",
    treatmentPlan: "Routine post-natal care. Monitor for bleeding. Pain relief PRN.",
    medicationSchedule: [{ medicationItemId: "MEDSCH005-A", medication: "Ibuprofen 400mg PO", dosage: "400mg", time: "PRN", status: "Pending" }],
    doctorNotes: [{ noteId: "DN005-A", date: new Date().toISOString(), doctor: "Dr. Greene", note: "Patient and baby doing well." }],
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
  
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [medicationScheduleInModal, setMedicationScheduleInModal] = useState<MedicationScheduleItem[]>([]);
  const [isSavingMedicationUpdates, setIsSavingMedicationUpdates] = useState(false);

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
        const details = mockWardDetailsData[selectedWardId];
        if (details) {
            const occupiedBeds = details.patients.length;
            const availableBeds = details.totalBeds - occupiedBeds;
            const occupancyRate = details.totalBeds > 0 ? (occupiedBeds / details.totalBeds) * 100 : 0;
            setCurrentWardDetails({
                ...details,
                occupiedBeds,
                availableBeds,
                occupancyRate,
            });
        } else {
            setCurrentWardDetails(null);
            toast({variant: "destructive", title: "Error", description: `Could not load details for ward ID ${selectedWardId}`});
        }
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
    const payload = {
        doctorId: "doc-currentUser-mockId", 
        note: newDoctorNote
    };
    console.log("Submitting to /api/v1/admissions/{admissionId}/doctor-notes (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newNoteEntry: DoctorNote = {
        noteId: `DN${Date.now()}`,
        date: new Date().toISOString(),
        doctor: "Dr. Current User (Mock)",
        note: newDoctorNote
    };
    setCurrentAdmittedPatientFullDetails(prev => prev ? ({
        ...prev,
        doctorNotes: [newNoteEntry, ...prev.doctorNotes] // Add to top for recent first
    }) : null);
    toast({title: "Note Saved (Mock)", description: "New doctor's note added."});
    setNewDoctorNote("");
    setIsAddingNote(false);
  };

  const handleOpenMedicationModal = () => {
    if (!currentAdmittedPatientFullDetails) return;
    // Create a deep copy to avoid direct state mutation before saving
    setMedicationScheduleInModal(
      currentAdmittedPatientFullDetails.medicationSchedule.map(med => ({ ...med }))
    );
    setIsMedicationModalOpen(true);
  };

  const handleMedicationStatusChangeInModal = (itemId: string, newStatus: MedicationScheduleItem["status"]) => {
    setMedicationScheduleInModal(prevSchedule =>
      prevSchedule.map(item =>
        item.medicationItemId === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleSaveMedicationUpdates = async () => {
    if (!currentAdmittedPatientFullDetails) return;
    setIsSavingMedicationUpdates(true);
    
    const payload = {
        admissionId: currentAdmittedPatientFullDetails.admissionId,
        updatedSchedule: medicationScheduleInModal 
    };
    console.log("Submitting to /api/v1/admissions/{admissionId}/medication-schedule (mock with full schedule):", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCurrentAdmittedPatientFullDetails(prev => prev ? ({
        ...prev,
        medicationSchedule: medicationScheduleInModal
    }) : null);
    toast({title: "Medication Log Updated (Mock)", description: "Medication schedule statuses have been updated."});
    setIsMedicationModalOpen(false);
    setIsSavingMedicationUpdates(false);
  };

  const handleDischarge = async () => {
    if (!currentAdmittedPatientFullDetails || !selectedWardId) return;
    setIsDischarging(true);
    const payload = {
        dischargeDate: new Date().toISOString(),
        dischargeSummary: "Patient stable for discharge. Follow up with GP.",
        dischargedBy: "doc-currentUser-mockId"
    };
    console.log("Submitting to /api/v1/admissions/{admissionId}/discharge (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ title: "Patient Discharged (Mock)", description: `${currentAdmittedPatientFullDetails.name} has been processed for discharge.` });
    
    const admissionIdToDischarge = currentAdmittedPatientFullDetails.admissionId;
    const patientIdToClearFromBed = currentAdmittedPatientFullDetails.patientId;

    setSelectedPatientForDetails(null); 
    setCurrentAdmittedPatientFullDetails(null);
    
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
    const payload = {
        transferDate: new Date().toISOString(),
        destinationWardId: "WXYZ", 
        transferReason: "Requires specialized cardiac monitoring.",
        transferredBy: "doc-currentUser-mockId"
    };
    console.log("Submitting to /api/v1/admissions/{admissionId}/transfer (mock):", payload);
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
                  {isLoadingAllWards && <SelectItem value="loading" disabled><Loader2 className="inline mr-2 h-4 w-4 animate-spin"/>Loading wards...</SelectItem>}
                  {!isLoadingAllWards && allWardsData.length === 0 && <SelectItem value="no-wards" disabled>No wards found.</SelectItem>}
                  {!isLoadingAllWards && allWardsData.map(ward => (
                    <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoadingCurrentWardDetails && selectedWardId && (
                 <div className="flex items-center justify-center py-6 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" /> Loading details for {allWardsData.find(w => w.id === selectedWardId)?.name || 'selected ward'}...
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
                            bed.status === 'Cleaning' ? 'secondary' : 'default'
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
          <Card className="lg:col-span-full shadow-sm mt-2">
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
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold flex items-center"><Pill className="mr-2 h-4 w-4 text-primary" /> Medication Schedule</h4>
                        <Dialog open={isMedicationModalOpen} onOpenChange={setIsMedicationModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleOpenMedicationModal} disabled={isSavingMedicationUpdates}>
                                <Edit className="mr-2 h-3 w-3" /> Log/Update Medications
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                <DialogTitle>Manage Medication Log for {currentAdmittedPatientFullDetails.name}</DialogTitle>
                                <DialogDescription>
                                    Update the status for each scheduled medication.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                                {medicationScheduleInModal.map((med, index) => (
                                    <div key={med.medicationItemId} className="grid grid-cols-[1fr_auto_120px] items-center gap-3 p-2 border-b">
                                    <div>
                                        <p className="text-sm font-medium">{med.medication} ({med.dosage})</p>
                                        <p className="text-xs text-muted-foreground">Scheduled: {med.time}</p>
                                    </div>
                                    <Select
                                        value={med.status}
                                        onValueChange={(value) => handleMedicationStatusChangeInModal(med.medicationItemId, value as MedicationScheduleItem["status"])}
                                        disabled={isSavingMedicationUpdates}
                                    >
                                        <SelectTrigger className="w-[120px] h-8 text-xs">
                                        <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Administered">Administered</SelectItem>
                                        <SelectItem value="Skipped">Skipped</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </div>
                                ))}
                                {medicationScheduleInModal.length === 0 && <p className="text-sm text-muted-foreground text-center">No medications scheduled.</p>}
                                </div>
                                <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={isSavingMedicationUpdates}>Cancel</Button></DialogClose>
                                <Button onClick={handleSaveMedicationUpdates} disabled={isSavingMedicationUpdates}>
                                    {isSavingMedicationUpdates ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    Save Medication Log
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {currentAdmittedPatientFullDetails.medicationSchedule.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="text-xs">Medication</TableHead>
                            <TableHead className="text-xs">Time</TableHead>
                            <TableHead className="text-xs text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentAdmittedPatientFullDetails.medicationSchedule.map((med) => (
                            <TableRow key={med.medicationItemId}>
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
                    ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">No medication schedule found.</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-primary" /> Doctor's Notes</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {currentAdmittedPatientFullDetails.doctorNotes.length > 0 ? (
                        currentAdmittedPatientFullDetails.doctorNotes.map((note) => (
                            <div key={note.noteId} className="text-xs p-2 border rounded-md bg-muted/30">
                            <p className="font-medium">{note.doctor} - <span className="text-muted-foreground">{new Date(note.date).toLocaleDateString()} {new Date(note.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span></p>
                            <p className="mt-0.5 whitespace-pre-wrap">{note.note}</p>
                            </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">No notes recorded yet.</p>
                      )}
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
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDischarge} disabled={isDischarging || isTransferring || isAddingNote || isSavingMedicationUpdates}>
                        {isDischarging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOutIcon className="mr-2 h-4 w-4" />}
                        {isDischarging ? "Discharging..." : `Discharge ${currentAdmittedPatientFullDetails.name.split(' ')[0]}`}
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleTransfer} disabled={isDischarging || isTransferring || isAddingNote || isSavingMedicationUpdates}>
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

      {/* Medication Management Modal */}
      {currentAdmittedPatientFullDetails && (
         <Dialog open={isMedicationModalOpen} onOpenChange={setIsMedicationModalOpen}>
            {/* The DialogTrigger is now part of the Medication Schedule card header */}
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Manage Medication Log for {currentAdmittedPatientFullDetails.name}</DialogTitle>
                <DialogDescription>
                  Update the status for each scheduled medication. Changes here will be reflected locally before saving to the backend.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto pr-1">
                {medicationScheduleInModal.map((med) => (
                  <div key={med.medicationItemId} className="grid grid-cols-[1fr_130px] items-center gap-3 p-2.5 border rounded-md bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{med.medication} ({med.dosage})</p>
                      <p className="text-xs text-muted-foreground">Scheduled: {med.time}</p>
                    </div>
                    <Select
                      value={med.status}
                      onValueChange={(value) => handleMedicationStatusChangeInModal(med.medicationItemId, value as MedicationScheduleItem["status"])}
                      disabled={isSavingMedicationUpdates}
                    >
                      <SelectTrigger className="w-full h-9 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Administered">Administered</SelectItem>
                        <SelectItem value="Skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                {medicationScheduleInModal.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No medications currently scheduled for this patient.</p>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSavingMedicationUpdates}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveMedicationUpdates} disabled={isSavingMedicationUpdates || medicationScheduleInModal.length === 0}>
                  {isSavingMedicationUpdates ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Save Medication Log
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
    </AppShell>
  );
}
