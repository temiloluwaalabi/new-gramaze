"use client";
import * as React from "react";

import NotificationsPanel from "../shared/widget/notification-panel";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
type Props = {
  sheetTrigger: React.ReactNode;
};
export const NotificationPanelSheet = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <NotificationsPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
};
