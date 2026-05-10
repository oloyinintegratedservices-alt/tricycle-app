"use client";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";

const newTricycleFormSchema = z.object({
  model: z.string(),
  chasisNumber: z.string(),
  engineNumber: z.string(),
  color: z.string(),
  purchasePrice: z.coerce.number<string>(),
  salePrice: z.coerce.number<string>(),
});

const Page = () => {
  const form = useForm({
    resolver: zodResolver(newTricycleFormSchema),
    defaultValues: {
      model: "",
      chasisNumber: "",
      engineNumber: "",
      color: "",
      purchasePrice: "",
      salePrice: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof newTricycleFormSchema>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tricycle`,
        data,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: () => {
      // toast message
      toast.success("New Tricycle added successfully");
      form.reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof newTricycleFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <div>
      <h2 className="text-3xl font-bold">Add Tricyle</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 mt-4">
          <Controller
            name="model"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Brand Name</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="chasisNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Chasis Number</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="engineNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Engine Number</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="color"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Color</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="purchasePrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Purchase Price</FieldLabel>
                <NumericFormat
                  thousandSeparator
                  allowNegative={false}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue);
                  }}
                  className="p-3 py-1 border outline-0 w-full rounded-xl focus:shadow-md"

                  // className="border p-3 py-2 w-full rounded-md"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="salePrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Sales Price</FieldLabel>
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
