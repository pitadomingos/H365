
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Users, BriefcaseMedical, Clock, Building, MapPin, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

// Patient data structure (for searched patient)
interface Patient {
  id: string;
  nationalId: string;
  fullName: string;
  dob: string;
  gender: string;
}

// Updated Waiting list item data structure to match registration page
interface WaitingListItem {
  id: string | number;
  patientName: string;
  photoUrl: string;
  timeAdded: string;
  location: string; // Renamed from department for consistency
  status: string;   // Renamed from reason for consistency
}

export default function VisitingPatientsPage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [department, setDepartment] = useState(""); // Used for new visit entry
  const [reasonForVisit, setReasonForVisit] = useState(""); // Used for new visit entry
  const [assignedDoctor, setAssignedDoctor] = useState("");

  const [currentDate, setCurrentDate] = useState('');
  const hospitalName = "HealthFlow Central Hospital";

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // Initial waiting list data matching registration page
  const initialWaitingList: WaitingListItem[] = [
    { id: "WL001", patientName: "Alice Wonderland", timeAdded: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL002", patientName: "Bob The Builder", timeAdded: "10:45 AM", location: "Consultation Room 1", status: "Dispatched to Ward A", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL003", patientName: "Charlie Brown", timeAdded: "11:00 AM", location: "Laboratory", status: "Awaiting Results", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL004", patientName: "Diana Prince", timeAdded: "11:15 AM", location: "Pharmacy", status: "Collecting Medication", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL005", patientName: "Edward Scissorhands", timeAdded: "11:30 AM", location: "Specialized Dentist", status: "Procedure Complete", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL006", patientName: "Fiona Gallagher", timeAdded: "11:45 AM", location: "Outpatient", status: "Dispatched to Homecare", photoUrl: "https://placehold.co/40x40.png" },
  ];
  const [waitingList, setWaitingList] = useState<WaitingListItem[]>(initialWaitingList);


  const handleSearchPatient = () => {
    if (!searchNationalId.trim()) {
      toast({ variant: "destructive", title: "Missing ID", description: "Please enter a National ID to search." });
      return;
    }
    setIsLoadingSearch(true);
    setSearchedPatient(null);
    setPatientNotFound(false);

    setTimeout(() => {
      if (searchNationalId === "123456789") {
        setSearchedPatient({
          id: "P001",
          nationalId: "123456789",
          fullName: "Demo Patient One",
          dob: "1990-01-01",
          gender: "Male",
        });
      } else {
        setPatientNotFound(true);
      }
      setIsLoadingSearch(false);
    }, 1000);
  };

  const handleAddToWaitingList = () => {
    if (!searchedPatient) {
        toast({ variant: "destructive", title: "No Patient", description: "No patient selected." });
        return;
    }
    if (!department || !reasonForVisit) {
        toast({ variant: "destructive", title: "Missing Details", description: "Please select department and provide reason for visit." });
        return;
    }
    const newWaitingListItem: WaitingListItem = {
        id: `WL${Math.random().toString(36).substr(2, 5)}`,
        patientName: searchedPatient.fullName,
        photoUrl: "https://placehold.co/40x40.png", // Default photo for new entries
        location: department, // Using department as location for the list
        status: reasonForVisit, // Using reason as status for the list
        timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWaitingList(prev => [newWaitingListItem, ...prev]);
    
    toast({ title: "Patient Added", description: `${newWaitingListItem.patientName} added to waiting list for ${department}.`});
    
    setSearchedPatient(null);
    setSearchNationalId("");
    setDepartment("");
    setReasonForVisit("");
    setAssignedDoctor("");
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" /> Visiting Patients Management
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient Search and Visit Details Section */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Patient Visit Entry</CardTitle>
              <CardDescription>Search for an existing patient or register a new one to manage their visit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div>
                <Label htmlFor="searchNationalId">Search Patient by National ID</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="searchNationalId"
                    placeholder="Enter National ID"
                    value={searchNationalId}
                    onChange={(e) => setSearchNationalId(e.target.value)}
                    disabled={isLoadingSearch}
                  />
                  <Button onClick={handleSearchPatient} disabled={isLoadingSearch || !searchNationalId.trim()}>
                    <Search className="mr-2 h-4 w-4" /> {isLoadingSearch ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {patientNotFound && (
                <Alert variant="default" className="border-orange-500 text-orange-700 dark:border-orange-400 dark:text-orange-300">
                   <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <AlertTitle>Patient Not Found</AlertTitle>
                  <AlertDescription>
                    No patient found with National ID: {searchNationalId}.
                    <Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 dark:text-orange-300">
                      <Link href="/patient-registration">Register New Patient</Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {searchedPatient && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-xl">{searchedPatient.fullName}</CardTitle>
                    <CardDescription>
                      National ID: {searchedPatient.nationalId} | DOB: {new Date(searchedPatient.dob).toLocaleDateString()} | Gender: {searchedPatient.gender}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="department">Department / Section <span className="text-destructive">*</span></Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Outpatient">Outpatient</SelectItem>
                          <SelectItem value="Consultation Room 1">Consultation Room 1</SelectItem>
                          <SelectItem value="Consultation Room 2">Consultation Room 2</SelectItem>
                          <SelectItem value="Laboratory">Laboratory</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Diagnostics">Diagnostics (Lab/Imaging)</SelectItem>
                          <SelectItem value="Scheduled Appointment">Scheduled Appointment</SelectItem>
                          <SelectItem value="Specialized Dentist">Specialized Dentist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reasonForVisit">Reason for Visit / Notes <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="reasonForVisit"
                        placeholder="e.g., Follow-up, New complaint: fever and cough, Scheduled lab tests, Waiting for Doctor, Awaiting Results"
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignedDoctor">Assigned Doctor (if applicable)</Label>
                      <Input
                        id="assignedDoctor"
                        placeholder="e.g., Dr. Smith"
                        value={assignedDoctor}
                        onChange={(e) => setAssignedDoctor(e.target.value)}
                      />
                    </div>
                  </CardContent>
                   <CardFooter>
                    <Button onClick={handleAddToWaitingList} className="w-full" disabled={!department || !reasonForVisit}>
                      <UserPlus className="mr-2 h-4 w-4" /> Add to Waiting List & Finalize Visit
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Current Waiting List Section - Mirrored from Patient Registration */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-primary" />
                Today's Waiting List
              </CardTitle>
              <CardDescription className="text-xs">
                {currentDate} at {hospitalName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {waitingList.length > 0 ? (
                <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {waitingList.map((patient) => (
                    <li key={patient.id} className="p-3 border rounded-md shadow-sm bg-background hover:bg-muted/50 flex items-start gap-3">
                      <Image
                          src={patient.photoUrl}
                          alt={patient.patientName}
                          width={40}
                          height={40}
                          className="rounded-full mt-1"
                          data-ai-hint="patient avatar"
                      />
                      <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold">{patient.patientName}</p>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full whitespace-nowrap">{patient.timeAdded}</span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                          Location: {patient.location}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                          <Activity className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                          Status: {patient.status}
                          </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-2" />
                  <p>No patients currently in the waiting list.</p>
                </div>
              )}
               <Button variant="outline" className="w-full mt-6" onClick={() => toast({ title: "List Refreshed", description: "Waiting list updated (mock)." })}>Refresh List</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
