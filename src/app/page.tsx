
"use client"; // Required for charts and client-side interactions

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, BedDouble, Siren, Briefcase, Microscope, Baby, TrendingUp, HeartPulse, Pill as PillIcon, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getTranslator, type Locale } from '@/lib/i18n';
import { PieChart, Pie, Cell, Legend as RechartsLegend, Tooltip as RechartsTooltip, ResponsiveContainer, Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export default function DashboardPage() {
  const currentLocale: Locale = 'en'; 
  const t = getTranslator(currentLocale);

  const summaryCards = [
    { titleKey: "dashboard.card.totalPatients.title", value: "156", icon: TrendingUp, color: "text-green-500", descriptionKey: "dashboard.card.totalPatients.description", link: "#" },
    { titleKey: "dashboard.card.appointments.title", value: "12", icon: CalendarCheck, color: "text-sky-500", descriptionKey: "dashboard.card.appointments.description", link: "/appointments" },
    { titleKey: "dashboard.card.wardOccupancy.title", value: "75%", icon: BedDouble, color: "text-indigo-500", descriptionKey: "dashboard.card.wardOccupancy.description", link: "/ward-management" },
    { titleKey: "dashboard.card.erStatus.title", value: "12 Active", icon: Siren, color: "text-red-500", descriptionKey: "dashboard.card.erStatus.description", link: "/emergency-room" },
    { titleKey: "dashboard.card.newPatients.title", value: "5", icon: Users, color: "text-emerald-500", descriptionKey: "dashboard.card.newPatients.description", link: "/patient-registration" },
    { titleKey: "dashboard.card.commonCondition.title", value: "Flu", icon: HeartPulse, color: "text-orange-500", descriptionKey: "dashboard.card.commonCondition.description", link: "#" },
    { titleKey: "dashboard.card.prescribedDrug.title", value: "Paracetamol", icon: PillIcon, color: "text-purple-500", descriptionKey: "dashboard.card.prescribedDrug.description", link: "#" },
  ];

  const quickActions = [
    { labelKey: "dashboard.quickActions.registerPatient", href: "/patient-registration", icon: Users },
    { labelKey: "dashboard.quickActions.scheduleAppointment", href: "/appointments", icon: CalendarCheck },
    { labelKey: "dashboard.quickActions.getAiRecommendation", href: "/treatment-recommendation", icon: Briefcase },
    { labelKey: "dashboard.quickActions.manageWards", href: "/ward-management", icon: BedDouble },
    { labelKey: "dashboard.quickActions.labDashboard", href: "/laboratory-management", icon: Microscope },
    { labelKey: "dashboard.quickActions.maternityRecords", href: "/maternity-care", icon: Baby },
  ];

  const patientEntryPointsData = [
    { name: t('dashboard.charts.entryPoints.outpatient'), value: 400, fill: "hsl(var(--chart-1))" },
    { name: t('dashboard.charts.entryPoints.emergency'), value: 150, fill: "hsl(var(--chart-2))" },
    { name: t('dashboard.charts.entryPoints.epidemic'), value: 25, fill: "hsl(var(--chart-3))" },
  ];

  const dailyAttendanceData = [
    { day: "Mon", patients: 120, fill: "hsl(var(--chart-4))" },
    { day: "Tue", patients: 155, fill: "hsl(var(--chart-4))" },
    { day: "Wed", patients: 130, fill: "hsl(var(--chart-4))" },
    { day: "Thu", patients: 160, fill: "hsl(var(--chart-4))" },
    { day: "Fri", patients: 140, fill: "hsl(var(--chart-4))" },
    { day: "Sat", patients: 90, fill: "hsl(var(--chart-4))" },
    { day: "Sun", patients: 75, fill: "hsl(var(--chart-4))" },
  ];

  const chartConfig = {
    outpatient: { label: t('dashboard.charts.entryPoints.outpatient'), color: "hsl(var(--chart-1))" },
    emergency: { label: t('dashboard.charts.entryPoints.emergency'), color: "hsl(var(--chart-2))" },
    epidemic: { label: t('dashboard.charts.entryPoints.epidemic'), color: "hsl(var(--chart-3))" },
    patients: { label: t('dashboard.charts.dailyAttendance.patients'), color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcomeMessage')}</h1>
          <p className="text-muted-foreground">{t('dashboard.tagline')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {summaryCards.slice(0,4).map((item) => ( 
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
        
        <div className="grid gap-4 md:grid-cols-3">
         {summaryCards.slice(4).map((item) => ( 
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
                <Button 
                  key={action.href} 
                  asChild 
                  className="w-full justify-start text-left" 
                  variant={action.href === "/treatment-recommendation" ? "default" : "secondary"}
                >
                  <Link href={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {t(action.labelKey)}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-6 w-6 text-primary" /> {t('dashboard.charts.entryPoints.title')}
                    </CardTitle>
                    <CardDescription>{t('dashboard.charts.entryPoints.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <ChartContainer config={chartConfig} className="w-full max-w-md aspect-square">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart accessibilityLayer>
                            <RechartsTooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie
                                data={patientEntryPointsData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {patientEntryPointsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <RechartsLegend content={({ payload }) => {
                                return (
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    {payload?.map((entry: any) => (
                                    <div key={`item-${entry.value}`} className="flex items-center space-x-1">
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <span className="text-xs text-muted-foreground">{entry.payload.name}</span>
                                    </div>
                                    ))}
                                </div>
                                )
                            }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-primary" /> {t('dashboard.charts.dailyAttendance.title')}
                    </CardTitle>
                    <CardDescription>{t('dashboard.charts.dailyAttendance.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyAttendanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                                />
                                <RechartsLegend
                                    content={({ payload }) => (
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                        {payload?.map((entry: any) => (
                                            <div key={`item-${entry.value}`} className="flex items-center space-x-1">
                                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-xs text-muted-foreground">{entry.value}</span>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    />
                                <Bar dataKey="patients" name={t('dashboard.charts.dailyAttendance.patients')} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>

      </div>
    </AppShell>
  );
}

