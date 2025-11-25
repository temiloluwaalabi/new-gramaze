/* eslint-disable no-unused-vars */
// health-tracker-utils.ts

import { Dumbbell, Thermometer, Wind, Activity } from "lucide-react";
import React from "react";

import {
  LatestVitals,
  Tracker,
} from "@/components/pages/single-patient-details-page";
import BloodPressureIcon from "@/icons/blood-pressure";
import DropIcon from "@/icons/drop";
import HeartbeatIcon from "@/icons/heartbeat";

import { getMetricConfig, MetricCode } from "./health-tracker-config";
export type { MetricCode } from "./health-tracker-config";

export type Metric = {
  code: MetricCode;
  value: string;
  name?: string;
};

export type HealthTracker = {
  id: number;
  metrics: string; // JSON string from API
  user_id: number;
  caregiver_id: number;
  status: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
};

export type ParsedHealthTracker = Omit<HealthTracker, "metrics"> & {
  metrics: Metric[];
};

export type LatestMetrics = {
  [key in MetricCode]?: {
    value: string;
    updated_at: string;
    id: number;
  };
};

export type ChartDataPoint = {
  name: string; // date
  bodyWeight: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  pulse: number;
  temperature: number;
  bloodGlucose: number;
};

/**
 * Parse metrics JSON string safely
 */
export function parseMetrics(metricsString: string): Metric[] {
  try {
    const parsed = JSON.parse(metricsString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse metrics:", error);
    return [];
  }
}

/**
 * Parse all health trackers and their metrics
 */
export function parseHealthTrackers(
  trackers: HealthTracker[]
): ParsedHealthTracker[] {
  return trackers.map((tracker) => ({
    ...tracker,
    metrics: parseMetrics(tracker.metrics),
  }));
}

/**
 * Get the latest value for each metric type
 */
export function getLatestMetrics(trackers: HealthTracker[]): LatestMetrics {
  if (!trackers?.length) return {};

  // Sort by created_at descending (newest first)
  const sorted = [...trackers].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const latest: LatestMetrics = {};

  // Iterate through sorted trackers to find latest value for each metric
  for (const tracker of sorted) {
    const metrics = parseMetrics(tracker.metrics);

    for (const metric of metrics) {
      // Only set if we haven't found this metric yet (since sorted newest first)
      if (!latest[metric.code]) {
        latest[metric.code] = {
          value: metric.value,
          updated_at: tracker.updated_at,
          id: tracker.id,
        };
      }
    }
  }

  return latest;
}

/**
 * Extract numeric value from metric string
 * Examples: "76kg" -> 76, "112/56 mmHg" -> [112, 56], "35°C" -> 35
 */
export function extractNumericValue(value: string): number | number[] {
  // Remove all non-numeric characters except . and /
  const cleaned = value.replace(/[^\d./]/g, "");

  // Handle blood pressure (systolic/diastolic)
  if (cleaned.includes("/")) {
    const parts = cleaned.split("/");
    return parts.map((p) => Number(p) || 0);
  }

  // Handle single numeric value
  return Number(cleaned) || 0;
}

/**
 * Get metric value by code from a tracker
 */
export function getMetricByCode(
  tracker: ParsedHealthTracker,
  code: MetricCode
): string | null {
  const metric = tracker.metrics.find((m) => m.code === code);
  return metric?.value || null;
}

/**
 * Prepare chart data with carry-forward logic for missing values
 */
export function prepareChartData(trackers: HealthTracker[]): ChartDataPoint[] {
  if (!trackers?.length) return [];

  // Sort by created_at ascending for carry-forward
  const sorted = [...trackers].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const parsed = parseHealthTrackers(sorted);

  // Initialize carry-forward values
  let lastWeight = 0;
  let lastSystolic = 0;
  let lastDiastolic = 0;
  let lastPulse = 0;
  let lastTemperature = 0;
  let lastBloodGlucose = 0;

  return parsed.map((tracker) => {
    // Weight
    const weightValue = getMetricByCode(tracker, "weight");
    if (weightValue) {
      const numeric = extractNumericValue(weightValue);
      lastWeight = typeof numeric === "number" ? numeric : lastWeight;
    }

    // Blood Pressure
    const bpValue = getMetricByCode(tracker, "blood_pressure");
    if (bpValue) {
      const numeric = extractNumericValue(bpValue);
      if (Array.isArray(numeric)) {
        lastSystolic = numeric[0] || lastSystolic;
        lastDiastolic = numeric[1] || lastDiastolic;
      }
    }

    // Pulse
    const pulseValue = getMetricByCode(tracker, "pulse");
    if (pulseValue) {
      const numeric = extractNumericValue(pulseValue);
      lastPulse = typeof numeric === "number" ? numeric : lastPulse;
    }

    // Temperature
    const tempValue = getMetricByCode(tracker, "temperature");
    if (tempValue) {
      const numeric = extractNumericValue(tempValue);
      lastTemperature = typeof numeric === "number" ? numeric : lastTemperature;
    }

    // Blood Glucose
    const glucoseValue = getMetricByCode(tracker, "blood_glucose_fasting");
    if (glucoseValue) {
      const numeric = extractNumericValue(glucoseValue);
      lastBloodGlucose =
        typeof numeric === "number" ? numeric : lastBloodGlucose;
    }

    return {
      name: new Date(tracker.created_at).toLocaleDateString(),
      bodyWeight: lastWeight,
      bloodPressure: {
        systolic: lastSystolic,
        diastolic: lastDiastolic,
      },
      pulse: lastPulse,
      temperature: lastTemperature,
      bloodGlucose: lastBloodGlucose,
    };
  });
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: string): string {
  return value;
}

/**
 * Get metric display name
 */
export function getMetricDisplayName(code: MetricCode): string {
  const config = getMetricConfig(code);
  return config?.name || code;
}

/**
 * Group metrics by date
 */
export function groupMetricsByDate(
  trackers: HealthTracker[]
): Map<string, ParsedHealthTracker[]> {
  const grouped = new Map<string, ParsedHealthTracker[]>();

  const parsed = parseHealthTrackers(trackers);

  for (const tracker of parsed) {
    const date = new Date(tracker.created_at).toLocaleDateString();
    const existing = grouped.get(date) || [];
    grouped.set(date, [...existing, tracker]);
  }

  return grouped;
}
export const getMetricCodeFromName = (
  metricName: string,
  metrics: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  }[]
) => {
  const metric = metrics.find((m) => m.name === metricName);
  return metric?.code;
};

