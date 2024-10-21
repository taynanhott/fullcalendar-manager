import { TaskList, TaskListDialog, TaskTimeDialog } from "@/components/ui/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import Timeline from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";
import { useState } from "react";
import moment from "moment";
import { Accordion } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export default function Cronogram() {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [month, setMonth] = useState(moment());
    const [selectAll, setSelectAll] = useState(false);
    const [weekends, setWeekends] = useState(true);
    const [checkedItems, setCheckedItems] = useState({});
    const [multipleSelect, setMultipleSelect] = useState(false);
    const screenHeight = window.innerHeight;
    const daysInMonth = month.daysInMonth();

    const handleChangeMonth = (direction) => {
        switch (direction) {
            case 'next':
                setMonth(prevMonth => prevMonth.clone().add(1, 'month'));
                break;
            case 'previous':
                setMonth(prevMonth => prevMonth.clone().subtract(1, 'month'));
                break;
            default:
                break;
        }
    };

    const handleSwitch = () => {
        setMultipleSelect(!multipleSelect);
    }

    const handleSelectAll = () => {
        const newCheckedItems = {};
        Array.from({ length: daysInMonth }).forEach((_, index) => {
            newCheckedItems[index + 1] = !selectAll;
        });
        setCheckedItems(newCheckedItems);
        setSelectAll(!selectAll);
    };

    const handleCheckboxChange = (day) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [day]: !prevState[day],
        }));
    };

    const handleWeekendChange = () => {
        setWeekends(!weekends);
    };

    const handleSelectTask = (task) => {
        setSelectedTasks(prevTasks => {
            // Verifica se a tarefa já está selecionada
            if (prevTasks.includes(task)) {
                // Remove a tarefa se ela já estiver selecionada (desselecionar)
                return prevTasks.filter(t => t !== task);
            }
            // Adiciona a nova tarefa
            return [...prevTasks, task];
        });
    };
    return (
        <div
            className="text-dark-task max-w-7xl mx-auto bg-white rounded-[6px] p-4 mt-4 shadow-xl flex flex-col lg:flex-row"
            style={{ height: `${screenHeight * .8}px` }}
        >
            <TaskList selectedTasks={selectedTasks} setSelectedTasks={setSelectedTasks} className="hidden lg:block lg:w-1/2" />
            <div className="w-full lg:w-1/2 pl-0 lg:pl-4 mt-4 lg:mt-0 h-full lg:h-auto lg:min-h-[435px]">
                <form className="w-full h-full">
                    <div className="flex justify-between items-center">
                        <div><Button onClick={() => handleChangeMonth('previous')} type="button" className="font-bold"><ChevronsLeft /></Button></div>
                        <label className="font-bold">{month.format('MMMM YYYY')}</label>
                        <div><Button onClick={() => handleChangeMonth('next')} type="button" className="font-bold"><ChevronsRight /></Button></div>
                    </div>
                    <div className={`flex ${multipleSelect ? "justify-between" : "justify-end"}`}>
                        {
                            multipleSelect ?
                                <div className="flex text-nowrap items-center mt-2 gap-2 md:border-dark-task/40 md:border md:rounded-[6px] lg:border-dark-task/40 lg:border lg:rounded-[6px] py-2 md:px-2 lg:px-2 w-full md:w-[350px] lg:w-[350px]">
                                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                                    <p>Select All</p>
                                    <Checkbox checked={weekends} onCheckedChange={handleWeekendChange} />
                                    <p>No Weekends</p>
                                    <TaskTimeDialog
                                        selectedTasks={selectedTasks}  // Certifique-se que o estado está sendo passado corretamente
                                        className="hidden lg:block"
                                    />
                                    <TaskListDialog
                                        selectedTasks={selectedTasks}  // Aqui também
                                        className="block lg:hidden"
                                    />
                                </div> : <></>
                        }

                        <div className="flex justify-center items-center gap-2 mt-2 py-2">
                            <Switch className="" onCheckedChange={handleSwitch} />
                            <p>Multiple Select</p>
                        </div>
                    </div>
                    <ScrollArea className="w-full rounded-md border px-4 mt-2" style={{ height: `${screenHeight * .60}px` }}>
                        <Accordion type="multiple" collapsible>
                            {Array.from({ length: daysInMonth }, (_, index) => {
                                const day = index + 1;
                                const isWeekend = moment(month).date(day).day() === 0 || moment(month).date(day).day() === 6;

                                return (
                                    <div className="flex items-start gap-2" key={day}>
                                        {(!weekends || !isWeekend) && (
                                            <>
                                                {
                                                    multipleSelect ?
                                                        <Checkbox
                                                            className="mt-[18px]"
                                                            checked={checkedItems[day] || false}
                                                            onCheckedChange={() => handleCheckboxChange(day)}
                                                        /> : <></>
                                                }
                                                <Timeline
                                                    className="w-full"
                                                    selectedTasks={selectedTasks}
                                                    setSelectedTasks={setSelectedTasks}
                                                    date={month}
                                                    day={day}
                                                    multipleSelect={multipleSelect}
                                                    checkedItems={checkedItems}
                                                />
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </Accordion>
                    </ScrollArea>
                </form>
            </div>
        </div>
    );
}
