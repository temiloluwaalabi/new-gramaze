// @flow
import { Calendar, Clock, Ellipsis, MapPin, Video } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { CaregiverAppointmentSheet } from "@/components/sheets/caregiver-appointment-sheet";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_IMAGE_URL } from "@/config/constants";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types";

type Props = {
  appointment: Appointment;
  isHori?: boolean;
};
export const CaregiverAppointmentWidget = ({ appointment, isHori }: Props) => {
  return (
    <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src={DEFAULT_IMAGE_URL}
              width={36}
              height={36}
              className="size-8 rounded-full object-cover sm:size-[42px]"
              alt={`${appointment.name}'s avatar`}
            />
            <CaregiverAppointmentSheet
              sheetTrigger={
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className="line-clamp-1 cursor-pointer text-sm font-semibold text-[#303030] sm:text-base">
                    {appointment.name}
                  </h4>
                  <p className="text-left text-xs font-normal text-[#66666B] sm:text-sm">
                    {appointment.phone}
                  </p>
                </div>
              }
            />
            {appointment.status && (
              <div className="flex h-[24px] items-center gap-1 rounded-full bg-[#66D18A26] px-2">
                <div className="size-[6px] rounded-full bg-[#66D18A] sm:size-[8px]" />
                <span className="text-xs font-medium text-[#333]">
                  {appointment.status}
                </span>
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 sm:mt-0 sm:self-auto lg:self-end">
            <Ellipsis className="size-4 text-gray-500 sm:size-5" />
          </div>
        </div>

        <Separator className="bg-[#E8E8E8]" />

        <div
          className={cn(
            "flex flex-col space-y-2 sm:space-y-3",
            isHori && "!flex-row flex-wrap gap-2"
          )}
        >
          <div className="flex items-center gap-2">
            <Calendar className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
            <span className="text-xs font-normal text-[#303030] sm:text-sm">
              {appointment.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
            <span className="text-xs font-normal text-[#66666B] sm:text-sm">
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>

          {appointment.isVirtual ? (
            <div className="flex items-center gap-2">
              <Video className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
              <span className="text-xs font-normal text-[#66666B] sm:text-sm">
                Virtual appointment
              </span>
            </div>
          ) : appointment.location ? (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 flex-shrink-0 text-gray-500 sm:size-5" />
              <div className="flex flex-col">
                <span className="line-clamp-2 text-xs font-normal text-[#66666B] sm:line-clamp-none sm:text-sm">
                  {appointment.location}
                </span>
                {/* {appointment.locationTag && (
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                      Fill ({appointment.locationTag.fill})
                    </span>
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                      {appointment.locationTag.hue} Hue
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
