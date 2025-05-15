
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Baby, Search, CalendarPlus, FileText, ShieldAlert, Microscope, Ultrasound } from "lucide-react";
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

export default function MaternityCarePage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<MaternityPatient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!searchNationalId) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a National ID." });
      return;
    }
    setIsLoading(true);
    setSelectedPatient(null);
    // Simulate API call
    setTimeout(() => {
      const found = mockPatients.find(p => p.nationalId === searchNationalId);
      if (found) {
        setSelectedPatient(found);
        toast({ title: "Patient Found", description: `${found.fullName}'s maternity record loaded.` });
      } else {
        toast({ variant: "destructive", title: "Not Found", description: "No maternity record found for this National ID." });
      }
      setIsLoading(false);
    }, 1000);
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
                disabled={isLoading}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <Search className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
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
                        data-ai-hint="patient photo" 
                    />
                    <div className="flex-1">
                        <CardTitle>{selectedPatient.fullName}</CardTitle>
                        <CardDescription>ID: {selectedPatient.nationalId} | Age: {selectedPatient.age}</CardDescription>
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
                    <Button variant="outline" className="w-full" onClick={() => toast({title: "Mock Action", description:"Open form to schedule next visit."})}><CalendarPlus className="mr-2 h-4 w-4"/>Schedule Next ANC Visit</Button>
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
                  <Button onClick={() => toast({ title: "Mock Action", description: "Open form to add new antenatal visit." })}>
                    <CalendarPlus className="mr-2 h-4 w-4" /> Log New Visit
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Ultrasound & Lab Results Summary</CardTitle>
                    <CardDescription>Key findings and links to reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label className="flex items-center gap-1.5"><Ultrasound className="h-4 w-4 text-primary"/> Latest Ultrasound Summary (Mock)</Label>
                        <Textarea readOnly defaultValue="Anomaly scan at 20w 2d: Normal fetal anatomy. Placenta posterior, clear of os. AFI normal. EFW: 350g. Next scan: Growth scan at 32w." className="text-sm bg-muted/50"/>
                    </div>
                     <div className="space-y-1">
                        <Label className="flex items-center gap-1.5"><Microscope className="h-4 w-4 text-primary"/> Key Lab Results (Mock)</Label>
                        <Textarea readOnly defaultValue="Hb: 11.5 g/dL (12w)\nGTT: Normal (26w)\nUrine Culture: No growth (12w)\nHIV/Syphilis/HepB: Non-reactive" className="text-sm bg-muted/50"/>
                    </div>
                </CardContent>
                 <CardFooter className="gap-2">
                    <Button variant="outline" onClick={() => toast({title: "Mock Action", description:"Open form to order lab tests."})}>Order Labs</Button>
                    <Button variant="outline" onClick={() => toast({title: "Mock Action", description:"Open form to order ultrasound."})}>Order Ultrasound</Button>
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
