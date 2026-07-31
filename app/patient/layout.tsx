import { PatientBottomNav } from "@/components/layout/PatientBottomNav";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper pb-20 sm:pb-0">
      {children}
      <PatientBottomNav />
    </div>
  );
}
