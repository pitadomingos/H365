
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, BedDouble, Siren, Briefcase, Microscope, Baby, TrendingUp, HeartPulse, Pill as PillIcon, PieChart as PieChartIcon, BarChart3, Loader2, FileClock, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useLocale } from '@/context/locale-context';
import { getTranslator, type Locale, defaultLocale } from '@/lib/i18n';
import { PieChart, Pie, Cell, Legend as RechartsLegend, Tooltip as RechartsTooltip, ResponsiveContainer, Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface SummaryCardData {
  id: string;
  titleKey: string;
  value: string | string[];
  iconName: "TrendingUp" | "CalendarCheck" | "BedDouble" | "Siren" | "Users" | "HeartPulse" | "PillIcon" | "FileClock" | "Stethoscope";
  color: string;
  descriptionKey: string;
  link?: string;
}

interface QuickActionData {
  labelKey: string;
  href: string;
  iconName: "Users" | "CalendarCheck" | "Briefcase" | "BedDouble" | "Microscope" | "Baby";
}

interface RecentActivityItem {
  user: string;
  action: string;
  time: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface DailyAttendanceItem {
    day: string;
    patients: number;
    fill?: string;
}

interface DraftedConsultationItem {
  id: string;
  patientName: string;
  specialtyOrReason: string;
  lastSavedTime: string;
}

const ICONS_MAP: { [key: string]: React.ElementType } = {
  TrendingUp, CalendarCheck, BedDouble, Siren, Users, HeartPulse, PillIcon, Briefcase, Microscope, Baby, FileClock, Stethoscope
};


export default function DashboardPage() {
  const { currentLocale } = useLocale();
  const t = React.useMemo(() => getTranslator(currentLocale), [currentLocale]);

  const [summaryCardsData, setSummaryCardsData] = useState<SummaryCardData[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const [quickActionsData, setQuickActionsData] = useState<QuickActionData[]>([]);
  const [isLoadingQuickActions, setIsLoadingQuickActions] = useState(true);

  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const [patientEntryPointsData, setPatientEntryPointsData] = useState<ChartDataItem[]>([]);
  const [isLoadingEntryPoints, setIsLoadingEntryPoints] = useState(true);

  const [dailyAttendanceData, setDailyAttendanceData] = useState<DailyAttendanceItem[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);

  const [draftedConsultations, setDraftedConsultations] = useState<DraftedConsultationItem[]>([]);
  const [isLoadingDraftedConsultations, setIsLoadingDraftedConsultations] = useState(true);


  useEffect(() => {
    setIsLoadingSummary(true);
    setTimeout(() => {
      const fetchedSummary: SummaryCardData[] = [
        { id: "sc1", titleKey: "dashboard.card.totalPatients.title", value: "156", iconName: "TrendingUp", color: "text-green-500", descriptionKey: "dashboard.card.totalPatients.description", link: "#" },
        { id: "sc2", titleKey: "dashboard.card.appointments.title", value: "12", iconName: "CalendarCheck", color: "text-sky-500", descriptionKey: "dashboard.card.appointments.description", link: "/appointments" },
        { id: "sc3", titleKey: "dashboard.card.wardOccupancy.title", value: "75%", iconName: "BedDouble", color: "text-indigo-500", descriptionKey: "dashboard.card.wardOccupancy.description", link: "/ward-management" },
        { id: "sc4", titleKey: "dashboard.card.erStatus.title", value: "12 Active", iconName: "Siren", color: "text-red-500", descriptionKey: "dashboard.card.erStatus.description", link: "/emergency-room" },
        { id: "sc5", titleKey: "dashboard.card.newPatients.title", value: "5", iconName: "Users", color: "text-emerald-500", descriptionKey: "dashboard.card.newPatients.description", link: "/patient-registration" },
        { id: "sc6", titleKey: "dashboard.card.topDiagnostics.title", value: "Hypertension,Type 2 Diabetes,Influenza,Malaria,Pneumonia", iconName: "Stethoscope", color: "text-orange-500", descriptionKey: "dashboard.card.topDiagnostics.description", link: "#" },
        { id: "sc7", titleKey: "dashboard.card.prescribedDrug.title", value: "Paracetamol,Amoxicillin,Ibuprofen,Omeprazole,Salbutamol", iconName: "PillIcon", color: "text-purple-500", descriptionKey: "dashboard.card.prescribedDrug.description", link: "#" },
      ];
      setSummaryCardsData(fetchedSummary);
      setIsLoadingSummary(false);
    }, 1000);
  }, []); // Runs once on mount

  useEffect(() => {
    setIsLoadingQuickActions(true);
    setTimeout(() => {
        const fetchedQuickActions: QuickActionData[] = [
            { labelKey: "dashboard.quickActions.registerPatient", href: "/patient-registration", iconName: "Users" },
            { labelKey: "dashboard.quickActions.scheduleAppointment", href: "/appointments", iconName: "CalendarCheck" },
            { labelKey: "dashboard.quickActions.getAiRecommendation", href: "/treatment-recommendation", iconName: "Briefcase" },
            { labelKey: "dashboard.quickActions.manageWards", href: "/ward-management", iconName: "BedDouble" },
            { labelKey: "dashboard.quickActions.labDashboard", href: "/laboratory-management", iconName: "Microscope" },
            { labelKey: "dashboard.quickActions.maternityRecords", href: "/maternity-care", iconName: "Baby" },
        ];
        setQuickActionsData(fetchedQuickActions);
        setIsLoadingQuickActions(false);
    }, 800);
  }, []); // Runs once on mount

  useEffect(() => {
    setIsLoadingActivity(true);
    setTimeout(() => {
        const fetchedActivity: RecentActivityItem[] = [
            {user: "Dr. Smith", action: "updated patient chart for Alice Johnson.", time: "2 min ago"},
            {user: "Reception", action: "registered new patient: Bob Williams.", time: "15 min ago"},
            {user: "Lab", action: "uploaded results for patient ID #7890.", time: "1 hour ago"},
            {user: "Nurse Eva", action: "scheduled follow-up for Mike Brown.", time: "3 hours ago"},
            {user: "Ward A", action: "discharged patient: Charlie Davis.", time: "5 hours ago"},
        ];
        setRecentActivity(fetchedActivity);
        setIsLoadingActivity(false);
    }, 1200);
  }, []); // Runs once on mount

  useEffect(() => {
    setIsLoadingEntryPoints(true);
    const localT = getTranslator(currentLocale); // Get t specifically for this effect if needed for data
    setTimeout(() => {
        const fetchedEntryPoints: ChartDataItem[] = [
            { name: localT('dashboard.charts.entryPoints.outpatient'), value: 400, fill: "hsl(var(--chart-1))" },
            { name: localT('dashboard.charts.entryPoints.emergency'), value: 150, fill: "hsl(var(--chart-2))" },
            { name: localT('dashboard.charts.entryPoints.epidemic'), value: 25, fill: "hsl(var(--chart-3))" },
        ];
        setPatientEntryPointsData(fetchedEntryPoints);
        setIsLoadingEntryPoints(false);
    }, 1500);
  }, [currentLocale]); // Runs on mount and when currentLocale changes

  useEffect(() => {
    setIsLoadingAttendance(true);
    setTimeout(() => {
        const fetchedAttendanceData: DailyAttendanceItem[] = [
            { day: "Mon", patients: 120, fill: "hsl(var(--chart-4))" },
            { day: "Tue", patients: 155, fill: "hsl(var(--chart-4))" },
            { day: "Wed", patients: 130, fill: "hsl(var(--chart-4))" },
            { day: "Thu", patients: 160, fill: "hsl(var(--chart-4))" },
            { day: "Fri", patients: 140, fill: "hsl(var(--chart-4))" },
            { day: "Sat", patients: 90, fill: "hsl(var(--chart-4))" },
            { day: "Sun", patients: 75, fill: "hsl(var(--chart-4))" },
        ];
        setDailyAttendanceData(fetchedAttendanceData);
        setIsLoadingAttendance(false);
    }, 1600);
  }, []); // Runs once on mount

  useEffect(() => {
    setIsLoadingDraftedConsultations(true);
    setTimeout(() => {
      const fetchedDrafts: DraftedConsultationItem[] = [
        { id: "draft1", patientName: "Pending: John Doe", specialtyOrReason: "Awaiting Lab Results (Cardiology)", lastSavedTime: "2h ago" },
        { id: "draft2", patientName: "Pending: Jane Smith", specialtyOrReason: "Imaging Ordered (Neurology)", lastSavedTime: "Yesterday" },
        { id: "draft3", patientName: "Pending: Mike Brown", specialtyOrReason: "Follow-up Scheduled", lastSavedTime: "3 days ago" },
      ];
      setDraftedConsultations(fetchedDrafts);
      setIsLoadingDraftedConsultations(false);
    }, 1400);
  }, []); // Runs once on mount

  const chartConfig = useMemo(() => ({
    outpatient: { label: t('dashboard.charts.entryPoints.outpatient'), color: "hsl(var(--chart-1))" },
    emergency: { label: t('dashboard.charts.entryPoints.emergency'), color: "hsl(var(--chart-2))" },
    epidemic: { label: t('dashboard.charts.entryPoints.epidemic'), color: "hsl(var(--chart-3))" },
    patients: { label: t('dashboard.charts.dailyAttendance.patients'), color: "hsl(var(--chart-4))" },
  }), [t]) satisfies ChartConfig;


  return (
      <div className="flex flex-col gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcomeMessage')}</h1>
          <p className="text-muted-foreground">{t('dashboard.tagline')}</p>
        </div>

        {isLoadingSummary ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({length: 8}).map((_, index) => (
                    <Card key={`skl-sum-${index}`} className="shadow-sm">
                        <CardHeader className="pb-2"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/></CardHeader>
                        <CardContent><div className="h-5 w-3/4 bg-muted rounded animate-pulse"/><div className="h-3 w-1/2 bg-muted rounded mt-1 animate-pulse"/></CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {summaryCardsData.map((item) => {
                const Icon = ICONS_MAP[item.iconName];
                const isMultiListItemCard = item.id === "sc6" || item.id === "sc7";

                return (
                <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t(item.titleKey)}</CardTitle>
                    {Icon && <Icon className={`h-5 w-5 ${item.color}`} />}
                </CardHeader>
                <CardContent>
                    {isMultiListItemCard && typeof item.value === 'string' ? (
                       <ul className="text-sm font-semibold list-decimal list-inside space-y-0.5">
                          {(item.value as string).split(',').slice(0,5).map((entry, idx) => <li key={idx} className="text-xs">{entry.trim()}</li>)}
                        </ul>
                    ) : (
                      <div className="text-2xl font-bold">{Array.isArray(item.value) ? item.value.join(', ') : item.value}</div>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">{t(item.descriptionKey)}</p>
                    {item.link && item.link !== "#" && (
                    <Button variant="link" asChild className="px-0 pt-2 h-auto text-sm">
                        <Link href={item.link}>{t('dashboard.card.viewDetails')}</Link>
                    </Button>
                    )}
                </CardContent>
                </Card>
            )})}
             {/* Drafted Consultations Card */}
             <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('dashboard.card.draftedConsultations.title')}</CardTitle>
                  <FileClock className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  {isLoadingDraftedConsultations ? (
                     <div className="flex items-center justify-center py-3">
                        <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                        <span className="text-xs text-muted-foreground">{t('dashboard.loading')}</span>
                    </div>
                  ) : draftedConsultations.length > 0 ? (
                    <ul className="space-y-1.5 text-xs max-h-[100px] overflow-y-auto">
                      {draftedConsultations.slice(0,3).map(draft => (
                        <li key={draft.id}>
                          <p className="font-medium truncate">{draft.patientName}</p>
                          <p className="text-muted-foreground truncate text-[11px]">{draft.specialtyOrReason} - {draft.lastSavedTime}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">{t('dashboard.drafts.empty')}</p>
                  )}
                  <Button variant="link" asChild className="px-0 pt-2 h-auto text-sm">
                    <Link href="/treatment-recommendation">{t('dashboard.card.viewAllDrafts')}</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
        )}


        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity.title')}</CardTitle>
              <CardDescription>{t('dashboard.recentActivity.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="space-y-3">
                    {Array.from({length: 5}).map((_,index) => (
                        <div key={`skl-act-${index}`} className="flex items-start text-sm">
                            <Activity className="h-4 w-4 mr-3 mt-1 shrink-0 text-muted-foreground" />
                            <div>
                                <div className="h-4 w-20 bg-muted rounded animate-pulse mb-1"/>
                                <div className="h-3 w-40 bg-muted rounded animate-pulse"/>
                                <div className="h-2 w-12 bg-muted rounded animate-pulse mt-1"/>
                            </div>
                        </div>
                    ))}
                </div>
              ) : (
                <ul className="space-y-3">
                    {recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-start text-sm">
                        <Activity className="h-4 w-4 mr-3 mt-1 shrink-0 text-primary" />
                        <div>
                        <span className="font-medium">{activity.user}</span> {activity.action}
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </li>
                    ))}
                </ul>
              )}
               <Button variant="outline" className="mt-4 w-full" disabled={isLoadingActivity} asChild>
                  <Link href="/system-activity-log">{t('dashboard.recentActivity.viewAll')}</Link>
                </Button>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
              <CardDescription>{t('dashboard.quickActions.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {isLoadingQuickActions ? (
                Array.from({length: 6}).map((_, index) => (
                    <Button key={`skl-qa-${index}`} className="w-full justify-start text-left bg-muted hover:bg-muted animate-pulse" variant="secondary" disabled>
                        <div className="h-4 w-4 mr-2 bg-muted-foreground/30 rounded"/>
                        <div className="h-4 w-24 bg-muted-foreground/30 rounded"/>
                    </Button>
                ))
              ) : (
                quickActionsData.map((action) => {
                    const Icon = ICONS_MAP[action.iconName];
                    return(
                    <Button
                    key={action.href}
                    asChild
                    className="w-full justify-start text-left"
                    variant={action.href === "/treatment-recommendation" ? "default" : "secondary"}
                    >
                    <Link href={action.href}>
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        {t(action.labelKey)}
                    </Link>
                    </Button>
                )})
              )}
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
                    {isLoadingEntryPoints ? (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    ) : (
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
                                        {payload?.map((entry: any, index: number) => ( // Added index for key
                                        <div key={`item-${entry.value}-${index}`} className="flex items-center space-x-1"> {/* Added index to key */}
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
                    )}
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
                     {isLoadingAttendance ? (
                        <div className="flex items-center justify-center h-full">
                           <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={dailyAttendanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
                                            {payload?.map((entry: any, index: number) => ( // Added index for key
                                                <div key={`item-${entry.value}-${index}`} className="flex items-center space-x-1"> {/* Added index to key */}
                                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-xs text-muted-foreground">{entry.value}</span>
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                        />
                                    <Bar dataKey="patients" name={t('dashboard.charts.dailyAttendance.patients')} radius={[4, 4, 0, 0]}>
                                      {dailyAttendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill || "hsl(var(--chart-4))"} />
                                      ))}
                                    </Bar>
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
  );
}

    
