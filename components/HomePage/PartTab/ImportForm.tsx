"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ALLOWED_EXCEL_FILE_TYPES } from "@/lib/constants/acceptedFileTypes";
import { filterAtom } from "@/atoms/filter";
import { useAtom, useAtomValue } from "jotai";
import { authAtom } from "@/atoms/auth";

const formSchema = z.object({
  excel: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList)
  ).superRefine((files, ctx) => {
    if (files.length === 0) return;

    const fileExtension = files[0].name.split(".").pop();
    if (fileExtension && !ALLOWED_EXCEL_FILE_TYPES.includes(fileExtension))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dosya formatı XLS veya XLSX olmalı.",
      });
  }),
});

export default function ImportForm({
  setIsSubmitting,
  setIsImportDialogOpen,
}: {
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setIsImportDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [filter, setFilter] = useAtom(filterAtom);
  const auth = useAtomValue(authAtom);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    if (!values.excel || values.excel.length === 0)
      return form.setError("excel", {
        message: "Bir dosya yüklemeniz gerekiyor.",
      });

    setIsSubmitting(true);

    formData.append("excel", values.excel[0]);
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/parts/upload",
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    setFilter({ ...filter, renderController: filter.renderController + 1 });
    setIsImportDialogOpen(false);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="excel"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="file" {...form.register("excel")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Yükle</Button>
      </form>
    </Form>
  );
}
