/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable new-cap */
"use server";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import { getMetricDisplayConfig } from "@/lib/health-tracker-utils";
import { formatDate } from "@/lib/utils";
import { HealthRecordRow } from "@/types";
interface PDFConfig {
  facilityName?: string;
  facilityAddress?: string;
  facilityPhone?: string;
  facilityEmail?: string;
  facilityWebsite?: string;
  logoPath?: string;
  primaryColor?: string; // RGB
  accentColor?: string; // RGB
}

export async function exportHealthRecordAsPDF(
  healthRecord: HealthRecordRow,
  config?: PDFConfig
) {
  try {
    const pdf = new jsPDF();

    // Configuration with defaults
    const pdfConfig: PDFConfig = {
      facilityName: config?.facilityName || "Gramaze Healthcare",
      facilityAddress:
        config?.facilityAddress || "123 Medical Center Drive, Suite 100",
      facilityPhone: config?.facilityPhone || "+1 (555) 123-4567",
      facilityEmail: config?.facilityEmail || "info@gramazehealthcare.com",
      facilityWebsite: config?.facilityWebsite || "www.gramazehealthcare.com",
      logoPath:
        config?.logoPath ||
        "https://res.cloudinary.com/davidleo/image/upload/v1744665654/gramaze-logo_yt4zo6.png",
      primaryColor: config?.primaryColor || "#1E3A8A", // Blue
      accentColor: config?.accentColor || "#BFDBFE", // Light Blue
    };

    let yPosition = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to check if we need a new page
    const checkPageBreak = (additionalHeight: number) => {
      if (yPosition + additionalHeight > pdf.internal.pageSize.height - 20) {
        pdf.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Helper to add a section divider
    const addSectionDivider = () => {
      pdf.setDrawColor(pdfConfig.accentColor || "#BFDBFE");
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    };

    // ====================================================================
    // PROFESSIONAL LETTERHEAD
    // ====================================================================

    const addLetterhead = () => {
      // Background header bar
      pdf.setFillColor(pdfConfig.primaryColor || "#1E3A8A");
      pdf.rect(0, 0, pageWidth, 40, "F");

      // Logo placeholder (if logo path provided, you can add actual logo)
      if (pdfConfig.logoPath) {
        try {
          // For actual logo: pdf.addImage(logoPath, 'PNG', margin, 8, 25, 25);
          // For now, we'll create a circular placeholder
          pdf.setFillColor(255, 255, 255);
          pdf.circle(margin + 12, 20, 12, "F");
          pdf.setTextColor(pdfConfig.primaryColor || "#1E3A8A");
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("GH", margin + 6, 24);
        } catch (error) {
          console.error("Error adding logo:", error);
        }
      } else {
        // Circular logo placeholder with initials
        pdf.setFillColor(255, 255, 255);
        pdf.circle(margin + 12, 20, 12, "F");
        pdf.setTextColor(pdfConfig.primaryColor || "#1E3A8A");
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        const initials = pdfConfig.facilityName
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        pdf.text(
          initials || "GH",
          margin + (initials?.length === 1 ? 9 : 6),
          24
        );
      }

      // Facility Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(pdfConfig.facilityName || "", margin + 40, 18);

      // Contact Information
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(pdfConfig.facilityAddress || "", margin + 40, 26);
      pdf.text(
        `${pdfConfig.facilityPhone} | ${pdfConfig.facilityEmail}`,
        margin + 40,
        31
      );
      pdf.text(pdfConfig.facilityWebsite || "", margin + 40, 36);

      // Document type badge (top right)
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(pageWidth - 70, 10, 50, 20, 3, 3, "F");
      pdf.setTextColor(pdfConfig.primaryColor || "#1E3A8A");
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("MEDICAL", pageWidth - 65, 18);
      pdf.text("RECORD", pageWidth - 65, 25);

      yPosition = 55;
    };

    addLetterhead();

    // ====================================================================
    // DOCUMENT TITLE & METADATA
    // ====================================================================

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("Health Record Report", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Generated: ${formatDate(new Date().toISOString())}`,
      margin,
      yPosition
    );
    pdf.text(
      `Record ID: #${healthRecord.id}`,
      pageWidth - margin - 50,
      yPosition
    );
    yPosition += 15;

    addSectionDivider();

    // ====================================================================
    // RECORD INFORMATION - Enhanced Box
    // ====================================================================

    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(margin, yPosition, contentWidth, 45, 3, 3, "F");

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Record Information", margin + 5, yPosition + 8);

    yPosition += 15;

    const recordConfig =
      REPORT_TYPE_CONFIGS[
        healthRecord.record_type as keyof typeof REPORT_TYPE_CONFIGS
      ];

    const recordInfo = [
      ["Record ID", healthRecord.id.toString()],
      ["Title", healthRecord.title],
      ["Type", recordConfig?.label || healthRecord.record_type],
      ["Status", healthRecord.status.toUpperCase()],
      [
        "Created By",
        `${healthRecord.creator.first_name} ${healthRecord.creator.last_name}`,
      ],
      ["Created On", formatDate(healthRecord.created_at)],
    ];

    // if (healthRecord.description) {
    //   recordInfo.push(["Description", healthRecord.description]);
    // }

    autoTable(pdf, {
      startY: yPosition,
      head: [],
      body: recordInfo,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 35, textColor: [75, 85, 99] },
        1: { cellWidth: contentWidth - 45, textColor: [0, 0, 0] },
      },
      margin: { left: margin },
    });
    yPosition = (pdf as any).lastAutoTable.finalY + 15;

    if (healthRecord.description) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(75, 85, 99);
      pdf.text("Description:", margin, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const descLines = pdf.splitTextToSize(
        healthRecord.description,
        contentWidth
      );
      descLines.forEach((line: string) => {
        checkPageBreak(7);
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }
    addSectionDivider();
    checkPageBreak(50);

    // ====================================================================
    // PATIENT INFORMATION - Enhanced Box
    // ====================================================================

    if (healthRecord.patient) {
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 45, 3, 3, "F");

      pdf.setTextColor(pdfConfig.primaryColor || "#1E3A8A");
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Patient Information", margin + 5, yPosition + 8);

      yPosition += 15;

      const patientInfo = [
        [
          "Name",
          `${healthRecord.patient.first_name} ${healthRecord.patient.last_name}`,
        ],
        ["Email", healthRecord.patient.email],
        ["Patient ID", `#${healthRecord.patient.id}`],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: patientInfo,
        theme: "plain",
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 35, textColor: [75, 85, 99] },
          1: { cellWidth: contentWidth - 45, textColor: [0, 0, 0] },
        },
        margin: { left: margin + 5, right: margin + 5 },
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;
      addSectionDivider();
      checkPageBreak(50);
    }

    // ====================================================================
    // APPOINTMENT INFORMATION - Enhanced Box
    // ====================================================================

    if (healthRecord.appointment) {
      pdf.setFillColor(254, 243, 199);
      pdf.roundedRect(margin, yPosition, contentWidth, 45, 3, 3, "F");

      pdf.setTextColor(217, 119, 6);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Appointment Details", margin + 5, yPosition + 8);

      yPosition += 15;

      const appointmentInfo = [
        ["Date", formatDate(healthRecord.appointment.date)],
        ["Time", healthRecord.appointment.time],
        ["Type", healthRecord.appointment.appointment_type],
        ["Status", healthRecord.appointment.status.toUpperCase()],
      ];

      if (healthRecord.appointment.location) {
        appointmentInfo.push(["Location", healthRecord.appointment.location]);
      }

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: appointmentInfo,
        theme: "plain",
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 35, textColor: [75, 85, 99] },
          1: { cellWidth: contentWidth - 45, textColor: [0, 0, 0] },
        },
        margin: { left: margin + 5, right: margin + 5 },
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 15;
      addSectionDivider();
      checkPageBreak(50);
    }

    // ====================================================================
    // HEALTH VITALS - Enhanced Table with Icons
    // ====================================================================

    if (healthRecord.trackers && healthRecord.trackers.length > 0) {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Health Vitals (${healthRecord.trackers.length} records)`,
        margin,
        yPosition
      );
      yPosition += 8;

      // Get latest vitals
      const latestVitals: Record<string, any> = {};
      const sortedTrackers = [...healthRecord.trackers].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      for (const tracker of sortedTrackers) {
        const metrics = JSON.parse(tracker.metrics);
        metrics?.forEach((metric: any) => {
          if (metric.code && metric.value && !latestVitals[metric.code]) {
            latestVitals[metric.code] = {
              value: metric.value,
              name: metric.name || metric.code,
              updated_at: tracker.updated_at,
              status: tracker.status,
            };
          }
        });
      }

      const vitalsData = Object.entries(latestVitals).map(
        ([code, data]: [string, any]) => {
          const config = getMetricDisplayConfig(code);
          return [
            config.displayName,
            data.value,
            data.status || "Recorded",
            formatDate(data.updated_at),
          ];
        }
      );

      if (vitalsData.length > 0) {
        autoTable(pdf, {
          startY: yPosition,
          head: [["Vital Sign", "Value", "Status", "Last Updated"]],
          body: vitalsData,
          theme: "striped",
          styles: {
            fontSize: 10,
            cellPadding: 5,
          },
          headStyles: {
            fillColor: pdfConfig.primaryColor,
            fontStyle: "bold",
            fontSize: 11,
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251],
          },
          margin: { left: margin, right: margin },
        });

        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      } else {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        pdf.text("No vitals recorded", margin, yPosition);
        yPosition += 15;
      }

      addSectionDivider();
      checkPageBreak(50);
    }

    // ====================================================================
    // MEDICAL REPORTS - Enhanced with Download Links
    // ====================================================================

    if (healthRecord.reports && healthRecord.reports.length > 0) {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Medical Reports (${healthRecord.reports.length})`,
        margin,
        yPosition
      );
      yPosition += 8;

      healthRecord.reports.forEach((report) => {
        checkPageBreak(35);

        // Report box
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(margin, yPosition, contentWidth, 28, 2, 2, "F");

        // Report icon/badge
        const reportConfig =
          REPORT_TYPE_CONFIGS[
            report.report_type as keyof typeof REPORT_TYPE_CONFIGS
          ];
        pdf.setFillColor(pdfConfig.accentColor || "#BFDBFE");
        pdf.circle(margin + 8, yPosition + 14, 6, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.text("R", margin + 6, yPosition + 16);

        // Report details
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(report.report_name, margin + 20, yPosition + 10);

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `${reportConfig?.label || report.report_type} | ${formatDate(report.created_at)}`,
          margin + 20,
          yPosition + 16
        );

        // Download link
        if (report.report_file) {
          pdf.setTextColor(pdfConfig.primaryColor || "1E3A8A");
          pdf.setFont("helvetica", "italic");
          pdf.setFontSize(8);
          const fileText = `📎 File: ${report.report_file.substring(0, 50)}${report.report_file.length > 50 ? "..." : ""}`;
          pdf.text(fileText, margin + 20, yPosition + 22);
        }

        // Description if available
        if (report.summary) {
          pdf.setTextColor(75, 85, 99);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "normal");
          const summaryText =
            report.summary.substring(0, 60) +
            (report.summary.length > 60 ? "..." : "");
          pdf.text(summaryText, margin + 20, yPosition + 26);
        }

        yPosition += 33;
      });

      yPosition += 5;
      addSectionDivider();
      checkPageBreak(50);
    }

    // ====================================================================
    // CLINICAL NOTES - Enhanced with Attachments
    // ====================================================================

    if (healthRecord.notes && healthRecord.notes.length > 0) {
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Clinical Notes (${healthRecord.notes.length})`,
        margin,
        yPosition
      );
      yPosition += 10;

      healthRecord.notes.forEach((note, index) => {
        checkPageBreak(50);

        // Note header with background
        pdf.setFillColor(243, 244, 246);
        pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, "F");

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(
          note.title || `Clinical Note #${note.id}`,
          margin + 5,
          yPosition + 8
        );

        yPosition += 15;

        // Note metadata
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `By ${note.created_by_name} | ${formatDate(note.created_at)}`,
          margin,
          yPosition
        );
        yPosition += 8;

        // Note content
        const noteText = note.notes.replace(/<[^>]*>/g, "").trim();
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);

        const splitText = pdf.splitTextToSize(noteText, contentWidth);
        splitText.forEach((line: string) => {
          checkPageBreak(7);
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });

        yPosition += 5;

        // Attachments section
        if (note.attachments) {
          const attachmentArray = Array.isArray(note.attachments)
            ? note.attachments
            : JSON.parse(note.attachments as string);

          if (attachmentArray.length > 0) {
            pdf.setFillColor(254, 249, 195);
            pdf.roundedRect(
              margin,
              yPosition,
              contentWidth,
              8 + attachmentArray.length * 5,
              2,
              2,
              "F"
            );

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(120, 53, 15);
            pdf.text(
              `📎 Attachments (${attachmentArray.length}):`,
              margin + 3,
              yPosition + 6
            );
            yPosition += 10;

            attachmentArray.forEach((attachment: string) => {
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(8);
              pdf.setTextColor(pdfConfig.primaryColor || "#1E3A8A");
              const attachmentText = `• ${attachment.substring(0, 70)}${attachment.length > 70 ? "..." : ""}`;
              pdf.text(attachmentText, margin + 5, yPosition);
              yPosition += 5;
            });

            yPosition += 5;
          }
        }

        // Separator between notes
        if (index < healthRecord.notes.length - 1) {
          yPosition += 5;
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.3);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        }
      });
    }

    // ====================================================================
    // FOOTER ON ALL PAGES
    // ====================================================================

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      // Footer background
      pdf.setFillColor(249, 250, 251);
      pdf.rect(0, pageHeight - 20, pageWidth, 20, "F");

      // Footer line
      pdf.setDrawColor(pdfConfig.accentColor || "#BFDBFE");
      pdf.setLineWidth(0.5);
      pdf.line(0, pageHeight - 20, pageWidth, pageHeight - 20);

      // Footer text
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont("helvetica", "normal");

      // Left: Confidentiality notice
      pdf.text("CONFIDENTIAL MEDICAL RECORD", margin, pageHeight - 12);

      // Center: Page number
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 12, {
        align: "center",
      });

      // Right: Facility name
      pdf.text(
        pdfConfig.facilityName || "",
        pageWidth - margin,
        pageHeight - 12,
        { align: "right" }
      );

      // Bottom line with generation info
      pdf.setFontSize(7);
      pdf.text(
        `Generated on ${formatDate(new Date().toISOString())}`,
        pageWidth / 2,
        pageHeight - 6,
        { align: "center" }
      );
    }

    // Convert to base64
    const pdfBase64 = pdf.output("datauristring");

    return {
      success: true,
      message: "Health record exported successfully",
      pdf: pdfBase64,
      filename: `HealthRecord-${healthRecord.id}-${Date.now()}.pdf`,
    };
  } catch (error) {
    console.error("Error exporting health record:", error);
    return {
      success: false,
      message: "Failed to export health record",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
