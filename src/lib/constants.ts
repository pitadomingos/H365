
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
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/reporting', label: 'Reporting', icon: BarChartBig },
  { href: '/technical-overview', label: 'Technical Overview', icon: Info },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
    { href: '/notifications', label: 'Notifications', icon: Bell, disabled: true },
    { href: '/settings', label: 'Settings', icon: Settings, disabled: true },
    { href: '/logout', label: 'Logout', icon: LogOut, disabled: true },
];

export interface OrderableLabTest {
  id: string;
  label: string;
  category?: string; 
}

export const COMMON_ORDERABLE_LAB_TESTS: OrderableLabTest[] = [
  // Hematology
  { id: "cbc", label: "Complete Blood Count (CBC)", category: "Hematology" },
  { id: "esr", label: "Erythrocyte Sedimentation Rate (ESR)", category: "Hematology" },
  { id: "pt_inr", label: "Prothrombin Time & INR (PT/INR)", category: "Hematology" },
  // Chemistry Panels
  { id: "bmp", label: "Basic Metabolic Panel (BMP)", category: "Chemistry" },
  { id: "cmp", label: "Comprehensive Metabolic Panel (CMP)", category: "Chemistry" },
  { id: "lipid_panel", label: "Lipid Panel", category: "Chemistry" },
  { id: "renal_panel", label: "Renal Function Panel (RFP)", category: "Chemistry" },
  { id: "liver_panel", label: "Liver Function Panel (LFP)", category: "Chemistry" },
  // Specific Chemistry / Endocrine
  { id: "glucose_fasting", label: "Glucose, Fasting", category: "Chemistry" },
  { id: "hba1c", label: "Hemoglobin A1c (HbA1c)", category: "Endocrine" },
  { id: "tsh", label: "Thyroid Stimulating Hormone (TSH)", category: "Endocrine" },
  { id: "free_t4", label: "Free T4 (FT4)", category: "Endocrine" },
  { id: "serum_iron", label: "Serum Iron Studies", category: "Chemistry" },
  { id: "vit_d", label: "Vitamin D, 25-Hydroxy", category: "Chemistry" },
  { id: "vit_b12", label: "Vitamin B12 Level", category: "Chemistry" },
  // Immunology / Serology
  { id: "crp", label: "C-Reactive Protein (CRP)", category: "Immunology" },
  { id: "hiv_screen", label: "HIV Screening Test", category: "Serology" },
  { id: "hepatitis_panel", label: "Hepatitis Panel (Acute)", category: "Serology" },
  // Urinalysis
  { id: "urinalysis_re", label: "Urinalysis, Routine & Microscopy (Urine R/E)", category: "Urinalysis" },
  { id: "urine_culture", label: "Urine Culture & Sensitivity", category: "Microbiology" },
  // Other
  { id: "stool_re", label: "Stool Routine Examination (Stool R/E)", category: "Microbiology" },
];

// Maternity specific lab tests (example)
export const MATERNITY_SPECIFIC_LAB_TESTS: OrderableLabTest[] = [
  { id: "cbc_mat", label: "Complete Blood Count (CBC)", category: "Hematology" },
  { id: "blood_group_rh", label: "Blood Group & Rh Factor", category: "Hematology" },
  { id: "urine_re_mat", label: "Urine Routine & Microscopy", category: "Urinalysis" },
  { id: "gtt", label: "Glucose Tolerance Test (GTT)", category: "Endocrine" },
  { id: "hiv_mat", label: "HIV Screening", category: "Serology" },
  { id: "vdrl_rpr", label: "VDRL/RPR (Syphilis Test)", category: "Serology" },
  { id: "hbsag", label: "Hepatitis B Surface Antigen (HBsAg)", category: "Serology" },
  { id: "thyroid_mat", label: "Thyroid Function Tests (TSH, T3, T4)", category: "Endocrine" },
  { id: "rubella_igg", label: "Rubella IgG", category: "Serology" },
  { id: "group_b_strep", label: "Group B Strep Screen", category: "Microbiology" },
];
