import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardListIcon, Clock, FlagIcon, FolderIcon, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "./scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Input } from "./input";
import Hour from "./hour";

export default function TaskCard(
    {
        name = "Name Task",
        priority = "Medium",
        category = "Work",
        subcategory = "1h",
        variant = "list",
        className = ""
    }
) {
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'low':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'high':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    const getVariant = (variant) => {
        switch (variant.toLowerCase()) {
            case 'list':
                return ''
            case 'selected':
                return 'hidden'
            default:
                return ''
        }
    }

    return (
        <Card className={`w-full rounded-[16px] grid grid-cols-4 md:grid-cols-12 lg:grid-cols-12 bg-white cursor-pointer text-dark-task ${className}`}>
            <CardHeader className="py-2 col-span-3 md:col-span-11 lg:col-span-11">
                <CardTitle className="flex items-center gap-2">
                    <ClipboardListIcon className="h-5 w-5 hidden lg:flex" />
                    <span className="text-base">{name}</span>
                </CardTitle>
            </CardHeader>
            <div className="col-span-1 row-span-2">
                <button type="button" className={`w-full rounded-r-[6px] hover:bg-dark-task flex items-center justify-center rounded-l-[0px] h-full ${variant === "selected" ? "bg-red-500/85" : "bg-blue-500/85"} text-white rounded`}>
                    {variant === "selected" ? <Trash /> : <Plus />}
                </button>
            </div>
            <CardContent className="py-0 lg:py-2 col-span-3 md:col-span-11 lg:col-span-11 mb-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className={`flex items-center gap-2${getVariant(variant)}`}>
                        <FlagIcon className="h-4 w-4 hidden lg:flex" />
                        <span className="text-sm font-medium hidden lg:flex">Priority:</span>
                        <Badge variant="secondary" alt="Priority" className={`${getPriorityColor(priority)} mx-auto md:mx-0 lg:mx-0 text-white`}>
                            {priority}
                        </Badge>
                    </div>
                    <div className={`flex items-center gap-2 ${getVariant(variant)}`}>
                        <FolderIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Category:</span>
                        <span className="text-sm">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm">{subcategory}</span>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}

export function TaskList({ className = "" }) {
    const [loading, setLoading] = useState(false);

    const onSubmit = ev => {
        ev.preventDefault();
    }

    return (
        <div className={`${className} w-full pr-0 lg:pr-4`}>
            <div>
                {loading && (
                    <div className="text-center my-auto font-bold">Loading...</div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <table className="w-full">
                            <ScrollArea className="h-[450px] w-full rounded-md border p-4">
                                <tbody>
                                    <tr>
                                        <td className="text-center grid gap-2">
                                            <TaskCard className="hover:bg-task" />
                                            <TaskCard className="hover:bg-task" />
                                            <TaskCard className="hover:bg-task" />
                                            <TaskCard className="hover:bg-task" />
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
    )
}
export function TaskTimeDialog({ className }) {
    return (
        <Dialog>
            <DialogTrigger className={`${className} border h-8 bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full text-dark-task hover:text-task bg-task hover:bg-dark-task border-dark-task/40`}>
                <Plus className="mx-auto h-4 w-4 " />
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[6px] mx-auto px-0">
                <DialogHeader>
                    <DialogTitle className="text-center">Select a hour</DialogTitle>
                </DialogHeader>
                <Hour />
                <Button type="button" className="mx-4">Save</Button>
            </DialogContent>
        </Dialog>
    )
}

export function TaskLiastDialog({ className }) {
    return (
        <Dialog>
            <DialogTrigger className={`${className} border h-8 bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full text-dark-task hover:text-task bg-task hover:bg-dark-task border-dark-task/40`}>
                <Plus className="h-4 w-4 " />
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[6px] mx-auto px-0 w-full max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-center">Task's</DialogTitle>
                </DialogHeader>
                <TaskList />
                <Hour className="bg-red-900" variant="fixed"/>
                <Button type="button" className="mx-4">Save</Button>
            </DialogContent>
        </Dialog>
    )
}