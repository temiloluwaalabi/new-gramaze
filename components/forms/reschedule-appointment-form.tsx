"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import {
  useGetUserAppointments,
  useRescheduleAppointment,
} from "@/lib/queries/use-appointment-query";
import { RescheduleAppointmentSchema } from "@/lib/schemas/main-schema.schema";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Form } from "../ui/form";

type RescheduleAppointmentFormProps = {
  appoinment: string;
  setOpenSheet: (open: boolean) => void;
};
export default function RescheduleAppointmentForm(
  props: RescheduleAppointmentFormProps
) {
  const { isLoading, data: AllUserAppointments } = useGetUserAppointments();
  const { isPending, mutate: RescheduleAppointment } =
    useRescheduleAppointment();
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<string | null>(
    "10:00"
  );

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60) + 9;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  const bookedDates = AllUserAppointments?.appointments.data.map(
    (appointment) => new Date(appointment.date)
  );

  // Find the specific appointment by appointmentId (from props)
  const currentAppointment = AllUserAppointments?.appointments.data.find(
    (appointment) => appointment.id === Number(props.appoinment)
  );

  // Set the state with the appointment data when it loads
  React.useEffect(() => {
    if (currentAppointment) {
      setDate(new Date(currentAppointment.date));
      setSelectedTime(currentAppointment.time); // adjust property name as needed
    }
  }, [currentAppointment]);

  const form = useForm<z.infer<typeof RescheduleAppointmentSchema>>({
    resolver: zodResolver(RescheduleAppointmentSchema),
  });

  const handleSubmit = (
    values: z.infer<typeof RescheduleAppointmentSchema>
  ) => {
    const JSONVALUES = {
      id: Number(props.appoinment),
      date: format(values.date, "yyyy-MM-dd"),
      time: values.time,
      additional_note: values.reason || "",
    };
    RescheduleAppointment(JSONVALUES, {
      onSuccess: (data) => {
        props.setOpenSheet(false);
        toast.success(data.message);
      },
    });
  };

  return isLoading ? (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="me-2 size-4 animate-spin" />
      <span>Loading...</span>
    </div>
  ) : (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <CustomFormField
            control={form.control}
            name="date"
            label="Choose a date"
            fieldType={FormFieldTypes.SKELETON}
            renderSkeleton={(field) => (
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  field.onChange(date);
                }}
                defaultMonth={date}
                disabled={bookedDates}
                showOutsideDays={false}
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersClassNames={{
                  booked: "[&>button]:line-through opacity-100",
                }}
                className="h-fit w-full cursor-pointer rounded-md border !p-0"
                formatters={{
                  formatWeekdayName: (date) => {
                    return date.toLocaleString("en-US", { weekday: "short" });
                  },
                }}
              />
            )}
          />
          <CustomFormField
            control={form.control}
            name="time"
            label="Time"
            fieldType={FormFieldTypes.SKELETON}
            placeholder="Time"
            renderSkeleton={(field) => (
              <div className="!no-scrollbar custom-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto rounded-md border p-6">
                <div className="grid gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      disabled={isPending}
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => {
                        setSelectedTime(time);
                        field.onChange(time);
                      }}
                      className="w-full cursor-pointer shadow-none"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          >
            {/* {timeSlots.map((time) => (
              <SelectItem
                key={time}
                value={time}
                className="mb-2 cursor-pointer"
              >
                {time}
              </SelectItem>
            ))} */}
          </CustomFormField>
          <CustomFormField
            control={form.control}
            name="reason"
            label="Reason for rescheduling"
            fieldType={FormFieldTypes.TEXTAREA}
            // disabled={isPending}
            placeholder="Your reason for rescheduling"
          />
        </div>
        <div className="text-sm">
          {date && selectedTime ? (
            <>
              Your meeting is rescheduled for{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>{" "}
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your meeting.</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={isPending}
            type="button"
            onClick={() => props.setOpenSheet(false)}
            variant={"outline"}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            className="flex items-center gap-2"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
