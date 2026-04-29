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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const editUserFormSchema = z.object({
  fullname: z.string(),
  email: z.email(),
  phone: z.string(),
});

const EditUser = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      ...user,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      toast.success("user details has been updated successfully");

      const res = await axios.patch(
        `http://localhost:3002/api/user`,
        {
          id: user.id,
          ...data,
        },
        { withCredentials: true },
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
          <DialogTitle>Edit Customer Details</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Controller
              name="fullname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
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

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full cursor-pointer"
            >
              {mutation.isPending ? <Spinner /> : "Save customer Details"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
