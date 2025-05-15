
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
import { Search, UserPlus, Users, Clock, Building, MapPin, Activity, BarChart3, CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


interface Patient {
  id: string;
  nationalId: string;
  fullName: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
}

interface WaitingListItem {
  id: string | number;
  patientName: string;
  photoUrl: string;
  timeAdded: string;
  location: string;
  status: string;
  gender?: "Male" | "Female" | "Other";
}

const visitChartData = [
  { department: "Outpatient", visits: 12, fill: "hsl(var(--chart-1))" },
  { department: "Lab", visits: 8, fill: "hsl(var(--chart-2))" },
  { department: "Pharmacy", visits: 5, fill: "hsl(var(--chart-3))" },
  { department: "Specialist", visits: 3, fill: "hsl(var(--chart-4))" },
  { department: "Emergency", visits: 2, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  visits: {
    label: "Visits",
  },
  outpatient: {
    label: "Outpatient",
    color: "hsl(var(--chart-1))",
  },
  lab: {
    label: "Laboratory",
    color: "hsl(var(--chart-2))",
  },
  pharmacy: {
    label: "Pharmacy",
    color: "hsl(var(--chart-3))",
  },
  specialist: {
    label: "Specialist",
    color: "hsl(var(--chart-4))",
  },
  emergency: {
    label: "Emergency",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;


export default function VisitingPatientsPage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [department, setDepartment] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");

  const [currentDate, setCurrentDate] = useState('');
  const hospitalName = "HealthFlow Central Hospital";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNationalId, setModalNationalId] = useState("");
  const [modalFullName, setModalFullName] = useState("");
  const [modalDob, setModalDob] = useState<Date | undefined>();
  const [modalGender, setModalGender] = useState<Patient["gender"] | "">("");


  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const initialWaitingList: WaitingListItem[] = [
    { id: "WL001", patientName: "Alice Wonderland", gender: "Female", timeAdded: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL002", patientName: "Bob The Builder", gender: "Male", timeAdded: "10:45 AM", location: "Consultation Room 1", status: "Dispatched to Ward A", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL003", patientName: "Charlie Brown", gender: "Male", timeAdded: "11:00 AM", location: "Laboratory", status: "Awaiting Results", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL004", patientName: "Diana Prince", gender: "Female", timeAdded: "11:15 AM", location: "Pharmacy", status: "Collecting Medication", photoUrl: "https://placehold.co/40x40.png" },
  ];
  const [waitingList, setWaitingList] = useState<WaitingListItem[]>(initialWaitingList);

  const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
    if (gender === "Male") return "male avatar";
    if (gender === "Female") return "female avatar";
    return "patient avatar";
  };

  const handleSearchPatient = () => {
    if (!searchNationalId.trim()) {
      toast({ variant: "destructive", title: "Missing ID", description: "Please enter a National ID to search." });
      return;
    }
    setIsLoadingSearch(true);
    setSearchedPatient(null);
    setPatientNotFound(false);
    // Clear previous visit details
    setDepartment("");
    setReasonForVisit("");
    setAssignedDoctor("");

    setTimeout(() => {
      if (searchNationalId === "123456789") {
        setSearchedPatient({
          id: "P001",
          nationalId: "123456789",
          fullName: "Demo Patient One",
          dob: "1990-01-01",
          gender: "Male",
        });
      } else if (searchNationalId === "987654321") {
         setSearchedPatient({
          id: "P002",
          nationalId: "987654321",
          fullName: "Jane Sample Doe",
          dob: "1985-05-15",
          gender: "Female",
        });
      }
      else {
        setPatientNotFound(true);
      }
      setIsLoadingSearch(false);
    }, 1000);
  };

  const handleAddToWaitingList = () => {
    if (!searchedPatient) {
        toast({ variant: "destructive", title: "No Patient", description: "No patient selected to add to the waiting list." });
        return;
    }
    if (!department || !reasonForVisit) {
        toast({ variant: "destructive", title: "Missing Details", description: "Please select department and provide reason for visit." });
        return;
    }
    const newWaitingListItem: WaitingListItem = {
        id: `WL${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // More unique ID
        patientName: searchedPatient.fullName,
        photoUrl: `https://placehold.co/40x40.png`, // Generic placeholder
        gender: searchedPatient.gender, // Store gender for avatar hint
        location: department,
        status: reasonForVisit, // Using reasonForVisit as status as per previous structure
        timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setWaitingList(prev => [newWaitingListItem, ...prev]);

    toast({ title: "Patient Added to Visit List", description: `${newWaitingListItem.patientName} recorded for ${department}. They are now in the waiting list.`});

    // Clear fields after adding
    setSearchedPatient(null);
    setSearchNationalId("");
    setDepartment("");
    setReasonForVisit("");
    setAssignedDoctor("");
    setPatientNotFound(false);
  };

  const handleModalRegister = () => {
    if (!modalNationalId || !modalFullName || !modalDob || !modalGender) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all fields in the modal." });
      return;
    }
    // Mock registration
    toast({
      title: "Patient Registered (Mock)",
      description: `${modalFullName} has been registered. You can now search for them using ID: ${modalNationalId}.`,
    });
    setSearchNationalId(modalNationalId); // Pre-fill search bar
    setIsModalOpen(false);
    setPatientNotFound(false); // Patient is "found" after registration for immediate search

    // Clear modal form
    setModalNationalId("");
    setModalFullName("");
    setModalDob(undefined);
    setModalGender("");
  };


  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" /> Visiting Patients: Consultation Intake
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Patient Visit Entry</CardTitle>
              <CardDescription>
                Search for an existing patient or perform a quick registration to record their visit and add them to the waiting list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div>
                <Label htmlFor="searchNationalId">Search Patient by National ID</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="searchNationalId"
                    placeholder="Enter National ID (e.g., 123456789 or 987654321 for demo)"
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
                  <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      No patient found with National ID: {searchNationalId}.
                    </span>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 sm:mt-0 sm:ml-4 border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-900/50">
                          <UserPlus className="mr-2 h-4 w-4" /> Register New Patient
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                          <DialogTitle>Quick Patient Registration</DialogTitle>
                          <DialogDescription>
                            Register a new patient. Full details can be added later via the main Patient Registration page.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalNationalId" className="text-right">National ID <span className="text-destructive">*</span></Label>
                            <Input id="modalNationalId" value={modalNationalId} onChange={(e) => setModalNationalId(e.target.value)} className="col-span-3" placeholder="Patient's National ID" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalFullName" className="text-right">Full Name <span className="text-destructive">*</span></Label>
                            <Input id="modalFullName" value={modalFullName} onChange={(e) => setModalFullName(e.target.value)} className="col-span-3" placeholder="e.g., John Doe" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalDob" className="text-right">Date of Birth <span className="text-destructive">*</span></Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "col-span-3 justify-start text-left font-normal",
                                    !modalDob && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {modalDob ? format(modalDob, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={modalDob} onSelect={setModalDob} initialFocus captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalGender" className="text-right">Gender <span className="text-destructive">*</span></Label>
                            <Select value={modalGender} onValueChange={(value) => setModalGender(value as Patient["gender"])}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                           <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                           </DialogClose>
                          <Button onClick={handleModalRegister}>Register Patient</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                      <Label htmlFor="department">Department / Section for Visit <span className="text-destructive">*</span></Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department/section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Outpatient General Consultation">Outpatient General Consultation</SelectItem>
                          <SelectItem value="Laboratory (Scheduled Tests)">Laboratory (Scheduled Tests)</SelectItem>
                          <SelectItem value="Imaging (Scheduled Scan)">Imaging (Scheduled Scan)</SelectItem>
                          <SelectItem value="Pharmacy (Prescription Refill)">Pharmacy (Prescription Refill)</SelectItem>
                          <SelectItem value="Specialist Consultation">Specialist Consultation</SelectItem>
                          <SelectItem value="Emergency Triage">Emergency Triage</SelectItem>
                          <SelectItem value="Maternity Check-up">Maternity Check-up</SelectItem>
                          <SelectItem value="Dental Clinic">Dental Clinic</SelectItem>
                           <SelectItem value="Other Appointment">Other Appointment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reasonForVisit">Reason for Visit / Chief Complaint <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="reasonForVisit"
                        placeholder="e.g., Follow-up, New complaint: fever and cough, Scheduled lab tests, Annual check-up"
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignedDoctor">Assigned Doctor / Service (if pre-assigned)</Label>
                      <Input
                        id="assignedDoctor"
                        placeholder="e.g., Dr. Smith, Antenatal Clinic"
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

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-primary" />
                Today's Waiting List - {currentDate} at {hospitalName}
              </CardTitle>
              <CardDescription className="text-xs">
                 Patients processed for consultation or service today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {waitingList.length > 0 ? (
                <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {waitingList.map((patient) => (
                    <li key={patient.id} className="p-3 border rounded-md shadow-sm bg-background hover:bg-muted/50 flex items-start gap-3">
                      <Image
                          src={patient.photoUrl}
                          alt={patient.patientName}
                          width={40}
                          height={40}
                          className="rounded-full mt-1"
                          data-ai-hint={getAvatarHint(patient.gender)}
                      />
                      <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm">{patient.patientName}</p>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full whitespace-nowrap">{patient.timeAdded}</span>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1.5 shrink-0" />
                          To: {patient.location}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <Activity className="h-3 w-3 mr-1.5 shrink-0" />
                          Reason: {patient.status}
                          </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-10 w-10 mb-2" />
                  <p className="text-sm">No patients currently in the waiting list.</p>
                </div>
              )}
               <Button variant="outline" className="w-full mt-4 text-sm" onClick={() => toast({ title: "List Refreshed", description: "Waiting list updated (mock)." })}>Refresh List</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Hospital Visit Analytics (Today)
            </CardTitle>
            <CardDescription>Overview of today's patient flow and departmental visits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Average Wait Time</CardDescription>
                  <CardTitle className="text-3xl">25 <span className="text-lg font-normal">mins</span></CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">+2 mins from yesterday</p>
                </CardContent>
              </Card>
              <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Total Patients Processed</CardDescription>
                  <CardTitle className="text-3xl">{waitingList.length + 15}</CardTitle> {/* Mock data + current list */}
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">Target: 50 for today</p>
                </CardContent>
              </Card>
               <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Peak Hour</CardDescription>
                  <CardTitle className="text-3xl">11:00 AM</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">Most patient check-ins</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">Visits by Department</h3>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitChartData} accessibilityLayer margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="department" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <RechartsTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" hideLabel />}
                    />
                    <Bar dataKey="visits" radius={4} />
                     <RechartsLegend content={({ payload }) => {
                        return (
                        <div className="flex items-center justify-center gap-3 mt-3">
                            {payload?.map((entry: any) => (
                            <div key={`item-${entry.value}`} className="flex items-center space-x-1">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs text-muted-foreground">{entry.payload.label}</span>
                            </div>
                            ))}
                        </div>
                        )
                    }} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

