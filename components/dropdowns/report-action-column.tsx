"use client";
import { Download, EllipsisVertical, Share2 } from "lucide-react";
import * as React from "react";

import { HealthReport } from "@/types";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
type Props = {
  report: HealthReport;
};
export const ReportActionColumn = ({ report }: Props) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  // const suspendUser = async () => {
  //   await SuspendUser(
  //     {
  //       user_id: user.id,
  //       pathname,
  //     },
  //     {
  //       onSuccess: (data) => {
  //         setOpenDropdown(false);
  //         toast.success(data.message);
  //       },
  //     }
  //   );
  // };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = report.report_file;
    link.download = report.report_name || "report";
    link.target = "_blank"; // Fallback if download attribute doesn't work
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: report.report_name,
          text: `Check out this health report: ${report.report_name}`,
          url: report.report_file,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(report.report_file);
      // You can add a toast notification here
      alert("Link copied to clipboard!");
    }
  };
  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <div className="flex items-center gap-2">
        <DropdownMenuTrigger className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="!h-[24px] cursor-pointer bg-gray-200"
          >
            <EllipsisVertical className="z-50 size-4 cursor-pointer text-sm text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        align="end"
        className="w-[320px] !space-y-[2px] rounded-[8px] bg-gray-100 p-[8px]"
      >
        <DropdownMenuItem onClick={handleDownload}>
          <Button className="flex h-[41px] w-full cursor-pointer items-center justify-start gap-[6px] rounded-[4px] bg-white p-[10px] text-sm font-medium text-[#4B5563] shadow-none hover:bg-blue-200">
            <Download className="mr-2 size-4" />
            Download Report
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare}>
          <Button className="flex h-[41px] w-full cursor-pointer items-center justify-start gap-[6px] rounded-[4px] bg-white p-[10px] text-sm font-medium text-[#4B5563] shadow-none hover:bg-blue-200">
            <Share2 className="mr-2 size-4" />
            Share Report
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
