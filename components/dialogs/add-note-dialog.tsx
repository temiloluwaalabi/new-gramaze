/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { useAddHealthNote } from "@/lib/queries/use-caregiver-query";
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

// Define the schema for the form
const AddNoteSchema = z.object({
  title: z.string(),
  content: z.string().min(10, "Note must be at least 10 characters"),
  attachments: z.array(z.instanceof(File)).optional(),
});

type AddNoteType = z.infer<typeof AddNoteSchema>;

type Props = {
  dialogTrigger: React.ReactNode;
  patient_id: number;
  health_record_id?: number; // Optional - only if adding within a health record
};

export default function AddNoteDialog({
  dialogTrigger,
  patient_id,
  health_record_id,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useUserStore();

  const form = useForm<AddNoteType>({
    resolver: zodResolver(AddNoteSchema),
    defaultValues: {
      content: "",
      attachments: [],
    },
  });

  const { isPending: AddingNote, mutateAsync: AddNote } = useAddHealthNote();

  const handleSubmit = async (dataValues: AddNoteType) => {
    const formData = new FormData();

    // Add basic fields
    formData.append("content", dataValues.content);
    formData.append("title", dataValues.title);
    formData.append("user_id", patient_id.toString());
    formData.append("created_by_id", user?.id?.toString() || "");
    formData.append(
      "created_by_name",
      `${user?.first_name} ${user?.last_name}` || ""
    );

    // Add health_record_id if it exists
    if (health_record_id) {
      formData.append("health_record_id", health_record_id.toString());
    }

    // Add attachments if any
    if (dataValues.attachments && dataValues.attachments.length > 0) {
      dataValues.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    AddNote(formData, {
      onSuccess: () => {
        form.reset();
        //   toast.success(data.message || "Note added successfully");
        setOpenDialog(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to add note");
      },
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <CustomFormField
              control={form.control}
              name="title"
              label="Note title"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              disabled={AddingNote}
              placeholder="e.g., Blood Test Results - January 2024"
            />
            {/* Note Content */}
            <CustomFormField
              control={form.control}
              name="content"
              label="Note"
              fieldType={FormFieldTypes.QUILL}
              disabled={AddingNote}
              placeholder="Enter your observation, assessment, or any important information about the patient..."
              formDescription="Document important observations, care updates, or any relevant patient information"
              className="min-h-[150px]"
            />

            {/* File Attachments (Optional) */}
            <CustomFormField
              control={form.control}
              name="attachments"
              label="Attach Files (Optional)"
              fieldType={FormFieldTypes.SKELETON}
              disabled={AddingNote}
              formDescription="Attach relevant images or documents to support your note. Maximum 5 files."
              renderSkeleton={() => (
                <ImageUpload
                  isDialog={false}
                  multiple={true}
                  maxFiles={5}
                  form={form}
                  fieldName="attachments"
                  maxSize={10} // 10MB max per file
                  allowedTypes={{
                    "application/pdf": [".pdf"],
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                    "application/msword": [".doc"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [".docx"],
                  }}
                  disabled={AddingNote}
                  showActions={false}
                />
              )}
            />

            <DialogFooter className="mt-6">
              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="!h-[45px] text-sm"
                  onClick={() => setOpenDialog(false)}
                  disabled={AddingNote}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex !h-[45px] items-center text-sm"
                  disabled={AddingNote}
                >
                  {AddingNote && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  <Plus className="mr-1 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
