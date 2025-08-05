import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Patient } from "@/types";

export const PatientsColumn: ColumnDef<Patient>[] = [
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
    id: "clientName",
    header: "Name",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-6">
            <AvatarFallback>CN</AvatarFallback>
            <AvatarImage src={appointment.profileImage} />
          </Avatar>
          <Link
            href={`/caregiver/patients/${appointment.id}`}
            className="text-sm font-medium"
          >
            {appointment.name}
          </Link>{" "}
        </div>
      );
    },
  },
  {
    accessorKey: "patientId",
    header: "Patient ID",
    cell: ({ row }) => {
      const appointment = row.original;
      return <span>{appointment.patientId}</span>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const appointment = row.original;
      return <span>{appointment.gender}</span>;
    },
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => {
      const appointment = row.original;
      return <span>{appointment.age}</span>;
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
