
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardEdit, ListChecks, Bell, Users } from "lucide-react"; // Changed FlaskConical
import { ConsultationForm } from "./consultation-form"; // Renamed import
import { getTreatmentRecommendationAction } from "./actions";
import Image from "next/image"; // Added Image import
import { Separator } from "@/components/ui/separator";


// Mock data - In a real app, this would come from state management or API
const mockWaitingList = [
  { id: "WL001", patientName: "Alice Wonderland", timeAdded: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor", photoUrl: "https://placehold.co/32x32.png" },
  { id: "WL002", patientName: "Bob The Builder", timeAdded: "10:45 AM", location: "Consultation Room 1", status: "With Doctor", photoUrl: "https://placehold.co/32x32.png" },
];

const mockLabNotifications = [
  { id: "NOTIF001", patientName: "Charlie Brown", message: "Lab results are ready.", time: "5 mins ago", read: false },
  { id: "NOTIF002", patientName: "Diana Prince", message: "Imaging report available.", time: "15 mins ago", read: true },
];


export default async function ConsultationRoomPage() { // Changed page name and made async due to actions
  return (
    <AppShell>
      <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 h-full items-start">
        {/* Left Panel */}
        <div className="lg:sticky lg:top-[calc(theme(spacing.16)_+_theme(spacing.6))] flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-primary" /> Waiting List
              </CardTitle>
              <CardDescription className="text-xs">Patients waiting for consultation.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(50vh-100px)] overflow-y-auto">
              {mockWaitingList.length > 0 ? (
                <ul className="space-y-3">
                  {mockWaitingList.map((patient) => (
                    <li key={patient.id} className="p-2.5 border rounded-md shadow-sm bg-background hover:bg-muted/50 flex items-center gap-3">
                      <Image
                          src={patient.photoUrl}
                          alt={patient.patientName}
                          width={32}
                          height={32}
                          className="rounded-full"
                          data-ai-hint="patient avatar"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{patient.patientName}</p>
                        <p className="text-xs text-muted-foreground">{patient.location} - {patient.status}</p>
                        <p className="text-xs text-muted-foreground">Added: {patient.timeAdded}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="mx-auto h-10 w-10 mb-1" />
                  <p className="text-sm">Waiting list is empty.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" /> Lab Notifications
              </CardTitle>
               <CardDescription className="text-xs">Updates on lab results & imaging.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(50vh-120px)] overflow-y-auto">
              {mockLabNotifications.length > 0 ? (
                <ul className="space-y-2.5">
                  {mockLabNotifications.map((notif) => (
                     <li key={notif.id} className={`p-2.5 border rounded-md text-xs ${notif.read ? 'bg-muted/40' : 'bg-accent/20 dark:bg-accent/10 border-accent/50'}`}>
                        <p className={`${notif.read ? 'text-muted-foreground' : 'font-medium'}`}>
                           <strong>{notif.patientName}:</strong> {notif.message}
                        </p>
                        <p className={`text-xs ${notif.read ? 'text-muted-foreground/80' : 'text-muted-foreground' } mt-0.5`}>{notif.time}</p>
                      </li>
                  ))}
                </ul>
              ) : (
                 <div className="text-center py-6 text-muted-foreground">
                  <Bell className="mx-auto h-10 w-10 mb-1" />
                  <p className="text-sm">No new notifications.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ClipboardEdit className="h-8 w-8" /> Doctor's Consultation Room
            </h1>
          </div>
          {/* The main consultation form will go here */}
          <ConsultationForm getRecommendationAction={getTreatmentRecommendationAction} />
        </div>

      </div>
    </AppShell>
  );
}
