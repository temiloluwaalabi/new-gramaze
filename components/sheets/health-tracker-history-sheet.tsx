import {
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  getMetricDisplayConfig,
  HealthTracker2,
} from "@/lib/health-tracker-utils";
import { formatDate } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

// Health Tracker History Sheet Component
export default function HealthTrackerHistorySheet({
  trackers,
  patientName,
}: {
  trackers: HealthTracker2[];
  metrics: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  }[];
  patientName: string;
}) {
  const [selectedMetric, setSelectedMetric] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [filteredTrackers, setFilteredTrackers] = useState(trackers);

  // Get unique metrics from all trackers
  const availableMetrics = React.useMemo(() => {
    const metricSet = new Set<string>();
    trackers.forEach((tracker) => {
      const parsedMetrics = tracker.metrics;
      parsedMetrics.forEach((metric) => {
        if (metric.name) metricSet.add(metric.name);
      });
    });
    return Array.from(metricSet);
  }, [trackers]);

  // Filter trackers based on selected metric and date range
  useEffect(() => {
    let filtered = [...trackers];

    // Filter by metric
    if (selectedMetric !== "all") {
      filtered = filtered.filter((tracker) => {
        const parsedMetrics = tracker.metrics;
        return parsedMetrics.some((m) => m.name === selectedMetric);
      });
    }

    // Filter by date range
    const now = new Date();
    if (dateRange !== "all") {
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
      filtered = filtered.filter(
        (tracker) => new Date(tracker.created_at) >= cutoffDate
      );
    }

    // Sort by date descending
    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setFilteredTrackers(filtered);
  }, [selectedMetric, dateRange, trackers]);

  // Calculate trend for a specific metric
  const calculateTrend = (metricCode: string) => {
    const metricValues = filteredTrackers
      .map((tracker) => {
        const parsedMetrics = tracker.metrics;
        const metric = parsedMetrics.find((m) => m.name === metricCode);
        return metric
          ? {
              value: parseFloat(metric.value),
              date: tracker.created_at,
            }
          : null;
      })
      .filter(Boolean);

    if (metricValues.length < 2) return null;

    const latest = metricValues[0]!.value;
    const previous = metricValues[1]!.value;
    const change = ((latest - previous) / previous) * 100;

    return {
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
      percentage: Math.abs(change).toFixed(1),
    };
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LineChart className="size-4" />
          View History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Health Tracker History</SheetTitle>
          <SheetDescription>
            Complete vital signs history for {patientName}
          </SheetDescription>
        </SheetHeader>
        <div className="p-6 !pt-0">
          {/* Filters */}
          <div className="my-4 space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-500" />
              <span className="text-sm font-medium">Filters</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Metric Filter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-600">Vital Sign</label>
                <Select
                  value={selectedMetric}
                  onValueChange={setSelectedMetric}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="All vitals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vitals</SelectItem>
                    {availableMetrics.map((metricCode) => {
                      const config = getMetricDisplayConfig(metricCode);
                      return (
                        <SelectItem
                          className="cursor-pointer"
                          key={metricCode}
                          value={metricCode}
                        >
                          {config.displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-xs text-gray-600">Time Period</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="all">
                      All Time
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="7">
                      Last 7 days
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="14">
                      Last 14 days
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="30">
                      Last 30 days
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="90">
                      Last 90 days
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Results Summary */}
          <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-3">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {filteredTrackers.length} record(s) found
              </span>
            </div>
            {selectedMetric !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedMetric("all");
                  setDateRange("all");
                }}
                className="h-auto p-1 text-xs text-blue-600"
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Tracker Timeline */}
          <div className="space-y-4">
            {filteredTrackers.length > 0 ? (
              filteredTrackers.map((tracker, index) => {
                const parsedMetrics = tracker.metrics;
                const displayMetrics =
                  selectedMetric === "all"
                    ? parsedMetrics
                    : parsedMetrics.filter((m) => m.name === selectedMetric);

                return (
                  <div
                    key={tracker.id}
                    className="relative rounded-lg border border-gray-200 bg-white p-4"
                  >
                    {/* Timeline connector */}
                    {index < filteredTrackers.length - 1 && (
                      <div className="absolute top-full left-6 h-4 w-0.5 bg-gray-200" />
                    )}

                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                          <Calendar className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(tracker.created_at)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(tracker.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {tracker.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="border-yellow-600 text-yellow-600"
                        >
                          <span className="mr-1 size-2 rounded-full bg-yellow-600" />
                          Pending
                        </Badge>
                      )}
                      {tracker.status === "approved" && (
                        <Badge
                          variant="outline"
                          className="border-green-600 text-green-600"
                        >
                          <CheckCircle2 className="mr-1 size-3" />
                          Approved
                        </Badge>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2">
                      {displayMetrics.map((metric) => {
                        console.log("METRIC", metric);
                        const config = getMetricDisplayConfig(metric.name!);
                        const trend = calculateTrend(metric.name!);

                        console.log("CONFIG", config);
                        return (
                          <div
                            key={metric.name}
                            className="flex items-center justify-between rounded-md bg-gray-50 p-3"
                          >
                            <div className="flex items-center gap-2">
                              <config.icon
                                className={`${config.iconColor} size-4`}
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {config.displayName}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                {metric.value}
                              </span>

                              {/* Trend Indicator */}
                              {trend && index < filteredTrackers.length - 1 && (
                                <div className="flex items-center gap-1">
                                  {trend.direction === "up" && (
                                    <TrendingUp className="size-3 text-red-500" />
                                  )}
                                  {trend.direction === "down" && (
                                    <TrendingDown className="size-3 text-green-500" />
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {trend.percentage}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reason if any */}
                    {tracker.reason && (
                      <div className="mt-3 rounded-md bg-amber-50 p-2">
                        <p className="text-xs text-amber-800">
                          <span className="font-medium">Note: </span>
                          {tracker.reason}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
                <FileText className="mb-2 size-12 text-gray-400" />
                <p className="text-sm font-medium text-gray-600">
                  No records found
                </p>
                <p className="text-xs text-gray-500">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>

          {/* Export Button */}
          {filteredTrackers.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <Button className="w-full gap-2" variant="outline">
                <Download className="size-4" />
                Export to CSV
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
