'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  desktop: {
    label: 'Body weight',
    color: '#F59E0B', // Amber-500
  },
  mobile: {
    label: 'Blood pressure (Systolic)',
    color: '#3B82F6', // Blue-500
  },
  mobile2: {
    label: 'Blood pressure (Diastolic)',
    color: '#6366F1', // Indigo-500
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
  }[];
};

function getChartData(data: HealthVitalsChartProps['data']) {
  // Flatten blood pressure for recharts
  return data.map((d) => ({
    name: d.name,
    bodyWeight: d.bodyWeight,
    systolic: d.bloodPressure.systolic,
    diastolic: d.bloodPressure.diastolic,
  }));
}

export function HealthVitalsChart({ data }: HealthVitalsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white border border-[#F0F2F5] shadow-none">
        <CardHeader>
          <CardTitle className="text-xs md:text-sm text-[#71717A] font-medium">
            Health vitals
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground">
          No health records have been recorded.
        </CardContent>
      </Card>
    );
  }

  if (data.length < 2) {
    return (
      <Card className="bg-white border border-[#F0F2F5] shadow-none">
        <CardHeader>
          <CardTitle className="text-xs md:text-sm text-[#71717A] font-medium">
            Health vitals
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40 text-muted-foreground">
          Not enough data to display chart.
        </CardContent>
      </Card>
    );
  }

  const chartData = getChartData(data);

  return (
    <Card className="bg-white border border-[#F0F2F5] shadow-none">
      <CardHeader className="pb-0 flex items-center justify-between">
        <CardTitle className="text-xs md:text-sm text-[#71717A] font-medium">
          Health vitals
        </CardTitle>
        <div className="flex items-center gap-6 px-4 pb-2">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <span className="h-px w-[20px] rounded-full bg-yellow-400" />
            <span className="text-xs md:text-sm text-muted-foreground font-medium">
              Body weight
            </span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <span className="h-px w-[20px] rounded-full bg-blue-500" />
            <span className="text-xs md:text-sm text-muted-foreground font-medium">
              Systolic BP
            </span>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <span className="h-px w-[20px] rounded-full bg-indigo-500" />
            <span className="text-xs md:text-sm text-muted-foreground font-medium">
              Diastolic BP
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-auto lg:h-[324px] w-full">
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
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 250]}
              tickCount={6}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
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
            </defs>
            <Area
              dataKey="systolic"
              type="monotone"
              fill="url(#fillSystolic)"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{
                r: 6,
                stroke: '#3B82F6',
                strokeWidth: 2,
                fill: 'white',
              }}
              name="Systolic BP"
            />
            <Area
              dataKey="diastolic"
              type="monotone"
              fill="url(#fillDiastolic)"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{
                r: 6,
                stroke: '#6366F1',
                strokeWidth: 2,
                fill: 'white',
              }}
              name="Diastolic BP"
            />
            <Area
              dataKey="bodyWeight"
              type="monotone"
              fill="url(#fillWeight)"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="Body weight"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
