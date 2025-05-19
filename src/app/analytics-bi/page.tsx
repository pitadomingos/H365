
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { getTranslator, type Locale } from '@/lib/i18n';
import { useLocale } from "@/context/locale-context";


export default function AnalyticsBIPage() {
  const { currentLocale } = useLocale();
  const t = getTranslator(currentLocale);

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-8 w-8" /> Advanced Analytics & BI
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Module Overview</CardTitle>
            <CardDescription>Provides tools for in-depth data analysis, customizable dashboards, and predictive analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('techOverview.section5.itemAdvancedAnalyticsBI.desc')}</p>
             <h3 className="mt-4 font-semibold text-lg">Potential Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
              <li>Customizable management dashboards.</li>
              <li>Predictive analytics for patient load and resource needs.</li>
              <li>Public health trend identification.</li>
              <li>Operational efficiency analysis.</li>
              <li>Integration with external BI tools.</li>
              <li>Data warehousing capabilities.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}
