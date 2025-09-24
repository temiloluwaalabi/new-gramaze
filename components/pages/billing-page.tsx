"use client";
import Image from "next/image";
import * as React from "react";

import { useUserStore } from "@/store/user-store";

import PaymentMethod from "../shared/widget/payment-methods";
import { BillingColumn, Payment } from "../table/columns/billing-history";
import { DataTable } from "../table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const paymentPlans = [
  {
    id: "ok_plan",
    planTitle: "The OK Plan",
    planOffers: [
      "First 2 consultations",
      "Doctor's visit",
      "Caregiver's visit",
      "Complementary investigations",
    ],
  },
  {
    id: "ck_plan",
    planTitle: "The CK Plan",
    planOffers: [
      "First 2 consultations",
      "Doctor's visit",
      "Nursing Care",
      "Nutrition Plan",
      "Wellness Plan",
      "Routine Check",
      "Complementary investigations",
    ],
  },
  {
    id: "gold_care_plan",
    planTitle: "The Gold Care Plan",
    planOffers: [
      "Doctor's visit",
      "Nutrition Plan",
      "Wellness Plan and tracker",
      "Silver Premium Plan",
      "Caregiver's Visit",
      "Complementary investigations",
      "Access to complementary Equipments",
    ],
  },
];
type BillingPageProps = {
  payments: Payment[];
};
export const BillingPage = ({ payments }: BillingPageProps) => {
  const { user } = useUserStore();

  const selectedPlan = paymentPlans.find((plan) => plan.id === user?.plan);
  return (
    <section className="space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <section>
        <h2 className="text-2xl font-medium text-[#131B0B]">Billing</h2>
        <p className="text-xs font-semibold text-[#7f7f7f]">
          View invoices, track payments, and download receipts
        </p>
      </section>
      <section className="mt-4 flex w-full gap-5">
        <Tabs defaultValue="billing" className="w-full">
          <TabsList className="custom-scrollbar mb-2 flex h-auto w-fit items-start justify-start gap-3 overflow-hidden overflow-x-scroll rounded-none border-[#F0F2F5] bg-transparent p-0 lg:mb-4">
            <TabsTrigger
              value="billing"
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none lg:text-base"
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none lg:text-base"
              value="payment-method"
            >
              Payment Method
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="billing"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <div className="flex w-fit flex-col items-start justify-between gap-3 rounded-[6px] border border-[#E8E8E8] bg-[#F9F9F9] p-[18px] md:flex-row md:items-center md:p-[24px]">
              <div className="flex items-center gap-4">
                <div className="flex size-[48px] items-center justify-center rounded-full bg-blue-100">
                  <Image
                    src={
                      "https://res.cloudinary.com/davidleo/image/upload/v1745320515/Vector_1_rio4vl.png"
                    }
                    alt="plan"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#333] lg:text-lg">
                    {selectedPlan?.planTitle}
                  </h3>
                  <p className="text-xs font-medium text-[#999] lg:text-sm">
                    Your subscription will renew on April 4
                  </p>
                </div>
              </div>
              {/* <ChangeCarePlanSheet
                sheetTrigger={
                  <Button className="!h-[45px] rounded-[6px] border border-[#DCDCDC] bg-white p-3 text-base font-normal text-[#333] hover:bg-white">
                    Change Plan
                  </Button>
                }
                user_id={user?.id || 0}
              /> */}
            </div>
            <DataTable
              columns={BillingColumn}
              newToolbar={{
                show: true,
                tableTitle: "Billing History",
                search: [
                  {
                    columnKey: "amount",
                    placeholder: "Search...",
                  },
                ],
              }}
              tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
              data={payments}
            />
          </TabsContent>

          <TabsContent
            value="payment-method"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <PaymentMethod
              cardNumber="**** **** **** 9900"
              expiryDate="06/25"
            />
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
};
