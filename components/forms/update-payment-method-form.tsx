"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { FormFieldTypes } from "@/config/enum";
import {
  paymentFormSchema,
  PaymentFormValues,
} from "@/lib/schemas/main-schema.schema";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function UpdatePaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      cvv: "",
      expiry: "",
      billingAddress: "",
    },
  });

  // Format card number with spaces while typing
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date while typing
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return v;
  };

  // Handle form submission
  function onSubmit(data: PaymentFormValues) {
    setIsSubmitting(true);

    // In a real app, you would process the payment here
    console.log("Payment form data:", data);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Payment information saved successfully!");
      form.reset();
    }, 1500);
  }

  return (
    <div className="w-full">
      <div className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CustomFormField
              control={form.control}
              name="nameOnCard"
              label="Name on card"
              fieldType={FormFieldTypes.INPUT}
              className="placeholder:text-sm"
              inputType="text"
              // disabled={isPending}
              placeholder="Full name as displayed on card"
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                      <Input
                        className="pl-10"
                        placeholder="1234 5678 9012 3456"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        maxLength={5}
                        {...field}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="billingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full billing address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
