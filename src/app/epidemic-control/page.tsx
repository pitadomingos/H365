
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Biohazard } from "lucide-react";

export default function EpidemicControlPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Biohazard className="h-8 w-8" /> Epidemic Control &amp; Management
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Outbreak Monitoring & Response</CardTitle>
            <CardDescription>Tools for managing and responding to epidemics or public health crises.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature under development. This section will include features for tracking infectious diseases, managing patient isolation, resource allocation for epidemic response, public health reporting, and vaccination campaign management.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
