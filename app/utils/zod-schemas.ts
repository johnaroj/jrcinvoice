import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  address: z.string().min(2, { message: "Address is required" }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

export const invoiceSchema = z.object({
  id: z.string().optional(),
  invoiceName: z.string().min(2, { message: "Invoice name is required" }),
  total: z.number().min(1, { message: "1$ is minimum" }),
  status: z.enum(["PENDING", "PAID"]).default("PENDING"),
  date: z.date().min(new Date(), { message: "Date is required" }),
  dueDate: z.number().min(0, { message: "Due date is required" }),
  fromName: z.string().min(1, { message: "From name is required" }),
  fromAddress: z.string().min(1, { message: "From address is required" }),
  fromEmail: z.string().email({ message: "Invalid email address" }),
  clientName: z.string().min(2, { message: "Client name is required" }),
  clientAddress: z.string().min(2, { message: "Client address is required" }),
  clientEmail: z.string().email({ message: "Invalid email address" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  invoiceNumber: z.number().min(1, { message: "Minimum invoice number is 1" }),
  notes: z.string().nullish(),
  invoiceItemDescription: z
    .string()
    .min(1, { message: "Invoice item description is required" }),
  invoiceItemRate: z
    .number()
    .min(1, { message: "Invoice item rate is required" }),
  invoiceItemQuantity: z
    .number()
    .min(1, { message: "Invoice item quantity is required" }),
});
