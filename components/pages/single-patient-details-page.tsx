"use client";
import {
  Book,
  Calendar,
  CalendarIcon,
  ChevronRight,
  Clock,
  Ellipsis,
  FileText,
  Mail,
  MapPin,
  Paperclip,
  Pencil,
  Plus,
  SquarePen,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import CalendarBlankIcon from "@/icons/calendar-blank";
import { REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import {
  getFileIcon,
  formatFileSize,
  getReportTypeBadge,
} from "@/lib/health-report-notes-utils";
import {
  getLatestVitalsWithValues,
  getMetricDisplayConfig,
  getMetricCodeFromName,
} from "@/lib/health-tracker-utils";
import { useGetHealthTracker } from "@/lib/queries/use-caregiver-query";
import {
  formatDate,
  getAppointmentLocation,
  getAppointmentTitle,
  initialsFromName,
} from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import {
  Appointment,
  HealthNote,
  HealthRecordRow,
  HealthReport,
  User,
} from "@/types";

import AddHealthVitals from "../dialogs/add-health-vitals";
import AddNoteDialog from "../dialogs/add-note-dialog";
import AddReportDialog from "../dialogs/add-report-dialog";
import { ViewNoteDialog } from "../dialogs/view-note-dialog";
import { ViewReportDialog } from "../dialogs/view-report-dialog";
import { getStatusBadge } from "../shared/health-record/health-record-list";
// import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { QuillPreview } from "../ui/quill-preview";
import { Separator } from "../ui/separator";
type Metric = {
  name: string;
  value: string;
};

export type Tracker = {
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

export type LatestVitals = {
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
  patientReports: HealthReport[];
  patientNotes: HealthNote[];
  healthRecords: HealthRecordRow[];
};

export default function SinglePatientDetailsPage({
  patient,
  appointments,
  patientReports,
  metrics,
  healthRecords,
  patientNotes,
}: SinglePatientDetailsPageProps) {
  const { user } = useUserStore();
  const { isPending, data: HealthTracker } = useGetHealthTracker(patient.id);

  const [selectedReport, setSelectedReport] =
    React.useState<HealthReport | null>(null);
  const [viewReportOpen, setViewReportOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<HealthNote | null>(
    null
  );
  const [viewNoteOpen, setViewNoteOpen] = React.useState(false);

  // Alternative version that only returns metrics that have values

  const latestVitals = getLatestVitalsWithValues(HealthTracker?.tracker);
  // Helper function to get metric code from name (for editing)

  // Handle view/download report
  const handleViewReport = (report: HealthReport) => {
    setSelectedReport(report);
    setViewReportOpen(true);
  };
  // Handle viewing a note
  const handleViewNote = (note: HealthNote) => {
    setSelectedNote(note);
    setViewNoteOpen(true);
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
  // const handleViewRecord = (recordId: number) => {
  //   // Fetch the full record details
  //   const record = healthRecords.find((r) => r.id === recordId);
  //   setSelectedRecord(record || null);
  //   setViewRecordOpen(true);
  // };

  // Handle approval (admin only)
  // const handleApprove = async (recordId: number) => {
  //   try {
  //     await fetch(`/api/health-records/${recordId}/approve`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ approved_by_id: user?.id }),
  //     });

  //     // Refresh
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error approving record:", error);
  //   }
  // };

  // Handle rejection (admin only)
  // const handleReject = async (recordId: number, reason: string) => {
  //   try {
  //     await fetch(`/api/health-records/${recordId}/reject`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         rejected_by_id: user?.id,
  //         rejection_reason: reason,
  //       }),
  //     });

  //     // Refresh
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error rejecting record:", error);
  //   }
  // };
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
          {/* <div className="mt-3">
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
          <Separator className="my-4 bg-[#E8E8E8]" /> */}
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
                  {appointment.health_record_id !== null && (
                    <Link
                      href={`/caregiver/health-records/${appointment.health_record_id}`}
                      className="flex w-fit items-center gap-2 rounded-md bg-blue-600 px-2 py-2 !text-white"
                    >
                      <Book className="size-4 flex-shrink-0 text-white sm:size-5" />
                      <span className="text-xs font-normal text-white capitalize sm:text-sm">
                        View Health Record
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <CalendarIcon className="mb-3 text-[#b0b0b0]" size={48} />
              <span className="text-base font-medium text-[#71717a]">
                No appointments found
              </span>
              <span className="mt-1 text-center text-sm text-[#b0b0b0]">
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
                Health Records
              </h6>
              <Link
                href={"/caregiver/health-records"}
                className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]"
              >
                See all <ChevronRight className="size-5 text-gray-500" />
              </Link>
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
                healthRecords.slice(0, 4).map((record) => {
                  const config = REPORT_TYPE_CONFIGS[
                    record.record_type as keyof typeof REPORT_TYPE_CONFIGS
                  ] ?? { label: String(record.record_type || "Unknown") };
                  return (
                    <div
                      key={record.id}
                      className="group relative flex cursor-pointer items-center gap-4 rounded-[6px] border border-[#E8E8E8] p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Link
                        href={`/caregiver/health-records/${record.id}`}
                        className="absolute top-0 left-0 size-full"
                      />
                      <span className="hidden size-[42px] items-center justify-center rounded-full bg-[#F5F5F5] group-hover:bg-blue-500 group-hover:text-white md:flex">
                        <SquarePen className="size-5" />
                      </span>
                      <div className="grid w-full grid-cols-12 gap-4">
                        <div className="col-span-12 w-full space-y-1 md:col-span-7">
                          <h6 className="line-clamp-1 max-w-prose text-sm font-medium text-ellipsis text-[#333]">
                            {record.title}
                          </h6>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <p className="text-xs font-normal text-[#66666b] md:text-sm">
                              Uploaded{" "}
                              <span>{formatDate(record.created_at)}</span>
                            </p>
                            <div className="flex items-center gap-1">
                              <span>
                                By {record.creator.first_name || "Unknown"}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <div className="col-span-12 flex w-full flex-col justify-center gap-2 md:col-span-5 md:items-end">
                          <div className="flex items-center gap-2">
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

                            {record.health_tracker_ids &&
                              record.health_tracker_ids.length > 0 && (
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
              {patientReports && patientReports.length > 0 ? (
                <>
                  {/* Display first 3 reports as cards in grid */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {patientReports.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        onClick={() => handleViewReport(report)}
                        className="group flex cursor-pointer flex-col gap-3 rounded-[6px] border border-[#E8E8E8] bg-[#F5F5F5] p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {getFileIcon(report.report_file)}
                            </span>
                            <div className="flex-1">
                              <h6 className="line-clamp-1 text-sm font-medium text-[#333] group-hover:text-blue-600">
                                {report.report_name}
                              </h6>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(report.report_file)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {getReportTypeBadge(
                            report.report_type || "prescription"
                          )}
                          <p className="text-xs text-gray-400">
                            {formatDate(report.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Display remaining reports as list */}
                  {patientReports.length > 3 && (
                    <div className="space-y-3">
                      {patientReports.slice(3).map((report) => (
                        <div
                          key={report.id}
                          onClick={() => handleViewReport(report)}
                          className="group flex cursor-pointer items-center justify-between rounded-[6px] border border-[#E8E8E8] p-3 transition-all hover:border-blue-500 hover:bg-blue-50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {getFileIcon(report.report_file)}
                            </span>
                            <div>
                              <h6 className="text-sm font-medium text-[#333] group-hover:text-blue-600">
                                {report.report_name}
                              </h6>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>
                                  Uploaded by Dr. Sarah Johnson
                                  {/* {report.caregiver
                                ? `${report.caregiver.first_name} ${report.caregiver.last_name}`
                                : 'Dr. Sarah Johnson'}{' '} */}
                                  {/* Hardcoded for now */}
                                </span>
                                <span>•</span>
                                <span>{formatDate(report.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getReportTypeBadge(
                              report.report_type || "prescription"
                            )}
                            <ChevronRight className="size-4 text-gray-400 group-hover:text-blue-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed py-12">
                  <FileText className="mb-3 size-12 text-gray-400" />
                  <p className="text-base font-medium text-gray-600">
                    No reports found
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a new report to get started
                  </p>
                </div>
              )}

              {/* Add Report Button */}
              <AddReportDialog
                patient_id={patient.id || 0}
                // health_record_id={1}
                dialogTrigger={
                  <Button className="ml-auto flex !h-[45px] w-fit text-sm font-normal">
                    <Plus className="mr-2 size-4" /> Add report
                  </Button>
                }
              />
            </div>
          </div>
          {/* Add Notes Section - Place this after Reports section */}
          <div className="h-fit rounded-[6px] border border-[#E8E8E8] bg-white p-4">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-[#787878]">
                Recent notes
              </h6>
              <span className="flex cursor-pointer items-center gap-1 text-base font-medium text-[#333]">
                See all <ChevronRight className="size-5 text-gray-500" />
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {patientNotes && patientNotes.length > 0 ? (
                <div className="space-y-3">
                  {patientNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleViewNote(note)}
                      className="group flex cursor-pointer items-start gap-4 rounded-[6px] border border-[#E8E8E8] p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <div className="flex size-[42px] flex-shrink-0 items-center justify-center rounded-full bg-[#F5F5F5] group-hover:bg-blue-500 group-hover:text-white">
                        <FileText className="size-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            {note.title && (
                              <h2 className="mb-2 text-base font-medium">
                                {note.title}
                              </h2>
                            )}
                            <QuillPreview
                              value={note.notes}
                              className="prose prose-sm dark:text-light-200/80 dark:[&_p]:text-light-400 dark:[&_span]:!text-light-400 -mt-2 line-clamp-2 max-w-none text-sm text-[#303030] group-hover:text-blue-600 [&_.ql-editor]:flex [&_.ql-editor]:flex-col [&_.ql-editor]:gap-2 [&_.ql-editor]:!p-0 [&_.ql-editor]:px-0 [&_.ql-editor]:text-sm [&_h2]:hidden [&_h4]:text-sm [&_li]:text-sm [&_p]:text-sm [&_p]:leading-[25px] [&_p]:font-normal [&_p]:tracking-wide [&_p]:!text-black [&_p_br]:hidden [&_p:first-of-type]:line-clamp-2 [&_p:not(:first-of-type)]:hidden [&_span]:!bg-transparent [&_span]:!text-black [&_ul]:space-y-3"
                            />
                          </div>
                          {note.attachments && note.attachments.length > 0 && (
                            <Paperclip className="ml-2 size-4 flex-shrink-0 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>By {note.created_by_name}</span>
                          <span>•</span>
                          <span>{formatDate(note.created_at)}</span>
                          {note.attachments && note.attachments.length > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                {note.attachments.length} attachment(s)
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="size-4 flex-shrink-0 text-gray-400 group-hover:text-blue-500" />
                    </div>
                  ))}
                </div>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed py-12">
                  <FileText className="mb-3 size-12 text-gray-400" />
                  <p className="text-base font-medium text-gray-600">
                    No notes found
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a new note to get started
                  </p>
                </div>
              )}

              {/* Add Note Button */}
              <AddNoteDialog
                patient_id={patient.id || 0}
                dialogTrigger={
                  <Button className="ml-auto flex !h-[45px] w-fit text-sm font-normal">
                    <Plus className="mr-2 size-4" /> Add note
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <ViewReportDialog
        report={selectedReport}
        open={viewReportOpen}
        onOpenChange={setViewReportOpen}
      />
      {/* View Note Dialog */}
      <ViewNoteDialog
        note={selectedNote}
        open={viewNoteOpen}
        onOpenChange={setViewNoteOpen}
      />
    </section>
  );
}
