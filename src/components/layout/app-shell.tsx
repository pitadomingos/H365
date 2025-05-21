"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, type NavItem } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  // useSidebar hook might not be needed here if sidebar is always expanded
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleToggle } from "@/components/locale-toggle";
import { useLocale } from '@/context/locale-context';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentLocale } = useLocale(); // For passing key to children for re-render on locale change
  const currentYear = new Date().getFullYear();

  // No need for sidebar state management here if always expanded

  return (
    <>
      <Sidebar> {/* Sidebar will now be always expanded based on its internal styling */}
        <SidebarHeader>
          <div className="flex items-center justify-between w-full p-4"> {/* Fixed padding */}
            <Link
              href="/"
              className="flex items-center gap-2 overflow-hidden"
            >
              <Stethoscope className="h-7 w-7 text-primary shrink-0" />
              <h1 className="text-xl font-semibold whitespace-nowrap">H365</h1> {/* Always visible */}
            </Link>
            {/* Removed Menu toggle button as sidebar is always expanded */}
          </div>
        </SidebarHeader>
        <SidebarContent> {/* Fixed padding */}
          <SidebarMenu>
            {NAV_ITEMS.map((item: NavItem) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  // tooltip={item.label} // Tooltip less critical if always expanded
                  disabled={item.disabled}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                >
                  <Link href={item.href} aria-disabled={item.disabled} tabIndex={item.disabled ? -1 : undefined}>
                    <item.icon />
                    <span>{item.label}</span> {/* Label always visible */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter> {/* Fixed padding */}
           <SidebarMenu>
            {BOTTOM_NAV_ITEMS.map((item: NavItem) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  // tooltip={item.label}
                  disabled={item.disabled}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                >
                  <Link href={item.href} aria-disabled={item.disabled} tabIndex={item.disabled ? -1 : undefined}>
                    <item.icon />
                    <span>{item.label}</span> {/* Label always visible */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset> {/* SidebarInset will always have fixed margin based on expanded sidebar width */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex-1">
            {/* Breadcrumbs or page title can go here */}
          </div>
          <div className="flex items-center gap-4">
            <LocaleToggle />
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      doctor@h365.example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Profile</DropdownMenuItem>
                <DropdownMenuItem disabled>Billing</DropdownMenuItem>
                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-muted/40 dark:bg-transparent">
          {React.cloneElement(children as React.ReactElement, { key: currentLocale })}
        </main>
        <footer className="border-t bg-background p-4 text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} H365. All rights reserved.</p>
          <p>Version 0.1.0 (Prototype)</p>
        </footer>
      </SidebarInset>
    </>
  );
}
