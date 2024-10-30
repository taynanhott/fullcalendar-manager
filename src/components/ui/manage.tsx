import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import FormEvent from "./formEvent";

type SideOptions = 'left' | 'right' | 'bottom' | 'top';

interface RemoveEventDialogProps {
    id: number;
    eventName: string;
    onConfirm: () => Promise<void>;
    isSheetOpen: boolean;
    sheetSide: SideOptions;
    setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
    handleEventCreate: (title: string, start: string, end: string, allDay: boolean, repeats: number) => void;
}

export default function ManageEventDialog({ eventName, onConfirm, isSheetOpen, sheetSide, setIsSheetOpen, handleEventCreate, id }: RemoveEventDialogProps) {
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button className="hidden w-full mt-4 bg-[#2c3e50]" type="button">
                    Manage your Event
                </Button>
            </SheetTrigger>
            <SheetContent side={sheetSide} className="z-[9999]">
                <SheetHeader>
                    <SheetTitle>Manage your Event</SheetTitle>
                    <SheetDescription>
                        Event: {eventName}
                    </SheetDescription>
                    <FormEvent handleEventCreate={handleEventCreate} id={id} />
                    <Button variant="destructive" className="w-full mt-2" onClick={async () => { await onConfirm(); setIsSheetOpen(false); }}>
                        Remove
                    </Button>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
