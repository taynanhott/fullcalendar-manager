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
import { EventApi } from "fullcalendar/index.js";

type SideOptions = 'left' | 'right' | 'bottom' | 'top';

interface RemoveEventDialogProps {
    event: EventApi | null
    onConfirm: () => Promise<void>;
    isSheetOpen: boolean;
    sheetSide: SideOptions;
    setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
    handleEventEdit: (event: EventApi, title: string, start: string, end: string, allDay: boolean, finish: boolean, color: string) => void
}

export default function ManageEventDialog({ onConfirm, isSheetOpen, sheetSide, setIsSheetOpen, handleEventEdit, event }: RemoveEventDialogProps) {
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
                        Event: {event ? event.title : ""}
                    </SheetDescription>
                    <FormEvent handleEventEdit={handleEventEdit} event={event} />
                    <Button variant="destructive" className="w-full mt-2" onClick={async () => { await onConfirm(); setIsSheetOpen(false); }}>
                        Remove
                    </Button>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
