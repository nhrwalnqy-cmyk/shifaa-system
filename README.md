# شفاء (Shifaa) — منصة الرعاية الصحية الذكية

Arabic-first, RTL, mobile-first healthcare SaaS platform for booking appointments and
tracking live clinic queues. Built with **Next.js 14 (App Router) + TypeScript +
Tailwind CSS + Supabase**, installable as a **PWA**.

## What's inside

| Role | Screens |
|---|---|
| **Patient** | Landing → phone/OTP register & login → search hospitals/doctors → doctor profile → booking → appointment history → **live queue tracking board** |
| **Hospital admin** | Self-registration → dashboard → departments → doctors → weekly schedules → appointments table → hospital-wide live queue |
| **Doctor** | Today's queue → call/complete patients → profile → weekly schedule |
| **Receptionist** | Check patients in → call next → skip → priority handling → live "now serving" board |

Design system: deep teal (`#0A3733`) + white, with an amber LED "now serving" board as
the signature UI element — modeled on the physical queue displays every clinic already
has on its wall.

---

## 1. Project structure

```
shifaa/
├── app/
│   ├── (auth)/            # login, register, hospital-register — route group, no URL segment
│   ├── patient/            # patient-facing app (bottom nav, mobile-first)
│   ├── hospital/            # hospital admin dashboard (sidebar)
│   ├── doctor/              # doctor dashboard (sidebar)
│   ├── reception/           # receptionist dashboard (sidebar)
│   ├── layout.tsx / page.tsx / globals.css
├── components/
│   ├── ui/                 # Button, Card, Input, Select, Badge, Avatar, StatCard
│   ├── layout/              # Logo, DashboardShell (sidebar), PatientBottomNav, PatientTopBar
│   └── queue/                # QueueBoard (signature LED board), QueueRow
├── lib/
│   ├── supabase/            # browser + server Supabase clients, generated DB types
│   ├── types.ts             # domain types + Arabic label maps
│   ├── utils.ts             # cn(), Arabic date/time formatting, queue math
│   └── mock-data.ts         # demo data so every screen renders without a live DB
├── supabase/
│   ├── schema.sql           # tables, enums, triggers, queue functions, realtime publication
│   ├── policies.sql          # row-level security
│   └── seed.sql              # demo hospitals/departments
├── middleware.ts             # Supabase session refresh + route protection
├── Dockerfile / docker-compose.yml
├── vercel.json
└── .github/workflows/ci.yml
```

Every page that reads/writes data has a `// SUPABASE:` comment showing the exact query
to use — the UI currently reads from `lib/mock-data.ts` so the whole app is clickable
and demo-able with zero backend setup. Swap those queries in as you wire up your
Supabase project.

---

## 2. Local setup

### Prerequisites
- Node.js 20+
- A free [Supabase](https://supabase.com) project (or the included Docker/local stack)

### Install & run

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (see step 3)
npm run dev
```

Visit `http://localhost:3000`. The app is installable as a PWA (Add to Home Screen) on
mobile — the manifest and service worker are already wired via `next-pwa`.

---

## 3. Supabase setup

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** and run, in order:
   1. `supabase/schema.sql` — tables, enums, triggers, queue-number & wait-time
      functions, and the realtime publication for `queue_tickets` / `appointments` /
      `notifications`.
   2. `supabase/policies.sql` — row-level security so patients only see their own
      appointments, hospital staff only see their hospital's data, etc.
   3. *(optional)* `supabase/seed.sql` — demo hospitals/departments to browse before you
      onboard real ones.
3. In **Authentication → Providers**, enable:
   - **Phone** (for patient OTP login/registration) — configure an SMS provider
     (Twilio, MessageBird, or Supabase's built-in test provider for development).
   - **Email** (for hospital admin / doctor / receptionist login).
4. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only — used for staff
     invitations; never expose this to the browser)
5. Regenerate typed DB types whenever the schema changes:
   ```bash
   npx supabase login
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
   ```
6. **Realtime**: `schema.sql` already adds `queue_tickets`, `appointments`, and
   `notifications` to the `supabase_realtime` publication, so the live queue board and
   patient tracking page can subscribe to `postgres_changes` out of the box (see the
   commented example in `app/patient/queue/[appointmentId]/page.tsx`).

### Data model at a glance

`profiles` (1 row per `auth.users`, role-tagged) → `hospitals` → `departments` →
`doctors` → `doctor_schedules` / `schedule_exceptions` → `appointments` →
`queue_tickets` (auto-created by a trigger when an appointment is checked in) →
`notifications`, `reviews`.

Queue math lives in Postgres functions (`next_queue_number`, `estimate_wait_minutes`)
so the "wait time" shown to a patient is always computed from live queue state, not
guessed client-side.

---

## 4. Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, **Add New → Project** and import the repo — `vercel.json` already sets
   the framework and build command.
3. Add environment variables (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark **Sensitive**, server-only)
4. Deploy. Vercel auto-detects Next.js 14 App Router; no further config is needed.
5. Add your production domain in Supabase **Authentication → URL Configuration** →
   *Site URL* and *Redirect URLs* so OTP/email auth callbacks work.
6. Optional: connect the GitHub repo to the included `.github/workflows/ci.yml` so
   lint + build run on every PR (add the same two `NEXT_PUBLIC_*` secrets under repo
   **Settings → Secrets and variables → Actions**).

---

## 5. Deploying with Docker

The `Dockerfile` is a multi-stage build using Next.js's `output: "standalone"` mode
(already set in `next.config.js`) for a minimal production image.

```bash
# Build
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -t shifaa:latest .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  shifaa:latest
```

Or with Compose (reads the same vars from a `.env` file in the project root):

```bash
cp .env.example .env
docker compose up --build
```

The app is then available at `http://localhost:3000`. This setup works behind any
reverse proxy (Nginx, Traefik, Caddy) for self-hosted/on-prem deployments — a common
requirement for hospital IT departments with data-residency constraints.

---

## 6. Roadmap / where to extend next

- Wire the `// SUPABASE:` comments into real queries (auth, CRUD, and the two realtime
  subscriptions in the patient queue-tracking and reception/doctor queue pages).
- Push notifications: the `notifications` table and `notification_channel` enum already
  support `push`; add a service worker push handler + a provider (FCM/OneSignal).
- Payments: `doctors.consultation_fee` is modeled; add a payment step in the booking
  flow if you charge for consultations online.
- Multi-branch hospitals: `hospital_staff` already supports multiple admins/receptionists
  per hospital — extend `hospitals` with a `parent_id` for hospital groups if needed.

---

## License

Provided as a starting codebase for your own healthcare product — adapt freely.
