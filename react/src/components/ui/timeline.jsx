
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import TaskCard, { TaskListDialog, TaskTimeDialog } from "@/components/ui/task";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Timeline({ className = "", date, day, selectedTasks, setSelectedTasks }) {
    const [tasksInTimeline, setTasksInTimeline] = useState([]);

    const dayDate = date.clone().date(day);
    const month = date.month();

    const handleAddTaskToTimeline = (newTasks) => {
        const tasksWithIds = newTasks.map(task => ({
            ...task,
            id: uuidv4()
        }));
        setTasksInTimeline(prevTasks => [...prevTasks, ...tasksWithIds]);
    };

    const handleRemoveTaskFromTimeline = (taskId) => {
        setTasksInTimeline(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    return (
        <AccordionItem value={`day-${day}-month-${month}`} className={className}>
            <AccordionTrigger className="text-dark-task flex">
                {dayDate.format('dddd - DD/MM/YYYY')}
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex flex-col p-2 hover:bg-task rounded-[6px] mb-2">
                    {tasksInTimeline.length > 0 ? (
                        tasksInTimeline.map((task) => (
                            <div key={task} className="lg:flex w-full mb-2">
                                <div className="w-full lg:w-1/4 text-center text-dark-task mb-2">01h00 ~ 02h00</div>
                                <div className="w-full lg:w-3/4">
                                    <TaskCard
                                        key={task.id}
                                        id={task.id}
                                        name={task.name}
                                        category={task.category}
                                        subcategory={task.subcategory}
                                        variant="selected"
                                        onRemove={() => handleRemoveTaskFromTimeline(task.id)}
                                        className="hover:border-dark-task/50"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center font-bold pointer-events-none">No tasks added</p>
                    )}
                </div>

                <TaskTimeDialog
                    selectedTasks={selectedTasks}
                    onSave={handleAddTaskToTimeline}
                    className="hidden lg:block"
                />
                <TaskListDialog
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                    onSave={handleAddTaskToTimeline}
                    className="block lg:hidden"
                />
            </AccordionContent>
        </AccordionItem>
    );

}

