
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ListChecks, Bell, Users, Briefcase } from "lucide-react";
import { SpecialistConsultationForm } from "./specialist-consultation-form";
import { getTreatmentRecommendationAction } from "../treatment-recommendation/actions"; // Reusing the same AI action
import Image from "next/image";

// Mock data - In a real app, this would come from state management or API
const mockReferralList = [
  { id: "REF001", patientName: "Edward Scissorhands", referringDoctor: "Dr. Primary", reason: "Cardiac evaluation", timeReferred: "09:00 AM", specialty: "Cardiology", photoUrl: "https://placehold.co/32x32.png" },
  { id: "REF002", patientName: "Fiona Gallagher", referringDoctor: "Dr. GP", reason: "Persistent Headaches", timeReferred: "09:30 AM", specialty: "Neurology", photoUrl: "https://placehold.co/32x32.png" },
];

const mockSpecialistNotifications = [
  { id: "SNOTIF001", patientName: "Edward Scissorhands", message: "Previous ECG results uploaded.", time: "10 mins ago", read: false },
  { id: "SNOTIF002", patientName: "Fiona Gallagher", message: "MRI scheduled for tomorrow.", time: "25 mins ago", read: true },
];


export default async function SpecializationsPage() {
  return (
    <AppShell>
      <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 h-full items-start">
        {/* Left Panel */}
        <div className="lg:sticky lg:top-[calc(theme(spacing.16)_+_theme(spacing.6))] flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-primary" /> Specialist Referral List
              </CardTitle>
              <CardDescription className="text-xs">Patients referred for specialist consultation.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(50vh-100px)] overflow-y-auto">
              {mockReferralList.length > 0 ? (
                <ul className="space-y-3">
                  {mockReferralList.map((patient) => (
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
                        <p className="text-xs text-muted-foreground">To: {patient.specialty}</p>
                        <p className="text-xs text-muted-foreground">Ref: {patient.referringDoctor} | {patient.reason}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="mx-auto h-10 w-10 mb-1" />
                  <p className="text-sm">Referral list is empty.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" /> Specialist Notifications
              </CardTitle>
               <CardDescription className="text-xs">Updates relevant to specialist consultations.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(50vh-120px)] overflow-y-auto">
              {mockSpecialistNotifications.length > 0 ? (
                <ul className="space-y-2.5">
                  {mockSpecialistNotifications.map((notif) => (
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
                  <p className="text-sm">No new notifications for specialists.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Star className="h-8 w-8" /> Specialist Consultation Room
            </h1>
          </div>
          <SpecialistConsultationForm getRecommendationAction={getTreatmentRecommendationAction} />
        </div>

      </div>
    </AppShell>
  );
}
