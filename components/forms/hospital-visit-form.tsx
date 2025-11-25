"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { TIME_SLOTS } from "@/config/constants";
import { FormFieldTypes } from "@/config/enum";
import { useOnboarding } from "@/context/onboarding-context";
import { VirtualAssessmentSchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";
import { hospital, lgas, State } from "@/types";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

type HospitalVisitFormProps = {
  hospitals: hospital[];
  states: State[];
  lgas: lgas[];
  onSwitchToVirtual: () => void;
};

export default function HospitalVisitForm(props: HospitalVisitFormProps) {
  const { user } = useUserStore();
  const { data, updateData, currentStep, markStepComplete } = useOnboarding();
  const [showNoHospitalDialog, setShowNoHospitalDialog] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState("");
  const [noStateDialogReason, setNoStateDialogReason] = React.useState<
    "state" | "lga" | "hospital"
  >("hospital");

  const BiodataForm = useForm<z.infer<typeof VirtualAssessmentSchema>>({
    resolver: zodResolver(VirtualAssessmentSchema),
    defaultValues: {
      time: data.appointment.time || "",
      email: data.appointment.email || user?.email || "",
      date: data.appointment.date
        ? new Date(data.appointment.date)
        : new Date(),
      notes: data.appointment.notes || "",
      address: data.appointment.address || "",
      state: data.appointment.state || "",
      lga: data.appointment.lga || "",
    },
  });

  const selectedState = BiodataForm.watch("state");
  const selectedLga = BiodataForm.watch("lga");
  // Get filtered hospitals based on state and LGA
  const filteredHospitals = React.useMemo(() => {
    return props.hospitals.filter(
      (hospital) =>
        hospital.state_id.toString() === selectedState &&
        hospital.lga_id.toString() === selectedLga
    );
  }, [props.hospitals, selectedState, selectedLga]);

  // Get selected state and LGA names for the dialog
  const getSelectedAreaName = React.useCallback(() => {
    const state = props.states.find((s) => s.id.toString() === selectedState);
    const lga = props.lgas.find((l) => l.id.toString() === selectedLga);

    if (state && lga) {
      return `${lga.name}, ${state.name}`;
    }
    return "";
  }, [selectedState, selectedLga, props.states, props.lgas]);

  // Check if hospitals are available when state and LGA change
  React.useEffect(() => {
    if (selectedState && selectedLga && filteredHospitals.length === 0) {
      const areaName = getSelectedAreaName();
      setSelectedArea(areaName);
      setNoStateDialogReason("hospital");
      setShowNoHospitalDialog(true);
    }
  }, [
    selectedState,
    selectedLga,
    filteredHospitals.length,
    getSelectedAreaName,
  ]);

  const handleProceedToVirtual = () => {
    let reason = "";

    if (noStateDialogReason === "state") {
      reason = "State not yet available in our system";
    } else if (noStateDialogReason === "lga") {
      reason = selectedArea;
    } else {
      reason = selectedArea;
    }

    // Store the proposed hospital area for the virtual appointment
    updateData("appointment", {
      ...data.appointment,
      type: "virtual",
      interestedPhysicalAppointment: "yes",
      proposedHospitalArea: reason,
      state: selectedState,
      lga: selectedLga,
    });

    setShowNoHospitalDialog(false);
    props.onSwitchToVirtual();
  };

  const handleSubmit = (values: z.infer<typeof VirtualAssessmentSchema>) => {
    updateData("appointment", {
      type: data.appointment.type,
      physicalType: data.appointment.physicalType,
      date: values.date,
      email: values.email,
      time: values.time,
      notes: values.notes,
      state: values.state,
      lga: values.lga,
      address:
        props.hospitals.find(
          (hospital) => hospital.id.toString() === values.address
        )?.address || "",
      hospitalId: Number(values.address) || undefined,
      hospitalName:
        props.hospitals.find(
          (hospital) => hospital.id.toString() === values.address
        )?.name || "",
    });
    updateData("appointmentReadyForReview", true);
    markStepComplete(currentStep);
  };

  return (
    <>
      <Form {...BiodataForm}>
        <form
          className="space-y-4"
          onSubmit={BiodataForm.handleSubmit(handleSubmit)}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-2">
              <span className="text-sm text-amber-900">
                Can&apos;t find your state?
              </span>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setNoStateDialogReason("state");
                  setSelectedArea("Your state");
                  setShowNoHospitalDialog(true);
                }}
              >
                Proceed with Virtual Appointment
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                control={BiodataForm.control}
                name="state"
                label="Select State"
                fieldType={FormFieldTypes.SELECT}
                placeholder="Your State"
                disabled={props.states.length === 0}
              >
                {props.states.map((state) => (
                  <SelectItem
                    key={state.id.toString()}
                    value={state.id.toString()}
                    className="mb-2 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin />
                      <span className="flex flex-col items-start gap-1">
                        <span>{state.name}</span>
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
                disabled={
                  !selectedState ||
                  props.lgas.filter(
                    (lga) => lga.state_id.toString() === selectedState
                  ).length === 0
                }
                placeholder="Your LGA"
              >
                {props.lgas
                  .filter((lga) => lga.state_id.toString() === selectedState)
                  .map((lga) => (
                    <SelectItem
                      key={lga.id.toString()}
                      value={lga.id.toString()}
                      className="mb-2 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin />
                        <span className="flex flex-col items-start gap-1">
                          <span>{lga.name}</span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
              </CustomFormField>
            </div>
            <div>
              <CustomFormField
                control={BiodataForm.control}
                name="address"
                label="Select Hospital"
                fieldType={FormFieldTypes.SELECT}
                disabled={
                  !selectedState ||
                  !selectedLga ||
                  filteredHospitals.length === 0
                }
                placeholder="Your address"
              >
                {filteredHospitals.map((hospital) => (
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
                {TIME_SLOTS.map((slot) => (
                  <SelectItem
                    key={slot}
                    value={slot}
                    className="mb-2 cursor-pointer"
                  >
                    {slot}
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
              placeholder="Your email address"
            />

            <CustomFormField
              control={BiodataForm.control}
              name="notes"
              label="Additional Notes"
              fieldType={FormFieldTypes.TEXTAREA}
              placeholder="the patient uses a hearing aid"
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="flex w-full items-center"
              disabled={
                props.states.length === 0 ||
                !selectedState ||
                !selectedLga ||
                !BiodataForm.watch("address") ||
                !BiodataForm.watch("time")
              }
            >
              Confirm Appointment
            </Button>
          </div>
        </form>
      </Form>

      {/* No Hospital Available Dialog */}
      <Dialog
        open={showNoHospitalDialog}
        onOpenChange={setShowNoHospitalDialog}
      >
        <DialogContent className="!max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {noStateDialogReason === "state"
                ? "State Not Available"
                : "No Hospital Available"}
            </DialogTitle>
            <DialogDescription>
              {noStateDialogReason === "state" ? (
                <>
                  We currently don&apos;t have any registered states in our
                  system. However, you can proceed with a virtual appointment,
                  and we&apos;ll notify you once we establish physical locations
                  in your area.
                </>
              ) : (
                <>
                  We currently don&apos;t have a partner hospital in{" "}
                  {selectedArea}. However, you can proceed with a virtual
                  appointment, and we&apos;ll notify you once we establish a
                  physical location in your area.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setShowNoHospitalDialog(false)}
              disabled={noStateDialogReason === "state"}
            >
              {noStateDialogReason === "state"
                ? "Cancel"
                : "Choose Different Location"}
            </Button>
            <Button onClick={handleProceedToVirtual}>
              Proceed with Virtual Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
