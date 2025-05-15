
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, DollarSign } from "lucide-react";
import Link from "next/link";
import { getTranslator, type Locale } from '@/lib/i18n'; // New import

export default function DashboardPage() {
  // For demonstration, we'll use the default locale ('en').
  // In a real app, the locale would be determined dynamically (e.g., from URL params).
  const currentLocale: Locale = 'en'; 
  const t = getTranslator(currentLocale);

  const summaryCards = [
    { titleKey: "dashboard.card.appointments.title", value: "12", icon: CalendarCheck, color: "text-sky-500", descriptionKey: "dashboard.card.appointments.description", link: "/appointments" },
    { titleKey: "dashboard.card.newPatients.title", value: "5", icon: Users, color: "text-emerald-500", descriptionKey: "dashboard.card.newPatients.description", link: "/patient-registration" },
    { titleKey: "dashboard.card.labResults.title", value: "8", icon: Activity, color: "text-amber-500", descriptionKey: "dashboard.card.labResults.description", link: "#" },
    { titleKey: "dashboard.card.revenue.title", value: "$12,500", icon: DollarSign, color: "text-purple-500", descriptionKey: "dashboard.card.revenue.description", link: "#" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcomeMessage')}</h1>
          <p className="text-muted-foreground">{t('dashboard.tagline')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((item) => (
            <Card key={t(item.titleKey)} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t(item.titleKey)}</CardTitle>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground pt-1">{t(item.descriptionKey)}</p>
                 {item.link !== "#" && (
                  <Button variant="link" asChild className="px-0 pt-2 h-auto text-sm">
                    <Link href={item.link}>{t('dashboard.card.viewDetails')}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity.title')}</CardTitle>
              <CardDescription>{t('dashboard.recentActivity.description')}</CardDescription>
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
                      {/* Note: Dynamic activity text like this would also need a more complex i18n approach */}
                      <span className="font-medium">{activity.user}</span> {activity.action}
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
               <Button variant="outline" className="mt-4 w-full">{t('dashboard.recentActivity.viewAll')}</Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
              <CardDescription>{t('dashboard.quickActions.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <Link href="/patient-registration">{t('dashboard.quickActions.registerPatient')}</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                 <Link href="/appointments">{t('dashboard.quickActions.scheduleAppointment')}</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/treatment-recommendation">{t('dashboard.quickActions.getAiRecommendation')}</Link>
              </Button>
              <Button variant="outline" className="w-full" disabled>{t('dashboard.quickActions.viewReports')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
