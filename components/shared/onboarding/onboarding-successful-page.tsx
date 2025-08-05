"use client";
import { format } from "date-fns";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboarding } from "@/context/onboarding-context";
import CalendarBlankIcon from "@/icons/calendar-blank";

import { Logo } from "../logo";

export default function OnboardingSuccess() {
  const { data, resetState } = useOnboarding();
  const router = useRouter();
  const parsedDate = data.appointment.date
    ? new Date(data.appointment.date)
    : new Date();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 py-4 lg:py-10">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo
            logoLink="https://res.cloudinary.com/davidleo/image/upload/v1744665654/gramaze-logo_yt4zo6.png"
            className="flex h-[60px] w-[229px] items-end justify-end"
          />
        </div>

        {/* Success Message */}
        <div className="mb-2 flex items-center rounded-md bg-emerald-50 p-4 text-green-800">
          <span className="mr-3 flex !size-8 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="size-4" />
          </span>
          <p className="text-xs md:text-sm lg:text-base">
            Congratulations! We have sent your appointment details to your
            email.
          </p>
        </div>

        {/* Appointment Details */}
        <Card className="mb-2 border-none bg-transparent shadow-none outline-none">
          <CardContent className="p-0">
            <h1 className="mb-6 text-lg font-bold text-black md:text-xl lg:text-2xl">
              Appointment Confirmation
            </h1>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">
                  Booked for:
                </div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  {data.personalInfo.fullName}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">
                  Date & Time:
                </div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  {format(parsedDate, "PPP")} | {data.appointment.time}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">
                  Appointment type:
                </div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  <span className="capitalize">{data.appointment.type}</span>{" "}
                  appointment
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">
                  Contact details:
                </div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  {data.appointment.email}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 rounded-[6px] border-gray-300 bg-transparent text-base font-medium text-[#030712]"
              >
                <Image
                  src="/asset/icon/logos_google-calendar.svg"
                  width={24}
                  height={24}
                  alt="google calendar"
                />
                Add to Calendar
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 rounded-[6px] border-gray-300 bg-transparent text-base font-medium text-[#030712]"
              >
                <CalendarBlankIcon className="size-6" />
                Reschedule Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="h-px w-full border border-gray-300" />

        {/* Location Details */}
        <Card className="mb-6 border-none bg-transparent shadow-none outline-none">
          <CardContent className="p-0">
            <h2 className="mb-4 text-xl font-bold text-[#303030]">
              Location Details
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                    <MapPin className="size-4 text-blue-600" />
                  </span>
                  <span className="text-sm font-medium text-gray-600 lg:text-base">
                    Lagos State State Hospital, Ikeja, Lagos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                    <Phone className="size-4 text-blue-600" />
                  </span>
                  <span className="text-sm font-medium text-gray-600 lg:text-base">
                    08167879000{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                    <Mail className="size-4 text-blue-600" />
                  </span>
                  <Link
                    href="mailto:enquiry@lasuth.org.ng"
                    className="text-sm font-medium text-gray-600 underline lg:text-base"
                  >
                    enquiry@lasuth.org.ng
                  </Link>
                </div>
              </div>

              <div className="">
                {/* Map would go here - using a placeholder */}
                <Image
                  src="/asset/images/map.png"
                  alt="Hospital Location Map"
                  width={313}
                  height={162}
                  className="h-[162px] w-full rounded-md object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Button */}
        <Button
          className="relative mb-6 w-full text-white"
          onClick={() => {
            router.push("/dashboard");
            resetState();
          }}
        >
          {/* <Link
            href="/dashboard"
            className="absolute top-0 left-0 z-50 flex size-full"
          /> */}
          Go to Dashboard
        </Button>

        {/* Help Section */}
        <Card className="border-gray-300 bg-transparent p-0 shadow-none outline-none">
          <CardContent className="p-5">
            <h2 className="text-gray-600font-medium mb-2 text-lg">
              Need help or have any questions?
            </h2>
            <p className="text-sm font-normal text-gray-400">
              Send us an email at gramazecare@gmail.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
