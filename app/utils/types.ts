export interface InvoiceContext {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  totalAmount: string;
  downloadLink: string;
}

export interface UpdateInvoiceContext {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  totalAmount: string;
  downloadLink: string;
}

export interface InvoicePaymentOverdueContext {
  clientName: string;
  contactLink?: string;
  unsubscribeLink?: string;
}

export interface TemplateContextMap {
  invoice: InvoiceContext;
  "update-invoice": UpdateInvoiceContext;
  "invoice-payment-overdue": InvoicePaymentOverdueContext;
}
