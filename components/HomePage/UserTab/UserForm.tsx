"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { authAtom } from "@/atoms/auth";
import userSchema from "@/lib/schemas/user";
import { userSearchAtom } from "@/atoms/userSearch";

// TODO: combobox for role

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Kullanıcı adı en az 2 karakter olmalıdır.",
  }),
  role: z.string(),
  password: z.string().min(8, {
    message: "Şifre en az 8 karakter olmalıdır.",
  }),
  updatePassword: z.boolean(),
});

export default function UserForm({
  user,
  mode,
  setIsOpen,
}: {
  user?: z.infer<typeof userSchema>;
  mode: "POST" | "PATCH";
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: mode === "PATCH" ? user?.username : "",
      role: mode === "PATCH" ? user?.role ?? "" : "",
      password: "",
      updatePassword: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAtomValue(authAtom);
  const [userSearch, setUserSearch] = useAtom(userSearchAtom);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    let response: Response;
    let data: unknown;

    const formData = new FormData();
    const formDataEntries = {
      username: values.username,
      role: values.role,
      password: values.password,
    };

    Object.entries(formDataEntries).forEach(([key, value]) => {
      if (value === "") return;
      if (key === "password" && !values.updatePassword && mode === "PATCH")
        return;
      formData.append(key, value);
    });

    if (mode === "POST") {
      response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/users", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        method: mode,
        body: formData,
      });
      data = await response.json();
    } else {
      if (!user) return;

      response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
          method: mode,
          body: formData,
        }
      );
      data = await response.json();
    }

    setIsSubmitting(false);
    setIsOpen(false);
    setUserSearch({
      ...userSearch,
      renderController: userSearch.renderController + 1,
    });
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rolü</FormLabel>
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
        {mode === "PATCH" && (
          <FormField
            control={form.control}
            name="updatePassword"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Şifreyi güncelle</FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isSubmitting ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Lütfen bekleyin
          </Button>
        ) : (
          <Button type="submit">
            {mode === "PATCH" ? "Güncelle" : "Oluştur"}
          </Button>
        )}
      </form>
    </Form>
  );
}
