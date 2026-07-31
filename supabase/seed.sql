-- =====================================================================
-- Shifaa — demo seed data (run after schema.sql + policies.sql)
-- Note: profile ids below should match real auth.users ids in your
-- Supabase project. Replace the uuids with users created via
-- supabase.auth.signUp() during onboarding, or insert test auth users
-- first via the Supabase dashboard.
-- =====================================================================

insert into hospitals (id, name, slug, license_number, status, city, district, address, phone, rating, rating_count, open_24h)
values
  ('11111111-1111-1111-1111-111111111111', 'مستشفى النور التخصصي', 'al-noor', 'LIC-1001', 'active', 'الرياض', 'العليا', 'شارع الملك فهد', '0114001000', 4.6, 812, true),
  ('22222222-2222-2222-2222-222222222222', 'مستشفى الشفاء العام', 'al-shifa', 'LIC-1002', 'active', 'جدة', 'الروضة', 'شارع فلسطين', '0126002000', 4.3, 540, false);

insert into departments (id, hospital_id, name, name_en, icon, avg_consultation_minutes) values
  ('a1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'الباطنية', 'Internal Medicine', 'stethoscope', 15),
  ('a1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'الأطفال', 'Pediatrics', 'baby', 12),
  ('a1111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'الجلدية', 'Dermatology', 'sparkles', 15),
  ('a2222222-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'القلب', 'Cardiology', 'heart-pulse', 20);

-- Sample queue-day counters etc. are generated at runtime by the app.
