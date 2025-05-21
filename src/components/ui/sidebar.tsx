"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Sidebar context is simplified as the sidebar is always expanded.
// It might only be needed if other components still expect a provider structure.
export interface SidebarContextValue {
  // No dynamic state needed for a permanently expanded sidebar
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  // if (!context) { // This check might be too strict if the context becomes very minimal
  //   throw new Error("useSidebar must be used within a SidebarProvider.");
  // }
  return context || {}; // Return an empty object or a minimal static context
}

export interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  // No state management needed for open/collapsed state anymore
  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({}),
    []
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
};
SidebarProvider.displayName = "SidebarProvider";


const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sidebarWidth = "var(--sidebar-width)"; // Always expanded

    return (
      <div
        ref={ref}
        className={cn(
          "group peer hidden md:block text-sidebar-foreground", // 'group' might no longer be needed for state
          className
        )}
        data-variant={variant}
        data-side={side}
        {...props}
      >
        {/* Sizer div - for layout pushing */}
        <div
          className={cn(
            "relative h-svh bg-transparent", // Removed transition and dynamic width
            `w-[${sidebarWidth}]`
          )}
        />
        {/* Actual sidebar content container */}
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh md:flex", // Removed transition and dynamic width
            side === "left" ? "left-0" : "right-0",
            `w-[${sidebarWidth}]`,
            (variant === "floating" || variant === "inset") && "p-2",
            (variant !== "floating" && variant !== "inset") && (side === "left" ? "border-r border-sidebar-border" : "border-l border-sidebar-border")
          )}
        >
          <div
            data-sidebar="sidebar-inner-content"
            className={cn(
                "flex h-full w-full flex-col bg-sidebar",
                (variant === "floating" || variant === "inset") && "rounded-lg border border-sidebar-border shadow"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const sidebarWidth = "var(--sidebar-width)"; // Always expanded width

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        `md:ml-[${sidebarWidth}]`, // Always apply margin for expanded sidebar
        // Inset variant specific styling
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]",
        "md:peer-data-[variant=inset]:m-2",
        "md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"


const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col p-4", className)} // Use fixed padding
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)} // Use fixed padding
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2", className)} // Use fixed padding
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"


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
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)} // 'group/menu-item' might no longer be needed
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

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
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent> // Tooltip might not be needed if always expanded
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip, // Not used if always expanded
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    // No need to check for collapsed state if always expanded

    const buttonContent = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          // No collapsed styling needed
          className
        )}
        {...props}
      >
        {children} {/* All children, including text span, will be visible */}
      </Comp>
    );

    return buttonContent;
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider, // Still provide for TooltipProvider
  useSidebar,      // Still export, might be used for other things or future re-introduction
}
