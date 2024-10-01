import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.jsx";
import TaskCard from "@/components/ui/task";
import { ScrollArea } from "@/components/ui/scroll-area"
import Timeline from "@/components/ui/timeline";

export default function Cronogram() {

    const [loading, setLoading] = useState(false);

    const onSubmit = ev => {
        ev.preventDefault();
    }

    return (
        <div className="max-w-7xl min-h-[435px] mx-auto bg-white rounded-[6px] p-4 mt-4 shadow-xl flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 pr-0 lg:pr-4">
                <div className="flex justify-between items-center">
                    <h1 className="mb-2 font-bold text-lg text-dark-task">My Cronogram</h1>
                </div>
                <div>
                    {loading && (
                        <div className="text-center my-auto font-bold">Loading...</div>
                    )}
                    {!loading && (
                        <form onSubmit={onSubmit}>
                            <table className="w-full">
                                <ScrollArea className="h-[385px] w-full rounded-md border p-4">
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <TaskCard className="hover:bg-task" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </ScrollArea>
                            </table>
                        </form>
                    )}
                </div>
            </div>
            <div className="w-full lg:w-1/2 pl-0 lg:pl-4 mt-4 lg:mt-0 h-[435px]">
                <form>
                    <div className="w-full">
                        <label>Duration</label>
                        <ScrollArea className="h-[350px] w-full rounded-md border px-4 mt-2">
                            <Timeline />
                        </ScrollArea>
                    </div>
                </form>
            </div>
        </div >
    )
}
