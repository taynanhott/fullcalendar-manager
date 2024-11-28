import { AlertTriangle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RemoveEventDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Alert({ isOpen, setIsOpen }: RemoveEventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-10/12 rounded-lg h-32">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Alert!
          </DialogTitle>
          <DialogDescription className="text-base">
            Please fill in all required fields before submitting the form.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
