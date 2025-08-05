"use client";
import * as React from "react";

import { allRoutes } from "@/config/routes";

import DayjsCalendar from "../shared/calendar/day-js-calendar";
import PageTitleHeader from "../shared/page-title-header";
export const AppointmentPage = () => {
  return (
    <section className="space-y-3 px-[15px] py-[14px] lg:px-[15px] 2xl:px-[20px]">
      <PageTitleHeader
        page="Appointments"
        pageDesc="Manage and track your appointments"
        addLink={`${allRoutes.user.dashboard.scheduleAppointment.url}`}
        showBtn
      />
      {/* <section>
        <h2 className="text-2xl font-medium text-[#131B0B]">Appointments</h2>
        <p className="text-xs font-semibold text-[#7f7f7f]">Manage and track your appointments</p>
      </section> */}
      <section className="flex w-full gap-5">
        <DayjsCalendar />
      </section>
    </section>
  );
};
