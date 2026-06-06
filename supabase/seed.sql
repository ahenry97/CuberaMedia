insert into public.site_settings (id, business_display_name, contact_email, phone_number, social_links, default_language, maintenance_mode)
values (
  'default',
  'Cubera Digital Solutions',
  'hello@cuberadigital.example',
  '787-555-0100',
  '{"facebook":"","instagram":"","linkedin":""}'::jsonb,
  'en',
  false
)
on conflict (id) do update set
  business_display_name = excluded.business_display_name,
  contact_email = excluded.contact_email,
  phone_number = excluded.phone_number,
  social_links = excluded.social_links,
  default_language = excluded.default_language,
  maintenance_mode = excluded.maintenance_mode;

insert into public.intake_questions (label_en, label_es, help_text_en, help_text_es, question_type, required, display_order, active, options_json)
values
  ('What is the main goal for this project?', 'Cual es la meta principal de este proyecto?', 'Describe the business result you want first.', 'Describa primero el resultado comercial que desea.', 'long_text', true, 1, true, '[]'::jsonb),
  ('Which service do you need?', 'Que servicio necesita?', 'Choose the service that best matches your current need.', 'Seleccione el servicio que mejor coincide con su necesidad actual.', 'single_select', true, 2, true, '["Website creation","Google Business Profile","Social media marketing","Digital strategy"]'::jsonb),
  ('Do you already have a website?', 'Ya tiene un sitio web?', 'Include the URL if one exists.', 'Incluya el enlace si existe.', 'url', false, 3, true, '[]'::jsonb);
