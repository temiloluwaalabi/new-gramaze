"use client";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Download,
  Eye,
  FileText,
  LucideShipWheel,
  MapPin,
  MoreVertical,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getOtherUsersInfo } from "@/app/actions/auth.actions";
import AddHealthVitals from "@/components/dialogs/add-health-vitals";
import AddNoteDialog from "@/components/dialogs/add-note-dialog";
import AddReportDialog from "@/components/dialogs/add-report-dialog";
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
  formatDate,
  getAppointmentLocation,
  getAppointmentTitle,
  initialsFromName,
} from "@/lib/utils";
import { HealthNote, HealthRecordRow, HealthReport, User } from "@/types";

import { getStatusBadge } from "../shared/health-record/health-record-list";

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
};

export default function SingleHealthRecordPage({
  healthRecord,
  metrics,
  currentUserId,
  currentUserRole,
}: SingleHealthRecordPageProps) {
  const [recordPatient, setRecordPatient] = useState<User>();
  const router = useRouter();

  // Editable states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(healthRecord.title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    healthRecord.description
  );
  const [isEditingRecordType, setIsEditingRecordType] = useState(false);
  const [editedRecordType, setEditedRecordType] = useState("prescription");
  const [isUpdating, setIsUpdating] = useState(false);

  const config =
    REPORT_TYPE_CONFIGS[editedRecordType as keyof typeof REPORT_TYPE_CONFIGS] ||
    REPORT_TYPE_CONFIGS["imaging_report" as keyof typeof REPORT_TYPE_CONFIGS];

  const [selectedReport, setSelectedReport] =
    React.useState<HealthReport | null>(null);
  const [viewReportOpen, setViewReportOpen] = React.useState(false);
  const [selectedNote, setSelectedNote] = React.useState<HealthNote | null>(
    null
  );
  const [viewNoteOpen, setViewNoteOpen] = React.useState(false);

  // Update health record field
  const updateHealthRecordField = async (
    field: "title" | "description" | "record_type",
    value: string
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/health-records/${healthRecord.id}/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update health record");
      }

      toast.success(
        `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`
      );

      // Close editing mode
      if (field === "title") setIsEditingTitle(false);
      if (field === "description") setIsEditingDescription(false);
      if (field === "record_type") setIsEditingRecordType(false);

      // Optionally refresh the page or update local state
      // router.refresh();
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);

      // Revert changes
      if (field === "title") setEditedTitle(healthRecord.title);
      if (field === "description")
        setEditedDescription(healthRecord.description);
      if (field === "record_type")
        setEditedRecordType(healthRecord.record_type);
    } finally {
      setIsUpdating(false);
    }
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

  // Handle viewing a report
  const handleViewReport = (report: HealthReport) => {
    setSelectedReport(report);
    setViewReportOpen(true);
  };

  // Handle viewing a note
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

  return (
    <section className="h-full gap-6 space-y-6 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      {/* Header */}
      <div className="rounded-lg bg-white p-6">
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

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div
              className={`flex size-16 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600`}
            >
              <LucideShipWheel />
            </div>
            <div className="flex-1">
              {/* Editable Title */}
              {isEditingTitle ? (
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
                    disabled={isUpdating}
                  />
                  <Button
                    size="sm"
                    onClick={handleTitleSave}
                    disabled={isUpdating}
                    className="!size-8 cursor-pointer p-0"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelTitleEdit}
                    disabled={isUpdating}
                    className="!size-8 cursor-pointer p-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <h1
                  className="group cursor-pointer text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {editedTitle}
                  <Pencil className="ml-2 inline size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </h1>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Editable Record Type */}
                {isEditingRecordType ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={editedRecordType}
                      onValueChange={setEditedRecordType}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-[200px] cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className="cursor-pointer"
                          value="appointment"
                        >
                          Appointment
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="consultation"
                        >
                          Consultation
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="diagnosis"
                        >
                          Diagnosis
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="treatment"
                        >
                          Treatment
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="prescription"
                        >
                          Prescription
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="lab_result"
                        >
                          Lab Result
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="imaging">
                          Imaging
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="procedure"
                        >
                          Procedure
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="vaccination"
                        >
                          Vaccination
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="imaging_report"
                        >
                          Imaging Report
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="other">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={handleRecordTypeSave}
                      disabled={isUpdating}
                      className="!size-8 cursor-pointer p-0"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelRecordTypeEdit}
                      disabled={isUpdating}
                      className="!size-8 cursor-pointer p-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="group cursor-pointer transition-colors hover:bg-blue-100"
                    onClick={() => setIsEditingRecordType(true)}
                  >
                    {config.label}
                    <Pencil className="ml-1 inline size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Badge>
                )}

                {getStatusBadge(healthRecord.status)}
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
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleReject("Rejected by admin")}
                  >
                    Reject
                  </Button>
                </>
              )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Title
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditingDescription(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Description
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsEditingRecordType(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Change Record Type
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Export Record
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Record
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editable Description */}
        {healthRecord.description || isEditingDescription ? (
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              {!isEditingDescription && (
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

            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Enter description..."
                  disabled={isUpdating}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelDescriptionEdit}
                    disabled={isUpdating}
                  >
                    <X className="mr-2 size-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDescriptionSave}
                    disabled={isUpdating}
                  >
                    <Check className="mr-2 size-4" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="cursor-pointer text-sm whitespace-pre-wrap text-gray-600 transition-colors hover:text-gray-900">
                {editedDescription || "No description provided"}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingDescription(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Description
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Patient & Appointment Info */}
        <div className="space-y-6 lg:col-span-1">
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
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                Related Appointment
              </h3>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {getAppointmentTitle(healthRecord.appointment)}
                </h4>
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
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                Health Vitals ({healthRecord.trackers?.length || 0})
              </h3>
              <AddHealthVitals
                metrics={metrics}
                user_id={healthRecord.patient_id}
                caregiver_id={currentUserId}
                health_record_id={healthRecord.id}
                dialogTrigger={
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 size-4" />
                    Add Vital
                  </Button>
                }
              />
            </div>

            {healthRecord.trackers && healthRecord.trackers.length > 0 ? (
              <div className="space-y-4">
                {healthRecord.trackers.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(tracker.created_at)}
                      </span>
                      {tracker.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="border-yellow-200 bg-yellow-100 text-yellow-800"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-8">
                <FileText className="mb-2 size-8 text-gray-400" />
                <p className="text-sm text-gray-500">No vitals recorded</p>
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
                  <Button size="sm" variant="outline">
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
                      {getReportTypeBadge("prescription")}
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
                <FileText className="mb-2 size-8 text-gray-400" />
                <p className="text-sm text-gray-500">No reports added</p>
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
                  <Button size="sm" variant="outline">
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
                <FileText className="mb-2 size-8 text-gray-400" />
                <p className="text-sm text-gray-500">No notes added</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Dialogs */}
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
