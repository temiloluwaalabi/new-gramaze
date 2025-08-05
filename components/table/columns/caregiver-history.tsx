import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { CaregiverSchedule } from "@/types";

export const CaregiverHistory: ColumnDef<CaregiverSchedule>[] = [
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
    id: "caregiverName",
    header: "Name",
    cell: ({ row }) => {
      const caregiver = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-6">
            <AvatarFallback>CN</AvatarFallback>
            <AvatarImage src={caregiver.caregiverImage} />
          </Avatar>
          <Link
            href={`/dashboard/caregiver-history/${caregiver.id}`}
            className="text-sm font-medium"
          >
            {caregiver.caregiverName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm font-normal text-[#262D31]">
          {formatDate(appointment.startDate)}
        </span>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm font-normal text-[#262D31]">
          {formatDate(appointment.endDate)}
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
