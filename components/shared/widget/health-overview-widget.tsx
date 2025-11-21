// @flow
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { TrendData } from "@/lib/health-tracker-trends";

type Props = {
  title: string;
  category: string;
  showStat?: boolean;
  trend?: TrendData | null;
  onPeriodChange?: (period: string) => void;
};
export const HealthOverviewWidget = (props: Props) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("this-month");
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    props.onPeriodChange?.(value);
  };

  // Determine color based on trend
  const getTrendColor = () => {
    if (!props.trend) return "text-gray-600";

    if (props.trend.direction === "stable") return "text-gray-600";

    // Use isGood flag to determine color
    return props.trend.isGood ? "text-green-600" : "text-red-600";
  };

  // Get trend icon
  const TrendIcon = () => {
    if (!props.trend || props.trend.direction === "stable") {
      return <Minus className="size-3 sm:size-4" />;
    }

    return props.trend.direction === "up" ? (
      <TrendingUp className="size-3 sm:size-4" />
    ) : (
      <TrendingDown className="size-3 sm:size-4" />
    );
  };
  return (
    <div className="flex h-fit w-full flex-col gap-3 rounded-md border border-[#F0F2F5] bg-white p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <p className="text-xs font-normal text-[#999999] sm:text-sm">
          {props.category}
        </p>
        <h2 className="text-lg font-bold text-black sm:text-xl md:text-2xl">
          {props.title === "N/A" ? (
            <span className="text-[#999999]">No data</span>
          ) : (
            props.title
          )}
        </h2>
      </div>
      <Separator className="bg-[#E7EBED]" />
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-full border-none p-0 text-xs shadow-none sm:w-auto sm:text-sm">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
        {props.showStat && props.trend && props.title !== "N/A" && (
          <span
            className={`mt-2 flex items-center gap-1 text-xs font-normal sm:mt-0 sm:text-sm ${getTrendColor()}`}
          >
            {props.trend.direction === "stable" ? (
              <span>Stable</span>
            ) : (
              <span>
                {props.trend.direction === "up" ? "+" : "-"}
                {props.trend.value.toFixed(1)}%
              </span>
            )}
            <TrendIcon />
          </span>
        )}

        {props.showStat && !props.trend && props.title !== "N/A" && (
          <span className="mt-2 flex items-center gap-1 text-xs font-normal text-[#999999] sm:mt-0 sm:text-sm">
            No trend
          </span>
        )}
      </div>
    </div>
  );
};
