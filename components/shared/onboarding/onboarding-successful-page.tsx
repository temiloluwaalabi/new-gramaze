"use client";
import { format } from "date-fns";
import { Check, Mail, MapPin, Phone, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { ReschedileAppointmentSheet } from "@/components/sheets/reschedule-appointment-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboarding } from "@/context/onboarding-context";
import CalendarBlankIcon from "@/icons/calendar-blank";
import { Appointment, hospital } from "@/types";

import { Logo } from "../logo";

type OnboardingSuccessProps = {
  appointment: Appointment;
  hospitals: hospital[];
};

export default function OnboardingSuccess({
  appointment,
  hospitals,
}: OnboardingSuccessProps) {
  const { data, resetState } = useOnboarding();
  const router = useRouter();
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const hospital = hospitals.find(
    (h) => h.id.toString() === appointment.hospital_name
  );
  // Use live appointment data instead of onboarding context
  const appointmentDate = appointment.date
    ? new Date(appointment.date)
    : new Date();
  const isVirtualAppointment = appointment.appointment_type === "virtual";

  // Calendar functionality
  const generateCalendarEvent = () => {
    const startDate = new Date(appointmentDate);
    const [hours, minutes] = appointment.time.split(":");
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Assume 1 hour duration for appointments
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const eventDetails = {
      title: encodeURIComponent(
        `${appointment.appointment_type} Appointment - Gramaze Care`
      ),
      startTime: formatDate(startDate),
      endTime: formatDate(endDate),
      description: encodeURIComponent(
        `${appointment.appointment_type} appointment with Gramaze Care\n\n` +
          `Patient: ${data.personalInfo.fullName}\n` +
          `Type: ${appointment.appointment_type}\n` +
          `Status: ${appointment.status}\n` +
          (isVirtualAppointment
            ? `Meeting Link: ${appointment.meeting_link}\n`
            : `Location: ${appointment.location || appointment.hospital_name || "TBD"}\n`) +
          (appointment.additional_note
            ? `\nNotes: ${appointment.additional_note}`
            : "")
      ),
      location: encodeURIComponent(
        isVirtualAppointment
          ? `Online via Zoom: ${appointment.meeting_link || ""}`
          : appointment.location || appointment.hospital_name || "TBD"
      ),
    };

    return eventDetails;
  };

  const handleAddToCalendar = () => {
    const event = generateCalendarEvent();

    // Google Calendar URL
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${event.startTime}/${event.endTime}&details=${event.description}&location=${event.location}`;

    window.open(googleCalendarUrl, "_blank");
  };

  const handleOutlookCalendar = () => {
    const event = generateCalendarEvent();

    // Outlook Calendar URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${event.title}&startdt=${event.startTime}&enddt=${event.endTime}&body=${event.description}&location=${event.location}`;

    window.open(outlookUrl, "_blank");
  };

  const handleAppleCalendar = () => {
    const event = generateCalendarEvent();

    // Create ICS file content
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gramaze Care//EN",
      "BEGIN:VEVENT",
      `DTSTART:${event.startTime}`,
      `DTEND:${event.endTime}`,
      `SUMMARY:${decodeURIComponent(event.title)}`,
      `DESCRIPTION:${decodeURIComponent(event.description)}`,
      `LOCATION:${decodeURIComponent(event.location)}`,
      `UID:${appointment.id}@gramazecare.com`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    // Create and download ICS file
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gramaze-appointment.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                  {format(appointmentDate, "PPP")} | {appointment.time}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">
                  Appointment type:
                </div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  <span className="capitalize">
                    {appointment.appointment_type}
                  </span>{" "}
                  appointment
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">
                  {isVirtualAppointment ? "Meeting Link:" : "Contact details:"}
                </div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  {isVirtualAppointment ? (
                    <Link
                      href={appointment.meeting_link || "#"}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Zoom Meeting
                    </Link>
                  ) : (
                    appointment.contact || data.appointment.email
                  )}
                </div>
              </div>

              {appointment.location && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-normal text-gray-500">
                    Location:
                  </div>
                  <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                    {appointment.location}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-normal text-gray-500">Status:</div>
                <div className="col-span-2 text-right text-xs font-medium text-gray-600 md:text-sm lg:text-base">
                  <span
                    className={`rounded-full px-2 py-1 text-xs capitalize ${
                      appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border-gray-300 bg-transparent text-base font-medium text-[#030712]"
                  onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                >
                  <Image
                    src="/asset/icon/logos_google-calendar.svg"
                    width={24}
                    height={24}
                    alt="google calendar"
                  />
                  Add to Calendar
                  <ChevronDown className="ml-1 size-4" />
                </Button>

                {/* Calendar Options Dropdown */}
                {showCalendarOptions && (
                  <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-[6px] border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={() => {
                        handleAddToCalendar();
                        setShowCalendarOptions(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-t-[6px] px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Image
                        src="/asset/icon/logos_google-calendar.svg"
                        width={20}
                        height={20}
                        alt="google calendar"
                      />
                      Google Calendar
                    </button>

                    <button
                      onClick={() => {
                        handleOutlookCalendar();
                        setShowCalendarOptions(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-500">
                        <Mail className="size-3 text-white" />
                      </div>
                      Outlook Calendar
                    </button>

                    <button
                      onClick={() => {
                        handleAppleCalendar();
                        setShowCalendarOptions(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-b-[6px] px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-800 text-xs font-bold text-white">
                        📅
                      </div>
                      Apple Calendar (.ics)
                    </button>
                  </div>
                )}
              </div>
              <ReschedileAppointmentSheet
                appoinment={appointment.id.toString()}
                sheetTrigger={
                  <Button
                    variant="outline"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] border-gray-300 bg-transparent text-base font-medium text-[#030712]"
                  >
                    <CalendarBlankIcon className="size-6" />
                    Reschedule Appointment
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="h-px w-full border border-gray-300" />

        {/* Location Details */}
        {!isVirtualAppointment && (
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
                      {hospital?.name ||
                        "Lagos State State Hospital, Ikeja, Lagos"}
                    </span>
                  </div>
                  {hospital?.address && (
                    <div className="flex items-center gap-2">
                      <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                        <MapPin className="size-4 text-blue-600" />
                      </span>
                      <span className="text-sm font-medium text-gray-600 lg:text-base">
                        {hospital.address}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                      <Phone className="size-4 text-blue-600" />
                    </span>
                    <span className="text-sm font-medium text-gray-600 lg:text-base">
                      {hospital?.contact_person || "08167879000"}
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
                      {hospital?.contact_person}
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
        )}

        {/* Virtual Meeting Info for virtual appointments */}
        {isVirtualAppointment && (
          <Card className="mb-6 border-none bg-transparent shadow-none outline-none">
            <CardContent className="p-0">
              <h2 className="mb-4 text-xl font-bold text-[#303030]">
                Virtual Meeting Details
              </h2>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-3">
                  <h3 className="mb-2 text-base font-semibold text-blue-900">
                    Meeting Information
                  </h3>
                  <p className="mb-3 text-sm text-blue-700">
                    Your appointment will be conducted online via Zoom. Please
                    ensure you have a stable internet connection.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      Meeting Link:
                    </span>
                    <Link
                      href={appointment.meeting_link || "#"}
                      className="text-sm text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                    </Link>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    💡 Tip: Join the meeting 5 minutes early to test your audio
                    and video
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {appointment.additional_note && (
          <Card className="mb-6 border-none bg-transparent shadow-none outline-none">
            <CardContent className="p-0">
              <h2 className="mb-4 text-xl font-bold text-[#303030]">
                Additional Notes
              </h2>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  {appointment.additional_note}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          className="relative mb-6 w-full text-white"
          onClick={() => {
            router.push("/dashboard");
            resetState();
          }}
        >
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
