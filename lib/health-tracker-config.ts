// health-tracker-config.ts

/**
 * Metric priority configuration
 * Defines which metrics to display prominently and their display properties
 */

export type MetricCode =
  | "blood_pressure"
  | "blood_glucose_fasting"
  | "blood_glucose_random"
  | "weight"
  | "pulse"
  | "heart_rate"
  | "temperature"
  | "oxygen_saturation"
  | "respiration_rate"
  | "bmi"
  | "cholesterol_total"
  | "cholesterol_hdl"
  | "cholesterol_ldl"
  | "triglycerides"
  | "creatinine"
  | "egfr"
  | "bun"
  | "sodium"
  | "potassium"
  | "chloride"
  | "calcium"
  | "alt"
  | "ast"
  | "bilirubin"
  | "tsh"
  | "free_t4"
  | "vitamin_d"
  | "iron"
  | "ferritin"
  | "crp"
  | "esr"
  | "hemoglobin"
  | "hematocrit"
  | "platelets"
  | "peak_flow"
  | "hba1c";

export type MetricCategory =
  | "vital_signs"
  | "blood_sugar"
  | "cholesterol"
  | "kidney"
  | "liver"
  | "thyroid"
  | "blood_count"
  | "other";

export type MetricPriority = "primary" | "secondary" | "tertiary";

export type MetricConfig = {
  code: MetricCode;
  name: string;
  category: MetricCategory;
  priority: MetricPriority;
  unit?: string;
  description?: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  chartable: boolean; // Can this be displayed on a line chart?
  color?: string; // Chart line color
  icon?: string; // Icon to display
};

/**
 * Primary metrics - Always display if available
 * These are the core vitals that should be monitored regularly
 */
export const PRIMARY_METRICS: MetricCode[] = [
  "blood_pressure",
  "blood_glucose_fasting",
  "weight",
  "pulse",
];

/**
 * Secondary metrics - Display if no primary metrics available
 * or if user specifically tracks these
 */
export const SECONDARY_METRICS: MetricCode[] = [
  "temperature",
  "oxygen_saturation",
  "heart_rate",
  "blood_glucose_random",
  "bmi",
  "hba1c",
];

/**
 * Comprehensive metric configuration
 */
