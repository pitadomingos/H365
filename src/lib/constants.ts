
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, UsersRound, CalendarDays, Pill, ClipboardEdit, Bell, Settings, LogOut, Users, BedDouble, Star, Siren, Biohazard, Baby, Microscope, MonitorPlay, Info, Megaphone, BarChartBig, CreditCard, Video, BrainCircuit, Droplets, ListChecks, Database, FileText, BookOpenCheck, Network } from 'lucide-react';

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
  { href: '/emergency-room', label: 'Emergency Room', icon: Siren },
  { href: '/epidemic-control', label: 'Epidemic Control', icon: Biohazard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/reporting', label: 'Reporting', icon: BarChartBig },
  { href: '/billing', label: 'Billing & Finance', icon: CreditCard },
  { href: '/telemedicine', label: 'Telemedicine', icon: Video },
  { href: '/analytics-bi', label: 'Analytics & BI', icon: BrainCircuit },
  { href: '/blood-bank', label: 'Blood Bank', icon: Droplets },
  { href: '/technical-overview', label: 'Technical Overview', icon: Info },
  { href: '/backend-schema-roadmap', label: 'Backend Roadmap', icon: Database },
  { href: '/architecture-options', label: 'Architecture Options', icon: Network },
  { href: '/training-materials', label: 'Training Materials', icon: BookOpenCheck },
  { href: '/system-documentation', label: 'System Documentation', icon: FileText },
  { href: '/todo-list', label: 'To-Do List', icon: ListChecks },
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
  // Hematology - Complete Blood Count (CBC) Components
  { id: "hemoglobin", label: "Hemoglobin (Hgb)", category: "Hematology" },
  { id: "hematocrit", label: "Hematocrit (Hct)", category: "Hematology" },
  { id: "rbc_count", label: "Red Blood Cell Count (RBC)", category: "Hematology" },
  { id: "wbc_count", label: "White Blood Cell Count (WBC)", category: "Hematology" },
  { id: "platelet_count", label: "Platelet Count", category: "Hematology" },
  { id: "mcv", label: "Mean Corpuscular Volume (MCV)", category: "Hematology" },
  { id: "mch", label: "Mean Corpuscular Hemoglobin (MCH)", category: "Hematology" },
  { id: "mchc", label: "Mean Corpuscular Hemoglobin Concentration (MCHC)", category: "Hematology" },
  { id: "rdw", label: "Red Cell Distribution Width (RDW)", category: "Hematology" },
  { id: "differential_wbc", label: "WBC Differential (Neutrophils, Lymphocytes, etc.)", category: "Hematology" },
  // Other Hematology
  { id: "esr", label: "Erythrocyte Sedimentation Rate (ESR)", category: "Hematology" },
  { id: "pt_inr", label: "Prothrombin Time & INR (PT/INR)", category: "Hematology" },
  { id: "aptt", label: "Activated Partial Thromboplastin Time (aPTT)", category: "Hematology" },
  { id: "blood_group_rh", label: "Blood Group & Rh Factor", category: "Hematology" },
  { id: "antibody_screen_indirect_coombs", label: "Antibody Screen (Indirect Coombs)", category: "Hematology" },


  // Chemistry - Basic Metabolic Panel (BMP) Components
  { id: "sodium", label: "Sodium (Na)", category: "Chemistry" },
  { id: "potassium", label: "Potassium (K)", category: "Chemistry" },
  { id: "chloride", label: "Chloride (Cl)", category: "Chemistry" },
  { id: "co2_bicarbonate", label: "CO2 (Bicarbonate)", category: "Chemistry" },
  { id: "bun", label: "Blood Urea Nitrogen (BUN)", category: "Chemistry" },
  { id: "creatinine_serum", label: "Creatinine, Serum", category: "Chemistry" },
  { id: "glucose_random", label: "Glucose, Random", category: "Chemistry" },
  { id: "calcium_total", label: "Calcium, Total", category: "Chemistry" },

  // Chemistry - Comprehensive Metabolic Panel (CMP) adds to BMP
  { id: "albumin", label: "Albumin", category: "Chemistry" },
  { id: "total_protein", label: "Total Protein", category: "Chemistry" },
  { id: "alp", label: "Alkaline Phosphatase (ALP)", category: "Chemistry" },
  { id: "alt_sgpt", label: "Alanine Aminotransferase (ALT/SGPT)", category: "Chemistry" },
  { id: "ast_sgot", label: "Aspartate Aminotransferase (AST/SGOT)", category: "Chemistry" },
  { id: "bilirubin_total", label: "Bilirubin, Total", category: "Chemistry" },

  // Chemistry - Lipid Panel Components
  { id: "cholesterol_total", label: "Cholesterol, Total", category: "Lipids" },
  { id: "triglycerides", label: "Triglycerides", category: "Lipids" },
  { id: "hdl_cholesterol", label: "HDL Cholesterol", category: "Lipids" },
  { id: "ldl_cholesterol_calculated", label: "LDL Cholesterol (Calculated)", category: "Lipids" },

  // Specific Chemistry / Endocrine
  { id: "glucose_fasting", label: "Glucose, Fasting", category: "Endocrine" },
  { id: "gct_glucose_challenge", label: "Glucose Challenge Test (GCT, 1-hour)", category: "Endocrine" },
  { id: "ogtt_oral_glucose_tolerance", label: "Oral Glucose Tolerance Test (OGTT)", category: "Endocrine" },
  { id: "hba1c", label: "Hemoglobin A1c (HbA1c)", category: "Endocrine" },
  { id: "tsh", label: "Thyroid Stimulating Hormone (TSH)", category: "Endocrine" },
  { id: "free_t4", label: "Free T4 (FT4)", category: "Endocrine" },
  { id: "free_t3", label: "Free T3 (FT3)", category: "Endocrine" },
  { id: "serum_iron", label: "Serum Iron", category: "Chemistry" },
  { id: "tibc", label: "Total Iron Binding Capacity (TIBC)", category: "Chemistry" },
  { id: "ferritin", label: "Ferritin", category: "Chemistry" },
  { id: "vit_d", label: "Vitamin D, 25-Hydroxy", category: "Chemistry" },
  { id: "vit_b12", label: "Vitamin B12 Level", category: "Chemistry" },
  { id: "folate_serum", label: "Folate, Serum", category: "Chemistry" },
  { id: "magnesium", label: "Magnesium, Serum", category: "Chemistry" },
  { id: "phosphate", label: "Phosphate, Serum", category: "Chemistry" },
  { id: "uric_acid", label: "Uric Acid, Serum", category: "Chemistry" },

  // Immunology / Serology
  { id: "crp", label: "C-Reactive Protein (CRP)", category: "Immunology" },
  { id: "rheumatoid_factor", label: "Rheumatoid Factor (RF)", category: "Immunology" },
  { id: "ana", label: "Antinuclear Antibodies (ANA)", category: "Immunology" },
  { id: "hiv_screen", label: "HIV 1/2 Antibody/Antigen Screen", category: "Serology" },
  { id: "hepatitis_b_surface_antigen", label: "Hepatitis B Surface Antigen (HBsAg)", category: "Serology" },
  { id: "hepatitis_c_antibody", label: "Hepatitis C Antibody", category: "Serology" },
  { id: "rpr_syphilis", label: "RPR (Syphilis Screen)", category: "Serology" },
  { id: "rubella_igg", label: "Rubella IgG", category: "Serology" },

  // Urinalysis
  { id: "urinalysis_re", label: "Urinalysis, Routine & Microscopy (Urine R/E)", category: "Urinalysis" },
  { id: "urine_culture_sensitivity", label: "Urine Culture & Sensitivity", category: "Microbiology" },

  // Other Microbiology
  { id: "stool_re_op", label: "Stool R/E (Ova & Parasites)", category: "Microbiology" },
  { id: "stool_culture", label: "Stool Culture & Sensitivity", category: "Microbiology" },
  { id: "blood_culture", label: "Blood Culture & Sensitivity", category: "Microbiology" },
  { id: "throat_swab_culture", label: "Throat Swab Culture & Sensitivity", category: "Microbiology" },
  { id: "group_b_strep_screen", label: "Group B Strep Screen (GBS)", category: "Microbiology" },
];

