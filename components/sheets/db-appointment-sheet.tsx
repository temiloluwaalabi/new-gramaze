"use client";
import * as React from "react";

import GoogleIcon from "@/icons/google";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { Appointment } from "@/types";

import { VerificationGuard } from "../guards/verification-guard";
import { AvatarNameEmail } from "../shared/avatar-name-email";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";

type Props = {
  sheetTrigger: React.ReactNode;
  appointment: Appointment;
};

export const DbAppointmentSheet = (props: Props) => {
  const { user } = useUserStore();
  const { appointment } = props;
  const [openSheet, setOpenSheet] = React.useState(false);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger className="size-full">{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <SheetHeader className="mb-4 p-0">
            <SheetTitle className="text-lg font-medium text-[#333333]">
              Appointment{" "}
              <span className="h-[24px] w-[88px] border border-gray-300 bg-[#F1F5F9] px-[8px] py-[4px] text-xs font-medium text-[#66666B]">
                ID {appointment?.id}
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="mb-6 gap-4 space-y-6">
            <div className="space-y-3">
              <h6 className="text-sm font-medium text-[#333333]">
                Caregiver details
              </h6>
              <AvatarNameEmail
                name={appointment.caregiver?.first_name || "N/A"}
                email={""}
                avatarImage="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png"
              />
              <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-[130px]">
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Phone Number
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {appointment.contact || "N/A"}
                  </span>
                </span>
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Emergency Contact
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {appointment.contact || "N/A"}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-[#333333]">
                  Booking Information
                </span>
                <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-[130px]">
                  {" "}
                  <span className="flex w-full flex-col gap-[4px]">
                    <span className="text-xs font-normal text-[#66666B]">
                      Date & Time
                    </span>
                    <span className="text-xs font-semibold text-black">
                      {formatDate(appointment.date, true)}{" "}
                      {appointment.time ? `, ${appointment.time}` : ""}
                    </span>
                  </span>
                </div>
              </div>
              {appointment.additional_note_caregiver && (
                <div>
                  <span className="text-xs font-normal text-[#66666B]">
                    Caregiver Note
                  </span>
                  <div className="text-xs font-semibold text-black">
                    {appointment.additional_note_caregiver}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h6 className="text-base font-medium text-[#333333]">
                Personal details
              </h6>
              <AvatarNameEmail
                name={`${user?.first_name || ""} - ${user?.last_name || ""}`}
                email={user?.email || ""}
                avatarImage="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png"
              />
              <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-[130px]">
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Date of Birth
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {user?.dob ? formatDate(new Date(user.dob)) : "N/A"}
                  </span>
                </span>
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Address
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {user?.address || "N/A"}
                  </span>
                </span>
              </div>
              <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-[130px]">
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Phone Number
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {user?.phone || "N/A"}
                  </span>
                </span>
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Emergency Contact
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {user?.phone || "N/A"}
                  </span>
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="mb-2 text-sm font-medium">Additional notes</span>
              <Textarea
                rows={6}
                value={appointment.additional_note || ""}
                readOnly
              />
            </div>
          </div>
          <div className="my-6 mt-auto !flex !flex-row items-center gap-4 p-0">
            <Button className="!h-[49px] !w-fit border border-gray-300 bg-transparent text-sm text-black">
              <GoogleIcon />
              Add to Calendar
            </Button>
            <VerificationGuard
              route="/billing"
              fallback={
                <Button
                  disabled
                  className="!h-[49px] !py-2 text-xs"
                  size={"sm"}
                >
                  Verify Account
                </Button>
              }
            >
              <Button className="!h-[49px] text-sm">
                Reschedule appointment
              </Button>
            </VerificationGuard>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
