import { Moon, SquarePlus, Sun } from "lucide-react";
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

export default function ButtonSet() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setTheme } = useTheme();

  async function handleAddPart() {}

  return (
    // Theme Switcher Button
    <div className="flex gap-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Sun className="dark:hidden" />
            <Moon className="hidden dark:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Part Record Create Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button onClick={() => setIsDialogOpen(true)}>
          <SquarePlus />
        </Button>
        <DialogContent className="overflow-y-auto h-3/4">
          <DialogHeader>
            <DialogTitle>Parça Kaydı Oluştur</DialogTitle>
            <DialogDescription>
              Buradan yeni bir parça kaydı oluşturabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <PartForm mode="POST" setIsOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
