"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, MailIcon } from "lucide-react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const forgotPasswordFormSchema = z.object({
  email: z.email("Email should be a valid email address"),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof forgotPasswordFormSchema>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/forgot-password`,
        data,
        {
          withCredentials: true,
        },
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Please check your email for reset password link");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
      <div className="z-20 bg-white min-w-2xl rounded-s-md p-4">
        <div>
          <h2>Forgot Password </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 mt-4">
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
                        placeholder="xyz@email.com"
                      />
                      <InputGroupAddon align="inline-end">
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex justify-end underline">
                <Link href="/">Login</Link>
              </div>
              <Button
                type="submit"
                // disabled={mutation.isPending}
                className="w-full cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute z-10 h-2/3 w-full left-0 bottom-0">
        <Image src="/auth-bg.png" alt="Background" fill priority />
      </div>
    </div>
  );
}
