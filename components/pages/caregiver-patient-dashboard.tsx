"use client";
import React from "react";

import { PatientsColumn } from "../table/columns/patient";
import { DataTable } from "../table/data-table";

type CaregiverPatientsClientPageProps = {
  allPatients: {
    id: number;
    user_id: string;
    caregiver_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    patient: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }[];
};
export default function CaregiverPatientsClientPage({
  allPatients,
}: CaregiverPatientsClientPageProps) {
  return (
    <section className="h-full gap-6 space-y-3 bg-[#F2F2F2] px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <div className="rounded-[6px] bg-white px-6 pb-6">
        <DataTable
          columns={PatientsColumn}
          newToolbar={{
            show: true,
            tableTitle: "Patients",
            search: [
              {
                columnKey: "clientName",
                placeholder: "Search...",
              },
            ],
          }}
          tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
          data={allPatients}
        />
      </div>
    </section>
  );
}
