
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Users, BriefcaseMedical, Clock, Building } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock patient data structure
interface Patient {
  id: string;
  nationalId: string;
  fullName: string;
  dob: string;
  gender: string;
}

// Mock current waiting list data structure
interface WaitingListItem {
  id: string;
  patientName: string;
  department: string;
  reason: string;
  timeAdded: string;
}

export default function VisitingPatientsPage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [department, setDepartment] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");

  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([
    { id: "WL001", patientName: "Existing Patient A", department: "Cardiology", reason: "Chest Pains", timeAdded: "10:00 AM" },
    { id: "WL002", patientName: "Existing Patient B", department: "Outpatient", reason: "General Checkup", timeAdded: "10:15 AM" },
  ]);

  const handleSearchPatient = () => {
    if (!searchNationalId.trim()) {
      alert("Please enter a National ID to search.");
      return;
    }
    setIsLoadingSearch(true);
    setSearchedPatient(null);
    setPatientNotFound(false);

    // Simulate API call
    setTimeout(() => {
      if (searchNationalId === "123456789") { // Mock found patient
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
        alert("No patient selected.");
        return;
    }
    if (!department || !reasonForVisit) {
        alert("Please select department and provide reason for visit.");
        return;
    }
    const newWaitingListItem: WaitingListItem = {
        id: `WL${Math.random().toString(36).substr(2, 5)}`,
        patientName: searchedPatient.fullName,
        department: department,
        reason: reasonForVisit,
        timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWaitingList(prev => [newWaitingListItem, ...prev]);
    // Reset form fields
    setSearchedPatient(null);
    setSearchNationalId("");
    setDepartment("");
    setReasonForVisit("");
    setAssignedDoctor("");
    alert(`${newWaitingListItem.patientName} added to waiting list for ${department}.`);
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
            <CardContent className="space-y-6">
              {/* Search Section */}
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
                          <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Diagnostics">Diagnostics (Lab/Imaging)</SelectItem>
                          <SelectItem value="Scheduled Appointment">Scheduled Appointment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reasonForVisit">Reason for Visit / Notes <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="reasonForVisit"
                        placeholder="e.g., Follow-up, New complaint: fever and cough, Scheduled lab tests"
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

          {/* Current Waiting List Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Current Waiting List
              </CardTitle>
              <CardDescription>Patients waiting for service.</CardDescription>
            </CardHeader>
            <CardContent>
              {waitingList.length > 0 ? (
                <ul className="space-y-4 max-h-[600px] overflow-y-auto">
                  {waitingList.map((item) => (
                    <li key={item.id} className="p-3 border rounded-md shadow-sm bg-background hover:bg-muted/50">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold">{item.patientName}</p>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap">{item.timeAdded}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <BriefcaseMedical className="inline h-4 w-4 mr-1.5 text-muted-foreground" />
                        {item.department}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 truncate" title={item.reason}>
                        Reason: {item.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-2" />
                  <p>Waiting list is currently empty.</p>
                </div>
              )}
               <Button variant="outline" className="w-full mt-6" onClick={() => alert("Waiting list refreshed (mock).")}>Refresh List</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

    