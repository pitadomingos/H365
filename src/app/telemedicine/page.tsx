
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";
import { getTranslator, type Locale } from '@/lib/i18n';

export default function TelemedicinePage() {
  const currentLocale: Locale = 'en';
  const t = getTranslator(currentLocale);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Video className="h-8 w-8" /> Telemedicine Module
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Module Overview</CardTitle>
            <CardDescription>Facilitates secure remote video consultations between doctors and patients.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('techOverview.section5.itemTelemedicine.desc')}</p>
            <h3 className="mt-4 font-semibold text-lg">Potential Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
              <li>Secure video conferencing platform.</li>
              <li>Scheduling for tele-appointments.</li>
              <li>Secure document and image sharing.</li>
              <li>Integration with digital prescriptions.</li>
              <li>Patient queue management for virtual consultations.</li>
              <li>Recording capabilities (with consent).</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
