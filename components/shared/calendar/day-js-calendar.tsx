// src/components/DayjsCalendar.tsx
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  CalendarIcon,
  SortDesc,
} from "lucide-react";
import React, { useEffect, useState } from "react";
// Add any necessary Day.js plugins

import { getOtherUsersInfo } from "@/app/actions/auth.actions";
import { AppointmentSheet } from "@/components/sheets/appointment-sheet";
import {
  AppointmentColumn,
  TableAppointment,
} from "@/components/table/columns/appointment-columns";
import { DataTable } from "@/components/table/data-table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserAppointments } from "@/lib/queries/use-appointment-query";
import { cn, combineDateAndTime, formatDateToJSDate } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";
import { Appointment, User } from "@/types";

import {
  transformEnrichedAppointmentsForCalendar,
  transformEnrichedAppointmentsForTable,
} from "./appointment-transformation-utils";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(isBetween);

// Define event type
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  appointmentTime: string;
  attendees?: {
    name: string;
    avatar?: string;
  }[];
  startTime: string;
  endTime: string;
  caregiver: User;
}
export interface EnrichedAppointment extends Appointment {
  client?: User;
  caregiverDetails?: User;
}
export default function DayjsCalendar() {
  // State for calendar
  const { user } = useUserStore();
  // const [tableAppointments, setTableAppointments] = useState<
  //   TableAppointment[]
  // >([]);
  const [events, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [isEnriching, setIsEnriching] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState("month");
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [screenSize, setScreenSize] = useState("large");
  console.log("TABLE APPOINTMENT", events);

  console.log("EVENTS", events);
  useEffect(() => {
    // Function to update screen size state
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("large");
      }
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const { isLoading: fetchingAppointments, data: AppointmentsData } =
    useGetUserAppointments();

  // Determine how many events to show based on screen size
  const getEventsToShow = () => {
    if (screenSize === "mobile") return 1;
    if (screenSize === "tablet") return 2;
    return 3;
  };

  const fetchCaregiverDetails = React.useCallback(async (userId: number) => {
    try {
      const data = await getOtherUsersInfo(Number(userId));

      console.log("DATA", data);
      if (data.success) {
        return data.user;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }, []);

  const enrichAppointment = React.useCallback(
    async (appointment: Appointment): Promise<EnrichedAppointment> => {
      console.log("EnrichedAppointmentAPP", appointment);
      const caregiverDetailsResult = await fetchCaregiverDetails(
        Number(appointment.caregiver?.id)
      );

      console.log("CAREGVER DETAILS", caregiverDetailsResult);
      return {
        ...appointment,
        client: user ?? undefined,
        caregiverDetails: caregiverDetailsResult || undefined,
      };
    },
    [fetchCaregiverDetails, user]
  );

  const enrichAppointments = React.useCallback(
    async (appointments: Appointment[]): Promise<EnrichedAppointment[]> => {
      const enrichedAppointments = await Promise.all(
        appointments.map((appointment) => enrichAppointment(appointment))
      );
      return enrichedAppointments;
    },
    [enrichAppointment]
  );
  // Complete transformation pipeline
  const transformAppointmentsWithUserDetails = React.useCallback(
    async (
      appointments: Appointment[]
    ): Promise<{
      tableAppointments: TableAppointment[];
      calendarEvents: CalendarEvent[];
    }> => {
      const enrichedAppointments = await enrichAppointments(appointments);

      return {
        tableAppointments:
          transformEnrichedAppointmentsForTable(enrichedAppointments),
        calendarEvents:
          transformEnrichedAppointmentsForCalendar(enrichedAppointments),
      };
    },
    [enrichAppointments]
  );

  useEffect(() => {
    const enrichAndTransform = async () => {
      if (!AppointmentsData?.success || !AppointmentsData.appointments?.data) {
        return;
      }

      setIsEnriching(true);
      try {
        const {  calendarEvents } =
          await transformAppointmentsWithUserDetails(
            AppointmentsData.appointments.data
          );
        // setTableAppointments(tableAppointments);
        setCalendarEvents(calendarEvents);
      } catch (error) {
        console.error("Error enriching appointments:", error);
      } finally {
        setIsEnriching(false);
      }
    };

    enrichAndTransform();
  }, [AppointmentsData, transformAppointmentsWithUserDetails]);

  const isLoading = fetchingAppointments || isEnriching;

  // Compact event component for month view
  const MonthViewEventComponent = ({ event }: { event: CalendarEvent }) => {
    if (!event.attendees || event.attendees.length === 0) {
      return <div className="truncate p-1 text-xs">{event.title}</div>;
    }

    const mainAttendee = event.attendees[0];

    return (
      <AppointmentSheet
        appointment={event}
        sheetTrigger={
          <div className="flex size-full cursor-pointer items-end bg-blue-50 p-1">
            <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center">
              {/* Only show avatar on larger screens */}
              <Avatar className="flex size-4 flex-shrink-0 lg:size-[33px]">
                <AvatarImage
                  src={
                    "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png"
                  }
                  alt={mainAttendee.name}
                  className="rounded-full"
                />
              </Avatar>

              <div className="flex flex-col items-start">
                {/* Display name with truncation */}
                {event.caregiver ? (
                  <p className="truncate text-xs font-semibold wrap-break-word text-ellipsis">
                    {screenSize !== "mobile" ? (
                      <>
                        {event.caregiver.first_name} {event.caregiver.last_name}
                      </>
                    ) : (
                      <>
                        {event.caregiver.first_name.trim().split(" ")[0]}
                        {event.caregiver.last_name.trim().split(" ")[0]}
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-xs">No caregiver</p>
                )}

                {/* Only show time on tablet and larger */}
                {screenSize !== "mobile" && (
                  <p className="truncate text-left text-xs text-gray-500">
                    {event.start}
                  </p>
                )}
              </div>
            </div>
          </div>
        }
      />
    );
  };

  // Toggle between Grid and List view
  const toggleGridView = () => {
    setIsGridView(!isGridView);
  };

  const weekDays = Array(7)
    .fill(0)
    .map((_, i) => addDays(new Date(currentDate), i - 2));
  // Generate days for month view
  const generateMonthDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const startDay = getDay(firstDayOfMonth);

    const daysArray = [];
    const totalDays = 35; // 5 rows of 7 days

    // Add previous month days to fill start of calendar
    for (let i = 0; i < startDay; i++) {
      daysArray.push({
        date: subDays(firstDayOfMonth, startDay - i),
        isCurrentMonth: false,
      });
    }

    // Add current month days
    let currentDay = firstDayOfMonth;
    while (currentDay <= lastDayOfMonth) {
      daysArray.push({
        date: new Date(currentDay),
        isCurrentMonth: true,
      });
      currentDay = addDays(currentDay, 1);
    }

    // Add next month days to fill end of calendar
    const remaining = totalDays - daysArray.length;
    for (let i = 1; i <= remaining; i++) {
      daysArray.push({
        date: addDays(lastDayOfMonth, i),
        isCurrentMonth: false,
      });
    }

    return daysArray;
  };

  const monthDays = generateMonthDays();

  // Navigate to previous/next day or week
  const navigatePrevious = () => {
    if (viewType === "day") {
      setCurrentDate(subDays(currentDate, 1));
    } else if (viewType === "week") {
      setCurrentDate(subDays(currentDate, 7));
    } else if (viewType === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  const navigateNext = () => {
    if (viewType === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (viewType === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (viewType === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  // // Format time for display
  // const formatEventTime = (date: Date) => {
  //   return dayjs(date).format("h A");
  // };
  const timeSlots = [
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
  ];

  // Event component
  const EventComponent = ({
    event,
    className,
  }: {
    event: CalendarEvent;
    className?: string;
  }) => {
    if (!event.attendees || event.attendees.length === 0) {
      return <div className="p-1 text-xs">{event.title}</div>;
    }

    // const hasMultipleAttendees = event.attendees.length > 1;
    const mainAttendee = event.attendees[0];
    // const otherAttendeesCount = event.attendees.length - 1;
    return (
      <AppointmentSheet
        appointment={event}
        sheetTrigger={
          <div
            className={cn(
              "mb-1 flex !size-full cursor-pointer flex-col items-end gap-2 space-x-2 bg-blue-50 p-3 2xl:flex-row",
              className
            )}
          >
            <Avatar className="hidden size-8 lg:flex">
              <AvatarImage
                src={
                  "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png"
                }
                alt={mainAttendee.name}
                className="rounded-full"
              />
            </Avatar>
            <div>
              {event.caregiver ? (
                <p className="truncate text-xs font-semibold wrap-break-word text-ellipsis">
                  {screenSize !== "mobile" ? (
                    <>
                      {event.caregiver.first_name} {event.caregiver.last_name}
                    </>
                  ) : (
                    <>
                      {event.caregiver.first_name.trim().split(" ")[0]}
                      {event.caregiver.last_name.trim().split(" ")[0]}
                    </>
                  )}
                </p>
              ) : (
                <p className="text-xs">No caregiver</p>
              )}
              <span className="text-xs font-normal text-[#66666B]">
                {(() => {
                  const combinedDate = combineDateAndTime(
                    event.start,
                    event.startTime
                  );
                  return combinedDate
                    ? dayjs(combinedDate).format("h:mm A")
                    : "";
                })()}
              </span>
            </div>
          </div>
        }
      />
    );
  };

  // Updated calendar rendering logic
  const renderDayView = () => (
    <div className="flex">
      {/* Time Column */}
      <div className="w-20 shrink-0 border-r bg-blue-600 text-white">
        <div className="h-16 border-b"></div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="flex h-20 items-center justify-center border-b text-sm"
          >
            {time}
          </div>
        ))}
      </div>


{/* Day Column */}
<div className="flex-1">
  <div
    className={`flex h-16 flex-col items-center justify-center border-b bg-blue-600 !text-white ${
      isToday(currentDate) ? "bg-blue-700" : ""
    }`}
  >
    <div className="text-xs text-white uppercase">
      {format(currentDate, "EEE")} {format(currentDate, "dd")}
    </div>
  </div>

  {/* Added pt-[10px] so events have clear breathing room below the header */}
  <div className="relative bg-white pt-[10px]">
    {timeSlots.map((time) => (
      <div key={time} className="h-20 border-b border-gray-200"></div>
    ))}

    {events
      .filter((event) => {
        const eventDate = dayjs(event.start).toDate();
        return isSameDay(eventDate, currentDate);
      })
      .map((event) => {
        // Combine date and time for accurate positioning
        const startCombined = combineDateAndTime(event.start, event.startTime);
        const endCombined = combineDateAndTime(
          event.end ?? event.start,
          event.endTime ?? event.startTime
        );

        const eventStart = startCombined
          ? dayjs(startCombined)
          : dayjs(event.start);
        const eventEnd = endCombined
          ? dayjs(endCombined)
          : dayjs(event.end ?? event.start);

        // Calculate position based on time slots (9 AM = 0px)
        const dayStartHour = 9; // 9 AM
        const pixelsPerMinute = 80 / 60; // 80px per hour slot

        const minutesFromStart =
          Math.max(0, (eventStart.hour() - dayStartHour) * 60 + eventStart.minute());

        // Now add the same 10px offset to match the container padding
        const topPosition = minutesFromStart * pixelsPerMinute;

        // Calculate duration
        const durationMinutes = Math.max(1, eventEnd.diff(eventStart, "minute"));
        const height = Math.max(40, durationMinutes * pixelsPerMinute);

        return (
          <div
            key={event.id}
            className="absolute right-1 left-1 overflow-hidden rounded border-l-4 border-blue-500 bg-blue-100 shadow-sm"
            style={{
              top: `${topPosition}px`,
              height: `${height}px`,
              zIndex: 10,
            }}
          >
            <EventComponent event={event} className="h-full p-2" />
          </div>
        );
      })}
  </div>
</div>


    </div>
  );
  // Render week view
  const renderWeekView = () => (
    <div className="flex overflow-x-scroll">
      {/* Time Column */}
      <div className="w-20 shrink-0 border-r bg-blue-600 text-white">
        <div className="h-16 border-b"></div> {/* Header spacer */}
        {timeSlots.map((time) => (
          <div
            key={time}
            className="flex h-24 items-center justify-center border-b text-sm"
          >
            {time}
          </div>
        ))}
      </div>

      {/* Days Columns */}
      <div className="flex flex-1">
        {weekDays.map((day, index) => (
          <div key={index} className="flex-1 border-r last:border-r-0">
            {/* Day Header */}
            <div
              className={`flex h-16 flex-col items-center justify-center border-b bg-blue-600 text-white ${
                isToday(day) ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                setCurrentDate(day);
                setViewType("day");
              }}
            >
              <div className="text-xs text-white uppercase">
                {format(day, "EEE")}
              </div>
              <div
                className={`text-sm font-medium ${isToday(day) ? "mt-1 flex size-6 items-center justify-center rounded-full bg-blue-500 text-white" : ""}`}
              >
                {format(day, "dd")}
              </div>
            </div>

            {/* Day Appointments */}
            <div className="bg-white">
              {timeSlots.map((timeSlot) => {
                // Find bookings for this time slot and day
                const timeBookings = events.filter((booking) => {
                  const bookingDate = formatDateToJSDate(booking.start);
                  return (
                    isSameDay(bookingDate || new Date(0), day) &&
                    format(bookingDate || new Date(0), "h a") ===
                      timeSlot.replace(" ", " ")
                  );
                });

                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="relative size-24 border-b"
                  >
                    {timeBookings.map((booking) => (
                      <EventComponent event={booking} key={booking.id} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render month view
  const renderMonthView = () => (
    <div className="w-full overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 rounded-t-lg bg-blue-600 text-white">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="flex items-center justify-center border-r border-b p-1 text-center text-xs font-medium md:p-2 md:text-sm"
          >
            {/* Show abbreviated day names on small screens */}
            <span className="hidden md:inline">{day}</span>
            <span className="md:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 rounded-b-lg border-t bg-white">
        {/* Calendar days */}
        {monthDays.map((day, index) => {
          const dayBookings = events.filter((booking) =>
            isSameDay(
              formatDateToJSDate(booking.start) || new Date(0),
              day.date
            )
          );

          const eventsToShow = getEventsToShow();

          return (
            <div
              key={index}
              className={`relative h-16 border-r border-b sm:h-20 md:h-28 lg:h-32 ${
                day.isCurrentMonth ? "" : "bg-gray-50 text-gray-400"
              } ${isToday(day.date) ? "bg-blue-50" : ""}`}
              onClick={() => {
                setCurrentDate(day.date);
                setViewType("day");
              }}
            >
              <div
                className={`absolute top-0 right-0 z-50 mt-[10px] mr-[5px] text-xs font-normal sm:text-base lg:mt-[20px] lg:mr-[19px] ${
                  isToday(day.date)
                    ? "ml-auto flex size-5 items-center justify-center rounded-full bg-blue-500 text-white sm:size-6"
                    : "text-right"
                }`}
              >
                {format(day.date, "d")}
              </div>

              <div
                className={cn(
                  "overflow-none relative flex size-full"
                  // screenSize === 'mobile'
                  //   ? 'max-h-[2.5rem]'
                  //   : screenSize === 'tablet'
                  //     ? 'max-h-full'
                  //     : 'max-h-full'
                )}
                // style={{
                //   maxHeight:
                //     screenSize === 'mobile' ? '2.5rem' : screenSize === 'tablet' ? '4rem' : '5rem',
                // }}
              >
                {dayBookings.slice(0, eventsToShow).map((booking) => (
                  <MonthViewEventComponent event={booking} key={booking.id} />
                ))}
                {dayBookings.length > eventsToShow && (
                  <div className="text-xs font-medium text-blue-500">
                    +{dayBookings.length - eventsToShow} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  return isGridView ? (
    <Card className="w-full border-none bg-transparent !p-0 shadow-none">
      <div className="">
        <div className="flex flex-col items-center justify-between gap-3 p-0 py-4 lg:flex-row">
          <div className="flex w-full items-center justify-between space-x-4">
            <div className="flex items-center space-x-5">
              <Button
                className="!h-[35px] !w-[35px] cursor-pointer border border-gray-300 bg-transparent p-2"
                variant="outline"
                size="icon"
                onClick={navigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-base font-medium text-[#303030]">
                {" "}
                {format(currentDate, "MMMM yyyy")}
              </span>{" "}
              <Button
                className="!h-[35px] !w-[35px] cursor-pointer border border-gray-300 bg-transparent p-2"
                variant="outline"
                disabled={isLoading}
                size="icon"
                onClick={navigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex w-full items-center justify-end space-x-2">
            <div className="flex overflow-hidden rounded-md border">
              <Select
                defaultValue={viewType}
                onValueChange={(value) => setViewType(value)}
              >
                <SelectTrigger className="!h-[40px] !w-[93px] cursor-pointer p-3">
                  <SelectValue placeholder="Select View Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="day">
                    Day
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="week">
                    Week
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="month">
                    Month
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex w-full lg:w-fit">
              <Search className="absolute top-[12px] left-2 size-4 text-gray-400" />
              <Input
                placeholder="Search client..."
                className="h-[40px] w-full pl-8 lg:w-[296px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[6px] bg-[#ededed] p-[4px]">
              <span
                onClick={toggleGridView}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                  isGridView === true && "bg-white"
                )}
              >
                <CalendarIcon className="size-4" />
              </span>
              <span
                onClick={toggleGridView}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                  !isGridView && "bg-white"
                )}
              >
                {" "}
                <List className="size-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Body */}
        {viewType === "day" && renderDayView()}
        {viewType === "week" && renderWeekView()}
        {viewType === "month" && renderMonthView()}

        {/* Weekly/Monthly Navigation */}
        {/* <div className="flex items-center justify-between border-t p-4">
          <Button variant="ghost" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="size-4" />
            Previous {viewType === 'day' ? 'Day' : viewType === 'week' ? 'Week' : 'Month'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={navigateNext}>
            Next {viewType === 'day' ? 'Day' : viewType === 'week' ? 'Week' : 'Month'}
            <ChevronRight className="size-4" />
          </Button>
        </div> */}
      </div>
    </Card>
  ) : (
    <Card className="w-full border-none bg-transparent p-0 shadow-none">
      <div className="">
        <div className="flex flex-col items-center justify-between gap-3 pt-4 lg:flex-row">
          <div className="flex w-full items-center justify-between space-x-4">
            <div className="flex items-center space-x-5">
              <Button
                className="!h-[35px] !w-[35px] cursor-pointer border border-gray-300 bg-transparent p-2"
                variant="outline"
                size="icon"
                onClick={navigatePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-base font-medium text-[#303030]">
                {" "}
                {format(currentDate, "MMMM yyyy")}
              </span>{" "}
              <Button
                className="!h-[35px] !w-[35px] cursor-pointer border border-gray-300 bg-transparent p-2"
                variant="outline"
                size="icon"
                onClick={navigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex w-full items-center justify-end space-x-2">
            <Button className="!h-[40px] bg-transparent" variant="outline">
              <SortDesc /> Sort by
            </Button>
            <div className="relative w-full lg:w-fit">
              <Search className="absolute top-2.5 left-2 size-4 text-gray-400" />
              <Input
                placeholder="Search client..."
                className="h-[40px] w-full pl-8 lg:w-[296px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex h-[40px] cursor-pointer items-center gap-[8px] rounded-[6px] bg-[#ededed] p-[4px]">
              <span
                onClick={toggleGridView}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                  isGridView && "bg-white"
                )}
              >
                <CalendarIcon className="size-4" />
              </span>
              <span
                onClick={toggleGridView}
                className={cn(
                  "flex size-6 items-center justify-center rounded-[4px] p-[4px] hover:bg-white",
                  !isGridView && "bg-white"
                )}
              >
                {" "}
                <List className="size-4" />
              </span>
            </div>
          </div>
        </div>

        <DataTable
          isLoading={isEnriching}
          columns={AppointmentColumn}
          tableClassname="bg-white border border-[#E7EBED] !rounded-lg"
          data={AppointmentsData?.appointments?.data || []}
        />
      </div>
    </Card>
  );
}
