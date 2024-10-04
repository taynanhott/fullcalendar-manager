import { TaskList } from "@/components/ui/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import Timeline from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";
import { useState } from "react";
import moment from "moment";
import { Accordion } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

export default function Cronogram() {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [month, setMonth] = useState(moment());
    const [selectAll, setSelectAll] = useState(false);
    const [weekends, setWeekends] = useState(true);
    const [checkedItems, setCheckedItems] = useState({});
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
                    <div className="flex items-center mt-2 gap-2">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                        <p>Select All</p>
                        <Checkbox checked={weekends} onCheckedChange={handleWeekendChange} />
                        <p>No Weekends</p>
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
                                                <Checkbox
                                                    className="mt-[18px]"
                                                    checked={checkedItems[day] || false}
                                                    onCheckedChange={() => handleCheckboxChange(day)}
                                                />
                                                <Timeline
                                                    className="w-full"
                                                    selectedTasks={selectedTasks}
                                                    setSelectedTasks={setSelectedTasks}
                                                    date={month}
                                                    day={day}
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
