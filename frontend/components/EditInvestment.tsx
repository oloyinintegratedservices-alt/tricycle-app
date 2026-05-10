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

const editInvestmentFormSchema = z.object({
  status: z.string(),
});

const INVESTMENT_STATUSES = ["ACTIVE", "COMPLETED", "DEFAULTED"];

const EditInvestment = ({ investment }: { investment: any }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(editInvestmentFormSchema),
    defaultValues: {},
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      toast.success("Investment details has been updated successfully");

      const res = await axios.patch(`/api/investment`, {
        id: investment.id,
        ...data,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: any) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-8 w-8 flex justify-center items-center rounded-md p-0 border-2 border-gray-200">
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] min-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Investment Details</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <SelectValue placeholder="Select investment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {INVESTMENT_STATUSES.map((value) => (
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
              {mutation.isPending ? <Spinner /> : "Save investment Details"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvestment;
