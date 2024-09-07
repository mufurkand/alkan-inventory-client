import SearchBar from "../SearchBar";
import { Button, buttonVariants } from "../ui/button";
import UserTable from "./UserTab/UserTable";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import { useState } from "react";
import UserForm from "./UserTab/UserForm";
import { useAtom, useAtomValue } from "jotai";
import { userSearchAtom } from "@/atoms/userSearch";
import { authAtom } from "@/atoms/auth";
import { z } from "zod";

export default function UserTab() {
  const [isCreatePartDialogOpen, setIsCreatePartDialogOpen] = useState(false);
  const [userSearch, setUserSearch] = useAtom(userSearchAtom);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const auth = useAtomValue(authAtom);

  function setSearch(search: string) {
    setUserSearch({ ...userSearch, search });
  }

  async function handleDelete() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined.");
      return;
    }

    const url = new URL(process.env.NEXT_PUBLIC_API_URL + "/api/users/");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
      method: "DELETE",
    });
    const data = await response.json();
    const result = z.object({ count: z.number() }).safeParse(data);

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
    <div className="flex md:flex-row flex-col-reverse gap-5">
      <div className="overflow-y-auto md:basis-5/6 md:h-96 h-64">
        <UserTable />
      </div>
      <div className="flex flex-col gap-3">
        <Dialog
          open={isCreatePartDialogOpen}
          onOpenChange={setIsCreatePartDialogOpen}
        >
          <Button onClick={() => setIsCreatePartDialogOpen(true)}>
            Yeni Kullanıcı
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kullanıcı Kaydı Oluştur</DialogTitle>
              <DialogDescription>
                Buradan yeni bir kullanıcı kaydı oluşturabilirsiniz.
              </DialogDescription>
            </DialogHeader>
            <UserForm mode="POST" setIsOpen={setIsCreatePartDialogOpen} />
          </DialogContent>
        </Dialog>
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive" })}
          >
            Tüm Kullanıcıları Sil
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Kullanıcı kayıtları sunucularımızdan
                kalıcı olarak silinecektir. Mevcut oturumunuz sonlanana kadar
                hala işlem yapabilirsiniz.
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
        <SearchBar setSearch={setSearch} placeholder="Kullanıcı ara" />
      </div>
    </div>
  );
}
