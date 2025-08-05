// @flow
import { Mail, Paperclip, Share } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
type Props = {
  sheetTrigger: React.ReactNode;
};
export const HealthTrackerInfoSheet = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer">
        {props.sheetTrigger}
      </SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {" "}
        <div className="custom-scrollbar flex h-full flex-col gap-4 overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <div className="flex flex-col gap-[21px]">
            <h2 className="text-lg font-medium text-[#333333] md:text-xl lg:text-2xl">
              Blood pressure & diet advice
            </h2>
            <div className="flex flex-col gap-2">
              <span className="space-x-6">
                <span className="text-base font-normal text-[#66666B]">
                  Created by
                </span>
                <span className="text-base font-medium text-[#333333]">
                  Dr. Adebayo 0.
                </span>
              </span>
              <span className="space-x-6">
                <span className="text-base font-normal text-[#66666B]">
                  Uploaded
                </span>
                <span className="text-base font-medium text-[#333333]">
                  January 20, 2025
                </span>
              </span>
            </div>
          </div>
          <Separator className="bg-[#E8E8E8]" />
          <div className="flex flex-col gap-[14px]">
            <p className="text-sm font-medium text-[#66666B] lg:text-base">
              Blood pressure readings have been consistent. Maintain your
              current diet and monitor sodium intake. Slight improvement in
              mobility, but continue physical therapy exercises 3 times a week.
              Recommend a follow-up assessment in 4 weeks.
            </p>
            <p className="text-sm font-medium text-[#66666B] lg:text-base">
              Patient&apos;s blood pressure readings have remained stable over
              the past two weeks, averaging 120/80 mmHg, which is within the
              normal range. However, slight fluctuations have been observed in
              the evenings, possibly due to dietary intake or stress levels.
            </p>
            <p className="text-sm font-medium text-[#66666B] lg:text-base">
              To maintain consistency, I recommend continuing the low-sodium
              diet and increasing potassium-rich foods like bananas, spinach,
              and sweet potatoes. Hydration should also be a priority, with at
              least 2 liters of water per day.
            </p>
            <p className="text-sm font-medium text-[#66666B] lg:text-base">
              Physical activity remains essential—light cardio such as daily
              30-minute walks or moderate cycling is encouraged. Additionally, I
              advise reducing caffeine intake, especially in the afternoons, to
              prevent unnecessary spikes.
            </p>
            <p className="text-sm font-medium text-[#66666B] lg:text-base">
              Follow-up assessment in 4 weeks to monitor trends and adjust the
              care plan if necessary. Please report any dizziness, headaches, or
              sudden changes in blood pressure readings before the next
              check-up.
            </p>
          </div>
          <Separator className="bg-[#E8E8E8]" />

          <div>
            <h6 className="flex items-center text-sm font-normal text-[#333] lg:text-base">
              Attachments <Paperclip className="ms-2 size-5 text-[#66666B]" />
            </h6>
            <div className="mt-4 flex flex-wrap items-center gap-[12px]">
              <Image
                src="https://res.cloudinary.com/davidleo/image/upload/v1745305715/733bc4196e8369bfa4710a5113244c66_qb9svi.jpg"
                width={145}
                height={105}
                className="h-[105px] w-[145px] rounded-[6px] object-cover"
                alt="attachment"
              />
              <Image
                src="https://res.cloudinary.com/davidleo/image/upload/v1745305715/733bc4196e8369bfa4710a5113244c66_qb9svi.jpg"
                width={145}
                height={105}
                className="h-[105px] w-[145px] rounded-[6px] object-cover"
                alt="attachment"
              />
              <div className="relative">
                <Image
                  src="https://res.cloudinary.com/davidleo/image/upload/v1745305715/733bc4196e8369bfa4710a5113244c66_qb9svi.jpg"
                  width={145}
                  height={105}
                  className="relative h-[105px] w-[145px] rounded-[6px] object-cover"
                  alt="attachment"
                />
                <div className="absolute top-0 left-0 z-20 flex size-full items-center justify-center bg-[#CCCCCC33]">
                  <h2 className="text-2xl font-semibold text-white">+2</h2>
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-[#E8E8E8]" />

          <div className="flex w-full flex-col items-start gap-[6px] lg:flex-row lg:items-center">
            <Button className="flex h-[48px] w-full items-center gap-[12px] bg-[#F2F2F2] lg:rounded-[26px]">
              <span className="flex size-[32px] items-center justify-center rounded-full bg-white">
                <Mail className="size-[20px] text-black" />
              </span>
              <span className="text-sm font-medium text-[#333]">
                Message Caregiver
              </span>
            </Button>
            <Button className="flex h-[48px] w-full items-center gap-[12px] bg-[#F2F2F2] lg:rounded-[26px]">
              <span className="flex size-[32px] items-center justify-center rounded-full bg-white">
                <Share className="size-[20px] text-black" />
              </span>
              <span className="text-sm font-medium text-[#333]">
                Share note
              </span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
