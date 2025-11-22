import { getLastTrackers } from "@/app/actions/services/health.tracker.actions";
import { HealthVitalsChart } from "@/components/charts/health-vitals-chart";

type Metric = {
  name: string;
  value: string;
};

const getMetricValue = (metrics: Metric[], metricName: string): string | null => {
  const metric = metrics.find(
    (m) => m.name?.toLowerCase() === metricName.toLowerCase()
  );
  return metric?.value || null;
};

export async function HealthChartSection() {
  const trackers = await getLastTrackers();

  const data = (() => {
    if (!trackers.tracker?.length) return [];

    const sorted = [...trackers.tracker].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let lastWeight = 0;
    let lastSystolic = 0;
    let lastDiastolic = 0;

    return sorted.map((tracker) => {
      const weightValue =
        getMetricValue(tracker.metrics, "Weight") || tracker.weight;
      if (weightValue) {
        lastWeight = Number(weightValue.replace(/[^\d.]/g, "")) || lastWeight;
      }

      const bpValue =
        getMetricValue(tracker.metrics, "Blood Pressure") ||
        tracker.blood_pressure;
      if (bpValue) {
        const cleanedBP = bpValue.replace(/[^\d/]/g, "");
        const [systolicStr, diastolicStr] = cleanedBP.split("/");
        if (systolicStr) lastSystolic = Number(systolicStr) || lastSystolic;
        if (diastolicStr) lastDiastolic = Number(diastolicStr) || lastDiastolic;
      }

      return {
        name: new Date(tracker.created_at).toLocaleDateString(),
        bodyWeight: lastWeight,
        bloodPressure: {
          systolic: lastSystolic,
          diastolic: lastDiastolic,
        },
      };
    });
  })();

  return <HealthVitalsChart data={data} />;
}

export function HealthChartSkeleton() {
  return (
    <div className="rounded-[6px] bg-white p-5">
      <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}