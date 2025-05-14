
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, UsersRound, CalendarDays, Pill, FlaskConical, Bell, Settings, LogOut, Users } from 'lucide-react'; // Changed MapPin to Pill, Added Users

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patient-registration', label: 'Patient Registration', icon: UsersRound },
  { href: '/visiting-patients', label: 'Visiting Patients', icon: Users },
  { href: '/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/pharmacy-locator', label: 'Drug Dispensing', icon: Pill }, // Changed label and icon
  { href: '/treatment-recommendation', label: 'Treatment AI', icon: FlaskConical },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
    { href: '/notifications', label: 'Notifications', icon: Bell, disabled: true },
    { href: '/settings', label: 'Settings', icon: Settings, disabled: true },
    { href: '/logout', label: 'Logout', icon: LogOut, disabled: true },
];
