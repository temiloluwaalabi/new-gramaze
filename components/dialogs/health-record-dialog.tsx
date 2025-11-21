/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus, X, FileText } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  type ReportType,
  type CreateHealthRecordPayload,
  type CreateReportPayload,
  type CreateNotePayload,
  type CreatorRole,
  REPORT_TYPE_CONFIGS,
  getAllReportTypes,
} from "@/lib/health-record-types";
import { formatDate } from "@/lib/utils";

interface HealthTrackerForSelection {
  id: number;
  metrics: Array<{
    name: string;
    value: string;
  }>;
  created_at: string;
  status: string;
}

interface CreateHealthRecordDialogProps {
  patientId: number;
  patientName: string;
  appointmentId?: number;
  healthTrackersToday: HealthTrackerForSelection[];
  currentUserRole: CreatorRole;
  currentUserId: number;
  onSubmit: (data: CreateHealthRecordPayload) => Promise<void>;
  trigger?: React.ReactNode;
}

export function CreateHealthRecordDialog({
  patientId,
  patientName,
  appointmentId,
  healthTrackersToday,
  currentUserRole,
  currentUserId,
  onSubmit,
  trigger,
}: CreateHealthRecordDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);

  // Step 1: Basic Info
  const [title, setTitle] = React.useState("");
  const [recordType, setRecordType] = React.useState<ReportType | "">("");
  const [description, setDescription] = React.useState("");
  const [selectedTrackerIds, setSelectedTrackerIds] = React.useState<number[]>(
    []
  );

  // Step 2: Reports
  const [reports, setReports] = React.useState<
    Array<CreateReportPayload & { tempId: string }>
  >([]);

  // Step 3: Notes
  const [noteContent, setNoteContent] = React.useState("");

  const resetForm = () => {
    setTitle("");
    setRecordType("");
    setDescription("");
    setSelectedTrackerIds([]);
    setReports([]);
    setNoteContent("");
    setCurrentStep(1);
  };

  const toggleTracker = (trackerId: number) => {
    setSelectedTrackerIds((prev) =>
      prev.includes(trackerId)
        ? prev.filter((id) => id !== trackerId)
        : [...prev, trackerId]
    );
  };

  const addReport = () => {
    if (!recordType) return;

    const newReport: CreateReportPayload & { tempId: string } = {
      tempId: Date.now().toString(),
      report_type: recordType as ReportType,
      title: "",
      content: "",
      findings: "",
      recommendations: "",
    };

    setReports([...reports, newReport]);
  };

  const removeReport = (tempId: string) => {
    setReports(reports.filter((r) => r.tempId !== tempId));
  };

  const updateReport = (
    tempId: string,
    field: keyof CreateReportPayload,
    value: string
  ) => {
    setReports(
      reports.map((r) => (r.tempId === tempId ? { ...r, [field]: value } : r))
    );
  };

  const canProceedToStep2 = () => {
    return (
      title.trim() !== "" && recordType !== "" && description.trim() !== ""
    );
  };

  const canProceedToStep3 = () => {
    // At least one report with title and content
    return (
      reports.length > 0 &&
      reports.every((r) => r.title.trim() !== "" && r.content.trim() !== "")
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const notes: CreateNotePayload[] = [];
      if (noteContent.trim()) {
        notes.push({
          note_type:
            currentUserRole === "admin" ? "admin_note" : "caregiver_note",
          content: noteContent,
        });
      }

      const payload: CreateHealthRecordPayload = {
        patient_id: patientId,
        appointment_id: appointmentId,
        title,
        record_type: recordType as ReportType,
        description,
        health_tracker_ids: selectedTrackerIds,
        reports: reports.map(({ tempId, ...rest }) => rest),
        notes,
        created_by_role: currentUserRole,
        created_by_id: currentUserId,
      };

      await onSubmit(payload);

      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create health record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex !h-[45px] w-fit gap-2 text-sm font-normal">
            <Plus className="size-4" /> Create Health Record
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Health Record for {patientName}</DialogTitle>
          <DialogDescription>
            {currentStep === 1 &&
              "Enter basic information about the health record"}
            {currentStep === 2 && "Add reports to this health record"}
            {currentStep === 3 && "Add notes and review"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between py-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`flex size-8 items-center justify-center rounded-full ${
                    step === currentStep
                      ? "bg-blue-600 text-white"
                      : step < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                <span className="ml-2 hidden text-sm font-medium text-gray-700 sm:block">
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Reports"}
                  {step === 3 && "Notes & Review"}
                </span>
              </div>
              {step < 3 && <div className="mx-2 h-0.5 flex-1 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        <ScrollArea className="flex-1 pr-4">
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Record Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Annual Physical Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="recordType">Primary Record Type *</Label>
                <Select
                  value={recordType}
                  onValueChange={(value) => setRecordType(value as ReportType)}
                >
                  <SelectTrigger id="recordType">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllReportTypes().map((type) => {
                      const config = REPORT_TYPE_CONFIGS[type];
                      return (
                        <SelectItem key={type} value={type}>
                          {config.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {recordType && (
                  <p className="text-muted-foreground text-xs">
                    {REPORT_TYPE_CONFIGS[recordType].description}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a brief description of this health record..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Health Tracker Selection */}
              {healthTrackersToday.length > 0 && (
                <div className="space-y-2">
                  <Label>Include Health Vitals from Today</Label>
                  <p className="text-muted-foreground text-xs">
                    Select health tracker entries to include with this record
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {healthTrackersToday.map((tracker) => {
                      const isSelected = selectedTrackerIds.includes(
                        tracker.id
                      );
                      return (
                        <Badge
                          key={tracker.id}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTracker(tracker.id)}
                        >
                          {tracker.metrics.length} metrics at{" "}
                          {formatDate(tracker.created_at)}
                          {tracker.status === "pending" && " (pending)"}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Show selected tracker details */}
                  {selectedTrackerIds.length > 0 && (
                    <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="mb-2 text-xs font-medium text-gray-700">
                        Selected Vitals:
                      </p>
                      {healthTrackersToday
                        .filter((t) => selectedTrackerIds.includes(t.id))
                        .map((tracker) => (
                          <div
                            key={tracker.id}
                            className="mb-2 text-xs text-gray-600"
                          >
                            {tracker.metrics.map((m, i) => (
                              <span key={i} className="mr-3">
                                {m.name}: <strong>{m.value}</strong>
                              </span>
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Reports */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Reports</h4>
                  <p className="text-muted-foreground text-sm">
                    Add one or more reports to this health record
                  </p>
                </div>
                <Button onClick={addReport} size="sm" variant="outline">
                  <Plus className="mr-1 size-4" /> Add Report
                </Button>
              </div>

              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed py-12">
                  <FileText className="mb-2 size-12 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">
                    No reports added yet
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Click &quot;Add Report&quot; to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report, index) => {
                    const config = REPORT_TYPE_CONFIGS[report.report_type];
                    return (
                      <div
                        key={report.tempId}
                        className="rounded-md border border-gray-200 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <Badge variant="outline">{config.label}</Badge>
                          <Button
                            onClick={() => removeReport(report.tempId)}
                            size="sm"
                            variant="ghost"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {config.fields.map((field) => (
                            <div key={field.name} className="grid gap-2">
                              <Label>
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500"> *</span>
                                )}
                              </Label>
                              {field.type === "textarea" ? (
                                <Textarea
                                  placeholder={field.placeholder}
                                  value={(report as any)[field.name] || ""}
                                  onChange={(e) =>
                                    updateReport(
                                      report.tempId,
                                      field.name as any,
                                      e.target.value
                                    )
                                  }
                                  rows={3}
                                />
                              ) : (
                                <Input
                                  placeholder={field.placeholder}
                                  value={(report as any)[field.name] || ""}
                                  onChange={(e) =>
                                    updateReport(
                                      report.tempId,
                                      field.name as any,
                                      e.target.value
                                    )
                                  }
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Notes & Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="note">Add a Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder={`Add a ${currentUserRole} note...`}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                />
              </div>

              <Separator />

              {/* Review Summary */}
              <div className="space-y-3">
                <h4 className="font-medium">Review Summary</h4>

                <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Title:
                    </span>
                    <p className="text-sm">{title}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Type:
                    </span>
                    <p className="text-sm">
                      {REPORT_TYPE_CONFIGS[recordType as ReportType]?.label}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Reports:
                    </span>
                    <p className="text-sm">{reports.length} report(s)</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Health Trackers:
                    </span>
                    <p className="text-sm">
                      {selectedTrackerIds.length} selected
                    </p>
                  </div>
                  {currentUserRole === "caregiver" && (
                    <div className="mt-2 rounded bg-yellow-50 p-2">
                      <p className="text-xs text-yellow-800">
                        ⚠️ This record will be pending until approved by an
                        admin
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={() =>
              currentStep > 1 ? setCurrentStep(currentStep - 1) : setOpen(false)
            }
            disabled={isSubmitting}
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                currentStep === 1 ? !canProceedToStep2() : !canProceedToStep3()
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Health Record"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
