import type { Language } from "@/lib/types";

export const languages: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" }
];

export const dictionary = {
  en: {
    brand: "Cubera Digital Solutions",
    tagline: "Simple digital solutions for local businesses.",
    nav: {
      home: "Home",
      services: "Services",
      pricing: "Pricing",
      about: "About",
      contact: "Contact",
      login: "Login",
      getStarted: "Get Started",
      dashboard: "Dashboard",
      logout: "Log out"
    },
    common: {
      submit: "Submit",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading",
      success: "Saved successfully.",
      error: "Something went wrong.",
      viewDetails: "View details",
      required: "Required",
      optional: "Optional",
      active: "Active",
      inactive: "Inactive",
      archived: "Archived"
    },
    public: {
      heroTitle: "Digital systems that help small businesses look ready, organized, and easy to reach.",
      heroText:
        "Launch a professional website, set up your digital profiles, and manage your onboarding in one clear workspace.",
      primaryCta: "Get Started",
      secondaryCta: "View Services",
      processTitle: "A simple path from idea to launch",
      process: ["Register", "Complete intake form", "Review project plan", "Launch and grow"],
      servicesIntro: "Focused digital services for small teams that need practical execution.",
      aboutTitle: "Built for local businesses that need calm, useful digital support.",
      aboutText:
        "Cubera Digital Solutions helps small businesses get online, look professional, and manage their digital presence without a complicated process.",
      pricingIntro: "Choose a starting point. Plans can be adjusted as your business grows.",
      contactIntro: "Tell us what you need and we will follow up with clear next steps."
    },
    services: {
      website: "Website creation",
      websiteText: "Clean, responsive websites built around your services, contact flow, and local audience.",
      profile: "Digital profile creation",
      profileText: "Business profile setup that keeps your online information clear and consistent.",
      google: "Google Business Profile registration",
      googleText: "Registration support, verification guidance, and profile content preparation.",
      social: "Social media marketing",
      socialText: "Simple content planning and profile support for local business visibility.",
      maintenance: "Ongoing website maintenance",
      maintenanceText: "Routine updates, content changes, and basic performance checks.",
      strategy: "Local business digital strategy",
      strategyText: "Practical planning for online presence, customer intake, and next-step growth."
    },
    auth: {
      loginTitle: "Log in",
      registerTitle: "Create your account",
      email: "Email",
      password: "Password",
      fullName: "Full name",
      phone: "Phone number",
      businessName: "Business name",
      preferredLanguage: "Preferred language",
      loginButton: "Log in",
      registerButton: "Register",
      google: "Continue with Google",
      apple: "Continue with Apple",
      oauthNotice: "Provider login is ready for configuration. Add provider credentials to enable it.",
      noAccount: "Need an account?",
      hasAccount: "Already have an account?"
    },
    contact: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      businessName: "Business name",
      message: "Message",
      preferredLanguage: "Preferred language",
      submit: "Send message",
      sent: "Message sent. We will follow up soon."
    },
    dashboard: {
      overview: "Overview",
      subscription: "Subscription",
      projects: "Projects",
      intake: "Intake Form",
      support: "Support",
      profile: "Profile",
      welcome: "Welcome",
      activeProjects: "Active projects",
      pendingForms: "Pending intake forms",
      recentUpdates: "Recent project updates",
      currentPlan: "Current plan",
      renewal: "Renewal date",
      includedServices: "Included services",
      requestSupport: "Submit support request",
      updateProfile: "Update profile"
    },
    developer: {
      overview: "Overview",
      customers: "Customers",
      workItems: "Work Items",
      intakeManager: "Intake Manager",
      projects: "Projects",
      contactMessages: "Contact Messages",
      siteSettings: "Site Settings",
      activeCustomers: "Active customers",
      openWorkItems: "Open work items",
      awaitingReview: "Awaiting review",
      projectsInProgress: "Projects in progress",
      recentActivity: "Recent activity",
      createQuestion: "Create question",
      internalNotes: "Internal notes"
    },
    status: {
      active: "Active",
      pending: "Pending",
      past_due: "Past due",
      cancelled: "Cancelled",
      new: "New",
      intake_submitted: "Intake submitted",
      in_review: "In review",
      planning: "Planning",
      in_progress: "In progress",
      waiting_for_client: "Waiting for client",
      ready_for_approval: "Ready for approval",
      completed: "Completed",
      archived: "Archived",
      reviewing: "Reviewing",
      needs_client_info: "Needs client info",
      approved: "Approved",
      staged: "Staged",
      internal_review: "Internal review",
      waiting_for_client_approval: "Waiting for client approval",
      complete: "Complete",
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
      submitted: "Submitted",
      responded: "Responded"
    }
  },
  es: {
    brand: "Cubera Digital Solutions",
    tagline: "Soluciones digitales simples para negocios locales.",
    nav: {
      home: "Inicio",
      services: "Servicios",
      pricing: "Planes",
      about: "Sobre nosotros",
      contact: "Contacto",
      login: "Entrar",
      getStarted: "Comenzar",
      dashboard: "Panel",
      logout: "Salir"
    },
    common: {
      submit: "Enviar",
      save: "Guardar",
      cancel: "Cancelar",
      loading: "Cargando",
      success: "Guardado correctamente.",
      error: "Algo salio mal.",
      viewDetails: "Ver detalles",
      required: "Requerido",
      optional: "Opcional",
      active: "Activo",
      inactive: "Inactivo",
      archived: "Archivado"
    },
    public: {
      heroTitle: "Sistemas digitales para que su negocio se vea profesional, organizado y facil de contactar.",
      heroText:
        "Lance un sitio web profesional, configure sus perfiles digitales y maneje su proceso de onboarding en un espacio claro.",
      primaryCta: "Comenzar",
      secondaryCta: "Ver servicios",
      processTitle: "Un camino simple desde la idea hasta el lanzamiento",
      process: ["Registrarse", "Completar formulario", "Revisar plan del proyecto", "Lanzar y crecer"],
      servicesIntro: "Servicios digitales enfocados para equipos pequenos que necesitan ejecucion practica.",
      aboutTitle: "Creado para negocios locales que necesitan apoyo digital claro y util.",
      aboutText:
        "Cubera Digital Solutions ayuda a pequenos negocios a estar en linea, verse profesionales y manejar su presencia digital sin procesos complicados.",
      pricingIntro: "Elija un punto de partida. Los planes se pueden ajustar a medida que su negocio crece.",
      contactIntro: "Cuéntenos lo que necesita y responderemos con pasos claros."
    },
    services: {
      website: "Creacion de sitios web",
      websiteText: "Sitios limpios y responsivos centrados en sus servicios, contacto y audiencia local.",
      profile: "Creacion de perfiles digitales",
      profileText: "Configuracion de perfiles para mantener su informacion clara y consistente.",
      google: "Registro de Google Business Profile",
      googleText: "Apoyo con registro, verificacion y preparacion del contenido del perfil.",
      social: "Mercadeo en redes sociales",
      socialText: "Planificacion simple de contenido y soporte de perfiles para visibilidad local.",
      maintenance: "Mantenimiento continuo del sitio",
      maintenanceText: "Actualizaciones, cambios de contenido y revisiones basicas de rendimiento.",
      strategy: "Estrategia digital para negocios locales",
      strategyText: "Planificacion practica para presencia digital, intake de clientes y crecimiento."
    },
    auth: {
      loginTitle: "Entrar",
      registerTitle: "Crear cuenta",
      email: "Correo electronico",
      password: "Contrasena",
      fullName: "Nombre completo",
      phone: "Telefono",
      businessName: "Nombre del negocio",
      preferredLanguage: "Idioma preferido",
      loginButton: "Entrar",
      registerButton: "Registrarse",
      google: "Continuar con Google",
      apple: "Continuar con Apple",
      oauthNotice: "El acceso por proveedor esta listo para configurarse. Agregue las credenciales para activarlo.",
      noAccount: "Necesita una cuenta?",
      hasAccount: "Ya tiene una cuenta?"
    },
    contact: {
      name: "Nombre",
      email: "Correo electronico",
      phone: "Telefono",
      businessName: "Nombre del negocio",
      message: "Mensaje",
      preferredLanguage: "Idioma preferido",
      submit: "Enviar mensaje",
      sent: "Mensaje enviado. Le responderemos pronto."
    },
    dashboard: {
      overview: "Resumen",
      subscription: "Suscripcion",
      projects: "Proyectos",
      intake: "Formulario",
      support: "Soporte",
      profile: "Perfil",
      welcome: "Bienvenido",
      activeProjects: "Proyectos activos",
      pendingForms: "Formularios pendientes",
      recentUpdates: "Actualizaciones recientes",
      currentPlan: "Plan actual",
      renewal: "Fecha de renovacion",
      includedServices: "Servicios incluidos",
      requestSupport: "Enviar solicitud de soporte",
      updateProfile: "Actualizar perfil"
    },
    developer: {
      overview: "Resumen",
      customers: "Clientes",
      workItems: "Tareas",
      intakeManager: "Administrador de formularios",
      projects: "Proyectos",
      contactMessages: "Mensajes de contacto",
      siteSettings: "Ajustes del sitio",
      activeCustomers: "Clientes activos",
      openWorkItems: "Tareas abiertas",
      awaitingReview: "Pendientes de revision",
      projectsInProgress: "Proyectos en progreso",
      recentActivity: "Actividad reciente",
      createQuestion: "Crear pregunta",
      internalNotes: "Notas internas"
    },
    status: {
      active: "Activo",
      pending: "Pendiente",
      past_due: "Atrasado",
      cancelled: "Cancelado",
      new: "Nuevo",
      intake_submitted: "Formulario enviado",
      in_review: "En revision",
      planning: "Planificando",
      in_progress: "En progreso",
      waiting_for_client: "Esperando al cliente",
      ready_for_approval: "Listo para aprobacion",
      completed: "Completado",
      archived: "Archivado",
      reviewing: "Revisando",
      needs_client_info: "Necesita informacion del cliente",
      approved: "Aprobado",
      staged: "Preparado",
      internal_review: "Revision interna",
      waiting_for_client_approval: "Esperando aprobacion del cliente",
      complete: "Completo",
      low: "Baja",
      normal: "Normal",
      high: "Alta",
      urgent: "Urgente",
      submitted: "Enviado",
      responded: "Respondido"
    }
  }
} as const;

export type TranslationKey = keyof typeof dictionary.en;

export function translate(language: Language, path: string): string {
  const segments = path.split(".");
  let value: unknown = dictionary[language];

  for (const segment of segments) {
    if (typeof value !== "object" || value === null || !(segment in value)) {
      return path;
    }
    value = (value as Record<string, unknown>)[segment];
  }

  return typeof value === "string" ? value : path;
}
