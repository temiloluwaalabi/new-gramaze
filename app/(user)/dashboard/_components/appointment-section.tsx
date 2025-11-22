import { getUserAppointments } from "@/app/actions/services/appointment.actions";

import { AppointmentsContent } from "./appointment-content";

export async function AppointmentsSection() {
  // ✅ Fetch data in Server Component
  const appointments = await getUserAppointments();
  const mainAppointments = appointments.appointments.data;

  // ✅ Pass data to Client Component
  return <AppointmentsContent appointments={mainAppointments} />;
}

export function AppointmentsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}