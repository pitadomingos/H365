
"use client";

import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocale } from '@/context/locale-context';
import { getTranslator } from '@/lib/i18n'; // Ensure this import is present

export function LocaleToggle() {
  const { currentLocale, toggleLocale } = useLocale();
  const t = getTranslator(currentLocale); // Get the translator for the current locale

  return (
    <div className="flex items-center space-x-2">
      <Label 
        htmlFor="global-language-toggle" 
        className={currentLocale === 'en' ? 'font-semibold text-primary' : 'text-muted-foreground'}
      >
        {t('techOverview.langToggle.en')} {/* Use translator */}
      </Label>
      <Switch
        id="global-language-toggle"
        checked={currentLocale === 'pt'}
        onCheckedChange={toggleLocale}
        aria-label="Toggle language"
      />
      <Label 
        htmlFor="global-language-toggle" 
        className={currentLocale === 'pt' ? 'font-semibold text-primary' : 'text-muted-foreground'}
      >
        {t('techOverview.langToggle.pt')} {/* Use translator */}
      </Label>
    </div>
  );
}
