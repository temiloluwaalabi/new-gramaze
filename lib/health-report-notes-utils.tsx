/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from "@/components/ui/badge";

// Helper function to get file extension icon
export const getFileIcon = (fileName: string) => {
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

// Helper function to format file size (you'll need actual size from backend)
export const formatFileSize = (fileName: string) => {
  // Placeholder until backend provides actual file size
  return "2.5 MB";
};

// Helper function to get report type badge color
export const getReportTypeBadge = (reportType: string) => {
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
