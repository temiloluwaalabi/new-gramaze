// @flow
import {
  Calendar,
  Camera,
  CheckCheck,
  Clock,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { AvatarNameEmail } from "../shared/avatar-name-email";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
type Props = {
  sheetTrigger: React.ReactNode;
};
export const CaregiverAppointmentSheet = (props: Props) => {
  const [showArrivalWidget, setshowArrivalWidget] = React.useState(false);
  const [confirmationMethod, setConfirmationMethod] = React.useState("");

  // const handleConfirm = () => {
  //   // Handle confirmation logic here
  //   console.log("Confirming arrival with method:", confirmationMethod);
  // };
  return (
    <Sheet>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {showArrivalWidget ? (
          <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
            <SheetHeader className="mb-4 p-0">
              <SheetTitle className="text-2xl font-semibold text-[#000]">
                Confirm your arrival
              </SheetTitle>
              <SheetDescription className="text-sm font-normal text-[#66666B]">
                {" "}
                Capture a quick photo and allow location access to confirm
                you&apos;re on-site.
              </SheetDescription>
            </SheetHeader>
            <div className="py-2">
              <RadioGroup
                value={confirmationMethod}
                onValueChange={setConfirmationMethod}
                className="space-y-1"
              >
                <div className="flex h-[68px] cursor-pointer items-center space-x-2 rounded-[6px] border border-[#E8E8E8] p-3 py-[8px] pr-[16px] pl-[8px] hover:bg-gray-50">
                  <Label
                    htmlFor="photo"
                    className="flex w-full cursor-pointer items-center gap-3"
                  >
                    <div className="flex size-[52px] items-center justify-center rounded-[6px] bg-[#FAFAFA] p-[14px]">
                      <Camera className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">Take Photo</span>
                  </Label>
                  <RadioGroupItem value="photo" id="photo" className="ml-1" />
                </div>
                <div className="flex h-[68px] cursor-pointer items-center space-x-2 rounded-[6px] border border-[#E8E8E8] p-3 py-[8px] pr-[16px] pl-[8px] hover:bg-gray-50">
                  <Label
                    htmlFor="location"
                    className="flex w-full cursor-pointer items-center gap-3"
                  >
                    <div className="flex size-[52px] items-center justify-center rounded-[6px] bg-[#FAFAFA] p-[14px]">
                      <MapPin className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">
                      Use current location
                    </span>
                  </Label>
                  <RadioGroupItem
                    value="location"
                    id="location"
                    className="ml-1"
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="ml-auto !flex !flex-row items-center gap-4 p-0">
              <Button
                className="!h-[49px] text-sm"
                onClick={() => setshowArrivalWidget(false)}
              >
                Confirm Arrival
              </Button>
            </div>
          </div>
        ) : (
          <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
            <SheetHeader className="mb-4 p-0">
              <SheetTitle className="text-base font-medium text-[#333333]">
                Appointment Details
              </SheetTitle>
            </SheetHeader>
            <div className="mb-6 gap-4 space-y-6">
              <div className="space-y-3">
                <h6 className="text-2xl font-semibold text-black">
                  At-home appointment
                </h6>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-[130px]">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                      <span className="text-xs font-normal text-[#303030] sm:text-sm">
                        Feb 25, 2025{" "}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                      <span className="text-xs font-normal text-[#66666B] sm:text-sm">
                        09:00 AM - 10:00 AM{" "}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[130px]">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                      <div className="flex flex-col">
                        <span className="line-clamp-2 text-xs font-normal text-[#66666B] sm:line-clamp-none sm:text-sm">
                          42 Bishop Oluwole Street, Victoria Island, Lagos{" "}
                        </span>
                      </div>
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
              </div>
              <div className="space-y-3">
                <h6 className="text-base font-medium text-[#333333]">
                  Patient details
                </h6>
                <AvatarNameEmail
                  name="Hafsat Idris"
                  email="hafsat.idris@gmail.com"
                  avatarImage="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png"
                />
                <div className="flex items-center gap-[130px]">
                  <span className="flex w-full flex-col gap-[4px]">
                    <span className="text-xs font-normal text-[#66666B]">
                      Date of Birth
                    </span>
                    <span className="text-xs font-semibold text-black">
                      Feb 11, 1954
                    </span>
                  </span>
                  <span className="flex w-full flex-col gap-[4px]">
                    <span className="text-xs font-normal text-[#66666B]">
                      Address
                    </span>
                    <span className="text-xs font-semibold text-black">
                      25 Osborne Road, Ikoyi, Lagos
                    </span>
                  </span>
                </div>
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
              </div>
              <div className="space-y-2">
                <span className="mb-2 text-sm font-medium">
                  Additional notes
                </span>
                <Textarea rows={6} className="mt-3 h-[120px]" />
              </div>
            </div>
            <div className="my-6 mt-auto !flex !flex-row items-center gap-4 p-0">
              <Button className="!h-[49px] !w-fit border border-gray-300 bg-transparent text-sm text-black">
                <Mail />
                Message patient
              </Button>
              <Button
                className="!h-[49px] text-sm"
                onClick={() => setshowArrivalWidget(true)}
              >
                <CheckCheck />
                Mark as arrived
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
