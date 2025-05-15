
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function TechnicalOverviewPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Info className="h-8 w-8" /> H365 Technical Overview
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              H365 is a modern, web-based hospital management system designed to streamline clinical workflows,
              improve patient care coordination, and provide robust data management capabilities for healthcare facilities.
              Built with a focus on user experience and scalability, H365 aims to support healthcare professionals
              in delivering efficient and effective patient care.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">2. Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li><strong>Frontend</strong>: Next.js (App Router), React, TypeScript</li>
              <li><strong>UI Components</strong>: ShadCN UI</li>
              <li><strong>Styling</strong>: Tailwind CSS</li>
              <li><strong>Artificial Intelligence (AI) Integration</strong>: Genkit (utilizing Google AI models)</li>
              <li><strong>State Management</strong>: Primarily React Context and component-level state.</li>
              <li><strong>Deployment</strong>: (To be determined, typically Vercel, Firebase Hosting, or similar)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">3. Core Modules and Key Features</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
            <section>
              <h4 className="font-semibold">3.1. Dashboard</h4>
              <ul>
                <li><strong>Overview</strong>: Centralized hub for key hospital metrics.</li>
                <li><strong>Summary Cards</strong>: Today's Appointments, Ward Occupancy, ER Status, New Patients, etc.</li>
                <li><strong>Quick Actions</strong>: Links to common tasks.</li>
                <li><strong>Visual Analytics</strong>: Patient Entry Points (Pie Chart), Daily Patient Attendance (Bar Chart).</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.2. Patient Registration</h4>
              <ul>
                <li><strong>Individual & Bulk Registration</strong>: Comprehensive data entry and CSV upload.</li>
                <li><strong>Photo Capture</strong>: Integrated webcam functionality.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.3. Visiting Patients (Consultation Intake)</h4>
              <ul>
                <li><strong>Patient Search & Quick Registration Modal</strong>.</li>
                <li><strong>Visit Entry & Waiting List Integration</strong>.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.4. Appointments</h4>
              <ul>
                <li><strong>Scheduling, List View, Calendar View</strong>.</li>
                <li><strong>Notifications & Reminders</strong> (mocked).</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.5. Consultation Room (General & AI-Assisted)</h4>
              <ul>
                <li><strong>Three-panel layout</strong> with Waiting List, main form, and Patient Summary/History.</li>
                <li><strong>Vitals, Symptoms, AI-Powered Decision Support</strong> (Diagnosis, Prescription, Recommendations).</li>
                <li><strong>Diagnostic Orders</strong> (mocked).</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.6. Specializations</h4>
              <ul>
                <li>Similar to Consultation Room, tailored for specialists with referral context.</li>
              </ul>
            </section>
             <section>
              <h4 className="font-semibold">3.7. Maternity Care</h4>
              <ul>
                <li>Patient search, overview, antenatal visit log, lab/imaging orders.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.8. Ward Management</h4>
              <ul>
                <li>Occupancy overview, admissions, bed assignment, in-patient care details.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.9. Laboratory Management</h4>
              <ul>
                <li>Request processing, results entry, reagent inventory.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.10. Imaging & Radiology Management</h4>
              <ul>
                <li>Request processing, report entry, equipment status.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.11. Drug Dispensing Pharmacy</h4>
              <ul>
                <li>Prescription processing, stock levels, daily reports.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.12. Emergency Room (Placeholder)</h4>
              <ul>
                <li>Planned features: ER Dashboard, triage, tracking, alerts.</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">3.13. Epidemic Control & Management (Placeholder)</h4>
              <ul>
                <li>Planned features: Outbreak monitoring, case management, contact tracing.</li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">4. UI/UX Style Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li><strong>Primary Color</strong>: Light blue (#ADD8E6).</li>
              <li><strong>Secondary Colors</strong>: White and light grey.</li>
              <li><strong>Accent Color</strong>: Teal (#008080).</li>
              <li><strong>Typography</strong>: Clear, readable font (Geist Sans).</li>
              <li><strong>Layout</strong>: Clean, organized, responsive.</li>
              <li><strong>Theme</strong>: Supports Dark, Light, and System modes.</li>
              <li><strong>Icons</strong>: <code>lucide-react</code>.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">5. Future Considerations (Beyond Prototype)</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li>Backend Development (Database, APIs, Auth).</li>
              <li>Real-time Data Synchronization.</li>
              <li>HL7/FHIR Integration.</li>
              <li>Advanced Reporting & Analytics.</li>
              <li>Security & Compliance.</li>
              <li>User Roles & Permissions.</li>
              <li>Offline Capabilities.</li>
              <li>Full Internationalization (i18n).</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
