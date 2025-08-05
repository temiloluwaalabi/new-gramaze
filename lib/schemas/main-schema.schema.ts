import * as z from 'zod';

export const RescheduleAppointmentSchema = z.object({
  date: z.date(),
  time: z.string(),
  reason: z.string().optional(),
});

export const ChangeCarePlanSchema = z.object({
  plan: z.string(),
  additionalNotes: z.string().optional(),
});

// Zod schema for form validation
export const paymentFormSchema = z.object({
  nameOnCard: z.string().min(2, {
    message: 'Name on card must be at least 2 characters.',
  }),
  cardNumber: z.string().regex(/^(\d{4}\s?){4}$/, {
    message: 'Card number must be in format: XXXX XXXX XXXX XXXX',
  }),
  cvv: z.string().regex(/^\d{3,4}$/, {
    message: 'CVV must be 3 or 4 digits.',
  }),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: 'Expiry date must be in format: MM/YY',
  }),
  billingAddress: z.string().min(5, {
    message: 'Billing address must be at least 5 characters.',
  }),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
