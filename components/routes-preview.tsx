"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { allRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

const status = {
  completed: "Completed",
  comingSoon: "Coming Soon",
};

const unfinishedRoutes = ["/dashboard/notifications"];

const getStatus = (url: string) =>
  unfinishedRoutes.includes(url) ? status.comingSoon : status.completed;

export default function RoutesPreview() {
  const allFlattenedRoutes = useMemo(() => {
    const flat: { name: string; url: string; group: string }[] = [];

    for (const [section, group] of Object.entries(allRoutes)) {
      for (const [key, value] of Object.entries(group)) {
        if ("url" in value) {
          flat.push({ name: key, url: value.url, group: section });
        } else {
          for (const [subKey, subValue] of Object.entries(value)) {
            flat.push({
              name: `${key} / ${subKey}`,
              url: (subValue as { url: string }).url,
              group: section,
            });
          }
        }
      }
    }

    return flat;
  }, []);

  const counts = useMemo(() => {
    return allFlattenedRoutes.reduce(
      (acc, route) => {
        const routeStatus = getStatus(route.url);
        acc[routeStatus === status.completed ? "completed" : "coming-soon"]++;
        return acc;
      },
      { completed: 0, "coming-soon": 0 }
    );
  }, [allFlattenedRoutes]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold">
            Healthcare Platform Routes
          </h1>
          <p className="mb-8 text-xl opacity-90">
            Project development progress overview
          </p>
          <div className="flex flex-wrap gap-4">
            <StatCard label="Completed Routes" value={counts.completed} />
            <StatCard label="Coming Soon" value={counts["coming-soon"]} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto space-y-16 px-4 py-12">
        {["auth", "user", "caregiver"].map((sectionKey) => {
          const sectionRoutes = allFlattenedRoutes.filter(
            (r) => r.group === sectionKey
          );

          return (
            <div key={sectionKey}>
              <h2 className="mb-6 text-2xl font-semibold capitalize">
                {sectionKey} Routes
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sectionRoutes.map((route) => (
                  <RouteCard key={route.url} route={route} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-opacity-20 rounded-lg bg-white px-5 py-4 shadow-md backdrop-blur-sm">
      <div className="text-3xl font-bold text-black">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function RouteCard({ route }: { route: { name: string; url: string } }) {
  const routeStatus = getStatus(route.url);
  const isComingSoon = routeStatus === status.comingSoon;

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl border bg-white p-5 shadow transition-all duration-300 hover:shadow-lg",
        isComingSoon && "opacity-70"
      )}
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium capitalize">
            {route.name.replace(/-/g, " ")}
          </h3>
          <Badge variant={isComingSoon ? "outline" : "default"}>
            {routeStatus}
          </Badge>
        </div>
        <div className="text-sm break-all text-gray-500">{route.url}</div>
      </div>
      {!isComingSoon && (
        <Link
          href={route.url}
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          Visit Page →
        </Link>
      )}
    </div>
  );
}
