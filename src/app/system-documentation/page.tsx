
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function SystemDocumentationPage() {
  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" /> System Documentation
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>H365 System Manuals & Guides</CardTitle>
            <CardDescription>Comprehensive documentation for users and administrators.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature under development. This section will house all technical and user documentation for H365, including user guides, admin manuals, API documentation links, troubleshooting guides, and system architecture diagrams.</p>
            <h3 className="mt-4 font-semibold text-lg">Potential Content:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
              <li>User Manuals for each module (e.g., Reception, Doctor, Nurse, Lab Tech).</li>
              <li>Administrator Guide (User Management, System Configuration).</li>
              <li>Technical Architecture Document.</li>
              <li>API Documentation (link to Swagger/OpenAPI if generated).</li>
              <li>Deployment Guide.</li>
              <li>Troubleshooting FAQ.</li>
              <li>Data Backup and Recovery Procedures.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}
      