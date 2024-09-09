"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImportForm from "./ImportForm";
import { useState } from "react";
import LoadingBanner from "@/components/LoadingBanner";

export default function ImportButton() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger
          className={buttonVariants({ variant: "default" }) + " w-full"}
        >
          <p>Excel Dosyası Yükle</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          {isSubmitting ? (
            <LoadingBanner message="Dosya işleniyor..." />
          ) : (
            <div className="flex flex-col gap-5">
              <DialogHeader>
                <DialogTitle>Dosya Yükle</DialogTitle>
                <DialogDescription>
                  Veritabanına bir Excel dosyası yükleyin.
                </DialogDescription>
              </DialogHeader>
              <ImportForm
                setIsSubmitting={setIsSubmitting}
                setIsImportDialogOpen={setIsImportDialogOpen}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