export const METRIC_CONFIGS: Record<MetricCode, MetricConfig> = {
  blood_pressure: {
    code: "blood_pressure",
    name: "Blood Pressure",
    category: "vital_signs",
    priority: "primary",
    unit: "mmHg",
    description: "Systolic/Diastolic blood pressure",
    normalRange: { min: 90, max: 120, unit: "mmHg (systolic)" },
    chartable: true,
    color: "#3B82F6",
  },

  blood_glucose_fasting: {
    code: "blood_glucose_fasting",
    name: "Blood Glucose (Fasting)",
    category: "blood_sugar",
    priority: "primary",
    unit: "mg/dL",
    description: "Fasting blood sugar level",
    normalRange: { min: 70, max: 100, unit: "mg/dL" },
    chartable: true,
    color: "#8B5CF6",
  },

  blood_glucose_random: {
    code: "blood_glucose_random",
    name: "Blood Glucose (Random)",
    category: "blood_sugar",
    priority: "secondary",
    unit: "mg/dL",
    description: "Random blood sugar level",
    normalRange: { min: 70, max: 140, unit: "mg/dL" },
    chartable: true,
    color: "#A78BFA",
  },

  weight: {
    code: "weight",
    name: "Weight",
    category: "vital_signs",
    priority: "primary",
    unit: "kg",
    description: "Body weight",
    chartable: true,
    color: "#F59E0B",
  },

  pulse: {
    code: "pulse",
    name: "Pulse",
    category: "vital_signs",
    priority: "primary",
    unit: "bpm",
    description: "Heart rate (pulse)",
    normalRange: { min: 60, max: 100, unit: "bpm" },
    chartable: true,
    color: "#10B981",
  },

  heart_rate: {
    code: "heart_rate",
    name: "Heart Rate",
    category: "vital_signs",
    priority: "secondary",
    unit: "bpm",
    description: "Heart rate",
    normalRange: { min: 60, max: 100, unit: "bpm" },
    chartable: true,
    color: "#10B981",
  },

  temperature: {
    code: "temperature",
    name: "Temperature",
    category: "vital_signs",
    priority: "secondary",
    unit: "°C",
    description: "Body temperature",
    normalRange: { min: 36.1, max: 37.2, unit: "°C" },
    chartable: true,
    color: "#EF4444",
  },

  oxygen_saturation: {
    code: "oxygen_saturation",
    name: "Oxygen Saturation",
    category: "vital_signs",
    priority: "secondary",
    unit: "%",
    description: "Blood oxygen level",
    normalRange: { min: 95, max: 100, unit: "%" },
    chartable: true,
    color: "#06B6D4",
  },

  respiration_rate: {
    code: "respiration_rate",
    name: "Respiration Rate",
    category: "vital_signs",
    priority: "secondary",
    unit: "breaths/min",
    description: "Breathing rate per minute",
    normalRange: { min: 12, max: 20, unit: "breaths/min" },
    chartable: true,
    color: "#14B8A6",
  },

  bmi: {
    code: "bmi",
    name: "BMI",
    category: "vital_signs",
    priority: "secondary",
    unit: "kg/m²",
    description: "Body Mass Index",
    normalRange: { min: 18.5, max: 24.9, unit: "kg/m²" },
    chartable: true,
    color: "#F97316",
  },

  hba1c: {
    code: "hba1c",
    name: "HbA1c",
    category: "blood_sugar",
    priority: "secondary",
    unit: "%",
    description: "Average blood sugar over 3 months",
    normalRange: { min: 4, max: 5.6, unit: "%" },
    chartable: true,
    color: "#9333EA",
  },

  cholesterol_total: {
    code: "cholesterol_total",
    name: "Total Cholesterol",
    category: "cholesterol",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Total cholesterol level",
    normalRange: { min: 0, max: 200, unit: "mg/dL" },
    chartable: true,
    color: "#EC4899",
  },

  cholesterol_hdl: {
    code: "cholesterol_hdl",
    name: "HDL Cholesterol",
    category: "cholesterol",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Good cholesterol",
    normalRange: { min: 40, max: 200, unit: "mg/dL" },
    chartable: true,
    color: "#10B981",
  },

  cholesterol_ldl: {
    code: "cholesterol_ldl",
    name: "LDL Cholesterol",
    category: "cholesterol",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Bad cholesterol",
    normalRange: { min: 0, max: 100, unit: "mg/dL" },
    chartable: true,
    color: "#F43F5E",
  },

  triglycerides: {
    code: "triglycerides",
    name: "Triglycerides",
    category: "cholesterol",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Blood fat level",
    normalRange: { min: 0, max: 150, unit: "mg/dL" },
    chartable: true,
    color: "#F59E0B",
  },

  creatinine: {
    code: "creatinine",
    name: "Creatinine",
    category: "kidney",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Kidney function marker",
    normalRange: { min: 0.6, max: 1.2, unit: "mg/dL" },
    chartable: true,
    color: "#8B5CF6",
  },

  egfr: {
    code: "egfr",
    name: "eGFR",
    category: "kidney",
    priority: "tertiary",
    unit: "mL/min/1.73m²",
    description: "Estimated kidney filtration rate",
    normalRange: { min: 90, max: 200, unit: "mL/min/1.73m²" },
    chartable: true,
    color: "#7C3AED",
  },

  bun: {
    code: "bun",
    name: "Blood Urea Nitrogen",
    category: "kidney",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Kidney function marker",
    normalRange: { min: 7, max: 20, unit: "mg/dL" },
    chartable: true,
    color: "#6366F1",
  },

  sodium: {
    code: "sodium",
    name: "Sodium",
    category: "kidney",
    priority: "tertiary",
    unit: "mEq/L",
    description: "Blood sodium level",
    normalRange: { min: 136, max: 145, unit: "mEq/L" },
    chartable: true,
    color: "#3B82F6",
  },

  potassium: {
    code: "potassium",
    name: "Potassium",
    category: "kidney",
    priority: "tertiary",
    unit: "mEq/L",
    description: "Blood potassium level",
    normalRange: { min: 3.5, max: 5.0, unit: "mEq/L" },
    chartable: true,
    color: "#14B8A6",
  },

  chloride: {
    code: "chloride",
    name: "Chloride",
    category: "kidney",
    priority: "tertiary",
    unit: "mEq/L",
    description: "Blood chloride level",
    normalRange: { min: 96, max: 106, unit: "mEq/L" },
    chartable: true,
    color: "#06B6D4",
  },

  calcium: {
    code: "calcium",
    name: "Calcium",
    category: "kidney",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Blood calcium level",
    normalRange: { min: 8.5, max: 10.2, unit: "mg/dL" },
    chartable: true,
    color: "#0EA5E9",
  },

  alt: {
    code: "alt",
    name: "ALT (SGPT)",
    category: "liver",
    priority: "tertiary",
    unit: "U/L",
    description: "Liver enzyme",
    normalRange: { min: 7, max: 56, unit: "U/L" },
    chartable: true,
    color: "#F97316",
  },

  ast: {
    code: "ast",
    name: "AST (SGOT)",
    category: "liver",
    priority: "tertiary",
    unit: "U/L",
    description: "Liver enzyme",
    normalRange: { min: 10, max: 40, unit: "U/L" },
    chartable: true,
    color: "#FB923C",
  },

  bilirubin: {
    code: "bilirubin",
    name: "Bilirubin",
    category: "liver",
    priority: "tertiary",
    unit: "mg/dL",
    description: "Liver function marker",
    normalRange: { min: 0.1, max: 1.2, unit: "mg/dL" },
    chartable: true,
    color: "#FBBF24",
  },

  tsh: {
    code: "tsh",
    name: "TSH",
    category: "thyroid",
    priority: "tertiary",
    unit: "mIU/L",
    description: "Thyroid stimulating hormone",
    normalRange: { min: 0.4, max: 4.0, unit: "mIU/L" },
    chartable: true,
    color: "#8B5CF6",
  },

  free_t4: {
    code: "free_t4",
    name: "Free T4",
    category: "thyroid",
    priority: "tertiary",
    unit: "ng/dL",
    description: "Thyroid hormone",
    normalRange: { min: 0.8, max: 1.8, unit: "ng/dL" },
    chartable: true,
    color: "#A78BFA",
  },

  vitamin_d: {
    code: "vitamin_d",
    name: "Vitamin D",
    category: "other",
    priority: "tertiary",
    unit: "ng/mL",
    description: "Vitamin D level",
    normalRange: { min: 30, max: 100, unit: "ng/mL" },
    chartable: true,
    color: "#FBBF24",
  },

  iron: {
    code: "iron",
    name: "Iron",
    category: "blood_count",
    priority: "tertiary",
    unit: "µg/dL",
    description: "Blood iron level",
    normalRange: { min: 60, max: 170, unit: "µg/dL" },
    chartable: true,
    color: "#DC2626",
  },

  ferritin: {
    code: "ferritin",
    name: "Ferritin",
    category: "blood_count",
    priority: "tertiary",
    unit: "ng/mL",
    description: "Iron storage protein",
    normalRange: { min: 12, max: 300, unit: "ng/mL" },
    chartable: true,
    color: "#EF4444",
  },

  crp: {
    code: "crp",
    name: "C-Reactive Protein (CRP)",
    category: "other",
    priority: "tertiary",
    unit: "mg/L",
    description: "Inflammation marker",
    normalRange: { min: 0, max: 3, unit: "mg/L" },
    chartable: true,
    color: "#F97316",
  },

  esr: {
    code: "esr",
    name: "ESR",
    category: "other",
    priority: "tertiary",
    unit: "mm/hr",
    description: "Inflammation marker",
    normalRange: { min: 0, max: 20, unit: "mm/hr" },
    chartable: true,
    color: "#FB923C",
  },

  hemoglobin: {
    code: "hemoglobin",
    name: "Hemoglobin",
    category: "blood_count",
    priority: "tertiary",
    unit: "g/dL",
    description: "Oxygen-carrying protein",
    normalRange: { min: 12, max: 16, unit: "g/dL" },
    chartable: true,
    color: "#DC2626",
  },

  hematocrit: {
    code: "hematocrit",
    name: "Hematocrit",
    category: "blood_count",
    priority: "tertiary",
    unit: "%",
    description: "Red blood cell volume",
    normalRange: { min: 36, max: 48, unit: "%" },
    chartable: true,
    color: "#EF4444",
  },

  platelets: {
    code: "platelets",
    name: "Platelets",
    category: "blood_count",
    priority: "tertiary",
    unit: "K/µL",
    description: "Blood clotting cells",
    normalRange: { min: 150, max: 400, unit: "K/µL" },
    chartable: true,
    color: "#F43F5E",
  },

  peak_flow: {
    code: "peak_flow",
    name: "Peak Flow",
    category: "vital_signs",
    priority: "tertiary",
    unit: "L/min",
    description: "Lung function test",
    normalRange: { min: 400, max: 600, unit: "L/min" },
    chartable: true,
    color: "#06B6D4",
  },
};

