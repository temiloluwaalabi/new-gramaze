import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatDate } from "@/lib/utils";
import { Payment } from "@/types";

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
      const appointment = row.original;

      return (
        <div>
          <h4>${appointment.amount}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm font-normal text-[#262D31]">
          {formatDate(appointment.date)}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div>
          <p>{appointment.description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original;

      return (
        <span
          className={cn(
            "h-[24px] rounded-[12px] px-[12px] py-[5px] text-xs font-normal",
            status.status === "Completed" && "bg-green-100 text-green-600",
            status.status === "Cancelled" && "bg-red-100 text-red-600"
          )}
        >
          {status.status}
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
