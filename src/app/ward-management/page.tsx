"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BedDouble, Users, LogOutIcon, CheckCircle2, ArrowRightLeft, FileText, Pill, MessageSquare, Loader2, Hospital, Activity, UserCheck, Bed, Edit, PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- Data Structures ---
interface WardSummary {
  id: string;
  name: string;
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
  medicationItemId: string;
  medication: string;
  dosage: string;
  time: string;
  status: "Administered" | "Pending" | "Skipped";
  notes?: string;
}

interface DoctorNote {
  noteId: string;
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

interface PendingAdmission {
  id: string; // Could be a temporary referral ID or patient ID
  patientId: string;
  patientName: string;
  referringDepartment: string;
  reasonForAdmission: string;
}

// --- Mock Data ---
const mockWardSummariesData: WardSummary[] = [
    { id: "W001", name: "General Medicine Ward A" },
    { id: "W002", name: "Surgical Ward B" },
    { id: "W003", name: "Pediatrics Ward C" },
    { id: "W004", name: "Maternity Ward D" },
];

const mockHospitalPendingAdmissionsData: PendingAdmission[] = [
    { id: "PEND001", patientId: "P101", patientName: "Alice Smith", referringDepartment: "Emergency", reasonForAdmission: "Severe Pneumonia, requires inpatient care." },
    { id: "PEND002", patientId: "P102", patientName: "Robert Jones", referringDepartment: "Outpatient Clinic", reasonForAdmission: "Uncontrolled Diabetes, needs stabilization." },
    { id: "PEND003", patientId: "P103", patientName: "Maria Garcia", referringDepartment: "Specialist Consultation (Cardiology)", reasonForAdmission: "Post-MI observation and cardiac rehab." },
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
        status: (i === 2 || i === 4) ? "Occupied" : (i === 10 ? "Cleaning" : "Available"),
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
      { medicationItemId: "MEDSCH001-A", medication: "Ceftriaxone 1g IV", dosage: "1g", time: "08:00", status: "Administered", notes: "Given slowly over 30 mins." },
      { medicationItemId: "MEDSCH001-B", medication: "Paracetamol 500mg PO", dosage: "500mg", time: "12:00", status: "Pending" },
      { medicationItemId: "MEDSCH001-C", medication: "Salbutamol Neb", dosage: "2.5mg", time: "14:00", status: "Pending", notes: "Check O2 sats before/after." },
    ],
    doctorNotes: [{ noteId: "DN001-A", date: new Date(Date.now() - 86400000).toISOString(), doctor: "Dr. Smith", note: "Patient responding well. Continue plan." }, {noteId: "DN001-B", date: new Date().toISOString(), doctor: "Dr. House", note: "Reviewed chest X-ray, slight improvement in consolidation."}],
  },
    // ... (other mock patient full details remain the same as before)
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

  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedTime, setNewMedTime] = useState("");
  const [newMedNotes, setNewMedNotes] = useState("");

  const [isDischarging, setIsDischarging] = useState(false);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"internal_ward" | "external_hospital" | "">("");
  const [targetInternalWardId, setTargetInternalWardId] = useState("");
  const [externalHospitalName, setExternalHospitalName] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);

  // State for new admission form
  const [hospitalPendingAdmissions, setHospitalPendingAdmissions] = useState<PendingAdmission[]>([]);
  const [isLoadingPendingAdmissions, setIsLoadingPendingAdmissions] = useState(true);
  const [selectedPendingPatientId, setSelectedPendingPatientId] = useState("");
  const [selectedAvailableBedId, setSelectedAvailableBedId] = useState("");
  const [admissionDoctor, setAdmissionDoctor] = useState("");
  const [admissionDiagnosis, setAdmissionDiagnosis] = useState("");
  const [isAdmittingPatient, setIsAdmittingPatient] = useState(false);


  useEffect(() => {
    setIsLoadingAllWards(true);
    // Simulate fetching all wards summary
    setTimeout(() => {
      setAllWardsData(mockWardSummariesData);
      setIsLoadingAllWards(false);
    }, 800);

    setIsLoadingPendingAdmissions(true);
    // Simulate fetching hospital-wide pending admissions
    setTimeout(() => {
        setHospitalPendingAdmissions(mockHospitalPendingAdmissionsData);
        setIsLoadingPendingAdmissions(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedWardId) {
      setIsLoadingCurrentWardDetails(true);
      setCurrentWardDetails(null); 
      setSelectedPatientForDetails(null); 
      setCurrentAdmittedPatientFullDetails(null);
      // Simulate fetching details for the selected ward
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

  useEffect(() => {
    if (selectedPatientForDetails) {
      setIsLoadingSelectedPatientDetails(true);
      setCurrentAdmittedPatientFullDetails(null);
      // Simulate fetching full details for the selected admitted patient
      setTimeout(() => {
        const fullDetails = mockAdmittedPatientFullDetailsData[selectedPatientForDetails.admissionId];
        setCurrentAdmittedPatientFullDetails(fullDetails || null);
        if (fullDetails) {
          setMedicationScheduleInModal(fullDetails.medicationSchedule.map(item => ({...item}))); // Copy for modal
        } else {
          setMedicationScheduleInModal([]);
        }
        setIsLoadingSelectedPatientDetails(false);
      }, 800);
    } else {
        setCurrentAdmittedPatientFullDetails(null);
        setMedicationScheduleInModal([]);
    }
  }, [selectedPatientForDetails]);

  const handleAdmitPatientToWard = async () => {
    if (!selectedWardId || !selectedPendingPatientId || !selectedAvailableBedId || !admissionDoctor.trim() || !admissionDiagnosis.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a patient, an available bed, and fill in admission details." });
      return;
    }
    setIsAdmittingPatient(true);

    const patientToAdmit = hospitalPendingAdmissions.find(p => p.id === selectedPendingPatientId);
    const bedToOccupy = currentWardDetails?.beds.find(b => b.id === selectedAvailableBedId);

    if (!patientToAdmit || !bedToOccupy || !currentWardDetails) {
        toast({ variant: "destructive", title: "Error", description: "Invalid patient or bed selection." });
        setIsAdmittingPatient(false);
        return;
    }
    
    const newAdmissionId = `ADM${Date.now()}`;
    const payload = {
        patientId: patientToAdmit.patientId,
        wardId: selectedWardId,
        bedId: selectedAvailableBedId,
        admittingDoctor: admissionDoctor,
        primaryDiagnosis: admissionDiagnosis,
        admissionDate: new Date().toISOString(),
    };
    console.log("Submitting to /api/v1/admissions (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success: Update local state
    const newPatientInWard: PatientInWard = {
        admissionId: newAdmissionId,
        patientId: patientToAdmit.patientId,
        name: patientToAdmit.patientName,
        bedNumber: bedToOccupy.bedNumber,
        admittedDate: new Date().toISOString().split('T')[0],
        primaryDiagnosis: admissionDiagnosis,
    };

    setCurrentWardDetails(prev => {
        if (!prev) return null;
        const updatedPatients = [...prev.patients, newPatientInWard];
        const updatedBeds = prev.beds.map(b => 
            b.id === selectedAvailableBedId ? { ...b, status: "Occupied" as "Occupied", patientId: patientToAdmit.patientId, patientName: patientToAdmit.patientName } : b
        );
        const occupiedBeds = updatedBeds.filter(b => b.status === "Occupied").length;
        return {
            ...prev,
            patients: updatedPatients,
            beds: updatedBeds,
            occupiedBeds: occupiedBeds,
            availableBeds: prev.totalBeds - occupiedBeds,
            occupancyRate: (occupiedBeds / prev.totalBeds) * 100,
        };
    });
    
    // Add to mockAdmittedPatientFullDetailsData for consistency if selected later
    mockAdmittedPatientFullDetailsData[newAdmissionId] = {
        admissionId: newAdmissionId,
        patientId: patientToAdmit.patientId,
        name: patientToAdmit.patientName,
        wardName: currentWardDetails.name,
        bedNumber: bedToOccupy.bedNumber,
        treatmentPlan: `Initial plan for ${admissionDiagnosis}. Monitor vitals.`,
        medicationSchedule: [],
        doctorNotes: [{noteId: `DN-ADMIT-${Date.now()}`, date: new Date().toISOString(), doctor: admissionDoctor, note: `Admitted for ${admissionDiagnosis}.`}],
    };


    setHospitalPendingAdmissions(prev => prev.filter(p => p.id !== selectedPendingPatientId));
    toast({ title: "Patient Admitted (Mock)", description: `${patientToAdmit.patientName} admitted to ${currentWardDetails.name}, ${bedToOccupy.bedNumber}.` });

    // Reset form
    setSelectedPendingPatientId("");
    setSelectedAvailableBedId("");
    setAdmissionDoctor("");
    setAdmissionDiagnosis("");
    setIsAdmittingPatient(false);
  };


  const handleAddNote = async () => {
    if (!newDoctorNote.trim() || !currentAdmittedPatientFullDetails) return;
    setIsAddingNote(true);
    const payload = { admissionId: currentAdmittedPatientFullDetails.admissionId, doctorId: "doc-currentUser-mockId", note: newDoctorNote };
    console.log("Submitting to /api/v1/admissions/{admissionId}/doctor-notes (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newNoteEntry: DoctorNote = { noteId: `DN${Date.now()}`, date: new Date().toISOString(), doctor: "Dr. Current User (Mock)", note: newDoctorNote };
    setCurrentAdmittedPatientFullDetails(prev => prev ? ({ ...prev, doctorNotes: [newNoteEntry, ...prev.doctorNotes] }) : null);
    toast({title: "Note Saved (Mock)", description: "New doctor's note added."});
    setNewDoctorNote("");
    setIsAddingNote(false);
  };

  const handleOpenMedicationModal = () => {
    if (!currentAdmittedPatientFullDetails) return;
    setMedicationScheduleInModal(currentAdmittedPatientFullDetails.medicationSchedule.map(med => ({ ...med }))); // Deep copy
    setNewMedName("");
    setNewMedDosage("");
    setNewMedTime("");
    setNewMedNotes("");
    setIsMedicationModalOpen(true);
  };

  const handleMedicationItemChangeInModal = (index: number, field: keyof MedicationScheduleItem, value: string) => {
    setMedicationScheduleInModal(prevSchedule =>
      prevSchedule.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleAddNewMedicationToModalSchedule = () => {
    if (!newMedName.trim() || !newMedDosage.trim() || !newMedTime.trim()) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill Medication Name, Dosage, and Time." });
      return;
    }
    const newMedItem: MedicationScheduleItem = {
      medicationItemId: `temp-${Date.now()}`, 
      medication: newMedName,
      dosage: newMedDosage,
      time: newMedTime,
      status: "Pending",
      notes: newMedNotes.trim() || undefined,
    };
    setMedicationScheduleInModal(prev => [...prev, newMedItem]);
    setNewMedName("");
    setNewMedDosage("");
    setNewMedTime("");
    setNewMedNotes("");
    toast({ title: "Medication Added to Schedule", description: `${newMedName} is ready to be saved.` });
  };

  const handleSaveMedicationUpdates = async () => {
    if (!currentAdmittedPatientFullDetails) return;
    setIsSavingMedicationUpdates(true);
    const payload = { admissionId: currentAdmittedPatientFullDetails.admissionId, updatedSchedule: medicationScheduleInModal };
    console.log("Submitting to /api/v1/admissions/{admissionId}/medication-schedule (mock with full schedule):", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentAdmittedPatientFullDetails(prev => prev ? ({ ...prev, medicationSchedule: medicationScheduleInModal }) : null);
    toast({title: "Medication Log Updated (Mock)", description: "Medication schedule has been updated."});
    setIsMedicationModalOpen(false);
    setIsSavingMedicationUpdates(false);
  };

  const handleDischarge = async () => {
    if (!currentAdmittedPatientFullDetails || !selectedWardId) return;
    setIsDischarging(true);
    const payload = { admissionId: currentAdmittedPatientFullDetails.admissionId, dischargeDate: new Date().toISOString(), dischargeSummary: "Patient stable for discharge.", dischargedBy: "doc-currentUser-mockId" };
    console.log("Submitting to /api/v1/admissions/{admissionId}/discharge (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: "Patient Discharged (Mock)", description: `${currentAdmittedPatientFullDetails.name} processed for discharge.` });
    
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
            occupancyRate: (occupiedBeds / prevDetails.totalBeds) * 100 
        };
    });
    setIsDischarging(false);
  };
  
  const handleOpenTransferModal = () => {
    if (!currentAdmittedPatientFullDetails) return;
    setTransferType("");
    setTargetInternalWardId("");
    setExternalHospitalName("");
    setTransferReason("");
    setIsTransferModalOpen(true);
  };

  const handleConfirmTransfer = async () => {
    if (!currentAdmittedPatientFullDetails || !selectedWardId || !transferType || !transferReason.trim()) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please select transfer type, destination (if applicable), and provide a reason." });
        return;
    }
    if (transferType === "internal_ward" && !targetInternalWardId) {
        toast({ variant: "destructive", title: "Missing Destination", description: "Please select a destination ward." });
        return;
    }
    if (transferType === "external_hospital" && !externalHospitalName.trim()) {
        toast({ variant: "destructive", title: "Missing Destination", description: "Please enter the destination hospital name." });
        return;
    }

    setIsProcessingTransfer(true);
    const payload = { 
        admissionId: currentAdmittedPatientFullDetails.admissionId, 
        transferDate: new Date().toISOString(), 
        transferType: transferType,
        destinationWardId: transferType === "internal_ward" ? targetInternalWardId : undefined,
        destinationFacility: transferType === "external_hospital" ? externalHospitalName : undefined,
        transferReason: transferReason,
        transferredBy: "doc-currentUser-mockId" 
    };
    console.log("Submitting to /api/v1/admissions/{admissionId}/transfer (mock):", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const destinationName = transferType === "internal_ward" 
        ? allWardsData.find(w => w.id === targetInternalWardId)?.name || "Selected Ward" 
        : externalHospitalName;
    toast({ title: "Patient Transfer Initiated (Mock)", description: `Transfer for ${currentAdmittedPatientFullDetails.name} to ${destinationName} initiated.` });
    
    const admissionIdToTransfer = currentAdmittedPatientFullDetails.admissionId;
    const patientIdToClearFromBed = currentAdmittedPatientFullDetails.patientId;
    
    setSelectedPatientForDetails(null); 
    setCurrentAdmittedPatientFullDetails(null);
    setCurrentWardDetails(prevDetails => {
        if (!prevDetails) return null;
        const updatedPatients = prevDetails.patients.filter(p => p.admissionId !== admissionIdToTransfer);
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
            occupancyRate: (occupiedBeds / prevDetails.totalBeds) * 100 
        };
    });
    
    setIsTransferModalOpen(false);
    setIsProcessingTransfer(false);
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
                disabled={isLoadingAllWards || isLoadingCurrentWardDetails || isAdmittingPatient}
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
          <>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlusCircle className="h-5 w-5 text-primary"/> Admit Patient to {currentWardDetails.name}
                    </CardTitle>
                    <CardDescription>Select a patient from the hospital's pending admissions list and assign them to an available bed in this ward.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingPendingAdmissions ? (
                        <div className="flex items-center justify-center py-4 text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Loading pending admissions...
                        </div>
                    ) : hospitalPendingAdmissions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center">No patients currently pending hospital admission.</p>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="selectPendingPatient">Patient to Admit</Label>
                                    <Select value={selectedPendingPatientId} onValueChange={setSelectedPendingPatientId} disabled={isAdmittingPatient}>
                                        <SelectTrigger id="selectPendingPatient">
                                            <SelectValue placeholder="Select patient from pending list..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hospitalPendingAdmissions.map(p => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.patientName} (From: {p.referringDepartment})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="selectAvailableBed">Available Bed</Label>
                                    <Select value={selectedAvailableBedId} onValueChange={setSelectedAvailableBedId} disabled={isAdmittingPatient}>
                                        <SelectTrigger id="selectAvailableBed">
                                            <SelectValue placeholder="Select an available bed..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currentWardDetails.beds.filter(b => b.status === "Available").map(bed => (
                                                <SelectItem key={bed.id} value={bed.id}>{bed.bedNumber}</SelectItem>
                                            ))}
                                            {currentWardDetails.beds.filter(b => b.status === "Available").length === 0 && (
                                                <SelectItem value="no-beds" disabled>No beds available in this ward.</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="admissionDoctor">Admitting Doctor</Label>
                                <Input id="admissionDoctor" value={admissionDoctor} onChange={(e) => setAdmissionDoctor(e.target.value)} placeholder="Doctor's name" disabled={isAdmittingPatient}/>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="admissionDiagnosis">Primary Diagnosis/Reason for Admission</Label>
                                <Textarea 
                                    id="admissionDiagnosis" 
                                    value={admissionDiagnosis} 
                                    onChange={(e) => setAdmissionDiagnosis(e.target.value)} 
                                    placeholder="Enter primary diagnosis or reason" 
                                    rows={2}
                                    disabled={isAdmittingPatient}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
                {hospitalPendingAdmissions.length > 0 && (
                    <CardFooter>
                        <Button 
                            onClick={handleAdmitPatientToWard} 
                            disabled={isAdmittingPatient || !selectedPendingPatientId || !selectedAvailableBedId || !admissionDoctor.trim() || !admissionDiagnosis.trim()}
                        >
                            {isAdmittingPatient ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                            {isAdmittingPatient ? "Admitting..." : "Admit Patient to Ward"}
                        </Button>
                    </CardFooter>
                )}
            </Card>

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
          </>
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
                                <Button variant="outline" size="sm" onClick={handleOpenMedicationModal} disabled={isSavingMedicationUpdates || isDischarging || isProcessingTransfer || isAddingNote}>
                                <Edit className="mr-2 h-3 w-3" /> Manage Medication Log
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl"> 
                                <DialogHeader>
                                <DialogTitle>Manage Medication Log for {currentAdmittedPatientFullDetails.name}</DialogTitle>
                                <DialogDescription>
                                    Update status, edit details, or add new medications to the schedule.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {medicationScheduleInModal.map((med, index) => (
                                        <div key={med.medicationItemId} className="p-3 border rounded-md space-y-3 bg-background shadow-sm">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`medName-${index}`} className="text-xs">Medication</Label>
                                                    <Input id={`medName-${index}`} value={med.medication} onChange={(e) => handleMedicationItemChangeInModal(index, "medication", e.target.value)} disabled={isSavingMedicationUpdates} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`medDosage-${index}`} className="text-xs">Dosage</Label>
                                                    <Input id={`medDosage-${index}`} value={med.dosage} onChange={(e) => handleMedicationItemChangeInModal(index, "dosage", e.target.value)} disabled={isSavingMedicationUpdates} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`medTime-${index}`} className="text-xs">Time</Label>
                                                    <Input id={`medTime-${index}`} value={med.time} onChange={(e) => handleMedicationItemChangeInModal(index, "time", e.target.value)} disabled={isSavingMedicationUpdates} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`medStatus-${index}`} className="text-xs">Status</Label>
                                                    <Select
                                                        value={med.status}
                                                        onValueChange={(value) => handleMedicationItemChangeInModal(index, "status", value as MedicationScheduleItem["status"])}
                                                        disabled={isSavingMedicationUpdates}
                                                    >
                                                        <SelectTrigger id={`medStatus-${index}`} className="h-10 text-sm">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                            <SelectItem value="Administered">Administered</SelectItem>
                                                            <SelectItem value="Skipped">Skipped</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                             <div className="space-y-1">
                                                <Label htmlFor={`medNotes-${index}`} className="text-xs">Notes/Reason for Change</Label>
                                                <Textarea id={`medNotes-${index}`} value={med.notes || ""} onChange={(e) => handleMedicationItemChangeInModal(index, "notes", e.target.value)} placeholder="e.g., Administered by Nurse Jane, Patient refused..." rows={2} disabled={isSavingMedicationUpdates} />
                                            </div>
                                        </div>
                                    ))}
                                    {medicationScheduleInModal.length === 0 && <p className="text-sm text-muted-foreground text-center">No medications currently scheduled.</p>}
                                    
                                    <Separator className="my-4" />
                                    
                                    <div className="p-3 border rounded-md space-y-3 bg-muted/30">
                                        <h5 className="font-semibold text-md flex items-center gap-2"><PlusCircle className="h-5 w-5 text-primary" />Add New Medication to Schedule</h5>
                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="newMedName" className="text-xs">Medication Name <span className="text-destructive">*</span></Label>
                                                <Input id="newMedName" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} placeholder="e.g., Amoxicillin" disabled={isSavingMedicationUpdates}/>
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="newMedDosage" className="text-xs">Dosage <span className="text-destructive">*</span></Label>
                                                <Input id="newMedDosage" value={newMedDosage} onChange={(e) => setNewMedDosage(e.target.value)} placeholder="e.g., 500mg PO" disabled={isSavingMedicationUpdates}/>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="newMedTime" className="text-xs">Time <span className="text-destructive">*</span></Label>
                                            <Input id="newMedTime" value={newMedTime} onChange={(e) => setNewMedTime(e.target.value)} placeholder="e.g., 08:00, TID, PRN" disabled={isSavingMedicationUpdates}/>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="newMedNotes" className="text-xs">Notes/Reason for Addition</Label>
                                            <Textarea id="newMedNotes" value={newMedNotes} onChange={(e) => setNewMedNotes(e.target.value)} placeholder="e.g., Started for new infection" rows={2} disabled={isSavingMedicationUpdates}/>
                                        </div>
                                        <Button type="button" size="sm" variant="outline" onClick={handleAddNewMedicationToModalSchedule} disabled={isSavingMedicationUpdates || !newMedName.trim() || !newMedDosage.trim() || !newMedTime.trim()}>
                                            <PlusCircle className="mr-2 h-4 w-4"/> Add to Current Schedule
                                        </Button>
                                    </div>
                                </div>
                                <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={isSavingMedicationUpdates}>Cancel</Button></DialogClose>
                                <Button onClick={handleSaveMedicationUpdates} disabled={isSavingMedicationUpdates}>
                                    {isSavingMedicationUpdates ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    Save All Changes to Medication Log
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
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleAddNote} disabled={isAddingNote || !newDoctorNote.trim() || isDischarging || isProcessingTransfer || isSavingMedicationUpdates}>
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
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDischarge} disabled={isDischarging || isProcessingTransfer || isAddingNote || isSavingMedicationUpdates}>
                        {isDischarging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOutIcon className="mr-2 h-4 w-4" />}
                        {isDischarging ? "Discharging..." : `Discharge ${currentAdmittedPatientFullDetails.name.split(' ')[0]}`}
                    </Button>
                    
                    <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto" onClick={handleOpenTransferModal} disabled={isDischarging || isProcessingTransfer || isAddingNote || isSavingMedicationUpdates}>
                                <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer {currentAdmittedPatientFullDetails.name.split(' ')[0]}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Transfer Patient: {currentAdmittedPatientFullDetails.name}</DialogTitle>
                                <DialogDescription>Specify transfer details for the patient.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Transfer Type <span className="text-destructive">*</span></Label>
                                    <RadioGroup value={transferType} onValueChange={(value) => setTransferType(value as any)} className="flex space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="internal_ward" id="internal_ward" />
                                            <Label htmlFor="internal_ward" className="font-normal">Internal Ward</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="external_hospital" id="external_hospital" />
                                            <Label htmlFor="external_hospital" className="font-normal">External Hospital</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {transferType === "internal_ward" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="targetInternalWard">Destination Ward <span className="text-destructive">*</span></Label>
                                        <Select value={targetInternalWardId} onValueChange={setTargetInternalWardId} disabled={isLoadingAllWards}>
                                            <SelectTrigger id="targetInternalWard">
                                                <SelectValue placeholder="Select destination ward" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allWardsData.filter(ward => ward.id !== selectedWardId).map(ward => (
                                                    <SelectItem key={ward.id} value={ward.id}>{ward.name}</SelectItem>
                                                ))}
                                                {allWardsData.filter(ward => ward.id !== selectedWardId).length === 0 && <SelectItem value="no-other-wards" disabled>No other wards available</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {transferType === "external_hospital" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="externalHospitalName">Destination Hospital Name <span className="text-destructive">*</span></Label>
                                        <Input id="externalHospitalName" value={externalHospitalName} onChange={(e) => setExternalHospitalName(e.target.value)} placeholder="Enter hospital name" />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="transferReason">Reason for Transfer <span className="text-destructive">*</span></Label>
                                    <Textarea id="transferReason" value={transferReason} onChange={(e) => setTransferReason(e.target.value)} placeholder="Detailed reason for transfer..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={isProcessingTransfer}>Cancel</Button></DialogClose>
                                <Button onClick={handleConfirmTransfer} disabled={isProcessingTransfer || !transferType || !transferReason.trim() || (transferType === 'internal_ward' && !targetInternalWardId) || (transferType === 'external_hospital' && !externalHospitalName.trim())}>
                                    {isProcessingTransfer ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    Confirm Transfer
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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