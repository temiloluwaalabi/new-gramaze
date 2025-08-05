// @flow
import * as React from "react";

import UpdatePaymentForm from "../forms/update-payment-method-form";
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
export const UpdatePaymentMethodSheet = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[596px] max-w-full border-none bg-transparent p-5 md:!max-w-[596px]">
        {" "}
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-[6px] border border-gray-300 bg-white p-4">
          <SheetHeader className="mb-4 border-none p-0 shadow-none">
            <SheetTitle className="text-lg font-medium text-[#333333]">
              Update payment method
            </SheetTitle>
          </SheetHeader>
          <UpdatePaymentForm />
        </div>
      </SheetContent>
    </Sheet>
  );
};
