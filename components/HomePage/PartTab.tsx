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
import ImportButton from "./PartTab/ImportButton";
import { Button, buttonVariants } from "../ui/button";
import { useAtom, useAtomValue } from "jotai";
import { authAtom } from "@/atoms/auth";
import { useState } from "react";
import { userSearchAtom } from "@/atoms/userSearch";
import { z } from "zod";

export default function PartTab() {
  const auth = useAtomValue(authAtom);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [userSearch, setUserSearch] = useAtom(userSearchAtom);

  async function handleDownload() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/parts/download",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "parts.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  async function handleDelete() {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined.");
      return;
    }

    const url = new URL(process.env.NEXT_PUBLIC_API_URL + "/api/parts/");

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
      <div className="md:basis-4/5">
        <p>
          Bir Excel dosyasını veritabanına eklemek için dosyanın spesifik bir
          formatta olması gerekir. Aşağıdaki sütun adlarına uyulmadığı takdirde
          veri yanlış yüklenebilir. Yıldızlı sütunlar zorunludur, geri kalan
          alanlar opsiyoneldir.
        </p>
        <br />
        <ul className="list-disc pl-10">
          <li>materialType (*) - Malzeme Türü</li>
          <li>partNumber (*) - Parça Numarası</li>
          <li>location - Parça Konumu</li>
          <li>price - Ücret</li>
          <li>quantity - Miktar</li>
          <li>channel - Kanal Tipi</li>
          <li>caseType - Kılıf Tipi</li>
          <li>voltage - Gerilim</li>
          <li>current - Akım</li>
          <li>value - Değer</li>
          <li>unit - Birim</li>
          <li>power - Güç</li>
          <li>description - Açıklama</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 md:basis-1/5">
        <Button onClick={handleDownload}>Excel Dosyasına Aktar</Button>
        <ImportButton />
        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogTrigger
            className={buttonVariants({ variant: "destructive" })}
          >
            Tüm Parçaları Sil
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Parça kayıtları sunucularımızdan kalıcı
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
      </div>
    </div>
  );
}
