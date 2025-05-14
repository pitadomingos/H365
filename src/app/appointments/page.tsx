"use client"; // Required for Calendar component and state

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Bell, CalendarCheck2, PlusCircle, Video } from "lucide-react";
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function AppointmentsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const appointments = [
    { id: "APT001", patient: "Alice Wonderland", doctor: "Dr. Smith", time: "10:00 AM - 10:30 AM", type: "Consultation", status: "Confirmed" },
    { id: "APT002", patient: "Bob The Builder", doctor: "Dr. Jones", time: "11:00 AM - 11:45 AM", type: "Check-up", status: "Pending" },
    { id: "APT003", patient: "Charlie Brown", doctor: "Dr. Smith", time: "02:00 PM - 02:30 PM", type: "Follow-up", status: "Cancelled" },
    { id: "APT004", patient: "Diana Prince", doctor: "Dr. Eve", time: "03:00 PM - 03:15 PM", type: "Telemedicine", status: "Confirmed" },
  ];

  const notifications = [
    { id: 1, message: "Appointment with Alice Wonderland confirmed for tomorrow at 10:00 AM.", time: "2 hours ago", read: false },
    { id: 2, message: "Lab results for Bob The Builder are ready.", time: "5 hours ago", read: true },
    { id: 3, message: "Reminder: Follow-up with Charlie Brown in 3 days.", time: "1 day ago", read: false },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="h-8 w-8" /> Appointments
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Schedule New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>
                  Fill in the details to schedule a new appointment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="patientName" className="text-right">
                    Patient
                  </Label>
                  <Input id="patientName" placeholder="Patient Name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="doctorName" className="text-right">
                    Doctor
                  </Label>
                   <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                      <SelectItem value="dr-eve">Dr. Eve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appointmentDate" className="text-right">
                    Date
                  </Label>
                  <Input id="appointmentDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appointmentTime" className="text-right">
                    Time
                  </Label>
                  <Input id="appointmentTime" type="time" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Schedule Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Overview of scheduled appointments for the selected date.</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {appointments.map((apt) => (
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
                          "destructive"
                        }>
                          {apt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
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
                {notifications.length > 0 ? (
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
                <Button variant="outline" className="w-full mt-4">View All Notifications</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
