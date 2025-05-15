
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function SpecializationsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Star className="h-8 w-8" /> Specialization Management
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Department & Doctor Specializations</CardTitle>
            <CardDescription>Manage medical specializations within the hospital.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature under development. This section will allow for managing lists of medical specializations, assigning them to departments, and linking doctors to their respective areas of expertise.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