/**
 * Get metrics to display based on priority and available data
 */
export function getDisplayMetrics(
  availableMetricCodes: MetricCode[],
  maxCount: number = 4
): MetricCode[] {
  // First, try to get primary metrics that are available
  const availablePrimary = PRIMARY_METRICS.filter((code) =>
    availableMetricCodes.includes(code)
  );

  // If we have enough primary metrics, return them
  if (availablePrimary.length >= maxCount) {
    return availablePrimary.slice(0, maxCount);
  }

  // Otherwise, add secondary metrics
  const availableSecondary = SECONDARY_METRICS.filter((code) =>
    availableMetricCodes.includes(code)
  );

  const combined = [...availablePrimary, ...availableSecondary];

  if (combined.length >= maxCount) {
    return combined.slice(0, maxCount);
  }

  // If still not enough, add any other available metrics
  const remaining = availableMetricCodes.filter(
    (code) => !combined.includes(code)
  );

  return [...combined, ...remaining].slice(0, maxCount);
}

/**
 * Get metrics suitable for charting
 */
export function getChartableMetrics(
  availableMetricCodes: MetricCode[]
): MetricCode[] {
  return availableMetricCodes.filter((code) => METRIC_CONFIGS[code]?.chartable);
}

/**
 * Get metric configuration
 */
