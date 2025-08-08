"use client";
import React from "react";

import { User } from "@/types";

import { CaregiverHistory } from "../table/columns/caregiver-history";
import { DataTable } from "../table/data-table";

type CaregiverHistoryPDashboardProps = {
  caregivers: User[];
};
export default function CargiverHistoryDashboard({
  caregivers,
}: CaregiverHistoryPDashboardProps) {
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
