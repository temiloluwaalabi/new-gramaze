"use client";
import {
  ChevronRight,
  EllipsisVertical,
  FileText,
  Search,
  SortDesc,
} from "lucide-react";
import * as React from "react";

import { useGetLastTracker } from "@/lib/queries/use-health-tracker-query";
import { cn, formatDate } from "@/lib/utils";

import { HealthVitalsChart } from "../charts/health-vitals-chart";
import { HealthOverviewWidget } from "../shared/widget/health-overview-widget";
import { HealthTrackerColumn } from "../table/columns/health-tracker-reports";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
type Tracker = {
  id: number;
  blood_glucose: string | null;
  blood_pressure: string | null;
  weight: string | null;
  pulse: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  caregiver_id: string;
};

type Vital = {
  value: string;
  updated_at: string;
  id: number;
};

type LatestVitals = {
  blood_pressure: Vital | null;
  blood_glucose: Vital | null;
  pulse: Vital | null;
  weight: Vital | null;
};
type HealthTrackerPageProps = {
  healthTrackers: {
    id: number;
    blood_glucose: string;
    blood_pressure: string;
    weight: string;
    pulse: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    caregiver_id: string;
  }[];
  reports: {
    id: number;
    report_name: string;
    report_file: string;
    user_id: string;
    caregiver_id: string;
    created_at: string;
    updated_at: string;
  }[];
};
export const HealthTrackerPage = ({
  healthTrackers,
  reports,
}: HealthTrackerPageProps) => {
  const data = healthTrackers.map((tracker) => {
    // blood_pressure is in "systolic/diastolic" format, e.g., "120/80"
    const [systolicStr, diastolicStr] = (tracker.blood_pressure ?? "0/0").split(
      "/"
    );
    const systolic = Number(systolicStr);
    const diastolic = Number(diastolicStr);

    return {
      name: new Date(tracker.created_at).toLocaleDateString(),
      bodyWeight: Number(tracker.weight),
      bloodPressure: {
        systolic,
        diastolic,
      },
    };
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isPending, data: HealthTracker } = useGetLastTracker();

  const getLatestVitals = (trackers?: Tracker[]): LatestVitals | null => {
    if (!trackers?.length) return null;

    const sorted = [...trackers].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const latest: LatestVitals = {
      blood_pressure: null,
      blood_glucose: null,
      pulse: null,
      weight: null,
    };

    for (const t of sorted) {
      for (const key of [
        "blood_pressure",
        "blood_glucose",
        "pulse",
        "weight",
      ] as const) {
        if (!latest[key] && t[key]) {
          latest[key] = {
            value: t[key]!,
            updated_at: t.updated_at,
            id: t.id,
          };
        }
      }
      if (Object.values(latest).every(Boolean)) break;
    }

    return latest;
  };

  const latestVitals = getLatestVitals(healthTrackers);

  console.log("HEALTH TRACKER", HealthTracker);
  return (
    <section className="space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <section>
        <h2 className="text-2xl font-medium text-[#131B0B]">Health tracker</h2>
        <p className="text-xs font-semibold text-[#7f7f7f]">
          Monitor health status in real time
        </p>
      </section>
      <section className="mt-4 flex w-full gap-5">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="custom-scrollbar mb-2 flex h-auto w-fit items-start justify-start gap-3 overflow-hidden overflow-x-scroll rounded-none border-[#F0F2F5] bg-transparent p-0 lg:mb-4">
            {" "}
            <TabsTrigger
              value="overview"
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="recent-reports"
            >
              Recent reports
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="caregiver-notes"
            >
              Caregiver notes
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="overview"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            <section className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
              {isPending ? (
                <>
                  <Skeleton className="h-[150px]" />
                  <Skeleton className="h-[150px]" />
                  <Skeleton className="h-[150px]" />
                  <Skeleton className="h-[150px]" />
                </>
              ) : HealthTracker?.health_tracker.blood_glucose ? (
                <>
                  <HealthOverviewWidget
                    title={latestVitals?.blood_glucose?.value ?? "0"}
                    category="Blood Glucose"
                    showStat
                  />
                  <HealthOverviewWidget
                    title={latestVitals?.blood_pressure?.value ?? "0"}
                    category="Blood Pressure"
                    showStat
                  />
                  <HealthOverviewWidget
                    title={`${latestVitals?.weight?.value ?? "0"}kg`}
                    category="Weight"
                    showStat
                  />
                  <HealthOverviewWidget
                    title={`${latestVitals?.pulse?.value ?? "0"}bpm`}
                    category="Pulse"
                    showStat
                  />
                </>
              ) : (
                <div className="col-span-4 flex h-24 items-center justify-center text-sm text-[#7f7f7f]">
                  No health tracker data available.
                </div>
              )}
            </section>
            <section>
              <HealthVitalsChart data={data} />
            </section>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md border border-[#E8E8E8] bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#71717a]">
                    Recent reports
                  </span>
                  <span className="flex items-center gap-2 text-sm font-normal text-[#7f7f7f]">
                    View all <ChevronRight className="size-4" />
                  </span>
                </div>
                <div className="flex h-full flex-col justify-center">
                  {reports?.length > 0 ? (
                    reports?.map((report, index) => (
                      <div
                        key={report.id}
                        className={cn(
                          "mt-4 flex h-[54px] items-center justify-between border-b border-b-[#E8E8E8] pb-[12px]",
                          index === reports.length - 1 ? "border-b-0" : ""
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="size-6 text-[#222222]" />
                          <div>
                            <h6 className="text-sm font-semibold text-[#333]">
                              {report.report_name}
                            </h6>
                            <p className="text-xs font-normal text-[#66666B]">
                              {formatDate(
                                new Date(report.created_at).toLocaleDateString()
                              )}
                            </p>
                          </div>
                        </div>
                        <EllipsisVertical className="size-5 text-[#333333]" />
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center py-8 text-center text-[#7f7f7f]">
                      <FileText className="mb-2 size-8 text-[#E8E8E8]" />
                      <span className="text-sm font-medium">
                        No reports found
                      </span>
                      <span className="mt-1 text-xs text-[#b6b6b6]">
                        You have no recent reports yet.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-5 rounded-md border border-[#E8E8E8] bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#71717a]">
                    Caregiver notes
                  </span>
                  <span className="flex items-center gap-2 text-sm font-normal text-[#7f7f7f]">
                    View all <ChevronRight className="size-4" />
                  </span>
                </div>
                <div className="flex h-full flex-col items-center justify-center py-8 text-center text-[#7f7f7f]">
                  <FileText className="mb-2 size-8 text-[#E8E8E8]" />
                  <span className="text-sm font-medium">
                    No caregiver notes found
                  </span>
                  <span className="mt-1 text-xs text-[#b6b6b6]">
                    You have no caregiver note yet.
                  </span>
                </div>
                {/* <div className="space-y-4">
                  <div>
                    <div className="space-y-1">
                      <HealthTrackerInfoSheet
                        sheetTrigger={
                          <h2 className="text-base font-semibold text-[#333]">
                            Blood pressure & diet advice
                          </h2>
                        }
                      />
                      <p className="text-sm font-normal text-[#66666b]">
                        Blood pressure readings have been consistent. Maintain
                        your current diet and monitor sodium intake. Slight
                        improvement in mobility...
                      </p>
                    </div>
                    <span className="mt-4 flex items-center gap-2">
                      <span className="text-sm font-medium text-[#333]">
                        Dr. Adebayo O.
                      </span>
                      <span className="text-sm font-normal text-[#AFAFAF]">
                        18 Febraury 2025.
                      </span>
                    </span>
                  </div>
                  <Separator className="bg-[#E8E8E8]" />
                  <div>
                    <div className="space-y-1">
                      <HealthTrackerInfoSheet
                        sheetTrigger={
                          <h2 className="text-base font-semibold text-[#333]">
                            Joint pain management{" "}
                          </h2>
                        }
                      />
                      <p className="text-sm font-normal text-[#66666b]">
                        Patient reported mild joint pain in the morning.
                        Suggested warm compress and light stretching. No
                        critical concerns...
                      </p>
                    </div>
                    <span className="mt-4 flex items-center gap-2">
                      <span className="text-sm font-medium text-[#333]">
                        Nurse Sarah L.
                      </span>
                      <span className="text-sm font-normal text-[#AFAFAF]">
                        10 January 2025.
                      </span>
                    </span>
                  </div>
                </div> */}
              </div>
            </section>
          </TabsContent>
          <TabsContent
            value="recent-reports"
            className="mt-2 h-full w-full !max-w-full !bg-white"
          >
            <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
              <DataTable
                columns={HealthTrackerColumn}
                newToolbar={{
                  show: true,
                  tableTitle: "Recent reports",
                  search: [
                    {
                      columnKey: "name",
                      placeholder: "Search report...",
                    },
                  ],
                }}
                tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
                data={reports}
              />
            </div>
          </TabsContent>
          <TabsContent
            value="caregiver-notes"
            className="mt-2 h-full w-full !max-w-full !bg-white"
          >
            <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex w-full items-center justify-between space-x-4">
                  <div className="flex items-center space-x-5">
                    <span className="text-base font-medium text-[#71717A]">
                      {" "}
                      Caregiver notes
                    </span>{" "}
                  </div>

                  <Button
                    className="!h-[40px] bg-transparent"
                    variant="outline"
                  >
                    <SortDesc /> Sort by
                  </Button>
                </div>

                <div className="flex w-full items-center space-x-2">
                  <div className="relative w-full">
                    <Search className="absolute top-2.5 left-2 size-4 text-gray-400" />
                    <Input
                      placeholder="Search client..."
                      className="h-[40px] w-full pl-8 lg:w-[296px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex h-full flex-col items-center justify-center py-8 text-center text-[#7f7f7f]">
                <FileText className="mb-2 size-8 text-[#E8E8E8]" />
                <span className="text-sm font-medium">
                  No caregiver notes found
                </span>
                <span className="mt-1 text-xs text-[#b6b6b6]">
                  You have no caregiver note yet.
                </span>
              </div>
              {/* <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4 rounded-md border border-[#E8E8E8] p-4">
                  <div className="space-y-1 border-b border-b-[#E8E8E8] pb-[12px]">
                    <HealthTrackerInfoSheet
                      sheetTrigger={
                        <h2 className="text-base font-semibold text-[#333]">
                          Blood pressure & diet advice
                        </h2>
                      }
                    />
                    <p className="text-sm font-normal text-[#66666b]">
                      Blood pressure readings have been consistent. Maintain
                      your current diet and monitor sodium intake. Slight
                      improvement in mobility...
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-medium text-[#333]">
                      Dr. Adebayo O.
                    </span>
                    <span className="text-sm font-normal text-[#AFAFAF]">
                      18 Febraury 2025.
                    </span>
                  </span>
                </div>
                <div className="space-y-4 rounded-md border border-[#E8E8E8] p-4">
                  <div className="space-y-1 border-b border-b-[#E8E8E8] pb-[12px]">
                    <HealthTrackerInfoSheet
                      sheetTrigger={
                        <h2 className="text-base font-semibold text-[#333]">
                          Blood pressure & diet advice
                        </h2>
                      }
                    />
                    <p className="text-sm font-normal text-[#66666b]">
                      Blood pressure readings have been consistent. Maintain
                      your current diet and monitor sodium intake. Slight
                      improvement in mobility...
                    </p>
                  </div>
                  <span className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-medium text-[#333]">
                      Dr. Adebayo O.
                    </span>
                    <span className="text-sm font-normal text-[#AFAFAF]">
                      18 Febraury 2025.
                    </span>
                  </span>
                </div>
              </div> */}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
};
