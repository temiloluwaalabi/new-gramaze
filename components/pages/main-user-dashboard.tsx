"use client";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  List,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { InitiatePayment, VerifyPayment } from "@/app/actions/payment.actions";
import { allRoutes } from "@/config/routes";
import { getGreeting } from "@/hooks/use-greeting";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  cn,
  createAppointmentEndTime,
  determineAppointmentStatus,
  formatDate,
  initialsFromName,
} from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { Appointment } from "@/types";

import { HealthVitalsChart } from "../charts/health-vitals-chart";
import { VerificationGuard } from "../guards/verification-guard";
import { Message } from "../shared/message-widget";
import MobileQuickActions from "../shared/MobileQuickActions";
import { DbAppointmentSheet } from "../sheets/db-appointment-sheet";
import { AppointmentStatus } from "../table/columns/appointment-columns";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Calendar, CalendarDayButton } from "../ui/calendar";
import { Separator } from "../ui/separator";

export type MessagePreview = {
  id: string;
  avatar: string;
  name: string;
  message: string;
  timestamp: string;
  unreadCount?: number;
};
type Metric = {
  name: string;
  value: string;
};

// type Tracker = {
//   id: number;
//   user_id: string;
//   caregiver_id: string;
//   status: string;
//   reason: string | null;
//   created_at: string;
//   updated_at: string;
//   metrics: Metric[];
//   // Legacy fields for backward compatibility
//   blood_glucose?: string;
//   blood_pressure?: string;
//   weight?: string;
//   pulse?: string;
// };

// type Vital = {
//   value: string;
//   updated_at: string;
//   id: number;
//   name: string; // Add name since API returns metric name
//   status: string;
// };

// type LatestVitals = {
//   [metricCode: string]: Vital | null;
// };

type MainUserDashboardProps = {
  payment_notification: {
    id: number;
    pay_reference: string;
    user_id: number;
    plan_code: string;
    amount: string;
    status: string;
    message: string;
    created_at: string;
    updated_at: string;
  }[];
  appointments?: Appointment[];
  healthTrackers: {
    id: number;
    user_id: string;
    caregiver_id: string;
    status: string;
    reason: string | null;
    created_at: string;
    updated_at: string;
    metrics: {
      name: string;
      value: string;
    }[];
    blood_glucose: string;
    blood_pressure: string;
    weight: string;
    pulse: string;
  }[];
  caregivers: {
    id: number;
    user_id: string;
    caregiver_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    caregiver: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }[];
  messages: MessagePreview[];
};

