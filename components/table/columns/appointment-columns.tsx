/* eslint-disable no-unused-vars */
import { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Calendar,
  Clock,
  EllipsisVertical,
  Home,
  User,
  Video,
} from "lucide-react";

import { VerificationGuard } from "@/components/guards/verification-guard";
import { ReschedileAppointmentSheet } from "@/components/sheets/reschedule-appointment-sheet";
import { TableAppointmentSheet } from "@/components/sheets/table-appointment-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";
import { Appointment } from "@/types";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "assigned":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "arrived":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getAppointmentTypeIcon = (type: string, visitType?: string | null) => {
  if (type === "virtual") {
    return <Video className="h-4 w-4 text-blue-600" />;
  }
  if (visitType === "home") {
    return <Home className="h-4 w-4 text-green-600" />;
  }
  return <Building2 className="h-4 w-4 text-gray-600" />;
};

// Interface definitions
export interface TableAppointment {
  id: string;
  clientName: string;
  clientImage: string;
  appointmentDate: string;
  appointmentTime: string;
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

export const AppointmentColumn: ColumnDef<Appointment>[] = [
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
    id: "appointmentInfo",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <TableAppointmentSheet
          sheetTrigger={
            <div className="flex cursor-pointer items-center space-x-3 rounded-md p-2 transition-colors hover:bg-gray-50">
              <div className="flex flex-col items-center space-y-1">
                {getAppointmentTypeIcon(
                  appointment.appointment_type,
                  appointment.visit_type
                )}
                <span className="text-xs text-gray-500 capitalize">
                  {appointment.appointment_type}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(appointment.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {appointment.time}
                  </span>
                </div>
                <Badge variant="outline" className="w-fit text-xs">
                  ID: {appointment.id}
                </Badge>
              </div>
            </div>
          }
          appointment={appointment}
        />
      );
    },
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const appointment = row.original;

      if (appointment.appointment_type === "virtual") {
        return (
          <div className="flex items-center space-x-2">
            <Video className="h-4 w-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Online</span>
              <span className="text-xs text-gray-500">
                {appointment.location || "Virtual Meeting"}
              </span>
            </div>
          </div>
        );
      }

      if (appointment.visit_type === "home") {
        return (
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Home Visit</span>
              <span className="max-w-[200px] truncate text-xs text-gray-500">
                {appointment.home_address ||
                  appointment.location ||
                  appointment.additional_address ||
                  "Home Address"}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-gray-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {appointment.hospital_info?.name ||
                appointment.hospital_name ||
                "Hospital"}
            </span>
            <span className="max-w-[200px] truncate text-xs text-gray-500">
              {appointment.hospital_info?.address ||
                appointment.hospital_address ||
                "Hospital Address"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "caregiver",
    header: "Caregiver",
    cell: ({ row }) => {
      const appointment = row.original;

      if (!appointment.caregiver) {
        return (
          <div className="flex items-center space-x-2 text-gray-500">
            <User className="h-4 w-4" />
            <span className="text-sm">Not assigned</span>
          </div>
        );
      }

      const fullName = `${appointment.caregiver.first_name} ${appointment.caregiver.last_name}`;
      const initials = `${appointment.caregiver.first_name[0]}${appointment.caregiver.last_name[0]}`;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
              {initials}
            </AvatarFallback>
            <AvatarImage src="" />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{fullName}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <Badge
          variant="outline"
          className={cn(
            "border font-medium capitalize",
            getStatusColor(appointment.status)
          )}
        >
          {appointment.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <VerificationGuard
              route="/billing"
              fallback={
                <Button disabled className="!h-fit !py-2 text-xs" size={"sm"}>
                  Verify Account
                </Button>
              }
            >
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </VerificationGuard>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <TableAppointmentSheet
                sheetTrigger={
                  <Button
                    variant="ghost"
                    className="h-auto justify-start p-0 font-normal"
                  >
                    View Details
                  </Button>
                }
                appointment={appointment}
              />
            </DropdownMenuItem>

            {appointment.status !== "completed" &&
              appointment.status !== "cancelled" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <ReschedileAppointmentSheet
                    appoinment={appointment.id.toString()}
                    sheetTrigger={
                      <Button
                        variant="ghost"
                        className="h-auto justify-start p-0 font-normal"
                      >
                        Reschedule
                      </Button>
                    }
                  />
                </DropdownMenuItem>
              )}

            {appointment.appointment_type === "virtual" &&
              appointment.meeting_link && (
                <DropdownMenuItem>
                  <a
                    href={appointment.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left"
                  >
                    Join Meeting
                  </a>
                </DropdownMenuItem>
              )}

            {appointment.status === "assigned" && (
              <DropdownMenuItem className="text-green-600">
                Mark as Arrived
              </DropdownMenuItem>
            )}

            {(appointment.status === "pending" ||
              appointment.status === "assigned") && (
              <DropdownMenuItem className="text-red-600">
                Cancel Appointment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
