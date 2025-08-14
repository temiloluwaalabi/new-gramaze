import * as z from "zod";

import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "./common.schema";

export const LoginSchema = z.object({
  email: validateEmail,
  password: validatePassword,
  rememberMe: z.boolean().optional(),
});

export const RegisterSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: validateEmail,
  password: validatePassword,
  agree_to_terms: z.boolean(),
});

export const ForgotPasswordSchema = z.object({
  email: validateEmail,
});

export const ResetPasswordSchema = z.object({
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});

export const BiodataSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  dob: z.date(),
  gender: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  email: z.optional(z.string().email()),
  emergencyContact: z
    .object({
      name: z.string(),
      phoneNumber: z.string(),
      relationship: z.string(),
    })
    .optional(),
});

export const MedicalHistorySchema = z.object({
  history: z.string(),
  files: z.array(z.instanceof(File)),
});
export const MarkAppointmentAsArrivedSchema = z.object({
  additional_note_caregiver: z.string(),
  arrival_photo: z.instanceof(File).optional(),
  arrival_current_address: z.optional(z.string()),
});
export const VirtualAssessmentSchema = z.object({
  time: z.string(),
  date: z.date(),
  address: z.optional(z.string()),
  email: z.string(),
  notes: z.string(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type BiodataSchemaType = z.infer<typeof BiodataSchema>;
export type MedicalHistorySchemaType = z.infer<typeof MedicalHistorySchema>;
export type MarkAppointmentAsArrivedSchemaType = z.infer<
  typeof MarkAppointmentAsArrivedSchema
>;
export type VirtualAssessmentSchemaType = z.infer<
  typeof VirtualAssessmentSchema
>;
