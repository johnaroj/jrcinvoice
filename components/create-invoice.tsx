"use client";

import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { useActionState, useState } from "react";
import { Textarea } from "./ui/textarea";
import SubmitButton from "./ui/submit-button";
import { createInvoice } from "@/app/actions";
import { getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "@/app/utils/zod-schemas";
import { formatCurrency } from "@/app/utils/format-currency";

type CreateUserProps = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
};

export function CreateInvoice({
  firstName,
  lastName,
  address,
  email,
}: CreateUserProps) {
  const [state, action] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm({
    defaultValue: {
      items: [{ description: "", quantity: 0, rate: 0 }],
    },
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const items = fields.items.getFieldList();

  const calculateTotal = fields.items.getFieldList().reduce((total, item) => {
    const itemFields = item.getFieldset();
    const quantity = Number(itemFields.quantity.value) || 0;
    const rate = Number(itemFields.rate.value) || 0;
    return total + quantity * rate;
  }, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />
          <input
            type="hidden"
            name={fields.total.name}
            value={calculateTotal}
          />
          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder="Invoice Name"
              />
            </div>
            <p className="text-sm text-red-500">{fields.invoiceName.errors}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="">
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md ng-muted flex items-center">
                  #
                </span>
                <Input
                  placeholder="Invoice Number"
                  className="rounded-l-none"
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.initialValue}
                />
              </div>
              <p className="text-sm text-red-500">
                {fields.invoiceNumber.errors}
              </p>
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                name={fields.currency.name}
                key={fields.currency.key}
                defaultValue={currency}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">{fields.currency.errors}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  defaultValue={`${firstName} ${lastName}`}
                  placeholder="Your Name"
                />
                <p className="text-sm text-red-500">{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={email}
                  placeholder="Your Email"
                />
                <p className="text-sm text-red-500">
                  {fields.fromEmail.errors}
                </p>
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={address}
                  placeholder="Your Address"
                />
                <p className="text-sm text-red-500">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>
            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={fields.clientName.initialValue}
                  placeholder="Client Name"
                />
                <p className="text-sm text-red-500">
                  {fields.clientName.errors}
                </p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  placeholder="Client Email"
                />
                <p className="text-sm text-red-500">
                  {fields.clientEmail.errors}
                </p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
                  placeholder="Client Address"
                />
                <p className="text-sm text-red-500">
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Date</Label>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      <p>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(selectedDate)}
                      </p>
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    autoFocus
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    onDayClick={() => setIsOpen(false)}
                    disabled={(date) =>
                      Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                      Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                    }
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-red-500">{fields.date.errors}</p>
            </div>
            <div>
              <Label>Due Date</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={fields.dueDate.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Due Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due On Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-500">{fields.dueDate.errors}</p>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Unit Price</p>
              <p className="col-span-2">Amount</p>
            </div>
            {items.map((item, index) => {
              const itemFields = item.getFieldset();
              const lineTotal =
                (Number(itemFields.quantity.value) || 0) *
                (Number(itemFields.rate.value) || 0);
              return (
                <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-6">
                    <Textarea
                      className={
                        !itemFields.description.valid ? "border-red-500" : ""
                      }
                      {...getInputProps(itemFields.description, {
                        type: "text",
                      })}
                      key={itemFields.description.key}
                      placeholder="Item name & Description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      className={
                        !itemFields.quantity.valid ? "border-red-500" : ""
                      }
                      {...getInputProps(itemFields.quantity, {
                        type: "number",
                      })}
                      key={itemFields.quantity.key}
                      placeholder="Quantity"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      className={!itemFields.rate.valid ? "border-red-500" : ""}
                      {...getInputProps(itemFields.rate, {
                        type: "number",
                      })}
                      key={itemFields.rate.key}
                      placeholder="Rate"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      disabled
                      value={formatCurrency({
                        amount: lineTotal,
                        currency: currency as "USD" | "EUR",
                      })}
                    />
                  </div>
                  {items.length - 1 === index && (
                    <div className="col-span-12 flex justify-between">
                      <Button
                        variant="secondary"
                        {...form.remove.getButtonProps({
                          name: "items",
                          index: index,
                        })}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        {...form.insert.getButtonProps({
                          name: "items",
                        })}
                      >
                        Add Item
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency as "USD" | "EUR",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency as "USD" | "EUR",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              name={fields.notes.name}
              key={fields.notes.key}
              defaultValue={fields.notes.initialValue}
              placeholder="Add your Notes/s right here"
            />
            <p className="text-sm text-red-500">{fields.notes.errors}</p>
          </div>
          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButton text="Create Invoice" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
