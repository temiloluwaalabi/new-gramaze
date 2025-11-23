/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldTypes } from "@/config/enum";
import { useAddHealthReport } from "@/lib/queries/use-caregiver-query";
import {
  AddHealthReportSchema,
  AddHealthReportSchemaType,
} from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";

import { CustomFormField } from "../shared/custom-form-field";
import { ImageUpload } from "../shared/image-upload";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

type Props = {
  dialogTrigger: React.ReactNode;
  patient_id: number;
  health_record_id?: number; // Optional - only if adding within a health record
};

const REPORT_TYPES = [
  { id: "lab", label: "Lab Results" },
  { id: "imaging", label: "Imaging (X-ray, MRI, CT)" },
  { id: "prescription", label: "Prescription" },
  { id: "consultation", label: "Consultation Notes" },
  { id: "discharge", label: "Discharge Summary" },
  { id: "progress", label: "Progress Notes" },
  { id: "other", label: "Other" },
];

export default function AddReportDialog({
  dialogTrigger,
  patient_id,
  health_record_id,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useUserStore();

  const form = useForm<AddHealthReportSchemaType>({
    resolver: zodResolver(AddHealthReportSchema),
    defaultValues: {
      report_name: "",
      report_type: "",
      summary: "",
    },
  });

  const { isPending: AddingReport, mutateAsync: AddReport } =
    useAddHealthReport();

  const handleSubmit = async (dataValues: AddHealthReportSchemaType) => {
    const formData = new FormData();

    // Add basic fields
    formData.append("report_name", dataValues.report_name);
    formData.append("report_type", dataValues.report_type);
    formData.append("summary", dataValues.summary);
    formData.append("user_id", patient_id.toString());
    formData.append("caregiver_id", user?.id?.toString() || "");
    formData.append("created_by_id", user?.id?.toString() || "");

    // Add health_record_id if it exists
    if (health_record_id) {
      formData.append("health_record_id", health_record_id.toString());
    }

    // // Add files
    // if (dataValues.report_file && dataValues.report_file.length > 0) {
    //   dataValues.report_file.forEach((file, index) => {
    //     formData.append(`report_file[${index}]`, file);
    //   });
    // }

    formData.append("report_file", dataValues.report_file);

    AddReport(formData, {
      onSuccess: () => {
        form.reset();
        // toast.success(data.message || "Report added successfully");
        setOpenDialog(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to add report");
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Report</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Report Name */}
            <CustomFormField
              control={form.control}
              name="report_name"
              label="Report Name"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              disabled={AddingReport}
              placeholder="e.g., Blood Test Results - January 2024"
            />

            {/* Report Type */}
            <CustomFormField
              control={form.control}
              name="report_type"
              label="Report Type"
              fieldType={FormFieldTypes.SELECT}
              disabled={AddingReport}
              placeholder="Select report type"
            >
              {REPORT_TYPES.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id}
                  className="mb-2 cursor-pointer"
                >
                  {type.label}
                </SelectItem>
              ))}
            </CustomFormField>

            {/* Summary */}
            <CustomFormField
              control={form.control}
              name="summary"
              label="Summary"
              fieldType={FormFieldTypes.TEXTAREA}
              rows={2}
              disabled={AddingReport}
              placeholder="Provide a brief summary of the report findings..."
              formDescription="Include key findings, observations, or important notes"
            />

            {/* File Upload */}
            <CustomFormField
              control={form.control}
              name="report_file"
              label="Attach Report Files"
              fieldType={FormFieldTypes.SKELETON}
              disabled={AddingReport}
              formDescription="Upload report files (PDF, images, etc.)"
              renderSkeleton={() => (
                <ImageUpload
                  isDialog={false}
                  multiple={false}
                  form={form}
                  fieldName="report_file"
                  allowedTypes={{
                    "application/pdf": [".pdf"],
                    "image/*": [".png", ".jpg", ".jpeg"],
                    "application/msword": [".doc"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [".docx"],
                  }}
                />
              )}
            />

            <DialogFooter>
              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="!h-[45px] text-sm"
                  onClick={() => setOpenDialog(false)}
                  disabled={AddingReport}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex !h-[45px] items-center text-sm"
                  disabled={AddingReport}
                >
                  {AddingReport && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  <Plus className="mr-1 h-4 w-4" />
                  Add Report
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
