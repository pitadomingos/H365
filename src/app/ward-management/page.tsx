
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble } from "lucide-react";

export default function WardManagementPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BedDouble className="h-8 w-8" /> Ward Management
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Ward Overview</CardTitle>
            <CardDescription>Manage hospital wards, bed allocation, and patient assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature under development. This section will allow for comprehensive ward management, including viewing ward status, assigning patients to beds, managing transfers, and tracking occupancy.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
