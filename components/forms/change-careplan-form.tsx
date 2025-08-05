import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { ChangeCarePlanSchema } from "@/lib/schemas/main-schema.schema";

import { CustomFormField } from "../shared/custom-form-field";
import { paymentPlans } from "../shared/onboarding/plan-selection-step";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

export default function ChangeCarePlanForm() {
  const form = useForm<z.infer<typeof ChangeCarePlanSchema>>({
    resolver: zodResolver(ChangeCarePlanSchema),
  });

  const handleSubmit = (values: z.infer<typeof ChangeCarePlanSchema>) => {
    console.log(values);
  };
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <CustomFormField
            control={form.control}
            name="plan"
            fieldType={FormFieldTypes.SKELETON}
            renderSkeleton={() => (
              <Accordion type="single" collapsible className="w-full space-y-3">
                <AccordionItem
                  value="gold-care-plan"
                  className="rounded-[6px] border"
                >
                  <AccordionTrigger className="cursor-pointer rounded-[6px] border-x-0 border-t-0 !border-none border-[#e8e8e8] bg-[#f9f9f9] px-[18px] text-base font-semibold text-[#333] data-[state=open]:rounded-b-none data-[state=open]:border-b">
                    {paymentPlans[2].planTitle}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    <div>
                      <div className="flex flex-col gap-[12px]">
                        {paymentPlans[2].planOffers.map((offer) => (
                          <span
                            key={offer}
                            className="flex items-center gap-2 space-x-3"
                          >
                            <Check className="size-5 text-blue-600" />
                            <span className="text-sm font-normal text-[#999999]">
                              {offer}
                            </span>
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          form.setValue("plan", paymentPlans[2].id);
                        }}
                        className="mt-3 !h-[45px] w-full text-base font-normal"
                      >
                        Select plan
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ok-plan" className="rounded-[6px] border">
                  <AccordionTrigger className="cursor-pointer rounded-[6px] border-x-0 border-t-0 !border-none border-[#e8e8e8] bg-[#f9f9f9] px-[18px] text-base font-semibold text-[#333] data-[state=open]:rounded-b-none data-[state=open]:border-b">
                    {paymentPlans[0].planTitle}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    <div>
                      <div className="flex flex-col gap-[12px]">
                        {paymentPlans[0].planOffers.map((offer) => (
                          <span
                            key={offer}
                            className="flex items-center gap-2 space-x-3"
                          >
                            <Check className="size-5 text-blue-600" />
                            <span className="text-sm font-normal text-[#999999]">
                              {offer}
                            </span>
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          form.setValue("plan", paymentPlans[0].id);
                        }}
                        className="mt-3 !h-[45px] w-full text-base font-normal"
                      >
                        Select plan
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="ck-plan"
                  className="rounded-[6px] border last:border-b-1"
                >
                  <AccordionTrigger className="cursor-pointer rounded-[6px] border-x-0 border-t-0 !border-none border-[#e8e8e8] bg-[#f9f9f9] px-[18px] text-base font-semibold text-[#333] data-[state=open]:rounded-b-none data-[state=open]:border-b">
                    {paymentPlans[1].planTitle}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 p-4">
                    <div>
                      <div className="flex flex-col gap-[12px]">
                        {paymentPlans[1].planOffers.map((offer) => (
                          <span
                            key={offer}
                            className="flex items-center gap-2 space-x-3"
                          >
                            <Check className="size-5 text-blue-600" />
                            <span className="text-sm font-normal text-[#999999]">
                              {offer}
                            </span>
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          form.setValue("plan", paymentPlans[1].id);
                        }}
                        className="mt-3 !h-[45px] w-full text-base font-normal"
                      >
                        Select plan
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          />
          <CustomFormField
            control={form.control}
            name="additionalNotes"
            label="Additional notes"
            fieldType={FormFieldTypes.TEXTAREA}
            // disabled={isPending}
            placeholder="Type your additional notes here"
          />
        </div>
        <div className="mb-2 flex items-center rounded-md bg-[#F2F2F2] p-4 text-[#66666B]">
          <div className="mr-3 flex !size-8 items-center justify-center rounded-full bg-[#116BEE] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <p className="text-sm">
            To ensure the best care, our professionals will review your request
            before approval.{" "}
          </p>
        </div>
        <div>
          <Button
            disabled
            type="submit"
            className="h-[42px] w-full disabled:bg-[#C9C9C9]"
          >
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
