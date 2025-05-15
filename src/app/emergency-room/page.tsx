
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
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
