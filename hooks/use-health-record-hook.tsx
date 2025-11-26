import { useState } from "react";
import { toast } from "sonner";

import { exportHealthRecordAsPDF } from "@/app/actions/services/health.record";
import { HealthRecordRow } from "@/types";

export function useExportHealthRecord() {
  const [isExporting, setIsExporting] = useState(false);

  const exportRecord = async (healthRecord: HealthRecordRow) => {
    setIsExporting(true);

    try {
      toast.loading("Generating PDF...", { id: "export-pdf" });

      const result = await exportHealthRecordAsPDF(healthRecord);

      if (result.success && result.pdf && result.filename) {
        // Convert base64 to blob
        const base64Data = result.pdf.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Health record exported successfully", {
          id: "export-pdf",
        });
      } else {
        toast.error(result.message || "Failed to export health record", {
          id: "export-pdf",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("An error occurred while exporting", { id: "export-pdf" });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportRecord, isExporting };
}
