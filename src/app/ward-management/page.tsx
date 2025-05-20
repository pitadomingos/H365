
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BedDouble, Users, LogOutIcon, CheckCircle2, ArrowRightLeft, FileText, Pill, MessageSquare, Loader2, Hospital, Activity, UserCheck, Bed, Edit, PlusCircle, Thermometer, Weight, Ruler, Sigma, Save, ActivityIcon as BloodPressureIcon, AlertTriangle as AlertTriangleIcon, Stethoscope, Layers, ClipboardCheck, History as HistoryIcon } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  admittedDate: string; // YYYY-MM-DD
  primaryDiagnosis?: string;
  keyAlerts?: string[];
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
  alerts: {
    criticalLabsPending: number;
    medicationsOverdue: number;
    vitalsChecksDue: number;
    newAdmissionOrders: number;
    pendingDischarges: number;
  };
}

interface VisitHistoryItem {
  id: string;
  date: string;
  facilityName: string;
  department: string;
  doctor: string;
  reason: string;
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

interface VitalsData {
  bodyTemperature?: string;
  weightKg?: string;
  heightCm?: string;
  bloodPressure?: string;
  bmi?: string;
  bmiStatus?: string;
  bpStatus?: string;
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
  vitals?: VitalsData;
  allergies?: string[];
  chronicConditions?: string[];
  codeStatus?: "Full Code" | "DNR" | "DNI" | "Limited";
  recentLabSummary?: string;
  recentImagingSummary?: string;
  visitHistory?: VisitHistoryItem[];
}

interface PendingAdmission {
  id: string;
  patientId: string;
  patientName: string;
  referringDepartment: string;
  reasonForAdmission: string;
}

const mockWardSummariesData: WardSummary[] = [
    { id: "W001", name: "General Medicine Ward A" },
    { id: "W002", name: "Surgical Ward B" },
    { id: "W003", name: "Pediatrics Ward C" },
    { id: "W004", name: "Maternity Ward D" },
];

const mockAdmittedPatientFullDetailsData: Record<string, AdmittedPatientFullDetails> = {
  "ADM001": {
    admissionId: "ADM001", patientId: "P001", name: "Eva Green", wardName: "General Medicine Ward A", bedNumber: "Bed 3",
    treatmentPlan: "IV Ceftriaxone 1g OD. Oxygen support PRN. Monitor vitals Q4H. Chest physiotherapy BID.",
    medicationSchedule: [
      { medicationItemId: "MEDSCH001-A-1", medication: "Ceftriaxone 1g IV", dosage: "1g", time: "08:00", status: "Administered", notes: "Given slowly over 30 mins." },
      { medicationItemId: "MEDSCH001-B-1", medication: "Paracetamol 500mg PO", dosage: "500mg", time: "12:00", status: "Pending" },
      { medicationItemId: "MEDSCH001-C-1", medication: "Salbutamol Neb", dosage: "2.5mg", time: "14:00", status: "Pending", notes: "Check O2 sats before/after." },
    ],
    doctorNotes: [{ noteId: "DN001-A-1", date: new Date(Date.now() - 86400000).toISOString(), doctor: "Dr. Smith", note: "Patient responding well. Continue plan." }, {noteId: "DN001-B-1", date: new Date().toISOString(), doctor: "Dr. House", note: "Reviewed chest X-ray, slight improvement in consolidation."}],
    vitals: { bodyTemperature: "37.2", weightKg: "65", heightCm: "168", bloodPressure: "120/80", bmi: "23.1", bpStatus: "Normal", bmiStatus: "Normal weight" },
    allergies: ["Penicillin"], chronicConditions: ["Asthma"], codeStatus: "Full Code",
    recentLabSummary: "WBC: 15.2 (High), CRP: 45 (High)", recentImagingSummary: "Chest X-Ray: Left lower lobe consolidation consistent with pneumonia.",
    visitHistory: [
        { id: "VH001", date: "2024-07-15", facilityName: "City Central Clinic", department: "Outpatient", doctor: "Dr. Primary", reason: "Routine Checkup" },
        { id: "VH002", date: "2024-06-20", facilityName: "HealthFlow Central Hospital", department: "Emergency", doctor: "Dr. ER Shift", reason: "Minor Fall" },
    ]
  },
   "ADM002": {
    admissionId: "ADM002", patientId: "P002", name: "Tom Hanks", wardName: "General Medicine Ward A", bedNumber: "Bed 5",
    treatmentPlan: "Furosemide 40mg IV BD. Fluid restriction 1.5L/day. Daily weights. Monitor electrolytes.",
    medicationSchedule: [{ medicationItemId: "MEDSCH002-A-1", medication: "Furosemide 40mg IV", dosage: "40mg", time: "09:00", status: "Administered" }],
    doctorNotes: [{ noteId: "DN002-A-1", date: new Date().toISOString(), doctor: "Dr. House", note: "Mild improvement in edema." }],
    vitals: { bodyTemperature: "36.8", weightKg: "80", heightCm: "175", bloodPressure: "135/85", bmi:"26.1", bpStatus: "Stage 1 HTN", bmiStatus: "Overweight" },
    allergies: ["Sulfa Drugs"], chronicConditions: ["Hypertension", "Type 2 Diabetes"], codeStatus: "Full Code",
    recentLabSummary: "K+: 3.2 (Low), Creatinine: 1.5 (High)", recentImagingSummary: "Echocardiogram: EF 35%.",
    visitHistory: [
        { id: "VH005", date: "2024-07-01", facilityName: "HealthFlow Central Hospital", department: "Cardiology", doctor: "Dr. Heart", reason: "Chest Pain Assessment" },
    ]
  },
  "ADM003": {
    admissionId: "ADM003", patientId: "P003", name: "Lucy Liu", wardName: "Surgical Ward B", bedNumber: "Bed 1",
    treatmentPlan: "Post-op day 1. Pain management with Tramadol 50mg PO Q6H PRN. Wound care. Encourage mobilization.",
    medicationSchedule: [{ medicationItemId: "MEDSCH003-A-1", medication: "Tramadol 50mg PO", dosage: "50mg", time: "PRN", status: "Pending" }],
    doctorNotes: [{ noteId: "DN003-A-1", date: new Date().toISOString(), doctor: "Dr. Grey", note: "Surgical site clean. Patient ambulating." }],
    vitals: { bodyTemperature: "37.0", weightKg: "55", heightCm: "160", bloodPressure: "110/70", bmi: "21.5", bpStatus: "Normal", bmiStatus: "Normal weight" },
    allergies: ["None Known"], chronicConditions: [], codeStatus: "Full Code",
    recentLabSummary: "Hgb: 11.8 (Stable)", recentImagingSummary: "N/A for this admission.",
    visitHistory: []
  },
  "ADM004": {
    admissionId: "ADM004", patientId: "P004", name: "Kevin McCallister", wardName: "Pediatrics Ward C", bedNumber: "Bed 2",
    treatmentPlan: "Nebulized Salbutamol Q4H. Prednisolone PO. Monitor oxygen saturation.",
    medicationSchedule: [{ medicationItemId: "MEDSCH004-A-1", medication: "Salbutamol Neb", dosage: "2.5mg", time: "10:00", status: "Administered" }],
    doctorNotes: [{ noteId: "DN004-A-1", date: new Date().toISOString(), doctor: "Dr. Carter", note: "Wheezing reduced. Stable." }],
     vitals: { bodyTemperature: "37.5", weightKg: "30", heightCm: "130", bloodPressure: "100/60", bmi:"17.7", bpStatus: "Normal", bmiStatus: "Underweight" },
     allergies: ["Peanuts"], chronicConditions: ["Childhood Asthma"], codeStatus: "Full Code",
     recentLabSummary: "N/A", recentImagingSummary: "Chest X-ray: Clear.",
     visitHistory: []
  },
  "ADM005": {
    admissionId: "ADM005", patientId: "P005", name: "Sarah Connor", wardName: "Maternity Ward D", bedNumber: "Bed 7",
    treatmentPlan: "Routine post-natal care. Monitor for bleeding. Pain relief PRN.",
    medicationSchedule: [{ medicationItemId: "MEDSCH005-A-1", medication: "Ibuprofen 400mg PO", dosage: "400mg", time: "PRN", status: "Pending" }],
    doctorNotes: [{ noteId: "DN005-A-1", date: new Date().toISOString(), doctor: "Dr. Greene", note: "Patient and baby doing well." }],
    vitals: { bodyTemperature: "36.9", weightKg: "70", heightCm: "170", bloodPressure: "118/78", bmi:"24.2", bpStatus: "Normal", bmiStatus: "Normal weight" },
    allergies: ["Codeine"], chronicConditions: [], codeStatus: "Full Code",
    recentLabSummary: "Hgb: 10.5 (Low Normal)", recentImagingSummary: "Post-delivery ultrasound: Normal involution.",
    visitHistory: []
  },
};

const mockWardDetailsData: Record<string, WardDetails> = {
    "W001": {
        id: "W001", name: "General Medicine Ward A", totalBeds: 20, occupiedBeds: 2, availableBeds: 18, occupancyRate: 10,
        patients: [
            { admissionId: "ADM001", patientId: "P001", name: "Eva Green", bedNumber: "Bed 3", admittedDate: "2024-07-20", primaryDiagnosis: "Pneumonia", keyAlerts: ["Isolation", "Oxygen PRN"] },
            { admissionId: "ADM002", patientId: "P002", name: "Tom Hanks", bedNumber: "Bed 5", admittedDate: "2024-06-15", primaryDiagnosis: "Heart Failure Exacerbation", keyAlerts: ["Fluid Restriction", "Daily Weight"] },
        ],
        beds: [
            { id: "B001-A", bedNumber: "Bed 1", status: "Available" }, { id: "B002-A", bedNumber: "Bed 2", status: "Cleaning" },
            { id: "B003-A", bedNumber: "Bed 3", status: "Occupied", patientName: "Eva Green", patientId: "P001" },
            { id: "B004-A", bedNumber: "Bed 4", status: "Available" },
            { id: "B005-A", bedNumber: "Bed 5", status: "Occupied", patientName: "Tom Hanks", patientId: "P002" },
            ...Array.from({ length: 15 }, (_, i) => ({ id: `B${(i + 6).toString().padStart(3, '0')}-A`, bedNumber: `Bed ${i + 6}`, status: "Available" as "Available" }))
        ],
        alerts: { criticalLabsPending: 2, medicationsOverdue: 1, vitalsChecksDue: 3, newAdmissionOrders: 0, pendingDischarges: 1 }
    },
    "W002": {
        id: "W002", name: "Surgical Ward B", totalBeds: 15, occupiedBeds: 1, availableBeds: 14, occupancyRate: 6.7,
        patients: [
            { admissionId: "ADM003", patientId: "P003", name: "Lucy Liu", bedNumber: "Bed 1", admittedDate: "2024-07-28", primaryDiagnosis: "Post-Appendectomy", keyAlerts: ["NPO", "Pain Control"] },
        ],
        beds: [
            { id: "B001-B", bedNumber: "Bed 1", status: "Occupied", patientName: "Lucy Liu", patientId: "P003" },
            ...Array.from({ length: 14 }, (_, i) => ({ id: `B${(i + 2).toString().padStart(3, '0')}-B`, bedNumber: `Bed ${i + 2}`, status: "Available" as "Available" }))
        ],
        alerts: { criticalLabsPending: 0, medicationsOverdue: 0, vitalsChecksDue: 1, newAdmissionOrders: 1, pendingDischarges: 0 }
    },
    "W003": {
        id: "W003", name: "Pediatrics Ward C", totalBeds: 10, occupiedBeds: 1, availableBeds: 9, occupancyRate: 10,
        patients: [
            { admissionId: "ADM004", patientId: "P004", name: "Kevin McCallister", bedNumber: "Bed 2", admittedDate: "2024-05-01", primaryDiagnosis: "Asthma Attack", keyAlerts: ["Parent Present", "Nebs Q4H"] },
        ],
        beds: [
            { id: "B001-C", bedNumber: "Bed 1", status: "Available" },
            { id: "B002-C", bedNumber: "Bed 2", status: "Occupied", patientName: "Kevin McCallister", patientId: "P004" },
             ...Array.from({ length: 8 }, (_, i) => ({ id: `B${(i + 3).toString().padStart(3, '0')}-C`, bedNumber: `Bed ${i + 3}`, status: "Available" as "Available" }))
        ],
        alerts: { criticalLabsPending: 1, medicationsOverdue: 0, vitalsChecksDue: 2, newAdmissionOrders: 0, pendingDischarges: 0 }
    },
    "W004": {
        id: "W004", name: "Maternity Ward D", totalBeds: 12, occupiedBeds: 1, availableBeds: 11, occupancyRate: 8.3,
        patients: [
             { admissionId: "ADM005", patientId: "P005", name: "Sarah Connor", bedNumber: "Bed 7", admittedDate: "2024-07-01", primaryDiagnosis: "Post-Natal Care", keyAlerts: ["Baby with Mother", "Monitor Bleeding"] },
        ],
        beds: [
             { id: "B007-D", bedNumber: "Bed 7", status: "Occupied", patientName: "Sarah Connor", patientId: "P005" },
            ...Array.from({ length: 11 }, (_, i) => ({ id: `B${(i + 1).toString().padStart(3, '0')}-D`, bedNumber: `Bed ${i + 1}`, status: i === 6 ? "Occupied" : "Available" as "Available", patientName: i === 6 ? "Sarah Connor" : undefined, patientId: i===6 ? "P005" : undefined  })).filter(b => b.id !== "B007-D")
        ],
        alerts: { criticalLabsPending: 0, medicationsOverdue: 1, vitalsChecksDue: 1, newAdmissionOrders: 0, pendingDischarges: 1 }
    },
};

const mockHospitalPendingAdmissionsData: PendingAdmission[] = [
    { id: "PEND001", patientId: "P101", patientName: "Alice Smith", referringDepartment: "Emergency", reasonForAdmission: "Severe Pneumonia, requires inpatient care." },
    { id: "PEND002", patientId: "P102", patientName: "Robert Jones", referringDepartment: "Outpatient Clinic", reasonForAdmission: "Uncontrolled Diabetes, needs stabilization." },
    { id: "PEND003", patientId: "P103", patientName: "Maria Garcia", referringDepartment: "Specialist Consultation (Cardiology)", reasonForAdmission: "Post-MI observation and cardiac rehab." },
];

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

const getBloodPressureStatus = (bp: string): { status: string; colorClass: string; textColorClass: string; } => {
  if (!bp || !bp.includes('/')) {
    return { status: "N/A", colorClass: "bg-gray-200 dark:bg-gray-700", textColorClass: "text-gray-800 dark:text-gray-200" };
  }
  const parts = bp.split('/');
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);

