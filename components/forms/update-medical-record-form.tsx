"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { useUpdateMedicalReport } from "@/lib/queries/use-auth-queries";
import { MedicalHistorySchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types";

import { CustomFormField } from "../shared/custom-form-field";
import { ImageUpload } from "../shared/image-upload";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type Props = {
  setOpenSheet: (open: boolean) => void;
  user: User;
};
export default function UpdateMedicalRecordForm(props: Props) {
  const { setUser } = useUserStore();
  const MedicalForm = useForm<z.infer<typeof MedicalHistorySchema>>({
    resolver: zodResolver(MedicalHistorySchema),
    defaultValues: {
      history: props.user.medical_history || "",
    },
  });
  const { isPending, mutate: UpdateMedicalReport } = useUpdateMedicalReport();

  console.log(MedicalForm.watch());
  const handleSubmit = (values: z.infer<typeof MedicalHistorySchema>) => {
    const formData = new FormData();
    formData.append("medical_history", values.history);
    if (values.files && values.files.length > 0) {
      values.files.forEach((file, index) => {
        formData.append(`medical_file[${index}]`, file);
      });
    }
    console.log("FORMDATA", formData);
    UpdateMedicalReport(formData, {
      onSuccess: (data) => {
        setUser(data.user);
        props.setOpenSheet(false);
        toast.success(data.message || "");
      },
    });
  };
  return (
    <Form {...MedicalForm}>
      <form
        className="space-y-4"
        onSubmit={MedicalForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <CustomFormField
            control={MedicalForm.control}
            name="history"
            fieldType={FormFieldTypes.QUILL}
            // disabled={isPending}
            placeholder="Type here"
          />
          <CustomFormField
            control={MedicalForm.control}
            name="files"
            label="Attach Files"
            fieldType={FormFieldTypes.SKELETON}
            disabled={isPending}
            formDescription="Upload all your medical reports, blood type, genotype, etc"
            renderSkeleton={() => (
              <ImageUpload
                isDialog={false}
                multiple={true}
                maxFiles={10}
                form={MedicalForm}
                fieldName="files"
                // initialFiles={uploadedFiles}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Update Medical Record{" "}
          </Button>
        </div>
      </form>
    </Form>
  );
}
