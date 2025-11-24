"use client";
import {
  ChevronRight,
  Mail,
  Calendar,
  Users,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { allRoutes } from "@/config/routes";
import {
  formatDate,
  initialsFromName,
  transformAppointmentData,
} from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { Appointment, User } from "@/types";

import { MessagePreview } from "./main-user-dashboard";
import { Message } from "../shared/message-widget";
import { CaregiverAppointmentWidget } from "../shared/widget/caregiver-appointment-widget";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

type CaregiverMainDashboardProps = {
  appointments: Appointment[];
  allPatients: {
    id: number;
    user_id: string;
    caregiver_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    patient: Partial<User>;
  }[];
  messages: MessagePreview[];
};

export default function CaregiverMainDashboardClient({
  appointments,
  allPatients,
  messages,
}: CaregiverMainDashboardProps) {
  const { user } = useUserStore();
  const router = useRouter();

  const transformedData =
    appointments.length > 0 ? transformAppointmentData(appointments) : [];

  console.log("APP PLAT", allPatients);
  console.log("APP AAA", appointments);
  return (
    <section className="grid size-full grid-cols-12 gap-6 space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="col-span-12 space-y-4 lg:col-span-6">
        <div className="rounded-lg bg-white p-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#787878]">
              Basic Information
            </h4>
            <div className="flex items-center gap-3">
              {/* <Image
                src="https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg"
                width={90}
                height={90}
                className="size-[90px] rounded-[8px] object-cover"
                alt="mainImage"
              /> */}

              <div className="flex size-[90px] items-center justify-center rounded-[8px] bg-blue-100 text-sm font-medium text-blue-600">
                {initialsFromName(
                  [user?.first_name, user?.last_name]
                    .filter(Boolean)
                    .join(" ")
                    .trim()
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-semibold text-[#303030]">
                  {user?.first_name} {user?.last_name}
                </h4>
                <p className="text-sm font-normal text-[#66666B]">
                  {user?.email}
                </p>
                <Button
                  onClick={() =>
                    router.push(allRoutes.user.dashboard.settings.url)
                  }
                  className="!h-[24px] rounded-[4px] px-[7px] !py-[4px] text-sm font-medium text-white"
                >
                  Manage profile
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="space-y-3">
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Date of Birth
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.dob ? formatDate(user.dob) : "Not provided"}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Phone Number
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.phone || "Not provided"}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Address
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.address || "Not provided"}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Emergency Contact
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.emergency_contact_phone || "Not provided"}
              </span>
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6">
          <div className="my-4 flex items-center justify-between">
            <h6 className="text-lg font-semibold text-[#333]">
              Your Appointments
            </h6>
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
      </div>

      <div className="col-span-12 space-y-6 lg:col-span-6">
        {/* Messages Section */}
        <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-4">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-semibold text-[#333]">Messages</h6>
            <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
              See all <ChevronRight className="size-5 text-gray-500" />
            </span>
          </div>

          {messages && messages.length > 0 ? (
            <div>
              {messages.slice(0, 4).map((msg: MessagePreview, idx: number) => (
                <Message
                  key={msg.id || idx}
                  avatar={msg.avatar}
                  name={msg.name}
                  message={msg.message}
                  timestamp={msg.timestamp}
                  unreadCount={msg.unreadCount}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-3 rounded-full bg-gray-50 p-3">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-base font-medium text-[#71717a]">
                No messages
              </span>
              <span className="mt-1 text-sm text-[#b0b0b0]">
                Please send a message to start a conversation.
              </span>
            </div>
          )}
        </div>

        {/* Patients Section */}
        <div className="w-full rounded-[6px] bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2 className="text-base font-medium text-gray-900 sm:text-lg">
              Patients
            </h2>
            <Link
              href="/caregiver/patients"
              className="flex items-center gap-1 text-xs text-gray-600 transition-colors hover:text-gray-900 sm:text-sm"
            >
              <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
                See all <ChevronRight className="size-5 text-gray-500" />
              </span>
            </Link>
          </div>

          {allPatients.filter(
            (pat) => pat.patient.email !== "superadmin@gramaze.com"
          ) &&
          allPatients.filter(
            (pat) => pat.patient.email !== "superadmin@gramaze.com"
          ).length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {allPatients
                .filter((pat) => pat.patient.email !== "superadmin@gramaze.com")
                .slice(0, 5)
                .map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between rounded-md p-1 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 sm:h-9 sm:w-9">
                        {patient.patient?.first_name?.charAt(0)}
                        {patient.patient?.last_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 sm:text-base">
                          {patient.patient.first_name}{" "}
                          {patient.patient.last_name}
                        </p>
                        <p className="text-xs text-gray-500 sm:text-sm">
                          {patient.patient.phone || patient.patient.email}
                        </p>
                      </div>
                    </div>
                    <button
                      className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label={`Email ${patient.patient?.first_name} ${patient.patient?.last_name}`}
                    >
                      <Mail size={18} className="sm:size-5" />
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-gray-50 p-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-base font-medium text-gray-900">
                No patients yet
              </h3>
              <p className="mb-6 text-center text-sm text-gray-500">
                You haven&apos;t been assigned any patients yet. Check back
                later or contact your administrator.
              </p>
              <Button variant="outline" className="text-sm">
                Contact Support
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
