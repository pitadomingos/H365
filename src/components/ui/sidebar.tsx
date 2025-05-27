
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

// --- Context Setup ---
interface SidebarContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
  collapsible: "icon" | "none"; // Simplified, "offcanvas" was for mobile sheet
}

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
  collapsible?: "icon" | "none";
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen = true,
  collapsible: propCollapsible = "icon",
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cookie logic removed for simplicity in this iteration, focusing on core toggle
  // If you need cookie persistence, ensure it's handled robustly client-side

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      isMobile: false, // Always false as per simplification
      toggleSidebar,
      state: open ? "expanded" : "collapsed",
      collapsible: propCollapsible,
    }),
    [open, toggleSidebar, propCollapsible]
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
  const { state, collapsible } = useSidebar(); // No longer uses isMobile here

  const currentWidthClass =
    state === "expanded"
      ? "w-[var(--sidebar-width)]"
      : "w-[var(--sidebar-width-icon)]"; // Assumes collapsible="icon"

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
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        // Removed dynamic padding based on peer state, relying on flexbox
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
        "flex flex-col", // Default padding is now managed by its parent in AppShell
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
        "flex flex-col gap-2", // Default padding is now managed by its parent in AppShell
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
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden", // Default padding is now managed by its parent in AppShell
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
    isActive?: boolean;
    asChild?: boolean;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({
  isActive = false,
  variant = "default",
  size = "default",
  className,
  children,
  asChild: asChildProp, // Renamed to avoid conflict with internal variable if any
  ...props
}, ref) => {
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  const Comp = asChildProp ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ variant, size }),
        isIconOnlyCollapsed && "!size-8 !p-2 justify-center", // For icon-only sizing
        className
      )}
      {...props} // asChildProp is NOT spread here
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'span') {
          return React.cloneElement(child as React.ReactElement<any>, {
            className: cn(
              child.props.className,
              isIconOnlyCollapsed && "hidden"
            ),
          });
        }
        return child;
      })}
    </Comp>
  );
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
