"use client";

import { Calendar as CalendarIcon, List } from "lucide-react";
import { useState, useEffect } from "react";

import { DbAppointmentSheet } from "@/components/sheets/db-appointment-sheet";
import { AppointmentStatus } from "@/components/table/columns/appointment-columns";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, determineAppointmentStatus, formatDate, createAppointmentEndTime } from "@/lib/utils";
import { Appointment } from "@/types";

type AppointmentsContentProps = {
  appointments: Appointment[];
};

export function AppointmentsContent({ appointments }: AppointmentsContentProps) {
  const [appointmentView, setAppointmentView] = useState("list");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setAppointmentView("list");
    }
  }, [isMobile]);

  return (
    <div className="w-full space-y-6 rounded-[6px] border border-[#E8E8E8] bg-white p-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#71717a]">
          Upcoming Appointment
        </span>
        <div className="flex cursor-pointer items-center gap-[8px] rounded-[6px] bg-[#ededed] p-[4px]">
          <span
            onClick={() => setAppointmentView("calendar")}
            className={cn(
              "hidden size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white md:flex",
              appointmentView === "calendar" && "bg-white"
            )}
          >
            <CalendarIcon className="size-4" />
          </span>
          <span
            onClick={() => setAppointmentView("list")}
            className={cn(
              "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
              appointmentView === "list" && "bg-white"
            )}
          >
            <List className="size-4" />
          </span>
        </div>
      </div>

      {/* Calendar View */}
      {appointmentView === "calendar" ? (
        <Calendar
          mode="single"
          captionLayout="dropdown"
          className="hidden w-fit cursor-pointer !p-0 md:block md:w-full"
          classNames={{
            head_cell: "w-8 text-sm text-blue-600 font-medium",
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const dayAppointments =
                appointments?.filter(
                  (appointment) =>
                    new Date(appointment.date).toDateString() ===
                    day.date.toDateString()
                ) || [];

              return (
                <CalendarDayButton
                  day={day}
                  className="flex flex-col items-end justify-end"
                  modifiers={modifiers}
                  {...props}
                >
                  {children}
                  {dayAppointments.length > 0 && (
                    <span className="">
                      {Array.from({
                        length: Math.min(dayAppointments.length, 3),
                      }).map((_, idx) => (
                        <span
                          key={idx}
                          className="inline-block h-1 w-1 rounded-full bg-blue-500"
                        />
                      ))}
                      {dayAppointments.length > 3 && (
                        <span className="ml-0.5 text-[8px] font-bold text-blue-500">
                          +
                        </span>
                      )}
                    </span>
                  )}
                </CalendarDayButton>
              );
            },
          }}
        />
      ) : (
        /* List View */
        <div className="space-y-[18px]">
          {appointments &&
          appointments.filter(
            (appointment) => new Date(appointment.date) > new Date()
          ).length > 0 ? (
            appointments
              .filter(
                (appointment) => new Date(appointment.date) > new Date()
              )
              .slice(0, 3)
              .map((appointment) => {
                const status = determineAppointmentStatus(appointment);
                return (
                  <DbAppointmentSheet
                    key={appointment.id}
                    appointment={appointment}
                    sheetTrigger={
                      <div className="flex cursor-pointer flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <span
                            className={cn(
                              "size-[6px]",
                              status === ("confirmed" as AppointmentStatus)
                                ? "bg-green-500"
                                : status === ("pending" as AppointmentStatus)
                                  ? "bg-yellow-500"
                                  : status === ("cancelled" as AppointmentStatus)
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                            )}
                          />
                          <span className="text-sm font-semibold text-[#303030]">
                            {formatDate(new Date(appointment.date))}
                          </span>
                        </span>
                        <div className="mt-2 ml-4 flex h-fit items-center gap-2 rounded-[10px] border border-[#E8E8E8] bg-white p-[10px] md:h-[54px]">
                          <div className="h-[40px] w-[2px] bg-red-600 md:h-full" />
                          <div className="gap-1 text-[12px] text-[#66666B]">
                            <h4 className="text-left font-medium">
                              <span className="capitalize">
                                {appointment.appointment_type}{" "}
                                {appointment.visit_type} Appointment
                              </span>{" "}
                              @ {appointment.time}
                              {appointment.appointment_type === "virtual" &&
                              createAppointmentEndTime(
                                appointment.date,
                                appointment.time
                              )
                                ? ` -  ${formatDate(appointment.date)}`
                                : null}
                            </h4>
                            <p className="text-left font-normal">
                              {appointment.appointment_type === "physical" ? (
                                appointment.visit_type === "home" ? (
                                  <span>
                                    House Address: {appointment.location}
                                    <br />
                                    Hospital Address:{" "}
                                    {appointment.hospital_info?.address}
                                    <br />
                                    Hospital Name:{" "}
                                    {appointment.hospital_info?.name}
                                  </span>
                                ) : (
                                  <span>
                                    Hospital Address:{" "}
                                    {appointment.hospital_info?.address}
                                    <br />
                                    Hospital Name:{" "}
                                    {appointment.hospital_info?.name}
                                  </span>
                                )
                              ) : (
                                <span>
                                  House Address: {appointment.location}
                                  <br />
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  />
                );
              })
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <CalendarIcon className="mb-3 text-[#b0b0b0]" size={48} />
              <span className="text-base font-medium text-[#71717a]">
                No appointments found
              </span>
              <span className="mt-1 text-sm text-[#b0b0b0]">
                You have no upcoming appointments at the moment.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}