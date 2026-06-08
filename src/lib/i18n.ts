import type { Language } from "@/lib/types";

export const languages: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" }
];

export const dictionary = {
  en: {
    brand: "Cubera Media",
    tagline: "Websites, profiles, and marketing systems for local businesses.",
    nav: {
      home: "Home",
      services: "Services",
      pricing: "Pricing",
      plans: "Plans",
      howItWorks: "How It Works",
      about: "About",
      contact: "Contact",
      login: "Login",
      clientPortal: "Client Portal",
      getStarted: "Get Started",
      dashboard: "Dashboard",
      workItems: "Work Items",
      profile: "Profile",
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
      learnMore: "Learn more",
      required: "Required",
      optional: "Optional",
      active: "Active",
      inactive: "Inactive",
      archived: "Archived"
    },
    public: {
      heroEyebrow: "Local focus. Real results.",
      heroTitle: "Websites, profiles, and marketing systems for local businesses.",
      heroText:
        "We help local businesses get found, trusted, and chosen online with modern websites, optimized profiles, and done-for-you marketing systems.",
      primaryCta: "Get Started",
      secondaryCta: "See How It Works",
      servicesEyebrow: "What we do",
      servicesTitle: "Everything your business needs to grow online.",
      processTitle: "Simple process. Proven results.",
      process: ["Discover", "Plan", "Build", "Grow"],
      processDescriptions: [
        "We learn about your business, goals, and current challenges.",
        "We create a custom strategy and clear roadmap.",
        "We build your assets, optimize your presence, and set up your system.",
        "We launch, track results, and continuously improve to help you grow."
      ],
      servicesIntro: "Focused digital services for local teams that need practical execution and a clean client workflow.",
      aboutTitle: "Local businesses deserve a sharper digital presence without a complicated process.",
      aboutText:
        "Cubera Media helps small businesses get online, look professional, and manage their digital presence with simple systems that are easy to keep moving.",
      pricingIntro: "Choose a starting point. Plans can be adjusted as your business grows and your digital needs mature.",
      contactIntro: "Tell us what you need and we will follow up with clear next steps.",
      finalCtaTitle: "Ready to make your business easier to find and trust?",
      finalCtaText: "Start with a clear request and we will help you map the right next move.",
      trustedBy: "Trusted by local businesses"
    },
    services: {
      website: "Custom Websites",
      websiteText: "Modern, fast, mobile-friendly websites that turn visitors into customers.",
      profile: "Digital Profile Setup",
      profileText: "Profile setup that keeps your online information clear, consistent, and easy to trust.",
      google: "Google Business Profile",
      googleText: "Get found on Google Maps and Search with an optimized profile that builds trust.",
      social: "Social Media Management",
      socialText: "Consistent content, posting, and engagement to keep your business top of mind.",
      maintenance: "Website Maintenance",
      maintenanceText: "Routine updates, content changes, and basic performance checks.",
      strategy: "Marketing Systems & Automation",
      strategyText: "Follow-up, reviews, and automations that save time and drive more business."
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
      intake: "Request Forms",
      support: "Support",
      profile: "Profile",
      welcome: "Welcome",
      activeProjects: "Active projects",
      pendingForms: "Open request forms",
      recentUpdates: "Recent project updates",
      currentPlan: "Current plan",
      renewal: "Renewal date",
      includedServices: "Included services",
      requestSupport: "Submit support request",
      updateProfile: "Update profile",
      manageSubscription: "Manage subscription",
      supportRequests: "Support requests",
      reportsDocuments: "Reports and documents"
    },
    developer: {
      overview: "Overview",
      customers: "Customers",
      workItems: "Work Items",
      intakeManager: "Developer Manager",
      projects: "Projects",
      contactMessages: "Contact Messages",
      siteSettings: "Site Settings",
      websiteBuilder: "Website Builder",
      activeCustomers: "Active customers",
      openWorkItems: "Open work items",
      awaitingReview: "Awaiting review",
      projectsInProgress: "Projects in progress",
      recentActivity: "Recent activity",
      createQuestion: "Create question",
      internalNotes: "Internal notes",
      planCatalog: "Subscription plan catalog",
      workflowConfig: "Workflow configuration"
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
      rejected: "Rejected",
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
    brand: "Cubera Media",
    tagline: "Soluciones digitales simples para negocios locales.",
    nav: {
      home: "Inicio",
      services: "Servicios",
      pricing: "Planes",
      plans: "Planes",
      howItWorks: "Como funciona",
      about: "Sobre nosotros",
      contact: "Contacto",
      login: "Entrar",
      clientPortal: "Portal del cliente",
      getStarted: "Comenzar",
      dashboard: "Panel",
      workItems: "Tareas",
      profile: "Perfil",
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
      learnMore: "Conocer mas",
      required: "Requerido",
      optional: "Opcional",
      active: "Activo",
      inactive: "Inactivo",
      archived: "Archivado"
    },
    public: {
      heroEyebrow: "Enfoque local. Resultados reales.",
      heroTitle: "Sitios web, perfiles y sistemas de mercadeo para negocios locales.",
      heroText:
        "Ayudamos a negocios locales a ser encontrados, generar confianza y ser elegidos con sitios modernos, perfiles optimizados y sistemas de mercadeo hechos para usted.",
      primaryCta: "Comenzar",
      secondaryCta: "Ver como funciona",
      servicesEyebrow: "Que hacemos",
      servicesTitle: "Todo lo que tu negocio necesita para crecer en linea.",
      processTitle: "Proceso simple. Resultados probados.",
      process: ["Descubrir", "Planificar", "Construir", "Crecer"],
      processDescriptions: [
        "Aprendemos sobre su negocio, sus metas y los retos actuales.",
        "Creamos una estrategia personalizada y una ruta clara.",
        "Construimos sus activos, optimizamos su presencia y configuramos su sistema.",
        "Lanzamos, medimos resultados y mejoramos continuamente para ayudarle a crecer."
      ],
      servicesIntro: "Servicios digitales enfocados para negocios locales que necesitan ejecucion practica y un flujo claro.",
      aboutTitle: "Los negocios locales merecen una presencia digital mas profesional sin procesos complicados.",
      aboutText:
        "Cubera Media ayuda a pequenos negocios a estar en linea, verse profesionales y manejar su presencia digital con sistemas simples y faciles de mantener.",
      pricingIntro: "Elija un punto de partida. Los planes se pueden ajustar a medida que su negocio crece.",
      contactIntro: "Cuentenos lo que necesita y responderemos con pasos claros.",
      finalCtaTitle: "Listo para que su negocio sea mas facil de encontrar y confiar?",
      finalCtaText: "Comience con una solicitud clara y le ayudaremos a definir el siguiente paso correcto.",
      trustedBy: "Con la confianza de negocios locales"
    },
    services: {
      website: "Sitios web personalizados",
      websiteText: "Sitios modernos, rapidos y adaptados a moviles que convierten visitantes en clientes.",
      profile: "Configuracion de perfiles digitales",
      profileText: "Perfiles claros y consistentes para que su negocio sea facil de encontrar y confiar.",
      google: "Google Business Profile",
      googleText: "Sea encontrado en Google Maps y Search con un perfil optimizado que genera confianza.",
      social: "Manejo de redes sociales",
      socialText: "Contenido, publicaciones y participacion consistente para mantener su negocio presente.",
      maintenance: "Mantenimiento del sitio web",
      maintenanceText: "Actualizaciones, cambios de contenido y revisiones basicas de rendimiento.",
      strategy: "Sistemas de mercadeo y automatizacion",
      strategyText: "Seguimientos, resenas y automatizaciones que ahorran tiempo e impulsan el negocio."
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
      intake: "Solicitudes",
      support: "Soporte",
      profile: "Perfil",
      welcome: "Bienvenido",
      activeProjects: "Proyectos activos",
      pendingForms: "Solicitudes abiertas",
      recentUpdates: "Actualizaciones recientes",
      currentPlan: "Plan actual",
      renewal: "Fecha de renovacion",
      includedServices: "Servicios incluidos",
      requestSupport: "Enviar solicitud de soporte",
      updateProfile: "Actualizar perfil",
      manageSubscription: "Administrar suscripcion",
      supportRequests: "Solicitudes de soporte",
      reportsDocuments: "Reportes y documentos"
    },
    developer: {
      overview: "Resumen",
      customers: "Clientes",
      workItems: "Tareas",
      intakeManager: "Administrador de desarrollo",
      projects: "Proyectos",
      contactMessages: "Mensajes de contacto",
      siteSettings: "Ajustes del sitio",
      websiteBuilder: "Constructor web",
      activeCustomers: "Clientes activos",
      openWorkItems: "Tareas abiertas",
      awaitingReview: "Pendientes de revision",
      projectsInProgress: "Proyectos en progreso",
      recentActivity: "Actividad reciente",
      createQuestion: "Crear pregunta",
      internalNotes: "Notas internas",
      planCatalog: "Catalogo de planes",
      workflowConfig: "Configuracion de flujo"
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
      rejected: "Rechazado",
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
