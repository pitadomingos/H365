
'use server'; 

import { ClipboardEdit, ListChecks, Bell, Users, FlaskConical, FileClock } from "lucide-react";
import { ConsultationForm } from "./consultation-form";
import { getTreatmentRecommendationAction } from "./actions";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from 'react'; // useEffect and useState are client-side

// These would typically be client components if they fetch data dynamically
// For now, keeping them as server components with static mock data.

interface MockListItem {
  id: string;
  patientName: string;
  timeAdded?: string; 
  location?: string; 
  status?: string; 
  message?: string; 
  time?: string; 
  read?: boolean; 
  photoUrl: string;
  gender?: "Male" | "Female" | "Other";
}

interface DraftedConsultationItem extends MockListItem {
  reasonForDraft: string;
  lastSavedTime: string;
}

const mockWaitingListData: MockListItem[] = [
  { id: "WL001", patientName: "Alice Wonderland", gender: "Female", timeAdded: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor", photoUrl: "https://placehold.co/32x32.png" },
  { id: "WL002", patientName: "Bob The Builder", gender: "Male", timeAdded: "10:45 AM", location: "Consultation Room 1", status: "With Doctor", photoUrl: "https://placehold.co/32x32.png" },
];

const mockLabNotificationsData: MockListItem[] = [
  { id: "NOTIF001", patientName: "Charlie Brown", gender: "Male", message: "Lab results are ready.", time: "5 mins ago", read: false, photoUrl: "https://placehold.co/32x32.png" },
  { id: "NOTIF002", patientName: "Diana Prince", gender: "Female", message: "Imaging report available.", time: "15 mins ago", read: true, photoUrl: "https://placehold.co/32x32.png" },
];

const mockDraftedConsultationsData: DraftedConsultationItem[] = [
    { id: "DRAFT001", patientName: "Edward Scissorhands", gender: "Male", reasonForDraft: "Awaiting Chest X-Ray results", lastSavedTime: "Yesterday 04:30 PM", photoUrl: "https://placehold.co/32x32.png" },
    { id: "DRAFT002", patientName: "Fiona Gallagher", gender: "Female", reasonForDraft: "Pending Full Blood Count", lastSavedTime: "Today 09:15 AM", photoUrl: "https://placehold.co/32x32.png" },
];


const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
  if (gender === "Male") return "male avatar";
  if (gender === "Female") return "female avatar";
  return "patient avatar";
};

// This page itself is a Server Component if it doesn't use hooks directly.
// The child components (WaitingList, Notifications, Drafts) would be client components
// if they were to fetch data dynamically with useEffect.
// For this prototype with mock data, we can keep it simple.

function WaitingList() {
  // In a real app, this would use useState and useEffect to fetch data
  const waitingList = mockWaitingListData; 
  const isLoading = false; // Simulate loading state

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="h-5 w-5 text-primary" /> Waiting List
        </CardTitle>
        <CardDescription className="text-xs">Patients waiting for consultation.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(33vh-80px)] overflow-y-auto"> {/* Adjusted height */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Loading waiting list...</p>
        ) : waitingList.length > 0 ? (
          <ul className="space-y-3">
            {waitingList.map((patient) => (
              <li key={patient.id} className="p-2.5 border rounded-md shadow-sm bg-background hover:bg-muted/50 flex items-center gap-3">
                <Image
                    src={patient.photoUrl}
                    alt={patient.patientName}
                    width={32}
                    height={32}
                    className="rounded-full"
                    data-ai-hint={getAvatarHint(patient.gender)}
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
  );
}

function LabNotifications() {
  const labNotifications = mockLabNotificationsData;
  const isLoading = false;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-primary" /> Lab/Imaging Notifications
        </CardTitle>
         <CardDescription className="text-xs">Updates on lab results & imaging.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(33vh-80px)] overflow-y-auto"> {/* Adjusted height */}
        {isLoading ? (
           <p className="text-sm text-muted-foreground text-center py-4">Loading notifications...</p>
        ) : labNotifications.length > 0 ? (
          <ul className="space-y-2.5">
            {labNotifications.map((notif) => (
               <li key={notif.id} className={`p-2.5 border rounded-md text-xs ${notif.read ? 'bg-muted/40' : 'bg-accent/20 dark:bg-accent/10 border-accent/50'} flex items-start gap-2`}>
                  <Image
                    src={notif.photoUrl}
                    alt={notif.patientName}
                    width={24} 
                    height={24}
                    className="rounded-full mt-0.5"
                    data-ai-hint={getAvatarHint(notif.gender)}
                  />
                  <div className="flex-1">
                    <p className={`${notif.read ? 'text-muted-foreground' : 'font-medium'}`}>
                      <strong>{notif.patientName}:</strong> {notif.message}
                    </p>
                    <p className={`text-xs ${notif.read ? 'text-muted-foreground/80' : 'text-muted-foreground' } mt-0.5`}>{notif.time}</p>
                  </div>
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
  );
}

function IncompleteConsultations() {
    const draftedConsultations = mockDraftedConsultationsData;
    const isLoading = false;

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileClock className="h-5 w-5 text-primary" /> Incomplete Consultations
                </CardTitle>
                <CardDescription className="text-xs">Consultations awaiting results or further action.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(34vh-80px)] overflow-y-auto"> {/* Adjusted height */}
                {isLoading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Loading drafts...</p>
                ) : draftedConsultations.length > 0 ? (
                    <ul className="space-y-3">
                        {draftedConsultations.map((consult) => (
                            <li key={consult.id} className="p-2.5 border rounded-md shadow-sm bg-background hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={consult.photoUrl}
                                        alt={consult.patientName}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                        data-ai-hint={getAvatarHint(consult.gender)}
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{consult.patientName}</p>
                                        <p className="text-xs text-muted-foreground">Reason: {consult.reasonForDraft}</p>
                                        <p className="text-xs text-muted-foreground">Saved: {consult.lastSavedTime}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={() => alert(`Resuming consultation for ${consult.patientName} (mock action)`)}>
                                    Resume Consultation
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <FileClock className="mx-auto h-10 w-10 mb-1" />
                        <p className="text-sm">No incomplete consultations.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


export default async function ConsultationRoomPage() {
  return (
      <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6 h-full items-start">
        {/* Left Panel */}
        <div className="lg:sticky lg:top-[calc(theme(spacing.16)_+_theme(spacing.6))] flex flex-col gap-6">
          <WaitingList />
          <LabNotifications />
          <IncompleteConsultations />
        </div>

        {/* Center Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ClipboardEdit className="h-8 w-8" /> Doctor's Consultation Room
            </h1>
          </div>
          <ConsultationForm getRecommendationAction={getTreatmentRecommendationAction} />
        </div>
      </div>
  )
}

