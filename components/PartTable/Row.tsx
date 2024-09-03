"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SquarePen, Trash2 } from "lucide-react";
import { ImageOff } from "lucide-react";
import PartForm from "../PartForm";
import Link from "next/link";
import { Button } from "../ui/button";

import { useAtom } from "jotai";
import { filterAtom } from "@/atoms/search";
import { useState } from "react";
import { z } from "zod";
import partSchema from "@/lib/schemas/part";

// TODO: fetch only this row instead of the whole table when a part is updated
export default function Row({ part }: { part: z.infer<typeof partSchema> }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isBrokenImage, setIsBrokenImage] = useState(false);
  const [filter, setFilter] = useAtom(filterAtom);

  async function handleDelete() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined.");
      return;
    }

    const url = new URL(
      process.env.NEXT_PUBLIC_API_URL + "/api/parts/" + part.id
    );

    const response = await fetch(url, {
      method: "DELETE",
    });
    const data = await response.json();
    const result = partSchema.safeParse(data);

    if (!result.success) {
      console.error(result.error);
      console.error(result);
      return;
    }

    let selectedFilters = filter.selectedFilters;

    Object.entries(part).forEach(([key, value]) => {
      if (selectedFilters[key] === undefined) return;

      if (typeof value === "string" && selectedFilters[key].includes(value))
        selectedFilters[key] = selectedFilters[key].filter(
          (filter) => filter !== value
        );

      if (selectedFilters[key].length === 0) {
        delete selectedFilters[key];
      }
    });

    setIsAlertDialogOpen(false);
    setFilter({
      ...filter,
      selectedFilters,
      renderController: filter.renderController - 1,
    });
  }

  function handleBrokenImage() {
    setIsBrokenImage(true);
  }

  return (
    <TableRow className="odd:bg-zinc-200 dark:odd:bg-zinc-800" key={part.id}>
      <TableCell className="flex justify-center items-center">
        {isBrokenImage || part.imagePath === null ? (
          <div className="h-16 w-16 flex justify-center items-center">
            <ImageOff />
          </div>
        ) : (
          <Link
            target="_blank"
            href={process.env.NEXT_PUBLIC_API_URL + "/" + part.imagePath}
          >
            <div className="h-16 w-16 flex justify-center items-center">
              <img
                onError={handleBrokenImage}
                alt={"Part with number " + part.partNumber}
                src={process.env.NEXT_PUBLIC_API_URL + "/" + part.imagePath}
              />
            </div>
          </Link>
        )}
      </TableCell>
      <TableCell>{part.materialType}</TableCell>
      <TableCell>
        <p className="line-clamp-1">{part.partNumber}</p>
      </TableCell>
      <TableCell>{part.location ?? "-"}</TableCell>
      <TableCell>{part.price ?? "-"}</TableCell>
      <TableCell>{part.quantity ?? "-"}</TableCell>
      <TableCell>{part.channel ?? "-"}</TableCell>
      <TableCell>{part.caseType ?? "-"}</TableCell>
      <TableCell>{part.voltage ?? "-"}</TableCell>
      <TableCell>{part.current ?? "-"}</TableCell>
      <TableCell>{part.value ?? "-"}</TableCell>
      <TableCell>{part.unit ?? "-"}</TableCell>
      <TableCell>{part.power ?? "-"}</TableCell>
      <TableCell>
        <p className="line-clamp-1">{part.description ?? "-"}</p>
      </TableCell>
      <TableCell>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger>
            <SquarePen />
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle>Parça Kaydı Güncelle</SheetTitle>
              <SheetDescription>
                Parçanın herhangi bir bilgisini buradan güncelleyebilirsiniz.
              </SheetDescription>
            </SheetHeader>
            <PartForm
              part={part}
              mode="PATCH"
              setIsOpen={setIsSheetOpen}
              setIsBrokenImage={setIsBrokenImage}
            />
          </SheetContent>
        </Sheet>
      </TableCell>
      <TableCell>
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogTrigger>
            <Trash2 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Parça kaydı sunucularımızdan kalıcı
                olarak silinecektir.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDelete}>
                Devam
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
