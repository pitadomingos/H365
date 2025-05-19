
"use client";

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Users, Clock, Building, MapPin, Activity, BarChart3, CalendarIcon, Loader2, Cell } from "lucide-react"; // Added Cell
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, CartesianGrid } from "recharts"
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

const initialWaitingListData: WaitingListItem[] = [
    { id: "WL001", patientName: "Alice Wonderland", gender: "Female", timeAdded: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor", photoUrl: "https://placehold.co/40x40.png" },
    { id: "WL002", patientName: "Bob The Builder", gender: "Male", timeAdded: "10:45 AM", location: "Consultation Room 1", status: "Dispatched to Ward A", photoUrl: "https://placehold.co/40x40.png" },
];


const initialVisitChartData = [
  { department: "Outpatient", visits: 0, fill: "hsl(var(--chart-1))" },
  { department: "Lab", visits: 0, fill: "hsl(var(--chart-2))" },
  { department: "Pharmacy", visits: 0, fill: "hsl(var(--chart-3))" },
  { department: "Specialist", visits: 0, fill: "hsl(var(--chart-4))" },
  { department: "Emergency", visits: 0, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  visits: { label: "Visits" },
  outpatient: { label: "Outpatient", color: "hsl(var(--chart-1))" },
  lab: { label: "Laboratory", color: "hsl(var(--chart-2))" },
  pharmacy: { label: "Pharmacy", color: "hsl(var(--chart-3))" },
  specialist: { label: "Specialist", color: "hsl(var(--chart-4))" },
  emergency: { label: "Emergency", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export default function VisitingPatientsPage() {
  const [searchNationalId, setSearchNationalId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [department, setDepartment] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const [isAddingToWaitingList, setIsAddingToWaitingList] = useState(false);

  const [currentDate, setCurrentDate] = useState('');
  const hospitalName = "HealthFlow Central Hospital"; 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNationalId, setModalNationalId] = useState("");
  const [modalFullName, setModalFullName] = useState("");
  const [modalDob, setModalDob] = useState<Date | undefined>();
  const [modalGender, setModalGender] = useState<Patient["gender"] | "">("");
  const [isRegisteringInModal, setIsRegisteringInModal] = useState(false);

  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([]);
  const [isWaitingListLoading, setIsWaitingListLoading] = useState(true);

  const [visitChartData, setVisitChartData] = useState<typeof initialVisitChartData>(initialVisitChartData);
  const [analyticsStats, setAnalyticsStats] = useState({
    avgWaitTime: "0",
    totalProcessed: "0",
    peakHour: "N/A"
  });
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));

    const fetchWaitingListData = async () => {
      setIsWaitingListLoading(true);
      try {
        // const response = await fetch('/api/v1/visits/waiting-list');
        // if (!response.ok) throw new Error('Failed to fetch waiting list');
        // const data = await response.json();
        // setWaitingList(data);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        setWaitingList(initialWaitingListData);
      } catch (error) {
        console.error("Error fetching waiting list:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load waiting list." });
      } finally {
        setIsWaitingListLoading(false);
      }
    };

    const fetchAnalyticsData = async () => {
      setIsAnalyticsLoading(true);
      try {
        // const response = await fetch('/api/v1/visits/stats');
        // if (!response.ok) throw new Error('Failed to fetch visit stats');
        // const data = await response.json();
        // setVisitChartData(data.chartData);
        // setAnalyticsStats(data.summaryStats);
        await new Promise(resolve => setTimeout(resolve, 1200)); 
        const dynamicChartData = initialVisitChartData.map(d => ({...d, visits: Math.floor(Math.random()*50) + 5})); // Ensure some visits
        setVisitChartData(dynamicChartData);
        setAnalyticsStats({
            avgWaitTime: "25",
            totalProcessed: (initialWaitingListData.length + 15).toString(), // Example dynamic calculation
            peakHour: "11:00 AM"
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load visit analytics." });
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    fetchWaitingListData();
    fetchAnalyticsData();
  }, []);

  const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
    if (gender === "Male") return "male avatar";
    if (gender === "Female") return "female avatar";
    return "patient avatar";
  };

  const handleSearchPatient = async () => {
    if (!searchNationalId.trim()) {
      toast({ variant: "destructive", title: "Missing ID", description: "Please enter a National ID to search." });
      return;
    }
    setIsLoadingSearch(true);
    setSearchedPatient(null);
    setPatientNotFound(false);
    setDepartment("");
    setReasonForVisit("");
    setAssignedDoctor("");

    try {
      // const response = await fetch(`/api/v1/patients/search?nationalId=${searchNationalId.trim()}`);
      // if (response.status === 404) {
      //   setPatientNotFound(true);
      //   toast({ variant: "default", title: "Not Found", description: "Patient with this National ID not found. You can register them." });
      // } else if (!response.ok) {
      //   throw new Error(`API error: ${response.statusText}`);
      // } else {
      //   const data: Patient = await response.json();
      //   setSearchedPatient(data);
      //   setPatientNotFound(false);
      //   toast({ title: "Patient Found", description: `${data.fullName}'s details loaded.` });
      // }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      if (searchNationalId.trim() === "12345") {
         setSearchedPatient({ id: "P001", nationalId: "12345", fullName: "Demo Patient Searched", dob: "1990-01-01", gender: "Female" });
         setPatientNotFound(false);
         toast({ title: "Patient Found", description: `Demo Patient Searched's details loaded.` });
      } else {
        setPatientNotFound(true);
        toast({ variant: "default", title: "Not Found", description: "Patient with this National ID not found. You can register them." });
      }
    } catch (error: any) {
      console.error("Error searching patient:", error);
      toast({ variant: "destructive", title: "Search Error", description: error.message || "Could not search for patient. Is the backend running?" });
      setPatientNotFound(true); 
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleAddToWaitingList = async () => {
    if (!searchedPatient) {
        toast({ variant: "destructive", title: "No Patient", description: "No patient selected to add to the waiting list." });
        return;
    }
    if (!department || !reasonForVisit) {
        toast({ variant: "destructive", title: "Missing Details", description: "Please select department and provide reason for visit." });
        return;
    }
    setIsAddingToWaitingList(true);

    const payload = {
      patientId: searchedPatient.id,
      department: department,
      reasonForVisit: reasonForVisit,
      assignedDoctor: assignedDoctor || null,
      visitDate: new Date().toISOString()
    };

    try {
      // const response = await fetch('/api/v1/visits', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({ error: "Failed to add to waiting list. API error."}));
      //   throw new Error(errorData.error || `API error: ${response.statusText}`);
      // }
      
      // const newVisit = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newWaitingListItem: WaitingListItem = {
          id: `WL${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, 
          patientName: searchedPatient.fullName,
          photoUrl: `https://placehold.co/40x40.png`,
          gender: searchedPatient.gender,
          location: department,
          status: reasonForVisit,
          timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setWaitingList(prev => [newWaitingListItem, ...prev]);

      toast({ title: "Patient Added to Visit List", description: `${newWaitingListItem.patientName} recorded for ${department}.`});

      setSearchedPatient(null);
      setSearchNationalId("");
      setDepartment("");
      setReasonForVisit("");
      setAssignedDoctor("");
      setPatientNotFound(false);
    } catch (error: any) {
        console.error("Error adding to waiting list:", error);
        toast({ variant: "destructive", title: "Submission Error", description: error.message || "Could not add patient to waiting list." });
    } finally {
        setIsAddingToWaitingList(false);
    }
  };

  const handleModalRegister = async () => {
    if (!modalNationalId || !modalFullName || !modalDob || !modalGender) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all fields in the modal." });
      return;
    }
    setIsRegisteringInModal(true);

    const payload = {
      nationalId: modalNationalId,
      fullName: modalFullName,
      dateOfBirth: format(modalDob, "yyyy-MM-dd"),
      gender: modalGender,
    };

    try {
      // const response = await fetch('/api/v1/patients', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({ error: "Registration failed. API error."}));
      //   throw new Error(errorData.error || `API error: ${response.statusText}`);
      // }
      
      // const newPatient = await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Patient Registered (Mock)",
        description: `${payload.fullName} has been registered. You can now search for them using ID: ${payload.nationalId}.`,
      });
      setSearchNationalId(payload.nationalId); 
      setIsModalOpen(false);
      setPatientNotFound(false);

      setModalNationalId("");
      setModalFullName("");
      setModalDob(undefined);
      setModalGender("");
    } catch (error: any) {
      console.error("Error registering patient in modal:", error);
      toast({ variant: "destructive", title: "Registration Error", description: error.message || "Could not register patient." });
    } finally {
      setIsRegisteringInModal(false);
    }
  };

  return (
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
                    placeholder="Enter National ID (e.g., 12345 for demo)"
                    value={searchNationalId}
                    onChange={(e) => setSearchNationalId(e.target.value)}
                    disabled={isLoadingSearch}
                  />
                  <Button onClick={handleSearchPatient} disabled={isLoadingSearch || !searchNationalId.trim()}>
                    {isLoadingSearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {isLoadingSearch ? "Searching..." : "Search"}
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
                            <Button type="button" variant="outline" disabled={isRegisteringInModal}>Cancel</Button>
                           </DialogClose>
                          <Button onClick={handleModalRegister} disabled={isRegisteringInModal || !modalNationalId || !modalFullName || !modalDob || !modalGender}>
                            {isRegisteringInModal ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {isRegisteringInModal ? "Registering..." : "Register Patient"}
                            </Button>
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
                      National ID: {searchedPatient.nationalId} | DOB: {new Date(searchedPatient.dob+"T00:00:00").toLocaleDateString()} | Gender: {searchedPatient.gender}
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
                    <Button onClick={handleAddToWaitingList} className="w-full" disabled={!department || !reasonForVisit || isAddingToWaitingList}>
                      {isAddingToWaitingList ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      {isAddingToWaitingList ? "Adding..." : "Add to Waiting List & Finalize Visit"}
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
              {isWaitingListLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading waiting list...</p>
                </div>
                ) : waitingList.length > 0 ? (
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
               <Button variant="outline" className="w-full mt-4 text-sm" onClick={async () => {
                    setIsWaitingListLoading(true); 
                    try {
                        // const response = await fetch('/api/v1/visits/waiting-list');
                        // if (!response.ok) throw new Error('Failed to refresh waiting list');
                        // const data = await response.json();
                        // setWaitingList(data);
                        await new Promise(resolve => setTimeout(resolve, 700)); 
                        const mockData: WaitingListItem[] = [ 
                          { id: "WLREF001", patientName: "Refreshed Alice", gender: "Female", timeAdded: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), location: "Outpatient", status: "Waiting", photoUrl: "https://placehold.co/40x40.png" },
                          { id: "WLREF002", patientName: "Refreshed Bob", gender: "Male", timeAdded: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), location: "Lab", status: "Awaiting Results", photoUrl: "https://placehold.co/40x40.png" },
                        ];
                        setWaitingList(mockData);
                        toast({title: "List Refreshed (Mock)"});
                    } catch (error) {
                        toast({variant: "destructive", title: "Error", description: "Could not refresh waiting list."});
                    } finally {
                        setIsWaitingListLoading(false);
                    }
                }} disabled={isWaitingListLoading}>
                {isWaitingListLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Refresh List
              </Button>
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
          {isAnalyticsLoading ? (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading analytics...</p>
            </div>
          ) : (
            <>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Average Wait Time</CardDescription>
                  <CardTitle className="text-3xl">{analyticsStats.avgWaitTime} <span className="text-lg font-normal">mins</span></CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">+2 mins from yesterday</p>
                </CardContent>
              </Card>
              <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Total Patients Processed</CardDescription>
                  <CardTitle className="text-3xl">{analyticsStats.totalProcessed}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">Target: 50 for today</p>
                </CardContent>
              </Card>
               <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>Peak Hour</CardDescription>
                  <CardTitle className="text-3xl">{analyticsStats.peakHour}</CardTitle>
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
                  <RechartsBarChart data={visitChartData} accessibilityLayer margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="department" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <RechartsTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" hideLabel />}
                    />
                    <Bar dataKey="visits" radius={4}>
                      {visitChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={_entry.fill || chartConfig[_entry.department?.toLowerCase().replace(/\s+/g, '') as keyof typeof chartConfig]?.color || '#8884d8'} />
                      ))}
                    </Bar>
                     <RechartsLegend
                        content={() => {
                          if (!visitChartData || visitChartData.length === 0) return null;
                          return (
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3">
                              {visitChartData.map((dataEntry, index) => {
                                const departmentName = dataEntry.department || "Unknown Department";
                                const departmentKey = departmentName.toLowerCase().replace(/\s+/g, '') as keyof typeof chartConfig;
                                const chartItem = chartConfig[departmentKey];
                                const label = chartItem?.label || departmentName;
                                const color = dataEntry.fill || chartItem?.color || '#8884d8'; 
                    
                                return (
                                  <div key={`legend-item-${index}`} className="flex items-center space-x-1">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-xs text-muted-foreground">{label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }}
                     />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            </>
          )}
          </CardContent>
        </Card>
      </div>
  );
}
