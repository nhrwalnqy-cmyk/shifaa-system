export type StaffRole = "admin" | "hospital_admin" | "doctor" | "receptionist";

export type AppointmentStatus =
  | "booked"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type QueueStatus = "waiting" | "called" | "in_progress" | "done" | "skipped" | "cancelled";

export type PriorityLevel = "normal" | "elderly" | "pregnant" | "disability" | "emergency";

export type Weekday = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export interface Governorate {
  id: string;
  name_ar: string;
  name_en?: string;
}

export interface District {
  id: string;
  governorate_id: string;
  name_ar: string;
  name_en?: string;
}

export interface Profile {
  id: string;
  role: StaffRole;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  date_of_birth?: string | null;
  gender?: "male" | "female";
  governorate_id?: string | null;
  district_id?: string | null;
  notes?: string | null;
}

export interface Hospital {
  id: string;
  name: string;
  slug: string;
  governorate_id: string;
  governorate_name?: string;
  district_id?: string | null;
  district_name?: string;
  address?: string | null;
  phone: string;
  logo_url?: string | null;
  cover_url?: string | null;
  description?: string | null;
  rating: number;
  rating_count: number;
  open_24h: boolean;
  status: "pending" | "active" | "suspended";
  departments_count?: number;
  doctors_count?: number;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  name_en?: string;
  icon: string;
  avg_consultation_minutes: number;
  doctors_count?: number;
}

export interface Doctor {
  id: string;
  profile_id: string;
  hospital_id: string;
  department_id: string;
  governorate_id?: string | null;
  district_id?: string | null;
  full_name: string;
  title: string;
  specialty: string;
  bio?: string;
  years_experience: number;
  consultation_fee: number;
  avg_consultation_minutes: number;
  rating: number;
  rating_count: number;
  is_active: boolean;
  avatar_url?: string | null;
  hospital_name?: string;
  department_name?: string;
  next_available?: string;
}

export interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: Weekday;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  max_patients?: number | null;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  patient_ref_id: string;
  patient_name?: string;
  booking_code?: string;
  hospital_id: string;
  hospital_name?: string;
  department_id: string;
  department_name?: string;
  doctor_id: string;
  doctor_name?: string;
  appointment_date: string;
  scheduled_time: string;
  status: AppointmentStatus;
  priority: PriorityLevel;
  reason?: string;
  notes?: string;
}

export interface QueueTicket {
  id: string;
  appointment_id: string;
  hospital_id: string;
  doctor_id: string;
  queue_date: string;
  queue_number: number;
  status: QueueStatus;
  priority: PriorityLevel;
  estimated_wait_minutes: number;
  patient_name?: string;
  checked_in_at?: string | null;
  called_at?: string | null;
}

export const WEEKDAY_LABELS_AR: Record<Weekday, string> = {
  sun: "الأحد", mon: "الاثنين", tue: "الثلاثاء", wed: "الأربعاء",
  thu: "الخميس", fri: "الجمعة", sat: "السبت",
};

export const PRIORITY_LABELS_AR: Record<PriorityLevel, string> = {
  normal: "عادي", elderly: "كبار السن", pregnant: "حامل",
  disability: "ذوي الإعاقة", emergency: "حالة طارئة",
};

export const APPOINTMENT_STATUS_LABELS_AR: Record<AppointmentStatus, string> = {
  booked: "محجوز", checked_in: "تم تسجيل الوصول", in_progress: "قيد الكشف",
  completed: "مكتمل", cancelled: "ملغى", no_show: "لم يحضر",
};

export const QUEUE_STATUS_LABELS_AR: Record<QueueStatus, string> = {
  waiting: "بالانتظار", called: "تم النداء", in_progress: "قيد الكشف",
  done: "تم الانتهاء", skipped: "تم التخطي", cancelled: "ملغى",
};

export const STAFF_ROLE_LABELS_AR: Record<StaffRole, string> = {
  admin: "مدير النظام", hospital_admin: "مسؤول المنشأة",
  doctor: "طبيب", receptionist: "موظف استقبال",
};
