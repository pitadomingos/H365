
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

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SidebarContextValue {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((prevState: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  collapsible: "icon" | "none";
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  defaultOpen: propDefaultOpen = true,
  collapsible: propCollapsible = "icon",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}) => {
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const [_internalOpen, _setInternalOpen] = React.useState(propDefaultOpen);

  React.useEffect(() => {
    if (!isControlled && typeof window !== 'undefined') {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
        ?.split("=")[1];
      if (cookieValue !== undefined) {
        _setInternalOpen(cookieValue === "true");
      } else {
         _setInternalOpen(propDefaultOpen);
      }
    }
  }, [isControlled, propDefaultOpen]);

  const open = isControlled ? controlledOpen : _internalOpen;

  const setOpen = React.useCallback(
    (value: boolean | ((prevState: boolean) => boolean)) => {
      const newOpenState = typeof value === 'function' ? value(open) : value;
      if (isControlled) {
        setControlledOpen(newOpenState);
      } else {
        _setInternalOpen(newOpenState);
        if (typeof window !== 'undefined') {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpenState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      }
    },
    [isControlled, open, setControlledOpen]
  );

  const toggleSidebar = React.useCallback(() => {
    setOpen((current) => !current);
  }, [setOpen]);

  const state = open ? "expanded" : "collapsed";
  const effectiveCollapsible = propCollapsible; // Since mobile is removed, this is always the desktop mode

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
      collapsible: effectiveCollapsible,
    }),
    [state, open, setOpen, toggleSidebar, effectiveCollapsible]
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
    variant?: "sidebar" | "floating" | "inset" // Inset and floating are more for styling the box
  }
>(
  (
    {
      side = "left", // Default to left
      variant = "sidebar", // Default to standard sidebar variant
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, collapsible } = useSidebar();
    const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

    // Determine width classes directly based on state
    const currentWidthClass =
      state === "expanded"
        ? "w-[var(--sidebar-width)]"
        : "w-[var(--sidebar-width-icon)]";

    return (
      <div
        ref={ref}
        className={cn(
          "group peer hidden md:block text-sidebar-foreground",
          className
        )}
        data-state={state}
        data-collapsible={collapsible === "icon" ? "icon" : "none"}
        data-variant={variant}
        data-side={side}
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
            side === "left" ? "left-0" : "right-0",
            currentWidthClass,
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
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background transition-[margin-left,margin-right] duration-200 ease-linear",
        "md:peer-data-[side=left]:" + (isIconOnlyCollapsed ? "ml-[var(--sidebar-width-icon)]" : "ml-[var(--sidebar-width)]"),
        "md:peer-data-[side=right]:" + (isIconOnlyCollapsed ? "mr-[var(--sidebar-width-icon)]" : "mr-[var(--sidebar-width)]"),
        // Inset variant specific styling (remove margin for inset, add it for others)
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
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex flex-col gap-2",
        isIconOnlyCollapsed ? "p-2 items-center" : "p-2",
        className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state, collapsible } = useSidebar();
  const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        isIconOnlyCollapsed ? "p-2" : "p-2",
        className
      )}
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
    className={cn("group/menu-item relative", className)}
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
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { state, collapsible } = useSidebar();
    const isIconOnlyCollapsed = state === "collapsed" && collapsible === "icon";

    const buttonContent = (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          isIconOnlyCollapsed && "!size-8 !p-2 justify-center",
          className
        )}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === 'span') {
            return React.cloneElement(child as React.ReactElement<any>, {
              className: cn(
                (child.props as any).className,
                isIconOnlyCollapsed && "hidden"
              )
            });
          }
          return child;
        })}
      </Comp>
    );

    if (!tooltip || !isIconOnlyCollapsed) {
      return buttonContent;
    }

    const tooltipContentProps: React.ComponentProps<typeof TooltipContent> =
      typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          {...tooltipContentProps}
        />
      </Tooltip>
    );
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
  // SidebarProvider is already exported above
  // useSidebar is already exported above
}
