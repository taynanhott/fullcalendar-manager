import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardListIcon, Clock, FlagIcon, FolderIcon, Plus, RotateCcw, Trash } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "./scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import Hour from "./hour";
import PrioritySelector from "./priority";

export default function TaskCard({
    id,
    name = "Name Task",
    category = "Work",
    subcategory = "1h",
    variant = "list",
    className = "",
    selected = false,
    onSelect,
    onRemove,
}) {
    const handleButtonClick = () => {
        if (variant === "selected") {
            onRemove(id);
        } else {
            onSelect(id);
        }
    };

    return (
        <Card className={`w-full rounded-[16px] grid grid-cols-4 md:grid-cols-12 lg:grid-cols-12 bg-white cursor-pointer text-dark-task ${className} ${selected ? "border-blue-500/85" : ""}`}>
            <CardHeader className="py-2 col-span-3 md:col-span-11 lg:col-span-11">
                <CardTitle className="flex items-center gap-2">
                    <ClipboardListIcon className="h-5 w-5 hidden lg:flex" />
                    <span className="text-base">{name}</span>
                </CardTitle>
            </CardHeader>
            <div className="col-span-1 row-span-2">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className={`w-full rounded-r-[6px] hover:bg-dark-task flex items-center justify-center rounded-l-[0px] h-full ${variant === "selected" ? "bg-red-500/85" : "bg-blue-500/85"} text-white rounded`}
                >
                    {selected ? <RotateCcw /> : variant === "selected" ? <Trash /> : <Plus />}
                </button>
            </div>
            <CardContent className="py-0 lg:py-2 col-span-3 md:col-span-11 lg:col-span-11 mb-2">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="flex items-center gap-2 mb-2 lg:mb-0">
                        <PrioritySelector width={4} height={4} variant={variant} />
                    </div>
                    <div className="flex items-center gap-2">
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
    );
}

export function TaskList({ className = "", selectedTasks = [], setSelectedTasks }) {
    const [loading, setLoading] = useState(false);

    const onSubmit = ev => {
        ev.preventDefault();
    };

    const handleTaskSelect = (id) => {
        setSelectedTasks((prevSelectedTasks) =>
            prevSelectedTasks.includes(id)
                ? prevSelectedTasks.filter((taskId) => taskId !== id)
                : [...prevSelectedTasks, id]
        );
    };

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
                                            {["task-1", "task-2", "task-3", "task-4", "task-5"].map(taskId => (
                                                <TaskCard
                                                    key={taskId}
                                                    id={taskId}
                                                    className="hover:bg-task"
                                                    selected={selectedTasks.includes(taskId)}
                                                    onSelect={handleTaskSelect}
                                                />
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </ScrollArea>
                        </table>
                    </form>
                )}
            </div>
        </div>
    );
}

export function TaskTimeDialog({ selectedTasks, onSave, className }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddTask = () => {
        if (typeof onSave === 'function') {
            onSave(selectedTasks);
        }
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className={`${className} border h-8 bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full text-dark-task hover:text-task bg-task hover:bg-dark-task border-dark-task/40`}>
                <Plus className="mx-auto h-4 w-4 " />
            </DialogTrigger>
            <DialogContent className="bg-white w-96 rounded-[6px] mx-auto px-0">
                <DialogHeader>
                    <DialogTitle className="text-center">Select an hour</DialogTitle>
                    <DialogDescription className="text-center">
                        Choose an hour for your task.
                    </DialogDescription>
                </DialogHeader>
                <Hour className="w-36 mx-auto py-2" variant="fixed" />
                <Button type="button" className="mx-4" onClick={handleAddTask}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}

export function TaskListDialog({ selectedTasks, setSelectedTasks, onSave, className }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleAddTask = () => {
        if (typeof onSave === 'function') {
            onSave(selectedTasks);
        }
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* Use a prop open e onOpenChange para controlar o diálogo */}
            <DialogTrigger className={`${className} border h-8 bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full text-dark-task hover:text-task bg-task hover:bg-dark-task border-dark-task/40`}>
                <Plus className="h-4 w-4 " />
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[6px] mx-auto px-0 w-full max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-center">Task List</DialogTitle>
                </DialogHeader>
                <TaskList selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} />
                <Button type="button" className="mx-4" onClick={handleAddTask}>Save</Button>
            </DialogContent>
        </Dialog>
    );
}

