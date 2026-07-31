-- =====================================================================
-- Shifaa (شفاء) — Healthcare SaaS Platform
-- Supabase / PostgreSQL schema
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
create type user_role as enum ('patient', 'hospital_admin', 'doctor', 'receptionist');
create type appointment_status as enum ('booked', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
create type queue_status as enum ('waiting', 'called', 'in_progress', 'done', 'skipped', 'cancelled');
create type priority_level as enum ('normal', 'elderly', 'pregnant', 'disability', 'emergency');
create type gender as enum ('male', 'female');
create type weekday as enum ('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');
create type notification_channel as enum ('push', 'sms', 'in_app');
create type hospital_status as enum ('pending', 'active', 'suspended');

-- ---------------------------------------------------------------------
-- PROFILES  (extends auth.users — one row per authenticated user)
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  phone text unique not null,
  gender gender,
  date_of_birth date,
  national_id text,
  avatar_url text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table profiles is 'One row per authenticated user across all roles';

-- ---------------------------------------------------------------------
-- HOSPITALS
-- ---------------------------------------------------------------------
create table hospitals (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  license_number text not null,
  status hospital_status not null default 'pending',
  city text not null,
  district text,
  address text,
  latitude double precision,
  longitude double precision,
  phone text not null,
  email text,
  logo_url text,
  cover_url text,
  description text,
  rating numeric(2,1) default 0,
  rating_count integer default 0,
  open_24h boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table hospital_staff (
  id uuid primary key default uuid_generate_v4(),
  hospital_id uuid not null references hospitals(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role user_role not null check (role in ('hospital_admin','receptionist')),
  created_at timestamptz not null default now(),
  unique (hospital_id, profile_id)
);

-- ---------------------------------------------------------------------
-- DEPARTMENTS
-- ---------------------------------------------------------------------
create table departments (
  id uuid primary key default uuid_generate_v4(),
  hospital_id uuid not null references hospitals(id) on delete cascade,
  name text not null,
  name_en text,
  icon text default 'stethoscope',
  description text,
  avg_consultation_minutes integer not null default 15,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- DOCTORS
-- ---------------------------------------------------------------------
create table doctors (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  hospital_id uuid not null references hospitals(id) on delete cascade,
  department_id uuid not null references departments(id) on delete cascade,
  title text not null default 'دكتور',
  specialty text not null,
  bio text,
  years_experience integer default 0,
  consultation_fee numeric(10,2) default 0,
  avg_consultation_minutes integer default 15,
  rating numeric(2,1) default 0,
  rating_count integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  unique (profile_id, hospital_id)
);

-- ---------------------------------------------------------------------
-- DOCTOR SCHEDULES (weekly recurring availability)
-- ---------------------------------------------------------------------
create table doctor_schedules (
  id uuid primary key default uuid_generate_v4(),
  doctor_id uuid not null references doctors(id) on delete cascade,
  day_of_week weekday not null,
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 15,
  max_patients integer,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

-- One-off exceptions: doctor unavailable / extra clinic on a specific date
create table schedule_exceptions (
  id uuid primary key default uuid_generate_v4(),
  doctor_id uuid not null references doctors(id) on delete cascade,
  date date not null,
  is_unavailable boolean not null default true,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- APPOINTMENTS
-- ---------------------------------------------------------------------
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references profiles(id) on delete cascade,
  hospital_id uuid not null references hospitals(id) on delete cascade,
  department_id uuid not null references departments(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  appointment_date date not null,
  scheduled_time time not null,
  status appointment_status not null default 'booked',
  priority priority_level not null default 'normal',
  reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancel_reason text
);
create index idx_appointments_doctor_date on appointments (doctor_id, appointment_date);
create index idx_appointments_patient on appointments (patient_id, appointment_date desc);

-- ---------------------------------------------------------------------
-- QUEUE TICKETS — one per appointment, drives live queue tracking
-- ---------------------------------------------------------------------
create table queue_tickets (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null unique references appointments(id) on delete cascade,
  hospital_id uuid not null references hospitals(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  queue_date date not null,
  queue_number integer not null,
  status queue_status not null default 'waiting',
  priority priority_level not null default 'normal',
  checked_in_at timestamptz,
  called_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  estimated_wait_minutes integer,
  created_at timestamptz not null default now(),
  unique (doctor_id, queue_date, queue_number)
);
create index idx_queue_doctor_date_status on queue_tickets (doctor_id, queue_date, status);

-- ---------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  channel notification_channel not null default 'in_app',
  is_read boolean default false,
  related_appointment_id uuid references appointments(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null unique references appointments(id) on delete cascade,
  patient_id uuid not null references profiles(id) on delete cascade,
  doctor_id uuid not null references doctors(id) on delete cascade,
  hospital_id uuid not null references hospitals(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- FUNCTIONS
-- =====================================================================

-- Assign next sequential queue number per doctor/day
create or replace function next_queue_number(p_doctor_id uuid, p_date date)
returns integer
language sql
as $$
  select coalesce(max(queue_number), 0) + 1
  from queue_tickets
  where doctor_id = p_doctor_id and queue_date = p_date;
$$;

-- Estimate wait time (minutes) for a ticket based on patients ahead in queue
-- and the doctor's average consultation time.
create or replace function estimate_wait_minutes(p_ticket_id uuid)
returns integer
language plpgsql
as $$
declare
  v_doctor_id uuid;
  v_date date;
  v_number integer;
  v_avg_minutes integer;
  v_ahead integer;
begin
  select doctor_id, queue_date, queue_number
    into v_doctor_id, v_date, v_number
    from queue_tickets where id = p_ticket_id;

  select coalesce(avg_consultation_minutes, 15) into v_avg_minutes
    from doctors where id = v_doctor_id;

  select count(*) into v_ahead
    from queue_tickets
    where doctor_id = v_doctor_id
      and queue_date = v_date
      and status in ('waiting','called')
      and queue_number < v_number;

  return greatest(v_ahead, 0) * v_avg_minutes;
end;
$$;

-- Auto-create a queue ticket whenever an appointment is checked in
create or replace function fn_create_queue_ticket()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'checked_in' and (old.status is distinct from 'checked_in') then
    insert into queue_tickets (appointment_id, hospital_id, doctor_id, queue_date, queue_number, priority, checked_in_at)
    values (
      new.id, new.hospital_id, new.doctor_id, new.appointment_date,
      next_queue_number(new.doctor_id, new.appointment_date),
      new.priority, now()
    )
    on conflict (appointment_id) do nothing;
  end if;
  return new;
end;
$$;

create trigger trg_appointment_checked_in
  after update of status on appointments
  for each row execute function fn_create_queue_ticket();

-- Keep updated_at fresh
create or replace function fn_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_touch before update on profiles
  for each row execute function fn_touch_updated_at();
create trigger trg_hospitals_touch before update on hospitals
  for each row execute function fn_touch_updated_at();
create trigger trg_appointments_touch before update on appointments
  for each row execute function fn_touch_updated_at();

-- =====================================================================
-- REALTIME — expose queue + appointments to Supabase Realtime
-- =====================================================================
alter publication supabase_realtime add table queue_tickets;
alter publication supabase_realtime add table appointments;
alter publication supabase_realtime add table notifications;
