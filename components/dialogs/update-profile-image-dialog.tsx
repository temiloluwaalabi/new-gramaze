/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { useUpdateProfileImage } from "@/lib/queries/use-auth-queries";
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

const UpdateProfileImageSchema = z.object({
  image: z.instanceof(File),
});

type UpdateProfileImageSchemaType = z.infer<typeof UpdateProfileImageSchema>;

type Props = {
  dialogTrigger: React.ReactNode;
};

export default function UpdateProfileImageDialog({ dialogTrigger }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const form = useForm<UpdateProfileImageSchemaType>({
    resolver: zodResolver(UpdateProfileImageSchema),
  });

  const { setUser } = useUserStore();
  const { isPending: UpdatingProfileImage, mutateAsync: UpdateProfileImage } =
    useUpdateProfileImage();

  const handleSubmit = async (dataValues: UpdateProfileImageSchemaType) => {
    const formData = new FormData();

    // Add basic fields
    formData.append("image", dataValues.image);

    UpdateProfileImage(formData, {
      onSuccess: (data) => {
        form.reset();
        setUser(data.user!);
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
          <DialogTitle>Update Profile Image</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* File Attachments (Optional) */}
            <CustomFormField
              control={form.control}
              name="image"
              label="Attach Image"
              fieldType={FormFieldTypes.SKELETON}
              disabled={UpdatingProfileImage}
              formDescription="Upload your passport photo."
              renderSkeleton={() => (
                <ImageUpload
                  isDialog={false}
                  multiple={false}
                  maxFiles={1}
                  form={form}
                  fieldName="image"
                  maxSize={10} // 10MB max per file
                  allowedTypes={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                  }}
                  disabled={UpdatingProfileImage}
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
                  disabled={UpdatingProfileImage}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex !h-[45px] items-center text-sm"
                  disabled={UpdatingProfileImage}
                >
                  {UpdatingProfileImage && (
                    <Loader2 className="me-2 size-4 animate-spin" />
                  )}
                  <Plus className="mr-1 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
