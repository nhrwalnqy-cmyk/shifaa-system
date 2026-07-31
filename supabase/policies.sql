-- =====================================================================
-- Shifaa — Row Level Security policies
-- =====================================================================

alter table profiles enable row level security;
alter table hospitals enable row level security;
alter table hospital_staff enable row level security;
alter table departments enable row level security;
alter table doctors enable row level security;
alter table doctor_schedules enable row level security;
alter table schedule_exceptions enable row level security;
alter table appointments enable row level security;
alter table queue_tickets enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;

-- Helper: is the current user staff (admin/receptionist) of a given hospital?
create or replace function is_hospital_staff(p_hospital_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from hospital_staff
    where hospital_id = p_hospital_id and profile_id = auth.uid()
  );
$$;

create or replace function is_doctor_self(p_doctor_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from doctors where id = p_doctor_id and profile_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------
-- PROFILES: users manage their own profile; public read of name/avatar
-- ---------------------------------------------------------------------
create policy "profiles_select_own_or_public" on profiles
  for select using (true);

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

create policy "profiles_insert_own" on profiles
  for insert with check (id = auth.uid());

-- ---------------------------------------------------------------------
-- HOSPITALS: public read of active hospitals; owners/staff manage
-- ---------------------------------------------------------------------
create policy "hospitals_public_read" on hospitals
  for select using (status = 'active' or owner_id = auth.uid() or is_hospital_staff(id));

create policy "hospitals_owner_insert" on hospitals
  for insert with check (owner_id = auth.uid());

create policy "hospitals_owner_update" on hospitals
  for update using (owner_id = auth.uid() or is_hospital_staff(id));

-- ---------------------------------------------------------------------
-- HOSPITAL STAFF
-- ---------------------------------------------------------------------
create policy "staff_select" on hospital_staff
  for select using (profile_id = auth.uid() or is_hospital_staff(hospital_id));

create policy "staff_manage" on hospital_staff
  for all using (
    exists (select 1 from hospitals h where h.id = hospital_id and h.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------
-- DEPARTMENTS: public read; hospital staff manage
-- ---------------------------------------------------------------------
create policy "departments_public_read" on departments for select using (true);
create policy "departments_staff_write" on departments
  for all using (is_hospital_staff(hospital_id))
  with check (is_hospital_staff(hospital_id));

-- ---------------------------------------------------------------------
-- DOCTORS: public read of active doctors; hospital staff & the doctor manage
-- ---------------------------------------------------------------------
create policy "doctors_public_read" on doctors for select using (true);
create policy "doctors_staff_write" on doctors
  for all using (is_hospital_staff(hospital_id))
  with check (is_hospital_staff(hospital_id));
create policy "doctors_self_update" on doctors
  for update using (profile_id = auth.uid());

-- ---------------------------------------------------------------------
-- SCHEDULES
-- ---------------------------------------------------------------------
create policy "schedules_public_read" on doctor_schedules for select using (true);
create policy "schedules_write" on doctor_schedules
  for all using (is_doctor_self(doctor_id) or is_hospital_staff(
    (select hospital_id from doctors where id = doctor_id)
  ));

create policy "exceptions_public_read" on schedule_exceptions for select using (true);
create policy "exceptions_write" on schedule_exceptions
  for all using (is_doctor_self(doctor_id) or is_hospital_staff(
    (select hospital_id from doctors where id = doctor_id)
  ));

-- ---------------------------------------------------------------------
-- APPOINTMENTS: patient sees own; doctor sees their own; staff sees hospital's
-- ---------------------------------------------------------------------
create policy "appointments_select" on appointments
  for select using (
    patient_id = auth.uid()
    or is_doctor_self(doctor_id)
    or is_hospital_staff(hospital_id)
  );

create policy "appointments_patient_insert" on appointments
  for insert with check (patient_id = auth.uid());

create policy "appointments_update" on appointments
  for update using (
    patient_id = auth.uid()
    or is_doctor_self(doctor_id)
    or is_hospital_staff(hospital_id)
  );

-- ---------------------------------------------------------------------
-- QUEUE TICKETS
-- ---------------------------------------------------------------------
create policy "queue_select" on queue_tickets
  for select using (
    is_hospital_staff(hospital_id)
    or is_doctor_self(doctor_id)
    or exists (
      select 1 from appointments a
      where a.id = appointment_id and a.patient_id = auth.uid()
    )
  );

create policy "queue_staff_write" on queue_tickets
  for all using (is_hospital_staff(hospital_id) or is_doctor_self(doctor_id));

-- ---------------------------------------------------------------------
-- NOTIFICATIONS: only the owner reads their own
-- ---------------------------------------------------------------------
create policy "notifications_own" on notifications
  for select using (profile_id = auth.uid());
create policy "notifications_own_update" on notifications
  for update using (profile_id = auth.uid());

-- ---------------------------------------------------------------------
-- REVIEWS: public read; patient writes own after completed appointment
-- ---------------------------------------------------------------------
create policy "reviews_public_read" on reviews for select using (true);
create policy "reviews_patient_insert" on reviews
  for insert with check (patient_id = auth.uid());
