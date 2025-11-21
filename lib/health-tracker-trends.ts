// health-tracker-trends.ts
import {
  type HealthTracker,
  type MetricCode,
  extractNumericValue,
  getMetricByCode,
  parseHealthTrackers,
} from "./health-tracker-utils";

export type TrendData = {
  value: number; // Percentage change
  direction: "up" | "down" | "stable";
  period: string;
  isGood?: boolean; // Whether the trend direction is clinically good
};

export type PeriodType =
  | "this-week"
  | "this-month"
  | "last-month"
  | "last-3-months";

/**
 * Calculate percentage change between two values
 */
function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get date range for a given period
 */
function getDateRange(period: PeriodType): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case "this-week":
      start.setDate(now.getDate() - 7);
      return { start, end: now };

    case "this-month":
      start.setDate(1); // First day of current month
      return { start, end: now };

    case "last-month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: lastMonth, end: lastMonthEnd };
    }

    case "last-3-months":
      start.setMonth(now.getMonth() - 3);
      return { start, end: now };
  }
}

/**
 * Filter trackers by date range
 */
function filterTrackersByDateRange(
  trackers: HealthTracker[],
  start: Date,
  end: Date
): HealthTracker[] {
  return trackers.filter((tracker) => {
    const date = new Date(tracker.created_at);
    return date >= start && date <= end;
  });
}

/**
 * Get average value for a metric in a period
 */
function getAverageMetricValue(
  trackers: HealthTracker[],
  metricCode: MetricCode
): number | null {
  const parsed = parseHealthTrackers(trackers);
  const values: number[] = [];

  for (const tracker of parsed) {
    const metricValue = getMetricByCode(tracker, metricCode);
    if (metricValue) {
      const numeric = extractNumericValue(metricValue);

      // For blood pressure, use systolic (first value)
      if (Array.isArray(numeric)) {
        values.push(numeric[0]);
      } else {
        values.push(numeric);
      }
    }
  }

  if (values.length === 0) return null;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Determine if trend direction is clinically good
 * Some metrics are better when they go up, some when they go down
 */
function isTrendGood(
  metricCode: MetricCode,
  direction: "up" | "down" | "stable"
): boolean {
  // Metrics where LOWER is better
  const lowerIsBetter: MetricCode[] = [
    "blood_pressure",
    "blood_glucose_fasting",
    "blood_glucose_random",
    "hba1c",
    "cholesterol_total",
    "cholesterol_ldl",
    "triglycerides",
    "creatinine",
    "bun",
    "alt",
    "ast",
    "bilirubin",
    "tsh",
    "crp",
    "esr",
  ];

  // Metrics where HIGHER is better
  const higherIsBetter: MetricCode[] = [
    "cholesterol_hdl",
    "egfr",
    "hemoglobin",
    "hematocrit",
    "oxygen_saturation",
    "peak_flow",
    "vitamin_d",
  ];

  // Metrics where stable is best (weight can be either way depending on goals)
  const stableIsBest: MetricCode[] = [
    "weight",
    "bmi",
    "heart_rate",
    "pulse",
    "temperature",
    "sodium",
    "potassium",
    "chloride",
    "calcium",
  ];

  if (direction === "stable") return true;

  if (lowerIsBetter.includes(metricCode)) {
    return direction === "down";
  }

  if (higherIsBetter.includes(metricCode)) {
    return direction === "up";
  }

  // For stable-is-best metrics, any change is not ideal
  if (stableIsBest.includes(metricCode)) {
    return false;
  }

  // Default: assume higher is better for unknown metrics
  return direction === "up";
}

/**
 * Calculate trend for a specific metric over a period
 */
export function calculateMetricTrend(
  trackers: HealthTracker[],
  metricCode: MetricCode,
  period: PeriodType
): TrendData | null {
  if (!trackers || trackers.length === 0) return null;

  const { start, end } = getDateRange(period);

  // Get trackers in the period
  const periodTrackers = filterTrackersByDateRange(trackers, start, end);

  if (periodTrackers.length < 2) return null; // Need at least 2 data points

  // Sort by date
  const sorted = [...periodTrackers].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Get first half and second half averages
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint);
  const secondHalf = sorted.slice(midpoint);

  const firstAvg = getAverageMetricValue(firstHalf, metricCode);
  const secondAvg = getAverageMetricValue(secondHalf, metricCode);

  if (firstAvg === null || secondAvg === null) return null;

  // Calculate percentage change
  const percentageChange = calculatePercentageChange(firstAvg, secondAvg);

  // Determine direction (consider <1% as stable)
  let direction: "up" | "down" | "stable";
  if (Math.abs(percentageChange) < 1) {
    direction = "stable";
  } else {
    direction = percentageChange > 0 ? "up" : "down";
  }

  // Determine if trend is clinically good
  const isGood = isTrendGood(metricCode, direction);

  // Format period name
  const periodNames: Record<PeriodType, string> = {
    "this-week": "This Week",
    "this-month": "This Month",
    "last-month": "Last Month",
    "last-3-months": "Last 3 Months",
  };

  return {
    value: Math.abs(percentageChange),
    direction,
    period: periodNames[period],
    isGood,
  };
}

