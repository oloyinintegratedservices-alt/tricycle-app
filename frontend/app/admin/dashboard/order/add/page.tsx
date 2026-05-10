"use client";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
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

const newOrderFormSchema = z
  .object({
    tricycleId: z.string().nonempty(),
    orderType: z.enum(["DIRECT_PURCHASE", "HIRE_PURCHASE"]),
    userId: z.string().nonempty(),

    scheduleType: z.enum(["WEEKLY", "MONTHLY"]).optional(),

    weeks: z.coerce.number<string>().int().positive().optional(),
    months: z.coerce.number<string>().int().positive().optional(),

    totalPrice: z.coerce.number<string>().positive().optional(),
    downPayment: z.coerce.number<string>().positive().optional(),

    startDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    // HIRE PURCHASE rules
    if (data.orderType === "HIRE_PURCHASE") {
      if (!data.startDate) {
        ctx.addIssue({
          path: ["startDate"],
          message: "Start date is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.scheduleType) {
        ctx.addIssue({
          path: ["scheduleType"],
          message: "Schedule type is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }

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
    resolver: zodResolver(newOrderFormSchema),
    defaultValues: {
      tricycleId: "",
      userId: "",
      orderType: "DIRECT_PURCHASE",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof newOrderFormSchema>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/order`,
        data,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: () => {
      // toast message
      toast.success("New order added successfully");
      form.reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof newOrderFormSchema>) {
    // console.log(values);

    let payload: any = {
      tricycleId: values.tricycleId,
      userId: values.userId,
      orderType: values.orderType,
      totalPrice: values.totalPrice,
    };

    if (values.orderType == "HIRE_PURCHASE") {
      payload = {
        ...payload,
        scheduleType: values.scheduleType,
        weeks: values.weeks,
        months: values.months,
        downPayment: values.downPayment,
        startDate: values.startDate?.toUTCString(),
      };
    }

    console.log(payload);
    mutation.mutate(payload);
  }

  const { data } = useQuery({
    queryKey: ["tricycles"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tricycle`,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
        {
          withCredentials: true,
        },
      );

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
      <h2 className="text-3xl font-bold">Create Order</h2>
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
                        <ComboboxItem
                          key={tricycle.label}
                          value={tricycle}
                          //   onSelect={() => {
                          //     form.setValue("tricycleId", tricycle.value);
                          //   }}
                        >
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
            name="orderType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Purchase Type</FieldLabel>
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
                      <SelectLabel>Order Type</SelectLabel>
                      <SelectItem value="DIRECT_PURCHASE">
                        Direct Purchase
                      </SelectItem>
                      <SelectItem value="HIRE_PURCHASE">
                        Hire Purchase
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {form.watch("orderType") == "HIRE_PURCHASE" && (
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Repayment Start Date
                  </FieldLabel>
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
          )}

          {form.watch("orderType") == "HIRE_PURCHASE" && (
            <Controller
              name="scheduleType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Repayment Schedule
                  </FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
          )}

          {form.watch("orderType") == "HIRE_PURCHASE" &&
            form.watch("scheduleType") == "WEEKLY" && (
              <Controller
                name="weeks"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Number of Weeks
                    </FieldLabel>

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

          {form.watch("orderType") == "HIRE_PURCHASE" &&
            form.watch("scheduleType") == "MONTHLY" && (
              <Controller
                name="months"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Number of months
                    </FieldLabel>
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
            name="totalPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Current Price</FieldLabel>
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

          {form.watch("orderType") == "HIRE_PURCHASE" && (
            <Controller
              name="downPayment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Down Payment</FieldLabel>
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
          )}

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
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
