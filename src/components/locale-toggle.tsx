
"use client";

import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocale } from '@/context/locale-context';
import { getTranslator } from '@/lib/i18n'; // To translate the toggle labels themselves

export function LocaleToggle() {
  const { currentLocale, toggleLocale } = useLocale();
  const t = getTranslator(currentLocale); // Get translator based on current global locale

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="global-language-toggle" className={currentLocale === 'en' ? 'font-semibold text-primary' : 'text-muted-foreground'}>
        {t('techOverview.langToggle.en')}
      </Label>
      <Switch
        id="global-language-toggle"
        checked={currentLocale === 'pt'}
        onCheckedChange={toggleLocale}
        aria-label="Toggle language"
      />
      <Label htmlFor="global-language-toggle" className={currentLocale === 'pt' ? 'font-semibold text-primary' : 'text-muted-foreground'}>
        {t('techOverview.langToggle.pt')}
      </Label>
    </div>
  );
}
