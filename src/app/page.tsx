import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, DollarSign } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const summaryCards = [
    { title: "Today's Appointments", value: "12", icon: CalendarCheck, color: "text-sky-500", description: "+2 since yesterday", link: "/appointments" },
    { title: "New Patients", value: "5", icon: Users, color: "text-emerald-500", description: "This week", link: "/patient-registration" },
    { title: "Pending Lab Results", value: "8", icon: Activity, color: "text-amber-500", description: "Requires review", link: "#" },
    { title: "Revenue This Month", value: "$12,500", icon: DollarSign, color: "text-purple-500", description: "+5% from last month", link: "#" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to HealthFlow</h1>
          <p className="text-muted-foreground">Your centralized healthcare management hub.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((item) => (
            <Card key={item.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground pt-1">{item.description}</p>
                 {item.link !== "#" && (
                  <Button variant="link" asChild className="px-0 pt-2 h-auto text-sm">
                    <Link href={item.link}>View Details</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Overview of recent system events and patient interactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  {user: "Dr. Smith", action: "updated patient chart for Alice Johnson.", time: "2 min ago"},
                  {user: "Reception", action: "registered new patient: Bob Williams.", time: "15 min ago"},
                  {user: "Lab", action: "uploaded results for patient ID #7890.", time: "1 hour ago"},
                  {user: "Nurse Eva", action: "scheduled follow-up for Mike Brown.", time: "3 hours ago"},
                ].map((activity, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Activity className="h-4 w-4 mr-3 mt-1 shrink-0 text-primary" />
                    <div>
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
               <Button variant="outline" className="mt-4 w-full">View All Activity</Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access common tasks quickly.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <Link href="/patient-registration">Register New Patient</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                 <Link href="/appointments">Schedule Appointment</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/treatment-recommendation">Get AI Recommendation</Link>
              </Button>
              <Button variant="outline" className="w-full" disabled>View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
