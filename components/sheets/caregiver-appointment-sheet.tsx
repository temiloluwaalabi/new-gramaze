// @flow
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Camera,
  CheckCheck,
  Clock,
  Loader2,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";

import { getUserDetails } from "@/app/actions/services/users.actions";
import { FormFieldTypes } from "@/config/enum";
import { useMarkAppointmentAsArrived } from "@/lib/queries/use-appointment-query";
import {
  MarkAppointmentAsArrivedSchema,
  MarkAppointmentAsArrivedSchemaType,
} from "@/lib/schemas/user.schema";
import {
  formatDate,
  getAppointmentLocation,
  getAppointmentTitle,
} from "@/lib/utils";
import { Appointment, User } from "@/types";

import { AvatarNameEmail } from "../shared/avatar-name-email";
import { CustomFormField } from "../shared/custom-form-field";
import { ImageUpload } from "../shared/image-upload";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {
  sheetTrigger: React.ReactNode;
  appointment: Appointment;
};
export const CaregiverAppointmentSheet = (props: Props) => {
  const [opemSheet, setOpemSheet] = React.useState(false);
  const [showArrivalWidget, setshowArrivalWidget] = React.useState(false);
  const [confirmationMethod, setConfirmationMethod] = React.useState("photo");
  const [appointmentPatient, setAppointmentPatient] = React.useState<User>();

  const pathname = usePathname();
  const { isPending, mutateAsync: MarkAppointmentAsArrived } =
    useMarkAppointmentAsArrived(pathname);

  const getPatientDetails = React.useCallback(async () => {
    if (!props.appointment.user_id) return;
    // Fetch user details based on the patient ID from the appointment
    const user = await getUserDetails(Number(props.appointment.user_id));
    if (user.success) {
      setAppointmentPatient(user.user);
    }
  }, [props.appointment.user_id]);

  React.useEffect(() => {
    getPatientDetails();
  }, [getPatientDetails]);

  const AppointmentFOrm = useForm<MarkAppointmentAsArrivedSchemaType>({
    resolver: zodResolver(MarkAppointmentAsArrivedSchema),
    defaultValues: {
      additional_note_caregiver: "",
    },
  });

  console.log("FORM", AppointmentFOrm.watch());
  const handleConfirmArrival = async (
    values: MarkAppointmentAsArrivedSchemaType
  ) => {
    try {
      const formData = new FormData();
      formData.append("id", props.appointment.id.toString());
      formData.append(
        "additional_note_caregiver",
        values.additional_note_caregiver
      );
      if (values.arrival_photo) {
        formData.append("arrival_photo", values.arrival_photo);
      }

      if (values.arrival_current_address) {
        formData.append(
          "arrival_current_address",
          values.arrival_current_address
        );
      }
      await MarkAppointmentAsArrived(formData, {
        onSuccess: () => {
          setOpemSheet(false);
        },
      });
      setshowArrivalWidget(false);
    } catch (error) {
      console.error("Error confirming arrival:", error);
    }
  };
  return (
    <Sheet open={opemSheet} onOpenChange={setOpemSheet}>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        <Form {...AppointmentFOrm}>
          <form onSubmit={AppointmentFOrm.handleSubmit(handleConfirmArrival)}>
            <div>
              {showArrivalWidget ? (
                <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
                  <SheetHeader className="mb-4 p-0">
                    <SheetTitle className="text-2xl font-semibold text-[#000]">
                      Confirm your arrival
                    </SheetTitle>
                    <SheetDescription className="text-sm font-normal text-[#66666B]">
                      {" "}
                      Capture a quick photo and allow location access to confirm
                      you&apos;re on-site.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-2">
                    <RadioGroup
                      value={confirmationMethod}
                      onValueChange={setConfirmationMethod}
                      className="space-y-1"
                    >
                      <div className="flex h-[68px] cursor-pointer items-center space-x-2 rounded-[6px] border border-[#E8E8E8] p-3 py-[8px] pr-[16px] pl-[8px] hover:bg-gray-50">
                        <Label
                          htmlFor="photo"
                          className="flex w-full cursor-pointer items-center gap-3"
                        >
                          <div className="flex size-[52px] items-center justify-center rounded-[6px] bg-[#FAFAFA] p-[14px]">
                            <Camera className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium">
                            Take Photo
                          </span>
                        </Label>
                        <RadioGroupItem
                          value="photo"
                          id="photo"
                          className="ml-1"
                        />
                      </div>
                      <div className="flex h-[68px] cursor-pointer items-center space-x-2 rounded-[6px] border border-[#E8E8E8] p-3 py-[8px] pr-[16px] pl-[8px] hover:bg-gray-50">
                        <Label
                          htmlFor="location"
                          className="flex w-full cursor-pointer items-center gap-3"
                        >
                          <div className="flex size-[52px] items-center justify-center rounded-[6px] bg-[#FAFAFA] p-[14px]">
                            <MapPin className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium">
                            Use current location
                          </span>
                        </Label>
                        <RadioGroupItem
                          value="location"
                          id="location"
                          className="ml-1"
                        />
                      </div>
                    </RadioGroup>

                    {confirmationMethod === "location" ? (
                      <div>
                        <CustomFormField
                          control={AppointmentFOrm.control}
                          name="arrival_current_address"
                          fieldType={FormFieldTypes.INPUT}
                          disabled={isPending}
                          inputType="text"
                          placeholder="Enter current address"
                        />
                      </div>
                    ) : (
                      <div>
                        <CustomFormField
                          control={AppointmentFOrm.control}
                          name="arrival_photo"
                          label="Attach Photo"
                          fieldType={FormFieldTypes.SKELETON}
                          disabled={isPending}
                          formDescription="Upload 1 arrival picture"
                          renderSkeleton={() => (
                            <ImageUpload
                              isDialog={false}
                              multiple={false}
                              maxFiles={1}
                              form={AppointmentFOrm}
                              fieldName="arrival_photo"
                              // initialFiles={uploadedFiles}
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                  <div className="ml-auto !flex !flex-row items-center gap-4 p-0">
                    <Button
                      className="!h-[49px] text-sm"
                      type="submit"
                      disabled={!confirmationMethod || isPending}
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCheck />
                      )}
                      {isPending ? "Confirming..." : "Confirm Arrival"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
                  <SheetHeader className="mb-4 p-0">
                    <SheetTitle className="text-base font-medium text-[#333333]">
                      Appointment Details
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mb-6 gap-4 space-y-6">
                    <div className="space-y-3">
                      <h6 className="text-2xl font-semibold text-black">
                        {getAppointmentTitle(props.appointment)}
                      </h6>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-[130px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                            <span className="text-xs font-normal text-[#303030] sm:text-sm">
                              {formatDate(props.appointment.date)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                            <span className="text-xs font-normal text-[#66666B] sm:text-sm">
                              {props.appointment.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-[130px]">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                            <div className="flex flex-col">
                              <span className="line-clamp-2 text-xs font-normal text-[#66666B] sm:line-clamp-none sm:text-sm">
                                {getAppointmentLocation(props.appointment)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="">
                          {/* Map would go here - using a placeholder */}
                          <Image
                            src="/asset/images/map.png"
                            alt="Hospital Location Map"
                            width={313}
                            height={162}
                            className="h-[162px] w-full rounded-md object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h6 className="text-base font-medium text-[#333333]">
                        Patient details
                      </h6>
                      <AvatarNameEmail
                        name={`${appointmentPatient?.first_name || ""} ${appointmentPatient?.last_name || ""}`.trim()}
                        email={
                          appointmentPatient?.email ||
                          props.appointment.contact ||
                          ""
                        }
                        avatarImage="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png"
                      />
                      <div className="flex items-center gap-[130px]">
                        <span className="flex w-full flex-col gap-[4px]">
                          <span className="text-xs font-normal text-[#66666B]">
                            Date of Birth
                          </span>
                          <span className="text-xs font-semibold text-black">
                            {appointmentPatient?.dob
                              ? formatDate(appointmentPatient?.dob)
                              : "Not provided"}
                          </span>
                        </span>
                        <span className="flex w-full flex-col gap-[4px]">
                          <span className="text-xs font-normal text-[#66666B]">
                            Address
                          </span>
                          <span className="text-xs font-semibold text-black">
                            {props.appointment.home_address ||
                              appointmentPatient?.address ||
                              "Not provided"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-[130px]">
                        <span className="flex w-full flex-col gap-[4px]">
                          <span className="text-xs font-normal text-[#66666B]">
                            Phone Number
                          </span>
                          <span className="text-xs font-semibold text-black">
                            {appointmentPatient?.phone || "Not provided"}
                          </span>
                        </span>
                        <span className="flex w-full flex-col gap-[4px]">
                          <span className="text-xs font-normal text-[#66666B]">
                            Emergency Contact
                          </span>
                          <span className="text-xs font-semibold text-black">
                            {appointmentPatient?.emergency_contact_phone ||
                              "Not provided"}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="mb-2 text-sm font-medium">
                        Additional notes
                      </span>
                      <CustomFormField
                        control={AppointmentFOrm.control}
                        name="additional_note_caregiver"
                        fieldType={FormFieldTypes.TEXTAREA}
                        disabled={isPending}
                        rows={6}
                        className="mt-3 h-[120px]"
                        placeholder={
                          props.appointment.additional_note ||
                          "Add any additional notes about this appointment..."
                        }
                      />
                    </div>
                  </div>
                  <div className="my-6 mt-4 !flex !flex-row items-center gap-4 p-0">
                    <Button
                      disabled={isPending}
                      type="button"
                      className="!h-[49px] !w-fit border border-gray-300 bg-transparent text-sm text-black"
                    >
                      <Mail />
                      Message patient
                    </Button>
                    <Button
                      className="flex !h-[49px] items-center gap-2 text-sm"
                      onClick={() => setshowArrivalWidget(true)}
                      type="button"
                      disabled={
                        isPending ||
                        AppointmentFOrm.watch("additional_note_caregiver") ===
                          ""
                      }
                      // disabled={props.appointment.status === "arrived"}
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCheck />
                      )}
                      {props.appointment.status === "arrived"
                        ? "Already Arrived"
                        : "Mark as arrived"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
