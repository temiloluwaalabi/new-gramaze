"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  bodyWeight: {
    label: "Body weight",
    color: "#F59E0B",
  },
  systolic: {
    label: "Blood pressure (Systolic)",
    color: "#3B82F6",
  },
  diastolic: {
    label: "Blood pressure (Diastolic)",
    color: "#6366F1",
  },
  pulse: {
    label: "Pulse",
    color: "#10B981",
  },
  temperature: {
    label: "Temperature",
    color: "#EF4444",
  },
  bloodGlucose: {
    label: "Blood Glucose",
    color: "#8B5CF6",
  },
} satisfies ChartConfig;

type HealthVitalsChartProps = {
  data: {
    name: string;
    bodyWeight: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    pulse: number;
    temperature: number;
    bloodGlucose: number;
  }[];
};

function getChartData(data: HealthVitalsChartProps["data"]) {
  // Flatten blood pressure for recharts
  return data.map((d) => ({
    name: d.name,
    bodyWeight: d.bodyWeight,
    systolic: d.bloodPressure.systolic,
    diastolic: d.bloodPressure.diastolic,
    pulse: d.pulse,
    temperature: d.temperature,
    bloodGlucose: d.bloodGlucose,
  }));
}

// Detect which metrics have actual data
function getActiveMetrics(data: HealthVitalsChartProps["data"]) {
  const active = {
    bodyWeight: false,
    systolic: false,
    diastolic: false,
    pulse: false,
    temperature: false,
    bloodGlucose: false,
  };

  for (const point of data) {
    if (point.bodyWeight > 0) active.bodyWeight = true;
    if (point.bloodPressure.systolic > 0) active.systolic = true;
    if (point.bloodPressure.diastolic > 0) active.diastolic = true;
    if (point.pulse > 0) active.pulse = true;
    if (point.temperature > 0) active.temperature = true;
    if (point.bloodGlucose > 0) active.bloodGlucose = true;
  }

  return active;
}

export function HealthVitalsChartTwo({ data }: HealthVitalsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-[#F0F2F5] bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-xs font-medium text-[#71717A] md:text-sm">
            Health vitals
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex h-40 items-center justify-center">
          No health records have been recorded.
        </CardContent>
      </Card>
    );
  }

  if (data.length < 2) {
    return (
      <Card className="border border-[#F0F2F5] bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-xs font-medium text-[#71717A] md:text-sm">
            Health vitals
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex h-40 items-center justify-center">
          Not enough data to display chart.
        </CardContent>
      </Card>
    );
  }

  const chartData = getChartData(data);
  const activeMetrics = getActiveMetrics(data);

  return (
    <Card className="border border-[#F0F2F5] bg-white shadow-none">
      <CardHeader className="flex items-center justify-between pb-0">
        <CardTitle className="text-xs font-medium text-[#71717A] md:text-sm">
          Health vitals
        </CardTitle>
        <div className="flex flex-wrap items-center gap-4 px-4 pb-2">
          {activeMetrics.bodyWeight && (
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <span className="h-px w-[20px] rounded-full bg-yellow-500" />
              <span className="text-muted-foreground text-xs font-medium md:text-sm">
                Body weight
              </span>
            </div>
          )}
          {activeMetrics.systolic && (
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <span className="h-px w-[20px] rounded-full bg-blue-500" />
              <span className="text-muted-foreground text-xs font-medium md:text-sm">
                Systolic BP
              </span>
            </div>
          )}
          {activeMetrics.diastolic && (
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <span className="h-px w-[20px] rounded-full bg-indigo-500" />
              <span className="text-muted-foreground text-xs font-medium md:text-sm">
                Diastolic BP
              </span>
            </div>
          )}
          {activeMetrics.pulse && (
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <span className="h-px w-[20px] rounded-full bg-green-500" />
              <span className="text-muted-foreground text-xs font-medium md:text-sm">
                Pulse
              </span>
            </div>
          )}
          {activeMetrics.temperature && (
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <span className="h-px w-[20px] rounded-full bg-red-500" />
              <span className="text-muted-foreground text-xs font-medium md:text-sm">
                Temperature
              </span>
            </div>
          )}
          {activeMetrics.bloodGlucose && (
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <span className="h-px w-[20px] rounded-full bg-purple-500" />
              <span className="text-muted-foreground text-xs font-medium md:text-sm">
                Blood Glucose
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={chartConfig}
          className="h-auto w-full lg:h-[324px]"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            height={324}
            className="w-full"
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 250]}
              tickCount={6}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <defs>
              <linearGradient id="fillSystolic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillDiastolic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillPulse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillGlucose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Render areas based on active metrics */}
            {activeMetrics.systolic && (
              <Area
                dataKey="systolic"
                type="monotone"
                fill="url(#fillSystolic)"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{
                  r: 6,
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                  fill: "white",
                }}
                name="Systolic BP"
              />
            )}
            {activeMetrics.diastolic && (
              <Area
                dataKey="diastolic"
                type="monotone"
                fill="url(#fillDiastolic)"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{
                  r: 6,
                  stroke: "#6366F1",
                  strokeWidth: 2,
                  fill: "white",
                }}
                name="Diastolic BP"
              />
            )}
            {activeMetrics.bodyWeight && (
              <Area
                dataKey="bodyWeight"
                type="monotone"
                fill="url(#fillWeight)"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{
                  r: 6,
                  stroke: "#F59E0B",
                  strokeWidth: 2,
                  fill: "white",
                }}
                name="Body weight"
              />
            )}
            {activeMetrics.pulse && (
              <Area
                dataKey="pulse"
                type="monotone"
                fill="url(#fillPulse)"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{
                  r: 6,
                  stroke: "#10B981",
                  strokeWidth: 2,
                  fill: "white",
                }}
                name="Pulse"
              />
            )}
            {activeMetrics.temperature && (
              <Area
                dataKey="temperature"
                type="monotone"
                fill="url(#fillTemperature)"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{
                  r: 6,
                  stroke: "#EF4444",
                  strokeWidth: 2,
                  fill: "white",
                }}
                name="Temperature"
              />
            )}
            {activeMetrics.bloodGlucose && (
              <Area
                dataKey="bloodGlucose"
                type="monotone"
                fill="url(#fillGlucose)"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{
                  r: 6,
                  stroke: "#8B5CF6",
                  strokeWidth: 2,
                  fill: "white",
                }}
                name="Blood Glucose"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
