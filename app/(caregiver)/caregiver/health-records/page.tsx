import React, { Suspense } from "react";

import { getCaregiverhealthRecords } from "@/app/actions/caregiver-patient.actions";
import CaregiverHealthRecordsPage from "@/components/pages/caregiver-health-records-page";
import { Skeleton } from "@/components/ui/skeleton";

export default async function HealthRecordArchive() {
  const records = await getCaregiverhealthRecords();
  console.log("RECORDS", records);

  // Loading skeleton component
  function HealthRecordsLoadingSkeleton() {
    return (
      <div className="h-full space-y-6 bg-[#F2F2F2] px-[15px] py-[14px]">
        <div className="rounded-lg bg-white p-6">
          <Skeleton className="mb-4 h-8 w-64" />
          <Skeleton className="mb-6 h-4 w-96" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<HealthRecordsLoadingSkeleton />}>
      <CaregiverHealthRecordsPage healthRecords={records.data || []} />
    </Suspense>
  );
}
