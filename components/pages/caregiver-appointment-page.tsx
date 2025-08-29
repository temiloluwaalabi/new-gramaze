"use client";
import { Calendar, CalendarIcon, List, Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "react-day-picker";

import { cn, transformAppointmentData } from "@/lib/utils";
import { Appointment } from "@/types";

import { CaregiverAppointmentWidget } from "../shared/widget/caregiver-appointment-widget";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type CaregiverAppointmentClientPageProps = {
  appointments: Appointment[];
};

export default function CaregiverAppointmentClientPage({
  appointments,
}: CaregiverAppointmentClientPageProps) {
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const transformedData =
    appointments.length > 0 ? transformAppointmentData(appointments) : [];

  // Toggle between Grid and List view
  const toggleGridView = () => {
    setIsGridView(!isGridView);
  };
  return (
    <section className="h-full gap-6 space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="rounded-[6px] bg-white p-6">
        <div className="mb-4 flex w-full flex-col items-start justify-between gap-3 p-0 lg:flex-row lg:items-center">
          <div className="flex w-full items-center justify-between space-x-4">
            <div className="flex items-center space-x-5">
              <h6 className="text-lg font-semibold text-[#333]">
                Your Appointments
              </h6>{" "}
            </div>
          </div>

          <div className="flex w-full items-center justify-between space-x-2 lg:justify-end">
            <div className="flex overflow-hidden rounded-md border">
              <Select>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="daily">
                    Daily
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="weekly">
                    Weekly
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="monthly">
                    Monthly
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="yearly">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex">
              <Search className="absolute top-2.5 left-2 size-4 text-gray-400" />
              <Input
                placeholder="Search client..."
                className="h-[40px] w-full pl-8 lg:w-[296px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex cursor-pointer items-center gap-[8px] rounded-[6px] bg-[#ededed] p-[4px]">
              <span
                onClick={toggleGridView}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                  isGridView === true && "bg-white"
                )}
              >
                <CalendarIcon className="size-4" />
              </span>
              <span
                onClick={toggleGridView}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                  !isGridView && "bg-white"
                )}
              >
                {" "}
                <List className="size-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Appointments Section with Empty State */}
        <div className="space-y-5">
          {transformedData && transformedData.length > 0 ? (
            transformedData.map((appointment) => (
              <CaregiverAppointmentWidget
                appointment={appointment}
                key={appointment.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-gray-50 p-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-base font-medium text-gray-900">
                No appointments scheduled
              </h3>
              <p className="mb-6 text-center text-sm text-gray-500">
                You don&apos;t have any appointments yet. Schedule one to get
                started.
              </p>
              <Button className="text-sm">Schedule Appointment</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
