/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { ReschedileAppointmentSheet } from "@/components/sheets/reschedule-appointment-sheet";
import { TableAppointmentSheet } from "@/components/sheets/table-appointment-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatAppointmentDate } from "@/lib/utils";

// Interface definitions
export interface TableAppointment {
  id: string;
  clientName: string;
  clientImage: string;
  appointmentDate: Date;
  consultantName: string;
  consultantImage: string;
  status: AppointmentStatus;
  selected?: boolean;
}

// Using enum for status to ensure type safety
export enum AppointmentStatus {
  Completed = "Completed",
  Cancelled = "Cancelled",
  Pending = "Pending",
}

export const AppointmentColumn: ColumnDef<TableAppointment>[] = [
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
        <TableAppointmentSheet
          sheetTrigger={
            <div className="flex cursor-pointer items-center space-x-2">
              <Avatar className="size-6">
                <AvatarFallback>CN</AvatarFallback>
                <AvatarImage src={appointment.clientImage} />
              </Avatar>
              <h4 className="text-sm font-medium">{appointment.clientName}</h4>
            </div>
          }
          appointment={appointment}
        />
      );
    },
  },
  {
    accessorKey: "appointmentDate",
    header: "Date",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <span className="text-sm font-normal text-[#262D31]">
          {formatAppointmentDate(new Date(appointment.appointmentDate))}
        </span>
      );
    },
  },
  {
    id: "caregiverName",
    header: "caregiver",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <>
          {appointment.consultantName !== "undefined undefined" ? (
            <div className="flex items-center space-x-2">
              <Avatar className="size-6">
                <AvatarFallback>CN</AvatarFallback>
                <AvatarImage src={appointment.consultantImage} />
              </Avatar>
              <div>
                <h4 className="text-sm font-medium">
                  {appointment.consultantName}
                </h4>
              </div>
            </div>
          ) : (
            <span>No caregiver assigned</span>
          )}
        </>
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
            status.status === "Cancelled" && "bg-red-100 text-red-600",
            status.status === "Pending" && "bg-yellow-100 text-yellow-600"
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
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="cursor-pointer p-0">
              <EllipsisVertical className="z-50 size-4 cursor-pointer text-sm text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              <ReschedileAppointmentSheet
                appoinment={appointment.id}
                sheetTrigger={
                  <Button
                    className="h-fit cursor-pointer bg-transparent !p-0 underline"
                    variant={"link"}
                  >
                    Reschedule Appointment
                  </Button>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
