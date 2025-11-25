"use client";

import { List, Grid3x3 } from "lucide-react";
import React, { useState } from "react";

import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HealthRecordRow } from "@/types";

import { HealthRecordsGridView } from "../shared/health-record/health-record-grid";
import { HealthRecordsColumn } from "../table/columns/health-record-column";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";

type CaregiverHealthRecordsPageProps = {
  healthRecords: HealthRecordRow[];
};

export default function CaregiverHealthRecordsPage({
  healthRecords,
}: CaregiverHealthRecordsPageProps) {
  const uniqueAppointmentStatus = [
    ...new Set(healthRecords.map((item) => item.status)),
  ].map((type) => ({
    name: type || "",
    value: type || "",
  }));
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>("all");

  // Filter records based on selected filters
  const filteredRecords = React.useMemo(() => {
    return healthRecords.filter((record) => {
      const statusMatch =
        statusFilter === "all" || record.status === statusFilter;
      const typeMatch =
        recordTypeFilter === "all" || record.record_type === recordTypeFilter;
      return statusMatch && typeMatch;
    });
  }, [healthRecords, statusFilter, recordTypeFilter]);

  // Stats calculations
  const stats = React.useMemo(() => {
    return {
      total: healthRecords.length,
      pending: healthRecords.filter((r) => r.status === "pending").length,
      approved: healthRecords.filter((r) => r.status === "approved").length,
      rejected: healthRecords.filter((r) => r.status === "rejected").length,
    };
  }, [healthRecords]);

  return (
    <section className="h-full gap-6 space-y-6 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      {/* Header Section */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Health Records Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all patient health records
            </p>
          </div>
          {/* <Button className="w-fit">
            <Plus className="mr-2 size-4" />
            Create Health Record
          </Button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Records
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <List className="size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="mt-1 text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <List className="size-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <List className="size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <List className="size-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-lg bg-white p-6">
        {/* Filters and View Toggle */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Record Type Filter */}
            <Select
              value={recordTypeFilter}
              onValueChange={setRecordTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_result">Lab Result</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-gray-600">
              Showing {filteredRecords.length} of {healthRecords.length} records
            </span>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="!h-fit gap-2 !py-2"
            >
              <Grid3x3 className="size-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="!h-fit gap-2 !py-2"
            >
              <List className="size-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
        </div>

        {/* Content Views */}
        {viewMode === "grid" ? (
          <HealthRecordsGridView
            records={filteredRecords}
            onView={() => {}}
            onEdit={() => {}}
            onApprove={() => {}}
            onReject={() => {}}
            onArchive={() => {}}
          />
        ) : (
          <DataTable
            columns={HealthRecordsColumn}
            data={filteredRecords}
            newToolbar={{
              show: true,
              tableTitle: "Health Records",
              search: [
                {
                  columnKey: "patient",
                  placeholder: "Search Patient...",
                },
              ],
              filters: [
                {
                  columnKey: "status",
                  title: "Status",
                  options: uniqueAppointmentStatus,
                },
              ],
            }}
            tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
          />
        )}
      </div>

      {/* Archive Section */}
      <div className="rounded-lg bg-white p-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">Active Records</TabsTrigger>
            <TabsTrigger value="archived">Archived Records</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <p className="text-sm text-gray-500">
              Active records are displayed above
            </p>
          </TabsContent>

          <TabsContent value="archived" className="mt-6">
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12">
              <List className="mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No archived records
              </h3>
              <p className="text-center text-sm text-gray-500">
                Archived records will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
