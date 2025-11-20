"use client";
import { format } from "date-fns";
import { Clock, Loader2, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import AtHomeVisitForm from "@/components/forms/at-home-viisit-form";
import HospitalVisitForm from "@/components/forms/hospital-visit-form";
import VirtualAssessmentForm from "@/components/forms/virtual-assessment-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useOnboarding } from "@/context/onboarding-context";
import useSafeToast from "@/hooks/useSafeToast";
import {
  useGetAllHospitals,
  useGetAllLGAs,
  useGetAllStates,
} from "@/lib/queries/use-appointment-query";
import {
  usePhysicalHospitalAppointment,
  usePhysicalVirtualAppointment,
  useVirtualAppointment,
} from "@/lib/queries/use-auth-queries";
import { cn } from "@/lib/utils";
import { OnboardingStepsI } from "@/types";

import { StepFooter } from "./step-footer";
import { StepHeader } from "./step-header";
export const AppointmentStep: React.FC<OnboardingStepsI> = () => {
  const router = useRouter();
  const [internalStep, setinternalStep] = React.useState<1 | 2>(1);
  const { data, updateData, goToPrevStep } = useOnboarding();
  const [assessmentType, setAssessmentType] =
    React.useState<string>("physical");
  const [physicalVisitType, setPhysicalVisitType] =
    React.useState("at-home-visit");
  const appointment = data.appointment.type;
  const parsedDate = data.appointment.date
    ? new Date(data.appointment.date)
    : new Date();
  const { safeSuccess } = useSafeToast();

  const { isPending: VirtualPending, mutate: BookVirtualAppointment } =
    useVirtualAppointment();
  const { isPending: HomePhysicalPending, mutate: HomePhysicalAppointment } =
    usePhysicalVirtualAppointment();
  const {
    isPending: HospitalPhysicalPending,
    mutate: HospitalPhysicalAppointment,
  } = usePhysicalHospitalAppointment();

  const { data: AllHospitals } = useGetAllHospitals();
  const { data: AllStates } = useGetAllStates();
  const { data: AllLGAs } = useGetAllLGAs();

  const appointmentLoading =
    VirtualPending || HomePhysicalPending || HospitalPhysicalPending;

  const handleSelectAssessmentType = (value: string) => {
    updateData("appointment", {
      ...data.appointment,
      type: value as "physical" | "virtual",
    });
    setinternalStep(2);
    setAssessmentType(value);
  };
  const handleSwitchToVirtual = () => {
    // Switch to virtual appointment view
    setAssessmentType("virtual");
  };

  const handleBack = () => {
    if (data.appointmentReadyForReview) {
      updateData("appointmentReadyForReview", false);

      // Restore step 2 state
      setinternalStep(2);
      setAssessmentType(data.appointment.type);

      if (data.appointment.physicalType) {
        setPhysicalVisitType(data.appointment.physicalType);
      }

      return;
    }

    if (internalStep === 2) {
      setinternalStep(1);
    } else {
      goToPrevStep();
    }
  };

  React.useEffect(() => {
    if (physicalVisitType) {
      updateData("appointment", {
        ...data.appointment,
        physicalType: physicalVisitType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [physicalVisitType]);

  const handleBookAppointment = async () => {
    const {
      hospitalName,
      time,
      email,
      physicalType,
      address,
      notes,
      hospitalId,
      interestedPhysicalAppointment,
      proposedHospitalArea,
    } = data.appointment;

    if (data.appointment.type === "virtual") {
      console.log("VIRTUAL APPOINTMRNT");
      const JSONVALUES = {
        appointment_type: "virtual",
        date: format(parsedDate, "yyyy-MM-dd"),
        time,
        location: "Online via Zoom",
        meeting_link: "https://zoom.us/j/1234567890",
        additional_address: "N/A",
        interested_physical_appointment: interestedPhysicalAppointment,
        proposed_hospital_area: proposedHospitalArea,
      };

      BookVirtualAppointment(JSONVALUES, {
        onSuccess: (data) => {
          window.location.href = `/booked?id=${data.appointment.id}`;
          updateData("appointmentReadyForReview", false);
          safeSuccess("book-virtual-appointment", data.message);
        },
      });
    } else {
      if (physicalType === "at-home-visit") {
        console.log("AT GOME VISIT PHYSICAL APPPOINTMENT");
        const JSONVALUES = {
          appointment_type: "physical",
          date: format(parsedDate, "yyyy-MM-dd"),
          time,
          visit_type: "home",
          home_address: address || "",
          contact: email,
          additional_note: notes || "",
          hospital_id: hospitalId,
        };
        HomePhysicalAppointment(JSONVALUES, {
          onSuccess: (data) => {
            updateData("appointmentReadyForReview", false);
            safeSuccess(
              "physical-home-appointment",
              data.message ||
                "Physical home appointment scheduled successfully!"
            );
            router.push(`/booked?id=${data.appointment.id}`);
          },
        });
      } else {
        console.log("HOSPITAL VISIT PHYSICAL APPPOINTMENT");
        const JSONVALUES = {
          appointment_type: "physical",
          visit_type: "hospital",
          date: format(parsedDate, "yyyy-MM-dd"),
          time,
          hospital_name: hospitalName || "",
          hospital_address: address || "",
          contact: email,
          additional_note: notes || "",
          hospital_id: hospitalId,
        };
        HospitalPhysicalAppointment(JSONVALUES, {
          onSuccess: (data) => {
            updateData("appointmentReadyForReview", false);
            safeSuccess(
              "physical-hospital-appointment",
              data.message ||
                "Physical home appointment scheduled successfully!"
            );
            router.push(`/booked?id=${data.appointment.id}`);
          },
        });
      }
    }
  };
  return (
    <div className="w-full max-w-2xl">
      {!data.appointmentReadyForReview ? (
        internalStep === 1 ? (
          <>
            <StepHeader
              title="Schedule an appointment"
              description="Select the type of assessment that works best for you"
            />
            <div className="space-y-4">
              <div
                className={cn(
                  "flex h-[98px] cursor-pointer items-center gap-2 rounded-[6px] border border-gray-300 bg-white p-5 transition-all hover:border-blue-700 hover:bg-blue-50",
                  appointment === "virtual" && "border-blue-700 bg-blue-50"
                )}
                onClick={() => handleSelectAssessmentType("virtual")}
              >
                <Image
                  src="/asset/images/virtual.png"
                  width={58}
                  height={58}
                  className="size-[58px] rounded-full border border-gray-300 object-cover"
                  alt="myself"
                />
                <div className="space-y-2">
                  <h4 className="text-[18px] font-semibold text-gray-700">
                    Virtual Assessment
                  </h4>
                  <p className="text-xs font-medium text-gray-500 md:text-sm lg:text-base">
                    Connect with our care team online from the comfort of your
                    home
                  </p>
                </div>
              </div>
              {/* <div
                className={cn(
                  "relative flex h-[98px] cursor-pointer items-center gap-2 rounded-[6px] border border-gray-300 bg-white p-5 transition-all hover:border-blue-700 hover:bg-blue-50",
                  appointment === "physical" && "border-blue-700 bg-blue-50"
                )}
                role="button"
                onClick={() => handleSelectAssessmentType("physical")}
              >
                <Image
                  src="/asset/images/physical.png"
                  width={58}
                  height={58}
                  className="size-[58px] rounded-full border border-gray-300 object-cover"
                  alt="myself"
                />
                <div className="space-y-2">
                  <h4 className="text-[18px] font-semibold text-gray-700">
                    Physical Assessment
                  </h4>
                  <p className="text-xs font-medium text-gray-500 md:text-sm lg:text-base">
                    Connect with our team in person at your convenience{" "}
                  </p>
                </div>
              </div> */}
            </div>
          </>
        ) : (
          <>
            {assessmentType === "physical" ? (
              <div className="space-y-5">
                <StepHeader
                  title="Schedule an appointment"
                  description="We need to conduct a health assessment to provide you with the best care"
                />
                <div className="flex items-center space-x-[62px]">
                  <RadioGroup
                    defaultValue={physicalVisitType}
                    onValueChange={(value) => {
                      updateData("appointment", {
                        ...data.appointment,
                        physicalType: value,
                      });
                      setPhysicalVisitType(value);
                    }}
                    className="flex items-center"
                  >
                    <div className="flex cursor-pointer items-center space-x-2">
                      <RadioGroupItem
                        value="at-home-visit"
                        id="at-home-visit"
                      />
                      <Label htmlFor="at-home-visit">At-Home Visit</Label>
                    </div>
                    <div className="flex cursor-pointer items-center space-x-2">
                      <RadioGroupItem
                        value="hospital-visit"
                        id="hospital-visit"
                      />
                      <Label htmlFor="hospital-visit">Hospital Visit</Label>
                    </div>
                  </RadioGroup>
                </div>
                {physicalVisitType === "at-home-visit" ? (
                  <AtHomeVisitForm />
                ) : (
                  <HospitalVisitForm
                    hospitals={AllHospitals?.hospitals || []}
                    states={AllStates?.states || []}
                    lgas={AllLGAs?.states || []}
                    onSwitchToVirtual={handleSwitchToVirtual}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <StepHeader
                  title="Schedule a Virtual Assessment"
                  description="Connect with our care team online from the comfort of your home"
                />
                <div className="flex items-center space-x-[62px]">
                  <div className="flex items-center space-x-2">
                    <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                      <Clock className="size-4 text-blue-600" />
                    </span>
                    <span className="text-base font-medium text-gray-600">
                      45 mins
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="flex size-[32px] items-center justify-center rounded-full bg-gray-100">
                      <Video className="size-4 text-blue-600" />
                    </span>
                    <span className="text-base font-medium text-gray-600">
                      Virtual assessment
                    </span>
                  </div>
                </div>
                <VirtualAssessmentForm />
              </div>
            )}
          </>
        )
      ) : (
        <div className="space-y-5">
          <StepHeader
            title="Review appointment details"
            description="Please review your appointment information . By clicking “Confirm appointment”, 
                  you agree to the terms and conditions of our service  "
          />
          <div className="relative">
            <span className="flex items-center justify-between border-b border-gray-300 py-3">
              <span>Appointment Type</span>
              <span className="text-xs md:text-sm">
                {data.appointment.type}
              </span>
            </span>
            <span className="flex items-center justify-between border-b border-gray-300 py-3">
              <span>Date & Time</span>

              <span className="text-xs md:text-sm">
                {format(parsedDate, "PPP")},{data.appointment.time}
              </span>
            </span>

            <span className="flex items-center justify-between border-b border-gray-300 py-3">
              <span>Current Information</span>

              <span className="text-xs md:text-sm">
                {data.appointment.email}
              </span>
            </span>
            <span className="flex items-center justify-between border-b border-gray-300 py-3">
              <span>Location</span>

              <span className="text-xs md:text-sm">
                The meeting link will be sent to your email
              </span>
            </span>
            <span className="flex items-center justify-between border-gray-300 py-3">
              <span>Additional Notes</span>

              <span className="text-xs md:text-sm">
                {data.appointment.notes || "N/A"}
              </span>
            </span>
            <Button
              className="relative mt-4 ml-auto flex items-center text-sm"
              disabled={appointmentLoading}
              onClick={handleBookAppointment}
            >
              {appointmentLoading && (
                <Loader2 className="me-2 size-4 animate-spin" />
              )}
              {/* <Link href="/booked" className="absolute top-0 left-0 size-full z-50" /> */}
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}

      <StepFooter
        disabled={appointmentLoading}
        showSkip={internalStep === 1}
        onBack={handleBack}
      />
    </div>
  );
};
