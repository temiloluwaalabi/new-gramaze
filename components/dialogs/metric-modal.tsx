"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  METRIC_CONFIGS,
  type MetricCode,
  getCategoryDisplayName,
  groupMetricsByCategory,
} from "@/lib/health-tracker-config";

type AddMetricModalProps = {
  onSubmit: (metricCode: MetricCode, value: string) => Promise<void>;
  userId: string;
  caregiverId: string;
};

export function AddMetricModal({
  onSubmit,
  userId,
  caregiverId,
}: AddMetricModalProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedMetric, setSelectedMetric] = React.useState<MetricCode | "">(
    ""
  );
  const [value, setValue] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const metricConfig = selectedMetric ? METRIC_CONFIGS[selectedMetric] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMetric || !value) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedMetric, value);

      // Reset form
      setSelectedMetric("");
      setValue("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to add metric:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group metrics by category for organized dropdown
  const groupedMetrics = groupMetricsByCategory(
    Object.keys(METRIC_CONFIGS) as MetricCode[]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="size-4" /> Add Metric
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Health Metric</DialogTitle>
            <DialogDescription>
              Record a new health measurement. Select the metric type and enter
              the value.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Metric Selection */}
            <div className="grid gap-2">
              <Label htmlFor="metric">Metric Type</Label>
              <Select
                value={selectedMetric}
                onValueChange={(value) =>
                  setSelectedMetric(value as MetricCode)
                }
              >
                <SelectTrigger id="metric">
                  <SelectValue placeholder="Select a metric" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.entries(groupedMetrics).map(([category, metrics]) => {
                    if (metrics.length === 0) return null;
                    return (
                      <React.Fragment key={category}>
                        <div className="text-muted-foreground px-2 py-1.5 text-sm font-semibold">
                          {getCategoryDisplayName(category as any)}
                        </div>
                        {metrics.map((code) => {
                          const config = METRIC_CONFIGS[code];
                          return (
                            <SelectItem key={code} value={code}>
                              {config.name}
                              {config.unit && (
                                <span className="text-muted-foreground ml-1 text-xs">
                                  ({config.unit})
                                </span>
                              )}
                            </SelectItem>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Value Input */}
            <div className="grid gap-2">
              <Label htmlFor="value">
                Value
                {metricConfig?.unit && (
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
                    ({metricConfig.unit})
                  </span>
                )}
              </Label>
              <Input
                id="value"
                placeholder={
                  metricConfig?.unit
                    ? `e.g., 120${metricConfig.unit === "mmHg" ? "/80" : ""}`
                    : "Enter value"
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!selectedMetric}
              />

              {/* Normal Range Hint */}
              {metricConfig?.normalRange && (
                <p className="text-muted-foreground text-xs">
                  Normal range: {metricConfig.normalRange.min} -{" "}
                  {metricConfig.normalRange.max} {metricConfig.normalRange.unit}
                </p>
              )}
            </div>

            {/* Description */}
            {metricConfig?.description && (
              <p className="text-muted-foreground text-sm">
                {metricConfig.description}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedMetric || !value || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Metric"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
