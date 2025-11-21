import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
// import { DEFAULT_IMAGE_URL } from "@/config/constants";
import { User } from "@/types";

// Helper function to calculate age from date of birth
const calculateAge = (dob: string | null): number | null => {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();

  // Check if the date is valid
  if (isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Helper function to get initials from first and last name
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

export const PatientsColumn: ColumnDef<{
  id: number;
  user_id: string;
  caregiver_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  patient: Partial<User>;
}>[] = [
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
      const patient = row.original;
      const initials = getInitials(
        patient.patient?.first_name || "",
        patient.patient?.last_name || ""
      );

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-600">
              {initials}
            </AvatarFallback>
            {/* <AvatarImage src={DEFAULT_IMAGE_URL} /> */}
          </Avatar>
          <Link
            href={`/caregiver/patients/${patient.user_id}`}
            className="text-sm font-medium transition-colors hover:text-blue-600"
          >
            {patient.patient.first_name} {patient.patient.last_name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm text-gray-600">
          {appointment.patient.email || "Not provided"}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm text-gray-600">
          {appointment.patient.phone || "Not provided"}
        </span>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm text-gray-600 capitalize">
          {appointment.patient?.gender || "Not specified"}
        </span>
      );
    },
  },
  {
    accessorKey: "dob",
    header: "Age",
    cell: ({ row }) => {
      const patient = row.original;
      const age = calculateAge(patient.patient?.dob || "");

      return (
        <span className="text-sm text-gray-600">{age || "Not provided"}</span>
      );
    },
  },
  {
    accessorKey: "user_status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      const status = appointment.patient?.user_status || "active";

      const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
          case "active":
            return "bg-green-100 text-green-800";
          case "inactive":
            return "bg-red-100 text-red-800";
          case "pending":
            return "bg-yellow-100 text-yellow-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(status)}`}
        >
          {status || "Unknown"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: () => {
      return (
        <button
          className="rounded p-1 transition-colors hover:bg-gray-100"
          aria-label="More options"
        >
          <EllipsisVertical className="h-4 w-4 text-gray-500" />
        </button>
      );
    },
  },
];
