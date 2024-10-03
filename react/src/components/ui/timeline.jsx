
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import TaskCard, { TaskListDialog, TaskTimeDialog } from "@/components/ui/task";
import { useState } from "react";

export default function Timeline({ className = "", date, day }) {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [tasksInTimeline, setTasksInTimeline] = useState([]);
    const dayDate = date.clone().date(day);

    const handleAddTaskToTimeline = (newTasks) => {
        setTasksInTimeline(prevTasks => [...prevTasks, ...newTasks]); // Adiciona novas tarefas à timeline
    };

    return (
        <AccordionItem value={`item-${day - 1}`} className={className}>
            <AccordionTrigger className="text-dark-task">
                {dayDate.format('dddd - DD/MM/YYYY')}
            </AccordionTrigger>
            <AccordionContent>
                {tasksInTimeline.length > 0 ? (
                    tasksInTimeline.map((task, index) => (
                        <div className="flex flex-col lg:flex-row items-center justify-between p-2 hover:bg-task rounded-[6px] mb-2">

                            <div key={index} className="flex w-full">
                                <div className="w-full lg:w-1/4 text-center text-dark-task mb-2">01h00 ~ 02h00</div>
                                <div className="w-full lg:w-3/4">
                                    <TaskCard key={task.id} {...task} variant="selected" className="hover:border-dark-task/50" />
                                </div>
                            </div>
                        </div>))
                ) : (
                    <p>No tasks added</p>
                )}
                <TaskTimeDialog selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} className="hidden lg:block" />
                <TaskListDialog
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                    onSave={handleAddTaskToTimeline} // Passa o callback como prop
                    className="block lg:hidden"
                />
            </AccordionContent>
        </AccordionItem>
    );
}
