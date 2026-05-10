"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NumericFormat } from "react-number-format";
import { Input } from "./ui/input";
import { combineDateAndTime } from "@/utils/date";

const editPayoutScheduleFormSchema = z.object({
  status: z.string(),
  amount: z.coerce.number<string>().positive(),
  paymentDate: z.date(),
  paymentTime: z.string(),
  method: z.string(),
});

const STATUSES = ["PENDING", "PAID"];

const EditPayoutSchedule = ({ payoutschedule }: { payoutschedule: any }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(editPayoutScheduleFormSchema),
    defaultValues: {},
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      toast.success("Payout schedule details has been updated successfully");

      const res = await axios.post(`/api/investment/payout`, {
        payoutScheduleId: payoutschedule.id,
        investmentId: payoutschedule.investmentId,
        ...data,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payoutschedules"] });
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: any) {
    console.log(values);

    mutation.mutate({
      ...values,
      payoutDate: combineDateAndTime(values.paymentDate, values.paymentTime),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] min-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Payout Schedule Details</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Amount paid</FieldLabel>
                  <NumericFormat
                    thousandSeparator
                    allowNegative={false}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue);
                    }}
                    className="p-3 py-1 border outline-0 w-full rounded-xl focus:shadow-md"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="paymentDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Payment Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={field.value}
                        className="w-70 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="paymentTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-32">
                  <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                  <Input
                    type="time"
                    value={field.value}
                    onChange={field.onChange}
                    step="1"
                    defaultValue={field.value}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="method"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Payment Method</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment Method</SelectLabel>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CARD">Card</SelectItem>
                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {STATUSES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full cursor-pointer"
            >
              {mutation.isPending ? <Spinner /> : "Save details"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPayoutSchedule;
