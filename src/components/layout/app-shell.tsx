
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocaleProvider } from "@/context/locale-context"; // Import LocaleProvider
import { LocaleToggle } from "@/components/locale-toggle"; // Import LocaleToggle

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <LocaleProvider> {/* Wrap with LocaleProvider */}
      <SidebarProvider defaultOpen>
        <AppShellInternal pathname={pathname}>
          {children}
        </AppShellInternal>
      </SidebarProvider>
    </LocaleProvider>
  );
}

function AppShellInternal({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const { toggleSidebar, isMobile } = useSidebar();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2">
              <Stethoscope className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">H365</h1>
            </Link>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-7 w-7 group-data-[collapsible=icon]:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 p-2">
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label} // For icon-only mode, label is used as tooltip
                  disabled={item.disabled}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                >
                  <Link href={item.href} aria-disabled={item.disabled} tabIndex={item.disabled ? -1 : undefined}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarMenu>
            {BOTTOM_NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  disabled={item.disabled}
                  className={cn(item.disabled && "cursor-not-allowed opacity-50")}
                >
                  <Link href={item.href} aria-disabled={item.disabled} tabIndex={item.disabled ? -1 : undefined}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Breadcrumbs or page title can go here */}
          </div>
          <div className="flex items-center gap-4">
            <LocaleToggle /> {/* Add LocaleToggle here */}
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
          {children}
        </main>
        <footer className="border-t bg-background p-4 text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} H365. All rights reserved.</p>
          <p>Version 0.1.0 (Prototype)</p>
        </footer>
      </SidebarInset>
    </>
  );
}