  if (isNaN(systolic) || isNaN(diastolic)) {
    return { status: "Invalid", colorClass: "bg-gray-200 dark:bg-gray-700", textColorClass: "text-gray-800 dark:text-gray-200" };
  }

  if (systolic < 90 || diastolic < 60) {
    return { status: "Hypotension", colorClass: "bg-blue-100 dark:bg-blue-800/30", textColorClass: "text-blue-700 dark:text-blue-300" };
  } else if (systolic < 120 && diastolic < 80) {
    return { status: "Normal", colorClass: "bg-green-100 dark:bg-green-800/30", textColorClass: "text-green-700 dark:text-green-300" };
  } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return { status: "Elevated", colorClass: "bg-yellow-100 dark:bg-yellow-800/30", textColorClass: "text-yellow-700 dark:text-yellow-300" };
  } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return { status: "Stage 1 HTN", colorClass: "bg-orange-100 dark:bg-orange-800/30", textColorClass: "text-orange-700 dark:text-orange-300" };
  } else if (systolic >= 140 || diastolic >= 90) {
    return { status: "Stage 2 HTN", colorClass: "bg-red-100 dark:bg-red-800/30", textColorClass: "text-red-700 dark:text-red-300" };
  } else if (systolic > 180 || diastolic > 120) {
    return { status: "Hypertensive Crisis", colorClass: "bg-red-200 dark:bg-red-900/40", textColorClass: "text-red-800 dark:text-red-200" };
  }
  return { status: "N/A", colorClass: "bg-gray-200 dark:bg-gray-700", textColorClass: "text-gray-800 dark:text-gray-200" };
};

