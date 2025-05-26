
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Users, Clock, Building, MapPin, Activity, BarChart3, CalendarIcon, Loader2, Cell } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocale } from '@/context/locale-context';
import { getTranslator, defaultLocale } from '@/lib/i18n';

interface Patient {
  id: string;
  nationalId: string;
  fullName: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  chronicConditions?: string;
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

const initialMockWaitingListData: WaitingListItem[] = [
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

export default function VisitingPatientsPage() {
  const { currentLocale } = useLocale();
  const t = getTranslator(currentLocale);

  const chartConfig = {
    visits: { label: t('visitingPatients.analytics.visitsByDept.visitsLabel') },
    outpatient: { label: t('visitingPatients.visitDetails.department.outpatient'), color: "hsl(var(--chart-1))" },
    lab: { label: t('visitingPatients.visitDetails.department.lab'), color: "hsl(var(--chart-2))" },
    pharmacy: { label: t('visitingPatients.visitDetails.department.pharmacy'), color: "hsl(var(--chart-3))" },
    specialist: { label: t('visitingPatients.visitDetails.department.specialist'), color: "hsl(var(--chart-4))" },
    emergency: { label: t('visitingPatients.visitDetails.department.emergency'), color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;
  
  const [searchNationalId, setSearchNationalId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [department, setDepartment] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const [isAddingToWaitingList, setIsAddingToWaitingList] = useState(false);

  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const hospitalName = "HealthFlow Central Hospital"; 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNationalId, setModalNationalId] = useState("");
  const [modalFullName, setModalFullName] = useState("");
  const [modalDob, setModalDob] = useState<Date | undefined>();
  const [modalGender, setModalGender] = useState<Patient["gender"] | "">("");
  const [modalChronicConditions, setModalChronicConditions] = useState("");
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
    setCurrentDate(new Date().toLocaleDateString(currentLocale === 'pt' ? 'pt-BR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

    const fetchInitialData = async () => {
      setIsWaitingListLoading(true);
      setIsAnalyticsLoading(true);
      try {
        // Fetching waiting list
        const wlResponse = await fetch('/api/v1/visits/waiting-list'); // Mock
        if (!wlResponse.ok) {
            if(wlResponse.status === 404) { setWaitingList([]); } 
            else { 
                console.warn("Mock API /api/v1/visits/waiting-list not found, using fallback.");
                setWaitingList(initialMockWaitingListData);
            }
        } else {
            const wlData = await wlResponse.json();
            setWaitingList(wlData);
        }

        // Fetching analytics
        const statsResponse = await fetch('/api/v1/visits/stats'); // Mock
        if (!statsResponse.ok) {
            if(statsResponse.status === 404) {
                console.warn("Mock API /api/v1/visits/stats not found, using fallback.");
                const defaultChartData = [
                    { department: t('visitingPatients.visitDetails.department.outpatient'), visits: Math.floor(Math.random()*10) + 1, fill: "hsl(var(--chart-1))" },
                    { department: t('visitingPatients.visitDetails.department.lab'), visits: Math.floor(Math.random()*5) + 1, fill: "hsl(var(--chart-2))" },
                    { department: t('visitingPatients.visitDetails.department.pharmacy'), visits: Math.floor(Math.random()*7) + 1, fill: "hsl(var(--chart-3))" },
                ];
                setVisitChartData(defaultChartData);
                setAnalyticsStats({ avgWaitTime: "15", totalProcessed: "5", peakHour: "10:00 AM"});
            } else throw new Error('Failed to fetch visit stats');
        } else {
            const statsData = await statsResponse.json();
            setVisitChartData(statsData.chartData || initialVisitChartData.map(d => ({...d, visits: Math.floor(Math.random()*10) + 1 })));
            setAnalyticsStats(statsData.summaryStats || { avgWaitTime: "15", totalProcessed: "5", peakHour: "10:00 AM"});
        }

      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({ variant: "destructive", title: t('visitingPatients.toast.loadError'), description: t('visitingPatients.toast.loadError.desc') });
        setWaitingList(initialMockWaitingListData);
        const fallbackChartData = [
            { department: t('visitingPatients.visitDetails.department.outpatient'), visits: Math.floor(Math.random()*50) + 5, fill: "hsl(var(--chart-1))" },
            { department: t('visitingPatients.visitDetails.department.lab'), visits: Math.floor(Math.random()*20) + 2, fill: "hsl(var(--chart-2))" },
        ];
        setVisitChartData(fallbackChartData);
        const totalProcessedFromInitialList = initialMockWaitingListData.length;
        setAnalyticsStats({ avgWaitTime: "25", totalProcessed: (totalProcessedFromInitialList + 15).toString(), peakHour: "11:00 AM"});
      } finally {
        setIsWaitingListLoading(false);
        setIsAnalyticsLoading(false);
      }
    };
    fetchInitialData();
  }, [t, currentLocale]);

  const getAvatarHint = (gender?: "Male" | "Female" | "Other") : string => {
    if (gender === "Male") return "male avatar";
    if (gender === "Female") return "female avatar";
    return "patient avatar";
  };

  const handleSearchPatient = async () => {
    if (!searchNationalId.trim()) {
      toast({ variant: "destructive", title: t('visitingPatients.toast.missingId'), description: t('visitingPatients.toast.missingId.desc') });
      return;
    }
    setIsLoadingSearch(true);
    setSearchedPatient(null);
    setPatientNotFound(false);
    setDepartment("");
    setReasonForVisit("");
    setAssignedDoctor("");

    try {
      const response = await fetch(`/api/v1/patients/search?nationalId=${searchNationalId.trim()}`);
      if (!response.ok) {
        if (response.status === 404) {
          setPatientNotFound(true);
          setSearchedPatient(null);
          toast({ variant: "default", title: t('visitingPatients.toast.notFound'), description: t('visitingPatients.toast.notFound.desc', {searchNationalId: searchNationalId.trim()}) });
        } else {
           // Fallback for demo if API not there
          if (searchNationalId.trim() === "12345") { // Example found ID
            setSearchedPatient({ id: "P001", nationalId: "12345", fullName: "Demo Found Patient", dob: "1980-01-01", gender: "Male", chronicConditions: "Hypertension" });
            setPatientNotFound(false);
            toast({ title: t('visitingPatients.toast.patientFound'), description: t('visitingPatients.toast.patientFound.desc', {fullName: "Demo Found Patient"}) });
          } else {
            setPatientNotFound(true);
            setSearchedPatient(null);
            toast({ variant: "default", title: t('visitingPatients.toast.notFound'), description: t('visitingPatients.toast.notFound.desc', {searchNationalId: searchNationalId.trim()}) });
          }
        }
      } else {
        const data: Patient = await response.json();
        setSearchedPatient(data);
        setPatientNotFound(false);
        toast({ title: t('visitingPatients.toast.patientFound'), description: t('visitingPatients.toast.patientFound.desc', {fullName: data.fullName}) });
      }
    } catch (error: any) {
      console.error("Error searching patient:", error);
      toast({ variant: "destructive", title: t('visitingPatients.toast.searchError'), description: error.message || t('visitingPatients.toast.searchError.desc') });
       // Fallback for demo if API call fails generally
        if (searchNationalId.trim() === "12345") {
            setSearchedPatient({ id: "P001", nationalId: "12345", fullName: "Demo Found Patient", dob: "1980-01-01", gender: "Male", chronicConditions: "Hypertension" });
            setPatientNotFound(false);
             toast({ title: t('visitingPatients.toast.patientFound'), description: t('visitingPatients.toast.patientFound.desc', {fullName: "Demo Found Patient"}) });
        } else {
            setPatientNotFound(true);
        }
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleAddToWaitingList = async () => {
    if (!searchedPatient) {
        toast({ variant: "destructive", title: t('visitingPatients.toast.noPatientSelected'), description: t('visitingPatients.toast.noPatientSelected.desc') });
        return;
    }
    if (!department || !reasonForVisit) {
        toast({ variant: "destructive", title: t('visitingPatients.toast.missingVisitDetails'), description: t('visitingPatients.toast.missingVisitDetails.desc') });
        return;
    }
    setIsAddingToWaitingList(true);

    const payload = {
      patientId: searchedPatient.id,
      department: department,
      reasonForVisit: reasonForVisit,
      assignedDoctor: assignedDoctor || undefined,
      visitDate: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/v1/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to add to waiting list. API error."}));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }
      const newVisitData = await response.json(); 

      const newWaitingListItem: WaitingListItem = {
          id: newVisitData.id || `WL${Date.now()}`, 
          patientName: searchedPatient.fullName,
          photoUrl: `https://placehold.co/40x40.png`, 
          gender: searchedPatient.gender,
          location: department,
          status: reasonForVisit, 
          timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setWaitingList(prev => [newWaitingListItem, ...prev]);

      toast({ title: t('visitingPatients.toast.addedToVisitList'), description: t('visitingPatients.toast.addedToVisitList.desc', {patientName: newWaitingListItem.patientName, department: department})});

      setSearchedPatient(null);
      setSearchNationalId("");
      setDepartment("");
      setReasonForVisit("");
      setAssignedDoctor("");
      setPatientNotFound(false);
    } catch (error: any) {
        console.error("Error adding to waiting list:", error);
        toast({ variant: "destructive", title: t('visitingPatients.toast.submissionError'), description: error.message || t('visitingPatients.toast.addToListError') });
    } finally {
        setIsAddingToWaitingList(false);
    }
  };

  const handleModalRegister = async () => {
    if (!modalNationalId || !modalFullName || !modalDob || !modalGender) {
      toast({ variant: "destructive", title: t('visitingPatients.toast.missingFields'), description: t('visitingPatients.toast.missingFields.desc') });
      return;
    }
    setIsRegisteringInModal(true);

    const payload = {
      nationalId: modalNationalId,
      fullName: modalFullName,
      dateOfBirth: format(modalDob, "yyyy-MM-dd"),
      gender: modalGender,
      chronicConditions: modalChronicConditions,
    };

    try {
      const response = await fetch('/api/v1/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Registration failed. API error."}));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }
      // const registeredPatient = await response.json(); 

      toast({
        title: t('visitingPatients.toast.patientRegistered'),
        description: t('visitingPatients.toast.patientRegistered.desc', {fullName: payload.fullName, nationalId: payload.nationalId}),
      });
      setSearchNationalId(payload.nationalId);
      setIsModalOpen(false);
      setPatientNotFound(false);

      setModalNationalId("");
      setModalFullName("");
      setModalDob(undefined);
      setModalGender("");
      setModalChronicConditions("");
    } catch (error: any) {
      console.error("Error registering patient in modal:", error);
      toast({ variant: "destructive", title: t('visitingPatients.toast.regError'), description: error.message || t('visitingPatients.toast.regError.desc') });
    } finally {
      setIsRegisteringInModal(false);
    }
  };

  return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" /> {t('visitingPatients.pageTitle')}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>{t('visitingPatients.patientVisitEntry.title')}</CardTitle>
              <CardDescription>
                {t('visitingPatients.patientVisitEntry.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div>
                <Label htmlFor="searchNationalId">{t('visitingPatients.searchPatient.label')}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="searchNationalId"
                    placeholder={t('visitingPatients.searchPatient.placeholder')}
                    value={searchNationalId}
                    onChange={(e) => setSearchNationalId(e.target.value)}
                    disabled={isLoadingSearch}
                  />
                  <Button onClick={handleSearchPatient} disabled={isLoadingSearch || !searchNationalId.trim()}>
                    {isLoadingSearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    {isLoadingSearch ? t('visitingPatients.searchPatient.button.loading') : t('visitingPatients.searchPatient.button')}
                  </Button>
                </div>
              </div>

              {patientNotFound && (
                <Alert variant="default" className="border-orange-500 text-orange-700 dark:border-orange-400 dark:text-orange-300">
                   <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <AlertTitle>{t('visitingPatients.patientNotFound.title')}</AlertTitle>
                  <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {t('visitingPatients.patientNotFound.description', {searchNationalId: searchNationalId})}
                    </span>
                    <Dialog open={isModalOpen} onOpenChange={(open) => { if(!open) { setModalNationalId(""); setModalFullName(""); setModalDob(undefined); setModalGender(""); setModalChronicConditions("");} setIsModalOpen(open); }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 sm:mt-0 sm:ml-4 border-orange-500 text-orange-700 hover:bg-orange-50 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-900/50">
                          <UserPlus className="mr-2 h-4 w-4" /> {t('visitingPatients.patientNotFound.registerButton')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                          <DialogTitle>{t('visitingPatients.quickRegModal.title')}</DialogTitle>
                          <DialogDescription>
                            {t('visitingPatients.quickRegModal.description')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalNationalId" className="text-right">{t('visitingPatients.quickRegModal.nationalId.label')} <span className="text-destructive">*</span></Label>
                            <Input id="modalNationalId" value={modalNationalId} onChange={(e) => setModalNationalId(e.target.value)} className="col-span-3" placeholder={t('visitingPatients.quickRegModal.nationalId.placeholder')} />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalFullName" className="text-right">{t('visitingPatients.quickRegModal.fullName.label')} <span className="text-destructive">*</span></Label>
                            <Input id="modalFullName" value={modalFullName} onChange={(e) => setModalFullName(e.target.value)} className="col-span-3" placeholder={t('visitingPatients.quickRegModal.fullName.placeholder')} />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalDob" className="text-right">{t('visitingPatients.quickRegModal.dob.label')} <span className="text-destructive">*</span></Label>
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
                                  {modalDob ? format(modalDob, "PPP") : <span>{t('visitingPatients.quickRegModal.dob.placeholder')}</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar locale={currentLocale === 'pt' ? require('date-fns/locale/pt-BR') : undefined} mode="single" selected={modalDob} onSelect={setModalDob} initialFocus captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="modalGender" className="text-right">{t('visitingPatients.quickRegModal.gender.label')} <span className="text-destructive">*</span></Label>
                            <Select value={modalGender} onValueChange={(value) => setModalGender(value as Patient["gender"])}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={t('visitingPatients.quickRegModal.gender.placeholder')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">{t('patientRegistration.gender.male')}</SelectItem>
                                <SelectItem value="Female">{t('patientRegistration.gender.female')}</SelectItem>
                                <SelectItem value="Other">{t('patientRegistration.gender.other')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                           <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="modalChronicConditions" className="text-right pt-2">{t('visitingPatients.quickRegModal.chronicConditions.label')}</Label>
                            <Textarea id="modalChronicConditions" value={modalChronicConditions} onChange={(e) => setModalChronicConditions(e.target.value)} className="col-span-3" placeholder={t('visitingPatients.quickRegModal.chronicConditions.placeholder')} rows={2}/>
                          </div>
                        </div>
                        <DialogFooter>
                           <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isRegisteringInModal}>{t('visitingPatients.quickRegModal.cancelButton')}</Button>
                           </DialogClose>
                          <Button onClick={handleModalRegister} disabled={isRegisteringInModal || !modalNationalId || !modalFullName || !modalDob || !modalGender}>
                            {isRegisteringInModal ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {isRegisteringInModal ? t('visitingPatients.quickRegModal.registerButton.loading') : t('visitingPatients.quickRegModal.registerButton')}
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
                      {t('visitingPatients.patientCard.nationalId')} {searchedPatient.nationalId} | {t('visitingPatients.patientCard.dob')} {new Date(searchedPatient.dob+"T00:00:00").toLocaleDateString()} | {t('visitingPatients.patientCard.gender')} {t(`patientRegistration.gender.${searchedPatient.gender.toLowerCase()}` as any)}
                      <br/>{t('visitingPatients.patientCard.chronicConditions')} {searchedPatient.chronicConditions || t('visitingPatients.patientCard.noneReported')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="department">{t('visitingPatients.visitDetails.department.label')} <span className="text-destructive">*</span></Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger id="department">
                          <SelectValue placeholder={t('visitingPatients.visitDetails.department.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Outpatient General Consultation">{t('visitingPatients.visitDetails.department.outpatient')}</SelectItem>
                          <SelectItem value="Laboratory (Scheduled Tests)">{t('visitingPatients.visitDetails.department.lab')}</SelectItem>
                          <SelectItem value="Imaging (Scheduled Scan)">{t('visitingPatients.visitDetails.department.imaging')}</SelectItem>
                          <SelectItem value="Pharmacy (Prescription Refill)">{t('visitingPatients.visitDetails.department.pharmacy')}</SelectItem>
                          <SelectItem value="Specialist Consultation">{t('visitingPatients.visitDetails.department.specialist')}</SelectItem>
                          <SelectItem value="Emergency Triage">{t('visitingPatients.visitDetails.department.emergency')}</SelectItem>
                          <SelectItem value="Maternity Check-up">{t('visitingPatients.visitDetails.department.maternity')}</SelectItem>
                          <SelectItem value="Dental Clinic">{t('visitingPatients.visitDetails.department.dental')}</SelectItem>
                           <SelectItem value="Other Appointment">{t('visitingPatients.visitDetails.department.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reasonForVisit">{t('visitingPatients.visitDetails.reason.label')} <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="reasonForVisit"
                        placeholder={t('visitingPatients.visitDetails.reason.placeholder')}
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignedDoctor">{t('visitingPatients.visitDetails.assignedDoctor.label')}</Label>
                      <Input
                        id="assignedDoctor"
                        placeholder={t('visitingPatients.visitDetails.assignedDoctor.placeholder')}
                        value={assignedDoctor}
                        onChange={(e) => setAssignedDoctor(e.target.value)}
                      />
                    </div>
                  </CardContent>
                   <CardFooter>
                    <Button onClick={handleAddToWaitingList} className="w-full" disabled={!department || !reasonForVisit || isAddingToWaitingList}>
                      {isAddingToWaitingList ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                      {isAddingToWaitingList ? t('visitingPatients.addToListButton.loading') : t('visitingPatients.addToListButton')}
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
                 {currentDate === null ?
                    `${t('patientRegistration.waitingList.titleBasePart')} ${hospitalName}` :
                    t('visitingPatients.waitingList.title', {currentDate: currentDate, hospitalName: hospitalName})
                  }
              </CardTitle>
              <CardDescription className="text-xs">
                 {t('visitingPatients.waitingList.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isWaitingListLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">{t('visitingPatients.loadingWaitingList')}</p>
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
                          {t('visitingPatients.waitingList.to')} {patient.location}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <Activity className="h-3 w-3 mr-1.5 shrink-0" />
                          {t('visitingPatients.waitingList.reason')} {patient.status}
                          </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-10 w-10 mb-2" />
                  <p className="text-sm">{t('visitingPatients.waitingList.empty')}</p>
                </div>
              )}
               <Button variant="outline" className="w-full mt-4 text-sm" onClick={async () => {
                    setIsWaitingListLoading(true);
                    try {
                        const response = await fetch('/api/v1/visits/waiting-list');
                        if (!response.ok) {
                            if(response.status === 404) { setWaitingList([]); }
                            else { 
                                console.warn("Mock API /api/v1/visits/waiting-list not found during refresh, using fallback.");
                                setWaitingList(initialMockWaitingListData.map(item => ({...item, timeAdded: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})).sort(() => 0.5 - Math.random()));
                            }
                        } else {
                            const wlData = await response.json();
                            setWaitingList(wlData);
                        }
                        toast({title: t('patientRegistration.waitingList.refresh') + " (Mock Success)"});
                    } catch (error) {
                        console.error("Error refreshing waiting list:", error);
                        toast({variant: "destructive", title: t('visitingPatients.toast.loadError'), description: t('visitingPatients.toast.refreshError.desc')});
                        setWaitingList(initialMockWaitingListData.map(item => ({...item, timeAdded: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})).sort(() => 0.5 - Math.random())); 
                    } finally {
                        setIsWaitingListLoading(false);
                    }
                }} disabled={isWaitingListLoading}>
                {isWaitingListLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {t('visitingPatients.waitingList.refreshButton')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              {t('visitingPatients.analytics.title')}
            </CardTitle>
            <CardDescription>{t('visitingPatients.analytics.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          {isAnalyticsLoading ? (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">{t('visitingPatients.loadingAnalytics')}</p>
            </div>
          ) : (
            <>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>{t('visitingPatients.analytics.avgWaitTime.label')}</CardDescription>
                  <CardTitle className="text-3xl">{analyticsStats.avgWaitTime} <span className="text-lg font-normal">{t('visitingPatients.analytics.avgWaitTime.unit')}</span></CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">{t('visitingPatients.analytics.avgWaitTime.subtext')}</p>
                </CardContent>
              </Card>
              <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>{t('visitingPatients.analytics.totalProcessed.label')}</CardDescription>
                  <CardTitle className="text-3xl">{analyticsStats.totalProcessed}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">{t('visitingPatients.analytics.totalProcessed.subtext')}</p>
                </CardContent>
              </Card>
               <Card className="shadow-xs">
                <CardHeader className="pb-2">
                  <CardDescription>{t('visitingPatients.analytics.peakHour.label')}</CardDescription>
                  <CardTitle className="text-3xl">{analyticsStats.peakHour}</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-xs text-muted-foreground">{t('visitingPatients.analytics.peakHour.subtext')}</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">{t('visitingPatients.analytics.visitsByDept.title')}</h3>
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
                       {visitChartData.map((_entry, index) => {
                        const departmentKey = (_entry.department || "Unknown").toLowerCase().replace(/\s+/g, '') as keyof typeof chartConfig;
                        const chartItem = chartConfig[departmentKey];
                        const color = _entry.fill || chartItem?.color || '#8884d8';
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
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

    
