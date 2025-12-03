import { ColumnDef } from "@tanstack/react-table";

import { ReportActionColumn } from "@/components/dropdowns/report-action-column";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { HealthReport } from "@/types";

export const HealthTrackerColumn: ColumnDef<HealthReport>[] = [
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
    accessorKey: "report_name",
    header: "Name",
    cell: ({ row }) => {
      const report = row.original;

      return (
        <div>
          <h4>{report.report_name}</h4>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const report = row.original;
      return (
        <span className="text-sm font-normal text-[#262D31]">
          {formatDate(report.created_at, true)}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return <ReportActionColumn report={row.original} />;
    },
  },
];