/**
 * Calculate trends for all available metrics
 */
export function calculateAllMetricTrends(
  trackers: HealthTracker[],
  metricCodes: MetricCode[],
  period: PeriodType
): Record<MetricCode, TrendData | null> {
  const trends: Record<string, TrendData | null> = {};

  for (const code of metricCodes) {
    trends[code] = calculateMetricTrend(trackers, code, period);
  }

  return trends as Record<MetricCode, TrendData | null>;
}

/**
 * Get the latest value and previous value for comparison
 */
export function getMetricComparison(
  trackers: HealthTracker[],
  metricCode: MetricCode
): {
  latest: number | null;
  previous: number | null;
  change: number | null;
  percentageChange: number | null;
} {
  if (!trackers || trackers.length < 2) {
    return {
      latest: null,
      previous: null,
      change: null,
      percentageChange: null,
    };
  }

  // Sort by date descending
  const sorted = [...trackers].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const parsed = parseHealthTrackers(sorted);

  // Find latest value
  let latest: number | null = null;
  let latestIndex = -1;

  for (let i = 0; i < parsed.length; i++) {
    const value = getMetricByCode(parsed[i], metricCode);
    if (value) {
      const numeric = extractNumericValue(value);
      latest = Array.isArray(numeric) ? numeric[0] : numeric;
      latestIndex = i;
      break;
    }
  }

  // Find previous value
  let previous: number | null = null;

  for (let i = latestIndex + 1; i < parsed.length; i++) {
    const value = getMetricByCode(parsed[i], metricCode);
    if (value) {
      const numeric = extractNumericValue(value);
      previous = Array.isArray(numeric) ? numeric[0] : numeric;
      break;
    }
  }

  if (latest === null || previous === null) {
    return { latest, previous, change: null, percentageChange: null };
  }

  const change = latest - previous;
  const percentageChange = calculatePercentageChange(previous, latest);

  return { latest, previous, change, percentageChange };
}

/**
 * Format trend for display
 */
export function formatTrend(trend: TrendData | null): string {
  if (!trend) return "No trend data";

  if (trend.direction === "stable") {
    return "Stable";
  }

  const sign = trend.direction === "up" ? "+" : "-";
  return `${sign}${trend.value.toFixed(1)}%`;
}

/**
 * Get trend color class for UI
 */
export function getTrendColor(trend: TrendData | null): string {
  if (!trend || trend.direction === "stable") return "text-gray-600";

  if (trend.isGood) {
    return "text-green-600";
  } else {
    return "text-red-600";
  }
}

/**
 * Simple trend calculation for last reading vs previous reading
 */
export function calculateSimpleTrend(
  trackers: HealthTracker[],
  metricCode: MetricCode
): TrendData | null {
  const comparison = getMetricComparison(trackers, metricCode);

  if (comparison.percentageChange === null) return null;

  let direction: "up" | "down" | "stable";
  const absChange = Math.abs(comparison.percentageChange);

  if (absChange < 1) {
    direction = "stable";
  } else {
    direction = comparison.percentageChange > 0 ? "up" : "down";
  }

  return {
    value: absChange,
    direction,
    period: "vs. previous",
    isGood: isTrendGood(metricCode, direction),
  };
}
