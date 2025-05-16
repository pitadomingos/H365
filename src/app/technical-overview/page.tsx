
"use client"; // Required for state and interactions

import React, { useState } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getTranslator, type Locale } from '@/lib/i18n';

export default function TechnicalOverviewPage() {
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const t = getTranslator(currentLocale);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Info className="h-8 w-8" /> {t('techOverview.pageTitle')}
          </h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="language-toggle" className={currentLocale === 'en' ? 'font-semibold text-primary' : 'text-muted-foreground'}>
              {t('techOverview.langToggle.en')}
            </Label>
            <Switch
              id="language-toggle"
              checked={currentLocale === 'pt'}
              onCheckedChange={(checked) => setCurrentLocale(checked ? 'pt' : 'en')}
              aria-label="Toggle language between English and Portuguese"
            />
            <Label htmlFor="language-toggle" className={currentLocale === 'pt' ? 'font-semibold text-primary' : 'text-muted-foreground'}>
              {t('techOverview.langToggle.pt')}
            </Label>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section1.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              {t('techOverview.section1.content')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section2.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li>{t('techOverview.section2.itemFrontend')}</li>
              <li>{t('techOverview.section2.itemUI')}</li>
              <li>{t('techOverview.section2.itemStyling')}</li>
              <li>{t('techOverview.section2.itemAI')}</li>
              <li>{t('techOverview.section2.itemState')}</li>
              <li>{t('techOverview.section2.itemDeployment')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section3.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionDashboard.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionDashboard.itemOverview')}</li>
                <li>{t('techOverview.section3.subsectionDashboard.itemSummaryCards')}</li>
                <li>{t('techOverview.section3.subsectionDashboard.itemQuickActions')}</li>
                <li>{t('techOverview.section3.subsectionDashboard.itemVisualAnalytics')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionPatientReg.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionPatientReg.itemIndividualBulk')}</li>
                <li>{t('techOverview.section3.subsectionPatientReg.itemPhotoCapture')}</li>
              </ul>
            </section>
             <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionVisitingPatients.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionVisitingPatients.itemSearchModal')}</li>
                <li>{t('techOverview.section3.subsectionVisitingPatients.itemVisitEntry')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionAppointments.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionAppointments.itemSchedulingListCalendar')}</li>
                <li>{t('techOverview.section3.subsectionAppointments.itemNotifications')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionConsultation.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionConsultation.itemLayout')}</li>
                <li>{t('techOverview.section3.subsectionConsultation.itemVitalsSymptomsAI')}</li>
                <li>{t('techOverview.section3.subsectionConsultation.itemOrders')}</li>
              </ul>
            </section>
             <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionSpecializations.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionSpecializations.itemTailoredConsult')}</li>
              </ul>
            </section>
             <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionMaternity.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionMaternity.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionWard.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionWard.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionLab.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionLab.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionImaging.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionImaging.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionPharmacy.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionPharmacy.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionER.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionER.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionEpidemic.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionEpidemic.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionCampaigns.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionCampaigns.itemFeatures')}</li>
              </ul>
            </section>
            <section>
              <h4 className="font-semibold">{t('techOverview.section3.subsectionReporting.title')}</h4>
              <ul>
                <li>{t('techOverview.section3.subsectionReporting.itemFeatures')}</li>
              </ul>
            </section>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section4.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li>{t('techOverview.section4.itemPrimaryColor')}</li>
              <li>{t('techOverview.section4.itemSecondaryColors')}</li>
              <li>{t('techOverview.section4.itemAccentColor')}</li>
              <li>{t('techOverview.section4.itemTypography')}</li>
              <li>{t('techOverview.section4.itemLayout')}</li>
              <li>{t('techOverview.section4.itemTheme')}</li>
              <li>{t('techOverview.section4.itemIcons')}</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section5.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul>
              <li>{t('techOverview.section5.itemBackend')}</li>
              <li>{t('techOverview.section5.itemRealtime')}</li>
              <li>{t('techOverview.section5.itemHL7FHIR')}</li>
              <li>{t('techOverview.section5.itemInstrumentIntegration')}</li>
              <li>{t('techOverview.section5.itemAdvancedReporting')}</li>
              <li>{t('techOverview.section5.itemCampaignManagement')}</li>
              <li>{t('techOverview.section5.itemSecurityCompliance')}</li>
              <li>{t('techOverview.section5.itemUserRoles')}</li>
              <li>{t('techOverview.section5.itemOffline')}</li>
              <li>{t('techOverview.section5.itemI18nFull')}</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}

    