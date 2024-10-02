import { TaskList } from "@/components/ui/task";
import { ScrollArea } from "@/components/ui/scroll-area"
import Timeline from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

export default function Cronogram() {
    return (
        <div className="text-dark-task max-w-7xl h-[485px] mx-auto bg-white rounded-[6px] p-4 mt-4 shadow-xl flex flex-col lg:flex-row">
            <TaskList className="hidden lg:block lg:w-1/2" />
            <div className="w-full lg:w-1/2 pl-0 lg:pl-4 mt-4 lg:mt-0 h-full lg:h-auto lg:min-h-[435px]">
                <form className="w-full h-full">
                    <div className="flex justify-between items-center">
                        <div><Button type="button" className="font-bold"><ChevronsLeft /></Button></div>
                        <label className="font-bold">October/2024</label>
                        <div><Button type="button" className="font-bold"><ChevronsRight /></Button></div>
                    </div>
                    <ScrollArea className="h-[400px] w-full rounded-md border px-4 mt-2 overflow-auto">
                        <Timeline />
                        <Timeline />
                        <Timeline />
                    </ScrollArea>
                </form>
            </div>
        </div>

    )
}
