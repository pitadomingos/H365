
"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ListChecks, Loader2 } from "lucide-react";

interface TaskItem {
  text: string;
  subItems?: string[];
}

interface TaskCategory {
  title: string;
  items: TaskItem[];
}

const accomplishedTasks: TaskCategory[] = [
  {
    title: "Application Shell & Navigation",
    items: [
      { text: "Established Next.js application with collapsible sidebar." },
      { text: "Implemented theme toggling (light/dark/system) and consistent footer." },
    ],
  },
  {
    title: "Core Clinical & Admin Modules (UI & Mocked Logic)",
    items: [
      { text: "Dashboard: Snapshot of hospital activity with summary cards & charts (Patient Entry, Daily Attendance). Simulates data fetching." },
      { text: "Patient Registration: Individual/bulk registration, webcam photo capture, dynamic waiting list display." },
      { text: "Visiting Patients (Intake): Patient search, quick registration modal, visit recording, local waiting list update, mock visit analytics." },
      { text: "Appointments: Scheduling, list/calendar views, mock notifications." },
      { text: "Consultation Room (General): Three-panel layout, patient search, vitals (BMI calc & status), symptom input, AI-assisted decision support (Genkit), diagnostic ordering modals, doctor comments, 'Save Progress', 'Finish Consultation' workflow." },
      { text: "Specializations: Mirrors Consultation Room, tailored for specialists with referral context." },
      { text: "Maternity Care: Patient management, antenatal visit logging, diagnostic ordering modals." },
      { text: "Ward Management: Ward-centric view with dashboard, patient lists, bed status, in-patient care details (treatment plans, editable medication schedules via modal, notes, discharge/transfer)." },
      { text: "Laboratory Management: Handles lab requests, detailed result entry modal with auto-interpretation, reagent inventory (requisition, history, simulated consumption)." },
      { text: "Imaging & Radiology Management: Manages imaging requests, report entry modal, daily summary. Notes future Biomedical Engineering module." },
      { text: "Drug Dispensing Pharmacy: Manages prescriptions, pharmacy stock (requisition, history), daily report." },
    ],
  },
  {
    title: "Placeholder Modules Created",
    items: [
      { text: "Basic pages & navigation for Emergency Room, Epidemic Control, Campaigns, Reporting, Billing & Finance, Telemedicine, Analytics & BI, Blood Bank." },
    ],
  },
  {
    title: "Technical Documentation & UI/UX",
    items: [
      { text: "Technical Overview Page: Bilingual (EN/PT) page detailing features, tech stack, UI guidelines, and future scope." },
      { text: "General UI/UX: Consistent ShadCN UI/Tailwind CSS usage, improved button visibility, bug fixes (hydration errors, missing imports), `data-ai-hint` for patient photos." },
    ],
  },
  {
    title: "Backend API Preparation (Frontend Side)",
    items: [
      { text: "Structured most interactive modules to simulate API calls, manage loading/error states, and prepare data payloads for defined API contracts." },
    ],
  },
];

const pendingTasks: TaskCategory[] = [
  {
    title: "Comprehensive Backend Development (Node.js/Express & MySQL)",
    items: [
      { text: "Database Schema Design & Implementation (MySQL on Aiven)." },
      { text: "API Implementation: Build all defined API endpoints for each module." },
      { text: "Authentication & Authorization: Secure user login, Role-Based Access Control (RBAC)." },
      { text: "Hierarchical Data Access & Aggregation: For hospital, district, provincial, national levels." },
      { text: "Business Logic: Server-side validation, data processing, complex workflows." },
      { text: "Photo Storage Backend Logic: Implement chosen strategy (BLOBs or object storage)." },
    ],
  },
  {
    title: "Frontend Integration with Real Backend",
    items: [
      { text: "Replace all simulated `fetch` calls with actual HTTP requests." },
      { text: "Implement robust error handling for real network requests." },
      { text: "Integrate real-time data updates (waiting lists, notifications)." },
    ],
  },
  {
    title: "Full Development of Placeholder Modules",
    items: [
      { text: "Emergency Room: UI, frontend logic, backend integration." },
      { text: "Epidemic Control: UI, frontend logic, backend integration." },
      { text: "Campaigns: UI, frontend logic, backend integration." },
      { text: "Reporting (Comprehensive): UI, frontend logic, backend integration." },
      { text: "Billing & Finance: UI, frontend logic, backend integration." },
      { text: "Telemedicine: UI, frontend logic, backend integration." },
      { text: "Analytics & BI: UI, frontend logic, backend integration." },
      { text: "Blood Bank Management: UI, frontend logic, backend integration." },
    ],
  },
  {
    title: "Dedicated Centralized Modules",
    items: [
      { text: "Warehouse Management Module: Central stock control (pharmacy & lab) across all hierarchical levels." },
      { text: "Biomedical Engineering Module: Medical equipment management." },
    ],
  },
  {
    title: "Interoperability & Standards",
    items: [
      { text: "HL7/FHIR Integration for data exchange." },
      { text: "Direct Medical Instrument Integration (automated data capture)." },
    ],
  },
  {
    title: "Patient-Facing Features",
    items: [
      { text: "Patient Portal & Mobile Engagement: Secure access to records, appointments, medication reminders (with confirmation)." },
    ],
  },
  {
    title: "Advanced Features & Refinements",
    items: [
      { text: "Full Internationalization (i18n) & Localization (l10n): Complete translations (PT, IT, ES, others), regional formats." },
      { text: "Offline Capabilities for areas with unreliable internet." },
      { text: "Comprehensive Security & Compliance: Adherence to data privacy laws, audit trails." },
      { text: "Genkit AI Flow Enhancement: Integrate with live backend for real-time, complete patient data." },
    ],
  },
  {
    title: "Testing, Deployment, & Maintenance",
    items: [
      { text: "Thorough Unit, Integration, and End-to-End Testing." },
      { text: "Establish CI/CD Pipelines for efficient deployment." },
      { text: "Plan for ongoing maintenance, updates, and user support." },
      { text: "Develop comprehensive user training materials and system documentation." },
    ],
  },
];


export default function TodoListPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ListChecks className="h-8 w-8" /> H365 Project To-Do List
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Accomplished (Frontend Prototype)
            </CardTitle>
            <CardDescription>Key features and modules prototyped in the frontend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {accomplishedTasks.map((category, index) => (
                <AccordionItem value={`accomplished-${index}`} key={`accomplished-${index}`}>
                  <AccordionTrigger className="text-lg hover:no-underline">{category.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                      {category.items.map((item, itemIndex) => (
                        <li key={`accomplished-item-${index}-${itemIndex}`}>
                          {item.text}
                          {item.subItems && (
                            <ul className="list-circle space-y-1 pl-5 mt-1">
                              {item.subItems.map((subItem, subIndex) => (
                                <li key={`accomplished-subitem-${index}-${itemIndex}-${subIndex}`}>{subItem}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              Pending / Future Work
            </CardTitle>
            <CardDescription>Next steps and major areas for full development.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {pendingTasks.map((category, index) => (
                <AccordionItem value={`pending-${index}`} key={`pending-${index}`}>
                  <AccordionTrigger className="text-lg hover:no-underline">{category.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                      {category.items.map((item, itemIndex) => (
                        <li key={`pending-item-${index}-${itemIndex}`}>
                          {item.text}
                           {item.subItems && (
                            <ul className="list-circle space-y-1 pl-5 mt-1">
                              {item.subItems.map((subItem, subIndex) => (
                                <li key={`pending-subitem-${index}-${itemIndex}-${subIndex}`}>{subItem}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
