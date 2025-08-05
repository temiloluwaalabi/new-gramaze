"use client";
import * as React from "react";

import { useUserStore } from "@/store/user-store";

import UpdateMedicalRecordForm from "../forms/update-medical-record-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
type Props = {
  sheetTrigger: React.ReactNode;
};
export const UpdateMedicalRecordSheet = (props: Props) => {
  const { user } = useUserStore();
  const [openSheet, setOpenSheet] = React.useState(false);
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {" "}
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <SheetHeader className="mb-4 border-none p-0 shadow-none">
            <SheetTitle className="text-lg font-medium text-[#333333]">
              Update medical record
            </SheetTitle>
          </SheetHeader>
          {user && (
            <UpdateMedicalRecordForm setOpenSheet={setOpenSheet} user={user} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
