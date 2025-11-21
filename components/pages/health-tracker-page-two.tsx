/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ChevronRight,
  EllipsisVertical,
  FileText,
  Search,
  SortDesc,
  Plus,
} from "lucide-react";
import * as React from "react";

import {
  getDisplayMetrics,
  getMetricConfig,
  groupMetricsByCategory,
  getCategoryDisplayName,
  type MetricCategory,
} from "@/lib/health-tracker-config";
import {
  calculateMetricTrend,
  type TrendData,
  type PeriodType,
} from "@/lib/health-tracker-trends";
import {
  getLatestMetrics,
  prepareChartData,
  parseHealthTrackers,
  type HealthTracker,
  type MetricCode,
} from "@/lib/health-tracker-utils";
import { useGetLastTracker } from "@/lib/queries/use-health-tracker-query";
import { cn, formatDate } from "@/lib/utils";

import { HealthVitalsChartTwo } from "../charts/health-vitals-chart-two";
import { HealthOverviewWidget } from "../shared/widget/health-overview-widget";
import { HealthTrackerColumn } from "../table/columns/health-tracker-reports";
import { DataTable } from "../table/data-table";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Import utility functions and config

type HealthTrackerPageProps = {
  healthTrackers: HealthTracker[];
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

export const HealthTrackerPageTwo = ({
  healthTrackers,
  reports,
}: HealthTrackerPageProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<
    MetricCategory | "all"
  >("all");
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<PeriodType>("this-month");

  const { isPending, data: HealthTrackerResponse } = useGetLastTracker();

  // Parse health trackers to get available metrics
  const parsedTrackers = React.useMemo(
    () => parseHealthTrackers(healthTrackers),
    [healthTrackers]
  );

  // Get all unique metric codes that have data
  const availableMetricCodes = React.useMemo(() => {
    const codes = new Set<MetricCode>();
    for (const tracker of parsedTrackers) {
      for (const metric of tracker.metrics) {
        codes.add(metric.code as MetricCode);
      }
    }
    return Array.from(codes);
  }, [parsedTrackers]);

  // Get latest metrics using utility function
  const latestMetrics = React.useMemo(
    () => getLatestMetrics(healthTrackers),
    [healthTrackers]
  );

  // Get metrics to display in widgets (top 4 by priority)
  const displayMetricCodes = React.useMemo(
    () => getDisplayMetrics(availableMetricCodes, 4),
    [availableMetricCodes]
  );
  const metricTrends = React.useMemo(() => {
    const trends: Record<string, TrendData | null> = {};

    for (const code of displayMetricCodes) {
      trends[code] = calculateMetricTrend(healthTrackers, code, selectedPeriod);
    }

    return trends;
  }, [healthTrackers, displayMetricCodes, selectedPeriod]);

  // Get all metrics grouped by category for "All Metrics" view
  const groupedMetrics = React.useMemo(
    () => groupMetricsByCategory(availableMetricCodes),
    [availableMetricCodes]
  );

  // Prepare chart data using utility function
  const chartData = React.useMemo(
    () => prepareChartData(healthTrackers),
    [healthTrackers]
  );

  // Check if we have any health tracker data
  const hasHealthData = healthTrackers && healthTrackers.length > 0;
  // Handle period change for a specific metric
  const handleMetricPeriodChange = (metricCode: MetricCode, period: string) => {
    setSelectedPeriod(period as PeriodType);
  };
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
            <TabsTrigger
              value="overview"
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer rounded-none text-sm font-normal text-[#b6b6b6] data-[state=active]:!border-b data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 data-[state=active]:shadow-none md:text-base"
              value="all-metrics"
            >
              All Metrics
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

          {/* OVERVIEW TAB */}
          <TabsContent
            value="overview"
            className="mt-2 w-full !max-w-full space-y-5 bg-white"
          >
            {/* Health Metrics Overview Widgets - Show top 4 priority metrics */}
            <section className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
              {isPending ? (
                <>
                  <Skeleton className="h-[150px]" />
                  <Skeleton className="h-[150px]" />
                  <Skeleton className="h-[150px]" />
                  <Skeleton className="h-[150px]" />
                </>
              ) : hasHealthData && displayMetricCodes.length > 0 ? (
                displayMetricCodes.map((code) => {
                  const config = getMetricConfig(code);
                  const latestValue = latestMetrics[code];
                  const trend = metricTrends[code];

                  return (
                    <HealthOverviewWidget
                      key={code}
                      title={latestValue?.value ?? "N/A"}
                      category={config?.name ?? code}
                      showStat
                      trend={trend}
                      onPeriodChange={(period) =>
                        handleMetricPeriodChange(code, period)
                      }
                    />
                  );
                })
              ) : (
                <Card className="col-span-4 border border-[#F0F2F5] bg-white shadow-none">
                  <CardHeader>
                    <CardTitle className="text-xs font-medium text-[#71717A] md:text-sm">
                      Health Trackers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground flex h-40 items-center justify-center">
                    No health tracker data available.
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Health Vitals Chart */}
            <section>
              <HealthVitalsChartTwo data={chartData} />
            </section>

            {/* Recent Reports and Caregiver Notes */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Recent Reports Card */}
              <div className="rounded-md border border-[#E8E8E8] bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#71717a]">
                    Recent reports
                  </span>
                  <span className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[#7f7f7f] hover:text-blue-600">
                    View all <ChevronRight className="size-4" />
                  </span>
                </div>
                <div className="flex h-full flex-col justify-center">
                  {reports?.length > 0 ? (
                    reports.slice(0, 3).map((report, index) => (
                      <div
                        key={report.id}
                        className={cn(
                          "mt-4 flex h-[54px] items-center justify-between border-b border-b-[#E8E8E8] pb-[12px]",
                          index === 2 ? "border-b-0" : ""
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
                        <EllipsisVertical className="size-5 cursor-pointer text-[#333333]" />
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

              {/* Caregiver Notes Card */}
              <div className="space-y-5 rounded-md border border-[#E8E8E8] bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#71717a]">
                    Caregiver notes
                  </span>
                  <span className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[#7f7f7f] hover:text-blue-600">
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
              </div>
            </section>
          </TabsContent>

          {/* ALL METRICS TAB */}
          <TabsContent
            value="all-metrics"
            className="mt-2 h-full w-full !max-w-full !bg-white"
          >
            <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#131B0B]">
                  All Health Metrics
                </h3>
                {/* <Button size="sm" className="gap-2">
                  <Plus className="size-4" /> Add Metric
                </Button> */}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                {Object.entries(groupedMetrics).map(([category, metrics]) => {
                  if (metrics.length === 0) return null;
                  return (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedCategory(category as MetricCategory)
                      }
                    >
                      {getCategoryDisplayName(category as MetricCategory)} (
                      {metrics.length})
                    </Button>
                  );
                })}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {selectedCategory === "all"
                  ? availableMetricCodes.map((code) => {
                      const config = getMetricConfig(code);
                      const latestValue = latestMetrics[code];
                      const trend = metricTrends[code];

                      return (
                        <HealthOverviewWidget
                          key={code}
                          title={latestValue?.value ?? "N/A"}
                          category={config?.name ?? code}
                          showStat
                          trend={trend}
                          onPeriodChange={(period) =>
                            handleMetricPeriodChange(code, period)
                          }
                        />
                      );
                    })
                  : groupedMetrics[selectedCategory]?.map((code) => {
                      const config = getMetricConfig(code);
                      const latestValue = latestMetrics[code];
                      const trend = metricTrends[code];

                      return (
                        <HealthOverviewWidget
                          key={code}
                          title={latestValue?.value ?? "N/A"}
                          category={config?.name ?? code}
                          showStat
                          trend={trend}
                          onPeriodChange={(period) =>
                            handleMetricPeriodChange(code, period)
                          }
                        />
                      );
                    })}
              </div>

              {availableMetricCodes.length === 0 && (
                <div className="flex h-40 items-center justify-center text-sm text-[#7f7f7f]">
                  No metrics recorded yet.
                </div>
              )}
            </div>
          </TabsContent>

          {/* RECENT REPORTS TAB */}
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

          {/* CAREGIVER NOTES TAB */}
          <TabsContent
            value="caregiver-notes"
            className="mt-2 h-full w-full !max-w-full !bg-white"
          >
            <div className="space-y-4 rounded-md border border-[#E8E8E8] bg-white p-6">
              <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex w-full items-center justify-between space-x-4">
                  <div className="flex items-center space-x-5">
                    <span className="text-base font-medium text-[#71717A]">
                      Caregiver notes
                    </span>
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
                      placeholder="Search notes..."
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
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
};
