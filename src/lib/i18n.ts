
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
    'dashboard.card.labResults.title': "Pending Lab Results",
    'dashboard.card.labResults.description': "Requires review",
    'dashboard.card.revenue.title': "Revenue This Month",
    'dashboard.card.revenue.description': "+5% from last month",
    'dashboard.card.viewDetails': "View Details",
    'dashboard.recentActivity.title': "Recent Activity",
    'dashboard.recentActivity.description': "Overview of recent system events and patient interactions.",
    'dashboard.recentActivity.viewAll': "View All Activity",
    'dashboard.quickActions.title': "Quick Actions",
    'dashboard.quickActions.description': "Access common tasks quickly.",
    'dashboard.quickActions.registerPatient': "Register New Patient",
    'dashboard.quickActions.scheduleAppointment': "Schedule Appointment",
    'dashboard.quickActions.getAiRecommendation': "Get AI Recommendation",
    'dashboard.quickActions.viewReports': "View Reports",
  },
  pt: {
    'dashboard.welcomeMessage': 'Bem-vindo à H365',
    'dashboard.tagline': 'Seu hub centralizado de gestão de saúde.',
    'dashboard.card.appointments.title': "Consultas de Hoje",
    'dashboard.card.appointments.description': "+2 desde ontem",
    'dashboard.card.newPatients.title': "Novos Pacientes",
    'dashboard.card.newPatients.description': "Esta semana",
    'dashboard.card.labResults.title': "Resultados de Laboratório Pendentes",
    'dashboard.card.labResults.description': "Requer revisão",
    'dashboard.card.revenue.title': "Receita Este Mês",
    'dashboard.card.revenue.description': "+5% em relação ao mês passado",
    'dashboard.card.viewDetails': "Ver Detalhes",
    'dashboard.recentActivity.title': "Atividade Recente",
    'dashboard.recentActivity.description': "Visão geral de eventos recentes do sistema e interações com pacientes.",
    'dashboard.recentActivity.viewAll': "Ver Toda a Atividade",
    'dashboard.quickActions.title': "Ações Rápidas",
    'dashboard.quickActions.description': "Acesse tarefas comuns rapidamente.",
    'dashboard.quickActions.registerPatient': "Registar Novo Paciente",
    'dashboard.quickActions.scheduleAppointment': "Agendar Consulta",
    'dashboard.quickActions.getAiRecommendation': "Obter Recomendação de IA",
    'dashboard.quickActions.viewReports': "Ver Relatórios",
  },
  it: {
    'dashboard.welcomeMessage': 'Benvenuto in H365',
    'dashboard.tagline': 'Il tuo hub centralizzato per la gestione sanitaria.',
    'dashboard.card.appointments.title': "Appuntamenti di Oggi",
    'dashboard.card.appointments.description': "+2 da ieri",
    'dashboard.card.newPatients.title': "Nuovi Pazienti",
    'dashboard.card.newPatients.description': "Questa settimana",
    'dashboard.card.labResults.title': "Risultati di Laboratorio Pendenti",
    'dashboard.card.labResults.description': "Richiede revisione",
    'dashboard.card.revenue.title': "Entrate Questo Mese",
    'dashboard.card.revenue.description': "+5% rispetto al mese scorso",
    'dashboard.card.viewDetails': "Vedi Dettagli",
    'dashboard.recentActivity.title': "Attività Recente",
    'dashboard.recentActivity.description': "Panoramica degli eventi di sistema recenti e delle interazioni con i pazienti.",
    'dashboard.recentActivity.viewAll': "Vedi Tutta l'Attività",
    'dashboard.quickActions.title': "Azioni Rapide",
    'dashboard.quickActions.description': "Accedi rapidamente alle attività comuni.",
    'dashboard.quickActions.registerPatient': "Registra Nuovo Paziente",
    'dashboard.quickActions.scheduleAppointment': "Pianifica Appuntamento",
    'dashboard.quickActions.getAiRecommendation': "Ottieni Raccomandazione IA",
    'dashboard.quickActions.viewReports': "Visualizza Rapporti",
  },
  es: {
    'dashboard.welcomeMessage': 'Bienvenido a H365',
    'dashboard.tagline': 'Su centro de gestión sanitaria centralizado.',
    'dashboard.card.appointments.title': "Citas de Hoy",
    'dashboard.card.appointments.description': "+2 desde ayer",
    'dashboard.card.newPatients.title': "Nuevos Pacientes",
    'dashboard.card.newPatients.description': "Esta semana",
    'dashboard.card.labResults.title': "Resultados de Laboratorio Pendientes",
    'dashboard.card.labResults.description': "Requiere revisión",
    'dashboard.card.revenue.title': "Ingresos Este Mes",
    'dashboard.card.revenue.description': "+5% desde el mes pasado",
    'dashboard.card.viewDetails': "Ver Detalles",
    'dashboard.recentActivity.title': "Actividad Reciente",
    'dashboard.recentActivity.description': "Resumen de eventos recientes del sistema e interacciones con pacientes.",
    'dashboard.recentActivity.viewAll': "Ver Toda la Actividad",
    'dashboard.quickActions.title': "Acciones Rápidas",
    'dashboard.quickActions.description': "Acceda a tareas comunes rápidamente.",
    'dashboard.quickActions.registerPatient': "Registrar Nuevo Paciente",
    'dashboard.quickActions.scheduleAppointment': "Programar Cita",
    'dashboard.quickActions.getAiRecommendation': "Obtener Recomendación de IA",
    'dashboard.quickActions.viewReports': "Ver Informes",
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
