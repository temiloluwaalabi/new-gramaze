import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, FileText, ShipWheelIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { REPORT_TYPE_CONFIGS } from "@/lib/health-record-types";
import { formatDate, initialsFromName } from "@/lib/utils";
import { HealthRecordRow } from "@/types";

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: {
      label: "Pending Review",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    approved: {
      label: "Approved",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`${config.className} capitalize`}>
      {config.label}
    </Badge>
  );
};
export const HealthRecordsColumn: ColumnDef<HealthRecordRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="data-[state=checked]:bg-primary dark:border-light-400 mr-4 size-[18px] rounded-[5px] border-[#CAD2D6] data-[state=checked]:text-white lg:mr-0 xl:ml-0"
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select All"
      />
    ),
    cell: ({ row }) => (
      <div className="flex w-fit items-center justify-center">
        <Checkbox
          className="data-[state=checked]:bg-primary dark:border-light-400 size-[18px] rounded-[5px] border-[#CAD2D6] data-[state=checked]:text-white xl:mx-0"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    id: "title",
    header: "Record Title",
    cell: ({ row }) => {
      const record = row.original;
      const config =
        REPORT_TYPE_CONFIGS["prescription" as keyof typeof REPORT_TYPE_CONFIGS];

      return (
        <div className="flex items-start space-x-3">
          <div
            className={`flex size-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500`}
          >
            <ShipWheelIcon />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/caregiver/health-records/${record.id}`}
              className="line-clamp-1 max-w-[300px] text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              {record.title}
            </Link>
            <span className="text-xs text-gray-500">
              {config.label} • ID: {record.id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const record = row.original;
      const patient = record.patient;

      if (!patient) {
        return <span className="text-sm text-gray-400">Patient not found</span>;
      }

      const initials = initialsFromName(
        `${patient.first_name} ${patient.last_name}`
      );

      return (
        <div className="flex items-center space-x-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
            {initials}
          </div>
          <div className="flex flex-col">
            <Link
              href={`/caregiver/patients/${patient.id}`}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-blue-600"
            >
              {patient.first_name} {patient.last_name}
            </Link>
            <span className="text-xs text-gray-500">{patient.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "contents",
    header: "Contents",
    cell: ({ row }) => {
      const record = row.original;
      const hasTrackers = record.trackers?.length > 0;
      const hasNotes = record.notes?.length > 0;
      const hasReports = record.reports?.length > 0;

      return (
        <div className="flex flex-wrap gap-2">
          {hasTrackers && (
            <Badge variant="secondary" className="text-xs">
              {record.trackers.length} Vital(s)
            </Badge>
          )}
          {hasNotes && (
            <Badge variant="secondary" className="text-xs">
              {record.notes.length} Note(s)
            </Badge>
          )}
          {hasReports && (
            <Badge variant="secondary" className="text-xs">
              {record.reports.length} Report(s)
            </Badge>
          )}
          {!hasTrackers && !hasNotes && !hasReports && (
            <span className="text-xs text-gray-400">No content</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return getStatusBadge(row.original.status);
    },
  },
  {
    id: "created_by",
    header: "Created By",
    cell: ({ row }) => {
      const record = row.original;
      const creator = record.creator;

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {creator.first_name} {creator.last_name}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(record.created_at)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.updated_at)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                /* Handle view */
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                /* Handle edit */
              }}
            >
              Edit Record
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {record.status === "pending" && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    /* Handle approve */
                  }}
                  className="text-green-600"
                >
                  Approve Record
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    /* Handle reject */
                  }}
                  className="text-red-600"
                >
                  Reject Record
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                /* Handle archive */
              }}
              className="text-orange-600"
            >
              Archive Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
