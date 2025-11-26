"use client";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Info,
  Lock,
  MapPin,
  MoreVertical,
  Paperclip,
  Pencil,
  Plus,
  Stethoscope,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { getOtherUsersInfo } from "@/app/actions/auth.actions";
import { UpdateHealthRecordWithFormData } from "@/app/actions/caregiver-patient.actions";
import AddHealthVitals from "@/components/dialogs/add-health-vitals";
import AddNoteDialog from "@/components/dialogs/add-note-dialog";
import AddReportDialog, {
  REPORT_TYPES,
} from "@/components/dialogs/add-report-dialog";
import { ViewNoteDialog } from "@/components/dialogs/view-note-dialog";
import { ViewReportDialog } from "@/components/dialogs/view-report-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { QuillPreview } from "@/components/ui/quill-preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import {
  formatFileSize,
  getFileIcon,
  getReportTypeBadge,
} from "@/lib/health-report-notes-utils";
import {
  getMetricCodeFromName,
  getMetricDisplayConfig,
  HealthTracker,
  HealthTracker2,
  Metric,
} from "@/lib/health-tracker-utils";
import {
  formatDate,
  getAppointmentLocation,
  getAppointmentTitle,
  initialsFromName,
} from "@/lib/utils";
import { HealthNote, HealthRecordRow, HealthReport, User } from "@/types";

import { LatestVitals } from "./single-patient-details-page";
import { getStatusBadge } from "../shared/health-record/health-record-list";
import { CaregiverAppointmentSheet } from "../sheets/caregiver-appointment-sheet";
import HealthTrackerHistorySheet from "../sheets/health-tracker-history-sheet";
import { Alert, AlertDescription } from "../ui/alert";

type SingleHealthRecordPageProps = {
  healthRecord: HealthRecordRow;
  metrics: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  }[];
  currentUserId: number;
  currentUserRole: "admin" | "caregiver";
  allPatientTrackers: HealthTracker2[];
};

