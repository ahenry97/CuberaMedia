import { hashPassword } from "@/lib/auth/password";
import type { AppData } from "@/lib/types";

const now = () => new Date().toISOString();

export async function createSeedData(): Promise<AppData> {
  const timestamp = now();
  const passwordHash = await hashPassword("Password123!");

  return {
    authUsers: [
      {
        id: "auth-customer-1",
        email: "customer@example.com",
        password_hash: passwordHash,
        provider: "email",
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "auth-developer-1",
        email: "developer@example.com",
        password_hash: passwordHash,
        provider: "email",
        created_at: timestamp,
        updated_at: timestamp
      }
    ],
    profiles: [
      {
        id: "profile-customer-1",
        auth_user_id: "auth-customer-1",
        full_name: "Marisol Rivera",
        email: "customer@example.com",
        phone: "787-555-0188",
        business_name: "Rivera Cafe",
        preferred_language: "en",
        role: "customer",
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "profile-developer-1",
        auth_user_id: "auth-developer-1",
        full_name: "Aaron Henry",
        email: "developer@example.com",
        phone: "787-555-0100",
        business_name: "Cubera Digital Solutions",
        preferred_language: "en",
        role: "developer",
        created_at: timestamp,
        updated_at: timestamp
      }
    ],
    subscriptions: [
      {
        id: "subscription-1",
        customer_id: "profile-customer-1",
        plan_name: "Growth",
        status: "active",
        renewal_date: "2026-09-01",
        included_services: ["Website maintenance", "Google Business Profile support", "Monthly strategy check-in"],
        created_at: timestamp,
        updated_at: timestamp
      }
    ],
    plans: [
      {
        id: "plan-starter",
        name: "Starter",
        monthly_price: "$149",
        description_en: "A practical launch plan for businesses getting online for the first time.",
        description_es: "Un plan practico para negocios que comienzan su presencia digital.",
        features_en: ["Basic website setup", "Business profile checklist", "Email support"],
        features_es: ["Configuracion basica de sitio web", "Lista de perfil comercial", "Soporte por correo"]
      },
      {
        id: "plan-growth",
        name: "Growth",
        monthly_price: "$299",
        description_en: "A stronger digital foundation with ongoing support and local marketing help.",
        description_es: "Una base digital mas fuerte con soporte continuo y ayuda de mercadeo local.",
        features_en: ["Website updates", "Google Business Profile support", "Monthly social content plan"],
        features_es: ["Actualizaciones del sitio", "Soporte de Google Business Profile", "Plan mensual de contenido social"]
      },
      {
        id: "plan-premium",
        name: "Premium",
        monthly_price: "$499",
        description_en: "Hands-on support for businesses that want a managed digital presence.",
        description_es: "Soporte completo para negocios que desean una presencia digital administrada.",
        features_en: ["Priority updates", "Project planning", "Campaign review", "Quarterly strategy session"],
        features_es: ["Actualizaciones prioritarias", "Planificacion de proyectos", "Revision de campanas", "Sesion estrategica trimestral"]
      }
    ],
    projects: [
      {
        id: "project-1",
        customer_id: "profile-customer-1",
        name: "Cafe website refresh",
        service_type: "Website creation",
        status: "in_progress",
        description: "Refresh the cafe website with service pages, menu highlights, and contact flow.",
        assigned_to: "profile-developer-1",
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "project-2",
        customer_id: "profile-customer-1",
        name: "Google profile setup",
        service_type: "Google Business Profile",
        status: "planning",
        description: "Prepare business listing content, photos, and verification checklist.",
        assigned_to: "profile-developer-1",
        created_at: timestamp,
        updated_at: timestamp
      }
    ],
    intakeQuestions: [
      {
        id: "question-1",
        label_en: "What is the main goal for this project?",
        label_es: "Cual es la meta principal de este proyecto?",
        help_text_en: "Describe the business result you want first.",
        help_text_es: "Describe primero el resultado comercial que desea.",
        question_type: "long_text",
        required: true,
        display_order: 1,
        active: true,
        archived: false,
        options_json: [],
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "question-2",
        label_en: "Which service do you need?",
        label_es: "Que servicio necesita?",
        help_text_en: "Choose the service that best matches your current need.",
        help_text_es: "Seleccione el servicio que mejor coincide con su necesidad actual.",
        question_type: "single_select",
        required: true,
        display_order: 2,
        active: true,
        archived: false,
        options_json: ["Website creation", "Google Business Profile", "Social media marketing", "Digital strategy"],
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "question-3",
        label_en: "Do you already have a website?",
        label_es: "Ya tiene un sitio web?",
        help_text_en: "Include the URL if one exists.",
        help_text_es: "Incluya el enlace si existe.",
        question_type: "url",
        required: false,
        display_order: 3,
        active: true,
        archived: false,
        options_json: [],
        created_at: timestamp,
        updated_at: timestamp
      }
    ],
    intakeSubmissions: [],
    intakeAnswers: [],
    workItems: [
      {
        id: "work-1",
        customer_id: "profile-customer-1",
        project_id: "project-1",
        intake_submission_id: null,
        title: "Finalize homepage copy",
        source_type: "manual",
        status: "in_progress",
        priority: "normal",
        assigned_to: "profile-developer-1",
        archived: false,
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "work-2",
        customer_id: "profile-customer-1",
        project_id: "project-2",
        intake_submission_id: null,
        title: "Prepare Google profile verification steps",
        source_type: "manual",
        status: "reviewing",
        priority: "high",
        assigned_to: "profile-developer-1",
        archived: false,
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: "work-3",
        customer_id: "profile-customer-1",
        project_id: null,
        intake_submission_id: null,
        title: "Review social media profile links",
        source_type: "support_request",
        status: "new",
        priority: "low",
        assigned_to: null,
        archived: false,
        created_at: timestamp,
        updated_at: timestamp
      }
    ],
    workItemNotes: [
      {
        id: "note-1",
        work_item_id: "work-1",
        author_id: "profile-developer-1",
        note: "Need client approval on the first service description.",
        visibility: "internal",
        created_at: timestamp
      }
    ],
    contactMessages: [],
    siteSettings: {
      business_display_name: "Cubera Digital Solutions",
      contact_email: "hello@cuberadigital.example",
      phone_number: "787-555-0100",
      social_links: {
        facebook: "",
        instagram: "",
        linkedin: ""
      },
      default_language: "en",
      maintenance_mode: false
    },
    activity: [
      {
        id: "activity-1",
        message_en: "Seed project data created for Rivera Cafe.",
        message_es: "Datos de proyecto iniciales creados para Rivera Cafe.",
        created_at: timestamp
      }
    ]
  };
}
