
"use client"; 

import React from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { useLocale } from '@/context/locale-context'; // Import useLocale
import { getTranslator, type Locale } from '@/lib/i18n';

export default function TechnicalOverviewPage() {
  const { currentLocale } = useLocale(); // Use global locale
  const t = getTranslator(currentLocale);

  const renderListItem = (titleKey: string, descKey: string) => (
    <li className="mb-3">
      <strong className="text-primary/90">{t(titleKey)}:</strong>
      <p className="text-base text-muted-foreground mt-0.5 ml-1">{t(descKey)}</p>
    </li>
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Info className="h-8 w-8" /> {t('techOverview.pageTitle')}
          </h1>
          {/* Global toggle is now in the header, so local toggle can be removed if desired */}
          {/* If you want to keep a local toggle just for this page for some reason, it would need its own state */}
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section1.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p className="text-base">
              {t('techOverview.section1.content')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section2.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul className="list-none p-0">
              {renderListItem('techOverview.section2.itemFrontend', 'techOverview.section2.itemFrontend.desc')}
              {renderListItem('techOverview.section2.itemUI', 'techOverview.section2.itemUI.desc')}
              {renderListItem('techOverview.section2.itemStyling', 'techOverview.section2.itemStyling.desc')}
              {renderListItem('techOverview.section2.itemAI', 'techOverview.section2.itemAI.desc')}
              {renderListItem('techOverview.section2.itemState', 'techOverview.section2.itemState.desc')}
              {renderListItem('techOverview.section2.itemDeployment', 'techOverview.section2.itemDeployment.desc')}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section3.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-4">
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionDashboard.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionDashboard.itemOverview', 'techOverview.section3.subsectionDashboard.itemOverview.desc')}
                {renderListItem('techOverview.section3.subsectionDashboard.itemSummaryCards', 'techOverview.section3.subsectionDashboard.itemSummaryCards.desc')}
                {renderListItem('techOverview.section3.subsectionDashboard.itemQuickActions', 'techOverview.section3.subsectionDashboard.itemQuickActions.desc')}
                {renderListItem('techOverview.section3.subsectionDashboard.itemVisualAnalytics', 'techOverview.section3.subsectionDashboard.itemVisualAnalytics.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionPatientReg.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionPatientReg.itemIndividualBulk', 'techOverview.section3.subsectionPatientReg.itemIndividualBulk.desc')}
                {renderListItem('techOverview.section3.subsectionPatientReg.itemPhotoCapture', 'techOverview.section3.subsectionPatientReg.itemPhotoCapture.desc')}
              </ul>
            </section>
             <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionVisitingPatients.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionVisitingPatients.itemSearchModal', 'techOverview.section3.subsectionVisitingPatients.itemSearchModal.desc')}
                {renderListItem('techOverview.section3.subsectionVisitingPatients.itemVisitEntry', 'techOverview.section3.subsectionVisitingPatients.itemVisitEntry.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionAppointments.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionAppointments.itemSchedulingListCalendar', 'techOverview.section3.subsectionAppointments.itemSchedulingListCalendar.desc')}
                {renderListItem('techOverview.section3.subsectionAppointments.itemNotifications', 'techOverview.section3.subsectionAppointments.itemNotifications.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionConsultation.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionConsultation.itemLayout', 'techOverview.section3.subsectionConsultation.itemLayout.desc')}
                {renderListItem('techOverview.section3.subsectionConsultation.itemVitalsSymptomsAI', 'techOverview.section3.subsectionConsultation.itemVitalsSymptomsAI.desc')}
                {renderListItem('techOverview.section3.subsectionConsultation.itemOrders', 'techOverview.section3.subsectionConsultation.itemOrders.desc')}
              </ul>
            </section>
             <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionSpecializations.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionSpecializations.itemTailoredConsult', 'techOverview.section3.subsectionSpecializations.itemTailoredConsult.desc')}
              </ul>
            </section>
             <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionMaternity.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionMaternity.itemFeatures', 'techOverview.section3.subsectionMaternity.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionWard.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionWard.itemFeatures', 'techOverview.section3.subsectionWard.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionLab.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionLab.itemFeatures', 'techOverview.section3.subsectionLab.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionImaging.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionImaging.itemFeatures', 'techOverview.section3.subsectionImaging.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionPharmacy.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionPharmacy.itemFeatures', 'techOverview.section3.subsectionPharmacy.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionER.title')}</h4>
              <ul className="list-none p-0">
                 {renderListItem('techOverview.section3.subsectionER.itemFeatures', 'techOverview.section3.subsectionER.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionEpidemic.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionEpidemic.itemFeatures', 'techOverview.section3.subsectionEpidemic.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionCampaigns.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionCampaigns.itemFeatures', 'techOverview.section3.subsectionCampaigns.itemFeatures.desc')}
              </ul>
            </section>
            <section>
              <h4 className="font-semibold text-lg">{t('techOverview.section3.subsectionReporting.title')}</h4>
              <ul className="list-none p-0">
                {renderListItem('techOverview.section3.subsectionReporting.itemFeatures', 'techOverview.section3.subsectionReporting.itemFeatures.desc')}
              </ul>
            </section>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section4.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul className="list-none p-0">
              {renderListItem('techOverview.section4.itemPrimaryColor', 'techOverview.section4.itemPrimaryColor.desc')}
              {renderListItem('techOverview.section4.itemSecondaryColors', 'techOverview.section4.itemSecondaryColors.desc')}
              {renderListItem('techOverview.section4.itemAccentColor', 'techOverview.section4.itemAccentColor.desc')}
              {renderListItem('techOverview.section4.itemTypography', 'techOverview.section4.itemTypography.desc')}
              {renderListItem('techOverview.section4.itemLayout', 'techOverview.section4.itemLayout.desc')}
              {renderListItem('techOverview.section4.itemTheme', 'techOverview.section4.itemTheme.desc')}
              {renderListItem('techOverview.section4.itemIcons', 'techOverview.section4.itemIcons.desc')}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('techOverview.section5.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul className="list-none p-0">
              {renderListItem('techOverview.section5.itemBackend', 'techOverview.section5.itemBackend.desc')}
              {renderListItem('techOverview.section5.itemRealtime', 'techOverview.section5.itemRealtime.desc')}
              {renderListItem('techOverview.section5.itemHL7FHIR', 'techOverview.section5.itemHL7FHIR.desc')}
              {renderListItem('techOverview.section5.itemInstrumentIntegration', 'techOverview.section5.itemInstrumentIntegration.desc')}
              {renderListItem('techOverview.section5.itemBiomedicalEngineering', 'techOverview.section5.itemBiomedicalEngineering.desc')}
              {renderListItem('techOverview.section5.itemAdvancedReporting', 'techOverview.section5.itemAdvancedReporting.desc')}
              {renderListItem('techOverview.section5.itemCampaignManagement', 'techOverview.section5.itemCampaignManagement.desc')}
              {renderListItem('techOverview.section5.itemWarehouseManagement', 'techOverview.section5.itemWarehouseManagement.desc')}
              {renderListItem('techOverview.section5.itemSecurityCompliance', 'techOverview.section5.itemSecurityCompliance.desc')}
              {renderListItem('techOverview.section5.itemUserRoles', 'techOverview.section5.itemUserRoles.desc')}
              {renderListItem('techOverview.section5.itemOffline', 'techOverview.section5.itemOffline.desc')}
              {renderListItem('techOverview.section5.itemI18nFull', 'techOverview.section5.itemI18nFull.desc')}
              {renderListItem('techOverview.section5.itemPatientPortal', 'techOverview.section5.itemPatientPortal.desc')}
              {renderListItem('techOverview.section5.itemMedicationAdherence', 'techOverview.section5.itemMedicationAdherence.desc')}
              {renderListItem('techOverview.section5.itemBilling', 'techOverview.section5.itemBilling.desc')}
              {renderListItem('techOverview.section5.itemTelemedicine', 'techOverview.section5.itemTelemedicine.desc')}
              {renderListItem('techOverview.section5.itemAdvancedAnalyticsBI', 'techOverview.section5.itemAdvancedAnalyticsBI.desc')}
              {renderListItem('techOverview.section5.itemBloodBank', 'techOverview.section5.itemBloodBank.desc')}
            </ul>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
