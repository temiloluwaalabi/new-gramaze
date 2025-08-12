"use client";
import React from "react";

import { CaregiverHistory } from "../table/columns/caregiver-history";
import { DataTable } from "../table/data-table";

type CaregiverHistoryPDashboardProps = {
  caregivers: {
    id: number;
    user_id: string;
    caregiver_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    caregiver: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }[];
};
export default function CargiverHistoryDashboard({
  caregivers,
}: CaregiverHistoryPDashboardProps) {
  console.log("caregivers", caregivers);
  return (
    <section className="space-y-3 !bg-white px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <DataTable
        columns={CaregiverHistory}
        newToolbar={{
          show: true,
          tableTitle: "Caregiver history",
          tableDescription:
            "Stay informed with real-time updates from your caregivers",
          search: [
            {
              columnKey: "caregiverName",
              placeholder: "Search...",
            },
          ],
        }}
        tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
        data={caregivers}
      />
    </section>
  );
}
