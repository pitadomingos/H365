
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, UsersRound, CalendarDays, MapPin, FlaskConical, Bell, Settings, LogOut, Users } from 'lucide-react'; // Added Users for Visiting Patients

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient-registration', label: 'Patient Registration', icon: UsersRound },
  { href: '/visiting-patients', label: 'Visiting Patients', icon: Users }, // New Nav Item
  { href: '/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/pharmacy-locator', label: 'Pharmacy Locator', icon: MapPin },
  { href: '/treatment-recommendation', label: 'Treatment AI', icon: FlaskConical },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
    { href: '/notifications', label: 'Notifications', icon: Bell, disabled: true }, // Placeholder for now
    { href: '/settings', label: 'Settings', icon: Settings, disabled: true }, // Placeholder for now
    { href: '/logout', label: 'Logout', icon: LogOut, disabled: true }, // Placeholder for now
];


    