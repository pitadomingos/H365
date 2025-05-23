
"use client";

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocale } from '@/context/locale-context';
import { getTranslator } from '@/lib/i18n';

export function LocaleToggle() {
  const { currentLocale, toggleLocale } = useLocale();
  const t = getTranslator(currentLocale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or null on the server and initial client render to avoid hydration mismatch
    // For a small component like this, null is often fine.
    // Alternatively, render a static placeholder:
    // return <div style={{ height: '24px', width: '80px' }} />; // Example placeholder
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Label
        htmlFor="global-language-toggle"
        className={currentLocale === 'en' ? 'font-semibold text-primary' : 'text-muted-foreground'}
      >
        {t('techOverview.langToggle.en')}
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
        {t('techOverview.langToggle.pt')}
      </Label>
    </div>
  );
}
