
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BedDouble, Users, ListFilter, PlusCircle, LogOutIcon, CheckCircle2, AlertTriangle, ArrowRightLeft, FileText, Pill, MessageSquare, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

interface Ward {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
}

interface AdmittingPatient {
  id: string;
  name: string;
  sourceDepartment: string;
  priority: "High" | "Medium" | "Low";
  status: "Awaiting Bed" | "Bed Assigned";
}

interface Bed {
    id: string;
    bedNumber: string;
    status: "Available" | "Occupied" | "Cleaning";
    patientName?: string;
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

interface AdmittedPatientDetails {
  id: string;
  name: string;
  ward: string;
  bed: string;
  treatmentPlan: string;
  medicationSchedule: MedicationScheduleItem[];
  doctorNotes: DoctorNote[];
}

const mockWardsData: Ward[] = [
    { id: "W001", name: "General Medicine Ward A", totalBeds: 20, occupiedBeds: 15 },
    { id: "W002", name: "Surgical Ward B", totalBeds: 15, occupiedBeds: 14 },
    { id: "W003", name: "Pediatrics Ward C", totalBeds: 10, occupiedBeds: 5 },
    { id: "W004", name: "Maternity Ward D", totalBeds: 12, occupiedBeds: 10 },
];

const mockAdmittingPatientsData: AdmittingPatient[] = [
    { id: "P001", name: "Alice Wonderland", sourceDepartment: "Emergency", priority: "High", status: "Awaiting Bed" },
    { id: "P002", name: "Bob The Builder", sourceDepartment: "Outpatient Clinic", priority: "Medium", status: "Awaiting Bed" },
    { id: "P003", name: "Charlie Brown", sourceDepartment: "Specialization Consult", priority: "Low", status: "Awaiting Bed" },
];

const mockAdmittedPatientsDetailsData: AdmittedPatientDetails[] = [
  {
    id: "ADM001", // Changed ID to be distinct
    name: "Patient X (Admitted)",
    ward: "General Medicine Ward A",
    bed: "Bed 3",
    treatmentPlan: "Standard care for pneumonia. IV antibiotics (Ceftriaxone 1g OD), regular nebulization, oxygen support prn. Monitor vitals Q4H. Encourage fluid intake and chest physiotherapy.",
    medicationSchedule: [
      { medication: "Ceftriaxone 1g IV", dosage: "1g", time: "08:00 AM", status: "Administered" },
      { medication: "Paracetamol 500mg PO", dosage: "500mg", time: "08:00 AM", status: "Administered" },
      { medication: "Salbutamol Neb", dosage: "2.5mg", time: "10:00 AM", status: "Pending" },
    ],
    doctorNotes: [
      { date: "2024-07-28", doctor: "Dr. Smith", note: "Patient responding well to antibiotics. Fever subsided. Continue current plan." },
    ],
  },
  {
    id: "ADM002",
    name: "Patient Y (Admitted)",
    ward: "Surgical Ward B",
    bed: "Bed 10",
    treatmentPlan: "Post-operative care for appendectomy. Pain management (Tramadol 50mg IV SOS), wound care, early mobilization. Monitor for signs of infection.",
    medicationSchedule: [
      { medication: "Tramadol 50mg IV", dosage: "50mg", time: "SOS", status: "Pending" },
    ],
    doctorNotes: [
      { date: "2024-07-29", doctor: "Dr. Grey", note: "Patient stable post-op. Pain controlled. Encourage ambulation." },
    ],
  },
];


export default function WardManagementPage() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingWards, setIsLoadingWards] = useState(true);

  const [admittingPatients, setAdmittingPatients] = useState<AdmittingPatient[]>([]);
  const [isLoadingPendingAdmissions, setIsLoadingPendingAdmissions] = useState(true);
  
  // List of admitted patients for the dropdown
  const [admittedPatientList, setAdmittedPatientList] = useState<{id: string, name: string, ward: string, bed: string}[]>([]);
  const [isLoadingAdmittedPatientList, setIsLoadingAdmittedPatientList] = useState(true);

  const [selectedWardForAssignment, setSelectedWardForAssignment] = useState<string | undefined>();
  const [bedsInSelectedWard, setBedsInSelectedWard] = useState<Bed[]>([]);
  const [isLoadingBedsInWard, setIsLoadingBedsInWard] = useState(false);

  const [selectedAdmittedPatientId, setSelectedAdmittedPatientId] = useState<string | undefined>();
  const [currentAdmittedPatientDetails, setCurrentAdmittedPatientDetails] = useState<AdmittedPatientDetails | null>(null);
  const [isLoadingPatientDetails, setIsLoadingPatientDetails] = useState(false);

  const [isAssigningBed, setIsAssigningBed] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isUpdatingMedication, setIsUpdatingMedication] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newDoctorNote, setNewDoctorNote] = useState("");


  useEffect(() => {
    // Simulate fetching ward occupancy
    setIsLoadingWards(true);
    setTimeout(() => {
      setWards(mockWardsData);
      setIsLoadingWards(false);
    }, 1000);

    // Simulate fetching pending admissions
    setIsLoadingPendingAdmissions(true);
    setTimeout(() => {
      setAdmittingPatients(mockAdmittingPatientsData);
      setIsLoadingPendingAdmissions(false);
    }, 1200);

    // Simulate fetching list of currently admitted patients for the dropdown
    setIsLoadingAdmittedPatientList(true);
    setTimeout(() => {
        const list = mockAdmittedPatientsDetailsData.map(p => ({ id: p.id, name: p.name, ward: p.ward, bed: p.bed }));
        setAdmittedPatientList(list);
        setIsLoadingAdmittedPatientList(false);
    }, 1400);
  }, []);

  useEffect(() => {
    if (selectedWardForAssignment) {
      setIsLoadingBedsInWard(true);
      const wardDetails = wards.find(w => w.id === selectedWardForAssignment);
      // Simulate API call: /api/v1/wards/{selectedWardForAssignment}/beds
      setTimeout(() => {
        const mockBeds: Bed[] = Array.from({ length: wardDetails?.totalBeds || 0 }).map((_, i) => {
          const isOccupied = i < (wardDetails?.occupiedBeds || 0);
          return {
            id: `B${selectedWardForAssignment}${i+1}`,
            bedNumber: `Bed ${i+1}`,
            status: isOccupied ? "Occupied" : (Math.random() > 0.8 ? "Cleaning" : "Available"),
            patientName: isOccupied ? mockAdmittedPatientsDetailsData.find(p => p.ward === wardDetails?.name && p.bed === `Bed ${i+1}`)?.name || `Occupant ${i+1}` : undefined
          };
        });
        setBedsInSelectedWard(mockBeds);
        setIsLoadingBedsInWard(false);
      }, 800);
    } else {
      setBedsInSelectedWard([]);
    }
  }, [selectedWardForAssignment, wards]);

  useEffect(() => {
    if (selectedAdmittedPatientId) {
      setIsLoadingPatientDetails(true);
      // Simulate API call: /api/v1/admissions/{selectedAdmittedPatientId}
      setTimeout(() => {
        const patientDetails = mockAdmittedPatientsDetailsData.find(p => p.id === selectedAdmittedPatientId);
        setCurrentAdmittedPatientDetails(patientDetails || null);
        setIsLoadingPatientDetails(false);
      }, 1000);
    } else {
      setCurrentAdmittedPatientDetails(null);
    }
  }, [selectedAdmittedPatientId]);

  const handleAssignBed = async () => {
    setIsAssigningBed(true);
    // Simulate API call: POST /api/v1/admissions
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Bed Assigned (Mock)", description: "Patient has been assigned to a bed." });
    // In a real app, re-fetch pending admissions, ward occupancy, and admitted patient list
    setIsAssigningBed(false);
  };

  const handleDischarge = async (patientName?: string) => {
     setIsDischarging(true);
     // Simulate API call: PUT /api/v1/admissions/{admissionId}/discharge
     await new Promise(resolve => setTimeout(resolve, 1500));
     toast({ title: "Patient Discharged (Mock)", description: `${patientName || "Selected Patient"} has been processed for discharge.` });
     // In a real app, update patient status, remove from admitted list, update ward occupancy
     setSelectedAdmittedPatientId(undefined); // Clear selection
     setIsDischarging(false);
  };
  
  const handleTransfer = async (patientName?: string) => {
     setIsTransferring(true);
     // Simulate API call: PUT /api/v1/admissions/{admissionId}/transfer
     await new Promise(resolve => setTimeout(resolve, 1500));
     toast({ title: "Patient Transfer Initiated (Mock)", description: `Transfer process for ${patientName || "Selected Patient"} has started.` });
     setIsTransferring(false);
  };

  const handleUpdateMedication = async () => {
    setIsUpdatingMedication(true);
    // Simulate API call: PUT /api/v1/admissions/{admissionId}/medication-schedule/{medItemId}
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({title: "Mock Action", description: "Medication administration log updated."});
    // Potentially re-fetch patient details to show updated medication status
    setIsUpdatingMedication(false);
  };

  const handleAddNote = async () => {
    if (!newDoctorNote.trim() || !currentAdmittedPatientDetails) return;
    setIsAddingNote(true);
    // Simulate API call: POST /api/v1/admissions/{admissionId}/doctor-notes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local state for immediate feedback
    const newNoteEntry: DoctorNote = {
        date: new Date().toISOString().split('T')[0],
        doctor: "Dr. Current User (Mock)", // Replace with actual logged-in user
        note: newDoctorNote
    };
    setCurrentAdmittedPatientDetails(prev => prev ? ({
        ...prev,
        doctorNotes: [...prev.doctorNotes, newNoteEntry]
    }) : null);

    toast({title: "Mock Action", description: "New doctor's note saved."});
    setNewDoctorNote(""); // Clear textarea
    setIsAddingNote(false);
  };


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BedDouble className="h-8 w-8" /> Ward Management
          </h1>
          <Button variant="outline" disabled={isLoadingWards || isLoadingPendingAdmissions}>
            <ListFilter className="mr-2 h-4 w-4" /> Filter Options
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Ward Occupancy Overview */}
          <Card className="xl:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle>Ward Occupancy Overview</CardTitle>
              <CardDescription>Current bed status across all wards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingWards ? (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2"/> Loading ward data...
                </div>
              ) : wards.map((ward) => (
                <div key={ward.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{ward.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {ward.occupiedBeds}/{ward.totalBeds} beds
                    </span>
                  </div>
                  <Progress value={(ward.occupiedBeds / ward.totalBeds) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Admissions */}
          <Card className="lg:col-span-1 xl:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Pending Ward Admissions</CardTitle>
              <CardDescription>Patients awaiting bed assignment from various departments.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPendingAdmissions ? (
                 <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mr-2"/> Loading pending admissions...
                </div>
              ) : admittingPatients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Source Department</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admittingPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.sourceDepartment}</TableCell>
                        <TableCell>
                          <Badge variant={patient.priority === "High" ? "destructive" : patient.priority === "Medium" ? "secondary" : "outline"}>
                            {patient.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{patient.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-10 text-muted-foreground">No patients currently awaiting admission.</p>
              )}
            </CardContent>
          </Card>

          {/* Bed Assignment */}
          <Card className="lg:col-span-full xl:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Bed Assignment</CardTitle>
              <CardDescription>Assign patients to available beds in selected wards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor="selectPatient">Patient to Assign</Label>
                  <Select disabled={isAssigningBed || isLoadingPendingAdmissions}>
                    <SelectTrigger id="selectPatient">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingPendingAdmissions ? <SelectItem value="loading" disabled>Loading patients...</SelectItem> :
                       admittingPatients.filter(p => p.status === "Awaiting Bed").map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.sourceDepartment})</SelectItem>
                      ))}
                       {!isLoadingPendingAdmissions && admittingPatients.filter(p => p.status === "Awaiting Bed").length === 0 && <SelectItem value="none" disabled>No patients awaiting bed</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="selectWard">Target Ward</Label>
                  <Select value={selectedWardForAssignment} onValueChange={setSelectedWardForAssignment} disabled={isAssigningBed || isLoadingWards}>
                    <SelectTrigger id="selectWard">
                      <SelectValue placeholder="Select Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingWards ? <SelectItem value="loading" disabled>Loading wards...</SelectItem> :
                       wards.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name} ({w.totalBeds - w.occupiedBeds} available)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor="selectBed">Available Bed</Label>
                  <Select disabled={isAssigningBed || !selectedWardForAssignment || isLoadingBedsInWard || bedsInSelectedWard.filter(b => b.status === 'Available').length === 0}>
                    <SelectTrigger id="selectBed">
                      <SelectValue placeholder="Select Bed" />
                    </SelectTrigger>
                    <SelectContent>
                       {isLoadingBedsInWard ? <SelectItem value="loading" disabled>Loading beds...</SelectItem> :
                        bedsInSelectedWard.filter(b => b.status === 'Available').map(b => (
                         <SelectItem key={b.id} value={b.id}>{b.bedNumber}</SelectItem>
                       ))}
                       {!isLoadingBedsInWard && selectedWardForAssignment && bedsInSelectedWard.filter(b => b.status === 'Available').length === 0 && <SelectItem value="none" disabled>No available beds</SelectItem>}
                       {!selectedWardForAssignment && <SelectItem value="none" disabled>Select ward first</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               {selectedWardForAssignment && !isLoadingBedsInWard && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Beds in {wards.find(w=>w.id === selectedWardForAssignment)?.name || 'Selected Ward'}:</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto pr-2">
                        {bedsInSelectedWard.map(bed => (
                            <Badge key={bed.id} variant={bed.status === 'Occupied' ? 'destructive' : bed.status === 'Cleaning' ? 'secondary': 'default'} className="text-xs p-1.5 justify-center">
                                {bed.bedNumber} {bed.status === 'Occupied' && bed.patientName ? `(${bed.patientName.split(' ')[0]})` : ''}
                            </Badge>
                        ))}
                    </div>
                </div>
               )}
               {isLoadingBedsInWard && <div className="flex items-center justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary mr-2"/> Loading bed information...</div>}
            </CardContent>
            <CardFooter>
              <Button onClick={handleAssignBed} disabled={isAssigningBed || !selectedWardForAssignment || isLoadingBedsInWard}>
                {isAssigningBed ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isAssigningBed ? "Assigning..." : "Assign to Bed"}
              </Button>
            </CardFooter>
          </Card>

          {/* In-Patient Management */}
          <Card className="lg:col-span-full xl:col-span-1 shadow-sm">
             <CardHeader>
                <CardTitle>In-Patient Care & Operations</CardTitle>
                <CardDescription>Manage currently admitted patients and view their care details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-1.5">
                  <Label htmlFor="selectAdmittedPatient">Select Admitted Patient</Label>
                  <Select onValueChange={setSelectedAdmittedPatientId} value={selectedAdmittedPatientId} disabled={isLoadingAdmittedPatientList || isDischarging || isTransferring}>
                    <SelectTrigger id="selectAdmittedPatient">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                        {isLoadingAdmittedPatientList ? <SelectItem value="loading" disabled>Loading patients...</SelectItem> :
                         admittedPatientList.map(p => (
                           <SelectItem key={p.id} value={p.id}>{p.name} ({p.ward} - {p.bed})</SelectItem>
                        ))}
                        {!isLoadingAdmittedPatientList && admittedPatientList.length === 0 && <SelectItem value="none" disabled>No patients admitted</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                {isLoadingPatientDetails && (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2"/> Loading patient details...
                    </div>
                )}

                {!isLoadingPatientDetails && currentAdmittedPatientDetails && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="text-md font-semibold mb-2 flex items-center"><FileText className="mr-2 h-4 w-4 text-primary" /> Treatment Plan Summary</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{currentAdmittedPatientDetails.treatmentPlan}</p>
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
                          {currentAdmittedPatientDetails.medicationSchedule.map((med, index) => (
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
                        {currentAdmittedPatientDetails.doctorNotes.map((note, index) => (
                          <div key={index} className="text-xs p-2 border rounded-md bg-muted/30">
                            <p className="font-medium">{note.doctor} - <span className="text-muted-foreground">{new Date(note.date).toLocaleDateString()}</span></p>
                            <p className="mt-0.5">{note.note}</p>
                          </div>
                        ))}
                      </div>
                      <Textarea placeholder="Add new note..." className="mt-2 text-xs" rows={2} value={newDoctorNote} onChange={(e) => setNewDoctorNote(e.target.value)} disabled={isAddingNote}/>
                      <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleAddNote} disabled={isAddingNote || !newDoctorNote.trim()}>
                         {isAddingNote ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                         {isAddingNote ? "Adding..." : "Add Note"}
                      </Button>
                    </div>
                    
                    <Separator />
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button variant="outline" className="w-full" onClick={() => handleDischarge(currentAdmittedPatientDetails.name)} disabled={isDischarging || isTransferring}>
                            {isDischarging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOutIcon className="mr-2 h-4 w-4" />}
                            {isDischarging ? "Discharging..." : `Discharge ${currentAdmittedPatientDetails.name.split(' ')[0]}`}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleTransfer(currentAdmittedPatientDetails.name)} disabled={isDischarging || isTransferring}>
                            {isTransferring ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
                            {isTransferring ? "Transferring..." : `Transfer ${currentAdmittedPatientDetails.name.split(' ')[0]}`}
                        </Button>
                    </div>
                  </div>
                )}
                {!isLoadingPatientDetails && !currentAdmittedPatientDetails && (
                    <p className="text-xs text-muted-foreground text-center py-4">Select an admitted patient to view their care details and perform operations.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
    
