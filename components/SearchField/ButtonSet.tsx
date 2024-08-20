import { SquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import PartForm from "../PartForm";

export default function ButtonSet() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  async function handleAddPart() {}

  return (
    <div>
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
