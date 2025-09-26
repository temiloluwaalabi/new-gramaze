"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, MapPin } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { TIME_SLOTS } from "@/config/constants";
import { FormFieldTypes } from "@/config/enum";
import { useOnboarding } from "@/context/onboarding-context";
import { VirtualAssessmentSchema } from "@/lib/schemas/user.schema";
import { hospital, lgas, State } from "@/types";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";
type AtHomeVisitFormProps = {
  hospitals: hospital[];
  states: State[];
  lgas: lgas[];
};
export default function AtHomeVisitForm(props: AtHomeVisitFormProps) {
  const { data, updateData, markStepComplete, currentStep } = useOnboarding();
  const BiodataForm = useForm<z.infer<typeof VirtualAssessmentSchema>>({
    resolver: zodResolver(VirtualAssessmentSchema),
    defaultValues: {
      time: data.appointment.time || "",
      email: data.appointment.email || "",
      date: data.appointment.date
        ? new Date(data.appointment.date)
        : new Date(),
      notes: data.appointment.notes || "",
      address: data.appointment.address || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof VirtualAssessmentSchema>) => {
    updateData("appointment", {
      type: data.appointment.type,
      physicalType: data.appointment.physicalType,
      date: values.date,
      email: values.email,
      time: values.time,
      notes: values.notes,
      address: values.address,
      hospitalId: values.hospital_id,
    });
    updateData("appointmentReadyForReview", true);
    markStepComplete(currentStep);
  };
  return (
    <Form {...BiodataForm}>
      <div className="flex h-[52px] items-center gap-2 rounded-[8px] bg-gray-100 px-3 py-2">
        <Info className="size-6 text-blue-600" />
        <span className="text-xs font-medium text-gray-600 md:text-sm">
          At-home visits attract an additional charge. The exact cost will be
          displayed before confirmation.{" "}
        </span>
      </div>
      <form
        className="space-y-4"
        onSubmit={BiodataForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <CustomFormField
            control={BiodataForm.control}
            name="address"
            label="Address"
            fieldType={FormFieldTypes.INPUT}
            inputType="text"
            // disabled={isPending}
            placeholder="Your address"
            formDescription="Enter your house address"
          />
          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              control={BiodataForm.control}
              name="state"
              label="Select State"
              fieldType={FormFieldTypes.SELECT}
              // disabled={isPending}
              placeholder="Your State"
              formDescription="Enter your state"
            >
              {props.states.map((hospital) => (
                <SelectItem
                  key={hospital.id.toString()}
                  value={hospital.id.toString()}
                  className="mb-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MapPin />
                    <span className="flex flex-col items-start gap-1">
                      <span>{hospital.name}</span>
                    </span>
                  </span>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={BiodataForm.control}
              name="lga"
              label="Select LGA"
              fieldType={FormFieldTypes.SELECT}
              formDescription="Enter your local government area"
              // disabled={isPending}
              disabled={
                !BiodataForm.watch("state") ||
                props.lgas.filter(
                  (lga) =>
                    lga.state_id.toString() === BiodataForm.getValues("state")
                ).length === 0
              }
              placeholder="Your LGA"
            >
              {props.lgas
                .filter(
                  (lga) =>
                    lga.state_id.toString() === BiodataForm.getValues("state")
                )
                .map((hospital) => (
                  <SelectItem
                    key={hospital.id.toString()}
                    value={hospital.id.toString()}
                    className="mb-2 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin />
                      <span className="flex flex-col items-start gap-1">
                        <span>{hospital.name}</span>
                      </span>
                    </span>
                  </SelectItem>
                ))}
            </CustomFormField>
          </div>
          <div>
            <CustomFormField
              control={BiodataForm.control}
              name="hospital_id"
              label="Select Hospital"
              fieldType={FormFieldTypes.SELECT}
              // disabled={isPending}
              disabled={
                !BiodataForm.watch("state") ||
                !BiodataForm.watch("lga") ||
                props.hospitals.filter(
                  (hospital) =>
                    hospital.state_id.toString() ===
                      BiodataForm.watch("state") &&
                    hospital.lga_id.toString() === BiodataForm.watch("lga")
                ).length === 0
              }
              placeholder="Your address"
              formDescription="Select a hospital close to your address"
            >
              {props.hospitals
                .filter(
                  (hospital) =>
                    hospital.state_id.toString() ===
                      BiodataForm.watch("state") &&
                    hospital.lga_id.toString() === BiodataForm.watch("lga")
                )
                .map((hospital) => (
                  <SelectItem
                    key={hospital.id.toString()}
                    value={hospital.id.toString()}
                    className="mb-2 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin />
                      <span className="flex flex-col items-start gap-1">
                        <span>{hospital.name}</span>
                        <span>{hospital.address}</span>
                      </span>
                    </span>
                  </SelectItem>
                ))}
            </CustomFormField>
          </div>

          <div className="flex items-center space-x-4">
            <CustomFormField
              control={BiodataForm.control}
              name="date"
              label="Date"
              fieldType={FormFieldTypes.DATE_PICKER}
            />
            <CustomFormField
              control={BiodataForm.control}
              name="time"
              label="Time"
              fieldType={FormFieldTypes.SELECT}
              placeholder="Time"
            >
              {TIME_SLOTS.map((gender) => (
                <SelectItem
                  key={gender}
                  value={gender}
                  className="mb-2 cursor-pointer"
                >
                  {gender}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <CustomFormField
            control={BiodataForm.control}
            name="email"
            label="Preferred form of contact"
            fieldType={FormFieldTypes.INPUT}
            inputType="email"
            // disabled={isPending}
            placeholder="Your email address"
          />

          <CustomFormField
            control={BiodataForm.control}
            name="notes"
            label="Additional Notes"
            fieldType={FormFieldTypes.TEXTAREA}
            // disabled={isPending}
            placeholder="the patient uses a hearing aid"
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            //   disabled={isPending}
            className="flex w-full items-center"
          >
            {/* {isPending && <Loader2 className="me-2 size-4 animate-spin" />} */}
            Confirm Appointment{" "}
          </Button>
        </div>
      </form>
    </Form>
  );
}
