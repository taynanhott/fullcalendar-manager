
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import TaskCard, { TaskLiastDialog, TaskTimeDialog } from "@/components/ui/task";
import { Button } from "./button";
import { Plus } from "lucide-react";

export default function Timeline({ className = "" }) {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-dark-task" >Monday - 01/10/2024</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col lg:flex-row items-center justify-between p-2 hover:bg-task rounded-[6px] mb-2">
                        <div className="w-full lg:w-1/4 text-center text-dark-task mb-2">01h00 ~ 02h00</div>
                        <div className="w-full lg:w-3/4">
                            <TaskCard variant="selected" className="hover:border-dark-task/50" />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between p-2 hover:bg-task rounded-[6px] mb-2">
                        <div className="w-full lg:w-1/4 text-center text-dark-task mb-2">03h00</div>
                        <div className="w-full lg:w-3/4">
                            <TaskCard variant="selected" className="hover:border-dark-task/50" />
                        </div>
                    </div>
                    <TaskTimeDialog className="hidden lg:block" />
                    <TaskLiastDialog className="block lg:hidden" />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}