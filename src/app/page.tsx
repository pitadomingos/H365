
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, BedDouble, Siren, Briefcase, Microscope, Baby } from "lucide-react"; // Added BedDouble, Siren, Briefcase, Microscope, Baby
import Link from "next/link";
import { getTranslator, type Locale } from '@/lib/i18n';

export default function DashboardPage() {
  const currentLocale: Locale = 'en'; 
  const t = getTranslator(currentLocale);

  const summaryCards = [
    { titleKey: "dashboard.card.appointments.title", value: "12", icon: CalendarCheck, color: "text-sky-500", descriptionKey: "dashboard.card.appointments.description", link: "/appointments" },
    { titleKey: "dashboard.card.newPatients.title", value: "5", icon: Users, color: "text-emerald-500", descriptionKey: "dashboard.card.newPatients.description", link: "/patient-registration" },
    { titleKey: "dashboard.card.wardOccupancy.title", value: "75%", icon: BedDouble, color: "text-indigo-500", descriptionKey: "dashboard.card.wardOccupancy.description", link: "/ward-management" },
    { titleKey: "dashboard.card.erStatus.title", value: "12 Active", icon: Siren, color: "text-red-500", descriptionKey: "dashboard.card.erStatus.description", link: "/emergency-room" },
  ];

  const quickActions = [
    { labelKey: "dashboard.quickActions.registerPatient", href: "/patient-registration", icon: Users },
    { labelKey: "dashboard.quickActions.scheduleAppointment", href: "/appointments", icon: CalendarCheck },
    { labelKey: "dashboard.quickActions.getAiRecommendation", href: "/treatment-recommendation", icon: Briefcase },
    { labelKey: "dashboard.quickActions.manageWards", href: "/ward-management", icon: BedDouble },
    { labelKey: "dashboard.quickActions.labDashboard", href: "/laboratory-management", icon: Microscope },
    { labelKey: "dashboard.quickActions.maternityRecords", href: "/maternity-care", icon: Baby },
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
                  {user: "Ward A", action: "discharged patient: Charlie Davis.", time: "5 hours ago"},
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
               <Button variant="outline" className="mt-4 w-full">{t('dashboard.recentActivity.viewAll')}</Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
              <CardDescription>{t('dashboard.quickActions.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button key={action.href} asChild className="w-full justify-start text-left" variant={action.href === "/treatment-recommendation" ? "default" : "secondary"}>
                  <Link href={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {t(action.labelKey)}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

