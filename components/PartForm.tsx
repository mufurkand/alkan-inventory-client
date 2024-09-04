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

import partSchema from "@/lib/schemas/part";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ALLOWED_IMAGE_FILE_TYPES } from "@/lib/constants/acceptedFileTypes";
import { useAtom } from "jotai";
import { filterAtom } from "@/atoms/filter";
import { useState } from "react";
import { uniqueConstraintErrorSchema } from "@/lib/schemas/responses";
import { Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  materialType: z.string(),
  partNumber: z.string(),
  location: z.string(),
  price: z.string(),
  quantity: z.string(),
  channel: z.string(),
  caseType: z.string(),
  voltage: z.string(),
  current: z.string(),
  value: z.string(),
  unit: z.string(),
  power: z.string(),
  description: z.string(),
  image: (typeof window === "undefined"
    ? z.any()
    : z.instanceof(FileList)
  ).superRefine((files, ctx) => {
    if (files.length === 0) return;

    const fileExtension = files[0].name.split(".").pop();
    if (fileExtension && !ALLOWED_IMAGE_FILE_TYPES.includes(fileExtension))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dosya formatı PNG, JPEG veya JPG olmalı.",
      });
  }),
  updateImage: z.boolean(),
});

export default function PartForm({
  part,
  mode,
  setIsOpen,
  setIsBrokenImage,
}: {
  part?: z.infer<typeof partSchema>;
  mode: "POST" | "PATCH";
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBrokenImage?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialType: mode === "PATCH" ? part?.materialType : "",
      partNumber: mode === "PATCH" ? part?.partNumber ?? "" : "",
      location: mode === "PATCH" ? part?.location ?? "" : "",
      price: mode === "PATCH" ? part?.price ?? "" : "",
      quantity: mode === "PATCH" ? part?.quantity ?? "" : "",
      channel: mode === "PATCH" ? part?.channel ?? "" : "",
      caseType: mode === "PATCH" ? part?.caseType ?? "" : "",
      voltage: mode === "PATCH" ? part?.voltage ?? "" : "",
      current: mode === "PATCH" ? part?.current ?? "" : "",
      value: mode === "PATCH" ? part?.value ?? "" : "",
      unit: mode === "PATCH" ? part?.unit ?? "" : "",
      power: mode === "PATCH" ? part?.power ?? "" : "",
      description: mode === "PATCH" ? part?.description ?? "" : "",
      updateImage: false,
    },
  });
  const [filter, setFilter] = useAtom(filterAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    const formDataEntries = {
      materialType: values.materialType,
      partNumber: values.partNumber,
      location: values.location,
      price: values.price.toString(),
      quantity: values.quantity.toString(),
      channel: values.channel,
      caseType: values.caseType,
      voltage: values.voltage,
      current: values.current,
      value: values.value,
      unit: values.unit,
      power: values.power,
      description: values.description,
      image: values.image[0],
      updateImageJson: JSON.stringify({ updateImage: values.updateImage }),
    };

    Object.entries(formDataEntries).forEach(([key, value]) => {
      if (key !== "image" && value === "") return;
      if (key === "image" && value === undefined) return;
      if (key === "updateImageJson" && mode === "POST") return;
      formData.append(key, value);
    });

    let response: Response;
    let data: unknown;

    if (mode === "POST") {
      response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/parts", {
        method: mode,
        body: formData,
      });
      data = await response.json();
    } else {
      if (!part) return;

      response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/parts/${part.id}`,
        {
          method: mode,
          body: formData,
        }
      );
      data = await response.json();
    }

    const result = uniqueConstraintErrorSchema.safeParse(data);

    // unique constraint error
    if (result.success === true) {
      setIsSubmitting(false);
      form.setError("partNumber", {
        type: "manual",
        message: "Bu parça numarası zaten mevcut.",
      });
      form.setFocus("partNumber");
      return;
    }

    // no unique constraint error
    setIsSubmitting(false);
    setIsOpen(false);
    setFilter({
      ...filter,
      renderController: filter.renderController + 1,
    });

    if (setIsBrokenImage && values.image.length > 0)
      setTimeout(() => setIsBrokenImage(false), 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="materialType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Malzeme Tipi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parça numarası</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ücret</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adet</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kanal</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kılıf Tipi</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voltage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voltaj</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Akım</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Değer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birim</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="power"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Güç</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanım</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resim</FormLabel>
              <FormControl>
                <Input type="file" {...form.register("image")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === "PATCH" && (
          <FormField
            control={form.control}
            name="updateImage"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Resmi güncelle</FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {Object.keys(form.formState.errors).length !== 0 ? (
          <p className="text-red-500 text-sm">
            Formda hata var. Lütfen ilgili alanları kontrol edin.
          </p>
        ) : null}
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
