import nodemailer from "nodemailer";
import Invoice from "../emails/templates/invoice";
import UpdateInvoice from "../emails/templates/update-invoice";
import InvoicePaymentOverdue from "../emails/templates/invoice-payment-overdue";
import {
  InvoiceContext,
  InvoicePaymentOverdueContext,
  TemplateContextMap,
  UpdateInvoiceContext,
} from "./types";

// Create a transporter
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const getEmailTemplate = <T extends keyof TemplateContextMap>(
  template: T,
  context: TemplateContextMap[T]
): string => {
  switch (template) {
    case "invoice":
      return Invoice(context as InvoiceContext);
    case "update-invoice":
      return UpdateInvoice(context as UpdateInvoiceContext);
    case "invoice-payment-overdue":
      return InvoicePaymentOverdue(context as InvoicePaymentOverdueContext);
    default:
      throw new Error(`Unknown template: ${template}`);
  }
};

// Send email
export const sendEmail = async <T extends keyof TemplateContextMap>(
  to: string,
  subject: string,
  template: T,
  context: TemplateContextMap[T]
): Promise<void> => {
  const html = getEmailTemplate(template, context);
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
