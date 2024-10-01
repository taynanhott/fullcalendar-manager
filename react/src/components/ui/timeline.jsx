
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import TaskCard from "@/components/ui/task";
import { Button } from "./button";
import { Plus } from "lucide-react";

export default function Timeline() {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-dark-task" >01/10/2024</AccordionTrigger>
                <AccordionContent>
                    <div className="flex justify-between p-2 hover:bg-task rounded-[6px] mb-2">
                        <div className="w-3/12 text-dark-task">01h00 ~ 02h00</div>
                        <div className="w-9/12">
                            <TaskCard variant="selected" className="hover:border-dark-task/50" />
                            <TaskCard variant="selected" className="hover:border-dark-task/50" />
                        </div>
                    </div>
                    <Button type="button" variant="outline" className="w-full text-dark-task hover:text-task bg-task hover:bg-dark-task border-dark-task/40">
                        <Plus className="h-4 w-4 " />
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}