// Maternity specific lab tests (example - can be expanded or merged)
export const MATERNITY_SPECIFIC_LAB_TESTS: OrderableLabTest[] = [
  { id: "cbc_mat", label: "Complete Blood Count (CBC)", category: "Hematology" },
  { id: "blood_group_rh_mat", label: "Blood Group & Rh Factor", category: "Hematology" },
  { id: "urine_re_mat", label: "Urine Routine & Microscopy", category: "Urinalysis" },
  { id: "gct_glucose_challenge_mat", label: "Glucose Challenge Test (GCT, 1-hour)", category: "Endocrine" },
  { id: "ogtt_oral_glucose_tolerance_mat", label: "Oral Glucose Tolerance Test (OGTT)", category: "Endocrine" },
  { id: "hiv_mat_screening", label: "HIV Screening", category: "Serology" },
  { id: "vdrl_rpr_mat_syphilis", label: "VDRL/RPR (Syphilis Test)", category: "Serology" },
  { id: "hbsag_mat_hepb", label: "Hepatitis B Surface Antigen (HBsAg)", category: "Serology" },
  { id: "rubella_igg_mat", label: "Rubella IgG", category: "Serology" },
  { id: "group_b_strep_screen_mat", label: "Group B Strep Screen (GBS)", category: "Microbiology" },
  { id: "antibody_screen_indirect_coombs_mat", label: "Antibody Screen (Indirect Coombs)", category: "Hematology" },
];

    