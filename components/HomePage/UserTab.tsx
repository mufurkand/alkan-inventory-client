import SearchBar from "../SearchBar";
import { Button } from "../ui/button";
import UserTable from "./UserTab/UserTable";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { SquarePlus } from "lucide-react";
import UserForm from "./UserTab/UserForm";
import { useAtom } from "jotai";
import { userSearchAtom } from "@/atoms/userSearch";

export default function UserTab() {
  const [isCreatePartDialogOpen, setIsCreatePartDialogOpen] = useState(false);
  const [userSearch, setUserSearch] = useAtom(userSearchAtom);

  function setSearch(search: string) {
    setUserSearch({ ...userSearch, search });
  }

  return (
    <div className="flex md:flex-row flex-col-reverse gap-5">
      <div className="overflow-y-auto basis-5/6 h-96">
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
        <Button variant="destructive">Tüm Kullanıcıları Sil</Button>
        <SearchBar setSearch={setSearch} placeholder="Kullanıcı ara" />
      </div>
    </div>
  );
}
