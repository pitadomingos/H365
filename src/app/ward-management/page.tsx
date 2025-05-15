
"use client";

import React, { useState } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BedDouble, Users, ListFilter, PlusCircle, LogOutIcon, CheckCircle2, AlertTriangle, ArrowRightLeft } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

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

export default function WardManagementPage() {
  const [wards, setWards] = useState<Ward[]>([
    { id: "W001", name: "General Medicine Ward A", totalBeds: 20, occupiedBeds: 15 },
    { id: "W002", name: "Surgical Ward B", totalBeds: 15, occupiedBeds: 14 },
    { id: "W003", name: "Pediatrics Ward C", totalBeds: 10, occupiedBeds: 5 },
    { id: "W004", name: "Maternity Ward D", totalBeds: 12, occupiedBeds: 10 },
  ]);

  const [admittingPatients, setAdmittingPatients] = useState<AdmittingPatient[]>([
    { id: "P001", name: "Alice Wonderland", sourceDepartment: "Emergency", priority: "High", status: "Awaiting Bed" },
    { id: "P002", name: "Bob The Builder", sourceDepartment: "Outpatient Clinic", priority: "Medium", status: "Awaiting Bed" },
    { id: "P003", name: "Charlie Brown", sourceDepartment: "Specialization Consult", priority: "Low", status: "Awaiting Bed" },
  ]);

  const [selectedWardForAssignment, setSelectedWardForAssignment] = useState<string | undefined>();
  const [bedsInSelectedWard, setBedsInSelectedWard] = useState<Bed[]>([]);

  React.useEffect(() => {
    // Mock fetching beds for the selected ward
    if (selectedWardForAssignment) {
      const mockBeds: Bed[] = Array.from({ length: wards.find(w => w.id === selectedWardForAssignment)?.totalBeds || 0 }).map((_, i) => ({
        id: `B${selectedWardForAssignment}${i+1}`,
        bedNumber: `Bed ${i+1}`,
        status: Math.random() > 0.7 ? "Occupied" : (Math.random() > 0.5 ? "Cleaning" : "Available"),
        patientName: Math.random() > 0.7 ? `Patient ${String.fromCharCode(65 + i)}` : undefined
      }));
      setBedsInSelectedWard(mockBeds);
    } else {
      setBedsInSelectedWard([]);
    }
  }, [selectedWardForAssignment, wards]);


  const handleAssignBed = () => {
    // Mock action
    toast({ title: "Bed Assigned (Mock)", description: "Patient has been assigned to a bed." });
  };

  const handleDischarge = (patientName: string) => {
     toast({ title: "Patient Discharged (Mock)", description: `${patientName} has been processed for discharge.` });
  };
  
  const handleTransfer = (patientName: string) => {
     toast({ title: "Patient Transfer Initiated (Mock)", description: `Transfer process for ${patientName} has started.` });
  };


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BedDouble className="h-8 w-8" /> Ward Management
          </h1>
          <Button variant="outline">
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
              {wards.map((ward) => (
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
              {admittingPatients.length === 0 && <p className="text-center py-4 text-muted-foreground">No patients currently awaiting admission.</p>}
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
                  <Select>
                    <SelectTrigger id="selectPatient">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {admittingPatients.filter(p => p.status === "Awaiting Bed").map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.sourceDepartment})</SelectItem>
                      ))}
                       {admittingPatients.filter(p => p.status === "Awaiting Bed").length === 0 && <SelectItem value="none" disabled>No patients awaiting bed</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="selectWard">Target Ward</Label>
                  <Select onValueChange={setSelectedWardForAssignment}>
                    <SelectTrigger id="selectWard">
                      <SelectValue placeholder="Select Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name} ({w.totalBeds - w.occupiedBeds} available)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor="selectBed">Available Bed</Label>
                  <Select disabled={!selectedWardForAssignment || bedsInSelectedWard.filter(b => b.status === 'Available').length === 0}>
                    <SelectTrigger id="selectBed">
                      <SelectValue placeholder="Select Bed" />
                    </SelectTrigger>
                    <SelectContent>
                      {bedsInSelectedWard.filter(b => b.status === 'Available').map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.bedNumber}</SelectItem>
                      ))}
                      {selectedWardForAssignment && bedsInSelectedWard.filter(b => b.status === 'Available').length === 0 && <SelectItem value="none" disabled>No available beds in this ward</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               {selectedWardForAssignment && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Beds in {wards.find(w=>w.id === selectedWardForAssignment)?.name || 'Selected Ward'}:</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto pr-2">
                        {bedsInSelectedWard.map(bed => (
                            <Badge key={bed.id} variant={bed.status === 'Occupied' ? 'destructive' : bed.status === 'Cleaning' ? 'secondary': 'default'} className="text-xs p-1.5 justify-center">
                                {bed.bedNumber}
                            </Badge>
                        ))}
                    </div>
                </div>
               )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleAssignBed} disabled={!selectedWardForAssignment}>
                <PlusCircle className="mr-2 h-4 w-4" /> Assign to Bed
              </Button>
            </CardFooter>
          </Card>

          {/* In-Patient Management (Discharge/Transfer) */}
          <Card className="lg:col-span-full xl:col-span-1 shadow-sm">
             <CardHeader>
                <CardTitle>In-Patient Operations</CardTitle>
                <CardDescription>Manage currently admitted patients.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-1.5 mb-4">
                  <Label htmlFor="selectAdmittedPatient">Select Admitted Patient</Label>
                  <Select>
                    <SelectTrigger id="selectAdmittedPatient">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Mock admitted patients */}
                        <SelectItem value="P101">Patient X (Ward A - Bed 3)</SelectItem>
                        <SelectItem value="P102">Patient Y (Ward B - Bed 10)</SelectItem>
                        <SelectItem value="P103">Patient Z (Pediatrics - Bed 2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full" onClick={() => handleDischarge("Selected Patient")}>
                        <LogOutIcon className="mr-2 h-4 w-4" /> Discharge Patient
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => handleTransfer("Selected Patient")}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Patient
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Select a patient to see more detailed care options, update records, or manage their stay.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
