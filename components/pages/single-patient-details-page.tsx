"use client";
import {
  Activity,
  Calendar,
  CalendarIcon,
  ChevronRight,
  Clock,
  Dumbbell,
  Ellipsis,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Plus,
  SquarePen,
  Thermometer,
  Wind,
} from "lucide-react";
import React from "react";

import { healthRecords } from "@/config/constants";
import BloodPressureIcon from "@/icons/blood-pressure";
import CalendarBlankIcon from "@/icons/calendar-blank";
import DropIcon from "@/icons/drop";
import HeartbeatIcon from "@/icons/heartbeat";
import { HealthRecord, REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import { useGetHealthTracker } from "@/lib/queries/use-caregiver-query";
import {
  formatDate,
  getAppointmentLocation,
  getAppointmentTitle,
  initialsFromName,
} from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { Appointment, User } from "@/types";

import AddHealthVitals from "../dialogs/add-health-vitals";
import { ViewHealthRecordDialog } from "../dialogs/view-health-record-dialog";
import { getStatusBadge } from "../shared/health-record/health-record-list";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
type Metric = {
  name: string;
  value: string;
};

type Tracker = {
  id: number;
  user_id: string;
  caregiver_id: string;
  status: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
  metrics: Metric[];
  // Legacy fields for backward compatibility
  blood_glucose?: string;
  blood_pressure?: string;
  weight?: string;
  pulse?: string;
};

type Vital = {
  value: string;
  updated_at: string;
  id: number;
  name: string; // Add name since API returns metric name
  status: string;
};

type LatestVitals = {
  [metricCode: string]: Vital | null;
};

type SinglePatientDetailsPageProps = {
  patient: Partial<User>;
  appointments: Appointment[];
  metrics: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  }[];
};

