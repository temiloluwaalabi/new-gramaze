import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { getUserInfo } from "@/app/actions/auth.actions";
import { FormFieldTypes } from "@/config/enum";
import { ChangeCarePlanSchema } from "@/lib/schemas/main-schema.schema";
import { useUserStore } from "@/store/user-store";

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
import { InitiatePayment } from "@/app/actions/payment.actions";
import { useUpdatePlan } from "@/lib/queries/use-caregiver-query";

type ChangeCarePlanFormProps = {
  user_id: number;
  setOpenSheet: (open: boolean) => void;
};

export default function ChangeCarePlanForm({
  user_id,
  setOpenSheet,
}: ChangeCarePlanFormProps) {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof ChangeCarePlanSchema>>({
    resolver: zodResolver(ChangeCarePlanSchema),
  });
  const { setUser } = useUserStore();
  const [startBuying, setStartBuying] = React.useState(false);
  const router = useRouter();

  const { isPending: UpdatePlanPending, mutateAsync: UpdatePlan } =
    useUpdatePlan();

  // Watch the selected plan value
  const selectedPlan = form.watch("plan");

  const handleSubmit = async (values: z.infer<typeof ChangeCarePlanSchema>) => {
    await UpdatePlan(
      {
        user_id,
        plan: values.plan,
        pathname,
      },
      {
        onSuccess: async () => {
          const user = await getUserInfo();
          if (user.success) {
            const buyPlan = {
              plan_code: values.plan,
              callback_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}`,
            };
            try {
              // toast.success(data.message);
              setStartBuying(true);
              await InitiatePayment(buyPlan, pathname).then((data) => {
                if (data?.success === false) {
                  toast.error(data.message);
                  setOpenSheet(false);
                }
                if (data?.success === true) {
                  toast.success("User plan set successfully!");
                  // goToStep("bio-data");
                  //  setOpenSheet(false);

                  router.push(data?.authorization_url || "");
                }
              });
            } catch (error) {
              toast.error("An error occured");
              setOpenSheet(false);
              console.error(error);
            } finally {
              setStartBuying(false);
              setOpenSheet(false);
            }
            setUser(user.user);
          }
        },
      }
    );
  };

  const getSelectedPlanName = () => {
    if (!selectedPlan) return null;
    const plan = paymentPlans.find((p) => p.id === selectedPlan);
    return plan?.planTitle || null;
  };

  const isSelected = (planId: string) => selectedPlan === planId;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <CustomFormField
            control={form.control}
            name="plan"
            fieldType={FormFieldTypes.SKELETON}
            disabled={UpdatePlanPending || startBuying}
            renderSkeleton={() => (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {/* Gold Care Plan */}
                <AccordionItem
                  value="gold-care-plan"
                  className={`rounded-[6px] border transition-all duration-200 ${
                    isSelected(paymentPlans[2].id)
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                      : "border-[#e8e8e8]"
                  }`}
                >
                  <AccordionTrigger
                    disabled={UpdatePlanPending || startBuying}
                    className={`flex cursor-pointer items-center rounded-[6px] border-x-0 border-t-0 !border-none px-[18px] text-base font-semibold text-[#333] data-[state=open]:rounded-b-none data-[state=open]:border-b ${
                      isSelected(paymentPlans[2].id)
                        ? "border-green-200 bg-green-50"
                        : "border-[#e8e8e8] bg-[#f9f9f9]"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {paymentPlans[2].planTitle}
                      {isSelected(paymentPlans[2].id) && (
                        <CheckCircle className="mr-2 ml-auto size-5 text-green-600" />
                      )}
                    </div>
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
                        type="button"
                        disabled={UpdatePlanPending || startBuying}
                        onClick={() => {
                          form.setValue("plan", paymentPlans[2].id);
                        }}
                        className={`mt-3 !h-[45px] w-full text-base font-normal transition-all duration-200 ${
                          isSelected(paymentPlans[2].id)
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                      >
                        {isSelected(paymentPlans[2].id)
                          ? "Selected"
                          : "Select plan"}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* OK Plan */}
                <AccordionItem
                  value="ok-plan"
                  className={`rounded-[6px] border transition-all duration-200 ${
                    isSelected(paymentPlans[0].id)
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                      : "border-[#e8e8e8]"
                  }`}
                >
                  <AccordionTrigger
                    disabled={UpdatePlanPending || startBuying}
                    className={`flex cursor-pointer items-center rounded-[6px] border-x-0 border-t-0 !border-none px-[18px] text-base font-semibold text-[#333] data-[state=open]:rounded-b-none data-[state=open]:border-b ${
                      isSelected(paymentPlans[0].id)
                        ? "border-green-200 bg-green-50"
                        : "border-[#e8e8e8] bg-[#f9f9f9]"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {paymentPlans[0].planTitle}
                      {isSelected(paymentPlans[0].id) && (
                        <CheckCircle className="mr-2 ml-auto size-5 text-green-600" />
                      )}
                    </div>
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
                        type="button"
                        onClick={() => {
                          form.setValue("plan", paymentPlans[0].id);
                        }}
                        disabled={UpdatePlanPending || startBuying}
                        className={`mt-3 !h-[45px] w-full text-base font-normal transition-all duration-200 ${
                          isSelected(paymentPlans[0].id)
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                      >
                        {isSelected(paymentPlans[0].id)
                          ? "Selected"
                          : "Select plan"}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* CK Plan */}
                <AccordionItem
                  value="ck-plan"
                  className={`rounded-[6px] border transition-all duration-200 last:border-b-1 ${
                    isSelected(paymentPlans[1].id)
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                      : "border-[#e8e8e8]"
                  }`}
                >
                  <AccordionTrigger
                    disabled={UpdatePlanPending || startBuying}
                    className={`flex cursor-pointer items-center rounded-[6px] border-x-0 border-t-0 !border-none px-[18px] text-base font-semibold text-[#333] data-[state=open]:rounded-b-none data-[state=open]:border-b ${
                      isSelected(paymentPlans[1].id)
                        ? "border-green-200 bg-green-50"
                        : "border-[#e8e8e8] bg-[#f9f9f9]"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {paymentPlans[1].planTitle}
                      {isSelected(paymentPlans[1].id) && (
                        <CheckCircle className="mr-2 ml-auto size-5 text-green-600" />
                      )}
                    </div>
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
                        disabled={UpdatePlanPending || startBuying}
                        type="button"
                        onClick={() => {
                          form.setValue("plan", paymentPlans[1].id);
                        }}
                        className={`mt-3 !h-[45px] w-full text-base font-normal transition-all duration-200 ${
                          isSelected(paymentPlans[1].id)
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                      >
                        {isSelected(paymentPlans[1].id)
                          ? "Selected"
                          : "Select plan"}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          />

          {/* Selection Confirmation Widget */}
          {selectedPlan && getSelectedPlanName() && (
            <div className="animate-in slide-in-from-top-2 mb-4 flex items-center rounded-md border border-green-200 bg-green-50 p-4 text-green-800 transition-all duration-300">
              <div className="mr-3 flex !size-8 items-center justify-center rounded-full bg-green-600 text-white">
                <CheckCircle className="size-4" />
              </div>
              <p className="text-sm font-medium">
                <span className="font-semibold">{getSelectedPlanName()}</span>{" "}
                has been selected for your care plan.
              </p>
            </div>
          )}

          <CustomFormField
            control={form.control}
            name="additionalNotes"
            label="Additional notes"
            fieldType={FormFieldTypes.TEXTAREA}
            disabled={UpdatePlanPending || startBuying}
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
            disabled={UpdatePlanPending || startBuying}
            type="submit"
            className="h-[42px] w-full disabled:bg-[#C9C9C9]"
          >
            {UpdatePlanPending && (
              <Loader2 className="me-2 size-4 animate-spin" />
            )}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
