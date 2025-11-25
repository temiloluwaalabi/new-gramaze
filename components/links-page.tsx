/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/route-showcase/page.tsx
"use client";

import { Check, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for routes
type RouteItem = {
  url: string;
  status: "completed" | "coming-soon";
  label?: string;
};

type RouteSection = {
  [key: string]: RouteItem | RouteSection;
};

// Route definitions with status
const routes: Record<string, RouteSection> = {
  auth: {
    signIn: { url: "/sign-in", status: "completed" },
    signUp: { url: "/sign-up", status: "completed" },
    forgotPassword: { url: "/forgot-password", status: "completed" },
    resetPassword: { url: "/reset-password", status: "completed" },
    onboarding: { url: "/onboarding", status: "completed" },
  },
  user: {
    dashboard: {
      home: { url: "/dashboard", status: "completed" },
      appointment: { url: "/dashboard/appointment", status: "completed" },
      billing: { url: "/dashboard/billing", status: "completed" },
      caregiverHistory: {
        url: "/dashboard/caregiver-history",
        status: "completed",
      },
      caregiverUserHistory: {
        url: "/dashboard/caregiver-history/1",
        status: "completed",
      },
      healthTracker: { url: "/dashboard/health-tracker", status: "completed" },
      helpCenter: { url: "/dashboard/help-center", status: "completed" },
      helpCenterSingle: {
        url: "/dashboard/help-center/general-faqs",
        status: "completed",
      },
      message: { url: "/dashboard/message", status: "completed" },
      messageChat: { url: "/dashboard/message/chat", status: "completed" },
      notifications: { url: "/dashboard/notifications", status: "coming-soon" },
      settings: { url: "/dashboard/settings", status: "completed" },
    },
  },
  caregiver: {
    home: { url: "/caregiver", status: "coming-soon" },
    appointments: { url: "/caregiver/appointments", status: "coming-soon" },
    helpCenter: { url: "/caregiver/help-center", status: "coming-soon" },
    messages: { url: "/caregiver/messages", status: "coming-soon" },
    patients: { url: "/caregiver/patients", status: "coming-soon" },
    settings: { url: "/caregiver/settings", status: "coming-soon" },
  },
};

// Convert camelCase to Title Case
function formatLabel(key: string): string {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Recursively render route sections
function RouteCard({
  title,
  routes,
  basePath = "",
}: {
  title: string;
  routes: RouteSection;
  basePath?: string;
}) {
  const renderRoutes = (routes: RouteSection, path = "") => {
    return Object.entries(routes).map(([key, value]) => {
      if ("url" in value) {
        // This is a leaf node (actual route)
        return (
          <div key={key} className="relative">
            <Card className="mb-3 transition-all hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-lg font-medium">{formatLabel(key)}</h3>
                  <p className="text-sm text-gray-500">
                    {"url" in value ? (value as RouteItem).url : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {value.status === "completed" ? (
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-700"
                    >
                      <Check className="mr-1 h-3 w-3" /> Complete
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700"
                    >
                      <Clock className="mr-1 h-3 w-3" /> Coming Soon
                    </Badge>
                  )}

                  {value.status === "completed" && (
                    <Link href={(value as RouteItem).url} target="_blank">
                      <Button size="sm" variant="outline">
                        <ExternalLink className="mr-1 h-4 w-4" /> View
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      } else {
        // This is a nested section
        const newPath = path ? `${path}.${key}` : key;
        return (
          <div key={key} className="mb-6">
            <h3 className="mb-3 text-xl font-semibold text-gray-700">
              {formatLabel(key)}
            </h3>
            <div className="border-l-2 border-gray-200 pl-4">
              {renderRoutes(value, newPath)}
            </div>
          </div>
        );
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{formatLabel(title)}</CardTitle>
        <CardDescription>Routes for {title} section</CardDescription>
      </CardHeader>
      <CardContent>{renderRoutes(routes)}</CardContent>
    </Card>
  );
}

export default function RouteShowcase() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "completed" | "coming-soon"
  >("all");

  const counts = Object.entries(routes).reduce(
    (acc, [_, section]) => {
      const countStatus = (obj: any) => {
        Object.entries(obj).forEach(([_, value]: [string, any]) => {
          if (value.status) {
            acc[value.status as "completed" | "coming-soon"]++;
          } else {
            countStatus(value);
          }
        });
      };
      countStatus(section);
      return acc;
    },
    { completed: 0, "coming-soon": 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold">
            Healthcare Platform Routes
          </h1>
          <p className="mb-8 text-xl opacity-90">
            Project development progress overview
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-opacity-20 rounded-lg bg-white px-4 py-3">
              <div className="text-3xl font-bold">{counts.completed}</div>
              <div className="text-sm">Completed Routes</div>
            </div>
            <div className="bg-opacity-20 rounded-lg bg-white px-4 py-3">
              <div className="text-3xl font-bold">{counts["coming-soon"]}</div>
              <div className="text-sm">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveFilter("all")}>
              All Routes
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              onClick={() => setActiveFilter("completed")}
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="coming-soon"
              onClick={() => setActiveFilter("coming-soon")}
            >
              Coming Soon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {Object.entries(routes).map(([key, section]) => (
              <RouteCard key={key} title={key} routes={section} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {Object.entries(routes).map(([key, section]) => {
              // Filter only completed routes
              const filteredSection = { ...section };
              const filterCompleted = (obj: any) => {
                Object.entries(obj).forEach(([key, value]: [string, any]) => {
                  if (value.status && value.status !== "completed") {
                    delete obj[key];
                  } else if (!value.status) {
                    filterCompleted(value);
                  }
                });
              };
              filterCompleted(filteredSection);
              return (
                <RouteCard key={key} title={key} routes={filteredSection} />
              );
            })}
          </TabsContent>

          <TabsContent value="coming-soon" className="mt-6">
            {Object.entries(routes).map(([key, section]) => {
              // Filter only coming-soon routes
              const filteredSection = { ...section };
              const filterComingSoon = (obj: any) => {
                Object.entries(obj).forEach(([key, value]: [string, any]) => {
                  if (value.status && value.status !== "coming-soon") {
                    delete obj[key];
                  } else if (!value.status) {
                    filterComingSoon(value);
                  }
                });
              };
              filterComingSoon(filteredSection);
              return (
                <RouteCard key={key} title={key} routes={filteredSection} />
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
