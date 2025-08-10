"use client";
import { Mail, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

import { RatingWidget } from "../shared/rating-widget";
import { CaregiverHistory } from "../table/columns/caregiver-history";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
type SingleCaregiverDetailsPageProps = {
  caregiverId: number;
  // currentUser: User;
  caregivers: {
    id: number;
    user_id: string;
    caregiver_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    caregiver: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }[];
};
export default function SingleCaregiverDetailsPage({
  caregivers,
  caregiverId,
}: SingleCaregiverDetailsPageProps) {
  return (
    <section className="space-y-3 px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium text-black"> Adanma Pepple</span>{" "}
        <span className="text-sm font-normal text-[#66666b]">
          Supporting Nurse
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
          <h6 className="text-base font-medium text-[#333]">
            Caregiver Profile
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
                Adanma Pepple
              </h4>
              <p className="text-sm font-normal text-[#66666B]">
                Physiotherapist
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  className="flex !h-[36px] items-center gap-[12px] rounded-[4px] border border-[#E8E8E8] bg-white px-5 py-0 hover:bg-white"
                  variant={"outline"}
                >
                  <Mail className="size-[20px] text-black" />
                  <span className="text-xs font-medium text-[#333] md:text-sm">
                    Message Caregiver
                  </span>
                </Button>
                <Button
                  className="flex !h-[36px] items-center gap-[4px] rounded-[4px] border border-[#E8E8E8] bg-white px-3 py-0 text-xs hover:bg-white md:text-sm"
                  variant={"outline"}
                >
                  <Star className="size-4 fill-yellow-500 text-yellow-500" />
                  4.8
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
        </div>
        <RatingWidget caregiverId={caregiverId} />
      </div>
      <DataTable
        columns={CaregiverHistory}
        newToolbar={{
          show: true,
          tableTitle: "Caregiver history",
          search: [
            {
              columnKey: "caregiverName",
              placeholder: "Search...",
            },
          ],
        }}
        tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
        data={caregivers}
      />
    </section>
  );
}
