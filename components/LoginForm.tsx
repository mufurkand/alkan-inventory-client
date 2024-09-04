"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { loginResponseSchema } from "@/lib/schemas/responses";
import { useSetAtom } from "jotai";
import { authAtom } from "@/atoms/auth";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Kullanıcı adı en az 2 karakter olmalıdır.",
  }),
  password: z.string().min(8, {
    message: "Şifre en az 8 karakter olmalıdır.",
  }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useSetAtom(authAtom);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/auth/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(values),
      }
    );
    const data = await response.json();
    const result = loginResponseSchema.safeParse(data);

    if (!result.success) {
      form.setError("root", {
        message: "Kullanıcı adı veya şifre hatalı.",
      });
      setIsSubmitting(false);
      console.log(form.formState.errors);
      return;
    }

    setAuth(result.data.user);
    localStorage.setItem("token", result.data.token);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kullanıcı Adı</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root !== undefined ? (
          <p className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <p>
          Hesabınız yok mu?{" "}
          <Link className="underline" href="/parts">
            Misafir girişini
          </Link>{" "}
          deneyin.
        </p>
        {isSubmitting ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Lütfen bekleyin
          </Button>
        ) : (
          <Button type="submit">Giriş Yap</Button>
        )}
      </form>
    </Form>
  );
}