export default function SingleHealthRecordPage({
  healthRecord,
  metrics,
  currentUserId,
  currentUserRole,
  allPatientTrackers,
}: SingleHealthRecordPageProps) {
  const [recordPatient, setRecordPatient] = useState<User>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Editable states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(healthRecord.title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    healthRecord.description
  );
  const [isEditingRecordType, setIsEditingRecordType] = useState(false);
  const [editedRecordType, setEditedRecordType] = useState(
    healthRecord.record_type || "prescription"
  );

  const config =
    REPORT_TYPE_CONFIGS[editedRecordType as keyof typeof REPORT_TYPE_CONFIGS] ||
    REPORT_TYPE_CONFIGS[
      healthRecord.record_type as keyof typeof REPORT_TYPE_CONFIGS
    ];

  const [selectedReport, setSelectedReport] =
    React.useState<HealthReport | null>(null);
  const [viewReportOpen, setViewReportOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<HealthNote | null>(
    null
  );
  const [viewNoteOpen, setViewNoteOpen] = React.useState(false);

  // Check if appointment has arrived status
  const hasPatientArrived = healthRecord.appointment?.status === "arrived";
  const isAppointmentPending = healthRecord.appointment?.status === "pending";

  // Master lock for all editing actions
  const isRecordLocked = !hasPatientArrived;

  // Update health record field using server action
  const updateHealthRecordField = async (
    field: "title" | "description" | "record_type",
    value: string
  ) => {
    if (isRecordLocked) {
      toast.error("Cannot edit record until patient arrives");
      return;
    }

    startTransition(async () => {
      try {
        const payload: {
          id: number;
          title?: string;
          description?: string;
          record_type?: string;
          auto_generate_title?: boolean;
          auto_generate_description?: boolean;
        } = {
          id: healthRecord.id,
        };

        if (field === "title") {
          payload.title = value;
        } else if (field === "description") {
          payload.description = value;
        } else if (field === "record_type") {
          payload.record_type = value;
        }

        const result = await UpdateHealthRecordWithFormData(payload);

        if (result.success) {
          toast.success(result.message);

          if (field === "title") setIsEditingTitle(false);
          if (field === "description") setIsEditingDescription(false);
          if (field === "record_type") setIsEditingRecordType(false);

          router.refresh();
        } else {
          if (result.errors) {
            Object.entries(result.errors).forEach(([key, messages]) => {
              messages.forEach((message) => toast.error(`${key}: ${message}`));
            });
          } else {
            toast.error(result.message || `Failed to update ${field}`);
          }

          if (field === "title") setEditedTitle(healthRecord.title);
          if (field === "description")
            setEditedDescription(healthRecord.description);
          if (field === "record_type")
            setEditedRecordType(healthRecord.record_type);
        }
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        toast.error(`Failed to update ${field}`);

        if (field === "title") setEditedTitle(healthRecord.title);
        if (field === "description")
          setEditedDescription(healthRecord.description);
        if (field === "record_type")
          setEditedRecordType(healthRecord.record_type);
      }
    });
  };

  // Handle title save
  const handleTitleSave = () => {
    if (editedTitle.trim() === "") {
      toast.error("Title cannot be empty");
      setEditedTitle(healthRecord.title);
      setIsEditingTitle(false);
      return;
    }

    if (editedTitle !== healthRecord.title) {
      updateHealthRecordField("title", editedTitle);
    } else {
      setIsEditingTitle(false);
    }
  };

  // Handle description save
  const handleDescriptionSave = () => {
    if (editedDescription !== healthRecord.description) {
      updateHealthRecordField("description", editedDescription);
    } else {
      setIsEditingDescription(false);
    }
  };

  // Handle record type save
  const handleRecordTypeSave = () => {
    if (editedRecordType !== healthRecord.record_type) {
      updateHealthRecordField("record_type", editedRecordType);
    } else {
      setIsEditingRecordType(false);
    }
  };

  // Cancel editing
  const handleCancelTitleEdit = () => {
    setEditedTitle(healthRecord.title);
    setIsEditingTitle(false);
  };

  const handleCancelDescriptionEdit = () => {
    setEditedDescription(healthRecord.description);
    setIsEditingDescription(false);
  };

  const handleCancelRecordTypeEdit = () => {
    setEditedRecordType(healthRecord.record_type);
    setIsEditingRecordType(false);
  };

  // Handle viewing a report (viewing is allowed even when locked)
  const handleViewReport = (report: HealthReport) => {
    setSelectedReport(report);
    setViewReportOpen(true);
  };

  // Handle viewing a note (viewing is allowed even when locked)
  const handleViewNote = (note: HealthNote) => {
    setSelectedNote(note);
    setViewNoteOpen(true);
  };

  // Handle approval
  const handleApprove = async () => {
    try {
      await fetch(`/api/health-records/${healthRecord.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by_id: currentUserId }),
      });
      toast.success("Health record approved successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error approving record:", error);
      toast.error("Failed to approve health record");
    }
  };

  // Handle rejection
  const handleReject = async (reason: string) => {
    try {
      await fetch(`/api/health-records/${healthRecord.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejected_by_id: currentUserId,
          rejection_reason: reason,
        }),
      });
      toast.success("Health record rejected");
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting record:", error);
      toast.error("Failed to reject health record");
    }
  };

  const getRecordPatient = useCallback(async () => {
    const user = await getOtherUsersInfo(healthRecord.patient_id);

    if (user.success) {
      setRecordPatient(user.user);
    }
  }, [healthRecord.patient_id]);

  useEffect(() => {
    getRecordPatient();
  }, [getRecordPatient]);

  const getLatestVitalsWithValues = (
    trackers?: HealthTracker[]
  ): LatestVitals | null => {
    if (!trackers?.length) return null;

    const sorted = [...trackers].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const latest: LatestVitals = {};

    for (const tracker of sorted) {
      JSON.parse(tracker.metrics)?.forEach((metric: Metric) => {
        if (metric.code && metric.value && !latest[metric.code]) {
          latest[metric.code] = {
            value: metric.value,
            name: metric.code,
            updated_at: tracker.updated_at,
            status: tracker.status,
            id: tracker.id,
          };
        }
      });
    }

    return Object.keys(latest).length > 0 ? latest : null;
  };
  const latestVitals = getLatestVitalsWithValues(healthRecord.trackers);

  return (
    <section className="h-full gap-6 space-y-6 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      {/* Locked Record Warning - Most Prominent */}
      {isRecordLocked && !isAppointmentPending && (
        <Alert className="border-amber-500 bg-amber-50">
          <Lock className="size-5 text-amber-600" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                Health Record Locked
              </p>
              <p className="text-sm text-amber-800">
                This health record is locked until the patient arrives for their
                appointment. Mark the patient as arrived to begin documentation.
              </p>
            </div>
            {healthRecord.appointment && (
              <CaregiverAppointmentSheet
                appointment={healthRecord.appointment}
                sheetTrigger={
                  <Button
                    size="sm"
                    className="ml-4 bg-amber-600 hover:bg-amber-700"
                  >
                    <CheckCircle2 className="mr-2 size-4" />
                    Mark as Arrived
                  </Button>
                }
              />
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Appointment Warning */}
      {isAppointmentPending && (
        <Alert className="border-gray-400 bg-gray-50">
          <Clock className="size-5 text-gray-600" />
          <AlertDescription>
            <p className="font-semibold text-gray-900">
              Appointment Pending Confirmation
            </p>
            <p className="text-sm text-gray-700">
              This appointment is still pending admin review and caregiver
              assignment.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Info Banner - What is this page for */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="size-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          <strong>Health Record Overview:</strong> This page contains all
          medical documentation for a specific appointment. You can track
          vitals, add reports, create notes, and manage the complete care
          journey for this patient visit.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="relative rounded-lg bg-white p-6">
        {/* Overlay for locked state */}
        {isRecordLocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-100/60 backdrop-blur-[2px]">
            <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
              <Lock className="mx-auto mb-3 size-12 text-amber-600" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Record Locked
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Mark the patient as arrived to unlock this health record and
                begin documentation.
              </p>
              {healthRecord.appointment && (
                <CaregiverAppointmentSheet
                  appointment={healthRecord.appointment}
                  sheetTrigger={
                    <Button className="w-full">
                      <CheckCircle2 className="mr-2 size-4" />
                      Mark Patient as Arrived
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div
              className={`flex size-16 flex-shrink-0 items-center justify-center rounded-xl ${
                isRecordLocked
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              <Stethoscope className="size-8" />
            </div>
            <div className="flex-1">
              {/* Editable Title */}
              {isEditingTitle && !isRecordLocked ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleSave();
                      if (e.key === "Escape") handleCancelTitleEdit();
                    }}
                    className="cursor-pointer text-2xl font-bold"
                    autoFocus
                    disabled={isPending || isRecordLocked}
                  />
                  <Button
                    size="sm"
                    onClick={handleTitleSave}
                    disabled={isPending || isRecordLocked}
                    className="!size-8 cursor-pointer p-0"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelTitleEdit}
                    disabled={isPending || isRecordLocked}
                    className="!size-8 cursor-pointer p-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <h1
                  className={`group text-lg font-bold lg:text-2xl ${
                    isRecordLocked
                      ? "cursor-not-allowed text-gray-400"
                      : "cursor-pointer text-gray-900 transition-colors hover:text-blue-600"
                  }`}
                  onClick={() => !isRecordLocked && setIsEditingTitle(true)}
                >
                  {editedTitle}
                  {!isRecordLocked && (
                    <Pencil className="ml-2 inline size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                  {isRecordLocked && (
                    <Lock className="ml-2 inline size-4 text-amber-600" />
                  )}
                </h1>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Editable Record Type */}
                {isEditingRecordType && !isRecordLocked ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={editedRecordType}
                      onValueChange={setEditedRecordType}
                      disabled={isPending || isRecordLocked}
                    >
                      <SelectTrigger className="w-[200px] cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REPORT_TYPES.map((report) => (
                          <SelectItem
                            key={report.id}
                            className="cursor-pointer"
                            value={report.id}
                          >
                            {report.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={handleRecordTypeSave}
                      disabled={isPending || isRecordLocked}
                      className="!size-8 cursor-pointer p-0"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelRecordTypeEdit}
                      disabled={isPending || isRecordLocked}
                      className="!size-8 cursor-pointer p-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className={`group ${
                      isRecordLocked
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer transition-colors hover:bg-blue-100"
                    }`}
                    onClick={() =>
                      !isRecordLocked && setIsEditingRecordType(true)
                    }
                  >
                    {config.label}
                    {!isRecordLocked && (
                      <Pencil className="ml-1 inline size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </Badge>
                )}

                {getStatusBadge(healthRecord.status)}
                {hasPatientArrived && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="mr-1 size-3" />
                    Patient Arrived
                  </Badge>
                )}
                {isRecordLocked && (
                  <Badge variant="default" className="bg-amber-600">
                    <Lock className="mr-1 size-3" />
                    Locked
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  ID: {healthRecord.id}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <UserIcon className="size-4" />
                  <span>
                    Created by {healthRecord.creator.first_name}{" "}
                    {healthRecord.creator.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{formatDate(healthRecord.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {currentUserRole === "admin" &&
              healthRecord.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="text-green-600 hover:bg-green-50"
                    onClick={handleApprove}
                    disabled={isRecordLocked}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleReject("Rejected by admin")}
                    disabled={isRecordLocked}
                  >
                    Reject
                  </Button>
                </>
              )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-0 right-0 !size-10"
                  disabled={isRecordLocked}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                  disabled={isRecordLocked}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Title
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditingDescription(true)}
                  disabled={isRecordLocked}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Description
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditingRecordType(true)}
                  disabled={isRecordLocked}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Change Record Type
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={isRecordLocked}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Record
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  disabled={isRecordLocked}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Record
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editable Description */}
        {healthRecord.description || isEditingDescription ? (
          <div
            className={`mt-6 rounded-lg p-4 ${isRecordLocked ? "bg-gray-100" : "bg-gray-50"}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              {!isEditingDescription && !isRecordLocked && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingDescription(true)}
                  className="h-6 gap-1 px-2 text-xs"
                >
                  <Pencil className="size-3" />
                  Edit
                </Button>
              )}
            </div>

            {isEditingDescription && !isRecordLocked ? (
              <div className="space-y-2">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Enter description..."
                  disabled={isPending || isRecordLocked}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelDescriptionEdit}
                    disabled={isPending || isRecordLocked}
                  >
                    <X className="mr-2 size-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDescriptionSave}
                    disabled={isPending || isRecordLocked}
                  >
                    <Check className="mr-2 size-4" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className={`text-sm whitespace-pre-wrap ${isRecordLocked ? "text-gray-400" : "cursor-pointer text-gray-600 transition-colors hover:text-gray-900"}`}
              >
                {editedDescription || "No description provided"}
              </p>
            )}
          </div>
        ) : (
          !isRecordLocked && (
            <div className="mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingDescription(true)}
                className="gap-2"
                disabled={isRecordLocked}
              >
                <Plus className="size-4" />
                Add Description
              </Button>
            </div>
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Patient & Appointment Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Actions Info Widget */}
          <div
            className={`rounded-lg border p-4 ${isRecordLocked ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}
          >
            <div className="mb-3 flex items-center gap-2">
              {isRecordLocked ? (
                <Lock className="size-4 text-amber-600" />
              ) : (
                <Info className="size-4 text-blue-600" />
              )}
              <h3
                className={`text-sm font-semibold ${isRecordLocked ? "text-amber-900" : "text-blue-900"}`}
              >
                {isRecordLocked ? "Unlock to Access" : "Quick Actions"}
              </h3>
            </div>
            <div
              className={`space-y-2 text-xs ${isRecordLocked ? "text-amber-800" : "text-blue-800"}`}
            >
              {isRecordLocked ? (
                <>
                  <p>🔒 Record is locked until patient arrives</p>
                  <p>📝 All editing features are disabled</p>
                  <p>✅ Mark patient as arrived to unlock</p>
                  <p>👁️ You can still view existing data</p>
                </>
              ) : (
                <>
                  <p>• Add health vitals to track patient metrics</p>
                  <p>• Upload medical reports and test results</p>
                  <p>• Document consultation notes</p>
                  <p>• Edit record details as needed</p>
                </>
              )}
            </div>
          </div>

          {/* Patient Information */}
          {healthRecord.patient && (
            <div className="rounded-lg border border-[#E8E8E8] bg-white p-6">
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                Patient Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                    {initialsFromName(
                      `${healthRecord.patient.first_name} ${healthRecord.patient.last_name}`
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/caregiver/patients/${healthRecord.patient.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {healthRecord.patient.first_name}{" "}
                      {healthRecord.patient.last_name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {healthRecord.patient.email}
                    </p>
                  </div>
                </div>
                {recordPatient && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      {recordPatient.phone && (
                        <div>
                          <span className="text-xs text-gray-500">Phone</span>
                          <p className="text-sm font-medium text-gray-900">
                            {recordPatient.phone}
                          </p>
                        </div>
                      )}
                      {recordPatient.gender && (
                        <div>
                          <span className="text-xs text-gray-500">Gender</span>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {recordPatient.gender}
                          </p>
                        </div>
                      )}
                      {recordPatient.dob && (
                        <div>
                          <span className="text-xs text-gray-500">
                            Date of Birth
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(recordPatient.dob)}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Appointment Information */}
          {healthRecord.appointment && (
            <div className="rounded-lg border border-[#E8E8E8] bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">
                  Related Appointment
                </h3>
                {!hasPatientArrived && !isAppointmentPending && (
                  <CaregiverAppointmentSheet
                    appointment={healthRecord.appointment}
                    sheetTrigger={
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="mr-2 size-4" />
                        Mark Arrived
                      </Button>
                    }
                  />
                )}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {getAppointmentTitle(healthRecord.appointment)}
                </h4>
                {hasPatientArrived && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="mr-1 size-3" />
                    Patient Arrived
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  <span>{formatDate(healthRecord.appointment.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="size-4" />
                  <span>{healthRecord.appointment.time}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="size-4 flex-shrink-0" />
                  <span>
                    {getAppointmentLocation(healthRecord.appointment)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Health Data */}
        <div className="space-y-6 lg:col-span-2">
          {/* Health Vitals/Trackers */}
          <div className="rounded-lg border border-[#E8E8E8] bg-white p-6">
            <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
              <h3 className="text-base font-semibold text-gray-900">
                Health Vitals ({healthRecord.trackers?.length || 0})
              </h3>
              <div className="flex items-center gap-2">
                {/* History Button - Always visible */}
                {allPatientTrackers.length > 0 && (
                  <HealthTrackerHistorySheet
                    trackers={allPatientTrackers}
                    metrics={metrics}
                    patientName={`${healthRecord.patient?.first_name} ${healthRecord.patient?.last_name}`}
                  />
                )}

                <AddHealthVitals
                  metrics={metrics}
                  user_id={healthRecord.patient_id}
                  caregiver_id={currentUserId}
                  health_record_id={healthRecord.id}
                  dialogTrigger={
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isRecordLocked}
                    >
                      {isRecordLocked && <Lock className="mr-2 size-4" />}
                      <Plus className="mr-2 size-4" />
                      Add Vital
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Info about historical data */}
            {allPatientTrackers.length > healthRecord.trackers?.length && (
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Info className="size-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-900">
                  This patient has {allPatientTrackers.length} total vital sign
                  records. Click &quot;View History&quot; to see patterns and
                  trends over time.
                </AlertDescription>
              </Alert>
            )}
            {healthRecord.trackers && healthRecord.trackers.length > 0 ? (
              <div className="space-y-3">
                {latestVitals &&
                  Object.entries(latestVitals).map(
                    ([metricName, metricData]) => {
                      if (!metricData) return null;

                      const metricConfig = getMetricDisplayConfig(metricName);
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
                            <div
                              className={`flex size-[42px] items-center justify-center rounded-full border ${isRecordLocked ? "border-gray-300 bg-gray-100" : "border-[#d1d5db]"}`}
                            >
                              <metricConfig.icon
                                className={`${isRecordLocked ? "text-gray-400" : metricConfig.iconColor} size-5`}
                              />
                            </div>
                            <div className="space-y-1">
                              <h4
                                className={`text-sm font-medium ${isRecordLocked ? "text-gray-400" : "text-gray-600"}`}
                              >
                                {metricConfig.displayName}
                              </h4>
                              {metricData.status === "pending" && (
                                <span className="flex w-fit items-center gap-2 rounded-full border border-yellow-600 bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600 capitalize">
                                  <span className="size-2 rounded-full bg-yellow-600" />
                                  {metricData.status}
                                </span>
                              )}
                              <p
                                className={`text-xs font-normal ${isRecordLocked ? "text-gray-300" : "text-gray-400"}`}
                              >
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
                                  metricName.toLowerCase().replace(/\s+/g, "_"),
                                value: metricData.value,
                              }}
                              edit={true}
                              user_id={healthRecord.patient?.id || 0}
                              caregiver_id={healthRecord.creator.id || 0}
                              dialogTrigger={
                                <Button
                                  className={`flex !h-[36px] w-[137px] items-center justify-start border border-[#D1D5DB] text-sm font-medium ${
                                    isRecordLocked
                                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                      : "cursor-pointer text-[#1F2937]"
                                  }`}
                                  variant={"outline"}
                                  disabled={
                                    metricData.status === "pending" ||
                                    isRecordLocked
                                  }
                                >
                                  {metricData.value}
                                  {!isRecordLocked && (
                                    <Pencil className="ml-1 size-4 text-[#4B5563]" />
                                  )}
                                  {isRecordLocked && (
                                    <Lock className="ml-1 size-4 text-gray-400" />
                                  )}
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
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8">
                <FileText
                  className={`mb-2 size-8 ${isRecordLocked ? "text-gray-300" : "text-gray-400"}`}
                />
                <p
                  className={`text-sm ${isRecordLocked ? "text-gray-400" : "text-gray-500"}`}
                >
                  {isRecordLocked
                    ? "Unlock to add vitals"
                    : "No vitals recorded"}
                </p>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="rounded-lg border border-[#E8E8E8] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Reports ({healthRecord.reports?.length || 0})
              </h3>
              <AddReportDialog
                patient_id={healthRecord.patient_id}
                health_record_id={healthRecord.id}
                dialogTrigger={
                  <Button size="sm" variant="outline" disabled={isRecordLocked}>
                    {isRecordLocked && <Lock className="mr-2 size-4" />}
                    <Plus className="mr-2 size-4" />
                    Add Report
                  </Button>
                }
              />
            </div>

            {healthRecord.reports && healthRecord.reports.length > 0 ? (
              <div className="space-y-3">
                {healthRecord.reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handleViewReport(report)}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      {report.report_file && (
                        <span className="text-2xl">
                          {getFileIcon(report.report_file)}
                        </span>
                      )}
                      <div>
                        <h6 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          {report.report_name}
                        </h6>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDate(report.created_at)}</span>
                          <span>•</span>
                          {report.report_file && (
                            <span>{formatFileSize(report.report_file)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getReportTypeBadge(report.report_type || "prescription")}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReport(report);
                        }}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8">
                <FileText
                  className={`mb-2 size-8 ${isRecordLocked ? "text-gray-300" : "text-gray-400"}`}
                />
                <p
                  className={`text-sm ${isRecordLocked ? "text-gray-400" : "text-gray-500"}`}
                >
                  {isRecordLocked
                    ? "Unlock to add reports"
                    : "No reports added"}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-lg border border-[#E8E8E8] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Notes ({healthRecord.notes?.length || 0})
              </h3>
              <AddNoteDialog
                patient_id={healthRecord.patient_id}
                health_record_id={healthRecord.id}
                dialogTrigger={
                  <Button size="sm" variant="outline" disabled={isRecordLocked}>
                    {isRecordLocked && <Lock className="mr-2 size-4" />}
                    <Plus className="mr-2 size-4" />
                    Add Note
                  </Button>
                }
              />
            </div>

            {healthRecord.notes && healthRecord.notes.length > 0 ? (
              <div className="space-y-4">
                {healthRecord.notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleViewNote(note)}
                    className="group cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      {note.title ? (
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {note.title}
                        </h4>
                      ) : (
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                          Note #{note.id}
                        </h4>
                      )}
                      {note.attachments && note.attachments.length > 0 && (
                        <Paperclip className="size-4 text-gray-400" />
                      )}
                    </div>
                    <QuillPreview
                      value={note.notes}
                      className="prose prose-sm line-clamp-2 max-w-none text-sm text-gray-600 [&_.ql-editor]:!p-0"
                    />
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>By {note.created_by_name}</span>
                      <span>•</span>
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8">
                <FileText
                  className={`mb-2 size-8 ${isRecordLocked ? "text-gray-300" : "text-gray-400"}`}
                />
                <p
                  className={`text-sm ${isRecordLocked ? "text-gray-400" : "text-gray-500"}`}
                >
                  {isRecordLocked ? "Unlock to add notes" : "No notes added"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Dialogs - These can still open even when locked (viewing existing data) */}
      <ViewReportDialog
        report={selectedReport}
        open={viewReportOpen}
        onOpenChange={setViewReportOpen}
      />
      <ViewNoteDialog
        note={selectedNote}
        open={viewNoteOpen}
        onOpenChange={setViewNoteOpen}
      />
    </section>
  );
}
