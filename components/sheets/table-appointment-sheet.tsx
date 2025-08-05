// @flow
import * as React from "react";

import GoogleIcon from "@/icons/google";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

import RescheduleAppointmentForm from "../forms/reschedule-appointment-form";
import { AvatarNameEmail } from "../shared/avatar-name-email";
import { TableAppointment } from "../table/columns/appointment-columns";
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
  appointment: TableAppointment;
};
export const TableAppointmentSheet = (props: Props) => {
  const { user } = useUserStore();
  const [openSheet, setOpenSheet] = React.useState(false);
  const [setRes, setSetRes] = React.useState(false);
  return setRes ? (
    <Sheet open={setRes} onOpenChange={setSetRes}>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {" "}
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <SheetHeader className="mb-4 border-none p-0 shadow-none">
            <SheetTitle className="text-lg font-medium text-[#333333]">
              Reschedule appointment
            </SheetTitle>
          </SheetHeader>
          <RescheduleAppointmentForm
            setOpenSheet={setSetRes}
            appoinment={props.appointment.id}
          />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger className="size-full">{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {" "}
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <SheetHeader className="mb-4 p-0">
            <SheetTitle className="text-lg font-medium text-[#333333]">
              Caregiver Appointment{" "}
              <span className="h-[24px] w-[88px] border border-gray-300 bg-[#F1F5F9] px-[8px] py-[4px] text-xs font-medium text-[#66666B]">
                ID {props.appointment.id}
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="mb-6 gap-4 space-y-6">
            <div className="space-y-3">
              <h6 className="text-sm font-medium text-[#333333]">
                Caregiver details
              </h6>
              <AvatarNameEmail
                name="Adanma Pepple"
                email="adanma.pep@gmail.com"
                avatarImage="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png"
              />
              <div className="flex items-center gap-[130px]">
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Phone Number
                  </span>
                  <span className="text-xs font-semibold text-black">
                    +234 815 319 3258
                  </span>
                </span>
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Emergency Contact
                  </span>
                  <span className="text-xs font-semibold text-black">
                    +234 815 319 3258
                  </span>
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-[#333333]">
                  Booking Information
                </span>
                <div className="flex items-center gap-[130px]">
                  <span className="flex w-full flex-col gap-[4px]">
                    <span className="text-xs font-normal text-[#66666B]">
                      Date
                    </span>
                    <span className="text-xs font-semibold text-black">
                      {formatDate(props.appointment.appointmentDate)}
                    </span>
                  </span>
                  <span className="flex w-full flex-col gap-[4px]">
                    <span className="text-xs font-normal text-[#66666B]">
                      Time
                    </span>
                    <span className="text-xs font-semibold text-black">
                      {props.appointment.appointmentDate instanceof Date
                        ? props.appointment.appointmentDate.toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : props.appointment.appointmentDate}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h6 className="text-base font-medium text-[#333333]">
                Personal details
              </h6>
              <AvatarNameEmail
                name={`${user?.first_name} - ${user?.last_name}`}
                email={user?.email || ""}
                avatarImage="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png"
              />
              <div className="flex items-center gap-[130px]">
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
                    {user?.address}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-[130px]">
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Phone Number
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {user?.phone}
                  </span>
                </span>
                <span className="flex w-full flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Emergency Contact
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {user?.phone}
                  </span>
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="mb-2 text-sm font-medium">Additional notes</span>
              <Textarea rows={6} />
            </div>
          </div>
          <div className="my-6 mt-auto !flex !flex-row items-center gap-4 p-0">
            <Button className="!h-[49px] !w-fit border border-gray-300 bg-transparent text-sm text-black">
              <GoogleIcon />
              Add to Calendar
            </Button>
            <Button
              onClick={() => {
                setOpenSheet(false);
                setSetRes(true);
              }}
              className="!h-[49px] text-sm"
            >
              Reschedule appointment
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
