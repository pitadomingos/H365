
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
  patient: string;
  doctor: string;
  time: string;
  type: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  date: string; 
}

interface NotificationItem {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

const mockDoctors = [
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

  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = React.useState(false);
  const [newPatientName, setNewPatientName] = React.useState("");
  const [newSelectedDoctor, setNewSelectedDoctor] = React.useState("");
  const [newAppointmentDate, setNewAppointmentDate] = React.useState("");
  const [newAppointmentTime, setNewAppointmentTime] = React.useState("");
  const [newAppointmentType, setNewAppointmentType] = React.useState("Consultation");
  const [isScheduling, setIsScheduling] = React.useState(false);

  React.useEffect(() => {
    setIsLoadingAppointments(true);
    setTimeout(() => {
      const fetchedAppointments: Appointment[] = [
        { id: "APT001", patient: "Alice Wonderland", doctor: "Dr. Smith", date: "2024-08-15", time: "10:00 AM - 10:30 AM", type: "Consultation", status: "Confirmed" },
        { id: "APT002", patient: "Bob The Builder", doctor: "Dr. Jones", date: "2024-08-15", time: "11:00 AM - 11:45 AM", type: "Check-up", status: "Pending" },
        { id: "APT003", patient: "Charlie Brown", doctor: "Dr. Smith", date: "2024-08-16", time: "02:00 PM - 02:30 PM", type: "Follow-up", status: "Cancelled" },
        { id: "APT004", patient: "Diana Prince", doctor: "Dr. Eve", date: "2024-08-16", time: "03:00 PM - 03:15 PM", type: "Telemedicine", status: "Confirmed" },
        { id: "APT005", patient: "Edward Hands", doctor: "Dr. Jones", date: new Date().toISOString().split('T')[0], time: "09:00 AM - 09:30 AM", type: "Consultation", status: "Confirmed" },
      ];
      setAppointments(fetchedAppointments);
      setIsLoadingAppointments(false);
    }, 1500);

    setIsLoadingNotifications(true);
    setTimeout(() => {
      const fetchedNotifications: NotificationItem[] = [
        { id: 1, message: "Appointment with Alice Wonderland confirmed for tomorrow at 10:00 AM.", time: "2 hours ago", read: false },
        { id: 2, message: "Lab results for Bob The Builder are ready.", time: "5 hours ago", read: true },
        { id: 3, message: "Reminder: Follow-up with Charlie Brown in 3 days.", time: "1 day ago", read: false },
      ];
      setNotifications(fetchedNotifications);
      setIsLoadingNotifications(false);
    }, 1200);
  }, []);

  const handleScheduleNewAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newSelectedDoctor || !newAppointmentDate || !newAppointmentTime) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields to schedule an appointment.",
      });
      return;
    }
    setIsScheduling(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newApt: Appointment = {
      id: `APT${Math.floor(Math.random() * 1000)}`,
      patient: newPatientName,
      doctor: mockDoctors.find(d => d.id === newSelectedDoctor)?.name || "N/A",
      date: newAppointmentDate,
      time: newAppointmentTime,
      type: newAppointmentType,
      status: "Pending", 
    };

    setAppointments(prev => [newApt, ...prev].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time)));
    toast({
      title: "Appointment Scheduled (Mock)",
      description: `Appointment for ${newPatientName} with ${newApt.doctor} on ${newAppointmentDate} at ${newAppointmentTime} has been requested.`,
    });

    setNewPatientName("");
    setNewSelectedDoctor("");
    setNewAppointmentDate("");
    setNewAppointmentTime("");
    setNewAppointmentType("Consultation");
    setIsScheduling(false);
    setIsSchedulingDialogOpen(false);
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
              <Button>
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
                    <Input id="patientName" placeholder="Patient Full Name" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctorName">Doctor <span className="text-destructive">*</span></Label>
                    <Select value={newSelectedDoctor} onValueChange={setNewSelectedDoctor} required>
                      <SelectTrigger id="doctorName">
                        <SelectValue placeholder="Select Doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="appointmentDate">Date <span className="text-destructive">*</span></Label>
                        <Input id="appointmentDate" type="date" value={newAppointmentDate} onChange={(e) => setNewAppointmentDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="appointmentTime">Time <span className="text-destructive">*</span></Label>
                        <Input id="appointmentTime" type="time" value={newAppointmentTime} onChange={(e) => setNewAppointmentTime(e.target.value)} required/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select value={newAppointmentType} onValueChange={setNewAppointmentType}>
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
                  <Button type="submit" disabled={isScheduling}>
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
                        <TableCell className="font-medium">{apt.patient}</TableCell>
                        <TableCell>{apt.doctor}</TableCell>
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