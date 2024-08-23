import { Moon, SquarePlus, Sun, CloudDownload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import PartForm from "../PartForm";
import { useTheme } from "next-themes";
import ImportButton from "./ButtonSet/ImportButton";

export default function ButtonSet() {
  const [isCreatePartDialogOpen, setIsCreatePartDialogOpen] = useState(false);
  const { setTheme } = useTheme();

  async function handleDownload() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/parts/download"
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

  return (
    // theme switcher button
    <div className="flex gap-5 justify-between md:mr-0 mr-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Sun className="dark:hidden" />
            <Moon className="hidden dark:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Aydınlık
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Karanlık
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            Sistem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* export button */}
      <Button onClick={handleDownload}>
        <CloudDownload />
      </Button>
      {/* import button */}
      <ImportButton />
      {/* part record create button */}
      <Dialog
        open={isCreatePartDialogOpen}
        onOpenChange={setIsCreatePartDialogOpen}
      >
        <Button onClick={() => setIsCreatePartDialogOpen(true)}>
          <SquarePlus />
        </Button>
        <DialogContent className="overflow-y-auto h-3/4">
          <DialogHeader>
            <DialogTitle>Parça Kaydı Oluştur</DialogTitle>
            <DialogDescription>
              Buradan yeni bir parça kaydı oluşturabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <PartForm mode="POST" setIsOpen={setIsCreatePartDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
