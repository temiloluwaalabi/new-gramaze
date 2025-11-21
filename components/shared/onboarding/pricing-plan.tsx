import { Check, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  planTitle: string;
  planOffers: string[];
  amount: number;
  handlePlan: (value: string) => void;
  disabled: boolean;
  isSelected: boolean;
  isSaved: boolean;
  isChanging?: boolean;
};

export const PricingPlan = (props: Props) => {
  const {
    id,
    planTitle,
    planOffers,
    amount,
    handlePlan,
    disabled,
    isSelected,
    isSaved,
    isChanging,
  } = props;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getButtonText = () => {
    if (disabled) return "Loading...";
    if (isChanging) return "Changing to this plan...";
    if (isSelected && isSaved) return "Current Plan";
    if (isSelected && !isSaved) return "Selected";
    if (isSaved) return "Current Plan";
    return "Select Plan";
  };

  const getButtonIcon = () => {
    if (disabled) return <Loader2 className="me-2 size-4 animate-spin" />;
    if (isChanging) return <RefreshCw className="me-2 size-4" />;
    if (isSelected || isSaved) return <CheckCircle className="me-2 size-4" />;
    return null;
  };

  return (
    <div
      className={cn(
        "group flex h-full w-full cursor-pointer flex-col gap-[42px] rounded-[6px] border border-gray-300 bg-gray-50 p-4 hover:border-blue-700 hover:bg-blue-50",
        // Current saved plan
        isSaved && !isSelected && "border-gray-300 bg-gray-50",
        // Selected (whether saved or new selection)
        isSelected && "border-blue-600 bg-blue-50 shadow-lg",
        // Changing from saved to new
        isChanging && "border-yellow-500 bg-yellow-50",
        // Hover effects
        !disabled && !isSelected && "hover:border-blue-400 hover:shadow-md",
        disabled && "pointer-events-none opacity-60"
      )}
      onClick={() => !disabled && handlePlan(id)}
      aria-disabled={disabled || undefined}
    >
      {/* Header with price */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h4 className="text-xl font-bold text-gray-800">{planTitle}</h4>
          {isSaved && !isChanging && (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Current
            </span>
          )}
          {isChanging && (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
              Changing
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {formatAmount(amount)}
          </span>
          <span className="text-sm text-gray-500">/month</span>
        </div>
      </div>
      {/* Action button */}
      <Button
        className={cn(
          "h-[45px] w-full rounded-[6px] border border-gray-300 bg-white p-3 text-base font-medium text-[#030712] group-hover:bg-blue-500 group-hover:text-white",
          // Selected state
          isSelected &&
            "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
          // Saved but not selected (can change)
          isSaved &&
            !isSelected &&
            "border-green-600 bg-white text-green-700 hover:bg-green-50",
          // Changing state
          isChanging && "border-yellow-500 bg-yellow-500 text-white",
          // Hover effects
          !disabled &&
            !isSelected &&
            !isSaved &&
            "hover:border-blue-600 hover:bg-blue-600 hover:text-white"
        )}
        disabled={disabled}
        type="button"
        // onClick={(e) => {
        //   e.stopPropagation();
        //   !disabled && handlePlan(id);
        // }}
        onClick={(e) => {
          e.stopPropagation();
          handlePlan(props.id);
        }}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      {/* Features list */}
      <div className="flex flex-1 flex-col gap-3">
        {planOffers.map((offer, index) => (
          <div key={`${id}-${index}`} className="flex items-start gap-3">
            <Check
              className={cn(
                "mt-0.5 size-5 flex-shrink-0",
                isSelected ? "text-blue-600" : "text-green-600"
              )}
            />
            <span className="text-sm leading-relaxed text-gray-600">
              {offer}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
