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

import partSchema from "@/lib/schemas/part";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ACCEPTED_FILE_TYPES from "@/lib/constants/acceptedFileTypes";
import { useAtom } from "jotai";
import { filterAtom } from "@/atoms/search";

const formSchema = z.object({
  materialType: z.string(),
  partNumber: z.string(),
  location: z.string(),
  price: z.union([z.string(), z.number()]).transform((val, ctx) => {
    const parsed = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bir sayı girin.",
      });

      return z.NEVER;
    }
    return parsed;
  }),
  quantity: z.union([z.string(), z.number()]).transform((val, ctx) => {
    const parsed = typeof val === "string" ? parseInt(val) : val;
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bir sayı girin.",
      });

      return z.NEVER;
    }
    return parsed;
  }),
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
    if (fileExtension && !ACCEPTED_FILE_TYPES.includes(fileExtension))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dosya formatı PNG, JPEG veya JPG olmalı.",
      });
  }),
});

export default function PartForm({
  part,
  mode,
  setIsSheetOpen,
}: {
  part?: z.infer<typeof partSchema>;
  mode: "POST" | "PATCH";
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialType: mode === "PATCH" ? part?.materialType : "",
      partNumber: mode === "PATCH" ? part?.partNumber : "",
      location: mode === "PATCH" ? part?.location : "",
      price: mode === "PATCH" ? part?.price ?? 0 : 0,
      quantity: mode === "PATCH" ? part?.quantity ?? 0 : 0,
      channel: mode === "PATCH" ? part?.channel ?? "" : "",
      caseType: mode === "PATCH" ? part?.caseType ?? "" : "",
      voltage: mode === "PATCH" ? part?.voltage ?? "" : "",
      current: mode === "PATCH" ? part?.current ?? "" : "",
      value: mode === "PATCH" ? part?.value ?? "" : "",
      unit: mode === "PATCH" ? part?.unit ?? "" : "",
      power: mode === "PATCH" ? part?.power ?? "" : "",
      description: mode === "PATCH" ? part?.description ?? "" : "",
    },
  });
  const [filter, setFilter] = useAtom(filterAtom);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSheetOpen(false);

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
    };

    Object.entries(formDataEntries).forEach(([key, value]) => {
      if (key !== "image" && value === "") return;
      if (key === "image" && value === undefined) return;
      formData.append(key, value);
    });

    let response: Response;
    let data: unknown;

    if (mode === "POST") {
      return;
    }

    if (!part) return;

    response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/parts/${part.id}`,
      {
        method: "PATCH",
        body: formData,
      }
    );
    data = await response.json();

    setFilter({
      ...filter,
      renderController: filter.renderController + 1,
    });
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
        <Button type="submit">
          {mode === "PATCH" ? "Güncelle" : "Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
