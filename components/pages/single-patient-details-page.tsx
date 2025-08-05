"use client";
import {
  Calendar,
  ChevronRight,
  Clock,
  Ellipsis,
  Mail,
  MapPin,
  SquarePen,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import CalendarBlankIcon from "@/icons/calendar-blank";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function SinglePatientDetailsPage() {
  return (
    <section className="h-full gap-6 space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
          <h6 className="text-base font-medium text-[#333]">
            Basic Information
          </h6>
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
                Hafsat Idris
              </h4>
              <div className="space-x-3 text-sm font-normal text-[#66666B]">
                <span>
                  Gender: <b>Female</b>
                </span>
                <span>DOB: Feb 11, 1954</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  className="flex !h-[36px] items-center gap-[12px] rounded-[4px] border border-[#E8E8E8] bg-white px-5 py-0 hover:bg-white"
                  variant={"outline"}
                >
                  <Mail className="size-4 text-black" />
                  <span className="text-xs font-medium text-[#333] md:text-sm">
                    Message
                  </span>
                </Button>
                <Button
                  className="flex !h-[36px] items-center gap-[4px] rounded-[4px] border border-[#E8E8E8] bg-white px-3 py-0 text-xs hover:bg-white md:text-sm"
                  variant={"outline"}
                >
                  <CalendarBlankIcon className="size-4 text-black" />
                  <span className="text-xs font-medium text-[#333] md:text-sm">
                    Schedule Visit
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4 bg-[#E8E8E8]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 border-r border-[#e8e8e8] pr-[12px]">
              <span className="mb-4 text-sm font-medium text-[#303030]">
                Contact Information
              </span>
              <div className="space-y-3">
                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Phone Number
                  </span>
                  <span className="text-xs font-semibold text-black">
                    +234 815 319 3258
                  </span>
                </span>

                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Emergency Contact
                  </span>
                  <span className="text-xs font-semibold text-black">
                    +234 815 319 3258
                  </span>
                </span>
              </div>
            </div>
            <div className="space-y-4 pl-[12px]">
              <span className="mb-4 text-sm font-medium text-[#303030]">
                Duration of care
              </span>
              <div className="space-y-3">
                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Start date
                  </span>
                  <span className="text-xs font-semibold text-black">
                    Feb 11, 1954
                  </span>
                </span>
                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    End date
                  </span>
                  <span className="text-xs font-semibold text-black">
                    Feb 11, 1954
                  </span>
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-4 bg-[#E8E8E8]" />
          <div className="mt-3">
            <span className="text-xs font-normal text-[#66666B]">
              Current Caregivers
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Avatar className="!size-10 border-2 border-white">
                  <AvatarImage src="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png" />
                </Avatar>
                <Avatar className="-ml-4 !size-10 border-2 border-white">
                  <AvatarImage src="https://res.cloudinary.com/davidleo/image/upload/v1744896555/c92c38b5944a8b4a33fc63ea583749a6_hzeez0.jpg" />
                </Avatar>
                <Avatar className="-ml-4 !size-10 border-2 border-white">
                  <AvatarImage src="https://res.cloudinary.com/davidleo/image/upload/v1744896552/381a0d1b74bd0b6ef68643335c85fc61_knu250.jpg" />
                </Avatar>
              </div>
              <span className="text-sm font-normal text-[#66666B]">
                Daniel James
                <span className="text-blue-600">+ 4 others</span>
              </span>
            </div>
          </div>
          <Separator className="my-4 bg-[#E8E8E8]" />
          <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-3">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h4 className="line-clamp-1 cursor-pointer text-sm font-semibold text-[#303030] sm:text-base">
                    At-Home Visit
                  </h4>
                </div>

                <div className="mt-1 flex items-center gap-2 self-end sm:mt-0 sm:self-auto">
                  <Ellipsis className="size-4 text-gray-500 sm:size-5" />
                </div>
              </div>

              <Separator className="bg-[#E8E8E8]" />

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
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-fit rounded-[6px] border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-[#787878]">
                Health summary
              </h6>
              <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
                See all <ChevronRight className="size-5 text-gray-500" />
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center gap-4 rounded-[6px] border border-[#E8E8E8] p-4">
                <span className="flex size-[42px] items-center justify-center rounded-full bg-[#F5F5F5]">
                  <SquarePen className="size-5" />
                </span>
                <div>
                  <h6 className="text-sm font-medium text-[#333] md:text-base">
                    Medical Record
                  </h6>
                  <p className="text-xs font-normal text-[#66666b] md:text-sm">
                    Uplaoded 10 Dec, 2024
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-[6px] border border-[#E8E8E8] p-4">
                <span className="flex size-[42px] items-center justify-center rounded-full bg-[#F5F5F5]">
                  <SquarePen className="size-5" />
                </span>
                <div>
                  <h6 className="text-sm font-medium text-[#333] md:text-base">
                    Medical Record
                  </h6>
                  <p className="text-xs font-normal text-[#66666b] md:text-sm">
                    Uplaoded 15 Dec, 2024
                  </p>
                </div>
              </div>
              <Button className="ml-auto flex !h-[45px] w-fit text-sm font-normal">
                Request health summary
              </Button>
            </div>
          </div>
          <div className="h-fit rounded-[6px] border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-[#787878]">
                Recent reports
              </h6>
              <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
                See all <ChevronRight className="size-5 text-gray-500" />
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="h-[73px] rounded-[6px] bg-[#F5F5F5]" />
                <div className="h-[73px] rounded-[6px] bg-[#F5F5F5]" />
                <div className="h-[73px] rounded-[6px] bg-[#F5F5F5]" />
              </div>
              <div className="space-y-4">
                <div className="h-[26px] w-full rounded-[6px] bg-[#F5F5F5]" />
                <div className="h-[26px] w-[40%] rounded-[6px] bg-[#F5F5F5]" />
              </div>
              <Button className="ml-auto flex !h-[45px] w-fit text-sm font-normal">
                Add report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
