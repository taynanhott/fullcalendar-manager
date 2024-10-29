"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface RemoveEventDialogProps {
    eventName: string;
    onConfirm: () => Promise<void>;
    isOpen: boolean;
    onClose: () => void;
}

export default function RemoveEventDialog({ eventName, onConfirm, isOpen, onClose }: RemoveEventDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="hidden">Remove Event</Button>
            </DialogTrigger>
            <DialogContent className="max-h-48 w-10/12 rounded-lg">
                <DialogHeader>
                    <DialogTitle>Remove Event</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to remove the event &quot;{eventName}&quot;? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" className="w-full" onClick={async () => { await onConfirm(); onClose(); }}>
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
