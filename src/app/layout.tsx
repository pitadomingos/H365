
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from '@/context/locale-context';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'H365',
  description: 'Comprehensive Hospital Management System',
};

const SIDEBAR_WIDTH = "16rem"; 
// SIDEBAR_WIDTH_ICON is no longer needed if sidebar is always expanded
// const SIDEBAR_WIDTH_ICON = "3rem"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* SidebarProvider might only be needed for TooltipProvider if toggle logic is removed */}
            <SidebarProvider> 
              <div
                style={
                  {
                    "--sidebar-width": SIDEBAR_WIDTH,
                    // "--sidebar-width-icon": SIDEBAR_WIDTH_ICON, // No longer needed
                  } as React.CSSProperties
                }
                className={cn(
                  "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar"
                )}
              >
                <AppShell>{children}</AppShell>
              </div>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
