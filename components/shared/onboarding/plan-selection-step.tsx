/* eslint-disable react-hooks/exhaustive-deps */
// @flow
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import { getUserInfo } from "@/app/actions/auth.actions";
import { useOnboarding } from "@/context/onboarding-context";
import {
  useSetUserPlanMutation,
  useSetUserTypeMutation,
} from "@/lib/queries/use-auth-queries";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

import { PricingPlan } from "./pricing-plan";
import { StepFooter } from "./step-footer";
import { StepHeader } from "./step-header";
export const paymentPlans = [
  {
    id: "ok_plan",
    planTitle: "The OK Plan",
    amount: 5000,
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
    amount: 10000,
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
    amount: 20000,

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
export const PlanSelectionStep = () => {
  const { user, setUser } = useUserStore();
  const {
    updateData,
    goToPrevStep,
    data,
    goToStep,
    markStepComplete,
    currentStep,
  } = useOnboarding();
  const { isPending: userTypePending, mutate: SetUserType } =
    useSetUserTypeMutation();
  const { isPending: userPlanPending, mutate: SetUserPlan } =
    useSetUserPlanMutation();
  const forWhom = data.forWhom;
  const [internalStep, setInternalStep] = React.useState<1 | 2>(1);

  console.log("USDFPLANPENDING", userPlanPending);

  // Check if steps are already completed in database
  const hasSetUserType = user?.has_set_user_type === "yes";
  const hasSetPlan = user?.has_set_plan === "yes";

  // Get saved values from user
  const savedUserType = user?.user_type;
  const savedPlan = user?.plan;
  // Initialize internal step and data based on completion status
  React.useEffect(() => {
    if (hasSetUserType && hasSetPlan) {
      // Both are completed, show plan selection
      setInternalStep(2);
      updateData("forWhom", savedUserType || "");
      updateData("plan", savedPlan || "");
    } else if (hasSetUserType && !hasSetPlan) {
      // Only user type is completed, show plan selection
      setInternalStep(2);
      updateData("forWhom", savedUserType || "");
    } else if (!hasSetUserType && hasSetPlan) {
      // Only plan is completed (edge case), show user type selection
      setInternalStep(1);
      updateData("plan", savedPlan || "");
    } else {
      // Nothing is completed, start from beginning
      setInternalStep(1);
    }
  }, []);

  const handleSelectForWhom = (value: string) => {
    // Prevent selection if already saved
    if (hasSetUserType) {
      toast.info("User type has already been set and cannot be changed.");
      return;
    }
    updateData("forWhom", value);

    SetUserType(value, {
      onSuccess: (data) => {
        toast.success(data.message || "User type set successfully!");
        setInternalStep(2);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to set user type");
      },
    });
  };

  const handleSelectPlan = (plan: string) => {
    // Prevent selection if already saved
    if (hasSetPlan) {
      toast.info("Plan has already been set and cannot be changed.");
      return;
    }

    updateData("plan", plan);

    SetUserPlan(plan, {
      onSuccess: async (data) => {
        const user = await getUserInfo();
        if (user.success) {
          setUser(user.user);
          toast.success(data.message || "User plan set successfully!");
          markStepComplete(currentStep);
          goToStep("bio-data");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to set plan. Please try again.");
      },
    });
  };

  const handleSkip = () => {
    if (internalStep === 1) {
      setInternalStep(2);
    } else {
      markStepComplete("plan");
      goToStep("bio-data");
    }
  };

  console.log(internalStep);
  console.log("CURRENT STEP", currentStep);

  const handleBack = () => {
    if (internalStep === 2) {
      setInternalStep(1);
    } else {
      goToPrevStep();
    }
  };
  const getUserTypeDisplayName = (userType: string) => {
    return userType === "myself" ? "Myself" : "Someone else";
  };

  // const getPlanDisplayName = (planId: string) => {
  //   const plan = paymentPlans.find((p) => p.id === planId);
  //   return plan?.planTitle || planId;
  // };

  return (
    <div>
      {internalStep === 1 ? (
        <>
          <StepHeader
            title="Who are you signing for?"
            description="Choose an option below to manage services tailored for you or your dependents"
          />
          {hasSetUserType && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800">
                  You have selected:{" "}
                  {getUserTypeDisplayName(savedUserType || "")}
                </p>
              </div>
              <p className="mt-1 text-sm text-green-600">
                This selection has been saved and cannot be changed.
              </p>
            </div>
          )}
          <div className="space-y-[21px]">
            <div
              className={cn(
                "flex h-[98px] items-center gap-2 rounded-[6px] border border-gray-300 bg-white p-5 transition-all",
                // Show as selected if this matches saved user type
                savedUserType === "myself" &&
                  hasSetUserType &&
                  "border-green-500 bg-green-50",
                // Show hover effects only if not saved
                !hasSetUserType &&
                  "cursor-pointer hover:border-blue-700 hover:bg-blue-50",
                // Show current selection if not saved yet
                !hasSetUserType &&
                  forWhom === "myself" &&
                  "border-blue-700 bg-blue-50",
                // Disable other options if saved
                hasSetUserType && savedUserType !== "myself" && "opacity-50",
                userTypePending && "pointer-events-none opacity-60"
              )}
              onClick={() => handleSelectForWhom("myself")}
            >
              <Image
                src="/asset/images/myself.png"
                width={58}
                height={58}
                className="size-[58px] rounded-full object-cover"
                alt="myself"
              />
              <div>
                <h4 className="text-[18px] font-semibold text-gray-800">
                  Myself
                </h4>
                <p className="text-sm font-medium text-gray-500">
                  Our medical professionals visits you to address your needs
                </p>
              </div>
              <div className="relative ms-auto">
                {hasSetUserType && savedUserType === "myself" && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
                {userTypePending && forWhom === "myself" && (
                  <span className="ml-2 animate-pulse text-blue-600">
                    Loading...
                  </span>
                )}
              </div>
            </div>
            <div
              className={cn(
                "flex h-[98px] items-center gap-2 rounded-[6px] border border-gray-300 bg-white p-5 transition-all",
                // Show as selected if this matches saved user type
                savedUserType === "someone-else" &&
                  hasSetUserType &&
                  "border-green-500 bg-green-50",
                // Show hover effects only if not saved
                !hasSetUserType &&
                  "cursor-pointer hover:border-blue-700 hover:bg-blue-50",
                // Show current selection if not saved yet
                !hasSetUserType &&
                  forWhom === "someone-else" &&
                  "border-blue-700 bg-blue-50",
                // Disable other options if saved
                hasSetUserType &&
                  savedUserType !== "someone-else" &&
                  "opacity-50",
                userTypePending && "pointer-events-none opacity-60"
              )}
              onClick={() => handleSelectForWhom("someone-else")}
            >
              <Image
                src="/asset/images/someone.png"
                width={58}
                height={58}
                className="size-[58px] rounded-full object-cover"
                alt="someone-else"
              />
              <div>
                <h4 className="text-[18px] font-semibold text-gray-800">
                  Someone else
                </h4>
                <p className="text-sm font-medium text-gray-500">
                  Our medical professional visits you to assess your needs.{" "}
                </p>
              </div>
              {hasSetUserType && savedUserType === "someone-else" && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              {userTypePending && forWhom === "someone-else" && (
                <span className="ml-2 animate-pulse text-blue-600">
                  Loading...
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <StepHeader
            title="Choose your plan"
            description="Find the right plan for your needs"
          />
          {hasSetPlan && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800">
                  You have selected:{" "}
                  {paymentPlans.find((p) => p.id === savedPlan)?.planTitle ||
                    savedPlan}
                </p>
              </div>
              <p className="mt-1 text-sm text-green-600">
                This plan has been saved and cannot be changed.
              </p>
            </div>
          )}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paymentPlans.map((payment) => (
              <PricingPlan
                key={payment.id}
                disabled={userPlanPending}
                selected={hasSetPlan && savedPlan === payment.id}
                id={payment.id}
                planOffers={payment.planOffers}
                planTitle={payment.planTitle}
                savedPlan={savedPlan || ""}
                handlePlan={handleSelectPlan}
              />
            ))}
          </div>
        </>
      )}
      <StepFooter
        disabled={userPlanPending || userTypePending}
        hideBackButton={internalStep === 1}
        onBack={handleBack}
        skipText="Next"
        onSkip={handleSkip}
      />
    </div>
  );
};
