/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  FileText,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  X,
  Activity,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type HealthRecord,
  type RecordStatus,
  REPORT_TYPE_CONFIGS,
} from "@/lib/health-record-types";
import { formatDate } from "@/lib/utils";

interface ViewHealthRecordDialogProps {
  record: HealthRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (recordId: number) => Promise<void>;
  onReject?: (recordId: number, reason: string) => Promise<void>;
  currentUserRole?: "admin" | "caregiver";
}

export function ViewHealthRecordDialog({
  record,
  open,
  onOpenChange,
  onApprove,
  onReject,
  currentUserRole,
}: ViewHealthRecordDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  if (!record) return null;

  const config = REPORT_TYPE_CONFIGS[record.record_type];

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="border-green-600 bg-green-50 text-green-700">
            <CheckCircle className="mr-1 size-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="border-yellow-600 bg-yellow-50 text-yellow-700">
            <AlertCircle className="mr-1 size-3" />
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="border-red-600 bg-red-50 text-red-700">
            <XCircle className="mr-1 size-3" />
            Rejected
          </Badge>
        );
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsProcessing(true);
    try {
      await onApprove(record.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!onReject || !rejectionReason.trim()) return;
    setIsProcessing(true);
    try {
      await onReject(record.id, rejectionReason);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setIsProcessing(false);
      setRejectionReason("");
      setShowRejectInput(false);
    }
  };

  const canApprove = currentUserRole === "admin" && record.status === "pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{record.title}</DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">{config.label}</Badge>
                {getStatusBadge(record.status)}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">
              Reports ({record.reports.length})
            </TabsTrigger>
            <TabsTrigger value="vitals">
              Vitals ({record.health_tracker_ids.length})
            </TabsTrigger>
            <TabsTrigger value="notes">
              Notes ({record.notes.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="mt-4 flex-1">
            <TabsContent value="overview" className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-4">
                <div>
                  <span className="text-xs font-medium text-gray-600">
                    Description
                  </span>
                  <p className="mt-1 text-sm">{record.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Created By
                    </span>
                    <p className="mt-1 text-sm">
                      {record.created_by_name}
                      <span className="ml-1 text-xs text-gray-500 capitalize">
                        ({record.created_by_role})
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Created At
                    </span>
                    <p className="mt-1 text-sm">
                      {formatDate(record.created_at)}
                    </p>
                  </div>
                </div>

                {record.approved_at && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-medium text-gray-600">
                          Approved By
                        </span>
                        <p className="mt-1 text-sm">
                          {record.approved_by_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-600">
                          Approved At
                        </span>
                        <p className="mt-1 text-sm">
                          {formatDate(record.approved_at)}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {record.status === "rejected" && record.rejection_reason && (
                  <>
                    <Separator />
                    <div className="rounded bg-red-50 p-3">
                      <span className="text-xs font-medium text-red-700">
                        Rejection Reason
                      </span>
                      <p className="mt-1 text-sm text-red-600">
                        {record.rejection_reason}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-md border border-gray-200 p-4 text-center">
                  <FileText className="mx-auto mb-2 size-8 text-blue-600" />
                  <p className="text-2xl font-bold">{record.reports.length}</p>
                  <p className="text-xs text-gray-600">Reports</p>
                </div>
                <div className="rounded-md border border-gray-200 p-4 text-center">
                  <Activity className="mx-auto mb-2 size-8 text-green-600" />
                  <p className="text-2xl font-bold">
                    {record.health_tracker_ids.length}
                  </p>
                  <p className="text-xs text-gray-600">Vitals</p>
                </div>
                <div className="rounded-md border border-gray-200 p-4 text-center">
                  <FileText className="mx-auto mb-2 size-8 text-purple-600" />
                  <p className="text-2xl font-bold">{record.notes.length}</p>
                  <p className="text-xs text-gray-600">Notes</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              {record.reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="mb-3 size-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    No reports in this record
                  </p>
                </div>
              ) : (
                record.reports.map((report, index) => {
                  const reportConfig = REPORT_TYPE_CONFIGS[report.report_type];
                  return (
                    <div
                      key={report.id}
                      className="rounded-md border border-gray-200 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Badge variant="outline">{reportConfig.label}</Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(report.created_at)}
                        </span>
                      </div>

                      <h4 className="font-semibold text-gray-900">
                        {report.title}
                      </h4>

                      <div className="mt-3 space-y-3">
                        <div>
                          <span className="text-xs font-medium text-gray-600">
                            Content
                          </span>
                          <p className="mt-1 text-sm whitespace-pre-wrap text-gray-700">
                            {report.content}
                          </p>
                        </div>

                        {report.findings && (
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Findings
                            </span>
                            <p className="mt-1 text-sm whitespace-pre-wrap text-gray-700">
                              {report.findings}
                            </p>
                          </div>
                        )}

                        {report.recommendations && (
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Recommendations
                            </span>
                            <p className="mt-1 text-sm whitespace-pre-wrap text-gray-700">
                              {report.recommendations}
                            </p>
                          </div>
                        )}

                        {report.attachments.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Attachments
                            </span>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {report.attachments.map((attachment) => (
                                <Button
                                  key={attachment.id}
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Download className="size-3" />
                                  {attachment.file_name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                        <User className="size-3" />
                        <span>By {report.created_by_name}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              {record.health_tracker_ids.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Activity className="mb-3 size-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    No vitals data in this record
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    This record includes {record.health_tracker_ids.length}{" "}
                    health tracker entries.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Tracker IDs: {record.health_tracker_ids.join(", ")}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              {record.notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="mb-3 size-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    No notes in this record
                  </p>
                </div>
              ) : (
                record.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-md border border-gray-200 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          note.note_type === "admin_note"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {note.note_type === "admin_note"
                          ? "Admin Note"
                          : "Caregiver Note"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.created_at)}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap text-gray-700">
                      {note.content}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                      <User className="size-3" />
                      <span>By {note.created_by_name}</span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Approval Actions (Admin only, for pending records) */}
        {canApprove && (
          <div className="border-t pt-4">
            {!showRejectInput ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 size-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => setShowRejectInput(true)}
                  disabled={isProcessing}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="mr-2 size-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReject}
                    disabled={isProcessing || !rejectionReason.trim()}
                    variant="destructive"
                    size="sm"
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRejectInput(false);
                      setRejectionReason("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