export const MainUserDashboard = ({
  appointments,
  healthTrackers,
  messages,
  payment_notification,
  caregivers,
}: MainUserDashboardProps) => {
  const { user } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();

  // Helper function to extract metric value by name
  const getMetricValue = (
    metrics: Metric[],
    metricName: string
  ): string | null => {
    const metric = metrics.find(
      (m) => m.name?.toLowerCase() === metricName.toLowerCase()
    );
    return metric?.value || null;
  };

  const data = (() => {
    if (!healthTrackers?.length) return [];

    // Sort by created_at ascending so carry-forward works correctly
    const sorted = [...healthTrackers].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let lastWeight = 0;
    let lastSystolic = 0;
    let lastDiastolic = 0;

    return sorted.map((tracker) => {
      // Weight carry-forward - try metrics first, then legacy field
      const weightValue =
        getMetricValue(tracker.metrics, "Weight") || tracker.weight;
      if (weightValue) {
        lastWeight = Number(weightValue.replace(/[^\d.]/g, "")) || lastWeight;
      }

      // Blood pressure carry-forward - try metrics first, then legacy field
      const bpValue =
        getMetricValue(tracker.metrics, "Blood Pressure") ||
        tracker.blood_pressure;
      if (bpValue) {
        const cleanedBP = bpValue.replace(/[^\d/]/g, "");
        const [systolicStr, diastolicStr] = cleanedBP.split("/");
        if (systolicStr) lastSystolic = Number(systolicStr) || lastSystolic;
        if (diastolicStr) lastDiastolic = Number(diastolicStr) || lastDiastolic;
      }

      return {
        name: new Date(tracker.created_at).toLocaleDateString(),
        bodyWeight: lastWeight,
        bloodPressure: {
          systolic: lastSystolic,
          diastolic: lastDiastolic,
        },
      };
    });
  })();
  const [appointmentView, setAppointmentView] = React.useState("list");
  const [startBuying, setStartBuying] = React.useState(false);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      setAppointmentView("list");
    }
  }, [isMobile]);
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "failed":
        return "bg-red-50 border-red-200";
      case "success":
      case "completed":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };
  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(parseFloat(amount));
  };
  const veirfyPayment = React.useCallback(async () => {
    const url = new URL(window.location.href);
    const reference = url.searchParams.get("reference");

    if (reference) {
      console.log("Reference:", reference);
      await VerifyPayment(pathname, reference).then((data) => {
        console.log("DATA", data);
        if (data?.success === false) {
          toast.error(data.message);
          window.location.href = allRoutes.user.dashboard.home.url;
        }
        if (data?.success) {
          toast(data.message);
          window.location.href = allRoutes.user.dashboard.home.url;
        }

        // Remove the query parameters after success or error
      });
    }
  }, [pathname]);
  React.useEffect(() => {
    veirfyPayment();
  }, [veirfyPayment]);

  return (
    <section className="!h-full space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <section>
        <h2 className="text-2xl font-medium text-[#131B0B]">
          {getGreeting(user?.first_name || "Patient")}
        </h2>
        <p className="text-xs font-semibold text-[#7f7f7f]">
          {formatDate(new Date())}
        </p>
      </section>
      <div className="space-y-3">
        {payment_notification.length > 0 &&
          payment_notification
            .filter((not) => not.status === "pending")
            .map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border-2 p-4 ${getStatusColor(notification.status)} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
                  <div className="flex flex-1 items-start gap-3">
                    {getStatusIcon(notification.status)}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-medium text-gray-900">
                          Plan: {notification.plan_code}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            notification.status.toLowerCase() === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : notification.status.toLowerCase() === "failed"
                                ? "bg-red-100 text-red-800"
                                : notification.status.toLowerCase() ===
                                      "success" ||
                                    notification.status.toLowerCase() ===
                                      "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {notification.status}
                        </span>
                      </div>

                      <p className="mb-2 text-sm text-gray-600">
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Amount: {formatAmount(notification.amount)}</span>
                        <span>Ref: {notification.pay_reference}</span>
                        <span>
                          Created: {formatDate(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(notification.status.toLowerCase() === "pending" ||
                      notification.status.toLowerCase() === "failed") && (
                      <Button
                        disabled={startBuying}
                        onClick={async () => {
                          try {
                            setStartBuying(true);
                            await InitiatePayment(
                              {
                                payment_notification_id: notification.id,
                                callback_url:
                                  `${process.env.NEXT_PUBLIC_CLIENT_URL}/dashboard` ||
                                  "",
                              },
                              pathname
                            ).then((data) => {
                              if (data?.success === false) {
                                toast.error(data.message);
                              }
                              if (data?.success === true) {
                                toast.success(data.message);
                                // goToStep("bio-data");
                                //  setOpenSheet(false);

                                router.push(data?.authorization_url || "");
                              }
                            });
                          } catch (error) {
                            toast.error("An error occured");
                            console.error(error);
                          } finally {
                            setStartBuying(false);
                          }
                        }}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm leading-4 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                      >
                        {startBuying ? (
                          <Loader2 className="mr-1 size-4 animate-spin" />
                        ) : (
                          <CreditCard className="mr-1 h-4 w-4" />
                        )}

                        {startBuying ? "Paying..." : "Pay Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <MobileQuickActions />
      <section className="grid grid-cols-12 gap-5">
        <aside className="col-span-12 h-fit rounded-[6px] bg-white p-5 lg:col-span-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#787878]">
              Basic Information
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex size-[90px] items-center justify-center rounded-[8px] bg-blue-100 text-sm font-medium text-blue-600">
                {initialsFromName(
                  [user?.first_name, user?.last_name]
                    .filter(Boolean)
                    .join(" ")
                    .trim()
                )}
              </div>
              {/* <Image
                src="https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg"
                width={90}
                height={90}
                className="size-[90px] rounded-[8px] object-cover"
                alt="mainImage"
              /> */}
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-[#303030]">
                  {user?.first_name} {user?.last_name}
                </h4>
                <p className="text-sm font-normal text-[#66666B]">
                  {user?.email}
                </p>
                <VerificationGuard
                  route={allRoutes.user.dashboard.settings.url}
                  fallback={
                    <Button
                      disabled
                      className="!h-fit !py-2 text-xs"
                      size={"sm"}
                    >
                      Verify Account
                    </Button>
                  }
                >
                  <Button
                    onClick={() =>
                      router.push(allRoutes.user.dashboard.settings.url)
                    }
                    className="!h-[24px] rounded-[4px] px-[7px] !py-[4px] text-sm font-medium text-white"
                  >
                    Manage profile
                  </Button>
                </VerificationGuard>
              </div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="hidden space-y-3 md:block">
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Date of Birth
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {formatDate(user?.dob ?? "")}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Phone Number
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.phone}
              </span>
            </span>
            <span className="flex flex-col gap-[4px]">
              <span className="text-xs font-normal text-[#66666B]">
                Address
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {user?.address || null}
              </span>
            </span>
            {user?.emergency_contact_phone && (
              <span className="flex flex-col gap-[4px]">
                <span className="text-xs font-normal text-[#66666B]">
                  Emergency Contact
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {user?.emergency_contact_phone || null}
                </span>
              </span>
            )}
          </div>
          <div className="mt-3 hidden flex-col md:flex">
            <span className="text-xs font-normal text-[#66666B]">
              Current Caregivers
            </span>
            {caregivers && caregivers.length > 0 ? (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {caregivers.slice(0, 3).map((caregiver, idx) => (
                    <Avatar
                      key={caregiver.id}
                      className={cn(
                        "!size-10 border-2 border-white",
                        idx > 0 && "-ml-4"
                      )}
                    >
                      <AvatarFallback className="bg-blue-200 text-xs text-blue-600">
                        {initialsFromName(
                          [
                            caregivers[0]?.caregiver.first_name,
                            caregivers[0]?.caregiver.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ")
                            .trim()
                        )}
                      </AvatarFallback>
                      {/* <AvatarImage src={DEFAULT_IMAGE_URL} /> */}
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm font-normal text-[#66666B]">
                  {caregivers[0]?.caregiver.first_name}{" "}
                  {caregivers[0]?.caregiver.last_name}
                  {caregivers.length > 1 && (
                    <span className="text-blue-600">
                      {` + ${caregivers.length - 1} other${caregivers.length - 1 > 1 ? "s" : ""}`}
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <span className="text-sm font-normal text-[#b0b0b0]">
                No caregivers assigned
              </span>
            )}
          </div>

          <div className="mt-3 hidden space-y-3 md:block">
            <span className="text-xs font-normal text-[#66666B]">
              Next Caregiver Visit
            </span>
            <div className="space-y-[18px]">
              {appointments &&
              appointments.filter(
                (appointment) => new Date(appointment.date) > new Date()
              ).length > 0 ? (
                appointments
                  .filter(
                    (appointment) => new Date(appointment.date) > new Date()
                  )
                  .slice(0, 3)
                  .map((appointment) => {
                    const status = determineAppointmentStatus(appointment);
                    return (
                      <DbAppointmentSheet
                        key={appointment.id}
                        appointment={appointment}
                        sheetTrigger={
                          <div
                            key={appointment.id}
                            className="flex cursor-pointer flex-col gap-1"
                          >
                            <span className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "size-[6px]",
                                  status === ("confirmed" as AppointmentStatus)
                                    ? "bg-green-500"
                                    : status ===
                                        ("pending" as AppointmentStatus)
                                      ? "bg-yellow-500"
                                      : status ===
                                          ("cancelled" as AppointmentStatus)
                                        ? "bg-red-500"
                                        : "bg-blue-500"
                                )}
                              />
                              <span className="text-sm font-semibold text-[#303030]">
                                {formatDate(new Date(appointment.date))}
                              </span>
                            </span>
                            <div className="mt-2 ml-4 flex h-fit items-center gap-2 rounded-[10px] border border-[#E8E8E8] bg-white p-[10px] md:h-[54px]">
                              <div className="h-[40px] w-[2px] bg-red-600 md:h-full" />
                              <div className="gap-1 text-[12px] text-[#66666B]">
                                <h4 className="text-left font-medium">
                                  <span className="capitalize">
                                    {appointment.appointment_type}{" "}
                                    {appointment.visit_type} Appointment
                                  </span>{" "}
                                  @ {appointment.time}
                                  {appointment.appointment_type === "virtual" &&
                                  createAppointmentEndTime(
                                    appointment.date,
                                    appointment.time
                                  )
                                    ? ` -  ${formatDate(appointment.date)}`
                                    : null}
                                </h4>

                                <p className="text-left font-normal">
                                  {appointment.appointment_type ===
                                  "physical" ? (
                                    appointment.visit_type === "home" ? (
                                      <span>
                                        House Address: {appointment.location}
                                        <br />
                                        Hospital Address:{" "}
                                        {appointment.hospital_info?.address}
                                        <br />
                                        Hospital Name:{" "}
                                        {appointment.hospital_info?.name}
                                      </span>
                                    ) : (
                                      <span>
                                        Hospital Address:{" "}
                                        {appointment.hospital_info?.address}
                                        <br />
                                        Hospital Name:{" "}
                                        {appointment.hospital_info?.name}
                                      </span>
                                    )
                                  ) : (
                                    <span>
                                      House Address: {appointment.location}
                                      <br />
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    );
                  })
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <CalendarIcon className="mb-3 text-[#b0b0b0]" size={48} />
                  <span className="text-base font-medium text-[#71717a]">
                    No appointments found
                  </span>
                  <span className="mt-1 text-sm text-[#b0b0b0]">
                    You have no upcoming appointments at the moment.
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
        <div className="col-span-12 space-y-5 lg:col-span-8">
          <HealthVitalsChart data={data} />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="w-full space-y-6 rounded-[6px] border border-[#E8E8E8] bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#71717a]">
                  Upcoming Appointment
                </span>
                <div className="flex cursor-pointer items-center gap-[8px] rounded-[6px] bg-[#ededed] p-[4px]">
                  <span
                    onClick={() => setAppointmentView("calendar")}
                    className={cn(
                      "hidden size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white md:flex",
                      appointmentView === "calendar" && "bg-white"
                    )}
                  >
                    <CalendarIcon className="size-4" />
                  </span>
                  <span
                    onClick={() => setAppointmentView("list")}
                    className={cn(
                      "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                      appointmentView === "list" && "bg-white"
                    )}
                  >
                    {" "}
                    <List className="size-4" />
                  </span>
                </div>
              </div>
              {appointmentView === "calendar" ? (
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  className="hidden w-fit cursor-pointer !p-0 md:block md:w-full"
                  classNames={{
                    // nav: "hidden",
                    head_cell: "w-8 text-sm text-blue-600 font-medium",
                    // caption: "hidden",
                    //   table: 'w-full',
                    //   months: 'w-full',
                    //   month: 'w-full',
                    //   row: 'flex w-full justify-between',
                  }}
                  components={{
                    DayButton: ({ children, modifiers, day, ...props }) => {
                      const dayAppointments =
                        appointments?.filter(
                          (appointment) =>
                            new Date(appointment.date).toDateString() ===
                            day.date.toDateString()
                        ) || [];

                      return (
                        <CalendarDayButton
                          day={day}
                          className="flex flex-col items-end justify-end"
                          modifiers={modifiers}
                          {...props}
                        >
                          {children}
                          {dayAppointments.length > 0 && (
                            <span className="">
                              {Array.from({
                                length: Math.min(dayAppointments.length, 3),
                              }).map((_, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block h-1 w-1 rounded-full bg-blue-500"
                                />
                              ))}
                              {dayAppointments.length > 3 && (
                                <span className="ml-0.5 text-[8px] font-bold text-blue-500">
                                  +
                                </span>
                              )}
                            </span>
                          )}
                        </CalendarDayButton>
                      );
                    },
                  }}
                />
              ) : (
                <div className="space-y-[18px]">
                  {appointments &&
                  appointments.filter(
                    (appointment) => new Date(appointment.date) > new Date()
                  ).length > 0 ? (
                    appointments
                      .filter(
                        (appointment) => new Date(appointment.date) > new Date()
                      )
                      .slice(0, 3)
                      .map((appointment) => {
                        const status = determineAppointmentStatus(appointment);
                        return (
                          <DbAppointmentSheet
                            key={appointment.id}
                            appointment={appointment}
                            sheetTrigger={
                              <div
                                key={appointment.id}
                                className="flex cursor-pointer flex-col gap-1"
                              >
                                <span className="flex items-center gap-1">
                                  <span
                                    className={cn(
                                      "size-[6px]",
                                      status ===
                                        ("confirmed" as AppointmentStatus)
                                        ? "bg-green-500"
                                        : status ===
                                            ("pending" as AppointmentStatus)
                                          ? "bg-yellow-500"
                                          : status ===
                                              ("cancelled" as AppointmentStatus)
                                            ? "bg-red-500"
                                            : "bg-blue-500"
                                    )}
                                  />
                                  <span className="text-sm font-semibold text-[#303030]">
                                    {formatDate(new Date(appointment.date))}
                                  </span>
                                </span>
                                <div className="mt-2 ml-4 flex h-fit items-center gap-2 rounded-[10px] border border-[#E8E8E8] bg-white p-[10px] md:h-[54px]">
                                  <div className="h-[40px] w-[2px] bg-red-600 md:h-full" />
                                  <div className="gap-1 text-[12px] text-[#66666B]">
                                    <h4 className="text-left font-medium">
                                      <span className="capitalize">
                                        {appointment.appointment_type}{" "}
                                        {appointment.visit_type} Appointment
                                      </span>{" "}
                                      @ {appointment.time}
                                      {appointment.appointment_type ===
                                        "virtual" &&
                                      createAppointmentEndTime(
                                        appointment.date,
                                        appointment.time
                                      )
                                        ? ` -  ${formatDate(appointment.date)}`
                                        : null}{" "}
                                    </h4>

                                    <p className="text-left font-normal">
                                      {appointment.appointment_type ===
                                      "physical" ? (
                                        appointment.visit_type === "home" ? (
                                          <span>
                                            House Address:{" "}
                                            {appointment.location}
                                            <br />
                                            Hospital Address:{" "}
                                            {appointment.hospital_info?.address}
                                            <br />
                                            Hospital Name:{" "}
                                            {appointment.hospital_info?.name}
                                          </span>
                                        ) : (
                                          <span>
                                            Hospital Address:{" "}
                                            {appointment.hospital_info?.address}
                                            <br />
                                            Hospital Name:{" "}
                                            {appointment.hospital_info?.name}
                                          </span>
                                        )
                                      ) : (
                                        <span>
                                          House Address: {appointment.location}
                                          <br />
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        );
                      })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CalendarIcon className="mb-3 text-[#b0b0b0]" size={48} />
                      <span className="text-base font-medium text-[#71717a]">
                        No appointments found
                      </span>
                      <span className="mt-1 text-sm text-[#b0b0b0]">
                        You have no upcoming appointments at the moment.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[6px] border border-[#E8E8E8] bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#71717a]">
                  Messages
                </span>
              </div>
              {messages && messages.length > 0 ? (
                <div>
                  {messages
                    .slice(0, 4)
                    .map((msg: MessagePreview, idx: number) => (
                      <Message
                        key={msg.id || idx}
                        avatar={msg.avatar}
                        name={msg.name}
                        message={msg.message}
                        timestamp={msg.timestamp}
                        unreadCount={msg.unreadCount}
                      />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="mb-3 text-[#b0b0b0]">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M21 15.5a2.5 2.5 0 0 1-2.5 2.5H7l-4 4V5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v10Z"
                        stroke="#b0b0b0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-medium text-[#71717a]">
                    No messages
                  </span>
                  <span className="mt-1 text-sm text-[#b0b0b0]">
                    Please send a message to start a conversation.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
