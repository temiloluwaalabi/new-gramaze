// @flow
import { Check, CheckCircle, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/onboarding-context";
import { cn } from "@/lib/utils";
type Props = {
  id: string;
  planTitle: string;
  planOffers: string[];
  handlePlan: (value: string) => void;
  disabled: boolean;
  selected?: boolean;
  savedPlan?: string;
};
export const PricingPlan = (props: Props) => {
  console.log("SAVED PLAN", props.savedPlan);
  const { data } = useOnboarding();
  const isCurrentSelection = data.plan === props.id;
  const isSavedSelection = props.selected;

  const isDisabled = (id: string) => {
    return !!(props.savedPlan && props.savedPlan !== id);
  };
  return (
    <div
      className={cn(
        "group flex h-full w-full cursor-pointer flex-col gap-[42px] rounded-[6px] border border-gray-300 bg-gray-50 p-4",
        // Show green styling if this plan is saved
        isSavedSelection && "border-green-500 bg-green-50",
        // Show blue styling for current selection (if not saved yet)
        !isSavedSelection && isCurrentSelection && "border-blue-700 bg-blue-50",
        // Show hover effects only if not disabled and not saved
        !props.disabled &&
          !isSavedSelection &&
          "hover:border-blue-700 hover:bg-blue-50",
        props.disabled && "pointer-events-none opacity-60"
      )}
      aria-disabled={props.disabled || undefined}
    >
      <div className="flex items-start justify-between">
        <h4 className="text-2xl font-semibold text-gray-700">
          {props.planTitle}
        </h4>
        {isSavedSelection && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-green-600">Selected</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <Button
          className={cn(
            "h-[45px] w-full rounded-[6px] border border-gray-300 bg-white p-3 text-base font-medium text-[#030712]",
            // Saved selection styling
            isSavedSelection && "border-green-600 bg-green-500 text-white",
            // Current selection styling (if not saved)
            !isSavedSelection &&
              isCurrentSelection &&
              "border-blue-700 bg-blue-500 text-white",
            // Hover effects only if not disabled and not saved
            !props.disabled &&
              !isSavedSelection &&
              "group-hover:bg-blue-500 group-hover:text-white"
          )}
          disabled={props.disabled || isDisabled(props.id)}
          type="button"
          onClick={() => props.handlePlan(props.id)}
        >
          {props.disabled && <Loader2 className="me-2 size-4 animate-spin" />}
          {isSavedSelection && <CheckCircle className="me-2 size-4" />}

          {props.disabled
            ? "Loading..."
            : isSavedSelection
              ? "Selected Plan"
              : "Select Plan"}
        </Button>

        <div className="flex flex-col gap-[10px]">
          {props.planOffers.map((offer) => (
            <span key={offer} className="flex items-center gap-2 space-x-3">
              <Check className="size-5 text-blue-600" />
              <span className="text-base font-normal text-gray-500">
                {offer}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
