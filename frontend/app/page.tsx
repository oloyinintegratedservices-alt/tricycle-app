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

const loginFormSchema = z.object({
  email: z.email("Email should be a valid email address"),
  password: z.string(),
});

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginFormSchema>) => {
      const res = await axios.post(`api/auth/login`, data, {
        withCredentials: true,
      });

      return res.data;
    },
    onSuccess: (data) => {
      // console.log(data);
      if (
        data?.user?.roles?.some((r: string) =>
          ["admin", "super_admin", "staff"].includes(r),
        )
      ) {
        router.replace("/admin/dashboard");
      } else if (
        data?.user?.roles?.every((r: string) => ["user"].includes(r))
      ) {
        router.replace("/user/dashboard");
      } else {
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans text-black">
      <div className="z-20 bg-white min-w-2xl rounded-s-md p-4">
        <div>
          <h2>Sign In</h2>
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

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type={showPassword ? "text" : "password"}
                        placeholder="*******"
                      />
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex justify-end underline">
                <Link href="/forgot-password">Forgot Password?</Link>
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full cursor-pointer"
              >
                Login
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
