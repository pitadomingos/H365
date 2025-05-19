
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { getTranslator, type Locale } from '@/lib/i18n';
import { useLocale } from "@/context/locale-context";


export default function BillingPage() {
  const { currentLocale } = useLocale();
  const t = getTranslator(currentLocale);

  return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-8 w-8" /> Billing & Financial Management
          </h1>
        </div>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Module Overview</CardTitle>
            <CardDescription>Handles patient billing, payments, insurance claims, and financial reporting.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('techOverview.section5.itemBilling.desc')}</p>
            
            <h3 className="mt-4 font-semibold text-lg">Potential Features:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 text-sm">
              <li>Patient invoice generation.</li>
              <li>Payment processing (cash, card, mobile money, insurance).</li>
              <li>Insurance claim management and tracking.</li>
              <li>Accounts receivable management.</li>
              <li>Tariff and service code management.</li>
              <li>Financial reporting and analytics.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}