const formatStayDuration = (admissionDateString: string): string => {
    if (!admissionDateString) return "N/A";
    const admissionDate = new Date(admissionDateString + "T00:00:00"); // Treat as local date
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "1 day";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;
        return `${weeks} week${weeks > 1 ? 's' : ''}${days > 0 ? `, ${days} day${days > 1 ? 's': ''}` : ''}`;
    }
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    return `${months} month${months > 1 ? 's' : ''}${remainingDays > 0 ? `, ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
};


export default function WardManagementPage() {
  const [allWardsData, setAllWardsData] = useState<WardSummary[]>([]);
  const [isLoadingAllWards, setIsLoadingAllWards] = useState(true);

  const [selectedWardId, setSelectedWardId] = useState<string | undefined>();
  const [currentWardDetails, setCurrentWardDetails] = useState<WardDetails | null>(null);
  const [isLoadingCurrentWardDetails, setIsLoadingCurrentWardDetails] = useState(false);

  const [longestStayPatients, setLongestStayPatients] = useState<{ name: string; duration: string; admissionId: string; }[]>([]);

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

  const [hospitalPendingAdmissions, setHospitalPendingAdmissions] = useState<PendingAdmission[]>([]);
  const [isLoadingPendingAdmissions, setIsLoadingPendingAdmissions] = useState(true);
  const [selectedPendingPatientId, setSelectedPendingPatientId] = useState("");
  const [selectedAvailableBedId, setSelectedAvailableBedId] = useState("");
  const [admissionDoctor, setAdmissionDoctor] = useState("");
  const [admissionDiagnosis, setAdmissionDiagnosis] = useState("");
  const [isAdmittingPatient, setIsAdmittingPatient] = useState(false);

  const [editableVitals, setEditableVitals] = useState<VitalsData>({});
  const [isSavingVitals, setIsSavingVitals] = useState(false);
  const [calculatedBmi, setCalculatedBmi] = useState<string | null>(null);
  const [bmiDisplay, setBmiDisplay] = useState<{ status: string; colorClass: string; textColorClass: string; } | null>(null);
  const [bpDisplay, setBpDisplay] = useState<{ status: string; colorClass: string, textColorClass: string; } | null>(null);


  useEffect(() => {
    setIsLoadingAllWards(true);
    setTimeout(async () => {
      try {
        // Simulate API call: GET /api/v1/wards
        setAllWardsData(mockWardSummariesData);
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load wards list." });
      } finally {
        setIsLoadingAllWards(false);
      }
    }, 500);

    setIsLoadingPendingAdmissions(true);
    setTimeout(async () => {
        try {
            // Simulate API call: GET /api/v1/admissions/pending
             setHospitalPendingAdmissions(mockHospitalPendingAdmissionsData);
        } catch (error) {
            console.error("Error fetching pending admissions:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not load pending admissions." });
        } finally {
            setIsLoadingPendingAdmissions(false);
        }
    }, 700);
  }, []);

  useEffect(() => {
    if (selectedWardId) {
      setIsLoadingCurrentWardDetails(true);
      setCurrentWardDetails(null); 
      setSelectedPatientForDetails(null); 
      setCurrentAdmittedPatientFullDetails(null); 
      setTimeout(async () => {
        try {
            // Simulate API call: GET /api/v1/wards/{selectedWardId}/details
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
        } catch (error) {
             console.error(`Error fetching ward ${selectedWardId} details:`, error);
             toast({ variant: "destructive", title: "Error", description: `Could not load details for ward ID ${selectedWardId}.` });
             setCurrentWardDetails(null);
        } finally {
            setIsLoadingCurrentWardDetails(false);
        }
      }, 600);
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
      setTimeout(async () => {
        try {
            // Simulate API call: GET /api/v1/admissions/{selectedPatientForDetails.admissionId}
            const fullDetails = mockAdmittedPatientFullDetailsData[selectedPatientForDetails.admissionId];
            setCurrentAdmittedPatientFullDetails(fullDetails || null);
            setEditableVitals(fullDetails?.vitals || {});
            if (fullDetails && fullDetails.vitals) {
              const w = parseFloat(fullDetails.vitals.weightKg || '0');
              const h = parseFloat(fullDetails.vitals.heightCm || '0');
              if (w > 0 && h > 0) {
                const hM = h / 100;
                const bmiVal = w / (hM * hM);
                setCalculatedBmi(bmiVal.toFixed(2));
                setBmiDisplay(getBmiStatusAndColor(bmiVal));
              } else {
                setCalculatedBmi(null);
                setBmiDisplay(getBmiStatusAndColor(null));
              }
              setBpDisplay(getBloodPressureStatus(fullDetails.vitals.bloodPressure || ""));
            } else {
              setCalculatedBmi(null);
              setBmiDisplay(getBmiStatusAndColor(null));
              setBpDisplay(getBloodPressureStatus(""));
            }
            if (fullDetails) {
              setMedicationScheduleInModal(fullDetails.medicationSchedule.map(item => ({...item}))); 
            } else {
              setMedicationScheduleInModal([]);
            }
        } catch (error) {
             console.error(`Error fetching admission ${selectedPatientForDetails.admissionId} details:`, error);
             toast({ variant: "destructive", title: "Error", description: `Could not load details for patient ${selectedPatientForDetails.name}.` });
             setCurrentAdmittedPatientFullDetails(null);
        } finally {
            setIsLoadingSelectedPatientDetails(false);
        }
      }, 500);
    } else {
        setCurrentAdmittedPatientFullDetails(null);
        setEditableVitals({});
        setCalculatedBmi(null);
        setBmiDisplay(getBmiStatusAndColor(null));
        setBpDisplay(getBloodPressureStatus(""));
        setMedicationScheduleInModal([]);
    }
  }, [selectedPatientForDetails]);

  useEffect(() => {
    const w = parseFloat(editableVitals.weightKg || '0');
    const h = parseFloat(editableVitals.heightCm || '0');
    if (w > 0 && h > 0) {
      const hM = h / 100;
      const bmiVal = w / (hM * hM);
      setCalculatedBmi(bmiVal.toFixed(2));
      setBmiDisplay(getBmiStatusAndColor(bmiVal));
    } else {
      setCalculatedBmi(null);
      setBmiDisplay(getBmiStatusAndColor(null));
    }
  }, [editableVitals.weightKg, editableVitals.heightCm]);

  useEffect(() => {
    setBpDisplay(getBloodPressureStatus(editableVitals.bloodPressure || ""));
  }, [editableVitals.bloodPressure]);

  useEffect(() => {
    if (currentWardDetails?.patients) {
        const today = new Date();
        const stays = currentWardDetails.patients.map(p => {
            const admittedDate = new Date(p.admittedDate + "T00:00:00"); // Ensure correct date parsing
            const durationMs = today.getTime() - admittedDate.getTime();
            const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
            return { ...p, durationDays };
        }).sort((a, b) => b.durationDays - a.durationDays);

        setLongestStayPatients(
            stays.slice(0, 5).map(p => ({
                name: p.name,
                duration: formatStayDuration(p.admittedDate),
                admissionId: p.admissionId 
            }))
        );
    } else {
        setLongestStayPatients([]);
    }
  }, [currentWardDetails]);

  const handleEditableVitalsChange = (field: keyof VitalsData, value: string) => {
    setEditableVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveVitals = async () => {
    if (!currentAdmittedPatientFullDetails) return;
    setIsSavingVitals(true);
    const payload = { admissionId: currentAdmittedPatientFullDetails.admissionId, vitals: editableVitals };
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        const updatedVitalsWithCalculated = { ...editableVitals, bmi: calculatedBmi || undefined, bmiStatus: bmiDisplay?.status, bpStatus: bpDisplay?.status };
        
        setCurrentAdmittedPatientFullDetails(prev => prev ? ({ ...prev, vitals: updatedVitalsWithCalculated }) : null);
        
        if(mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId]){
            mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId].vitals = updatedVitalsWithCalculated;
        }
        toast({ title: "Vitals Saved (Mock)", description: "Patient vitals updated successfully." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message || "Could not save vitals." });
    } finally {
        setIsSavingVitals(false);
    }
  };


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
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

        const newPatientInWard: PatientInWard = {
            admissionId: newAdmissionId, 
            patientId: patientToAdmit.patientId,
            name: patientToAdmit.patientName,
            bedNumber: bedToOccupy.bedNumber,
            admittedDate: new Date().toISOString().split('T')[0],
            primaryDiagnosis: admissionDiagnosis,
            keyAlerts: ["New Admission"] 
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
                 alerts: { ...prev.alerts, newAdmissionOrders: prev.alerts.newAdmissionOrders + 1 }
            };
        });
        
        mockAdmittedPatientFullDetailsData[newAdmissionId] = {
            admissionId: newAdmissionId,
            patientId: patientToAdmit.patientId,
            name: patientToAdmit.patientName,
            wardName: currentWardDetails.name,
            bedNumber: bedToOccupy.bedNumber,
            treatmentPlan: `Initial plan for ${admissionDiagnosis}. Monitor vitals.`,
            medicationSchedule: [],
            doctorNotes: [{noteId: `DN-ADMIT-${Date.now()}`, date: new Date().toISOString(), doctor: admissionDoctor, note: `Admitted for ${admissionDiagnosis}.`}],
            vitals: {}, allergies: [], chronicConditions: [], codeStatus: "Full Code", visitHistory: []
        };

        setHospitalPendingAdmissions(prev => prev.filter(p => p.id !== selectedPendingPatientId));
        toast({ title: "Patient Admitted (Mock)", description: `${patientToAdmit.patientName} admitted to ${currentWardDetails.name}, ${bedToOccupy.bedNumber}.` });

        setSelectedPendingPatientId("");
        setSelectedAvailableBedId("");
        setAdmissionDoctor("");
        setAdmissionDiagnosis("");
    } catch (error: any) {
         toast({ variant: "destructive", title: "Admission Error", description: error.message || "Could not admit patient." });
    } finally {
        setIsAdmittingPatient(false);
    }
  };


  const handleAddNote = async () => {
    if (!newDoctorNote.trim() || !currentAdmittedPatientFullDetails) return;
    setIsAddingNote(true);
    const payload = { admissionId: currentAdmittedPatientFullDetails.admissionId, doctorId: "doc-currentUser-mockId", note: newDoctorNote };
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        const newNoteEntry: DoctorNote = { noteId: `DN${Date.now()}`, date: new Date().toISOString(), doctor: "Dr. Current User (Mock)", note: newDoctorNote };
        
        setCurrentAdmittedPatientFullDetails(prev => prev ? ({ ...prev, doctorNotes: [newNoteEntry, ...prev.doctorNotes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }) : null);
        
        if (currentAdmittedPatientFullDetails && mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId]) {
          mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId].doctorNotes = [newNoteEntry, ...mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId].doctorNotes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        toast({title: "Note Saved (Mock)", description: "New doctor's note added."});
        setNewDoctorNote("");
    } catch (error: any) {
         toast({ variant: "destructive", title: "Note Error", description: error.message || "Could not add note." });
    } finally {
        setIsAddingNote(false);
    }
  };

  const handleOpenMedicationModal = () => {
    if (!currentAdmittedPatientFullDetails) return;
    setMedicationScheduleInModal(currentAdmittedPatientFullDetails.medicationSchedule.map(med => ({ ...med }))); 
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
     try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        setCurrentAdmittedPatientFullDetails(prev => prev ? ({ ...prev, medicationSchedule: medicationScheduleInModal }) : null);
        
        if (currentAdmittedPatientFullDetails && mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId]) {
            mockAdmittedPatientFullDetailsData[currentAdmittedPatientFullDetails.admissionId].medicationSchedule = medicationScheduleInModal;
        }

        toast({title: "Medication Log Updated (Mock)", description: "Medication schedule has been updated."});
        setIsMedicationModalOpen(false);
    } catch (error: any) {
        toast({ variant: "destructive", title: "Medication Error", description: error.message || "Could not update medication schedule." });
    } finally {
        setIsSavingMedicationUpdates(false);
    }
  };

  const handleDischarge = async () => {
    if (!currentAdmittedPatientFullDetails || !selectedWardId) return;
    setIsDischarging(true);
    const payload = { admissionId: currentAdmittedPatientFullDetails.admissionId, dischargeDate: new Date().toISOString(), dischargeSummary: "Patient stable for discharge.", dischargedBy: "doc-currentUser-mockId" };
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
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
                occupancyRate: (occupiedBeds / prevDetails.totalBeds) * 100,
                alerts: { ...prevDetails.alerts, pendingDischarges: Math.max(0, prevDetails.alerts.pendingDischarges -1) }
            };
        });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Discharge Error", description: error.message || "Could not discharge patient." });
    } finally {
        setIsDischarging(false);
    }
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
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
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
    } catch (error: any) {
        toast({ variant: "destructive", title: "Transfer Error", description: error.message || "Could not initiate transfer." });
    } finally {
        setIsProcessingTransfer(false);
    }
  };


  return (
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
              <>
                <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-3">
                  <h3 className="text-lg font-semibold">{currentWardDetails.name} - Dashboard</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                    <div><strong>Total Beds:</strong> {currentWardDetails.totalBeds}</div>
                    <div><strong>Occupied:</strong> {currentWardDetails.occupiedBeds}</div>
                    <div><strong>Available:</strong> {currentWardDetails.availableBeds}</div>
                    <div><strong>Patients in Ward:</strong> {currentWardDetails.patients.length}</div>
                    <div><strong>Occupancy:</strong> {currentWardDetails.occupancyRate.toFixed(1)}%</div>
                  </div>
                  <Progress value={currentWardDetails.occupancyRate} className="h-3 mt-1" />
                   {longestStayPatients.length > 0 && (
                        <div className="mt-4 pt-3 border-t">
                            <h4 className="text-sm font-semibold mb-1.5">Longest Stays (Top 5)</h4>
                            <ol className="list-decimal list-inside text-xs space-y-1 text-muted-foreground">
                                {longestStayPatients.map(p => (
                                    <li key={p.admissionId}>{p.name} - {p.duration}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
                 <Card className="shadow-sm mt-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-md"><AlertTriangleIcon className="h-5 w-5 text-orange-500"/> Ward Alerts & Key Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
                        <div className="p-2.5 border rounded-md bg-background text-center shadow-xs">
                            <p className="font-semibold text-lg text-destructive">{currentWardDetails.alerts.criticalLabsPending}</p>
                            <p className="text-xs text-muted-foreground">Critical Labs Pending</p>
                        </div>
                        <div className="p-2.5 border rounded-md bg-background text-center shadow-xs">
                            <p className="font-semibold text-lg text-amber-600">{currentWardDetails.alerts.medicationsOverdue}</p>
                            <p className="text-xs text-muted-foreground">Meds Overdue</p>
                        </div>
                        <div className="p-2.5 border rounded-md bg-background text-center shadow-xs">
                            <p className="font-semibold text-lg text-blue-600">{currentWardDetails.alerts.vitalsChecksDue}</p>
                            <p className="text-xs text-muted-foreground">Vitals Checks Due</p>
                        </div>
                        <div className="p-2.5 border rounded-md bg-background text-center shadow-xs">
                            <p className="font-semibold text-lg text-green-600">{currentWardDetails.alerts.newAdmissionOrders}</p>
                            <p className="text-xs text-muted-foreground">New Admission Orders</p>
                        </div>
                         <div className="p-2.5 border rounded-md bg-background text-center shadow-xs">
                            <p className="font-semibold text-lg text-purple-600">{currentWardDetails.alerts.pendingDischarges}</p>
                            <p className="text-xs text-muted-foreground">Pending Discharges</p>
                        </div>
                    </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>

        {selectedWardId && currentWardDetails && !isLoadingCurrentWardDetails && (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
                <Card className="shadow-sm lg:col-span-1">
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
                                <div className="space-y-1">
                                    <Label htmlFor="selectPendingPatient">Patient to Admit</Label>
                                    <Select value={selectedPendingPatientId} onValueChange={setSelectedPendingPatientId} disabled={isAdmittingPatient}>
                                        <SelectTrigger id="selectPendingPatient">
                                            <SelectValue placeholder="Select patient..." />
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
                                                <SelectItem value="no-beds" disabled>No beds available.</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="admissionDoctor">Admitting Doctor</Label>
                                    <Input id="admissionDoctor" value={admissionDoctor} onChange={(e) => setAdmissionDoctor(e.target.value)} placeholder="Doctor's name" disabled={isAdmittingPatient}/>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="admissionDiagnosis">Primary Diagnosis/Reason</Label>
                                    <Textarea 
                                        id="admissionDiagnosis" 
                                        value={admissionDiagnosis} 
                                        onChange={(e) => setAdmissionDiagnosis(e.target.value)} 
                                        placeholder="Enter primary diagnosis" 
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
                                className="w-full"
                            >
                                {isAdmittingPatient ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                                {isAdmittingPatient ? "Admitting..." : "Admit Patient"}
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <Card className="shadow-sm lg:col-span-1">
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
                                 <TableHead>Key Alerts</TableHead>
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
                                <TableCell className="space-x-1">
                                    {patient.keyAlerts && patient.keyAlerts.map(alert => (
                                        <Badge key={alert} variant={alert === "Isolation" || alert === "DNR" ? "destructive" : "secondary"} className="text-xs">{alert}</Badge>
                                    ))}
                                    {(!patient.keyAlerts || patient.keyAlerts.length === 0) && <span className="text-xs text-muted-foreground">None</span>}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        ) : (
                        <p className="text-center py-6 text-muted-foreground">No patients currently admitted to this ward.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary"/>Bed Status - {currentWardDetails.name}</CardTitle>
                        <CardDescription>Overview of all beds in this ward.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
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
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-1 space-y-4">
                    <h4 className="text-md font-semibold flex items-center"><HistoryIcon className="mr-2 h-4 w-4 text-primary" /> Recent Visit History (Last 10)</h4>
                    {currentAdmittedPatientFullDetails.visitHistory && currentAdmittedPatientFullDetails.visitHistory.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 border rounded-md p-3 bg-muted/10">
                            {currentAdmittedPatientFullDetails.visitHistory.slice(0, 10).map(visit => (
                                <div key={visit.id} className="text-xs p-2 border rounded-md bg-background shadow-sm">
                                    <p className="font-medium">{new Date(visit.date).toLocaleDateString()} - {visit.facilityName}</p>
                                    <p className="text-muted-foreground">Dept: {visit.department} | Dr: {visit.doctor}</p>
                                    <p className="text-muted-foreground mt-0.5">Reason: {visit.reason}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">No prior visit history available.</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <Card className="shadow-xs">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Allergies</CardTitle></CardHeader>
                        <CardContent>
                            {currentAdmittedPatientFullDetails.allergies && currentAdmittedPatientFullDetails.allergies.length > 0 ? 
                            currentAdmittedPatientFullDetails.allergies.map(a => <Badge key={a} variant="destructive" className="mr-1 mb-1 text-xs">{a}</Badge>) : 
                            <p className="text-muted-foreground text-xs">None reported</p>}
                        </CardContent>
                        </Card>
                        <Card className="shadow-xs">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Chronic Conditions</CardTitle></CardHeader>
                        <CardContent>
                            {currentAdmittedPatientFullDetails.chronicConditions && currentAdmittedPatientFullDetails.chronicConditions.length > 0 ? 
                            currentAdmittedPatientFullDetails.chronicConditions.map(c => <Badge key={c} variant="outline" className="mr-1 mb-1 text-xs">{c}</Badge>) : 
                            <p className="text-muted-foreground text-xs">None reported</p>}
                        </CardContent>
                        </Card>
                        <Card className="shadow-xs">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Code Status</CardTitle></CardHeader>
                        <CardContent>
                            <Badge variant={currentAdmittedPatientFullDetails.codeStatus === "DNR" ? "destructive" : "secondary"} className="text-xs">
                                {currentAdmittedPatientFullDetails.codeStatus || "N/A"}
                            </Badge>
                        </CardContent>
                        </Card>
                    </div>
                    <Separator/>

                    <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                        <h4 className="text-md font-semibold mb-2 flex items-center"><Activity className="mr-2 h-4 w-4 text-primary" /> Current Vitals</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                            <div className="space-y-1">
                                <Label htmlFor="wardBodyTemperature" className="flex items-center text-xs"><Thermometer className="mr-1.5 h-3 w-3" />Temp (°C)</Label>
                                <Input id="wardBodyTemperature" value={editableVitals.bodyTemperature || ""} onChange={(e) => handleEditableVitalsChange("bodyTemperature", e.target.value)} placeholder="e.g., 37.5" disabled={isSavingVitals} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="wardWeight" className="flex items-center text-xs"><Weight className="mr-1.5 h-3 w-3" />Weight (kg)</Label>
                                <Input id="wardWeight" value={editableVitals.weightKg || ""} onChange={(e) => handleEditableVitalsChange("weightKg", e.target.value)} placeholder="e.g., 70" disabled={isSavingVitals} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="wardHeight" className="flex items-center text-xs"><Ruler className="mr-1.5 h-3 w-3" />Height (cm)</Label>
                                <Input id="wardHeight" value={editableVitals.heightCm || ""} onChange={(e) => handleEditableVitalsChange("heightCm", e.target.value)} placeholder="e.g., 175" disabled={isSavingVitals} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="wardBloodPressure" className="flex items-center text-xs"><BloodPressureIcon className="mr-1.5 h-3 w-3" />BP (mmHg)</Label>
                                <Input id="wardBloodPressure" value={editableVitals.bloodPressure || ""} onChange={(e) => handleEditableVitalsChange("bloodPressure", e.target.value)} placeholder="e.g., 120/80" disabled={isSavingVitals} />
                            </div>
                            <div className="space-y-1">
                                <Label className="flex items-center text-xs"><Sigma className="mr-1.5 h-3 w-3" />BMI (kg/m²)</Label>
                                <div className="flex items-center gap-2 p-2 h-10 rounded-md border border-input bg-background min-w-[150px]">
                                    <span className="text-sm font-medium">{calculatedBmi || "N/A"}</span>
                                    {bmiDisplay && bmiDisplay.status !== "N/A" && (
                                        <Badge className={cn("border-transparent text-xs px-1.5 py-0.5", bmiDisplay.colorClass, bmiDisplay.textColorClass)}>{bmiDisplay.status}</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="flex items-center text-xs"><BloodPressureIcon className="mr-1.5 h-3 w-3" />BP Status</Label>
                                <div className="flex items-center gap-2 p-2 h-10 rounded-md border border-input bg-background min-w-[150px]">
                                    {bpDisplay && bpDisplay.status !== "N/A" && bpDisplay.status !== "Invalid" && (
                                        <Badge className={cn("border-transparent text-xs px-1.5 py-0.5", bpDisplay.colorClass, bpDisplay.textColorClass)}>{bpDisplay.status}</Badge>
                                    )}
                                    {(bpDisplay?.status === "N/A" || bpDisplay?.status === "Invalid") && (
                                    <span className="text-sm font-medium">{bpDisplay.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button size="sm" onClick={handleSaveVitals} disabled={isSavingVitals || !currentAdmittedPatientFullDetails} className="mt-2">
                            {isSavingVitals ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                            Save Vitals
                        </Button>
                    </div>
                    <Separator />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-md font-semibold mb-2 flex items-center"><ClipboardCheck className="mr-2 h-4 w-4 text-primary" /> Recent Key Lab Summary</h4>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md min-h-[60px] whitespace-pre-wrap">{currentAdmittedPatientFullDetails.recentLabSummary || "No recent lab summary available."}</p>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold mb-2 flex items-center"><Layers className="mr-2 h-4 w-4 text-primary" /> Recent Key Imaging Summary</h4>
                            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md min-h-[60px] whitespace-pre-wrap">{currentAdmittedPatientFullDetails.recentImagingSummary || "No recent imaging summary available."}</p>
                        </div>
                    </div>
                    <Separator />

                    <div>
                        <h4 className="text-md font-semibold mb-2 flex items-center"><FileText className="mr-2 h-4 w-4 text-primary" /> Treatment Plan Summary</h4>
                        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">{currentAdmittedPatientFullDetails.treatmentPlan}</p>
                    </div>
                    <Separator />

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-md font-semibold flex items-center"><Pill className="mr-2 h-4 w-4 text-primary" /> Medication Schedule</h4>
                            <Dialog open={isMedicationModalOpen} onOpenChange={(open) => { if(!open) {setNewMedName(""); setNewMedDosage(""); setNewMedTime(""); setNewMedNotes("");} setIsMedicationModalOpen(open);}}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={handleOpenMedicationModal} disabled={isSavingMedicationUpdates || isDischarging || isProcessingTransfer || isAddingNote || isSavingVitals}>
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
                    <Separator />
                    
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
                        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleAddNote} disabled={isAddingNote || !newDoctorNote.trim() || isDischarging || isProcessingTransfer || isSavingMedicationUpdates || isSavingVitals}>
                        {isAddingNote ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        {isAddingNote ? "Adding..." : "Add Note"}
                        </Button>
                    </div>
                  </div>
                </div>
              )}
              {!isLoadingSelectedPatientDetails && !currentAdmittedPatientFullDetails && selectedPatientForDetails && (
                 <p className="text-center py-6 text-muted-foreground">Could not load full details for this patient.</p>
              )}
            </CardContent>
            {currentAdmittedPatientFullDetails && (
                <CardFooter className="border-t pt-4 flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto" onClick={handleDischarge} disabled={isDischarging || isProcessingTransfer || isAddingNote || isSavingMedicationUpdates || isSavingVitals}>
                        {isDischarging ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOutIcon className="mr-2 h-4 w-4" />}
                        {isDischarging ? "Discharging..." : `Discharge ${currentAdmittedPatientFullDetails.name.split(' ')[0]}`}
                    </Button>
                    
                    <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full sm:w-auto" onClick={handleOpenTransferModal} disabled={isDischarging || isProcessingTransfer || isAddingNote || isSavingMedicationUpdates || isSavingVitals}>
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
                                        <Select value={targetInternalWardId} onValueChange={setTargetInternalWardId} disabled={isLoadingAllWards || isProcessingTransfer}>
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
                                        <Input id="externalHospitalName" value={externalHospitalName} onChange={(e) => setExternalHospitalName(e.target.value)} placeholder="Enter hospital name" disabled={isProcessingTransfer}/>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="transferReason">Reason for Transfer <span className="text-destructive">*</span></Label>
                                    <Textarea id="transferReason" value={transferReason} onChange={(e) => setTransferReason(e.target.value)} placeholder="Detailed reason for transfer..." disabled={isProcessingTransfer}/>
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
  );
}
