"use client";

import { Download } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { HealthReport } from "@/types";

type ViewReportDialogProps = {
  report: HealthReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Helper function to get file extension icon
const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "📄";
    case "doc":
    case "docx":
      return "📝";
    case "jpg":
    case "jpeg":
    case "png":
      return "🖼️";
    default:
      return "📎";
  }
};

// Helper function to get report type badge
const getReportTypeBadge = (reportType: string) => {
  const colors: Record<string, string> = {
    lab: "bg-purple-100 text-purple-600 border-purple-200",
    imaging: "bg-blue-100 text-blue-600 border-blue-200",
    prescription: "bg-green-100 text-green-600 border-green-200",
    consultation: "bg-orange-100 text-orange-600 border-orange-200",
    discharge: "bg-red-100 text-red-600 border-red-200",
    progress: "bg-teal-100 text-teal-600 border-teal-200",
    other: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const labels: Record<string, string> = {
    lab: "Lab Results",
    imaging: "Imaging",
    prescription: "Prescription",
    consultation: "Consultation",
    discharge: "Discharge",
    progress: "Progress",
    other: "Other",
  };

  return (
    <Badge
      variant="outline"
      className={`text-xs ${colors[reportType] || colors.other}`}
    >
      {labels[reportType] || "Other"}
    </Badge>
  );
};

export function ViewReportDialog({
  report,
  open,
  onOpenChange,
}: ViewReportDialogProps) {
  if (!report) return null;

  const handleDownload = async () => {
    try {
      // You'll need to implement the actual download logic based on your backend
      // For now, this is a placeholder
      const response = await fetch(`/api/reports/${report.id}/download`);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = report.report_file;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      // You might want to show a toast error here
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold">
              Report Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Header */}
          <div className="flex items-start gap-4">
            <div className="flex size-[60px] items-center justify-center rounded-[8px] bg-[#F5F5F5] text-3xl">
              {getFileIcon(report.report_file)}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-[#303030]">
                {report.report_name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {getReportTypeBadge("prescription")}
                <span className="text-sm text-gray-500">
                  Uploaded {formatDate(report.created_at)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-[#E8E8E8]" />

          {/* Report Information */}
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-[#787878]">
                File Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-[6px] bg-[#F9FAFB] p-3">
                  <span className="text-sm text-[#66666B]">File Name</span>
                  <span className="text-sm font-medium text-[#303030]">
                    {report.report_file}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-[6px] bg-[#F9FAFB] p-3">
                  <span className="text-sm text-[#66666B]">Upload Date</span>
                  <span className="text-sm font-medium text-[#303030]">
                    {formatDate(report.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-[6px] bg-[#F9FAFB] p-3">
                  <span className="text-sm text-[#66666B]">Uploaded By</span>
                  <span className="text-sm font-medium text-[#303030]">
                    {/* {report.caregiver
                      ? `${report.caregiver.first_name} ${report.caregiver.last_name}`
                      : 'Dr. Sarah Johnson'} */}
                    Dr. Sarah Johnson
                  </span>
                </div>
                {report.health_record_id && (
                  <div className="flex items-center justify-between rounded-[6px] bg-[#F9FAFB] p-3">
                    <span className="text-sm text-[#66666B]">
                      Health Record ID
                    </span>
                    <span className="text-sm font-medium text-[#303030]">
                      #{report.health_record_id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Section */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-[#787878]">
                Summary
              </h4>
              <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-4">
                <p className="text-sm leading-relaxed text-[#303030]">
                  Patient&apos;s blood test shows normal levels for all
                  parameters.
                </p>
              </div>
            </div>
            {/* {report.summary && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-[#787878]">
                  Summary
                </h4>
                <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-4">
                  <p className="text-sm leading-relaxed text-[#303030]">
                    {report.summary}
                  </p>
                </div>
              </div>
            )} */}
          </div>

          <Separator className="bg-[#E8E8E8]" />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="!h-[45px]"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              className="flex !h-[45px] items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="size-4" />
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
