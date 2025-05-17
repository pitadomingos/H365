
"use client";

import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Briefcase, Users, Loader2 } from "lucide-react"; // Added Loader2
import { SpecialistConsultationForm } from "./specialist-consultation-form";
import { getTreatmentRecommendationAction } from "../treatment-recommendation/actions";
import Image from "next/image";

interface MockListItem {
  id: string;
  patientName: string;
  referringDoctor?: string; 
  reason?: string; 
  specialty?: string; 
  timeReferred?: string;
  message?: string; 
  time?: string;
  read?: boolean; 
  photoUrl: string;
  gender?: "Male" | "Female" | "Other";
}


const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
  if (gender === "Male") return "male avatar";
  if (gender === "Female") return "female avatar";
  return "patient avatar";
};

export default function SpecializationsPage() {
  const [referralList, setReferralList] = useState<MockListItem[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const [specialistNotifications, setSpecialistNotifications] = useState<MockListItem[]>([]);
  const [isLoadingSpecialistNotifications, setIsLoadingSpecialistNotifications] = useState(true);

  useEffect(() => {
    // Simulate fetching referral list
    setIsLoadingReferrals(true);
    setTimeout(() => {
      const mockReferralListData: MockListItem[] = [
        { id: "REF001", patientName: "Edward Scissorhands", gender: "Male", referringDoctor: "Dr. Primary", reason: "Cardiac evaluation", timeReferred: "09:00 AM", specialty: "Cardiology", photoUrl: "https://placehold.co/32x32.png" },
        { id: "REF002", patientName: "Fiona Gallagher", gender: "Female", referringDoctor: "Dr. GP", reason: "Persistent Headaches", timeReferred: "09:30 AM", specialty: "Neurology", photoUrl: "https://placehold.co/32x32.png" },
      ];
      setReferralList(mockReferralListData);
      setIsLoadingReferrals(false);
    }, 1200);

    // Simulate fetching specialist notifications
    setIsLoadingSpecialistNotifications(true);
    setTimeout(() => {
      const mockSpecialistNotificationsData: MockListItem[] = [
        { id: "SNOTIF001", patientName: "Edward Scissorhands", gender: "Male", message: "Previous ECG results uploaded.", time: "10 mins ago", read: false, photoUrl: "https://placehold.co/32x32.png" },
        { id: "SNOTIF002", patientName: "Fiona Gallagher", gender: "Female", message: "MRI scheduled for tomorrow.", time: "25 mins ago", read: true, photoUrl: "https://placehold.co/32x32.png" },
      ];
      setSpecialistNotifications(mockSpecialistNotificationsData);
      setIsLoadingSpecialistNotifications(false);
    }, 1500);
  }, []);


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
              {isLoadingReferrals ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  Loading referrals...
                </div>
              ) : referralList.length > 0 ? (
                <ul className="space-y-3">
                  {referralList.map((patient) => (
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
              {isLoadingSpecialistNotifications ? (
                 <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  Loading notifications...
                </div>
              ) : specialistNotifications.length > 0 ? (
                <ul className="space-y-2.5">
                  {specialistNotifications.map((notif) => (
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
