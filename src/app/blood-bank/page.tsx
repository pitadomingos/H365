
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";
import { getTranslator, type Locale } from '@/lib/i18n';
import { useLocale } from "@/context/locale-context";

export default function BloodBankPage() {
  const { currentLocale } = useLocale();
  const t = getTranslator(currentLocale);

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Droplets className="h-8 w-8" /> Blood Bank Management
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Module Overview</CardTitle>
            <CardDescription>Manages donor information, blood collection, inventory, and transfusions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('techOverview.section5.itemBloodBank.desc')}</p>
            <h3 className="mt-4 font-semibold text-lg">Potential Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
              <li>Donor registration and management.</li>
              <li>Blood collection and testing workflow.</li>
              <li>Inventory management (by blood type, product, expiry).</li>
              <li>Cross-matching and compatibility testing.</li>
              <li>Transfusion tracking and adverse reaction reporting.</li>
              <li>Stock level alerts and reporting.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}
