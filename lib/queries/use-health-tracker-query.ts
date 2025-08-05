"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getLastTracker,
  getLastTrackers,
  getLastThreeReports,
  getLastThreeNotes,
  getUserHealthReports,
  getUserHealthNotes,
} from "@/app/actions/services/health.tracker.actions";

// ============= HEALTH TRACKER QUERIES =============

// Get Last Health Tracker Entry
export const useGetLastTracker = () => {
  return useQuery({
    queryKey: ["healthTracker", "last"],
    queryFn: () => getLastTracker(),
    staleTime: 2 * 60 * 1000, // 2 minutes (health data should be fresher)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Health Trackers by Date Range
export const useGetLastTrackers = ({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) => {
  return useQuery({
    queryKey: ["healthTracker", "range", { start_date, end_date }],
    queryFn: () => getLastTrackers({ start_date, end_date }),
    enabled: !!(start_date && end_date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Last Three Reports
export const useGetLastThreeReports = () => {
  return useQuery({
    queryKey: ["healthTracker", "reports", "lastThree"],
    queryFn: () => getLastThreeReports(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Last Three Notes
export const useGetLastThreeNotes = () => {
  return useQuery({
    queryKey: ["healthTracker", "notes", "lastThree"],
    queryFn: () => getLastThreeNotes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get User Health Reports with Filters
export const useGetUserHealthReports = ({
  start_date,
  end_date,
  caregiver_name,
  report_name,
}: {
  start_date?: string;
  end_date?: string;
  caregiver_name?: string;
  report_name?: number;
} = {}) => {
  return useQuery({
    queryKey: [
      "healthTracker",
      "reports",
      { start_date, end_date, caregiver_name, report_name },
    ],
    queryFn: () =>
      getUserHealthReports({
        start_date,
        end_date,
        caregiver_name,
        report_name,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get User Health Notes with Filters
export const useGetUserHealthNotes = ({
  start_date,
  end_date,
  caregiver_name,
  notes,
}: {
  start_date?: string;
  end_date?: string;
  caregiver_name?: string;
  notes?: number;
} = {}) => {
  return useQuery({
    queryKey: [
      "healthTracker",
      "notes",
      { start_date, end_date, caregiver_name, notes },
    ],
    queryFn: () =>
      getUserHealthNotes({ start_date, end_date, caregiver_name, notes }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
// Health Tracker Utility Hook
export const useRefetchHealthTracker = () => {
  const queryClient = useQueryClient();

  return {
    refetchLastTracker: () => {
      queryClient.invalidateQueries({ queryKey: ["healthTracker", "last"] });
    },
    refetchTrackerRange: (start_date?: string, end_date?: string) => {
      if (start_date && end_date) {
        queryClient.invalidateQueries({
          queryKey: ["healthTracker", "range", { start_date, end_date }],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["healthTracker", "range"] });
      }
    },
    refetchReports: () => {
      queryClient.invalidateQueries({ queryKey: ["healthTracker", "reports"] });
    },
    refetchNotes: () => {
      queryClient.invalidateQueries({ queryKey: ["healthTracker", "notes"] });
    },
    refetchAllHealthTracker: () => {
      queryClient.invalidateQueries({ queryKey: ["healthTracker"] });
    },
  };
};