export default function SinglePatientDetailsPage({
  patient,
  appointments,
  metrics,
}: SinglePatientDetailsPageProps) {
  const { user } = useUserStore();
  const { isPending, data: HealthTracker } = useGetHealthTracker(patient.id);
  // In your component
  const [selectedRecord, setSelectedRecord] =
    React.useState<HealthRecord | null>(null);
  const [viewRecordOpen, setViewRecordOpen] = React.useState(false);

  // Alternative version that only returns metrics that have values
  const getLatestVitalsWithValues = (
    trackers?: Tracker[]
  ): LatestVitals | null => {
    if (!trackers?.length) return null;

    const sorted = [...trackers].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const latest: LatestVitals = {};

    for (const tracker of sorted) {
      // Process metrics array (using 'name' not 'code')
      tracker.metrics?.forEach((metric) => {
        if (metric.name && metric.value && !latest[metric.name]) {
          latest[metric.name] = {
            value: metric.value,
            name: metric.name,
            updated_at: tracker.updated_at,
            status: tracker.status,
            id: tracker.id,
          };
        }
      });
    }

    return Object.keys(latest).length > 0 ? latest : null;
  };
  const latestVitals = getLatestVitalsWithValues(HealthTracker?.tracker);
  // Helper function to get metric code from name (for editing)
  const getMetricCodeFromName = (
    metricName: string,
    metrics: {
      id: number;
      name: string;
      code: string;
      created_at: string;
      updated_at: string;
    }[]
  ) => {
    const metric = metrics.find((m) => m.name === metricName);
    return metric?.code;
  };

  type MetricConfig = {
    displayName: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconColor: string;
  };

  const getMetricDisplayConfig = (metricName: string): MetricConfig => {
    const config: Record<string, MetricConfig> = {
      // Cardiovascular
      "Blood Pressure": {
        displayName: "Blood Pressure",
        icon: BloodPressureIcon,
        iconColor: "text-[#BD17E5]",
      },
      "Heart Rate": {
        displayName: "Heart Rate",
        icon: HeartbeatIcon,
        iconColor: "text-[#2563EB]",
      },
      Pulse: {
        displayName: "Heart Rate",
        icon: HeartbeatIcon,
        iconColor: "text-[#2563EB]",
      },

      // Blood Sugar
      "Blood Glucose (Fasting)": {
        displayName: "Blood Glucose (Fasting)",
        icon: DropIcon,
        iconColor: "text-[#F83E30]",
      },
      "Blood Glucose (Random)": {
        displayName: "Blood Glucose (Random)",
        icon: DropIcon,
        iconColor: "text-[#F83E30]",
      },
      HbA1c: {
        displayName: "HbA1c",
        icon: DropIcon,
        iconColor: "text-[#F83E30]",
      },

      // Physical Measurements
      Weight: {
        displayName: "Weight",
        icon: Dumbbell,
        iconColor: "text-[#2563EB]",
      },
      BMI: {
        displayName: "BMI",
        icon: Dumbbell,
        iconColor: "text-[#2563EB]",
      },
      Temperature: {
        displayName: "Temperature",
        icon: Thermometer,
        iconColor: "text-[#F59E0B]",
      },

      // Respiratory
      "Respiration Rate": {
        displayName: "Respiration Rate",
        icon: Wind,
        iconColor: "text-[#10B981]",
      },
      "Oxygen Saturation": {
        displayName: "Oxygen Saturation",
        icon: Wind,
        iconColor: "text-[#10B981]",
      },
      "Peak Flow": {
        displayName: "Peak Flow",
        icon: Wind,
        iconColor: "text-[#10B981]",
      },

      // Cholesterol
      "Total Cholesterol": {
        displayName: "Total Cholesterol",
        icon: DropIcon,
        iconColor: "text-[#8B5CF6]",
      },
      "HDL Cholesterol": {
        displayName: "HDL Cholesterol",
        icon: DropIcon,
        iconColor: "text-[#10B981]",
      },
      "LDL Cholesterol": {
        displayName: "LDL Cholesterol",
        icon: DropIcon,
        iconColor: "text-[#EF4444]",
      },
      Triglycerides: {
        displayName: "Triglycerides",
        icon: DropIcon,
        iconColor: "text-[#F59E0B]",
      },

      // Default fallback
      default: {
        displayName: metricName,
        icon: Activity,
        iconColor: "text-[#6B7280]",
      },
    };

    return config[metricName] || config.default;
  };
  // // Get health trackers from today
  // const healthTrackersToday = React.useMemo(() => {
  //   if (!HealthTracker?.tracker) return [];

  //   const today = new Date().toDateString();
  //   return HealthTracker.tracker.filter((t: any) => {
  //     const trackerDate = new Date(t.created_at).toDateString();
  //     return trackerDate === today;
  //   });
  // }, [HealthTracker]);

  // // Handle creating a health record
  // const handleCreateHealthRecord = async (data: CreateHealthRecordPayload) => {
  //   try {
  //     const response = await fetch("/api/health-records", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) throw new Error("Failed to create record");

  //     // Refresh records list
  //     // You might want to use a mutation hook here
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error creating health record:", error);
  //     throw error;
  //   }
  // };

  // Handle viewing a record
  const handleViewRecord = (recordId: number) => {
    // Fetch the full record details
    const record = healthRecords.find((r) => r.id === recordId);
    setSelectedRecord(record || null);
    setViewRecordOpen(true);
  };

  // Handle approval (admin only)
  const handleApprove = async (recordId: number) => {
    try {
      await fetch(`/api/health-records/${recordId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by_id: user?.id }),
      });

      // Refresh
      window.location.reload();
    } catch (error) {
      console.error("Error approving record:", error);
    }
  };

  // Handle rejection (admin only)
  const handleReject = async (recordId: number, reason: string) => {
    try {
      await fetch(`/api/health-records/${recordId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejected_by_id: user?.id,
          rejection_reason: reason,
        }),
      });

      // Refresh
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting record:", error);
    }
  };
  return (
    <section className="h-full gap-6 space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-fit space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
          <h6 className="text-base font-medium text-[#333]">
            Basic Information
          </h6>
          <div className="flex items-center gap-3">
            <div className="flex size-[90px] items-center justify-center rounded-[8px] bg-blue-100 text-sm font-medium text-blue-600">
              {initialsFromName(
                [patient?.first_name, patient?.last_name]
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
                {patient.first_name} {patient.last_name}
              </h4>
              <div className="space-x-3 text-sm font-normal text-[#66666B]">
                <span>
                  Gender: <b className="capitalize">{patient.gender}</b>
                </span>
                <span>DOB: {formatDate(patient.dob || "")}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  className="flex !h-[36px] items-center gap-[12px] rounded-[4px] border border-[#E8E8E8] bg-white px-5 py-0 hover:bg-white"
                  variant={"outline"}
                >
                  <Mail className="size-4 text-black" />
                  <span className="text-xs font-medium text-[#333] md:text-sm">
                    Message
                  </span>
                </Button>
                <Button
                  className="flex !h-[36px] items-center gap-[4px] rounded-[4px] border border-[#E8E8E8] bg-white px-3 py-0 text-xs hover:bg-white md:text-sm"
                  variant={"outline"}
                >
                  <CalendarBlankIcon className="size-4 text-black" />
                  <span className="text-xs font-medium text-[#333] md:text-sm">
                    Schedule Visit
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4 bg-[#E8E8E8]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 border-r border-[#e8e8e8] pr-[12px]">
              <span className="mb-4 text-sm font-medium text-[#303030]">
                Contact Information
              </span>
              <div className="space-y-3">
                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Phone Number
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {patient?.phone || "not-provided"}
                  </span>
                </span>

                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Emergency Contact
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {patient.emergency_contact_phone || "not-provided"}
                  </span>
                </span>
              </div>
            </div>
            <div className="space-y-4 pl-[12px]">
              <span className="mb-4 text-sm font-medium text-[#303030]">
                Duration of care
              </span>
              <div className="space-y-3">
                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    Start date
                  </span>
                  <span className="text-xs font-semibold text-black">
                    {formatDate(patient.created_at || "")}
                  </span>
                </span>
                <span className="flex flex-col gap-[4px]">
                  <span className="text-xs font-normal text-[#66666B]">
                    End date
                  </span>
                  <span className="text-xs font-semibold text-black">
                    not-provided
                  </span>
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-4 bg-[#E8E8E8]" />
          <div className="mt-3">
            <span className="text-xs font-normal text-[#66666B]">
              Current Caregivers
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Avatar className="!size-10 border-2 border-white">
                  <AvatarImage src="https://res.cloudinary.com/davidleo/image/upload/v1744896553/e1aa7d76f300fa1554e755fb776e171b_y9oajf.png" />
                </Avatar>
                <Avatar className="-ml-4 !size-10 border-2 border-white">
                  <AvatarImage src="https://res.cloudinary.com/davidleo/image/upload/v1744896555/c92c38b5944a8b4a33fc63ea583749a6_hzeez0.jpg" />
                </Avatar>
                <Avatar className="-ml-4 !size-10 border-2 border-white">
                  <AvatarImage src="https://res.cloudinary.com/davidleo/image/upload/v1744896552/381a0d1b74bd0b6ef68643335c85fc61_knu250.jpg" />
                </Avatar>
              </div>
              <span className="text-sm font-normal text-[#66666B]">
                Daniel James
                <span className="text-blue-600">+ 4 others</span>
              </span>
            </div>
          </div>
          <Separator className="my-4 bg-[#E8E8E8]" />
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                className="rounded-[6px] border border-[#E8E8E8] bg-white p-3"
                key={appointment.id}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <h4 className="line-clamp-1 cursor-pointer text-sm font-semibold text-[#303030] sm:text-base">
                        {getAppointmentTitle(appointment)}
                      </h4>
                    </div>

                    <div className="mt-1 flex items-center gap-2 self-end sm:mt-0 sm:self-auto">
                      <Ellipsis className="size-4 text-gray-500 sm:size-5" />
                    </div>
                  </div>

                  <Separator className="bg-[#E8E8E8]" />

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-[130px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                        <span className="text-xs font-normal text-[#303030] sm:text-sm">
                          {formatDate(appointment.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                        <span className="text-xs font-normal text-[#66666B] sm:text-sm">
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[130px]">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 flex-shrink-0 text-gray-500 sm:size-5" />
                        <div className="flex flex-col">
                          <span className="line-clamp-2 text-xs font-normal text-[#66666B] sm:line-clamp-none sm:text-sm">
                            {getAppointmentLocation(appointment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
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
        <div className="space-y-6">
          <div className="h-fit rounded-[6px] border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-[#787878]">
                Health Vitals
              </h6>
            </div>
            <div className="mt-3 space-y-6">
              {isPending ? (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="size-[42px] animate-pulse rounded-full bg-gray-200" />
                    <div>
                      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {HealthTracker && HealthTracker?.tracker.length > 0 ? (
                    <div className="space-y-3">
                      {/* Dynamic rendering of all available metrics */}
                      {latestVitals &&
                        Object.entries(latestVitals).map(
                          ([metricName, metricData]) => {
                            if (!metricData) return null;

                            const metricConfig =
                              getMetricDisplayConfig(metricName);
                            const metricCode = getMetricCodeFromName(
                              metricName,
                              metrics
                            );

                            return (
                              <div
                                key={metricName}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="flex size-[42px] items-center justify-center rounded-full border border-[#d1d5db]">
                                    <metricConfig.icon
                                      className={`${metricConfig.iconColor} size-5`}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-600">
                                      {metricConfig.displayName}
                                    </h4>
                                    {metricData.status === "pending" && (
                                      <span className="flex w-fit items-center gap-2 rounded-full border border-yellow-600 bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600 capitalize">
                                        <span className="size-2 rounded-full bg-yellow-600" />
                                        {metricData.status}
                                      </span>
                                    )}
                                    <p className="text-xs font-normal text-gray-400">
                                      Last updated:{" "}
                                      {formatDate(metricData.updated_at)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AddHealthVitals
                                    metrics={metrics}
                                    data={{
                                      id: metricData.id,
                                      name:
                                        metricCode ||
                                        metricName
                                          .toLowerCase()
                                          .replace(/\s+/g, "_"),
                                      value: metricData.value,
                                    }}
                                    edit={true}
                                    user_id={patient.id || 0}
                                    caregiver_id={user?.id || 0}
                                    dialogTrigger={
                                      <Button
                                        className="flex !h-[36px] w-[137px] cursor-pointer items-center justify-start border border-[#D1D5DB] text-sm font-medium text-[#1F2937]"
                                        variant={"outline"}
                                        disabled={
                                          metricData.status === "pending"
                                        }
                                      >
                                        {metricData.value}
                                        <Pencil className="ml-1 size-4 text-[#4B5563]" />
                                      </Button>
                                    }
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <span className="text-base font-medium text-[#71717a]">
                        No health tracker recorded
                      </span>
                      <span className="mt-1 text-sm text-[#b0b0b0]">
                        There is no health data for this patient yet.
                      </span>
                    </div>
                  )}
                </div>
              )}
              <AddHealthVitals
                metrics={metrics}
                user_id={patient.id || 0}
                caregiver_id={user?.id || 0}
                dialogTrigger={
                  <Button
                    className="flex !h-[45px] !w-full cursor-pointer items-center justify-center border border-[#D1D5DB] text-sm font-medium text-[#1F2937]"
                    variant={"outline"}
                  >
                    <Plus /> Add health data
                  </Button>
                }
              />
            </div>
          </div>
          <div className="h-fit space-y-4 rounded-[6px] border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-[#787878]">
                Health summary
              </h6>
              <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
                See all <ChevronRight className="size-5 text-gray-500" />
              </span>
            </div>
            {/* Create new health record button */}
            {/* <CreateHealthRecordDialog
              patientId={patient.id || 0}
              patientName={`${patient.first_name} ${patient.last_name}`}
              appointmentId={appointments[0]?.id} // Link to current appointment if exists
              healthTrackersToday={healthTrackersToday}
              currentUserRole={
                user?.user_role === "admin" ? "admin" : "caregiver"
              }
              currentUserId={user?.id || 0}
              onSubmit={handleCreateHealthRecord}
              trigger={
                <Button className="mt-4 flex !h-[45px] w-full text-sm font-normal">
                  <Plus className="mr-2 size-4" /> Create Health Record
                </Button>
              }
            /> */}
            <div className="mt-4 flex flex-col gap-4">
              {healthRecords.length > 0 ? (
                healthRecords.map((record) => {
                  const config = REPORT_TYPE_CONFIGS[record.record_type];
                  return (
                    <div
                      key={record.id}
                      onClick={() => handleViewRecord(record.id)}
                      className="group flex cursor-pointer items-center gap-4 rounded-[6px] border border-[#E8E8E8] p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <span className="hidden size-[42px] items-center justify-center rounded-full bg-[#F5F5F5] group-hover:bg-blue-500 group-hover:text-white md:flex">
                        <SquarePen className="size-5" />
                      </span>
                      <div className="grid w-full grid-cols-12 gap-4">
                        <div className="col-span-12 w-full md:col-span-7">
                          <h6 className="text-sm font-medium text-[#333]">
                            {record.title}
                          </h6>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <p className="text-xs font-normal text-[#66666b] md:text-sm">
                              Uploaded{" "}
                              <span>{formatDate(record.created_at)}</span>
                            </p>
                            <div className="flex items-center gap-1">
                              <span>
                                By {record.created_by_name || "Unknown"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 flex w-full flex-col justify-center gap-2 md:col-span-5 md:items-end">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                            {getStatusBadge(record.status)}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <FileText className="size-3" />
                              <span>{record.reports.length} report(s)</span>
                            </div>

                            {record.notes.length > 0 && (
                              <div className="flex items-center gap-1">
                                <FileText className="size-3" />
                                <span>{record.notes.length} note(s)</span>
                              </div>
                            )}

                            {record.health_tracker_ids.length > 0 && (
                              <div className="flex items-center gap-1">
                                <FileText className="size-3" />
                                <span>
                                  {record.health_tracker_ids.length} vital(s)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed py-12">
                  <FileText className="mb-3 size-12 text-gray-400" />
                  <p className="text-base font-medium text-gray-600">
                    No health records found
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a new health record to get started
                  </p>
                </div>
              )}

              <Button className="ml-auto flex !h-[45px] w-fit text-sm font-normal">
                Request health summary
              </Button>
            </div>
          </div>
          {/* View Record Dialog */}
          <ViewHealthRecordDialog
            record={selectedRecord}
            open={viewRecordOpen}
            onOpenChange={setViewRecordOpen}
            onApprove={handleApprove}
            onReject={handleReject}
            currentUserRole={
              user?.user_role === "admin" ? "admin" : "caregiver"
            }
          />
          <div className="h-fit rounded-[6px] border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-[#787878]">
                Recent reports
              </h6>
              <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
                See all <ChevronRight className="size-5 text-gray-500" />
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="h-[73px] rounded-[6px] bg-[#F5F5F5]" />
                <div className="h-[73px] rounded-[6px] bg-[#F5F5F5]" />
                <div className="h-[73px] rounded-[6px] bg-[#F5F5F5]" />
              </div>
              <div className="space-y-4">
                <div className="h-[26px] w-full rounded-[6px] bg-[#F5F5F5]" />
                <div className="h-[26px] w-[40%] rounded-[6px] bg-[#F5F5F5]" />
              </div>
              <Button className="ml-auto flex !h-[45px] w-fit text-sm font-normal">
                Add report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
