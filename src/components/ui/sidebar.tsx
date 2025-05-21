
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Removed useIsMobile as sidebar is always desktop style

// --- Context Setup ---
type SidebarContextValue = {
  // open: boolean; // No longer needed for always expanded
  // toggleSidebar: () => void; // No longer needed
  // state: "expanded"; // Always expanded
  // collapsible: "icon" | "none"; // Still relevant for icon display
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    // This error shouldn't be thrown if SidebarProvider is correctly used in layout
    // For always expanded, context might be simpler or even not strictly necessary for consumers
    // if they don't need to toggle or check state.
    // However, keeping the provider structure for TooltipProvider.
    return { state: "expanded", collapsible: "icon" } as const; // Provide default for safety
  }
  return context;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  // defaultOpen, collapsible props are no longer needed as sidebar is always expanded
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const contextValue = React.useMemo(
    () => ({
      // open: true, // Always true
      // state: "expanded" as const,
      // collapsible: "icon" as const, // Assuming icon style is desired for elements even if not collapsing
      // toggleSidebar: () => {}, // No-op
    }),
    []
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
};
SidebarProvider.displayName = "SidebarProvider";

// --- Sidebar Component ---
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
  }
>(({ side = "left", className, children, ...props }, ref) => {
  // Since it's always expanded
  const currentWidthClass = "w-[var(--sidebar-width)]";

  return (
    <div
      ref={ref}
      className={cn(
        "group peer hidden md:block text-sidebar-foreground", // Always block on md+
        className
      )}
      data-state="expanded" // Always expanded
      data-collapsible="icon" // For styling child text elements
      {...props}
    >
      {/* Sizer div - for layout pushing */}
      <div
        className={cn(
          "relative h-svh bg-transparent", // No transition needed
          currentWidthClass
        )}
      />
      {/* Actual sidebar content container */}
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh md:flex", // No transition needed
          side === "left" ? "left-0 border-r border-sidebar-border" : "right-0 border-l border-sidebar-border",
          currentWidthClass
        )}
      >
        <div
          data-sidebar="sidebar-inner-content"
          className={cn("flex h-full w-full flex-col bg-sidebar")}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

// --- SidebarInset Component ---
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background", // Removed margin transition classes
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";


// --- SidebarHeader Component ---
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex flex-col transition-all duration-200",
        "p-4", // Always use expanded padding
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarHeader.displayName = "SidebarHeader";

// --- SidebarFooter Component ---
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-2 transition-all duration-200",
        "p-2", // Always use expanded padding
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarFooter.displayName = "SidebarFooter";

// --- SidebarContent Component ---
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden transition-all duration-200",
        "p-2", // Always use expanded padding
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarContent.displayName = "SidebarContent";

// --- SidebarMenu Component ---
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

// --- SidebarMenuItem Component ---
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

// --- SidebarMenuButton Component ---
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ReactNode; // Tooltip less relevant if always expanded but kept for consistency
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip, // Not used if always expanded
  className,
  children,
  ...props
}, ref) => {

  const Comp = asChild ? Slot : "button";

  const buttonContent = (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        // No icon-only classes needed
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );

  return buttonContent;
});
SidebarMenuButton.displayName = "SidebarMenuButton";

// Exporting only necessary components for a fixed, always expanded sidebar
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider, // Still needed for TooltipProvider
  useSidebar, // Might be vestigial, returning static "expanded" state
};
