// PaymentMethod.tsx
"use client";

import { MoreVertical, Plus } from "lucide-react";
import Image from "next/image";

import { UpdatePaymentMethodSheet } from "@/components/sheets/update-payment-method-sheet";
import { Button } from "@/components/ui/button";

interface PaymentMethodProps {
  cardNumber: string;
  expiryDate: string;
}

export default function PaymentMethod({
  cardNumber = "**** **** **** 9900",
  expiryDate = "06/25",
}: PaymentMethodProps) {
  return (
    <div className="w-full max-w-md">
      <h1 className="mb-1 text-xl font-semibold text-gray-900">
        Payment method
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        Update your billing details and address
      </p>

      <div className="mb-4 rounded-[6px] border border-[#E8E8E8] px-[18px] py-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-[37px] w-[66px] items-center justify-center rounded-[6px] border border-[#E8E8E8]">
              <Image
                alt="creditCard"
                src={
                  "https://res.cloudinary.com/davidleo/image/upload/v1745307781/visa_inc_logo.svg_bs60mh.png"
                }
                width={46}
                height={14}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-lg font-semibold text-[#303030]">
                {cardNumber}
              </div>
              <div className="text-base font-medium text-[#303030]">
                Expires on {expiryDate}
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="!size-10 bg-blue-50">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      <UpdatePaymentMethodSheet
        sheetTrigger={
          <Button className="tetx-sm flex !h-[45px] w-fit items-center justify-center gap-2 border-black py-6 font-normal text-white">
            <Plus className="h-5 w-5" />
            <span className="text-sm">Update payment method</span>
          </Button>
        }
      />
    </div>
  );
}
