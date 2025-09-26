import {
  MapPin,
  Video,
  Home,
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import * as React from "react";

import GoogleIcon from "@/icons/google";
import { formatDate } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { Appointment } from "@/types";

import RescheduleAppointmentForm from "../forms/reschedule-appointment-form";
import { AvatarNameEmail } from "../shared/avatar-name-email";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {
  sheetTrigger: React.ReactNode;
  appointment: Appointment;
};

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
    return <Video className="h-5 w-5 text-blue-600" />;
  }
  if (visitType === "home") {
    return <Home className="h-5 w-5 text-green-600" />;
  }
  return <Building2 className="h-5 w-5 text-gray-600" />;
};

export const TableAppointmentSheet = (props: Props) => {
  const { user } = useUserStore();
  const [openSheet, setOpenSheet] = React.useState(false);
  const [showReschedule, setShowReschedule] = React.useState(false);
  const { appointment } = props;

  const formatAppointmentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canReschedule =
    appointment.status !== "completed" && appointment.status !== "cancelled";
  const canJoinMeeting =
    appointment.appointment_type === "virtual" && appointment.meeting_link;

  return showReschedule ? (
    <Sheet open={showReschedule} onOpenChange={setShowReschedule}>
      <SheetTrigger>{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[600px] max-w-full border-none bg-transparent p-5 md:!max-w-[600px]">
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <SheetHeader className="mb-6 border-none p-0">
            <SheetTitle className="text-xl font-semibold text-gray-900">
              Reschedule Appointment
            </SheetTitle>
          </SheetHeader>
          <RescheduleAppointmentForm
            setOpenSheet={setShowReschedule}
            appoinment={appointment.id.toString()}
          />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger className="size-full">{props.sheetTrigger}</SheetTrigger>
      <SheetContent className="!w-[600px] max-w-full border-none bg-transparent p-5 md:!max-w-[600px]">
        <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <SheetHeader className="mb-6 p-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900">
                {getAppointmentTypeIcon(
                  appointment.appointment_type,
                  appointment.visit_type
                )}
                <span>Appointment Details</span>
              </SheetTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  ID: {appointment.id}
                </Badge>
                <Badge
                  variant="outline"
                  className={`capitalize ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-8">
            {/* Appointment Overview */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatAppointmentDate(appointment.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {appointment.appointment_type}
                      {appointment.visit_type && ` - ${appointment.visit_type}`}
                    </p>
                  </div>
                </div>
                {appointment.extra_charges && (
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Extra Charges</p>
                      <p className="font-semibold text-gray-900">
                        ₦{appointment.extra_charges.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4">
              <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <MapPin className="h-5 w-5" />
                <span>Location Details</span>
              </h3>

              {appointment.appointment_type === "virtual" ? (
                <div className="space-y-3 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Virtual Meeting
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {appointment.location ||
                      "Online consultation via video call"}
                  </p>
                  {appointment.meeting_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-100"
                      onClick={() =>
                        window.open(appointment.meeting_link!, "_blank")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Join Meeting
                    </Button>
                  )}
                </div>
              ) : appointment.visit_type === "home" ? (
                <div className="space-y-2 rounded-lg bg-green-50 p-4">
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">
                      Home Visit
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    {appointment.home_address ||
                      appointment.additional_address ||
                      "Home address to be confirmed"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      Hospital Visit
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {appointment.hospital_info?.name ||
                        appointment.hospital_name ||
                        "Hospital name not specified"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.hospital_info?.address ||
                        appointment.hospital_address ||
                        "Address not specified"}
                    </p>
                    {appointment.hospital_info?.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{appointment.hospital_info.phone}</span>
                      </div>
                    )}
                    {appointment.hospital_info?.contact_person && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>
                          Contact: {appointment.hospital_info.contact_person}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Caregiver Details */}
            <div className="space-y-4">
              <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5" />
                <span>Caregiver Information</span>
              </h3>

              {appointment.caregiver ? (
                <div className="space-y-3">
                  <AvatarNameEmail
                    name={`${appointment.caregiver.first_name} ${appointment.caregiver.last_name}`}
                    email="caregiver@example.com" // This would come from caregiver details API
                    avatarImage=""
                  />
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                    <div>
                      <span className="text-gray-500">Role</span>
                      <p className="font-medium capitalize">
                        {appointment.caregiver.user_type}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Caregiver ID</span>
                      <p className="font-medium">{appointment.caregiver.id}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 rounded-lg bg-yellow-50 p-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800">
                    No caregiver assigned yet
                  </span>
                </div>
              )}
            </div>

            {/* Patient Details */}
            <div className="space-y-4">
              <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5" />
                <span>Patient Information</span>
              </h3>

              <div className="space-y-3">
                <AvatarNameEmail
                  name={`${user?.first_name || ""} ${user?.last_name || ""}`}
                  email={user?.email || ""}
                  avatarImage=""
                />
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <span className="text-gray-500">Date of Birth</span>
                    <p className="font-medium">
                      {user?.dob
                        ? formatDate(new Date(user.dob))
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone Number</span>
                    <p className="font-medium">
                      {user?.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Address</span>
                    <p className="font-medium">
                      {user?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {appointment.contact && (
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Contact for this appointment:
                    </span>
                  </div>
                  <p className="ml-6 text-sm text-blue-700">
                    {appointment.contact}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            {appointment.additional_note &&
              appointment.additional_note !== "No additional note" && (
                <div className="space-y-3">
                  <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                    <FileText className="h-5 w-5" />
                    <span>Additional Notes</span>
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">
                      {appointment.additional_note}
                    </p>
                  </div>
                </div>
              )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button variant="outline" className="flex items-center space-x-2">
                <GoogleIcon />
                <span>Add to Calendar</span>
              </Button>

              {canJoinMeeting && (
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(appointment.meeting_link!, "_blank")
                  }
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Join Meeting</span>
                </Button>
              )}

              {canReschedule && (
                <Button
                  onClick={() => {
                    setOpenSheet(false);
                    setShowReschedule(true);
                  }}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Reschedule Appointment</span>
                </Button>
              )}

              {appointment.status === "assigned" && (
                <Button
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Mark as Arrived</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
