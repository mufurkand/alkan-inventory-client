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
import { Button } from "@/components/ui/button";

import userSchema from "@/lib/schemas/user";
import { z } from "zod";
import { useState } from "react";
import UserForm from "../UserForm";
import { useAtom, useAtomValue } from "jotai";
import { authAtom } from "@/atoms/auth";
import { userSearchAtom } from "@/atoms/userSearch";

// TODO: fetch only this row instead of the whole table when a part is updated
export default function Row({ user }: { user: z.infer<typeof userSchema> }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const auth = useAtomValue(authAtom);
  const [userSearch, setUserSearch] = useAtom(userSearchAtom);

  async function handleDelete() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined.");
      return;
    }

    const url = new URL(
      process.env.NEXT_PUBLIC_API_URL + "/api/users/" + user.id
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
      method: "DELETE",
    });
    const data = await response.json();
    const result = userSchema.safeParse(data);

    if (!result.success) {
      console.error(result.error);
      console.error(result);
      return;
    }

    setIsAlertDialogOpen(false);
    setUserSearch({
      ...userSearch,
      renderController: userSearch.renderController + 1,
    });
  }
  return (
    <TableRow className="odd:bg-zinc-200 dark:odd:bg-zinc-800" key={user.id}>
      <TableCell>{user.username}</TableCell>
      <TableCell>{user.role ?? "-"}</TableCell>
      <TableCell>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger>
            <SquarePen />
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader className="mb-5">
              <SheetTitle>Kullanıcı Kaydı Güncelle</SheetTitle>
              <SheetDescription>
                Kullanıcının herhangi bir bilgisini buradan
                güncelleyebilirsiniz.
              </SheetDescription>
            </SheetHeader>
            <UserForm mode="PATCH" setIsOpen={setIsSheetOpen} user={user} />
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
                Bu işlem geri alınamaz. Kullanıcı kaydı sunucularımızdan kalıcı
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