export function getMetricConfig(code: MetricCode): MetricConfig | undefined {
  return METRIC_CONFIGS[code];
}

/**
 * Group metrics by category
 */
export function groupMetricsByCategory(
  metricCodes: MetricCode[]
): Record<MetricCategory, MetricCode[]> {
  const grouped: Record<MetricCategory, MetricCode[]> = {
    vital_signs: [],
    blood_sugar: [],
    cholesterol: [],
    kidney: [],
    liver: [],
    thyroid: [],
    blood_count: [],
    other: [],
  };

  for (const code of metricCodes) {
    const config = METRIC_CONFIGS[code];
    if (config) {
      grouped[config.category].push(code);
    }
  }

  return grouped;
}

/**
 * Check if a value is within normal range
 */
export function isWithinNormalRange(
  code: MetricCode,
  value: number
): boolean | null {
  const config = METRIC_CONFIGS[code];
  if (!config?.normalRange) return null;

  return value >= config.normalRange.min && value <= config.normalRange.max;
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: MetricCategory): string {
  const names: Record<MetricCategory, string> = {
    vital_signs: "Vital Signs",
    blood_sugar: "Blood Sugar",
    cholesterol: "Cholesterol",
    kidney: "Kidney Function",
    liver: "Liver Function",
    thyroid: "Thyroid",
    blood_count: "Blood Count",
    other: "Other Tests",
  };
  return names[category];
}