type MetricConfig = {
  displayName: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
};

export const getMetricDisplayConfig = (metricName: string): MetricConfig => {
  const config: Record<string, MetricConfig> = {
    // Cardiovascular
    "Blood Pressure": {
      displayName: "Blood Pressure",
      icon: BloodPressureIcon,
      iconColor: "text-[#BD17E5]",
    },
    "Heart Rate": {
      displayName: "Heart Rate",
      icon: HeartbeatIcon,
      iconColor: "text-[#2563EB]",
    },
    Pulse: {
      displayName: "Heart Rate",
      icon: HeartbeatIcon,
      iconColor: "text-[#2563EB]",
    },

    // Blood Sugar
    "Blood Glucose (Fasting)": {
      displayName: "Blood Glucose (Fasting)",
      icon: DropIcon,
      iconColor: "text-[#F83E30]",
    },
    "Blood Glucose (Random)": {
      displayName: "Blood Glucose (Random)",
      icon: DropIcon,
      iconColor: "text-[#F83E30]",
    },
    HbA1c: {
      displayName: "HbA1c",
      icon: DropIcon,
      iconColor: "text-[#F83E30]",
    },

    // Physical Measurements
    Weight: {
      displayName: "Weight",
      icon: Dumbbell,
      iconColor: "text-[#2563EB]",
    },
    BMI: {
      displayName: "BMI",
      icon: Dumbbell,
      iconColor: "text-[#2563EB]",
    },
    Temperature: {
      displayName: "Temperature",
      icon: Thermometer,
      iconColor: "text-[#F59E0B]",
    },

    // Respiratory
    "Respiration Rate": {
      displayName: "Respiration Rate",
      icon: Wind,
      iconColor: "text-[#10B981]",
    },
    "Oxygen Saturation": {
      displayName: "Oxygen Saturation",
      icon: Wind,
      iconColor: "text-[#10B981]",
    },
    "Peak Flow": {
      displayName: "Peak Flow",
      icon: Wind,
      iconColor: "text-[#10B981]",
    },

    // Cholesterol
    "Total Cholesterol": {
      displayName: "Total Cholesterol",
      icon: DropIcon,
      iconColor: "text-[#8B5CF6]",
    },
    "HDL Cholesterol": {
      displayName: "HDL Cholesterol",
      icon: DropIcon,
      iconColor: "text-[#10B981]",
    },
    "LDL Cholesterol": {
      displayName: "LDL Cholesterol",
      icon: DropIcon,
      iconColor: "text-[#EF4444]",
    },
    Triglycerides: {
      displayName: "Triglycerides",
      icon: DropIcon,
      iconColor: "text-[#F59E0B]",
    },

    // Default fallback
    default: {
      displayName: metricName,
      icon: Activity,
      iconColor: "text-[#6B7280]",
    },
  };

  return config[metricName] || config.default;
};
export const getLatestVitalsWithValues = (
  trackers?: Tracker[]
): LatestVitals | null => {
  if (!trackers?.length) return null;

  const sorted = [...trackers].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const latest: LatestVitals = {};

  for (const tracker of sorted) {
    // Process metrics array (using 'name' not 'code')
    tracker.metrics?.forEach((metric) => {
      if (metric.name && metric.value && !latest[metric.name]) {
        latest[metric.name] = {
          value: metric.value,
          name: metric.name,
          updated_at: tracker.updated_at,
          status: tracker.status,
          id: tracker.id,
        };
      }
    });
  }

  return Object.keys(latest).length > 0 ? latest : null;
};
