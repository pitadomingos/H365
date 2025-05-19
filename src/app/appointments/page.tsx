
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Bell, CalendarCheck2, PlusCircle, Video, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  type: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  date: string; 
}

interface NotificationItem {
  id: string | number;
  message: string;
  time: string;
  read: boolean;
}

interface Doctor {
    id: string;
    name: string;
}

const initialMockDoctors: Doctor[] = [
    { id: "dr-smith", name: "Dr. Smith" },
    { id: "dr-jones", name: "Dr. Jones" },
    { id: "dr-eve", name: "Dr. Eve" },
];

export default function AppointmentsPage() {
  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = React.useState(true);
  
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = React.useState(true);

  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = React.useState(true);

  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = React.useState(false);
  const [newPatientName, setNewPatientName] = React.useState("");
  const [newSelectedDoctorId, setNewSelectedDoctorId] = React.useState("");
  const [newAppointmentDate, setNewAppointmentDate] = React.useState("");
  const [newAppointmentTime, setNewAppointmentTime] = React.useState(""); // Format HH:MM
  const [newAppointmentType, setNewAppointmentType] = React.useState("Consultation");
  const [isScheduling, setIsScheduling] = React.useState(false);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoadingAppointments(true);
      try {
        // Simulate API call: GET /api/v1/appointments
        // const response = await fetch('/api/v1/appointments');
        // if (!response.ok) throw new Error('Failed to fetch appointments');
        // const data = await response.json();
        // setAppointments(data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const fetchedAppointments: Appointment[] = [
          { id: "APT001", patientName: "Alice Wonderland", doctorName: "Dr. Smith", date: "2024-08-15", time: "10:00 AM - 10:30 AM", type: "Consultation", status: "Confirmed" },
          { id: "APT002", patientName: "Bob The Builder", doctorName: "Dr. Jones", date: "2024-08-15", time: "11:00 AM - 11:45 AM", type: "Check-up", status: "Pending" },
          { id: "APT003", patientName: "Charlie Brown", doctorName: "Dr. Smith", date: "2024-08-16", time: "02:00 PM - 02:30 PM", type: "Follow-up", status: "Cancelled" },
          { id: "APT004", patientName: "Diana Prince", doctorName: "Dr. Eve", date: "2024-08-16", time: "03:00 PM - 03:15 PM", type: "Telemedicine", status: "Confirmed" },
          { id: "APT005", patientName: "Edward Hands", doctorName: "Dr. Jones", date: new Date().toISOString().split('T')[0], time: "09:00 AM - 09:30 AM", type: "Consultation", status: "Confirmed" },
        ];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load appointments."});
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    const fetchNotifications = async () => {
      setIsLoadingNotifications(true);
      try {
        // Simulate API call: GET /api/v1/notifications?context=appointments
        // const response = await fetch('/api/v1/notifications?context=appointments');
        // if (!response.ok) throw new Error('Failed to fetch notifications');
        // const data = await response.json();
        // setNotifications(data);
        await new Promise(resolve => setTimeout(resolve, 1200));
        const fetchedNotifications: NotificationItem[] = [
          { id: 1, message: "Appointment with Alice Wonderland confirmed for tomorrow at 10:00 AM.", time: "2 hours ago", read: false },
          { id: 2, message: "Lab results for Bob The Builder are ready.", time: "5 hours ago", read: true },
          { id: 3, message: "Reminder: Follow-up with Charlie Brown in 3 days.", time: "1 day ago", read: false },
        ];
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load notifications."});
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    const fetchDoctors = async () => {
        setIsLoadingDoctors(true);
        try {
            // Simulate API call: GET /api/v1/doctors
            // const response = await fetch('/api/v1/doctors');
            // if (!response.ok) throw new Error('Failed to fetch doctors');
            // const data = await response.json();
            // setDoctors(data);
            await new Promise(resolve => setTimeout(resolve, 500));
            setDoctors(initialMockDoctors);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not load doctors list." });
            setDoctors(initialMockDoctors); // Fallback to initial mock on error
        } finally {
            setIsLoadingDoctors(false);
        }
    };

    fetchAppointments();
    fetchNotifications();
    fetchDoctors();
  }, []);

  const handleScheduleNewAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newSelectedDoctorId || !newAppointmentDate || !newAppointmentTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields to schedule an appointment.",
      });
      return;
    }
    setIsScheduling(true);

    const payload = {
        patientName: newPatientName,
        doctorId: newSelectedDoctorId,
        date: newAppointmentDate,
        time: newAppointmentTime, // e.g., "10:00"
        type: newAppointmentType,
    };

    try {
        // Simulate API call: POST /api/v1/appointments
        // const response = await fetch('/api/v1/appointments', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payload),
        // });
        // if (!response.ok) {
        //     const errorData = await response.json().catch(() => ({ error: "Failed to schedule. API error."}));
        //     throw new Error(errorData.error || `API error: ${response.statusText}`);
        // }
        // const newApt = await response.json();

        await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
        const selectedDoctor = doctors.find(d => d.id === newSelectedDoctorId);
        const newApt: Appointment = {
          id: `APT${Math.floor(Math.random() * 10000)}`,
          patientName: newPatientName,
          doctorName: selectedDoctor?.name || "N/A",
          date: newAppointmentDate,
          // Backend would format time, here we mock it
          time: `${newAppointmentTime} - ${new Date(new Date(`1970-01-01T${newAppointmentTime}:00`).getTime() + 30*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          type: newAppointmentType,
          status: "Pending", 
        };

        setAppointments(prev => [newApt, ...prev].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
        toast({
          title: "Appointment Requested (Mock)",
          description: `Request for ${newPatientName} with ${newApt.doctorName} on ${newAppointmentDate} at ${newAppointmentTime} has been submitted.`,
        });

        setNewPatientName("");
        setNewSelectedDoctorId("");
        setNewAppointmentDate("");
        setNewAppointmentTime("");
        setNewAppointmentType("Consultation");
        setIsSchedulingDialogOpen(false);
    } catch (error: any) {
        console.error("Error scheduling appointment:", error);
        toast({ variant: "destructive", title: "Scheduling Error", description: error.message || "Could not schedule appointment." });
    } finally {
        setIsScheduling(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    selectedCalendarDate ? apt.date === selectedCalendarDate.toISOString().split('T')[0] : true
  );

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="h-8 w-8" /> Appointments
          </h1>
          <Dialog open={isSchedulingDialogOpen} onOpenChange={setIsSchedulingDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoadingDoctors}>
                <PlusCircle className="mr-2 h-4 w-4" /> Schedule New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleScheduleNewAppointment}>
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                  <DialogDescription>
                    Fill in the details to schedule a new appointment.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name <span className="text-destructive">*</span></Label>
                    <Input id="patientName" placeholder="Patient Full Name" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} required disabled={isScheduling}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Doctor <span className="text-destructive">*</span></Label>
                    <Select value={newSelectedDoctorId} onValueChange={setNewSelectedDoctorId} required disabled={isScheduling || isLoadingDoctors}>
                      <SelectTrigger id="doctorName">
                        <SelectValue placeholder={isLoadingDoctors ? "Loading doctors..." : "Select Doctor"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingDoctors ? <SelectItem value="loading" disabled>Loading...</SelectItem> : 
                          doctors.map(doc => (
                            <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="appointmentDate">Date <span className="text-destructive">*</span></Label>
                        <Input id="appointmentDate" type="date" value={newAppointmentDate} onChange={(e) => setNewAppointmentDate(e.target.value)} required disabled={isScheduling}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="appointmentTime">Time <span className="text-destructive">*</span></Label>
                        <Input id="appointmentTime" type="time" value={newAppointmentTime} onChange={(e) => setNewAppointmentTime(e.target.value)} required disabled={isScheduling}/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select value={newAppointmentType} onValueChange={setNewAppointmentType} disabled={isScheduling}>
                      <SelectTrigger id="appointmentType">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Check-up">Check-up</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Telemedicine">Telemedicine</SelectItem>
                        <SelectItem value="Procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline" disabled={isScheduling}>Cancel</Button></DialogClose>
                  <Button type="submit" disabled={isScheduling || isLoadingDoctors || !newSelectedDoctorId}>
                    {isScheduling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isScheduling ? "Scheduling..." : "Schedule Appointment"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Overview of scheduled appointments for {selectedCalendarDate ? selectedCalendarDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "all dates"}.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading appointments...</p>
                </div>
              ) : filteredAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.patientName}</TableCell>
                        <TableCell>{apt.doctorName}</TableCell>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          {apt.type === "Telemedicine" && <Video className="h-4 w-4 text-primary" />}
                          {apt.type}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            apt.status === "Confirmed" ? "default" :
                            apt.status === "Pending" ? "secondary" :
                            apt.status === "Cancelled" ? "destructive" :
                            "outline"
                          }>
                            {apt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                 <p className="text-sm text-muted-foreground text-center py-10">
                    No appointments scheduled for {selectedCalendarDate ? selectedCalendarDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : "this day"}.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedCalendarDate}
                  onSelect={setSelectedCalendarDate}
                  className="rounded-md border"
                  disabled={isLoadingAppointments}
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-6 w-6 text-primary" /> Notifications & Reminders
                </CardTitle>
                <CardDescription>Recent updates and upcoming appointment reminders.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingNotifications ? (
                   <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground text-sm">Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <ul className="space-y-3">
                    {notifications.map((notif) => (
                      <li key={notif.id} className={`p-3 border rounded-md ${notif.read ? 'bg-muted/30' : 'bg-accent/20 dark:bg-accent/10 border-accent/50'}`}>
                        <p className={`text-sm ${notif.read ? 'text-muted-foreground' : 'font-medium'}`}>{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications.</p>
                )}
                <Button variant="outline" className="w-full mt-4" disabled>View All Notifications</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )

    