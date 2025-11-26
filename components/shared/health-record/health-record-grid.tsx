import {
  MoreVertical,
  FileText,
  Calendar,
  SquarePen,
  ShipWheelIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import { formatDate, initialsFromName } from "@/lib/utils";
import { HealthRecordRow } from "@/types";

import { getStatusBadge } from "./health-record-list";
type HealthRecordCardProps = {
  record: HealthRecordRow;
  onView?: (recordId: number) => void;
  onEdit?: (recordId: number) => void;
  onApprove?: (recordId: number) => void;
  onReject?: (recordId: number) => void;
  onArchive?: (recordId: number) => void;
};

export function HealthRecordCard({
  record,
  onView,
  onApprove,
  onReject,
}: HealthRecordCardProps) {
  const config =
    REPORT_TYPE_CONFIGS["prescription" as keyof typeof REPORT_TYPE_CONFIGS];
  const patient = record.patient;
  const patientInitials = patient
    ? initialsFromName(`${patient.first_name} ${patient.last_name}`)
    : "N/A";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-[#E8E8E8] bg-white p-5 transition-all hover:border-blue-500 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500`}
          >
            <ShipWheelIcon />
          </div>
          <div className="flex-1">
            <Link
              href={`/caregiver/health-records/${record.id}`}
              className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors hover:text-blue-600"
            >
              {record.title}
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {config.label}
              </Badge>
              {getStatusBadge(record.status)}
            </div>
          </div>
        </div>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="!size-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView?.(record.id)}>
              <Link
                className="flex items-center gap-1"
                href={`/caregiver/health-records/${record.id}`}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}
            {record.status === "pending" && (
              <>
                <DropdownMenuItem
                  onClick={() => onApprove?.(record.id)}
                  className="text-green-600"
                >
                  Approve Record
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReject?.(record.id)}
                  className="text-red-600"
                >
                  Reject Record
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {/* <DropdownMenuItem
              onClick={() => onArchive?.(record.id)}
              className="text-orange-600"
            >
              Archive Record
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Patient Info */}
      {patient && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-gray-50 p-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
            {patientInitials}
          </div>
          <div className="flex-1">
            <Link
              href={`/caregiver/patients/${patient.id}`}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              {patient.first_name} {patient.last_name}
            </Link>
            <p className="text-xs text-gray-500">{patient.email}</p>
          </div>
        </div>
      )}

      {/* Contents Summary */}
      <div className="mb-4 flex flex-wrap gap-2">
        {record.trackers?.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FileText className="size-3" />
            <span>{record.trackers.length} Vital(s)</span>
          </div>
        )}
        {record.notes?.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FileText className="size-3" />
            <span>{record.notes.length} Note(s)</span>
          </div>
        )}
        {record.reports?.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FileText className="size-3" />
            <span>{record.reports.length} Report(s)</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Created by</span>
          <span className="text-sm font-medium text-gray-900">
            {record.creator.first_name} {record.creator.last_name}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="size-3" />
          <span>{formatDate(record.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

type HealthRecordsGridViewProps = {
  records: HealthRecordCardProps["record"][];
  onView?: (recordId: number) => void;
  onEdit?: (recordId: number) => void;
  onApprove?: (recordId: number) => void;
  onReject?: (recordId: number) => void;
  onArchive?: (recordId: number) => void;
};

export function HealthRecordsGridView({
  records,
  onView,
  onEdit,
  onApprove,
  onReject,
  onArchive,
}: HealthRecordsGridViewProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16">
        <SquarePen className="mb-4 size-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No health records found
        </h3>
        <p className="mb-6 text-center text-sm text-gray-500">
          Create a new health record to get started
        </p>
        <Button>
          <FileText className="mr-2 size-4" />
          Create Health Record
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <HealthRecordCard
          key={record.id}
          record={record}
          onView={onView}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
