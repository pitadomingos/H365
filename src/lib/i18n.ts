
export type Locale = 'en' | 'pt' | 'it' | 'es';

export const defaultLocale: Locale = 'en';

export const locales: Locale[] = ['en', 'pt', 'it', 'es'];

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    'dashboard.welcomeMessage': 'Welcome to H365',
    'dashboard.tagline': 'Your centralized healthcare management hub.',
    'dashboard.card.appointments.title': "Today's Appointments",
    'dashboard.card.appointments.description': "+2 since yesterday",
    'dashboard.card.newPatients.title': "New Patients",
    'dashboard.card.newPatients.description': "This week",
    'dashboard.card.wardOccupancy.title': "Ward Occupancy",
    'dashboard.card.wardOccupancy.description': "Overall bed usage",
    'dashboard.card.erStatus.title': "ER Status",
    'dashboard.card.erStatus.description': "Active patients / critical alerts",
    'dashboard.card.viewDetails': "View Details",
    'dashboard.recentActivity.title': "Recent Activity",
    'dashboard.recentActivity.description': "Overview of recent system events and patient interactions.",
    'dashboard.recentActivity.viewAll': "View All Activity",
    'dashboard.quickActions.title': "Quick Actions",
    'dashboard.quickActions.description': "Access common tasks quickly.",
    'dashboard.quickActions.registerPatient': "Register New Patient",
    'dashboard.quickActions.scheduleAppointment': "Schedule Appointment",
    'dashboard.quickActions.getAiRecommendation': "AI Consultation",
    'dashboard.quickActions.manageWards': "Manage Wards",
    'dashboard.quickActions.labDashboard': "Lab Dashboard",
    'dashboard.quickActions.maternityRecords': "Maternity Records",
  },
  pt: {
    'dashboard.welcomeMessage': 'Bem-vindo à H365',
    'dashboard.tagline': 'Seu hub centralizado de gestão de saúde.',
    'dashboard.card.appointments.title': "Consultas de Hoje",
    'dashboard.card.appointments.description': "+2 desde ontem",
    'dashboard.card.newPatients.title': "Novos Pacientes",
    'dashboard.card.newPatients.description': "Esta semana",
    'dashboard.card.wardOccupancy.title': "Ocupação de Enfermarias",
    'dashboard.card.wardOccupancy.description': "Uso geral de leitos",
    'dashboard.card.erStatus.title': "Status da Emergência",
    'dashboard.card.erStatus.description': "Pacientes ativos / alertas críticos",
    'dashboard.card.viewDetails': "Ver Detalhes",
    'dashboard.recentActivity.title': "Atividade Recente",
    'dashboard.recentActivity.description': "Visão geral de eventos recentes do sistema e interações com pacientes.",
    'dashboard.recentActivity.viewAll': "Ver Toda a Atividade",
    'dashboard.quickActions.title': "Ações Rápidas",
    'dashboard.quickActions.description': "Acesse tarefas comuns rapidamente.",
    'dashboard.quickActions.registerPatient': "Registar Novo Paciente",
    'dashboard.quickActions.scheduleAppointment': "Agendar Consulta",
    'dashboard.quickActions.getAiRecommendation': "Consulta IA",
    'dashboard.quickActions.manageWards': "Gerir Enfermarias",
    'dashboard.quickActions.labDashboard': "Painel do Laboratório",
    'dashboard.quickActions.maternityRecords': "Registos de Maternidade",
  },
  it: {
    'dashboard.welcomeMessage': 'Benvenuto in H365',
    'dashboard.tagline': 'Il tuo hub centralizzato per la gestione sanitaria.',
    'dashboard.card.appointments.title': "Appuntamenti di Oggi",
    'dashboard.card.appointments.description': "+2 da ieri",
    'dashboard.card.newPatients.title': "Nuovi Pazienti",
    'dashboard.card.newPatients.description': "Questa settimana",
    'dashboard.card.wardOccupancy.title': "Occupazione Reparti",
    'dashboard.card.wardOccupancy.description': "Utilizzo generale dei letti",
    'dashboard.card.erStatus.title': "Stato Pronto Soccorso",
    'dashboard.card.erStatus.description': "Pazienti attivi / allerte critiche",
    'dashboard.card.viewDetails': "Vedi Dettagli",
    'dashboard.recentActivity.title': "Attività Recente",
    'dashboard.recentActivity.description': "Panoramica degli eventi di sistema recenti e delle interazioni con i pazienti.",
    'dashboard.recentActivity.viewAll': "Vedi Tutta l'Attività",
    'dashboard.quickActions.title': "Azioni Rapide",
    'dashboard.quickActions.description': "Accedi rapidamente alle attività comuni.",
    'dashboard.quickActions.registerPatient': "Registra Nuovo Paziente",
    'dashboard.quickActions.scheduleAppointment': "Pianifica Appuntamento",
    'dashboard.quickActions.getAiRecommendation': "Consulto IA",
    'dashboard.quickActions.manageWards': "Gestisci Reparti",
    'dashboard.quickActions.labDashboard': "Dashboard Laboratorio",
    'dashboard.quickActions.maternityRecords': "Cartelle Ostetriche",
  },
  es: {
    'dashboard.welcomeMessage': 'Bienvenido a H365',
    'dashboard.tagline': 'Su centro de gestión sanitaria centralizado.',
    'dashboard.card.appointments.title': "Citas de Hoy",
    'dashboard.card.appointments.description': "+2 desde ayer",
    'dashboard.card.newPatients.title': "Nuevos Pacientes",
    'dashboard.card.newPatients.description': "Esta semana",
    'dashboard.card.wardOccupancy.title': "Ocupación de Salas",
    'dashboard.card.wardOccupancy.description': "Uso general de camas",
    'dashboard.card.erStatus.title': "Estado de Urgencias",
    'dashboard.card.erStatus.description': "Pacientes activos / alertas críticas",
    'dashboard.card.viewDetails': "Ver Detalles",
    'dashboard.recentActivity.title': "Actividad Reciente",
    'dashboard.recentActivity.description': "Resumen de eventos recientes del sistema e interacciones con pacientes.",
    'dashboard.recentActivity.viewAll': "Ver Toda la Actividad",
    'dashboard.quickActions.title': "Acciones Rápidas",
    'dashboard.quickActions.description': "Acceda a tareas comunes rápidamente.",
    'dashboard.quickActions.registerPatient': "Registrar Nuevo Paciente",
    'dashboard.quickActions.scheduleAppointment': "Programar Cita",
    'dashboard.quickActions.getAiRecommendation': "Consulta IA",
    'dashboard.quickActions.manageWards': "Gestionar Salas",
    'dashboard.quickActions.labDashboard': "Panel de Laboratorio",
    'dashboard.quickActions.maternityRecords': "Registros de Maternidad",
  },
};

// A simple function to get translations.
// In a real app, this would be more sophisticated, likely involving context or a library,
// and the locale would be determined from the URL or user preferences.
export const getTranslator = (locale: Locale = defaultLocale) => {
  const selectedTranslations = translations[locale] || translations[defaultLocale];
  return (key: string, fallback?: string): string => {
    return selectedTranslations[key] || fallback || key;
  };
};

