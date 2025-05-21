
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./button"; // Assuming Button is used somewhere or for type consistency

// --- Context Setup ---
type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  isMobile: boolean;
  state: "expanded" | "collapsed";
  collapsible: "icon" | "none"; // Simplified from previous "offcanvas"
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: "icon" | "none"; // Simplified
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen: propDefaultOpen = true, // Default to true (expanded)
  collapsible: propCollapsible = "icon",
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(propDefaultOpen);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && propCollapsible === "icon") {
      const storedState = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sidebar-open="))
        ?.split("=")[1];
      if (storedState) {
        setOpen(storedState === "true");
      } else {
        setOpen(propDefaultOpen); // Fallback to prop if no cookie
      }
    }
  }, [isMounted, propCollapsible, propDefaultOpen]);

  const toggleSidebar = React.useCallback(() => {
    setOpen((prevOpen) => {
      const newOpenState = !prevOpen;
      if (propCollapsible === "icon" && isMounted) {
        document.cookie = `sidebar-open=${newOpenState}; path=/; max-age=31536000`; // Expires in 1 year
      }
      return newOpenState;
    });
  }, [propCollapsible, isMounted]);

  const state = open ? "expanded" : "collapsed";
  const effectiveCollapsible = isMobile ? "none" : propCollapsible; // No icon collapse on mobile

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar,
      isMobile,
      state,
      collapsible: effectiveCollapsible,
    }),
    [open, setOpen, toggleSidebar, isMobile, state, effectiveCollapsible]
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
    variant?: "sidebar" | "floating" | "inset"; // Kept for potential future use, but logic simplified
  }
>(({ side = "left", variant = "sidebar", className, children, ...props }, ref) => {
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  const currentWidthClass =
    state === "expanded"
      ? "w-[var(--sidebar-width)]"
      : isIconOnlyCollapsed
      ? "w-[var(--sidebar-width-icon)]"
      : "w-0"; // Should not happen with current logic (mobile removed)

  return (
    <div
      ref={ref}
      className={cn(
        "group peer hidden md:block text-sidebar-foreground",
        className
      )}
      data-state={state}
      data-collapsible={collapsible === "icon" ? "icon" : ""}
      {...props}
    >
      {/* Sizer div - for layout pushing */}
      <div
        className={cn(
          "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
          currentWidthClass
        )}
      />
      {/* Actual sidebar content container */}
      <div
        className={cn(
          "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
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
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  const marginLeftClass = 
    state === "expanded"
      ? "md:ml-[var(--sidebar-width)]"
      : isIconOnlyCollapsed
      ? "md:ml-[var(--sidebar-width-icon)]"
      : "md:ml-0"; // Should not happen

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin-left] duration-200 ease-linear",
        marginLeftClass,
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
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "flex flex-col transition-all duration-200",
        isIconOnlyCollapsed ? "p-2 h-[64px] items-center" : "p-4", // Adjusted padding for collapsed
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
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-2 transition-all duration-200",
        isIconOnlyCollapsed ? "p-2 items-center" : "p-2",
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
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden transition-all duration-200",
        isIconOnlyCollapsed ? "p-2 items-center" : "p-2",
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
    tooltip?: string | React.ReactNode;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  children,
  ...props
}, ref) => {
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  const Comp = asChild ? Slot : "button";

  const buttonContent = (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isIconOnlyCollapsed && "!size-8 !p-2 justify-center", // Icon only styling
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );

  if (isIconOnlyCollapsed && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger> {/* REMOVED asChild here */}
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
};
