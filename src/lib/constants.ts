
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, UsersRound, CalendarDays, Pill, ClipboardEdit, Bell, Settings, LogOut, Users, BedDouble, Star, Siren, Biohazard, Baby, Microscope, MonitorPlay, Info, Megaphone, BarChartBig } from 'lucide-react';

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
  { href: '/treatment-recommendation', label: 'Consultation Room', icon: ClipboardEdit },
  { href: '/specializations', label: 'Specializations', icon: Star },
  { href: '/maternity-care', label: 'Maternity Care', icon: Baby },
  { href: '/ward-management', label: 'Ward Management', icon: BedDouble },
  { href: '/laboratory-management', label: 'Laboratory', icon: Microscope },
  { href: '/imaging-management', label: 'Imaging', icon: MonitorPlay },
  { href: '/pharmacy-locator', label: 'Drug Dispensing', icon: Pill },
  { href: '/emergency-room', label: 'Emergency Room', icon: Siren, disabled: false },
  { href: '/epidemic-control', label: 'Epidemic Control', icon: Biohazard, disabled: false },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone, disabled: true },
  { href: '/reporting', label: 'Reporting', icon: BarChartBig, disabled: true },
  { href: '/technical-overview', label: 'Technical Overview', icon: Info },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
    { href: '/notifications', label: 'Notifications', icon: Bell, disabled: true },
    { href: '/settings', label: 'Settings', icon: Settings, disabled: true },
    { href: '/logout', label: 'Logout', icon: LogOut, disabled: true },
];
