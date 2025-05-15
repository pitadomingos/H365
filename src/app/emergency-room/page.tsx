
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Siren } from "lucide-react";

export default function EmergencyRoomPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Siren className="h-8 w-8" /> Emergency Room Management
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>ER Dashboard & Patient Tracking</CardTitle>
            <CardDescription>Oversee emergency room operations and patient flow.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature under development. This section will provide tools for managing patient arrivals, triage, tracking patient status within the ER, managing ER resources, and coordinating with other departments.</p>
            <h3 className="mt-4 font-semibold text-lg">Potential Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
              <li>Real-time patient triage list (arrival time, chief complaint).</li>
              <li>Dynamic ER patient tracking board (triage level, location, status, assigned staff, timers).</li>
              <li>Quick stats: Total ER patients, average wait times, critical patient count.</li>
              <li>Simplified ER resource overview (staff, beds/bays).</li>
              <li>Alerts for critical events (e.g., incoming trauma, critical lab results).</li>
              <li>Quick actions: New ER patient registration, code alerts.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
