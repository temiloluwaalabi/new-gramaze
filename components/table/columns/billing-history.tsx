import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatDate } from "@/lib/utils";
export interface Payment {
  id: number;
  payment: string;
  amount: string;
  user_email: string;
  status: "pending" | "completed" | "failed";
  payment_description: string;
  payment_type: string;
  referenceId: string;
  created_at: string;
  updated_at: string;
}
export const BillingColumn: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="data-[state=checked]:bg-primary dark:border-light-400 mr-4 size-[18px] rounded-[5px] border-[#CAD2D6] data-[state=checked]:text-white lg:mr-0 xl:ml-0"
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select All"
      />
    ),
    cell: ({ row }) => (
      <div className="flex w-fit items-center justify-center">
        <Checkbox
          className="data-[state=checked]:bg-primary dark:border-light-400 size-[18px] rounded-[5px] border-[#CAD2D6] data-[state=checked]:text-white xl:mx-0"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div>
          <h4>₦{payment.amount}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <span className="text-sm font-normal text-[#262D31]">
          {formatDate(payment.created_at)}
        </span>
      );
    },
  },
  {
    accessorKey: "payment_description",
    header: "Description",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div>
          <p>{payment.payment_description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div>
          <p className="capitalize">
            {payment.payment_type?.replace("_", " ")}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "referenceId",
    header: "Reference ID",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div>
          <p className="font-mono text-sm">{payment.referenceId}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <span
          className={cn(
            "h-[24px] rounded-[12px] px-[12px] py-[5px] text-xs font-normal capitalize",
            payment.status === "completed" && "bg-green-100 text-green-600",
            payment.status === "pending" && "bg-yellow-100 text-yellow-600",
            payment.status === "failed" && "bg-red-100 text-red-600"
          )}
        >
          {payment.status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: () => {
      return <EllipsisVertical />;
    },
  },
];
