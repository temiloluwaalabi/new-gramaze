// @flow
import { TrendingUp } from "lucide-react";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
type Props = {
  title: string;
  category: string;
  showStat?: boolean;
};
export const HealthOverviewWidget = (props: Props) => {
  return (
    <div className="flex h-fit w-full flex-col gap-3 rounded-md border border-[#F0F2F5] bg-white p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <p className="text-xs font-normal text-[#999999] sm:text-sm">
          {props.category}
        </p>
        <h2 className="text-lg font-bold text-black sm:text-xl md:text-2xl">
          {props.title}
        </h2>
      </div>
      <Separator className="bg-[#E7EBED]" />
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Select defaultValue="this-month" value="this-month">
          <SelectTrigger className="w-full border-none p-0 text-xs shadow-none sm:w-auto sm:text-sm">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="next-month">Next Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
          </SelectContent>
        </Select>
        <span className="mt-2 flex items-center gap-1 text-xs font-normal sm:mt-0 sm:text-sm">
          <span>+21.01%</span>
          <TrendingUp className="size-3 text-green-900 sm:size-4" />
        </span>
      </div>
    </div>
  );
};
