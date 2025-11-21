"use client";

import {
  FileText,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type HealthRecord,
  type RecordStatus,
  REPORT_TYPE_CONFIGS,
} from "@/lib/health-record-types";
import { formatDate } from "@/lib/utils";

interface HealthRecordsListProps {
  records: HealthRecord[];
  onViewRecord: (recordId: number) => void;
}

export function HealthRecordsList({
  records,
  onViewRecord,
}: HealthRecordsListProps) {
  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="border-green-600 bg-green-50 text-green-700"
          >
            <CheckCircle className="mr-1 size-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-600 bg-yellow-50 text-yellow-700"
          >
            <AlertCircle className="mr-1 size-3" />
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="border-red-600 bg-red-50 text-red-700"
          >
            <XCircle className="mr-1 size-3" />
            Rejected
          </Badge>
        );
    }
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed py-12">
        <FileText className="mb-3 size-12 text-gray-400" />
        <p className="text-base font-medium text-gray-600">
          No health records found
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Create a new health record to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const config = REPORT_TYPE_CONFIGS[record.record_type];

        return (
          <Card
            key={record.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => onViewRecord(record.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">
                    {record.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs">
                      {config.label}
                    </Badge>
                    {getStatusBadge(record.status)}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-2 text-sm text-gray-600">
                {record.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
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
                    <span>{record.health_tracker_ids.length} vital(s)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="size-3" />
                  <span>By {record.created_by_name || "Unknown"}</span>
                  <span className="capitalize">({record.created_by_role})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{formatDate(record.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
