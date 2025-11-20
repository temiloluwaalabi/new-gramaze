/* eslint-disable react-hooks/exhaustive-deps */
// @flow
import { CheckCircle, Info } from "lucide-react";
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
import { OnboardingStepsI } from "@/types";

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
export const PlanSelectionStep: React.FC<OnboardingStepsI> = () => {
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
  console.log("FORMWHOL", forWhom)
  const [internalStep, setInternalStep] = React.useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = React.useState<string>(
    data.plan || ""
  );
  const [isChangingPlan, setIsChangingPlan] = React.useState(false);

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
      setSelectedPlan(savedPlan || "");
    } else if (hasSetUserType && !hasSetPlan) {
      // Only user type is completed, show plan selection
      setInternalStep(2);
      updateData("forWhom", savedUserType || "");
    } else if (!hasSetUserType && hasSetPlan) {
      // Only plan is completed (edge case), show user type selection
      setInternalStep(1);
      updateData("plan", savedPlan || "");
      setSelectedPlan(savedPlan || "");
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
  const handleSelectPlan = (planId: string) => {
    // Update local state immediately for better UX
    setSelectedPlan(planId);
    updateData("plan", planId);

    // If changing an existing plan, show confirmation
    if (hasSetPlan && savedPlan !== planId) {
      setIsChangingPlan(true);
    }
  };

  const confirmPlanSelection = () => {
    SetUserPlan(selectedPlan, {
      onSuccess: async () => {
        const user = await getUserInfo();
        if (user.success) {
          setUser(user.user);
          toast.success(
            hasSetPlan
              ? "Plan updated successfully!"
              : "Plan selected successfully!"
          );
          markStepComplete(currentStep);
          setIsChangingPlan(false);
          goToStep("bio-data");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to set plan. Please try again.");
        setIsChangingPlan(false);
      },
    });
  };

  const handleNext = () => {
    if (internalStep === 1) {
      if (!forWhom) {
        toast.error("Please select who you're signing for");
        return;
      }
      setInternalStep(2);
    } else {
      if (!selectedPlan) {
        toast.error("Please select a plan");
        return;
      }
      confirmPlanSelection();
    }
  };
  const handleBack = () => {
    if (internalStep === 2) {
      if (!hasSetUserType) {
        setInternalStep(1);
      } else {
        goToPrevStep();
      }
    } else {
      goToPrevStep();
    }
  };
  const getUserTypeDisplayName = (userType: string) => {
    return userType === "myself" ? "Myself" : "Someone else";
  };

  const getPlanDisplayName = (planId: string) => {
    const plan = paymentPlans.find((p) => p.id === planId);
    return plan?.planTitle || planId;
  };

  return (
    <div>
      {internalStep === 1 ? (
        <>
          <StepHeader
            title="Who are you signing for?"
            description="Choose an option below to manage services tailored for you or your dependents"
          />
          {hasSetUserType && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <p className="font-medium text-blue-800">
                  Previously selected:{" "}
                  {getUserTypeDisplayName(savedUserType || "")}
                </p>
              </div>
              <p className="mt-1 text-sm text-blue-600">
                This selection cannot be changed once set.
              </p>
            </div>
          )}
          <div className="space-y-[21px]">
            <div
              className={cn(
                "flex h-[98px] items-center gap-2 rounded-[6px] border border-gray-300 bg-white p-5 transition-all",
                savedUserType === "myself" &&
                  hasSetUserType &&
                  "border-green-500 bg-green-50",
                !hasSetUserType &&
                  "cursor-pointer hover:border-blue-700 hover:bg-blue-50",
                !hasSetUserType &&
                  forWhom === "myself" &&
                  "border-blue-700 bg-blue-50",
                hasSetUserType && savedUserType !== "myself" && "opacity-50",
                userTypePending && "pointer-events-none opacity-60"
              )}
              onClick={() => !hasSetUserType && handleSelectForWhom("myself")}
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
                savedUserType === "someone-else" &&
                  hasSetUserType &&
                  "border-green-500 bg-green-50",
                !hasSetUserType &&
                  "cursor-pointer hover:border-blue-700 hover:bg-blue-50",
                !hasSetUserType &&
                  forWhom === "someone-else" &&
                  "border-blue-700 bg-blue-50",
                hasSetUserType &&
                  savedUserType !== "someone-else" &&
                  "opacity-50",
                userTypePending && "pointer-events-none opacity-60"
              )}
              onClick={() =>
                !hasSetUserType && handleSelectForWhom("someone-else")
              }
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
          {hasSetPlan && savedPlan && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">
                    Current plan: {getPlanDisplayName(savedPlan)}
                  </p>
                  <p className="mt-1 text-sm text-blue-600">
                    You can change your plan by selecting a different option
                    below.
                  </p>
                </div>
              </div>
            </div>
          )}
          {isChangingPlan && selectedPlan !== savedPlan && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">
                    Changing plan from {getPlanDisplayName(savedPlan || "")} to{" "}
                    {getPlanDisplayName(selectedPlan)}
                  </p>
                  <p className="mt-1 text-sm text-yellow-600">
                    Click &quot;Continue&quot; to confirm this change.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paymentPlans.map((payment) => (
              <PricingPlan
                key={payment.id}
                disabled={userPlanPending}
                isSelected={selectedPlan === payment.id}
                isSaved={hasSetPlan && savedPlan === payment.id}
                id={payment.id}
                planOffers={payment.planOffers}
                planTitle={payment.planTitle}
                amount={payment.amount}
                handlePlan={handleSelectPlan}
                isChanging={
                  isChangingPlan &&
                  selectedPlan === payment.id &&
                  savedPlan !== payment.id
                }
              />
            ))}
          </div>
        </>
      )}
      {
        
      }
      <StepFooter
        disabled={userPlanPending || userTypePending}
        hideBackButton={internalStep === 1 && !hasSetUserType}
        onBack={handleBack}
        skipText={internalStep === 2 ? "Continue" : "Next"}
        onSkip={handleNext}
      />
    </div>
  );
};
