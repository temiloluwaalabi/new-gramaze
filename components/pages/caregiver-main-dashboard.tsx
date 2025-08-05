"use client";
import { ChevronRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  caregiverAppointmentData,
  chatMessagesData,
  patientData,
} from "@/config/constants";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

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

export default function CaregiverMainDashboardClient() {
  const { user } = useUserStore();

  return (
    <section className="grid grid-cols-12 gap-6 space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="col-span-12 lg:col-span-6">
        <div className="rounded-lg bg-white p-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#787878]">
              Basic Information
            </h4>
            <div className="flex items-center gap-3">
              <Image
                src="https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg"
                width={90}
                height={90}
                className="size-[90px] rounded-[8px] object-cover"
                alt="mainImage"
              />
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-[#303030]">
                  {user?.first_name} {user?.last_name}
                </h4>
                <p className="text-sm font-normal text-[#66666B]">
                  {user?.email}
                </p>
                <Button className="!h-[24px] rounded-[4px] px-[7px] !py-[4px] text-sm font-medium text-white">
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
                {formatDate(user?.dob ?? "")}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Phone Number
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.phone}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Address
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.address || null}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Emergency Contact
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.emergency_contact_phone || null}
              </span>
            </span>
          </div>
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
          <div className="space-y-5">
            {caregiverAppointmentData.map((appointment) => (
              <CaregiverAppointmentWidget
                appointment={appointment}
                key={appointment.id}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-12 space-y-6 lg:col-span-6">
        <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-4">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-semibold text-[#333]">Messages</h6>
            <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
              See all <ChevronRight className="size-5 text-gray-500" />
            </span>
          </div>
          <div>
            {chatMessagesData.map((chat) => (
              <Message
                avatar={chat.sender.avatar}
                name={chat.sender.name}
                message={chat.message}
                timestamp={chat.timestamp}
                unreadCount={4}
                key={chat.id}
              />
            ))}
          </div>
        </div>
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

          <div className="space-y-3 sm:space-y-4">
            {patientData.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-md p-1 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Image
                    src={patient.avatar}
                    alt={`${patient.name}'s avatar`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 sm:text-base">
                      {patient.name}
                    </p>
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {patient.phone}
                    </p>
                  </div>
                </div>
                <button
                  className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label={`Email ${patient.name}`}
                >
                  <Mail size={18} className="sm:size-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
