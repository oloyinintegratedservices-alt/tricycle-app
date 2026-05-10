"use client";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

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
import { useEffect } from "react";

const newInvestmentFormSchema = z
  .object({
    tricycleId: z.string().nonempty(),
    userId: z.string().nonempty(),

    scheduleType: z.enum(["WEEKLY", "MONTHLY"]).default("MONTHLY"),

    weeks: z.coerce.number<string>().int().positive().optional(),
    months: z.coerce.number<string>().int().positive().optional(),

    investedAmount: z.coerce.number<string>().positive().optional(),
    expectedReturn: z.coerce.number<string>().positive().optional(),

    startDate: z.date(),
  })
  .superRefine((data, ctx) => {
    // WEEKLY logic
    if (data.scheduleType === "WEEKLY") {
      if (!data.weeks) {
        ctx.addIssue({
          path: ["weeks"],
          message: "Weeks must be specified",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.months) {
        ctx.addIssue({
          path: ["months"],
          message: "Months should not be provided for weekly schedule",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // MONTHLY logic
    if (data.scheduleType === "MONTHLY") {
      if (!data.months) {
        ctx.addIssue({
          path: ["months"],
          message: "Months must be specified",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.weeks) {
        ctx.addIssue({
          path: ["weeks"],
          message: "Weeks should not be provided for monthly schedule",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

const Page = () => {
  const form = useForm({
    resolver: zodResolver(newInvestmentFormSchema),
    defaultValues: {
      tricycleId: "",
      userId: "",
      scheduleType: "MONTHLY",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof newInvestmentFormSchema>) => {
      const res = await axios.post(`/api/investment`, data);

      return res.data;
    },
    onSuccess: () => {
      // toast message
      toast.success("New Investment added successfully");
      form.reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof newInvestmentFormSchema>) {
    console.log(values);

    // let payload: any = {
    //   tricycleId: values.tricycleId,
    //   userId: values.userId,
    //   orderType: values.orderType,
    //   totalPrice: values.totalPrice,
    // };

    // if (values.orderType == "HIRE_PURCHASE") {
    //   payload = {
    //     ...payload,
    //     scheduleType: values.scheduleType,
    //     weeks: values.weeks,
    //     months: values.months,
    //     startDate: values.startDate?.toUTCString(),
    //   };
    // }

    // console.log(payload);
    mutation.mutate(values);
  }

  const { data } = useQuery({
    queryKey: ["tricycles"],
    queryFn: async () => {
      const res = await axios.get(`/api/tricycle`);

      return res.data;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`/api/user`);

      return res.data;
    },
  });

  const tricycles = data?.map((tricycle: any) => {
    return {
      value: tricycle.id,
      label: tricycle.chasisNumber,
    };
  });

  const users = usersData?.data?.map((user: any) => {
    return {
      value: user.id,
      label: user.fullname,
    };
  });

  useEffect(() => {
    form.setValue("weeks", undefined);

    form.setValue("months", undefined);
  }, [form.watch("scheduleType")]);

  if (!tricycles || !users) return;

  return (
    <div>
      <h2 className="text-3xl font-bold">Create Investment</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 mt-4">
          <Controller
            name="tricycleId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tricycle</FieldLabel>
                <Combobox
                  items={tricycles}
                  itemToStringValue={(tricycle: (typeof tricycles)[number]) =>
                    tricycle.label
                  }
                  onValueChange={(item) => field.onChange(item.value)}
                >
                  <ComboboxInput placeholder="Search tricycles..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No tricycles found.</ComboboxEmpty>
                    <ComboboxList>
                      {(tricycle) => (
                        <ComboboxItem key={tricycle.label} value={tricycle}>
                          <Item size="xs" className="p-0">
                            <ItemContent>
                              <ItemTitle className="whitespace-nowrap">
                                {tricycle.label}
                              </ItemTitle>
                            </ItemContent>
                          </Item>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Payout Start Date</FieldLabel>
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
            name="scheduleType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Payout Schedule</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Schedule Type</SelectLabel>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {form.watch("scheduleType") == "WEEKLY" && (
            <Controller
              name="weeks"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Number of Weeks</FieldLabel>

                  <NumericFormat
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
          )}

          {form.watch("scheduleType") == "MONTHLY" && (
            <Controller
              name="months"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Number of months</FieldLabel>
                  <NumericFormat
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
          )}

          <Controller
            name="investedAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Amount Invested</FieldLabel>
                <FieldDescription>
                  Amount Customer invested to buy Tricycle.
                </FieldDescription>
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
            name="expectedReturn"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Expected Return</FieldLabel>
                <FieldDescription>
                  Amount Tricycle is sold in installment
                </FieldDescription>
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
            name="userId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Customer</FieldLabel>
                <Combobox
                  items={users}
                  itemToStringValue={(user: (typeof users)[number]) =>
                    user.label
                  }
                  onValueChange={(item) => field.onChange(item.value)}
                >
                  <ComboboxInput placeholder="Search users..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No users found.</ComboboxEmpty>
                    <ComboboxList>
                      {(user) => (
                        <ComboboxItem key={user.label} value={user}>
                          <Item size="xs" className="p-0">
                            <ItemContent>
                              <ItemTitle className="whitespace-nowrap">
                                {user.label}
                              </ItemTitle>
                            </ItemContent>
                          </Item>
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full cursor-pointer mt-4"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
